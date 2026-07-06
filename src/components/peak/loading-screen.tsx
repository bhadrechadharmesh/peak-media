"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Premium loading screen — electric ring + wordmark. Fades out after first paint.
 * Uses sessionStorage so it only plays once per session.
 */
export function LoadingScreen() {
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
        >
          <div
            aria-hidden
            className="absolute inset-0 grid-bg opacity-40 mask-radial"
          />
          <div className="relative flex flex-col items-center gap-6">
            <div className="relative h-20 w-20">
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-electric/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="absolute inset-0 rounded-full border-t-2 border-electric"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ boxShadow: "0 0 24px var(--electric-glow)" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-2xl font-bold text-gradient">
                  P
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.4em] text-muted-foreground">
              <span>P</span>
              <span>e</span>
              <span>a</span>
              <span>k</span>
              <span className="ml-3 text-electric">Media</span>
            </div>
            <div className="h-px w-40 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-electric-soft to-electric"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
