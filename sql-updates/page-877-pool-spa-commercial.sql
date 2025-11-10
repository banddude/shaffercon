-- Page 877: Commercial Pool, Hot Tub & Spa Electrical Services - Pacific Palisades
-- Service: pool-hot-tub-spa-electrical (Commercial)
-- URL: /service-areas/pacific-palisades/commercial-pool-hot-tub-spa-electrical

-- ============================================================================
-- SERVICE OFFERINGS (12-15 items)
-- ============================================================================
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (877, 'Commercial pool equipment electrical installation', 1),
  (877, 'Hot tub and spa electrical setup and connection', 2),
  (877, 'Pool pump motor electrical wiring', 3),
  (877, 'Pool heater electrical installation', 4),
  (877, 'Filtration system electrical connections', 5),
  (877, 'Underwater LED pool lighting installation', 6),
  (877, 'Spa jet system electrical hookup', 7),
  (877, 'Chemical feeder and chlorinator electrical setup', 8),
  (877, 'Pool automation and control system installation', 9),
  (877, 'GFCI outlet installation for pool areas', 10),
  (877, 'Pool bonding and grounding systems', 11),
  (877, 'Electrical load calculations and panel upgrades', 12),
  (877, 'Spa circulation pump wiring and installation', 13),
  (877, 'Code compliance inspections and permits', 14),
  (877, 'Emergency shutoff and safety system installation', 15);

-- ============================================================================
-- FREQUENTLY ASKED QUESTIONS (4-5 items)
-- ============================================================================
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (877, 'What electrical codes apply to commercial pools and spas in Pacific Palisades?',
   'Commercial pool and spa electrical installations in Pacific Palisades must comply with the California Electrical Code, which includes strict requirements for GFCI protection, bonding, grounding, and clearance distances. Shaffer Construction stays current with all local and state electrical codes, ensuring your facility meets every safety requirement and passes inspection the first time. We handle all permits and inspections as part of our comprehensive service.', 1),

  (877, 'Can Shaffer Construction upgrade my existing pool electrical system in Pacific Palisades?',
   'Yes, we regularly upgrade existing commercial pool and spa electrical systems in Pacific Palisades to meet current safety codes or accommodate new equipment. Whether you are adding new features, replacing aging equipment, or improving your automation system, our team assesses your current setup and designs solutions that work seamlessly with your facility. Contact us for a complimentary consultation about your specific upgrade needs.', 2),

  (877, 'How long does a commercial pool electrical installation take?',
   'The timeline for commercial pool electrical installation depends on the complexity of your project, existing electrical infrastructure, and whether panel upgrades are needed. Most installations take several days to a week, and we coordinate closely with you to minimize disruption to your business. Shaffer Construction provides detailed timelines upfront so you know exactly what to expect.', 3),

  (877, 'What makes pool bonding and grounding so important?',
   'Proper bonding and grounding are critical safety features that prevent dangerous electrical shocks and equipment damage in commercial pools. These systems create a unified electrical path that safely dissipates stray electrical currents around the pool and spa areas. California Electrical Code requires strict bonding and grounding for all commercial pools, and our electricians ensure every requirement is met to keep guests and staff safe.', 4),

  (877, 'Do I need a separate electrical panel for my pool and spa equipment?',
   'Many commercial pools and spas benefit from dedicated electrical circuits or a separate panel to handle their high power demands without affecting other facility operations. Shaffer Construction evaluates your electrical load, existing panel capacity, and equipment requirements to design the most efficient and code-compliant solution for your Pacific Palisades facility. We''ll recommend the best approach based on your specific situation.', 5);

-- ============================================================================
-- RELATED SERVICES (5 items) - Pacific Palisades
-- ============================================================================
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (877, 'Commercial Electrical Panel Upgrades', '/service-areas/pacific-palisades/commercial-electrical-panel-upgrades', 1),
  (877, 'Commercial LED Lighting Systems', '/service-areas/pacific-palisades/commercial-led-lighting-systems', 2),
  (877, 'Commercial Surge Protection Systems', '/service-areas/pacific-palisades/commercial-surge-protection-systems', 3),
  (877, 'Commercial Equipment Installation and Wiring', '/service-areas/pacific-palisades/commercial-equipment-installation', 4),
  (877, 'Commercial Smart Automation Systems', '/service-areas/pacific-palisades/commercial-smart-automation-systems', 5);

-- ============================================================================
-- NEARBY AREAS (5 items) - Standardized list
-- ============================================================================
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (877, 'Santa Monica', '/service-areas/santa-monica', 1),
  (877, 'Venice', '/service-areas/venice', 2),
  (877, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (877, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (877, 'Culver City', '/service-areas/culver-city', 5);
