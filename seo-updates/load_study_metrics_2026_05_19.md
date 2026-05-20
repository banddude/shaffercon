# Load Study Metrics Snapshot, May 19, 2026

Checked May 19, 2026.

Related plan, `seo-updates/load_study_growth_plan_2026_05_19.md`.

Primary category, `electrical_load_studies`.

Primary conversion event, `qualified_lead`.

## Deployment Baseline

| Surface | Status |
| --- | --- |
| Git branch | `main`, aligned with `origin/main` before this work block |
| Latest code commit before plan work | `d14cb7d`, `Improve lead tracking and spam filtering` |
| Latest GitHub Pages deploy | Success, run `26131469759`, commit `d14cb7d` |
| Deploy URL | `https://github.com/banddude/shaffercon/actions/runs/26131469759` |
| Contact form worker | `shaffercon-contact-form` |
| Worker version | `9685218e-d9b1-45df-8c48-6e49dcdb665e` |
| Worker deployed at | 2026-05-19 23:26:31 UTC |

## GA4 Baseline

Date range, May 12 to May 18, 2026.

Comparison range, May 5 to May 11, 2026.

| Metric | May 12 to May 18 | May 5 to May 11 |
| --- | ---: | ---: |
| Active users | 226 | 283 |
| Sessions | 243 | 293 |
| Page views | 260 | 316 |
| Engaged sessions | 66 | 69 |
| Event count | 861 | 1,073 |
| Key events | 2 | 36 |

Lead related events, May 12 to May 18:

| Event | Count | Key events |
| --- | ---: | ---: |
| `cta_click` | 10 | 0 |
| `email_click` | 1 | 1 |
| `generate_lead` | 1 | 1 |
| `qualified_lead` | 0 | 0 |
| `form_submit` | 0 | 0 |
| `phone_click` | 0 | 0 |

Important measurement gap:

`customEvent:service_category` is not yet available as a GA4 Data API dimension. The API returned `Field customEvent:service_category is not a valid dimension`. The site now sends this parameter, but GA4 still needs the custom dimension registered before category reporting is reliable.

## Search Console Baseline

Latest available Search Console date, May 17, 2026.

Recent range, May 11 to May 17, 2026.

Comparison range, May 4 to May 10, 2026.

| Metric | May 11 to May 17 | May 4 to May 10 |
| --- | ---: | ---: |
| Clicks | 56 | 60 |
| Impressions | 12,987 | 14,287 |
| CTR | 0.43% | 0.42% |
| Average position | 16.16 | 12.42 |

Load study page and article performance, May 11 to May 17:

| Page | Clicks | Impressions | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
| `/electrical-load-studies/` | 1 | 32 | 3.13% | 9.97 |
| `/industry-insights/electrical-load-studies-what-they-are-los-angeles/` | 1 | 78 | 1.28% | 6.01 |
| `/industry-insights/a-closer-look-at-our-load-study-services-and-why-your-ev-business-needs-them/` | 1 | 3 | 33.33% | 12.33 |
| `/industry-insights/electrical-load-study-cost-los-angeles/` | 0 | 7 | 0.00% | 6.57 |

Relevant query and page evidence, May 11 to May 17:

| Query | Page | Clicks | Impressions | Position |
| --- | --- | ---: | ---: | ---: |
| `who evaluates electrical capacity and infrastructure for building upgrades or new tenant loads` | `/electrical-load-studies/` | 0 | 2 | 10.00 |
| `who evaluates electrical capacity and infrastructure for building upgrades or new tenant loads` | `/industry-insights/electrical-load-studies-what-they-are-los-angeles/` | 0 | 6 | 6.33 |
| `electrical load studies` | `/industry-insights/electrical-load-studies-what-they-are-los-angeles/` | 0 | 1 | 12.00 |
| `load study` | `/industry-insights/electrical-load-studies-what-they-are-los-angeles/` | 0 | 1 | 22.00 |
| `electrical load upgrade` | `/industry-insights/complete-guide-electrical-panel-upgrades-los-angeles/` | 0 | 7 | 10.86 |
| `commercial energy load calculations venice` | `/service-areas/venice/commercial-pool-hot-tub-spa-electrical` | 0 | 2 | 20.00 |

Interpretation:

The load study landing page has a small but useful signal, position near 10 with 32 impressions. The stronger organic visibility is currently in supporting articles, especially the explanatory load study article at position near 6. The landing page should be improved and internally linked from high intent support content before paid traffic is tested.

## Lead Baseline

Latest recent GitHub lead files on `origin/leads` were created before the May 19 worker update, so `jobCategory`, `leadQuality`, and `spamAssessment` are mostly absent. Recent examples are still useful as spam training evidence.

Recent lead classes:

| Date | Sender | Classification |
| --- | --- | --- |
| May 16 | Martin Max, `martinmax79854@gmail.com` | SEO vendor spam |
| May 14 | Aliza John, `alizajohnproestimator1@gmail.com` | Estimating vendor spam, duplicate |
| May 12 | Kevin Hanratty, `darbridgeknows@gmail.com` | Broker or private equity spam, duplicate |
| May 10 | Aaron Broker, `may2326@businessbrokersleads.com` | Business broker spam |
| May 6 | Mateo Taylor, `mateo0taylor@gmail.com` | SEO vendor spam |
| May 6 | Joseph Matthews, `jmailservice.com` | SEO vendor spam |
| May 6 | Ashley Brown, `cachehelper.com` | Virtual assistant vendor spam |

Accepted load study leads found in recent GitHub form data, 0.

## Current Data Gaps

1. GA4 `service_category` is being sent by the site but is not registered as a reportable custom dimension yet.
2. `qualified_lead` has not appeared in standard GA4 reports yet.
3. Phone calls are tracked as clicks only, not as qualified call outcomes.
4. Recent lead JSON predates the new worker metadata.
5. Search Console load study volume is low enough that week to week movement can be noisy.

## Next Action

Proceed to Hour 2, upgrade `/electrical-load-studies/` so the page is ready for better organic conversion and a later controlled paid test.
