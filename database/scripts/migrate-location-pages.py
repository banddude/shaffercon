#!/usr/bin/env python3
"""
Migrate all 22 location/service area pages from JSON parsed_content to structured tables.
"""

import sqlite3
import json
import sys
from typing import List, Tuple, Optional

def extract_tagline(all_text: List[str]) -> str:
    """Extract tagline (usually after the h1)"""
    # Usually at index 3: h1 part1, h1 part2, location name, then tagline
    for i, text in enumerate(all_text):
        if 'Expert electrical contractors serving' in text:
            return text
    return ''

def extract_about_paragraphs(all_text: List[str]) -> Tuple[str, str]:
    """Extract the two about paragraphs"""
    about_start = None

    # Find where "About [Location]" section starts
    for i, text in enumerate(all_text):
        if text.startswith('About ') or 'About' in text and len(text) < 50:
            about_start = i + 1
            break

    if about_start is None:
        return '', ''

    # Next two substantial paragraphs are the about content
    paragraphs = []
    for i in range(about_start, len(all_text)):
        text = all_text[i]
        # Skip headings and short text
        if len(text) > 100 and not text.endswith(':') and 'Call' not in text:
            paragraphs.append(text)
            if len(paragraphs) == 2:
                break

    para1 = paragraphs[0] if len(paragraphs) > 0 else ''
    para2 = paragraphs[1] if len(paragraphs) > 1 else ''

    return para1, para2

def extract_service_intros(all_text: List[str]) -> Tuple[str, str]:
    """Extract residential and commercial service intro texts"""
    residential_intro = ''
    commercial_intro = ''

    for text in all_text:
        if 'provides expert residential electrical services throughout' in text:
            residential_intro = text
        elif 'provide comprehensive commercial electrical solutions for' in text:
            commercial_intro = text

    return residential_intro, commercial_intro

def extract_closing_cta(all_text: List[str]) -> str:
    """Extract closing CTA text"""
    for text in all_text:
        if 'Need electrical service in' in text and 'Contact us today' in text:
            return text
    return ''

def extract_related_services(lists: List[dict]) -> List[str]:
    """Extract related services from lists"""
    # Usually the second-to-last list
    if lists and len(lists) >= 2:
        return lists[-2].get('items', [])
    return []

def extract_nearby_areas(lists: List[dict]) -> List[str]:
    """Extract nearby areas from lists"""
    # Usually the last list
    if lists and len(lists) >= 1:
        return lists[-1].get('items', [])
    return []

def clean_service_name(name: str) -> str:
    """Clean up service names for consistency"""
    # Remove extra spaces
    name = ' '.join(name.split())
    return name

def migrate_location_page(cursor, page_id: int, slug: str, title: str, parsed_content: str) -> bool:
    """Migrate a single location page to the new structure"""
    try:
        parsed = json.loads(parsed_content)

        # Extract location name from title (it's just the title itself for location pages)
        location_name = title.strip()
        location_slug = slug.strip()

        all_text = parsed.get('all_text_content', [])
        lists = parsed.get('lists', [])

        # Extract content
        tagline = extract_tagline(all_text)
        about_para1, about_para2 = extract_about_paragraphs(all_text)
        residential_intro, commercial_intro = extract_service_intros(all_text)
        closing_cta = extract_closing_cta(all_text)
        related_services = extract_related_services(lists)
        nearby_areas = extract_nearby_areas(lists)

        # Insert into location_pages
        cursor.execute("""
            INSERT INTO location_pages (
                page_id, location_name, location_slug, tagline,
                about_paragraph_1, about_paragraph_2,
                residential_intro, commercial_intro, closing_cta
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (page_id, location_name, location_slug, tagline,
              about_para1, about_para2,
              residential_intro, commercial_intro, closing_cta))

        location_page_id = cursor.lastrowid

        # Insert related services
        for i, service in enumerate(related_services, 1):
            service_name = clean_service_name(service)
            # We'll construct the URL from the service name later in the app
            cursor.execute("""
                INSERT INTO location_related_services (
                    location_page_id, service_name, display_order
                )
                VALUES (?, ?, ?)
            """, (location_page_id, service_name, i))

        # Insert nearby areas
        for i, area in enumerate(nearby_areas, 1):
            area_name = clean_service_name(area)
            # Convert to slug (lowercase, replace spaces with hyphens)
            area_slug = area_name.lower().replace(' ', '-').replace(',', '')
            cursor.execute("""
                INSERT INTO location_nearby_areas (
                    location_page_id, area_name, area_slug, display_order
                )
                VALUES (?, ?, ?, ?)
            """, (location_page_id, area_name, area_slug, i))

        return True

    except Exception as e:
        print(f"Error migrating page {page_id} ({slug}): {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    db_path = '/Users/mikeshaffer/AIVA/website/data/site.db'

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get all location pages - these are the pages without residential/commercial prefix
    # and not the special pages
    cursor.execute("""
        SELECT id, slug, title, parsed_content
        FROM pages_all
        WHERE slug NOT LIKE 'residential-%'
        AND slug NOT LIKE 'commercial-%'
        AND slug NOT IN (
            'contact-us', 'about-us', 'home', 'service-areas',
            'footer', 'estimator', 'breaker-panel-service-maintenance',
            'commercial-electric-vehicle-chargers', 'commercial-service',
            'residential-ev-charger', 'electrical-load-studies',
            'led-retrofit-services', 'statewide-facilities-maintenance'
        )
        AND slug IN (
            'altadena', 'atwater-village', 'beverly-hills', 'boyle-heights',
            'burbank', 'culver-city', 'echo-park', 'glendale', 'highland-park',
            'hollywood', 'inglewood', 'long-beach', 'los-feliz', 'pacific-palisades',
            'pasadena', 'santa-clarita', 'santa-monica', 'sherman-oaks',
            'silver-lake', 'torrance', 'venice', 'west-hollywood'
        )
        ORDER BY slug
    """)

    pages = cursor.fetchall()

    print(f"Found {len(pages)} location pages to migrate")
    print("=" * 60)

    migrated = 0
    skipped = 0

    for page_id, slug, title, parsed_content in pages:
        print(f"Migrating: {slug} ({title})")
        if migrate_location_page(cursor, page_id, slug, title, parsed_content):
            migrated += 1
        else:
            skipped += 1

    conn.commit()
    conn.close()

    print("=" * 60)
    print(f"Migration complete!")
    print(f"  Migrated: {migrated}")
    print(f"  Skipped: {skipped}")
    print(f"  Total: {len(pages)}")

if __name__ == '__main__':
    main()
