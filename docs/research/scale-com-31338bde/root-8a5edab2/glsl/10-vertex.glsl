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

uniform sampler2D tCurves;
uniform float uProgress;

varying float vMask;
varying float vProgress;

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
    vec3 offset = mix(prevpos, nextpos, blend);

    float pscale = 0.03;
    pscale *= smoothstep(0.01, 0.05, vProgress);
    pscale *= smoothstep(0.99, 0.95, vProgress);
    pscale *= smoothstep(0.0, -0.025, vProgress - progress);
    pscale *= smoothstep(0.1, 0.75, uProgress);

    pos *= pscale;
    pos += offset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    float isMobile = uResolution.x < 768.0 ? 1.0 : 0.0;
    gl_Position.xyz *= mix(1.0, 0.75, isMobile);
}
",fragmentShader:"uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;
uniform float uDPR;
/** 1 when home hero pull-apart is in band layout (max-width 3xl); set from 