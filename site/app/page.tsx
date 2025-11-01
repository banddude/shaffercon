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

      {/* Main Content */}
      {fullContentSection?.content && (
        <Section padding="lg">
          <Container maxWidth="lg">
            <Paragraph>{fullContentSection.content}</Paragraph>
          </Container>
        </Section>
      )}
    </main>
  );
}
