import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, 'dist');
const SEO_PAGES_PATH = path.join(__dirname, 'public', 'seoPages.json');
const ENV_PATH = path.join(__dirname, '.env');

function readEnvValue(name) {
  if (!fs.existsSync(ENV_PATH)) return null;

  const lines = fs.readFileSync(ENV_PATH, 'utf8').split(/\r?\n/);
  const prefix = `${name}=`;
  const line = lines.find((entry) => entry.startsWith(prefix));

  return line ? line.slice(prefix.length).trim() : null;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function upsertMetaTag(html, attributeName, attributeValue, content) {
  const matcher = new RegExp(`<meta\\s+${attributeName}=[\"']${attributeValue}[\"'][^>]*>`, 'i');
  const replacement = `<meta ${attributeName}=\"${attributeValue}\" content=\"${escapeHtml(content)}\" />`;

  if (matcher.test(html)) {
    return html.replace(matcher, replacement);
  }

  return html.replace('</head>', `  ${replacement}\n</head>`);
}

function injectSeoContent(html, page) {
  const title = page.seo?.h1 || page.title;
  const intro = page.seo?.intro || page.description;
  const highlights = Array.isArray(page.seo?.highlights) ? page.seo.highlights : [];

  const listHtml = highlights.length
    ? `<ul>${highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : '';

  const hiddenBlock = [
    '<div id="seo-prerender" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0">',
    `  <h1>${escapeHtml(title)}</h1>`,
    `  <p>${escapeHtml(intro)}</p>`,
    `  ${listHtml}`,
    '</div>'
  ].join('\n');

  if (html.includes('id="seo-prerender"')) {
    return html.replace(/<div id=\"seo-prerender\"[\s\S]*?<\/div>/, hiddenBlock);
  }

  return html.replace('<div id="root"></div>', `${hiddenBlock}\n  <div id="root"></div>`);
}

function addJsonLd(html, page, url) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url,
    inLanguage: 'es-MX'
  };

  const scriptTag = `  <script type=\"application/ld+json\">${JSON.stringify(jsonLd)}</script>\n`;
  return html.replace('</head>', `${scriptTag}</head>`);
}

if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
  console.error('No se encontro dist/index.html. Ejecuta primero: npm run build');
  process.exit(1);
}

const baseHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
const pages = JSON.parse(fs.readFileSync(SEO_PAGES_PATH, 'utf8'));
const siteUrl = (readEnvValue('VITE_PUBLIC_SITE_URL') || 'https://www.siscoprint.com').replace(/\/$/, '');

for (const page of pages) {
  let html = baseHtml;

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  html = upsertMetaTag(html, 'name', 'description', page.description || '');

  if (page.keywords) {
    html = upsertMetaTag(html, 'name', 'keywords', page.keywords);
  }

  html = upsertMetaTag(html, 'property', 'og:title', page.title || '');
  html = upsertMetaTag(html, 'property', 'og:description', page.description || '');
  html = upsertMetaTag(html, 'property', 'og:url', `${siteUrl}${page.route}`);

  html = injectSeoContent(html, page);
  html = addJsonLd(html, page, `${siteUrl}${page.route}`);

  const routePath = page.route === '/' ? '' : page.route.replace(/^\//, '');
  const targetDir = routePath ? path.join(DIST_DIR, routePath) : DIST_DIR;

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
}

console.log(`Prerender listo: ${pages.length} rutas.`);
