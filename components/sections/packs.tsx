import { site } from "@/content/site.config";
import { Reveal } from "@/components/motion/reveal";
import { PriceGrid } from "@/components/sections/price-grid";

/**
 * Carnets de la balade d'1 h, rendus sous les offres de l'accueil. Le calcul
 * (prix à la balade, économie) vit dans `PriceGrid`, partagé avec la page
 * Dog Aventure 2 h. La colonne « à l'unité » lit le service `packs.serviceId`,
 * pour que 22,90 € ne vive qu'à un seul endroit.
 */
export function Packs() {
  const { packs } = site;
  const unit = site.services.find((s) => s.id === packs.serviceId);

  // Service de référence introuvable ou aucun carnet : on n'affiche rien
  // plutôt qu'une grille amputée de sa colonne d'entrée.
  if (!unit || packs.items.length === 0) return null;

  return (
    <Reveal className="mt-14">
      <div className="rounded-3xl border border-line bg-cream p-7 md:p-10">
        <div className="max-w-2xl">
          <h3 className="font-display text-2xl uppercase tracking-tight md:text-3xl">
            {packs.title}
          </h3>
          <p className="mt-3 leading-relaxed text-smoke">{packs.sub}</p>
        </div>

        <div className="mt-8">
          <PriceGrid
            unitLabel={packs.unitLabel}
            unitPrice={unit.price}
            unitDesc={packs.unitDesc}
            packs={packs.items}
            perLabel="la balade"
            packWord="le carnet"
          />
        </div>

        <p className="mt-6 text-sm leading-relaxed text-smoke/80">
          {packs.note}
        </p>
      </div>
    </Reveal>
  );
}
