"use client";

import Link from "next/link";
import type { SiteConfig } from "@/lib/db";

interface FooterProps {
  siteConfig: SiteConfig;
}

export default function Footer({ siteConfig }: FooterProps) {
  const config = siteConfig;

  return (
    <footer className="py-8 sm:py-12 md:py-16 mt-12 sm:mt-16 md:mt-20 border-t w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12 pb-8 sm:pb-12 border-b">
          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link href="/" className="underline hover:no-underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="underline hover:no-underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/industry-insights" className="underline hover:no-underline">
                  Industry Insights
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="underline hover:no-underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Contact</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <a href={`tel:${config.contact.phone}`} className="underline hover:no-underline">
                  {config.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${config.contact.email}`} className="underline hover:no-underline break-all">
                  {config.contact.email}
                </a>
              </li>
              <li className="text-xs sm:text-sm">{config.contact.workingHours}</li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Location</h4>
            <p className="text-sm sm:text-base space-y-1">
              <span className="block">{config.contact.address.street}</span>
              <span className="block">{config.contact.address.city}, {config.contact.address.state} {config.contact.address.zip}</span>
            </p>
          </div>

          {/* Licenses */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Licenses</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              {config.business.licenses.map((license, index) => (
                <li key={index}>{license}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs sm:text-sm pt-4 sm:pt-6">
          <p>&copy; {new Date().getFullYear()} {config.siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
