# Dog Aventure — one-page « Promenade de chiens » (Louvres, 95380)

Site vitrine one-page pour un promeneur de chiens solo : balade individuelle
avec prise en charge et retour à domicile, **à partir de 14,90 €** (25-30 min ;
1 heure à 20 €). Pensé pour du trafic Facebook Ads mobile (prix + appel above
the fold, barre d'appel fixe) et pour appuyer une fiche Google (villes
desservies partout, JSON-LD `LocalBusiness` avec `areaServed`).

Next.js · TypeScript · Tailwind CSS v4 · shadcn/ui (base-ui) · Motion. Même
architecture rebrandable que la famille de templates restaurants
(`../exemple1` à `../exemple5`) — effets Magic UI vendorés dans
`components/fx/`.

```bash
npm install
npm run dev     # http://localhost:3777 (le port est fixé dans package.json)
npm run build   # build de production
```

## Contenu — `content/site.config.ts`

Tout le site rend depuis ce fichier typé (`content/types.ts`) :

- **`towns`** : les villes desservies — affichées dans le marquee sous le
  hero, la section `#zones`, le footer et le JSON-LD `areaServed`. C'est
  l'argument n°1 du client : le prospect doit voir sa ville.
- **`services`** : un tableau — « La petite balade » (25-30 min, 14,90 €) et
  « La balade d'1 heure » (20 €, `highlight: true`). Pour lancer l'offre
  « Dog Aventure » (2 h en forêt, 29,90 €), **ajouter une entrée** ici : carte,
  JSON-LD et prix suivent tout seuls (`formatPrice` gère les décimales à la
  française). Le hero affiche `Math.min(services)` derrière un « à partir de ».
- **`siret` et `legal`** : la barre du bas du footer et la page
  `/mentions-legales`. Tout champ de `legal` laissé vide s'affiche
  `[à compléter]` sur la page — volontairement visible.
- **`breeds`** : les races du secteur (Golden, Berger Australien, Staffy,
  Caniche) — photos + notes de la section `#chiens`.
- **`reviews`** : ⚠️ **avis de démonstration** — à remplacer par les vrais
  avis Google dès qu'il y en a. Le JSON-LD n'inclut volontairement **pas**
  d'`aggregateRating` ni d'horaires (rien de réel à déclarer → risque de
  pénalité Google sinon).

## Réservation = téléphone / SMS uniquement

Pas de formulaire : liens `tel:+33745375080` et `sms:+33745375080` partout
(navbar, hero, service, zones, contact, barre fixe mobile
`components/layout/sticky-call-bar.tsx`).

## Rebrand

- **Couleurs** : bloc unique en tête d'`app/globals.css` — palette du flyer
  (crème `--cream`, vert forêt `--ink`, accent `--flame` assombri pour le
  contraste AA ; le vert vif du flyer vit dans `--leaf`, décoratif
  uniquement : icônes, sticker, accents sur fond sombre).
- **Typos** : `app/layout.tsx` — Anton (titres capitales), Nunito Sans
  (texte), Caveat (`font-script`, les accroches manuscrites).
- **Logo** : vectorisé depuis la source client par `scripts/trace-logo.js` —
  marque seule dans la navbar, logo complet dans le footer, favicon
  `app/icon.svg`. **Les trois SVG sont générés : ne pas les éditer à la main**
  (voir la section « Logo » de `CLAUDE.md`).

## À faire avant mise en production

- [ ] `metadataBase` dans `app/layout.tsx` → vrai domaine (placeholder
  `https://dog-aventure.fr`).
- [x] Photo du hero : vraies photos client (`scripts/prepare-photos.js`).
- [ ] Reste en photo de stock : `breeds/` (4 races) et `og.jpg` (1200 × 630,
  la vignette des partages Facebook — à refaire depuis la photo du client).
- [ ] Vrais avis Google à la place des avis de démonstration.
- [x] Logo définitif du client (navbar, footer, `app/icon.svg`).
- [ ] Liens Facebook/Instagram (`social` dans la config) — il fera de la pub
  Facebook, la page existera.
- [x] Mentions légales / SIRET dans le footer — page `/mentions-legales`.
- [ ] Compléter `site.legal` : `publisher`, `address`, `email`, `mediator`, et
  l'hébergeur définitif à la place de GitHub Pages.
- [ ] Plus tard : ajouter l'offre « Dog Aventure 2 h » dans `services`.
