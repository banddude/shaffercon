"use client";

import React, { ReactNode } from "react";
import { theme } from "@/app/styles/theme";

interface CardProps {
  children: ReactNode;
  title?: ReactNode;
  className?: string;
}

export function Card({ children, title, className = "" }: CardProps) {
  return (
    <div
      className={`p-6 rounded ${className}`}
      style={{ border: `1px solid ${"var(--secondary)"}` }}
    >
      {title && (
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
