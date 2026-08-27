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

varying float vCurveu;
varying float vRand;
varying float vId;

float cubicInOut(float t) {
    return t < 0.5
        ? 4.0 * t * t * t
        : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

void main() { 
    vec3 color = vec3(1.0);

    // group first n lines so they appear first
    float group1 = vId < 8.5 ? 1.0 : 0.0;
    float group2 = 1.0 - group1;

    float progress = 0.0;

    // mask first group
    progress += (uProgress * 1.5 - vRand * 0.25) * group1;

    // mask second group
    progress += group2 * clamp(uProgress * 3.0 - 1.0 - vRand * 0.5, 0.0, 1.0);
    progress = clamp(progress, 0.0, 1.0);

    progress *= smoothstep(0.1, 0.4, progress);

    // animate in
    if (vCurveu > progress) discard;

    float alpha = 1.0;

    gl_FragColor = vec4(color, alpha); 
}
"}));let eo=[];N.forEach(e=>{let{position:t}=e;eo.push(t[t.length-3],t[t.length-2],t[t.length-1])});let ei=[],es=[],eu=[],ec=(0,d.createRoundedRectangle)({width:1.77});for(let e=0;e<eo.length/3;e++){let t=eo[3*e+0],n=eo[3*e+1],r=eo[3*e+2];for(let l=0;l<ec.length/3-1;l++){let a=ec[3*l+0],o=ec[3*l+1],i=ec[3*l+2],s=ec[(l+1)*3+0],u=ec[(l+1)*3+1],c=ec[(l+1)*3+2];ei.push(a,o,i,s,u,c),es.push(t,n,r,t,n,r);let d=e;eu.push(d,d)}}let ed=new k(new Float32Array(ei),3),ef=new k(new Float32Array(es),3),em=new k(new Float32Array(eu),1),ep=new o;ep.setAttribute("position",ed),ep.setAttribute("offset",ef),ep.setAttribute("id",em),g=new c(ep,new p({uniforms:{...r,uAlpha:j,uProgress:T},vertexShader:"uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;
uniform float uDPR;
/** 1 when home hero pull-apart is in band layout (max-width 3xl); set from 