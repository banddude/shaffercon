import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { classNames } from "@/app/styles/theme";
import { PageTitle } from "@/app/components/UI";
import { ArticleSchema } from "@/app/components/schemas/ArticleSchema";
import { LocalBusinessSchema } from "@/app/components/schemas/LocalBusinessSchema";
import { BreadcrumbSchema } from "@/app/components/schemas/BreadcrumbSchema";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { ArrowLeft, ArrowRight, CalendarDays, Phone } from "lucide-react";

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
      links: [
        { href: "/electrical-load-studies/", label: "Electrical load studies" },
        { href: "/residential-ev-charger/", label: "Home EV charger installation" },
        { href: "/contact-us/", label: "Request a panel quote" },
      ],
    };
  }

  if (/(permit|inspection|title 24|title-24|code|ladbs|compliance|correction)/.test(text)) {
    return {
      heading: "Need help with permits, code corrections, or inspection?",
      body: "We help Los Angeles homeowners, property managers, and businesses get electrical work permitted, corrected, inspected, and completed safely.",
      href: "/contact-us/",
      label: "Get permit help",
      links: [
        { href: "/commercial-service/", label: "Commercial electrical service" },
        { href: "/electrical-load-studies/", label: "Load study reports" },
        { href: "/service-areas/", label: "Local service areas" },
      ],
    };
  }

  if (/(lighting|recessed|led|retrofit)/.test(text)) {
    return {
      heading: "Planning lighting or LED retrofit work?",
      body: "Shaffer Construction installs recessed lighting, commercial lighting upgrades, LED retrofits, controls, and code compliant wiring across Los Angeles.",
      href: "/led-retrofit-services/",
      label: "View lighting services",
      links: [
        { href: "/commercial-service/", label: "Commercial electrician" },
        { href: "/statewide-facilities-maintenance/", label: "Facilities maintenance" },
        { href: "/contact-us/", label: "Request a lighting quote" },
      ],
    };
  }

  if (/(ev|charger|charging|load study|load-study)/.test(text)) {
    return {
      heading: "Need EV charger installation or a load study?",
      body: "We plan, permit, and install residential and commercial EV charging systems with panel checks, load studies, and inspection support.",
      href: "/commercial-electric-vehicle-chargers/",
      label: "View EV charging services",
      links: [
        { href: "/residential-ev-charger/", label: "Home EV chargers" },
        { href: "/electrical-load-studies/", label: "EV load studies" },
        { href: "/contact-us/", label: "Request an EV quote" },
      ],
    };
  }

  return {
    heading: "Need electrical work in Los Angeles?",
    body: "Shaffer Construction provides licensed residential and commercial electrical service, from troubleshooting and upgrades to permitted installation work.",
    href: "/contact-us/",
    label: "Request a quote",
    links: [
      { href: "/commercial-service/", label: "Commercial electrician" },
      { href: "/residential-ev-charger/", label: "Home EV chargers" },
      { href: "/service-areas/", label: "Service areas" },
    ],
  };
}

function PostCTABox({
  cta,
  compact = false,
  className = "",
}: {
  cta: NonNullable<ReturnType<typeof getPostCTA>>;
  compact?: boolean;
  className?: string;
}) {
  return (
    <aside
      className={`rounded-lg ${compact ? "p-5 sm:p-6" : "p-6 sm:p-8"} ${className || (compact ? "mb-8" : "mb-12")}`}
      style={{
        background: "var(--section-gray)",
        border: "1px solid var(--section-border)",
      }}
    >
      <h2 className={`${compact ? "text-xl" : "text-2xl"} font-bold mb-3`} style={{ color: "var(--text)" }}>
        {cta.heading}
      </h2>
      <p className={`${compact ? "text-base" : "text-lg"} leading-relaxed mb-6`} style={{ color: "var(--secondary)" }}>
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
      {cta.links.length > 0 && (
        <div
          className={`mt-6 text-sm ${compact ? "flex flex-col gap-2" : "flex flex-wrap gap-x-4 gap-y-2"}`}
          style={{ color: "var(--secondary)" }}
        >
          <span className="font-semibold" style={{ color: "var(--text)" }}>
            Related services:
          </span>
          {cta.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="underline-offset-4 hover:underline"
              style={{ color: "var(--primary)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
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
    <div className={classNames.container + " py-10 sm:py-12 lg:py-16"}>
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
      <article className="max-w-6xl mx-auto">
        <header className="mb-10">
          <Link
            href="/industry-insights/"
            className="inline-flex items-center gap-2 text-sm font-semibold mb-6 underline-offset-4 hover:underline"
            style={{ color: "var(--primary)" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Industry Insights
          </Link>
          <PageTitle>{post.title}</PageTitle>
          <div className="mt-5 mb-7 inline-flex items-center gap-2 text-sm" style={{ color: "var(--secondary)" }}>
            <CalendarDays className="h-4 w-4" />
            <time dateTime={post.date}>{postDate}</time>
          </div>

          {post.ogImage && (
            <figure
              className="overflow-hidden rounded-lg"
              style={{ border: "1px solid var(--section-border)" }}
            >
              <img
                src={post.ogImage}
                alt={post.title}
                className="w-full h-auto"
                style={{ maxHeight: '520px', objectFit: 'cover' }}
              />
            </figure>
          )}
        </header>

        <div className="lg:hidden">
          {cta && <PostCTABox cta={cta} compact />}
        </div>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 xl:gap-12">
          <div className="min-w-0">
            <div
              className="industry-article mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {cta && <PostCTABox cta={cta} />}
          </div>

          {cta && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <PostCTABox cta={cta} compact className="mb-0" />
              </div>
            </aside>
          )}
        </div>
      </article>
    </div>
  );
}
