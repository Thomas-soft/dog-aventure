/* ─────────────────────────────────────────────────────────────────────────
   Recadrage et encodage de toutes les photos client du site — à relancer si
   les originaux ou les cadrages changent.

     node scripts/prepare-photos.js

   Originaux dans scripts/photos/ (sorties de téléphone). Produit
   pour chaque photo le fichier de référence `<nom>.webp` — celui que lit
   l'optimiseur Next en production — et les quatre variantes
   `<nom>-{640,828,1080,1200}.webp` qu'exige lib/image-loader.ts en préview.

   Deux choses non évidentes, expliquées plus bas : le débruitage avant
   encodage, et le fait que le nom de la variante ne dit pas sa largeur.
   ───────────────────────────────────────────────────────────────────────── */
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "scripts/photos");
const OUT = path.join(ROOT, "public/images");

/* Photos de téléphone en plein soleil : l'herbe sèche et le feuillage sont du
   bruit haute fréquence, et le WebP y engloutit ses bits. Un flou léger le
   supprime, l'accentuation qui suit redonne le mordu là où il compte — les
   visages et les silhouettes. Mesuré sur la photo du hero à 640 px : 82 Ko
   sans rien, 70 Ko avec, et un visage plus propre qu'avec un median(3) (44 Ko
   mais un rendu lissé, plastique). */
const denoise = (p) => p.blur(0.7).sharpen({ sigma: 0.8, m1: 0.5, m2: 2 });

/* La largeur réelle n'est pas celle du nom de fichier. lib/image-loader.ts
   choisit une variante dans [640, 828, 1080, 1200] à partir de la largeur
   demandée par next/image, mais rien n'oblige le fichier à faire cette
   largeur-là : le navigateur le met à l'échelle. On s'en sert deux fois —
   pour ne pas sur-échantillonner une source de 878 px, et pour que le
   médaillon, jamais affiché au-delà de 168 px CSS, reste léger. */
