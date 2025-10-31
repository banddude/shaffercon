#!/usr/bin/env python3
"""
Clean all HTML entities from parsed JSON content
"""

import sqlite3
import json
import html
import re

DB_PATH = "/Users/mikeshaffer/aiva/website/data/site.db"

def clean_html_entities(obj):
    """Recursively clean HTML entities from strings in nested dict/list"""
    if isinstance(obj, dict):
        return {k: clean_html_entities(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_html_entities(item) for item in obj]
    elif isinstance(obj, str):
        # Decode HTML entities (&amp; -> &, &lt; -> <, etc.)
        decoded = html.unescape(obj)
        # Also strip any remaining HTML tags just in case
        decoded = re.sub(r'<[^>]+>', '', decoded)
        return decoded
    else:
        return obj


def clean_all_parsed_content():
    """Clean parsed_content for all pages"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("Cleaning HTML entities from parsed JSON...")
    print("=" * 80)

    # Get all pages with parsed content
    cursor.execute("SELECT id, slug, parsed_content FROM pages_all WHERE parsed_content IS NOT NULL")
    pages = cursor.fetchall()

    print(f"Found {len(pages)} pages to clean\n")

    cleaned_count = 0
    error_count = 0

    for page_id, slug, parsed_json in pages:
        try:
            # Parse JSON
            data = json.loads(parsed_json)

            # Clean all HTML entities
            cleaned_data = clean_html_entities(data)

            # Save back
            cursor.execute(
                "UPDATE pages_all SET parsed_content = ? WHERE id = ?",
                (json.dumps(cleaned_data), page_id)
            )

            cleaned_count += 1

            if cleaned_count % 100 == 0:
                print(f"  Cleaned {cleaned_count}/{len(pages)} pages...")
                conn.commit()

        except Exception as e:
            print(f"  ✗ Error cleaning {slug}: {e}")
            error_count += 1

    conn.commit()
    conn.close()

    print(f"\n✓ Cleaned {cleaned_count} pages")
    if error_count:
        print(f"✗ {error_count} errors")


def verify_cleaned():
    """Verify that HTML entities are removed"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("\nVerifying cleaned data...")
    print("=" * 80)

    # Check 20 random pages
    cursor.execute("SELECT slug, parsed_content FROM pages_all ORDER BY RANDOM() LIMIT 20")

    issues = []
    for slug, parsed_json in cursor.fetchall():
        if not parsed_json:
            continue

        text = parsed_json

        # Check for HTML entities
        if any(entity in text for entity in ['&amp;', '&lt;', '&gt;', '&quot;', '&#']):
            issues.append(f"{slug}: Still has HTML entities")

        # Check for HTML tags
        if re.search(r'<[^>]+>', text):
            issues.append(f"{slug}: Still has HTML tags")

    if issues:
        print("\n✗ Issues found:")
        for issue in issues:
            print(f"  • {issue}")
    else:
        print("\n✓ All 20 sampled pages are clean!")

    # Check specific examples
    cursor.execute("SELECT parsed_content FROM pages_all WHERE slug='commercial-pool-hot-tub-spa-electrical' LIMIT 1")
    row = cursor.fetchone()
    if row:
        data = json.loads(row[0])
        print(f"\nExample - Pool page city name: '{data.get('city_name')}'")
        print(f"  Has '&': {'&' in data.get('city_name', '')}")
        print(f"  Has '&amp;': {'&amp;' in data.get('city_name', '')}")

    conn.close()


if __name__ == "__main__":
    print("Clean Parsed JSON - Remove HTML Entities")
    print("=" * 80)
    print()

    clean_all_parsed_content()
    verify_cleaned()

    print("\n✓ Done!")
