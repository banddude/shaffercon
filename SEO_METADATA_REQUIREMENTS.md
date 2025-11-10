# Pacific Palisades Service Pages - SEO Metadata Requirements

## Overview
Generate complete SEO metadata for all 40 Pacific Palisades electrical service pages to improve search rankings, click-through rates, and enable rich snippets in search results.

## Pages to Update

All 40 service pages in `/service-areas/pacific-palisades/[service-name]`:
- 20 residential service pages
- 20 commercial service pages

## Database Fields to Populate

Update the `pages_all` table for each service page with:

### 1. **meta_title** (CRITICAL)
- **Length**: 50-60 characters (strict limit)
- **Format**: `[Service Name] Pacific Palisades | Shaffer Construction`
- **Example**: `Residential EV Charger Installation Pacific Palisades | Shaffer Construction`
- **Keywords**: Include service name + location
- **Rules**:
  - Must be under 60 characters
  - Include "Pacific Palisades" for local SEO
  - End with "| Shaffer Construction" (brand)
  - Make it compelling for click-through

### 2. **meta_description** (CRITICAL)
- **Length**: 150-160 characters (strict limit)
- **Format**: Action-oriented, benefit-focused, includes CTA
- **Example**: `Expert residential EV charger installation in Pacific Palisades. Licensed electricians, permit handling, Level 2 chargers. Free estimate: (323) 642-8509`
- **Must Include**:
  - Service benefit (what customer gets)
  - Location (Pacific Palisades)
  - Key differentiator (licensed, permits, etc.)
  - Call to action (phone number or "free estimate")
- **Rules**:
  - Under 160 characters
  - Natural, compelling copy
  - Include primary keyword
  - Entice clicks from search results

### 3. **canonical_url** (IMPORTANT)
- **Format**: `https://shaffercon.com/service-areas/pacific-palisades/[service-slug]`
- **Example**: `https://shaffercon.com/service-areas/pacific-palisades/residential-ev-charger-installation`
- **Rules**:
  - Use exact slug from database
  - Always use https://
  - Use custom domain (shaffercon.com)
  - No trailing slash

### 4. **og_image** (SOCIAL SHARING)
- **Format**: Full URL to image
- **Default**: `https://shaffercon.com/images/shaffer-construction-og.jpg`
- **Alternative**: Service-specific images if available
- **Rules**:
  - Use absolute URL
  - Image should be 1200x630 px (optimal for social)
  - Can use the same image for all pages (company logo/brand)

### 5. **schema_json** (RICH SNIPPETS)
- **Format**: JSON-LD structured data
- **Schema Types**: LocalBusiness + Service
- **Required Fields**:
  - @context: "https://schema.org"
  - @type: "Service"
  - serviceType: The service name
  - provider: Shaffer Construction details
  - areaServed: Pacific Palisades, CA
  - description: Brief service description

**Example Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Residential EV Charger Installation",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Shaffer Construction, Inc.",
    "telephone": "(323) 642-8509",
    "email": "hello@shaffercon.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Los Angeles",
      "addressRegion": "CA",
      "addressCountry": "US"
    }
  },
  "areaServed": {
    "@type": "City",
    "name": "Pacific Palisades",
    "containedInPlace": {
      "@type": "State",
      "name": "California"
    }
  },
  "description": "Professional residential EV charger installation services in Pacific Palisades including Level 2 chargers, panel upgrades, and permit handling."
}
```

## Content Guidelines

### SEO Best Practices
- **Primary Keyword**: Service name + "Pacific Palisades"
- **Secondary Keywords**: Related terms (e.g., "electrician", "licensed", "certified")
- **Local SEO**: Always mention Pacific Palisades
- **Compelling Copy**: Focus on benefits, not just features
- **Call-to-Action**: Include phone number or "free estimate"

### Writing Style
- **Professional**: Expert, trustworthy tone
- **Concise**: Every character counts (strict limits)
- **Action-Oriented**: Use verbs (Get, Install, Upgrade, etc.)
- **Benefit-Focused**: What customer gets, not what we do
- **Location-Aware**: Mention Pacific Palisades naturally

### What to Include
- ✅ Service name (clear, specific)
- ✅ Location (Pacific Palisades)
- ✅ Key benefits (licensed, permitted, expert)
- ✅ Company name (Shaffer Construction)
- ✅ Contact info (phone number)
- ✅ Unique value (what sets us apart)

### What to Avoid
- ❌ Generic phrases ("quality service", "best in class")
- ❌ Keyword stuffing
- ❌ Pricing information
- ❌ Excessive punctuation (!!!)
- ❌ ALL CAPS
- ❌ Duplicate content across pages

## Database Update Format

Content should be inserted using SQL UPDATE statements:

```sql
-- Update SEO metadata for page_id (from pages_all table)
UPDATE pages_all
SET
  meta_title = 'Residential EV Charger Installation Pacific Palisades | Shaffer Construction',
  meta_description = 'Expert residential EV charger installation in Pacific Palisades. Licensed electricians, permit handling, Level 2 chargers. Free estimate: (323) 642-8509',
  canonical_url = 'https://shaffercon.com/service-areas/pacific-palisades/residential-ev-charger-installation',
  og_image = 'https://shaffercon.com/images/shaffer-construction-og.jpg',
  schema_json = '{"@context":"https://schema.org","@type":"Service",...}'
WHERE id = 14194;
```

## Page ID Reference

Get the correct page_id from pages_all by joining with service_pages:

```sql
SELECT p.id, p.slug, sp.service_name, sp.service_type
FROM pages_all p
JOIN service_pages sp ON p.id = sp.page_id
WHERE sp.location = 'pacific palisades'
```

## Quality Checklist

Before submitting, verify:

- [ ] meta_title is 50-60 characters
- [ ] meta_description is 150-160 characters
- [ ] canonical_url uses exact slug from database
- [ ] og_image URL is valid and accessible
- [ ] schema_json is valid JSON
- [ ] All fields are properly escaped (SQL quotes)
- [ ] Content is unique per page
- [ ] Keywords integrated naturally
- [ ] Pacific Palisades mentioned in both meta fields
- [ ] Phone number included in meta_description
- [ ] Schema includes all required fields

## Reference Files

- `/home/user/shaffercon/pacific-palisades-pages.json` - List of all 40 pages
- `/home/user/shaffercon/database/data/site.db` - Database to update

## Success Criteria

SEO metadata is complete when:
1. All 40 Pacific Palisades service pages have meta_title
2. All 40 pages have meta_description
3. All 40 pages have canonical_url
4. All 40 pages have og_image
5. All 40 pages have valid schema_json
6. All metadata meets length and quality requirements
7. All database updates execute without errors
8. Metadata validated with SEO tools
