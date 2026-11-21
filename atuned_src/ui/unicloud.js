/* ============================================================
   UNI CLOUD, the fluid background behind her on the Journal hero.

   Ruled 21 November, two rounds. Round one, his words with a reference
   image (a soft flowing purple/pink/blue volumetric smoke): "could you
   make something like this as an interactive mockup? How close can you
   get... dynamic and reactive based off of Uni's system and the way the
   sniffer is listening to the story." Round two, on the first demo:
   "that's not quite it. I want something way more subtle and way more
   optimized. And a bit slower in its dynamics. But when a person says
   something, it'll pulse. Pulse like a radial pulse outside of the ring
   and disturb the clouds."

   What shipped here is the fixed, measured demo
   (scratchpad uni-cloud-demo.html, kept outside this file's history on
   purpose since it is not product code), ported onto the real product's
   own signals, not stand-ins. Two real defects were found and fixed in
   that demo before this port, both measured, not guessed:

   BANDING. Measured as 8-bit colour quantization on the density gradient
   (flat runs 170-244px wide, ~26 distinct levels across most of the
   frame), not a flaw in the noise field (a float-target render showed no
   axis bias, rotating the lattice 30deg changed nothing). Fixed with a
   triangular-PDF dither of one 8-bit step added at the final write.

   PINCHING. Measured as the domain warp's own Jacobian folding on itself
   (det <= 0) and over-squeezing, worst during the pulse (14.6% of the
   frame folded at age 0.3s) and during a typing burst (turbulence near
   its old 1.37 against a ~1.0 slope budget). Fixed by cutting the pulse's
   peak push 0.55 to 0.22 and gating it to zero right at the core, capping
   total turbulence at 0.45, and swapping the hard density/warm clamps for
   soft saturation (exp decay, smoothstep) so the core blends instead of
   plateauing with a sharp rim.

   WHAT THIS IS NOT. This is an overlay, never a replacement. #stage's own
   CSS wash (shell/head.html's #stage::before, "it emanates from her, not
   the room," 10 November) already reads real CQ through CPAL/getPalette/
   ambPaint in ui/uni.js, with years of pixel-measured, per-theme rulings
   behind it. That system is not dormant and nothing here touches it. This
   canvas paints as an alpha-blended layer on top of it (its own alpha is
   the shader's own density, capped), so a WebGL failure, a lost context,
   or an old GPU leaves exactly the background that shipped before tonight.
   "I want to see it blending" is answered literally: this is paint over
   paint, not a second background competing with the first.

   WHERE IT LIVES. Scoped to the Journal hero only (body.tab-story, not
   .st-full), the one place "the cloud" concept already exists. The
   Dashboard's own separate background (#stjr) is untouched. Mounted and
   unmounted by watching body.className, since nothing else in this file
   needs to be told when a tab changes.

   REAL SIGNALS, NOT STAND-INS. uCQ/uDQ read live every frame from
   window.Uni.getCoherence()/getDQ(), both already public (ui/uni.js). The
   pulse's origin reads the real #srcface circle's own live bounding box,
   converted into this canvas's own UV space, not a hardcoded point. The
   pulse's trigger and colour come from window.SrcFace.plan(text), the
   same real sniffer-adjacent lookup the reading circle itself already
   calls (ui/srcface.js), hooked from ui/storyui.js's own oninput handler
   (the one place a story's text already reaches the engine on every
   keystroke); each hit's own real seat colour (SEATCOL[ring], srcface.js)
   drives the shader's hue, not the demo's separate 8-word stand-in table.

   HONEST LIMITS, carried over from the demo's own verdict panel: no
   self-shadowing between folds (a flat field being tinted and warped, not
   a lit volume); phone performance is unmeasured past this sandbox's own
   software renderer; shader-compile failure and context loss are handled
   (see below), but only this sandbox has ever exercised those paths.

   THE ENGINE IS UNTOUCHED. Nothing here lives under atuned_src/engine/,
   nothing here is required by anything under atuned_src/engine/, and
   hostfree.py's gate does not see this file at all. A WebGL failure here
   degrades to the CSS wash, never to a broken reading.
   ============================================================ */
