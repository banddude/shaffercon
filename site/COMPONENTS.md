# Modular Component System

This document explains the reusable component library for creating a unified design system across the entire website.

## Overview

The website uses a modular component architecture with the following structure:

- **UI Components** (`app/components/UI.tsx`) - Reusable React components
- **Theme Configuration** (`app/styles/components.ts`) - Centralized styling rules
- **Usage** - Import and use components throughout the site

## Benefits

1. **Consistency** - All pages use the same components and styling
2. **Maintainability** - Update styling in one place, affects entire site
3. **Scalability** - Easy to add new components
4. **Reusability** - No repeated code

## Component Categories

### Typography Components

#### PageTitle
Main page heading for hero sections.

```tsx
import { PageTitle } from "@/app/components/UI";

<PageTitle>Welcome to Our Site</PageTitle>
```

#### SectionHeading
Subheadings for major content sections.

```tsx
<SectionHeading>Services We Offer</SectionHeading>
```

#### Subheading
Smaller headings for subsections.

```tsx
<Subheading>Our Process</Subheading>
```

#### Paragraph
Standard paragraph text with consistent spacing.

```tsx
<Paragraph>Lorem ipsum dolor sit amet...</Paragraph>
```

### Button Components

#### Button
Multi-variant button component.

```tsx
// Primary button with border
<Button variant="primary">Click Me</Button>

// Secondary button
<Button variant="secondary">Secondary</Button>

// Tertiary button (minimal)
<Button variant="tertiary">Tertiary</Button>

// As a link
<Button asLink href="/about" variant="primary">
  Learn More
</Button>
```

### Container Components

#### Section
Full-width section with padding and optional borders.

```tsx
<Section padding="md" border="bottom">
  <h2>Section Content</h2>
  <p>This is a full-width section.</p>
</Section>
```

Properties:
- `padding`: "sm" | "md" | "lg"
- `border`: "top" | "bottom" | "both" | "none"

#### Container
Max-width container for content alignment.

```tsx
<Container maxWidth="lg">
  <p>This content is centered with max width.</p>
</Container>
```

Properties:
- `maxWidth`: "sm" | "md" | "lg" | "xl" | "none"

#### ContentBox
Standalone box with padding and optional border.

```tsx
<ContentBox padding="lg" border>
  <p>Boxed content</p>
</ContentBox>
```

Properties:
- `padding`: "sm" | "md" | "lg"
- `border`: boolean

### Grid Components

#### Grid & GridItem
Responsive grid layout system.

```tsx
<Grid columns={3} gap="lg">
  <GridItem>Item 1</GridItem>
  <GridItem>Item 2</GridItem>
  <GridItem>Item 3</GridItem>
</Grid>
```

Properties:
- `columns`: 1 | 2 | 3 | 4
- `gap`: "sm" | "md" | "lg"

### List Components

#### List
Ordered or unordered lists.

```tsx
<List items={["Item 1", "Item 2", "Item 3"]} />

<List items={["First", "Second", "Third"]} ordered />
```

### Card Components

#### Card
Container for grouped content.

```tsx
<Card title="Card Title">
  <p>Card content goes here.</p>
</Card>
```

### Utility Components

#### Spacer
Add vertical spacing between sections.

```tsx
<Spacer size="md" />
```

Properties:
- `size`: "sm" | "md" | "lg"

#### Divider
Horizontal line separator.

```tsx
<Divider />
```

#### Badge
Small label or tag component.

```tsx
<Badge>New</Badge>
```

## Theming

All component styles are defined in `app/styles/components.ts`. To update the theme globally:

1. Open `app/styles/components.ts`
2. Modify the relevant styles in the `componentTheme` object
3. Changes apply to all pages using those components

### Example: Changing Button Styles

```typescript
// In app/styles/components.ts
buttons: {
  primary: {
    base: "px-6 py-3 font-semibold rounded transition-all border-2 border-current underline hover:no-underline",
  },
}
```

Change `border-2` to `border` to reduce border thickness everywhere.

## Creating New Components

To add a new component:

1. Add the component function to `app/components/UI.tsx`
2. Define its default styling (using Tailwind classes)
3. Allow customization via `className` prop
4. Document usage in this file
5. Add theme configuration to `app/styles/components.ts` if needed

Example:

```tsx
interface NewComponentProps {
  children: ReactNode;
  className?: string;
}

export function NewComponent({ children, className = "" }: NewComponentProps) {
  return (
    <div className={`base-styling ${className}`}>
      {children}
    </div>
  );
}
```

## Migration Guide

To convert existing pages to use components:

1. Import needed components: `import { PageTitle, Section, Container } from "@/app/components/UI";`
2. Replace hardcoded styling with component usage
3. Use `className` prop for page-specific overrides if needed
4. Test responsive behavior

### Before (with inline styling):

```tsx
<section className="py-16 border-b">
  <div className="container mx-auto px-4">
    <h1 className="text-2xl md:text-3xl font-bold max-w-3xl">
      Page Title
    </h1>
  </div>
</section>
```

### After (with components):

```tsx
<Section border="bottom">
  <Container>
    <PageTitle>Page Title</PageTitle>
  </Container>
</Section>
```

## Best Practices

1. **Always use components** - Maintain consistency across the site
2. **Minimize custom CSS** - Use component props for variations
3. **Use the theme file** - Don't hardcode Tailwind classes
4. **Test responsive** - Components are designed for mobile-first
5. **Keep it simple** - Components should be focused and reusable

## Common Patterns

### Hero Section

```tsx
<Section padding="lg" border="bottom">
  <Container>
    <PageTitle>Hero Content</PageTitle>
  </Container>
</Section>
```

### Two-Column Layout

```tsx
<Section>
  <Grid columns={2} gap="lg">
    <GridItem>Left column</GridItem>
    <GridItem>Right column</GridItem>
  </Grid>
</Section>
```

### Call to Action

```tsx
<Section border="bottom">
  <Container maxWidth="md">
    <SectionHeading>Ready to Get Started?</SectionHeading>
    <Paragraph>Join us today and experience the difference.</Paragraph>
    <Button asLink href="/contact" variant="primary">
      Contact Us
    </Button>
  </Container>
</Section>
```

## Troubleshooting

**Q: Components not showing expected styles?**
- Verify Tailwind CSS is running (`npm run dev`)
- Check that you're importing from `@/app/components/UI`

**Q: Need a custom variant of a component?**
- Use the `className` prop to add custom Tailwind classes
- Or create a specialized component wrapping the base component

**Q: How do I change spacing globally?**
- Edit the spacing values in `app/styles/components.ts`
- Rebuild the site to see changes

## Next Steps

1. Update page templates to use these components
2. Test responsiveness across devices
3. Gather feedback on component usability
4. Add new components as needed
5. Consider adding animations/interactions
