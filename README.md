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

## Docker

```bash
docker compose --profile dev  up                # http://localhost:3777, rechargement à chaud
docker compose --profile prod up -d --build     # http://localhost:3000, image de prod
docker compose --profile prod logs -f           # suivre les logs
docker compose --profile prod down              # arrêter
```

Sans `--profile`, `docker compose up` ne démarre **rien** : c'est voulu, pour
ne pas lancer la prod en croyant lancer le dev.

Un seul `Dockerfile`, deux cibles :

| Cible    | Sert à                | Contenu                                              |
| -------- | --------------------- | ---------------------------------------------------- |
| `dev`    | profil `dev`          | `next dev`, sources montées en volume depuis l'hôte  |
| `runner` | profil `prod`         | `.next/standalone` + `public` + `.next/static`, sans le code source ni les dépendances de build |

`next.config.ts` choisit la sortie selon l'environnement : `output: "export"`
quand `GITHUB_PAGES=true` (la préview), `output: "standalone"` partout ailleurs
(c'est ce que copie l'étage `runner`). Les deux ne peuvent pas coexister.

> La doc Next recommande `npm run dev` **hors** Docker sur macOS et Windows :
> la surveillance de fichiers à travers un volume monté est nettement plus
> lente. Le profil `dev` existe pour reproduire l'environnement Linux, pas pour
> remplacer le confort du dev local.

### Mise en ligne derrière Cloudflare

Le conteneur de prod n'écoute que sur `127.0.0.1:3000` : il n'est pas joignable
depuis l'internet en direct, et c'est intentionnel. Deux façons de l'exposer :

- **Cloudflare Tunnel** (le plus simple) — `cloudflared` sur la machine pointe
  vers `http://localhost:3000`. Aucun port à ouvrir, aucune IP publique
  nécessaire, le certificat est géré par Cloudflare.
- **DNS + reverse proxy** — enregistrement A vers l'IP du serveur, nuage orange
  activé, et un nginx/Caddy qui termine le TLS devant le conteneur.

Trois réglages Cloudflare à vérifier, ils cassent le site s'ils sont mal posés :

1. **SSL/TLS en « Full (strict) »**, jamais « Flexible » — en Flexible,
   Cloudflare parle en HTTP au serveur alors que le site se croit en HTTPS :
   boucle de redirection et contenu mixte.
2. **Rocket Loader désactivé** — il réordonne l'exécution des scripts et casse
   l'hydratation React.
3. **Auto Minify laissé sur off** — Next livre déjà du JS et du CSS minifiés
   (le CSS est même inliné dans le HTML), une seconde passe n'apporte rien et
   peut abîmer la sortie.

`/_next/static/*` est servi avec un cache immuable : Cloudflare le met en cache
sans réglage particulier.

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

- [x] Domaine réel : `https://dog-aventure.com` (`content/site.config.ts`,
  champ `url` — `metadataBase` en découle).
- [x] Photo du hero : vraie photo client (`scripts/prepare-photos.js`).
- [ ] Reste en photo de stock : `og.jpg` (1200 × 630, la vignette des partages
  Facebook — à refaire depuis la photo du client).
- [ ] Vrais avis Google à la place des avis de démonstration.
- [x] Logo définitif du client (navbar, footer, `app/icon.svg`).
- [ ] Liens Facebook/Instagram (`social` dans la config) — il fera de la pub
  Facebook, la page existera.
- [x] Mentions légales / SIRET dans le footer — page `/mentions-legales`.
- [ ] Compléter `site.legal` : `publisher`, `address`, `email`, `mediator`, et
  l'hébergeur définitif à la place de GitHub Pages.
- [ ] Plus tard : ajouter l'offre « Dog Aventure 2 h » dans `services`.
