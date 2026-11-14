import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Section, Container, PageTitle, Paragraph } from "@/app/components/UI";

const baseUrl = "https://shaffercon.com";
const title = "Plug Me In Music Video";
const description =
  "A love song about an EV charger. The Shaffer Construction music video, in widescreen and vertical. EV chargers, panel upgrades and electrical work in Los Angeles: (323) 642-8509.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${baseUrl}/plugmein` },
  openGraph: {
    title,
    description,
    url: `${baseUrl}/plugmein`,
    siteName: "Shaffer Construction",
    locale: "en_US",
    type: "video.other",
    images: [`${baseUrl}/videos/plugmein-wide.jpg`],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${baseUrl}/videos/plugmein-wide.jpg`],
  },
};

const videoStyle: CSSProperties = {
  width: "100%",
  height: "auto",
  display: "block",
  borderRadius: "16px",
  background: "#000",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
};

export default function PlugMeInPage() {
  return (
    <>
      <Section>
        <Container>
          <PageTitle>Plug Me In</PageTitle>
          <Paragraph>
            A love song about an EV charger, starring a homeowner, his very patient wife, and one very
            professional Shaffer electrician.
          </Paragraph>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>Widescreen</h2>
          <video
            style={videoStyle}
            src="/videos/plugmein-wide.mp4"
            poster="/videos/plugmein-wide.jpg"
            controls
            playsInline
            preload="metadata"
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>Vertical</h2>
          <div style={{ maxWidth: "420px", margin: "0 auto" }}>
            <video
              style={videoStyle}
              src="/videos/plugmein-vertical.mp4"
              poster="/videos/plugmein-vertical.jpg"
              controls
              playsInline
              preload="metadata"
            />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Paragraph>
            Need an EV charger, a panel upgrade, or a dedicated line of your own? Call Shaffer Construction at{" "}
            <a href="tel:+13236428509" style={{ fontWeight: 700 }}>
              (323) 642-8509
            </a>
            .
          </Paragraph>
        </Container>
      </Section>
    </>
  );
}
