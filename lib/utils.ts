import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Préfixe le basePath aux assets servis hors next/image (préview GitHub Pages,
 *  où le site vit sous /dog-aventure). Next ne préfixe que ce qu'il génère. */
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`
}

/** 20 → "20 €" ; 29.9 → "29,90 €" */
export function formatPrice(price: number) {
  const amount = Number.isInteger(price)
    ? String(price)
    : price.toFixed(2).replace(".", ",")
  return `${amount} €`
}

/** Espace insécable devant « ! ? : ; » et à l'intérieur des guillemets : les
 *  textes de la config sont saisis avec des espaces ordinaires, et un « ! »
 *  rejeté seul en début de ligne se voit tout de suite. Appliqué par
 *  `RichText`, donc à tout texte du client qui passe par lui. */
export function frenchSpacing(text: string) {
  return text
    .replace(/ ([!?:;»])/g, "\u00a0$1")
    .replace(/« /g, "«\u00a0")
}
