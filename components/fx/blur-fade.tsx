"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";

/* Adapté de Magic UI (BlurFade) — reveal photo avec flou, motion/react */

export function BlurFade({
  children,
  className,
  duration = 0.6,
  delay = 0,
  offset = 16,
  direction = "up",
  blur = "8px",
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  offset?: number;
  direction?: "up" | "down" | "left" | "right";
  blur?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  const isX = direction === "left" || direction === "right";
  const sign = direction === "down" || direction === "right" ? -1 : 1;

  const variants: Variants = {
    hidden: reduce
      ? { opacity: 1 }
      : {
          x: isX ? offset * sign : 0,
          y: isX ? 0 : offset * sign,
          opacity: 0,
          filter: `blur(${blur})`,
        },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay, duration, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
