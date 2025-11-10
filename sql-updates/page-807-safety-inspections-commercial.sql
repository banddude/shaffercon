-- Page 807: Commercial Electrical Safety Inspections - Pacific Palisades
-- Service: electrical-safety-inspections
-- Type: commercial
-- URL: /service-areas/pacific-palisades/commercial-electrical-safety-inspections

-- =====================================================================
-- SERVICE OFFERINGS (13 items - ordered from most to least common)
-- =====================================================================
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (807, 'Comprehensive electrical system inspections', 1),
  (807, 'Code compliance and safety verification', 2),
  (807, 'Panel and breaker testing and evaluation', 3),
  (807, 'Wiring condition assessment and reporting', 4),
  (807, 'Grounding system testing and verification', 5),
  (807, 'Load analysis and capacity evaluation', 6),
  (807, 'Arc flash hazard assessments', 7),
  (807, 'Emergency lighting and exit sign testing', 8),
  (807, 'Fire alarm system electrical integration review', 9),
  (807, 'Equipment and appliance electrical safety checks', 10),
  (807, 'GFCI and AFCI outlet testing and certification', 11),
  (807, 'Thermal imaging for electrical hotspots', 12),
  (807, 'Pre-renovation and pre-purchase inspections', 13);

-- =====================================================================
-- FREQUENTLY ASKED QUESTIONS (5 items - Pacific Palisades focused)
-- =====================================================================
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (807,
   'Why is a commercial electrical safety inspection important for my Pacific Palisades business?',
   'A comprehensive electrical safety inspection ensures your Pacific Palisades commercial space meets current electrical codes and is free of hazards that could cause fires, shocks, or equipment damage. Whether you own a boutique in the Village, an office building, or a restaurant, regular inspections protect your employees, customers, and assets. Shaffer Construction performs detailed inspections using industry-standard methods and thermal imaging to identify hidden problems before they become expensive or dangerous.',
   1),

  (807,
   'How often should commercial electrical systems be inspected in Pacific Palisades?',
   'Most commercial buildings benefit from electrical inspections every 3-5 years, though older buildings in Pacific Palisades may need more frequent reviews, especially if they''ve been updated with new equipment or higher electrical demands. Retailers with heavy equipment usage, restaurants with complex electrical systems, and any business undergoing renovations should have inspections before and after work. Shaffer Construction can recommend the right inspection schedule based on your building''s age, condition, and usage patterns.',
   2),

  (807,
   'What makes commercial electrical safety different from residential in Pacific Palisades?',
   'Commercial electrical systems handle much higher loads, have more complex equipment, and must meet stricter building codes than residential installations. Pacific Palisades commercial properties often have specialized requirements like emergency backup systems, fire alarm integration, and three-phase power systems. Our inspectors are trained in commercial standards and understand the unique demands of retail, office, and hospitality businesses operating in our area.',
   3),

  (807,
   'What happens if an inspection finds problems with our electrical system?',
   'We provide a detailed written report outlining any code violations, safety concerns, or needed upgrades with clear recommendations. For minor issues like outlet problems, we can often correct them immediately. For more complex issues like panel upgrades or rewiring, we''ll explain options and help you prioritize repairs based on safety risks. Shaffer Construction can handle all recommended electrical work to get your Pacific Palisades property fully compliant.',
   4),

  (807,
   'Do I need an electrical inspection before selling my Pacific Palisades commercial property?',
   'Yes, a pre-sale inspection is highly recommended and often expected by serious buyers in Pacific Palisades. It demonstrates that your electrical system is safe and code-compliant, which increases buyer confidence and can strengthen your negotiating position. Shaffer Construction''s comprehensive inspections provide the documentation buyers want to see, potentially making your property more attractive and valuable in our competitive local market.',
   5);

-- =====================================================================
-- RELATED SERVICES (5 items - Pacific Palisades commercial services)
-- =====================================================================
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (807, 'Commercial Electrical Panel Upgrades', '/service-areas/pacific-palisades/commercial-electrical-panel-upgrades', 1),
  (807, 'Commercial EV Charger Installation', '/service-areas/pacific-palisades/commercial-ev-charger-installation', 2),
  (807, 'Commercial Lighting Retrofit and Installation', '/service-areas/pacific-palisades/commercial-lighting-retrofit-and-installation', 3),
  (807, 'Commercial Load Studies and Analysis', '/service-areas/pacific-palisades/commercial-load-studies-and-analysis', 4),
  (807, 'Commercial Generator Installation and Testing', '/service-areas/pacific-palisades/commercial-generator-installation-and-testing', 5);

-- =====================================================================
-- NEARBY AREAS (5 items - standardized list)
-- =====================================================================
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (807, 'Santa Monica', '/service-areas/santa-monica', 1),
  (807, 'Venice', '/service-areas/venice', 2),
  (807, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (807, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (807, 'Culver City', '/service-areas/culver-city', 5);
