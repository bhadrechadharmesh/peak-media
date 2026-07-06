"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Radio } from "lucide-react";
import { SectionShell } from "@/components/peak/ui/section-shell";
import { SectionHeading } from "@/components/peak/ui/section-heading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { fadeUp, stagger, viewportOnce, EASE_OUT } from "@/lib/motion";

/* ---------- design tokens (dark-first) ---------- */
const ELECTRIC = "#0a84ff";
const ELECTRIC_2 = "#2b6bff";
const ELECTRIC_SOFT = "#38bdf8";
const PURPLE = "#8b5cf6";
const EMERALD = "#34d399";
const MUTED = "#8b93a7";
const AXIS = "rgba(139,147,167,0.55)";

/* ---------- types ---------- */
interface WeekPoint {
  week: string;
  current: number;
  previous: number;
}
interface BudgetSlice {
  name: string;
  value: number;
  color: string;
}
interface StatTile {
  id: "roas" | "cpa" | "cvr";
  label: string;
  value: string;
  delta: string;
  good: boolean;
  spark: { i: number; v: number }[];
  color: string;
}
interface Campaign {
  id: string;
  name: string;
  conversions: WeekPoint[];
  budget: BudgetSlice[];
  totalBudget: string;
  stats: StatTile[];
}

/* ---------- data ---------- */
const WEEKS = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);

const CAMPAIGNS: Campaign[] = [
  {
    id: "northwind",
    name: "Mira DTC",
    totalBudget: "₹20Cr",
    conversions: [
      { week: "W1", current: 1850, previous: 1240 },
      { week: "W2", current: 2140, previous: 1380 },
      { week: "W3", current: 2380, previous: 1450 },
      { week: "W4", current: 2680, previous: 1620 },
      { week: "W5", current: 2980, previous: 1780 },
      { week: "W6", current: 3340, previous: 1950 },
      { week: "W7", current: 3680, previous: 2160 },
      { week: "W8", current: 4020, previous: 2340 },
      { week: "W9", current: 4380, previous: 2520 },
      { week: "W10", current: 4710, previous: 2710 },
      { week: "W11", current: 4980, previous: 2920 },
      { week: "W12", current: 5240, previous: 3100 },
    ],
    budget: [
      { name: "Paid Search", value: 35, color: ELECTRIC },
      { name: "Social", value: 28, color: ELECTRIC_SOFT },
      { name: "Display", value: 18, color: ELECTRIC_2 },
      { name: "Video", value: 12, color: PURPLE },
      { name: "Email", value: 7, color: EMERALD },
    ],
    stats: [
      {
        id: "roas",
        label: "ROAS",
        value: "7.4x",
        delta: "+312%",
        good: true,
        color: ELECTRIC,
        spark: [2.1, 2.4, 2.9, 3.5, 4.2, 5.1, 6.3, 7.4].map((v, i) => ({ i, v })),
      },
      {
        id: "cpa",
        label: "CPA",
        value: "₹1,500",
        delta: "\u221265%",
        good: true,
        color: EMERALD,
        spark: [54, 48, 42, 36, 31, 26, 22, 19].map((v, i) => ({ i, v })),
      },
      {
        id: "cvr",
        label: "Conv. rate",
        value: "4.8%",
        delta: "+127%",
        good: true,
        color: ELECTRIC_SOFT,
        spark: [2.1, 2.4, 2.8, 3.2, 3.6, 4.0, 4.4, 4.8].map((v, i) => ({ i, v })),
      },
    ],
  },
  {
    id: "vertex",
    name: "Vridhi SaaS",
    totalBudget: "₹15Cr",
    conversions: [
      { week: "W1", current: 125, previous: 82 },
      { week: "W2", current: 168, previous: 96 },
      { week: "W3", current: 215, previous: 118 },
      { week: "W4", current: 268, previous: 142 },
      { week: "W5", current: 312, previous: 168 },
      { week: "W6", current: 365, previous: 195 },
      { week: "W7", current: 418, previous: 222 },
      { week: "W8", current: 472, previous: 252 },
      { week: "W9", current: 528, previous: 282 },
      { week: "W10", current: 575, previous: 308 },
      { week: "W11", current: 625, previous: 328 },
      { week: "W12", current: 678, previous: 340 },
    ],
    budget: [
      { name: "Paid Search", value: 42, color: ELECTRIC },
      { name: "Social", value: 18, color: ELECTRIC_SOFT },
      { name: "Display", value: 14, color: ELECTRIC_2 },
      { name: "Video", value: 10, color: PURPLE },
      { name: "Email", value: 16, color: EMERALD },
    ],
    stats: [
      {
        id: "roas",
        label: "ROAS",
        value: "5.2x",
        delta: "+210%",
        good: true,
        color: ELECTRIC,
        spark: [1.8, 2.2, 2.6, 3.0, 3.5, 4.0, 4.6, 5.2].map((v, i) => ({ i, v })),
      },
      {
        id: "cpa",
        label: "CPA",
        value: "₹3,100",
        delta: "\u221268%",
        good: true,
        color: EMERALD,
        spark: [128, 110, 92, 78, 65, 56, 48, 41].map((v, i) => ({ i, v })),
      },
      {
        id: "cvr",
        label: "Conv. rate",
        value: "11.3%",
        delta: "+84%",
        good: true,
        color: ELECTRIC_SOFT,
        spark: [6.1, 6.8, 7.5, 8.3, 9.0, 9.8, 10.5, 11.3].map((v, i) => ({ i, v })),
      },
    ],
  },
  {
    id: "helix",
    name: "Karo App Install",
    totalBudget: "₹27Cr",
    conversions: [
      { week: "W1", current: 8200, previous: 5100 },
      { week: "W2", current: 9400, previous: 5800 },
      { week: "W3", current: 11200, previous: 6600 },
      { week: "W4", current: 12800, previous: 7400 },
      { week: "W5", current: 14500, previous: 8200 },
      { week: "W6", current: 16400, previous: 9100 },
      { week: "W7", current: 18200, previous: 10000 },
      { week: "W8", current: 19900, previous: 10900 },
      { week: "W9", current: 21600, previous: 11800 },
      { week: "W10", current: 23100, previous: 12600 },
      { week: "W11", current: 24600, previous: 13300 },
      { week: "W12", current: 26200, previous: 14000 },
    ],
    budget: [
      { name: "Paid Search", value: 22, color: ELECTRIC },
      { name: "Social", value: 35, color: ELECTRIC_SOFT },
      { name: "Display", value: 15, color: ELECTRIC_2 },
      { name: "Video", value: 24, color: PURPLE },
      { name: "Email", value: 4, color: EMERALD },
    ],
    stats: [
      {
        id: "roas",
        label: "ROAS",
        value: "6.1x",
        delta: "+278%",
        good: true,
        color: ELECTRIC,
        spark: [1.6, 2.0, 2.5, 3.1, 3.8, 4.5, 5.3, 6.1].map((v, i) => ({ i, v })),
      },
      {
        id: "cpa",
        label: "CPI",
        value: "₹125",
        delta: "\u221262%",
        good: true,
        color: EMERALD,
        spark: [4.1, 3.65, 3.2, 2.85, 2.5, 2.15, 1.85, 1.55].map((v, i) => ({ i, v })),
      },
      {
        id: "cvr",
        label: "Conv. rate",
        value: "14.2%",
        delta: "+96%",
        good: true,
        color: ELECTRIC_SOFT,
        spark: [7.2, 8.4, 9.6, 10.6, 11.6, 12.5, 13.4, 14.2].map((v, i) => ({ i, v })),
      },
    ],
  },
];

