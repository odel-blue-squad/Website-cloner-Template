"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import {
  CUSTOMERS,
  CUSTOMERS_HEADING,
} from "@/components/sites/scale-com-31338bde/root-8a5edab2/content";
import { pageTheme } from "@/components/sites/scale-com-31338bde/shared/pageTheme";
import { useTimelineScroll } from "@/components/sites/scale-com-31338bde/shared/useTimelineScroll";
import { ChevronRightIcon } from "@/components/sites/scale-com-31338bde/shared/icons";
import type { CustomerCard } from "@/types/scale";

/**
 * Customer marquee, matching the reference capture: white cards with the logo
 * tile at the top, the quote in the middle and the company name at the bottom,
 * auto-advancing left with prev/next controls under the track next to the
 * "Proven across every industry." heading.
 *
 * The track is JS-driven (not a CSS keyframe) so the arrow buttons can nudge
 * the same offset the autoplay writes to. Content is doubled; the offset wraps
 * at half the track width, which makes the loop seamless.
 */

const isExternal = (href: string) => /^https?:\/\//.test(href);
const AUTO_SPEED = 28; // px per second, matched against the capture's drift
const CARD_ADVANCE = 316; // card width + gutter

function MarqueeCard({ card, duplicate = false }: { card: CustomerCard; duplicate?: boolean }) {
  const external = isExternal(card.href);

  return (
    <li className="shrink-0 pr-1.5">
      <Link
        href={card.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        tabIndex={duplicate ? -1 : undefined}
        className={cn(
          "flex h-[270px] w-[304px] flex-col rounded-[8px] bg-white p-5",
          "transition-colors duration-300 hover:bg-scale-gray-95",
        )}
      >
        {/* logo tile up top */}
        <div className="relative h-10 w-10">
          <Image src={card.logo} alt="" fill sizes="40px" className="object-contain object-left" />
        </div>

        {/* verbatim hard-wrapped copy */}
        <p className="mt-8 text-[15px] leading-[1.45] text-scale-gray-10">
          {card.lines.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
        </p>

        <p className="mt-auto font-mono text-[10px] tracking-[0.1em] text-scale-gray-60 uppercase">
          {card.company}
        </p>
      </Link>
    </li>
  );
}

export function CustomerMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const offsetRef = useRef(0);
  const nudgeRef = useRef(0);
  const pausedRef = useRef(false);

  /* autoplay + arrow nudges share one wrapped offset */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tick = (_time: number, deltaMs: number) => {
      const half = track.scrollWidth / 2;
      if (!half) return;
      const dt = deltaMs / 1000;
      if (!pausedRef.current) offsetRef.current += AUTO_SPEED * dt;
      // ease any pending arrow nudge into the offset
      if (Math.abs(nudgeRef.current) > 0.5) {
        const step = nudgeRef.current * Math.min(1, dt * 6);
        offsetRef.current += step;
        nudgeRef.current -= step;
      } else {
        nudgeRef.current = 0;
      }
      offsetRef.current = ((offsetRef.current % half) + half) % half;
      track.style.transform = `translateX(${-offsetRef.current}px)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  useTimelineScroll(sectionRef, {
    start: "top bottom",
    end: "top center",
    scrub: true,
    onEnter: () => pageTheme.set("light"),
    onUpdate: (self) => {
      if (self.progress > 0) pageTheme.set("light");
    },
    setupTimeline: (tl) => {
      if (headingRef.current) {
        tl.fromTo(headingRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: "none" }, 0);
      }
    },
  });

  return (
    <div ref={sectionRef} className="relative pb-40 oml:pb-2 z-2 bg-scale-gray-90">
      <section className="relative w-full py-12 md:py-16">
        <div
          className="overflow-hidden"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          <ul ref={trackRef} className="flex w-max will-change-transform">
            {CUSTOMERS.map((card) => (
              <MarqueeCard key={card.company} card={card} />
            ))}
            {CUSTOMERS.map((card) => (
              <MarqueeCard key={`${card.company}-dup`} card={card} duplicate />
            ))}
          </ul>
        </div>

        {/* heading + manual controls below the track */}
        <div className="mt-10 flex items-center justify-between grid-padding md:px-[10%]">
          <h2 ref={headingRef} className="text-[16px] font-medium text-scale-gray-10 md:text-[18px]">
            {CUSTOMERS_HEADING}
          </h2>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Previous customers"
              onClick={() => { nudgeRef.current -= CARD_ADVANCE; }}
              className="flex size-6 items-center justify-center rounded-[4px] bg-white text-scale-gray-30 transition-colors hover:text-black"
            >
              <ChevronRightIcon className="size-3.5 rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Next customers"
              onClick={() => { nudgeRef.current += CARD_ADVANCE; }}
              className="flex size-6 items-center justify-center rounded-[4px] bg-white text-scale-gray-30 transition-colors hover:text-black"
            >
              <ChevronRightIcon className="size-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
