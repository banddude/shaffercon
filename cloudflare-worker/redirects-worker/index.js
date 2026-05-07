/**
 * Cloudflare Worker for ShafferCon SEO redirects.
 *
 * This worker exists because the site is statically exported to GitHub Pages.
 * Next.js middleware and the rendered 404 page cannot create real HTTP 301s
 * after export, so legacy URL cleanup has to happen at Cloudflare.
 *
 * Generated from current site routes on 2026-05-07.
 */

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

const BLOG_SLUGS = new Set([
  "2024-ev-charger-installations-key-incentives-and-innovations-transforming-the-industry",
  "2025-ev-sales-decline-2026-outlook-new-models-china-price-war-charger-tax-credit-deadline",
  "300k-used-ev-lease-returns-ionna-circle-k-350-sites-lexus-es-ev-debut-mercedes-cla-fastest-charging-tesla-cybercab-production",
  "a-closer-look-at-our-load-study-services-and-why-your-ev-business-needs-them",
  "ac-charging-network-ev-tax-credits-ford-30k-pickup-tesla-fsd-market-forecast",
  "accelerating-electric-vehicle-adoption-the-importance-of-expanding-ev-charger-infrastructure",
  "accelerating-ev-adoption-the-latest-trends-in-los-angeles-charging-infrastructure-and-what-they-mean-for-your-property",
  "advancements-in-electric-vehicle-charging-trends-innovations-and-their-impact-on-urban-development",
  "advancements-in-ev-charger-installations-building-the-future-of-electric-vehicle-infrastructure",
  "advancing-electric-vehicle-infrastructure-in-los-angeles-the-role-of-shaffer-construction-inc",
  "afci-installation-electrical-safety",
  "afci-vs-gfci-circuit-protection-los-angeles",
  "aluminum-wiring-replacement-key-considerations-and-safety-tips",
  "autel-nayax-100k-contactless-payments-multifamily-charging-solutions-catl-sodium-ion-ai-grid-integration",
  "bathroom-electrical-safety-gfci-requirements",
  "bmw-ix3-preorders-61500-434-mile-range-greenlane-texas-i-45-truck-charging-blink-emobi-roaming-soda-mountain-solar-cybercab-ramp",
  "boost-your-business-with-ev-charging-stations-a-guide",
  "boosting-local-economy-and-sustainability-the-impact-of-expanding-ev-charging-stations-in-los-angeles",
  "building-a-sustainable-future-the-importance-of-expanding-ev-charging-infrastructure-in-los-angeles",
  "building-a-sustainable-future-the-role-of-shaffer-construction-in-los-angeles-ev-charging-infrastructure-expansion",
  "byd-home-charger-sharing-pennsylvania-turnpike-nevi-eu-2035-goals-watered-down-snowbird-ski-resort-holiday-charging",
  "byd-overtakes-tesla-ev-winter-range-improvements-workplace-charging-growth-pennsylvania-nevi",
  "byd-overtakes-tesla-kia-ev3-usa-nevi-funding-battle-hoboken-jolt-leapmotor-europe",
  "california-200000-ev-chargers-oregon-fleet-rebate-germany-truck-charging-electrify-america-simon-tesla-2025-deliveries",
  "california-2026-building-code-ev-charging-requirements-home-real-estate-trend-32-new-models",
  "california-title-24-electrical-requirements-renovations",
  "californias-ev-charging-boom-how-los-angeles-is-leading-the-electric-vehicle-infrastructure-revolution",
  "californias-ev-charging-buildout-what-los-angeles-building-owners-renters-and-fleets-should-know",
  "case-study-how-our-electrical-services-boosted-a-local-la-business",
  "cec-v2g-bidirectional-charging-roadmap-stellantis-nacs-supercharger-access-mangrove-lithium-refinery-ford-ev-restructuring-hyundai-kia-10k-discounts",
  "ceiling-fan-installation-benefits-aesthetics",
  "ces-2026-mercedes-electric-glc-chargepoint-600kw-used-ev-deals-afeela-tesla-robotaxi",
  "chargepoint-south-coast-aqmd-55-units-everged-zero-cost-swap-tesla-v4-500kw-florida-wireless-highway-donut-lab-solid-state",
  "china-1500kw-charging-gap-ev-consideration-11-percent-toyota-lexus-q1-record-ev-prices-record-low-gap-tesla-supercharger-market-share",
  "china-mandatory-ev-efficiency-rules-genesis-gv60-nacs-pennsylvania-nevi-slate-truck-discontinued-evs",
  "christmas-light-safety-maintenance-tips",
  "circuit-breaker-tips-repair-safety",
  "cloth-wiring-safety-upgrade",
  "colliers-envirospark-chargepoint-express-grid-wyoming-ev-marketplace-tesla-lost-hills-2025-technology-breakthroughs",
  "commercial-electrical-code-compliance-los-angeles",
  "commercial-electrical-systems-navigating-the-complexities",
  "commercial-electrician-ev-charging-safety",
  "commercial-ev-charger-installation-cost-los-angeles",
  "commercial-ev-charging-stations-roi-guide-los-angeles",
  "common-electrical-problems-older-los-angeles-homes",
  "complete-guide-electrical-panel-upgrades-los-angeles",
  "complete-home-led-lighting-upgrade-guide",
  "court-ruling-reopens-nevi-funds-jd-power-home-charging-costs-rise-san-francisco-curbside-program-toyota-dual-voltage-charger-electrify-america-bess",
  "critical-ev-charging-infrastructure-developments-600kw-ultra-fast-charging-launch-reliability-crisis-exposed-california-surpasses-200000-chargers-federal-heavy-duty-investment-and-municipal-gran",
  "customized-electrical-solutions-for-unique-home-designs",
  "dedicated-circuits-when-why-home-appliances-need-them",
  "do-i-need-panel-upgrade-install-ev-charger",
  "dodge-charger-nacs-tesla-supercharger-byd-megawatt-technology-year-environmental-groups-lawsuit-electrify-america-dual-cable",
  "efficient-energy-tips-for-a-greener-la-holiday-season",
  "el-segundo-electrician-services-contractor",
  "electric-services-brentwood-ca-experts",
  "electric-vehicle-charging-in-los-angeles-key-insights-and-future-trends",
  "electric-vehicles-mitsubishi-chargers",
  "electric-water-heater-installation-requirements-costs",
  "electrical-innovations-green-construction",
  "electrical-load-studies-what-they-are-los-angeles",
  "electrical-load-study-cost-los-angeles",
  "electrical-safety-inspection-checklist-los-angeles",
  "electrical-safety-tips-home",
  "electrical-service-upgrade-100-to-200-amp-guide",
  "electrical-services-rancho-palos-verdes",
  "electrical-solutions-property-restoration",
  "electrical-tips-new-construction",
  "electrical-troubleshooting-basics-homeowners",
  "electrical-upgrade-benefits-signs",
  "electrician-altadena-ca-your-local-electrical-service-experts",
  "electrician-canyon-country-solutions-services",
  "electrician-chatsworth-ca-electrical-services",
  "electrician-el-monte-expert-services",
  "electrician-inglewood-services-expert",
  "electrician-irwindale-ca-skilled-electrical-assistance-for-your-projects",
  "electrician-lawndale-ca-trusted-local-electrical-services",
  "electrician-monrovia-ca-comprehensive-electrical-solutions-for-you",
  "electrician-monterey-park-services-installation",
  "electrician-moorpark-ca-dedicated-electrical-expertise-for-your-needs",
  "electrician-pasadena-ev-chargers",
  "electrician-redondo-beach-ev-charger",
  "electrician-san-gabriel-vehicle-charging",
  "electrician-san-marino-ca-services",
  "electrician-services-agoura-hills-ev",
  "electrician-services-laguna-niguel-ca",
  "electricians-baldwin-park-ev-installation",
  "electricitys-impact-on-sustainable-construction-practices",
  "emergency-electrical-repairs-when-to-call-electrician",
  "emerging-trends-and-challenges-in-ev-charging-infrastructure-what-you-need-to-know",
  "emerging-trends-in-ev-charger-installation-and-infrastructure",
  "emerging-trends-in-ev-charging-infrastructure-innovations-and-challenges-ahead",
  "energy-saving-tips-home-efficiency",
  "energy-saving-tips-home-usage",
  "ev-charger-installation-and-infrastructure-what-every-los-angeles-property-owner-needs-to-know",
  "ev-charger-installation-guide",
  "ev-charger-installation-guide-for-los-angeles-plan-permit-install-and-futureproof",
  "ev-charger-installation-in-los-angeles-the-2024-guide-to-home-public-and-commercial-solutions",
  "ev-charger-installation-in-los-angeles-what-property-owners-need-to-know",
  "ev-charger-installation-infrastructure-how-to-decide-pay-for-and-plan-your-project",
  "ev-charging-70000-ports-nevi-reboots-california-79m-grants-v2g-mainstream",
  "ev-charging-acceleration-november-2025-chargepoint-sourcewell-illinois-funding-global-technology-showcase-workplace-charging-growth-and-california-fast-charge-initiatives",
  "ev-charging-expansion-in-los-angeles-essential-trends-technology-and-tips-for-property-owners-and-businesses",
  "ev-charging-for-property-owners-whats-improving-what-still-matters-a-guide-from-shaffer-construction-inc",
  "ev-charging-in-2024-essential-trends-and-installation-tips-for-homeowners-businesses-in-los-angeles",
  "ev-charging-in-2025-latest-trends-challenges-and-solutions-for-homeowners-and-businesses-in-los-angeles",
  "ev-charging-in-2025-what-homeowners-property-managers-and-businesses-need-to-know",
  "ev-charging-in-california-types-installation-challenges-and-future-proof-solutions-for-homes-and-businesses",
  "ev-charging-in-california-what-property-owners-need-to-know-about-fast-chargers-funding-and-air-quality",
  "ev-charging-in-los-angeles-costs-grid-programs-v2g-and-how-to-avoid-common-installation-regrets",
  "ev-charging-in-los-angeles-key-trends-incentives-and-installation-tips-for-property-owners",
  "ev-charging-in-los-angeles-where-the-network-is-headed-and-how-property-owners-can-prepare",
  "ev-charging-in-the-u-s-trends-policy-shifts-and-solutions-for-homes-businesses-and-multifamily-buildings-in-los-angeles",
  "ev-charging-infrastructure-accelerates-america-achieves-record-20-growth-nacs-universal-adoption-maryland-5-million-funding-270kw-wireless-breakthrough-and-california-incentive-evolution",
  "ev-charging-infrastructure-breakthrough-developments-france-pioneers-300kw-dynamic-wireless-highway-charging-tesla-v4-achieves-500kw-operational-deployment-china-accelerates-toward-28-million-facil",
  "ev-charging-infrastructure-funding-standards-maintenance-and-what-los-angeles-property-owners-should-know",
  "ev-charging-infrastructure-in-2025-growth-innovation-and-the-road-ahead",
  "ev-charging-infrastructure-in-2025-what-property-owners-in-los-angeles-need-to-know",
  "ev-charging-infrastructure-in-california-latest-trends-challenges-and-solutions-for-homeowners-and-businesses",
  "ev-charging-infrastructure-network-milestones-65000-us-ports-illinois-funding-tesla-v4-technology-nevi-streamlining-and-google-maps-integration-shape-november-2025-market",
  "ev-charging-infrastructure-roundup-ionna-250m-california-investment-wireless-highway-charging-tesla-supercharger-growth",
  "ev-charging-infrastructure-transformation-colorado-nevi-funding-tesla-ai-platform-record-supercharger-expansion-pennsylvania-certification-and-wireless-charging-growth",
  "ev-charging-infrastructure-trends-2024-innovations-accessibility-and-business-benefits-for-california-and-beyond",
  "ev-charging-infrastructure-update-nevi-milestones-tesla-record-expansion-and-growing-infrastructure-demands",
  "ev-charging-infrastructure-update-record-u-s-expansion-pennsylvania-nevi-leadership-global-growth-and-innovative-streetlight-solutions",
  "ev-charging-revolution-reliability-challenges-california-milestones-and-next-generation-technologies-reshaping-los-angeles-infrastructure",
  "ev-charging-stations-in-los-angeles-air-quality-placement-and-reliable-infrastructure-a-guide-for-property-owners",
  "ev-charging-summit-execution-era-grid-delays-87-billion-stellantis-supercharger-evgo-growth",
  "ev-charging-technology-breakthroughs-transform-infrastructure-landscape-wireless-charging-efficiency-gains-market-growth-projections-ultra-fast-breakthroughs-and-small-business-support-programs-dr",
  "ev-infrastructure-evolution-accelerates-tesla-multipass-european-expansion-federal-incentive-expiration-impact-california-leadership-milestone-france-wireless-highway-charging-breakthrough-and-co",
  "ev-infrastructure-innovation-week-streetlight-charging-breakthrough-tesla-500kw-v4-launch-chinas-50-market-share-milestone-reliability-challenges-and-wireless-charging-growth",
  "ev-policy-transformation-federal-tax-credit-expiration-california-hov-access-ends-record-29-market-share-600kw-charging-coming-and-nevi-program-expansion",
  "ev-realty-76-port-truck-hub-san-bernardino-gas-prices-ev-demand-surge-california-nevi-ruling-tesla-q1-deliveries-kia-14-ev-models",
  "ev-technology-breakthroughs-solid-state-batteries-v2g-charging-and-nacs-standardization-transform-los-angeles-infrastructure",
  "evgo-record-growth-electrify-america-road-trip-charging-reliability-improves-california-incentives",
  "evs-sweep-world-car-awards-bmw-ix3-california-charger-reliability-standards-rivian-r2-deliveries-senate-charging-costs-bill",
  "expanding-electric-vehicle-charging-infrastructure-a-look-at-california-and-beyond",
  "expanding-electric-vehicle-charging-infrastructure-key-developments-and-community-efforts",
  "expanding-ev-charging-infrastructure-current-trends-challenges-and-future-investment",
  "expert-christmas-light-installation-services-in-los-angeles",
  "exploring-shaffer-constructions-load-study-services-in-la",
  "exploring-the-benefits-of-solar-power-integration-in-electrical-systems",
  "exploring-the-rapid-growth-and-key-trends-in-ev-charging-infrastructure-in-2023",
  "fall-into-savings-efficient-electricity-use-in-autumn",
  "federal-30c-ev-charger-tax-credit-deadline-byd-flash-charging-walmart-network-simon-loos-fleet-uber-rivian-robotaxi",
  "federal-pacific-zinsco-panels-replacement-los-angeles",
  "ford-19-billion-ev-writedown-lightning-canceled-byd-overtakes-tesla-factorial-solid-state-battery-electrify-america-charge-limit",
  "ford-employee-pricing-free-chargers-kia-ev6-5k-cut-plug-charge-volvo-plug-charge-tesla-fsd-10-billion-miles-municipal-rate-reset",
  "from-design-to-maintenance-the-life-cycle-of-electric-vehicle-installations",
  "fuse-box-upgrade-guide",
  "fuses-101-essential-tips-for-handling-and-replacement",
  "garbage-disposal-maintenance-safety-tips",
  "generator-installations-power-security-for-your-home-or-business",
  "gfci-safety-installation-guide",
  "gfi-electrical-outlets-ensuring-safety-in-your-electrical-setup",
  "gfi-safety-and-maintenance-essential-tips-for-homeowners",
  "holiday-lighting-installation-safety-best-practices",
  "home-electrical-safety-best-practices",
  "home-electrical-tips-safety",
  "home-panel-upgrade-guide",
  "house-rewire-tips-safety-reliability",
  "house-surge-protectors-tips-for-selection-and-installation",
  "how-california-and-nationwide-funding-changes-make-now-the-time-to-install-ev-chargers-a-practical-guide-for-los-angeles-property-owners",
  "how-funding-freezes-and-ultra-fast-chargers-are-reshaping-las-ev-infrastructure-in-2025",
  "how-los-angeles-property-owners-can-install-ev-chargers-funding-financing-and-practical-steps",
  "how-ready-is-your-property-for-ev-chargers-a-practical-guide-for-los-angeles-homeowners-businesses",
  "how-the-return-of-nevi-funding-and-new-partnerships-are-accelerating-ev-charging-in-los-angeles",
  "how-to-choose-right-ev-charger-los-angeles",
  "how-to-know-home-needs-electrical-panel-upgrade",
  "how-to-reduce-electricity-bill-electrical-upgrades",
  "indiana-wireless-highway-charging-bmw-supercharger-access-walmart-network-stellantis-nacs-tesla-3d-maps",
  "innovative-electrical-solutions-for-modern-business-spaces",
  "installing-ev-chargers-in-los-angeles-your-guide-to-a-greener-future",
  "ionna-100-sites-sodium-ion-11-minute-charging-megawatt-mcs-validation-gas-prices-ev-interest-tesla-v4",
  "ionna-circle-k-350-site-partnership-ohio-51m-nevi-64-sites-byd-1500kw-flash-charging-cox-auto-q1-ev-reset-mercedes-eqs-926km-800v",
  "iran-oil-crisis-gas-prices-ev-demand-buy-america-nevi-chargers-zoox-robotaxi-blink-earnings-kia-ev2",
  "kia-ev9-up-481-april-gm-postpones-hummer-silverado-ev-catl-6-min-shenxing-battery-cybertruck-q1-record-low-pilot-tesla-megacharger-summer-launch",
  "kitchen-electrical-requirements-outlet-placement-guide",
  "knowing-when-to-upgrade-your-commercial-electrical-systems",
  "ladbs-electrical-permit-process-step-by-step-guide",
  "landscape-lighting-design-installation-los-angeles",
  "latest-innovations-in-ev-charging-how-shaffer-construction-is-leading-the-way-in-los-angeles",
  "laz-parking-50000-ev-chargers-ford-19-billion-writedown-hydrohertz-68-percent-faster-charging-bmw-supercharger",
  "led-landscape-lighting-upgrade",
  "led-retrofit-guide-los-angeles-businesses",
  "lucid-best-luxury-ev-brand-renault-efficiency-record-hyundai-biggest-ev-2025-year-review-global-sales",
  "major-ev-charging-developments-volkswagen-supercharger-access-google-maps-integration-nacs-standardization-65000-us-ports-and-sonoma-county-expansion-shape-november-2025-infrastructure-landscape",
  "mastering-circuit-breakers-tips-for-effective-resetting",
  "maximizing-energy-efficiency-advanced-electrical-technologies-for-homes",
  "michigan-unlocks-51m-nevi-evgo-500-nacs-connectors-lucid-gravity-419kw-stellantis-factorial-solid-state-hyundai-boulder",
  "modern-lighting-trends-solutions",
  "nacs-connector-48-percent-market-share-fleet-megawatt-charging-installation-costs-utility-rebates",
  "navigating-california-ev-incentives-in-2025-maximize-your-savings-with-shaffer-construction",
  "navigating-californias-ev-charger-surge-trends-technologies-and-community-impact",
  "navigating-the-challenges-and-solutions-in-expanding-the-ev-charging-network-in-los-angeles",
  "navigating-the-future-essential-insights-for-ev-charger-installation-and-infrastructure-in-los-angeles",
  "navigating-the-future-essential-trends-and-tips-for-ev-charging-infrastructure",
  "nec-2026-qualified-installer-requirement-charging-reliability-86-percent-commercial-roi-3-5-year-payback",
  "new-california-solar-battery-project-rule-why-licensed-electricians-are-essential",
  "new-ev-sales-drop-28-percent-used-ev-surge-parity-waymo-500k-rides-semi-solid-state-tipping-point-ladwp-rebate",
  "next-generation-ev-charging-megawatt-fast-charging-plug-charge-expansion-sodium-ion-batteries-and-wireless-technology-transform-los-angeles-infrastructure",
  "october-2025-ev-charging-milestone-record-u-s-infrastructure-expansion-california-reliability-standards-and-innovative-streetlight-solutions-transform-los-angeles-landscape",
  "october-2025-ev-infrastructure-acceleration-record-charging-expansion-nevi-program-growth-tesla-v4-milestone-wireless-technology-breakthrough-and-california-leadership-transform-market-dynamics",
  "october-2025-ev-infrastructure-developments-nevi-expansion-global-adoption-milestones-and-californias-55m-fast-charge-initiative",
  "october-2025-ev-infrastructure-week-teslas-500kw-ultra-fast-charging-launch-californias-historic-29-ev-market-share-first-in-nation-reliability-standards-and-nationwide-nevi-deployment-acceler",
  "off-lease-evs-flood-market-toyota-billion-investment-vw-recall-ev-cancellations-chargepoint-consolidation",
  "office-electrical-upgrades-modern-workplaces",
  "outdoor-lighting-installation-guide-los-angeles",
  "outdoor-outlet-installation-weatherproofing-guide",
  "overcoming-barriers-the-future-of-ev-charger-infrastructure-in-los-angeles",
  "panel-upgrades-navigating-federal-pacific-panel-upgrade-or-replacement",
  "panel-upgrades-the-essentials-of-zinsco-panel-upgrade-or-replacement",
  "passing-electrical-inspection-common-failures-fixes",
  "patio-deck-electrical-planning-guide-los-angeles",
  "planning-ev-charger-infrastructure-installation-in-los-angeles-costs-options-and-what-to-expect",
  "pool-hot-tub-electrical-requirements-los-angeles",
  "power-outage-preparation-guide-los-angeles",
  "power-tips-for-your-refrigerator-ensuring-efficient-operation",
  "powering-the-ev-revolution-latest-advances-and-infrastructure-solutions-for-u-s-charging-networks",
  "powering-the-future-why-expanding-ev-charging-infrastructure-in-los-angeles-matters-now-more-than-ever",
  "powerstation-off-grid-solar-chargers-california-zev-mandate-35-percent-loves-texas-ev-stations-tariff-costs-35-billion-site-size-growing",
  "preparing-los-angeles-buildings-for-the-ev-charging-boom-what-owners-developers-and-businesses-need-to-know",
  "preparing-your-property-for-the-next-wave-of-ev-charging-a-practical-guide-for-los-angeles-owners",
  "professional-wiring-installation-tips",
  "public-ev-charging-what-property-owners-and-developers-in-los-angeles-need-to-know",
  "pushmatic-panel-upgrade-guide",
  "pushmatic-panel-upgrade-guide-2",
  "q1-2026-fast-charging-report-evgo-nacs-expansion-catl-60gwh-sodium-ion-toyota-ev-sales-139-percent-kia-ev6-ev9-price-cuts",
  "q1-ev-sales-toyota-hyundai-surge-nyc-360kw-chargers-chargepoint-600kw-evgo-kroger-la-charger-growth",
  "recessed-lighting-installation-guide",
  "record-ev-charging-infrastructure-growth-teslas-4000-stall-expansion-u-s-reaches-780-new-stations-nevi-program-acceleration-and-300kw-wireless-charging-breakthrough-transform-los-angeles-marke",
  "reliable-facilities-maintenance-electrician-services-by-shaffer-construction-inc",
  "renewable-energy-systems-transforming-electrical-infrastructures",
  "residential-electrical-services-what-every-homeowner-should-know-about-hiring-a-contractor",
  "retail-store-electrical-planning-design-guide",
  "revolutionary-ev-charging-developments-transform-infrastructure-landscape-ultra-fast-1mw-technology-streetlight-integration-300-billion-global-investment-forecast-pennsylvania-community-expansion",
  "rivian-caruso-150-la-fast-chargers-vw-id-polo-29k-debut-xcharge-gridlink-award-walmart-abb-phoenix-hyundai-closes-on-gm",
  "rivian-r2-production-vw-billion-milestone-sk-signet-400kw-charger-nevi-876-million-cuts-byd-profit-decline",
  "should-i-install-an-ev-charger-at-home-a-practical-guide-for-los-angeles-homeowners",
  "should-you-install-an-ev-charger-at-home-a-practical-guide-for-los-angeles-homeowners",
  "smart-ev-charging-solutions",
  "smart-home-contractor-los-angeles",
  "smart-home-electrical-wiring-future-proofing-los-angeles",
  "smoke-detector-installation-guide",
  "solving-lighting-problems-practical-tips-for-homeowners",
  "south-coast-aqmd-30m-resiliency-program-rivian-q1-earnings-1b-vw-oregon-nevi-awards-sierra-club-report-548b-market-forecast",
  "sparkling-holiday-lights-illuminating-your-festive-season-with-shaffer-construction",
  "states-sue-ev-charging-funds-65000-dc-fast-chargers-oslo-model-ws-development-electrify-america-2026-predictions",
  "stellantis-supercharger-access-dc-fast-charging-growth-autel-ces-electricfish-gas-stations-gm-writedown",
  "subpanel-installation-guide-when-why-you-need-one",
  "surging-ahead-how-the-ev-charging-station-market-is-transforming-los-angeles-properties-and-communities",
  "swtch-tap-offline-charging-non-tesla-nacs-2500-stalls-rivian-vw-jv-milestone-uber-ev-grant-6500-ultra-fast-350kw",
  "telephone-power-essentials-tips-for-reliable-operation",
  "tesla-3d-supercharger-maps-porsche-closes-china-network-ford-ionna-plug-charge-holiday-travel-charging",
  "tesla-940k-supercharger-business-configurator-walmart-50-percent-expansion-yermo-400-stall-toronto-480v-fast-track-coachella-charging-congestion",
  "tesla-folding-v4-supercharger-stellantis-universal-access-solid-state-800-mile-evgo-nacs-51-billion-market",
  "tesla-model-y-juniper-wisconsin-ev-grants-georgia-rivian-hyundai-new-evs-cybertruck-long-range",
  "tesla-q1-2026-earnings-catl-next-gen-ecosystem-mercedes-c-class-473-miles-europe-51-percent-ev-share-30c-june-30-deadline",
  "tesla-q1-results-beat-chargepoint-600kw-express-solo-rivian-r2-production-launch-nyserda-45m-nevi-ford-ev-sales-collapse-rivian-overtakes",
  "tesla-semi-megacharger-basecharger-rivian-georgia-300k-capacity-hyundai-ioniq-5-up-11-voltpost-dc-lamppost-chargers-lucid-gravity-award",
  "tesla-supercharger-business-program-us-dc-fast-charging-record-gas-stations-ev-chargers-california-leads-adoption",
  "tesla-supercharger-record-polestar-4-price-cut-ann-arbor-ev-expansion-florida-wireless-charging-byd-megawatt",
  "tesla-superchargers-80000-stalls-kia-ev3-35k-debut-ev-realty-truck-hub-tariffs-charging-costs-v2g-mainstream",
  "tesla-worlds-largest-supercharger-los-angeles-curbside-charging-expansion-volkswagen-network-access-dynamic-pricing-long-beach-ev-infrastructure",
  "the-complete-guide-to-ev-charging-infrastructure-in-los-angeles-trends-technologies-and-installation-tips-for-property-owners",
  "the-critical-importance-of-investing-in-ev-charging-infrastructure-for-a-sustainable-future",
  "the-electric-vehicle-charging-revolution-key-trends-and-future-prospects",
  "the-electric-vehicle-revolution-building-the-future-of-charger-infrastructure",
  "the-essential-guide-to-ev-charging-infrastructure-benefits-strategies-and-future-trends",
  "the-essential-guide-to-installing-ev-chargers-benefits-considerations-and-technologies",
  "the-essential-role-of-ev-charging-infrastructure-in-driving-sustainable-transportation",
  "the-future-is-electric-the-importance-of-ev-charging-stations-in-commercial-properties",
  "the-future-of-electric-vehicle-charging-economic-benefits-technological-innovations-and-government-initiatives",
  "the-future-of-electric-vehicle-charging-infrastructure-trends-innovations-and-insights",
  "the-future-of-electric-vehicle-charging-infrastructure-trends-opportunities-and-innovations",
  "the-future-of-electric-vehicle-charging-insights-on-infrastructure-growth-and-safety-innovations",
  "the-future-of-electric-vehicle-charging-why-infrastructure-matters-for-sustainable-growth",
  "the-future-of-electric-vehicles-impact-on-home-electrical-systems",
  "the-future-of-electric-vehicles-key-trends-for-electricians-and-clients",
  "the-future-of-electric-vehicles-why-investing-in-ev-charger-infrastructure-is-essential",
  "the-future-of-ev-charger-installation-transforming-transportation-in-los-angeles",
  "the-future-of-ev-charger-installation-trends-incentives-and-innovations-you-need-to-know",
  "the-future-of-ev-charger-installations-how-government-initiatives-and-business-benefits-are-shaping-the-industry",
  "the-future-of-ev-charging-federal-grants-technological-advancements-and-infrastructure-expansion",
  "the-future-of-ev-charging-government-initiatives-innovations-and-challenges-in-2024",
  "the-future-of-ev-charging-how-smart-infrastructure-bidirectional-tech-and-community-collaboration-are-shaping-los-angeles",
  "the-future-of-ev-charging-in-los-angeles-breakthrough-technologies-expanded-access-and-smarter-infrastructure",
  "the-future-of-ev-charging-in-los-angeles-new-technologies-solar-integration-and-incentives-for-property-owners",
  "the-future-of-ev-charging-in-los-angeles-policy-updates-security-innovations-and-expanding-access-for-all-residents",
  "the-future-of-ev-charging-in-los-angeles-trends-challenges-and-how-property-owners-can-prepare",
  "the-future-of-ev-charging-in-los-angeles-trends-challenges-and-opportunities-for-sustainable-growth",
  "the-future-of-ev-charging-in-los-angeles-trends-incentives-and-essential-upgrades-for-property-owners",
  "the-future-of-ev-charging-infrastructure-innovations-policy-updates-and-smart-solutions-for-california-property-owners",
  "the-future-of-ev-charging-infrastructure-key-trends-innovations-and-opportunities-for-los-angeles-businesses-and-homeowners",
  "the-future-of-ev-charging-infrastructure-top-trends-shaping-los-angeles-in-2024",
  "the-future-of-ev-charging-infrastructure-trends-challenges-and-solutions-for-reliable-electric-vehicle-power",
  "the-future-of-ev-charging-innovations-expansions-and-key-partnerships-shaping-the-industry",
  "the-future-of-ev-charging-latest-technologies-infrastructure-trends-and-expert-installation-tips-for-los-angeles",
  "the-future-of-ev-charging-speed-security-and-reliability-for-drivers-and-businesses",
  "the-future-of-ev-charging-trends-challenges-and-innovations-in-charging-infrastructure",
  "the-future-of-home-and-public-ev-charging-trends-economics-and-practical-innovations-for-los-angeles-in-2025",
  "the-future-of-mobility-essential-insights-into-ev-charging-infrastructure-and-installation",
  "the-future-of-sustainable-transportation-exploring-the-rise-of-ev-charging-stations",
  "the-green-revolution-how-ev-solutions-reduce-energy-waste-and-save-money",
  "the-growing-demand-for-ev-charging-infrastructure-how-maintenance-and-innovation-shape-the-future",
  "the-growing-landscape-of-ev-charging-infrastructure-trends-innovations-and-future-prospects",
  "the-importance-of-ev-charger-infrastructure-for-a-sustainable-los-angeles",
  "the-importance-of-regular-electrical-maintenance-for-safety-and-efficiency",
  "the-latest-trends-in-ev-charger-installation-a-2024-guide-for-los-angeles-homes-businesses-and-multifamily-properties",
  "the-rapid-expansion-of-ev-charging-infrastructure-key-insights-policy-updates-and-practical-tips-for-home-and-business-owners",
  "the-real-cost-of-ev-charging-in-los-angeles-why-investing-in-a-home-or-business-charger-is-the-smart-choice",
  "the-rise-of-electric-vehicle-charging-stations-a-new-era-of-sustainable-transportation-in-the-u-s",
  "the-rise-of-ev-charging-infrastructure-in-the-u-s-challenges-opportunities-and-future-prospects",
  "the-rise-of-ev-charging-infrastructure-trends-challenges-and-solutions-for-the-future",
  "the-role-of-electricians-in-sustainable-building-practices",
  "the-state-of-ev-charging-the-reality-innovations-and-whats-next-for-electric-vehicle-owners",
  "the-ultimate-guide-to-christmas-lights-illuminate-your-holidays-with-shaffer-construction",
  "the-ultimate-guide-to-ev-charger-installation-and-infrastructure-in-los-angeles",
  "the-vital-role-of-ev-charging-infrastructure-in-accelerating-electric-vehicle-adoption",
  "top-electric-vehicles-for-2024-a-comprehensive-guide",
  "top-trends-challenges-and-innovations-in-ev-charging-infrastructure-for-2025",
  "transforming-mobility-the-rise-of-ev-charging-infrastructure-across-america",
  "transforming-your-business-with-commercial-electrical-maintenence-services",
  "trump-ev-policy-reversals-charger-reliability-donut-lab-production-byd-megawatt-charging-nevi-update",
  "trump-proposes-cutting-nevi-billions-gas-prices-ev-interest-newsom-200m-rebate-byd-5000-flash-chargers-alpitronic-hyc1000",
  "ultimate-guide-home-ev-charger-installation-los-angeles",
  "ultimate-guide-to-ev-charger-installation-incentives-in-los-angeles-funding-tax-credits-and-future-proof-solutions-for-2024",
  "under-cabinet-lighting-installation-guide",
  "understanding-dimmers-tips-for-optimal-use-and-installation",
  "understanding-the-latest-trends-in-residential-electrical-design",
  "understanding-the-value-of-licensed-electrical-contractors",
  "understanding-voltage-drop-causes-and-solutions-for-your-home",
  "understanding-your-los-angeles-electrical-bill",
  "unleashing-the-benefits-why-installing-ev-chargers-is-a-smart-investment-for-your-property",
  "us-dc-fast-charging-65000-stalls-byd-overtakes-tesla-2025-rivian-r2-affordable-evs-bolt-leaf",
  "us-dc-fast-charging-70000-stalls-ionna-250-million-california-vehicle-to-home-pilot-tariff-impact-zev-sales-record",
  "us-dc-fast-charging-71000-stalls-tesla-q1-53-million-sessions-ionna-1000-stalls-electrify-america-ws-development-xcharge-illinois",
  "used-ev-sales-surge-12-percent-ford-free-charger-power-promise-utilities-managed-charging-175k-level-2-ports-denza-500-mile-range",
  "voltpost-lamppost-charging-porsche-wireless-florida-highway-rivian-r2-chevy-bolt-return",
  "walmart-224-stall-fast-charging-network-california-heavy-duty-av-rules-zev-market-4-year-low-272b-ev-aftermarket-ford-687-second-ev-record",
  "wattev-370-tesla-semis-port-oakland-lexus-tz-3-row-ev-suv-vw-id-cross-byd-datang-30k-orders-ansi-fire-safety-standards",
  "what-the-nevi-funding-restart-means-for-ev-charger-installation-in-los-angeles-a-guide-for-property-owners",
  "what-the-rebooted-nevi-program-means-for-ev-charger-projects-in-los-angeles",
  "whole-house-generator-installation-guide-los-angeles",
  "why-choose-shaffer-construction-for-your-ev-charger-installations",
  "why-ev-charger-installations-are-accelerating-in-2025-what-property-owners-in-los-angeles-need-to-know",
  "why-permitting-policy-and-smart-design-matter-for-faster-ev-charger-deployment-in-los-angeles",
  "why-upgrading-your-electrical-panel-is-crucial-for-los-angeles-homes",
  "winter-electrical-safety-tips",
  "winter-electrical-tips-safeguarding-your-ev-chargers-more",
  "xcharge-brooklyn-depot-donut-lab-solid-state-battery-prologium-california-nevi-grant-honda-afeela"
]);
const LOCATION_SLUGS = new Set([
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
  "west-hollywood"
]);
const SERVICE_SLUGS = new Set([
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
  "whole-building-surge-protection"
]);
const TYPED_SERVICE_SLUGS = new Set([
  "commercial-backup-generator-installation",
  "commercial-breaker-panel-service-maintenance",
  "commercial-ceiling-fan-fixture-installation",
  "commercial-complete-electrical-rewiring",
  "commercial-data-network-av-wiring",
  "commercial-dedicated-equipment-circuits",
  "commercial-electrical-code-compliance-corrections",
  "commercial-electrical-panel-upgrades",
  "commercial-electrical-safety-inspections",
  "commercial-electrical-troubleshooting-repairs",
  "commercial-energy-efficiency-upgrades",
  "commercial-ev-charger-installation",
  "commercial-exhaust-fan-ventilation-wiring",
  "commercial-landscape-outdoor-lighting",
  "commercial-lighting-installation-retrofitting",
  "commercial-outlet-switch-dimmer-services",
  "commercial-pool-hot-tub-spa-electrical",
  "commercial-security-motion-lighting",
  "commercial-smart-automation-systems",
  "commercial-whole-building-surge-protection",
  "residential-backup-generator-installation",
  "residential-breaker-panel-service-maintenance",
  "residential-ceiling-fan-fixture-installation",
  "residential-complete-electrical-rewiring",
  "residential-data-network-av-wiring",
  "residential-dedicated-equipment-circuits",
  "residential-electrical-code-compliance-corrections",
  "residential-electrical-panel-upgrades",
  "residential-electrical-safety-inspections",
  "residential-electrical-troubleshooting-repairs",
  "residential-energy-efficiency-upgrades",
  "residential-ev-charger-installation",
  "residential-exhaust-fan-ventilation-wiring",
  "residential-landscape-outdoor-lighting",
  "residential-lighting-installation-retrofitting",
  "residential-outlet-switch-dimmer-services",
  "residential-pool-hot-tub-spa-electrical",
  "residential-security-motion-lighting",
  "residential-smart-automation-systems",
  "residential-whole-building-surge-protection"
]);
const SERVICE_ALIAS_REDIRECTS = {
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
  "commercial-electric-heater-installation": "commercial-dedicated-equipment-circuits"
};
const DIRECT_REDIRECTS = {
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
  "/service-areas/pacific-palisades/exhaust-fan-ventilation-wiring/residential-exhaust-fan-ventilation-wiring": "/service-areas/pacific-palisades/residential-exhaust-fan-ventilation-wiring/"
};

