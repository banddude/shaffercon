# Load Study Growth Plan, 8 Hour Build Session

Created May 19, 2026.

Primary goal, make electrical load studies the first measurable job category on shaffercon.com, with better buyer pages, cleaner lead capture, stronger internal links, and a controlled Google Ads draft that can be launched later without guessing.

Primary progress ledger, `seo-updates/load_study_growth_progress_2026_05_19.md`.

Primary job category, `electrical_load_studies`.

Primary conversion event, `qualified_lead`.

Primary landing page, `/electrical-load-studies/`.

Time constraint added by Mike, continue working until 5:30 PM Pacific on May 19, 2026. If the planned blocks finish early, continue with verifiable SEO improvements and real Search Console issue fixes, prioritizing issues with evidence from Search Console or live site checks.

## Operating Rules

1. Every work block must start with a progress ledger entry.
2. Every work block must end with files changed, commands run, verification result, and next action.
3. No broad Google Ads launch during this session.
4. Paid search work is draft only until `qualified_lead` appears in GA4 and at least one accepted lead path has been verified.
5. Avoid generic electrician traffic. This plan is for load studies first.
6. Do not treat form submissions as business wins until they are accepted by the worker and classified as potential customer leads.

## Defined Tracking Locations

1. Progress ledger, `seo-updates/load_study_growth_progress_2026_05_19.md`.
2. Main plan, `seo-updates/load_study_growth_plan_2026_05_19.md`.
3. Metrics snapshots, `seo-updates/load_study_metrics_YYYY_MM_DD.md`.
4. Ads draft, `seo-updates/load_study_google_ads_draft_YYYY_MM_DD.md`.
5. Internal link map, `seo-updates/load_study_internal_links_YYYY_MM_DD.md`.
6. Lead evidence, GitHub `leads` branch JSON files.
7. Deployment evidence, GitHub Actions run URL and Cloudflare Worker version.

## Baseline To Record Before New Work

1. Git commit and branch.
2. GitHub Pages latest successful deploy.
3. Cloudflare contact worker version.
4. Search Console last 7 complete days for load study pages.
5. GA4 last 7 complete days for `qualified_lead`, `generate_lead`, `form_submit`, `phone_click`, `email_click`, and `cta_click`.
6. Latest GitHub lead files and their `jobCategory`, `leadQuality`, and `spamAssessment`.

Verification is complete when the metrics snapshot exists and includes the commands or APIs used.

## Hour 1, Measurement And Baseline Report

Objective, create a current load study baseline so every later change has a before state.

Work:

1. Pull Search Console page and query data for `/electrical-load-studies/` and related load study articles.
2. Pull GA4 event data by `service_category`, if available.
3. Pull recent GitHub leads from `origin/leads`.
4. Summarize accepted leads, blocked spam, and job category classification.

Deliverable:

`seo-updates/load_study_metrics_2026_05_19.md`.

Verification:

1. The file lists the exact date ranges.
2. It separates organic traffic, lead actions, and accepted lead quality.
3. It names data gaps clearly.

## Hour 2, Load Study Landing Page Upgrade

Objective, make the page answer the buyer faster and prepare it for future paid traffic.

Work:

1. Tighten the hero headline and first paragraph around capacity confirmation before EV chargers, permits, tenant improvements, and service upgrades.
2. Add a short buyer path section, what we check, what you get, what to send.
3. Add clear deliverables, monitoring period, report, recommendations, permit or utility support.
4. Add a stronger load study call to action that points to the intake path.
5. Keep colors within existing CSS variables.

Primary files:

1. `site/app/[landing]/page.tsx`.
2. Any shared UI component only if reuse is justified.

Verification:

1. `npm run build` passes.
2. The page renders at `/electrical-load-studies/`.
3. Hero and CTA text fit on mobile and desktop.
4. No hardcoded new colors are introduced.

## Hour 3, Load Study Intake Form

Objective, collect the information needed to qualify a load study inquiry before a phone call.

Work:

1. Add load study specific intake fields when the form context is `electrical_load_studies`.
2. Suggested fields, property type, reason for study, new load type, EV charger count, utility, permit deadline, stamped report need, photos or plans available.
3. Include these fields in the worker payload.
4. Include these fields in GitHub lead JSON and lead notification issues.
5. Do not make the form too long for general contact traffic.

Primary files:

1. `site/app/components/ContactForm.tsx`.
2. `cloudflare-workers/contact-form.js`.
3. `.github/workflows/contact-form.yml`.

Verification:

1. Accepted load study test payload contains the extra intake fields.
2. Obvious spam still returns `accepted:false`.
3. `node --check cloudflare-workers/contact-form.js` passes.
4. `npm run build` passes.

## Hour 4, Lead Quality Report Script

Objective, make weekly review fast and repeatable.

Work:

