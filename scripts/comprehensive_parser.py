#!/usr/bin/env python3
"""
Comprehensive parser that extracts ALL text content from HTML
"""

import sqlite3
import json
from bs4 import BeautifulSoup
import html as html_lib
import re

DB_PATH = "/Users/mikeshaffer/aiva/website/data/site.db"

def clean_text(text):
    """Clean HTML entities and normalize whitespace"""
    if not text:
        return ""
    cleaned = html_lib.unescape(text)
    cleaned = re.sub(r'<[^>]+>', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned


def extract_all_text_content(soup):
    """Extract ALL text content from the page, preserving structure"""
    content = []

    # Get all text-bearing elements in order
    for element in soup.find_all(['p', 'div', 'span', 'li', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
        # Skip if this element contains other text elements (avoid duplication)
        if element.find(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
            continue

        text = clean_text(element.get_text())

        # Include all meaningful text (more than 2 chars to avoid junk)
        if text and len(text) > 2:
            # Avoid duplicates
            if not content or content[-1] != text:
                content.append(text)

    return content


def extract_all_list_items(soup):
    """Extract all list items (ul/ol) with their structure"""
    lists = []

    for ul in soup.find_all(['ul', 'ol']):
        list_items = []
        for li in ul.find_all('li', recursive=False):
            text = clean_text(li.get_text())
            if text:
                list_items.append(text)

        if list_items:
            lists.append({
                'type': ul.name,
                'items': list_items
            })

    return lists


def parse_comprehensive(html_content, slug):
    """Comprehensive parse that captures everything"""
    soup = BeautifulSoup(html_content, 'html.parser')

    data = {
        'page_type': 'comprehensive',
        'slug': slug,
        'headings': [],
        'all_text_content': [],
        'lists': [],
        'images': [],
        'links': []
    }

    # Extract all headings with hierarchy
    for tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
        for heading in soup.find_all(tag):
            text = clean_text(heading.get_text())
            if text:
                data['headings'].append({
                    'level': tag,
                    'text': text
                })

    # Extract ALL text content
    data['all_text_content'] = extract_all_text_content(soup)

    # Extract structured lists
    data['lists'] = extract_all_list_items(soup)

    # Extract all images
    for img in soup.find_all('img'):
        src = img.get('src', '')
        alt = clean_text(img.get('alt', ''))
        if src:
            data['images'].append({
                'src': src,
                'alt': alt if alt else src
            })

    # Extract all links
    for a in soup.find_all('a'):
        href = a.get('href', '')
        text = clean_text(a.get_text())
        if href and text:
            data['links'].append({
                'href': href,
                'text': text
            })

    return data


def parse_all_pages():
    """Parse all pages with comprehensive extraction"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("Comprehensive Parsing - Extracting ALL Content")
    print("=" * 80)

    # Get all pages
    cursor.execute("SELECT id, slug, content FROM pages_all WHERE content IS NOT NULL")
    pages = cursor.fetchall()

    print(f"\nProcessing {len(pages)} pages...")

    success = 0
    errors = 0

    for i, (page_id, slug, html_content) in enumerate(pages, 1):
        try:
            # Parse comprehensively
            parsed_data = parse_comprehensive(html_content, slug)

            # Update database
            cursor.execute("""
                UPDATE pages_all
                SET parsed_content = ?
                WHERE id = ?
            """, (json.dumps(parsed_data), page_id))

            success += 1

            if i % 100 == 0:
                print(f"  Processed {i}/{len(pages)} pages...")
                conn.commit()

        except Exception as e:
            errors += 1
            print(f"  Error parsing {slug}: {e}")

    # Parse posts too
    cursor.execute("SELECT id, slug, content FROM posts WHERE content IS NOT NULL")
    posts = cursor.fetchall()

    print(f"\nProcessing {len(posts)} posts...")

    for i, (post_id, slug, html_content) in enumerate(posts, 1):
        try:
            parsed_data = parse_comprehensive(html_content, slug)

            cursor.execute("""
                UPDATE posts
                SET parsed_content = ?
                WHERE id = ?
            """, (json.dumps(parsed_data), post_id))

            success += 1

            if i % 50 == 0:
                print(f"  Processed {i}/{len(posts)} posts...")
                conn.commit()

        except Exception as e:
            errors += 1
            print(f"  Error parsing post {slug}: {e}")

    conn.commit()
    conn.close()

    print(f"\n{'=' * 80}")
    print(f"✓ Parsing Complete!")
    print(f"  Success: {success}")
    print(f"  Errors: {errors}")
    print(f"  Total: {success + errors}")

    return success, errors


def verify_results():
    """Verify the comprehensive parsing results"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print(f"\n{'=' * 80}")
    print("Verification Report")
    print("=" * 80)

    # Check a sample page
    cursor.execute("""
        SELECT slug, content, parsed_content
        FROM pages_all
        WHERE slug = 'about-us'
    """)

    row = cursor.fetchone()
    if row:
        slug, html_content, parsed_json = row

        # Get text from HTML
        soup = BeautifulSoup(html_content, 'html.parser')
        html_text = soup.get_text(separator=' ', strip=True)
        html_words = len(html_text.split())

        # Get text from parsed
        parsed = json.loads(parsed_json)
        parsed_text = ' '.join(parsed['all_text_content'])
        parsed_words = len(parsed_text.split())

        retention = (parsed_words / html_words * 100) if html_words > 0 else 0

        print(f"\nSample Page: {slug}")
        print(f"  Original HTML: {html_words} words")
        print(f"  Parsed JSON: {parsed_words} words")
        print(f"  Retention: {retention:.1f}%")
        print(f"  Headings: {len(parsed['headings'])}")
        print(f"  Text blocks: {len(parsed['all_text_content'])}")
        print(f"  Lists: {len(parsed['lists'])}")
        print(f"  Images: {len(parsed['images'])}")
        print(f"  Links: {len(parsed['links'])}")

    # Sample 10 random pages for average retention
    cursor.execute("""
        SELECT slug, content, parsed_content
        FROM pages_all
        WHERE LENGTH(content) > 100
        ORDER BY RANDOM()
        LIMIT 10
    """)

    total_retention = 0
    count = 0

    print(f"\n{'=' * 80}")
    print("Random Sample Analysis (10 pages):")
    print("=" * 80)

    for slug, html_content, parsed_json in cursor.fetchall():
        soup = BeautifulSoup(html_content, 'html.parser')
        html_text = soup.get_text(separator=' ', strip=True)
        html_words = len(html_text.split())

        parsed = json.loads(parsed_json)
        parsed_text = ' '.join(parsed['all_text_content'])
        parsed_words = len(parsed_text.split())

        retention = (parsed_words / html_words * 100) if html_words > 0 else 0
        total_retention += retention
        count += 1

        print(f"  {slug[:50]:50} | {html_words:5} → {parsed_words:5} words | {retention:5.1f}%")

    avg_retention = total_retention / count if count > 0 else 0
    print(f"\n  Average Retention: {avg_retention:.1f}%")

    conn.close()


if __name__ == "__main__":
    print("\n" + "=" * 80)
    print("COMPREHENSIVE CONTENT PARSER")
    print("Extracts ALL text content from HTML pages")
    print("=" * 80 + "\n")

    # Parse all pages
    success, errors = parse_all_pages()

    # Verify results
    if success > 0:
        verify_results()

    print(f"\n{'=' * 80}")
    print("✓ All Done!")
    print("=" * 80 + "\n")
