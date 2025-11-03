import { notFound } from "next/navigation";
import { getDb, getSiteConfig } from "@/lib/db";
import type { Metadata } from "next";
import ContactForm from "@/app/components/ContactForm";
import { Section, Container, PageTitle, Paragraph } from "@/app/components/UI";

// Get contact page data
async function getContactPage() {
  const db = getDb();
  const page = db.prepare(`
    SELECT p.id, p.slug, p.title, p.date, p.meta_title, p.meta_description, p.canonical_url, p.og_image
    FROM pages_all p
    WHERE p.slug = 'contact-us'
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
  const page = await getContactPage();

  if (!page) {
    return {
      title: "Contact Us",
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
export default async function ContactPage() {
  const page = await getContactPage();
  const siteConfig = getSiteConfig();

  if (!page) {
    notFound();
  }

  return (
    <main className="w-full">
      {/* Hero Section */}
      <Section border="bottom" padding="lg">
        <Container maxWidth="lg">
          <PageTitle>{page.title}</PageTitle>
        </Container>
      </Section>

      {/* Contact Form */}
      <Section padding="lg">
        <Container maxWidth="lg">
          <ContactForm title="Get in Touch" siteConfig={siteConfig} />
        </Container>
      </Section>
    </main>
  );
}
