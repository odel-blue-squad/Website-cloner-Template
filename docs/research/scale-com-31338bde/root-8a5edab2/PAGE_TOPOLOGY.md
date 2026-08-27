# Page Topology — scale.com homepage

Total document height at 1280×720: **10,015px**. Structure is
`<main> → div.relative.overflow-x-hidden → [script, header, div.CMSSliceRenderer] , footer`.

| # | Section | Height | Background | Interaction model |
|---|---|---|---|---|
| — | `AnnouncementBar` | ~40px | black | fixed `z-[110]`, dismissible, sets `--announcement-offset` |
| — | `SiteHeader` | 88px | transparent → translucent | fixed `z-50`, colour follows section theme |
| 0 | `HomeHero` | 3240px (450dvh / 232dvh mobile) | black | **scroll-scrubbed three.js**, GSAP-pinned |
| 1 | `ScrollingQuote` | 1440px (200dvh) | black | pinned, word-by-word reveal over video |
| 2 | `IndustryRing` | 1460px | `#eaeaea` | scroll-driven word cycler + orbiting image ring |
| 3 | `CustomerMarquee` | 580px | `#eaeaea` | CSS marquee, hover-pause |
| 4 | `BenchmarkCards` | 851px | `#eaeaea` → transparent | scroll reveal with stagger |
| 5 | `BlogPreview` | 1247px | white | scroll reveal + hover zoom |
| 6 | `CtaSection` | 744px | white, video panel | scroll parallax `yPercent 0 → -20` |
| — | `SiteFooter` | 994px | black | static, hover states |

## Layering
- `z-[110]` announcement · `z-50` header · `z-10` hero copy · `z-1`/`z-2` section content
- Sections 2–4 share one `ScrollRevealSection` wrapper with `isolate` to create
  separate stacking contexts, so pinned siblings never bleed across each other.

## Theme flips (drive the fixed header)
`dark` → hero, scrolling quote, CTA-over-video, footer.
`light` → industry ring, customers, benchmark cards, blog.
Each section calls `pageTheme.set(...)` on enter/enter-back; the header reads it and
animates via `transition-colors duration-300`.

## Scroll engine
Lenis (`duration 1.2`, exponential ease) drives GSAP's ticker; `ScrollTrigger.update`
is bound to Lenis' scroll event so pinning and scrubbing stay in sync. No native
`scroll-snap` and no `animation-timeline` anywhere on the page.
