# Component Extraction Implementation Guide

## Overview
This guide provides implementation details for extracting the 8 recommended components from the AIVA website codebase. Each component includes TypeScript interfaces, example usage, and migration steps.

---

## TIER 1: High Impact, Low Effort Components

### 1. ContentSection Component
**Purpose:** Basic section with heading, content, and optional children
**Extraction Priority:** FIRST (Most fundamental)

**File:** `app/components/UI/ContentSection.tsx`

```typescript
"use client";

import React, { ReactNode } from "react";
import { Section, Container } from "./Layout";
import { SectionHeading, Paragraph } from "./Typography";

interface ContentSectionProps {
  /** Section title/heading */
  title?: ReactNode;
  /** Main paragraph content */
  content?: ReactNode;
  /** Optional additional content */
  children?: ReactNode;
  /** Padding size */
  padding?: "sm" | "md" | "lg";
  /** Container max-width */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "none";
  /** Section border position */
  border?: "top" | "bottom" | "both" | "none";
  /** Additional CSS classes */
  className?: string;
}

export function ContentSection({
  title,
  content,
  children,
  padding = "md",
  maxWidth = "lg",
  border = "none",
  className = "",
}: ContentSectionProps) {
  return (
    <Section padding={padding} border={border} className={className}>
      <Container maxWidth={maxWidth}>
        {title && (
          <SectionHeading className="mb-0">{title}</SectionHeading>
        )}
        {content && (
          <Paragraph className="mb-0">{content}</Paragraph>
        )}
        {children}
      </Container>
    </Section>
  );
}
```

**Current Usage (Location Page, lines 124-133):**
```tsx
<Section padding="md">
  <Container maxWidth="lg">
    {page.about_paragraph_1 && (
      <Paragraph>{page.about_paragraph_1}</Paragraph>
    )}
    {page.about_paragraph_2 && (
      <Paragraph>{page.about_paragraph_2}</Paragraph>
    )}
  </Container>
</Section>
```

**After Refactoring:**
```tsx
<ContentSection
  content={page.about_paragraph_1}
>
  {page.about_paragraph_2 && (
    <Paragraph>{page.about_paragraph_2}</Paragraph>
  )}
</ContentSection>
```

**Usage Count:** 8+ occurrences
**File Reduction:** ~6 lines per usage → 1-2 lines

---

### 2. ListSection Component
**Purpose:** Section with title and bulleted or numbered list
**Extraction Priority:** SECOND

**File:** `app/components/UI/ListSection.tsx`

```typescript
"use client";

import React, { ReactNode } from "react";
import { Section, Container } from "./Layout";
import { SectionHeading, Paragraph } from "./Typography";

interface ListSectionProps {
  /** Section title */
  title: ReactNode;
  /** Array of list items */
  items: string[];
  /** List type */
  type?: "unordered" | "ordered";
  /** Optional intro text before list */
  intro?: ReactNode;
  /** Padding size */
  padding?: "sm" | "md" | "lg";
  /** Container max-width */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "none";
  /** Additional CSS classes */
  className?: string;
}

export function ListSection({
  title,
  items,
  type = "unordered",
  intro,
  padding = "md",
  maxWidth = "lg",
  className = "",
}: ListSectionProps) {
  const ListComponent = type === "ordered" ? "ol" : "ul";
  const listClasses = type === "ordered"
    ? "list-decimal list-inside"
    : "list-disc list-inside";

  return (
    <Section padding={padding} className={className}>
      <Container maxWidth={maxWidth}>
        <SectionHeading className="mb-0">{title}</SectionHeading>
        {intro && (
          <Paragraph className="mb-0">{intro}</Paragraph>
        )}
        <ListComponent className={`${listClasses} space-y-2`}>
          {items.map((item, index) => (
            <li key={index} className="text-base">
              {item}
            </li>
          ))}
        </ListComponent>
      </Container>
    </Section>
  );
}
```

**Current Usage (Service Detail, lines 152-163):**
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

**After Refactoring:**
```tsx
<ListSection
  title="Our Services Include"
  items={page.offerings}
  type="unordered"
/>
```

**Usage Count:** 5+ occurrences
**File Reduction:** ~11 lines per usage → 3 lines

