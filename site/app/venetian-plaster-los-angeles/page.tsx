import type { Metadata } from "next";
import { ASSET_PATH } from "@/app/config";
import CTA from "@/app/components/CTA";
import { Section, Container, SectionHeading, Paragraph } from "@/app/components/UI";
import { AppleHero, AppleButton, AppleCard, AppleGrid } from "@/app/components/UI/AppleStyle";
import { BreadcrumbSchema } from "@/app/components/schemas/BreadcrumbSchema";
import { ServiceLandingSchema } from "@/app/components/schemas/ServiceLandingSchema";
import { Layers, Sparkles, Home, Building2, PaintBucket, ScanLine, CheckCircle2 } from "lucide-react";

const baseUrl = "https://shaffercon.com";
const pageUrl = `${baseUrl}/venetian-plaster-los-angeles/`;
const pageTitle = "Venetian Plaster Los Angeles | Decorative Wall Finishes";
const pageDescription = "Venetian plaster and decorative wall finishes in Los Angeles for feature walls, bathrooms, fireplaces, and commercial interiors. See real project photos.";

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: "Shaffer Construction",
    locale: "en_US",
    type: "website",
    images: [{
      url: `${baseUrl}/images/venetian-plaster/venetian-plaster-01.webp`,
      width: 1600,
      height: 955,
      alt: "Hand-applied Venetian plaster decorative wall finish",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [`${baseUrl}/images/venetian-plaster/venetian-plaster-01.webp`],
  },
};

const finishOptions = [
  {
    title: "Venetian & Polished Plaster",
    description: "Hand-troweled decorative finishes with natural movement, depth, and a polished or softly burnished appearance.",
    icon: <Sparkles className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
  },
  {
    title: "Feature & Accent Walls",
    description: "Statement walls for living rooms, entries, dining rooms, stairways, bedrooms, and other focal areas.",
    icon: <Layers className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
  },
  {
    title: "Bathrooms & Specialty Interiors",
    description: "Decorative finish planning for powder rooms, bathroom walls, niches, and other detail-heavy interior surfaces.",
    icon: <Home className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
  },
  {
    title: "Fireplace & Architectural Features",
    description: "Custom plaster finishes for fireplace surrounds, columns, built-ins, curved surfaces, and architectural focal points.",
    icon: <PaintBucket className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
  },
  {
    title: "Commercial Decorative Finishes",
    description: "Plaster feature surfaces for retail, hospitality, office, showroom, and other design-forward commercial interiors.",
    icon: <Building2 className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
  },
  {
    title: "Samples, Color & Texture Planning",
    description: "Finish selection around the room, lighting, substrate, sheen, color, and the amount of movement you want to see in the surface.",
    icon: <ScanLine className="w-12 h-12" style={{ color: "var(--primary)" }} strokeWidth={2} />,
  },
];

const gallery = [
  ["venetian-plaster-01.webp", "Decorative plaster wall with hand-troweled texture and depth"],
  ["venetian-plaster-02.webp", "Polished plaster interior wall with a layered decorative finish"],
  ["venetian-plaster-03.webp", "Venetian plaster feature wall with subtle tonal movement"],
  ["venetian-plaster-04.webp", "Hand-applied decorative plaster on an interior feature surface"],
  ["venetian-plaster-05.webp", "Custom polished plaster wall finish in a residential interior"],
  ["venetian-plaster-06.webp", "Decorative plaster application with a smooth mottled appearance"],
  ["venetian-plaster-07.webp", "Venetian style plaster wall showing natural variation from hand application"],
  ["venetian-plaster-08.webp", "Finished decorative plaster wall with layered color and texture"],
  ["venetian-plaster-09.webp", "Completed polished plaster interior showing reflective depth"],
  ["venetian-plaster-10.webp", "Hand-finished plaster surface for a custom interior"],
  ["venetian-plaster-11.webp", "Decorative plaster bathroom wall finish"],
  ["venetian-plaster-12.webp", "Custom plaster feature wall in a modern interior"],
  ["venetian-plaster-13.webp", "Polished decorative plaster finish in a designed interior space"],
] as const;

const process = [
  "Review the space, wall condition, lighting, dimensions, and design references.",
  "Choose the direction for color, sheen, movement, and texture before the full application begins.",
  "Prepare the substrate so the finished wall reads cleanly instead of telegraphing old damage or poor patching.",
  "Build the finish by hand, adjusting the application to the wall and the intended visual effect.",
  "Complete the final finishing, protection, detail work, and cleanup appropriate to the selected system.",
];

