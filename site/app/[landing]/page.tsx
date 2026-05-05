import type { JSX } from "react";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { Section, Container, PageTitle, SectionHeading, Subheading, ContentBox, Button } from "@/app/components/UI";
import { AppleHero, AppleButton, AppleCard, AppleGrid } from "@/app/components/UI/AppleStyle";
import CTA from "@/app/components/CTA";
import { ASSET_PATH } from "@/app/config";
import { SlowMotionVideo } from "@/app/components/SlowMotionVideo";
import { HeroVideo } from "@/app/components/HeroVideo";
import Breadcrumb from "@/app/components/Breadcrumb";
import { ServiceLandingSchema } from "@/app/components/schemas/ServiceLandingSchema";
import { BreadcrumbSchema } from "@/app/components/schemas/BreadcrumbSchema";
import { Phone, Zap, Award, MapPin, Clock, Battery, Wrench, Car, HeadphonesIcon } from "lucide-react";

interface PageProps {
  params: Promise<{
    landing: string;
  }>;
}

const SERVICE_LANDING_SLUGS = [
  'commercial-electric-vehicle-chargers',
  'commercial-service',
  'electrical-load-studies',
  'led-retrofit-services',
  'residential-ev-charger',
  'statewide-facilities-maintenance'
];

// Generate static params for service landing pages
export async function generateStaticParams() {
  return SERVICE_LANDING_SLUGS.map(slug => ({
    landing: slug,
  }));
}

