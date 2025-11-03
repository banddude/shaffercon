import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { Section, Container, PageTitle, SectionHeading, Paragraph, ContentBox } from "@/app/components/UI";
import CTA from "@/app/components/CTA";

interface PageProps {
  params: Promise<{
    location: string;
    service: string;
  }>;
}

// Generate static params for all service detail pages
export async function generateStaticParams() {
  const db = getDb();
  const services = db.prepare(`
    SELECT DISTINCT sp.location, sp.service_type, sp.service_name
    FROM service_pages sp
  `).all() as Array<{ location: string; service_type: string; service_name: string }>;

  return services.map(({ location, service_type, service_name }) => ({
    location,
    service: `${service_type}-${service_name}`,
  }));
}

// Get service page data
async function getServicePage(location: string, service: string) {
  const [serviceType, ...serviceNameParts] = service.split('-');
  const serviceName = serviceNameParts.join('-');

  const db = getDb();
  const page = db.prepare(`
    SELECT p.id, p.slug, p.title, p.date, p.meta_title, p.meta_description, p.canonical_url, p.og_image,
           sp.id as service_id, sp.location, sp.service_type, sp.service_name,
           sp.hero_intro, sp.closing_content
    FROM pages_all p
    JOIN service_pages sp ON p.id = sp.page_id
    WHERE sp.location = ? AND sp.service_type = ? AND sp.service_name = ?
  `).get(location, serviceType, serviceName) as any;

  if (!page) return null;

  // Get benefits
  const benefits = db.prepare(`
    SELECT heading, content FROM service_benefits
    WHERE service_page_id = ?
    ORDER BY benefit_order
  `).all(page.service_id) as Array<{ heading: string; content: string }>;

  // Get offerings
  const offerings = db.prepare(`
    SELECT offering FROM service_offerings
    WHERE service_page_id = ?
    ORDER BY offering_order
  `).all(page.service_id) as Array<{ offering: string }>;

  // Get FAQs
  const faqs = db.prepare(`
    SELECT question, answer FROM service_faqs
    WHERE service_page_id = ?
    ORDER BY faq_order
  `).all(page.service_id) as Array<{ question: string; answer: string }>;

  // Get related services
  const relatedServices = db.prepare(`
    SELECT service_name FROM service_related_services
    WHERE service_page_id = ?
    ORDER BY display_order
  `).all(page.service_id) as Array<{ service_name: string }>;

  // Get nearby areas
  const nearbyAreas = db.prepare(`
    SELECT area_name FROM service_nearby_areas
    WHERE service_page_id = ?
    ORDER BY display_order
  `).all(page.service_id) as Array<{ area_name: string }>;

  return {
    ...page,
    benefits,
    offerings: offerings.map(o => o.offering),
    faqs,
    relatedServices: relatedServices.map(s => s.service_name),
    nearbyAreas: nearbyAreas.map(a => a.area_name),
  };
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { location, service } = await params;
  const page = await getServicePage(location, service);

  if (!page) {
    return {
      title: "Service Not Found",
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
export default async function ServiceDetailPage({ params }: PageProps) {
  const { location, service } = await params;
  const page = await getServicePage(location, service);

  if (!page) {
    notFound();
  }

  const locationName = location.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <main className="w-full">
      {/* Hero Section */}
      <Section border="bottom">
        <Container>
          <PageTitle>{page.title}</PageTitle>
          {page.hero_intro && (
            <p className="text-base leading-relaxed mt-4" style={{ color: "var(--secondary)" }}>{page.hero_intro}</p>
          )}
        </Container>
      </Section>

      {/* Benefits Section */}
      {page.benefits && page.benefits.length > 0 && (
        <Section padding="md">
          <Container maxWidth="lg">
            <SectionHeading>Benefits</SectionHeading>
            <div className="grid md:grid-cols-2 gap-8">
              {page.benefits.map((benefit: any, index: number) => (
                <ContentBox key={index} border padding="md">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>{benefit.heading}</h3>
                  <p className="text-base leading-relaxed" style={{ color: "var(--secondary)" }}>{benefit.content}</p>
                </ContentBox>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Offerings Section */}
      {page.offerings && page.offerings.length > 0 && (
        <Section padding="md">
          <Container maxWidth="lg">
            <SectionHeading>Our Services Include</SectionHeading>
            <ul className="list-disc list-inside space-y-2">
              {page.offerings.map((offering: string, index: number) => (
                <li key={index} className="text-base" style={{ color: "var(--secondary)" }}>{offering}</li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Closing Content */}
      {page.closing_content && (
        <Section padding="md">
          <Container maxWidth="lg">
            <Paragraph>{page.closing_content}</Paragraph>
          </Container>
        </Section>
      )}

      {/* FAQs Section */}
      {page.faqs && page.faqs.length > 0 && (
        <Section padding="md">
          <Container maxWidth="lg">
            <SectionHeading>Frequently Asked Questions</SectionHeading>
            <div className="space-y-6">
              {page.faqs.map((faq: any, index: number) => (
                <ContentBox key={index} border padding="md">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>{faq.question}</h3>
                  <p className="text-base leading-relaxed" style={{ color: "var(--secondary)" }}>{faq.answer}</p>
                </ContentBox>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Related Services */}
      {page.relatedServices && page.relatedServices.length > 0 && (
        <Section padding="md">
          <Container maxWidth="lg">
            <SectionHeading>Related Services</SectionHeading>
            <ul className="list-disc list-inside space-y-2">
              {page.relatedServices.map((service: string, index: number) => (
                <li key={index} className="text-base" style={{ color: "var(--secondary)" }}>{service}</li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Nearby Areas */}
      {page.nearbyAreas && page.nearbyAreas.length > 0 && (
        <Section padding="md">
          <Container maxWidth="lg">
            <SectionHeading>We Also Serve</SectionHeading>
            <ul className="list-disc list-inside space-y-2">
              {page.nearbyAreas.map((area: string, index: number) => (
                <li key={index} className="text-base" style={{ color: "var(--secondary)" }}>{area}</li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* CTA */}
      <CTA
        heading="Ready to Get Started?"
        text="Contact us today for a free consultation!"
        buttonText="Contact Us"
        buttonHref="/contact-us"
      />
    </main>
  );
}
