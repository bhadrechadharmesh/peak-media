import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionShellProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  children: React.ReactNode;
  containerClassName?: string;
}

export function SectionShell({
  id,
  children,
  className,
  containerClassName,
  ...props
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 py-20 md:py-28", className)}
      {...props}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-7xl px-5 sm:px-8",
          containerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