// Get service landing page data
async function getServiceLandingPage(slug: string) {
  if (!SERVICE_LANDING_SLUGS.includes(slug)) {
    return null;
  }

  // Hardcoded content for commercial-electric-vehicle-chargers
  if (slug === 'commercial-electric-vehicle-chargers') {
    return {
      id: 1,
      slug: 'commercial-electric-vehicle-chargers',
      title: 'Commercial EV Charger Installation',
      page_title: 'Commercial EV Charger Installation Los Angeles',
      hero_text: "Commercial EV charging projects need more than a charger on a wall. Shaffer Construction plans, permits, and installs Level 2 and DC fast charging systems for Los Angeles fleets, multifamily properties, retail centers, workplaces, warehouses, and commercial parking facilities. We start with the electrical load study, coordinate the permit path, install the charging infrastructure, and support the site after commissioning.",
      hero_image: '/commercial-ev-hero.mp4',
      meta_title: 'Commercial EV Charger Installation Los Angeles',
      meta_description: 'Commercial EV charger installation in Los Angeles for fleets, retail, multifamily, and workplaces. Load studies, permits, Level 2 and DC fast charging.',
      canonical_url: null,
      og_image: null,
      sections: [
        {
          section_type: 'info_card',
          heading: 'Commercial EV Charging Built Around Your Electrical Capacity',
          subheading: null,
          content: 'A successful commercial EV charger installation starts with the existing service, panel capacity, utility equipment, and future charging demand. We review your electrical system before design decisions are made, so the installation is sized for today while leaving a practical path for expansion. That matters for fleet yards, apartment buildings, shopping centers, office parking, hotels, and industrial sites where charging demand can grow quickly.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Level 2 Chargers for Workplaces and Multifamily Properties',
          subheading: 'Reliable daily charging for tenants, employees, customers, and light duty fleets',
          content: 'Level 2 chargers are the right fit for most commercial properties where vehicles stay parked for several hours. They work well for apartment and condo parking, office lots, retail centers, hotels, medical buildings, schools, and employee charging. We install dedicated circuits, conduit, disconnects, bollards, pedestals, wall mounted chargers, load management equipment, and networked charging hardware from major manufacturers.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'DC Fast Charging for Fleets and High Traffic Sites',
          subheading: 'Higher power charging for routes, turnover, and commercial uptime',
          content: 'DC fast chargers require more planning than a standard Level 2 installation. We help evaluate service capacity, switchgear needs, trenching, equipment pads, transformer location, utility coordination, protective bollards, accessibility, and inspection requirements. For fleet depots, public charging sites, and high traffic commercial properties, we focus on a design that can pass inspection, serve real vehicle demand, and avoid expensive rework.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Permits, Load Studies, Installation, and Commissioning',
          subheading: 'One electrical contractor from feasibility through final inspection',
          content: 'Commercial EV projects often stall because the electrical study, permit package, utility requirements, and installation plan are handled separately. Shaffer Construction keeps those pieces connected. We prepare electrical load study documentation, coordinate with LADBS or the local authority, install the charging infrastructure, schedule inspections, test the equipment, and leave your team with a system that is ready to operate.',
          table_data: null,
        },
        {
          section_type: 'table',
          heading: null,
          subheading: null,
          content: null,
          table_data: {
            headers: ['Type of Charger', 'Power Rating', 'Charging Speed'],
            rows: [
              ['Level 2 Chargers', '3.3 to 19.2 kW', 'Employee, tenant, customer, and overnight fleet charging'],
              ['DC Fast Chargers', '25 to 350 kW+', 'Fleet turnaround, public charging, retail, and high traffic sites'],
            ],
          },
        },
        {
          section_type: 'content',
          heading: 'Commercial EV Charger Installation for Los Angeles Properties',
          subheading: null,
          content: 'Shaffer Construction installs EV charging infrastructure for Los Angeles commercial properties where code compliance, capacity planning, and clean execution matter. Our work includes Level 2 charger installation, DC fast charger infrastructure, commercial panel upgrades, switchgear coordination, trenching and conduit, equipment pads, wheel stops, bollards, signage, striping coordination, and charger commissioning.\n\nCommon project types include multifamily EV charger installations, workplace charging, fleet charging depots, retail charging, hotel charging, warehouse charging, and parking lot charging systems. We can help with a single charger, a bank of tenant chargers, or a phased rollout where the first installation needs to support future expansion.',
          table_data: null,
        },
        {
          section_type: 'how_we_help',
          heading: 'What We Need to Price a Commercial EV Charger Project',
          subheading: null,
          content: 'To prepare a useful estimate, send the site address, the number of chargers planned, charger model if selected, photos of the main electrical gear, the proposed charger location, and any site plan or single line drawing you already have. If the project is early stage, we can start with a load study and a site walk before final equipment is selected.\n\nCall Shaffer Construction at 323-642-8509 for commercial EV charger installation in Los Angeles, or send the project details through the contact form. We will help identify the electrical constraints, permit path, and practical next step before you spend money on the wrong charger layout.',
          table_data: null,
        },
      ],
    };
  }

  // Hardcoded content for electrical-load-studies
  if (slug === 'electrical-load-studies') {
    return {
      slug: 'electrical-load-studies',
      title: 'Electrical Load Study Los Angeles',
      page_title: 'Electrical Load Study Los Angeles',
      hero_text: 'Before you add EV chargers, upgrade a panel, build out a tenant space, or request more utility capacity, confirm what your electrical system can actually support. Shaffer Construction performs electrical load studies for Los Angeles commercial properties, multifamily buildings, and EV charging projects, with documentation for permits, utility coordination, and project planning.',
      hero_image: '/ev-charging.mp4',
      meta_title: 'Electrical Load Study Los Angeles',
      meta_description: 'Electrical load studies in Los Angeles for EV chargers, panel upgrades, tenant improvements, and utility coordination. Reports for permits and planning.',
      sections: [
        {
          section_type: 'info_card',
          heading: 'EV Charger Capacity Planning',
          subheading: '',
          content: 'Find out how many Level 2 or DC fast chargers your existing service can support before equipment is purchased or trenching begins. We identify available capacity, load management options, utility constraints, and the likely electrical upgrade path for commercial EV charging projects.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Real Electrical Usage Data',
          subheading: '',
          content: 'A load study gives you real demand data instead of guesses from panel schedules alone. We review voltage, current, power factor, peak demand, phase balance, and existing load patterns so project decisions are based on measured electrical behavior.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Permit and Utility Documentation',
          subheading: '',
          content: 'We prepare documentation that supports LADBS permits, utility coordination, EV charging design, panel upgrade planning, and internal budgeting. Stamped reports are available when the project requires engineering review.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Capacity and Code Compliance',
          subheading: '',
          content: 'We verify available capacity for new equipment, check NEC requirements, flag overloaded or unbalanced conditions, and provide practical next steps. The result is a clearer decision on whether to proceed, add load management, or plan an electrical upgrade.',
          table_data: null,
        },
        {
          section_type: 'table',
          heading: '',
          subheading: '',
          content: '',
          table_data: {
            headers: ['Study Type', 'Duration', 'Deliverables'],
            rows: [
              ['Panel Load Study', '7 to 14 days', 'Capacity report and recommendations'],
              ['EV Charging Study', '14 to 21 days', 'Load analysis and utility coordination'],
              ['Service Entrance Study', '21 to 30 days', 'Facility analysis and upgrade plan'],
              ['Power Quality Study', '7 to 30 days', 'Harmonic analysis and corrective options'],
            ],
          },
        },
        {
          section_type: 'content',
          heading: 'Critical Data for Critical Decisions',
          subheading: '',
          content: 'Critical Data for Critical Decisions\n\nDo not guess about electrical capacity. A professional load study gives owners, property managers, architects, engineers, and EV charging vendors the data needed before design, permitting, budgeting, or equipment selection. We use professional monitoring equipment to capture electrical demand over time and turn that data into clear recommendations.',
          table_data: null,
        },
        {
          section_type: 'content',
          heading: 'Comprehensive Load Study Services',
          subheading: '',
          content: 'Comprehensive Load Study Services\n\n• EV Infrastructure: Capacity for Level 2 chargers, DC fast chargers, and phased charging rollouts\n• Panel Upgrades: Confirm whether existing equipment can support new loads or needs replacement\n• Tenant Improvements: Document available capacity before new HVAC, kitchen, lighting, or equipment loads\n• Utility Coordination: Provide electrical data for LADWP, SCE, and service planning conversations\n• Code Compliance: Review NEC capacity requirements and identify overload risks\n• Budget Planning: Give owners a practical path before they commit to charger hardware or construction scope\n\nTo start, send the site address, photos of the main electrical gear, the planned new loads, and any charger or equipment cutsheets you already have. We can usually tell you the next step before a full design package is created.',
          table_data: null,
        },
        {
          section_type: 'content',
          heading: 'Load Study Planning Guides',
          subheading: '',
          content: '<p>Planning cost, permits, EV charger capacity, or a panel upgrade before you call? Start with our <a href="/industry-insights/electrical-load-study-cost-los-angeles/">electrical load study cost guide</a>, then review <a href="/industry-insights/electrical-load-studies-what-they-are-los-angeles/">when a Los Angeles property needs a load study</a>, <a href="/industry-insights/a-closer-look-at-our-load-study-services-and-why-your-ev-business-needs-them/">EV charger load studies for businesses</a>, and <a href="/industry-insights/exploring-shaffer-constructions-load-study-services-in-la/">load studies for EV chargers and panel upgrades</a>.</p><p>These guides help owners decide whether the next step is monitoring, load management, a panel upgrade, a service increase, or a construction estimate. If you already have photos, plans, charger cutsheets, or utility notes, send them with the site address so we can price the right scope.</p>',
          table_data: null,
        },
      ],
    };
  }

  // Hardcoded content for LED Retrofit Services
  if (slug === 'led-retrofit-services') {
    return {
      id: 0,
      slug: 'led-retrofit-services',
      title: 'LED Retrofit Services',
      date: null,
      meta_title: 'LED Retrofit Services Los Angeles',
      meta_description: 'Commercial LED retrofits in Los Angeles and statewide. Reduce lighting energy use, improve fixtures, and handle rebate paperwork.',
      canonical_url: null,
      og_image: null,
      landing_id: 0,
      page_title: 'LED Retrofit Services',
      hero_text: 'Transform your facility\'s lighting while dramatically reducing energy costs. Shaffer Construction provides comprehensive LED retrofit services for businesses statewide. With experience completing thousands of conversions across California, we deliver energy savings of 50-70% while improving light quality and reducing maintenance costs.',
      hero_image: '/ev-charging.mp4',
      sections: [
        {
          section_type: 'info_card',
          heading: 'Energy Cost Savings',
          subheading: '',
          content: 'LED lighting uses up to 75% less energy than traditional lighting. Most businesses see immediate 50-70% reduction in lighting electricity costs. With California\'s high energy rates, ROI typically under 2 years.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Multi-Location Rollouts',
          subheading: '',
          content: 'Specialized expertise in large-scale LED retrofit projects across multiple locations. Standardized products, phased implementation, after-hours installation, and centralized project management for consistent results.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Rebates & Incentives',
          subheading: '',
          content: 'We help identify and apply for all available utility rebates, often covering 20-50% of project costs. Plus federal tax benefits including Section 179D deductions. We handle all rebate paperwork.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Turnkey Service',
          subheading: '',
          content: 'From initial audit through installation and rebate processing, we handle every aspect. Free consultation, comprehensive audits, custom proposals, professional installation, and quality assurance.',
          table_data: null,
        },
        {
          section_type: 'table',
          heading: '',
          subheading: '',
          content: '',
          table_data: {
            headers: ['Lighting Type', 'Energy Savings', 'Lifespan'],
            rows: [
              ['LED vs. Incandescent', 'Up to 75%', '25-50x longer'],
              ['LED vs. Fluorescent', '40-50%', '3-5x longer'],
              ['LED vs. HID/Metal Halide', '50-70%', '2-4x longer'],
            ],
          },
        },
        {
          section_type: 'content',
          heading: 'Transform Your Lighting, Transform Your Bottom Line',
          subheading: '',
          content: 'LED retrofits deliver immediate and substantial returns on investment. Beyond the impressive energy savings, LEDs last significantly longer than traditional lighting, dramatically reducing maintenance costs. With utility rebates often covering 20-50% of project costs and payback periods typically under two years, there\'s never been a better time to upgrade.\n\nWe\'ve successfully completed LED retrofits for thousands of locations across California – from single stores to multi-site rollouts spanning hundreds of facilities. Our proven process ensures minimal disruption to your operations while maximizing energy savings and lighting quality improvements.',
          table_data: null,
        },
        {
          section_type: 'content',
          heading: 'Comprehensive LED Retrofit Services',
          subheading: '',
          content: '• Interior Retrofits: Office troffers, retail track lighting, warehouse high bays, emergency lighting\n• Exterior Upgrades: Parking lot fixtures, building perimeter, canopy lighting, signage illumination\n• Specialty Applications: Cold storage facilities, display cases, specialized task lighting\n• Controls Integration: Dimming systems, occupancy sensors, daylight harvesting, scheduling\n\nOur turnkey service includes free energy audits, ROI calculations, rebate processing, professional installation, and ongoing support. With teams throughout California, we efficiently manage projects from San Diego to Sacramento, maintaining consistent quality and service standards at every location.\n\nContact Shaffer Construction at 323-642-8509 for your free LED retrofit consultation and energy audit.',
          table_data: null,
        },
      ],
    };
  }

  // Hardcoded content for statewide-facilities-maintenance
  if (slug === 'statewide-facilities-maintenance') {
    return {
      slug: 'statewide-facilities-maintenance',
      title: 'Statewide Facilities Maintenance Electrical Services',
      page_title: 'Statewide Facilities Maintenance Electrical Services',
      hero_text: 'Your single-source electrical maintenance partner across California. From emergency repairs to preventive maintenance programs, Shaffer Construction provides comprehensive electrical services for multi-location facilities. Our experienced teams deliver consistent quality whether you manage retail chains, warehouses, or commercial properties throughout the state.',
      hero_image: '/ev-charging.mp4',
      meta_title: 'Facilities Electrical Maintenance California',
      meta_description: 'Multi-site electrical maintenance across California for retail, warehouse, commercial, and facility portfolios. Emergency and scheduled service.',
      sections: [
        {
          section_type: 'info_card',
          heading: 'Emergency Electrical Repairs',
          subheading: '',
          content: '24/7 rapid response teams strategically positioned throughout California. When electrical issues threaten your operations, we\'re ready to deploy experienced technicians to minimize downtime and restore power quickly.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Preventive Maintenance Programs',
          subheading: '',
          content: 'Customized maintenance schedules tailored to your facilities\' needs. Regular inspections, testing, and maintenance prevent costly breakdowns and extend equipment life. One program covers all your California locations.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Lighting Maintenance & Repairs',
          subheading: '',
          content: 'From parking lot lights to interior fixtures, we handle all lighting maintenance. Ballast replacements, LED driver repairs, emergency lighting testing, and fixture upgrades, keeping your facilities bright and safe.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Multi-Location Coverage',
          subheading: '',
          content: 'Single point of contact for all your California facilities. From San Diego to Sacramento, consistent quality and familiar faces at every location. One invoice, one standard of excellence across your entire portfolio.',
          table_data: null,
        },
        {
          section_type: 'table',
          heading: '',
          subheading: '',
          content: '',
          table_data: {
            headers: ['Service Type', 'Response Time', 'Coverage'],
            rows: [
              ['Emergency Repairs', '2-4 hours', '24/7/365 Statewide'],
              ['Preventive Maintenance', 'Scheduled', 'All CA Locations'],
              ['Lighting Services', 'Same/Next Day', 'Interior & Exterior'],
              ['Troubleshooting', '4-8 hours', 'All Electrical Systems']
            ]
          },
        },
        {
          section_type: 'content',
          heading: 'Complete Facilities Maintenance Solutions',
          subheading: '',
          content: 'Complete Facilities Maintenance Solutions\n\nAt Shaffer Construction, we understand that managing electrical systems across multiple facilities requires expertise, reliability, and scalability. Our statewide facilities maintenance program provides comprehensive electrical services for retail chains, warehouses, distribution centers, and commercial properties throughout California. From emergency repairs to preventive maintenance, we keep your operations running smoothly with minimal disruption.',
          table_data: null,
        },
        {
          section_type: 'content',
          heading: 'Industries We Serve',
          subheading: '',
          content: 'Industries We Serve\n\n• Retail Stores: National chains, shopping centers, standalone locations\n• Warehouses: Distribution centers, fulfillment facilities, storage warehouses\n• Commercial Properties: Office buildings, medical facilities, educational institutions\n• Industrial Facilities: Manufacturing plants, production facilities\n• Multi-Family Properties: Apartment complexes, HOAs, property management\n\nMulti-Family Properties: Apartment complexes, HOAs, property management\n\nWhether you need service at one location or one hundred, our infrastructure scales to meet your needs. Single point of contact, unified invoicing, and technology-driven reporting streamline your vendor management while ensuring consistent excellence across your entire portfolio.',
          table_data: null,
        },
      ],
    };
  }

  const db = getDb();
  const page = db.prepare(`
    SELECT p.id, p.slug, p.title, p.date, p.meta_title, p.meta_description, p.canonical_url, p.og_image,
           slp.id as landing_id, slp.page_title, slp.hero_text, slp.hero_image
    FROM pages_all p
    JOIN service_landing_pages slp ON p.id = slp.page_id
    WHERE p.slug = ?
  `).get(slug) as any;

  if (!page) return null;

  // Get sections
  const sections = db.prepare(`
    SELECT section_type, heading, subheading, content, table_data
    FROM service_landing_sections
    WHERE landing_page_id = ?
    ORDER BY section_order
  `).all(page.landing_id) as Array<{
    section_type: string;
    heading: string;
    subheading: string;
    content: string;
    table_data: string | null;
  }>;

  return {
    ...page,
    sections: sections.map(s => ({
      ...s,
      table_data: s.table_data ? JSON.parse(s.table_data) : null,
    })),
  };
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { landing } = await params;
  const page = await getServiceLandingPage(landing);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  const baseUrl = 'https://shaffercon.com';
  const url = `${baseUrl}/${landing}`;
  const ogImage = page.og_image || `${baseUrl}/og-image.jpg`;

  return {
    title: { absolute: page.meta_title || page.title },
    description: page.meta_description || '',
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: page.meta_title || page.title,
      description: page.meta_description || '',
      url: url,
      siteName: 'Shaffer Construction',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: page.meta_title || page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.meta_title || page.title,
      description: page.meta_description || '',
      images: [ogImage],
    },
  };
}

