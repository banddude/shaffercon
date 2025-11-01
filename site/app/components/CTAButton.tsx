"use client";

import { classNames, theme } from "@/app/styles/theme";

interface CTAButtonProps {
  phone: string;
}

export default function CTAButton({ phone }: CTAButtonProps) {
  return (
    <a
      href={`tel:${phone}`}
      className={classNames.buttonPrimary}
      style={{
        background: 'white',
        color: theme.colors.primary.main,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = theme.colors.neutral[100];
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'white';
      }}
    >
      Call Now: {phone}
    </a>
  );
}
