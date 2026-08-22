import type { SiteConfig } from "./types";

/* ════════════════════════════════════════════════════════════════════
   CONTENU DU SITE — SEUL FICHIER À ÉDITER POUR CHANGER LE CONTENU
   (couleurs & typos : app/globals.css et app/layout.tsx)
   ════════════════════════════════════════════════════════════════════ */

export const site: SiteConfig = {
  name: "Dog Aventure",
  activity: "Promenades canines",
  slogan: "On le promène, vous profitez du reste !",
  subSlogan: "Simple, locale & de confiance",
  tagline: "Plus de temps pour vous, plus de bonheur pour votre chien. ♡",
  description:
    "On vient chercher votre chien chez vous pour une promenade individuelle d’1 heure — ou 20 minutes en dépannage — et on le raccompagne à votre domicile, dépensé, hydraté et heureux.",

  phone: "07 45 37 50 80",
  phoneHref: "tel:+33745375080",
  smsHref: "sms:+33745375080",
  /* wa.me veut le numéro au format international SANS « + » ni séparateur.
     Confirmé le 2026-08-14 que ce numéro a bien un compte WhatsApp : sans
     compte, le lien affiche « ce numéro n'est pas sur WhatsApp » — un
     cul-de-sac pour un prospect, pire que pas de bouton du tout. */
  whatsappHref: "https://wa.me/33745375080",

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
       Aucune adresse : choix assumé du 2026-08-10, la machine étant chez un
       particulier. `hostAddress` vide n'affiche rien du tout — le composant
       teste le champ avant de rendre la virgule. */
    host: "Thomas Tofil",
    hostAddress: "",
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
    "Senlis",
  ],
  townsSuffix: "et alentours",
  mapsEmbedUrl: "https://www.google.com/maps?q=Louvres+95380&output=embed",

  heroChips: [
    "Promenade individuelle",
    "Prise en charge à domicile",
    "Réservation par tél. ou SMS",
  ],

  services: [
    /* La balade d'1 h EN PREMIER, décision client du 2026-08-11 : c'est l'offre
       à vendre, elle ouvre donc la liste et garde `highlight`. La petite balade
       passe en second, assumée comme un dépannage — 44,70 €/h contre 20 €/h, le
       `priceNote` fait la démonstration tout seul. Ne pas réinverser. */
    {
      id: "balade-1h",
      name: "La balade d’1 heure",
      duration: "1 heure",
      price: 22.9,
      /* Tautologique sur une offre d'1 h, et c'est exactement le but : sans ce
         repère affiché des deux côtés, le « 44,70 € l'heure » de la petite
         balade ressemblerait à un argument de vente au lieu d'un fait. */
      priceNote: "soit 22,90 € l’heure",
      desc: "Une heure rien que pour lui : on vient le chercher chez vous, il se dépense vraiment, explore, renifle, boit — et on le raccompagne apaisé pour la journée. C’est la balade que prennent presque tous nos clients, et de loin la meilleure valeur.",
      features: [
        { icon: "paw-print", label: "Promenade individuelle" },
        { icon: "zap", label: "Sortie & dépense physique" },
        { icon: "droplets", label: "Eau & attention tout au long de la balade" },
        { icon: "home", label: "Retour à votre domicile" },
      ],
      badge: "La plus demandée",
      highlight: true,
    },
    {
      id: "balade-20min",
      name: "La petite balade",
      duration: "20 min",
      price: 14.9,
      priceNote: "soit 44,70 € l’heure",
      desc: "Le strict minimum pour un chien : le temps de sortir, de se dégourdir les pattes et de faire ses besoins. C’est un dépannage — une journée trop serrée, un chiot qui ne tient pas encore, un chien âgé qui fatigue vite. Pour un chien en forme, 20 minutes ne suffisent pas à le fatiguer : prenez plutôt l’heure.",
      features: [
        { icon: "paw-print", label: "Promenade individuelle" },
        { icon: "home", label: "Aller et retour à votre domicile" },
      ],
    },
    // Plus tard : { id: "dog-aventure-2h", name: "Dog Aventure", duration: "2 heures",
    // price: 29.9, desc: "2 heures de balade en forêt de Chantilly…", … }
  ],

  /* Carnets dégressifs, demande client du 2026-08-11. La grille se lit
     22,90 → 21,50 → 20 € la balade. Seuls `quantity` et `total` sont saisis :
     le prix à la balade et l'économie sont calculés à l'affichage, sinon la
     grille devient incohérente au premier changement de tarif. */
  packs: {
    title: "Il sort plusieurs fois par semaine ?",
    sub: "Prenez ses balades d’1 heure par carnet : plus le carnet est grand, moins la balade coûte cher.",
    serviceId: "balade-1h",
    unitLabel: "À l’unité",
    unitDesc: "Le prix d’une balade réservée seule.",
    items: [
      { id: "pack-10", name: "Pack 10", quantity: 10, total: 215 },
      {
        id: "pack-20",
        name: "Pack 20",
        quantity: 20,
        total: 400,
        badge: "Le meilleur prix",
        highlight: true,
      },
    ],
    note: "Les carnets portent sur la balade d’1 heure. Rien à régler en ligne : on en parle au téléphone.",
  },

  steps: [
    {
      title: "Un appel ou un SMS",
      desc: "On fait connaissance, vous nous parlez de votre chien et on cale un créneau qui vous arrange.",
    },
    {
      title: "On vient le chercher",
      desc: "Prise en charge directement chez vous, à l'heure convenue — vous n'avez rien à organiser.",
    },
    {
      title: "La balade, puis le retour",
      desc: "Il se dépense, boit, profite — et on le raccompagne à la maison, heureux.",
    },
  ],

  /* Texte fourni par le client le 2026-08-18, repris **tel quel**. Rendu en
     bandeau au bas de « La promenade », donc juste après les tarifs et juste
     avant le formulaire : c'est là qu'il travaille, en levant l'objection du
     prix au moment précis où elle se pose.

     ⚠️ À ne pas confondre avec la « visite à domicile » écartée du site le
     2026-08-10 : celle-là était une prestation payante jamais tarifée, celle-ci
     est un préalable gratuit à la première balade. */
  firstMeeting: {
    title: "Première rencontre offerte",
    paragraphs: [
      "Avant la première promenade, on vient directement à votre domicile pour rencontrer votre chien et faire connaissance avec vous.",
      "Ce premier échange nous permet de découvrir ses habitudes, son caractère et vos consignes afin que tout soit prêt pour sa première balade.",
    ],
    note: "La rencontre est gratuite et sans engagement.",
  },

  /* Réécrit depuis le texte du client (août 2026). Tout ce qui relevait de sa
     biographie — passionné depuis l’enfance, chiens de sa vie — a été retiré :
     ça n’aide pas un maître à décider. Ne restent que les preuves qui le
     rassurent, lui, sur ce qui arrive à son chien pendant l’heure où il n’est
     pas là. */
  trust: {
    credential: {
      badge: "ACACED",
      title: "Formé en éducation canine",
      desc: "On est titulaire de l’ACACED, l’attestation officielle exigée en France pour exercer auprès des animaux de compagnie. Concrètement : on sait lire le comportement d’un chien et s’adapter au vôtre — et on en profite pour entretenir ses bonnes habitudes en balade, marche en laisse, calme au croisement et rappel selon son niveau.",
    },
    /* Demande client du 2026-08-13, texte fourni par lui. Deuxième fait
       opposable de la page après l'ACACED, d'où sa place sous la
       qualification et non parmi les `points`, qui sont des engagements. */
    insurance: {
      title: "Activité professionnelle assurée — RC Pro",
      desc: "Votre chien est pris en charge dans le cadre d’une activité professionnelle couverte par une Responsabilité Civile Professionnelle.",
    },
    points: [
      {
        icon: "camera",
        title: "Des nouvelles pendant la balade",
        desc: "On vous envoie des photos et des vidéos pendant la sortie. Vous voyez où il est et comment il va, sans avoir à demander.",
      },
      {
        icon: "clipboard-check",
        title: "Vos consignes, à la lettre",
        desc: "Ses habitudes, son harnais, ce qu’il a le droit de faire ou non : vous nous le dites une fois, on s’y tient à chaque balade.",
      },
      {
        icon: "dog",
        title: "Le rythme de votre chien",
        desc: "Jeune ou âgé, sportif ou plus réservé : c’est le parcours qui s’adapte à lui, jamais l’inverse.",
      },
      {
        icon: "calendar-check",
        title: "En semaine comme le week-end",
        desc: "On cale la balade sur vos horaires, et on répond rapidement à vos demandes.",
      },
    ],
    signature: "On s’occupe de chaque chien comme s’il était le nôtre.",
  },

  /* Les QUATRE avis réels de la fiche Google « DogAventure », relevés le
     2026-08-18 (5,0 ★, 4 avis — les deux premiers sont arrivés la veille).
     Recopiés **mot pour mot**, fautes de frappe et ponctuation comprises :
     corriger l'orthographe d'un client, c'est déjà réécrire son avis.

     Ordre = celui de la fiche au moment du relevé. Il place les avis de tiers
     avant celui de Thomas Tofil, qui est en conflit d'intérêts (cf. CLAUDE.md)
     — le garder en tête de section n'aurait aucune raison d'être.

     ⚠️ Ce ne sont PAS des textes à retoucher, ni à compléter. Les quatre avis
     qui vivaient ici jusqu'à ce jour étaient inventés — noms, villes, chiens —
     et ont été supprimés : diffuser de faux avis de consommateurs est une
     pratique commerciale trompeuse, et le site est commercial et poussé par de
     la publicité payante. Pour ajouter un avis, il faut qu'il existe d'abord
     sur la fiche.

     Instantané assumé : ce tableau ne se met pas à jour tout seul. La version
     branchée en direct sur la Places API existe et fonctionne — voir le commit
     795fe06 — elle a été retirée faute de compte de facturation Google Cloud
     actif. Détail dans CLAUDE.md, section « Avis ».

     Ni `town` ni `dog` : Google ne les fournit pas, et les inventer
     fabriquerait du détail crédible autour d'un avis réel. */
  reviews: [
    {
      author: "Lestage Juliette",
      avatarUrl:
        "https://lh3.googleusercontent.com/a-/ALV-UjV94jxOJB3bV9FuS57neyEZEGeg_k6su7alro2qlGswxhl3hG51=w72-h72-p-rp-mo-br100",
      rating: 5,
      text: "Merci à Martin ! Il s’est super bien occupé de mon petit chien :)",
      source: {
        visitDate: "août 2026",
        reviewUrl: "https://www.google.com/maps/place/?q=place_id:ChIJLWa88eeiaygRZCrsdYgnldQ",
      },
    },
    {
      /* Apostrophes droites et « hésiter! » sans espace : c'est ce qu'il a
         tapé. Ne pas typographier — cf. l'en-tête de ce bloc. */
      author: "nicolas",
      /* « -ba12- » retiré du suffixe : c'est la pastille « Local Guide »
         incrustée par Google dans l'image, qui se retrouvait rognée au bord
         du cercle — et le badge est déjà écrit en toutes lettres sous le nom. */
      avatarUrl:
        "https://lh3.googleusercontent.com/a/ACg8ocIbZRA8EX7vvvblwkKw3BKKJYsgfgcqUqcSzeeWilo8CQdmGw=w72-h72-p-rp-mo-br100",
      localGuide: true,
      rating: 5,
      text: "Très content de Martin, sérieux, attentionné et à l'écoute de Sam, tout s'est très bien passé, on recommande sans hésiter!",
      source: {
        visitDate: "août 2026",
        reviewUrl: "https://www.google.com/maps/place/?q=place_id:ChIJLWa88eeiaygRZCrsdYgnldQ",
      },
    },
    {
      author: "Thomas Tofil",
      avatarUrl:
        "https://lh3.googleusercontent.com/a-/ALV-UjUUI1Kyx8H0gkqt-DFg9ST6OZDUvwhPhVusNwRsTIxApbHBKCdo=w72-h72-p-rp-mo-br100",
      rating: 5,
      text: "Mon petit chien Bao a profité des balades avec Martin et je recommande à 100%.\nDe confiance, très pro et de bons conseils !\nLui confier mon chiot a été un tres bon choix pour lui comme pour moi.\nMerci !",
      source: {
        visitDate: "août 2026",
        reviewUrl: "https://www.google.com/maps/place/?q=place_id:ChIJLWa88eeiaygRZCrsdYgnldQ",
      },
    },
    {
      author: "audrey carlier",
      avatarUrl:
        "https://lh3.googleusercontent.com/a/ACg8ocJd6RG2AipN1ad3mODpdpQdvtv8xwVzLDwT6Phj0IPHuoxQSA=w72-h72-p-rp-mo-br100",
      rating: 5,
      text: "Tellement pratique pour les jours où on a pas trop le temps\nIl vient chercher votre loulou à domicile et le ramène franchement mon chien était super content de voir plein d’autres copain\nJe referais appel à ses services",
      source: {
        visitDate: "août 2026",
        reviewUrl: "https://www.google.com/maps/place/?q=place_id:ChIJLWa88eeiaygRZCrsdYgnldQ",
      },
    },
  ],

  /* La fiche, pour le lien « voir les avis sur Google » sous la section — le
     chemin vers la source que les mentions légales annoncent. La forme
     `?q=place_id:` est l'URL canonique d'une fiche, stable dans le temps,
     contrairement aux URL /maps/place/... qui embarquent des coordonnées. */
  googleProfileUrl:
    "https://www.google.com/maps/place/?q=place_id:ChIJLWa88eeiaygRZCrsdYgnldQ",

  social: {},

  credits: { label: "Thomas Tofil", url: "https://thomastofil.fr" },

  images: {
    // Vraie photo du client (août 2026) — recadrage et variantes générés
    // par scripts/prepare-photos.js
    hero: "/images/hero.webp",
    heroAlt:
      "Le promeneur de Dog Aventure accroupi aux côtés d’un grand chien noir, pendant une balade",
    /* Photo du binôme (2026-08-18), section « Il est entre de bonnes mains ».
       Elle est ce qui rend le « on » des textes crédible : le visiteur voit
       les deux personnes à qui il confie son chien, en tenue Dog Aventure. */
    team: "/images/equipe.webp",
    teamAlt:
      "Les deux promeneurs de Dog Aventure en t-shirt « Promeneur de chiens », devant une haie",
    // Générés par scripts/trace-logo.js — ne pas éditer à la main
    logo: "/images/logo.svg",
    logoAlt: "Dog Aventure — promeneur avec ses deux chiens en laisse",
    logoMark: "/images/logo-mark.svg",
  },

  // Domaine du client. Source unique : metadataBase, canonical, robots.txt,
  // sitemap.xml et JSON-LD en découlent tous.
  //
  // Remplace dog-aventure.com le 2026-08-12. Ce dernier était un domaine
  // expiré racheté, dont le passé de page parquée faisait refuser les
  // campagnes Google Ads (« Site infecté ») ; doogaventure.fr est une
  // première inscription, sans aucun historique. Détail dans CLAUDE.md.
  url: "https://doogaventure.fr",

  /* Balise Google Ads du compte 165-047-3837. Sans elle, la campagne reste
     « Éligible (mauvaise configuration) » et Google Ads optimise à l'aveugle,
     faute de la moindre remontée depuis le site.

     C'est la SEULE origine tierce de la page avec l'iframe Maps : la vider
     suffit à retirer entièrement gtag.js et les cookies publicitaires, sans
     toucher au reste du code. La CSP correspondante vit dans
     docker-compose.yml — les deux se modifient ensemble. */
  googleAdsId: "AW-18383414023",

  /* Action de conversion « Annonce Appel Direct » (2026-08-14). Remplace
     « Contact » (libellé M9shCIS00d8cEIfG8r1E), qui était de type « Site Web »
     générique et n'avait enregistré aucune conversion.

     Pourquoi celle-ci : sa source est « Clics sur des numéros de téléphone »,
     non modifiable, et elle est rattachée à l'objectif « Leads par téléphone ».
     C'est exactement ce que mesure conversion-tracker.tsx — l'ancienne action
     décrivait le même clic sous une étiquette plus vague.

     UNE SEULE action doit être branchée à la fois. Les deux sont « principales »
     et alimentent donc les enchères : en émettre deux sur le même clic
     doublerait le nombre de conversions et ferait optimiser la campagne sur un
     compte faux. Ne pas « ajouter » un libellé ici, le remplacer.

     Google la livre en « Chargement de page » — inapplicable ici : le site est
     une page unique, sans formulaire ni page de confirmation. Posée dans le
     <head> comme Google le propose, elle compterait une conversion par visite,
     soit 100 % de taux de conversion, et la campagne optimiserait sur du bruit.
     Elle est donc déclenchée au CLIC sur un lien `tel:` ou `sms:` — la seule
     intention réellement mesurable sur ce site. Voir components/layout/
     conversion-tracker.tsx.

     Aucune `value` n'est envoyée : l'action est réglée sur « si aucune valeur
     n'est définie, utiliser 1 € », donc l'extrait de Google (`value: 1.0`) ne
     ferait que réécrire ce défaut. Un montant inventé donnerait une fausse
     précision dans les rapports de valeur.

     Un libellé erroné échoue en silence : ni erreur, ni log, juste zéro
     conversion. À vérifier dans Ads sous 24 h après toute modification. */
  googleAdsConversionLabel: "VzR7CN_-s-EcEIfG8r1E",

  /* Action « Formulaire du site » (2026-08-14), catégorie « Envoi de
     formulaire de lead », source Site Web, événement manuel, comptabilisation
     « Une », fenêtre après clic 30 jours — alignée sur celle de l'appel pour
     que les deux chiffres soient comparables.

     Distincte de `googleAdsConversionLabel` À DESSEIN : un appel et un
     formulaire sont deux événements différents, deux actions principales ne se
     marchent donc pas dessus. Le double comptage à fuir, c'est deux libellés
     sur un même clic — pas deux actions sur deux gestes distincts.

     Le suivi avancé des conversions a été REFUSÉ à la création. Coché par
     défaut, il autorise la balise à récupérer d'elle-même les données saisies
     dans les formulaires — l'e-mail en tête — pour les envoyer à Google. Cela
     contredirait frontalement les mentions légales, qui promettent qu'aucun
     prestataire tiers n'intervient. Ne pas le réactiver sans réécrire cette
     page. */
  googleAdsFormConversionLabel: "rRrXCN-_1uEcEIfG8r1E",

  /* Troisième action : le clic WhatsApp (ajouté le 2026-08-14). Encore vide —
     l'action n'est pas créée côté Ads. **Vide = aucun événement n'est émis au
     clic WhatsApp** : le bouton fonctionne, il n'est simplement pas compté.
     C'est le bon défaut, l'inverse (retomber sur le libellé de l'appel)
     gonflerait les conversions téléphoniques avec des événements qui n'en
     sont pas, et ferait optimiser la campagne sur un compte faux. */
  googleAdsWhatsappConversionLabel: "",

  /* Bandeau de consentement. Ne rien y promettre que la balise ne tienne :
     c'est le seul traceur du site, et il ne mesure effectivement rien d'autre
     que l'origine publicitaire des visites. */
  consent: {
    title: "Cookies de mesure publicitaire",
    desc: "On diffuse des annonces Google pour faire connaître notre activité, et un cookie nous dit si elles amènent bien des visiteurs jusqu’ici. C’est tout ce qui est mesuré, et le site fonctionne exactement pareil si vous refusez.",
    accept: "Accepter",
    refuse: "Refuser",
    more: "En savoir plus",
    reopen: "Cookies",
  },

  /* Idée du client (2026-08-14) : tout le monde n'appelle pas un inconnu du
     premier coup. Le formulaire couvre ces visiteurs-là — il ne remplace pas
     le téléphone, qui reste le premier bouton de la section. Garder cette
     hiérarchie : l'appel convertit mieux.

     ⚠️ Cette raison d'être ne doit JAMAIS transparaître dans le texte affiché
     (demande client du 2026-08-14). L'accroche disait « Pas très téléphone ? » :
     nommer la réticence du visiteur la lui rappelle, et ça sonne amateur sur un
     site commercial. Le formulaire se présente comme un second canal, offert et
     normal — jamais comme un refuge pour qui n'ose pas décrocher.

     La voix est à « on » depuis le 2026-08-18 : ils sont deux à promener, et la
     photo du binôme le montre dans « Il est entre de bonnes mains ». Jamais
     « nous », qui sonne corporate, jamais « je », qui est faux désormais. Le
     vouvoiement, lui, ne bouge pas, et le tutoiement reste proscrit. */
  contactForm: {
    eyebrow: "Par écrit",
    title: "Écrivez-nous",
    intro:
      "Décrivez-nous votre besoin en quelques mots. On répond dans la journée, par email ou par téléphone, comme vous préférez.",
    nameLabel: "Votre prénom",
    namePlaceholder: "Julie",
    contactLabel: "Votre email ou votre téléphone",
    contactPlaceholder: "julie@exemple.fr ou 06 12 34 56 78",
    messageLabel: "Votre message",
    messagePlaceholder:
      "Bonjour, j’ai un berger australien de 3 ans plutôt énergique, je cherche une balade en semaine…",
    submit: "Envoyer",
    sending: "Envoi…",
    successTitle: "C’est envoyé !",
    successDesc:
      "On vous répond dans la journée. À très vite, et une caresse à votre chien de notre part.",
    /* Un échec d'envoi ne doit jamais être un cul-de-sac : le téléphone, lui,
       ne dépend d'aucun serveur. */
    error:
      "L’envoi a échoué. Réessayez dans un instant, ou appelez-nous directement :",
    privacy:
      "Vos coordonnées nous servent uniquement à vous répondre. Elles ne sont ni revendues, ni utilisées pour de la publicité.",
    previewNotice:
      "Aperçu client : le formulaire n’envoie rien ici. Il fonctionne sur le site en ligne.",
  },

  seo: {
    // 56 caractères — mot-clé en tête, non tronqué par Google (~60 max)
    title: "Promeneur de chien à Louvres & alentours | Dog Aventure",
    // 149 caractères — la limite d'affichage est ~155-160
    description:
      "Promeneur de chien à Louvres (95) et alentours : balade individuelle, prise en charge et retour à domicile, à partir de 14,90 €. Tél. 07 45 37 50 80.",
    ogImage: "/images/og.jpg",
  },
};
