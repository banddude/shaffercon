import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { classNames } from "@/app/styles/theme";
import { PageTitle } from "@/app/components/UI";
import { ArticleSchema } from "@/app/components/schemas/ArticleSchema";
import { LocalBusinessSchema } from "@/app/components/schemas/LocalBusinessSchema";
import { BreadcrumbSchema } from "@/app/components/schemas/BreadcrumbSchema";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Get blog post data
async function getBlogPost(slug: string) {
  return getPostBySlug(slug);
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const baseUrl = 'https://shaffercon.com';
  const url = `${baseUrl}/industry-insights/${slug}`;
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || '';

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: post.canonicalUrl || url,
    },
    openGraph: {
      title,
      description,
      url: post.canonicalUrl || url,
      siteName: 'Shaffer Construction',
      locale: 'en_US',
      type: 'article',
      publishedTime: post.date,
      images: post.ogImage ? [post.ogImage] : [`${baseUrl}/og-image.jpg`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.ogImage ? [post.ogImage] : [`${baseUrl}/og-image.jpg`],
    },
  };
}

// Page component
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const postDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const baseUrl = 'https://shaffercon.com';
  const articleUrl = `${baseUrl}/industry-insights/${slug}`;

  return (
    <div className={classNames.container + " py-12"}>
      <ArticleSchema
        title={post.title}
        description={post.metaDescription || post.title}
        datePublished={post.date}
        image={post.ogImage}
        url={articleUrl}
      />
      <LocalBusinessSchema
        areaServed="Los Angeles"
        serviceUrl={articleUrl}
        services={["EV Charger Installation", "Electrical Services", "Load Study Services"]}
      />
      <BreadcrumbSchema
        items={[
          { label: "Home", href: "/" },
          { label: "Industry Insights", href: "/industry-insights" },
          { label: post.title }
        ]}
      />
      <article className="max-w-4xl mx-auto">
        {/* Post Header */}
        <header className="mb-8">
          <PageTitle>{post.title}</PageTitle>
          <div className="text-sm mb-6" style={{ color: "var(--secondary)" }}>
            <time dateTime={post.date}>{postDate}</time>
          </div>

          {/* Hero Image */}
          {post.ogImage && (
            <img
              src={post.ogImage}
              alt={post.title}
              className="w-full h-auto rounded-lg"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          )}
        </header>

        {/* Post Content - HTML */}
        <div
          className="prose prose-lg max-w-none mb-12"
          style={{
            color: "var(--secondary)",
            lineHeight: '1.8',
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
