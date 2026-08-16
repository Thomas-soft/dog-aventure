"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import type { Review } from "@/content/types";
import { isStaticPreview } from "@/lib/analytics";
import { SectionHeader } from "@/components/sections/section-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Section « Les maîtres en parlent » — avis Google en direct.
 *
 *  ⚠️ IL N'Y A PLUS AUCUN AVIS DANS LE DÉPÔT, et il ne faut pas en remettre.
 *  Les quatre qui vivaient dans `site.config.ts` étaient inventés (noms, villes,
 *  chiens) ; diffuser de faux avis de consommateurs est une pratique
 *  commerciale trompeuse, sur un site commercial poussé par de la publicité
 *  payante. Ils ont été supprimés le 2026-08-16 en branchant la vraie source.
 *  Un « avis de repli » réintroduirait le problème en pire : silencieux, il
 *  s'afficherait précisément les jours où l'API tombe.
 *
 *  Donc : pas d'avis à montrer = pas de section. Le composant ne rend rien.
 *
 *  POURQUOI CÔTÉ CLIENT ET AU DÉFILEMENT, alors que tout le reste de la page
 *  est prérendu :
 *  - Les conditions Google interdisent de mettre le contenu des avis en cache.
 *    Les afficher côté serveur rendrait donc la page entière dynamique, et
 *    l'accueil est aujourd'hui statique — le LCP mobile est déjà le point
 *    faible (92), on ne lui ajoute pas un aller-retour vers Google.
 *  - La facturation suit les appels : 1 000 gratuits par mois, puis 25 $ les
 *    1 000. Ne déclencher l'appel qu'à l'entrée de la section dans le champ de
 *    vision, plutôt qu'à chaque ouverture de page, divise la note par le taux
 *    de visiteurs qui descendent jusqu'ici.
 *  Ne pas « optimiser » en remontant l'appel au chargement de la page.
 */

type Payload = {
  ok: boolean;
  reviews?: Review[];
  rating?: number;
  count?: number;
  placeUrl?: string;
};

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

/** Bloc d'attribution — auteur, lien vers son profil, date de visite, lien vers
 *  l'avis d'origine. **Rien ici n'est décoratif** : les règles de la Places API
 *  imposent de créditer l'auteur et de laisser l'accès à l'avis sur Maps, et la
 *  date de visite est spécifiquement exigée pour les établissements français.
 *  Retirer un de ces éléments met le site en infraction, pas seulement en
 *  moins joli.
 *
 *  La photo arrive en `data:` URI, inlinée par le serveur — voir `ReviewSource`
 *  (content/types.ts) pour les deux montages écartés et pourquoi. */
