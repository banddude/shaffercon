"use client";

import React, { ReactNode } from "react";

interface ContentBoxProps {
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
  border?: boolean;
  className?: string;
}

export function ContentBox({
  children,
  padding = "md",
  border = false,
  className = "",
}: ContentBoxProps) {
  const paddingClasses = {
    sm: "p-6",
    md: "p-10",
    lg: "p-16",
  };

  const borderClass = border ? "border rounded-lg" : "";

  return (
    <div className={`${paddingClasses[padding]} ${borderClass} ${className}`}>
      {children}
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
  border?: "top" | "bottom" | "both" | "none";
  className?: string;
}

export function Section({
  children,
  padding = "md",
  border = "none",
  className = "",
}: SectionProps) {
  const paddingClasses = {
    sm: "py-6",
    md: "py-12",
    lg: "py-16",
  };

  const borderClasses = {
    top: "border-t",
    bottom: "border-b",
    both: "border-t border-b",
    none: "",
  };

  return (
    <section className={`${paddingClasses[padding]} ${borderClasses[border]} ${className}`}>
      <div className="container mx-auto px-6">
        {children}
      </div>
    </section>
  );
}

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "none";
}

export function Container({
  children,
  className = "",
  maxWidth = "lg",
}: ContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-3xl",
    lg: "max-w-4xl",
    xl: "max-w-5xl",
    none: "",
  };

  return (
    <div className={`mx-auto ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
}

interface GridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function Grid({
  children,
  columns = 2,
  gap = "md",
  className = "",
}: GridProps) {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const gapClasses = {
    sm: "gap-6",
    md: "gap-8",
    lg: "gap-12",
  };

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

interface GridItemProps {
  children: ReactNode;
  className?: string;
}

export function GridItem({ children, className = "" }: GridItemProps) {
  return <div className={className}>{children}</div>;
}
