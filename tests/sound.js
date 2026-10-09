/* ============================================================
   THE FITTINGS, GATED. node tests/sound.js

   The interface's own sounds, ui/sound.js, read through sfx(name)
   off the table SFX. Nobody can listen in a headless browser, so
   this gate holds what can be held without an ear, and says the
   rest is unheard:

     1  every row, rendered offline through the product's own
        sfxRender, peaks under its own ceiling and under SFX_CEIL,
        ends inside its own cap and under SFX_MAX_MS, has almost
        nothing under 150 hertz and little over 4 kilohertz, and
        lands on zero without a step.
     2  with the switch off, sfx() makes no audio node at all.
     3  Quiet silences it.
     4  an unknown name is harmless, and is said once.
     5  nothing sounds before a person has pressed anything.
     6  a release run with its own sound off stays silent, whatever
        the fittings switch says.
     7  the hooks fire: a refusal through status, a Story commit,
        and the mark replacing the keep on the press that earned it.
     9  the tension lines spark: a mouse arriving on a thread on the
        Field, and on a cable on the Body once zoomed in close, and not
        while it rests there or at the whole body.
    10  every press on the Field sounds, round OU: a mouse on an
        address and a finger on the core, the two paths that never
        reached hitPress, and the press comes up by its lift at full
        zoom, rendered there under its ceiling.

   THE ATMOSPHERE, round OU and OV, is gated in atmGate below, which
   soundGate calls last on a context of its own: the map against every
   control on every tab, every row at every pitch it can sound at, the
   room under a zoom, the silences, real presses and real hovers, and
   the limiters. The release walk in section 6 also fires the
   atmosphere at every step of the run, and all of it must stay silent.

   THE INSTRUMENT IS CHECKED BEFORE IT READS ANYTHING, the standing
   rule: a known 0.05 sine of 200 ms must read 0.05 and 200, a 6
   kilohertz tone must read as high and a 100 hertz tone as low.

   AND THE GATE IS CHECKED AGAINST A BROKEN ENGINE. Each switch is
   taken out in turn, in the page, and the same assertion is run
   again and must fail: a gate that cannot see sound when sound is
   made is not measuring the silence it reports. The table checks
   are run against a deliberately loud, long row and must refuse it.

   Audio nodes are counted by wrapping the live context's create
   methods before the page loads. An offline context is not counted,
   because the gate's own renders use one.
   ============================================================ */
const path=require('path');

