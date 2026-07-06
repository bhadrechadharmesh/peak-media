"use client";

import * as React from "react";
import {
  Aperture,
  Cloud,
  Compass,
  Crown,
  Flame,
  Globe,
  Hexagon,
  Orbit,
  Spline,
  Sun,
  Triangle,
  Waves,
  type LucideIcon,
} from "lucide-react";

interface Client {
  name: string;
  icon: LucideIcon;
}

const ROW_A: Client[] = [
  { name: "NORTHWIND", icon: Hexagon },
  { name: "Lumen", icon: Sun },
  { name: "Vertex", icon: Triangle },
  { name: "Quanta", icon: Aperture },
  { name: "Helix", icon: Spline },
  { name: "Orbital", icon: Orbit },
];

const ROW_B: Client[] = [
  { name: "Monarch", icon: Crown },
  { name: "Cascade", icon: Waves },
  { name: "Nimbus", icon: Cloud },
  { name: "Forge", icon: Flame },
  { name: "Atlas", icon: Globe },
  { name: "Vela", icon: Compass },
];

function ClientLogo({ client }: { client: Client }) {
  const Icon = client.icon;
  return (
    <div className="group/logo flex shrink-0 items-center gap-3 px-7 py-3">
      <Icon className="h-5 w-5 text-muted-foreground/70 transition-colors duration-300 group-hover/logo:text-electric" />
      <span className="font-display whitespace-nowrap text-lg font-semibold tracking-tight text-muted-foreground/80 transition-colors duration-300 group-hover/logo:text-foreground">
        {client.name}
      </span>
    </div>
  );
}

function MarqueeRow({
  clients,
  reverse = false,
  duration = 32,
}: {
  clients: Client[];
  reverse?: boolean;
  duration?: number;
}) {
  // Duplicate the list so the track can translate -50% for a seamless loop.
  const loop = [...clients, ...clients];
  return (
    <div className="mask-fade-x group relative overflow-hidden">
      <div
        className={
          "flex w-max " +
          (reverse ? "animate-marquee-x-rev" : "animate-marquee-x") +
          " group-hover:[animation-play-state:paused]"
        }
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((client, i) => (
          <ClientLogo key={`${client.name}-${i}`} client={client} />
        ))}
      </div>
    </div>
  );
}

export function ClientMarquee() {
  return (
    <section
      aria-label="Trusted by category-defining brands"
      className="relative border-y border-white/5 bg-background/40 py-10 backdrop-blur-sm"
    >
      <div className="mx-auto mb-7 w-full max-w-7xl px-5 sm:px-8">
        <p className="text-center text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Trusted by category-defining brands
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <MarqueeRow clients={ROW_A} duration={34} />
        <MarqueeRow clients={ROW_B} reverse duration={42} />
      </div>
    </section>
  );
}
