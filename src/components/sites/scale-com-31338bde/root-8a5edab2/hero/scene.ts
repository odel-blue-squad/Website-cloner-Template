import * as THREE from "three";
import { BACKPLANE_FRAG, CONTOUR_FRAG, PANEL_FRAG, PANEL_VERT } from "./shaders";

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
  /** Call every frame after updating `progress` — drives layer separation. */
  update: () => void;
  dispose: () => void;
}

/**
 * The pull-apart stack: a video panel that opens full-bleed, then splits into
 * three planes as the group shrinks and rotates — a white contour-line plane
 * in front (drawn from the mask strip baked into Packed.mp4) and a translucent
 * annotation plane behind. Separation and per-layer opacity are driven from
 * scroll progress; the group transform itself is animated by the GSAP timeline
 * recovered from scale.com's bundle.
 */
export function buildHeroScene(
  video: HTMLVideoElement,
  logoUrl: string,
  numbersUrl: string,
): HeroScene {
  const uniforms = {
    uTime: { value: 0 },
    uDelta: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uDPR: { value: 1 },
  };
  const progress = { value: 0 };
  const alpha = { value: 1 };
  const dim = { value: 0.45 };
  const contourAlpha = { value: 0 };
  const backAlpha = { value: 0 };
  const disposables: { dispose: () => void }[] = [];

  const group = new THREE.Group();
  const loader = new THREE.TextureLoader();

  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.colorSpace = THREE.SRGBColorSpace;
  disposables.push(videoTexture);

  const logoTexture = loader.load(logoUrl);
  const numbersTexture = loader.load(numbersUrl);
  disposables.push(logoTexture, numbersTexture);

  const material = (fragmentShader: string, extra: Record<string, { value: unknown }>) => {
    const m = new THREE.ShaderMaterial({
      uniforms: { ...uniforms, uProgress: progress, ...extra },
      vertexShader: PANEL_VERT,
      fragmentShader,
      glslVersion: THREE.GLSL3,
      transparent: true,
      depthTest: false,
    });
    disposables.push(m);
    return m;
  };

  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  disposables.push(geometry);

  /* back annotation plane — drifts right and away as the stack opens */
  const backPlane = new THREE.Mesh(geometry, material(BACKPLANE_FRAG, {
    tNumbers: { value: numbersTexture },
    uAlpha: backAlpha,
  }));
  backPlane.renderOrder = 0;
  group.add(backPlane);

  /* video panel — the anchor layer */
  const videoPlane = new THREE.Mesh(geometry, material(PANEL_FRAG, {
    tMap: { value: videoTexture },
    tLogo: { value: logoTexture },
    uAlpha: alpha,
    uDim: dim,
    // Populated region of the packed atlas (bottom-left 80% x 80%).
    uMapScale: { value: new THREE.Vector2(0.8, 0.8) },
    uMapOffset: { value: new THREE.Vector2(0.0, 0.0) },
  }));
  videoPlane.renderOrder = 1;
  group.add(videoPlane);

  /* front contour plane — drifts left and toward the camera */
  const contourPlane = new THREE.Mesh(geometry, material(CONTOUR_FRAG, {
    tMap: { value: videoTexture },
    uAlpha: contourAlpha,
  }));
  contourPlane.renderOrder = 2;
  contourPlane.scale.setScalar(1.06);
  group.add(contourPlane);

  const smoothstep = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  const update = () => {
    const p = progress.value;
    // Layers coincide while full-bleed, then separate as the shrink begins.
    const sep = smoothstep(0.08, 0.4, p);
    contourPlane.position.set(-0.055 * sep, 0.025 * sep, 0.09 * sep);
    backPlane.position.set(0.06 * sep, -0.015 * sep, -0.09 * sep);
    contourAlpha.value = sep;
    backAlpha.value = sep;
    // Headline scrim releases as soon as the panel starts moving.
    dim.value = 0.45 * (1 - smoothstep(0.04, 0.16, p));
  };
  update();

  return {
    group,
    uniforms,
    progress,
    alpha,
    videoTexture,
    update,
    dispose: () => disposables.forEach((d) => d.dispose()),
  };
}
