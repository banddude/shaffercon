#!/usr/bin/env python3
"""Append missing legacy blog redirects to the Cloudflare bulk redirect list.

Replaces the old flow of editing BLOG_SLUGS inside
cloudflare-worker/redirects-worker/index.js and redeploying the worker.
The worker is no longer routed (kept only for rollback); legacy redirects
now live in the Cloudflare bulk redirect list `shaffercon_legacy_blog_redirects`.

Usage (from repo root):
    CLOUDFLARE_EMAIL=... CLOUDFLARE_API_KEY=... python3 scripts/sync-legacy-redirects.py [--dry-run]

Run after publishing a post so old top-level /<slug> links keep working.
Only appends missing items; never modifies or deletes existing ones.
Slugs are read from content/industry-insights/*.json (`slug` field), the
same source the site build uses.
"""

import argparse
import glob
import json
import os
import sys
import urllib.request

ACCOUNT_ID = "8e83fee9ba5b2bf423d5ffddaaee74c6"
LIST_ID = "493ccefd92a94308a5bb513e0ff7d3ca"
API = "https://api.cloudflare.com/client/v4"
ZONE_HOST = "shaffercon.com"
CONTENT_DIR = os.path.join(os.path.dirname(__file__), "..", "content", "industry-insights")


def api(method, path, payload=None):
    req = urllib.request.Request(
        API + path,
        data=json.dumps(payload).encode() if payload is not None else None,
        method=method,
        headers={
            "X-Auth-Email": os.environ["CLOUDFLARE_EMAIL"],
            "X-Auth-Key": os.environ["CLOUDFLARE_API_KEY"],
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req) as res:
        return json.load(res)


def post_slugs():
    slugs = set()
    for file in glob.glob(os.path.join(CONTENT_DIR, "*.json")):
        with open(file) as fh:
            post = json.load(fh)
        if post.get("slug"):
            slugs.add(post["slug"])
    return slugs


def listed_slugs():
    """Slugs already covered by the list via either source shape."""
    covered = set()
    cur = ""
    while True:
        path = f"/accounts/{ACCOUNT_ID}/rules/lists/{LIST_ID}/items?per_page=500"
        if cur:
            path += f"&cursor={cur}"
        data = api("GET", path)
        for it in data.get("result") or []:
            src = it["redirect"]["source_url"]
            if ZONE_HOST not in src:
                continue
            src = src.split(ZONE_HOST, 1)[1]
            if src.startswith("/industry-insights/") and src.endswith("/"):
                covered.add(src[len("/industry-insights/"):-1])
        cur = ((data.get("result_info") or {}).get("cursors") or {}).get("after") or ""
        if not cur:
            break
    return covered


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    want = post_slugs()
    have = listed_slugs()
    missing = sorted(want - have)
    print(f"{len(want)} posts, {len(have & want)} already listed, {len(missing)} missing")
    if not missing:
        return
    payload = []
    for slug in missing:
        base = {
            "target_url": f"https://{ZONE_HOST}/industry-insights/{slug}/",
            "status_code": 301,
            "preserve_query_string": True,
            "subpath_matching": False,
            "include_subdomains": False,
            "preserve_path_suffix": False,
        }
        payload.append({"redirect": {"source_url": f"https://{ZONE_HOST}/{slug}", **base}})
        payload.append({"redirect": {"source_url": f"https://{ZONE_HOST}/{slug}/", **base}})
    if args.dry_run:
        print(json.dumps(payload, indent=2))
        return
    for i in range(0, len(payload), 500):
        res = api("POST", f"/accounts/{ACCOUNT_ID}/rules/lists/{LIST_ID}/items", payload[i:i + 500])
        if not res.get("success"):
            print(f"API error: {res.get('errors')}", file=sys.stderr)
            sys.exit(1)
    print(f"appended {len(payload)} list items for {len(missing)} slugs (slash + no-slash)")


if __name__ == "__main__":
    main()
