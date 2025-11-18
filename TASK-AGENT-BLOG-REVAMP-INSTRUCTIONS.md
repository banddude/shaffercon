# Task Agent Instructions: Blog Post Revamp

## YOUR MISSION
You will revamp a SINGLE blog post from 2023 to meet current 2025 quality standards. You will receive a specific JSON file path to work on.

## COMPANY CONTEXT
- **Company:** Shaffer Construction, Inc.
- **Phone:** 323-642-8509
- **Email:** hello@shaffercon.com
- **Address:** 325 N Larchmont Blvd. #202, Los Angeles, CA 90004
- **Specialty:** Electrical and General Contractor specializing in EV charger installation
- **Service Area:** Los Angeles, California

## SERVICE PAGES AVAILABLE FOR INTERNAL LINKING (Choose 1-2 relevant ones)
- `/commercial-electric-vehicle-chargers` - Commercial EV charging solutions
- `/residential-ev-charger` - Residential EV charger installation
- `/electrical-load-studies` - Electrical load studies and panel upgrades
- `/led-retrofit-services` - LED lighting retrofit services
- `/statewide-facilities-maintenance` - Statewide facilities maintenance
- `/service-areas/[location]/residential-ev-charger-installation` - Location-specific EV installation
- `/service-areas/[location]/commercial-ev-charger-installation` - Location-specific commercial EV
- `/service-areas/[location]/residential-lighting-installation-retrofitting` - Location-specific lighting
- `/service-areas/[location]/residential-electrical-safety-inspections` - Safety inspections

## QUALITY BLOG POSTS FOR INTERNAL LINKING (Choose 2-4 relevant ones)
- `/industry-insights/ev-charging-infrastructure-update-record-u-s-expansion-pennsylvania-nevi-leadership-global-growth-and-innovative-streetlight-solutions`
- `/industry-insights/emerging-trends-in-ev-charger-installation-and-infrastructure`
- `/industry-insights/preparing-los-angeles-buildings-for-the-ev-charging-boom-what-owners-developers-and-businesses-need-to-know`
- `/industry-insights/ev-charger-installation-infrastructure-how-to-decide-pay-for-and-plan-your-project`
- `/industry-insights/planning-ev-charger-infrastructure-installation-in-los-angeles-costs-options-and-what-to-expect`
- `/industry-insights/ev-charging-infrastructure-in-2025-what-property-owners-in-los-angeles-need-to-know`
- `/industry-insights/ev-charger-installation-in-los-angeles-what-property-owners-need-to-know`
- `/industry-insights/how-ready-is-your-property-for-ev-chargers-a-practical-guide-for-los-angeles-homeowners-businesses`

## YOUR STEP-BY-STEP PROCESS

### Step 1: Read the Original Post
Read the JSON file you've been assigned and extract:
- Current title
- Current slug
- Current metadata
- Current content (will likely be skeleton/poor quality)
- Topic focus

### Step 2: Research the Topic
Research current 2025 information about the blog post topic:
- If it's about a specific electrical service (panel upgrades, GFCI, etc.), research current best practices
- If it's about EV charging, research latest 2025 developments
- If it's location-specific, research Los Angeles relevance
- Find 3-5 authoritative sources (NOT Wikipedia, NOT competitor sites)

Good sources: DOE.gov, Energy.gov, NEC code resources, manufacturer sites (Tesla, ChargePoint), industry news (Electrek, CleanTechnica)

### Step 3: Write Completely New Content
Create 1,500-2,500 word content with this structure:

```html
<h2>Introduction</h2>
<p>[Opening paragraph introducing the topic and mentioning Shaffer Construction]</p>

<h2>[Major Topic Heading 1]</h2>
<p>[Content explaining this aspect with source citations using <a href="[URL]" target="_blank" rel="noreferrer noopener">inline links</a>]</p>
<p>[Additional paragraphs with Los Angeles relevance and how Shaffer Construction helps]</p>

<h2>[Major Topic Heading 2]</h2>
<p>[Content with internal link to relevant blog post: <a href="/industry-insights/slug">descriptive anchor text</a>]</p>
<p>[Connection to Shaffer Construction services]</p>

<h2>[Major Topic Heading 3]</h2>
<p>[Content with internal link to service page: <a href="/residential-ev-charger">EV charger installation services</a>]</p>

<h2>[Major Topic Heading 4]</h2>
<p>[More content tied to Los Angeles and Shaffer Construction's expertise]</p>

<h2>[Major Topic Heading 5]</h2>
<p>[Final section content]</p>

<h2>Conclusion</h2>
<p>[Summary of key points]</p>
<p>For expert electrical services in Los Angeles, including EV charger installation, panel upgrades, and electrical safety inspections, contact Shaffer Construction, Inc. Call us at <strong>323-642-8509</strong> or email <a href="mailto:hello@shaffercon.com">hello@shaffercon.com</a> to schedule a consultation. Visit our website at <a href="https://www.shaffercon.com">shaffercon.com</a> to learn more about our services.</p>
```

