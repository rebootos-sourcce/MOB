/* ============================================================
   UNI, as a real build component. Round TE, 8 November, his own words,
   asked directly after her engine bug was fixed earlier tonight: "thing
   for Uni. Review this. With the team. Strategize your plan." A four-pass
   team review found the real, concrete gap: atuned_src/ui/uni/uni-widget.html
   is real and working (her Canvas 2D particle sphere, the external API,
   the CQ/DQ fix shipped this session, b2fc6037) but is not in MANIFEST, so
   nothing in the real app can point at her yet.

   THIS FILE IS THE REPACKAGING, NOT A REWRITE. Her engine code below
   (mouse tracking, blink, the coherence colour system, the particle sphere
   itself, the external window.Uni API) is copied from uni-widget.html
   unchanged, line for line, past the markup injection block. The source
   file's own comment already named this exact technique and already built
   her demo chrome to be "hidden, not removed, so every id the real app
   script binds to still exists and nothing in her real engine code below
   has to change" -- this file follows that design rather than overriding
   it: every id her script looks up still exists, created by this file
   instead of living in a standalone page.

   What is new here, and only here:
   1. UNI_HTML/UNI_STYLE inject the markup and a scoped stylesheet before
      her script runs, instead of a browser parsing a <body> and <style>.
      Every selector is scoped under .uni-widget; the original file's bare
      :root/body/html rules do not travel here; nothing not plainly
      visible (the demo sliders and buttons) was ported, their ids are
      created hidden instead, same effect, far less CSS.
   2. uniMount(target)/uniPark() move one shared instance between screens.
      Her particle count (about 6,250, confirmed by the systems review)
      makes a copy per screen expensive, so one canvas node is built once,
      parked hidden in a detached host when nobody needs her, and
      reparented into whichever screen does.
   3. window.Uni.pause()/resume() were added, mirroring exactly what her
      own canvas's mouseenter listener already did (lastTs=null then
      requestAnimationFrame(frame)) -- the systems review found her loop
      stops for good when hidden and only a mouse moving over her restarts
      it, which freezes her the moment she is reparented away and never
      brought back, so uniMount/uniPark call resume()/pause() the same way
      a hover already did, without needing a hover.

   What is still open, named rather than silently deferred (see TASKS.md,
   round TE): she does not yet respect prefers-reduced-motion; the loading
   screen replacement, the Journal #stsrc mount, the commit reaction and
   the stSrcSpeak callback are the next real stages, not done in this one.
   This stage is stage 1 of the team's plan: nothing on screen changes yet,
   and nothing here needed his ruling first. */
