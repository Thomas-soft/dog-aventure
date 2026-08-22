import type { ElementType } from "react";
import Image from "next/image";
import {
  Droplets,
  Home,
  MessageCircle,
  PawPrint,
  Phone,
  Star,
  Zap,
} from "lucide-react";
import { site } from "@/content/site.config";
import type { FeatureIcon } from "@/content/types";
import { SectionHeader } from "@/components/sections/section-header";
import { Packs } from "@/components/sections/packs";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";

const FEATURE_ICONS: Record<FeatureIcon, ElementType> = {
  "paw-print": PawPrint,
  zap: Zap,
  droplets: Droplets,
  home: Home,
};

export function ServiceSection() {
  const { walk, walkAlt, greeting, greetingAlt } = site.images;

  return (
    <section id="service" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          overline="La promenade"
          title={
            <>
              Une balade rien que{" "}
              <span className="font-script normal-case text-flame">
                pour lui
              </span>
            </>
          }
          sub="Pas de garderie, pas de meute : une promenade individuelle, adaptée au rythme de votre chien, de votre porte à votre porte."
        />

        {/* La balade en forêt, entre le titre et les tarifs (demande client du
            2026-08-22 : « juste avant les tarifs et les prix »). Elle montre la
            prestation — tenue, longe, chien devant — pour que le prix qui suit
            s'applique à quelque chose que le visiteur a vu.

            Pas dans la galerie `#chiens` : ce n'est pas un portrait de chien.

            `max-w-3xl` centré sous un titre aligné à gauche, comme la photo du
            binôme de `#confiance`. En pleine largeur (`max-w-6xl`) elle ferait
            864 px de haut et pousserait les prix hors de l'écran. */}
        {walk && (
          <Reveal className="mb-12 md:mb-16">
            <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-line bg-surface shadow-sm">
              <Image
                src={walk}
                alt={walkAlt ?? ""}
                width={1242}
                height={932}
                sizes="(min-width: 768px) 768px, calc(100vw - 2rem)"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        )}

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Offres — une carte par service, la 2ᵉ offre s'ajoutera ici toute seule */}
          <Stagger stagger={0.12} className="flex flex-col gap-6 lg:col-span-3">
            {site.services.map((service) => (
              <StaggerItem key={service.id}>
                {/* Toute la hiérarchie visuelle est ici : l'offre phare garde
                    le cadre orange, le prix en couleur et le grand format ;
                    l'autre passe en gris et d'un cran plus petit. Le
                    `priceNote` ramène les deux au tarif horaire — c'est lui qui
                    fait la démonstration, pas la mise en forme. */}
                <article
                  className={cn(
                    "flex h-full flex-col gap-6 rounded-3xl border-2 bg-surface p-7 md:p-9",
                    service.highlight
                      ? "border-flame shadow-lg"
                      : "border-line",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3
                        className={cn(
                          "font-display uppercase tracking-tight",
                          service.highlight
                            ? "text-3xl md:text-4xl"
                            : "text-2xl md:text-3xl",
                        )}
                      >
                        {service.name}
                      </h3>
                      {service.badge && (
                        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-flame px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                          <Star className="size-3.5 fill-current" aria-hidden />
                          {service.badge}
                        </p>
                      )}
                    </div>
                    <p className="flex flex-col items-end">
                      <span
                        className={cn(
                          "font-display",
                          service.highlight
                            ? "text-5xl text-flame"
                            : "text-4xl text-smoke",
                        )}
                      >
                        {formatPrice(service.price)}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-smoke">
                        {service.duration} de promenade
                      </span>
                      {service.priceNote && (
                        <span className="text-xs text-smoke/70">
                          {service.priceNote}
                        </span>
                      )}
                    </p>
                  </div>

                  <p className="leading-relaxed text-smoke">{service.desc}</p>

                  <ul className="grid gap-3 sm:grid-cols-2">
                    {service.features.map((feature) => {
                      const Icon = FEATURE_ICONS[feature.icon];
                      return (
                        <li
                          key={feature.label}
                          className="flex items-center gap-3 rounded-xl border border-line bg-cream px-4 py-3"
                        >
                          <span
                            className={cn(
                              "grid size-9 shrink-0 place-items-center rounded-full",
                              service.highlight
                                ? "bg-flame text-primary-foreground"
                                : "bg-ink/10 text-ink/60",
                            )}
                          >
                            <Icon className="size-4.5" aria-hidden />
                          </span>
                          <span className="text-sm font-semibold text-ink/85">
                            {feature.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Un seul bouton plein sur la page « offres », celui de
                      l'offre phare. L'autre carte reste en contour : elle est
                      réservable, sans capter le regard. Le SMS n'est doublé que
                      sur la phare — quatre CTA identiques d'affilée, sinon. */}
                  <div className="mt-auto flex flex-wrap gap-3 pt-2">
                    <Button
                      size="lg"
                      variant={service.highlight ? "default" : "outline"}
                      nativeButton={false}
                      render={<a href={site.phoneHref} />}
                      className={cn(
                        "h-11 rounded-full px-6 text-base font-semibold",
                        !service.highlight &&
                          "border-ink bg-transparent hover:border-flame hover:bg-flame hover:text-primary-foreground",
                      )}
                    >
                      <Phone data-icon="inline-start" />
                      Réserver au {site.phone}
                    </Button>
                    {service.highlight && (
                      <Button
                        size="lg"
                        variant="outline"
                        nativeButton={false}
                        render={<a href={site.smsHref} />}
                        className="h-11 rounded-full border-ink bg-transparent px-6 text-base hover:border-flame hover:bg-flame hover:text-primary-foreground"
                      >
                        <MessageCircle data-icon="inline-start" />
                        Par SMS
                      </Button>
                    )}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>

          {/* Comment ça marche */}
          <Reveal delay={0.15} className="lg:col-span-2">
            <div className="flex h-full flex-col gap-6 rounded-3xl border border-line bg-cream p-7 md:p-8">
              <h3 className="font-display text-2xl uppercase tracking-tight">
                Comment ça marche&nbsp;?
              </h3>
              <ol className="flex flex-col gap-6">
                {site.steps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-ink font-display text-lg text-cream"
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-ink">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-smoke">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              {/* Le chien qui vient chercher sa caresse, à hauteur des tarifs
                  (demande client du 2026-08-22). Cette carte ne remplissait
                  qu'environ la moitié de la hauteur des deux cartes d'offres
                  qu'elle longe : le `mt-auto` de la phrase manuscrite ne
                  faisait que rendre ce vide visible. La photo l'occupe, et un
                  museau en face des prix vaut mieux que du blanc.

                  C'est elle qui porte le `mt-auto` quand elle est là — sinon
                  la carte se replierait vers le haut et le vide reviendrait
                  entre la photo et la phrase. Sans photo, le `mt-auto`
                  retourne à la phrase et rien ne bouge. */}
              {greeting && (
                <div className="mt-auto overflow-hidden rounded-2xl">
                  <Image
                    src={greeting}
                    alt={greetingAlt ?? ""}
                    width={720}
                    height={540}
                    sizes="(min-width: 1024px) 420px, (min-width: 640px) calc(100vw - 7rem), calc(100vw - 5.5rem)"
                    className="h-auto w-full"
                  />
                </div>
              )}

              <p
                className={cn(
                  "font-script text-2xl leading-snug text-flame",
                  !greeting && "mt-auto",
                )}
              >
                {site.slogan}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Les carnets sont adossés à la balade d'1 h : ils vivent donc dans
            cette section plutôt que dans une section à eux, qui casserait le
            rythme crème → surface → sombre de la page. */}
        <Packs />
      </div>
    </section>
  );
}
