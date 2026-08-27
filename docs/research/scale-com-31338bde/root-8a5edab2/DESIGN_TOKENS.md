# Design Tokens — scale.com

All values lifted verbatim from the compiled stylesheets, not measured.

## Colour
| Token | Hex |
|---|---|
| scale-gray-10 | `#212121` |
| scale-gray-20 | `#373737` |
| scale-gray-30 | `#575757` |
| scale-gray-60 | `#929292` |
| scale-gray-80 | `#c7c7c7` |
| scale-gray-90 | `#eaeaea` |
| scale-gray-95 | `#f2f2f2` |
| scale-mauve | `#c88bc4` |
| scale-lightmauve | `#d1aad7` |
| scale-periwinkle | `#7b8fdd` |
| scale-skyblue | `#86bff2` |
| gradient-1/2/3 | `#9068c2` / `#5933b2` / `#8a507e` |

Body: `#fff` bg, `#000` text. Footer + quote section: `#000` bg, `#fff` text.

## Type scale (desktop → mobile ≤767px)
| Class | Desktop | Mobile |
|---|---|---|
| `.header1` | 7.5rem / 1 | 2.5rem / 1.05 |
| `.header2` | 4rem / 1.05 | 2rem / 1.05 |
| `.header3-regular` | 2.5rem / 1.25 | 1.5rem / 1.05 |
| `.header4-regular` | 2rem / 1.5, ls −0.03em | 1.5rem / 1.05 |
| `.header4-medium` | 2rem / 1.5, w500 | 1.5rem / 1.05 |
| `.header5-regular` | 1.5rem / 1.5 | 1.375rem / 1.05 |
| `.header5-medium` | 1.5rem / 1.5, w500 | 1.375rem / 1.05 |
| `.header6` | 1.25rem / 1.5 | 1.125rem / 1.05 |
| `.body1` | 1.25rem / 1.5 | 1rem / 1.45 |
| `.body3` | 0.875rem / 1.5 | 0.875rem / 1.35 |

## Grid
- `.grid-layout-desktop` — `repeat(12, minmax(0,150px))`, gap `.5rem`, `justify-content:center`, padding `0 1.5rem`
- `.grid-layout-mobile` — `repeat(8, 1fr)`, gap `.5rem`, padding `0 1.5rem`
- `.grid-padding` — padding `0 1.5rem`

## Breakpoints
`sm 640` · `md 768` · `lg 1024` · `xl 1280` · **`oml 1450`** (custom)
Design canvas: desktop `1550×880`, mobile `390×844`. Header height `67px` (`119px` ≤767).

## Typography substitution
Aeonik Pro is commercially licensed and is **not** vendored. Switzer (Fontshare,
ITF Free Font License) is pinned to Aeonik's measured metrics:

| | Aeonik (measured) | Switzer (natural) | Applied override |
|---|---|---|---|
| ascent | 0.930 | 0.980 | `ascent-override: 95.33%` |
| descent | 0.230 | 0.250 | `descent-override: 23.58%` |
| cap-height | 0.700 | 0.680 | — |
| x-height | 0.510 | 0.531 | — |
| advance width | — | — | `size-adjust: 97.56%` |

Ratio derived from 6 sample strings; per-sample spread 0.951–1.002. Line boxes
land identically; only letterforms differ.
