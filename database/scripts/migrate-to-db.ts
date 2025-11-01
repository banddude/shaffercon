import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "data", "site.db");

// Remove existing database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log("Removed existing database");
}

const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY,
    date TEXT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT,
    content TEXT,
    data TEXT
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    date TEXT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT,
    content TEXT,
    data TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
  CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
`);

console.log("Created database schema");

// Import pages
const allPagesPath = path.join(process.cwd(), "data", "all_pages.json");
if (fs.existsSync(allPagesPath)) {
  console.log("Loading all_pages.json...");
  const pages = JSON.parse(fs.readFileSync(allPagesPath, "utf-8"));

  const insertPage = db.prepare(`
    INSERT OR REPLACE INTO pages (id, date, slug, title, content, data)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((pages: any[]) => {
    for (const page of pages) {
      insertPage.run(
        page.id,
        page.date,
        page.slug,
        JSON.stringify(page.title),
        JSON.stringify(page.content),
        JSON.stringify(page)
      );
    }
  });

  console.log(`Importing ${pages.length} pages...`);
  insertMany(pages);
  console.log(`✓ Imported ${pages.length} pages`);
} else {
  console.log("all_pages.json not found, skipping");
}

// Import posts
const allPostsPath = path.join(process.cwd(), "data", "all_posts.json");
if (fs.existsSync(allPostsPath)) {
  console.log("Loading all_posts.json...");
  const posts = JSON.parse(fs.readFileSync(allPostsPath, "utf-8"));

  const insertPost = db.prepare(`
    INSERT OR REPLACE INTO posts (id, date, slug, title, content, data)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((posts: any[]) => {
    for (const post of posts) {
      insertPost.run(
        post.id,
        post.date,
        post.slug,
        JSON.stringify(post.title),
        JSON.stringify(post.content),
        JSON.stringify(post)
      );
    }
  });

  console.log(`Importing ${posts.length} posts...`);
  insertMany(posts);
  console.log(`✓ Imported ${posts.length} posts`);
} else {
  console.log("all_posts.json not found, skipping");
}

// Print stats
const pageCount = db.prepare("SELECT COUNT(*) as count FROM pages").get() as { count: number };
const postCount = db.prepare("SELECT COUNT(*) as count FROM posts").get() as { count: number };

console.log("\n=== Migration Complete ===");
console.log(`Total pages: ${pageCount.count}`);
console.log(`Total posts: ${postCount.count}`);
console.log(`Database: ${dbPath}`);

db.close();
