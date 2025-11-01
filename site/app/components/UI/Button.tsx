"use client";

import React, { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  href?: string;
  asLink?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  href,
  asLink = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = "px-6 py-3 font-semibold rounded transition-all";

  const variantClasses = {
    primary: "border-2 border-current underline hover:no-underline",
    secondary: "border border-current underline hover:no-underline",
    tertiary: "underline hover:no-underline",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (asLink && href) {
    return (
      <a href={href} className={combinedClasses}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
