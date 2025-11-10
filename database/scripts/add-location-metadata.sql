-- Add location-specific metadata columns to location_pages table
-- This data helps with local SEO without requiring exact street addresses

ALTER TABLE location_pages ADD COLUMN city TEXT;
ALTER TABLE location_pages ADD COLUMN zip_code TEXT;
ALTER TABLE location_pages ADD COLUMN latitude TEXT;
ALTER TABLE location_pages ADD COLUMN longitude TEXT;

-- Update location metadata for all 22 cities
-- Using city center coordinates and primary zip codes

UPDATE location_pages SET city = 'Santa Monica', zip_code = '90401', latitude = '34.0195', longitude = '-118.4912' WHERE location_slug = 'santa-monica';
UPDATE location_pages SET city = 'Hollywood', zip_code = '90028', latitude = '34.0928', longitude = '-118.3287' WHERE location_slug = 'hollywood';
UPDATE location_pages SET city = 'Beverly Hills', zip_code = '90210', latitude = '34.0736', longitude = '-118.4004' WHERE location_slug = 'beverly-hills';
UPDATE location_pages SET city = 'Culver City', zip_code = '90232', latitude = '34.0211', longitude = '-118.3965' WHERE location_slug = 'culver-city';
UPDATE location_pages SET city = 'West Hollywood', zip_code = '90069', latitude = '34.0900', longitude = '-118.3617' WHERE location_slug = 'west-hollywood';
UPDATE location_pages SET city = 'Marina del Rey', zip_code = '90292', latitude = '33.9803', longitude = '-118.4517' WHERE location_slug = 'marina-del-rey';
UPDATE location_pages SET city = 'Venice', zip_code = '90291', latitude = '33.9850', longitude = '-118.4695' WHERE location_slug = 'venice';
UPDATE location_pages SET city = 'Malibu', zip_code = '90265', latitude = '34.0259', longitude = '-118.7798' WHERE location_slug = 'malibu';
UPDATE location_pages SET city = 'Pacific Palisades', zip_code = '90272', latitude = '34.0453', longitude = '-118.5260' WHERE location_slug = 'pacific-palisades';
UPDATE location_pages SET city = 'Brentwood', zip_code = '90049', latitude = '34.0519', longitude = '-118.4768' WHERE location_slug = 'brentwood';
UPDATE location_pages SET city = 'Westwood', zip_code = '90024', latitude = '34.0631', longitude = '-118.4456' WHERE location_slug = 'westwood';
UPDATE location_pages SET city = 'Century City', zip_code = '90067', latitude = '34.0583', longitude = '-118.4170' WHERE location_slug = 'century-city';
UPDATE location_pages SET city = 'Downtown Los Angeles', zip_code = '90012', latitude = '34.0522', longitude = '-118.2437' WHERE location_slug = 'downtown-los-angeles';
UPDATE location_pages SET city = 'Pasadena', zip_code = '91101', latitude = '34.1478', longitude = '-118.1445' WHERE location_slug = 'pasadena';
UPDATE location_pages SET city = 'Glendale', zip_code = '91201', latitude = '34.1425', longitude = '-118.2551' WHERE location_slug = 'glendale';
UPDATE location_pages SET city = 'Burbank', zip_code = '91501', latitude = '34.1808', longitude = '-118.3090' WHERE location_slug = 'burbank';
UPDATE location_pages SET city = 'Long Beach', zip_code = '90802', latitude = '33.7701', longitude = '-118.1937' WHERE location_slug = 'long-beach';
UPDATE location_pages SET city = 'Torrance', zip_code = '90503', latitude = '33.8358', longitude = '-118.3406' WHERE location_slug = 'torrance';
UPDATE location_pages SET city = 'Redondo Beach', zip_code = '90277', latitude = '33.8492', longitude = '-118.3884' WHERE location_slug = 'redondo-beach';
UPDATE location_pages SET city = 'Manhattan Beach', zip_code = '90266', latitude = '33.8847', longitude = '-118.4109' WHERE location_slug = 'manhattan-beach';
UPDATE location_pages SET city = 'Hermosa Beach', zip_code = '90254', latitude = '33.8622', longitude = '-118.3995' WHERE location_slug = 'hermosa-beach';
UPDATE location_pages SET city = 'El Segundo', zip_code = '90245', latitude = '33.9192', longitude = '-118.4165' WHERE location_slug = 'el-segundo';
