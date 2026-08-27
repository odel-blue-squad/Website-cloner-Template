"use client";

import { useRef, type SVGProps } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BENCHMARK_CARDS,
  BENCHMARK_HEADING,
} from "@/components/sites/scale-com-31338bde/root-8a5edab2/content";
import { pageTheme } from "@/components/sites/scale-com-31338bde/shared/pageTheme";
import { useTimelineScroll } from "@/components/sites/scale-com-31338bde/shared/useTimelineScroll";

/**
 * "We set the benchmark…" — a white rounded panel that rises over the grey
 * marquee section. Three compact cards: two on light grey, the third on slate
 * with a black CTA, each with a small white icon tile. A purple accent bar
 * slides up along the card's bottom edge on hover (sampled #665975).
 */

const SLATE = "#7893a6";
const ACCENT = "#665975";

const isExternal = (href: string) => /^https?:\/\//.test(href);

/* minimal chart glyphs matching the tiles in the capture */
function TrendIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" {...props}>
      <path d="M1.5 11.5 6 7l3 3 5.5-5.5" />
      <path d="M10.5 4.5h4v4" />
    </svg>
  );
}
function BarsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" {...props}>
      <path d="M3 13V9M8 13V4M13 13V6.5" />
    </svg>
  );
}
function LayersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" {...props}>
      <path d="m8 2 6 3.2L8 8.4 2 5.2 8 2ZM2 8.6l6 3.2 6-3.2M2 11.8 8 15l6-3.2" />
    </svg>
  );
}
const ICONS = [TrendIcon, BarsIcon, LayersIcon];

export function BenchmarkCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useTimelineScroll(sectionRef, {
    start: "top bottom",
    end: "bottom 75%",
    scrub: true,
    onEnter: () => pageTheme.set("light"),
    setupTimeline: (tl) => {
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length) {
        tl.fromTo(cards, { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.12, ease: "none" }, 0);
      }
    },
  });

  return (
    <section
      ref={sectionRef}
      className={cn(
        "CardGrid [&_.Card]:max-xl:!rounded-[8px] [&_.Card>div]:max-xl:!p-[24px]",
        "[&_.Card_.header5-regular]:max-xl:text-[18px] [&_.Card_.header5-regular]:max-xl:leading-[1.35]",
        "[&_.Card_.RichText_p.body1]:max-xl:text-[14px]",
        "relative z-2 -mt-6 rounded-t-[16px] bg-white py-12 md:py-16",
      )}
    >
      <div className="mx-auto max-w-[1200px] grid-padding">
        <h2 className="text-[18px] font-medium text-scale-gray-10 md:text-[20px]">
          {BENCHMARK_HEADING}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-1.5 md:grid-cols-3">
          {BENCHMARK_CARDS.map((card, index) => {
            const Icon = ICONS[index % ICONS.length];
            const slate = index === 2;
            const external = isExternal(card.href);
            return (
              <Link
                key={card.href}
                ref={(el) => { cardRefs.current[index] = el; }}
                href={card.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={cn(
                  "Card group relative flex min-h-[230px] flex-col overflow-hidden rounded-[12px]",
                  slate ? "text-white" : "bg-scale-gray-95 text-scale-gray-10",
                )}
                style={slate ? { backgroundColor: SLATE } : undefined}
              >
                <div className="flex h-full flex-col p-5">
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-md bg-white",
                      slate ? "text-scale-gray-20" : "text-scale-gray-10",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>

                  {/* verbatim line breaks, joined — the capture flows them */}
                  <h3 className="header5-regular mt-6 !text-[15px] !leading-[1.4] font-medium">
                    {card.lines.join(" ")}
                  </h3>

                  <div className="RichText mt-3">
                    <p className={cn("body1 !text-[11.5px] !leading-[1.5]", slate ? "text-white/75" : "text-scale-gray-30")}>
                      {card.body.join(" ")}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "mt-auto inline-flex w-max items-center rounded-md px-2.5 py-1 text-[11px] transition-colors duration-200",
                      slate
                        ? "bg-black text-white group-hover:bg-scale-gray-10"
                        : "border border-scale-gray-80 text-scale-gray-20 group-hover:border-scale-gray-30",
                    )}
                  >
                    {card.cta}
                  </span>
                </div>

                {/* hover accent bar along the bottom edge */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[3px] translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
                  style={{ backgroundColor: ACCENT }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
