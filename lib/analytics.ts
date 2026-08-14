import { site } from "@/content/site.config";

/** Identifiant Google Ads **effectif**, à utiliser partout plutôt que
 *  `site.googleAdsId` directement.
 *
 *  La différence n'est pas cosmétique : la préview GitHub Pages partage le même
 *  `site.config.ts` que la production mais ne doit charger aucune balise — ses
 *  visites sont les nôtres, pas des prospects. Tester `site.googleAdsId` au
 *  lieu de ceci fait apparaître, sur la préview, un lien « Cookies » qui
 *  n'ouvre rien et une section « Cookies » des mentions légales qui décrit des
 *  traceurs absents. C'est arrivé le 2026-08-13, d'où ce fichier. */
export const adsId =
  process.env.GITHUB_PAGES === "true" ? undefined : site.googleAdsId;

/** `send_to` de l'action de conversion, ou `null` si elle n'est pas
 *  configurée. Les deux moitiés vivent séparément dans `site.config.ts` pour
 *  que l'identifiant du compte ne soit pas écrit deux fois. */
export const conversionSendTo =
  adsId && site.googleAdsConversionLabel
    ? `${adsId}/${site.googleAdsConversionLabel}`
    : null;

/** `send_to` de la conversion du formulaire. Volontairement distinct de
 *  `conversionSendTo` : un appel et un formulaire sont deux événements, ils
 *  méritent deux actions Ads. Ce n'est pas le double comptage qu'on fuit —
 *  celui-là, c'est deux libellés sur un même clic. */
export const formConversionSendTo =
  adsId && site.googleAdsFormConversionLabel
    ? `${adsId}/${site.googleAdsFormConversionLabel}`
    : null;

/** `send_to` de la conversion du clic WhatsApp, encore une action à part.
 *  `null` tant que le libellé est vide côté config — le tracker n'émet alors
 *  rien pour WhatsApp, et surtout ne se rabat PAS sur `conversionSendTo` :
 *  compter un clic WhatsApp comme un appel fausserait la seule métrique sur
 *  laquelle la campagne optimise aujourd'hui. */
export const whatsappConversionSendTo =
  adsId && site.googleAdsWhatsappConversionLabel
    ? `${adsId}/${site.googleAdsWhatsappConversionLabel}`
    : null;

/** L'aperçu GitHub Pages est un export statique : il n'a pas de serveur, donc
 *  pas de `/api/contact`. Le formulaire doit le savoir et le dire, plutôt que
 *  de partir en 404 sous le nez du client venu valider la maquette. */
export const isStaticPreview = process.env.GITHUB_PAGES === "true";
