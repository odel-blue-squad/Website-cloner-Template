# Bundle Forensics — scale.com

Recovered by downloading all 30 first-party `_next/static/immutable/chunks/*.js`
and grepping. **No source maps** (`.map` → HTTP 404), but minification preserved
every object literal, so animation parameters are exact rather than measured.

## Stack
| Library | Evidence |
|---|---|
| three.js **r181** | `<canvas data-engine="three.js r181">` |
| GSAP + ScrollTrigger | `.pin-spacer` in DOM; `gsap`×70, `ScrollTrigger`×34 in bundle |
| GSAP SplitText | `SplitText(R.current, f)` — per-word/char text reveals |
| Lenis | `<html class="lenis">`; `lenis`×35 |
| Sanity CMS | all imagery from `cdn.sanity.io/…/50zba0eo/production/` |

`window.gsap` is undefined — GSAP is bundled as a module, so `.pin-spacer` is the
reliable fingerprint, not the global.

## Hero timeline — verbatim from chunk `3ax6vrov02jl8.js`
```js
P = gsap.timeline({ paused: true })
P.fromTo(h.scale,    {x:1.75,y:1.75,z:1.75}, {x:.275,y:.275,z:.275, duration:.9, ease:"cubic.inOut"}, 0)
P.fromTo(h.rotation, {y:0,x:0},              {y:.6,  x:.5,          duration:.7, ease:"cubic.inOut"}, .2)
P.to(T,              {value:1,                              duration:.8, ease:"linear"},      .2)
P.fromTo(h.position, {y:0},                  {y:.165,       duration:.3, ease:"cubic.inOut"}, .7)
P.progress(.01)

// driven every tick from smoothed scroll:
onTick(e, {animatedScrollY:t}) {
  const n = Math.min(1, Math.max(0, t / Math.max(1, 4.5 * window.innerHeight)))
  P.progress(n)
}
```
Section visibility is toggled from the same progress value:
`progress ∈ [0.15, 0.35] → section 0 visible`, `progress ∈ [0.65, 1] → section 1 visible`.
This matches the DOM's `h-[450dvh]` (4.5 viewports) exactly.

## Shaders
16 GLSL blocks ship **unminified with the original authors' comments** — 7
vertex/fragment pairs for the hero plus 2 image-transition programs. Saved to
`docs/research/<site>/<page>/glsl/`. Helper functions present:
`homeHeroIsPhone`, `homeHeroIsTablet`, `homeHeroPhoneFinalPosY`,
`homeHeroScaleBandWorldPos`; uniforms `uTime uDelta uResolution uDPR uProgress
uAlpha uMap uMapB uMapMask uMeshSize uOffset uScale uCrossfade`.

Textures: `/static/assets/textures/{perlin256,numbers,logo}.png`,
video texture `/static/assets/videos/Packed.mp4`.

## ScrollTrigger configs found (assign to sections)
```js
{ start:"top bottom", end:"top center" }                                   // logo cloud progress
{ start:"top bottom", end:"bottom top",  pinSpacing:false }                // generic reveal
{ start:"top top",    end:"bottom top",  setupTimeline: tl =>
    tl.fromTo(el,{yPercent:0},{yPercent:-20,duration:.75,ease:"power2.out"},0) } // parallax out
{ trigger:e, start:"top bottom", end:"bottom 75%", scrub:true }
{ start:"top center-=15%", end:"top top+=1%", pin:el, pinSpacing:true, pinReparent:true }
{ start:"top bottom-=30%", end:"top top", pinSpacing:false }
{ trigger:$, start:"top top", end:()=>`+=${1.5*window.innerHeight}` }
{ start:()=>matchMedia("(max-width: 769px)").matches
    ? "bottom bottom-=50vh" : "bottom bottom", end:()=>`+=${1.5*innerHeight}` }
```

## Not reproducible
- **Aeonik Pro / Aeonik Mono** — commercial (CoType Foundry). Substituted with
  Switzer + metric overrides; see `DESIGN_TOKENS.md`.
- three.js **scene construction** (particle counts, curve geometry generation) is
  behind mangled identifiers — shaders and timeline are exact, the scene graph is
  a faithful reconstruction.
