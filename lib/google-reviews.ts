import type { Review } from "@/content/types";

/** Récupération des avis de la fiche Google, côté SERVEUR uniquement.
 *
 *  ⚠️ Ce module lit `GOOGLE_PLACES_API_KEY`. Il ne doit être importé que par
 *  des Route Handlers — jamais par un composant, même serveur : Next inlinerait
 *  la clé dans le bundle si le fichier venait à être tiré côté client.
 *
 *  POURQUOI EN DIRECT ET NON EN CACHE — ce n'est pas un choix de fraîcheur,
 *  c'est une contrainte contractuelle. Les Service Specific Terms (zone EEE,
 *  §15.4) n'autorisent à mettre en cache QUE la latitude/longitude, 30 jours,
 *  et le `place_id` indéfiniment (§3). Rien pour le texte des avis. Ne pas
 *  ajouter de `revalidate`, de `use cache` ni de Map en mémoire ici.
 *
 *  Conséquence à connaître : un appel API par visiteur qui atteint la section.
 *  Le SKU « Place Details Enterprise + Atmosphere » donne 1 000 appels gratuits
 *  par mois, puis 25 $ les 1 000. D'où le chargement paresseux côté client
 *  (`components/sections/reviews.tsx`) : seuls les visiteurs qui font défiler
 *  jusqu'aux avis déclenchent un appel, pas tous ceux qui ouvrent la page.
 *
 *  USAGE AUTORISÉ — la Places API est bridée en zone EEE à une liste fermée
 *  d'usages. Celui-ci est le n° 2 : « display information about Customer's
 *  physical stores, offices, or official service points ». Afficher les avis de
 *  sa propre fiche est donc permis ; afficher ceux d'un concurrent ne le serait
 *  pas.
 *
 *  ⚠️ NE PAS reprendre ces avis dans le JSON-LD (`app/layout.tsx`). Google
 *  l'interdit explicitement pour les données structurées : « Don't aggregate
 *  reviews or ratings from other websites », et une fiche notée par
 *  l'établissement lui-même est de toute façon inéligible aux étoiles dans les
 *  résultats. C'est la raison définitive de l'absence d'`aggregateRating` —
 *  elle ne dépend plus du nombre d'avis réels.
 */

const ENDPOINT = "https://places.googleapis.com/v1/places";

/* Google renvoie au plus 5 avis, triés par pertinence, sans pagination ni tri
   par date : ce n'est pas une limite qu'on s'impose, c'est le maximum de l'API.
   `userRatingCount` permet d'annoncer le total réel même quand on n'en montre
   que 5. */
const FIELD_MASK = "reviews,rating,userRatingCount,googleMapsUri";

const MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

type GoogleReview = {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  googleMapsUri?: string;
  visitDate?: { year?: number; month?: number };
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
};

export type ReviewsPayload = {
  reviews: Review[];
  /** Note moyenne de la fiche (peut porter sur plus d'avis que les 5 rendus) */
  rating?: number;
  /** Nombre total d'avis sur la fiche */
  count?: number;
  /** La fiche sur Google Maps — le « voir tous les avis » */
  placeUrl?: string;
};

/** « août 2026 ». Obligation d'affichage propre aux lieux situés en France :
 *  les règles de la Places API imposent d'indiquer le mois et l'année de la
 *  visite. Ne pas la retirer de l'interface. */
function formatVisitDate(d: GoogleReview["visitDate"]): string | undefined {
  if (!d?.year) return undefined;
  const month = d.month ? MONTHS[d.month - 1] : undefined;
  return month ? `${month} ${d.year}` : String(d.year);
}

function clampRating(n: unknown): Review["rating"] {
  const r = Math.round(typeof n === "number" ? n : 0);
  return (Math.min(5, Math.max(1, r)) as Review["rating"]) ?? 5;
}

/* ── Photos de profil des auteurs ──────────────────────────────────────────
 *
 *  Elles sont récupérées PAR LE SERVEUR et renvoyées en `data:` dans la réponse
 *  JSON, plutôt que servies par leur URL Google. Trois montages ont été
 *  envisagés, deux écartés pour de vraies raisons :
 *
 *  1. Pointer `<img src>` sur `lh3.googleusercontent.com` — imposerait de
 *     rouvrir `img-src` dans la CSP et surtout ferait charger l'image par le
 *     navigateur du visiteur, donc livrerait son IP à Google.
 *  2. Un relais `/api/reviews/avatar?u=…` — c'est un Route Handler qui lit la
 *     requête, donc **incompatible avec `output: export`** : le build de
 *     l'aperçu GitHub Pages échoue dessus. Essayé, cassé.
 *  3. Celui-ci. La CSP porte DÉJÀ `img-src 'self' data:` : rien à changer.
 *
 *  Coût assumé : au plus 5 requêtes serveur supplémentaires (en parallèle) et
 *  quelques Ko de JSON. La section étant chargée au défilement, ça ne touche
 *  ni le rendu initial ni le LCP. */

