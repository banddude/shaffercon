/**
 * Service Schema (JSON-LD) for service pages
 *
 * Provides structured data about the specific service offered,
 * helping search engines understand service details and pricing.
 */

interface ServiceSchemaProps {
  serviceName: string;
  description: string;
  areaServed: string;
  url: string;
  priceRange?: string;
}

export function ServiceSchema({
  serviceName,
  description,
  areaServed,
  url,
  priceRange = "$$",
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceName,
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": ["LocalBusiness", "Electrician", "GeneralContractor"],
      "@id": "https://shaffercon.com/#localbusiness",
      "name": "Shaffer Construction",
      "telephone": "+1-323-642-8509",
      "email": "hello@shaffercon.com",
      "url": "https://shaffercon.com",
      "priceRange": priceRange,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "325 N Larchmont Blvd #202",
        "addressLocality": "Los Angeles",
        "addressRegion": "CA",
        "postalCode": "90004",
        "addressCountry": "US"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": areaServed,
      "containedInPlace": {
        "@type": "State",
        "name": "California"
      }
    },
    "url": url
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
