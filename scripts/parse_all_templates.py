#!/usr/bin/env python3
"""
Parse ALL page templates and create clean JSON for each page type
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
    cleaned = html_lib.unescape(text)
    cleaned = re.sub(r'<[^>]+>', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned


def parse_service_page(html_content, slug):
    """Parse a service detail page (e.g., residential-ev-charger-installation)"""
    soup = BeautifulSoup(html_content, 'html.parser')

    data = {
        'page_type': 'service',
        'service_name': None,
        'location': None,
        'headline': None,
        'description': [],
        'faqs': [],
        'related_services': [],
        'nearby_areas': [],
        'features': [],
        'phone_number': None,
        'images': []
    }

    # Extract main headline
    h1 = soup.find('h1')
    if h1:
        full_text = clean_text(h1.get_text())
        data['headline'] = full_text

        # Try to extract service name and location
        # Pattern: "OUR SERVICES Residential EV Charger Installation in Torrance"
        parts = full_text.replace('OUR SERVICES', '').strip()
        if ' in ' in parts:
            service, location = parts.rsplit(' in ', 1)
            data['service_name'] = service.strip()
            data['location'] = location.strip()
        else:
            data['service_name'] = parts

    # Extract description paragraphs
    for p in soup.find_all('p'):
        text = clean_text(p.get_text())
        if text and len(text) > 50 and 'Call' not in text:
            data['description'].append(text)

    # Extract FAQs (looking for h3 or h4 that are questions)
    for h in soup.find_all(['h3', 'h4']):
        text = clean_text(h.get_text())
        if any(q in text.lower() for q in ['how', 'what', 'why', 'when', 'where', 'can', '?']):
            # Find next sibling paragraph for answer
            answer = ""
            next_elem = h.find_next('p')
            if next_elem:
                answer = clean_text(next_elem.get_text())

            data['faqs'].append({
                'question': text,
                'answer': answer
            })

    # Extract "Related Services"
    for h3 in soup.find_all('h3'):
        if 'Related Services' in h3.get_text():
            ul = h3.find_next('ul')
            if ul:
                for link in ul.find_all('a'):
                    data['related_services'].append({
                        'name': clean_text(link.get_text()),
                        'url': link.get('href', '')
                    })

    # Extract "Nearby Areas"
    for h3 in soup.find_all('h3'):
        if 'Nearby Areas' in h3.get_text():
            ul = h3.find_next('ul')
            if ul:
                for link in ul.find_all('a'):
                    data['nearby_areas'].append({
                        'name': clean_text(link.get_text()),
                        'url': link.get('href', '')
                    })

    # Extract phone number
    for h3 in soup.find_all('h3'):
        text = h3.get_text()
        phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
        if phone_match:
            data['phone_number'] = phone_match.group(0)
            break

    # Extract features
    for title_div in soup.find_all('div', class_='bt_bb_service_content_title'):
        title = clean_text(title_div.get_text())
        if title.isupper() and 'SERVICES' not in title:
            data['features'].append(title)

    # Extract images
    for img in soup.find_all('img'):
        src = img.get('src', '')
        if src and 'shaffercon.com' in src:
            data['images'].append(src)

    # Remove duplicates
    data['features'] = list(dict.fromkeys(data['features']))
    data['description'] = data['description'][:5]  # Limit to first 5 paragraphs

    return data


def parse_generic_page(html_content, page_type='generic'):
    """Parse generic pages like About Us, Contact, etc."""
    soup = BeautifulSoup(html_content, 'html.parser')

    data = {
        'page_type': page_type,
        'headings': [],
        'content': [],
        'images': [],
        'links': []
    }

    # Extract all headings
    for tag in ['h1', 'h2', 'h3']:
        for h in soup.find_all(tag):
            text = clean_text(h.get_text())
            if text:
                data['headings'].append({'level': tag, 'text': text})

    # Extract content paragraphs
    for p in soup.find_all('p'):
        text = clean_text(p.get_text())
        if text and len(text) > 20:
            data['content'].append(text)

    # Extract images
    for img in soup.find_all('img'):
        src = img.get('src', '')
        alt = clean_text(img.get('alt', ''))
        if src:
            data['images'].append({'src': src, 'alt': alt})

    # Extract links
    for a in soup.find_all('a'):
        href = a.get('href', '')
        text = clean_text(a.get_text())
        if href and text:
            data['links'].append({'href': href, 'text': text})

    return data


def identify_and_parse(slug, html_content, existing_parsed):
    """Identify page type and parse accordingly"""

    # Skip if already has good parsed data (city pages)
    if existing_parsed:
        try:
            parsed = json.loads(existing_parsed)
            if parsed.get('city_name') and len(parsed.get('residential_services', [])) > 0:
                return None  # Already parsed well
        except:
            pass

    soup = BeautifulSoup(html_content, 'html.parser')

    # Identify page type
    h1_text = ""
    h1 = soup.find('h1')
    if h1:
        h1_text = clean_text(h1.get_text())

    # Service pages (878 pages)
    if 'OUR SERVICES' in h1_text or any(x in slug for x in ['residential-', 'commercial-']):
        return parse_service_page(html_content, slug)

    # City pages (already done)
    if 'ELECTRICAL SERVICES IN' in h1_text:
        return None

    # Specific pages
    if slug == 'about-us':
        return parse_generic_page(html_content, 'about')
    elif slug == 'contact-us':
        return parse_generic_page(html_content, 'contact')
    elif slug == 'home':
        return parse_generic_page(html_content, 'homepage')
    elif slug == 'service-areas':
        return parse_generic_page(html_content, 'service_areas_list')
    else:
        return parse_generic_page(html_content, 'generic')


def parse_all():
    """Parse all pages"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("Parsing all page templates...")
    print("=" * 80)

    cursor.execute("SELECT id, slug, content, parsed_content FROM pages_all WHERE content IS NOT NULL")
    pages = cursor.fetchall()

    updated = 0
    skipped = 0

    for page_id, slug, html_content, existing_parsed in pages:
        parsed_data = identify_and_parse(slug, html_content, existing_parsed)

        if parsed_data is None:
            skipped += 1
            continue

        # Update database
        cursor.execute(
            "UPDATE pages_all SET parsed_content = ? WHERE id = ?",
            (json.dumps(parsed_data), page_id)
        )

        updated += 1

        if updated % 100 == 0:
            print(f"  Parsed {updated} pages...")
            conn.commit()

    conn.commit()
    conn.close()

    print(f"\n✓ Updated: {updated} pages")
    print(f"  Skipped: {skipped} pages (already parsed)")

    return updated


