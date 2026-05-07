# Search Console 404 Redirect Fix

Date, 2026-05-07

## Summary

Google Search Console sent a failed validation notice for `Not found (404)` on `shaffercon.com`.

The root cause was that legacy URL redirects existed in the static Next.js app, but the site is exported to GitHub Pages. Next.js middleware and client side 404 page redirects do not return real HTTP 301 responses after export, so Google still saw HTTP 404 for some old URLs.

The fix was moved to the Cloudflare Worker `shaffercon-seo-redirects`, which runs before GitHub Pages and can return real HTTP 301 responses.

## Deployed Worker

Worker, `shaffercon-seo-redirects`

Version, `9003e9fe-9006-46bc-baf7-c8cfc7d50562`

Routes, `shaffercon.com/*`, `www.shaffercon.com/*`

Repo commit, `6a67f3b`

## Verified Live Redirects

The following URLs now return HTTP 301:

1. `https://shaffercon.com/home`, redirects to `https://shaffercon.com/`
2. `https://shaffercon.com/a-closer-look-at-our-load-study-services-and-why-your-ev-business-needs-them`, redirects to the matching Industry Insights post
3. `https://shaffercon.com/2023/10/03/exploring-shaffer-constructions-load-study-services-in-la`, redirects to the matching Industry Insights post
4. `https://www.shaffercon.com/electrical-load-studies/`, redirects to the apex domain

Broader live check, 74 legacy URL patterns checked, zero failures.

## Next Action

Open Search Console and click validate fix for the `Not found (404)` issue. The agent browser session was able to authenticate Google, but Search Console itself rendered blank in the browser automation session, so validation still needs either a normal browser session or another automation attempt later.
