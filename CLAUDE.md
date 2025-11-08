# AIVA Website Database Refactoring & Layout Redesign

## 🚀 DEPLOYMENT WORKFLOW - HOW TO MAKE CHANGES LIVE

### Making Content Changes
1. **Edit Database**: Update content in `database/data/site.db` using SQL
2. **Commit Changes**: `git add . && git commit -m "Your message"`
3. **Push to GitHub**: `git push origin main`
4. **Auto-Deploy**: GitHub Actions automatically builds and deploys to https://shaffercon.com

### Making Code Changes
1. **Edit Files**: Modify Next.js components in `site/app/` or styles in `site/app/styles/`
2. **Test Locally**: `cd site && npm run dev` to preview at http://localhost:3001
3. **Commit & Push**: Same as above, auto-deploys to GitHub Pages

### Important Notes
- The site auto-deploys on every push to `main` branch (takes ~2 minutes)
- Live site: https://shaffercon.com
- Repository: https://github.com/banddude/shaffercon
- Check deployment status: https://github.com/banddude/shaffercon/actions
- DNS managed via Cloudflare (nameservers: boyd.ns.cloudflare.com, perla.ns.cloudflare.com)

---

## ⚠️ CRITICAL: ROUTING & STATIC FILES - READ FIRST

### Custom Domain Configuration (Updated November 2025)

The site now uses a **custom domain** (shaffercon.com) with **no base path**. All URLs are root-relative.

**Path Configuration in `site/app/config.ts`:**
```typescript
// No base path needed for custom domain
export const BASE_PATH = '';

// Helper function to ensure paths start with /
export const withBasePath = (path: string): string => {
  return path.startsWith('/') ? path : `/${path}`;
};
```

**HOW TO USE PATHS IN COMPONENTS:**

✅ **CORRECT - Use Next.js Link for internal navigation:**
```tsx
import Link from "next/link";

<Link href="/service-areas/hollywood">Hollywood Services</Link>
<Link href="/contact-us">Contact Us</Link>
```

✅ **CORRECT - Use withBasePath for assets:**
```tsx
import { withBasePath } from "@/app/config";

<img src={withBasePath("images/logo.png")} />
<video src={withBasePath("videos/hero.mp4")} />
```

❌ **WRONG - Never use <a> tags for internal navigation:**
```tsx
<a href="/service-areas/hollywood">  // NO! Use Link component
```

### Static HTML Files in public/ Folder

When adding static HTML files (games, external widgets, etc.) to `public/` folder:

**⚠️ CRITICAL NAMING RULE:**
- **NEVER** name a static HTML file `index.html` if a Next.js route exists with the same path
- Next.js will overwrite `public/games/index.html` when generating the `/games` route
- **Example:** If you have `/app/games/page.tsx`, DO NOT create `/public/games/index.html`

**CORRECT APPROACH:**
```
public/
  games/
    zappy-bird.html     ✅ Unique name, no conflict
    sparky-bros.html    ✅ Unique name, no conflict
    style.css           ✅ CSS files are fine
    game.js             ✅ JS files are fine
```

**WRONG APPROACH:**
```
public/
  games/
    index.html          ❌ Will be overwritten by /app/games/page.tsx build
```

### Why This Matters

1. **Custom Domain**: Site uses shaffercon.com with no base path needed
2. **Internal Navigation**: Always use Next.js Link component for proper routing
3. **Avoid Build Conflicts**: Static HTML files with route-conflicting names get overwritten
4. **Maintainability**: Single source of truth for all paths

---

## ⚠️ CRITICAL: COLOR SYSTEM RULES - READ FIRST

**NEVER HARDCODE COLORS. NEVER. EVER. FOR ANY REASON.**

The site uses a **4-COLOR SYSTEM ONLY**. These are the ONLY colors you are allowed to use:

1. **primary** - Blue accents/links (`#0284c7` - same in both modes)
2. **secondary** - Secondary text (black in light mode, grey in dark mode)
3. **background** - Page background (white in light mode, black in dark mode)
4. **text** - Main text/headings (black in light mode, white in dark mode)

**THE COLOR SYSTEM FRAMEWORK:**

The CSS variables are defined in `globals.css` and automatically swap values when dark mode is toggled via the `.dark` class:

