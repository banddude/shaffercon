import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { Section, Container, PageTitle, SectionHeading, Subheading, ContentBox, Button } from "@/app/components/UI";
import { AppleHero } from "@/app/components/UI/AppleStyle";
import CTA from "@/app/components/CTA";
import { ASSET_PATH } from "@/app/config";
import { SlowMotionVideo } from "@/app/components/SlowMotionVideo";
import Breadcrumb from "@/app/components/Breadcrumb";

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

  // Hardcoded content for residential-ev-charger
  if (slug === 'residential-ev-charger') {
    return {
      slug: 'residential-ev-charger',
      title: 'Shaffer Construction: Your Trusted Partner in EV Charging',
      page_title: 'Shaffer Construction: Your Trusted Partner in EV Charging',
      hero_text: 'Shaffer Construction is proud to offer top-tier residential EV charger installation services across California. We specialize in Level 2 charger installations, perfect for homes, apartments, condos, townhouses, and any residential building.',
      hero_image: null,
      meta_title: 'Residential EV Charger Installation | Shaffer Construction',
      meta_description: 'Professional residential EV charger installation services across California. Level 2 charging station installation for homes, apartments, and condos.',
      sections: [
        {
          section_type: 'info_card',
          heading: 'About Level 2 Chargers',
          subheading: null,
          content: 'Level 2 EV chargers use a higher voltage and amperage power source with a NEMA 6 50 receptacle. Most EV owners find they want a faster charge and upgrade to a Level 2 charging station shortly after buying their electric vehicle. A high-speed charging station at home is not just convenient, it\'s a game-changer.',
          table_data: null,
        },
        {
          section_type: 'table',
          heading: null,
          subheading: null,
          content: null,
          table_data: {
            headers: ['Type', 'Power Rating', 'Range added'],
            rows: [['Level 2', '3.3-10 kW/HR', '12-40 miles per hour']],
          },
        },
        {
          section_type: 'content',
          heading: 'Why Choose Shaffer Construction for Your Residential EV Charger Installation?',
          subheading: null,
          content: 'No matter the size of your home, your budget, or your parking setup, we can help you find the right solution. Our team of highly trained, certified electricians is ready to provide you with top-notch service. In addition, we offer maintenance and service for your charger, regardless of whether you originally purchased it from us, to ensure it continues to operate at the highest standards.\n\nGet in touch with Shaffer Construction today and let us help you transition to a more sustainable, electric future.',
          table_data: null,
        },
      ],
    };
  }

  // Hardcoded content for commercial-electric-vehicle-chargers
  if (slug === 'commercial-electric-vehicle-chargers') {
    return {
      id: 1,
      slug: 'commercial-electric-vehicle-chargers',
      title: 'Commercial EV Charger Installation',
      page_title: 'Commercial EV Charger Installation',
      hero_text: "Connect with California's premier commercial electric vehicle charger installation experts. Serving businesses statewide with single-site and multi-location rollouts. At Shaffer Construction, we offer comprehensive EV charging solutions from initial load studies through installation and maintenance. Our experienced team specializes in large-scale deployments for retail chains, warehouses, fleet operations, and commercial properties throughout California.",
      hero_image: '/commercial-ev-hero.mp4',
      meta_title: 'Commercial EV Charger Installation',
      meta_description: "Connect with California's premier commercial electric vehicle charger installation experts. Serving businesses statewide with single-site and multi-location rollouts.",
      canonical_url: null,
      og_image: null,
      sections: [
        {
          section_type: 'info_card',
          heading: 'About Level 2 and DC Fast Chargers',
          subheading: null,
          content: 'When it comes to electric vehicle charging, the choice between Level 2 and DC Fast Chargers is crucial. At Shaffer Construction, we specialize in supplying and installing both Level 2 and DC Fast Chargers for commercial properties. But what sets these charging solutions apart?',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Level 2 Charging Stations',
          subheading: 'Elevate Your EV Charging Experience with Level 2 Chargers',
          content: 'Elevate Your EV Charging Experience with Level 2 Chargers | Level 2 EV chargers harness higher voltage and amperage, featuring a NEMA 6-50 receptacle. Most EV owners choose to upgrade to a Level 2 charging station shortly after purchasing their electric vehicles. It\'s the perfect solution for convenient, high-speed home charging, ideal for the majority of charging needs.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'DC Fast Chargers (DCFC)',
          subheading: 'The Future of Rapid EV Charging',
          content: 'The Future of Rapid EV Charging | DC Fast Chargers (DCFC) represent the pinnacle of EV charging technology. Unlike household power supplies, these chargers offer lightning-fast charging speeds. In as little as half an hour, they can provide an impressive 80% charge, making them the top choice for efficient and speedy charging.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Commercial EV Charger Installation',
          subheading: 'Empowering Your Business with EV Chargers',
          content: 'Empowering Your Business with EV Chargers | Shaffer Construction, California\'s premier commercial electric vehicle charger installer, offers comprehensive services. We provide expert guidance on Level 2 and DC Fast Chargers, supplying top-notch charging station products, and executing installations to ensure your commercial property is fully equipped for the electric future.',
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
              ['Level 2 Chargers', '3.3 – 10 kW', '12 – 40 miles per hour'],
              ['DC Fast Chargers (DCFC)', '25 – 350 kW', 'Up to 250 miles in 30 mins'],
            ],
          },
        },
        {
          section_type: 'content',
          heading: 'Commercial EV Charger Installation',
          subheading: null,
          content: 'At Shaffer Construction, we understand the unique requirements of commercial EV charging infrastructure. Whether you\'re installing chargers at a single location or rolling out a statewide network across multiple facilities, we have the expertise and resources to deliver. Our offerings include Level 2 Chargers (3.3-10 kW) for employee and customer charging, and DC Fast Chargers (25-350 kW) for rapid fleet charging and high-traffic locations. With experience installing chargers for retail chains, warehouses, fleet depots, and commercial properties throughout California, we ensure consistent quality and seamless project management from initial load studies through final commissioning.',
          table_data: null,
        },
        {
          section_type: 'how_we_help',
          heading: 'How We Can Help You',
          subheading: null,
          content: 'Shaffer Construction is California\'s trusted partner for commercial EV charger installations, from single-site projects to statewide rollouts spanning hundreds of locations. Our comprehensive services include professional load studies to assess your electrical capacity, strategic planning for phased deployments, and coordination of multi-site installations with minimal disruption to your operations. We handle everything from utility coordination and permit acquisition to equipment procurement and final commissioning.\n\nOur statewide coverage means consistent quality whether you\'re installing chargers in Los Angeles, San Francisco, San Diego, or anywhere in between. We specialize in large-scale projects for retail chains, distribution centers, fleet operations, and multi-location businesses. With dedicated project managers, experienced installation teams, and ongoing maintenance support, we ensure your EV charging infrastructure operates reliably across all your California locations. Contact Shaffer Construction today at 323-642-8509 to discuss your commercial EV charging needs.',
          table_data: null,
        },
      ],
    };
  }

  // Hardcoded content for electrical-load-studies
  if (slug === 'electrical-load-studies') {
    return {
      slug: 'electrical-load-studies',
      title: 'Professional Electrical Load Study Services',
      page_title: 'Professional Electrical Load Study Services',
      hero_text: 'Make informed decisions about your electrical infrastructure with comprehensive load studies. Essential for EV charger installations, equipment additions, and capacity planning. We deliver professional documentation suitable for engineering review, permit applications, and utility coordination throughout California.',
      hero_image: null,
      meta_title: 'Professional Electrical Load Study Services',
      meta_description: 'Make informed decisions about your electrical infrastructure with comprehensive load studies. Essential for EV charger installations, equipment additions, and capacity planning.',
      sections: [
        {
          section_type: 'info_card',
          heading: 'EV Charging Planning',
          subheading: '',
          content: 'Determine available capacity for Level 2 or DC fast chargers. We provide load management strategies, utility coordination support, and documentation for permits and grants.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Professional Data Analysis',
          subheading: '',
          content: '7-30 day monitoring with professional-grade equipment. Comprehensive measurements of voltage, current, power factor, harmonics, and peak demand with detailed engineering reports.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Engineering Documentation',
          subheading: '',
          content: 'Stamped reports available, detailed load calculations, panel schedules, single-line diagrams, and complete documentation for permits, utilities, and grant applications.',
          table_data: null,
        },
        {
          section_type: 'info_card',
          heading: 'Capacity & Code Compliance',
          subheading: '',
          content: 'Verify available capacity for new equipment, ensure NEC compliance, identify safety issues, and provide actionable recommendations for system optimization and upgrades.',
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
              ['Panel Load Study', '7-14 days', 'Capacity report, recommendations'],
              ['EV Charging Study', '14-21 days', 'Load analysis, utility coordination'],
              ['Service Entrance', '21-30 days', 'Full facility analysis, upgrade plan'],
              ['Power Quality', '7-30 days', 'Harmonic analysis, solutions'],
            ],
          },
        },
        {
          section_type: 'content',
          heading: 'Critical Data for Critical Decisions',
          subheading: '',
          content: 'Critical Data for Critical Decisions\n\nDon\'t guess about your electrical capacity – know for certain. A professional load study provides the data you need to make informed decisions about EV charging infrastructure, equipment additions, and system upgrades. Using industry-leading monitoring equipment from Fluke and Dranetz, we capture comprehensive electrical data over time to accurately assess your system\'s performance and available capacity.',
          table_data: null,
        },
        {
          section_type: 'content',
          heading: 'Comprehensive Load Study Services',
          subheading: '',
          content: 'Comprehensive Load Study Services\n\n• EV Infrastructure: Capacity for Level 2 and DC fast chargers, load management strategies\n• Equipment Planning: Verify capacity for new machinery, HVAC, refrigeration systems\n• Code Compliance: NEC verification, safety assessments, insurance documentation\n• Energy Management: Identify peak demand, power factor issues, cost reduction opportunities\n• Grant Applications: Professional documentation for funding and incentive programs\n\nGrant Applications: Professional documentation for funding and incentive programs',
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
      meta_title: 'LED Retrofit Services',
      meta_description: 'Transform your facility\'s lighting while dramatically reducing energy costs. Shaffer Construction provides comprehensive LED retrofit services for businesses statewide.',
      canonical_url: null,
      og_image: null,
      landing_id: 0,
      page_title: 'LED Retrofit Services',
      hero_text: 'Transform your facility\'s lighting while dramatically reducing energy costs. Shaffer Construction provides comprehensive LED retrofit services for businesses statewide. With experience completing thousands of conversions across California, we deliver energy savings of 50-70% while improving light quality and reducing maintenance costs.',
      hero_image: null,
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
      hero_image: null,
      meta_title: 'Statewide Facilities Maintenance Electrical Services',
      meta_description: 'Your single-source electrical maintenance partner across California. From emergency repairs to preventive maintenance programs, Shaffer Construction provides comprehensive electrical services for multi-location facilities.',
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

  const baseUrl = 'https://banddude.github.io/shaffercon';
  const url = `${baseUrl}/${landing}`;
  const ogImage = page.og_image || `${baseUrl}/og-image.jpg`;

  return {
    title: page.meta_title || page.title,
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
          <AppleHero
            title={page.page_title || page.title}
            subtitle={page.hero_text}
            image={ASSET_PATH(page.hero_image)}
          >
            <div className="mb-6 flex justify-center">
              <Breadcrumb items={[{ label: breadcrumbLabel }]} />
            </div>
          </AppleHero>
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
      {page.sections && page.sections.map((section: any, index: number) => (
        // Skip first four sections for commercial EV page as they're rendered specially
        landing === 'commercial-electric-vehicle-chargers' && (index === 0 || index === 1 || index === 2 || index === 3) ? null :
        <Section key={index} padding="md">
          <Container maxWidth="lg">
            {section.section_type === 'info_card' && (
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
            )}

            {(section.section_type === 'content_block' || section.section_type === 'content') && (
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
            )}

            {(section.section_type === 'comparison_table' || section.section_type === 'table') && section.table_data && (
              <div>
                {section.heading && (
                  <SectionHeading>{section.heading}</SectionHeading>
                )}
                <div className="overflow-x-auto mt-6">
                  <table className="min-w-full border rounded">
                    <thead>
                      <tr className="border-b">
                        {section.table_data.headers.map((header: string, idx: number) => (
                          <th key={idx} className="px-6 py-3 text-left text-sm font-semibold border-r last:border-r-0">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table_data.rows.map((row: string[], rowIdx: number) => (
                        <tr key={rowIdx} className="border-b last:border-b-0">
                          {row.map((cell: string, cellIdx: number) => (
                            <td key={cellIdx} className="px-6 py-4 text-sm border-r last:border-r-0">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {section.section_type === 'list' && section.content && (
              <div>
                {section.heading && (
                  <SectionHeading>{section.heading}</SectionHeading>
                )}
                <div className="prose prose-lg max-w-4xl" style={{ color: "var(--secondary)" }}>
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </div>
              </div>
            )}
          </Container>
        </Section>
      ))}

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
