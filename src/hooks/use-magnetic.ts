"use client";

import * as React from "react";

/**
 * Magnetic hover effect. Returns a ref to attach to an element, and motion
 * values for x/y translate. The element drifts toward the cursor while hovered.
 */
export function useMagnetic<T extends HTMLElement = HTMLDivElement>(
  strength = 0.4
) {
  const ref = React.useRef<T | null>(null);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [hovering, setHovering] = React.useState(false);

  const onMove = React.useCallback(
    (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      setPos({ x: relX * strength, y: relY * strength });
    },
    [strength]
  );

  const onLeave = React.useCallback(() => {
    setPos({ x: 0, y: 0 });
    setHovering(false);
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const enter = () => setHovering(true);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", onMove as EventListener);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", onMove as EventListener);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [onMove, onLeave]);

  return { ref, x: pos.x, y: pos.y, hovering };
}
