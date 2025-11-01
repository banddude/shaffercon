import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "site.db");
const db = new Database(dbPath);

console.log("Starting database cleanup...\n");

const tables = ["pages", "pages_all", "posts", "pages_backup"];

for (const table of tables) {
  try {
    const tableExists = db
      .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`)
      .get(table);

    if (!tableExists) {
      console.log(`⊘ Table '${table}' does not exist, skipping...`);
      continue;
    }

    const columns = db.pragma(`table_info(${table})`) as any[];
    const hasContent = columns.some((col: any) => col.name === "content");
    const hasData = columns.some((col: any) => col.name === "data");

    if (!hasContent && !hasData) {
      console.log(`✓ Table '${table}' already cleaned up`);
      continue;
    }

    console.log(`⟳ Cleaning up table '${table}'...`);

    const allColumns = columns
      .filter((col: any) => col.name !== "content" && col.name !== "data")
      .map((col: any) => col.name);

    const columnsList = allColumns.join(", ");

    const tableSchema = db
      .prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`)
      .get(table) as any;

    if (!tableSchema) {
      console.log(`✗ Could not get schema for table '${table}'`);
      continue;
    }

    const tempTableName = `${table}_temp`;
    let newSchema = tableSchema.sql
      .replace(new RegExp(`CREATE TABLE[\\s\\S]*?"${table}"`, "i"), `CREATE TABLE "${tempTableName}"`)
      .replace(/,\s*content\s+TEXT/i, "")
      .replace(/,\s*data\s+TEXT/i, "");

    db.exec(newSchema);
    db.exec(`INSERT INTO "${tempTableName}" (${columnsList}) SELECT ${columnsList} FROM "${table}"`);
    db.exec(`DROP TABLE "${table}"`);
    db.exec(`ALTER TABLE "${tempTableName}" RENAME TO "${table}"`);

    console.log(`✓ Table '${table}' cleaned successfully`);
  } catch (error) {
    console.error(`✗ Error cleaning table '${table}':`, error);
  }
}

console.log("\n✓ Database cleanup complete!");
db.close();
