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
"})),h.add(S),h.add(x),h.add(g),h.add(v),h.add(b),h.add(w),h.add(y),t.add(h),(P=u.default.timeline({paused:!0})).fromTo(h.rotation,{y:0,x:0},{y:.6,x:.5,duration:.7,ease:"cubic.inOut",onUpdate:()=>{let e=P?P.progress():0;e>=.15&&e<=.35?a.getState().setSectionVisible(0,!0):a.getState().setSectionVisible(0,!1),e>=.65&&e<=1?a.getState().setSectionVisible(1,!0):a.getState().setSectionVisible(1,!1)}},.2),P.fromTo(h.scale,{x:1.75,y:1.75,z:1.75},{x:.275,y:.275,z:.275,duration:.9,ease:"cubic.inOut"},0),P.to(T,{value:1,duration:.8,ease:"linear"},.2),P.fromTo(h.position,{y:0},{y:.165,duration:.3,ease:"cubic.inOut"},.7),P.set({},{},1),P.progress(.01),C={x:.5*window.innerWidth,y:.5*window.innerHeight},(H=new m.default(e.camera,null,{width:window.innerWidth,height:window.innerHeight})).strength.v=.25,t.add(H.group)},onMouseMove(e,{x:t,y:n}){C.x=t*window.innerWidth,C.y=(1-n)*window.innerHeight},onDestroy(){P&&(P.kill(),P=null),R.miniParticlePosition?.dispose(),R.curves?.dispose(),R.video?.dispose(),R.logo?.dispose(),R={miniParticlePosition:null,curves:null,video:null,logo:null},k&&(k.remove(),k=null),h=null,x=null,g=null,v=null,b=null,w=null,y=null,j={value:1},T={value:0},N=null,M=null},onTick(e,{animatedScrollY:t}){if(!P)return;let n=Math.min(1,Math.max(0,t/Math.max(1,4.5*window.innerHeight)));P.progress(n),H&&H.loop(C,e.camera)},onScroll(e,{scrollY:t,documentScrollHeight:n}){},onResize(e,{width:t,height:n}){H&&(H.windowSize.width=window.innerWidth,H.windowSize.height=window.innerHeight)}});var A=e.i(42184),E=e.i(496642);e.s(["default",0,function({textItems:e}){let r=(0,n.useRef)(null),l=(0,n.useRef)(null),a=(0,n.useRef)(null),{setSectionTheme:o}=(0,E.usePageTheme)();return(0,A.useTimelineScroll)(l,{start:"top top",end:()=>