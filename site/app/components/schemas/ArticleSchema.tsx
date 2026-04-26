/**
 * Article Schema (JSON-LD) for blog posts
 *
 * Provides structured data for search engines to understand blog content.
 * Helps with rich snippets, AI overviews, and Google Discover eligibility.
 *
 * Author is modeled as a Person (Mike Shaffer, owner) with E-E-A-T signals
 *: credentials, employer, and a link to the about page where Google
 * (and humans) can verify expertise. Publisher is the Organization.
 */

interface ArticleSchemaProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
  url: string;
}

export function ArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  authorName = "Mike Shaffer",
  image,
  url,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": "https://shaffercon.com/about-us/",
      "jobTitle": "Owner & Licensed Contractor",
      "worksFor": {
        "@type": "Organization",
        "name": "Shaffer Construction, Inc.",
        "url": "https://shaffercon.com",
      },
      "knowsAbout": [
        "Electrical Contracting",
        "EV Charger Installation",
        "Electrical Code Compliance",
        "Commercial Electrical Systems",
        "Residential Electrical Work",
        "Fire Damage Rebuild",
        "Electrical Load Studies",
        "LED Lighting Retrofits",
      ],
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "license",
          "name": "California Contractors State License Board (CSLB) License #994593: A (General Engineering), B (General Building), C-10 (Electrical)",
          "recognizedBy": {
            "@type": "GovernmentOrganization",
            "name": "California Contractors State License Board",
            "url": "https://www.cslb.ca.gov/",
          },
        },
      ],
    },
    "publisher": {
      "@type": "Organization",
      "name": "Shaffer Construction, Inc.",
      "url": "https://shaffercon.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://shaffercon.com/shaffercon-logo.png",
        "width": 512,
        "height": 512,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
    ...(image ? { "image": image } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
