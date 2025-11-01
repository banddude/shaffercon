#!/usr/bin/env python3
"""
Fetch ALL 920 pages and save them properly
"""

import requests
import json
import sqlite3
import time

WP_API_URL = "https://shaffercon.com/wp-json/wp/v2"
DB_PATH = "/Users/mikeshaffer/aiva/website/data/site.db"

def fetch_all_pages():
    """Fetch all pages from WordPress"""
    all_pages = []
    page = 1
    per_page = 100

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json'
    }

    print("Fetching ALL pages from WordPress...")
    print("=" * 80)

    while True:
        url = f"{WP_API_URL}/pages?per_page={per_page}&page={page}"
        print(f"Page {page}... ", end='', flush=True)

        try:
            response = requests.get(url, headers=headers, timeout=30)

            if response.status_code == 200:
                pages = response.json()
                if not pages:
                    print("done")
                    break

                all_pages.extend(pages)
                print(f"✓ {len(pages)}")
                page += 1
                time.sleep(0.5)

            elif response.status_code == 400:
                print("reached end")
                break
            else:
                print(f"error {response.status_code}")
                break

        except Exception as e:
            print(f"exception: {e}")
            break

    print(f"\n✓ Fetched {len(all_pages)} total pages")
    return all_pages


def save_all_pages(pages):
    """Save ALL pages to database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("\nSaving to database...")
    print("=" * 80)

    saved = 0
    skipped = 0
    errors = 0

    for i, page in enumerate(pages, 1):
        try:
            # Check if slug already exists
            cursor.execute("SELECT id FROM pages WHERE slug = ?", (page['slug'],))
            existing = cursor.fetchone()

            if existing:
                # Update existing
                yoast = page.get('yoast_head_json', {})
                og_images = yoast.get('og_image', [])
                og_image = og_images[0]['url'] if og_images else None

                cursor.execute("""
                    UPDATE pages
                    SET date = ?, title = ?, content = ?, data = ?,
                        meta_title = ?, meta_description = ?, canonical_url = ?,
                        og_image = ?, schema_json = ?, yoast_json = ?
                    WHERE slug = ?
                """, (
                    page.get('date'),
                    page['title']['rendered'],
                    page['content']['rendered'],
                    json.dumps(page),
                    yoast.get('title'),
                    yoast.get('description'),
                    yoast.get('canonical'),
                    og_image,
                    json.dumps(yoast.get('schema', {})) if yoast.get('schema') else None,
                    json.dumps(yoast),
                    page['slug']
                ))
                skipped += 1
            else:
                # Insert new
                yoast = page.get('yoast_head_json', {})
                og_images = yoast.get('og_image', [])
                og_image = og_images[0]['url'] if og_images else None

                cursor.execute("""
                    INSERT INTO pages
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
                    json.dumps(page),
                    yoast.get('title'),
                    yoast.get('description'),
                    yoast.get('canonical'),
                    og_image,
                    json.dumps(yoast.get('schema', {})) if yoast.get('schema') else None,
                    json.dumps(yoast)
                ))
                saved += 1

            if i % 50 == 0:
                print(f"  Processed {i}/{len(pages)} (saved: {saved}, updated: {skipped}, errors: {errors})")
                conn.commit()

        except Exception as e:
            errors += 1
            print(f"  ✗ Error with {page.get('slug', 'unknown')}: {e}")

    conn.commit()
    conn.close()

    print(f"\n✓ Complete!")
    print(f"  New pages saved: {saved}")
    print(f"  Existing updated: {skipped}")
    print(f"  Errors: {errors}")
    print(f"  Total processed: {saved + skipped}")


if __name__ == "__main__":
    print("Fetch ALL 920 Pages")
    print("=" * 80)
    print()

    pages = fetch_all_pages()

    if pages:
        save_all_pages(pages)

        # Show final count
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM pages")
        total = cursor.fetchone()[0]
        conn.close()

        print(f"\n✓ Database now has {total} pages")
    else:
        print("✗ No pages fetched")
