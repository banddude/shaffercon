UPDATE pages_all
SET
  title = 'Electrical Load Study Los Angeles',
  meta_title = 'Electrical Load Study Los Angeles, EV, Panels, Permits',
  meta_description = 'Los Angeles electrical load studies for EV chargers, panel upgrades, tenant improvements, permits, utility capacity, and commercial building reports.'
WHERE slug = 'electrical-load-studies';

UPDATE service_landing_pages
SET
  page_title = 'Electrical Load Study Los Angeles',
  hero_text = 'Need to confirm electrical capacity before EV chargers, a panel upgrade, tenant improvement, or LADBS permit submittal? Shaffer Construction performs Los Angeles electrical load studies for commercial buildings, multifamily properties, and EV charging projects, with documentation for utility planning, permit review, budgeting, and safe design.'
WHERE slug = 'electrical-load-studies';

INSERT INTO service_landing_sections (
  landing_page_id,
  section_type,
  heading,
  subheading,
  content,
  table_data,
  section_order
)
SELECT
  id,
  'content',
  'Electrical Load Study Reports for Permits, EV Chargers, and Commercial Building Capacity',
  NULL,
  'Electrical load study customers usually need a clear answer before they spend money on equipment, drawings, or construction. We help property owners, general contractors, architects, EV charging vendors, and facility managers understand whether the existing electrical service can support the planned load, what code or utility documentation may be needed, and whether load management, panel work, or a service upgrade should be considered before the project moves forward.\n\nUse a load study before installing multiple Level 2 chargers, planning DC fast charging, adding tenant equipment, changing a commercial space use, upgrading panels, responding to plan check comments, or asking LADWP or SCE for additional capacity.',
  NULL,
  8
FROM service_landing_pages
WHERE slug = 'electrical-load-studies'
AND NOT EXISTS (
  SELECT 1
  FROM service_landing_sections
  WHERE landing_page_id = service_landing_pages.id
  AND heading = 'Electrical Load Study Reports for Permits, EV Chargers, and Commercial Building Capacity'
);
