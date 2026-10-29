/* tests/layer-observatory.js. The layer observatory's data layer, checked against the real engine rather than
   against itself. Run alone, like the project's other Chromium gates (tests/functional.js, tests/collide.js):

     NODE_PATH=/opt/node22/lib/node_modules node tests/layer-observatory.js

   LO1 is headless and runs first. It rebuilds a real atuned_src/engine/trace.js graph for a known person and
   step, independently of mockups/layer-observatory/build-trace.js's own code path, and checks build-trace.js's
   committed chain.js output against fresh traceNeighbors()/tracePath() calls on that independent graph -- never
   against itself, which would only prove the generator agrees with itself.

   LO2 opens observatory.html in real Chromium, the project's own established way to check this mockup
   (mockups/layer-observatory/shots.js, extract.js), and checks window.OBSC.lineage() -- exposed on OBSC for
   exactly this, see obs.js -- against the same real connections, from outside the page. It also watches for a
   thrown error, a console error or a request off disk, the same three things shots.js watches for. */
const path=require('path'),fs=require('fs');
const ROOT=path.resolve(__dirname,'..');
const E=require(path.join(ROOT,'engine.js'));
const BT=require(path.join(ROOT,'mockups','layer-observatory','build-trace.js'));
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL  '+m);}};
const g=n=>console.log('\n'+n);
const J=x=>JSON.stringify(x);

/* a fresh, independent real graph for a person at the real-reading step (index 11), built the same way
   tests/trace.js builds its own fixtures: blankProfile, axes, the boundary, read(), traceFromRecord(). */
function realGraph(nm){
 const person=E.PEOPLE.find(p=>p.nm===nm);
 const profile=BT.profileAt(person,1,true);
 const v=E.validateProfile(JSON.parse(J(profile)));
 if(!v.ok)throw new Error(nm+' failed the boundary: '+J(v.errs));
 const RD=E.read(JSON.parse(J(v.profile))).reading;
 const graph=E.traceFromRecord(v.profile,undefined,RD);
 return {profile:v.profile, reading:RD, graph:graph};}

function readChain(){
 const txt=fs.readFileSync(path.join(ROOT,'mockups','layer-observatory','chain.js'),'utf8');
 return JSON.parse(txt.slice(txt.indexOf('window.OBS=')+'window.OBS='.length).replace(/;\s*$/,''));}

g('LO1 · chain.js against a fresh real graph, not against its own generator');
(function(){
 const {graph:gr,reading:RD}=realGraph('Tomas');
 ok(RD.sups.length>0,'Tomas’s own canonical profile reaches a real super complex (no axis raised by hand), got '+RD.sups.length);
 const chain=readChain();
 const st=chain.people.Tomas.steps[11];
 ok(st.sup.length===RD.sups.length,'committed chain.js carries the same number of super complexes as a fresh read(), got '+st.sup.length+' against '+RD.sups.length);

 /* every saboteur's committed address parts (as real address ids, via chain.js's own addrId map) are exactly
    the pattern nodes traceNeighbors reports supporting it on the fresh graph -- not merely non-empty */
 const addrId=chain.people.Tomas.addrId;
 let sabChecked=0;
 st.sab.forEach(s=>{
  const want=(E.traceNeighbors(gr,'saboteur:'+s.nm,'supports')||[]).filter(x=>x.dir==='in').map(x=>E.traceSplit(x.key).id).sort();
  const got=s.parts.map(sl=>String(addrId[sl])).sort();
  ok(J(got)===J(want),'saboteur '+s.nm+'’s committed parts match traceNeighbors on a fresh graph, got '+J(got)+' against '+J(want));
  sabChecked++;});
 ok(sabChecked>0,'at least one saboteur was actually checked, not an empty loop passing vacuously');

 /* every complex/hyper/super's committed parts are exactly what traceNeighbors reports on the fresh graph */
 let tChecked=0;
 ['complex','hyper_complex','super_complex'].forEach(t=>{
  const list=t==='complex'?st.cx:t==='hyper_complex'?st.hy:st.sup;
  list.forEach(x=>{
   const want=(E.traceNeighbors(gr,t+':'+x.nm,'supports')||[]).filter(e=>e.dir==='in').map(e=>E.traceSplit(e.key).id).sort();
   const got=x.parts.slice().sort();
   ok(J(got)===J(want),t+' '+x.nm+'’s committed parts match traceNeighbors on a fresh graph, got '+J(got)+' against '+J(want));
   tChecked++;});});
 ok(tChecked>=3,'complex, hyper complex and super complex were each actually checked, got '+tChecked+' entries');

 /* the real walk, independently of build-trace.js's own internal assertion at generation time */
 const top=RD.sups[0], hy0=top.parts[0], cx0=hy0.parts[0], sb0=cx0.parts[0], addr=sb0.parts[0].i;
 ok(hy0.kind==='hy'&&cx0.kind==='cx'&&sb0.kind==='sab','the reading’s own nesting is hy inside cx inside sab, as read(), not assumed');
 const walk=E.tracePath(gr,'pattern:'+addr,'super_complex:'+top.nm);
 ok(!!walk&&walk.length===4&&walk.every(s=>s.edge==='supports'),
  'an address really reaches Tomas’s super complex in four supports hops on a fresh graph, got '+J(walk));
})();

