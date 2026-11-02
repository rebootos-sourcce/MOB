/* build-trace.js. Writes chain.js: the real saboteur, complex, hyper complex and super complex chain for the
   example people, and the real nerve/address membership under each one. Run from the repo root, no browser needed:

     node mockups/layer-observatory/build-trace.js

   SUPERSEDES extract.js for this file. extract.js drove a live source.html in Chromium to reach loadP(i) and
   compute(); that is still true and still works, but it only ever captured four rungs (fetter, saboteur, complex,
   hyper complex) and, for the fourth, only r.sups.length, a bare count, never the super complex's own name, weight
   or parts. chain.js has carried that gap since it was written. extract.js is left in place as the record of how
   the file used to be made; it is not run by anything any more.

   REAL, and real two ways now. First, same as before: step 12 (index 11) of every person is the unscaled reading,
   exactly what compute() returns for that example, and steps 1 to 11 (index 0 to 10) are a made-up history (the
   charge scaled up on a fixed schedule) with the engine's own compute() run on it at every step, so the chain at
   each step is real arithmetic over mock input -- this file changes none of that, the schedule below is copied
   from extract.js unchanged. Second, and new: every saboteur-to-complex, complex-to-hyper-complex and
   hyper-complex-to-super-complex link, and every saboteur's own address parts, are read off a real graph built by
   atuned_src/engine/trace.js's traceFromRecord(), through its own traceNeighbors(), at every one of those 12 steps
   -- not reimplemented by hand here and not carried over from a frozen dump. The fetter a saboteur draws on is the
   one piece that is a derived aggregate rather than a single real edge, because trace.js's own chain has no
   fetter-to-saboteur edge: a saboteur's parts are addresses, never a fetter (THE CHAIN, trace.js). That aggregate
   is computed here from real per-address data (traceNeighbors' pattern-to-fetter associated_with edges, which is
   how NODES[].cf, the canonical membership, surfaces on the graph) and shipped as this file always shipped it, a
   weighted list of which fetters a saboteur's real addresses belong to. obs.js's own fetter/saboteur linking math
   is unchanged; only what it is fed changes.

   Also new: every person here reaches every rung engine/trace.js supports, not just hyper complex. Tomas's own
   canonical profile (no axes raised by hand) reaches a real super complex from entry 6 of 12 onward -- the old
   dump's sup:1 at those steps was this same fact, just discarded one field short of being useful. This file does
   not invent a record that reaches the top rung: it reads real compute() output for the six people this mockup
   already uses, the same way extract.js always did. */
const fs=require('fs'),path=require('path');
const E=require(path.resolve(__dirname,'..','..','engine.js'));
const WHO=['Sofia','Marcus','Derek','Tomas','Wren','Rosa'];
const r2=v=>Math.round(v*100)/100;
const sm=x=>x*x*(3-2*x), cl=(v,a,b)=>v<a?a:v>b?b:v;

/* the profile for person i at ramp fraction u (0 at entry 1, 1 at entry 12), engine/schema.js's own axes shape.
   This is loadP(i)'s engine-level half: soul plus per-fetter held/opp. loadP itself (atuned_src/ui/personas.js)
   also does S.who, S.pin, seedIntake and lawsFor, none of which compute() or traceFromRecord read, and it writes
   straight onto the shared S rather than through a profile -- a real route (CLAUDE.md: "the impure core"), but
   not the one trace.js's own tests build their fixtures through. blankProfile + p.axes + validateProfile is: the
   same route tests/trace.js's worked() and loadedRec() use for their own fixtures, and the one that produces a
   profile traceFromRecord can be handed directly. */
