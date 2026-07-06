"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Check,
  Layout,
  Megaphone,
  Palette,
  PenTool,
  Search,
  Share2,
  Video,
  type LucideIcon,
} from "lucide-react";
import { SectionShell } from "@/components/peak/ui/section-shell";
import { SectionHeading } from "@/components/peak/ui/section-heading";
import { cn } from "@/lib/utils";
import { stagger, viewportOnce, EASE_OUT } from "@/lib/motion";

interface Service {
  index: string;
  title: string;
  teaser: string;
  capabilities: string[];
  icon: LucideIcon;
}

const SERVICES: Service[] = [
  {
    index: "01",
    title: "Branding",
    teaser: "Identity systems that make ambitious brands impossible to ignore.",
    capabilities: [
      "Brand strategy & positioning",
      "Visual identity & guidelines",
      "Messaging & voice",
      "Positioning for Indian consumers",
    ],
    icon: Palette,
  },
  {
    index: "02",
    title: "SEO",
    teaser: "Technical + content engineering for compounding organic growth.",
    capabilities: [
      "Technical site audits",
      "Content & keyword strategy",
      "Authority & link building",
      "Vernacular & regional SEO",
    ],
    icon: Search,
  },
  {
    index: "03",
    title: "Social Media Marketing",
    teaser: "Always-on communities and creative that earns attention daily.",
    capabilities: [
      "Organic content engines",
      "Community management",
      "Creator & influencer partnerships",
      "Festive & IPL-season campaigns",
    ],
    icon: Share2,
  },
  {
    index: "04",
    title: "Paid Advertising",
    teaser: "Full-funnel media that scales profitably across every channel.",
    capabilities: [
      "Google, Meta & TikTok ads",
      "Creative testing frameworks",
      "Budget pacing & bidding",
      "Performance for D2C & quick-commerce",
    ],
    icon: Megaphone,
  },
  {
    index: "05",
    title: "Web Design",
    teaser: "Conversion-first sites engineered to turn traffic into revenue.",
    capabilities: [
      "UX & conversion architecture",
      "High-performance build",
      "A/B testing & CRO",
      "Bharat-first, mobile-first UX",
    ],
    icon: Layout,
  },
  {
    index: "06",
    title: "Content Creation",
    teaser: "Films, photography and short-form built to stop the scroll.",
    capabilities: [
      "Brand films & motion",
      "Short-form & social cuts",
      "Studio photography",
      "Multilingual content engine (Hindi, Tamil, Telugu, +more)",
    ],
    icon: Video,
  },
];

// Card entrance variant — includes a no-op `hover` label so variant
// propagation reaches the reveal content cleanly.
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
  hover: {},
};

// Inner reveal content: collapsed in hidden/show, expands on hover.
const revealVariants: Variants = {
  hidden: { height: 0, opacity: 0 },
  show: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
  hover: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <motion.article
      variants={cardVariants}
      whileHover="hover"
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl glass p-6 transition-all duration-300 hover:-translate-y-1 hover:border-electric/50 hover:shadow-[0_8px_44px_-10px_var(--electric-glow)]"
    >
      {/* gradient sheen sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
      >
        <span className="absolute -inset-y-8 -left-1/3 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-electric/15 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[420%] group-hover:opacity-100" />
      </span>

      {/* index number */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-2 font-display text-5xl font-bold leading-none text-muted-foreground/15 transition-colors duration-300 group-hover:text-electric/20"
      >
        {service.index}
      </span>

      {/* icon */}
      <div className="relative grid h-12 w-12 place-items-center rounded-xl glass shadow-sm transition-transform duration-300 group-hover:scale-105">
        <Icon className="h-5 w-5 text-electric" />
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-electric/0 transition-all duration-300 group-hover:ring-electric/40" />
      </div>

      {/* title */}
      <h3 className="relative mt-5 font-display text-xl font-semibold tracking-tight">
        {service.title}
      </h3>

      {/* teaser — always visible */}
      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
        {service.teaser}
      </p>

      {/* reveal-on-hover: full capability list + learn more */}
      <motion.div
        variants={revealVariants}
        className="relative overflow-hidden"
      >
        <ul className="mt-5 space-y-2.5">
          {service.capabilities.map((cap) => (
            <li
              key={cap}
              className="flex items-center gap-2.5 text-sm text-muted-foreground"
            >
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-electric/15">
                <Check className="h-2.5 w-2.5 text-electric" />
              </span>
              {cap}
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-electric"
        >
          Learn more
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </motion.div>

      {/* bottom accent line */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-electric-soft via-electric to-electric-2 transition-transform duration-300 group-hover:scale-x-100"
      />
    </motion.article>
  );
}

export function Services() {
  return (
    <SectionShell id="services">
      <SectionHeading
        eyebrow="What we do"
        title={
          <>
            Capabilities that compound{" "}
            <span className="text-gradient">brand growth</span>
          </>
        }
        description="Six disciplines, one accountable team. We own the full funnel — from first impression to closed revenue — so growth never stalls at a handoff."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {SERVICES.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </motion.div>

      {/* CTA row */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
        className="mt-12 flex justify-center"
      >
        <a
          href="#contact"
          className={cn(
            "group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-foreground backdrop-blur",
            "transition-all duration-300 hover:border-electric/50 hover:bg-electric/10 hover:shadow-[0_8px_30px_-10px_var(--electric-glow)]"
          )}
        >
          Don&apos;t see your challenge? Let&apos;s scope a custom growth plan
          <ArrowRight className="h-4 w-4 text-electric transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </motion.div>
    </SectionShell>
  );
}
