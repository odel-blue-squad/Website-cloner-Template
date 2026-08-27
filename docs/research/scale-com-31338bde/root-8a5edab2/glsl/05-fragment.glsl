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
    vec3 color = vec3(1.0);
    float alpha = 1.0;

    alpha *= smoothstep(0.4, 0.2, uProgress);

    gl_FragColor = vec4(color, alpha);
}
"}));let en=[],er=[],el=[];N.forEach((e,t)=>{let{position:n}=e;for(let e=0;e<(n.length-3)/3;e++){let r=n[3*e+0],l=n[3*e+1],a=n[3*e+2],o=n[3*e+3],i=n[3*e+4],s=n[3*e+5];en.push(r,l,a,o,i,s);let u=e/((n.length-3)/3),c=(e+1)/((n.length-3)/3);er.push(u,c),el.push(t,t)}});let ea=new o;ea.setAttribute("position",new k(new Float32Array(en),3)),ea.setAttribute("curveu",new k(new Float32Array(er),1)),ea.setAttribute("id",new k(new Float32Array(el),1)),x=new c(ea,new p({uniforms:{...r,uProgress:T},transparent:!0,vertexShader:"uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;
uniform float uDPR;
/** 1 when home hero pull-apart is in band layout (max-width 3xl); set from 