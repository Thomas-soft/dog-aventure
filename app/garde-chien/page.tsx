import type { Metadata } from "next";
import type { ElementType } from "react";
import Image from "next/image";
import { ArrowRight, Camera, HeartHandshake, Moon, Users } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyCallBar } from "@/components/layout/sticky-call-bar";
import { OfferHero } from "@/components/offer/offer-hero";
import { FirstMeeting } from "@/components/sections/first-meeting";
import { ContactSection } from "@/components/sections/contact";
import { SectionHeader } from "@/components/sections/section-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { RichText } from "@/components/ui/rich-text";
import { site } from "@/content/site.config";
import type { BoardingIcon } from "@/content/types";
import { asset, cn, formatPrice } from "@/lib/utils";

/* Page « Garde avec nuitée » (2026-10-08). Le dossier `app/garde-chien` doit
   porter le même nom que `site.boarding.slug` : c'est ce dernier que lisent
   le sitemap, les liens et le canonical. */
const { boarding } = site;

export const metadata: Metadata = {
  title: boarding.seo.title,
  description: boarding.seo.description,
  alternates: { canonical: boarding.slug },
  // Sans ce bloc, la page hériterait de l'Open Graph de l'accueil.
  openGraph: {
    title: boarding.seo.title,
    description: boarding.seo.description,
    images: [site.seo.ogImage],
    locale: "fr_FR",
    type: "website",
    url: boarding.slug,
  },
};

const ICONS: Record<BoardingIcon, ElementType> = {
  users: Users,
  "heart-handshake": HeartHandshake,
  camera: Camera,
};

