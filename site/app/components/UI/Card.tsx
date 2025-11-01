"use client";

import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: ReactNode;
  className?: string;
}

export function Card({ children, title, className = "" }: CardProps) {
  return (
    <div className={`border p-6 rounded ${className}`}>
      {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
      {children}
    </div>
  );
}