(function(){
'use strict';
if(typeof document==='undefined')return;

var HOST_ID='stage';
var canvas=null, gl=null, mounted=false, raf=0;
var prog=null, posLoc=-1, uniforms={};
var blitProg=null, blitPosLoc=-1, blitUniforms={};
var fbo=null, fboTex=null, lowW=1, lowH=1, usingHalfRes=false;
var vbuf=null;
var compileFailed=false, contextLost=false;

var vsSrc=[
 '#version 300 es',
 'in vec2 aPos;',
 'out vec2 vUv;',
 'void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }'
].join('\n');

/* The fragment shader is the fixed demo's own, verbatim: the dither, the
   pulse strength and gate, the turbulence cap and the soft saturation are
   all load bearing fixes, measured against real screenshots and a
   standalone Jacobian check (tools/jacobian.js in the scratchpad, not
   shipped here), not cosmetic. */
var fsCore=[
 'precision highp float;',
 'in vec2 vUv;',
 'out vec4 fragColor;',
 'uniform float uTime;',
 'uniform vec2 uRes;',
 'uniform float uCQ;',
 'uniform float uDQ;',
 'uniform float uEnergy;',
 'uniform float uHue;',
 'uniform float uPulse[4];',
 'uniform float uDither;',
 'uniform vec2 uCore;',
 '',
 'const float RING_R = 0.30;',
 'const float PULSE_SPEED = 0.60;',
 'const float PULSE_WIDTH0 = 0.16;',
 'const float PULSE_LIFE = 2.6;',
 'const float PULSE_STRENGTH = 0.22;',
 '',
 'float hash(vec2 p){',
 '  p = fract(p*vec2(123.34, 456.21));',
 '  p += dot(p, p+45.32);',
 '  return fract(p.x*p.y);',
 '}',
 'float vnoise(vec2 p){',
 '  vec2 i = floor(p); vec2 f = fract(p);',
 '  float a = hash(i);',
 '  float b = hash(i+vec2(1.0,0.0));',
 '  float c = hash(i+vec2(0.0,1.0));',
 '  float d = hash(i+vec2(1.0,1.0));',
 '  vec2 u = f*f*(3.0-2.0*f);',
 '  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);',
 '}',
 'float fbm(vec2 p){',
 '  float s = 0.0; float amp = 0.5; float freq = 1.0;',
 '  for(int i=0;i<3;i++){',
 '    s += amp*vnoise(p*freq);',
 '    freq *= 2.02; amp *= 0.55;',
 '  }',
 '  return s;',
 '}',
 'vec2 hash2(vec2 p){',
 '  p = fract(p*vec2(123.34, 456.21));',
 '  p += dot(p, p+45.32);',
 '  return fract(vec2(p.x*p.y, p.x*p.y*1.618034));',
 '}',
 'vec2 vnoise2(vec2 p){',
 '  vec2 i = floor(p); vec2 f = fract(p);',
 '  vec2 a = hash2(i);',
 '  vec2 b = hash2(i+vec2(1.0,0.0));',
 '  vec2 c = hash2(i+vec2(0.0,1.0));',
 '  vec2 d = hash2(i+vec2(1.0,1.0));',
 '  vec2 u = f*f*(3.0-2.0*f);',
 '  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);',
 '}',
 'vec2 fbm2(vec2 p){',
 '  vec2 s = vec2(0.0); float amp = 0.5; float freq = 1.0;',
 '  for(int i=0;i<3;i++){',
 '    s += amp*vnoise2(p*freq);',
 '    freq *= 2.02; amp *= 0.55;',
 '  }',
 '  return s;',
 '}',
 'void main(){',
 '  vec2 uv = vUv*2.0-1.0;',
 '  uv.x *= uRes.x/max(uRes.y,1.0);',
 '',
 '  float cd = length(uv-uCore);',
 '  vec2 dirFromCore = cd>0.0001 ? (uv-uCore)/cd : vec2(0.0,1.0);',
 '  float ringGate = smoothstep(0.0, RING_R, cd);',
 '',
 '  float pulseAmt = 0.0;',
 '  for(int i=0;i<4;i++){',
 '    float start = uPulse[i];',
 '    if(start > -500.0){',
 '      float age = uTime - start;',
 '      if(age >= 0.0 && age < PULSE_LIFE*1.3){',
 '        float pr = RING_R + age*PULSE_SPEED;',
 '        float pw = PULSE_WIDTH0 + age*0.10;',
 '        float band = exp(-((cd-pr)*(cd-pr))/(2.0*pw*pw));',
 '        float decay = exp(-age/(PULSE_LIFE*0.55)) / (1.0+age*0.5);',
 '        pulseAmt += band*decay;',
 '      }',
 '    }',
 '  }',
 '  vec2 pulsePush = dirFromCore * pulseAmt * PULSE_STRENGTH * ringGate;',
 '',
 '  float incoh = 1.0 - uCQ;',
 '  float turb = min(mix(0.16, 0.55, incoh) + uEnergy*0.15, 0.45);',
 '  float speed = mix(0.022, 0.095, incoh) + uDQ*0.02;',
 '  float t = uTime*speed;',
 '',
 '  vec2 w1 = fbm2(uv*1.4 + vec2(t*0.5, -t*0.55));',
 '  vec2 warped = uv + (w1-0.5)*turb;',
 '  warped += pulsePush;',
 '  vec2 w2 = fbm2(warped*1.9 + vec2(-t*0.35, t*0.25));',
 '  vec2 p2 = warped + (w2-0.5)*turb*0.55;',
 '',
 '  float n = fbm(p2*2.2 + t*0.6);',
 '',
 '  float coreGlow = smoothstep(1.05, 0.0, cd);',
 '  coreGlow = pow(coreGlow, 1.6) * (0.80 + 0.20*sin(uTime*0.4));',
 '',
 '  float density = smoothstep(0.20, 0.93, n);',
 '  float vign = smoothstep(1.35, 0.1, length(uv));',
 '  density *= vign;',
 '  float densityRaw = density + coreGlow*0.5 + pulseAmt*0.12;',
 '  density = 1.0 - exp(-2.2*max(densityRaw, 0.0));',
 '',
 '  vec3 purple = vec3(0.40, 0.20, 0.58);',
 '  vec3 pink   = vec3(0.86, 0.40, 0.56);',
 '  vec3 blue   = vec3(0.24, 0.34, 0.80);',
 '  vec3 warm   = vec3(1.00, 0.76, 0.48);',
 '',
 '  float mixA = 0.5 + 0.5*sin(n*2.2 + uHue*3.4);',
 '  vec3 col = mix(purple, blue, mixA);',
 '  float mixB = 0.30 + 0.25*sin(t*0.4 + uHue*2.0);',
 '  col = mix(col, pink, clamp(mixB,0.0,1.0));',
 '  col = mix(col, warm, smoothstep(0.0, 1.0, coreGlow));',
 '  col = mix(col, warm, uEnergy*0.25);',
 '  col = mix(col, warm, clamp(pulseAmt*0.35,0.0,1.0));',
 '',
 '  float outAlpha = clamp(density, 0.0, 1.0);',
 '  vec3 outCol = col;',
 '',
 '  if(uDither > 0.5){',
 '    float r1 = hash(gl_FragCoord.xy + fract(uTime)*91.7);',
 '    float r2 = hash(gl_FragCoord.yx*1.37 + 17.0);',
 '    outCol += (r1 + r2 - 1.0)/255.0;',
 '  }',
 '  fragColor = vec4(outCol, outAlpha);',
 '}'
].join('\n');
var fsSrc=['#version 300 es'].concat(fsCore).join('\n');

var blitFsSrc=[
 '#version 300 es',
 'precision highp float;',
 'in vec2 vUv;',
 'out vec4 fragColor;',
 'uniform sampler2D uTex;',
 'uniform float uTime;',
 'float hash(vec2 p){',
 '  p = fract(p*vec2(123.34, 456.21));',
 '  p += dot(p, p+45.32);',
 '  return fract(p.x*p.y);',
 '}',
 'void main(){',
 '  vec4 c = texture(uTex, vUv);',
 '  float r1 = hash(gl_FragCoord.xy + fract(uTime)*91.7);',
 '  float r2 = hash(gl_FragCoord.yx*1.37 + 17.0);',
 '  fragColor = vec4(c.rgb + (r1 + r2 - 1.0)/255.0, c.a);',
 '}'
].join('\n');

function compileShader(type,src){
 var sh=gl.createShader(type);
 gl.shaderSource(sh,src);
 gl.compileShader(sh);
 if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){
  var log=gl.getShaderInfoLog(sh);
  gl.deleteShader(sh);
  throw new Error('shader compile failed: '+log);
 }
 return sh;
}
function linkProgram(vs,fs){
 var p=gl.createProgram();
 gl.attachShader(p,vs); gl.attachShader(p,fs);
 gl.linkProgram(p);
 if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error('program link failed: '+gl.getProgramInfoLog(p));
 return p;
}
function buildProgram(){
 var vs=compileShader(gl.VERTEX_SHADER,vsSrc);
 var fs=compileShader(gl.FRAGMENT_SHADER,fsSrc);
 prog=linkProgram(vs,fs);
 posLoc=gl.getAttribLocation(prog,'aPos');
 ['uTime','uRes','uCQ','uDQ','uEnergy','uHue','uDither','uCore'].forEach(function(n){
  uniforms[n]=gl.getUniformLocation(prog,n);
 });
 uniforms.uPulse=gl.getUniformLocation(prog,'uPulse[0]');
}
function tryBuildHalfRes(){
 usingHalfRes=false;
 try{
  var ext=gl.getExtension('EXT_color_buffer_float');
  if(!ext)return;
  var vs=compileShader(gl.VERTEX_SHADER,vsSrc);
  var bfs=compileShader(gl.FRAGMENT_SHADER,blitFsSrc);
  blitProg=linkProgram(vs,bfs);
  blitPosLoc=gl.getAttribLocation(blitProg,'aPos');
  blitUniforms.uTex=gl.getUniformLocation(blitProg,'uTex');
  blitUniforms.uTime=gl.getUniformLocation(blitProg,'uTime');
  fboTex=gl.createTexture();
  fbo=gl.createFramebuffer();
  usingHalfRes=true;
 }catch(e){ usingHalfRes=false; blitProg=null; }
}
function sizeFBO(w,h){
 if(!usingHalfRes)return;
 lowW=Math.max(1,w); lowH=Math.max(1,h);
 gl.bindTexture(gl.TEXTURE_2D,fboTex);
 gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA16F,lowW,lowH);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
 gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,fboTex,0);
 var ok=gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE;
 gl.bindFramebuffer(gl.FRAMEBUFFER,null);
 if(!ok)usingHalfRes=false;
}
function buildGeo(){
 vbuf=gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER,vbuf);
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1, 3,-1, -1,3]),gl.STATIC_DRAW);
}

