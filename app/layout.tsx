import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { theme } from "./styles/theme";

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
        className="flex flex-col min-h-screen"
        style={{
          background: theme.colors.background.light,
          color: theme.colors.text.primary,
        }}
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
