"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BLOG_HEADING,
  BLOG_MOSAIC,
} from "@/components/sites/scale-com-31338bde/root-8a5edab2/content";
import { pageTheme } from "@/components/sites/scale-com-31338bde/shared/pageTheme";
import { useTimelineScroll } from "@/components/sites/scale-com-31338bde/shared/useTimelineScroll";

/**
 * Blog mosaic, matching the reference capture: a centred two-line heading over
 * a 12-column patchwork of three card treatments —
 *   panel:   flat grey tile, title bottom-left (no media)
 *   overlay: image with the title set inside its bottom edge
 *   caption: image with a category chip on it and the title beneath
 */

type MosaicCard = (typeof BLOG_MOSAIC)[number];

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="absolute top-2.5 left-2.5 z-10 rounded-[3px] px-1.5 py-0.5 font-mono text-[9px] tracking-[0.08em] text-white uppercase"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

function Card({ card, setRef }: { card: MosaicCard; setRef: (el: HTMLAnchorElement | null) => void }) {
  const image = "image" in card ? card.image : undefined;
  const alt = "alt" in card && card.alt ? card.alt : "";

  return (
    <Link
      ref={setRef}
      href={card.href}
      className={cn("group col-span-8 block", card.cols)}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[10px] bg-scale-gray-95",
          card.height,
        )}
      >
        {card.chip && card.chipColor ? <Chip label={card.chip} color={card.chipColor} /> : null}

        {image ? (
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.03]"
          />
        ) : null}

        {card.variant === "overlay" ? (
          <p
            className="absolute right-4 bottom-3 left-4 z-10 text-[15px] leading-snug"
            style={{ color: "titleColor" in card && card.titleColor ? card.titleColor : "#ffffff" }}
          >
            {card.title}
          </p>
        ) : null}

        {card.variant === "panel" ? (
          <p className="absolute bottom-4 left-4 text-[15px] leading-snug text-scale-gray-10">
            {card.title}
          </p>
        ) : null}
      </div>

      {card.variant === "caption" ? (
        <p className="mt-2 text-[11px] leading-[1.45] text-scale-gray-30 transition-colors duration-300 group-hover:text-black">
          {card.title}
        </p>
      ) : null}
    </Link>
  );
}

export function BlogPreview() {
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
        tl.fromTo(cards, { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.08, ease: "none" }, 0);
      }
    },
  });

  return (
    <section ref={sectionRef} className="BlogPreview overflow-hidden isolate w-full py-12 md:py-16 bg-white">
      {/* centred two-line heading, both lines the same size */}
      <h2 className="header3-regular text-center text-scale-gray-10">
        <span className="block">{BLOG_HEADING.lead}</span>
        <span className="block">{BLOG_HEADING.sub}</span>
      </h2>

      <div className="mx-auto mt-10 grid max-w-[1200px] grid-cols-8 gap-1.5 grid-padding md:mt-14 md:grid-cols-12">
        {BLOG_MOSAIC.map((card, index) => (
          <Card key={card.href} card={card} setRef={(el) => { cardRefs.current[index] = el; }} />
        ))}
      </div>
    </section>
  );
}
