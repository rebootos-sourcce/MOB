/* ============================================================
   THE PREFERENCE STUDY'S OWN MEASUREMENT PASS.

   Nothing in this directory prints a figure it did not read off a run. The two
   prototypes already carry the measurements their own seats took. This pass
   opens both at both widths and reads their live state, so the study's numbers
   come off a run of its own rather than off a checked in file that the
   prototypes may have moved past, and then it checks what it read against
   those files and refuses to write if the two disagree.

   THE FIRST CUT OF THIS FILE WAS A PIXEL PROBE AND IT LIED. It counted ink by
   luminance over a threshold and reported the band's outer edge at 332 where
   the prototype measures 306, because the background wash is a lit pixel by
   any absolute test. The repository's own rule caught it: check the tool
   against a known good case before trusting it. The probe was cut rather than
   tuned until it agreed, which is the same defect in a better mood.

   So what is measured here is state, not pixels:

     field A   window.LAST, per mode, per width. shell, the radius outside it,
               the arc closed, the share of the naming band carrying ink, the
               contrast of the name against its own ground, the mark's
               thickness, every axis run against the arc that holds it.

     field B   the live geometry of all four directions with Crown open, which
               is the heaviest seat in the roster and the one every direction
               has to hold. The fitted type size is the finding: a direction
               that falls back to seven pixel type at 390 has answered the
               naming question by refusing it.

   Derived figures are marked derived and carry the constant they came from.
   The address layer's depth is shell times a constant at
   proto/field-a/index.html, and it is called derived rather than measured.

     NODE_PATH=$(npm root -g) node sim/preference/measure.js
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const ROOT=path.resolve(__dirname,'..','..');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const A='file://'+path.join(ROOT,'proto','field-a','index.html');
const B='file://'+path.join(ROOT,'proto','field-b','index.html');
const WIDTHS=[[1600,1000],[390,844]];

const PANELS={1600:JSON.parse(fs.readFileSync(path.join(ROOT,'proto','field-a','panels-1600.json'),'utf8')),
              390:JSON.parse(fs.readFileSync(path.join(ROOT,'proto','field-a','panels-390.json'),'utf8'))};
const COSTB=JSON.parse(fs.readFileSync(path.join(ROOT,'proto','field-b','cost.json'),'utf8'));

(async()=>{
 const br=await chromium.launch({executablePath:EXE});
 const out={stamp:new Date().toISOString(), fieldA:{}, fieldB:{}, checks:[], gates:{}};
 const log=[];

 for(const [w,h] of WIDTHS){
  const ctx=await br.newContext({viewport:{width:w,height:h},deviceScaleFactor:2});
  const pg=await ctx.newPage();
  pg.on('request',r=>log.push(w+'  A  '+r.url()));
  pg.on('pageerror',e=>log.push(w+'  A  pageerror  '+e.message));
  await pg.goto(A,{waitUntil:'load'});
  await pg.waitForTimeout(700);
  const got=await pg.evaluate(()=>{
   var r={who:WHO, CQ:READ.CQ, carrying:W.filter(function(n){return n.sq>=4;}).length,
    grey:W.filter(function(n){return n.sq<4;}).length, modes:{}};
   MODES.forEach(function(m){
    var L=LAST[m]; if(!L) return;
    r.modes[m]={shell:L.shell, outside:L.outside, reserved:L.reserved,
     free:L.free, slab:L.slab, lane:L.lane, spineW:L.spineW, CW:L.CW, CH:L.CH,
     lit:L.litAnnShare, worstContrast:L.worstContrast,
     markR0:L.markR0==null?null:L.markR0, markR1:L.markR1==null?null:L.markR1,
     perSeat:L.perSeat||null, plates:L.plates||null, overflow:L.overflow};});
   return r;});
  /* THE CHECK. the live run has to agree with the file the prototype wrote. */
  ['today','band','mark','axis','spine'].forEach(m=>{
   const live=got.modes[m], file=PANELS[w][m];
   const ok=Math.abs(live.shell-file.shell)<0.51 && Math.abs(live.outside-file.outside)<0.51;
   out.checks.push((ok?'pass':'FAIL')+'  field A '+m+' at '+w
    +' reproduces panels-'+w+'.json, shell '+live.shell.toFixed(1)
    +' against '+file.shell.toFixed(1));});
  out.fieldA[w]=got;
  await ctx.close();
 }

 for(const [w,h] of WIDTHS){
  const ctx=await br.newContext({viewport:{width:w,height:h},deviceScaleFactor:2});
  const pg=await ctx.newPage();
  pg.on('request',r=>log.push(w+'  B  '+r.url()));
  pg.on('pageerror',e=>log.push(w+'  B  pageerror  '+e.message));
  await pg.goto(B,{waitUntil:'load'});
  await pg.waitForTimeout(800);
  await pg.evaluate(()=>window.__open(6));   /* Crown, the heaviest seat */
  await pg.waitForTimeout(600);
  out.fieldB[w]=await pg.evaluate(()=>{
   var r={person:PERSON.nm, dirs:{}};
   DIRS.forEach(function(d){
    var G=d.G||{};
    var rr=(G.rr!=null?G.rr:G.r)||null;
    r.dirs[d.id]={nm:d.nm, killed:!!d.killed,
     fitted:(G.fs===undefined?null:G.fs), ringR:rr,
     restR:G.restR||null, openR:G.openR||null,
     labelCol:G.lab||null, stripW:G.sw2||null, stripH:G.sh2||null,
     bandThick:(typeof bandPx==='function'&&rr)?bandPx(rr):null};});
   var G0=DIRS[0].G, r0=(G0.r||G0.rr);
   var BT=bandPx(r0), RM=r0-BT/2;
   r.ring={r:r0, bandThick:BT, crownSeats:ADDR['Crown'].length,
    throatSeats:ADDR['Throat'].length, seated:W.length,
    seventhCrownPx:(2*Math.PI*RM/7)/ADDR['Crown'].length,
    seventhThroatPx:(2*Math.PI*RM/7)/ADDR['Throat'].length,
    sharePx:(2*Math.PI*RM)/W.length};
   return r;});
  /* THE CHECK. the four directions are the four the cost file carries. */
  const names=Object.keys(out.fieldB[w].dirs).length;
  out.checks.push((names===4?'pass':'FAIL')+'  field B carries four directions at '+w
   +', read '+names);
  const c=COSTB['shut-'+w];
  out.checks.push((c&&c.length===4?'pass':'FAIL')+'  field B cost.json carries four rows at '+w);
  await ctx.close();
 }

 const net=log.filter(l=>!/ file:\/\//.test(l)&&!/pageerror/.test(l));
 out.checks.push((net.length===0?'pass':'FAIL')+'  both prototypes made '
  +net.length+' requests off the machine');
 const err=log.filter(l=>/pageerror/.test(l));
 out.checks.push((err.length===0?'pass':'FAIL')+'  neither prototype threw, '+err.length+' errors');

 out.costB=COSTB;
 const failed=out.checks.filter(c=>/^FAIL/.test(c));
 fs.writeFileSync(path.join(__dirname,'measure.log'),
  ['THE MEASUREMENT PASS. Written by sim/preference/measure.js.','',
   ...out.checks,'','every request:','',...log].join('\n')+'\n');
 console.log(out.checks.join('\n'));
 if(failed.length){
  console.error('\nthe run disagrees with the prototypes, nothing written');
  await br.close(); process.exit(1);}
 fs.writeFileSync(path.join(__dirname,'measured.json'),JSON.stringify(out,null,1)+'\n');
 await br.close();
})();
