#!/usr/bin/env python3
"""
Re-import ALL content from WordPress XML export to database.
Extracts hero_intro, benefits, offerings, FAQs, and closing content.
"""

import sqlite3
import xml.etree.ElementTree as ET
import re
import html as html_lib
import json
from bs4 import BeautifulSoup

def clean_text(text):
    """Remove HTML tags and decode entities"""
    if not text:
        return ""
    # Decode HTML entities
    text = html_lib.unescape(text)
    # Remove HTML tags using BeautifulSoup
    soup = BeautifulSoup(text, 'html.parser')
    text = soup.get_text()
    # Clean up whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_service_info(title, slug):
    """Extract location, service_type, service_name from title and slug"""
    # Title format: "Residential EV Charger Installation in Torrance"
    # Slug format: "residential-ev-charger-installation"

    if ' in ' not in title:
        return None, None, None

    parts = title.split(' in ')
    location = parts[-1].strip().lower()
    service_full = parts[0].strip()

    # Determine service type from slug
    if slug.startswith('residential-'):
        service_type = 'residential'
        service_name = slug.replace('residential-', '')
    elif slug.startswith('commercial-'):
        service_type = 'commercial'
        service_name = slug.replace('commercial-', '')
    else:
        return None, None, None

    return location, service_type, service_name

def extract_hero_intro(content):
    """Extract hero intro from subheadline field"""
    # First decode HTML entities in the content
    content_decoded = html_lib.unescape(content)

    # Now search for subheadline
    match = re.search(r'"subheadline":"([^"]+(?:\\"[^"]*)*)"', content_decoded)
    if not match:
        return None

    subheadline = match.group(1)
    # Unescape JSON escapes
    subheadline = subheadline.replace('\\/', '/').replace('\\"', '"').replace('\\n', '\n').replace('\\t', ' ')
    # Clean HTML tags
    return clean_text(subheadline)

def extract_benefits(html_content):
    """Extract benefit heading/content pairs from bt_bb_service elements"""
    # Decode HTML entities first
    html_decoded = html_lib.unescape(html_content)

    benefits = []

    # Find all data-bt-bb-fe-atts JSON blocks (these contain title/text for services)
    pattern = r'data-bt-bb-fe-atts="(\{[^}]+\})"'
    matches = re.findall(pattern, html_decoded)

    for json_str in matches:
        try:
            # Fix any remaining escapes and parse as JSON
            json_clean = json_str.replace("\\'", "'")
            data = json.loads(json_clean)

            # Check if this has title and text (indicates it's a service/benefit)
            if 'title' in data and 'text' in data:
                title = clean_text(data['title'])
                text = clean_text(data['text'])

                # Filter out non-benefit sections
                if title and text and len(text) > 30:
                    # Skip navigation/CTA sections
                    if 'Call' not in title and 'Related' not in title and 'Nearby' not in title:
                        benefits.append((title, text))
        except (json.JSONDecodeError, ValueError):
            pass

    return benefits  # Return all benefits found

def extract_offerings(html_content):
    """Extract service offerings from first <ul> list"""
    soup = BeautifulSoup(html_content, 'html.parser')

    # Find first ul that's not in navigation
    for ul in soup.find_all('ul'):
        items = []
        for li in ul.find_all('li'):
            text = clean_text(li.get_text())
            if text and len(text) > 5:  # Real offerings, not nav items
                items.append(text)

        if len(items) >= 5:  # Must have at least 5 items to be the offerings list
            return items

    return []

def extract_offerings_intro(html_content):
    """Extract the intro paragraph before the offerings list"""
    soup = BeautifulSoup(html_content, 'html.parser')

    # Find first ul with many items (the offerings list)
    offerings_ul = None
    for ul in soup.find_all('ul'):
        items = ul.find_all('li')
        if len(items) >= 10:  # Offerings list has 10+ items
            offerings_ul = ul
            break

    if not offerings_ul:
        return None

    # Get the previous paragraph sibling
    prev_p = offerings_ul.find_previous_sibling('p')
    if prev_p:
        text = clean_text(prev_p.get_text())
        if text and len(text) > 30 and 'We offer' in text:
            return text

    return None

def extract_faqs(html_content):
    """Extract FAQ question/answer pairs from bt_bb_accordion_item elements"""
    # Decode HTML entities
    html_decoded = html_lib.unescape(html_content)
    soup = BeautifulSoup(html_decoded, 'html.parser')

    faqs = []

    # Find all accordion items (FAQs)
    accordion_items = soup.find_all('div', {'data-base': 'bt_bb_accordion_item'})

    for item in accordion_items:
        # Get question from title div
        title_div = item.find('div', class_='bt_bb_accordion_item_title')
        content_div = item.find('div', class_='bt_bb_accordion_item_content')

        if title_div and content_div:
            question = clean_text(title_div.get_text())
            answer = clean_text(content_div.get_text())

            if question and answer and len(answer) > 20:
                faqs.append((question, answer))

    return faqs

