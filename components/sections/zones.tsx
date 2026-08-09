import { MapPin, MessageCircle, Phone } from "lucide-react";
import { site } from "@/content/site.config";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

/** Section inversée : fond encre — les villes desservies, l'argument n°1 du client */
export function ZonesSection() {
  return (
    <section id="zones" className="bg-ink py-24 text-cream md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mb-12 flex max-w-2xl flex-col gap-4 md:mb-16">
          <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-leaf">
            <span className="h-px w-8 bg-leaf" aria-hidden />
            Où j&rsquo;interviens
          </span>
          {/* Le seul titre porteur du mot-clé, et c'est sa place : la section
              parle précisément du secteur couvert. Les autres titres gardent
              la voix du site — voir la section SEO de CLAUDE.md. */}
          <h2 className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl">
            Promeneur de chien{" "}
            <span className="font-script normal-case text-leaf">
              à {site.base.city} {site.townsSuffix}
            </span>
          </h2>
          <p className="leading-relaxed text-cream/60 md:text-lg">
            Basé à {site.base.city} ({site.base.zip}), j&rsquo;interviens dans
            tout le secteur — {site.base.region} et sud de l&rsquo;Oise.
          </p>
        </Reveal>

        <Stagger stagger={0.12} className="grid gap-6 lg:grid-cols-3">
          <StaggerItem className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-2xl border border-cream/15 bg-cream/[0.04] p-6 md:p-7">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                {site.towns.map((town) => (
                  <li key={town} className="flex items-center gap-2.5">
                    <MapPin className="size-4 shrink-0 text-leaf" aria-hidden />
                    <span className="font-display text-lg uppercase tracking-wide md:text-xl">
                      {town}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-cream/15 pt-5 text-sm leading-relaxed text-cream/60">
                <span className="font-script text-xl text-leaf">
                  {site.townsSuffix} ♡
                </span>
                {" — "}votre ville n&rsquo;est pas sur la liste&nbsp;? Appelez-moi,
                on trouve une solution.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex h-full flex-col gap-5 rounded-2xl border border-cream/15 bg-cream/[0.04] p-6 md:p-7">
              <h3 className="font-display text-2xl uppercase tracking-tight">
                Réservation
              </h3>
              <p className="text-sm leading-relaxed text-cream/60">
                Par téléphone ou SMS, en deux minutes. Je viens chercher votre
                chien directement chez vous.
              </p>
              <div className="mt-auto flex flex-col gap-3">
                <Button
                  size="lg"
                  nativeButton={false}
                  render={<a href={site.phoneHref} />}
                  className="h-11 rounded-full bg-leaf text-base font-bold text-ink hover:bg-cream"
                >
                  <Phone data-icon="inline-start" />
                  {site.phone}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  nativeButton={false}
                  render={<a href={site.smsHref} />}
                  className="h-11 rounded-full border-cream/30 bg-transparent text-base text-cream hover:border-cream hover:bg-cream hover:text-ink"
                >
                  <MessageCircle data-icon="inline-start" />
                  Envoyer un SMS
                </Button>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem className="lg:col-span-3">
            <div className="h-72 overflow-hidden rounded-2xl border border-cream/15">
              <iframe
                src={site.mapsEmbedUrl}
                title={`Zone d'intervention de ${site.name} — ${site.base.city}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
