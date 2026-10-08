import Image from "next/image";
import { PawPrint } from "lucide-react";
import type { OfferBlock as OfferBlockContent } from "@/content/types";
import { Reveal } from "@/components/motion/reveal";
import { RichText } from "@/components/ui/rich-text";
import { cn } from "@/lib/utils";

/**
 * Un chapitre du texte du client : titre, paragraphes, puces éventuelles, et
 * la phrase qui conclut, en manuscrit.
 *
 * Avec photo, texte et image alternent de côté d'un bloc à l'autre
 * (`reverse`) — c'est ce qui donne du rythme à une page longue, et c'est ce
 * que le client demandait (« alterner les images »). Sans photo, le bloc se
 * resserre en une colonne centrée : un texte seul sur toute la largeur se
 * lirait mal.
 */
export function OfferBlock({
  block,
  reverse = false,
}: {
  block: OfferBlockContent;
  reverse?: boolean;
}) {
  const text = (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-3xl uppercase leading-tight tracking-tight text-balance md:text-4xl">
        <RichText text={block.title} />
      </h2>
      {block.paragraphs.map((p) => (
        <p key={p} className="leading-relaxed text-smoke md:text-lg">
          <RichText text={p} />
        </p>
      ))}
      {block.bullets && (
        <ul className="flex flex-col gap-3 py-1">
          {block.bullets.map((b) => (
            <li key={b.title} className="flex gap-3">
              <PawPrint
                className="mt-1 size-4 shrink-0 text-flame"
                aria-hidden
              />
              <span className="leading-relaxed text-smoke">
                <strong className="font-bold text-ink">
                  <RichText text={b.title} />
                </strong>{" "}
                <RichText text={b.desc} />
              </span>
            </li>
          ))}
        </ul>
      )}
      {block.after?.map((p) => (
        <p key={p} className="leading-relaxed text-smoke md:text-lg">
          <RichText text={p} />
        </p>
      ))}
      {block.highlight && (
        <p className="pt-2 font-script text-2xl leading-snug text-flame md:text-3xl">
          <RichText text={block.highlight} />
        </p>
      )}
    </div>
  );

  if (!block.photo) {
    return (
      <Reveal className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-line bg-surface p-7 md:p-10">
          {text}
        </div>
      </Reveal>
    );
  }

  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
      <Reveal className={cn(reverse && "md:order-2")}>{text}</Reveal>
      <Reveal delay={0.1} className={cn(reverse && "md:order-1")}>
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-line bg-surface shadow-sm">
          <Image
            src={block.photo.src}
            alt={block.photo.alt}
            width={block.photo.width}
            height={block.photo.height}
            sizes="(min-width: 768px) 448px, calc(100vw - 2rem)"
            className="h-auto w-full"
          />
        </div>
      </Reveal>
    </div>
  );
}
