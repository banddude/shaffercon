import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { classNames, theme } from "@/app/styles/theme";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const db = getDb();
  const posts = db.prepare(`
    SELECT slug FROM posts
  `).all() as Array<{ slug: string }>;

  return posts.map(({ slug }) => ({
    slug,
  }));
}

// Get blog post data
async function getBlogPost(slug: string) {
  const db = getDb();
  const post = db.prepare(`
    SELECT id, slug, title, date, markdown, meta_title, meta_description, canonical_url, og_image
    FROM posts
    WHERE slug = ?
  `).get(slug) as any;

  // The hero image is now embedded in the markdown as ![title](url)
  // We don't need to handle it separately unless we want to extract it for meta tags

  return post;
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

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || '',
    openGraph: post.og_image
      ? {
          images: [post.og_image],
        }
      : undefined,
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

  return (
    <div className={classNames.container + " py-12"}>
      <article className="max-w-4xl mx-auto">
        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-xl font-bold mb-3" style={{ color: theme.colors.text.primary }}>{post.title}</h1>
          <div className="text-sm mb-6" style={{ color: theme.colors.text.secondary }}>
            <time dateTime={post.date}>{postDate}</time>
          </div>

          {/* Hero Image */}
          {post.og_image && (
            <img
              src={post.og_image}
              alt={post.title}
              className="w-full h-auto rounded-lg"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          )}
        </header>

        {/* Post Content - Styled Markdown */}
        <div
          className="prose prose-lg max-w-none mb-12"
          style={{
            color: theme.colors.text.primary,
            lineHeight: '1.8',
          }}
        >
          <ReactMarkdown
            components={{
              h1: () => null, // Skip H1 since we show title in header
              h2: ({ children }) => <h2 className="text-lg font-bold mt-6 mb-2" style={{ color: theme.colors.text.primary }}>{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-semibold mt-5 mb-2" style={{ color: theme.colors.text.primary }}>{children}</h3>,
              h4: ({ children }) => <h4 className="text-sm font-semibold mt-4 mb-1" style={{ color: theme.colors.text.primary }}>{children}</h4>,
              h5: ({ children }) => <h5 className="text-sm font-semibold mt-3 mb-1" style={{ color: theme.colors.text.primary }}>{children}</h5>,
              h6: ({ children }) => <h6 className="text-xs font-semibold mt-2 mb-1" style={{ color: theme.colors.text.primary }}>{children}</h6>,
              p: ({ children }) => <p className="mb-3" style={{ fontSize: '0.9375rem', lineHeight: '1.6' }}>{children}</p>,
              ul: ({ children }) => <ul className="mb-4 ml-5 space-y-1 list-disc">{children}</ul>,
              ol: ({ children }) => <ol className="mb-4 ml-5 space-y-1 list-decimal">{children}</ol>,
              li: ({ children }) => <li className="pl-1" style={{ fontSize: '0.9375rem' }}>{children}</li>,
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="underline hover:no-underline"
                  style={{ color: theme.colors.primary.main }}
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote
                  className="border-l-4 pl-6 py-2 my-6 italic"
                  style={{
                    borderColor: theme.colors.primary.main,
                    background: theme.colors.neutral[50],
                  }}
                >
                  {children}
                </blockquote>
              ),
              img: ({ src }) => {
                // Skip the hero image since we show it in the header
                if (src === post.og_image) return null;
                // Render other images in the content
                return (
                  <img
                    src={src}
                    alt=""
                    className="w-full h-auto rounded-lg my-8"
                    style={{ maxHeight: '600px', objectFit: 'cover' }}
                  />
                );
              },
            }}
          >
            {post.markdown || ''}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
