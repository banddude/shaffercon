import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { Section, Container, PageTitle, SectionHeading, Paragraph, Grid, GridItem } from "@/app/components/UI";
import CTA from "@/app/components/CTA";
import LinkCardGrid from "@/app/components/LinkCardGrid";
import Breadcrumb from "@/app/components/Breadcrumb";

// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

interface PageProps {
  params: Promise<{
    location: string;
  }>;
}

// Generate static params for all location pages
export async function generateStaticParams() {
  const db = getDb();
  const locations = db.prepare(`
    SELECT DISTINCT location_slug
    FROM location_pages
  `).all() as Array<{ location_slug: string }>;

  return locations.map(({ location_slug }) => ({
    location: location_slug,
  }));
}

// Get location page data
async function getLocationPage(locationSlug: string) {
  const db = getDb();
  const page = db.prepare(`
    SELECT p.id, p.slug, p.title, p.date, p.meta_title, p.meta_description, p.canonical_url, p.og_image,
           lp.id as location_id, lp.location_name, lp.location_slug, lp.tagline,
           lp.about_paragraph_1, lp.about_paragraph_2,
           lp.residential_intro, lp.commercial_intro, lp.closing_cta
    FROM pages_all p
    JOIN location_pages lp ON p.id = lp.page_id
    WHERE lp.location_slug = ?
  `).get(locationSlug) as any;

  if (!page) return null;

  // Get related services
  const relatedServices = db.prepare(`
    SELECT service_name FROM location_related_services
    WHERE location_page_id = ?
    ORDER BY display_order
  `).all(page.location_id) as Array<{ service_name: string }>;

  // Get nearby areas
  const nearbyAreas = db.prepare(`
    SELECT area_name, area_slug FROM location_nearby_areas
    WHERE location_page_id = ?
    ORDER BY display_order
  `).all(page.location_id) as Array<{ area_name: string; area_slug: string }>;

  // Hardcoded list of all residential services
  const residentialServices = [
    { service_name: 'backup-generator-installation', service_type: 'residential' },
    { service_name: 'breaker-panel-service-maintenance', service_type: 'residential' },
    { service_name: 'ceiling-fan-fixture-installation', service_type: 'residential' },
    { service_name: 'complete-electrical-rewiring', service_type: 'residential' },
    { service_name: 'data-network-av-wiring', service_type: 'residential' },
    { service_name: 'dedicated-equipment-circuits', service_type: 'residential' },
    { service_name: 'electrical-code-compliance-corrections', service_type: 'residential' },
    { service_name: 'electrical-panel-upgrades', service_type: 'residential' },
    { service_name: 'electrical-safety-inspections', service_type: 'residential' },
    { service_name: 'electrical-troubleshooting-repairs', service_type: 'residential' },
    { service_name: 'energy-efficiency-upgrades', service_type: 'residential' },
    { service_name: 'ev-charger-installation', service_type: 'residential' },
    { service_name: 'exhaust-fan-ventilation-wiring', service_type: 'residential' },
    { service_name: 'landscape-outdoor-lighting', service_type: 'residential' },
    { service_name: 'lighting-installation-retrofitting', service_type: 'residential' },
    { service_name: 'outlet-switch-dimmer-services', service_type: 'residential' },
    { service_name: 'pool-hot-tub-spa-electrical', service_type: 'residential' },
    { service_name: 'security-motion-lighting', service_type: 'residential' },
    { service_name: 'smart-automation-systems', service_type: 'residential' },
    { service_name: 'whole-building-surge-protection', service_type: 'residential' },
  ];

  // Hardcoded list of all commercial services
  const commercialServices = [
    { service_name: 'backup-generator-installation', service_type: 'commercial' },
    { service_name: 'breaker-panel-service-maintenance', service_type: 'commercial' },
    { service_name: 'ceiling-fan-fixture-installation', service_type: 'commercial' },
    { service_name: 'complete-electrical-rewiring', service_type: 'commercial' },
    { service_name: 'data-network-av-wiring', service_type: 'commercial' },
    { service_name: 'dedicated-equipment-circuits', service_type: 'commercial' },
    { service_name: 'electrical-code-compliance-corrections', service_type: 'commercial' },
    { service_name: 'electrical-panel-upgrades', service_type: 'commercial' },
    { service_name: 'electrical-safety-inspections', service_type: 'commercial' },
    { service_name: 'electrical-troubleshooting-repairs', service_type: 'commercial' },
    { service_name: 'energy-efficiency-upgrades', service_type: 'commercial' },
    { service_name: 'ev-charger-installation', service_type: 'commercial' },
    { service_name: 'exhaust-fan-ventilation-wiring', service_type: 'commercial' },
    { service_name: 'landscape-outdoor-lighting', service_type: 'commercial' },
    { service_name: 'lighting-installation-retrofitting', service_type: 'commercial' },
    { service_name: 'outlet-switch-dimmer-services', service_type: 'commercial' },
    { service_name: 'pool-hot-tub-spa-electrical', service_type: 'commercial' },
    { service_name: 'security-motion-lighting', service_type: 'commercial' },
    { service_name: 'smart-automation-systems', service_type: 'commercial' },
    { service_name: 'whole-building-surge-protection', service_type: 'commercial' },
  ];

  return {
    ...page,
    relatedServices: relatedServices.map(s => s.service_name),
    nearbyAreas,
    residentialServices,
    commercialServices,
  };
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { location } = await params;
  const page = await getLocationPage(location);

  if (!page) {
    return {
      title: "Location Not Found",
    };
  }

  const baseUrl = 'https://banddude.github.io/shaffercon';
  const url = `${baseUrl}/service-areas/${location}`;
  const title = page.meta_title || page.title;
  const description = page.meta_description || page.tagline || '';

  return {
    title,
    description,
    alternates: {
      canonical: page.canonical_url || url,
    },
    openGraph: {
      title,
      description,
      url: page.canonical_url || url,
      siteName: 'Shaffer Construction',
      locale: 'en_US',
      type: 'website',
      images: page.og_image ? [page.og_image] : [`${baseUrl}/og-image.jpg`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: page.og_image ? [page.og_image] : [`${baseUrl}/og-image.jpg`],
    },
  };
}

// Page component
export default async function LocationPage({ params }: PageProps) {
  const { location } = await params;
  const page = await getLocationPage(location);

  if (!page) {
    notFound();
  }

  return (
    <main className="w-full">
      {/* Hero Section */}
      <Section border="bottom">
        <Container>
          <Breadcrumb
            items={[
              { label: "Service Areas", href: "/service-areas" },
              { label: page.location_name }
            ]}
          />
          <PageTitle>{page.title}</PageTitle>
          {page.tagline && (
            <p className="text-base leading-relaxed mt-4">{page.tagline}</p>
          )}
        </Container>
      </Section>

      {/* About Section */}
      <Section padding="md">
        <Container maxWidth="lg">
          {page.about_paragraph_1 && (
            <Paragraph>{page.about_paragraph_1}</Paragraph>
          )}
          {page.about_paragraph_2 && (
            <Paragraph>{page.about_paragraph_2}</Paragraph>
          )}
        </Container>
      </Section>

      {/* Residential Services */}
      {page.residentialServices && page.residentialServices.length > 0 && (
        <Section padding="md">
          <Container maxWidth="lg">
            <SectionHeading>Residential Electrical Services</SectionHeading>
            {page.residential_intro && (
              <Paragraph>{page.residential_intro}</Paragraph>
            )}
            <LinkCardGrid
              items={page.residentialServices.map((service: any) => {
                // Map slugs to proper display names
                const displayNames: { [key: string]: string } = {
                  'electrical-troubleshooting-repairs': 'Electrical Troubleshooting & Repairs',
                  'pool-hot-tub-spa-electrical': 'Pool, Hot Tub & Spa Electrical',
                  'data-network-av-wiring': 'Data, Network & AV Wiring',
                };

                const defaultLabel = service.service_name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

                return {
                  label: displayNames[service.service_name] || defaultLabel,
                  href: `/service-areas/${location}/residential-${service.service_name}`,
                };
              })}
              columns={3}
            />
          </Container>
        </Section>
      )}

      {/* Commercial Services */}
      {page.commercialServices && page.commercialServices.length > 0 && (
        <Section padding="md">
          <Container maxWidth="lg">
            <SectionHeading>Commercial Electrical Services</SectionHeading>
            {page.commercial_intro && (
              <Paragraph>{page.commercial_intro}</Paragraph>
            )}
            <LinkCardGrid
              items={page.commercialServices.map((service: any) => {
                // Map slugs to proper display names
                const displayNames: { [key: string]: string } = {
                  'electrical-troubleshooting-repairs': 'Electrical Troubleshooting & Repairs',
                  'pool-hot-tub-spa-electrical': 'Pool, Hot Tub & Spa Electrical',
                  'data-network-av-wiring': 'Data, Network & AV Wiring',
                };

                const defaultLabel = service.service_name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

                return {
                  label: displayNames[service.service_name] || defaultLabel,
                  href: `/service-areas/${location}/commercial-${service.service_name}`,
                };
              })}
              columns={3}
            />
          </Container>
        </Section>
      )}

      {/* Related Services */}
      {page.relatedServices && page.relatedServices.length > 0 && (
        <Section padding="md">
          <Container maxWidth="lg">
            <SectionHeading>Featured Services</SectionHeading>
            <LinkCardGrid
              items={page.relatedServices.map((service: string) => {
                // Extract service type and name from format like "Residential Outlet Switch Dimmer Services"
                const parts = service.split(' ');
                const serviceType = parts[0].toLowerCase(); // "residential" or "commercial"

                // Create a mapping of display names to actual slugs
                const displayNameToSlug: { [key: string]: string } = {
                  'Backup Generator Installation': 'backup-generator-installation',
                  'Breaker Panel Service Maintenance': 'breaker-panel-service-maintenance',
                  'Ceiling Fan Fixture Installation': 'ceiling-fan-fixture-installation',
                  'Complete Electrical Rewiring': 'complete-electrical-rewiring',
                  'Data Network Av Wiring': 'data-network-av-wiring',
                  'Data Network AV Wiring': 'data-network-av-wiring',
                  'Dedicated Equipment Circuits': 'dedicated-equipment-circuits',
                  'Electrical Code Compliance Corrections': 'electrical-code-compliance-corrections',
                  'Electrical Panel Upgrades': 'electrical-panel-upgrades',
                  'Electrical Safety Inspections': 'electrical-safety-inspections',
                  'Electrical Troubleshooting Repairs': 'electrical-troubleshooting-repairs',
                  'Energy Efficiency Upgrades': 'energy-efficiency-upgrades',
                  'Ev Charger Installation': 'ev-charger-installation',
                  'EV Charger Installation': 'ev-charger-installation',
                  'Exhaust Fan Ventilation Wiring': 'exhaust-fan-ventilation-wiring',
                  'Landscape Outdoor Lighting': 'landscape-outdoor-lighting',
                  'Lighting Installation Retrofitting': 'lighting-installation-retrofitting',
                  'Outlet Switch Dimmer Services': 'outlet-switch-dimmer-services',
                  'Pool Hot Tub Spa Electrical': 'pool-hot-tub-spa-electrical',
                  'Security Motion Lighting': 'security-motion-lighting',
                  'Smart Automation Systems': 'smart-automation-systems',
                  'Whole Building Surge Protection': 'whole-building-surge-protection',
                };

                const displayName = parts.slice(1).join(' ');
                const serviceName = displayNameToSlug[displayName] || parts.slice(1).join(' ').toLowerCase().replace(/\s+/g, '-');

                return {
                  label: service,
                  href: `/service-areas/${location}/${serviceType}-${serviceName}`,
                };
              })}
              columns={2}
            />
          </Container>
        </Section>
      )}

      {/* Nearby Areas */}
      {page.nearbyAreas && page.nearbyAreas.length > 0 && (
        <Section padding="md">
          <Container maxWidth="lg">
            <SectionHeading>Other Areas We Serve</SectionHeading>
            <LinkCardGrid
              items={page.nearbyAreas.map((area: any) => ({
                label: area.area_name,
                href: `/service-areas/${area.area_slug}`,
              }))}
              columns={3}
            />
          </Container>
        </Section>
      )}

      {/* Contact CTA */}
      <CTA
        heading={`Need Electrical Services in ${page.location_name}?`}
        text="Contact us today for a free estimate!"
        buttonText="Get Free Estimate"
        buttonHref="/contact-us"
      />
    </main>
  );
}
