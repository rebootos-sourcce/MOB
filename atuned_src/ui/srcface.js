/* ============================================================
   SOURCE'S FACE, THE LEDGER, IN UNI'S SLOT ON THE JOURNAL. Wired in 16
   November, his words: "The ledger is the one I want wired in." Before that
   it was a demo file (pulse-ledger-v2.html) and a mockup that proved it fits
   #stuni in both the Dashboard and the hero view without moving anything
   else on the page, measured element by element.

   PORTED, NOT REDRAWN. draw() below is the ledger's draw() with the
   mockup's three changes kept, each named where it lands: sized to the box
   and not the window, the ledger's page furniture gone (its column, HUD,
   caption, legend and controls), and no browser voice. What changed in
   wiring it is only where every input comes from. The demo carried all of
   them as constants and each one was a stand in:

    1  THE ADDRESSES are W (engine/core.js), the engine's own 108 somatic
       addresses in BANDS order, with sq and cf exactly as compute() has
       just set them. The demo's DATA.addrs was a baked profile of 107, with
       address 8 pushed in by hand; W always has all 108, and address 8,
       Root_08_Unnamed, is drawn at its real sq with no feeling, as W holds
       it. Nothing is filled in: a seat draws the addresses W gives it.
    2  THE CHAIN is computeSeen() (ui/lock.js), compute()'s own sabs, cxs,
       hys and sups as this plan may see them. The demo rebuilt the chain
       itself off a four row saboteur table with its own family map; the
       pairing rules it copied are compute()'s, so the copy is gone and the
       real lists are drawn. Their parts are the real links: a saboteur's
       parts are address nodes, a complex's are saboteurs, a hyper-complex's
       are complexes, a super-complex's are hyper-complexes. trace.js builds
       its chain from these same four lists (its header, super_complex), so
       this reads the chain where the graph reads it. A rung has three
       states and all three are real: lit when its list holds something,
       locked when sightR names it in v.locked, not reached otherwise.
    3  THE SNIFFER is parseStory() (engine/sniff.js), called on the turn the
       Journal was just handed. The demo carried a 29 word cut of the
       lexicon and "the heaviest wins" in place of the real rule, so it had
       no negation and no proportional split. Here a raw hit is one of
       parseStory's own counted hits, a denied hit ("I was not angry") or
       one about someone else never fires because the engine never counts
       it, and a seat resolves to the addresses and the fetter the engine's
       own imprints land on. There is no second copy of that logic here.
    4  CQ is the reading's own r.CQ, the figure every other CQ display
       reads, and no arc at all while r.unread. The demo held it at 100.
    5  THE VOICE is the product's one voice. stSrcSpeak (ui/storyui.js)
       hands this the real audio element it is about to play, and the face
       follows that element: it speaks while the element plays, the reading
       is held until it ends, and the word the voice is on is read off the
       element's own playback position. The demo's Speak button and its
       speechSynthesis path are gone; the product has no browser voice.
    6  THE MOUNT is the canvas-wrap inside #stuni, Uni's own box, done by
       uniMount (ui/uni.js) when the target is #stuni, which pauses Uni's
       loop and hides her canvas there. Every other mount of her, the boot
       intro, is untouched.

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
   ============================================================ */