---

### 3. HeadingContentCard Component
**Purpose:** Card with heading and content pair
**Extraction Priority:** THIRD

**File:** `app/components/UI/HeadingContentCard.tsx`

```typescript
"use client";

import React, { ReactNode } from "react";
import { ContentBox } from "./Layout";

interface HeadingContentCardProps {
  /** Card heading */
  heading: ReactNode;
  /** Card content */
  content: ReactNode;
  /** Padding size */
  padding?: "sm" | "md" | "lg";
  /** Show border */
  border?: boolean;
  /** Heading element size */
  headingSize?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

export function HeadingContentCard({
  heading,
  content,
  padding = "md",
  border = true,
  headingSize = "md",
  className = "",
}: HeadingContentCardProps) {
  const headingClasses = {
    sm: "text-base font-semibold",
    md: "text-lg font-semibold",
    lg: "text-xl font-semibold",
  };

  return (
    <ContentBox padding={padding} border={border} className={className}>
      <h3 className={`${headingClasses[headingSize]} mb-3`}>
        {heading}
      </h3>
      <p className="text-base leading-relaxed">{content}</p>
    </ContentBox>
  );
}
```

**Current Usage (Service Detail, lines 140-145):**
```tsx
{page.benefits.map((benefit: any, index: number) => (
  <ContentBox key={index} border padding="md">
    <h3 className="text-lg font-semibold mb-3">{benefit.heading}</h3>
    <p className="text-base leading-relaxed">{benefit.content}</p>
  </ContentBox>
))}
```

**After Refactoring:**
```tsx
{page.benefits.map((benefit: any, index: number) => (
  <HeadingContentCard
    key={index}
    heading={benefit.heading}
    content={benefit.content}
  />
))}
```

**Usage Count:** 8+ occurrences
**File Reduction:** ~4 lines per card → 1-2 lines

---

## TIER 2: Medium Impact, Medium Effort Components

### 4. BenefitsSection Component
**Purpose:** Grid of heading + content cards with section wrapper
**Extraction Priority:** FOURTH

**File:** `app/components/UI/BenefitsSection.tsx`

```typescript
"use client";

import React, { ReactNode } from "react";
import { Section, Container, Grid, GridItem } from "./Layout";
import { SectionHeading } from "./Typography";
import { HeadingContentCard } from "./HeadingContentCard";

interface BenefitItem {
  heading: ReactNode;
  content: ReactNode;
}

interface BenefitsSectionProps {
  /** Section title */
  title: ReactNode;
  /** Array of benefit items */
  items: BenefitItem[];
  /** Grid columns */
  columns?: 1 | 2 | 3 | 4;
  /** Grid gap */
  gap?: "sm" | "md" | "lg";
  /** Padding size */
  padding?: "sm" | "md" | "lg";
  /** Container max-width */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "none";
  /** Additional CSS classes */
  className?: string;
}

export function BenefitsSection({
  title,
  items,
  columns = 2,
  gap = "lg",
  padding = "md",
  maxWidth = "lg",
  className = "",
}: BenefitsSectionProps) {
  return (
    <Section padding={padding} className={className}>
      <Container maxWidth={maxWidth}>
        <SectionHeading className="mb-0">{title}</SectionHeading>
        <Grid columns={columns} gap={gap}>
          {items.map((item, index) => (
            <GridItem key={index}>
              <HeadingContentCard
                heading={item.heading}
                content={item.content}
              />
            </GridItem>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
```

**Current Usage (Service Detail, lines 135-149):**
```tsx
<Section padding="md">
  <Container maxWidth="lg">
    <SectionHeading>Benefits</SectionHeading>
    <div className="grid md:grid-cols-2 gap-8">
      {page.benefits.map((benefit: any, index: number) => (
        <ContentBox key={index} border padding="md">
          <h3 className="text-lg font-semibold mb-3">{benefit.heading}</h3>
          <p className="text-base leading-relaxed">{benefit.content}</p>
        </ContentBox>
      ))}
    </div>
  </Container>
</Section>
```

**After Refactoring:**
```tsx
<BenefitsSection
  title="Benefits"
  items={page.benefits}
  columns={2}
  gap="lg"
/>
```

