# Quick Reference: Recurring Layout Patterns

## 8 Reusable Components Identified

### Tier 1: Quick Wins (Extract First)

1. **ContentSection** (8+ uses)
   - Heading + content wrapper
   - Replace: Heading + Paragraph + Container boilerplate
   - Impact: -6 lines per use

2. **ListSection** (5+ uses)
   - Title + bulleted/numbered list
   - Replace: List rendering boilerplate
   - Impact: -11 lines per use

3. **HeadingContentCard** (8+ uses)
   - ContentBox with h3 heading + paragraph
   - Replace: Card heading pattern
   - Impact: -4 lines per use

### Tier 2: High Value (Extract Second)

4. **BenefitsSection** (5+ uses)
   - Grid of 2-column benefit cards
   - Replace: Grid + map + ContentBox pattern
   - Impact: -15 lines per use

5. **FAQSection** (2+ uses)
   - Q&A in ContentBox format
   - Replace: FAQ rendering pattern
   - Impact: -14 lines per use

6. **LinkCardGrid** (4+ uses)
   - 3-column grid of link cards
   - Replace: Location/service/area link patterns
   - Impact: -18 lines per use

### Tier 3: Standardization (Extract Third)

7. **CTASection** (5+ uses)
   - Centered call-to-action with button
   - Replace: CTA section boilerplate
   - Impact: -10 lines per use

8. **SectionRenderer** (6 landing pages)
   - Dynamic section type rendering
   - Replace: 80-line if/else tree
   - Impact: -80 lines per landing page

---

## Impact Summary

| Metric | Value |
|--------|-------|
| Total Patterns Found | 8 |
| Total Usage Instances | 45+ |
| Code Reduction (key pages) | 44% |
| Components to Create | 8 |
| Estimated Dev Time | 4-6 hours |
| Testing Time | 2-3 hours |
| Total Time | 6-9 hours |

---

## Pattern Locations Quick Lookup

### Pattern: Heading + Content
- app/page.tsx (lines 107-126)
- app/service-areas/page.tsx (lines 287-301)
- app/service-areas/[location]/page.tsx (lines 124-133, 140-142, 167-169)
- app/[landing]/page.tsx (lines 131-145)

### Pattern: Benefits Grid
- app/service-areas/[location]/[service]/page.tsx (lines 135-149)
- app/[landing]/page.tsx (lines 115-129)

### Pattern: FAQ Section
- app/service-areas/[location]/[service]/page.tsx (lines 175-189)

### Pattern: List Items
- app/service-areas/[location]/[service]/page.tsx (lines 152-163, 192-203, 206-217)
- app/service-areas/[location]/page.tsx (lines 191-201)

### Pattern: Link Card Grid
- app/service-areas/page.tsx (lines 315-325)
- app/service-areas/[location]/page.tsx (lines 143-157, 170-184, 208-221)

### Pattern: CTA Section
- app/service-areas/[location]/page.tsx (lines 225-235)
- app/service-areas/[location]/[service]/page.tsx (lines 220-230)
- app/[landing]/page.tsx (lines 194-204)

### Pattern: Dynamic Sections
- app/[landing]/page.tsx (lines 112-191)

---

## Start Here: Implementation Order

### Week 1: Tier 1 Components
```
Monday:
  - Create ContentSection.tsx
  - Create ListSection.tsx
  - Create HeadingContentCard.tsx
  - Update UI/index.ts

Tuesday-Thursday:
  - Refactor app/page.tsx
  - Refactor app/service-areas/page.tsx
  - Refactor app/service-areas/[location]/page.tsx
  - Refactor app/service-areas/[location]/[service]/page.tsx
  - Refactor app/[landing]/page.tsx

Friday:
  - Test all pages
  - Visual regression testing
  - Commit changes
```

### Week 2: Tier 2 Components
```
Monday:
  - Create BenefitsSection.tsx
  - Create FAQSection.tsx
  - Create LinkCardGrid.tsx

Tuesday-Wednesday:
  - Further refactor service detail pages
  - Refactor location pages
  - Refactor landing pages

Thursday-Friday:
  - Test and verify
  - Update documentation
```

### Week 3: Tier 3 Components
```
Monday-Tuesday:
  - Create CTASection.tsx
  - Create SectionRenderer.tsx

Wednesday-Thursday:
  - Refactor landing page sections
  - Clean up 80-line if/else tree

Friday:
  - Final testing
  - Commit and cleanup
```

---

## File Structure Before & After

### Before: app/service-areas/[location]/[service]/page.tsx
```
234 lines total
- generateStaticParams: 12 lines
- getServicePage: 60 lines
- generateMetadata: 20 lines
- Benefits section: 15 lines
- Offerings section: 11 lines
- Closing content: 7 lines
- FAQs section: 14 lines
- Related services: 11 lines
- Nearby areas: 11 lines
- CTA section: 10 lines
```

### After: Same file with components
```
~150 lines total (~36% reduction)
- generateStaticParams: 12 lines (unchanged)
- getServicePage: 60 lines (unchanged)
- generateMetadata: 20 lines (unchanged)
- <BenefitsSection /> : 3 lines
- <ListSection /> : 1 line
- <ContentSection /> : 1 line
- <FAQSection /> : 1 line
- <ListSection /> : 1 line
- <ListSection /> : 1 line
- <CTASection /> : 1 line
```

---

## Testing Checklist

After each refactoring:
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] Visual matches original (screenshot comparison)
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] All links functional
- [ ] SEO metadata intact
- [ ] Form inputs work (if present)
- [ ] Git diff shows only component changes

---

## Rollback Quick Reference

If something breaks:
```bash
# See what changed
git diff HEAD~1

# Revert last commit
git revert HEAD

# Or revert specific file
git checkout HEAD~1 -- app/service-areas/\[location\]/\[service\]/page.tsx
```

---

## Files to Create/Modify

### New Files (8 components)
```
app/components/UI/ContentSection.tsx
app/components/UI/ListSection.tsx
app/components/UI/HeadingContentCard.tsx
app/components/UI/BenefitsSection.tsx
app/components/UI/FAQSection.tsx
app/components/UI/LinkCardGrid.tsx
app/components/UI/CTASection.tsx
app/components/UI/SectionRenderer.tsx
```

### Files to Modify
```
app/components/UI/index.ts (add exports)
app/page.tsx (refactor)
app/service-areas/page.tsx (refactor)
app/service-areas/[location]/page.tsx (refactor)
app/service-areas/[location]/[service]/page.tsx (refactor)
app/[landing]/page.tsx (refactor)
```

---

## Success Criteria

- All 8 components created and typed
- All 5 key pages refactored
- 44% code reduction in page files
- Zero visual changes from original
- Zero build errors or TypeScript errors
- All tests passing
- Documentation updated
- Ready for production deployment

---

## Resources in This Project

1. **PATTERN_ANALYSIS.md** - Detailed pattern analysis with code examples
2. **COMPONENT_EXTRACTION_GUIDE.md** - Complete implementation guide with full component code
3. **This file** - Quick reference for quick lookup

All three documents are in the project root for easy reference.
