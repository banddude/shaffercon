import fs from 'fs';
import path from 'path';

export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  content: string;
  filename?: string;
}

const contentDirectory = path.join(process.cwd(), '..', 'content', 'industry-insights');

/**
 * Get all blog post slugs for static generation
 */
export function getAllPostSlugs(): string[] {
  const files = fs.readdirSync(contentDirectory);
  return files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const content = fs.readFileSync(path.join(contentDirectory, file), 'utf8');
      const post = JSON.parse(content) as BlogPost;
      return post.slug;
    });
}

/**
 * Get a blog post by slug
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const files = fs.readdirSync(contentDirectory);

  for (const file of files) {
    if (!file.endsWith('.json')) continue;

    const content = fs.readFileSync(path.join(contentDirectory, file), 'utf8');
    const post = JSON.parse(content) as BlogPost;

    if (post.slug === slug) {
      return {
        ...post,
        filename: file,
      };
    }
  }

  return null;
}

/**
 * Get all blog posts sorted by date (newest first)
 */
export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(contentDirectory);

  const posts = files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const content = fs.readFileSync(path.join(contentDirectory, file), 'utf8');
      const post = JSON.parse(content) as BlogPost;
      return {
        ...post,
        filename: file,
      };
    });

  // Sort by date, newest first
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}
