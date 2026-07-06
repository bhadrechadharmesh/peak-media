"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Maximize2, X } from "lucide-react";
import { SectionShell } from "@/components/peak/ui/section-shell";
import { SectionHeading } from "@/components/peak/ui/section-heading";
import { Reveal } from "@/components/peak/ui/reveal";
import { MagneticButton } from "@/components/peak/ui/magnetic-button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Category =
  | "Branding"
  | "Web Design"
  | "Social"
  | "Paid Ads"
  | "Content";

type Filter = "All" | Category;

interface Project {
  id: string;
  title: string;
  client: string;
  category: Category;
  metric: string;
  metricLabel: string;
  blurb: string;
  gradient: string;
  shape: string;
  monogram: string;
  tall?: boolean;
}

const FILTERS: Filter[] = [
  "All",
  "Branding",
  "Web Design",
  "Social",
  "Paid Ads",
  "Content",
];

const PROJECTS: Project[] = [
  {
    id: "aether",
    title: "Aether Finance",
    client: "Aether Capital",
    category: "Branding",
    metric: "+214%",
    metricLabel: "brand recall lift",
    blurb:
      "A complete identity rebuild for a Series-B fintech — from wordmark to motion system — that turned a forgotten challenger into a category reference.",
    gradient:
      "from-[#0a84ff] via-[#2b6bff] to-[#05070d]",
    shape: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.45), transparent 45%)",
    monogram: "Æ",
    tall: true,
  },
  {
    id: "lumen",
    title: "Lumen Skincare",
    client: "Lumen Beauty Co.",
    category: "Web Design",
    metric: "+312%",
    metricLabel: "checkout conversion",
    blurb:
      "A sensory commerce experience built around Lumen's hero serum — slower scrolls, warmer palettes, and a quiz-driven funnel that doubled AOV.",
    gradient:
      "from-[#38bdf8] via-[#0a84ff] to-[#0a0e1a]",
    shape: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.4), transparent 50%)",
    monogram: "Lu",
  },
  {
    id: "voltaic",
    title: "Voltaic EV",
    client: "Voltaic Motors",
    category: "Social",
    metric: "8.4M",
    metricLabel: "views in 30 days",
    blurb:
      "A launch films trilogy + TikTok velocity engine that put Voltaic's first model on every feed without spending a dollar on creator fees.",
    gradient:
      "from-[#2b6bff] via-[#0a84ff] to-[#38bdf8]",
    shape: "radial-gradient(circle at 50% 80%, rgba(255,255,255,0.35), transparent 55%)",
    monogram: "V",
  },
  {
    id: "northwind",
    title: "Northwind Coffee",
    client: "Northwind Roasters",
    category: "Content",
    metric: "5.2x",
    metricLabel: "ROAS on UGC",
    blurb:
      "A barista-led UGC engine producing 60 clips a month — tested across 14 audiences, trimmed weekly to the performers only.",
    gradient:
      "from-[#0a0e1a] via-[#2b6bff] to-[#0a84ff]",
    shape: "radial-gradient(circle at 20% 70%, rgba(56,189,248,0.5), transparent 50%)",
    monogram: "N",
    tall: true,
  },
  {
    id: "helix",
    title: "Helix Health",
    client: "Helix Care",
    category: "Paid Ads",
    metric: "−43%",
    metricLabel: "cost per qualified lead",
    blurb:
      "Rebuilt the paid funnel around HIPAA-safe landing flows — creative testing matrix shrank CPL while doubling weekly lead volume.",
    gradient:
      "from-[#38bdf8] via-[#0a84ff] to-[#05070d]",
    shape: "radial-gradient(circle at 80% 60%, rgba(255,255,255,0.35), transparent 50%)",
    monogram: "Hx",
  },
  {
    id: "sterling",
    title: "Sterling Apparel",
    client: "Sterling Atelier",
    category: "Branding",
    metric: "72h",
    metricLabel: "to full sell-through",
    blurb:
      "A capsule launch identity and drop-campaign system — waitlist, packaging, and a 60-second film that sold the run out before the weekend ended.",
    gradient:
      "from-[#2b6bff] via-[#38bdf8] to-[#0a0e1a]",
    shape: "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.4), transparent 50%)",
    monogram: "S",
  },
  {
    id: "quartz",
    title: "Quartz Studio",
    client: "Quartz Architects",
    category: "Web Design",
    metric: "−61%",
    metricLabel: "bounce rate",
    blurb:
      "A spatial portfolio that treats each project as a room — WebGL-light, scroll-choreographed, and tuned for prospective clients who skim in 9 seconds.",
    gradient:
      "from-[#0a84ff] via-[#0a0e1a] to-[#2b6bff]",
    shape: "radial-gradient(circle at 60% 30%, rgba(56,189,248,0.45), transparent 55%)",
    monogram: "Q",
    tall: true,
  },
  {
    id: "pulse",
    title: "Pulse Fitness",
    client: "Pulse Clubs",
    category: "Social",
    metric: "120K",
    metricLabel: "new followers / qtr",
    blurb:
      "A creator-led social engine where trainers double as talent — weekly format series, recurring memes, and a community that converts itself.",
    gradient:
      "from-[#05070d] via-[#0a84ff] to-[#38bdf8]",
    shape: "radial-gradient(circle at 30% 80%, rgba(255,255,255,0.35), transparent 50%)",
    monogram: "P",
  },
];

