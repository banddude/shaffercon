"use client";

import { useState } from "react";
import { classNames } from "@/app/styles/theme";
import type { SiteConfig } from "@/lib/db";

interface ContactFormProps {
  title?: string;
  siteConfig: SiteConfig;
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
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Construct mailto link with form data
    const mailtoLink = `mailto:${config.contact.email}?subject=Service Request&body=${encodeURIComponent(
      `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nAddress: ${formData.address}\n\nMessage:\n${formData.message}`
    )}`;

    window.location.href = mailtoLink;
    setSubmitted(true);
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
          className="mt-6 p-4 rounded-lg"
          style={{
            background: "var(--secondary)",
            opacity: 0.1,
          }}
        >
          <p className={classNames.body} style={{ color: "var(--text)" }}>
            Thank you for your request! Your email client should open with the form data ready to send.
          </p>
        </div>
      )}
    </div>
  );
}
