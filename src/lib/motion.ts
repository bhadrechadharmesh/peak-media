import type { Variants } from "framer-motion";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const viewportOnce = { once: true, margin: "-80px" } as const;
export const viewportAlways = { once: false, margin: "-80px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

export const fromLeft: Variants = {
  hidden: { opacity: 0, x: -36 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

export const fromRight: Variants = {
  hidden: { opacity: 0, x: 36 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

/** Word-by-word reveal for headings */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};
