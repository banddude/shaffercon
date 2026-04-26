#!/usr/bin/env python3
"""
Full SEO audit of shaffercon.com.

Discovers issues that match GSC categories:
- Not found (404)
- Alternate page with proper canonical
- Excluded by noindex
- Duplicate without canonical
- Redirect error
- Page with redirect (excessive)
"""
import concurrent.futures
import re
import sys
import time
from collections import defaultdict
from urllib.parse import urljoin, urlparse
import requests
from xml.etree import ElementTree as ET

BASE = "https://shaffercon.com"
TIMEOUT = 15
MAX_WORKERS = 12

session = requests.Session()
session.headers["User-Agent"] = "ShafferConSEOAuditor/1.0"

results = {
    "404s": [],
    "canonical_mismatches": [],   # canonical points to a different URL than the page itself
    "canonical_to_404": [],       # canonical tag points to a 404 page
    "noindex_pages": [],
    "missing_canonical": [],
    "redirects": [],              # 3xx responses
    "redirect_chains": [],        # URLs with 2+ redirects
    "long_titles": [],            # > 60 chars
    "long_descriptions": [],      # > 160 chars
    "missing_titles": [],
    "missing_descriptions": [],
    "missing_h1": [],
    "thin_content": [],           # < 300 visible words
    "errors": [],
}

def fetch_sitemap_urls():
    """Get all URLs from the sitemap."""
    r = session.get(f"{BASE}/sitemap.xml", timeout=TIMEOUT)
    r.raise_for_status()
    root = ET.fromstring(r.content)
    ns = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    return [el.text for el in root.iter(f"{ns}loc")]


def audit_page(url):
    """Audit a single URL. Returns dict of findings."""
    findings = {"url": url}
    try:
        # Don't follow redirects so we can detect them
        r = session.get(url, timeout=TIMEOUT, allow_redirects=False)
        findings["status"] = r.status_code

        # Handle redirects
        if 300 <= r.status_code < 400:
            target = r.headers.get("Location", "")
            findings["redirects_to"] = target
            # Follow once to see final status
            r2 = session.get(url, timeout=TIMEOUT, allow_redirects=True)
            findings["final_status"] = r2.status_code
            findings["redirect_count"] = len(r2.history)
            return findings

        if r.status_code == 404:
            return findings
        if r.status_code != 200:
            findings["error"] = f"unexpected status {r.status_code}"
            return findings

        html = r.text
        # Title
        m = re.search(r"<title[^>]*>([^<]+)</title>", html, re.I)
        title = (m.group(1).strip() if m else "")
        findings["title"] = title

        # Description
        m = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']+)', html, re.I)
        description = (m.group(1) if m else "")
        findings["description"] = description

        # Canonical
        m = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)', html, re.I)
        canonical = (m.group(1) if m else "")
        findings["canonical"] = canonical

        # Robots noindex
        m = re.search(r'<meta\s+name=["\']robots["\']\s+content=["\']([^"\']+)', html, re.I)
        robots = (m.group(1) if m else "")
        findings["robots"] = robots
        findings["noindex"] = "noindex" in robots.lower()

        # H1 (handle Next.js <!-- --> hydration markers + nested tags)
        m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.DOTALL)
        if m:
            h1_text = re.sub(r"<!--.*?-->", "", m.group(1))
            h1_text = re.sub(r"<[^>]+>", "", h1_text).strip()
            findings["h1"] = h1_text
        else:
            findings["h1"] = ""

        # Visible text word count (rough)
        text = re.sub(r"<script[^>]*>[\s\S]*?</script>", "", html, flags=re.I)
        text = re.sub(r"<style[^>]*>[\s\S]*?</style>", "", text, flags=re.I)
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        findings["word_count"] = len(text.split())

        return findings
    except Exception as e:
        findings["error"] = f"{type(e).__name__}: {str(e)[:80]}"
        return findings


def main():
    print("Fetching sitemap...", file=sys.stderr)
    urls = fetch_sitemap_urls()
    print(f"  {len(urls)} URLs to audit", file=sys.stderr)

    findings_by_url = {}
    print(f"\nAuditing in parallel ({MAX_WORKERS} workers)...", file=sys.stderr)
    t0 = time.time()
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futures = {ex.submit(audit_page, u): u for u in urls}
        for i, fut in enumerate(concurrent.futures.as_completed(futures), 1):
            url = futures[fut]
            try:
                findings_by_url[url] = fut.result()
            except Exception as e:
                findings_by_url[url] = {"url": url, "error": str(e)}
            if i % 50 == 0:
                elapsed = time.time() - t0
                eta = elapsed / i * (len(urls) - i)
                print(f"  {i}/{len(urls)} ({elapsed:.0f}s elapsed, ~{eta:.0f}s remaining)",
                      file=sys.stderr)

    print(f"  Done in {time.time()-t0:.0f}s\n", file=sys.stderr)

    # Categorize findings
    for url, f in findings_by_url.items():
        if "error" in f:
            results["errors"].append((url, f["error"]))
            continue

        status = f.get("status", 0)
        if status == 404:
            results["404s"].append(url)
            continue

        if 300 <= status < 400:
            results["redirects"].append((url, f.get("redirects_to", ""), f.get("redirect_count", 0)))
            if f.get("redirect_count", 0) >= 2:
                results["redirect_chains"].append((url, f.get("redirect_count")))
            continue

        if status != 200:
            continue

        # Canonical checks
        canonical = f.get("canonical", "")
        if not canonical:
            results["missing_canonical"].append(url)
        else:
            # Strip both URL and canonical for comparison
            url_norm = url.rstrip("/")
            can_norm = canonical.rstrip("/")
            if url_norm != can_norm:
                results["canonical_mismatches"].append((url, canonical))

        # Noindex
        if f.get("noindex"):
            results["noindex_pages"].append(url)

        # Title
        title = f.get("title", "")
        if not title:
            results["missing_titles"].append(url)
        elif len(title) > 60:
            results["long_titles"].append((url, len(title), title))

        # Description
        desc = f.get("description", "")
        if not desc:
            results["missing_descriptions"].append(url)
        elif len(desc) > 160:
            results["long_descriptions"].append((url, len(desc)))

        # H1
        if not f.get("h1"):
            results["missing_h1"].append(url)

        # Thin content
        wc = f.get("word_count", 0)
        if wc < 300:
            results["thin_content"].append((url, wc))

    # Print summary
    print("=" * 70)
    print("SEO AUDIT SUMMARY")
    print("=" * 70)
    print(f"Total URLs audited: {len(findings_by_url)}")
    print()
    for cat in ["404s", "canonical_mismatches", "noindex_pages", "missing_canonical",
                "redirects", "redirect_chains", "long_titles", "long_descriptions",
                "missing_titles", "missing_descriptions", "missing_h1",
                "thin_content", "errors"]:
        n = len(results[cat])
        if n > 0:
            print(f"  {cat}: {n}")

    # Save full results to JSON for follow-up
    import json
    with open("/tmp/seo-audit-results.json", "w") as f:
        json.dump({k: v if isinstance(v, list) else list(v) for k, v in results.items()},
                  f, default=str, indent=2)
    print(f"\nFull results: /tmp/seo-audit-results.json")


if __name__ == "__main__":
    main()
