-- Pacific Palisades Residential EV Charger Installation
-- Page ID: 854
-- Service: ev-charger-installation
-- Service Type: residential

-- SERVICE OFFERINGS (14 items)
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (854, 'Level 2 EV charger installation', 1),
  (854, 'Home electrical panel upgrades', 2),
  (854, 'Load calculation and system design', 3),
  (854, 'Wall-mounted charger installation', 4),
  (854, 'Pedestal charging station installation', 5),
  (854, 'Dedicated 240V circuit installation', 6),
  (854, 'Permit acquisition and coordination', 7),
  (854, 'Underground conduit and wiring', 8),
  (854, 'Smart charger setup and configuration', 9),
  (854, 'Surge protection system installation', 10),
  (854, 'Multi-vehicle charging system design', 11),
  (854, 'Post-installation testing and inspection', 12),
  (854, 'Weatherproof outlet installation', 13),
  (854, 'Charging cable management and organization', 14);

-- SERVICE FAQs (5 items)
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (854, 'How long does EV charger installation take in Pacific Palisades?', 'Most residential EV charger installations in Pacific Palisades are completed within one business day, though timeline depends on your home''s existing electrical capacity and whether panel upgrades are needed. Shaffer Construction handles permitting, installation, and final inspection—ensuring everything meets code while minimizing disruption to your daily routine. We''ll provide a detailed timeline during your consultation.', 1),

  (854, 'Will I need to upgrade my electrical panel for a Level 2 charger?', 'It depends on your current panel capacity and home''s electrical load. Many Pacific Palisades homes with modern panels can accommodate Level 2 charging without upgrades, but larger homes or those planning multi-vehicle charging often benefit from panel upgrades. Our team performs a thorough electrical assessment to determine exactly what''s needed for safe, efficient charging at your property.', 2),

  (854, 'Does Shaffer Construction handle all permits for EV charger installation?', 'Yes, we manage the entire permitting process from start to finish. Our team ensures your Pacific Palisades EV charger installation complies with all Los Angeles Department of Building and Safety requirements, residential codes, and electrical standards. You''ll have peace of mind knowing your installation is fully permitted and inspected by qualified professionals.', 3),

  (854, 'What''s the difference between wall-mounted and pedestal charging stations?', 'Wall-mounted chargers are ideal for single-car garages and save space, while pedestal-mounted options work better for driveways or areas without convenient wall access. Both options are popular in Pacific Palisades homes depending on your garage layout and aesthetic preferences. Our electricians help you choose the best solution for your property and can install whichever option fits your needs.', 4),

  (854, 'Can Shaffer Construction install a smart charger that integrates with my home automation system?', 'Absolutely. We specialize in smart charger installation and integration with home automation systems, which is increasingly popular among Pacific Palisades homeowners. Smart chargers allow you to schedule charging during off-peak hours, monitor charging remotely, and optimize energy usage. We''ll handle the complete setup and configuration so your EV charger works seamlessly with your smart home.', 5);

-- RELATED SERVICES (5 items)
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (854, 'Residential Electrical Panel Upgrades', '/service-areas/pacific-palisades/residential-electrical-panel-upgrades', 1),
  (854, 'Residential Whole Building Surge Protection', '/service-areas/pacific-palisades/residential-whole-building-surge-protection', 2),
  (854, 'Residential Dedicated Equipment Circuits', '/service-areas/pacific-palisades/residential-dedicated-equipment-circuits', 3),
  (854, 'Residential Smart Automation Systems', '/service-areas/pacific-palisades/residential-smart-automation-systems', 4),
  (854, 'Commercial EV Charger Installation', '/service-areas/pacific-palisades/commercial-ev-charger-installation', 5);

-- NEARBY AREAS (5 items)
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (854, 'Santa Monica', '/service-areas/santa-monica', 1),
  (854, 'Venice', '/service-areas/venice', 2),
  (854, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (854, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (854, 'Culver City', '/service-areas/culver-city', 5);
