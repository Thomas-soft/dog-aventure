import { Star } from "lucide-react";
import { site } from "@/content/site.config";
import type { Review } from "@/content/types";
import { SectionHeader } from "@/components/sections/section-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Section « Les maîtres en parlent ».
 *
 *  ⚠️ LES AVIS SONT DE VRAIS AVIS GOOGLE, recopiés dans `site.reviews`.
 *  Jusqu'au 2026-08-16 la section affichait quatre avis inventés — noms,
 *  villes, chiens compris. Diffuser de faux avis de consommateurs est une
 *  pratique commerciale trompeuse, et le site est commercial et poussé par de
 *  la publicité payante. **Ne rien ajouter ici qui n'existe pas sur la fiche.**
 *
 *  Tableau vide = pas de section du tout. Pas de texte de remplissage, pas de
 *  « bientôt vos avis » : mieux vaut rien qu'un vide habillé.
 *
 *  C'est un INSTANTANÉ, pas un flux : la version branchée en direct sur la
 *  Places API existe et fonctionne (commit 795fe06), elle a été retirée faute
 *  de compte de facturation Google Cloud actif. Si elle revient, c'est ce
 *  composant qui redevient client — le rendu des cartes, lui, ne change pas.
 */

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div
      className={cn("flex gap-0.5", className)}
      role="img"
      aria-label={`${rating} étoiles sur 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating ? "fill-flame text-flame" : "text-line",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

/** Auteur, date de visite, lien vers la source.
 *
 *  Rien ici n'est décoratif : c'est ce qui rend l'avis vérifiable, et c'est
 *  exactement ce que promet la section « Avis des clients » des mentions
 *  légales. Retirer le lien vers Google transformerait un avis vérifiable en
 *  simple citation, ce qui est le reproche fait aux faux avis. */
function Attribution({ review }: { review: Review }) {
  const { author, town, dog, source } = review;

  /* Pas de photo de profil : Google ne la fournit qu'à travers son API, et
     recopier l'image d'une cliente dans le dépôt pour la réhéberger nous-mêmes
     n'est pas la même chose que de citer son texte. Les initiales tiennent la
     place sans rien prétendre. */
  const initials = author
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <figcaption className="mt-auto flex items-center gap-3 pt-4 text-xs">
      <span
        className="grid size-9 shrink-0 place-items-center rounded-full bg-ink/10 text-[0.7rem] font-bold text-ink/50"
        aria-hidden
      >
        {initials}
      </span>
      <span className="flex flex-col">
        <span className="font-bold text-ink/70">
          {author}
          {town && <span className="font-normal text-smoke"> · {town}</span>}
        </span>
        {dog && <span className="font-script text-base text-flame">{dog}</span>}
        <span className="text-smoke">
          {source?.visitDate && <>Visité en {source.visitDate}</>}
          {source?.visitDate && source?.reviewUrl && " · "}
          {source?.reviewUrl && (
            <a
              href={source.reviewUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline-offset-2 hover:underline"
            >
              Voir sur Google
            </a>
          )}
        </span>
      </span>
    </figcaption>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6">
      <Stars rating={review.rating} />
      <blockquote className="mt-3 text-sm leading-relaxed whitespace-pre-line text-ink/85">
        « {review.text} »
      </blockquote>
      <Attribution review={review} />
    </figure>
  );
}

export function ReviewsSection() {
  const reviews = site.reviews;
  if (reviews.length === 0) return null;

  /* Moyenne calculée, jamais écrite en dur : avec deux avis à 5 étoiles elle
     vaut 5,0, mais elle doit suivre le tableau au premier avis à 4. */
  const average =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section id="avis" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          align="center"
          overline="Ils me font confiance"
          title={
            <>
              Les maîtres{" "}
              <span className="font-script normal-case text-flame">
                en parlent
              </span>
            </>
          }
        />

        <Reveal delay={0.05} className="mb-12 flex flex-col items-center gap-2">
          <Stars rating={Math.round(average)} className="scale-125" />
          <p className="text-sm text-smoke">
            <strong className="font-bold text-ink/80">
              {average.toLocaleString("fr-FR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
              {" sur 5"}
            </strong>
            {" · "}
            {reviews.length} avis Google
          </p>
        </Reveal>

        {/* La largeur suit le nombre de cartes : deux avis sur une grille de
            trois colonnes se tasseraient à gauche avec un vide à droite. Les
            classes sont écrites en entier — Tailwind ne voit pas les noms
            assemblés à l'exécution et ne générerait pas le CSS. */}
        <Stagger
          stagger={0.1}
          className={cn(
            "mx-auto grid gap-5",
            reviews.length === 1 && "max-w-md",
            reviews.length === 2 && "max-w-3xl sm:grid-cols-2",
            reviews.length >= 3 && "max-w-5xl sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {reviews.map((review, i) => (
            <StaggerItem key={`${review.author}-${i}`} y={20} className="h-full">
              <ReviewCard review={review} />
            </StaggerItem>
          ))}
        </Stagger>

        {site.googleProfileUrl && (
          <Reveal delay={0.1} className="mt-10 text-center">
            <a
              href={site.googleProfileUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-sm font-semibold text-flame underline-offset-4 hover:underline"
            >
              Voir les avis sur Google
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
