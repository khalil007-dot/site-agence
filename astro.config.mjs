// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import reglages from './src/data/reglages.json' with { type: 'json' };

// Typographie française : espace insécable avant « : ? ! » et à l'intérieur des guillemets.
// Appliquée au texte visible de chaque page après la génération.
const NB = ' ';
const fix = t => t.replaceAll(' :', NB + ':').replaceAll(' ?', NB + '?').replaceAll(' !', NB + '!')
  .replaceAll('« ', '«' + NB).replaceAll(' »', NB + '»');
const typographie = {
  name: 'typographie-fr',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const out = fileURLToPath(dir);
      for (const f of await readdir(out)) {
        if (!f.endsWith('.html')) continue;
        const s = await readFile(out + f, 'utf-8');
        const [head, body] = s.split('<body>');
        if (body === undefined) continue;
        await writeFile(out + f, head + '<body>' + body.replace(/>([^<]+)</g, (_, t) => '>' + fix(t) + '<'));
      }
    },
  },
};

export default defineConfig({
  site: reglages.url_site,
  // Garde les adresses actuelles : services.html, realisations.html…
  build: { format: 'file' },
  // Garde les apostrophes et guillemets tels qu'ils sont écrits dans les articles
  markdown: { processor: satteri({ features: { smartPunctuation: false } }) },
  integrations: [typographie],
});
