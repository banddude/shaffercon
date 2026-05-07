export interface LocalSeoFacts {
  utilityName: string;
  permitOffice: string;
  permitNote: string;
  propertyContext: string;
  parkingContext: string;
  commercialContext: string;
}

const LOS_ANGELES_NEIGHBORHOODS = new Set([
  "atwater-village",
  "boyle-heights",
  "echo-park",
  "highland-park",
  "hollywood",
  "los-feliz",
  "pacific-palisades",
  "sherman-oaks",
  "silver-lake",
  "venice",
]);

function fallbackFacts(locationName: string, locationSlug: string): LocalSeoFacts {
  const isLosAngeles = LOS_ANGELES_NEIGHBORHOODS.has(locationSlug);
  const utilityName = isLosAngeles ? "Los Angeles Department of Water and Power" : "Southern California Edison";
  const permitOffice = isLosAngeles ? "Los Angeles Department of Building and Safety" : `${locationName} building department`;

  return {
    utilityName,
    permitOffice,
    permitNote: `${locationName} electrical projects should account for utility capacity, permit review, inspection timing, and the existing electrical service before equipment is installed.`,
    propertyContext: `${locationName} properties can include older panels, multifamily parking, commercial tenant spaces, and residential electrical systems that need practical capacity review before EV chargers, panels, or dedicated circuits are added.`,
    parkingContext: `Garages, carports, shared parking, driveways, and commercial lots in ${locationName} can affect charger placement, conduit routing, voltage drop, and inspection access.`,
    commercialContext: `Commercial electrical work in ${locationName} often includes lighting, dedicated equipment circuits, troubleshooting, panel service, tenant improvements, and EV charging planning.`,
  };
}

export function getLocalSeoFacts(db: any, locationSlug: string, locationName: string): LocalSeoFacts {
  try {
    const row = db.prepare(`
      SELECT utility_name, permit_office, permit_note, property_context, parking_context, commercial_context
      FROM location_local_seo
      WHERE location_slug = ?
    `).get(locationSlug) as any;

    if (row) {
      return {
        utilityName: row.utility_name,
        permitOffice: row.permit_office,
        permitNote: row.permit_note,
        propertyContext: row.property_context,
        parkingContext: row.parking_context,
        commercialContext: row.commercial_context,
      };
    }
  } catch {
    return fallbackFacts(locationName, locationSlug);
  }

  return fallbackFacts(locationName, locationSlug);
}

export function serviceLocalSignals(
  serviceType: string | undefined,
  serviceName: string | undefined,
  serviceDisplayName: string | undefined,
  locationName: string,
): string[] {
  if (!serviceName || !serviceType || !serviceDisplayName) {
    return [
      `Panel condition, available capacity, grounding, labeling, and service equipment age in ${locationName}.`,
      `Permit path, inspection access, utility coordination, and documentation before work starts.`,
      `Routing, parking, tenant access, finish protection, and long term serviceability for residential and commercial properties.`,
    ];
  }

  const audience = serviceType === "commercial" ? "commercial property teams" : "homeowners";
  const defaults = [
    `${serviceDisplayName} scope, access, permit requirements, and inspection sequencing in ${locationName}.`,
    `Existing panel capacity, feeder condition, grounding, breaker space, and equipment location before installation.`,
    `A practical route for wiring, conduit, controls, labeling, and future maintenance for ${audience}.`,
  ];

  const byService: Record<string, string[]> = {
    "ev-charger-installation": [
      `Available electrical capacity, charger amperage, load management options, and whether ${locationName} properties need a load study before EV charging is added.`,
      `Parking layout, charger placement, conduit route, voltage drop, weather exposure, and inspection access.`,
      `Rebate paperwork, permit documentation, utility service planning, and future charger expansion for ${audience}.`,
    ],
    "electrical-panel-upgrades": [
      `Existing service size, panel condition, feeder limits, breaker availability, and future EV or HVAC loads.`,
      `Utility coordination, shutdown timing, meter equipment, grounding, bonding, labeling, and inspection requirements.`,
      `Whether repair, subpanel work, load management, or a full panel upgrade is the cleanest path for the property.`,
    ],
    "electrical-load-studies": [
      `Existing loads, future EV charging, HVAC, tenant equipment, and service capacity before new electrical work is specified.`,
      `Panel schedules, utility information, equipment nameplates, operating assumptions, and permit documentation.`,
      `Clear recommendations for whether the property can support the project as planned or needs upgrades first.`,
    ],
    "lighting-installation-retrofitting": [
      `Fixture locations, switching zones, dimming, controls, occupancy patterns, and maintenance access.`,
      `Energy savings, utility rebate potential, exterior lighting needs, and safety around parking, entries, and service areas.`,
      `Wiring routes, driver access, fixture standardization, and future maintenance for ${audience}.`,
    ],
    "dedicated-equipment-circuits": [
      `Equipment nameplate requirements, voltage, amperage, breaker size, disconnect needs, and manufacturer instructions.`,
      `Panel capacity, routing, conduit protection, voltage drop, and working clearances before the circuit is installed.`,
      `Labeling, inspection readiness, and serviceability for EV, HVAC, kitchen, shop, studio, or commercial equipment.`,
    ],
    "electrical-troubleshooting-repairs": [
      `Symptoms, affected circuits, equipment history, nuisance trips, heat marks, dead outlets, and intermittent failures.`,
      `Targeted testing at accessible panels, breakers, devices, junctions, and equipment before parts are replaced.`,
      `A repair priority path that separates urgent hazards from practical upgrades and preventive maintenance.`,
    ],
  };

  return byService[serviceName] || defaults;
}

export function serviceDisplayFromSlug(serviceName: string): string {
  return serviceName
    .split("-")
    .map((word) => {
      if (word === "ev") return "EV";
      if (word === "av") return "AV";
      if (word === "led") return "LED";
      if (word === "gfci") return "GFCI";
      if (word === "afci") return "AFCI";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace("Data Network Av", "Data, Network & AV")
    .replace("Data Network AV", "Data, Network & AV")
    .replace("Pool Hot Tub Spa", "Pool, Hot Tub & Spa")
    .replace("Troubleshooting Repairs", "Troubleshooting & Repairs");
}
