// Données et petites fonctions partagées par toutes les pages
import reglages from '../data/reglages.json';
import services from '../data/services.json';

export const NB = ' ';
export const BRAND = reglages.marque;
export const SITE_URL = reglages.url_site;
export const EMAIL = reglages.email;
export const TEL = reglages.telephone;
// 0467 66 26 29 → +32467662629 (format international pour les liens « appeler »)
export const TEL_INTL = '+32' + TEL.replace(/\D/g, '').replace(/^0/, '');
export const VILLE = reglages.ville;
export const ADRESSE = reglages.adresse;
export const CODE_POSTAL = reglages.code_postal;
export const NUMERO_ENTREPRISE = reglages.numero_entreprise;
// Profils de l'agence (Google Business, LinkedIn…) : relient le site à l'agence pour Google et les IA
export const RESEAUX: string[] = reglages.reseaux.filter(Boolean);
export const FONDATEUR = reglages.fondateur;
export const COFONDATEUR = reglages.cofondateur;
// Les deux fondateurs : photo dans src/assets/fondateurs/<id>.jpg
// pid : identifiant unique de la personne pour Google, le même sur toutes les pages
export const FONDATEURS = [
  { id: 'wassim', nom: COFONDATEUR, profil: reglages.profil_cofondateur, role: 'Commercial, marketing et relation client', mission: "Votre contact du premier appel au suivi : il comprend votre activité, construit l'offre avec vous et suit vos résultats." },
  { id: 'khalil', nom: FONDATEUR, profil: reglages.profil_fondateur, role: 'Stratégie et développement', mission: 'Il conçoit et construit votre site ou votre boutique : rapide, solide et pensé pour faire appeler ou acheter.' },
].map(f => ({ ...f, pid: reglages.url_site + '/a-propos#' + f.id }));
// Référence courte à une personne, pour l'auteur d'un article ou les fondateurs de l'agence
export const personRef = (f: (typeof FONDATEURS)[number]) => ({ '@type': 'Person', '@id': f.pid, name: f.nom, url: reglages.url_site + '/a-propos' });
// Clé Web3Forms : les formulaires envoient les demandes par e-mail (vide = envoi désactivé)
export const CLE_FORMULAIRES = reglages.cle_formulaires;
// WhatsApp sur le même numéro, avec un premier message déjà écrit (désactivable dans les réglages)
export const WHATSAPP = reglages.whatsapp
  ? `https://wa.me/${TEL_INTL.slice(1)}?text=${encodeURIComponent('Bonjour, je voudrais un devis pour mon projet.')}`
  : '';
// Jeton Cloudflare Web Analytics : statistiques de visite sans cookies (vide = désactivé)
export const CLE_ANALYTICS = reglages.cle_analytics;
// Google Ads (« AW-123456789 ») et libellé de chaque conversion, créés dans Google Ads → Objectifs → Conversions.
// Vide = aucun script Google et aucun bandeau cookies. Le script ne se charge qu'après accord du visiteur.
export const GOOGLE_ADS = reglages.google_ads;
export const CONVERSIONS: Record<string, string> = Object.fromEntries(
  Object.entries(reglages.conversions).filter(([, label]) => label).map(([nom, label]) => [nom, `${GOOGLE_ADS}/${label}`]),
);
export const TODAY = reglages.date_maj;
// Numéro de la mise en ligne, ajouté à styles.css et main.js pour que le cache ne serve jamais une ancienne version
export const BUILD = Date.now().toString(36);
export const FAMS = services.familles;
export const SV = services.services;
export type Service = (typeof SV)[number];

// 2400 → « 2 400 € » avec espaces insécables
export const e = (n: number) => n.toLocaleString('en-US').replaceAll(',', NB) + NB + '€';
export const prixDepart = (s: Service) => (s.prix_unique ? e(s.prix_unique) : e(s.prix_mensuel) + '/mois');

export const ORG_ID = SITE_URL + '/#agence';
export const ORG = {
  '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': ORG_ID,
  name: BRAND, url: SITE_URL + '/', email: EMAIL, telephone: TEL_INTL, image: SITE_URL + '/og-image.png',
  logo: SITE_URL + '/logo.png', priceRange: `${services.formules[0].prix} € - ${services.formules[2].prix} €`,
  description: `Agence web à Bruxelles : sites internet à prix fixe pour indépendants, commerces et PME. Site vitrine ${services.formules[0].prix} €, site + logo ${services.formules[1].prix} €, boutique en ligne ${services.formules[2].prix} € HTVA, payés une fois. Référencement, Google Ads et réseaux sociaux.`,
  address: {
    '@type': 'PostalAddress', ...(ADRESSE && { streetAddress: ADRESSE }), ...(CODE_POSTAL && { postalCode: CODE_POSTAL }),
    addressLocality: 'Bruxelles', addressRegion: 'Région de Bruxelles-Capitale', addressCountry: 'BE',
  },
  ...(NUMERO_ENTREPRISE && { vatID: NUMERO_ENTREPRISE }),
  ...(RESEAUX.length && { sameAs: RESEAUX }),
  areaServed: [{ '@type': 'City', name: 'Bruxelles' }, { '@type': 'Country', name: 'Belgique' }],
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' }],
  knowsLanguage: ['fr'],
  founder: FONDATEURS.map(personRef),
  hasOfferCatalog: {
    '@type': 'OfferCatalog', name: 'Sites internet à prix fixe',
    itemListElement: services.formules.map(f => ({
      '@type': 'Offer', name: f.nom, description: `${f.pour} En ligne en ${f.delai}. ${f.inclus.join(', ')}.`, url: SITE_URL + '/#formules',
      price: String(f.prix), priceCurrency: 'EUR', availability: 'https://schema.org/InStock',
      priceSpecification: { '@type': 'PriceSpecification', price: String(f.prix), priceCurrency: 'EUR', valueAddedTaxIncluded: false },
      itemOffered: { '@type': 'Service', name: f.nom, provider: { '@id': SITE_URL + '/#agence' }, areaServed: { '@type': 'Country', name: 'Belgique' } },
    })),
  },
};

// Catégories de la page Réalisations (mêmes valeurs que dans content.config.ts et .pages.yml)
export const CATS: [string, string][] = [['site', 'Site vitrine'], ['ecom', 'E-commerce'], ['logo', 'Identité visuelle'], ['visibilite', 'SEO et publicité']];
export const CAT_LABEL = Object.fromEntries(CATS);

// Pages listées dans sitemap.xml, avec leur priorité (les articles sont ajoutés automatiquement)
// Adresses sans « .html » : services.html est servi à l'adresse /services
export const PAGES: [string, string][] = [['', '1.0'], ['services', '0.9'], ['realisations', '0.7'], ['a-propos', '0.6'], ['conseils', '0.6'], ['devis', '0.8']];
export const pageUrl = (chemin: string) => SITE_URL + '/' + chemin;

// Les 3 offres affichées partout (accueil, services, devis) : un prix fixe chacune, payable en 3 fois
export const FORMULES = services.formules;
export const MAINTENANCE = services.services.find(s => s.id === 'maintenance')!.prix_mensuel;
