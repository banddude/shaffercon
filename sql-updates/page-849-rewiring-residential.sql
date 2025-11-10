-- Pacific Palisades Complete Electrical Rewiring (Residential) - Page 849
-- Service: complete-electrical-rewiring
-- Type: residential
-- URL: /service-areas/pacific-palisades/residential-complete-electrical-rewiring

-- Service Offerings (15 items)
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (849, 'Whole-house electrical rewiring and modernization', 1),
  (849, 'Replacement of outdated knob-and-tube wiring', 2),
  (849, 'Aluminum wiring safe removal and replacement', 3),
  (849, 'Main electrical panel and breaker upgrades', 4),
  (849, 'Subpanel installation for expanded capacity', 5),
  (849, 'New grounding and bonding for enhanced safety', 6),
  (849, 'Dedicated circuits for high-demand appliances', 7),
  (849, 'Installation of tamper-resistant and GFCI outlets', 8),
  (849, 'AFCI protection for bedrooms and living areas', 9),
  (849, 'Smart home wiring and automation integration', 10),
  (849, 'Luxury lighting design and control systems', 11),
  (849, 'Landscape and outdoor lighting infrastructure', 12),
  (849, 'Surge protection and lightning strike mitigation', 13),
  (849, 'EV charging infrastructure and conduit runs', 14),
  (849, 'Code compliance inspections and testing', 15);

-- FAQs (5 items with Pacific Palisades context)
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (849, 'What makes complete electrical rewiring important for older Pacific Palisades homes?',
   'Many Pacific Palisades estates were built decades ago with wiring systems that cannot safely support today''s high-demand appliances, smart home systems, and entertainment equipment. Complete rewiring not only eliminates fire hazards from deteriorating insulation but also enables you to fully embrace modern luxury home conveniences while maintaining code compliance. Shaffer Construction specializes in rewiring Pacific Palisades'' mix of vintage estates, mid-century homes, and contemporary properties.',
   1),

  (849, 'How long does a complete electrical rewiring project take for a Pacific Palisades home?',
   'Most Pacific Palisades residential rewiring projects take one to three weeks, depending on your home''s size, architectural complexity, and layout. Larger estates and homes with multiple levels or intricate designs may take longer. Shaffer Construction works efficiently while maintaining the high standards expected in Pacific Palisades, coordinating around your schedule and minimizing disruption to your daily life.',
   2),

  (849, 'Do you handle permits and inspections for electrical rewiring in Pacific Palisades?',
   'Yes, Shaffer Construction manages the entire permitting and inspection process for residential rewiring in Pacific Palisades. We hold all required licenses (A, B, C-10) and maintain comprehensive insurance. Our team ensures every installation meets Los Angeles County and Pacific Palisades-specific electrical codes, though final approval timelines depend on city scheduling.',
   3),

  (849, 'Can you integrate EV charging and smart home systems during the rewiring process?',
   'Absolutely! One of the biggest advantages of complete rewiring is the opportunity to build in EV charging infrastructure, smart home automation wiring, and future-proof your electrical system. We can pre-wire for Level 2 EV chargers, smart lighting controls, and integrated home automation—ideal for Pacific Palisades'' tech-savvy, eco-conscious residents.',
   4),

  (849, 'What should I expect regarding safety, warranties, and scheduling a consultation in Pacific Palisades?',
   'Our rewiring work significantly improves your home''s safety, reduces fire risk, and ensures compatibility with modern appliances and technology. Every project includes a 1-year workmanship warranty and applicable manufacturer guarantees. To schedule your complimentary assessment and estimate, call or text 323-642-8509 or email hello@shaffercon.com. We typically have availability within a few business days.',
   5);

-- Related Services (5 items)
-- Selecting logically complementary services available for Pacific Palisades
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (849, 'Residential Electrical Panel Upgrades', '/service-areas/pacific-palisades/residential-electrical-panel-upgrades', 1),
  (849, 'Residential Smart Automation Systems', '/service-areas/pacific-palisades/residential-smart-automation-systems', 2),
  (849, 'Residential Whole Building Surge Protection', '/service-areas/pacific-palisades/residential-whole-building-surge-protection', 3),
  (849, 'Residential EV Charger Installation', '/service-areas/pacific-palisades/residential-ev-charger-installation', 4),
  (849, 'Residential Lighting Installation Retrofitting', '/service-areas/pacific-palisades/residential-lighting-installation-retrofitting', 5);

-- Nearby Areas (5 items - standardized list per requirements)
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (849, 'Santa Monica', '/service-areas/santa-monica', 1),
  (849, 'Venice', '/service-areas/venice', 2),
  (849, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (849, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (849, 'Culver City', '/service-areas/culver-city', 5);
