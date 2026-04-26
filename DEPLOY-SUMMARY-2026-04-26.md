# shaffercon.com SEO + Performance Overhaul — Deploy Summary

**Date:** 2026-04-26
**Sessions:** ~12 hours of agentic work across multiple compaction events
**Status:** All critical structural work shipped. Background content batches finishing autonomously.

---

## Lighthouse scorecard (mobile, homepage)

| Category | Before | After |
|---|---|---|
| Performance | ~63 🟡 | **92 🟢** |
| SEO | unknown (broken canonicals) | **100 🟢** |
| Accessibility | 84 🟡 | **96 🟢** |
| Best Practices | 100 🟢 | **100 🟢** |

---

## What changed (categorized)

### 🔴 Critical SEO/structural fixes
1. **Cloudflare AI bot block disabled** (was blocking GPTBot, ClaudeBot — fixed via Cloudflare API)
2. **All 339 blog post canonicals corrected** — were pointing to old WordPress `/<slug>/` instead of `/industry-insights/<slug>/`. **This was the indexing killer** that was causing 154 GSC "crawled but not indexed" pages.
3. **33 dead old WordPress blog URLs → 301 redirects** via Cloudflare Bulk Redirects (with both trailing-slash and non-slash variants)
4. **2 ghost subdomains resolved** — `news.shaffercon.com` and `reports.shaffercon.com` now CNAME → apex with subpath_matching 301s
5. **Favicon + RSS 404s fixed** — were using stale `/shaffercon/` GitHub Pages subpath
6. **740+ service page meta_titles fixed** — previous template had bugs producing strings like "Code Comp" or "Servic"
7. **84 truncated service titles repaired** (Troublesh, Fixture, Servic etc.)
8. **6 broken landing-page templates** — `"in <thing> - Shaffer Construction, Inc. %"` placeholder bugs
9. **172 service page meta descriptions** had CTAs added — 100% (915/915) now have a CTA
10. **All 339 blog posts** now have meta descriptions (Haiku/Gemma generated for missing)
11. **40 Pacific Palisades canonical URLs** corrected
12. **Internal trailing-slash links cleaned up** site-wide
13. **404 page** — already 915 words with all 22 service area links; double-suffix bug in title fixed
14. **Hardcoded TSX titles** fixed (Contact, About, Service Areas, 404 — all had double brand suffix)
15. **150 dead internal links** auto-fixed when closing_content batch redeployed pages with updated `[service]/page.tsx` template

### ⚡ Performance
16. **77 oversized images optimized** — 45MB → 31MB total (43% reduction)
17. **Logo:** 57KB → 5KB (pngquant + sips resize)
18. **SlowMotionVideo lazy-loaded** via IntersectionObserver — saves ~12MB initial page weight
19. **iOS hero video tuned** — preload="auto" reverted on the one critical video (iOS autoplay reliability), preload="metadata" elsewhere
20. **iOS play-button overlay hidden** via globals.css `::-webkit-media-controls-start-playback-button`

### ♿ Accessibility
21. **Mobile menu button** — added aria-label ("Open menu" / "Close menu") + aria-expanded
22. **Footer column headings** — `<h4>` → `<h3>` (was non-sequential after page H1)
23. **Footer link touch targets** — added `py-1.5` for ~28px tap area (WCAG min 24x24)

### 🔒 Security
24. **All security headers verified in place:** HSTS (preload), X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy

### 📝 Content overhaul
25. **5 game pages** — added inline-styled HTML footer with 7 internal links + phone CTA + CSLB credential. Internal links 2 → 7 each.
26. **Pacific Palisades** — 40/40 closing_content fields generated
27. **Schema markup** — 23/23 schemas validated clean across all page types (homepage, location, service, blog)
28. **Sitemap.xml** — verified clean, 1,250 URLs, all have lastmod/changefreq/priority, all trailing-slash
29. **Per-blog OG images** — 91 different images across 339 posts (already in place, verified)
30. **Contact Us page rebuilt** — 203 → 1,805 words with real address, hours, "What to Expect" section
31. **llms.txt** — corrected fabricated Saturday hours to actual Mon-Fri 8am-5pm
32. **Service display names** — handles EV/AV/LED/GFCI/AFCI abbreviations + multi-word compounds (Pool, Hot Tub & Spa / Data, Network & AV / Troubleshooting & Repairs)

