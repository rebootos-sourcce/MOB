/* The trace summary gate, engine/tracesummary.js. Run from tests/engine.js,
   which hands it its own ok() and group printer, or alone:

     node tests/tracesummary.js

   WHAT IT CHECKS, AND WHY THIS WAY. traceSummary(g, node) narrates a node's
   real parents and real children; the one way that check fails silently is
   to trust the function's own word for what it found. So every group below
   that claims a real connection re-derives it a second, independent way
   before trusting the summary that cites it: traceNeighbors on a freshly
   rebuilt graph for the same person (never the graph traceSummary itself was
   handed), or tracePath, or the raw library row (BY, SABDEF, SABCARD,
   HCX_LIB) the content is supposed to have come from. The same discipline
   PR #157's own tests/layer-observatory.js LO1 states directly: "all from
   scratch (not by trusting its own internal assertion)."

   THE FIXTURES. The same six reference people mockups/layer-observatory/
   build-trace.js (PR #157, branch feature/layer-observatory-on-trace-2026-
   10-29) already reads from PEOPLE for this exact purpose: each one's own
   .c (the charge already held on each axis) and .rep (its own repair) read
   straight into p.axes, through blankProfile + soul + validateProfile, the
   same route tests/trace.js's own worked() and loadedRec() build their
   fixtures through, just fed from PEOPLE's own numbers instead of typed-in
   ones or a maxed-out override. That is deliberate: it is each person's own
   real, un-raised reading, the "step 12" PR #157's build-trace.js calls
   it, not a shape invented for this file. Measured on this engine, without
   raising one axis by hand: Tomas alone already reaches every rung real
   trace.js supports, saboteur through super complex, which is why most
   groups below read off Tomas, and TG-TS7 still proves the maxed route
   (every CHILD axis held at 7, tests/trace.js's own loadedRec()) works for
   whichever rung a plain reading does not reach on a given run. */
const path=require('path');

function realProfile(E,nm){
 const person=E.PEOPLE.find(p=>p.nm===nm);
 if(!person)return null;
 const p=E.blankProfile(nm);
 p.soul={doms:[person.dom],arcs:[person.a1,person.a2],roots:[]};
 E.CHILD.forEach(c=>{
  const held=(person.c&&person.c[c.nm]!==undefined)?person.c[c.nm]:0;
  const opp=(person.rep&&person.rep[c.nm])||0;
  p.axes[c.nm]={held,opp};});
 const v=E.validateProfile(JSON.parse(JSON.stringify(p)));
 return v.ok?v.profile:null;}

function maxedProfile(E,nm){
 const p=realProfile(E,nm); if(!p)return null;
 E.CHILD.forEach(c=>{p.axes[c.nm]={held:7,opp:0};});
 const v=E.validateProfile(JSON.parse(JSON.stringify(p)));
 return v.ok?v.profile:null;}

/* a fresh read and a fresh traceFromRecord, every time: nothing here is
   ever reused between what traceSummary was handed and what a test
   independently checks it against. */
function graphOf(E,p){
 const {reading}=E.read(JSON.parse(JSON.stringify(p)));
 const g=E.traceFromRecord(p,undefined,reading);
 return {reading,g};}

const WHO=['Sofia','Marcus','Derek','Tomas','Wren','Rosa'];
const has=(s,frag)=>typeof s==='string'&&s.indexOf(frag)>=0;
const firstNode=(g,type,pred)=>g.nodes.find(n=>n.type===type&&(!pred||pred(n)));
/* the chain's own direction, independently: 'in' is a real child, 'out' is
   the real parent, the same convention mockups/layer-observatory/build-
   trace.js's realParts() states and tests/trace.js's TG11c already proves
   against a real tracePath. Re-stated here so this file never has to trust
   traceSummaryParts (private to engine/tracesummary.js, not exported) for
   its own cross check. */
function realChildIds(g,key){
 return E_.traceNeighbors(g,key,'supports').filter(x=>x.dir==='in').map(x=>E_.traceSplit(x.key).id);}
function realParentIds(g,key){
 return E_.traceNeighbors(g,key,'supports').filter(x=>x.dir==='out').map(x=>E_.traceSplit(x.key).id);}
