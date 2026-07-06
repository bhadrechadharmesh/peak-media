"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  MessageSquare,
  SendHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/peak/ui/magnetic-button";
import { Input } from "@/components/ui/input";

type Msg = {
  id: number;
  role: "bot" | "user";
  text: string;
  ts: number;
};

const QUICK_REPLIES = ["Pricing", "Services", "Book a call", "Festive campaigns"];

const CANNED_FALLBACK =
  "Great question — let me pull the right info for you. Could you share a bit more about your goal (signups, pipeline, brand awareness)? Or drop your email and a senior strategist will reach out within an hour.";

const WELCOME =
  "Hey there 👋 I'm Peak — your growth concierge at Peak Media. Ask me about pricing (in ₹), services, festive campaigns, or book a call with a strategist. What are you looking to grow?";

export function LiveChat() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Msg[]>([
    { id: 0, role: "bot", text: WELCOME, ts: Date.now() },
  ]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const [unread, setUnread] = React.useState(1);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const idRef = React.useRef(1);

  // auto-focus input when opened
  React.useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  // clear unread when opening
  React.useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  // autoscroll on new messages / typing
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, typing, open]);

  // close on Escape
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: Msg = {
      id: idRef.current++,
      role: "user",
      text: trimmed,
      ts: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) throw new Error("bad");
      const data = (await res.json()) as { reply?: string };
      const reply =
        data.reply && data.reply.trim().length > 0
          ? data.reply
          : CANNED_FALLBACK;
      setMessages((m) => [
        ...m,
        { id: idRef.current++, role: "bot", text: reply, ts: Date.now() },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: idRef.current++, role: "bot", text: CANNED_FALLBACK, ts: Date.now() },
      ]);
      toast.error("Connection hiccup", {
        description: "Showing a suggested reply. Try again in a moment.",
      });
    } finally {
      setTyping(false);
      if (!open) setUnread((u) => u + 1);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[55] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {/* ------------------------- panel ------------------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 24 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            style={{ transformOrigin: "bottom right" }}
            className="pointer-events-auto flex w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-white/12 bg-ink-2/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:w-[360px]"
          >
            {/* top hairline */}
            <div
              aria-hidden
              className="h-px w-full bg-gradient-to-r from-transparent via-electric/70 to-transparent"
            />

            {/* header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-electric to-electric-2 text-white shadow-[0_0_18px_-4px_var(--electric-glow)]">
                    <Bot className="h-5 w-5" />
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink-2 bg-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight text-foreground">
                    Peak Media
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-emerald-300">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    Typically replies instantly · IST
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* messages */}
            <div
              ref={scrollRef}
              className="no-scrollbar flex max-h-[58vh] min-h-[260px] flex-1 flex-col gap-3 overflow-y-auto bg-[radial-gradient(120%_60%_at_50%_0%,rgba(10,132,255,0.08),transparent_70%)] p-4"
            >
              {messages.map((m) => (
                <Bubble key={m.id} msg={m} />
              ))}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="flex items-end gap-2"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-electric to-electric-2 text-white">
                      <Bot className="h-3.5 w-3.5" />
                    </span>
                    <span className="glass inline-flex items-center gap-1 rounded-2xl rounded-bl-md px-3 py-2.5">
                      <Dot delay={0} />
                      <Dot delay={150} />
                      <Dot delay={300} />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* quick replies */}
            <div className="flex flex-wrap gap-1.5 border-t border-white/10 bg-white/[0.02] px-3 py-2.5">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={typing}
                  onClick={() => send(q)}
                  className="inline-flex items-center gap-1 rounded-full border border-electric/30 bg-electric/10 px-2.5 py-1 text-[11px] font-medium text-electric transition-all hover:bg-electric/20 disabled:opacity-50"
                >
                  <Sparkles className="h-3 w-3" />
                  {q}
                </button>
              ))}
            </div>

            {/* input */}
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 border-t border-white/10 bg-white/[0.03] p-2.5"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message…"
                aria-label="Type your message"
                className="h-10 flex-1 rounded-full border-white/10 bg-white/5 pl-4 pr-3 text-sm focus-visible:border-electric/60 focus-visible:ring-electric/30"
              />
              <MagneticButton
                type="submit"
                variant="gradient"
                size="sm"
                strength={0.2}
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="h-10 w-10 rounded-full px-0"
              >
                <SendHorizontal className="h-4 w-4" />
              </MagneticButton>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------- floating button ------------------------- */}
      <AnimatePresence>
        {!open && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, x: 12, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute bottom-2 right-16 hidden items-center gap-2 rounded-full border border-white/12 bg-ink-2/90 px-3.5 py-2 text-sm text-foreground shadow-lg backdrop-blur sm:flex"
          >
            <span className="text-gradient font-medium">Chat with Peak</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-electric" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-auto relative">
        {/* pulsing ring */}
        {!open && (
          <>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-electric/40"
              style={{ animation: "pulse-ring 2.2s ease-out infinite" }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-electric/30"
              style={{ animation: "pulse-ring 2.2s ease-out infinite 0.6s" }}
            />
          </>
        )}

        <MagneticButton
          type="button"
          variant={open ? "outline" : "gradient"}
          size="md"
          strength={0.25}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close chat" : "Open chat with Peak Media"}
          className={cn(
            "relative h-14 w-14 rounded-full px-0",
            !open && "shadow-[0_0_30px_-6px_var(--electric-glow)]"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="msg"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <MessageSquare className="h-6 w-6" />
              </motion.span>
            )}
          </AnimatePresence>

          {/* notification badge */}
          {!open && unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-ink bg-electric px-1 text-[10px] font-bold text-white shadow-[0_0_10px_var(--electric-glow)]">
              {unread}
            </span>
          )}
        </MagneticButton>
      </div>
    </div>
  );
}

/* ------------------------------ subcomponents ------------------------------ */

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex items-end gap-2", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-electric to-electric-2 text-white">
          <Bot className="h-3.5 w-3.5" />
        </span>
      )}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-md bg-gradient-to-br from-electric to-electric-2 text-white"
            : "glass rounded-bl-md text-foreground"
        )}
      >
        {msg.text}
      </div>
    </motion.div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="block h-1.5 w-1.5 rounded-full bg-electric"
      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay / 1000,
      }}
    />
  );
}

export default LiveChat;
