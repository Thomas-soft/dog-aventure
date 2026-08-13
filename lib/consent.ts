/** Consentement aux cookies publicitaires (CNIL / RGPD).
 *
 *  Le site n'a qu'un seul traceur : la balise Google Ads (`site.googleAdsId`).
 *  Tout ce fichier est donc inutile si ce champ est vide — c'est voulu, vider
 *  l'identifiant retire la balise, le bandeau et les cookies d'un seul geste.
 *
 *  Choix de mise en œuvre : le « mode Consentement » de Google (Consent Mode
 *  v2), réglé sur `denied` par défaut. gtag.js se charge quand même, mais sans
 *  écrire le moindre cookie ni le moindre identifiant tant que le visiteur n'a
 *  pas accepté. C'est ce qui permet à la fois de ne rien déposer sans accord et
 *  de laisser Google Ads constater que la balise est bien posée — la campagne
 *  reste sinon « Éligible (mauvaise configuration) ».
 */

/** Clé de stockage du choix. `localStorage` et pas un cookie : un cookie de
 *  consentement se justifie, mais autant ne rien déposer du tout. */
export const CONSENT_KEY = "da-consent";

/** Événement qui rouvre le bandeau, émis par le lien « Cookies » du pied de
 *  page. Un événement plutôt qu'un contexte React : le pied de page reste un
 *  composant serveur, seul le lien bascule côté client. */
export const CONSENT_EVENT = "da-consent-open";

export type ConsentChoice = "granted" | "denied";

/** Les quatre signaux exigés par le mode Consentement v2. */
const SIGNALS = [
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
  "analytics_storage",
] as const;

/**
 * Script à exécuter **avant** gtag.js, en ligne dans le HTML.
 *
 * L'ordre n'est pas négociable : gtag.js lit `dataLayer` au chargement, et un
 * `consent default` poussé après lui arriverait trop tard — le cookie serait
 * déjà écrit. D'où un `<script>` en clair, premier enfant du `<body>`, exécuté
 * pendant l'analyse du HTML, quand la balise elle-même est en `afterInteractive`.
 *
 * Il relit le choix déjà enregistré pour qu'un visiteur qui a accepté hier ne
 * reparte pas de « refusé » aujourd'hui.
 */
export function consentBootstrap() {
  return `(function(){window.dataLayer=window.dataLayer||[];function g(){window.dataLayer.push(arguments)}window.gtag=window.gtag||g;var v="denied";try{if(localStorage.getItem(${JSON.stringify(
    CONSENT_KEY,
  )})==="granted")v="granted"}catch(e){}g("consent","default",{${SIGNALS.map(
    (s) => `${s}:v`,
  ).join(",")}});g("set","ads_data_redaction",v!=="granted");g("set","url_passthrough",true)})();`;
}

/** Applique un choix à la balise déjà chargée. Sans ce `consent update`,
 *  cocher « Accepter » ne changerait rien jusqu'au rechargement de la page. */
export function applyConsent(choice: ConsentChoice) {
  const gtag = window.gtag;
  if (!gtag) return;
  gtag(
    "consent",
    "update",
    Object.fromEntries(SIGNALS.map((signal) => [signal, choice])),
  );
  gtag("set", "ads_data_redaction", choice !== "granted");
}

/** Lit le choix enregistré. `null` = le visiteur n'a pas encore répondu.
 *  Le `try` couvre le mode navigation privée, où `localStorage` peut lever. */
export function readConsent(): ConsentChoice | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return null;
  }
}

function writeConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    /* navigation privée : le choix ne survivra pas à la session, tant pis —
       il vaut mieux un bandeau qui revient qu'un cookie posé sans accord. */
  }
}

/* ── Le bandeau vu comme une source externe ────────────────────────────────
   Sa visibilité dépend de `localStorage` et d'un événement window, deux choses
   que React ne connaît pas : c'est la définition d'un store externe, d'où
   `useSyncExternalStore` côté composant plutôt qu'un `useState` + `useEffect`.
   C'est aussi ce qui règle proprement l'hydratation — le serveur ne peut pas
   savoir si ce visiteur a déjà répondu, il rend donc toujours « fermé ». */

let visible: boolean | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

export function subscribeBanner(onChange: () => void) {
  const reopen = () => {
    visible = true;
    notify();
  };
  listeners.add(onChange);
  window.addEventListener(CONSENT_EVENT, reopen);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener(CONSENT_EVENT, reopen);
  };
}

/** Le résultat est mémorisé : `useSyncExternalStore` exige un instantané
 *  stable tant que rien n'a changé, sous peine de boucle de rendu. */
export function bannerSnapshot() {
  if (visible === null) visible = readConsent() === null;
  return visible;
}

/** Rien à l'écran côté serveur : le choix du visiteur ne s'y connaît pas. */
export function bannerServerSnapshot() {
  return false;
}

/** Enregistre le choix, l'applique à la balise et referme le bandeau. */
export function decideConsent(choice: ConsentChoice) {
  writeConsent(choice);
  applyConsent(choice);
  visible = false;
  notify();
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
