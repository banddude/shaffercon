-- ============================================================================
-- Page 852: Residential Electrical Code Compliance Corrections
-- Location: Pacific Palisades
-- Service: electrical-code-compliance-corrections
-- Type: residential
-- URL: /service-areas/pacific-palisades/residential-electrical-code-compliance-corrections
-- ============================================================================

-- ============================================================================
-- SERVICE OFFERINGS (13 items)
-- ============================================================================
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (852, 'Grounding system corrections and upgrades', 1),
  (852, 'Electrical panel code compliance corrections', 2),
  (852, 'Circuit breaker replacement and upgrades', 3),
  (852, 'Outdated wiring replacement and updates', 4),
  (852, 'AFCI protection installation and corrections', 5),
  (852, 'GFCI outlet installation and upgrades', 6),
  (852, 'Bonding and earthing system corrections', 7),
  (852, 'Permit violation remediation and correction', 8),
  (852, 'Safety switch installation for code compliance', 9),
  (852, 'Electrical conduit and raceway upgrades', 10),
  (852, 'Outlet and switch box code corrections', 11),
  (852, 'NEC compliance updates and corrections', 12),
  (852, 'Clearance and spacing corrections', 13);

-- ============================================================================
-- FAQs (5 items - Pacific Palisades specific)
-- ============================================================================
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (852, 'Why are electrical code compliance corrections important for my Pacific Palisades home?', 'Electrical code violations can create serious safety hazards including fire risks, electrocution, and property damage. In Pacific Palisades, where many homes are high-value properties with complex electrical systems, code compliance is critical for protecting your investment and ensuring your family''s safety. Shaffer Construction brings all violations into current code compliance, giving you peace of mind and protecting your property value.', 1),

  (852, 'How do you identify electrical code violations in Pacific Palisades properties?', 'Our licensed electricians conduct thorough inspections using industry-standard testing equipment and NEC guidelines to identify violations. We check grounding systems, panel conditions, circuit protection, wiring methods, outlet and switch placement, clearances, and bonding integrity. Whether you''ve received a code violation notice from the city or are preparing for a sale, we systematically identify and document all issues before creating a correction plan.', 2),

  (852, 'Do I need permits for electrical code compliance corrections in Pacific Palisades?', 'Yes, most electrical code corrections in Pacific Palisades require city permits and final inspections. Shaffer Construction handles the entire permitting process for you—from paperwork to final city sign-off. We ensure all work is documented, inspected, and approved by the city, giving you official confirmation that your electrical system meets current code standards. This is especially important if you''re selling or refinancing your Pacific Palisades home.', 3),

  (852, 'How long do electrical code compliance corrections typically take in Pacific Palisades?', 'Timeline depends on the scope of violations, but most residential corrections in Pacific Palisades take 1-3 weeks from start to final city inspection. Simple fixes like AFCI installation might be done in a day, while panel upgrades or rewiring take longer. We''ll provide a realistic timeline after our initial inspection. We coordinate with the city to minimize delays and keep your project moving forward efficiently.', 4),

  (852, 'What happens if electrical code violations are not corrected?', 'Uncorrected electrical violations can lead to dangerous situations, insurance claims denial, failed home inspections, difficulty selling your property, and fines from the city. If violations are discovered during construction or when selling, they must be corrected before the sale closes. Shaffer Construction ensures your Pacific Palisades home is brought into full code compliance, protecting both your safety and your property value for the future.', 5);

-- ============================================================================
-- RELATED SERVICES (5 items from Pacific Palisades)
-- ============================================================================
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (852, 'Residential Electrical Panel Upgrades', '/service-areas/pacific-palisades/residential-electrical-panel-upgrades', 1),
  (852, 'Residential Electrical Safety Inspections', '/service-areas/pacific-palisades/residential-electrical-safety-inspections', 2),
  (852, 'Residential Breaker Panel Service Maintenance', '/service-areas/pacific-palisades/residential-breaker-panel-service-maintenance', 3),
  (852, 'Residential Complete Electrical Rewiring', '/service-areas/pacific-palisades/residential-complete-electrical-rewiring', 4),
  (852, 'Residential Whole Building Surge Protection', '/service-areas/pacific-palisades/residential-whole-building-surge-protection', 5);

-- ============================================================================
-- NEARBY AREAS (5 standardized areas)
-- ============================================================================
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (852, 'Santa Monica', '/service-areas/santa-monica', 1),
  (852, 'Venice', '/service-areas/venice', 2),
  (852, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (852, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (852, 'Culver City', '/service-areas/culver-city', 5);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Verify offerings inserted
SELECT COUNT(*) as offerings_count FROM service_offerings WHERE service_page_id = 852;

-- Verify FAQs inserted
SELECT COUNT(*) as faq_count FROM service_faqs WHERE service_page_id = 852;

-- Verify related services inserted
SELECT COUNT(*) as related_services_count FROM service_related_services WHERE service_page_id = 852;

-- Verify nearby areas inserted
SELECT COUNT(*) as nearby_areas_count FROM service_nearby_areas WHERE service_page_id = 852;

-- View all content for page 852
SELECT 'Offerings' as content_type, COUNT(*) as count FROM service_offerings WHERE service_page_id = 852
UNION ALL
SELECT 'FAQs', COUNT(*) FROM service_faqs WHERE service_page_id = 852
UNION ALL
SELECT 'Related Services', COUNT(*) FROM service_related_services WHERE service_page_id = 852
UNION ALL
SELECT 'Nearby Areas', COUNT(*) FROM service_nearby_areas WHERE service_page_id = 852;
