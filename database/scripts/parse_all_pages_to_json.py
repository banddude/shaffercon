#!/usr/bin/env python3
"""
Parse HTML content from all pages and store as structured JSON
"""

import sqlite3
import json
import re
from bs4 import BeautifulSoup

DB_PATH = "/Users/mikeshaffer/aiva/website/data/site.db"

def parse_service_area_page(html_content):
    """Parse a service area page and extract structured data"""
    soup = BeautifulSoup(html_content, 'html.parser')

    data = {
        'city_name': None,
        'superheadline': None,
        'headline': None,
        'subheadline': None,
        'about_section': {
            'heading': None,
            'content': []
        },
        'residential_services': [],
        'commercial_services': [],
        'related_services': [],
        'nearby_areas': [],
        'phone_number': None,
        'contact_cta': None,
        'features': [],
        'images': [],
    }

    # Extract headline information
    headline_elem = soup.find('header', class_='bt_bb_headline')
    if headline_elem:
        superheadline = headline_elem.find('span', class_='bt_bb_headline_superheadline')
        if superheadline:
            data['superheadline'] = superheadline.get_text(strip=True)

        headline_content = headline_elem.find('span', class_='bt_bb_headline_content')
        if headline_content:
            data['headline'] = headline_content.get_text(strip=True)
            # Extract city name from headline
            city_match = re.search(r'<b>(.*?)</b>', str(headline_content))
            if city_match:
                data['city_name'] = city_match.group(1)
            elif data['headline']:
                # If no bold tag, use the headline as city name
                data['city_name'] = data['headline']

        subheadline = headline_elem.find('div', class_='bt_bb_headline_subheadline')
        if subheadline:
            data['subheadline'] = subheadline.get_text(strip=True)

    # Extract service boxes (Residential/Commercial Services)
    service_boxes = soup.find_all('div', class_='bt_bb_service')
    for service_box in service_boxes:
        title_elem = service_box.find('div', class_='bt_bb_service_content_title')
        text_elem = service_box.find('div', class_='bt_bb_service_content_text')

        if title_elem:
            title = title_elem.get_text(strip=True)
            description = text_elem.get_text(strip=True) if text_elem else ""

            if 'Residential' in title and description:
                data['residential_services'].append({
                    'title': title,
                    'description': description
                })
            elif 'Commercial' in title and description:
                data['commercial_services'].append({
                    'title': title,
                    'description': description
                })

    # Extract about section
    h3_tags = soup.find_all('h3')
    for h3 in h3_tags:
        if 'About' in h3.get_text():
            data['about_section']['heading'] = h3.get_text(strip=True)
            # Get following paragraphs
            for sibling in h3.find_next_siblings('p'):
                text = sibling.get_text(strip=True)
                if text:
                    data['about_section']['content'].append(text)

    # Extract service lists from <ul> tags
    ul_tags = soup.find_all('ul')
    for ul in ul_tags:
        links = ul.find_all('a')
        for link in links:
            service_name = link.get_text(strip=True)
            service_url = link.get('href', '')

            # Determine if residential or commercial based on URL
            if '/residential-' in service_url:
                slug = service_url.split('/')[-2] if service_url.endswith('/') else service_url.split('/')[-1]
                data['residential_services'].append({
                    'name': service_name,
                    'slug': slug,
                    'url': service_url
                })
            elif '/commercial-' in service_url:
                slug = service_url.split('/')[-2] if service_url.endswith('/') else service_url.split('/')[-1]
                data['commercial_services'].append({
                    'name': service_name,
                    'slug': slug,
                    'url': service_url
                })

    # Extract features (FREE CONSULTATION, LICENSED & INSURED, etc.)
    all_service_titles = soup.find_all('div', class_='bt_bb_service_content_title')
    for title_elem in all_service_titles:
        title = title_elem.get_text(strip=True)
        # Check if it's a feature (all caps, not "Services")
        if title.isupper() and 'SERVICES' not in title.upper() and title not in data['features']:
            data['features'].append(title)

    # Extract phone number and contact CTA
    for h3 in h3_tags:
        text = h3.get_text(strip=True)
        if 'Call' in text or 'Monday-Friday' in text:
            data['contact_cta'] = text
            # Extract phone number
            phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
            if phone_match:
                data['phone_number'] = phone_match.group(0)

    # Extract "Related Services" section
    for h3 in soup.find_all('h3'):
        if 'Related Services' in h3.get_text():
            next_ul = h3.find_next('ul')
            if next_ul:
                for link in next_ul.find_all('a'):
                    service_name = link.get_text(strip=True)
                    service_url = link.get('href', '')
                    data['related_services'].append({
                        'name': service_name,
                        'url': service_url
                    })
            break

    # Extract "Nearby Areas We Serve" section
    for h3 in soup.find_all('h3'):
        if 'Nearby Areas' in h3.get_text():
            next_ul = h3.find_next('ul')
            if next_ul:
                for link in next_ul.find_all('a'):
                    area_name = link.get_text(strip=True)
                    area_url = link.get('href', '')
                    data['nearby_areas'].append({
                        'name': area_name,
                        'url': area_url
                    })
            break

    # Extract images
    for img in soup.find_all('img'):
        src = img.get('src', '')
        if src and src not in data['images']:
            data['images'].append(src)

    return data


