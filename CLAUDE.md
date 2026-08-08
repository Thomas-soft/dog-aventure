@AGENTS.md

# Dog Aventure — site vitrine client

Site one-page Next.js pour un promeneur de chiens indépendant basé à Louvres (95).
Projet client : le contenu final (domaine, avis, photos) arrive au fil de l'eau.

## Commandes

- `npm run dev` — serveur de dev sur le **port 3777** (pas 3000)
- `npm run build` — seule vérification du projet (pas de suite de tests) : toujours la lancer après une série de modifications
- `npm run lint` — ESLint

## Préview client (GitHub Pages)

- URL à partager au client : **https://thomas-soft.github.io/dog-aventure/** — redéployée à chaque push sur `main` (`.github/workflows/deploy-pages.yml`).
- Le build préview est activé par `GITHUB_PAGES=true` : export statique + basePath `/dog-aventure` + loader d'images custom (`lib/image-loader.ts`) + `noindex`. Ces options ne doivent jamais servir pour la mise en ligne réelle (qui se fera sur un hébergeur Next.js avec le domaine du client).

## Règle d'or : le contenu vit dans `content/site.config.ts`

- Tout texte, prix, ville, avis ou image éditable passe par `content/site.config.ts` (types dans `content/types.ts`). Ne jamais coder de contenu en dur dans les composants.
- **Exception connue** : le H1 du hero (`components/sections/hero.tsx`) est en dur pour sa mise en forme sur deux lignes — le garder synchronisé avec `site.slogan`.
- `site.url` est la source unique du domaine : utilisée par `metadataBase`, le canonical, `app/robots.ts`, `app/sitemap.ts` et le JSON-LD. Ne jamais écrire le domaine ailleurs.

## Rédaction (copy française)

- Voix à la première personne (« je »), le prestataire parle directement — jamais « nous ».
- Le message doit rester cohérent : c'est LUI qui promène le chien, pas le client (une v1 du slogan disait « Promenez-le » — erreur déjà corrigée, ne pas la réintroduire).
- Apostrophes typographiques (’) dans les chaînes, `&nbsp;` avant `!` et `?` dans le JSX.

## Décisions SEO (2026-08-08)

- Mot-clé principal : « promeneur de chien » + ville (validé par analyse des SERPs — c'est le terme utilisé par tous les concurrents qui rankent).
- Title ≤ 60 caractères, meta description ≤ 155 : vérifier la longueur à chaque modification de `site.seo`.
- Positionnement assumé premium (20 €/h vs 7-12 € sur les marketplaces type Rover/Gudog) justifié par : balade individuelle d'1 h + prise en charge à domicile. Toujours mettre ces différenciateurs en avant.
- Pas d'`aggregateRating` dans le JSON-LD tant qu'il n'y a pas de vrais avis.

## Performance (Lighthouse/PSI — état au 2026-08-08)

- Scores PSI : desktop 100 partout ; mobile 92/100/100/100 (le 92 est structurel : grande photo hero + 3 polices custom sur 4G simulée).
- **Ne jamais animer l'opacité de l'image hero** (élément LCP) : elle doit être visible dès le HTML initial. Elle utilise `preload` (l'ancien `priority` est déprécié en Next 16 et n'émet plus rien).
- Toute image affichée via `next/image` doit avoir ses variantes `<nom>-{640,828,1080,1200}.webp` dans `public/images/` (exigées par `lib/image-loader.ts` en préview). Génération : `sharp` est dispo via node — `sharp(src).resize({width:w}).webp({quality:~65}).toFile(...)`.
- Polices : graisses fixes uniquement (Nunito 400/500/600/700, Caveat 400), seule Anton est préchargée. Ne pas rajouter de graisse/police sans vérifier l'impact LCP.
- `experimental.inlineCss` est actif (one-page → CSS dans le HTML).

## À faire avant mise en ligne

- [ ] Remplacer le domaine placeholder `https://dog-aventure.fr` par le domaine réel du client (`site.config.ts`, champ `url`)
- [ ] Remplacer les avis de démonstration (`site.config.ts`, `reviews`) par de vrais avis Google — risque légal sinon
- [ ] Créer la fiche Google Business Profile du client (levier SEO local n° 1, devant le site)
- [ ] Brancher Google Search Console et soumettre `/sitemap.xml`
