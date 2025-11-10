-- Pacific Palisades Residential Electrical Safety Inspections (Page ID: 808)
-- Service: electrical-safety-inspections
-- Type: residential
-- URL: /service-areas/pacific-palisades/residential-electrical-safety-inspections

-- ============================================================================
-- SERVICE OFFERINGS (12-15 items)
-- ============================================================================
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (808, 'Whole home electrical safety inspection', 1),
  (808, 'Electrical code compliance verification', 2),
  (808, 'Electrical panel assessment and evaluation', 3),
  (808, 'Residential wiring safety evaluation', 4),
  (808, 'Outlet and switch functional testing', 5),
  (808, 'Grounding system integrity verification', 6),
  (808, 'Arc fault circuit breaker testing', 7),
  (808, 'GFCI outlet installation and verification', 8),
  (808, 'Electrical fire hazard assessment', 9),
  (808, 'Overload protection system review', 10),
  (808, 'Short circuit protection evaluation', 11),
  (808, 'Electrical upgrade recommendations', 12),
  (808, 'Insurance compliance documentation', 13),
  (808, 'Pre-purchase electrical inspection', 14),
  (808, 'Knob-and-tube wiring evaluation', 15);

-- ============================================================================
-- SERVICE FAQs (4-5 items with Pacific Palisades-specific questions)
-- ============================================================================
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (808,
   'Why do I need an electrical safety inspection for my Pacific Palisades home?',
   'Pacific Palisades homes range from mid-century modern estates to newer luxury residences, many with complex electrical systems that power advanced appliances, pools, and smart home technology. A comprehensive electrical safety inspection identifies potential hazards like outdated wiring, overloaded circuits, or grounding issues before they become dangerous. Shaffer Construction helps you protect your family, preserve your property value, and ensure code compliance—essential for this upscale neighborhood where homes represent significant investments.',
   1),

  (808,
   'How long does a residential electrical safety inspection take in Pacific Palisades?',
   'Most residential electrical safety inspections in Pacific Palisades take 2-4 hours, depending on your home''​s age, size, and system complexity. Older homes or those with multiple electrical additions may require more time for thorough evaluation. Our licensed electricians perform detailed inspections of your panel, circuits, grounding, outlets, and wiring while you stay informed every step of the way. We provide a comprehensive written report documenting our findings and any recommended upgrades.',
   2),

  (808,
   'What does a complete electrical safety inspection include in Pacific Palisades?',
   'Our comprehensive inspection covers your electrical panel, circuit breaker function, grounding and bonding systems, all outlets and switches, visible wiring conditions, GFCI and AFCI protection, fire hazard assessment, and code compliance review. For Pacific Palisades homes with pools, outdoor living spaces, or smart home systems, we evaluate those specialized circuits too. Shaffer Construction provides detailed documentation identifying any safety concerns and practical recommendations for upgrades or repairs to ensure your electrical system is safe and future-ready.',
   3),

  (808,
   'Can you help with electrical inspections for insurance or real estate purposes in Pacific Palisades?',
   'Yes! We provide inspection reports suitable for insurance companies, home purchase transactions, and compliance documentation. If your insurance carrier requires an electrical safety inspection in Pacific Palisades, or if you''​re buying or selling a home, our detailed findings and professional documentation help streamline the process. Call us at (323) 642-8509 or email hello@shaffercon.com to discuss your specific needs and get a complimentary estimate.',
   4),

  (808,
   'How often should I have my electrical system inspected in my Pacific Palisades home?',
   'The National Electrical Code recommends a professional electrical inspection every 10 years for residential properties, though homes older than 40 years may benefit from more frequent inspections. If you''​ve noticed flickering lights, frequently tripping breakers, outlets not working, burning smells, or if you''​re planning major renovations, an inspection should be a priority. Shaffer Construction can assess your home''​s unique situation and recommend an inspection schedule that keeps your Pacific Palisades residence safe and up to current electrical standards.',
   5);

-- ============================================================================
-- RELATED SERVICES (5 items - Pacific Palisades only)
-- ============================================================================
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (808, 'Residential Electrical Panel Upgrades', '/service-areas/pacific-palisades/residential-electrical-panel-upgrades', 1),
  (808, 'Residential Whole Building Surge Protection', '/service-areas/pacific-palisades/residential-whole-building-surge-protection', 2),
  (808, 'Residential Electrical Troubleshooting and Repairs', '/service-areas/pacific-palisades/residential-electrical-troubleshooting-repairs', 3),
  (808, 'Residential Dedicated Equipment Circuits', '/service-areas/pacific-palisades/residential-dedicated-equipment-circuits', 4),
  (808, 'Residential Smart Automation Systems', '/service-areas/pacific-palisades/residential-smart-automation-systems', 5);

-- ============================================================================
-- NEARBY AREAS (5 items - standardized list)
-- ============================================================================
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (808, 'Santa Monica', '/service-areas/santa-monica', 1),
  (808, 'Venice', '/service-areas/venice', 2),
  (808, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (808, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (808, 'Culver City', '/service-areas/culver-city', 5);
