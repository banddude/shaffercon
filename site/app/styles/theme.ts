/**
 * Theme configuration for Shaffer Construction
 * 4-color system that switches between light and dark modes
 */

// LIGHT MODE - 4 core colors
const COLORS_LIGHT = {
  primary: "#2b7fbd",      // Blue accents/links
  secondary: "#000000",    // Black text/headings
  background: "#ffffff",   // White background
  text: "#000000",         // Black text
};

// DARK MODE - 4 core colors (same structure, different values)
const COLORS_DARK = {
  primary: "#2b7fbd",      // Blue accents/links (same)
  secondary: "#a9a9a9",    // Grey text
  background: "#000000",   // Black background
  text: "#ffffff",         // White headings
};

/**
 * Get the currently active colors based on dark mode state
 * Checks if dark class is present on document.documentElement
 */
function getActiveColorScheme() {
  try {
    if (typeof document === "undefined" || !document.documentElement) {
      // Server-side or document not available, default to light colors
      return {
        ...COLORS_LIGHT,
        white: COLORS_LIGHT.background,
        black: COLORS_LIGHT.secondary,
        grey: COLORS_LIGHT.secondary,
        blue: COLORS_LIGHT.primary,
        border: COLORS_LIGHT.secondary,
      };
    }

    const isDark = document.documentElement.classList.contains("dark");
    const colorScheme = isDark ? COLORS_DARK : COLORS_LIGHT;

    return {
      ...colorScheme,
      white: colorScheme.background,
      black: colorScheme.secondary,
      grey: colorScheme.secondary,
      blue: colorScheme.primary,
      border: colorScheme.secondary,
    };
  } catch (e) {
    // Fallback to light colors if any error occurs
    return {
      ...COLORS_LIGHT,
      white: COLORS_LIGHT.background,
      black: COLORS_LIGHT.secondary,
      grey: COLORS_LIGHT.secondary,
      blue: COLORS_LIGHT.primary,
      border: COLORS_LIGHT.secondary,
    };
  }
}

