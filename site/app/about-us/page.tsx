import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { Section, Container, PageTitle, SectionHeading, Paragraph } from "@/app/components/UI";
import CTA from "@/app/components/CTA";

// Get about page data
async function getAboutPage() {
  const db = getDb();
  const page = db.prepare(`
    SELECT p.id, p.slug, p.title, p.date, p.meta_title, p.meta_description, p.canonical_url, p.og_image
    FROM pages_all p
    WHERE p.slug = 'about-us'
  `).get() as any;

  if (!page) return null;

  const sections = db.prepare(`
    SELECT section_type, heading, content
    FROM page_sections
    WHERE page_id = ?
    ORDER BY section_order
  `).all(page.id) as Array<{
    section_type: string;
    heading: string;
    content: string;
  }>;

  return {
    ...page,
    sections,
  };
}

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();

  if (!page) {
    return {
      title: "About Us",
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
export default async function AboutPage() {
  const page = await getAboutPage();

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

  const paragraphs = fullContentSection?.content
    ? parseParagraphs(fullContentSection.content)
    : [];

  return (
    <main className="w-full">
      {/* Hero Section */}
      {heroSection && heroSection.heading && (
        <Section border="bottom" padding="lg">
          <Container maxWidth="lg">
            <PageTitle>{heroSection.heading}</PageTitle>
          </Container>
        </Section>
      )}

      {/* Main Content */}
      {paragraphs.length > 0 && (
        <Section padding="lg">
          <Container maxWidth="lg">
            <div className="space-y-6 max-w-none">
              {paragraphs.map((para, idx) => (
                <Paragraph key={idx} className="mb-0">
                  {para}
                </Paragraph>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* CTA Section */}
      <CTA />
    </main>
  );
}
