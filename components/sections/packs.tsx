import { site } from "@/content/site.config";
import { Reveal } from "@/components/motion/reveal";
import { cn, formatPrice } from "@/lib/utils";

/**
 * Grille dégressive, rendue sous les offres. Ni le prix de référence ni
 * l'économie ne sont saisis dans la config : ils se déduisent du service
 * `packs.serviceId` et du total de chaque carnet. Changer le tarif de la
 * balade d'1 h suffit donc à remettre toute la grille d'aplomb.
 */
export function Packs() {
  const { packs } = site;
  const unit = site.services.find((s) => s.id === packs.serviceId);

  // Service de référence introuvable ou aucun carnet : on n'affiche rien
  // plutôt qu'une grille amputée de sa colonne d'entrée.
  if (!unit || packs.items.length === 0) return null;

  /* Colonne de grille — la première n'est pas un carnet, d'où le type commun
     plutôt qu'une union (sans lui, `badge` et `highlight` sont inaccessibles). */
  type Column = {
    id: string;
    name: string;
    perWalk: number;
    desc: string;
    badge?: string;
    highlight?: boolean;
  };

  const columns: Column[] = [
    {
      id: "unit",
      name: packs.unitLabel,
      perWalk: unit.price,
      desc: packs.unitDesc,
    },
    ...packs.items.map((pack) => {
      const saved =
        // Arrondi au centime obligatoire : 10 × 22,9 vaut 229.00000000000003
        // en virgule flottante, et l'économie s'afficherait « 14,00 € ».
        Math.round((unit.price * pack.quantity - pack.total) * 100) / 100;
      return {
        id: pack.id,
        name: pack.name,
        perWalk: pack.total / pack.quantity,
        desc: `${formatPrice(pack.total)} le carnet, soit ${formatPrice(saved)} d’économie.`,
        badge: pack.badge,
        highlight: pack.highlight,
      };
    }),
  ];

  return (
    <Reveal className="mt-14">
      <div className="rounded-3xl border border-line bg-cream p-7 md:p-10">
        <div className="max-w-2xl">
          <h3 className="font-display text-2xl uppercase tracking-tight md:text-3xl">
            {packs.title}
          </h3>
          <p className="mt-3 leading-relaxed text-smoke">{packs.sub}</p>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
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
                  {formatPrice(col.perWalk)}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-smoke">
                  la balade
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

        <p className="mt-6 text-sm leading-relaxed text-smoke/80">
          {packs.note}
        </p>
      </div>
    </Reveal>
  );
}