function Attribution({ review }: { review: Review }) {
  const { author, source } = review;

  /* Repli quand la photo n'a pas pu être récupérée : les initiales, plutôt
     qu'un trou dans la mise en page ou une image cassée. */
  const initials = author
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <figcaption className="mt-auto flex items-center gap-3 pt-4 text-xs">
      {source?.avatarUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element --
           `data:` URI déjà en mémoire : next/image n'a rien à optimiser, et
           l'optimiseur refuse de toute façon les sources en data:. */
        <img
          src={source.avatarUrl}
          alt=""
          width={36}
          height={36}
          decoding="async"
          className="size-9 shrink-0 rounded-full bg-line object-cover"
        />
      ) : (
        <span
          className="grid size-9 shrink-0 place-items-center rounded-full bg-ink/10 text-[0.7rem] font-bold text-ink/50"
          aria-hidden
        >
          {initials}
        </span>
      )}
      <span className="flex flex-col">
        {source?.authorUrl ? (
          <a
            href={source.authorUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="font-bold text-ink/70 underline-offset-2 hover:underline"
          >
            {author}
          </a>
        ) : (
          <span className="font-bold text-ink/70">{author}</span>
        )}
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
  /* ⚠️ L'observateur vise cette sentinelle, PAS la section.
     Tant qu'il n'y a pas d'avis, la section n'est pas rendue du tout — et un
     élément absent (comme un élément en `display:none`) a une aire
     d'intersection nulle : l'observateur ne se déclencherait jamais et l'appel
     ne partirait pas. La sentinelle, elle, occupe toujours un pixel dans le
     flux, à l'endroit exact où la section apparaîtra. */
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Payload | null>(null);

  useEffect(() => {
    /* L'aperçu GitHub Pages est un export statique : `/api/reviews` n'y existe
       pas. Appeler quand même donnerait un 404 dans la console sous le nez du
       client venu valider la maquette. */
    if (isStaticPreview) return;

    const el = sentinelRef.current;
    if (!el) return;

    let cancelled = false;
    const load = () => {
      /* POST pour une lecture : voir l'en-tête de `app/api/reviews/route.ts`.
         Un GET à données vives fait échouer le build de l'aperçu statique. */
      fetch("/api/reviews", { method: "POST" })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((payload: Payload) => {
          if (!cancelled) setData(payload);
        })
        /* En cas d'échec on ne fait rien : `data` reste `null`, la section ne
           s'affiche pas. Le détail est déjà journalisé côté serveur. */
        .catch(() => {});
    };

    /* Marge large : l'appel part avant que la section soit à l'écran, pour que
       les avis soient là quand le visiteur y arrive. */
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  const reviews = data?.reviews ?? [];

  /* Rien à montrer = pas de section du tout : ni titre, ni cadre vide. C'est le
     cas tant que l'appel n'a pas répondu, s'il échoue, et si la fiche n'a aucun
     avis. Aucun repli écrit à la main — voir l'en-tête du fichier. */
  if (reviews.length === 0) {
    return <div ref={sentinelRef} aria-hidden className="h-px" />;
  }

  return (
    <section id="avis" className="py-24 md:py-32">
      <div ref={sentinelRef} aria-hidden className="h-px" />
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

        {/* Note moyenne de la fiche. Elle porte sur TOUS les avis, pas
            seulement sur les 5 que l'API accepte de renvoyer — d'où le total
            affiché à côté, sans quoi la moyenne semblerait ne porter que sur
            les cartes visibles. */}
        {typeof data?.rating === "number" && (
          <Reveal delay={0.05} className="mb-12 flex flex-col items-center gap-2">
            <Stars rating={Math.round(data.rating)} className="scale-125" />
            <p className="text-sm text-smoke">
              <strong className="font-bold text-ink/80">
                {data.rating.toLocaleString("fr-FR", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
                {" sur 5"}
              </strong>
              {typeof data.count === "number" && (
                <>
                  {" · "}
                  {data.count} avis Google
                </>
              )}
            </p>
          </Reveal>
        )}

        {/* Une seule grille, de 1 à 5 cartes. L'ancienne mise en page exigeait
            exactement 4 avis (une citation en exergue + 3 cartes) : avec le
            direct, le nombre varie et une grille qui s'adapte est la seule
            forme qui ne casse jamais.

            La largeur suit le nombre de cartes, sinon deux avis sur une grille
            de trois colonnes se tassent à gauche avec un vide à droite — c'est
            ce qu'on voyait à 2 avis. Les classes sont écrites en entier et pas
            construites à la volée : Tailwind ne voit pas les noms assemblés à
            l'exécution et ne générerait pas le CSS. */}
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

        {/* Google n'en renvoie jamais plus de 5 : dès qu'il y en a davantage
            sur la fiche, il faut un chemin vers le reste. */}
        {data?.placeUrl && (data.count ?? 0) > reviews.length && (
          <Reveal delay={0.1} className="mt-10 text-center">
            <a
              href={data.placeUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-sm font-semibold text-flame underline-offset-4 hover:underline"
            >
              Lire les {data.count} avis sur Google
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
