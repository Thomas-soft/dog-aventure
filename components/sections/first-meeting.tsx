import { Gift } from "lucide-react";
import { site } from "@/content/site.config";
import { Reveal } from "@/components/motion/reveal";

/**
 * « Première rencontre offerte » — bandeau de fin de la section « La promenade ».
 *
 * Placé APRÈS les carnets, donc après tous les prix de la page, et juste avant
 * le formulaire : c'est le seul endroit où « gratuite et sans engagement »
 * répond à une objection que le visiteur vient réellement de se poser. Le
 * remonter au-dessus des offres le transformerait en information de plus.
 *
 * Fond sombre, à la différence du reste de la section : il ferme le bloc
 * crème → surface → crème sur un contraste, et c'est le seul argument de la
 * section qui ne se lit pas comme un tarif. Ne pas le passer en carte claire,
 * il se fondrait dans les carnets qui le précèdent immédiatement.
 *
 * ⚠️ Ce n'est PAS la « visite à domicile » retirée du site le 2026-08-10 :
 * celle-là était une prestation payante que le client n'avait ni tarifée ni
 * décrite, celle-ci est un préalable gratuit à la première balade. La règle
 * « le site ne vend que des balades » tient toujours.
 */
export function FirstMeeting() {
  const { firstMeeting } = site;

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
            {firstMeeting.title}
          </h3>

          {firstMeeting.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 leading-relaxed text-cream/75">
              {paragraph}
            </p>
          ))}

          {/* Sortie du corps du texte : c'est la phrase qui lève l'objection,
              elle doit être lisible sans lire les deux paragraphes du dessus. */}
          <p className="mt-5 font-script text-2xl leading-snug text-leaf">
            {firstMeeting.note}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
