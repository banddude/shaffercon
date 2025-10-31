#!/usr/bin/env python3
"""
Migrate commercial-electric-vehicle-chargers page to service_landing_pages table.
"""

import sqlite3
import json

def migrate_commercial_ev_page():
    db_path = '/Users/mikeshaffer/AIVA/website/data/site.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get the page
    cursor.execute("""
        SELECT id, slug, title, parsed_content
        FROM pages_all
        WHERE slug = 'commercial-electric-vehicle-chargers'
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
    page_title = "Commercial EV Charger Installation"
    hero_text = all_text[3]  # Main intro paragraph

    # Insert main page
    cursor.execute("""
        INSERT INTO service_landing_pages (page_id, slug, page_title, hero_text)
        VALUES (?, ?, ?, ?)
    """, (page_id, slug, page_title, hero_text))

    landing_page_id = cursor.lastrowid

    # Section 1: About Level 2 and DC Fast Chargers (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'About Level 2 and DC Fast Chargers',
          all_text[7],  # Content text
          1))

    # Section 2: Level 2 Charging Stations (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, subheading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'Level 2 Charging Stations',
          'Elevate Your EV Charging Experience with Level 2 Chargers',
          all_text[10],  # Content after the subheading
          2))

    # Section 3: DC Fast Chargers (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, subheading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'DC Fast Chargers (DCFC)',
          'The Future of Rapid EV Charging',
          all_text[14],  # Content after the subheading
          3))

    # Section 4: Commercial EV Charger Installation (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, subheading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'Commercial EV Charger Installation',
          'Empowering Your Business with EV Chargers',
          all_text[17],  # Content after the subheading
          4))

    # Section 5: Table (comparison chart)
    table_data = json.dumps({
        "headers": ["Type of Charger", "Power Rating", "Charging Speed"],
        "rows": [
            ["Level 2 Chargers", "3.3 – 10 kW", "12 – 40 miles per hour"],
            ["DC Fast Chargers (DCFC)", "25 – 350 kW", "Up to 250 miles in 30 mins"]
        ]
    })

    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, table_data, section_order
        )
        VALUES (?, ?, ?, ?)
    """, (landing_page_id, 'table', table_data, 5))

    # Section 6: Commercial EV Charger Installation (main content)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'content',
          'Commercial EV Charger Installation',
          all_text[33],  # The quoted paragraph
          6))

    # Section 7: How We Can Help You
    how_we_help_text = all_text[35] + "\n\n" + all_text[36]
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'how_we_help',
          'How We Can Help You',
          how_we_help_text,
          7))

    conn.commit()
    conn.close()

    print("✅ Successfully migrated commercial-electric-vehicle-chargers page!")
    print(f"   - 1 main page record")
    print(f"   - 7 content sections")

if __name__ == '__main__':
    migrate_commercial_ev_page()
