#!/usr/bin/env python3
"""Append missing legacy blog redirects to the Cloudflare bulk redirect list.

Replaces the old flow of editing BLOG_SLUGS inside
cloudflare-worker/redirects-worker/index.js and redeploying the worker.
The worker is no longer routed (kept only for rollback); legacy redirects
now live in the Cloudflare bulk redirect list `shaffercon_legacy_blog_redirects`.

Usage (from repo root):
    CLOUDFLARE_EMAIL=... CLOUDFLARE_API_KEY=... python3 scripts/sync-legacy-redirects.py [--dry-run]

Run after publishing a post so old top-level /<slug> links keep working.
Strictly append-only: a source that already exists in ANY accepted form
(bare-domain, http, https) is never re-posted, regardless of its stored
target or flags. Only the exact missing source variants are added.

Cloudflare treats bare-domain and scheme'd source_urls as distinct storage
keys that match the same live requests, so coverage is checked on a
scheme-insensitive canonical key while writes use the canonical https form.
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
OP_TIMEOUT_S = 180


class SyncError(RuntimeError):
    pass


def api(method, path, payload=None, transport=None):
    send = transport or _http
    return send(method, path, payload)


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


def canonical_key(source_url):
    """Canonical list key for a source_url: 'shaffercon.com<path>'.

    Accepts bare-domain ('shaffercon.com/x'), http and https forms; anything
    else (foreign host, no host, non-http scheme) returns None.
    Scheme is deliberately NOT part of the key: all accepted forms match the
    same live requests.
    """
    if not isinstance(source_url, str) or not source_url:
        return None
    if "://" in source_url:
        p = urllib.parse.urlsplit(source_url)
        if p.scheme not in ("http", "https") or p.netloc != ZONE_HOST:
            return None
        path = p.path or "/"
    else:
        host, sep, rest = source_url.partition("/")
        if host != ZONE_HOST or not sep:
            return None
        path = "/" + rest
    if not path.startswith("/") or "//" in path:
        return None
    return ZONE_HOST + path


def post_slugs(content_dir=None):
    """Slugs of published posts (JSON `slug` field), same source as the build."""
    slugs = set()
    for file in glob.glob(os.path.join(content_dir or CONTENT_DIR, "*.json")):
        with open(file) as fh:
            post = json.load(fh)
        slug = post.get("slug")
        if slug and isinstance(slug, str) and slug == slug.strip() and slug:
            slugs.add(slug)
    return slugs


def fetch_all_items(transport=None):
    """Paginated full snapshot with hard failure on any API/schema problem."""
    items, cur, pages = [], "", 0
    seen_ids = set()
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
            iid = it.get("id")
            if iid in seen_ids:
                raise SyncError("pagination loop: duplicate item id across pages")
            if iid is not None:
                seen_ids.add(iid)
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


def listed_keys(items):
    """Set of canonical source keys present in the list."""
    keys = set()
    for it in items:
        key = canonical_key((it.get("redirect") or {}).get("source_url"))
        if key:
            keys.add(key)
    return keys


def plan(items, slugs):
    """Missing source variants for the given slugs. Append-only.

    A variant is 'covered' when ANY accepted form of its exact path exists
    (bare/http/https). Covered variants are never re-posted, even if their
    stored target or flags differ. Returns items in canonical https form.
    """
    have = listed_keys(items)
    payload = []
    for slug in sorted(slugs):
        for variant in (f"https://{ZONE_HOST}/{slug}", f"https://{ZONE_HOST}/{slug}/"):
            if canonical_key(variant) not in have:
                payload.append({
                    "source_url": variant,
                    "target_url": f"https://{ZONE_HOST}/industry-insights/{slug}/",
                    "status_code": 301,
                    "preserve_query_string": True,
                    "subpath_matching": False,
                    "include_subdomains": False,
                    "preserve_path_suffix": False,
                })
    return payload


def wait_for_operation(op_id, transport=None):
    """Poll an async list operation until completed; raise on failure/timeout."""
    deadline = time.time() + OP_TIMEOUT_S
    path = f"/accounts/{ACCOUNT_ID}/rules/lists/{LIST_ID}/items/{urllib.parse.quote(op_id)}"
    last = None
    while time.time() < deadline:
        data = api("GET", path, transport=transport)
        if data.get("success") is not True:
            raise SyncError(f"operation status GET failed: {data.get('errors')}")
        last = (data.get("result") or {}).get("status") if isinstance(data.get("result"), dict) else data.get("result")
        if last in ("completed", "success"):
            return
        if last in ("failed", "error", "canceled"):
            raise SyncError(f"async operation {op_id} ended with status={last}")
        time.sleep(2)
    raise SyncError(f"async operation {op_id} timed out after {OP_TIMEOUT_S}s (last status={last})")


def append(payload, transport=None):
    """POST missing items in batches of <=500 and verify asynchronously.

    Returns True only after every batch reports completed AND the after-proof
    snapshot contains every planned source key.
    """
    for i in range(0, len(payload), 500):
        batch = [{"redirect": it} for it in payload[i:i + 500]]
        res = api("POST", f"/accounts/{ACCOUNT_ID}/rules/lists/{LIST_ID}/items", batch, transport=transport)
        if res.get("success") is not True:
            raise SyncError(f"list POST failed at batch {i // 500}: {res.get('errors')}")
        op_id = (res.get("result") or {}).get("operation_id") if isinstance(res.get("result"), dict) else None
        if op_id:
            wait_for_operation(op_id, transport=transport)
    keys = {canonical_key(p["source_url"]) for p in payload}
    after = listed_keys(fetch_all_items(transport=transport))
    missing_after = sorted(k for k in keys if k not in after)
    if missing_after:
        raise SyncError(f"after-proof failed; {len(missing_after)} planned sources absent: {missing_after[:5]}")
    return True


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--dry-run", action="store_true", help="print planned items; no writes")
    ap.add_argument("--content-dir", default=None, help="override content directory (tests)")
    args = ap.parse_args(argv)

    want = post_slugs(args.content_dir)
    items = fetch_all_items()
    before = {(it.get("id"), (it.get("redirect") or {}).get("source_url")): (it.get("redirect") or {}) for it in items}
    payload = plan(items, want)
    print(f"{len(want)} posts; {len(items)} list rows; {len(payload)} source variants to append")
    if not payload:
        return 0
    if args.dry_run:
        print(json.dumps(payload, indent=2))
        return 0
    append(payload)
    after_items = fetch_all_items()
    after = {(it.get("id"), (it.get("redirect") or {}).get("source_url")): (it.get("redirect") or {}) for it in after_items}
    untouched = all(after.get(k) == v for k, v in before.items())
    if not untouched:
        raise SyncError("post-write proof failed: pre-existing items changed")
    print(f"appended {len(payload)} items; all {len(before)} pre-existing items unchanged")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except SyncError as e:
        print(f"sync error: {e}", file=sys.stderr)
        sys.exit(1)
