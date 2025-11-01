import Footer from "./Footer";
import { getSiteConfig } from "@/lib/db";

export default function FooterWrapper() {
  const siteConfig = getSiteConfig();

  return <Footer siteConfig={siteConfig} />;
}
