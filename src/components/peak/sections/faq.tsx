"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { Reveal } from "@/components/peak/ui/reveal";
import { SectionShell } from "@/components/peak/ui/section-shell";
import { SectionHeading } from "@/components/peak/ui/section-heading";
import { MagneticButton } from "@/components/peak/ui/magnetic-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
  q: string;
  a: string;
  tag?: string;
};

const FAQS: FaqItem[] = [
  {
    q: "What contract length do you require?",
    a: "We work in 90-day sprints with month-to-month rolling after the first quarter. No 12-month lock-ins. If the work isn't performing, you can exit with 14 days notice and a full handover pack.",
    tag: "Contracts",
  },
  {
    q: "Which industries do you serve best?",
    a: "B2B SaaS, DTC e-commerce, fintech, and marketplaces. We've also run growth for healthtech and climate startups. If your funnel is digital-first and measurable, we can move the needle.",
    tag: "Industries",
  },
  {
    q: "How transparent is your reporting?",
    a: "Fully. You get a live dashboard (Looker + our own portal) with spend, pipeline, CAC, and contribution by channel. We never bundle ad spend into fees — you see the actual platform cost.",
    tag: "Reporting",
  },
  {
    q: "Who actually works on my account?",
    a: "A senior strategist (8+ yrs) leads every account, supported by 2–3 specialists (paid, SEO, creative, lifecycle). No juniors learning on your budget. The team is named in your proposal.",
    tag: "Team",
  },
  {
    q: "How fast can we start?",
    a: "Discovery within 48h of signed proposal. Onboarding week covers audit, tracking setup, and channel kick-off. Most clients see first creative live by day 10, paid campaigns by day 14.",
    tag: "Onboarding",
  },
  {
    q: "Do you offer performance guarantees?",
    a: "We commit to SLAs on delivery (creative volume, campaign launches, response times) and shared KPI targets in months 2+. We don't guarantee revenue — anyone who does is selling fiction.",
    tag: "Guarantees",
  },
  {
    q: "Is pricing flexible as we scale?",
    a: "Yes. Retainers are scoped to channel mix and volume tiers. Hit a milestone (e.g. $100k/mo spend) and pricing rebalances — usually in your favor. We revisit pricing every quarter.",
    tag: "Pricing",
  },
  {
    q: "How do you handle confidentiality?",
    a: "Mutual NDA before discovery. We're SOC 2-aligned, use isolated workspaces per client, and never reference clients publicly without written consent. Your data is yours, exportable anytime.",
    tag: "Security",
  },
];

export function Faq() {
  return (
    <SectionShell id="faq" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 h-72 w-72 rounded-full bg-electric/10 blur-[120px]"
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        {/* ------------------------------ LEFT ------------------------------ */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title={
              <>
                Answers <span className="text-gradient">before you ask</span>
              </>
            }
            description="The questions founders and growth leads ask us most. Can't find yours? Our team replies in minutes, not days."
          />

          <Reveal delay={0.15} className="mt-7">
            <div className="glass relative overflow-hidden rounded-2xl p-6">
              <div
                aria-hidden
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-electric/20 blur-3xl"
              />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-electric/15 text-electric">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Still have questions?</p>
                    <p className="text-xs text-muted-foreground">
                      Avg reply under 4 minutes
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Chat with a strategist live or book a 20-minute discovery
                  call — no slides, no sales pitch.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <MagneticButton variant="gradient" size="sm" href="#contact">
                    Chat with us
                    <ArrowUpRight className="h-4 w-4" />
                  </MagneticButton>
                  <MagneticButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const el = document.getElementById("contact");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Book a call
                  </MagneticButton>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="mt-4">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-muted-foreground">
              <span className="flex -space-x-2">
                {["A", "K", "M", "S"].map((c, i) => (
                  <span
                    key={c}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[10px] font-semibold text-white",
                      i % 2 === 0 ? "bg-electric" : "bg-electric-2"
                    )}
                  >
                    {c}
                  </span>
                ))}
              </span>
              <span>
                <strong className="text-foreground">4.9/5</strong> from 120+ founders
              </span>
            </div>
          </Reveal>
        </div>

        {/* ------------------------------ RIGHT: accordion ------------------------------ */}
        <Reveal variants={fadeUp} delay={0.1}>
          <Accordion
            type="single"
            collapsible
            defaultValue="faq-0"
            className="flex flex-col gap-3"
          >
            {FAQS.map((item, i) => (
              <FaqRow key={i} item={item} index={i} />
            ))}
          </Accordion>
        </Reveal>
      </div>
    </SectionShell>
  );
}

function FaqRow({ item, index }: { item: FaqItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ delay: index * 0.05, duration: 0.5 }}
    >
      <AccordionItem
        value={`faq-${index}`}
        className={cn(
          "group glass overflow-hidden rounded-2xl border-white/10 px-5 py-1",
          "data-[state=open]:border-electric/40 data-[state=open]:glow-sm",
          "first:border-b"
        )}
      >
        <AccordionTrigger className="items-center py-5 text-left hover:no-underline">
          <span className="flex flex-1 items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-[10px] font-semibold text-muted-foreground transition-colors group-data-[state=open]:border-electric/40 group-data-[state=open]:bg-electric/15 group-data-[state=open]:text-electric">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-display text-base font-medium text-foreground sm:text-[17px]">
                {item.q}
              </span>
              {item.tag && (
                <span className="text-[10px] uppercase tracking-[0.18em] text-electric/70">
                  {item.tag}
                </span>
              )}
            </span>
          </span>
          <span className="pointer-events-none ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:border-electric/40 group-data-[state=open]:bg-electric/15 group-data-[state=open]:text-electric">
            <Plus className="h-3.5 w-3.5" />
          </span>
        </AccordionTrigger>
        <AccordionContent className="overflow-hidden text-sm text-muted-foreground">
          <div className="pb-5 pl-10 pr-2 leading-relaxed">{item.a}</div>
        </AccordionContent>
      </AccordionItem>
    </motion.div>
  );
}

export default Faq;
