#!/usr/bin/env python3
"""
Migrate commercial-service page to service_landing_pages table.
"""

import sqlite3
import json

def migrate_commercial_service_page():
    db_path = '/Users/mikeshaffer/AIVA/website/data/site.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get the page
    cursor.execute("""
        SELECT id, slug, title, parsed_content
        FROM pages_all
        WHERE slug = 'commercial-service'
    """)

    row = cursor.fetchone()
    if not row:
        print("Page not found!")
        return

    page_id, slug, title, parsed_content = row
    parsed = json.loads(parsed_content)
    all_text = parsed.get('all_text_content', [])
    lists = parsed.get('lists', [])

    print(f"Migrating: {slug}")
    print("=" * 60)

    # Extract main content
    page_title = "Commercial Electrical Services"
    hero_text = all_text[3] + "\n\n" + all_text[4]  # Two intro paragraphs (content after the H1, before the cards)

    # Actually, checking the data, all_text[4] is too long. Let me use just the first paragraph
    # Index 3 is the first paragraph after the h1
    hero_text = all_text[3]

    # Insert main page
    cursor.execute("""
        INSERT INTO service_landing_pages (page_id, slug, page_title, hero_text)
        VALUES (?, ?, ?, ?)
    """, (page_id, slug, page_title, hero_text))

    landing_page_id = cursor.lastrowid

    # Section 1: Electrical services built for tomorrow (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'Electrical services built for tomorrow.',
          all_text[7],
          1))

    # Section 2: Gain All Necessary Permits and Certifications (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'Gain All Necessary Permits and Certifications',
          all_text[10],
          2))

    # Section 3: The Best Workmanship (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'The Best Workmanship',
          all_text[14],
          3))

    # Section 4: A Comprehensive Design Process (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'A Comprehensive Design Process',
          all_text[17],
          4))

    # Section 5: Services list with intro text
    services_intro = all_text[23]  # "Electrical services can cover..."
    services_list = "\n".join(f"• {item}" for item in lists[0]['items']) if lists else ""
    services_content = services_intro + "\n\n" + services_list

    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, content, section_order
        )
        VALUES (?, ?, ?, ?)
    """, (landing_page_id, 'content', services_content, 5))

    # Section 6: How we can help you (4 paragraphs)
    how_we_help_text = "\n\n".join([all_text[40], all_text[41], all_text[42], all_text[43]])

    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'how_we_help',
          'How we can help you',
          how_we_help_text,
          6))

    conn.commit()
    conn.close()

    print("✅ Successfully migrated commercial-service page!")
    print(f"   - 1 main page record")
    print(f"   - 6 content sections")

if __name__ == '__main__':
    migrate_commercial_service_page()
