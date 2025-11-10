-- Pacific Palisades - Residential Energy Efficiency Upgrades (Page ID: 853)
-- Service: energy-efficiency-upgrades | Type: residential
-- URL: /service-areas/pacific-palisades/residential-energy-efficiency-upgrades

-- SERVICE OFFERINGS (15 items)
-- Ordered from core services to specialized implementations
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (853, 'Comprehensive energy audits and assessments', 1),
  (853, 'LED lighting upgrades throughout home', 2),
  (853, 'Smart thermostat installation and programming', 3),
  (853, 'HVAC system upgrades and optimization', 4),
  (853, 'Air sealing and insulation improvements', 5),
  (853, 'Smart home automation system integration', 6),
  (853, 'Water heater replacement and upgrades', 7),
  (853, 'Landscape and outdoor lighting conversion', 8),
  (853, 'Whole-home energy monitoring systems', 9),
  (853, 'Electrical panel upgrades for efficiency', 10),
  (853, 'Time-of-use electricity optimization setup', 11),
  (853, 'Pool pump and equipment efficiency upgrades', 12),
  (853, 'Solar-ready electrical infrastructure preparation', 13),
  (853, 'Energy-efficient window and door circuits', 14),
  (853, 'EV charger-ready electrical infrastructure', 15);

-- SERVICE FAQs (5 items)
-- Questions are location-specific and conversational
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (853, 'How can energy efficiency upgrades benefit my Pacific Palisades home?',
   'Energy efficiency upgrades reduce your electricity consumption and monthly utility bills while improving comfort and sustainability—key priorities for many Pacific Palisades homeowners. Whether you have a mid-century modern estate or contemporary luxury home, upgrades like smart thermostats, LED lighting, and optimized HVAC systems work seamlessly with your existing infrastructure. Shaffer Construction handles the entire process, from comprehensive energy audits to final installation, ensuring your home meets modern efficiency standards without compromising aesthetics or functionality.',
   1),

  (853, 'What does a professional energy audit involve in Pacific Palisades?',
   'Our energy audits analyze your home''s electrical systems, heating and cooling efficiency, insulation quality, and lighting infrastructure to identify opportunities for improvement. We assess how your ocean-view windows, outdoor living spaces, and landscape lighting impact overall efficiency, then provide a customized roadmap tailored to your Pacific Palisades home''s unique characteristics. This data-driven approach ensures you get the most impactful upgrades that align with your goals and budget.',
   2),

  (853, 'Are energy efficiency upgrades compatible with older Pacific Palisades homes?',
   'Absolutely. Many beautiful older homes in Pacific Palisades can benefit tremendously from modern efficiency upgrades while preserving their architectural character and charm. Our team specializes in retrofitting established properties—upgrading electrical panels, installing smart controls, converting to LED lighting, and optimizing climate systems—without requiring major structural changes. We ensure all work meets current electrical codes and integrates smoothly with your home''s existing systems.',
   3),

  (853, 'How do smart home automation and energy efficiency work together?',
   'Smart automation systems like programmable thermostats, automated lighting controls, and integrated energy monitors give you real-time visibility and control over your home''s electricity use. These systems learn your preferences and habits, automatically adjusting energy consumption throughout the day and evening to maximize efficiency. Shaffer Construction integrates smart controls with your existing electrical infrastructure, creating a cohesive system that improves comfort while reducing waste.',
   4),

  (853, 'Will energy efficiency upgrades impact my outdoor spaces and pools?',
   'No—in fact, they enhance them. We can upgrade landscape lighting to energy-efficient LED, optimize pool pump circuits with variable-speed controls, and ensure outdoor entertainment areas have efficient electrical systems. Pacific Palisades homes often feature extensive outdoor living spaces, and our upgrades maintain the beauty and functionality you love while reducing energy consumption and operating costs year-round.',
   5);

-- RELATED SERVICES (5 items)
-- Logically related services available in Pacific Palisades
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (853, 'Residential LED Retrofit', '/service-areas/pacific-palisades/residential-led-retrofit', 1),
  (853, 'Residential Smart Automation Systems', '/service-areas/pacific-palisades/residential-smart-automation-systems', 2),
  (853, 'Residential EV Charger Installation', '/service-areas/pacific-palisades/residential-ev-charger-installation', 3),
  (853, 'Residential Electrical Panel Upgrades', '/service-areas/pacific-palisades/residential-electrical-panel-upgrades', 4),
  (853, 'Residential Whole Building Surge Protection', '/service-areas/pacific-palisades/residential-whole-building-surge-protection', 5);

-- NEARBY AREAS (5 items)
-- Cross-linking to verified neighboring service areas
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (853, 'Santa Monica', '/service-areas/santa-monica', 1),
  (853, 'Venice', '/service-areas/venice', 2),
  (853, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (853, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (853, 'Culver City', '/service-areas/culver-city', 5);
