// llms.txt : résumé du site pour les assistants IA
import { getCollection } from 'astro:content';
import { BRAND, EMAIL, FAMS, FONDATEURS, FORMULES, SITE_URL, SV, TEL } from '../lib/site';

export async function GET() {
  const price = (s: (typeof SV)[number]) => (s.prix_unique ? `à partir de ${s.prix_unique} € HT` : `à partir de ${s.prix_mensuel} € HT par mois`);
  const famTxt = FAMS.map(f => `\n### ${f.nom}\n` + SV.filter(s => s.famille === f.id).map(s => `- [${s.nom}](${SITE_URL}/services#${s.id}) : ${price(s)}. ${s.pour_qui}\n`).join('')).join('');
  const articles = (await getCollection('articles', p => !p.data.a_paraitre)).sort((a, b) => a.data.ordre - b.data.ordre);
  const forTxt = FORMULES.map(f => `- ${f.nom} : ${f.inclus.join(', ')}. ${f.prix} € HT${f.mensuel ? ' par mois' : ` une fois, ou ${Math.round(f.prix / 3)} € par mois sur 3 mois`} (au lieu de ${f.separe} € en services séparés).
`).join('');
  const artTxt = articles.map(a => `- [${a.data.titre}](${SITE_URL}/${a.id})\n`).join('');
  return new Response(`# ${BRAND}

> Agence web à Bruxelles qui travaille pour les indépendants, commerçants et PME de toute la Belgique : création de sites internet (vitrine en ligne en 5 jours ouvrables, e-commerce), payés une fois et qui appartiennent au client, logos et identité visuelle (menus, flyers, cartes de visite), référencement Google et IA, Google Ads, réseaux sociaux et maintenance.

- Zone : Bruxelles et toute la Belgique, à distance ou sur place
- Langue : français
- Devis gratuit sous 48 h, ou appel de 30 minutes : ${SITE_URL}/devis
- Contact : ${EMAIL} ou ${TEL}, du lundi au vendredi de 9 h à 18 h
- Fondateurs : ${FONDATEURS.map(f => `${f.nom} (${f.role.toLowerCase()})`).join(' et ')}
- Paiement : 40 % à la signature et 60 % à la mise en ligne, ou en 3 mensualités sans frais
- Le client est propriétaire de son nom de domaine, de ses contenus et de son logo

## Services et prix de départ
${famTxt}
## Formules
${forTxt}
## Pages
- [Accueil](${SITE_URL}/) : présentation, diagnostic, comparatif, simulateur de budget, formules, méthode, audit gratuit, FAQ
- [Services](${SITE_URL}/services) : détail des ${SV.length} services, délais et prix
- [Réalisations](${SITE_URL}/realisations)
- [À propos](${SITE_URL}/a-propos)
- [Conseils](${SITE_URL}/conseils)
${artTxt}- [Demander un devis](${SITE_URL}/devis)
`);
}
