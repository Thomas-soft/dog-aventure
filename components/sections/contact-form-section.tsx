import { site } from "@/content/site.config";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/sections/contact-form";

/** Le formulaire, remonté juste sous le hero (demande client du 2026-08-14).
 *
 *  Martin ne veut pas que le visiteur ait à faire défiler la page pour
 *  écrire. C'est cette section qui porte désormais l'ancre `#contact` — donc
 *  le bouton de la barre de navigation, le lien du menu mobile et celui du
 *  pied de page arrivent tous ici. La section de bas de page (`#reserver`)
 *  garde l'appel et le SMS : elle conclut, celle-ci capte l'intention
 *  immédiate.
 *
 *  ⚠️ Contrepartie assumée, et c'est exactement le rôle des repères de
 *  réassurance ci-dessous : à cette hauteur, le visiteur n'a encore lu ni les
 *  tarifs, ni la section Confiance. Lui demander d'écrire sans lui avoir donné
 *  une seule raison de faire confiance serait un formulaire vide. Les retirer
 *  vide la section de son contrepoids.
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
    <section id="contact" className="px-4 pb-4 pt-16 sm:px-6 md:pb-8 md:pt-24">
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
