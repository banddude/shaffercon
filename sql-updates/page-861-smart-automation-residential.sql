-- Pacific Palisades - Residential Smart Automation Systems (Page ID: 861)
-- Service: smart-automation-systems
-- Type: residential
-- URL: /service-areas/pacific-palisades/residential-smart-automation-systems

-- ============================================================================
-- SERVICE OFFERINGS (15 items)
-- ============================================================================
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (861, 'Whole-home lighting automation design and installation', 1),
  (861, 'Smart thermostat installation and configuration', 2),
  (861, 'Automated window blind and shade control', 3),
  (861, 'Smart security system integration and setup', 4),
  (861, 'Home entertainment system automation', 5),
  (861, 'Voice-controlled lighting and appliances', 6),
  (861, 'Smart pool and spa controls', 7),
  (861, 'Outdoor landscape and accent lighting automation', 8),
  (861, 'Automated garage door and gate controls', 9),
  (861, 'Smart leak detection and water management systems', 10),
  (861, 'Energy monitoring and smart power management', 11),
  (861, 'Multi-room audio system installation and integration', 12),
  (861, 'Home server and networking infrastructure setup', 13),
  (861, 'Security camera system integration', 14),
  (861, 'Scene programming and custom automation rules', 15);

-- ============================================================================
-- SERVICE FAQs (5 items)
-- ============================================================================
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (861,
    'What smart home features work best for my Pacific Palisades home?',
    'Every Pacific Palisades home is unique, and smart automation should reflect your lifestyle and property. Whether you''re interested in lighting control, climate management, security integration, or entertainment systems, Shaffer Construction can design a system tailored to your luxury home. We assess your existing infrastructure and create a customized solution that enhances convenience, energy efficiency, and security while maintaining your home''s aesthetic appeal.',
    1),
  (861,
    'Can smart automation systems integrate with my existing electrical setup?',
    'In most cases, yes. Many smart automation features integrate seamlessly into your current electrical system with minimal modifications. However, larger installations—like whole-home lighting control or pool automation—may benefit from dedicated circuits or electrical upgrades to ensure reliable, safe operation. Our team evaluates your home''s electrical capacity and recommends the best approach for your specific smart home needs.',
    2),
  (861,
    'How does smart home automation reduce energy costs in Pacific Palisades?',
    'Smart thermostats, intelligent lighting controls, and energy monitors optimize your home''s consumption patterns. Automated schedules, occupancy sensors, and remote access let you manage usage efficiently, even when you''re away from your Pacific Palisades property. This intelligent energy management typically lowers utility bills while maintaining the comfort and convenience your luxury home deserves.',
    3),
  (861,
    'What''s the installation process for smart home automation?',
    'Setup includes system design consultation, installation of smart devices and controls, electrical work or upgrades as needed, complete configuration and programming, and comprehensive user training. Shaffer Construction handles every step, ensuring all components communicate properly and operate according to your preferences. We also provide ongoing support so you can confidently control every aspect of your automated home.',
    4),
  (861,
    'Are smart home automation systems secure and reliable?',
    'Yes, when properly installed and configured by experienced professionals. Shaffer Construction sets up secure networks, uses reputable smart home devices with strong encryption, and ensures all systems meet current security standards. We guide you on best practices to protect your automation investment and maintain the security of your Pacific Palisades property.',
    5);

-- ============================================================================
-- RELATED SERVICES (5 items)
-- ============================================================================
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (861, 'Residential Electrical Panel Upgrades', '/service-areas/pacific-palisades/residential-electrical-panel-upgrades', 1),
  (861, 'Residential Whole Building Surge Protection', '/service-areas/pacific-palisades/residential-whole-building-surge-protection', 2),
  (861, 'Residential Home Wiring and Cable Installation', '/service-areas/pacific-palisades/residential-home-wiring-and-cable-installation', 3),
  (861, 'Residential Dedicated Equipment Circuits', '/service-areas/pacific-palisades/residential-dedicated-equipment-circuits', 4),
  (861, 'Residential EV Charger Installation', '/service-areas/pacific-palisades/residential-ev-charger-installation', 5);

-- ============================================================================
-- NEARBY AREAS (5 items - Standard across all Pacific Palisades pages)
-- ============================================================================
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (861, 'Santa Monica', '/service-areas/santa-monica', 1),
  (861, 'Venice', '/service-areas/venice', 2),
  (861, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (861, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (861, 'Culver City', '/service-areas/culver-city', 5);
