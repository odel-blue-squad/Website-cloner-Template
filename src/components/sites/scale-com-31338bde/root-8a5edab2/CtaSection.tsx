"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTimelineScroll } from "@/components/sites/scale-com-31338bde/shared/useTimelineScroll";
import { pageTheme } from "@/components/sites/scale-com-31338bde/shared/pageTheme";
import { ArrowRightIcon } from "@/components/sites/scale-com-31338bde/shared/icons";
import { CTA } from "@/components/sites/scale-com-31338bde/root-8a5edab2/content";

export function CtaSection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  const setupTimeline = useCallback((tl: gsap.core.Timeline) => {
    tl.fromTo(
      innerRef.current,
      { yPercent: 0 },
      { yPercent: -20, duration: 0.75, ease: "power2.out" },
      0,
    );
  }, []);

  useTimelineScroll(rootRef, {
    start: "top top",
    end: "bottom top",
    setupTimeline,
  });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => pageTheme.set("dark"),
      onEnterBack: () => pageTheme.set("dark"),
    });
    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="ScrollRevealSection isolate relative w-full bg-white"
    >
      <div className="grid-padding py-8">
        <div className="relative flex min-h-[520px] w-full items-center justify-center overflow-hidden rounded-[16px] bg-black md:min-h-[680px]">
          <div
            ref={innerRef}
            className="pointer-events-none absolute inset-x-0 top-[-10%] h-[150%] will-change-transform"
            aria-hidden="true"
          >
            <video
              className="block object-cover w-full h-full min-h-full"
              src={CTA.video}
              width={1440}
              height={1080}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              tabIndex={-1}
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0 bg-black/30"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"
            aria-hidden="true"
          />

          <div className="relative z-10 flex w-full flex-col items-center px-6 py-16 text-center text-white md:py-24">
            <h2 className="header1 text-white">
              {CTA.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <p className="body1 mt-6 text-white/85 md:mt-8">
              {CTA.body.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>

            <Link
              href={CTA.href}
              className="body3 group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-black transition-colors duration-200 ease-out hover:bg-scale-gray-90 md:mt-10"
            >
              <span>{CTA.cta}</span>
              <ArrowRightIcon
                className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
