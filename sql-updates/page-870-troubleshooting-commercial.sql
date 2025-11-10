-- Pacific Palisades Commercial Electrical Troubleshooting & Repairs
-- Page ID: 870
-- Service: Electrical Troubleshooting & Repairs (Commercial)
-- URL: /service-areas/pacific-palisades/commercial-electrical-troubleshooting-repairs

-- ============================================================================
-- SERVICE OFFERINGS (15 items)
-- ============================================================================
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (870, 'Commercial circuit breaker diagnostics and repair', 1),
  (870, 'Power distribution system troubleshooting', 2),
  (870, 'Commercial lighting system failure diagnosis', 3),
  (870, 'Electrical panel inspection and testing', 4),
  (870, 'Three-phase power system balancing', 5),
  (870, 'Emergency power restoration services', 6),
  (870, 'Equipment grounding and bonding repairs', 7),
  (870, 'Commercial HVAC electrical troubleshooting', 8),
  (870, 'Building automation system electrical diagnostics', 9),
  (870, 'Surge protection for commercial equipment', 10),
  (870, 'Electrical code compliance corrections', 11),
  (870, 'Commercial refrigeration electrical repairs', 12),
  (870, 'Tenant electrical issue diagnosis and repair', 13),
  (870, 'Load analysis and circuit rebalancing', 14),
  (870, 'Fire alarm and emergency lighting restoration', 15);

-- ============================================================================
-- SERVICE FAQs (5 FAQs)
-- ============================================================================
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (
    870,
    'How quickly can your team respond to electrical emergencies in Pacific Palisades?',
    'We understand that electrical failures disrupt business operations, and that''s why we offer emergency response services for Pacific Palisades commercial properties. Our licensed electricians are available to handle urgent issues and can typically respond within hours of your call. Shaffer Construction brings the expertise and equipment needed to safely diagnose and repair complex commercial electrical systems while minimizing downtime to your business.',
    1
  ),
  (
    870,
    'What causes power failures and outages in Pacific Palisades commercial properties?',
    'Commercial power failures can result from overloaded circuits, aging equipment, faulty breakers, undersized panels, or damage to external utility connections. Pacific Palisades businesses—particularly restaurants, retail shops, and professional offices in the village—often operate multiple systems simultaneously, straining electrical infrastructure. Our diagnostic process identifies the root cause, whether it''s an equipment failure, code violation, or capacity issue, and we recommend solutions that restore reliable power.',
    2
  ),
  (
    870,
    'Can you troubleshoot and repair our electrical systems while we''re operating?',
    'Yes, we can perform many diagnostics and repairs during business hours with careful planning to minimize disruption. For more complex work like panel repairs or circuit replacements, we coordinate with your team to schedule service during closing hours or slower periods. Shaffer Construction prioritizes your business continuity and will discuss timing options to ensure the work is completed safely and efficiently without excessive downtime.',
    3
  ),
  (
    870,
    'What electrical code compliance standards apply to Pacific Palisades businesses?',
    'Pacific Palisades commercial properties must comply with California Electrical Code (CEC) and local Los Angeles building requirements. This includes proper grounding, bonding, surge protection, emergency lighting, and fire safety systems. Our electricians stay current with all applicable codes and ensure your commercial electrical system meets current standards. If your property has outdated or non-compliant systems, we can bring everything up to code safely.',
    4
  ),
  (
    870,
    'How can we prevent future electrical failures at our Pacific Palisades location?',
    'Regular maintenance and preventive inspections are key to avoiding costly electrical failures. We recommend annual electrical inspections, load balancing reviews, and equipment testing for Pacific Palisades commercial properties. Shaffer Construction can develop a customized maintenance plan that monitors your system''s health and catches potential problems before they cause downtime. This proactive approach saves money and keeps your business running smoothly.',
    5
  );

-- ============================================================================
-- RELATED SERVICES (5 services, Pacific Palisades)
-- ============================================================================
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (870, 'Commercial Electrical Panel Upgrades', '/service-areas/pacific-palisades/commercial-electrical-panel-upgrades', 1),
  (870, 'Commercial Electrical Safety Inspections', '/service-areas/pacific-palisades/commercial-electrical-safety-inspections', 2),
  (870, 'Commercial Backup Generator Installation', '/service-areas/pacific-palisades/commercial-backup-generator-installation', 3),
  (870, 'Commercial Whole Building Surge Protection', '/service-areas/pacific-palisades/commercial-whole-building-surge-protection', 4),
  (870, 'Commercial Lighting Installation and Retrofitting', '/service-areas/pacific-palisades/commercial-lighting-installation-retrofitting', 5);

-- ============================================================================
-- NEARBY AREAS (5 areas - standardized list)
-- ============================================================================
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (870, 'Santa Monica', '/service-areas/santa-monica', 1),
  (870, 'Venice', '/service-areas/venice', 2),
  (870, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (870, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (870, 'Culver City', '/service-areas/culver-city', 5);
