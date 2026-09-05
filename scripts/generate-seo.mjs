import fs from 'node:fs';
import path from 'node:path';

const siteUrl = (process.env.SITE_URL || 'https://dokumentflow.onrender.com').replace(/\/+$/, '');
const publicDir = path.resolve('public');
const today = new Date().toISOString().slice(0,10);

const urls = [
  '/',
  '/privacy-policy.html',
  '/terms.html',
  '/cookies.html',
  '/about.html',
  '/contact.html'
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u, i) => `  <url>
    <loc>${siteUrl}${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${i === 0 ? 'weekly' : 'monthly'}</changefreq>
    <priority>${i === 0 ? '1.0' : '0.5'}</priority>
  </url>`).join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8');
console.log(`SEO files generated for ${siteUrl}`);
