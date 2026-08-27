# Behaviours — scale.com homepage

Every value here is either read from the compiled CSS / shipped bundle
(**verified**) or measured in the browser (**measured**). Nothing is estimated.

## Scroll engine — verified
Lenis drives GSAP's ticker; `ScrollTrigger.update` is bound to Lenis' scroll
event. `<html class="lenis">`. No native `scroll-snap`, no `animation-timeline`,
no `view-timeline` anywhere on the page.

```js
new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
lenis.on("scroll", ScrollTrigger.update)
gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)
```

## 1. Hero — scroll-scrubbed WebGL · verified
450dvh (232dvh under 768px). Timeline is verbatim from the bundle:

| target | from | to | duration | ease | at |
|---|---|---|---|---|---|
| `group.scale` | 1.75 | 0.275 | 0.9 | cubic.inOut | 0 |
| `group.rotation` x/y | 0 / 0 | 0.5 / 0.6 | 0.7 | cubic.inOut | 0.2 |
| `uProgress` | 0 | 1 | 0.8 | linear | 0.2 |
| `group.position.y` | 0 | 0.165 | 0.3 | cubic.inOut | 0.7 |

Progress = `clamp(scrollY / (4.5 × innerHeight))`. Mouse parallax strength 0.25.
`uProgress` additionally gates, inside the shaders:
- curve draw-on: `if (vCurveu > progress) discard`, first wave is `id < 8.5`
- card outlines: `smoothstep(0.55, 1.0, progress)`
- travelling triangles: `smoothstep(0.1, 0.75, uProgress)`
- connector lines fade out: `smoothstep(0.4, 0.2, uProgress)`
- logo reveal: `cubicOut(clamp(uProgress * 2.5, 0, 1))`, masked by `smoothstep(0.05, 0.1, uProgress)`

## 2. Scrolling quote — pinned word reveal · verified
`h-[200dvh]`, pinned with `pinSpacing: true`, `start "top top"` / `end "bottom bottom"`.
Words stagger `opacity 0.25 → 1`, `duration 0.5`, `stagger 0.08`, `ease "none"`,
all lit by ~80% of the scrub. Background video scrubs `scale 1.1 → 1`.
Layout is a two-card stack: a 362px video card beside a `#193a29` quote card —
**not** text over a full-bleed video.

## 3. Industry ring — scroll-driven, not click-driven · measured
`{ start: "top bottom", end: "bottom top", scrub: true }`. Two synchronised things:
- the centre headline steps through 14 words (`floor(progress × 14)`)
- 12 images orbit an elliptical SVG path, advancing ⅓ of a revolution across the
  section; depth cue scales 0.8 → 1.15 and z-index 1 → 21 by normalised y

Path swaps between `INDUSTRY_RING_PATH_DESKTOP` and `..._MOBILE` at 768px.

## 4. Customer marquee — CSS animation · measured
`logo-marquee` keyframe, `translateX(0 → -50%)`, 60s linear infinite, content
duplicated for a seamless loop, `animation-play-state: paused` on hover.
Heading reveals on `{ start: "top bottom", end: "top center", scrub: true }`.

## 5. Benchmark cards / blog — staggered reveal · verified
`{ start: "top bottom", end: "bottom 75%", scrub: true }`,
`fromTo(cards, {opacity:0, y:40}, {opacity:1, y:0, stagger:0.08–0.12, ease:"none"})`.
Blog card hover: image `scale 1 → 1.04` over 500ms ease-out inside `overflow-hidden`.

## 6. CTA — parallax · verified
`{ start: "top top", end: "bottom top" }`,
`fromTo(inner, {yPercent:0}, {yPercent:-20, duration:0.75, ease:"power2.out"})`.

## 7. Header — theme-driven colour · measured
`fixed`, `z-50`, `top: var(--announcement-offset)`, `transition-colors duration-300`;
inner wrapper `duration-200 delay-20`. Sections publish their theme on enter:
- dark → `--nav-background: transparent`, `--nav-text: #fff`
- light → `--nav-background: rgba(255,255,255,.8)` + backdrop blur, `--nav-text: #000`

Announcement bar measures its own height into `--announcement-offset` via a
ResizeObserver; dismissing it settles the offset to `0px` on `transitionend`
with a 400ms backstop (a hidden tab throttles ResizeObserver delivery).

## Responsive — measured
| Width | Behaviour |
|---|---|
| ≥1450 (`3xl`) | grid tracks cap at 150px and centre |
| ≥768 (`md`) | 12-col desktop grid, full nav, hero 450dvh |
| <768 | 8-col grid, hamburger + full-screen overlay, hero 232dvh, WebGL scene ×0.65–0.9 |
| landscape phone (`oml`) | `(orientation: landscape) and (max-height: 500px)` — padding shrinks |
