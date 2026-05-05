import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { classNames } from "@/app/styles/theme";
import CTA from "@/app/components/CTA";
import { Section, Container, PageTitle } from "@/app/components/UI";
import { getAllPosts } from "@/lib/blog";
import { BreadcrumbSchema } from "@/app/components/schemas/BreadcrumbSchema";
import { ArrowLeft, ArrowRight } from "lucide-react";

const POSTS_PER_PAGE = 24;

interface PageProps {
  params: Promise<{ pageNumber: string }>;
}

// Pre-generate every page-N route at build time
export async function generateStaticParams() {
  const posts = getAllPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  // Pages 2..N (page 1 is at /industry-insights/)
  const params: { pageNumber: string }[] = [];
  for (let i = 2; i <= totalPages; i++) {
    params.push({ pageNumber: String(i) });
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pageNumber } = await params;
  const n = parseInt(pageNumber, 10);
  return {
    title: `Industry Insights, Page ${n}`,
    alternates: {
      canonical: `https://shaffercon.com/industry-insights/page/${n}/`,
    },
    description: `Page ${n} of Shaffer Construction's industry insights: electrical services, EV charging, and construction industry news.`,
    // Don't index page 2+; they're for crawl/UX, not landing pages
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function IndustryInsightsPaginatedPage({ params }: PageProps) {
  const { pageNumber } = await params;
  const n = parseInt(pageNumber, 10);
  if (Number.isNaN(n) || n < 2) notFound();

  const posts = getAllPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  if (n > totalPages) notFound();

  const start = (n - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const visiblePosts = posts.slice(start, end);
  const isFirst = n === 1;
  const isLast = n === totalPages;
  const prevHref = n === 2 ? "/industry-insights/" : `/industry-insights/page/${n - 1}/`;
  const nextHref = `/industry-insights/page/${n + 1}/`;

  return (
    <main className="w-full">
      <BreadcrumbSchema items={[
        { label: "Home", href: "/" },
        { label: "Industry Insights", href: "/industry-insights" },
        { label: `Page ${n}` },
      ]} />

      {/* Hero Section */}
      <Section border="bottom" padding="lg">
        <Container maxWidth="lg">
          <PageTitle>Industry Insights, Page {n}</PageTitle>
          <p className="text-lg mt-4" style={{ color: "var(--secondary)" }}>
            Page {n} of {totalPages}. Browse all of Shaffer Construction's articles on electrical services, EV charging, and construction industry news.
          </p>
        </Container>
      </Section>

      {/* Blog Posts Grid */}
      <Section padding="lg">
        <Container maxWidth="lg">
          <div className={classNames.blogGrid}>
            {visiblePosts.map((post) => {
              const postDate = new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              return (
                <Link
                  key={post.slug}
                  href={`/industry-insights/${post.slug}/`}
                  className={classNames.blogCard}
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--section-border)",
                  }}
                >
                  {post.ogImage && (
                    <div className={classNames.blogImageContainer}>
                      <img
                        src={post.ogImage}
                        alt={post.title}
                        className={classNames.blogImage}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className={classNames.blogCardContent}>
                    <div className={classNames.blogMeta} style={{ color: "var(--secondary)" }}>
                      <time>{postDate}</time>
                    </div>
                    <h2 className={`${classNames.blogTitle} ${classNames.blogTitleHover} overflow-hidden`} style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', color: "var(--text)" }}>
                      {post.title}
                    </h2>
                    {post.metaDescription && (
                      <p className={classNames.blogDescription} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: "var(--secondary)" }}>{post.metaDescription}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          <nav aria-label="Blog pagination" className="mt-12 flex items-center justify-center gap-2 flex-wrap">
            {!isFirst && (
              <Link
                href={prevHref}
                className="px-4 py-2 rounded-full font-semibold transition-colors"
                style={{
                  background: "var(--background)",
                  color: "var(--text)",
                  border: "2px solid var(--primary)",
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Prev
                </span>
              </Link>
            )}
            <span className="px-4 text-sm opacity-70">Page {n} of {totalPages}</span>
            {!isLast && (
              <Link
                href={nextHref}
                className="px-4 py-2 rounded-full font-semibold transition-colors"
                style={{
                  background: "var(--primary)",
                  color: "var(--background)",
                  border: "2px solid var(--background)",
                }}
              >
                <span className="inline-flex items-center gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            )}
          </nav>
        </Container>
      </Section>

      <CTA
        heading="Ready to Get Started?"
        text="Contact us today for expert electrical services!"
        buttonText="Contact Us"
        buttonHref="/contact-us"
      />
    </main>
  );
}
