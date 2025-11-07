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
      "@type": "Electrician",
      "name": "Shaffer Construction",
      "telephone": "323-642-8509",
      "url": "https://banddude.github.io/shaffercon",
      "priceRange": priceRange,
      "areaServed": {
        "@type": "City",
        "name": areaServed
      }
    },
    "areaServed": {
      "@type": "City",
      "name": areaServed
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
