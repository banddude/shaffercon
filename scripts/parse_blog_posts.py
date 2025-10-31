#!/usr/bin/env python3
"""
Parse all blog posts (Industry Insights) and add SEO metadata
"""

import sqlite3
import json
import requests
from bs4 import BeautifulSoup
import html as html_lib
import re
import time

DB_PATH = "/Users/mikeshaffer/aiva/website/data/site.db"
WP_API_URL = "https://shaffercon.com/wp-json/wp/v2"

def clean_text(text):
    """Clean HTML entities and extra whitespace"""
    if not text:
        return ""
    cleaned = html_lib.unescape(text)
    cleaned = re.sub(r'<[^>]+>', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned


def parse_blog_post_html(html_content):
    """Parse blog post HTML content"""
    soup = BeautifulSoup(html_content, 'html.parser')

    data = {
        'page_type': 'blog_post',
        'title': None,
        'excerpt': None,
        'content': [],
        'headings': [],
        'images': [],
        'categories': [],
        'tags': []
    }

    # Extract all headings
    for tag in ['h1', 'h2', 'h3', 'h4']:
        for h in soup.find_all(tag):
            text = clean_text(h.get_text())
            if text:
                data['headings'].append({'level': tag, 'text': text})

    # Extract content paragraphs
    for p in soup.find_all('p'):
        text = clean_text(p.get_text())
        if text and len(text) > 30:
            data['content'].append(text)

    # Use first paragraph as excerpt if available
    if data['content']:
        data['excerpt'] = data['content'][0][:300] + '...' if len(data['content'][0]) > 300 else data['content'][0]

    # Extract images
    for img in soup.find_all('img'):
        src = img.get('src', '')
        alt = clean_text(img.get('alt', ''))
        if src:
            data['images'].append({'src': src, 'alt': alt})

    return data


def fetch_posts_from_wp():
    """Fetch all blog posts from WordPress API with SEO data"""
    all_posts = []
    page = 1
    per_page = 100

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json'
    }

    print("Fetching blog posts from WordPress...")
    print("=" * 80)

    while True:
        url = f"{WP_API_URL}/posts?per_page={per_page}&page={page}"
        print(f"Fetching page {page}... ", end='', flush=True)

        try:
            response = requests.get(url, headers=headers, timeout=30)

            if response.status_code == 200:
                posts = response.json()
                if not posts:
                    print("(no more posts)")
                    break

                all_posts.extend(posts)
                print(f"✓ Got {len(posts)} posts")

                page += 1
                time.sleep(0.5)

            elif response.status_code == 400:
                print("(reached end)")
                break
            else:
                print(f"✗ Error {response.status_code}")
                break

        except Exception as e:
            print(f"✗ Exception: {e}")
            break

    print(f"\n✓ Total posts fetched: {len(all_posts)}")
    return all_posts


def save_posts_to_db(posts):
    """Save blog posts with SEO data and parsed content"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Add columns to posts table if they don't exist
    try:
        cursor.execute("ALTER TABLE posts ADD COLUMN meta_title TEXT")
    except:
        pass
    try:
        cursor.execute("ALTER TABLE posts ADD COLUMN meta_description TEXT")
    except:
        pass
    try:
        cursor.execute("ALTER TABLE posts ADD COLUMN canonical_url TEXT")
    except:
        pass
    try:
        cursor.execute("ALTER TABLE posts ADD COLUMN og_image TEXT")
    except:
        pass
    try:
        cursor.execute("ALTER TABLE posts ADD COLUMN schema_json TEXT")
    except:
        pass
    try:
        cursor.execute("ALTER TABLE posts ADD COLUMN yoast_json TEXT")
    except:
        pass
    try:
        cursor.execute("ALTER TABLE posts ADD COLUMN parsed_content TEXT")
    except:
        pass

    print("\nSaving posts to database...")
    print("=" * 80)

    for i, post in enumerate(posts, 1):
        try:
            # Parse the HTML content
            html_content = post['content']['rendered']
            parsed_data = parse_blog_post_html(html_content)

            # Add title from post
            parsed_data['title'] = clean_text(post['title']['rendered'])

            # Add categories and tags if available
            if 'categories' in post:
                parsed_data['categories'] = post.get('categories', [])
            if 'tags' in post:
                parsed_data['tags'] = post.get('tags', [])

            # Extract SEO data
            yoast = post.get('yoast_head_json', {})
            schema = yoast.get('schema', {})
            og_images = yoast.get('og_image', [])
            og_image = og_images[0]['url'] if og_images else None

            cursor.execute("""
                INSERT OR REPLACE INTO posts
                (id, date, slug, title, content, data,
                 meta_title, meta_description, canonical_url, og_image,
                 schema_json, yoast_json, parsed_content)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                post['id'],
                post.get('date'),
                post['slug'],
                post['title']['rendered'],
                post['content']['rendered'],
                json.dumps(post),
                yoast.get('title'),
                yoast.get('description'),
                yoast.get('canonical'),
                og_image,
                json.dumps(schema) if schema else None,
                json.dumps(yoast),
                json.dumps(parsed_data)
            ))

            if i % 10 == 0:
                print(f"  Saved {i}/{len(posts)} posts...")

        except Exception as e:
            print(f"  ✗ Error saving post {post.get('slug')}: {e}")
            continue

    conn.commit()
    conn.close()
    print(f"✓ Saved {len(posts)} posts to database")


def verify_posts():
    """Verify the saved posts"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("\nVerifying saved posts...")
    print("=" * 80)

    # Count posts
    cursor.execute("SELECT COUNT(*) FROM posts")
    count = cursor.fetchone()[0]
    print(f"Total posts in database: {count}")

    # Check with SEO data
    cursor.execute("SELECT COUNT(*) FROM posts WHERE meta_title IS NOT NULL")
    seo_count = cursor.fetchone()[0]
    print(f"Posts with SEO metadata: {seo_count}/{count}")

    # Check with parsed content
    cursor.execute("SELECT COUNT(*) FROM posts WHERE parsed_content IS NOT NULL")
    parsed_count = cursor.fetchone()[0]
    print(f"Posts with parsed content: {parsed_count}/{count}")

    # Sample post
    cursor.execute("""
        SELECT slug, meta_title, parsed_content
        FROM posts
        LIMIT 1
    """)

    row = cursor.fetchone()
    if row:
        print(f"\nSample post ({row[0]}):")
        print(f"  Meta Title: {row[1]}")

        if row[2]:
            data = json.loads(row[2])
            print(f"  Headings: {len(data.get('headings', []))}")
            print(f"  Paragraphs: {len(data.get('content', []))}")
            print(f"  Excerpt: {data.get('excerpt', '')[:80]}...")

    conn.close()


if __name__ == "__main__":
    print("Blog Posts Parser (Industry Insights)")
    print("=" * 80)
    print()

    # Fetch posts from WordPress
    posts = fetch_posts_from_wp()

    if not posts:
        print("✗ No posts fetched. Exiting.")
        exit(1)

    # Save to database
    save_posts_to_db(posts)

    # Verify
    verify_posts()

    print("\n✓ Blog posts migration complete!")
