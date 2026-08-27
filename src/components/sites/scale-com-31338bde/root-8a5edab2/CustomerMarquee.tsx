"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  CUSTOMERS,
  CUSTOMERS_HEADING,
} from "@/components/sites/scale-com-31338bde/root-8a5edab2/content";
import { pageTheme } from "@/components/sites/scale-com-31338bde/shared/pageTheme";
import { useTimelineScroll } from "@/components/sites/scale-com-31338bde/shared/useTimelineScroll";
import type { CustomerCard } from "@/types/scale";

/**
 * "Proven across every industry." — an infinite, hover-pausable logo/quote
 * marquee. The track holds the customer list twice and the `logo-marquee`
 * keyframe translates it by exactly -50%, so the seam is invisible.
 */

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Padding lives on the <li>, never as flex `gap`, so each item's advance is
 *  card + gutter. That keeps one loop exactly 50% of the doubled track. */
function MarqueeCard({ card, duplicate = false }: { card: CustomerCard; duplicate?: boolean }) {
  const external = isExternal(card.href);

  return (
    <li className="shrink-0 pr-4 md:pr-6">
      <Link
        href={card.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        tabIndex={duplicate ? -1 : undefined}
        className={cn(
          "flex h-[300px] w-[280px] flex-col rounded-[8px] bg-white p-6 md:w-[380px]",
          "shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
          "transition duration-300 [transition-timing-function:ease]",
          "hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]",
        )}
      >
        {/* Verbatim hard-wrapped copy — each source line is its own block. */}
        <p className="body1 text-scale-gray-10">
          {card.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        <div className="mt-auto flex flex-col gap-3">
          <div className="relative h-[60px] w-[140px]">
            <Image
              src={card.logo}
              alt=""
              fill
              sizes="140px"
              className="object-contain object-left"
            />
          </div>
          <span className="body3 text-scale-gray-30">{card.company}</span>
        </div>
      </Link>
    </li>
  );
}

export function CustomerMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useTimelineScroll(sectionRef, {
    start: "top bottom",
    end: "top center",
    scrub: true,
    setupTimeline: (tl) => {
      const heading = headingRef.current;
      if (!heading) return;
      tl.fromTo(heading, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: "none" }, 0);
    },
    onEnter: () => pageTheme.set("light"),
    onUpdate: () => pageTheme.set("light"),
  });

  return (
    <div className="relative pb-40 oml:pb-2 z-2 bg-scale-gray-90">
      <section ref={sectionRef} className="relative">
        <div
          className={cn(
            "grid-layout-mobile md:grid-layout-desktop",
            "md:grid-cols-[repeat(12,minmax(0,150px))] md:justify-center",
            "pt-12 md:pt-16",
          )}
        >
          <h2 ref={headingRef} className="header3-regular col-span-8 md:col-span-7 text-scale-gray-10">
            {CUSTOMERS_HEADING}
          </h2>
        </div>

        <div className="w-full overflow-hidden py-12 md:py-16">
          <div
            className={cn(
              "flex w-max will-change-transform",
              "[animation:logo-marquee_60s_linear_infinite]",
              "hover:[animation-play-state:paused]",
              "motion-reduce:[animation:none]",
            )}
          >
            <ul role="list" className="flex shrink-0">
              {CUSTOMERS.map((card) => (
                <MarqueeCard key={card.company} card={card} />
              ))}
            </ul>
            {/* Second copy exists only to close the loop — hidden from AT. */}
            <ul role="list" aria-hidden="true" className="flex shrink-0">
              {CUSTOMERS.map((card) => (
                <MarqueeCard key={`${card.company}-dup`} card={card} duplicate />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
