import type { Metadata } from "next";
import Link from "next/link";
import { classNames } from "@/app/styles/theme";
import CTA from "@/app/components/CTA";
import { Section, Container, PageTitle } from "@/app/components/UI";
import { getAllPosts } from "@/lib/blog";
import { BreadcrumbSchema } from "@/app/components/schemas/BreadcrumbSchema";

const POSTS_PER_PAGE = 24;

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Industry Insights, Electrical & EV Charging in LA",
    alternates: { canonical: "https://shaffercon.com/industry-insights/" },
    description: "Stay informed with the latest news, trends, and insights in electrical services, EV charging, and construction industry from Shaffer Construction.",
  };
}

// Page component - shows first POSTS_PER_PAGE posts
export default async function IndustryInsightsPage() {
  const posts = getAllPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const visiblePosts = posts.slice(0, POSTS_PER_PAGE);

  return (
    <main className="w-full">
      <BreadcrumbSchema items={[
        { label: "Home", href: "/" },
        { label: "Industry Insights" }
      ]} />
      {/* Hero Section */}
      <Section border="bottom" padding="lg">
        <Container maxWidth="lg">
          <PageTitle>Industry Insights</PageTitle>
          <p className="text-lg mt-4">
            Stay informed with the latest news, trends, and insights in electrical services, EV charging, and the construction industry.
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
                >
                  {/* Hero Image */}
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
                    <div className={classNames.blogMeta}>
                      <time>{postDate}</time>
                    </div>
                    <h2 className={`${classNames.blogTitle} ${classNames.blogTitleHover} overflow-hidden`} style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                      {post.title}
                    </h2>
                    {post.metaDescription && (
                      <p className={classNames.blogDescription} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.metaDescription}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Blog pagination" className="mt-12 flex items-center justify-center gap-2 flex-wrap">
              <span className="text-sm opacity-70">Page 1 of {totalPages}</span>
              <Link
                href="/industry-insights/page/2/"
                className="ml-4 px-4 py-2 rounded-full font-semibold transition-colors"
                style={{
                  background: "var(--primary)",
                  color: "#ffffff",
                  border: "2px solid var(--background)",
                }}
              >
                Next →
              </Link>
            </nav>
          )}
        </Container>
      </Section>

      {/* CTA */}
      <CTA
        heading="Ready to Get Started?"
        text="Contact us today for expert electrical services!"
        buttonText="Contact Us"
        buttonHref="/contact-us"
      />
    </main>
  );
}
