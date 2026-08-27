import * as THREE from "three";
import {
  CARD_FRAG, CARD_VERT, CONNECTOR_FRAG, CONNECTOR_VERT, CURVE_FRAG, CURVE_VERT,
  PANEL_FRAG, PANEL_VERT, PARTICLE_FRAG, PARTICLE_VERT, TRAVELLER_FRAG, TRAVELLER_VERT,
} from "./shaders";
import { CURVE_COUNT, CURVE_RESOLUTION, createHeroCurves, createRoundedRectangle, createRoundedTriangle } from "./geometry";

export interface HeroScene {
  group: THREE.Group;
  uniforms: {
    uTime: { value: number };
    uDelta: { value: number };
    uResolution: { value: THREE.Vector2 };
    uDPR: { value: number };
  };
  progress: { value: number };
  alpha: { value: number };
  videoTexture: THREE.VideoTexture;
  dispose: () => void;
}

/** Expand a flat point list into LineSegments pairs. */
function toSegments(points: number[]): number[] {
  const out: number[] = [];
  for (let i = 0; i < points.length / 3 - 1; i++) {
    out.push(points[i * 3], points[i * 3 + 1], points[i * 3 + 2]);
    out.push(points[(i + 1) * 3], points[(i + 1) * 3 + 1], points[(i + 1) * 3 + 2]);
  }
  return out;
}

const MINI_PARTICLE_COUNT = 32;
const CONNECTOR_POINTS = 224;