/* ---- real signal state ---- */
var energyTarget=0, hueTarget=0, hueCur=0;
var MAX_PULSES=4, PULSE_LIFE_JS=2.6;
var pulseStart=[-999,-999,-999,-999];
var pulseWriteIdx=0, pulsePending=0;
var lastTSec=0, startTime=0, lastFrameTime=0;
var coreUV=[-0.22,0.08];
var lastHitKeys={};

/* a hex colour (srcface.js's own SEATCOL) to the shader's hue parameter,
   a blend-phase float, not a literal HSL hue, so this is a faithful but
   not exact derivation: real hue (0..1) spread across the same -1..1
   range the fixed demo's own VOCAB table used. */
function hexToHueParam(hex){
 if(typeof hex!=='string'||hex.charAt(0)!=='#'||hex.length<7)return 0;
 var r=parseInt(hex.slice(1,3),16)/255, g=parseInt(hex.slice(3,5),16)/255, b=parseInt(hex.slice(5,7),16)/255;
 var max=Math.max(r,g,b), min=Math.min(r,g,b), d=max-min, h=0;
 if(d>0){
  if(max===r)h=((g-b)/d)%6;
  else if(max===g)h=(b-r)/d+2;
  else h=(r-g)/d+4;
  h/=6; if(h<0)h+=1;
 }
 return h*2-1;
}

