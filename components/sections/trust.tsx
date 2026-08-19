import Image from "next/image";
import {
  CalendarCheck,
  Camera,
  ClipboardCheck,
  Dog,
  GraduationCap,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { site } from "@/content/site.config";
import type { TrustIcon } from "@/content/types";
import { SectionHeader } from "@/components/sections/section-header";
import { FirstMeeting } from "@/components/sections/first-meeting";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const ICONS: Record<TrustIcon, LucideIcon> = {
  camera: Camera,
  "clipboard-check": ClipboardCheck,
  dog: Dog,
  "calendar-check": CalendarCheck,
};

export function TrustSection() {
  const { credential, insurance, points, signature } = site.trust;
  const { team, teamAlt } = site.images;

  return (
    // `border-b` et non `border-y` : depuis le 2026-08-16 la section suit
    // directement le bandeau des villes, qui est déjà en `border-y bg-surface`.
    // Les deux traits se cumuleraient en une ligne de 2 px.
    <section
      id="confiance"
      className="border-b border-line bg-surface py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          overline={<>Pourquoi nous confier votre chien&nbsp;?</>}
          title={
            <>
              Il est entre de{" "}
              <span className="font-script normal-case text-flame">
                bonnes mains
              </span>
            </>
          }
          sub="Vous confiez votre chien à quelqu’un pendant une heure. Voilà ce que vous êtes en droit de savoir avant de le faire."
        />

        {/* La photo du binôme, juste sous le titre : « il est entre de bonnes
            mains » appelle un visage, et c'est ici que le visiteur découvre à
            QUI il confie son chien — avant les preuves, qui ne sont que du
            texte. Elle porte aussi le « on » employé partout dans la page.

            Placée avant la carte ACACED et non après : la qualification reste
            le premier ARGUMENT de la section, la photo n'en est pas un.

            `max-w-2xl` : au-delà, une photo de deux personnes en pied écrase
            le bandeau de qualification qui la suit et pousse les quatre points
            hors de l'écran. Pas de `preload` — elle est bien en dessous de la
            ligne de flottaison, l'élément LCP reste la photo du hero. */}
        {team && (
          <Reveal className="mb-8 md:mb-10">
            <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-line bg-cream shadow-sm">
              <Image
                src={team}
                alt={teamAlt ?? ""}
                width={1452}
                height={1162}
                sizes="(min-width: 768px) 672px, calc(100vw - 2rem)"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        )}

        {/* La qualification passe avant tout le reste : c’est la seule preuve
            vérifiable de la page, les autres arguments sont des engagements. */}
        <Reveal>
          <div className="flex flex-col gap-5 rounded-3xl border border-flame/25 bg-flame/[0.06] p-6 md:flex-row md:items-start md:gap-7 md:p-8">
            <span
              className="grid size-14 shrink-0 place-items-center rounded-2xl bg-flame text-primary-foreground"
              aria-hidden
            >
              <GraduationCap className="size-7" />
            </span>
            <div className="flex flex-col gap-3">
              <span className="w-fit rounded-full bg-flame px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground">
                {credential.badge}
              </span>
              <h3 className="font-display text-2xl uppercase tracking-tight md:text-3xl">
                {credential.title}
              </h3>
              <p className="max-w-3xl leading-relaxed text-smoke">
                {credential.desc}
              </p>
            </div>
          </div>
        </Reveal>

        {/* La garantie professionnelle reste dans le bandeau de la
            qualification : ce sont les deux seuls faits opposables de la page.
            Volontairement plus discrète que l'ACACED — une assurance rassure,
            elle ne vend pas. */}
        {insurance && (
          <Reveal delay={0.05}>
            <div className="mt-4 flex items-start gap-4 rounded-2xl border border-line bg-cream p-5 md:items-center md:gap-5 md:p-6">
              <span
                className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-cream"
                aria-hidden
              >
                <ShieldCheck className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-lg uppercase tracking-tight md:text-xl">
                  {insurance.title}
                </h3>
                <p className="text-sm leading-relaxed text-smoke">
                  {insurance.desc}
                </p>
              </div>
            </div>
          </Reveal>
        )}

        <Stagger
          stagger={0.1}
          className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
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
                    {point.desc}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal delay={0.1}>
          <p className="mt-12 text-center font-script text-3xl leading-snug text-balance text-flame md:text-4xl">
            {signature}
          </p>
        </Reveal>

        {/* « Première rencontre offerte » ferme la section depuis le
            2026-08-19 (demande client : Martin la veut haut dans la page).
            Elle vivait jusque-là en fin de section « La promenade ». Ici,
            elle n'est plus un argument de prix mais le premier pas concret
            de la réassurance — on se rencontre avant de confier le chien —
            et elle arrive juste avant les tarifs, pas après. Cf. le
            commentaire du composant. */}
        <FirstMeeting />
      </div>
    </section>
  );
}
