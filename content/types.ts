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

/** La rencontre à domicile offerte, rendue en bandeau au bas de « La promenade ».
 *
 *  ⚠️ Ce n'est PAS la « visite à domicile » écartée du site le 2026-08-10 :
 *  celle-là était une prestation payante que le client n'avait ni tarifée ni
 *  décrite, celle-ci est un préalable gratuit à la première balade. Ne pas les
 *  confondre en relisant la règle « le site ne vend que des balades ».
 *
 *  `paragraphs` plutôt qu'un seul champ : le texte vient du client en trois
 *  blocs, et les recoller en un pavé rendrait le bandeau illisible. */
export interface FirstMeeting {
  title: string;
  paragraphs: string[];
  /** La phrase qui lève l'objection — mise en avant, séparée du corps */
  note: string;
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

/** Un chien de la meute, affiché dans la galerie `#chiens`.
 *
 *  Ce sont de VRAIS chiens de clients, photographiés par le promeneur, et les
 *  légendes sont de la main du client — une phrase par chien, sur son
 *  caractère. Ne pas en inventer un « pour équilibrer la grille » : le jour où
 *  un maître reconnaît un chien qui n'a jamais été promené, c'est toute la
 *  galerie qui devient suspecte, avis Google compris (ils sont juste en
 *  dessous). Un chien sans légende se rend très bien — le champ est optionnel
 *  exactement pour ça.
 *
 *  ⚠️ Ce sont les chiens de tiers : leur maître doit être d'accord pour que la
 *  photo soit publiée. C'est au client de l'obtenir, pas à nous de le supposer. */
export interface Dog {
  /** Identifiant stable (kebab-case) — sert de clé de rendu */
  id: string;
  name: string;
  /** La phrase du client sur ce chien. Optionnelle : un chien peut arriver
   *  avant sa légende, sa carte se rend alors avec le seul prénom. */
  caption?: string;
  /** Chemin de la photo, en 3/4 — variantes générées par
   *  scripts/prepare-photos.js. Le format est commun aux quatre cartes : une
   *  photo au ratio différent casserait l'alignement de la grille. */
  image: string;
  alt: string;
}

/** La galerie « Ils nous font confiance ». Tableau vide = section masquée,
 *  même convention que `reviews`. */
export interface Dogs {
  items: Dog[];
  /** Ligne de clôture sous la grille — la meute ne se limite pas aux photos
   *  affichées. Rendue en manuscrit, comme la signature de `#confiance`. */
  note?: string;
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
 *  ⚠️ CE SONT DE VRAIS AVIS, RECOPIÉS DE LA FICHE GOOGLE — jamais des avis
 *  écrits pour le site. Les quatre avis inventés (noms, villes, chiens) qui
 *  vivaient ici jusqu'au 2026-08-16 ont été supprimés : diffuser de faux avis
 *  de consommateurs est une pratique commerciale trompeuse, et le site est
 *  commercial et alimenté par de la publicité payante. N'ajouter ici que ce
 *  qui existe vraiment sur la fiche, **mot pour mot**, fautes de frappe
 *  comprises — corriger l'orthographe d'un client, c'est déjà réécrire son avis.
 *
 *  `town` et `dog` ne sont plus renseignés : Google ne fournit ni la ville du
 *  client ni le nom de son chien, et les inventer reviendrait à fabriquer du
 *  détail crédible autour d'un avis réel. Champs conservés au cas où un client
 *  fournirait lui-même l'information, pas pour être remplis d'office. */
export interface Review {
  author: string;
  /** Ville du propriétaire — non fournie par Google, ne pas inventer */
  town?: string;
  /** Le chien concerné — non fourni par Google, ne pas inventer */
  dog?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** Photo de profil de l'auteur, **en lien direct vers `lh3.googleusercontent.com`**.
   *
   *  Volontairement pas de copie dans `public/` : réhéberger la photo d'une
   *  cliente en ferait un exemplaire qui survivrait à la suppression de son
   *  compte. En lien direct, si elle change ou retire sa photo, le site suit.
   *  Contrepartie assumée : l'URL peut donc mourir — les initiales sont
   *  dessinées dessous et réapparaissent seules si l'image ne charge pas.
   *
   *  Sert en `<img>` nu, jamais en `next/image` : l'optimiseur en mettrait une
   *  copie en cache sur le serveur, ce qui reviendrait à la réhéberger.
   *  Demande `img-src https://lh3.googleusercontent.com` dans la CSP. */
  avatarUrl?: string;
  /** Badge « Local Guide » de Google. C'est un statut, pas un compteur : il ne
   *  bouge quasiment jamais, contrairement au « 27 avis · 28 photos » affiché
   *  à côté sur Maps, qui serait périmé dès la copie. */
  localGuide?: boolean;
  /** Provenance de l'avis. **À renseigner dès que l'avis vient de Google** :
   *  la mention de la date de visite et le lien vers la source sont ce qui
   *  permet à un visiteur de vérifier, et ce que les mentions légales
   *  promettent. Un avis sans `source` est un avis invérifiable. */
  source?: ReviewSource;
}

export interface ReviewSource {
  /** L'avis sur Google Maps, ou à défaut la fiche — le chemin vers la source */
  reviewUrl?: string;
  /** « août 2026 », tel qu'affiché par Google sous l'avis */
  visitDate?: string;
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
  /** La rencontre à domicile offerte, en bas de « La promenade » */
  firstMeeting: FirstMeeting;
  /** Arguments de confiance — section « Pourquoi nous confier votre chien » */
  trust: Trust;
  /** Les chiens de la meute, galerie `#chiens` — juste avant les avis :
   *  d'abord les chiens, ensuite ce que leurs maîtres en disent. */
  dogs: Dogs;
  /** Avis affichés dans `#avis`. Tableau vide = section masquée. */
  reviews: Review[];
  /** La fiche Google, pour le lien « voir les avis sur Google » sous la
   *  section. C'est la source que les mentions légales annoncent. */
  googleProfileUrl?: string;
  social: { instagram?: string; facebook?: string };
  /** Crédit du réalisateur, barre du bas. Rendu en lien seulement si `url`
   *  est renseignée — sinon en texte simple, pour éviter un href="#" mort. */
  credits: { label: string; url?: string };
  images: {
    hero: string;
    heroAlt: string;
    /** Le binôme, section « Il est entre de bonnes mains ». Vide ou absent =
     *  la section se rend sans photo, sans trou dans la mise en page. */
    team?: string;
    teamAlt?: string;
    /** La balade en forêt — ouvre la section « La promenade », juste avant les
     *  tarifs. C'est la seule photo du site qui montre la prestation en train
     *  de se faire, et le t-shirt y porte le numéro de téléphone. Absente = la
     *  section démarre directement sur les offres. */
    walk?: string;
    walkAlt?: string;
    /** Le chien qui vient chercher une caresse, au bas de la carte
     *  « Comment ça marche ? » — à hauteur des tarifs. Absente = la carte se
     *  referme sur sa phrase manuscrite, sans trou. */
    greeting?: string;
    greetingAlt?: string;
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
