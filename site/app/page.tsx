import type { Metadata } from "next";
import { ASSET_PATH } from "@/app/config";
import {
  AppleHero,
  AppleSection,
  AppleCard,
  AppleGrid,
  AppleButton,
} from "@/app/components/UI/AppleStyle";
import { Paragraph } from "@/app/components/UI";
import { HomeStatsSection } from "@/app/components/HomeStatsSection";
import { SlowMotionVideo } from "@/app/components/SlowMotionVideo";
import CTA from "@/app/components/CTA";
import { Zap, Home as HomeIcon, Lightbulb, Leaf, CheckCircle, Settings, Cable, Battery, Shield, Car, ClipboardList } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://banddude.github.io/shaffercon';
  const title = "Los Angeles Electrical Contractor - EV Charging & Electrical Installations";
  const description = "Leading Los Angeles electrical contractor specializing in EV charging solutions and professional electrical services for residential and commercial properties.";

  return {
    title,
    description,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title,
      description,
      url: baseUrl,
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

export default function Home() {
  // Why Choose reasons
  const whyChooseReasons = [
    {
      title: "Energy Efficiency Solutions",
      description: "Maximize efficiency with cutting-edge EV technology, delivering cost-effective, eco-friendly energy solutions.",
      icon: <Leaf className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
    },
    {
      title: "Electrical Health Check",
      description: "Meticulous inspections ensure your EV infrastructure operates flawlessly for peak performance.",
      icon: <CheckCircle className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
    },
    {
      title: "Customized Electrical Strategy",
      description: "Tailored consultations define a strategic electrical roadmap aligned with your business objectives.",
      icon: <ClipboardList className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
    },
    {
      title: "Professional Wiring Services",
      description: "Precision wiring by expert contractors guarantees your power systems meet advanced EV technology demands.",
      icon: <Cable className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
    },
    {
      title: "EV Charger Installation Expertise",
      description: "Comprehensive installation services from planning to execution, ensuring optimal functionality.",
      icon: <Car className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
    },
    {
      title: "Electrical System Assurance",
      description: "Rigorous testing protocols confirm the reliability and efficiency of your EV systems.",
      icon: <Shield className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
    },
  ];

  // Get unique service types for features
  const serviceTypes = [
    {
      title: "Commercial EV Charging",
      description: "Enterprise-grade charging solutions for business fleets and commercial properties.",
      icon: <Zap className="w-16 h-16" style={{ color: "var(--primary)" }} strokeWidth={2} />,
      href: "/commercial-electric-vehicle-chargers",
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
      href: "/led-retrofit-services",
    },
  ];

  return (
    <main className="w-full overflow-hidden">
      {/* Hero Section */}
      <AppleHero
        title="Los Angeles Electrical Contractor Specializing in EV Charging & Electrical Installations"
        subtitle=""
        image={ASSET_PATH("/hero-background-optimized.mp4")}
        imageAlt="Electrical contractor installing EV charging station in Los Angeles"
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

      {/* Why Choose Section - no video */}
      <AppleSection
        title="Why Choose Shaffer Construction?"
        padding="lg"
      >
        <div className="max-w-7xl mx-auto">
          <AppleGrid columns={3} gap="lg">
            {whyChooseReasons.map((reason, idx) => (
              <AppleCard
                key={idx}
                title={reason.title}
                description={reason.description}
                icon={reason.icon}
              />
            ))}
          </AppleGrid>
          <div className="mt-16">
            <HomeStatsSection />
          </div>
        </div>
      </AppleSection>

      {/* Services Showcase Section - with video background */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "80vh" }}>
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <SlowMotionVideo
            src={ASSET_PATH("/ev-charging.mp4")}
            ariaLabel="Electric vehicle charging at modern charging station"
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

      {/* Professional Electrical Services Section - no video (FIRST) */}
      <AppleSection
        title="Professional Electrical Services"
        padding="lg"
      >
        <div className="max-w-4xl mx-auto">
          <Paragraph>At Shaffer Construction, we deliver comprehensive electrical services for both residential and commercial clients in Los Angeles. Our expert team handles everything from straightforward installations to complex upgrades, ensuring your spaces are safe, efficient, and up-to-date. We prioritize quality and safety, meticulously managing every project to guarantee that your electrical systems are not only operational but also conform to the latest safety standards. Rely on Shaffer Construction for dependable and skilled electrical services.</Paragraph>
        </div>
      </AppleSection>

      {/* Commercial EV Charging Solutions - with video (SECOND) */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "60vh" }}>
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <SlowMotionVideo
            src={ASSET_PATH("/commercial-ev-hero.mp4")}
            ariaLabel="Commercial EV charging infrastructure installation in progress"
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
                Commercial EV Charging Solutions
              </h2>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto">
              <p className="text-lg leading-relaxed mb-6" style={{ color: "#d1d5db" }}>Shaffer Construction, Inc. leads in commercial EV charging solutions in Los Angeles. We provide custom installations and advanced electrical upgrades for all business types. This ensures your business stays at the forefront of the electric vehicle revolution. Our services as a Los Angeles Electrical Contractor include thorough site analysis and strategic planning for smart-charging technology integration. This positions your business as a leader in EV infrastructure. From initial consultation to ongoing support, we guarantee reliable, high-performance EV charging stations. This enhances efficiency and customer experience, making your commercial property a model of sustainable investment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Residential EV Chargers - no video (THIRD) */}
      <AppleSection
        title="Residential EV Chargers"
        padding="lg"
      >
        <div className="max-w-4xl mx-auto">
          <Paragraph>At Shaffer Construction, Inc., we specialize in installing residential EV chargers in Los Angeles, making the switch to electric vehicles effortless for homeowners. We tailor each installation to your home's unique energy needs and vehicle requirements. Our team ensures efficient, reliable charging solutions compatible with various electric vehicles. We focus on installations that blend seamlessly with your home's design and power systems, ensuring durability and convenience. Beyond installation, we provide continuous support, ensuring your EV charging station remains efficient and effective. Count on us for an easy, efficient home EV charging experience.</Paragraph>
        </div>
      </AppleSection>

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