async function soundGate(browser,FILE,ok,booted){
 const COUNT=`(function(){
  window.__nodes=0; window.__ctxs=0; window.__osc=0;
  var B=window.BaseAudioContext||window.AudioContext;
  ['createOscillator','createGain','createBiquadFilter','createBufferSource','createStereoPanner','createChannelMerger']
   .forEach(function(m){ var f=B.prototype[m]; if(!f)return;
    B.prototype[m]=function(){ if(!(window.OfflineAudioContext&&this instanceof OfflineAudioContext)){
      window.__nodes++; if(m==='createOscillator')window.__osc++; }
     return f.apply(this,arguments); }; });
  var AC=window.AudioContext;
  if(AC){ window.AudioContext=function(o){ window.__ctxs++; return new AC(o); };
   window.AudioContext.prototype=AC.prototype; }})();`;
 const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
 await ctx.addInitScript(COUNT);
 const pg=await ctx.newPage();
 const err=[], warns=[];
 pg.on('pageerror',e=>err.push(e.message));
 pg.on('console',m=>{ if(/sfx:/.test(m.text()))warns.push(m.text()); });
 await pg.goto(FILE,{waitUntil:'load'}); await booted(pg);

 /* ---------- 1. the table, measured offline ---------- */
 const T=await pg.evaluate(async()=>{
  var SR=44100;
  function fft(re,im){var n=re.length;
   for(var i=1,j=0;i<n;i++){var b=n>>1; for(;j&b;b>>=1)j^=b; j^=b;
    if(i<j){var t=re[i];re[i]=re[j];re[j]=t; t=im[i];im[i]=im[j];im[j]=t;}}
   for(var len=2;len<=n;len<<=1){var a=-2*Math.PI/len, wr=Math.cos(a), wi=Math.sin(a);
    for(var i=0;i<n;i+=len){var cr=1,ci=0;
     for(var k=0;k<len/2;k++){var ur=re[i+k],ui=im[i+k],
      vr=re[i+k+len/2]*cr-im[i+k+len/2]*ci, vi=re[i+k+len/2]*ci+im[i+k+len/2]*cr;
      re[i+k]=ur+vr; im[i+k]=ui+vi; re[i+k+len/2]=ur-vr; im[i+k+len/2]=ui-vi;
      var nr=cr*wr-ci*wi; ci=cr*wi+ci*wr; cr=nr;}}}}
  /* the meter: peak, length to the last sample over -60 dBFS, rms over that
     length, share of energy under 150 Hz and over 4 kHz, the centroid, and the
     largest step in the last 2 ms before silence */
  function meter(x,t0){
   var pk=0,last=-1,i0=Math.round(t0*SR);
   for(var i=0;i<x.length;i++){var a=Math.abs(x[i]); if(a>pk)pk=a; if(a>0.001)last=i;}
   var s=0,n=Math.max(1,last-i0); for(var i=i0;i<last;i++)s+=x[i]*x[i];
   var N=1; while(N<x.length)N<<=1;
   var re=new Float64Array(N), im=new Float64Array(N); re.set(x); fft(re,im);
   var tot=0,lo=0,hi=0,cen=0;
   for(var k=1;k<N/2;k++){var e=re[k]*re[k]+im[k]*im[k], f=k*SR/N; tot+=e; cen+=e*f;
    if(f<150)lo+=e; if(f>4000)hi+=e;}
   var step=0; for(var i=Math.max(1,last-Math.round(0.002*SR));i<x.length;i++){
    var d=Math.abs(x[i]-x[i-1]); if(d>step)step=d;}
   return {peak:pk, ms:(last-i0)/SR*1000, rms:20*Math.log10(Math.sqrt(s/n)||1e-9),
    lo:lo/tot, hi:hi/tot, cen:cen/tot, step:step};}
  async function render(sec,fn){
   var ac=new OfflineAudioContext(1,Math.round(sec*SR),SR); fn(ac);
   return (await ac.startRendering()).getChannelData(0);}
  /* the self test, on known signals */
  async function sine(f,amp){return render(0.4,function(ac){var o=ac.createOscillator(), g=ac.createGain();
   o.frequency.value=f; g.gain.setValueAtTime(0,0); g.gain.setValueAtTime(amp,0.01); g.gain.setValueAtTime(0,0.21);
   o.connect(g); g.connect(ac.destination); o.start(0); o.stop(0.3);});}
  var self={a:meter(await sine(440,0.05),0.01), hi:meter(await sine(6000,0.05),0.01),
   lo:meter(await sine(100,0.05),0.01)};
  /* the rule a row is held to, one function, so the broken row below goes
     through exactly what the real rows go through */
  function judge(x,m){var bad=[];
   if(!(x.ceil<=SFX_CEIL))bad.push('ceiling '+x.ceil+' over SFX_CEIL');
   if(!(x.max<=SFX_MAX_MS))bad.push('cap '+x.max+' over SFX_MAX_MS');
   if(!(sfxLen(x)<=x.max))bad.push('declared '+sfxLen(x)+' over cap '+x.max);
   if(!(m.peak<=x.ceil))bad.push('peak '+m.peak.toFixed(4)+' over its ceiling '+x.ceil);
   if(!(m.ms<=x.max))bad.push('rang '+m.ms.toFixed(0)+' ms over its cap '+x.max);
   if(!(m.lo<0.01))bad.push('under 150 Hz '+(m.lo*100).toFixed(2)+'%');
   if(!(m.hi<0.05))bad.push('over 4 kHz '+(m.hi*100).toFixed(2)+'%');
   if(!(m.step<0.001))bad.push('end step '+m.step.toFixed(5));
   if(!(x.gap>0))bad.push('no rate limit');
   return bad;}
  var rows=[];
  for(var r=0;r<SFX.length;r++){var x=SFX[r];
   var buf=await render((x.max+300)/1000,function(ac){sfxRender(ac,ac.destination,x,0.01);});
   var m=meter(buf,0.01); rows.push({k:x.k,max:x.max,ceil:x.ceil,len:sfxLen(x),m:m,bad:judge(x,m)});
   /* A ROW WITH A LIFT IS ALSO RENDERED AT ITS TOP, the Field press at the
      deepest zoom, through the same gain sfx() hands sfxRender, and held to
      the same ceiling, because that is the loudest it ever plays */
   if(x.lift){ var g=Math.pow(10,x.lift/20);
    var lb=await render((x.max+300)/1000,function(ac){sfxRender(ac,ac.destination,x,0.01,g);});
    var lm=meter(lb,0.01); rows.push({k:x.k+'+'+x.lift,max:x.max,ceil:x.ceil,len:sfxLen(x),m:lm,bad:judge(x,lm),lift:x.lift,base:m.peak});}}
  /* the deliberately broken row: kept, three times too loud and twice too long */
  var broke=JSON.parse(JSON.stringify(SFX_BY.kept)); broke.k='broken';
  broke.parts.forEach(function(p){p.pk*=4; p.r*=7;});
  var bb=await render(1.6,function(ac){sfxRender(ac,ac.destination,broke,0.01);});
  var bm=meter(bb,0.01);
  return {self:self, rows:rows, broken:judge(broke,bm), CEIL:SFX_CEIL, MAX:SFX_MAX_MS, n:SFX.length};});
 const db=v=>(20*Math.log10(v)).toFixed(1);
 ok(Math.abs(T.self.a.peak-0.05)<0.0005&&Math.abs(T.self.a.ms-200)<1.5&&T.self.hi.hi>0.9&&T.self.lo.lo>0.9,
  'the meter reads a known 0.05 sine of 200 ms as itself first, and tells high from low, got peak '
  +T.self.a.peak.toFixed(4)+' length '+T.self.a.ms.toFixed(1)+' ms, 6 kHz '+(T.self.hi.hi*100).toFixed(0)
  +'% high, 100 Hz '+(T.self.lo.lo*100).toFixed(0)+'% low');
 /* SIX BECAME NINE on 2 October: the owner pressed tabs and the Field with the
    switch on and heard nothing, and asked for a sound on each, so tap, field
    and begin joined kept, undo, refuse, mark, done and time. The bound is
    still a bound, because a family a person cannot learn is the other way to
    be unheard. NINE BECAME TEN the same day, spark, for the tension lines
    on the Field and on the Body zoomed in. Ten is the top of this bound, so
    the next sound a person asks for replaces a row or argues for the bound,
    and does not slip in under it. */
 ok(T.n>=2&&T.n<=10,'between two and ten fittings, the size of a family a person can learn, got '+T.n);
 console.log('  name     peak    dBFS   rms dBFS  length  cap   <150Hz  >4kHz  centroid');
 T.rows.forEach(r=>{
  console.log('  '+r.k.padEnd(8)+r.m.peak.toFixed(4).padStart(7)+db(r.m.peak).padStart(7)
   +r.m.rms.toFixed(1).padStart(9)+(r.m.ms.toFixed(0)+' ms').padStart(9)+String(r.max).padStart(5)
   +((r.m.lo*100).toFixed(2)+'%').padStart(9)+((r.m.hi*100).toFixed(2)+'%').padStart(8)
   +(r.m.cen.toFixed(0)+' Hz').padStart(10));
  ok(r.bad.length===0,r.k+': under its ceiling and its cap, clean at both ends of the band, '
   +(r.bad.join('; ')||'clean'));});
 /* round OU, "if I zoom in, this field sounds a little bit louder": the Field
    press carries a lift, and at its top it is that many decibels over itself */
 const lifted=T.rows.filter(r=>r.lift);
 ok(lifted.length>=1&&lifted.every(r=>Math.abs(20*Math.log10(r.m.peak/r.base)-r.lift)<0.3),
  'the Field press has a lift, and rendered at full zoom it is that much louder and still under its ceiling, '
  +JSON.stringify(lifted.map(r=>({k:r.k,up:+(20*Math.log10(r.m.peak/r.base)).toFixed(2),peak:+r.m.peak.toFixed(4),ceil:r.ceil}))));
 ok(T.broken.length>=2&&T.broken.some(s=>/peak/.test(s))&&T.broken.some(s=>/cap|rang|declared/.test(s)),
  'and the same rule refuses a row made loud and long on purpose: '+T.broken.join('; '));

 /* ---------- 5. nothing before a press ---------- */
 const pre=await pg.evaluate(()=>{
  CURP.ui=CURP.ui||{}; CURP.ui.sfxoff=false; CURP.ui.quiet=false;
  /* act is the browser's own flag, reported and not asserted: a harness that
     runs script into the page is counted by the browser as a press */
  var r={act:!!(navigator.userActivation&&navigator.userActivation.hasBeenActive), why:sfxWhy(),
   a:sfx('kept'), b:sfx('done')};
  status('A refusal before any press.','fail');
  r.nodes=window.__nodes; r.ctxs=window.__ctxs; r.played=SFX_PLAYED; return r;});
 ok(pre.why==='no press yet'&&!pre.a&&!pre.b&&pre.nodes===0&&pre.ctxs===0&&pre.played===0,
  'with the switch on and no press yet, nothing sounds, no context opens and no node is made, '+JSON.stringify(pre));
 /* the broken engine: the press check taken out */
 const preBite=await pg.evaluate(()=>{
  var keep=window.sfxGestured; window.sfxGestured=function(){return true;};
  var n0=window.__nodes, r=sfx('undo'); window.sfxGestured=keep;
  return {r:r, made:window.__nodes-n0};});
 ok(preBite.r==='undo'&&preBite.made>0,'and with the press check taken out the same call does make sound, '
  +preBite.made+' nodes, so the zero above is a reading');

 /* a real press, on an inert patch laid over the page for the purpose */
 await pg.evaluate(()=>{const d=document.createElement('div'); d.id='sfxpad';
  d.style.cssText='position:fixed;left:0;bottom:0;width:40px;height:40px;z-index:99999';
  document.body.appendChild(d);});
 await pg.click('#sfxpad'); await pg.waitForTimeout(1300);

 /* ---------- 8. THE OWNER'S DEFECT, through real presses ----------
    2 October: "I have the sound effects on, but I don't hear any sound
    effects." Measured before the fix, switch on, context running, a worked
    example open: a tab press started 0 oscillators and a Field press started
    0. So this holds the claim in the owner's own terms: with the switch on, a
    real press on a tab and a real press on the Field each start at least one
    oscillator and leave the context running. A real press and not a call to
    sfx(), because a call to sfx() was already green. */
 await pg.evaluate(()=>{ loadP(1); CURP.ui.sfxoff=false; CURP.ui.quiet=false; setTab(TAB.FIELD); render(); });
 await pg.waitForTimeout(1400);
 const mom={};
 const pressTab=async()=>{
  const id=await pg.evaluate(()=>{ const b=[...document.querySelectorAll('.tabtop')]
   .filter(x=>x.offsetParent&&x.getAttribute('aria-pressed')==='false')[0];
   if(!b)return null; b.setAttribute('data-sfxpick','1'); return true; });
  if(!id)return null;
  const o0=await pg.evaluate(()=>window.__osc);
  await pg.click('[data-sfxpick="1"]'); await pg.waitForTimeout(160);
  const r=await pg.evaluate(o0=>({osc:window.__osc-o0, ctx:BED_AC?BED_AC.state:'none'}),o0);
  await pg.evaluate(()=>{ const b=document.querySelector('[data-sfxpick]'); if(b)b.removeAttribute('data-sfxpick'); });
  return r;};
 mom.tab=await pressTab();
 ok(mom.tab&&mom.tab.osc>=1&&mom.tab.ctx==='running','with the switch on, a real press on a tab starts an oscillator and the context is running, '+JSON.stringify(mom.tab));
 await pg.evaluate(()=>{ setTab(TAB.FIELD); render(); });
 await pg.waitForTimeout(1400);
 const pt=await pg.evaluate(()=>{
  const b=cv.getBoundingClientRect(); const h=HIT.filter(x=>x.k==='node'&&x.x!==undefined&&x.n&&x.n.cf)[0]
   ||HIT.filter(x=>x.k==='law'||x.k==='seat')[0];
  if(!h)return null;
  const x=h.x!==undefined?h.x:h.cx+Math.cos((h.a0+h.a1)/2)*(h.r0+h.r1)/2;
  const y=h.y!==undefined?h.y:h.cy+Math.sin((h.a0+h.a1)/2)*(h.r0+h.r1)/2;
  return {x:b.left+x,y:b.top+y,k:h.k,osc:window.__osc};});
 if(pt){
  await pg.mouse.click(pt.x,pt.y); await pg.waitForTimeout(220);
  mom.field=await pg.evaluate(o0=>({osc:window.__osc-o0, ctx:BED_AC?BED_AC.state:'none', last:SFX_LAST.field>0}),pt.osc);}
 ok(pt&&mom.field&&mom.field.osc>=1&&mom.field.ctx==='running'&&mom.field.last,
  'and a real press on the Field starts an oscillator and sounds field, '+JSON.stringify({pt:pt&&pt.k,r:mom.field}));
 /* the broken engine: the hooks taken out, the same two presses */
 await pg.waitForTimeout(1400);
 /* the atmosphere's click is taken out with them, because a tab press whose
    fitting is gone is otherwise answered by the layer under it, round OU */
 const deaf=await pg.evaluate(()=>{ window.__sfxKeep=window.sfx; window.sfx=function(){return false;};
  if(typeof atmPlay==='function'){ window.__atmKeep=window.atmPlay; window.atmPlay=function(){return false;}; } return true; });
 const dtab=await pressTab();
 let dfield=null;
 if(pt){ const o1=await pg.evaluate(()=>window.__osc); await pg.mouse.click(pt.x,pt.y); await pg.waitForTimeout(220);
  dfield=await pg.evaluate(o1=>window.__osc-o1,o1); }
 await pg.evaluate(()=>{ window.sfx=window.__sfxKeep; if(window.__atmKeep)window.atmPlay=window.__atmKeep; });
 ok(dtab&&dtab.osc===0&&dfield===0,'and with the hooks and the layer under them taken out the same two presses start none, so the counts above are readings, tab '
  +(dtab&&dtab.osc)+', field '+dfield);
 await pg.waitForTimeout(1400);

 /* ---------- 10. EVERY PRESS ON THE FIELD SOUNDS, AND LOUDER CLOSER IN ----------
    Round OU: "if I click on the field, if I zoom in, this field sounds a
    little bit louder." The press above landed on a law, which reaches
    hitPress. A mouse press on an address does not: it arms the drag at the
    press and opens the drill on the release, so the mark a person presses most
    was silent. Measured on b2b7a03 before the fix, through the real mouse, it
    sounded nothing. Held here through the real mouse, then the same press at
    the deepest zoom, which must come up by the row's lift. */
 const addrAt=()=>pg.evaluate(()=>{ const b=cv.getBoundingClientRect();
  for(const h of HIT){ if(h.k!=='node'||!h.n||!h.n.cf||h.cx===undefined)continue;
   const a=(h.a0+h.a1)/2, r=(h.r0+h.r1)/2, x=h.cx+Math.cos(a)*r, y=h.cy+Math.sin(a)*r;
   if(x<10||y<10||x>b.width-10||y>b.height-10)continue;
   const t=hitTest(x,y); if(t&&t.k==='node'&&t.n===h.n)return {x:b.left+x,y:b.top+y,nm:h.n.nm||h.n.cf};}
  return null;});
 await pg.evaluate(()=>{ loadP(1); CURP.ui.sfxoff=false; CURP.ui.quiet=false; setTab(TAB.FIELD); S.zoom=1; S.panx=0; S.pany=0; reframe(); render(); });
 await pg.waitForTimeout(900);
 const ad=await addrAt();
 const pressAddr=async()=>{ const f0=await pg.evaluate(()=>({t:SFX_LAST.field||0, p:SFX_PLAYED}));
  await pg.mouse.click(ad.x,ad.y); await pg.waitForTimeout(160);
  return pg.evaluate(f0=>({field:(SFX_LAST.field||0)>f0.t, played:SFX_PLAYED-f0.p,
   lift:typeof SFX_LIFT==='undefined'?'no lift on this build':SFX_LIFT}),f0);};
 let a1=null, a2=null, aBite=null;
 if(ad){
  a1=await pressAddr(); await pg.waitForTimeout(300);
  /* the deepest zoom that still has an address on the canvas, because at the
     very deepest the addresses have gone past the edge */
  for(const z of [7,5,3.5,2.5,1.8]){
   await pg.evaluate(z=>{ sheetShut(); S.zoom=Math.min(z,WHEEL_ZOOM_MAX); S.panx=0; S.pany=0; reframe(); render(); },z);
   await pg.waitForTimeout(500);
   const ad2=await addrAt();
   if(ad2){ ad.x=ad2.x; ad.y=ad2.y; a2=await pressAddr();
    if(a2)a2.want=await pg.evaluate(()=>{ const f=fieldZoom(); return +(3*Math.log(f.s)/Math.log(f.max)).toFixed(3); });
    break; }}
  await pg.waitForTimeout(300);
  /* the broken engine: the Field press taken out, and the same press must
     read as silent */
  await pg.evaluate(()=>{ sheetShut(); S.zoom=1; S.panx=0; S.pany=0; reframe(); render(); });
  await pg.waitForTimeout(500);
  const ad3=await addrAt();
  if(ad3){ ad.x=ad3.x; ad.y=ad3.y;
   await pg.evaluate(()=>{ window.__sk=window.sfx; window.sfx=function(n,r){ return n==='field'?false:window.__sk(n,r); }; });
   aBite=await pressAddr();
   await pg.evaluate(()=>{ window.sfx=window.__sk; sheetShut(); });}}
 ok(ad&&a1&&a1.field&&a1.played===1,'a real mouse press on an address on the wheel sounds the Field press, once, '+JSON.stringify({at:ad&&ad.nm,r:a1}));
 ok(a2&&a2.field&&a2.lift&&a2.lift.db>0.5&&Math.abs(a2.lift.db-a2.want)<0.05&&a1&&a1.lift&&a1.lift.db===0,
  'and the same press zoomed in comes up by its lift on the zoom\'s logarithm, 3 dB at the deepest, from 0 at 1x, '
  +JSON.stringify({near:a1&&a1.lift,far:a2&&a2.lift,want:a2&&a2.want}));
 ok(aBite&&aBite.field===false,'and with that path\'s hook taken out the same press is silent, so the sound above is a reading, '+JSON.stringify(aBite));
 await pg.evaluate(()=>{ S.zoom=1; S.panx=0; S.pany=0; reframe(); render(); });
 await pg.waitForTimeout(1400);

 /* ---------- 9. THE TENSION LINES SPARK ----------
    2 October, the owner: "Make sure there's sound effects for the tension
    lines on the field. And the body when you zoom in, close to the tension
    lines. Sounds more like static. Or electricity." Held through a real
    mouse, the way he would meet it: arriving on a thread on the Field
    sparks, staying on it does not, leaving and coming back does again. On
    the Body the same arrival on a cable is silent at the whole body and
    sparks once the view is close. Each silence is checked against an engine
    with its rule taken out. The threads and cables are behind the plan's
    sight, so the gate opens it for this section and puts it back. Every
    move waits out the row's own 600 ms gap first, so a silence is the rule
    and not the rate limit. */
 const sightWas=await pg.evaluate(()=>{ const w=typeof SIGHT_PLAN==='undefined'?undefined:SIGHT_PLAN;
  SIGHT_PLAN={tier:'four',status:'active'}; loadP(1); CURP.ui.sfxoff=false; CURP.ui.quiet=false;
  setTab(TAB.FIELD); render(); return w===undefined||w===null?'__none':w; });
 await pg.waitForTimeout(1500);
 const spk=()=>pg.evaluate(()=>SFX_LAST.spark||0);
 const FW=await pg.evaluate(()=>{ const b=cv.getBoundingClientRect(); let tgt=null, off=null;
  for(const p of PUL){ for(const u of [0.5,0.4,0.6,0.3,0.7]){
    const x=p.qx!==undefined?(1-u)*(1-u)*p.x0+2*(1-u)*u*p.qx+u*u*p.x1:p.x0+(p.x1-p.x0)*u;
    const y=p.qy!==undefined?(1-u)*(1-u)*p.y0+2*(1-u)*u*p.qy+u*u*p.y1:p.y0+(p.y1-p.y0)*u;
    if(!hitTest(x,y)&&threadAt(x,y)){tgt={x:b.left+x,y:b.top+y};break;}} if(tgt)break;}
  for(const q of [[8,8],[b.width-8,8],[8,b.height-8],[b.width-8,b.height-8]])
   if(!hitTest(q[0],q[1])&&!threadAt(q[0],q[1])){off={x:b.left+q[0],y:b.top+q[1]};break;}
  return {n:PUL.length,tgt:tgt,off:off};});
 const fw={n:FW.n};
 if(FW.tgt&&FW.off){
  await pg.mouse.move(FW.off.x,FW.off.y); await pg.waitForTimeout(700);
  const t0=await spk(); await pg.mouse.move(FW.tgt.x,FW.tgt.y); await pg.waitForTimeout(120);
  const t1=await spk(); fw.arrive=t1>t0; await pg.waitForTimeout(700);
  await pg.mouse.move(FW.tgt.x+0.5,FW.tgt.y+0.5); await pg.waitForTimeout(120);
  const t2=await spk(); fw.stay=t2===t1;
  await pg.mouse.move(FW.off.x,FW.off.y); await pg.waitForTimeout(700);
  await pg.mouse.move(FW.tgt.x,FW.tgt.y); await pg.waitForTimeout(120);
  fw.again=(await spk())>t2;
  /* the broken engine: the arrival rule taken out, every move on a line sparks */
  await pg.waitForTimeout(700);
  await pg.evaluate(()=>{ window.__wt=window.wireTouch; window.wireTouch=function(k){ WIRE_AT=k; if(k)sfx('spark'); }; });
  const t3=await spk(); await pg.mouse.move(FW.tgt.x+0.5,FW.tgt.y+0.5); await pg.waitForTimeout(120);
  fw.biteStay=(await spk())>t3;
  await pg.evaluate(()=>{ window.wireTouch=window.__wt; });
  await pg.mouse.move(FW.off.x,FW.off.y);}
 ok(fw.n>0&&fw.arrive&&fw.stay&&fw.again,'on the Field, a mouse arriving on a tension line sparks, resting on it does not, and coming back to it does again, '
  +JSON.stringify(fw));
 ok(fw.biteStay===true,'and with the arrival rule taken out the same resting move does spark, so the silence above is a reading, '+fw.biteStay);
 await pg.mouse.move(2,2);
 await pg.evaluate(()=>{ setTab(TAB.ENERGY); render(); });
 await pg.waitForFunction(()=>BM.sabs&&BM.sabs.length>0&&!BM.camT,null,{timeout:15000}).catch(()=>{});
 await pg.waitForTimeout(600);
 const cable=()=>pg.evaluate(()=>{ const r=BM.sv.getBoundingClientRect(); let hit=null, off=null;
  for(const s of BM.sabs){ for(const v of [0,1]){ const c=s.views[v]; if(!c||!c.samp)continue;
    for(let j=Math.floor(c.samp.length/3);j<c.samp.length;j+=3){ const q=bmW2S(c.samp[j][0],c.samp[j][1]);
     if(q[0]<20||q[1]<20||q[0]>r.width-20||q[1]>r.height-20)continue;
     const pk=bmPick(q[0],q[1]); if(pk.sab&&!pk.place&&!pk.hub){hit={x:r.left+q[0],y:r.top+q[1],w:[c.samp[j][0],c.samp[j][1]]};break;}}
    if(hit)break;} if(hit)break;}
  for(let y=30;y<r.height-30&&!off;y+=37)for(let x=30;x<r.width-30;x+=37){ if(!bmPick(x,y).sab){off={x:r.left+x,y:r.top+y};break;}}
  return {hit:hit,off:off,close:bmClose(),zr:+(BM.cam.z/BM.z0).toFixed(2)};});
 const touchLine=async c=>{ await pg.mouse.move(c.off.x,c.off.y); await pg.waitForTimeout(700);
  const t0=await spk(); await pg.mouse.move(c.hit.x,c.hit.y); await pg.waitForTimeout(120);
  return {spark:(await spk())>t0, on:await pg.evaluate(()=>BM.hoverSab)};};
 const bw={};
 const fitC=await cable(); bw.fit={zr:fitC.zr,close:fitC.close};
 if(fitC.hit&&fitC.off){
  Object.assign(bw.fit,await touchLine(fitC));
  /* the broken engine: the close rule taken out, the same arrival must spark */
  await pg.evaluate(()=>{ window.__bc=window.bmClose; window.bmClose=function(){return true;}; });
  bw.fitBite=(await touchLine(fitC)).spark;
  await pg.evaluate(()=>{ window.bmClose=window.__bc; });
  await pg.evaluate(w=>bmFlyTo(w[0],w[1],BM.z0*2.5),fitC.hit.w);
  await pg.waitForFunction(()=>!BM.camT,null,{timeout:20000}).catch(()=>{});
  await pg.waitForTimeout(400);
  const cl=await cable(); bw.close={zr:cl.zr,close:cl.close};
  if(cl.hit&&cl.off)Object.assign(bw.close,await touchLine(cl));}
 ok(bw.fit&&bw.fit.on&&bw.fit.spark===false&&bw.close&&bw.close.close&&bw.close.on&&bw.close.spark===true,
  'on the Body, arriving on a tension line is silent at the whole body and sparks once zoomed in close, '+JSON.stringify(bw));
 ok(bw.fitBite===true,'and with the close rule taken out the same arrival at the whole body sparks, so that silence is a reading, '+bw.fitBite);
 await pg.mouse.move(2,2);
 await pg.evaluate(w=>{ SIGHT_PLAN=w==='__none'?null:w; if(BM.cv){BM.cam=bmFitCam();BM.camT=null;} setTab(TAB.FIELD); render(); },sightWas);
 await pg.waitForTimeout(1400);

 /* ---------- 2 and 3. the switch, and Quiet ---------- */
 const sw=await pg.evaluate(()=>{
  var o={};
  CURP.ui.sfxoff=true; CURP.ui.quiet=false;
  var n0=window.__nodes;
  o.off={why:sfxWhy(), r:[sfx('kept'),sfx('undo'),sfx('refuse'),sfx('mark'),sfx('done'),sfx('time')]};
  status('A refusal with the switch off.','fail');
  o.off.made=window.__nodes-n0;
  CURP.ui.sfxoff=false; CURP.ui.quiet=true; n0=window.__nodes;
  o.quiet={why:sfxWhy(), r:[sfx('kept'),sfx('undo'),sfx('refuse'),sfx('mark'),sfx('done'),sfx('time')]};
  o.quiet.made=window.__nodes-n0;
  /* ROUND OJ, SOUND IS ON BY DEFAULT: a profile that never said anything, and
     one carrying the old blank's sfx:false, are both open; only sfxoff shuts it */
  CURP.ui.quiet=false; delete CURP.ui.sfxoff; CURP.ui.sfx=false;
  o.dflt=sfxWhy();
  var fresh=blankProfile?blankProfile('x'):null; o.blank=fresh&&fresh.ui.sfxoff;
  return o;});
 ok(sw.dflt!=='off'&&sw.blank===false,'ON BY DEFAULT: a profile that never turned it off is not silent by the switch, and the blank carries sfxoff false, '+JSON.stringify({dflt:sw.dflt,blank:sw.blank}));
 ok(sw.off.why==='off'&&sw.off.r.every(x=>x===false)&&sw.off.made===0,
  'with the switch off, every fitting and a refusal through status make zero audio nodes, '+JSON.stringify(sw.off));
 ok(sw.quiet.why==='quiet'&&sw.quiet.r.every(x=>x===false)&&sw.quiet.made===0,
  'with Quiet on, the switch on makes zero audio nodes too, '+JSON.stringify(sw.quiet));
 /* the broken engine: each switch read as open */
 const swBite=await pg.evaluate(()=>{
  var keep=window.sfxWhy, out={};
  window.sfxWhy=function(){return '';};
  CURP.ui.sfxoff=true; CURP.ui.quiet=false; var n0=window.__nodes;
  out.off=sfx('kept'); out.offMade=window.__nodes-n0;
  CURP.ui.sfxoff=false; CURP.ui.quiet=true; n0=window.__nodes;
  out.quiet=sfx('done'); out.quietMade=window.__nodes-n0;
  window.sfxWhy=keep; CURP.ui.quiet=false;
  return out;});
 ok(swBite.off==='kept'&&swBite.offMade>0&&swBite.quiet==='done'&&swBite.quietMade>0,
  'and on an engine that ignores both switches the same calls make nodes, so both zeros are readings, '
  +JSON.stringify(swBite));

 /* ---------- 4. an unknown name, and the rate limit ---------- */
 await pg.waitForTimeout(1300);
 const un=await pg.evaluate(()=>{
  var n0=window.__nodes, threw=false, r=[];
  try{ r.push(sfx('nosuchsound')); r.push(sfx('nosuchsound')); r.push(sfx()); }catch(e){ threw=e.message; }
  return {r:r, threw:threw, made:window.__nodes-n0};});
 await pg.waitForTimeout(50);
 ok(!un.threw&&un.r.every(x=>x===false)&&un.made===0,'an unknown name returns false, makes nothing and never throws, '
  +JSON.stringify(un));
 ok(warns.filter(w=>/nosuchsound/.test(w)).length===1,'and is said in the console once, not every time, '
  +JSON.stringify(warns));
 await pg.waitForTimeout(1300);
 const rate=await pg.evaluate(()=>{
  var a=[]; for(var i=0;i<20;i++)a.push(sfx('kept'));
  var b=['undo','refuse','done','time','mark'].map(function(k){return sfx(k);});
  return {same:a.filter(Boolean).length, burst:a.concat(b).filter(Boolean).length, cap:SFX_BURST};});
 ok(rate.same===1,'twenty of the same in a loop sound once, '+rate.same);
 ok(rate.burst<=rate.cap,'and no more than '+rate.cap+' of any kind sound inside one second, '+rate.burst);

 /* ---------- 7. the hooks, through the real controls ---------- */
 await pg.waitForTimeout(1600);
 const st=await pg.evaluate(()=>{var p0=SFX_PLAYED, t0=SFX_LAST.refuse||0;
  status('Not saved, for the gate.','fail');
  return {played:SFX_PLAYED-p0, refuse:(SFX_LAST.refuse||0)>t0};});
 ok(st.played===1&&st.refuse,'a refusal through status sounds refuse, once, '+JSON.stringify(st));
 await pg.waitForTimeout(1600);
 const commit=async t=>{
  await pg.evaluate(t=>{loadP(0); setTab(TAB.STORY); stRender();
   const ta=document.getElementById('sttext'); ta.value=t; ta.dispatchEvent(new Event('input',{bubbles:true}));},t);
  await pg.waitForTimeout(80);
  const before=await pg.evaluate(()=>({p:SFX_PLAYED, last:Object.assign({},SFX_LAST),
   n:((CURP.story&&CURP.story.entries)||[]).length}));
  await pg.click('#stapply');
  await pg.waitForTimeout(80);
  return pg.evaluate(b=>({played:SFX_PLAYED-b.p, n:((CURP.story&&CURP.story.entries)||[]).length-b.n,
   which:Object.keys(SFX_LAST).filter(k=>SFX_LAST[k]!==b.last[k]),
   line:(document.getElementById('status')||{}).textContent}),before);};
 const c1=await commit('My chest is tight in every meeting and I have told no one.');
 ok(c1.n===1&&c1.played===1&&c1.which.join()==='mark',
  'the first Story entry earns First story, and the press sounds the mark in place of the keep, '+JSON.stringify(c1));
 await pg.waitForTimeout(1600);
 const c2=await commit('The kettle was on and the window was open.');
 ok(c2.n===1&&c2.played===1&&c2.which.join()==='kept',
  'the next entry sounds kept, whether or not anything read as charge, '+JSON.stringify(c2));
 const hooks=await pg.evaluate(()=>({
  status:/sfx\('refuse'\)/.test(status.toString()),
  commit:/sfx\('kept'\)/.test(stCommit.toString()),
  undo:/sfx\('undo'\)/.test(String((document.getElementById('undobtn')||{}).onclick)),
  redo:/sfx\('kept'\)/.test(String((document.getElementById('redobtn')||{}).onclick)),
  done:/sfx\('done'\)/.test(ritLog.toString()),
  time:/sfx\('time'\)/.test(ritTimer.toString())}));
 ok(Object.values(hooks).every(Boolean),'every hook point calls the engine by name, '+JSON.stringify(hooks));
 /* undo, through its own button, after a commit that moved the field */
 await pg.waitForTimeout(400);
 const c3=await commit('My stomach knots when my father calls. I was always afraid of him as a kid.');
 await pg.waitForTimeout(400);
 /* through the chord and not the arrow: the arrow sits in a bar the Story
    surface does not show, and the chord asks only that it is not hidden */
 const ub=await pg.evaluate(()=>{const b=document.getElementById('undobtn');
  if(document.activeElement)document.activeElement.blur();
  return {live:!!(b&&!b.hidden), p:SFX_PLAYED, t:SFX_LAST.undo||0, depth:undoDepth()};});
 ok(ub.live,'a commit that moved the field leaves something to take back, '+JSON.stringify(ub)+', '+c3.which.join());
 if(ub.live){
  await pg.keyboard.press('Control+z'); await pg.waitForTimeout(80);
  const ua=await pg.evaluate(b=>({played:SFX_PLAYED-b.p, undo:(SFX_LAST.undo||0)>b.t, depth:undoDepth(),
   line:(document.getElementById('status')||{}).textContent}),ub);
  ok(ua.played===1&&ua.undo&&ua.depth===ub.depth-1,'Ctrl+Z takes it back and sounds undo, '+JSON.stringify(ua));}

 /* ---------- 6. a silent release stays silent, with the fittings on ---------- */
 await pg.waitForTimeout(1600);
 const walk=async bite=>pg.evaluate(async bite=>{
  REL_WORD_S=0.0004; REL_GAP_S=0.001; REL_HEAD_S=0; REL_FRAME_S=0;
  if(window.speechSynthesis)speechSynthesis.speak=function(u){ setTimeout(function(){ if(u.onend)u.onend({}); },1); };
  loadP(0); CHARGES.forEach(c=>{S.charge[c]=7;});
  CURP.ui.sfxoff=false; CURP.ui.quiet=false; CURP.ui.voice=false; CURP.ui.tone=false;
  var keepRoom=window.sfxRoomHeld;
  if(bite)window.sfxRoomHeld=function(){return false;};
  relPick(compute().carrying.slice(0,1).map(n=>n.i));
  var probes=[], n0=0;
  var orig=window.relRender;
  window.relRender=function(){ orig();
   var p=RUN.phase, inRun=p==='welcome'||p==='opening'||p==='run'||(p==='done'&&RUN.cool<COOLING.length);
   if(inRun&&probes.filter(q=>q.ph===p+(p==='done'?' cooldown':'')).length<3){
    var a=sfx(['kept','undo','done','mark','time'][probes.length%5]);
    status('A refusal inside the run.','fail');
    /* the atmosphere is silent in the room too, round OU: a click, a tick, an
       overlay, an air swell and the room under a zoom, by the player itself.
       Absent on a build that has no atmosphere, and then read as silent. */
    var atm=(typeof atmPlay==='function')
     ?[atmPlay('click'), atmPlay('hover',null,true), atmPlay('overlay-on',{seat:'Heart'}), atmPlay('air-open'), atmZoom(3,7)]:[];
    probes.push({ph:p+(p==='done'?' cooldown':''), r:a, atm:atm});}};
  var go=document.getElementById('relgo'); if(!go){ window.relRender=orig; window.sfxRoomHeld=keepRoom; return {go:false}; }
  n0=window.__nodes; var p0=SFX_PLAYED, last0=Object.assign({},SFX_LAST);
  go.click();
  var t0=Date.now();
  while(!(RUN.phase==='done'&&RUN.cool>=COOLING.length)&&Date.now()-t0<60000)
   await new Promise(r=>setTimeout(r,40));
  var out={go:true, probes:probes, made:window.__nodes-n0, played:SFX_PLAYED-p0, phase:RUN.phase,
   keys:Object.keys(SFX_LAST).filter(function(k){return SFX_LAST[k]>=t0-5000&&SFX_LAST[k]!==(last0[k]||0);}),
   bed:bedState().on, ms:Date.now()-t0};
  window.relRender=orig; window.sfxRoomHeld=keepRoom;
  return out;},bite);
 /* and once the run has closed, the room is the interface's again. A real
    press first, because that is what a person does next, and the press is
    what takes in a mark the run itself earned, so the keep is not credited
    with it. Measured without the press: the next keep sounded the mark. */
 const after=async()=>{ await pg.waitForTimeout(1700); await pg.click('#sfxpad');
  return pg.evaluate(()=>{ const a=sfx('done'); relClose(); return a; }); };
 const rs=await walk(false);
 if(rs.go)rs.after=await after();
 ok(rs.go,'the release offers Run release on the person\'s own record');
 if(rs.go){
  /* THE ROOM LETS TWO THROUGH, since 2 October: begin on the press that starts
     the run and done where it closes, the two boundaries the owner asked to
     hear. Everything else a probe fires inside the run, a keep, an undo, a
     mark, a time and a refusal at every phase, is still held, so the rule
     the gate was written for holds in the same words: nothing but the two
     boundaries, one each. */
  ok(new Set(rs.probes.map(p=>p.ph)).size===4&&rs.probes.every(p=>p.r===false&&p.atm.every(v=>v===false))&&rs.played===2
   &&rs.keys.indexOf('begin')>=0&&rs.keys.some(k=>k==='done'||k==='mark')&&rs.keys.length===2&&!rs.bed,
   'a release run with voice and tone off, the fittings switched on, and a fitting and a refusal fired at '
   +rs.probes.length+' steps of it, sounds only its own two boundaries, begin and done: '+rs.made+' nodes, '
   +rs.played+' played, '+rs.keys.join('+')+', phases '
   +[...new Set(rs.probes.map(p=>p.ph))].join(' ')+', in '+rs.ms+' ms');
  ok(rs.after==='done','and once the run has closed, and a press, the interface sounds again, '+rs.after);
  await pg.waitForTimeout(1600);
  const rb=await walk(true); await pg.evaluate(()=>relClose());
  ok(rb.go&&rb.made>0&&rb.probes.some(p=>p.r),'and on an engine that ignores the release, the same run is '
   +'not silent, '+rb.made+' nodes, so the zero above is a reading');
  ok(rb.go&&rb.probes.some(p=>p.atm.some(Boolean)),'and the atmosphere fired at the same steps of that run does sound, so its silence in the room is a reading too, '
   +JSON.stringify(rb.probes.slice(0,3).map(p=>p.atm)));
  await pg.evaluate(()=>{ if(typeof atmAmbEnd==='function')atmAmbEnd(); });}

 /* ---------- the setting ---------- */
 await pg.waitForTimeout(400);
 const acc=await pg.evaluate(()=>{loadP(0); CURP.ui.sfxoff=true; CURP.ui.quiet=false;
  setTab(TAB.SETTINGS); if(typeof ACC_OPEN!=='undefined')ACC_OPEN='display'; renderAccount();
  const b=document.getElementById('acsfx');
  return {has:!!b, on:b&&b.getAttribute('aria-checked'), role:b&&b.getAttribute('role'),
   row:b&&b.closest('.ac-grp')&&b.closest('.ac-grp').textContent.replace(/\s+/g,' ').trim()};});
 ok(acc.has&&acc.on==='false'&&acc.role==='switch','Settings, Display carries a Sound effects switch, off, '
  +JSON.stringify(acc));
 if(acc.has){
  await pg.waitForTimeout(1600);
  const p0=await pg.evaluate(()=>SFX_PLAYED);
  await pg.click('#acsfx'); await pg.waitForTimeout(120);
  const a1=await pg.evaluate(p0=>({on:sfxIsOn(), sw:document.getElementById('acsfx').getAttribute('aria-checked'),
   played:SFX_PLAYED-p0, dev:devGet('sfxoff'), prof:CURP.ui.sfxoff}),p0);
  ok(a1.on&&a1.sw==='true'&&a1.played===1,'turned on, it is on and plays one sound so the person hears what they '
   +'turned on, '+JSON.stringify(a1));
  ok(a1.dev===false,'and it is kept as a device setting in the browser store, '+JSON.stringify(a1.dev));

  /* ---------- the switch is the device's, so a worked example answers it ----------
     2 October, the owner: "When I turn sound effects off, it says nothing
     saved on worked example. So that's a bug." Measured before the fix: on a
     worked example the press printed that line and the switch did not move,
     because the switch saved the profile and a worked example has none. */
 await pg.waitForTimeout(1400);
 const wx=await pg.evaluate(()=>{ loadP(1); setTab(TAB.SETTINGS); if(typeof ACC_OPEN!=='undefined')ACC_OPEN='display'; renderAccount();
  return {name:CURP.name, own:S.who===0, on:document.getElementById('acsfx').getAttribute('aria-checked')}; });
 await pg.click('#acsfx'); await pg.waitForTimeout(150);
 const wo=await pg.evaluate(()=>({sw:document.getElementById('acsfx').getAttribute('aria-checked'), why:sfxWhy(),
  dev:devGet('sfxoff'), prof:CURP.ui.sfxoff, line:(document.getElementById('status')||{}).textContent,
  kind:(document.getElementById('status')||{}).getAttribute('data-kind')}));
 ok(!wx.own&&wx.on==='true'&&wo.sw==='false'&&wo.why==='off'&&wo.dev===true&&!/Nothing saved/.test(wo.line)&&wo.kind!=='fail'&&wo.prof!==true,
  'on a worked example, turning sound off works, says nothing about saving, and does not touch the profile, '+JSON.stringify({wx,wo}));
 /* and the same press with the old writer, the broken engine: it must print the old line */
 const oldWay=await pg.evaluate(()=>{ loadP(1); var ok=uiSet('sfxoff',true); return {ok:ok, line:document.getElementById('status').textContent}; });
 ok(oldWay.ok===false&&/Nothing saved on a worked example/.test(oldWay.line),'while the old route, uiSet, still prints it, so the absence above is a reading, '+JSON.stringify(oldWay));
 /* a reload keeps it, because it is in the browser and not in the page */
 await pg.reload({waitUntil:'load'}); await booted(pg);
 const kept=await pg.evaluate(()=>({on:sfxIsOn(), dev:devGet('sfxoff')}));
 ok(kept.on===false&&kept.dev===true,'and it is still off after a reload, '+JSON.stringify(kept));
 /* a store that refuses the write is said, and the switch still does what it was asked this visit */
 const bad=await pg.evaluate(()=>{ var keep=Storage.prototype.setItem; Storage.prototype.setItem=function(){ throw new Error('QuotaExceededError'); };
  var r=sfxSwitch(true); Storage.prototype.setItem=keep;
  var st=document.getElementById('status'); return {r:r, on:sfxIsOn(), line:st.textContent, kind:st.getAttribute('data-kind')}; });
 ok(bad.r===false&&bad.on===true&&bad.kind==='fail'&&/this visit only/.test(bad.line),
  'a browser that will not keep the setting is told so, and the switch still does what it was asked, '+JSON.stringify(bad));
 }
 ok(err.length===0,'no page errors, '+err.join(' | '));
 await ctx.close();
 await atmGate(browser,FILE,ok,booted);}

