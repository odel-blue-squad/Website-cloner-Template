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
attribute float curveu;

uniform sampler2D tPoints;
uniform float uProgress;

varying vec3 vColor;

float cubicInOut(float t) {
    return t < 0.5
        ? 4.0 * t * t * t
        : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

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

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    float isMobile = uResolution.x < 768.0 ? 1.0 : 0.0;
    gl_Position.xyz *= mix(1.0, 0.75, isMobile);
}
",fragmentShader:"uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;
uniform float uDPR;
/** 1 when home hero pull-apart is in band layout (max-width 3xl); set from 