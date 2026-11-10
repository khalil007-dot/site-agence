// Clients : nom, logo (blanc sur fond transparent), projet réalisé et adresse du site, dans l'ordre d'affichage
import logoStreetSapp from '../assets/clients/street-sapp.png';
import logoOmi from '../assets/clients/omi.png';
import logoObrunch from '../assets/clients/obrunch-house.png';
import logoPlombier from '../assets/clients/plombier-urgent.png';
import logoBarber from '../assets/clients/barber-club-ahmed.png';
import logoBhna from '../assets/clients/beauty-has-no-age.png';
import logoLiege from '../assets/clients/liege-plomberie.png';

export const LOGOS = [
  ['Plombier Urgent', logoPlombier, 'Site et Google Ads', 'https://plombier-urgent-bruxelles.be/'],
  ['Barber Club by Ahmed', logoBarber, 'Site avec réservation', 'https://barberclubbyahmed.com/'],
  ['Beauty Has No Age', logoBhna, 'Site vitrine', 'https://bhna.be/'],
  ['Street Sapp', logoStreetSapp, 'Boutique en ligne', 'https://streetsapp.be/'],
  ['OMI Restaurant', logoOmi, 'Site, menu et flyer', 'https://omi-restaurant.com/'],
  ["O'Brunch House", logoObrunch, 'Logo et flyer', ''],
  ['Liège Plomberie', logoLiege, 'Site vitrine', 'https://plombier-urgent-liege.be/'],
] as const;
