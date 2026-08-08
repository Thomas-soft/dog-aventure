"use client";

/* Loader utilisé uniquement par le build GitHub Pages (préview client) :
   pas d'optimiseur serveur, on sert des variantes WebP pré-générées
   (`<nom>-{640,828,1080,1200}.webp` dans public/images) en préfixant le
   basePath — voir next.config.ts. Régénération : voir CLAUDE.md. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const WIDTHS = [640, 828, 1080, 1200];

export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}) {
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `${basePath}${src.replace(/\.(jpe?g|png|webp)$/, "")}-${w}.webp`;
}
