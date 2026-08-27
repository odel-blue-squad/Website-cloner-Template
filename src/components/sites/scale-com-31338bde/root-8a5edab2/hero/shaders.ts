/**
 * GLSL for the home-hero "pull-apart" scene.
 *
 * The video panel program is ported from scale.com's bundle (shipped
 * unminified); the contour and annotation planes reproduce the layer stack
 * visible in the reference capture: a front plane drawing white contour lines
 * derived from the mask strip baked into the top 20% of Packed.mp4, and a
 * translucent back plane with binary annotations from numbers.png.
 */

const PRELUDE = /* glsl */ `
uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;
uniform float uDPR;
`;

/**
 * Fragment programs need an explicit colour output: these compile as GLSL3
 * (texelFetch/textureSize) and this three.js version does not alias
 * gl_FragColor there, so declare it — the ported bodies stay verbatim.
 */
const FRAG_PRELUDE = PRELUDE + /* glsl */ `
layout(location = 0) out highp vec4 pc_fragColor;
#define gl_FragColor pc_fragColor
`;

const EASINGS = /* glsl */ `
float cubicInOut(float t) {
    return t < 0.5
        ? 4.0 * t * t * t
        : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}
`;

const SDF_HELPERS = /* glsl */ `
float sdRoundedBox( vec2 p, vec2 b, vec4 _r ) {
  vec4 r = vec4(0.0);
  r.xy = (p.x>0.0)?_r.xy : _r.zw;
  r.x  = (p.y>0.0)?_r.x  : _r.y;
  vec2 q = abs(p)-b+r.x;
  return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}

float aastep(float threshold, float value) {
  float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
  return smoothstep(threshold-afwidth, threshold+afwidth, value);
}
`;

/* ── shared vertex: aspect-corrected rounded panel ──────────────────────── */

export const PANEL_VERT = PRELUDE + /* glsl */ `
uniform float uProgress;

varying vec2 vUv;

void main() {
  vUv = uv;

  float containerAspect = 1.77;
  vec3 pos = position;
  pos.x *= containerAspect;

  pos *= 0.4;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  float isMobile = uResolution.x < 768.0 ? 1.0 : 0.0;
  gl_Position.xyz *= mix(1.0, 0.65, isMobile);
}
`;

/* ── 1. video panel (ported, plus packed-atlas remap and headline dim) ──── */

export const PANEL_FRAG = FRAG_PRELUDE + EASINGS + SDF_HELPERS + /* glsl */ `
uniform sampler2D tMap;
uniform sampler2D tLogo;
uniform float uProgress;
uniform float uAlpha;

/**
 * Packed.mp4 is an atlas: the 16:9 clip reel fills the bottom-left 80% x 80%
 * of the 1920x1080 frame; the top 20% strip holds per-clip contour masks and
 * sync markers. Sampling the raw frame paints the padding as black bars.
 */
uniform vec2 uMapScale;
uniform vec2 uMapOffset;

/** Darkens the footage under the opening headline; released as it shrinks. */
uniform float uDim;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // scale image to fit depending on aspect ratio
  uv -= 0.5;
  ivec2 texSize = textureSize(tMap, 0);
  float imageAspect = (float(texSize.x) * uMapScale.x) / (float(texSize.y) * uMapScale.y);
  vec2 scale = vec2(imageAspect * 0.5, 1.0);
  uv *= scale;
  uv += 0.5;

  // remap into the populated region of the packed atlas
  uv = uv * uMapScale + uMapOffset;

  vec3 color = texture2D(tMap, uv).rgb;
  color = color * 2.0 - 1.0;
  color *= 0.8;
  color = color * 0.5 + 0.5;

  float cornerRadius = 0.078;
  float containerAspect = 1.77;

  float alpha = sdRoundedBox((vUv - 0.5) * vec2(containerAspect, 1.0), vec2(0.5 * containerAspect, 0.5), vec4(cornerRadius));
  alpha = 1.0 - aastep(0.0, alpha);

  float noise = rand(vUv + fract(uTime)) * 2.0 - 1.0;
  color += noise * 0.04;

  // logo intro — plays once on load (time-driven), then hands off to the video
  float intro = smoothstep(0.15, 0.55, uTime) * (1.0 - smoothstep(1.4, 2.2, uTime));
  vec2 logoUv = vUv;
  float animatedScale = max(cubicOut(clamp(intro * 2.5, 0.0, 1.0)), 1e-4);
  logoUv -= 0.5;
  logoUv.x *= containerAspect;
  logoUv *= 4.0;
  logoUv *= 1.0 / animatedScale;
  logoUv += 0.05;
  logoUv += 0.5;
  float logo = texture2D(tLogo, logoUv).r;
  logo = aastep(0.5, logo);
  logo *= intro;
  color = mix(color, vec3(1.0), logo);

  // headline legibility scrim, only while full-bleed
  color = mix(color, vec3(0.0), uDim);

  gl_FragColor = vec4(color, alpha * uAlpha);
}
`;

