// Champs autorisés pour chaque type de contenu. Les mêmes champs sont décrits dans .pages.yml
// pour l'espace d'administration.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const couleur = z.enum(['violet', 'orange', 'magenta', 'coral']);
// L'admin enregistre un champ laissé vide comme "" ou null : on le traite comme absent
const vide = (v: unknown) => (v === '' || v === null ? undefined : v);
const texte = () => z.preprocess(vide, z.string().optional());

const projets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projets' }),
  schema: z.object({
    client: z.string(),
    categorie: z.enum(['site', 'ecom', 'logo', 'visibilite']),
    couleur: z.preprocess(vide, couleur.default('violet')),
    // Sans image, la carte affiche une maquette dessinée de ce type
    maquette: z.preprocess(vide, z.enum(['site', 'shop', 'logos', 'serp']).default('site')),
    image: texte(),
    image_alt: texte(),
    resultat_chiffre: texte(),
    resultat_texte: texte(),
    etiquette: texte(),
    lien: texte(), // adresse du site ou de la page du client
    accueil: z.preprocess(vide, z.boolean().default(false)),
    ordre: z.preprocess(vide, z.number().default(100)),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    titre: z.string(),
    titre_carte: texte(),
    titre_seo: texte(),
    fil_ariane: texte(),
    description: texte(),
    resume: z.string(),
    categorie: z.string(),
    couleur: z.preprocess(vide, couleur.default('violet')),
    date: z.preprocess(vide, z.coerce.date().optional()),
    lecture: z.preprocess(vide, z.number().optional()),
    a_paraitre: z.preprocess(vide, z.boolean().default(false)),
    ordre: z.preprocess(vide, z.number().default(100)),
  }),
});

// Avis clients : uniquement de vrais avis, publiés avec l'accord du client
const avis = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/avis' }),
  schema: z.object({
    nom: z.string(),
    entreprise: texte(),
    texte: z.string(),
    note: z.preprocess(vide, z.number().min(1).max(5).optional()),
    ordre: z.preprocess(vide, z.number().default(100)),
  }),
});

export const collections = { projets, articles, avis };
