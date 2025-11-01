# AIVA Website Codebase: Recurring Layout Patterns Analysis

## Executive Summary

Analysis of 5 key Next.js pages (1,070+ total pages) reveals **6 major recurring patterns** that appear across multiple pages. These patterns are currently implemented with duplicated code but could be extracted into reusable components to eliminate repetition and improve maintainability.

**Impact: High code reuse potential with 8 new components recommended**

---

## Recurring Patterns Found

### 1. BENEFITS SECTION (Heading + Content Boxes)
**Appearance Count: 5+**
**Files Used In:**
- `/app/service-areas/[location]/[service]/page.tsx` - Service detail benefits (lines 135-149)
- `/app/[landing]/page.tsx` - Info cards in landing pages (lines 115-129)

**Current Implementation:**
```tsx
<Section padding="md">
  <Container maxWidth="lg">
    <SectionHeading>Benefits</SectionHeading>
    <div className="grid md:grid-cols-2 gap-8">
      {items.map((item: any, index: number) => (
        <ContentBox key={index} border padding="md">
          <h3 className="text-lg font-semibold mb-3">{item.heading}</h3>
          <p className="text-base leading-relaxed">{item.content}</p>
        </ContentBox>
      ))}
    </div>
  </Container>
</Section>
```

**Pattern Details:**
- Section with SectionHeading
- Grid layout (typically 2 columns)
- ContentBox items with heading + content
- Consistent border and padding styling

**Recommendation:** Extract as `BenefitsSection` component
- Props: `title`, `items: Array<{heading, content}>`, `columns?`, `gap?`
- Replaces repeated benefit rendering logic
- Impact: Reduces 15 lines to 1-2 lines per usage

---

### 2. FAQ SECTION (Q&A with ContentBox)
**Appearance Count: 2+**
**Files Used In:**
- `/app/service-areas/[location]/[service]/page.tsx` - Service FAQs (lines 175-189)

**Current Implementation:**
```tsx
<Section padding="md">
  <Container maxWidth="lg">
    <SectionHeading>Frequently Asked Questions</SectionHeading>
    <div className="space-y-6">
      {page.faqs.map((faq: any, index: number) => (
        <ContentBox key={index} border padding="md">
          <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
          <p className="text-base leading-relaxed">{faq.answer}</p>
        </ContentBox>
      ))}
    </div>
  </Container>
</Section>
```

**Pattern Details:**
- Section wrapper with heading
- Vertical stack of Q&A items (space-y-6)
- Each item: ContentBox with question (h3) and answer (p)
- Consistent styling and spacing

**Recommendation:** Extract as `FAQSection` component
- Props: `title`, `items: Array<{question, answer}>`
- Could be reused on: FAQ, service pages, help pages
- Impact: Reduces 14 lines to 1 line per usage

---

### 3. OFFERINGS/FEATURES LIST
**Appearance Count: 5+**
**Files Used In:**
- `/app/service-areas/[location]/[service]/page.tsx` - Service offerings (lines 152-163)
- `/app/service-areas/[location]/page.tsx` - Related services list (lines 191-201)
- `/app/service-areas/[location]/[service]/page.tsx` - Related services (lines 192-203)
- `/app/service-areas/[location]/[service]/page.tsx` - Nearby areas (lines 206-217)

**Current Implementation:**
```tsx
<Section padding="md">
  <Container maxWidth="lg">
    <SectionHeading>Our Services Include</SectionHeading>
    <ul className="list-disc list-inside space-y-2">
      {page.offerings.map((offering: string, index: number) => (
        <li key={index} className="text-base">{offering}</li>
      ))}
    </ul>
  </Container>
</Section>
```

**Pattern Details:**
- Section wrapper with title
- Bulleted list (list-disc)
- List items with consistent text-base styling
- Vertical spacing (space-y-2)
- Simple string items (no nested structure)

**Recommendation:** Extract as `ListSection` component
- Props: `title`, `items: string[]`, `type?: 'unordered' | 'ordered'`
- Reusable across service pages, location pages, listings
- Impact: Reduces 11 lines to 1 line per usage
- Could also leverage existing `List` utility component

---

### 4. HEADING + INTRO TEXT SECTION
**Appearance Count: 8+**
**Files Used In:**
- `/app/page.tsx` - Full content paragraphs (lines 107-126)
- `/app/service-areas/page.tsx` - Highlight sections (lines 287-301)
- `/app/service-areas/[location]/page.tsx` - About section (lines 124-133)
- `/app/service-areas/[location]/page.tsx` - Residential intro (lines 140-142)
- `/app/service-areas/[location]/page.tsx` - Commercial intro (lines 167-169)
- `/app/[landing]/page.tsx` - Content sections (lines 131-145)

