"use client";

import Link from "next/link";
import type { SiteConfig } from "@/lib/db";
import { Home, Phone, Mail, Clock, MapPin, FileCheck, Facebook, Instagram } from "lucide-react";
import { trackPhoneClick, trackEmailClick } from "@/app/lib/analytics";

interface FooterProps {
  siteConfig: SiteConfig;
}

export default function Footer({ siteConfig }: FooterProps) {
  const config = siteConfig;

  return (
    <footer className="py-6 sm:py-8 mt-8 sm:mt-12 border-t w-full" style={{ background: "var(--background)", color: "var(--text)", borderColor: "var(--secondary)" }}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b" style={{ borderColor: "var(--secondary)" }}>
          {/* Quick Links */}
          <div>
            <h4 className="text-sm sm:text-base font-bold mb-2 sm:mb-3">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                  <Home className="w-3 h-3" style={{ color: "var(--primary)" }} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                  <FileCheck className="w-3 h-3" style={{ color: "var(--primary)" }} />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/industry-insights" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                  <FileCheck className="w-3 h-3" style={{ color: "var(--primary)" }} />
                  <span>Industry Insights</span>
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                  <Mail className="w-3 h-3" style={{ color: "var(--primary)" }} />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm sm:text-base font-bold mb-2 sm:mb-3">Contact</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href={`tel:${config.contact.phone}`}
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                  onClick={() => trackPhoneClick(config.contact.phone, 'Footer')}
                >
                  <Phone className="w-3 h-3" style={{ color: "var(--primary)" }} />
                  <span>{config.contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${config.contact.email}`}
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity break-all"
                  onClick={() => trackEmailClick(config.contact.email, 'Footer')}
                >
                  <Mail className="w-3 h-3 flex-shrink-0" style={{ color: "var(--primary)" }} />
                  <span>{config.contact.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-xs">
                <Clock className="w-3 h-3 flex-shrink-0" style={{ color: "var(--primary)" }} />
                <span>{config.contact.workingHours}</span>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-sm sm:text-base font-bold mb-2 sm:mb-3">Location</h4>
            <div className="flex items-start gap-2 text-xs sm:text-sm">
              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "var(--primary)" }} />
              <div>
                <span className="block">{config.contact.address.street}</span>
                <span className="block">{config.contact.address.city}, {config.contact.address.state} {config.contact.address.zip}</span>
              </div>
            </div>
          </div>

          {/* Licenses */}
          <div>
            <h4 className="text-sm sm:text-base font-bold mb-2 sm:mb-3">Licenses</h4>
            <ul className="space-y-1 text-xs">
              {config.business.licenses.map((license, index) => (
                <li key={index} className="flex items-center gap-2">
                  <FileCheck className="w-3 h-3 flex-shrink-0" style={{ color: "var(--primary)" }} />
                  <span>{license}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright and Social Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 sm:pt-4 gap-2 sm:gap-4">
          <p className="text-xs text-center sm:text-left">&copy; {new Date().getFullYear()} {config.siteName}. All rights reserved.</p>
          {(config.social.facebook || config.social.instagram) && (
            <div className="flex gap-3 sm:gap-4">
              {config.social.facebook && (
                <a
                  href={config.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity"
                >
                  <Facebook className="w-3 h-3" style={{ color: "var(--primary)" }} />
                  <span>Facebook</span>
                </a>
              )}
              {config.social.instagram && (
                <a
                  href={config.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity"
                >
                  <Instagram className="w-3 h-3" style={{ color: "var(--primary)" }} />
                  <span>Instagram</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
