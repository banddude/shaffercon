# Commercial EV Page Internal Links, June 12, 2026

Target page, `/commercial-electric-vehicle-chargers/`.

Source: live GSC pull, June 12 (90 days, Mar 14 to Jun 11). The target page sits at
position ~73 with about 2,000 impressions a month while the EV blog posts below carry
20k+ combined impressions at positions 6 to 33. The page content was reworked June 3
and 4 and does not need another rewrite. It needs link equity from the posts that
already rank. Each post already carried at most one templated intro link to the page,
so this adds one contextual in-body link per post (two for the ultimate guide, which
had zero), keeping every post at two links to the target max. Anchors are varied,
no exact-match stuffing.

| Source | 90d impressions / position | New anchor | Placement |
| --- | --- | --- | --- |
| `content/industry-insights/2026-01-13T09:00:00-california-2026-building-code-ev-charging-requirements-home-real-estate-trend-32-new-models.json` | 15,139 / 6.3 | commercial EV charging infrastructure | Federal tax credit deadline section, sentence about regulatory obligations plus expiring incentives. |
| `content/industry-insights/2026-01-16T09:00:00-nec-2026-qualified-installer-requirement-charging-reliability-86-percent-commercial-roi-3-5-year-payback.json` | 6,679 / 6.4 | EV charging infrastructure contractor | Qualified installer section, sentence about working with licensed contractors. |
| `content/industry-insights/the-ultimate-guide-to-ev-charger-installation-and-infrastructure-in-los-angeles.json` | 5,760 / 32.3 | scalable commercial EV charging infrastructure | Installation requirements section, commercial planning paragraph. Post had zero links to the target. |
| same file | | commercial EV charging solutions | Residential vs commercial section, paragraph that already links the residential EV page, now parallel. |
| `content/industry-insights/2025-11-26T09:00:00-tesla-supercharger-business-program-us-dc-fast-charging-record-gas-stations-ev-chargers-california-leads-adoption.json` | 5,644 / 10.4 | commercial EV charging contractor | What these developments mean section, professional installation sentence. |
| `content/industry-insights/2025-11-25T22:00:00-tesla-worlds-largest-supercharger-los-angeles-curbside-charging-expansion-volkswagen-network-access-dynamic-pricing-long-beach-ev-infrastructure.json` | 4,180 / 9.3 | commercial EV charging stations | Volkswagen NACS section, sentence about installing chargers that serve all vehicle types. |

No site.db change. Blog post bodies build from `content/industry-insights/*.json`
(see `site/lib/blog.ts`), so the JSON files are the single source of truth here,
matching how PR #33 handled the Title 24 post.

## Verification

Run `jq -r .content <file> | rg -o 'href="/commercial-electric-vehicle-chargers/"' | wc -l`
for each source file. Every post listed should report exactly 2.
