#!/usr/bin/env python3
"""
Fetch missing og_image values from live WordPress site
"""

import sqlite3
import requests
from bs4 import BeautifulSoup
from pathlib import Path
import time

# Database path
DB_PATH = Path(__file__).parent.parent / "data" / "site.db"

def fetch_image_from_wordpress(slug):
    """Fetch the featured image from WordPress post"""
    url = f"https://shaffercon.com/{slug}/"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        print(f"Fetching: {url}")
        response = requests.get(url, headers=headers, timeout=10)

        if response.status_code != 200:
            print(f"  ❌ Status {response.status_code}")
            return None

        soup = BeautifulSoup(response.content, 'html.parser')

        # Try multiple methods to find the featured image

        # Method 1: og:image meta tag
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            img_url = og_image['content']
            print(f"  ✓ Found og:image: {img_url}")
            return img_url

        # Method 2: Look for featured image in article
        article = soup.find('article')
        if article:
            img = article.find('img')
            if img and img.get('src'):
                img_url = img['src']
                print(f"  ✓ Found article img: {img_url}")
                return img_url

        # Method 3: Any img in main content
        img = soup.find('img')
        if img and img.get('src'):
            img_url = img['src']
            print(f"  ✓ Found img: {img_url}")
            return img_url

        print(f"  ❌ No image found")
        return None

    except Exception as e:
        print(f"  ❌ Error: {e}")
        return None

def main():
    # Connect to database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Get posts from Aug 23 onwards that don't have images
    cursor.execute("""
        SELECT id, slug, title, date
        FROM posts
        WHERE date >= '2025-08-23'
        AND (og_image IS NULL OR og_image = '')
        ORDER BY date DESC
    """)

    posts = cursor.fetchall()

    if not posts:
        print("No posts found that need images")
        return

    print(f"\nFound {len(posts)} posts that need images\n")

    for post_id, slug, title, date in posts:
        print(f"\n{'='*80}")
        print(f"Post: {title}")
        print(f"Date: {date}")
        print(f"Slug: {slug}")

        # Fetch image from WordPress
        image_url = fetch_image_from_wordpress(slug)

        if image_url:
            # Update database
            cursor.execute("""
                UPDATE posts
                SET og_image = ?
                WHERE id = ?
            """, (image_url, post_id))
            print(f"  ✅ Updated database with image")

        # Be nice to the server
        time.sleep(1)

    # Commit changes
    conn.commit()
    conn.close()

    print(f"\n{'='*80}")
    print("✅ Done!")

if __name__ == "__main__":
    main()
