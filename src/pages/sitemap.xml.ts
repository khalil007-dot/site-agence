// sitemap.xml : pages principales, puis les articles publiés juste après la page Conseils
import { getCollection } from 'astro:content';
import { PAGES, TODAY, pageUrl } from '../lib/site';

export async function GET() {
  const articles = (await getCollection('articles', p => !p.data.a_paraitre)).sort((a, b) => a.data.ordre - b.data.ordre);
  const pages = [...PAGES];
  pages.splice(pages.findIndex(([f]) => f === 'conseils.html') + 1, 0, ...articles.map(a => [`${a.id}.html`, '0.5'] as [string, string]));
  const urls = pages.map(([f, prio]) => `  <url><loc>${pageUrl(f)}</loc><lastmod>${TODAY}</lastmod><priority>${prio}</priority></url>\n`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}</urlset>\n`);
}