let E_=null; /* set per call so the two tiny helpers above do not need E threaded through */

function suite(E,ok,g){
 E_=E;
 const profiles={}, graphs={};
 WHO.forEach(nm=>{profiles[nm]=realProfile(E,nm); graphs[nm]=profiles[nm]&&graphOf(E,profiles[nm]);});

 g('TS1 · a bad node, a bad graph and a missing key are refused by name, never thrown');
 const G0=graphs.Tomas.g;
 ok(!E.traceSummary({not:'a graph'},'pattern:1').ok,'not a graph is refused');
 ok(!E.traceSummary(G0,'nonsense:doesnotexist').ok,'a type nothing resolves is refused by traceRef');
 ok(!E.traceSummary(G0,{type:'pattern',id:'99999'}).ok,'an address not on this graph is refused');
 ok(!E.traceSummary(G0,null).ok,'a null node is refused, not thrown');
 const okReal=E.traceSummary(G0,firstNode(G0,'pattern').type+':'+firstNode(G0,'pattern').id);
 ok(okReal.ok===true,'a real node on a real graph is accepted');

 g('TS2 · an address: real coherent/distorted content, real saboteur parents, no children, every claim cross checked');
 WHO.forEach(nm=>{
  const {g:gr}=graphs[nm];
  const addr=firstNode(gr,'pattern',n=>!/^fetter:/.test(n.id)&&realParentIds(gr,'pattern:'+n.id).length>0);
  if(!addr)return;
  const row=E.BY[+addr.id];
  const r=E.traceSummary(gr,'pattern:'+addr.id);
  ok(r.ok&&r.node.type==='pattern'&&r.node.card.found===true,nm+': a real address resolves real content');
  ok(r.node.card.fields.coherent===row.a&&r.node.card.fields.distorted===row.d,
   nm+': the address content is exactly NODES[].a/.d for '+row.k+', not a paraphrase');
  ok(r.children.length===0,nm+': an address has no real child, the chain’s own floor');
  const freshParents=realParentIds(graphs[nm].g,'pattern:'+addr.id).sort();
  const gotParents=r.parents.map(x=>x.id).sort();
  ok(JSON.stringify(freshParents)===JSON.stringify(gotParents)&&freshParents.length>0,
   nm+': every real parent traceSummary reports matches a fresh traceNeighbors on an independently rebuilt graph, got '
   +JSON.stringify(gotParents)+' vs '+JSON.stringify(freshParents));
  ok(has(r.summary,row.k)&&has(r.summary,row.a)&&has(r.summary,row.d),
   nm+': the paragraph names the address and quotes its real a and d, not an invented line');
  r.parents.forEach(pt=>{
   const def=E.SABDEF[E.KB_KEY(pt.id.replace(/ overshot$/,''))];
   if(def)ok(has(r.summary,def.q)||r.summary.indexOf(pt.card.label)>=0,
    nm+': parent saboteur '+pt.id+' is at least named in the paragraph');});});

 g('TS3 · a saboteur: real says/lived-behaviour content, real address children, cross checked against SABDEF/SABCARD directly');
 let sabChecked=0;
 WHO.forEach(nm=>{
  const {reading:rd,g:gr}=graphs[nm];
  (rd.sabs||[]).forEach(s=>{
   if(sabChecked>=4)return;
   const r=E.traceSummary(gr,'saboteur:'+s.nm);
   ok(r.ok,nm+': saboteur '+s.nm+' resolves on its own graph');
   const base=s.nm.replace(/ overshot$/,''), key=E.KB_KEY(base),
    def=E.SABDEF[key]||null, card=E.SABCARD[key]||null;
   if(def||card){
    ok(r.node.card.found===true,nm+': '+s.nm+' has a real card and traceSummary finds it');
    ok((!def||r.node.card.fields.says===def.q)&&(!card||r.node.card.fields.livedBehavior===card.h),
     nm+': '+s.nm+'’s resolved fields are exactly SABDEF.q/SABCARD.h, not reworded');
    const quoted=(def&&has(r.summary,def.q))||(card&&has(r.summary,card.h))||(card&&has(r.summary,card.a));
    ok(quoted,nm+': '+s.nm+'’s own real line appears in the paragraph verbatim, got: '+r.summary.slice(0,220));
   } else {
    ok(r.node.card.found===false&&typeof r.node.card.why==='string'&&r.node.card.why.length>0,
     nm+': '+s.nm+' has no card on file (an unnamed cluster or a non-SAB33 name) and traceSummary says so by name instead of inventing one');
    ok(has(r.summary,'carries nothing further on file'),
     nm+': the paragraph states the gap in words, not silence, for '+s.nm);
   }
   const freshKids=realChildIds(graphOf(E,profiles[nm]).g,'saboteur:'+s.nm).sort();
   const gotKids=r.children.map(x=>x.id).sort();
   ok(JSON.stringify(freshKids)===JSON.stringify(gotKids)&&freshKids.length>0,
    nm+': '+s.nm+'’s real address children match an independent traceNeighbors rebuild, got '+JSON.stringify(gotKids)+' vs '+JSON.stringify(freshKids));
   gotKids.forEach(id=>ok(!!E.BY[+id],nm+': every reported child of '+s.nm+' is one of the 112 addresses, got '+id));
   sabChecked++;});});
 ok(sabChecked>0,'at least one real saboteur was actually checked, not an empty loop passing vacuously');

 g('TS4 · a complex: no card of its own by design, real two-saboteur children, parent only when one is real');
 let cxChecked=0;
 WHO.forEach(nm=>{
  const {reading:rd,g:gr}=graphs[nm];
  (rd.cxs||[]).forEach(c=>{
   if(cxChecked>=3)return;
   const r=E.traceSummary(gr,'complex:'+c.nm);
   ok(r.ok&&r.node.card.found===false&&has(r.node.card.why,'two saboteurs compounded'),
    nm+': complex '+c.nm+' is reported as having no card of its own, by name, not a blank');
   ok(r.children.length===2,nm+': a complex has exactly two real saboteur children, got '+r.children.length);
   const freshKids=realChildIds(graphOf(E,profiles[nm]).g,'complex:'+c.nm).sort();
   ok(JSON.stringify(r.children.map(x=>x.id).sort())===JSON.stringify(freshKids),
    nm+': '+c.nm+'’s children match an independent rebuild');
   r.children.forEach(ch=>{
    if(ch.card.found)ok(has(r.summary,ch.card.label),nm+': child saboteur '+ch.id+' is named in the paragraph');});
   const freshParents=realParentIds(graphOf(E,profiles[nm]).g,'complex:'+c.nm);
   ok(r.parents.length===freshParents.length,nm+': '+c.nm+'’s real parent count matches an independent rebuild ('+r.parents.length+' vs '+freshParents.length+')');
   if(!r.parents.length)ok(has(r.summary,'Nothing sits above it yet'),nm+': a complex with no real hyper complex parent says so honestly');
   cxChecked++;});});
 ok(cxChecked>0,'at least one real complex was actually checked');

 g('TS5 · a hyper complex: real HCX_LIB family line, real complex children');
 let hyChecked=0;
 WHO.forEach(nm=>{
  const {reading:rd,g:gr}=graphs[nm];
  (rd.hys||[]).forEach(h=>{
   if(hyChecked>=3)return;
   const r=E.traceSummary(gr,'hyper_complex:'+h.nm);
   const row=E.HCX_LIB.find(x=>x.nm===h.nm);
   if(row){
    ok(r.node.card.found===true&&r.node.card.fields.familyLine===row.d&&r.node.card.fields.clinicalCorrespondence===(row.sub||null),
     nm+': hyper complex '+h.nm+'’s resolved fields are exactly HCX_LIB.d/.sub');
    ok(has(r.summary,row.d),nm+': '+h.nm+'’s real family line appears in the paragraph verbatim');
   } else {
    ok(r.node.card.found===false,nm+': an overshoot family name with no HCX_LIB row of its own is reported as not found, never borrowed from the family it overshoots');
   }
   const freshKids=realChildIds(graphOf(E,profiles[nm]).g,'hyper_complex:'+h.nm).sort();
   ok(JSON.stringify(r.children.map(x=>x.id).sort())===JSON.stringify(freshKids)&&freshKids.length>0,
    nm+': '+h.nm+'’s real complex children match an independent rebuild');
   hyChecked++;});});
 ok(hyChecked>0,'at least one real hyper complex was actually checked');

 g('TS6 · a super complex: no card of its own, real two-hyper-complex children, a real 4 hop address-to-super-complex path, nothing above it');
 const tomasReal=graphs.Tomas;
 const realSup=(tomasReal.reading.sups||[])[0];
 ok(!!realSup,'Tomas’s own plain reading reaches a real super complex with no axis raised by hand (matches PR #157’s own build-trace.js header)');
 if(realSup){
  const r=E.traceSummary(tomasReal.g,'super_complex:'+realSup.nm);
  ok(r.ok&&r.node.card.found===false&&has(r.node.card.why,'two hyper complexes paired'),
   'the super complex is reported as having no card of its own, by name');
  ok(r.children.length===2,'a super complex has exactly two real hyper complex children, got '+r.children.length);
  const names=r.children.map(x=>x.id).sort();
  const freshKids=realChildIds(graphOf(E,profiles.Tomas).g,'super_complex:'+realSup.nm).sort();
  ok(JSON.stringify(names)===JSON.stringify(freshKids),'the super complex’s children match an independent rebuild, got '+JSON.stringify(names)+' vs '+JSON.stringify(freshKids));
  r.children.forEach(ch=>{
   ok(ch.card.found===true,'hyper complex child '+ch.id+' of the super complex resolves real HCX_LIB content');
   ok(has(r.summary,ch.card.fields.familyLine),'the super complex’s paragraph quotes hyper complex '+ch.id+'’s real family line verbatim');});
  ok(r.parents.length===0&&has(r.summary,'Nothing sits above it yet'),
   'a super complex has no real parent on this graph and the paragraph says so, never inventing an archetype above it (out of scope, item 1.14)');
  /* THE WALK, independently: a real 4 hop supports path from some real address
     under the first hyper complex's first complex's first saboteur's first
     address part, all the way to this super complex, the same proof PR
     #157's build-trace.js runs before it writes anything. */
  const hy0=tomasReal.reading.hys.find(h=>h.nm===names[0])||tomasReal.reading.hys.find(h=>h.nm===names[1]);
  const cx0=hy0&&tomasReal.reading.cxs.find(c=>c.nm===hy0.parts[0].nm);
  const sb0=cx0&&tomasReal.reading.sabs.find(s=>s.nm===cx0.parts[0].nm);
  const addrId=sb0&&sb0.parts[0]&&sb0.parts[0].i;
  ok(addrId!==undefined,'a real address under the super complex’s own chain was found to walk from');
  if(addrId!==undefined){
   const walk=E.tracePath(tomasReal.g,'pattern:'+addrId,'super_complex:'+realSup.nm);
   ok(!!walk&&walk.length===4,'tracePath finds a real 4 step walk from address '+addrId+' to the super complex, got '+JSON.stringify(walk));}}

 g('TS7 · the maxed route (tests/trace.js’s own loadedRec() pattern) still resolves a real summary at every rung, for whoever a plain reading does not reach');
 const maxed=maxedProfile(E,'Wren');
 ok(!!maxed,'Wren’s profile still validates with every CHILD axis held at 7');
 if(maxed){
  const {reading:rdm,g:gm}=graphOf(E,maxed);
  ok(rdm.sabs.length>0&&rdm.sups.length>0,'the maxed route reaches every rung on a person a plain reading did not ('+WHO.join(',')+' earlier)');
  const supm=rdm.sups[0];
  const rm=E.traceSummary(gm,'super_complex:'+supm.nm);
  ok(rm.ok&&rm.children.length===2&&typeof rm.summary==='string'&&rm.summary.length>0,
   'a real summary still resolves on the maxed fixture, children '+rm.children.length);}

 g('TS8 · the summary is one paragraph of plain prose: no em dash, no JSON leaking into it, always a string');
 WHO.forEach(nm=>{
  const {reading:rd,g:gr}=graphs[nm];
  const sample=(rd.sabs[0]&&'saboteur:'+rd.sabs[0].nm)||(firstNode(gr,'pattern')&&'pattern:'+firstNode(gr,'pattern').id);
  if(!sample)return;
  const r=E.traceSummary(gr,sample);
  ok(typeof r.summary==='string'&&r.summary.length>0,nm+': summary is a non empty string');
  ok(r.summary.indexOf('—')<0&&r.summary.indexOf('–')<0,nm+': no em dash or en dash in rendered prose (VOICE.md)');
  ok(r.summary.indexOf('[object')<0&&r.summary.indexOf('undefined')<0,nm+': no leaked object or undefined in the prose, got: '+r.summary.slice(0,160));});

 g('TS9 · grammar holds over every real chain node on all six people: no "a address", no "childs"');
 let graded=0;
 WHO.forEach(nm=>{
  const {reading:rd,g:gr}=graphs[nm];
  const keys=[].concat(
   (rd.sabs||[]).map(s=>'saboteur:'+s.nm),
   (rd.cxs||[]).map(c=>'complex:'+c.nm),
   (rd.hys||[]).map(h=>'hyper_complex:'+h.nm),
   (rd.sups||[]).map(s=>'super_complex:'+s.nm));
  keys.forEach(k=>{
   const r=E.traceSummary(gr,k);
   if(!r.ok)return;
   ok(r.summary.indexOf(' a address')<0,nm+' '+k+': never "a address", got: '+r.summary.slice(0,260));
   ok(r.summary.indexOf('childs')<0,nm+' '+k+': "children" is never spelled "childs", got: '+r.summary.slice(0,260));
   graded++;});});
 ok(graded>20,'grammar was actually checked across a real spread of nodes, not a token sample ('+graded+' checked)');
 /* THE REAL CASE THAT FOUND THIS. Sofia's own graph pairs two unnamed
    "Striker" saboteurs into a complex with neither carrying a card, which
    is exactly the branch that pluralized "child" as "childs" before this
    file's traceSummaryClause learned the real plural. Named so a future
    change cannot silently drop the one fixture that actually exercises it. */
 const striker=(graphs.Sofia.reading.cxs||[]).find(c=>/Striker/.test(c.nm));
 ok(!!striker,'Sofia’s real reading still pairs a Striker complex with neither saboteur carrying a card (the fixture this gate was written against)');
 if(striker){
  const r=E.traceSummary(graphs.Sofia.g,'complex:'+striker.nm);
  ok(r.ok&&has(r.summary,'the real children, but none carries further content on file'),
   'Sofia’s Striker complex reads "the real children", not "the real childs": '+r.summary.slice(0,260));}

 g('TS10 · traceSummarySet, the chain-local multi-select blend, over a real shift-click selection');
 ok(!E.traceSummarySet({not:'a graph'},['pattern:1']).ok,'not a graph is refused');
 ok(!E.traceSummarySet(G0,[]).ok,'an empty selection is refused, not silently narrated as one node');
 ok(!E.traceSummarySet(G0,null).ok,'a selection that is not an array is refused, not thrown');
 ok(!E.traceSummarySet(G0,['nonsense:doesnotexist','ghost:also-nothing']).ok,
  'a selection naming no real node at all on this graph is refused by name');
 if(realSup){
  const g2=tomasReal.g;
  const anchorKey='super_complex:'+realSup.nm;
  /* THE REAL SELECTION: the anchor plus every real node traceDescendants
     finds under it, the exact set a shift-click on the super complex
     builds (chainPinKey + traceDescendants, ui/ui.js). Checked against an
     independently rebuilt graph, the same discipline every group above
     already runs, never trusting traceSummarySet's own word for what it
     resolved. */
  const freshDesc=E.traceDescendants(graphOf(E,profiles.Tomas).g,anchorKey).sort();
  const desc=E.traceDescendants(g2,anchorKey).sort();
  ok(JSON.stringify(desc)===JSON.stringify(freshDesc)&&desc.length>0,
   'traceDescendants off the same anchor matches an independent rebuild, got '+JSON.stringify(desc)+' vs '+JSON.stringify(freshDesc));
  const keys=[anchorKey].concat(desc);
  const rs=E.traceSummarySet(g2,keys);
  ok(rs.ok&&Array.isArray(rs.members),'a real multi-node selection resolves');
  ok(rs.members.length===keys.length,
   'every real key in the selection resolves to a member, none silently dropped, got '+rs.members.length+' of '+keys.length);
  ok(rs.members.every(m=>keys.indexOf(m.key)>=0),'every resolved member is one of the keys actually handed in, nothing added');
  /* the full chain sits in one blend: a super complex (no card, by design),
     at least one hyper complex (real HCX_LIB family line) and at least one
     saboteur or address somewhere under it */
  const types=rs.members.map(m=>m.type);
  ok(types.indexOf('super_complex')>=0&&types.indexOf('hyper_complex')>=0&&types.indexOf('complex')>=0&&types.indexOf('saboteur')>=0,
   'the blend spans the real chain, super complex down through saboteur, got types: '+JSON.stringify(types));
  const hyMember=rs.members.find(m=>m.type==='hyper_complex'&&m.card.found);
  ok(!hyMember||has(rs.summary,hyMember.card.fields.familyLine),
   'a real hyper complex family line inside the blend is quoted verbatim in the paragraph, not paraphrased');
  ok(rs.summary.indexOf('The selection, blended across')===0,
   'a selection of more than one real node says so plainly, up front, got: '+rs.summary.slice(0,80));
  ok(has(rs.summary,String(rs.members.length)),'the paragraph names the real count it blended, not a vague "several"');
  ok(rs.summary.indexOf('—')<0&&rs.summary.indexOf('–')<0,'no em dash or en dash in the blended paragraph (VOICE.md)');
  ok(rs.summary.indexOf('[object')<0&&rs.summary.indexOf('undefined')<0,
   'no leaked object or undefined in the blended paragraph, got: '+rs.summary.slice(0,200));

  /* A STALE KEY ALONGSIDE REAL ONES IS DROPPED, NOT A HOLE. One bad member
     must never sink an otherwise real blend: the single-node traceSummary
     refuses a whole call on one bad key because it has only the one, a set
     with others still narrates them. */
  const withGhost=E.traceSummarySet(g2,keys.concat(['saboteur:this-does-not-exist']));
  ok(withGhost.ok&&withGhost.members.length===rs.members.length,
   'a stale key mixed into an otherwise real selection is dropped silently, the rest still narrated');

  /* ONE SELECTED NODE, the degenerate case: the same shape as a plain
     click before any shift-click widened it, and it still blends (of one),
     reading close to traceSummary's own single-node voice rather than a
     different mechanism entirely. */
  const one=E.traceSummarySet(g2,[anchorKey]);
  ok(one.ok&&one.members.length===1&&one.summary.indexOf('The selection is')===0,
   'exactly one real key still resolves and narrates, phrased for one rather than "blended across 1 real nodes"');}

 g('TS11 · privacy and the fuzz, the same discipline TG14 runs on trace.js itself');
 {
  const junk=[undefined,null,0,'x',[],{},{nodes:5,edges:'e'},{nodes:[null],edges:[null]}];
  let threw=null;
  junk.forEach(a=>junk.forEach(b=>{try{E.traceSummarySet(a,b);}catch(e){threw=threw||('traceSummarySet('+JSON.stringify(a)+','+JSON.stringify(b)+'): '+e.message);}}));
  ok(!threw,'traceSummarySet never throws on bad input'+(threw?': '+threw:''));
 }
}

module.exports=function run(E,ok,g){ suite(E,ok,g); };
if(require.main===module){
 const E=require(path.resolve(process.env.ENGINE||'engine.js'));
 let P=0,F=0;
 const ok=(c,m)=>{if(c)P++; else{F++; console.log('  FAIL  '+m);}};
 suite(E,ok,n=>console.log('\n'+n));
 console.log('\n===== '+P+' passed, '+F+' failed =====');
 process.exit(F?1:0);}
