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
    /* Entreprise individuelle : le responsable de la publication au sens de
       l'article 6-III de la LCEN est l'exploitant lui-même. */
    publisher: "Martin Tofil",
    address: "29 Rue Branly, 95380 Louvres",
    email: "Dogflow@outlook.fr",
    /* Auto-hébergement depuis le 2026-08-10 : le site a quitté GitHub Pages
       pour un Raspberry Pi derrière Traefik et Cloudflare. C'est donc
       l'exploitant de la machine qui est l'hébergeur au sens de la LCEN —
       Cloudflare n'en est pas un, ce n'est qu'un intermédiaire technique.
       Commune sans numéro de rue : nomme un responsable identifiable sans
       publier une adresse personnelle. */
    host: "Thomas Tofil",
    hostAddress: "Louvres (95380), France",
    // ⚠️ obligatoire en B2C (art. L.612-1) : à souscrire, puis à renseigner
    mediator: "",
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

  /* Réécrit depuis le texte du client (août 2026). Tout ce qui relevait de sa
     biographie — passionné depuis l’enfance, chiens de sa vie — a été retiré :
     ça n’aide pas un maître à décider. Ne restent que les preuves qui le
     rassurent, lui, sur ce qui arrive à son chien pendant l’heure où il n’est
     pas là. */
  trust: {
    credential: {
      badge: "ACACED",
      title: "Formé en éducation canine",
      desc: "Je suis titulaire de l’ACACED, l’attestation officielle exigée en France pour exercer auprès des animaux de compagnie. Concrètement : je sais lire le comportement d’un chien et m’adapter au vôtre — et j’en profite pour entretenir ses bonnes habitudes en balade, marche en laisse, calme au croisement et rappel selon son niveau.",
    },
    points: [
      {
        icon: "camera",
        title: "Des nouvelles pendant la balade",
        desc: "Je vous envoie des photos et des vidéos pendant la sortie. Vous voyez où il est et comment il va, sans avoir à demander.",
      },
      {
        icon: "clipboard-check",
        title: "Vos consignes, à la lettre",
        desc: "Ses habitudes, son harnais, ce qu’il a le droit de faire ou non : vous me le dites une fois, je m’y tiens à chaque balade.",
      },
      {
        icon: "dog",
        title: "Le rythme de votre chien",
        desc: "Jeune ou âgé, sportif ou plus réservé : c’est le parcours qui s’adapte à lui, jamais l’inverse.",
      },
      {
        icon: "calendar-check",
        title: "En semaine comme le week-end",
        desc: "Je cale la balade sur vos horaires, et je réponds rapidement à vos demandes.",
      },
    ],
    signature: "Je m’occupe de chaque chien comme s’il était le mien.",
  },

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

  credits: { label: "Thomas Tofil", url: "https://thomastofil.fr" },

  images: {
    // Vraie photo du client (août 2026) — recadrage et variantes générés
    // par scripts/prepare-photos.js
    hero: "/images/hero.webp",
    heroAlt:
      "Le promeneur de Dog Aventure accroupi aux côtés d’un grand chien noir, pendant une balade",
    // Générés par scripts/trace-logo.js — ne pas éditer à la main
    logo: "/images/logo.svg",
    logoAlt: "Dog Aventure — promeneur avec ses deux chiens en laisse",
    logoMark: "/images/logo-mark.svg",
  },

  // Domaine du client, confirmé le 2026-08-10. Source unique : metadataBase,
  // canonical, robots.txt, sitemap.xml et JSON-LD en découlent tous.
  url: "https://dog-aventure.com",

  seo: {
    // 56 caractères — mot-clé en tête, non tronqué par Google (~60 max)
    title: "Promeneur de chien à Louvres & alentours | Dog Aventure",
    // 149 caractères — la limite d'affichage est ~155-160
    description:
      "Promeneur de chien à Louvres (95) et alentours : balade individuelle, prise en charge et retour à domicile, à partir de 14,90 €. Tél. 07 45 37 50 80.",
    ogImage: "/images/og.jpg",
  },
};