**Usage Count:** 5+ occurrences
**File Reduction:** ~15 lines per usage → 2-3 lines

---

### 5. FAQSection Component
**Purpose:** Section with Q&A pairs displayed as cards
**Extraction Priority:** FIFTH

**File:** `app/components/UI/FAQSection.tsx`

```typescript
"use client";

import React, { ReactNode } from "react";
import { Section, Container } from "./Layout";
import { SectionHeading } from "./Typography";
import { HeadingContentCard } from "./HeadingContentCard";

interface FAQItem {
  question: ReactNode;
  answer: ReactNode;
}

interface FAQSectionProps {
  /** Section title */
  title?: ReactNode;
  /** Array of FAQ items */
  items: FAQItem[];
  /** Padding size */
  padding?: "sm" | "md" | "lg";
  /** Container max-width */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "none";
  /** Additional CSS classes */
  className?: string;
}

export function FAQSection({
  title = "Frequently Asked Questions",
  items,
  padding = "md",
  maxWidth = "lg",
  className = "",
}: FAQSectionProps) {
  return (
    <Section padding={padding} className={className}>
      <Container maxWidth={maxWidth}>
        {title && (
          <SectionHeading className="mb-0">{title}</SectionHeading>
        )}
        <div className="space-y-6">
          {items.map((item, index) => (
            <HeadingContentCard
              key={index}
              heading={item.question}
              content={item.answer}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
```

**Current Usage (Service Detail, lines 175-189):**
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

**After Refactoring:**
```tsx
<FAQSection
  items={page.faqs}
/>
```

**Usage Count:** 2+ occurrences
**File Reduction:** ~14 lines per usage → 1-2 lines

---

### 6. LinkCardGrid Component
**Purpose:** Grid of link cards with optional intro text
**Extraction Priority:** SIXTH

**File:** `app/components/UI/LinkCardGrid.tsx`

```typescript
"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { Section, Container, Grid, GridItem } from "./Layout";
import { SectionHeading, Paragraph } from "./Typography";

interface LinkCardItem {
  name: ReactNode;
  href: string;
}

interface LinkCardGridProps {
  /** Section title */
  title: ReactNode;
  /** Array of link items */
  items: LinkCardItem[];
  /** Grid columns */
  columns?: 1 | 2 | 3 | 4;
  /** Grid gap */
  gap?: "sm" | "md" | "lg";
  /** Optional intro paragraph */
  intro?: ReactNode;
  /** Padding size */
  padding?: "sm" | "md" | "lg";
  /** Container max-width */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "none";
  /** Additional CSS classes */
  className?: string;
}

export function LinkCardGrid({
  title,
  items,
  columns = 3,
  gap = "md",
  intro,
  padding = "md",
  maxWidth = "lg",
  className = "",
}: LinkCardGridProps) {
  return (
    <Section padding={padding} className={className}>
      <Container maxWidth={maxWidth}>
        <SectionHeading className="mb-0">{title}</SectionHeading>
        {intro && (
          <Paragraph className="max-w-3xl mb-0">{intro}</Paragraph>
        )}
        <Grid columns={columns} gap={gap}>
          {items.map((item, index) => (
            <GridItem key={index}>
              <Link href={item.href} className="block h-full">
                <div className="h-full border rounded-lg px-6 py-5 transition-transform duration-300 hover:-translate-y-0.5">
                  <h3 className="text-lg font-semibold leading-snug">
                    {item.name}
                  </h3>
                </div>
              </Link>
            </GridItem>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
```

**Current Usage (Service Areas, lines 307-329):**
```tsx
<Section padding="md">
  <Container maxWidth="lg">
    <div className="space-y-6">
      <SectionHeading className="mb-0">Areas We Serve</SectionHeading>
      {locationPromptParagraph && (
        <Paragraph className="max-w-3xl mb-0">{locationPromptParagraph}</Paragraph>
      )}
      <Grid columns={3} gap="lg">
        {page.locations.map(location => (
          <GridItem key={location.location_slug}>
            <Link href={`/service-areas/${location.location_slug}`} className="block h-full">
              <div className="h-full border rounded-lg px-6 py-5 transition-transform duration-300 hover:-translate-y-0.5">
                <h3 className="text-lg font-semibold leading-snug">{location.location_name}</h3>
              </div>
            </Link>
          </GridItem>
        ))}
      </Grid>
    </div>
  </Container>
</Section>
```

