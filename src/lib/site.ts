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
  { id: 'wassim', nom: COFONDATEUR, profil: reglages.profil_cofondateur, role: 'Commercial, marketing et relation client', mission: "Votre contact du premier appel au suivi : comprendre votre activité, construire l'offre avec vous, suivre vos résultats." },
  { id: 'khalil', nom: FONDATEUR, profil: reglages.profil_fondateur, role: 'Stratégie et développement', mission: 'La stratégie, puis la construction de votre site, ou de votre boutique : solide, rapide, pensée pour vendre.' },
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
  logo: SITE_URL + '/logo.png', priceRange: '€€',
  description: 'Agence web à Bruxelles : création de sites internet, boutiques en ligne, logos, référencement, Google Ads et réseaux sociaux pour les indépendants et PME.',
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
};

// Catégories de la page Réalisations (mêmes valeurs que dans content.config.ts et .pages.yml)
export const CATS: [string, string][] = [['site', 'Site vitrine'], ['ecom', 'E-commerce'], ['logo', 'Identité visuelle'], ['visibilite', 'SEO et publicité']];
export const CAT_LABEL = Object.fromEntries(CATS);

// Pages listées dans sitemap.xml, avec leur priorité (les articles sont ajoutés automatiquement)
// Adresses sans « .html » : services.html est servi à l'adresse /services
export const PAGES: [string, string][] = [['', '1.0'], ['services', '0.9'], ['realisations', '0.7'], ['a-propos', '0.6'], ['conseils', '0.6'], ['devis', '0.8']];
export const pageUrl = (chemin: string) => SITE_URL + '/' + chemin;

// Formules (Lancement, Commerce, Visibilité) et leur prix si on prenait les services séparément
export const FORMULES = services.formules.map(f => {
  const p = (id: string) => SV.find(s => s.id === id)!;
  const separe = f.services.reduce((t, id) => t + (f.mensuel ? p(id).prix_mensuel : p(id).prix_unique || p(id).prix_mensuel * (f.separe_mois_seo ?? 0)), 0);
  return { ...f, separe };
});