1. Create a script that reads recent GitHub lead JSON from local files or `origin/leads`.
2. Group by `jobCategory`, `leadQuality`, source page, landing page, and spam reason.
3. Output markdown for the progress folder.
4. Include counts for potential customers, vendor spam, job seekers, and unknown leads.

Primary file:

`scripts/load_study_lead_report.py`.

Output:

`seo-updates/load_study_lead_report_YYYY_MM_DD.md`.

Verification:

1. Script runs from repo root.
2. Output includes the last 30 days.
3. Output includes at least one known spam example from existing leads.
4. Script exits cleanly when no new leads exist.

## Hour 5, Internal Link Buildout

Objective, push existing organic strength into the load study landing page.

Work:

1. Identify pages with relevant Search Console impressions, especially LADBS, Title 24, panel upgrades, commercial EV, commercial electrical, and inspection articles.
2. Add contextual links to the load study page where the content naturally supports capacity planning.
3. Use buyer intent anchor text such as electrical load study, EV charger load study, capacity study, permit load calculation.
4. Avoid stuffing links into unrelated pages.

Primary files:

1. `site/app/industry-insights/[slug]/page.tsx`, if links are template driven.
2. Content JSON or database updates, if links are content specific.
3. `seo-updates/load_study_internal_links_2026_05_19.md`.

Verification:

1. Link map lists source page, anchor text, destination, and reason.
2. `npm run build` passes.
3. A spot check confirms links appear on generated pages.

## Hour 6, Search Console Opportunity Refresh

Objective, update the load study keyword and page opportunity list.

Work:

1. Pull or export current Search Console rows for load study related pages and queries.
2. Compare landing page, cost guide, and explanatory article performance.
3. Identify pages to improve, consolidate, or link.
4. Write the top query themes for organic and paid search.

Deliverable:

`seo-updates/load_study_search_console_opportunities_2026_05_19.md`.

Verification:

1. Includes date range.
2. Includes clicks, impressions, CTR, and position.
3. Separates buyer intent from educational queries.
4. Lists the next 5 page changes.

## Hour 7, Google Ads Draft Package

Objective, prepare a small controlled ads test without launching it.

Work:

1. Draft campaign structure for load studies only.
2. Create keyword groups for permit load study, EV charger load study, commercial electrical capacity, and panel or service upgrade study.
3. Create negative keywords for jobs, training, DIY, calculator, salary, free, template, software, residential general electrician if not relevant.
4. Write 3 responsive search ad concepts.
5. Define launch rules, daily budget, location, conversion event, and stop conditions.

Deliverable:

`seo-updates/load_study_google_ads_draft_2026_05_19.md`.

Verification:

1. No campaign is launched.
2. Draft includes exact or phrase match only.
3. Draft uses `qualified_lead` as the intended conversion.
4. Draft defines pause conditions based on spend and qualified lead count.

## Hour 8, End To End Verification And Handoff

Objective, make the session auditable and leave clear next actions.

Work:

1. Run `npm run build`.
2. Run worker syntax check.
3. Run lead report script.
4. Review `git diff`.
5. Commit changes in one or more clear commits.
6. Push when ready.
7. Watch GitHub Pages deploy.
8. Deploy Cloudflare worker if worker changed.
9. Add final progress ledger entry with commit hash, deploy URL, worker version, tests, and known risks.

Verification:

1. Git working tree is clean or intentionally documented.
2. GitHub Pages deploy passes.
3. Worker deploy passes if applicable.
4. Live blocked spam smoke test returns `accepted:false`.
5. Live asset check confirms current tracking code is served.

## Success Criteria For The 8 Hour Session

1. Load study page is stronger and still builds cleanly.
2. Load study inquiries carry `electrical_load_studies` from landing through form submission.
3. Lead JSON contains enough detail to judge whether the inquiry is real.
4. Spam filtering remains live and tested.
5. Internal links into load studies are documented.
6. A repeatable report exists for leads.
7. A Google Ads draft exists, but no money is spent yet.
8. Progress is recorded in the ledger with evidence.

## Extra Work Queue If Core Plan Finishes Before 5:30 PM

1. Check real Search Console indexing, 404, redirect, and sitemap issues through API or browser.
2. Fix only confirmed issues with a live URL or Search Console evidence.
3. Improve SEO titles, descriptions, internal links, or content where Search Console shows impressions and weak CTR.
4. Use agent browser or Chrome checks to inspect live pages after deployment.
5. Record every extra task in the progress ledger with evidence and verification.

## Stop Conditions

1. Build fails and cannot be fixed within the current block.
2. Worker deploy fails or changes accepted lead behavior unexpectedly.
3. Contact form cannot submit accepted leads.
4. A change would risk losing existing leads or breaking the live contact form.
5. Paid ads require account access or billing confirmation not available in the current session.

## First Action For The Next Agent

1. Open this plan.
2. Open the progress ledger.
3. Record the starting git status.
4. Start with Hour 1 unless Mike explicitly chooses a later block.
