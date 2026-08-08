import { TreePine } from "lucide-react";
import { site } from "@/content/site.config";
import { Separator } from "@/components/ui/separator";

const NAV = [
  { label: "La promenade", href: "#service" },
  { label: "Les chiens", href: "#chiens" },
  { label: "Où j'interviens", href: "#zones" },
  { label: "Avis", href: "#avis" },
  { label: "Contact", href: "#contact" },
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
          <p className="flex items-center gap-2.5">
            <TreePine className="size-6 text-flame" aria-hidden />
            <span className="flex flex-col">
              <span className="font-display text-xl uppercase leading-none tracking-wide">
                {site.name}
              </span>
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-smoke">
                {site.activity}
              </span>
            </span>
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
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 pb-24 pt-6 text-xs text-smoke sm:flex-row sm:px-6 md:pb-6">
        <p>
          © {new Date().getFullYear()} {site.name} — Tous droits réservés.
        </p>
        <p>
          Site réalisé par{" "}
          <a href="#" className="text-ink/70 underline underline-offset-4 hover:text-ink">
            Votre Agence
          </a>
        </p>
      </div>
    </footer>
  );
}
