"use client";

import { useId, useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { site } from "@/content/site.config";
import { formConversionSendTo, isStaticPreview } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Formulaire de contact — le second canal, à côté de l'appel et du SMS.
 *
 *  La validation ci-dessous DOUBLE celle de app/api/contact/route.ts, elle ne
 *  la remplace pas : ici c'est du confort (dire tout de suite ce qui cloche,
 *  sans aller-retour réseau), là-bas c'est la seule qui fasse autorité — un
 *  POST peut arriver sans être passé par cette page.
 *
 *  Pas de librairie de formulaire : trois champs et une règle, react-hook-form
 *  ou zod pèseraient plus que le reste de la page pour ça. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function contactError(value: string): string | null {
  const v = value.trim();
  if (!v) return "Indiquez un email ou un téléphone, pour que je puisse vous répondre.";
  if (v.includes("@")) {
    return EMAIL.test(v) ? null : "Cette adresse email semble incomplète.";
  }
  const digits = v.replace(/[\s.\-()]/g, "");
  if (/^0\d{9}$/.test(digits) || /^\+33\d{9}$/.test(digits)) return null;
  return "Ce numéro semble incomplet — 10 chiffres, par exemple 06 12 34 56 78.";
}

type Status = "idle" | "sending" | "sent" | "error" | "preview";

const field =
  "w-full rounded-xl border bg-cream/5 px-4 py-3 text-cream placeholder:text-cream/35 outline-none transition-colors focus:border-leaf focus:ring-3 focus:ring-leaf/25";

export function ContactForm() {
  const copy = site.contactForm;
  const ids = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Record<string, string> = {};
    if (!name) next.name = "Votre prénom, pour que je sache à qui je réponds.";
    const contactIssue = contactError(contact);
    if (contactIssue) next.contact = contactIssue;
    if (message.length < 5) next.message = "Dites-m’en un mot sur votre chien.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    /* L'aperçu GitHub Pages n'a pas de serveur : /api/contact n'y existe pas.
       Mieux vaut le dire que partir en 404 sous le nez du client. */
    if (isStaticPreview) {
      setStatus("preview");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          message,
          website: String(data.get("website") ?? ""),
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("sent");
      /* La conversion part APRÈS la confirmation du serveur, jamais au clic :
         un envoi raté n'est pas un prospect. */
      if (formConversionSendTo) {
        window.gtag?.("event", "conversion", { send_to: formConversionSendTo });
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-leaf/40 bg-leaf/10 px-6 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-leaf text-ink">
          <Check className="size-6" />
        </span>
        <p className="font-display text-2xl uppercase tracking-tight text-cream">
          {copy.successTitle}
        </p>
        <p className="text-cream/70">{copy.successDesc}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto w-full max-w-md text-left">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor={`${ids}-name`} className="mb-1.5 block text-sm font-semibold text-cream/80">
            {copy.nameLabel}
          </label>
          <input
            id={`${ids}-name`}
            name="name"
            type="text"
            autoComplete="given-name"
            maxLength={80}
            placeholder={copy.namePlaceholder}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${ids}-name-error` : undefined}
            className={cn(field, errors.name ? "border-flame" : "border-cream/20")}
          />
          {errors.name && (
            <p id={`${ids}-name-error`} className="mt-1.5 text-sm text-flame">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${ids}-contact`} className="mb-1.5 block text-sm font-semibold text-cream/80">
            {copy.contactLabel}
          </label>
          <input
            id={`${ids}-contact`}
            name="contact"
            type="text"
            inputMode="email"
            autoComplete="email"
            maxLength={120}
            placeholder={copy.contactPlaceholder}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? `${ids}-contact-error` : undefined}
            className={cn(field, errors.contact ? "border-flame" : "border-cream/20")}
          />
          {errors.contact && (
            <p id={`${ids}-contact-error`} className="mt-1.5 text-sm text-flame">
              {errors.contact}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${ids}-message`} className="mb-1.5 block text-sm font-semibold text-cream/80">
            {copy.messageLabel}
          </label>
          <textarea
            id={`${ids}-message`}
            name="message"
            rows={4}
            maxLength={2000}
            placeholder={copy.messagePlaceholder}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${ids}-message-error` : undefined}
            className={cn(field, "resize-y", errors.message ? "border-flame" : "border-cream/20")}
          />
          {errors.message && (
            <p id={`${ids}-message-error`} className="mt-1.5 text-sm text-flame">
              {errors.message}
            </p>
          )}
        </div>

        {/* Champ appât. `aria-hidden` + `tabIndex={-1}` le retirent du parcours
            clavier et des lecteurs d'écran ; seul un robot qui remplit tout
            aveuglément le touchera. Caché en CSS et non en `type="hidden"` :
            les robots ignorent les champs cachés natifs. */}
        <div className="absolute left-[-9999px]" aria-hidden>
          <label htmlFor={`${ids}-website`}>Site web</label>
          <input id={`${ids}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={status === "sending"}
          className="h-12 w-full rounded-full bg-leaf px-7 text-lg font-bold text-ink hover:bg-cream"
        >
          {status === "sending" ? (
            <>
              <Loader2 data-icon="inline-start" className="animate-spin" />
              {copy.sending}
            </>
          ) : (
            <>
              <Send data-icon="inline-start" />
              {copy.submit}
            </>
          )}
        </Button>

        {status === "error" && (
          <p role="alert" className="text-center text-sm text-flame">
            {copy.error}{" "}
            <a href={site.phoneHref} className="font-bold underline underline-offset-2">
              {site.phone}
            </a>
          </p>
        )}
        {status === "preview" && (
          <p role="alert" className="text-center text-sm text-cream/70">
            {copy.previewNotice}
          </p>
        )}

        <p className="text-center text-xs leading-relaxed text-cream/50">
          {copy.privacy}
        </p>
      </div>
    </form>
  );
}
