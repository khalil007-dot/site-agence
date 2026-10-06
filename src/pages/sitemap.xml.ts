// sitemap.xml : pages principales, puis les articles publiés juste après la page Conseils
import { getCollection } from 'astro:content';
import { PAGES, TODAY, pageUrl } from '../lib/site';

export async function GET() {
  const articles = (await getCollection('articles', p => !p.data.a_paraitre)).sort((a, b) => a.data.ordre - b.data.ordre);
  // Les articles gardent leur propre date de modification, les pages celle des réglages
  const jour = (d?: Date) => d?.toISOString().slice(0, 10);
  const pages: [string, string, string][] = PAGES.map(([f, prio]) => [f, prio, TODAY]);
  pages.splice(pages.findIndex(([f]) => f === 'conseils') + 1, 0, ...articles.map(a => [a.id, '0.5', jour(a.data.mise_a_jour) || jour(a.data.date) || TODAY] as [string, string, string]));
  const urls = pages.map(([f, prio, lastmod]) => `  <url><loc>${pageUrl(f)}</loc><lastmod>${lastmod}</lastmod><priority>${prio}</priority></url>\n`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}</urlset>\n`);
}
