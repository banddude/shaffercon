import type { Metadata } from "next";
import { ASSET_PATH } from "@/app/config";
import CTA from "@/app/components/CTA";
import { Section, Container, SectionHeading, Paragraph } from "@/app/components/UI";
import { AppleHero, AppleButton, AppleCard, AppleGrid } from "@/app/components/UI/AppleStyle";
import { BreadcrumbSchema } from "@/app/components/schemas/BreadcrumbSchema";
import { Zap, Droplets, Home, Layers, PaintBucket, DoorOpen, CloudRain } from "lucide-react";

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = "https://shaffercon.com";
  const url = `${baseUrl}/realtors`;
  const title = "Repair Estimates for Real Estate Agents | Shaffer Construction";
  const description =
    "Licensed LA electricians for escrow repair estimates. Honest numbers, fast turnaround for realtors and clients. Free quote: (323) 642-8509.";

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
      siteName: "Shaffer Construction",
      locale: "en_US",
      type: "website",
      images: [`${baseUrl}/og-image.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
  };
}

const coveredItems = [
  {
    title: "Electrical",
    description: "Full electrical inspections and repair cost assessments handled directly by our licensed electricians.",
    icon: <Zap className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
  },
  {
    title: "Plumbing",
    description: "Plumbing condition review and repair cost estimates coordinated with trusted subs.",
    icon: <Droplets className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
  },
  {
    title: "Roofing",
    description: "Roof condition assessment with honest repair or replacement cost estimates.",
    icon: <CloudRain className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
  },
  {
    title: "Framing & Structural",
    description: "Structural evaluation to identify issues and provide accurate remediation costs.",
    icon: <Home className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
  },
  {
    title: "Stucco & Exterior",
    description: "Exterior condition review covering stucco, siding, and surface damage estimates.",
    icon: <Layers className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
  },
  {
    title: "Interior Paint",
    description: "Interior paint scope and cost estimate so there are no surprises after close.",
    icon: <PaintBucket className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
  },
  {
    title: "Doors & Windows",
    description: "Assessment of door and window conditions with repair or replacement pricing.",
    icon: <DoorOpen className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
  },
];

// Page component
export default function RealtorsPage() {
  return (
    <main className="w-full">
      <BreadcrumbSchema
        items={[
          { label: "Home", href: "/" },
          { label: "For Realtors" },
        ]}
      />

      {/* Hero Section */}
      <AppleHero
        title="Repair Estimates for Real Estate Agents"
        subtitle="Honest numbers during escrow — no padding, no upselling."
        image={ASSET_PATH("/hero-background-optimized.mp4")}
        imageAlt="Shaffer Construction repair estimates for real estate agents"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <AppleButton href="/contact-us/" variant="primary" size="lg">
            Request an Estimate
          </AppleButton>
          <AppleButton href="tel:3236428509" variant="secondary" size="lg">
            Call (323) 642-8509
          </AppleButton>
        </div>
      </AppleHero>

      {/* Who We Help Section */}
      <Section padding="lg">
        <Container maxWidth="lg">
          <SectionHeading className="mb-8">Who We Help</SectionHeading>
          <div className="max-w-4xl space-y-6">
            <Paragraph className="text-lg">
              Whether you&apos;re representing a buyer who wants a realistic repair credit or a seller getting hit with an inflated ask, we can help you get to an honest number before the deal falls apart.
            </Paragraph>
            <Paragraph className="text-lg">
              We&apos;re licensed electricians and general contractors based in East LA and Silver Lake. We do repair estimates during escrow — a straightforward walkthrough of the property, written up clearly so you and your clients know what things actually cost to fix. No padding, no upselling.
            </Paragraph>
            <Paragraph className="text-lg">
              We handle electrical directly and coordinate with trusted subs for everything else. Fast turnaround so you&apos;re not holding up your close.
            </Paragraph>
          </div>
        </Container>
      </Section>

      {/* What's Covered Section */}
      <section className="py-12 sm:py-20 lg:py-28" style={{ background: "var(--section-gray)" }}>
        <Container maxWidth="xl">
          <SectionHeading className="text-center mb-12">What&apos;s Covered</SectionHeading>
          <AppleGrid columns={3} gap="lg">
            {coveredItems.map((item, idx) => (
              <AppleCard
                key={idx}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </AppleGrid>
        </Container>
      </section>

      {/* CTA Section */}
      <CTA
        heading="Get an Estimate"
        text="Call or text (323) 642-8509, or reach out through the contact form."
        buttonText="Contact Us"
        buttonHref="/contact-us"
      />
    </main>
  );
}
