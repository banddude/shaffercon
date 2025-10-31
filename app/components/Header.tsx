"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import menuData from "@/data/menu-structure.json";
import siteConfig from "@/data/site-config.json";
import { classNames, theme } from "@/app/styles/theme";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: theme.components.header.background,
        borderBottom: theme.components.header.borderBottom,
      }}
    >
      <div className={classNames.container}>
        <div className="flex justify-between items-center" style={{ height: theme.components.header.height }}>
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={siteConfig.logoUrl}
              alt="Shaffer Construction"
              width={120}
              height={50}
              className="h-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuData.primaryMenu.map((item) => (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className="px-3 py-2 font-medium flex items-center transition-colors"
                  style={{ color: theme.colors.text.primary }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary.main)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.text.primary)}
                >
                  {item.label}
                  {item.children && (
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.children && (
                  <div
                    className="absolute left-0 mt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 rounded-md"
                    style={{
                      background: theme.colors.background.light,
                      border: `1px solid ${theme.colors.border}`,
                      boxShadow: theme.shadows.xl,
                    }}
                  >
                    <div className="py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-3 text-sm transition-colors"
                          style={{
                            color: theme.colors.text.primary,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = theme.colors.primary.main;
                            e.currentTarget.style.background = theme.colors.neutral[100];
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = theme.colors.text.primary;
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={`tel:${menuData.phone}`}
              className={classNames.buttonPrimary}
              style={{
                background: theme.components.button.primary.background,
                color: theme.components.button.primary.textColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.components.button.primary.backgroundHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme.components.button.primary.background;
              }}
            >
              Call Now
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 transition-colors"
            style={{ color: theme.colors.text.primary }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            className="md:hidden py-4 max-h-96 overflow-y-auto"
            style={{
              borderTop: theme.components.header.borderBottom,
            }}
          >
            {menuData.primaryMenu.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 font-medium transition-colors"
                  style={{ color: theme.colors.text.primary }}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-3 py-2 text-sm transition-colors"
                        style={{ color: theme.colors.text.secondary }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a
              href={`tel:${menuData.phone}`}
              className={`block px-3 py-2 mt-2 text-center rounded-lg ${classNames.buttonPrimary}`}
              style={{
                background: theme.components.button.primary.background,
                color: theme.components.button.primary.textColor,
              }}
            >
              Call Now
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
