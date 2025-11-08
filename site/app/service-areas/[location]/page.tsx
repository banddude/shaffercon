import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { Section, Container, PageTitle, SectionHeading, Paragraph, Grid, GridItem } from "@/app/components/UI";
import { ASSET_PATH } from "@/app/config";
import { AppleButton } from "@/app/components/UI/AppleStyle";
import CTA from "@/app/components/CTA";
import LinkCardGrid from "@/app/components/LinkCardGrid";
import Breadcrumb from "@/app/components/Breadcrumb";
import { LocalBusinessSchema } from "@/app/components/schemas/LocalBusinessSchema";
import { BreadcrumbSchema } from "@/app/components/schemas/BreadcrumbSchema";
import { Award, Clock, CheckCircle, Phone, Zap, MapPin } from "lucide-react";

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

  const baseUrl = 'https://banddude.github.io/shaffercon';
  const pageUrl = `${baseUrl}/service-areas/${location}`;

  // Get all service names for this location
  const allServices = [
    ...page.residentialServices.map((s: any) => `Residential ${s.service_name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`),
    ...page.commercialServices.map((s: any) => `Commercial ${s.service_name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`)
  ];

  return (
    <main className="w-full">
      {/* LocalBusiness Schema */}
      <LocalBusinessSchema
        areaServed={page.location_name}
        serviceUrl={pageUrl}
        services={allServices.slice(0, 10)} // Include top 10 services
      />

      {/* Breadcrumb Schema */}
      <BreadcrumbSchema
        items={[
          { label: "Service Areas", href: "/service-areas" },
          { label: page.location_name }
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
            aria-label="Professional electrical services"
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
              Electrical Services in {page.location_name}
            </h1>

            {/* Tagline */}
            {page.tagline && (
              <p className="text-xl mb-8" style={{ color: "#d1d5db" }}>
                {page.tagline}
              </p>
            )}

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

      {/* About Section + Trust Bar */}
      <section className="py-12 sm:py-20 lg:py-28 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {page.about_paragraph_1 && (
            <Paragraph className="text-center text-xl mb-12">{page.about_paragraph_1}</Paragraph>
          )}
          {page.about_paragraph_2 && (
            <Paragraph className="text-center text-xl mb-12">{page.about_paragraph_2}</Paragraph>
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
        </div>
      </section>

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

      {/* Residential Services */}
      {page.residentialServices && page.residentialServices.length > 0 && (
        <section className="py-12 sm:py-20 lg:py-28 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <SectionHeading className="text-center mb-8">Residential Electrical Services</SectionHeading>
            {page.residential_intro && (
              <Paragraph className="text-center text-lg mb-8 max-w-3xl mx-auto">{page.residential_intro}</Paragraph>
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
              columns={4}
            />
          </div>
        </section>
      )}

      {/* Commercial Services */}
      {page.commercialServices && page.commercialServices.length > 0 && (
        <section className="py-12 sm:py-20 lg:py-28 px-6 sm:px-8 lg:px-12" style={{ background: "var(--section-gray)" }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeading className="text-center mb-8">Commercial Electrical Services</SectionHeading>
            {page.commercial_intro && (
              <Paragraph className="text-center text-lg mb-8 max-w-3xl mx-auto">{page.commercial_intro}</Paragraph>
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
              columns={4}
            />
          </div>
        </section>
      )}

      {/* Featured Services & Nearby Areas - Side by Side */}
      {(page.relatedServices?.length > 0 || page.nearbyAreas?.length > 0) && (
        <section className="py-12 sm:py-20 lg:py-28 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">

              {/* Featured Services */}
              {page.relatedServices && page.relatedServices.length > 0 && (
                <div>
                  <SectionHeading className="mb-6">
                    Featured Services in {page.location_name}
                  </SectionHeading>
                  <ul className="space-y-3">
                    {page.relatedServices.map((service: string, index: number) => {
                      // Extract service type and name from format like "Residential Outlet Switch Dimmer Services"
                      const parts = service.split(' ');
                      const serviceType = parts[0].toLowerCase();

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

                      return (
                        <li key={index}>
                          <a
                            href={`/service-areas/${location}/${serviceType}-${serviceName}`}
                            className="flex items-center gap-3 p-4 rounded-lg transition-all hover:translate-x-1"
                            style={{
                              background: "var(--background)",
                              border: "1px solid var(--section-border)",
                              textDecoration: "none"
                            }}
                          >
                            <Zap className="w-5 h-5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                            <span className="text-base font-medium" style={{ color: "var(--text)" }}>
                              {service}
                            </span>
                          </a>
                        </li>
                      );
                    })}
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
                    {page.nearbyAreas.map((area: any, index: number) => (
                      <li key={index}>
                        <a
                          href={`/service-areas/${area.area_slug}`}
                          className="flex items-center gap-3 p-4 rounded-lg transition-all hover:translate-x-1"
                          style={{
                            background: "var(--background)",
                            border: "1px solid var(--section-border)",
                            textDecoration: "none"
                          }}
                        >
                          <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                          <span className="text-base font-medium" style={{ color: "var(--text)" }}>
                            {area.area_name}
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
