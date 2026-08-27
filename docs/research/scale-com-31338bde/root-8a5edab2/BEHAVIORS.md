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

## 1. Hero — the "pull-apart" · verified against screen recording
450dvh (232dvh under 768px). A full-bleed rounded video panel shrinks, rotates
and splits into a three-plane stack: white contour lines in front (edge-detected
from the mask strip baked into the top 20% of Packed.mp4), the clip reel in the
middle, a translucent binary-annotated plane behind. Timeline verbatim from the
bundle:

| target | from | to | duration | ease | at |
|---|---|---|---|---|---|
| `group.scale` | 1.75 | 0.275 | 0.9 | cubic.inOut | 0 |
| `group.rotation` x/y | 0 / 0 | 0.5 / 0.6 | 0.7 | cubic.inOut | 0.2 |
| `uProgress` | 0 | 1 | 0.8 | linear | 0.2 |
| `group.position.y` | 0 | 0.165 | 0.3 | cubic.inOut | 0.7 |

Reconstructed additions (from the recording, not the bundle): x drift
0 → +0.05 → −0.065 to frame the copy stops; layer separation and per-layer
alpha as `smoothstep(0.08, 0.4, progress)`.

Three copy stops, text verbatim from SSR HTML, at fixed progress windows:
- 0.12–0.34 centre-bottom: "Reliable AI has no shortcuts."
- 0.38–0.62 left: ◤ APPLICATIONS · "AI systems that actually work." · For Enterprise → (+ logo strip)
- 0.66–0.97 right: ◤ DATA · "The data powering the world's best AI." · Explore Data Engine →

`Packed.mp4` is both a spatial AND temporal atlas: content in the bottom-left
80%×80%, per-clip contour masks in the top strip, and the clip reel (pilot →
driving → oil rig → crystals → surgery → ultrasound → robotics → leaderboard →
tower → studio) crossfades inside the file itself. Logo intro is time-driven at
load, not scroll-driven. Mouse parallax strength 0.25.

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

## 7. Header — theme colour + hide-on-scroll · measured
Hides on scroll-down (translateY −100%), reveals on scroll-up, always shown
near the top. Absent in every scrolled frame of the reference capture.

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
