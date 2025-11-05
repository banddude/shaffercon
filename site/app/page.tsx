import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { theme } from "@/app/styles/theme";
import { ASSET_PATH } from "@/app/config";
import {
  AppleHero,
  AppleSection,
  AppleCard,
  AppleGrid,
  AppleButton,
} from "@/app/components/UI/AppleStyle";
import { Paragraph, SectionHeading, Subheading } from "@/app/components/UI";
import { HomeStatsSection } from "@/app/components/HomeStatsSection";
import { SlowMotionVideo } from "@/app/components/SlowMotionVideo";
import CTA from "@/app/components/CTA";
import { Zap, Home as HomeIcon, Lightbulb } from "lucide-react";

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

  // Reorder content sections to: Professional, Commercial EV, Residential EV
  const orderedContentSections = [
    contentSections.find((s: any) => s.heading.includes("Professional Electrical")),
    contentSections.find((s: any) => s.heading.includes("Commercial EV")),
    contentSections.find((s: any) => s.heading.includes("Residential EV")),
  ].filter(Boolean); // Remove any undefined sections

  // Get unique service types for features
  const serviceTypes = [
    {
      title: "Commercial EV Charging",
      description: "Enterprise-grade charging solutions for business fleets and commercial properties.",
      icon: <Zap className="w-16 h-16" style={{ color: "var(--primary)" }} strokeWidth={2} />,
      href: "/commercial-ev-chargers",
    },
    {
      title: "Residential EV Charging",
      description: "Home charging stations for electric vehicles with expert installation.",
      icon: <HomeIcon className="w-16 h-16" style={{ color: "var(--primary)" }} strokeWidth={2} />,
      href: "/residential-ev-charger",
    },
    {
      title: "LED Retrofit",
      description: "Modern, energy-efficient LED lighting upgrades for homes and businesses.",
      icon: <Lightbulb className="w-16 h-16" style={{ color: "var(--primary)" }} strokeWidth={2} />,
      href: "/led-retrofit",
    },
  ];

  return (
    <main className="w-full overflow-hidden">
      {/* Hero Section */}
      {heroSection && heroSection.heading && (
        <AppleHero
          title={heroSection.heading}
          subtitle={heroSection.content}
          image={heroSection.image_url ? ASSET_PATH(heroSection.image_url) : undefined}
          showLogo={true}
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

      {/* Why Choose Section - no video */}
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

      {/* Services Showcase Section - with video background */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "80vh" }}>
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <SlowMotionVideo
            src={ASSET_PATH("/ev-charging.mp4")}
            playbackRate={0.8}
            brightness={0.4}
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 z-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} />

        {/* Content */}
        <div className="relative z-10 w-full py-12 sm:py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight mb-4"
                style={{ color: "#ffffff" }}
              >
                Our Services
              </h2>
              <p
                className="text-base leading-relaxed max-w-3xl mx-auto"
                style={{ color: "#d1d5db" }}
              >
                Industry-leading electrical solutions for residential and commercial properties
              </p>
            </div>

            {/* Grid */}
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
          </div>
        </div>
      </section>

      {/* Content Sections - specific order with videos */}
      {orderedContentSections.map((section: any, idx: number) => {
        // Match by section heading name, not index
        const isProfessional = section.heading.includes("Professional Electrical");
        const isCommercialEV = section.heading.includes("Commercial EV");
        const isResidentialEV = section.heading.includes("Residential EV");

        // Professional Electrical Services - no video (should be FIRST)
        if (isProfessional) {
          return (
            <AppleSection
              key={idx}
              title={section.heading}
              padding="lg"
            >
              <div className="max-w-4xl mx-auto">
                <Paragraph>{section.content}</Paragraph>
              </div>
            </AppleSection>
          );
        }

        // Commercial EV - with video (should be SECOND)
        if (isCommercialEV) {
          return (
            <section key={idx} className="relative w-full overflow-hidden" style={{ minHeight: "60vh" }}>
              {/* Video Background */}
              <div className="absolute inset-0 z-0">
                <SlowMotionVideo
                  src={ASSET_PATH("/commercial-ev-hero.mp4")}
                  playbackRate={0.8}
                  brightness={0.4}
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 z-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} />

              {/* Content */}
              <div className="relative z-10 w-full py-12 sm:py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                  {/* Section Header */}
                  <div className="text-center mb-8">
                    <h2
                      className="text-2xl sm:text-3xl font-bold tracking-tight mb-4"
                      style={{ color: "#ffffff" }}
                    >
                      {section.heading}
                    </h2>
                  </div>

                  {/* Content */}
                  <div className="max-w-4xl mx-auto">
                    <Paragraph style={{ color: "#d1d5db" }}>{section.content}</Paragraph>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // Residential EV - no video (should be THIRD)
        if (isResidentialEV) {
          return (
            <AppleSection
              key={idx}
              title={section.heading}
              padding="lg"
            >
              <div className="max-w-4xl mx-auto">
                <Paragraph>{section.content}</Paragraph>
              </div>
            </AppleSection>
          );
        }

        // Any remaining sections - no video
        return (
          <AppleSection
            key={idx}
            title={section.heading}
            padding="lg"
          >
            <div className="max-w-4xl mx-auto">
              <Paragraph>{section.content}</Paragraph>
            </div>
          </AppleSection>
        );
      })}

      {/* CTA Section */}
      <CTA
        heading="Ready to Get Started?"
        text="Contact us today for a free consultation and quote on your electrical project"
        buttonText="Schedule Your Free Consultation"
        buttonHref="/contact-us"
      />
    </main>
  );
}
