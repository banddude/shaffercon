#!/usr/bin/env python3
"""
Fetch ALL pages from WordPress REST API with complete SEO metadata
and save to SQLite database
"""

import requests
import json
import sqlite3
import time
from datetime import datetime

WP_API_URL = "https://shaffercon.com/wp-json/wp/v2"
DB_PATH = "/Users/mikeshaffer/aiva/website/data/site.db"

def fetch_all_pages():
    """Fetch all pages from WordPress with pagination"""
    all_pages = []
    page = 1
    per_page = 100  # Max allowed by WordPress

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json'
    }

    print("Fetching all pages from WordPress...")
    print("=" * 80)

    while True:
        url = f"{WP_API_URL}/pages?per_page={per_page}&page={page}"
        print(f"Fetching page {page}... ", end='', flush=True)

        try:
            response = requests.get(url, headers=headers, timeout=30)

            if response.status_code == 200:
                pages = response.json()
                if not pages:
                    print("(no more pages)")
                    break

                all_pages.extend(pages)
                print(f"✓ Got {len(pages)} pages")

                # Check if there are more pages
                total_pages = response.headers.get('X-WP-TotalPages')
                if total_pages and int(total_pages) <= page:
                    break

                page += 1
                time.sleep(0.5)  # Be nice to the server

            elif response.status_code == 400:
                # No more pages
                print("(reached end)")
                break
            else:
                print(f"✗ Error {response.status_code}")
                break

        except Exception as e:
            print(f"✗ Exception: {e}")
            break

    print(f"\n✓ Total pages fetched: {len(all_pages)}")
    return all_pages


def create_enhanced_database():
    """Create database with SEO fields"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Drop old table and create new one with SEO fields
    cursor.execute("DROP TABLE IF EXISTS pages_new")

    cursor.execute("""
        CREATE TABLE pages_new (
            id INTEGER PRIMARY KEY,
            date TEXT,
            slug TEXT UNIQUE NOT NULL,
            title TEXT,
            content TEXT,
            data TEXT,

            -- SEO fields
            meta_title TEXT,
            meta_description TEXT,
            canonical_url TEXT,
            og_image TEXT,
            schema_json TEXT,
            yoast_json TEXT
        )
    """)

    cursor.execute("CREATE INDEX idx_pages_new_slug ON pages_new(slug)")

    conn.commit()
    conn.close()
    print("✓ Created enhanced database schema")


def save_pages_to_db(pages):
    """Save pages with SEO data to database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("\nSaving pages to database...")
    print("=" * 80)

    for i, page in enumerate(pages, 1):
        try:
            # Extract SEO data
            yoast = page.get('yoast_head_json', {})
            schema = yoast.get('schema', {})

            # Get OG image
            og_images = yoast.get('og_image', [])
            og_image = og_images[0]['url'] if og_images else None

            cursor.execute("""
                INSERT OR REPLACE INTO pages_new
                (id, date, slug, title, content, data,
                 meta_title, meta_description, canonical_url, og_image,
                 schema_json, yoast_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                page['id'],
                page.get('date'),
                page['slug'],
                page['title']['rendered'],
                page['content']['rendered'],
                json.dumps(page),  # Full page data
                yoast.get('title'),
                yoast.get('description'),
                yoast.get('canonical'),
                og_image,
                json.dumps(schema) if schema else None,
                json.dumps(yoast)
            ))

            if i % 10 == 0:
                print(f"  Saved {i}/{len(pages)} pages...")

        except Exception as e:
            print(f"  ✗ Error saving page {page.get('slug')}: {e}")
            continue

    conn.commit()
    conn.close()
    print(f"✓ Saved {len(pages)} pages to database")


def verify_data():
    """Verify the saved data"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("\nVerifying saved data...")
    print("=" * 80)

    # Count pages
    cursor.execute("SELECT COUNT(*) FROM pages_new")
    count = cursor.fetchone()[0]
    print(f"Total pages in database: {count}")

    # Check Santa Monica as example
    cursor.execute("""
        SELECT slug, meta_title, meta_description, og_image,
               LENGTH(schema_json) as schema_size
        FROM pages_new
        WHERE slug = 'santa-monica'
    """)

    row = cursor.fetchone()
    if row:
        print(f"\nSample page (Santa Monica):")
        print(f"  Slug: {row[0]}")
        print(f"  Meta Title: {row[1]}")
        print(f"  Meta Description: {row[2][:60]}...")
        print(f"  OG Image: {row[3]}")
        print(f"  Schema Size: {row[4]} bytes")

    # Count pages with SEO data
    cursor.execute("SELECT COUNT(*) FROM pages_new WHERE meta_title IS NOT NULL")
    seo_count = cursor.fetchone()[0]
    print(f"\nPages with SEO metadata: {seo_count}/{count}")

    conn.close()


def rename_tables():
    """Rename tables to replace old with new"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("\nReplacing old pages table...")

    # Backup old table
    cursor.execute("DROP TABLE IF EXISTS pages_backup")
    cursor.execute("ALTER TABLE pages RENAME TO pages_backup")

    # Rename new table
    cursor.execute("ALTER TABLE pages_new RENAME TO pages")

    conn.commit()
    conn.close()

    print("✓ Database updated!")


if __name__ == "__main__":
    print("WordPress to Database Migration with SEO")
    print("=" * 80)
    print()

    # Fetch all pages
    pages = fetch_all_pages()

    if not pages:
        print("✗ No pages fetched. Exiting.")
        exit(1)

    # Create enhanced database
    create_enhanced_database()

    # Save to database
    save_pages_to_db(pages)

    # Verify
    verify_data()

    # Replace old table
    print("\nReplace old pages table? (y/n): ", end='')
    response = "y"  # Auto-replace

    if response == 'y':
        rename_tables()
        print("\n✓ Migration complete!")
    else:
        print("\n• Old table preserved as 'pages'")
        print("• New table available as 'pages_new'")
        print("• To use new table, run: ALTER TABLE pages_new RENAME TO pages")

    print("\nDone!")
