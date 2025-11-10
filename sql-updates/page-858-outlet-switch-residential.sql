-- Pacific Palisades Residential Outlet, Switch & Dimmer Services (Page 858)
-- Complete SEO-optimized content for service page

-- Service Offerings (14 items - ordered by common to specialized)
INSERT INTO service_offerings (service_page_id, offering, offering_order) VALUES
  (858, 'Standard outlet installation and replacement', 1),
  (858, 'Light switch installation and upgrades', 2),
  (858, 'Dimmer switch installation for lighting control', 3),
  (858, 'GFCI outlet installation for wet areas', 4),
  (858, 'USB outlet installation and charging stations', 5),
  (858, 'Smart dimmer and smart switch integration', 6),
  (858, 'Three-way and four-way switch installation', 7),
  (858, 'High-capacity outlet installation for appliances', 8),
  (858, 'Outdoor weatherproof outlet installation', 9),
  (858, 'Arc-fault circuit interrupter (AFCI) outlets', 10),
  (858, 'Motion-sensor and occupancy switch installation', 11),
  (858, 'Specialized outlet for EV charging readiness', 12),
  (858, 'Outlet repair and troubleshooting services', 13),
  (858, 'Panel troubleshooting for outlet issues', 14);

-- FAQs (5 items - Pacific Palisades specific)
INSERT INTO service_faqs (service_page_id, question, answer, faq_order) VALUES
  (858, 'What are the benefits of installing smart dimmers in my Pacific Palisades home?', 'Smart dimmers and switches give you precise control over lighting, enhance energy efficiency, and integrate seamlessly with home automation systems—perfect for Pacific Palisades''s luxury homes. They allow you to adjust lighting ambiance from your smartphone, create automated schedules, and reduce electricity consumption. Shaffer Construction installs smart-compatible outlets and switches that work with leading platforms while maintaining beautiful aesthetics in your home.', 1),

  (858, 'How many outlets should a modern Pacific Palisades home have, and when do I need upgrades?', 'Modern homes typically need more outlets than older properties—especially with increased device charging and smart home technology. Pacific Palisades homes often require additional outlets in kitchens, bathrooms, bedrooms, and outdoor spaces for contemporary living. If you''re experiencing overloaded power strips, frequently tripping breakers, or outlets that feel warm, it''s time for an upgrade. Our electricians assess your home''s needs and install proper-capacity outlets throughout.', 2),

  (858, 'Are GFCI outlets required in my Pacific Palisades home, and where do they need to be installed?', 'Yes, GFCI (ground fault circuit interrupter) outlets are required by California electrical code in bathrooms, kitchens, garages, and outdoor areas in Pacific Palisades homes. These outlets provide critical protection against electrical shock and are essential for safety, especially in wet environments. Shaffer Construction ensures your home meets all current code requirements with proper GFCI installation and testing.', 3),

  (858, 'Can I add USB outlets and modern charging stations throughout my Pacific Palisades home?', 'Absolutely! USB outlets and multi-device charging stations are increasingly popular in Pacific Palisades homes for convenience and cleaner aesthetics. We install them in kitchens, bedrooms, home offices, and living spaces so you can charge phones, tablets, and devices without adapters. Modern outlets with integrated USB ports eliminate cord clutter and provide a polished, contemporary look.', 4),

  (858, 'What makes motion-sensor and smart switches ideal for Pacific Palisades properties?', 'Motion-sensor switches and smart switches enhance convenience, security, and energy efficiency—three priorities for Pacific Palisades homeowners. Motion sensors automatically turn lights on and off in entryways, garages, and hallways, improving safety and reducing energy waste. Smart switches let you control lighting remotely, set schedules, and integrate with your home automation system. We design custom switch layouts for your specific property layout and lifestyle.', 5);

-- Related Services (5 items - logically related to outlets/switches/dimmers)
INSERT INTO service_related_services (service_page_id, service_name, service_url, display_order) VALUES
  (858, 'Residential Smart Automation Systems', '/service-areas/pacific-palisades/residential-smart-automation-systems', 1),
  (858, 'Residential Lighting Installation & Retrofitting', '/service-areas/pacific-palisades/residential-lighting-installation-retrofitting', 2),
  (858, 'Residential Electrical Panel Upgrades', '/service-areas/pacific-palisades/residential-electrical-panel-upgrades', 3),
  (858, 'Residential Electrical Troubleshooting & Repairs', '/service-areas/pacific-palisades/residential-electrical-troubleshooting-repairs', 4),
  (858, 'Residential Data Network & AV Wiring', '/service-areas/pacific-palisades/residential-data-network-av-wiring', 5);

-- Nearby Areas (5 items - standardized list)
INSERT INTO service_nearby_areas (service_page_id, area_name, area_url, display_order) VALUES
  (858, 'Santa Monica', '/service-areas/santa-monica', 1),
  (858, 'Venice', '/service-areas/venice', 2),
  (858, 'Beverly Hills', '/service-areas/beverly-hills', 3),
  (858, 'West Hollywood', '/service-areas/west-hollywood', 4),
  (858, 'Culver City', '/service-areas/culver-city', 5);
