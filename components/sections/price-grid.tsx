import type { Pack } from "@/content/types";
import { cn, formatPrice } from "@/lib/utils";

/** Prix d'une sortie dans un carnet. Arrondi au centime : 139,9 / 5 doit
 *  s'afficher 27,98 €, pas 27,979999… */
export function packUnitPrice(pack: Pack) {
  return Math.round((pack.total / pack.quantity) * 100) / 100;
}

/** Le « dès » d'une offre vendue en carnets : le prix le plus bas par sortie,
 *  carnets compris — et non le prix à l'unité. Demande client du 2026-10-08 :
 *  « la promenade de 2h t'a mis dès 29,90 € alors que c'est dès 25,99 € ». */
export function lowestUnitPrice(unitPrice: number, packs: Pack[]) {
  return Math.min(unitPrice, ...packs.map(packUnitPrice));
}

/**
 * Grille dégressive « à l'unité → carnets ». Sert les carnets de la balade
 * d'1 h (accueil) et ceux de la Dog Aventure 2 h (/balade-foret).
 *
 * Ni le prix unitaire d'un carnet ni l'économie ne sont saisis : ils se
 * déduisent de `unitPrice` et du total de chaque carnet. Changer le tarif
 * unitaire suffit donc à remettre toute la grille d'aplomb.
 */
export function PriceGrid({
  unitLabel,
  unitPrice,
  unitDesc,
  packs,
  perLabel,
  packWord,
}: {
  unitLabel: string;
  unitPrice: number;
  unitDesc: string;
  packs: Pack[];
  /** Accolé au prix : « la balade », « la sortie » */
  perLabel: string;
  /** Dans la phrase d'économie : « le carnet », « le pack » */
  packWord: string;
}) {
  /* Colonne de grille — la première n'est pas un carnet, d'où le type commun
     plutôt qu'une union (sans lui, `badge` et `highlight` sont inaccessibles). */
  type Column = {
    id: string;
    name: string;
    perUnit: number;
    desc: string;
    badge?: string;
    highlight?: boolean;
  };

  const columns: Column[] = [
    { id: "unit", name: unitLabel, perUnit: unitPrice, desc: unitDesc },
    ...packs.map((pack) => {
      const saved =
        // Arrondi au centime obligatoire : 10 × 22,9 vaut 229.00000000000003
        // en virgule flottante, et l'économie s'afficherait « 14,00 € ».
        Math.round((unitPrice * pack.quantity - pack.total) * 100) / 100;
      return {
        id: pack.id,
        name: pack.name,
        perUnit: packUnitPrice(pack),
        desc: `${formatPrice(pack.total)} ${packWord}, soit ${formatPrice(saved)} d’économie.`,
        badge: pack.badge,
        highlight: pack.highlight,
      };
    }),
  ];

  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {columns.map((col) => (
        <li
          key={col.id}
          className={cn(
            "flex flex-col gap-1 rounded-2xl border-2 bg-surface p-5",
            col.highlight ? "border-flame" : "border-line",
          )}
        >
          <p className="text-xs font-bold uppercase tracking-wide text-smoke">
            {col.name}
          </p>
          <p className="flex flex-wrap items-baseline gap-x-1.5">
            <span
              className={cn(
                "font-display text-3xl md:text-4xl",
                col.highlight ? "text-flame" : "text-ink",
              )}
            >
              {formatPrice(col.perUnit)}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-smoke">
              {perLabel}
            </span>
          </p>
          <p className="text-sm leading-relaxed text-smoke">{col.desc}</p>
          {col.badge && (
            <p className="mt-auto pt-3">
              <span className="inline-flex rounded-full bg-flame px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                {col.badge}
              </span>
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
