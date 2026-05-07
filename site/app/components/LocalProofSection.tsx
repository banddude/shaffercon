import { Building2, Car, ClipboardCheck, MapPin, PlugZap, Wrench } from "lucide-react";
import { SectionHeading, Paragraph } from "@/app/components/UI";
import type { LocalSeoFacts } from "@/lib/local-seo";
import { serviceLocalSignals } from "@/lib/local-seo";

interface NearbyArea {
  area_name?: string;
  area_slug?: string;
}

interface LocalProofSectionProps {
  locationName: string;
  locationSlug: string;
  facts: LocalSeoFacts;
  nearbyAreas?: Array<NearbyArea | string>;
  serviceType?: string;
  serviceName?: string;
  serviceDisplayName?: string;
}

function nearbyName(area: NearbyArea | string): string {
  return typeof area === "string" ? area : area.area_name || "";
}

export default function LocalProofSection({
  locationName,
  locationSlug,
  facts,
  nearbyAreas = [],
  serviceType,
  serviceName,
  serviceDisplayName,
}: LocalProofSectionProps) {
  const signals = serviceLocalSignals(serviceType, serviceName, serviceDisplayName, locationName);
  const heading = serviceDisplayName
    ? `${serviceDisplayName} local planning in ${locationName}`
    : `Local electrical planning in ${locationName}`;
  const nearby = nearbyAreas.map(nearbyName).filter(Boolean).slice(0, 5);

  const cards = [
    {
      icon: PlugZap,
      title: "Utility planning",
      text: `${facts.utilityName} service capacity can affect EV chargers, panel upgrades, dedicated circuits, and larger commercial electrical work.`,
    },
    {
      icon: ClipboardCheck,
      title: "Permit path",
      text: facts.permitNote,
    },
    {
      icon: Building2,
      title: "Property context",
      text: facts.propertyContext,
    },
  ];

  return (
    <section
      className="py-12 sm:py-20 lg:py-28 px-6 sm:px-8 lg:px-12"
      style={{ background: "var(--section-gray)" }}
      data-local-seo-section={locationSlug}
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--primary)" }}>
            Local proof
          </p>
          <SectionHeading className="mb-5">{heading}</SectionHeading>
          <Paragraph className="text-lg mb-0">
            Local electrical work is not just a generic service list. In {locationName}, the practical plan depends on the utility, permit path, property type, parking layout, and inspection access before installation starts.
          </Paragraph>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-lg p-6"
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--section-border)",
                }}
              >
                <Icon className="w-8 h-8 mb-4" style={{ color: "var(--primary)" }} />
                <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>
                  {card.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: "var(--secondary)" }}>
                  {card.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
          <div
            className="rounded-lg p-6 sm:p-8"
            style={{
              background: "var(--background)",
              border: "1px solid var(--section-border)",
            }}
          >
            <div className="flex items-start gap-4 mb-5">
              <Wrench className="w-7 h-7 flex-shrink-0 mt-1" style={{ color: "var(--primary)" }} />
              <div>
                <h3 className="text-2xl font-semibold mb-2" style={{ color: "var(--text)" }}>
                  What we check before work starts
                </h3>
                <p className="text-base leading-relaxed" style={{ color: "var(--secondary)" }}>
                  These checks help the page match real local job conditions, and they give customers clearer reasons to call before buying equipment or opening a permit.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {signals.map((signal) => (
                <div key={signal} className="flex gap-3">
                  <ClipboardCheck className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: "var(--primary)" }} />
                  <p className="text-base leading-relaxed mb-0" style={{ color: "var(--secondary)" }}>
                    {signal}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-lg p-6 sm:p-8"
            style={{
              background: "var(--background)",
              border: "1px solid var(--section-border)",
            }}
          >
            <div className="flex items-start gap-4 mb-5">
              <Car className="w-7 h-7 flex-shrink-0 mt-1" style={{ color: "var(--primary)" }} />
              <div>
                <h3 className="text-2xl font-semibold mb-2" style={{ color: "var(--text)" }}>
                  Parking and commercial context
                </h3>
                <p className="text-base leading-relaxed" style={{ color: "var(--secondary)" }}>
                  {facts.parkingContext}
                </p>
              </div>
            </div>
            <p className="text-base leading-relaxed mb-6" style={{ color: "var(--secondary)" }}>
              {facts.commercialContext}
            </p>
            {nearby.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>
                  Nearby service context
                </h3>
                <div className="flex flex-wrap gap-2">
                  {nearby.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                      style={{
                        color: "var(--text)",
                        border: "1px solid var(--section-border)",
                      }}
                    >
                      <MapPin className="w-4 h-4" style={{ color: "var(--primary)" }} />
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
