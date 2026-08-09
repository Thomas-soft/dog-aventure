/* ─────────────────────────────────────────────────────────────────────────
   Vectorisation du logo client — à relancer uniquement si la source change.

     npm i --no-save potrace && node scripts/trace-logo.js

   Le client n'a fourni son logo qu'en capture d'écran (scripts/logo-source.jpg,
   339×734 px, le logo n'y occupe que 160×149 px). Ce script en retire un SVG
   net à n'importe quelle taille, et écrit directement les trois assets du
   projet. Demander le fichier vectoriel d'origine reste préférable : voir la
   section « Logo » de CLAUDE.md.

   Produit :
     public/images/logo.svg       logo complet (footer)
     public/images/logo-mark.svg  marque seule (barre de navigation)
     app/icon.svg                 favicon (la marque sur fond crème)
   ───────────────────────────────────────────────────────────────────────── */
const sharp = require("sharp");
const potrace = require("potrace");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "scripts/logo-source.jpg");
const CROP = { left: 84, top: 247, width: 164, height: 153 }; // le logo dans la capture
const SCALE = 10; // on trace en 10× : plus de précision sur les courbes

const REF = { 1: [138, 192, 130], 2: [48, 118, 32] }; // les 2 verts, relevés sur les aplats
const LIGHT = "#8AC082";
const DARK = "#307620";
const DARK_TOL = 45; // le vert foncé est sans ambiguïté : rien d'autre n'en approche
const LIGHT_TOL = 26; // le vert clair, lui, doit être confirmé par la profondeur…
const LIGHT_TOL_TIGHT = 8; // …sauf s'il est vraiment pur (traits fins : laisses)
const DEPTH_MIN = 24; // px (échelle 10×) séparant un aplat clair du fond blanc
const DEPTH_TIGHT = 10; // profondeur exigée même pour un vert clair pur
const BG_LUM = 216; // au-dessus : fond blanc franc, sert de base à la profondeur

// Distance (en px, 4-connexe) de chaque pixel au fond blanc le plus proche
function depthFromBackground(data, W, H, C) {
  const depth = new Int32Array(W * H).fill(-1);
  const queue = new Int32Array(W * H);
  let head = 0,
    tail = 0;
  for (let p = 0; p < W * H; p++) {
    const i = p * C;
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (lum > BG_LUM) (depth[p] = 0), (queue[tail++] = p);
  }
  while (head < tail) {
    const p = queue[head++];
    const x = p % W,
      y = (p / W) | 0;
    const push = (q) => {
      if (depth[q] < 0) (depth[q] = depth[p] + 1), (queue[tail++] = q);
    };
    if (x > 0) push(p - 1);
    if (x < W - 1) push(p + 1);
    if (y > 0) push(p - W);
    if (y < H - 1) push(p + W);
  }
  return depth;
}

// Remet à 0 les composantes connexes du label `target` plus petites que minArea
function pruneSmallComponents(label, target, W, H, minArea) {
  const seen = new Uint8Array(W * H);
  const stack = new Int32Array(W * H);
  const comp = new Int32Array(W * H);
  let removed = 0;

  for (let start = 0; start < W * H; start++) {
    if (label[start] !== target || seen[start]) continue;
    let top = 0,
      n = 0;
    stack[top++] = start;
    seen[start] = 1;
    while (top) {
      const p = stack[--top];
      comp[n++] = p;
      const x = p % W,
        y = (p / W) | 0;
      for (const q of [
        x > 0 ? p - 1 : -1,
        x < W - 1 ? p + 1 : -1,
        y > 0 ? p - W : -1,
        y < H - 1 ? p + W : -1,
      ]) {
        if (q >= 0 && !seen[q] && label[q] === target)
          (seen[q] = 1), (stack[top++] = q);
      }
    }
    if (n < minArea) {
      for (let i = 0; i < n; i++) label[comp[i]] = 0;
      removed++;
    }
  }
  return removed;
}

/* Un pixel de bord est un mélange de blanc et d'un des deux verts. Or les deux
   mélanges suivent des directions RGB quasi identiques : à faible couverture,
   la couleur seule ne dit pas de quelle forme le pixel provient (c'est ce qui
   cernait chaque lettre d'un liseré clair). On tranche donc géométriquement :
   les pixels de couleur pure servent de germes, et chaque pixel ambigu hérite
   du vert du germe le plus proche (BFS multi-source). La couverture est
   ensuite calculée contre LA bonne référence, avec le même seuil 50 % partout. */