**Current Implementation:**
```tsx
<Section padding="md">
  <Container maxWidth="lg">
    <SectionHeading>{section.heading}</SectionHeading>
    {intro && <Paragraph>{intro}</Paragraph>}
    {/* additional content */}
  </Container>
</Section>
```

**Pattern Details:**
- Section with container
- SectionHeading always precedes content
- Optional intro paragraph
- Consistent spacing and layout
- Forms the basic building block for many sections

**Recommendation:** Extract as `ContentSection` component
- Props: `title`, `content`, `children?`, `padding?`, `maxWidth?`
- Most fundamental reusable pattern
- Impact: Reduces 6-8 lines to 1 line per usage

---

### 5. CARD GRID WITH LINKS (Location/Area/Service Links)
**Appearance Count: 4+**
**Files Used In:**
- `/app/service-areas/page.tsx` - Location grid (lines 315-325)
- `/app/service-areas/[location]/page.tsx` - Residential services grid (lines 143-157)
- `/app/service-areas/[location]/page.tsx` - Commercial services grid (lines 170-184)
- `/app/service-areas/[location]/page.tsx` - Nearby areas grid (lines 208-221)

**Current Implementation:**
```tsx
<Section padding="md">
  <Container maxWidth="lg">
    <SectionHeading>{title}</SectionHeading>
    <Grid columns={3} gap="md">
      {items.map(item => (
        <GridItem key={item.id}>
          <Link href={item.href} className="block p-4 border rounded transition hover:border-current text-center">
            {item.name}
          </Link>
        </GridItem>
      ))}
    </Grid>
  </Container>
</Section>
```

**Pattern Details:**
- Section with title
- Grid layout (typically 3 columns)
- Each item is a bordered link card
- Center-aligned text
- Consistent hover state styling
- Optional intro paragraph before grid

**Recommendation:** Extract as `LinkCardGrid` component
- Props: `title`, `items: Array<{name, href}>`, `columns?`, `gap?`, `intro?`
- Replaces service, location, area link grids
- Impact: Reduces 12-15 lines to 1-2 lines per usage
- High reuse across location/service pages

---

### 6. CTA SECTION (Call-to-Action Footer)
**Appearance Count: 5+**
**Files Used In:**
- `/app/service-areas/[location]/page.tsx` - Contact CTA (lines 225-235)
- `/app/service-areas/[location]/[service]/page.tsx` - CTA (lines 220-230)
- `/app/[landing]/page.tsx` - CTA (lines 194-204)
- `/app/contact-us/page.tsx` - (implied)

**Current Implementation:**
```tsx
<Section border="top" padding="lg">
  <Container maxWidth="md">
    <div className="text-center">
      <SectionHeading>Ready to Get Started?</SectionHeading>
      <p className="text-base leading-relaxed mb-6">Contact us today...</p>
      <Button asLink href="/contact-us" variant="primary">
        Contact Us
      </Button>
    </div>
  </Container>
</Section>
```

**Pattern Details:**
- Section with top border
- Centered layout
- SectionHeading as CTA message
- Explanatory paragraph
- Primary button (always links to /contact-us)
- Consistent styling and spacing

**Recommendation:** Extract as `CTASection` component
- Props: `heading`, `text`, `buttonText?`, `buttonHref?`
- Standardize CTA appearance across site
- Impact: Reduces 10 lines to 1 line per usage
- Could be made data-driven for consistency

---

### 7. SERVICE LANDING DYNAMIC SECTIONS
**Appearance Count: 1 file, 5+ sections per page**
**Files Used In:**
- `/app/[landing]/page.tsx` - Dynamic section rendering (lines 112-191)

**Current Implementation:**
```tsx
{page.sections && page.sections.map((section: any, index: number) => (
  <Section key={index} padding="md">
    <Container maxWidth="lg">
      {section.section_type === 'info_card' && (
        <ContentBox border padding="md">
          {/* info_card content */}
        </ContentBox>
      )}
      {(section.section_type === 'content_block' || section.section_type === 'content') && (
        <div>
          {/* content rendering */}
        </div>
      )}
      {(section.section_type === 'comparison_table' || section.section_type === 'table') && (
        <div>
          {/* table rendering */}
        </div>
      )}
      {section.section_type === 'list' && (
        <div>
          {/* list rendering */}
        </div>
      )}
    </Container>
  </Section>
))}
```

**Pattern Details:**
- Conditional rendering based on section_type
- Multiple section types with similar patterns
- Repetitive heading + content structure
- Large if/else tree (80 lines of JSX)

