import type { Metadata } from "next";
import { Anton, Caveat, Nunito_Sans } from "next/font/google";
import { site } from "@/content/site.config";
import "./globals.css";

/* ── REBRAND typo : remplacer ces imports next/font suffit ── */
const display = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const body = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const script = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.seo.title,
  description: site.seo.description,
  alternates: { canonical: "/" },
  // La préview GitHub Pages ne doit pas être indexée (doublon du futur site réel)
  ...(process.env.GITHUB_PAGES === "true" && {
    robots: { index: false, follow: false },
  }),
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    images: [site.seo.ogImage],
    locale: "fr_FR",
    type: "website",
  },
};

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
  priceRange: "€",
  address: {
    "@type": "PostalAddress",
    addressLocality: site.base.city,
    postalCode: site.base.zip,
    addressCountry: "FR",
  },
  areaServed: site.towns.map((town) => ({ "@type": "City", name: town })),
  makesOffer: site.services.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service.name,
      serviceType: "Promenade de chiens",
    },
    price: service.price.toFixed(2),
    priceCurrency: "EUR",
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${body.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
