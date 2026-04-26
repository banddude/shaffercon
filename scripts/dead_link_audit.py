#!/usr/bin/env python3
"""Find dead internal links across the site.

Crawls the sitemap, extracts all internal hrefs from each page,
checks each unique target URL, reports those that 404 or 5xx.
"""
import concurrent.futures
import re
import sys
from collections import defaultdict
from urllib.parse import urljoin, urlparse
import requests
from xml.etree import ElementTree as ET

BASE = "https://shaffercon.com"
session = requests.Session()
session.headers["User-Agent"] = "ShafferConDeadLinkAudit/1.0"

def get_sitemap():
    r = session.get(f"{BASE}/sitemap.xml", timeout=15)
    r.raise_for_status()
    root = ET.fromstring(r.content)
    ns = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    return [el.text for el in root.iter(f"{ns}loc")]


def extract_internal_hrefs(html, base):
    """Return list of internal URLs referenced from this HTML."""
    urls = set()
    for m in re.finditer(r'href=["\']([^"\']+)["\']', html):
        href = m.group(1)
        # Skip anchors, mailto, tel, blobs, JS
        if href.startswith(('#', 'mailto:', 'tel:', 'javascript:', 'data:', 'blob:')):
            continue
        # Resolve relative
        absolute = urljoin(base, href)
        parsed = urlparse(absolute)
        # Only keep our domain (not subdomains, not external)
        if parsed.netloc != 'shaffercon.com':
            continue
        # Strip fragment
        clean = absolute.split('#')[0]
        urls.add(clean)
    return urls


def fetch_page(url):
    try:
        r = session.get(url, timeout=15, allow_redirects=False)
        return url, r.status_code, r.text if r.status_code == 200 else ""
    except Exception as e:
        return url, 0, ""


def check_url(url):
    """HEAD then GET. Returns (url, final_status_or_chain)."""
    try:
        r = session.head(url, timeout=10, allow_redirects=True)
        return url, r.status_code
    except Exception:
        try:
            r = session.get(url, timeout=10, allow_redirects=True)
            return url, r.status_code
        except Exception as e:
            return url, 0


def main():
    print("Fetching sitemap...", file=sys.stderr)
    pages = get_sitemap()
    print(f"  {len(pages)} pages", file=sys.stderr)

    print("\nCrawling pages and extracting internal hrefs (parallel)...", file=sys.stderr)
    referenced_by = defaultdict(set)  # target_url -> set of source pages
    with concurrent.futures.ThreadPoolExecutor(max_workers=15) as ex:
        for i, (url, status, html) in enumerate(ex.map(fetch_page, pages), 1):
            if i % 100 == 0:
                print(f"  {i}/{len(pages)}", file=sys.stderr)
            if status != 200:
                continue
            for target in extract_internal_hrefs(html, url):
                referenced_by[target].add(url)

    unique_targets = list(referenced_by.keys())
    print(f"\n  Found {len(unique_targets)} unique internal href targets", file=sys.stderr)

    print("\nChecking each target URL for status...", file=sys.stderr)
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=15) as ex:
        for i, (url, status) in enumerate(ex.map(check_url, unique_targets), 1):
            if i % 100 == 0:
                print(f"  {i}/{len(unique_targets)}", file=sys.stderr)
            results.append((url, status))

    # Categorize
    by_status = defaultdict(list)
    for url, status in results:
        by_status[status].append(url)

    print("\n" + "=" * 60)
    print("DEAD INTERNAL LINK AUDIT")
    print("=" * 60)
    print(f"Total unique internal href targets: {len(unique_targets)}")
    print()
    for status in sorted(by_status.keys()):
        urls = by_status[status]
        marker = "🔴" if status >= 400 else ("⚠️ " if status == 0 else " ✅")
        print(f"  {marker} {status}: {len(urls)}")

    # Show dead links with sources
    print("\n=== DEAD LINKS (404/5xx/connection-error) ===")
    dead = [(url, status) for url, status in results if status >= 400 or status == 0]
    if not dead:
        print("  ✅ None! Every internal href resolves.")
    for url, status in dead[:30]:
        print(f"\n  [{status}] {url}")
        sources = list(referenced_by[url])[:3]
        for src in sources:
            print(f"    referenced on: {src}")
        if len(referenced_by[url]) > 3:
            print(f"    ... and {len(referenced_by[url])-3} more pages")


if __name__ == "__main__":
    main()
