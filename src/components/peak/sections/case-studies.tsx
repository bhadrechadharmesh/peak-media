"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/peak/ui/section-shell";
import { SectionHeading } from "@/components/peak/ui/section-heading";
import { Reveal } from "@/components/peak/ui/reveal";
import { MagneticButton } from "@/components/peak/ui/magnetic-button";
import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";
import { fadeUp, stagger, viewportOnce, EASE_OUT } from "@/lib/motion";

/* ---------- types ---------- */
interface MetricValueData {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}
interface Metric {
  label: string;
  before: MetricValueData;
  after: MetricValueData;
  delta: string;
  positive: boolean;
}
interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  category: string;
  headline: string;
  monogram: string;
  gradient: string;
  metrics: Metric[];
}

/* ---------- data ---------- */
const CASES: CaseStudy[] = [
  {
    id: "northwind",
    client: "Northwind",
    industry: "DTC Skincare",
    category: "E-commerce",
    headline: "+312% ROAS in 90 days",
    monogram: "N",
    gradient: "from-[#0a84ff]/45 via-[#2b6bff]/25 to-[#38bdf8]/35",
    metrics: [
      {
        label: "ROAS",
        before: { value: 1.8, suffix: "x", decimals: 1 },
        after: { value: 7.4, suffix: "x", decimals: 1 },
        delta: "+312%",
        positive: true,
      },
      {
        label: "Revenue / mo",
        before: { value: 180, prefix: "$", suffix: "k" },
        after: { value: 740, prefix: "$", suffix: "k" },
        delta: "+311%",
        positive: true,
      },
      {
        label: "CAC",
        before: { value: 54, prefix: "$" },
        after: { value: 19, prefix: "$" },
        delta: "\u221265%",
        positive: true,
      },
    ],
  },
  {
    id: "vertex",
    client: "Vertex",
    industry: "B2B SaaS",
    category: "Lead Gen",
    headline: "3.4x pipeline in one quarter",
    monogram: "V",
    gradient: "from-[#8b5cf6]/40 via-[#2b6bff]/25 to-[#0a84ff]/35",
    metrics: [
      {
        label: "MQLs / mo",
        before: { value: 210, suffix: "/mo" },
        after: { value: 720, suffix: "/mo" },
        delta: "+243%",
        positive: true,
      },
      {
        label: "Pipeline",
        before: { value: 1.2, prefix: "$", suffix: "M", decimals: 1 },
        after: { value: 4.1, prefix: "$", suffix: "M", decimals: 1 },
        delta: "+242%",
        positive: true,
      },
      {
        label: "CPL",
        before: { value: 128, prefix: "$" },
        after: { value: 41, prefix: "$" },
        delta: "\u221268%",
        positive: true,
      },
    ],
  },
  {
    id: "helix",
    client: "Helix",
    industry: "Mobile App",
    category: "App Install",
    headline: "62% lower CPI",
    monogram: "H",
    gradient: "from-[#34d399]/40 via-[#0a84ff]/25 to-[#38bdf8]/35",
    metrics: [
      {
        label: "CPI",
        before: { value: 4.1, prefix: "$", decimals: 2 },
        after: { value: 1.55, prefix: "$", decimals: 2 },
        delta: "\u221262%",
        positive: true,
      },
      {
        label: "D7 retention",
        before: { value: 18, suffix: "%" },
        after: { value: 31, suffix: "%" },
        delta: "+72%",
        positive: true,
      },
      {
        label: "Installs / mo",
        before: { value: 22, suffix: "k" },
        after: { value: 88, suffix: "k" },
        delta: "+300%",
        positive: true,
      },
    ],
  },
];

/* ---------- helpers ---------- */
function formatStatic(data: MetricValueData): string {
  const formatted =
    data.decimals !== undefined && data.decimals > 0
      ? data.value.toFixed(data.decimals)
      : Math.round(data.value).toLocaleString();
  return `${data.prefix ?? ""}${formatted}${data.suffix ?? ""}`;
}

/* ---------- value renders ---------- */
function BeforeValue({ data }: { data: MetricValueData }) {
  return (
    <span className="tabular-nums text-muted-foreground/80 line-through decoration-rose-400/40 decoration-1">
      {formatStatic(data)}
    </span>
  );
}

function AfterValue({ data }: { data: MetricValueData }) {
  const { ref, formatted } = useCountUp(data.value, {
    duration: 1400,
    decimals: data.decimals ?? 0,
  });
  return (
    <span
      ref={ref as React.RefObject<HTMLSpanElement>}
      className="tabular-nums text-foreground"
    >
      {data.prefix}
      {formatted}
      {data.suffix}
    </span>
  );
}

/* ---------- metric row ---------- */
function MetricRow({
  metric,
  view,
}: {
  metric: Metric;
  view: "before" | "after";
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {metric.label}
      </span>
      <div className="flex items-center gap-2">
        <span className="font-display text-xl font-semibold">
          {view === "after" ? (
            <AfterValue data={metric.after} />
          ) : (
            <BeforeValue data={metric.before} />
          )}
        </span>
        <AnimatePresence>
          {view === "after" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5, x: -6 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: -6 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className={cn(
                "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                metric.positive
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-rose-500/15 text-rose-400"
              )}
            >
              {metric.delta}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- card ---------- */
function CaseCard({ study }: { study: CaseStudy }) {
  const [view, setView] = React.useState<"before" | "after">("before");

  return (
    <motion.article
      variants={fadeUp}
      className="group/card relative flex flex-col overflow-hidden rounded-3xl glass transition-all duration-500 hover:-translate-y-1.5 hover:glow-sm"
    >
      {/* thumbnail */}
      <div
        className={cn(
          "relative h-32 overflow-hidden bg-gradient-to-br",
          study.gradient
        )}
      >
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur">
          {study.category}
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-6xl font-bold text-white/95 drop-shadow-[0_4px_20px_rgba(10,132,255,0.45)] transition-transform duration-500 ease-out group-hover/card:scale-110 group-hover/card:rotate-2">
            {study.monogram}
          </span>
        </div>
        {/* hover wash */}
        <div className="absolute inset-0 bg-electric/0 transition-colors duration-500 group-hover/card:bg-electric/10" />
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-xl font-semibold text-foreground">
              {study.client}
            </h3>
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {study.industry}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-gradient">
            {study.headline}
          </p>
        </div>

        {/* toggle */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Performance
          </span>
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
            {(["before", "after"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors",
                  view === v
                    ? v === "after"
                      ? "bg-electric text-white shadow-[0_0_18px_-4px_var(--electric-glow)]"
                      : "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* metrics */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="flex flex-col gap-3"
          >
            {study.metrics.map((m) => (
              <MetricRow key={m.label} metric={m} view={view} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

/* ---------- main ---------- */
export function CaseStudies() {
  return (
    <SectionShell id="case-studies">
      <SectionHeading
        eyebrow="Case studies"
        title="Outcomes that compound, quarter after quarter"
        description="Three brands. Three breakthroughs. Toggle before/after on each card to watch the deltas animate in."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {CASES.map((c) => (
          <CaseCard key={c.id} study={c} />
        ))}
      </motion.div>

      <Reveal delay={0.1} className="mt-12 flex justify-center">
        <MagneticButton variant="outline" size="lg" href="#contact">
          See if we can 10x your metrics
          <ArrowRight className="h-4 w-4" />
        </MagneticButton>
      </Reveal>
    </SectionShell>
  );
}
