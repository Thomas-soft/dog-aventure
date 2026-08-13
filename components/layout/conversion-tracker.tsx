"use client";

import { useEffect } from "react";

/** Remonte une conversion Google Ads au clic sur le téléphone ou le SMS.
 *
 *  Pourquoi au clic et pas au chargement de page : ce site est une page unique,
 *  sans formulaire ni page de confirmation. Une conversion « chargement de
 *  page » compterait chaque visite, donnerait 100 % de taux de conversion et
 *  ferait optimiser la campagne sur du bruit. Le clic sur `tel:` ou `sms:` est
 *  la seule intention mesurable ici.
 *
 *  Un seul écouteur délégué sur le document, plutôt qu'un `onClick` sur chaque
 *  bouton : les liens d'appel sont dispersés dans six composants (hero, barre
 *  de navigation, barre d'appel fixe, contact, pied de page, mentions légales)
 *  et il s'en ajoutera. Ici, aucun ne peut être oublié.
 *
 *  L'événement part quel que soit le consentement : c'est le mode Consentement
 *  de Google qui décide ensuite s'il est rattaché à un identifiant ou compté en
 *  conversion modélisée. Le filtrer nous-mêmes reviendrait à perdre les deux. */
export function ConversionTracker({ sendTo }: { sendTo: string }) {
  useEffect(() => {
    /* Un même lien cliqué deux fois de suite (double-clic, impatience) ne doit
       pas compter double. Google dédoublonne aussi côté compte, selon le
       réglage « Comptabilisation » de l'action — cette garde ne fait que lui
       éviter du bruit. */
    const recent = new Map<string, number>();

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>(
        'a[href^="tel:"], a[href^="sms:"]',
      );
      if (!link) return;

      const now = Date.now();
      const last = recent.get(link.href);
      if (last && now - last < 2000) return;
      recent.set(link.href, now);

      window.gtag?.("event", "conversion", { send_to: sendTo });
    }

    /* En phase de capture : un `preventDefault()` en aval ne nous ferait pas
       manquer le clic, et la navigation vers tel:/sms: n'annule pas l'envoi
       (gtag passe par sendBeacon ou une image). */
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, [sendTo]);

  return null;
}
