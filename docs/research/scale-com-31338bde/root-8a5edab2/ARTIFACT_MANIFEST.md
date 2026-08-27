# Artifact Manifest — scale.com → /

## Assets (41 downloaded, 0 failures)
| Group | Count | Location |
|---|---|---|
| Industry photos | 12 | `public/sites/<site>/<page>/images/industry-*.{jpg,png}` |
| Customer logos | 11 | `.../images/logo-*.png` |
| Hero logo strip | 4 | `.../images/hero-logo-*.png` |
| Blog imagery | 7 | `.../images/blog-*.{jpg,png}` |
| Hero poster | 1 | `.../images/hero-fallback.jpg` |
| Videos | 3 | `.../videos/{packed,quote-bg,cta-bg}.mp4` |
| Shader textures | 3 | `.../textures/{perlin256,numbers,logo}.png` |
| Fonts | 3 | `public/sites/<site>/shared/fonts/switzer-*.woff2` |

Re-runnable via `scripts/download-assets-scale-com-31338bde-root-8a5edab2.mjs`.
No Atlas Cloud fallback was used — every asset is the genuine original.

## Deliberate substitutions
| Original | Replacement | Reason |
|---|---|---|
| Aeonik Pro / Aeonik Mono | Switzer (Fontshare, ITF Free Font License) with metric overrides | commercial licence, not redistributable |

Metric pinning: `size-adjust: 97.56%`, `ascent-override: 95.33%`,
`descent-override: 23.58%`, `line-gap-override: 0%`. Derived from Aeonik's
measured metrics vs Switzer's parsed `OS/2` table across 6 sample strings
(per-sample width ratio 0.951–1.002). Line boxes match; letterforms differ.

## Reconstructed rather than copied
- **Hero curve network.** The 18-curve path data is a binary blob in scale.com's
  bundle that minification does not preserve. `hero/geometry.ts` regenerates an
  equivalent set (seeded, deterministic) with the same structure and the same
  `id < 8.5` first-wave grouping the shaders depend on. Shaders, timeline and
  geometry primitives are exact; these paths are not.
- **`Packed.mp4` atlas rect.** Measured from the decoded frame (content fills the
  bottom-left 1536×864 of 1920×1080) rather than read from the bundle.

## Trademarked material present
The Scale wordmark and brand mark are in `shared/icons.tsx` as `BrandLogo` /
`BrandMark`, and customer logos are in `images/logo-*.png`. These are third-party
trademarks. This build is intended as a template to restyle — replace those two
components and the customer logo set before any public deployment.

## Not reproduced (out of scope)
Sanity CMS, Qualified chat, OneTrust consent, HubSpot forms, Segment / GTM /
FullStory / Meta / LinkedIn / Bing / Twitter / Outbrain / ZoomInfo / Dreamdata
pixels, dashboard auth, and the `/demo` form submission.
