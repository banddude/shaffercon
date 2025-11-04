import type { Metadata } from "next";
import "./globals.css";
import HeaderWrapper from "@/app/components/HeaderWrapper";
import FooterWrapper from "@/app/components/FooterWrapper";
import { theme } from "@/app/styles/theme";

export const metadata: Metadata = {
  title: "Shaffer Construction",
  description: "Los Angeles electrical contractor specializing in EV charging installation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