def parse_all_pages():
    """Parse all pages and add parsed_content JSON field"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Add parsed_content column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE pages ADD COLUMN parsed_content TEXT")
        print("✓ Added parsed_content column")
    except sqlite3.OperationalError:
        print("• parsed_content column already exists")

    # Get all pages
    cursor.execute("SELECT id, slug, content FROM pages")
    pages = cursor.fetchall()

    print(f"\nParsing {len(pages)} pages...")
    print("=" * 80)

    success_count = 0
    error_count = 0

    for i, (page_id, slug, html_content) in enumerate(pages, 1):
        try:
            # Parse the HTML
            parsed_data = parse_service_area_page(html_content)

            # Store as JSON
            cursor.execute("""
                UPDATE pages
                SET parsed_content = ?
                WHERE id = ?
            """, (json.dumps(parsed_data), page_id))

            success_count += 1

            if i % 10 == 0:
                print(f"  Parsed {i}/{len(pages)} pages... ({success_count} success, {error_count} errors)")

        except Exception as e:
            error_count += 1
            print(f"  ✗ Error parsing {slug}: {e}")

    conn.commit()
    conn.close()

    print(f"\n✓ Parsing complete!")
    print(f"  Success: {success_count}")
    print(f"  Errors: {error_count}")


def verify_parsed_data():
    """Verify the parsed data"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("\nVerifying parsed data...")
    print("=" * 80)

    # Check Santa Monica
    cursor.execute("""
        SELECT slug, parsed_content
        FROM pages
        WHERE slug = 'santa-monica'
    """)

    row = cursor.fetchone()
    if row and row[1]:
        slug, parsed_json = row
        parsed = json.loads(parsed_json)

        print(f"\nSample: {slug}")
        print(f"  City: {parsed.get('city_name')}")
        print(f"  Headline: {parsed.get('headline')}")
        print(f"  Phone: {parsed.get('phone_number')}")
        print(f"  About paragraphs: {len(parsed.get('about_section', {}).get('content', []))}")
        print(f"  Residential services: {len(parsed.get('residential_services', []))}")
        print(f"  Commercial services: {len(parsed.get('commercial_services', []))}")
        print(f"  Features: {len(parsed.get('features', []))}")
        print(f"  Nearby areas: {len(parsed.get('nearby_areas', []))}")

    # Count pages with parsed data
    cursor.execute("SELECT COUNT(*) FROM pages WHERE parsed_content IS NOT NULL")
    count = cursor.fetchone()[0]
    print(f"\nPages with parsed content: {count}")

    conn.close()


if __name__ == "__main__":
    print("Parse All Pages to JSON")
    print("=" * 80)

    # Parse all pages
    parse_all_pages()

    # Verify
    verify_parsed_data()

    print("\n✓ Done!")
