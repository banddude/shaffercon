interface ServiceLandingSchemaProps {
  name: string;
  description: string;
  url: string;
}

export function ServiceLandingSchema({ name, description, url }: ServiceLandingSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://shaffercon.com/#organization",
        "name": "Shaffer Construction, Inc.",
        "url": "https://shaffercon.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://shaffercon.com/images/logo.png"
        },
        "image": "https://shaffercon.com/images/logo.png",
        "description": "Licensed electrical contractor specializing in EV charger installation, panel upgrades, and electrical services in Los Angeles, CA.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "325 N Larchmont Blvd. #202",
          "addressLocality": "Los Angeles",
          "addressRegion": "CA",
          "postalCode": "90004",
          "addressCountry": "US"
        },
        "telephone": "+1-323-642-8509",
        "email": "hello@shaffercon.com",
        "priceRange": "$$",
        "areaServed": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": "34.0522",
            "longitude": "-118.2437"
          },
          "geoRadius": "50000"
        }
      },
      {
        "@type": "Service",
        "serviceType": name,
        "description": description,
        "provider": {
          "@id": "https://shaffercon.com/#organization"
        },
        "areaServed": {
          "@type": "State",
          "name": "California"
        },
        "url": url
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
