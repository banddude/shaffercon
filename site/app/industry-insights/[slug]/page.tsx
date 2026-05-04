import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { classNames } from "@/app/styles/theme";
import { PageTitle } from "@/app/components/UI";
import { ArticleSchema } from "@/app/components/schemas/ArticleSchema";
import { LocalBusinessSchema } from "@/app/components/schemas/LocalBusinessSchema";
import { BreadcrumbSchema } from "@/app/components/schemas/BreadcrumbSchema";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { ArrowRight, Phone } from "lucide-react";

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

function getPostCTA(post: Awaited<ReturnType<typeof getBlogPost>>) {
  if (!post) return null;

  const text = `${post.slug} ${post.title}`.toLowerCase();

  if (/(panel|subpanel|zinsco|federal-pacific|fpe|service-upgrade)/.test(text)) {
    return {
      heading: "Need a panel upgrade or replacement in Los Angeles?",
      body: "Shaffer Construction handles panel replacements, subpanels, service upgrades, load calculations, permits, utility coordination, and final inspection.",
      href: "/service-areas/hollywood/residential-electrical-panel-upgrades/",
      label: "View panel upgrade service",
    };
  }

  if (/(permit|inspection|title 24|title-24|code|ladbs|compliance|correction)/.test(text)) {
    return {
      heading: "Need help with permits, code corrections, or inspection?",
      body: "We help Los Angeles homeowners, property managers, and businesses get electrical work permitted, corrected, inspected, and completed safely.",
      href: "/contact-us/",
      label: "Get permit help",
    };
  }

  if (/(lighting|recessed|led|retrofit)/.test(text)) {
    return {
      heading: "Planning lighting or LED retrofit work?",
      body: "Shaffer Construction installs recessed lighting, commercial lighting upgrades, LED retrofits, controls, and code compliant wiring across Los Angeles.",
      href: "/led-retrofit-services/",
      label: "View lighting services",
    };
  }

  if (/(ev|charger|charging|load study|load-study)/.test(text)) {
    return {
      heading: "Need EV charger installation or a load study?",
      body: "We plan, permit, and install residential and commercial EV charging systems with panel checks, load studies, and inspection support.",
      href: "/commercial-electric-vehicle-chargers/",
      label: "View EV charging services",
    };
  }

  return {
    heading: "Need electrical work in Los Angeles?",
    body: "Shaffer Construction provides licensed residential and commercial electrical service, from troubleshooting and upgrades to permitted installation work.",
    href: "/contact-us/",
    label: "Request a quote",
  };
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
  const cta = getPostCTA(post);

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

        {cta && (
          <aside
            className="rounded-lg p-6 sm:p-8 mb-12"
            style={{
              background: "var(--section-gray)",
              border: "1px solid var(--section-border)",
            }}
          >
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text)" }}>
              {cta.heading}
            </h2>
            <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--secondary)" }}>
              {cta.body}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+13236428509"
                className="inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition-opacity"
                style={{
                  borderColor: "var(--primary)",
                  color: "var(--primary)",
                }}
              >
                <Phone className="h-4 w-4" />
                Call (323) 642-8509
              </a>
              <Link
                href={cta.href}
                className="inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition-opacity"
                style={{
                  borderColor: "var(--section-border)",
                  color: "var(--text)",
                }}
              >
                {cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        )}
      </article>
    </div>
  );
}
