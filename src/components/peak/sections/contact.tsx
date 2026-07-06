"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { Reveal } from "@/components/peak/ui/reveal";
import { SectionShell } from "@/components/peak/ui/section-shell";
import { SectionHeading } from "@/components/peak/ui/section-heading";
import { MagneticButton } from "@/components/peak/ui/magnetic-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

/* ----------------------------- types & config ---------------------------- */

type FormState = {
  name: string;
  email: string;
  company: string;
  role: string;
  services: string[];
  budget: string;
  goals: string;
  date: Date | undefined;
  timeSlot: string;
  message: string;
};

const SERVICES = [
  "Branding",
  "SEO",
  "Social",
  "Paid Ads",
  "Web Design",
  "Content",
] as const;

const BUDGETS = ["<$5k", "$5k–$15k", "$15k–$50k", "$50k+"] as const;

const TIME_SLOTS = ["Morning", "Afternoon", "Evening"] as const;

const STEPS = ["About you", "Your project", "Schedule"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ------------------------------ helpers ------------------------------ */

function isStepValid(step: number, f: FormState): boolean {
  if (step === 0) {
    return (
      f.name.trim().length > 1 &&
      EMAIL_RE.test(f.email) &&
      f.company.trim().length > 0 &&
      f.role.trim().length > 0
    );
  }
  if (step === 1) {
    return f.services.length > 0 && f.budget.length > 0;
  }
  // step 2
  return !!f.date && f.timeSlot.length > 0;
}

/* ------------------------------ component ------------------------------ */

export function Contact() {
  const [step, setStep] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [form, setForm] = React.useState<FormState>({
    name: "",
    email: "",
    company: "",
    role: "",
    services: [],
    budget: "",
    goals: "",
    date: undefined,
    timeSlot: "",
    message: "",
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const toggleService = (s: string) =>
    setForm((p) => ({
      ...p,
      services: p.services.includes(s)
        ? p.services.filter((x) => x !== s)
        : [...p.services, s],
    }));

  const canNext = isStepValid(step, form);
  const progress = ((step + 1) / STEPS.length) * 100;

  async function onSubmit() {
    if (!canNext) return;
    setSubmitting(true);
    try {
      const composedMessage = [
        form.goals && `Project goals: ${form.goals}`,
        form.timeSlot && `Preferred time: ${form.timeSlot}`,
        form.message && `Note: ${form.message}`,
      ]
        .filter(Boolean)
        .join("\n\n");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          services: form.services,
          budget: form.budget,
          message: composedMessage,
          date: form.date ? form.date.toISOString() : null,
        }),
      });
      if (!res.ok) throw new Error("bad");
      setDone(true);
      toast.success("Submission received", {
        description: "We'll reach out within 1 business day.",
      });
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again or email hello@peakmedia.agency.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function resetAll() {
    setForm({
      name: "",
      email: "",
      company: "",
      role: "",
      services: [],
      budget: "",
      goals: "",
      date: undefined,
      timeSlot: "",
      message: "",
    });
    setStep(0);
    setDone(false);
  }

  return (
    <SectionShell id="contact" className="relative overflow-hidden">
      {/* decorative orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-electric/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-electric-soft/15 blur-[140px]"
      />

      <SectionHeading
        eyebrow="Start a project"
        title={
          <>
            Let&apos;s build your <span className="text-gradient">growth engine</span>
          </>
        }
        description="Tell us where you are and where you want to go. We'll turn it into a measurable plan within one business day."
      />

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
        {/* ------------------------------ LEFT: form ------------------------------ */}
        <Reveal variants={fadeUp} className="h-full">
          <div className="glass relative h-full overflow-hidden rounded-3xl p-6 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/60 to-transparent"
            />

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-h-[460px] flex-col items-center justify-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 14,
                      delay: 0.1,
                    }}
                    className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-electric/15 text-electric glow-sm"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 animate-ping rounded-full bg-electric/30"
                      style={{ animationDuration: "2.4s" }}
                    />
                    <Check className="relative h-10 w-10" strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="font-display text-2xl font-semibold sm:text-3xl">
                    Thanks, {form.name.split(" ")[0] || "there"}.
                  </h3>
                  <p className="mt-3 max-w-sm text-balance text-sm text-muted-foreground sm:text-base">
                    We&apos;ll reach out within{" "}
                    <span className="text-foreground">1 business day</span> to
                    schedule your strategy call.
                  </p>
                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    <MagneticButton
                      variant="gradient"
                      size="md"
                      onClick={resetAll}
                    >
                      <Plus className="h-4 w-4" /> Book another project
                    </MagneticButton>
                    <Button variant="outline" asChild>
                      <a href="#faq">Read the FAQ</a>
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* progress */}
                  <div className="mb-7">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-medium uppercase tracking-[0.18em] text-electric">
                        Step {step + 1} / {STEPS.length} · {STEPS[step]}
                      </span>
                      <span className="text-muted-foreground">
                        {Math.round(progress)}% complete
                      </span>
                    </div>
                    <Progress
                      value={progress}
                      className="h-1.5 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-electric-soft [&>div]:via-electric [&>div]:to-electric-2"
                    />
                    <div className="mt-3 flex gap-2">
                      {STEPS.map((label, i) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => {
                            if (i < step || (i === step + 1 && canNext))
                              setStep(i);
                          }}
                          disabled={i > step && !(i <= step + 1 && canNext)}
                          className={cn(
                            "flex-1 rounded-md border px-2 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-all sm:text-xs",
                            i === step
                              ? "border-electric/40 bg-electric/10 text-electric"
                              : i < step
                                ? "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                                : "border-white/5 bg-transparent text-muted-foreground/50"
                          )}
                        >
                          {i < step && <Check className="mr-1 inline h-3 w-3" />}
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* ---------- STEP 1: About you ---------- */}
                      {step === 0 && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Full name" htmlFor="cf-name">
                              <Input
                                id="cf-name"
                                value={form.name}
                                onChange={(e) =>
                                  set("name", e.target.value)
                                }
                                placeholder="Jordan Avery"
                                autoComplete="name"
                              />
                            </Field>
                            <Field
                              label="Work email"
                              htmlFor="cf-email"
                              invalid={
                                form.email.length > 0 &&
                                !EMAIL_RE.test(form.email)
                              }
                            >
                              <Input
                                id="cf-email"
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                  set("email", e.target.value)
                                }
                                placeholder="jordan@company.com"
                                autoComplete="email"
                                className={
                                  form.email.length > 0 &&
                                  !EMAIL_RE.test(form.email)
                                    ? "border-destructive/60"
                                    : ""
                                }
                              />
                            </Field>
                          </div>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Company" htmlFor="cf-company">
                              <Input
                                id="cf-company"
                                value={form.company}
                                onChange={(e) =>
                                  set("company", e.target.value)
                                }
                                placeholder="Northwind Inc."
                                autoComplete="organization"
                              />
                            </Field>
                            <Field label="Role" htmlFor="cf-role">
                              <Input
                                id="cf-role"
                                value={form.role}
                                onChange={(e) =>
                                  set("role", e.target.value)
                                }
                                placeholder="Head of Growth"
                                autoComplete="organization-title"
                              />
                            </Field>
                          </div>
                          <p className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                            <Sparkles className="h-3.5 w-3.5 text-electric" />
                            We respect your inbox — no spam, ever.
                          </p>
                        </div>
                      )}

                      {/* ---------- STEP 2: Project ---------- */}
                      {step === 1 && (
                        <div className="space-y-6">
                          <Field label="Services needed">
                            <div className="flex flex-wrap gap-2 pt-1">
                              {SERVICES.map((s) => {
                                const active = form.services.includes(s);
                                return (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => toggleService(s)}
                                    className={cn(
                                      "group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-all",
                                      active
                                        ? "border-electric bg-electric text-white shadow-[0_0_20px_-6px_var(--electric-glow)]"
                                        : "border-white/15 bg-white/5 text-muted-foreground hover:border-electric/50 hover:text-foreground"
                                    )}
                                  >
                                    {active ? (
                                      <Check className="h-3.5 w-3.5" />
                                    ) : (
                                      <Plus className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                                    )}
                                    {s}
                                  </button>
                                );
                              })}
                            </div>
                          </Field>

                          <Field label="Monthly budget">
                            <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4">
                              {BUDGETS.map((b) => {
                                const active = form.budget === b;
                                return (
                                  <button
                                    key={b}
                                    type="button"
                                    onClick={() => set("budget", b)}
                                    className={cn(
                                      "rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition-all",
                                      active
                                        ? "border-electric bg-electric/15 text-electric"
                                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-electric/40 hover:text-foreground"
                                    )}
                                  >
                                    {b}
                                  </button>
                                );
                              })}
                            </div>
                          </Field>

                          <Field
                            label="Project goals"
                            htmlFor="cf-goals"
                            optional
                          >
                            <Textarea
                              id="cf-goals"
                              value={form.goals}
                              onChange={(e) => set("goals", e.target.value)}
                              placeholder="e.g. Double qualified pipeline in 6 months while keeping CAC under $240."
                              className="min-h-24 resize-none"
                            />
                          </Field>
                        </div>
                      )}

                      {/* ---------- STEP 3: Schedule ---------- */}
                      {step === 2 && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Preferred date" htmlFor="cf-date">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    id="cf-date"
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                      "h-9 w-full justify-start bg-white/5 text-left font-normal",
                                      !form.date && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarDays className="h-4 w-4 text-electric" />
                                    {form.date
                                      ? format(form.date, "PPP")
                                      : "Pick a date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={form.date}
                                    onSelect={(d) => set("date", d)}
                                    disabled={(d) => d < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </Field>
                            <Field label="Time slot">
                              <div className="grid grid-cols-3 gap-2 pt-0.5">
                                {TIME_SLOTS.map((t) => {
                                  const active = form.timeSlot === t;
                                  return (
                                    <button
                                      key={t}
                                      type="button"
                                      onClick={() => set("timeSlot", t)}
                                      className={cn(
                                        "rounded-lg border px-2 py-2 text-xs font-medium transition-all",
                                        active
                                          ? "border-electric bg-electric/15 text-electric"
                                          : "border-white/10 bg-white/5 text-muted-foreground hover:border-electric/40 hover:text-foreground"
                                      )}
                                    >
                                      {t}
                                    </button>
                                  );
                                })}
                              </div>
                            </Field>
                          </div>

                          <Field
                            label="Anything else?"
                            htmlFor="cf-msg"
                            optional
                          >
                            <Textarea
                              id="cf-msg"
                              value={form.message}
                              onChange={(e) =>
                                set("message", e.target.value)
                              }
                              placeholder="Context that'll make our first call sharper — current stack, blockers, timeline."
                              className="min-h-24 resize-none"
                            />
                          </Field>

                          <div className="flex items-start gap-2 rounded-xl border border-electric/20 bg-electric/5 p-3 text-xs text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                            By submitting, you agree to be contacted by Peak
                            Media about your project. No spam, unsubscribe
                            anytime.
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* nav buttons */}
                  <div className="mt-7 flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      disabled={step === 0}
                      className="text-muted-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>

                    {step < STEPS.length - 1 ? (
                      <MagneticButton
                        type="button"
                        variant="gradient"
                        size="md"
                        onClick={() => canNext && setStep((s) => s + 1)}
                        // disable by passing disabled attr
                        {...(canNext ? {} : { disabled: true })}
                      >
                        Continue <ArrowRight className="h-4 w-4" />
                      </MagneticButton>
                    ) : (
                      <MagneticButton
                        type="button"
                        variant="gradient"
                        size="md"
                        onClick={onSubmit}
                        disabled={submitting || !canNext}
                      >
                        {submitting ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Submit inquiry <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </MagneticButton>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        {/* ------------------------------ RIGHT: supporting info ------------------------------ */}
        <Reveal variants={fadeUp} delay={0.1} className="h-full">
          <div className="flex h-full flex-col gap-5">
            {/* what happens next */}
            <div className="glass rounded-3xl p-6 sm:p-7">
              <h3 className="font-display text-lg font-semibold">
                What happens next
              </h3>
              <ol className="mt-5 space-y-4">
                {[
                  {
                    n: "1",
                    t: "Strategy call within 24h",
                    d: "A senior strategist reviews your goals and audits current performance.",
                  },
                  {
                    n: "2",
                    t: "Custom growth audit",
                    d: "We map quick wins, channel mix, and a 90-day plan tailored to you.",
                  },
                  {
                    n: "3",
                    t: "Proposal in 5 days",
                    d: "Clear scope, milestones, KPIs, and pricing — no vague retainers.",
                  },
                ].map((item, i) => (
                  <motion.li
                    key={item.n}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="flex gap-3.5"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-electric/15 text-xs font-semibold text-electric">
                      {item.n}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.t}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {item.d}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>

            {/* contact methods */}
            <div className="glass rounded-3xl p-6 sm:p-7">
              <h3 className="font-display text-lg font-semibold">
                Other ways to reach us
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric/10 text-electric">
                    <Mail className="h-4 w-4" />
                  </span>
                  <a
                    href="mailto:hello@peakmedia.agency"
                    className="text-foreground transition-colors hover:text-electric"
                  >
                    hello@peakmedia.agency
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric/10 text-electric">
                    <Phone className="h-4 w-4" />
                  </span>
                  <a
                    href="tel:+18005551234"
                    className="text-foreground transition-colors hover:text-electric"
                  >
                    +1 (800) 555-1234
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric/10 text-electric">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="text-muted-foreground">
                    HQ · Brooklyn, NY
                  </span>
                </li>
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Available now
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> Avg reply 4h
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5" /> Mon–Fri
                </span>
              </div>
            </div>

            {/* decorative map-ish panel */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-electric/20 via-ink-2 to-ink p-6 sm:p-7">
              <div aria-hidden className="absolute inset-0 grid-bg opacity-40" />
              <div
                aria-hidden
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-electric/30 blur-3xl"
              />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.18em] text-electric-soft">
                  Coverage
                </p>
                <p className="mt-2 font-display text-xl font-semibold">
                  Clients across 14 countries
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Remote-first · in-person on request
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

/* ------------------------------ subcomponents ------------------------------ */

function Field({
  label,
  htmlFor,
  children,
  optional,
  invalid,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  optional?: boolean;
  invalid?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs text-muted-foreground">
        {label}
        {optional && (
          <span className="ml-1 text-[10px] uppercase tracking-wider opacity-60">
            optional
          </span>
        )}
        {invalid && (
          <span className="ml-1 text-[10px] uppercase tracking-wider text-destructive">
            invalid
          </span>
        )}
      </Label>
      {children}
    </div>
  );
}

/* local alias kept for clarity — CalendarDays imported from lucide-react */

export default Contact;