```css
/* globals.css */
:root {
  --primary: #0284c7;      /* Blue - same in both modes */
  --secondary: #000000;    /* Black text */
  --background: #ffffff;   /* White background */
  --text: #000000;         /* Black headings */
}

.dark {
  --primary: #0284c7;      /* Blue - same */
  --secondary: #a9a9a9;    /* Grey text */
  --background: #000000;   /* Black background */
  --text: #ffffff;         /* White headings */
}
```

**HOW TO USE COLORS IN COMPONENTS:**

✅ **CORRECT - Use CSS variables with semantic names:**
```jsx
style={{ color: "var(--primary)" }}
style={{ background: "var(--background)" }}
style={{ color: "var(--text)" }}
style={{ color: "var(--secondary)" }}
```

❌ **WRONG - NEVER do this:**
```jsx
style={{ color: "#0284c7" }}                  // NO HARDCODED HEX
style={{ background: "white" }}                // NO COLOR NAMES
style={{ color: theme.colors.primary }}        // NO STATIC THEME REFERENCES
const colors = theme.getActiveColors();        // NO JAVASCRIPT COLOR LOGIC
```

**THE ONLY 4 CSS VARIABLES AVAILABLE:**
- `var(--primary)` - Primary blue color for accents and links
- `var(--secondary)` - Secondary text color (body text, descriptions)
- `var(--background)` - Background color for sections and containers
- `var(--text)` - Main text color for headings and important text

**ADDITIONAL UTILITY VARIABLES:**
- `var(--section-gray)` - Alternate section background (light grey / dark grey)
- `var(--section-border)` - Border color for section dividers

**IMPORTANT:**
- Components should NEVER know about light/dark mode
- ALL color swapping happens ONLY in `globals.css`
- NEVER use `theme.getActiveColors()` or check for `isDark`
- Just use the CSS variables - they automatically update

---

## 🔄 STATUS: LAYOUT & TYPOGRAPHY IMPROVEMENTS IN PROGRESS

Database migration and site rebuild complete. Currently improving layout, typography, and visual hierarchy across all pages using a modular component system.

**Migration Completion:** October 31, 2025
**Rebuild Completion:** October 31, 2025
**Layout Redesign Start:** October 31, 2025

---

## Current Status

### ✅ Database Migration (Complete)
All 1,068 pages migrated to normalized tables with plain text content.

### ✅ Website Rebuild (Complete)
Entire Next.js site rebuilt with database-driven static generation:
- 6 specialized page templates created
- Proper route structure implemented
- All 1,070 pages generating from database
- Zero runtime database queries
- Full static site generation

### ✅ Build Verification (Complete)
- Successfully built 1,070 static pages
- All page types tested and verified
- Screenshots captured for validation
- Zero TypeScript errors
- Zero build errors

### 🔄 Layout & Typography Redesign (In Progress)
Improving visual hierarchy and readability across all pages:
- ⏳ Increasing font sizes for better hierarchy
- ⏳ Improving spacing between sections
- ⏳ Creating consistent visual structure
- ⏳ Removing unnecessary color styling
- ⏳ Ensuring content is logically organized
- Goal: Clean, professional appearance with proper typography and layout

---

## What Was Built

### Pages Generated (1,070 total)
- ✅ Homepage (1)
- ✅ Service detail pages (800)
- ✅ Location landing pages (22)
- ✅ Service landing pages (6)
- ✅ Unique pages (about-us, service-areas, contact-us)
- ✅ Blog posts (235)

### Page Templates Created (6 total)
1. Service Detail Template (800 pages)
2. Location Landing Template (22 pages)
3. Service Landing Template (6 pages)
4. Unique Pages Template (home, about, service-areas)
5. Contact Page Template (with form)
6. Blog Post Template (235 posts)

---

## Database Schema

### Page Tables

**Contact & Unique Pages:**
```
page_sections (contact, home, about-us, service-areas, footer)
├─ id, page_id, section_type, heading, content, section_order
└─ form_fields (for contact form)
```

**Service Detail Pages (800 pages):**
```
service_pages (main info: location, service name, type)
├─ service_benefits (heading + content pairs)
├─ service_offerings (bulleted lists)
├─ service_faqs (Q&A pairs)
├─ service_related_services (links)
└─ service_nearby_areas (links)
```

