"use client";

import Link from "next/link";

export interface LinkCardItem {
  label: string;
  href: string;
}

interface LinkCardGridProps {
  items: LinkCardItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export default function LinkCardGrid({
  items,
  columns = 3,
  className = "",
}: LinkCardGridProps) {
  const columnClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const gapClass = "gap-12";

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClass} ${className}`}>
      {items.map(item => (
        <Link key={item.href} href={item.href} className="block h-full">
          <div
            className="h-full rounded-lg px-6 py-5 transition-transform duration-300 hover:-translate-y-0.5"
            style={{
              border: "1px solid var(--secondary)",
            }}
          >
            <h3
              className="text-lg font-semibold leading-snug"
              style={{ color: "var(--text)" }}
            >
              {item.label}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