async function handleRequest(request) {
  const url = new URL(request.url);
  const target = resolveRedirect(url.pathname);

  if (target) {
    return Response.redirect(new URL(target, 'https://shaffercon.com').toString(), 301);
  }

  if (url.hostname === 'www.shaffercon.com') {
    url.hostname = 'shaffercon.com';
    return Response.redirect(url.toString(), 301);
  }

  return fetch(request);
}

function normalizePath(value) {
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch (error) {}

  const normalized = decoded
    .replace(/"/g, '')
    .replace(/\\+/g, '/')
    .replace(/\/+$/, '')
    .toLowerCase()
    .replace(/\s+/g, '-');

  return normalized || '/';
}

function serviceHref(location, service) {
  return '/service-areas/' + location + '/' + service + '/';
}

function resolveServiceTarget(location, requestedService) {
  const service = requestedService.toLowerCase().replace(/\s+/g, '-');
  const aliasTarget = SERVICE_ALIAS_REDIRECTS[service];
  const targetLocation = LOCATION_SLUGS.has(location) ? location : 'hollywood';

  if (aliasTarget) {
    if (aliasTarget.charAt(0) === '/') return aliasTarget;
    return serviceHref(targetLocation, aliasTarget);
  }

  if (TYPED_SERVICE_SLUGS.has(service)) {
    return serviceHref(targetLocation, service);
  }

  if (SERVICE_SLUGS.has(service)) {
    return serviceHref(targetLocation, 'residential-' + service);
  }

  return '';
}

function resolveTopicTarget(slug, fallbackToInsights) {
  if (/(panel|subpanel|breaker|zinsco|federal-pacific|fpe|pushmatic|fuse-box)/.test(slug)) {
    return '/service-areas/hollywood/residential-electrical-panel-upgrades/';
  }

  if (/(load-study|load-studies|load-calculation|load-calculations)/.test(slug)) {
    return '/electrical-load-studies/';
  }

  if (/(led|lighting|recessed)/.test(slug)) {
    return '/led-retrofit-services/';
  }

  if (/(^|-)ev($|-)|(^|-)evs($|-)|charger|charging|electric-vehicle|electric-vehicles/.test(slug)) {
    return '/commercial-electric-vehicle-chargers/';
  }

  if (/(commercial|maintenance|inspection|electrical|electrician|repair|code|permit|gfci|gfi|outlet|wiring)/.test(slug)) {
    return '/commercial-service/';
  }

  return fallbackToInsights ? '/industry-insights/' : '';
}

function resolveRedirect(pathname) {
  const path = normalizePath(pathname);
  const parts = path.split('/').filter(Boolean);
  const slug = parts[parts.length - 1] || '';

  if (DIRECT_REDIRECTS[path]) {
    return DIRECT_REDIRECTS[path];
  }

  if (parts.length === 1 && BLOG_SLUGS.has(slug)) {
    return '/industry-insights/' + slug + '/';
  }

  if (parts.length === 2 && parts[0] === 'industry-insights' && BLOG_SLUGS.has(slug) && !pathname.endsWith('/')) {
    return '/industry-insights/' + slug + '/';
  }

  if (parts.length === 2 && parts[0] === 'industry-insights' && !BLOG_SLUGS.has(slug)) {
    return resolveTopicTarget(slug, true);
  }

  if (parts.length === 1 && LOCATION_SLUGS.has(slug)) {
    return '/service-areas/' + slug + '/';
  }

  if (parts[0] === 'service-areas') {
    if (parts.length === 2) {
      if (LOCATION_SLUGS.has(parts[1]) && !pathname.endsWith('/')) {
        return '/service-areas/' + parts[1] + '/';
      }

      const rootServiceTarget = resolveServiceTarget('hollywood', parts[1]);
      if (rootServiceTarget) return rootServiceTarget;
    }

    if (parts.length >= 3) {
      const requestedLocation = parts[1];
      const requestedService = parts[2];
      const requestedTail = parts[parts.length - 1];
      const typedLocationMatch = requestedService.match(/^(commercial|residential)-(.+)$/);

      if (requestedService === 'service' && LOCATION_SLUGS.has(requestedLocation)) {
        return '/service-areas/' + requestedLocation + '/';
      }

      if (LOCATION_SLUGS.has(requestedService)) {
        return '/service-areas/' + requestedService + '/';
      }

      if (typedLocationMatch && LOCATION_SLUGS.has(typedLocationMatch[2])) {
        return '/service-areas/' + typedLocationMatch[2] + '/';
      }

      const nestedServiceTarget = resolveServiceTarget(requestedLocation, requestedTail) || resolveServiceTarget(requestedLocation, requestedService);
      if (nestedServiceTarget) return nestedServiceTarget;
    }
  }

  const rootServiceTarget = parts.length === 1 ? resolveServiceTarget('hollywood', slug) : '';
  if (rootServiceTarget) return rootServiceTarget;

  const nestedRootServiceTarget = parts.length > 1 ? resolveServiceTarget('hollywood', slug) : '';
  if (nestedRootServiceTarget) return nestedRootServiceTarget;

  const topicTarget = parts.length === 1 ? resolveTopicTarget(slug, false) : '';
  if (topicTarget) return topicTarget;

  const dateMatch = path.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/(.+)$/);
  if (dateMatch && BLOG_SLUGS.has(dateMatch[4])) {
    return '/industry-insights/' + dateMatch[4] + '/';
  }

  if (dateMatch) {
    return resolveTopicTarget(dateMatch[4], true);
  }

  return '';
}
