import { Star } from "lucide-react";
import { site } from "@/content/site.config";
import type { Review } from "@/content/types";
import { SectionHeader } from "@/components/sections/section-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

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

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6">
      <Stars rating={review.rating} />
      <blockquote className="mt-3 text-sm leading-relaxed text-ink/85">
        « {review.text} »
      </blockquote>
      <figcaption className="mt-auto pt-4 text-xs">
        <span className="font-bold text-ink/70">
          {review.author}
          {review.town && (
            <span className="font-normal text-smoke"> · {review.town}</span>
          )}
        </span>
        {review.dog && (
          <span className="mt-0.5 block font-script text-base text-flame">
            {review.dog}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

export function ReviewsSection() {
  const [pullQuote, ...rest] = site.reviews;
  const grid = rest.slice(0, 3);

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

        <Reveal delay={0.1} className="mx-auto mb-16 max-w-3xl text-center">
          <p className="font-display text-3xl leading-none text-flame" aria-hidden>
            «
          </p>
          <blockquote className="mt-2 text-2xl font-medium leading-snug text-balance md:text-3xl">
            {pullQuote.text}
          </blockquote>
          <div className="mt-6 flex flex-col items-center gap-2">
            <Stars rating={pullQuote.rating} />
            <p className="text-sm font-bold text-ink/70">
              {pullQuote.author}
              {pullQuote.town && (
                <span className="font-normal text-smoke">
                  {" "}
                  · {pullQuote.town}
                </span>
              )}
            </p>
            {pullQuote.dog && (
              <p className="font-script text-lg text-flame">{pullQuote.dog}</p>
            )}
          </div>
        </Reveal>

        <Stagger stagger={0.1} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((review) => (
            <StaggerItem key={review.author} y={20} className="h-full">
              <ReviewCard review={review} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