**Recommendation:** Extract section type components
- Create: `InfoCardSection`, `ContentBlockSection`, `TableSection`, `ListSection`
- Move conditional logic into separate renderer component
- Impact: Reduces 80 lines to 10-15 lines with cleaner code
- Makes it easier to add new section types

---

### 8. HEADING + CONTENT PAIR (ContentBox Style)
**Appearance Count: 8+**
**Files Used In:**
- `/app/service-areas/[location]/[service]/page.tsx` - Benefits and FAQs
- `/app/[landing]/page.tsx` - Info cards

**Current Implementation (repeated):**
```tsx
<ContentBox border padding="md">
  <h3 className="text-lg font-semibold mb-3">{heading}</h3>
  <p className="text-base leading-relaxed">{content}</p>
</ContentBox>
```

**Pattern Details:**
- ContentBox wrapper with border and padding
- Heading as h3 with fixed styling
- Content as p with fixed styling
- Consistent margin spacing

**Recommendation:** Extract as `HeadingContentCard` component
- Props: `heading`, `content`, `padding?`, `border?`
- Simplifies benefit cards, FAQ cards, info cards
- Impact: Reduces 4 lines to 1 line per card

---

## Summary Table

| Pattern | Usage Count | Primary Files | Complexity | Impact |
|---------|------------|---------------|-----------|--------|
| Benefits Section | 5+ | Service detail, Landing | Medium | High |
| FAQ Section | 2+ | Service detail | Medium | High |
| List Section | 5+ | Service, Location | Low | High |
| Content Section | 8+ | Multiple | Low | Very High |
| Link Card Grid | 4+ | Location, Service areas | Medium | Very High |
| CTA Section | 5+ | Service, Landing | Low | High |
| Dynamic Sections | 6 pages | Landing pages | High | Medium |
| Heading+Content Card | 8+ | Service, Landing | Low | High |

---

## Recommended Component Extraction Plan

### Tier 1: High Impact, Low Effort (Do First)
1. **ContentSection** - Most fundamental, 8+ uses
   - File: `app/components/UI/ContentSection.tsx`
   - Props: title, content, children?, padding?, maxWidth?

2. **ListSection** - Simple, 5+ uses
   - File: `app/components/UI/ListSection.tsx`
   - Props: title, items, type?, intro?

3. **HeadingContentCard** - Trivial extraction, 8+ uses
   - File: `app/components/UI/HeadingContentCard.tsx`
   - Props: heading, content, padding?, border?

### Tier 2: Medium Impact, Medium Effort (Do Second)
4. **BenefitsSection** - Combines cards, 5+ uses
   - File: `app/components/UI/BenefitsSection.tsx`
   - Props: title, items, columns?, gap?

5. **FAQSection** - Specific use case, 2+ uses
   - File: `app/components/UI/FAQSection.tsx`
   - Props: title, items

6. **LinkCardGrid** - High reuse potential, 4+ uses
   - File: `app/components/UI/LinkCardGrid.tsx`
   - Props: title, items, columns?, gap?, intro?

### Tier 3: Lower Impact, Higher Effort (Do Third)
7. **CTASection** - Standardization benefit, 5+ uses
   - File: `app/components/UI/CTASection.tsx`
   - Props: heading, text, buttonText?, buttonHref?

8. **SectionRenderer** - Clean up landing pages, 1 file with 80+ lines
   - File: `app/components/UI/SectionRenderer.tsx`
   - Props: section, sectionType

---

## Code Reduction Impact

### Before (Current State)
- Service detail page: 234 lines
- Location page: 239 lines
- Service landing page: 208 lines
- Service areas page: 335 lines
- **Total: 1,016 lines** (for these 5 key files)

### After (With Components)
- Service detail page: ~150 lines (-36%)
- Location page: ~140 lines (-41%)
- Service landing page: ~100 lines (-52%)
- Service areas page: ~180 lines (-46%)
- **Total: ~570 lines** (-44% reduction)
- Plus: 8 reusable component files (~300 lines total)
- **Net result: Increased maintainability, reduced duplication**

---

## Additional Benefits

1. **Consistency** - Ensures all similar sections look and behave identically
2. **Maintainability** - Changes to section styling only need to be made once
3. **Testability** - Components can be tested independently
4. **Scalability** - Easy to add new section types or customize existing ones
5. **Type Safety** - Props can be properly typed for each component
6. **Documentation** - Component documentation becomes clearer with extracted code
7. **Developer Experience** - Cleaner page files, easier to understand page structure

---

## Next Steps

1. Start with Tier 1 components (highest impact)
2. Gradually refactor pages to use new components
3. Test each refactoring to ensure no visual changes
4. Document component usage patterns
5. Update component library documentation
6. Consider creating component storybook for visual documentation
