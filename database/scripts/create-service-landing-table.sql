-- Service Landing Pages Table
-- For pages like commercial-electric-vehicle-chargers, residential-ev-charger, etc.

CREATE TABLE IF NOT EXISTS service_landing_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_id INTEGER NOT NULL UNIQUE,
  slug TEXT NOT NULL,
  page_title TEXT NOT NULL,           -- e.g., "Commercial EV Charger Installation"
  hero_text TEXT,                      -- Main intro paragraph
  FOREIGN KEY (page_id) REFERENCES pages_all(id)
);

-- Content sections (flexible structure for different section types)
CREATE TABLE IF NOT EXISTS service_landing_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  landing_page_id INTEGER NOT NULL,
  section_type TEXT NOT NULL,         -- 'info_card', 'content', 'table', 'how_we_help'
  heading TEXT,
  subheading TEXT,                    -- For card subtitles
  content TEXT,
  table_data TEXT,                    -- JSON for table data if section_type = 'table'
  section_order INTEGER NOT NULL,
  FOREIGN KEY (landing_page_id) REFERENCES service_landing_pages(id)
);

CREATE INDEX IF NOT EXISTS idx_landing_slug ON service_landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_landing_sections ON service_landing_sections(landing_page_id);
