"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface TimelineScrollOptions {
  start?: string | (() => string);
  end?: string | (() => string);
  pin?: boolean | Element | null;
  pinSpacing?: boolean;
  pinReparent?: boolean;
  scrub?: boolean | number;
  markers?: boolean;
  /** Build the scrubbed timeline once; receives the timeline to populate. */
  setupTimeline?: (tl: gsap.core.Timeline) => void;
  onUpdate?: (self: ScrollTrigger) => void;
  onEnter?: (self: ScrollTrigger) => void;
  onLeave?: (self: ScrollTrigger) => void;
  onStart?: (self: ScrollTrigger) => void;
  /** Change this string to force a rebuild (e.g. on breakpoint change). */
  timelineVersion?: string;
}

/**
 * Mirror of scale.com's own `useTimelineScroll`: creates a scrubbed GSAP
 * timeline bound to a ScrollTrigger on `ref`, and tears it down on unmount.
 */
export function useTimelineScroll(
  ref: RefObject<HTMLElement | null>,
  options: TimelineScrollOptions = {},
) {
  const {
    start = "top bottom",
    end = "bottom top",
    pin = false,
    pinSpacing = true,
    pinReparent = false,
    scrub = true,
    markers = false,
    setupTimeline,
    onUpdate,
    onEnter,
    onLeave,
    onStart,
    timelineVersion = "",
  } = options;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: typeof start === "function" ? start() : start,
          end: typeof end === "function" ? end() : end,
          pin: pin === true ? el : pin || false,
          pinSpacing,
          pinReparent,
          scrub,
          markers,
          onUpdate,
          onEnter,
          onLeave,
        },
      });
      setupTimeline?.(tl);
      onStart?.(tl.scrollTrigger as ScrollTrigger);
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelineVersion]);
}

/** Linear remap helper used throughout scale.com's scroll maths. */
export const mapRange = (
  value: number, inMin: number, inMax: number, outMin: number, outMax: number,
) => {
  if (inMax === inMin) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  return outMin + Math.min(1, Math.max(0, t)) * (outMax - outMin);
};
