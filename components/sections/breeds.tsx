import Image from "next/image";
import { site } from "@/content/site.config";
import { SectionHeader } from "@/components/sections/section-header";
import { BlurFade } from "@/components/fx/blur-fade";

export function BreedsSection() {
  return (
    <section id="chiens" className="border-y border-line bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          overline="Les chiens du secteur"
          title={
            <>
              Votre chien va{" "}
              <span className="font-script normal-case text-flame">
                se reconnaître
              </span>
            </>
          }
          sub="Golden, Berger Australien, Staffy, Caniche… Sportif infatigable ou petit joueur, chaque balade est adaptée à son rythme et à son caractère."
        />

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-4">
          {site.breeds.map((breed, i) => (
            <BlurFade key={breed.name} delay={i * 0.12} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={breed.image}
                  alt={breed.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-3 pt-10 sm:p-4 sm:pt-14">
                  <p className="font-display text-base uppercase tracking-wide text-cream sm:text-xl">
                    {breed.name}
                  </p>
                </div>
              </div>
              {breed.note && (
                <p className="mt-3 hidden text-sm leading-relaxed text-smoke sm:block">
                  {breed.note}
                </p>
              )}
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
