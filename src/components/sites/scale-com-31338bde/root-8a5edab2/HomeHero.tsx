"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildHeroScene, type HeroScene } from "./hero/scene";
import { pageTheme } from "@/components/sites/scale-com-31338bde/shared/pageTheme";
import { ArrowDownIcon } from "@/components/sites/scale-com-31338bde/shared/icons";
import { HERO, TEXTURE, VIDEO } from "./content";

/**
 * The hero is a scroll-scrubbed three.js scene pinned across 450dvh (232dvh on
 * mobile). Scene geometry, shaders and the GSAP timeline below are ports of
 * scale.com's own — the timeline keyframes are verbatim from their bundle:
 *
 *   scale    1.75  → 0.275   duration .9  ease cubic.inOut  at 0
 *   rotation x/y 0 → .5/.6   duration .7  ease cubic.inOut  at .2
 *   uProgress 0   → 1        duration .8  ease linear       at .2
 *   position y 0  → .165     duration .3  ease cubic.inOut  at .7
 *
 * GSAP's "cubic" is an alias of "power2", so power2.inOut is the same curve.
 */
export function HomeHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

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
    camera.position.z = 1;

    let hero: HeroScene;
    try {
      hero = buildHeroScene(video, `${TEXTURE}/logo.png`);
    } catch {
      renderer.dispose();
      return;
    }
    scene.add(hero.group);
    setReady(true);

    /* ---- exact timeline from scale.com's bundle ---- */
    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(hero.group.scale, { x: 1.75, y: 1.75, z: 1.75 }, { x: 0.275, y: 0.275, z: 0.275, duration: 0.9, ease: "power2.inOut" }, 0);
    timeline.fromTo(hero.group.rotation, { y: 0, x: 0 }, { y: 0.6, x: 0.5, duration: 0.7, ease: "power2.inOut" }, 0.2);
    timeline.to(hero.progress, { value: 1, duration: 0.8, ease: "linear" }, 0.2);
    timeline.fromTo(hero.group.position, { y: 0 }, { y: 0.165, duration: 0.3, ease: "power2.inOut" }, 0.7);
    timeline.progress(0.01);

    const resize = () => {
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      hero.uniforms.uResolution.value.set(w, h);
      hero.uniforms.uDPR.value = dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ---- mouse parallax (scale.com uses strength 0.25) ---- */
    const pointer = { x: 0, y: 0 };
    const damped = { x: 0, y: 0 };
    const PARALLAX_STRENGTH = 0.25;
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove);

    /* ---- scroll drives timeline progress across the section ---- */
    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => timeline.progress(Math.min(1, Math.max(0, self.progress))),
      onEnter: () => pageTheme.set("dark"),
      onEnterBack: () => pageTheme.set("dark"),
    });

    const clock = new THREE.Clock();
    const tick = () => {
      const delta = clock.getDelta();
      hero.uniforms.uDelta.value = delta;
      if (!reduceMotion) hero.uniforms.uTime.value += delta;

      damped.x += (pointer.x * PARALLAX_STRENGTH - damped.x) * 0.05;
      damped.y += (pointer.y * PARALLAX_STRENGTH - damped.y) * 0.05;
      camera.position.x = damped.x * 0.15;
      camera.position.y = -damped.y * 0.15;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
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
        <div
          className={`absolute inset-0 z-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
          aria-hidden="true"
        >
          <Image
            src="/sites/scale-com-31338bde/root-8a5edab2/images/hero-fallback.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <section className="absolute top-0 left-0 z-10 flex min-h-dvh w-full flex-col items-center justify-center px-6 text-center">
          <h1 className="header2 max-w-[18ch] text-white">{HERO.heading}</h1>
        </section>

        <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="body3 tracking-wider text-white/70 uppercase">{HERO.scrollHint}</span>
          <ArrowDownIcon className="size-4 shrink-0 animate-bounce text-white" />
        </div>

        <div className="absolute bottom-28 left-1/2 z-10 flex -translate-x-1/2 items-center gap-8 opacity-70 md:bottom-24 md:gap-12">
          {HERO.logos.map((logo) => (
            <Image key={logo} src={logo} alt="" width={68} height={30} className="h-[30px] w-auto object-contain brightness-0 invert" />
          ))}
        </div>
      </div>
    </div>
  );
}
