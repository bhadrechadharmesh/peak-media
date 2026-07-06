"use client";

import * as React from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, ArrowUpRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { MagneticButton } from "./ui/magnetic-button";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Work", href: "#work" },
  { label: "Results", href: "#results" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  React.useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6">
          <div
            className={cn(
              "flex h-16 items-center justify-between rounded-2xl px-4 transition-all duration-300 sm:px-5",
              scrolled
                ? "glass glow-sm"
                : "border border-transparent bg-transparent"
            )}
          >
            <a href="#top" className="group flex items-center gap-2.5">
              <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-electric to-[#2b6bff] text-white shadow-lg shadow-electric/30">
                <span className="font-display text-lg font-bold leading-none">
                  P
                </span>
                <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/30" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                Peak<span className="text-electric">Media</span>
              </span>
            </a>

            <nav className="hidden items-center gap-1 lg:flex">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="group relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                  <span className="absolute inset-x-4 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-electric to-electric-soft transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:text-electric"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
              <div className="hidden sm:block">
                <MagneticButton href="#contact" variant="gradient" size="sm">
                  Start a project
                  <ArrowUpRight className="h-4 w-4" />
                </MagneticButton>
              </div>
              <button
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        {/* scroll progress */}
        <motion.div
          className="mx-auto mt-1 h-px max-w-7xl origin-left bg-gradient-to-r from-electric-soft via-electric to-electric-2 px-6"
          style={{ scaleX: progress }}
        />
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col gap-2 border-l border-white/10 bg-ink-2 p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-lg font-semibold">
                  Peak<span className="text-electric">Media</span>
                </span>
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                  className="flex items-center justify-between border-b border-white/5 py-3 text-lg font-medium"
                >
                  {l.label}
                  <ArrowUpRight className="h-4 w-4 text-electric" />
                </motion.a>
              ))}
              <MagneticButton
                href="#contact"
                variant="gradient"
                size="lg"
                className="mt-6 w-full"
                onClick={() => setOpen(false)}
              >
                Start a project
                <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
