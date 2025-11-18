# Blogging Guide for Shaffer Construction

## Overview
This guide explains how to create and post SEO-optimized blog posts about EV charging infrastructure to shaffercon.com using JSON files stored in the GitHub repository. Posts are automatically built and deployed via GitHub Actions.

## Company Information
**Company:** Shaffer Construction, Inc.
**Website:** https://www.shaffercon.com
**Phone:** 323-642-8509
**Email:** hello@shaffercon.com
**Address:** 325 N Larchmont Blvd. #202, Los Angeles, CA 90004
**Specialty:** Electrical and General Contractor specializing in EV charger installation and infrastructure
**Service Area:** Los Angeles, California

## Repository Information
**Repo:** https://github.com/banddude/shaffercon
**Blog Content Location:** `/Users/mikeshaffer/AIVA/website/content/industry-insights/`
**Format:** JSON files with HTML content

## Step-by-Step Process

### 1. Review Existing Blog Posts (Check for Duplicates First!)

**CRITICAL REQUIREMENTS - YOU MUST DO ALL FOUR:**

1. **Avoid duplicate topics** - Don't write about the same stories already covered in recent posts
2. **Match format and style** - Use consistent writing style, tone, and structure
3. **⚠️ INTERNAL LINKING IS MANDATORY ⚠️** - You MUST include internal links in EVERY new post:
   - **2-4 blog post links** (for topical authority and SEO)
   - **1-2 service page links** (for conversions)
   - This is NOT optional - it's a core SEO requirement
4. **Fetch the sitemap** - Get current service pages to link to

**IMPORTANT:** You MUST complete these steps FIRST:
- Review the last 5-10 blog posts to identify topics covered and create linking opportunities
- Study the writing style and format to match it
- **Fetch the sitemap to identify relevant service pages to link to:**

```bash
curl -s "https://shaffercon.com/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed 's/<loc>//g; s/<\/loc>//g'
```

**Create an internal linking plan with:**
- 2-4 relevant blog posts URLs
- 1-2 relevant service page URLs (prioritize: EV Charger Installation, Panel Upgrades, Electrical Load Studies)

**Get list of recent posts:**

```bash
ls -lt /Users/mikeshaffer/AIVA/website/content/industry-insights/ | head -10
```

**Read recent post to match style:**

```bash
cat /Users/mikeshaffer/AIVA/website/content/industry-insights/[FILENAME].json | jq -r '.content' | head -100
```

Read through the entire post carefully and match:
- Writing tone and style
- Section structure and heading format
- How news is tied to Shaffer Construction's services
- Paragraph length and structure
- Call-to-action exact wording and format

**Create an internal linking map:** Note 2-4 relevant previous posts that could be naturally referenced in your new content for SEO benefit.

### 2. Research Recent News (Last 24-48 Hours)

Now that you know what topics to avoid, search for 10+ EV charging infrastructure news stories using web search:

**Search Topics:**
- EV charging infrastructure news
- NEVI program updates
- Tesla Supercharger expansion
- ChargePoint, EVgo, Electrify America network news
- Wireless charging breakthroughs
- EV adoption statistics
- Federal/state EV incentives
- Charging technology innovations

**Important:** Look for stories from the past 24-48 hours for maximum relevance and avoid topics already covered in the last 5 posts.

### 3. Select Best 5 Sources

**Selection Criteria:**
- ✅ Recent (within last 24-48 hours preferred)
- ✅ Authoritative sources (government, major publications, industry news)
- ✅ Non-competitor content
- ✅ Diverse topics (mix of policy, technology, statistics, expansion)
- ❌ AVOID: Other electrical contractors, installation companies, competitor blogs

**Good Sources:**
- Government sites (DOE, state DOT agencies)
- Auto industry news (Electrek, InsideEVs, TeslaNorth, CleanTechnica)
- Tech news sites
- Industry reports and statistics
- Major OEM announcements (Tesla, automakers, charging networks)

**Avoid Sources:**
- Other electrical contractors
- Competitor EV installation companies
- Commercial promotional content from competitors

### 4. Write the Blog Post

**Format:** Simple HTML (no CSS, no style attributes)

**🚨 CRITICAL: INTERNAL LINKS ARE MANDATORY 🚨**
Before writing, you MUST have identified 2-4 previous blog posts to link to internally. Include these links naturally within your content where contextually relevant.

**IMPORTANT:** Base your structure and writing style on the existing blog post you reviewed in Step 1.

