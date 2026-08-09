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
  desc: string;
  features: ServiceFeature[];
  /** Badge de réassurance (ex : "Confiance & bienveillance") */
  badge?: string;
  /** Mettre en avant cette offre quand il y en aura plusieurs */
  highlight?: boolean;
}

export interface Step {
  title: string;
  desc: string;
}

export interface Breed {
  name: string;
  /** Chemin vers /public (ex : "/images/breeds/golden.jpg") */
  image: string;
  alt: string;
  note?: string;
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
    /** Médiateur de la consommation — obligatoire pour un prestataire B2C
     *  (art. L612-1 du Code de la consommation) */
    mediator: string;
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
  /** Les 3 étapes « Comment ça marche » */
  steps: Step[];
  /** Races mises en avant — les chiens du secteur */
  breeds: Breed[];
  reviews: Review[];
  social: { instagram?: string; facebook?: string };
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
  seo: { title: string; description: string; ogImage: string };
}
