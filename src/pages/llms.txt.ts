// llms.txt : résumé du site pour les assistants IA
import { getCollection } from 'astro:content';
import { BRAND, EMAIL, FAMS, SITE_URL, SV } from '../lib/site';

export async function GET() {
  const price = (s: (typeof SV)[number]) => (s.prix_unique ? `à partir de ${s.prix_unique} € HT` : `à partir de ${s.prix_mensuel} € HT par mois`);
  const famTxt = FAMS.map(f => `\n### ${f.nom}\n` + SV.filter(s => s.famille === f.id).map(s => `- [${s.nom}](${SITE_URL}/services.html#${s.id}) : ${price(s)}. ${s.pour_qui}\n`).join('')).join('');
  const articles = (await getCollection('articles', p => !p.data.a_paraitre)).sort((a, b) => a.data.ordre - b.data.ordre);
  const artTxt = articles.map(a => `- [${a.data.titre}](${SITE_URL}/${a.id}.html)\n`).join('');
  return new Response(`# ${BRAND}

> Agence web à Bruxelles qui travaille pour les indépendants, commerçants et PME de toute la Belgique : création de sites internet (vitrine, e-commerce), applications mobiles, logos et identité visuelle, devantures, photo et vidéo par drone, référencement Google et IA, Google Ads, réseaux sociaux et maintenance.

- Zone : Bruxelles et toute la Belgique, à distance ou sur place
- Langue : français
- Devis gratuit sous 48 h, ou appel de 30 minutes : ${SITE_URL}/devis.html
- Contact : ${EMAIL}, du lundi au vendredi de 9 h à 18 h
- Paiement : 40 % à la signature et 60 % à la mise en ligne, ou en 12 mensualités sans frais
- Le client est propriétaire de son nom de domaine, de ses contenus et de son logo

## Services et prix de départ
${famTxt}
## Formules
- Lancement : logo, site vitrine jusqu'à 5 pages, fiche Google Business, cartes de visite. 1 190 € HT ou 99 € par mois sur 12 mois.
- Commerce : logo, boutique en ligne, photos de 20 produits, 3 mois de référencement. 3 290 € HT ou 275 € par mois sur 12 mois.
- Visibilité : référencement Google et IA, Google Ads, 2 réseaux sociaux. 790 € HT par mois.

## Pages
- [Accueil](${SITE_URL}/) : présentation, simulateur de budget, formules, méthode, FAQ
- [Services](${SITE_URL}/services.html) : détail des 10 services, délais et prix
- [Réalisations](${SITE_URL}/realisations.html)
- [À propos](${SITE_URL}/a-propos.html)
- [Conseils](${SITE_URL}/conseils.html)
${artTxt}- [Demander un devis](${SITE_URL}/devis.html)
`);
}
