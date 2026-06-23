import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH = path.join(__dirname, '.env');

function readEnvValue(name) {
  if (!fs.existsSync(ENV_PATH)) return null;

  const lines = fs.readFileSync(ENV_PATH, 'utf8').split(/\r?\n/);
  const prefix = `${name}=`;
  const line = lines.find((entry) => entry.startsWith(prefix));

  return line ? line.slice(prefix.length).trim() : null;
}

const SITE_URL = (readEnvValue('VITE_PUBLIC_SITE_URL') || 'https://www.siscoprint.com').replace(/\/$/, '');
const TODAY = new Date().toISOString().split('T')[0];

const SEO_PAGES_PATH = path.join(__dirname, 'public', 'seoPages.json');
const PRODUCTS_PATH = path.join(__dirname, 'public', 'products.json');
const PUBLIC_SITEMAP_PATH = path.join(__dirname, 'public', 'sitemap.xml');
const DIST_SITEMAP_PATH = path.join(__dirname, 'dist', 'sitemap.xml');

const seoPages = JSON.parse(fs.readFileSync(SEO_PAGES_PATH, 'utf8'));
const products = fs.existsSync(PRODUCTS_PATH)
  ? JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'))
  : [];

const entries = [];

for (const page of seoPages) {
  entries.push({
    loc: `${SITE_URL}${page.route}`,
    changefreq: page.changefreq || 'weekly',
    priority: page.priority || '0.6',
    lastmod: TODAY,
  });
}

for (const product of products) {
  if (Number(product.status) !== 1) continue;
  if (!product.idProducto) continue;

  entries.push({
    loc: `${SITE_URL}/producto/${product.idProducto}`,
    changefreq: 'weekly',
    priority: '0.7',
    lastmod: TODAY,
  });
}

const uniqueEntries = Array.from(
  new Map(entries.map((entry) => [entry.loc, entry])).values()
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  uniqueEntries
    .map(
      (entry) =>
        `  <url>\n` +
        `    <loc>${entry.loc}</loc>\n` +
        `    <lastmod>${entry.lastmod}</lastmod>\n` +
        `    <changefreq>${entry.changefreq}</changefreq>\n` +
        `    <priority>${entry.priority}</priority>\n` +
        `  </url>`
    )
    .join('\n') +
  `\n</urlset>\n`;

fs.writeFileSync(PUBLIC_SITEMAP_PATH, xml, 'utf8');

if (fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.writeFileSync(DIST_SITEMAP_PATH, xml, 'utf8');
}

console.log(`Sitemap listo: ${uniqueEntries.length} URLs.`);
