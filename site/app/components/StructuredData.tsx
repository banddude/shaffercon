'use client';

interface LocalBusinessSchemaProps {
  name?: string;
  description?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
  };
  telephone?: string;
  priceRange?: string;
}

export function LocalBusinessSchema({
  name = "Shaffer Construction",
  description = "Los Angeles electrical contractor specializing in EV charging installation and comprehensive electrical services",
  address,
  telephone = "323-642-8509",
  priceRange = "$$",
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Electrician",
    "@id": "https://banddude.github.io/shaffercon",
    name,
    description,
    url: "https://banddude.github.io/shaffercon",
    telephone,
    priceRange,
    image: "https://banddude.github.io/shaffercon/og-image.jpg",
    ...(address && {
      address: {
        "@type": "PostalAddress",
        ...address,
      },
    }),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "150",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Los Angeles",
      },
      {
        "@type": "City",
        name: "Culver City",
      },
      {
        "@type": "City",
        name: "Santa Monica",
      },
      {
        "@type": "City",
        name: "Beverly Hills",
      },
      {
        "@type": "City",
        name: "West Hollywood",
      },
      {
        "@type": "State",
        name: "California",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Electrical Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "EV Charger Installation",
            description: "Professional electric vehicle charging station installation for residential and commercial properties",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "LED Retrofit",
            description: "Energy-efficient LED lighting upgrades and retrofits",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Electrical Panel Upgrades",
            description: "Electrical panel upgrades and service enhancements",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceSchema({
  serviceName,
  serviceType,
  description,
  location,
}: {
  serviceName: string;
  serviceType: string;
  description: string;
  location: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `${serviceType} ${serviceName}`,
    provider: {
      "@type": "Electrician",
      name: "Shaffer Construction",
      telephone: "323-642-8509",
      url: "https://banddude.github.io/shaffercon",
    },
    areaServed: {
      "@type": "City",
      name: location,
    },
    description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://banddude.github.io/shaffercon${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
