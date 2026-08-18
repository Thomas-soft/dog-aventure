import { MessageCircle, PawPrint, Phone } from "lucide-react";
import { site } from "@/content/site.config";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/ui/whatsapp-icon";

/* L'ancre `#contact` a suivi le formulaire vers le haut de page : la barre de
   navigation, le menu mobile et le pied de page y mènent tous. Cette section
   porte donc `#reserver`. Ne pas lui rendre `#contact` sans déplacer les trois
   liens en même temps — ils atterriraient de nouveau tout en bas. */
export function ContactSection() {
  return (
    <section id="reserver" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-center text-cream md:py-24">
            <PawPrint
              className="pointer-events-none absolute -right-12 -top-14 size-56 rotate-12 text-leaf/10 md:size-80"
              aria-hidden
            />
            <PawPrint
              className="pointer-events-none absolute -bottom-16 -left-12 size-48 -rotate-12 text-leaf/10 md:size-72"
              aria-hidden
            />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
              {/* « Réservation » seul, et plus « par téléphone ou SMS » : cette
                  accroche coiffe toute la carte, qui porte désormais aussi le
                  formulaire — elle en annonçait deux canaux sur trois. */}
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-leaf">
                Réservation
              </span>
              <h2 className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl">
                On cale sa{" "}
                <span className="font-script normal-case text-leaf">
                  première balade
                </span>
                &nbsp;?
              </h2>
              <p className="max-w-lg leading-relaxed text-cream/70 md:text-lg">
                Un appel ou un SMS suffit : on parle de votre chien, on cale un
                créneau, et on vient le chercher chez vous.
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  nativeButton={false}
                  render={<a href={site.phoneHref} />}
                  className="h-12 rounded-full bg-cream px-7 text-lg font-bold text-ink hover:bg-leaf"
                >
                  <Phone data-icon="inline-start" />
                  {site.phone}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  nativeButton={false}
                  render={<a href={site.smsHref} />}
                  className="h-12 rounded-full border-cream/50 bg-transparent px-6 text-base text-cream hover:bg-cream/10 hover:text-cream"
                >
                  <MessageCircle data-icon="inline-start" />
                  Réserver par SMS
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
                  className="h-12 rounded-full border-cream/50 bg-transparent px-6 text-base text-cream hover:bg-cream/10 hover:text-cream"
                >
                  <WhatsappIcon data-icon="inline-start" />
                  WhatsApp
                </Button>
              </div>
              {/* Le formulaire vivait ici, sous un filet de séparation. Il a
                  été remonté juste sous le hero le 2026-08-14 (demande
                  client : ne pas faire défiler la page pour écrire) — voir
                  `contact-form-section.tsx`. Cette section conclut désormais
                  sur l'appel et le SMS seuls, ce qui reste la hiérarchie
                  voulue : l'appel convertit le mieux et c'est celui que Martin
                  préfère. Ne pas y réintroduire un second formulaire — deux
                  formulaires identiques sur une page unique brouillent la
                  lecture autant que les statistiques. */}
              <p className="mt-8 font-script text-2xl text-cream/85 md:text-3xl">
                {site.tagline}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
