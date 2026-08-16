/** Icônes des puces service — résolues en composants lucide dans la section */
export type FeatureIcon = "paw-print" | "zap" | "droplets" | "home";

export interface ServiceFeature {
  icon: FeatureIcon;
  label: string;
}

export interface Service {
  /** Identifiant stable (kebab-case) — ex : "balade-1h", plus tard "dog-aventure-2h" */
  id: string;
  name: string;
  /** Durée affichée (ex : "1 heure") */
  duration: string;
  /** Prix en euros — entier affiché sans décimales, sinon virgule française */
  price: number;
  /** Ramené à l'heure, sous le prix (ex : "soit 44,70 € l'heure"). C'est la
   *  comparaison qui rend la balade d'1 h évidente — la garder sur les deux
   *  offres, sinon elle ressemble à un argument de vente plutôt qu'à un fait. */
  priceNote?: string;
  desc: string;
  features: ServiceFeature[];
  /** Badge de mise en avant, affiché sur l'offre phare (ex : "La plus demandée") */
  badge?: string;
  /** Offre phare : cadre orange, bouton SMS en plus, prix en couleur.
   *  Une seule à la fois — deux offres « phares », c'est aucune. */
  highlight?: boolean;
}

/** Carnet de balades prépayées, adossé à une offre unitaire (`Packs.serviceId`).
 *  On ne stocke que la quantité et le total : le prix à la balade et
 *  l'économie s'en déduisent. Les écrire en dur, c'est se garantir une grille
 *  incohérente au premier changement de tarif. */
export interface Pack {
  /** Identifiant stable (kebab-case) — ex : "pack-10" */
  id: string;
  /** Nom affiché (ex : "Pack 10") */
  name: string;
  /** Nombre de balades dans le carnet */
  quantity: number;
  /** Prix total du carnet, en euros */
  total: number;
  /** Badge de mise en avant (ex : "Le meilleur prix") */
  badge?: string;
  /** Carnet le plus avantageux : cadre et prix en couleur. Une seule fois. */
  highlight?: boolean;
}

/** Grille dégressive affichée sous les offres. La colonne « à l'unité » n'est
 *  pas un `Pack` : elle est lue depuis le service `serviceId`, pour que le prix
 *  de référence ne vive qu'à un seul endroit. */
export interface Packs {
  title: string;
  sub: string;
  /** `id` du service servant de référence — son prix ouvre la grille et sert
   *  au calcul de l'économie de chaque carnet */
  serviceId: string;
  /** Libellé de la colonne de référence (ex : "À l'unité") */
  unitLabel: string;
  unitDesc: string;
  items: Pack[];
  /** Précision affichée sous la grille */
  note: string;
}

export interface Step {
  title: string;
  desc: string;
}

/** Icônes des arguments de confiance — résolues en composants lucide dans la section */
export type TrustIcon =
  | "camera"
  | "clipboard-check"
  | "dog"
  | "calendar-check";

export interface TrustPoint {
  icon: TrustIcon;
  title: string;
  desc: string;
}

/** Ce qui décide un maître à confier son chien — qualification, puis preuves
 *  concrètes. Rien de biographique ici : uniquement ce qui le rassure, lui. */
export interface Trust {
  /** La qualification, mise en avant au-dessus des autres arguments */
  credential: {
    /** Sigle ou intitulé du diplôme, affiché en pastille (ex : "ACACED") */
    badge: string;
    title: string;
    desc: string;
  };
  /** Garantie professionnelle, affichée juste sous la qualification.
   *  Sa place est là et pas en cinquième carte : comme l'ACACED, c'est un fait
   *  opposable et non un engagement — et la grille des `points` est en
   *  `lg:grid-cols-4`, une carte de plus la casserait. */
  insurance?: { title: string; desc: string };
  points: TrustPoint[];
  /** Phrase de conclusion, rendue en manuscrit */
  signature: string;
}

/** Textes du bandeau de consentement aux cookies publicitaires. Le bandeau
 *  n'existe que si `googleAdsId` est renseigné : sans balise, aucun cookie,
 *  donc rien à demander. */
export interface Consent {
  title: string;
  desc: string;
  /** Libellés des deux boutons. Ils sont rendus à la même taille, volontairement :
   *  la CNIL exige que refuser soit aussi simple qu'accepter. */
  accept: string;
  refuse: string;
  /** Lien vers les mentions légales, à la suite du texte */
  more: string;
  /** Lien de la barre du bas, qui rouvre le bandeau pour changer d'avis */
  reopen: string;
}

