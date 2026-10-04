# Site de l'agence

Site construit avec [Astro](https://astro.build). Le contenu modifiable (projets, articles, réglages, services) est rangé à part du design, et se modifie depuis l'espace d'administration [Pages CMS](https://pagescms.org).

## Commandes

Depuis ce dossier :

```bash
npm install       # une seule fois, installe Astro
npm run dev       # aperçu en direct sur http://localhost:4321
npm run build     # génère le site final dans dist/
```

## Où modifier quoi

| Je veux changer… | Fichier |
|---|---|
| Un projet de la page Réalisations | `src/content/projets/` (un fichier par projet) |
| Les photos des projets | `src/assets/projets/` (réduites automatiquement) |
| Un article de la page Conseils | `src/content/articles/` (un fichier par article) |
| Le nom, l'e-mail, l'adresse du site | `src/data/reglages.json` |
| Les services et les prix | `src/data/services.json` |
| Le texte d'une page | `src/pages/` (une page par fichier) |
| L'en-tête, le menu, le pied de page | `src/layouts/Base.astro` |
| Les couleurs et le style | `public/styles.css` |
| Les animations et formulaires | `public/main.js` |

Les adresses des pages restent `services.html`, `realisations.html`, etc. Un nouvel article `src/content/articles/mon-article.md` devient la page `mon-article.html`.

## Espace d'administration

`.pages.yml` décrit les formulaires de l'admin. Si tu ajoutes un champ à un projet ou à un article, ajoute-le aussi dans `src/content.config.ts`.

## Dossiers

- `public/` : fichiers copiés tels quels (CSS, JS, polices, logo).
- `ressources/` : références de design, pas publiées.
- `ancien/` : l'ancienne version (script Python), à supprimer une fois le nouveau site validé.
