-- Fix missing SEO metadata for page 14220
-- Commercial Whole-Building Surge Protection - Pacific Palisades

UPDATE pages_all
SET
  meta_title = 'Surge Protection Pacific Palisades | Shaffer Construction',
  meta_description = 'Commercial whole-building surge protection in Pacific Palisades. Protect equipment & data from power surges. Licensed electricians. Call: (323) 642-8509',
  canonical_url = 'https://shaffercon.com/service-areas/pacific-palisades/commercial-whole-building-surge-protection',
  og_image = 'https://shaffercon.com/images/shaffer-construction-og.jpg',
  schema_json = '{"@context":"https://schema.org","@type":"Service","serviceType":"Commercial Whole-Building Surge Protection","provider":{"@type":"LocalBusiness","name":"Shaffer Construction, Inc.","telephone":"(323) 642-8509","email":"hello@shaffercon.com","address":{"@type":"PostalAddress","addressLocality":"Los Angeles","addressRegion":"CA","addressCountry":"US"}},"areaServed":{"@type":"City","name":"Pacific Palisades","containedInPlace":{"@type":"State","name":"California"}},"description":"Professional commercial whole-building surge protection services in Pacific Palisades to protect equipment, data, and electrical systems from power surges and lightning strikes."}'
WHERE id = 14220;
