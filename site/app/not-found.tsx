import type { Metadata } from "next";
import { Section, Container, PageTitle, Paragraph } from "@/app/components/UI";
import { AppleButton } from "@/app/components/UI/AppleStyle";
import { getAllPostSlugs } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  const blogSlugs = getAllPostSlugs();
  const locationSlugs = [
    "altadena",
    "atwater-village",
    "beverly-hills",
    "boyle-heights",
    "burbank",
    "culver-city",
    "echo-park",
    "glendale",
    "highland-park",
    "hollywood",
    "inglewood",
    "long-beach",
    "los-feliz",
    "pacific-palisades",
    "pasadena",
    "santa-clarita",
    "santa-monica",
    "sherman-oaks",
    "silver-lake",
    "torrance",
    "venice",
    "west-hollywood",
  ];
  const directRedirects: Record<string, string> = {
    "/home": "/",
    "/contact": "/contact-us/",
    "/ev-charger-installation": "/residential-ev-charger/",
    "/led-retrofit": "/led-retrofit-services/",
    "/led-lighting-installation-los-angeles": "/led-retrofit-services/",
    "/electrical-repairs": "/commercial-service/",
    "/commercial-electrical-safety-inspections": "/commercial-service/",
    "/residential-ev-charger-installation": "/residential-ev-charger/",
    "/breaker-panel-service-maintenance": "/service-areas/hollywood/residential-breaker-panel-service-maintenance/",
    "/service-areas/commercial-breaker-panel-service-maintenance": "/service-areas/hollywood/commercial-breaker-panel-service-maintenance/",
    "/service-areas/breaker-panel-service-maintenance": "/service-areas/hollywood/residential-breaker-panel-service-maintenance/",
    "/service-areas/commercial-exhaust-fan-ventilation-wiring": "/service-areas/hollywood/commercial-exhaust-fan-ventilation-wiring/",
    "/service-areas/pacific-palisades/exhaust-fan-ventilation-wiring": "/service-areas/pacific-palisades/residential-exhaust-fan-ventilation-wiring/",
    "/service-areas/pacific-palisades/exhaust-fan-ventilation-wiring/residential-exhaust-fan-ventilation-wiring": "/service-areas/pacific-palisades/residential-exhaust-fan-ventilation-wiring/",
  };
  const redirectScript = `
    (function () {
      var path = window.location.pathname.replace(/\\/$/, "");
      var blogSlugs = new Set(${JSON.stringify(blogSlugs)});
      var locationSlugs = new Set(${JSON.stringify(locationSlugs)});
      var directRedirects = ${JSON.stringify(directRedirects)};
      var slug = path.split("/").filter(Boolean).pop() || "";

      if (directRedirects[path]) {
        window.location.replace(directRedirects[path]);
        return;
      }

      if (path.split("/").filter(Boolean).length === 1 && blogSlugs.has(slug)) {
        window.location.replace("/industry-insights/" + slug + "/");
        return;
      }

      if (path.split("/").filter(Boolean).length === 1 && locationSlugs.has(slug)) {
        window.location.replace("/service-areas/" + slug + "/");
        return;
      }

      var dateMatch = path.match(/^\\/(\\d{4})\\/(\\d{2})\\/(\\d{2})\\/(.+)$/);
      if (dateMatch && blogSlugs.has(dateMatch[4])) {
        window.location.replace("/industry-insights/" + dateMatch[4] + "/");
      }
    })();
  `;

  return (
    <main className="w-full">
      <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
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
