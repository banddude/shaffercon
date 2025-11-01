import Header from "./Header";
import { getSiteConfig, getMenuStructure } from "@/lib/db";

export default function HeaderWrapper() {
  const siteConfig = getSiteConfig();
  const menuData = getMenuStructure();

  return <Header menuData={menuData} siteConfig={siteConfig} />;
}
