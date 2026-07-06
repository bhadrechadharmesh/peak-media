"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { SectionShell } from "@/components/peak/ui/section-shell";
import { SectionHeading } from "@/components/peak/ui/section-heading";
import { Reveal } from "@/components/peak/ui/reveal";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  accent: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Peak engineered our festive-season ROAS to 7x while the category was busy discounting. Their creative velocity is unlike any agency we've worked with in India — they ship faster than our internal team can react.",
    name: "Ananya Iyer",
    role: "VP Marketing",
    company: "Glo Beauty",
    initials: "AI",
    accent: "from-electric to-electric-2",
  },
  {
    quote:
      "Our cost-per-lead dropped 43% in ninety days while pipeline 3.4x'd in a single quarter. The team treats our budget like it's their own money — that's the only way I can describe the difference.",
    name: "Rohan Malhotra",
    role: "Head of Growth",
    company: "FinEdge",
    initials: "RM",
    accent: "from-electric-soft to-electric",
  },
  {
    quote:
      "Our CPI dropped 61% in a single quarter and D7 retention climbed to 31%. Peak gets the Indian app ecosystem — vernacular creatives, UPI-driven funnels, the works.",
    name: "Priya Nair",
    role: "CMO",
    company: "Karo",
    initials: "PN",
    accent: "from-electric-2 to-electric-soft",
  },
  {
    quote:
      "The launch films hit 8 million views during the IPL window without a rupee of paid distribution. Peak just understands how attention moves in Bharat — they don't chase last year's playbook.",
    name: "Karthik Reddy",
    role: "Founder & CEO",
    company: "Urja EV",
    initials: "KR",
    accent: "from-electric to-electric-soft",
  },
  {
    quote:
      "We've been through four agencies in six years. Peak is the first one that feels like an extension of our D2C team — they scaled us from Mumbai to quick-commerce nationally without losing the brand.",
    name: "Meera Joshi",
    role: "Brand Director",
    company: "Tantu",
    initials: "MJ",
    accent: "from-electric-soft to-electric-2",
  },
  {
    quote:
      "Performance-linked fees forced alignment from day one. When our numbers dip, theirs does too. That contract structure alone was worth the switch for our performance marketing.",
    name: "Aditya Banerjee",
    role: "Performance Lead",
    company: "Ayu Health",
    initials: "AB",
    accent: "from-electric-2 to-electric",
  },
];

function Stars({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="size-4 fill-electric text-electric"
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
  });
  const [selected, setSelected] = React.useState(0);
  const [snaps, setSnaps] = React.useState<number[]>([]);
  const [paused, setPaused] = React.useState(false);

  // Wire up api
  React.useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    setSelected(emblaApi.selectedScrollSnap());
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  // Autoplay (manual, since embla-carousel-autoplay isn't installed)
  React.useEffect(() => {
    if (!emblaApi || paused) return;
    const t = setInterval(() => {
      emblaApi.scrollNext();
    }, 4200);
    return () => clearInterval(t);
  }, [emblaApi, paused]);

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <SectionShell id="testimonials" className="relative overflow-hidden">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full opacity-15" />
        <div className="absolute inset-0 dot-bg opacity-20 mask-radial" />
      </div>

      <SectionHeading
        eyebrow="Client love"
        title={
          <>
            Brands that grew <span className="text-gradient">with Peak</span>
          </>
        }
        description="Six operators who put their growth on the line — and got it back with interest."
      />

      {/* aggregate rating chip */}
      <Reveal delay={0.1} className="mt-8 flex justify-center">
        <div className="glass inline-flex items-center gap-3 rounded-full px-4 py-2">
          <Stars />
          <span className="text-sm font-medium text-foreground">
            4.9/5
          </span>
          <span className="h-4 w-px bg-white/15" />
          <span className="text-sm text-muted-foreground">
            across 120+ Indian founders & marketers
          </span>
        </div>
      </Reveal>

      {/* Carousel */}
      <div
        className="mt-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="min-w-0 shrink-0 grow-0 basis-full px-3 md:basis-1/2"
              >
                <motion.article
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="glass relative h-full overflow-hidden rounded-3xl p-7 sm:p-9"
                >
                  {/* background quote glyph */}
                  <Quote
                    aria-hidden
                    className="pointer-events-none absolute -right-3 -top-3 size-32 rotate-180 text-white/[0.04]"
                    strokeWidth={1}
                  />

                  <div className="relative flex h-full flex-col">
                    <Stars />
                    <blockquote className="mt-5 font-display text-lg leading-relaxed text-foreground sm:text-xl">
                      <span className="text-gradient">“</span>
                      {t.quote}
                      <span className="text-gradient">”</span>
                    </blockquote>

                    <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
                      <Avatar className="size-11 border border-white/10">
                        <AvatarFallback
                          className={cn(
                            "bg-gradient-to-br text-white font-medium",
                            t.accent
                          )}
                        >
                          {t.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{t.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {t.role} · {t.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              </div>
            ))}
          </div>
        </div>

        {/* controls */}
        <div className="mt-8 flex items-center justify-center gap-5">
          <button
            onClick={scrollPrev}
            aria-label="Previous testimonials"
            className="glass inline-flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:border-electric/60 hover:text-electric"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* dots */}
          <div className="flex items-center gap-2">
            {snaps.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Go to testimonial group ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === selected
                    ? "w-7 bg-electric"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>

          <button
            onClick={scrollNext}
            aria-label="Next testimonials"
            className="glass inline-flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:border-electric/60 hover:text-electric"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </SectionShell>
  );
}

export default Testimonials;
