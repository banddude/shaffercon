/**
 * WebSite Schema (JSON-LD) for homepage
 * 
 * Enables Google sitelinks searchbox and defines site navigation.
 * Helps Google understand site structure and can show search box in SERPs.
 */

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Shaffer Construction, Inc.",
    "url": "https://shaffercon.com",
    "description": "Licensed electrical contractor specializing in EV charger installation, panel upgrades, and electrical services in Los Angeles, CA.",
    "publisher": {
      "@type": "Organization",
      "name": "Shaffer Construction, Inc.",
      "logo": {
        "@type": "ImageObject",
        "url": "https://shaffercon.com/images/logo.png"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://shaffercon.com/service-areas?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
