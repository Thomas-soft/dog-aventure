# Dog Aventure — one-page « Promenade de chiens » (Louvres, 95380)

Site vitrine one-page pour un promeneur de chiens solo : balade individuelle
d'1 heure avec prise en charge et retour à domicile, **20 €**. Pensé pour du
trafic Facebook Ads mobile (prix + appel above the fold, barre d'appel fixe)
et pour appuyer une fiche Google (villes desservies partout, JSON-LD
`LocalBusiness` avec `areaServed`).

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
- **`services`** : un tableau — une seule offre pour l'instant (« La balade
  d'1 heure », 20 €). Pour lancer l'offre « Dog Aventure » (2 h en forêt,
  29,90 €), **ajouter une entrée** ici : carte, JSON-LD et prix suivent tout
  seuls (`formatPrice` gère les décimales à la française).
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
- **Logo** : logo texte (`TreePine` + nom) en attendant le logo définitif du
  client — navbar + footer.

## À faire avant mise en production

- [ ] `metadataBase` dans `app/layout.tsx` → vrai domaine (placeholder
  `https://dog-aventure.fr`).
- [ ] Remplacer les photos placeholders de `public/images/` (hero, breeds/,
  og.jpg 1200 × 630) par de vraies photos client si possible.
- [ ] Vrais avis Google à la place des avis de démonstration.
- [ ] Logo définitif du client (navbar, footer, `app/icon.svg`).
- [ ] Liens Facebook/Instagram (`social` dans la config) — il fera de la pub
  Facebook, la page existera.
- [ ] Mentions légales / SIREN dans le footer.
- [ ] Plus tard : ajouter l'offre « Dog Aventure 2 h » dans `services`.