function labelByNearestSeed(data, W, H, C) {
  const label = new Uint8Array(W * H);
  const queue = new Int32Array(W * H);
  let head = 0,
    tail = 0;

  const distTo = (p, ref) => {
    const i = p * C;
    return Math.hypot(data[i] - ref[0], data[i + 1] - ref[1], data[i + 2] - ref[2]);
  };
  const depth = depthFromBackground(data, W, H, C);

  for (let p = 0; p < W * H; p++) {
    /* Le vert foncé est reconnaissable à sa seule couleur. Le vert clair, non :
       un bord blanc/vert foncé à 50 % vaut (151,186,143), à 19 du vert clair —
       le prendre pour un germe cerne chaque lettre d'un liseré. Ce qui les
       sépare n'est pas la teinte mais la position : un aplat clair est loin du
       fond, un pixel de bord y est collé. D'où le critère de profondeur, avec
       une échappatoire pour les traits clairs trop fins pour l'atteindre. */
    if (distTo(p, REF[2]) < DARK_TOL) {
      label[p] = 2;
      queue[tail++] = p;
    } else if (
      (distTo(p, REF[1]) < LIGHT_TOL_TIGHT && depth[p] >= DEPTH_TIGHT) ||
      (distTo(p, REF[1]) < LIGHT_TOL && depth[p] >= DEPTH_MIN)
    ) {
      label[p] = 1;
      queue[tail++] = p;
    }
  }
  /* Dernier filtre : les faux germes clairs restants forment de petits amas
     accrochés au bord d'une lettre, alors qu'un aplat clair du logo (maillot,
     bras, chien, laisse) couvre toujours une large surface. On supprime donc
     les amas clairs sous un seuil d'aire, puis on repart des germes restants. */
  const pruned = pruneSmallComponents(label, 1, W, H, 2500);
  console.log(`  germes : ${tail} — amas clairs parasites écartés : ${pruned}`);

  tail = 0;
  for (let p = 0; p < W * H; p++) if (label[p]) queue[tail++] = p;

  while (head < tail) {
    const p = queue[head++];
    const x = p % W,
      y = (p / W) | 0;
    if (x > 0 && !label[p - 1]) (label[p - 1] = label[p]), (queue[tail++] = p - 1);
    if (x < W - 1 && !label[p + 1]) (label[p + 1] = label[p]), (queue[tail++] = p + 1);
    if (y > 0 && !label[p - W]) (label[p - W] = label[p]), (queue[tail++] = p - W);
    if (y < H - 1 && !label[p + W]) (label[p + W] = label[p]), (queue[tail++] = p + W);
  }
  return label;
}

/* Comble les mouchetures claires prisonnières d'une forme foncée : une zone
   non-foncée qui ne touche ni le fond ni le bord de l'image, et qui reste
   petite, est un artefact de compression — pas un détail voulu du logo.
   Les contreformes des lettres (le trou du O) sont épargnées : elles font
   partie du fond, même quand la boucle les isole du fond extérieur. */
function fillEnclosedSpecks(dark, all, W, H, maxArea) {
  const seen = new Uint8Array(W * H);
  const stack = new Int32Array(W * H);
  const comp = new Int32Array(W * H);
  let filled = 0;

  for (let start = 0; start < W * H; start++) {
    if (dark[start] === 0 || seen[start]) continue;
    let top = 0,
      n = 0,
      escapes = false;
    stack[top++] = start;
    seen[start] = 1;
    while (top) {
      const p = stack[--top];
      comp[n++] = p;
      const x = p % W,
        y = (p / W) | 0;
      if (all[p] === 255 || x === 0 || y === 0 || x === W - 1 || y === H - 1)
        escapes = true;
      for (const q of [
        x > 0 ? p - 1 : -1,
        x < W - 1 ? p + 1 : -1,
        y > 0 ? p - W : -1,
        y < H - 1 ? p + W : -1,
      ]) {
        if (q >= 0 && !seen[q] && dark[q] === 255) (seen[q] = 1), (stack[top++] = q);
      }
    }
    if (!escapes && n <= maxArea) {
      for (let i = 0; i < n; i++) dark[comp[i]] = 0;
      filled++;
    }
  }
  console.log("  mouchetures comblées :", filled);
}

// Couverture du pixel par sa couleur de référence (0 = blanc pur, 1 = aplat)
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

async function masks() {
  const { data, info } = await sharp(SRC)
    .extract(CROP)
    .resize({ width: CROP.width * SCALE, kernel: "lanczos3" })
    .blur(1.8) // lisse le crénelage et les artefacts JPEG avant seuillage
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  const label = labelByNearestSeed(data, W, H, C);
  const all = Buffer.alloc(W * H, 255);
  const dark = Buffer.alloc(W * H, 255);
  for (let p = 0; p < W * H; p++) {
    const i = p * C;
    const a = coverage([data[i], data[i + 1], data[i + 2]], REF[label[p]]);
    if (a >= 0.5) {
      all[p] = 0;
      if (label[p] === 2) dark[p] = 0;
    }
  }

  fillEnclosedSpecks(dark, all, W, H, 6000);
  return { all, dark, W, H };
}

