-- Pacific Palisades Residential Electrical Panel Upgrades (Page ID: 810)
-- Service: electrical-panel-upgrades
-- Service Type: residential
-- URL: /service-areas/pacific-palisades/residential-electrical-panel-upgrades

-- Service Offerings (12 items)
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (810, 'Full electrical panel inspection and assessment', 1),
  (810, 'Panel capacity upgrades (100 to 200+ amps)', 2),
  (810, 'Main breaker replacement and installation', 3),
  (810, 'Load calculation and system design', 4),
  (810, 'Breaker installation and replacement', 5),
  (810, 'Sub-panel installation for specific circuits', 6),
  (810, 'Service entrance upgrades and rewiring', 7),
  (810, 'Code compliance and permit acquisition', 8),
  (810, 'Grounding and bonding system verification', 9),
  (810, 'GFCI and AFCI breaker installation', 10),
  (810, 'Whole-home surge protection integration', 11),
  (810, 'Smart panel monitoring system setup', 12);

-- FAQs (5 items)
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (810, 'Why do Pacific Palisades homes need electrical panel upgrades?', 'Many Pacific Palisades homes, especially those with older wiring systems or significant renovations, require panel upgrades to safely handle modern electrical demands like EV chargers, pool pumps, smart home systems, and high-end appliances. Older 100-amp panels often cannot support these additions without overwhelming the system. Shaffer Construction evaluates your specific electrical needs and designs an upgrade that safely powers your home for years to come.', 1),
  (810, 'How long does a residential panel upgrade take in Pacific Palisades?', 'A typical residential panel upgrade in Pacific Palisades takes one to three days, depending on your home''s existing setup, whether permits are required, and the scope of work. Our team handles permits, inspections, and all electrical work so you don''t have to. We work efficiently while maintaining the highest safety and code standards, and we''ll keep you informed throughout the process.', 2),
  (810, 'Will a panel upgrade require a permit in Pacific Palisades?', 'Yes, electrical panel upgrades in Pacific Palisades require proper permits and final inspection from the Los Angeles Department of Building and Safety. We handle the entire permitting process for you, including initial applications and scheduling inspections. This ensures your upgrade is safe, code-compliant, and properly documented—protecting both your home and your property value.', 3),
  (810, 'Can Shaffer Construction upgrade my panel to support an EV charger?', 'Absolutely. During the panel assessment, we calculate the electrical load needed for an EV charger alongside your other household systems. We''ll upgrade your panel to the capacity needed and often install a dedicated circuit for the charger at the same time. This integrated approach saves money and time compared to separate service calls.', 4),
  (810, 'What should I expect during an electrical panel inspection?', 'A thorough inspection includes checking breaker age and condition, testing grounding systems, evaluating panel labeling, and assessing your home''s overall electrical capacity. We''ll identify any safety concerns, code violations, or upgrades needed, then provide clear recommendations. Our goal is to ensure your Pacific Palisades home has safe, reliable power for all your current and future electrical needs.', 5);

-- Related Services (5 items)
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (810, 'Residential EV Charger Installation', '/service-areas/pacific-palisades/residential-ev-charger-installation', 1),
  (810, 'Residential Whole Building Surge Protection', '/service-areas/pacific-palisades/residential-whole-building-surge-protection', 2),
  (810, 'Residential Dedicated Equipment Circuits', '/service-areas/pacific-palisades/residential-dedicated-equipment-circuits', 3),
  (810, 'Residential Smart Automation Systems', '/service-areas/pacific-palisades/residential-smart-automation-systems', 4),
  (810, 'Residential Swimming Pool Wiring', '/service-areas/pacific-palisades/residential-swimming-pool-wiring', 5);

-- Nearby Areas (5 items - standardized list)
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (810, 'Santa Monica', '/service-areas/santa-monica', 1),
  (810, 'Venice', '/service-areas/venice', 2),
  (810, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (810, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (810, 'Culver City', '/service-areas/culver-city', 5);
