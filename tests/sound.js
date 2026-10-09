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
   var m=meter(buf,0.01); rows.push({k:x.k,max:x.max,ceil:x.ceil,len:sfxLen(x),m:m,bad:judge(x,m)});}
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
 const deaf=await pg.evaluate(()=>{ window.__sfxKeep=window.sfx; window.sfx=function(){return false;}; return true; });
 const dtab=await pressTab();
 let dfield=null;
 if(pt){ const o1=await pg.evaluate(()=>window.__osc); await pg.mouse.click(pt.x,pt.y); await pg.waitForTimeout(220);
  dfield=await pg.evaluate(o1=>window.__osc-o1,o1); }
 await pg.evaluate(()=>{ window.sfx=window.__sfxKeep; });
 ok(dtab&&dtab.osc===0&&dfield===0,'and with the hooks taken out the same two presses start none, so the counts above are readings, tab '
  +(dtab&&dtab.osc)+', field '+dfield);
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
    probes.push({ph:p+(p==='done'?' cooldown':''), r:a});}};
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
  ok(new Set(rs.probes.map(p=>p.ph)).size===4&&rs.probes.every(p=>p.r===false)&&rs.played===2
   &&rs.keys.indexOf('begin')>=0&&rs.keys.some(k=>k==='done'||k==='mark')&&rs.keys.length===2&&!rs.bed,
   'a release run with voice and tone off, the fittings switched on, and a fitting and a refusal fired at '
   +rs.probes.length+' steps of it, sounds only its own two boundaries, begin and done: '+rs.made+' nodes, '
   +rs.played+' played, '+rs.keys.join('+')+', phases '
   +[...new Set(rs.probes.map(p=>p.ph))].join(' ')+', in '+rs.ms+' ms');
  ok(rs.after==='done','and once the run has closed, and a press, the interface sounds again, '+rs.after);
  await pg.waitForTimeout(1600);
  const rb=await walk(true); await pg.evaluate(()=>relClose());
  ok(rb.go&&rb.made>0&&rb.probes.some(p=>p.r),'and on an engine that ignores the release, the same run is '
   +'not silent, '+rb.made+' nodes, so the zero above is a reading');}

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
 await ctx.close();}

module.exports={soundGate};

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