// Page component
export default async function ServiceLandingPage({ params }: PageProps) {
  const { landing } = await params;
  const page = await getServiceLandingPage(landing);

  if (!page) {
    notFound();
  }

  // Generate breadcrumb label from slug
  const breadcrumbLabel = landing
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <main className="w-full overflow-hidden">
      <ServiceLandingSchema
        name={page.page_title || page.title}
        description={page.meta_description || page.hero_text || ''}
        url={`https://shaffercon.com/${landing}`}
      />
      <BreadcrumbSchema
        items={[
          { label: "Home", href: "/" },
          { label: breadcrumbLabel }
        ]}
      />
      {/* Hero Section */}
      {page.hero_image ? (
        landing === 'commercial-electric-vehicle-chargers' ? (
          <>
            {/* Hero Video Section */}
            <section
              className="relative w-full overflow-hidden flex items-center justify-center"
              style={{
                background: "var(--background)",
                height: "100vh",
              }}
            >
              {/* Background Video */}
              <div className="absolute inset-0">
                <SlowMotionVideo
                  src={ASSET_PATH("/commercial-ev-arial.mp4")}
                  poster={ASSET_PATH("/images/posters/commercial-ev-arial.webp")}
                  playbackRate={0.8}
                  brightness={0.4}
                  saturation={0.3}
                />
              </div>

              {/* Overlay for text contrast */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                }}
              />

              {/* Hero Content */}
              <div className="relative z-10 w-full px-6">
                <div className="max-w-5xl mx-auto text-center">
                  <div className="mb-6 flex justify-center">
                    <Breadcrumb items={[{ label: breadcrumbLabel }]} />
                  </div>
                  <h1
                    className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-6"
                    style={{
                      color: "#ffffff",
                      animation: "fadeInUp 0.8s ease-out 0.1s both",
                    }}
                  >
                    {page.page_title || page.title}
                  </h1>
                  {page.hero_text && (
                    <p
                      className="text-base sm:text-lg max-w-3xl mx-auto mb-10 font-light leading-relaxed"
                      style={{
                        color: "#d1d5db",
                        animation: "fadeInUp 0.8s ease-out 0.1s both",
                      }}
                    >
                      {page.hero_text}
                    </p>
                  )}
                </div>
              </div>

              <style>{`
                @keyframes fadeInUp {
                  from {
                    opacity: 0;
                    transform: translateY(30px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </section>

            {/* First Content Card on Blank Background */}
            {page.sections && page.sections[0] && (
              <section
                className="relative w-full overflow-hidden flex items-center justify-center"
                style={{
                  background: "var(--background)",
                  minHeight: "100vh",
                  padding: "4rem 0",
                }}
              >
                <div className="w-full px-6">
                  <Container maxWidth="lg">
                    {page.sections[0].section_type === 'info_card' && (
                      <ContentBox border padding="md">
                        {page.sections[0].heading && (
                          <SectionHeading>{page.sections[0].heading}</SectionHeading>
                        )}
                        {page.sections[0].subheading && (
                          <Subheading>{page.sections[0].subheading}</Subheading>
                        )}
                        {page.sections[0].content && (
                          <div className="prose prose-lg max-w-4xl" style={{ color: "var(--secondary)" }}>
                            <div dangerouslySetInnerHTML={{ __html: page.sections[0].content }} />
                          </div>
                        )}
                      </ContentBox>
                    )}

                    {(page.sections[0].section_type === 'content_block' || page.sections[0].section_type === 'content') && (
                      <div>
                        {page.sections[0].heading && (
                          <SectionHeading>{page.sections[0].heading}</SectionHeading>
                        )}
                        {page.sections[0].subheading && (
                          <Subheading>{page.sections[0].subheading}</Subheading>
                        )}
                        {page.sections[0].content && (
                          <div className="prose prose-lg max-w-4xl" style={{ color: "var(--secondary)" }}>
                            <div dangerouslySetInnerHTML={{ __html: page.sections[0].content }} />
                          </div>
                        )}
                      </div>
                    )}
                  </Container>
                </div>
              </section>
            )}
          </>
        ) : (
          <section className="relative w-full overflow-hidden" style={{ minHeight: "60vh" }}>
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
              <HeroVideo
                src={ASSET_PATH(page.hero_image)}
                poster={ASSET_PATH(`/images/posters/${page.hero_image.replace(/^\//, '').replace(/\.mp4$/, '.webp')}`)}
                ariaLabel={page.page_title || page.title}
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} />

            {/* Content */}
            <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 py-12 sm:py-20 lg:py-28" style={{ paddingTop: "120px" }}>
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-6" style={{ color: "#ffffff" }}>
                  {page.page_title || page.title}
                </h1>
                {page.hero_text && (
                  <p className="text-xl mb-8" style={{ color: "#d1d5db" }}>
                    {page.hero_text}
                  </p>
                )}
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
        )
      ) : (
        <Section border="bottom">
          <Container>
            <Breadcrumb items={[{ label: breadcrumbLabel }]} />
            <PageTitle>{page.page_title || page.title}</PageTitle>
            {page.hero_text && (
              <p className="text-base leading-relaxed mt-4">{page.hero_text}</p>
            )}
          </Container>
        </Section>
      )}

      {/* Second Video Section (ev-charging.mp4) with Second Content Card - Only for Commercial EV Chargers page */}
      {landing === 'commercial-electric-vehicle-chargers' && page.sections && page.sections[1] && (
        <section
          className="relative w-full overflow-visible flex items-center justify-center"
          style={{
            background: "var(--background)",
            height: "100vh",
          }}
        >
          {/* Background Video */}
          <div className="absolute inset-0">
            <SlowMotionVideo
              src={ASSET_PATH("/ev-charging.mp4")}
              poster={ASSET_PATH("/images/posters/ev-charging.webp")}
              playbackRate={1.0}
              brightness={0.4}
            />
          </div>

          {/* Overlay for text contrast */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
          />

          {/* Second Content Section Overlaying Video */}
          <div className="relative z-10 w-full px-6">
            <Container maxWidth="lg">
              {page.sections[1].section_type === 'info_card' && (
                <ContentBox border padding="md">
                  {page.sections[1].heading && (
                    <SectionHeading>{page.sections[1].heading}</SectionHeading>
                  )}
                  {page.sections[1].subheading && (
                    <Subheading>{page.sections[1].subheading}</Subheading>
                  )}
                  {page.sections[1].content && (
                    <div className="prose prose-lg max-w-4xl" style={{ color: "var(--secondary)" }}>
                      <div dangerouslySetInnerHTML={{ __html: page.sections[1].content }} />
                    </div>
                  )}
                </ContentBox>
              )}

              {(page.sections[1].section_type === 'content_block' || page.sections[1].section_type === 'content') && (
                <div>
                  {page.sections[1].heading && (
                    <SectionHeading>{page.sections[1].heading}</SectionHeading>
                  )}
                  {page.sections[1].subheading && (
                    <Subheading>{page.sections[1].subheading}</Subheading>
                  )}
                  {page.sections[1].content && (
                    <div className="prose prose-lg max-w-4xl" style={{ color: "var(--secondary)" }}>
                      <div dangerouslySetInnerHTML={{ __html: page.sections[1].content }} />
                    </div>
                  )}
                </div>
              )}
            </Container>
          </div>
        </section>
      )}

      {/* Third Content Card on Blank Background */}
      {landing === 'commercial-electric-vehicle-chargers' && page.sections && page.sections[2] && (
        <section
          className="relative w-full overflow-hidden flex items-center justify-center"
          style={{
            background: "var(--background)",
            minHeight: "100vh",
            padding: "4rem 0",
          }}
        >
          <div className="w-full px-6">
            <Container maxWidth="lg">
              {page.sections[2].section_type === 'info_card' && (
                <ContentBox border padding="md">
                  {page.sections[2].heading && (
                    <SectionHeading>{page.sections[2].heading}</SectionHeading>
                  )}
                  {page.sections[2].subheading && (
                    <Subheading>{page.sections[2].subheading}</Subheading>
                  )}
                  {page.sections[2].content && (
                    <div className="prose prose-lg max-w-4xl" style={{ color: "var(--secondary)" }}>
                      <div dangerouslySetInnerHTML={{ __html: page.sections[2].content }} />
                    </div>
                  )}
                </ContentBox>
              )}

              {(page.sections[2].section_type === 'content_block' || page.sections[2].section_type === 'content') && (
                <div>
                  {page.sections[2].heading && (
                    <SectionHeading>{page.sections[2].heading}</SectionHeading>
                  )}
                  {page.sections[2].subheading && (
                    <Subheading>{page.sections[2].subheading}</Subheading>
                  )}
                  {page.sections[2].content && (
                    <div className="prose prose-lg max-w-4xl" style={{ color: "var(--secondary)" }}>
                      <div dangerouslySetInnerHTML={{ __html: page.sections[2].content }} />
                    </div>
                  )}
                </div>
              )}
            </Container>
          </div>
        </section>
      )}

      {/* Fourth Video Section (hero video) with Fourth Content Card - Only for Commercial EV Chargers page */}
      {landing === 'commercial-electric-vehicle-chargers' && page.sections && page.sections[3] && (
        <section
          className="relative w-full overflow-visible flex items-center justify-center"
          style={{
            background: "var(--background)",
            height: "100vh",
          }}
        >
          {/* Background Video */}
          <div className="absolute inset-0">
            <SlowMotionVideo
              src={ASSET_PATH(page.hero_image)}
              playbackRate={0.8}
              brightness={0.4}
            />
          </div>

          {/* Overlay for text contrast */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
          />

          {/* Fourth Content Section Overlaying Video */}
          <div className="relative z-10 w-full px-6">
            <Container maxWidth="lg">
              {page.sections[3].section_type === 'info_card' && (
                <ContentBox border padding="md">
                  {page.sections[3].heading && (
                    <SectionHeading>{page.sections[3].heading}</SectionHeading>
                  )}
                  {page.sections[3].subheading && (
                    <Subheading>{page.sections[3].subheading}</Subheading>
                  )}
                  {page.sections[3].content && (
                    <div className="prose prose-lg max-w-4xl" style={{ color: "var(--secondary)" }}>
                      <div dangerouslySetInnerHTML={{ __html: page.sections[3].content }} />
                    </div>
                  )}
                </ContentBox>
              )}

              {(page.sections[3].section_type === 'content_block' || page.sections[3].section_type === 'content') && (
                <div>
                  {page.sections[3].heading && (
                    <SectionHeading>{page.sections[3].heading}</SectionHeading>
                  )}
                  {page.sections[3].subheading && (
                    <Subheading>{page.sections[3].subheading}</Subheading>
                  )}
                  {page.sections[3].content && (
                    <div className="prose prose-lg max-w-4xl" style={{ color: "var(--secondary)" }}>
                      <div dangerouslySetInnerHTML={{ __html: page.sections[3].content }} />
                    </div>
                  )}
                </div>
              )}
            </Container>
          </div>
        </section>
      )}

      {/* Dynamic Sections */}
      {page.sections && (() => {
        const sections = page.sections;
        const renderedIndexes = new Set<number>();

        return sections.map((section: any, index: number) => {
          // Skip if already rendered as part of a group
          if (renderedIndexes.has(index)) return null;

          // Skip first four sections for commercial EV page as they're rendered specially
          if (landing === 'commercial-electric-vehicle-chargers' && (index === 0 || index === 1 || index === 2 || index === 3)) {
            return null;
          }

          // Check if this is the start of a group of consecutive info_cards
          if (section.section_type === 'info_card') {
            const infoCards = [section];
            let nextIndex = index + 1;

            while (nextIndex < sections.length && sections[nextIndex].section_type === 'info_card') {
              infoCards.push(sections[nextIndex]);
              renderedIndexes.add(nextIndex);
              nextIndex++;
            }

            // If we have multiple info cards, render them as a grid
            if (infoCards.length > 1) {
              // Map icons to card headings
              const iconMap: { [key: string]: JSX.Element } = {
                // Facilities maintenance cards
                'Emergency Electrical Repairs': <Zap className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
                'Preventive Maintenance Programs': <Award className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
                'Lighting Maintenance & Repairs': <Zap className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
                'Multi-Location Coverage': <MapPin className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
                // Residential EV charger cards
                'Lightning-Fast Level 2 Charging': <Battery className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
                'Expert Installation & Panel Upgrades': <Wrench className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
                'Works With All Major EV Brands': <Car className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
                'Ongoing Maintenance & Support': <HeadphonesIcon className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
              };

              return (
                <section key={index} className="py-16" style={{ background: "var(--section-gray)" }}>
                  <Container maxWidth="xl">
                    <AppleGrid columns={2} gap="lg">
                      {infoCards.map((card: any, cardIdx: number) => (
                        <AppleCard
                          key={cardIdx}
                          title={card.heading}
                          description={card.content?.replace(/<[^>]*>/g, '') || ''}
                          icon={iconMap[card.heading] || <Zap className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />}
                        />
                      ))}
                    </AppleGrid>
                  </Container>
                </section>
              );
            }

            // Single info card - render normally
            return (
              <Section key={index} padding="md">
                <Container maxWidth="lg">
                  <ContentBox border padding="md">
                    {section.heading && (
                      <SectionHeading>{section.heading}</SectionHeading>
                    )}
                    {section.subheading && (
                      <Subheading>{section.subheading}</Subheading>
                    )}
                    {section.content && (
                      <div className="prose prose-lg max-w-4xl" style={{ color: "var(--secondary)" }}>
                        <div dangerouslySetInnerHTML={{ __html: section.content }} />
                      </div>
                    )}
                  </ContentBox>
                </Container>
              </Section>
            );
          }

          // Content block or content section
          if (section.section_type === 'content_block' || section.section_type === 'content') {
            return (
              <Section key={index} padding="md">
                <Container maxWidth="lg">
                  <div>
                    {section.heading && (
                      <SectionHeading>{section.heading}</SectionHeading>
                    )}
                    {section.subheading && (
                      <Subheading>{section.subheading}</Subheading>
                    )}
                    {section.content && (
                      <div className="prose prose-lg max-w-4xl" style={{ color: "var(--secondary)" }}>
                        <div dangerouslySetInnerHTML={{ __html: section.content }} />
                      </div>
                    )}
                  </div>
                </Container>
              </Section>
            );
          }

          // Table section
          if ((section.section_type === 'comparison_table' || section.section_type === 'table') && section.table_data) {
            return (
              <Section key={index} padding="md">
                <Container maxWidth="lg">
                  <div>
                    {section.heading && (
                      <SectionHeading>{section.heading}</SectionHeading>
                    )}
                    <div className="overflow-hidden rounded-lg border mt-6" style={{ borderColor: "var(--section-border)" }}>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b" style={{ borderColor: "var(--section-border)" }}>
                              {section.table_data.headers.map((header: string, idx: number) => (
                                <th key={idx} className="px-6 py-3 text-left text-sm font-semibold border-r last:border-r-0" style={{ color: "var(--text)", borderColor: "var(--section-border)" }}>
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.table_data.rows.map((row: string[], rowIdx: number) => (
                              <tr key={rowIdx} className="border-b last:border-b-0" style={{ borderColor: "var(--section-border)" }}>
                                {row.map((cell: string, cellIdx: number) => (
                                  <td key={cellIdx} className="px-6 py-4 text-sm border-r last:border-r-0" style={{ color: "var(--secondary)", borderColor: "var(--section-border)" }}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Container>
              </Section>
            );
          }

          // List section
          if (section.section_type === 'list' && section.content) {
            return (
              <Section key={index} padding="md">
                <Container maxWidth="lg">
                  <div>
                    {section.heading && (
                      <SectionHeading>{section.heading}</SectionHeading>
                    )}
                    <div className="prose prose-lg max-w-4xl" style={{ color: "var(--secondary)" }}>
                      <div dangerouslySetInnerHTML={{ __html: section.content }} />
                    </div>
                  </div>
                </Container>
              </Section>
            );
          }

          return null;
        });
      })()}

      {/* CTA Section */}
      <CTA
        heading="Ready to Get Started?"
        text="Contact us today for a consultation!"
        buttonText="Contact Us"
        buttonHref="/contact-us"
      />
    </main>
  );
}
