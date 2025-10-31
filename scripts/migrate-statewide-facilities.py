#!/usr/bin/env python3
"""
Migrate statewide-facilities-maintenance page to service_landing_pages table.
"""

import sqlite3
import json

def migrate_statewide_facilities_page():
    db_path = '/Users/mikeshaffer/AIVA/website/data/site.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get the page
    cursor.execute("""
        SELECT id, slug, title, parsed_content
        FROM pages_all
        WHERE slug = 'statewide-facilities-maintenance'
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
    page_title = "Statewide Facilities Maintenance Electrical Services"
    hero_text = all_text[3]  # Main intro paragraph

    # Insert main page
    cursor.execute("""
        INSERT INTO service_landing_pages (page_id, slug, page_title, hero_text)
        VALUES (?, ?, ?, ?)
    """, (page_id, slug, page_title, hero_text))

    landing_page_id = cursor.lastrowid

    # Section 1: Emergency Electrical Repairs (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'Emergency Electrical Repairs',
          all_text[7],
          1))

    # Section 2: Preventive Maintenance Programs (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'Preventive Maintenance Programs',
          all_text[10],
          2))

    # Section 3: Lighting Maintenance & Repairs (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'Lighting Maintenance & Repairs',
          all_text[14],
          3))

    # Section 4: Multi-Location Coverage (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'Multi-Location Coverage',
          all_text[17],
          4))

    # Section 5: Table (service types)
    table_data = json.dumps({
        "headers": ["Service Type", "Response Time", "Coverage"],
        "rows": [
            ["Emergency Repairs", "2-4 hours", "24/7/365 Statewide"],
            ["Preventive Maintenance", "Scheduled", "All CA Locations"],
            ["Lighting Services", "Same/Next Day", "Interior & Exterior"],
            ["Troubleshooting", "4-8 hours", "All Electrical Systems"]
        ]
    })

    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, table_data, section_order
        )
        VALUES (?, ?, ?, ?)
    """, (landing_page_id, 'table', table_data, 5))

    # Section 6: Complete Facilities Maintenance Solutions
    facilities_text = all_text[38] + "\n\n" + all_text[39]
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'content',
          'Complete Facilities Maintenance Solutions',
          facilities_text,
          6))

    # Section 7: Industries We Serve
    industries_intro = all_text[41]
    industries_list = "\n".join(f"• {item}" for item in lists[0]['items']) if lists else ""
    industries_content = industries_intro + "\n\n" + industries_list + "\n\n" + all_text[47] + "\n\n" + all_text[48]

    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'content',
          'Industries We Serve',
          industries_content,
          7))

    conn.commit()
    conn.close()

    print("✅ Successfully migrated statewide-facilities-maintenance page!")
    print(f"   - 1 main page record")
    print(f"   - 7 content sections")

if __name__ == '__main__':
    migrate_statewide_facilities_page()
