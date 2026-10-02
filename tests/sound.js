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

   THE ATMOSPHERE, round OU, is gated in atmGate below, which soundGate
   calls last on a context of its own. The fittings' own checks above are
   unchanged, and the release walk in section 6 now also fires a click, a
   ping, a zoom, a hover tick and an overlay at every step of the run, which
   must all stay silent.
   ============================================================ */
const path=require('path');

async function soundGate(browser,FILE,ok,booted){
 const COUNT=`(function(){
  window.__nodes=0; window.__ctxs=0;
  var B=window.BaseAudioContext||window.AudioContext;
  ['createOscillator','createGain','createBiquadFilter','createBufferSource','createStereoPanner','createChannelMerger']
   .forEach(function(m){ var f=B.prototype[m]; if(!f)return;
    B.prototype[m]=function(){ if(!(window.OfflineAudioContext&&this instanceof OfflineAudioContext))window.__nodes++;
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
 ok(T.n>=2&&T.n<=6,'between two and six fittings, the size of a family a person can learn, got '+T.n);
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
  if(!document.getElementById('atmprobe')){ var ab=document.createElement('button'); ab.type='button'; ab.className='btn'; ab.id='atmprobe';
   ab.style.cssText='position:fixed;left:44px;bottom:0;width:60px;height:40px;z-index:99999'; document.body.appendChild(ab); }
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
    /* the atmosphere is silent in the room too: a press on a control, a ping,
       a zoom, a tick and a click, by the real routes and by the player */
    var pr=document.getElementById('atmprobe'); if(pr)pr.click();
    var atm=[atmPing({k:'seat',b:'Root'}), atmZoom(3,7), atmPlay('hover',null,true), atmPlay('click'), atmPlay('overlay-on',{seat:'Heart'})];
    probes.push({ph:p+(p==='done'?' cooldown':''), r:a, atm:atm});}};
  var go=document.getElementById('relgo'); if(!go){ window.relRender=orig; window.sfxRoomHeld=keepRoom; return {go:false}; }
  n0=window.__nodes; var p0=SFX_PLAYED;
  go.click();
  var t0=Date.now();
  while(!(RUN.phase==='done'&&RUN.cool>=COOLING.length)&&Date.now()-t0<60000)
   await new Promise(r=>setTimeout(r,40));
  var out={go:true, probes:probes, made:window.__nodes-n0, played:SFX_PLAYED-p0, phase:RUN.phase,
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
  ok(new Set(rs.probes.map(p=>p.ph)).size===4&&rs.probes.every(p=>p.r===false&&p.atm.every(v=>v===false))&&rs.made===0&&rs.played===0&&!rs.bed,
   'a release run with voice and tone off, the fittings switched on, and a fitting and a refusal fired at '
   +rs.probes.length+' steps of it, stays silent: '+rs.made+' nodes, '+rs.played+' played, phases '
   +[...new Set(rs.probes.map(p=>p.ph))].join(' ')+', in '+rs.ms+' ms');
  ok(rs.after==='done','and once the run has closed, and a press, the interface sounds again, '+rs.after);
  await pg.waitForTimeout(1600);
  const rb=await walk(true); await pg.evaluate(()=>relClose());
  ok(rb.go&&rb.made>0&&rb.probes.some(p=>p.r)&&rb.probes.some(p=>p.atm.some(Boolean)),'and on an engine that ignores the release, the same run is '
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
  const a1=await pg.evaluate(p0=>({on:!CURP.ui.sfxoff, sw:document.getElementById('acsfx').getAttribute('aria-checked'),
   played:SFX_PLAYED-p0, stored:(function(){try{return JSON.parse(JSON.stringify(validateProfile(JSON.parse(pExport())).profile.ui.sfxoff));}
    catch(e){return 'unread: '+e.message;}})()}),p0);
  ok(a1.on&&a1.sw==='true'&&a1.played===1,'turned on, it is on and plays one sound so the person hears what they '
   +'turned on, '+JSON.stringify(a1));
  ok(a1.stored===false,'and the profile boundary keeps the switch rather than dropping an unknown key, '+JSON.stringify(a1.stored));}
 ok(err.length===0,'no page errors, '+err.join(' | '));
 await ctx.close();
 await atmGate(browser,FILE,ok,booted);}

/* ============================================================
   THE ATMOSPHERE, GATED. Round OU and OV. The layer under nearly every press,
   in ui/sound.js, held with the same discipline as the fittings and no new
   trust in an ear:

     A  the map is complete. Every sound has a level and a use, every kind of
        control the product draws is classified, and every overlay circle on
        the three surfaces has a seat to sound at.
     B  every row, rendered offline through the product's own sfxRender at
        every pitch it can sound at: a sine and at most one partial through a
        lowpass, or filtered noise, one of the seven seat tones, peak within
        a decibel or two of the level table and under minus 27 dBFS, most of
        them under minus 30, over before SFX_MAX_MS, clean at both ends of
        the band, and one number, ATM_MASTER, moves them all.
     C  the room under a zoom: silent at 1x, louder and brighter with the
        zoom, exactly zero 1.5 seconds after the last input.
     D  silence: nothing on load, nothing before a press, nothing with the
        switch off, nothing under Quiet, nothing in a release. Reduced motion
        does not silence it.
     E  the wiring through real controls: one sound per press, the overlay's
        direction, the air swell's, the ping's seat and its lift, the hover
        tick, and the two limiters.

   Each silence is checked against a broken engine, and the rule against a
   deliberately loud and long row, because a gate that cannot see sound when
   sound is made is not measuring the silence it reports.
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
 function meter(x,t0){
  var pk=0,last=-1,i0=Math.round(t0*SR);
  for(var i=0;i<x.length;i++){var a=Math.abs(x[i]); if(a>pk)pk=a; if(a>0.0005)last=i;}
  var N=1; while(N<x.length)N<<=1;
  var re=new Float64Array(N), im=new Float64Array(N); re.set(x); fft(re,im);
  var tot=0,lo=0,hi=0,cen=0;
  for(var k=1;k<N/2;k++){var e=re[k]*re[k]+im[k]*im[k], f=k*SR/N; tot+=e; cen+=e*f;
   if(f<150)lo+=e; if(f>4000)hi+=e;}
  var step=0; for(var i=Math.max(1,last-Math.round(0.002*SR));i<x.length;i++){
   var d=Math.abs(x[i]-x[i-1]); if(d>step)step=d;}
  return {peak:pk, db:20*Math.log10(pk||1e-9), ms:(last-i0)/SR*1000, lo:lo/tot, hi:hi/tot, cen:cen/tot, step:step};}
 async function render(sec,fn){
  var ac=new OfflineAudioContext(1,Math.round(sec*SR),SR); fn(ac);
  return (await ac.startRendering()).getChannelData(0);}
 function rms(x,a,b){var s=0,i0=Math.round(a*SR),i1=Math.round(b*SR); for(var i=i0;i<i1;i++)s+=x[i]*x[i];
  return 20*Math.log10(Math.sqrt(s/Math.max(1,i1-i0))||1e-9);}
 window.__M={SR:SR,fft:fft,meter:meter,render:render,rms:rms};})()`;

async function atmGate(browser,FILE,ok,booted){
 const COUNT=`(function(){
  window.__nodes=0; window.__ctxs=0;
  var B=window.BaseAudioContext||window.AudioContext;
  ['createOscillator','createGain','createBiquadFilter','createBufferSource','createStereoPanner','createChannelMerger']
   .forEach(function(m){ var f=B.prototype[m]; if(!f)return;
    B.prototype[m]=function(){ if(!(window.OfflineAudioContext&&this instanceof OfflineAudioContext))window.__nodes++;
     return f.apply(this,arguments); }; });
  var AC=window.AudioContext;
  if(AC){ window.AudioContext=function(o){ window.__ctxs++; return new AC(o); };
   window.AudioContext.prototype=AC.prototype; }})();`;
 const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
 await ctx.addInitScript(COUNT);
 const pg=await ctx.newPage();
 const err=[];
 pg.on('pageerror',e=>err.push(e.message));
 await pg.goto(FILE,{waitUntil:'load'}); await booted(pg);
 await pg.evaluate(METER);
 console.log('\n=== the atmosphere: the layer under every press ===');

 /* ---------- D1. nothing on load, before any press ---------- */
 await pg.waitForTimeout(1200);
 const load=await pg.evaluate(()=>({nodes:window.__nodes, ctxs:window.__ctxs, played:atmState().played, why:sfxWhy(),
  on:!(CURP.ui&&CURP.ui.sfxoff)}));
 ok(load.on&&load.nodes===0&&load.ctxs===0&&load.played===0&&load.why==='no press yet',
  'sound on by default, and on load nothing sounds, no context opens and no node is made, '+JSON.stringify(load));
 /* a pointer travelling over controls, a wheel zoom, a JS click and a press on the wheel, with no press yet */
 await pg.evaluate(()=>{CURP.ui.sfxoff=false; CURP.ui.quiet=false; setTab(TAB.FIELD);});
 await pg.waitForTimeout(300);
 const stim=async()=>{
  const bs=await pg.$$('#fbar .fb-b');
  for(const b of bs.slice(0,6)){ const bb=await b.boundingBox(); if(bb)await pg.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2,{steps:3}); }
  await pg.mouse.move(700,500,{steps:2});
  for(let i=0;i<3;i++){ await pg.mouse.wheel(0,-120); await pg.waitForTimeout(30); }
  return pg.evaluate(()=>{ var b=document.createElement('button'); b.type='button'; b.className='btn'; b.id='atmprobe0';
   document.body.appendChild(b); b.click();
   var a=[atmPing({k:'seat',b:'Heart'}), atmZoom(3,7), atmPlay('click')];
   return new Promise(function(r){ setTimeout(function(){ r({a:a, nodes:window.__nodes, ctxs:window.__ctxs, played:atmState().played, amb:!!atmState().amb}); },80); }); });};
 const pre=await stim();
 ok(pre.a.every(v=>v===false)&&pre.nodes===0&&pre.ctxs===0&&pre.played===0&&!pre.amb,
  'before any press, hovering, zooming, clicking by script and pressing on the Field make no node and open no context, '+JSON.stringify(pre));
 const preBite=await pg.evaluate(async()=>{ var keep=window.sfxGestured; window.sfxGestured=function(){return true;};
  var n0=window.__nodes, r=[atmPlay('click')];
  await new Promise(function(q){setTimeout(q,80);});
  r.push(atmPing({k:'seat',b:'Heart'})); window.sfxGestured=keep;
  return {r:r, made:window.__nodes-n0}; });
 ok(preBite.r.every(Boolean)&&preBite.made>0,'and with the press check taken out the same calls do make sound, '+preBite.made+' nodes, so the zero is a reading');
 await pg.evaluate(()=>{ atmAmbEnd(); ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0; window.__p0=atmState().played; });

 /* a real press, on an inert patch that no control kind matches */
 await pg.evaluate(()=>{const d=document.createElement('div'); d.id='sfxpad';
  d.style.cssText='position:fixed;left:0;bottom:0;width:40px;height:40px;z-index:99999';
  document.body.appendChild(d);});
 await pg.click('#sfxpad'); await pg.waitForTimeout(400);
 const padOnly=await pg.evaluate(()=>atmState().played-window.__p0);
 ok(padOnly===0,'a press on something that is not a control sounds nothing, '+padOnly);

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
 /* every control the product draws, on every tab, is a kind in the map, and every
    overlay circle on screen has its seat in the table and not the fallback */
 const tabs=await pg.evaluate(()=>TABDEF.map(t=>t.k));
 const cover={n:0,none:[],by:{},ovl:[],unseated:[]};
 for(const k of tabs){
  await pg.evaluate(k=>{loadP(0); setTab(k);},k).catch(()=>{});
  await pg.waitForTimeout(350);
  const r=await pg.evaluate(()=>{
   var o={n:0,none:[],by:{},ovl:[],unseated:[]};
   document.querySelectorAll('button,[role=button],[role=tab],[role=switch],[role=radio],[role=menuitem],[role=menuitemcheckbox],a[href],summary,input[type=checkbox],input[type=radio]').forEach(function(e){
    if(!e.offsetParent||e.disabled||e.getAttribute('aria-disabled')==='true')return;
    var h=atmTarget(e); o.n++;
    if(!h){ o.none.push(e.tagName+'.'+(e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className)); return; }
    o.by[h.row.kind]=(o.by[h.row.kind]||0)+1;
    if(h.row.snd==='overlay'){ var v=e.getAttribute(h.row.attr), seat=atmSeatFor(h);
     if(h.row.by==='cs'){ if(!BANDS[+v])o.unseated.push(h.row.by+':'+v); }
     else if(!(ATM_SEAT[h.row.by]&&ATM_SEAT[h.row.by][v]))o.unseated.push(h.row.by+':'+v); }});
   return o;});
  cover.n+=r.n; cover.none=cover.none.concat(r.none); cover.unseated=cover.unseated.concat(r.unseated);
  Object.keys(r.by).forEach(k=>cover.by[k]=(cover.by[k]||0)+r.by[k]);}
 ok(cover.n>200&&cover.none.length===0&&cover.unseated.length===0,
  'every control drawn on every tab ('+cover.n+' of them) is a kind in the map, and every overlay circle has its own seat, unclassified: '
  +(cover.none.slice(0,6).join(', ')||'none')+', unseated: '+(cover.unseated.slice(0,6).join(', ')||'none'));
 console.log('  kinds met: '+Object.keys(cover.by).map(k=>k+' '+cover.by[k]).join(', '));
 const typed=await pg.evaluate(()=>{ var out=[];
  var mk=function(h){ var d=document.createElement('div'); d.innerHTML=h; return d.firstChild; };
  [['<input type="text">'],['<input type="search">'],['<input type="number">'],['<select><option>a</option></select>'],['<textarea></textarea>'],
   ['<div class="x">x</div>'],['<button type="button" disabled>d</button>'],['<button type="button" aria-disabled="true">d</button>']]
   .forEach(function(p){ var e=mk(p[0]); document.body.appendChild(e); out.push(!!atmTarget(e)); e.remove(); });
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
   if(!(m.db<=-27))bad.push('peak '+m.db.toFixed(1)+' over minus 27');
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
  var res=[], quiet=0, n=0, worst=-99;
  for(var i=0;i<ATM.length;i++){ var x=ATM[i];
   var ss=x.seat?[x.seat]:seats, lifts=x.k==='ping'?[0,ATM_LIFT_DB]:[0];
   for(var j=0;j<ss.length;j++)for(var q=0;q<lifts.length;q++){
    var row=atmRow(x.k,{seat:ss[j],liftDb:lifts[q]});
    var base=row.hz/(x.oct||1), inScale=scale.some(function(h){return Math.abs(h-base)<0.01;});
    var buf=await M.render((x.max+300)/1000,function(ac){sfxRender(ac,ac.destination,row,0.01);});
    var m=M.meter(buf,0.01), bad=judge(row,m,row.db);
    if(!inScale)bad.push('pitch '+row.hz+' is not a seat tone');
    if(!(base>=390&&base*(x.oct||1)<=4000))bad.push('pitch '+row.hz+' outside 390 to 4000');
    n++; if(m.db<=-30)quiet++; if(m.db>worst)worst=m.db;
    res.push({k:x.k,seat:ss[j],lift:lifts[q],hz:row.hz,db:m.db,tgt:row.db,ms:m.ms,max:x.max,len:sfxLen(row),lo:m.lo,hi:m.hi,cen:m.cen,bad:bad}); } }
  /* the rule against a deliberately loud, long row */
  var broke=atmRow('click'); broke.parts.forEach(function(p){p.pk*=5; p.r*=8;});
  var bb=await M.render(1.4,function(ac){sfxRender(ac,ac.destination,broke,0.01);});
  var bm=M.meter(bb,0.01), broken=judge(broke,bm,ATM_DB.click);
  /* the master: one number moves everything */
  var m1=M.meter(await M.render(0.4,function(ac){sfxRender(ac,ac.destination,atmRow('click'),0.01);}),0.01);
  var keep=ATM_MASTER; ATM_MASTER=0.5;
  var m2=M.meter(await M.render(0.4,function(ac){sfxRender(ac,ac.destination,atmRow('click'),0.01);}),0.01);
  ATM_MASTER=2;
  var m3=M.meter(await M.render(0.4,function(ac){sfxRender(ac,ac.destination,atmRow('click-heavy'),0.01);}),0.01);
  ATM_MASTER=keep;
  return {res:res, n:n, quiet:quiet, worst:worst, broken:broken, master:{d:m2.db-m1.db, up:m3.db-(-31)}, SFX_MAX:SFX_MAX_MS};});
 console.log('  sound          seat      hz   peak dBFS  table   length  cap   <150Hz  >4kHz  centroid');
 B.res.forEach(r=>{
  if(r.seat!=='Heart'&&r.seat!=='3rd Eye'&&r.seat!=='Root'&&r.lift===0&&r.k!=='click'&&r.k!=='click-heavy'&&r.k!=='click-light')return;
  console.log('  '+(r.k+(r.lift?'+'+r.lift:'')).padEnd(15)+String(r.seat).padEnd(9)+String(Math.round(r.hz)).padStart(5)
   +r.db.toFixed(1).padStart(10)+String(r.tgt).padStart(8)+(r.ms.toFixed(0)+' ms').padStart(9)+String(r.max).padStart(5)
   +((r.lo*100).toFixed(2)+'%').padStart(9)+((r.hi*100).toFixed(2)+'%').padStart(8)+(r.cen.toFixed(0)+' Hz').padStart(10));});
 const badRows=B.res.filter(r=>r.bad.length);
 ok(badRows.length===0,'all '+B.n+' soundings (every row at every pitch it can sound at, and the ping at full zoom) are a seat tone, a sine and at most one partial through a lowpass or filtered noise, on their table level, over inside their cap, clean at both ends of the band: '
  +(badRows.slice(0,4).map(r=>r.k+' '+r.seat+' '+r.bad.join(',')).join(' | ')||'clean'));
 ok(B.res.every(r=>r.ms<=B.SFX_MAX&&r.len<=B.SFX_MAX),'none runs to the fittings\' ceiling, '+B.SFX_MAX+' ms: the longest rang '
  +Math.max(...B.res.map(r=>r.ms)).toFixed(0)+' ms');
 ok(B.worst<=-27&&B.quiet/B.n>=0.75,'the loudest of them peaks at '+B.worst.toFixed(1)+' dBFS, and '+B.quiet+' of '+B.n+' are at minus 30 or lower');
 ok(B.broken.length>=2&&B.broken.some(s=>/peak/.test(s))&&B.broken.some(s=>/cap|rang|declared/.test(s)),
  'and the same rule refuses a row made loud and long on purpose: '+B.broken.join('; '));
 ok(Math.abs(B.master.d+6.02)<1&&Math.abs(B.master.up-6.02)<1.5,'ATM_MASTER moves everything: 0.5 is '+B.master.d.toFixed(1)+' dB and 2 is +'+B.master.up.toFixed(1)+' dB');

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
  o.lv=[]; for(var L of [0.25,0.5,0.75,1]){ var s=await steady(L); o.lv.push({L:L,rms:s.rms,cen:s.meter.cen,pk:s.pk,lo:s.meter.lo}); }
  /* nothing at 1x: no input at all, and an input at level 0 */
  var z=await M.render(1.5,function(ac){var h=atmAmbBuild(ac,ac.destination); for(var t=0;t<1;t+=0.1)atmAmbTo(h,0,t);});
  o.z1=M.meter(z,0).peak;
  /* the last input at 0.9 s, at full zoom: the ambience is exactly zero from 1.5 s after it */
  var d=await M.render(3.5,function(ac){var h=atmAmbBuild(ac,ac.destination); for(var t=0;t<=0.9001;t+=0.1)atmAmbTo(h,1,t);});
  var tl=0.9, i0=Math.round((tl+ATM_AMB_END)*M.SR);
  o.during=M.rms(d,tl,tl+0.3); o.late=M.rms(d,tl+1.3,tl+ATM_AMB_END-0.001);
  o.zero=true; for(var i=i0+2;i<d.length;i++){ if(d[i]!==0){o.zero=false; break;} }
  o.stepAt=0; for(var i=i0-3;i<i0+3;i++){ var s2=Math.abs(d[i+1]-d[i]); if(s2>o.stepAt)o.stepAt=s2; }
  /* the whole curve has no step above what the loudest sine itself takes */
  o.maxStep=0; for(var i=1;i<d.length;i++){ var s3=Math.abs(d[i]-d[i-1]); if(s3>o.maxStep)o.maxStep=s3; }
  /* zooming out lowers it: full zoom, then an input back at 1x, and it is down 40 dB inside a second */
  var w=await M.render(4,function(ac){var h=atmAmbBuild(ac,ac.destination); for(var t=0;t<1;t+=0.1)atmAmbTo(h,1,t); atmAmbTo(h,0,1.0);});
  o.out0=M.rms(w,0.8,1.0); o.out1=M.rms(w,1.9,2.0);
  /* a mid zoom out is lower, not gone */
  var w2=await M.render(4,function(ac){var h=atmAmbBuild(ac,ac.destination); for(var t=0;t<1;t+=0.1)atmAmbTo(h,1,t); for(var t=1;t<1.8;t+=0.1)atmAmbTo(h,0.4,t);});
  o.mid=M.rms(w2,1.5,1.7);
  return o;});
 ok(C.silent&&C.mono,'the room: its target is zero at 1x, and both its level and its brightness rise with every step of zoom');
 console.log('  zoom level  steady rms dBFS  peak dBFS  centroid');
 C.lv.forEach(r=>console.log('  '+String(r.L).padEnd(12)+r.rms.toFixed(1).padStart(10)+r.pk.toFixed(1).padStart(14)+(r.cen.toFixed(0)+' Hz').padStart(12)));
 ok(C.lv.every((r,i)=>i===0||(r.rms>C.lv[i-1].rms+1.5&&r.cen>C.lv[i-1].cen)),'rendered, the room is louder and brighter at every step of zoom, '
  +C.lv.map(r=>r.rms.toFixed(1)).join(', ')+' dB rms');
 ok(C.lv[3].pk<=-30&&Math.abs(C.lv[3].pk-(-32))<2.5&&C.lv.every(r=>r.lo<0.01),'its peak at full zoom is '+C.lv[3].pk.toFixed(1)+' dBFS, on its table level, with nothing under 150 Hz');
 ok(C.z1===0,'and at 1x it is exactly silent, '+C.z1);
 ok(C.during>-60&&C.late<-75&&C.zero&&C.stepAt<0.0002&&C.maxStep<0.01,
  'it holds while the person zooms, '+C.during.toFixed(1)+' dB, is under minus 75 dB just before 1.5 s after the last input ('+C.late.toFixed(1)
  +' dB), and is exactly zero from there with a step of '+C.stepAt.toExponential(1)+' at the end and no click anywhere (largest step '+C.maxStep.toFixed(4)+')');
 ok(C.out1<C.out0-40&&C.mid>C.out1+10&&C.mid<C.lv[3].rms,'zooming out lowers it: '+C.out0.toFixed(1)+' dB at full zoom, '+C.mid.toFixed(1)
  +' dB at 0.4, and '+C.out1.toFixed(1)+' dB a second after the picture is back at 1x');
 /* the room, live, through the real wheel and the real keys */
 await pg.evaluate(()=>{loadP(0); CURP.ui.sfxoff=false; CURP.ui.quiet=false; setTab(TAB.FIELD);});
 await pg.waitForTimeout(500);
 await pg.mouse.move(700,500); await pg.waitForTimeout(100);
 const lv0=await pg.evaluate(()=>atmState().amb);
 for(let i=0;i<3;i++){ await pg.mouse.wheel(0,-120); await pg.waitForTimeout(40); }
 const lv1=await pg.evaluate(()=>atmState().amb);
 for(let i=0;i<6;i++){ await pg.mouse.wheel(0,-120); await pg.waitForTimeout(40); }
 const lv2=await pg.evaluate(()=>atmState().amb);
 await pg.waitForTimeout(150);
 const lv2b=await pg.evaluate(()=>atmState().amb);
 ok(lv0===null&&lv1&&lv2&&lv1.gain>0&&lv2.gain>lv1.gain&&lv2.lp>lv1.lp&&lv2b.now>0,
  'live, a wheel zoom on the Field starts the room at 1x with nothing, brings it up with each notch and opens its filter, '
  +JSON.stringify({start:lv0&&lv0.gain, a:lv1&&[lv1.L.toFixed(2),lv1.gain.toFixed(4)], b:lv2&&[lv2.L.toFixed(2),lv2.gain.toFixed(4)], sounding:lv2b&&lv2b.now.toFixed(4)}));
 for(let i=0;i<4;i++){ await pg.mouse.wheel(0,120); await pg.waitForTimeout(40); }
 const lv3=await pg.evaluate(()=>atmState().amb);
 ok(lv3&&lv3.gain<lv2.gain&&lv3.lp<lv2.lp,'and zooming out lowers it, '+JSON.stringify(lv3&&[lv3.L.toFixed(2),lv3.gain.toFixed(4)]));
 await pg.keyboard.press('f'); await pg.waitForTimeout(60);
 const lv4=await pg.evaluate(()=>atmState().amb);
 ok(lv4&&lv4.gain===0&&lv4.L===0,'the reframe key puts the target back to nothing, '+JSON.stringify(lv4&&[lv4.L,lv4.gain]));
 await pg.waitForTimeout(1900);
 const lv5=await pg.evaluate(()=>({amb:atmState().amb, why:sfxWhy()}));
 ok(lv5.amb===null,'and 1.5 seconds on, the chain is taken down, nothing is left sounding, '+JSON.stringify(lv5));
 /* Frames and Dial, the other two pictures, zoom it too */
 const fz=await pg.evaluate(async()=>{ fviewSet('frames'); await new Promise(r=>setTimeout(r,300));
  var h=document.getElementById('frend'); var b=h.getBoundingClientRect();
  fzAt(2.5,b.width/2,b.height/2); var a=atmState().amb; fzAt(1,0,0); var z=atmState().amb; fviewSet('wheel');
  return {a:a&&[a.L,a.gain], z:z&&[z.L,z.gain]}; });
 ok(fz.a&&fz.a[1]>0&&fz.z&&fz.z[1]===0,'on Frames it does the same, up at 2.5x and nothing at 1x, '+JSON.stringify(fz));
 await pg.evaluate(()=>{ atmAmbEnd(); });
 await pg.waitForTimeout(100);

 /* ---------- D. silence, and what is not silence ---------- */
 await pg.evaluate(()=>{ var b=document.createElement('button'); b.type='button'; b.className='btn'; b.id='atmprobe';
  b.style.cssText='position:fixed;left:44px;bottom:0;width:60px;height:40px;z-index:99999'; b.textContent='p'; document.body.appendChild(b); });
 const burstOf=async()=>{
  await pg.evaluate(()=>{ ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0; ATM_HOV=[]; ATM_PT={x:-99,y:-99}; ATM_HOVERED=new WeakMap(); });
  const n0=await pg.evaluate(()=>({n:window.__nodes,p:atmState().played}));
  await pg.mouse.move(900,600); await pg.mouse.move(60,975,{steps:2});
  await pg.click('#atmprobe'); await pg.waitForTimeout(40);
  await pg.mouse.move(700,500);
  for(let i=0;i<2;i++){ await pg.mouse.wheel(0,-120); await pg.waitForTimeout(30); }
  await pg.evaluate(()=>{ atmPing({k:'seat',b:'Root'}); sheetOpen('<p>x</p>'); });
  await pg.waitForTimeout(120);
  const r=await pg.evaluate(n0=>({made:window.__nodes-n0.n, played:atmState().played-n0.p, amb:!!atmState().amb, why:sfxWhy()}),n0);
  await pg.evaluate(()=>{ atmAmbEnd(); sheetShut(); }); await pg.waitForTimeout(100);
  return r;};
 const live=await burstOf();
 ok(live.why===''&&live.made>0&&live.played>=3&&live.amb,'with the switch on, the same presses, hovers, zoom, ping and sheet make sound, '+JSON.stringify(live));
 await pg.evaluate(()=>{CURP.ui.sfxoff=true; CURP.ui.quiet=false;});
 const off=await burstOf();
 ok(off.why==='off'&&off.made===0&&off.played===0&&!off.amb,'with the switch off, none of it makes a node, '+JSON.stringify(off));
 await pg.evaluate(()=>{CURP.ui.sfxoff=false; CURP.ui.quiet=true;});
 const qu=await burstOf();
 ok(qu.why==='quiet'&&qu.made===0&&qu.played===0&&!qu.amb,'with Quiet on, the switch on, none of it makes a node either, '+JSON.stringify(qu));
 /* the broken engine: both switches read as open */
 const swBite=await pg.evaluate(()=>{ var keep=window.sfxWhy; window.sfxWhy=function(){return '';};
  CURP.ui.sfxoff=true; CURP.ui.quiet=true; var n0=window.__nodes, a=atmPlay('click'), z=atmZoom(3,7); atmAmbEnd();
  window.sfxWhy=keep; CURP.ui.sfxoff=false; CURP.ui.quiet=false; return {a:a, z:z, made:window.__nodes-n0}; });
 ok(swBite.a==='click'&&swBite.z&&swBite.made>0,'and on an engine that ignores both switches the same calls make nodes, so both zeros are readings, '+JSON.stringify(swBite));
 /* reduced motion is a request about motion, and does not silence a sound */
 await pg.emulateMedia({reducedMotion:'reduce'});
 const rm=await burstOf();
 await pg.emulateMedia({reducedMotion:'no-preference'});
 ok(rm.why===''&&rm.made>0&&rm.played>=3,'reduced motion does not silence it, '+JSON.stringify(rm));
 await pg.evaluate(()=>{ ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0; });

 /* ---------- E. through real controls ---------- */
 await pg.waitForTimeout(500);
 const row=()=>pg.evaluate(()=>{var s=atmState(); return s.row&&{k:s.row.k,hz:Math.round(s.row.hz),db:s.row.db,p:s.played};});
 const fresh=()=>pg.evaluate(()=>{ ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0; ATM_HOV=[]; ATM_ROW=null; });
 /* a click of every weight, by kind */
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
 const gotK=[];
 for(const [nm,html,want] of kinds){
  await fresh();
  const g=await pg.evaluate(async html=>{ var d=document.createElement('div'); d.innerHTML=html; var e=d.firstChild; document.body.appendChild(e);
   e.click(); await new Promise(function(r){setTimeout(r,40);}); var s=atmState(); e.remove(); return s.row&&s.row.k; },html);
  gotK.push(nm+' '+g);
  ok(g===want,nm+' sounds '+want+', '+g);}
 /* tab, by its real button */
 await fresh();
 await pg.evaluate(()=>document.querySelector('.tabtop[data-tabk="1"]').click()); await pg.waitForTimeout(80);
 const tr=await row();
 ok(tr&&tr.k==='click','a real tab press sounds a click, '+JSON.stringify(tr));
 await pg.evaluate(()=>document.querySelector('.tabtop[data-tabk="2"]').click()); await pg.waitForTimeout(400);
 /* ONE SOUND PER PRESS: a press that earns a fitting, a ping or a swell has no click */
 const one=await pg.evaluate(async()=>{
  var out={};
  ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0; SFX_AT=0; SFX_LAST={}; SFX_RECENT=[];
  var b=document.createElement('button'); b.type='button'; b.className='btn pri'; document.body.appendChild(b);
  var p0=atmState().played, f0=SFX_PLAYED;
  b.onclick=function(){ sfx('kept'); };
  b.click(); await new Promise(function(r){setTimeout(r,60);});
  out.fit={atm:atmState().played-p0, fitting:SFX_PLAYED-f0, click:!!ATM_LAST['click-heavy']};
  ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0; SFX_AT=0;
  p0=atmState().played; b.onclick=function(){ sheetOpen('<p>one</p>'); };
  b.click(); await new Promise(function(r){setTimeout(r,60);});
  out.sheet={atm:atmState().played-p0, air:!!ATM_LAST['air-open'], click:!!ATM_LAST['click-heavy']};
  b.onclick=null; b.remove(); sheetShut();
  await new Promise(function(r){setTimeout(r,300);});
  return out;});
 ok(one.fit.fitting===1&&one.fit.atm===0&&!one.fit.click,'a press that earns a fitting gets the fitting and no click, '+JSON.stringify(one.fit));
 ok(one.sheet.atm===1&&one.sheet.air&&!one.sheet.click,'and a press that opens a sheet gets the air swell and no click, '+JSON.stringify(one.sheet));
 /* the sheet, closing */
 await fresh();
 const sh=await pg.evaluate(async()=>{ var out=[];
  sheetOpen('<p>x</p>'); await new Promise(function(r){setTimeout(r,60);}); out.push(atmState().row&&atmState().row.k);
  ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0;
  sheetShut(); await new Promise(function(r){setTimeout(r,60);}); out.push(atmState().row&&atmState().row.k);
  ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0; var p=atmState().played;
  sheetShut(); await new Promise(function(r){setTimeout(r,60);}); out.push(atmState().played-p);
  return out; });
 ok(sh[0]==='air-open'&&sh[1]==='air-close'&&sh[2]===0,'a sheet opens upward and closes downward, and shutting what is shut is silent, '+JSON.stringify(sh));
 /* the air swell leans the way the sheet goes */
 const lean=await pg.evaluate(()=>{ var a=ATM_BY['air-open'].parts[0], c=ATM_BY['air-close'].parts[0];
  return {open:a.bp1>a.bp, close:c.bp1<c.bp, openA:a.a, closeA:c.a}; });
 ok(lean.open&&lean.close&&lean.openA>lean.closeA,'the swell opens up and slow and shuts down and quick, '+JSON.stringify(lean));
 /* overlays, through the real circles on three surfaces */
 await pg.waitForTimeout(300);
 const ov=async(sel,pre)=>{
  await fresh();
  if(pre)await pg.evaluate(pre);
  const before=await pg.evaluate(sel=>{var e=document.querySelector(sel); return e&&e.getAttribute('aria-pressed');},sel);
  if(before===null)return {missing:sel};
  await pg.click(sel); await pg.waitForTimeout(80);
  const a=await row(); await pg.waitForTimeout(350); await fresh();
  await pg.click(sel); await pg.waitForTimeout(80);
  const b=await row(); await pg.waitForTimeout(350);
  return {before:before, first:a, second:b};};
 const f1=await ov('#fbar [data-fb=shadow]');
 const rootHz=await pg.evaluate(()=>seatHz('Root'));
 ok(f1.first&&f1.second&&f1.first.k===(f1.before==='true'?'overlay-off':'overlay-on')&&f1.second.k===(f1.before==='true'?'overlay-on':'overlay-off')
  &&f1.first.hz===rootHz&&f1.second.hz===rootHz,'the Field\'s Decoherence circle falls going off and rises going on, at the Root\'s tone, '+JSON.stringify(f1));
 const f2=await ov('#fbar [data-fb=laws]');
 const crownHz=await pg.evaluate(()=>seatHz('Crown'));
 ok(f2.first&&f2.first.hz===crownHz&&f2.second.hz===crownHz&&f2.first.k!==f2.second.k,'and the Laws circle at the Crown\'s, one concept one pitch, '+JSON.stringify(f2));
 const f3=await ov('#fbar [data-fb=seats]');
 ok(f3.first&&f3.first.hz>0&&f3.first.k.indexOf('overlay')===0,'Assemblage Points, at its own, '+JSON.stringify(f3));
 await pg.evaluate(()=>{ setTab(TAB.ENERGY); }); await pg.waitForTimeout(800);
 const b1=await ov('[data-bmov=flow]'), sac=await pg.evaluate(()=>seatHz('Sacral'));
 ok(b1.first&&b1.first.hz===sac&&b1.second.hz===sac&&b1.first.k!==b1.second.k,'the Body\'s Flow circle goes both ways at the Sacral\'s tone, '+JSON.stringify(b1));
 const b2=await ov('[data-bmov=addr]');
 ok(b2.first&&b2.first.hz===rootHz&&b2.first.k!==b2.second.k,'and its Addresses at the Root\'s, the same pitch as the Field\'s, '+JSON.stringify(b2));
 await pg.evaluate(()=>{ setTab(TAB.COMPASS); }); await pg.waitForTimeout(900);
 const c1=await ov('[data-cn=well]');
 ok(c1.first&&c1.first.hz===rootHz&&c1.first.k!==c1.second.k,'the Compass\'s Gravity well circle goes both ways at the Root\'s tone, '+JSON.stringify(c1));
 /* the Compass's seat shells, each its own seat, off BANDS: a synthetic one, because the Registers view is the paid tier's */
 const cs=await pg.evaluate(async()=>{ var out=[];
  for(var si=0;si<7;si++){
   ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0;
   var b=document.createElement('button'); b.type='button'; b.setAttribute('data-cnseat',si); b.setAttribute('aria-pressed','false');
   b.onclick=function(){ this.setAttribute('aria-pressed',this.getAttribute('aria-pressed')==='true'?'false':'true'); };
   document.body.appendChild(b); b.click(); await new Promise(function(r){setTimeout(r,30);});
   var s=atmState().row; out.push([BANDS[si],s&&s.k,s&&Math.round(s.hz),seatHz(BANDS[si])]); b.remove(); }
  return out; });
 ok(cs.every(r=>r[1]==='overlay-on'&&r[2]===r[3]),'each Compass seat shell rings the seat it is, '+cs.map(r=>r[0]+' '+r[2]).join(', '));
 await pg.evaluate(()=>{ loadP(0); setTab(TAB.FIELD); }); await pg.waitForTimeout(700);
 /* column folds: the left column and the glass bar, both ways */
 await fresh();
 const fold=async sel=>{ await fresh(); await pg.click(sel); await pg.waitForTimeout(80); const a=await row(); await pg.waitForTimeout(350);
  await fresh(); await pg.click(sel); await pg.waitForTimeout(80); const b=await row(); await pg.waitForTimeout(350); return [a&&a.k,b&&b.k]; };
 const fl=await fold('#lfold'), fb=await fold('#fbar .fb-tog'), fr=await fold('#rfold');
 ok(fl.join()!==''&&new Set(fl).size===2&&fl.every(k=>/^air-/.test(k)),'the left column opens with a rising swell and shuts with a falling one, '+fl.join(', '));
 ok(new Set(fb).size===2&&fb.every(k=>/^air-/.test(k)),'and so does the bar\'s own fold, '+fb.join(', '));
 ok(new Set(fr).size===2&&fr.every(k=>/^air-/.test(k)),'and the right column, '+fr.join(', '));
 /* THE PING. A press on the wheel, Frames and Dial: the seat pressed, and a little more of it as the field comes closer. */
 await pg.evaluate(()=>{ loadP(0); setTab(TAB.FIELD); S.zoom=1; reframe(); render(); }); await pg.waitForTimeout(500);
 const hz=await pg.evaluate(()=>({Root:seatHz('Root'),Throat:seatHz('Throat'),Heart:seatHz('Heart'),Brow:seatHz('3rd Eye')}));
 const pingOf=async h=>{ await fresh(); await pg.evaluate(h=>{ hitPress(h,{shiftKey:false}); },h); await pg.waitForTimeout(40);
  const r=await row(); await pg.waitForTimeout(120); return r; };
 const p1b=await (async()=>{ await fresh(); await pg.evaluate(()=>{ hitPress({k:'node',n:W.filter(function(x){return x.b==='Throat';})[0]},{shiftKey:false}); }); await pg.waitForTimeout(40); const r=await row(); await pg.waitForTimeout(120); return r; })();
 const p2=await (async()=>{ await fresh(); await pg.evaluate(()=>{ hitPress({k:'seat',b:'Root'},{shiftKey:false}); }); await pg.waitForTimeout(40); const r=await row(); await pg.waitForTimeout(120); return r; })();
 const p3=await (async()=>{ await fresh(); await pg.evaluate(()=>{ hitPress({k:'law',j:0},{shiftKey:false}); }); await pg.waitForTimeout(40); const r=await row(); const want=await pg.evaluate(()=>seatHz(SI[0].b)); await pg.waitForTimeout(120); r.want=want; return r; })();
 const p4=await (async()=>{ await fresh(); await pg.evaluate(()=>{ hitPress({k:'gate',v:{k:'detach'}},{shiftKey:false}); }); await pg.waitForTimeout(40); const r=await row(); await pg.waitForTimeout(120); return r; })();
 ok(p1b&&p1b.k==='ping'&&p1b.hz===hz.Throat,'a press on an address at the throat rings the throat\'s tone, '+JSON.stringify(p1b));
 ok(p2&&p2.k==='ping'&&p2.hz===hz.Root,'a press on a seat band rings that seat, '+JSON.stringify(p2));
 ok(p3&&p3.k==='ping'&&p3.hz===p3.want,'a law rings the seat it is set at, '+JSON.stringify(p3));
 ok(p4&&p4.k==='ping'&&p4.hz===hz.Heart,'and a thing that is nowhere in the body rings the middle of the seven, '+JSON.stringify(p4));
 /* the lift: the same press, the field at 1x and the field zoomed all the way in */
 const lift=await pg.evaluate(async()=>{ var out={};
  ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0; S.zoom=1; reframe();
  atmPing({k:'seat',b:'Heart'}); out.near1=atmState().row.db;
  await new Promise(function(r){setTimeout(r,150);}); ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0;
  setZoom(WHEEL_ZOOM_MAX,CX,CY); atmAmbEnd(); atmPing({k:'seat',b:'Heart'}); out.far=atmState().row.db;
  await new Promise(function(r){setTimeout(r,150);}); S.zoom=1; reframe(); render(); atmAmbEnd();
  return out; });
 const LIFTDB=await pg.evaluate(()=>ATM_LIFT_DB);
 ok(lift.far>lift.near1+LIFTDB-0.2&&lift.far<=-27,'the same ping comes up '+(lift.far-lift.near1).toFixed(1)+' dB with the field zoomed all the way in, and is still under minus 27 dBFS, '+JSON.stringify(lift));
 /* a real press on the wheel's core with the real mouse: nothing to press on is the middle of the seven */
 await pg.waitForTimeout(300); await fresh();
 const cv=await pg.evaluate(()=>{ var r=document.getElementById('cv').getBoundingClientRect(); return {x:r.left+CX,y:r.top+CY}; });
 await pg.mouse.click(cv.x,cv.y); await pg.waitForTimeout(120);
 const core=await row();
 ok(core&&core.k==='ping'&&core.hz===hz.Heart,'a real press on the core of the wheel rings, once, and the core is not a seat, '+JSON.stringify(core));
 await pg.waitForTimeout(400);

 /* ---------- hover ---------- */
 const hv=async(fn)=>{ await pg.evaluate(()=>{ ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0; ATM_HOV=[]; ATM_PT={x:-99,y:-99}; ATM_HOVERED=new WeakMap(); ATM_ROW=null; window.__h0=atmState().played; });
  await fn(); await pg.waitForTimeout(60); return pg.evaluate(()=>({n:atmState().played-window.__h0, row:atmState().row&&atmState().row.k})); };
 await pg.evaluate(()=>{ setTab(TAB.FIELD); }); await pg.waitForTimeout(400);
 const one_=await hv(async()=>{ const b=await (await pg.$('#fbar [data-fb=shadow]')).boundingBox(); await pg.mouse.move(700,400); await pg.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:3}); });
 ok(one_.n===1&&one_.row==='hover','a pointer arriving at a control ticks once, '+JSON.stringify(one_));
 const sweepRun=await (async()=>{
  await pg.evaluate(()=>{ window.__hl=[]; window.__keepR=window.sfxRender; window.sfxRender=function(ac,out,x,t){ if(x.k==='hover')window.__hl.push(Date.now()); return window.__keepR(ac,out,x,t); }; });
  const r=await hv(async()=>{ const bs=await pg.$$('#fbar .fb-b'); for(let r=0;r<6;r++)for(const b of bs){ const bb=await b.boundingBox(); if(bb)await pg.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2,{steps:2}); } });
  const log=await pg.evaluate(()=>{ window.sfxRender=window.__keepR; return window.__hl; });
  let worst=0; for(const t of log){ const n=log.filter(u=>u>=t&&u<t+1000).length; if(n>worst)worst=n; }
  return {n:r.n, worst, span:log.length?log[log.length-1]-log[0]:0}; })();
 const hmax=await pg.evaluate(()=>ATM_HOVER_PER_S);
 ok(sweepRun.n>=2&&sweepRun.worst<=hmax,'sweeping the whole bar six times over ticks '+sweepRun.n+' times across '+sweepRun.span+' ms and never more than '+sweepRun.worst+' in any second, where the limit is '+hmax);
 const dupT0=Date.now();
 const dup=await hv(async()=>{ const b=await (await pg.$('#fbar [data-fb=shadow]')).boundingBox(); await pg.mouse.move(700,400);
  for(let i=0;i<4;i++){ await pg.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:2}); await pg.waitForTimeout(120); await pg.mouse.move(700,400); await pg.waitForTimeout(120); } });
 /* once for each ATM_HOVER_EACH that went by, however long a loaded machine took */
 const dupMax=1+Math.floor((Date.now()-dupT0)/(await pg.evaluate(()=>ATM_HOVER_EACH)));
 ok(dup.n>=1&&dup.n<=dupMax,'and the same control ticks once for as long as a person comes and goes from it, once per '+dupMax+' windows at most, '+JSON.stringify(dup));
 const still=await hv(async()=>{ await pg.evaluate(()=>{ var b=document.querySelector('#fbar [data-fb=addresses]'), r=b.getBoundingClientRect(), x=r.left+r.width/2, y=r.top+r.height/2;
  ATM_PT={x:x,y:y}; b.dispatchEvent(new PointerEvent('pointerover',{bubbles:true,pointerType:'mouse',clientX:x,clientY:y,buttons:0})); }); });
 ok(still.n===0,'a control that arrives under a pointer that has not moved, the layout\'s doing and not the person\'s, makes no tick, '+JSON.stringify(still));
 const touch=await hv(async()=>{ await pg.evaluate(()=>{ var b=document.querySelector('#fbar [data-fb=addresses]'), r=b.getBoundingClientRect();
  b.dispatchEvent(new PointerEvent('pointerover',{bubbles:true,pointerType:'touch',clientX:r.left+3,clientY:r.top+3,buttons:0})); }); });
 ok(touch.n===0,'a finger makes no hover tick, '+JSON.stringify(touch));
 const pen=await hv(async()=>{ await pg.evaluate(()=>{ var b=document.querySelector('#fbar [data-fb=addresses]'), r=b.getBoundingClientRect();
  b.dispatchEvent(new PointerEvent('pointerover',{bubbles:true,pointerType:'pen',clientX:r.left+5,clientY:r.top+5,buttons:0})); }); });
 ok(pen.n===1,'a pen does, '+JSON.stringify(pen));
 const drag=await hv(async()=>{ await pg.evaluate(()=>{ var b=document.querySelector('#fbar [data-fb=addresses]'), r=b.getBoundingClientRect();
  b.dispatchEvent(new PointerEvent('pointerover',{bubbles:true,pointerType:'mouse',clientX:r.left+9,clientY:r.top+9,buttons:1})); }); });
 ok(drag.n===0,'and a pointer with a button down, dragging, makes none, '+JSON.stringify(drag));
 const hq=await pg.evaluate(()=>{ var m=ATM_BY.hover, d=[]; ATM.forEach(function(x){ d.push(ATM_DB[x.k]); });
  return {hover:ATM_DB.hover, min:Math.min.apply(null,d), len:sfxLen(atmRow('hover'))}; });
 ok(hq.hover===hq.min&&hq.len<=40,'the hover tick is the quietest sound in the family, '+hq.hover+' dBFS, and '+hq.len+' ms long');
 /* a hover never counts against a click, and a click never lands on a tick */
 const hc=await pg.evaluate(async()=>{ ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0; ATM_HOV=[];
  var a=atmPlay('hover',null,true), b=atmPlay('click'), c=atmPlay('hover',null,true);
  return {tick:a, click:b, tickRightAfter:c}; });
 ok(hc.tick==='hover'&&hc.click==='click'&&hc.tickRightAfter===false,'a tick never blocks a click, and no tick lands within a breath of a sound, '+JSON.stringify(hc));

 /* ---------- the burst limiter ---------- */
 await pg.waitForTimeout(500);
 const barrage=async(limited)=>pg.evaluate(async limited=>{
  var log=[], keep=window.sfxRender, kg={}, ks={}, kb=ATM_BURST, ksp=ATM_SPACE;
  window.sfxRender=function(ac,out,x,t){ if(ATM_BY[x.k])log.push([x.k,Date.now()]); return keep(ac,out,x,t); };
  if(!limited){ ATM_BURST=1e9; ATM_SPACE=0; ATM.forEach(function(x){ kg[x.k]=x.gap; x.gap=1; }); }
  ATM_LAST={}; ATM_RECENT=[]; ATM_AT=0; ATM_HOV=[]; SFX_AT=0;
  var btns=['<button type="button">b</button>','<button type="button" class="btn pri">p</button>','<button type="button" aria-pressed="false">c</button>','<button type="button" role="tab">t</button>']
   .map(function(h){ var d=document.createElement('div'); d.innerHTML=h; var e=d.firstChild; document.body.appendChild(e); return e; });
  var t0=Date.now();
  for(var i=0;i<50;i++){ btns[i%4].click(); await new Promise(function(r){setTimeout(r,i%5===0?25:12);}); }
  await new Promise(function(r){setTimeout(r,60);});
  var span=Date.now()-t0;
  window.sfxRender=keep; ATM_BURST=kb; ATM_SPACE=ksp; ATM.forEach(function(x){ if(kg[x.k]!==undefined)x.gap=kg[x.k]; });
  btns.forEach(function(b){ b.remove(); });
  var worst=0, minGap=1e9;
  for(var i=0;i<log.length;i++){ var n=0; for(var j=0;j<log.length;j++)if(log[j][1]>=log[i][1]&&log[j][1]<log[i][1]+1000)n++; if(n>worst)worst=n;
   if(i&&log[i][1]-log[i-1][1]<minGap)minGap=log[i][1]-log[i-1][1]; }
  return {n:log.length, worst:worst, minGap:minGap, span:span, burst:ATM_BURST, space:ATM_SPACE}; },limited);
 const lim=await barrage(true);
 ok(lim.n>=2&&lim.worst<=lim.burst&&lim.minGap>=lim.space-2,'fifty presses in '+lim.span+' ms play '+lim.n+' sounds, never more than '+lim.burst+' in any second ('+lim.worst
  +') and never closer than '+lim.space+' ms ('+lim.minGap+'), '+JSON.stringify(lim));
 await pg.waitForTimeout(1200);
 const unl=await barrage(false);
 ok(unl.n>lim.n*2&&unl.worst>lim.burst,'and with the limiter taken out the same fifty make '+unl.n+' sounds, '+unl.worst+' inside one second, so the limit is a reading, '+JSON.stringify(unl));
 await pg.waitForTimeout(1200);

 /* ---------- the switch itself, and the sound a press on it makes ---------- */
 await pg.evaluate(()=>{ loadP(0); CURP.ui.sfxoff=false; CURP.ui.quiet=false; setTab(TAB.SETTINGS); if(typeof ACC_OPEN!=='undefined')ACC_OPEN='display'; renderAccount(); });
 await pg.waitForTimeout(500);
 const turnOff=await (async()=>{ await fresh(); const p0=await pg.evaluate(()=>({n:window.__nodes, a:atmState().played, f:SFX_PLAYED}));
  await pg.mouse.move(1000,700); await pg.waitForTimeout(300);
  await pg.evaluate(()=>{ ATM_HOV=[]; ATM_AT=0; ATM_PT={x:-99,y:-99}; });
  const before=await pg.evaluate(()=>({a:atmState().played}));
  await pg.evaluate(()=>{ document.getElementById('acsfx').click(); }); await pg.waitForTimeout(120);
  return pg.evaluate(b=>({off:!!CURP.ui.sfxoff, atm:atmState().played-b.a, fit:SFX_PLAYED}),before); })();
 ok(turnOff.off&&turnOff.atm===0,'the press that turns sound off is itself silent, '+JSON.stringify(turnOff));
 ok(err.length===0,'no page errors, '+err.join(' | '));
 await ctx.close();}

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
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  console.log('\n=== the fittings: the interface\'s own sounds ===');
  try{ await soundGate(browser,FILE,ok,booted); }
  catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
