import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import {
  Section,
  Container,
  PageTitle,
  SectionHeading,
  Grid,
  GridItem,
  Paragraph,
  ContentBox,
} from "@/app/components/UI";
import CTA from "@/app/components/CTA";
import LinkCardGrid from "@/app/components/LinkCardGrid";

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
      <Section border="bottom" padding="md">
        <Container maxWidth="lg">
          {heroSection?.image_url && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img src={heroSection.image_url} alt="Service Areas Hero" className="w-full h-auto object-cover max-h-96" />
            </div>
          )}
          <div className="space-y-6">
            {tagline && (
              <p className="text-sm font-semibold uppercase tracking-[0.25em]">{tagline}</p>
            )}
            <PageTitle>{heading}</PageTitle>
            {heroParagraph && (
              <Paragraph className="max-w-3xl mb-0">
                {heroParagraph}
              </Paragraph>
            )}
          </div>
        </Container>
      </Section>

      {highlightContent.length > 0 && (
        <Section padding="md">
          <Container maxWidth="lg">
            <div className="space-y-12">
              <SectionHeading className="mb-0">How We Serve California</SectionHeading>
              <Grid columns={2} gap="lg">
                {highlightContent.map(section => (
                  <GridItem key={section.anchorId}>
                    <div id={section.anchorId} className="h-full">
                      <ContentBox border padding="md" className="h-full space-y-4">
                        <h3 className="text-2xl font-semibold leading-snug">{section.heading}</h3>
                        {section.paragraphs.map((paragraph, index) => (
                          <Paragraph key={index} className="mb-0">
                            {paragraph}
                          </Paragraph>
                        ))}
                      </ContentBox>
                    </div>
                  </GridItem>
                ))}
              </Grid>
            </div>
          </Container>
        </Section>
      )}

      {page.locations && page.locations.length > 0 && (
        <Section padding="md">
          <Container maxWidth="lg">
            <div className="space-y-6">
              <SectionHeading className="mb-0">Areas We Serve</SectionHeading>
              {locationPromptParagraph && (
                <Paragraph className="max-w-3xl mb-0">{locationPromptParagraph}</Paragraph>
              )}
              <LinkCardGrid
                items={page.locations.map(location => ({
                  label: location.location_name,
                  href: `/service-areas/${location.location_slug}`,
                }))}
                columns={3}
              />
            </div>
          </Container>
        </Section>
      )}

      <CTA />
    </main>
  );
}
