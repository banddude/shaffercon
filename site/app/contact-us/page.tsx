import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/db";
import ContactForm from "@/app/components/ContactForm";
import { Section, Container, PageTitle } from "@/app/components/UI";
import Breadcrumb from "@/app/components/Breadcrumb";

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
      {/* Hero Section */}
      <Section border="bottom" padding="lg">
        <Container maxWidth="lg">
          <Breadcrumb items={[{ label: "Contact Us" }]} />
          <PageTitle>Contact Us</PageTitle>
        </Container>
      </Section>

      {/* Contact Form */}
      <Section padding="lg">
        <Container maxWidth="lg">
          <ContactForm title="Get in Touch" siteConfig={siteConfig} />
        </Container>
      </Section>
    </main>
  );
}