/* ---------- helpers ---------- */
function fmtCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${Math.round(n)}`;
}

/* ---------- chart tooltip ---------- */
interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string;
}
interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}
function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#05070d]/90 px-3 py-2 text-xs shadow-2xl backdrop-blur">
      {label !== undefined && (
        <div className="mb-1 font-medium text-foreground">{label}</div>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-muted-foreground">{p.name}</span>
            <span className="ml-auto font-mono font-medium text-foreground">
              {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- stat tile ---------- */
function StatTileView({
  stat,
  campaignId,
}: {
  stat: StatTile;
  campaignId: string;
}) {
  const sparkId = `spark-${campaignId}-${stat.id}`;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <div className="flex items-start justify-between">
        <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {stat.label}
        </span>
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
            stat.good
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-rose-500/15 text-rose-400"
          )}
        >
          {stat.delta}
        </span>
      </div>
      <div className="mt-1 font-display text-2xl font-semibold text-foreground">
        {stat.value}
      </div>
      <div className="mt-2 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={stat.spark}
            margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={sparkId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stat.color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={stat.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={stat.color}
              strokeWidth={1.75}
              fill={`url(#${sparkId})`}
              isAnimationActive
              animationDuration={700}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ---------- main component ---------- */
export function CampaignDashboard() {
  const [campaignId, setCampaignId] = React.useState<string>("northwind");
  const [compare, setCompare] = React.useState<boolean>(false);

  const campaign = React.useMemo(
    () => CAMPAIGNS.find((c) => c.id === campaignId) ?? CAMPAIGNS[0],
    [campaignId]
  );

  const totalCurrent = campaign.conversions.reduce((s, d) => s + d.current, 0);
  const totalPrev = campaign.conversions.reduce((s, d) => s + d.previous, 0);
  const deltaPct = Math.round(((totalCurrent - totalPrev) / totalPrev) * 100);

  return (
    <SectionShell id="results">
      <SectionHeading
        eyebrow="Live performance"
        title="Campaign performance, in real time"
        description="A live look at the dashboards our clients see every morning — conversions, spend mix, and the metrics that actually move revenue."
      />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-12"
      >
        <Tabs
          value={campaignId}
          onValueChange={setCampaignId}
          className="gap-6"
        >
          {/* top row: tabs + live + compare */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <TabsList className="h-10 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
              {CAMPAIGNS.map((c) => (
                <TabsTrigger
                  key={c.id}
                  value={c.id}
                  className="rounded-full px-4 text-xs font-medium data-[state=active]:bg-electric data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_-4px_var(--electric-glow)]"
                >
                  {c.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Radio className="h-3 w-3 text-emerald-400" />
                  Live
                  <span className="text-white/20">·</span>
                  Updated 2 min ago
                </span>
              </div>

              <label className="flex cursor-pointer select-none items-center gap-2">
                <Switch checked={compare} onCheckedChange={setCompare} />
                <span className="text-xs text-muted-foreground">
                  Compare previous period
                </span>
              </label>
            </div>
          </div>

          {/* main grid: area chart + donut */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* area chart */}
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 lg:col-span-2">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Conversions
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Last 12 weeks · {campaign.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-display text-xl font-semibold text-gradient">
                    {fmtCompact(totalCurrent)}
                  </div>
                  <div className="text-[11px] font-medium text-emerald-400">
                    +{deltaPct}% vs. prev
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={campaignId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="h-64 md:h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={campaign.conversions}
                      margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
                    >
                      <defs>
                        <linearGradient
                          id="grad-current"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={ELECTRIC}
                            stopOpacity={0.55}
                          />
                          <stop
                            offset="100%"
                            stopColor={ELECTRIC}
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="grad-prev"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={MUTED}
                            stopOpacity={0.32}
                          />
                          <stop
                            offset="100%"
                            stopColor={MUTED}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        stroke="rgba(255,255,255,0.05)"
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="week"
                        stroke={AXIS}
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: AXIS }}
                      />
                      <YAxis
                        stroke={AXIS}
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        width={48}
                        tickFormatter={(v: number) => fmtCompact(v)}
                        tick={{ fill: AXIS }}
                      />
                      <Tooltip
                        content={<ChartTooltip />}
                        cursor={{
                          stroke: "rgba(255,255,255,0.18)",
                          strokeWidth: 1,
                          strokeDasharray: "4 4",
                        }}
                      />
                      {compare && (
                        <Area
                          type="monotone"
                          dataKey="previous"
                          name="Previous period"
                          stroke={MUTED}
                          strokeWidth={1.5}
                          strokeDasharray="4 3"
                          fill="url(#grad-prev)"
                          dot={false}
                          activeDot={{ r: 3, fill: MUTED }}
                          isAnimationActive
                          animationDuration={600}
                        />
                      )}
                      <Area
                        type="monotone"
                        dataKey="current"
                        name="Conversions"
                        stroke={ELECTRIC}
                        strokeWidth={2.5}
                        fill="url(#grad-current)"
                        dot={false}
                        activeDot={{
                          r: 5,
                          fill: ELECTRIC,
                          stroke: "#fff",
                          strokeWidth: 2,
                        }}
                        isAnimationActive
                        animationDuration={900}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* donut */}
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="mb-2">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Budget allocation
                </h3>
                <p className="text-xs text-muted-foreground">
                  {campaign.totalBudget} total · this quarter
                </p>
              </div>

              <div className="relative mx-auto h-44 w-44 sm:h-48 sm:w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={campaign.budget}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="62%"
                      outerRadius="100%"
                      paddingAngle={2}
                      stroke="none"
                      isAnimationActive
                      animationDuration={700}
                    >
                      {campaign.budget.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-xl font-semibold text-foreground">
                    {campaign.totalBudget}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    total
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-2">
                {campaign.budget.map((b) => (
                  <div
                    key={b.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: b.color }}
                      />
                      <span className="text-muted-foreground">{b.name}</span>
                    </div>
                    <span className="font-mono font-medium text-foreground">
                      {b.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* bottom: 3 stat tiles */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {campaign.stats.map((stat) => (
              <motion.div key={stat.id} variants={fadeUp}>
                <StatTileView stat={stat} campaignId={campaignId} />
              </motion.div>
            ))}
          </motion.div>
        </Tabs>
      </motion.div>
    </SectionShell>
  );
}
