import type { Metadata } from "next";
import { Section, Container, PageTitle, Paragraph } from "@/app/components/UI";
import { AppleButton } from "@/app/components/UI/AppleStyle";

export const metadata: Metadata = {
  title: "Page Not Found | Shaffer Construction",
  description: "The page you're looking for doesn't exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="w-full">
      <Section padding="lg">
        <Container maxWidth="lg">
          <div className="text-center">
            <PageTitle>404 - Page Not Found</PageTitle>
            <Paragraph className="text-center text-xl mb-8">
              Sorry, we couldn't find the page you're looking for. It may have been moved or no longer exists.
            </Paragraph>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>
                Here are some helpful links:
              </h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="p-6 rounded-lg" style={{ background: "var(--section-gray)", border: "1px solid var(--section-border)" }}>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>Our Services</h3>
                  <p className="text-base mb-4" style={{ color: "var(--secondary)" }}>
                    Browse our electrical services across Los Angeles
                  </p>
                  <AppleButton href="/service-areas/" variant="secondary" size="md">
                    View Service Areas
                  </AppleButton>
                </div>

                <div className="p-6 rounded-lg" style={{ background: "var(--section-gray)", border: "1px solid var(--section-border)" }}>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>EV Charging</h3>
                  <p className="text-base mb-4" style={{ color: "var(--secondary)" }}>
                    Learn about our EV charger installation services
                  </p>
                  <AppleButton href="/commercial-electric-vehicle-chargers/" variant="secondary" size="md">
                    Commercial EV
                  </AppleButton>
                </div>

                <div className="p-6 rounded-lg" style={{ background: "var(--section-gray)", border: "1px solid var(--section-border)" }}>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>Industry Insights</h3>
                  <p className="text-base mb-4" style={{ color: "var(--secondary)" }}>
                    Read our latest articles and electrical tips
                  </p>
                  <AppleButton href="/industry-insights/" variant="secondary" size="md">
                    Visit Blog
                  </AppleButton>
                </div>

                <div className="p-6 rounded-lg" style={{ background: "var(--section-gray)", border: "1px solid var(--section-border)" }}>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>Get in Touch</h3>
                  <p className="text-base mb-4" style={{ color: "var(--secondary)" }}>
                    Contact us for a free consultation
                  </p>
                  <AppleButton href="/contact-us/" variant="secondary" size="md">
                    Contact Us
                  </AppleButton>
                </div>
              </div>
            </div>

            <div>
              <AppleButton href="/" variant="primary" size="lg">
                Return to Homepage
              </AppleButton>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
