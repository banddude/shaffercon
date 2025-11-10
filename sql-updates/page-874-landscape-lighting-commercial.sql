-- =============================================================================
-- Pacific Palisades Commercial Landscape and Outdoor Lighting (Page 874)
-- =============================================================================
-- Page ID: 874
-- Service: landscape-outdoor-lighting
-- Service Type: commercial
-- Location: Pacific Palisades
-- URL: /service-areas/pacific-palisades/commercial-landscape-outdoor-lighting

-- ============================================================================
-- SERVICE OFFERINGS (15 specific commercial landscape lighting services)
-- ============================================================================
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (874, 'Commercial landscape lighting design and installation', 1),
  (874, 'LED landscape lighting conversion and system retrofit', 2),
  (874, 'Architectural accent lighting for building facades', 3),
  (874, 'Restaurant and outdoor dining area illumination', 4),
  (874, 'Retail storefront and signage accent lighting', 5),
  (874, 'Parking lot and vehicle circulation lighting systems', 6),
  (874, 'Pathway and wayfinding accent lighting installation', 7),
  (874, 'Pool and water feature commercial illumination', 8),
  (874, 'Smart outdoor lighting control and automation systems', 9),
  (874, 'Landscape uplighting for trees and hardscape features', 10),
  (874, 'Gate, entrance, and property perimeter lighting', 11),
  (874, 'Driveway, loading area, and service road lighting', 12),
  (874, 'Emergency egress and safety code-compliant lighting', 13),
  (874, 'Commercial landscape lighting maintenance and repairs', 14),
  (874, 'Seasonal and event-specific outdoor lighting installations', 15);

-- ============================================================================
-- FAQS (5 location-specific frequently asked questions)
-- ============================================================================
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (874, 'Why is professional landscape lighting critical for Pacific Palisades commercial properties?',
   'Pacific Palisades'' upscale commercial properties—from fine dining restaurants to luxury retail and professional offices—depend on sophisticated landscape lighting to create the right ambiance, enhance curb appeal, and maintain safety standards. Professional outdoor lighting extends your usable business hours, highlights architectural features that set your property apart, and demonstrates commitment to quality that matches the neighborhood''s high standards. Shaffer Construction designs custom systems that enhance your property''s nighttime presence while meeting all safety and code requirements.',
   1),

  (874, 'How can landscape lighting improve safety and security at my Pacific Palisades business?',
   'Well-designed commercial landscape lighting eliminates dark areas around your property, improves visibility at entrances and parking areas, and deters unauthorized access—all essential for Pacific Palisades properties in hillside locations. Strategic illumination of walkways, stairs, and vehicle circulation areas prevents accidents and shows customers and employees that safety is a priority. Shaffer Construction designs layered lighting systems that balance security, safety, and aesthetic appeal, creating professional environments where people feel confident and secure.',
   2),

  (874, 'What landscape lighting solutions work best for Pacific Palisades'' coastal environment?',
   'Pacific Palisades'' salt air and moisture require specialty fixtures and materials that resist corrosion while maintaining their appearance over years of exposure. We use marine-grade and weather-sealed lighting fixtures, stainless steel hardware, and proper grounding and bonding techniques to ensure your investment lasts. LED technology also performs exceptionally in coastal climates, offering durability and efficiency that traditional lighting can''t match. Our team is experienced with Pacific Palisades'' unique environmental challenges and specifications.',
   3),

  (874, 'Do you offer remote monitoring and smart controls for commercial landscape lighting systems?',
   'Yes, we integrate intelligent outdoor lighting systems that allow you to control commercial landscape lighting remotely via smartphone or web portal, adjust schedules based on business hours, and monitor system health 24/7. This technology is increasingly popular with Pacific Palisades business owners who want energy efficiency, operational convenience, and the ability to create different lighting scenes for various occasions. Smart controls also reduce manual maintenance and help optimize energy consumption across your property.',
   4),

  (874, 'What''s included in a comprehensive landscape lighting maintenance program for Pacific Palisades businesses?',
   'Commercial landscape lighting requires regular maintenance to maintain performance, extend fixture life, and ensure code compliance. Our maintenance programs include scheduled fixture cleaning, bulb and component replacements, system testing, adjustments for seasonal changes, and repairs as needed. Pacific Palisades properties benefit from seasonal adjustments that account for changing daylight hours and vegetation growth throughout the year. Contact Shaffer Construction to set up a customized maintenance plan that keeps your landscape lighting looking professional and functioning reliably year-round.',
   5);

-- ============================================================================
-- RELATED SERVICES (5 complementary Pacific Palisades commercial services)
-- ============================================================================
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (874, 'Commercial Electrical Panel Upgrades', '/service-areas/pacific-palisades/commercial-electrical-panel-upgrades', 1),
  (874, 'Commercial Dedicated Equipment Circuits', '/service-areas/pacific-palisades/commercial-dedicated-equipment-circuits', 2),
  (874, 'Commercial Smart Automation Systems', '/service-areas/pacific-palisades/commercial-smart-automation-systems', 3),
  (874, 'Commercial Electrical Safety Inspections', '/service-areas/pacific-palisades/commercial-electrical-safety-inspections', 4),
  (874, 'Commercial EV Charger Installation', '/service-areas/pacific-palisades/commercial-ev-charger-installation', 5);

-- ============================================================================
-- NEARBY AREAS (5 standardized adjacent locations for cross-linking)
-- ============================================================================
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (874, 'Santa Monica', '/service-areas/santa-monica', 1),
  (874, 'Venice', '/service-areas/venice', 2),
  (874, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (874, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (874, 'Culver City', '/service-areas/culver-city', 5);
