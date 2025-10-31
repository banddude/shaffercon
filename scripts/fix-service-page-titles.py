#!/usr/bin/env python3
"""
Fix the 21 service page titles to match standard format: "[Type] [Service] in [Location]"
"""

import sqlite3
import re

def extract_location_and_type(title: str, slug: str) -> tuple[str, str, str]:
    """Extract location, type, and service name from title and slug"""

    # Determine type from slug
    if slug.startswith('residential-'):
        service_type = 'Residential'
        service_slug = slug.replace('residential-', '')
    elif slug.startswith('commercial-'):
        service_type = 'Commercial'
        service_slug = slug.replace('commercial-', '')
    else:
        return None, None, None

    # Extract location from beginning of title
    title_lower = title.lower()

    locations = [
        'Santa Monica', 'Echo Park', 'Atwater Village', 'Glendale',
        'Santa Clarita', 'Sherman Oaks', 'Highland Park'
    ]

    location = None
    for loc in locations:
        if title.startswith(loc):
            location = loc
            break

    if not location:
        return None, None, None

    # Generate service name from the rest of the title
    # Remove location and type from title to get service name
    remaining = title.replace(location, '').replace(service_type, '').strip()

    # Clean up spacing issues but keep HTML entities
    remaining = remaining.replace('  ', ' ')

    # If remaining is empty, derive from slug
    if not remaining:
        # Convert slug to title case with proper formatting
        service_name = service_slug.replace('-', ' ').title()
        # Add back HTML entity for ampersands
        service_name = service_name.replace(' And ', ' &#038; ')
    else:
        service_name = remaining

    return location, service_type, service_name

def create_standard_title(location: str, service_type: str, service_name: str) -> str:
    """Create standard format title"""
    return f"{service_type} {service_name} in {location}"

def main():
    db_path = '/Users/mikeshaffer/AIVA/website/data/site.db'

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get the 21 pages that need fixing (exclude the 3 general pages)
    cursor.execute("""
        SELECT id, slug, title
        FROM pages_all
        WHERE (slug LIKE 'residential-%' OR slug LIKE 'commercial-%')
        AND id NOT IN (SELECT page_id FROM service_pages)
        AND slug NOT IN ('commercial-electric-vehicle-chargers', 'commercial-service', 'residential-ev-charger')
        ORDER BY slug
    """)

    pages = cursor.fetchall()

    print(f"Found {len(pages)} pages to fix")
    print("=" * 80)

    updates = []

    for page_id, slug, title in pages:
        location, service_type, service_name = extract_location_and_type(title, slug)

        if not location:
            print(f"⚠️  Could not parse: {title}")
            continue

        new_title = create_standard_title(location, service_type, service_name)

        updates.append((page_id, title, new_title))
        print(f"\n{page_id} | {slug}")
        print(f"  OLD: {title}")
        print(f"  NEW: {new_title}")

    print("\n" + "=" * 80)
    print(f"\nUpdating {len(updates)} titles...")

    for page_id, old_title, new_title in updates:
        cursor.execute("""
            UPDATE pages_all
            SET title = ?
            WHERE id = ?
        """, (new_title, page_id))

    conn.commit()
    print(f"\n✅ Updated {len(updates)} titles successfully!")

    conn.close()

if __name__ == '__main__':
    main()
