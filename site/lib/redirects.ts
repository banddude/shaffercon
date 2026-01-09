/**
 * ShafferCon URL Redirect Mapping
 *
 * Handles 404 fixes for old URL structures
 * Generated from GSC 404 Report - January 9, 2026
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Blog post slugs that were moved from root to /industry-insights/
 */
const BLOG_POST_SLUGS = [
  'a-closer-look-at-our-load-study-services-and-why-your-ev-business-needs-them',
  'advancements-in-electric-vehicle-charging-trends-innovations-and-their-impact-on-urban-development',
  'afci-installation-electrical-safety',
  'bathroom-electrical-safety-gfci-requirements',
  'bidirectional-v2h-charging-mainstream-hyundai-kia-v2x-hotel-ev-amenity-dc-fast-charging-record-deployment',
  'bidirectional-v2h-charging-mainstream-hyundai-kia-v2x-hotel-ev-amenity-dc-fast-charging-record-deployment',
  'building-a-sustainable-future-the-importance-of-expanding-ev-charging-infrastructure-in-los-angeles',
  'californias-ev-charging-boom-how-los-angeles-is-leading-the-electric-vehicle-infrastructure-revolution',
  'californias-ev-charging-buildout-what-los-angeles-building-owners-renters-and-fleets-should-know',
  'case-study-how-our-electrical-services-boosted-a-local-la-business',
  'critical-ev-charging-infrastructure-developments-600kw-ultra-fast-charging-launch-reliability-crisis-exposed-california-surpasses-200000-chargers-federal-heavy-duty-investment-and-municipal-gran',
  'december-2025-ev-charging-infrastructure-georgia-nevi-funding-stellantis-supercharger-access-ultra-fast-charging-breakthroughs',
  'ev-charger-installation-guide-for-los-angeles-plan-permit-install-and-futureproof',
  'ev-charging-in-2025-what-homeowners-property-managers-and-businesses-need-to-know',
  'ev-charging-infrastructure-transformation-colorado-nevi-funding-tesla-ai-platform-record-supercharger-expansion-pennsylvania-certification-and-wireless-charging-growth',
  'evgo-autocharge-5-million-sessions-rivian-network-expansion-california-2025-ev-charging-mandates-multifamily-requirements',
  'from-design-to-maintenance-the-life-cycle-of-electric-vehicle-installations',
  'gfci-safety-installation-guide',
  'home-panel-upgrade-guide',
  'how-los-angeles-property-owners-can-install-ev-chargers-funding-financing-and-practical-steps',
  'next-generation-ev-charging-megawatt-fast-charging-plug-charge-expansion-sodium-ion-batteries-and-wireless-charging-transform-los-angeles-infrastructure',
  'october-2025-ev-infrastructure-acceleration-record-charging-expansion-nevi-program-growth-tesla-v4-milestone-wireless-technology-breakthrough-and-california-leadership-transform-market-dynamics',
  'october-2025-ev-infrastructure-developments-nevi-expansion-global-adoption-milestones-and-californias-55m-fast-charge-initiative',
  'public-ev-charging-what-property-owners-and-developers-in-los-angeles-need-to-know',
  'revolutionary-ev-charging-developments-transform-infrastructure-landscape-ultra-fast-1mw-technology-streetlight-integration-300-billion-global-investment-forecast-pennsylvania-community-expansion-and-wireless-charging-growth',
  'should-i-install-an-ev-charger-at-home-a-practical-guide-for-los-angeles-homeowners',
  'should-you-install-an-ev-charger-at-home-a-practical-guide-for-los-angeles-homeowners',
  'the-future-of-ev-charging-in-los-angeles-trends-incentives-and-essential-upgrades-for-property-owners',
  'the-future-of-ev-charging-in-los-angeles-trends-challenges-and-how-property-owners-can-prepare',
  'the-future-of-ev-charging-in-los-angeles-trends-challenges-and-opportunities-for-sustainable-growth',
  'the-future-of-electric-vehicles-why-investing-in-ev-charger-infrastructure-is-essential',
  'the-green-revolution-how-ev-solutions-reduce-energy-waste-and-save-money',
  'the-real-cost-of-ev-charging-in-los-angeles-why-investing-in-a-home-or-business-charger-is-the-smart-choice',
  'toyota-ev-charging-ecosystem-china-50-percent-market-share-solid-state-battery-production-north-carolina-expansion',
  'toyota-ev-charging-ecosystem-china-50-percent-market-share-solid-state-battery-production-north-carolina-expansion',
  'transforming-your-business-with-commercial-electrical-maintenence-services',
  'why-permitting-policy-and-smart-design-matter-for-faster-ev-charger-deployment-in-los-angeles',
  'winter-electrical-tips-safeguarding-your-ev-chargers-more',
  'why-choose-shaffer-construction-for-your-ev-charger-installations',
  'residential-electrical-services-what-every-homeowner-should-know-about-hiring-a-contractor',
  'ev-charger-installation-in-los-angeles-the-2024-guide-to-home-public-and-commercial-solutions',
  'ev-charger-installation-infrastructure-how-to-decide-pay-for-and-plan-your-project',
];

/**
 * Location slugs that were moved from root to /service-areas/
 */
const LOCATION_SLUGS = [
  'echo-park',
  'atwater-village',
  'beverly-hills',
  'culver-city',
  'silver-lake',
  'sherman-oaks',
  'burbank',
  'santa-monica',
  'pasadena',
  'glendale',
  'hollywood',
  'west-hollywood',
  'los-feliz',
  'highland-park',
  'boyle-heights',
  'inglewood',
  'long-beach',
  'santa-clarita',
  'altadena',
  'torrance',
  'pacific-palisades',
];

/**
 * Main redirect middleware function
 */
export function handleRedirects(request: NextRequest): NextResponse | null {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Remove trailing slash for matching
  const cleanPath = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;

  // Check if this is a blog post at root (needs /industry-insights/ prefix)
  const slug = cleanPath.split('/').pop();
  if (slug && BLOG_POST_SLUGS.includes(slug) && !pathname.startsWith('/industry-insights/')) {
    url.pathname = `/industry-insights/${slug}/`;
    return NextResponse.redirect(url, 301);
  }

  // Check if this is a location page at root (needs /service-areas/ prefix)
  if (LOCATION_SLUGS.includes(slug || '') && !pathname.startsWith('/service-areas/')) {
    url.pathname = `/service-areas/${slug}/`;
    return NextResponse.redirect(url, 301);
  }

  // Handle date-based blog URLs (old WordPress structure: /2023/01/28/post-slug)
  const dateMatch = cleanPath.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/(.+)$/);
  if (dateMatch) {
    const [, , , , postSlug] = dateMatch;
    url.pathname = `/industry-insights/${postSlug}/`;
    return NextResponse.redirect(url, 301);
  }

  // Handle old service pages at root
  const serviceRedirects: Record<string, string> = {
    '/breaker-panel-service-maintenance': '/contact-us',
    '/contact': '/contact-us',
    '/led-retrofit': '/led-retrofit-services',
  };

  if (serviceRedirects[cleanPath]) {
    url.pathname = serviceRedirects[cleanPath];
    return NextResponse.redirect(url, 301);
  }

  return null; // No redirect needed
}
