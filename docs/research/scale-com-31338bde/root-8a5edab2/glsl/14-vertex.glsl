),children:(0,t.jsx)("svg",{width:"6",height:"6",viewBox:"0 0 6 6",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:"inline-block w-full h-full align-top","aria-hidden":!0,children:(0,t.jsx)("path",{d:"M5.0957 0H0.376033C0.041944 0 -0.125369 0.403928 0.110868 0.640165L4.83054 5.35983C5.06677 5.59607 5.4707 5.42876 5.4707 5.09467V0.375C5.4707 0.167893 5.30281 0 5.0957 0Z",fill:"currentColor"})})})]}),s?.length?(0,t.jsx)("div",{className:"text-scale-gray-60 body3",children:(0,t.jsx)(u.default,{animatedTextRef:x,value:s,customAnimation:d.fadeWordReveal})}):null]})});e.s(["default",0,function({heading:e,video:u,cards:c,className:d}){let p=(0,r.useRef)(null),h=(0,r.useRef)(null),x=(0,r.useRef)([]),{setSectionTheme:g}=(0,o.usePageTheme)(),v=(0,r.useRef)(null),b=(0,r.useRef)(null);return(0,r.useEffect)(()=>{g(p.current,"dark"),i.default.set(v.current,{opacity:0}),b?.current?.reset()},[]),(0,r.useEffect)(()=>{x.current=x.current.slice(0,c.length)},[c.length]),(0,s.useGSAP)(()=>{if(!h.current||!p.current)return;let e=c?.length??0;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){i.default.set(h.current,{width:"100%"}),(()=>{if(!e)return;let t=1/e;x.current.forEach((e,n)=>{let r=i.default.utils.clamp(0,1,(1-n*t)/t);e?.seek?.(r)})})();return}let t=i.default.fromTo(h.current,{scale:.98,transformOrigin:"center top"},{scale:1,duration:1.15,ease:"power3.out",scrollTrigger:{trigger:p.current,start:"top bottom",end:"bottom 75%",scrub:!0}});return()=>{t.scrollTrigger?.kill(),t.kill()}},{scope:p,dependencies:[c?.length]}),(0,f.useSliceScroll)(p,{start:"top center",onEnter:()=>{i.default.to(v.current,{opacity:1,duration:1}),b?.current?.reset(),b?.current?.play()},onLeaveBack:()=>{i.default.to(v.current,{opacity:0,duration:1}),b?.current?.pause(),x.current.forEach((e,t)=>{e.animateOut({delay:.1*t})})}}),(0,t.jsx)("section",{ref:p,className:(0,n.default)("SgpStack relative isolate overflow-hidden bg-black grid-layout-mobile lg:grid-layout-desktop pt-0 lg:px-0! pb-7!",d),children:(0,t.jsxs)("div",{className:"relative col-span-full lg:col-start-1 lg:col-span-12 text-neutral-900 py-5 pb-7 md:pb-0 md:py-10 md:pl-10 md:pr-10 lg:pb-10",children:[(0,t.jsxs)("div",{className:"grid-layout-mobile lg:grid-layout-desktop-double md:px-0 md:pb-10",children:[e?(0,t.jsx)("div",{className:"col-span-full pb-0 relative z-2 lg:col-start-1 lg:col-span-12 xl:col-start-1 xl:col-span-7 lg:self-start [&_.HeadlineWithCta]:text-inherit",children:(0,t.jsx)(l.default,{padding:!1,...e,width:"w-full",align:"left",headerClass:"text-white header3-regular balance-text md:mt-[-0.5rem]",subtitleClasses:"text-scale-gray-60",className:"py-0!"})}):null,u?.videoMov?.asset?.url||u?.videoWebm?.asset?.url?(0,t.jsx)("div",{ref:v,className:"pointer-events-none col-span-full lg:absolute z-10 lg:left-[45%] lg:-translate-x-1/2 lg:w-1/2 lg:h-full flex items-center justify-center pb-10","aria-hidden":"true",children:(0,t.jsx)(a.default,{ref:b,video:u,className:"w-full"})}):null,c?.length?(0,t.jsx)("div",{className:"col-span-full relative z-2 flex flex-col oml:flex-row gap-2 lg:col-start-18 lg:col-span-7 lg:self-start",children:c.map((e,n)=>(0,t.jsx)(m,{card:e,ref:e=>x.current[n]=e},e._key))}):null]}),(0,t.jsx)("div",{ref:h,className:"absolute z-1 w-full h-full inset-0 grid-layout-mobile lg:grid-layout-desktop-double p-0",children:(0,t.jsx)("div",{className:"w-full h-full bg-scale-gray-10 rounded-2xl col-span-full lg:col-span-24"})})]})})}],565242)},597205,e=>{"use strict";let t;var n=e.i(843476),r=e.i(207670),l=e.i(271645),a=e.i(989970),o=e.i(365747),i=e.i(883495);let s=new Map;Promise.create=function(){let e=null,t=null,n=new Promise((n,r)=>{e=n,t=r});return n.resolve=e,n.reject=t,n};class u{file=null;manifest=null;data=null;decoder=null;frame=null;desideredFrame=0;enabled=!0;framesByTimestamp=new Map;frameProcessed=null;_rangeRafId=null;_rangePlaying=!1;constructor(e,{process:t=()=>{},logIndex:n=!1,hardwareAcceleration:r="prefer-hardware"}){this.loading=Promise.create(),this.process=t,this.lastTween=null,this.isTransitioning=!1,this.hardwareAcceleration=r,this.logIndex=n,this.file=e,this.init()}async init(){s.set(this.file,this.loadBinary(this.file));let{manifest:e,data:t}=await s.get(this.file);this.manifest=e,this.data=t,this.manifest.frames.forEach(e=>{e.data=new Uint8Array(this.data,e.o,e.l),this.framesByTimestamp.set(e.t,e.i)}),await this.initDecoder(),this.loading.resolve()}static h264CheckPromise=null;static async isH264Supported(){try{return this.h264CheckPromise||(this.h264CheckPromise=VideoDecoder.isConfigSupported({codec:"avc1.42c033"})),(await this.h264CheckPromise).supported}catch(e){return console.error("H264 not supported",e),!1}}static h265CheckPromise=null;static async isH265Supported(){try{return this.h265CheckPromise||(this.h265CheckPromise=VideoDecoder.isConfigSupported({codec:"hvc1.1.6.L93.90"})),(await this.h265CheckPromise).supported}catch(e){return console.error("H265 not supported",e),!1}}async loadBinary(e){let t=await fetch(e),n=await t.arrayBuffer(),r=new DataView(n,n.byteLength-4).getUint32(0,!0),l=new Uint8Array(n,r,n.byteLength-4-r);return{manifest:JSON.parse(new TextDecoder().decode(l)),data:n}}decodeDescription(e){let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return n}async initDecoder(){this.decoderReady=!1;let e={codec:this.manifest.codec,codedWidth:this.manifest.width,codedHeight:this.manifest.height,colorSpace:{primaries:"bt709",transfer:"bt709",matrix:"bt709",fullRange:!1},description:this.decodeDescription(this.manifest.description)},t=[{...e,hardwareAcceleration:this.hardwareAcceleration,optimizeForLatency:!0},{...e,hardwareAcceleration:this.hardwareAcceleration},{...e,optimizeForLatency:!0},{...e}];for(let e of(this.config=null,t))if((await VideoDecoder.isConfigSupported(e)).supported){this.config=e;break}if(!this.config)throw Error("Decoder not supported");this.decoder=new VideoDecoder({output:this.outputFrame.bind(this),error:e=>{console.error("Decoder error:",e)}}),this.decoder.configure(this.config),this.decoderReady=!0}async outputFrame(e){if(!this.enabled)return void e.close();let t=this.framesByTimestamp.get(e.timestamp);if(this.desideredFrame!==t)return void e.close();if(this.frame=t,this.process){let n=null;this.logIndex&&(n=this.manifest.frames.findIndex(e=>e.i===t)),await this.process(e,n)}this.frameProcessed=t,e.close()}setFrame(e){if(!this.manifest||!this.enabled||!this.decoderReady)return;e=Math.round(Number(e));let t=Math.max(0,this.manifest.totalFrames-1);if(e=Math.min(Math.max(e,0),t),this.desideredFrame=e,this.desideredFrame===this.frame||this.desideredFrame===this._pendingFrame)return;this._pendingFrame=e;let n=this.manifest.frames[this.desideredFrame];if(n){if(this.decoder.decodeQueueSize>0||"configured"!==this.decoder.state)if("closed"===this.decoder.state)return void this.initDecoder();else this.decoder.configure(this.config);if(null!==this.frame&&this.desideredFrame===this.frame+1&&"delta"===n.ty)return void this.decoder.decode(new EncodedVideoChunk({type:n.ty,timestamp:n.t,data:n.data}));if("key"===n.ty)this.decoder.decode(new EncodedVideoChunk({type:n.ty,timestamp:n.t,data:n.data}));else{let e=null;for(let t=this.desideredFrame;t>=0;t--){let n=this.manifest.frames[t];if("key"===n.ty){e=n;break}}if(!e||!e.data)return void console.error("No key frame found");this.decoder.decode(new EncodedVideoChunk({type:e.ty,timestamp:e.t,data:e.data}));for(let t=e.i+1;t<=this.desideredFrame;t++){let e=this.manifest.frames[t];if("delta"===e.ty)this.decoder.decode(new EncodedVideoChunk({type:e.ty,timestamp:e.t,data:e.data}));else break}}}}stop(){this._rangePlaying=!1,null!=this._rangeRafId&&(cancelAnimationFrame(this._rangeRafId),this._rangeRafId=null)}cancelPlayback(){this.stop(),this.lastTween?.kill&&(this.lastTween.kill(),this.lastTween=null),this.isTransitioning=!1}timestampToFrameIndex(e){let[t,n]=e.split(":").map(Number);return t*(this.manifest.fps||30)+n}playRangeTime(e,t,n={}){if(!this.manifest||!this.enabled)return;let r=this.timestampToFrameIndex(e),l=this.timestampToFrameIndex(t);return n?.isTransitioningBackwards&&!n?.noBackwardsTransition&&([r,l]=[l,r]),this.playRange(r,l,n)}frameToTime(e){return this.manifest.frames[e].t}getFrameRange(e,t){if(this.manifest&&this.enabled)return{from:this.timestampToFrameIndex(e),to:this.timestampToFrameIndex(t)}}playRange(e,t,n={}){if(!this.manifest||!this.enabled)return;this.isTransitioning=!0;let r=Math.abs(t-e)/(this.manifest.fps||30)*(n?.durationMultiplier??1);return this.lastTween?.kill(),this.lastTween=a.default.fromTo(this,{frame:e},{frame:t,duration:r,ease:n?.ease?n.ease:"none",repeat:n?.loop?-1:0,delay:n?.delay??0,onRepeat:()=>{n?.onRepeat?.()},onComplete:()=>{this.isTransitioning=!1,n?.onComplete?.()},onUpdate:()=>{this.setFrame(this.frame)}}),this.lastTween}loopRange(e,t,n={}){this.playRange(e,t,{...n,loop:!0})}destroy(){s.delete(this.file),this.stop(),this.decoder.close(),this.decoder=null,this.data=null,this.manifest=null,this.file=null,this.process=null,this.frameProcessed=null,this.enabled=!1,this.framesByTimestamp.clear()}}a.default.registerPlugin(i.ScrollTrigger);var c=e.i(232217),d=e.i(447711),f=e.i(309313),m=e.i(141149);Object.freeze({h4:"leading-none"});let p=(0,l.forwardRef)(function({title:e,description:t,current:o=0,total:i=0},s){let u=(0,l.useRef)(null),c=(0,l.useRef)(null),m=(0,l.useRef)(null);return(0,l.useImperativeHandle)(s,()=>({animateIn(){u.current?.animateIn?.(),c.current?.animateIn?.({delay:.2}),a.default.fromTo(m.current,{opacity:0},{opacity:1,duration:.5,ease:"power2.out"})},animateOut(){u.current?.animateOut?.(),c.current?.animateOut?.({delay:.2}),a.default.fromTo(m.current,{opacity:1},{opacity:0,duration:.5,ease:"power2.out"})}}),[]),(0,n.jsx)("div",{className:"absolute top-0 left-0 flex flex-col justify-end w-full h-full gap-16 p-8 pb-32 xl:justify-center xl:p-16",children:(0,n.jsxs)("div",{className:"flex flex-col gap-4 xl:gap-6",children:[(0,n.jsxs)("div",{className:"flex items-center gap-2",children:[(0,n.jsx)("div",{ref:m,className:(0,r.default)("triangle opacity-0",{1:"text-archive-purple",2:"text-foundry-tan",3:"text-evergreen",4:"text-cloud-slate"}[Math.min(o,i)]),children:(0,n.jsx)("svg",{width:12,height:12,viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":!0,children:(0,n.jsx)("path",{d:"M10.6884 0H0.652204C0.0720246 0 -0.218065 0.700892 0.192105 1.11106L10.2283 11.1473C10.6385 11.5575 11.3394 11.2667 11.3394 10.6872V0.650964C11.3394 0.291354 11.048 0 10.6884 0Z",fill:"currentColor"})})}),(0,n.jsx)(d.default,{ref:u,tagName:"p",className:"leading-none detail-mono text-scale-gray-30",children:e})]}),(0,n.jsx)(f.default,{animatedTextClassName:"leading-none",blockClassNames:{h4:"leading-9"},value:t,animatedTextRef:c})]})})});var h=e.i(457274);let x=(0,e.i(768834).create)((t=e=>({introScrollProgress:0,setIntroScrollProgress:t=>e({introScrollProgress:t}),resetIntroScrollProgress:()=>e({introScrollProgress:0}),videoCrossfade:0,activeStepIndex:null,setActiveStepIndex:t=>e({activeStepIndex:t}),setVideoCrossfade:t=>e({videoCrossfade:Math.min(1,Math.max(0,t))})}),(e,n,r)=>{let l=r.subscribe;return r.subscribe=(e,t,n)=>{let a=e;if(t){let l=(null==n?void 0:n.equalityFn)||Object.is,o=e(r.getState());a=n=>{let r=e(n);if(!l(o,r)){let e=o;t(o=r,e)}},(null==n?void 0:n.fireImmediately)&&t(o,o)}return l(a)},t(e)})),g="precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
",v="_steppedVideoQuad",b="_steppedVideoFrameSinkRef",w="_steppedVideoPlayStoreUnsub",y=(0,h.createScene)({setup(e,t){let n,{scene:r,THREE:l,controls:a}=e;a.enabled=!1;let o=new l.OrthographicCamera(-1,1,1,-1,.1,10);o.position.set(0,0,5),o.lookAt(0,0,0),e.camera=o;let i=((n=new l.Texture).generateMipmaps=!1,n),s=new l.RawShaderMaterial({vertexShader:g,fragmentShader:"precision highp float;

uniform sampler2D uMap;
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
  vec2 uv = vUv;
  vec2 offset = vec2(0.5);
  vec2 scale = vec2(1.0);
  vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
  vec4 ca = textureContain(uMap, uMeshSize, textureSizeA, uv, offset, scale, color);
  vec4 base = ca;
  fragColor = vec4(ca.rgb, 1.0);
}
",glslVersion:l.GLSL3,transparent:!0,uniforms:{uMap:{value:i},uCrossfade:{value:0},uMeshSize:{value:new l.Vector2(2,2)},uScale:{value:new l.Vector2(.8,.8)},uOffset:{value:new l.Vector2(1,.5)}}}),u=new l.PlaneGeometry(2,2),c=new l.Mesh(u,s);c.position.set(0,0,0),r.add(c),r.userData[v]=c;let d=t?.frameSinkRef;d&&(d.current=t=>{t&&(i.image=t,i.needsUpdate=!0,e.renderer.initTexture(i))},r.userData[b]=d)},onTick(){},onResize(e,{width:t,height:n}){var r;let l,a=e.scene.userData[v];if(!a||!e.camera.isOrthographicCamera)return;r=e.camera,r.left=-(l=t/Math.max(n,1)),r.right=l,r.top=1,r.bottom=-1,r.updateProjectionMatrix();let o=t/Math.max(n,1);a.material.uniforms.uMeshSize.value.set(o,1),a.scale.set(o,1,1)},onDestroy(e){let t=e.scene.userData[w];"function"==typeof t&&t(),delete e.scene.userData[w];let n=e.scene.userData[b];n&&(n.current=null,delete e.scene.userData[b]);let r=e.scene.userData[v];if(!r)return;let l=r.material.uniforms?.uMap?.value;l&&l.dispose(),r.geometry.dispose(),r.material.dispose(),e.scene.remove(r),delete e.scene.userData[v],delete e.scene.userData._steppedVideoPlayProgress}});var S=e.i(42184),k=e.i(519235);function j({className:e,frameSinkRef:t,frameSinkRefB:l,frameSinkRefMask:a,scene:o}){return(0,n.jsx)(k.ThreeCanvas,{className:(0,r.default)("relative h-full w-full",e),scene:o,frameSinkRef:t,frameSinkRefB:l,frameSinkRefMask:a})}class T{constructor({edges:e,start:t="00:00",end:n="15:03"}){this.edges=e,this.currentTween=null,this.scrubTimelineEdge=null,this.activeStepIndex=null,this.lastFrame=0,this._lastProgress=0,this.debounceId=null,this.resizeDebounceMs=500,this.isresizing=!1,this.start=t,this.end=n,this.previousEdgeActual=null,this.applyDebounceMs=1500,this.timeSinceLastApply=0,this.isQuickUpdate=!1}lookup(e,t){return e===t?null:this.edges[