import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 20 → "20 €" ; 29.9 → "29,90 €" */
export function formatPrice(price: number) {
  const amount = Number.isInteger(price)
    ? String(price)
    : price.toFixed(2).replace(".", ",")
  return `${amount} €`
}
