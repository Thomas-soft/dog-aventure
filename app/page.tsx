import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyCallBar } from "@/components/layout/sticky-call-bar";
import { Hero } from "@/components/sections/hero";
import { TownsMarquee } from "@/components/sections/towns-marquee";
import { ServiceSection } from "@/components/sections/service";
import { BreedsSection } from "@/components/sections/breeds";
import { ZonesSection } from "@/components/sections/zones";
import { ReviewsSection } from "@/components/sections/reviews";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TownsMarquee />
        <ServiceSection />
        <BreedsSection />
        <ZonesSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
      <StickyCallBar />
    </>
  );
}
