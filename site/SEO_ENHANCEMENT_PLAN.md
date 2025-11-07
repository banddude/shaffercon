# SEO Metadata Enhancement Plan

**Date:** November 7, 2025
**Status:** Planning Phase
**Priority:** Medium

---

## Executive Summary

While the site's primary local SEO pages (800+ service detail pages and 22 location landing pages) have comprehensive metadata implementation, several utility and top-level pages are missing complete SEO metadata. This plan outlines the work needed to bring all pages to the same SEO standard.

---

## Current State Analysis

### ✅ Pages with Complete SEO Metadata

**Service Detail Pages** (800+ pages)
- File: `/app/service-areas/[location]/[service]/page.tsx`
- Status: **EXCELLENT** - Full implementation
- Includes: Title, description, canonical URL, OpenGraph, Twitter Cards, LocalBusiness schema

**Location Landing Pages** (22 pages)
- File: `/app/service-areas/[location]/page.tsx`
- Status: **EXCELLENT** - Full implementation
- Includes: Title, description, canonical URL, OpenGraph, Twitter Cards, LocalBusiness schema

**Homepage** (1 page)
- File: `/app/page.tsx`
- Status: **EXCELLENT** - Full implementation
- Includes: Title, description, canonical URL, OpenGraph, Twitter Cards

**Service Landing Pages** (6 pages)
- File: `/app/[landing]/page.tsx`
- Status: **EXCELLENT** - Full implementation
- Includes: Title, description, canonical URL, OpenGraph, Twitter Cards

### ⚠️ Pages Needing Enhancement

**About Us Page**
- File: `/app/about-us/page.tsx`
- Current: Basic title and description only (lines 6-11)
- Missing: Canonical URL, OpenGraph tags, Twitter Cards
- Priority: **MEDIUM**

**Contact Us Page**
- File: `/app/contact-us/page.tsx`
- Current: Basic title and description only (lines 7-12)
- Missing: Canonical URL, OpenGraph tags, Twitter Cards
- Priority: **MEDIUM**

**Service Areas Index**
- File: `/app/service-areas/page.tsx`
- Current: Basic title and description only (lines 28-33)
- Missing: Canonical URL, OpenGraph tags, Twitter Cards
- Priority: **MEDIUM**

---

## Enhancement Specifications

### Standard Metadata Template

All enhanced pages should follow this structure:

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://banddude.github.io/shaffercon';
  const url = `${baseUrl}/page-path`;
  const title = "Page Title - Shaffer Construction";
  const description = "Page description with relevant keywords";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Shaffer Construction',
      locale: 'en_US',
      type: 'website',
      images: [`${baseUrl}/og-image.jpg`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
  };
}
```

---

## Page-Specific Implementation Details

### 1. About Us Page (`/app/about-us/page.tsx`)

**Current Implementation (Lines 6-11):**
```typescript
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About Us - Shaffer Construction",
    description: "Learn about Shaffer Construction, Southern California's premier EV charging and electrical installation experts.",
  };
}
```

**Enhanced Implementation:**
```typescript
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://banddude.github.io/shaffercon';
  const url = `${baseUrl}/about-us`;
  const title = "About Us - Los Angeles Electrical Contractor | Shaffer Construction";
  const description = "Learn about Shaffer Construction, Southern California's premier EV charging and electrical installation experts. Serving Los Angeles County with decades of experience.";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Shaffer Construction',
      locale: 'en_US',
      type: 'website',
      images: [`${baseUrl}/og-image.jpg`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
  };
}
```

**Changes:**
- Enhanced title with location keywords ("Los Angeles Electrical Contractor")
- Expanded description with geographic specificity
- Added canonical URL
- Added complete OpenGraph metadata
- Added Twitter Card metadata

---

### 2. Contact Us Page (`/app/contact-us/page.tsx`)

**Current Implementation (Lines 7-12):**
```typescript
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact Us - Shaffer Construction",
    description: "Get in touch with Shaffer Construction for expert EV charging and electrical installation services.",
  };
}
```

**Enhanced Implementation:**
```typescript
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://banddude.github.io/shaffercon';
  const url = `${baseUrl}/contact-us`;
  const title = "Contact Us - Los Angeles Electrical Contractor | Shaffer Construction";
  const description = "Contact Shaffer Construction for expert EV charging and electrical installation services in Los Angeles County. Call (323) 642-8509 for a free estimate.";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Shaffer Construction',
      locale: 'en_US',
      type: 'website',
      images: [`${baseUrl}/og-image.jpg`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
  };
}
```

**Changes:**
- Enhanced title with location keywords
- Added phone number to description for local SEO
- Expanded description with action-oriented language
- Added canonical URL
- Added complete OpenGraph metadata
- Added Twitter Card metadata

---

### 3. Service Areas Index (`/app/service-areas/page.tsx`)

**Current Implementation (Lines 28-33):**
```typescript
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Service Areas - Shaffer Construction",
    description: "Professional electrical services across Los Angeles County and statewide multi-location facilities.",
  };
}
```

**Enhanced Implementation:**
```typescript
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://banddude.github.io/shaffercon';
  const url = `${baseUrl}/service-areas`;
  const title = "Service Areas - Los Angeles County Electrical Services | Shaffer Construction";
  const description = "Professional electrical services across Los Angeles County and statewide multi-location facilities. Serving 22+ communities with expert EV charging installation, commercial and residential electrical work.";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Shaffer Construction',
      locale: 'en_US',
      type: 'website',
      images: [`${baseUrl}/og-image.jpg`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
  };
}
```

**Changes:**
- Enhanced title with location and service keywords
- Expanded description with specific service offerings
- Added community count for local SEO signals
- Added canonical URL
- Added complete OpenGraph metadata
- Added Twitter Card metadata

---

## Implementation Steps

### Phase 1: About Us Page Enhancement
1. Open `/app/about-us/page.tsx`
2. Replace `generateMetadata()` function (lines 6-11) with enhanced version
3. Test locally at `http://localhost:3000/about-us`
4. Verify metadata in page source and browser dev tools