**After Refactoring:**
```tsx
<LinkCardGrid
  title="Areas We Serve"
  items={page.locations.map(loc => ({
    name: loc.location_name,
    href: `/service-areas/${loc.location_slug}`
  }))}
  columns={3}
  intro={locationPromptParagraph}
/>
```

**Usage Count:** 4+ occurrences
**File Reduction:** ~18 lines per usage → 4-5 lines

---

## TIER 3: Lower Impact, Higher Effort Components

### 7. CTASection Component
**Purpose:** Centered call-to-action section with button
**Extraction Priority:** SEVENTH

**File:** `app/components/UI/CTASection.tsx`

```typescript
"use client";

import React, { ReactNode } from "react";
import { Section, Container } from "./Layout";
import { SectionHeading } from "./Typography";
import { Button } from "./Button";

interface CTASectionProps {
  /** CTA heading */
  heading: ReactNode;
  /** CTA description text */
  text: ReactNode;
  /** Button text */
  buttonText?: ReactNode;
  /** Button href */
  buttonHref?: string;
  /** Button variant */
  buttonVariant?: "primary" | "secondary";
  /** Section padding */
  padding?: "sm" | "md" | "lg";
  /** Show top border */
  border?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function CTASection({
  heading,
  text,
  buttonText = "Contact Us",
  buttonHref = "/contact-us",
  buttonVariant = "primary",
  padding = "lg",
  border = true,
  className = "",
}: CTASectionProps) {
  return (
    <Section
      border={border ? "top" : "none"}
      padding={padding}
      className={className}
    >
      <Container maxWidth="md">
        <div className="text-center">
          <SectionHeading className="mb-0">{heading}</SectionHeading>
          <p className="text-base leading-relaxed mb-6">{text}</p>
          <Button asLink href={buttonHref} variant={buttonVariant}>
            {buttonText}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
```

**Current Usage (Service Detail, lines 220-230):**
```tsx
<Section border="top" padding="lg">
  <Container maxWidth="md">
    <div className="text-center">
      <SectionHeading>Ready to Get Started?</SectionHeading>
      <p className="text-base leading-relaxed mb-6">Contact us today for a free consultation!</p>
      <Button asLink href="/contact-us" variant="primary">
        Contact Us
      </Button>
    </div>
  </Container>
</Section>
```

**After Refactoring:**
```tsx
<CTASection
  heading="Ready to Get Started?"
  text="Contact us today for a free consultation!"
  buttonText="Contact Us"
  buttonHref="/contact-us"
/>
```

**Usage Count:** 5+ occurrences
**File Reduction:** ~10 lines per usage → 1-2 lines

---

### 8. SectionRenderer Component
**Purpose:** Handle dynamic section rendering for landing pages
**Extraction Priority:** EIGHTH (Most complex)

**File:** `app/components/UI/SectionRenderer.tsx`