/* ============================================================
   THE ATMOSPHERE, GATED. Round OU and OV. The layer under nearly every
   press, in ui/sound.js, held with the same discipline as the fittings
   and no new trust in an ear:

     A  the map is complete. Every sound has a level and a use, every
        control drawn on every tab is a kind in the map, and every
        overlay circle on the three surfaces has a seat to sound at.
     B  every row, rendered offline through the product's own sfxRender
        at every pitch it can sound at: peak, rms, length, energy under
        150 hertz and over 4 kilohertz, and the centroid, read off the
        samples. A sine and at most one partial through a lowpass, or
        filtered noise, on a seat tone, on its table level, under
        ATM_CEIL_DB and under the quietest fitting, over inside its cap,
        clean at both ends. One number, ATM_MASTER, moves them all.
     C  the room under a zoom: silent at 1x, louder and brighter with the
        zoom, exactly zero 1.5 seconds after the last input, live through
        the real wheel, the F key and Frames.
     D  silence: nothing on load, nothing before a press, nothing with the
        switch off, under Quiet, inside a release, or from a click a
        script made. Reduced motion does not silence it.
     E  the wiring through real presses and real pointers: one sound per
        press, the overlay's direction and pitch, the air's lean, the
        hover tick for a mouse and a pen and never a finger, and the two
        limiters.

   Each silence is checked against a broken engine, and the rule against
   a deliberately loud and long row, because a gate that cannot see sound
   when sound is made is not measuring the silence it reports.
   ============================================================ */
