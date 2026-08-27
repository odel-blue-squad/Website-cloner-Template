"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import {
  mapRange,
  useTimelineScroll,
} from "@/components/sites/scale-com-31338bde/shared/useTimelineScroll";
import { pageTheme } from "@/components/sites/scale-com-31338bde/shared/pageTheme";
import {
  INDUSTRY_RING_PATH_DESKTOP,
  INDUSTRY_RING_PATH_MOBILE,
} from "@/components/sites/scale-com-31338bde/shared/icons";
import {
  INDUSTRY_CTA,
  INDUSTRY_STATIC,
  INDUSTRY_WORDS,
} from "@/components/sites/scale-com-31338bde/root-8a5edab2/content";

/* ------------------------------------------------------------------
   scale.com "Applications" section.

   Two things scrub together off a single ScrollTrigger:
     A) the centre headline cycles through INDUSTRY_WORDS, and
     B) the 12 photographs orbit the elliptical ring path.

   The ring is laid out imperatively (gsap.set) so scrolling never
   re-renders React; only the word index — which changes 14 times over
   the whole section — lives in state.
   ------------------------------------------------------------------ */

/** The ring paths are authored against this viewBox. */
const VIEWBOX_W = 1020;
const VIEWBOX_H = 572;

/** Points sampled off the path once, then lerped between each frame. */
const SAMPLE_COUNT = 512;

/** How far the ring turns across the whole section (~a third of a lap). */
const REVOLUTIONS = 1 / 3;

/** Depth cue: back of the ellipse is smaller, front is larger. */
const MIN_SCALE = 0.8;
const MAX_SCALE = 1.15;
const MAX_DEPTH_Z = 20;

const WORD_COUNT = INDUSTRY_WORDS.length;

interface RingItem {
  word: string;
  image: string;
  alt: string;
}

const RING_ITEMS: RingItem[] = INDUSTRY_WORDS.map((entry) => ({
  word: entry.word,
  image: entry.image,
  alt: entry.alt,
}));

interface Point {
  x: number;
  y: number;
}

interface RingGeometry {
  points: Point[];
  minY: number;
  maxY: number;
}

/** Walk the path once with the SVG geometry API and cache the samples. */
function samplePath(path: SVGPathElement): RingGeometry {
  const total = path.getTotalLength();
  const points: Point[] = [];
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < SAMPLE_COUNT; i += 1) {
    const pt = path.getPointAtLength((i / SAMPLE_COUNT) * total);
    points.push({ x: pt.x, y: pt.y });
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  }

  return { points, minY, maxY };
}

/** Position at normalised distance `t` around the closed path, wrapped. */
function pointAt(points: Point[], t: number): Point {
  const n = points.length;
  const f = ((((t % 1) + 1) % 1) * n) % n;
  const i0 = Math.floor(f);
  const i1 = (i0 + 1) % n;
  const k = f - i0;
  const a = points[i0];
  const b = points[i1];
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
}

