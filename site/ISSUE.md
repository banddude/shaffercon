# ISSUE: Color System Architecture and Code Consistency

## Problem Statement

The codebase has **mismatched and inconsistent color implementation** across multiple files. While theme centralization was attempted, there's still scattered color logic that contradicts the intended single-source-of-truth architecture.

## Current State (BROKEN)

### The Goal (What We Want)
- **ONE source of truth**: `app/styles/theme.ts`
- **FOUR core colors only**: primary, secondary, background, text
- **ZERO hardcoded hex codes** in component files
- **ZERO scattered isDark logic** in individual components
- Theme file handles ALL color switching (light/dark modes)

### The Reality (What's Happening)
There are **multiple contradicting systems**:

1. **Static color object in theme.ts** - Light mode only
   - `theme.colors` - Has 4 core colors + aliases
   - Used in server-side rendering

2. **Dynamic `getActiveColorScheme()` function** - Tries to detect dark mode
   - Returns color palette based on `document.classList.contains('dark')`
   - Only runs in browser
   - Exported as `theme.getActiveColors()`
   - Components supposed to use this

3. **getColors.ts file** - DUPLICATE LOGIC
   - Has its own `getActiveColors()` function
   - Has its own `useActiveColors()` hook
   - Has its own `getColor()` helper
   - **NOT BEING USED** (dead code)

4. **Old isDark checks in components** - STILL EXIST
   - Some files still have: `const isDark = document.documentElement.classList.contains('dark')`
   - Some components call `theme.getActiveColors()`
   - Some components use static `theme.colors`
   - **INCONSISTENT PATTERN**

5. **Hardcoded colors scattered everywhere**
   - `#0284c7` appears in Header.tsx, Footer.tsx, and other files
   - `#ffffff` and `#000000` hardcoded in inline styles
   - Colors NOT coming from theme object

## Files with Issues

### ✅ Fixed Files
- `app/components/UI/Typography.tsx` - Uses `theme.getActiveColors()`
- `app/components/UI/Layout.tsx` - Uses `theme.getActiveColors()`
- `app/[landing]/page.tsx` - Uses `theme.colors`

### ❌ Broken/Inconsistent Files
- `app/components/Header.tsx` - Has hardcoded `#0284c7`, `#ffffff`, `#000000` inline
- `app/components/Footer.tsx` - Has hardcoded colors, uses static `theme.colors`
- `app/components/CTA.tsx` - Likely has hardcoded colors
- `app/page.tsx` - Likely has hardcoded colors
- `app/about-us/page.tsx` - Likely has hardcoded colors
- `app/contact-us/page.tsx` - Likely has hardcoded colors
- `lib/db.ts` - May have hardcoded colors
- Any other component files

### ⚠️ Dead Code
- `app/styles/getColors.ts` - ENTIRE FILE IS UNUSED
  - Duplicate logic of theme.ts functions
  - Should be deleted

## The Inconsistency Problem

**Example 1: Different approaches in different files**

Header.tsx:
```jsx
style={{ background: '#ffffff', color: '#000000' }}
```

Typography.tsx:
```jsx
const colors = theme.getActiveColors();
style={{ color: colors.text }}
```

Service Landing:
```jsx
import { theme } from "@/app/styles/theme";
style={{ color: theme.colors.secondary }}
```

**These should ALL use the same pattern!**

## What Needs to Happen

### Step 1: Cleanup Dead Code
- ❌ DELETE `app/styles/getColors.ts` entirely
- This logic is already in `theme.ts`

### Step 2: Standardize on ONE Pattern
**EVERY component should use this pattern:**
```jsx
"use client";
import { theme } from "@/app/styles/theme";

export function MyComponent() {
  const colors = theme.getActiveColors();

  return (
    <div style={{ background: colors.background, color: colors.text }}>
      Content
    </div>
  );
}
```

### Step 3: Find and Replace ALL Hardcoded Colors
Search for and remove EVERY instance of:
- `#0284c7` - Replace with `colors.primary`
- `#ffffff` - Replace with `colors.background` or `colors.white`
- `#000000` - Replace with `colors.text` or `colors.secondary`
- `rgb(...)` - Replace with color variables
- `rgba(...)` - Replace with color variables

### Step 4: Audit Every Component File
Go through EVERY file and ensure:
- ✅ Imports `theme` from `"@/app/styles/theme"`
- ✅ Client component has `"use client"` if using `theme.getActiveColors()`
- ✅ Gets colors: `const colors = theme.getActiveColors();`
- ✅ Uses colors: `style={{ color: colors.text }}`
- ✅ NO hardcoded hex codes
- ✅ NO scattered isDark logic

### Step 5: Update theme.ts if Needed
Ensure `theme.ts` has:
- ✅ 4 core color objects (COLORS_LIGHT, COLORS_DARK)
- ✅ `getActiveColorScheme()` function
- ✅ Proper exports and aliases
- ✅ Comprehensive error handling for SSR

## Files That Need Auditing/Fixing

1. `app/components/Header.tsx`
2. `app/components/Footer.tsx`
3. `app/components/CTA.tsx`
4. `app/components/HeaderWrapper.tsx`
5. `app/components/FooterWrapper.tsx`
6. `app/page.tsx`
7. `app/about-us/page.tsx`
8. `app/contact-us/page.tsx`
9. `app/service-areas/page.tsx`
10. `app/service-areas/[location]/page.tsx`
11. `app/service-areas/[location]/[service]/page.tsx`
12. `app/blog/[slug]/page.tsx`
13. `lib/db.ts`
14. Any other component files

## Expected Outcome

After fixing:
- **ONE source of truth** for all colors: `app/styles/theme.ts`
- **ZERO hardcoded colors** anywhere in codebase
- **CONSISTENT pattern** across ALL components
- **Automatic dark mode support** - switch in theme file, affects entire app
- **Clean, maintainable code** - no duplicate logic
- **Easy to modify** - change color value once, updates everywhere

## Why This Matters

1. **Maintainability** - Change a color in ONE place, affects entire site
2. **Consistency** - All pages/components use same colors
3. **Dark Mode** - Theme file handles switching automatically
4. **Code Quality** - No dead code, no duplication, clear patterns
5. **Scalability** - Easy to add new color variables or modes

## Current Status

🔴 **BROKEN** - Multiple contradicting systems causing confusion and maintenance issues
