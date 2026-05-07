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
  latitude?: string; // Latitude coordinate for served area
  longitude?: string; // Longitude coordinate for served area
  utilityName?: string;
  permitOffice?: string;
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
  utilityName,
  permitOffice,
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Electrician", "GeneralContractor"],
    "@id": "https://shaffercon.com/#localbusiness",
    "name": businessName,
    "alternateName": `${businessName} serving ${areaServed}`,
    "description": `Professional electrical contractor serving ${areaServed} and surrounding areas. Specializing in EV charging installation and comprehensive electrical services.`,
    "url": serviceUrl,
    "telephone": "+1-323-642-8509",
    "email": "hello@shaffercon.com",
    "priceRange": "$$",
    "image": "https://shaffercon.com/og-image.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "325 N Larchmont Blvd #202",
      "addressLocality": "Los Angeles",
      "addressRegion": "CA",
      "postalCode": "90004",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "34.0736",
      "longitude": "-118.3215"
    },
    "areaServed": [
      {
        "@type": "Place",
        "name": areaServed,
        ...(city || zipCode || latitude || longitude ? {
          "address": {
            "@type": "PostalAddress",
            "addressLocality": city || areaServed,
            "addressRegion": "CA",
            ...(zipCode ? { "postalCode": zipCode } : {}),
            "addressCountry": "US"
          },
          ...(latitude && longitude ? {
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": latitude,
              "longitude": longitude
            }
          } : {})
        } : {})
      },
      {
        "@type": "State",
        "name": "California"
      }
    ],
    "knowsAbout": [
      "EV charger installation",
      "Electrical load studies",
      "Panel upgrades",
      "Commercial electrical service",
      "Residential electrical service",
      "Los Angeles electrical permits",
      ...(utilityName ? [`${utilityName} service planning`] : []),
      ...(permitOffice ? [`${permitOffice} permit coordination`] : [])
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
