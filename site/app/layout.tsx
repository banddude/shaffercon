import type { Metadata, Viewport } from "next";
import "./globals.css";
import HeaderWrapper from "@/app/components/HeaderWrapper";
import FooterWrapper from "@/app/components/FooterWrapper";
import { theme } from "@/app/styles/theme";
import { LocalBusinessSchema } from "@/app/components/StructuredData";
import { Analytics } from "@/app/components/Analytics";
import { AnalyticsEvents } from "@/app/components/AnalyticsEvents";
import { SearchConsoleVerification } from "@/app/components/SearchConsoleVerification";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://shaffercon.com"),
  title: {
    default: "Shaffer Construction | Licensed Los Angeles Electrical & General Contractor",
    template: "%s | Shaffer Construction",
  },
  description:
    "Shaffer Construction is the premier licensed electrical and general contractor in Los Angeles. 15+ years, CSLB #994593. EV charging installation, Altadena & Pasadena fire rebuilds, residential & commercial electrical, load studies, LED retrofits, and statewide facilities service. Call (323) 642-8509.",
  applicationName: "Shaffer Construction",
  authors: [{ name: "Mike Shaffer", url: "https://shaffercon.com/about-us/" }],
  creator: "Mike Shaffer",
  publisher: "Shaffer Construction, Inc.",
  keywords: [
    "Los Angeles electrical contractor",
    "Los Angeles general contractor",
    "licensed electrician Los Angeles",
    "EV charger installation Los Angeles",
    "commercial EV charging",
    "residential EV charger installation",
    "Altadena fire rebuild",
    "Pasadena fire rebuild",
    "electrical load study",
    "LED retrofit Los Angeles",
    "statewide facilities maintenance California",
    "CSLB 994593",
    "Shaffer Construction",
    "Mike Shaffer electrician",
  ],
  category: "Electrical & General Contracting",
  alternates: {
    canonical: "https://shaffercon.com",
    types: {
      "application/rss+xml": [
        { url: "/rss.xml", title: "Shaffer Construction: Industry Insights" },
      ],
    },
  },
  icons: {
    icon: "/images/shaffer-logo-mini.png",
    apple: "/images/shaffer-logo-mini.png",
  },
  openGraph: {
    title: "Shaffer Construction | Licensed Los Angeles Electrical & General Contractor",
    description:
      "Premier licensed electrical and general contractor serving Los Angeles for 15+ years. CSLB #994593. EV charging, fire rebuilds, load studies, LED retrofits, statewide facilities.",
    url: "https://shaffercon.com",
    siteName: "Shaffer Construction",
    locale: "en_US",
    images: [
      {
        url: "https://shaffercon.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shaffer Construction: Licensed Los Angeles Electrical & General Contractor",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shaffer Construction | Licensed Los Angeles Electrical & General Contractor",
    description:
      "Premier licensed electrical & general contractor in Los Angeles. 15+ years, CSLB #994593. EV charging, fire rebuilds, load studies, LED retrofits.",
    images: ["https://shaffercon.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    other: {
      "geo.region": "US-CA",
      "geo.placename": "Los Angeles",
      "geo.position": "34.0736;-118.3215",
      ICBM: "34.0736, -118.3215",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" className="dark">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="Shaffer Construction - Industry Insights" href="/rss.xml" />

        <LocalBusinessSchema />
        <SearchConsoleVerification />
      </head>
      <body
        className="flex flex-col min-h-screen transition-colors duration-300"
        style={{
          background: "var(--background)",
          color: "var(--text)",
        }}
      >
        <HeaderWrapper />
        {children}
        <FooterWrapper />
        <Analytics />
        <AnalyticsEvents />
      </body>
    </html>
  );
}
