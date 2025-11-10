-- Pacific Palisades Residential Backup Generator Installation
-- Page ID: 846
-- Service: backup-generator-installation (residential)
-- URL: /service-areas/pacific-palisades/residential-backup-generator-installation

-- Service Offerings (13 items)
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (846, 'Whole-home backup generator installation', 1),
  (846, 'Automatic transfer switch setup and integration', 2),
  (846, 'Emergency power system design and sizing', 3),
  (846, 'Fuel system integration (natural gas, propane, diesel)', 4),
  (846, 'Load calculation and power assessment', 5),
  (846, 'Permit acquisition and code compliance management', 6),
  (846, 'Smart generator monitoring and controls', 7),
  (846, 'Generator maintenance and service plans', 8),
  (846, 'Quiet and fuel-efficient generator options', 9),
  (846, 'Backup power installation for fire recovery', 10),
  (846, 'Seamless switchover for automatic operation', 11),
  (846, 'Generator removal and replacement services', 12),
  (846, '24/7 emergency support and dispatch', 13);

-- FAQs (5 items - all mention Pacific Palisades)
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (846, 'How long does a residential backup generator installation typically take in Pacific Palisades?',
   'Residential backup generator installations in Pacific Palisades typically take one to three days, depending on your home''s size, power requirements, and existing electrical infrastructure. Our licensed electricians handle everything from site assessment to transfer switch installation and final inspections. We work efficiently to minimize disruption while ensuring your system is safe, code-compliant, and ready for reliable backup power when you need it most.',
   1),

  (846, 'Can I get a free, no-obligation estimate for backup generator installation at my Pacific Palisades home?',
   'Absolutely! Shaffer Construction offers complimentary estimates for residential backup generator installation throughout Pacific Palisades. Simply call or text us at 323-642-8509 or email hello@shaffercon.com. We''ll assess your home''s specific power needs, discuss fuel options and generator types, and provide a detailed quote with complete transparency and zero pressure to proceed.',
   2),

  (846, 'Does Shaffer Construction handle permits and inspections for backup generators in Pacific Palisades?',
   'Yes, we manage all permitting and inspections for backup generator installations in Pacific Palisades. Shaffer Construction holds A, B, and C-10 licenses and maintains comprehensive insurance coverage. Our team ensures your installation fully complies with Los Angeles and local Pacific Palisades electrical codes and safety standards. We handle the paperwork and coordinate with city inspectors so you can focus on your home.',
   3),

  (846, 'How can a backup generator protect my Pacific Palisades home during power outages and fire recovery?',
   'A professionally installed backup generator keeps essential systems running during outages—from refrigeration and medical equipment to security systems and communication devices. For Pacific Palisades residents dealing with fire recovery, a generator ensures your home remains powered during outages while reconstruction occurs. Our systems offer seamless automatic operation, remote monitoring capabilities, and dependable performance when reliability matters most.',
   4),

  (846, 'What fuel options work best for a backup generator in Pacific Palisades?',
   'For Pacific Palisades homes, natural gas and propane are the most popular options. Natural gas provides unlimited fuel supply via your existing utility line, while propane offers portability and works without a utility connection—ideal if you''re considering evacuation during fire season. Diesel generators are also available for specific applications. During your estimate, we''ll discuss fuel availability, storage needs, and maintenance requirements to recommend the best solution for your home and lifestyle.',
   5);

-- Related Services (5 Pacific Palisades residential services)
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (846, 'Residential Electrical Panel Upgrades', '/service-areas/pacific-palisades/residential-electrical-panel-upgrades', 1),
  (846, 'Residential Whole Building Surge Protection', '/service-areas/pacific-palisades/residential-whole-building-surge-protection', 2),
  (846, 'Residential Electrical Safety Inspections', '/service-areas/pacific-palisades/residential-electrical-safety-inspections', 3),
  (846, 'Residential Smart Automation Systems', '/service-areas/pacific-palisades/residential-smart-automation-systems', 4),
  (846, 'Residential Energy Efficiency Upgrades', '/service-areas/pacific-palisades/residential-energy-efficiency-upgrades', 5);

-- Nearby Areas (standardized order: Santa Monica, Venice, Beverly Hills, West Hollywood, Culver City)
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (846, 'Santa Monica', '/service-areas/santa-monica', 1),
  (846, 'Venice', '/service-areas/venice', 2),
  (846, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (846, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (846, 'Culver City', '/service-areas/culver-city', 5);
