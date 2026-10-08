import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { site } from "@/content/site.config";
import type { OfferCard } from "@/content/types";
import { SectionHeader } from "@/components/sections/section-header";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { asset, formatPrice } from "@/lib/utils";

/**
 * « Nos autres formules » (`#formules`) — les deux pages ajoutées le
 * 2026-10-08, présentées sur l'accueil juste après les tarifs des balades.
 *
 * Vignettes et non sections complètes : les balades restent l'offre de
 * l'accueil, et Martin a déjà demandé qu'on ne fasse « pas beaucoup défiler ».
 * Chaque carte ne porte que ce qui décide le clic — une phrase, un prix d'appel
 * — et renvoie vers sa page.
 *
 * Pas de fond ni de `py` en haut : la section suit `#service`, crème, dont le
 * `pb` fait déjà la respiration. Son propre `pb` est celui que `#contact`
 * attendait de `#service` (cf. ses marges asymétriques) — l'enchaînement
 * crème → carte sombre du formulaire reste donc identique.
 */
export function OtherServices() {
  const { groupWalk, boarding } = site;
  const cards: { card: OfferCard; href: string; from: number }[] = [
    {
      card: groupWalk.card,
      href: groupWalk.slug,
      from: groupWalk.pricing.unitPrice,
    },
    {
      card: boarding.card,
      href: boarding.slug,
      from: Math.min(...boarding.pricing.nights.map((n) => n.price)),
    },
  ];

  return (
    <section id="formules" className="pb-24 md:pb-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          overline="Nos autres formules"
          title={
            <>
              Et quand il lui faut{" "}
              <span className="font-script normal-case text-flame">
                plus qu’une balade
              </span>
            </>
          }
        />

        <Stagger stagger={0.12} className="grid gap-6 md:grid-cols-2">
          {cards.map(({ card, href, from }) => (
            <StaggerItem key={href} className="h-full">
              {/* <a> et non next/link : asset() ajoute le basePath de la
                  préview, comme partout ailleurs sur le site. */}
              <a
                href={asset(href)}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-line bg-surface transition-colors hover:border-flame sm:flex-row"
              >
                <div className="relative aspect-[4/3] shrink-0 sm:aspect-auto sm:w-2/5">
                  <Image
                    src={card.photo.src}
                    alt={card.photo.alt}
                    fill
                    sizes="(min-width: 768px) 220px, (min-width: 640px) 40vw, calc(100vw - 2rem)"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-flame">
                    {card.name}
                  </p>
                  <h3 className="font-display text-2xl uppercase leading-tight tracking-tight md:text-3xl">
                    {card.tagline}
                  </h3>
                  <p className="text-sm leading-relaxed text-smoke">
                    {card.desc}
                  </p>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
                    <p className="flex flex-col">
                      <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-smoke">
                        Dès
                      </span>
                      <span className="font-display text-3xl leading-none text-flame">
                        {formatPrice(from)}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-smoke">
                        {card.priceUnit}
                      </span>
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink">
                      Découvrir
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-1"
                        aria-hidden
                      />
                    </span>
                  </div>
                </div>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
