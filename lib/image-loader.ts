"use client";

/* Loader utilisé uniquement par le build GitHub Pages (préview client) :
   sert les images telles quelles en préfixant le basePath — voir next.config.ts */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function imageLoader({ src }: { src: string }) {
  return `${basePath}${src}`;
}