function profileAt(person,u,last){
 const p=E.blankProfile(person.nm);
 p.soul={doms:[person.dom],arcs:[person.a1,person.a2],roots:[]};
 E.CHILD.forEach(c=>{
  const held0=(person.c&&person.c[c.nm]!==undefined)?person.c[c.nm]:0, opp0=(person.rep&&person.rep[c.nm])||0;
  if(last){p.axes[c.nm]={held:r2(held0),opp:r2(opp0)}; return;}
  const f=E.CHILD.indexOf(c), o=((f*5)%9)/9*.45, lv=sm(cl((u-o)/.55,0,1));
  const wob=.2*Math.sin(Math.PI*2*(1.7*u+f*.37))*(1-u)*Math.min(1,lv*3);
  const k=cl(lv+wob,0,1);
  p.axes[c.nm]={held:r2(held0*k),opp:r2(opp0*k)};});
 return p;}

/* every (lo,hi) 'supports' pair traceNeighbors reports for a chain node, real and only real: the chain's own
   rule, pattern -> saboteur -> complex -> hyper_complex -> super_complex, each step one call. */
function realParts(g,key){
 return E.traceNeighbors(g,key,'supports').filter(x=>x.dir==='in').map(x=>E.traceSplit(x.key).id);}
/* the fetter(s) a real address belongs to, off the one real edge that carries it: pattern associated_with
   pattern, known, canonical NODES[].cf membership (trace.js, THE CHAIN's own comment on why a fetter is not a
   chain rung). */
function fetterOf(g,addrId){
 const e=E.traceNeighbors(g,'pattern:'+addrId,'associated_with').find(x=>x.dir==='out');
 return e?E.traceSplit(e.key).id.replace(/^fetter:/,''):null;}

function buildPersonStep(person,j,K){
 const u=K>1?j/(K-1):1, last=j===K-1;
 const p=profileAt(person,u,last);
 const v=E.validateProfile(JSON.parse(JSON.stringify(p)));
 if(!v.ok)throw new Error(person.nm+' step '+j+' failed the boundary: '+JSON.stringify(v.errs));
 const profile=v.profile;
 const RD=E.read(JSON.parse(JSON.stringify(profile))).reading;
 const g=E.traceFromRecord(profile,undefined,RD);
 if(g.refused.length)throw new Error(person.nm+' step '+j+': the derived graph refused '+JSON.stringify(g.refused).slice(0,300));
 const nodeOf=(t,id)=>g.nodes.find(n=>n.type===t&&n.id===id);
 const idToSlot={}; E.W.forEach((n,slot)=>{idToSlot[String(n.i)]=slot;});
 const addrSlots=addrIds=>addrIds.map(id=>idToSlot[id]).filter(s=>s!==undefined);
 const sab=RD.sabs.map(s=>{const n=nodeOf('saboteur',s.nm)||{};
  return {nm:s.nm, w:typeof n.w==='number'?n.w:r2(s.w), over:!!n.over, hcx:n.family||s.hcx,
   parts:addrSlots(realParts(g,'saboteur:'+s.nm))};});
 const cx=RD.cxs.map(c=>{const n=nodeOf('complex',c.nm)||{};
  return {nm:c.nm, w:typeof n.w==='number'?n.w:r2(c.w), over:!!n.over, hcx:n.family||c.hcx,
   parts:realParts(g,'complex:'+c.nm)};});
 const hy=RD.hys.map(h=>{const n=nodeOf('hyper_complex',h.nm)||{};
  return {nm:h.nm, w:typeof n.w==='number'?n.w:r2(h.w), over:!!n.over,
   parts:realParts(g,'hyper_complex:'+h.nm)};});
 const sup=RD.sups.map(u2=>{const n=nodeOf('super_complex',u2.nm)||{};
  return {nm:u2.nm, w:typeof n.w==='number'?n.w:r2(u2.w),
   parts:realParts(g,'super_complex:'+u2.nm)};});
 /* THE ASSERTION ON THE OTHER SIDE (working rules, rule 1). Every super complex this step produced really is
    four real 'supports' hops from some real address, walked by tracePath against the same graph, not assumed
    from the parts lists above agreeing with each other. */
 sup.forEach(u2=>{
  const hy0=hy.find(h=>h.nm===u2.parts[0]), cx0=hy0&&cx.find(c=>c.nm===hy0.parts[0]), sb0=cx0&&sab.find(s=>s.nm===cx0.parts[0]);
  const addrId=sb0&&E.W[sb0.parts[0]]&&E.W[sb0.parts[0]].i;
  if(addrId===undefined)throw new Error(person.nm+' step '+j+': super complex '+u2.nm+' has no address to walk from');
  const walk=E.tracePath(g,'pattern:'+addrId,'super_complex:'+u2.nm);
  if(!walk||walk.length!==4)throw new Error(person.nm+' step '+j+': tracePath found no real 4 step walk from address '
   +addrId+' to super complex '+u2.nm+', got '+JSON.stringify(walk));});
 const ch=E.CHILD.map(c=>profile.axes[c.nm].held);
 const q=E.W.map(n=>r2(n.sq));
 return {ch:ch, q:q, sab:sab, cx:cx, hy:hy, sup:sup, dq:r2(RD.DQ), cq:r2(RD.CQ),
  _cf:E.W.map(n=>n.cf||null), _addrName:E.W.map(n=>n.k), _band:E.W.map(n=>n.b), _addrId:E.W.map(n=>n.i)};}

