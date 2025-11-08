import type { Metadata } from "next";
import CTA from "@/app/components/CTA";
import { Section, Container, SectionHeading, Paragraph } from "@/app/components/UI";
import { AppleButton, AppleCard, AppleGrid } from "@/app/components/UI/AppleStyle";
import { ASSET_PATH } from "@/app/config";
import { Zap, Award, Users, Target } from "lucide-react";

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://banddude.github.io/shaffercon';
  const url = `${baseUrl}/about-us`;
  const title = "About Us - Los Angeles Electrical Contractor | Shaffer Construction";
  const description = "Learn about Shaffer Construction, Southern California's premier EV charging and electrical installation experts. Serving Los Angeles County with decades of experience.";

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
export default function AboutPage() {
  const coreValues = [
    {
      title: "EV Charging Expertise",
      description: "Leading the electric future with state-of-the-art charging solutions for residential and commercial needs.",
      icon: <Zap className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
    },
    {
      title: "Decades of Experience",
      description: "Rich history in electrical installations, ensuring every project meets the highest standards of safety and efficiency.",
      icon: <Award className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
    },
    {
      title: "Southern California Roots",
      description: "Deep understanding of the region's unique needs. We're not just your contractors, we're your neighbors.",
      icon: <Users className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
    },
    {
      title: "Commitment to Excellence",
      description: "Consistently updating our skills and technologies to provide the most advanced services available.",
      icon: <Target className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
    },
  ];

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
            aria-label="Professional electrical services in Los Angeles"
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
              About Shaffer Construction
            </h1>
            <p className="text-xl mb-8" style={{ color: "#d1d5db" }}>
              Electricians Servicing Los Angeles County
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <AppleButton href="/contact-us" variant="primary" size="lg">
                Get Free Quote
              </AppleButton>
              <AppleButton href="/service-areas" variant="secondary" size="lg">
                View Services
              </AppleButton>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <Section padding="lg">
        <Container maxWidth="lg">
          <SectionHeading className="text-center mb-8">Who We Are</SectionHeading>
          <div className="max-w-4xl mx-auto space-y-6">
            <Paragraph className="text-center text-lg">
              At Shaffer Construction, we're not just builders, we're pioneers in the evolving landscape of electrical solutions. Nestled in the heart of Southern California, we've established ourselves as the premier destination for top-tier EV charging and comprehensive electrical installations.
            </Paragraph>
            <Paragraph className="text-center text-lg">
              We believe in a future where every home and business is equipped with the best electrical solutions. Our commitment is to bring this vision to life, one project at a time. By consistently updating our skills and technologies, we ensure that our clients always receive the most advanced services available.
            </Paragraph>
          </div>
        </Container>
      </Section>

      {/* Core Values Section */}
      <Section padding="lg" background="gray">
        <Container maxWidth="xl">
          <SectionHeading className="text-center mb-12">What Sets Us Apart</SectionHeading>
          <AppleGrid columns={2} gap="lg">
            {coreValues.map((value, idx) => (
              <AppleCard
                key={idx}
                title={value.title}
                description={value.description}
                icon={value.icon}
              />
            ))}
          </AppleGrid>
        </Container>
      </Section>

      {/* Closing Section */}
      <Section padding="lg">
        <Container maxWidth="lg">
          <div className="text-center max-w-3xl mx-auto">
            <Paragraph className="text-lg">
              Whether you're looking to transition to electric vehicle charging or seeking a trusted partner for your next electrical project, Shaffer Construction is here to guide you. Dive into a seamless experience, backed by expertise and a passion for excellence.
            </Paragraph>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <CTA />
    </main>
  );
}
