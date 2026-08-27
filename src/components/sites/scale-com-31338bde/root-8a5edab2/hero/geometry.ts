/**
 * Line-strip geometry helpers, ported 1:1 from scale.com's bundle.
 * Both return a flat [x,y,z, x,y,z, …] point list describing a closed outline;
 * callers expand consecutive pairs into LineSegments.
 */

export interface RoundedRectangleOptions {
  count?: number;
  radius?: number;
  width?: number;
  height?: number;
  offset?: [number, number, number];
}

export function createRoundedRectangle(options: RoundedRectangleOptions = {}): number[] {
  const { count = 256, radius = 0.075, width = 1, height = 1, offset = [0, 0, 0] } = options;
  const points: number[] = [];
  const shift = { x: -radius, y: -radius };
  let first = { x: 0, y: 0, z: 0 };

  for (let i = 0; i < count; i++) {
    // Step the arc centre out to each corner as we pass the quarter marks.
    if (i === (count / 4) * 1) shift.x -= width - 2 * radius;
    if (i === (count / 4) * 2) shift.y -= height - 2 * radius;
    if (i === (count / 4) * 3) shift.x += width - 2 * radius;

    const angle = (i / count) * Math.PI * 2;
    const x = Math.cos(angle) * radius + shift.x + 0.5 * width + offset[0];
    const y = Math.sin(angle) * radius + shift.y + 0.5 * height + offset[1];
    const z = offset[2];

    points.push(x, y, z);
    if (i === 0) first = { x, y, z };
  }
  points.push(first.x, first.y, first.z);
  return points;
}

export interface RoundedTriangleOptions {
  cornerRadius?: number;
  cornerResolution?: number;
  width?: number;
  height?: number;
  offset?: [number, number, number];
}

/** The Scale brand triangle, as a rounded outline. */
export function createRoundedTriangle(options: RoundedTriangleOptions = {}): number[] {
  const { cornerRadius: r = 0.1, cornerResolution: res = 7, width = 1, height = 1, offset = [0, 0, 0] } = options;
  const points: number[] = [];
  const p = { x: 0, y: 0, z: 0 };
  let first = { ...p };

  p.y -= 0.175 * height;
  p.x -= 0.175 * width;
  p.x += 0.5 * width;
  p.y -= 0.5 * height - r;

  // bottom-right corner: sweep 135°
  let c = { ...p };
  c.x -= r;
  for (let i = 0; i < res; i++) {
    const a = (i / (res - 1)) * Math.PI * 0.75 - 0.75 * Math.PI;
    p.x = Math.cos(a) * r + c.x + offset[0];
    p.y = Math.sin(a) * r + c.y + offset[1];
    points.push(p.x, p.y, p.z);
    if (i === 0) first = { ...p };
  }

  p.y += 0.5 * height - r;
  points.push(p.x, p.y, p.z);
  p.y += 0.5 * height - r;

  // top corner: sweep 90°
  c = { ...p };
  c.x -= r;
  for (let i = 0; i < res; i++) {
    const a = (i / (res - 1)) * Math.PI * 0.5;
    p.x = Math.cos(a) * r + c.x + offset[0];
    p.y = Math.sin(a) * r + c.y + offset[1];
    points.push(p.x, p.y, p.z);
  }

  p.x -= 0.5 * width - r;
  points.push(p.x, p.y, p.z);
  p.x -= 0.5 * width - r;

  // bottom-left corner: sweep 135°
  c = { ...p };
  c.y -= r;
  for (let i = 0; i < res; i++) {
    const a = (i / (res - 1)) * Math.PI * 0.75 + Math.PI * 0.5;
    p.x = Math.cos(a) * r + c.x + offset[0];
    p.y = Math.sin(a) * r + c.y + offset[1];
    points.push(p.x, p.y, p.z);
  }

  points.push(first.x, first.y, first.z);
  return points;
}

export interface HeroCurve {
  position: number[];
}

/**
 * The authored curve network is a data blob in scale.com's bundle that is not
 * recoverable from minified code, so it is regenerated here with matching
 * structure: `CURVE_COUNT` cubic paths of `CURVE_RESOLUTION` points each,
 * fanning out from the centre and terminating where a card is drawn.
 *
 * Ordering matters — the shaders group `id < 8.5` as the first reveal wave.
 */
export const CURVE_COUNT = 18;
export const CURVE_RESOLUTION = 64;

export function createHeroCurves(): HeroCurve[] {
  const curves: HeroCurve[] = [];
  // Deterministic pseudo-random so SSR and client agree and reloads are stable.
  let seed = 0x2f6f2b1;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };

  for (let i = 0; i < CURVE_COUNT; i++) {
    const leading = i < 9;
    // Leading curves sit tighter to the centre and land nearer the middle band.
    const angle = (i / CURVE_COUNT) * Math.PI * 2 + rand() * 0.35;
    const reach = (leading ? 0.42 : 0.72) + rand() * 0.28;

    const x0 = (rand() * 2 - 1) * 0.06;
    const y0 = (rand() * 2 - 1) * 0.04;
    const x3 = Math.cos(angle) * reach * 1.55;
    const y3 = Math.sin(angle) * reach * 0.82;

    // Control points bow the path outward, matching the site's swept look.
    const bow = (leading ? 0.34 : 0.52) * (rand() * 0.6 + 0.7);
    const x1 = x0 + (x3 - x0) * 0.28 - Math.sin(angle) * bow;
    const y1 = y0 + (y3 - y0) * 0.28 + Math.cos(angle) * bow;
    const x2 = x0 + (x3 - x0) * 0.72 - Math.sin(angle) * bow * 0.45;
    const y2 = y0 + (y3 - y0) * 0.72 + Math.cos(angle) * bow * 0.45;

    const position: number[] = [];
    for (let s = 0; s < CURVE_RESOLUTION; s++) {
      const t = s / (CURVE_RESOLUTION - 1);
      const it = 1 - t;
      const b0 = it * it * it, b1 = 3 * it * it * t, b2 = 3 * it * t * t, b3 = t * t * t;
      position.push(
        b0 * x0 + b1 * x1 + b2 * x2 + b3 * x3,
        b0 * y0 + b1 * y1 + b2 * y2 + b3 * y3,
        0,
      );
    }
    curves.push({ position });
  }
  return curves;
}
