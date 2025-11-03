"use client";

import React, { ReactNode } from "react";
import { typographySizes } from "@/app/styles/theme";

interface PageTitleProps {
  children: ReactNode;
  className?: string;
}

export function PageTitle({ children, className = "" }: PageTitleProps) {
  return (
    <h1
      className={`${typographySizes.pageTitle} font-black tracking-tight leading-tight max-w-4xl mb-6 ${className}`}
      style={{ color: "var(--text)" }}
    >
      {children}
    </h1>
  );
}

interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
}

export function SectionHeading({ children, className = "" }: SectionHeadingProps) {
  return (
    <h2
      className={`${typographySizes.sectionHeading} font-black tracking-tight leading-tight mb-8 ${className}`}
      style={{ color: "var(--text)" }}
    >
      {children}
    </h2>
  );
}

interface SubheadingProps {
  children: ReactNode;
  className?: string;
}

export function Subheading({ children, className = "" }: SubheadingProps) {
  return (
    <h3
      className={`${typographySizes.subheading} font-semibold mb-4 leading-snug ${className}`}
      style={{ color: "var(--text)" }}
    >
      {children}
    </h3>
  );
}

interface ParagraphProps {
  children: ReactNode;
  className?: string;
}

export function Paragraph({ children, className = "" }: ParagraphProps) {
  return (
    <p
      className={`${typographySizes.paragraph} leading-relaxed mb-6 ${className}`}
      style={{ color: "var(--secondary)" }}
    >
      {children}
    </p>
  );
}