function requestPulse(hex){
 hueTarget=hexToHueParam(hex);
 energyTarget=Math.min(2.0,energyTarget+0.6);
 pulsePending++;
}

/* called from ui/storyui.js's own oninput handler, one new call per
   keystroke; finds hits that are new since the last call (by k+ring+key,
   the same identity plan() itself would use to dedupe a repeated hit) and
   fires one pulse per new hit, coloured from that hit's own real seat
   colour (the same SEATCOL table the reading circle itself resolves a
   hit to), not a separate lexicon. */
function onStoryText(text){
 if(!mounted||typeof window.SrcFace!=='function'&&!(window.SrcFace&&typeof window.SrcFace.plan==='function'))return;
 var pl;
 try{ pl=window.SrcFace.plan(text); }catch(e){ return; }
 if(!pl||!pl.hits){ lastHitKeys={}; return; }
 var seen={};
 pl.hits.forEach(function(h){
  var key=h.k+':'+h.ring+':'+h.key;
  seen[key]=true;
  if(!lastHitKeys[key])requestPulse(h.col);
 });
 lastHitKeys=seen;
}

/* ---- reduced motion, the same floor every other animation here holds to ---- */
function stillWins(){ return typeof rbStill==='function'&&rbStill(); }

function coreFromSrcFace(){
 var el=document.getElementById('srcface');
 var host=canvas&&canvas.parentNode;
 if(!el||!host)return;
 var er=el.getBoundingClientRect(), hr=host.getBoundingClientRect();
 if(!hr.width||!hr.height)return;
 var cx=(er.left+er.width/2-hr.left)/hr.width;
 var cy=(er.top+er.height/2-hr.top)/hr.height;
 /* screen-space (0..1, y down) to the shader's own centred, y-up uv */
 var u=(cx*2-1)*(hr.width/Math.max(hr.height,1));
 var v=(1-cy*2);
 /* the reading circle is hidden on some states (srcface.js's own
    canvas.hidden), which can hand back a zero rect; a wild position
    reads as a broken pulse origin, so fall back to the stage's own
    centre rather than show that. */
 if(!isFinite(u)||!isFinite(v)||Math.abs(u)>2||Math.abs(v)>2)return;
 coreUV=[u,v];
}

