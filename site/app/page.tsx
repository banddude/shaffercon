import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { Section, Container, PageTitle, Paragraph, SectionHeading } from "@/app/components/UI";

// Get homepage data
async function getHomePage() {
  const db = getDb();
  const page = db.prepare(`
    SELECT p.id, p.slug, p.title, p.date, p.meta_title, p.meta_description, p.canonical_url, p.og_image
    FROM pages_all p
    WHERE p.slug = 'home'
  `).get() as any;

  if (!page) return null;

  const sections = db.prepare(`
    SELECT section_type, heading, content, image_url
    FROM page_sections
    WHERE page_id = ?
    ORDER BY section_order
  `).all(page.id) as Array<{
    section_type: string;
    heading: string;
    content: string;
    image_url?: string;
  }>;

  return {
    ...page,
    sections,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();

  if (!page) {
    return {
      title: "Home",
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

export default async function Home() {
  const page = await getHomePage();

  if (!page) {
    notFound();
  }

  const heroSection = page.sections?.find((s: any) => s.section_type === 'hero');
  const fullContentSection = page.sections?.find((s: any) => s.section_type === 'full_content');

  // Parse plain text content into paragraphs
  const parseParagraphs = (text: string) => {
    return text
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  };

  let paragraphs = fullContentSection?.content
    ? parseParagraphs(fullContentSection.content)
    : [];

  // Remove first paragraph if it matches the hero heading
  if (
    heroSection?.heading &&
    paragraphs.length > 0 &&
    paragraphs[0] === heroSection.heading
  ) {
    paragraphs = paragraphs.slice(1);
  }

  // Detect headings: short lines (under 80 chars) without punctuation at end
  const isHeading = (text: string) => {
    const trimmed = text.trim();
    return (
      trimmed.length < 80 &&
      !trimmed.match(/[.?!,;:]$/) &&
      trimmed.split(' ').length <= 6 // max 6 words
    );
  };

  return (
    <main className="w-full">
      {/* Hero Section */}
      {heroSection && heroSection.heading && (
        <Section border="bottom" padding="lg">
          <Container maxWidth="lg">
            {heroSection.image_url && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img src={heroSection.image_url} alt="Hero" className="w-full h-auto object-cover max-h-96" />
              </div>
            )}
            <PageTitle>{heroSection.heading}</PageTitle>
          </Container>
        </Section>
      )}

      {/* Content Sections with Images */}
      {page.sections?.filter((s: any) => s.section_type === 'content').map((section: any, idx: number) => (
        <Section key={idx} padding="lg">
          <Container maxWidth="lg">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {section.image_url && (
                <div className="w-full md:w-1/3 flex-shrink-0">
                  <img src={section.image_url} alt={section.heading} className="w-full h-auto rounded-lg object-cover" />
                </div>
              )}
              <div className={section.image_url ? 'w-full md:w-2/3' : 'w-full'}>
                {section.heading && (
                  <SectionHeading className="mb-4">{section.heading}</SectionHeading>
                )}
                {section.content && (
                  <Paragraph>{section.content}</Paragraph>
                )}
              </div>
            </div>
          </Container>
        </Section>
      ))}

      {/* Main Content */}
      {paragraphs.length > 0 && (
        <Section padding="lg">
          <Container maxWidth="lg">
            <div className="space-y-6 max-w-none">
              {paragraphs.map((para, idx) => {
                const heading = isHeading(para);
                return heading ? (
                  <SectionHeading key={idx} className="mb-0">
                    {para}
                  </SectionHeading>
                ) : (
                  <Paragraph key={idx} className="mb-0">
                    {para}
                  </Paragraph>
                );
              })}
            </div>
          </Container>
        </Section>
      )}
    </main>
  );
}
