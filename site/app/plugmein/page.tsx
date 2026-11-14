import type { Metadata } from "next";
import { Section, Container, PageTitle, Paragraph } from "@/app/components/UI";
import OrientationVideo from "./OrientationVideo";

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


// The site's global CSS hides native video controls (for background hero videos).
// Bring them back for these two videos only.
const showControlsCss = `
video.plugmein-video::-webkit-media-controls,
video.plugmein-video::-webkit-media-controls-enclosure,
video.plugmein-video::-webkit-media-controls-panel,
video.plugmein-video::-webkit-media-controls-overlay-play-button,
video.plugmein-video::-webkit-media-controls-start-playback-button,
video.plugmein-video::-webkit-media-controls-fullscreen-button,
video.plugmein-video::-webkit-media-controls-picture-in-picture-button {
  display: revert !important;
  opacity: revert !important;
  pointer-events: revert !important;
  appearance: revert !important;
}`;

export default function PlugMeInPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: showControlsCss }} />
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
          <OrientationVideo />
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
