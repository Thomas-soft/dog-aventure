"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site.config";
import { asset, cn } from "@/lib/utils";

/* Ancres absolues, parce que la barre est aussi rendue sur /mentions-legales
   où un « #service » nu ne mènerait nulle part. <a> et non next/link : un
   Link vers « /#service » depuis l'accueil change l'URL sans défiler
   (vérifié au navigateur). Avec un <a>, seul le fragment diffère de l'URL
   courante — le navigateur fait un saut d'ancre natif, donc doux via le
   `scroll-smooth` du CSS — et depuis la page légale c'est une vraie
   navigation. asset() ajoute le basePath, que Next ne met pas ici. */
const NAV = [
  { label: "La promenade", href: asset("/#service") },
  { label: "Où j'interviens", href: asset("/#zones") },
  { label: "Avis", href: asset("/#avis") },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-line bg-cream/90 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* « /# » plutôt que « / » : depuis l'accueil, seul le fragment change
            et le navigateur remonte en haut, comme avant. Depuis la page
            légale, c'est un retour à l'accueil. */}
        <a href={asset("/#")} className="flex items-center gap-2.5">
          {/* Marque seule : à 40 px, le texte en arc du logo complet ne serait
              qu'un anneau de taches. alt vide — le nom est déjà dans le texte
              à côté. Fichier plutôt qu'inline : la barre étant un composant
              client, un SVG inline pèserait deux fois (HTML + bundle JS).
              h-10 w-auto et non size-10 : la marque n'est pas carrée (1,243). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(site.images.logoMark)}
            alt=""
            width={50}
            height={40}
            className="h-10 w-auto shrink-0"
          />
          <span className="flex flex-col">
            <span className="font-display text-lg uppercase leading-none tracking-wide">
              {site.name}
            </span>
            <span className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-smoke">
              {site.activity}
            </span>
          </span>
        </a>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Navigation principale"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {item.label}
              <span
                className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-flame transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            nativeButton={false}
            render={<a href={site.phoneHref} aria-label={`Appeler le ${site.phone}`} />}
            className="rounded-full font-semibold max-sm:size-9 max-sm:p-0 sm:px-4"
          >
            <Phone className="sm:hidden" />
            <Phone data-icon="inline-start" className="max-sm:hidden" />
            <span className="max-sm:hidden">{site.phone}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden md:hidden"
            aria-label="Navigation mobile"
          >
            <div className="flex flex-col gap-1 px-4 pb-4">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-surface hover:text-ink"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={asset("/#contact")}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-surface hover:text-ink"
              >
                Contact
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