export function buildHeroScene(video: HTMLVideoElement, logoUrl: string): HeroScene {
  const uniforms = {
    uTime: { value: 0 },
    uDelta: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uDPR: { value: 1 },
  };
  const progress = { value: 0 };
  const alpha = { value: 1 };
  const disposables: { dispose: () => void }[] = [];

  const group = new THREE.Group();

  const material = (vertexShader: string, fragmentShader: string, extra: Record<string, { value: unknown }> = {}, opts: THREE.ShaderMaterialParameters = {}) => {
    const m = new THREE.ShaderMaterial({
      uniforms: { ...uniforms, uProgress: progress, ...extra },
      vertexShader,
      fragmentShader,
      glslVersion: THREE.GLSL3, // required: shaders use texelFetch/textureSize
      transparent: true,
      ...opts,
    });
    disposables.push(m);
    return m;
  };

  /* ── curve network ─────────────────────────────────────────────────── */
  const curves = createHeroCurves();

  const curvePos: number[] = [];
  const curveU: number[] = [];
  const curveId: number[] = [];
  curves.forEach((curve, index) => {
    const { position } = curve;
    const segments = position.length / 3 - 1;
    for (let i = 0; i < segments; i++) {
      curvePos.push(position[i * 3], position[i * 3 + 1], position[i * 3 + 2]);
      curvePos.push(position[i * 3 + 3], position[i * 3 + 4], position[i * 3 + 5]);
      curveU.push(i / segments, (i + 1) / segments);
      curveId.push(index, index);
    }
  });

  const curveGeo = new THREE.BufferGeometry();
  curveGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(curvePos), 3));
  curveGeo.setAttribute("curveu", new THREE.BufferAttribute(new Float32Array(curveU), 1));
  curveGeo.setAttribute("id", new THREE.BufferAttribute(new Float32Array(curveId), 1));
  disposables.push(curveGeo);
  group.add(new THREE.LineSegments(curveGeo, material(CURVE_VERT, CURVE_FRAG)));

  /* ── curve data texture (drives the travelling triangles) ──────────── */
  const curveData = new Float32Array(CURVE_RESOLUTION * CURVE_COUNT * 4);
  curves.forEach((curve, index) => {
    const { position } = curve;
    const base = index * CURVE_RESOLUTION * 4;
    for (let i = 0; i < CURVE_RESOLUTION; i++) {
      curveData[base + i * 4 + 0] = position[i * 3 + 0];
      curveData[base + i * 4 + 1] = position[i * 3 + 1];
      curveData[base + i * 4 + 2] = position[i * 3 + 2];
      curveData[base + i * 4 + 3] = 1;
    }
  });
  const curveTexture = new THREE.DataTexture(curveData, CURVE_RESOLUTION, CURVE_COUNT, THREE.RGBAFormat, THREE.FloatType);
  curveTexture.minFilter = THREE.NearestFilter;
  curveTexture.magFilter = THREE.NearestFilter;
  curveTexture.needsUpdate = true;
  disposables.push(curveTexture);

  /* ── card outlines at each curve terminus ──────────────────────────── */
  const termini: number[] = [];
  curves.forEach(({ position }) => {
    termini.push(position[position.length - 3], position[position.length - 2], position[position.length - 1]);
  });

  const rect = createRoundedRectangle({ width: 1.77 });
  const rectSegs = toSegments(rect);
  const cardPos: number[] = [];
  const cardOffset: number[] = [];
  const cardId: number[] = [];
  for (let i = 0; i < termini.length / 3; i++) {
    const [tx, ty, tz] = [termini[i * 3], termini[i * 3 + 1], termini[i * 3 + 2]];
    for (let s = 0; s < rectSegs.length; s += 3) {
      cardPos.push(rectSegs[s], rectSegs[s + 1], rectSegs[s + 2]);
      cardOffset.push(tx, ty, tz);
      cardId.push(i);
    }
  }
  const cardGeo = new THREE.BufferGeometry();
  cardGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(cardPos), 3));
  cardGeo.setAttribute("offset", new THREE.BufferAttribute(new Float32Array(cardOffset), 3));
  cardGeo.setAttribute("id", new THREE.BufferAttribute(new Float32Array(cardId), 1));
  disposables.push(cardGeo);
  group.add(new THREE.LineSegments(cardGeo, material(CARD_VERT, CARD_FRAG, { uAlpha: alpha })));

  /* ── triangles travelling along the curves ─────────────────────────── */
  const tri = createRoundedTriangle();
  const triSegs = toSegments(tri);
  const travPos: number[] = [];
  const travOffset: number[] = [];
  const travId: number[] = [];
  for (let i = 0; i < CURVE_COUNT; i++) {
    for (let s = 0; s < triSegs.length; s += 3) {
      travPos.push(triSegs[s], triSegs[s + 1], triSegs[s + 2]);
      travOffset.push(0, 0, 0);
      travId.push(i);
    }
  }
  const travGeo = new THREE.BufferGeometry();
  travGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(travPos), 3));
  travGeo.setAttribute("offset", new THREE.BufferAttribute(new Float32Array(travOffset), 3));
  travGeo.setAttribute("id", new THREE.BufferAttribute(new Float32Array(travId), 1));
  disposables.push(travGeo);
  group.add(new THREE.LineSegments(travGeo, material(TRAVELLER_VERT, TRAVELLER_FRAG, { tCurves: { value: curveTexture } })));

  /* ── free-floating mini triangles + their connector lines ──────────── */
  const miniPositions = new Float32Array(MINI_PARTICLE_COUNT * 4);
  const partPos: number[] = [];
  const partOffset: number[] = [];
  const partId: number[] = [];
  for (let i = 0; i < MINI_PARTICLE_COUNT; i++) {
    const ox = (2 * Math.random() - 1) * 0.2655;
    const oy = (2 * Math.random() - 1) * 0.15;
    miniPositions[i * 4 + 0] = ox;
    miniPositions[i * 4 + 1] = oy;
    miniPositions[i * 4 + 2] = 0;
    miniPositions[i * 4 + 3] = 1;
    for (let s = 0; s < triSegs.length; s += 3) {
      partPos.push(triSegs[s], triSegs[s + 1], triSegs[s + 2]);
      partOffset.push(ox, oy, 0);
      partId.push(i);
    }
  }
  const partGeo = new THREE.BufferGeometry();
  partGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(partPos), 3));
  partGeo.setAttribute("offset", new THREE.BufferAttribute(new Float32Array(partOffset), 3));
  partGeo.setAttribute("id", new THREE.BufferAttribute(new Float32Array(partId), 1));
  disposables.push(partGeo);
  group.add(new THREE.LineSegments(partGeo, material(PARTICLE_VERT, PARTICLE_FRAG)));

  const miniTexture = new THREE.DataTexture(miniPositions, MINI_PARTICLE_COUNT, 1, THREE.RGBAFormat, THREE.FloatType);
  miniTexture.minFilter = THREE.NearestFilter;
  miniTexture.magFilter = THREE.NearestFilter;
  miniTexture.needsUpdate = true;
  disposables.push(miniTexture);

  const connPos: number[] = [];
  const connU: number[] = [];
  for (let i = 0; i < CONNECTOR_POINTS; i++) {
    connPos.push(0, 0, 0);
    connU.push(i / (CONNECTOR_POINTS - 1));
  }
  const connGeo = new THREE.BufferGeometry();
  connGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(connPos), 3));
  connGeo.setAttribute("curveu", new THREE.BufferAttribute(new Float32Array(connU), 1));
  disposables.push(connGeo);
  group.add(new THREE.Line(connGeo, material(CONNECTOR_VERT, CONNECTOR_FRAG, { tPoints: { value: miniTexture } })));

  /* ── central video panel ───────────────────────────────────────────── */
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.colorSpace = THREE.SRGBColorSpace;
  disposables.push(videoTexture);

  const logoTexture = new THREE.TextureLoader().load(logoUrl);
  logoTexture.wrapS = THREE.ClampToEdgeWrapping;
  logoTexture.wrapT = THREE.ClampToEdgeWrapping;
  disposables.push(logoTexture);

  const panelGeo = new THREE.PlaneGeometry(1, 1, 1, 1);
  disposables.push(panelGeo);
  group.add(new THREE.Mesh(panelGeo, material(
    PANEL_VERT, PANEL_FRAG,
    {
      tMap: { value: videoTexture },
      tLogo: { value: logoTexture },
      uAlpha: alpha,
      // Populated region of Packed.mp4, measured from the decoded frame:
      // the clip fills the bottom-left 80% x 80% of the 1920x1080 canvas.
      uMapScale: { value: new THREE.Vector2(0.8, 0.8) },
      uMapOffset: { value: new THREE.Vector2(0.0, 0.0) },
    },
    { depthTest: false, blending: THREE.NormalBlending },
  )));

  return {
    group,
    uniforms,
    progress,
    alpha,
    videoTexture,
    dispose: () => disposables.forEach((d) => d.dispose()),
  };
}
