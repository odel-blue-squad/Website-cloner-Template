"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildHeroScene } from "./hero/scene";
import { pageTheme } from "@/components/sites/scale-com-31338bde/shared/pageTheme";
import { ArrowDownIcon, ChevronRightIcon, TriangleGlyph } from "@/components/sites/scale-com-31338bde/shared/icons";
import { HERO, HERO_STOPS, TEXTURE, VIDEO } from "./content";

/**
 * The "pull-apart" hero: a full-bleed video panel that shrinks, rotates and
 * splits into a three-plane stack across 450dvh of scroll. The group timeline
 * keyframes are verbatim from scale.com's bundle:
 *
 *   scale    1.75  → 0.275   duration .9  ease cubic.inOut  at 0
 *   rotation x/y 0 → .5/.6   duration .7  ease cubic.inOut  at .2
 *   uProgress 0   → 1        duration .8  ease linear       at .2
 *   position y 0  → .165     duration .3  ease cubic.inOut  at .7
 *
 * Copy stops (verbatim SSR text) fade in at fixed progress windows while the
 * scene is pinned. GSAP's "cubic" is an alias of "power2".
 */
export function HomeHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const stopRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const host = canvasHostRef.current;
    const root = rootRef.current;
    const video = videoRef.current;
    if (!host || !root || !video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL — the poster fallback stays visible
    }

    gsap.registerPlugin(ScrollTrigger);

    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    // Full-bleed at the timeline's opening scale: 0.4 × 1.75 = 0.7 world units
    // of panel height, and 0.7 / (2 tan 25°) = 0.75.
    camera.position.z = 0.75;

    let hero: ReturnType<typeof buildHeroScene>;
    try {
      hero = buildHeroScene(video, `${TEXTURE}/logo.png`, `${TEXTURE}/numbers.png`);
    } catch {
      renderer.dispose();
      return;
    }
    scene.add(hero.group);
    if (posterRef.current) posterRef.current.style.opacity = "0";

    /* ---- exact timeline from scale.com's bundle ---- */
    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(hero.group.scale, { x: 1.75, y: 1.75, z: 1.75 }, { x: 0.275, y: 0.275, z: 0.275, duration: 0.9, ease: "power2.inOut" }, 0);
    timeline.fromTo(hero.group.rotation, { y: 0, x: 0 }, { y: 0.6, x: 0.5, duration: 0.7, ease: "power2.inOut" }, 0.2);
    timeline.to(hero.progress, { value: 1, duration: 0.8, ease: "linear" }, 0.2);
    timeline.fromTo(hero.group.position, { y: 0 }, { y: 0.165, duration: 0.3, ease: "power2.inOut" }, 0.7);
    // Reconstructed framing (not in the recovered timeline): the stack sits
    // right of centre for the left-hand copy stop, then crosses to the left
    // for the right-hand one — matching the reference capture.
    timeline.fromTo(hero.group.position, { x: 0 }, { x: 0.05, duration: 0.2, ease: "power2.inOut" }, 0.3);
    timeline.to(hero.group.position, { x: -0.065, duration: 0.15, ease: "power2.inOut" }, 0.6);
    timeline.progress(0.01);

    const resize = () => {
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h); // updateStyle stays on, or the canvas paints at DPR scale
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      hero.uniforms.uResolution.value.set(w, h);
      hero.uniforms.uDPR.value = dpr;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    window.addEventListener("resize", resize);

    /* ---- mouse parallax (scale.com uses strength 0.25) ---- */
    const pointer = { x: 0, y: 0 };
    const damped = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove);

    /* ---- DOM overlays driven from the same progress value ---- */
    const window01 = (p: number, a: number, b: number, feather: number) => {
      const rise = Math.min(1, Math.max(0, (p - a) / feather));
      const fall = Math.min(1, Math.max(0, (b - p) / feather));
      return Math.min(rise, fall);
    };

    const applyOverlays = (p: number) => {
      const headlineAlpha = 1 - Math.min(1, Math.max(0, (p - 0.05) / 0.07));
      if (headlineRef.current) {
        gsap.set(headlineRef.current, { opacity: headlineAlpha, y: headlineAlpha < 1 ? -14 * (1 - headlineAlpha) : 0 });
      }
      if (hintRef.current) gsap.set(hintRef.current, { opacity: headlineAlpha });
      HERO_STOPS.forEach((stop, index) => {
        const el = stopRefs.current[index];
        if (!el) return;
        const a = window01(p, stop.range[0], stop.range[1], 0.05);
        gsap.set(el, { opacity: a, y: 16 * (1 - a), pointerEvents: a > 0.5 ? "auto" : "none" });
      });
    };
    applyOverlays(0);

    // QA affordance (development only): ?heroProgress=0.5 freezes the scene at
    // a fixed progress so scrolled states can be captured without scrolling.
    let frozen: number | null = null;
    if (process.env.NODE_ENV === "development") {
      const q = Number(new URLSearchParams(window.location.search).get("heroProgress"));
      if (Number.isFinite(q) && q > 0) {
        frozen = Math.min(1, q);
        timeline.progress(frozen);
        applyOverlays(frozen);
      }
    }

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (frozen !== null) return;
        const p = Math.min(1, Math.max(0, self.progress));
        timeline.progress(Math.max(0.01, p));
        applyOverlays(p);
      },
      onEnter: () => pageTheme.set("dark"),
      onEnterBack: () => pageTheme.set("dark"),
    });

    const clock = new THREE.Clock();
    const tick = () => {
      const delta = clock.getDelta();
      hero.uniforms.uDelta.value = delta;
      if (!reduceMotion) hero.uniforms.uTime.value += delta;

      damped.x += (pointer.x * 0.25 - damped.x) * 0.05;
      damped.y += (pointer.y * 0.25 - damped.y) * 0.05;
      camera.position.x = damped.x * 0.15;
      camera.position.y = -damped.y * 0.15;
      camera.lookAt(0, 0, 0);

      hero.update();
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      trigger.kill();
      timeline.kill();
      hero.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  // Autoplay can be rejected before any user gesture; retry quietly.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const play = () => void video.play().catch(() => undefined);
    play();
    document.addEventListener("visibilitychange", play);
    return () => document.removeEventListener("visibilitychange", play);
  }, []);

  return (
    <div
      ref={rootRef}
      className="HomeHero relative top-0 left-0 h-[450dvh] w-full min-h-dvh bg-white max-md:h-[232dvh]"
    >
      {/* Video texture source — never painted directly, sampled by the shader. */}
      <video
        ref={videoRef}
        src={`${VIDEO}/packed.mp4`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        className="pointer-events-none absolute h-px w-px opacity-0"
        aria-hidden="true"
      />

      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-black">
        <div className="absolute inset-0 z-1 transition-opacity duration-1000 ease-out">
          <div ref={canvasHostRef} className="absolute inset-0 h-dvh w-full" style={{ touchAction: "none" }} />
        </div>

        {/* Poster shown until the GL scene reports ready (and if WebGL is absent). */}
        <div ref={posterRef} className="absolute inset-0 z-0 opacity-100 transition-opacity duration-700" aria-hidden="true">
          <Image
            src="/sites/scale-com-31338bde/root-8a5edab2/images/hero-fallback.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Opening headline — two lines, verbatim break. */}
        <div ref={headlineRef} className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="header2 text-white">
            {HERO.headingLines.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
          </h1>
        </div>

        {/* Scroll hint — bottom right, like the live site. */}
        <div ref={hintRef} className="pointer-events-none absolute right-6 bottom-6 z-10 flex items-center gap-3 md:right-10 md:bottom-8">
          <span className="font-mono text-[10px] tracking-[0.14em] text-white/70 uppercase">{HERO.scrollHint}</span>
          <span className="flex size-6 items-center justify-center rounded-[4px] border border-white/30">
            <ArrowDownIcon className="size-3 text-white" />
          </span>
        </div>

        {/* Pull-apart copy stops. */}
        {HERO_STOPS.map((stop, index) => (
          <div
            key={stop.heading}
            ref={(el) => { stopRefs.current[index] = el; }}
            className={
              stop.align === "center"
                ? "absolute inset-x-0 bottom-[10%] z-20 flex flex-col items-center gap-4 px-6 text-center opacity-0"
                : stop.align === "left"
                  ? "absolute top-1/2 left-[8%] z-20 flex max-w-[300px] -translate-y-1/2 flex-col items-start gap-4 opacity-0 xl:left-[12%]"
                  : "absolute top-1/2 right-[8%] z-20 flex max-w-[300px] -translate-y-1/2 flex-col items-start gap-4 opacity-0 xl:right-[10%]"
            }
          >
            {stop.eyebrow ? (
              <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-scale-gray-60 uppercase md:text-[11px]">
                <TriangleGlyph className="size-[7px] text-scale-gray-60" />
                {stop.eyebrow}
              </p>
            ) : null}
            <h3 className={`text-[22px] leading-[1.2] text-white md:text-[26px] ${stop.align === "center" ? "max-w-[400px]" : ""}`}>
              {stop.heading}
            </h3>
            <p className={`text-[12px] leading-[1.5] text-white/60 ${stop.align === "center" ? "max-w-[360px]" : "max-w-[280px]"}`}>
              {stop.body}
            </p>
            {stop.cta ? (
              <a
                href={stop.href ?? "#"}
                className="mt-1 inline-flex h-8 items-center gap-1.5 rounded-md bg-scale-evergreen px-3 text-[12px] font-medium text-white transition-opacity duration-200 hover:opacity-85"
              >
                {stop.cta}
                <ChevronRightIcon className="size-3.5" />
              </a>
            ) : null}
            {stop.eyebrow === "Applications" ? (
              <div className="mt-4 flex items-center gap-6 opacity-60">
                {HERO.logos.map((logo) => (
                  <Image key={logo} src={logo} alt="" width={52} height={24} className="h-6 w-auto object-contain brightness-0 invert" />
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
