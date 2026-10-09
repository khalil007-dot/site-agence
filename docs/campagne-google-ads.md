# Campagne Google Ads : préparation et plan

## 1. Avant de lancer (à faire une fois)

| # | À faire | Où |
|---|---|---|
| 1 | Créer le compte Google Ads avec contact@epurestudio.be, en « mode Expert » (lien discret « Passer en mode Expert » au premier écran) pour ne pas laisser Google créer une campagne automatique | ads.google.com |
| 2 | Créer 5 conversions de type « Site web », catégorie « Envoyer un formulaire de prospect » (ou « Contact » pour téléphone et WhatsApp), valeur unique, comptage « Une » | Objectifs → Conversions → Nouvelle action |
| 3 | Pour chaque conversion, choisir « Configurer manuellement avec Google tag » et noter l'identifiant `AW-…` et le libellé (« Libellé de conversion ») | Écran « Configuration de la balise » |
| 4 | Coller l'identifiant et les 5 libellés dans `src/data/reglages.json` (voir ci-dessous), puis publier le site | Fichier de réglages |
| 5 | Remplir `numero_entreprise` et `adresse` dans les réglages (obligatoire sur le site en Belgique, et Google vérifie l'annonceur) | Fichier de réglages |
| 6 | Faire un vrai test de chaque formulaire et vérifier que l'e-mail arrive (FormSubmit demande une activation par e-mail au premier envoi) | Le site en ligne |
| 7 | Relier la fiche Google Business au compte Ads, pour afficher l'adresse et le numéro sous l'annonce | Ads → Contenus → Lieux |
| 8 | Valider l'identité de l'annonceur quand Google la demande (pièce d'identité ou documents de l'entreprise) | Facturation → Validation de l'annonceur |

Réglages à remplir :

```json
"google_ads": "AW-123456789",
"conversions": {
  "devis": "libellé de « Demande de devis »",
  "audit": "libellé de « Demande d'audit »",
  "appel": "libellé de « Rendez-vous téléphonique »",
  "telephone": "libellé de « Clic sur le numéro »",
  "whatsapp": "libellé de « Clic WhatsApp »"
}
```

Dès que `google_ads` est rempli, le site affiche le bandeau cookies et la page Mentions légales décrit les cookies Google. Le script Google ne se charge qu'après « Accepter ». Une conversion laissée vide n'est simplement pas envoyée.

Dans Google Ads, garder **« Demande de devis »**, **« Rendez-vous téléphonique »** et **« Clic sur le numéro »** en conversions principales (celles que Google optimise). Mettre « Demande d'audit » et « Clic WhatsApp » en secondaires au début : un clic WhatsApp n'est pas encore un client.

Tester : ouvrir le site, accepter le bandeau, envoyer un devis de test, puis vérifier dans Ads → Conversions que l'état passe à « Enregistrement des conversions » (24 à 48 h).

## 2. Structure de la campagne

- **Type** : Réseau de Recherche uniquement. Décocher le Réseau Display et les partenaires du Réseau de Recherche.
- **Zone** : Bruxelles + 15 km, option « Présence : personnes situées dans vos zones ciblées » (pas « intéressées par »).
- **Langue** : français (ajouter néerlandais plus tard seulement avec des annonces en néerlandais).
- **Horaires** : du lundi au vendredi, 8 h 30 à 18 h 30, quand quelqu'un peut décrocher.
- **Budget** : 10 à 15 € par jour pour commencer (300 à 450 € par mois).
- **Enchères** : « Maximiser les conversions » sans objectif de CPA dès que la balise de conversion est en place (ou « CPC manuel » avec un plafond de 3 € si Google le propose). Pas de « Maximiser les clics » : il achète les clics les moins chers, rarement ceux qui demandent un devis. Passer à un CPA cible seulement après 30 conversions en 30 jours, en le réglant près du coût réel, puis par pas de 10 à 15 % (skill `ads`, guide Réseau de Recherche).
- **Page d'arrivée** : l'accueil pour le groupe « site internet », `/services#site-vitrine` pour « site vitrine », `/services#e-commerce` pour « boutique ».

### Groupes d'annonces et mots-clés

Mots-clés en correspondance expression (« … ») et exacte ([…]). Pas de requête large au départ.

| Groupe | Mots-clés |
|---|---|
| Création de site | "création site internet bruxelles", "création site web bruxelles", "faire un site internet bruxelles", [création site internet], "agence web bruxelles", "conception site internet" |
| Site vitrine | "site vitrine", "site vitrine prix", "prix site internet", "combien coûte un site internet", "site internet pas cher bruxelles" |
| Métiers | "site internet restaurant", "site web restaurant bruxelles", "site internet artisan", "site internet coiffeur", "site internet indépendant" |
| Boutique en ligne | "création boutique en ligne", "création site e-commerce bruxelles", "créer une boutique shopify belgique" |

### Mots-clés à exclure (niveau campagne)

gratuit, gratuitement, free, formation, cours, tuto, tutoriel, apprendre, emploi, job, stage, stagiaire, salaire, recrutement, alternance, école, wix, squarespace, wordpress.com, jimdo, canva, modèle, template, thème, exemple, pdf, définition, c'est quoi, open source, logiciel, application mobile, appli

À compléter chaque semaine avec les recherches inutiles vues dans « Termes de recherche ».

## 3. Annonces (une annonce responsive par groupe)

Titres (30 caractères max.) :

1. Création site internet 890 €
2. Site vitrine à prix fixe
3. En ligne en 5 jours ouvrables
4. Agence web à Bruxelles
5. Devis gratuit sous 48 h
6. Payé une fois, ou en 3 fois
7. Textes écrits avec vous
8. Maquette refaite sans frais
9. Le site vous appartient
10. Pensé pour le téléphone
11. Fiche Google incluse
12. Deux fondateurs en direct
13. Site + logo pour 990 €
14. Boutique en ligne 1 490 €
15. Un site qui fait appeler

Descriptions (90 caractères max.) :

1. Site vitrine sur mesure à 890 € HTVA, payé une fois. En ligne en 5 jours ouvrables.
2. Textes écrits avec vous, boutons Appeler et WhatsApp, fiche Google réglée. Devis en 48 h.
3. Vous validez la maquette avant la construction. Elle ne vous plaît pas ? On la refait.
4. Restaurants, artisans, commerces : des sites rapides qui donnent envie de vous appeler.

Épingler le titre 1 (ou 14 pour la boutique) en position 1. Laisser le reste libre.

### Éléments à ajouter

- **Liens annexes** : Les 3 offres (`/#formules`), Nos réalisations (`/realisations`), Comment ça marche (`/#methode`), Audit gratuit (`/#audit`).
- **Accroches** : Prix fixe, Paiement en 3 fois, Maquette offerte, Site à votre nom, Réponse sous 48 h.
- **Extraits de site** (type « Services ») : Site vitrine, Site + logo, Boutique en ligne, Logo, Référencement, Maintenance.
- **Prix** : Site vitrine 890 €, Site + logo 990 €, Boutique en ligne 1 490 €.
- **Appel** : 0467 66 26 29, aux mêmes horaires que la campagne.
- **Lieu** : via la fiche Google Business reliée.

## 3 bis. Groupe d'annonces « Boutique en ligne » (à ajouter après la création de la campagne)

Groupe séparé du site vitrine : autre prix, autre acheteur, autre page d'arrivée. Ajout : campagne → Groupes d'annonces → « + ».

- **URL finale** : `https://epurestudio.be/services#e-commerce` · chemins `boutique` / `e-commerce`
- **Mots-clés** :

```
"création boutique en ligne"
"création boutique en ligne bruxelles"
"création site e-commerce"
"création site ecommerce"
"création site e-commerce bruxelles"
"site e-commerce prix"
"prix boutique en ligne"
"devis site e-commerce"
"création site shopify"
"agence shopify bruxelles"
"création site woocommerce"
[création boutique en ligne]
[boutique en ligne prix]
```

- **Exclusions croisées** (pour que chaque recherche aille dans un seul groupe) : dans le groupe site vitrine, exclure en expression `"boutique en ligne"`, `"e-commerce"`, `"ecommerce"`, `"shopify"`, `"woocommerce"` ; dans le groupe boutique, exclure `"site vitrine"`.

Titres (30 caractères max., comptés) :

1. Création boutique en ligne (26) — épinglé en position 1
2. Boutique en ligne 1 490 € (25)
3. Prix fixe, payé une fois (24)
4. En ligne en 3 semaines (22)
5. Paiement Bancontact et carte (28)
6. Shopify ou WooCommerce (22)
7. Produits illimités (18)
8. 50 premiers produits importés (29)
9. Achat en 2 clics sur mobile (27)
10. Livraison et CGV configurées (28)
11. Agence web à Bruxelles (22)
12. Devis gratuit sous 48 h (23)
13. La boutique est à votre nom (27)
14. Ou 3 × 497 € sans frais (23)
15. Vendez jour et nuit (19)

Descriptions (90 caractères max., comptées) :

1. Boutique en ligne complète à 1 490 € HTVA, prix fixe. En ligne en 3 semaines. (77)
2. Paiement Bancontact, carte et Apple Pay. Vos 50 premiers produits importés. (75)
3. Pensée pour acheter en deux clics sur téléphone. Livraison, retours et CGV réglés. (82)
4. Shopify ou WooCommerce selon vos besoins. Devis gratuit et ferme sous 48 h. (75)

Lien annexe propre au groupe : `Exemple : Street Sapp` → https://epurestudio.be/realisations (« Boutique sportswear en ligne » / « Paiement Bancontact intégré »).

Budget : les clics « boutique » coûtent souvent plus cher. Avec 10 à 15 € par jour au total, surveiller que ce groupe ne prive pas le site vitrine ; s'il dépense plus de la moitié sans demande après 2 semaines, le passer dans une campagne séparée avec son propre budget.

## 4. Suivi

| Quand | Quoi regarder | Action |
|---|---|---|
| Chaque jour la 1re semaine | Termes de recherche | Exclure tout ce qui n'est pas un client potentiel |
| Chaque semaine | Coût par conversion, taux de clic (viser plus de 5 %) | Couper les mots-clés chers sans conversion après 30 à 40 € dépensés |
| Après 30 conversions en 30 jours | Volume de conversions | Fixer un CPA cible proche du coût réel, ajusté par pas de 10 à 15 % |
| Chaque mois | Devis signés venant des annonces | Comparer au budget : un site vitrine signé rembourse environ 2 mois de campagne |

Repère de rentabilité : avec 400 € par mois, il faut au moins 1 site vitrine signé par mois pour que la campagne soit rentable. Les demandes reçues indiquent « Venu de » et « Campagne » : mettre `utm_source=google&utm_medium=cpc&utm_campaign=site` dans le « Suffixe de l'URL finale » de la campagne (Paramètres → Options d'URL) pour les reconnaître.