(function(){
 'use strict';
 const SEATCOL=['#D6524C','#D8924E','#DABF6A','#5FD5A6','#5EBBDB','#7D93E0','#A77EDB'];
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
 function cbz(x1,y1,x2,y2){ return x=>{ x=clamp(x,0,1); let u=x; for(let k=0;k<7;k++){ const m=1-u; const xu=3*x1*u*m*m+3*x2*u*u*m+u*u*u-x; const d=3*x1*m*m+6*(x2-x1)*u*m+3*(1-x2)*u*u; if(Math.abs(d)<1e-6) break; u=clamp(u-xu/d,0,1); } const m=1-u; return 3*y1*u*m*m+3*y2*u*u*m+u*u*u; }; }
 const EOUT=cbz(.22,1,.36,1), OVS=cbz(.34,1.56,.64,1);
 const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
 /* THE GRAMMAR. Brightness is certainty, in three fixed steps. */
 const OP={raw:0.40, full:1.00, ghost:0.12};
 /* THE TYPE FLOOR IS THE HOUSE'S, 11 PIXELS. The ledger and the mockup
    floored canvas labels at 10, under the 11 the atuned-ux floor and
    tests/design.js hold every other label on this page to. design.js cannot
    see inside a canvas, which is a reason to hold it here, not a licence. */
 const FS=11;

 const canvas=document.createElement('canvas');
 canvas.id='srcface';
 canvas.hidden=true;
 canvas.setAttribute('aria-label',"Source's reading circle. Angle is the seat, depth inward is the chain, brightness is certainty.");
 const TITLE="Source's reading circle. Each dot is one of the 108 body addresses, each at a named plexus or nerve. Its place around the circle is its seat, Crown at the top. How far in a mark sits is how compounded the pattern is. Brightness is how certain Source is.";
 canvas.title=TITLE;
 const ctx=canvas.getContext('2d');
 let W0=0,H0=0,DPR=1,running=false,raf=0;
 /* CHANGE 1. Sized off the box, read every frame through clientWidth, so the
    Dashboard toggle, which resizes #stuni without a window resize, is
    followed on the next frame. */
 function fit(){
  const w=canvas.clientWidth, h=canvas.clientHeight; const d=Math.min(window.devicePixelRatio||1,2);
  if(w===W0&&h===H0&&d===DPR) return; W0=w; H0=h; DPR=d;
  canvas.width=Math.max(1,Math.round(W0*DPR)); canvas.height=Math.max(1,Math.round(H0*DPR));
 }

 function sprite(hex,stops,S){
  S=S||128; const c=document.createElement('canvas'); c.width=c.height=S; const g=c.getContext('2d');
  const [r,gg,b]=rgb(hex); const gr=g.createRadialGradient(S/2,S/2,0,S/2,S/2,S/2);
  stops.forEach(([x,a,white])=>{ const m=white||0; gr.addColorStop(x,`rgba(${Math.round(r+(255-r)*m)},${Math.round(gg+(255-gg)*m)},${Math.round(b+(255-b)*m)},${a})`); });
  g.fillStyle=gr; g.fillRect(0,0,S,S); return c;
 }
 const gauss=[]; for(let k=0;k<=14;k++){const x=k/14; gauss.push([x,Math.exp(-x*x*6)*(1-x*x),0]);}
 const HALO=SEATCOL.map(c=>sprite(c,gauss));
 const CORE=SEATCOL.map(c=>sprite(c,[[0,1,.6],[.22,1,.3],[.45,.5,0],[.72,.1,0],[1,0,0]],64));
 const WARM=sprite('#f3e2c0',gauss);
 let GB=1;
 function blit(img,x,y,s,a){ a*=GB; if(!(a>0.003)||!(s>0)) return; ctx.globalAlpha=Math.min(1,a); ctx.drawImage(img,x-s/2,y-s/2,s,s); }
 const rgba=(c,a)=>`rgba(${c[0]},${c[1]},${c[2]},${clamp(a*GB,0,1)})`;

 /* the seat names are BANDS (engine/data/canon.js), read and never retyped,
    so ring r is BANDS[r]: Root 0 through Crown 6, the ledger's own order */
 const SEATNM=BANDS.slice();
 const SEC=TAU/7, GAPA=0.075;
 const seatMid=r=>-PI/2+((r+1)%7)*SEC;
 const RUNG={seat:0.80, cx:0.585, hy:0.39, sup:0.195};
 const RUNGNM={cx:'Complex',hy:'Hyper-complex',sup:'Super-complex'};
 const ROWR=[0.875,0.955];
 const circMean=as=>Math.atan2(as.reduce((s,a)=>s+Math.sin(a),0),as.reduce((s,a)=>s+Math.cos(a),0));

 /* ---- input 1: the addresses, read off W ---- */
 let ringList=[[],[],[],[],[],[],[]], addrs=[], byI={};
 /* The layout is the ledger's: each seat's addresses in two rows inside its
    own arc, ordered by address number. W's own .ang spaces all 108 evenly
    round one circle with no seat gaps, which is the wheel's layout and not
    this face's, so the face keeps its own and reads only i, b, sq and cf.
    A snapshot, because compute() writes sq onto these same nodes for every
    reading anyone asks for, a practitioner's view of another record
    included, and the face must keep showing the reading it was handed. */
 function readAddrs(){
  const rl=[[],[],[],[],[],[],[]];
  (typeof W!=='undefined'&&Array.isArray(W)?W:[]).forEach(n=>{
   const ring=SEATNM.indexOf(n&&n.b); if(ring<0) return;
   rl[ring].push({i:n.i,b:n.b,ring,sq:+n.sq||0,cf:n.cf||null});});
  const out=[];
  rl.forEach((list,r)=>{ list.sort((a,b)=>a.i-b.i); const n=list.length, per=Math.ceil(n/2), span=SEC-2*GAPA, a0=seatMid(r)-span/2;
   list.forEach((a,k)=>{ const row=k%2, col=Math.floor(k/2); a.ang=a0+span*(col+(row?0.75:0.25))/per; a.rf=ROWR[row]; out.push(a); }); });
  ringList=rl; addrs=out; byI={}; out.forEach(a=>byI[a.i]=a);
 }

 /* ---- input 2: the chain, read off computeSeen() ---- */
 let CH={sabs:[],cxs:[],hys:[],sups:[]}, LOCKED=new Set(), CQ=null;
 /* a saboteur sits in the seat most of its addresses sit in, at the mean of
    those addresses, the ledger's own placement, now on its real parts */
 function seatOf(parts){ const c=[0,0,0,0,0,0,0]; parts.forEach(i=>{ if(byI[i]) c[byI[i].ring]++; }); let best=0; c.forEach((v,k)=>{ if(v>c[best]) best=k; }); return best; }
 function readChain(r){
  const L=k=>Array.isArray(r&&r[k])?r[k]:[];
  const ang=new Map();
  const sabs=L('sabs').map(s=>{ const parts=(s.parts||[]).map(n=>n&&n.i).filter(i=>byI[i]); const ring=seatOf(parts);
   const own=parts.filter(i=>byI[i].ring===ring).map(i=>byI[i].ang);
   const o={nm:s.nm,w:s.w,parts,ring,ang:own.length?circMean(own):seatMid(ring)}; ang.set(s,o); return o; });
  /* a compound rung's mark sits at the mean of what it is built from; a
     part the plan has hidden (sightR emptied its list) has no mark, and a
     compound with none of its parts on the face sits at the mean it has */
  const up=(list,fam)=>list.map(n=>{ const ps=(n.parts||[]).map(p=>ang.get(p)).filter(Boolean);
   const o={nm:n.nm,fam:fam(n),parts:ps,ang:ps.length?circMean(ps.map(p=>p.ang)):(n.ang!=null?n.ang:-PI/2)}; ang.set(n,o); return o; });
  const cxs=up(L('cxs'),n=>n.hcx), hys=up(L('hys'),n=>n.nm), sups=up(L('sups'),n=>n.nm);
  CH={sabs,cxs,hys,sups};
  LOCKED=new Set(Array.isArray(r&&r.locked)?r.locked:[]);
  CQ=(r&&!r.unread&&isFinite(r.CQ))?clamp(+r.CQ,0,100):null;
  /* UNPACK EVERY SYMBOL: the arc's number travels with the face's own
     meaning on hover, since the canvas prints no number of its own */
  /* and the orbits' states, because below a face of 170 the rung names
     are dropped (TEXT TIERS, in draw) and a barred orbit with no word
     beside it is a symbol standing alone */
  const lk=['cx','hy','sup'].filter(k=>LOCKED.has(k)).map(k=>RUNGNM[k].toLowerCase());
  canvas.title=TITLE+(CQ==null?' The gold arc is coherence, the CQ score, and there is no reading yet.'
   /* a percent, as the Field tile prints the same figure: "of 100" is a
      count against a total, which reads as pass or fail, CO-05 */
   :' The gold arc is coherence, the CQ score, now '+Math.round(CQ)+' percent, drawn as how far round the arc reaches.')
   +' The three inner orbits are the complex, hyper-complex and super-complex. A dashed orbit has nothing on it yet.'
   +(lk.length?' A barred orbit is locked on your plan, so something may be there that this plan cannot see: the '+lk.join(' and the ')+'.':'');
 }
 /* called by uniApply (ui/storyui.js) with the reading it has just taken */
 function sync(r){ readAddrs(); readChain(r||{}); }

 const CL={on:false,t0:0,rel:0};
 const RD={on:false,seats:{},order:[],closed:false,id:0,imp:{}};
 const rawFx=[], resFx={}, pings=[];
 let lastInput=-9e9, lastEvent=-9e9, speaking=false, holdTimer=0;
 let stateWord='Waiting';

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
 function startReading(imp){
  for(const k in RD.seats) clearTimeout(RD.seats[k].timer); RD.id++; clearTimeout(holdTimer);
  RD.on=true; RD.closed=false; RD.seats={}; RD.order=[]; RD.imp=imp;
  for(const k in resFx) delete resFx[k]; rawFx.length=0; pings.length=0; CL.on=false; CL.rel=0;
  stateWord='Listening';
 }
 function fireHit(ring){
  const pn=performance.now(); lastEvent=pn;
  const st=RD.seats[ring]||(RD.seats[ring]={ring,resolved:false,timer:0,addrs:new Set()});
  /* the addresses this seat will land on, held as a cross until it decides */
  const ad=(RD.imp[ring]&&RD.imp[ring].addrs)||[];
  ad.forEach(i=>st.addrs.add(i));
  rawFx.push({ring,addrs:ad,t0:pn});
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
  const na=circMean(m.addrs.map(i=>byI[i].ang));
  resFx[ring]={ring,fet:m.fet,addrs:m.addrs.slice(),na,t0:performance.now(),rel:0}; lastEvent=performance.now();
  if(!RD.order.includes(ring)) RD.order.push(ring);
  stateWord='Found';
 }
 const CT={sab:0, sabStep:0.09, cx:0.62, travel:0.52, land:0.26, gap:0.16};
 CT.hy=CT.cx+CT.travel+CT.land+CT.gap; CT.sup=CT.hy+CT.travel+CT.land+CT.gap;
 function climbChain(){ CL.on=true; CL.t0=performance.now(); CL.rel=0; lastEvent=CL.t0; return RM?0:(CT.sup+1.0)*1000; }
 const HOLD=12000;
 function hold(id){ clearTimeout(holdTimer); holdTimer=setTimeout(()=>{ if(RD.id===id) releaseReading(); },HOLD); }
 function closeStory(){
  const id=RD.id; const pending=Object.values(RD.seats).filter(s=>!s.resolved);
  pending.forEach((s,k)=>setTimeout(()=>{ if(RD.id===id) resolveSeat(s.ring); },RM?0:k*380));
  setTimeout(()=>{ if(RD.id!==id) return; RD.closed=true; stateWord='Weighing';
   const wait=climbChain();
   setTimeout(()=>{ if(RD.id!==id) return; stateWord='Holding'; hold(id); },wait);
  },RM?0:pending.length*380+1100);
 }
 function releaseReading(){
  /* the reading is held while the voice is still saying something about it;
     the voice's own end starts the hold again (voiceEnd) */
  if(speaking) return;
  RD.on=false; const pn=performance.now();
  for(const k in resFx) if(!resFx[k].rel) resFx[k].rel=pn;
  if(CL.on&&!CL.rel) CL.rel=pn;
  setTimeout(()=>{ if(!RD.on&&!speaking) stateWord='Waiting'; },1300);
 }
 /* the ledger's word clock, kept for the person's own words, which arrive
    whole and carry no timing anywhere in the product (gap a, above) */
 let wordTimers=[];
 function wordGaps(words){ const base=60000/160; return words.map(wd=>base*(0.55+0.45*wd.replace(/[^A-Za-z0-9]/g,'').length/5)+(/[,;:]$/.test(wd)?180:0)+(/[.!?]$/.test(wd)?380:0)); }
 /* called by srcTurnCommit (ui/storyui.js) with the turn it was handed */
 function read(text){
  text=String(text||'').trim(); if(!text) return;
  /* THE DOOR IS A DOOR AND NOT AN ALARM, the guard uniApply carries: a face
     that visibly reacted the moment srcSafe tripped would be the escalation
     the crisis ruling rules out, in a different channel */
  if(typeof srcSafe==='function'&&(srcSafe(text)||(typeof ST_TEXT==='string'&&srcSafe(ST_TEXT)))) return;
  if(typeof parseStory!=='function'||typeof normMap!=='function') return;
  RM=still();
  const p=parseStory(text), nm=normMap(text);
  const words=nm.s.trim().split(/\s+/).filter(Boolean);
  /* the counted hits that name a seat. parseStory has already sent a denied
     hit to p.denied and one about someone else to p.others, so neither is
     here; an adjective hit names a charge and no seat, and coherent is not a
     seat. A phrase lands on its last word, the ledger's own rule. */
  const at=[];
  (p.hits||[]).forEach(h=>{ if(h.kind==='adj'||!h.band||h.band==='coherent') return;
   const ring=SEATNM.indexOf(K2BAND[h.band]); if(ring<0) return;
   const k=nm.s.slice(0,h.at).trim().split(/\s+/).filter(Boolean).length+String(h.t||'').split(' ').length-1;
   at.push({k:Math.min(k,Math.max(0,words.length-1)),ring}); });
  wordTimers.forEach(clearTimeout); wordTimers=[];
  startReading(imprintsBySeat(p));
  const gaps=wordGaps(words); let acc=0;
  words.forEach((wd,k)=>{ const fire=at.filter(a=>a.k===k);
   wordTimers.push(setTimeout(()=>{ lastInput=performance.now(); fire.forEach(a=>fireHit(a.ring)); },RM?0:acc));
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
  if(RD.on&&RD.closed) hold(RD.id); else if(!RD.on) stateWord='Waiting';
 }
 function voice(el,text){
  if(!el||typeof el.addEventListener!=='function') return;
  const words=String(text||'').trim().split(/\s+/).filter(Boolean);
  const gaps=wordGaps(words), tot=gaps.reduce((a,b)=>a+b,0)||1; let acc=0;
  const starts=gaps.map(g=>{ const s=acc/tot; acc+=g; return s; });
  VO={el,words:words.map(w=>w.replace(/[^A-Za-z0-9]/g,'').toLowerCase()),starts,idx:-1};
  el.addEventListener('playing',()=>{ if(!VO||VO.el!==el) return; speaking=true; lastInput=performance.now(); if(!RD.on) stateWord='Answering'; });
  ['ended','pause','error','emptied'].forEach(ev=>el.addEventListener(ev,()=>voiceEnd(el)));
 }
 /* where the voice is, read off the element each frame: a seat it names
    rings once at that seat's resolved point, the ledger's ping */
 function voiceTick(){
  if(!VO||!speaking) return;
  const el=VO.el, d=el.duration, t=el.currentTime;
  if(!(d>0&&isFinite(d))||!(t>=0)) return;
  const f=t/d; let k=VO.idx;
  while(k+1<VO.starts.length&&VO.starts[k+1]<=f) k++;
  for(let j=VO.idx+1;j<=k;j++){ const r=SEATWORD[VO.words[j]];
   if(r!==undefined&&r>=0&&resFx[r]) pings.push({ring:r,t0:performance.now()}); }
  if(k!==VO.idx){ VO.idx=k; lastInput=performance.now(); }
 }

 const BR={idle:{T:5.0,d:0.012,b:0.06}, lis:{T:2.4,d:0.007,b:0.09}};
 let bph=0, lis=0, t0f=null, prevNow=null;
 const fs0='Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';
 function curve(p0,p1,bend){ const mx=(p0.x+p1.x)/2, my=(p0.y+p1.y)/2; const dx=p1.x-p0.x, dy=p1.y-p0.y; return {x:mx-dy*bend,y:my+dx*bend}; }
 function qpt(p0,c,p1,u){ const m=1-u; return {x:m*m*p0.x+2*m*u*c.x+u*u*p1.x, y:m*m*p0.y+2*m*u*c.y+u*u*p1.y}; }
 function strokeQ(p0,c,p1,u,col,a,lw){ if(u<=0||a<=0.003) return; ctx.globalAlpha=1; ctx.beginPath(); for(let s=0;s<=24;s++){ const q=qpt(p0,c,p1,s/24*u); s?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y); } ctx.strokeStyle=rgba(col,a); ctx.lineWidth=lw; ctx.stroke(); }
 /* the ledger's ring padlock, outline and never fill, back from the demo:
    the mockup cut it with the preview button it hung off, and a real plan
    lock is what it was drawn for */
 function lockGlyph(x,y,s,a){ ctx.globalAlpha=1; ctx.strokeStyle=`rgba(216,213,204,${a})`; ctx.lineWidth=1;
  ctx.beginPath(); ctx.arc(x,y-s*0.35,s*0.32,PI,0); ctx.stroke();
  ctx.beginPath(); ctx.rect(x-s*0.5,y-s*0.35,s,s*0.75); ctx.stroke(); }
 const CREAM=[240,222,180], BONE=[216,213,204];

 function draw(now){
  if(!running) return; raf=requestAnimationFrame(draw);
  /* the voice is followed ahead of the size check: the desktop hero view
     mounts #stuni zero wide, measured 16 November, and a face with no room
     to draw must still know where the voice is, or the pings and the hold
     it drives land late once the box has a size */
  RM=still(); voiceTick();
  fit(); if(!(W0>0&&H0>0)) return;
  if(t0f===null) t0f=now;
  const dt=prevNow===null?0.016:clamp((now-prevNow)/1000,0,0.05); prevNow=now;
  const pn=performance.now();
  const boot=RM?1:easeOut((now-t0f)/600);
  const active=speaking||(pn-lastInput<3500)||(RD.on&&!RD.closed)||(pn-lastEvent<3500);
  const tgt=active?1:0;
  lis+=(tgt-lis)*(1-Math.exp(-dt/(tgt>lis?0.35:0.55))); if(Math.abs(tgt-lis)<0.001) lis=tgt;
  const T=mix(BR.idle.T,BR.lis.T,lis), dep=mix(BR.idle.d,BR.lis.d,lis), bk=mix(BR.idle.b,BR.lis.b,lis);
  if(!RM){ bph=(bph+dt/T)%1; }
  const bv=RM?0:0.5-0.5*Math.cos(TAU*bph);
  const S=1+dep*bv; GB=1+bk*bv;
  const cx=W0/2, cy=H0/2;
  /* CHANGE 1, the size: the largest circle whose outermost mark, the field
     anchors, stays inside the box with a 2 pixel margin. Larger is cropped
     by .st-uni's own overflow:hidden. */
  const half=Math.min(W0,H0)/2-2;
  const reach=half<90?7:14;
  const Rf=Math.max(12,(half-reach)/1.012);
  /* TEXT TIERS, the mockup's: words are dropped by size, outermost meaning
     last, and below that the canvas title carries the meaning */
  const TX={rung:Rf>=170, res:Rf>=140, seat:Rf>=70};
  const R=Rf*0.80, U=Rf/430;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1;
  /* no fill behind the lens: a dark rectangle in this box is the frame he
     ruled out round Uni on 10 November */
  ctx.clearRect(0,0,W0,H0);
  { const fg=ctx.createRadialGradient(cx,cy,0,cx,cy,Rf); fg.addColorStop(0,'#0b0a0d'); fg.addColorStop(0.7,'#08080a'); fg.addColorStop(1,'#050506');
   ctx.beginPath(); ctx.arc(cx,cy,Rf,0,TAU); ctx.fillStyle=fg; ctx.fill();
   ctx.lineWidth=1; ctx.strokeStyle=`rgba(216,213,204,${0.2*boot})`; ctx.stroke(); }
  /* the four field anchors, two above the body and two below */
  [-1,1].forEach(side=>{ (reach<14?[-3,3]:[-6,6]).forEach(dx=>{ const y0=cy+side*(Rf+reach*0.43), y1=cy+side*(Rf+reach);
   ctx.beginPath(); ctx.moveTo(cx+dx,y0); ctx.lineTo(cx+dx,y1); ctx.strokeStyle=`rgba(216,213,204,${OP.raw*boot})`; ctx.lineWidth=1.2; ctx.stroke(); }); });
  /* CQ, the still gold arc, at the reading's own figure. None while unread. */
  if(CQ!=null&&CQ>0){ const Rc=Rf+reach*0.23, a0=-PI/2, a1=a0+clamp(CQ/100,0,1)*TAU; ctx.beginPath(); ctx.arc(cx,cy,Rc,a0,a1); ctx.lineWidth=1.4; ctx.lineCap='round'; ctx.strokeStyle=`rgba(194,160,99,${0.6*boot})`; ctx.stroke(); ctx.lineCap='butt'; }

  ctx.save(); ctx.translate(cx,cy); ctx.scale(S,S); ctx.translate(-cx,-cy);
  const at=(r,th)=>({x:cx+Math.cos(th)*r,y:cy+Math.sin(th)*r});
  const lisLine=0.06*lis;
  for(let r=0;r<7;r++){ const m=seatMid(r), span=SEC-2*GAPA*0.6; const col=rgb(SEATCOL[r]);
   ctx.globalAlpha=1; ctx.beginPath(); ctx.arc(cx,cy,R*RUNG.seat,m-span/2,m+span/2); ctx.strokeStyle=rgba(col,(0.34+lisLine)*boot); ctx.lineWidth=1.2; ctx.stroke();
   const lp=at(R*1.055,m); ctx.font='500 '+Math.max(FS,Math.round(11*U))+'px '+fs0; ctx.textAlign='center'; ctx.textBaseline='middle';
   if(TX.seat){ ctx.fillStyle=rgba(col,0.62*boot); ctx.fillText(SEATNM[r],lp.x,lp.y); } }

  const climbAge=CL.on?(RM?99:(pn-CL.t0)/1000):-1;
  const chainRel=CL.rel?1-easeInOut((pn-CL.rel)/1200):1; if(CL.rel&&chainRel<=0){ CL.on=false; CL.rel=0; }
  const placed=[];
  const rungLit={cx:CH.cxs.length>0, hy:CH.hys.length>0, sup:CH.sups.length>0};
  ['cx','hy','sup'].forEach(k=>{
   const rr=R*RUNG[k];
   const locked=LOCKED.has(k);
   const reached=CL.on&&rungLit[k];
   const shownUnr=CL.on&&!rungLit[k]&&climbAge>=CT[k]?chainRel:0;
   if(!locked){ ctx.save(); ctx.globalAlpha=1; ctx.setLineDash([2*Math.max(1,U*2),5*Math.max(1,U*2)]); ctx.beginPath(); ctx.arc(cx,cy,rr,0,TAU); ctx.strokeStyle=rgba(BONE,OP.ghost*boot*(reached?0:1)); ctx.lineWidth=1; ctx.stroke(); ctx.restore();
    if(reached){ ctx.beginPath(); ctx.arc(cx,cy,rr,0,TAU); ctx.strokeStyle=rgba(BONE,OP.ghost*boot); ctx.lineWidth=1; ctx.stroke(); } }
   /* locked on this plan: the ledger's shut grille, a solid orbit with short
      bars across it, still. Bars are scaled by the mockup's floor scale and
      not by U, which closes them to a pixel in this box. */
   else { const bl=3*Math.max(U,0.55);
    ctx.globalAlpha=1; ctx.beginPath(); ctx.arc(cx,cy,rr,0,TAU); ctx.strokeStyle=rgba(BONE,(OP.ghost+0.04)*boot); ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); const nb=k==='sup'?12:24; for(let q=0;q<nb;q++){ const th=q/nb*TAU; const c0=Math.cos(th), s0=Math.sin(th); ctx.moveTo(cx+c0*(rr-bl),cy+s0*(rr-bl)); ctx.lineTo(cx+c0*(rr+bl),cy+s0*(rr+bl)); }
    ctx.strokeStyle=rgba(BONE,(OP.ghost+0.06)*boot); ctx.stroke(); }
   if(k==='sup'||!TX.rung) return;
   ctx.font=Math.max(FS,Math.round(10.5*U))+'px '+fs0; ctx.textAlign='center'; ctx.textBaseline='bottom';
   const lx0=cx, ly0=cy-rr-3;
   let tag=RUNGNM[k];
   if(locked) tag+=', locked on your plan';
   else if(shownUnr>0.5) tag+=', not reached';
   ctx.globalAlpha=1; ctx.fillStyle=rgba(BONE,(locked?0.55:0.42)*boot); ctx.fillText(tag,lx0,ly0);
   const tw0=ctx.measureText(tag).width; const fsn=Math.max(FS,Math.round(10.5*U));
   if(locked) lockGlyph(lx0-tw0/2-9,ly0-6,8,0.62*boot);
   placed.push({x0:lx0-tw0/2-(locked?16:0)-3,x1:lx0+tw0/2+3,y0:ly0-fsn*1.2,y1:ly0+2});
  });

  ctx.globalCompositeOperation='lighter';
  const held=new Map();
  for(const k in resFx){ const f=resFx[k]; const a=RM?9:(pn-f.t0)/1000; const rel=f.rel?1-easeInOut((pn-f.rel)/1200):1;
   f.addrs.forEach((i,q)=>{ const u=easeOut((a-0.12-q*0.09-0.5)/0.26)*rel; held.set(i,Math.max(held.get(i)||0,u)); }); }
  const pending=new Set(); for(const k in RD.seats){ const st=RD.seats[k]; if(!st.resolved) st.addrs.forEach(i=>pending.add(i)); }
  /* the dot floor, the mockup's: 108 dots that cannot be seen are not 108 */
  addrs.forEach(a=>{
   const p=at(R*a.rf,a.ang); const sq=a.sq||0;
   const rr=Math.max(0.8,(1.1+Math.sqrt(sq/10)*3.0)*U*1.6);
   const hv=held.get(a.i)||0;
   const A=mix(OP.raw,OP.full,hv)*boot;
   blit(HALO[a.ring],p.x,p.y,rr*7,0.32*A);
   blit(CORE[a.ring],p.x,p.y,rr*2.8,A);
  });
  ctx.globalCompositeOperation='source-over';
  pending.forEach(i=>{ const a=byI[i]; if(!a) return; const p=at(R*a.rf,a.ang); const L2=3; ctx.globalAlpha=1; ctx.strokeStyle=rgba([255,244,226],OP.raw); ctx.lineWidth=1;
   ctx.beginPath(); ctx.moveTo(p.x-L2,p.y); ctx.lineTo(p.x+L2,p.y); ctx.moveTo(p.x,p.y-L2); ctx.lineTo(p.x,p.y+L2); ctx.stroke(); });

  const MU=Math.max(U,0.55);
  for(let k=rawFx.length-1;k>=0;k--){ const f=rawFx[k]; const age=(pn-f.t0)/1000; if(age>0.32||RM){ rawFx.splice(k,1); continue; }
   const u=EOUT(age/0.32), env=1-age/0.32; const col=rgb(SEATCOL[f.ring]);
   if(f.addrs.length){ f.addrs.forEach(i=>{ const a=byI[i]; if(!a) return; const p=at(R*a.rf,a.ang); ctx.globalAlpha=1; ctx.beginPath(); ctx.arc(p.x,p.y,(3+11*u)*MU,0,TAU); ctx.strokeStyle=rgba([Math.min(255,col[0]+60),Math.min(255,col[1]+60),Math.min(255,col[2]+60)],OP.raw*env); ctx.lineWidth=1.2; ctx.stroke(); }); }
   else { const m=seatMid(f.ring), span=SEC-2*GAPA*0.6; ctx.globalAlpha=1; ctx.beginPath(); ctx.arc(cx,cy,R*RUNG.seat,m-span/2,m+span/2); ctx.strokeStyle=rgba(col,OP.raw*env); ctx.lineWidth=1.2+4*(1-u); ctx.stroke(); }
  }

  const labels=[];
  for(const k in resFx){ const f=resFx[k]; const ring=f.ring; const a=RM?9:(pn-f.t0)/1000;
   const rel=f.rel?1-easeInOut((pn-f.rel)/1200):1; if(rel<=0){ delete resFx[k]; continue; }
   const col=rgb(SEATCOL[ring]).map((v,j)=>Math.round(mix(v,[240,214,160][j],0.35)));
   const np=at(R*RUNG.seat,f.na);
   f.addrs.forEach((i,q)=>{ const ad=byI[i]; if(!ad) return; const p=at(R*ad.rf,ad.ang); const u=EOUT((a-0.12-q*0.09)/0.5); if(u<=0) return;
    const c=curve(p,np,0.18); strokeQ(p,c,np,u,col,OP.full*rel,0.9);
    if(u<1){ const hp=qpt(p,c,np,u); ctx.globalCompositeOperation='lighter'; blit(WARM,hp.x,hp.y,12*MU,0.7*rel); ctx.globalCompositeOperation='source-over'; } });
   const gStart=0.12+Math.max(0,f.addrs.length-1)*0.09+0.5;
   const nd=RM?1:(a<gStart?0:OVS((a-gStart)/0.26));
   if(nd>0){ const ns=6*MU*nd; ctx.globalAlpha=1; ctx.beginPath(); ctx.arc(np.x,np.y,ns,0,TAU); ctx.strokeStyle=rgba(CREAM,OP.full*rel); ctx.lineWidth=1.5; ctx.stroke(); }
   const lp=RM?1:clamp((a-gStart-0.12)/0.24,0,1);
   if(lp>0&&TX.res) labels.push({p:at(R*(RUNG.seat-0.1),f.na),txt:SEATNM[ring]+(f.fet?', '+f.fet:''),al:lp*rel,col:SEATCOL[ring],sl:4*(1-easeOut(lp))});
  }
  for(let k=pings.length-1;k>=0;k--){ const pg=pings[k]; const f=resFx[pg.ring]; const age=(pn-pg.t0)/1000; if(!f||age>0.9||RM){ pings.splice(k,1); continue; }
   const np=at(R*RUNG.seat,f.na), u=EOUT(age/0.9); ctx.globalAlpha=1; ctx.beginPath(); ctx.arc(np.x,np.y,(6+16*u)*MU,0,TAU); ctx.strokeStyle=rgba(CREAM,OP.full*(1-u)*0.8); ctx.lineWidth=1; ctx.stroke(); }

  if(CL.on){
   const ca=climbAge, rel=chainRel;
   const sabP=new Map(); CH.sabs.forEach(s=>sabP.set(s,at(R*(RUNG.seat-0.075),s.ang)));
   CH.sabs.forEach((s,j)=>{ const u0=(ca-CT.sab-j*CT.sabStep); if(u0<0) return; const nd=RM?1:OVS(u0/CT.land); const p=sabP.get(s); const col=rgb(SEATCOL[s.ring]);
    const lu=RM?1:EOUT(u0/0.3);
    s.parts.forEach(i=>{ const ad=byI[i]; if(!ad) return; const q=at(R*ad.rf,ad.ang); ctx.globalAlpha=1; ctx.beginPath(); ctx.moveTo(p.x,p.y);
     if(ad.ring===s.ring) ctx.lineTo(mix(p.x,q.x,lu),mix(p.y,q.y,lu));
     else { let d=((ad.ang-s.ang)%TAU+TAU+PI)%TAU-PI; const rr=R*0.835; const e=at(rr,s.ang); ctx.lineTo(e.x,e.y); ctx.arc(cx,cy,rr,s.ang,s.ang+d*lu,d<0); if(lu>=1) ctx.lineTo(q.x,q.y); }
     ctx.strokeStyle=rgba(col,0.55*OP.full*rel); ctx.lineWidth=0.7; ctx.stroke(); });
    ctx.globalAlpha=1; ctx.beginPath(); ctx.arc(p.x,p.y,4.2*MU*nd,0,TAU); ctx.strokeStyle=rgba(col.map(v=>Math.min(255,v+50)),OP.full*rel); ctx.lineWidth=1.4; ctx.stroke();
    /* saboteur names stay off, the mockup's call: in this box that band is
       one label tall and the resolved seat labels already hold it */ });
   /* a locked rung's marks are not drawn and do not climb: sightR has
      already emptied its list, so there is nothing to draw, and the grille
      above says why */
   function rungStage(list,k,fromP){ const out=new Map();
    list.forEach((n,j)=>{ const tp=at(R*RUNG[k],n.ang); out.set(n,tp);
     const u0=ca-CT[k]-j*CT.sabStep; if(u0<0) return; const u=RM?1:easeInOut(u0/CT.travel);
     n.parts.forEach(pp=>{ const fp=fromP.get(pp); if(!fp) return; const c=curve(fp,tp,0.12); strokeQ(fp,c,tp,u,CREAM,OP.full*rel*0.8,0.9);
      if(u<1){ const hp=qpt(fp,c,tp,u); ctx.globalCompositeOperation='lighter'; blit(WARM,hp.x,hp.y,14*MU,0.8*rel); ctx.globalCompositeOperation='source-over'; } });
     const l0=u0-CT.travel; if(l0<0&&!RM) return; const nd=RM?1:OVS(l0/CT.land);
     ctx.globalAlpha=1; ctx.beginPath(); ctx.arc(tp.x,tp.y,5*MU*nd,0,TAU); ctx.strokeStyle=rgba(CREAM,OP.full*rel); ctx.lineWidth=1.5; ctx.stroke();
     ctx.beginPath(); ctx.arc(tp.x,tp.y,2.2*MU*nd,0,TAU); ctx.stroke();
     if(TX.rung) labels.push({p:tp,side:true,txt:k==='cx'?(n.fam||n.nm)+' complex':k==='hy'?n.nm+' hyper-complex':n.nm,al:(RM?1:clamp((l0-0.1)/0.24,0,1))*rel,col:'#e8dcc0',sl:0,small:true}); });
    return out; }
   const cxP=rungStage(CH.cxs,'cx',sabP);
   const hyP=rungStage(CH.hys,'hy',cxP);
   rungStage(CH.sups,'sup',hyP);
  }

  labels.forEach(l=>{ const fs=Math.max(FS,Math.round((l.small?10.5:11.5)*U)); ctx.font=(l.small?'':'500 ')+fs+'px '+fs0; ctx.textBaseline='middle'; ctx.textAlign='center';
   const tw=ctx.measureText(l.txt).width; const dx=l.p.x-cx, dy=l.p.y-cy, dl=Math.hypot(dx,dy)||1; let x=l.p.x-dx/dl*l.sl, y=l.p.y-dy/dl*l.sl;
   if(l.side) x+=(dx>=0?1:-1)*(8+tw/2);
   /* kept inside the lens: this box crops at its edge */
   const lim=Rf-6; x=clamp(x,cx-lim+tw/2+4,cx+lim-tw/2-4);
   const hit=(x,y)=>placed.some(r=>x-tw/2-4<r.x1&&x+tw/2+4>r.x0&&y-fs*0.7<r.y1&&y+fs*0.7>r.y0);
   for(let k=0;k<8&&hit(x,y);k++){ if(l.side) y+=fs*1.2; else { x-=dx/dl*fs*1.15; y-=dy/dl*fs*1.15; } }
   placed.push({x0:x-tw/2-4,x1:x+tw/2+4,y0:y-fs*0.7,y1:y+fs*0.7});
   ctx.globalAlpha=clamp(l.al*0.8,0,1); ctx.fillStyle='rgba(3,3,4,.72)'; ctx.fillRect(x-tw/2-4,y-fs*0.7,tw+8,fs*1.4);
   ctx.globalAlpha=clamp(l.al,0,1); ctx.fillStyle='#f1e4c6'; ctx.fillText(l.txt,x,y);
   ctx.fillStyle=l.col; ctx.fillRect(x-tw/2-4,y-fs*0.7,1,fs*1.4); });

  /* the centre word, the one readout kept, outside the breath's scale so it
     never swims, and only where it fits inside the hyper-complex orbit */
  ctx.restore();
  ctx.globalAlpha=1; ctx.font='500 '+FS+'px '+fs0; ctx.textAlign='center'; ctx.textBaseline='middle';
  if(ctx.measureText(stateWord).width/2+3<R*RUNG.hy){ ctx.fillStyle=`rgba(216,213,204,${(0.5+0.25*lis)*boot})`; ctx.fillText(stateWord,cx,cy); }
  ctx.globalCompositeOperation='source-over';
 }

 function mount(host){ if(!host) return false; if(canvas.parentNode!==host) host.appendChild(canvas); canvas.hidden=false;
  if(!running){ running=true; prevNow=null; raf=requestAnimationFrame(draw); } return true; }
 function pause(){ running=false; cancelAnimationFrame(raf); canvas.hidden=true; }
 readAddrs();
 window.SrcFace={mount,pause,sync,read,voice,
  /* what the gates read, the way window.Uni exposes chakraTags */
  state:()=>({word:stateWord,lis,W:W0,H:H0,running,speaking,cq:CQ,addrs:addrs.length,
   locked:[...LOCKED],rungs:{sab:CH.sabs.length,cx:CH.cxs.length,hy:CH.hys.length,sup:CH.sups.length},
   seats:Object.keys(resFx).map(k=>({seat:SEATNM[k],fet:resFx[k].fet,addrs:resFx[k].addrs.slice()})),
   climbing:CL.on,voiceWord:VO?VO.idx:-1})};
})();