const METER=`(function(){
 var SR=44100;
 function fft(re,im){var n=re.length;
  for(var i=1,j=0;i<n;i++){var b=n>>1; for(;j&b;b>>=1)j^=b; j^=b;
   if(i<j){var t=re[i];re[i]=re[j];re[j]=t; t=im[i];im[i]=im[j];im[j]=t;}}
  for(var len=2;len<=n;len<<=1){var a=-2*Math.PI/len, wr=Math.cos(a), wi=Math.sin(a);
   for(var i=0;i<n;i+=len){var cr=1,ci=0;
    for(var k=0;k<len/2;k++){var ur=re[i+k],ui=im[i+k],
     vr=re[i+k+len/2]*cr-im[i+k+len/2]*ci, vi=re[i+k+len/2]*ci+im[i+k+len/2]*cr;
     re[i+k]=ur+vr; im[i+k]=ui+vi; re[i+k+len/2]=ur-vr; im[i+k+len/2]=ui-vi;
     var nr=cr*wr-ci*wi; ci=cr*wi+ci*wr; cr=nr;}}}}
 /* peak, length to the last sample over -66 dBFS, rms over that length,
    share of energy under 150 Hz and over 4 kHz, the centroid, and the
    largest step in the last 2 ms before silence */
 function meter(x,t0){
  var pk=0,last=-1,i0=Math.round(t0*SR);
  for(var i=0;i<x.length;i++){var a=Math.abs(x[i]); if(a>pk)pk=a; if(a>0.0005)last=i;}
  var s=0,n=Math.max(1,last-i0); for(var i=i0;i<last;i++)s+=x[i]*x[i];
  var N=1; while(N<x.length)N<<=1;
  var re=new Float64Array(N), im=new Float64Array(N); re.set(x); fft(re,im);
  var tot=0,lo=0,hi=0,cen=0;
  for(var k=1;k<N/2;k++){var e=re[k]*re[k]+im[k]*im[k], f=k*SR/N; tot+=e; cen+=e*f;
   if(f<150)lo+=e; if(f>4000)hi+=e;}
  var step=0; for(var i=Math.max(1,last-Math.round(0.002*SR));i<x.length;i++){
   var d=Math.abs(x[i]-x[i-1]); if(d>step)step=d;}
  return {peak:pk, db:20*Math.log10(pk||1e-9), ms:(last-i0)/SR*1000, rms:20*Math.log10(Math.sqrt(s/n)||1e-9),
   lo:lo/(tot||1), hi:hi/(tot||1), cen:cen/(tot||1), step:step};}
 async function render(sec,fn){
  var ac=new OfflineAudioContext(1,Math.round(sec*SR),SR); fn(ac);
  return (await ac.startRendering()).getChannelData(0);}
 function rms(x,a,b){var s=0,i0=Math.round(a*SR),i1=Math.round(b*SR); for(var i=i0;i<i1;i++)s+=x[i]*x[i];
  return 20*Math.log10(Math.sqrt(s/Math.max(1,i1-i0))||1e-9);}
 window.__M={SR:SR,fft:fft,meter:meter,render:render,rms:rms};})()`;
const COUNT_ATM=`(function(){
 window.__nodes=0; window.__ctxs=0;
 var B=window.BaseAudioContext||window.AudioContext;
 ['createOscillator','createGain','createBiquadFilter','createBufferSource','createStereoPanner','createChannelMerger']
  .forEach(function(m){ var f=B.prototype[m]; if(!f)return;
   B.prototype[m]=function(){ if(!(window.OfflineAudioContext&&this instanceof OfflineAudioContext))window.__nodes++;
    return f.apply(this,arguments); }; });
 var AC=window.AudioContext;
 if(AC){ window.AudioContext=function(o){ window.__ctxs++; return new AC(o); };
  window.AudioContext.prototype=AC.prototype; }})();`;

