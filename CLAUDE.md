@AGENTS.md

# Dog Aventure — site vitrine client

Site one-page Next.js pour un promeneur de chiens indépendant basé à Louvres (95).
Projet client : le contenu final (domaine, avis, photos) arrive au fil de l'eau.

## Commandes

- `npm run dev` — serveur de dev sur le **port 3777** (pas 3000)
- `npm run build` — seule vérification du projet (pas de suite de tests) : toujours la lancer après une série de modifications
- `npm run lint` — ESLint

## Docker (2026-08-10)

- `docker compose --profile dev up` (port 3777, à chaud) et `docker compose --profile prod up -d --build` (port 3000). **Sans `--profile`, rien ne démarre** — volontaire.
- Un `Dockerfile`, deux cibles : `dev` et `runner`. `runner` est bâti sur `.next/standalone`, tourne en utilisateur non-root et embarque un `HEALTHCHECK`.
- **`next.config.ts` a désormais trois modes mutuellement exclusifs** : `output: "export"` + `basePath` si `GITHUB_PAGES=true`, sinon `output: "standalone"`. Ne jamais les cumuler — Next refuse.
- **`standalone` n'embarque ni `public/` ni `.next/static/`** : le Dockerfile les copie explicitement. Si ces deux `COPY` sautent, le site répond 200 mais sans aucune image ni police.
- Alpine (musl) et pas Debian : la doc Next signale un problème d'allocateur mémoire de `sharp` sur les Linux glibc. `sharp` arrive comme dépendance de `next` (0.35.3), il n'est pas à installer à la main.
- Testé sans Docker (non installé sur le poste) en rejouant l'étage `runner` à la main : `cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/ && PORT=3999 node .next/standalone/server.js`. Accueil, mentions, sitemap, assets et `/_next/image` répondent tous 200. **L'image elle-même n'a jamais été construite** — à faire à la première machine équipée.
- Réglages Cloudflare qui cassent le site : SSL en « Flexible » (boucle de redirection), Rocket Loader (casse l'hydratation), Auto Minify. Détail dans le README.
- **Profil `traefik`** (mise en ligne) : aucun port publié, le proxy joint le conteneur par le réseau externe `${TRAEFIK_NETWORK:-n8n-network}`. Labels calqués sur les autres sites du serveur (TLS letsencrypt, redirection www → apex, en-têtes de sécurité, rate limit).
- **La CSP est spécifique à ce site, ne pas la recopier d'ailleurs** : `frame-src https://www.google.com` est obligatoire (iframe Maps de `#zones`, seule origine externe de la page — sans elle la carte est blanche), et il ne faut **pas** de `fonts.googleapis/gstatic` puisque `next/font` sert les polices depuis le domaine. `style-src 'unsafe-inline'` est requis par `experimental.inlineCss`. `'unsafe-eval'` est volontairement absent de `script-src` — vérifier la console au premier déploiement.
- Le rate limit porte `sourceCriterion.requestHeaderName=CF-Connecting-IP` : derrière Cloudflare, Traefik ne verrait sinon que les IP des serveurs Cloudflare et renverrait des 429 à de vrais visiteurs.
- Volume nommé `image-cache` sur `/app/.next/cache` : sans lui `next/image` ré-encode toutes les images à chaque redémarrage. Le dossier est créé dans le Dockerfile avec le bon propriétaire pour que le volume en hérite.

## En ligne depuis le 2026-08-10

- **https://dog-aventure.com** — Docker + Traefik sur le Raspberry Pi 5 du réalisateur, profil `traefik`. Build ARM : 67 s. Vérifié en ligne : accueil, `/mentions-legales`, `sitemap.xml`, `robots.txt`, assets et `/_next/image` (WebP, sharp tourne sur ARM) répondent tous 200, `www` redirige en 301 vers l'apex.
- **Deux certificats, aucun chez IONOS** : Cloudflare Universal SSL côté visiteur, Let's Encrypt via Traefik côté origine. IONOS n'est plus que registrar — son alerte « pas de SSL » ne concerne que son propre hébergement, vide. Ne rien y acheter.
- Serveurs de noms délégués à Cloudflare (`dara` + `mario.ns.cloudflare.com` — Cloudflare réutilise la même paire pour toutes les zones d'un même compte, celle de voice-doc.com était donc la bonne).
- La préview GitHub Pages reste en service et garde son intérêt : c'est le lien à envoyer au client pour valider une modification avant qu'elle ne parte en production.
- **Mise à jour du contenu** : `npm run build` → `git push` → `npm run deploy`. Le contenu étant compilé dans la page, toute modification de `site.config.ts` impose une reconstruction de l'image, pas un simple redémarrage. `scripts/deploy.sh` tourne sur le Pi, attend le healthcheck et vérifie que le site répond 200 avant de se déclarer réussi.

## Préview client (GitHub Pages)

- URL à partager au client : **https://thomas-soft.github.io/dog-aventure/** — redéployée à chaque push sur `main` (`.github/workflows/deploy-pages.yml`).
- Le build préview est activé par `GITHUB_PAGES=true` : export statique + basePath `/dog-aventure` + loader d'images custom (`lib/image-loader.ts`). Ces options ne doivent jamais servir pour la mise en ligne réelle (qui se fera sur un hébergeur Next.js avec le domaine du client).
- Pas de `noindex` sur la préview : il coûtait 34 points de SEO à Lighthouse. C'est le canonical vers `site.url` qui la protège du duplicate content.
- Next ne préfixe le basePath qu'aux URLs qu'il génère : tout `<img>`/`<a>` écrit à la main doit passer par `asset()` (`lib/utils.ts`).

## Règle d'or : le contenu vit dans `content/site.config.ts`

- Tout texte, prix, ville, avis ou image éditable passe par `content/site.config.ts` (types dans `content/types.ts`). Ne jamais coder de contenu en dur dans les composants.
- **Exception connue** : le H1 du hero (`components/sections/hero.tsx`) est en dur pour sa mise en forme sur deux lignes — le garder synchronisé avec `site.slogan`.
- `site.url` est la source unique du domaine : utilisée par `metadataBase`, le canonical, `app/robots.ts`, `app/sitemap.ts` et le JSON-LD. Ne jamais écrire le domaine ailleurs.

## Rédaction (copy française)

- Voix à la première personne (« je »), le prestataire parle directement — jamais « nous ».
- Le message doit rester cohérent : c'est LUI qui promène le chien, pas le client (une v1 du slogan disait « Promenez-le » — erreur déjà corrigée, ne pas la réintroduire).
- Apostrophes typographiques (’) dans les chaînes, `&nbsp;` avant `!` et `?` dans le JSX.
- **Le site ne vend que des balades (décision client, 2026-08-10).** Le texte fourni par le client mentionne aussi des « visites à domicile » et des « séances d'éducation » : elles sont volontairement absentes du site, faute de tarif et de description. Ne pas les ajouter sans que le client les ait cadrées. « Formé en éducation canine » (`trust.credential`) est une **qualification**, pas une prestation — c'est la seule occurrence autorisée du mot.
- **Rien de biographique.** Le client raconte volontiers son enfance et les chiens de sa vie ; ça n'aide pas un maître à décider et c'est écarté à la réécriture. Ne garder que ce qui rassure le client sur ce qui arrive à SON chien pendant l'heure où il n'est pas là.

## Section confiance (2026-08-10)

- `components/sections/trust.tsx` (ancre `#confiance`), entre « La promenade » et « Où j'interviens » — la place laissée par la section des races supprimée le même jour, et elle en reprend le bandeau `border-y bg-surface` qui tient le rythme crème → surface → sombre.
- Contenu dans `site.trust` : `credential` (la qualification, seule en bandeau au-dessus), `points` (4 cartes) et `signature` (la phrase manuscrite de fin).
- **L'ACACED est mis en avant seul**, au-dessus des quatre autres arguments : c'est la seule preuve *vérifiable* de la page, tout le reste n'est qu'un engagement. Repris en `hasCredential` dans le JSON-LD (`app/layout.tsx`).
- Quatre points, pas cinq : la grille est en `lg:grid-cols-4`. Le renforcement des bonnes habitudes (laisse, calme, rappel) est fondu dans le bloc ACACED — il découle de la formation, il n'a pas besoin de sa carte.

## Décisions SEO (2026-08-08)

- Mot-clé principal : « promeneur de chien » + ville (validé par analyse des SERPs — c'est le terme utilisé par tous les concurrents qui rankent).
- Title ≤ 60 caractères, meta description ≤ 155 : vérifier la longueur à chaque modification de `site.seo`.
- Positionnement assumé premium (20 €/h vs 7-12 € sur les marketplaces type Rover/Gudog) justifié par : balade individuelle + prise en charge à domicile. Toujours mettre ces différenciateurs en avant.
- **Échelle de prix (2026-08-09, révisée le 2026-08-11)** : « La balade d'1 heure » à 20 € et « La petite balade » **20 min** à 14,90 € (soit **44,70 €/h**). La courte est un prix d'appel — elle sert le « à partir de 14,90 € » du hero et de la meta description ; l'heure reste la meilleure valeur et garde `highlight: true`. Ne pas inverser cette hiérarchie.
- **Hiérarchie des deux offres (demande client du 2026-08-11)** : Martin veut que l'heure soit clairement l'offre par défaut et que la courte soit assumée comme un dépannage. Traduit par quatre choix, à garder ensemble : l'heure **passe en premier** dans le tableau `services` (l'ordre du tableau = l'ordre des cartes) ; sa carte garde seule le cadre orange, le prix en couleur, les pastilles de features en orange et le bouton plein — la courte passe en contour et en gris ; le badge devient **« La plus demandée »** (icône `Star`) ; le champ `priceNote` affiche le tarif ramené à l'heure **sur les deux cartes**, 20 €/h contre 44,70 €/h. C'est ce `priceNote` qui fait la démonstration — le retirer d'une seule des deux le transformerait en argument de vente.
- Le texte de « La petite balade » la dévalorise volontairement (« le strict minimum », « prenez plutôt l'heure ») : c'est la demande du client, pas une maladresse de rédaction. Ne pas la « réhabiliter » à la relecture.
- « C'est la balade que prennent presque tous mes clients » est une **affirmation du client sur sa propre activité**, pas une statistique mesurée. C'est lui qui l'assume ; ne pas la chiffrer (« 9 clients sur 10 ») et ne pas l'étendre à d'autres formulations.
- Le hero lit `Math.min(services)`, plus `services[0]` : l'ordre du tableau `services` n'engage que l'ordre des cartes.
- Pas d'`aggregateRating` dans le JSON-LD tant qu'il n'y a pas de vrais avis.

### Placement du mot-clé dans les titres (audit du 2026-08-09)

- Le mot-clé ne vivait dans **aucun** des six titres de la page : le h1 et les h2 sont de la copy chaleureuse (« Je le promène… », « Une balade rien que pour lui »). Il est désormais porté par le **h2 de la section `#zones`** — « Promeneur de chien à Louvres et alentours » — dont le sujet est précisément le secteur couvert. C'est le seul titre factuel du site, et c'est volontaire : les autres gardent la voix.
- **Le h1 reste le slogan**, décision assumée : c'est l'accroche de la marque, il est en dur pour sa mise en forme sur deux lignes, et le title + la meta description portent déjà le mot-clé en tête. Ne pas le « SEO-iser » sans en reparler au client.
- Le reste de l'audit était propre : un seul h1, hiérarchie sans saut, 7/7 images avec `alt` (le `alt=""` de la marque est correct, elle est décorative), JSON-LD `LocalBusiness` complet, canonical + Open Graph + Twitter sur les deux pages, `og.jpg` en 1200×630.

## Performance (Lighthouse/PSI — état au 2026-08-08)

- Scores PSI : desktop 100 partout ; mobile 92/100/100/100 (le 92 est structurel : grande photo hero + 3 polices custom sur 4G simulée).
- **Ne jamais animer l'opacité de l'image hero** (élément LCP) : elle doit être visible dès le HTML initial. Elle utilise `preload` (l'ancien `priority` est déprécié en Next 16 et n'émet plus rien).
- Toute image affichée via `next/image` doit avoir ses variantes `<nom>-{640,828,1080,1200}.webp` dans `public/images/` (exigées par `lib/image-loader.ts` en préview). Génération : `sharp` est dispo via node — `sharp(src).resize({width:w}).webp({quality:~65}).toFile(...)`.
- **Photo du hero (2026-08-09)** — vraie photo du client, originaux dans `scripts/photos/`, recadrage et encodage par `node scripts/prepare-photos.js`. Deux choses à savoir avant d'y toucher :
  - C'est une photo de téléphone en plein soleil : l'herbe sèche et le feuillage sont du bruit haute fréquence qui fait doubler le poids WebP. Le script applique un `blur(0.7)` suivi d'un `sharpen()` — 70 Ko au lieu de 82 à 640 px, sans le rendu plastique d'un `median(3)`.
  - **La largeur d'une variante n'est pas celle de son nom.** `lib/image-loader.ts` choisit un *slot* parmi `[640, 828, 1080, 1200]`, rien n'oblige le fichier à faire cette largeur : la source ne fait que 878 px, inutile de sur-échantillonner (`hero-1200` pesait 229 Ko pour rien). Voir la table `PHOTOS` du script.
- **Une seule photo dans le hero.** Une seconde, en médaillon dans le coin du cadre, a été essayée puis retirée : deux photos de la même personne, même tenue, même décor, l'une posée sur l'autre, ça faisait collage. L'original (`scripts/photos/balade-chemin.jpg`) est conservé pour la replacer ailleurs, avec son recadrage noté dans le script.
- Polices : graisses fixes uniquement (Nunito 400/500/600/700, Caveat 400), seule Anton est préchargée. Ne pas rajouter de graisse/police sans vérifier l'impact LCP.
- `experimental.inlineCss` est actif (one-page → CSS dans le HTML).

## Logo (2026-08-09, source remplacée le même jour)

- Trois assets, tous générés par `scripts/trace-logo.js` — **ne jamais les éditer à la main** :
  `public/images/logo.svg` (complet, footer), `public/images/logo-mark.svg` (marque seule, barre de navigation), `app/icon.svg` (favicon).
- Source : `scripts/logo-source.jpg`, **1254×1254 px**, le dessin y occupe 1024×881 px **d'un seul vert `#327E1C`**. Elle remplace la première capture d'écran où le logo ne faisait que 160×149 px et mêlait deux verts ; toute la machinerie de séparation colorimétrique (profondeur au fond, germes, BFS) a disparu du script avec elle — un seuil de couverture suffit désormais.
- Relancer : `npm i --no-save potrace && node scripts/trace-logo.js`. Le script cadre tout seul sur le dessin (`contentBox`) — pas de constante de crop à ajuster si la source change.
- Deux tris purement géométriques dans le script : `RING_R` (340 px source) sépare les onze lettres, dont le centre est à r ≥ 387, des morceaux du personnage, tous à r ≤ 307 ; `removeGroundLine()` retire le trait de sol de la **marque seule** (avec lui, la marque fait 1,24 de ratio et à 40 px le bandeau mange toute la largeur).
- Le favicon est retracé à part sur un masque réduit à 200 px avec une tolérance large : 5,9 Ko au lieu de 15-20 Ko, pour un rendu identique à 32 px.
- Ratios à respecter côté composants : logo complet **1,160**, marque **1,243**. La marque n'est **pas carrée** — `h-10 w-auto` dans la barre, jamais `size-10`.
- Marque seule dans la barre de navigation, logo complet dans le footer : à 40 px, le texte en arc n'est qu'un anneau de taches.
- Servis en `<img>` (via `asset()`), pas en SVG inline ni en `next/image` : l'optimiseur Next refuse les SVG, et un SVG inline dans la barre — composant client — pèserait deux fois, dans le HTML **et** dans le bundle JS. Mesuré : +5,9 Ko en fichier contre +12,5 Ko en inline.
- Le fichier vectoriel d'origine (SVG/AI/PDF) reste préférable, mais ce n'est plus un problème pour le web : à 1024 px de source, le tracé est propre. C'est pour l'impression (flyer, marquage véhicule) qu'il faudra le demander.

## Mentions légales (2026-08-09)

- Page `/mentions-legales` (`app/mentions-legales/page.tsx`), liée depuis la barre du bas du footer. SIRET affiché aussi dans cette barre et repris dans le JSON-LD (`identifier` en `PropertyValue`, pas `taxID` : le SIRET identifie un établissement, pas une fiscalité).
- Les champs vivent dans `site.legal`. **Un champ vide s'affiche `[à compléter]` en clair sur la page** — c'est voulu, pour qu'on ne l'oublie pas.
- `Navbar` et `Footer` sont maintenant rendus sur deux pages : leurs ancres sont préfixées (`/#service`) et passent par `next/link`, seul moyen d'ajouter le basePath de la préview.

## À faire avant mise en ligne

- [x] ~~**Domaine réel**~~ — `https://dog-aventure.com`, confirmé par le client le 2026-08-10 (`site.config.ts`, champ `url`). Attention : **le `.com`, pas le `.fr`** qui servait de placeholder. Reste à ce que le domaine serve effectivement le site — d'ici là, le canonical de la préview désigne une adresse qui ne répond pas encore, ce qui est le comportement voulu.
- [x] ~~**Crédit du réalisateur**~~ — « Thomas Tofil », lié à `https://thomastofil.fr` (2026-08-10).
- [ ] Remplacer les avis de démonstration (`site.config.ts`, `reviews`) par de vrais avis Google — risque légal sinon
- **Section « Médiation de la consommation » retirée le 2026-08-10, décision client.** Le champ `mediator` n'existe plus (config, types et page). À savoir si la question revient : l'article L.612-1 impose bien à un professionnel vendant à des particuliers d'adhérer à un médiateur agréé et de le mentionner. Ce n'est pas une information à trouver, c'est un abonnement à souscrire — on ne peut donc pas remplir le champ à la place du client. Section retirée plutôt que laissée avec un `[à compléter]` visible en production, ce qui donnait un site inachevé. La rétablir seulement si Martin adhère à un médiateur.
- [x] ~~Reste de `site.legal`~~ — `publisher` (Martin Tofil), `address` (29 Rue Branly, 95380 Louvres), `email` (Dogflow@outlook.fr) renseignés le 2026-08-10. `host`/`hostAddress` corrigés le même jour : le site ayant quitté GitHub Pages pour le Pi, déclarer GitHub était devenu faux — c'est désormais « Thomas Tofil, Louvres (95380) », l'exploitant de la machine. Cloudflare n'est **pas** l'hébergeur, seulement un intermédiaire technique.
- [ ] Créer la fiche Google Business Profile du client (levier SEO local n° 1, devant le site)
- [ ] Brancher Google Search Console et soumettre `/sitemap.xml`
- [ ] Pour l'impression seulement : demander le fichier vectoriel du logo (SVG/AI/PDF) et relancer `scripts/trace-logo.js`
