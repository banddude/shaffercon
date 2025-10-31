import Database from "better-sqlite3";
import path from "path";

let db: Database.Database | null = null;

export function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), "data", "site.db");
    db = new Database(dbPath, { readonly: true });
  }
  return db;
}

export interface PageRow {
  id: number;
  date: string;
  slug: string;
  title: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  schema_json: string | null;
  yoast_json: string | null;
  parsed_content: string;
}

export interface PostRow {
  id: number;
  date: string;
  slug: string;
  title: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  schema_json: string | null;
  yoast_json: string | null;
  parsed_content: string;
}

export interface ParsedContent {
  page_type: string;
  slug: string;
  headings: Array<{ level: string; text: string }>;
  all_text_content: string[];
  lists: Array<{ type: string; items: string[] }>;
  images: Array<{ src: string; alt: string }>;
  links: Array<{ href: string; text: string }>;
}

export interface PageSection {
  id: number;
  page_id: number;
  section_type: string;
  heading: string | null;
  content: string | null;
  section_order: number;
}

export interface FormField {
  id: number;
  section_id: number;
  field_name: string;
  field_type: string | null;
  field_order: number;
}

export default db;