export const theme = {
  // Light mode colors (default) - 4 core colors plus aliases for backward compatibility
  colors: {
    ...COLORS_LIGHT,
    // Aliases pointing to the 4 core colors
    white: COLORS_LIGHT.background,
    black: COLORS_LIGHT.secondary,
    grey: COLORS_LIGHT.secondary,
    blue: COLORS_LIGHT.primary,
    border: COLORS_LIGHT.secondary,
  },
  colorsDark: COLORS_DARK,
  // Smart getter that returns colors based on current dark mode state
  getActiveColors: getActiveColorScheme,

  typography: {
    fontFamily: {
      sans: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      mono: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    "4xl": "6rem",
  },

  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },

  borderRadius: {
    none: "0",
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },

  transitions: {
    fast: "150ms ease-in-out",
    normal: "300ms ease-in-out",
    slow: "500ms ease-in-out",
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Component-specific styles - All use the 4 colors
  components: {
    header: {
      height: "80px",
      background: "var(--background-light)",
      borderBottom: "1px solid var(--background-light)",
    },
    footer: {
      background: "var(--background-light)",
      textColor: "var(--text-light)",
    },
    button: {
      primary: {
        background: "var(--primary-light)",
        backgroundHover: "var(--primary-light)",
        backgroundActive: "var(--primary-light)",
        textColor: COLORS_LIGHT.background,
        shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        shadowHover: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      },
      secondary: {
        background: "var(--secondary-light)",
        backgroundHover: "var(--secondary-light)",
        backgroundActive: "var(--secondary-light)",
        textColor: COLORS_LIGHT.background,
        shadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        shadowHover: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
      outline: {
        border: "2px solid var(--secondary-light)",
        background: "transparent",
        textColor: "var(--secondary-light)",
        backgroundHover: "var(--background-light)",
        borderHover: "2px solid var(--secondary-light)",
      },
    },
    input: {
      background: "var(--background-light)",
      border: "1px solid var(--secondary-light)",
      borderFocus: "1px solid var(--primary-light)",
      textColor: "var(--text-light)",
    },
    card: {
      background: "var(--background-light)",
      border: "1px solid var(--secondary-light)",
      borderHover: "1px solid var(--secondary-light)",
      shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      shadowHover: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      borderRadius: "1rem",
      padding: "2rem",
    },
    appleCard: {
      background: "var(--background-light)",
      border: "1px solid var(--secondary-light)",
      borderHover: "1px solid var(--secondary-light)",
      borderRadius: "1.5rem",
      shadow: "none",
      shadowHover: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)",
      padding: "2rem",
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    blogCard: {
      background: "var(--background-light)",
      titleColor: "var(--text-light)",
      titleHoverColor: "var(--primary-light)",
      metaColor: "var(--secondary-light)",
      descriptionColor: "var(--secondary-light)",
      imageHeight: "192px",
      borderRadius: "0.5rem",
      shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      shadowHover: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    },
    cta: {
      background: "var(--primary-light)",
      backgroundHover: "var(--primary-light)",
      textColor: COLORS_LIGHT.background,
      buttonBackground: "var(--background-light)",
      buttonTextColor: "var(--primary-light)",
      buttonHoverBackground: "var(--background-light)",
    },
    section: {
      white: {
        background: "var(--background-light)",
        textColor: "var(--text-light)",
        subtextColor: "var(--secondary-light)",
      },
      gray: {
        background: "var(--section-gray)",
        textColor: "var(--text-light)",
        subtextColor: "var(--secondary-light)",
      },
      dark: {
        background: "var(--background-light)",
        textColor: "var(--text-light)",
        subtextColor: "var(--secondary-light)",
      },
      paddingSm: "3rem",
      paddingMd: "4rem",
      paddingLg: "6rem",
      paddingXl: "8rem",
    },
    hero: {
      minHeight: "100vh",
      background: "var(--background-light)",
      overlayColor: "rgba(0, 0, 0, 0.2)",
      overlayOpacity: 0.2,
      titleColor: "var(--text-light)",
      subtitleColor: "var(--secondary-light)",
      animationDuration: "0.8s",
      animationEasing: "ease-out",
    },
  },
};

// Typography size classes - single source of truth
export const typographySizes = {
  pageTitle: "text-4xl sm:text-5xl",
  sectionHeading: "text-2xl sm:text-3xl",
  subheading: "text-xl sm:text-2xl",
  paragraph: "text-lg",
  small: "text-sm",
  caption: "text-xs",
};

// CSS class name builders
export const classNames = {
  heading1: "text-5xl font-bold",
  heading2: "text-4xl font-bold",
  heading3: "text-3xl font-bold",
  heading4: "text-2xl font-semibold",
  heading5: "text-xl font-semibold",
  heading6: "text-lg font-semibold",

  body: "text-lg",
  bodyMuted: "text-base",
  small: "text-sm",
  caption: "text-xs",

  link: "font-medium hover:underline transition-colors",
  linkLight: "transition-colors",

  buttonPrimary: "px-6 py-2 font-semibold rounded-lg transition-colors",
  buttonSecondary: "px-6 py-2 font-semibold rounded-lg transition-colors",

  card: "rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow",
  cardBorder: "rounded-lg border p-6",

  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  sectionContainer: "max-w-4xl mx-auto px-4",

  heroSection: "py-16 px-4",
  sectionPadding: "py-16",

  gridCols1: "grid grid-cols-1",
  gridCols2: "grid grid-cols-1 md:grid-cols-2",
  gridCols3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  gridCols4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4",

  spacingY: "space-y-6",
  spacingX: "space-x-4",

  borderBottom: "border-b",
  borderTop: "border-t",
  divider: "border-b",

  blogGrid: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
  blogCard: "flex flex-col rounded-lg shadow hover:shadow-lg transition overflow-hidden h-full",
  blogImageContainer: "w-full h-40 overflow-hidden flex-shrink-0",
  blogImage: "w-full h-full object-cover hover:scale-105 transition-transform duration-300",
  blogCardContent: "p-5 flex-grow flex flex-col",
  blogMeta: "text-xs mb-2",
  blogTitle: "text-base font-bold mb-2",
  blogTitleHover: "hover:text-blue-600 transition",
  blogDescription: "text-sm",

  ctaSection: "p-8 rounded-lg text-center mt-12",
  ctaHeading: "text-3xl font-bold mb-4",
  ctaText: "text-xl mb-6",
  ctaButton: "inline-block px-8 py-3 rounded-lg font-semibold transition",

  pageHeader: "mb-12",
  pageTitle: "text-4xl font-bold mb-4",
  pageSubtitle: "text-xl",
};
