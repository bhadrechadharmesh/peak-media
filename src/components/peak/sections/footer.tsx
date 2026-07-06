"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  Dribbble,
  Instagram,
  Linkedin,
  Mail,
  Sparkles,
  Youtube,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { Reveal } from "@/components/peak/ui/reveal";
import { MagneticButton } from "@/components/peak/ui/magnetic-button";

type Column = {
  title: string;
  links: { label: string; href: string }[];
};

const COLUMNS: Column[] = [
  {
    title: "Services",
    links: [
      { label: "Branding & Identity", href: "#services" },
      { label: "SEO & Content", href: "#services" },
      { label: "Paid Media", href: "#services" },
      { label: "Web Design", href: "#services" },
      { label: "Social & Lifecycle", href: "#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Case studies", href: "#work" },
      { label: "Playbooks", href: "#" },
      { label: "Newsletter", href: "#newsletter" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

const SOCIALS = [
  { label: "X / Twitter", href: "#", Icon: XIcon },
  { label: "LinkedIn", href: "#", Icon: Linkedin },
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "YouTube", href: "#", Icon: Youtube },
  { label: "Dribbble", href: "#", Icon: Dribbble },
];

export function Footer() {
  return (
    <footer
      id="footer"
      className="relative mt-auto w-full overflow-hidden border-t border-white/10 bg-ink/80 text-foreground"
    >
      {/* top electric hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/70 to-transparent"
      />
      {/* faint grid bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-bg opacity-[0.12]"
      />
      {/* top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-electric/10 blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* ------------------- CTA strip ------------------- */}
        <Reveal variants={fadeUp}>
          <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 py-12 sm:py-14 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-electric">
                <Sparkles className="h-3 w-3" />
                Booking Q2 partnerships
              </div>
              <h3 className="mt-4 font-display text-3xl font-semibold leading-[1.05] sm:text-4xl md:text-5xl">
                Ready to <span className="text-gradient">scale?</span>
              </h3>
              <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
                Tell us where you want to be in 90 days. We&apos;ll show you the
                shortest path — and the cost to get there.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center md:flex-col md:items-end">
              <MagneticButton
                variant="gradient"
                size="xl"
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Start a project
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <p className="text-xs text-muted-foreground">
                Or email{" "}
                <a
                  href="mailto:hello@peakmedia.agency"
                  className="text-electric underline-offset-4 hover:underline"
                >
                  hello@peakmedia.agency
                </a>
              </p>
            </div>
          </div>
        </Reveal>

        {/* ------------------- main grid ------------------- */}
        <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-3 md:grid-cols-12 md:py-16">
          {/* brand */}
          <Reveal
            variants={fadeUp}
            className="col-span-2 sm:col-span-3 md:col-span-4"
          >
            <div className="flex flex-col">
              <a href="#top" className="group inline-flex items-center gap-2.5">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-electric to-electric-2 text-white shadow-[0_0_24px_-6px_var(--electric-glow)]">
                  <PeakMark className="h-5 w-5" />
                </span>
                <span className="font-display text-lg font-semibold tracking-tight">
                  Peak<span className="text-electric">.</span>Media
                </span>
              </a>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                A premium growth partner for ambitious brands. We turn strategy,
                creative, and media into measurable pipeline.
              </p>

              <div className="mt-5 flex items-center gap-2">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-muted-foreground transition-all hover:border-electric/40 hover:bg-electric/10 hover:text-electric"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* link columns */}
          {COLUMNS.map((col, i) => (
            <Reveal
              key={col.title}
              variants={fadeUp}
              delay={0.05 * (i + 1)}
              className="col-span-1 md:col-span-2"
            >
              <FooterColumn column={col} />
            </Reveal>
          ))}

          {/* contact mini-card */}
          <Reveal
            variants={fadeUp}
            delay={0.2}
            className="col-span-2 md:col-span-2"
          >
            <div className="glass rounded-2xl p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Get in touch
              </p>
              <a
                href="mailto:hello@peakmedia.agency"
                className="mt-3 flex items-center gap-2 text-sm text-foreground transition-colors hover:text-electric"
              >
                <Mail className="h-4 w-4 text-electric" />
                hello@peakmedia.agency
              </a>
              <p className="mt-3 text-xs text-muted-foreground">
                Brooklyn, NY
                <br />
                Mon–Fri · 9–6 ET
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Currently accepting projects
              </div>
            </div>
          </Reveal>
        </div>

        {/* ------------------- bottom bar ------------------- */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Peak Media. Crafted for ambitious
            brands.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Cookies
            </a>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ column }: { column: Column }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {column.title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {column.links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="group inline-flex items-center text-sm text-foreground/80 transition-colors hover:text-electric"
            >
              <span className="relative">
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-electric transition-all duration-300 group-hover:w-full" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BackToTop() {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      aria-label="Back to top"
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 6,
        pointerEvents: visible ? "auto" : "none",
      }}
      transition={{ duration: 0.25 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-foreground transition-colors hover:border-electric/40 hover:bg-electric/10 hover:text-electric"
      )}
    >
      <ArrowUp className="h-3.5 w-3.5" />
      Top
    </motion.button>
  );
}

/* ------------------------------- icons ------------------------------- */

function PeakMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 20V8.5l8-5 8 5V20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M9 20v-6h6v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default Footer;
