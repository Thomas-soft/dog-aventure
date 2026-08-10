import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyCallBar } from "@/components/layout/sticky-call-bar";
import { site } from "@/content/site.config";

export const metadata: Metadata = {
  title: `Mentions légales | ${site.name}`,
  description: `Mentions légales de ${site.name}, promeneur de chien à ${site.base.city} (${site.base.zip}) — éditeur, hébergeur, SIRET et données personnelles.`,
  alternates: { canonical: "/mentions-legales" },
};

/* Un champ vide se voit : mieux vaut un « [à compléter] » en clair qu'une
   ligne manquante qu'on ne remarquera jamais. Les valeurs attendues sont
   listées dans la checklist de CLAUDE.md. */
function Value({ children }: { children?: string }) {
  return children ? (
    <>{children}</>
  ) : (
    <span className="italic text-smoke/60">[à compléter]</span>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl uppercase tracking-tight">{title}</h2>
      <div className="space-y-2 leading-relaxed text-smoke">{children}</div>
    </section>
  );
}

export default function MentionsLegales() {
  const { legal } = site;

  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 pb-24 pt-32 sm:px-6 md:pt-40">
        <div className="mx-auto max-w-3xl space-y-10">
          <header className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-flame">
              Informations légales
            </p>
            <h1 className="font-display text-4xl uppercase leading-tight tracking-tight md:text-5xl">
              Mentions légales
            </h1>
          </header>

          <Section title="Éditeur du site">
            <p>
              <strong className="font-semibold text-ink">{site.name}</strong> —{" "}
              {site.activity.toLowerCase()}, entreprise individuelle.
            </p>
            <p>
              Responsable&nbsp;: <Value>{legal.publisher}</Value>
              <br />
              Adresse&nbsp;: <Value>{legal.address}</Value>
              <br />
              Téléphone&nbsp;:{" "}
              <a href={site.phoneHref} className="transition-colors hover:text-ink">
                {site.phone}
              </a>
              <br />
              E-mail&nbsp;: <Value>{legal.email}</Value>
              <br />
              SIRET&nbsp;:{" "}
              <strong className="font-semibold text-ink">{site.siret}</strong>
            </p>
            <p>
              Activité exercée à {site.base.city} ({site.base.zip}),{" "}
              {site.base.region}, et dans les communes alentour.
            </p>
          </Section>

          <Section title="Responsable de la publication">
            <p>
              <Value>{legal.publisher}</Value>, en qualité de responsable de la
              publication au sens de l&rsquo;article 6-III de la loi n°&nbsp;2004-575
              du 21 juin 2004 pour la confiance dans l&rsquo;économie numérique.
            </p>
          </Section>

          <Section title="Hébergement">
            <p>
              Le site est hébergé par <Value>{legal.host}</Value>
              {legal.hostAddress && <>, {legal.hostAddress}</>}.
            </p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>
              Le logo, les textes et les photographies présents sur ce site sont
              protégés par le droit d&rsquo;auteur. Toute reproduction ou
              réutilisation, totale ou partielle, sans autorisation écrite
              préalable est interdite.
            </p>
          </Section>

          <Section title="Données personnelles et cookies">
            <p>
              Ce site ne comporte <strong className="font-semibold text-ink">aucun
              formulaire</strong>&nbsp;: la réservation se fait uniquement par
              téléphone ou par SMS. Aucune donnée personnelle n&rsquo;est collectée
              ni stockée lors de votre visite.
            </p>
            <p>
              Aucun cookie n&rsquo;est déposé sur votre appareil, et aucun outil de
              mesure d&rsquo;audience ou de suivi publicitaire n&rsquo;est installé.
            </p>
            <p>
              Les informations que vous communiquez lors d&rsquo;un appel ou d&rsquo;un
              SMS (nom, coordonnées, informations sur votre chien) servent
              uniquement à organiser la prestation. Vous pouvez en demander
              l&rsquo;accès, la rectification ou la suppression au {site.phone}.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
      <StickyCallBar />
    </>
  );
}
