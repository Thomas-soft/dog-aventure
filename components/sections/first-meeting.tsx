import { Gift } from "lucide-react";
import { site } from "@/content/site.config";
import type { FirstMeeting as FirstMeetingContent } from "@/content/types";
import { Reveal } from "@/components/motion/reveal";
import { RichText } from "@/components/ui/rich-text";

/**
 * « Première rencontre offerte » — bandeau de fin de la section « Il est entre
 * de bonnes mains » (`#confiance`).
 *
 * Déplacé le 2026-08-19, à la demande du client : Martin la veut haut dans la
 * page. Elle fermait jusque-là la section « La promenade », après tous les
 * prix — l'argument « gratuite et sans engagement » y répondait à une objection
 * de tarif que le visiteur venait de se poser. Ce ressort est perdu ; ce qu'on
 * gagne à la place, c'est qu'elle se lit désormais comme le dernier argument de
 * réassurance et le premier pas concret : on se rencontre AVANT que le chien
 * soit confié, et avant que le moindre prix soit annoncé. Chronologiquement,
 * c'est aussi le bon ordre.
 *
 * Elle ferme la section, après la phrase manuscrite : deux lignes en script
 * l'une derrière l'autre (la `note` du bandeau puis la signature) se
 * concurrenceraient si on l'insérait avant.
 *
 * Fond sombre, seul de la section : il tranche sur le `bg-surface` du bloc et
 * sur les cartes crème, et il marque la fin de la réassurance avant les tarifs.
 * Ne pas le passer en carte claire, il se fondrait dans les quatre points.
 *
 * ⚠️ Ce n'est PAS la « visite à domicile » retirée du site le 2026-08-10 :
 * celle-là était une prestation payante que le client n'avait ni tarifée ni
 * décrite, celle-ci est un préalable gratuit à la première balade. La règle
 * « le site ne vend que des balades » tenait jusqu'au 2026-10-08 ; depuis, la
 * garde et la sortie collective ont leur page, et chacune passe ici son propre
 * texte (`content`). Sans argument, c'est celui de l'accueil.
 */
export function FirstMeeting({
  content = site.firstMeeting,
}: {
  content?: FirstMeetingContent;
}) {
  const firstMeeting = content;

  return (
    <Reveal className="mt-14">
      <div className="flex flex-col gap-6 rounded-3xl bg-ink p-7 text-cream md:flex-row md:items-start md:gap-8 md:p-10">
        <span
          className="grid size-12 shrink-0 place-items-center rounded-full bg-leaf text-ink"
          aria-hidden
        >
          <Gift className="size-6" />
        </span>

        <div className="max-w-2xl">
          <h3 className="font-display text-2xl uppercase tracking-tight md:text-3xl">
            <RichText text={firstMeeting.title} />
          </h3>

          {firstMeeting.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 leading-relaxed text-cream/75">
              <RichText text={paragraph} strongClassName="text-cream" />
            </p>
          ))}

          {/* Sortie du corps du texte : c'est la phrase qui lève l'objection,
              elle doit être lisible sans lire les deux paragraphes du dessus. */}
          {firstMeeting.note && (
            <p className="mt-5 font-script text-2xl leading-snug text-leaf">
              <RichText text={firstMeeting.note} />
            </p>
          )}
        </div>
      </div>
    </Reveal>
  );
}
