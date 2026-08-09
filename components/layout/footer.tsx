import Link from "next/link";
import { site } from "@/content/site.config";
import { Separator } from "@/components/ui/separator";
import { asset } from "@/lib/utils";

/* Ancres absolues via asset() — même raison que dans la barre de navigation :
   le pied de page est aussi rendu sur /mentions-legales, et un next/link vers
   « /#service » change l'URL sans défiler. */
const NAV = [
  { label: "La promenade", href: asset("/#service") },
  { label: "Les chiens", href: asset("/#chiens") },
  { label: "Où j'interviens", href: asset("/#zones") },
  { label: "Avis", href: asset("/#avis") },
  { label: "Contact", href: asset("/#contact") },
];

export function Footer() {
  const socials = [
    { label: "Instagram", href: site.social.instagram },
    { label: "Facebook", href: site.social.facebook },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          {/* Logo complet ici, marque seule dans la barre de navigation : le
              texte en arc n'est lisible qu'à cette taille. <img> plutôt que
              next/image — l'optimiseur refuse le SVG, et le loader de la
              préview ne sait réécrire que les bitmaps (lib/image-loader.ts). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(site.images.logo)}
            alt={site.images.logoAlt}
            width={111}
            height={96}
            loading="lazy"
            className="h-24 w-auto"
          />
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-smoke">
            {site.activity}
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-smoke">
            {site.description}
          </p>
          <p className="text-sm text-smoke">
            Basé à {site.base.city} ({site.base.zip}) — {site.base.region}
            <br />
            <a href={site.phoneHref} className="transition-colors hover:text-ink">
              {site.phone}
            </a>
          </p>
          <p className="font-script text-xl text-flame">{site.tagline}</p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-smoke">
            Navigation
          </p>
          <ul className="space-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-smoke transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          {socials.length > 0 && (
            <div className="flex gap-4 pt-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-smoke underline-offset-4 transition-colors hover:text-flame hover:underline"
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-smoke">
            J&rsquo;interviens à
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {site.towns.map((town) => (
              <li key={town} className="text-sm text-smoke">
                {town}
              </li>
            ))}
            <li className="text-sm italic text-smoke">{site.townsSuffix}</li>
          </ul>
        </div>
      </div>

      <Separator className="bg-line" />
      {/* pb-24 mobile : laisse la place à la barre d'appel fixe */}
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 pb-24 pt-6 text-xs text-smoke sm:flex-row sm:gap-6 sm:px-6 md:pb-6">
        <p>
          © {new Date().getFullYear()} {site.name} — SIRET {site.siret}
        </p>
        <Link
          href="/mentions-legales"
          className="underline underline-offset-4 transition-colors hover:text-ink"
        >
          Mentions légales
        </Link>
        <p>
          Site réalisé par{" "}
          {site.credits.url ? (
            <a
              href={site.credits.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink/70 underline underline-offset-4 hover:text-ink"
            >
              {site.credits.label}
            </a>
          ) : (
            <span className="text-ink/70">{site.credits.label}</span>
          )}
        </p>
      </div>
    </footer>
  );
}
