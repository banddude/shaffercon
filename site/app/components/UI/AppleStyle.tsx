"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { theme, typographySizes } from "@/app/styles/theme";
import { ASSET_PATH } from "@/app/config";

/**
 * Apple-style Hero Section
 * Large typography, minimal design, focus on content
 */
interface AppleHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  children?: ReactNode;
  showLogo?: boolean;
}

export function AppleHero({
  title,
  subtitle,
  image,
  imageAlt,
  imageFit = "cover",
  children,
  showLogo = false,
}: AppleHeroProps) {
  const isVideo = image?.endsWith('.mp4') || image?.endsWith('.webm');
  const isGif = image?.endsWith('.gif');

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--background)",
      }}
    >
      {/* Background Video, GIF, or Image */}
      {image && (
        <div className="absolute inset-0 z-0">
          {isVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              aria-label={imageAlt || title}
              style={{
                objectFit: imageFit,
                filter: "brightness(0.7)",
              }}
            >
              <source src={image} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
              Your browser does not support the video tag.
            </video>
          ) : isGif ? (
            <img
              src={image}
              alt={imageAlt || title}
              className="w-full h-full object-cover"
              style={{
                objectFit: imageFit,
                filter: "brightness(0.7)",
              }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: imageFit,
                backgroundPosition: "center",
                filter: "brightness(0.95)",
              }}
            />
          )}
        </div>
      )}

      {/* Overlay for text contrast */}
      {image && (
        <div
          className="absolute inset-0 z-1"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />
      )}


      {/* Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-evenly px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo above title (only shows when showLogo is true) */}
          {image && showLogo && (
            <div
              style={{
                animation: "fadeInUp 0.8s ease-out",
              }}
            >
              <img
                src={ASSET_PATH("/brand-assets/Shaffer-Construction-Logo-light-mode-cropped.png")}
                alt="Shaffer Construction"
                className="mx-auto"
                style={{
                  width: "500px",
                  height: "auto",
                  filter: "drop-shadow(0 0 0.5px rgba(2, 132, 199, 0.2)) drop-shadow(0 0 0.5px rgba(2, 132, 199, 0.2))",
                }}
              />
            </div>
          )}

          {/* Main Title */}
          <h1
            className={`${typographySizes.pageTitle} font-black tracking-tight leading-tight`}
            style={{
              color: image ? "#ffffff" : "var(--text)",
              animation: "fadeInUp 0.8s ease-out 0.1s both",
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              className={`${typographySizes.paragraph} max-w-3xl font-light leading-relaxed`}
              style={{
                color: image ? "#d1d5db" : "var(--secondary)",
                animation: "fadeInUp 0.8s ease-out 0.1s both",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Additional Content */}
        {children && (
          <div
            style={{
              animation: "fadeInUp 0.8s ease-out 0.2s both",
            }}
          >
            {children}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

/**
 * Apple-style Feature Card
 * Minimal, clean design with hover effects
 */
interface AppleCardProps {
  title: string;
  description: string;
  image?: string;
  icon?: ReactNode;
  href?: string;
  cta?: string;
}

export function AppleCard({
  title,
  description,
  image,
  icon,
  href,
  cta = "Learn more",
}: AppleCardProps) {
  const content = (
    <div
      className="group w-full h-full flex flex-col overflow-hidden"
      style={{
        background: "var(--background)",
        border: "1px solid var(--secondary)",
        borderRadius: "1.5rem",
        padding: "1.5rem",
        backdropFilter: "blur(10px)",
        transition: "border 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.border = "1px solid var(--secondary)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.border = "1px solid var(--secondary)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Image */}
      {image && (
        <div
          className="relative h-64 overflow-hidden"
          style={{
            background: "var(--background)",
          }}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}

      {/* Icon only if no image */}
      {icon && !image && (
        <div
          className={`h-20 flex items-center justify-center ${typographySizes.subheading} group-hover:scale-110 transition-transform duration-500`}
          style={{
            background: "var(--background)",
          }}
        >
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-grow pt-4 flex flex-col">
        <h3
          className={`${typographySizes.subheading} font-semibold mb-2 transition-colors duration-300`}
          style={{ color: "var(--text)" }}
        >
          {title}
        </h3>
        <p
          className={`${typographySizes.paragraph} leading-relaxed flex-grow mb-4`}
          style={{ color: "var(--secondary)" }}
        >
          {description}
        </p>

        {/* CTA Link */}
        {href && (
          <Link
            href={href}
            className="inline-flex items-center font-semibold group/link transition-colors duration-300"
            style={{ color: "var(--primary)" }}
          >
            {cta}
            <svg
              className="ml-2 w-5 h-5 group-hover/link:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );

  return content;
}

/**
 * Apple-style Grid Layout
 * Responsive grid with proper spacing
 */
interface AppleGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

export function AppleGrid({
  children,
  columns = 3,
  gap = "lg",
}: AppleGridProps) {
  const columnMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-4",
  };

  const gapMap = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <div className={`grid ${columnMap[columns]} ${gapMap[gap]} w-full`}>
      {children}
    </div>
  );
}

/**
 * Apple-style Section Container
 * Large padding, centered, clean
 */
interface AppleSectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  padding?: "sm" | "md" | "lg" | "xl";
}

export function AppleSection({
  children,
  title,
  subtitle,
  padding = "lg",
}: AppleSectionProps) {
  const paddingMap = {
    sm: "py-6 sm:py-8 lg:py-12",
    md: "py-8 sm:py-12 lg:py-16",
    lg: "py-12 sm:py-20 lg:py-28",
    xl: "py-16 sm:py-24 lg:py-32",
  };

  return (
    <section
      className={`w-full ${paddingMap[padding]}`}
      style={{
        background: "var(--background)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        {title && (
          <div className="text-center mb-16">
            <h2
              className={`${typographySizes.sectionHeading} font-black tracking-tight mb-4`}
              style={{ color: "var(--text)" }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className={`${typographySizes.paragraph} leading-relaxed max-w-3xl mx-auto`}
                style={{
                  color: "var(--secondary)",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </section>
  );
}

/**
 * Apple-style CTA Button
 * Clean, modern, with hover effects
 */
interface AppleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AppleButton({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  className = "",
}: AppleButtonProps) {
  const sizeMap = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const getVariantStyles = () => {
    const primary = {
      background: "var(--primary)",
      color: "var(--text)",
      border: "2px solid var(--background)",
      shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    };
    const secondary = {
      background: "var(--background)",
      color: "var(--text)",
      border: "2px solid var(--primary)",
      shadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    };
    const outline = {
      background: "transparent",
      color: "var(--primary)",
      border: "2px solid var(--primary)",
      shadow: "none",
    };

    const variantMap = {
      primary,
      secondary,
      outline,
    };

    return variantMap[variant];
  };

  const variantStyle = getVariantStyles();
  const baseClasses = `inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 ${sizeMap[size]} ${className}`;

  const getStyles = () => {
    const baseStyle: any = {
      background: variantStyle.background,
      color: variantStyle.color,
      border: variantStyle.border,
      boxShadow: variantStyle.shadow,
      transitionDuration: "0.3s",
    };

    return baseStyle;
  };

  if (href) {
    return (
      <Link href={href} className={baseClasses} style={getStyles()}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses} style={getStyles()}>
      {children}
    </button>
  );
}

/**
 * Apple-style Feature Row
 * Image on side with text, alternating layout
 */
interface AppleFeatureRowProps {
  title: string;
  description: string;
  image?: string;
  imagePosition?: "left" | "right";
  children?: ReactNode;
}

export function AppleFeatureRow({
  title,
  description,
  image,
  imagePosition = "left",
  children,
}: AppleFeatureRowProps) {
  const content = (
    <>
      <div className="flex-1 pr-12">
        <h3
          className={`${typographySizes.subheading} font-black mb-6 tracking-tight`}
          style={{ color: "var(--text)" }}
        >
          {title}
        </h3>
        <p
          className={`${typographySizes.paragraph} leading-relaxed mb-8`}
          style={{ color: "var(--secondary)" }}
        >
          {description}
        </p>
        {children}
      </div>

      {image && (
        <div className="flex-1">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <img
              src={image}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      )}
    </>
  );

  return (
    <div
      className={`flex items-center gap-12 py-20 ${
        imagePosition === "right" ? "flex-row-reverse" : ""
      }`}
    >
      {content}
    </div>
  );
}