const AVATAR_HOST_SUFFIX = ".googleusercontent.com";
/* Une photo de profil Google fait quelques Ko. Le plafond n'est pas là pour
   économiser mais pour qu'une réponse inattendue ne gonfle pas le JSON servi
   à chaque visiteur. */
const AVATAR_MAX_BYTES = 64 * 1024;

async function fetchAvatarDataUri(
  photoUri: string | undefined,
): Promise<string | undefined> {
  if (!photoUri) return undefined;

  /* L'URL vient de la réponse de Google, mais on la contrôle quand même : une
     `fetch` serveur sur une URL non vérifiée est une SSRF en puissance. */
  let url: URL;
  try {
    url = new URL(photoUri);
  } catch {
    return undefined;
  }
  if (url.protocol !== "https:") return undefined;
  if (!url.hostname.endsWith(AVATAR_HOST_SUFFIX)) return undefined;

  try {
    const response = await fetch(url, {
      /* Pas de rebond : une redirection sortirait de l'hôte qu'on vient de
         valider. */
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return undefined;

    const type = response.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) return undefined;

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength === 0 || buffer.byteLength > AVATAR_MAX_BYTES) {
      return undefined;
    }
    return `data:${type.split(";")[0]};base64,${buffer.toString("base64")}`;
  } catch {
    /* Une photo manquante n'est pas une raison de perdre l'avis : le composant
       retombe sur les initiales de l'auteur. */
    return undefined;
  }
}

export function isConfigured(placeId: string | undefined): boolean {
  return Boolean(placeId && process.env.GOOGLE_PLACES_API_KEY);
}

export async function fetchGoogleReviews(
  placeId: string,
): Promise<ReviewsPayload> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error("GOOGLE_PLACES_API_KEY absente");

  /* `languageCode`/`regionCode` : sans eux Google renvoie les avis traduits
     dans la langue du serveur, pas dans celle où ils ont été écrits. */
  const url = `${ENDPOINT}/${encodeURIComponent(placeId)}?languageCode=fr&regionCode=FR`;

  const response = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    /* Voir l'en-tête du fichier : la mise en cache du contenu des avis n'est
       pas autorisée. `no-store` le dit à Next comme au runtime. */
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Places API ${response.status} ${detail.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    reviews?: GoogleReview[];
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
  };

  const mapped = (data.reviews ?? [])
    .map((r): { review: Review; photoUri?: string } | null => {
      /* `originalText` d'abord : c'est l'avis tel qu'il a été écrit. `text` est
         la version éventuellement traduite par Google — sur une fiche
         française lue en français les deux coïncident, mais si un client écrit
         dans une autre langue, mieux vaut ses mots que la traduction. */
      const text = (r.originalText?.text ?? r.text?.text ?? "").trim();
      const author = r.authorAttribution?.displayName?.trim();
      if (!text || !author) return null;
      return {
        photoUri: r.authorAttribution?.photoUri,
        review: {
          author,
          rating: clampRating(r.rating),
          text,
          source: {
            authorUrl: r.authorAttribution?.uri,
            reviewUrl: r.googleMapsUri,
            visitDate: formatVisitDate(r.visitDate),
            relativeTime: r.relativePublishTimeDescription,
          },
        },
      };
    })
    .filter((r): r is { review: Review; photoUri?: string } => r !== null);

  /* En parallèle : 5 photos à la suite ajouteraient 5 allers-retours au temps
     de réponse, en parallèle elles n'en ajoutent qu'un. Une photo qui échoue
     ne fait pas tomber l'avis — `fetchAvatarDataUri` renvoie `undefined`. */
  const avatars = await Promise.all(
    mapped.map((m) => fetchAvatarDataUri(m.photoUri)),
  );

  const reviews: Review[] = mapped.map((m, i) => ({
    ...m.review,
    source: { ...m.review.source, avatarUrl: avatars[i] },
  }));

  return {
    reviews,
    rating: data.rating,
    count: data.userRatingCount,
    placeUrl: data.googleMapsUri,
  };
}
