"use client";

import { classNames } from "@/app/styles/theme";

interface CTAButtonProps {
  phone: string;
}

export default function CTAButton({ phone }: CTAButtonProps) {
  return (
    <a
      href={`tel:${phone}`}
      className={`${classNames.buttonPrimary} whitespace-nowrap`}
      style={{
        background: "var(--background)",
        color: "var(--primary)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--background)";
        e.currentTarget.style.opacity = "0.9";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--background)";
        e.currentTarget.style.opacity = "1";
      }}
    >
      {phone}
    </a>
  );
}
