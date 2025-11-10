-- Pacific Palisades Commercial Complete Electrical Rewiring Service Page (Page ID: 866)
-- Service: complete-electrical-rewiring (Commercial)
-- URL: /service-areas/pacific-palisades/commercial-complete-electrical-rewiring

-- ============================================================================
-- SERVICE OFFERINGS (12-15 items)
-- ============================================================================

INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (866, 'Complete building electrical rewiring', 1),
  (866, 'Electrical system design and engineering', 2),
  (866, 'Outdated wiring removal and replacement', 3),
  (866, 'Load calculations and capacity analysis', 4),
  (866, 'Electrical panel replacement and upgrades', 5),
  (866, 'New circuit installation and distribution', 6),
  (866, 'Code compliance and permit coordination', 7),
  (866, 'Commercial-grade wiring installation', 8),
  (866, 'Conduit and cable management systems', 9),
  (866, 'Grounding and bonding system installation', 10),
  (866, 'Arc flash hazard assessment and mitigation', 11),
  (866, 'Energy-efficient electrical system design', 12),
  (866, 'Smart building automation integration', 13),
  (866, 'Final inspection and testing services', 14),
  (866, 'Post-completion commissioning and documentation', 15);

-- ============================================================================
-- SERVICE FAQS (4-5 items)
-- ============================================================================

INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (866,
    'Why would my commercial building in Pacific Palisades need complete electrical rewiring?',
    'Older commercial buildings in Pacific Palisades often have outdated electrical systems that struggle to support modern equipment, increased power demands, and updated safety codes. Complete rewiring ensures your business meets current electrical codes, reduces fire hazards, improves energy efficiency, and supports modern technology like LED systems, electric charging, and smart automation. Shaffer Construction evaluates your facility''s electrical needs and creates a comprehensive rewiring plan that keeps your business operational throughout the process.',
    1),
  (866,
    'How long does commercial electrical rewiring take in Pacific Palisades?',
    'The timeline depends on building size, existing electrical infrastructure, and the complexity of the rewiring project. Most commercial rewiring projects in Pacific Palisades take 2-8 weeks, though larger properties may require longer. Shaffer Construction develops a detailed project schedule and coordinates with permit authorities to minimize downtime. We work efficiently while maintaining the highest safety standards and code compliance throughout the entire installation.',
    2),
  (866,
    'Will my business stay operational during electrical rewiring in Pacific Palisades?',
    'Yes. Shaffer Construction specializes in rewiring commercial buildings while maintaining operations. We work in phases to keep critical systems powered, coordinate power shutdowns during non-business hours when possible, and maintain safety protocols throughout the project. Our experienced team communicates regularly to ensure your business experiences minimal disruption while receiving a safe, code-compliant electrical system.',
    3),
  (866,
    'What permits and inspections are required for commercial electrical rewiring in Pacific Palisades?',
    'Complete electrical rewiring requires permits from the city of Los Angeles and multiple inspections throughout the project. Shaffer Construction handles all permit applications, coordinates with inspectors, and ensures your project meets or exceeds Los Angeles electrical codes. Our expertise navigates the permit process efficiently, keeping your project on schedule while maintaining full compliance with all building and safety requirements.',
    4),
  (866,
    'How does Shaffer Construction design electrical systems for Pacific Palisades commercial buildings?',
    'We conduct a thorough assessment of your facility''s power requirements, current usage patterns, and future growth projections. Our engineers calculate proper load distribution, design efficient distribution systems, and specify commercial-grade components rated for your building''s needs. Whether you''re a retail space in Pacific Palisades Village or a larger commercial facility, we create reliable, safe electrical systems designed for today''s demands and tomorrow''s growth.',
    5);

-- ============================================================================
-- RELATED SERVICES (5 items)
-- ============================================================================

INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (866, 'Commercial Electrical Panel Upgrades', '/service-areas/pacific-palisades/commercial-electrical-panel-upgrades', 1),
  (866, 'Commercial EV Charger Installation', '/service-areas/pacific-palisades/commercial-ev-charger-installation', 2),
  (866, 'Commercial Load Studies', '/service-areas/pacific-palisades/commercial-load-studies', 3),
  (866, 'Commercial LED Lighting Retrofit', '/service-areas/pacific-palisades/commercial-led-lighting-retrofit', 4),
  (866, 'Commercial Generator Installation', '/service-areas/pacific-palisades/commercial-generator-installation', 5);

-- ============================================================================
-- NEARBY AREAS (5 items)
-- ============================================================================

INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (866, 'Santa Monica', '/service-areas/santa-monica', 1),
  (866, 'Venice', '/service-areas/venice', 2),
  (866, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (866, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (866, 'Culver City', '/service-areas/culver-city', 5);

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this query to verify all content was inserted correctly:
--
-- SELECT 'Offerings' AS content_type, COUNT(*) AS count FROM service_offerings WHERE service_page_id = 866
-- UNION ALL
-- SELECT 'FAQs' AS content_type, COUNT(*) AS count FROM service_faqs WHERE service_page_id = 866
-- UNION ALL
-- SELECT 'Related Services' AS content_type, COUNT(*) AS count FROM service_related_services WHERE service_page_id = 866
-- UNION ALL
-- SELECT 'Nearby Areas' AS content_type, COUNT(*) AS count FROM service_nearby_areas WHERE service_page_id = 866;
