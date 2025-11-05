"use client";

import { usePathname } from "next/navigation";

interface CTAButtonProps {
  phone: string;
}

export default function CTAButton({ phone }: CTAButtonProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <a
      href={`tel:${phone}`}
      className="px-4 py-2 font-medium whitespace-nowrap transition-colors"
      style={{
        color: "var(--primary)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "0.7";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
    >
      {phone}
    </a>
  );
}
