import { site } from "@/content/site.config";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/sections/contact-form";

/** Le formulaire, quatrième bloc de la page (ordre demandé le 2026-08-16).
 *
 *  Il vient APRÈS « Il est entre de bonnes mains » et après les deux offres :
 *  Martin veut qu'on rassure et qu'on annonce le prix avant de demander
 *  d'écrire. Cet ordre remplace celui du 2026-08-14, qui remontait le
 *  formulaire juste sous le hero pour éviter de faire défiler la page.
 *
 *  C'est cette section qui porte l'ancre `#contact` — donc le bouton de la
 *  barre de navigation, le lien du menu mobile et celui du pied de page
 *  arrivent tous ici. La section de bas de page (`#reserver`) garde l'appel et
 *  le SMS : elle conclut, celle-ci capte l'intention en milieu de page.
 *
 *  Les trois repères de réassurance sous le formulaire ont été posés le
 *  2026-08-14 parce que le visiteur, à l'époque, n'avait encore rien lu à cet
 *  endroit. Ils gardent leur intérêt dans le nouvel ordre — un rappel au point
 *  d'action, là où on demande un effort — mais ce n'est plus un contrepoids
 *  indispensable : les retirer serait désormais discutable, plus fautif.
 *
 *  Les trois repères sont repris MOT POUR MOT de `site.trust` — aucune
 *  formulation n'est inventée ici (consigne client : ne pas réécrire les
 *  textes du site), et la section Confiance reste la source unique de ces
 *  informations : elles ne peuvent pas diverger.
 *
 *  Fond sombre obligatoire : le formulaire est stylé pour ça (`bg-cream/5`,
 *  `text-cream`, `placeholder:text-cream/35`). Sur un fond clair, les champs
 *  deviendraient illisibles — c'est le composant qu'il faudrait reprendre,
 *  pas seulement la carte.
 */
export function ContactFormSection() {
  const { credential, insurance, points } = site.trust;

  const reassurance = [
    credential.badge,
    insurance?.title,
    points[0]?.title,
  ].filter((v): v is string => Boolean(v));

  return (
    // ⚠️ Marges asymétriques, et c'est voulu. Au-dessus, les offres apportent
    // déjà leur `pb-24 md:pb-32` de crème : un `pt` court suffit. En dessous en
    // revanche, `#zones` commence par un aplat SOMBRE — son propre `py` est
    // rempli de sombre et n'écarte rien. Le `pb` de cette section est donc la
    // seule crème entre la carte sombre et le bandeau sombre ; à 4/8 (la valeur
    // d'avant le 2026-08-16, quand un bandeau de villes très fin précédait la
    // section) les deux blocs se touchaient presque.
    <section id="contact" className="px-4 pt-4 pb-24 sm:px-6 md:pt-8 md:pb-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="rounded-[2.5rem] bg-ink px-6 py-12 text-center text-cream md:py-16">
            <div className="mx-auto flex max-w-2xl flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-leaf">
                {site.contactForm.eyebrow}
              </span>
              <h2 className="mt-3 font-display text-3xl uppercase tracking-tight sm:text-4xl">
                {site.contactForm.title}
              </h2>
              <p className="mx-auto mt-3 mb-8 max-w-md leading-relaxed text-cream/70">
                {site.contactForm.intro}
              </p>

              <ContactForm />

              {/* Repères de réassurance, au plus près du champ à remplir.
                  `aria-hidden` sur les séparateurs seulement : les libellés,
                  eux, sont du contenu. */}
              <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-cream/55">
                {reassurance.map((item, i) => (
                  <li key={item} className="flex items-center gap-3">
                    {i > 0 && (
                      <span className="size-1 rounded-full bg-cream/30" aria-hidden />
                    )}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