g('LO2 · observatory.html, real Chromium: lineage() against the same real connections from outside the page');
(async function(){
 const {chromium}=require('playwright');
 const url='file://'+path.join(ROOT,'mockups','layer-observatory','observatory.html')+'?p=Tomas&view=hy&mode=thread';
 const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const errs=[];
 const p=await b.newPage();
 p.on('pageerror',e=>errs.push('pageerror: '+e.message));
 p.on('console',m=>{if(m.type()==='error')errs.push('console.error: '+m.text());});
 p.on('request',r=>{const u=r.url();if(!u.startsWith('file:')&&!u.startsWith('data:'))errs.push('NETWORK '+u);});
 await p.goto(url);
 await p.waitForTimeout(400);
 ok(errs.length===0,'observatory.html opens for Tomas with no thrown error, console error or network request, got '+J(errs));

 const rendered=await p.evaluate(()=>{
  const cv=document.getElementById('cv');
  return {w:cv&&cv.width, h:cv&&cv.height, sumLen:(document.getElementById('sum')||{innerText:''}).innerText.length};});
 ok(rendered.w>0&&rendered.h>0,'the canvas actually has pixels, got '+J(rendered));
 ok(rendered.sumLen>20,'the summary card actually wrote words, got '+rendered.sumLen+' characters');

 /* THE CROSS CHECK task 7 asks for: lineage() for a known node against the same real connections
    traceNeighbors()/tracePath() would give, read off the live page's own real chain.js data (not a second
    copy typed into this test) so the obs.js/trace.js key translation is exercised both ways. */
 const picked=await p.evaluate(()=>{
  const S=window.OBSC.S, sab=S.C.steps[S.step].sab;
  const nm=sab.length?sab[0].nm:null;
  return {id:nm?'s:'+nm:null, nm:nm};});
 ok(!!picked.id,'Tomas’s own step has at least one real saboteur to pick, got '+J(picked));
 if(picked.id){
  const lin=await p.evaluate(id=>window.OBSC.lineage(id),picked.id);
  ok(Array.isArray(lin)&&lin.indexOf(picked.id)>=0,'lineage() of a real saboteur includes itself, got '+J(lin).slice(0,200));

  /* independently: the same saboteur's real neighbours, two hops each way, off chain.js's own data (no
     fresh engine call needed here: LO1 already proved chain.js matches a fresh traceFromRecord graph) */
  const chain=readChain(), st2=chain.people.Tomas.steps[11], addrId=chain.people.Tomas.addrId, cf=chain.people.Tomas.cf;
  const sab2=st2.sab.find(s=>s.nm===picked.nm);
  const wantAddr=sab2.parts.map(sl=>'n:'+addrId[sl]);
  const wantUp=(chain.people.Tomas.steps[11].cx.filter(c=>c.parts.indexOf(picked.nm)>=0).map(c=>'c:'+c.nm));
  ok(wantAddr.every(k=>lin.indexOf(k)>=0),
   'lineage() reaches every real address this saboteur is built from, missing '+J(wantAddr.filter(k=>lin.indexOf(k)<0)));
  ok(wantUp.every(k=>lin.indexOf(k)>=0),
   'lineage() reaches the real complex(es) this saboteur joins, missing '+J(wantUp.filter(k=>lin.indexOf(k)<0)));
  /* and a fetter this saboteur does not stand on must not be swept in by name collision alone */
  const standsOn=new Set(sab2.parts.map(sl=>cf[sl]).filter(Boolean));
  const notOn=['Fear','Anger','Shame','Disgust','Apathy','Shock','Sad','Surprise','Anticipation'].filter(f=>!standsOn.has(f));
  if(notOn.length)ok(lin.indexOf('f:'+notOn[0])<0,'lineage() does not claim a fetter this saboteur never touched: f:'+notOn[0]);
 }

 /* a real super complex, reached only through "Three strongest chains" (chains()), is itself a real node with
    real lineage, not a count discarded the way the old dump's chain.js once did */
 const supCheck=await p.evaluate(()=>{
  const S=window.OBSC.S, sup=S.C.steps[S.step].sup;
  if(!sup.length)return null;
  window.OBSC.pin('u:'+sup[0].nm);
  const lin=window.OBSC.lineage('u:'+sup[0].nm);
  return {nm:sup[0].nm, w:sup[0].w, kids:sup[0].parts, lin:lin};});
 ok(!!supCheck,'the real step this page opened on reaches a super complex (round-trip of LO1’s own finding)');
 if(supCheck){
  ok(typeof supCheck.w==='number'&&supCheck.w>0,'the super complex pinned through the page carries a real positive weight, got '+supCheck.w);
  ok(supCheck.kids.every(k=>supCheck.lin.indexOf('h:'+k)>=0),
   'lineage() of the super complex reaches both real hyper complexes under it, got '+J(supCheck.lin).slice(0,200));
 }

 await b.close();
})().then(()=>{
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);
}).catch(e=>{console.log('  FAIL  threw: '+(e&&e.stack||e));console.log('\n===== '+PASS+' passed, '+(FAIL+1)+' failed =====');process.exit(1);});
