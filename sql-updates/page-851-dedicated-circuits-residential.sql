-- Pacific Palisades Residential Dedicated Equipment Circuits (Page 851)
-- Service: dedicated-equipment-circuits | Service Type: residential

-- Service Offerings (15 items)
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (851, 'Water heater dedicated circuit installation', 1),
  (851, 'Electric range and cooktop circuits', 2),
  (851, 'Dryer circuit installation and wiring', 3),
  (851, 'HVAC system dedicated circuits', 4),
  (851, 'Central air conditioning circuits', 5),
  (851, 'Pool pump and equipment circuits', 6),
  (851, 'Hot tub and spa dedicated circuits', 7),
  (851, 'Sauna and steam room circuits', 8),
  (851, 'Wine cooler and refrigeration circuits', 9),
  (851, 'Home theater power distribution', 10),
  (851, 'Landscape lighting circuits', 11),
  (851, 'Smart home automation dedicated circuits', 12),
  (851, 'Heavy-load appliance circuit upgrades', 13),
  (851, 'Load calculations and panel assessment', 14),
  (851, 'Equipment circuit troubleshooting and repairs', 15);

-- FAQs (5 items - location-specific)
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (851, 'Why do luxury homes in Pacific Palisades need dedicated circuits for major appliances?',
   'Pacific Palisades homes often feature high-end appliances, heated pools, spas, and sophisticated HVAC systems that draw significant electrical power. Dedicated circuits prevent overloads, reduce fire risk, and ensure each appliance operates safely and efficiently. Shaffer Construction designs custom circuit solutions tailored to your Pacific Palisades home''s specific power requirements and luxury features.',
   1),

  (851, 'What types of equipment should have dedicated circuits in my Pacific Palisades home?',
   'Major appliances like water heaters, electric ranges, dryers, and HVAC systems require dedicated circuits by code. Many Pacific Palisades homeowners also add dedicated circuits for pool pumps, hot tubs, saunas, wine coolers, and entertainment systems. Our electricians assess your home''s electrical needs and recommend the best circuit configuration for your lifestyle and property.',
   2),

  (851, 'How do I know if my Pacific Palisades home needs additional dedicated circuits?',
   'Signs include frequent circuit breaker trips, flickering lights when appliances run, or if you''re adding new equipment like pools or smart home systems. Our comprehensive electrical assessment identifies overloaded circuits and determines exactly what additional dedicated circuits your Pacific Palisades home needs for safe, reliable operation.',
   3),

  (851, 'Can Shaffer Construction install dedicated circuits without major disruption to my Pacific Palisades residence?',
   'Absolutely. Our licensed electricians plan and execute dedicated circuit installations to minimize disruption to your daily routine. Whether your Pacific Palisades home requires simple circuit additions or panel upgrades, we work efficiently and professionally to complete the job while maintaining the comfort and aesthetics of your property.',
   4),

  (851, 'What''s the difference between a dedicated circuit and a regular outlet circuit in a Pacific Palisades home?',
   'A dedicated circuit serves a single appliance or equipment group exclusively, ensuring it receives consistent, uninterrupted power—essential for major appliances. Regular circuits share power among multiple outlets. Pacific Palisades homes with modern amenities benefit significantly from strategic dedicated circuits, preventing overloads and protecting expensive equipment investment.',
   5);

-- Related Services (5 items - Pacific Palisades)
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (851, 'Residential Electrical Panel Upgrades', '/service-areas/pacific-palisades/residential-electrical-panel-upgrades', 1),
  (851, 'Residential Whole Building Surge Protection', '/service-areas/pacific-palisades/residential-whole-building-surge-protection', 2),
  (851, 'Residential Smart Automation Systems', '/service-areas/pacific-palisades/residential-smart-automation-systems', 3),
  (851, 'Residential Complete Electrical Rewiring', '/service-areas/pacific-palisades/residential-complete-electrical-rewiring', 4),
  (851, 'Residential EV Charger Installation', '/service-areas/pacific-palisades/residential-ev-charger-installation', 5);

-- Nearby Areas (5 items - standardized list)
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (851, 'Santa Monica', '/service-areas/santa-monica', 1),
  (851, 'Venice', '/service-areas/venice', 2),
  (851, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (851, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (851, 'Culver City', '/service-areas/culver-city', 5);
