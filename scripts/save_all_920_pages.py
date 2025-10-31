#!/usr/bin/env python3
"""
Save ALL 920 pages including duplicates
"""

import requests
import json
import sqlite3
import time
from bs4 import BeautifulSoup
import re

WP_API_URL = "https://shaffercon.com/wp-json/wp/v2"
DB_PATH = "/Users/mikeshaffer/aiva/website/data/site.db"

def parse_html_content(html_content):
    """Parse HTML and extract structured data"""
    soup = BeautifulSoup(html_content, 'html.parser')

    data = {
        'city_name': None,
        'superheadline': None,
        'headline': None,
        'subheadline': None,
        'about_section': {'heading': None, 'content': []},
        'residential_services': [],
        'commercial_services': [],
        'related_services': [],
        'nearby_areas': [],
        'phone_number': None,
        'contact_cta': None,
        'features': [],
        'images': [],
    }

    # Extract headline
    headline_elem = soup.find('header', class_='bt_bb_headline')
    if headline_elem:
        superheadline = headline_elem.find('span', class_='bt_bb_headline_superheadline')
        if superheadline:
            data['superheadline'] = superheadline.get_text(strip=True)

        headline_content = headline_elem.find('span', class_='bt_bb_headline_content')
        if headline_content:
            data['headline'] = headline_content.get_text(strip=True)
            city_match = re.search(r'<b>(.*?)</b>', str(headline_content))
            if city_match:
                data['city_name'] = city_match.group(1)
            elif data['headline']:
                data['city_name'] = data['headline']

        subheadline = headline_elem.find('div', class_='bt_bb_headline_subheadline')
        if subheadline:
            data['subheadline'] = subheadline.get_text(strip=True)

    # Extract about section
    h3_tags = soup.find_all('h3')
    for h3 in h3_tags:
        if 'About' in h3.get_text():
            data['about_section']['heading'] = h3.get_text(strip=True)
            for sibling in h3.find_next_siblings('p'):
                text = sibling.get_text(strip=True)
                if text:
                    data['about_section']['content'].append(text)

    # Extract services from links
    ul_tags = soup.find_all('ul')
    for ul in ul_tags:
        for link in ul.find_all('a'):
            service_name = link.get_text(strip=True)
            service_url = link.get('href', '')

            if '/residential-' in service_url:
                slug = service_url.split('/')[-2] if service_url.endswith('/') else service_url.split('/')[-1]
                data['residential_services'].append({'name': service_name, 'slug': slug, 'url': service_url})
            elif '/commercial-' in service_url:
                slug = service_url.split('/')[-2] if service_url.endswith('/') else service_url.split('/')[-1]
                data['commercial_services'].append({'name': service_name, 'slug': slug, 'url': service_url})

    # Extract features
    all_service_titles = soup.find_all('div', class_='bt_bb_service_content_title')
    for title_elem in all_service_titles:
        title = title_elem.get_text(strip=True)
        if title.isupper() and 'SERVICES' not in title.upper() and title not in data['features']:
            data['features'].append(title)

    # Extract phone
    for h3 in h3_tags:
        text = h3.get_text(strip=True)
        if 'Call' in text or 'Monday-Friday' in text:
            data['contact_cta'] = text
            phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
            if phone_match:
                data['phone_number'] = phone_match.group(0)

    # Extract nearby areas
    for h3 in soup.find_all('h3'):
        if 'Nearby Areas' in h3.get_text():
            next_ul = h3.find_next('ul')
            if next_ul:
                for link in next_ul.find_all('a'):
                    data['nearby_areas'].append({
                        'name': link.get_text(strip=True),
                        'url': link.get('href', '')
                    })
            break

    # Extract images
    for img in soup.find_all('img'):
        src = img.get('src', '')
        if src and src not in data['images']:
            data['images'].append(src)

    return data


def fetch_all_920_pages():
    """Fetch all 920 pages"""
    all_pages = []
    page = 1
    per_page = 100

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json'
    }

    print("Fetching all 920 pages...")
    print("=" * 80)

    while True:
        url = f"{WP_API_URL}/pages?per_page={per_page}&page={page}"
        print(f"Page {page}... ", end='', flush=True)

        try:
            response = requests.get(url, headers=headers, timeout=30)

            if response.status_code == 200:
                pages = response.json()
                if not pages:
                    print("done")
                    break

                all_pages.extend(pages)
                print(f"✓ {len(pages)}")
                page += 1
                time.sleep(0.5)

            elif response.status_code == 400:
                print("done")
                break
            else:
                print(f"error {response.status_code}")
                break

        except Exception as e:
            print(f"error: {e}")
            break

    print(f"\n✓ Fetched {len(all_pages)} pages total")
    return all_pages


def save_all_to_db(pages):
    """Save ALL 920 pages to pages_all table"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print(f"\nSaving {len(pages)} pages...")
    print("=" * 80)

    for i, page in enumerate(pages, 1):
        try:
            # Extract SEO data
            yoast = page.get('yoast_head_json', {})
            og_images = yoast.get('og_image', [])
            og_image = og_images[0]['url'] if og_images else None

            # Parse HTML content
            parsed_data = parse_html_content(page['content']['rendered'])

            # Insert (allow duplicates)
            cursor.execute("""
                INSERT INTO pages_all
                (id, date, slug, title, content, data,
                 meta_title, meta_description, canonical_url, og_image,
                 schema_json, yoast_json, parsed_content)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                page['id'],
                page.get('date'),
                page['slug'],
                page['title']['rendered'],
                page['content']['rendered'],
                json.dumps(page),
                yoast.get('title'),
                yoast.get('description'),
                yoast.get('canonical'),
                og_image,
                json.dumps(yoast.get('schema', {})) if yoast.get('schema') else None,
                json.dumps(yoast),
                json.dumps(parsed_data)
            ))

            if i % 100 == 0:
                print(f"  Saved {i}/{len(pages)}...")
                conn.commit()

        except Exception as e:
            print(f"  ✗ Error with ID {page.get('id')}: {e}")

    conn.commit()
    conn.close()

    print(f"✓ Saved {len(pages)} pages")


if __name__ == "__main__":
    print("Save ALL 920 Pages")
    print("=" * 80)
    print()

    # Fetch
    pages = fetch_all_920_pages()

    if pages:
        # Save
        save_all_to_db(pages)

        # Verify
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM pages_all")
        total = cursor.fetchone()[0]
        conn.close()

        print(f"\n✓ Database now has {total} total pages in pages_all table")
    else:
        print("✗ No pages fetched")
