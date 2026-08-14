/* ─────────────────────────────────────────────────────────────────────────
   Vectorisation du logo client — à relancer uniquement si la source change.

     npm i --no-save potrace && node scripts/trace-logo.js

   Source : scripts/logo-source.jpg, 1254 × 1254 px, le dessin y occupe
   1024 × 881 px d'un seul vert (#327E1C) sur blanc. Une première version de
   ce script devait démêler deux verts depuis une capture d'écran de 160 px ;
   cette source-là rend tout cet appareillage inutile — un seuil suffit.

   Produit :
     public/images/logo.svg       logo complet (footer)
     public/images/logo-mark.svg  marque seule, sans le trait de sol (barre
                                  de navigation)
     app/icon.svg                 favicon (la marque sur fond crème)
     app/favicon.ico              le même, rasterisé, pour les robots
   ───────────────────────────────────────────────────────────────────────── */
const sharp = require("sharp");
const potrace = require("potrace");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "scripts/logo-source.jpg");

const GREEN = "#327E1C"; // mode des pixels d'intérieur : rgb(50, 126, 28)
const REF = [0x32, 0x7e, 0x1c];
const BG_LUM = 230; // au-dessus : fond blanc, sert à détecter le cadrage
const PAD = 6; // marge autour du dessin, en px source
const SCALE = 2; // on trace en 2× : la source est déjà à bonne résolution

// Cadrage automatique sur le dessin — la source ne contient que le logo
function contentBox(data, W, H, C) {
  let minX = W,
    minY = H,
    maxX = -1,
    maxY = -1;
  for (let p = 0; p < W * H; p++) {
    const i = p * C;
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (lum > BG_LUM) continue;
    const x = p % W,
      y = (p / W) | 0;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const left = Math.max(0, minX - PAD);
  const top = Math.max(0, minY - PAD);
  return {
    left,
    top,
    width: Math.min(W - 1, maxX + PAD) - left + 1,
    height: Math.min(H - 1, maxY + PAD) - top + 1,
  };
}

// Couverture du pixel par la couleur de référence (0 = blanc pur, 1 = aplat)
function coverage(p, ref) {
  let num = 0,
    den = 0;
  for (let k = 0; k < 3; k++) {
    const d = ref[k] - 255;
    num += (p[k] - 255) * d;
    den += d * d;
  }
  return Math.max(0, Math.min(1, num / den));
}

async function mask() {
  const src = sharp(SRC);
  const probe = await src.clone().raw().toBuffer({ resolveWithObject: true });
  const box = contentBox(
    probe.data,
    probe.info.width,
    probe.info.height,
    probe.info.channels,
  );
  console.log(`  cadrage : ${box.width} × ${box.height} px source`);

  const { data, info } = await src
    .extract(box)
    .resize({ width: box.width * SCALE, kernel: "lanczos3" })
    .blur(1.0) // lisse le crénelage et le bruit JPEG avant seuillage
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  const m = Buffer.alloc(W * H, 255);
  for (let p = 0; p < W * H; p++) {
    const i = p * C;
    if (coverage([data[i], data[i + 1], data[i + 2]], REF) >= 0.5) m[p] = 0;
  }
  return { m, W, H };
}

/* Isole le promeneur et ses chiens du reste du dessin, pour une variante
   lisible à 40 px (barre de navigation, favicon) là où le texte en arc ne
   serait qu'un anneau de taches. Le tri est purement géométrique : mesurées
   depuis le centre du dessin, les onze lettres ont toutes leur centre à
   r ≥ 387 px source, et chaque morceau du personnage à r ≤ 307 — le
   personnage n'est pas d'un seul tenant (les laisses blanches détachent deux
   morceaux de chien), donc prendre « la plus grande forme » ne suffit pas. */
const RING_R = 340; // px source séparant l'anneau texte du motif central

/* Le trait de sol appartient à la même forme que le personnage (les pieds le
   touchent), mais il n'a pas sa place dans la marque : à 40 px de haut, ce
   bandeau de 859 px de large mange toute la place et le promeneur n'en occupe
   plus que 35. On l'efface donc par le bas, tant qu'une ligne est un seul run
   plein couvrant l'essentiel de la largeur. */
function removeGroundLine(m, W, H) {
  const scan = (y) => {
    let n = 0,
      runs = 0,
      inRun = false;
    for (let x = 0; x < W; x++) {
      const on = m[y * W + x] === 0;
      if (on) n++;
      if (on && !inRun) runs++;
      inRun = on;
    }
    return { n, runs };
  };

  let y = H - 1;
  while (y >= 0 && scan(y).n === 0) y--; // marge blanche du recadrage

  let erased = 0;
  for (; y >= 0; y--) {
    const { n, runs } = scan(y);
    if (runs !== 1 || n < 0.6 * W) break;
    for (let x = 0; x < W; x++) m[y * W + x] = 255;
    erased++;
  }
  console.log(`  trait de sol : ${erased} lignes effacées`);
}

function figureOnly(src, W, H, padding) {
  const seen = new Uint8Array(W * H);
  const stack = new Int32Array(W * H);
  const comp = new Int32Array(W * H);
  const kept = [];
  let minXk = W,
    minYk = H,
    maxXk = 0,
    maxYk = 0;

  for (let start = 0; start < W * H; start++) {
    if (src[start] !== 0 || seen[start]) continue;
    let top = 0,
      n = 0,
      minX = W,
      minY = H,
      maxX = 0,
      maxY = 0;
    stack[top++] = start;
    seen[start] = 1;
    while (top) {
      const p = stack[--top];
      comp[n++] = p;
      const x = p % W,
        y = (p / W) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      for (const q of [
        x > 0 ? p - 1 : -1,
        x < W - 1 ? p + 1 : -1,
        y > 0 ? p - W : -1,
        y < H - 1 ? p + W : -1,
      ]) {
        if (q >= 0 && !seen[q] && src[q] === 0) (seen[q] = 1), (stack[top++] = q);
      }
    }
    const r = Math.hypot((minX + maxX) / 2 - W / 2, (minY + maxY) / 2 - H / 2);
    if (r >= RING_R * SCALE) continue;
    kept.push(comp.slice(0, n));
    if (minX < minXk) minXk = minX;
    if (minY < minYk) minYk = minY;
    if (maxX > maxXk) maxXk = maxX;
    if (maxY > maxYk) maxYk = maxY;
  }
  console.log(`  motif central : ${kept.length} formes conservées`);

  // Le trait de sol s'efface avant le recadrage, sinon il dicte la largeur
  const wide = Buffer.alloc(W * H, 255);
  for (const pixels of kept) for (const p of pixels) wide[p] = 0;
  removeGroundLine(wide, W, H);

  minXk = W;
  minYk = H;
  maxXk = 0;
  maxYk = 0;
  for (let p = 0; p < W * H; p++) {
    if (wide[p] !== 0) continue;
    const x = p % W,
      y = (p / W) | 0;
    if (x < minXk) minXk = x;
    if (x > maxXk) maxXk = x;
    if (y < minYk) minYk = y;
    if (y > maxYk) maxYk = y;
  }

  const x0 = Math.max(0, minXk - padding);
  const y0 = Math.max(0, minYk - padding);
  const w = Math.min(W - 1, maxXk + padding) - x0 + 1;
  const h = Math.min(H - 1, maxYk + padding) - y0 + 1;

  const out = Buffer.alloc(w * h, 255);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) out[y * w + x] = wide[(y + y0) * W + x + x0];
  return { m: out, W: w, H: h };
}

