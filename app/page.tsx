import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyCallBar } from "@/components/layout/sticky-call-bar";
import { Hero } from "@/components/sections/hero";
import { TownsMarquee } from "@/components/sections/towns-marquee";
import { ServiceSection } from "@/components/sections/service";
import { TrustSection } from "@/components/sections/trust";
import { ZonesSection } from "@/components/sections/zones";
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
        {/* Le formulaire juste sous le hero : demande client du 2026-08-14,
            « pas beaucoup scroller ». La section de réservation (appel + SMS)
            reste en fin de page pour conclure. */}
        <ContactFormSection />
        <ServiceSection />
        <TrustSection />
        <ZonesSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
      <StickyCallBar />
    </>
  );
}
