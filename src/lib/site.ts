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
export const FONDATEUR = reglages.fondateur;
export const TODAY = reglages.date_maj;
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
  address: { '@type': 'PostalAddress', addressLocality: 'Bruxelles', addressRegion: 'Région de Bruxelles-Capitale', addressCountry: 'BE' },
  areaServed: [{ '@type': 'City', name: 'Bruxelles' }, { '@type': 'Country', name: 'Belgique' }],
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' }],
  knowsLanguage: ['fr'],
  founder: { '@type': 'Person', name: FONDATEUR, jobTitle: 'Développeur web' },
};

// Catégories de la page Réalisations (mêmes valeurs que dans content.config.ts et .pages.yml)
export const CATS: [string, string][] = [['site', 'Site vitrine'], ['ecom', 'E-commerce'], ['logo', 'Identité visuelle'], ['visibilite', 'SEO et publicité']];
export const CAT_LABEL = Object.fromEntries(CATS);

// Pages listées dans sitemap.xml, avec leur priorité (les articles sont ajoutés automatiquement)
// Adresses sans « .html » : services.html est servi à l'adresse /services
export const PAGES: [string, string][] = [['', '1.0'], ['services', '0.9'], ['realisations', '0.7'], ['a-propos', '0.6'], ['conseils', '0.6'], ['devis', '0.8']];
export const pageUrl = (chemin: string) => SITE_URL + '/' + chemin;
