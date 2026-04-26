#!/usr/bin/env python3
"""
Submit URLs to IndexNow protocol (Bing, Yandex, Seznam, Yep, Naver).

Usage:
  python3 scripts/indexnow_submit.py URL [URL ...]
  python3 scripts/indexnow_submit.py --all-sitemap   # submit every sitemap URL

Bing accepts up to 10,000 URLs per call. Real-world tests show 100-1000 per
call is most reliable. We chunk at 500.
"""
import json
import sys
import urllib.request
from xml.etree import ElementTree as ET

KEY = "329ac80f140ff86294d5aa772d9ac7f1"
HOST = "shaffercon.com"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/IndexNow"
CHUNK = 500


def submit(urls):
    if not urls:
        return
    payload = {"host": HOST, "key": KEY, "keyLocation": KEY_LOCATION, "urlList": urls}
    req = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        r = urllib.request.urlopen(req, timeout=30)
        print(f"  ✓ {len(urls)} URLs submitted (HTTP {r.status})")
        return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:200]
        print(f"  ✗ HTTP {e.code}: {body}")
        return False


def get_all_sitemap_urls():
    r = urllib.request.urlopen(f"https://{HOST}/sitemap.xml", timeout=15)
    ns = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    return [el.text for el in ET.fromstring(r.read()).iter(f"{ns}loc")]


def main():
    if len(sys.argv) < 2:
        print("usage: indexnow_submit.py URL [URL ...] | --all-sitemap")
        sys.exit(1)

    if sys.argv[1] == "--all-sitemap":
        urls = get_all_sitemap_urls()
        print(f"Sitemap has {len(urls)} URLs. Submitting in chunks of {CHUNK}...")
    else:
        urls = sys.argv[1:]
        print(f"Submitting {len(urls)} URLs...")

    for i in range(0, len(urls), CHUNK):
        chunk = urls[i:i + CHUNK]
        submit(chunk)


if __name__ == "__main__":
    main()