**Location Landing Pages (22 pages):**
```
location_pages (main info: location name, about paragraphs)
├─ location_related_services (5 per location)
└─ location_nearby_areas (5 per location)
```

**Service Landing Pages (6 pages):**
```
service_landing_pages (commercial/residential EV, load studies, LED retrofit, facilities)
└─ service_landing_sections (flexible: info cards, tables, content blocks)
```

**Blog Posts:**
```
posts (existing table)
└─ markdown column added (plain markdown format)
```

---

## Data Format Standards

All migrated content follows these rules:
- ✅ Plain text only (no HTML tags)
- ✅ No JSON structures
- ✅ No markdown formatting (except blog posts)
- ✅ No special characters except standard punctuation
- ✅ Proper relational structure with foreign keys
- ✅ Flexible section counts per page

---

## Migration Scripts

All scripts are in `/scripts/` directory:

**Service Pages:**
- `fix-service-page-titles.py` - Fixed 21 pages with wrong title format
- `migrate-service-pages.py` - Migrated 800 service detail pages

**Location Pages:**
- `create-location-tables.sql` - Created location page tables
- `migrate-location-pages.py` - Migrated 22 location pages

**Service Landing Pages:**
- `create-service-landing-table.sql` - Created landing page tables
- `migrate-commercial-ev-chargers.py`
- `migrate-commercial-service.py`
- `migrate-electrical-load-studies.py`
- `migrate-led-retrofit.py`
- `migrate-residential-ev-charger.py`
- `migrate-statewide-facilities.py`

**Remaining Pages:**
- `migrate-remaining-pages.py` - Migrated home, about-us, service-areas, footer

**Blog Posts:**
- `convert-posts-to-markdown.py` - Converted 235 posts to markdown

---

## Route Structure

```
/                                    → Home page (database)
/about-us                            → About page (database)
/contact-us                          → Contact page with form (database)
/service-areas                       → Service areas listing (database)
/service-areas/[location]            → 22 location landing pages (database)
/service-areas/[location]/[service]  → 800 service detail pages (database)
/[landing]                           → 6 service landing pages (database)
/blog/[slug]                         → 235 blog posts (database)
```

---

## Build Statistics

```
✅ Total Pages: 1,070
✅ Build Time: ~30 seconds
✅ TypeScript Errors: 0
✅ Build Errors: 0
✅ Runtime DB Queries: 0
✅ Static Generation: 100%
```

---

## Recent Improvements (October 31, 2025)

### ✅ Component System Implementation
- Created modular UI component library in `app/components/UI.tsx`
- Components include: Section, Container, PageTitle, SectionHeading, Subheading, Paragraph, Button, ContentBox, Grid, GridItem, etc.
- All pages refactored to use component system instead of inline styling

### ✅ Service Landing Pages - Section Fix
- Fixed rendering of all section types (info_card, content_block, content, table, comparison_table, list)
- Sections now properly display with their corresponding headings
- All 6 service landing pages now render complete content

### 🔄 Layout & Typography Improvements (In Progress)

**Typography Standards:**
- **PageTitle**: `text-4xl sm:text-5xl` with `font-black` - Main page headings
- **SectionHeading**: `text-2xl sm:text-3xl` with `font-bold` - Section headings (STANDARD)
- **Subheading**: `text-xl sm:text-2xl` with `font-semibold` - Subsection headings
- **Body text**: `text-lg` for better readability
- **Section padding**: `py-12 sm:py-20 lg:py-28`
- **Container padding**: `px-6 sm:px-8 lg:px-12`
- **ContentBox padding**: `p-6 sm:p-10 lg:p-16`
- **Border radius**: `rounded-lg` for bordered content boxes

**Still To Do:**
- Review all page templates and ensure content is logically organized
- Fix any remaining layout issues on different page types
- Ensure headings are properly positioned above their content sections
- Verify spacing consistency across all pages
- Test responsive layout on mobile devices
- Fine-tune spacing and font sizes based on visual inspection

**Files Modified:**
- `site/app/components/UI.tsx` - Updated typography and spacing components
- `site/app/[landing]/page.tsx` - Fixed section type handling