function ProjectCover({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-gradient-to-br",
        project.gradient,
        className
      )}
      aria-hidden
    >
      {/* abstract shape */}
      <div
        className="absolute inset-0"
        style={{ background: project.shape }}
      />
      {/* grid lines */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* floating orbs */}
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-6 right-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
      {/* monogram */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-7xl font-semibold text-white/90 drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)] sm:text-8xl">
          {project.monogram}
        </span>
      </div>
      {/* bottom sheen */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}

export function Portfolio() {
  const [filter, setFilter] = React.useState<Filter>("All");
  const [active, setActive] = React.useState<Project | null>(null);

  const filtered = React.useMemo(
    () =>
      filter === "All"
        ? PROJECTS
        : PROJECTS.filter((p) => p.category === filter),
    [filter]
  );

  return (
    <SectionShell
      id="work"
      className="relative overflow-hidden"
    >
      {/* backdrop aurora */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora absolute -left-32 top-10 h-72 w-72 rounded-full opacity-25" />
        <div className="aurora absolute -right-24 bottom-0 h-80 w-80 rounded-full opacity-20" />
      </div>

      <SectionHeading
        eyebrow="Selected work"
        title={
          <>
            Campaigns that <span className="text-gradient">moved the needle</span>
          </>
        }
        description="A snapshot of recent engagements — brands we helped break through, scale up, and out-execute their categories."
      />

      {/* Filter bar */}
      <Reveal delay={0.05} className="mt-10">
        <div className="no-scrollbar flex w-full items-center justify-start gap-2 overflow-x-auto pb-2 sm:justify-center">
          {FILTERS.map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={isActive}
                className={cn(
                  "relative shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300",
                  isActive
                    ? "border-transparent text-white"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:border-electric/40 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="portfolio-filter-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-electric to-electric-2 shadow-[0_8px_30px_-8px_var(--electric-glow)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {f}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Gallery grid */}
      <motion.div
        layout
        className="mt-10 grid auto-rows-[260px] grid-cols-1 gap-5 md:grid-cols-2 md:auto-rows-[280px] lg:grid-cols-3 lg:auto-rows-[300px]"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.button
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.03 }}
              onClick={() => setActive(project)}
              whileHover={{ y: -6 }}
              className={cn(
                "group relative col-span-1 overflow-hidden rounded-2xl border border-white/10 bg-card text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-electric/60",
                project.tall && "md:row-span-2"
              )}
            >
              {/* cover */}
              <div className="absolute inset-0">
                <motion.div
                  className="h-full w-full"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProjectCover project={project} />
                </motion.div>
              </div>

              {/* electric border glow on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: "inset 0 0 0 1px var(--electric), 0 0 50px -10px var(--electric-glow)" }}
              />

              {/* overlay slide-up */}
              <div className="absolute inset-0 flex flex-col justify-end">
                <div className="bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-white/80 backdrop-blur">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-white/60">{project.client}</p>

                  {/* hover reveal CTA */}
                  <div className="mt-3 max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100">
                    <div className="flex items-center justify-between rounded-lg border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white">
                        View case study
                        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                      <Maximize2 className="size-3.5 text-white/70" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Fullscreen preview dialog */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl gap-0 overflow-hidden rounded-3xl border-white/10 bg-background/70 p-0 backdrop-blur-2xl sm:max-w-4xl"
        >
          {active && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <DialogTitle className="sr-only">{active.title}</DialogTitle>
              <DialogDescription className="sr-only">
                {active.blurb}
              </DialogDescription>

              {/* big gradient hero */}
              <div className="relative h-64 w-full sm:h-80">
                <ProjectCover project={active} />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />

                {/* close button */}
                <button
                  onClick={() => setActive(null)}
                  aria-label="Close preview"
                  className="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-electric/80 hover:border-electric"
                >
                  <X className="size-4" />
                </button>

                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/85 backdrop-blur">
                      {active.category}
                    </span>
                    <h3 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
                      {active.title}
                    </h3>
                    <p className="text-sm text-white/70">{active.client}</p>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <div className="font-display text-4xl font-semibold text-gradient">
                      {active.metric}
                    </div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                      {active.metricLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* body */}
              <div className="space-y-6 p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="sm:hidden">
                    <div className="font-display text-3xl font-semibold text-gradient">
                      {active.metric}
                    </div>
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {active.metricLabel}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base sm:max-w-2xl">
                    {active.blurb}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-electric" />
                    Engagement completed in 2024
                  </div>
                  <MagneticButton
                    variant="gradient"
                    size="sm"
                    href="#contact"
                    onClick={() => setActive(null)}
                  >
                    Start a similar project
                    <ArrowRight className="size-4" />
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </SectionShell>
  );
}

export default Portfolio;
