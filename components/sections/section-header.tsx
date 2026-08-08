import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function SectionHeader({
  overline,
  title,
  sub,
  align = "left",
  className,
}: {
  overline: string;
  title: ReactNode;
  sub?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mb-12 flex max-w-2xl flex-col gap-4 md:mb-16",
        align === "center" ? "mx-auto items-center text-center" : "items-start",
        className,
      )}
    >
      <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-flame">
        <span className="h-px w-8 bg-flame" aria-hidden />
        {overline}
      </span>
      <h2 className="font-display text-4xl uppercase tracking-tight text-balance sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {sub && <p className="leading-relaxed text-smoke md:text-lg">{sub}</p>}
    </Reveal>
  );
}