const trace = (file, opts) =>
  new Promise((res, rej) =>
    potrace.trace(file, opts, (e, svg) => (e ? rej(e) : res(svg))),
  );

const OPTS = {
  threshold: 128,
  // turdSize supprime les moucherons des deux polarités : il tient lieu du
  // rebouchage d'artefacts JPEG que faisait l'ancienne version à la main
  turdSize: 12,
  alphaMax: 1,
  optCurve: true,
  optTolerance: 0.2,
};

/* Trois profils, parce qu'aucun de ces fichiers ne s'affiche à la résolution
   du masque : réduire le masque avant le tracé et élargir la tolérance divise
   le poids par deux ou trois sans différence visible à la taille d'usage.
   Vérifié en rendant les variantes côte à côte à 320 px — indiscernables.
     logo   96 px dans le footer, tracé à 900 → net jusqu'à ~450 px
     marque 40 px dans la barre,  tracé à 500 → net jusqu'à ~250 px
     favicon 16-32 px,            tracé à 200 */
const PROFILE = {
  logo: { height: 900, opts: { ...OPTS, optTolerance: 0.3 } },
  mark: { height: 500, opts: { ...OPTS, optTolerance: 0.35 } },
  icon: { height: 200, opts: { ...OPTS, optTolerance: 0.8 } },
};

// Le tracé se fait à 2× pour la précision ; on ramène les coordonnées à
// l'échelle du viewBox final pour ne pas stocker des nombres à 5 chiffres.
const pathOf = (svg, div) =>
  svg
    .match(/ d="([^"]+)"/)[1]
    .replace(/-?\d+(\.\d+)?/g, (n) =>
      String(+(+n / div).toFixed(1)).replace(/^(-?)0\./, "$1."),
    );

const TMP = path.join(require("os").tmpdir(), "dog-aventure-logo");

