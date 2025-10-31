#!/usr/bin/env python3
"""
Migrate electrical-load-studies page to service_landing_pages table.
"""

import sqlite3
import json

def migrate_electrical_load_studies_page():
    db_path = '/Users/mikeshaffer/AIVA/website/data/site.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get the page
    cursor.execute("""
        SELECT id, slug, title, parsed_content
        FROM pages_all
        WHERE slug = 'electrical-load-studies'
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
    page_title = "Professional Electrical Load Study Services"
    hero_text = all_text[3]  # Main intro paragraph

    # Insert main page
    cursor.execute("""
        INSERT INTO service_landing_pages (page_id, slug, page_title, hero_text)
        VALUES (?, ?, ?, ?)
    """, (page_id, slug, page_title, hero_text))

    landing_page_id = cursor.lastrowid

    # Section 1: EV Charging Planning (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'EV Charging Planning',
          all_text[7],
          1))

    # Section 2: Professional Data Analysis (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'Professional Data Analysis',
          all_text[10],
          2))

    # Section 3: Engineering Documentation (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'Engineering Documentation',
          all_text[14],
          3))

    # Section 4: Capacity & Code Compliance (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'Capacity & Code Compliance',
          all_text[17],
          4))

    # Section 5: Table (study types comparison)
    table_data = json.dumps({
        "headers": ["Study Type", "Duration", "Deliverables"],
        "rows": [
            ["Panel Load Study", "7-14 days", "Capacity report, recommendations"],
            ["EV Charging Study", "14-21 days", "Load analysis, utility coordination"],
            ["Service Entrance", "21-30 days", "Full facility analysis, upgrade plan"],
            ["Power Quality", "7-30 days", "Harmonic analysis, solutions"]
        ]
    })

    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, table_data, section_order
        )
        VALUES (?, ?, ?, ?)
    """, (landing_page_id, 'table', table_data, 5))

    # Section 6: Critical Data for Critical Decisions
    critical_data_text = all_text[38] + "\n\n" + all_text[39]
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'content',
          'Critical Data for Critical Decisions',
          critical_data_text,
          6))

    # Section 7: Comprehensive Load Study Services
    services_intro = all_text[41]  # "Our load studies support..."
    services_list = "\n".join(f"• {item}" for item in lists[0]['items']) if lists else ""
    services_content = services_intro + "\n\n" + services_list + "\n\n" + all_text[47]  # Final paragraph

    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'content',
          'Comprehensive Load Study Services',
          services_content,
          7))

    conn.commit()
    conn.close()

    print("✅ Successfully migrated electrical-load-studies page!")
    print(f"   - 1 main page record")
    print(f"   - 7 content sections")

if __name__ == '__main__':
    migrate_electrical_load_studies_page()
