"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site.config";
import {
  bannerServerSnapshot,
  bannerSnapshot,
  CONSENT_EVENT,
  decideConsent,
  subscribeBanner,
} from "@/lib/consent";

/** Bandeau de consentement. Rendu par app/layout.tsx, donc présent sur les deux
 *  pages — le visiteur peut très bien arriver directement sur les mentions
 *  légales depuis Google.
 *
 *  Deux exigences CNIL portées par la mise en page, à ne pas « simplifier » :
 *  refuser doit être aussi simple qu'accepter (deux boutons côte à côte, même
 *  taille, un seul clic chacun — pas de « Refuser » en lien gris), et le choix
 *  doit rester révocable (lien « Cookies » du pied de page, qui rouvre ceci). */
export function ConsentBanner() {
  const open = useSyncExternalStore(
    subscribeBanner,
    bannerSnapshot,
    bannerServerSnapshot,
  );

  if (!open) return null;

  const { consent } = site;

  return (
    /* z-60 : au-dessus de la barre d'appel fixe (z-50), qui apparaît après
       520 px de défilement. Le choix passe avant la navigation. */
    <div
      role="dialog"
      aria-label={consent.title}
      className="fixed inset-x-0 bottom-0 z-60 border-t border-line bg-surface/98 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-md sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="space-y-1">
          <p className="font-display text-base uppercase tracking-tight">
            {consent.title}
          </p>
          <p className="max-w-3xl text-sm leading-relaxed text-smoke">
            {consent.desc}{" "}
            <Link
              href="/mentions-legales"
              className="underline underline-offset-4 transition-colors hover:text-ink"
            >
              {consent.more}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button
            variant="outline"
            onClick={() => decideConsent("denied")}
            className="h-10 flex-1 rounded-full border-ink bg-transparent px-5 text-sm font-semibold hover:bg-ink hover:text-cream md:flex-none"
          >
            {consent.refuse}
          </Button>
          <Button
            onClick={() => decideConsent("granted")}
            className="h-10 flex-1 rounded-full px-5 text-sm font-semibold md:flex-none"
          >
            {consent.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Lien du pied de page qui rouvre le bandeau. Isolé dans son propre composant
 *  client pour que le pied de page reste rendu côté serveur. */
export function ConsentLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))}
      className="underline underline-offset-4 transition-colors hover:text-ink"
    >
      {site.consent.reopen}
    </button>
  );
}
