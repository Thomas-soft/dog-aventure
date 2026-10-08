"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { MessageCircle, PawPrint, Phone } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { CircularSticker } from "@/components/fx/circular-sticker";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/ui/whatsapp-icon";
import { site } from "@/content/site.config";
import { cn, formatPrice } from "@/lib/utils";

/* Au-delà de 1216 px le conteneur max-w-6xl est atteint et la colonne se fige
   à 544 px : l'annoncer évite de charger une variante trop petite, donc floue
   à l'affichage. Commun à toutes les photos du cadre. */
const HERO_SIZES =
  "(min-width: 1216px) 544px, (min-width: 1024px) 45vw, calc(100vw - 3rem)";

/** Délai avant de monter les photos suivantes, puis entre deux fondus */
const SLIDES_MOUNT_DELAY = 2500;
const SLIDE_INTERVAL = 6000;

/**
 * Les photos du hero (demande client du 2026-10-08 : « alterner les images,
 * même la première »).
 *
 * L'ordre de rendu EST le garde-fou de performance, à ne pas « simplifier » :
 * - la première photo est l'élément LCP. Elle est préchargée, rendue dans le
 *   HTML initial et **ne s'anime jamais** — ni opacité, ni transform. Elle
 *   reste en fond, en permanence, même quand une autre est affichée ;
 * - les suivantes ne sont montées qu'après `SLIDES_MOUNT_DELAY`, donc bien
 *   après le LCP, et se posent PAR-DESSUS en fondu. Revenir à la première,
 *   c'est simplement les rendre transparentes.
 *
 * Accessibilité : avec `prefers-reduced-motion`, rien ne défile tout seul.
 * Les pastilles permettent de choisir une photo, et un clic arrête le
 * défilement — c'est le moyen de mise en pause qu'exige le RGAA/WCAG 2.2.2
 * pour un contenu qui change seul.
 */
function HeroPhotos() {
  const { hero, heroAlt, heroMobilePosition, heroSlides = [] } = site.images;
  const slides = [
    { src: hero, alt: heroAlt, mobilePosition: heroMobilePosition },
    ...heroSlides,
  ];
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || slides.length < 2) return;
    const t = setTimeout(() => setMounted(true), SLIDES_MOUNT_DELAY);
    return () => clearTimeout(t);
  }, [reduce, slides.length]);

  useEffect(() => {
    if (!mounted || paused || reduce) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_INTERVAL,
    );
    return () => clearInterval(t);
  }, [mounted, paused, reduce, slides.length]);

  return (
    <div className="relative aspect-square max-h-[600px] w-full overflow-hidden rounded-[2rem] sm:aspect-[4/5]">
      {slides.map((slide, i) => {
        // Les suivantes n'existent pas dans le HTML initial : rien ne
        // concurrence le téléchargement de la première.
        if (i > 0 && !mounted) return null;
        return (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            preload={i === 0}
            aria-hidden={i !== index}
            /* object-position remonté sur mobile : les photos sont cadrées
               en 4/5, et un recadrage carré centré couperait le haut du
               crâne. `--pos` porte le réglage propre à chaque photo. */
            style={
              { "--pos": slide.mobilePosition ?? "50% 15%" } as CSSProperties
            }
            className={cn(
              "object-cover object-[var(--pos)] sm:object-center",
              i > 0 &&
                "transition-opacity duration-1000 ease-in-out motion-reduce:transition-none",
              i > 0 && i !== index && "opacity-0",
            )}
            sizes={HERO_SIZES}
          />
        );
      })}

      {slides.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2 rounded-full bg-ink/45 px-2.5 py-2 backdrop-blur-sm">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Afficher la photo ${i + 1} sur ${slides.length}`}
              aria-pressed={i === index}
              onClick={() => {
                setMounted(true);
                setPaused(true);
                setIndex(i);
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === index ? "w-5 bg-cream" : "w-2 bg-cream/55 hover:bg-cream/80",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Hero() {
  // Le prix d'appel, pas services[0] : l'ordre des offres reste libre
  const fromPrice = Math.min(...site.services.map((s) => s.price));

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 md:pb-24 md:pt-36">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Stagger
          mode="load"
          stagger={0.13}
          delay={0.15}
          className="flex flex-col items-start gap-6 lg:col-span-6"
        >
          <StaggerItem>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold tracking-wide text-smoke">
              <PawPrint className="size-3.5 text-flame" aria-hidden />
              {site.subSlogan}
            </span>
          </StaggerItem>

          <StaggerItem>
            <h1 className="font-display text-5xl uppercase leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl">
              On le promène,
              <br />
              <span className="font-script normal-case tracking-normal text-flame">
                vous profitez du reste&nbsp;!
              </span>
            </h1>
          </StaggerItem>

          <StaggerItem>
            <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-3 shadow-sm">
              <span className="flex flex-col items-start">
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-smoke">
                  À partir de
                </span>
                <span className="font-display text-4xl leading-none text-flame sm:text-5xl">
                  {formatPrice(fromPrice)}
                </span>
              </span>
              <span className="text-sm font-semibold leading-snug text-ink/80">
                la balade individuelle
                <br />
                à domicile
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
              Réserver par SMS
            </Button>
            {/* Troisième canal (2026-08-14). `target="_blank"` : wa.me
                redirige vers l'application ou vers web.whatsapp.com — sans
                lui, un visiteur qui revient en arrière depuis WhatsApp perd
                la page. `rel` obligatoire avec `_blank` (accès à
                `window.opener` sinon). */}
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

          <StaggerItem>
            <p className="max-w-md leading-relaxed text-smoke md:text-lg">
              {site.description}
            </p>
          </StaggerItem>

          <StaggerItem className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
            {site.heroChips.map((chip, i) => (
              <span
                key={chip}
                className="flex items-center gap-3 text-sm font-medium text-smoke"
              >
                {i > 0 && (
                  <PawPrint className="size-3 text-flame" aria-hidden />
                )}
                {chip}
              </span>
            ))}
          </StaggerItem>
        </Stagger>

        <div className="lg:col-span-6">
          <div className="relative mr-4 sm:mr-0">
            <div
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border-2 border-flame"
              aria-hidden
            />
            <HeroPhotos />
            <CircularSticker
              text="confiance ✦ bienveillance ✦ "
              center={<PawPrint className="size-7 md:size-9" aria-hidden />}
              className="absolute -bottom-8 -left-2 sm:-left-6 md:-left-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
