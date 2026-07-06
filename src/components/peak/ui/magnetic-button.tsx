"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/use-magnetic";

const magneticButtonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric/60 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-electric text-white hover:bg-electric/90",
        gradient: "text-white",
        outline:
          "border border-white/15 bg-white/5 text-foreground hover:border-electric/60 hover:bg-electric/10 backdrop-blur",
        ghost: "text-foreground hover:text-electric",
        light: "bg-white text-ink hover:bg-white/90",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
        xl: "h-14 px-9 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface MagneticButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "ref">,
    VariantProps<typeof magneticButtonVariants> {
  strength?: number;
  href?: string;
}

export const MagneticButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  MagneticButtonProps
>(
  (
    { className, variant, size, strength = 0.35, children, href, onClick, ...props },
    ref
  ) => {
    const { ref: magRef, x, y, hovering } = useMagnetic<HTMLElement>(strength);

    React.useImperativeHandle(ref, () => magRef.current as HTMLElement);

    const commonProps = {
      animate: { x, y },
      transition: { type: "spring" as const, stiffness: 220, damping: 16, mass: 0.5 },
      className: cn(magneticButtonVariants({ variant, size }), className),
      ...(props as any),
    } as const;

    const inner = (
      <>
        {variant === "gradient" && (
          <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-electric via-[#2b6bff] to-electric-soft" />
        )}
        {(variant === "gradient" || variant === "primary") && (
          <span className="absolute inset-0 -z-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
        )}
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-20 rounded-full transition-opacity duration-300",
            hovering ? "opacity-100" : "opacity-0"
          )}
          style={{ boxShadow: "0 0 40px 0 var(--electric-glow)" }}
        />
      </>
    );

    if (href) {
      return (
        <motion.a
          ref={magRef as React.RefObject<HTMLAnchorElement>}
          href={href}
          onClick={onClick as any}
          {...commonProps}
        >
          {inner}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={magRef as React.RefObject<HTMLButtonElement>}
        onClick={onClick as any}
        {...commonProps}
      >
        {inner}
      </motion.button>
    );
  }
);
MagneticButton.displayName = "MagneticButton";
