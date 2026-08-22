import Image from "next/image";
import { site } from "@/content/site.config";
import { SectionHeader } from "@/components/sections/section-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

/** Section « Ils nous font confiance » (`#chiens`) — la meute.
 *
 *  Demande client du 2026-08-22. Les photos et les légendes viennent de lui,
 *  une phrase par chien. Ce sont de vrais chiens de vrais clients : ne jamais
 *  en ajouter un « pour remplir la grille ». Elle est posée juste avant les
 *  avis Google, et un chien inventé jetterait le doute sur ceux-là aussi.
 *
 *  Tableau vide = pas de section, même convention que `#avis` : mieux vaut rien
 *  qu'un vide habillé.
 *
 *  ⚠️ L'accroche « Ils nous font confiance » servait de sur-titre à la section
 *  des avis jusqu'à ce jour. Elle lui a été retirée en même temps que cette
 *  section est née (`reviews.tsx` dit maintenant « Avis Google vérifiés ») :
 *  les deux sections se suivent, le doublon se serait lu comme un bug.
 */
export function DogsSection() {
  const { items, note } = site.dogs;
  if (items.length === 0) return null;

  return (
    // `border-b` seulement : au-dessus il y a `#zones`, qui est en `bg-ink` —
    // un filet entre du sombre et du surface ne se voit pas. Celui du bas, lui,
    // sépare le surface de la crème de `#avis`.
    <section
      id="chiens"
      className="border-b border-line bg-surface py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          align="center"
          overline="La meute"
          title={
            <>
              Ils nous font{" "}
              <span className="font-script normal-case text-flame">
                confiance
              </span>
            </>
          }
        />

        {/* Deux colonnes dès le plus petit écran, quatre à partir de `md`.
            Une seule colonne en mobile donnerait des cartes de 390 px de large
            en 3/4, soit plus de 2 000 px à faire défiler pour quatre chiens —
            exactement ce que le client ne veut pas. */}
        <Stagger
          stagger={0.1}
          className="mx-auto grid max-w-5xl grid-cols-2 gap-5 md:grid-cols-4"
        >
          {items.map((dog) => (
            <StaggerItem key={dog.id} y={20} className="h-full">
              <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-cream">
                {/* 900 × 1200 pour tout le monde : les quatre sources sont
                    exactement en 3/4 (cf. la table `PHOTOS` de
                    scripts/prepare-photos.js), ces dimensions ne servent qu'à
                    fixer le rapport, la largeur réelle vient de `sizes`. Un
                    ratio commun est ce qui aligne les prénoms d'une carte à
                    l'autre. */}
                <Image
                  src={dog.image}
                  alt={dog.alt}
                  width={900}
                  height={1200}
                  sizes="(min-width: 768px) 245px, calc(50vw - 2rem)"
                  className="h-auto w-full"
                />
                <figcaption className="flex flex-1 flex-col gap-1.5 p-5">
                  <span className="font-display text-xl uppercase tracking-tight">
                    {dog.name}
                  </span>
                  {dog.caption && (
                    <span className="text-sm leading-relaxed text-smoke">
                      {dog.caption}
                    </span>
                  )}
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>

        {note && (
          <Reveal delay={0.1}>
            <p className="mt-12 text-center font-script text-3xl leading-snug text-balance text-flame md:text-4xl">
              {note}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
