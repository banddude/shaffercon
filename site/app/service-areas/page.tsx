import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import {
  AppleSection,
  AppleCard,
  AppleGrid,
} from "@/app/components/UI/AppleStyle";
import CTA from "@/app/components/CTA";
import Breadcrumb from "@/app/components/Breadcrumb";
import { Container } from "@/app/components/UI";

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
      {/* Hero Section */}
      <AppleSection
        title="Our Service Areas"
        subtitle="Shaffer Construction proudly provides expert electrical services across numerous communities in the region and statewide for multi-location projects."
        padding="xl"
      >
        <Container maxWidth="lg">
          <Breadcrumb items={[{ label: "Service Areas" }]} />
        </Container>
      </AppleSection>

      {/* How We Serve Section */}
      <AppleSection title="How We Serve California" padding="lg">
        <AppleGrid columns={2} gap="lg">
          <AppleCard
            title="Statewide Multi-Location Services"
            description="Beyond our local presence, we also provide statewide electrical services for multi-location facilities, retail chains, warehouses, and large-scale rollout projects throughout California. Our experienced team handles everything from LED retrofits to equipment installations across multiple sites."
          />
          <AppleCard
            title="Local Service Areas"
            description="Shaffer Construction is proud to be your local, go-to electrical service provider across the diverse and vibrant communities of the Greater Los Angeles area. From the bustling streets of Hollywood to the serene neighborhoods of Santa Clarita, our team is dedicated to delivering top-tier electrical solutions tailored to the unique needs of each locality we serve."
          />
          <AppleCard
            title="Local Excellence, Statewide Capability"
            description="Our commitment goes beyond just wires and circuits; we're part of the communities we work in. We know the local building codes, the common electrical challenges faced by residents and businesses, and the importance of reliable, safe power."
          />
          <AppleCard
            title="Call (323) 642-8509 Monday-Friday 8:00am-5:00pm"
            description="We specialize in large-scale electrical projects across California. Select your location below to explore the specific electrical services we offer in your area, or contact us for a free consultation for statewide services."
          />
        </AppleGrid>
      </AppleSection>

      {/* Service Areas Grid */}
      {locations && locations.length > 0 && (
        <AppleSection
          title="Areas We Serve"
          subtitle="Select your location below to explore the specific electrical services we offer in your area:"
          padding="lg"
        >
          <AppleGrid columns={3} gap="lg">
            {locations.map(location => (
              <AppleCard
                key={location.location_slug}
                title={location.location_name}
                description={`Professional electrical services in ${location.location_name} and surrounding areas.`}
                href={`/service-areas/${location.location_slug}`}
                cta="View Services"
              />
            ))}
          </AppleGrid>
        </AppleSection>
      )}

      <CTA />
    </main>
  );
}