function buildPerson(nm){
 const person=E.PEOPLE.find(p=>p.nm===nm);
 if(!person)throw new Error('no such person in PEOPLE: '+nm);
 const K=12, steps=[]; for(let j=0;j<K;j++)steps.push(buildPersonStep(person,j,K));
 const last=steps[K-1];
 return {steps:steps.map(s=>({ch:s.ch,q:s.q,sab:s.sab,cx:s.cx,hy:s.hy,sup:s.sup,dq:s.dq,cq:s.cq})),
  cf:last._cf, addrName:last._addrName, band:last._band, addrId:last._addrId};}

function buildAll(){
 const HCX_LIB=E.HCX_LIB, FAM_POLE=E.FAM_POLE;
 const families={}; HCX_LIB.forEach(h=>{families[h.nm]=h.d; families[FAM_POLE[h.nm]]='the fix for '+h.nm.toLowerCase()+', done past the point where it helps';});
 const people={}; WHO.forEach(nm=>{people[nm]=buildPerson(nm);});
 return {families:families, famPole:FAM_POLE, people:people};}

module.exports={buildPerson:buildPerson,buildPersonStep:buildPersonStep,buildAll:buildAll,
 profileAt:profileAt,realParts:realParts,fetterOf:fetterOf,WHO:WHO};

if(require.main===module){
 const out=buildAll();
 out.stamp=(function(){try{const {execSync}=require('child_process');
   return execSync('git rev-parse --short HEAD',{cwd:__dirname}).toString().trim()+' '+new Date().toISOString().replace('T',' ').replace(/\.\d+Z$/,'Z');}
  catch(e){return 'unstamped '+new Date().toISOString();}})();
 fs.writeFileSync(path.join(__dirname,'chain.js'),
  '/* Real engine chain, built by build-trace.js straight from atuned_src/engine, no browser (build '+out.stamp+').\n'
  +'   Steps 1 to 11 of each person are a MOCK history (the charge is scaled up on a fixed schedule); step 12 is\n'
  +'   the real reading. Every link, at every step, including the nerve/address parts under each saboteur and the\n'
  +'   super complex above each hyper complex when the reading reaches one, is read off a real traceFromRecord()\n'
  +'   graph through traceNeighbors()/tracePath(), not hand built. See build-trace.js. */\n'
  +'window.OBS='+JSON.stringify(out)+';\n');
 WHO.forEach(nm=>{const s=out.people[nm].steps; console.log(nm,s.map(x=>x.sab.length+'/'+x.cx.length+'/'+x.hy.length+'/'+x.sup.length).join(' '));});
 console.log(out.stamp);}
