import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyCallBar } from "@/components/layout/sticky-call-bar";
import { Hero } from "@/components/sections/hero";
import { TownsMarquee } from "@/components/sections/towns-marquee";
import { ServiceSection } from "@/components/sections/service";
import { TrustSection } from "@/components/sections/trust";
import { ZonesSection } from "@/components/sections/zones";
import { DogsSection } from "@/components/sections/dogs";
import { ReviewsSection } from "@/components/sections/reviews";
import { ContactSection } from "@/components/sections/contact";
import { ContactFormSection } from "@/components/sections/contact-form-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TownsMarquee />
        {/* Ordre demandé par Martin le 2026-08-16 : d'abord la confiance
            (« Il est entre de bonnes mains »), ensuite les deux offres, et le
            formulaire seulement après — on rassure et on affiche le prix avant
            de demander d'écrire. Il remplace la remontée du 2026-08-14 qui
            plaçait le formulaire juste sous le hero. La section de réservation
            (appel + SMS) reste en fin de page pour conclure. */}
        <TrustSection />
        {/* La meute AVANT les tarifs (demande client du 2026-08-22, en
            remplacement de sa place initiale entre `#zones` et `#avis`) :
            on montre les chiens qu'on promène, ensuite seulement le prix.
            Elle prolonge la réassurance de `#confiance` sur un ton plus léger
            et sert de respiration avant les deux cartes d'offres. */}
        <DogsSection />
        <ServiceSection />
        <ContactFormSection />
        <ZonesSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
      <StickyCallBar />
    </>
  );
}
