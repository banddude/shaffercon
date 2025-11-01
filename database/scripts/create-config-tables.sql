-- Site Configuration Table
CREATE TABLE IF NOT EXISTS site_config (
    id INTEGER PRIMARY KEY,
    site_name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address_street TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zip TEXT,
    working_hours TEXT,
    license_text TEXT,
    service_area TEXT,
    facebook_url TEXT,
    instagram_url TEXT
);

-- Licenses Table
CREATE TABLE IF NOT EXISTS licenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license_text TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    parent_id INTEGER,
    display_order INTEGER DEFAULT 0,
    FOREIGN KEY (parent_id) REFERENCES menu_items(id)
);
