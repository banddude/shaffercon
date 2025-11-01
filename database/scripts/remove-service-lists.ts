import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "site.db");
const db = new Database(dbPath);

console.log("Starting cleanup of hardcoded service lists...\n");

// Function to remove the residential and commercial service list sections
function removeServiceLists(content: string): string {
  let cleaned = content;

  // Remove the header + list pattern for Residential Services
  // This matches the header followed by the intro text and the full list
  cleaned = cleaned.replace(
    /<header[^>]*>[\s\S]*?Residential Services in[^<]*<\/header>[\s\S]*?<ul>[\s\S]*?<\/ul>/gi,
    ''
  );

  // Remove the header + list pattern for Commercial Services
  cleaned = cleaned.replace(
    /<header[^>]*>[\s\S]*?Commercial Services in[^<]*<\/header>[\s\S]*?<ul>[\s\S]*?<\/ul>/gi,
    ''
  );

  // Also remove any bt_bb_text divs that contain these service lists
  cleaned = cleaned.replace(
    /<div[^>]*class="bt_bb_text"[^>]*data-content="[^"]*(?:Residential|Commercial) Services[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    ''
  );

  // Remove standalone paragraphs and lists with service-areas links
  cleaned = cleaned.replace(
    /<p>Shaffer Construction provides expert (?:residential|commercial)[^<]*<\/p>\s*<ul>[\s\S]*?service-areas[\s\S]*?<\/ul>/gi,
    ''
  );

  return cleaned;
}

// Update service area pages (pages without slashes in slug)
console.log("Updating service area pages...");
const pages = db.prepare("SELECT id, slug, content, data FROM pages WHERE slug NOT LIKE '%/%'").all() as Array<{
  id: number;
  slug: string;
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
    const updatedContent = removeServiceLists(page.content);

    // Update the data object
    if (originalData.content?.rendered) {
      originalData.content.rendered = removeServiceLists(originalData.content.rendered);
    }

    const updatedData = JSON.stringify(originalData);

    if (page.content !== updatedContent || page.data !== updatedData) {
      updatePage.run(updatedContent, updatedData, page.id);
      console.log(`  ✓ Cleaned ${page.slug}`);
      pagesUpdated++;
    }
  }
});

updatePages();
console.log(`\n✓ Updated ${pagesUpdated} service area pages`);

console.log("\n=== Cleanup Complete ===");
console.log(`Service area pages cleaned: ${pagesUpdated}`);
console.log("Dynamic service links will now be generated from the database");

db.close();
