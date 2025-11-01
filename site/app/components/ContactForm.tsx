"use client";

import { useState } from "react";
import { classNames, theme } from "@/app/styles/theme";
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
    <div className="bg-white rounded-lg shadow-md p-8">
      {title && <h2 className={classNames.heading2 + " mb-2"}>{title}</h2>}
      <p className={classNames.body + " mb-8"} style={{ color: theme.colors.text.secondary }}>
        Fill out the form below and we'll get back to you as soon as possible.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold mb-2" style={{ color: theme.colors.text.primary }}>
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
                borderColor: theme.colors.border,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.colors.primary.main;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.colors.border;
              }}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold mb-2" style={{ color: theme.colors.text.primary }}>
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
                borderColor: theme.colors.border,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.colors.primary.main;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.colors.border;
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: theme.colors.text.primary }}>
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
                borderColor: theme.colors.border,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.colors.primary.main;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.colors.border;
              }}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold mb-2" style={{ color: theme.colors.text.primary }}>
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
                borderColor: theme.colors.border,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.colors.primary.main;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.colors.border;
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-semibold mb-2" style={{ color: theme.colors.text.primary }}>
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
              borderColor: theme.colors.border,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = theme.colors.primary.main;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.colors.border;
            }}
          />
        </div>


        <div>
          <label htmlFor="message" className="block text-sm font-semibold mb-2" style={{ color: theme.colors.text.primary }}>
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
              borderColor: theme.colors.border,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = theme.colors.primary.main;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.colors.border;
            }}
          />
        </div>

        <button
          type="submit"
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
          Send Request
        </button>
      </form>

      {submitted && (
        <div className="mt-6 p-4 rounded-lg" style={{ background: theme.colors.neutral[100] }}>
          <p className={classNames.body} style={{ color: theme.colors.text.primary }}>
            Thank you for your request! Your email client should open with the form data ready to send.
          </p>
        </div>
      )}
    </div>
  );
}