### Phase 2: Contact Us Page Enhancement
1. Open `/app/contact-us/page.tsx`
2. Replace `generateMetadata()` function (lines 7-12) with enhanced version
3. Test locally at `http://localhost:3000/contact-us`
4. Verify metadata in page source and browser dev tools

### Phase 3: Service Areas Index Enhancement
1. Open `/app/service-areas/page.tsx`
2. Replace `generateMetadata()` function (lines 28-33) with enhanced version
3. Test locally at `http://localhost:3000/service-areas`
4. Verify metadata in page source and browser dev tools

### Phase 4: Build and Deploy
1. Run `npm run build` to verify no TypeScript errors
2. Verify all 1,070 pages build successfully
3. Test production build with `npm run start`
4. Commit changes with message: "Enhance SEO metadata for utility pages"
5. Push to GitHub for automatic deployment
6. Verify live site metadata after deployment

---

## Testing Checklist

For each enhanced page, verify:

- [ ] Title tag appears in browser tab
- [ ] Meta description present in page source
- [ ] Canonical URL present: `<link rel="canonical" href="..."/>`
- [ ] OpenGraph tags present:
  - [ ] `og:title`
  - [ ] `og:description`
  - [ ] `og:url`
  - [ ] `og:site_name`
  - [ ] `og:locale`
  - [ ] `og:type`
  - [ ] `og:image`
- [ ] Twitter Card tags present:
  - [ ] `twitter:card`
  - [ ] `twitter:title`
  - [ ] `twitter:description`
  - [ ] `twitter:image`
- [ ] No TypeScript compilation errors
- [ ] Page renders correctly
- [ ] Metadata appears correctly when shared on social media

---

## SEO Benefits

### Local SEO Improvements
- Enhanced geographic targeting with "Los Angeles County" keywords
- Better crawlability with canonical URLs
- Improved social media sharing with OpenGraph tags

### Technical SEO Improvements
- Consistent metadata structure across all pages
- Prevention of duplicate content issues with canonical URLs
- Better indexing signals for search engines

### User Experience Improvements
- Better social media previews when pages are shared
- Consistent branding across all shared links
- Clear, descriptive titles in search results

---

## Success Metrics

After implementation, monitor:

1. **Search Console Performance**
   - Impressions for about-us, contact-us, service-areas pages
   - Click-through rates
   - Average position in search results

2. **Social Media Sharing**
   - Verify correct preview cards on Facebook/Twitter/LinkedIn
   - Monitor engagement on shared links

3. **Technical Health**
   - No increase in crawl errors
   - All canonical URLs properly indexed
   - No duplicate content warnings

---

## Future Enhancements

### Optional Improvements (Not Required Now)

1. **Custom OG Images**
   - Create page-specific OpenGraph images
   - Show different images for about, contact, service-areas pages
   - Include business name and page title in image

2. **Schema.org Enhancements**
   - Add ContactPoint schema to contact page
   - Add Organization schema to about page
   - Add BreadcrumbList schema to service areas page

3. **Additional Meta Tags**
   - Add `robots` meta tag for specific crawling instructions
   - Add `author` meta tag
   - Add `publisher` meta tag

---

## Notes

- All enhanced pages maintain consistency with existing service detail and location landing pages
- Base URL `https://banddude.github.io/shaffercon` is consistent across all metadata
- OG image path `/og-image.jpg` should be verified to exist
- Phone number (323) 642-8509 used in contact page description matches site-wide contact info
- All changes are backward compatible and won't affect existing functionality

---

## Appendix: Metadata Best Practices

### Title Tag Best Practices
- Keep under 60 characters for full display in search results
- Include primary keyword near the beginning
- Include brand name for recognition
- Use separator like ` - ` or ` | ` between page name and brand

### Meta Description Best Practices
- Keep between 150-160 characters for full display
- Include primary and secondary keywords naturally
- Write compelling, action-oriented copy
- Include location for local SEO
- Add call-to-action when appropriate

### Canonical URL Best Practices
- Always use absolute URLs (full path including domain)
- Match the primary URL you want indexed
- Consistent with OpenGraph URL
- HTTPS preferred over HTTP

### OpenGraph Best Practices
- Always include title, description, url, image
- Use high-quality images (1200x630px recommended)
- Keep descriptions under 200 characters
- Include site name for branding
- Set type to 'website' for general pages

### Twitter Card Best Practices
- Use 'summary_large_image' for better visibility
- Ensure image meets minimum dimensions
- Keep title and description consistent with OpenGraph
- Test cards using Twitter Card Validator

---

**End of Plan Document**
