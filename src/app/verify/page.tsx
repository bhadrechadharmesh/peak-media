"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  Fingerprint,
  Database,
  Signature,
  FileCheck2,
  BadgeCheck,
  ArrowLeft,
  RefreshCw,
  Download,
  Share2,
  AlertTriangle,
  ScanLine,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CursorGlow } from "@/components/peak/cursor-glow";
import { MagneticButton } from "@/components/peak/ui/magnetic-button";

type Phase = "idle" | "verifying" | "valid" | "invalid";

interface Certificate {
  id: string;
  internName: string;
  role: string;
  department: string;
  startDate: string;
  endDate: string;
  duration: string;
  issueDate: string;
  mentor: string;
  grade: string;
  skills: string[];
  status: string;
  location: string;
  hash: string;
}

const SAMPLE_ID = "PM-INT-2025-0142";

const VERIFY_STEPS = [
  { label: "Parsing certificate identifier", icon: ScanLine },
  { label: "Connecting to Peak Media registry", icon: Database },
  { label: "Checking digital signature", icon: Signature },
  { label: "Validating issuer credentials", icon: Fingerprint },
  { label: "Cross-referencing internship records", icon: FileCheck2 },
  { label: "Confirming authenticity", icon: BadgeCheck },
];

export default function VerifyPage() {
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [input, setInput] = React.useState("");
  const [cert, setCert] = React.useState<Certificate | null>(null);
  const [verifiedAt, setVerifiedAt] = React.useState<string>("");
  const [error, setError] = React.useState("");
  const [stepIndex, setStepIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const apiResultRef = React.useRef<any>(null);
  const [submittedId, setSubmittedId] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (!value) {
      toast.error("Enter a certificate number to verify.");
      return;
    }
    setSubmittedId(value);
    apiResultRef.current = null;
    setCert(null);
    setError("");
    setStepIndex(0);
    setProgress(0);
    setPhase("verifying");

    fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ certificateNumber: value }),
    })
      .then((r) => r.json())
      .then((data) => {
        apiResultRef.current = data;
      })
      .catch(() => {
        apiResultRef.current = {
          ok: false,
          error: "Network error. Please try again.",
        };
      });
  }

  function useSample() {
    setInput(SAMPLE_ID);
    toast.info("Sample certificate loaded — click Verify.");
  }

  function reset() {
    setPhase("idle");
    setInput("");
    setCert(null);
    setError("");
    setStepIndex(0);
    setProgress(0);
    setSubmittedId("");
    apiResultRef.current = null;
  }

  // Drive the cinematic verification animation.
  React.useEffect(() => {
    if (phase !== "verifying") return;
    let s = 0;
    const stepInt = setInterval(() => {
      s = Math.min(s + 1, VERIFY_STEPS.length);
      setStepIndex(s);
      if (s >= VERIFY_STEPS.length) clearInterval(stepInt);
    }, 560);
    let p = 0;
    const progInt = setInterval(() => {
      p = Math.min(100, p + 2);
      setProgress(p);
      if (p >= 100) clearInterval(progInt);
    }, 68);
    const finish = setTimeout(() => {
      clearInterval(stepInt);
      clearInterval(progInt);
      setStepIndex(VERIFY_STEPS.length);
      setProgress(100);
      const data = apiResultRef.current;
      if (data?.ok && data.certificate) {
        setCert(data.certificate);
        setVerifiedAt(data.verifiedAt || new Date().toISOString());
        setPhase("valid");
      } else {
        setError(data?.error || "Verification failed.");
        setPhase("invalid");
      }
    }, 3650);
    return () => {
      clearInterval(stepInt);
      clearInterval(progInt);
      clearTimeout(finish);
    };
  }, [phase]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <CursorGlow />

      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-30 mask-radial" />
        <div className="absolute left-1/2 top-[-15%] h-[55vh] w-[70vw] -translate-x-1/2 rounded-full bg-electric/12 blur-[150px]" />
        <div className="absolute bottom-[-15%] right-[-5%] h-[40vh] w-[40vw] rounded-full bg-[#2b6bff]/10 blur-[120px]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="group flex items-center gap-2.5">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-electric to-[#2b6bff] text-white shadow-lg shadow-electric/30">
              <span className="font-display text-lg font-bold leading-none">P</span>
              <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/30" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Peak<span className="text-electric">Media</span>
            </span>
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-electric/50 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <IdleView
                key="idle"
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                onUseSample={useSample}
              />
            )}
            {phase === "verifying" && (
              <VerifyingView
                key="verifying"
                id={submittedId}
                stepIndex={stepIndex}
                progress={progress}
              />
            )}
            {phase === "valid" && cert && (
              <ValidView
                key="valid"
                cert={cert}
                verifiedAt={verifiedAt}
                onReset={reset}
              />
            )}
            {phase === "invalid" && (
              <InvalidView
                key="invalid"
                id={submittedId}
                error={error}
                onReset={reset}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Slim footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:px-8">
          <span>© 2025 Peak Media. Made in India 🇮🇳.</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-electric" />
            Registry secured · GSTIN: 27ABCDE1234F1Z5
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ----------------------------- Idle form ----------------------------- */
function IdleView({
  input,
  setInput,
  onSubmit,
  onUseSample,
}: {
  input: string;
  setInput: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onUseSample: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-3xl p-7 sm:p-10"
    >
      <div className="mb-7 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 14 }}
          className="relative mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-electric to-[#2b6bff] text-white shadow-xl shadow-electric/30"
        >
          <ShieldCheck className="h-8 w-8" />
          <span className="absolute -inset-1 -z-10 rounded-2xl bg-electric/30 blur-lg" />
        </motion.div>
        <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-electric">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-electric" />
          </span>
          Official Registry
        </span>
        <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl">
          Verify Internship Certificate
        </h1>
        <p className="mt-3 max-w-md text-balance text-sm text-muted-foreground sm:text-base">
          Enter the certificate number issued by Peak Media to instantly confirm
          its authenticity, intern details, and completion status.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label htmlFor="cert" className="sr-only">
          Certificate number
        </label>
        <div className="group relative">
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-electric">
            <Fingerprint className="h-5 w-5" />
          </div>
          <input
            id="cert"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. PM-INT-2025-0142"
            autoComplete="off"
            spellCheck={false}
            className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-center font-mono text-base uppercase tracking-[0.15em] text-foreground placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground/60 focus:border-electric/60 focus:outline-none focus:ring-2 focus:ring-electric/30 sm:text-lg"
          />
        </div>

        <MagneticButton
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full"
        >
          <Search className="h-5 w-5" />
          Verify Certificate
        </MagneticButton>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 text-center">
        <button
          type="button"
          onClick={onUseSample}
          className="inline-flex items-center gap-1.5 text-sm text-electric transition-colors hover:text-electric-soft"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Try a sample certificate
        </button>
        <p className="text-xs text-muted-foreground">
          Format: <span className="font-mono">PM-INT-YYYY-####</span> · Verified
          in real time against Peak Media's registry.
        </p>
      </div>
    </motion.div>
  );
}

/* --------------------------- Verifying view -------------------------- */
function VerifyingView({
  id,
  stepIndex,
  progress,
}: {
  id: string;
  stepIndex: number;
  progress: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="glass overflow-hidden rounded-3xl p-7 sm:p-10"
    >
      {/* Radar */}
      <div className="mb-7 flex flex-col items-center">
        <div className="relative h-40 w-40">
          {/* rings */}
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="absolute inset-0 rounded-full border border-electric/20"
              style={{ transform: `scale(${1 - i * 0.22})` }}
            />
          ))}
          {/* crosshair */}
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-electric/15" />
          <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-electric/15" />
          {/* rotating beam */}
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(10,132,255,0.35) 40deg, transparent 80deg)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
          {/* center icon */}
          <div className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-electric/20 backdrop-blur-sm">
            <Fingerprint className="h-6 w-6 text-electric" />
          </div>
          {/* ping */}
          <motion.span
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric"
            animate={{ scale: [1, 2.4], opacity: [0.8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        </div>

        <motion.p
          key={id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 text-center font-mono text-sm uppercase tracking-[0.18em] text-electric"
        >
          {id}
        </motion.p>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Scanning Peak Media secure registry…
        </p>
      </div>

      {/* Steps */}
      <ul className="mx-auto mb-6 max-w-md space-y-2.5">
        {VERIFY_STEPS.map((step, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          const Icon = step.icon;
          return (
            <li
              key={step.label}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-300",
                done && "border-electric/30 bg-electric/5 text-foreground",
                active && "border-electric/50 bg-electric/10 text-foreground glow-sm",
                !done && !active && "border-white/5 bg-white/[0.02] text-muted-foreground/60"
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                  done && "bg-electric/20 text-electric",
                  active && "bg-electric/20 text-electric",
                  !done && !active && "bg-white/5 text-muted-foreground/50"
                )}
              >
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.span
                      key="done"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 16 }}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </motion.span>
                  ) : active ? (
                    <motion.span
                      key="active"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, rotate: 360 }}
                      transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
                    >
                      <Loader2 className="h-4 w-4" />
                    </motion.span>
                  ) : (
                    <Icon key="idle" className="h-4 w-4" />
                  )}
                </AnimatePresence>
              </span>
              <span className="flex-1">{step.label}</span>
              {done && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-medium text-electric"
                >
                  OK
                </motion.span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Progress bar */}
      <div className="mx-auto max-w-md">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Verification progress</span>
          <span className="font-mono text-electric">{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-electric-soft via-electric to-electric-2"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ----------------------------- Valid view ---------------------------- */
function ValidView({
  cert,
  verifiedAt,
  onReset,
}: {
  cert: Certificate;
  verifiedAt: string;
  onReset: () => void;
}) {
  const [downloading, setDownloading] = React.useState(false);
  const verifiedLabel = React.useMemo(() => {
    try {
      return new Date(verifiedAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return new Date().toLocaleString("en-IN");
    }
  }, [verifiedAt]);

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    const toastId = toast.loading("Generating your PDF certificate…");
    try {
      const res = await fetch(
        `/api/verify/pdf?id=${encodeURIComponent(cert.id)}`
      );
      if (!res.ok) {
        throw new Error("Download failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Peak-Media-Certificate-${cert.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Certificate PDF downloaded.", { id: toastId });
    } catch (err) {
      console.error("[download pdf]", err);
      toast.error("Could not generate the PDF. Please try again.", {
        id: toastId,
      });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
      {/* Success banner */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.05 }}
        className="glass flex items-center gap-4 rounded-2xl border border-emerald-400/20 p-5"
      >
        <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">
          <CheckCircle2 className="h-7 w-7" />
          <motion.span
            className="absolute inset-0 rounded-xl border border-emerald-400/40"
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold text-foreground">Certificate Verified</p>
          <p className="text-sm text-muted-foreground">
            This is a genuine Peak Media internship certificate.
          </p>
        </div>
        <span className="hidden rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 sm:inline">
          Verified · {verifiedLabel} IST
        </span>
      </motion.div>

      {/* Certificate document */}
      <CertificateDocument cert={cert} />

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <MagneticButton variant="outline" size="md" onClick={onReset}>
          <RefreshCw className="h-4 w-4" />
          Verify another
        </MagneticButton>
        <MagneticButton
          variant="ghost"
          size="md"
          onClick={() => toast.success("Certificate details copied to clipboard.")}
        >
          <Share2 className="h-4 w-4" />
          Share
        </MagneticButton>
        <MagneticButton
          variant="primary"
          size="md"
          onClick={handleDownload}
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {downloading ? "Generating…" : "Download PDF"}
        </MagneticButton>
      </div>
    </motion.div>
  );
}

function CertificateDocument({ cert }: { cert: Certificate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-1"
    >
      {/* inner frame */}
      <div className="relative rounded-[1.35rem] border border-electric/15 bg-background/60 p-6 sm:p-9">
        {/* corner ornaments */}
        {[
          "left-3 top-3",
          "right-3 top-3 rotate-90",
          "left-3 bottom-3 -rotate-90",
          "right-3 bottom-3 rotate-180",
        ].map((c) => (
          <span
            key={c}
            className={cn(
              "pointer-events-none absolute h-6 w-6 border-l-2 border-t-2 border-electric/40",
              c
            )}
          />
        ))}

        {/* watermark */}
        <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 rotate-[-24deg] select-none font-display text-[7rem] font-bold leading-none text-electric/[0.04]">
          VERIFIED
        </span>

        {/* header */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-electric to-[#2b6bff] text-white">
              <span className="font-display text-base font-bold">P</span>
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              Peak<span className="text-electric">Media</span>
            </span>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Certificate of Internship
          </span>
        </div>

        <div className="relative mt-7 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            This is to certify that
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold sm:text-4xl">
            <span className="text-gradient">{cert.internName}</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            has successfully completed a{" "}
            <span className="font-medium text-foreground">{cert.duration}</span>{" "}
            internship as
          </p>
          <p className="mt-1 text-lg font-medium text-foreground sm:text-xl">
            {cert.role}
          </p>
          <p className="text-sm text-muted-foreground">
            in the {cert.department} department · {cert.location} office
          </p>
        </div>

        {/* details grid */}
        <div className="relative mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Detail label="Start date" value={cert.startDate} />
          <Detail label="End date" value={cert.endDate} />
          <Detail label="Issued on" value={cert.issueDate} />
          <Detail label="Grade" value={cert.grade} accent />
        </div>

        {/* skills */}
        <div className="relative mt-5">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Skills demonstrated
          </p>
          <div className="flex flex-wrap gap-2">
            {cert.skills.map((s) => (
              <span
                key={s}
                className="rounded-full border border-electric/25 bg-electric/10 px-3 py-1 text-xs text-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* footer row: mentor signature + QR + seal */}
        <div className="relative mt-8 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Mentor
            </p>
            <p className="mt-1 font-display text-lg italic text-foreground">
              {cert.mentor}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Senior Strategist, Peak Media
            </p>
          </div>

          <FauxQR value={cert.id + cert.hash} />

          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: -12 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 14 }}
              className="relative grid h-20 w-20 place-items-center rounded-full border-2 border-electric/50 bg-electric/10"
            >
              <div className="absolute inset-1.5 rounded-full border border-electric/30" />
              <div className="text-center">
                <ShieldCheck className="mx-auto h-5 w-5 text-electric" />
                <span className="block text-[0.5rem] font-bold uppercase tracking-wider text-electric">
                  Verified
                </span>
              </div>
            </motion.div>
            <span className="mt-1.5 font-mono text-[0.6rem] text-muted-foreground">
              {cert.id}
            </span>
          </div>
        </div>

        {/* hash line */}
        <div className="relative mt-5 flex items-center justify-between rounded-xl bg-white/[0.03] px-3.5 py-2.5 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Fingerprint className="h-3.5 w-3.5 text-electric" />
            Registry hash
          </span>
          <span className="truncate pl-3 font-mono text-foreground/80">
            {cert.hash}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Detail({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5">
      <p className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-sm font-semibold",
          accent ? "text-electric" : "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}

/* Faux QR — deterministic pattern derived from the value, with finder squares */
function generateQrCells(value: string): boolean[][] {
  const size = 21;
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const rng = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    h = h >>> 0;
    return (h & 0xffffff) / 0xffffff;
  };
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => rng() > 0.5)
  );
  const finder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const center = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[r0 + r][c0 + c] = edge || center;
      }
    }
    // quiet ring
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        if (r === -1 || r === 7 || c === -1 || c === 7) {
          const rr = r0 + r;
          const cc = c0 + c;
          if (rr >= 0 && rr < size && cc >= 0 && cc < size) grid[rr][cc] = false;
        }
      }
    }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);
  return grid;
}

function FauxQR({ value }: { value: string }) {
  const cells = React.useMemo(() => generateQrCells(value), [value]);
  return (
    <div
      className="grid h-[84px] w-[84px] gap-0 rounded-lg border border-white/10 bg-white p-1.5"
      style={{ gridTemplateColumns: "repeat(21, minmax(0, 1fr))" }}
    >
      {cells.flat().map((on, i) => (
        <span
          key={i}
          className={cn("block", on ? "bg-ink" : "bg-transparent")}
          style={{ aspectRatio: "1 / 1" }}
        />
      ))}
    </div>
  );
}

/* ---------------------------- Invalid view --------------------------- */
function InvalidView({
  id,
  error,
  onReset,
}: {
  id: string;
  error: string;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-3xl p-7 text-center sm:p-10"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="relative mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-red-500/15 text-red-400"
      >
        <XCircle className="h-8 w-8" />
        <motion.span
          className="absolute inset-0 rounded-2xl border border-red-400/40"
          animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.div>

      <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-red-300">
        <AlertTriangle className="h-3.5 w-3.5" />
        Not Verified
      </span>
      <h1 className="text-balance text-2xl font-semibold sm:text-3xl">
        Certificate not found
      </h1>
      <p className="mx-auto mt-3 max-w-md text-balance text-sm text-muted-foreground">
        {error} The number{" "}
        <span className="font-mono text-foreground/80">{id}</span> does not match
        any record in Peak Media's registry.
      </p>

      <div className="mx-auto mt-6 max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Things to check
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
            Ensure the format is <span className="font-mono text-foreground/80">PM-INT-YYYY-####</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
            Check for typos, extra spaces, or missing hyphens.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
            Only certificates issued by Peak Media can be verified here.
          </li>
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <MagneticButton variant="gradient" size="md" onClick={onReset}>
          <RefreshCw className="h-4 w-4" />
          Try another number
        </MagneticButton>
        <MagneticButton
          variant="ghost"
          size="md"
          onClick={() =>
            toast.info("Email hello@peakmedia.in for verification support.")
          }
        >
          Contact support
        </MagneticButton>
      </div>
    </motion.div>
  );
}