async function atmGate(browser,FILE,ok,booted){
 console.log('\n=== the atmosphere: the layer under every press ===');
 const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
 await ctx.addInitScript(COUNT_ATM);
 const pg=await ctx.newPage();
 const err=[];
 pg.on('pageerror',e=>err.push(e.message));
 await pg.goto(FILE,{waitUntil:'load'}); await booted(pg);
 /* ON A BUILD WITHOUT IT, one line that says so, and nothing else to run */
 const has=await pg.evaluate(()=>typeof atmState==='function'&&typeof ATM!=='undefined'&&typeof ATM_MAP!=='undefined');
 ok(has,'the atmosphere is in the page, round OU and OV: a quiet sound under presses, overlays, panels, hover and the zoom, '
  +(has?'ATM, ATM_MAP and atmState are defined':'there is no ATM table and no atmState on this build'));
 if(!has){ await ctx.close(); return; }
 await pg.evaluate(METER);
 const fresh=()=>pg.evaluate(()=>{ ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0; ATM_HOV=[]; ATM_ROW=null; SFX_AT=0; ATM_PT={x:-99,y:-99};
  if(typeof WeakMap==='function')ATM_HOVERED=new WeakMap(); });
 const row=()=>pg.evaluate(()=>{var s=atmState(); return s.row&&{k:s.row.k,hz:Math.round(s.row.hz),db:s.row.db,p:s.played};});
 const played=()=>pg.evaluate(()=>atmState().played);
 /* a fixed host for probe controls, bottom left, over everything, so a real
    press can land on a control of any kind */
 const probe=async html=>pg.evaluate(html=>{ var h=document.getElementById('atmhost');
  if(!h){ h=document.createElement('div'); h.id='atmhost';
   h.style.cssText='position:fixed;left:120px;bottom:8px;z-index:99999;display:flex;gap:6px;background:#111;padding:4px';
   document.body.appendChild(h); }
  h.innerHTML=html; [].forEach.call(h.children,function(e){ e.style.minWidth='48px'; e.style.minHeight='34px';
   if(e.tagName==='A')e.addEventListener('click',function(ev){ev.preventDefault();}); });
  return h.children.length; },html);
 /* A PRESS WITH NO ARRIVAL IN IT. A mouse that travels to a control ticks on
    the way, which is the hover doing its job, so a check that counts what a
    press sounds brings the pointer to rest on the control first, lets the
    tick land, and then presses where it already is. */
 const settle=async sel=>{ const bb=await (await pg.$(sel)).boundingBox(); const x=bb.x+bb.width/2, y=bb.y+bb.height/2;
  await pg.mouse.move(x,y,{steps:2}); await pg.waitForTimeout(160); return {x,y}; };
 const press=async()=>{ await pg.mouse.down(); await pg.mouse.up(); };

 /* ---------- D1. nothing on load, before any press ---------- */
 await pg.waitForTimeout(1200);
 const load=await pg.evaluate(()=>({nodes:window.__nodes, ctxs:window.__ctxs, played:atmState().played, why:sfxWhy(), on:sfxIsOn()}));
 ok(load.on&&load.nodes===0&&load.ctxs===0&&load.played===0&&load.why==='no press yet',
  'sound on by default, and on load nothing sounds, no context opens and no node is made, '+JSON.stringify(load));
 /* a pointer travelling over controls, a wheel zoom, a script's click and the player called straight, with no press yet */
 await pg.evaluate(()=>{ CURP.ui.sfxoff=false; CURP.ui.quiet=false; setTab(TAB.FIELD); });
 await pg.waitForTimeout(500);
 const stim=async()=>{
  const bs=await pg.$$('#fbar .fb-b');
  for(const b of bs.slice(0,6)){ const bb=await b.boundingBox(); if(bb)await pg.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2,{steps:3}); }
  const c=await pg.evaluate(()=>{ const r=cv.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; });
  await pg.mouse.move(c.x+40,c.y+40,{steps:2});
  for(let i=0;i<3;i++){ await pg.mouse.wheel(0,-120); await pg.waitForTimeout(40); }
  await probe('<button type="button" class="btn" id="atmprobe0">p</button>');
  return pg.evaluate(()=>{ document.getElementById('atmprobe0').click();
   var a=[atmZoom(3,7), atmPlay('click'), atmPlay('hover',null,true)];
   return new Promise(function(r){ setTimeout(function(){ r({a:a, nodes:window.__nodes, ctxs:window.__ctxs, played:atmState().played, amb:!!atmState().amb, zoom:S.zoom}); },80); }); });};
 const pre=await stim();
 ok(pre.a.every(v=>v===false)&&pre.nodes===0&&pre.ctxs===0&&pre.played===0&&!pre.amb&&pre.zoom>1,
  'before any press, hovering, zooming the Field, a script\'s click and the player itself make no node and open no context, '+JSON.stringify(pre));
 const preBite=await pg.evaluate(async()=>{ var keep=window.sfxGestured; window.sfxGestured=function(){return true;};
  var n0=window.__nodes, r=[atmPlay('click'), atmZoom(3,7)];
  await new Promise(function(q){setTimeout(q,80);}); window.sfxGestured=keep; atmAmbEnd();
  return {r:r, made:window.__nodes-n0}; });
 ok(preBite.r.every(Boolean)&&preBite.made>0,'and with the press check taken out the same calls do make sound, '+preBite.made+' nodes, so the zero is a reading');
 await pg.evaluate(()=>{ S.zoom=1; S.panx=0; S.pany=0; reframe(); render(); });
 await fresh();
 /* a real press, on an inert patch that no control kind matches */
 await pg.evaluate(()=>{const d=document.createElement('div'); d.id='sfxpad';
  d.style.cssText='position:fixed;left:0;bottom:0;width:40px;height:40px;z-index:99999';
  document.body.appendChild(d);});
 const p0=await played();
 await pg.click('#sfxpad'); await pg.waitForTimeout(400);
 ok((await played())-p0===0,'a real press on something that is not a control sounds nothing');

 /* ---------- A. the map is complete ---------- */
 const A=await pg.evaluate(()=>{
  var o={bad:[]}, rows=ATM.map(function(x){return x.k;});
  rows.forEach(function(k){ if(typeof ATM_DB[k]!=='number')o.bad.push('no level for '+k); });
  Object.keys(ATM_DB).forEach(function(k){ if(k!=='ambience'&&rows.indexOf(k)<0)o.bad.push('level for no row '+k); });
  var used={};
  ATM_MAP.forEach(function(m){
   if(!m.kind||!(m.sel||m.hook))o.bad.push('a map row with no kind or no selector or hook');
   if(m.snd==='overlay'){used['overlay-on']=1; used['overlay-off']=1;}
   else if(m.snd==='air'){used['air-open']=1; used['air-close']=1;}
   else if(m.snd==='ambience'){ if(typeof ATM_DB.ambience!=='number')o.bad.push('ambience has no level'); }
   else if(m.fitting){ if(!SFX_BY[m.snd])o.bad.push(m.kind+' names a fitting '+m.snd+' that is not a row'); }
   else{ used[m.snd]=1; if(!ATM_BY[m.snd])o.bad.push(m.kind+' sounds '+m.snd+', which is not a row'); }
   if(m.sel){ try{ document.createElement('i').matches(m.sel); }catch(e){ o.bad.push('bad selector '+m.kind); } }
   if(m.snd==='overlay'&&!(m.attr&&m.by&&(m.by==='cs'||ATM_SEAT[m.by])))o.bad.push(m.kind+' has no pitch table');});
  rows.forEach(function(k){ if(!used[k])o.bad.push('row '+k+' is not in the map'); });
  /* every layer, on every surface, has a seat, and every seat has a tone */
  var layers=[]; FB_LAYERS.forEach(function(l){layers.push(['fb',l.k]);});
  Object.keys(BMOVL).forEach(function(k){layers.push(['bm',k]);});
  Object.keys(CN_OV).forEach(function(k){layers.push(['cn',k]);});
  layers.forEach(function(p){ var s=ATM_SEAT[p[0]][p[1]];
   if(!s)o.bad.push('no seat for '+p.join(':')); else if(!seatHz(s))o.bad.push('seat '+s+' has no tone'); });
  BANDS.forEach(function(b){ if(!seatHz(b))o.bad.push('shell '+b+' has no tone'); });
  Object.keys(ATM_SEAT).forEach(function(by){ Object.keys(ATM_SEAT[by]).forEach(function(k){
   if(by==='fb'&&!FB_BYK[k])o.bad.push('fb seat for no layer '+k);
   if(by==='bm'&&!BMOVL[k])o.bad.push('bm seat for no layer '+k);
   if(by==='cn'&&!CN_OV[k])o.bad.push('cn seat for no layer '+k); }); });
  o.rows=rows.length; o.kinds=ATM_MAP.length; o.layers=layers.length;
  return o;});
 ok(A.bad.length===0,'the map is complete: '+A.rows+' rows, '+A.kinds+' kinds and hooks, '+A.layers+' layers each with a seat, '
  +(A.bad.join('; ')||'clean'));
 /* THE FAMILY HAS A BOUND OF ITS OWN, the way the fittings do. Four sounds
    a person learns, a click, an overlay's tone, the air and the tick, with
    weight and direction as their two settings, and the room. Eight rows
    holds that, so a ninth argues for the bound and does not slip in. */
 ok(A.rows>=2&&A.rows<=8,'between two and eight rows in the atmosphere, a family a person can learn, got '+A.rows);
 /* every control drawn on every tab, on a blank profile and a worked example,
    is a kind in the map, and every overlay circle on screen has its own seat */
 const tabs=await pg.evaluate(()=>TABDEF.map(t=>t.k));
 const cover={n:0,none:[],by:{},unseated:[],tabs:0};
 for(const who of [0,1])for(const k of tabs){
  await pg.evaluate(([k,who])=>{loadP(who); setTab(k);},[k,who]).catch(()=>{});
  await pg.waitForTimeout(350); cover.tabs++;
  const r=await pg.evaluate(()=>{
   var o={n:0,none:[],by:{},unseated:[]};
   document.querySelectorAll('button,[role=button],[role=tab],[role=switch],[role=radio],[role=menuitem],[role=menuitemcheckbox],a[href],summary,input[type=checkbox],input[type=radio]').forEach(function(e){
    if(!e.offsetParent||e.disabled||e.getAttribute('aria-disabled')==='true')return;
    var h=atmTarget(e); o.n++;
    if(!h){ o.none.push(e.tagName+'.'+(typeof e.className==='string'?e.className:'')); return; }
    o.by[h.row.kind]=(o.by[h.row.kind]||0)+1;
    if(h.row.snd==='overlay'){ var v=e.getAttribute(h.row.attr);
     if(h.row.by==='cs'){ if(!BANDS[+v])o.unseated.push(h.row.by+':'+v); }
     else if(!(ATM_SEAT[h.row.by]&&ATM_SEAT[h.row.by][v]))o.unseated.push(h.row.by+':'+v); }});
   return o;});
  cover.n+=r.n; cover.none=cover.none.concat(r.none); cover.unseated=cover.unseated.concat(r.unseated);
  Object.keys(r.by).forEach(k=>cover.by[k]=(cover.by[k]||0)+r.by[k]);}
 ok(cover.n>0&&cover.none.length===0&&cover.unseated.length===0,
  'every control drawn on every tab, '+cover.n+' of them across '+cover.tabs+' surfaces, is a kind in the map, and every overlay circle has its own seat, unclassified: '
  +(cover.none.slice(0,6).join(', ')||'none')+', unseated: '+(cover.unseated.slice(0,6).join(', ')||'none'));
 console.log('  kinds met: '+Object.keys(cover.by).map(k=>k+' '+cover.by[k]).join(', '));
 const typed=await pg.evaluate(()=>{ var out=[];
  var mk=function(h){ var d=document.createElement('div'); d.innerHTML=h; return d.firstChild; };
  ['<input type="text">','<input type="search">','<input type="number">','<select><option>a</option></select>','<textarea></textarea>',
   '<div class="x">x</div>','<button type="button" disabled>d</button>','<button type="button" aria-disabled="true">d</button>']
   .forEach(function(p){ var e=mk(p); document.body.appendChild(e); out.push(!!atmTarget(e)); e.remove(); });
  return out; });
 ok(typed.every(v=>v===false),'typing, a dropdown, a bare block, and a disabled or locked control are not presses, so they sound nothing, '+JSON.stringify(typed));
 await pg.evaluate(()=>{loadP(0); setTab(TAB.FIELD);}); await pg.waitForTimeout(400);

 /* ---------- B. the rows, measured offline ---------- */
 const B=await pg.evaluate(async()=>{
  var M=window.__M, seats=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'], scale=seats.map(function(s){return seatHz(s);});
  function judge(x,m,db){var bad=[];
   if(!(x.max<=SFX_MAX_MS))bad.push('cap '+x.max+' over SFX_MAX_MS');
   if(!(sfxLen(x)<=x.max))bad.push('declared '+sfxLen(x)+' over cap '+x.max);
   if(!(m.ms<=x.max))bad.push('rang '+m.ms.toFixed(0)+' ms over its cap '+x.max);
   if(!(m.db<=db+1.5))bad.push('peak '+m.db.toFixed(1)+' over its level '+db);
   if(!(m.db>=db-2.5))bad.push('peak '+m.db.toFixed(1)+' under its level '+db);
   if(!(m.db<=ATM_CEIL_DB))bad.push('peak '+m.db.toFixed(1)+' over the ceiling '+ATM_CEIL_DB);
   if(!(m.lo<0.01))bad.push('under 150 Hz '+(m.lo*100).toFixed(2)+'%');
   if(!(m.hi<0.05))bad.push('over 4 kHz '+(m.hi*100).toFixed(2)+'%');
   if(!(m.step<0.001))bad.push('end step '+m.step.toFixed(5));
   if(!(x.gap>0))bad.push('no rate limit');
   var sines=0;
   x.parts.forEach(function(p){
    if(p.w==='sine'){ sines++; if(!p.lp)bad.push('a sine with no lowpass'); }
    else if(p.w==='noise'){ if(!(p.bp||p.lp))bad.push('noise with no filter'); }
    else bad.push('a voice that is neither sine nor noise');});
   if(sines>1)bad.push(sines+' sines in one row');
   return bad;}
  var res=[], worst=-99;
  for(var i=0;i<ATM.length;i++){ var x=ATM[i], noise=x.parts.every(function(p){return p.w==='noise';});
   /* a noise row has no pitch, so it has one sounding; a row with no seat of its
      own sounds at every seat */
   var ss=x.seat?[x.seat]:(noise?[null]:seats);
   for(var j=0;j<ss.length;j++){
    var row=atmRow(x.k,{seat:ss[j]});
    var base=row.hz/(x.oct||1), inScale=noise||scale.some(function(h){return Math.abs(h-base)<0.01;});
    var buf=await M.render((x.max+300)/1000,function(ac){sfxRender(ac,ac.destination,row,0.01);});
    var m=M.meter(buf,0.01), bad=judge(row,m,row.db);
    if(!inScale)bad.push('pitch '+row.hz+' is not a seat tone');
    if(!noise&&!(base>=390&&base*(x.oct||1)<=4000))bad.push('pitch '+row.hz+' outside 390 to 4000');
    if(m.db>worst)worst=m.db;
    res.push({k:x.k,seat:ss[j]||'noise',hz:noise?0:row.hz,db:m.db,rms:m.rms,tgt:row.db,ms:m.ms,max:x.max,len:sfxLen(row),lo:m.lo,hi:m.hi,cen:m.cen,bad:bad}); } }
  /* the events, measured here too, so the two families are compared off the
     same meter and not off a typed number */
  var fit=[];
  for(var f=0;f<SFX.length;f++){ var s=SFX[f];
   var fb=await M.render((s.max+300)/1000,function(ac){sfxRender(ac,ac.destination,s,0.01);});
   fit.push({k:s.k,db:M.meter(fb,0.01).db}); }
  var quietFit=fit.reduce(function(a,b){return b.db<a.db?b:a;});
  /* the rule against a deliberately loud, long row */
  var broke=atmRow('click'); broke.parts.forEach(function(p){p.pk*=5; p.r*=8;});
  var bb=await M.render(1.4,function(ac){sfxRender(ac,ac.destination,broke,0.01);});
  var bm=M.meter(bb,0.01), broken=judge(broke,bm,ATM_DB.click);
  /* the master: one number moves everything */
  var m1=M.meter(await M.render(0.4,function(ac){sfxRender(ac,ac.destination,atmRow('click'),0.01);}),0.01);
  var keep=ATM_MASTER; ATM_MASTER=0.5;
  var m2=M.meter(await M.render(0.4,function(ac){sfxRender(ac,ac.destination,atmRow('click'),0.01);}),0.01);
  ATM_MASTER=2;
  var m3=M.meter(await M.render(0.4,function(ac){sfxRender(ac,ac.destination,atmRow('click'),0.01);}),0.01);
  ATM_MASTER=keep;
  return {res:res, worst:worst, quietFit:quietFit, broken:broken, master:{down:m2.db-m1.db, up:m3.db-m1.db}, SFX_MAX:SFX_MAX_MS, CEIL:ATM_CEIL_DB,
   hover:ATM_DB.hover, minDb:Math.min.apply(null,ATM.map(function(x){return ATM_DB[x.k];})), hoverLen:sfxLen(atmRow('hover'))};});
 console.log('  sound          seat       hz  peak dBFS  table  rms dBFS  length  cap   <150Hz  >4kHz  centroid');
 B.res.forEach(r=>{
  console.log('  '+r.k.padEnd(15)+String(r.seat).padEnd(9)+String(Math.round(r.hz)||'-').padStart(5)
   +r.db.toFixed(1).padStart(10)+String(r.tgt).padStart(7)+r.rms.toFixed(1).padStart(10)+(r.ms.toFixed(0)+' ms').padStart(8)+String(r.max).padStart(5)
   +((r.lo*100).toFixed(2)+'%').padStart(9)+((r.hi*100).toFixed(2)+'%').padStart(8)+(r.cen.toFixed(0)+' Hz').padStart(10));});
 const badRows=B.res.filter(r=>r.bad.length);
 ok(badRows.length===0,'all '+B.res.length+' soundings, every row at every pitch it can sound at, are a seat tone or filtered noise, a sine and at most one partial through a lowpass, on their table level, under '+B.CEIL+' dBFS, over inside their cap, clean at both ends of the band: '
  +(badRows.slice(0,4).map(r=>r.k+' '+r.seat+' '+r.bad.join(',')).join(' | ')||'clean'));
 ok(B.res.every(r=>r.ms<=B.SFX_MAX&&r.len<=B.SFX_MAX),'none runs to the fittings\' ceiling, '+B.SFX_MAX+' ms: the longest rang '
  +Math.max(...B.res.map(r=>r.ms)).toFixed(0)+' ms');
 ok(B.worst<B.quietFit.db,'the surroundings are never louder than an event: the loudest of them peaks at '+B.worst.toFixed(1)
  +' dBFS, under the quietest fitting, '+B.quietFit.k+' at '+B.quietFit.db.toFixed(1));
 ok(B.broken.length>=2&&B.broken.some(s=>/peak/.test(s))&&B.broken.some(s=>/cap|rang|declared/.test(s)),
  'and the same rule refuses a row made loud and long on purpose: '+B.broken.join('; '));
 ok(Math.abs(B.master.down+6.02)<1&&Math.abs(B.master.up-6.02)<1,'ATM_MASTER moves everything: 0.5 is '+B.master.down.toFixed(1)+' dB and 2 is +'+B.master.up.toFixed(1)+' dB');
 ok(B.hover===B.minDb&&B.hoverLen<=40,'the hover tick is the quietest sound in the family, '+B.hover+' dBFS, and '+B.hoverLen+' ms long');

 /* ---------- C. the room under a zoom ---------- */
 const C=await pg.evaluate(async()=>{
  var M=window.__M, o={};
  var Ls=[0,0.05,0.1,0.25,0.5,0.75,1], T=Ls.map(atmAmbTarget);
  o.silent=T[0].gain===0;
  o.mono=T.every(function(t,i){return i===0||(t.gain>T[i-1].gain&&t.lp>T[i-1].lp);});
  /* continuous zoom input at level L, every 100 ms for two seconds, then read the steady part */
  async function steady(L){
   var x=await M.render(3,function(ac){var h=atmAmbBuild(ac,ac.destination); for(var t=0;t<2;t+=0.1)atmAmbTo(h,L,t);});
   var seg=x.slice(Math.round(1.5*M.SR),Math.round(2*M.SR));
   return {rms:M.rms(x,1.5,2), meter:M.meter(seg,0), pk:M.meter(x,0).db};}
  o.lv=[]; for(var L of [0.25,0.5,0.75,1]){ var s=await steady(L); o.lv.push({L:L,rms:s.rms,cen:s.meter.cen,pk:s.pk,lo:s.meter.lo,hi:s.meter.hi}); }
  /* nothing at 1x: an input at level 0 */
  var z=await M.render(1.5,function(ac){var h=atmAmbBuild(ac,ac.destination); for(var t=0;t<1;t+=0.1)atmAmbTo(h,0,t);});
  o.z1=M.meter(z,0).peak;
  /* the last input at 0.9 s, at full zoom: the room is exactly zero from 1.5 s after it */
  var d=await M.render(3.5,function(ac){var h=atmAmbBuild(ac,ac.destination); for(var t=0;t<=0.9001;t+=0.1)atmAmbTo(h,1,t);});
  var tl=0.9, i0=Math.round((tl+ATM_AMB_END)*M.SR);
  o.during=M.rms(d,tl,tl+0.3); o.late=M.rms(d,tl+1.3,tl+ATM_AMB_END-0.001);
  o.zero=true; for(var i=i0+2;i<d.length;i++){ if(d[i]!==0){o.zero=false; break;} }
  o.stepAt=0; for(var i=i0-3;i<i0+3;i++){ var s2=Math.abs(d[i+1]-d[i]); if(s2>o.stepAt)o.stepAt=s2; }
  o.maxStep=0; for(var i=1;i<d.length;i++){ var s3=Math.abs(d[i]-d[i-1]); if(s3>o.maxStep)o.maxStep=s3; }
  /* zooming out lowers it: full zoom, then an input back at 1x */
  var w=await M.render(4,function(ac){var h=atmAmbBuild(ac,ac.destination); for(var t=0;t<1;t+=0.1)atmAmbTo(h,1,t); atmAmbTo(h,0,1.0);});
  o.out0=M.rms(w,0.8,1.0); o.out1=M.rms(w,1.9,2.0);
  var w2=await M.render(4,function(ac){var h=atmAmbBuild(ac,ac.destination); for(var t=0;t<1;t+=0.1)atmAmbTo(h,1,t); for(var t=1;t<1.8;t+=0.1)atmAmbTo(h,0.4,t);});
  o.mid=M.rms(w2,1.5,1.7);
  o.table=ATM_DB.ambience; o.ceil=ATM_CEIL_DB;
  return o;});
 ok(C.silent&&C.mono,'the room: its target is zero at 1x, and both its level and its brightness rise with every step of zoom');
 console.log('  zoom level  steady rms dBFS  peak dBFS  centroid   <150Hz  >4kHz');
 C.lv.forEach(r=>console.log('  '+String(r.L).padEnd(12)+r.rms.toFixed(1).padStart(10)+r.pk.toFixed(1).padStart(14)+(r.cen.toFixed(0)+' Hz').padStart(12)
  +((r.lo*100).toFixed(2)+'%').padStart(9)+((r.hi*100).toFixed(2)+'%').padStart(8)));
 ok(C.lv.every((r,i)=>i===0||(r.rms>C.lv[i-1].rms+1.5&&r.cen>C.lv[i-1].cen)),'rendered, the room is louder and brighter at every step of zoom, '
  +C.lv.map(r=>r.rms.toFixed(1)).join(', ')+' dB rms');
 ok(C.lv[3].pk<=C.ceil&&Math.abs(C.lv[3].pk-C.table)<2.5&&C.lv.every(r=>r.lo<0.01&&r.hi<0.05),'its peak at full zoom is '+C.lv[3].pk.toFixed(1)
  +' dBFS, on its table level of '+C.table+' and under the ceiling, with nothing under 150 Hz and little over 4 kHz');
 ok(C.z1===0,'and at 1x it is exactly silent, '+C.z1);
 ok(C.during>-60&&C.late<-75&&C.zero&&C.stepAt<0.0002&&C.maxStep<0.01,
  'it holds while the person zooms, '+C.during.toFixed(1)+' dB, is under minus 75 dB just before 1.5 s after the last input ('+C.late.toFixed(1)
  +' dB), and is exactly zero from there with a step of '+C.stepAt.toExponential(1)+' at the end and no click anywhere (largest step '+C.maxStep.toFixed(4)+')');
 ok(C.out1<C.out0-40&&C.mid>C.out1+10&&C.mid<C.lv[3].rms,'zooming out lowers it: '+C.out0.toFixed(1)+' dB at full zoom, '+C.mid.toFixed(1)
  +' dB at 0.4, and '+C.out1.toFixed(1)+' dB a second after the picture is back at 1x');
 /* the room, live, through the real wheel and the real keys */
 await pg.evaluate(()=>{ loadP(0); CURP.ui.sfxoff=false; CURP.ui.quiet=false; setTab(TAB.FIELD); S.zoom=1; S.panx=0; S.pany=0; reframe(); render(); });
 await pg.waitForTimeout(500);
 const cc=await pg.evaluate(()=>{ const r=cv.getBoundingClientRect(); return {x:r.left+r.width/2+40,y:r.top+r.height/2+40}; });
 await pg.mouse.move(cc.x,cc.y); await pg.waitForTimeout(100);
 const lv0=await pg.evaluate(()=>atmState().amb);
 for(let i=0;i<3;i++){ await pg.mouse.wheel(0,-120); await pg.waitForTimeout(40); }
 const lv1=await pg.evaluate(()=>atmState().amb);
 for(let i=0;i<6;i++){ await pg.mouse.wheel(0,-120); await pg.waitForTimeout(40); }
 const lv2=await pg.evaluate(()=>atmState().amb);
 await pg.waitForTimeout(150);
 const lv2b=await pg.evaluate(()=>atmState().amb);
 ok(lv0===null&&lv1&&lv2&&lv1.gain>0&&lv2.gain>lv1.gain&&lv2.lp>lv1.lp&&lv2b&&lv2b.now>0,
  'live, a wheel zoom on the Field starts the room from nothing, brings it up with each notch and opens its filter, '
  +JSON.stringify({start:lv0, a:lv1&&[+lv1.L.toFixed(2),+lv1.gain.toFixed(4)], b:lv2&&[+lv2.L.toFixed(2),+lv2.gain.toFixed(4)], sounding:lv2b&&+lv2b.now.toFixed(4)}));
 for(let i=0;i<4;i++){ await pg.mouse.wheel(0,120); await pg.waitForTimeout(40); }
 const lv3=await pg.evaluate(()=>atmState().amb);
 ok(lv3&&lv2&&lv3.gain<lv2.gain&&lv3.lp<lv2.lp,'and zooming out lowers it, '+JSON.stringify(lv3&&[+lv3.L.toFixed(2),+lv3.gain.toFixed(4)]));
 await pg.keyboard.press('f'); await pg.waitForTimeout(60);
 const lv4=await pg.evaluate(()=>atmState().amb);
 ok(lv4&&lv4.gain===0&&lv4.L===0,'the reframe key puts its target back to nothing, '+JSON.stringify(lv4&&[lv4.L,lv4.gain]));
 await pg.waitForTimeout(1900);
 const lv5=await pg.evaluate(()=>({amb:atmState().amb, why:sfxWhy()}));
 ok(lv5.amb===null,'and 1.5 seconds on, the chain is taken down, nothing is left sounding, '+JSON.stringify(lv5));
 /* Frames, the other picture, zooms it too, through its own real wheel */
 await pg.evaluate(()=>{ fviewSet('frames'); }); await pg.waitForTimeout(500);
 const fr=await pg.evaluate(()=>{ const h=document.getElementById('frend'); const b=h&&h.getBoundingClientRect(); return b&&b.width?{x:b.left+b.width/2,y:b.top+b.height/2}:null; });
 let fz=null;
 if(fr){ await pg.mouse.move(fr.x,fr.y); for(let i=0;i<5;i++){ await pg.mouse.wheel(0,-120); await pg.waitForTimeout(40); }
  const a=await pg.evaluate(()=>{ var s=atmState().amb; return s&&[+s.L.toFixed(2),+s.gain.toFixed(4)]; });
  await pg.keyboard.press('f'); await pg.waitForTimeout(60);
  const z=await pg.evaluate(()=>{ var s=atmState().amb; return s&&[s.L,s.gain]; });
  fz={a:a,z:z}; }
 await pg.evaluate(()=>{ fviewSet('wheel'); atmAmbEnd(); });
 ok(fz&&fz.a&&fz.a[1]>0&&fz.z&&fz.z[1]===0,'on Frames it does the same, up under its wheel and nothing after F, '+JSON.stringify(fz));
 await pg.waitForTimeout(300);

 /* ---------- D. silence, and what is not silence ---------- */
 await pg.evaluate(()=>{ setTab(TAB.FIELD); S.zoom=1; S.panx=0; S.pany=0; reframe(); render(); });
 await pg.waitForTimeout(400);
 const burstOf=async()=>{
  await fresh(); await pg.evaluate(()=>{ atmAmbEnd(); sheetShut(); }); await pg.waitForTimeout(300);
  await probe('<button type="button" class="btn" id="atmprobe">p</button>');
  const n0=await pg.evaluate(()=>({n:window.__nodes,p:atmState().played}));
  const pb=await (await pg.$('#atmprobe')).boundingBox();
  await pg.mouse.move(900,600); await pg.mouse.move(pb.x+pb.width/2,pb.y+pb.height/2,{steps:3}); await pg.waitForTimeout(60);
  await pg.mouse.click(pb.x+pb.width/2,pb.y+pb.height/2); await pg.waitForTimeout(80);
  await pg.mouse.move(cc.x,cc.y);
  for(let i=0;i<2;i++){ await pg.mouse.wheel(0,-120); await pg.waitForTimeout(30); }
  await pg.evaluate(()=>{ sheetOpen('<p>x</p>'); });
  await pg.waitForTimeout(120);
  const r=await pg.evaluate(n0=>({made:window.__nodes-n0.n, played:atmState().played-n0.p, amb:!!atmState().amb, why:sfxWhy()}),n0);
  await pg.evaluate(()=>{ atmAmbEnd(); sheetShut(); S.zoom=1; S.panx=0; S.pany=0; reframe(); render(); }); await pg.waitForTimeout(300);
  return r;};
 const live=await burstOf();
 ok(live.why===''&&live.made>0&&live.played>=3&&live.amb,'with the switch on, a hover, a press, a zoom and a panel make sound, '+JSON.stringify(live));
 await pg.evaluate(()=>{CURP.ui.sfxoff=true; CURP.ui.quiet=false;});
 const off=await burstOf();
 ok(off.why==='off'&&off.made===0&&off.played===0&&!off.amb,'with the switch off, none of it makes a node, '+JSON.stringify(off));
 await pg.evaluate(()=>{CURP.ui.sfxoff=false; CURP.ui.quiet=true;});
 const qu=await burstOf();
 ok(qu.why==='quiet'&&qu.made===0&&qu.played===0&&!qu.amb,'with Quiet on and the switch on, none of it makes a node either, '+JSON.stringify(qu));
 const swBite=await pg.evaluate(()=>{ var keep=window.sfxWhy; window.sfxWhy=function(){return '';};
  CURP.ui.sfxoff=true; CURP.ui.quiet=true; var n0=window.__nodes, a=atmPlay('click'), z=atmZoom(3,7); atmAmbEnd();
  window.sfxWhy=keep; CURP.ui.sfxoff=false; CURP.ui.quiet=false; return {a:a, z:z, made:window.__nodes-n0}; });
 ok(swBite.a==='click'&&swBite.z&&swBite.made>0,'and on an engine that ignores both switches the same calls make nodes, so both zeros are readings, '+JSON.stringify(swBite));
 await pg.emulateMedia({reducedMotion:'reduce'});
 const rm=await burstOf();
 await pg.emulateMedia({reducedMotion:'no-preference'});
 ok(rm.why===''&&rm.made>0&&rm.played>=3,'reduced motion is a request about motion and does not silence it, '+JSON.stringify(rm));
 /* a click a script made is not a press a person made */
 await fresh(); await pg.waitForTimeout(200);
 await probe('<button type="button" class="btn" id="atmprobe">p</button>');
 const scr=await pg.evaluate(async()=>{ var p=atmState().played; document.getElementById('atmprobe').click();
  await new Promise(function(r){setTimeout(r,80);}); return atmState().played-p; });
 await settle('#atmprobe'); await fresh();
 const rp0=await played(); await press(); await pg.waitForTimeout(80);
 const real=(await played())-rp0;
 ok(scr===0&&real===1,'a click a script dispatches on a button sounds nothing, and a real press on the same button sounds once, '+JSON.stringify({script:scr,real:real}));

 /* ---------- E. through real presses ---------- */
 await pg.waitForTimeout(300);
 const kinds=[
  ['Primary button','<button type="button" class="btn pri">p</button>','click-heavy'],
  ['Destructive button','<button type="button" class="btn dgr">d</button>','click-heavy'],
  ['Tab','<button type="button" role="tab">t</button>','click'],
  ['Switch','<button type="button" role="switch" aria-checked="false">s</button>','click'],
  ['Checkbox','<input type="checkbox">','click'],
  ['Radio','<button type="button" role="radio">r</button>','click'],
  ['Chip','<button type="button" aria-pressed="false" class="chip">c</button>','click-light'],
  ['Section header','<button type="button" class="lsec-hd">h</button>','click-light'],
  ['List row','<button type="button" class="kb-row">r</button>','click-light'],
  ['Button','<button type="button">b</button>','click'],
  ['Link','<a href="#atmx">l</a>','click'],
  ['Menu item','<button type="button" role="menuitem">m</button>','click']];
 for(const [nm,html,want] of kinds){
  await fresh(); await probe(html);
  const el=await pg.$('#atmhost > *'); const bb=await el.boundingBox();
  await pg.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await pg.waitForTimeout(60);
  const g=await row(); await pg.waitForTimeout(60);
  ok(g&&g.k===want,nm+', pressed for real, sounds '+want+', '+JSON.stringify(g));}
 await probe('');
 /* a tab on the bar, by its real button: the bar's own fitting, tap, and no click under it */
 await fresh(); await pg.waitForTimeout(150);
 const tpick=await pg.evaluate(()=>{ const b=[...document.querySelectorAll('.tabtop')].filter(x=>x.offsetParent&&x.getAttribute('aria-pressed')==='false')[0];
  if(!b)return false; b.setAttribute('data-atmpick','1'); return true; });
 /* the pointer comes to rest on the tab first, so its hover tick is not
    counted as part of the press */
 if(tpick){ await settle('[data-atmpick="1"]'); await fresh(); }
 const tb=tpick?await pg.evaluate(()=>({p:atmState().played, t:SFX_LAST.tap||0})):null;
 let tabr=null;
 if(tb){ await press(); await pg.waitForTimeout(100);
  tabr=await pg.evaluate(tb=>{ const b=document.querySelector('[data-atmpick]'); if(b)b.removeAttribute('data-atmpick');
   return {atm:atmState().played-tb.p, tap:(SFX_LAST.tap||0)>tb.t}; },tb); }
 ok(tabr&&tabr.tap&&tabr.atm===0,'a real press on a tab sounds the bar\'s own fitting, tap, and no click under it, one sound per press, '+JSON.stringify(tabr));
 await pg.evaluate(()=>{ setTab(TAB.FIELD); }); await pg.waitForTimeout(400);
 /* ONE SOUND PER PRESS: a press that earns a fitting or a panel has no click */
 const onePress=async handler=>{ await fresh(); await pg.waitForTimeout(160);
  await probe('<button type="button" class="btn pri" id="atmone">p</button>');
  await pg.evaluate(h=>{ document.getElementById('atmone').onclick=new Function(h); },handler);
  await settle('#atmone'); await fresh();
  const s0=await pg.evaluate(()=>({a:atmState().played, f:SFX_PLAYED}));
  await press(); await pg.waitForTimeout(80);
  const r=await pg.evaluate(s0=>({atm:atmState().played-s0.a, fitting:SFX_PLAYED-s0.f, heavy:!!ATM_LAST['click-heavy'], air:!!ATM_LAST['air-open']}),s0);
  await pg.evaluate(()=>{ sheetShut(); }); await pg.waitForTimeout(300); await probe(''); return r;};
 const one1=await onePress("sfx('kept');");
 ok(one1.fitting===1&&one1.atm===0&&!one1.heavy,'a press that earns a fitting gets the fitting and no click, '+JSON.stringify(one1));
 const one2=await onePress("sheetOpen('<p>one</p>');");
 ok(one2.atm===1&&one2.air&&!one2.heavy,'and a press that opens a panel gets the air swell and no click, '+JSON.stringify(one2));
 const one3=await onePress("");
 ok(one3.atm===1&&one3.heavy&&one3.fitting===0,'while the same press with nothing behind it gets its click, so both absences are readings, '+JSON.stringify(one3));
 /* the sheet, both ways */
 await fresh();
 const sh=await pg.evaluate(async()=>{ var out=[];
  sheetOpen('<p>x</p>'); await new Promise(function(r){setTimeout(r,60);}); out.push(atmState().row&&atmState().row.k);
  ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0;
  sheetShut(); await new Promise(function(r){setTimeout(r,60);}); out.push(atmState().row&&atmState().row.k);
  ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0; var p=atmState().played;
  sheetShut(); await new Promise(function(r){setTimeout(r,60);}); out.push(atmState().played-p);
  return out; });
 ok(sh[0]==='air-open'&&sh[1]==='air-close'&&sh[2]===0,'a panel opens with air leaning up and shuts with air leaning down, and shutting what is shut is silent, '+JSON.stringify(sh));
 const lean=await pg.evaluate(()=>{ var a=ATM_BY['air-open'].parts[0], c=ATM_BY['air-close'].parts[0];
  return {open:a.bp1>a.bp, close:c.bp1<c.bp, openA:a.a, closeA:c.a}; });
 ok(lean.open&&lean.close&&lean.openA>lean.closeA,'the air opens up and slow and shuts down and quick, '+JSON.stringify(lean));
 /* overlays, through the real circles on three surfaces */
 const ov=async sel=>{
  await fresh();
  const before=await pg.evaluate(sel=>{var e=document.querySelector(sel); return e&&e.offsetParent?e.getAttribute('aria-pressed'):null;},sel);
  if(before===null)return {missing:sel};
  await pg.click(sel); await pg.waitForTimeout(90);
  const a=await row(); await pg.waitForTimeout(350); await fresh();
  await pg.click(sel); await pg.waitForTimeout(90);
  const b=await row(); await pg.waitForTimeout(350);
  return {before:before, first:a, second:b};};
 const hz=await pg.evaluate(()=>({Root:seatHz('Root'),Sacral:seatHz('Sacral'),Crown:seatHz('Crown')}));
 const f1=await ov('#fbar [data-fb=shadow]');
 ok(f1.first&&f1.second&&f1.first.k===(f1.before==='true'?'overlay-off':'overlay-on')&&f1.second.k===(f1.before==='true'?'overlay-on':'overlay-off')
  &&f1.first.hz===hz.Root&&f1.second.hz===hz.Root,'the Field\'s Decoherence circle rises going on and falls going off, at the Root\'s tone, '+JSON.stringify(f1));
 const f2=await ov('#fbar [data-fb=laws]');
 ok(f2.first&&f2.second&&f2.first.hz===hz.Crown&&f2.second.hz===hz.Crown&&f2.first.k!==f2.second.k,'and the Laws circle at the Crown\'s, one concept one pitch, '+JSON.stringify(f2));
 await pg.evaluate(()=>{ setTab(TAB.ENERGY); }); await pg.waitForTimeout(900);
 const b1=await ov('[data-bmov=flow]');
 ok(b1.first&&b1.second&&b1.first.hz===hz.Sacral&&b1.second.hz===hz.Sacral&&b1.first.k!==b1.second.k,'the Body\'s Flow circle goes both ways at the Sacral\'s tone, '+JSON.stringify(b1));
 const b2=await ov('[data-bmov=addr]');
 ok(b2.first&&b2.second&&b2.first.hz===hz.Root&&b2.first.k!==b2.second.k,'and its Addresses at the Root\'s, the same pitch as the Field\'s Addresses, '+JSON.stringify(b2));
 await pg.evaluate(()=>{ setTab(TAB.COMPASS); }); await pg.waitForTimeout(900);
 const c1=await ov('[data-cn=well]');
 ok(c1.first&&c1.second&&c1.first.hz===hz.Root&&c1.first.k!==c1.second.k,'the Compass\'s Gravity well circle goes both ways at the Root\'s tone, '+JSON.stringify(c1));
 /* the Compass's seat shells, each its own seat off BANDS: probe shells, pressed
    for real, because the Registers view is a paid tier's */
 const cs=[];
 for(let si=0;si<7;si++){
  await fresh(); await probe('<button type="button" data-cnseat="'+si+'" aria-pressed="false">s</button>');
  await pg.evaluate(()=>{ var b=document.querySelector('#atmhost [data-cnseat]'); b.onclick=function(){ this.setAttribute('aria-pressed','true'); }; });
  const bb=await (await pg.$('#atmhost [data-cnseat]')).boundingBox();
  await pg.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await pg.waitForTimeout(50);
  const s=await pg.evaluate(si=>{ var r=atmState().row; return [BANDS[si],r&&r.k,r&&Math.round(r.hz),Math.round(seatHz(BANDS[si]))]; },si);
  cs.push(s); }
 await probe('');
 ok(cs.every(r=>r[1]==='overlay-on'&&r[2]===r[3]),'each Compass seat shell rings the seat it is, '+cs.map(r=>r[0]+' '+r[2]).join(', '));
 await pg.evaluate(()=>{ loadP(0); setTab(TAB.FIELD); }); await pg.waitForTimeout(700);
 /* column folds, both ways */
 const fold=async sel=>{ const vis=await pg.evaluate(sel=>{const e=document.querySelector(sel); return !!(e&&e.offsetParent);},sel);
  if(!vis)return ['missing '+sel];
  await fresh(); await pg.click(sel); await pg.waitForTimeout(90); const a=await row(); await pg.waitForTimeout(400);
  await fresh(); await pg.click(sel); await pg.waitForTimeout(90); const b=await row(); await pg.waitForTimeout(400); return [a&&a.k,b&&b.k]; };
 const fl=await fold('#lfold'), fb=await fold('#fbar .fb-tog'), frr=await fold('#rfold');
 ok(new Set(fl).size===2&&fl.every(k=>/^air-/.test(k)),'the left column opens with air leaning up and shuts with air leaning down, '+fl.join(', '));
 ok(new Set(fb).size===2&&fb.every(k=>/^air-/.test(k)),'and so does the bar\'s own fold, '+fb.join(', '));
 ok(new Set(frr).size===2&&frr.every(k=>/^air-/.test(k)),'and the right column, '+frr.join(', '));

 /* ---------- hover, through the real pointer ---------- */
 const hv=async fn=>{ await fresh(); await pg.evaluate(()=>{ window.__h0=atmState().played; });
  await fn(); await pg.waitForTimeout(60); return pg.evaluate(()=>({n:atmState().played-window.__h0, row:atmState().row&&atmState().row.k})); };
 await pg.evaluate(()=>{ setTab(TAB.FIELD); }); await pg.waitForTimeout(400);
 const box=async sel=>{ const b=await (await pg.$(sel)).boundingBox(); return {x:b.x+b.width/2,y:b.y+b.height/2}; };
 const sh0=await box('#fbar [data-fb=shadow]');
 const one_=await hv(async()=>{ await pg.mouse.move(cc.x,cc.y); await pg.waitForTimeout(300); await pg.evaluate(()=>{ ATM_HOV=[]; ATM_AT=0; });
  await pg.mouse.move(sh0.x,sh0.y,{steps:3}); });
 ok(one_.n===1&&one_.row==='hover','a mouse arriving at a control ticks once, '+JSON.stringify(one_));
 const sweep=await (async()=>{
  await pg.evaluate(()=>{ window.__hl=[]; window.__keepR=window.sfxRender; window.sfxRender=function(ac,out,x,t,g){ if(x.k==='hover')window.__hl.push(Date.now()); return window.__keepR(ac,out,x,t,g); }; });
  const r=await hv(async()=>{ const bs=await pg.$$('#fbar .fb-b'); for(let k=0;k<6;k++)for(const b of bs){ const bb=await b.boundingBox(); if(bb)await pg.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2,{steps:2}); } });
  const log=await pg.evaluate(()=>{ window.sfxRender=window.__keepR; return window.__hl; });
  let worst=0; for(const t of log){ const n=log.filter(u=>u>=t&&u<t+1000).length; if(n>worst)worst=n; }
  return {n:r.n, worst, span:log.length?log[log.length-1]-log[0]:0}; })();
 const hmax=await pg.evaluate(()=>ATM_HOVER_PER_S);
 ok(sweep.n>=2&&sweep.worst<=hmax,'sweeping the whole bar six times over ticks '+sweep.n+' times across '+sweep.span+' ms and never more than '+sweep.worst+' in any second, where the limit is '+hmax);
 const dupT0=Date.now();
 const dup=await hv(async()=>{ await pg.mouse.move(cc.x,cc.y);
  for(let i=0;i<4;i++){ await pg.mouse.move(sh0.x,sh0.y,{steps:2}); await pg.waitForTimeout(120); await pg.mouse.move(cc.x,cc.y); await pg.waitForTimeout(120); } });
 const dupMax=1+Math.floor((Date.now()-dupT0)/(await pg.evaluate(()=>ATM_HOVER_EACH)));
 ok(dup.n>=1&&dup.n<=dupMax,'and the same control ticks once for as long as a person comes and goes from it, '+dup.n+' ticks where '+dupMax+' windows went by, '+JSON.stringify(dup));
 /* a control the layout puts under a resting pointer: Chrome says the pointer
    arrived, with the coordinates it already had, and the person did nothing */
 const lay=async bite=>hv(async()=>{ await pg.mouse.move(700,300); await pg.waitForTimeout(250);
  await pg.evaluate(bite=>{ if(bite)ATM_PT={x:-99,y:-99}; var b=document.createElement('button'); b.type='button'; b.id='atmlay'; b.textContent='l';
   b.style.cssText='position:fixed;left:680px;top:280px;width:60px;height:44px;z-index:99999'; document.body.appendChild(b); },bite);
  await pg.waitForTimeout(400);
  await pg.evaluate(()=>{ var b=document.getElementById('atmlay'); if(b)b.remove(); }); });
 const still=await lay(false), stillBite=await lay(true);
 ok(still.n===0&&stillBite.n===1,'a control that arrives under a pointer that has not moved makes no tick, and the same arrival read as a move does, so the silence is the rule, '
  +JSON.stringify({still:still,asMoved:stillBite}));
 const drag=await hv(async()=>{ await pg.mouse.move(cc.x,cc.y); await pg.mouse.down(); await pg.mouse.move(sh0.x,sh0.y,{steps:4}); await pg.mouse.up(); });
 ok(drag.n===0,'a pointer with its button down, dragging, makes no tick, '+JSON.stringify(drag));
 /* a pen, through the browser's own input, the way a tablet sends it */
 const cdp=await ctx.newCDPSession(pg);
 const pen=await hv(async()=>{ await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:cc.x,y:cc.y,pointerType:'pen'}); await pg.waitForTimeout(60);
  await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:sh0.x,y:sh0.y,pointerType:'pen'}); });
 ok(pen.n===1&&pen.row==='hover','a pen arriving at a control ticks too, '+JSON.stringify(pen));
 const hc=await pg.evaluate(()=>{ ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0; ATM_HOV=[]; SFX_AT=0;
  var a=atmPlay('hover',null,true), b=atmPlay('click'), c=atmPlay('hover',null,true);
  return {tick:a, click:b, tickRightAfter:c}; });
 ok(hc.tick==='hover'&&hc.click==='click'&&hc.tickRightAfter===false,'a tick never blocks a click, and no tick lands within a breath of another sound, '+JSON.stringify(hc));

 /* ---------- the burst limiter, through real presses ---------- */
 await pg.waitForTimeout(500);
 await probe('<button type="button">b</button><button type="button" class="btn pri">p</button><button type="button" aria-pressed="false">c</button><button type="button" role="tab">t</button>');
 const spots=[]; for(const e of await pg.$$('#atmhost > *')){ const bb=await e.boundingBox(); spots.push({x:bb.x+bb.width/2,y:bb.y+bb.height/2}); }
 const barrage=async limited=>{
  await pg.evaluate(limited=>{ window.__log=[]; window.__keepR=window.sfxRender; window.__kg={};
   /* the ticks of the pointer moving between the four have a limiter of their
      own, held above, so only the presses are counted against this one */
   window.sfxRender=function(ac,out,x,t,g){ if(ATM_BY[x.k]&&x.k!=='hover')window.__log.push([x.k,Date.now()]); return window.__keepR(ac,out,x,t,g); };
   window.__kb=[ATM_BURST,ATM_SPACE];
   if(!limited){ ATM_BURST=1e9; ATM_SPACE=0; ATM.forEach(function(x){ window.__kg[x.k]=x.gap; x.gap=1; }); }
   ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0; ATM_HOV=[]; SFX_AT=0; },limited);
  const t0=Date.now();
  /* spread over more than a second, so the per second bound is what binds */
  for(let i=0;i<50;i++){ const s=spots[i%spots.length]; await pg.mouse.click(s.x,s.y); await pg.waitForTimeout(i%5===0?40:20); }
  await pg.waitForTimeout(80);
  const span=Date.now()-t0;
  return pg.evaluate(span=>{ var log=window.__log;
   window.sfxRender=window.__keepR; ATM_BURST=window.__kb[0]; ATM_SPACE=window.__kb[1];
   ATM.forEach(function(x){ if(window.__kg[x.k]!==undefined)x.gap=window.__kg[x.k]; });
   var worst=0, minGap=1e9;
   for(var i=0;i<log.length;i++){ var n=0; for(var j=0;j<log.length;j++)if(log[j][1]>=log[i][1]&&log[j][1]<log[i][1]+1000)n++; if(n>worst)worst=n;
    if(i&&log[i][1]-log[i-1][1]<minGap)minGap=log[i][1]-log[i-1][1]; }
   return {n:log.length, worst:worst, minGap:minGap, span:span, burst:ATM_BURST, space:ATM_SPACE}; },span);};
 const lim=await barrage(true);
 ok(lim.n>=2&&lim.worst<=lim.burst&&lim.minGap>=lim.space-2,'fifty real presses in '+lim.span+' ms play '+lim.n+' sounds, never more than '+lim.burst+' in any second ('+lim.worst
  +') and never closer than '+lim.space+' ms ('+lim.minGap+')');
 await pg.waitForTimeout(1200);
 const unl=await barrage(false);
 ok(unl.n>lim.n&&unl.worst>lim.burst,'and with the limiter taken out the same fifty make '+unl.n+' sounds, '+unl.worst+' inside one second, so the limit is a reading, '+JSON.stringify(unl));
 await probe(''); await pg.waitForTimeout(1200);

 /* ---------- a real press inside a release, the first release among them ---------- */
 await fresh();
 const runGo=await pg.evaluate(()=>{
  REL_WORD_S=0.0004; REL_GAP_S=0.001; REL_HEAD_S=0; REL_FRAME_S=0;
  if(window.speechSynthesis)speechSynthesis.speak=function(u){ setTimeout(function(){ if(u.onend)u.onend({}); },1); };
  loadP(0); CHARGES.forEach(c=>{S.charge[c]=7;});
  CURP.ui.sfxoff=false; CURP.ui.quiet=false; CURP.ui.voice=false; CURP.ui.tone=false;
  relPick(compute().carrying.slice(0,1).map(n=>n.i));
  var go=document.getElementById('relgo'); if(!go)return false; go.click(); return true; });
 let inRun=null;
 if(runGo){
  await pg.waitForFunction(()=>RUN&&RUN.phase==='run',null,{timeout:20000}).catch(()=>{});
  await probe('<button type="button" class="btn pri" id="atmrun">p</button>');
  const i0=await pg.evaluate(()=>({p:atmState().played, ph:RUN.phase, n:window.__nodes}));
  const bb=await (await pg.$('#atmrun')).boundingBox();
  await pg.mouse.move(10,500); await pg.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2,{steps:3});
  await pg.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await pg.waitForTimeout(100);
  inRun=await pg.evaluate(i0=>({ph:i0.ph, why:sfxWhy(), atm:atmState().played-i0.p}),i0);
  await probe('');
  await pg.waitForFunction(()=>RUN.phase==='done'&&RUN.cool>=COOLING.length,null,{timeout:60000}).catch(()=>{});
  await pg.evaluate(()=>relClose()); }
 ok(runGo&&inRun&&inRun.ph==='run'&&inRun.why==='release'&&inRun.atm===0,'inside a release, a real hover and a real press on a control sound nothing, '+JSON.stringify(inRun));
 await pg.waitForTimeout(800);

 /* ---------- the switch itself ---------- */
 await pg.evaluate(()=>{ loadP(0); CURP.ui.sfxoff=false; CURP.ui.quiet=false; setTab(TAB.SETTINGS); if(typeof ACC_OPEN!=='undefined')ACC_OPEN='display'; renderAccount(); });
 await pg.waitForTimeout(500);
 await settle('#acsfx'); await fresh();
 const sw0=await pg.evaluate(()=>({a:atmState().played, f:SFX_PLAYED, on:sfxIsOn()}));
 await press(); await pg.waitForTimeout(150);
 const swOff=await pg.evaluate(s=>({on:sfxIsOn(), atm:atmState().played-s.a, fit:SFX_PLAYED-s.f}),sw0);
 ok(sw0.on&&swOff.on===false&&swOff.atm===0&&swOff.fit===0,'the press that turns sound off is itself silent, '+JSON.stringify(swOff));
 await pg.waitForTimeout(400); await settle('#acsfx'); await fresh();
 const sw1=await pg.evaluate(()=>({a:atmState().played, f:SFX_PLAYED}));
 await press(); await pg.waitForTimeout(150);
 const swOn=await pg.evaluate(s=>({on:sfxIsOn(), atm:atmState().played-s.a, fit:SFX_PLAYED-s.f}),sw1);
 ok(swOn.on===true&&swOn.atm===0&&swOn.fit===1,'and the press that turns it on plays its one fitting and no click under it, '+JSON.stringify(swOn));
 await cdp.detach().catch(()=>{});
 ok(err.length===0,'no page errors, '+err.join(' | '));
 await ctx.close();

 /* ---------- a finger, on a touch screen ---------- */
 const tctx=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 await tctx.addInitScript(COUNT_ATM);
 const tp=await tctx.newPage();
 const terr=[]; tp.on('pageerror',e=>terr.push(e.message));
 await tp.goto(FILE,{waitUntil:'load'}); await booted(tp);
 await tp.evaluate(()=>{ loadP(1); CURP.ui.sfxoff=false; CURP.ui.quiet=false; setTab(TAB.FIELD); S.zoom=1; S.panx=0; S.pany=0; reframe(); render(); });
 await tp.waitForTimeout(900);
 await tp.evaluate(()=>{ var h=document.createElement('div'); h.id='atmhost';
  h.style.cssText='position:fixed;left:20px;bottom:90px;z-index:99999;display:flex;gap:6px';
  h.innerHTML='<button type="button" class="btn" id="atmt" style="min-width:60px;min-height:44px">t</button>'; document.body.appendChild(h); });
 const tb2=await (await tp.$('#atmt')).boundingBox();
 const t0=await tp.evaluate(()=>({p:atmState().played}));
 await tp.touchscreen.tap(tb2.x+tb2.width/2,tb2.y+tb2.height/2); await tp.waitForTimeout(120);
 const tap1=await tp.evaluate(t0=>({n:atmState().played-t0.p, row:atmState().row&&atmState().row.k, hover:!!ATM_LAST.hover}),t0);
 ok(tap1.n===1&&tap1.row==='click'&&!tap1.hover,'a finger tapping a button gets its click and never a hover tick, because a finger has no hover, '+JSON.stringify(tap1));
 /* the core, tapped by a finger: the one Field press that never reached hitPress */
 const core=await tp.evaluate(()=>{ const b=cv.getBoundingClientRect(); const h=hitTest(CX,CY); return {x:b.left+CX,y:b.top+CY,k:h&&h.k,t:SFX_LAST.field||0}; });
 await tp.waitForTimeout(300);
 await tp.touchscreen.tap(core.x,core.y); await tp.waitForTimeout(160);
 const coreR=await tp.evaluate(c=>({k:c.k, field:(SFX_LAST.field||0)>c.t}),core);
 ok(coreR.k==='core'&&coreR.field,'and a finger tapping the core of the wheel sounds the Field press, '+JSON.stringify(coreR));
 ok(terr.length===0,'no page errors on the touch screen, '+terr.join(' | '));
 await tctx.close();}

module.exports={soundGate,atmGate};

if(require.main===module){
 const {chromium}=require('playwright');
 const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
 let PASS=0,FAIL=0;
 const ok=(c,m)=>{ if(c){PASS++; console.log('  ok   '+m);} else {FAIL++; console.log('  FAIL '+m);} };
 const booted=async p=>{
  try{ await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000}); }catch(e){}
  try{ await p.waitForTimeout(600);
   await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
   await p.waitForTimeout(120); }catch(e){}
  try{ await p.waitForFunction(()=>typeof enterOver!=='function'||enterOver(),null,{timeout:4000}); }catch(e){}};
 (async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  console.log('\n=== the fittings: the interface\'s own sounds ===');
  try{ await soundGate(browser,FILE,ok,booted); }
  catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
