"use client";

import { Fragment, useCallback, useRef, useState } from "react";
import type { gsap } from "gsap";

import { SCROLLING_QUOTE } from "@/components/sites/scale-com-31338bde/root-8a5edab2/content";
import { pageTheme } from "@/components/sites/scale-com-31338bde/shared/pageTheme";
import { useTimelineScroll } from "@/components/sites/scale-com-31338bde/shared/useTimelineScroll";
import { cn } from "@/lib/utils";

/**
 * scale.com renders the quote as a single balanced paragraph and hands it to
 * GSAP SplitText, which wraps every word in its own element. We pre-split in
 * JSX instead — identical result, no plugin, and stable across React renders.
 */
const WORDS = SCROLLING_QUOTE.lines.join(" ").split(/\s+/).filter(Boolean);

/** Words are fully lit at this fraction of the scrub, leaving a beat at the end. */
const LIT_AT = 0.8;

/** Landscape phones: scale.com's `oml:` variant, which is a short-viewport query. */
const LANDSCAPE = "[@media(orientation:landscape)_and_(max-height:500px)]:";

export function ScrollingQuote() {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // ScrollTrigger needs the pinned node itself, and refs are null during the
  // render that builds the options object — so hold it in state and let the
  // hook rebuild once it lands.
  const [pinEl, setPinEl] = useState<HTMLElement | null>(null);

  const setupTimeline = useCallback((tl: gsap.core.Timeline) => {
    const words = wordRefs.current.filter(
      (el): el is HTMLSpanElement => el !== null,
    );

    if (words.length > 0) {
      tl.fromTo(
        words,
        { opacity: 0.25 },
        { opacity: 1, duration: 0.5, stagger: 0.08, ease: "none" },
        0,
      );
    }

    // Pad the timeline so the last word finishes at LIT_AT of the scroll range.
    const lit = tl.duration();
    if (lit > 0) {
      tl.to({}, { duration: lit * (1 / LIT_AT - 1) }, lit);
    }

    const video = videoRef.current;
    if (video) {
      tl.fromTo(
        video,
        { scale: 1.1 },
        { scale: 1, ease: "none", duration: tl.duration() || 1 },
        0,
      );
    }
  }, []);

  // Black section — the fixed header has to switch to its dark treatment.
  // `onUpdate` also covers scrolling back up into the range (no onEnterBack hook).
  const goDark = useCallback(() => {
    pageTheme.set("dark");
  }, []);

  useTimelineScroll(rootRef, {
    start: "top top",
    // `bottom bottom` makes the pin-spacer (pinned 100dvh + 100dvh of pin
    // distance) come to exactly 200dvh — the root's fixed height — so nothing
    // overflows into the next section.
    end: "bottom bottom",
    pin: pinEl,
    pinSpacing: true,
    scrub: true,
    setupTimeline,
    onEnter: goDark,
    onUpdate: goDark,
    timelineVersion: pinEl ? "pinned" : "idle",
  });

  return (
    <div
      ref={rootRef}
      className="ScrollingQuote h-[200dvh] overflow-x-clip px-3 md:px-6 bg-black"
    >
      <section
        ref={setPinEl}
        className="relative isolate mx-auto flex min-h-dvh w-full max-w-[2048px] items-center"
      >
        <div className="wrapper relative z-[1] flex min-h-0 w-full pb-3 md:min-h-[70vh]">
          {/* Mobile-only veil: transparent at the top, solid black from 15% down. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_bottom,transparent_0%,#000_15%,#000_100%)] md:hidden"
          />

          {/* The light panel that rises from below and bridges to the next section. */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-1/2 top-[calc(100%-4px)] z-0 h-[20vh]",
              "w-[calc(100vw-24px)] -translate-x-1/2 origin-top rounded-t-lg bg-scale-gray-90",
              "md:w-[calc(100vw-48px)] md:rounded-t-2xl",
            )}
          />

          <div
            className={cn(
              "relative z-[1] flex min-h-0 w-full flex-col gap-2 pt-4",
              "max-md:h-[calc(92svh-1.25rem+1.5rem)] max-md:max-h-[calc(92svh-1.25rem+1.5rem)] max-md:overflow-hidden",
              "md:max-h-none md:min-h-[70vh] md:flex-1 md:flex-row md:overflow-visible md:pt-0",
              `${LANDSCAPE}flex-row`,
            )}
          >
            <div
              className={cn(
                "relative w-full rounded-lg bg-black",
                "max-md:min-h-0 max-md:shrink max-md:grow max-md:basis-0",
                "md:h-[60%] md:w-[362px] md:min-h-0 md:flex-none md:shrink-0 md:rounded-3xl",
              )}
            >
              <div className="ResponsiveVideo h-full overflow-clip rounded-lg md:rounded-3xl">
                <video
                  ref={videoRef}
                  src={SCROLLING_QUOTE.video}
                  className="block h-full min-h-full w-full object-cover will-change-transform"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
              </div>
            </div>

            <div
              className={cn(
                "flex min-h-0 w-full flex-col items-start rounded-lg bg-[#193a29] p-8",
                "max-md:shrink max-md:grow-[2] max-md:basis-0 max-md:overflow-y-auto",
                "md:h-full md:min-h-0 md:flex-1 md:rounded-2xl md:px-14 md:py-12",
              )}
            >
              <p
                className={cn(
                  "header2 max-w-5xl text-balance font-medium text-white",
                  "max-md:!leading-[40px] md:leading-[4rem]",
                  `${LANDSCAPE}text-[2rem] ${LANDSCAPE}leading-[1.5] ${LANDSCAPE}tracking-[-0.03em]`,
                )}
              >
                {WORDS.map((word, i) => (
                  <Fragment key={`${word}-${i}`}>
                    <span
                      ref={(el) => {
                        wordRefs.current[i] = el;
                      }}
                      className="inline-block opacity-25 will-change-[opacity]"
                    >
                      {word}
                    </span>
                    {i < WORDS.length - 1 ? " " : null}
                  </Fragment>
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
