"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Phone, TreePine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site.config";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "La promenade", href: "#service" },
  { label: "Les chiens", href: "#chiens" },
  { label: "Où j'interviens", href: "#zones" },
  { label: "Avis", href: "#avis" },
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
        {/* Logo texte — en attendant le logo définitif du client */}
        <a href="#" className="flex items-center gap-2.5">
          <TreePine className="size-6 text-flame" aria-hidden />
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
                href="#contact"
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