/** Avoids React's server-render warning without giving up pre-paint layout. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function IndustryRing() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const geometryRef = useRef<RingGeometry | null>(null);
  const offsetRef = useRef(0);
  const activeIndexRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  /** Measured widths of each cycling word, so the line re-centres per word. */
  const [wordWidths, setWordWidths] = useState<number[]>([]);
  const rulerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const measure = () => {
      const ruler = rulerRef.current;
      if (!ruler) return;
      setWordWidths(
        Array.from(ruler.children, (el) => (el as HTMLElement).getBoundingClientRect().width),
      );
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => undefined);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isMobile]);

  /* -- environment queries: breakpoint + motion preference -- */
  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setIsMobile(mqMobile.matches);
      setReducedMotion(mqMotion.matches);
    };
    sync();
    mqMobile.addEventListener("change", sync);
    mqMotion.addEventListener("change", sync);
    return () => {
      mqMobile.removeEventListener("change", sync);
      mqMotion.removeEventListener("change", sync);
    };
  }, []);

  /** Reduced motion parks the cycler on the final word — derived, not stored. */
  const displayedIndex = reducedMotion ? WORD_COUNT - 1 : activeIndex;

  /**
   * Writes every ring photo to its place on the ellipse. Positions are
   * percentages of the ring box, so they survive resizes untouched.
   */
  const layoutRing = useCallback((offset: number) => {
    const geometry = geometryRef.current;
    if (!geometry) return;

    const { points, minY, maxY } = geometry;
    const span = maxY - minY;
    const count = RING_ITEMS.length;

    for (let i = 0; i < count; i += 1) {
      const el = itemRefs.current[i];
      if (!el) continue;

      const pt = pointAt(points, i / count + offset);
      // 0 at the back of the ellipse, 1 at the front.
      const depth = span === 0 ? 0.5 : (pt.y - minY) / span;

      gsap.set(el, {
        left: `${(pt.x / VIEWBOX_W) * 100}%`,
        top: `${(pt.y / VIEWBOX_H) * 100}%`,
        xPercent: -50,
        yPercent: -50,
        scale: mapRange(depth, 0, 1, MIN_SCALE, MAX_SCALE),
        zIndex: 1 + Math.round(depth * MAX_DEPTH_Z),
      });
    }
  }, []);

  const measureAndLayout = useCallback(() => {
    const path = pathRef.current;
    if (!path) return;
    geometryRef.current = samplePath(path);
    layoutRing(offsetRef.current);
  }, [layoutRing]);

  /* -- initial + breakpoint geometry, before paint so nothing flashes -- */
  useIsomorphicLayoutEffect(() => {
    measureAndLayout();
  }, [measureAndLayout, isMobile]);

  /* -- debounced resize re-measure -- */
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(measureAndLayout, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (timer) clearTimeout(timer);
    };
  }, [measureAndLayout]);

  /**
   * This section is light (#eaeaea), so the fixed header has to invert while
   * it owns the viewport. Driven off the live rect rather than onEnter alone
   * so scrolling back up re-claims the theme too.
   */
  const syncTheme = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const middle = window.innerHeight / 2;
    if (rect.top <= middle && rect.bottom >= middle) pageTheme.set("light");
  }, []);

  useTimelineScroll(sectionRef, {
    start: "top bottom",
    end: "bottom top",
    scrub: true,
    timelineVersion: `${isMobile ? "mobile" : "desktop"}:${
      reducedMotion ? "static" : "motion"
    }`,
    onEnter: syncTheme,
    onUpdate: (self) => {
      // Read layout first, then write — never interleave.
      syncTheme();
      if (reducedMotion) return;

      const progress = self.progress;

      const next = Math.max(
        0,
        Math.min(WORD_COUNT - 1, Math.floor(progress * WORD_COUNT)),
      );
      if (next !== activeIndexRef.current) {
        activeIndexRef.current = next;
        setActiveIndex(next);
      }

      offsetRef.current = progress * REVOLUTIONS;
      layoutRing(offsetRef.current);
    },
  });

  const ringPath = isMobile
    ? INDUSTRY_RING_PATH_MOBILE
    : INDUSTRY_RING_PATH_DESKTOP;

  return (
    <div ref={sectionRef} className="ScrollRevealSection isolate relative w-full">
      <div className="pointer-events-none w-full h-full absolute inset-0 z-0 origin-top overflow-hidden bg-scale-gray-90" />
      <div className="relative z-1 isolate min-h-[60vh]">
        <div className="relative flex flex-col justify-end Applications min-h-dvh isolate">
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 pointer-events-none animateOutBackground z-1" />
          <div className="relative z-2">
            <section className="relative flex origin-top items-center justify-center min-h-[90vh] md:min-h-screen z-2 overflow-clip bg-scale-gray-90">
              {/* centre text */}
              <div className="relative z-50 flex flex-col items-center w-full max-w-5xl gap-6 md:gap-8 mx-auto pointer-events-none">
                {/* Static headline; only the word after "Real" cycles.
                    Sizes verbatim from the live markup's dynamic-header. */}
                <h2 className="text-center text-black max-md:text-[28px] max-md:leading-[30px] md:text-[4rem] md:leading-[1.05]">
                  <span className="block">{INDUSTRY_STATIC.line1}</span>
                  <span className="block whitespace-nowrap">
                    {INDUSTRY_STATIC.line2}{" "}
                    <span
                      className="relative inline-block align-baseline transition-[width] duration-[350ms] ease-out"
                      style={{ width: wordWidths[displayedIndex] ?? "auto" }}
                    >
                      {/* invisible ruler: one span per word, measured for width */}
                      <span ref={rulerRef} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 invisible">
                        {INDUSTRY_WORDS.map((entry) => (
                          <span key={entry.word} className="absolute top-0 left-0 whitespace-nowrap">{entry.word}</span>
                        ))}
                      </span>
                      {INDUSTRY_WORDS.map((entry, i) => (
                        <span
                          key={entry.word}
                          aria-hidden={i !== displayedIndex}
                          style={{ color: entry.color }}
                          className={cn(
                            "absolute top-0 left-0 whitespace-nowrap will-change-[opacity,transform]",
                            "transition-[opacity,translate] duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
                            i === displayedIndex && "translate-x-0 opacity-100",
                            i !== displayedIndex &&
                              (entry.direction === "left" ? "-translate-x-6 opacity-0" : "translate-x-6 opacity-0"),
                          )}
                        >
                          {entry.word}
                        </span>
                      ))}
                      {/* in-flow copy of the active word keeps line height honest */}
                      <span className="invisible whitespace-nowrap">{INDUSTRY_WORDS[displayedIndex].word}</span>
                    </span>
                  </span>
                </h2>

                <a
                  href={INDUSTRY_CTA.href}
                  className="pointer-events-auto inline-flex h-7 items-center rounded-full bg-white px-3.5 text-[11px] font-medium text-black shadow-[0_1px_4px_rgba(0,0,0,0.12)] transition-colors duration-300 hover:bg-scale-gray-95"
                >
                  {INDUSTRY_CTA.label}
                </a>
              </div>

              {/* image ring — 12 photos orbiting the path */}
              <div className="absolute top-1/2 left-1/2 -translate-x-[52%] translate-y-[calc(-56%_+_40px)] md:-translate-y-[56%] w-[min(75%,1020px)] aspect-3/5 sm:aspect-1020/572 md:aspect-1020/572">
                {RING_ITEMS.map((item, i) => (
                  <div
                    key={item.word}
                    ref={(node) => {
                      itemRefs.current[i] = node;
                    }}
                    className="absolute top-1/2 left-1/2 h-[64px] w-[52px] overflow-hidden rounded-lg bg-scale-gray-80 shadow-[0_8px_24px_rgba(0,0,0,0.12)] select-none md:h-[95px] md:w-[76px]"
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      draggable={false}
                      sizes="(max-width: 767px) 52px, 76px"
                      className="object-cover"
                    />
                  </div>
                ))}

                {/* the orbit itself — stretched to match the percentage layout */}
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full text-black/10"
                  viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
                  preserveAspectRatio="none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    ref={pathRef}
                    d={ringPath}
                    stroke="currentColor"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
