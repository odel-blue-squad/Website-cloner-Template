"use client";

import { useRef } from "react";
import Link from "next/link";
import { CTA } from "@/components/sites/scale-com-31338bde/root-8a5edab2/content";
import { pageTheme } from "@/components/sites/scale-com-31338bde/shared/pageTheme";
import { useTimelineScroll } from "@/components/sites/scale-com-31338bde/shared/useTimelineScroll";
import { ArrowRightIcon } from "@/components/sites/scale-com-31338bde/shared/icons";

/**
 * Closing CTA, matching the reference capture: a flat tan panel (#9c8772) with
 * the satellite wireframe video multiplied over it — the clip is black line
 * art on white, so multiply tints the white ground to the tan and keeps the
 * lines dark. Copy sits left, vertically centred; the button is a black pill
 * with a boxed arrow. Parallax config is verbatim from the bundle:
 * yPercent 0 → -20, power2.out.
 */

const TAN = "#9c8772";

export function CtaSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useTimelineScroll(sectionRef, {
    start: "top top",
    end: "bottom top",
    scrub: true,
    onEnter: () => pageTheme.set("light"),
    setupTimeline: (tl) => {
      if (innerRef.current) {
        tl.fromTo(innerRef.current, { yPercent: 0 }, { yPercent: -20, duration: 0.75, ease: "power2.out" }, 0);
      }
    },
  });

  return (
    <div ref={sectionRef} className="ScrollRevealSection isolate relative w-full bg-white">
      <section className="relative h-[620px] w-full overflow-hidden md:h-[650px]" style={{ backgroundColor: TAN }}>
        {/* wireframe line-art, multiplied onto the tan ground. The tan is
            painted on this wrapper too: GSAP's transform makes it a stacking
            context, which would otherwise isolate the blend from the section. */}
        <div ref={innerRef} className="absolute inset-0 h-[150%] top-[-10%]" style={{ backgroundColor: TAN }}>
          <video
            src={CTA.video}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="block h-full w-full object-cover mix-blend-multiply"
            aria-hidden="true"
          />
        </div>

        {/* copy block — left, vertically centred */}
        <div className="relative z-10 flex h-full items-center">
          <div className="grid-padding ml-0 max-w-[420px] md:ml-[9%]">
            <h2 className="header3-regular text-scale-gray-10">
              {CTA.lines.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </h2>
            <p className="mt-4 text-[13px] leading-[1.5] text-scale-gray-20">
              {CTA.body.join(" ")}
            </p>
            <Link
              href={CTA.href}
              className="group mt-6 inline-flex h-9 items-center gap-2 rounded-full bg-black pr-1.5 pl-4 text-[12px] font-medium text-white transition-colors duration-300 hover:bg-scale-gray-10"
            >
              {CTA.cta}
              <span className="flex size-6 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRightIcon className="size-3" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
