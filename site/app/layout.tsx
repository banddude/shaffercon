import type { Metadata, Viewport } from "next";
import "./globals.css";
import HeaderWrapper from "@/app/components/HeaderWrapper";
import FooterWrapper from "@/app/components/FooterWrapper";
import { theme } from "@/app/styles/theme";
import { LocalBusinessSchema } from "@/app/components/StructuredData";
import { Analytics } from "@/app/components/Analytics";
import { SearchConsoleVerification } from "@/app/components/SearchConsoleVerification";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Shaffer Construction",
  description: "Los Angeles electrical contractor specializing in EV charging installation",
  icons: {
    icon: "/shaffercon/images/shaffer-logo-mini.png",
    apple: "/shaffercon/images/shaffer-logo-mini.png",
  },
  openGraph: {
    title: "Shaffer Construction",
    description: "Los Angeles electrical contractor specializing in EV charging installation",
    images: [
      {
        url: "https://shaffercon.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shaffer Construction",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shaffer Construction",
    description: "Los Angeles electrical contractor specializing in EV charging installation",
    images: ["https://shaffercon.com/og-image.jpg"],
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
        <link rel="alternate" type="application/rss+xml" title="Shaffer Construction - Industry Insights" href="/shaffercon/rss.xml" />

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
      </body>
    </html>
  );
}
