/**
 * GLSL for the home hero, ported from scale.com's bundle where the shaders ship
 * unminified. Bodies are verbatim; only the shared uniform prelude has been
 * trimmed to the uniforms these programs actually read.
 */

/** Injected at the top of every program (scale.com does the same). */
const PRELUDE = /* glsl */ `
uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;
uniform float uDPR;
`;

/**
 * Fragment programs additionally need an explicit colour output. These shaders
 * are compiled as GLSL3 (they use texelFetch/textureSize), and this three.js
 * version does not alias gl_FragColor for GLSL3 ShaderMaterials, so we declare
 * it here — that keeps the ported shader bodies byte-for-byte verbatim.
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

/* ── 1. Video panel ─────────────────────────────────────────────────────── */

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

export const PANEL_FRAG = FRAG_PRELUDE + EASINGS + /* glsl */ `
uniform sampler2D tMap;
uniform sampler2D tLogo;
uniform float uProgress;
uniform float uAlpha;

varying vec2 vUv;

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

void main() {
  vec2 uv = vUv;

  // scale image to fit depending on aspect ratio
  uv -= 0.5;
  ivec2 texSize = textureSize(tMap, 0);
  float imageAspect = float(texSize.x) / float(texSize.y);
  vec2 scale = vec2(imageAspect * 0.5, 1.0);
  uv *= scale;
  uv += 0.5;

  vec3 color = texture2D(tMap, uv).rgb;
  color = color * 2.0 - 1.0;
  color *= 0.8;
  color = color * 0.5 + 0.5;

  // blend between corner radius sizes for full screen transition
  float cornerRadius = 0.078;

  // blend between aspect ratios for corners so they don't get stretched
  float containerAspect = 1.77;

  // create rounded rectangle mask
  float alpha = sdRoundedBox((vUv - 0.5) * vec2(containerAspect, 1.0), vec2(0.5 * containerAspect, 0.5), vec4(cornerRadius));
  alpha = 1.0 - aastep(0.0, alpha);

  float noise = rand(vUv + fract(uTime)) * 2.0 - 1.0;
  color += noise * 0.04;

  // logo
  vec2 logoUv = vUv;
  float animatedScale = cubicOut(clamp(uProgress * 2.5, 0.0, 1.0));
  logoUv -= 0.5;
  logoUv.x *= containerAspect;
  logoUv *= 4.0;
  logoUv *= 1.0 / animatedScale;
  logoUv += 0.05;
  logoUv += 0.5;
  float logo = texture2D(tLogo, logoUv).r;
  logo = aastep(0.5, logo);
  logo *= smoothstep(0.05, 0.1, uProgress);
  color = mix(color, vec3(1.0), logo);

  alpha *= 0.65;
  alpha *= uAlpha;

  alpha = mix(alpha, 1.0, logo);

  gl_FragColor = vec4(color, alpha);
}
`;

/* ── 2. Card outlines at each curve terminus ────────────────────────────── */

export const CARD_VERT = PRELUDE + EASINGS + /* glsl */ `
attribute vec3 offset;
attribute float id;

uniform float uProgress;
uniform float uAlpha;

void main() {
  vec3 pos = position;
  float r = rand(vec2(id + 200.0));

  float group1 = id < 8.5 ? 1.0 : 0.0;
  float group2 = 1.0 - group1;

  float progress = 0.0;
  progress += (uProgress * 2.0 - r * 0.25) * group1;
  progress += group2 * clamp(uProgress * 3.0 - 1.0 - r * 0.5, 0.0, 1.0);
  progress = clamp(progress, 0.0, 1.0);

  pos *= 0.14 * smoothstep(0.55, 1.0, progress);
  pos += offset;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  float isMobile = uResolution.x < 768.0 ? 1.0 : 0.0;
  gl_Position.xyz *= mix(1.0, 0.9, isMobile);
}
`;

