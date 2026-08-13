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
  points: TrustPoint[];
  /** Phrase de conclusion, rendue en manuscrit */
  signature: string;
}

export interface Review {
  author: string;
  /** Ville du propriétaire — l'ancrage local, affiché sous l'auteur */
  town?: string;
  /** Le chien concerné (ex : "Maya · Golden Retriever") */
  dog?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
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
  reviews: Review[];
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
   *  script tiers n'est chargé, le site reste sans cookie. */
  googleAdsId?: string;
  seo: { title: string; description: string; ogImage: string };
}
