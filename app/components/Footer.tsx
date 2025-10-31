"use client";

import siteConfig from "@/data/site-config.json";
import type { SiteConfig } from "@/types";
import Link from "next/link";
import { classNames, theme } from "@/app/styles/theme";

export default function Footer() {
  const config = siteConfig as SiteConfig;

  return (
    <footer
      style={{
        background: theme.components.footer.background,
        color: theme.components.footer.textColor,
      }}
      className="py-16 mt-20"
    >
      <div className={classNames.container}>
        {/* CTA Section */}
        <div className="mb-16 text-center">
          <h3 className="text-4xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: theme.colors.neutral[300] }}>
            Contact our team today for a free consultation on your electrical or EV charging needs
          </p>
          <a
            href={`tel:${config.contact.phone}`}
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
            Call Now: {config.contact.phone}
          </a>
        </div>

        {/* Footer Grid */}
        <div
          className={classNames.gridCols4 + " mb-12 pb-12"}
          style={{
            borderBottom: `1px solid ${theme.colors.neutral[700]}`,
            gap: "3rem",
          }}
        >
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className={classNames.linkLight}
                  style={{ color: theme.colors.primary.light }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className={classNames.linkLight}
                  style={{ color: theme.colors.primary.light }}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/category/industry-insights"
                  className={classNames.linkLight}
                  style={{ color: theme.colors.primary.light }}
                >
                  Industry Insights
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className={classNames.linkLight}
                  style={{ color: theme.colors.primary.light }}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact</h4>
            <ul className="space-y-3" style={{ color: theme.colors.neutral[300] }}>
              <li>
                <a href={`tel:${config.contact.phone}`} className={classNames.linkLight} style={{ color: theme.colors.primary.light }}>
                  {config.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${config.contact.email}`} className={classNames.linkLight} style={{ color: theme.colors.primary.light }}>
                  {config.contact.email}
                </a>
              </li>
              <li>{config.contact.workingHours}</li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-lg font-bold mb-6">Location</h4>
            <p style={{ color: theme.colors.neutral[300] }}>
              {config.contact.address.street}<br />
              {config.contact.address.city}, {config.contact.address.state} {config.contact.address.zip}
            </p>
          </div>

          {/* Licenses */}
          <div>
            <h4 className="text-lg font-bold mb-6">Licenses</h4>
            <ul className="space-y-2 text-sm" style={{ color: theme.colors.neutral[300] }}>
              {config.business.licenses.map((license, index) => (
                <li key={index}>{license}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm" style={{ color: theme.colors.neutral[400] }}>
          <p>&copy; {new Date().getFullYear()} {config.siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