export const CARD_FRAG = FRAG_PRELUDE + /* glsl */ `
uniform float uProgress;

void main() {
  vec3 color = vec3(1.0, 1.0, 1.0);
  float alpha = 1.0;

  alpha *= smoothstep(0.4, 0.2, uProgress);

  gl_FragColor = vec4(color, alpha);
}
`;

/* ── 3. Main curve network (draws on) ───────────────────────────────────── */

export const CURVE_VERT = PRELUDE + /* glsl */ `
attribute float curveu;
attribute float id;

varying float vCurveu;
varying float vRand;
varying float vId;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vCurveu = curveu;
    vRand = rand(vec2(id + 200.0));
    vId = id;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    float isMobile = uResolution.x < 768.0 ? 1.0 : 0.0;
    gl_Position.xyz *= mix(1.0, 0.9, isMobile);
}
`;

export const CURVE_FRAG = FRAG_PRELUDE + EASINGS + /* glsl */ `
uniform float uProgress;

varying float vCurveu;
varying float vRand;
varying float vId;

void main() {
    vec3 color = vec3(1.0);

    // group first n lines so they appear first
    float group1 = vId < 8.5 ? 1.0 : 0.0;
    float group2 = 1.0 - group1;

    float progress = 0.0;

    // mask first group
    progress += (uProgress * 1.5 - vRand * 0.25) * group1;

    // mask second group
    progress += group2 * clamp(uProgress * 3.0 - 1.0 - vRand * 0.5, 0.0, 1.0);
    progress = clamp(progress, 0.0, 1.0);

    progress *= smoothstep(0.1, 0.4, progress);

    // animate in
    if (vCurveu > progress) discard;

    float alpha = 1.0;

    gl_FragColor = vec4(color, alpha);
}
`;

/* ── 4. Triangles travelling along the curves ───────────────────────────── */

export const TRAVELLER_VERT = PRELUDE + EASINGS + /* glsl */ `
attribute vec3 offset;
attribute float id;

uniform sampler2D tCurves;
uniform float uProgress;

varying float vMask;
varying float vProgress;

void main() {
    vec3 pos = position;
    float r = rand(vec2(id + 200.0));

    // group first n lines so they appear first
    float group1 = id < 8.5 ? 1.0 : 0.0;
    float group2 = 1.0 - group1;
    float progress = 0.0;

    // mask first group
    progress += (uProgress * 2.0 - r * 0.25) * group1;

    // mask second group
    progress += group2 * clamp(uProgress * 3.0 - 1.0 - r, 0.0, 1.0);
    progress = clamp(progress, 0.0, 1.0);

    float t = uTime * 0.1 + r;
    float curveLength = float(textureSize(tCurves, 0).x);
    float loopedTime = fract(t - r * 10.0);
    vProgress = loopedTime;
    loopedTime *= curveLength;
    float blend = fract(loopedTime);
    vec3 prevpos = texelFetch(tCurves, ivec2(int(loopedTime), int(id)), 0).rgb;
    vec3 nextpos = texelFetch(tCurves, ivec2(int(loopedTime) + 1, int(id)), 0).rgb;
    vec3 curveOffset = mix(prevpos, nextpos, blend);

    float pscale = 0.03;
    pscale *= smoothstep(0.01, 0.05, vProgress);
    pscale *= smoothstep(0.99, 0.95, vProgress);
    pscale *= smoothstep(0.0, -0.025, vProgress - progress);
    pscale *= smoothstep(0.1, 0.75, uProgress);

    vMask = pscale;

    pos *= pscale;
    pos += curveOffset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    float isMobile = uResolution.x < 768.0 ? 1.0 : 0.0;
    gl_Position.xyz *= mix(1.0, 0.9, isMobile);
}
`;

export const TRAVELLER_FRAG = FRAG_PRELUDE + /* glsl */ `
varying float vMask;
varying float vProgress;

void main() {
    vec3 color = vec3(1.0);
    gl_FragColor = vec4(color, 1.0);
}
`;

/* ── 5. Free-floating mini triangles ────────────────────────────────────── */

