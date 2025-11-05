import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { ASSET_PATH } from "@/app/config";
import CTA from "@/app/components/CTA";
import { Section, Container, PageTitle, Paragraph } from "@/app/components/UI";

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
            {heroSection.image_url && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img src={ASSET_PATH(heroSection.image_url)} alt="About Hero" className="w-full h-auto object-cover max-h-96" />
              </div>
            )}
            <PageTitle>{heroSection.heading}</PageTitle>
          </Container>
        </Section>
      )}

      {/* Main Content */}
      {paragraphs.length > 0 && (
        <Section padding="lg">
          <Container maxWidth="lg">
            <div className="space-y-6">
              {paragraphs.map((para, idx) => (
                <Paragraph key={idx}>{para}</Paragraph>
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
