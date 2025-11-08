import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/db";
import ContactForm from "@/app/components/ContactForm";
import { Section, Container, SectionHeading } from "@/app/components/UI";
import { AppleButton } from "@/app/components/UI/AppleStyle";
import { ASSET_PATH } from "@/app/config";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://banddude.github.io/shaffercon';
  const url = `${baseUrl}/contact-us`;
  const title = "Contact Us - Los Angeles Electrical Contractor | Shaffer Construction";
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
      {/* Hero Video Section */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "60vh" }}>
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
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
      <Section padding="lg" background="gray">
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
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Location</h3>
              <p className="text-lg" style={{ color: "var(--secondary)" }}>
                Serving Los Angeles County
              </p>
            </div>

            {/* Hours */}
            <div className="p-6 rounded-2xl text-center" style={{ background: "var(--background)", border: "1px solid var(--section-border)" }}>
              <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--primary)" }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Hours</h3>
              <p className="text-lg" style={{ color: "var(--secondary)" }}>
                Monday - Friday<br />8:00 AM - 5:00 PM
              </p>
            </div>
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
