import Link from "next/link";
import { FAQPageSchema } from "@/app/components/schemas/FAQPageSchema";
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
  ["venetian-plaster-01.webp", "Warm decorative plaster fireplace wall with recessed illuminated niches"],
  ["venetian-plaster-02.webp", "Dark polished plaster with layered trowel marks and reflected light"],
  ["venetian-plaster-03.webp", "Gray bathroom feature wall surrounding a long mirror and double vanity"],
  ["venetian-plaster-04.webp", "Vertically textured decorative wall with adjacent surfaces masked for work"],
  ["venetian-plaster-05.webp", "Warm gold-toned decorative plaster beside a carved fireplace mantel"],
  ["venetian-plaster-06.webp", "Close-up of gold-toned plaster with visible color movement and a masked opening"],
  ["venetian-plaster-07.webp", "Hand finishing a reflective gold-toned ceiling surface"],
  ["venetian-plaster-08.webp", "Decorative bathroom wall with deep texture and three illuminated niches"],
  ["venetian-plaster-09.webp", "Hand application of a pale finish around a curved interior opening"],
  ["venetian-plaster-10.webp", "Pale polished feature wall with light reflecting across its surface"],
  ["venetian-plaster-11.webp", "Gray decorative plaster bathroom walls beside a long mirror and pendant lights"],
  ["venetian-plaster-12.webp", "Light-toned curved interior with arched openings and a chandelier"],
  ["venetian-plaster-13.webp", "Gray wall finish surrounding an illuminated accessories display"],
] as const;

const process = [
  "Review the space, wall condition, lighting, dimensions, and design references.",
  "Choose the direction for color, sheen, movement, and texture before the full application begins.",
  "Prepare the substrate so the finished wall reads cleanly instead of telegraphing old damage or poor patching.",
  "Build the finish by hand, adjusting the application to the wall and the intended visual effect.",
  "Complete the final finishing, protection, detail work, and cleanup appropriate to the selected system.",
];

const guides = [
  { href: "/industry-insights/venetian-plaster-vs-limewash-los-angeles/", title: "Venetian plaster vs. limewash", description: "Compare movement, texture, sheen, samples, and preparation before choosing your wall finish." },
  { href: "/industry-insights/venetian-plaster-cost-factors-los-angeles/", title: "What affects a plaster estimate?", description: "Understand how wall condition, access, niches, and finish details shape the scope." },
  { href: "/industry-insights/venetian-plaster-bathrooms-fireplaces-design-guide/", title: "Bathrooms and fireplace walls", description: "Explore specialty-area design ideas and the questions to resolve before installation." },
];

const plasterFaqs = [
  { question: "What affects the cost of Venetian plaster in Los Angeles?", answer: "Wall area is only part of the scope. Existing texture and repairs, ceiling height, access, sample development, the chosen finish, niches, and edge details all affect the work. Send photos, dimensions, and references so the estimate can be based on your actual space." },
  { question: "Can decorative plaster be applied over an existing painted wall?", answer: "The existing surface needs to be assessed for soundness, texture, repairs, and compatibility with the selected finish system. Preparation may include repairs, smoothing, and the specified primer. A decorative coat is not a substitute for correcting an underlying moisture or substrate problem." },
  { question: "Can I use Venetian plaster in a bathroom or shower?", answer: "Bathroom walls and direct-water shower areas require different planning. Wet areas need a specified, compatible waterproofing and finish system, with manufacturer-approved details. We review the location and exposure before selecting materials; a decorative plaster finish alone is not proof of waterproofing." },
  { question: "How long does a decorative plaster project take?", answer: "The schedule depends on preparation, area, finish complexity, access, and the selected product's drying and curing requirements. We establish the sequence after reviewing the scope and sample direction rather than promising the same duration for every room." },
  { question: "How do I choose the color and amount of texture?", answer: "Start with a few references, then review a sample beside the room's other finishes in daylight and evening light. Approve the movement and sheen as well as the color. A small accent wall, broad living-room surface, and curved feature can need different approaches." },
  { question: "How should I clean and maintain a plaster finish?", answer: "Follow the care instructions for the specific plaster and protective treatment. Ask which cleaners are compatible, how splashes should be handled, and what a future touch-up would involve. Keep the approved sample and finish specification with your project records." },
];

export default function VenetianPlasterPage() {
  return (
    <main className="w-full">
      <FAQPageSchema faqs={plasterFaqs} />
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
          <SectionHeading className="text-center mb-4">Shaffer Construction Plaster Portfolio</SectionHeading>
          <Paragraph className="text-center text-lg max-w-3xl mx-auto mb-12">
            Explore polished surfaces, hand-applied texture, warm feature walls, and sculpted interior details. Use these photographs to show us the movement, sheen, and character you want in your space.
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
                <figcaption className="px-4 py-3 text-sm" style={{ color: "var(--secondary)" }}>{alt}</figcaption>
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

      <Section padding="lg">
        <Container maxWidth="lg">
          <SectionHeading className="mb-8">Three Ways to Let the Finish Shape the Room</SectionHeading>
          <div className="space-y-7">
            <div><h3 className="text-2xl font-bold mb-3">Warmth around a fireplace</h3><Paragraph>The warm-toned fireplace wall in the portfolio pairs a broad decorative surface with dark openings and softly lit niches. The finish brings movement to a clean architectural composition. Consider this direction when you want one feature to anchor the room.</Paragraph></div>
            <div><h3 className="text-2xl font-bold mb-3">Light across a gray bathroom wall</h3><Paragraph>Gray plaster beside a pale vanity and long mirror shows how light can reveal subtle variation. The effect comes from the relationship between surface, reflection, and fixtures. Bring your lighting and countertop choices into the sample discussion.</Paragraph></div>
            <div><h3 className="text-2xl font-bold mb-3">A softer look for curved interiors</h3><Paragraph>Light-toned finishes around arches and curved openings create a quieter backdrop for furnishings and decorative lighting. Review how the finish will turn around edges and transitions, not just how a flat sample looks.</Paragraph></div>
          </div>
        </Container>
      </Section>

      <Section padding="lg">
        <Container maxWidth="xl">
          <SectionHeading className="mb-8">Plan Your Plaster Project</SectionHeading>
          <div className="grid gap-6 md:grid-cols-3">
            {guides.map(guide => <Link key={guide.href} href={guide.href} className="rounded-lg border p-6" style={{ borderColor: "var(--section-border)" }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: "var(--primary)" }}>{guide.title}</h3>
              <p style={{ color: "var(--secondary)" }}>{guide.description}</p>
            </Link>)}
          </div>
        </Container>
      </Section>

      <Section padding="lg">
        <Container maxWidth="lg">
          <SectionHeading className="mb-8">Venetian Plaster Questions</SectionHeading>
          <div className="space-y-6">{plasterFaqs.map(faq => <div key={faq.question}>
            <h3 className="text-xl font-bold mb-2">{faq.question}</h3><Paragraph>{faq.answer}</Paragraph>
          </div>)}</div>
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
