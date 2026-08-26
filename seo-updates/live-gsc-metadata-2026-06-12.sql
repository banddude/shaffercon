-- Live Search Console metadata fixes, 2026-06-12.
-- Source: first live GSC API pull (90 days, Mar 14 to Jun 11, plus a post-rewrite
-- window May 15 to Jun 11). Targets strike-zone queries (position 5-20 with real
-- impressions and zero or near-zero clicks) on location and landing pages.

-- Burbank location page. "burbank electrician" sat at position 12 with 0 clicks
-- in the recent window. Page had 727 recent impressions at 0.14% CTR.
UPDATE pages_all
SET
  meta_description = 'Shaffer Construction is a licensed Burbank electrician handling panel upgrades, EV chargers, lighting, rewiring, and commercial work. Call for a free estimate.'
WHERE id = 5526 AND slug = 'burbank';

-- Long Beach location page. "business electrical installation long beach ca"
-- sat at position 13 with 0 clicks. Page had 747 recent impressions at 0.13% CTR.
UPDATE pages_all
SET
  meta_description = 'Shaffer Construction handles business and commercial electrical installation in Long Beach, plus EV chargers, panels, and lighting. Call for a free estimate.'
WHERE id = 5403 AND slug = 'long-beach';

-- Atwater Village location page. "atwater electrical contractor" sat at
-- position 12 to 15 with 0 clicks across the full window. The old title said
-- electrician but not electrical contractor, which is the query people use.
UPDATE pages_all
SET
  meta_title = 'Atwater Village Electrical Contractor, EV Chargers & Panels',
  meta_description = 'Shaffer Construction is a licensed electrical contractor in Atwater Village. We handle EV chargers, panel upgrades, lighting, and commercial work.'
WHERE id = 5649 AND slug = 'atwater-village';

-- LED retrofit landing page. "lighting retrofit electrician" had 121 impressions
-- at position 13 with 1 click. The live route serves hardcoded metadata from
-- site/app/[landing]/page.tsx (updated in this same change); this keeps the DB
-- row consistent with what ships.
UPDATE pages_all
SET
  meta_title = 'Lighting Retrofit Electrician Los Angeles, LED Retrofits',
  meta_description = 'Shaffer Construction is a licensed lighting retrofit electrician serving Los Angeles and California businesses. We handle LED retrofits, Title 24 compliance, and utility rebates.'
WHERE id = 14107 AND slug = 'led-retrofit-services';
