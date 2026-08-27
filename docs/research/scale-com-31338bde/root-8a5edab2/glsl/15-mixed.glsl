})]}),(0,n.jsx)(d.default,{ref:s,tagName:"h2",className:"leading-none header3-regular",children:e}),(0,n.jsx)(f.default,{value:t,animatedTextRef:u,className:"h-fit text-sm text-[#C7C7C7] oml:max-w-1/2"})]})})});var I=e.i(496642),A=e.i(731727),E=e.i(255667);function z({variant:e,onClick:t,className:l,disabled:a}){let o="previous"===e;return(0,n.jsx)("button",{disabled:a,type:"button",className:(0,r.default)("arrow-control-button bg-[#212121] w-10 h-10 rounded-lg cursor-pointer flex items-center justify-center ",a&&"cursor-default!",a&&"opacity-50!",l),onClick:t,"aria-label":o?"Previous step":"Next step",children:o?(0,n.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"9",height:"16",viewBox:"0 0 9 16",fill:"none","aria-hidden":!0,children:(0,n.jsx)("path",{d:"M7.26381 15.7054C7.48251 15.9241 7.83708 15.9241 8.05577 15.7054L8.7134 15.0478C8.93209 14.8291 8.93209 14.4745 8.7134 14.2558L3.2585 8.80094C2.78011 8.32255 2.78011 7.54692 3.2585 7.06853L8.71339 1.61363C8.93209 1.39494 8.93209 1.04036 8.7134 0.82167L8.05577 0.164046C7.83708 -0.0546478 7.48251 -0.0546474 7.26381 0.164046L0.359331 7.06853C-0.119061 7.54692 -0.119061 8.32255 0.359331 8.80094L7.26381 15.7054Z",fill:"white"})}):(0,n.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"9",height:"16",viewBox:"0 0 9 16",fill:"none","aria-hidden":!0,children:(0,n.jsx)("path",{d:"M1.61314 15.7054C1.39445 15.9241 1.03988 15.9241 0.821182 15.7054L0.163558 15.0478C-0.055136 14.8291 -0.0551357 14.4745 0.163558 14.2558L5.61846 8.80094C6.09685 8.32255 6.09685 7.54692 5.61846 7.06853L0.163558 1.61363C-0.0551354 1.39494 -0.0551357 1.04036 0.163558 0.82167L0.821182 0.164046C1.03988 -0.0546478 1.39445 -0.0546474 1.61314 0.164046L8.51762 7.06853C8.99601 7.54692 8.99601 8.32255 8.51762 8.80094L1.61314 15.7054Z",fill:"white"})})})}let L="_steppedVideoQuad",O="_steppedVideoFrameSinkRef",F="_steppedVideoFrameSinkRefB",_="_steppedVideoPlayStoreUnsub",B="_sgpStepOffsetTween";function D(){return window.innerWidth<=768}let $=(0,h.createScene)({setup(e,t){let{scene:n,THREE:r,controls:l}=e;l.enabled=!1;let o=new r.OrthographicCamera(-1,1,1,-1,.1,10);o.position.set(0,0,5),o.lookAt(0,0,0),e.camera=o;let i=()=>{let e=new r.Texture;return e.generateMipmaps=!1,e},s=i(),u=i(),c=i(),d=new r.RawShaderMaterial({vertexShader:g,fragmentShader:"precision highp float;

uniform sampler2D uMap;
uniform sampler2D uMapB;
uniform sampler2D uMapMask;
uniform float uCrossfade;
uniform vec2 uMeshSize;
uniform vec2 uScale;
uniform vec2 uOffset;

in vec2 vUv;

out vec4 fragColor;

vec2 scaleUV(vec2 uv, vec2 scale, vec2 origin) {
    vec2 st = uv - origin;
    st /= scale;
    return st + origin;
}

vec2 textureContainUv(vec2 meshSize, vec2 textureSize, vec2 uv, vec2 position, vec2 scale) {
  vec2 s = meshSize;
  vec2 i = textureSize;

  float rs = s.x / s.y;
  float ri = i.x / i.y;

  vec2 new = rs > ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);

  // aditional scale settings
  s = scaleUV( s, scale, vec2( 0.5 ) );

  vec2 duv = uv * s / new;

  vec2 newScale = new / s;
  vec2 offset = vec2(0.0, 0.0);

  // works the same as css background-position, ensuring entire texture is visible when pinned to edges
  offset.x = 0.5 * (position.x * 2.0);
  offset.y = 0.5 * (position.y * 2.0);
  duv -= vec2( (position.x / newScale.x) - offset.x, (position.y / newScale.y) - offset.y );

  return duv;
}

vec4 textureContain(sampler2D tex, vec2 meshSize, vec2 textureSize, vec2 uv, vec2 position, vec2 scale, vec4 color) {
  vec2 duv = textureContainUv(meshSize, textureSize, uv, position, scale);

  // any area outside of the new scaled texture returns a solid color
  if( duv.x < 0.0 || duv.x > 1.0 || duv.y < 0.0 || duv.y > 1.0 ) {
    return color;
  }

  return texture(tex, duv);
}

// overloads

vec4 textureContain(sampler2D tex, vec2 meshSize, vec2 textureSize, vec2 uv, vec2 position, vec2 scale) {
  return textureContain(tex, meshSize, textureSize, uv, position, scale, vec4(0.0));
}

vec4 textureContain(sampler2D tex, vec2 meshSize, vec2 textureSize, vec2 uv, vec2 position) {
  return textureContain(tex, meshSize, textureSize, uv, position, vec2(1.0), vec4(0.0));
}

vec4 textureContain(sampler2D tex, vec2 meshSize, vec2 textureSize, vec2 uv) {
  return textureContain(tex, meshSize, textureSize, uv, vec2(0.5), vec2(1.0), vec4(0.0));
}

vec2 textureContainUv(vec2 meshSize, vec2 textureSize, vec2 uv, vec2 position) {
  return textureContainUv(meshSize, textureSize, uv, position, vec2(1.0));
}

vec2 textureContainUv(vec2 meshSize, vec2 textureSize, vec2 uv) {
  return textureContainUv(meshSize, textureSize, uv, vec2(0.5), vec2(1.0));
}

float aastep(float threshold, float value) {
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
}

float aastep(float threshold, float value, float padding) {
    return smoothstep(threshold - padding, threshold + padding, value);
}

vec2 aastep(vec2 threshold, vec2 value) {
    return vec2(
        aastep(threshold.x, value.x),
        aastep(threshold.y, value.y)
    );
}

float blendScreen(float base, float blend) {
    return 1.0-((1.0-base)*(1.0-blend));
}

vec3 blendScreen(vec3 base, vec3 blend) {
    return vec3(blendScreen(base.r, blend.r), blendScreen(base.g, blend.g), blendScreen(base.b, blend.b));
}

void main() {
  vec2 textureSizeA = vec2(textureSize(uMap, 0));
  vec2 textureSizeB = vec2(textureSize(uMapB, 0));
  vec2 textureSizeMask = vec2(textureSize(uMapMask, 0));
  vec2 uv = vUv;
  vec2 offset = uOffset;
  vec2 scale = uScale;
  vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
  vec4 ca = textureContain(uMap, uMeshSize, textureSizeA, uv, offset, scale, color);
  vec4 cb = textureContain(uMapB, uMeshSize, textureSizeB, uv, offset, scale, color);
  vec4 cm = textureContain(uMapMask, uMeshSize, textureSizeMask, uv, offset, scale, color);
  vec4 base = ca;
  fragColor = vec4(mix(base.rgb, cb.rgb * (1.0 - uCrossfade), cm.r * (1.0 - uCrossfade)), 1.0);
}
",glslVersion:r.GLSL3,transparent:!0,uniforms:{uMap:{value:s},uMapB:{value:u},uMapMask:{value:c},uCrossfade:{value:0},uMeshSize:{value:new r.Vector2(2,2)},uScale:{value:new r.Vector2(.8,.8)},uOffset:{value:new r.Vector2(1,.75)}}}),f=new r.PlaneGeometry(2,2),m=new r.Mesh(f,d);m.position.set(0,0,0),n.add(m),n.userData[L]=m;let p=t?.frameSinkRef;p&&(p.current=t=>{t&&(s.image=t,s.needsUpdate=!0,e.renderer.initTexture(s))},n.userData[O]=p);let h=t?.frameSinkRefB;h&&(h.current=t=>{t&&(u.image=t,u.needsUpdate=!0,e.renderer.initTexture(u))},n.userData[F]=h);let v=t?.frameSinkRefMask;v&&(v.current=t=>{t&&(c.image=t,c.needsUpdate=!0,e.renderer.initTexture(c))},n.userData._steppedVideoFrameSinkRefMask=v);let b=e=>{if(!D())return;m.userData[B]?.kill();let t=[{x:0,y:1},{x:.5,y:.5},{x:1.5,y:.5},{x:.5,y:1.5}][e-1];m.userData[B]=a.default.to(m.material.uniforms.uOffset.value,{duration:.5,ease:"power2.out",...t,overwrite:!0})},w=x.getState();m.material.uniforms.uCrossfade.value=w.videoCrossfade??0,D()&&b(w.activeStepIndex);let y=x.subscribe(e=>e.videoCrossfade,e=>{m.material.uniforms.uCrossfade.value=e??0}),S=x.subscribe(e=>e.activeStepIndex,e=>{b(e)});n.userData[_]=()=>{y(),S(),m.userData[B]?.kill(),delete m.userData[B]}},onTick(){},onResize(e,{width:t,height:n}){var r;let l,o=e.scene.userData[L];if(!o||!e.camera.isOrthographicCamera)return;r=e.camera,r.left=-(l=t/Math.max(n,1)),r.right=l,r.top=1,r.bottom=-1,r.updateProjectionMatrix();let i=t/Math.max(n,1);o.material.uniforms.uMeshSize.value.set(i,1),o.scale.set(i,1,1);let s=window.innerWidth,u=a.default.utils.clamp(.75,1,a.default.utils.mapRange(1024,1728,.75,1,s));s<=768?(o.material.uniforms.uScale.value.set(2,2),o.material.uniforms.uOffset.value.set(.5,.5)):s<=1280?(o.material.uniforms.uScale.value.set(u,u),o.material.uniforms.uOffset.value.set(.5,.5)):(o.material.uniforms.uScale.value.set(u,u),o.material.uniforms.uOffset.value.set(1,0))},onDestroy(e){let t=e.scene.userData[_];"function"==typeof t&&t(),delete e.scene.userData[_];let n=e.scene.userData[O];n&&(n.current=null,delete e.scene.userData[O]);let r=e.scene.userData[F];r&&(r.current=null,delete e.scene.userData[F]);let l=e.scene.userData[L];if(!l)return;let a=l.material.uniforms?.uMap?.value,o=l.material.uniforms?.uMapB?.value,i=l.material.uniforms?.uMapMask?.value;a&&a.dispose(),o&&o.dispose(),i&&i.dispose(),l.geometry.dispose(),l.material.dispose(),e.scene.remove(l),delete e.scene.userData[L],delete e.scene.userData._steppedVideoPlayProgress}});function Y({configFilePath:e,introHeadline:t,introBody:i,steps:s,className:c}){let p=s?.length??0,h=(0,l.useRef)(null),g=(0,l.useRef)(null),v=(0,l.useRef)(null),b=(0,l.useRef)(null),w=(0,l.useRef)(null),y=(0,l.useRef)(null),k=(0,l.useRef)(null),P=(0,l.useRef)(null),R=(0,l.useCallback)(()=>{},[]),M=x(e=>e.activeStepIndex),H=x(e=>e.setActiveStepIndex),L=(0,l.useRef)(!1),O=(0,E.useLenis)(),F=A.default.frameEdges,{markReady:_}=(0,N.useReady)("stepped-video-sgp-intro"),B=(0,l.useRef)(!1),D=(0,l.useRef)(!1),V=async()=>{let e=[g.current,v.current].filter(Boolean);await Promise.all(e.map(e=>e.ready())),await Promise.all(e.map((e,t)=>e.animateIn({delay:.1*t})))},W=async()=>{let e=[g.current,v.current].filter(Boolean);await Promise.all(e.map(e=>e.ready())),await Promise.all(e.map((e,t)=>e.animateOut({delay:.1*t})))},{containerRef:U,pinRef:q,activeFrameInstanceTransitions:G,activeFrameInstanceLoops:X,timelineRef:Q}=function({configFilePath:e,stepCount:t,frameSinkRef:n,frameSinkRefB:r,frameSinkRefMask:i,debugFrameIndex:s=!1,onPlayFrame:c,nestedTimelines:d=[],onScrubProgress:f,onFramesReady:m}){let p=(0,l.useRef)(null),h=(0,l.useRef)(null),x=Math.max(1,t),g=x+1,v=g+1,[b,w]=(0,l.useState)(null),[y,S]=(0,l.useState)(null),[k,j]=(0,l.useState)(null),[T,P]=(0,l.useState)(null),[N,R]=(0,l.useState)("idle"),[M,H]=(0,l.useState)(null),C=(0,l.useRef)(null),I=(0,l.useRef)(f);I.current=f;let A=(0,l.useRef)(m);A.current=m;let E=(0,l.useMemo)(()=>(function(e){if(null==e||"string"!=typeof e)return null;let t=e.trim();return t?t.startsWith("/")?t: