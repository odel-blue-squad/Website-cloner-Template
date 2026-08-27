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
void main() {
    vec3 color = vec3(1.0, 1.0, 1.0);
    float alpha = 1.0;

    gl_FragColor = vec4(color, alpha);
}
"}));let eh=N[0].position.length/3,ex=N.length,eg=new Float32Array(eh*ex*4);N.forEach((e,t)=>{let{position:n}=e;for(let e=0;e<n.length;e++){let r=n[3*e+0],l=n[3*e+1],a=n[3*e+2],o=t*(n.length/3)*4;eg[o+4*e+0]=r,eg[o+4*e+1]=l,eg[o+4*e+2]=a,eg[o+4*e+3]=1}}),R.curves=new F(eg,eh,ex,I,A,E,z,z,O,O),R.curves.needsUpdate=!0;let ev=[],eb=[];for(let e=0;e<eo.length/3;e++)for(let t=0;t<V.length/3-1;t++){let n=V[3*t+0],r=V[3*t+1],l=V[3*t+2],a=V[(t+1)*3+0],o=V[(t+1)*3+1],i=V[(t+1)*3+2];ev.push(n,r,l,a,o,i);let s=e;eb.push(s,s)}let ew=new k(new Float32Array(ev),3),ey=new k(new Float32Array([]),3),eS=new o,ek=new k(new Float32Array(eb),1);eS.setAttribute("position",ew),eS.setAttribute("offset",ey),eS.setAttribute("id",ek),w=new c(eS,new p({uniforms:{...r,tCurves:{value:R.curves},uProgress:T},vertexShader:"uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;
uniform float uDPR;
/** 1 when home hero pull-apart is in band layout (max-width 3xl); set from 