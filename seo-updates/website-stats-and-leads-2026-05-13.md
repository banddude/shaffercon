# Website Stats And Lead Check, May 13, 2026

Checked at 2026-05-13 10:19 PDT.

## Summary

The last two complete days were stronger than the prior weekend. GA4 sessions, active users, page views, engaged sessions, and Search Console clicks all improved compared with May 9 to May 10.

The seven day Search Console trend is still down versus the prior seven days. Contact form lead quality remains poor. The highest value current lead is still the KMC LA lighting conversation, not a form submission.

## Deployment

Latest GitHub Pages deploy succeeded for commit `5e328e9`, `Add current SEO status doc`.

## GA4

| Metric | May 11 to May 12 | May 9 to May 10 |
| --- | ---: | ---: |
| Active users | 67 | 40 |
| Sessions | 71 | 41 |
| Page views | 81 | 40 |
| Engaged sessions | 24 | 7 |
| Key events | 6 | 2 |

Seven day comparison:

| Metric | May 6 to May 12 | Apr 29 to May 5 |
| --- | ---: | ---: |
| Active users | 261 | 79 |
| Sessions | 268 | 84 |
| Page views | 294 | 91 |
| Engaged sessions | 66 | 24 |
| Key events | 28 | 8 |

Note, GA4 was fixed on May 5, so the seven day increase mostly reflects tracking becoming reliable.

Lead events, May 11 to May 12:

| Event | Count | Notes |
| --- | ---: | --- |
| `generate_lead` | 3 | Two form submits from duplicate broker spam, one phone click from a Copilot referral |
| `form_submit` | 2 | Duplicate broker spam from `darbridgeknows@gmail.com` |
| `phone_click` | 1 | From a Copilot referral on an EV blog post |
| `cta_click` | 2 | One organic, one Docs referral |

The phone click from Copilot is interesting, but it cannot be confirmed as a real job lead from GA4 alone.

## Search Console

| Metric | May 11 to May 12 | May 9 to May 10 |
| --- | ---: | ---: |
| Clicks | 20 | 3 |
| Impressions | 3,781 | 2,919 |
| CTR | 0.53% | 0.10% |
| Average position | 14.96 | 12.74 |

Seven day comparison:

| Metric | May 6 to May 12 | Apr 29 to May 5 |
| --- | ---: | ---: |
| Clicks | 52 | 71 |
| Impressions | 13,501 | 14,464 |
| CTR | 0.39% | 0.49% |
| Average position | 13.15 | 12.66 |

Interpretation, the last two days recovered from the weekend, but the seven day trend is still softer. CTR and average position are still the main SEO constraints.

Top Search Console pages, May 11 to May 12:

| Page | Clicks | Impressions | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
| `/` | 3 | 41 | 7.32% | 11.12 |
| `/contact-us/` | 3 | 50 | 6.00% | 23.64 |
| `/industry-insights/california-title-24-electrical-requirements-renovations/` | 2 | 283 | 0.71% | 6.98 |
| `/industry-insights/ladbs-electrical-permit-process-step-by-step-guide/` | 2 | 458 | 0.44% | 7.64 |
| `/industry-insights/electrical-load-studies-what-they-are-los-angeles/` | 1 | 22 | 4.55% | 5.73 |
| `/industry-insights/federal-pacific-zinsco-panels-replacement-los-angeles/` | 1 | 49 | 2.04% | 8.24 |
| `/service-areas/santa-monica/residential-ev-charger-installation/` | 1 | 20 | 5.00% | 6.80 |

## Leads

GitHub form leads since the last report:

| Date | Name | Email | Classification |
| --- | --- | --- | --- |
| May 12 | Kevin Hanratty | `darbridgeknows@gmail.com` | Broker or private equity spam |
| May 12 | Kevin Hanratty | `darbridgeknows@gmail.com` | Duplicate broker or private equity spam |

Email to `hello@shaffercon.com` since May 11:

| Date | Sender | Topic | Status |
| --- | --- | --- | --- |
| May 12 | Christopher Jimenez | Electrical trainee seeking opportunity | Replied May 12, not a customer lead |

Other active website lead:

| Lead | Status |
| --- | --- |
| KMC LA lighting project | Replied with photos, budget under 5k, ceiling about 15 ft, needs brighter video friendly lighting. Next reply should ask for switch photo and recording position, then propose a targeted LED retrofit concept. |

## Recommended Next Work

1. Reply to KMC LA and move that lead forward.
2. Add contact form spam filtering, private equity and broker spam is now repeating.
3. Keep optimizing Title 24, LADBS, electrical inspection, panel upgrade, and load study pages.
4. Add internal links into `/electrical-load-studies/` from LADBS, Title 24, inspection failure, panel upgrade, and commercial electrical support pages.
5. Keep watching AI referrals. The Copilot phone click could be noise, but it is a useful signal that LLM referral traffic can produce lead actions.
