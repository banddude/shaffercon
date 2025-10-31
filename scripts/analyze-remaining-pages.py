#!/usr/bin/env python3
"""
Analyze the structure of remaining pages to group them.
"""

import sqlite3
import json

def analyze_page(slug: str, parsed_content: str) -> dict:
    """Analyze a page's structure"""
    try:
        parsed = json.loads(parsed_content)

        headings = parsed.get('headings', [])
        all_text = parsed.get('all_text_content', [])
        lists = parsed.get('lists', [])
        images = parsed.get('images', [])

        # Get heading structure
        heading_structure = []
        for h in headings[:5]:  # First 5 headings
            heading_structure.append(f"{h['level']}: {h['text'][:60]}")

        # Count key elements
        result = {
            'slug': slug,
            'num_headings': len(headings),
            'num_text_items': len(all_text),
            'num_lists': len(lists),
            'num_images': len(images),
            'heading_structure': heading_structure,
            'has_faq': any('FAQ' in h.get('text', '') or 'Questions' in h.get('text', '') for h in headings),
            'page_type': parsed.get('page_type', 'unknown')
        }

        return result
    except Exception as e:
        return {
            'slug': slug,
            'error': str(e)
        }

def main():
    db_path = '/Users/mikeshaffer/AIVA/website/data/site.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get the 10 remaining pages
    remaining_slugs = [
        'about-us',
        'commercial-electric-vehicle-chargers',
        'commercial-service',
        'electrical-load-studies',
        'footer',
        'home',
        'led-retrofit-services',
        'residential-ev-charger',
        'service-areas',
        'statewide-facilities-maintenance'
    ]

    print("=" * 80)
    print("ANALYZING REMAINING 10 PAGES")
    print("=" * 80)

    for slug in remaining_slugs:
        cursor.execute("""
            SELECT parsed_content
            FROM pages_all
            WHERE slug = ?
        """, (slug,))

        row = cursor.fetchone()
        if not row:
            print(f"\n{slug}: NOT FOUND")
            continue

        result = analyze_page(slug, row[0])

        print(f"\n{result['slug'].upper()}")
        print("-" * 80)
        if 'error' in result:
            print(f"  ERROR: {result['error']}")
        else:
            print(f"  Page Type: {result['page_type']}")
            print(f"  Headings: {result['num_headings']}")
            print(f"  Text Items: {result['num_text_items']}")
            print(f"  Lists: {result['num_lists']}")
            print(f"  Images: {result['num_images']}")
            print(f"  Has FAQ: {result['has_faq']}")
            print(f"  Heading Structure:")
            for h in result['heading_structure']:
                print(f"    - {h}")

    conn.close()

if __name__ == '__main__':
    main()
