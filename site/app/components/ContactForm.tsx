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

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  propertyType: string;
  studyReason: string;
  newLoadType: string;
  chargerCount: string;
  utilityProvider: string;
  permitDeadline: string;
  stampedReport: string;
  plansAvailable: string;
  website: string;
}

const emptyFormData: ContactFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  message: "",
  propertyType: "",
  studyReason: "",
  newLoadType: "",
  chargerCount: "",
  utilityProvider: "",
  permitDeadline: "",
  stampedReport: "",
  plansAvailable: "",
  website: "",
};

function searchValue(params: URLSearchParams, key: string) {
  return params.get(key) || "";
}

function isLoadStudyPath(value: string) {
  const normalized = value.toLowerCase();
  return normalized.includes("electrical-load-studies") ||
    normalized.includes("load-study") ||
    normalized.includes("service=load-study") ||
    normalized.includes("electrical_load_studies");
}

function readIsLoadStudyContext() {
  if (typeof window === "undefined") return false;

  const current = `${window.location.pathname}${window.location.search}`;
  if (isLoadStudyPath(current)) return true;

  try {
    const landingPage = window.sessionStorage.getItem("shaffercon_landing_page") || "";
    const landingService = window.sessionStorage.getItem("shaffercon_landing_service_category") || "";
    return isLoadStudyPath(landingPage) || isLoadStudyPath(landingService);
  } catch (error) {
    return false;
  }
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
  const [isLoadStudyContext] = useState<boolean>(() => readIsLoadStudyContext());
  const [formData, setFormData] = useState<ContactFormData>(emptyFormData);

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
    const loadStudyIntake = isLoadStudyContext ? {
      propertyType: formData.propertyType,
      studyReason: formData.studyReason,
      newLoadType: formData.newLoadType,
      chargerCount: formData.chargerCount,
      utilityProvider: formData.utilityProvider,
      permitDeadline: formData.permitDeadline,
      stampedReport: formData.stampedReport,
      plansAvailable: formData.plansAvailable,
    } : null;

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
          loadStudyIntake,
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
        setFormData(emptyFormData);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      // Fallback to mailto on error
      const intakeLines = loadStudyIntake ? `\nProperty type: ${loadStudyIntake.propertyType}\nStudy reason: ${loadStudyIntake.studyReason}\nNew load type: ${loadStudyIntake.newLoadType}\nCharger count: ${loadStudyIntake.chargerCount}\nUtility: ${loadStudyIntake.utilityProvider}\nPermit deadline: ${loadStudyIntake.permitDeadline}\nStamped report needed: ${loadStudyIntake.stampedReport}\nPhotos or plans available: ${loadStudyIntake.plansAvailable}\n` : "";
      const mailtoLink = `mailto:${config.contact.email}?subject=Service Request&body=${encodeURIComponent(
        `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nAddress: ${formData.address}${intakeLines}\nSource page: ${attribution.pageUrl}\nLanding page: ${attribution.landingPage}\nReferrer: ${attribution.referrer}\n\nMessage:\n${formData.message}`
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

        {isLoadStudyContext && (
          <div
            className="rounded-lg border p-5 space-y-5"
            style={{
              background: "var(--background)",
              borderColor: "var(--section-border)",
            }}
          >
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>
                Load Study Details
              </h3>
              <p className="text-base leading-relaxed" style={{ color: "var(--secondary)" }}>
                These details help us tell whether the next step is monitoring, a permit report, load management, or an upgrade plan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="propertyType" className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                  Property Type
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border transition-colors"
                  style={{ borderColor: "var(--secondary)", background: "var(--background)", color: "var(--text)" }}
                >
                  <option value="">Select one</option>
                  <option value="Commercial building">Commercial building</option>
                  <option value="Multifamily property">Multifamily property</option>
                  <option value="Retail or restaurant">Retail or restaurant</option>
                  <option value="Industrial or warehouse">Industrial or warehouse</option>
                  <option value="Residential property">Residential property</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="studyReason" className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                  Reason for Study
                </label>
                <select
                  id="studyReason"
                  name="studyReason"
                  value={formData.studyReason}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border transition-colors"
                  style={{ borderColor: "var(--secondary)", background: "var(--background)", color: "var(--text)" }}
                >
                  <option value="">Select one</option>
                  <option value="EV charger planning">EV charger planning</option>
                  <option value="LADBS permit or plan check">LADBS permit or plan check</option>
                  <option value="Tenant improvement">Tenant improvement</option>
                  <option value="Panel or service upgrade">Panel or service upgrade</option>
                  <option value="New equipment load">New equipment load</option>
                  <option value="Utility coordination">Utility coordination</option>
                </select>
              </div>

              <div>
                <label htmlFor="newLoadType" className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                  New Load Type
                </label>
                <input
                  type="text"
                  id="newLoadType"
                  name="newLoadType"
                  value={formData.newLoadType}
                  onChange={handleChange}
                  placeholder="EV chargers, HVAC, kitchen equipment, tenant loads"
                  className="w-full px-4 py-2 rounded-lg border transition-colors"
                  style={{ borderColor: "var(--secondary)", background: "var(--background)", color: "var(--text)" }}
                />
              </div>

              <div>
                <label htmlFor="chargerCount" className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                  Charger Count, if EV
                </label>
                <input
                  type="text"
                  id="chargerCount"
                  name="chargerCount"
                  value={formData.chargerCount}
                  onChange={handleChange}
                  placeholder="Example, 4 Level 2 chargers"
                  className="w-full px-4 py-2 rounded-lg border transition-colors"
                  style={{ borderColor: "var(--secondary)", background: "var(--background)", color: "var(--text)" }}
                />
              </div>

              <div>
                <label htmlFor="utilityProvider" className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                  Utility
                </label>
                <select
                  id="utilityProvider"
                  name="utilityProvider"
                  value={formData.utilityProvider}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border transition-colors"
                  style={{ borderColor: "var(--secondary)", background: "var(--background)", color: "var(--text)" }}
                >
                  <option value="">Select one</option>
                  <option value="LADWP">LADWP</option>
                  <option value="SCE">SCE</option>
                  <option value="Other or not sure">Other or not sure</option>
                </select>
              </div>

              <div>
                <label htmlFor="permitDeadline" className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                  Permit or Decision Deadline
                </label>
                <input
                  type="text"
                  id="permitDeadline"
                  name="permitDeadline"
                  value={formData.permitDeadline}
                  onChange={handleChange}
                  placeholder="No deadline, ASAP, or a date"
                  className="w-full px-4 py-2 rounded-lg border transition-colors"
                  style={{ borderColor: "var(--secondary)", background: "var(--background)", color: "var(--text)" }}
                />
              </div>

              <div>
                <label htmlFor="stampedReport" className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                  Stamped Report Needed?
                </label>
                <select
                  id="stampedReport"
                  name="stampedReport"
                  value={formData.stampedReport}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border transition-colors"
                  style={{ borderColor: "var(--secondary)", background: "var(--background)", color: "var(--text)" }}
                >
                  <option value="">Select one</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Not sure">Not sure</option>
                </select>
              </div>

              <div>
                <label htmlFor="plansAvailable" className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                  Photos, Plans, or Cutsheets Available?
                </label>
                <select
                  id="plansAvailable"
                  name="plansAvailable"
                  value={formData.plansAvailable}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border transition-colors"
                  style={{ borderColor: "var(--secondary)", background: "var(--background)", color: "var(--text)" }}
                >
                  <option value="">Select one</option>
                  <option value="Photos available">Photos available</option>
                  <option value="Plans or drawings available">Plans or drawings available</option>
                  <option value="Charger or equipment cutsheets available">Charger or equipment cutsheets available</option>
                  <option value="Not yet">Not yet</option>
                </select>
              </div>
            </div>
          </div>
        )}

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
