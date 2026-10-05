import type { Metadata } from "next";
import {
  Section,
  Container,
  PageTitle,
  SectionHeading,
  Paragraph,
} from "@/app/components/UI";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "RevScroll privacy policy. RevScroll collects no personal information, shows no ads, and includes no tracking of any kind.",
  alternates: {
    canonical: "https://shaffercon.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Section>
        <Container>
          <PageTitle>RevScroll Privacy Policy</PageTitle>
          <Paragraph>Last updated: October 4, 2026.</Paragraph>
          <Paragraph>
            RevScroll is a web browser for iPhone and iPad that plays
            synthesized engine sounds while you scroll. This policy covers the
            RevScroll app only.
          </Paragraph>
        </Container>
      </Section>
      <Section>
        <Container>
          <SectionHeading className="mb-4">What we collect</SectionHeading>
          <Paragraph>
            Nothing. RevScroll has no accounts, no sign-up, no analytics, no
            crash reporting, no advertising, and no tracking. RevScroll does not
            collect, transmit, or sell any personal information.
          </Paragraph>
          <SectionHeading className="mt-8 mb-4">
            What stays on your device
          </SectionHeading>
          <Paragraph>
            Your engine and sound settings, such as engine choice, volume,
            sensitivity, and mute, are saved on your device using standard iOS
            app settings storage. Your browsing history, cookies, and cache
            stay on your device, just as they do in any browser.
          </Paragraph>
          <SectionHeading className="mt-8 mb-4">Browsing the web</SectionHeading>
          <Paragraph>
            RevScroll loads websites with Apple&apos;s WebKit, the same engine
            Safari uses. Websites you visit through any browser handle your
            data according to their own privacy policies, and RevScroll adds
            nothing to that traffic.
          </Paragraph>
          <SectionHeading className="mt-8 mb-4">Children</SectionHeading>
          <Paragraph>
            RevScroll does not knowingly collect any information from anyone,
            including children under 13.
          </Paragraph>
          <SectionHeading className="mt-8 mb-4">Contact</SectionHeading>
          <Paragraph>
            Questions about this policy can go to Mike Shaffer at{" "}
            <a
              href="mailto:mike@shaffercon.com"
              className="underline"
              style={{ color: "var(--primary)" }}
            >
              mike@shaffercon.com
            </a>
            .
          </Paragraph>
        </Container>
      </Section>
    </>
  );
}
