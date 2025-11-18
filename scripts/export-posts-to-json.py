#!/usr/bin/env python3
"""
Export all blog posts from SQLite database to JSON files
"""

import sqlite3
import json
import os
import re
from datetime import datetime

# Paths
DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'database', 'data', 'site.db')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'content', 'industry-insights')

# Create output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Connect to database
conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Get all posts
cursor.execute("""
    SELECT id, slug, title, date, markdown, meta_title, meta_description, canonical_url, og_image
    FROM posts
    ORDER BY date DESC
""")

posts = cursor.fetchall()

print(f"Found {len(posts)} posts to export...")

for post in posts:
    # Create filename from date and slug
    date = post['date'] or datetime.now().strftime('%Y-%m-%d')
    slug = post['slug']
    filename = f"{date}-{slug}.json"
    filepath = os.path.join(OUTPUT_DIR, filename)

    # Convert markdown to HTML (simple conversion)
    # In a real scenario, you might want to use a proper markdown-to-HTML converter
    content_html = post['markdown'] or ''

    # Simple markdown to HTML conversions
    if content_html:
        # Convert headers
        content_html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', content_html, flags=re.MULTILINE)
        content_html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', content_html, flags=re.MULTILINE)
        content_html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', content_html, flags=re.MULTILINE)
        content_html = re.sub(r'^#### (.+)$', r'<h4>\1</h4>', content_html, flags=re.MULTILINE)

        # Convert bold
        content_html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', content_html)

        # Convert italic
        content_html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', content_html)

        # Convert links
        content_html = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', content_html)

        # Convert images
        content_html = re.sub(r'!\[(.+?)\]\((.+?)\)', r'<img src="\2" alt="\1" />', content_html)

        # Convert paragraphs (simple approach: double newlines)
        paragraphs = content_html.split('\n\n')
        content_html = ''.join([f'<p>{p.strip()}</p>' if p.strip() and not p.strip().startswith('<') else p for p in paragraphs])

    # Create JSON structure
    post_data = {
        "title": post['title'],
        "slug": post['slug'],
        "date": post['date'] or datetime.now().strftime('%Y-%m-%d'),
        "metaTitle": post['meta_title'] or post['title'],
        "metaDescription": post['meta_description'] or '',
        "ogImage": post['og_image'] or '',
        "canonicalUrl": post['canonical_url'] or '',
        "content": content_html
    }

    # Write JSON file
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(post_data, f, indent=2, ensure_ascii=False)

    print(f"Exported: {filename}")

print(f"\nExported {len(posts)} posts to {OUTPUT_DIR}")
conn.close()
