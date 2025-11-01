#!/usr/bin/env python3
"""
Migrate led-retrofit-services page to service_landing_pages table.
"""

import sqlite3
import json

def migrate_led_retrofit_page():
    db_path = '/Users/mikeshaffer/AIVA/website/data/site.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get the page
    cursor.execute("""
        SELECT id, slug, title, parsed_content
        FROM pages_all
        WHERE slug = 'led-retrofit-services'
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
    page_title = "LED Retrofit Services"
    hero_text = all_text[3]  # Main intro paragraph

    # Insert main page
    cursor.execute("""
        INSERT INTO service_landing_pages (page_id, slug, page_title, hero_text)
        VALUES (?, ?, ?, ?)
    """, (page_id, slug, page_title, hero_text))

    landing_page_id = cursor.lastrowid

    # Section 1: Energy Cost Savings (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'Energy Cost Savings',
          all_text[7],
          1))

    # Section 2: Multi-Location Rollouts (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'Multi-Location Rollouts',
          all_text[10],
          2))

    # Section 3: Rebates & Incentives (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'Rebates & Incentives',
          all_text[14],
          3))

    # Section 4: Turnkey Service (info card)
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'info_card',
          'Turnkey Service',
          all_text[17],
          4))

    # Section 5: Table (LED comparison)
    table_data = json.dumps({
        "headers": ["Lighting Type", "Energy Savings", "Lifespan"],
        "rows": [
            ["LED vs. Incandescent", "Up to 75%", "25-50x longer"],
            ["LED vs. Fluorescent", "40-50%", "3-5x longer"],
            ["LED vs. HID/Metal Halide", "50-70%", "2-4x longer"]
        ]
    })

    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, table_data, section_order
        )
        VALUES (?, ?, ?, ?)
    """, (landing_page_id, 'table', table_data, 5))

    # Section 6: Transform Your Lighting, Transform Your Bottom Line
    transform_text = all_text[36] + "\n\n" + all_text[37]
    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'content',
          'Transform Your Lighting, Transform Your Bottom Line',
          transform_text,
          6))

    # Section 7: Comprehensive LED Retrofit Services
    services_list = "\n".join(f"• {item}" for item in lists[0]['items']) if lists else ""
    services_content = services_list + "\n\n" + all_text[43] + "\n\n" + all_text[44]  # List + 2 final paragraphs

    cursor.execute("""
        INSERT INTO service_landing_sections (
            landing_page_id, section_type, heading, content, section_order
        )
        VALUES (?, ?, ?, ?, ?)
    """, (landing_page_id, 'content',
          'Comprehensive LED Retrofit Services',
          services_content,
          7))

    conn.commit()
    conn.close()

    print("✅ Successfully migrated led-retrofit-services page!")
    print(f"   - 1 main page record")
    print(f"   - 7 content sections")

if __name__ == '__main__':
    migrate_led_retrofit_page()