def extract_closing_content(html_content):
    """Extract closing content paragraphs after 'How We Can Help You' heading"""
    # Decode HTML entities
    html_decoded = html_lib.unescape(html_content)
    soup = BeautifulSoup(html_decoded, 'html.parser')

    # Find "How We Can Help" heading
    help_heading = None
    for h3 in soup.find_all('h3'):
        if 'How We Can Help' in h3.get_text():
            help_heading = h3
            break

    if not help_heading:
        return None, None

    # Get the heading text
    heading_text = clean_text(help_heading.get_text())

    # Get all following paragraphs until we hit another section
    paragraphs = []
    current = help_heading.find_next_sibling()

    while current and len(paragraphs) < 5:  # Max 5 paragraphs
        if current.name == 'p':
            text = clean_text(current.get_text())
            if text and len(text) > 30:
                paragraphs.append(text)
        elif current.name in ['h2', 'h3', 'h4', 'div'] and current.get('data-base'):
            # Hit another section, stop
            break

        current = current.find_next_sibling()

    content = '\n\n'.join(paragraphs) if paragraphs else None
    return heading_text, content

def main():
    print("Parsing WordPress XML export...")
    tree = ET.parse('/Users/mikeshaffer/Downloads/shafferconstructioninc.WordPress.2025-11-07.xml')
    root = tree.getroot()

    namespace = {
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'wp': 'http://wordpress.org/export/1.2/'
    }

    # Connect to database
    db = sqlite3.connect('database/data/site.db')
    cursor = db.cursor()

    updated_pages = 0
    updated_benefits = 0
    updated_offerings = 0
    updated_faqs = 0

    # Process each page
    total_items = 0
    for item in root.findall('.//item'):
        total_items += 1
        title_elem = item.find('title')
        content_elem = item.find('content:encoded', namespace)
        post_name_elem = item.find('wp:post_name', namespace)

        if title_elem is None or content_elem is None or post_name_elem is None:
            continue

        title = title_elem.text
        content = content_elem.text
        slug = post_name_elem.text

        if not title or not content or not slug:
            continue

        # Extract service info
        location, service_type, service_name = extract_service_info(title, slug)
        if not all([location, service_type, service_name]):
            continue

        print(f"\nProcessing: {location}/{service_type}-{service_name}", flush=True)

        # Find page in database
        page_row = cursor.execute("""
            SELECT id FROM service_pages
            WHERE location = ? AND service_type = ? AND service_name = ?
        """, (location, service_type, service_name)).fetchone()

        if not page_row:
            print(f"  ✗ Not found in database")
            continue

        page_id = page_row[0]

        # Extract content
        hero_intro = extract_hero_intro(content)
        benefits = extract_benefits(content)
        offerings = extract_offerings(content)
        offerings_intro = extract_offerings_intro(content)
        faqs = extract_faqs(content)
        closing_heading, closing_content = extract_closing_content(content)

        # Update hero_intro
        if hero_intro:
            cursor.execute("""
                UPDATE service_pages
                SET hero_intro = ?
                WHERE id = ?
            """, (hero_intro, page_id))
            print(f"  ✓ Updated hero_intro")
            updated_pages += 1

        # Update benefits
        if benefits:
            # Delete old benefits
            cursor.execute("DELETE FROM service_benefits WHERE service_page_id = ?", (page_id,))
            # Insert new benefits
            for order, (heading, content_text) in enumerate(benefits):
                cursor.execute("""
                    INSERT INTO service_benefits (service_page_id, heading, content, benefit_order)
                    VALUES (?, ?, ?, ?)
                """, (page_id, heading, content_text, order))
            print(f"  ✓ Updated {len(benefits)} benefits")
            updated_benefits += len(benefits)

        # Update offerings
        if offerings:
            # Delete old offerings
            cursor.execute("DELETE FROM service_offerings WHERE service_page_id = ?", (page_id,))
            # Insert new offerings
            for order, offering in enumerate(offerings):
                cursor.execute("""
                    INSERT INTO service_offerings (service_page_id, offering, offering_order)
                    VALUES (?, ?, ?)
                """, (page_id, offering, order))
            print(f"  ✓ Updated {len(offerings)} offerings")
            updated_offerings += len(offerings)

        # Update FAQs
        if faqs:
            # Delete old FAQs
            cursor.execute("DELETE FROM service_faqs WHERE service_page_id = ?", (page_id,))
            # Insert new FAQs
            for order, (question, answer) in enumerate(faqs):
                cursor.execute("""
                    INSERT INTO service_faqs (service_page_id, question, answer, faq_order)
                    VALUES (?, ?, ?, ?)
                """, (page_id, question, answer, order))
            print(f"  ✓ Updated {len(faqs)} FAQs")
            updated_faqs += len(faqs)

        # Update offerings_intro
        if offerings_intro:
            cursor.execute("""
                UPDATE service_pages
                SET offerings_intro = ?
                WHERE id = ?
            """, (offerings_intro, page_id))
            print(f"  ✓ Updated offerings_intro")

        # Update closing_content and closing_heading
        if closing_heading:
            cursor.execute("""
                UPDATE service_pages
                SET closing_heading = ?, closing_content = ?
                WHERE id = ?
            """, (closing_heading, closing_content, page_id))
            print(f"  ✓ Updated closing_heading and closing_content")

    db.commit()
    db.close()

    print(f"\n{'='*50}")
    print(f"Complete!")
    print(f"  Total items in XML: {total_items}")
    print(f"  Pages updated: {updated_pages}")
    print(f"  Benefits updated: {updated_benefits}")
    print(f"  Offerings updated: {updated_offerings}")
    print(f"  FAQs updated: {updated_faqs}")

if __name__ == '__main__':
    main()
