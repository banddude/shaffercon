import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { Section, Container, PageTitle, SectionHeading, Subheading, ContentBox, Button } from "@/app/components/UI";
import { AppleHero } from "@/app/components/UI/AppleStyle";
import CTA from "@/app/components/CTA";
import { ASSET_PATH } from "@/app/config";
import { SlowMotionVideo } from "@/app/components/SlowMotionVideo";

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
export default async function ServiceLandingPage({ params }: PageProps) {
  const { landing } = await params;
  const page = await getServiceLandingPage(landing);

  if (!page) {
    notFound();
  }

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
          />
        )
      ) : (
        <Section border="bottom">
          <Container>
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
