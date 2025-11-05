import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { ASSET_PATH } from "@/app/config";
import {
  AppleSection,
  AppleCard,
  AppleGrid,
} from "@/app/components/UI/AppleStyle";
import { Paragraph } from "@/app/components/UI";
import CTA from "@/app/components/CTA";

type PageSection = {
  section_type: string;
  heading: string | null;
  content: string | null;
  image_url?: string | null;
};

type ServiceLocation = {
  location_name: string;
  location_slug: string;
};

type ServiceAreasPageData = {
  id: number;
  slug: string;
  title: string;
  date: string | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  sections: PageSection[];
  locations: ServiceLocation[];
};

// Get service areas page data
async function getServiceAreasPage() {
  const db = getDb();
  const page = db.prepare(`
    SELECT p.id, p.slug, p.title, p.date, p.meta_title, p.meta_description, p.canonical_url, p.og_image
    FROM pages_all p
    WHERE p.slug = 'service-areas'
  `).get() as any;

  if (!page) return null;

  const sections = db.prepare(`
    SELECT section_type, heading, content, image_url
    FROM page_sections
    WHERE page_id = ?
    ORDER BY section_order
  `).all(page.id) as PageSection[];

  // Get all location pages
  const locations = db.prepare(`
    SELECT location_name, location_slug
    FROM location_pages
    ORDER BY location_name
  `).all() as ServiceLocation[];

  return {
    ...page,
    sections,
    locations,
  };
}

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const page = await getServiceAreasPage();

  if (!page) {
    return {
      title: "Service Areas",
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
export default async function ServiceAreasPage() {
  const page = await getServiceAreasPage() as ServiceAreasPageData | null;

  if (!page) {
    notFound();
  }

  const heroSection = page.sections.find(section => section.section_type === "hero");
  const contentSections = page.sections.filter(section => section.section_type === "content" && section.heading);
  const callOutSection = contentSections.find(section =>
    section.heading?.toLowerCase().includes("call"),
  );
  const highlightSections = contentSections.filter(section =>
    section.heading && !section.heading.toLowerCase().includes("call"),
  );
  const fullContentSection = page.sections.find(section => section.section_type === "full_content");

  const splitParagraphs = (content: string | null) =>
    content
      ? content
          .split(/\n{2,}/)
          .map(paragraph => paragraph.trim())
          .filter(Boolean)
      : [];

  const fullContentParagraphs = splitParagraphs(fullContentSection?.content ?? null);

  const heroParagraph = fullContentParagraphs[0] ?? null;
  const locationPromptParagraph = fullContentParagraphs.find(paragraph =>
    paragraph.toLowerCase().includes("select your location"),
  );
  const ctaParagraph = fullContentParagraphs.find(paragraph =>
    /contact us/i.test(paragraph),
  );

  const highlightParagraphCandidates = fullContentParagraphs.filter(paragraph => {
    if (!paragraph) return false;
    if (paragraph === heroParagraph) return false;
    if (paragraph === locationPromptParagraph) return false;
    if (paragraph === ctaParagraph) return false;
    return true;
  });

  const slugifyHeading = (heading: string, fallback: string) => {
    const normalized = heading.toLowerCase().trim();
    const anchorOverrides: Record<string, string> = {
      "statewide multi-location services": "statewide-services",
    };

    if (anchorOverrides[normalized]) {
      return anchorOverrides[normalized];
    }

    const slug = normalized
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || fallback;
  };

  const buildSectionParagraphs = () => {
    if (highlightSections.length === 0) {
      return [];
    }

    const sectionContent = highlightSections
      .filter(section => section.heading)
      .map(section => ({
        heading: section.heading as string,
        anchorId: slugifyHeading(section.heading as string, `section-${section.section_type}`),
        paragraphs: [] as string[],
      }));

    const usedParagraphIndexes = new Set<number>();

    const keywordScore = (heading: string, paragraph: string) => {
      const keywords = heading
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(word => word.length > 3);
      if (keywords.length === 0) {
        return 0;
      }
      const paragraphText = paragraph.toLowerCase();
      return keywords.reduce((score, word) => (paragraphText.includes(word) ? score + 1 : score), 0);
    };

    sectionContent.forEach((section, sectionIndex) => {
      let bestIndex = -1;
      let bestScore = -1;

      highlightParagraphCandidates.forEach((paragraph, paragraphIndex) => {
        if (usedParagraphIndexes.has(paragraphIndex)) {
          return;
        }

        const score = keywordScore(section.heading, paragraph);

        if (score > bestScore || (score === bestScore && bestIndex === -1)) {
          bestIndex = paragraphIndex;
          bestScore = score;
        }
      });

      if (bestIndex === -1) {
        bestIndex = highlightParagraphCandidates.findIndex((_, index) => !usedParagraphIndexes.has(index));
      }

      if (bestIndex !== -1) {
        section.paragraphs.push(highlightParagraphCandidates[bestIndex]);
        usedParagraphIndexes.add(bestIndex);

        if (highlightParagraphCandidates[bestIndex].trim().endsWith(":")) {
          const supplementalIndex = highlightParagraphCandidates.findIndex(
            (_, index) => !usedParagraphIndexes.has(index),
          );
          if (supplementalIndex !== -1) {
            section.paragraphs.push(highlightParagraphCandidates[supplementalIndex]);
            usedParagraphIndexes.add(supplementalIndex);
          }
        }
      }

      if (section.paragraphs.length === 0) {
        const fallbackParagraph = highlightParagraphCandidates.find(
          (_, index) => !usedParagraphIndexes.has(index),
        );
        if (fallbackParagraph) {
          const fallbackIndex = highlightParagraphCandidates.indexOf(fallbackParagraph);
          section.paragraphs.push(fallbackParagraph);
          usedParagraphIndexes.add(fallbackIndex);
        }
      }
    });

    const unusedParagraphs = highlightParagraphCandidates.filter(
      (_, index) => !usedParagraphIndexes.has(index),
    );
    if (unusedParagraphs.length > 0 && sectionContent.length > 0) {
      sectionContent[0].paragraphs.push(...unusedParagraphs);
    }

    return sectionContent;
  };

  const highlightContent = buildSectionParagraphs();

  const parseHeroHeading = (rawHeading: string | null) => {
    if (!rawHeading) {
      return { tagline: "", heading: page.title };
    }

    const trimmed = rawHeading.trim();
    const match = trimmed.match(/^([A-Z\\s]+)([A-Z][a-z].*)$/);

    if (match) {
      return {
        tagline: match[1].trim(),
        heading: match[2].trim(),
      };
    }

    return {
      tagline: "",
      heading: trimmed,
    };
  };

  const { tagline, heading } = parseHeroHeading(heroSection?.heading ?? null);
  return (
    <main className="w-full">
      {/* Hero Section */}
      <AppleSection title={heading} subtitle={heroParagraph || undefined} padding="xl">
        {heroSection?.image_url && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={ASSET_PATH(heroSection.image_url)}
              alt="Service Areas"
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}
      </AppleSection>

      {/* How We Serve Section */}
      {highlightContent.length > 0 && (
        <AppleSection title="How We Serve California" padding="lg">
          <AppleGrid columns={2} gap="lg">
            {highlightContent.map(section => (
              <AppleCard
                key={section.anchorId}
                title={section.heading}
                description={section.paragraphs.join('\n\n')}
              />
            ))}
          </AppleGrid>
        </AppleSection>
      )}

      {/* Service Areas Grid */}
      {page.locations && page.locations.length > 0 && (
        <AppleSection
          title="Areas We Serve"
          subtitle={locationPromptParagraph || undefined}
          padding="lg"
        >
          <AppleGrid columns={3} gap="lg">
            {page.locations.map(location => (
              <AppleCard
                key={location.location_slug}
                title={location.location_name}
                description={`Professional electrical services in ${location.location_name} and surrounding areas.`}
                href={`/service-areas/${location.location_slug}`}
                cta="View Services"
              />
            ))}
          </AppleGrid>
        </AppleSection>
      )}

      <CTA />
    </main>
  );
}
