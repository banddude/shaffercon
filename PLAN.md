# Website Rebuild Plan: Database-Driven Static Generation

## Goal
Generate a complete, production-ready Next.js website directly from the normalized database, replacing all existing page files with dynamically generated ones from structured data.

## Current State Analysis

### Database Tables
1. **page_sections** - Contact, home, about-us, service-areas, footer (5 pages)
2. **service_pages** - 800 service detail pages
3. **location_pages** - 22 location landing pages
4. **service_landing_pages** - 6 service landing pages (commercial EV, residential EV, etc.)
5. **posts** - 235 blog posts with markdown

### Current File Structure
```
app/
├── [...slug]/page.tsx         # Catch-all dynamic route
├── category/industry-insights/page.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ContactForm.tsx
│   ├── ServiceAreaLinks.tsx
│   └── templates/
│       ├── PageTemplate.tsx
│       ├── ContactTemplate.tsx
│       └── BlogTemplate.tsx
├── layout.tsx
└── page.tsx                   # Homepage
```

## Rebuild Strategy

### Phase 1: Commit Current Work ✓
- Commit all migration scripts
- Commit updated CLAUDE.md and CURRENT_STATUS.md
- Commit current database with migrated data

### Phase 2: Create New Template Components
Build specialized template components for each page type:

1. **ServiceDetailTemplate.tsx** - For 800 service pages
   - Reads from: service_pages, service_benefits, service_offerings, service_faqs, service_related_services, service_nearby_areas
   - Sections: Hero, Benefits (2-4), Offerings list, Closing, FAQs, Related Services, Nearby Areas

2. **LocationTemplate.tsx** - For 22 location pages
   - Reads from: location_pages, location_related_services, location_nearby_areas
   - Sections: Hero, About (2 paragraphs), Service Lists (dynamic from service_pages), Related Services, Nearby Areas

3. **ServiceLandingTemplate.tsx** - For 6 landing pages
   - Reads from: service_landing_pages, service_landing_sections
   - Sections: Hero, Info Cards, Tables, Content Blocks (flexible)

4. **FlexiblePageTemplate.tsx** - For unique pages (home, about, service-areas, footer)
   - Reads from: page_sections
   - Sections: Dynamic based on section_type

5. **BlogPostTemplate.tsx** - For 235 blog posts
   - Reads from: posts (markdown column)
   - Renders: Markdown content with proper styling

6. **ContactPageTemplate.tsx** - Special contact page
   - Reads from: page_sections, form_fields
   - Includes: Contact form with validation

### Phase 3: Database Helper Functions
Create `lib/database-queries.ts` with functions:

```typescript
// Service Pages
async function getServicePage(location, serviceType, serviceName)
async function getAllServicePagePaths()

// Location Pages
async function getLocationPage(locationSlug)
async function getAllLocationPagePaths()

// Service Landing Pages
async function getServiceLandingPage(slug)
async function getAllServiceLandingPagePaths()

// Flexible Pages
async function getFlexiblePage(slug)
async function getAllFlexiblePageSlugs()

// Blog Posts
async function getBlogPost(slug)
async function getAllBlogPostSlugs()
async function getBlogPostsByCategory(category)

// Contact Page
async function getContactPageData()
```

### Phase 4: Route Structure
Create a clean, SEO-friendly route structure:

```
app/
├── page.tsx                                          # Home (from page_sections)
├── about-us/page.tsx                                 # About (from page_sections)
├── contact-us/page.tsx                               # Contact (from page_sections + form_fields)
├── service-areas/
│   ├── page.tsx                                      # Main service areas (from page_sections)
│   └── [location]/
│       ├── page.tsx                                  # Location landing (from location_pages)
│       └── [serviceType]-[serviceName]/page.tsx      # Service detail (from service_pages)
├── [landingSlug]/page.tsx                            # Service landings (6 pages)
├── category/
│   └── industry-insights/page.tsx                    # Blog category (from posts)
└── blog/
    └── [slug]/page.tsx                               # Blog post (from posts)
```

### Phase 5: Static Generation
Use Next.js `generateStaticParams` for all pages:

```typescript
// Example: Service detail pages
export async function generateStaticParams() {
  const paths = await getAllServicePagePaths()
  return paths.map(({ location, serviceType, serviceName }) => ({
    location,
    serviceType,
    serviceName,
  }))
}
```

