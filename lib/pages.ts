import { getDb } from "./db";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Page {
  id: number;
  slug: string;
  title: string;
  date: string;
  type: 'contact' | 'service' | 'location' | 'service-landing' | 'generic' | 'home' | 'about' | 'service-areas' | 'footer';
  content: any; // Type varies by page type
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    ogImage: string | null;
  };
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  date: string;
  markdown: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    ogImage: string | null;
  };
}

// ============================================================================
// HELPER FUNCTIONS TO DETERMINE PAGE TYPE
// ============================================================================

function determinePageType(slug: string): Page['type'] {
  if (slug === 'contact-us' || slug === 'contact') return 'contact';
  if (slug === 'home') return 'home';
  if (slug === 'about-us') return 'about';
  if (slug === 'service-areas') return 'service-areas';
  if (slug === 'footer') return 'footer';

  // Check if it's a service landing page
  const serviceLandings = [
    'commercial-electric-vehicle-chargers',
    'commercial-service',
    'electrical-load-studies',
    'led-retrofit-services',
    'residential-ev-charger',
    'statewide-facilities-maintenance'
  ];
  if (serviceLandings.includes(slug)) return 'service-landing';

  // Check if it's a service detail page (starts with residential- or commercial-)
  if (slug.startsWith('residential-') || slug.startsWith('commercial-')) {
    return 'service';
  }

  // Check if it's a location page (check against known locations)
  const locations = [
    'altadena', 'atwater-village', 'beverly-hills', 'boyle-heights', 'burbank',
    'culver-city', 'echo-park', 'glendale', 'highland-park', 'hollywood',
    'inglewood', 'long-beach', 'los-feliz', 'pacific-palisades', 'pasadena',
    'santa-clarita', 'santa-monica', 'sherman-oaks', 'silver-lake', 'torrance',
    'venice', 'west-hollywood'
  ];
  if (locations.includes(slug)) return 'location';

  return 'generic';
}

// ============================================================================
// CONTENT FETCHERS BY PAGE TYPE
// ============================================================================

function getContactPageContent(pageId: number) {
  const db = getDb();
  const sections = db.prepare(`
    SELECT * FROM page_sections
    WHERE page_id = ?
    ORDER BY section_order
  `).all(pageId);

  return { sections };
}

function getServicePageContent(pageId: number) {
  const db = getDb();

  const serviceInfo = db.prepare(`
    SELECT * FROM service_pages WHERE page_id = ?
  `).get(pageId) as any;

  if (!serviceInfo) return null;

  const benefits = db.prepare(`
    SELECT heading, content FROM service_benefits
    WHERE service_page_id = ?
    ORDER BY benefit_order
  `).all(serviceInfo.id);

  const offerings = db.prepare(`
    SELECT offering FROM service_offerings
    WHERE service_page_id = ?
    ORDER BY offering_order
  `).all(serviceInfo.id);

  const faqs = db.prepare(`
    SELECT question, answer FROM service_faqs
    WHERE service_page_id = ?
    ORDER BY faq_order
  `).all(serviceInfo.id);

  const relatedServices = db.prepare(`
    SELECT service_name FROM service_related_services
    WHERE service_page_id = ?
    ORDER BY display_order
  `).all(serviceInfo.id);

  const nearbyAreas = db.prepare(`
    SELECT area_name FROM service_nearby_areas
    WHERE service_page_id = ?
    ORDER BY display_order
  `).all(serviceInfo.id);

  return {
    serviceType: serviceInfo.service_type,
    serviceName: serviceInfo.service_name,
    location: serviceInfo.location,
    heroIntro: serviceInfo.hero_intro,
    closingContent: serviceInfo.closing_content,
    benefits,
    offerings: offerings.map((o: any) => o.offering),
    faqs,
    relatedServices: relatedServices.map((s: any) => s.service_name),
    nearbyAreas: nearbyAreas.map((a: any) => a.area_name),
  };
}

