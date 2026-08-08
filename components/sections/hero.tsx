"use client";

import Image from "next/image";
import { MessageCircle, PawPrint, Phone } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { CircularSticker } from "@/components/fx/circular-sticker";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site.config";
import { formatPrice } from "@/lib/utils";

export function Hero() {
  const balade = site.services[0];

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
              Je le promène,
              <br />
              <span className="font-script normal-case tracking-normal text-flame">
                vous profitez du reste&nbsp;!
              </span>
            </h1>
          </StaggerItem>

          <StaggerItem>
            <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-3 shadow-sm">
              <span className="font-display text-4xl text-flame sm:text-5xl">
                {formatPrice(balade.price)}
              </span>
              <span className="text-sm font-semibold leading-snug text-ink/80">
                la balade individuelle
                <br />
                d&rsquo;{balade.duration} — à domicile
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
          {/* Pas d'animation d'opacité ici : c'est l'élément LCP, il doit être
              visible dès le HTML initial (sinon le rendu attend l'hydratation) */}
          <div className="relative mr-4 sm:mr-0">
            <div
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border-2 border-flame"
              aria-hidden
            />
            <div className="relative aspect-square max-h-[600px] w-full overflow-hidden rounded-[2rem] sm:aspect-[4/5]">
              <Image
                src={site.images.hero}
                alt={site.images.heroAlt}
                fill
                preload
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, calc(100vw - 3rem)"
              />
            </div>
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
