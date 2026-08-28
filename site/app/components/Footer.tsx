"use client";

import Link from "next/link";
import { telHref } from "@/app/config";
import type { SiteConfig } from "@/lib/db";
import { Home, Phone, Mail, Clock, MapPin, FileCheck, Facebook, Instagram } from "lucide-react";

interface FooterProps {
  siteConfig: SiteConfig;
}

const POPULAR_AREA_SERVICES: { href: string; label: string }[] = [
  { href: "/service-areas/silver-lake/residential-ev-charger-installation/", label: "EV Charger Installation in Silver Lake" },
  { href: "/service-areas/los-feliz/residential-electrical-panel-upgrades/", label: "Panel Upgrades in Los Feliz" },
  { href: "/service-areas/pasadena/residential-ev-charger-installation/", label: "EV Charger Installation in Pasadena" },
  { href: "/service-areas/beverly-hills/residential-electrical-panel-upgrades/", label: "Panel Upgrades in Beverly Hills" },
  { href: "/service-areas/santa-monica/residential-lighting-installation-retrofitting/", label: "Lighting Installation in Santa Monica" },
  { href: "/service-areas/long-beach/residential-ev-charger-installation/", label: "EV Charger Installation in Long Beach" },
  { href: "/service-areas/west-hollywood/residential-ev-charger-installation/", label: "EV Charger Installation in West Hollywood" },
  { href: "/service-areas/glendale/residential-electrical-panel-upgrades/", label: "Panel Upgrades in Glendale" },
  { href: "/service-areas/culver-city/residential-ev-charger-installation/", label: "EV Charger Installation in Culver City" },
  { href: "/service-areas/sherman-oaks/", label: "Electrician in Sherman Oaks" },
  { href: "/service-areas/highland-park/residential-electrical-safety-inspections/", label: "Safety Inspections in Highland Park" },
  { href: "/service-areas/venice/residential-lighting-installation-retrofitting/", label: "Lighting Installation in Venice" },
];

export default function Footer({ siteConfig }: FooterProps) {
  const config = siteConfig;

  return (
    <footer className="py-6 sm:py-8 mt-8 sm:mt-12 border-t w-full" style={{ background: "var(--background)", color: "var(--text)", borderColor: "var(--secondary)" }}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Popular Service Areas - sitewide deep links into the location/service grid */}
        <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b" style={{ borderColor: "var(--secondary)" }}>
          <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3">Popular Service Areas</h3>
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs sm:text-sm">
            {POPULAR_AREA_SERVICES.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex items-center gap-1.5 hover:opacity-70 transition-opacity py-1">
                  <MapPin className="w-3 h-3" style={{ color: "var(--primary)" }} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b" style={{ borderColor: "var(--secondary)" }}>
          {/* Quick Links */}
          <div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3">Quick Links</h3>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity py-1.5">
                  <Home className="w-3 h-3" style={{ color: "var(--primary)" }} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about-us/" className="flex items-center gap-2 hover:opacity-70 transition-opacity py-1.5">
                  <FileCheck className="w-3 h-3" style={{ color: "var(--primary)" }} />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/industry-insights/" className="flex items-center gap-2 hover:opacity-70 transition-opacity py-1.5">
                  <FileCheck className="w-3 h-3" style={{ color: "var(--primary)" }} />
                  <span>Industry Insights</span>
                </Link>
              </li>
              <li>
                <Link href="/venetian-plaster-los-angeles/" className="flex items-center gap-2 hover:opacity-70 transition-opacity py-1.5">
                  <FileCheck className="w-3 h-3" style={{ color: "var(--primary)" }} />
                  <span>Venetian Plaster</span>
                </Link>
              </li>
              <li>
                <Link href="/contact-us/" className="flex items-center gap-2 hover:opacity-70 transition-opacity py-1.5">
                  <Mail className="w-3 h-3" style={{ color: "var(--primary)" }} />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3">Contact</h3>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href={telHref(config.contact.phone)}
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity py-1.5"
                >
                  <Phone className="w-3 h-3" style={{ color: "var(--primary)" }} />
                  <span>{config.contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${config.contact.email}`}
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity break-all py-1.5"
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
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3">Location</h3>
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
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3">Licenses</h3>
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