**Structure Template:**
```html
<h2>Introduction</h2>
<p>[Opening paragraph mentioning Shaffer Construction and previewing content]</p>

<h2>[First Major Topic Heading]</h2>
<p>[Content with <a href="[URL]" target="_blank" rel="noreferrer noopener">inline source citations</a>]</p>
<p>[Additional paragraphs]</p>
<p>[Connection to Shaffer Construction's services and Los Angeles implications]</p>

<h2>[Second Major Topic Heading]</h2>
<p>[Content with source citations]</p>
<p>[Connection to services]</p>

<h2>[Third Major Topic Heading]</h2>
<p>[Content with source citations]</p>
<p>[Connection to services]</p>

<h2>[Fourth Major Topic Heading]</h2>
<p>[Content with source citations]</p>
<p>[Connection to services]</p>

<h2>[Fifth Major Topic Heading]</h2>
<p>[Content with source citations]</p>
<p>[Connection to services]</p>

<h2>Conclusion</h2>
<p>[Summary paragraph]</p>
<p>[Final CTA paragraph with contact info - use exact format from existing blog posts]</p>
```

**Content Guidelines:**
- **Length:** 1,500-2,500 words
- **Tone:** Professional, informative, authoritative but accessible
- **Keywords:** Naturally integrate: "Los Angeles", "EV charger installation", "electrical contractor", "infrastructure", "Shaffer Construction"
- **External Links:** All external links must have `target="_blank" rel="noreferrer noopener"`
- **Internal Blog Links:** Include 2-4 contextual internal links to relevant previous blog posts (do not use `target="_blank"` for internal links)
- **Internal Service Links:** Include 1-2 links to relevant service pages from the sitemap (prioritize EV Charger Installation, Panel Upgrades, Electrical Load Studies)
- **Pitch:** Each section should tie news back to Shaffer Construction's services
- **Local Focus:** Always connect national/global news to Los Angeles implications
- **Call to Action:** Strong CTA at end with contact info, phone (bolded), email, website

**HTML Elements to Use:**
- `<h2>` for section headings (use ONE per section)
- `<p>` for paragraphs
- `<a href="URL" target="_blank" rel="noreferrer noopener">` for external links
- `<a href="URL">` for internal links to other blog posts (no target or rel attributes)
- `<strong>` for phone number in CTA
- `<a href="mailto:hello@shaffercon.com">` for email links

**Do NOT Use:**
- `<h1>` tags (Next.js handles this)
- CSS or style attributes
- `<div>` or `<span>` tags
- Images in content (ogImage only)
- `<ul>` or `<ol>` lists (paragraphs only for this format)

### 5. Create JSON Blog Post File

**Filename Format:** `YYYY-MM-DDTHH:MM:SS-slug.json`

Example: `2025-11-18T19:00:00-latest-ev-charging-news.json`

**JSON Structure:**
```json
{
  "title": "Your SEO-Optimized Title",
  "slug": "your-url-slug",
  "date": "2025-11-18T19:00:00",
  "metaTitle": "Your Title | Shaffer Construction",
  "metaDescription": "Your 150-160 character meta description with keywords",
  "ogImage": "/images/blog/your-image.jpg",
  "canonicalUrl": "",
  "content": "<h2>Introduction</h2><p>Your HTML content here...</p>"
}
```

**Field Guidelines:**
- **title**: 50-60 characters, include main keyword
- **slug**: URL-friendly version of title (lowercase, hyphens)
- **date**: ISO 8601 format with time
- **metaTitle**: Title + " | Shaffer Construction" (under 60 chars total)
- **metaDescription**: 150-160 chars, compelling with keywords
- **ogImage**: Path to image (or empty string)
- **canonicalUrl**: Leave empty string (auto-generated)
- **content**: Full HTML content as single string (escape quotes if needed)

**Create the file:**
```bash
cat > /Users/mikeshaffer/AIVA/website/content/industry-insights/2025-11-18T19:00:00-your-slug.json <<'EOF'
{
  "title": "Your Title",
  "slug": "your-slug",
  "date": "2025-11-18T19:00:00",
  "metaTitle": "Your Title | Shaffer Construction",
  "metaDescription": "Your description",
  "ogImage": "",
  "canonicalUrl": "",
  "content": "<h2>Introduction</h2><p>Your content...</p>"
}
EOF
```

### 6. Commit and Deploy

**Push to GitHub to trigger automatic deployment:**

```bash
cd /Users/mikeshaffer/AIVA/website
git add content/industry-insights/[YOUR-FILENAME].json
git commit -m "Add blog post: [Your Title]"
git push origin main
```

**GitHub Actions will automatically:**
1. Build the Next.js site with your new post
2. Generate static HTML for all 1,000+ pages
3. Update sitemap.xml with new post
4. Deploy to GitHub Pages (shaffercon.com)

**Deployment takes ~2 minutes**

### 7. Verify Publication

**Check deployment status:**
```bash
gh run list --limit 1
```

Wait for status to show "completed success"

**Then verify the post:**
```bash
curl -sI https://shaffercon.com/industry-insights/your-slug/
```

Should return `HTTP/2 200`

**Visit the live URL to verify:**
- https://shaffercon.com/industry-insights/your-slug/
- Check formatting, links, content rendering

## Example Title Formats

