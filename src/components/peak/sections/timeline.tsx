"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  PenTool,
  Rocket,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { SectionShell } from "@/components/peak/ui/section-shell";
import { SectionHeading } from "@/components/peak/ui/section-heading";
import { cn } from "@/lib/utils";

interface Stage {
  num: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  deliverables: string[];
  accent: string; // tailwind gradient classes
}

const STAGES: Stage[] = [
  {
    num: "01",
    name: "Strategy",
    desc: "Audit, research, positioning, channel mix.",
    deliverables: [
      "Market & competitor audit",
      "ICP & positioning",
      "Growth roadmap",
      "KPI framework",
    ],
    icon: Compass,
    accent: "from-electric to-electric-soft",
  },
  {
    num: "02",
    name: "Creative",
    desc: "Brand systems, ad creative, content engine.",
    deliverables: [
      "Brand identity system",
      "Ad creative concepts",
      "Content pillars",
      "Landing page UX",
    ],
    icon: PenTool,
    accent: "from-electric-soft to-electric-2",
  },
  {
    num: "03",
    name: "Launch",
    desc: "Ship campaigns, tracking, optimization sprints.",
    deliverables: [
      "Cross-channel launch",
      "Conversion tracking",
      "A/B testing",
      "Daily optimization",
    ],
    icon: Rocket,
    accent: "from-electric-2 to-electric",
  },
  {
    num: "04",
    name: "Scale",
    desc: "Double down on winners, expand, automate.",
    deliverables: [
      "Budget scaling",
      "New-market expansion",
      "Marketing automation",
      "Quarterly strategy",
    ],
    icon: TrendingUp,
    accent: "from-electric to-electric-2",
  },
];

function StageCard({ stage }: { stage: Stage }) {
  const Icon = stage.icon;
  return (
    <article className="relative flex min-w-[84vw] shrink-0 flex-col rounded-3xl glass p-7 sm:min-w-[58vw] sm:p-9 lg:min-w-[40vw] xl:min-w-[32vw]">
      {/* accent top line */}
      <span
        aria-hidden
        className={cn(
          "absolute -top-px left-8 right-8 h-px bg-gradient-to-r",
          stage.accent
        )}
      />
      {/* ambient glow */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-3xl",
          stage.accent
        )}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
              stage.accent
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Stage
            </div>
            <h3 className="font-display text-2xl font-semibold tracking-tight">
              {stage.name}
            </h3>
          </div>
        </div>
        <span className="font-display text-6xl font-bold leading-none text-gradient">
          {stage.num}
        </span>
      </div>

      <p className="mt-6 text-base text-muted-foreground">{stage.desc}</p>

      <ul className="mt-6 space-y-3 border-t border-white/5 pt-6">
        {stage.deliverables.map((d) => (
          <li key={d} className="flex items-center gap-3 text-sm">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-electric/15">
              <Check className="h-3 w-3 text-electric" />
            </span>
            <span className="text-foreground/90">{d}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function GrowthProcess() {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const [maxTranslate, setMaxTranslate] = React.useState(0);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const x = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // Progress fill + leading dot for the connecting line (desktop only).
  const dotLeft = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Measure the horizontal travel distance needed for the pinned track.
  React.useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const trackWidth = track.scrollWidth;
      const vw = window.innerWidth;
      setIsDesktop(vw >= 1024);
      setMaxTranslate(Math.max(0, trackWidth - vw));
    };
    measure();
    window.addEventListener("resize", measure);
    const t = window.setTimeout(measure, 350); // re-measure after layout settles
    return () => {
      window.removeEventListener("resize", measure);
      window.clearTimeout(t);
    };
  }, []);

  // Scroll-driven horizontal translate (desktop). On mobile we leave x = 0
  // and rely on native horizontal swipe (track wrapper is overflow-x-auto).
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (isDesktop && maxTranslate > 0) {
      x.set(-(v * maxTranslate));
    } else {
      x.set(0);
    }
  });

  return (
    <SectionShell id="process" containerClassName="max-w-none px-0">
      {/* Heading constrained to max-w-7xl */}
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="How we work"
          title={
            <>
              A four-stage{" "}
              <span className="text-gradient">growth engine</span>
            </>
          }
          description="Strategy, creative, launch, scale — a repeatable system engineered to compound results, not chase one-off wins."
        />
      </div>

      {/* Pinned horizontal-scroll wrapper. On desktop the outer spacer gives
          scroll distance; the inner viewport is sticky and the track is
          translated via the x motion value. On mobile the spacer collapses
          and the track is natively swipeable. */}
      <div ref={wrapRef} className="relative mt-12 lg:h-[280vh]">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden">
          {/* sticky scroll hint (desktop) */}
          <div className="mb-6 hidden items-center justify-center gap-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground lg:flex">
            <ArrowLeft className="h-3 w-3" />
            scroll
            <ArrowRight className="h-3 w-3" />
          </div>

          {/* connecting line + progress fill (desktop) */}
          <div className="absolute inset-x-0 top-[14%] hidden lg:block">
            <div className="relative mx-auto h-px max-w-7xl bg-white/10">
              <motion.div
                className="h-full w-full origin-left bg-gradient-to-r from-electric-soft via-electric to-electric-2"
                style={{ scaleX: scrollYProgress }}
              />
              <motion.div
                aria-hidden
                className="absolute top-1/2 h-3 w-3 -ml-1.5 -mt-1.5 rounded-full bg-electric shadow-[0_0_18px_var(--electric-glow)]"
                style={{ left: dotLeft }}
              />
            </div>
          </div>

          {/* horizontal track — native swipe on mobile, scroll-driven on desktop */}
          <div className="relative w-full overflow-x-auto no-scrollbar lg:overflow-hidden">
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex gap-6 px-5 sm:px-8 lg:px-16"
            >
              {STAGES.map((stage) => (
                <StageCard key={stage.num} stage={stage} />
              ))}
              {/* trailing spacer so the final card can centre on desktop */}
              <div
                aria-hidden
                className="hidden w-[8vw] shrink-0 lg:block"
              />
            </motion.div>
          </div>

          {/* mobile scroll hint */}
          <div className="mt-5 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground lg:hidden">
            <ArrowLeft className="h-3 w-3" />
            swipe
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
