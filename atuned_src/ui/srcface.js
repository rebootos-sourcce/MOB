/* ============================================================
   SOURCE'S FACE, THE LEDGER, IN UNI'S SLOT ON THE JOURNAL. Wired in 16
   November, his words: "The ledger is the one I want wired in." Before that
   it was a demo file (pulse-ledger-v2.html) and a mockup that proved it fits
   #stuni in both the Dashboard and the hero view without moving anything
   else on the page, measured element by element.

   THE LOOK IS "SOURCE, THE LEDGER, AMPLIFIED", corrected 16 November. The
   first wiring ported the pie mockup: seven 1/7 wedges, each seat's
   addresses in two rows inside its own wedge, the chain climbing three inner
   orbits. He sent a screenshot of the design he had actually picked, and it
   is the amplified round: every seat is one whole concentric ring, Root
   innermost and Crown outermost at (ring+1.6)/8 of the structure, and each
   seat's addresses are spread round the full turn of their own ring, so the
   108 read as a starfield of rings and not as a pie. draw() below is that
   file's draw(), ported with its constants, and the motion comes with it:
   each address drifts on its own sines, a heartbeat leaves the centre and
   throws every address outward on a spring, and at high coherence the rings
   lock into phase and turn as one. That is more motion than the house's near
   stillness, on purpose, by his own ask for this design ("more dynamic, more
   natural, more alive"). Reduced motion still gets the placed end state.

   What the amplified file carried that is not here, and why:
    -  its reasoning column, legend, HUD, caption, story box, Speak button and
       the "Four seats" and "Two seats" presets. Testing furniture. The box
       is as small as 74 by 94 on a phone Dashboard, the Journal already
       holds the real words, and the real voice is played elsewhere.
    -  its compound orbits. It had none: its chain is the saboteur pattern
       trace, and that is what is drawn here, on the real sabs. The complex,
       hyper-complex and super-complex orbits and the plan lock grille were
       the pie mockup's and sat at radii the seven seat rings now occupy, so
       they came off the face with the pie. readChain still reads all four
       lists and the plan's locks, and state() still reports them.
    -  the outer halo it painted round the face on a window wide dark fill.
       In this box that fill is the frame he ruled out round Uni on 10
       November, and the halo cropped by the box's edge is a square.
    -  the gold --beat it wrote onto the page for its own HUD marks, and its
       click and touch on the canvas are kept, since they only move the face.

   What changed in wiring it is only where every input comes from. The demo
   carried all of them as constants and each one was a stand in:

    1  THE ADDRESSES are W (engine/core.js), the engine's own 108 somatic
       addresses in BANDS order, with sq and cf exactly as compute() has
       just set them. The demo's DATA.addrs was a baked profile of 107, with
       address 8 pushed in by hand; W always has all 108, and address 8,
       Root_08_Unnamed, is drawn at its real sq with no feeling, as W holds
       it. Nothing is filled in: a seat draws the addresses W gives it.
    2  THE CHAIN is computeSeen() (ui/lock.js), compute()'s own sabs, cxs,
       hys and sups as this plan may see them. Their parts are the real
       links: a saboteur's parts are address nodes. The pattern trace cycles
       through the real sabs the way the amplified file cycled its four.
    3  THE SNIFFER is parseStory() (engine/sniff.js), called on the turn the
       Journal was just handed. The demo carried a 29 word cut of the
       lexicon and "the heaviest wins" in place of the real rule, so it had
       no negation and no proportional split. Here a raw hit is one of
       parseStory's own counted hits, a denied hit ("I was not angry") or
       one about someone else never fires because the engine never counts
       it, and a seat resolves to the addresses and the fetter the engine's
       own imprints land on. There is no second copy of that logic here.
    4  CQ is the reading's own r.CQ, the figure every other CQ display
       reads, and no arc at all while r.unread. The demo held it at 100, so
       its screenshot is the locked state; a real partial CQ is not locked.
    5  THE VOICE is the product's one voice. stSrcSpeak (ui/storyui.js)
       hands this the real audio element it is about to play, and the face
       follows that element: it speaks while the element plays, the reading
       is held until it ends, and the word the voice is on is read off the
       element's own playback position. The demo's Speak button and its
       path through the browser's own built in speech are gone; the product
       has no browser voice.
    6  THE MOUNT is the canvas-wrap inside #stuni, Uni's own box, done by
       uniMount (ui/uni.js) when the target is #stuni, which pauses Uni's
       loop and hides her canvas there. The boot intro's #bootuni is the
       same kind of mount and takes the same route, 16 November.

   KNOWN GAPS, said rather than papered over:
    a  The person's own words have no timing anywhere in the product. A
       typed turn arrives whole, and a spoken one arrives whole from the
       recogniser, one result an utterance. So the raw hits of a turn are
       paced on the ledger's own word clock, 160 a minute, over the real
       words of that turn. It is the ledger's fallback clock, kept, and it
       is the one input here that is a clock and not a reading.
    b  The voice server sends audio and nothing else, no word timings
       (authVoice, ui/auth.js). So the word the voice is on is placed by
       the element's real currentTime over its real duration, weighted by
       the ledger's own per word lengths and pauses. It follows the real
       audio and never runs ahead of it, but it is placed, not reported.
    c  The 21 rim marks are the laws, as the amplified file drew them, and
       no story lights one law over another: nothing in the engine links a
       story to a single law. What moves them is the file's own sweep, the
       beat reaching the rim, and coherence, which is read from the law
       answers. The file also carried a per law tickE that nothing ever
       set; it is left out rather than ported as a promise.
   ============================================================ */
