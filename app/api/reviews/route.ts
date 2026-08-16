import { site } from "@/content/site.config";
import { fetchGoogleReviews, isConfigured } from "@/lib/google-reviews";

/** Avis Google, relayés par notre propre domaine.
 *
 *  Même montage que `/api/contact`, et pour les mêmes raisons : la CSP porte
 *  `connect-src 'self'`, donc passer par le site ne demande AUCUNE
 *  modification de CSP — et la clé de l'API Places n'atteint jamais le
 *  navigateur. Une clé Places posée côté client est lisible par n'importe qui
 *  et facturée à son propriétaire.
 *
 *  ⚠️ POST ET NON GET, POUR UNE LECTURE — ce n'est pas une étourderie, et il
 *  ne faut pas le « corriger ». Sous `output: export` (l'aperçu GitHub Pages),
 *  Next n'accepte que des GET *statiques* : « Route Handlers that rely on
 *  Request » sont listés parmi les fonctionnalités non supportées, et un GET
 *  qui lit des données vives échoue le build avec « export const dynamic =
 *  "force-static" not configured ». Essayé, cassé. Les POST, eux, ne sont
 *  jamais prérendus — c'est exactement pour ça que `/api/contact` passe. Poser
 *  `force-static` ici figerait les avis à jamais, ce qui est l'inverse du but.
 *
 *  Pas de `export const dynamic` non plus : en Next 16, « Route Handlers are
 *  not cached by default » (doc embarquée, 15-route-handlers.md). La route
 *  s'exécute à chaque requête d'office.
 *
 *  ⚠️ Cette route n'existe QUE sur le site déployé. L'aperçu GitHub Pages est
 *  un export statique : rien n'est écrit dans `out/`. Le composant teste
 *  `isStaticPreview` et ne l'appelle pas là-bas.
 */

/* ── Deux garde-fous de dépense ────────────────────────────────────────────
 *
 *  Chaque appel à cette route est un appel FACTURÉ à Google : le SKU « Place
 *  Details Enterprise + Atmosphere » donne 1 000 appels gratuits par mois, puis
 *  25 $ les 1 000 — soit 2,5 centimes l'appel. Et comme le contenu des avis
 *  n'a pas le droit d'être mis en cache (cf. lib/google-reviews.ts), il n'y a
 *  aucun cache pour amortir. Cette route est publique et sans authentification :
 *  sans garde-fou, un script qui la martèle ferait grimper la facture.
 *
 *  1. LIMITE PAR IP — un visiteur réel déclenche UN appel par page vue (le
 *     composant coupe son observateur après le premier). 10 sur 10 minutes est
 *     donc très large pour un humain, et coupe court à un martèlement.
 *  2. PLAFOND JOURNALIER GLOBAL — le vrai pare-feu contre la facture. Au-delà,
 *     la route cesse d'appeler Google et la section disparaît, plutôt que de
 *     laisser filer les coûts. `REVIEWS_DAILY_MAX` permet de le régler sans
 *     reconstruire l'image ; 400/jour ≈ 12 000/mois, à ajuster selon le trafic
 *     réel et ce qu'on accepte de payer.
 *
 *  ⚠️ Ce plafond n'est PAS un cache : il ne conserve aucun avis, il refuse
 *  seulement d'appeler. Le mettre en cache resterait interdit.
 *
 *  Ces compteurs vivent en mémoire — un seul conteneur, et un redémarrage qui
 *  les remet à zéro est sans conséquence. Le vrai plafond dur se pose côté
 *  Google Cloud (quota « requests per day » de la Places API) : celui-ci
 *  protège même d'un bug de notre côté. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_IP = 10;
const hits = new Map<string, number[]>();

/* ⚠️ Analyse volontairement défensive. `docker-compose.yml` passe
   `REVIEWS_DAILY_MAX: ${REVIEWS_DAILY_MAX:-}` : variable absente du `.env`, le
   conteneur reçoit une chaîne VIDE, pas `undefined`. Un `?? 400` ne l'attrape
   pas (il ne couvre que null/undefined) et `Number("")` vaut 0 — le plafond
   serait atteint dès le premier appel et la section ne s'afficherait jamais.
   Bug introduit puis corrigé le 2026-08-16 : ne pas « simplifier » en `??`. */
const DAILY_MAX = (() => {
  const parsed = Number(process.env.REVIEWS_DAILY_MAX);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 400;
})();
let dayStamp = "";
let dayCount = 0;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_IP) return true;
  recent.push(now);
  hits.set(ip, recent);
  /* Purge opportuniste : sans elle la Map croît indéfiniment sur un process
     qui tourne des semaines. */
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

/** Incrémente et dit si le plafond du jour est atteint. */
function dailyBudgetExhausted(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== dayStamp) {
    dayStamp = today;
    dayCount = 0;
  }
  if (dayCount >= DAILY_MAX) return true;
  dayCount += 1;
  return false;
}

export async function POST(request: Request) {
  /* Derrière Cloudflare puis Traefik, l'IP du socket est celle du proxy —
     même raisonnement que pour /api/contact. */
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "inconnu";

  if (rateLimited(ip)) {
    /* 429 sans appeler Google : c'est tout l'intérêt. */
    return Response.json(
      { ok: false, error: "Trop de requêtes." },
      { status: 429, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }

  if (dailyBudgetExhausted()) {
    console.error(
      `[reviews] plafond journalier atteint (${DAILY_MAX}) — appels Google suspendus jusqu'à demain`,
    );
    return Response.json(
      { ok: false, error: "Avis indisponibles." },
      { status: 503, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }

  const placeId = site.googlePlaceId;

  if (!isConfigured(placeId)) {
    /* Ni fiche configurée, ni clé : la section ne doit rien afficher. Un 503
       plutôt qu'un 200 vide, pour que ça se voie dans les journaux — c'est une
       configuration manquante, pas une fiche sans avis. */
    console.error(
      "[reviews] configuration incomplète — googlePlaceId ou GOOGLE_PLACES_API_KEY absent",
    );
    return Response.json(
      { ok: false, error: "Service indisponible." },
      { status: 503 },
    );
  }

  try {
    const payload = await fetchGoogleReviews(placeId!);
    return Response.json(
      { ok: true, ...payload },
      /* `no-store` sur la réponse aussi : sans lui, Cloudflare ou un
         intermédiaire pourrait conserver le corps — or le contenu des avis
         n'a pas le droit d'être mis en cache (cf. lib/google-reviews.ts). */
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("[reviews] appel Places API en échec :", error);
    return Response.json(
      { ok: false, error: "Avis indisponibles." },
      { status: 502, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }
}
