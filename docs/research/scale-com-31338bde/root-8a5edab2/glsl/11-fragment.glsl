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
varying float vCurveu;

void main() { 
    vec3 color = vec3(1.0);

    gl_FragColor = vec4(color, 1.0); 
}
"}));let ej=[],eT=[],eP=[];for(let e=0;e<eo.length/3;e++){let t=eo[3*e+0],n=eo[3*e+1],r=eo[3*e+2];for(let l=0;l<V.length/3-1;l++){let a=V[3*l+0],o=V[3*l+1],i=V[3*l+2],s=V[(l+1)*3+0],u=V[(l+1)*3+1],c=V[(l+1)*3+2];ej.push(a,o,i,s,u,c),eT.push(t,n,r,t,n,r);let d=e;eP.push(d,d)}}let eN=new k(new Float32Array(ej),3),eR=new k(new Float32Array(eT),3),eM=new o,eH=new k(new Float32Array(eP),1);eM.setAttribute("position",eN),eM.setAttribute("offset",eR),eM.setAttribute("id",eH),y=new c(eM,new p({uniforms:{...r,uProgress:T},vertexShader:"uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;
uniform float uDPR;
/** 1 when home hero pull-apart is in band layout (max-width 3xl); set from 