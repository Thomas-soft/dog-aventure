"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site.config";

/** Barre d'appel fixe sur mobile — apparaît une fois le hero dépassé */
export function StickyCallBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 88 }}
          animate={{ y: 0 }}
          exit={{ y: 88 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-cream/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden"
        >
          <div className="flex gap-3">
            <Button
              nativeButton={false}
              render={<a href={site.phoneHref} />}
              className="h-11 flex-1 rounded-full text-base font-semibold"
            >
              <Phone data-icon="inline-start" />
              Appeler
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<a href={site.smsHref} />}
              className="h-11 flex-1 rounded-full border-ink bg-transparent text-base font-semibold hover:border-flame hover:bg-flame hover:text-primary-foreground"
            >
              <MessageCircle data-icon="inline-start" />
              SMS
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