function getLocationPageContent(pageId: number) {
  const db = getDb();

  const locationInfo = db.prepare(`
    SELECT * FROM location_pages WHERE page_id = ?
  `).get(pageId) as any;

  if (!locationInfo) return null;

  const relatedServices = db.prepare(`
    SELECT service_name FROM location_related_services
    WHERE location_page_id = ?
    ORDER BY display_order
  `).all(locationInfo.id);

  const nearbyAreas = db.prepare(`
    SELECT area_name, area_slug FROM location_nearby_areas
    WHERE location_page_id = ?
    ORDER BY display_order
  `).all(locationInfo.id);

  return {
    locationName: locationInfo.location_name,
    locationSlug: locationInfo.location_slug,
    tagline: locationInfo.tagline,
    aboutParagraph1: locationInfo.about_paragraph_1,
    aboutParagraph2: locationInfo.about_paragraph_2,
    residentialIntro: locationInfo.residential_intro,
    commercialIntro: locationInfo.commercial_intro,
    closingCta: locationInfo.closing_cta,
    relatedServices: relatedServices.map((s: any) => s.service_name),
    nearbyAreas,
  };
}

function getServiceLandingContent(pageId: number) {
  const db = getDb();

  const landingInfo = db.prepare(`
    SELECT * FROM service_landing_pages WHERE page_id = ?
  `).get(pageId) as any;

  if (!landingInfo) return null;

  const sections = db.prepare(`
    SELECT * FROM service_landing_sections
    WHERE landing_page_id = ?
    ORDER BY section_order
  `).all(landingInfo.id);

  return {
    pageTitle: landingInfo.page_title,
    heroText: landingInfo.hero_text,
    sections: sections.map((s: any) => ({
      type: s.section_type,
      heading: s.heading,
      subheading: s.subheading,
      content: s.content,
      tableData: s.table_data ? JSON.parse(s.table_data) : null,
    })),
  };
}

function getGenericPageContent(pageId: number) {
  const db = getDb();
  const sections = db.prepare(`
    SELECT * FROM page_sections
    WHERE page_id = ?
    ORDER BY section_order
  `).all(pageId);

  return { sections };
}

// ============================================================================
// MAIN PAGE FETCHERS
// ============================================================================

export function getPageBySlug(slug: string): Page | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT id, slug, title, date, meta_title, meta_description, canonical_url, og_image
    FROM pages_all
    WHERE slug = ?
  `).get(slug) as any;

  if (!row) return null;

  const pageType = determinePageType(slug);
  let content = null;

  switch (pageType) {
    case 'contact':
      content = getContactPageContent(row.id);
      break;
    case 'service':
      content = getServicePageContent(row.id);
      break;
    case 'location':
      content = getLocationPageContent(row.id);
      break;
    case 'service-landing':
      content = getServiceLandingContent(row.id);
      break;
    case 'home':
    case 'about':
    case 'service-areas':
    case 'footer':
    case 'generic':
      content = getGenericPageContent(row.id);
      break;
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.date,
    type: pageType,
    content,
    seo: {
      metaTitle: row.meta_title || row.title,
      metaDescription: row.meta_description || '',
      canonicalUrl: row.canonical_url || '',
      ogImage: row.og_image,
    },
  };
}

export function getPostBySlug(slug: string): Post | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT id, slug, title, date, markdown, meta_title, meta_description, canonical_url, og_image
    FROM posts
    WHERE slug = ?
  `).get(slug) as any;

  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.date,
    markdown: row.markdown || '',
    seo: {
      metaTitle: row.meta_title || row.title,
      metaDescription: row.meta_description || '',
      canonicalUrl: row.canonical_url || '',
      ogImage: row.og_image,
    },
  };
}

export function getAllPageSlugs(): string[] {
  const db = getDb();
  const rows = db.prepare("SELECT slug FROM pages_all").all() as { slug: string }[];
  return rows.map((row) => row.slug);
}

export function getAllPostSlugs(): string[] {
  const db = getDb();
  const rows = db.prepare("SELECT slug FROM posts").all() as { slug: string }[];
  return rows.map((row) => row.slug);
}

export function getAllPages(): Page[] {
  const slugs = getAllPageSlugs();
  return slugs.map(slug => getPageBySlug(slug)).filter(Boolean) as Page[];
}

export function getAllPosts(): Post[] {
  const slugs = getAllPostSlugs();
  return slugs.map(slug => getPostBySlug(slug)).filter(Boolean) as Post[];
}

export function getPageByPath(path: string): Page | null {
  const segments = path.split("/").filter(Boolean);
  const slug = segments[segments.length - 1];
  return getPageBySlug(slug);
}

export function getPostsByCategory(category: string): Post[] {
  // For now, return all posts
  // Could filter by category if we add that field
  return getAllPosts();
}
