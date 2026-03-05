/**
 * Cloudflare Worker for ShafferCon 301 Redirects
 *
 * Handles legacy URL redirects with proper 301 status codes
 * Generated from GSC 404 Report - January 9, 2026
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  // Redirect mappings
  const REDIRECTS = {
    // Location pages at root -> /service-areas/
    '/echo-park': '/service-areas/echo-park/',
    '/atwater-village': '/service-areas/atwater-village/',
    '/beverly-hills': '/service-areas/beverly-hills/',
    '/culver-city': '/service-areas/culver-city/',
    '/silver-lake': '/service-areas/silver-lake/',
    '/sherman-oaks': '/service-areas/sherman-oaks/',
    '/burbank': '/service-areas/burbank/',
    '/santa-monica': '/service-areas/santa-monica/',
    '/pasadena': '/service-areas/pasadena/',
    '/glendale': '/service-areas/glendale/',
    '/hollywood': '/service-areas/hollywood/',
    '/west-hollywood': '/service-areas/west-hollywood/',
    '/los-feliz': '/service-areas/los-feliz/',
    '/highland-park': '/service-areas/highland-park/',
    '/boyle-heights': '/service-areas/boyle-heights/',
    '/inglewood': '/service-areas/inglewood/',
    '/long-beach': '/service-areas/long-beach/',
    '/santa-clarita': '/service-areas/santa-clarita/',
    '/altadena': '/service-areas/altadena/',
    '/torrance': '/service-areas/torrance/',
    '/pacific-palisades': '/service-areas/pacific-palisades/',

    // Service pages
    '/breaker-panel-service-maintenance': '/contact-us',
    '/contact': '/contact-us',
    '/led-retrofit': '/led-retrofit-services/',

    // Blog posts at root -> /industry-insights/
    '/a-closer-look-at-our-load-study-services-and-why-your-ev-business-needs-them': '/industry-insights/a-closer-look-at-our-load-study-services-and-why-your-ev-business-needs-them/',
    'why-choose-shaffer-construction-for-your-ev-charger-installations': '/industry-insights/why-choose-shaffer-construction-for-your-ev-charger-installations/',
    '/the-green-revolution-how-ev-solutions-reduce-energy-waste-and-save-money': '/industry-insights/the-green-revolution-how-ev-solutions-reduce-energy-waste-and-save-money/',
    '/from-design-to-maintenance-the-life-cycle-of-electric-vehicle-installations': '/industry-insights/from-design-to-maintenance-the-life-cycle-of-electric-vehicle-installations/',
    '/residential-electrical-services-what-every-homeowner-should-know-about-hiring-a-contractor': '/industry-insights/residential-electrical-services-what-every-homeowner-should-know-about-hiring-a-contractor/',
    '/gfci-safety-installation-guide': '/industry-insights/gfci-safety-installation-guide/',
    '/transforming-your-business-with-commercial-electrical-maintenence-services': '/industry-insights/transforming-your-business-with-commercial-electrical-maintenence-services/',
    '/case-study-how-our-electrical-services-boosted-a-local-la-business': '/industry-insights/case-study-how-our-electrical-services-boosted-a-local-la-business/',
    '/afci-installation-electrical-safety': '/industry-insights/afci-installation-electrical-safety/',
    '/understanding-the-value-of-licensed-electrical-contractors': '/industry-insights/understanding-the-value-of-licensed-electrical-contractors/',
    '/electricitys-impact-on-sustainable-construction-practices': '/industry-insights/electricitys-impact-on-sustainable-construction-practices/',
    '/the-future-is-electric-the-importance-of-ev-charging-stations-in-commercial-properties': '/industry-insights/the-future-is-electric-the-importance-of-ev-charging-stations-in-commercial-properties/',
    '/boost-your-business-with-ev-charging-stations-a-guide': '/industry-insights/boost-your-business-with-ev-charging-stations-a-guide/',
    '/exploring-shaffer-constructions-load-study-services-in-la': '/industry-insights/exploring-shaffer-constructions-load-study-services-in-la/',
    '/fall-into-savings-efficient-electricity-use-in-autumn': '/industry-insights/fall-into-savings-efficient-electricity-use-in-autumn/',
    '/knowing-when-to-upgrade-your-commercial-electrical-systems': '/industry-insights/knowing-when-to-upgrade-your-commercial-electrical-systems/',
    '/bathroom-electrical-safety-gfci-requirements': '/industry-insights/bathroom-electrical-safety-gfci-requirements/',
    '/home-panel-upgrade-guide': '/industry-insights/home-panel-upgrade-guide/',
    '/winter-electrical-tips-safeguarding-your-ev-chargers-more': '/industry-insights/winter-electrical-tips-safeguarding-your-ev-chargers-more/',
    '/how-los-angeles-property-owners-can-install-ev-chargers-funding-financing-and-practical-steps': '/industry-insights/how-los-angeles-property-owners-can-install-ev-chargers-funding-financing-and-practical-steps/',
    '/evgo-autocharge-5-million-sessions-rivian-network-expansion-california-2025-ev-charging-mandates-multifamily-requirements': '/industry-insights/evgo-autocharge-5-million-sessions-rivian-network-expansion-california-2025-ev-charging-mandates-multifamily-requirements/',
    '/why-permitting-policy-and-smart-design-matter-for-faster-ev-charger-deployment-in-los-angeles': '/industry-insights/why-permitting-policy-and-smart-design-matter-for-faster-ev-charger-deployment-in-los-angeles/',
    '/next-generation-ev-charging-megawatt-fast-charging-plug-charge-expansion-sodium-ion-batteries-and-wireless-charging-transform-los-angeles-infrastructure': '/industry-insights/next-generation-ev-charging-megawatt-fast-charging-plug-charge-expansion-sodium-ion-batteries-and-wireless-charging-transform-los-angeles-infrastructure/',
    '/october-2025-ev-infrastructure-acceleration-record-charging-expansion-nevi-program-growth-tesla-v4-milestone-wireless-technology-breakthrough-and-california-leadership-transform-market-dynamics': '/industry-insights/october-2025-ev-infrastructure-acceleration-record-charging-expansion-nevi-program-growth-tesla-v4-milestone-wireless-technology-breakthrough-and-california-leadership-transform-market-dynamics/',
    '/the-real-cost-of-ev-charging-in-los-angeles-why-investing-in-a-home-or-business-charger-is-the-smart-choice': '/industry-insights/the-real-cost-of-ev-charging-in-los-angeles-why-investing-in-a-home-or-business-charger-is-the-smart-choice/',
    '/californias-ev-charging-buildout-what-los-angeles-building-owners-renters-and-fleets-should-know': '/industry-insights/californias-ev-charging-buildout-what-los-angeles-building-owners-renters-and-fleets-should-know/',
    '/the-future-of-ev-charging-in-los-angeles-trends-incentives-and-essential-upgrades-for-property-owners': '/industry-insights/the-future-of-ev-charging-in-los-angeles-trends-incentives-and-essential-upgrades-for-property-owners/',
    '/should-i-install-an-ev-charger-at-home-a-practical-guide-for-los-angeles-homeowners': '/industry-insights/should-i-install-an-ev-charger-at-home-a-practical-guide-for-los-angeles-homeowners/',
    '/ev-charger-installation-infrastructure-how-to-decide-pay-for-and-plan-your-project': '/industry-insights/ev-charger-installation-infrastructure-how-to-decide-pay-for-and-plan-your-project/',
    '/ev-charging-in-2025-what-homeowners-property-managers-and-businesses-need-to-know': '/industry-insights/ev-charging-in-2025-what-homeowners-property-managers-and-businesses-need-to-know/',
    '/californias-ev-charging-boom-how-los-angeles-is-leading-the-electric-vehicle-infrastructure-revolution': '/industry-insights/californias-ev-charging-boom-how-los-angeles-is-leading-the-electric-vehicle-infrastructure-revolution/',
    '/public-ev-charging-what-property-owners-and-developers-in-los-angeles-need-to-know': '/industry-insights/public-ev-charging-what-property-owners-and-developers-in-los-angeles-need-to-know/',
    '/ev-charger-installation-guide-for-los-angeles-plan-permit-install-and-futureproof': '/industry-insights/ev-charger-installation-guide-for-los-angeles-plan-permit-install-and-futureproof/',
    '/ev-charging-infrastructure-transformation-colorado-nevi-funding-tesla-ai-platform-record-supercharger-expansion-pennsylvania-certification-and-wireless-charging-growth': '/industry-insights/ev-charging-infrastructure-transformation-colorado-nevi-funding-tesla-ai-platform-record-supercharger-expansion-pennsylvania-certification-and-wireless-charging-growth/',
  }

  // Check for exact path match
  if (REDIRECTS[pathname]) {
    return Response.redirect('https://shaffercon.com' + REDIRECTS[pathname], 301)
  }

  // Check for date-based blog URLs (/2023/01/28/post-slug)
  const dateMatch = pathname.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/(.+)$/)
  if (dateMatch) {
    const postSlug = dateMatch[4]
    return Response.redirect('https://shaffercon.com/industry-insights/' + postSlug + '/', 301)
  }

  // No redirect - fetch from origin
  return fetch(request)
}
