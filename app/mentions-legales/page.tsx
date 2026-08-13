import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyCallBar } from "@/components/layout/sticky-call-bar";
import { site } from "@/content/site.config";
import { adsId } from "@/lib/analytics";

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

          <Section title="Données personnelles">
            <p>
              Ce site ne comporte <strong className="font-semibold text-ink">aucun
              formulaire</strong>&nbsp;: la réservation se fait uniquement par
              téléphone ou par SMS. Aucun compte, aucune inscription, aucune
              donnée n&rsquo;est demandée pour consulter ces pages.
            </p>
            <p>
              Les informations que vous communiquez lors d&rsquo;un appel ou d&rsquo;un
              SMS (nom, coordonnées, informations sur votre chien) servent
              uniquement à organiser la prestation. Vous pouvez en demander
              l&rsquo;accès, la rectification ou la suppression au {site.phone}.
            </p>
          </Section>

          {/* Section rendue seulement s'il y a réellement une balise : sans
              elle, le site ne dépose rien et cette page n'a pas à parler de
              cookies. Elle a affirmé le contraire pendant une journée, le temps
              que la balise soit posée sans que le texte suive — d'où le lien
              direct entre les deux, pour que ça ne se reproduise pas. */}
          {adsId && (
            <Section title="Cookies">
              <p>
                Ce site utilise la balise Google Ads (
                <span className="font-mono text-sm">{adsId}</span>)
                dans un seul but&nbsp;: savoir si les annonces diffusées sur
                Google amènent effectivement des visiteurs jusqu&rsquo;ici. Aucune
                autre mesure d&rsquo;audience n&rsquo;est installée, et aucun profil
                publicitaire n&rsquo;est constitué pour le compte de{" "}
                {site.name}.
              </p>
              <p>
                <strong className="font-semibold text-ink">
                  Aucun cookie publicitaire n&rsquo;est déposé tant que vous
                  n&rsquo;avez pas accepté.
                </strong>{" "}
                Le mode Consentement de Google est réglé sur «&nbsp;refusé&nbsp;»
                par défaut&nbsp;: tant que vous n&rsquo;avez pas répondu au bandeau,
                ou si vous refusez, la balise fonctionne sans écrire quoi que ce
                soit sur votre appareil et sans identifiant.
              </p>
              <p>
                Si vous acceptez, un cookie <span className="font-mono text-sm">_gcl_au</span>{" "}
                est déposé par Google pour une durée de 90&nbsp;jours. Vous pouvez
                revenir sur votre choix à tout moment&nbsp;: le lien{" "}
                <strong className="font-semibold text-ink">
                  «&nbsp;{site.consent.reopen}&nbsp;»
                </strong>{" "}
                en bas de chaque page rouvre le bandeau. Refuser est aussi simple
                qu&rsquo;accepter, et le site fonctionne à l&rsquo;identique dans les
                deux cas.
              </p>
            </Section>
          )}
        </div>
      </main>
      <Footer />
      <StickyCallBar />
    </>
  );
}
