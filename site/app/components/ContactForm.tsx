"use client";

import { useState } from "react";
import { classNames } from "@/app/styles/theme";
import { serviceCategoryForPath, trackFormSubmit, trackGenerateLead, trackQualifiedLead } from "@/app/lib/analytics";
import type { SiteConfig } from "@/lib/db";

interface ContactFormProps {
  title?: string;
  siteConfig: SiteConfig;
}

interface LeadAttribution {
  pageUrl: string;
  pagePath: string;
  pageTitle: string;
  referrer: string;
  landingPage: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  msclkid: string;
  fbclid: string;
  serviceCategory: string;
  landingServiceCategory: string;
}

function searchValue(params: URLSearchParams, key: string) {
  return params.get(key) || "";
}

function readLeadAttribution(): LeadAttribution {
  const params = new URLSearchParams(window.location.search);
  const storageKey = "shaffercon_landing_page";
  const pageUrl = window.location.href;

  let landingPage = pageUrl;
  let landingServiceCategory = serviceCategoryForPath(`${window.location.pathname}${window.location.search}`);
  try {
    const storedLandingPage = window.sessionStorage.getItem(storageKey);
    const storedServiceCategory = window.sessionStorage.getItem("shaffercon_landing_service_category");
    if (storedLandingPage) {
      landingPage = storedLandingPage;
    } else {
      window.sessionStorage.setItem(storageKey, pageUrl);
    }

    if (storedServiceCategory) {
      landingServiceCategory = storedServiceCategory;
    }
  } catch (error) {
    landingPage = pageUrl;
  }

  return {
    pageUrl,
    pagePath: `${window.location.pathname}${window.location.search}`,
    pageTitle: document.title,
    referrer: document.referrer || "",
    landingPage,
    utmSource: searchValue(params, "utm_source"),
    utmMedium: searchValue(params, "utm_medium"),
    utmCampaign: searchValue(params, "utm_campaign"),
    utmTerm: searchValue(params, "utm_term"),
    utmContent: searchValue(params, "utm_content"),
    gclid: searchValue(params, "gclid"),
    gbraid: searchValue(params, "gbraid"),
    wbraid: searchValue(params, "wbraid"),
    msclkid: searchValue(params, "msclkid"),
    fbclid: searchValue(params, "fbclid"),
    serviceCategory: serviceCategoryForPath(`${window.location.pathname}${window.location.search}`),
    landingServiceCategory,
  };
}

export default function ContactForm({ title, siteConfig }: ContactFormProps) {
  const config = siteConfig;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    // Honeypot field — humans never see this, bots fill it. If it's not
    // empty when the form submits, we reject. Named generically to look
    // like a real field bots want to autofill.
    website: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Track when the form rendered. Bot tools typically submit within
  // milliseconds of page load; humans take seconds. Submissions under
  // 3 seconds are treated as suspicious.
  const [renderedAt] = useState<number>(() => Date.now());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Honeypot check: only bots fill this hidden field
    if (formData.website) {
      // Pretend we succeeded so the bot moves on.
      setSubmitted(true);
      return;
    }

    // Time check: real humans take more than 3 seconds to fill out a form
    const elapsed = Date.now() - renderedAt;
    if (elapsed < 3000) {
      // Suspicious — pretend success but don't actually submit
      setSubmitted(true);
      return;
    }

    const attribution = readLeadAttribution();

    try {
      // Submit to Cloudflare Worker (GitHub token is secure on the server)
      // Keep the workers.dev endpoint until api.shaffercon.com resolves.
      const response = await fetch('https://shaffercon-contact-form.mikejshaffer.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          message: formData.message,
          attribution,
        }),
      });

      if (response.ok) {
        const result = await response.json().catch(() => ({ accepted: true }));
        if (result.accepted !== false) {
          trackFormSubmit("Contact form", window.location.pathname);
          trackGenerateLead("contact_form", window.location.pathname);
          trackQualifiedLead("contact_form", window.location.pathname);
        }
        setSubmitted(true);
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          message: "",
          website: "",
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      // Fallback to mailto on error
      const mailtoLink = `mailto:${config.contact.email}?subject=Service Request&body=${encodeURIComponent(
        `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nAddress: ${formData.address}\nSource page: ${attribution.pageUrl}\nLanding page: ${attribution.landingPage}\nReferrer: ${attribution.referrer}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoLink;
    }
  };

  return (
    <div
      className="rounded-2xl p-8"
      style={{
        background: "var(--section-gray)",
        border: "1px solid var(--section-border)",
      }}
    >
      {title && (
        <h2 className={classNames.heading2 + " mb-2"} style={{ color: "var(--text)" }}>
          {title}
        </h2>
      )}
      {!title && (
        <p className="text-lg mb-8 text-center" style={{ color: "var(--secondary)" }}>
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot — hidden from humans, autofilled by bots. tabindex=-1
            and aria-hidden keep accessible tools from interacting with it. */}
        <div style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
          <label htmlFor="website">Website (leave blank)</label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border transition-colors"
              style={{
                borderColor: "var(--secondary)",
                background: "var(--background)",
                color: "var(--text)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--primary)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--secondary)";
              }}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border transition-colors"
              style={{
                borderColor: "var(--secondary)",
                background: "var(--background)",
                color: "var(--text)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--primary)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--secondary)";
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border transition-colors"
              style={{
                borderColor: "var(--secondary)",
                background: "var(--background)",
                color: "var(--text)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--primary)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--secondary)";
              }}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border transition-colors"
              style={{
                borderColor: "var(--secondary)",
                background: "var(--background)",
                color: "var(--text)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--primary)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--secondary)";
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border transition-colors"
            style={{
              borderColor: "var(--secondary)",
              background: "var(--background)",
              color: "var(--text)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--primary)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--secondary)";
            }}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2 rounded-lg border transition-colors"
            style={{
              borderColor: "var(--secondary)",
              background: "var(--background)",
              color: "var(--text)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--primary)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--secondary)";
            }}
          />
        </div>

        <button
          type="submit"
          className={classNames.buttonPrimary}
          style={{
            background: "var(--primary)",
            color: "var(--background)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--primary)";
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--primary)";
            e.currentTarget.style.opacity = '1';
          }}
        >
          Send Request
        </button>
      </form>

      {submitted && (
        <div
          className="mt-6 p-4 rounded-lg border"
          style={{
            background: "var(--background)",
            borderColor: "var(--primary)",
          }}
        >
          <p className="text-lg font-semibold" style={{ color: "var(--primary)" }}>
            Thank you for your submission! We'll get back to you soon.
          </p>
        </div>
      )}
    </div>
  );
}
