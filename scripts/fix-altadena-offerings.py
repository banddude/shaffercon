#!/usr/bin/env python3
"""
Add offerings to 28 Altadena pages by copying from reference locations.
"""

import sqlite3

db = sqlite3.connect('./database/data/site.db')
cursor = db.cursor()

# Get all Altadena pages missing offerings
cursor.execute('''
    SELECT sp.id, sp.service_name, sp.service_type
    FROM service_pages sp
    LEFT JOIN service_offerings so ON sp.id = so.service_page_id
    WHERE sp.location = 'altadena'
    AND so.service_page_id IS NULL
    ORDER BY sp.service_type, sp.service_name
''')
missing_pages = cursor.fetchall()

print(f'=== Adding offerings to {len(missing_pages)} Altadena pages ===\n')

total_added = 0

for page_id, service_name, service_type in missing_pages:
    # Find a reference page with the same service_name and service_type that has offerings
    cursor.execute('''
        SELECT so.offering, so.offering_order
        FROM service_pages sp
        JOIN service_offerings so ON sp.id = so.service_page_id
        WHERE sp.service_name = ?
        AND sp.service_type = ?
        AND sp.location != 'altadena'
        ORDER BY so.offering_order
        LIMIT 15
    ''', (service_name, service_type))

    reference_offerings = cursor.fetchall()

    if reference_offerings:
        # Copy offerings to Altadena page
        for offering, order in reference_offerings:
            cursor.execute('''
                INSERT INTO service_offerings (service_page_id, offering, offering_order)
                VALUES (?, ?, ?)
            ''', (page_id, offering, order))
            total_added += 1

        print(f'✓ Added {len(reference_offerings)} offerings to {service_type} {service_name} (ID {page_id})')
    else:
        print(f'⚠ No reference found for {service_type} {service_name} (ID {page_id})')

db.commit()
print(f'\n=== Total offerings added: {total_added} ===')
print('All changes committed to database')

db.close()
