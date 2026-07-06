"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/peak/ui/section-shell";
import { SectionHeading } from "@/components/peak/ui/section-heading";
import { Reveal } from "@/components/peak/ui/reveal";
import { MagneticButton } from "@/components/peak/ui/magnetic-button";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface Plan {
  name: string;
  positioning: string;
  monthly: number | null; // null = "Custom"
  cta: string;
  features: string[];
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    positioning: "For founders validating a channel for the first time.",
    monthly: 4900,
    cta: "Start with Starter",
    features: [
      "1 paid channel, fully managed",
      "Dedicated senior strategist",
      "Up to 15 creative variations / mo",
      "Live performance dashboard",
      "Weekly optimization cadence",
      "Slack + email support",
      "30-day pilot, no long lock-in",
    ],
  },
  {
    name: "Growth",
    positioning: "For brands ready to compound across the full funnel.",
    monthly: 9900,
    cta: "Choose Growth",
    highlight: true,
    features: [
      "Up to 3 channels managed",
      "Senior strategist + creative lead",
      "50+ creative variations / mo",
      "Full-funnel attribution model",
      "Daily optimization cadence",
      "Bi-weekly strategy sessions",
      "Live dashboard + raw data access",
      "Performance-linked fee option",
    ],
  },
  {
    name: "Scale",
    positioning: "For category leaders running always-on, multi-market.",
    monthly: null,
    cta: "Talk to sales",
    features: [
      "Unlimited channels & markets",
      "Embedded senior pod (4+ people)",
      "Unlimited creative velocity",
      "Custom MMM + incrementality testing",
      "Always-on optimization, 24/7",
      "Weekly executive briefings",
      "On-site quarterly summits",
      "Performance-linked fee structure",
    ],
  },
];

const cardVariants = {
  rest: { y: 0 },
  hover: { y: -10 },
};

const checkVariants = {
  rest: { scale: 1, color: "var(--electric)" },
  hover: { scale: 1.18 },
};

function formatPrice(monthly: number | null, quarterly: boolean) {
  if (monthly === null) return null;
  const value = quarterly ? Math.round((monthly * 0.85) / 100) * 100 : monthly;
  return value.toLocaleString("en-US");
}

function PriceDisplay({
  monthly,
  quarterly,
}: {
  monthly: number | null;
  quarterly: boolean;
}) {
  if (monthly === null) {
    return (
      <div className="font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
        Custom
      </div>
    );
  }
  const value = formatPrice(monthly, quarterly);
  return (
    <div className="flex items-end gap-1">
      <span className="font-display text-2xl font-medium text-muted-foreground">
        $
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl"
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <span className="mb-2 text-sm text-muted-foreground">/mo</span>
    </div>
  );
}

function PricingCard({
  plan,
  quarterly,
  index,
}: {
  plan: Plan;
  quarterly: boolean;
  index: number;
}) {
  const isHighlight = !!plan.highlight;
  return (
    <Reveal
      delay={index * 0.08}
      className={cn("h-full", isHighlight && "lg:-mt-4 lg:mb-4")}
    >
      <motion.div
        variants={cardVariants}
        initial="rest"
        whileHover="hover"
        animate="rest"
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={cn(
          "group glass relative flex h-full flex-col overflow-hidden rounded-3xl p-8",
          isHighlight && "lg:scale-[1.04]"
        )}
      >
        {/* highlight border + glow */}
        {isHighlight && (
          <>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{
                boxShadow:
                  "inset 0 0 0 1px var(--electric), 0 0 60px -15px var(--electric-glow)",
              }}
            />
            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-60 -translate-x-1/2 rounded-full bg-electric/25 blur-3xl" />
          </>
        )}

        {/* hover border glow for all cards */}
        {!isHighlight && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              boxShadow:
                "inset 0 0 0 1px var(--electric), 0 0 50px -20px var(--electric-glow)",
            }}
          />
        )}

        {/* sheen sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
        />

        <div className="relative flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold text-foreground">
            {plan.name}
          </h3>
          {isHighlight && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-electric/40 bg-electric/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-electric">
              <Sparkles className="size-3.5" />
              Most popular
            </span>
          )}
        </div>

        <p className="relative mt-2 text-sm text-muted-foreground">
          {plan.positioning}
        </p>

        <div className="relative mt-6">
          <PriceDisplay monthly={plan.monthly} quarterly={quarterly} />
          {plan.monthly !== null && quarterly && (
            <p className="mt-1 text-xs font-medium text-electric">
              Billed quarterly · save 15%
            </p>
          )}
          {plan.monthly !== null && !quarterly && (
            <p className="mt-1 text-xs text-muted-foreground">
              Billed monthly
            </p>
          )}
        </div>

        <div className="relative my-7 h-px w-full bg-white/10" />

        <ul className="relative flex flex-1 flex-col gap-3.5">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <motion.span
                variants={checkVariants}
                transition={{ type: "spring", stiffness: 320, damping: 16 }}
                className={cn(
                  "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-electric/40 bg-electric/10 text-electric",
                  isHighlight && "bg-electric/20"
                )}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </motion.span>
              <span className="text-sm leading-relaxed text-foreground/90">
                {f}
              </span>
            </li>
          ))}
        </ul>

        <div className="relative mt-8">
          <MagneticButton
            variant={isHighlight ? "gradient" : "outline"}
            size="lg"
            href="#contact"
            className="w-full"
          >
            {plan.cta}
            <ArrowRight className="size-4" />
          </MagneticButton>
        </div>
      </motion.div>
    </Reveal>
  );
}

export function Pricing() {
  const [quarterly, setQuarterly] = React.useState(false);

  return (
    <SectionShell id="pricing" className="relative overflow-hidden">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora absolute left-1/2 top-0 h-72 w-[44rem] -translate-x-1/2 rounded-full opacity-15" />
        <div className="absolute inset-0 grid-bg opacity-20 mask-radial" />
      </div>

      <SectionHeading
        eyebrow="Engagements"
        title={
          <>
            Pricing that scales with <span className="text-gradient">ambition</span>
          </>
        }
        description="Senior teams, live dashboards, and no long-term lock-in. Pick the engagement that matches where you are — upgrade or downgrade anytime."
      />

      {/* Billing toggle */}
      <Reveal delay={0.1} className="mt-10 flex justify-center">
        <div className="glass inline-flex items-center gap-3 rounded-full px-4 py-2.5">
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              !quarterly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Monthly
          </span>
          <Switch
            checked={quarterly}
            onCheckedChange={setQuarterly}
            aria-label="Toggle quarterly billing"
          />
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              quarterly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Quarterly
          </span>
          <span className="rounded-full border border-electric/30 bg-electric/10 px-2.5 py-0.5 text-xs font-medium text-electric">
            save 15%
          </span>
        </div>
      </Reveal>

      {/* Pricing cards */}
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        {PLANS.map((plan, i) => (
          <PricingCard
            key={plan.name}
            plan={plan}
            quarterly={quarterly}
            index={i}
          />
        ))}
      </div>

      {/* Reassurance line */}
      <Reveal delay={0.15} className="mt-12 flex justify-center">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-muted-foreground">
          <span className="inline-flex size-2 rounded-full bg-electric" />
          All plans include a dedicated strategist, live dashboard, and no
          long-term lock-in.
        </div>
      </Reveal>
    </SectionShell>
  );
}

export default Pricing;
