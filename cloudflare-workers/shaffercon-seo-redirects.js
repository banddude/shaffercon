const REDIRECTS = {
  "/ev-charging-infrastructure-update-nevi-milestones-tesla-record-expansion-and-growing-infrastructure-demands": "/industry-insights/ev-charging-infrastructure-update-nevi-milestones-tesla-record-expansion-and-growing-infrastructure-demands/",
  "/emerging-trends-in-ev-charger-installation-and-infrastructure": "/industry-insights/emerging-trends-in-ev-charger-installation-and-infrastructure/",
  "/revolutionary-ev-charging-developments-transform-infrastructure-landscape-ultra-fast-1mw-technology-streetlight-integration-300-billion-global-investment-forecast-pennsylvania-community-expansion": "/industry-insights/revolutionary-ev-charging-developments-transform-infrastructure-landscape-ultra-fast-1mw-technology-streetlight-integration-300-billion-global-investment-forecast-pennsylvania-community-expansion/",

  "/industry-insights/december-2025-ev-charging-infrastructure-georgia-nevi-funding-stellantis-supercharger-access-ultra-fast-charging-breakthroughs": "/commercial-electric-vehicle-chargers/",
  "/industry-insights/evgo-autocharge-5-million-sessions-rivian-network-expansion-california-2025-ev-charging-mandates-multifamily-requirements": "/commercial-electric-vehicle-chargers/",
  "/industry-insights/ev-charging-reliability-improvements-condo-hoa-installation-guide-ladwp-sce-rebates-post-tax-credit-market": "/commercial-electric-vehicle-chargers/",
  "/industry-insights/electrify-america-simon-500-chargers-chevy-equinox-ev-sales-record-workplace-charging-benefits-omni-port": "/commercial-electric-vehicle-chargers/",
  "/industry-insights/evgo-prefabricated-stations-ford-f150-lightning-ends-erev-tesla-fairbanks-megawatt-charging-trucks": "/commercial-electric-vehicle-chargers/",
  "/industry-insights/solar-canopy-ev-charging-german-automakers-supercharger-access-ionna-network-expansion-billing-architecture": "/commercial-electric-vehicle-chargers/",
  "/industry-insights/nevi-federal-funding-resumes-home-charging-dominates-tesla-v4-500kw-smart-grid-integration-range-anxiety-solutions": "/commercial-electric-vehicle-chargers/",

  "/residential-landscape-outdoor-lighting": "/service-areas/",
  "/commercial-landscape-outdoor-lighting": "/commercial-service/",
  "/residential-security-motion-lighting": "/service-areas/",
  "/commercial-security-motion-lighting": "/commercial-service/",
  "/commercial-energy-efficiency-upgrades": "/commercial-service/",
  "/commercial-electrical-troubleshooting-repairs": "/commercial-service/",
  "/commercial-pool-hot-tub-spa-electrical": "/commercial-service/",
  "/service-areas/commercial-pool-hot-tub-spa-electrical": "/commercial-service/",
  "/service-areas/backup-generator-installation__trashed/residential-backup-generator-installation": "/service-areas/",
  "/service-areas/backup-generator-installation__trashed/commercial-backup-generator-installation": "/commercial-service/",
};

function canonicalPath(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function redirectUrl(requestUrl, targetPath) {
  const target = new URL(requestUrl);
  target.hostname = "shaffercon.com";
  target.protocol = "https:";
  target.pathname = targetPath;
  return target.toString();
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = canonicalPath(url.pathname);
  const target = REDIRECTS[path];

  if (target) {
    return Response.redirect(redirectUrl(url, target), 301);
  }

  if (url.hostname === "www.shaffercon.com") {
    url.hostname = "shaffercon.com";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  return fetch(request);
}