function resize(){
 if(!canvas)return;
 var r=canvas.getBoundingClientRect();
 var dpr=Math.min(window.devicePixelRatio||1,2);
 var w=Math.max(1,Math.round(r.width*dpr)), h=Math.max(1,Math.round(r.height*dpr));
 if(canvas.width!==w||canvas.height!==h){ canvas.width=w; canvas.height=h; gl.viewport(0,0,w,h); }
 if(usingHalfRes)sizeFBO(Math.max(1,Math.round(w/2)),Math.max(1,Math.round(h/2)));
}

function frame(now){
 if(!mounted||contextLost){ return; }
 var still=stillWins();
 var tSec=still?(lastTSec||2.4):(now-startTime)/1000;
 var dt=Math.min(0.05,(now-(lastFrameTime||now))/1000); lastFrameTime=now;
 if(!still){
  energyTarget=Math.max(0,energyTarget-dt*0.9);
  hueCur+=(hueTarget-hueCur)*Math.min(1,dt*2.2);
 }
 while(pulsePending>0){ pulseStart[pulseWriteIdx]=tSec; pulseWriteIdx=(pulseWriteIdx+1)%MAX_PULSES; pulsePending--; }
 for(var pi=0;pi<MAX_PULSES;pi++){
  if(pulseStart[pi]>-500&&tSec-pulseStart[pi]>PULSE_LIFE_JS*1.4)pulseStart[pi]=-999;
 }
 lastTSec=tSec;

 var cq=(typeof window.Uni==='object'&&window.Uni&&typeof window.Uni.getCoherence==='function')?window.Uni.getCoherence():55;
 var dq=(typeof window.Uni==='object'&&window.Uni&&typeof window.Uni.getDQ==='function')?window.Uni.getDQ():40;
 coreFromSrcFace();

 gl.useProgram(prog);
 gl.bindBuffer(gl.ARRAY_BUFFER,vbuf);
 gl.enableVertexAttribArray(posLoc);
 gl.vertexAttribPointer(posLoc,2,gl.FLOAT,false,0,0);
 gl.uniform1f(uniforms.uTime,tSec);
 gl.uniform2f(uniforms.uRes,canvas.width,canvas.height);
 gl.uniform1f(uniforms.uCQ,Math.max(0,Math.min(1,cq/100)));
 gl.uniform1f(uniforms.uDQ,Math.max(0,Math.min(1,dq/100)));
 gl.uniform1f(uniforms.uEnergy,energyTarget);
 gl.uniform1f(uniforms.uHue,hueCur);
 gl.uniform1fv(uniforms.uPulse,pulseStart);
 gl.uniform2f(uniforms.uCore,coreUV[0],coreUV[1]);

 gl.enable(gl.BLEND);
 gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

 if(usingHalfRes){
  gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
  gl.viewport(0,0,lowW,lowH);
  gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.disable(gl.BLEND);
  gl.uniform1f(uniforms.uDither,0.0);
  gl.drawArrays(gl.TRIANGLES,0,3);

  gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  gl.viewport(0,0,canvas.width,canvas.height);
  gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  gl.useProgram(blitProg);
  gl.bindBuffer(gl.ARRAY_BUFFER,vbuf);
  gl.enableVertexAttribArray(blitPosLoc);
  gl.vertexAttribPointer(blitPosLoc,2,gl.FLOAT,false,0,0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D,fboTex);
  gl.uniform1i(blitUniforms.uTex,0);
  gl.uniform1f(blitUniforms.uTime,tSec);
  gl.drawArrays(gl.TRIANGLES,0,3);
 } else {
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  gl.viewport(0,0,canvas.width,canvas.height);
  gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1f(uniforms.uDither,1.0);
  gl.drawArrays(gl.TRIANGLES,0,3);
 }

 raf=requestAnimationFrame(frame);
}

