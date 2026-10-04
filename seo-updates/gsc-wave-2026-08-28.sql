-- GSC-driven metadata updates, 2026-08-28.
-- No pages are removed or noindexed. These target existing pages already ranking near page one.

UPDATE pages_all
SET meta_title = 'Sherman Oaks Electrician | EV Chargers, Panels & Repairs',
    meta_description = 'Licensed Sherman Oaks electrician for EV chargers, panel upgrades, troubleshooting, rewiring, lighting, and commercial electrical work. CA Lic. #994593.'
WHERE id = (SELECT page_id FROM location_pages WHERE location_slug = 'sherman-oaks');

UPDATE pages_all
SET meta_title = 'EV Charger Installation West Hollywood | Shaffer Construction',
    meta_description = 'Licensed EV charger installation in West Hollywood for Tesla and universal Level 2 chargers. Panel and load review, permits, wiring, and inspections.'
WHERE id = (SELECT page_id FROM service_pages WHERE location = 'west hollywood' AND service_type = 'residential' AND service_name = 'ev-charger-installation');

UPDATE pages_all
SET meta_title = 'EV Charger Installation Glendale | Shaffer Construction',
    meta_description = 'Licensed EV charger installation in Glendale for Tesla and universal Level 2 chargers. Panel and load review, permits, wiring, and inspections.'
WHERE id = (SELECT page_id FROM service_pages WHERE location = 'glendale' AND service_type = 'residential' AND service_name = 'ev-charger-installation');
