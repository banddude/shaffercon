#!/usr/bin/env python3
"""
Migrate residential-ev-charger page to service_landing_pages table.
"""

import sqlite3
import json

def migrate_residential_ev_charger_page():
    db_path = '/Users/mikeshaffer/AIVA/website/data/site.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get the page
    cursor.execute("""
        SELECT id, slug, title, parsed_content
        FROM pages_all
        WHERE slug = 'residential-ev-charger'
    """)

    row = cursor.fetchone()
    if not row:
        print("Page not found!")
        return

    page_id, slug, title, parsed_content = row
    parsed = json.loads(parsed_content)
    all_text = parsed.get('all_text_content', [])

    print(f"Migrating: {slug}")
    print("=" * 60)

    # Extract main content
    page_title = "Shaffer Construction: Your Trusted Partner in EV Charging"
    hero_text = all_text[3]  # Main intro paragraph

    # Insert main page
    cursor.execute("""
        INSERT INTO service_landing_pages (page_id, slug, page_title, hero_text)
        VALUES (?, ?, ?, ?)
    """, (page_id, slug, page_title, hero_text))

    landing_page_id = cursor.lastrowid

    # Section 1: About Level 2 Chargers (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'About Level 2 Chargers',
          all_text[6],
          1))

    # Section 2: Table (Level 2 specs)
    table_data = json.dumps({
        "headers": ["Type", "Power Rating", "Range added"],
        "rows": [
            ["Level 2", "3.3-10 kW/HR", "12-40 miles per hour"]
        ]
    })

    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, table_data, section_order
        )
        VALUES (?, ?, ?, ?)
    """, (landing_page_id, 'table', table_data, 2))

    # Section 3: Why Choose Shaffer Construction
    why_choose_text = all_text[26] + "\n\n" + all_text[27]
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'content',
          'Why Choose Shaffer Construction for Your Residential EV Charger Installation?',
          why_choose_text,
          3))

    conn.commit()
    conn.close()

    print("✅ Successfully migrated residential-ev-charger page!")
    print(f"   - 1 main page record")
    print(f"   - 3 content sections")

if __name__ == '__main__':
    migrate_residential_ev_charger_page()
