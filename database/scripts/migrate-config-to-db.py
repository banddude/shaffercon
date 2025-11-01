#!/usr/bin/env python3
"""
Migrate site-config.json and menu-structure.json to database tables
"""

import sqlite3
import json
from pathlib import Path

# Database path
DB_PATH = Path(__file__).parent.parent / "data" / "site.db"
JSON_DIR = Path(__file__).parent.parent / "data" / "json"

def migrate_site_config(cursor):
    """Migrate site-config.json to site_config table"""

    # Read site config JSON
    with open(JSON_DIR / "site-config.json", "r") as f:
        config = json.load(f)

    # Insert into site_config table
    cursor.execute("""
        INSERT OR REPLACE INTO site_config (
            id, site_name, logo_url, tagline, description,
            phone, email, address_street, address_city, address_state, address_zip,
            working_hours, license_text, service_area, facebook_url, instagram_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        1,  # Single row
        config["siteName"],
        config["logoUrl"],
        config["tagline"],
        config["description"],
        config["contact"]["phone"],
        config["contact"]["email"],
        config["contact"]["address"]["street"],
        config["contact"]["address"]["city"],
        config["contact"]["address"]["state"],
        config["contact"]["address"]["zip"],
        config["contact"]["workingHours"],
        config["business"]["license"],
        config["business"]["serviceArea"],
        config["social"]["facebook"],
        config["social"]["instagram"]
    ))

    print("✓ Migrated site_config table")

    # Insert licenses
    for i, license_text in enumerate(config["business"]["licenses"]):
        cursor.execute("""
            INSERT INTO licenses (license_text, display_order)
            VALUES (?, ?)
        """, (license_text, i))

    print(f"✓ Migrated {len(config['business']['licenses'])} licenses")

def migrate_menu_structure(cursor):
    """Migrate menu-structure.json to menu_items table"""

    # Read menu structure JSON
    with open(JSON_DIR / "menu-structure.json", "r") as f:
        menu = json.load(f)

    # Insert menu items
    for i, item in enumerate(menu["primaryMenu"]):
        # Insert parent menu item
        cursor.execute("""
            INSERT INTO menu_items (label, href, parent_id, display_order)
            VALUES (?, ?, ?, ?)
        """, (item["label"], item["href"], None, i))

        parent_id = cursor.lastrowid

        # Insert child menu items if they exist
        if "children" in item:
            for j, child in enumerate(item["children"]):
                cursor.execute("""
                    INSERT INTO menu_items (label, href, parent_id, display_order)
                    VALUES (?, ?, ?, ?)
                """, (child["label"], child["href"], parent_id, j))

        print(f"✓ Migrated menu item: {item['label']}")

    # Count total items
    cursor.execute("SELECT COUNT(*) FROM menu_items")
    total = cursor.fetchone()[0]
    print(f"✓ Total menu items migrated: {total}")

def main():
    # Connect to database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create tables
    print("Creating tables...")
    with open(Path(__file__).parent / "create-config-tables.sql", "r") as f:
        cursor.executescript(f.read())
    print("✓ Tables created")

    # Migrate site config
    print("\nMigrating site configuration...")
    migrate_site_config(cursor)

    # Migrate menu structure
    print("\nMigrating menu structure...")
    migrate_menu_structure(cursor)

    # Commit and close
    conn.commit()
    conn.close()

    print("\n✅ Migration complete!")
    print(f"Database: {DB_PATH}")

if __name__ == "__main__":
    main()
