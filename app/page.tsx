import { getPageBySlug } from "@/lib/pages";
import PageTemplate from "@/app/components/templates/PageTemplate";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug("home");

  if (!page) {
    return {
      title: "Home",
    };
  }

  return {
    title: page.seo.metaTitle,
    description: page.seo.metaDescription,
    openGraph: page.seo.ogImage
      ? {
          images: [page.seo.ogImage],
        }
      : undefined,
  };
}

export default async function Home() {
  const page = getPageBySlug("home");

  if (!page) {
    notFound();
  }

  return <PageTemplate page={page} />;
}
