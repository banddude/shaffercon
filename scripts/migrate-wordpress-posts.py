#!/usr/bin/env python3
"""
Migrate WordPress posts to JSON format
Fetches posts from WordPress via SSH and creates JSON files
"""

import subprocess
import json
import os
import re
from datetime import datetime

# Paths
OUTPUT_DIR = '/Users/mikeshaffer/AIVA/website/content/industry-insights'

def get_wordpress_posts():
    """Get all WordPress posts via SSH"""
    cmd = [
        'ssh', '-i', os.path.expanduser('~/.ssh/id_rsa'),
        'shaffes0@162.241.219.161',
        'cd /home/shaffes0/public_html && wp post list --post_type=post --posts_per_page=300 --orderby=date --order=desc --fields=ID,post_title,post_date,post_name,post_content --format=json | cat'
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error fetching WordPress posts: {result.stderr}")
        return []

    return json.loads(result.stdout)

def get_existing_slugs():
    """Get all existing JSON file slugs"""
    existing = set()
    for filename in os.listdir(OUTPUT_DIR):
        if filename.endswith('.json'):
            with open(os.path.join(OUTPUT_DIR, filename), 'r') as f:
                data = json.load(f)
                existing.add(data['slug'])
    return existing

def clean_html(html):
    """Clean WordPress HTML for our format"""
    if not html:
        return ""

    # Remove WordPress HTML comments
    html = re.sub(r'<!--.*?-->', '', html, flags=re.DOTALL)

    # Remove empty paragraphs
    html = re.sub(r'<p>\s*</p>', '', html)

    # Remove style attributes
    html = re.sub(r'\s+style="[^"]*"', '', html)

    # Remove class attributes
    html = re.sub(r'\s+class="[^"]*"', '', html)

    # Clean up whitespace
    html = re.sub(r'\s+', ' ', html)
    html = re.sub(r'>\s+<', '><', html)

    return html.strip()

def migrate_post(post, existing_slugs):
    """Migrate a single WordPress post to JSON"""
    slug = post['post_name']

    # Skip if already exists
    if slug in existing_slugs:
        return False

    # Parse date
    date_obj = datetime.strptime(post['post_date'], '%Y-%m-%d %H:%M:%S')
    date_iso = date_obj.strftime('%Y-%m-%dT%H:%M:%S')

    # Create filename
    filename = f"{date_iso}-{slug}.json"
    filepath = os.path.join(OUTPUT_DIR, filename)

    # Clean content
    content = clean_html(post['post_content'])

    # Create JSON structure
    post_data = {
        "title": post['post_title'],
        "slug": slug,
        "date": date_iso,
        "metaTitle": f"{post['post_title']} | Shaffer Construction",
        "metaDescription": post['post_title'][:157] + "..." if len(post['post_title']) > 157 else post['post_title'],
        "ogImage": "",
        "canonicalUrl": f"https://shaffercon.com/{slug}/",
        "content": content
    }

    # Write JSON file
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(post_data, f, indent=2, ensure_ascii=False)

    print(f"Migrated: {filename}")
    return True

def main():
    print("Fetching WordPress posts...")
    wp_posts = get_wordpress_posts()
    print(f"Found {len(wp_posts)} WordPress posts")

    print("\nChecking existing JSON files...")
    existing_slugs = get_existing_slugs()
    print(f"Found {len(existing_slugs)} existing JSON posts")

    print("\nMigrating missing posts...")
    migrated_count = 0

    for post in wp_posts:
        if migrate_post(post, existing_slugs):
            migrated_count += 1

    print(f"\n✓ Migrated {migrated_count} new posts")
    print(f"✓ Total JSON posts: {len(existing_slugs) + migrated_count}")

if __name__ == '__main__':
    main()
