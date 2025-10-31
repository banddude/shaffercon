"use client";

import { classNames, theme } from "@/app/styles/theme";
import ContactForm from "@/app/components/ContactForm";
import siteConfig from "@/data/site-config.json";
import type { SiteConfig } from "@/types";

export default function ContactUsPage() {
  const config = siteConfig as SiteConfig;

  return (
    <div>
      {/* Hero Section */}
      <div
        className={classNames.heroSection}
        style={{
          background: `linear-gradient(to right, ${theme.colors.primary.main}, ${theme.colors.primary.dark})`,
        }}
      >
        <div className={classNames.sectionContainer}>
          <h1 className={classNames.heading1} style={{ color: theme.colors.background.light }}>
            Contact Us
          </h1>
          <p className="text-xl max-w-2xl" style={{ color: theme.colors.neutral[200] }}>
            Connect with Shaffer Construction for premier EV charging and electrical solutions in Southern California.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className={classNames.sectionContainer + " py-16"}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-8">
            {/* Phone */}
            <div>
              <h3 className={classNames.heading4}>Phone</h3>
              <a
                href={`tel:${config.contact.phone}`}
                className="text-lg font-semibold"
                style={{ color: theme.colors.primary.main }}
              >
                {config.contact.phone}
              </a>
              <p className={classNames.bodyMuted + " mt-2"}>Available during business hours</p>
            </div>

            {/* Email */}
            <div>
              <h3 className={classNames.heading4}>Email</h3>
              <a
                href={`mailto:${config.contact.email}`}
                className="text-lg font-semibold"
                style={{ color: theme.colors.primary.main }}
              >
                {config.contact.email}
              </a>
              <p className={classNames.bodyMuted + " mt-2"}>We respond within 24 hours</p>
            </div>

            {/* Hours */}
            <div>
              <h3 className={classNames.heading4}>Hours</h3>
              <p className={classNames.body}>{config.contact.workingHours}</p>
            </div>

            {/* Address */}
            <div>
              <h3 className={classNames.heading4}>Address</h3>
              <p className={classNames.body}>
                {config.contact.address.street}
                <br />
                {config.contact.address.city}, {config.contact.address.state} {config.contact.address.zip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