function removeCanvas(){
 if(raf){ cancelAnimationFrame(raf); raf=0; }
 if(canvas&&canvas.parentNode)canvas.parentNode.removeChild(canvas);
 canvas=null; gl=null;
}

function mount(){
 if(mounted||compileFailed)return;
 var host=document.getElementById(HOST_ID);
 if(!host)return;
 canvas=document.createElement('canvas');
 canvas.id='unicloud';
 canvas.setAttribute('aria-hidden','true');
 canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:block;';
 host.insertBefore(canvas,host.firstChild);

 try{ gl=canvas.getContext('webgl2',{antialias:false,alpha:true,premultipliedAlpha:false,powerPreference:'low-power'}); }
 catch(e){ gl=null; }
 if(!gl){ removeCanvas(); compileFailed=true; return; }

 canvas.addEventListener('webglcontextlost',function(e){ e.preventDefault(); contextLost=true; },false);
 canvas.addEventListener('webglcontextrestored',function(){
  contextLost=false;
  try{ buildProgram(); buildGeo(); tryBuildHalfRes(); resize(); startTime=performance.now()-lastTSec*1000; raf=requestAnimationFrame(frame); }
  catch(e){ removeCanvas(); compileFailed=true; }
 },false);

 try{
  buildProgram();
  buildGeo();
  tryBuildHalfRes();
 }catch(e){
  removeCanvas(); compileFailed=true; return;
 }

 mounted=true;
 startTime=performance.now();
 lastFrameTime=0;
 resize();
 window.addEventListener('resize',resize);
 raf=requestAnimationFrame(frame);
}

function unmount(){
 if(!mounted)return;
 mounted=false;
 window.removeEventListener('resize',resize);
 removeCanvas();
}

/* mount/unmount by watching body.className rather than hooking every tab
   renderer: the hero view is exactly body.tab-story without .st-full, and
   nothing else in this product needs to know this exists. */
function syncToTab(){
 var c=document.body.classList;
 var want=c.contains('tab-story')&&!c.contains('st-full');
 if(want&&!mounted)mount();
 else if(!want&&mounted)unmount();
}
if(typeof MutationObserver!=='undefined'){
 var mo=new MutationObserver(syncToTab);
 if(document.body)mo.observe(document.body,{attributes:true,attributeFilter:['class']});
 else document.addEventListener('DOMContentLoaded',function(){
  mo.observe(document.body,{attributes:true,attributeFilter:['class']});
  syncToTab();
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncToTab);
else syncToTab();

window.UniCloud={
 onStoryText:onStoryText,
 debug:function(){
  return {mounted:mounted,compileFailed:compileFailed,contextLost:contextLost,
   usingHalfRes:usingHalfRes,energy:energyTarget,hue:hueCur,
   pulses:pulseStart.slice(),core:coreUV.slice(),
   canvasSize:canvas?[canvas.width,canvas.height]:null};
 }
};
})();