export default function VenetianPlasterPage() {
  return (
    <main className="w-full">
      <ServiceLandingSchema
        name="Venetian Plaster and Decorative Wall Finishes in Los Angeles"
        description={pageDescription}
        url={pageUrl}
      />
      <BreadcrumbSchema
        items={[
          { label: "Home", href: "/" },
          { label: "Venetian Plaster Los Angeles" },
        ]}
      />

      <AppleHero
        title="Venetian Plaster & Decorative Wall Finishes in Los Angeles"
        subtitle="Hand-applied walls with real depth, movement, and texture. Built for spaces where ordinary paint is not the point."
        image={ASSET_PATH("/images/venetian-plaster/venetian-plaster-01.webp")}
        imageAlt="Completed Venetian plaster and decorative wall finish"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <AppleButton href="/contact-us/" variant="primary" size="lg">
            Request a Plaster Quote
          </AppleButton>
          <AppleButton href="tel:3236428509" variant="secondary" size="lg">
            Call (323) 642-8509
          </AppleButton>
        </div>
      </AppleHero>

      <Section padding="lg">
        <Container maxWidth="lg">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <SectionHeading>Decorative Plaster That Looks Hand Made Because It Is</SectionHeading>
            <Paragraph className="text-lg">
              Venetian plaster, polished plaster, and other decorative wall finishes create depth that flat paint cannot reproduce. The surface changes with the light and with the applicator&apos;s hand, which is why the best result starts with the room itself rather than a color chip alone.
            </Paragraph>
            <Paragraph className="text-lg">
              Shaffer Construction coordinates decorative plaster work for Los Angeles homes and commercial interiors, with real specialty-finish experience behind the application. We can help plan the wall condition, finish direction, adjacent construction, lighting, and other details that determine whether the finished surface actually looks intentional.
            </Paragraph>
          </div>
        </Container>
      </Section>

      <section className="py-12 sm:py-20 lg:py-28" style={{ background: "var(--section-gray)" }}>
        <Container maxWidth="xl">
          <SectionHeading className="text-center mb-4">Real Plaster Work</SectionHeading>
          <Paragraph className="text-center text-lg max-w-3xl mx-auto mb-12">
            These are actual completed plaster projects from the specialty applicator behind this service, not stock photography or finish-board renderings.
          </Paragraph>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map(([src, alt], index) => (
              <figure
                key={src}
                className="overflow-hidden rounded-lg"
                style={{ background: "var(--background)", border: "1px solid var(--section-border)" }}
              >
                <img
                  src={ASSET_PATH(`/images/venetian-plaster/${src}`)}
                  alt={alt}
                  width="1200"
                  height="900"
                  loading={index < 3 ? "eager" : "lazy"}
                  decoding="async"
                  className="block w-full h-80 object-cover"
                />
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <Section padding="lg">
        <Container maxWidth="xl">
          <SectionHeading className="text-center mb-12">Venetian Plaster & Decorative Finish Options</SectionHeading>
          <AppleGrid columns={3} gap="lg">
            {finishOptions.map((item) => (
              <AppleCard
                key={item.title}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </AppleGrid>
        </Container>
      </Section>

      <section className="py-12 sm:py-20 lg:py-28" style={{ background: "var(--section-gray)" }}>
        <Container maxWidth="lg">
          <div className="max-w-4xl mx-auto">
            <SectionHeading className="mb-8">How a Decorative Plaster Project Comes Together</SectionHeading>
            <div className="space-y-5">
              {process.map((step, index) => (
                <div key={step} className="flex gap-4 items-start">
                  <CheckCircle2 className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                  <Paragraph className="text-lg">
                    <strong>{index + 1}.</strong> {step}
                  </Paragraph>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Section padding="lg">
        <Container maxWidth="lg">
          <div className="max-w-4xl mx-auto space-y-6">
            <SectionHeading>What Matters Before the First Trowel Hits the Wall</SectionHeading>
            <Paragraph className="text-lg">
              Decorative plaster magnifies the character of a wall, including the good and the bad. Existing texture, patched drywall, corners, trim transitions, moisture exposure, and strong grazing light all affect the finished result. We look at those conditions before treating the surface as ready for finish work.
            </Paragraph>
            <Paragraph className="text-lg">
              For remodels and larger general-building projects, the plaster can also be coordinated with electrical, lighting, framing, drywall, millwork, and other work so finished surfaces are not damaged by trades coming in afterward. Standalone specialty work is structured with the appropriate trade coverage for the project scope.
            </Paragraph>
          </div>
        </Container>
      </Section>

      <CTA
        heading="Have a Wall in Mind?"
        text="Send us photos of the space, approximate dimensions, and a reference for the finish you like. We can start from there."
        buttonText="Request a Plaster Quote"
        buttonHref="/contact-us/"
      />
    </main>
  );
}
