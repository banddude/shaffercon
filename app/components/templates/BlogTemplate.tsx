"use client";

import type { Post } from "@/lib/pages";
import Image from "next/image";
import { classNames, theme } from "@/app/styles/theme";

interface BlogTemplateProps {
  post: Post;
}

export default function BlogTemplate({ post }: BlogTemplateProps) {
  const { content } = post;

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      {/* Hero Section with Featured Image */}
      {content.images.length > 0 && content.images[0] && (
        <div
          className="relative w-full h-96 sm:h-[500px] overflow-hidden"
          style={{
            background: `linear-gradient(to right, ${theme.colors.primary.main}, ${theme.colors.primary.darker})`,
          }}
        >
          <Image
            src={content.images[0].src}
            alt={content.images[0].alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white max-w-4xl mx-auto w-full">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{post.title}</h1>
            <time className="text-lg" style={{ color: theme.colors.neutral[200] }} dateTime={post.date}>
              {formattedDate}
            </time>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className={classNames.sectionContainer + " py-16"}>
        {/* Post Header */}
        {!content.images.length && (
          <header className="mb-12">
            <h1 className={classNames.heading1}>{post.title}</h1>
            <time className={classNames.bodyMuted + " text-lg"} dateTime={post.date}>
              {formattedDate}
            </time>
          </header>
        )}

        {/* Main Headings */}
        {content.headings.length > 0 && (
          <div className="mb-8">
            {content.headings.map((heading, idx) => {
              const HeadingTag = heading.level as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
              const headingNumber = heading.level.slice(1) as "1" | "2" | "3" | "4" | "5" | "6";
              const headingClass = classNames[`heading${headingNumber}` as keyof typeof classNames];
              return (
                <HeadingTag key={idx} className={headingClass}>
                  {heading.text}
                </HeadingTag>
              );
            })}
          </div>
        )}

        {/* Post Content */}
        {content.all_text_content.length > 0 && (
          <div className={classNames.spacingY}>
            {content.all_text_content.map((text, idx) => (
              <p key={idx} className={classNames.body}>
                {text}
              </p>
            ))}
          </div>
        )}

        {/* Lists */}
        {content.lists.length > 0 && (
          <div className="mb-12 space-y-8">
            {content.lists.map((list, idx) => {
              const ListTag = list.type as "ul" | "ol";
              return (
                <div key={idx}>
                  <ListTag className={`space-y-3 pl-6 ${list.type === "ol" ? "list-decimal" : "list-disc"}`}>
                    {list.items.map((item, itemIdx) => (
                      <li key={itemIdx} className={classNames.body}>
                        {item}
                      </li>
                    ))}
                  </ListTag>
                </div>
              );
            })}
          </div>
        )}

        {/* Additional Images */}
        {content.images.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {content.images.slice(1).map((image, idx) => (
              <div key={idx} className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        )}

        {/* Related Links */}
        {content.links.length > 0 && (
          <div className={`mt-12 pt-8 ${classNames.borderBottom}`}>
            <h3 className={classNames.heading3}>Related Resources</h3>
            <ul className={classNames.gridCols2 + " gap-4"}>
              {content.links.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className={classNames.link + " block p-3 rounded-lg transition-colors"}
                    style={{
                      color: theme.colors.primary.main,
                    }}
                  >
                    → {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </div>
  );
}
