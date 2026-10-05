#!/usr/bin/env python3
"""Append missing legacy blog redirects to the Cloudflare bulk redirect list.

Replaces the old flow of editing BLOG_SLUGS inside
cloudflare-worker/redirects-worker/index.js and redeploying the worker.
STAGED FLOW: the worker is STILL ROUTED today; after the approved cutover it
is unrouted (kept for rollback) and this script is the publish flow.

Usage (from repo root):
    CLOUDFLARE_EMAIL=... CLOUDFLARE_API_KEY=... python3 scripts/sync-legacy-redirects.py [--dry-run]

Strictly append-only and scheme-correct per Cloudflare semantics:
- a scheme-LESS source (how the original items are stored) matches BOTH http
  and https requests;
- a scheme-SPECIFIC source (http:// or https://) matches only that scheme.
Coverage of the required https variant therefore comes from a bare-form item
or an https-form item, never from an http-only item. If only an http-form
item exists for a path, the variant is skipped (never written), because a new
bare-form item would overlap it for http requests. Pre-existing items are
never re-posted or modified, whatever their target or flags.
Writes use the bare-domain form (same as the originals), so a new item covers
both schemes.

Success is claimed only after: every POST batch reports success, the async
bulk operation completes (polled on /rules/lists/bulk_operations/{op_id}),
and ONE final paginated snapshot proves each planned item present with exact
target/status/flags, no duplicate sources, no count drift, and every
pre-existing item byte-unchanged. The 10,000-item plan cap is checked before
any write.
"""

import argparse
import glob
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ACCOUNT_ID = "8e83fee9ba5b2bf423d5ffddaaee74c6"
LIST_ID = "493ccefd92a94308a5bb513e0ff7d3ca"
API = "https://api.cloudflare.com/client/v4"
ZONE_HOST = "shaffercon.com"
CONTENT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "content", "industry-insights")
MAX_PAGES = 100
MAX_LIST_ITEMS = 10000
OP_TIMEOUT_S = 180
OP_POLL_S = 2
FLAGS = ("status_code", "preserve_query_string", "subpath_matching", "include_subdomains", "preserve_path_suffix")


class SyncError(RuntimeError):
    pass


