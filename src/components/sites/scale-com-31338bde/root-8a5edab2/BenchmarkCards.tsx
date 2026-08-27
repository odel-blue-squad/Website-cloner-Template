"use client";

import { useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BENCHMARK_CARDS,
  BENCHMARK_HEADING,
} from "@/components/sites/scale-com-31338bde/root-8a5edab2/content";
import { pageTheme } from "@/components/sites/scale-com-31338bde/shared/pageTheme";
import { useTimelineScroll } from "@/components/sites/scale-com-31338bde/shared/useTimelineScroll";
import { ArrowRightIcon } from "@/components/sites/scale-com-31338bde/shared/icons";

/**
 * "We set the benchmark for what's possible with AI" — three cards that reveal
 * on a scrubbed stagger as the section enters.
 *
 * The root class list below is lifted verbatim from scale.com. Its arbitrary
 * variants reach into `.Card`, `.Card > div`, `.Card .header5-regular` and
 * `.Card .RichText p.body1` to apply the sub-xl overrides, so those class names
 * are load-bearing structure — renaming them silently breaks the mobile sizes.
 */
const CARD_GRID_ROOT =
  "CardGrid [&_.Card]:max-xl:!rounded-[8px] [&_.Card>div]:max-xl:!p-[24px] [&_.Card_.header5-regular]:max-xl:text-[18px] [&_.Card_.header5-regular]:max-xl:leading-[1.35] [&_.Card_.RichText_p.body1]:max-xl:text-[14px]";

/** scale.com's 12-column grid, plus explicit fallbacks for the custom classes. */
const GRID = cn(
  "grid-layout-mobile md:grid-layout-desktop",
  "md:grid-cols-[repeat(12,minmax(0,150px))] md:justify-center",
);

const isExternal = (href: string) => /^https?:\/\//.test(href);

export function BenchmarkCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useTimelineScroll(sectionRef, {
    start: "top bottom",
    end: "bottom 75%",
    scrub: true,
    setupTimeline: (tl) => {
      const cards = cardRefs.current.filter(
        (el): el is HTMLAnchorElement => el !== null,
      );
      if (cards.length === 0) return;
      tl.fromTo(
        cards,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.12, ease: "none" },
        0,
      );
    },
    onEnter: () => pageTheme.set("light"),
    onUpdate: () => pageTheme.set("light"),
  });

  return (
    <section
      ref={sectionRef}
      className={`${CARD_GRID_ROOT} relative bg-scale-gray-90 md:bg-transparent`}
    >
      <div className={cn(GRID, "pt-16 md:pt-24")}>
        <h2 className="header2 col-span-8 md:col-span-8 text-scale-gray-10">
          {BENCHMARK_HEADING}
        </h2>
      </div>

      <div className={cn(GRID, "gap-y-2 pt-10 pb-16 md:pt-16 md:pb-24")}>
        {BENCHMARK_CARDS.map((card, i) => {
          const external = isExternal(card.href);

          return (
            <Link
              key={card.cta + card.href}
              href={card.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={cn(
                "Card group col-span-8 md:col-span-4",
                "rounded-[16px] border border-scale-gray-90 bg-white",
                "transition-colors duration-300 [transition-timing-function:ease]",
                "hover:border-scale-gray-80",
              )}
            >
              {/* Direct child div — targeted by [&_.Card>div]:max-xl:!p-[24px]. */}
              <div className="flex h-full flex-col p-8">
                <h3 className="header5-regular text-scale-gray-10">
                  {card.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h3>

                <div className="RichText mt-4">
                  <p className="body1 text-scale-gray-30">
                    {card.body.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>

                <span className="body3 mt-auto inline-flex items-center gap-2 pt-8 text-scale-gray-10">
                  {card.cta}
                  <ArrowRightIcon
                    className={cn(
                      "size-4 shrink-0",
                      "transition-transform duration-300 [transition-timing-function:ease]",
                      "group-hover:translate-x-1",
                    )}
                  />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