(function(){
 'use strict';
 const SEATCOL=['#D6524C','#D8924E','#DABF6A','#5FD5A6','#5EBBDB','#7D93E0','#A77EDB'];
 const GOLD='#C2A063';
 /* the same hard threshold Uni's harmonic radiance disk uses */
 const HI_GATE=92;
 /* reduced motion is the house's own test, rbStill (ui/component.js), read
    live, because the person can turn quiet on and off with the face open;
    the ledger read the media query once at load */
 let RM=false;
 const still=()=>{ try{ return typeof rbStill==='function'?rbStill():matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } };
 const PI=Math.PI, TAU=PI*2;
 const clamp=(x,a,b)=>x<a?a:x>b?b:x;
 const mix=(a,b,t)=>a+(b-a)*t;
 const easeOut=x=>1-Math.pow(1-clamp(x,0,1),3);
 const easeInOut=x=>{x=clamp(x,0,1);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;};
 /* the house curves, solved exactly, so the canvas and the CSS move on the same timing */
 function cbz(x1,y1,x2,y2){ return x=>{ x=clamp(x,0,1); let u=x; for(let k=0;k<7;k++){ const m=1-u; const xu=3*x1*u*m*m+3*x2*u*u*m+u*u*u-x; const d=3*x1*m*m+6*(x2-x1)*u*m+3*(1-x2)*u*u; if(Math.abs(d)<1e-6) break; u=clamp(u-xu/d,0,1); } const m=1-u; return 3*y1*u*m*m+3*y2*u*u*m+u*u*u; }; }
 const EIN=cbz(.4,0,1,1), OVS=cbz(.34,1.56,.64,1);
 /* c1 2.4 peaks at 1.18 */
 const backOut=(x,c1)=>{ x=clamp(x,0,1); const c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); };
 const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
 const GOLDRGB=rgb(GOLD);
 function mixc(c,g,t){ return [Math.round(mix(c[0],g[0],t)),Math.round(mix(c[1],g[1],t)),Math.round(mix(c[2],g[2],t))]; }
 /* seeded, so every load drifts the same way and a screenshot can be
    repeated. Two generators where the file had one: the layout's is
    restarted on every read of W, so an address keeps its own phases across
    readings instead of taking whatever the draw loop left in the stream */
 const mkRnd=s0=>{ let seed=s0; return ()=>{ seed|=0; seed=seed+0x6D2B79F5|0; let x=Math.imul(seed^seed>>>15,1|seed); x=x+Math.imul(x^x>>>7,61|x)^x; return ((x^x>>>14)>>>0)/4294967296; }; };
 const rnd=mkRnd(0x2B1D9);
 /* THE TYPE FLOOR IS THE HOUSE'S, 11 PIXELS. design.js cannot see inside a
    canvas, which is a reason to hold it here, not a licence. */
 const FS=11;

 const canvas=document.createElement('canvas');
 canvas.id='srcface';
 canvas.hidden=true;
 canvas.setAttribute('aria-label',"Source's reading circle. Seven rings are the seven seats, Root at the centre and Crown outside, and each dot on a ring is one body address, brighter where it carries more charge.");
 /* UNPACK EVERY SYMBOL: the amplified file's caption, which named every mark
    on the face, travels with it as the hover, since the box has no room for
    a caption of its own */
 const TITLE="Source's reading circle. Every dot is one of the 108 body addresses, each at a named plexus or nerve, drawn at its real charge. The seven rings are the seats, Root at the centre, Crown outside. The slow beat from the centre is Source reading, and it starts once you talk or write. A light running between dots is one of your saboteur patterns, its addresses lit together. The 21 marks on the rim are the laws. The four short marks top and bottom are the field anchors, two above the body and two below.";
 canvas.title=TITLE;
 const ctx=canvas.getContext('2d');
 /* the emissive layer and its three bloom copies, the amplified file's */
 const L=document.createElement('canvas'), lx=L.getContext('2d');
 const B=[1,2,3].map(()=>{const c=document.createElement('canvas');return {c,x:c.getContext('2d')};});
 let W0=0,H0=0,DPR=1,running=false,raf=0, Rf=12;
 /* CHANGE 1. Sized off the box, read every frame through clientWidth, so the
    Dashboard toggle, which resizes #stuni without a window resize, is
    followed on the next frame. */
 function fit(){
  const w=canvas.clientWidth, h=canvas.clientHeight; const d=Math.min(window.devicePixelRatio||1,2);
  if(w===W0&&h===H0&&d===DPR) return; W0=w; H0=h; DPR=d;
  canvas.width=Math.max(1,Math.round(W0*DPR)); canvas.height=Math.max(1,Math.round(H0*DPR));
  L.width=canvas.width; L.height=canvas.height;
  /* the face is the largest circle the box holds with a 2 pixel margin: in
     this layout the field anchors and the rim sit inside it, where the pie
     put the anchors outside */
  Rf=Math.max(12,Math.min(W0,H0)/2-2);
  /* the bloom's downsample steps were 4, 8 and 16 pixels against a face 430
     across the window. Kept in proportion to the face, the way every other
     length in the file scales by Rf/430, or a 40 pixel face is smeared to a
     blur by a 16 pixel step */
  const U=Rf/430;
  [4,8,16].forEach((b,k)=>{ const dd=Math.max(1,Math.round(b*U)); B[k].d=dd; B[k].c.width=Math.max(1,Math.ceil(W0/dd)); B[k].c.height=Math.max(1,Math.ceil(H0/dd)); });
 }

 /* ---- sprites: built once, a glow costs one blit ---- */
 function sprite(hex,stops,S){
  S=S||128; const c=document.createElement('canvas'); c.width=c.height=S; const g=c.getContext('2d');
  const [r,gg,b]=rgb(hex); const gr=g.createRadialGradient(S/2,S/2,0,S/2,S/2,S/2);
  stops.forEach(([x,a,white])=>{ const m=white||0; gr.addColorStop(x,`rgba(${Math.round(r+(255-r)*m)},${Math.round(gg+(255-gg)*m)},${Math.round(b+(255-b)*m)},${a})`); });
  g.fillStyle=gr; g.fillRect(0,0,S,S); return c;
 }
 const gauss=[]; for(let k=0;k<=14;k++){const x=k/14; gauss.push([x,Math.exp(-x*x*6)*(1-x*x),0]);}
 const HALO=SEATCOL.map(c=>sprite(c,gauss));
 const CORE=SEATCOL.map(c=>sprite(c,[[0,1,1],[.18,1,.55],[.42,.55,0],[.7,.12,0],[1,0,0]],64));
 const HOT=sprite('#fff4de',[[0,1,0],[.25,.6,0],[.6,.1,0],[1,0,0]],64);
 const GOLDH=sprite(GOLD,gauss);
 const WARM=sprite('#f3e2c0',gauss);
 const NEB=SEATCOL.map(c=>sprite(c,[[0,.9,0],[.35,.45,0],[.7,.12,0],[1,0,0]],256));
 const STREAK=(()=>{const c=document.createElement('canvas');c.width=256;c.height=16;const g=c.getContext('2d');
  const gr=g.createLinearGradient(0,0,256,0);gr.addColorStop(0,'rgba(255,236,205,0)');gr.addColorStop(.5,'rgba(255,240,215,1)');gr.addColorStop(1,'rgba(255,236,205,0)');
  const gv=g.createLinearGradient(0,0,0,16);gv.addColorStop(0,'rgba(0,0,0,1)');gv.addColorStop(.5,'rgba(0,0,0,0)');gv.addColorStop(1,'rgba(0,0,0,1)');
  g.fillStyle=gr;g.fillRect(0,0,256,16);g.globalCompositeOperation='destination-out';g.fillStyle=gv;g.fillRect(0,0,256,16);return c;})();
 function blit(c,img,x,y,s,a){ if(!(a>0.003)||!(s>0)) return; c.globalAlpha=Math.min(1,a); c.drawImage(img,x-s/2,y-s/2,s,s); }
 /* a blit with squash and stretch along an axis: sr along the radius, st across it */
 function blitT(c,img,x,y,s,a,ang,sr,st){ if(!(a>0.003)||!(s>0)) return; c.save(); c.translate(x,y); c.rotate(ang); c.scale(sr,st); c.globalAlpha=Math.min(1,a); c.drawImage(img,-s/2,-s/2,s,s); c.restore(); }

 /* the seat names are BANDS (engine/data/canon.js), read and never retyped,
    so ring r is BANDS[r]: Root 0 through Crown 6, the ledger's own order */
 const SEATNM=BANDS.slice();

 /* ---- input 1: the addresses, read off W ---- */
 let ringList=[[],[],[],[],[],[],[]], addrs=[], byI={};
 /* the profile's own lightest, heaviest and mean charge. The amplified file
    wrote its profile's as constants (2.6 and 5.08 in charge, 4.34 in the
    dash speed); these are the same three numbers read off the real reading */
 let SQ={lo:0,hi:0,mean:0}, GW=[];
 /* The layout is the amplified ledger's: each seat's addresses, ordered by
    address number, spread evenly round the whole of its own ring, with each
    ring's start turned 0.7 of a radian from the last so no two seats line
    up. W's own .ang spaces all 108 round one circle with no seats, which is
    the wheel's layout and not this face's, so the face reads only i, b, sq
    and cf. A snapshot, because compute() writes sq onto these same nodes
    for every reading anyone asks for, a practitioner's view of another
    record included, and the face must keep showing the reading it was
    handed. A spring in flight is carried across the snapshot by address,
    or every reading would snap the field still for a frame. */
 function readAddrs(){
  const rl=[[],[],[],[],[],[],[]];
  (typeof W!=='undefined'&&Array.isArray(W)?W:[]).forEach(n=>{
   const ring=SEATNM.indexOf(n&&n.b); if(ring<0) return;
   rl[ring].push({i:n.i,b:n.b,ring,sq:+n.sq||0,cf:n.cf||null});});
  const lr=mkRnd(0x51A7E), prev=byI, out=[];
  rl.forEach((list,r)=>{ list.sort((a,b)=>a.i-b.i);
   list.forEach((a,k)=>{ a.rf=(r+1.6)/8; a.spreadAng=(k/list.length)*TAU+r*0.7; a.col=SEATCOL[r];
    /* independent micro drift: two incommensurate sines per axis, a twinkle of its own */
    a.f1=0.11+lr()*0.27; a.f2=0.23+lr()*0.41; a.p1=lr()*TAU; a.p2=lr()*TAU; a.f3=0.15+lr()*0.3; a.p3=lr()*TAU; a.tw=0.5+lr()*1.1; a.pt=lr()*TAU;
    const o=prev[a.i]; a.sx=o?o.sx:0; a.sv=o?o.sv:0; a.lx=o?o.lx:0; a.ly=o?o.ly:0; a.la=o?o.la:0;
    out.push(a); }); });
  ringList=rl; addrs=out; byI={}; out.forEach(a=>byI[a.i]=a);
  const qs=out.map(a=>a.sq);
  SQ={lo:qs.length?Math.min(...qs):0, hi:qs.length?Math.max(...qs):0, mean:qs.length?qs.reduce((s,v)=>s+v,0)/qs.length:0};
  /* glints at rest are weighted by charge, so the heaviest addresses spark most often */
  GW=[]; let acc=0; out.forEach(a=>{ acc+=Math.pow(a.sq,4); GW.push(acc); }); GW.tot=acc;
 }

 /* ---- input 2: the chain, read off computeSeen() ---- */
 let CH={sabs:[],cxs:[],hys:[],sups:[]}, LOCKED=new Set(), CQ=null;
 /* a saboteur sits in the seat most of its addresses sit in */
 function seatOf(parts){ const c=[0,0,0,0,0,0,0]; parts.forEach(i=>{ if(byI[i]) c[byI[i].ring]++; }); let best=0; c.forEach((v,k)=>{ if(v>c[best]) best=k; }); return best; }
 function readChain(r){
  const L2=k=>Array.isArray(r&&r[k])?r[k]:[];
  const seen=new Map();
  const sabs=L2('sabs').map(s=>{ const parts=(s.parts||[]).map(n=>n&&n.i).filter(i=>byI[i]);
   const o={nm:s.nm,w:s.w,parts,ring:seatOf(parts)}; seen.set(s,o); return o; });
  /* a compound's parts are the rung below it; a part the plan has hidden
     (sightR emptied its list) is not on the face */
  const up=(list,fam)=>list.map(n=>{ const ps=(n.parts||[]).map(p=>seen.get(p)).filter(Boolean);
   const o={nm:n.nm,fam:fam(n),parts:ps}; seen.set(n,o); return o; });
  const cxs=up(L2('cxs'),n=>n.hcx), hys=up(L2('hys'),n=>n.nm), sups=up(L2('sups'),n=>n.nm);
  CH={sabs,cxs,hys,sups};
  LOCKED=new Set(Array.isArray(r&&r.locked)?r.locked:[]);
  /* NO LAW ANSWERED IS NOT COHERENCE ZERO, 17 November, his words on this
     face: "I haven't said anything and talk is not active and the
     animations are going haywire." This gated on r.unread alone. A record
     that carries imprints (a quiz, a seed, an older story) is not unread,
     but with no law measured compute() reports CQ 0 because no law is in
     (engine/compute.js, at UNREAD), and the face took that 0 as a real
     reading of no coherence: disorder 1, so driftK below ran every address
     at 2.15 against its floor of 0.35, six times the drift, and the hover
     said "now 0 percent". measured is the count of laws actually answered,
     the same lawRec read compute() makes, so a 0 there is no reading of
     coherence at all and draws no arc and no disorder, as unread does. */
  CQ=(r&&!r.unread&&r.measured>0&&isFinite(r.CQ))?clamp(+r.CQ,0,100):null;
  /* UNPACK EVERY SYMBOL: the arc's number travels with the face's own
     meaning on hover, since the canvas prints no number of its own */
  canvas.title=TITLE+(CQ==null?(r&&!r.unread
    ?' The gold arc is coherence, the CQ score, and it is drawn once you answer the laws.'
    :' The gold arc is coherence, the CQ score, and there is no reading yet.')
   /* a percent, as the Field tile prints the same figure: "of 100" is a
      count against a total, which reads as pass or fail, CO-05 */
   :' The gold arc is coherence, the CQ score, now '+Math.round(CQ)+' percent, drawn as how far round the arc reaches.'
    +(CQ>=HI_GATE?' At '+HI_GATE+' and above the rings lock and turn as one.':''));
 }
 /* coherence is eased, the amplified file's 1.4 seconds, so a new reading
    turns the arc and the lock rather than cutting to them */
 let cqFrom=0, cqTo=0, cqT0=-9e9, cqv=0, cqSeen=false;
 const CQ_DUR=1400;
 /* called by uniApply (ui/storyui.js) with the reading it has just taken */
 function sync(r){ readAddrs(); readChain(r||{});
  if(CQ!=null){ if(!cqSeen){ cqFrom=cqTo=cqv=CQ; cqSeen=true; } else if(CQ!==cqTo){ cqFrom=cqv; cqTo=CQ; cqT0=performance.now(); } }
  if(sabIdx>=CH.sabs.length){ sabIdx=0; sabStart=performance.now()+400; lastCyc={}; } }

 const RD={on:false,seats:{},order:[],closed:false,id:0,imp:{},hk:{}};
 /* A CALLER'S HOOK MAY NOT STOP THE FACE. The intro (ui/srcintro.js) hangs
    its captions off these, and a throw from one of them inside a word timer
    would leave the reading half fired, the seat held as a cross for ever */
 function hook(name,arg){ const f=RD.hk&&RD.hk[name]; if(typeof f!=='function') return; try{ f(arg); }catch(e){} }
 const rawFx=[], resFx={};
 let lastInput=-9e9, lastEvent=-9e9, speaking=false, holdTimer=0;
 /* THE IDLE WORD IS NO WORD, 17 November, his words: "there's text at the
    center of it that says waiting. I don't want it to, it looks broken."
    It was 'Waiting', printed in the centre from the first frame to a person
    who had not said anything, with nothing beside it to say what was
    awaited. The four words that name something happening (Listening,
    Found, Weighing, Holding, and Answering for the voice) are unchanged;
    between them the centre is empty. */
 const IDLE='';
 let stateWord=IDLE;
 /* AT REST UNTIL SOMETHING HAPPENS, the same day and the same words: "something
    is being activated before I've ever even engaged in conversation." The
    centre beat, the springs it throws and the saboteur trace all ran from
    the first frame, so a face nobody had spoken to looked like it was mid
    reading. This is the one switch for it: false until a reading starts
    (read), the voice plays over the face (voice), or the intro calls a beat
    (cue), and false again after clear(), so the intro's example does not
    leave the Journal's face running for a person who has said nothing yet.
    The surfaces that print a reading do the same thing on r.unread (CLAUDE.md,
    "the app opens on Discover"); this face is drawn on a loaded record too,
    so engagement and not unread is what it rests on. At rest the rings,
    the addresses at their real charge, their own slow drift and the rim
    stay, which is the placed field and not a reading. */
 let engaged=false;
 /* live state, the amplified file's */
 const flares={};            // address i -> {t0,s}
 const waves=[];             // word wavefronts
 const pulses=[];            // the centre beat
 const sparks=[];            // the beat handed ring to ring
 const rimWaves=[];          // the laws answer in order, Crown at the top down to Root
 const squash={};            // address i -> ms the raw charge landed on it
 const rotA=[0,0,0,0,0,0,0];
 const ringS=new Float32Array(7), ringV=new Float32Array(7);
 let speakLvl=0, wordE=0, rimE=0, readE=0, hiE=0, wasHi=false, domSeed=0;
 let pendClick=null, clickP=null;
 /* first beat lands about two seconds in */
 let pPh=0.62, lastBeat=-9e9;
 /* the beat's own period on the last frame, for cue(), which has to say how
    long until the beat it has just called lands. 5.4 seconds, the ordinary
    period, until the first frame has measured one */
 let curPeriod=5.4;
 /* the pattern cycle, over the real saboteurs */
 let sabIdx=0, sabStart=performance.now()+1700, lastCyc={};
 const SAB_HOLD=4200, SAB_FADE=900;
 /* ============================================================
    THE BOOT INTRO, 17 November. His words: "more pacing, a bit more
    anticipation... the colors starting to come on... to get them more like
    stars. But then you see like it's something more harmonic and more
    geometric. And then it fully comes to life. Like a breathing shape...
    And then it stays where it is, attuned."

    Until this the boot showed the face's ordinary entrance: every address
    of a ring faded up together, ring by ring, on the face's own first
    frame, which landed under the sheet's black opening beat, so by 1.3
    seconds the whole figure was already placed and nothing more arrived.
    That is the "flat colour blocks" he saw. intro(clock) hands the face a
    clock, the sheet's own fade read in seconds (ui/panels.js bootUniT), and
    while it runs the face plays these beats off it instead. A clock and not
    a timer, so the face can never run ahead of or behind the sheet.

      core    0.55  a single point in the dark swells, then coils inward,
                    the backswing before anything lights
      ign     1.10  the 108 addresses ignite one by one and in small
                    clusters, sparse first and quickening, each with a
                    speck of anticipation, a white hot flash with a glint,
                    a cool into its seat's colour, and a twinkle of its own.
                    A heavier address on the person's own reading lights
                    sooner and burns brighter, so even the stars are data
      antic   2.90  every star eases out and dims a little, the inhale
      gather  3.18  each star travels an arc to its own place on its own
                    seat ring, Root first, 90ms a seat, the radius landing
                    on the house overshoot and the angle on the house ease
                    out; each ring draws itself closed behind its stars
      lock    4.05  the rings phase lock and the lattice binds them
      life    4.70  the centre draws in and the first large beat throws
                    every address out on its spring; from here the shape
                    breathes, about 2.8 seconds a breath, visibly
      settle  7.20  the breath eases back to the house breath by the end
      end     8.00  the sheet's own end

    Reduced motion never enters this: bootUni (ui/panels.js) never mounts
    under it, and a face that sees rbStill mid intro draws its placed end
    state at once, since every branch here is gated on !RM.
    ============================================================ */
 const IT={core:0.55,coil:0.98,ign:1.10,ign1:2.85,antic:2.90,gather:3.18,gDur:0.66,beat:0.09,
  lens0:3.30,lens1:4.20,rim0:3.80,rim1:4.40,lock:4.05,life:4.70,breath:2.8,settle:7.20,end:8.00};
 const EOUT=cbz(.22,1,.36,1);
 let IN=null, inEndAt=-9e9;
 const STAR={};
 /* where each star sits before it is gathered, how bright it burns and when
    it lights. Seeded, so every boot is the same sky. Clusters of one to
    four, 70ms apart inside a cluster, placed on a square root of their
    rank so the first stars come alone and the last come together, the way
    a sky fills at dusk. The first cluster is one star, alone. */
 function starPlan(){
  const sr=mkRnd(0x57A85), span=SQ.hi-SQ.lo;
  const keyed=addrs.map(a=>{ const ch=span>1e-6?(a.sq-SQ.lo)/span:0;
   return {a,ch,k:span>1e-6?sr()*0.55+(1-ch)*0.45:sr()}; }).sort((x,y)=>x.k-y.k);
  const cl=[]; let k=0;
  while(k<keyed.length){ const n=cl.length?1+Math.floor(sr()*4):1; cl.push(keyed.slice(k,k+n)); k+=n; }
  const L0=IT.ign, L1=IT.ign1-0.25;
  cl.forEach((c,ci)=>{ const tc=L0+(L1-L0)*Math.sqrt(ci/Math.max(1,cl.length-1));
   c.forEach((o,j)=>{ const v=sr();
    STAR[o.a.i]={t:tc+j*0.07, r:0.10+0.86*Math.sqrt(v), a:sr()*TAU, ph:sr()*TAU,
     m:Math.min(1,0.35*Math.pow(sr(),2.2)+0.65*o.ch+(span>1e-6?0:0.65*Math.pow(sr(),2.2))),
     j:sr()*0.05}; }); });
 }
 /* START OR END THE INTRO. clock() answers seconds on the sheet's clock; a
    throw or a non number ends nothing by itself but draws the end state for
    that frame. intro(null) ends it: the face is at rest from that frame, its
    own entrance counted as done, the centre word fades back in and the
    pattern trace waits a moment before it starts. */
 function intro(clock){
  if(typeof clock==='function'){ if(still()) return false; starPlan(); IN={clock,fired:false,last:0}; return true; }
  if(IN){ IN=null; const pn=performance.now(); inEndAt=pn; t0f=(prevNow!=null?prevNow:pn)-99000; sabStart=pn+1500; lastCyc={}; }
  return true;
 }
 function partsFor(idx){ const s=CH.sabs[idx]; if(!s) return []; return s.parts.map(i=>byI[i]).filter(Boolean); }
 function beat(now,amp){ const sd=rnd()*TAU; pulses.push({t0:now,amp,crossed:-1,rim:false,seed:sd}); lastBeat=now; domSeed=sd; }
 const MOTES=[];
 function spawnMote(m,init){ m.rf=Math.pow(rnd(),0.6)*1.08; m.r0=m.rf; m.vr=0; m.ox=m.oy=m.vx=m.vy=0; m.a=rnd()*TAU; m.life=6+rnd()*10; m.age=init?rnd()*m.life:0; m.s=0.5+rnd()*1.2; m.seed=rnd()*100; }
 for(let k=0;k<300;k++){ const m={}; spawnMote(m,true); MOTES.push(m); }
 /* a word said, the amplified file's onWord: a wavefront sized by the word,
    and a second, full one where a sentence ends */
 function wordWave(wd){ const len=String(wd||'').replace(/[^A-Za-z0-9]/g,'').length;
  waves.push({t0:performance.now(),amp:clamp(0.35+len*0.07,0.35,1)});
  if(/[.!?]$/.test(wd)) waves.push({t0:performance.now()+120,amp:1});
  wordE=1; }
 /* the file's click and touch, in this canvas's own coordinates rather than the window's */
 function poke(x,y){ const b=canvas.getBoundingClientRect(); clickP={t0:performance.now(),x:x-b.left,y:y-b.top}; pendClick={x:clickP.x,y:clickP.y}; }
 canvas.addEventListener('click',e=>poke(e.clientX,e.clientY));
 canvas.addEventListener('touchstart',e=>{ if(e.touches&&e.touches[0]) poke(e.touches[0].clientX,e.touches[0].clientY); },{passive:true});

 /* ---- input 3: the sniffer, parseStory on the turn ---- */
 /* what the engine resolved each seat to, from its own imprints: the
    addresses it lands on, and the fetter carrying the most of the seat's
    charge among them. Keyed by ring. */
 function imprintsBySeat(p){
  const out={};
  (p.imprints||[]).forEach(m=>{ const ring=SEATNM.indexOf(m.band); if(ring<0) return;
   const o=out[ring]||(out[ring]={addrs:[],amt:{}});
   if(m.node!=null&&byI[m.node]&&o.addrs.indexOf(m.node)<0) o.addrs.push(m.node);
   if(m.fetter) o.amt[m.fetter]=(o.amt[m.fetter]||0)+(+m.amt||0); });
  Object.keys(out).forEach(k=>{ const o=out[k]; o.fet=Object.keys(o.amt).sort((a,b)=>o.amt[b]-o.amt[a])[0]||null; });
  return out;
 }
 function startReading(imp,hk){
  for(const k in RD.seats) clearTimeout(RD.seats[k].timer); RD.id++; clearTimeout(holdTimer);
  RD.on=true; RD.closed=false; RD.seats={}; RD.order=[]; RD.imp=imp; RD.hk=hk||{}; engaged=true;
  for(const k in resFx) delete resFx[k]; rawFx.length=0;
  stateWord='Listening';
 }
 function fireHit(ring){
  const pn=performance.now(); lastEvent=pn;
  const st=RD.seats[ring]||(RD.seats[ring]={ring,resolved:false,timer:0,addrs:new Set()});
  /* the addresses this seat will land on, held as a cross until it decides */
  const ad=(RD.imp[ring]&&RD.imp[ring].addrs)||[];
  ad.forEach(i=>{ st.addrs.add(i); flares[i]={t0:pn,s:1.15}; });
  rawFx.push({ring,addrs:ad,t0:pn,jit:ad.map(()=>[rnd()-0.5,rnd()-0.5]),landed:false});
  if(st.resolved){ st.resolved=false; if(resFx[ring]) resFx[ring].rel=pn; }
  clearTimeout(st.timer); st.timer=setTimeout(()=>resolveSeat(ring),760);
 }
 function resolveSeat(ring){
  const st=RD.seats[ring]; if(!st||st.resolved) return; clearTimeout(st.timer); st.resolved=true;
  const m=RD.imp[ring];
  /* a seat the engine landed nothing on does not resolve: the ledger fell
     back to the seat's most common tone, a rule the real parse does not
     have, so here the raw hit stands alone and fades */
  if(!m||!m.addrs.length) return;
  /* the reading's point on the ring is placed in draw, off where its
     addresses are on that frame, because in this layout they move */
  resFx[ring]={ring,fet:m.fet,addrs:m.addrs.slice(),t0:performance.now(),rel:0,ping:0}; lastEvent=performance.now();
  if(!RD.order.includes(ring)) RD.order.push(ring);
  stateWord='Found';
 }
 const HOLD=12000;
 function hold(id){ clearTimeout(holdTimer); holdTimer=setTimeout(()=>{ if(RD.id===id) releaseReading(); },HOLD); }
 function closeStory(){
  const id=RD.id; const pending=Object.values(RD.seats).filter(s=>!s.resolved);
  stateWord='Weighing'; hook('onClose');
  pending.forEach((s,k)=>setTimeout(()=>{ if(RD.id===id) resolveSeat(s.ring); },RM?0:k*380));
  /* the amplified file closes the reading here, once every seat has
     weighed; the pie's climb up three compound orbits that used to sit
     between this and the hold went with the orbits */
  setTimeout(()=>{ if(RD.id!==id) return; RD.closed=true; stateWord=speaking?'Answering':'Holding'; hold(id); hook('onHold'); },RM?0:pending.length*380+1100);
 }
 function releaseReading(){
  /* the reading is held while the voice is still saying something about it;
     the voice's own end starts the hold again (voiceEnd) */
  if(speaking) return;
  RD.on=false; const pn=performance.now();
  for(const k in resFx) if(!resFx[k].rel) resFx[k].rel=pn;
  setTimeout(()=>{ if(!RD.on&&!speaking) stateWord=IDLE; },2200);
 }
 /* the ledger's word clock, kept for the person's own words, which arrive
    whole and carry no timing anywhere in the product (gap a, above) */
 let wordTimers=[];
 function wordGaps(words){ const base=60000/160; return words.map(wd=>base*(0.55+0.45*wd.replace(/[^A-Za-z0-9]/g,'').length/5)+(/[,;:]$/.test(wd)?180:0)+(/[.!?]$/.test(wd)?380:0)); }
 /* called by srcTurnCommit (ui/storyui.js) with the turn it was handed, and
    by the intro (ui/srcintro.js) with its one example and three hooks, so the
    intro's captions land on this clock and never on a second copy of it:
    onWord({k,w}) as word k is read, onHit({k,n,ring,seat,key,col}) as a
    counted hit fires on the n words ending at k, onClose() as the story
    closes and the open seats are weighed, and onHold() once the reading is
    closed and held. A hook rides one reading only: the next read or a
    clear() drops it with the reading it belonged to. */
 /* WHAT A READING OF THIS TEXT WILL DO, WITHOUT DOING IT. The words on the
    face's clock and the counted hits that will fire on them, worked out
    exactly as read() works them out, because read() asks this. The intro
    lays its sentence out from it before the first word is read, so a skip
    or reduced motion can show the whole end frame at once, and the face and
    the caption cannot disagree about which words a hit lands on. null where
    read() would not read at all. */
 function plan(text){
  text=String(text||'').trim(); if(!text) return null;
  /* THE DOOR IS A DOOR AND NOT AN ALARM, the guard uniApply carries: a face
     that visibly reacted the moment srcSafe tripped would be the escalation
     the crisis ruling rules out, in a different channel */
  if(typeof srcSafe==='function'&&(srcSafe(text)||(typeof ST_TEXT==='string'&&srcSafe(ST_TEXT)))) return null;
  if(typeof parseStory!=='function'||typeof normMap!=='function') return null;
  const p=parseStory(text), nm=normMap(text);
  const words=nm.s.trim().split(/\s+/).filter(Boolean);
  /* the counted hits that name a seat. parseStory has already sent a denied
     hit to p.denied and one about someone else to p.others, so neither is
     here; an adjective hit names a charge and no seat, and coherent is not a
     seat. A phrase lands on its last word, the ledger's own rule. */
  const at=[];
  (p.hits||[]).forEach(h=>{ if(h.kind==='adj'||!h.band||h.band==='coherent') return;
   const ring=SEATNM.indexOf(K2BAND[h.band]); if(ring<0) return;
   const n=String(h.t||'').split(' ').length;
   const k=nm.s.slice(0,h.at).trim().split(/\s+/).filter(Boolean).length+n-1;
   at.push({k:Math.min(k,Math.max(0,words.length-1)),n,ring,seat:SEATNM[ring],key:h.band,col:SEATCOL[ring]}); });
  return {p,words,hits:at};
 }
 function read(text,opts){
  const pl=plan(text); if(!pl) return;
  RM=still();
  const words=pl.words, at=pl.hits;
  wordTimers.forEach(clearTimeout); wordTimers=[];
  const hk={}; ['onWord','onHit','onClose','onHold'].forEach(n=>{ if(opts&&typeof opts[n]==='function') hk[n]=opts[n]; });
  startReading(imprintsBySeat(pl.p),hk);
  const gaps=wordGaps(words); let acc=0;
  words.forEach((wd,k)=>{ const fire=at.filter(a=>a.k===k);
   /* no wordWave here, the same report as speakLvl in paint: a wavefront a
      word is what a word said looks like, and on this clock nothing is said.
      The real voice still throws one a word as it reaches it (voiceTick),
      and the hits below still flare their seats, which is the reading */
   wordTimers.push(setTimeout(()=>{ lastInput=performance.now(); hook('onWord',{k,w:wd});
    fire.forEach(a=>{ fireHit(a.ring); hook('onHit',{k:a.k,n:a.n,ring:a.ring,seat:a.seat,key:a.key,col:a.col}); }); },RM?0:acc));
   acc+=gaps[k]; });
  wordTimers.push(setTimeout(closeStory,RM?0:acc+300));
 }

 /* ---- input 5: the real voice ---- */
 /* the element stSrcSpeak plays, with the words it says and where each word
    falls in it, by the ledger's own lengths and pauses (gap b, above) */
 let VO=null;
 const SEATWORD={}; Object.keys(K2BAND).forEach(k=>{ SEATWORD[k]=SEATNM.indexOf(K2BAND[k]); });
 function voiceEnd(el){
  if(!VO||VO.el!==el) return; VO=null; speaking=false; lastEvent=performance.now();
  if(RD.on&&RD.closed){ stateWord='Holding'; hold(RD.id); } else if(!RD.on) stateWord=IDLE;
 }
 function voice(el,text){
  if(!el||typeof el.addEventListener!=='function') return;
  const words=String(text||'').trim().split(/\s+/).filter(Boolean);
  const gaps=wordGaps(words), tot=gaps.reduce((a,b)=>a+b,0)||1; let acc=0;
  const starts=gaps.map(g=>{ const s=acc/tot; acc+=g; return s; });
  VO={el,raw:words,words:words.map(w=>w.replace(/[^A-Za-z0-9]/g,'').toLowerCase()),starts,idx:-1};
  el.addEventListener('playing',()=>{ if(!VO||VO.el!==el) return; speaking=true; engaged=true; lastInput=performance.now(); waves.push({t0:performance.now(),amp:0.8});
   /* a closed reading is answered too. This read !RD.on alone, so a line
      spoken over a reading the face was holding left the centre on
      Holding while the voice talked about it, which is the one moment the
      intro's spoken line exists for; a story still being read keeps its
      Listening, since the person's own words are still arriving */
   if(!RD.on||RD.closed) stateWord='Answering'; });
  ['ended','pause','error','emptied'].forEach(ev=>el.addEventListener(ev,()=>voiceEnd(el)));
 }
 /* where the voice is, read off the element each frame: every word it
    reaches throws its wavefront, and a seat it names rings once at that
    seat's resolved point, the amplified file's ping */
 function voiceTick(){
  if(!VO||!speaking) return;
  const el=VO.el, d=el.duration, t=el.currentTime;
  if(!(d>0&&isFinite(d))||!(t>=0)) return;
  const f=t/d; let k=VO.idx;
  while(k+1<VO.starts.length&&VO.starts[k+1]<=f) k++;
  for(let j=VO.idx+1;j<=k;j++){ wordWave(VO.raw[j]); const r=SEATWORD[VO.words[j]];
   if(r!==undefined&&r>=0&&resFx[r]) resFx[r].ping=performance.now(); }
  if(k!==VO.idx){ VO.idx=k; lastInput=performance.now(); }
 }

 const fs0='Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';
 let t0f=null, prevNow=null;

 function draw(now){
  if(!running) return; raf=requestAnimationFrame(draw);
  paint(now);
 }
 /* ONE FRAME, PAINTED NOW. draw is the loop; paint is the frame, split out
    17 November so a host change can repaint at its new size in the same
    task that moved it. Until then the canvas carried its old bitmap into a
    new box for one frame, stretched to the box's shape: measured on the
    boot's hand over, a 489 pixel square face shown for a frame across a
    900 by 420 Journal box. show() and refit() call it; nothing else does. */
 function paint(now){
  /* the voice is followed ahead of the size check: the desktop hero view
     mounts #stuni zero wide, measured 16 November, and a face with no room
     to draw must still know where the voice is, or the pings and the hold
     it drives land late once the box has a size */
  RM=still(); voiceTick();
  fit(); if(!(W0>0&&H0>0)) return;
  if(t0f===null) t0f=now;
  const dt=prevNow===null?0.016:clamp((now-prevNow)/1000,0,0.05); prevNow=now;
  const t=RM?0:now/1000;
  /* the intro's clock, when one is lent; reduced motion never reads it */
  let it=null;
  if(IN&&!RM){ try{ it=+IN.clock(); }catch(e){ it=null; } if(!isFinite(it)) it=null; else IN.last=it; }
  const INT=it!==null;
  const boot=RM||INT?99:Math.max(0,(now-t0f)/1000);
  const w=W0,h=H0, cx=w/2, cy=h/2;
  const U=Rf/430;
  const breath=RM?0:Math.sin(t*TAU/5.6);
  /* THE INTRO'S ENVELOPES, each 1 outside the intro so the ordinary face is
     untouched. lensE: the dark lens, its wash and its bezel arrive once the
     stars are gathering, so the stars first float in open black. rimK: the
     law ticks and field anchors, last. */
  const lensE=INT?EOUT((it-IT.lens0)/(IT.lens1-IT.lens0)):1;
  const rimK=INT?EOUT((it-IT.rim0)/(IT.rim1-IT.rim0)):1;
  /* THE BREATH, VISIBLE. 0.6 percent of the radius is the house breath, felt
     more than seen. From the first beat of life the intro breathes at 2.8
     percent on a 2.8 second breath, inhale first, then hands back to the
     house breath over the settle, so the face that lands in the Journal is
     breathing exactly as it always does there */
  let brA=0.006, br=breath;
  if(INT&&it>IT.life){ const s=easeInOut((it-IT.settle)/(IT.end-IT.settle));
   brA=mix(mix(0.006,0.028,easeOut((it-IT.life)/0.5)),0.006,s);
   br=mix(Math.sin(TAU*(it-IT.life)/IT.breath),breath,s); }
  const brG=INT&&it>IT.life?br*brA/0.028:0;
  /* the structure, which never reaches the face edge */
  const R=Rf*0.80*(1+brA*br);
  /* TEXT TIERS, the mockup's: a resolved seat's name is dropped below a face
     of 140, where an 11 pixel label would cover the rings it names, and the
     canvas title carries the meaning */
  const TX={res:Rf>=140};
  const pn=performance.now();
  ctx.setTransform(DPR,0,0,DPR,0,0); lx.setTransform(DPR,0,0,DPR,0,0);

  /* coherence, eased; the gate itself is hard at 92, and no reading is not a lock */
  const cp=easeInOut((now-cqT0)/CQ_DUR); cqv=mix(cqFrom,cqTo,cp);
  const isHi=CQ!=null&&cqv>=HI_GATE;
  /* the intro locks the rings at IT.lock with no reading behind it: the
     shape it shows is the instrument at rest, not a score, and the CQ arc
     below still draws only the reading's own figure. Once the intro ends
     the lock lets go over 1.6 seconds and not 0.45, so the face that has
     just landed in the Journal settles into its real state rather than
     dropping its lattice the moment it arrives */
  const lockI=INT&&it>=IT.lock;
  const hiTau=(!INT&&pn-inEndAt<3500)?1.6:0.45;
  hiE+=((isHi||lockI?1:0)-hiE)*(1-Math.exp(-dt/hiTau)); if(RM) hiE=isHi?1:0;
  /* the lock lands as one large beat; inside the intro that beat is the
     beat of life, below, and not the moment the lattice starts */
  if(isHi&&!wasHi&&!RM&&!INT){ beat(now,1.35); pPh=0; }
  wasHi=isHi;
  /* 0.4 at the amplified profile's 60, 0 at 100. No reading has no disorder
     to show, so it rests at the floor driftK keeps below, the least life
     the file allows a field */
  const disorder=CQ==null?0:clamp(1-cqv/100,0,1);
  /* at rest, see engaged: no beat, no trace, and nothing the beat would throw */
  const rest=!engaged;

  /* SPEAKING IS THE VOICE AND NOTHING ELSE, 17 November, his report: "the
     source AI starts playing, even though there's no dialogue being
     spoken." This read speaking||(RD.on&&!RD.closed), ported from the
     amplified file, which spoke the story aloud and so was speaking through
     it. Nothing here speaks the person's turn: read() replays it on a
     silent word clock. So every turn held speakLvl at 1.0 for the whole
     clock, about nine seconds on a two sentence turn, with no audio element
     ever made (measured on the Dashboard: lis 1.0 from 1.5s to 8.8s,
     SRC_VOICE.el null, no play() called). It was there before tonight, and
     tonight is when it showed: the face now stands on the Dashboard
     whenever there is a reading and a reply prints after every turn, so a
     face mouthing over a printed line read as a voice that never came.
     `speaking` is set only by the element's own playing event and cleared
     by its ended, pause, error and emptied (voice, voiceEnd, below), which
     is the one real signal that a line is being heard */
  speakLvl+=((speaking?1:0)-speakLvl)*(1-Math.exp(-dt/0.35));
  wordE*=Math.exp(-dt/0.18); rimE*=Math.exp(-dt/0.55);
  for(let k=rimWaves.length-1;k>=0;k--) if(now-rimWaves[k].t0>2600) rimWaves.splice(k,1);

  /* ---- the centre beat: constant background cognition, its own clock ----
     ordinary: 5.4s with a little variability and a second, softer beat 260ms on.
     high coherence: about 4.2s, the rings locked in phase while the shared tempo drifts the way a
     healthy heart does, every beat a little different in strength, and the soft dub kept 300ms on. */
  /* THE BEAT OF LIFE. Anticipation first: the centre draws in over the 280ms
     before it, on the same curve the ordinary beat's own draw in uses, then
     one beat at the lock's own 1.35, and the ordinary clock starts from
     nought behind it so the next beat is a full period away. And at rest,
     see engaged above: no beat fires at all until a story is actually
     underway, which is the fix for "I haven't said anything... and the
     animations are going haywire." */
  if(INT&&!IN.fired&&it>=IT.life){ IN.fired=true; beat(now,1.35); pPh=0; }
  if(!RM && boot>0.4 && !rest && (!INT||it>=IT.life)){
   const period=mix(5.4*(1+0.07*Math.sin(t*0.23)+0.04*Math.sin(t*0.61)),4.2*(1+0.045*Math.sin(t*0.19)+0.025*Math.sin(t*0.53+1.3)),hiE);
   curPeriod=period; pPh+=dt/period;
   if(pPh>=1){ pPh-=1; const amp=0.9+0.2*rnd(); beat(now,amp); pulses.push({t0:now+mix(260,300,hiE),amp:mix(0.42,0.22,hiE)*amp,crossed:-1,rim:false,dub:1,seed:rnd()*TAU}); }
  }
  const PT=3.0;
  function pulseR(p){ const x=clamp(Math.max(0,(now-p.t0)/1000)/PT,0,1); return R*1.12*(1-Math.pow(1-x,2.2)); }
  function pulseAt(rr,lag,ang){
   let s=0; for(const p of pulses){ if(now<p.t0) continue; const x=Math.max(0,(now-p.t0)/1000)/PT; if(x>=1) continue;
    const wr=pulseR(p)-(lag||0)*R; const wW=R*(0.05+0.05*x); const q=(rr-wr)/wW; let v=p.amp*Math.pow(1-x,1.3)*Math.exp(-q*q);
    if(ang!==undefined && !RM) v*=0.75+0.25*Math.sin(2*ang+p.seed);
    s+=v; }
   return s;
  }
  /* anticipation: the centre draws in over the last 12 percent of the period, then releases */
  const sinceBeat=Math.max(0,(now-lastBeat)/1000);
  const pre=RM?0:INT&&it<IT.life?easeInOut((it-(IT.life-0.28))/0.28):(pPh>0.88?easeInOut((pPh-0.88)/0.12):0);
  const beatE=RM?0:Math.exp(-sinceBeat/0.32);

  /* ring rotation: ordinary, the seats counter turn at their own rates; high coherence, they lock and turn as one */
  for(let r=0;r<7;r++){ const own=(r%2?-1:1)*0.055/(1+r*0.5); rotA[r]+=RM?0:dt*mix(own,0.03,hiE); }
  /* pull each ring's phase into register, so the lock is visible, not only the rate */
  if(hiE>0.001&&!RM){
   for(let r=1;r<7;r++){ if(!ringList[r].length) continue; let d=(rotA[0]-rotA[r])%(TAU/ringList[r].length); rotA[r]+=d*hiE*dt*0.6; }
  }

  function dispS(rr){ let d=0; for(const wv of waves){ const age=Math.max(0,(now-wv.t0)/1000); const wr=R*1.12*easeOut(age/1.1); const q=(rr-wr)/(R*0.07); d+=wv.amp*Math.exp(-q*q)*(1-clamp(age/1.1,0,1)); } return d; }
  /* high coherence means the parts move together, not that they stop */
  const wobK=RM?0:0.018*(1-0.2*hiE);
  /* each seat ring is a living membrane: two slow travelling lobes, held to 60 percent when locked */
  const membK=RM?0:mix(1,0.6,hiE);
  function memb(i,th,base){ if(!membK) return 0; return membK*(base*(0.004*Math.sin(3*th+t*0.31+i)+0.0025*Math.sin(5*th-t*0.47+2*i))+R*0.003*Math.sin(2*th+0.23*t+i*1.7)); }
  const dirMul=th=>RM?1:0.75+0.25*Math.sin(2*th+domSeed);
  /* springs: every address and every ring is thrown by the beat, overshoots about 20 percent and settles
     in about 650ms (stiffness 140, damping 11). Inner rings are reached first, so they settle first. */
  const SLIM=R*0.02;
  if(!RM){
   if(pendClick){ const c=pendClick; pendClick=null; const rad=R*0.25;
    for(const a of addrs){ const dx=a.lx-c.x, dy=a.ly-c.y, d=Math.hypot(dx,dy); if(d>=rad) continue; const ux=Math.cos(a.la||0), uy=Math.sin(a.la||0); const k=1-d/rad; const dot=d>0.5?(dx*ux+dy*uy)/d:1; a.sv+=R*0.55*k*(0.35+0.65*Math.abs(dot))*(dot<0?-1:1); }
    for(const m of MOTES){ const mx=cx+Math.cos(m.a)*m.rf*R+m.ox, my=cy+Math.sin(m.a)*m.rf*R+m.oy; const dx=mx-c.x, dy=my-c.y, d=Math.hypot(dx,dy); if(d>=rad||d<0.5) continue; const k=(1-d/rad); m.vx+=dx/d*260*k; m.vy+=dy/d*260*k; } }
   const n=Math.max(1,Math.ceil(dt/0.008)), hs=dt/n;
   const drive=[]; for(let i=0;i<7;i++){ const base=R*((i+1.6)/8); drive.push(pulseAt(base,0.03)*R*0.0225); }
   for(const a of addrs){ const ang0=a.spreadAng-PI/2+rotA[a.ring]; const tg=pulseAt(R*a.rf,0.03,ang0)*R*0.0225;
    for(let q=0;q<n;q++){ a.sv+=(140*(tg-a.sx)-11*a.sv)*hs; a.sx+=a.sv*hs; } }
   for(let i=0;i<7;i++){ for(let q=0;q<n;q++){ ringV[i]+=(140*(drive[i]-ringS[i])-11*ringV[i])*hs; ringS[i]+=ringV[i]*hs; } }
  } else pendClick=null;
  /* a soft limit, never a hard stop, keeps every dot on its own seat */
  const soft=x=>SLIM*Math.tanh(x/SLIM);

  /* ---- reading state: while Source reads a story the pattern trace stands aside ---- */
  readE+=((RD.on?1:0)-readE)*(1-Math.exp(-dt/0.45)); if(RM) readE=RD.on?1:0;
  if(RD.on&&readE>0.9) sabStart=now+400;
  /* the trace stands aside at rest the same way, held one step short of starting */
  if(rest) sabStart=now+400;
  /* ---- pattern timing ---- */
  let cyclePos=Math.max(0,now-sabStart);
  if(speaking) cyclePos=Math.min(cyclePos,SAB_HOLD-1);
  if(cyclePos>=SAB_HOLD+SAB_FADE){ sabIdx=(sabIdx+1)%Math.max(1,CH.sabs.length); sabStart=now; cyclePos=0; lastCyc={}; }
  const preSab=now<sabStart;
  const fadeIn=preSab?0:Math.min(1,cyclePos/500);
  const fadeOut=cyclePos>SAB_HOLD?1-easeInOut((cyclePos-SAB_HOLD)/SAB_FADE):1;
  /* the pattern trace stands aside for the whole intro: staging, one thing
     at a time, and the sky is the thing */
  const traceAlpha=INT?0:(preSab?0:fadeIn*fadeOut)*(1-readE);
  const lit=preSab||INT?[]:partsFor(sabIdx);
  const litSeats=new Set(lit.map(a=>a.ring));
  function litScale(ms){ if(ms<160){const p=ms/160;return 1-0.15*p*p;} if(ms<560){ const x=(ms-160)/400, c1=1.56,c3=c1+1; return 0.85+0.5*(1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)); } return 1.35; }
  const lsc=RM?1.35:1+(litScale(cyclePos)-1)*fadeOut;

  /* 1.01 at CQ 60, floored at 0.35 so a locked field still lives */
  const driftK=RM?0:Math.max(0.35,(0.25+1.9*disorder)*(1-0.75*hiE));
  function pos(a){
   const dA=driftK*(0.03*Math.sin(t*a.f1+a.p1)+0.012*Math.sin(t*a.f2*1.7+a.p2));
   const ang=a.spreadAng-PI/2+rotA[a.ring]+dA;
   const base=R*a.rf*(1+wobK*Math.sin(t*1.05-a.ring*0.85));
   let rr=base+memb(a.ring,ang,base);    // the address rides its own ring's membrane
   rr+=driftK*R*0.011*Math.sin(t*a.f3+a.p3);
   rr+=soft(a.sx);                       // the beat throws each address outward on its spring
   rr+=dispS(rr)*R*0.035;
   rr=Math.min(rr,R*0.985);
   if(INT){ const s=STAR[a.i]; if(s) return gather(a,s,rr,ang); }
   return {x:cx+Math.cos(ang)*rr,y:cy+Math.sin(ang)*rr,rr,ang,g:1};
  }
  /* THE GATHER. A star sits where the sky put it, drifting a little, until
     its seat's turn; then it travels to its own place on its ring. The
     radius lands on the house overshoot, cubic-bezier(.34,1.56,.64,1), and
     the angle on the house ease out, cubic-bezier(.22,1,.36,1), over 660ms,
     so the two arrive together and the path between is an arc, never a
     line. The swirl is the arc's belly: 0.55 of a radian at the middle of
     the trip, all one way, nought at both ends, so the whole sky turns as
     it falls into order. Ahead of the gather every star eases 6 percent
     outward: the inhale before the move. q.g is how far its trip has gone,
     which the dots below read to hand their twinkle over to the face's. */
  function gather(a,s,rr,ang){
   const g0=IT.gather+a.ring*IT.beat+s.j, u=(it-g0)/IT.gDur, uc=clamp(u,0,1);
   const gR=u<=0?0:u>=1?1:OVS(u), gA=EOUT(u);
   const an=easeInOut((it-IT.antic)/(IT.gather-IT.antic))*(1-uc);
   const sa=s.a+0.05*Math.sin(t*0.31+s.ph), sr=R*s.r*(1+0.06*an);
   const d=((ang-sa)%TAU+TAU+PI)%TAU-PI;
   const A2=sa+d*gA+0.55*Math.sin(PI*uc), R2=Math.max(0,mix(sr,rr,gR));
   return {x:cx+Math.cos(A2)*R2,y:cy+Math.sin(A2)*R2,rr:R2,ang:A2,g:uc,an};
  }

  /* ======== base: the face floats in the page ========
     the file filled the window #030304 and lit a faint halo outside the
     face. Neither is drawn: in this box the fill is the dark frame he ruled
     out round Uni on 10 November, and the halo would be cropped square by
     the box. The face itself is the file's, a lens that darkens to its rim. */
  ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1;
  ctx.clearRect(0,0,w,h);
  ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,Rf,0,TAU); ctx.clip();
  { const fg=ctx.createRadialGradient(cx,cy,0,cx,cy,Rf); fg.addColorStop(0,'#0b0a0d'); fg.addColorStop(1,'#060608');
   ctx.globalAlpha=lensE; ctx.fillStyle=fg; ctx.fillRect(cx-Rf,cy-Rf,Rf*2,Rf*2); ctx.globalAlpha=1; }
  ctx.globalCompositeOperation='lighter';
  for(let k=0;k<7;k++){
   const a=k*0.9+t*0.034*(k%2?1:-1), rr=Rf*(0.22+0.15*Math.sin(t*0.07+k));
   const nx=cx+Math.cos(a)*rr, ny=cy+Math.sin(a*1.3)*rr*0.8;
   const lift=litSeats.has(k)?0.05*traceAlpha:0;
   blit(ctx,NEB[k],nx,ny,Rf*(1.3+0.15*Math.sin(t*0.07+k*2)),(0.085+lift+0.035*speakLvl)*(1-0.15*hiE)*(0.75+0.25*Math.sin(t*0.3+k))*(1+0.25*beatE)*clamp(boot/1.2,0,1)*lensE*(1+0.3*brG));
  }
  blit(ctx,GOLDH,cx,cy,R*(2.4+0.4*hiE)*(1+0.04*brG),(0.05+0.05*speakLvl+0.05*wordE+0.07*hiE+0.06*beatE+0.03*brG)*lensE);
  /* spherical depth: the face darkens toward its rim, like a lens */
  ctx.globalCompositeOperation='source-over';
  { const vg=ctx.createRadialGradient(cx,cy,Rf*0.55,cx,cy,Rf); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,'+(0.42*lensE)+')');
   ctx.fillStyle=vg; ctx.fillRect(cx-Rf,cy-Rf,Rf*2,Rf*2); }
  ctx.restore();

  lx.globalCompositeOperation='source-over'; lx.clearRect(0,0,w,h); lx.globalCompositeOperation='lighter';

  /* ---- seven seat rings ---- */
  const ringBase=[];
  for(let i=0;i<7;i++){
   const ba=clamp((boot-i*0.09)/0.5,0,1);
   const base=R*((i+1.6)/8)*(1+wobK*Math.sin(t*1.05-i*0.85));
   ringBase.push(base); if(ba<=0) continue;
   /* in the intro each ring draws itself closed from twelve o'clock,
      clockwise, 300ms after its first stars leave and over 550ms, so the
      ring is finished as its last star lands on it; a spark rides the head */
   const sw=INT?easeInOut((it-(IT.gather+i*IT.beat+0.30))/0.55):1; if(sw<=0) continue;
   const wave=RM?0:0.5+0.5*Math.sin(t*1.05-i*0.85);
   const pb=pulseAt(base);
   const r0=base+dispS(base)*R*0.035, rs=soft(ringS[i]);
   const path=new Path2D(), qn=sw>=1?128:Math.max(1,Math.ceil(128*sw)); let hx=cx,hy=cy;
   for(let q=0;q<=qn;q++){ const th=Math.min(q/128,sw)*TAU-PI/2; const rr=Math.min(r0+memb(i,th,base)+rs*dirMul(th),R*0.99); const x=cx+Math.cos(th)*rr, y=cy+Math.sin(th)*rr; q?path.lineTo(x,y):path.moveTo(x,y); hx=x; hy=y; }
   if(sw>=1) path.closePath();
   else{ blit(lx,HALO[i],hx,hy,22*Math.max(U,0.4),0.55*(1-sw*0.5)); blit(lx,HOT,hx,hy,7*Math.max(U,0.4),0.8*(1-sw*0.6)); }
   const col=mixc(rgb(SEATCOL[i]),[236,214,168],0.5*hiE);
   ctx.globalAlpha=1; ctx.lineWidth=1; ctx.strokeStyle=`rgba(${col.join(',')},${(0.12+0.07*wave+0.06*speakLvl+0.14*hiE+0.3*pb)*ba})`; ctx.stroke(path);
   const glow=(litSeats.has(i)?0.32*traceAlpha:0)+0.4*pb+0.12*hiE+(RM?0:Math.min(0.25,Math.abs(ringV[i])/(R*0.25)));
   if(glow>0.01){ lx.globalAlpha=1; lx.strokeStyle=`rgba(${col.join(',')},${Math.min(1,glow*ba)})`; lx.lineWidth=1.4; lx.stroke(path); }
  }

  /* ---- the beat, drawn: felt more than seen in the ordinary state ---- */
  for(let k=pulses.length-1;k>=0;k--){ const p=pulses[k]; if(now<p.t0) continue; const age=Math.max(0,(now-p.t0)/1000); const x=age/PT;
   if(x>=1){ pulses.splice(k,1); continue; }
   const wr=Math.max(0,Math.min(pulseR(p),R*1.12)); const env=p.amp*Math.pow(1-x,1.3);
   const col=mixc([236,220,190],[240,206,140],hiE);
   const wpath=new Path2D();
   for(let q=0;q<=96;q++){ const th=q/96*TAU; const rr=wr*(1+(RM?0:0.004*Math.sin(3*th+t*0.31+k)+0.0025*Math.sin(5*th-t*0.47+2*k))); const x2=cx+Math.cos(th)*rr, y2=cy+Math.sin(th)*rr; q?wpath.lineTo(x2,y2):wpath.moveTo(x2,y2); }
   wpath.closePath();
   [[7,0.035+0.05*hiE],[1.3,0.10+0.18*hiE]].forEach(([lw,al])=>{ lx.globalAlpha=1;
    let st=`rgba(${col.join(',')},${al*env})`;
    if(!RM && lx.createConicGradient){ const g=lx.createConicGradient(0,cx,cy); for(let q=0;q<=16;q++){ const th=q/16*TAU; g.addColorStop(q/16,`rgba(${col.join(',')},${clamp(al*env*(0.75+0.25*Math.sin(2*th+p.seed))*1.15,0,1)})`); } st=g; }
    lx.strokeStyle=st; lx.lineWidth=lw*Math.max(U,0.4); lx.stroke(wpath); });
   /* the beat is handed outward ring by ring: as it crosses a seat, two of its addresses fire into the next seat */
   while(p.crossed<6 && ringBase[p.crossed+1]!==undefined && wr>=ringBase[p.crossed+1]){
    p.crossed++; const r=p.crossed; if(r>=6||p.amp<0.3||!ringList[r].length||!ringList[r+1].length) continue;
    const n=Math.round(2+3*hiE)*(p.dub?0:1)+(p.dub?1:0);
    for(let s=0;s<n;s++){ const A=ringList[r][Math.floor(rnd()*ringList[r].length)]; sparks.push({A,r,t0:now+s*70+rnd()*60,dur:0.3+0.4*rnd(),cv:(0.08+0.22*rnd())*(rnd()<.5?-1:1),amp:p.amp}); }
   }
   if(!p.rim && wr>=R*1.06){ p.rim=true; if(!p.dub){ rimE=Math.max(rimE,p.amp*(0.45+0.55*hiE)); if(!RM) rimWaves.push({t0:now,amp:p.amp}); } }
  }

  /* ---- rim: 21 law ticks (gap c, above: nothing here names one law) ---- */
  const ta=clamp((boot-0.5)/0.6,0,1)*rimK;
  for(let i=0;i<21;i++){
   const ang=(i/21)*TAU-PI/2; const major=i%3===0;
   const scan=RM?0:Math.pow(Math.max(0,Math.cos(ang+PI/2-t*0.42)),24);
   /* at high coherence every law reads full; each beat then travels round the rim from the top, down both
      sides 45ms a tick, and closes at the bottom about 450ms later. Each tick shimmers on its own clock. */
   const dI=Math.min(i,21-i); let rw=0;
   for(const q of rimWaves){ const ag=(now-q.t0)/1000-dI*0.045; if(ag>0) rw=Math.max(rw,q.amp*(ag<0.05?ag/0.05:Math.exp(-(ag-0.05)/0.42))); }
   const twk=RM?0:0.08*Math.sin(t*(0.7+0.05*i)+i*2.1);
   const e=clamp(Math.max(scan*(0.55*(1-hiE)+0.25*hiE),hiE*(0.55+0.45*rw),0.6*rw)+twk*(0.4+0.6*hiE),0,1)*rimK;
   const r0=R*(major?0.99:1.005)-e*R*0.012, r1=R*1.045+e*R*0.008;
   const c0=Math.cos(ang), s0=Math.sin(ang);
   ctx.globalAlpha=1; ctx.beginPath(); ctx.moveTo(cx+c0*r0,cy+s0*r0); ctx.lineTo(cx+c0*r1,cy+s0*r1);
   ctx.strokeStyle=`rgba(216,213,204,${(major?0.42:0.2)*ta})`; ctx.lineWidth=major?1.3:0.8; ctx.stroke();
   if(e>0.02){ lx.globalAlpha=1; lx.beginPath(); lx.moveTo(cx+c0*r0,cy+s0*r0); lx.lineTo(cx+c0*r1,cy+s0*r1); lx.strokeStyle=`rgba(255,226,170,${e*0.9})`; lx.lineWidth=2; lx.stroke(); blit(lx,HOT,cx+c0*r1,cy+s0*r1,(14*e+5)*Math.max(U,0.4),e*0.6); }
  }
  /* the four field anchors, two above the body and two below */
  [-6,6].forEach(off=>{[0,180].forEach(bs=>{
   const ang=(bs+off)*PI/180-PI/2; const pulseA=RM?0.5:0.5+0.2*Math.sin(t*0.8+bs)+0.3*rimE;
   const r0=R*1.13, r1=R*1.17, c0=Math.cos(ang), s0=Math.sin(ang);
   ctx.globalAlpha=1; ctx.beginPath(); ctx.moveTo(cx+c0*r0,cy+s0*r0); ctx.lineTo(cx+c0*r1,cy+s0*r1); ctx.strokeStyle=`rgba(216,213,204,${Math.min(1,pulseA)*ta})`; ctx.lineWidth=1.4; ctx.stroke();
   blit(lx,HOT,cx+c0*r1,cy+s0*r1,9*Math.max(U,0.4),0.25*ta*pulseA);
  });});

  /* ---- gold CQ arc, at the reading's own figure. None while unread. ---- */
  /* in the intro a reading's own arc sweeps in with the beat of life, so a
     returning person sees their real figure arrive; no reading, no arc */
  const cqFrac=CQ==null?0:cqv/100*easeOut((boot-0.8)/1.2)*(INT?EOUT((it-IT.life)/1.2):1);
  if(cqFrac>0.001){
   const Rc=R*1.09, a0=-PI/2, a1=a0+cqFrac*TAU;
   [[6,0.12+0.1*hiE],[3,0.35],[1.5,0.95]].forEach(([lw,al])=>{ lx.globalAlpha=1; lx.beginPath(); lx.arc(cx,cy,Rc,a0,a1); lx.strokeStyle=`rgba(214,178,112,${Math.min(1,al*(0.85+0.15*breath+0.25*speakLvl+0.4*rimE*hiE))})`; lx.lineWidth=lw*Math.max(U,0.4); lx.lineCap='round'; lx.stroke(); });
   lx.lineCap='butt';
   const hx=cx+Math.cos(a1)*Rc, hy=cy+Math.sin(a1)*Rc;
   const gl=0.55+0.25*(RM?0:Math.sin(t*1.6));
   blit(lx,GOLDH,hx,hy,34*U,gl); blit(lx,HOT,hx,hy,Math.max(4,9*U),gl);
   lx.globalAlpha=0.22*gl; lx.drawImage(STREAK,hx-50*U,hy-2.5*U,100*U,5*U);
  }

  /* ---- positions ---- */
  const P={}; addrs.forEach(a=>{ const q=pos(a); P[a.i]=q; a.lx=q.x; a.ly=q.y; a.la=q.ang; });

  /* ---- high coherence lattice: each address bound to its nearest neighbour one seat out ---- */
  if(hiE>0.01){
   lx.globalAlpha=1; lx.lineWidth=0.9;
   for(let r=0;r<6;r++){ for(const a of ringList[r]){ const pa=P[a.i]; let best=null,bd=9;
     for(const b of ringList[r+1]){ let d=Math.abs(((P[b.i].ang-pa.ang)%TAU+TAU+PI)%TAU-PI); if(d<bd){bd=d;best=b;} }
     if(!best) continue;
     const pb=P[best.i]; const mid=(pa.rr+pb.rr)/2; const e=0.13+0.5*pulseAt(mid,0,pa.ang)+(RM?0:0.07*Math.max(0,Math.sin(t*1.1-mid/R*9+a.i*0.7)));
     lx.beginPath(); lx.moveTo(pa.x,pa.y); lx.lineTo(pb.x,pb.y); lx.strokeStyle=`rgba(236,206,148,${hiE*Math.min(0.7,e)*(1-0.75*readE)})`; lx.stroke(); } }
  }

  /* ---- relay sparks: the beat passed from one seat to the next ---- */
  for(let k=sparks.length-1;k>=0;k--){ const s=sparks[k]; if(now<s.t0) continue; const age=Math.max(0,(now-s.t0)/1000);
   const pa=P[s.A.i]; if(!pa){ sparks.splice(k,1); continue; }
   if(!s.B){ let best=null,bd=9; for(const b of ringList[s.r+1]){ let d=Math.abs(((P[b.i].ang-pa.ang)%TAU+TAU+PI)%TAU-PI); if(d<bd){bd=d;best=b;} } s.B=best; }
   if(!s.B||!P[s.B.i]){ sparks.splice(k,1); continue; }
   if(age>s.dur){ flares[s.B.i]={t0:pn,s:0.45*s.amp}; sparks.splice(k,1); continue; }
   const p0=pa, p1=P[s.B.i]; const u=easeInOut(age/s.dur);
   const mx=(p0.x+p1.x)/2, my=(p0.y+p1.y)/2, nx=-(p1.y-p0.y)*s.cv, ny=(p1.x-p0.x)*s.cv;
   const c={x:mx+nx,y:my+ny};
   const colI=mix(s.r,s.r+1,u)>s.r+0.5?s.r+1:s.r;
   const env=Math.sin(PI*clamp(age/s.dur,0,1));
   for(let q=5;q>=0;q--){ const uu=clamp(u-q*0.04,0,1), m=1-uu; const x=m*m*p0.x+2*m*uu*c.x+uu*uu*p1.x, y=m*m*p0.y+2*m*uu*c.y+uu*uu*p1.y; const fall=1-q/6;
    blit(lx,q?HALO[colI]:HOT,x,y,(q?(5+9*fall):6+3*hiE)*Math.max(U,0.4),(q?0.16*fall:0.55)*env*(0.7+0.5*hiE)); }
  }

  /* ---- the saboteur trace: brighter, faster, riding on top of the beat ---- */
  const MU=Math.max(U,0.4);
  function bz(p0,c,p1,u){ const m=1-u; return {x:m*m*p0.x+2*m*u*c.x+u*u*p1.x, y:m*m*p0.y+2*m*u*c.y+u*u*p1.y}; }
  function comet(pa,c,pb,u,col,amp){
   for(let s=9;s>=0;s--){ const uu=clamp(u-s*0.018,0,1); const q=bz(pa,c,pb,uu); const fall=1-s/10;
    blit(lx,HALO[col],q.x,q.y,(8+12*fall)*amp*MU,0.17*fall*amp*traceAlpha); }
   const q=bz(pa,c,pb,u); blit(lx,HOT,q.x,q.y,11*amp*MU,0.9*traceAlpha); blit(lx,HALO[col],q.x,q.y,32*amp*MU,0.34*traceAlpha);
  }
  const pairs=[];
  for(let i=0;i<lit.length;i++) for(let j=i+1;j<lit.length;j++) pairs.push([lit[i],lit[j]]);
  function ctrl(p0,p1){ return {x:(p0.x+p1.x)/2+(cx-(p0.x+p1.x)/2)*0.22, y:(p0.y+p1.y)/2+(cy-(p0.y+p1.y)/2)*0.22}; }
  if(traceAlpha>0.01 && pairs.length){
   pairs.forEach(([A,Bn],k)=>{
    const p0=P[A.i], p1=P[Bn.i]; const c=ctrl(p0,p1);
    const rev=RM?1:easeOut((cyclePos-150-k*90)/520); const end=cyclePos>SAB_HOLD?1-easeInOut((cyclePos-SAB_HOLD)/SAB_FADE):1;
    if(rev<=0) return;
    const [r,g,b]=rgb(SEATCOL[A.ring]);
    [[5,0.08],[1.3,0.5]].forEach(([lw,al])=>{ lx.globalAlpha=1; lx.beginPath(); for(let s=0;s<=40;s++){ const q=bz(p0,c,p1,s/40*rev); s?lx.lineTo(q.x,q.y):lx.moveTo(q.x,q.y);} lx.strokeStyle=`rgba(${Math.min(255,r+70)},${Math.min(255,g+60)},${Math.min(255,b+50)},${al*fadeIn*end*(1-readE)})`; lx.lineWidth=lw*MU; lx.stroke(); });
    if(rev<0.98||RM) return;
    for(let m=0;m<3;m++){
     const ph=(now-sabStart)/1000*0.75+k*0.21+m/3; const cyc=Math.floor(ph), f=ph-cyc; const dir=cyc%2;
     const u=easeInOut(f); const key=k+':'+m;
     if(lastCyc[key]!==undefined && cyc>lastCyc[key] && traceAlpha>0.4) flares[(dir?A:Bn).i]={t0:pn,s:1};
     lastCyc[key]=cyc;
     dir?comet(p1,c,p0,u,Bn.ring,1):comet(p0,c,p1,u,A.ring,1);
    }
   });
  } else if(traceAlpha>0.01 && lit.length===1){
   const A=lit[0], pA=P[A.i];
   for(let m=0;m<3;m++){
    const ph=(now-sabStart)/1000*0.55+m/3; const cyc=Math.floor(ph), f=ph-cyc; const key='s'+m;
    if(lastCyc[key]!==undefined && cyc>lastCyc[key] && traceAlpha>0.4) flares[A.i]={t0:pn,s:1};
    lastCyc[key]=cyc; if(RM) break;
    const u=easeInOut(f);
    for(let s=9;s>=0;s--){ const an=pA.ang+TAU*clamp(u-s*0.012,0,1); const fall=1-s/10; blit(lx,HALO[A.ring],cx+Math.cos(an)*pA.rr,cy+Math.sin(an)*pA.rr,(10+18*fall)*MU,0.22*fall*traceAlpha); }
    const an=pA.ang+TAU*u; const qx=cx+Math.cos(an)*pA.rr, qy=cy+Math.sin(an)*pA.rr;
    blit(lx,HOT,qx,qy,13*MU,0.9*traceAlpha); blit(lx,HALO[A.ring],qx,qy,44*MU,0.5*traceAlpha);
   }
  }

  /* ---- the centre: not an eye, a held breath that releases on every beat ----
     a raw hit is anticipated: the centre contracts to 0.85 over 80ms on the ease in curve, then throws the bolt */
  let hpre=0, hrel=0;
  if(!RM) for(const f of rawFx){ const ag=(pn-f.t0)/1000; if(ag<0.08) hpre=Math.max(hpre,EIN(ag/0.08)); else if(ag<0.5) hrel=Math.max(hrel,Math.exp(-(ag-0.08)/0.1)); }
  {
   let cs=R*0.11*(1-0.16*pre)*(1+0.45*beatE)*(1+0.1*hiE)*(1-0.15*hpre)*(1+0.3*hrel)*(1+0.12*brG);
   let ca=(0.32+0.1*breath*(RM?0:1))*(1-0.35*pre)+0.55*beatE+0.25*hiE+0.1*brG;
   /* THE FIRST THING IN THE DARK. One point swells on the ease in from 0.55
      to 0.98, then coils, drawing in by 30 percent over the 120ms before the
      first star, and releases as it lights: a flash that falls away on a
      180ms decay. It is the backswing for the whole sky. Once the lens is in
      it hands over to the ordinary centre. */
   if(INT){ let cA=0, cS=1;
    if(it<IT.core) cA=0;
    else if(it<IT.coil) cA=0.65*EIN((it-IT.core)/(IT.coil-IT.core));
    else if(it<IT.ign){ cA=0.65; cS=1-0.3*easeInOut((it-IT.coil)/(IT.ign-IT.coil)); }
    else { const x=it-IT.ign; cA=0.5+0.9*Math.exp(-x/0.18); cS=1+0.5*Math.exp(-x/0.12); }
    ca=mix(cA,ca,lensE); cs*=mix(cS,1,lensE); }
   blit(lx,WARM,cx,cy,cs*2.6,ca*0.55);
   blit(lx,HOT,cx,cy,cs*0.55,Math.min(1,ca*0.9+0.5*hrel));
   /* harmonic radiance: concentric rings born at the centre, the same mark Uni earns at 92 */
   if(hiE>0.01){
    lx.lineWidth=1;
    for(let k=0;k<6;k++){ const f=((k/6)+(RM?0:t*0.22))%1; const rr=Math.max(0,R*0.15*f); lx.globalAlpha=1;
     lx.beginPath(); lx.arc(cx,cy,rr,0,TAU); lx.strokeStyle=`rgba(240,210,150,${hiE*0.55*(1-f)*(0.6+0.4*Math.sin(PI*f))})`; lx.stroke(); }
   }
  }

  /* ---- the addresses ---- */
  if(!RM && boot>2.2 && (!INT||it>IT.life) && GW.tot>0 && rnd()<1-Math.exp(-0.35*dt)){ const u=rnd()*GW.tot; let k=0; while(k<GW.length-1&&GW[k]<u) k++; const g=addrs[k]; if(g&&(!flares[g.i]||pn-flares[g.i].t0>900)) flares[g.i]={t0:pn,s:0.3}; }
  const inv=new Set(); for(const k in resFx) resFx[k].addrs.forEach(i=>inv.add(i)); for(const k in RD.seats) RD.seats[k].addrs.forEach(i=>inv.add(i));
  const anyRead=readE>0.01||Object.keys(resFx).length>0;
  const span=SQ.hi-SQ.lo;
  addrs.forEach(a=>{
   const p=P[a.i]; const ba=clamp((boot-0.2-a.ring*0.09)/0.45,0,1); if(ba<=0) return;
   /* A STAR LIGHTING. 140ms of speck first, a fifth of its light, the
      anticipation; then up to full in 50ms with a white hot flash that falls
      on a 160ms decay, a four point glint riding the flash, and a white core
      that cools into the seat's colour over half a second. Its twinkle is
      two of its own sines multiplied, so its light swings by up to 45
      percent and no two stars are in step; the twinkle hands over to the
      face's quieter shimmer as the star lands on its ring (p.g). */
   let sA=1, sF=0, sC=0, sR0=0, sg=1;
   if(INT){ const s=STAR[a.i]; if(s){ const ig=it-s.t; if(ig<-0.14) return;
    sg=p.g!=null?p.g:1;
    const tw=1+mix(0.45,0.12,sg)*Math.sin(t*(2.3+2.1*a.tw)+a.pt)*Math.sin(t*(1.1+0.7*a.tw)+a.i*1.3);
    sA=(ig<0?0.2*easeInOut((ig+0.14)/0.14):clamp(ig/0.05,0,1))*tw*(1-0.18*(p.an||0));
    sF=ig>=0?Math.exp(-ig/0.16):0; sC=ig>=0?Math.exp(-ig/0.5):0;
    sR0=(0.9+1.8*s.m)*Math.max(U,0.5)*1.5; } }
   const isLit=lit.includes(a);
   let dim=lit.length?(isLit?1:1-0.35*traceAlpha):1;
   /* the rest stay readable while a pattern runs */
   if(anyRead&&!inv.has(a.i)) dim*=1-0.42*readE;
   /* 0 at the lightest real charge in this reading, 1 at the heaviest; a
      reading where every address carries the same charge has no heaviest */
   const charge=span>1e-6?(a.sq-SQ.lo)/span:0;
   const baseR=(1.4+Math.sqrt(Math.max(0,a.sq)/10)*5.2)*U;
   /* luminance: the shared breath plus a twinkle of its own, so no two dots are ever in step */
   const lum=RM?0.85:0.68+0.2*(0.5+0.5*Math.sin(t*TAU/5.6-a.ring*0.55+a.i*0.37))+0.12*(1-0.25*hiE)*Math.sin(t*a.tw+a.pt);
   const fr=flares[a.i]; const fl=fr?Math.max(0,(pn-fr.t0)/1000):9;
   const fE=fl<1.2?0.75*(fr?fr.s:0)*Math.exp(-fl/0.2):0;
   const pb=Math.min(1.2,pulseAt(p.rr,0,p.ang));
   const wv=dispS(p.rr);
   /* a lit mark holds near 1.35, but on its own clock, so none of them are in step */
   const hold=(isLit&&!RM)?0.04*Math.sin(t*1.7+a.i)*clamp((cyclePos-560)/300,0,1)*fadeOut:0;
   const sc=(isLit?lsc+hold:1)*(1+0.9*fE)*(1+0.5*wv)*(1+0.3*pb);
   /* the raw charge lands with mass: 1.5 across by 0.7 along the radius, recovering on the overshoot curve */
   let sR=1, sT=1; const sq0=squash[a.i];
   if(sq0!==undefined){ const ps=(pn-sq0)/180; if(ps>=1||RM) delete squash[a.i]; else if(ps>=0){ const k=OVS(ps); sR=mix(0.7,1,k); sT=mix(1.5,1,k); } }
   /* the dot floor, the mockup's: 108 dots that cannot be seen are not 108 */
   /* a star is drawn at its own magnitude and shrinks to the address's
      real size as it lands, so the sky is bright and the placed face is
      true to the reading */
   const rr=INT?Math.max(0.6,mix(sR0,baseR,sg)*sc*(1+1.1*sF)):Math.max(0.6,baseR*sc*ba);
   const A=dim*ba*sA;
   const col=a.ring;
   const haloA=(0.28+0.22*charge)*lum*A*(isLit?1.2:1)+0.25*wv*A+0.3*pb*A+0.35*sF*A, hotA=(0.25+0.5*charge*lum+(isLit?0.25*traceAlpha:0)+0.8*fE+0.45*pb+0.15*hiE+1.4*sF+0.6*sC)*A;
   if(sF>0.04){ const gl=(5+26*sF)*Math.max(U,0.4)*(0.6+0.8*(STAR[a.i]?STAR[a.i].m:0)); lx.globalAlpha=1; lx.lineWidth=1;
    lx.strokeStyle=`rgba(255,246,230,${Math.min(1,0.9*sF*A)})`;
    lx.beginPath(); lx.moveTo(p.x-gl,p.y); lx.lineTo(p.x+gl,p.y); lx.moveTo(p.x,p.y-gl); lx.lineTo(p.x,p.y+gl); lx.stroke(); }
   if(sR!==1||sT!==1){
    blitT(lx,HALO[col],p.x,p.y,rr*(6+charge*5)*(isLit?1.25:1),haloA,p.ang,sR,sT);
    blitT(lx,CORE[col],p.x,p.y,rr*2.6,(0.78+0.22*lum)*A,p.ang,sR,sT);
    blitT(lx,HOT,p.x,p.y,rr*(1.1+0.6*charge),hotA,p.ang,sR,sT);
   } else {
    blit(lx,HALO[col],p.x,p.y,rr*(6+charge*5)*(isLit?1.25:1),haloA);
    blit(lx,CORE[col],p.x,p.y,rr*2.6,(0.78+0.22*lum)*A);
    blit(lx,HOT,p.x,p.y,rr*(1.1+0.6*charge),hotA);
   }
   if(charge>0.9||fE>0.05){ const s=(charge>0.9?0.3*lum:0)+0.8*fE; lx.globalAlpha=clamp(s,0,1)*A*0.6; const sw=Math.min(rr*(9+12*fE),R*0.25); lx.drawImage(STREAK,p.x-sw/2,p.y-rr*0.32,sw,rr*0.64); }
   /* a hollow ring means a resolved reading while one is shown, so flares drop theirs */
   if(fE>0.01 && fl<0.55 && !anyRead){ const rad=Math.max(0,rr*1.6+easeOut(fl/0.55)*30*MU*fr.s); lx.globalAlpha=1; const [r,g,b]=rgb(a.col);
    lx.beginPath(); lx.arc(p.x,p.y,rad,0,TAU); lx.strokeStyle=`rgba(${Math.min(255,r+80)},${Math.min(255,g+80)},${Math.min(255,b+80)},${0.55*(1-fl/0.55)})`; lx.lineWidth=1.3; lx.stroke(); }
  });
  for(const k in flares){ if(Math.max(0,(pn-flares[k].t0)/1000)>1.5) delete flares[k]; }

  /* ======== the two layers of the reading ========
     LOWER: a raw hit. Fast, sharp, jagged, white hot, gone in about half a second. */
  for(let k=rawFx.length-1;k>=0;k--){ const f=rawFx[k]; const age0=Math.max(0,(pn-f.t0)/1000); if(age0>0.70){ rawFx.splice(k,1); continue; }
   /* the anticipation is drawn by the centre */
   const ANT=RM?0:0.08; if(age0<ANT) continue;
   const age=age0-ANT;
   const env=Math.pow(1-clamp(age/0.62,0,1),2); const [r,g,b]=rgb(SEATCOL[f.ring]); const u=RM?1:clamp(age/0.08,0,1);
   if(u>=1&&!f.landed){ f.landed=true; if(!RM) f.addrs.forEach(i=>squash[i]=pn); }
   if(f.addrs.length){
    f.addrs.forEach((i,ai)=>{ const p=P[i]; if(!p) return; const ex=cx+(p.x-cx)*u, ey=cy+(p.y-cy)*u;
     const dx=ex-cx, dy=ey-cy, dl=Math.hypot(dx,dy)||1, jj=f.jit[ai]||[0,0];
     const j1=(RM?0:jj[0])*R*0.04, j2=(RM?0:jj[1])*R*0.03;
     const k1x=cx+dx*0.36-dy/dl*j1, k1y=cy+dy*0.36+dx/dl*j1, k2x=cx+dx*0.7-dy/dl*j2, k2y=cy+dy*0.7+dx/dl*j2;
     [[3.2,`rgba(${r},${g},${b},${0.32*env})`],[1,`rgba(255,246,230,${0.95*env})`]].forEach(([lw,st])=>{ lx.globalAlpha=1; lx.beginPath(); lx.moveTo(cx,cy); lx.lineTo(k1x,k1y); lx.lineTo(k2x,k2y); lx.lineTo(ex,ey); lx.strokeStyle=st; lx.lineWidth=lw*Math.max(U,0.4); lx.stroke(); });
     if(u>=1){ const L2=U*(5+16*Math.exp(-age/0.09)); lx.globalAlpha=1; lx.strokeStyle=`rgba(255,248,236,${env})`; lx.lineWidth=1.1; lx.beginPath();
      lx.moveTo(p.x-L2,p.y); lx.lineTo(p.x+L2,p.y); lx.moveTo(p.x,p.y-L2); lx.lineTo(p.x,p.y+L2); lx.stroke(); blit(lx,HOT,p.x,p.y,12*MU,env); }
    });
   } else { // the seat is known and no address carries the feeling: the whole ring takes the hit
    const rr=ringBase[f.ring], tk=6*MU; lx.globalAlpha=1; lx.beginPath(); lx.arc(cx,cy,rr,0,TAU); lx.strokeStyle=`rgba(255,246,230,${0.85*env})`; lx.lineWidth=1.6; lx.stroke();
    lx.strokeStyle=`rgba(${r},${g},${b},${0.3*env})`; lx.lineWidth=5*MU; lx.stroke();
    lx.beginPath(); for(let q=0;q<24;q++){ const an=q/24*TAU+rotA[f.ring], c0=Math.cos(an), s0=Math.sin(an); lx.moveTo(cx+c0*(rr-tk),cy+s0*(rr-tk)); lx.lineTo(cx+c0*(rr+tk),cy+s0*(rr+tk)); }
    lx.strokeStyle=`rgba(255,246,230,${0.8*env})`; lx.lineWidth=1; lx.stroke();
    const n0=cx+Math.cos(-PI/2+rotA[f.ring])*rr*u, n1=cy+Math.sin(-PI/2+rotA[f.ring])*rr*u;
    lx.beginPath(); lx.moveTo(cx,cy); lx.lineTo(n0,n1); lx.strokeStyle=`rgba(255,246,230,${0.9*env})`; lx.lineWidth=1; lx.stroke();
   }
  }
  /* held but not yet weighed: the hit addresses flicker, a charge waiting for its seat to decide */
  for(const k in RD.seats){ const st=RD.seats[k]; if(st.resolved) continue;
   st.addrs.forEach(i=>{ const p=P[i]; if(!p) return; const fl=RM?0.5:0.35+0.45*rnd(); const L2=Math.max(3,U*4.5); lx.globalAlpha=1; lx.strokeStyle=`rgba(255,244,226,${fl*0.7})`; lx.lineWidth=1;
    lx.beginPath(); lx.moveTo(p.x-L2,p.y); lx.lineTo(p.x+L2,p.y); lx.moveTo(p.x,p.y-L2); lx.lineTo(p.x,p.y+L2); lx.stroke(); }); }
  /* HIGHER: the resolution. Slow, smooth, in order: the hits are gathered one after another into one point,
     the seat ring is drawn closed around it, and a hollow ring marks the reading. It then holds, steady.
     The point sits on the seat's own ring at the mean angle of the addresses it gathers, read off where
     they are this frame, so the reading turns with its ring. */
  const labels=[];
  const dashK=SQ.mean>0?1/SQ.mean:0;
  for(const k in resFx){ const f=resFx[k]; const ring=f.ring; const a=RM?9:Math.max(0,(pn-f.t0)/1000);
   const rel=f.rel?1-easeInOut((pn-f.rel)/2200):1; if(rel<=0){ delete resFx[k]; continue; }
   const ad=f.addrs.filter(i=>P[i]); if(!ad.length) continue;
   const rr=ringBase[ring]; const [r,g,b]=mixc(rgb(SEATCOL[ring]),[240,214,160],0.35);
   let sx=0,sy=0; ad.forEach(i=>{sx+=Math.cos(P[i].ang);sy+=Math.sin(P[i].ang);}); const na=Math.atan2(sy,sx);
   const nx=cx+Math.cos(na)*rr, ny=cy+Math.sin(na)*rr;
   const ord=ad.slice().sort((x,y)=>{ const d=i=>((P[i].ang-na)%TAU+TAU+PI)%TAU-PI; return d(x)-d(y); });
   ord.forEach((i,q)=>{ const p=P[i]; const u=easeInOut((a-0.12-q*0.16)/0.95); if(u<=0) return;
    const c={x:(p.x+nx)/2+(cx-(p.x+nx)/2)*0.28, y:(p.y+ny)/2+(cy-(p.y+ny)/2)*0.28};
    const settled=u>=1; const al=settled?0.34+0.08*(RM?0:Math.sin(t*0.9+q+ring*1.1)):0.75;
    /* once settled the line carries current: dashes run toward the reading, faster for a heavier hit */
    const passes=settled?[[4,0.12,0],[1.1,al*0.35,0],[1.4,al*1.5,1]]:[[4,0.12,0],[1.1,al,0]];
    passes.forEach(([lw,am,dash])=>{ lx.globalAlpha=1; lx.beginPath(); for(let s2=0;s2<=30;s2++){ const v=s2/30*u, m=1-v; const x=m*m*p.x+2*m*v*c.x+v*v*nx, y=m*m*p.y+2*m*v*c.y+v*v*ny; s2?lx.lineTo(x,y):lx.moveTo(x,y); }
     if(dash){ lx.setLineDash([2*MU,9*MU]); lx.lineDashOffset=RM?0:-(t*18*MU*(byI[i].sq*dashK)); lx.lineCap='round'; }
     lx.strokeStyle=`rgba(${r},${g},${b},${Math.min(1,am)*rel})`; lx.lineWidth=lw*(lw>2?MU:1); lx.stroke(); if(dash){ lx.setLineDash([]); lx.lineDashOffset=0; lx.lineCap='butt'; } });
    if(!settled){ const m=1-u; const bx=m*m*p.x+2*m*u*c.x+u*u*nx, by=m*m*p.y+2*m*u*c.y+u*u*ny; blit(lx,GOLDH,bx,by,30*MU,0.55*rel); blit(lx,WARM,bx,by,10*MU,0.5*rel); }
    blit(lx,WARM,p.x,p.y,U*16,0.42*rel);
   });
   const gStart=0.12+Math.max(0,ord.length-1)*0.16+0.6;
   const sw=easeInOut((a-gStart)/1.25);
   if(sw>0){ [[7,0.1],[2.2,0.62]].forEach(([lw,am])=>{ lx.globalAlpha=1; lx.beginPath(); lx.arc(cx,cy,rr,na,na+sw*TAU); lx.strokeStyle=`rgba(${r},${g},${b},${am*rel*(sw>=1?0.9+0.1*(RM?0:Math.sin(t*0.8+ring*1.1)):1)})`; lx.lineWidth=lw*MU; lx.lineCap='round'; lx.stroke(); });
    lx.lineCap='butt';
    if(sw<1){ const ha=na+sw*TAU; blit(lx,GOLDH,cx+Math.cos(ha)*rr,cy+Math.sin(ha)*rr,26*MU,0.5*rel); } }
   /* the node ring lands on an overshoot: up to 1.18 and settled in 260ms */
   const nd=RM?1:backOut((a-gStart+0.2)/0.26,2.4)*((a-gStart+0.2)>0?1:0);
   if(nd>0){ const ns=Math.max(2.5,U*7.5)*nd; lx.globalAlpha=1; lx.beginPath(); lx.arc(nx,ny,ns,0,TAU); lx.strokeStyle=`rgba(240,218,170,${0.95*rel})`; lx.lineWidth=1.5; lx.stroke(); blit(lx,GOLDH,nx,ny,ns*6,0.32*rel);
    const em=(a-gStart-0.3); if(!RM&&em>0&&em<1.6){ const e2=easeOut(em/1.6); lx.beginPath(); lx.arc(nx,ny,ns+e2*R*0.12,0,TAU); lx.strokeStyle=`rgba(240,218,170,${0.5*(1-e2)*rel})`; lx.lineWidth=1; lx.stroke(); }
    if(f.ping&&!RM){ const pa=(pn-f.ping)/1000; if(pa<1.4){ const e3=easeOut(pa/1.4); lx.beginPath(); lx.arc(nx,ny,ns+e3*R*0.16,0,TAU); lx.strokeStyle=`rgba(244,226,182,${0.7*(1-e3)*rel})`; lx.lineWidth=1.3; lx.stroke(); blit(lx,GOLDH,nx,ny,60*MU,0.4*(1-e3)*rel); } }
   }
   /* the label fades in over 240ms while sliding 6px out along the radius; its seat bar grows 60ms later */
   const lp=RM?1:clamp((a-gStart-0.35)/0.24,0,1), la=lp*rel, bh=RM?1:easeOut((a-gStart-0.35-0.06)/0.18);
   if(la>0&&TX.res) labels.push({x:nx,y:ny,na,txt:SEATNM[ring]+(f.fet?', '+f.fet:''),al:la,col:SEATCOL[ring],sl:6*(1-easeOut(lp)),bh});
  }

  /* ---- motes: the space between the rings carries slow current ---- */
  if(!RM){
   for(const m of MOTES){
    m.age+=dt; if(m.age>m.life){ spawnMote(m,false); continue; }
    const om=0.05/(0.35+m.rf)*(1+0.8*speakLvl);
    const psi=0.6*Math.sin(m.rf*9+t*0.2)*Math.cos(m.a*3-t*0.13);   // curl: the velocity turns with the field
    const pk=pulseAt(m.rf*R,0,m.a);
    m.vr+=pk*0.08*dt*4.5; m.vr*=Math.exp(-dt/0.8);                 // each beat kicks it out; the kick decays over 0.8s
    m.a+=dt*om*Math.cos(psi);
    m.rf+=dt*(om*(0.35+m.rf)*Math.sin(psi)*0.9+0.012*Math.sin(t*0.4+m.seed)*driftK+pk*0.08+m.vr+(m.r0-m.rf)*0.22);
    if(m.ox||m.oy||m.vx||m.vy){ m.vx+=(-18*m.ox-6*m.vx)*dt; m.vy+=(-18*m.oy-6*m.vy)*dt; m.ox+=m.vx*dt; m.oy+=m.vy*dt; if(Math.abs(m.ox)+Math.abs(m.oy)+Math.abs(m.vx)+Math.abs(m.vy)<0.02) m.ox=m.oy=m.vx=m.vy=0; }
    if(m.rf>1.1){ m.rf=0.2; m.r0=0.2; }
    const lf=m.age/m.life, env=Math.sin(PI*lf);
    const ring=clamp(Math.floor(m.rf*7),0,6);
    blit(lx,CORE[ring],cx+Math.cos(m.a)*m.rf*R+m.ox,cy+Math.sin(m.a)*m.rf*R+m.oy,m.s*4*U*(1+0.6*Math.min(1,pk)),(0.28+0.3*speakLvl+0.35*Math.min(1,pk))*env*clamp(boot/1.5,0,1)*lensE);
   }
  }

  /* ---- word wavefronts: faster and brighter than the beat ---- */
  for(let k=waves.length-1;k>=0;k--){ const wv=waves[k]; const age=Math.max(0,(now-wv.t0)/1000); if(age>1.1){ waves.splice(k,1); continue; }
   if(RM) continue;
   const wr=Math.max(0,R*1.12*easeOut(age/1.1)); const al=wv.amp*0.32*(1-age/1.1);
   lx.globalAlpha=1; lx.beginPath(); lx.arc(cx,cy,wr,0,TAU); lx.strokeStyle=`rgba(232,206,150,${al})`; lx.lineWidth=Math.max(0.5,(1+2.5*wv.amp*(1-age/1.1))*MU); lx.stroke(); }

  /* ---- click impulse ---- */
  if(clickP){ const age=Math.max(0,(pn-clickP.t0)/1000);
   if(age<1.4&&!RM){ const rr=Math.max(0,easeOut(age/1.4)*R*0.9); lx.globalAlpha=1; lx.beginPath(); lx.arc(clickP.x,clickP.y,rr,0,TAU); lx.strokeStyle=`rgba(255,240,215,${0.5*(1-age/1.4)})`; lx.lineWidth=1.5; lx.stroke(); } else clickP=null; }
  lx.globalAlpha=1;

  /* structure is held inside the face: mask the emissive layer to the circle */
  lx.setTransform(1,0,0,1,0,0); lx.globalCompositeOperation='destination-in'; lx.beginPath(); lx.arc(cx*DPR,cy*DPR,(Rf-1)*DPR,0,TAU); lx.fillStyle='#000'; lx.fill();
  lx.globalCompositeOperation='source-over';

  /* ======== composite, then bloom; only the bloom may bleed past the edge ======== */
  ctx.globalAlpha=1; ctx.globalCompositeOperation='lighter';
  ctx.drawImage(L,0,0,w,h);
  B[0].x.globalCompositeOperation='copy'; B[0].x.drawImage(L,0,0,B[0].c.width,B[0].c.height);
  B[1].x.globalCompositeOperation='copy'; B[1].x.filter='blur(1.5px)'; B[1].x.drawImage(B[0].c,0,0,B[1].c.width,B[1].c.height); B[1].x.filter='none';
  B[2].x.globalCompositeOperation='copy'; B[2].x.filter='blur(1.5px)'; B[2].x.drawImage(B[1].c,0,0,B[2].c.width,B[2].c.height); B[2].x.filter='none';
  const bl=1+0.25*speakLvl+0.25*wordE+0.25*hiE;
  ctx.globalAlpha=Math.min(1,0.38*bl); ctx.drawImage(B[0].c,0,0,w,h);
  ctx.globalAlpha=Math.min(1,0.5*bl); ctx.drawImage(B[1].c,0,0,w,h);
  ctx.globalAlpha=Math.min(1,0.65*bl); ctx.drawImage(B[2].c,0,0,w,h);

  /* ---- resolved labels: drawn crisp, after the bloom, and kept inside the face ----
     The file placed each label off its point and pulled it in to the face's
     edge. Two seats resolved near the same angle stacked their labels; the
     box here is too small to leave that, so a label that would overlap one
     already placed steps up or down, away from the centre. It first stepped
     inward along its radius, the pie wiring's rule, and on a 390 phone that
     walked "Sacral, Apathy" straight onto the centre word, so the centre
     word's own box is held as placed before any label is */
  let wordBox=null;
  ctx.font='500 '+FS+'px '+fs0;
  const wordW=ctx.measureText(stateWord).width, wordFits=wordW/2+3<ringBase[0]*0.92;
  if(wordFits&&stateWord) wordBox={x0:cx-wordW/2-3,x1:cx+wordW/2+3,y0:cy-FS*0.8,y1:cy+FS*0.8};
  if(labels.length){ ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,Rf-4,0,TAU); ctx.clip(); ctx.globalCompositeOperation='source-over';
   const fs=Math.max(FS,Math.round(12*U)); ctx.font='500 '+fs+'px '+fs0; ctx.textBaseline='middle';
   const placed=wordBox?[wordBox]:[];
   labels.forEach(l=>{ const c0=Math.cos(l.na), s0=Math.sin(l.na); const off=U*16-l.sl; let lxp=l.x+c0*off, lyp=l.y+s0*off;
    const tw=ctx.measureText(l.txt).width; ctx.textAlign=c0>=0?'left':'right';
    const x0=c0>=0?lxp:lxp-tw; const d=Math.hypot(Math.max(Math.abs(x0-cx),Math.abs(x0+tw-cx)),lyp-cy); if(d>Rf-14){ const k2=(Rf-14)/d; lxp=cx+(lxp-cx)*k2; lyp=cy+(lyp-cy)*k2; }
    const box=()=>{ const bx=c0>=0?lxp-5:lxp-tw-5; return {x0:bx,x1:bx+tw+10,y0:lyp-fs*0.72,y1:lyp+fs*0.72}; };
    const hit=()=>{ const q=box(); return placed.some(r=>q.x0<r.x1&&q.x1>r.x0&&q.y0<r.y1&&q.y1>r.y0); };
    const away=lyp>=cy?1:-1;
    for(let k=0;k<8&&hit();k++) lyp+=away*fs*1.25;
    const q=box(); placed.push(q);
    ctx.globalAlpha=l.al*0.8; ctx.fillStyle='rgba(3,3,4,.72)'; ctx.fillRect(q.x0,q.y0,tw+10,fs*1.44);
    ctx.globalAlpha=l.al; ctx.fillStyle=l.col; ctx.fillRect(c0>=0?q.x0:q.x0+tw+9,lyp-fs*0.72*l.bh,1,fs*1.44*l.bh);
    ctx.fillStyle='#f1e4c6'; ctx.fillText(l.txt,lxp,lyp); });
   ctx.restore(); ctx.globalAlpha=1; }

  /* ---- the face edge: a thin bezel; at high coherence each beat leaves the face as light ---- */
  ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1;
  ctx.beginPath(); ctx.arc(cx,cy,Rf-0.75,0,TAU); ctx.lineWidth=1;
  ctx.strokeStyle=`rgba(${mixc([216,213,204],[236,206,148],hiE).join(',')},${(0.22+0.1*hiE+0.3*rimE)*lensE})`; ctx.stroke();
  const leave=rimE*(0.25+0.75*hiE);
  /* the light leaving the face is held to the box's own inscribed circle, so
     the box's square edge never cuts it */
  const outR=Math.min(Rf*(1.06+0.08*hiE),Math.min(w,h)/2);
  if(leave>0.01&&outR>Rf*0.97){ ctx.globalCompositeOperation='lighter';
   const rg=ctx.createRadialGradient(cx,cy,Rf*0.97,cx,cy,outR);
   rg.addColorStop(0,`rgba(236,206,148,${0.34*leave})`); rg.addColorStop(0.25,`rgba(236,206,148,${0.16*leave})`); rg.addColorStop(1,'rgba(236,206,148,0)');
   ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(cx,cy,outR,0,TAU); ctx.arc(cx,cy,Rf*0.97,0,TAU,true); ctx.fill('evenodd'); }
  ctx.globalCompositeOperation='source-over';

  /* the centre word, the one readout the wiring kept, outside the breath so
     it never swims, and only where it fits inside the Root ring, the
     innermost seat, so it never sits on an address */
  ctx.globalAlpha=1; ctx.font='500 '+FS+'px '+fs0; ctx.textAlign='center'; ctx.textBaseline='middle';
  /* no word over the intro: it has no state to report, and it comes back
     over 600ms once the face has landed. And never a bare idle word either
     (stateWord is IDLE, empty, until a story actually starts), which is the
     "it says waiting and I haven't said anything" fix. */
  const wA=INT?0:clamp((pn-inEndAt)/600,0,1);
  if(wordFits&&stateWord&&wA>0){ ctx.fillStyle=`rgba(216,213,204,${(0.5+0.25*speakLvl)*clamp(boot,0,1)*wA})`; ctx.fillText(stateWord,cx,cy); }
 }

 /* LENT, THE FACE IS NOT MOVED. The intro borrows the one canvas for its own
    stage, and anything that renders the Journal underneath it in the
    meantime (an auth answer, a status line, a render() from the login's
    own close) reaches uniMount or uniPark, which would take the face off
    the intro mid sentence or pause it there. While lent, those two are
    answered as if done and do nothing; give() ends the loan and the caller
    hands the face back through uniHandBack, the boot's own route home. */
 let lent=null;
 function show(host){ const moved=canvas.parentNode!==host; if(moved) host.appendChild(canvas); canvas.hidden=false;
  if(!running){ running=true; prevNow=null; raf=requestAnimationFrame(draw); }
  else if(moved) refit();
  return true; }
 /* A HOST THAT CHANGED SIZE UNDER THE CANVAS, painted at its new size now
    rather than on the next frame (paint, above). uniMount calls it after
    moving the face's whole widget, which leaves the canvas's own parent
    where it was, so show() alone cannot see the move. */
 function refit(){ if(!running||canvas.hidden) return; if(canvas.clientWidth!==W0||canvas.clientHeight!==H0) paint(performance.now()); }
 function mount(host){ if(!host) return false; if(lent) return true; return show(host); }
 function pause(){ if(lent) return; running=false; cancelAnimationFrame(raf); canvas.hidden=true; }
 function take(host){ if(!host) return false; lent=host; return show(host); }
 function give(){ lent=null; }
 /* CALL THE BEAT. The lock's own move, beat(now,1.35);pPh=0, starts a beat at
    once; this one only brings the next beat forward to where its 12 percent
    anticipation begins, so the centre draws in and then releases on the
    face's own curve. Answers how long, in ms, until that beat lands, read
    off the period the last frame used. A beat already inside its
    anticipation is left where it is, and reduced motion has no beat. */
 function cue(){ engaged=true; if(RM) return 0; pPh=Math.max(pPh,0.88); return Math.round((1-pPh)*curPeriod*1000); }
 /* DROP THE READING AT ONCE. A reading normally leaves on its own: closed,
    held for HOLD, then released over 2.2 seconds, about fourteen seconds in
    all. The intro's example must not still be on the face when the
    Journal's own first reading is due, or a person's first words would
    land on rings still lit by a stranger's, so everything the reading left
    on the face goes in one call: its word clock, its seats and their
    timers, both layers of the reading, the flares and squash its hits
    left, and the hold. RD.id moves, so a closeStory or resolve still
    queued for the old reading finds it gone. The voice is not touched: it
    is the product's one voice, and ends on its own element's events. */
 function clear(){
  wordTimers.forEach(clearTimeout); wordTimers=[]; clearTimeout(holdTimer); holdTimer=0;
  for(const k in RD.seats) clearTimeout(RD.seats[k].timer);
  RD.id++; RD.on=false; RD.closed=false; RD.seats={}; RD.order=[]; RD.imp={}; RD.hk={};
  for(const k in resFx) delete resFx[k]; rawFx.length=0;
  for(const k in flares) delete flares[k]; for(const k in squash) delete squash[k];
  readE=0; engaged=speaking; stateWord=speaking?'Answering':IDLE; }
 readAddrs();
 window.SrcFace={mount,pause,sync,read,voice,cue,clear,take,give,intro,refit,
  plan:t=>{ const q=plan(t); return q?{words:q.words.slice(),hits:q.hits.map(h=>Object.assign({},h))}:null; },
  /* what the gates read, the way window.Uni exposes chakraTags */
  state:()=>({word:stateWord,engaged,lis:speakLvl,W:W0,H:H0,running,speaking,cq:CQ,hi:hiE,addrs:addrs.length,
   rings:ringList.map(l=>l.length),
   locked:[...LOCKED],rungs:{sab:CH.sabs.length,cx:CH.cxs.length,hy:CH.hys.length,sup:CH.sups.length},
   trace:CH.sabs[sabIdx]?{nm:CH.sabs[sabIdx].nm,parts:CH.sabs[sabIdx].parts.slice()}:null,
   seats:Object.keys(resFx).map(k=>({seat:SEATNM[k],fet:resFx[k].fet,addrs:resFx[k].addrs.slice()})),
   /* a reading in flight that has not resolved a seat yet is still a
      reading: what a gate reads to know clear() left nothing behind */
   reading:RD.on, held:Object.keys(RD.seats).length, lent:!!lent, host:canvas.parentNode?canvas.parentNode.id||canvas.parentNode.className||'':'',
   voiceWord:VO?VO.idx:-1,
   /* the intro's clock on the last frame, null when none is running */
   intro:IN?IN.last:null})};
})();
