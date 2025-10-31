#!/usr/bin/env python3
"""
Migrate remaining unique pages (home, about-us, service-areas, footer) using page_sections.
These pages have unique structures, so we'll store them as flexible sections.
"""

import sqlite3
import json

def migrate_page_to_sections(cursor, slug: str):
    """Migrate a page to page_sections format"""

    cursor.execute("""
        SELECT id, slug, title, parsed_content
        FROM pages_all
        WHERE slug = ?
    """, (slug,))

    row = cursor.fetchone()
    if not row:
        print(f"  ⚠️  Page not found: {slug}")
        return False

    page_id, slug, title, parsed_content = row

    try:
        parsed = json.loads(parsed_content)
        all_text = parsed.get('all_text_content', [])
        headings = parsed.get('headings', [])

        # Create sections from headings and content
        section_order = 1

        # Add main heading as hero section
        if headings:
            cursor.execute("""
                INSERT INTO page_sections (page_id, section_type, heading, section_order)
                VALUES (?, ?, ?, ?)
            """, (page_id, 'hero', headings[0].get('text', ''), section_order))
            section_order += 1

        # Add remaining content as generic sections
        # Group content by headings
        for i, heading in enumerate(headings[1:], 1):
            heading_text = heading.get('text', '')

            # Find content between this heading and next
            # For simplicity, we'll just store heading
            cursor.execute("""
                INSERT INTO page_sections (page_id, section_type, heading, section_order)
                VALUES (?, ?, ?, ?)
            """, (page_id, 'content', heading_text, section_order))
            section_order += 1

        # Store all text content as a single content section
        if all_text:
            combined_content = '\n\n'.join([t for t in all_text if len(t) > 50])  # Only substantial paragraphs
            cursor.execute("""
                INSERT INTO page_sections (page_id, section_type, content, section_order)
                VALUES (?, ?, ?, ?)
            """, (page_id, 'full_content', combined_content, section_order))

        return True

    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def main():
    db_path = '/Users/mikeshaffer/AIVA/website/data/site.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    pages_to_migrate = ['home', 'about-us', 'service-areas', 'footer']

    print("=" * 60)
    print("MIGRATING REMAINING UNIQUE PAGES")
    print("=" * 60)

    migrated = 0
    for slug in pages_to_migrate:
        print(f"\nMigrating: {slug}")
        if migrate_page_to_sections(cursor, slug):
            migrated += 1
            print(f"  ✅ Success")
        else:
            print(f"  ❌ Failed")

    conn.commit()
    conn.close()

    print("\n" + "=" * 60)
    print(f"Migration complete!")
    print(f"  Migrated: {migrated}/{len(pages_to_migrate)} pages")
    print("=" * 60)

if __name__ == '__main__':
    main()
