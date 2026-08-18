import { Star } from "lucide-react";
import { site } from "@/content/site.config";
import type { Review } from "@/content/types";
import { SectionHeader } from "@/components/sections/section-header";
import { GoogleIcon } from "@/components/ui/google-icon";
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
 *
 *  MISE EN FORME CALQUÉE SUR GOOGLE MAPS (demande client du 2026-08-18) :
 *  photo de profil et nom en tête, étoiles et date en dessous, puis le texte
 *  sans guillemets — l'ordre de lecture de Maps, pas celui d'un témoignage de
 *  site vitrine. Le récapitulatif reprend la note géante et l'histogramme des
 *  notes. Ce n'est pas de la coquetterie : un visiteur qui reconnaît la mise en
 *  forme de Google sait d'où viennent les avis avant même de lire l'attribution.
 */

/* L'ambre de Google (#fbbc04), et surtout PAS `flame`, qui est le vert de la
   charte : des étoiles vertes ne se lisent pas comme une note. C'est la seule
   couleur de marque en dur du site avec le « G » — elle est là pour être
   reconnue, elle n'a donc pas à suivre la palette. */
const STAR_ON = "fill-[#fbbc04] text-[#fbbc04]";

function Stars({
  rating,
  className,
  label,
}: {
  rating: number;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn("flex gap-0.5", className)}
      role="img"
      aria-label={label ?? `${rating} étoiles sur 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("size-4", i < rating ? STAR_ON : "text-line")}
          aria-hidden
        />
      ))}
    </div>
  );
}

/** Photo de profil de l'auteur, en lien direct vers Google.
 *
 *  Les initiales ne sont pas un repli dessiné après coup : elles sont TOUJOURS
 *  rendues, et l'image vient se poser par-dessus. Si l'URL meurt — ce qui
 *  arrive dès que la personne change de photo — l'`alt=""` ne laisse aucune
 *  icône de fichier cassé, et les initiales réapparaissent seules. Aucun
 *  JavaScript, donc le composant reste rendu côté serveur.
 *
 *  `<img>` nu et jamais `next/image` : l'optimiseur mettrait la photo en cache
 *  sur notre serveur, ce qui reviendrait à réhéberger le visage d'une cliente.
 *  En lien direct, elle disparaît d'ici le jour où elle la retire de son compte.
 *  `no-referrer` pour ne pas annoncer à Google quelle page la regarde. */
function Avatar({ author, avatarUrl }: Pick<Review, "author" | "avatarUrl">) {
  const initials = author
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-ink/10 text-[0.7rem] font-bold text-ink/50">
      <span aria-hidden>{initials}</span>
      {avatarUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </span>
  );
}

/** Carte d'avis, dans l'ordre de lecture de Google Maps.
 *
 *  Le lien vers la source et la date de visite ne sont pas décoratifs : c'est
 *  ce qui rend l'avis vérifiable, et exactement ce que promet la section
 *  « Avis des clients » des mentions légales. Les retirer transformerait un
 *  avis vérifiable en simple citation — le reproche fait aux faux avis. */
function ReviewCard({ review }: { review: Review }) {
  const { author, town, dog, rating, text, localGuide, source } = review;
  const meta = [localGuide && "Local Guide", town].filter(Boolean).join(" · ");

  return (
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6">
      <div className="flex items-start gap-3">
        <Avatar author={author} avatarUrl={review.avatarUrl} />
        <figcaption className="min-w-0 flex-1">
          <span className="block truncate font-bold text-ink/80">{author}</span>
          {meta && <span className="block text-xs text-smoke">{meta}</span>}
          {dog && (
            <span className="block font-script text-base text-flame">{dog}</span>
          )}
        </figcaption>
        {/* Là où Maps met son menu « ⋮ ». Le glyphe dit d'où vient l'avis
            sans ajouter une ligne de texte à chaque carte. */}
        <GoogleIcon className="mt-0.5 size-4 shrink-0" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
        <Stars rating={rating} />
        {source?.visitDate && (
          <span className="text-xs text-smoke">Visité en {source.visitDate}</span>
        )}
      </div>

      <blockquote className="mt-3 text-sm leading-relaxed whitespace-pre-line text-ink/85">
        {text}
      </blockquote>

      {source?.reviewUrl && (
        <p className="mt-auto pt-4">
          <a
            href={source.reviewUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-xs text-smoke underline-offset-2 hover:underline"
          >
            Voir sur Google
          </a>
        </p>
      )}
    </figure>
  );
}

/** Le récapitulatif de Maps : note géante, étoiles, total, et l'histogramme
 *  des notes. Tout est calculé depuis le tableau — un histogramme écrit en dur
 *  serait un faux au sens propre. */
function Summary({ reviews }: { reviews: Review[] }) {
  const average =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  /* De 5 à 1, l'ordre de Maps — et pas l'ordre naturel d'un tableau. */
  const distribution = [5, 4, 3, 2, 1].map((value) => ({
    value,
    count: reviews.filter((r) => r.rating === value).length,
  }));

  return (
    <Reveal
      delay={0.05}
      className="mx-auto mb-12 max-w-xl rounded-2xl border border-line bg-surface p-6"
    >
      <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide text-smoke">
        <GoogleIcon className="size-4" />
        Avis Google
      </p>

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-5xl leading-none text-ink">
            {average.toLocaleString("fr-FR", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </span>
          <Stars
            rating={Math.round(average)}
            label={`Note moyenne de ${average.toLocaleString("fr-FR", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })} sur 5`}
          />
          <span className="text-xs whitespace-nowrap text-smoke">
            {reviews.length} avis
          </span>
        </div>

        <ul className="flex w-full flex-1 flex-col gap-1.5">
          {distribution.map(({ value, count }) => (
            <li
              key={value}
              className="flex items-center gap-2"
              aria-label={`${value} étoiles : ${count} avis`}
            >
              <span aria-hidden className="w-2 text-xs text-smoke">
                {value}
              </span>
              <span
                aria-hidden
                className="h-2 flex-1 overflow-hidden rounded-full bg-line"
              >
                <span
                  className={cn(
                    "block h-full rounded-full",
                    count > 0 && "bg-[#fbbc04]",
                  )}
                  style={{ width: `${(count / reviews.length) * 100}%` }}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export function ReviewsSection() {
  const reviews = site.reviews;
  if (reviews.length === 0) return null;

  return (
    <section id="avis" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          align="center"
          overline="Ils nous font confiance"
          title={
            <>
              Les maîtres{" "}
              <span className="font-script normal-case text-flame">
                en parlent
              </span>
            </>
          }
        />

        <Summary reviews={reviews} />

        {/* La largeur ET le nombre de colonnes suivent le nombre de cartes :
            deux avis sur une grille de trois colonnes se tasseraient à gauche
            avec un vide à droite, et quatre y laisseraient une carte seule sur
            la dernière ligne — d'où les deux colonnes à 4, qui donnent un carré
            plein. Les classes sont écrites en entier : Tailwind ne voit pas les
            noms assemblés à l'exécution et ne générerait pas le CSS. */}
        <Stagger
          stagger={0.1}
          className={cn(
            "mx-auto grid gap-5",
            reviews.length === 1 && "max-w-md",
            reviews.length === 2 && "max-w-3xl sm:grid-cols-2",
            reviews.length === 3 && "max-w-5xl sm:grid-cols-2 lg:grid-cols-3",
            reviews.length === 4 && "max-w-4xl sm:grid-cols-2",
            reviews.length >= 5 && "max-w-5xl sm:grid-cols-2 lg:grid-cols-3",
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