(function(){
'use strict';

var UNI_STYLE =
".uni-widget{display:block}"+
".uni-widget .page{width:auto;max-width:none;padding-block:0;display:block}"+
".uni-widget .page-title,.uni-widget .tabs,.uni-widget .coh-panel,.uni-widget .desc,.uni-widget .speak-panel{display:none!important}"+
".uni-widget .canvas-wrap{position:relative;width:100%;max-width:640px;background:transparent;border:none;border-radius:0;overflow:visible}"+
".uni-widget canvas{display:block;width:100%;aspect-ratio:640/520}"+
".uni-widget [hidden]{display:none!important}"+
/* round TE, caught by tests/design.js, twice: first that every class the
   injected markup carries needs a real rule even on a hidden element, so
   nothing here reads as dead or typo'd elsewhere in the real app; then,
   once these rules existed, that they carried the demo page's own
   decorative choices (10px text, under this project's own 11px floor,
   and text-transform:uppercase, against its "no all-caps UI copy" house
   rule) straight across. The gate does not know these elements are
   hidden and should not have to; it holds every class this file writes
   to the same floor a visible one would meet. So this is NOT faithful to
   uni-widget.html's own demo styling, by design: a minimum, compliant
   rule for each class, never shown, rather than a copy of a decorative
   choice this project already rules against. */
".uni-widget .coh-row{display:flex;justify-content:space-between;align-items:baseline}"+
".uni-widget .coh-label{font-size:11px;font-weight:700;letter-spacing:0.08em}"+
".uni-widget .coh-zone{font-size:11px;font-weight:700;letter-spacing:0.08em}"+
".uni-widget .coh-val{font-size:15px;font-weight:700;font-variant-numeric:tabular-nums;min-width:2.8ch;text-align:right}"+
".uni-widget .quotient-row{font-size:11px;font-weight:600;letter-spacing:0.04em;text-align:center}"+
".uni-widget .demo-row{display:flex;gap:10px}"+
".uni-widget .demo-btn{flex:1;font-family:system-ui,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.04em;cursor:pointer}"+
".uni-widget .speak-area{width:100%;font-family:system-ui,-apple-system,sans-serif;font-size:13px;line-height:1.5;resize:none;outline:none}"+
".uni-widget .shader-panel{font-family:ui-monospace,\"SF Mono\",Menlo,Consolas,monospace;font-size:11px;line-height:1.6;white-space:pre;overflow-x:auto}"+
".uni-widget .desc-name{font-size:11px;font-weight:700;letter-spacing:0.08em}"+
".uni-widget .desc-body{font-size:12px;line-height:1.6}";

var UNI_HTML =
'<div class="page">'+
 '<div class="canvas-wrap"><canvas id="ca" width="640" height="520"></canvas></div>'+
 '<div class="coh-panel" hidden>'+
  '<div class="coh-row"><span class="coh-label">Coherence</span><span class="coh-zone" id="cohZone">Coherent</span><span class="coh-val" id="cohVal">100</span></div>'+
  '<input type="range" class="coh-slider" id="cohSlider" min="10" max="100" value="100" step="1">'+
  '<div class="coh-row"><span class="coh-label">Shadow (DQ)</span><span class="coh-zone" id="sqZone">Clear</span><span class="coh-val" id="sqVal">0</span></div>'+
  '<input type="range" class="coh-slider" id="sqSlider" min="0" max="100" value="0" step="1">'+
  '<div class="quotient-row" id="quotientRow">CQ 100 &middot; DQ 0</div>'+
  '<div class="demo-row">'+
   '<button id="btn-talk" class="demo-btn">Talk</button>'+
   '<button id="btn-react" class="demo-btn">React</button>'+
   '<button id="btn-calm" class="demo-btn">Calm</button>'+
  '</div>'+
  '<div class="demo-row">'+
   '<button id="emo-joy" class="demo-btn">Joy</button>'+
   '<button id="emo-sadness" class="demo-btn">Sadness</button>'+
   '<button id="emo-disgust" class="demo-btn">Disgust</button>'+
   '<button id="emo-shock" class="demo-btn">Shock</button>'+
  '</div>'+
  '<div class="demo-row">'+
   '<button id="emo-fear" class="demo-btn">Fear</button>'+
   '<button id="emo-anger" class="demo-btn">Anger</button>'+
   '<button id="emo-shame" class="demo-btn">Shame</button>'+
   '<button id="emo-apathy" class="demo-btn">Apathy</button>'+
  '</div>'+
  '<div class="demo-row">'+
   '<button id="emo-surprise" class="demo-btn">Surprise</button>'+
   '<button id="emo-anticipation" class="demo-btn">Anticipation</button>'+
  '</div>'+
  '<div class="coh-row"><span class="coh-label">Intensity</span><span class="coh-zone" id="emoWordLabel">Content</span><span class="coh-val" id="emoIntVal">5</span></div>'+
  '<input type="range" class="coh-slider" id="emoIntSlider" min="1" max="9" value="5" step="1">'+
  '<div class="demo-row"><button id="btn-shader" class="demo-btn">Shader</button></div>'+
 '</div>'+
 /* THE SPEAK BOX IS GONE, round TF, caught by tests/functional.js once she
    actually mounted somewhere real: it was a textarea, and the Journal's own
    house rule is no text field while voice is the only door in (29 October).
    Hidden or not, it was still a real <textarea> in #story, and the gate
    that holds that rule does not know or care that it was invisible. Nothing
    in the real app ever wrote to it; window.Uni.speak(text) is the real,
    programmatic door to the same pipeline this box fed by hand in the demo.
    Its own label, #speakState, went with it for the same reason this file's
    own fix two commits ago already named: a state name in this table reads
    "ZONING OUT", which the house voice rule (no all-caps UI copy) does not
    allow onto a real page, visible or not. */
 '<pre id="shaderPanel" class="shader-panel" hidden></pre>'+
 '<div class="desc" hidden><div class="desc-name">Uni</div><div class="desc-body"></div></div>'+
'</div>';

var uniHost=null;
function uniInit(){
 if(uniHost)return;
 var style=document.createElement('style');
 style.textContent=UNI_STYLE;
 document.head.appendChild(style);
 uniHost=document.createElement('div');
 uniHost.className='uni-widget';
 uniHost.hidden=true;
 uniHost.innerHTML=UNI_HTML;
 document.body.appendChild(uniHost);
}
uniInit();

// -- Spring physics -------------------------------------------------------
function stepSp(cur, vel, tgt, k, b, dt) {
  const f = (tgt-cur)*k - vel*b;
  return [cur+vel*dt, vel+f*dt];
}

// -- Mouse tracking -------------------------------------------------------
const _ca = document.getElementById('ca');
let mxRaw=320, myRaw=260;
let lastMouseMoveT=performance.now();
document.addEventListener('mousemove', e => {
  const r = _ca.getBoundingClientRect();
  mxRaw = (e.clientX-r.left)*(640/r.width);
  myRaw = (e.clientY-r.top)*(520/r.height);
  lastMouseMoveT=performance.now();
});

// -- Blink ----------------------------------------------------------------
function makeBlink() {
  return {phase:0, t:0, dur:0, next:2.4+Math.random()*4.0};
}
function stepBlink(bl, dt) {
  bl.next -= dt;
  if(bl.next<=0 && bl.phase===0) { bl.phase=1; bl.t=0; bl.dur=0.146; }
  if(bl.phase>0) {
    bl.t+=dt;
    if(bl.phase===1 && bl.t>=bl.dur*0.40) { bl.phase=2; bl.t=0; }
    if(bl.phase===2 && bl.t>=bl.dur*0.10) { bl.phase=3; bl.t=0; }
    if(bl.phase===3 && bl.t>=bl.dur*0.50) { bl.phase=0; bl.t=0; bl.next=2.4+Math.random()*4.0+Math.random()*3.2; }
  }
  if(bl.phase===0) return 0;
  if(bl.phase===1) return Math.min(bl.t/(bl.dur*0.40),1);
  if(bl.phase===2) return 1;
  return 1-Math.min(bl.t/(bl.dur*0.50),1);
}

// =========================================================================
// COHERENCE COLOR SYSTEM
// 0   = deep dark red (collapsed, incoherent)
// 40-60 = oscillation zone -- cooling, beginning to collapse, turning red
// 100 = angelic white-yellow-gold (full SOURCE coherence)
// =========================================================================

let coherence = 100;
/* DQ, 0-100 -- the real total-shadow score, on the same scale as CQ and
   independent of it, never its complement. FIXED 2026-11-08: this file's
   September ruling ("the complement of CQ, not a formula input") predates
   the owner's later, more specific settlement, recorded directly in MOB's
   own engine (atuned_src/engine/compute.js, the DQ comment): "Not 100 minus
   CQ: that was one of his two statements and he has settled it as this
   one." DQ there is the 112 addresses' own held weight summed independently,
   not derived from CQ at all, and he confirmed the same thing again live,
   this session: "CQ and DQ and opposite ends, but SQ is what are the
   weights." SQ (the 112-address weights themselves) is not a single number
   and was never a real second dial; this file's old "Shadow (SQ)" slider
   was renamed to drive real DQ directly, 0-100, instead. */
let dq = 0;

// Five-stop palette: dead -> low -> oscillation -> building -> coherent
const CPAL = [
  // coh 0.00 -- collapsed dead red
  {c:0.00, cr:[20,1,0],   m1:[38,2,0],    m2:[22,1,0],    ed:[7,0,0],     bg:[5,0,1],    cl:[125,16,3]},
  // coh 0.30 -- low coherence, dim red
  {c:0.30, cr:[170,16,4], m1:[110,8,2],   m2:[62,3,0],    ed:[19,0,0],    bg:[9,1,2],    cl:[188,38,7]},
  // coh 0.52 -- oscillation zone, deep saturated red
  {c:0.52, cr:[215,58,8], m1:[148,28,3],  m2:[85,8,0],    ed:[30,2,0],    bg:[11,2,1],   cl:[218,72,12]},
  // coh 0.72 -- building, warm amber
  {c:0.72, cr:[252,172,24],m1:[235,128,16],m2:[188,88,8], ed:[72,34,0],   bg:[12,6,3],   cl:[248,210,85]},
  // coh 1.00 -- full coherence, angelic white-gold
  {c:1.00, cr:[255,254,240],m1:[255,222,140],m2:[244,166,30],ed:[118,52,0],bg:[13,8,5], cl:[255,248,220]},
];
function _lV(a,b,t){return a.map((v,i)=>Math.round(v+(b[i]-v)*t));}
function getPalette(t01){
  for(let i=0;i<CPAL.length-1;i++){
    const a=CPAL[i],b=CPAL[i+1];
    if(t01<=b.c){
      const t=Math.max(0,Math.min(1,(t01-a.c)/(b.c-a.c)));
      return{cr:_lV(a.cr,b.cr,t),m1:_lV(a.m1,b.m1,t),m2:_lV(a.m2,b.m2,t),
             ed:_lV(a.ed,b.ed,t),bg:_lV(a.bg,b.bg,t),cl:_lV(a.cl,b.cl,t)};
    }
  }
  const s=CPAL[CPAL.length-1];
  return{cr:s.cr,m1:s.m1,m2:s.m2,ed:s.ed,bg:s.bg,cl:s.cl};
}
function _rgb(v){return`rgb(${v[0]},${v[1]},${v[2]})`;}
function _rgba(v,a){return`rgba(${v[0]},${v[1]},${v[2]},${a})`;}

// Coherence zones
const ZONES=[
  {t:20,  label:'Collapsed',   r:[20,1,0]},
  {t:42,  label:'Low',         r:[155,20,4]},
  {t:62,  label:'Oscillating', r:[200,52,8]},
  {t:82,  label:'Building',    r:[220,150,20]},
  {t:101, label:'Coherent',    r:[180,140,60]},
];

// Wire sliders -- Coherence (CQ) and Shadow (DQ), two real independent dials
(function(){
  const sl=document.getElementById('cohSlider');
  const vl=document.getElementById('cohVal');
  const zl=document.getElementById('cohZone');
  const sqSl=document.getElementById('sqSlider');
  const sqVl=document.getElementById('sqVal');
  const sqZl=document.getElementById('sqZone');
  const qRow=document.getElementById('quotientRow');
  const cohThStyle=document.createElement('style');
  document.head.appendChild(cohThStyle);
  const sqThStyle=document.createElement('style');
  document.head.appendChild(sqThStyle);

  const SQ_ZONES=[
    {t:20, label:'Clear'},
    {t:50, label:'Present'},
    {t:80, label:'Charged'},
    {t:101,label:'Heavy'},
  ];
  const trackDark='#1a1408';

  function fmtQ(n){ return (Math.round(n*10)/10).toFixed(1).replace(/\.0$/,''); }

  function update(){
    const c=+sl.value;
    coherence=c;
    vl.textContent=c;

    const p=getPalette(c/100);
    const tc=_rgb(p.cr);

    // Slider track gradient (filled left / unfilled right)
    sl.style.background=`linear-gradient(to right,${tc} 0%,${tc} ${c}%,${trackDark} ${c}%,${trackDark} 100%)`;

    // Thumb color via injected style
    cohThStyle.textContent=`.coh-slider::-webkit-slider-thumb{background:${tc}!important}` +
      `.coh-slider::-moz-range-thumb{background:${tc}!important}`;

    // Numeric display color
    vl.style.color=tc;

    // Zone label
    const z=ZONES.find(z=>c<z.t)||ZONES[ZONES.length-1];
    zl.textContent=z.label;
    zl.style.color=_rgb(z.r);

    // Shadow (DQ) -- independent of coherence, real total-shadow scale, 0-100
    const sq=+sqSl.value;
    dq=sq;
    sqVl.textContent=fmtQ(sq);
    const sqFrac=sq/100;
    const sqColor=`rgba(190,70,180,${(0.55+sqFrac*0.45).toFixed(2)})`;
    sqSl.style.background=`linear-gradient(to right,${sqColor} 0%,${sqColor} ${sqFrac*100}%,${trackDark} ${sqFrac*100}%,${trackDark} 100%)`;
    sqThStyle.textContent=`#sqSlider::-webkit-slider-thumb{background:${sqColor}!important}` +
      `#sqSlider::-moz-range-thumb{background:${sqColor}!important}`;
    sqVl.style.color=sqColor;
    const sqz=SQ_ZONES.find(z=>sq<z.t)||SQ_ZONES[SQ_ZONES.length-1];
    sqZl.textContent=sqz.label;
    sqZl.style.color=sqColor;

    if(qRow) qRow.textContent=`CQ ${c}  \u00b7  DQ ${fmtQ(sq)}`;
  }
  sl.addEventListener('input',update);
  sqSl.addEventListener('input',update);
  update();
})();

// =========================================================================
// NOVA  (cinematic particle sphere)
// =========================================================================
(function(){
  const cv = document.getElementById('ca');
  const ctx = cv.getContext('2d');
  const W=640,H=520,CX=320,CY=252,R=136;
  const DPR=Math.max(1,Math.min(3,window.devicePixelRatio||1));
  if(DPR!==1){ cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR); ctx.scale(DPR,DPR); }

  // Subtle dither -- a tiny tileable noise pattern drawn once per frame at
  // very low alpha, 'overlay' blended. Breaks up the 8-bit banding that
  // shows up in the large soft gradients (aura, decoherence glow, rim)
  // without reading as visible grain.
  const ditherCv=document.createElement('canvas');
  ditherCv.width=64; ditherCv.height=64;
  const ditherCtx=ditherCv.getContext('2d');
  const ditherImg=ditherCtx.createImageData(64,64);
  for(let i=0;i<ditherImg.data.length;i+=4){
    const v=Math.floor(Math.random()*256);
    ditherImg.data[i]=v; ditherImg.data[i+1]=v; ditherImg.data[i+2]=v; ditherImg.data[i+3]=255;
  }
  ditherCtx.putImageData(ditherImg,0,0);
  const ditherPattern=ctx.createPattern(ditherCv,'repeat');
  function drawDither(){
    ctx.save();
    ctx.globalCompositeOperation='overlay';
    ctx.globalAlpha=0.025;
    ctx.fillStyle=ditherPattern;
    ctx.fillRect(0,0,W,H);
    ctx.restore();
  }

  // Phoneme -> viseme
  // Preston Blair's 9-shape phoneme chart -- the industry-standard mouth
  // set Disney-trained animators use and that tools like Rhubarb Lip Sync
  // build directly on. CH/TH are documented extensions beyond the
  // canonical 9, added here for the same reason several working charts
  // add them: Blair's "etc" bucket otherwise conflates them with L/FV.
  const VSHAPES={
    'rest':{mw:0.00,mh:0.00},  // silence
    'AI':  {mw:1.15,mh:1.05},  // open wide -- A, I
    'E':   {mw:1.32,mh:0.32},  // wide, teeth together -- E
    'O':   {mw:0.74,mh:0.72},  // round, open -- O
    'U':   {mw:0.44,mh:0.62},  // small round, held vowel -- U (food, you)
    'WQ':  {mw:0.30,mh:0.46},  // tight forward pucker -- W, Qu glide
    'FV':  {mw:0.80,mh:0.26},  // teeth on lower lip -- F, V
    'L':   {mw:0.62,mh:0.40},  // tongue up -- L
    'MBP': {mw:0.10,mh:0.02},  // closed lips -- M, B, P
    'etc': {mw:0.58,mh:0.12},  // catch-all -- C,D,G,K,N,R,S,T,X,Y,Z
    'CH':  {mw:0.52,mh:0.20},  // extended -- SH, CH, J
    'TH':  {mw:0.56,mh:0.24},  // extended -- TH
  };
  // Co-articulation: real visemes aren't equal weight. Closure/rounding
  // shapes (MBP/O/U/WQ) resist being averaged away by neighbors -- they
  // anticipate early and persist late. Weak shapes (TT/etc/L) get overridden
  // easily. Grounded in Cohen et al.'s dominance-function model (the
  // standard academic co-articulation approach), not a Pixar-specific claim
  // -- no public Pixar source on this surfaced in research.
  const VISEME_DOMINANCE={rest:0.10,AI:0.30,E:0.30,O:0.60,U:0.70,WQ:0.75,FV:0.40,L:0.25,MBP:0.90,etc:0.20,CH:0.35,TH:0.30};
  let prevViseme='rest';
  let lastSpeechT=-999;
  let mouthW=0,mouthWV=0,mouthH=0,mouthHV=0;
  let curViseme='rest',visemeDecay=0;

  // ----------------------------------------------------------------
  // Text -> viseme sequence -- real word-level lip-sync instead of a
  // generic per-character tick. Longest-match digraph lookup (th, sh,
  // ch, oo, ee, ea, ...), a silent-trailing-e heuristic (make, time,
  // hope), and durations weighted by how long each sound actually
  // holds in speech, with real inter-word pauses between.
  // ----------------------------------------------------------------
  const V_DIGRAPHS=[
    ['tch','CH',1.0],['augh','AI',1.1],['ough','AI',1.1],['igh','AI',1.0],
    ['sh','CH',1.0],['ch','CH',1.0],['th','TH',0.8],['ph','FV',0.8],
    ['wh','WQ',0.7],['qu','WQ',0.6],['ck','etc',0.5],['ng','etc',0.7],
    ['oo','U',1.1],['ee','E',1.1],['ea','E',1.0],['ou','AI',1.0],
    ['ow','AI',1.0],['oy','O',1.0],['oi','O',1.0],['ay','AI',0.9],
    ['ai','AI',0.9],['aw','AI',0.9],['oa','O',1.0],['ue','U',0.9],
    ['ui','U',0.9],
  ].sort((a,b)=>b[0].length-a[0].length);
  const V_SINGLE={
    a:['AI',0.8], e:['E',0.7], i:['E',0.6], o:['O',0.8], u:['U',0.7], y:['E',0.6],
    m:['MBP',0.5], b:['MBP',0.5], p:['MBP',0.5], f:['FV',0.5], v:['FV',0.5],
    w:['WQ',0.4], h:['AI',0.2], l:['L',0.5],
  };
  const V_DEFAULT=['etc',0.4];

  function wordToUnits(word){
    const units=[];
    let i=0;
    while(i<word.length){
      let matched=false;
      for(const[g,v,wt] of V_DIGRAPHS){
        if(word.startsWith(g,i)){ units.push([v,wt]); i+=g.length; matched=true; break; }
      }
      if(matched) continue;
      const ch=word[i];
      units.push(V_SINGLE[ch]||V_DEFAULT);
      i++;
    }
    // Silent trailing 'e' (make, time, hope, ...): drop it when it's
    // preceded by a consonant and an earlier vowel exists in the word
    if(word.length>3 && word.endsWith('e')){
      const prev=word[word.length-2];
      if(prev && !'aeiouy'.includes(prev) && /[aeiouy]/.test(word.slice(0,-1))){
        units.pop();
      }
    }
    return units;
  }

  const VSEQ_UNIT=0.115; // seconds per unit of weight 1.0 -- roughly a syllable beat
  function textToVisemeSequence(text){
    const seq=[];
    const words=String(text).toLowerCase().split(/\s+/);
    for(const raw of words){
      const word=raw.replace(/[^a-z]/g,'');
      if(!word) continue;
      for(const[v,wt] of wordToUnits(word)) seq.push({v,dur:VSEQ_UNIT*wt});
      seq.push({v:'rest',dur:/[.!?,;:]$/.test(raw)?0.24:0.085});
    }
    return seq;
  }

  // Blend shapes
  const BS=[
    // eyeDrop: gaze height bias (+down/-up). jitter: micro-tremor amount.
    // hue/sat/val: per-state color signature. twinkle: particle shimmer rate.
    // rimSpread: >1 softer/wider corona, <1 tighter/crisper. orbPlay: sub-orb
    // wander radius. wobble: rotational shake. bobMul: idle-float amplitude.
    {name:'PATIENT', dur:4.6, eySc:1.00, sqnt:0.00,  dil:-0.05, spin:0.55, glow:0.98, sep:0.00,  tilt:0.000,
     eyeDrop:0.015, jitter:0.008, hue:-4, sat:-0.05, val:0.98, twinkle:0.85, rimSpread:1.03, orbPlay:0.55, wobble:0.000, bobMul:1.15,
     mouthCurve:0.20, browPinch:-0.03, browAsym:0.00, mouthAsym:0.03, cheekSquint:0.08, agitation:0.00, lidDroop:0.00},
    {name:'ZONING OUT', dur:4.0, eySc:1.05, sqnt:-0.05, dil:0.15,  spin:0.40, glow:0.85, sep:0.00,  tilt:0.020,
     eyeDrop:0.040, jitter:0.002, hue:-10, sat:-0.20, val:0.88, twinkle:0.35, rimSpread:1.12, orbPlay:0.15, wobble:0.000, bobMul:0.60,
     mouthCurve:-0.05, browPinch:-0.08, browAsym:0.02, mouthAsym:0.00, cheekSquint:0.00, agitation:0.00, lidDroop:0.10},
    {name:'DAYDREAMING', dur:4.2, eySc:1.10, sqnt:0.08,  dil:0.10,  spin:0.65, glow:1.05, sep:0.02,  tilt:-0.030,
     eyeDrop:-0.030, jitter:0.004, hue:+6, sat:0.04,  val:1.03, twinkle:1.10, rimSpread:1.00, orbPlay:0.75, wobble:0.006, bobMul:1.35,
     mouthCurve:0.28, browPinch:-0.10, browAsym:0.05, mouthAsym:0.05, cheekSquint:0.20, agitation:0.00, lidDroop:0.08},
    {name:'CURIOUS', dur:3.2, eySc:1.30, sqnt:-0.14, dil:0.50,  spin:1.10, glow:1.07, sep:0.07,  tilt:0.065,
     eyeDrop:-0.025, jitter:0.020, hue:+4,  sat:0.07,  val:1.02, twinkle:1.15, rimSpread:0.94, orbPlay:1.55, wobble:0.012, bobMul:1.55,
     mouthCurve:0.20, browPinch:-0.20, browAsym:0.28, mouthAsym:0.30, cheekSquint:0.10, agitation:0.10, lidDroop:0.00},
  ];
  // Grounded in atuned/data/canon.json registers.ladders: 8 parent emotion
  // families, each the real 9-word intensity ladder from the canon (not
  // invented). Each "full" pose is this engine's reading of that family's
  // most intense word; children interpolate from NEUTRAL to "full" by rank.
  const EMO_FAMILIES={
    joy:     {words:['Content','Pleased','Cheerful','Joyful','Elated','Thrilled','Ecstatic','Overjoyed','Blissful'],
              full:{eySc:1.35, sqnt:-0.10, dil:0.55,  spin:1.35, glow:1.18, sep:0.10,  tilt:0.030,
                    eyeDrop:-0.040, jitter:0.020, hue:+12, sat:0.28,  val:1.14, twinkle:1.25, rimSpread:0.98, orbPlay:1.40, wobble:0.000, bobMul:1.80, rings:3, mouthCurve:0.85, browPinch:0.15,
                    browAsym:0.05, mouthAsym:0.05, cheekSquint:0.70, agitation:0.20, lidDroop:0.00}},
    sadness: {words:['Disappointed','Dismal','Downcast','Mournful','Despondent','Grief-stricken','Heartbroken','Depressed','Despairing'],
              full:{eySc:0.70, sqnt:0.22,  dil:-0.42, spin:0.35, glow:0.78, sep:-0.06, tilt:0.000,
                    eyeDrop:0.095,  jitter:0.000, hue:+167, sat:0.14, val:0.74, twinkle:0.55, rimSpread:1.20, orbPlay:0.20, wobble:0.000, bobMul:0.30, rings:0, mouthCurve:-0.75, browPinch:0.35,
                    browAsym:0.08, mouthAsym:0.00, cheekSquint:0.00, agitation:0.00, lidDroop:0.65}},
    disgust: {words:['Displeased','Disapproving','Repelled','Revolted','Appalled','Horrified','Nauseated','Loathsome','Detested'],
              full:{eySc:0.75, sqnt:0.40,  dil:-0.15, spin:0.75, glow:0.90, sep:-0.12, tilt:0.045,
                    eyeDrop:0.030,  jitter:0.015, hue:+37, sat:0.10,  val:0.70, twinkle:0.70, rimSpread:1.10, orbPlay:0.35, wobble:0.008, bobMul:0.35, rings:0, mouthCurve:-0.55, browPinch:0.55,
                    browAsym:0.30, mouthAsym:0.35, cheekSquint:0.28, agitation:0.20, lidDroop:0.22}},
    // Owner: "make shock actually yellow, like blue to yellow, like a zap"
    // -- resting hue changed from +152 (cyan/blue) to +18 (yellow); the
    // transient zap (see shockZapHueBoost) sweeps in from the old bluer
    // territory down to this yellow on trigger
    shock:   {words:['Startled','Surprised','Astonished','Amazed','Flabbergasted','Stunned','Aghast','Thunderstruck','Dumbfounded'],
              full:{eySc:1.40, sqnt:-0.50, dil:0.80,  spin:0.55, glow:1.15, sep:0.18,  tilt:0.000,
                    eyeDrop:-0.070, jitter:0.090, hue:+18, sat:0.40,  val:0.85, twinkle:0.85, rimSpread:0.95, orbPlay:0.15, wobble:0.035, bobMul:0.10, rings:2, mouthCurve:0.15, browPinch:-0.65,
                    browAsym:0.30, mouthAsym:0.00, cheekSquint:0.00, agitation:0.55, lidDroop:0.00}},
    fear:    {words:['Apprehensive','Uneasy','Worried','Frightened','Terrified','Horrified','Panic-stricken','Petrified','Paralyzed'],
              full:{eySc:1.26, sqnt:-0.45, dil:0.65,  spin:1.20, glow:0.96, sep:-0.14, tilt:-0.025,
                    eyeDrop:-0.050, jitter:0.075, hue:+92, sat:0.06,  val:0.45, twinkle:1.05, rimSpread:1.02, orbPlay:0.75, wobble:0.016, bobMul:0.40, rings:1, mouthCurve:-0.25, browPinch:-0.45,
                    browAsym:0.12, mouthAsym:0.00, cheekSquint:0.18, agitation:0.35, lidDroop:0.22}},
    anger:   {words:['Annoyed','Irritated','Aggravated','Angry','Furious','Enraged','Seething','Infuriated','Wrathful'],
              full:{eySc:0.82, sqnt:0.55,  dil:0.30,  spin:1.55, glow:1.10, sep:-0.10, tilt:-0.020,
                    eyeDrop:0.015,  jitter:0.045, hue:-38,  sat:0.42,  val:0.78, twinkle:1.35, rimSpread:0.84, orbPlay:0.90, wobble:0.022, bobMul:0.60, rings:1, mouthCurve:-0.40, browPinch:0.80,
                    browAsym:0.40, mouthAsym:0.25, cheekSquint:0.34, agitation:0.95, lidDroop:0.20}},
    shame:   {words:['Embarrassed','Regretful','Guilty','Remorseful','Humiliated','Disgraced','Mortified','Degraded','Stigmatized'],
              full:{eySc:0.68, sqnt:0.15,  dil:-0.35, spin:0.45, glow:0.72, sep:-0.18, tilt:-0.060,
                    eyeDrop:0.120,  jitter:0.005, hue:+6,  sat:-0.06, val:0.32, twinkle:0.50, rimSpread:1.25, orbPlay:0.15, wobble:0.000, bobMul:0.20, rings:0, mouthCurve:-0.60, browPinch:0.30,
                    browAsym:0.15, mouthAsym:-0.10, cheekSquint:0.05, agitation:0.00, lidDroop:0.55}},
    // Not from canon.json's registers.ladders -- that register only has 8
    // families and "resent" was one of them, but atuned/data/nine_laws.json
    // (the actual 9 laws: Fear/Anger/Shame/Disgust/Apathy/Shock/Sad/
    // Surprise/Anticipation) lists resent as a charge under Anger, not its
    // own law. Owner, after we flagged this: "resentment should not be
    // here" -- removed. Apathy replaces it: explicitly requested, even
    // though nine_laws.json marks it measurable:false/expresses:false (no
    // charges/poles to ground numbers in), so this is flat affect by
    // design convention, not sourced data -- dim, desaturated, heavy-lidded,
    // minimal motion, color pulled almost all the way out.
    apathy:  {words:['Disengaged','Indifferent','Detached','Unmoved','Numb','Checked-Out','Hollow','Vacant','Void'],
              full:{eySc:0.85, sqnt:0.10,  dil:-0.30, spin:0.30, glow:0.55, sep:-0.08, tilt:0.000,
                    eyeDrop:0.060,  jitter:0.000, hue:0,   sat:-0.55, val:0.55, twinkle:0.25, rimSpread:1.15, orbPlay:0.08, wobble:0.000, bobMul:0.15, rings:0, mouthCurve:-0.05, browPinch:0.00,
                    browAsym:0.00, mouthAsym:0.00, cheekSquint:0.00, agitation:0.00, lidDroop:0.35}},
    // Surprise and Anticipation were the two genuinely missing laws with no
    // family here at all. Their word ladders below are NOT sourced canon
    // text -- a reasoned construction (researched against Ekman/FACS for
    // Surprise, Plutchik's wheel + animation-craft convention for
    // Anticipation; flagged honestly to the owner, same as the lineage
    // color palette earlier). FACS: surprise is the slower cognitive/
    // orienting reflex (brows up, eyes wide, jaw drop) distinct from the
    // fast protective startle reflex our existing Shock family already
    // covers -- so Surprise reuses a similar wide-eyed shape but stays calm
    // (low agitation/jitter) instead of alarmed. Anticipation is the
    // structural opposite: narrowed, forward-focused, held-still.
    surprise:{words:['Noticing','Intrigued','Caught Off Guard','Wide-Eyed','Taken Aback','Marveling','Struck','Awestruck','Astounded'],
              full:{eySc:1.30, sqnt:-0.35, dil:0.60,  spin:0.60, glow:1.10, sep:0.12,  tilt:0.000,
                    eyeDrop:-0.050, jitter:0.025, hue:+45, sat:0.25,  val:1.05, twinkle:1.00, rimSpread:0.98, orbPlay:0.50, wobble:0.010, bobMul:0.50, rings:1, mouthCurve:0.35, browPinch:-0.55,
                    browAsym:0.10, mouthAsym:0.00, cheekSquint:0.00, agitation:0.15, lidDroop:0.00}},
    anticipation:{words:['Noticing','Curious','Interested','Watchful','Expectant','Anticipating','Alert','Keyed Up','Vigilant'],
              full:{eySc:0.90, sqnt:0.30,  dil:0.25,  spin:0.50, glow:1.02, sep:-0.04, tilt:0.015,
                    eyeDrop:0.010,  jitter:0.015, hue:+20, sat:0.20,  val:0.95, twinkle:0.75, rimSpread:1.00, orbPlay:0.25, wobble:0.004, bobMul:0.35, rings:0, mouthCurve:-0.05, browPinch:0.45,
                    browAsym:0.05, mouthAsym:0.00, cheekSquint:0.05, agitation:0.10, lidDroop:0.10}},
  };
  const EMO_NEUTRAL={eySc:1.00, sqnt:0.00, dil:0.00, spin:1.00, glow:1.00, sep:0.00, tilt:0.000,
                      eyeDrop:0.000, jitter:0.010, hue:0, sat:0.00, val:1.00, twinkle:1.00, rimSpread:1.00, orbPlay:1.00, wobble:0.000, bobMul:1.00,
                      mouthCurve:0.20, browPinch:0.00, browAsym:0.00, mouthAsym:0.00, cheekSquint:0.00, agitation:0.00, lidDroop:0.00};
  const EMO_FIELDS=['eySc','sqnt','dil','spin','glow','sep','tilt','eyeDrop','jitter','hue','sat','val','twinkle','rimSpread','orbPlay','wobble','bobMul','mouthCurve','browPinch','browAsym','mouthAsym','cheekSquint','agitation','lidDroop'];
  function buildChildEmotion(famKey,idx){
    const fam=EMO_FAMILIES[famKey], n=fam.words.length, frac=(idx+1)/n, f=fam.full;
    const out={name:fam.words[idx], family:famKey, dur:0.70+frac*1.60, rings:frac>0.55?(f.rings||0):0};
    // Owner: "when I click joy or shock or anything else, I don't see the
    // color shift" -- measured: at the default (mildest, rank 1/9) word,
    // anger's rim color was within rounding noise of neutral (linear frac
    // gives it only 11% of the full hue/sat/val shift). hue/sat/val get a
    // sqrt curve instead of linear so even the mildest word in each ladder
    // carries a third of the full color shift, not a tenth; every other
    // field keeps the original linear ladder.
    const colorFrac=Math.sqrt(frac);
    for(const k of EMO_FIELDS){
      const t=(k==='hue'||k==='sat'||k==='val')?colorFrac:frac;
      out[k]=EMO_NEUTRAL[k]+(f[k]-EMO_NEUTRAL[k])*t;
    }
    // Owner: "push the colors when it's all maxed out, the saturation" --
    // frac^4 keeps this negligible until the top rank or two of each
    // ladder, so the lower/mid words aren't touched, only the peak pops
    out.sat=out.sat*(1+Math.pow(frac,4)*0.45);
    return out;
  }
  const CHILD_EMOTIONS={};
  for(const fam in EMO_FAMILIES) EMO_FAMILIES[fam].words.forEach((w,i)=>{ CHILD_EMOTIONS[fam+'_'+i]=buildChildEmotion(fam,i); });
  // The 72 ladder words themselves double as "intense word" speech triggers
  const EMO_WORD_TRIGGERS={};
  for(const fam in EMO_FAMILIES) EMO_FAMILIES[fam].words.forEach((w,i)=>{ EMO_WORD_TRIGGERS[w.toLowerCase().replace(/[^a-z]/g,'')]=fam+'_'+i; });

  // Chakra colors -- sampled from the artist's own disc artwork, not chosen
  // (atuned/data/chakra_orbs_calibrated.json). The four "field"-tagged
  // transpersonal nodes in canon.json (Gaia Gateway, Earth Star, Soul Star,
  // Stellar Gateway) have no calibrated color in that file and are left out
  // of the trigger list below rather than given an invented one.
  const CHAKRA_COLORS={
    root:  [215, 46, 39],  sacral:[223,124, 41],  solar:[237,209, 63],
    heart: [123,175, 77],  throat:[ 46,147,199],  eye:  [ 73, 79,157],
    crown: [138, 81,150],
    // Lineage colors (not a sourced tradition -- see note above)
    ancestral:[139, 90, 60], parental:[193,105, 79],
    generational:[142, 69,133], celestial:[201,214,240],
  };
  const CHAKRA_NAMES={root:'Root',sacral:'Sacral',solar:'Solar Plexus',heart:'Heart',throat:'Throat',eye:'Third Eye',crown:'Crown',
    ancestral:'Ancestral',parental:'Parental',generational:'Generational',celestial:'Celestial'};
  // Grounded in atuned/data/canon.json registers.nodes: the 108 real fetter
  // names (of 112; the 4 "field" nodes above excluded), each carrying its
  // real chakra tag -- an "imprint" is what a vritti leaves (THE_RULINGS.md
  // #269), and these are the actual named imprints the canon tracks. Longest
  // phrase first so a compound name like "shame of desire" is preferred over
  // the bare "shame" it contains.
  const CHAKRA_WORD_TRIGGERS=[
    ['using spiritual language to manipulate','throat'],
    ['manipulation through emotion','sacral'],
    ['knowing better than source','crown'],
    ['talking to avoid feeling','throat'],
    ['entitlement will based','solar'],
    ['avoidance of pleasure','sacral'],
    ['manipulative kindness','heart'],
    ['speaking to be right','throat'],
    ['self judgment heart','heart'],
    ['lack of discernment','eye'],
    ['rejection of spirit','crown'],
    ['avoidance of grief','heart'],
    ['spiritual escapism','crown'],
    ['seeking validation','crown'],
    ['need to be special','crown'],
    ['unworthy of source','crown'],
    ['rejection of unity','crown'],
    ['guilt of pleasure','sacral'],
    ['need for approval','sacral'],
    ['need to be needed','heart'],
    ['resentment heart','heart'],
    ['stage performing','throat'],
    ['manic expression','throat'],
    ['shame of desire','sacral'],
    ['oversensitivity','sacral'],
    ['people pleasing','throat'],
    ['doubt of source','crown'],
    ['spiritual pride','crown'],
    ['denial of truth','crown'],
    ['anger at source','crown'],
    ['denial of light','crown'],
    ['endless seeking','crown'],
    ['hypersexuality','sacral'],
    ['excess emotion','sacral'],
    ['self silencing','throat'],
    ['hypervigilance','eye'],
    ['false humility','crown'],
    ['savior complex','crown'],
    ['fear of source','crown'],
    ['self exclusion','crown'],
    ['disconnection','root'],
    ['co dependency','sacral'],
    ['perfectionism','solar'],
    ['self judgment','solar'],
    ['forgetfulness','crown'],
    ['unworthiness','solar'],
    ['closed heart','heart'],
    ['interrupting','throat'],
    ['overanalysis','eye'],
    ['condemnation','crown'],
    ['entitlement','root'],
    ['infatuation','sacral'],
    ['competition','solar'],
    ['need to win','solar'],
    ['superiority','solar'],
    ['expectation','heart'],
    ['insecurity','root'],
    ['victimhood','root'],
    ['possession','root'],
    ['resistance','root'],
    ['compulsion','root'],
    ['resentment','solar'],
    ['separation','heart'],
    ['false love','heart'],
    ['comparison','throat'],
    ['projection','eye'],
    ['distortion','eye'],
    ['addiction','sacral'],
    ['obsession','sacral'],
    ['arrogance','solar'],
    ['rebellion','solar'],
    ['martyrdom','heart'],
    ['rejection','heart'],
    ['scarcity','root'],
    ['lethargy','root'],
    ['escapism','root'],
    ['collapse','root'],
    ['jealousy','sacral'],
    ['judgment','solar'],
    ['rigidity','solar'],
    ['betrayal','heart'],
    ['delusion','eye'],
    ['cynicism','eye'],
    ['distrust','eye'],
    ['paranoia','eye'],
    ['idealism','eye'],
    ['nihilism','crown'],
    ['control','root'],
    ['fantasy','sacral'],
    ['anxiety','solar'],
    ['longing','heart'],
    ['hatred','heart'],
    ['deceit','throat'],
    ['excuse','throat'],
    ['hubris','crown'],
    ['shame','root'],
    ['guilt','root'],
    ['panic','root'],
    ['pride','solar'],
    ['anger','solar'],
    ['force','solar'],
    ['blame','heart'],
    ['lying','throat'],
    ['dogma','eye'],
    ['doubt','eye'],
    ['fear','root'],
    ['lust','sacral'],
    ['envy','sacral'],
    ['ancestors','ancestral'],['ancestor','ancestral'],['ancestral','ancestral'],['lineage','ancestral'],
    ['grandparents','ancestral'],['grandmother','ancestral'],['grandfather','ancestral'],
    ['parents','parental'],['parental','parental'],['mother','parental'],['father','parental'],
    ['generations','generational'],['generational','generational'],['generation','generational'],
    ['celestial','celestial'],['cosmic','celestial'],['universe','celestial'],['stars','celestial']
  ];
  let chakraPulses=[];
  let imprintRecentWords=[];
  const CHAKRA_PULSE_LIFE=1.3;
  let chakraLabelT=0, chakraLabelTxt='';
  function spawnChakraPulse(tag){
    const col=CHAKRA_COLORS[tag];
    if(!col) return;
    chakraPulses.push({age:0,color:col});
    if(chakraPulses.length>2) chakraPulses.shift();
    chakraLabelT=CHAKRA_PULSE_LIFE;
    chakraLabelTxt='Imprint: '+CHAKRA_NAMES[tag];
  }
  function scanForImprint(text){
    const norm=' '+String(text).toLowerCase().replace(/[^a-z\s]/g,' ').replace(/\s+/g,' ').trim()+' ';
    for(const[ph,tag] of CHAKRA_WORD_TRIGGERS){
      if(norm.includes(' '+ph+' ')){
        spawnChakraPulse(tag);
        // Reset the window so the matched phrase can't keep re-firing on
        // every later word while it ages out, and so it doesn't mask the
        // next distinct imprint that comes right after it
        imprintRecentWords=[];
        return;
      }
    }
  }

  let curEmotion=null, emoT=0, emoDur=0;
  let joyPulseT=0;
  let idleAnticipated=false;
  let specialEvent=null, specialAge=0, specialDur=0;
  function maybeTriggerSpecialEvent(){
    if(specialEvent || demoMode!==null || (curEmotion && emoT<emoDur)) return;
    const roll=Math.random();
    if(roll<0.07){ specialEvent='doze'; specialAge=0; specialDur=3.2; }
    else if(roll<0.12){ specialEvent='idea'; specialAge=0; specialDur=0.85; spawnRing(0.42); triggerReaction(0.30,0.05); }
    // Owner: "a really excited idle, just generally excited, like yay, and
    // then it stops" -- a quick genuine joy burst, not tied to any emotion
    // trigger. The energy pulse rides the triggerReaction deferral above,
    // so the anticipation dip still visibly precedes the brighten/widen.
    else if(roll<0.17){ specialEvent='excited'; specialAge=0; specialDur=1.15; spawnRing(0.55); triggerReaction(0.75,0.07,0.60); }
  }
  // Vignette transient state -- see setChildEmotion
  let vignetteFamily=null, vignetteTimer=0, vignetteFrac=0;
  let vignetteScale=1,vignetteScaleV=0;
  let vignetteScaleY=1,vignetteScaleYV=0;
  let vignetteGray=0,vignetteGrayV=0;
  let vignettePitch=0,vignettePitchV=0;
  let vignetteDrop=0,vignetteDropV=0;
  let vignetteGlow=0,vignetteGlowV=0;
  let vignetteGreen=0,vignetteGreenV=0;
  let vignetteRed=0,vignetteRedV=0;
  let vignetteEyeDrop=0,vignetteEyeDropV=0;
  let vignetteDark=0,vignetteDarkV=0;
  // Shock's color "zap" -- a quick blue-to-yellow sweep, not a sustained
  // hue shift, so it reads as a flash rather than just "shock is yellow now"
  let shockZapT=0, shockZapActive=false;
  function setChildEmotion(key){
    const e=CHILD_EMOTIONS[key];
    if(!e) return;
    curEmotion=key; emoT=0; emoDur=e.dur;
    for(let k=0;k<(e.rings||0);k++) spawnRing(0.50);
    triggerReaction(0.55+((e.dur-0.70)/1.60)*0.65,null,0.30+((e.dur-0.70)/1.60)*0.25);
    const vFam=key.split('_')[0], vFrac=(e.dur-0.70)/1.60;
    vignetteFamily=vFam; vignetteFrac=vFrac; vignetteTimer=1.0+vFrac*0.8;
    if(vFam==='shock'){ shockZapT=0; shockZapActive=true; }
    document.querySelectorAll('.demo-row .demo-btn').forEach(b=>{ if(b.id.startsWith('emo-')) b.classList.remove('active'); });
    const btn=document.getElementById('emo-'+e.family);
    if(btn){ btn.classList.add('active'); setTimeout(()=>btn.classList.remove('active'), e.dur*1000); }
  }
  const emoIntSl=document.getElementById('emoIntSlider');
  const emoIntVl=document.getElementById('emoIntVal');
  const emoWordEl=document.getElementById('emoWordLabel');
  function emoIntensityIdx(){ return (emoIntSl?+emoIntSl.value:1)-1; }
  if(emoIntSl){
    emoIntSl.addEventListener('input',()=>{
      emoIntVl.textContent=emoIntSl.value;
      if(emoWordEl && curEmotion){
        const fam=curEmotion.split('_')[0];
        emoWordEl.textContent=EMO_FAMILIES[fam].words[emoIntensityIdx()];
      }
    });
  }
  ['joy','sadness','disgust','shock','fear','anger','shame','apathy','surprise','anticipation'].forEach(fam=>{
    const b=document.getElementById('emo-'+fam);
    if(b) b.addEventListener('click',()=>{
      const idx=emoIntensityIdx();
      if(emoWordEl) emoWordEl.textContent=EMO_FAMILIES[fam].words[idx];
      setChildEmotion(fam+'_'+idx);
    });
  });

  let bsIdx=0,bsT=0;
  // Near-critical damping on every channel -- deliberate, held poses instead
  // of springy overshoot, which is what reads as "gamey"
  let eyeSc=1,eyeScV=0,sqnt=0,sqntV=0,dil=0,dilV=0;
  let sep=0,sepV=0,tilt=0,tiltV=0;
  let bsSpin=1,bsSpinV=0,bsGlow=1,bsGlowV=0;
  let eyeDrop=0,eyeDropV=0,jitter=0,jitterV=0;
  let hueC=0,hueCV=0,satC=0,satCV=0,valC=1,valCV=0;
  let twinkleC=1,twinkleCV=0,rimSpread=1,rimSpreadV=0,orbPlay=1,orbPlayV=0;
  let wobbleC=0,wobbleCV=0,bobMul=1,bobMulV=0;
  let mouthCurve=0,mouthCurveV=0,browPinch=0,browPinchV=0;
  let browAsym=0,browAsymV=0,mouthAsym=0,mouthAsymV=0,cheekSquint=0,cheekSquintV=0;
  let agitationC=0,agitationCV=0,lidDroopC=0,lidDroopCV=0;

  // ---- Round 2: per-state color tint (HSL nudge, computed once per frame) --
  function _rgb2hsl(r,g,b){
    r/=255;g/=255;b/=255;
    const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
    let h,s,l=(mx+mn)/2;
    if(mx===mn){h=0;s=0;}
    else{
      const d=mx-mn;
      s=l>0.5?d/(2-mx-mn):d/(mx+mn);
      if(mx===r) h=(g-b)/d+(g<b?6:0);
      else if(mx===g) h=(b-r)/d+2;
      else h=(r-g)/d+4;
      h/=6;
    }
    return [h*360,s,l];
  }
  function _hsl2rgb(h,s,l){
    h=((h%360)+360)%360/360;
    let r,g,b;
    if(s<=0){r=g=b=l;}
    else{
      const q=l<0.5?l*(1+s):l+s-l*s, pp=2*l-q;
      const hue2=(p,q2,t)=>{ if(t<0)t+=1; if(t>1)t-=1;
        if(t<1/6) return p+(q2-p)*6*t;
        if(t<1/2) return q2;
        if(t<2/3) return p+(q2-p)*(2/3-t)*6;
        return p; };
      r=hue2(pp,q,h+1/3); g=hue2(pp,q,h); b=hue2(pp,q,h-1/3);
    }
    return [Math.round(r*255),Math.round(g*255),Math.round(b*255)];
  }
  function tintRGB(rgb,hueShift,satAdd,valMul){
    const [h,s,l]=_rgb2hsl(rgb[0],rgb[1],rgb[2]);
    return _hsl2rgb(h+hueShift, Math.max(0,Math.min(1,s+satAdd)), Math.max(0,Math.min(1,l*valMul)));
  }
  function tintPalette(p,hueShift,satAdd,valMul){
    return {
      cr:tintRGB(p.cr,hueShift,satAdd,valMul), m1:tintRGB(p.m1,hueShift,satAdd,valMul),
      m2:p.m2, ed:p.ed, bg:p.bg, cl:tintRGB(p.cl,hueShift,satAdd,valMul),
    };
  }
  // Blends an rgb array toward its own luminance-preserving gray by amt
  // (0..1) -- predictable regardless of how saturated the source color is,
  // unlike an HSL satAdd subtraction bounded by the source's own saturation
  function grayMix(rgb,amt){
    const lum=rgb[0]*0.299+rgb[1]*0.587+rgb[2]*0.114;
    return rgb.map(c=>Math.round(c+(lum-c)*amt));
  }
  function colorMix(rgb,target,amt){
    return rgb.map((c,i)=>Math.round(c+(target[i]-c)*amt));
  }

  // Gaze spring
  let gazeX=0,gazeVX=0,gazeY=0,gazeVY=0;
  // Owner: "if the mouse stops moving for 4 seconds, go back to center
  // idle; when it moves again, the head turns back -- ease in and out."
  // A second, slower spring on the blend weight itself (not just the
  // final gaze position) so both directions ease, not just snap to a
  // new target that the position spring then chases.
  let idleRestFrac=0,idleRestFracV=0;
  // Head tilt/roll/yaw -- a third, slower tracking layer on top of the
  // pupil dart and the gaze/cluster follow: real head rotation (yaw turns
  // the particle shell's viewing angle, pitch leans it, roll tilts the
  // whole render). Rule-gated, not constant: it only runs at all while
  // idle (no demo mode active), and even then alternates between engaged
  // bursts (follows the mouse) and disengaged bursts (eases back to
  // neutral) on a random timer -- "sometimes follows, especially idle".
  let headYaw=0,headYawV=0,headPitch=0,headPitchV=0,headRoll=0,headRollV=0;
  // Pupil dart -- a much snappier spring than gazeX/gazeY chasing the same
  // target, so the pupil highlight visibly leads the slower-following
  // eye-cluster/head position instead of moving in lockstep with it
  let pupilX=0,pupilVX=0,pupilY=0,pupilVY=0;
  let blink=makeBlink();
  let lastTs=null;
  let blinkCount=0,prevClosed=0;
  let showStats=false;
  const speakStateEl=document.getElementById('speakState');

  // ----------------------------------------------------------------
  // Particle sphere -- 3200 pts, full sphere (both hemispheres)
  // ----------------------------------------------------------------
  const N_P=6250;
  const pTheta=new Float32Array(N_P);
  const pPhi  =new Float32Array(N_P);
  const pPhi0 =new Float32Array(N_P);  // origin latitude -- bounded wander anchors here
  const pDrift=new Float32Array(N_P);  // rad/s base individual drift
  const pPhase=new Float32Array(N_P);  // twinkle seed
  const pTurbAmp =new Float32Array(N_P); // theta eddy amplitude
  const pTurbFreq=new Float32Array(N_P); // theta eddy frequency
  const pPhiAmp  =new Float32Array(N_P); // latitude wander amplitude
  const pPhiFreq =new Float32Array(N_P); // latitude wander frequency
  const pPhiPh   =new Float32Array(N_P); // latitude wander phase
  const pSizeVar =new Float32Array(N_P); // per-particle size uniqueness
  const pBrightVar=new Float32Array(N_P); // per-particle brightness uniqueness
  const pCullThresh=new Float32Array(N_P); // fixed per-particle density-cull threshold
  // Scratch projection buffers
  const pSx=new Float32Array(N_P);
  const pSy=new Float32Array(N_P);
  const pA =new Float32Array(N_P);     // -1 = skip, else computed alpha
  const pSz=new Float32Array(N_P);     // computed size

  for(let i=0;i<N_P;i++){
    pTheta[i]=Math.random()*Math.PI*2;
    pPhi[i]  =Math.acos(2*Math.random()-1);
    pPhi0[i] =pPhi[i];
    pDrift[i]=(Math.random()-0.5)*0.05;
    pPhase[i]=Math.random()*Math.PI*2;
    pTurbAmp[i] =0.025+Math.random()*0.065;
    pTurbFreq[i]=0.12+Math.random()*0.38;
    pPhiAmp[i]  =0.02+Math.random()*0.07;
    pPhiFreq[i] =0.08+Math.random()*0.26;
    pPhiPh[i]   =Math.random()*Math.PI*2;
    pSizeVar[i]  =0.75+Math.random()*0.50;
    pBrightVar[i]=0.80+Math.random()*0.35;
    pCullThresh[i]=Math.random();
  }

  // Inner volume orbs -- very subtle z-depth cue: a slower-rotating layer of
  // small, dim orbs drifting inside the shell (not on the face), for parallax
  const N_VOL=5;
  const volTheta=new Float32Array(N_VOL);
  const volPhi=new Float32Array(N_VOL);
  const volRf=new Float32Array(N_VOL);   // radius fraction inside the shell
  const volPhase=new Float32Array(N_VOL);
  for(let i=0;i<N_VOL;i++){
    volTheta[i]=Math.random()*Math.PI*2;
    volPhi[i]  =Math.acos(2*Math.random()-1);
    volRf[i]   =0.22+Math.random()*0.42;
    volPhase[i]=Math.random()*Math.PI*2;
  }

  let rotY=0;
  let hoverX=0, hoverY=0; // idle off-axis wander, set each frame
  const rotX=0.24;
  let dynRotX=rotX; // base rotX plus this frame's state-driven wobble
  const BASE_SPIN=0.64;
  let energy=0;
  let speechPulse=0, speechPulseV=0, speechPulseTgt=0;
  // Squash and stretch + anticipation -- a brief compress-the-opposite-way
  // dip (phase 1) plays before the main stretch (phase 2), classic
  // anticipate-then-act, instead of the reaction snapping straight in
  let squash=0, squashV=0, squashTgt=0;
  let reactPhase=0, reactTimer=0, reactStrength=0, reactAntDur=0.085;
  // Owner: "if it's going to pulse wide, I want the squash and stretch to
  // precede the energetic pulse, timed up together" -- energyBurst is held
  // back and only actually added to `energy` (the particle widen/brighten
  // drive) once the anticipation dip finishes and the stretch pop begins,
  // instead of landing in the same frame as the dip.
  let pendingEnergy=0;
  function triggerReaction(strength,antDur,energyBurst){
    reactStrength=strength;
    reactAntDur=antDur||0.085;
    reactPhase=1; reactTimer=0;
    squashTgt=-0.065*strength;
    if(energyBurst) pendingEnergy+=energyBurst;
  }
  let speechRings=[];
  const RING_LIFE=1.05;
  function spawnRing(amp){
    speechRings.push({age:0,amp:amp});
    if(speechRings.length>4) speechRings.shift();
  }

  // ----------------------------------------------------------------
  // Demo modes
  // ----------------------------------------------------------------
  let demoMode=null;
  let demoTimer=0;
  const TALK_PHRASE='hello nova i am speaking to you today how are you feeling right now oh wow amazing';

  // Shared by the talk demo and typed input: one unit {v,dur} is "live" at
  // a time, held for its own real duration, then the next is popped
  let visemeQueue=[];
  let qUnitDur=0, qUnitElapsed=0;
  function enqueueText(text){
    const seq=textToVisemeSequence(text);
    for(const u of seq) visemeQueue.push(u);
    if(visemeQueue.length>120) visemeQueue.splice(0,visemeQueue.length-120);
    const words=String(text).toLowerCase().split(/\s+/).filter(Boolean);
    for(const w of words){
      const clean=w.replace(/[^a-z]/g,'');
      if(EMO_WORD_TRIGGERS[clean]){ setChildEmotion(EMO_WORD_TRIGGERS[clean]); break; }
    }
    // Multi-word imprint names span word boundaries, and this function is
    // typically called with just the one word that was flushed -- scan a
    // short rolling window of recent words, not only this call's text
    for(const w of words) imprintRecentWords.push(w.replace(/[^a-z]/g,''));
    if(imprintRecentWords.length>8) imprintRecentWords.splice(0,imprintRecentWords.length-8);
    scanForImprint(imprintRecentWords.join(' '));
  }

  function setDemo(mode){
    if(demoMode===mode){demoMode=null;updateBtns();return;}
    demoMode=mode; demoTimer=0;
    if(mode!=='talk'){ visemeQueue=[]; qUnitDur=0; }
    if(mode==='calm'){bsIdx=0;bsT=0;energy=0;}
    if(mode==='react'){triggerReaction(1.3,null,1.6);}
    updateBtns();
  }
  function updateBtns(){
    ['talk','react','calm'].forEach(m=>{
      const b=document.getElementById('btn-'+m);
      if(b){
        b.classList.toggle('active',demoMode===m);
        const p2=getPalette(coherence/100);
        b.style.borderColor=demoMode===m?_rgb(p2.cr):'';
        b.style.color=demoMode===m?_rgb(p2.cr):'';
      }
    });
  }
  ['talk','react','calm'].forEach(m=>{
    const b=document.getElementById('btn-'+m);
    if(b) b.addEventListener('click',()=>setDemo(m));
  });

  // ----------------------------------------------------------------
  // Drawing helpers
  // ----------------------------------------------------------------

  // Pulsing red ambient glow when coherence is low (decoherence signal)
  function drawDecoherenceGlow(coh01,t){
    if(coh01>0.55) return;
    const red=Math.max(0,(0.55-coh01)/0.55);
    const freq=0.8+(1-coh01)*3.5;
    const pulse=0.5+0.5*Math.sin(t*freq);
    const ga=red*pulse*0.40;
    ctx.save();
    ctx.globalCompositeOperation='screen';
    const dg=ctx.createRadialGradient(CX,CY,R*0.5,CX,CY,R*1.9);
    dg.addColorStop(0,   `rgba(80,0,0,0)`);
    dg.addColorStop(0.35,`rgba(180,10,0,${(ga*0.3).toFixed(3)})`);
    dg.addColorStop(0.65,`rgba(220,20,0,${ga.toFixed(3)})`);
    dg.addColorStop(0.85,`rgba(160,8,0,${(ga*0.4).toFixed(3)})`);
    dg.addColorStop(1,   `rgba(80,0,0,0)`);
    ctx.beginPath(); ctx.arc(CX,CY,R*1.9,0,Math.PI*2);
    ctx.fillStyle=dg; ctx.fill();
    ctx.restore();
  }

  // Speech rings -- pooled, soft-falloff ripples expanding well past the rim.
  // Each phoneme spawns its own ring so rapid speech layers several at once.
  function drawSpeechRings(coh01,p){
    for(const r of speechRings){
      const prog=r.age/RING_LIFE;
      const rr=R*(1+prog*0.95);
      // Fast smooth attack, slow smooth release -- a clear ease in/out
      // instead of snapping straight to full brightness
      let env;
      if(prog<0.22){ env=Math.sin((prog/0.22)*Math.PI*0.5); }
      else { const p2=(prog-0.22)/(1-0.22); env=Math.cos(p2*Math.PI*0.5); }
      const fade=env*r.amp;
      if(fade<0.02) continue;
      ctx.save();
      ctx.globalCompositeOperation='screen';
      const sg=ctx.createRadialGradient(CX,CY,rr*0.45,CX,CY,rr*1.65);
      sg.addColorStop(0,   _rgba(p.cl,0));
      sg.addColorStop(0.30,_rgba(p.cl,fade*0.10));
      sg.addColorStop(0.55,_rgba(p.cl,fade*0.38));
      sg.addColorStop(0.78,_rgba(p.cl,fade*0.14));
      sg.addColorStop(1,   _rgba(p.cl,0));
      ctx.beginPath(); ctx.arc(CX,CY,rr*1.65,0,Math.PI*2);
      ctx.fillStyle=sg; ctx.fill();
      ctx.restore();
    }
  }

  // Imprint pulse -- fires when speech/typed text names a real canon fetter
  // (an "imprint"). A soft internal color wash in that fetter's chakra
  // color, subtle by design -- a tell, not a flare.
  function drawChakraPulses(){
    for(const cp of chakraPulses){
      const prog=cp.age/CHAKRA_PULSE_LIFE;
      let env;
      if(prog<0.18){ env=Math.sin((prog/0.18)*Math.PI*0.5); }
      else { const p2=(prog-0.18)/(1-0.18); env=Math.cos(p2*Math.PI*0.5); }
      const al=env*0.22;
      if(al<0.01) continue;
      ctx.save();
      ctx.globalCompositeOperation='screen';
      const g=ctx.createRadialGradient(CX,CY,R*0.15,CX,CY,R*1.55);
      g.addColorStop(0,   _rgba(cp.color,al*0.55));
      g.addColorStop(0.45,_rgba(cp.color,al*0.95));
      g.addColorStop(0.75,_rgba(cp.color,al*0.35));
      g.addColorStop(1,   _rgba(cp.color,0));
      ctx.beginPath(); ctx.arc(CX,CY,R*1.55,0,Math.PI*2);
      ctx.fillStyle=g; ctx.fill();
      ctx.restore();
    }
  }

  // Atmospheric aura -- wide soft bloom behind sphere (reference quality)
  function drawAura(coh01,p){
    ctx.save();
    ctx.globalCompositeOperation='screen';
    const ag=ctx.createRadialGradient(CX,CY,R*0.72,CX,CY,R*2.6);
    ag.addColorStop(0,   _rgba(p.m1,0.08+coh01*0.14));
    ag.addColorStop(0.22,_rgba(p.m1,0.03+coh01*0.05));
    ag.addColorStop(0.55,_rgba(p.m1,0.007));
    ag.addColorStop(1,   _rgba(p.m1,0));
    ctx.beginPath(); ctx.arc(CX,CY,R*2.6,0,Math.PI*2);
    ctx.fillStyle=ag; ctx.fill();
    ctx.restore();
  }

  // Fine, multi-octave fractal noise (5 octaves, each roughly doubling
  // frequency and halving amplitude) -- the SQ register: a delicate,
  // detailed texture, distinct from DQ's coarse 3-wave wobble below
  function fbmEdge(ang,t){
    let n=0,amp=0.5,freq=7,norm=0;
    for(let o=0;o<5;o++){
      n+=Math.sin(ang*freq+t*(1.1+o*0.4)+o*2.7)*amp;
      norm+=amp;
      amp*=0.5; freq*=2.07;
    }
    return n/norm;
  }

  // Particle sphere -- 5-tier batched rendering with shadowBlur
  // Both hemispheres: far side dim (creates see-through depth), near side bright
  const N_HALO=22;
  const haloAngle=new Float32Array(N_HALO);
  const haloRad=new Float32Array(N_HALO);
  const haloPhase=new Float32Array(N_HALO);
  for(let i=0;i<N_HALO;i++){
    haloAngle[i]=-Math.PI/2+(Math.random()-0.5)*0.95;
    haloRad[i]=1.26+Math.random()*0.10;
    haloPhase[i]=Math.random()*Math.PI*2;
  }
  function drawCrownHalo(coh01,pT,t){
    const inten=Math.max(0,(coh01-0.97)/0.03);
    if(inten<=0.01) return;
    ctx.save();
    ctx.globalCompositeOperation='screen';
    for(let i=0;i<N_HALO;i++){
      const tw=0.5+0.5*Math.sin(t*2.2+haloPhase[i]);
      const a=inten*tw*0.55;
      if(a<0.02) continue;
      const x=CX+Math.cos(haloAngle[i])*R*haloRad[i];
      const y=CY+Math.sin(haloAngle[i])*R*haloRad[i];
      ctx.fillStyle=_rgba(pT.cl,a);
      ctx.fillRect(x-1.1,y-1.1,2.2,2.2);
    }
    ctx.restore();
  }

  // Decoherence: tiny rainbow fragments right at the jagged edge's own
  // break points, same fixed red-bottom/lavender-top mapping as the real
  // harmonic radiance -- "the color trying to hold together and failing"
  // Owner: "chunky block, it has to be thin kind of circular band, as if
  // it's emanating out from the collapsing field" -- replaces the scattered
  // dot/fragment version with thin conic-gradient ring bands (same
  // technique and same red-bottom/lavender-top mapping as the real
  // harmonic radiance) that continuously expand outward from the rim and
  // fade as they go, like ripples the field can no longer hold onto.
  // Owner: "give it a little warmth so it's picking up the colors of the
  // coherence" -- each pure spectral hue stop gets blended a bit toward
  // the character's own current coherence-tinted color, instead of being
  // a flat rainbow pasted on top with no relation to the rest of it
  function warmHarmStops(satPct,lightPct,alphaScale,warmColor,warmAmt){
    const stops=[];
    for(let i=0;i<=12;i++){
      const hue=i<=6 ? (i/6)*HARM_LAVENDER : ((12-i)/6)*HARM_LAVENDER;
      const rgb=colorMix(_hsl2rgb(hue,satPct/100,lightPct/100),warmColor,warmAmt);
      stops.push([i/12,`rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alphaScale.toFixed(3)})`]);
    }
    return stops;
  }
  function drawEdgeRainbowBreakup(coh01,t,p){
    const rimDistort=1-coh01;
    if(rimDistort<0.12 || !ctx.createConicGradient) return;
    const drive=Math.min(1,(rimDistort-0.12)/0.68);
    // Owner: "as its coherence gets lower, its rainbow saturation -- the
    // rings on the outside -- should intensify towards its edges." A
    // second quadratic term concentrated at the low end, on top of the
    // base linear drive, so the rings visibly thicken/brighten/saturate
    // further as CQ keeps falling instead of plateauing once they appear.
    const lowDrive=Math.pow(Math.max(0,(0.50-coh01)/0.50),2);
    ctx.save();
    ctx.globalCompositeOperation='screen';
    const N_RINGS=3;
    const N_SEG=96;
    for(let i=0;i<N_RINGS;i++){
      const phase=((t*0.14)+i/N_RINGS)%1;
      const bandR=R*(1.20+phase*0.60);
      const fade=Math.sin(phase*Math.PI);
      const al=Math.min(1,drive*fade*0.60+lowDrive*fade*0.30);
      if(al<0.025) continue;
      // Owner: "the rainbow should be almost like a jaggedy sine wave, not
      // smooth -- the more decoherence, the more jaggedy and jittery and
      // broken, and thin and frail." A perfect circle at rimDistort=0,
      // multi-octave sine distortion on the radius growing with it, strokes
      // getting thinner (not thicker) as it worsens, and at high distortion
      // the path drops segments outright so it reads as fragmenting rather
      // than just wobbling.
      const jagAmp=rimDistort*0.055;
      const lineW=Math.max(0.6,R*0.020*(1-rimDistort*0.55));
      ctx.beginPath();
      let started=false;
      for(let s=0;s<=N_SEG;s++){
        const ang=(s/N_SEG)*Math.PI*2;
        if(rimDistort>0.45){
          const breakN=Math.sin(ang*13+i*3.1+t*0.7)*0.5+0.5;
          if(breakN<(rimDistort-0.45)*0.64){ started=false; continue; }
        }
        const n=Math.sin(ang*7+t*2.6+i*1.7)*0.5+Math.sin(ang*17-t*3.9+i*0.9)*0.3+Math.sin(ang*31+t*5.3)*0.2;
        const rr=bandR*(1+n*jagAmp);
        const x=CX+Math.cos(ang)*rr, y=CY+Math.sin(ang)*rr;
        if(!started){ ctx.moveTo(x,y); started=true; } else { ctx.lineTo(x,y); }
      }
      const cg=ctx.createConicGradient(HARM_START,CX,CY);
      for(const[f,col] of warmHarmStops(Math.min(100,95+lowDrive*5),68,al,p.cl,0.22)) cg.addColorStop(f,col);
      ctx.strokeStyle=cg;
      ctx.lineWidth=lineW;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawParticles(t,coh01,p){
    const cosRX=Math.cos(dynRotX),sinRX=Math.sin(dynRotX);
    const c0=p.m1[0],c1=p.m1[1],c2=p.m1[2];
    const r0=p.cl[0],r1=p.cl[1],r2=p.cl[2];

    // Project all particles -- directional rim lighting (reference-matched)
    // Light direction rotates with head yaw -- makes a turn unmistakable
    // even though the particle cloud's silhouette alone barely changes
    const _lAng=Math.atan2(0.78,-0.60)+headYaw*1.3;
    const _lMag=Math.hypot(-0.60,0.78);
    const LX=Math.cos(_lAng)*_lMag, LY=Math.sin(_lAng)*_lMag;
    // DQ register: the real total-shadow score, 0 at dq=0, 1 at dq=100.
    // Independent of coh01 on purpose -- a person can be high coherence and
    // still carry real shadow weight, or low coherence and clear, so this
    // must never be derived from coherence (see the dq declaration above).
    const decoDistort=Math.min(1,dq/100);
    // visible proof the character is carrying real shadow weight, same read
    // as the coarse edgeN wobble right above it
    const fracDrive=decoDistort;
    // Coherent = clean and sparse; decoherent = full and chaotic -- at
    // CQ 100 roughly half the particles are culled, at CQ 0 all of them show
    const particleVisFrac=1-coh01*0.50;
    for(let i=0;i<N_P;i++){
      if(pCullThresh[i]>particleVisFrac){ pA[i]=-1; continue; }
      const th=pTheta[i]+rotY+headYaw;
      const ph=pPhi[i];
      const lx=Math.sin(ph)*Math.cos(th);
      const ly=Math.cos(ph);
      const lz=Math.sin(ph)*Math.sin(th);
      const nx=lx;
      const ny=ly*cosRX-lz*sinRX;
      const nz=ly*sinRX+lz*cosRX;
      const rim=1-Math.abs(nz);
      // Edge distortion -- the surface destabilizes as real DQ rises,
      // concentrated at the silhouette (rim) where the boundary reads
      const edgeN=decoDistort>0.02 ? (Math.sin(th*5+t*2.3+i*0.31)*0.55+Math.sin(th*11-t*3.7+i*0.17)*0.30+Math.sin(th*23+t*1.9)*0.15) : 0;
      const sqFracP=fracDrive>0.02 ? fbmEdge(th+i*0.0007,t) : 0; // fine fractal register
      const rDist=R*(1+edgeN*0.06*decoDistort*rim+sqFracP*0.042*fracDrive*rim);
      pSx[i]=CX+nx*rDist;
      pSy[i]=CY+ny*rDist;
      const depth=(nz+1)*0.5;
      const sxN=(pSx[i]-CX)/R, syN=(pSy[i]-CY)/R;
      const litDot=sxN*LX+syN*LY;
      const dirBoost=Math.max(0,litDot)*0.55;
      const farFactor=0.13+0.87*depth;
      const twk=0.62+0.38*Math.sin(pPhase[i]*2.9+t*1.6*twinkleC+i*0.07);
      const eFactor=Math.min(1.22,1+energy*0.10+speechPulse*0.06+(bsGlow-1)*0.18+vignetteGlow*0.14);
      const a=Math.min(0.98,(rim*0.80+dirBoost*rim+depth*0.18)*farFactor*twk*(0.40+coh01*0.60)*eFactor);
      pA[i]=Math.min(0.98,a*pBrightVar[i]);
      pSz[i]=(0.50+rim*1.65+depth*0.45+dirBoost*rim*0.70+energy*rim*0.85)*pSizeVar[i];
    }

    // 5-tier batched path rendering
    // Each tier = single beginPath + N arcs + one fill = fast
    // Shadow is computed once for the entire fill, giving per-tier glow
    const TIERS=[
      {lo:0.03,hi:0.15,ga:0.10,sBlur:0, color:[c0,c1,c2]},  // dim far shell
      {lo:0.15,hi:0.28,ga:0.21,sBlur:0, color:[c0,c1,c2]},  // mid
      {lo:0.28,hi:0.44,ga:0.36,sBlur:3, color:[c0,c1,c2]},  // mid-bright
      {lo:0.44,hi:0.63,ga:0.53,sBlur:5, color:[r0,r1,r2]},  // near/rim
      {lo:0.63,hi:1.00,ga:0.78,sBlur:8, color:[r0,r1,r2]},  // brightest rim
    ];
    for(const tier of TIERS){
      const[cr,cg,cb]=tier.color;
      ctx.save();
      ctx.globalAlpha=tier.ga;
      if(tier.sBlur>0){
        ctx.shadowBlur=tier.sBlur*(1+energy*0.10);
        ctx.shadowColor=`rgb(${cr},${cg},${cb})`;
      }
      ctx.fillStyle=`rgb(${cr},${cg},${cb})`;
      ctx.beginPath();
      let any=false;
      for(let i=0;i<N_P;i++){
        if(pA[i]<tier.lo||pA[i]>=tier.hi) continue;
        const sz=pSz[i];
        ctx.moveTo(pSx[i]+sz,pSy[i]);
        ctx.arc(pSx[i],pSy[i],sz,0,Math.PI*2);
        any=true;
      }
      if(any) ctx.fill();
      ctx.restore();
    }
  }

  // Inner volume orbs -- very subtle, slower-rotating depth layer inside the shell
  function drawVolumeOrbs(t,coh01,p){
    const cosRX=Math.cos(dynRotX),sinRX=Math.sin(dynRotX);
    for(let i=0;i<N_VOL;i++){
      const th=volTheta[i]+rotY*0.55+headYaw*0.55;
      const ph=volPhi[i];
      const lx=Math.sin(ph)*Math.cos(th);
      const ly=Math.cos(ph);
      const lz=Math.sin(ph)*Math.sin(th);
      const nx=lx, ny=ly*cosRX-lz*sinRX, nz=ly*sinRX+lz*cosRX;
      const rf=volRf[i]+0.04*Math.sin(t*0.26+volPhase[i]);
      const sx=CX+nx*R*rf, sy=CY+ny*R*rf;
      const depth=(nz+1)*0.5;
      const twk=0.55+0.45*Math.sin(t*0.5+volPhase[i]*2.2);
      const alpha=(0.08+0.17*depth)*twk*(0.35+coh01*0.65);
      const size=R*(0.016+0.013*depth);
      bokehOrb(sx,sy,size,0.5+depth*0.25,alpha,p);
    }
  }

  // Harmonic color radiance -- a subtle iridescent sheen that only emerges
  // as coherence approaches full. Faint hints 60-92%, ramping bright 92-100%.
  function harmonicIntensity(coh01){
    if(coh01<0.60) return 0;
    if(coh01<0.92){
      const u=(coh01-0.60)/(0.92-0.60);
      return u*u*0.14;
    }
    const u=(coh01-0.92)/(1-0.92);
    return 0.14+u*u*0.86;
  }
  // Fixed vertical rainbow -- red at the bottom pole, lavender at the top,
  // mirrored up both sides (same shape as the real chakra column: root-red
  // low, crown-lavender high). Conic gradient stop fraction 0 sits at
  // startAngle=PI/2 (canvas-down = visually the bottom); fraction 0.5 sits
  // at the opposite angle (the top). No more time-based rotation of either
  // the start angle or the per-stop hue -- that was incompatible with
  // "red's on the bottom" ever actually holding true.
  const HARM_LAVENDER=278;
  const HARM_START=Math.PI/2;
  function harmStops(satPct,lightPct,alphaScale){
    const stops=[];
    for(let i=0;i<=12;i++){
      const hue=i<=6 ? (i/6)*HARM_LAVENDER : ((12-i)/6)*HARM_LAVENDER;
      stops.push([i/12,`hsla(${hue.toFixed(1)},${satPct}%,${lightPct}%,${alphaScale.toFixed(3)})`]);
    }
    return stops;
  }
  function drawHarmonicRadiance(coh01,t){
    const inten=harmonicIntensity(coh01);
    if(inten<=0.004 || !ctx.createConicGradient) return;
    ctx.save();
    ctx.globalCompositeOperation='screen';
    // Bleed -- wide, very soft, lets the iridescent hue breathe out into
    // the surrounding aura glow instead of staying confined to a thin ring
    const cgB=ctx.createConicGradient(HARM_START, CX, CY);
    for(const[f,col] of harmStops(100,70,inten*0.17)) cgB.addColorStop(f,col);
    ctx.beginPath();
    ctx.arc(CX,CY,R*2.1,0,Math.PI*2);
    ctx.arc(CX,CY,R*0.70,0,Math.PI*2,true);
    ctx.fillStyle=cgB; ctx.fill('evenodd');
    // Outer band
    const cg1=ctx.createConicGradient(HARM_START, CX, CY);
    for(const[f,col] of harmStops(100,74,inten*0.52)) cg1.addColorStop(f,col);
    ctx.beginPath();
    ctx.arc(CX,CY,R*1.10,0,Math.PI*2);
    ctx.arc(CX,CY,R*0.95,0,Math.PI*2,true);
    ctx.fillStyle=cg1; ctx.fill('evenodd');
    // Inner band
    const cg2=ctx.createConicGradient(HARM_START, CX, CY);
    for(const[f,col] of harmStops(100,70,inten*0.36)) cg2.addColorStop(f,col);
    ctx.beginPath();
    ctx.arc(CX,CY,R*1.02,0,Math.PI*2);
    ctx.arc(CX,CY,R*0.90,0,Math.PI*2,true);
    ctx.fillStyle=cg2; ctx.fill('evenodd');
    ctx.restore();
  }

  // Rim ring -- crisp stroke + soft corona + directional spot (reference-matched)
  function drawRim(coh01,p,t){
    ctx.save();
    ctx.globalCompositeOperation='lighter';
    // Main corona -- peak at sphere surface R, capped so it never goes solid white
    const rO=R*1.18*rimSpread, rI=R*0.88*rimSpread;
    const rg=ctx.createRadialGradient(CX,CY,rI,CX,CY,rO);
    rg.addColorStop(0,   _rgba(p.cl,0));
    rg.addColorStop(0.42,_rgba(p.cl,Math.min(0.50,0.20+coh01*0.22+energy*0.03+speechPulse*0.02)));
    rg.addColorStop(0.72,_rgba(p.cl,0.07+coh01*0.08));
    rg.addColorStop(1,   _rgba(p.cl,0));
    ctx.beginPath(); ctx.arc(CX,CY,rO,0,Math.PI*2);
    ctx.fillStyle=rg; ctx.fill();
    // Directional boost spot at bottom-left
    const spotX=CX-R*0.62, spotY=CY+R*0.70;
    const sg=ctx.createRadialGradient(spotX,spotY,0,spotX,spotY,R*0.90);
    sg.addColorStop(0,   _rgba(p.cl,Math.min(0.32,0.16+coh01*0.10+energy*0.02)));
    sg.addColorStop(0.4, _rgba(p.cl,0.08+coh01*0.05));
    sg.addColorStop(1,   _rgba(p.cl,0));
    ctx.beginPath(); ctx.arc(CX,CY,rO,0,Math.PI*2);
    ctx.fillStyle=sg; ctx.fill();
    ctx.restore();
    // Crisp stroke at the sphere radius -- distorts into a jagged, unstable
    // edge as real DQ rises, settling to a perfect circle at dq=0. Same real
    // DQ register as drawParticles' decoDistort, independent of coherence --
    // see the dq declaration above for why this must never derive from coh01.
    ctx.save();
    ctx.globalCompositeOperation='screen';
    const rimDistort=Math.min(1,dq/100);
    const rimFracDrive=rimDistort;
    if(rimDistort>0.02 || rimFracDrive>0.02){
      const N=140;
      ctx.beginPath();
      for(let si=0;si<=N;si++){
        const ang=(si/N)*Math.PI*2;
        const n=Math.sin(ang*5+t*2.3)*0.55+Math.sin(ang*11-t*3.7)*0.30+Math.sin(ang*23+t*1.9)*0.15;
        const fine=fbmEdge(ang,t);
        const rr=R*(1+n*0.05*rimDistort+fine*0.038*rimFracDrive);
        const x=CX+Math.cos(ang)*rr, y=CY+Math.sin(ang)*rr;
        if(si===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.closePath();
    } else {
      ctx.beginPath(); ctx.arc(CX,CY,R,0,Math.PI*2);
    }
    ctx.strokeStyle=_rgba(p.cl,Math.min(0.68,0.20+coh01*0.40+energy*0.04));
    ctx.lineWidth=1.4+coh01*1.2;
    ctx.stroke();
    ctx.restore();
  }

  // Bokeh orb -- 4-pass HDR bloom matching reference video quality
  // Uses lighter (additive) + screen blend for HDR overexposure at core
  function bokehOrb(sx,sy,r,bright,alpha,p){
    if(alpha<0.03||r<0.5) return;
    const ba=Math.min(1,bright*alpha);
    ctx.save();
    ctx.globalCompositeOperation='lighter';
    // Pass 1: very wide faint bloom (creates the environmental light spill)
    const g1=ctx.createRadialGradient(sx,sy,0,sx,sy,r*4.2);
    g1.addColorStop(0,  _rgba(p.m1,0.07*ba));
    g1.addColorStop(0.3,_rgba(p.m1,0.03*ba));
    g1.addColorStop(1,  _rgba(p.m1,0));
    ctx.beginPath(); ctx.arc(sx,sy,r*4.2,0,Math.PI*2); ctx.fillStyle=g1; ctx.fill();
    // Pass 2: mid bloom (the main soft orb shape -- matches reference)
    const g2=ctx.createRadialGradient(sx,sy,0,sx,sy,r*2.0);
    g2.addColorStop(0,  _rgba(p.cl, 0.30*ba));
    g2.addColorStop(0.3,_rgba(p.cl, 0.16*ba));
    g2.addColorStop(0.7,_rgba(p.m1, 0.05*ba));
    g2.addColorStop(1,  _rgba(p.m1, 0));
    ctx.beginPath(); ctx.arc(sx,sy,r*2.0,0,Math.PI*2); ctx.fillStyle=g2; ctx.fill();
    // Pass 3: tight inner glow (concentrates energy at center)
    const g3=ctx.createRadialGradient(sx,sy,0,sx,sy,r*0.90);
    g3.addColorStop(0,  _rgba(p.cr, 0.60*ba));
    g3.addColorStop(0.4,_rgba(p.cl, 0.30*ba));
    g3.addColorStop(1,  _rgba(p.cl, 0));
    ctx.beginPath(); ctx.arc(sx,sy,r*0.90,0,Math.PI*2); ctx.fillStyle=g3; ctx.fill();
    ctx.restore();
    // Pass 4: white-hot core (screen blend -- simulates sensor overexposure)
    ctx.save();
    ctx.globalCompositeOperation='screen';
    const g4=ctx.createRadialGradient(sx,sy,0,sx,sy,r*0.42);
    g4.addColorStop(0, `rgba(255,255,255,${(0.92*ba).toFixed(2)})`);
    g4.addColorStop(0.4,_rgba(p.cr,0.55*ba));
    g4.addColorStop(1,  _rgba(p.cr,0));
    ctx.beginPath(); ctx.arc(sx,sy,r*0.42,0,Math.PI*2); ctx.fillStyle=g4; ctx.fill();
    ctx.restore();
  }

  // Dims the particle field under an orb so it reads as a distinct light, not noise
  function clearOrbSpace(sx,sy,r){
    ctx.save();
    ctx.globalCompositeOperation='multiply';
    const cg=ctx.createRadialGradient(sx,sy,0,sx,sy,r*2.8);
    cg.addColorStop(0,   'rgba(118,118,128,0.50)');
    cg.addColorStop(0.5, 'rgba(148,148,157,0.72)');
    cg.addColorStop(1,   'rgba(255,255,255,1)');
    ctx.beginPath(); ctx.arc(sx,sy,r*2.8,0,Math.PI*2);
    ctx.fillStyle=cg; ctx.fill();
    ctx.restore();
  }

  // Face orbs -- always screen-forward while particle shell rotates around them
  // A faint brow/eyelid-tension line above each eye. dir=+1 for the left
  // eye (nose is toward +x), dir=-1 for the right. browPinch>0 furrows the
  // inner end down toward the nose (anger/disgust); <0 lifts and arches it
  // (fear/shock). Always a little present, not just on an emotion trigger.
  // Thicker stroke but a lower, softer alpha ceiling -- a wide gentle
  // indication of brow tension rather than a hard, graphic line
  function drawBrow(ex,ey,eyeRadius,dir,pinch,eyeAl,p){
    const al=Math.min(0.32,0.05+Math.abs(pinch)*0.30)*eyeAl;
    if(al<0.010) return;
    const w=eyeRadius*1.22;
    const baseY=ey-eyeRadius*1.55;
    const innerX=ex+dir*w*0.55, outerX=ex-dir*w*0.55;
    const innerY=baseY+pinch*eyeRadius*0.55;
    const outerY=baseY-pinch*eyeRadius*0.12;
    const midY=baseY-(pinch<0?-pinch*eyeRadius*0.55:-pinch*eyeRadius*0.20);
    ctx.save();
    ctx.globalCompositeOperation='screen';
    ctx.beginPath();
    ctx.moveTo(innerX,innerY);
    ctx.quadraticCurveTo(ex,midY,outerX,outerY);
    ctx.strokeStyle=`rgba(42,40,37,${al.toFixed(3)})`;
    ctx.lineWidth=eyeRadius*0.231;
    ctx.lineCap='round';
    ctx.stroke();
    ctx.restore();
  }

  // A small bright glint, not a full pupil/iris circle -- a touch of fire
  // orange blended in, "passion", more vivid the more coherent the
  // character is and duller/grayer the less coherent.
  function drawPupilHighlight(sx,sy,r,bright,alpha,ox,oy,coh01,p){
    if(alpha<0.03||r<0.5) return;
    const px=sx+ox, py=sy+oy;
    const ba=Math.min(1,bright*alpha);
    const gray=[118,116,114], fire=[255,120,24];
    const fc=[0,1,2].map(i=>Math.round(gray[i]+(fire[i]-gray[i])*coh01));
    // The pupil -- a soft colored glow, fire-orange "passion", more vivid
    // the more coherent the character is
    ctx.save();
    ctx.globalCompositeOperation='screen';
    const rr=r*0.46*1.2;
    const g=ctx.createRadialGradient(px,py,0,px,py,rr);
    g.addColorStop(0,    `rgba(255,255,255,${Math.min(1,0.85*1.2*ba).toFixed(2)})`);
    g.addColorStop(0.40, `rgba(${fc[0]},${fc[1]},${fc[2]},${Math.min(1,0.75*1.2*ba).toFixed(2)})`);
    g.addColorStop(1,    `rgba(${fc[0]},${fc[1]},${fc[2]},0)`);
    ctx.beginPath(); ctx.arc(px,py,rr,0,Math.PI*2);
    ctx.fillStyle=g; ctx.fill();
    ctx.restore();
    // The highlight -- a crisp, hard-edged catchlight on top of the pupil,
    // offset toward the upper-left like a real specular reflection, not a
    // soft gradient blob. Parallax: it rides only a fraction of the gaze
    // offset that the pupil glow fully tracks -- a real catchlight is a
    // reflection of something external, so it lags behind the eye's own
    // movement instead of translating in lockstep with it.
    // Owner: "20% more parallax, 15% smaller, move it left -- it's sitting
    // directly over the pupil, I want it at the pupil's upper-left corner."
    const hlR=r*0.19*3*0.8*0.85;
    const hpx=sx+ox*0.28, hpy=sy+oy*0.28;
    const hx=hpx-r*0.46, hy=hpy-r*0.40;
    // Owner: "a slightly dark, almost like a drop shadow behind the white
    // part, at like 10% opacity" -- a soft dark disc offset down-right
    // (opposite the highlight's own up-left offset), drawn first so the
    // white catchlight reads as sitting slightly off the surface
    ctx.save();
    ctx.globalCompositeOperation='multiply';
    ctx.globalAlpha=Math.min(0.10,0.10*ba);
    ctx.fillStyle='rgb(20,18,22)';
    ctx.beginPath(); ctx.arc(hx+hlR*0.35,hy+hlR*0.35,hlR*1.25,0,Math.PI*2); ctx.fill();
    ctx.restore();
    // Owner: "keep the eye highlight square with rounded edges" -- a
    // rounded-rect catchlight instead of a circle, a deliberately more
    // graphic/designed specular shape
    ctx.save();
    ctx.globalCompositeOperation='screen';
    ctx.globalAlpha=Math.min(1,0.95*ba);
    ctx.fillStyle='rgb(255,255,255)';
    ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(hx-hlR,hy-hlR,hlR*2,hlR*2,hlR*0.34);
    else ctx.rect(hx-hlR,hy-hlR,hlR*2,hlR*2);
    ctx.fill();
    ctx.globalAlpha=Math.min(0.45,0.32*ba);
    ctx.beginPath(); ctx.arc(hx,hy,hlR*1.7,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  // Owner, holding up a sheet of cartoon eye-shape references: "there's
  // something in the eyes I wish were more expressive, they're always
  // just circular... we're missing the moon shape up and down, or flat."
  // Replaces the old approach (a dark crescent SHADOW painted over a
  // circle that never stopped being a circle) with an actual reshaping of
  // the glow's own silhouette -- a lens between two independently curved
  // lid lines, same construction as a hand-drawn cartoon eye. topAmt=1
  // droops the top lid fully down to center ("moon" opening downward,
  // sleepy/half-lidded); botAmt=1 rises the bottom lid fully up to center
  // (the Duchenne closed-smile crescent); both high together converge to
  // a thin slit on their own, with no separate "flat" case needed.
  // Owner: "the eyes are now too almond, make them a bit more round."
  // Angular radius modulation instead of two curves meeting at a sharp
  // corner vertex -- the corners (left/right, where top/bottom influence
  // both hit zero) stay at the full circular radius, rounded by
  // construction, while only the top/bottom itself pulls in toward lid
  // closure. Reads as a circle with its top and/or bottom dented in,
  // not a pointed almond.
  function eyeShapeClip(ex,ey,eyeRadius,topAmt,botAmt,topBias){
    const topA=Math.min(0.94,topAmt), botA=Math.min(0.94,botAmt);
    const bias=(topBias||0)*eyeRadius*0.12;
    const N=40;
    ctx.beginPath();
    for(let i=0;i<=N;i++){
      const ang=(i/N)*Math.PI*2;
      const s=Math.sin(ang);
      const topInfluence=Math.max(0,-s);
      const botInfluence=Math.max(0,s);
      const pull=topA*topInfluence+botA*botInfluence;
      const rr=eyeRadius*(1-pull*0.90);
      const x=ex+Math.cos(ang)*rr+bias*topInfluence;
      const y=ey+Math.sin(ang)*rr;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.clip();
  }

  // A real eyelid, not just alpha-dip + squash -- background-colored, so
  // a full blink actually hides the glow instead of flashing a thin bright
  // line. Scales in Y with how closed the eye is.
  function drawEyelid(ex,ey,eyeRadius,closedAmt,p){
    if(closedAmt<0.04) return;
    ctx.save();
    ctx.globalAlpha=Math.min(0.90,closedAmt*0.95);
    const g=ctx.createRadialGradient(ex,ey,0,ex,ey,eyeRadius*1.15);
    g.addColorStop(0,  _rgb(p.bg));
    g.addColorStop(0.8,_rgb(p.bg));
    g.addColorStop(1,  _rgba(p.bg,0));
    ctx.fillStyle=g;
    ctx.beginPath();
    ctx.ellipse(ex,ey,eyeRadius*1.15,Math.max(0.5,eyeRadius*1.3*closedAmt),0,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  function drawFaceOrbs(t,coh01,p,closed){
    // sep widens/narrows the eyes; tilt gives a subtle asymmetric head-tilt
    // read (one eye riding slightly higher). happyBob/idleTilt are a very
    // small always-on sway for a livelier, happier idle feel.
    // Round 1: eyeDrop (gaze height per mood) + jitter (micro-tremor --
    // alert trembles, focus is dead still, calm/curious drift slowly)
    const happyBob=Math.sin(t*0.95)*R*0.006*bobMul;
    const idleTilt=tilt+Math.sin(t*0.62)*0.012;
    const microX=(Math.sin(t*11.3+1.7)*0.6+Math.sin(t*17.1+0.4)*0.4)*jitter*R*0.09;
    const microY=(Math.sin(t*13.7+2.9)*0.6+Math.sin(t*19.4+1.1)*0.4)*jitter*R*0.08;
    const ELx=CX-R*(0.44+sep*0.5)+gazeX*2.2+headYaw*R*0.80+microX, ELy=CY-R*0.09+gazeY*1.6+headPitch*R*0.80-R*idleTilt*0.5+happyBob+R*eyeDrop*0.5+microY;
    const ERx=CX+R*(0.44+sep*0.5)+gazeX*2.2+headYaw*R*0.80+microX, ERy=CY-R*0.09+gazeY*1.6+headPitch*R*0.80+R*idleTilt*0.5+happyBob+R*eyeDrop*0.5+microY;
    const MXp=CX+gazeX*0.5+headYaw*R*0.50,        MYp=CY+R*0.42+headPitch*R*0.45;

    const eyeR =R*(0.095+0.090*(eyeSc-1)+energy*0.028+speechPulse*0.022);
    const eyeB =0.90+eyeSc*0.52+dil*0.22+energy*0.72+speechPulse*0.55+vignetteGlow*0.60;
    // Blink now reads as the eyelid squash below; alpha only dips gently
    const eyeAl=Math.pow(Math.max(0,1-closed*0.55),0.85);

    const pL=1+0.055*Math.sin(t*2.0);
    const pR=1+0.055*Math.sin(t*2.0+0.9);
    clearOrbSpace(ELx,ELy,eyeR*pL);
    clearOrbSpace(ERx,ERy,eyeR*pR);
    // Pupil dart offset -- how far ahead the fast pupil spring is of the
    // slower eye-cluster/head spring chasing the same target. Computed
    // before the clipped glow below, since the pupil now has to clip to
    // the same reshaped lid boundary as the glow it sits on.
    const pupOx=Math.max(-eyeR*0.45,Math.min(eyeR*0.45,(pupilX-gazeX)*1.4));
    const pupOy=Math.max(-eyeR*0.40,Math.min(eyeR*0.40,(pupilY-gazeY)*1.1));
    // sqnt (squint) and blink both flatten the eye glow vertically -- blink
    // now reads as a true eyelid closing instead of a flicker
    const squashY=Math.max(0.55,Math.min(1.35,1-sqnt*0.42))*Math.max(0.05,1-closed*0.94);
    ctx.save();
    ctx.translate(CX,CY); ctx.scale(1,squashY); ctx.translate(-CX,-CY);
    // Reshape the glow's own silhouette into a real lid-bounded eye shape
    // instead of a circle with a shadow painted on top -- lidDroopC droops
    // the top lid down (sleepy/half-lidded "moon"), cheekSquint rises the
    // bottom lid up (Duchenne closed-smile crescent); both high together
    // converge into a slit on their own (anger/extreme squint), no
    // separate case needed.
    // Owner: "add a little tint of saturated orange and gold in the eyes"
    const pEye={...p, cr:colorMix(p.cr,[255,165,40],0.24), m1:colorMix(p.m1,[255,165,40],0.24), cl:colorMix(p.cl,[255,150,25],0.24)};
    ctx.save();
    eyeShapeClip(ELx,ELy,eyeR*pL,lidDroopC,cheekSquint,+1);
    bokehOrb(ELx,ELy, eyeR*pL, eyeB, eyeAl, pEye);
    drawPupilHighlight(ELx,ELy,eyeR*pL,eyeB,eyeAl,pupOx,pupOy,coh01,p);
    ctx.restore();
    ctx.save();
    eyeShapeClip(ERx,ERy,eyeR*pR,lidDroopC,cheekSquint,-1);
    bokehOrb(ERx,ERy, eyeR*pR, eyeB*0.88, eyeAl, pEye);
    drawPupilHighlight(ERx,ERy,eyeR*pR,eyeB*0.88,eyeAl,pupOx,pupOy,coh01,p);
    ctx.restore();
    ctx.restore();
    drawEyelid(ELx,ELy,eyeR*pL,closed,p);
    drawEyelid(ERx,ERy,eyeR*pR,closed,p);
    // browAsym cocks one brow relative to the other -- a mirrored single
    // pinch value can only furrow/raise both brows together, never a smirk
    drawBrow(ELx,ELy,eyeR*pL,+1,browPinch+browAsym,eyeAl,p);
    drawBrow(ERx,ERy,eyeR*pR,-1,browPinch-browAsym,eyeAl,p);
    // Sub-orbs with organic drift matching reference cluster pattern
    const sub=eyeR*0.48;
    const dOff=R*0.055*orbPlay;
    const dx1=Math.sin(t*0.52)*dOff,     dy1=Math.cos(t*0.42)*dOff;
    const dx2=Math.sin(t*0.63+1.2)*dOff, dy2=Math.cos(t*0.55+2.1)*dOff;
    const dx3=Math.sin(t*0.44+2.4)*dOff, dy3=Math.cos(t*0.48+0.8)*dOff;
    bokehOrb(ELx+sub*0.88+dx1,ELy-sub*0.52+dy1, eyeR*0.38, eyeB*0.54, eyeAl*0.70, p);
    bokehOrb(ERx-sub*0.72+dx2,ERy+sub*0.44+dy2, eyeR*0.32, eyeB*0.44, eyeAl*0.62, p);
    bokehOrb(CX+dx3*0.5,CY-R*0.22+dy3, eyeR*0.26, eyeB*0.36, eyeAl*0.46*(0.4+coh01*0.6), p);

    // Mouth orb -- mouthW/mouthH now shape an ellipse instead of collapsing
    // into one scalar, so each viseme reads as a distinct, more natural
    // mouth shape (wide EE, round OO, thin MM/TT) rather than a pulsing dot.
    // mouthCurve (the emotion's resting smile/frown bias) keeps a faint
    // version of that curve visible even at rest, not only while talking.
    const restMouthOpen=Math.min(0.14,Math.abs(mouthCurve)*0.24);
    const mOpen=Math.max(mouthW*0.65+mouthH*0.45, restMouthOpen);
    if(mOpen>0.015||energy>0.15||speechPulse>0.08){
      const mBright=0.42+mOpen*1.75+energy*0.52+speechPulse*0.90;
      const mR=R*(0.044+mOpen*0.074+speechPulse*0.022);
      // Flattens toward a thin closed-lip line at true rest; reverts to
      // the normal rounder open shape as soon as a real viseme opens it.
      // Gated on real elapsed silence (not just this instant's mouthW+
      // mouthH), so a normal inter-syllable gap mid-sentence never gets
      // mistaken for "done talking" and snapped round.
      const speakingRecently=(t-lastSpeechT)<0.6;
      const restFactor=speakingRecently?0:Math.max(0,1-(mouthW+mouthH)*3);
      const curveWScale=1+mouthCurve*0.30;
      const curveYOff=-mouthCurve*R*0.016;
      const MYp2=MYp+curveYOff;
      // Lower floor, stronger multiplier, lighter speechPulse contribution
      // -- the real per-viseme w/h difference reads through clearly instead
      // of being swamped by a shared baseline and a pulsing speech boost
      const mWScaleRaw=(0.28+mouthW*1.55+speechPulse*0.08)*curveWScale;
      const mHScaleRaw=0.18+mouthH*1.65+speechPulse*0.08;
      // At true rest, W and H converge to a small round "moon" instead of
      // staying flattened-wide -- round, not oval
      const roundVal=0.42;
      const mWScale=mWScaleRaw*(1-restFactor)+roundVal*curveWScale*restFactor;
      const mHScale=mHScaleRaw*(1-restFactor)+roundVal*restFactor;
      // mouthAsym -- a small rotation + horizontal shift reads as a single
      // raised corner (a smirk) instead of a symmetric curve both sides
      const asymAngle=mouthAsym*0.30;
      const MXp2=MXp+mouthAsym*R*0.018;
      clearOrbSpace(MXp2,MYp2,mR*1.7*Math.max(mWScale,mHScale));
      ctx.save();
      ctx.translate(MXp2,MYp2); ctx.rotate(asymAngle); ctx.scale(mWScale,mHScale); ctx.translate(-MXp2,-MYp2);
      bokehOrb(MXp2,MYp2, mR, mBright, Math.min(1,mOpen*4.0+energy*0.6+speechPulse*0.8), p);
      // A touch of shading along the underside -- gives the mouth a little
      // dimension instead of reading as a flat glowing disc
      ctx.save();
      ctx.globalCompositeOperation='multiply';
      const shG=ctx.createRadialGradient(MXp2,MYp2+mR*0.55,0,MXp2,MYp2+mR*0.55,mR*1.3);
      shG.addColorStop(0,'rgba(210,210,215,0.93)');
      shG.addColorStop(1,'rgba(255,255,255,1)');
      ctx.beginPath(); ctx.arc(MXp2,MYp2+mR*0.55,mR*1.3,0,Math.PI*2);
      ctx.fillStyle=shG; ctx.fill();
      ctx.restore();
      ctx.restore();
      // A real smile/frown bend -- mouthCurve previously only scaled the
      // blob's width/position, so sadness/disgust/shock read as the same
      // round shape at different sizes, never an actual curve. Unicode's
      // own names for these glyphs settle the direction: SMILE (U+2323 ⌣)
      // dips below its endpoints, FROWN (U+2322 ⌢) arches above them.
      // Fades in via restFactor so an open AI/O/U viseme still reads as
      // the round blob above, not fights this line for the same pixels.
      if(restFactor>0.04){
        const lineHalfW=mR*1.65*(0.70+Math.abs(mouthCurve)*0.35);
        const bendMag=R*0.060*mouthCurve;
        const lx=MXp2-lineHalfW, rx=MXp2+lineHalfW;
        const cy=MYp2+bendMag;
        // Owner: "the white smile's terrible, make it 60% less obvious,
        // bring his transparency way down" -- both the alpha curve and the
        // stroke widths cut well below the first pass
        const lineAl=restFactor*Math.min(0.42,0.040+Math.abs(mouthCurve)*0.34);
        ctx.save();
        ctx.translate(MXp2,MYp2); ctx.rotate(asymAngle); ctx.translate(-MXp2,-MYp2);
        ctx.globalCompositeOperation='screen';
        ctx.lineCap='round';
        ctx.strokeStyle=_rgba(p.cr,lineAl*0.38);
        ctx.lineWidth=mR*0.60;
        ctx.beginPath(); ctx.moveTo(lx,MYp2); ctx.quadraticCurveTo(MXp2,cy,rx,MYp2); ctx.stroke();
        ctx.strokeStyle=_rgba(p.cr,Math.min(0.55,lineAl*0.85));
        ctx.lineWidth=mR*0.20;
        ctx.beginPath(); ctx.moveTo(lx,MYp2); ctx.quadraticCurveTo(MXp2,cy,rx,MYp2); ctx.stroke();
        ctx.restore();
      }
    }
  }

  // Stats overlay (click canvas to toggle)
  function drawStats(){
    const p2=getPalette(coherence/100);
    ctx.save();
    ctx.fillStyle='rgba(0,0,0,0.65)';
    ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(CX-98,CY-R-72,196,62,8);
    else ctx.rect(CX-98,CY-R-72,196,62);
    ctx.fill();
    ctx.textAlign='center';
    ctx.font='bold 12px system-ui,-apple-system,sans-serif';
    ctx.fillStyle=_rgb(p2.cr);
    ctx.fillText(BS[bsIdx].name,CX,CY-R-48);
    ctx.font='10px system-ui,-apple-system,sans-serif';
    ctx.fillStyle='rgba(255,255,255,0.68)';
    ctx.fillText('Coherence '+Math.round(coherence)+'%  |  Blinks '+blinkCount,CX,CY-R-27);
    ctx.restore();
  }

  // ----------------------------------------------------------------
  // Frame loop
  // ----------------------------------------------------------------
  function frame(ts){
    /* round TE: the stop path now always clears lastTs and returns in
       the same tick, rather than falling through to the baseline check
       below (which would otherwise immediately overwrite the null it
       just set). Lets pause()/resume() (and the original mouseenter
       restart) gate cleanly on lastTs===null without ever
       double-scheduling a second concurrent loop. */
    if(!cv.hidden){ requestAnimationFrame(frame); } else { lastTs=null; return; }
    if(lastTs===null){lastTs=ts;return;}
    const dt=Math.min((ts-lastTs)/1000,0.05); lastTs=ts;
    const t=ts/1000;
    const coh01=coherence/100;
    const p=getPalette(coh01);

    // Blend shapes
    bsT+=dt;
    if(!idleAnticipated && bsT>=BS[bsIdx].dur-0.4){
      idleAnticipated=true;
      triggerReaction(0.30,0.40);
    }
    if(bsT>=BS[bsIdx].dur){bsT=0;bsIdx=(bsIdx+1)%BS.length;energy=Math.min(2,energy+0.5);spawnRing(0.32);idleAnticipated=false;maybeTriggerSpecialEvent();}
    let dozeAmt=0, specialPitchOffset=0, excitedAmt=0;
    if(specialEvent){
      specialAge+=dt;
      if(specialAge>=specialDur){ specialEvent=null; }
      else if(specialEvent==='doze'){
        const u=specialAge/specialDur;
        dozeAmt=u<0.75?(u/0.75):Math.max(0,1-((u-0.75)/0.25)*3);
        specialPitchOffset=dozeAmt*0.10;
      } else if(specialEvent==='idea'){
        const u=Math.min(1,specialAge/specialDur);
        specialPitchOffset=-Math.sin(u*Math.PI)*0.07;
      } else if(specialEvent==='excited'){
        const u=specialAge/specialDur;
        // Fast rise, short hold, settle back out -- "yay, and then it stops"
        excitedAmt=u<0.20?(u/0.20):(u<0.55?1:Math.max(0,1-((u-0.55)/0.45)));
        specialPitchOffset=-Math.sin(Math.min(1,u*2.2))*0.05;
      }
    }
    const bsc=(curEmotion && emoT<emoDur) ? CHILD_EMOTIONS[curEmotion] : BS[bsIdx];
    emoT+=dt;
    // Shock zap envelope -- computed before the hue spring below uses it.
    // No fade-in needed: the boost itself starts high (blue, on top of the
    // yellow resting hue) and decays to exactly 0 by the end, landing
    // precisely on the resting yellow -- not a bell curve back to anything.
    let shockZapHueBoost=0;
    if(shockZapActive){
      shockZapT+=dt;
      const zapDur=0.5;
      if(shockZapT>=zapDur){ shockZapActive=false; }
      else {
        const u=shockZapT/zapDur;
        shockZapHueBoost=(1-u)*(1-u)*150; // starts +150 (blue-ish), eases down to 0 (pure yellow)
      }
    }
    // When it's really happy, it pulses energy -- a slow repeating pulse
    // for as long as a high-intensity joy stays active, not just the
    // one-shot ring burst that fires on trigger
    if(curEmotion && curEmotion.startsWith('joy_') && emoT<emoDur && ((CHILD_EMOTIONS[curEmotion].dur-0.70)/1.60)>0.75){
      joyPulseT+=dt;
      if(joyPulseT>0.55){ joyPulseT=0; spawnRing(0.38); }
    } else {
      joyPulseT=0;
    }
    // Coherence-extreme overlays -- continuous, not an event: as CQ falls
    // under 10% the character reads as destabilizing/alert (wide alarmed
    // eyes, raised brows, trembling, turbulence); above 92% it settles
    // into a zen calm (soft half-lidded eyes, stillness). Both layer on
    // top of whatever idle pose or triggered emotion is already active.
    const alertF=Math.max(0,(0.10-coh01)/0.10);
    const zenF=Math.max(0,(coh01-0.92)/0.08);
    // Owner: "give me a series of tired as it gets closer towards
    // decoherence" -- a gradual fatigue ramp (45% down to 10%) ahead of
    // the sharp alert/collapse state alertF already covers right at the
    // bottom; heavy lids, drooping gaze, dimmer sparkle, sluggish float,
    // not the trembling/wide-eyed alert look.
    const tiredF=Math.max(0,Math.min(1,(0.45-coh01)/0.35));
    [eyeSc,eyeScV]=stepSp(eyeSc,eyeScV,bsc.eySc+alertF*0.32-zenF*0.06-tiredF*0.08+excitedAmt*0.20,16,8.5,dt);
    [sqnt,sqntV]  =stepSp(sqnt,sqntV,  bsc.sqnt, 16,8.5,dt);
    [dil,dilV]    =stepSp(dil,dilV,    bsc.dil+alertF*0.35,  16,8.5,dt);
    [sep,sepV]    =stepSp(sep,sepV,    bsc.sep,  20,8.5,dt);
    [tilt,tiltV]  =stepSp(tilt,tiltV,  bsc.tilt, 20,8.5,dt);
    [bsSpin,bsSpinV]=stepSp(bsSpin,bsSpinV,bsc.spin,14,7.0,dt);
    [bsGlow,bsGlowV]=stepSp(bsGlow,bsGlowV,bsc.glow,14,7.0,dt);
    [eyeDrop,eyeDropV]=stepSp(eyeDrop,eyeDropV,bsc.eyeDrop-alertF*0.06+tiredF*0.05+vignetteEyeDrop,18,8.0,dt);
    [jitter,jitterV]  =stepSp(jitter,jitterV,  bsc.jitter+alertF*0.11, 10,6.5,dt);
    [hueC,hueCV]=stepSp(hueC,hueCV,bsc.hue+shockZapHueBoost,12,7.0,dt);
    [satC,satCV]=stepSp(satC,satCV,bsc.sat,12,7.0,dt);
    [valC,valCV]=stepSp(valC,valCV,bsc.val,12,7.0,dt);
    [twinkleC,twinkleCV]=stepSp(twinkleC,twinkleCV,bsc.twinkle*(1-tiredF*0.40),12,7.0,dt);
    [rimSpread,rimSpreadV]=stepSp(rimSpread,rimSpreadV,bsc.rimSpread,12,7.0,dt);
    [orbPlay,orbPlayV]=stepSp(orbPlay,orbPlayV,bsc.orbPlay,10,6.5,dt);
    [wobbleC,wobbleCV]=stepSp(wobbleC,wobbleCV,bsc.wobble+alertF*0.02,14,7.5,dt);
    [bobMul,bobMulV]=stepSp(bobMul,bobMulV,bsc.bobMul*(1-zenF*0.45)*(1-tiredF*0.35),14,7.5,dt);
    [mouthCurve,mouthCurveV]=stepSp(mouthCurve,mouthCurveV,(bsc.mouthCurve||0)+coh01*coh01*0.22-alertF*0.30-tiredF*0.15+excitedAmt*0.55,12,7.0,dt);
    [browPinch,browPinchV]=stepSp(browPinch,browPinchV,(bsc.browPinch||0)*(1-coh01*coh01*0.55)-alertF*0.60,12,7.0,dt);
    [browAsym,browAsymV]=stepSp(browAsym,browAsymV,bsc.browAsym||0,12,7.0,dt);
    [mouthAsym,mouthAsymV]=stepSp(mouthAsym,mouthAsymV,bsc.mouthAsym||0,12,7.0,dt);
    [cheekSquint,cheekSquintV]=stepSp(cheekSquint,cheekSquintV,Math.min(1,(bsc.cheekSquint||0)+dozeAmt*0.70+zenF*0.32+excitedAmt*0.45),12,7.0,dt);
    [agitationC,agitationCV]=stepSp(agitationC,agitationCV,(bsc.agitation||0)+alertF*0.65,10,6.5,dt);
    [lidDroopC,lidDroopCV]=stepSp(lidDroopC,lidDroopCV,Math.min(1,(bsc.lidDroop||0)+dozeAmt*0.65+zenF*0.26+tiredF*0.34),12,7.0,dt);
    if(speakStateEl) speakStateEl.textContent=chakraLabelT>0?chakraLabelTxt:bsc.name;

    // Owner: "the mouse follow seems jittery, something's happening where
    // it's no longer behaving like it's following... let's just have the
    // character follow the mouse cursor, this broken version is not
    // working." The ~20-34% duty-cycle autonomous-glance system (switching
    // between tracking the cursor and looking elsewhere every couple
    // seconds) read as inconsistent/jittery rather than lifelike -- back
    // to continuous direct tracking. Talking still forces center ("spin
    // towards you and communicate").
    const talking=demoMode==='talk';

    // Vignette targets computed first -- fearLookX/Y below feeds directly
    // into the gaze target right after this block
    let vScaleTgt=1,vScaleYTgt=1,vGrayTgt=0,vPitchTgt=0,vDropTgt=0,vGlowTgt=0,vGreenTgt=0,vRedTgt=0,vEyeDropTgt=0,vDarkTgt=0;
    if(vignetteTimer>0){
      vignetteTimer-=dt;
      const vf=vignetteFrac;
      // Owner: "anger becomes jittery and agitated, its eyes dip down, it
      // becomes a little red, squash and stretch a little up"
      if(vignetteFamily==='anger'){
        vScaleYTgt=1+0.11*vf+Math.sin(t*15)*0.045*vf;
        vScaleTgt=1-0.04*vf+Math.sin(t*15+1.3)*0.025*vf;
        vEyeDropTgt=0.09*vf;
        vRedTgt=vf;
      }
      else if(vignetteFamily==='fear'){ vScaleTgt=1-0.11*vf; vScaleYTgt=1-0.11*vf; vGrayTgt=0.55*vf; vDarkTgt=0.30*vf; }
      // Owner: "shock actually yellow, blue to yellow like a zap, and it
      // expands a little" -- color handled by shockZap above, this is just
      // the expand (was a shrink)
      else if(vignetteFamily==='shock'){ vScaleTgt=1+0.12*vf; vScaleYTgt=1+0.12*vf; }
      // Owner: "shame squashes and stretches down"
      else if(vignetteFamily==='shame'){ vPitchTgt=0.14*vf; vScaleYTgt=1-0.09*vf; vScaleTgt=1+0.03*vf; }
      else if(vignetteFamily==='sadness'){ vDropTgt=0.09*vf; }
      else if(vignetteFamily==='joy'){ vGlowTgt=0.14*vf+Math.sin(t*7)*0.05*vf; }
      // Owner: "not liking the disgust one, the animation is too sharp --
      // squash/stretch top to bottom, not left to right, and as it's
      // squeezing it gets more green." Replaces the old fast (t*38)
      // horizontal shake with a slower (t*5) vertical squash-stretch; green
      // intensifies specifically during the compressed phase.
      else if(vignetteFamily==='disgust'){
        const squeeze=Math.max(0,Math.sin(t*5.0))*vf;
        vScaleYTgt=1-0.12*squeeze; vScaleTgt=1+0.05*squeeze;
        vGreenTgt=squeeze;
      }
    }
    [vignetteScale,vignetteScaleV]=stepSp(vignetteScale,vignetteScaleV,vScaleTgt,14,7,dt);
    [vignetteScaleY,vignetteScaleYV]=stepSp(vignetteScaleY,vignetteScaleYV,vScaleYTgt,14,7,dt);
    [vignetteGray,vignetteGrayV]=stepSp(vignetteGray,vignetteGrayV,vGrayTgt,10,6,dt);
    [vignettePitch,vignettePitchV]=stepSp(vignettePitch,vignettePitchV,vPitchTgt,12,7,dt);
    [vignetteDrop,vignetteDropV]=stepSp(vignetteDrop,vignetteDropV,vDropTgt,12,7,dt);
    [vignetteGlow,vignetteGlowV]=stepSp(vignetteGlow,vignetteGlowV,vGlowTgt,14,7,dt);
    [vignetteGreen,vignetteGreenV]=stepSp(vignetteGreen,vignetteGreenV,vGreenTgt,16,7,dt);
    [vignetteRed,vignetteRedV]=stepSp(vignetteRed,vignetteRedV,vRedTgt,14,7,dt);
    [vignetteEyeDrop,vignetteEyeDropV]=stepSp(vignetteEyeDrop,vignetteEyeDropV,vEyeDropTgt,14,7,dt);
    [vignetteDark,vignetteDarkV]=stepSp(vignetteDark,vignetteDarkV,vDarkTgt,10,6,dt);
    const fearLookActive=vignetteFamily==='fear'&&vignetteTimer>0;
    const fearLookX=fearLookActive?Math.sin(t*3.3)*2.2*vignetteFrac:0;
    const fearLookY=fearLookActive?Math.sin(t*2.1+1)*1.3*vignetteFrac:0;

    // Gaze spring -- this is now the slower "head/cluster follows" layer;
    // pupilX/Y below is the fast "eyes dart first" layer chasing the same
    // target. A slow always-on left-right drift keeps it from ever reading
    // as frozen in place, even while holding still on the cursor.
    const baseDriftX=Math.sin(t*0.13)*0.45;
    const mouseX=(mxRaw-CX)*0.036, mouseY=(myRaw-CY)*0.036;
    const idleSec=(ts-lastMouseMoveT)/1000;
    [idleRestFrac,idleRestFracV]=stepSp(idleRestFrac,idleRestFracV,idleSec>=4.0?1:0,5,4.5,dt);
    const baseTX=talking?0:mouseX*(1-idleRestFrac), baseTY=talking?0:mouseY*(1-idleRestFrac);
    const tX=Math.max(-5,Math.min(5,baseTX+baseDriftX+fearLookX));
    const tY=Math.max(-4,Math.min(4,baseTY+fearLookY));
    // Owner: "have it follow the mouse cursor a bit more fluidly" --
    // softened from 28/9, a touch more lag and settle instead of rigidly
    // snapping to the live cursor position every frame
    [gazeX,gazeVX]=stepSp(gazeX,gazeVX,tX,20,8.0,dt);
    [gazeY,gazeVY]=stepSp(gazeY,gazeVY,tY,20,8.0,dt);
    [pupilX,pupilVX]=stepSp(pupilX,pupilVX,tX,130,15,dt);
    [pupilY,pupilVY]=stepSp(pupilY,pupilVY,tY,130,15,dt);

    // Head yaw/pitch/roll -- rides the same unified attention target as the
    // eyes (talk/react/calm demos stay centered so the head doesn't compete
    // with that motion), scaled down from the eye-gaze range to [-1,1]
    const headActive=(demoMode!==null)?0:1;
    const hx=talking?0:Math.max(-1,Math.min(1,tX/5));
    const hy=talking?0:Math.max(-1,Math.min(1,tY/4));
    [headYaw,headYawV]=stepSp(headYaw,headYawV,hx*0.42*headActive,19,7.0,dt);
    [headPitch,headPitchV]=stepSp(headPitch,headPitchV,hy*0.14*headActive,20,8.5,dt);
    [headRoll,headRollV]=stepSp(headRoll,headRollV,hx*0.09*headActive,16,8.0,dt);

    // Blink
    const closed=stepBlink(blink,dt);
    if(prevClosed>=0.95&&closed<0.95) blinkCount++;
    prevClosed=closed;

    const vs=VSHAPES[curViseme];
    const curDom=VISEME_DOMINANCE[curViseme]!=null?VISEME_DOMINANCE[curViseme]:0.3;
    const nextV=visemeQueue.length>0?visemeQueue[0].v:'rest';
    const nextDom=VISEME_DOMINANCE[nextV]!=null?VISEME_DOMINANCE[nextV]:0.3;
    let mwTgt=vs.mw, mhTgt=vs.mh;
    if(nextDom>curDom){
      // anticipate the more-dominant upcoming shape a beat early
      const nvs=VSHAPES[nextV], ant=0.30;
      mwTgt=mwTgt*(1-ant)+nvs.mw*ant;
      mhTgt=mhTgt*(1-ant)+nvs.mh*ant;
    }
    // hysteresis -- a dominant shape (arriving or just-left) eases slower,
    // so closure/rounding lingers instead of snapping cleanly to the next
    const hystDom=Math.max(curDom,VISEME_DOMINANCE[prevViseme]!=null?VISEME_DOMINANCE[prevViseme]:0.3);
    const visemeK=55-hystDom*26;
    // A touch of natural spring overshoot on the dominant (closure/
    // rounding) shapes specifically -- lands with a little more commitment
    // instead of a flat critically-damped fade, closer to a held "take"
    const visemeB=15-hystDom*4;
    [mouthW,mouthWV]=stepSp(mouthW,mouthWV,mwTgt,visemeK,visemeB,dt);
    [mouthH,mouthHV]=stepSp(mouthH,mouthHV,mhTgt,visemeK,visemeB,dt);

    // Energy decay
    energy=Math.max(0,energy-dt*1.5);
    // speechPulse now eases toward a decaying target via spring physics
    // instead of an instant jump + linear decay -- rolls in and out
    // smoothly instead of sawtoothing on every phoneme
    speechPulseTgt=Math.max(0,speechPulseTgt-dt*3.0);
    [speechPulse,speechPulseV]=stepSp(speechPulse,speechPulseV,speechPulseTgt,30,11,dt);

    if(reactPhase===1){
      reactTimer+=dt;
      if(reactTimer>=reactAntDur){
        reactPhase=2; reactTimer=0; squashTgt=0.17*reactStrength;
        if(pendingEnergy>0){ energy=Math.min(2,energy+pendingEnergy); pendingEnergy=0; }
      }
    } else if(reactPhase===2){
      reactTimer+=dt;
      if(reactTimer>=0.10){ reactPhase=0; squashTgt=0; }
    }
    [squash,squashV]=stepSp(squash,squashV,squashTgt,42,7.5,dt);

    // Demo modes
    if(demoMode==='talk' && visemeQueue.length===0 && qUnitDur<=0){
      enqueueText(TALK_PHRASE); // loops the phrase through the real word engine
    } else if(demoMode==='react'){
      demoTimer+=dt;
      energy=Math.min(2,energy+dt*0.65);
      if(demoTimer>0.38){bsT=BS[bsIdx].dur-0.05;demoTimer=0;}
    } else if(demoMode==='calm'){
      bsIdx=0; bsT=0;
      energy=Math.max(0,energy-dt*3.0);
    }

    // Drain the viseme queue one unit at a time, each held for its own
    // real duration (shared by the talk demo and typed input). Grounded in
    // research on Chuck Jones-era timing: the mouth read as "always mid-
    // transition" because the text-derived duration could be shorter than
    // the spring's own settle time, so a shape was never actually held
    // still long enough to register -- a real, enforced minimum hold fixes
    // that independent of how fast the words come in.
    const MIN_VISEME_HOLD=0.16;
    if(qUnitDur>0){
      qUnitElapsed+=dt;
      if(qUnitElapsed>=qUnitDur) qUnitDur=0;
    } else if(visemeQueue.length>0){
      const u=visemeQueue.shift();
      qUnitDur=u.v!=='rest'?Math.max(u.dur,MIN_VISEME_HOLD):u.dur;
      qUnitElapsed=0;
      prevViseme=curViseme;
      if(u.v!=='rest'){
        curViseme=u.v;
        lastSpeechT=t;
        energy=Math.min(2,energy+0.26);
        speechPulseTgt=Math.min(1,speechPulseTgt+0.55);
        if(u.dur>0.06) spawnRing(0.30);
      } else {
        curViseme='rest';
      }
    }

    // Owner: "when CQ gets really low, particles should be really slow
    // and almost non-existent -- let's make it a linear scale." Reversed
    // from the old inverse relationship (fast spin at zero CQ) to a
    // straight linear one: spin now scales directly with coherence, so it
    // winds down toward stillness as the character collapses instead of
    // spinning faster. Local turbulence (eF above) still increases at low
    // CQ -- the sphere loses its organized rotation but keeps trembling.
    const spinRate=BASE_SPIN*bsSpin*coh01+energy*0.9;
    rotY+=spinRate*dt;

    // Round 5: subtle state-driven wobble (alert trembles, calm/focus smooth)
    dynRotX=rotX+Math.sin(t*2.3)*wobbleC+headPitch+vignettePitch+specialPitchOffset;

    // Age and cull speech rings
    for(let i=speechRings.length-1;i>=0;i--){
      speechRings[i].age+=dt;
      if(speechRings[i].age>=RING_LIFE) speechRings.splice(i,1);
    }
    for(let i=chakraPulses.length-1;i>=0;i--){
      chakraPulses[i].age+=dt;
      if(chakraPulses[i].age>=CHAKRA_PULSE_LIFE) chakraPulses.splice(i,1);
    }
    if(chakraLabelT>0) chakraLabelT=Math.max(0,chakraLabelT-dt);

    // Turbulent flow -- differential rotation by latitude (like a plasma
    // sphere) plus per-particle oscillating eddies and bounded latitude
    // wander, so the swirl reads as fluid rather than a flat uniform spin
    // Decoherence and per-emotion agitation (anger highest) both speed up
    // local particle turbulence, on top of spin's overall rotation
    // Owner: "as its coherence gets lower, the particles should be more
    // agitated, not less" -- quadratic instead of linear so the low end
    // specifically ramps up hard (was 1.8 flat; now tops out near 3.2,
    // concentrated in the bottom half of the coherence range)
    const eF=1+energy*2.5+(1-coh01)*(1-coh01)*3.2+agitationC*2.2;
    for(let i=0;i<N_P;i++){
      const latFactor=0.55+0.55*Math.sin(pPhi[i]);
      const eddy=Math.sin(t*pTurbFreq[i]+pPhase[i]*3.1)*pTurbAmp[i];
      pTheta[i]+=(pDrift[i]*latFactor+eddy)*eF*dt;
      pPhi[i]=pPhi0[i]+Math.sin(t*pPhiFreq[i]+pPhiPh[i])*pPhiAmp[i];
    }

    // Render
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=_rgb(p.bg);
    ctx.fillRect(0,0,W,H);

    // Round 2: per-state color signature, applied once per frame (not per
    // particle) on top of the coherence palette
    const pT0=tintPalette(p,hueC,satC,valC);
    // Fear's "turn a lot grayer" -- a direct luminance-gray blend instead of
    // an HSL saturation subtraction, which is bounded by the source color's
    // own saturation (the warm gold base is already fairly saturated, so a
    // bounded subtraction never actually reached true gray)
    // Vignette color pushes -- disgust gets greener as it squeezes, anger
    // gets redder, fear darkens on top of its existing gray-mix
    let pT=pT0;
    if(vignetteGray>0.02) pT={...pT, m1:grayMix(pT.m1,vignetteGray), cl:grayMix(pT.cl,vignetteGray)};
    if(vignetteGreen>0.02) pT={...pT, m1:colorMix(pT.m1,[70,190,70],vignetteGreen*0.55), cl:colorMix(pT.cl,[90,210,90],vignetteGreen*0.55)};
    if(vignetteRed>0.02) pT={...pT, m1:colorMix(pT.m1,[200,40,30],vignetteRed*0.35), cl:colorMix(pT.cl,[220,60,40],vignetteRed*0.35)};
    if(vignetteDark>0.02) pT={...pT, m1:pT.m1.map(c=>Math.round(c*(1-vignetteDark*0.40))), cl:pT.cl.map(c=>Math.round(c*(1-vignetteDark*0.40)))};

    // Idle hover -- the whole character wanders gently off its center axis
    // (four different, non-integer-ratio periods so it never repeats into a
    // simple loop) instead of just bobbing vertically in place
    // Float amplitude +15% per owner note ("I'm liking the float -- make
    // that 15% more dynamic"): 0.045->0.05175, 0.032->0.0368
    hoverX=(Math.sin(t*(2*Math.PI/7.3)+0.6)*0.60+Math.sin(t*(2*Math.PI/13.1)+2.1)*0.40)*R*0.05175*bobMul;
    hoverY=(Math.sin(t*(2*Math.PI/5.2))*0.65+Math.sin(t*(2*Math.PI/11.7)+1.3)*0.35)*R*0.0368*bobMul+vignetteDrop*R*0.06;
    ctx.save();
    ctx.translate(hoverX,hoverY);
    // vignetteScale/vignetteScaleY are independent per-axis now -- disgust's
    // top-to-bottom squeeze, anger's upward stretch and shame's downward
    // squash all ride vignetteScaleY distinctly from vignetteScale's X axis
    ctx.translate(CX,CY); ctx.rotate(headRoll); ctx.scale((1-squash*0.55)*vignetteScale,(1+squash)*vignetteScaleY); ctx.translate(-CX,-CY);
    drawDecoherenceGlow(coh01,t);
    drawAura(coh01,pT);
    drawParticles(t,coh01,pT);
    drawVolumeOrbs(t,coh01,pT);
    drawRim(coh01,pT,t);
    drawEdgeRainbowBreakup(coh01,t,pT);
    drawHarmonicRadiance(coh01,t);
    drawCrownHalo(coh01,pT,t);
    drawSpeechRings(coh01,pT);
    drawChakraPulses();
    drawFaceOrbs(t,coh01,pT,closed);
    if(showStats) drawStats();
    ctx.restore();
    drawDither();
    updateShaderPanel();

    if(cv.hidden){lastTs=null;}
  }

  // "Expose the shader" -- there's no literal GLSL here (this is Canvas 2D),
  // so this is the honest equivalent: a live, throttled readout of the real
  // per-frame values actually driving the render, i.e. this engine's uniforms
  let shaderOpen=false, shaderTick=0;
  function updateShaderPanel(){
    if(!shaderOpen) return;
    shaderTick++;
    if(shaderTick%6!==0) return;
    const el=document.getElementById('shaderPanel');
    if(!el) return;
    const f=(v,n=3)=>Number(v).toFixed(n);
    const spinRate=BASE_SPIN*bsSpin*(coherence/100)+energy*0.9;
    el.textContent=
`rotY          ${f(rotY)}
dynRotX       ${f(dynRotX)}
spinRate      ${f(spinRate)}
energy        ${f(energy)}
speechPulse   ${f(speechPulse)}
blendShape    ${BS[bsIdx].name}  (${f(bsT,1)}/${BS[bsIdx].dur}s)
emotion       ${curEmotion?CHILD_EMOTIONS[curEmotion].name+' ('+CHILD_EMOTIONS[curEmotion].family+')  ('+f(Math.max(0,emoDur-emoT),1)+'s left)':'none'}
eySc ${f(eyeSc)}   sqnt ${f(sqnt)}   dil ${f(dil)}
sep  ${f(sep)}   eyeDrop ${f(eyeDrop)}   jitter ${f(jitter)}
hueC ${f(hueC,1)}   satC ${f(satC)}   valC ${f(valC)}
twinkleC ${f(twinkleC)}   rimSpread ${f(rimSpread)}   orbPlay ${f(orbPlay)}
wobbleC ${f(wobbleC,3)}   bobMul ${f(bobMul)}
CQ ${coherence}   DQ ${f(dq,1)}
hoverX ${f(hoverX)}   hoverY ${f(hoverY)}`;
  }
  const shaderBtn=document.getElementById('btn-shader');
  if(shaderBtn){
    shaderBtn.addEventListener('click',()=>{
      shaderOpen=!shaderOpen;
      shaderBtn.classList.toggle('active',shaderOpen);
      const el=document.getElementById('shaderPanel');
      if(el) el.hidden=!shaderOpen;
    });
  }

  // Events
  cv.addEventListener('click',()=>{showStats=!showStats;});
  cv.addEventListener('mouseenter',()=>{if(lastTs===null){lastTs=performance.now();requestAnimationFrame(frame);}});

  let typeBuf='';
  let typeFlushTimer=null;
  const speakEl=document.getElementById('speakInput');
  if(speakEl){
    speakEl.addEventListener('input',e=>{
      const ch=(e.data||'').slice(-1);
      if(typeFlushTimer){ clearTimeout(typeFlushTimer); typeFlushTimer=null; }
      if(ch && /[a-zA-Z]/.test(ch)){
        typeBuf+=ch;
        energy=Math.min(2,energy+0.10); // light per-keystroke nudge while typing
        // No boundary character follows the last word if typing just stops
        // (no trailing space) -- flush it on its own after a short pause so
        // the final word still gets its viseme burst and emotion check
        typeFlushTimer=setTimeout(()=>{ if(typeBuf){ enqueueText(typeBuf); typeBuf=''; } }, 450);
      } else {
        // space, punctuation, backspace, paste boundary, ... -- flush
        // whatever word has been typed as a real word-mapped viseme burst
        if(typeBuf){ enqueueText(typeBuf); typeBuf=''; }
        energy=Math.min(2,energy+0.14);
      }
    });
  }

  requestAnimationFrame(frame);

  // ---- External API, added for embedding (funnel / quiz / dashboard /
  // avatar). Every method below is a thin wrapper over the engine's own
  // real entry points -- coherence/dq are the same plain file-scope
  // `let` variables frame() already reads every tick (confirmed: update()
  // only runs on the dev-harness slider's own 'input' event, and only to
  // repaint that slider's cosmetic thumb/label colors -- it is NOT on the
  // path frame() uses to read these values, so setting them directly here
  // is the real, live control, not a parallel state that needs syncing).
  // setChildEmotion/triggerReaction/enqueueText are the same functions the
  // hidden demo buttons and speak box called -- nothing reimplemented.
  //
  // FIXED 2026-11-08: setShadow(0-10, "SQ") is gone. CQ and DQ are the two
  // real, independent poles (confirmed live, this session: "CQ and DQ and
  // opposite ends, but SQ is what are the weights"). SQ is the 112 real
  // addresses' own per-address weight, never a single number, so it was
  // never a real second dial here -- DQ (0-100, the same total-shadow score
  // MOB's own engine computes independently of CQ, see atuned_src/engine/
  // compute.js's own DQ comment) is the real pole this dial always meant to
  // drive, and setDQ now does that directly instead of faking it as 100-CQ.
  window.Uni = {
    // n: 0-100. The real coherence score driving her whole palette/pose.
    setCoherence(n){ coherence = Math.max(0, Math.min(100, +n || 0)); },
    getCoherence(){ return coherence; },
    // n: 0-100. DQ -- the real total-shadow score, independent of CQ.
    setDQ(n){ dq = Math.max(0, Math.min(100, +n || 0)); },
    getDQ(){ return dq; },
    // family: one of the 10 keys in EMO_FAMILIES (the 9 real laws --
    // fear/anger/shame/disgust/apathy/shock/sadness/surprise/anticipation
    // -- plus the non-canonical 10th, joy). idx: 0-8, rank in that
    // family's real 9-word ladder (0 = mildest, 8 = most intense word).
    // Omit idx for a middling 5th-word intensity.
    setEmotion(family, idx){
      if(!EMO_FAMILIES[family]) return false;
      const i=Math.max(0, Math.min(8, idx===undefined?4:(+idx||0)));
      setChildEmotion(family+'_'+i);
      return true;
    },
    // The real 9-word ladder for a family, in rank order (index 0..8).
    emotionWords(family){ return EMO_FAMILIES[family] ? EMO_FAMILIES[family].words.slice() : null; },
    emotionFamilies(){ return Object.keys(EMO_FAMILIES); },
    // intensity: 0-10, continuous. 0 clears back to idle. 1-9 line up
    // exactly with the real 9-word ladder (1=word rank 0 "mildest" ... 9=
    // rank 8 "most intense"), using the engine's own buildChildEmotion
    // formula (same sqrt color curve) rather than a separate scale.
    // 10 is new: one step further on that same formula (frac=10/9), so
    // hue/sat/val -- and every pose field -- push past the family's
    // documented "full" word, a deliberate flare beyond the canonical
    // ladder's own max. Built as one extra entry in the real CHILD_EMOTIONS
    // table and driven through the real setChildEmotion(), not a parallel
    // system -- the same reaction/vignette/ring flourishes fire exactly as
    // they do for any pinned word.
    setEmotionIntensity(family, intensity){
      const fam=EMO_FAMILIES[family];
      if(!fam) return false;
      const level=Math.max(0, Math.min(10, Math.round(+intensity||0)));
      if(level===0){ emoT=emoDur; return true; } // let the current emotion expire back to idle
      const n=fam.words.length, frac=level/9, f=fam.full;
      const name = level>=10 ? fam.words[n-1]+' +' : fam.words[Math.max(0,Math.min(n-1,level-1))];
      const out={name, family, dur:0.70+Math.min(1,frac)*1.60, rings: frac>0.55?(f.rings||0):0};
      const colorFrac=Math.sqrt(Math.min(1,frac))+(frac>1?(frac-1)*0.6:0);
      for(const k of EMO_FIELDS){
        const t=(k==='hue'||k==='sat'||k==='val')?colorFrac:(Math.min(1,frac)+(frac>1?(frac-1)*0.4:0));
        out[k]=EMO_NEUTRAL[k]+(f[k]-EMO_NEUTRAL[k])*t;
      }
      const key=family+'_ix'+level;
      CHILD_EMOTIONS[key]=out;
      setChildEmotion(key);
      return true;
    },
    // A quick reaction poke (anticipation dip + stretch), not a sustained
    // emotion -- same call the "react" demo button used.
    react(strength){ triggerReaction(strength||1, null, (strength||1)*0.4); },
    // Runs real text through the same viseme/word-trigger pipeline the
    // speak box used (mouth visemes, and any EMO_WORD_TRIGGERS match).
    speak(text){ enqueueText(String(text||'')); },
    /* STAGE 1, round TE: mirrors the canvas's own mouseenter handler
       above, the only place this loop ever restarted itself before.
       uniMount/uniPark call these so a reparented, previously-hidden
       instance resumes without needing a real hover. */
    pause(){ cv.hidden=true; },
    resume(){ cv.hidden=false; if(lastTs===null){ lastTs=performance.now(); requestAnimationFrame(frame); } },
  };
})();

/* STAGE 1 continued: one shared instance, moved between screens rather
   than built once per screen. uniPark() is also her resting state at
   load: built, hidden, parked in document.body, costing nothing visible
   until the first real caller mounts her. */
function uniMount(target){
 if(!target)return false;
 uniHost.hidden=false;
 target.appendChild(uniHost);
 if(window.Uni&&window.Uni.resume)window.Uni.resume();
 return true;
}
function uniPark(){
 if(window.Uni&&window.Uni.pause)window.Uni.pause();
 uniHost.hidden=true;
 document.body.appendChild(uniHost);
}
window.uniMount=uniMount;
window.uniPark=uniPark;
if(window.Uni&&window.Uni.pause)window.Uni.pause();
})();
