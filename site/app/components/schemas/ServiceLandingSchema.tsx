interface ServiceLandingSchemaProps {
  name: string;
  description: string;
  url: string;
}

interface ServiceProfile {
  serviceType: string;
  category: string;
  audience: string[];
  offers: string[];
  areaServed: Array<{ "@type": string; name: string }>;
}

const defaultAreaServed = [
  { "@type": "City", name: "Los Angeles" },
  { "@type": "AdministrativeArea", name: "Los Angeles County" },
  { "@type": "State", name: "California" },
];

const serviceProfiles: Record<string, ServiceProfile> = {
  "commercial-electric-vehicle-chargers": {
    serviceType: "Commercial EV charger installation",
    category: "Commercial electrical contracting",
    audience: ["Property managers", "Fleet operators", "Multifamily owners", "Retail centers", "Workplace facilities"],
    offers: [
      "Commercial EV charging feasibility review",
      "Electrical load study coordination",
      "Level 2 charger installation",
      "DC fast charger infrastructure",
      "Permit and inspection support",
      "Utility coordination",
    ],
    areaServed: defaultAreaServed,
  },
  "commercial-service": {
    serviceType: "Commercial electrical service",
    category: "Commercial electrical contracting",
    audience: ["Commercial property owners", "Facility managers", "Tenant improvement teams", "Retail operators"],
    offers: [
      "Commercial electrical troubleshooting",
      "Panel and breaker service",
      "Tenant improvement electrical work",
      "Code correction repairs",
      "Lighting and controls",
      "Equipment circuit installation",
    ],
    areaServed: defaultAreaServed,
  },
  "electrical-load-studies": {
    serviceType: "Electrical load study",
    category: "Electrical engineering support",
    audience: ["Property owners", "EV charging developers", "Architects", "Engineers", "Permit applicants"],
    offers: [
      "Panel load studies",
      "EV charger capacity studies",
      "Service capacity review",
      "Permit documentation",
      "Utility coordination support",
      "Capacity recommendations",
    ],
    areaServed: defaultAreaServed,
  },
  "led-retrofit-services": {
    serviceType: "LED retrofit services",
    category: "Commercial lighting retrofit",
    audience: ["Facility managers", "Retail operators", "Warehouse operators", "Property managers"],
    offers: [
      "Lighting audits",
      "LED fixture replacement",
      "Exterior lighting upgrades",
      "Controls and sensors",
      "Utility rebate support",
      "Multi site rollout planning",
    ],
    areaServed: defaultAreaServed,
  },
  "residential-ev-charger": {
    serviceType: "Residential EV charger installation",
    category: "Residential electrical contracting",
    audience: ["Homeowners", "EV owners", "Condo owners", "Residential property managers"],
    offers: [
      "Level 2 home charger installation",
      "Panel capacity review",
      "Permit support",
      "Tesla Wall Connector installation",
      "Universal charger installation",
      "Dedicated EV circuit installation",
    ],
    areaServed: defaultAreaServed,
  },
  "venetian-plaster-los-angeles": {
    serviceType: "Venetian plaster and decorative wall finishes",
    category: "Decorative plaster and interior wall finishes",
    audience: ["Homeowners", "Interior designers", "General contractors", "Commercial property owners", "Hospitality operators"],
    offers: [
      "Venetian plaster",
      "Polished plaster",
      "Decorative feature walls",
      "Bathroom decorative finishes",
      "Fireplace and architectural plaster finishes",
      "Commercial decorative plaster",
    ],
    areaServed: defaultAreaServed,
  },
  "statewide-facilities-maintenance": {
    serviceType: "Facilities electrical maintenance",
    category: "Facilities maintenance",
    audience: ["Multi site operators", "Retail chains", "Warehouse operators", "Commercial property managers"],
    offers: [
      "Emergency electrical repairs",
      "Preventive maintenance",
      "Lighting maintenance",
      "Panel and breaker repairs",
      "Multi location electrical service",
      "California facility support",
    ],
    areaServed: [{ "@type": "State", name: "California" }],
  },
};

function profileForUrl(url: string): ServiceProfile {
  const slug = url
    .replace(/^https?:\/\/[^/]+\//, "")
    .replace(/\/$/, "");

  return serviceProfiles[slug] || {
    serviceType: "Electrical contracting service",
    category: "Electrical contracting",
    audience: ["Property owners", "Homeowners", "Facility managers"],
    offers: ["Electrical installation", "Electrical repairs", "Permits and inspection support"],
    areaServed: defaultAreaServed,
  };
}

export function ServiceLandingSchema({ name, description, url }: ServiceLandingSchemaProps) {
  const profile = profileForUrl(url);
  const serviceId = `${url.replace(/\/$/, "")}/#service`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://shaffercon.com/#organization",
        "name": "Shaffer Construction, Inc.",
        "legalName": "Shaffer Construction, Inc.",
        "url": "https://shaffercon.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://shaffercon.com/images/shaffer-logo-mini.png"
        },
        "description": "Licensed electrical contractor specializing in EV charger installation, panel upgrades, and electrical services in Los Angeles, CA.",
        "telephone": "+1-323-642-8509",
        "email": "hello@shaffercon.com"
      },
      {
        "@type": ["LocalBusiness", "Electrician", "GeneralContractor"],
        "@id": "https://shaffercon.com/#localbusiness",
        "name": "Shaffer Construction, Inc.",
        "url": "https://shaffercon.com",
        "image": "https://shaffercon.com/og-image.jpg",
        "description": "Licensed electrical and general contractor serving Los Angeles and California facilities.",
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
        "parentOrganization": {
          "@id": "https://shaffercon.com/#organization"
        },
        "areaServed": profile.areaServed
      },
      {
        "@type": "Service",
        "@id": serviceId,
        "name": name,
        "serviceType": name,
        "category": profile.category,
        "description": description,
        "provider": {
          "@id": "https://shaffercon.com/#localbusiness"
        },
        "areaServed": profile.areaServed,
        "audience": profile.audience.map((audience) => ({
          "@type": "Audience",
          "audienceType": audience,
        })),
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": `${profile.serviceType} services`,
          "itemListElement": profile.offers.map((offer, index) => ({
            "@type": "Offer",
            "position": index + 1,
            "availability": "https://schema.org/InStock",
            "itemOffered": {
              "@type": "Service",
              "name": offer,
              "provider": {
                "@id": "https://shaffercon.com/#localbusiness"
              }
            }
          }))
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        },
        "url": url,
        "telephone": "+1-323-642-8509"
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
