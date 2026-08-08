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
import { qrToDataUrl, VERIFY_BASE_URL } from "@/lib/qr";
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
  const firstName = cert.internName.split(" ")[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-xl shadow-black/20"
    >
      {/* inner page */}
      <div className="relative rounded-xl bg-white p-8 text-[#1f2430] sm:p-12">
        {/* subtle electric-blue corner accent (top-right) */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-44 w-44"
          style={{
            background:
              "linear-gradient(135deg, transparent 50%, rgba(10,132,255,0.10) 50%), repeating-linear-gradient(135deg, rgba(10,132,255,0.06) 0 8px, transparent 8px 16px)",
            WebkitMaskImage:
              "linear-gradient(225deg, #000 30%, transparent 75%)",
            maskImage: "linear-gradient(225deg, #000 30%, transparent 75%)",
          }}
        />

        {/* verified chip top-right */}
        <span className="absolute right-8 top-8 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-emerald-700 sm:right-12 sm:top-12">
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </span>

        {/* top brand */}
        <div className="relative z-10 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-electric to-[#2b6bff] font-display text-lg font-bold text-white">
            P
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold tracking-tight text-[#0b1220]">
              PeakMedia
            </div>
            <div className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-slate-500">
              The Growth Studio
            </div>
            <div className="text-[0.55rem] text-slate-400">
              By Peak Media Pvt. Ltd.
            </div>
          </div>
        </div>

        {/* meta bar */}
        <div className="relative z-10 mt-6 flex items-baseline justify-between border-b-[1.5px] border-[#0b1220] pb-3">
          <div className="text-xs text-slate-500">
            Date: <strong className="font-semibold text-[#1f2430]">{cert.issueDate}</strong>
          </div>
          <div className="font-mono text-xs tracking-wide text-[#1f2430]">
            RID: <span className="text-slate-500">{cert.id}</span>
          </div>
        </div>

        {/* title block */}
        <div className="relative z-10 mt-9">
          <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-electric">
            Internship Completion Certificate
          </p>
        </div>

        {/* body */}
        <div className="relative z-10 mt-6 space-y-3.5 text-[0.825rem] leading-relaxed text-[#2a3140] sm:text-sm">
          <p>
            <span className="mr-2 inline-block h-[2px] w-7 align-middle rounded bg-electric" />
            This is to certify that{" "}
            <strong className="font-semibold text-[#0b1220]">{cert.internName}</strong>{" "}
            has successfully completed a{" "}
            <strong className="font-semibold text-[#0b1220]">{cert.duration}</strong>{" "}
            internship at Peak Media, serving as a{" "}
            <strong className="font-semibold text-[#0b1220]">{cert.role}</strong> in the{" "}
            <strong className="font-semibold text-[#0b1220]">{cert.department}</strong>{" "}
            department at our{" "}
            <strong className="font-semibold text-[#0b1220]">{cert.location}</strong> office.
          </p>
          <p>
            The internship was held from{" "}
            <strong className="font-semibold text-[#0b1220]">{cert.startDate}</strong> to{" "}
            <strong className="font-semibold text-[#0b1220]">{cert.endDate}</strong>. 
          </p>

        </div>

        {/* details grid */}


        {/* skills */}


        {/* sign-off */}
        <div className="relative z-10 mt-9 flex flex-col items-center justify-center gap-6 sm:flex-row sm:items-start">
          <CertificateQR certId={cert.id} />
        </div>

        {/* footer */}
     
      </div>
    </motion.div>
  );
}

function DocDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-200 py-3 pr-4 sm:border-l sm:pl-4 sm:first:border-l-0 sm:first:pl-0">
      <p className="text-[0.55rem] uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#0b1220]">{value}</p>
    </div>
  );
}

/* Real, scannable QR → peakmedia.in/verify?id=<cert> */
function CertificateQR({ certId }: { certId: string }) {
  const verifyUrl = React.useMemo(
    () => `${VERIFY_BASE_URL}?id=${encodeURIComponent(certId)}`,
    [certId]
  );
  const [src, setSrc] = React.useState<string>("");
  React.useEffect(() => {
    let active = true;
    qrToDataUrl(verifyUrl, { width: 240 })
      .then((url) => {
        if (active) setSrc(url);
      })
      .catch(() => {
        /* leave empty */
      });
    return () => {
      active = false;
    };
  }, [verifyUrl]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="grid h-[84px] w-[84px] place-items-center rounded-lg border border-white/10 bg-white p-1.5 shadow-lg">
        {src ? (
          <img
            src={src}
            alt="QR code linking to the certificate verification page"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="h-full w-full animate-pulse rounded bg-muted" />
        )}
      </div>
      <span className="max-w-[110px] text-center text-[0.6rem] uppercase leading-tight tracking-wide text-muted-foreground">
        Scan to verify at{" "}
        <span className="font-medium text-electric">peakmedia.in/verify</span>
      </span>
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
