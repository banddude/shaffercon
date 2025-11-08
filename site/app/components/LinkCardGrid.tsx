"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

  const gapClass = "gap-6";

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClass} ${className} mt-8`}>
      {items.map(item => (
        <Link key={item.href} href={item.href} className="block h-full group">
          <div
            className="h-full rounded-lg p-3 transition-all duration-300 hover:translate-x-1 flex items-center justify-between"
            style={{
              background: "var(--background)",
              border: "1px solid var(--section-border)",
            }}
          >
            <h3
              className="text-base font-medium leading-snug"
              style={{ color: "var(--text)" }}
            >
              {item.label}
            </h3>
            <ArrowRight
              className="w-5 h-5 flex-shrink-0 ml-3 transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: "var(--primary)" }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
