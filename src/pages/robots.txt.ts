// robots.txt : règles pour les robots d'exploration
import { BRAND, SITE_URL } from '../lib/site';

export const GET = () => new Response(`# ${BRAND} : règles pour les robots d'exploration
User-agent: *
Allow: /

# Moteurs de réponse IA : autorisés, pour être cité dans ChatGPT, Perplexity, Claude et Google
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);
