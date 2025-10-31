import { getDb, type PageRow, type PostRow, type ParsedContent, type PageSection } from "./db";

export interface Page {
  id: number;
  slug: string;
  title: string;
  date: string;
  content: ParsedContent;
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    ogImage: string | null;
    schemaJson: any | null;
    yoastJson: any | null;
  };
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  date: string;
  content: ParsedContent;
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    ogImage: string | null;
    schemaJson: any | null;
    yoastJson: any | null;
  };
}

function rowToPage(row: PageRow): Page {
  const parsed = JSON.parse(row.parsed_content) as ParsedContent;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.date,
    content: parsed,
    seo: {
      metaTitle: row.meta_title || row.title,
      metaDescription: row.meta_description || "",
      canonicalUrl: row.canonical_url || "",
      ogImage: row.og_image,
      schemaJson: row.schema_json ? JSON.parse(row.schema_json) : null,
      yoastJson: row.yoast_json ? JSON.parse(row.yoast_json) : null,
    },
  };
}

function rowToPost(row: PostRow): Post {
  const parsed = JSON.parse(row.parsed_content) as ParsedContent;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.date,
    content: parsed,
    seo: {
      metaTitle: row.meta_title || row.title,
      metaDescription: row.meta_description || "",
      canonicalUrl: row.canonical_url || "",
      ogImage: row.og_image,
      schemaJson: row.schema_json ? JSON.parse(row.schema_json) : null,
      yoastJson: row.yoast_json ? JSON.parse(row.yoast_json) : null,
    },
  };
}

export function getAllPages(): Page[] {
  const database = getDb();
  const rows = database.prepare("SELECT * FROM pages_all").all() as PageRow[];
  return rows.map(rowToPage);
}

export function getAllPosts(): Post[] {
  const database = getDb();
  const rows = database.prepare("SELECT * FROM posts").all() as PostRow[];
  return rows.map(rowToPost);
}

export function getPageBySlug(slug: string): Page | null {
  const database = getDb();
  const row = database
    .prepare("SELECT * FROM pages_all WHERE slug = ?")
    .get(slug) as PageRow | undefined;

  return row ? rowToPage(row) : null;
}

export function getPostBySlug(slug: string): Post | null {
  const database = getDb();
  const row = database
    .prepare("SELECT * FROM posts WHERE slug = ?")
    .get(slug) as PostRow | undefined;

  return row ? rowToPost(row) : null;
}

export function getAllPageSlugs(): string[] {
  const database = getDb();
  const rows = database
    .prepare("SELECT slug FROM pages_all")
    .all() as { slug: string }[];
  return rows.map((row) => row.slug);
}

export function getAllPostSlugs(): string[] {
  const database = getDb();
  const rows = database
    .prepare("SELECT slug FROM posts")
    .all() as { slug: string }[];
  return rows.map((row) => row.slug);
}

// Get page by path (handles nested paths like "service-areas/hollywood")
export function getPageByPath(path: string): Page | null {
  const segments = path.split("/").filter(Boolean);
  const slug = segments[segments.length - 1];
  return getPageBySlug(slug);
}

// Get posts by category
export function getPostsByCategory(category: string): Post[] {
  // This would require adding a category field to the posts table
  // For now, return all posts
  return getAllPosts();
}

// Get page sections (for structured pages like contact)
export function getPageSections(pageId: number): PageSection[] {
  const database = getDb();
  const rows = database
    .prepare("SELECT * FROM page_sections WHERE page_id = ? ORDER BY section_order")
    .all(pageId) as PageSection[];
  return rows;
}
