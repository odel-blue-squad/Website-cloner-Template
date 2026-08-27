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

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float cubicInOut(float t) {
    return t < 0.5
        ? 4.0 * t * t * t
        : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
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
",transparent:!0,depthTest:!1,blending:B}));let D=[],$=[],Y=[],V=(0,f.createRoundedTriangle)();for(let e=0;e<32;e++){let e=(2*Math.random()-1)*.2655,t=(2*Math.random()-1)*.15;D.push(e,t,0,1);for(let n=0;n<V.length/3-1;n++){let r=V[3*n+0],l=V[3*n+1],a=V[3*n+2],o=V[(n+1)*3+0],i=V[(n+1)*3+1],s=V[(n+1)*3+2];$.push(r,l,a,o,i,s),Y.push(e,t,0,e,t,0)}}let W=new o,U=new k(new Float32Array($),3),q=new k(new Float32Array(Y),3),G=new k(new Float32Array([]),1);W.setAttribute("position",U),W.setAttribute("offset",q),W.setAttribute("id",G),R.miniParticlePosition=new F(new Float32Array(D,3),32,1,I,A,E,z,z,L,L),R.miniParticlePosition.needsUpdate=!0,v=new c(W,new p({uniforms:{...r,uProgress:T},transparent:!0,vertexShader:"uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;
uniform float uDPR;
/** 1 when home hero pull-apart is in band layout (max-width 3xl); set from 