/* Isole le promeneur et ses chiens du reste du dessin, pour une variante
   lisible à 44 px (barre de navigation, favicon) là où le texte en arc ne
   serait qu'un anneau de taches. Le tri est purement géométrique : mesurées
   depuis le centre du logo, les douze lettres et le trait de sol ont toutes
   leur centre à r ≥ 65, et chaque morceau du personnage à r ≤ 58 — le
   personnage n'est pas d'un seul tenant (la jambe arrière foncée et les
   chiens sont détachés), donc prendre « la plus grande forme » ne suffit pas. */
const RING_R = 62; // px source séparant l'anneau texte du motif central

function figureOnly(all, dark, W, H, padding) {
  const seen = new Uint8Array(W * H);
  const stack = new Int32Array(W * H);
  const comp = new Int32Array(W * H);
  const kept = [];
  let minXk = W,
    minYk = H,
    maxXk = 0,
    maxYk = 0;

  for (let start = 0; start < W * H; start++) {
    if (all[start] !== 0 || seen[start]) continue;
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
        if (q >= 0 && !seen[q] && all[q] === 0) (seen[q] = 1), (stack[top++] = q);
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

  const x0 = Math.max(0, minXk - padding);
  const y0 = Math.max(0, minYk - padding);
  const w = Math.min(W - 1, maxXk + padding) - x0 + 1;
  const h = Math.min(H - 1, maxYk + padding) - y0 + 1;

  const mAll = Buffer.alloc(w * h, 255);
  const mDark = Buffer.alloc(w * h, 255);
  for (const pixels of kept) {
    for (const p of pixels) {
      const q = (((p / W) | 0) - y0) * w + ((p % W) - x0);
      mAll[q] = 0;
      if (dark[p] === 0) mDark[q] = 0;
    }
  }
  return { all: mAll, dark: mDark, W: w, H: h };
}

const trace = (file, opts) =>
  new Promise((res, rej) =>
    potrace.trace(file, opts, (e, svg) => (e ? rej(e) : res(svg))),
  );

const OPTS = {
  threshold: 128,
  turdSize: 25, // ignore les moucherons laissés par la compression JPEG
  alphaMax: 1,
  optCurve: true,
  optTolerance: 0.55,
};

// Le tracé se fait à 10× pour la précision ; on ramène les coordonnées à
// l'échelle du viewBox final pour ne pas stocker des nombres à 5 chiffres.
const pathOf = (svg) =>
  svg
    .match(/ d="([^"]+)"/)[1]
    .replace(/-?\d+(\.\d+)?/g, (n) =>
      String(+(+n / SCALE).toFixed(1)).replace(/^(-?)0\./, "$1."),
    );

const TMP = path.join(require("os").tmpdir(), "dog-aventure-logo");

async function toPaths(name, { all, dark, W, H }) {
  fs.mkdirSync(TMP, { recursive: true });
  const raw = { raw: { width: W, height: H, channels: 1 } };
  const fAll = path.join(TMP, name + "-all.png");
  const fDark = path.join(TMP, name + "-dark.png");
  await sharp(all, raw).png().toFile(fAll);
  await sharp(dark, raw).png().toFile(fDark);
  return {
    light: pathOf(await trace(fAll, OPTS)),
    dark: pathOf(await trace(fDark, OPTS)),
    vb: `0 0 ${W / SCALE} ${H / SCALE}`,
  };
}

const write = (rel, content) => {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
  console.log(`  ${rel} — ${(content.length / 1024).toFixed(1)} Ko`);
};

(async () => {
  const full = await masks();
  const logo = await toPaths("logo", full);
  const mark = await toPaths("mark", figureOnly(full.all, full.dark, full.W, full.H, 20));

  write(
    "public/images/logo.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${logo.vb}">
<path fill="${LIGHT}" fill-rule="evenodd" d="${logo.light}"/>
<path fill="${DARK}" fill-rule="evenodd" d="${logo.dark}"/>
</svg>
`,
  );

  // Favicon : la marque centrée dans un carré arrondi au crème du site
  const [, , vw, vh] = mark.vb.split(" ").map(Number);
  const s = 48 / Math.max(vw, vh);
  const d = ((64 - vw * s) / 2).toFixed(2);
  write(
    "app/icon.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#f4efe4"/>
<g transform="translate(${d} ${((64 - vh * s) / 2).toFixed(2)}) scale(${s.toFixed(4)})">
<path fill="${LIGHT}" fill-rule="evenodd" d="${mark.light}"/>
<path fill="${DARK}" fill-rule="evenodd" d="${mark.dark}"/>
</g>
</svg>
`,
  );

  write(
    "public/images/logo-mark.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${mark.vb}">
<path fill="${LIGHT}" fill-rule="evenodd" d="${mark.light}"/>
<path fill="${DARK}" fill-rule="evenodd" d="${mark.dark}"/>
</svg>
`,
  );
})();
