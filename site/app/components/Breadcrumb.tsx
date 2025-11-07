import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex items-center flex-wrap gap-2 text-sm" style={{ color: "var(--secondary)" }}>
        {/* Home link */}
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: "var(--primary)" }}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" style={{ color: "var(--secondary)" }} />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: "var(--primary)" }}
                >
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: "var(--text)" }} className="font-medium">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* JSON-LD Structured Data for Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://banddude.github.io/shaffercon"
              },
              ...items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 2,
                "name": item.label,
                ...(item.href ? { "item": `https://banddude.github.io/shaffercon${item.href}` } : {})
              }))
            ]
          })
        }}
      />
    </nav>
  );
}