/** Un avis affiché dans la section `#avis`.
 *
 *  ⚠️ Depuis le 2026-08-16, ce type n'est plus alimenté par `site.config.ts` :
 *  les avis viennent en direct de la fiche Google, via `/api/reviews`. Il n'y a
 *  plus d'avis écrits à la main dans le dépôt, et il ne faut pas en réintroduire
 *  — les quatre qui s'y trouvaient étaient inventés (cf. `lib/google-reviews.ts`).
 *
 *  `town` et `dog` restent dans le type mais **l'API Google ne les fournit
 *  pas** : elle ne renvoie ni la ville du client ni le nom de son chien. Ils
 *  sont donc toujours `undefined` en pratique. Conservés pour le jour où un
 *  avis serait saisi autrement, pas parce qu'ils servent aujourd'hui. */
export interface Review {
  author: string;
  /** Ville du propriétaire — jamais fournie par l'API Google */
  town?: string;
  /** Le chien concerné (ex : "Maya · Golden Retriever") — idem */
  dog?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** Attribution d'un avis Google. **Obligatoire dès qu'il est affiché** :
   *  les règles de la Places API imposent de créditer l'auteur et de laisser
   *  l'internaute accéder à l'avis d'origine sur Maps. Ne pas rendre ces
   *  champs facultatifs à l'affichage. */
  source?: ReviewSource;
}

export interface ReviewSource {
  /** Photo de profil de l'auteur, en **`data:` URI** — l'image est récupérée
   *  par le serveur et inlinée dans la réponse de `/api/reviews`.
   *
   *  ⚠️ Ne pas la remplacer par l'URL Google d'origine. Elle obligerait à
   *  rouvrir `img-src` dans la CSP et ferait charger l'image par le navigateur
   *  du visiteur, livrant son IP à Google. Un relais `/api/reviews/avatar?u=…`
   *  ne marche pas non plus : c'est un Route Handler qui lit la requête, donc
   *  incompatible avec `output: export` — il fait échouer le build de l'aperçu
   *  GitHub Pages. La CSP porte déjà `img-src 'self' data:`, le `data:` ne
   *  demande rien. `undefined` si la récupération échoue : le composant
   *  retombe alors sur les initiales. */
  avatarUrl?: string;
  /** Profil Google de l'auteur */
  authorUrl?: string;
  /** L'avis sur Google Maps — l'accès à la source, exigé par les règles */
  reviewUrl?: string;
  /** « août 2026 ». **Obligatoire pour un établissement français** : les
   *  règles de la Places API imposent d'afficher le mois et l'année de la
   *  visite pour les avis de lieux situés en France. */
  visitDate?: string;
  /** « il y a 2 jours » — recommandé par Google, augmente la confiance */
  relativeTime?: string;
}

/** Formulaire de contact — l'alternative à l'appel, pas son remplacement.
 *
 *  TROIS champs, et pas quatre. La littérature sur les formulaires de
 *  génération de leads est constante : passer de 4 à 3 champs améliore le taux
 *  de complétion d'environ la moitié, chaque champ ajouté en coûte. Ne pas y
 *  glisser « ville », « race du chien » ou « créneau souhaité » : ce sont des
 *  questions qui se posent naturellement dans la réponse, pas des barrières à
 *  poser avant le premier contact.
 *
 *  Le champ du milieu accepte INDIFFÉREMMENT un e-mail ou un téléphone, et
 *  c'est le cœur du dispositif. Les études qui déconseillent le champ
 *  téléphone (≈5 % de soumissions en moins, jusqu'à 37 % d'abandon) mesurent
 *  des formulaires B2B où être rappelé EST la crainte. Ici, le formulaire
 *  existe précisément parce que certains visiteurs n'osent pas appeler :
 *  exiger un numéro reproduirait le blocage qu'on cherche à lever, exiger un
 *  e-mail écarterait ceux qui préfèrent être rappelés. Laisser choisir le
 *  canal supprime les deux, sans ajouter de champ. */
export interface ContactForm {
  /** Petite accroche au-dessus du formulaire */
  eyebrow: string;
  title: string;
  intro: string;
  namePlaceholder: string;
  nameLabel: string;
  contactLabel: string;
  contactPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submit: string;
  sending: string;
  successTitle: string;
  successDesc: string;
  /** Panne d'envoi : renvoie vers le téléphone, qui lui marche toujours */
  error: string;
  /** Mention RGPD affichée sous le bouton, obligatoire dès la collecte */
  privacy: string;
  /** L'aperçu GitHub Pages n'a pas de serveur : l'endpoint n'y existe pas */
  previewNotice: string;
}

