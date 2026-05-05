# Measurement Baseline, May 5, 2026

## Google Analytics Property

1. Account, Shaffer Construction.
2. Property, `properties/419617396`.
3. Web stream, `dataStreams/6454169024`.
4. Measurement ID, `G-3CZK5YJPNG`.
5. Default stream URL, `https://www.shaffercon.com`.

## Current Key Event Status

1. GA4 currently has only `purchase` marked as a key event.
2. The service account has read access to GA4 Admin and Data APIs.
3. The service account does not have GA4 edit scope authorization, so new key events must be marked in GA4 Admin or through an account with Analytics edit access.

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

## GA4 Admin Action Still Needed

Mark these event names as key events in GA4:

1. `generate_lead`.
2. `form_submit`.
3. `phone_click`.
4. `email_click`.

Primary business reporting should use `generate_lead`. The other key events are useful for debugging lead source by method.
