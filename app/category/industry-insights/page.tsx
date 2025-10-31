import Link from "next/link";
import { getAllPosts } from "@/lib/pages";
import type { Post } from "@/lib/pages";
import Image from "next/image";
import { classNames, theme } from "@/app/styles/theme";

export default function IndustryInsightsPage() {
  const posts = getAllPosts();

  return (
    <div>
      <header className="mb-12">
        <h1 className={classNames.heading2}>Industry Insights</h1>
        <p className="text-xl" style={{ color: theme.colors.text.secondary }}>
          Stay informed with the latest news and insights about EV charging infrastructure,
          electrical services, and industry trends.
        </p>
      </header>

      <div className={classNames.gridCols3 + " gap-8"}>
        {posts.map((post: Post, index: number) => {
          // Use existing images from WordPress content or fallback
          const heroImages = [
            "https://shaffercon.com/wp-content/uploads/2019/11/tesla-renewable-energy-640x471.jpg",
            "https://shaffercon.com/wp-content/uploads/2019/10/IMG_1633-640x471.jpeg",
            "https://shaffercon.com/wp-content/uploads/2019/11/3-640x480.jpg",
          ];
          const heroImage = post.content.images[0]?.src || heroImages[index % heroImages.length];

          const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return (
            <article key={post.id} className={classNames.card}>
              <Link href={`/blog/${post.slug}`} className="no-underline">
                <div className="aspect-video w-full overflow-hidden bg-gray-200 relative">
                  <Image
                    src={heroImage}
                    alt={post.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 text-gray-900 transition-colors" style={{ color: "inherit" }}>
                    {post.title}
                  </h2>
                  {post.seo.metaDescription && (
                    <p className={classNames.bodyMuted + " mb-4 line-clamp-3"}>
                      {post.seo.metaDescription}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: theme.colors.border }}>
                    <time className={classNames.small} dateTime={post.date}>
                      {formattedDate}
                    </time>
                    <span style={{ color: theme.colors.primary.main }} className="font-semibold">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
