#!/usr/bin/env python3
"""
Extract hero_intro content from WordPress XML export and update service_pages table.
The hero_intro should contain BOTH paragraphs from the subheadline field.
"""

import sqlite3
import xml.etree.ElementTree as ET
import re
import html

def clean_html(text):
    """Remove HTML tags and decode entities"""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Decode HTML entities
    text = html.unescape(text)
    # Clean up extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_subheadline_from_content(content):
    """Extract subheadline from WordPress page content"""
    # Look for the headline element with subheadline attribute
    match = re.search(r'"subheadline":"([^"]+)"', content)
    if match:
        subheadline_escaped = match.group(1)
        # Unescape the JSON string
        subheadline = subheadline_escaped.replace('\\/', '/').replace('\\"', '"').replace('\\n', '\n')
        # Clean HTML
        subheadline_clean = clean_html(subheadline)
        return subheadline_clean
    return None

def extract_service_info_from_title(title):
    """Extract location and service info from WordPress page title"""
    # Format: "Residential EV Charger Installation in Torrance"
    # or "Commercial Lighting Installation in Los Angeles"

    if ' in ' not in title.lower():
        return None, None, None

    parts = title.split(' in ')
    if len(parts) != 2:
        return None, None, None

    service_part = parts[0].strip()
    location = parts[1].strip().lower()

    # Determine service type
    if service_part.lower().startswith('residential'):
        service_type = 'residential'
        service_name = service_part[len('Residential'):].strip()
    elif service_part.lower().startswith('commercial'):
        service_type = 'commercial'
        service_name = service_part[len('Commercial'):].strip()
    else:
        return None, None, None

    # Convert service name to slug format
    service_slug = service_name.lower().replace(' ', '-')
    # Remove common punctuation
    service_slug = re.sub(r'[^\w\-]', '', service_slug)

    return location, service_type, service_slug

def main():
    # Parse WordPress XML
    print("Parsing WordPress XML export...")
    tree = ET.parse('/Users/mikeshaffer/Downloads/shafferconstructioninc.WordPress.2025-11-07.xml')
    root = tree.getroot()

    # Find all items (pages/posts)
    namespace = {'content': 'http://purl.org/rss/1.0/modules/content/',
                 'wp': 'http://wordpress.org/export/1.2/'}

    # Connect to database
    db = sqlite3.connect('database/data/site.db')
    cursor = db.cursor()

    updates = 0
    not_found = 0

    # Process each item
    for item in root.findall('.//item'):
        title_elem = item.find('title')
        content_elem = item.find('content:encoded', namespace)

        if title_elem is None or content_elem is None:
            continue

        title = title_elem.text
        content = content_elem.text

        if not title or not content:
            continue

        # Extract service info from title
        location, service_type, service_name = extract_service_info_from_title(title)

        if not location or not service_type or not service_name:
            continue

        # Extract subheadline
        subheadline = extract_subheadline_from_content(content)

        if not subheadline:
            continue

        # Update database
        result = cursor.execute("""
            UPDATE service_pages
            SET hero_intro = ?
            WHERE location = ? AND service_type = ? AND service_name = ?
        """, (subheadline, location, service_type, service_name))

        if cursor.rowcount > 0:
            updates += 1
            print(f"✓ Updated: {location}/{service_type}-{service_name}")
        else:
            not_found += 1
            print(f"✗ Not found in DB: {location}/{service_type}-{service_name}")

    db.commit()
    db.close()

    print(f"\nComplete!")
    print(f"Updated: {updates}")
    print(f"Not found: {not_found}")

if __name__ == '__main__':
    main()
