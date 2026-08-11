# Dog Aventure — one-page « Promenade de chiens » (Louvres, 95380)

Site vitrine one-page pour un promeneur de chiens solo : balade individuelle
avec prise en charge et retour à domicile. L'offre à vendre est **la balade
d'1 heure à 22,90 €**, dégressive par carnet (21,50 € en Pack 10, 20 € en
Pack 20) ; la courte (20 min, 14,90 €) n'est qu'un prix d'appel et le
site l'assume comme telle. Pensé pour du trafic Facebook Ads mobile (prix + appel above
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
docker compose --profile dev     up             # http://localhost:3777, rechargement à chaud
docker compose --profile prod    up -d --build  # http://localhost:3000, image de prod en local
docker compose --profile traefik up -d --build  # mise en ligne, derrière Traefik
docker compose --profile prod    logs -f        # suivre les logs
docker compose --profile prod    down           # arrêter
```

Sans `--profile`, `docker compose up` ne démarre **rien** : c'est voulu, pour
ne pas lancer la prod en croyant lancer le dev.

| Profil    | Service | Exposition                  | Sert à                          |
| --------- | ------- | --------------------------- | ------------------------------- |
| `dev`     | `dev`   | `3777` sur l'hôte           | développer                      |
| `prod`    | `web`   | `127.0.0.1:3000`            | vérifier l'image avant déploiement |
| `traefik` | `site`  | **aucun port publié**       | la mise en ligne réelle         |

Un seul `Dockerfile`, deux cibles : `dev` (sources montées en volume) et
`runner` (`.next/standalone` + `public` + `.next/static`, sans le code source
ni les dépendances de build).

`next.config.ts` choisit la sortie selon l'environnement : `output: "export"`
quand `GITHUB_PAGES=true` (la préview), `output: "standalone"` partout ailleurs
(c'est ce que copie l'étage `runner`). Les deux ne peuvent pas coexister.

> La doc Next recommande `npm run dev` **hors** Docker sur macOS et Windows :
> la surveillance de fichiers à travers un volume monté est nettement plus
> lente. Le profil `dev` existe pour reproduire l'environnement Linux, pas pour
> remplacer le confort du dev local.

### Mise en ligne — Traefik + Cloudflare

Le profil `traefik` ne publie **aucun port** : Traefik joint le conteneur par le
réseau Docker partagé. Publier un port ici ouvrirait un accès en clair qui
contournerait le proxy, ses en-têtes de sécurité et sa limitation de débit.

Le réseau attendu est celui où tourne déjà Traefik, `n8n-network` par défaut.
Pour un autre nom, pas besoin de modifier le fichier :

```bash
TRAEFIK_NETWORK=mon-reseau docker compose --profile traefik up -d --build
```

**La CSP est taillée pour ce site**, à partir des origines réellement présentes
dans le HTML produit — ne pas la recopier d'un autre projet :

- `frame-src https://www.google.com` — l'iframe Maps de la section « Où
  j'interviens ». C'est la **seule** origine externe de toute la page ; sans
  cette directive, la carte reste blanche.
- **Pas de `fonts.googleapis.com` ni `fonts.gstatic.com`** : `next/font`
  télécharge les polices au build et les sert depuis le domaine.
- `style-src 'unsafe-inline'` est obligatoire — le CSS est inliné dans le HTML
  (`experimental.inlineCss`).
- `script-src` est **sans `'unsafe-eval'`**, volontairement. Un build Next de
  production n'en a pas besoin. À vérifier dans la console du navigateur au
  premier déploiement : si une erreur CSP mentionne `eval`, ajouter
  `'unsafe-eval'` à cette seule directive plutôt que d'élargir le reste.

**Limitation de débit derrière Cloudflare** : le middleware utilise
`sourceCriterion.requestHeaderName=CF-Connecting-IP`. Sans ça, Traefik ne voit
que les IP des serveurs Cloudflare, agrège tout le trafic d'un même point de
présence sur un seul compteur et finit par renvoyer des 429 à de vrais
visiteurs. Pour que les logs Traefik affichent aussi la vraie IP, il faut
déclarer les plages Cloudflare en `forwardedHeaders.trustedIPs` sur
l'entrypoint — ça se règle dans la configuration statique de Traefik, pas ici.

### Modifier le site en production

Le contenu est compilé dans la page au moment du build : changer
`content/site.config.ts` demande donc une reconstruction, pas seulement un
redémarrage. Le cycle complet :

```bash
# sur le Mac
# … modifier content/site.config.ts …
npm run build          # vérifier que ça compile
git commit -am "…" && git push
npm run deploy         # pousse en production sur le Pi
```

`npm run deploy` se connecte en SSH au Pi et y lance `scripts/deploy.sh`, qui
récupère la branche, reconstruit l'image, **attend le healthcheck**, vérifie que
`https://dog-aventure.com` répond 200, puis nettoie les images orphelines. Il
sort en erreur si l'une de ces étapes échoue — pas de déploiement silencieusement
cassé.

Si l'hôte SSH n'est pas `pi` ou le chemin pas `~/server/dog-aventure` :

```bash
PI_HOST=user@192.168.1.42 PI_PATH=~/sites/dog-aventure npm run deploy
```

Le `git push` met aussi à jour la préview GitHub Pages. C'est l'ordre utile :
on valide sur la préview, on déploie ensuite.

### Les certificats — deux, et aucun chez IONOS