### Step 4: Content Requirements CHECKLIST
- [ ] 1,500-2,500 words total
- [ ] 5-6 major sections with `<h2>` headings
- [ ] 2-4 internal blog post links naturally woven into content (NO target="_blank")
- [ ] 1-2 service page links naturally woven into content (NO target="_blank")
- [ ] All external sources cited with `target="_blank" rel="noreferrer noopener"`
- [ ] NO Wikipedia links
- [ ] Strong CTA at end with bolded phone **323-642-8509**
- [ ] Los Angeles mentioned throughout
- [ ] Shaffer Construction mentioned in intro and at least once per major section
- [ ] Simple HTML only: `<h2>`, `<p>`, `<a>`, `<strong>`
- [ ] NO `<h1>`, NO CSS, NO style attributes, NO `<div>`, NO lists

### Step 5: Update Metadata
Keep the existing:
- title (only update if it's clearly broken)
- slug (NEVER change)
- date (NEVER change)

Update if needed:
- metaTitle: Should be "[Title] | Shaffer Construction, Inc." (under 60 chars total)
- metaDescription: 150-160 chars, compelling with keywords
- ogImage: Can leave as empty string ""
- canonicalUrl: Keep as-is

### Step 6: Write the Updated JSON File
Use the Write tool to save the updated JSON file with the exact same filename.

Ensure valid JSON:
- Escape quotes in content field if needed
- No trailing commas
- Proper formatting

### Step 7: Return Summary
Provide a concise summary:
- File updated: [filename]
- Word count: [approximate count]
- Internal blog links added: [count]
- Internal service links added: [count]
- External sources cited: [count]
- Key improvements made

## CRITICAL RULES
1. NEVER change the slug or date
2. NEVER use Wikipedia links
3. ALWAYS include 2-4 internal blog links
4. ALWAYS include 1-2 service page links
5. ALWAYS use simple HTML only
6. ALWAYS include strong CTA with phone number
7. ALWAYS tie content to Los Angeles and Shaffer Construction
8. NEVER use target="_blank" on internal links
9. ALWAYS use target="_blank" rel="noreferrer noopener" on external links
10. Write for 2025, not 2023

## EXAMPLE INTERNAL LINKS FORMAT
```html
<!-- CORRECT - Internal blog link -->
<p>As we discussed in our <a href="/industry-insights/ev-charging-infrastructure-in-2025-what-property-owners-in-los-angeles-need-to-know">guide to EV charging infrastructure for Los Angeles property owners</a>, proper planning is essential.</p>

<!-- CORRECT - Internal service link -->
<p>Our <a href="/residential-ev-charger">residential EV charger installation services</a> include load studies, panel upgrades, and permit handling.</p>

<!-- CORRECT - External source link -->
<p>According to the <a href="https://www.energy.gov/example" target="_blank" rel="noreferrer noopener">Department of Energy</a>, EV adoption continues to grow.</p>
```

## FINAL CHECKLIST BEFORE RETURNING
- [ ] Read the original file ✓
- [ ] Researched topic with current 2025 information ✓
- [ ] Wrote 1,500-2,500 words of new content ✓
- [ ] Included 2-4 internal blog links ✓
- [ ] Included 1-2 service page links ✓
- [ ] External sources properly cited ✓
- [ ] Strong CTA with contact info ✓
- [ ] Valid JSON format ✓
- [ ] Wrote updated file with Write tool ✓
- [ ] Returned concise summary ✓

Good luck! Focus on creating high-quality, SEO-optimized content that helps Los Angeles property owners while promoting Shaffer Construction's expertise.
