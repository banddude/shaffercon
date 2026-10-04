import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { isPriorityService } from "@/lib/seo-priority";
import { getLocalSeoFacts } from "@/lib/local-seo";
import type { Metadata } from "next";
import { Section, Container, PageTitle, SectionHeading, Paragraph, ContentBox } from "@/app/components/UI";
import { ASSET_PATH } from "@/app/config";
import { AppleButton } from "@/app/components/UI/AppleStyle";
import CTA from "@/app/components/CTA";
import { HeroVideo } from "@/app/components/HeroVideo";
import LinkCardGrid from "@/app/components/LinkCardGrid";
import LocalProofSection from "@/app/components/LocalProofSection";
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

interface ServiceHubLink {
  href: string;
  label: string;
}

function getServiceHubLinks(serviceType: string, serviceName: string): ServiceHubLink[] {
  if (serviceName !== "ev-charger-installation") return [];

  const hub = serviceType === "commercial"
    ? { href: "/commercial-electric-vehicle-chargers/", label: "Commercial EV charger installation in Los Angeles" }
    : { href: "/residential-ev-charger/", label: "Home EV charger installation in Los Angeles" };

  return [
    hub,
    { href: "/electrical-load-studies/", label: "Electrical load studies for EV charging" },
  ];
}

interface PageProps {
  params: Promise<{
    location: string;
    service: string;
  }>;
}

interface PriorityServiceDetail {
  eyebrow: string;
  heading: string;
  body: string;
  points: Array<{
    title: string;
    text: string;
  }>;
}

