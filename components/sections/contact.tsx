import { MessageCircle, PawPrint, Phone } from "lucide-react";
import { site } from "@/content/site.config";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/sections/contact-form";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 md:py-32">
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
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-leaf">
                Réservation par téléphone ou SMS
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
                créneau, et je viens le chercher chez vous.
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
              </div>
              {/* Le formulaire vient APRÈS les boutons, et visuellement en
                  retrait : l'appel reste l'action principale — c'est lui qui
                  convertit le mieux et c'est lui que Martin préfère. Le
                  formulaire ne le remplace pas, il rattrape ceux qui n'osent
                  pas décrocher. Ne pas inverser cette hiérarchie. */}
              <div className="mt-10 w-full border-t border-cream/15 pt-10">
                <span className="text-xs font-bold uppercase tracking-[0.28em] text-leaf">
                  {site.contactForm.eyebrow}
                </span>
                <h3 className="mt-3 font-display text-2xl uppercase tracking-tight sm:text-3xl">
                  {site.contactForm.title}
                </h3>
                <p className="mx-auto mt-3 mb-8 max-w-md leading-relaxed text-cream/70">
                  {site.contactForm.intro}
                </p>
                <ContactForm />
              </div>

              <p className="mt-4 font-script text-2xl text-cream/85 md:text-3xl">
                {site.tagline}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
