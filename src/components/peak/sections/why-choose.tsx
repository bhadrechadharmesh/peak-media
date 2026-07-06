"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  Users,
  Layers,
  BarChart3,
  Zap,
  TrendingUp,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { SectionShell } from "@/components/peak/ui/section-shell";
import { SectionHeading } from "@/components/peak/ui/section-heading";
import { Reveal } from "@/components/peak/ui/reveal";
import { MagneticButton } from "@/components/peak/ui/magnetic-button";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    icon: Users,
    title: "Senior-only team",
    body: "No juniors on your account. Every strategist, creative and buyer has 8+ years shipping at scale.",
  },
  {
    icon: Layers,
    title: "Full-funnel ownership",
    body: "Strategy → creative → media → scale. One team, one P&L, zero finger-pointing across vendors.",
  },
  {
    icon: BarChart3,
    title: "Transparent reporting",
    body: "Live dashboards you can pull up any hour. No vanity metrics, no slide-deck theatre.",
  },
  {
    icon: Zap,
    title: "Creative velocity",
    body: "50+ ad variations shipped every month, festive-ready — tested, learned, retired, replaced. Weekly, not quarterly.",
  },
  {
    icon: TrendingUp,
    title: "Performance-linked fees",
    body: "A meaningful slice of our fee moves with your outcomes. We win when you win — and feel it when you don't.",
  },
  {
    icon: Activity,
    title: "Always-on optimization",
    body: "Daily IST reviews of spend, creative and funnel. Budgets shift the morning something stops working.",
  },
];

const ROTATING_STATS = [
  { value: "₹4,100Cr+", label: "Revenue influenced" },
  { value: "312%", label: "Average ROAS" },
  { value: "50+", label: "Ad variations / month" },
  { value: "<24h", label: "Campaign launch SLA" },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), {
    stiffness: 200,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), {
    stiffness: 200,
    damping: 18,
  });
  const Icon = feature.icon;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <Reveal delay={index * 0.06} className="perspective h-full">
      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        whileHover={{ y: -6 }}
        className="group glass relative h-full overflow-hidden rounded-2xl p-6"
      >
        {/* sheen sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        {/* electric glow on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ boxShadow: "inset 0 0 0 1px var(--electric), 0 0 60px -20px var(--electric-glow)" }}
        />

        <div style={{ transform: "translateZ(40px)" }} className="relative">
          <div className="relative mb-5 inline-flex">
            <div className="absolute inset-0 rounded-xl bg-electric/20 blur-md transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
            <div className="relative inline-flex size-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-electric/30 to-electric-2/20 text-electric">
              <motion.span
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.15 }}
                className="inline-flex"
              >
                <Icon className="size-5 transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110" />
              </motion.span>
            </div>
          </div>

          <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
            {feature.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {feature.body}
          </p>
        </div>
      </motion.div>
    </Reveal>
  );
}

export function WhyChoose() {
  const [statIdx, setStatIdx] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => {
      setStatIdx((i) => (i + 1) % ROTATING_STATS.length);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  const current = ROTATING_STATS[statIdx];

  return (
    <SectionShell id="why" className="relative overflow-hidden">
      {/* aurora backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora absolute left-1/4 top-0 h-96 w-96 rounded-full opacity-20 animate-float-slow" />
        <div className="aurora absolute right-0 bottom-10 h-80 w-80 rounded-full opacity-15 animate-float-rev" />
        <div className="absolute inset-0 grid-bg opacity-30 mask-radial" />
      </div>

      <SectionHeading
        eyebrow="Why Peak Media"
        title={
          <>
            A senior team obsessed with <span className="text-gradient">your growth</span>
          </>
        }
        description="We're not a freelancers-with-a-logo shop. We're the team your in-house lead calls when the numbers need to move."
      />

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: sticky glass panel with rotating stat + floating orbs */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal variants={fadeUp}>
            <div className="glass relative h-full overflow-hidden rounded-3xl p-8">
              {/* floating orb cluster */}
              <div className="pointer-events-none absolute inset-0 -z-0">
                <div className="absolute left-6 top-8 h-32 w-32 rounded-full bg-electric/30 blur-3xl animate-float-slow" />
                <div className="absolute right-8 top-20 h-24 w-24 rounded-full bg-electric-soft/30 blur-2xl animate-float-rev" />
                <div className="absolute bottom-10 left-1/3 h-28 w-28 rounded-full bg-electric-2/30 blur-3xl animate-float-slow" />
              </div>

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-electric">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-electric" />
                  </span>
                  Live, this quarter
                </span>

                <h3 className="mt-6 font-display text-2xl font-semibold leading-tight">
                  The numbers we{" "}
                  <span className="text-gradient">put on the board.</span>
                </h3>

                {/* rotating stat */}
                <div className="mt-8 h-28 sm:h-32">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={statIdx}
                      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="font-display text-5xl font-semibold leading-none text-gradient sm:text-6xl">
                        {current.value}
                      </div>
                      <div className="mt-3 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                        {current.label}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* progress dots */}
                <div className="mt-2 flex items-center gap-2">
                  {ROTATING_STATS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setStatIdx(i)}
                      aria-label={`Show stat ${i + 1}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === statIdx
                          ? "w-8 bg-electric"
                          : "w-1.5 bg-white/20 hover:bg-white/40"
                      )}
                    />
                  ))}
                </div>

                <div className="mt-10 border-t border-white/10 pt-6">
                  <p className="text-sm text-muted-foreground">
                    Want the same team running your account?
                  </p>
                  <MagneticButton
                    variant="outline"
                    size="sm"
                    href="#contact"
                    className="mt-4"
                  >
                    Book a strategy call
                  </MagneticButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right: feature grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export default WhyChoose;
