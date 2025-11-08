import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { ASSET_PATH } from "@/app/config";
import { AppleButton } from "@/app/components/UI/AppleStyle";
import { SectionHeading, Paragraph } from "@/app/components/UI";
import CTA from "@/app/components/CTA";
import ServiceAreasMapWrapper from "@/app/components/ServiceAreasMapWrapper";
import { Phone, MapPin, Building2, Zap } from "lucide-react";

type ServiceLocation = {
  location_name: string;
  location_slug: string;
};

// Get all location pages from database
async function getLocations(): Promise<ServiceLocation[]> {
  const db = getDb();
  const locations = db.prepare(`
    SELECT location_name, location_slug
    FROM location_pages
    ORDER BY location_name
  `).all() as ServiceLocation[];

  return locations;
}

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://banddude.github.io/shaffercon';
  const url = `${baseUrl}/service-areas`;
  const title = "Service Areas - Los Angeles County Electrical Services | Shaffer Construction";
  const description = "Professional electrical services across Los Angeles County and statewide multi-location facilities. Serving 22+ communities with expert EV charging installation, commercial and residential electrical work.";

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
export default async function ServiceAreasPage() {
  const locations = await getLocations();

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
            aria-label="Professional electrical services across Los Angeles"
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
              Our Service Areas
            </h1>
            <p className="text-xl mb-8" style={{ color: "#d1d5db" }}>
              Professional electrical services across Los Angeles County and statewide multi-location facilities
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <AppleButton href="tel:(323) 642-8509" variant="primary" size="lg">
                <Phone className="w-5 h-5 mr-2" />
                Call (323) 642-8509
              </AppleButton>
              <AppleButton href="/contact-us" variant="secondary" size="lg">
                Get Free Quote
              </AppleButton>
            </div>
          </div>
        </div>
      </section>

      {/* How We Serve Section */}
      <section className="py-12 sm:py-20 lg:py-28 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <SectionHeading className="text-center mb-12">How We Serve California</SectionHeading>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Statewide Services */}
            <div className="p-8 rounded-2xl" style={{ background: "var(--section-gray)", border: "1px solid var(--section-border)" }}>
              <Building2 className="w-12 h-12 mb-4" style={{ color: "var(--primary)" }} />
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>
                Statewide Multi-Location Services
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: "var(--secondary)" }}>
                Beyond our local presence, we provide statewide electrical services for multi-location facilities, retail chains, warehouses, and large-scale rollout projects throughout California. Our experienced team handles everything from LED retrofits to equipment installations across multiple sites.
              </p>
            </div>

            {/* Local Services */}
            <div className="p-8 rounded-2xl" style={{ background: "var(--section-gray)", border: "1px solid var(--section-border)" }}>
              <MapPin className="w-12 h-12 mb-4" style={{ color: "var(--primary)" }} />
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>
                Local Service Areas
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: "var(--secondary)" }}>
                Shaffer Construction is your local, go-to electrical service provider across the diverse and vibrant communities of Greater Los Angeles. From Hollywood to Santa Clarita, our team delivers top-tier electrical solutions tailored to each locality we serve.
              </p>
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="p-8 rounded-2xl" style={{ background: "var(--section-gray)", border: "1px solid var(--section-border)" }}>
              <Zap className="w-12 h-12 mb-4" style={{ color: "var(--primary)" }} />
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>
                Local Excellence, Statewide Capability
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: "var(--secondary)" }}>
                Our commitment goes beyond wires and circuits. We're part of the communities we work in. We know local building codes, common electrical challenges, and the importance of reliable, safe power.
              </p>
            </div>

            <div className="p-8 rounded-2xl" style={{ background: "var(--section-gray)", border: "1px solid var(--section-border)" }}>
              <Phone className="w-12 h-12 mb-4" style={{ color: "var(--primary)" }} />
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>
                Call (323) 642-8509
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: "var(--secondary)" }}>
                Monday-Friday 8:00am-5:00pm. We specialize in large-scale electrical projects across California. Select your location below to explore specific services, or contact us for a free statewide consultation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      {locations && locations.length > 0 && (
        <section className="py-12 sm:py-20 lg:py-28 px-6 sm:px-8 lg:px-12" style={{ background: "var(--section-gray)" }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeading className="text-center mb-8">Explore Our Service Areas</SectionHeading>
            <Paragraph className="text-center text-lg mb-12 max-w-3xl mx-auto">
              Click on any location pin to view services in that area
            </Paragraph>
            <ServiceAreasMapWrapper locations={locations} />
          </div>
        </section>
      )}

      {/* Service Areas Grid */}
      {locations && locations.length > 0 && (
        <section className="py-12 sm:py-20 lg:py-28 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <SectionHeading className="text-center mb-8">All Service Areas</SectionHeading>
            <Paragraph className="text-center text-lg mb-12 max-w-3xl mx-auto">
              Browse our complete list of service areas below
            </Paragraph>

            <div className="grid md:grid-cols-3 gap-6">
              {locations.map(location => (
                <a
                  key={location.location_slug}
                  href={`/service-areas/${location.location_slug}`}
                  className="block p-6 rounded-lg transition-all hover:translate-y-[-4px] group"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--section-border)",
                    textDecoration: "none"
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold" style={{ color: "var(--text)" }}>
                      {location.location_name}
                    </h3>
                    <MapPin className="w-6 h-6" style={{ color: "var(--primary)" }} />
                  </div>
                  <p className="text-base mb-4" style={{ color: "var(--secondary)" }}>
                    Professional electrical services in {location.location_name} and surrounding areas
                  </p>
                  <span className="text-base font-semibold group-hover:translate-x-1 inline-flex items-center transition-transform" style={{ color: "var(--primary)" }}>
                    View Services →
                  </span>
                </a>
              ))}

              {/* And More Card */}
              <div
                className="p-6 rounded-lg flex flex-col items-center justify-center text-center"
                style={{
                  background: "var(--background)",
                  border: "2px dashed var(--section-border)",
                }}
              >
                <Zap className="w-12 h-12 mb-4" style={{ color: "var(--primary)" }} />
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
                  And More!
                </h3>
                <p className="text-base" style={{ color: "var(--secondary)" }}>
                  We serve additional areas throughout Los Angeles County and statewide
                </p>
                <a
                  href="/contact-us"
                  className="mt-4 text-base font-semibold inline-flex items-center"
                  style={{ color: "var(--primary)" }}
                >
                  Contact Us →
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      <CTA />
    </main>
  );
}