export interface SiteConfig {
  name: string;
  /** Sous-titre du logo texte (ex : "Promenades canines") */
  activity: string;
  slogan: string;
  subSlogan: string;
  /** Signature manuscrite du flyer, affichée en font-script */
  tagline: string;
  description: string;
  phone: string;
  phoneHref: string;
  smsHref: string;
  whatsappHref: string;
  /** Ville d'attache — affichée « Basé à … » et utilisée dans le JSON-LD */
  base: { city: string; zip: string; region: string };
  /** SIRET, groupé 3-3-3-5 — pied de page, mentions légales et JSON-LD */
  siret: string;
  /** Mentions légales (LCEN art. 6-III). Un champ vide s'affiche
   *  « [à compléter] » sur /mentions-legales — impossible à oublier. */
  legal: {
    /** Nom et prénom du responsable de la publication */
    publisher: string;
    /** Adresse du siège de l'activité */
    address: string;
    email: string;
    host: string;
    hostAddress: string;
  };
  /** Villes desservies, ordre d'affichage (marquee, section zones, footer, areaServed) */
  towns: string[];
  /** Suffixe après la liste (ex : "et alentours") */
  townsSuffix: string;
  /** URL d'embed Google Maps (format https://www.google.com/maps?q=…&output=embed) */
  mapsEmbedUrl: string;
  /** Arguments courts affichés en chips sous le hero */
  heroChips: string[];
  /** Une entrée par offre — ajouter « Dog Aventure 2 h » ici le moment venu */
  services: Service[];
  /** Grille dégressive, rendue sous les offres dans la section « La promenade ».
   *  `items: []` masque le bloc entièrement. */
  packs: Packs;
  /** Les 3 étapes « Comment ça marche » */
  steps: Step[];
  /** Arguments de confiance — section « Pourquoi me confier votre chien » */
  trust: Trust;
  /** Identifiant Places de la fiche Google (« ChIJ… »), source des avis
   *  affichés dans `#avis`. Vide ou absent = la section ne s'affiche pas du
   *  tout — c'est délibéré, il n'existe aucun avis de repli dans le dépôt.
   *  Le récupérer avec `node scripts/find-place-id.js` (une seule fois). */
  googlePlaceId?: string;
  social: { instagram?: string; facebook?: string };
  /** Crédit du réalisateur, barre du bas. Rendu en lien seulement si `url`
   *  est renseignée — sinon en texte simple, pour éviter un href="#" mort. */
  credits: { label: string; url?: string };
  images: {
    hero: string;
    heroAlt: string;
    /** Logo complet, texte en arc compris — footer */
    logo: string;
    logoAlt: string;
    /** Le promeneur seul, sans le texte — barre de navigation et favicon */
    logoMark: string;
  };
  /** URL du site en production, sans slash final — metadataBase, canonical, sitemap, robots et JSON-LD */
  url: string;
  /** Identifiant de la balise Google Ads (« AW-… »). Vide ou absent = aucun
   *  script tiers n'est chargé, le site reste sans cookie — et le bandeau de
   *  consentement disparaît avec lui, n'ayant plus rien à demander. */
  googleAdsId?: string;
  /** Libellé de l'action de conversion Ads, SANS le préfixe « AW-… » : Google
   *  livre `send_to: "AW-<id>/<libellé>"`, on ne stocke que la seconde moitié
   *  pour que l'identifiant du compte ne vive qu'à un seul endroit.
   *  Absent = les clics ne sont pas remontés, la balise reste posée. */
  googleAdsConversionLabel?: string;
  /** Libellé de l'action de conversion du FORMULAIRE, distinct du précédent.
   *  Deux actions principales ne se marchent pas dessus tant qu'elles mesurent
   *  des événements différents — un appel et un formulaire en sont deux. Le
   *  double comptage à fuir, c'est deux libellés sur un même clic. */
  googleAdsFormConversionLabel?: string;
  /** Libellé de l'action de conversion du clic WhatsApp, encore distinct.
   *  Vide tant que l'action n'existe pas côté Ads : le bouton marche, il n'est
   *  pas compté. Ne jamais le faire retomber sur le libellé de l'appel. */
  googleAdsWhatsappConversionLabel?: string;
  consent: Consent;
  contactForm: ContactForm;
  seo: { title: string; description: string; ogImage: string };
}