function getPriorityServiceDetail(
  serviceType: string,
  serviceName: string,
  locationName: string,
  serviceDisplayName: string
): PriorityServiceDetail | null {
  if (!isPriorityService(serviceType, serviceName)) {
    return null;
  }

  const audience = serviceType === "commercial" ? "businesses and property teams" : "homeowners";
  const localContext = `in ${locationName}`;

  const details: Record<string, Omit<PriorityServiceDetail, "heading">> = {
    "ev-charger-installation": {
      eyebrow: "EV charging scope",
      body: `A good EV charger installation ${localContext} starts with load capacity, charger placement, conduit routing, breaker sizing, and inspection requirements. We plan the electrical path before installation so the charger is reliable, serviceable, and ready for daily use.`,
      points: [
        {
          title: "Load and panel review",
          text: `We check available capacity, panel condition, feeder limits, and whether the project needs a load study or panel upgrade before quoting the final path.`,
        },
        {
          title: "Charger location planning",
          text: `We plan wall mounted chargers, pedestals, parking clearances, conduit runs, and weather exposure so the finished installation fits the property.`,
        },
        {
          title: "Permits and inspection",
          text: `We prepare the electrical scope for permit review, installation, labeling, and inspection so the work is documented correctly.`,
        },
      ],
    },
    "electrical-panel-upgrades": {
      eyebrow: "Panel upgrade planning",
      body: `Panel upgrade work ${localContext} depends on load calculations, service capacity, meter equipment, utility requirements, and inspection timing. We look at the whole electrical system before replacing equipment.`,
      points: [
        {
          title: "Service capacity",
          text: `We review existing loads, future EV or HVAC needs, available service size, and whether utility coordination is needed before work starts.`,
        },
        {
          title: "Equipment layout",
          text: `We check panel clearances, grounding, bonding, labeling, breaker compatibility, and the best location for safe long term access.`,
        },
        {
          title: "Inspection path",
          text: `We plan the permit, shutdown window, utility release if needed, and final inspection so the upgrade does not turn into a drawn out project.`,
        },
      ],
    },
    "electrical-safety-inspections": {
      eyebrow: "Safety inspection scope",
      body: `Electrical safety inspections ${localContext} should identify real hazards, not just produce a generic checklist. We look for overloaded circuits, unsafe panels, poor grounding, damaged wiring, improper devices, and code issues that can affect insurance, sale, occupancy, or tenant safety.`,
      points: [
        {
          title: "Panel and breaker review",
          text: `We check labeling, breaker fit, heat signs, corrosion, grounding, bonding, and known problem equipment where access allows.`,
        },
        {
          title: "Circuit and device checks",
          text: `We review GFCI and AFCI protection, exposed wiring, junction boxes, outdoor equipment, lighting, and common failure points.`,
        },
        {
          title: "Clear repair path",
          text: `We separate urgent safety items from recommended improvements so you can make practical decisions about the next step.`,
        },
      ],
    },
    "electrical-code-compliance-corrections": {
      eyebrow: "Code correction planning",
      body: `Code correction work ${localContext} needs a clear path from violation, inspection note, or property report to completed repair. We translate the issue into buildable electrical work and help close out the correction cleanly.`,
      points: [
        {
          title: "Correction review",
          text: `We review inspection notes, photos, panel schedules, and site conditions so the repair addresses the actual issue.`,
        },
        {
          title: "Compliant repair scope",
          text: `We plan wiring, boxes, protection, labeling, grounding, clearances, and device changes around the relevant code requirement.`,
        },
        {
          title: "Inspection support",
          text: `We help prepare the work for reinspection with practical documentation and a finished installation that is easy to verify.`,
        },
      ],
    },
    "lighting-installation-retrofitting": {
      eyebrow: "Lighting upgrade scope",
      body: `Lighting installation and retrofit work ${localContext} should improve visibility, maintenance, energy use, and control. We plan fixture selection, switching, dimming, access, and wiring before installation so the finished lighting works the way the space is used.`,
      points: [
        {
          title: "Fixture and control plan",
          text: `We review light levels, fixture spacing, dimming needs, switching zones, sensors, and operating hours before installation.`,
        },
        {
          title: "Wiring and access",
          text: `We plan attic, ceiling, exterior, or tenant space access so the wiring route is practical and clean.`,
        },
        {
          title: "Efficiency and maintenance",
          text: `We consider LED output, service life, driver access, replacement parts, and energy savings for the property.`,
        },
      ],
    },
    "breaker-panel-service-maintenance": {
      eyebrow: "Panel maintenance scope",
      body: `Breaker panel service ${localContext} is about finding weak connections, aging breakers, poor labeling, nuisance trips, heat marks, corrosion, and capacity issues before they become failures. We approach panel work as both troubleshooting and prevention.`,
      points: [
        {
          title: "Panel condition",
          text: `We review breaker fit, labeling, conductor condition, visible heat damage, grounding, bonding, and enclosure condition where access allows.`,
        },
        {
          title: "Load and circuit behavior",
          text: `We trace nuisance trips, overloaded circuits, equipment loads, and signs that the panel is no longer serving the property well.`,
        },
        {
          title: "Repair or upgrade path",
          text: `We identify when maintenance is enough and when replacement, new circuits, or a larger panel should be considered.`,
        },
      ],
    },
    "dedicated-equipment-circuits": {
      eyebrow: "Dedicated circuit planning",
      body: `Dedicated equipment circuits ${localContext} need correct amperage, conductor sizing, breaker selection, disconnects, routing, and equipment location. We build the circuit around the actual equipment requirements instead of guessing from the appliance name.`,
      points: [
        {
          title: "Equipment requirements",
          text: `We review nameplates, manufacturer instructions, amperage, voltage, plug type, disconnect needs, and startup loads.`,
        },
        {
          title: "Circuit route",
          text: `We plan the route through walls, ceiling, exterior areas, conduit, or crawl spaces so the finished work is durable and accessible.`,
        },
        {
          title: "Panel capacity",
          text: `We confirm available breaker space and capacity before installation, especially when the circuit supports EV, HVAC, kitchen, shop, or commercial equipment.`,
        },
      ],
    },
    "electrical-troubleshooting-repairs": {
      eyebrow: "Troubleshooting process",
      body: `Electrical troubleshooting ${localContext} is most useful when it isolates the source of the problem, explains the risk, and gives a practical repair path. We trace symptoms back to circuits, devices, panels, wiring, or equipment instead of only replacing visible parts.`,
      points: [
        {
          title: "Symptom review",
          text: `We start with outages, flickering lights, nuisance trips, hot devices, burning smells, dead outlets, or equipment issues and narrow the likely circuit.`,
        },
        {
          title: "Targeted testing",
          text: `We test safely at accessible devices, panels, breakers, junctions, and equipment to find the actual fault.`,
        },
        {
          title: "Repair priority",
          text: `We explain what needs immediate repair, what can be monitored, and what should be upgraded to prevent repeated failures.`,
        },
      ],
    },
    "energy-efficiency-upgrades": {
      eyebrow: "Efficiency upgrade scope",
      body: `Energy efficiency upgrades ${localContext} should reduce operating cost without creating maintenance issues. We focus on lighting, controls, equipment circuits, panel condition, and practical electrical upgrades for ${audience}.`,
      points: [
        {
          title: "Usage review",
          text: `We look at lighting schedules, common loads, tenant usage, equipment operation, and where electrical changes can make a measurable difference.`,
        },
        {
          title: "Controls and upgrades",
          text: `We plan LEDs, occupancy sensors, timers, dimming, exterior controls, and circuit improvements around how the property is used.`,
        },
        {
          title: "Long term maintenance",
          text: `We consider replacement access, driver locations, labeling, and fixture standardization so the upgrade remains easy to maintain.`,
        },
      ],
    },
    "backup-generator-installation": {
      eyebrow: "Generator installation scope",
      body: `Backup generator installation ${localContext} requires load planning, transfer equipment, location requirements, fuel coordination, grounding, and inspection. We plan the electrical side around the loads that actually need to stay on.`,
      points: [
        {
          title: "Critical load planning",
          text: `We identify which circuits or equipment need backup power, then size the electrical scope around realistic startup and running loads.`,
        },
        {
          title: "Transfer equipment",
          text: `We plan manual or automatic transfer equipment, panel connections, labeling, and safe separation from utility power.`,
        },
        {
          title: "Site coordination",
          text: `We review generator placement, electrical routing, clearances, fuel coordination, noise concerns, and inspection requirements.`,
        },
      ],
    },
  };

  const detail = details[serviceName];

  if (!detail) {
    return null;
  }

  return {
    ...detail,
    heading: `${serviceDisplayName} planning in ${locationName}`,
  };
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
    SELECT sp.*, pa.slug, pa.meta_title, pa.meta_description, pa.canonical_url,
           lp.location_slug, lp.location_name, lp.city, lp.zip_code, lp.latitude, lp.longitude
    FROM service_pages sp
    LEFT JOIN pages_all pa ON sp.page_id = pa.id
    LEFT JOIN location_pages lp ON LOWER(lp.location_name) = LOWER(sp.location)
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
    localSeoFacts: getLocalSeoFacts(
      db,
      page.location_slug || location,
      page.location_name || locationDb.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    ),
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

  const baseUrl = 'https://shaffercon.com';
  const url = `${baseUrl}/service-areas/${location}/${service}`;

  // Build proper display name (handle EV/AV/LED/GFCI/AFCI abbreviations)
  const locationDisplay = location.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const [stype, ...snameParts] = service.split('-');
  const sdispName = snameParts
    .join('-')
    .split('-')
    .map(w => {
      if (w === 'ev') return 'EV';
      if (w === 'av') return 'AV';
      if (w === 'led') return 'LED';
      if (w === 'gfci') return 'GFCI';
      if (w === 'afci') return 'AFCI';
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ')
    .replace('Data Network Av', 'Data, Network & AV')
    .replace('Data Network AV', 'Data, Network & AV')
    .replace('Pool Hot Tub Spa', 'Pool, Hot Tub & Spa')
    .replace('Troubleshooting Repairs', 'Troubleshooting & Repairs');
  const computedTitle = `${stype.charAt(0).toUpperCase() + stype.slice(1)} ${sdispName} in ${locationDisplay}`;

  const title = page.meta_title || computedTitle;
  const description = page.meta_description || page.hero_intro || "Professional electrical services";

  return {
    title: { absolute: title },
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
    .map(w => {
      // Handle common abbreviations
      if (w === 'ev') return 'EV';
      if (w === 'av') return 'AV';
      if (w === 'led') return 'LED';
      if (w === 'gfci') return 'GFCI';
      if (w === 'afci') return 'AFCI';
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ')
    .replace('Data Network Av', 'Data, Network & AV')
    .replace('Data Network AV', 'Data, Network & AV')
    .replace('Pool Hot Tub Spa', 'Pool, Hot Tub & Spa')
    .replace('Troubleshooting Repairs', 'Troubleshooting & Repairs');
  const fullServiceName = `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} ${serviceDisplayName}`;

  const baseUrl = 'https://shaffercon.com';
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
  const priorityDetail = getPriorityServiceDetail(serviceType, serviceName, locationName, serviceDisplayName);
  const serviceHubLinks = getServiceHubLinks(serviceType, serviceName);

  return (
    <main className="w-full">
      {/* LocalBusiness Schema */}
      <LocalBusinessSchema
        areaServed={locationName}
        serviceUrl={pageUrl}
        services={[decodeHtmlEntities(pageTitle)]}
        city={page.city}
        zipCode={page.zip_code}
        latitude={page.latitude}
        longitude={page.longitude}
        utilityName={page.localSeoFacts.utilityName}
        permitOffice={page.localSeoFacts.permitOffice}
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
          { label: locationName, href: `/service-areas/${location}/` },
          { label: fullServiceName }
        ]}
      />

      {/* Hero Video Section */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "60vh" }}>
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <HeroVideo
            src={ASSET_PATH("/ev-charging.mp4")}
            poster={ASSET_PATH("/images/posters/ev-charging.webp")}
            ariaLabel="Professional electrical service installation"
          />
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
              <AppleButton href="tel:+13236428509" variant="primary" size="lg">
                <Phone className="w-5 h-5 mr-2" />
                Call (323) 642-8509
              </AppleButton>
              <AppleButton href="/contact-us/" variant="secondary" size="lg">
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

          {serviceHubLinks.length > 0 && (
            <div className="mb-12">
              <Paragraph className="text-center mb-4">
                Planning an EV charging project beyond this local installation? These pages cover the broader Los Angeles installation and electrical-capacity process.
              </Paragraph>
              <LinkCardGrid items={serviceHubLinks} columns={2} />
            </div>
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

      <LocalProofSection
        locationName={locationName}
        locationSlug={page.location_slug || location}
        facts={page.localSeoFacts}
        nearbyAreas={page.nearbyAreas}
        serviceType={serviceType}
        serviceName={serviceName}
        serviceDisplayName={serviceDisplayName}
      />

      {/* Priority service detail */}
      {priorityDetail && (
        <section className="py-12 sm:py-20 lg:py-28 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <p className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--primary)" }}>
                {priorityDetail.eyebrow}
              </p>
              <SectionHeading className="mb-5">{priorityDetail.heading}</SectionHeading>
              <Paragraph className="text-lg">
                {priorityDetail.body}
              </Paragraph>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {priorityDetail.points.map((point, index) => {
                const Icon = index === 0 ? Shield : index === 1 ? Wrench : CheckCircle;

                return (
                  <div
                    key={point.title}
                    className="rounded-lg p-6"
                    style={{
                      background: "var(--section-gray)",
                      border: "1px solid var(--section-border)",
                    }}
                  >
                    <Icon className="w-8 h-8 mb-4" style={{ color: "var(--primary)" }} />
                    <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>
                      {point.title}
                    </h2>
                    <p className="text-base leading-relaxed" style={{ color: "var(--secondary)" }}>
                      {point.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
                    {page.relatedServices.map((serviceSlug: string, index: number) => {
                      // Convert slug to display name (e.g., "residential-ev-charger-installation" -> "Residential EV Charger Installation")
                      const displayName = serviceSlug
                        .split('-')
                        .map(w => {
                          // Handle special cases
                          if (w === 'ev') return 'EV';
                          if (w === 'av') return 'AV';
                          return w.charAt(0).toUpperCase() + w.slice(1);
                        })
                        .join(' ')
                        .replace('Data Network Av', 'Data, Network & AV')
    .replace('Data Network AV', 'Data, Network & AV')
                        .replace('Pool Hot Tub Spa', 'Pool, Hot Tub & Spa')
                        .replace('Troubleshooting Repairs', 'Troubleshooting & Repairs');

                      return (
                        <li key={index}>
                          <a
                            href={`/service-areas/${location}/${serviceSlug}/`}
                            className="flex items-center gap-3 p-4 rounded-lg transition-all hover:translate-x-1"
                            style={{
                              background: "var(--background)",
                              border: "1px solid var(--section-border)",
                              textDecoration: "none"
                            }}
                          >
                            <Zap className="w-5 h-5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                            <span className="text-base font-medium" style={{ color: "var(--text)" }}>
                              {displayName}
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
                    {page.nearbyAreas.map((area: string, index: number) => (
                      <li key={index}>
                        <a
                          href={`/service-areas/${area.toLowerCase().replace(/\s+/g, '-')}/${service}/`}
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
