"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * scale.com drives every scroll animation through Lenis, with GSAP's ticker as
 * the RAF source and ScrollTrigger proxied onto Lenis' scroll value. Wiring
 * them in this exact order is what makes pinning and scrubbing stay in sync.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // QA affordance (development only): ?scrollTo=<px> jumps straight to a scroll
    // depth so scrolled states can be captured without driving the wheel.
    if (process.env.NODE_ENV === "development") {
      const target = Number(new URLSearchParams(window.location.search).get("scrollTo"));
      if (Number.isFinite(target) && target > 0) {
        window.setTimeout(() => {
          lenis.scrollTo(target, { immediate: true });
          ScrollTrigger.refresh();
        }, 600);
      }
    }

    // Recalculate once fonts/images settle so pin distances are correct.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 400);

    return () => {
      gsap.ticker.remove(raf);
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((s) => s.kill());
    };
  }, []);

  return <>{children}</>;
}
