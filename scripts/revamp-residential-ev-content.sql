-- Revamp Residential EV Charger Installation Page Content
-- More compelling, modern, and customer-focused

-- Update hero title and text
UPDATE service_landing_pages
SET
  page_title = 'Home EV Charger Installation Los Angeles',
  hero_text = 'Experience the convenience of charging your electric vehicle at home. Professional Level 2 EV charger installation throughout Los Angeles County with expert electricians, competitive pricing, and same-day service available.'
WHERE slug = 'residential-ev-charger';

-- Update section 1: About Level 2 Chargers
UPDATE service_landing_sections
SET
  heading = 'Fast, Convenient Home Charging',
  content = 'Transform your garage into a personal charging station with a Level 2 EV charger. Using 240V power (the same as your dryer), Level 2 chargers deliver 25+ miles of range per hour, up to 10x faster than standard outlets. Wake up every morning to a fully charged vehicle, ready for your day.'
WHERE landing_page_id = (SELECT id FROM service_landing_pages WHERE slug = 'residential-ev-charger')
  AND section_order = 1;

-- Update section 3: Why Choose section
UPDATE service_landing_sections
SET
  heading = 'Why Choose Shaffer Construction?',
  content = 'With over two decades of electrical expertise in Los Angeles County, we make home EV charger installation simple and stress-free. Our certified electricians handle everything from electrical panel upgrades to permit applications, ensuring code-compliant installations backed by our workmanship guarantee.

Whether you drive a Tesla, Rivian, Ford, Chevy, or any other EV, we''ll design the perfect charging solution for your home, budget, and driving needs. We service all major charger brands and provide ongoing maintenance to keep your system running flawlessly.

Join thousands of satisfied Los Angeles homeowners who trust Shaffer Construction for their EV charging needs. Get your free consultation today.'
WHERE landing_page_id = (SELECT id FROM service_landing_pages WHERE slug = 'residential-ev-charger')
  AND section_order = 3;
