import type { Metadata } from "next";
import CTA from "@/app/components/CTA";
import { Section, Container, PageTitle, Paragraph } from "@/app/components/UI";
import Breadcrumb from "@/app/components/Breadcrumb";

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://banddude.github.io/shaffercon';
  const url = `${baseUrl}/about-us`;
  const title = "About Us - Los Angeles Electrical Contractor | Shaffer Construction";
  const description = "Learn about Shaffer Construction, Southern California's premier EV charging and electrical installation experts. Serving Los Angeles County with decades of experience.";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Shaffer Construction',
      locale: 'en_US',
      type: 'website',
      images: [`${baseUrl}/og-image.jpg`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
  };
}

// Page component
export default function AboutPage() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <Section border="bottom" padding="lg">
        <Container maxWidth="lg">
          <Breadcrumb items={[{ label: "About Us" }]} />
          <PageTitle>Electricians Servicing Los Angeles County</PageTitle>
        </Container>
      </Section>

      {/* Main Content */}
      <Section padding="lg">
        <Container maxWidth="lg">
          <div className="space-y-6">
            <Paragraph>Specializing in EV Charging & Electrical Installations</Paragraph>

            <Paragraph>At Shaffer Construction, we're not just builders; we're pioneers in the evolving landscape of electrical solutions. Nestled in the heart of Southern California, we've established ourselves as the premier destination for top-tier EV charging and comprehensive electrical installations.</Paragraph>

            <Paragraph>Expertise in EV Charging: As the electric future unfolds, we're at the forefront, offering state-of-the-art EV charging solutions tailored to both residential and commercial needs.</Paragraph>

            <Paragraph>Decades of Electrical Experience: Our team boasts a rich history in electrical installations, ensuring that every project meets the highest standards of safety and efficiency.</Paragraph>

            <Paragraph>Southern California Roots: Our deep understanding of the region's unique needs positions us to serve our community better. We're not just your contractors; we're your neighbors.</Paragraph>

            <Paragraph>We believe in a future where every home and business is equipped with the best electrical solutions. Our commitment is to bring this vision to life, one project at a time. By consistently updating our skills and technologies, we ensure that our clients always receive the most advanced services available.</Paragraph>

            <Paragraph>Whether you're looking to transition to electric vehicle charging or seeking a trusted partner for your next electrical project, Shaffer Construction is here to guide you. Dive into a seamless experience, backed by expertise and a passion for excellence.</Paragraph>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <CTA />
    </main>
  );
}
