"use client";

import React, { ReactNode } from "react";

interface ListProps {
  items: string[];
  ordered?: boolean;
  className?: string;
}

export function List({ items, ordered = false, className = "" }: ListProps) {
  const Component = ordered ? "ol" : "ul";

  return (
    <Component className={`space-y-2 mb-4 ${className}`}>
      {items.map((item, index) => (
        <li key={index} className="ml-6">
          {item}
        </li>
      ))}
    </Component>
  );
}

interface DividerProps {
  className?: string;
}

export function Divider({ className = "" }: DividerProps) {
  return <hr className={`my-6 ${className}`} />;
}

interface SpacerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spacer({ size = "md", className = "" }: SpacerProps) {
  const sizeClasses = {
    sm: "h-4",
    md: "h-8",
    lg: "h-12",
  };

  return <div className={`${sizeClasses[size]} ${className}`} />;
}

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-block px-3 py-1 text-sm font-semibold border rounded ${className}`}>
      {children}
    </span>
  );
}
