@AGENTS.md

# Dog Aventure — site vitrine client

Site one-page Next.js pour un promeneur de chiens indépendant basé à Louvres (95).
Projet client : le contenu final (domaine, avis, photos) arrive au fil de l'eau.

## Commandes

- `npm run dev` — serveur de dev sur le **port 3777** (pas 3000)
- `npm run build` — seule vérification du projet (pas de suite de tests) : toujours la lancer après une série de modifications
- `npm run lint` — ESLint

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
- Images sources : viser < 300 Ko (compresser avant d'ajouter dans `public/`).

## À faire avant mise en ligne

- [ ] Remplacer le domaine placeholder `https://dog-aventure.fr` par le domaine réel du client (`site.config.ts`, champ `url`)
- [ ] Remplacer les avis de démonstration (`site.config.ts`, `reviews`) par de vrais avis Google — risque légal sinon
- [ ] Créer la fiche Google Business Profile du client (levier SEO local n° 1, devant le site)
- [ ] Brancher Google Search Console et soumettre `/sitemap.xml`
