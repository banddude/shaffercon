import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/db";
import ContactForm from "@/app/components/ContactForm";
import { Section, Container, SectionHeading } from "@/app/components/UI";
import { AppleButton } from "@/app/components/UI/AppleStyle";
import { BreadcrumbSchema } from "@/app/components/schemas/BreadcrumbSchema";
import { ASSET_PATH } from "@/app/config";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://shaffercon.com';
  const url = `${baseUrl}/contact-us`;
  const title = "Contact Us - Los Angeles Electrical Contractor";
  const description = "Contact Shaffer Construction for expert EV charging and electrical installation services in Los Angeles County. Call (323) 642-8509 for a free estimate.";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Shaffer Construction',
      locale: 'en_US',
      type: 'website',
      images: [`${baseUrl}/og-image.jpg`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
  };
}

// Page component
export default function ContactPage() {
  const siteConfig = getSiteConfig();

  return (
    <main className="w-full">
      <BreadcrumbSchema
        items={[
          { label: "Home", href: "/" },
          { label: "Contact Us" }
        ]}
      />
      {/* Hero Video Section */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "60vh" }}>
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={ASSET_PATH("/images/posters/ev-charging.webp")}
            className="w-full h-full object-cover"
            aria-label="Contact Shaffer Construction for electrical services"
            style={{
              filter: "brightness(0.4)",
              objectPosition: "center",
            }}
          >
            <source src={ASSET_PATH("/ev-charging.mp4")} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 z-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} />

        {/* Content */}
        <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 py-12 sm:py-20 lg:py-28" style={{ paddingTop: "120px" }}>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-6" style={{ color: "#ffffff" }}>
              Get in Touch
            </h1>
            <p className="text-xl mb-8" style={{ color: "#d1d5db" }}>
              Ready to start your electrical project? Contact us for a free consultation and estimate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <AppleButton href="tel:(323) 642-8509" variant="primary" size="lg">
                <Phone className="w-5 h-5 mr-2" />
                Call (323) 642-8509
              </AppleButton>
              <AppleButton href={`mailto:${siteConfig.contact.email}`} variant="secondary" size="lg">
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </AppleButton>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 sm:py-20 lg:py-28" style={{ background: "var(--section-gray)" }}>
        <Container maxWidth="xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone */}
            <div className="p-6 rounded-2xl text-center" style={{ background: "var(--background)", border: "1px solid var(--section-border)" }}>
              <Phone className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--primary)" }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Phone</h3>
              <a href={`tel:${siteConfig.contact.phone}`} className="text-lg" style={{ color: "var(--secondary)" }}>
                {siteConfig.contact.phone}
              </a>
            </div>

            {/* Email */}
            <div className="p-6 rounded-2xl text-center" style={{ background: "var(--background)", border: "1px solid var(--section-border)" }}>
              <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--primary)" }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Email</h3>
              <a href={`mailto:${siteConfig.contact.email}`} className="text-lg break-all" style={{ color: "var(--secondary)" }}>
                {siteConfig.contact.email}
              </a>
            </div>

            {/* Address */}
            <div className="p-6 rounded-2xl text-center" style={{ background: "var(--background)", border: "1px solid var(--section-border)" }}>
              <MapPin className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--primary)" }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Office</h3>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${siteConfig.contact.address.street}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.state} ${siteConfig.contact.address.zip}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg block"
                style={{ color: "var(--secondary)" }}
              >
                {siteConfig.contact.address.street}<br />
                {siteConfig.contact.address.city}, {siteConfig.contact.address.state} {siteConfig.contact.address.zip}
              </a>
            </div>

            {/* Hours */}
            <div className="p-6 rounded-2xl text-center" style={{ background: "var(--background)", border: "1px solid var(--section-border)" }}>
              <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--primary)" }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Hours</h3>
              <p className="text-lg" style={{ color: "var(--secondary)" }}>
                {siteConfig.contact.workingHours}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* What to Expect Section */}
      <Section padding="lg">
        <Container maxWidth="lg">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text)" }}>
              What to Expect When You Reach Out
            </h2>
            <p className="text-lg mb-4" style={{ color: "var(--secondary)" }}>
              Shaffer Construction is a Los Angeles licensed electrical and general contractor: California CSLB License #994593, with A General Engineering, B General Building, and C-10 Electrical classifications under one license. We&apos;ve been serving the LA area for 25+ years across more than 1,000 projects.
            </p>
            <p className="text-lg mb-4" style={{ color: "var(--secondary)" }}>
              When you call <a href={`tel:${siteConfig.contact.phone}`} style={{ color: "var(--primary)" }}>{siteConfig.contact.phone}</a> during business hours, you&apos;ll talk to our office team, not a national call center. We&apos;ll ask a few quick questions about your project (residential or commercial, what kind of work, your address) and get back to you with a free quote, usually same-day.
            </p>
            <h3 className="text-2xl font-bold mt-8 mb-4" style={{ color: "var(--text)" }}>
              Active Service Lines
            </h3>
            <ul className="text-lg list-disc pl-6 space-y-2" style={{ color: "var(--secondary)" }}>
              <li><strong>Eaton Fire and Palisades Fire rebuilds</strong>: active rebuild work in Altadena, Pasadena, and Pacific Palisades. Triple license means electrical AND structural under one contractor, which speeds up insurance and permitting.</li>
              <li><strong>EV charger installation</strong>: Tesla Wall Connector, ChargePoint, Wallbox, and others. Most residential installs done in 3–5 hours. Commercial multi-stall and DC fast charging too.</li>
              <li><strong>Panel upgrades</strong>, 100A → 200A → 400A residential, plus commercial service upgrades. We handle LADWP and SCE coordination directly.</li>
              <li><strong>Electrical load studies</strong>, stamped engineering reports for permit submittal, produced in-house.</li>
              <li><strong>LED retrofits and energy efficiency</strong>: with SCE, LADWP, and SoCalGas rebate paperwork handled for you.</li>
              <li><strong>Statewide facilities maintenance</strong>: single licensed contractor, 24/7 emergency response, multi-site California operators.</li>
            </ul>
            <h3 className="text-2xl font-bold mt-8 mb-4" style={{ color: "var(--text)" }}>
              Service Areas
            </h3>
            <p className="text-lg mb-4" style={{ color: "var(--secondary)" }}>
              We serve 22+ communities across LA County including Altadena, Pasadena, Pacific Palisades, Beverly Hills, Hollywood, West Hollywood, Santa Monica, Culver City, Venice, Burbank, Glendale, Long Beach, Torrance, Inglewood, and more. <a href="/service-areas/" style={{ color: "var(--primary)" }}>See the full service area list</a>.
            </p>
            <h3 className="text-2xl font-bold mt-8 mb-4" style={{ color: "var(--text)" }}>
              For Realtors and Insurance Adjusters
            </h3>
            <p className="text-lg mb-4" style={{ color: "var(--secondary)" }}>
              We offer pre-listing electrical inspections and honest scope estimates during escrow. <a href="/realtors/" style={{ color: "var(--primary)" }}>More for realtors here</a>.
            </p>
          </div>
        </Container>
      </Section>

      {/* Contact Form Section */}
      <Section padding="lg">
        <Container maxWidth="lg">
          <SectionHeading className="text-center mb-12">Send Us a Message</SectionHeading>
          <ContactForm siteConfig={siteConfig} />
        </Container>
      </Section>
    </main>
  );
}
