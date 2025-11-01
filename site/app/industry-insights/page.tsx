import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { classNames, theme } from "@/app/styles/theme";
import CTA from "@/app/components/CTA";

// Get all blog posts
async function getAllPosts() {
  const db = getDb();
  const posts = db.prepare(`
    SELECT id, slug, title, date, meta_description, og_image
    FROM posts
    ORDER BY date DESC
  `).all() as Array<{
    id: number;
    slug: string;
    title: string;
    date: string;
    meta_description: string | null;
    og_image: string | null;
  }>;

  return posts;
}

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Industry Insights | Shaffer Construction, Inc.",
    description: "Stay informed with the latest news, trends, and insights in electrical services, EV charging, and construction industry from Shaffer Construction.",
  };
}

// Page component
export default async function IndustryInsightsPage() {
  const posts = await getAllPosts();

  return (
    <div className={classNames.container + " py-8"}>
      <div className={classNames.pageHeader}>
        <h1 className={classNames.pageTitle}>Industry Insights</h1>
        <p className={classNames.pageSubtitle} style={{ color: theme.colors.text.secondary }}>
          Stay informed with the latest news, trends, and insights in electrical services, EV charging, and the construction industry.
        </p>
      </div>

      {/* Blog Posts Grid */}
      <div className={classNames.blogGrid}>
        {posts.map((post) => {
          const postDate = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          return (
            <Link
              key={post.id}
              href={`/industry-insights/${post.slug}`}
              className={classNames.blogCard}
            >
              {/* Hero Image */}
              {post.og_image && (
                <div className={classNames.blogImageContainer}>
                  <img
                    src={post.og_image}
                    alt={post.title}
                    className={classNames.blogImage}
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
                {post.meta_description && (
                  <p className={classNames.blogDescription} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.meta_description}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <CTA
        heading="Ready to Get Started?"
        text="Contact us today for expert electrical services!"
        buttonText="Contact Us"
        buttonHref="/contact-us"
      />
    </div>
  );
}