export const PARTICLE_VERT = PRELUDE + EASINGS + /* glsl */ `
attribute vec3 offset;
attribute float id;

uniform float uProgress;

varying float vRandom;
varying float vId;

void main() {
    float scale = mix(0.07, 0.2, rand(offset.xy));
    vec3 pos = position;
    pos *= scale;

    // animated scale
    float r = rand(vec2(id + 200.0));

    // group first n lines so they appear first
    float group1 = id < 8.5 ? 1.0 : 0.0;
    float group2 = 1.0 - group1;

    float progress = 0.0;

    // mask first group
    progress += (uProgress * 2.0 - r * 0.25) * group1;

    // mask second group
    progress += group2 * clamp(uProgress * 3.0 - 1.0 - r * 0.5, 0.0, 1.0);
    progress = clamp(progress, 0.0, 1.0);

    pos *= smoothstep(0.6, 1.0, progress);

    pos += offset;

    vRandom = r;
    vId = id;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    float isMobile = uResolution.x < 768.0 ? 1.0 : 0.0;
    gl_Position.xyz *= mix(1.0, 0.75, isMobile);
}
`;

export const PARTICLE_FRAG = FRAG_PRELUDE + /* glsl */ `
varying float vRandom;
varying float vId;

void main() {
    vec3 color = vec3(1.0, 1.0, 1.0);
    float alpha = 1.0;

    gl_FragColor = vec4(color, alpha);
}
`;

/* ── 6. Connector lines between the mini triangles ──────────────────────── */

export const CONNECTOR_VERT = PRELUDE + EASINGS + /* glsl */ `
attribute float curveu;

uniform sampler2D tPoints;
uniform float uProgress;

varying vec3 vColor;

void main() {
    vec3 pos = position;

    if (uProgress < 0.4) {
      // get two points
      float timeoffset = sin(uTime * 3.1415 * 0.5) * 0.1;
      float t = floor(fract(uTime * 0.05 + timeoffset) * 32.0);
      int u1 = int(floor(t + (curveu * 7.0))) + 0;
      int u2 = int(floor(t + (curveu * 7.0))) + 1;
      vec3 pos1 = texelFetch(tPoints, ivec2(u1, 0), 0).xyz;
      vec3 pos2 = texelFetch(tPoints, ivec2(u2, 0), 0).xyz;

      // animate points to match other shader
      pos1.x += sin(uTime * 1.14 + pos1.x * 24.0) * 0.01;
      pos2.x += sin(uTime * 1.14 + pos2.x * 24.0) * 0.01;
      pos1.y += cos(uTime * 1.1 + pos1.y * 28.0) * 0.01;
      pos2.y += cos(uTime * 1.1 + pos2.y * 28.0) * 0.01;

      // draw line
      float dist = distance(pos1, pos2);
      vec3 tangent = normalize(pos2 - pos1);
      vec3 normal = cross(tangent, vec3(0.0, 0.0, 1.0));
      float sectionCurveu = fract(curveu * 7.0);
      pos = mix(pos1, pos2, sectionCurveu);

      // bend line outwards in the middle
      float mask = 1.0 - abs(sectionCurveu - 0.5) * 2.0;
      mask = smoothstep(0.0, 1.0, pow(mask, 0.45));
      float curveStrength = sin(sectionCurveu * 2.0 + uTime * 2.5 + timeoffset * 2.0 + float(u1) * 500.0) * 0.5 + 0.5;
      curveStrength *= 0.3;
      pos += normal * mask * dist * curveStrength;
    }

    vColor = vec3(1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    float isMobile = uResolution.x < 768.0 ? 1.0 : 0.0;
    gl_Position.xyz *= mix(1.0, 0.75, isMobile);
}
`;

export const CONNECTOR_FRAG = FRAG_PRELUDE + /* glsl */ `
uniform float uProgress;

varying vec3 vColor;

void main() {
    vec3 color = vec3(1.0);
    float alpha = 1.0;

    alpha *= smoothstep(0.4, 0.2, uProgress);

    gl_FragColor = vec4(color, alpha);
}
`;
