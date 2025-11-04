import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { theme } from "@/app/styles/theme";
import {
  AppleHero,
  AppleSection,
  AppleCard,
  AppleGrid,
  AppleButton,
} from "@/app/components/UI/AppleStyle";
import { Paragraph, SectionHeading, Subheading } from "@/app/components/UI";
import { HomeStatsSection } from "@/app/components/HomeStatsSection";

// Get homepage data
async function getHomePage() {
  const db = getDb();
  const page = db.prepare(`
    SELECT p.id, p.slug, p.title, p.date, p.meta_title, p.meta_description, p.canonical_url, p.og_image
    FROM pages_all p
    WHERE p.slug = 'home'
  `).get() as any;

  if (!page) return null;

  const sections = db.prepare(`
    SELECT section_type, heading, content, image_url
    FROM page_sections
    WHERE page_id = ?
    ORDER BY section_order
  `).all(page.id) as Array<{
    section_type: string;
    heading: string;
    content: string;
    image_url?: string;
  }>;

  return {
    ...page,
    sections,
  };
}

// Get featured services for showcase
async function getFeaturedServices() {
  const db = getDb();
  return db.prepare(`
    SELECT DISTINCT service_name, service_type
    FROM service_pages
    WHERE service_type IN ('commercial_ev', 'residential_ev', 'led_retrofit')
    LIMIT 6
  `).all() as Array<{
    service_name: string;
    service_type: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();

  if (!page) {
    return {
      title: "Home",
    };
  }

  return {
    title: page.meta_title || page.title,
    description: page.meta_description || '',
    openGraph: page.og_image
      ? {
          images: [page.og_image],
        }
      : undefined,
  };
}

export default async function Home() {
  const page = await getHomePage();
  const services = await getFeaturedServices();

  if (!page) {
    notFound();
  }

  const heroSection = page.sections?.find((s: any) => s.section_type === 'hero');
  const fullContentSection = page.sections?.find((s: any) => s.section_type === 'full_content');
  const contentSections = page.sections?.filter((s: any) => s.section_type === 'content') || [];

  // Get unique service types for features
  const serviceTypes = [
    {
      title: "Commercial EV Charging",
      description: "Enterprise-grade charging solutions for business fleets and commercial properties.",
      icon: "⚡",
      href: "/commercial-ev-chargers",
    },
    {
      title: "Residential EV Charging",
      description: "Home charging stations for electric vehicles with expert installation.",
      icon: "🏠",
      href: "/residential-ev-charger",
    },
    {
      title: "LED Retrofit",
      description: "Modern, energy-efficient LED lighting upgrades for homes and businesses.",
      icon: "💡",
      href: "/led-retrofit",
    },
  ];

  return (
    <main className="w-full overflow-hidden" style={{ marginTop: "-80px" }}>
      {/* Hero Section */}
      {heroSection && heroSection.heading && (
        <AppleHero
          title={heroSection.heading}
          subtitle={heroSection.content || "Leading electrical contractor in Los Angeles"}
          image={heroSection.image_url}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <AppleButton href="/contact-us" variant="primary" size="lg">
              Get a Free Quote
            </AppleButton>
            <AppleButton href="/service-areas" variant="secondary" size="lg">
              View Our Services
            </AppleButton>
          </div>
        </AppleHero>
      )}

      {/* Services Showcase Section */}
      <AppleSection
        title="Our Services"
        subtitle="Industry-leading electrical solutions for residential and commercial properties"
        padding="lg"
      >
        <AppleGrid columns={3} gap="lg">
          {serviceTypes.map((service, idx) => (
            <AppleCard
              key={idx}
              title={service.title}
              description={service.description}
              icon={service.icon}
              href={service.href}
              cta="Explore"
            />
          ))}
        </AppleGrid>
      </AppleSection>

      {/* Why Choose Section */}
      {fullContentSection?.content && (
        <AppleSection
          title="Why Choose Shaffer Construction?"
          padding="lg"
        >
          <div className="max-w-4xl mx-auto">
            <Paragraph className="text-center text-lg">
              {fullContentSection.content}
            </Paragraph>
            <HomeStatsSection />
          </div>
        </AppleSection>
      )}

      {/* Content Sections */}
      {contentSections.map((section: any, idx: number) => (
        <AppleSection
          key={idx}
          title={section.heading}
          padding="lg"
        >
          <div className="max-w-4xl mx-auto">
            <Paragraph>{section.content}</Paragraph>
          </div>
        </AppleSection>
      ))}

      {/* CTA Section */}
      <AppleSection
        title="Ready to Get Started?"
        subtitle="Contact us today for a free consultation and quote on your electrical project"
        padding="xl"
      >
        <div className="text-center">
          <AppleButton href="/contact-us" variant="primary" size="lg">
            Schedule Your Free Consultation
          </AppleButton>
        </div>
      </AppleSection>
    </main>
  );
}