- "EV Charging Infrastructure Update: [Main Topic], [Second Topic], and [Third Topic]"
- "Major Developments in EV Charging: [Key Story] and What It Means for Los Angeles"
- "[Number] EV Charging Infrastructure Stories Shaping [Month] 2025"
- "Latest EV Charging News: [Topic Focus] for Los Angeles Property Owners"

## Quality Checklist

Before posting, verify:
- [ ] 1,500-2,500 words
- [ ] 5 unique, recent, authoritative sources cited
- [ ] No competitor sources
- [ ] All external links have `target="_blank" rel="noreferrer noopener"`
- [ ] **🚨 MANDATORY: 2-4 contextual internal links to relevant previous blog posts included 🚨**
- [ ] **🚨 MANDATORY: 1-2 links to relevant service pages (EV Charger Installation, Panel Upgrades, etc.) 🚨**
- [ ] **🚨 MANDATORY: All internal links use descriptive anchor text and do NOT have `target="_blank"` 🚨**
- [ ] Strong CTA at end with bolded phone number
- [ ] Company name, services, and Los Angeles mentioned throughout
- [ ] Each section ties news to Shaffer Construction's services
- [ ] Simple HTML only (no style, no CSS)
- [ ] Title is SEO-optimized and descriptive
- [ ] No emojis or casual language
- [ ] Valid JSON format (use online validator if unsure)
- [ ] Filename follows date-slug format

## Internal Linking Strategy for SEO

**Why Internal Links Matter:**
- Improves search engine crawlability and indexing
- Distributes link equity across your site
- Reduces bounce rate and increases time on site
- Establishes topical authority in EV charging
- Enhances user experience by connecting related content

**Implementation Guidelines:**
- Include 2-4 internal links per blog post
- Link naturally within the content flow (not forced)
- Use descriptive anchor text that indicates what the linked post is about
- Link to relevant, related posts only
- Do not use `target="_blank"` or `rel` attributes on internal links
- Spread links throughout the post (not all in one section)

**When to Link:**
- When mentioning a topic covered in depth in another post
- When referencing specific programs, technologies, or regulations explained elsewhere
- When providing additional context or background information
- In the conclusion when suggesting further reading

**Anchor Text Best Practices:**
- Use natural, descriptive phrases
- Include relevant keywords when appropriate
- Avoid generic phrases like "click here" or "read more"
- Match the anchor text to the topic of the linked post

## SEO Keywords to Include

Naturally weave these throughout the content:
- Los Angeles electrician
- EV charger installation Los Angeles
- electrical contractor Los Angeles
- EV charging infrastructure
- panel upgrade
- commercial EV charging
- residential EV charger
- Level 2 charger
- DC fast charging
- LADWP (Los Angeles Department of Water and Power)
- California Title 24

## Troubleshooting

**Issue: JSON Parse Error**
**Solution:** Validate JSON at https://jsonlint.com/ - likely missing comma, quote, or bracket

**Issue: Build Fails**
**Solution:** Check GitHub Actions log at https://github.com/banddude/shaffercon/actions

**Issue: Post Not Appearing**
**Solution:** Verify filename format is correct (date-slug.json) and file is in correct directory

**Issue: Links Not Working**
**Solution:** Ensure internal links don't include domain (use `/industry-insights/slug` not full URL)

## Quick Reference: Complete Workflow

```bash
# 1. Check recent posts to avoid duplicates
ls -lt /Users/mikeshaffer/AIVA/website/content/industry-insights/ | head -10

# 2. Read a recent post to match style
cat /Users/mikeshaffer/AIVA/website/content/industry-insights/[RECENT-FILE].json | jq -r '.content'

# 3. Get sitemap for internal linking
curl -s "https://shaffercon.com/sitemap.xml" | grep "industry-insights" | head -10

# 4. Create new blog post JSON file
cat > /Users/mikeshaffer/AIVA/website/content/industry-insights/2025-11-18T19:00:00-your-slug.json <<'EOF'
{
  "title": "Your Title",
  "slug": "your-slug",
  "date": "2025-11-18T19:00:00",
  "metaTitle": "Your Title | Shaffer Construction",
  "metaDescription": "Your description",
  "ogImage": "",
  "canonicalUrl": "",
  "content": "<h2>Introduction</h2><p>Your content...</p>"
}
EOF

# 5. Commit and push to deploy
cd /Users/mikeshaffer/AIVA/website
git add content/industry-insights/2025-11-18T19:00:00-your-slug.json
git commit -m "Add blog post: Your Title"
git push origin main

# 6. Check deployment status
gh run list --limit 1

# 7. Verify live (after ~2 minutes)
curl -sI https://shaffercon.com/industry-insights/your-slug/
```

## Notes

- Posts auto-deploy via GitHub Actions when pushed to main branch
- No WordPress credentials needed anymore
- All content stored as JSON in version control
- Easy to edit any post by editing its JSON file
- Los Angeles focus is critical - always tie national news to local implications
- Shaffer Construction should be mentioned in introduction and at least once per major section
- The conclusion CTA is mandatory and should follow the exact format from existing posts
