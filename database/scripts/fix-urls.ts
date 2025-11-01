import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "site.db");
const db = new Database(dbPath);

console.log("Starting URL replacement...\n");

// Function to replace hardcoded URLs with relative URLs
function replaceUrls(content: string): string {
  // Replace https://shaffercon.com/ with / (root-relative)
  return content
    .replace(/https:\/\/shaffercon\.com\//g, '/')
    .replace(/http:\/\/shaffercon\.com\//g, '/');
}

// Update pages
console.log("Updating pages...");
const pages = db.prepare("SELECT id, content, data FROM pages").all() as Array<{
  id: number;
  content: string;
  data: string;
}>;

const updatePage = db.prepare(`
  UPDATE pages
  SET content = ?, data = ?
  WHERE id = ?
`);

let pagesUpdated = 0;
const updatePages = db.transaction(() => {
  for (const page of pages) {
    const originalData = JSON.parse(page.data);
    const updatedContent = replaceUrls(page.content);

    // Update the data object
    if (originalData.content?.rendered) {
      originalData.content.rendered = replaceUrls(originalData.content.rendered);
    }

    const updatedData = JSON.stringify(originalData);

    if (page.content !== updatedContent || page.data !== updatedData) {
      updatePage.run(updatedContent, updatedData, page.id);
      pagesUpdated++;
    }
  }
});

updatePages();
console.log(`✓ Updated ${pagesUpdated} pages`);

// Update posts
console.log("\nUpdating posts...");
const posts = db.prepare("SELECT id, content, data FROM posts").all() as Array<{
  id: number;
  content: string;
  data: string;
}>;

const updatePost = db.prepare(`
  UPDATE posts
  SET content = ?, data = ?
  WHERE id = ?
`);

let postsUpdated = 0;
const updatePosts = db.transaction(() => {
  for (const post of posts) {
    const originalData = JSON.parse(post.data);
    const updatedContent = replaceUrls(post.content);

    // Update the data object
    if (originalData.content?.rendered) {
      originalData.content.rendered = replaceUrls(originalData.content.rendered);
    }

    const updatedData = JSON.stringify(originalData);

    if (post.content !== updatedContent || post.data !== updatedData) {
      updatePost.run(updatedContent, updatedData, post.id);
      postsUpdated++;
    }
  }
});

updatePosts();
console.log(`✓ Updated ${postsUpdated} posts`);

console.log("\n=== URL Replacement Complete ===");
console.log(`Total pages updated: ${pagesUpdated}`);
console.log(`Total posts updated: ${postsUpdated}`);

db.close();
