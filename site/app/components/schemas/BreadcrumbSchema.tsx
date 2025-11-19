/**
 * Breadcrumb Schema (JSON-LD) for hierarchical navigation
 *
 * Provides structured data for search engines to understand site structure.
 * Helps with rich snippets showing breadcrumb trails in search results.
 */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const baseUrl = 'https://shaffercon.com';

  const itemListElements = items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.label,
    ...(item.href ? { "item": `${baseUrl}${item.href}` } : {})
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElements
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
