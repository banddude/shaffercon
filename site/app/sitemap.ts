import { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const db = getDb();
  const baseUrl = 'https://banddude.github.io/shaffercon';

  // Get all service pages
  const servicePages = db.prepare(`
    SELECT sp.location, sp.service_type, sp.service_name, p.date
    FROM service_pages sp
    JOIN pages_all p ON sp.page_id = p.id
  `).all() as Array<{ location: string; service_type: string; service_name: string; date: string | null }>;

  // Get all location pages
  const locationPages = db.prepare(`
    SELECT lp.location_slug, p.date
    FROM location_pages lp
    JOIN pages_all p ON lp.page_id = p.id
  `).all() as Array<{ location_slug: string; date: string | null }>;

  // Get all blog posts
  const posts = db.prepare(`
    SELECT slug, date FROM posts
  `).all() as Array<{ slug: string; date: string | null }>;

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service-areas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Add service landing pages
  const landingPages = [
    'commercial-electric-vehicle-chargers',
    'electrical-load-studies',
    'led-retrofit-services',
    'residential-ev-charger',
    'statewide-facilities-maintenance',
  ];

  landingPages.forEach(slug => {
    sitemap.push({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    });
  });

  // Add location pages
  locationPages.forEach(({ location_slug, date }) => {
    sitemap.push({
      url: `${baseUrl}/service-areas/${location_slug}`,
      lastModified: date ? new Date(date) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // Add service detail pages
  servicePages.forEach(({ location, service_type, service_name, date }) => {
    const locationSlug = location.replace(/\s+/g, '-').toLowerCase();
    sitemap.push({
      url: `${baseUrl}/service-areas/${locationSlug}/${service_type}-${service_name}`,
      lastModified: date ? new Date(date) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });

  // Add blog posts
  posts.forEach(({ slug, date }) => {
    sitemap.push({
      url: `${baseUrl}/industry-insights/${slug}`,
      lastModified: date ? new Date(date) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  });

  return sitemap;
}
