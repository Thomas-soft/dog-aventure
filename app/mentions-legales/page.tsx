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

          {/* Obligation d'information sur les avis en ligne (art. L111-7-2 du
              code de la consommation, issu de la directive Omnibus) : dès qu'un
              professionnel affiche des avis de consommateurs, il doit indiquer
              s'ils font l'objet d'un contrôle, et depuis quand ils datent.

              ⚠️ Ce texte a été réécrit le 2026-08-16 : il annonçait des avis
              « récupérés en temps réel », ce qui a cessé d'être vrai quand la
              lecture directe de la Places API a été retirée. Il décrit
              maintenant ce que fait réellement le site — une reprise manuelle,
              donc datée. **Ne pas toucher à `site.reviews` sans relire ce
              paragraphe**, et mettre le mois à jour à chaque ajout d'avis. */}
          <Section title="Avis des clients">
            <p>
              Les avis affichés sur ce site sont{" "}
              <strong className="font-semibold text-ink">
                repris de la fiche Google
              </strong>{" "}
              de l&rsquo;établissement et reproduits{" "}
              <strong className="font-semibold text-ink">
                mot pour mot
              </strong>, sans correction ni sélection. Chaque avis renvoie vers
              sa source, où il peut être consulté, comparé et signalé.
            </p>
            <p>
              Il s&rsquo;agit d&rsquo;une reprise manuelle, mise à jour au{" "}
              <strong className="font-semibold text-ink">mois d&rsquo;août
              2026</strong>&nbsp;: la fiche Google peut donc comporter des avis
              plus récents que ceux affichés ici. Elle fait foi.
            </p>
            <p>
              Ces avis <strong className="font-semibold text-ink">ne font
              l&rsquo;objet d&rsquo;aucun contrôle</strong> de la part de
              l&rsquo;éditeur, qui n&rsquo;est pas en mesure de vérifier que
              leurs auteurs ont eu recours au service. Aucune contrepartie
              n&rsquo;est offerte en échange d&rsquo;un avis.
            </p>
          </Section>

          <Section title="Données personnelles">
            <p>
              Consulter ces pages ne demande <strong className="font-semibold text-ink">
              aucune donnée</strong>&nbsp;: ni compte, ni inscription.
            </p>
            <p>
              Le formulaire de contact recueille trois informations&nbsp;: votre{" "}
              <strong className="font-semibold text-ink">prénom</strong>, votre{" "}
              <strong className="font-semibold text-ink">email ou votre
              téléphone</strong> (au choix) et votre{" "}
              <strong className="font-semibold text-ink">message</strong>. Elles
              servent uniquement à vous répondre et à organiser la promenade. Elles
              ne sont ni revendues, ni cédées, ni utilisées pour vous adresser de
              la publicité.
            </p>
            <p>
              Le message est transmis à {legal.publisher || "l’éditeur du site"},
              seul destinataire. Il ne transite que par le serveur qui héberge ce
              site&nbsp;: <strong className="font-semibold text-ink">aucun
              prestataire tiers</strong> n&rsquo;intervient dans cette
              transmission. Les messages sont conservés le temps de traiter la
              demande, puis un an au plus.
            </p>
            <p>
              Les informations communiquées lors d&rsquo;un appel ou d&rsquo;un SMS
              (nom, coordonnées, informations sur votre chien) suivent les mêmes
              règles.
            </p>
            <p>
              Vous pouvez à tout moment demander l&rsquo;accès à ces données, leur
              rectification ou leur suppression, au {site.phone}
              {legal.email ? ` ou à ${legal.email}` : ""}.
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
