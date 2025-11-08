-- Completely revamp Residential EV page with info cards and comprehensive content
-- Delete old sections and create new modern card-based layout

-- First, delete existing sections
DELETE FROM service_landing_sections
WHERE landing_page_id = (SELECT id FROM service_landing_pages WHERE slug = 'residential-ev-charger');

-- Update hero with better content
UPDATE service_landing_pages
SET
  page_title = 'Home EV Charger Installation Los Angeles',
  hero_text = 'Experience the convenience of charging your electric vehicle at home. Professional Level 2 EV charger installation throughout Los Angeles County with expert electricians, competitive pricing, and same-day service available.'
WHERE slug = 'residential-ev-charger';

-- Create new info card sections (these will display as cards in a grid)
INSERT INTO service_landing_sections (landing_page_id, section_order, section_type, heading, content)
VALUES
  -- Card 1: Fast Charging
  (
    (SELECT id FROM service_landing_pages WHERE slug = 'residential-ev-charger'),
    1,
    'info_card',
    'Lightning-Fast Level 2 Charging',
    'Level 2 EV chargers use 240V power to deliver 25-40 miles of range per hour, up to 10x faster than standard 120V outlets. Most vehicles fully charge overnight in 4-8 hours. No more waiting around, just plug in when you get home and wake up to a full battery every morning. Perfect for daily commuters and weekend road trippers alike.'
  ),
  -- Card 2: Professional Installation
  (
    (SELECT id FROM service_landing_pages WHERE slug = 'residential-ev-charger'),
    2,
    'info_card',
    'Expert Installation & Panel Upgrades',
    'Our licensed electricians handle every detail, from electrical panel assessments and upgrades to permit applications and final inspections. We ensure your home''s electrical system can safely support your charger, install dedicated circuits with proper wire sizing, and mount your charging station exactly where you need it, whether that''s your garage, carport, or driveway.'
  ),
  -- Card 3: Universal Compatibility
  (
    (SELECT id FROM service_landing_pages WHERE slug = 'residential-ev-charger'),
    3,
    'info_card',
    'Works With All Major EV Brands',
    'Tesla, Rivian, Ford F-150 Lightning, Chevy Bolt, Nissan Leaf, Hyundai Ioniq, BMW i4, and more. We install all major charger brands including Tesla Wall Connector, ChargePoint Home Flex, JuiceBox, Grizzl-E, and Emporia. Our team will help you choose the perfect charger for your vehicle, budget, and charging needs.'
  ),
  -- Card 4: Service & Support
  (
    (SELECT id FROM service_landing_pages WHERE slug = 'residential-ev-charger'),
    4,
    'info_card',
    'Ongoing Maintenance & Support',
    'We service and maintain all EV chargers, regardless of where you purchased them. From troubleshooting connectivity issues to replacing damaged cables, our team keeps your charging station running flawlessly. Extended warranties available. 24/7 emergency support for Los Angeles County residents.'
  );

-- Add comparison table
INSERT INTO service_landing_sections (landing_page_id, section_order, section_type, heading, table_data)
VALUES
  (
    (SELECT id FROM service_landing_pages WHERE slug = 'residential-ev-charger'),
    5,
    'table',
    'Charging Speeds Comparison',
    '{"headers": ["Charger Type", "Voltage", "Power Output", "Range Per Hour", "Full Charge Time"], "rows": [["Level 1 (Standard Outlet)", "120V", "1.4 kW", "3-5 miles", "24-40 hours"], ["Level 2 (Home Charger)", "240V", "7.2-19.2 kW", "25-40 miles", "4-8 hours"], ["DC Fast Charging (Public)", "480V+", "50-350 kW", "100-200 miles", "20-60 minutes"]]}'
  );

-- Add comprehensive content section
INSERT INTO service_landing_sections (landing_page_id, section_order, section_type, heading, content)
VALUES
  (
    (SELECT id FROM service_landing_pages WHERE slug = 'residential-ev-charger'),
    6,
    'content',
    'Complete Home EV Charging Solutions',
    '<p>Shaffer Construction has been installing residential EV chargers across Los Angeles County since the early days of electric vehicles. With over two decades of electrical expertise and thousands of successful installations, we''re the trusted choice for homeowners making the switch to electric transportation.</p>

<p><strong>Our Installation Process:</strong></p>
<ul>
<li><strong>Free Consultation:</strong> We assess your home''s electrical capacity, discuss your charging needs, and recommend the best charger for your situation</li>
<li><strong>Permitting & Planning:</strong> We handle all permit applications and coordinate with your local building department</li>
<li><strong>Panel Upgrades:</strong> If needed, we upgrade your electrical panel to safely support your new charger (many older homes need 200-amp service)</li>
<li><strong>Professional Installation:</strong> Dedicated 240V circuit installation, proper conduit and wiring, secure charger mounting, and WiFi connectivity setup</li>
<li><strong>Testing & Training:</strong> Complete system testing, final inspection coordination, and hands-on training so you know how to use your new charger</li>
</ul>

<p><strong>Smart Charger Features:</strong></p>
<p>Modern Level 2 chargers offer WiFi connectivity for smartphone control, scheduling to take advantage of off-peak electricity rates, energy monitoring to track your charging costs, and integration with solar panels for truly sustainable charging. Many models are also eligible for federal tax credits and local utility rebates, we can help you navigate available incentives.</p>

<p><strong>Serving All of Los Angeles County:</strong></p>
<p>From Santa Monica to Pasadena, Long Beach to Valencia, our team provides prompt, professional service throughout the greater Los Angeles area. Same-day consultations available. Most installations completed in 1-2 days.</p>'
  );
