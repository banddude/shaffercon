import { getDb } from '@/lib/db';

export const dynamic = 'force-static';

export async function GET() {
  const db = getDb();
  const baseUrl = 'https://shaffercon.com';

  // Get all blog posts
  const posts = db.prepare(`
    SELECT slug, title, date, meta_description
    FROM posts
    ORDER BY date DESC
    LIMIT 50
  `).all() as Array<{
    slug: string;
    title: string;
    date: string;
    meta_description: string | null;
  }>;

  // Generate RSS feed
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Shaffer Construction - Industry Insights</title>
    <link>${baseUrl}/industry-insights</link>
    <description>Expert insights on electrical services, EV charging infrastructure, and construction in Los Angeles</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/industry-insights/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/industry-insights/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.meta_description || post.title}]]></description>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
