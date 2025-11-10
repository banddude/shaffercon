/**
 * LocalBusiness Schema (JSON-LD) for location-specific pages
 *
 * Provides structured data about the business serving a specific area.
 * Critical for local SEO and "near me" searches.
 */

interface LocalBusinessSchemaProps {
  businessName?: string;
  areaServed: string; // City name like "Santa Monica"
  serviceUrl: string; // Current page URL
  services?: string[]; // List of services offered
  city?: string; // City name for address
  zipCode?: string; // Zip code
  latitude?: string; // Latitude coordinate
  longitude?: string; // Longitude coordinate
}

export function LocalBusinessSchema({
  businessName = "Shaffer Construction",
  areaServed,
  serviceUrl,
  services = ["EV Charger Installation", "Electrical Services", "LED Retrofit"],
  city,
  zipCode,
  latitude,
  longitude,
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Electrician",
    "name": `${businessName} - ${areaServed}`,
    "description": `Professional electrical contractor serving ${areaServed} and surrounding areas. Specializing in EV charging installation and comprehensive electrical services.`,
    "url": serviceUrl,
    "telephone": "323-642-8509",
    "email": "hello@shaffercon.com",
    "priceRange": "$$",
    "image": "https://shaffercon.com/og-image.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city || areaServed,
      "addressRegion": "CA",
      "postalCode": zipCode || "90012",
      "addressCountry": "US"
    },
    "geo": latitude && longitude ? {
      "@type": "GeoCoordinates",
      "latitude": latitude,
      "longitude": longitude
    } : undefined,
    "areaServed": [
      {
        "@type": "City",
        "name": areaServed
      },
      {
        "@type": "State",
        "name": "California"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `Electrical Services in ${areaServed}`,
      "itemListElement": services.map(service => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service,
          "areaServed": {
            "@type": "City",
            "name": areaServed
          }
        }
      }))
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "17:00"
      }
    ]
  };

  // Filter out undefined values from schema
  const cleanSchema = JSON.parse(JSON.stringify(schema, (key, value) =>
    value === undefined ? null : value
  ));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}
