#!/usr/bin/env python3
"""
Migrate all 800 service pages from JSON parsed_content to structured tables.
"""

import sqlite3
import json
import sys
from typing import List, Tuple, Optional

def extract_location_from_title(title: str) -> str:
    """Extract location from title like 'Service Name in Location'"""
    title_lower = title.lower()
    if ' in ' in title_lower:
        return title_lower.split(' in ')[-1].strip()
    return ''

def extract_service_type_and_name(slug: str) -> Tuple[str, str]:
    """Extract service type (residential/commercial) and service name from slug"""
    if slug.startswith('residential-'):
        return 'residential', slug.replace('residential-', '')
    elif slug.startswith('commercial-'):
        return 'commercial', slug.replace('commercial-', '')
    return '', slug

def extract_hero_intro(all_text: List[str]) -> str:
    """Extract the hero intro paragraph (first real paragraph after title)"""
    # Usually at index 3 after: title, "OUR SERVICES", service name
    if len(all_text) > 3:
        return all_text[3]
    return ''

def extract_benefits(all_text: List[str]) -> List[Tuple[str, str]]:
    """Extract benefit sections (heading + content pairs)"""
    benefits = []

    # Look for common benefit headings and their content
    i = 0
    while i < len(all_text):
        text = all_text[i]

        # Check if this looks like a benefit heading (capitalized, short, no punctuation at end)
        if (len(text) < 100 and
            text[0].isupper() and
            not text.endswith('.') and
            not text.endswith('?') and
            'FAQ' not in text and
            'Related' not in text and
            'Nearby' not in text and
            'Call' not in text and
            'OUR SERVICES' != text):

            # Next item should be the content
            if i + 1 < len(all_text) and len(all_text[i + 1]) > 100:
                benefits.append((text, all_text[i + 1]))
                i += 2
                continue

        i += 1

    # Filter to likely benefits (usually 2-4 sections between intro and offerings list)
    return benefits[:4] if benefits else []

def extract_offerings(lists: List[dict]) -> List[str]:
    """Extract service offerings from the first list"""
    if lists and len(lists) > 0:
        return lists[0].get('items', [])
    return []

def extract_closing_content(all_text: List[str]) -> str:
    """Extract the closing section (usually 2-3 paragraphs before FAQs)"""
    # Look for section that starts after offerings and before FAQs
    closing_parts = []
    in_closing = False

    for text in all_text:
        if 'YOUR QUESTIONS ANSWERED' in text or 'Frequently Asked Questions' in text:
            break

        # Start capturing after we see typical closing heading
        if any(keyword in text for keyword in ['Protecting Your', 'How We Can Help', 'Why Choose']):
            in_closing = True
            continue

        if in_closing and len(text) > 100:
            closing_parts.append(text)

    return '\n\n'.join(closing_parts[:3])  # Usually 2-3 paragraphs

def extract_faqs(all_text: List[str]) -> List[Tuple[str, str]]:
    """Extract FAQ question and answer pairs"""
    faqs = []

    # Find where FAQs start
    faq_start_idx = None
    for i, text in enumerate(all_text):
        if 'YOUR QUESTIONS ANSWERED' in text or 'Frequently Asked Questions' in text:
            faq_start_idx = i
            break

    if faq_start_idx is None:
        return []

    # Extract Q&A pairs after FAQ heading
    i = faq_start_idx + 1
    while i < len(all_text) - 1:
        question = all_text[i]

        # Skip non-question text
        if not question.endswith('?') or len(question) < 20:
            i += 1
            continue

        # Next should be the answer
        if i + 1 < len(all_text):
            answer = all_text[i + 1]

            # Make sure answer is substantial and not another question
            if len(answer) > 30 and not answer.endswith('?'):
                faqs.append((question, answer))
                i += 2
                continue

        i += 1

    return faqs

def extract_related_services(lists: List[dict]) -> List[str]:
    """Extract related services from the second list"""
    if lists and len(lists) > 1:
        return lists[1].get('items', [])
    return []

def extract_nearby_areas(lists: List[dict]) -> List[str]:
    """Extract nearby areas from the third list"""
    if lists and len(lists) > 2:
        return lists[2].get('items', [])
    return []

def migrate_service_page(cursor, page_id: int, slug: str, title: str, parsed_content: str) -> bool:
    """Migrate a single service page to the new structure"""
    try:
        parsed = json.loads(parsed_content)

        # Extract basic info
        service_type, service_name = extract_service_type_and_name(slug)
        location = extract_location_from_title(title)

        # Skip if not a valid service page
        if not service_type or not location:
            return False

        all_text = parsed.get('all_text_content', [])
        lists = parsed.get('lists', [])

        # Extract content
        hero_intro = extract_hero_intro(all_text)
        benefits = extract_benefits(all_text)
        offerings = extract_offerings(lists)
        closing = extract_closing_content(all_text)
        faqs = extract_faqs(all_text)
        related_services = extract_related_services(lists)
        nearby_areas = extract_nearby_areas(lists)

        # Insert into service_pages
        cursor.execute("""
            INSERT INTO service_pages (page_id, service_type, service_name, location, hero_intro, closing_content)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (page_id, service_type, service_name, location, hero_intro, closing))

        service_page_id = cursor.lastrowid

        # Insert benefits
        for i, (heading, content) in enumerate(benefits, 1):
            cursor.execute("""
                INSERT INTO service_benefits (service_page_id, heading, content, benefit_order)
                VALUES (?, ?, ?, ?)
            """, (service_page_id, heading, content, i))

        # Insert offerings
        for i, offering in enumerate(offerings, 1):
            cursor.execute("""
                INSERT INTO service_offerings (service_page_id, offering, offering_order)
                VALUES (?, ?, ?)
            """, (service_page_id, offering, i))

        # Insert FAQs
        for i, (question, answer) in enumerate(faqs, 1):
            cursor.execute("""
                INSERT INTO service_faqs (service_page_id, question, answer, faq_order)
                VALUES (?, ?, ?, ?)
            """, (service_page_id, question, answer, i))

        # Insert related services
        for i, service in enumerate(related_services, 1):
            cursor.execute("""
                INSERT INTO service_related_services (service_page_id, service_name, display_order)
                VALUES (?, ?, ?)
            """, (service_page_id, service, i))

        # Insert nearby areas
        for i, area in enumerate(nearby_areas, 1):
            cursor.execute("""
                INSERT INTO service_nearby_areas (service_page_id, area_name, display_order)
                VALUES (?, ?, ?)
            """, (service_page_id, area, i))

        return True

    except Exception as e:
        print(f"Error migrating page {page_id} ({slug}): {e}")
        return False

def main():
    db_path = '/Users/mikeshaffer/AIVA/website/data/site.db'

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get all service pages
    cursor.execute("""
        SELECT id, slug, title, parsed_content
        FROM pages_all
        WHERE (slug LIKE 'residential-%' OR slug LIKE 'commercial-%')
        ORDER BY id
    """)

    pages = cursor.fetchall()

    print(f"Found {len(pages)} service pages to migrate")
    print("=" * 60)

    migrated = 0
    skipped = 0

    for page_id, slug, title, parsed_content in pages:
        if migrate_service_page(cursor, page_id, slug, title, parsed_content):
            migrated += 1
            if migrated % 50 == 0:
                print(f"Migrated {migrated} pages...")
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
