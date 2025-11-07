"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { classNames, theme } from "@/app/styles/theme";
import CTAButton from "@/app/components/CTAButton";
import { ASSET_PATH } from "@/app/config";
import type { MenuStructure, SiteConfig } from "@/lib/db";

interface HeaderProps {
  menuData: MenuStructure;
  siteConfig: SiteConfig;
}

export default function Header({ menuData, siteConfig }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isCommercialEVPage = pathname === '/commercial-electric-vehicle-chargers' || pathname === '/commercial-electric-vehicle-chargers/';
  const isVideoOverlayPage = isHomePage || isCommercialEVPage;
  const showWhiteText = isVideoOverlayPage;

  useEffect(() => {
    const checkDarkMode = () => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Close mobile menu when pathname changes
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={isVideoOverlayPage ? "absolute top-0 left-0 right-0 z-50" : "sticky top-0 z-50"}
      style={{
        background: isVideoOverlayPage ? "transparent" : "transparent",
        backdropFilter: isVideoOverlayPage ? "none" : "blur(20px)",
        backgroundColor: isVideoOverlayPage ? "transparent" : "rgba(0, 0, 0, 0.3)",
        borderBottom: "none",
      }}
    >
      <div className={classNames.container}>
        <div className="flex justify-between lg:justify-center items-center" style={{ height: "80px" }}>
          {/* Logo on mobile/tablet */}
          <Link href="/" className="lg:hidden flex-shrink-0">
            <Image
              src={ASSET_PATH("/images/shaffer-logo-mini.png")}
              alt="Shaffer Construction"
              width={27}
              height={27}
              className="h-auto"
            />
          </Link>

          {/* Desktop Navigation and Phone */}
          <div className="hidden lg:flex items-center space-x-0">
            {/* Logo (always visible) */}
            <Link href="/" className="flex-shrink-0 mr-4">
              <Image
                src={ASSET_PATH("/images/shaffer-logo-mini.png")}
                alt="Shaffer Construction"
                width={27}
                height={27}
                className="h-auto"
              />
            </Link>
            <nav className="flex items-center space-x-0 whitespace-nowrap">
              {menuData.primaryMenu.map((item) => (
                <div key={item.label} className="relative group">
                  {item.children && item.label === 'Services' ? (
                    <span
                      className="px-3 py-2 font-medium flex items-center transition-colors whitespace-nowrap cursor-default"
                      style={{ color: showWhiteText ? "#ffffff" : "var(--text)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = showWhiteText ? "#ffffff" : "var(--text)")}
                    >
                      {item.label}
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="px-3 py-2 font-medium flex items-center transition-colors whitespace-nowrap"
                      style={{ color: showWhiteText ? "#ffffff" : "var(--text)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = showWhiteText ? "#ffffff" : "var(--text)")}
                    >
                      {item.label}
                      {item.children && (
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      )}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {item.children && (
                    <div
                      className="absolute left-0 -mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 rounded-md pt-1"
                      style={{
                        background: "var(--background)",
                        border: "1px solid var(--secondary)",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div className="py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-3 text-sm transition-colors"
                            style={{
                              color: "var(--text)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = "var(--primary)";
                              e.currentTarget.style.background = "var(--background)";
                              e.currentTarget.style.opacity = "0.8";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "var(--text)";
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.opacity = "1";
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
            <div className="ml-4">
              <CTAButton phone={menuData.phone} />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 transition-colors"
            style={{ color: showWhiteText ? "#ffffff" : "var(--text)" }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            className="lg:hidden py-4 overflow-y-auto absolute top-20 left-0 right-0 z-40"
            style={{
              borderTop: "1px solid var(--secondary)",
              background: "var(--background)",
            }}
          >
            <div className="flex items-center justify-between px-3 py-2">
              <a
                href={`tel:${menuData.phone}`}
                className="font-medium transition-colors whitespace-nowrap"
                style={{
                  color: "var(--primary)",
                }}
              >
                {menuData.phone}
              </a>
            </div>
            {/* Top-level items except Service Areas and Games */}
            {menuData.primaryMenu
              .filter((item) => item.label !== 'Service Areas' && item.label !== 'Games' && !item.children)
              .map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 py-2 font-medium transition-colors"
                style={{ color: "var(--text)" }}
              >
                {item.label}
              </Link>
            ))}
            {/* Services children (expanded) */}
            {menuData.primaryMenu
              .filter((item) => item.label === 'Services' && item.children)
              .flatMap((item) => item.children || [])
              .map((child) => (
              <Link
                key={child.label}
                href={child.href}
                className="block px-3 py-2 font-medium transition-colors"
                style={{ color: "var(--text)" }}
              >
                {child.label}
              </Link>
            ))}
            {/* Service Areas */}
            {menuData.primaryMenu
              .filter((item) => item.label === 'Service Areas')
              .map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 py-2 font-medium transition-colors"
                style={{ color: "var(--text)" }}
              >
                {item.label}
              </Link>
            ))}
            {/* Games at the end */}
            {menuData.primaryMenu
              .filter((item) => item.label === 'Games')
              .map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 py-2 font-medium transition-colors"
                style={{ color: "var(--text)" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
