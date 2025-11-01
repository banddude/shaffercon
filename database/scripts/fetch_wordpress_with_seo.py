#!/usr/bin/env python3
"""
Fetch all pages from WordPress REST API with complete SEO metadata
"""

import requests
import json
import sqlite3
import time
from datetime import datetime

WP_API_URL = "https://shaffercon.com/wp-json/wp/v2"
DB_PATH = "../data/site.db"

def fetch_page_with_seo(slug):
    """Fetch a single page with all SEO data"""
    url = f"{WP_API_URL}/pages?slug={slug}"
    print(f"Fetching: {url}")

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json'
    }

    try:
        response = requests.get(url, headers=headers, timeout=30)
        print(f"Status code: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"Got {len(data)} results")
            if data:
                return data[0]
        else:
            print(f"Error response: {response.text[:200]}")
    except Exception as e:
        print(f"Exception: {e}")

    return None

def test_single_page(slug="santa-monica"):
    """Test fetching a single page"""
    print(f"Testing fetch for: {slug}")
    print("=" * 80)

    page = fetch_page_with_seo(slug)

    if page:
        print(f"✓ Successfully fetched page")
        print(f"\nBasic Info:")
        print(f"  ID: {page['id']}")
        print(f"  Slug: {page['slug']}")
        print(f"  Title: {page['title']['rendered']}")

        print(f"\nSEO Data (Yoast):")
        if 'yoast_head_json' in page:
            yoast = page['yoast_head_json']
            print(f"  Meta Title: {yoast.get('title', 'N/A')}")
            print(f"  Meta Description: {yoast.get('description', 'N/A')[:80]}...")
            print(f"  Canonical: {yoast.get('canonical', 'N/A')}")
            print(f"  Has Schema: {'schema' in yoast}")

            if 'schema' in yoast and '@graph' in yoast['schema']:
                schema_types = [item.get('@type') for item in yoast['schema']['@graph']]
                print(f"  Schema Types: {', '.join(schema_types)}")

        print(f"\nContent:")
        content_preview = page['content']['rendered'][:200].replace('\n', ' ')
        print(f"  {content_preview}...")

        print(f"\n✓ All data looks good!")
        return page
    else:
        print(f"✗ Failed to fetch page")
        return None

if __name__ == "__main__":
    print("WordPress SEO Data Fetcher")
    print("=" * 80)
    print()

    # Test with Santa Monica
    result = test_single_page("santa-monica")

    if result:
        print("\n" + "=" * 80)
        print("Sample data structure:")
        print("=" * 80)

        # Show the keys available
        print("\nTop-level keys:", list(result.keys())[:10])

        if 'yoast_head_json' in result:
            print("\nYoast SEO keys:", list(result['yoast_head_json'].keys()))
