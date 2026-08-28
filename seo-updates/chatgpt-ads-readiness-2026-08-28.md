# ChatGPT Ads landing-page readiness — 2026-08-28

Scope: residential EV charging, panel upgrades, and electrical troubleshooting/repair pages for the initial central Los Angeles ad test.

## Verified

- Audited 30 local service pages across Silver Lake, Los Feliz, Echo Park, Atwater Village, Glendale, Burbank, Pasadena, Hollywood, West Hollywood, and Sherman Oaks.
- All 30 returned HTTP 200 to `OAI-AdsBot` with no unexpected redirect.
- All 30 include canonical URLs, index/follow metadata, one H1, phone number, and contact/quote path.
- The Los Angeles residential EV landing page also returns HTTP 200 to `OAI-AdsBot` and has matching title, H1, canonical, and quote CTA.
- Existing contact attribution already captures landing URL, referrer, UTM source/medium/campaign/term/content, and service category through the quote flow.

## Changes

- Explicitly allow `OAI-AdsBot` in `robots.txt` in addition to the existing `OAI-SearchBot` rule.
- Removed or softened unsupported/overly absolute timing and outcome claims on the 30 local pages used for paid traffic.
- Normalized A/B/C-10 wording to accurately describe them as classifications under Shaffer Construction's CSLB license rather than separate or "triple" licenses.
- Corrected references to nonexistent "City of Silver Lake" and "City of Echo Park" permitting offices to LADBS / City of Los Angeles permitting language.
- Removed a residential 24/7 emergency-service promise from the West Hollywood troubleshooting page and replaced it with current-availability and emergency-safety guidance.

## Landing-page strategy

- Residential EV ad group: use `/residential-ev-charger/` for LA-wide intent, with local EV pages as city-specific creative destinations where useful.
- Panel-upgrade ad group: use the matching local residential panel-upgrade page for city/ZIP-targeted ads. The existing Los Angeles panel guide can support informational/cost-intent creative.
- Electrical-repair ad group: use the matching local residential troubleshooting/repair page for city/ZIP-targeted ads instead of the homepage.

OpenAI conversion-pixel/CAPI setup remains separate and requires the advertiser account's measurement identifiers.
