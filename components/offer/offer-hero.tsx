import Image from "next/image";
import { MessageCircle, PawPrint, Phone } from "lucide-react";
import { site } from "@/content/site.config";
import type { OfferHero as OfferHeroContent } from "@/content/types";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/ui/rich-text";
import { WhatsappIcon } from "@/components/ui/whatsapp-icon";
import { formatPrice } from "@/lib/utils";

/**
 * En-tête des pages de prestation (garde, Dog Aventure 2 h). Même grammaire
 * que le hero de l'accueil — pastille, titre sur deux lignes dont la seconde
 * en manuscrit, prix d'appel, les trois canaux — pour que le visiteur arrivé
 * depuis une annonce ou un lien partagé sache tout de suite où il est.
 *
 * La photo est l'élément LCP de la page : préchargée, jamais animée.
 */
export function OfferHero({
  hero,
  fromPrice,
}: {
  hero: OfferHeroContent;
  fromPrice: number;
}) {
  return (
    <section className="px-4 pb-16 pt-24 sm:px-6 md:pb-24 md:pt-36">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Stagger
          mode="load"
          stagger={0.12}
          delay={0.1}
          className="flex flex-col items-start gap-6 lg:col-span-7"
        >
          <StaggerItem>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold tracking-wide text-smoke">
              <PawPrint className="size-3.5 text-flame" aria-hidden />
              {hero.overline}
            </span>
          </StaggerItem>

          <StaggerItem>
            <h1 className="font-display text-5xl uppercase leading-[1.02] tracking-tight text-balance sm:text-6xl">
              <RichText text={hero.title} />
              <br />
              <span className="font-script normal-case tracking-normal text-flame">
                <RichText text={hero.titleScript} />
              </span>
            </h1>
          </StaggerItem>

          <StaggerItem className="flex max-w-xl flex-col gap-3">
            <p className="text-lg font-bold leading-snug text-ink md:text-xl">
              <RichText text={hero.lead} />
            </p>
            <p className="leading-relaxed text-smoke md:text-lg">
              <RichText text={hero.intro} />
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-3 shadow-sm">
              <span className="flex flex-col items-start">
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-smoke">
                  Dès
                </span>
                <span className="font-display text-4xl leading-none text-flame sm:text-5xl">
                  {formatPrice(fromPrice)}
                </span>
              </span>
              <span className="text-sm font-semibold leading-snug text-ink/80">
                {hero.priceUnit}
              </span>
            </div>
          </StaggerItem>

          <StaggerItem className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              nativeButton={false}
              render={<a href={site.phoneHref} />}
              className="h-12 rounded-full px-7 text-base font-semibold"
            >
              <Phone data-icon="inline-start" />
              {site.phone}
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<a href={site.smsHref} />}
              className="h-12 rounded-full border-ink bg-transparent px-6 text-base hover:border-flame hover:bg-flame hover:text-primary-foreground"
            >
              <MessageCircle data-icon="inline-start" />
              Par SMS
            </Button>
            {/* Voir hero.tsx pour le pourquoi de `target`/`rel`. */}
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              className="h-12 rounded-full border-ink bg-transparent px-6 text-base hover:border-flame hover:bg-flame hover:text-primary-foreground"
            >
              <WhatsappIcon data-icon="inline-start" />
              WhatsApp
            </Button>
          </StaggerItem>
        </Stagger>

        <div className="lg:col-span-5">
          <div className="relative mx-auto mr-4 max-w-md sm:mr-auto">
            <div
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border-2 border-flame"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-[2rem] bg-surface">
              <Image
                src={hero.photo.src}
                alt={hero.photo.alt}
                width={hero.photo.width}
                height={hero.photo.height}
                preload
                sizes="(min-width: 1024px) 448px, (min-width: 480px) 448px, calc(100vw - 3rem)"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
