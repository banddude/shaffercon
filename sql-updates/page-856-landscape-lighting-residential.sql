-- Pacific Palisades Residential Landscape and Outdoor Lighting Service Page (ID: 856)
-- Service: landscape-outdoor-lighting
-- Type: residential
-- URL: /service-areas/pacific-palisades/residential-landscape-outdoor-lighting

-- ============================================================
-- OFFERINGS: 15 specific landscape lighting services
-- ============================================================
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (856, 'Complete landscape lighting design and installation', 1),
  (856, 'LED landscape lighting conversion and retrofit', 2),
  (856, 'Path and walkway lighting installation', 3),
  (856, 'Accent lighting for architectural features', 4),
  (856, 'Pool and water feature illumination', 5),
  (856, 'Patio and deck lighting design', 6),
  (856, 'Smart outdoor lighting control systems', 7),
  (856, 'Uplighting for trees and landscape plants', 8),
  (856, 'Step and stair safety lighting', 9),
  (856, 'Gate and property entrance lighting', 10),
  (856, 'Outdoor kitchen and bar lighting', 11),
  (856, 'Pergola, arbor, and shade structure lighting', 12),
  (856, 'Parking area and driveway lighting installation', 13),
  (856, 'Seasonal and holiday outdoor lighting', 14),
  (856, 'Outdoor lighting maintenance and repairs', 15);

-- ============================================================
-- FAQS: 5 location-specific frequently asked questions
-- ============================================================
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (856, 'What types of landscape lighting work best for Pacific Palisades coastal homes?',
   'Pacific Palisades'' coastal location means your outdoor lighting needs to withstand salt air and moisture. Shaffer Construction specializes in corrosion-resistant fixtures and weather-sealed installations that maintain their beauty and functionality in this unique environment. We use marine-grade materials and proper grounding techniques to ensure your landscape lighting lasts for years while complementing your home''s luxury aesthetic.',
   1),

  (856, 'Can landscape lighting enhance the value and curb appeal of my Pacific Palisades home?',
   'Absolutely. Well-designed landscape lighting transforms your Pacific Palisades property after dark, highlighting architectural details, creating ambiance, and improving safety. Sophisticated outdoor lighting has become a signature feature of luxury homes in the area, enhancing nighttime curb appeal and extending the usability of outdoor entertaining spaces. Shaffer Construction creates custom lighting designs that complement your home''s style and the natural beauty of your property.',
   2),

  (856, 'Do you offer smart home controls for outdoor lighting in Pacific Palisades?',
   'Yes, we install intelligent outdoor lighting systems that integrate with your smart home setup, allowing you to control landscape lights remotely via smartphone or voice commands. This is increasingly popular in Pacific Palisades, where homeowners want convenient control of their outdoor spaces while maintaining energy efficiency. We can also program scheduling and automation so your outdoor areas are perfectly lit for entertaining or security.',
   3),

  (856, 'How can landscape lighting improve security and safety around my Pacific Palisades property?',
   'Strategic outdoor lighting deters unauthorized access, illuminates potential hazards like steps and uneven terrain, and creates visibility around entry points—all critical for hillside properties in Pacific Palisades. Shaffer Construction designs safety-focused lighting layouts that balance security with aesthetic appeal, ensuring your home and guests feel secure while maintaining the neighborhood''s upscale ambiance.',
   4),

  (856, 'What''s the best way to start a landscape lighting project in Pacific Palisades?',
   'Contact Shaffer Construction for a complimentary consultation and site assessment. We''ll evaluate your property, discuss your vision, and create a custom lighting design that reflects Pacific Palisades'' luxury standards and your specific needs. Call us at (323) 642-8509 or email hello@shaffercon.com to schedule your free consultation today.',
   5);

-- ============================================================
-- RELATED SERVICES: 5 complementary Pacific Palisades services
-- ============================================================
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (856, 'Residential Lighting Installation Retrofitting', '/service-areas/pacific-palisades/residential-lighting-installation-retrofitting', 1),
  (856, 'Residential Security Motion Lighting', '/service-areas/pacific-palisades/residential-security-motion-lighting', 2),
  (856, 'Residential Smart Automation Systems', '/service-areas/pacific-palisades/residential-smart-automation-systems', 3),
  (856, 'Residential Electrical Panel Upgrades', '/service-areas/pacific-palisades/residential-electrical-panel-upgrades', 4),
  (856, 'Residential Pool Hot Tub Spa Electrical', '/service-areas/pacific-palisades/residential-pool-hot-tub-spa-electrical', 5);

-- ============================================================
-- NEARBY AREAS: 5 adjacent locations for cross-linking
-- ============================================================
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (856, 'Santa Monica', '/service-areas/santa-monica', 1),
  (856, 'Venice', '/service-areas/venice', 2),
  (856, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (856, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (856, 'Culver City', '/service-areas/culver-city', 5);
