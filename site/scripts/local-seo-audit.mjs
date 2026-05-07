import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const scriptPath = fileURLToPath(import.meta.url);
const siteDir = path.resolve(path.dirname(scriptPath), "..");
const repoDir = path.resolve(siteDir, "..");
const db = new Database(path.join(repoDir, "database", "data", "site.db"), {
  readonly: true,
});

const locationRows = db
  .prepare(
    `
    SELECT lp.location_name, lp.location_slug, lp.city, lp.zip_code, lp.latitude, lp.longitude,
           lls.utility_name, lls.permit_office
    FROM location_pages lp
    LEFT JOIN location_local_seo lls ON lls.location_slug = lp.location_slug
    ORDER BY lp.location_name
  `,
  )
  .all();

const serviceCount = db
  .prepare(
    `
    SELECT COUNT(*) AS count
    FROM service_pages
  `,
  )
  .get().count;

const missingLocalProfiles = locationRows.filter((row) => !row.utility_name || !row.permit_office);
const missingGeo = locationRows.filter((row) => !row.city || !row.zip_code || !row.latitude || !row.longitude);

const locationTemplate = fs.readFileSync(
  path.join(siteDir, "app", "service-areas", "[location]", "page.tsx"),
  "utf8",
);
const serviceTemplate = fs.readFileSync(
  path.join(siteDir, "app", "service-areas", "[location]", "[service]", "page.tsx"),
  "utf8",
);
const schemaTemplate = fs.readFileSync(
  path.join(siteDir, "app", "components", "schemas", "LocalBusinessSchema.tsx"),
  "utf8",
);

const checks = [
  {
    label: "location pages render LocalProofSection",
    ok: locationTemplate.includes("LocalProofSection"),
  },
  {
    label: "service pages render LocalProofSection",
    ok: serviceTemplate.includes("LocalProofSection"),
  },
  {
    label: "LocalBusiness schema uses real office address",
    ok: schemaTemplate.includes("325 N Larchmont Blvd #202") && schemaTemplate.includes("addressLocality\": \"Los Angeles"),
  },
  {
    label: "LocalBusiness schema has no hard coded aggregateRating",
    ok: !schemaTemplate.includes("aggregateRating"),
  },
];

let warnings = 0;

console.log("Local SEO audit");
console.log(`Locations: ${locationRows.length}`);
console.log(`Service detail pages: ${serviceCount}`);
console.log(`Local SEO profile rows: ${locationRows.length - missingLocalProfiles.length}`);

for (const check of checks) {
  if (check.ok) {
    console.log(`OK: ${check.label}`);
  } else {
    warnings += 1;
    console.log(`WARN: ${check.label}`);
  }
}

if (missingLocalProfiles.length > 0) {
  warnings += missingLocalProfiles.length;
  console.log("WARN: missing local SEO profile rows");
  for (const row of missingLocalProfiles) {
    console.log(`  ${row.location_slug}: ${row.location_name}`);
  }
}

if (missingGeo.length > 0) {
  warnings += missingGeo.length;
  console.log("WARN: missing city, ZIP, latitude, or longitude data");
  for (const row of missingGeo) {
    console.log(`  ${row.location_slug}: ${row.location_name}`);
  }
}

if (warnings === 0) {
  console.log("Audit passed with no warnings.");
} else {
  console.log(`Audit completed with ${warnings} warning(s).`);
}
