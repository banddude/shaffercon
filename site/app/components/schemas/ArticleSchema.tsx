/**
 * Article Schema (JSON-LD) for blog posts
 *
 * Provides structured data for search engines to understand blog content.
 * Helps with rich snippets and better indexing.
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
  authorName = "Shaffer Construction",
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
      "@type": "Organization",
      "name": authorName,
      "url": "https://banddude.github.io/shaffercon"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Shaffer Construction",
      "url": "https://banddude.github.io/shaffercon",
      "logo": {
        "@type": "ImageObject",
        "url": "https://banddude.github.io/shaffercon/og-image.jpg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    ...(image ? { "image": image } : {})
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
