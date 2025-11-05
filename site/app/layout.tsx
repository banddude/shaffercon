import type { Metadata } from "next";
import "./globals.css";
import HeaderWrapper from "@/app/components/HeaderWrapper";
import FooterWrapper from "@/app/components/FooterWrapper";
import { theme } from "@/app/styles/theme";

export const metadata: Metadata = {
  title: "Shaffer Construction",
  description: "Los Angeles electrical contractor specializing in EV charging installation",
  icons: {
    icon: "/shaffercon-migration/images/shaffer-logo-mini.png",
  },
  openGraph: {
    title: "Shaffer Construction",
    description: "Los Angeles electrical contractor specializing in EV charging installation",
    images: [
      {
        url: "/shaffercon-migration/brand-assets/Shaffer-Construction-Logo-light-mode.png",
        width: 1200,
        height: 630,
        alt: "Shaffer Construction Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shaffer Construction",
    description: "Los Angeles electrical contractor specializing in EV charging installation",
    images: ["/shaffercon-migration/brand-assets/Shaffer-Construction-Logo-light-mode.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
      </body>
    </html>
  );
}
