import { notFound } from "next/navigation";
import { getDb, getSiteConfig } from "@/lib/db";
import type { Metadata } from "next";
import ContactForm from "@/app/components/ContactForm";

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>

      {page.sections && page.sections.map((section: any, index: number) => (
        <div key={index} className="mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {section.image_url && (
              <div className="w-full md:w-1/3 flex-shrink-0">
                <img src={section.image_url} alt={section.heading} className="w-full h-auto rounded-lg object-cover" />
              </div>
            )}
            <div className={section.image_url ? 'w-full md:w-2/3' : 'w-full'}>
              {section.heading && (
                <h2 className="text-2xl font-bold mb-4">{section.heading}</h2>
              )}
              {section.content && (
                <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: section.content }} />
              )}
            </div>
          </div>
        </div>
      ))}

      <ContactForm title="Get in Touch" siteConfig={siteConfig} />
    </div>
  );
}
