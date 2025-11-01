"use client";

import React, { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
  className?: string;
}

export function PageTitle({ children, className = "" }: PageTitleProps) {
  return (
    <h1 className={`text-2xl md:text-3xl font-bold max-w-4xl leading-snug ${className}`}>
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
    <h2 className={`text-xl md:text-2xl font-bold mb-4 leading-snug ${className}`}>
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
    <h3 className={`text-lg md:text-xl font-semibold mb-3 ${className}`}>
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
    <p className={`text-base leading-relaxed mb-4 ${className}`}>
      {children}
    </p>
  );
}
