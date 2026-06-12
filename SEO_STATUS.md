# Shaffer Construction SEO Status

Last updated: May 13, 2026

This is the current source of truth for website SEO, traffic tracking, lead tracking, and next work. Supporting detail lives in `SEO_BUSINESS_IMPACT_PLAN.md` and dated files under `seo-updates/`.

## Current Goal

Grow qualified calls, quote requests, and commercial electrical opportunities from organic search. Traffic matters when it supports work Shaffer Construction wants to win, especially load studies, commercial electrical, EV charging, lighting, panel work, code corrections, and facilities maintenance.

## Current State

1. Search Console is connected and API access works through the service account.
2. Live GSC data is now available from any AIVA host for round 3: `google raw searchconsole searchanalytics query --user self --params-json '{"siteUrl":"sc-domain:shaffercon.com"}' --body-json '{"startDate":"...","endDate":"...","dimensions":["query"]}'` (Worker-proxied, no more month-old CSV exports).
3. GA4 is installed and reporting production traffic.
4. GA4 lead tracking is deployed for phone clicks, email clicks, contact page CTA clicks, and contact form submits.
5. The primary business KPI is `generate_lead`.
6. GitHub contact form leads are captured on the `leads` branch.
7. The contact form is receiving mostly spam, while real customer inquiries are also coming through `hello@shaffercon.com`.
8. The daily blogger is operational after the May 8 repo cleanliness fix.

## Latest Baseline

Latest full check: `seo-updates/website-stats-and-leads-2026-05-13.md`

GA4, May 11 to May 12:

1. Active users, 67.
2. Sessions, 71.
3. Page views, 81.
4. Engaged sessions, 24.
5. `generate_lead` events, 3.

Search Console, May 11 to May 12:

1. Clicks, 20.
2. Impressions, 3,781.
3. CTR, 0.53 percent.
4. Average position, 14.96.

Interpretation: the last two complete days recovered from the prior weekend, but the seven day Search Console trend is still softer than the prior week. CTR and average position remain the main SEO constraints.

## Completed Work

1. Rebuilt the site as static database driven Next.js pages.
2. Added GA4 event tracking for calls, email clicks, contact CTAs, and form submits.
3. Created GA4 key events for `generate_lead`, `form_submit`, `phone_click`, and `email_click`.
4. Added contact form attribution fields for landing page, page URL, referrer, UTM fields, and ad click IDs.
5. Verified contact form submissions are saved to the GitHub `leads` branch.
6. Added Search Console opportunity scoring and internal link planning files.
7. Improved local SEO proof layers for the main service pages.
8. Started the load study customer SEO pass.
9. Added or improved internal links around load studies and commercial EV charging.
10. Optimized the subpanel guide from Search Console data.
11. Optimized the LADBS permit guide from Search Console data.
12. Added Cloudflare redirects for known old Search Console 404s.
13. Fixed the daily blogger preflight issue by ignoring local backup and scratch files.

## Current Open Work

### Highest Impact

1. Add contact form spam filtering so SEO spam, broker spam, VA spam, and estimating spam do not create lead files.
2. Clean GA4 reporting so `generate_lead` is the primary KPI and child events are not mistaken for separate real leads.
3. Build more internal links into `/electrical-load-studies/`.
4. Optimize the next ranking support pages that can feed paid work.
5. Create a weekly stats and leads report command or script.

### SEO Page Queue

Work these in this order unless fresher Search Console data says otherwise:

1. `/industry-insights/california-title-24-electrical-requirements-renovations/`
2. `/industry-insights/passing-electrical-inspection-common-failures-fixes/`
3. `/industry-insights/complete-guide-electrical-panel-upgrades-los-angeles/`
4. `/industry-insights/electrical-load-studies-what-they-are-los-angeles/`
5. `/electrical-load-studies/`
6. `/industry-insights/recessed-lighting-installation-guide/`
7. `/industry-insights/federal-pacific-zinsco-panels-replacement-los-angeles/`
8. `/industry-insights/panel-upgrades-the-essentials-of-zinsco-panel-upgrade-or-replacement/`

### Internal Link Queue

Start with these target pages:

1. `/electrical-load-studies/`
2. `/industry-insights/electrical-load-studies-what-they-are-los-angeles/`
3. `/industry-insights/complete-guide-electrical-panel-upgrades-los-angeles/`
4. `/industry-insights/passing-electrical-inspection-common-failures-fixes/`
5. `/industry-insights/california-title-24-electrical-requirements-renovations/`

Use these source themes:

1. LADBS permits.
2. Title 24.
3. Inspection failures.
4. Panel upgrades.
5. Commercial electrical.
6. EV charging.
7. Retail and tenant improvement electrical planning.

## Weekly Routine

1. Pull GA4 for the prior seven days.
2. Pull Search Console for the prior seven days and compare to the prior period.
3. Check GitHub `leads` branch for new contact form submissions.
4. Search `hello@shaffercon.com` for unresponded real website leads.
5. Update `seo-updates/` with a dated report.
6. Update this file only if priorities or status changed.
7. Pick one implementation task from Highest Impact or SEO Page Queue.
8. Build, test, commit, push, and check GitHub Actions.

## Supporting Files

1. `SEO_BUSINESS_IMPACT_PLAN.md`, strategy and prioritization logic.
2. `seo-updates/website-stats-and-leads-2026-05-11.md`, latest traffic and lead check.
3. `seo-updates/measurement-baseline-2026-05-05.md`, GA4 setup and tracking baseline.
4. `seo-updates/search-console-opportunities-latest.md`, current opportunity scoring.
5. `seo-updates/search-console-internal-links-latest.md`, internal link recommendations.
6. `seo-updates/blogger-health-2026-05-08.md`, blogger preflight fix.
7. `cloudflare-workers/README.md`, redirect worker notes.