---

## Optional Future Enhancements

1. Remove deprecated `parsed_content` JSON field from `pages_all`
2. Add admin interface for editing structured content
3. Implement version control for content changes
4. Add caching layer for frequently accessed pages
5. Generate sitemap.xml
6. Add schema.org structured data
7. Optimize images and assets
8. Complete centralization of styles across all page templates
9. Deploy to production

---

## Key Improvements

### Before
- Monolithic JSON blobs in `parsed_content` field
- Required JSON parsing on every page load
- Difficult to query specific content
- Hard to maintain and update

### After
- Normalized relational tables
- Direct SQL queries, no parsing needed
- Can search, filter, and query specific sections
- Easy to maintain and extend
- Improved performance

---

## Technical Implementation

### Database Connection
- Uses `better-sqlite3` for database access
- Database path: `data/site.db`
- Read-only mode for safety
- Direct SQL queries at build time

### Page Templates
All templates read directly from database using SQL queries:
- `app/page.tsx` - Homepage
- `app/about-us/page.tsx` - About page
- `app/contact-us/page.tsx` - Contact page with form
- `app/service-areas/page.tsx` - Service areas listing
- `app/service-areas/[location]/page.tsx` - Location pages
- `app/service-areas/[location]/[service]/page.tsx` - Service details
- `app/[landing]/page.tsx` - Service landing pages
- `app/blog/[slug]/page.tsx` - Blog posts

### Static Generation
All routes use `generateStaticParams()` to pre-render pages at build time:
- Zero runtime database queries
- All content baked into static HTML
- Lightning-fast page loads
- Perfect for deployment

---

## Files Removed

### Old Routes & Templates
- `app/[...slug]/page.tsx` (old catch-all route)
- `app/category/industry-insights/page.tsx`
- `app/contact-us-page.tsx`
- `app/components/templates/PageTemplate.tsx`
- `app/components/templates/BlogTemplate.tsx`
- `app/components/templates/ContactTemplate.tsx`

### Old Library Files
- `lib/pages.ts` (replaced with direct database queries)
- `lib/pages.OLD.ts`

---

## Git Commits

1. **Complete database migration** - All 1,068 pages migrated to tables
2. **Complete website rebuild** - All 1,070 pages from database
3. **Add rebuild documentation** - REBUILD_COMPLETE.md

---

## Contact Form & Infrastructure

### Contact Form Architecture
The contact form uses a **secure serverless architecture**:

1. **Frontend** (`site/app/components/ContactForm.tsx`):
   - Submits form data to Cloudflare Worker endpoint
   - Fallback to mailto: if worker fails
   - Success confirmation shown to user

2. **Cloudflare Worker** (`cloudflare-workers/contact-form.js`):
   - Endpoint: https://shaffercon-contact-form.mikejshaffer.workers.dev
   - Future endpoint: https://api.shaffercon.com/contact (once DNS fully propagates)
   - Securely stores GitHub token as environment secret
   - Triggers GitHub repository_dispatch event

3. **GitHub Actions** (`.github/workflows/contact-form.yml`):
   - Listens for contact-form-submission events
   - Saves submissions as JSON files to `leads` branch
   - Uses `jq` for proper JSON escaping of special characters

### DNS & Hosting Setup

**Domain**: shaffercon.com (managed via GoDaddy)
**DNS**: Cloudflare (nameservers: boyd.ns.cloudflare.com, perla.ns.cloudflare.com)
**Hosting**: GitHub Pages with custom domain

**Cloudflare DNS Records**:
- 4x A records pointing to GitHub Pages IPs (185.199.108-111.153)
- 1x CNAME for www → banddude.github.io
- All records set to "DNS only" (not proxied)
- MX records preserved for Gmail

**GitHub Pages Configuration**:
- Custom domain: shaffercon.com
- CNAME file automatically copied to output during build
- No base path (site lives at root of domain)

## Notes

- Old JSON data remains in `parsed_content` for reference but is no longer used
- All pages now generated directly from normalized database tables
- The 20 service lists on location pages are generated dynamically from `service_pages`
- Standard elements (phone number, CTA, value props) don't need storage as they're consistent
- Site deployed to production at https://shaffercon.com
