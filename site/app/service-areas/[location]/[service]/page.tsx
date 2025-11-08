import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { Section, Container, PageTitle, SectionHeading, Paragraph, ContentBox } from "@/app/components/UI";
import { ASSET_PATH } from "@/app/config";
import { AppleButton } from "@/app/components/UI/AppleStyle";
import CTA from "@/app/components/CTA";
import LinkCardGrid from "@/app/components/LinkCardGrid";
import Breadcrumb from "@/app/components/Breadcrumb";
import { FAQPageSchema } from "@/app/components/schemas/FAQPageSchema";
import { ServiceSchema } from "@/app/components/schemas/ServiceSchema";
import { LocalBusinessSchema } from "@/app/components/schemas/LocalBusinessSchema";
import { BreadcrumbSchema } from "@/app/components/schemas/BreadcrumbSchema";
import { Zap, Shield, Clock, Award, CheckCircle, Phone, ArrowRight, MapPin, Wrench } from "lucide-react";

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
    location: location.replace(/\s+/g, '-').toLowerCase(),
    service: `${service_type}-${service_name}`,
  }));
}

// Get service page data
async function getServicePage(location: string, service: string) {
  const [serviceType, ...serviceNameParts] = service.split('-');
  const serviceName = serviceNameParts.join('-');

  // Convert location slug back to location name (e.g., "culver-city" -> "culver city")
  const locationDb = location.replace(/-/g, ' ');

  const db = getDb();

  // Get basic page data including hero_intro and closing_content
  const page = db.prepare(`
    SELECT sp.*, pa.slug, pa.meta_title, pa.meta_description, pa.canonical_url
    FROM service_pages sp
    LEFT JOIN pages_all pa ON sp.page_id = pa.id
    WHERE sp.location = ? AND sp.service_type = ? AND sp.service_name = ?
  `).get(locationDb, serviceType, serviceName) as any;

  if (!page) return null;

  // Get benefits
  const benefits = db.prepare(`
    SELECT heading, content
    FROM service_benefits
    WHERE service_page_id = ?
    ORDER BY benefit_order
  `).all(page.id);

  // Get offerings
  const offerings = db.prepare(`
    SELECT offering
    FROM service_offerings
    WHERE service_page_id = ?
    ORDER BY offering_order
  `).all(page.id);

  // Get FAQs
  const faqs = db.prepare(`
    SELECT question, answer
    FROM service_faqs
    WHERE service_page_id = ?
    ORDER BY faq_order
  `).all(page.id);

  // Get related services
  const relatedServices = db.prepare(`
    SELECT service_name
    FROM service_related_services
    WHERE service_page_id = ?
    ORDER BY display_order
  `).all(page.id);

  // Get nearby areas
  const nearbyAreas = db.prepare(`
    SELECT area_name
    FROM service_nearby_areas
    WHERE service_page_id = ?
    ORDER BY display_order
  `).all(page.id);

  return {
    ...page,
    benefits: benefits.map((b: any) => ({ heading: b.heading, content: b.content })),
    offerings: offerings.map((o: any) => o.offering),
    faqs: faqs.map((f: any) => ({ question: f.question, answer: f.answer })),
    relatedServices: relatedServices.map((r: any) => r.service_name),
    nearbyAreas: nearbyAreas.map((a: any) => a.area_name),
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

  const baseUrl = 'https://banddude.github.io/shaffercon';
  const url = `${baseUrl}/service-areas/${location}/${service}`;
  const title = page.meta_title || page.title || "Electrical Services";
  const description = page.meta_description || page.hero_intro || "Professional electrical services";

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
export default async function ServiceDetailPage({ params }: PageProps) {
  const { location, service } = await params;
  const page = await getServicePage(location, service);

  if (!page) {
    notFound();
  }

  const locationName = location.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Generate service display name for breadcrumb
  const [serviceType, ...serviceNameParts] = service.split('-');
  const serviceName = serviceNameParts.join('-');
  const serviceDisplayName = serviceName
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const fullServiceName = `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} ${serviceDisplayName}`;

  const baseUrl = 'https://banddude.github.io/shaffercon';
  const pageUrl = `${baseUrl}/service-areas/${location}/${service}`;

  // Get page title from database
  const db = getDb();
  const pageData = db.prepare(`
    SELECT pa.title
    FROM service_pages sp
    LEFT JOIN pages_all pa ON sp.page_id = pa.id
    WHERE sp.page_id = ?
  `).get(page.page_id) as any;

  const pageTitle = pageData?.title || fullServiceName;

  return (
    <main className="w-full">
      {/* LocalBusiness Schema */}
      <LocalBusinessSchema
        areaServed={locationName}
        serviceUrl={pageUrl}
        services={[decodeHtmlEntities(pageTitle)]}
      />

      {/* Service Schema */}
      <ServiceSchema
        serviceName={decodeHtmlEntities(pageTitle)}
        description={decodeHtmlEntities(page.hero_intro || pageTitle)}
        areaServed={locationName}
        url={pageUrl}
      />

      {/* FAQ Schema */}
      {page.faqs && page.faqs.length > 0 && (
        <FAQPageSchema
          faqs={page.faqs.map((faq: any) => ({
            question: decodeHtmlEntities(faq.question),
            answer: decodeHtmlEntities(faq.answer)
          }))}
        />
      )}

      {/* Breadcrumb Schema */}
      <BreadcrumbSchema
        items={[
          { label: "Service Areas", href: "/service-areas" },
          { label: locationName, href: `/service-areas/${location}` },
          { label: fullServiceName }
        ]}
      />

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
            aria-label="Professional electrical service installation"
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
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-6" style={{ color: "#ffffff" }}>
              {decodeHtmlEntities(pageTitle)}
            </h1>

            {/* CTAs */}
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

      {/* Intro + Trust Bar */}
      <Section padding="md">
        <Container maxWidth="lg">
          {page.hero_intro && (
            <Paragraph className="text-center text-xl mb-12">{decodeHtmlEntities(page.hero_intro)}</Paragraph>
          )}

          {/* Trust Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8 rounded-2xl" style={{ background: "var(--section-gray)", border: "1px solid var(--section-border)" }}>
            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--primary)" }} />
              <div className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>Licensed & Insured</div>
              <div className="text-sm" style={{ color: "var(--secondary)" }}>A, B & C10 Contractor</div>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--primary)" }} />
              <div className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>25+ Years</div>
              <div className="text-sm" style={{ color: "var(--secondary)" }}>Experience in LA</div>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--primary)" }} />
              <div className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>1000+ Projects</div>
              <div className="text-sm" style={{ color: "var(--secondary)" }}>Successfully Completed</div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Project Gallery */}
      <section className="py-12 sm:py-20 lg:py-28 px-6 sm:px-8 lg:px-12" style={{ background: "var(--section-gray)" }}>
        <div className="max-w-7xl mx-auto">
          <SectionHeading className="text-center mb-8">Our Work</SectionHeading>
          <div className="grid md:grid-cols-3 gap-6">
            <img
              src={ASSET_PATH("/images/tesla-supercharger-solar-canopy.jpeg")}
              alt="Tesla Supercharger station with solar canopy installation by Shaffer Construction electrical contractors"
              className="w-full h-64 object-cover rounded-lg"
              style={{ border: "1px solid var(--section-border)" }}
            />
            <img
              src={ASSET_PATH("/images/ev-charging-stations-commercial.jpg")}
              alt="Commercial EV charging infrastructure with electrical panels and utility meters installed by licensed electricians"
              className="w-full h-64 object-cover rounded-lg"
              style={{ border: "1px solid var(--section-border)" }}
            />
            <img
              src={ASSET_PATH("/brand-assets/tesla-powerwall-residential-installation.jpg")}
              alt="Tesla Powerwall battery storage system professionally installed on residential home exterior"
              className="w-full h-64 object-cover rounded-lg"
              style={{ border: "1px solid var(--section-border)" }}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      {page.benefits && page.benefits.length > 0 && (
        <Section padding="md">
          <Container maxWidth="lg">
            <SectionHeading className="text-center mb-8">Benefits</SectionHeading>
            <div className="grid md:grid-cols-2 gap-8">
              {page.benefits.map((benefit: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Award className="w-8 h-8" style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>
                      {decodeHtmlEntities(benefit.heading)}
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: "var(--secondary)" }}>
                      {decodeHtmlEntities(benefit.content)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Offerings Section */}
      {page.offerings && page.offerings.length > 0 && (
        <section className="py-12 sm:py-20 lg:py-28 px-6 sm:px-8 lg:px-12" style={{ background: "var(--section-gray)" }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeading className="text-center mb-8">What We Offer</SectionHeading>

            {/* Offerings Intro */}
            {page.offerings_intro && (
              <Paragraph className="text-center text-lg mb-8 max-w-3xl mx-auto">
                {decodeHtmlEntities(page.offerings_intro)}
              </Paragraph>
            )}

            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {page.offerings.map((offering: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg" style={{ background: "var(--background)", border: "1px solid var(--section-border)" }}>
                  <Wrench className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                  <span className="text-base" style={{ color: "var(--text)" }}>
                    {decodeHtmlEntities(offering)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {page.faqs && page.faqs.length > 0 && (
        <Section padding="md">
          <Container maxWidth="lg">
            <SectionHeading className="text-center mb-8">Frequently Asked Questions</SectionHeading>
            <div className="space-y-4 max-w-3xl mx-auto">
              {page.faqs.map((faq: any, index: number) => (
                <details
                  key={index}
                  className="p-6 rounded-lg cursor-pointer group"
                  style={{ background: "var(--background)", border: "1px solid var(--section-border)" }}
                >
                  <summary className="text-lg font-semibold list-none flex justify-between items-center" style={{ color: "var(--text)" }}>
                    <span>{decodeHtmlEntities(faq.question)}</span>
                    <span className="text-2xl group-open:rotate-45 transition-transform" style={{ color: "var(--primary)" }}>+</span>
                  </summary>
                  <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--secondary)" }}>
                    {decodeHtmlEntities(faq.answer)}
                  </p>
                </details>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Closing Content */}
      {page.closing_content && (
        <section className="py-12 sm:py-20 lg:py-28 px-6 sm:px-8 lg:px-12" style={{ background: "var(--section-gray)" }}>
          <div className="max-w-7xl mx-auto">
            {page.closing_heading && (
              <SectionHeading className="text-center mb-8">
                {decodeHtmlEntities(page.closing_heading)}
              </SectionHeading>
            )}
            <Paragraph className="text-center text-lg max-w-4xl mx-auto">
              {decodeHtmlEntities(page.closing_content)}
            </Paragraph>
          </div>
        </section>
      )}

      {/* Related Services & Nearby Areas - Side by Side */}
      {(page.relatedServices?.length > 0 || page.nearbyAreas?.length > 0) && (
        <section className="py-12 sm:py-20 lg:py-28 px-6 sm:px-8 lg:px-12" style={{ background: "var(--section-gray)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">

              {/* Related Services */}
              {page.relatedServices && page.relatedServices.length > 0 && (
                <div>
                  <SectionHeading className="mb-6">
                    Related Services in {locationName}
                  </SectionHeading>
                  <ul className="space-y-3">
                    {page.relatedServices.map((serviceName: string, index: number) => (
                      <li key={index}>
                        <a
                          href={`/service-areas/${location}/${serviceName.toLowerCase().replace(/\s+/g, '-')}`}
                          className="flex items-center gap-3 p-4 rounded-lg transition-all hover:translate-x-1"
                          style={{
                            background: "var(--background)",
                            border: "1px solid var(--section-border)",
                            textDecoration: "none"
                          }}
                        >
                          <Zap className="w-5 h-5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                          <span className="text-base font-medium" style={{ color: "var(--text)" }}>
                            {serviceName}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nearby Areas */}
              {page.nearbyAreas && page.nearbyAreas.length > 0 && (
                <div>
                  <SectionHeading className="mb-6">
                    We Also Serve
                  </SectionHeading>
                  <ul className="space-y-3">
                    {page.nearbyAreas.map((area: string, index: number) => (
                      <li key={index}>
                        <a
                          href={`/service-areas/${area.toLowerCase().replace(/\s+/g, '-')}/${service}`}
                          className="flex items-center gap-3 p-4 rounded-lg transition-all hover:translate-x-1"
                          style={{
                            background: "var(--background)",
                            border: "1px solid var(--section-border)",
                            textDecoration: "none"
                          }}
                        >
                          <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                          <span className="text-base font-medium" style={{ color: "var(--text)" }}>
                            {area}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTA
        heading="Ready to Get Started?"
        text="Contact us today for a free consultation and quote on your electrical project!"
        buttonText="Contact Us"
        buttonHref="/contact-us"
      />
    </main>
  );
}
