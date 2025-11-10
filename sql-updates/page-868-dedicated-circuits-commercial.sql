-- Pacific Palisades Commercial Dedicated Equipment Circuits (Page ID: 868)
-- Service: commercial-dedicated-equipment-circuits
-- URL: /service-areas/pacific-palisades/commercial-dedicated-equipment-circuits

-- Service Offerings (12-15 items)
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (868, 'Dedicated HVAC system circuits', 1),
  (868, 'Data center power supply installation', 2),
  (868, 'Kitchen equipment circuit design', 3),
  (868, 'Generator-dedicated power circuits', 4),
  (868, 'Server room UPS circuits', 5),
  (868, 'Medical equipment power circuits', 6),
  (868, 'Industrial machinery circuits', 7),
  (868, 'Backup power system circuits', 8),
  (868, 'Three-phase power distribution', 9),
  (868, 'Equipment load calculations', 10),
  (868, 'Nameplate amperage analysis', 11),
  (868, 'Code compliance and permitting', 12),
  (868, 'Circuit protection specification', 13),
  (868, 'Voltage optimization circuits', 14),
  (868, 'Emergency lighting circuits', 15);

-- FAQs (4-5 items)
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (868, 'Why do commercial buildings in Pacific Palisades need dedicated equipment circuits?',
   'Dedicated circuits ensure that high-demand equipment-like HVAC systems, kitchen appliances, or data centers-receives consistent, uninterrupted power without competing with other building systems. This prevents voltage drops, electrical overloads, and equipment damage while ensuring code compliance. For Pacific Palisades'' upscale commercial spaces, dedicated circuits are essential for maintaining operational reliability and protecting valuable equipment investments.', 1),

  (868, 'How does Shaffer Construction determine what circuits a Pacific Palisades business needs?',
   'We analyze your equipment specifications, review equipment nameplates for amperage ratings, and perform detailed load calculations to determine exact circuit requirements. Our engineers assess your current electrical infrastructure, identify upgrades needed, and design a circuit layout that meets all code requirements. We handle everything from initial assessment through final inspection, ensuring your system is perfectly matched to your operational needs.', 2),

  (868, 'Can existing electrical circuits be converted to dedicated circuits in Pacific Palisades businesses?',
   'Yes, existing circuits can often be modified or replaced with dedicated circuits, though the complexity depends on your building''s current electrical configuration. We evaluate your panel capacity, existing wiring, and future growth needs to determine the most cost-effective approach. Our team manages all permits and inspections to ensure the conversion meets current electrical codes.', 3),

  (868, 'What is the timeline for installing dedicated equipment circuits in a Pacific Palisades commercial space?',
   'Installation timelines vary based on project complexity, equipment load, and whether panel upgrades are needed. Smaller projects may take a few days, while larger installations with multiple circuits can take 1-2 weeks. We coordinate with you to minimize business disruption and work efficiently to meet your operational schedule.', 4),

  (868, 'What is the difference between a standard circuit and a dedicated equipment circuit?',
   'A dedicated circuit serves only one piece of equipment or system, ensuring full power capacity is available whenever needed. Standard circuits share power between multiple devices, which can cause voltage drops and equipment stress during peak usage. For critical commercial equipment, dedicated circuits provide the stable, reliable power essential for optimal performance and longevity.', 5);

-- Related Services (5 items)
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (868, 'Commercial Electrical Panel Upgrades', '/service-areas/pacific-palisades/commercial-electrical-panel-upgrades', 1),
  (868, 'Commercial Three-Phase Power Systems', '/service-areas/pacific-palisades/commercial-three-phase-power-systems', 2),
  (868, 'Commercial Emergency Backup Generators', '/service-areas/pacific-palisades/commercial-emergency-backup-generators', 3),
  (868, 'Commercial Electrical Maintenance Plans', '/service-areas/pacific-palisades/commercial-electrical-maintenance-plans', 4),
  (868, 'Commercial Surge Protection Systems', '/service-areas/pacific-palisades/commercial-surge-protection-systems', 5);

-- Nearby Areas (5 items)
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (868, 'Santa Monica', '/service-areas/santa-monica', 1),
  (868, 'Venice', '/service-areas/venice', 2),
  (868, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (868, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (868, 'Culver City', '/service-areas/culver-city', 5);