def verify_parsing():
    """Verify the parsed data"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("\nVerifying parsed data...")
    print("=" * 80)

    # Count by page type
    cursor.execute("SELECT parsed_content FROM pages_all WHERE parsed_content IS NOT NULL")

    page_types = {}
    for row in cursor.fetchall():
        try:
            data = json.loads(row[0])
            ptype = data.get('page_type', 'unknown')
            page_types[ptype] = page_types.get(ptype, 0) + 1
        except:
            page_types['error'] = page_types.get('error', 0) + 1

    print("\nPage types in database:")
    for ptype, count in sorted(page_types.items()):
        print(f"  {ptype}: {count}")

    # Sample a service page
    cursor.execute("SELECT slug, parsed_content FROM pages_all WHERE parsed_content LIKE '%\"page_type\": \"service\"%' LIMIT 1")
    row = cursor.fetchone()
    if row:
        print(f"\nSample service page ({row[0]}):")
        data = json.loads(row[1])
        print(f"  Service: {data.get('service_name')}")
        print(f"  Location: {data.get('location')}")
        print(f"  Description paragraphs: {len(data.get('description', []))}")
        print(f"  FAQs: {len(data.get('faqs', []))}")
        print(f"  Features: {data.get('features')}")

    conn.close()


if __name__ == "__main__":
    print("Parse All Page Templates")
    print("=" * 80)
    print()

    updated = parse_all()

    if updated > 0:
        verify_parsing()

    print("\n✓ Done!")
