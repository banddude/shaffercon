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
  const serviceSlugs = [
    "backup-generator-installation",
    "breaker-panel-service-maintenance",
    "ceiling-fan-fixture-installation",
    "complete-electrical-rewiring",
    "data-network-av-wiring",
    "dedicated-equipment-circuits",
    "electrical-code-compliance-corrections",
    "electrical-panel-upgrades",
    "electrical-safety-inspections",
    "electrical-troubleshooting-repairs",
    "energy-efficiency-upgrades",
    "ev-charger-installation",
    "exhaust-fan-ventilation-wiring",
    "landscape-outdoor-lighting",
    "lighting-installation-retrofitting",
    "outlet-switch-dimmer-services",
    "pool-hot-tub-spa-electrical",
    "security-motion-lighting",
    "smart-automation-systems",
    "whole-building-surge-protection",
  ];
  const typedServiceSlugs = [
    ...serviceSlugs.map((service) => `commercial-${service}`),
    ...serviceSlugs.map((service) => `residential-${service}`),
  ];
  const serviceAliasRedirects: Record<string, string> = {
    "commercial-electrical-services": "/commercial-service/",
    "residential-electrical-services": "/service-areas/",
    "electrical-load-studies": "/electrical-load-studies/",
    "commercial-load-studies": "/electrical-load-studies/",
    "commercial-load-study-and-analysis": "/electrical-load-studies/",
    "commercial-electrical-code-compliance": "commercial-electrical-code-compliance-corrections",
    "residential-electric-vehicle-charger-installation": "residential-ev-charger-installation",
    "commercial-wiring-and-rewiring": "commercial-complete-electrical-rewiring",
    "commercial-lighting-installation": "commercial-lighting-installation-retrofitting",
    "commercial-lighting-retrofit-and-installation": "commercial-lighting-installation-retrofitting",
    "commercial-led-lighting-retrofit": "commercial-lighting-installation-retrofitting",
    "commercial-emergency-lighting-systems": "commercial-lighting-installation-retrofitting",
    "residential-outdoor-lighting-systems": "residential-landscape-outdoor-lighting",
    "commercial-emergency-backup-generators": "commercial-backup-generator-installation",
    "commercial-surge-protection-systems": "commercial-whole-building-surge-protection",
    "residential-swimming-pool-wiring": "residential-pool-hot-tub-spa-electrical",
    "residential-hvac-integration-and-system-upgrades": "residential-dedicated-equipment-circuits",
    "residential-water-heater-hookups": "residential-dedicated-equipment-circuits",
    "commercial-hardwired-appliance-installation": "commercial-dedicated-equipment-circuits",
    "commercial-electric-heater-installation": "commercial-dedicated-equipment-circuits",
  };
  const directRedirects: Record<string, string> = {
    "/home": "/",
    "/contact": "/contact-us/",
    "/estimator": "/contact-us/",
    "/images": "/",
    "/october-": "/industry-insights/",
    "/author/boldthemes": "/industry-insights/",
    "/shaffercon/rss.xml": "/rss.xml",
    "/https:/www.shaffercon.com": "/",
    "/https:/www.cpsc.gov/news": "/industry-insights/",
    "/service/commercial-service": "/commercial-service/",
    "/service/residential-ev-charger": "/residential-ev-charger/",
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
      function normalizePath(value) {
        var decoded = value;
        try {
          decoded = decodeURIComponent(value);
        } catch (error) {}
        return decoded.replace(/"/g, "").replace(/\\/+/g, "/").replace(/\\/+$/, "").toLowerCase().replace(/\\s+/g, "-");
      }

      function redirect(to) {
        window.location.replace(to);
      }

      function serviceHref(location, service) {
        return "/service-areas/" + location + "/" + service + "/";
      }

      function resolveServiceTarget(location, requestedService) {
        var service = requestedService.toLowerCase().replace(/\\s+/g, "-");
        var aliasTarget = serviceAliasRedirects[service];
        var targetLocation = locationSlugs.has(location) ? location : "hollywood";

        if (aliasTarget) {
          if (aliasTarget.charAt(0) === "/") return aliasTarget;
          return serviceHref(targetLocation, aliasTarget);
        }

        if (typedServiceSlugs.has(service)) {
          return serviceHref(targetLocation, service);
        }

        if (serviceSlugs.has(service)) {
          return serviceHref(targetLocation, "residential-" + service);
        }

        return "";
      }

      function resolveTopicTarget(slug, fallbackToInsights) {
        if (/(panel|subpanel|breaker|zinsco|federal-pacific|fpe|pushmatic|fuse-box)/.test(slug)) {
          return "/service-areas/hollywood/residential-electrical-panel-upgrades/";
        }

        if (/(load-study|load-studies|load-calculation|load-calculations)/.test(slug)) {
          return "/electrical-load-studies/";
        }

        if (/(led|lighting|recessed)/.test(slug)) {
          return "/led-retrofit-services/";
        }

        if (/(^|-)ev($|-)|(^|-)evs($|-)|charger|charging|electric-vehicle|electric-vehicles/.test(slug)) {
          return "/commercial-electric-vehicle-chargers/";
        }

        if (/(commercial|maintenance|inspection|electrical|electrician|repair|code|permit|gfci|gfi|outlet|wiring)/.test(slug)) {
          return "/commercial-service/";
        }

        return fallbackToInsights ? "/industry-insights/" : "";
      }

      var path = normalizePath(window.location.pathname);
      var blogSlugs = new Set(${JSON.stringify(blogSlugs)});
      var locationSlugs = new Set(${JSON.stringify(locationSlugs)});
      var serviceSlugs = new Set(${JSON.stringify(serviceSlugs)});
      var typedServiceSlugs = new Set(${JSON.stringify(typedServiceSlugs)});
      var serviceAliasRedirects = ${JSON.stringify(serviceAliasRedirects)};
      var directRedirects = ${JSON.stringify(directRedirects)};
      var parts = path.split("/").filter(Boolean);
      var slug = parts[parts.length - 1] || "";

      if (directRedirects[path]) {
        redirect(directRedirects[path]);
        return;
      }

      if (parts.length === 1 && blogSlugs.has(slug)) {
        redirect("/industry-insights/" + slug + "/");
        return;
      }

      if (parts.length === 2 && parts[0] === "industry-insights" && blogSlugs.has(slug)) {
        redirect("/industry-insights/" + slug + "/");
        return;
      }

      if (parts.length === 2 && parts[0] === "industry-insights") {
        redirect(resolveTopicTarget(slug, true));
        return;
      }

      if (parts.length === 1 && locationSlugs.has(slug)) {
        redirect("/service-areas/" + slug + "/");
        return;
      }

      if (parts[0] === "service-areas") {
        if (parts.length === 2) {
          if (locationSlugs.has(parts[1])) {
            redirect("/service-areas/" + parts[1] + "/");
            return;
          }

          var rootServiceTarget = resolveServiceTarget("hollywood", parts[1]);
          if (rootServiceTarget) {
            redirect(rootServiceTarget);
            return;
          }
        }

        if (parts.length >= 3) {
          var requestedLocation = parts[1];
          var requestedService = parts[2];
          var requestedTail = parts[parts.length - 1];
          var typedLocationMatch = requestedService.match(/^(commercial|residential)-(.+)$/);

          if (requestedService === "service" && locationSlugs.has(requestedLocation)) {
            redirect("/service-areas/" + requestedLocation + "/");
            return;
          }

          if (locationSlugs.has(requestedService)) {
            redirect("/service-areas/" + requestedService + "/");
            return;
          }

          if (typedLocationMatch && locationSlugs.has(typedLocationMatch[2])) {
            redirect("/service-areas/" + typedLocationMatch[2] + "/");
            return;
          }

          var nestedServiceTarget = resolveServiceTarget(requestedLocation, requestedTail) || resolveServiceTarget(requestedLocation, requestedService);
          if (nestedServiceTarget) {
            redirect(nestedServiceTarget);
            return;
          }
        }
      }

      var rootServiceTarget = parts.length === 1 ? resolveServiceTarget("hollywood", slug) : "";
      if (rootServiceTarget) {
        redirect(rootServiceTarget);
        return;
      }

      var nestedRootServiceTarget = parts.length > 1 ? resolveServiceTarget("hollywood", slug) : "";
      if (nestedRootServiceTarget) {
        redirect(nestedRootServiceTarget);
        return;
      }

      var topicTarget = parts.length === 1 ? resolveTopicTarget(slug, false) : "";
      if (topicTarget) {
        redirect(topicTarget);
        return;
      }

      var dateMatch = path.match(/^\\/(\\d{4})\\/(\\d{2})\\/(\\d{2})\\/(.+)$/);
      if (dateMatch && blogSlugs.has(dateMatch[4])) {
        redirect("/industry-insights/" + dateMatch[4] + "/");
        return;
      }

      if (dateMatch) {
        redirect(resolveTopicTarget(dateMatch[4], true));
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