export default function GardeChien() {
  const {
    hero,
    intro,
    points,
    signature,
    gallery,
    pricing,
    options,
    firstMeeting,
    closing,
  } = boarding;
  // Le « dès » de l'en-tête est le tarif le plus bas de la grille, jamais un
  // chiffre recopié : il suivra tout seul le jour où la grille bouge.
  const fromPrice = Math.min(...pricing.nights.map((n) => n.price));

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <OfferHero hero={hero} fromPrice={fromPrice} />

        {/* Même construction que `#confiance` sur l'accueil : bandeau
            `bg-surface`, cartes crème, phrase manuscrite, et le bandeau sombre
            « Première rencontre offerte » pour fermer. */}
        <section className="border-y border-line bg-surface py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              <Reveal className="flex flex-col gap-4">
                <h2 className="font-display text-4xl uppercase leading-tight tracking-tight text-balance md:text-5xl">
                  <RichText text={intro.title} />
                </h2>
                {intro.paragraphs.map((p) => (
                  <p key={p} className="leading-relaxed text-smoke md:text-lg">
                    <RichText text={p} />
                  </p>
                ))}
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mx-auto max-w-sm overflow-hidden rounded-3xl border border-line bg-cream shadow-sm">
                  <Image
                    src={intro.photo.src}
                    alt={intro.photo.alt}
                    width={intro.photo.width}
                    height={intro.photo.height}
                    sizes="(min-width: 768px) 384px, calc(100vw - 2rem)"
                    className="h-auto w-full"
                  />
                </div>
              </Reveal>
            </div>

            <Stagger
              stagger={0.1}
              className="mt-16 grid gap-5 md:mt-20 md:grid-cols-3"
            >
              {points.map((point) => {
                const Icon = ICONS[point.icon];
                return (
                  <StaggerItem key={point.title} y={20} className="h-full">
                    <div className="flex h-full flex-col gap-3 rounded-2xl border border-line bg-cream p-6">
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-cream"
                        aria-hidden
                      >
                        <Icon className="size-5" />
                      </span>
                      <h3 className="font-display text-xl uppercase tracking-tight">
                        {point.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-smoke">
                        <RichText text={point.desc} />
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>

            <Reveal delay={0.1}>
              <p className="mx-auto mt-12 max-w-4xl text-center font-script text-3xl leading-snug text-balance text-flame md:text-4xl">
                <RichText text={signature} />
              </p>
            </Reveal>

            <FirstMeeting content={firstMeeting} />
          </div>
        </section>

        {/* Pas de `pb` : le bandeau de réservation qui suit apporte déjà son
            `py` de crème, les deux s'additionneraient en un trou de 200 px. */}
        <section id="tarifs" className="pt-24 md:pt-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeader
              overline="Les tarifs"
              title={pricing.title}
              sub={pricing.sub}
            />

            <div className="grid gap-6 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <div className="h-full rounded-3xl border-2 border-flame bg-surface p-7 shadow-lg md:p-8">
                  <h3 className="flex items-center gap-2.5 font-display text-2xl uppercase tracking-tight">
                    <Moon className="size-5 text-flame" aria-hidden />
                    Prix par nuit
                  </h3>
                  <table className="mt-5 w-full text-left">
                    <caption className="sr-only">
                      Prix de la garde par nuit selon la durée du séjour
                    </caption>
                    <thead>
                      <tr className="text-xs font-bold uppercase tracking-wide text-smoke">
                        <th scope="col" className="pb-2 font-bold">
                          Durée du séjour
                        </th>
                        <th scope="col" className="pb-2 text-right font-bold">
                          La nuit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricing.nights.map((night) => {
                        const best = night.price === fromPrice;
                        return (
                          <tr key={night.label} className="border-t border-line">
                            <th
                              scope="row"
                              className="py-3 text-sm font-semibold text-ink/85"
                            >
                              {night.label}
                            </th>
                            <td
                              className={cn(
                                "py-3 text-right font-display text-2xl",
                                best ? "text-flame" : "text-ink",
                              )}
                            >
                              {formatPrice(night.price)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <p className="mt-4 text-sm leading-relaxed text-smoke">
                    <RichText text={pricing.note} />
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.08} className="lg:col-span-4">
                <div className="h-full rounded-3xl border border-line bg-surface p-7 md:p-8">
                  <h3 className="font-display text-2xl uppercase tracking-tight">
                    {options.title}
                  </h3>
                  <ul className="mt-5">
                    {options.items.map((option) => (
                      <li
                        key={option.label}
                        className="flex items-baseline justify-between gap-4 border-t border-line py-3 first:border-t-0 first:pt-0"
                      >
                        {option.href ? (
                          <a
                            href={asset(option.href)}
                            className="group inline-flex items-baseline gap-1.5 text-sm font-semibold text-ink/85 underline-offset-4 hover:text-flame hover:underline"
                          >
                            {option.label}
                            <ArrowRight
                              className="size-3.5 shrink-0 self-center transition-transform group-hover:translate-x-0.5"
                              aria-hidden
                            />
                          </a>
                        ) : (
                          <span className="text-sm font-semibold text-ink/85">
                            {option.label}
                          </span>
                        )}
                        <span className="shrink-0 text-right text-sm font-bold text-ink">
                          {option.from && (
                            <span className="font-semibold text-smoke">
                              Dès{" "}
                            </span>
                          )}
                          +{formatPrice(option.price)}
                          {option.perNight && (
                            <span className="font-semibold text-smoke">
                              {" "}
                              / nuit
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* Deux photos de pensionnaires à côté des prix : c'est ce que
                  le visiteur paie, autant qu'il le voie. En colonne sur grand
                  écran, côte à côte en dessous. */}
              <Stagger
                stagger={0.1}
                className="grid grid-cols-2 gap-4 lg:col-span-3 lg:grid-cols-1"
              >
                {gallery.map((photo) => (
                  <StaggerItem key={photo.src} y={20}>
                    <div className="overflow-hidden rounded-3xl border border-line bg-surface">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        sizes="(min-width: 1024px) 270px, calc(50vw - 1.5rem)"
                        className="h-auto w-full"
                      />
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </section>

        <ContactSection
          title={<RichText text={closing.title} />}
          paragraphs={closing.paragraphs}
          signature={closing.signature}
        />
      </main>
      <Footer />
      <StickyCallBar />
    </>
  );
}