/* ── 2. front contour plane ─────────────────────────────────────────────── */

export const CONTOUR_FRAG = FRAG_PRELUDE + SDF_HELPERS + /* glsl */ `
uniform sampler2D tMap;
uniform float uAlpha;

/** Populated region of the mask strip (markers at the edges are cropped). */
const vec2 MASK_MIN = vec2(0.000, 0.808);
const vec2 MASK_MAX = vec2(0.800, 0.995);

varying vec2 vUv;

void main() {
  float containerAspect = 1.77;

  // rounded-rect bounds + hairline border
  float d = sdRoundedBox((vUv - 0.5) * vec2(containerAspect, 1.0), vec2(0.5 * containerAspect, 0.5), vec4(0.078));
  float inside = 1.0 - aastep(0.0, d);
  float border = aastep(0.0, d + 0.006) - aastep(0.0, d);

  // stretch the squashed mask thumbnail back over the panel
  vec2 uv = mix(MASK_MIN, MASK_MAX, vUv);
  float m = texture2D(tMap, uv).r;

  // outline the mask shapes rather than filling them
  float edge = length(vec2(dFdx(m), dFdy(m)));
  float line = smoothstep(0.08, 0.45, edge);

  float alpha = (line * 0.85 + border * 0.5) * inside;
  gl_FragColor = vec4(vec3(1.0), alpha * uAlpha);
}
`;

/* ── 3. back annotation plane ───────────────────────────────────────────── */

export const BACKPLANE_FRAG = FRAG_PRELUDE + EASINGS + SDF_HELPERS + /* glsl */ `
uniform sampler2D tNumbers;
uniform float uAlpha;

varying vec2 vUv;

void main() {
  float containerAspect = 1.77;

  float d = sdRoundedBox((vUv - 0.5) * vec2(containerAspect, 1.0), vec2(0.5 * containerAspect, 0.5), vec4(0.078));
  float inside = 1.0 - aastep(0.0, d);
  float border = aastep(0.0, d + 0.005) - aastep(0.0, d);

  // translucent smoked-glass fill
  vec3 color = vec3(0.045, 0.055, 0.05);
  float alpha = inside * 0.55;

  // binary annotations down the right edge, glyphs from the numbers atlas
  if (vUv.x > 0.9 && vUv.x < 0.985) {
    float row = floor(vUv.y * 9.0);
    vec2 cell = vec2(fract((vUv.x - 0.9) / 0.085), fract(vUv.y * 9.0));
    // pick a pseudo-random glyph column per row from the 8x4 atlas
    float g = floor(rand(vec2(row, 7.0)) * 8.0);
    vec2 nUv = vec2((g + cell.x) / 8.0, (2.0 + cell.y) / 4.0);
    float digit = texture2D(tNumbers, nUv).r;
    float show = step(0.55, rand(vec2(row, 3.0)));
    color = mix(color, vec3(1.0), digit * show * 0.8);
    alpha = max(alpha, digit * show * 0.8 * inside);
  }

  alpha = max(alpha, border * 0.6);
  color = mix(color, vec3(1.0), border * 0.6);

  gl_FragColor = vec4(color, alpha * uAlpha);
}
`;
