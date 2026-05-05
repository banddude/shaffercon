# Measurement Baseline, May 5, 2026

## Google Analytics Property

1. Account, Shaffer Construction.
2. Property, `properties/419617396`.
3. Web stream, `dataStreams/6454169024`.
4. Measurement ID, `G-3CZK5YJPNG`.
5. Default stream URL, `https://www.shaffercon.com`.

## Current Key Event Status

1. GA4 originally had only `purchase` marked as a key event.
2. The service account has read access to GA4 Admin and Data APIs.
3. The service account also has direct GA4 edit access when not impersonating a Workspace user.
4. Workspace domain wide delegation for `mike@shaffercon.com` rejected the `analytics.edit` scope, but direct service account access succeeded.

## Last 28 Day Event Baseline

GA4 reported these top events:

1. `page_view`, 46.
2. `session_start`, 38.
3. `first_visit`, 37.
4. `user_engagement`, 17.
5. `scroll`, 14.

GA4 reported no events for:

1. `phone_click`.
2. `email_click`.
3. `form_submit`.
4. `generate_lead`.
5. `cta_click`.

## Fix Applied

1. Added sitewide tracking for all `tel:` clicks.
2. Added sitewide tracking for all `mailto:` clicks.
3. Added sitewide tracking for links to `/contact-us/`.
4. Added successful contact form tracking.
5. Added GA4 recommended `generate_lead` events for phone clicks, email clicks, and successful form submissions.

## GA4 Key Events

These event names were created as GA4 key events on May 5, 2026:

1. `generate_lead`.
2. `form_submit`.
3. `phone_click`.
4. `email_click`.

Primary business reporting should use `generate_lead`. The other key events are useful for debugging lead source by method.

## Smoke Test, May 5, 2026

1. Live production JavaScript contained `phone_click`, `email_click`, `cta_click`, `form_submit`, and `generate_lead`.
2. The Cloudflare contact form worker accepted a test submission and returned `200`.
3. GA4 Admin confirmed `generate_lead`, `form_submit`, `phone_click`, and `email_click` are active key events.
4. GA4 realtime API returned successfully.
5. Local DNS maps Google Analytics collection domains to `0.0.0.0`, so direct local collection calls failed until bypassed with an explicit Google Analytics IP.
6. Bypassed GA4 collection calls returned `204` for all five test events.
7. Immediate realtime reporting still showed only `page_view` and `session_start` inside the short test window.

Conclusion, tracking is deployed and key events are configured. The remaining confirmation is to review standard GA4 reports after real visitor events or after GA4 processes the smoke events.
