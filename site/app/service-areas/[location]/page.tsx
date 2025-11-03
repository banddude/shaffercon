import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { Section, Container, PageTitle, SectionHeading, Paragraph, Grid, GridItem } from "@/app/components/UI";
import CTA from "@/app/components/CTA";
import LinkCardGrid from "@/app/components/LinkCardGrid";

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

  // Get all residential services for this location
  const residentialServices = db.prepare(`
    SELECT service_name, service_type FROM service_pages
    WHERE location = ? AND service_type = 'residential'
    ORDER BY service_name
    LIMIT 20
  `).all(locationSlug) as Array<{ service_name: string; service_type: string }>;

  // Get all commercial services for this location
  const commercialServices = db.prepare(`
    SELECT service_name, service_type FROM service_pages
    WHERE location = ? AND service_type = 'commercial'
    ORDER BY service_name
    LIMIT 20
  `).all(locationSlug) as Array<{ service_name: string; service_type: string }>;

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
              items={page.residentialServices.map((service: any) => ({
                label: service.service_name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                href: `/service-areas/${location}/residential-${service.service_name}`,
              }))}
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
              items={page.commercialServices.map((service: any) => ({
                label: service.service_name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                href: `/service-areas/${location}/commercial-${service.service_name}`,
              }))}
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
            <ul className="list-disc list-inside space-y-2">
              {page.relatedServices.map((service: string, index: number) => (
                <li key={index} className="text-base">{service}</li>
              ))}
            </ul>
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
