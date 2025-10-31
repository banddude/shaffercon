/**
 * Theme configuration for Shaffer Construction
 * Centralized color scheme and styling constants
 */

export const theme = {
  colors: {
    primary: {
      light: "#3786C1", // Shaffer light blue (from logo)
      main: "#527EA2", // Shaffer medium blue (logo color - actual extracted)
      dark: "#3D5A7A", // Shaffer dark blue
      darker: "#2A3F52", // Shaffer darker blue
    },
    secondary: {
      light: "#0ea5e9", // sky-500
      main: "#0284c7", // sky-600
      dark: "#0369a1", // sky-700
    },
    neutral: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
    text: {
      primary: "#111827", // gray-900
      secondary: "#6b7280", // gray-500
      light: "#f3f4f6", // gray-100
      muted: "#9ca3af", // gray-400
    },
    background: {
      light: "#ffffff",
      subtle: "#f9fafb",
      dark: "#1f2937",
      darker: "#111827",
    },
    border: "#e5e7eb", // gray-200
    divider: "#d1d5db", // gray-300
  },

  typography: {
    fontFamily: {
      sans: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      mono: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
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
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "6rem", // 96px
  },

  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },

  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
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

  // Component-specific styles
  components: {
    header: {
      height: "80px",
      background: "#ffffff",
      borderBottom: "1px solid #e5e7eb",
    },
    footer: {
      background: "#1f2937",
      textColor: "#ffffff",
    },
    button: {
      primary: {
        background: "#527EA2",
        backgroundHover: "#3D5A7A",
        textColor: "#ffffff",
      },
      secondary: {
        background: "#e5e7eb",
        backgroundHover: "#d1d5db",
        textColor: "#111827",
      },
    },
    input: {
      background: "#ffffff",
      border: "1px solid #d1d5db",
      borderFocus: "1px solid #527EA2",
    },
    card: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
  },
};

// CSS class name builders
export const classNames = {
  // Typography
  heading1: "text-5xl font-bold text-gray-900",
  heading2: "text-4xl font-bold text-gray-900",
  heading3: "text-3xl font-bold text-gray-900",
  heading4: "text-2xl font-semibold text-gray-800",
  heading5: "text-xl font-semibold text-gray-800",
  heading6: "text-lg font-semibold text-gray-700",

  // Text
  body: "text-lg text-gray-700",
  bodyMuted: "text-gray-600",
  small: "text-sm text-gray-500",
  caption: "text-xs text-gray-400",

  // Links
  link: "font-medium hover:underline transition-colors",
  linkLight: "transition-colors",

  // Buttons
  buttonPrimary:
    "px-6 py-2 text-white font-semibold rounded-lg transition-colors",
  buttonSecondary:
    "px-6 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors",

  // Cards
  card: "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow",
  cardBorder: "bg-white rounded-lg border border-gray-200 p-6",

  // Containers
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  sectionContainer: "max-w-4xl mx-auto px-4",

  // Sections
  heroSection: "text-white py-16 px-4",
  sectionPadding: "py-16",

  // Grids
  gridCols1: "grid grid-cols-1",
  gridCols2: "grid grid-cols-1 md:grid-cols-2",
  gridCols3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  gridCols4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4",

  // Spacing utilities
  spacingY: "space-y-6",
  spacingX: "space-x-4",

  // Borders and dividers
  borderBottom: "border-b border-gray-200",
  borderTop: "border-t border-gray-200",
  divider: "border-b border-gray-300",
};
