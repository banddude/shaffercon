#!/usr/bin/env python3
"""
Resume bulk update - only cities that weren't completed
Starts from Beverly Hills (city #2) through West Hollywood
Includes longer delays to avoid rate limiting
"""

import sys
import os

# Add the current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import and modify the locations list
from bulk_update_location_pages import *

def main_resume():
    print("=" * 80)
    print("RESUMING BULK LOCATION PAGE UPDATE")
    print("=" * 80)
    print(f"Server: {SSH_USER}@{SSH_HOST}")
    print(f"SSH Delay: {SSH_DELAY} seconds after each operation")
    print(f"City Delay: {CITY_DELAY} seconds between cities")
    print("=" * 80)
    print()

    # Wait for server to recover
    print("⏱️  Waiting 30 seconds for server rate limit to reset...")
    time.sleep(30)
    print()

    # Load location data
    print("Loading location data...")
    with open(LOCATIONS_FILE, 'r') as f:
        locations_data = json.load(f)

    # Skip Venice (done) and Atwater Village (done) - start from Beverly Hills
    locations_to_update = [loc for loc in locations_data[1:] if 'venice' not in loc['url'].lower() and 'atwater' not in loc['url'].lower()]

    print(f"Found {len(locations_to_update)} locations to update (skipping Venice and Atwater Village)")
    print()

    # Process each location
    for i, location in enumerate(locations_to_update, 1):
        url = location['url']
        location_slug = url.rstrip('/').split('/')[-1]
        heading = location['heading']
        text = location['text']

        # Extract location name from heading
        location_name = heading.replace('Expert Electrical Services in ', '')
        location_name = location_name.replace('Premier Electrician Services in ', '')
        location_name = location_name.replace('Electrician: ', '')
        location_name = location_name.split(':')[0].strip()
        if ',' in location_name:
            location_name = location_name.split(',')[0].strip()

        print(f"[{i}/{len(locations_to_update)}] Processing: {location_name} ({location_slug})")
        print("-" * 80)

        try:
            # Generate page content
            print("   → Generating page content...")
            page_content = generate_location_page(location_name, location_slug, text)

            # Save to temporary file
            temp_file = f"/tmp/{location_slug}_page.html"
            with open(temp_file, 'w') as f:
                f.write(page_content)
            print(f"   ✅ Content generated ({len(page_content)} chars)")

            # Upload HTML file
            upload_file(temp_file, f"{location_slug}_page.html", f"{location_name} HTML")

            # Create and upload update PHP script
            update_php = f'''<?php
require_once('{WP_PATH}/wp-load.php');

$page_slug = 'service-areas/{location_slug}';
$page = get_page_by_path($page_slug);

if (!$page) {{
    echo "ERROR: Could not find page for {location_slug}\\n";
    exit(1);
}}

$page_id = $page->ID;
$html_content = file_get_contents('{WP_PATH}/{location_slug}_page.html');

wp_update_post(array(
    'ID' => $page_id,
    'post_content' => $html_content,
    'post_status' => 'publish'
));

echo "SUCCESS: Updated {location_name} (ID: $page_id)\\n";
'''

            update_php_file = f"/tmp/{location_slug}_update.php"
            with open(update_php_file, 'w') as f:
                f.write(update_php)

            upload_file(update_php_file, f"{location_slug}_update.php", f"{location_name} update script")

            # Execute update
            run_ssh_command(
                f"cd {WP_PATH} && php {location_slug}_update.php",
                f"Updating {location_name} page"
            )

            # Cleanup remote files
            run_ssh_command(
                f"cd {WP_PATH} && rm {location_slug}_page.html {location_slug}_update.php",
                f"Cleaning up {location_name} files"
            )

            # Cleanup local temp files
            os.remove(temp_file)
            os.remove(update_php_file)

            print(f"   ✅ {location_name} page updated successfully!")
            print(f"   🔗 https://shaffercon.com/service-areas/{location_slug}/")
            print()

            # Delay before next city
            if i < len(locations_to_update):
                print(f"   ⏱️  Waiting {CITY_DELAY} seconds before next city...")
                time.sleep(CITY_DELAY)
                print()

        except Exception as e:
            print(f"   ❌ ERROR processing {location_name}: {e}")
            print(f"   ⏭️  Waiting 10 seconds before continuing...")
            time.sleep(10)  # Extra delay after error
            print()
            continue

    print("=" * 80)
    print("✅ BULK UPDATE COMPLETE!")
    print("=" * 80)
    print(f"Updated {len(locations_to_update)} location pages")
    print()

if __name__ == "__main__":
    main_resume()
