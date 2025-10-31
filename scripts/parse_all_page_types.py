#!/usr/bin/env python3
"""
Parse all page types and extract structured content
"""

import sqlite3
import json
from bs4 import BeautifulSoup
import html as html_lib
import re

DB_PATH = "/Users/mikeshaffer/aiva/website/data/site.db"

def clean_text(text):
    """Clean HTML entities and extra whitespace"""
    if not text:
        return ""
    # Decode HTML entities
    cleaned = html_lib.unescape(text)
    # Remove HTML tags
    cleaned = re.sub(r'<[^>]+>', '', cleaned)
    # Clean whitespace
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned


def parse_generic_page(html_content):
    """Parse a generic page (About Us, Contact, etc.)"""
    soup = BeautifulSoup(html_content, 'html.parser')

    data = {
        'page_type': 'generic',
        'headings': [],
        'paragraphs': [],
        'sections': [],
        'images': [],
        'links': []
    }

    # Extract all headings
    for tag in ['h1', 'h2', 'h3', 'h4']:
        for heading in soup.find_all(tag):
            text = clean_text(heading.get_text())
            if text:
                data['headings'].append({
                    'level': tag,
                    'text': text
                })

    # Extract all paragraphs
    for p in soup.find_all('p'):
        text = clean_text(p.get_text())
        if text and len(text) > 20:  # Only meaningful paragraphs
            data['paragraphs'].append(text)

    # Extract images
    for img in soup.find_all('img'):
        src = img.get('src', '')
        alt = clean_text(img.get('alt', ''))
        if src:
            data['images'].append({'src': src, 'alt': alt})

    # Extract internal links
    for a in soup.find_all('a'):
        href = a.get('href', '')
        text = clean_text(a.get_text())
        if href and text and ('shaffercon.com' in href or href.startswith('/')):
            data['links'].append({'href': href, 'text': text})

    return data


def identify_page_type(slug, html_content):
    """Identify what type of page this is"""
    soup = BeautifulSoup(html_content, 'html.parser')

    # Check for specific patterns
    if slug in ['about-us', 'about']:
        return 'about'
    elif slug in ['contact-us', 'contact']:
        return 'contact'
    elif slug == 'service-areas':
        return 'service_areas_list'
    elif slug == 'home' or slug == '':
        return 'homepage'
    elif slug == 'estimator':
        return 'estimator'

    # Check if it's a city page
    h1 = soup.find('h1')
    if h1 and 'ELECTRICAL SERVICES IN' in h1.get_text().upper():
        return 'city'

    # Check if it's a service page
    if any(keyword in slug for keyword in ['residential-', 'commercial-', '-service', '-installation']):
        return 'service'

    # Check if it's a main service (like LED Retrofit, Load Studies)
    if any(slug.endswith(suffix) for suffix in ['-services', '-studies', '-maintenance']):
        if not any(city in slug for city in ['torrance', 'pasadena', 'santa-monica']):
            return 'main_service'

    return 'generic'


def parse_all_pages():
    """Parse all pages and update parsed_content"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Get all pages that need parsing (pages without city_name in parsed_content)
    cursor.execute("""
        SELECT id, slug, content, parsed_content
        FROM pages_all
        WHERE content IS NOT NULL
    """)

    pages = cursor.fetchall()

    print(f"Analyzing {len(pages)} pages...")
    print("=" * 80)

    # Count page types
    page_types = {}
    to_update = []

    for page_id, slug, html_content, existing_parsed in pages:
        page_type = identify_page_type(slug, html_content)
        page_types[page_type] = page_types.get(page_type, 0) + 1

        # Check if it needs updating
        if existing_parsed:
            try:
                parsed_data = json.loads(existing_parsed)
                # If it's a city page with proper data, skip
                if parsed_data.get('city_name') and len(parsed_data.get('residential_services', [])) > 0:
                    continue
            except:
                pass

        # Pages that need updating
        to_update.append((page_id, slug, html_content, page_type))

    print("\nPage Type Distribution:")
    for ptype, count in sorted(page_types.items()):
        print(f"  {ptype}: {count}")

    print(f"\nPages needing updated parsing: {len(to_update)}")

    return to_update, page_types


if __name__ == "__main__":
    print("Page Type Analyzer")
    print("=" * 80)
    print()

    to_update, page_types = parse_all_pages()

    if to_update:
        print("\nSample pages to update:")
        for page_id, slug, _, ptype in to_update[:20]:
            print(f"  {slug} ({ptype})")
