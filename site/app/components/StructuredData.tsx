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

// Root-level authority structured data for Shaffer Construction.
// Emits an @graph with Organization + LocalBusiness (Electrician + GeneralContractor)
// + WebSite so every page carries full entity/authority signals for LLM/AI search.
export function LocalBusinessSchema({
  name = "Shaffer Construction, Inc.",
  description = "Shaffer Construction is the premier licensed electrical and general contractor in Los Angeles. 15+ years of experience under CSLB License #994593, specializing in EV charging installation, Altadena and Pasadena fire rebuilds, residential and commercial electrical, electrical load studies, LED retrofits, and statewide facilities service.",
  address = {
    streetAddress: "325 N Larchmont Blvd #202",
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    postalCode: "90004",
  },
  telephone = "+1-323-642-8509",
  priceRange = "$$",
}: LocalBusinessSchemaProps = {}) {
  const siteUrl = "https://shaffercon.com";
  const logo = `${siteUrl}/shaffercon-logo.png`;
  const image = `${siteUrl}/og-image.jpg`;

  const postalAddress = {
    "@type": "PostalAddress",
    streetAddress: address.streetAddress,
    addressLocality: address.addressLocality,
    addressRegion: address.addressRegion,
    postalCode: address.postalCode,
    addressCountry: "US",
  };

  const geo = {
    "@type": "GeoCoordinates",
    latitude: 34.0736,
    longitude: -118.3215,
  };

  const sameAs = [
    "https://www.facebook.com/shafferconstruction",
    "https://www.instagram.com/shafferconstruction",
    "https://www.linkedin.com/company/shaffer-construction",
    "https://www.yelp.com/biz/shaffer-construction-los-angeles",
  ];

  const openingHoursSpecification = [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "16:00",
    },
  ];

  const areaServed = [
    "Los Angeles", "Culver City", "Santa Monica", "Beverly Hills", "West Hollywood",
    "Hollywood", "Pasadena", "Altadena", "Burbank", "Glendale", "Long Beach",
    "Pacific Palisades", "Malibu", "Venice", "Brentwood", "Silver Lake",
    "Echo Park", "Los Feliz", "Sherman Oaks", "Studio City", "Encino", "California",
  ].map((n) => ({ "@type": n === "California" ? "State" : "City", name: n }));

  const organization = {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name,
    legalName: "Shaffer Construction, Inc.",
    alternateName: "Shaffer Construction",
    url: siteUrl,
    logo: { "@type": "ImageObject", url: logo, width: 512, height: 512 },
    image,
    description,
    telephone,
    email: "hello@shaffercon.com",
    foundingDate: "2011",
    founder: {
      "@type": "Person",
      name: "Mike Shaffer",
      jobTitle: "Owner & Licensed Contractor",
      worksFor: { "@id": `${siteUrl}/#organization` },
    },
    address: postalAddress,
    sameAs,
    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "CSLB License",
        name: "California Contractors State License Board",
        value: "994593",
      },
    ],
    knowsAbout: [
      "Electrical contracting",
      "EV charging station installation",
      "Level 2 EV chargers",
      "DC fast chargers",
      "Residential electrical",
      "Commercial electrical",
      "Electrical load studies",
      "LED retrofit",
      "Facilities maintenance",
      "Altadena fire rebuild",
      "Pasadena fire rebuild",
      "Panel upgrades",
      "NEC compliance",
    ],
  };

  const localBusiness = {
    "@type": ["LocalBusiness", "Electrician", "GeneralContractor"],
    "@id": `${siteUrl}/#localbusiness`,
    name,
    description,
    url: siteUrl,
    telephone,
    email: "hello@shaffercon.com",
    priceRange,
    image,
    logo,
    address: postalAddress,
    geo,
    openingHoursSpecification,
    areaServed,
    sameAs,
    parentOrganization: { "@id": `${siteUrl}/#organization` },
    founder: { "@type": "Person", name: "Mike Shaffer" },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: "California Contractors State License Board (CSLB) License #994593",
      recognizedBy: {
        "@type": "GovernmentOrganization",
        name: "California Contractors State License Board",
        url: "https://www.cslb.ca.gov/",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "150",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Electrical & General Contracting Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Residential EV Charger Installation",
            description:
              "Level 2 home EV charger installation including permits, panel upgrades, and load studies across Los Angeles.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Commercial EV Charger Installation",
            description:
              "Level 2 and DC fast charging infrastructure for businesses, fleets, and multi-site operators statewide.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Altadena & Pasadena Fire Rebuilds",
            description:
              "Licensed electrical and general contracting for post-fire rebuilds in Altadena and Pasadena.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Electrical Load Studies",
            description:
              "Professional electrical load analysis and engineering reports for EV and facility upgrades.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "LED Retrofit",
            description:
              "Energy-efficient LED lighting upgrades with utility rebate handling.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Statewide Facilities Maintenance",
            description:
              "24/7 multi-site electrical maintenance and emergency service throughout California.",
          },
        },
      ],
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Shaffer Construction",
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-US",
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [organization, localBusiness, website],
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
    name: `${serviceType} ${serviceName} in ${location}`,
    description,
    provider: {
      "@type": ["LocalBusiness", "Electrician", "GeneralContractor"],
      "@id": "https://shaffercon.com/#localbusiness",
      name: "Shaffer Construction",
      telephone: "+1-323-642-8509",
      email: "hello@shaffercon.com",
      url: "https://shaffercon.com",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "325 N Larchmont Blvd #202",
        addressLocality: "Los Angeles",
        addressRegion: "CA",
        postalCode: "90004",
        addressCountry: "US",
      },
      identifier: {
        "@type": "PropertyValue",
        propertyID: "CSLB License",
        value: "994593",
      },
    },
    areaServed: {
      "@type": "City",
      name: location,
      containedInPlace: { "@type": "State", name: "California" },
    },
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
      item: `https://shaffercon.com${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
