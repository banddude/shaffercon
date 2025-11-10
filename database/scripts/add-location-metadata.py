#!/usr/bin/env python3
"""
Add location-specific metadata to location_pages table
Adds city, zip_code, latitude, and longitude for local SEO
"""

import sqlite3
import os

# Get database path
db_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'site.db')

# Connect to database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("Adding location metadata columns...")

# Add new columns
try:
    cursor.execute("ALTER TABLE location_pages ADD COLUMN city TEXT")
    print("✓ Added city column")
except sqlite3.OperationalError as e:
    print(f"  Column city may already exist: {e}")

try:
    cursor.execute("ALTER TABLE location_pages ADD COLUMN zip_code TEXT")
    print("✓ Added zip_code column")
except sqlite3.OperationalError as e:
    print(f"  Column zip_code may already exist: {e}")

try:
    cursor.execute("ALTER TABLE location_pages ADD COLUMN latitude TEXT")
    print("✓ Added latitude column")
except sqlite3.OperationalError as e:
    print(f"  Column latitude may already exist: {e}")

try:
    cursor.execute("ALTER TABLE location_pages ADD COLUMN longitude TEXT")
    print("✓ Added longitude column")
except sqlite3.OperationalError as e:
    print(f"  Column longitude may already exist: {e}")

conn.commit()

print("\nPopulating location metadata for all 22 cities...")

# Location metadata (city center coordinates and primary zip codes)
locations = [
    ('santa-monica', 'Santa Monica', '90401', '34.0195', '-118.4912'),
    ('hollywood', 'Hollywood', '90028', '34.0928', '-118.3287'),
    ('beverly-hills', 'Beverly Hills', '90210', '34.0736', '-118.4004'),
    ('culver-city', 'Culver City', '90232', '34.0211', '-118.3965'),
    ('west-hollywood', 'West Hollywood', '90069', '34.0900', '-118.3617'),
    ('marina-del-rey', 'Marina del Rey', '90292', '33.9803', '-118.4517'),
    ('venice', 'Venice', '90291', '33.9850', '-118.4695'),
    ('malibu', 'Malibu', '90265', '34.0259', '-118.7798'),
    ('pacific-palisades', 'Pacific Palisades', '90272', '34.0453', '-118.5260'),
    ('brentwood', 'Brentwood', '90049', '34.0519', '-118.4768'),
    ('westwood', 'Westwood', '90024', '34.0631', '-118.4456'),
    ('century-city', 'Century City', '90067', '34.0583', '-118.4170'),
    ('downtown-los-angeles', 'Downtown Los Angeles', '90012', '34.0522', '-118.2437'),
    ('pasadena', 'Pasadena', '91101', '34.1478', '-118.1445'),
    ('glendale', 'Glendale', '91201', '34.1425', '-118.2551'),
    ('burbank', 'Burbank', '91501', '34.1808', '-118.3090'),
    ('long-beach', 'Long Beach', '90802', '33.7701', '-118.1937'),
    ('torrance', 'Torrance', '90503', '33.8358', '-118.3406'),
    ('redondo-beach', 'Redondo Beach', '90277', '33.8492', '-118.3884'),
    ('manhattan-beach', 'Manhattan Beach', '90266', '33.8847', '-118.4109'),
    ('hermosa-beach', 'Hermosa Beach', '90254', '33.8622', '-118.3995'),
    ('el-segundo', 'El Segundo', '90245', '33.9192', '-118.4165'),
]

for slug, city, zip_code, lat, lng in locations:
    cursor.execute("""
        UPDATE location_pages
        SET city = ?, zip_code = ?, latitude = ?, longitude = ?
        WHERE location_slug = ?
    """, (city, zip_code, lat, lng, slug))
    print(f"✓ Updated {city} ({zip_code})")

conn.commit()
print(f"\n✅ Successfully updated {len(locations)} locations")

# Verify the updates
cursor.execute("SELECT location_name, city, zip_code, latitude, longitude FROM location_pages LIMIT 5")
print("\nSample data:")
for row in cursor.fetchall():
    print(f"  {row[0]}: {row[1]}, {row[2]} ({row[3]}, {row[4]})")

conn.close()
print("\n✅ Database updated successfully")
