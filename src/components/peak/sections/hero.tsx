"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Eye, TrendingUp } from "lucide-react";
import { MagneticButton } from "@/components/peak/ui/magnetic-button";
import { Reveal } from "@/components/peak/ui/reveal";
import { cn } from "@/lib/utils";
import { stagger, wordReveal, EASE_OUT } from "@/lib/motion";

const HEADLINE = [
  { text: "We", accent: false },
  { text: "engineer", accent: false },
  { text: "brand", accent: true },
  { text: "growth", accent: true },
  { text: "that", accent: false },
  { text: "compounds.", accent: false },
];

const STATS = [
  { value: "480+", label: "campaigns launched" },
  { value: "₹4,100Cr", label: "revenue influenced" },
  { value: "97%", label: "client retention" },
  { value: "14", label: "industries served" },
];

const TINTS = [
  "radial-gradient(ellipse 70% 60% at 18% 25%, rgba(10,132,255,0.30), transparent 60%)",
  "radial-gradient(ellipse 70% 60% at 82% 35%, rgba(56,189,248,0.26), transparent 60%)",
  "radial-gradient(ellipse 70% 60% at 50% 78%, rgba(43,107,255,0.28), transparent 60%)",
];

export function Hero() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax layers — background drifts slower (lags), content leads + fades.
  const yGrid = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yOrbs = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yOrbs2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  // Cross-fade background tint on an interval.
  const [tintIdx, setTintIdx] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setTintIdx((i) => (i + 1) % TINTS.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden"
    >
      {/* ===================== Background layers ===================== */}
      <motion.div
        style={{ y: yGrid }}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="grid-bg animate-grid-pan mask-radial absolute inset-0 opacity-50" />
      </motion.div>

      <motion.div
        style={{ y: yOrbs }}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="aurora absolute -left-40 top-[-4rem] h-[42rem] w-[42rem] rounded-full animate-float-slow" />
        <div className="aurora absolute -right-32 top-1/3 h-[34rem] w-[34rem] rounded-full animate-float-rev" />
      </motion.div>

      <motion.div
        style={{ y: yOrbs2 }}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-2/3 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-electric-soft/15 blur-[110px]" />
      </motion.div>

      {/* Cross-fade tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <AnimatePresence>
          <motion.div
            key={tintIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: EASE_OUT }}
            className="absolute inset-0"
            style={{ background: TINTS[tintIdx] }}
          />
        </AnimatePresence>
      </div>

      {/* Top blend for navbar legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-background to-transparent"
      />

      {/* ===================== Floating glass stat chips (xl) ===================== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.7, ease: EASE_OUT }}
        className="pointer-events-none absolute left-[3.5%] top-[23%] hidden xl:block"
      >
        <div className="glass animate-float-slow flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-electric/15 text-electric">
            <Eye className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">4.2B</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              impressions
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.7, ease: EASE_OUT }}
        className="pointer-events-none absolute right-[3.5%] top-[42%] hidden xl:block"
      >
        <div className="glass animate-float-rev flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-electric/15 text-electric">
            <TrendingUp className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">+312%</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              avg ROAS
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===================== Content ===================== */}
      <motion.div
        style={{ y: yContent, opacity: opacityContent }}
        className="relative z-10 flex flex-1 flex-col justify-center px-5 pb-8 pt-28 sm:px-8"
      >
        <div className="mx-auto w-full max-w-5xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="mb-6 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-electric">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-electric" />
              </span>
              Full-funnel growth studio
            </span>
          </motion.div>

          {/* Headline — word-by-word reveal */}
          <motion.h1
            variants={stagger}
            initial="hidden"
            animate="show"
            className="text-center font-display text-4xl font-semibold leading-[1.12] tracking-tight sm:text-6xl md:text-7xl"
          >
            {HEADLINE.map((w, i) => (
              <React.Fragment key={i}>
                <span className="inline-block overflow-hidden align-baseline">
                  <motion.span
                    variants={wordReveal}
                    className={cn(
                      "inline-block",
                      w.accent &&
                        "text-gradient text-5xl sm:text-7xl md:text-8xl"
                    )}
                  >
                    {w.text}
                  </motion.span>
                </span>
                {i < HEADLINE.length - 1 ? " " : null}
              </React.Fragment>
            ))}
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.6 }}
            className="mx-auto mt-7 max-w-2xl text-balance text-center text-base text-muted-foreground sm:text-lg"
          >
            Peak Media is a full-funnel digital marketing agency — branding,
            SEO, paid media, social, web design &amp; content — built to scale
            India's most ambitious brands.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.75 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <MagneticButton href="#contact" variant="gradient" size="lg">
              Start a project
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href="#work" variant="outline" size="lg">
              View our work
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* ===================== Stats strip ===================== */}
      <div className="relative z-10 px-5 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 py-6 md:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="text-center md:text-left">
                  <div className="font-display text-2xl font-semibold text-gradient sm:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ===================== Scroll indicator + trust line ===================== */}
      <div className="relative z-10 flex flex-col items-center gap-2.5 px-5 pb-6 pt-1">
        <motion.a
          href="#services"
          aria-label="Scroll to services"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="group flex flex-col items-center gap-1.5 text-muted-foreground transition-colors hover:text-electric"
        >
          <span className="relative flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1">
            <motion.span
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-1.5 w-1 rounded-full bg-electric"
            />
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        </motion.a>
        <p className="text-center text-[11px] uppercase tracking-[0.22em] text-muted-foreground/70">
          Trusted by teams at
        </p>
      </div>
    </section>
  );
}
