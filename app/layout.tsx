import type { Metadata } from "next";
import { Anton, Caveat, Nunito_Sans } from "next/font/google";
import Script from "next/script";
import { site } from "@/content/site.config";
import { ConsentBanner } from "@/components/layout/consent-banner";
import { ConversionTracker } from "@/components/layout/conversion-tracker";
import { adsId, conversionSendTo } from "@/lib/analytics";
import { consentBootstrap } from "@/lib/consent";
import { formatPrice } from "@/lib/utils";
import "./globals.css";

/* ── REBRAND typo : remplacer ces imports next/font suffit ── */
const display = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

/* preload: false — seule Anton (titres, 12 Ko) reste sur le chemin critique :
   précharger les 3 polices (118 Ko) retardait l'image LCP sur mobile.
   Le fallback ajusté de next/font évite tout layout shift pendant le swap. */
const body = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  // Graisses réellement utilisées uniquement : la variable complète pèse 75 Ko
  weight: ["400", "500", "600", "700"],
  preload: false,
});

const script = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.seo.title,
  description: site.seo.description,
  // Le canonical (vers le domaine réel) protège la préview GitHub Pages du
  // duplicate content — pas de noindex, qui plomberait le score SEO Lighthouse
  alternates: { canonical: "/" },
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    images: [site.seo.ogImage],
    locale: "fr_FR",
    type: "website",
  },
};

/* Fourchette dérivée des offres. Elle était écrite en dur et a menti dès le
   premier changement de tarif — ne pas y revenir. */
const prices = site.services.map((s) => s.price);

/* Les carnets sont de vraies offres : sans eux, Google ne voit qu'un tarif
   unitaire là où la page en affiche trois. */
const packUnit = site.services.find((s) => s.id === site.packs.serviceId);
const packOffers = packUnit
  ? site.packs.items.map((pack) => ({
      "@type": "Offer",
      name: `${pack.name} — ${pack.quantity} × ${packUnit.name}`,
      itemOffered: {
        "@type": "Service",
        name: packUnit.name,
        serviceType: "Promenade de chiens",
      },
      price: pack.total.toFixed(2),
      priceCurrency: "EUR",
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        value: pack.quantity,
        unitText: "balades",
      },
    }))
  : [];

/* Pas d'aggregateRating ni d'horaires : rien de réel à déclarer pour l'instant */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": site.url,
  name: site.name,
  url: site.url,
  image: `${site.url}${site.seo.ogImage}`,
  description: site.seo.description,
  telephone: site.phoneHref.replace("tel:", ""),
  priceRange: `${formatPrice(Math.min(...prices))} - ${formatPrice(Math.max(...prices))}`,
  // PropertyValue plutôt que taxID : le SIRET identifie l'établissement, ce
  // n'est pas un identifiant fiscal — nommer le référentiel lève l'ambiguïté
  identifier: {
    "@type": "PropertyValue",
    name: "SIRET",
    value: site.siret.replace(/\s/g, ""),
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: site.base.city,
    postalCode: site.base.zip,
    addressCountry: "FR",
  },
  // L'ACACED est la seule qualification vérifiable du prestataire : elle vaut
  // d'être déclarée, pour Google comme pour les assistants qui citent le site
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    name: site.trust.credential.badge,
    description: site.trust.credential.title,
    credentialCategory: "certification",
  },
  areaServed: site.towns.map((town) => ({ "@type": "City", name: town })),
  makesOffer: [
    ...site.services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        serviceType: "Promenade de chiens",
      },
      price: service.price.toFixed(2),
      priceCurrency: "EUR",
    })),
    ...packOffers,
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${body.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Refus par défaut des cookies publicitaires, AVANT tout le reste.
            <script> en clair et non next/script : celui-ci s'exécute pendant
            l'analyse du HTML, donc forcément avant gtag.js qui est chargé en
            « afterInteractive ». Cet ordre est ce qui garantit qu'aucun cookie
            n'est écrit tant que le visiteur n'a pas accepté — l'inverser rend
            tout le dispositif décoratif. */}
        {adsId && (
          <script dangerouslySetInnerHTML={{ __html: consentBootstrap() }} />
        )}
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Balise Google Ads. `afterInteractive` et pas `beforeInteractive` :
            l'image du hero est l'élément LCP, rien de tiers ne doit passer
            devant elle. Le suivi publicitaire tolère très bien ce retard. */}
        {adsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`}
              strategy="afterInteractive"
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${adsId}');`,
              }}
            />
            <ConsentBanner />
            {conversionSendTo && (
              <ConversionTracker sendTo={conversionSendTo} />
            )}
          </>
        )}
      </body>
    </html>
  );
}
