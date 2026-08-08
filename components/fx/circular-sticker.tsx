import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Sticker circulaire à texte rotatif (animation CSS `spin-slow`, cf. globals.css).
 * Le texte doit être assez long pour remplir le cercle — répéter la phrase si besoin.
 */
export function CircularSticker({
  text,
  center = "✦",
  className,
}: {
  text: string;
  center?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative grid size-28 place-items-center rounded-full bg-flame text-cream shadow-lg md:size-36",
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full animate-spin-slow motion-reduce:animate-none"
      >
        <defs>
          <path
            id="sticker-circle"
            d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
          />
        </defs>
        <text className="fill-current font-sans text-[10px] font-bold uppercase tracking-[0.2em]">
          <textPath href="#sticker-circle">{text}</textPath>
        </text>
      </svg>
      <span className="font-display text-2xl md:text-3xl">{center}</span>
    </div>
  );
}
