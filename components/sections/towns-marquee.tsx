import { PawPrint } from "lucide-react";
import { Marquee } from "@/components/fx/marquee";
import { site } from "@/content/site.config";

/** Bandeau défilant des villes desservies — l'ancrage local, juste sous le hero */
export function TownsMarquee() {
  const items = [...site.towns, site.townsSuffix];

  return (
    <div className="border-y border-line bg-surface py-4 md:py-5">
      <Marquee className="[--duration:36s] [--gap:2.5rem]">
        {items.map((town) => (
          <span
            key={town}
            className="flex items-center gap-10 font-display text-2xl uppercase tracking-wide text-ink/80 md:text-3xl"
          >
            {town}
            <PawPrint className="size-4 text-flame md:size-6" aria-hidden />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
