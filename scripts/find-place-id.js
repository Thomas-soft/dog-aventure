#!/usr/bin/env node
/**
 * Résout l'identifiant Places (« ChIJ… ») de la fiche Google du client.
 *
 * À lancer UNE FOIS, puis coller le résultat dans `googlePlaceId` de
 * `content/site.config.ts` :
 *
 *   GOOGLE_PLACES_API_KEY=xxxx node scripts/find-place-id.js
 *   GOOGLE_PLACES_API_KEY=xxxx node scripts/find-place-id.js "Autre fiche, Ville"
 *
 * Pourquoi un script et pas une recherche à la main : Google Maps n'expose plus
 * le « ChIJ… » dans ses URL — la barre d'adresse ne montre qu'un identifiant
 * hexadécimal (`0x…:0x…`) et un FID (`/g/…`), dont aucun n'est accepté par la
 * Places API. Vérifié le 2026-08-16 : la page de la fiche ne contient aucune
 * chaîne « ChIJ ». Il faut donc passer par Text Search.
 *
 * Coût : un appel « Text Search Essentials » (fourchette gratuite de 10 000 par
 * mois). On ne demande QUE `places.id`, `places.displayName` et
 * `places.formattedAddress` — ajouter `places.reviews` ferait basculer l'appel
 * dans le SKU « Enterprise + Atmosphere », bien plus cher, pour rien.
 */

const KEY = process.env.GOOGLE_PLACES_API_KEY;
const QUERY = process.argv[2] || "DogAventure, 29 Rue Branly, 95380 Louvres";

if (!KEY) {
  console.error(
    "GOOGLE_PLACES_API_KEY absente.\n" +
      "  GOOGLE_PLACES_API_KEY=xxxx node scripts/find-place-id.js",
  );
  process.exit(1);
}

const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": KEY,
    "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
  },
  body: JSON.stringify({ textQuery: QUERY, languageCode: "fr", regionCode: "FR" }),
});

if (!response.ok) {
  console.error(`Places API a répondu ${response.status}`);
  console.error(await response.text());
  process.exit(1);
}

const { places = [] } = await response.json();

if (places.length === 0) {
  console.error(`Aucune fiche trouvée pour « ${QUERY} ».`);
  process.exit(1);
}

console.log(`\nRecherche : « ${QUERY} »\n`);
for (const place of places) {
  console.log(`  ${place.displayName?.text ?? "(sans nom)"}`);
  console.log(`    ${place.formattedAddress ?? ""}`);
  console.log(`    googlePlaceId: "${place.id}"\n`);
}
console.log(
  "Coller l'identifiant de la bonne fiche dans `googlePlaceId`\n" +
    "de content/site.config.ts, puis `npm run build`.\n",
);
