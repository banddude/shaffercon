import { notFound } from "next/navigation";
import { getPageBySlug, getPostBySlug, getAllPageSlugs, getAllPostSlugs } from "@/lib/pages";
import PageTemplate from "@/app/components/templates/PageTemplate";
import BlogTemplate from "@/app/components/templates/BlogTemplate";
import ContactTemplate from "@/app/components/templates/ContactTemplate";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

// Enable dynamic params to handle routes that aren't pre-generated
export const dynamicParams = true;

// Generate static paths for all pages and posts
export async function generateStaticParams() {
  const pageSlugs = getAllPageSlugs();
  const postSlugs = getAllPostSlugs();

  const pageParams = pageSlugs.map((slug) => ({
    slug: [slug],
  }));

  const postParams = postSlugs.map((slug) => ({
    slug: ["blog", slug],
  }));

  return [...pageParams, ...postParams];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lastSegment = slug[slug.length - 1];

  // Check if it's a blog post (either /blog/slug or /category/industry-insights/slug)
  const isBlog = slug[0] === "blog" || (slug[0] === "category" && slug[1] === "industry-insights" && slug.length > 2);

  if (isBlog) {
    const postSlug = slug[0] === "blog" ? slug[1] : slug[2];
    const post = getPostBySlug(postSlug);
    if (!post) {
      return {
        title: "Post Not Found",
      };
    }

    return {
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      openGraph: post.seo.ogImage
        ? {
            images: [post.seo.ogImage],
          }
        : undefined,
    };
  }

  // Regular page
  const page = getPageBySlug(lastSegment);
  if (!page) {
    return {
      title: "Page Not Found",
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

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const lastSegment = slug[slug.length - 1];

  // Check if it's a blog post (either /blog/slug or /category/industry-insights/slug)
  const isBlog = slug[0] === "blog" || (slug[0] === "category" && slug[1] === "industry-insights" && slug.length > 2);

  if (isBlog) {
    const postSlug = slug[0] === "blog" ? slug[1] : slug[2];
    const post = getPostBySlug(postSlug);
    if (!post) {
      notFound();
    }
    return <BlogTemplate post={post} />;
  }

  // Check for regular page
  const page = getPageBySlug(lastSegment);
  if (!page) {
    notFound();
  }

  // Use ContactTemplate for contact pages
  if (lastSegment === "contact-us" || lastSegment === "contact") {
    return <ContactTemplate page={page} />;
  }

  return <PageTemplate page={page} />;
}
