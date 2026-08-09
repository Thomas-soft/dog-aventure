import type { SiteConfig } from "./types";

/* ════════════════════════════════════════════════════════════════════
   CONTENU DU SITE — SEUL FICHIER À ÉDITER POUR CHANGER LE CONTENU
   (couleurs & typos : app/globals.css et app/layout.tsx)
   ════════════════════════════════════════════════════════════════════ */

export const site: SiteConfig = {
  name: "Dog Aventure",
  activity: "Promenades canines",
  slogan: "Je le promène, vous profitez du reste !",
  subSlogan: "Simple, locale & de confiance",
  tagline: "Moins de temps pour vous, plus de bonheur pour votre chien. ♡",
  description:
    "Je viens chercher votre chien chez vous pour une promenade individuelle — 30 minutes ou 1 heure — et je le raccompagne à votre domicile, dépensé, hydraté et heureux.",

  phone: "07 45 37 50 80",
  phoneHref: "tel:+33745375080",
  smsHref: "sms:+33745375080",

  base: { city: "Louvres", zip: "95380", region: "Val-d'Oise" },

  siret: "988 412 136 00018",
  legal: {
    publisher: "", // ⚠️ à demander au client : nom et prénom
    address: "", // ⚠️ à demander au client : adresse du siège
    email: "", // ⚠️ à demander au client
    // ⚠️ vrai à l'heure de la préview — à changer pour l'hébergeur définitif
    host: "GitHub, Inc. (GitHub Pages)",
    hostAddress: "88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA",
    mediator: "", // ⚠️ à demander au client : nom et site du médiateur souscrit
  },
  towns: [
    "Louvres",
    "Saint-Witz",
    "Vémars",
    "Moussy-le-Neuf",
    "Luzarches",
    "Lamorlaye",
    "Chantilly",
    "Gouvieux",
  ],
  townsSuffix: "et alentours",
  mapsEmbedUrl: "https://www.google.com/maps?q=Louvres+95380&output=embed",

  heroChips: [
    "Promenade individuelle",
    "Prise en charge à domicile",
    "Réservation par tél. ou SMS",
  ],

  services: [
    /* La petite balade d'abord : c'est le prix d'appel, et il porte le
       « à partir de 14,90 € » du hero. La balade d'1 h garde `highlight`
       et reste la meilleure valeur (20 €/h contre 29,80 €/h ici). */
    {
      id: "balade-30min",
      name: "La petite balade",
      duration: "25 à 30 min",
      price: 14.9,
      desc: "La sortie qui sauve une journée serrée : je passe le prendre, il se dégourdit les pattes et fait ses besoins, puis je le raccompagne chez vous. Idéale pour les chiots, les chiens âgés ou une pause en milieu de journée.",
      features: [
        { icon: "paw-print", label: "Promenade individuelle" },
        { icon: "home", label: "Aller et retour à votre domicile" },
      ],
    },
    {
      id: "balade-1h",
      name: "La balade d'1 heure",
      duration: "1 heure",
      price: 20,
      desc: "Je viens chercher votre chien chez vous pour une promenade individuelle d'1 heure, rien que pour lui, et je le raccompagne à votre domicile.",
      features: [
        { icon: "paw-print", label: "Promenade individuelle" },
        { icon: "zap", label: "Sortie & dépense physique" },
        { icon: "droplets", label: "Eau & attention tout au long de la balade" },
        { icon: "home", label: "Retour à votre domicile" },
      ],
      badge: "Confiance & bienveillance",
      highlight: true,
    },
    // Plus tard : { id: "dog-aventure-2h", name: "Dog Aventure", duration: "2 heures",
    // price: 29.9, desc: "2 heures de balade en forêt de Chantilly…", … }
  ],

  steps: [
    {
      title: "Un appel ou un SMS",
      desc: "On fait connaissance, vous me parlez de votre chien et on cale un créneau qui vous arrange.",
    },
    {
      title: "Je viens le chercher",
      desc: "Prise en charge directement chez vous, à l'heure convenue — vous n'avez rien à organiser.",
    },
    {
      title: "La balade, puis le retour",
      desc: "Il se dépense, boit, profite — et je le raccompagne à la maison, heureux.",
    },
  ],

  breeds: [
    {
      name: "Golden Retriever",
      image: "/images/breeds/golden.jpg",
      alt: "Golden retriever avec son harnais, pause en forêt",
      note: "L'inépuisable compagnon de famille — 1 heure de balade, c'est son minimum.",
    },
    {
      name: "Berger Australien",
      image: "/images/breeds/berger-australien.jpg",
      alt: "Berger australien attentif en extérieur",
      note: "Un moteur qui ne s'arrête jamais : il a besoin de se dépenser chaque jour.",
    },
    {
      name: "Staffy",
      image: "/images/breeds/staffy.jpg",
      alt: "Staffordshire bull terrier à l'expression joueuse",
      note: "Un cœur tendre débordant d'énergie, qui mérite une vraie sortie.",
    },
    {
      name: "Caniche",
      image: "/images/breeds/caniche.jpg",
      alt: "Caniche en promenade dans un parc",
      note: "Malin et joueur, il adore son rendez-vous balade de la semaine.",
    },
  ],

  // ⚠️ AVIS DE DÉMONSTRATION — à remplacer par les vrais avis Google du client
  reviews: [
    {
      author: "Julie M.",
      town: "Louvres",
      dog: "Nala · Berger Australien",
      rating: 5,
      text: "Il vient chercher Nala à la maison, elle revient dépensée et heureuse. On sent tout de suite que c'est quelqu'un qui aime vraiment les chiens.",
    },
    {
      author: "Sophie L.",
      town: "Saint-Witz",
      dog: "Maya · Golden Retriever",
      rating: 5,
      text: "Depuis que Maya a sa balade dans la semaine, elle est beaucoup plus calme le soir. Ponctuel, sérieux, et un petit message avec photo pendant la sortie.",
    },
    {
      author: "Karim B.",
      town: "Vémars",
      dog: "Rocco · Staffy",
      rating: 5,
      text: "Rocco tire beaucoup en laisse et je n'osais plus le sortir longtemps. En promenade individuelle, il est pris en main sérieusement — je recommande.",
    },
    {
      author: "Monique D.",
      town: "Luzarches",
      dog: "Prune · Caniche",
      rating: 5,
      text: "Très gentil avec Prune, toujours à l'heure, et elle l'attend devant la porte maintenant. Le retour à domicile, c'est vraiment pratique.",
    },
  ],

  social: {},

  // ⚠️ à personnaliser : ton nom d'agence, et l'URL pour en faire un lien
  credits: { label: "Votre Agence" },

  images: {
    // Vraies photos du client (août 2026) — recadrages et variantes générés
    // par scripts/prepare-photos.js
    hero: "/images/hero.webp",
    heroAlt:
      "Le promeneur de Dog Aventure accroupi aux côtés d’un grand chien noir, pendant une balade",
    heroSecondary: "/images/hero-balade.webp",
    heroSecondaryAlt:
      "Balade en laisse sur un chemin de campagne, le chien devant, détendu",
    // Générés par scripts/trace-logo.js — ne pas éditer à la main
    logo: "/images/logo.svg",
    logoAlt: "Dog Aventure — promeneur avec ses deux chiens en laisse",
    logoMark: "/images/logo-mark.svg",
  },

  url: "https://dog-aventure.fr", // ← remplacer par le domaine réel du client

  seo: {
    // 56 caractères — mot-clé en tête, non tronqué par Google (~60 max)
    title: "Promeneur de chien à Louvres & alentours | Dog Aventure",
    // 149 caractères — la limite d'affichage est ~155-160
    description:
      "Promeneur de chien à Louvres (95) et alentours : balade individuelle, prise en charge et retour à domicile, à partir de 14,90 €. Tél. 07 45 37 50 80.",
    ogImage: "/images/og.jpg",
  },
};
