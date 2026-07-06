"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";
import { Reveal } from "@/components/peak/ui/reveal";
import { MagneticButton } from "@/components/peak/ui/magnetic-button";
import { Input } from "@/components/ui/input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "done"
  >("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      toast.error("Enter a valid email", {
        description: "We promise not to spam — we just need a real inbox.",
      });
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("bad");
      setStatus("done");
      toast.success("You're on the list", {
        description: "First Peak Brief lands in your inbox Tuesday.",
      });
    } catch {
      toast.error("Could not subscribe", {
        description: "Please try again in a moment.",
      });
      setStatus("idle");
    }
  }

  function reset() {
    setEmail("");
    setStatus("idle");
  }

  return (
    <section
      id="newsletter"
      className="relative scroll-mt-24 overflow-hidden py-16 sm:py-20"
    >
      {/* decorative electric orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-electric/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-electric-soft/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-bg opacity-[0.18] mask-fade-x"
      />

      <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
        <Reveal variants={fadeUp}>
          <div className="glass relative overflow-hidden rounded-3xl px-6 py-10 text-center sm:px-12 sm:py-12">
            {/* top hairline */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/70 to-transparent"
            />
            <div
              aria-hidden
              className="absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-electric/20 blur-[80px]"
            />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-electric">
                <Sparkles className="h-3.5 w-3.5" />
                The Peak Brief
              </span>

              <h2 className="mx-auto mt-5 max-w-2xl text-balance font-display text-2xl font-semibold leading-[1.1] sm:text-3xl md:text-4xl">
                Get the Peak brief —{" "}
                <span className="text-gradient">weekly growth tactics</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-balance text-sm text-muted-foreground sm:text-base">
                One actionable email every Tuesday. Channel playbooks, teardowns
                of winning campaigns, and benchmarks — no fluff, unsubscribe in
                one click.
              </p>

              <div className="mx-auto mt-7 max-w-md">
                <AnimatePresence mode="wait" initial={false}>
                  {status === "done" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-6"
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 220,
                          damping: 14,
                          delay: 0.05,
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300"
                      >
                        <Check className="h-6 w-6" strokeWidth={2.5} />
                      </motion.span>
                      <p className="font-display text-lg font-semibold text-foreground">
                        You&apos;re in.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        First issue lands Tuesday at 7am ET.
                      </p>
                      <button
                        type="button"
                        onClick={reset}
                        className="mt-1 text-xs text-electric underline-offset-4 hover:underline"
                      >
                        Subscribe another email
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={onSubmit}
                      className="flex flex-col gap-2.5 sm:flex-row"
                    >
                      <div className="relative flex-1">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          required
                          aria-label="Email address"
                          className={cn(
                            "h-12 rounded-full border-white/15 bg-white/5 pl-10 pr-4 text-sm",
                            "placeholder:text-muted-foreground/70",
                            "focus-visible:border-electric/60 focus-visible:ring-electric/30"
                          )}
                        />
                      </div>
                      <MagneticButton
                        type="submit"
                        variant="gradient"
                        size="lg"
                        disabled={status === "loading"}
                        className="h-12 shrink-0"
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Subscribing…
                          </>
                        ) : (
                          <>
                            Subscribe
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </MagneticButton>
                    </motion.form>
                  )}
                </AnimatePresence>

                <p className="mt-3 text-[11px] text-muted-foreground/80">
                  Join 12,000+ operators. No spam, ever.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Newsletter;
