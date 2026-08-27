 â boost Y there. */
float homeHeroPhoneFinalPosY(float transition2, float isMobile) {
  float isPhone = homeHeroIsPhone(uResolution);
  float isTablet = homeHeroIsTablet(uResolution);
  float yReach = isTablet > 0.5 ? 1.0 : isMobile;
  return mix(1.0, 1.95, transition2) * yReach
    + uHomeHeroPhoneSceneY * isPhone
    + uHomeHeroTabletSceneY * isTablet;
}

/** World-space band scale (phone/tablet shrink + tablet product scale). */
void homeHeroScaleBandWorldPos(inout vec3 wp, float transition2, float isMobile, float verticalAspect) {
  float isTablet = homeHeroIsTablet(uResolution);
  float mobilePad = 0.25;
  float t = mix(transition2, 0.0, isMobile);
  wp *= mix(1.0, 0.9, t);
  wp = mix(wp, wp / (verticalAspect + mobilePad), isMobile);
  wp *= mix(1.0, uHomeHeroTabletSceneScale, isTablet * transition2);
}
attribute vec3 offset;
attribute float id;

uniform float uProgress;

mat2 rotate2d(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, s, -s, c);
}

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float cubicInOut(float t) {
    return t < 0.5
        ? 4.0 * t * t * t
        : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

void main() { 
    float scale = 0.05;
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

    pos *= cubicInOut(smoothstep(0.5, 1.0, progress));

    pos += offset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    float isMobile = uResolution.x < 768.0 ? 1.0 : 0.0;
    gl_Position.xyz *= mix(1.0, 0.9, isMobile);
}
",fragmentShader:"uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;
uniform float uDPR;
/** 1 when home hero pull-apart is in band layout (max-width 3xl); set from 