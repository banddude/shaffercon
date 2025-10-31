# AIVA Website Database Refactoring

## ✅ STATUS: MIGRATION COMPLETE

All website content has been successfully migrated from JSON blobs to properly normalized relational tables with plain text content.

**Completion Date:** October 31, 2025

---

## What Was Migrated

### Pages (833 total)
- ✅ Contact page (1)
- ✅ Service detail pages (800)
- ✅ Location/service area pages (22)
- ✅ Service landing pages (6)
- ✅ Unique pages (4: home, about-us, service-areas, footer)

### Blog Posts (235 total)
- ✅ All converted to markdown format

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

## What's Next

### Immediate Tasks
1. Update Next.js page templates to read from new tables
2. Test all page types render correctly
3. Verify SEO metadata intact

### Optional Future Enhancements
1. Remove deprecated `parsed_content` JSON field from `pages_all`
2. Add admin interface for editing structured content
3. Implement version control for content changes
4. Add caching layer for frequently accessed pages

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

## Notes

- Old JSON data remains in `parsed_content` for reference but is no longer used
- All page templates need to be updated to use new table structure
- Contact page already uses `page_sections` table (was migrated first)
- The 20 service lists on location pages are generated dynamically from `service_pages`, not stored
- Standard elements (phone number, CTA, value props) don't need storage as they're consistent across pages
