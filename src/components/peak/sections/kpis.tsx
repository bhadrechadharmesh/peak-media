"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

interface KpiConfig {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix: string;
  label: string;
  trend: string;
  gradient?: boolean;
}

const KPIS: KpiConfig[] = [
  {
    target: 2.1,
    decimals: 1,
    suffix: "B+",
    label: "Impressions delivered",
    trend: "+18% YoY",
    gradient: true,
  },
  {
    target: 4100,
    prefix: "₹",
    suffix: "Cr",
    label: "Revenue influenced",
    trend: "+22% YoY",
    gradient: true,
  },
  {
    target: 312,
    suffix: "%",
    label: "Average ROAS lift",
    trend: "+47% vs. industry",
    gradient: false,
  },
  {
    target: 97,
    suffix: "%",
    label: "Client retention",
    trend: "+3% YoY",
    gradient: false,
  },
];

function KpiCard({ kpi, index }: { kpi: KpiConfig; index: number }) {
  const { ref, formatted } = useCountUp(kpi.target, {
    duration: 1800,
    decimals: kpi.decimals ?? 0,
  });

  return (
    <motion.div variants={fadeUp} className="relative">
      {/* mobile horizontal divider */}
      {index > 0 && (
        <span
          aria-hidden
          className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent sm:hidden"
        />
      )}
      {/* sm+ vertical divider */}
      {index > 0 && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent sm:block"
        />
      )}

      <div className="relative flex flex-col gap-3 px-6 py-8 sm:px-8 md:py-10">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={cn(
            "font-display text-4xl font-semibold leading-none tracking-tight md:text-5xl",
            kpi.gradient ? "text-gradient" : "text-foreground"
          )}
        >
          <span className="tabular-nums">
            {kpi.prefix}
            {formatted}
            {kpi.suffix}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">{kpi.label}</div>
        <span className="inline-flex w-fit items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
          <ArrowUpRight className="h-3 w-3" />
          {kpi.trend}
        </span>
      </div>
    </motion.div>
  );
}

export function Kpis() {
  return (
    <section className="relative w-full py-14 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="relative overflow-hidden rounded-3xl glass p-2 sm:p-3"
        >
          {/* top border glow */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/70 to-transparent"
          />
          {/* faint grid overlay */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000,transparent)]"
          />
          {/* central glow blob */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[60%] -translate-x-1/2 rounded-full bg-electric/15 blur-3xl"
          />

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {KPIS.map((k, i) => (
              <KpiCard key={k.label} kpi={k} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