/* Le masque est réduit avant le tracé (cf. PROFILE). Le redimensionnement
   reste dans la même chaîne sharp : un aller-retour par buffer brut redonne
   un nombre de canaux qui n'est plus 1, et le masque se relit de travers.
   Les coordonnées restent dans l'unité du masque réduit — seul le rapport
   du viewBox compte, et des nombres courts pèsent moins. */
async function toPath(name, { m, W, H }) {
  const { height, opts } = PROFILE[name];
  fs.mkdirSync(TMP, { recursive: true });
  const f = path.join(TMP, name + ".png");
  const out = await sharp(m, { raw: { width: W, height: H, channels: 1 } })
    .resize({ height, kernel: "lanczos3" })
    .png()
    .toFile(f);
  return {
    d: pathOf(await trace(f, opts), 1),
    vb: `0 0 ${out.width} ${out.height}`,
  };
}

const write = (rel, content) => {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
  console.log(`  ${rel} — ${(content.length / 1024).toFixed(1)} Ko`);
};

/* Le .ico n'existe que pour les robots : les navigateurs prennent le SVG de
   icon.svg, qui est déclaré avant lui et ne pixellise à aucune taille. Google
   recommande « plus grand que 48 px » — d'où le 64, au-delà des trois tailles
   habituelles.

   Format écrit à la main plutôt qu'avec une dépendance de plus : un ICO n'est
   qu'un en-tête, une entrée de 16 octets par taille, puis les PNG bout à bout
   (le conteneur accepte du PNG tel quel depuis Vista, pas besoin de BMP).

   Rasterisé depuis la CHAÎNE svg passée en argument, jamais en relisant
   app/icon.svg : les deux fichiers ne peuvent donc pas diverger. La densité
   élevée rend un bitmap bien plus grand que la cible, que le resize réduit —
   sans elle, sharp rendrait le SVG à 64 px puis l'agrandirait pour la variante
   64, ce qui revient à recopier des pixels. */
const ICO_SIZES = [16, 32, 48, 64];

async function ico(svg) {
  const pngs = await Promise.all(
    ICO_SIZES.map((px) =>
      sharp(Buffer.from(svg), { density: 600 })
        .resize(px, px)
        .png({ compressionLevel: 9 })
        .toBuffer(),
    ),
  );

  const dir = Buffer.alloc(6 + 16 * pngs.length);
  dir.writeUInt16LE(0, 0); // réservé
  dir.writeUInt16LE(1, 2); // type : icône (2 = curseur)
  dir.writeUInt16LE(pngs.length, 4);

  let offset = dir.length;
  pngs.forEach((png, i) => {
    const e = 6 + 16 * i;
    dir.writeUInt8(ICO_SIZES[i] % 256, e); // 256 s'écrirait 0
    dir.writeUInt8(ICO_SIZES[i] % 256, e + 1);
    dir.writeUInt8(0, e + 2); // couleurs de palette : aucune
    dir.writeUInt8(0, e + 3); // réservé
    dir.writeUInt16LE(1, e + 4); // plans de couleur
    dir.writeUInt16LE(32, e + 6); // bits par pixel (RVBA)
    dir.writeUInt32LE(png.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });

  return Buffer.concat([dir, ...pngs]);
}

(async () => {
  const full = await mask();
  const logo = await toPath("logo", full);
  const markMask = figureOnly(full.m, full.W, full.H, 12);
  const mark = await toPath("mark", markMask);
  const icon = await toPath("icon", markMask);

  write(
    "public/images/logo.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${logo.vb}">
<path fill="${GREEN}" fill-rule="evenodd" d="${logo.d}"/>
</svg>
`,
  );

  write(
    "public/images/logo-mark.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${mark.vb}">
<path fill="${GREEN}" fill-rule="evenodd" d="${mark.d}"/>
</svg>
`,
  );

  // Favicon : la marque centrée dans un carré arrondi au crème du site.
  // 54/64 et non 48 : à 32 px, le dessin doit occuper tout ce qu'il peut.
  const [, , iw, ih] = icon.vb.split(" ").map(Number);
  const s = 54 / Math.max(iw, ih);
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#f4efe4"/>
<g transform="translate(${((64 - iw * s) / 2).toFixed(2)} ${((64 - ih * s) / 2).toFixed(2)}) scale(${s.toFixed(4)})">
<path fill="${GREEN}" fill-rule="evenodd" d="${icon.d}"/>
</g>
</svg>
`;
  write("app/icon.svg", iconSvg);
  write("app/favicon.ico", await ico(iconSvg));

  const [, , lw, lh] = logo.vb.split(" ").map(Number);
  const [, , mw, mh] = mark.vb.split(" ").map(Number);
  console.log(
    `  ratios : logo ${(lw / lh).toFixed(3)} (${lw}×${lh}) — marque ${(mw / mh).toFixed(3)} (${mw}×${mh})`,
  );
})();
