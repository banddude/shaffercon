-- Pacific Palisades Commercial Security Motion Lighting Page (Page ID: 878)
-- Service URL: /service-areas/pacific-palisades/commercial-security-motion-lighting

-- ============================================================================
-- SERVICE OFFERINGS
-- ============================================================================
-- 15 specific, actionable offerings ordered from common to specialized services

INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (878, 'Motion sensor lighting installation and configuration', 1),
  (878, 'Security perimeter lighting systems', 2),
  (878, 'Commercial security camera integration with lighting', 3),
  (878, 'Automated dusk-to-dawn lighting control', 4),
  (878, 'Motion-activated landscape and pathway lighting', 5),
  (878, 'High-security floodlight installation and positioning', 6),
  (878, 'Underground wiring for security lighting systems', 7),
  (878, 'Smart lighting control with smartphone access', 8),
  (878, 'Backup power systems for security lighting', 9),
  (878, 'UV and infrared lighting for advanced security', 10),
  (878, 'Hardwired motion sensor installation', 11),
  (878, 'Lighting integration with security alarm systems', 12),
  (878, 'Commercial outdoor lighting design consultation', 13),
  (878, 'Weatherproof lighting fixture upgrades', 14),
  (878, 'Photocell and sensor troubleshooting and repair', 15);

-- ============================================================================
-- SERVICE FAQs
-- ============================================================================
-- 5 location-specific, customer-focused questions with informative answers

INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (878,
   'How can motion-activated security lighting protect my Pacific Palisades commercial property?',
   'Motion-activated security lighting is one of the most effective deterrents against unauthorized access, vandalism, and theft. By automatically illuminating when motion is detected, these systems eliminate dark areas where intruders might hide or operate unseen. For Pacific Palisades commercial properties—from retail spaces in the village to office buildings on hillside locations—this layered security approach works seamlessly with cameras and alarm systems to provide comprehensive protection around the clock.',
   1),
  (878,
   'What is the difference between motion sensor lights and traditional outdoor lighting for commercial properties?',
   'Traditional outdoor lighting runs continuously from dusk to dawn, using significant energy regardless of activity or occupancy. Motion sensor lights activate only when movement is detected, reducing energy consumption by 50-80% while still providing full illumination when needed. For Pacific Palisades commercial properties, this efficiency translates to lower electrical bills and reduced environmental impact—important considerations for businesses in our eco-conscious community.',
   2),
  (878,
   'Can security motion lighting be integrated with my existing security system in Pacific Palisades?',
   'Absolutely. Modern security motion lighting systems integrate seamlessly with existing alarm systems, cameras, and smart building controls. Whether your Pacific Palisades commercial property has a hardwired legacy system or modern wireless smart home technology, Shaffer Construction can design a unified security lighting solution that communicates with all your existing equipment, providing centralized control and monitoring.',
   3),
  (878,
   'How energy-efficient is motion-activated security lighting for commercial properties?',
   'Motion-activated security lighting is one of the most energy-efficient outdoor lighting solutions available. LED fixtures combined with motion sensors can reduce energy consumption by 70-80% compared to traditional 24/7 lighting, while providing the same or better security coverage. For Pacific Palisades commercial properties with large outdoor areas, these energy savings add up quickly—contact us for a free consultation on your specific lighting needs and estimated savings.',
   4),
  (878,
   'What makes Pacific Palisades properties require specialized security lighting design?',
   'Pacific Palisades has unique characteristics that affect security lighting design—hillside terrain, ocean views, dense vegetation, and varied building elevations require customized solutions. Coastal properties face salt spray corrosion, while hillside locations need strategic lighting to eliminate multiple shadow areas. Our team understands these Pacific Palisades-specific challenges and designs security lighting systems that overcome local conditions while maintaining the aesthetic integrity your property deserves.',
   5);

-- ============================================================================
-- RELATED SERVICES
-- ============================================================================
-- 5 complementary Pacific Palisades electrical services

INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (878, 'Commercial Electrical Panel Installation and Upgrades', '/service-areas/pacific-palisades/commercial-electrical-panel-installation-upgrades', 1),
  (878, 'Commercial Whole Building Surge Protection', '/service-areas/pacific-palisades/commercial-whole-building-surge-protection', 2),
  (878, 'Commercial Equipment Circuits and Dedicated Outlets', '/service-areas/pacific-palisades/commercial-equipment-circuits-dedicated-outlets', 3),
  (878, 'Residential Landscape and Outdoor Lighting', '/service-areas/pacific-palisades/residential-landscape-outdoor-lighting', 4),
  (878, 'Commercial Security System Wiring', '/service-areas/pacific-palisades/commercial-security-system-wiring', 5);

-- ============================================================================
-- NEARBY AREAS
-- ============================================================================
-- 5 nearby locations for cross-linking (standardized list)

INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (878, 'Santa Monica', '/service-areas/santa-monica', 1),
  (878, 'Venice', '/service-areas/venice', 2),
  (878, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (878, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (878, 'Culver City', '/service-areas/culver-city', 5);

-- ============================================================================
-- VERIFICATION QUERIES (Run these to verify data was inserted correctly)
-- ============================================================================

-- Verify offerings count (should be 15)
-- SELECT COUNT(*) as offering_count FROM service_offerings WHERE service_page_id = 878;

-- Verify FAQs count (should be 5)
-- SELECT COUNT(*) as faq_count FROM service_faqs WHERE service_page_id = 878;

-- Verify related services count (should be 5)
-- SELECT COUNT(*) as related_services_count FROM service_related_services WHERE service_page_id = 878;

-- Verify nearby areas count (should be 5)
-- SELECT COUNT(*) as nearby_areas_count FROM service_nearby_areas WHERE service_page_id = 878;

-- View all offerings for this page
-- SELECT * FROM service_offerings WHERE service_page_id = 878 ORDER BY offering_order;

-- View all FAQs for this page
-- SELECT * FROM service_faqs WHERE service_page_id = 878 ORDER BY faq_order;