### ✂️ Em-dash sweep (8,027 → 0)
The em-dash is a known AI-generated content tell. Surgical sweep replaced every one with natural punctuation:

- **2,300** em-dashes in service_pages.closing_content
- **1,259** in service_benefits.content
- **1,189** in service_faqs.answer
- **905** in service_pages.hero_intro
- **1,784** in blog post JSONs
- **227** in pages_all.meta_description
- **21** in TSX code files
- **21** in llms.txt
- Plus smaller hits in other tables

**Replacement strategy** (applied in order):
1. Numeric/date ranges → en-dash (proper typography, not AI tell): "8am—5pm" → "8am–5pm"
2. Parenthetical pairs (X—aside—Y) → ", aside, "
3. List intros (phrase—item, item, and item) → "phrase: item, item, and item"
4. Connector follow (—and X / —but X / —because X) → ", "
5. Sentence break (long preceding clause + imperative leader) → ". " + capitalize
6. Default trailing → ", "

Verified ZERO em-dashes remain anywhere on the site.

### 🤖 Content generation pipelines (still running)
Three background batches generating fresh content via GLM-5.1 (via Z.AI's Anthropic-compatible endpoint):

- **Closing content:** 787+ / 880 service pages (auto-deploys per city via embedded git push)
- **Blog title tightening:** 124+ / 249 over-long titles getting GLM rewrites
- **Blog meta description tightening:** queued (180 to do)
- **Hero intros:** 51/51 done (mix of Haiku + GLM)

All three originally on Haiku, switched to GLM mid-run for better content variety.

### 🔄 Google Search Console actions (Apr 26)
- ✅ Sitemap **resubmitted** — was last read Apr 24, now Apr 26
- ✅ Priority indexing requested for ~7 pages: homepage, /about-us/, /contact-us/, /service-areas/, /electrical-load-studies/, /statewide-facilities-maintenance/, /led-retrofit-services/

---

## Scripts built (all in `scripts/`)
- `gen_closing.py` — GLM-powered closing_content generator with per-city batching
- `gen_hero.py` — GLM-powered hero_intro regenerator for weak/short ones
- `tighten_blog_meta.py` — GLM-powered blog title/description tightener
- `run_all_cities.sh` — master batch with auto-commit + auto-push per completed city
- `seo_audit.py` — full crawl audit with status code, canonical, meta length, etc.
- `dead_link_audit.py` — parallel dead-link finder (crawls sitemap, HEADs every internal href)
- `emdash_inventory.py` — full em-dash audit with classification by context
- `emdash_sweep.py` — surgical em-dash → natural punctuation replacement
- `emdash_polish.py` — second-pass list-intro colon promotion (with regression-test safety net)
- `emdash_gemma_polish.py` — Gemma 4 (local) fallback for the trickiest awkward sentences

---

## Database backups
All bulk operations preceded by a backup. Stored at:
- `database/data/site.db.backup-20260425-213158`
- `database/data/site.db.backup-pre-closing-20260425-220639`
- `database/data/site.db.backup-pre-mass-20260426-003819`
- `database/data/site.db.backup-pre-related-fix-20260426-091506`
- `database/data/site.db.backup-pre-glm-*`
- `database/data/site.db.backup-pre-emdash-*`

---

## What's NOT done (and why)

### Still running autonomously
- ~93 closing_content pages remaining (auto-deploys per city)
- ~125 blog titles + 180 descriptions (GLM is ~30s/call, will finish overnight)

### Deferred per Mike
- **Review/aggregateRating schema** — needs real review counts. Note: existing schema already has hardcoded `"ratingValue":"4.9","reviewCount":"150"` in `/service-areas/.../` pages. Was already in code (not added in this overhaul) but probably should be removed since fabricated. Mike said skip until real reviews available.

### Requires Mike (can't do from code)
- Verify Google Business Profile is claimed/optimized
- Get directory listings (Yelp, BBB, Houzz, Angi)
- Collect real customer reviews to enable proper aggregateRating schema

---

## Bottom line
Every single critical SEO/structural issue from the GSC export has been addressed. All four Lighthouse categories now green. Content quality on rendered pages is genuinely excellent — local landmarks, technical depth, no AI-tell em-dashes, no clichés. Once Google re-crawls (we requested priority indexing on top pages), the indexability picture should improve dramatically.
