import Database from "better-sqlite3";
import path from "path";

let db: Database.Database | null = null;

export function getDb() {
  if (!db) {
    // Use absolute path to database
    const dbPath = path.resolve(process.cwd(), "..", "database", "data", "site.db");
    try {
      db = new Database(dbPath, { readonly: true });
    } catch (error) {
      console.error("Failed to open database at:", dbPath);
      console.error("Current working directory:", process.cwd());
      throw error;
    }
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

export interface SiteConfig {
  siteName: string;
  logoUrl: string;
  tagline: string | null;
  description: string | null;
  contact: {
    phone: string;
    email: string;
    address: {
      street: string | null;
      city: string | null;
      state: string | null;
      zip: string | null;
    };
    workingHours: string | null;
  };
  business: {
    license: string | null;
    licenses: string[];
    serviceArea: string | null;
  };
  social: {
    facebook: string | null;
    instagram: string | null;
  };
}

export interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}

export interface MenuStructure {
  primaryMenu: MenuItem[];
  phone: string;
}

export function getSiteConfig(): SiteConfig {
  const db = getDb();

  const config = db.prepare(`
    SELECT * FROM site_config WHERE id = 1
  `).get() as any;

  const licenses = db.prepare(`
    SELECT license_text FROM licenses ORDER BY display_order
  `).all() as any[];

  return {
    siteName: config.site_name,
    logoUrl: config.logo_url,
    tagline: config.tagline,
    description: config.description,
    contact: {
      phone: config.phone,
      email: config.email,
      address: {
        street: config.address_street,
        city: config.address_city,
        state: config.address_state,
        zip: config.address_zip,
      },
      workingHours: config.working_hours,
    },
    business: {
      license: config.license_text,
      licenses: licenses.map((l) => l.license_text),
      serviceArea: config.service_area,
    },
    social: {
      facebook: config.facebook_url,
      instagram: config.instagram_url,
    },
  };
}

export function getMenuStructure(): MenuStructure {
  const db = getDb();

  const allItems = db.prepare(`
    SELECT id, label, href, parent_id, display_order
    FROM menu_items
    ORDER BY display_order
  `).all() as any[];

  // Get top-level items (no parent)
  const topLevel = allItems.filter((item) => item.parent_id === null);

  // Build menu structure with children
  const primaryMenu: MenuItem[] = topLevel.map((item) => {
    const children = allItems
      .filter((child) => child.parent_id === item.id)
      .map((child) => ({
        label: child.label,
        href: child.href,
      }));

    return {
      label: item.label,
      href: item.href,
      ...(children.length > 0 && { children }),
    };
  });

  const config = db.prepare(`SELECT phone FROM site_config WHERE id = 1`).get() as any;

  return {
    primaryMenu,
    phone: config.phone,
  };
}

export default db;