Il y a deux liaisons TLS distinctes, chacune avec son propre certificat, tous
les deux gratuits et renouvelés automatiquement :

| Liaison | Certificat | Émis par |
| ------- | ---------- | -------- |
| visiteur → Cloudflare | Universal SSL | Cloudflare (Google Trust Services) |
| Cloudflare → Pi | Let's Encrypt | Traefik, `certresolver=letsencrypt` |

**Ne rien acheter ni activer chez IONOS.** IONOS ne fait plus que registrar : il
propose un certificat pour *son* hébergement, qui ne sert pas ce site. Son
avertissement « votre domaine ne dispose pas du protocole SSL » ne regarde que
son propre serveur, vide — le domaine sert bien du HTTPS valide.

### DNS — la configuration en place

Serveurs de noms délégués à Cloudflare depuis IONOS (onglet **Serveur de
noms**, « Vos serveurs de noms »). Les paramètres DNS IONOS deviennent alors
inactifs, c'est normal : la zone vit chez Cloudflare.

| Enregistrement | Valeur | Proxy |
| -------------- | ------ | ----- |
| `A` `dog-aventure.com` | IP publique du Pi | 🟠 proxifié |
| `CNAME` `www` | `dog-aventure.com` | 🟠 proxifié |
| `MX` × 2, `TXT` (SPF) | IONOS | ⚪ DNS only |
| `CNAME` `autodiscover`, `_dmarc` | IONOS | ⚪ DNS only |

Le nuage orange ne vaut que pour les noms qui servent le site en HTTP. Sur les
autres il ne protège rien et casse : proxifié, `_dmarc` ne renvoie plus aucun
TXT (la politique DMARC disparaît) et `autodiscover` répond 521, la cible IONOS
n'écoutant qu'en HTTP. Une `AAAA` héritée d'IONOS doit être supprimée : elle
enverrait Cloudflare vers l'ancien hébergeur une fois sur deux.

L'IP est résidentielle : si l'opérateur la change, le `A` devient faux et le
site tombe. Un DDNS qui met à jour l'enregistrement via l'API Cloudflare règle
la question.

Trois réglages côté Cloudflare, qui cassent le site s'ils sont mal posés :

1. **SSL/TLS en « Full (strict) »**, jamais « Flexible ». Traefik présente un
   certificat Let's Encrypt valide, donc « Full (strict) » fonctionne. En
   « Flexible », Cloudflare parle en HTTP à Traefik alors que le site se croit
   en HTTPS : boucle de redirection et contenu mixte.
2. **Rocket Loader désactivé** — il réordonne l'exécution des scripts et casse
   l'hydratation React.
3. **Auto Minify laissé sur off** — Next livre déjà du JS et du CSS minifiés.

Le nuage orange peut rester activé : le challenge HTTP-01 de Let's Encrypt
passe à travers le proxy Cloudflare. Si le certificat n'est pas délivré, passer
l'enregistrement en « DNS only » le temps de la première émission.

`/_next/static/*` est servi avec un cache immuable, Cloudflare le met en cache
sans réglage. Enfin, Next compresse déjà en gzip : le middleware `compress` de
Traefik laisse donc passer la réponse telle quelle. Pour obtenir du Brotli, il
faudrait passer `compress: false` dans `next.config.ts` — gain modeste sur un
site de cette taille, non fait.

## Contenu — `content/site.config.ts`

Tout le site rend depuis ce fichier typé (`content/types.ts`) :

- **`towns`** : les villes desservies — affichées dans le marquee sous le
  hero, la section `#zones`, le footer et le JSON-LD `areaServed`. C'est
  l'argument n°1 du client : le prospect doit voir sa ville.
- **`services`** : un tableau, **dans l'ordre d'affichage des cartes** — « La
  balade d'1 heure » (22,90 €, `highlight: true`) d'abord, « La petite balade »
  (20 min, 14,90 €) ensuite. Le `priceNote` ramène les deux au tarif horaire
  (22,90 €/h contre 44,70 €/h) : c'est lui qui vend l'heure, pas la mise en forme.
  Pour lancer l'offre « Dog Aventure » (2 h en forêt, 29,90 €), **ajouter une
  entrée** ici : carte, JSON-LD et prix suivent tout seuls (`formatPrice` gère
  les décimales à la française). Le hero affiche `Math.min(services)` derrière
  un « à partir de », l'ordre du tableau ne l'influence pas.
- **`packs`** : la grille dégressive affichée sous les cartes (22,90 → 21,50 →
  20 € la balade). **Ne saisir que `quantity` et `total`** : le prix à la
  balade et l'économie sont calculés à l'affichage, et la colonne « à l'unité »
  lit le service `packs.serviceId` — le tarif de référence ne vit donc qu'à un
  seul endroit. Changer le prix de la balade d'1 h remet toute la grille
  d'aplomb, JSON-LD compris. `items: []` masque le bloc.
- **`siret` et `legal`** : la barre du bas du footer et la page
  `/mentions-legales`. Tout champ de `legal` laissé vide s'affiche
  `[à compléter]` sur la page — volontairement visible.
- **`trust`** : la section `#confiance` — l'ACACED mis en avant seul
  (`credential`, la seule preuve vérifiable de la page), puis quatre arguments
  (`points`) et la signature manuscrite. Rien de biographique ici.
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
- [x] `site.legal` complété : éditeur, adresse, e-mail, hébergeur.
- [ ] Plus tard : ajouter l'offre « Dog Aventure 2 h » dans `services`.
