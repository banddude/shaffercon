-- Pacific Palisades Residential Electrical Troubleshooting & Repairs
-- Page ID: 806
-- Service: Electrical Troubleshooting & Repairs (Residential)
-- URL: /service-areas/pacific-palisades/residential-electrical-troubleshooting-repairs

-- ============================================================================
-- SERVICE OFFERINGS (15 items)
-- ============================================================================
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (806, 'Flickering light and outlet diagnosis', 1),
  (806, 'Outlet and switch replacement', 2),
  (806, 'Circuit breaker troubleshooting and reset', 3),
  (806, 'Faulty wiring detection and repair', 4),
  (806, 'Electrical panel inspections', 5),
  (806, 'GFCI outlet installation and repair', 6),
  (806, 'Power outage investigation and restoration', 7),
  (806, 'Appliance electrical connection troubleshooting', 8),
  (806, 'Dimmer and smart switch installation', 9),
  (806, 'Arc fault circuit interrupter (AFCI) installation', 10),
  (806, 'Light fixture troubleshooting and repair', 11),
  (806, 'Whole-house surge protector installation', 12),
  (806, 'Outdoor outlet and lighting repairs', 13),
  (806, 'Electrical code compliance verification', 14),
  (806, 'Home electrical safety inspections', 15);

-- ============================================================================
-- SERVICE FAQs (5 FAQs)
-- ============================================================================
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (
    806,
    'When should I call an electrician for troubleshooting in Pacific Palisades?',
    'If you notice flickering lights, dead outlets, tripped breakers, or any unusual electrical behavior in your Pacific Palisades home, it''s best to contact a professional electrician. While some issues may seem minor, they can indicate serious problems like faulty wiring or overloaded circuits that pose safety risks. Shaffer Construction''s experienced electricians can quickly diagnose the issue and recommend the safest solution to protect your family and home.',
    1
  ),
  (
    806,
    'What causes frequent electrical outages in Pacific Palisades homes?',
    'Frequent outages in Pacific Palisades homes can stem from overloaded circuits, aging electrical systems, faulty breakers, or problems with outdoor connections affected by coastal weather. Luxury homes in Pacific Palisades often demand high electrical capacity for multiple systems—heating, cooling, pools, and smart home technology—which can strain older panels. Our electricians will perform a complete diagnostic to identify the root cause and discuss upgrade options if needed to ensure reliable power throughout your home.',
    2
  ),
  (
    806,
    'Is it safe to troubleshoot electrical problems myself in my Pacific Palisades home?',
    'Electrical work involves serious safety risks including electric shock, fires, and code violations that can affect your home''s value and insurance. We strongly recommend leaving troubleshooting and repairs to licensed professionals like Shaffer Construction, especially in Pacific Palisades where homes often have complex electrical systems. Our electricians are fully licensed, insured, and trained to work safely while meeting all California electrical codes.',
    3
  ),
  (
    806,
    'How often should my Pacific Palisades home''s electrical system be inspected?',
    'Most homeowners should have their electrical system inspected every 3-5 years, or more frequently if the home is older or if you''ve experienced electrical issues. Pacific Palisades homes that are over 20 years old may benefit from regular inspections to catch potential problems before they become hazardous. Shaffer Construction can assess your system and recommend an inspection schedule tailored to your home''s age and condition.',
    4
  ),
  (
    806,
    'What''s the difference between a tripped circuit breaker and a serious electrical problem?',
    'A tripped breaker is often your home''s safety system shutting down due to overloaded circuits, but repeated tripping indicates an underlying problem requiring professional investigation. A single trip might resolve by resetting the breaker, but if it keeps happening, you likely have faulty wiring, a defective breaker, or an appliance drawing too much power. Contact Shaffer Construction for a thorough diagnostic to determine whether it''s a simple fix or a more serious issue.',
    5
  );

-- ============================================================================
-- RELATED SERVICES (5 services, Pacific Palisades)
-- ============================================================================
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (806, 'Residential Electrical Panel Upgrades', '/service-areas/pacific-palisades/residential-electrical-panel-upgrades', 1),
  (806, 'Residential Whole Building Surge Protection', '/service-areas/pacific-palisades/residential-whole-building-surge-protection', 2),
  (806, 'Residential Dedicated Equipment Circuits', '/service-areas/pacific-palisades/residential-dedicated-equipment-circuits', 3),
  (806, 'Residential Landscape Lighting Installation', '/service-areas/pacific-palisades/residential-landscape-lighting-installation', 4),
  (806, 'Residential Smart Automation Systems', '/service-areas/pacific-palisades/residential-smart-automation-systems', 5);

-- ============================================================================
-- NEARBY AREAS (5 areas - standardized list)
-- ============================================================================
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (806, 'Santa Monica', '/service-areas/santa-monica', 1),
  (806, 'Venice', '/service-areas/venice', 2),
  (806, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (806, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (806, 'Culver City', '/service-areas/culver-city', 5);
