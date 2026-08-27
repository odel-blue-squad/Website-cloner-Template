"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  ArrowUpRightIcon,
  CloseIcon,
  TriangleGlyph,
} from "@/components/sites/scale-com-31338bde/shared/icons";
import { cn } from "@/lib/utils";

import { ANNOUNCEMENT } from "./content";

/**
 * CSS custom property consumed by `SiteHeader` via
 * `top-[var(--announcement-offset,0px)]`, so the fixed header always sits
 * flush beneath the announcement bar.
 */
const OFFSET_VAR = "--announcement-offset";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Publish the bar's live height onto <html> so the header can offset itself.
  // A ResizeObserver keeps it in sync across breakpoint reflows, text wrapping,
  // and the collapse animation itself — it fires per frame while the grid row
  // track animates, so the header slides up in lockstep with the bar.
  useEffect(() => {
    const node = barRef.current;
    const root = document.documentElement;

    if (!node) {
      root.style.setProperty(OFFSET_VAR, "0px");
      return;
    }

    const sync = () => {
      const { height } = node.getBoundingClientRect();
      root.style.setProperty(OFFSET_VAR, `${Math.round(height)}px`);
    };

    sync();

    const observer = new ResizeObserver(sync);
    observer.observe(node);

    return () => {
      observer.disconnect();
      root.style.setProperty(OFFSET_VAR, "0px");
    };
  }, []);

  // The ResizeObserver above normally walks the offset down to 0 frame by
  // frame, but rendering updates are throttled for hidden tabs and skipped
  // entirely under `prefers-reduced-motion` (zero-duration transitions emit no
  // `transitionend`). Pin the final value explicitly so the header can never be
  // left stranded below a bar that is no longer there.
  useEffect(() => {
    if (!dismissed) return;

    const node = barRef.current;
    const root = document.documentElement;
    const settle = () => {
      root.style.setProperty(OFFSET_VAR, "0px");
    };

    const timer = window.setTimeout(settle, 400);
    node?.addEventListener("transitionend", settle);

    return () => {
      window.clearTimeout(timer);
      node?.removeEventListener("transitionend", settle);
    };
  }, [dismissed]);

  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden={dismissed}
      inert={dismissed}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[110]",
        // height:auto -> 0 collapse. The inner `overflow-hidden` track is what
        // lets the `0fr` row actually reach zero.
        "grid transition-[grid-template-rows] duration-300 ease-out",
        dismissed ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
      )}
    >
      <div className="overflow-hidden">
        <div className="pointer-events-auto relative flex items-center justify-center bg-black px-12 py-2.5 text-white md:px-16">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center text-[14px] leading-5 font-medium">
            <TriangleGlyph className="size-2.5 shrink-0 text-scale-skyblue" />
            <span className="text-scale-gray-90">{ANNOUNCEMENT.text}</span>
            <Link
              href={ANNOUNCEMENT.href}
              className="inline-flex items-center gap-1 text-white underline decoration-white/40 underline-offset-4 transition-colors duration-200 hover:decoration-white focus:outline-1 focus:outline-scale-skyblue"
            >
              {ANNOUNCEMENT.cta}
              <ArrowUpRightIcon className="size-3 shrink-0" />
            </Link>
          </p>

          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss announcement"
            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1.5 text-white/60 transition-colors duration-200 hover:text-white focus:outline-1 focus:outline-scale-skyblue md:right-6"
          >
            <CloseIcon className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