def _http(method, path, payload=None):
    req = urllib.request.Request(
        API + path,
        data=json.dumps(payload).encode() if payload is not None else None,
        method=method,
        headers={
            "X-Auth-Email": os.environ.get("CLOUDFLARE_EMAIL", ""),
            "X-Auth-Key": os.environ.get("CLOUDFLARE_API_KEY", ""),
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            return json.load(res)
    except urllib.error.HTTPError as e:
        raise SyncError(f"HTTP {e.code} on {method} {path}: {e.read()[:200]!r}") from e


def parse_source(source_url):
    """Parse a stored source_url into (scheme, key).

    scheme is None for the bare-domain form, else 'http'/'https'.
    key is 'shaffercon.com<path>'. Returns None for anything that is not an
    exactly-hosted http(s) or bare-domain source (foreign host, no host,
    other schemes, malformed paths).
    """
    if not isinstance(source_url, str) or not source_url:
        return None
    if "://" in source_url:
        p = urllib.parse.urlsplit(source_url)
        if p.scheme not in ("http", "https") or p.netloc != ZONE_HOST:
            return None
        path = p.path or "/"
        scheme = p.scheme
    else:
        host, sep, rest = source_url.partition("/")
        if host != ZONE_HOST or not sep:
            return None
        path, scheme = "/" + rest, None
    if not path.startswith("/") or "//" in path:
        return None
    return scheme, ZONE_HOST + path


# Backwards-compatible name used by earlier drafts/tests.
def canonical_key(source_url):
    parsed = parse_source(source_url)
    return parsed[1] if parsed else None


def post_slugs(content_dir=None):
    """Slugs of published posts (JSON `slug` field), same source as the build."""
    slugs = set()
    for file in glob.glob(os.path.join(content_dir or CONTENT_DIR, "*.json")):
        with open(file) as fh:
            post = json.load(fh)
        slug = post.get("slug")
        if slug and isinstance(slug, str) and slug == slug.strip():
            slugs.add(slug)
    return slugs


def validate_item(it):
    """Require the exact stored item schema; raise on anything malformed."""
    if not isinstance(it, dict) or not isinstance(it.get("id"), str) or not it["id"]:
        raise SyncError(f"malformed list item (missing id): {it!r:.200}")
    r = it.get("redirect")
    if not isinstance(r, dict):
        raise SyncError(f"malformed list item (missing redirect): {it!r:.200}")
    if not isinstance(r.get("source_url"), str) or not r["source_url"]:
        raise SyncError(f"malformed item source_url: {r.get('source_url')!r}")
    tu = r.get("target_url")
    if not isinstance(tu, str) or not tu.startswith(("http://", "https://")):
        raise SyncError(f"malformed item target_url: {tu!r}")
    return r


def fetch_all_items(transport=None):
    """Paginated full snapshot with hard failure on any API/schema problem."""
    items, cur, pages, seen_ids = [], "", 0, set()
    while True:
        path = f"/accounts/{ACCOUNT_ID}/rules/lists/{LIST_ID}/items?per_page=500"
        if cur:
            path += f"&cursor={urllib.parse.quote(cur)}"
        data = api("GET", path, transport=transport)
        if data.get("success") is not True:
            raise SyncError(f"list GET failed: {data.get('errors')}")
        result = data.get("result")
        if not isinstance(result, list):
            raise SyncError(f"list GET returned non-list result: {type(result)}")
        for it in result:
            validate_item(it)
            if it["id"] in seen_ids:
                raise SyncError("pagination loop: duplicate item id across pages")
            seen_ids.add(it["id"])
            items.append(it)
        pages += 1
        if pages > MAX_PAGES:
            raise SyncError(f"pagination exceeded {MAX_PAGES} pages")
        cursors = (data.get("result_info") or {}).get("cursors") or {}
        nxt = cursors.get("after") or ""
        if nxt and nxt == cur:
            raise SyncError("pagination stuck: cursor did not advance")
        cur = nxt
        if not cur:
            break
    return items


def coverage(items):
    """(bare_keys, scheme_keys) from stored items.

    bare_keys: set of 'host+path' for scheme-less sources (match http+https).
    scheme_keys: set of (scheme, 'host+path') for scheme-specific sources.
    """
    bare, scheme_keys = set(), set()
    for it in items:
        r = (it.get("redirect") or {})
        parsed = parse_source(r.get("source_url"))
        if parsed is None:
            continue
        scheme, key = parsed
        if scheme is None:
            bare.add(key)
        else:
            scheme_keys.add((scheme, key))
    return bare, scheme_keys


def plan(items, slugs):
    """Missing https variants for the given slugs; append-only.

    Returns (payload, skipped). A variant is covered when a bare-form item
    (matches both schemes) or an https-form item exists for the exact path.
    An http-only item does NOT cover https; the variant is skipped with a
    note instead of written, because adding a bare-form item would overlap
    the existing http-specific item for http requests. Payload uses the
    bare-domain source form (covers both schemes, same as the originals).
    """
    bare, scheme_keys = coverage(items)
    payload, skipped = [], []
    for slug in sorted(slugs):
        for variant in (f"https://{ZONE_HOST}/{slug}", f"https://{ZONE_HOST}/{slug}/"):
            path = urllib.parse.urlsplit(variant).path
            key = ZONE_HOST + path
            if key in bare or ("https", key) in scheme_keys:
                continue
            if ("http", key) in scheme_keys:
                skipped.append({"source_url": variant,
                                "reason": "http-only item exists; bare-form write would overlap it for http requests"})
                continue
            payload.append({
                "source_url": f"{ZONE_HOST}{path}",
                "target_url": f"https://{ZONE_HOST}/industry-insights/{slug}/",
                "status_code": 301,
                "preserve_query_string": True,
                "subpath_matching": False,
                "include_subdomains": False,
                "preserve_path_suffix": False,
            })
    return payload, skipped


def wait_for_operation(op_id, transport=None):
    """Poll GET /accounts/{a}/rules/lists/bulk_operations/{op_id} until done."""
    deadline = time.time() + OP_TIMEOUT_S
    path = f"/accounts/{ACCOUNT_ID}/rules/lists/bulk_operations/{urllib.parse.quote(op_id)}"
    last = None
    while True:
        data = api("GET", path, transport=transport)
        if data.get("success") is not True:
            raise SyncError(f"bulk operation GET failed: {data.get('errors')}")
        result = data.get("result")
        if not isinstance(result, dict) or not isinstance(result.get("status"), str):
            raise SyncError(f"malformed bulk operation response for {op_id}: {data.get('result')!r:.200}")
        last = result["status"]
        if last in ("completed", "success"):
            return
        if last in ("failed", "error", "canceled"):
            raise SyncError(f"async operation {op_id} ended with status={last}")
        if time.time() + OP_POLL_S > deadline:
            raise SyncError(f"async operation {op_id} timed out after {OP_TIMEOUT_S}s (last status={last})")
        time.sleep(OP_POLL_S)


def append(payload, items_before, transport=None, max_list_items=MAX_LIST_ITEMS):
    """Write missing variants and prove the write with ONE final snapshot.

    Raises before any write if the plan would exceed max_list_items.
    Returns True only if: all batches succeeded with an operation id, every
    async operation completed, and the final snapshot contains each planned
    source with EXACT target/status/flags, no duplicate sources, no count
    drift, and every pre-existing item byte-unchanged.
    """
    if not payload:
        return True
    if len(items_before) + len(payload) > max_list_items:
        raise SyncError(f"plan would exceed the {max_list_items}-item list cap "
                        f"({len(items_before)} existing + {len(payload)} planned)")
    before = {(it["id"], it["redirect"]["source_url"]): it["redirect"] for it in items_before}
    for i in range(0, len(payload), 500):
        batch = [{"redirect": it} for it in payload[i:i + 500]]
        res = api("POST", f"/accounts/{ACCOUNT_ID}/rules/lists/{LIST_ID}/items", batch, transport=transport)
        if res.get("success") is not True:
            raise SyncError(f"list POST failed at batch {i // 500}: {res.get('errors')}")
        result = res.get("result")
        op_id = result.get("operation_id") if isinstance(result, dict) else None
        if not isinstance(op_id, str) or not op_id:
            raise SyncError(f"list POST returned no usable operation_id: {result!r:.200}")
        wait_for_operation(op_id, transport=transport)
    after_items = fetch_all_items(transport=transport)
    if len(after_items) != len(items_before) + len(payload):
        raise SyncError(f"count drift: expected {len(items_before) + len(payload)} rows after write, "
                        f"found {len(after_items)} (duplicates or unexpected items)")
    after = {}
    for it in after_items:
        key = (it["id"], it["redirect"]["source_url"])
        if key in after:
            raise SyncError(f"duplicate item after write: {key}")
        after[key] = it["redirect"]
    changed = [k for k, v in before.items() if after.get(k) != v]
    if changed:
        raise SyncError(f"post-write proof failed: {len(changed)} pre-existing items changed, e.g. {changed[:2]}")
    planned_sources = {p["source_url"] for p in payload}
    if len(planned_sources) != len(payload):
        raise SyncError("plan contains duplicate source_urls")
    after_by_source = {r["source_url"]: r for r in after.values()}
    for p in payload:
        got = after_by_source.get(p["source_url"])
        if got is None:
            raise SyncError(f"after-proof: planned source absent: {p['source_url']}")
        if got.get("target_url") != p["target_url"]:
            raise SyncError(f"after-proof: wrong target for {p['source_url']}: {got.get('target_url')!r}")
        for f in FLAGS:
            if got.get(f) != p[f]:
                raise SyncError(f"after-proof: wrong {f} for {p['source_url']}: {got.get(f)!r}")
    return True


def api(method, path, payload=None, transport=None):
    return (transport or _http)(method, path, payload)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--dry-run", action="store_true", help="print planned items; no writes")
    ap.add_argument("--content-dir", default=None, help="override content directory (tests)")
    args = ap.parse_args(argv)

    want = post_slugs(args.content_dir)
    items = fetch_all_items()
    payload, skipped = plan(items, want)
    print(f"{len(want)} posts; {len(items)} list rows; {len(payload)} variants to append; {len(skipped)} skipped")
    for s in skipped:
        print(f"  skipped {s['source_url']}: {s['reason']}", file=sys.stderr)
    if not payload:
        return 0
    if args.dry_run:
        print(json.dumps(payload, indent=2))
        return 0
    if append(payload, items):
        print(f"appended {len(payload)} items; verified exact fields, count, and all pre-existing items unchanged")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except SyncError as e:
        print(f"sync error: {e}", file=sys.stderr)
        sys.exit(1)
