#!/usr/bin/env python3
"""
Add nearby areas to pages missing them.
"""

import sqlite3

# Define nearby areas for each location
NEARBY_AREAS = {
    'santa monica': ['Venice', 'Culver City', 'West Hollywood', 'Beverly Hills', 'Pacific Palisades'],
    'silver lake': ['Echo Park', 'Los Feliz', 'Atwater Village', 'Hollywood', 'Highland Park'],
    'torrance': ['Long Beach', 'Inglewood', 'Culver City', 'Venice', 'Santa Monica'],
    'boyle heights': ['Los Feliz', 'Echo Park', 'Highland Park', 'Atwater Village', 'Pasadena'],
}

db = sqlite3.connect('./database/data/site.db')
cursor = db.cursor()

# Get pages missing nearby areas for the target locations
cursor.execute('''
    SELECT sp.id, sp.location, sp.service_name, sp.service_type
    FROM service_pages sp
    LEFT JOIN service_nearby_areas sna ON sp.id = sna.service_page_id
    WHERE sp.location IN ('santa monica', 'silver lake', 'torrance', 'boyle heights')
    AND sna.service_page_id IS NULL
    ORDER BY sp.location, sp.id
''')
missing_pages = cursor.fetchall()

print(f'=== Adding nearby areas to {len(missing_pages)} pages ===\n')

# Group by location
by_location = {}
for page_id, location, service_name, service_type in missing_pages:
    if location not in by_location:
        by_location[location] = []
    by_location[location].append((page_id, service_name, service_type))

total_added = 0

for location, pages in by_location.items():
    print(f'{location.upper()}: {len(pages)} pages')

    if location in NEARBY_AREAS:
        nearby = NEARBY_AREAS[location]

        for page_id, service_name, service_type in pages:
            # Add nearby areas to this page
            for i, area_name in enumerate(nearby):
                cursor.execute('''
                    INSERT INTO service_nearby_areas (service_page_id, area_name, display_order)
                    VALUES (?, ?, ?)
                ''', (page_id, area_name, i))
                total_added += 1

            print(f'  ✓ Added {len(nearby)} nearby areas to {service_type} {service_name} (ID {page_id})')
    else:
        print(f'  ⚠ No nearby areas defined for {location}')

db.commit()
print(f'\n=== Total nearby areas added: {total_added} ===')
print('All changes committed to database')

db.close()
