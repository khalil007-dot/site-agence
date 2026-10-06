# Plan de mesure — epurestudio.be

Dernière mise à jour : 2026-10-07

## Ce qu'on veut savoir

| Question | Décision qu'elle permet |
|---|---|
| Combien de demandes (devis, appels) par semaine ? | Savoir si le site fait son travail |
| D'où viennent les demandes (Google, fiche Google, Instagram, bouche-à-oreille) ? | Où mettre le temps et le budget |
| Quelles pages amènent des demandes ? | Quels articles et services développer |
| Combien de visiteurs arrivent sur /devis sans envoyer ? | Faut-il simplifier le formulaire |

## Outils en place (sans cookie, donc sans bandeau de consentement)

| Outil | Ce qu'il mesure | Où le lire |
|---|---|---|
| Cloudflare Web Analytics | Visites, pages vues, pays, appareils, sites référents, Core Web Vitals réels | Tableau de bord Cloudflare → Analytics & Logs → Web Analytics |
| Formulaires (FormSubmit ou Web3Forms) | Chaque demande, avec **Venu de** (page du site ou site extérieur) et **Campagne** (paramètres utm) | Boîte contact@epurestudio.be |
| Google Search Console (à créer) | Recherches Google qui affichent le site, clics, position | search.google.com/search-console |
| Fiche Google Business (à créer) | Appels, itinéraires et clics vers le site depuis Google Maps | business.google.com |

Cloudflare Web Analytics ne sait pas compter les clics sur WhatsApp ou les envois de formulaire. Pour compter ces actions sans cookie, il faudrait un outil d'événements comme Umami, Plausible ou GoatCounter. Ce n'est pas nécessaire tant qu'il y a peu de demandes : chaque e-mail de demande indique déjà sa provenance.

## Conversions

| Conversion | Comment on la compte |
|---|---|
| Demande de devis | E-mail « Demande de devis : … » |
| Rendez-vous téléphonique | E-mail « Rendez-vous téléphonique : … » |
| Audit gratuit | E-mail de devis avec « Audit gratuit demandé : Oui » |
| WhatsApp | Conversations WhatsApp commençant par « Bonjour, je voudrais un devis pour mon projet. » |
| Appel direct | Noter « Comment nous avez-vous connus ? » à chaque appel |

## Liens de campagne à utiliser

Toujours utiliser ces liens à la place de l'adresse simple : la demande reçue indiquera la campagne.

| Où | Lien |
|---|---|
| Fiche Google Business (bouton Site web) | `https://epurestudio.be/?utm_source=google&utm_medium=fiche&utm_campaign=gbp` |
| Bio Instagram | `https://epurestudio.be/?utm_source=instagram&utm_medium=social&utm_campaign=bio` |
| Page LinkedIn | `https://epurestudio.be/?utm_source=linkedin&utm_medium=social&utm_campaign=profil` |
| Signature e-mail | `https://epurestudio.be/?utm_source=email&utm_medium=signature&utm_campaign=contact` |
| Carte de visite (QR code) | `https://epurestudio.be/?utm_source=carte&utm_medium=print&utm_campaign=qr` |
| Annuaires (Sortlist, Pages d'Or…) | `https://epurestudio.be/?utm_source=<annuaire>&utm_medium=annuaire&utm_campaign=listing` |
| Google Ads | Activer le marquage automatique (gclid) dans Google Ads |

Règles : tout en minuscules, sans accent ni espace.

Limite : la campagne est lue sur la page /devis. Si le visiteur arrive par un lien de campagne sur l'accueil puis va sur /devis, la demande indiquera « Venu de : Page d'accueil » et pas la campagne. Pour les campagnes importantes (publicité, QR code d'un flyer), faire pointer le lien directement vers `/devis?utm_source=…`.

## Suivi mensuel (15 minutes)

1. Cloudflare Web Analytics : visites du mois, 5 pages les plus vues, principaux sites référents.
2. Boîte mail : nombre de demandes, et répartition par « Venu de » et « Campagne ».
3. Search Console : 10 requêtes avec le plus d'impressions, et pages qui gagnent ou perdent des clics.
4. Fiche Google : appels et clics vers le site.
5. Taux de conversion = demandes ÷ visites. Repère pour un site d'agence : 1 à 3 %.
