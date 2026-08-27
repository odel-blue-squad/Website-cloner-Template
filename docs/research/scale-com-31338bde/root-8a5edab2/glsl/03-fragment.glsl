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
uniform float uProgress;

void main() {
    vec3 color = vec3(1.0, 1.0, 1.0);
    float alpha = 1.0;

    alpha *= smoothstep(0.4, 0.2, uProgress);

    gl_FragColor = vec4(color, alpha);
}
"}));let X=[],Q=[];for(let e=0;e<224;e++)X.push(0,0,0),Q.push(e/223);let Z=new Float32Array(X),K=new Float32Array(Q),J=new k(Z,3),ee=new k(K,1),et=new o;et.setAttribute("position",J),et.setAttribute("curveu",ee),b=new _(et,new p({uniforms:{...r,tPoints:{value:R.miniParticlePosition},uProgress:T},transparent:!0,vertexShader:"uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;
uniform float uDPR;
/** 1 when home hero pull-apart is in band layout (max-width 3xl); set from 