This generates all 833 pages + 235 blog posts at build time = 1,068 static HTML pages.

### Phase 6: Shared Components
Reuse existing components with enhancements:

1. **Header.tsx** - Keep, ensure navigation links match new routes
2. **Footer.tsx** - Keep, read footer content from page_sections if needed
3. **ServiceAreaLinks.tsx** - Keep, generate dynamically from location_pages
4. **ContactForm.tsx** - Keep, read fields from form_fields table
5. **Add: Breadcrumbs.tsx** - For navigation
6. **Add: ServiceCard.tsx** - For service listings
7. **Add: FAQAccordion.tsx** - For FAQ sections
8. **Add: TableDisplay.tsx** - For comparison tables

### Phase 7: Styling & SEO
1. **Metadata Generation** - Use pages_all table for meta_title, meta_description, canonical_url, og_image
2. **Schema.org** - Generate structured data from database content
3. **Sitemap** - Auto-generate from all page paths
4. **Robots.txt** - Configure for proper crawling

## Implementation Steps

### Step 1: Backup & Commit
```bash
git add .
git commit -m "Complete database migration - 833 pages + 235 posts"
```

### Step 2: Create New Branch
```bash
git checkout -b database-rebuild
```

### Step 3: Build Database Query Library
Create `lib/database-queries.ts` with all helper functions

### Step 4: Create Template Components
Build all 6 template components in `app/components/templates/`

### Step 5: Create Route Files
Build all route files with proper `generateStaticParams`

### Step 6: Test & Verify
- Run `npm run build` to generate static pages
- Verify all 1,068 pages generated successfully
- Test sample pages from each category
- Check SEO metadata
- Validate links and navigation

### Step 7: Remove Old Files
Once verified, remove:
- Old [...slug]/page.tsx catch-all
- Any hardcoded page files
- Unused components

### Step 8: Deploy
- Merge to main branch
- Deploy to production
- Monitor for any issues

## Expected Outcomes

### Performance
- **1,068 static HTML pages** generated at build time
- Zero database queries at runtime (all pre-rendered)
- Lightning-fast page loads
- Perfect Lighthouse scores

### Maintainability
- Update content by editing database
- Rebuild site to reflect changes
- No need to edit individual page files
- Consistent structure across all pages

### SEO
- All metadata from database
- Proper URL structure
- Automatic sitemap generation
- Schema.org structured data

### Scalability
- Easy to add new locations (just add to location_pages)
- Easy to add new services (just add to service_pages)
- Easy to add new landing pages
- Template-based approach handles growth

## File Generation Script

Create `scripts/generate-website.ts`:
```typescript
// Single script to:
// 1. Query database for all pages
// 2. Generate route files
// 3. Create necessary components
// 4. Set up proper metadata
// 5. Generate sitemap
// 6. Validate all pages
```

## Rollback Plan

If issues arise:
1. Keep old branch as backup
2. Can quickly revert to previous version
3. Database unchanged, so data is safe
4. Old JSON in parsed_content still available if needed

## Success Metrics

✅ All 833 pages generate successfully
✅ All 235 blog posts render correctly
✅ Navigation works across all pages
✅ SEO metadata intact
✅ Forms work (contact page)
✅ Build time < 5 minutes
✅ Page load time < 1 second
✅ Lighthouse score > 95
✅ Zero console errors
✅ All links valid

## Timeline Estimate

- **Phase 1**: Commit work - 5 minutes
- **Phase 2-3**: Templates & queries - 2 hours
- **Phase 4-5**: Routes & generation - 1 hour
- **Phase 6**: Components - 1 hour
- **Phase 7**: Testing - 1 hour
- **Phase 8**: Deploy - 30 minutes

**Total: ~6 hours of focused work**

## Risk Mitigation

1. **Work on separate branch** - Easy rollback
2. **Keep old files initially** - Compare outputs
3. **Test incrementally** - One page type at a time
4. **Verify in dev** - Before building production
5. **Database backup** - Already have it
6. **Gradual deployment** - Can test on staging first

## Notes

- This approach follows Next.js App Router best practices
- Uses TypeScript for type safety
- Leverages Server Components for optimal performance
- No client-side data fetching needed (all static)
- Can add ISR (Incremental Static Regeneration) later if needed for dynamic updates
- Follows SEO best practices with proper metadata and structure
