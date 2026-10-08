// llms.txt : résumé du site pour les assistants IA
import { getCollection } from 'astro:content';
import { ABO, BRAND, EMAIL, FAMS, FONDATEURS, SITE_URL, SV, TEL } from '../lib/site';

export async function GET() {
  const price = (s: (typeof SV)[number]) => (s.prix_unique ? `à partir de ${s.prix_unique} € HT` : `à partir de ${s.prix_mensuel} € HT par mois`);
  const famTxt = FAMS.map(f => `\n### ${f.nom}\n` + SV.filter(s => s.famille === f.id).map(s => `- [${s.nom}](${SITE_URL}/services#${s.id}) : ${price(s)}. ${s.pour_qui}\n`).join('')).join('');
  const articles = (await getCollection('articles', p => !p.data.a_paraitre)).sort((a, b) => a.data.ordre - b.data.ordre);
  const aboTxt = ABO.formules.map(f => `- ${f.nom} : ${f.prix} € HTVA par mois, jusqu'à ${f.pages} pages, ${f.heures} h de modifications comprises par mois, en ligne en ${f.delai}. ${f.pour}\n`).join('');
  const artTxt = articles.map(a => `- [${a.data.titre}](${SITE_URL}/${a.id})\n`).join('');
  return new Response(`# ${BRAND}

> Agence web à Bruxelles qui travaille pour les indépendants, commerçants et PME de toute la Belgique : sites internet pros par abonnement, en ligne en 5 jours ouvrables et tout compris (dès ${ABO.formules[0].prix} € HTVA par mois), création de sites sur devis (vitrine, e-commerce), logos et identité visuelle (menus, flyers, cartes de visite), référencement Google et IA, Google Ads, réseaux sociaux et maintenance.

- Zone : Bruxelles et toute la Belgique, à distance ou sur place
- Langue : français
- Devis gratuit sous 48 h, ou appel de 30 minutes : ${SITE_URL}/devis
- Contact : ${EMAIL} ou ${TEL}, du lundi au vendredi de 9 h à 18 h
- Fondateurs : ${FONDATEURS.map(f => `${f.nom} (${f.role.toLowerCase()})`).join(' et ')}
- Site par abonnement : ${ABO.mise_en_route} € de mise en route une seule fois, engagement ${ABO.engagement_mois} mois puis résiliable chaque mois avec un mois de préavis ; demandes de modification traitées sous ${ABO.traitement_jours} jours ouvrables
- Projets sur devis : 40 % à la signature et 60 % à la mise en ligne, ou en 3 mensualités sans frais
- Le client est propriétaire de son nom de domaine, de ses contenus et de son logo

## Site par abonnement, tout compris
Design adapté au métier, textes écrits avec le client, nom de domaine, hébergement, https, adresse e-mail pro, fiche Google Business et modifications chaque mois.
${aboTxt}- Options : ${ABO.options.map(([n, p]) => `${n.toLowerCase()} +${p} €`).join(', ')} (par mois)

## Services sur devis et prix de départ
${famTxt}
## Formules sur devis
- Lancement : logo, site vitrine jusqu'à 5 pages, fiche Google Business, cartes de visite. 1 190 € HT ou 397 € par mois sur 3 mois.
- Commerce : logo, boutique en ligne, photos de 20 produits, 3 mois de référencement. 3 290 € HT ou 1 097 € par mois sur 3 mois.
- Visibilité : référencement Google et IA, Google Ads, 2 réseaux sociaux. 790 € HT par mois.

## Pages
- [Accueil](${SITE_URL}/) : site par abonnement, comparatif, formules et prix, méthode en 5 jours, FAQ
- [Services](${SITE_URL}/services) : détail des ${SV.length} services, délais et prix
- [Réalisations](${SITE_URL}/realisations)
- [À propos](${SITE_URL}/a-propos)
- [Conseils](${SITE_URL}/conseils)
${artTxt}- [Demander un devis](${SITE_URL}/devis)
`);
}
