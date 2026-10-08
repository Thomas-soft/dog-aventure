import type { Metadata } from "next";
import { Check, Trees } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyCallBar } from "@/components/layout/sticky-call-bar";
import { OfferHero } from "@/components/offer/offer-hero";
import { OfferBlock } from "@/components/offer/offer-block";
import { FirstMeeting } from "@/components/sections/first-meeting";
import { PriceGrid } from "@/components/sections/price-grid";
import { ContactSection } from "@/components/sections/contact";
import { SectionHeader } from "@/components/sections/section-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { RichText } from "@/components/ui/rich-text";
import { site } from "@/content/site.config";
import { formatPrice } from "@/lib/utils";

/* Page « Dog Aventure 2 h » (2026-10-08). Le dossier `app/balade-foret` doit
   porter le même nom que `site.groupWalk.slug` : c'est ce dernier que lisent
   le sitemap, les liens et le canonical. */
const { groupWalk } = site;

export const metadata: Metadata = {
  title: groupWalk.seo.title,
  description: groupWalk.seo.description,
  alternates: { canonical: groupWalk.slug },
  // Sans ce bloc, la page hériterait de l'Open Graph de l'accueil : un lien
  // partagé sur WhatsApp afficherait le titre des balades individuelles.
  openGraph: {
    title: groupWalk.seo.title,
    description: groupWalk.seo.description,
    images: [site.seo.ogImage],
    locale: "fr_FR",
    type: "website",
    url: groupWalk.slug,
  },
};

export default function BaladeForet() {
  const { hero, tagline, blocks, firstMeeting, pricing, forests, closing } =
    groupWalk;
  let photoIndex = 0;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <OfferHero hero={hero} fromPrice={pricing.unitPrice} />

        <section className="border-y border-line bg-surface px-4 py-12 sm:px-6 md:py-16">
          <Reveal>
            <p className="mx-auto max-w-3xl text-center font-script text-3xl leading-snug text-balance text-flame md:text-4xl">
              <RichText text={tagline} />
            </p>
          </Reveal>
        </section>

        <section className="py-24 md:py-32">
          <div className="mx-auto flex max-w-6xl flex-col gap-20 px-4 sm:px-6 md:gap-28">
            {blocks.map((block) => {
              // L'alternance ne compte que les blocs à photo : un bloc texte
              // seul, centré, ne doit pas décaler le côté du suivant.
              const reverse = block.photo ? photoIndex++ % 2 === 1 : false;
              return (
                <OfferBlock key={block.id} block={block} reverse={reverse} />
              );
            })}
          </div>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <FirstMeeting content={firstMeeting} />
          </div>
        </section>

        <section
          id="tarifs"
          className="border-y border-line bg-surface py-24 md:py-32"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeader
              overline="Les tarifs"
              title={pricing.title}
              sub={`2 heures en forêt avec les copains, dès ${formatPrice(pricing.unitPrice)}\u00a0!`}
            />
            <Reveal>
              <PriceGrid
                unitLabel={pricing.unitLabel}
                unitPrice={pricing.unitPrice}
                unitDesc={pricing.unitDesc}
                packs={pricing.packs}
                perLabel="la sortie"
                packWord="le pack"
              />
            </Reveal>
            <Reveal delay={0.1} className="mt-8">
              <div className="rounded-3xl border border-line bg-cream p-7 md:p-9">
                <h3 className="font-display text-2xl uppercase tracking-tight">
                  {pricing.includedTitle}
                </h3>
                <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {pricing.included.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-flame text-primary-foreground"
                        aria-hidden
                      >
                        <Check className="size-3.5" />
                      </span>
                      <span className="text-sm font-semibold leading-relaxed text-ink/85">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Fond encre, comme `#zones` sur l'accueil : c'est la même question
            — où ça se passe — et le même traitement. */}
        <section className="bg-ink py-24 text-cream md:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="mb-12 flex max-w-2xl flex-col gap-4 md:mb-16">
              <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-leaf">
                <span className="h-px w-8 bg-leaf" aria-hidden />
                Les forêts
              </span>
              <h2 className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl">
                <RichText text={forests.title} />
              </h2>
            </Reveal>
            <Stagger stagger={0.1} className="grid gap-5 md:grid-cols-3">
              {forests.items.map((forest) => (
                <StaggerItem key={forest.name} className="h-full">
                  <div className="flex h-full flex-col gap-3 rounded-2xl border border-cream/15 bg-cream/[0.04] p-6 md:p-7">
                    <Trees className="size-7 text-leaf" aria-hidden />
                    <h3 className="font-display text-2xl uppercase tracking-tight">
                      {forest.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-cream/65">
                      {forest.desc}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-sm leading-relaxed text-cream/60">
                {forests.note}
              </p>
            </Reveal>
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
