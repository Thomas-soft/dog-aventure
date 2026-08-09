/* ─────────────────────────────────────────────────────────────────────────
   Recadrage et encodage des photos client du hero — à relancer si les
   originaux ou les cadrages changent.

     node scripts/prepare-photos.js

   Originaux dans scripts/photos/ (878 × 1560, sorties de téléphone). Produit
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
