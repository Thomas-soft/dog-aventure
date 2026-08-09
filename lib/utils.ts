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
