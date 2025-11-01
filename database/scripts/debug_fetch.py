#!/usr/bin/env python3
import requests
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Accept': 'application/json'
}

# Fetch first page
response = requests.get('https://shaffercon.com/wp-json/wp/v2/pages?per_page=100&page=1', headers=headers)
print(f"Status: {response.status_code}")
print(f"Pages returned: {len(response.json())}")

# Save to file to inspect
with open('/tmp/wp_pages_sample.json', 'w') as f:
    json.dump(response.json(), f, indent=2)

print("\nSample page IDs and slugs:")
for p in response.json()[:5]:
    print(f"  ID: {p['id']}, Slug: {p['slug']}, Status: {p['status']}")

print(f"\nSaved sample to /tmp/wp_pages_sample.json")

# Count total in response
print(f"\nTotal in first batch: {len(response.json())}")
