-- Location/Service Area Pages Tables
-- These tables store content for the 22 location landing pages

-- Main location page info
CREATE TABLE IF NOT EXISTS location_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_id INTEGER NOT NULL UNIQUE,
  location_name TEXT NOT NULL,  -- e.g., 'Santa Monica', 'Torrance'
  location_slug TEXT NOT NULL,  -- e.g., 'santa-monica', 'torrance'
  tagline TEXT,                 -- "Expert electrical contractors serving [Location], CA"
  about_paragraph_1 TEXT,       -- Fun fact and description
  about_paragraph_2 TEXT,       -- How Shaffer serves this location
  residential_intro TEXT,       -- Intro text for residential services section
  commercial_intro TEXT,        -- Intro text for commercial services section
  closing_cta TEXT,             -- "Need electrical service in [Location]? Contact us today..."
  FOREIGN KEY (page_id) REFERENCES pages_all(id)
);

-- Related services for each location (typically 5)
CREATE TABLE IF NOT EXISTS location_related_services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  location_page_id INTEGER NOT NULL,
  service_name TEXT NOT NULL,   -- Display text for the link
  service_url TEXT,             -- Relative URL to the service
  display_order INTEGER NOT NULL,
  FOREIGN KEY (location_page_id) REFERENCES location_pages(id)
);

-- Nearby areas for each location (typically 5)
CREATE TABLE IF NOT EXISTS location_nearby_areas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  location_page_id INTEGER NOT NULL,
  area_name TEXT NOT NULL,      -- Display text for the link
  area_slug TEXT NOT NULL,      -- Slug for the area
  display_order INTEGER NOT NULL,
  FOREIGN KEY (location_page_id) REFERENCES location_pages(id)
);

CREATE INDEX IF NOT EXISTS idx_location_pages_slug ON location_pages(location_slug);
CREATE INDEX IF NOT EXISTS idx_location_related ON location_related_services(location_page_id);
CREATE INDEX IF NOT EXISTS idx_location_nearby ON location_nearby_areas(location_page_id);
