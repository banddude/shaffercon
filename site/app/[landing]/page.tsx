import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { Section, Container, PageTitle, SectionHeading, Subheading, ContentBox, Button } from "@/app/components/UI";
import CTA from "@/app/components/CTA";

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
           slp.id as landing_id, slp.page_title, slp.hero_text
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
    <main className="w-full">
      {/* Hero Section */}
      <Section border="bottom">
        <Container>
          <PageTitle>{page.page_title || page.title}</PageTitle>
          {page.hero_text && (
            <p className="text-base leading-relaxed mt-4">{page.hero_text}</p>
          )}
        </Container>
      </Section>

      {/* Dynamic Sections */}
      {page.sections && page.sections.map((section: any, index: number) => (
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
                  <div className="prose prose-lg max-w-4xl">
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
                  <div className="prose prose-lg max-w-4xl">
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
                <div className="prose prose-lg max-w-4xl">
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