```typescript
"use client";

import React from "react";
import { Section, Container, ContentBox } from "./Layout";
import { SectionHeading, Subheading } from "./Typography";

interface DynamicSection {
  section_type: string;
  heading?: string;
  subheading?: string;
  content?: string;
  table_data?: {
    headers: string[];
    rows: string[][];
  } | null;
}

interface SectionRendererProps {
  section: DynamicSection;
  index: number;
}

export function SectionRenderer({
  section,
  index,
}: SectionRendererProps) {
  switch (section.section_type) {
    case "info_card":
      return (
        <Section key={index} padding="md">
          <Container maxWidth="lg">
            <ContentBox border padding="md">
              {section.heading && (
                <SectionHeading>{section.heading}</SectionHeading>
              )}
              {section.subheading && (
                <Subheading>{section.subheading}</Subheading>
              )}
              {section.content && (
                <div className="prose prose-lg max-w-4xl">
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </div>
              )}
            </ContentBox>
          </Container>
        </Section>
      );

    case "content_block":
    case "content":
      return (
        <Section key={index} padding="md">
          <Container maxWidth="lg">
            {section.heading && (
              <SectionHeading>{section.heading}</SectionHeading>
            )}
            {section.subheading && (
              <Subheading>{section.subheading}</Subheading>
            )}
            {section.content && (
              <div className="prose prose-lg max-w-4xl">
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            )}
          </Container>
        </Section>
      );

    case "comparison_table":
    case "table":
      return section.table_data ? (
        <Section key={index} padding="md">
          <Container maxWidth="lg">
            {section.heading && (
              <SectionHeading>{section.heading}</SectionHeading>
            )}
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full border rounded">
                <thead>
                  <tr className="border-b">
                    {section.table_data.headers.map((header, idx) => (
                      <th
                        key={idx}
                        className="px-6 py-3 text-left text-sm font-semibold border-r last:border-r-0"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table_data.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b last:border-b-0">
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className="px-6 py-4 text-sm border-r last:border-r-0"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </Section>
      ) : null;

    case "list":
      return (
        <Section key={index} padding="md">
          <Container maxWidth="lg">
            {section.heading && (
              <SectionHeading>{section.heading}</SectionHeading>
            )}
            {section.content && (
              <div className="prose prose-lg max-w-4xl">
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            )}
          </Container>
        </Section>
      );

    default:
      return null;
  }
}
```

**Current Usage (Landing Page, lines 112-191):**
```tsx
{page.sections && page.sections.map((section: any, index: number) => (
  <Section key={index} padding="md">
    <Container maxWidth="lg">
      {section.section_type === 'info_card' && (
        <ContentBox border padding="md">
          {/* ... */}
        </ContentBox>
      )}
      {(section.section_type === 'content_block' || section.section_type === 'content') && (
        <div>
          {/* ... */}
        </div>
      )}
      {/* ... more cases ... */}
    </Container>
  </Section>
))}
```

**After Refactoring:**
```tsx
{page.sections && page.sections.map((section, index) => (
  <SectionRenderer key={index} section={section} index={index} />
))}
```

**Usage Count:** 6 landing pages with 30+ sections
**File Reduction:** ~80 lines → 3 lines

---

## Implementation Steps

### Step 1: Create Component Files
1. Create each component file in `app/components/UI/`
2. Add proper TypeScript interfaces
3. Follow existing component patterns

### Step 2: Update Index
Update `app/components/UI/index.ts`:
```typescript
// New Components
export { ContentSection } from './ContentSection';
export { ListSection } from './ListSection';
export { HeadingContentCard } from './HeadingContentCard';
export { BenefitsSection } from './BenefitsSection';
export { FAQSection } from './FAQSection';
export { LinkCardGrid } from './LinkCardGrid';
export { CTASection } from './CTASection';
export { SectionRenderer } from './SectionRenderer';
```

### Step 3: Refactor Pages (Gradual Approach)
1. Start with Tier 1 components
2. Test each page thoroughly
3. Verify visual output matches original
4. Commit after each page is refactored

### Step 4: Testing Strategy
- Take screenshots before and after
- Compare layouts on multiple screen sizes
- Test all interactive elements
- Verify SEO metadata still works

### Step 5: Documentation
- Add JSDoc comments to each component
- Create usage examples
- Document props and defaults
- Add to component library docs

---

## Migration Checklist

- [ ] Create Tier 1 components (ContentSection, ListSection, HeadingContentCard)
- [ ] Refactor and test 5 key pages
- [ ] Create Tier 2 components (BenefitsSection, FAQSection, LinkCardGrid)
- [ ] Refactor remaining pages
- [ ] Create Tier 3 components (CTASection, SectionRenderer)
- [ ] Final refactoring and testing
- [ ] Update documentation
- [ ] Deploy to production

---

## Benefits After Completion

1. **Code Duplication:** ~44% reduction in main page files
2. **Maintainability:** Changes to section styling only need one edit
3. **Consistency:** All similar sections automatically match
4. **Developer Experience:** Cleaner, more readable page files
5. **Testing:** Components can be tested in isolation
6. **Scalability:** Easy to add new section variations
7. **Documentation:** Components serve as living documentation

---

## Rollback Strategy

Each refactoring can be reverted independently by:
1. Checking git history
2. Reverting to previous commit
3. Testing to ensure no regressions

All changes are tracked in git for safety.