const PHOTOS = [
  {
    name: "hero",
    src: "promeneur-et-chien.jpg",
    // 4/5 — le sujet occupe y 450→1390, on lui laisse ~78 px de marge en haut
    crop: { left: 0, top: 372, width: 878, height: 1097 },
    reference: [878, 62],
    variants: { 640: [640, 58], 828: [700, 52], 1080: [878, 52], 1200: [878, 52] },
  },
  {
    /* Le binôme en t-shirt « Promeneur de chiens », posé dans la section
       « Il est entre de bonnes mains » (2026-08-18). C'est la photo qui montre
       QUI est ce « on » employé partout dans les textes depuis le même jour —
       sans elle, le pluriel n'est qu'une tournure.

       Cadrage recalé le 2026-08-19 : le crâne de la personne de droite culmine
       à y=245 dans l'original, l'ancien `top: 250` le rasait donc exactement —
       une tête qui touche le bord de cadre, c'est le défaut le plus visible
       d'un portrait. Le haut remonte à 160, ce qui lui laisse 85 px de ciel
       (7 % de la hauteur) sans faire entrer autre chose que du thuya.

       Le bas, lui, ne descend plus jusqu'à 1412 : le dernier trait vert du
       logo imprimé sur le t-shirt de gauche s'arrête à y=1310 et tout ce qui
       suit n'est que du noir. On s'arrête à 1380 — 70 px de marge sous le
       logo, qui reste entier (c'est lui qui fait le lien avec la marque).

       Conséquence : le cadre n'est plus en 5/4 mais en 1,19 (1452 × 1220), un
       cheveu plus haut. `components/sections/trust.tsx` porte les mêmes
       dimensions en dur — les deux se relisent ensemble. */
    name: "equipe",
    src: "equipe.jpg",
    crop: { left: 0, top: 160, width: 1452, height: 1220 },
    reference: [1452, 62],
    /* Affichée au plus large dans un conteneur de 768 px CSS : le slot 1200
       (servi aux écrans 2×) est plafonné à 1100 px, au-delà on paie du poids
       que personne ne voit. */
    variants: { 640: [640, 58], 828: [828, 55], 1080: [1080, 55], 1200: [1100, 55] },
  },
  /* ─── La balade en forêt (2026-08-22) ──────────────────────────────────
     Le promeneur de dos, t-shirt floqué et numéro lisible, malinois en longe.
     Ouvre la section « La promenade », juste avant les tarifs — le visiteur
     voit la prestation, puis son prix.

     Ce n'est PAS un portrait de chien : elle n'a rien à faire dans la galerie
     `#chiens`, c'est la seule photo du site qui montre le service en train de
     se faire.

     Le cadrage est contraint par le sujet, pas choisi : le promeneur tient de
     la tête (y=890) aux semelles (y=1630), soit 740 px sur une source large de
     1242. Au-delà du 4/3, il ne reste plus de marge ni au-dessus du crâne ni
     sous les pieds — un 3/2 laisserait 28 px sous les semelles. D'où
     932 px de haut : ~90 px de ciel, ~100 px de sentier. */
  {
    name: "balade-foret",
    src: "balade-foret.jpg",
    crop: { left: 0, top: 800, width: 1242, height: 932 },
    reference: [1242, 62],
    /* Affichée en `max-w-3xl` (768 px CSS) : 1242 px est la largeur de la
       source, inutile de sur-échantillonner le slot 1200. */
    variants: { 640: [640, 58], 828: [828, 55], 1080: [1080, 55], 1200: [1242, 55] },
  },
  /* ─── Le shiba qui vient chercher sa caresse (2026-08-22) ───────────────
     Posée au bas de la carte « Comment ça marche ? », la colonne qui longe les
     tarifs : elle comble les ~450 px de vide que cette carte laissait face aux
     deux cartes d'offres, et met un museau à hauteur des prix.

     ⚠️ La source est une capture d'écran : 720 × 1560 avec des BANDES NOIRES
     en 0..139 et 1420..1559. Le contenu réel ne fait que 720 × 1280 — un
     cadrage qui ignore l'extraction ci-dessous ramène du noir dans la carte.

     4/3 et non carré : le carré (top 250) montre la queue enroulée en entier et
     rend mieux, mais il ajoute ~110 px à une carte qui dépasserait alors la
     colonne des offres. Le paysage garde la tête, le menton et la main. */
  {
    name: "caresse",
    src: "caresse.jpg",
    crop: { left: 0, top: 345, width: 720, height: 540 },
    reference: [720, 62],
    /* 720 px est la largeur de la source, il n'y a pas plus : les quatre slots
       y sont plafonnés. Affichée au plus large à ~430 px CSS. */
    variants: { 640: [640, 58], 828: [720, 58], 1080: [720, 58], 1200: [720, 58] },
  },
  /* ─── Les quatre chiens de la galerie `#chiens` (2026-08-22) ────────────
     Tous en 3/4, et ce n'est pas une contrainte qu'on leur impose : `sam`,
     `rubis` et `pain` sortent du téléphone en 1170 × 1560, soit exactement 3/4,
     et `saika` fait 878 × 1560 mais porte des BANDES GRISES en 0..194 et
     1365..1559 — son contenu réel est 878 × 1170, encore du 3/4. Les cadrages
     ne font donc que resserrer sur le chien, jamais changer de format.

     Les quatre slots sont plafonnés à 560 px : une carte fait 245 px CSS au
     plus large (4 colonnes dans `max-w-5xl`), soit 490 px sur un écran 2×.
     Au-delà, c'est du poids que personne ne voit — et sur `pain`, dont le sol
     est jonché de prunes, chaque pixel coûte cher : 86 Ko à 640 px contre 68 à
     560. Baisser la qualité n'y change presque rien (74 Ko à q44, pour un chien
     abîmé) : ce qui pèse, c'est la texture du fond, pas l'encodage. */
  {
    name: "saika",
    /* Le seul cadrage qui n'en est pas un : le contenu utile fait pile 3/4,
       on retire les bandes et c'est tout. Les jambes en haut à gauche sont
       celles du maître — impossible de les sortir sans raser les oreilles du
       chien fauve, qui commencent à la même hauteur (y≈370). */
    src: "saika.jpg",
    crop: { left: 0, top: 195, width: 878, height: 1170 },
    reference: [878, 62],
    variants: { 640: [560, 58], 828: [560, 58], 1080: [560, 58], 1200: [560, 58] },
  },
  {
    name: "sam",
    src: "sam.jpg",
    // Le chien occupe la droite du cadre, le tiers gauche n'est que du sol.
    crop: { left: 210, top: 280, width: 960, height: 1280 },
    reference: [960, 62],
    variants: { 640: [560, 58], 828: [560, 58], 1080: [560, 58], 1200: [560, 58] },
  },
  {
    name: "rubis",
    // Oreilles dressées à y=148 : 68 px de marge au-dessus, pas moins.
    src: "rubis.jpg",
    crop: { left: 165, top: 80, width: 975, height: 1300 },
    reference: [975, 62],
    variants: { 640: [560, 58], 828: [560, 58], 1080: [560, 58], 1200: [560, 58] },
  },
  {
    name: "pain",
    /* Le plus recadré des quatre : dans l'original le chien ne remplit que
       58 % de la hauteur, il se perdrait dans une carte de 245 px. */
    src: "pain.jpg",
    crop: { left: 250, top: 520, width: 780, height: 1040 },
    reference: [780, 62],
    variants: { 640: [560, 58], 828: [560, 58], 1080: [560, 58], 1200: [560, 58] },
  },
  /* scripts/photos/balade-chemin.jpg (le promeneur de dos sur un chemin) a
     servi à un médaillon dans le coin du hero, retiré : deux photos de la
     même personne, même tenue, même décor, l'une collée sur l'autre, ça
     faisait collage. L'original est conservé pour la replacer ailleurs le
     jour venu — recadrage qui marchait bien à petite taille :
       crop { left: 120, top: 423, width: 700, height: 933 }  (3/4 resserré) */
];

const encode = (photo, width, quality, file) =>
  denoise(
    sharp(path.join(SRC, photo.src))
      .extract(photo.crop)
      .resize({ width, kernel: "lanczos3" }),
  )
    .webp({ quality, effort: 6 })
    .toFile(path.join(OUT, file));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const photo of PHOTOS) {
    const files = [[`${photo.name}.webp`, photo.reference]].concat(
      Object.entries(photo.variants).map(([slot, spec]) => [
        `${photo.name}-${slot}.webp`,
        spec,
      ]),
    );
    for (const [file, [width, quality]] of files) {
      await encode(photo, width, quality, file);
      const ko = (fs.statSync(path.join(OUT, file)).size / 1024).toFixed(0);
      console.log(`  ${file.padEnd(26)} ${String(width).padStart(4)} px  ${ko.padStart(4)} Ko`);
    }
  }
})();
