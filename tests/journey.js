/* Journey gate, the read half. engine/journey.js and engine/data/onboarding.js:
   journeyRead and onbMiniPlan, the two pure reads F5 in
   REVIEW-funnel/FINAL-SPEC.md lands from 3869d96. The record half of that
   commit (runs, log, gift counter, integrity answers, claim) is F13 and its
   suites land with it.

   Run from tests/engine.js by one line, with that file's own ok() and g(), or
   on its own: node tests/journey.js. Headless, from the repo root.

   EVERY SUITE IS A FUNCTION OF AN ENGINE, so the same assertions run twice:
   against the real engine, where every one must pass, and against copies of
   engine.js with one rule deliberately broken, where the suite that guards
   that rule must fail. A gate that cannot fail is not a gate. The loader is
   checked on an unbroken copy first.

   The mini suite is the one written at 3869d96, kept assertion for assertion,
   with the found counts the card now prints added at the end. The read suite
   is cut to what the current record can answer; the assertions that need a
   run log moved out with the log. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const ROOT=process.cwd();
const ENGINE_FILE=path.resolve(ROOT,process.env.ENGINE||'engine.js');
const DAY=86400000, T0=Date.now();
const at=d=>new Date(T0+d*DAY).toISOString();
const J=x=>JSON.stringify(x);

/* a person who has opened three addresses across the four channels, which is
   twelve lines of new ground, so the gift is at twelve of a hundred. Addresses
   are the first six somatic nodes that carry a fetter. */
function addrs(E,n){return E.W.filter(x=>x.cf).slice(0,n||6).map(x=>x.i);}
function fixture(E,open){
 const p=E.blankProfile('Test person');
 const ids=addrs(E,6), k=open===undefined?3:open;
 if(k){const keys=E.meterPlan(p,ids.slice(0,k),E.ONB_CHANS,k*4); E.meterRun(p,keys);}
 return p;}

const SUITES={

read(E,ok){
 const n=E.blankProfile('new');
 const r0=E.journeyRead(n);
 ok(r0.stage==='new'&&r0.first===true&&r0.runs.n===0&&r0.runs.known===true,'a blank record is a new person: '+J(r0));
 const s=E.blankProfile('storied'); s.story.entries.push({t:at(-1),text:'I keep taking care of everybody else.',imprints:0,bands:{}});
 ok(E.journeyRead(s).stage==='storied'&&E.journeyRead(s).first===true,'a story and no release is storied, and still a first run');
 /* THE LEGACY RECORD. It has used the product, never counted its runs, and onboarding must not treat it as new. */
 const l=fixture(E,3); l.story.entries.push({t:at(-90),text:'x',imprints:1,bands:{}});
 const rl=E.journeyRead(l);
 ok(l.meter.first&&rl.stage==='continuing'&&rl.first===false,'a record with a first line spoken is continuing, not a first run');
 ok(rl.runs.known===false&&rl.runs.n===0,'and its count of releases is unknown and not nought: '+J(rl.runs));
 const intakeOnly=E.blankProfile('i'); intakeOnly.intake.completedAt=at(-9);
 ok(E.journeyRead(intakeOnly).stage==='continuing','a finished intake alone is continuing');
 const rit=E.blankProfile('r'); rit.rituals.push({t:at(-9)});
 ok(E.journeyRead(rit).stage==='continuing','and so is a ritual');
 /* it writes nothing, and it never throws */
 const before=J(l); E.journeyRead(l); ok(J(l)===before,'a read writes nothing');
 let threw=null; [undefined,null,{},{story:null},{meter:null},{story:{entries:'x'}}].forEach(x=>{try{E.journeyRead(x);}catch(e){threw=e.message;}});
 ok(!threw,'and it does not throw on a record that is missing parts: '+threw);
 /* NOTHING IS STORED. The port lands no record field, so the blank and the
    boundary are exactly what they were. */
 ok(!('journey' in E.blankProfile('b')),'the blank profile carries no journey field: the record half is F13');
},

mini(E,ok){
 const p=fixture(E,0), ids=addrs(E,8);
 const stated=ids.map((id,i)=>({node:id,stated:true,inferred:false,amt:9-i}));
 const before=J(p);
 const m=E.onbMiniPlan(p,{unread:false,addrs:stated},at(0));
 ok(m.ok&&m.addrs.length===3&&m.lines===12&&m.keys.length===12,'a story that read plans three addresses and twelve lines: '+J({a:m.addrs&&m.addrs.length,l:m.lines}));
 ok(m.lines===E.ONB_MINI_ADDRS*E.RUN_MIN,'and twelve is the ruled three addresses at four lines each, read off the tables');
 ok(m.lines%E.RUN_MIN===0,'a whole number of addresses, so a multiple of four');
 ok(J(m.addrs)===J(ids.slice(0,3)),'in the order the reading weighed them');
 ok(m.keys.every(k=>/^\d+:[LR](limit|truth):\d+$/.test(k)),'each line is a key at an address');
 ok(m.addrs.every(a=>E.ONB_CHANS.every(c=>m.keys.some(k=>k.indexOf(a+':'+c+':')===0))),'and every address has all four channels, so none is cut');
 ok(m.keys.every(k=>p.meter.unique.indexOf(k)<0),'and every line is new ground');
 ok(m.cap===E.meterBudget(p,at(0)).cap&&m.lines<=m.cap,'and it is inside what the allowance leaves');
 ok(J(p)===before,'planning writes nothing to the record');
 ok(J(E.onbMiniPlan(p,{unread:false,addrs:stated},at(0)))===J(m),'the same record and the same signal give the same plan');
 const keys=E.meterPlan(p,m.addrs,E.ONB_CHANS,12);
 ok(J(keys)===J(m.keys),'and the plan is exactly what the meter would plan for those addresses');
 const w=E.blankProfile('w'); const r=E.meterRun(w,m.keys);
 ok(r.fresh.length===12&&w.meter.unique.length===12,'running it opens twelve lines of new ground');
 /* the signal's shapes */
 ok(J(E.onbMiniPlan(p,{imprints:stated},at(0)).addrs)===J(m.addrs),'a parseStory style imprints list is read the same as addrs');
 ok(J(E.onbMiniPlan(p,{addrs:ids},at(0)).addrs)===J(m.addrs),'and a bare list of ids');
 ok(E.onbMiniPlan(p,{addrs:[ids[0],ids[0],ids[1]]},at(0)).addrs.length===2,'an address named twice is planned once');
 ok(E.onbMiniPlan(p,{addrs:[999999,'x',null,-3]},at(0)).why==='unread','ids that are not addresses read as nothing');
 const anchor=E.NODES.filter(n=>!n.cf)[0];
 if(anchor)ok(E.onbMiniPlan(p,{addrs:[anchor.i]},at(0)).ok===false,'a field anchor with no fetter is not an address a run can open');
 /* unread plans nothing */
 const u=E.onbMiniPlan(p,{unread:true,addrs:stated},at(0));
 ok(u.ok===false&&u.why==='unread','an unread signal plans nothing, even with addresses on it: '+J(u));
 ok(E.onbMiniPlan(p,{unread:false,addrs:[]},at(0)).why==='unread'&&E.onbMiniPlan(p,null,at(0)).why==='unread','and so does an empty one, or none');
 ok(E.onbMiniPlan(null,{addrs:stated},at(0)).why==='no record','no record is refused and does not throw');
 /* the order: stated first, then the seat's, then the inferred, each in the reading's own order */
 const mix=[{node:ids[0],inferred:true},{node:ids[1],stated:false,inferred:false},{node:ids[2],stated:true},{node:ids[3],inferred:true},{node:ids[4],stated:true}];
 const mo=E.onbMiniPlan(p,{addrs:mix},at(0));
 ok(J(mo.addrs)===J([ids[2],ids[4],ids[1]])&&mo.inferred===0,'stated first, then the unstated: '+J(mo.addrs));
 const mi=E.onbMiniPlan(p,{addrs:[mix[0],mix[1],mix[3]]},at(0));
 ok(J(mi.addrs)===J([ids[1],ids[0],ids[3]])&&mi.inferred===2,'an inferred address goes last and the plan says how many it holds: '+J({a:mi.addrs,i:mi.inferred}));
 /* fewer than three addresses to take */
 const two=E.onbMiniPlan(p,{addrs:stated.slice(0,2)},at(0));
 ok(two.ok&&two.addrs.length===2&&two.lines===8,'two addresses read is a plan of two, eight lines');
 /* THE ALLOWANCE. A whole address or none, and never past what is left. Over
    ten left it is the gift's own remainder; at ten and under it is the first
    free week's ten less what was spent past the gift. */
 const mk=(left)=>{const q=fixture(E,0); q.meter.unique=[];
  const n=left>10?E.GIFT_N-left:E.GIFT_N+(10-left);
  for(let i=0;i<n;i++)q.meter.unique.push('seed'+i+':Rlimit:0'); q.meter.lines=n; return q;};
 [[100,12,3],[11,8,2],[10,8,2],[8,8,2],[7,4,1],[4,4,1]].forEach(([left,lines,n])=>{
  const q=mk(left), r=E.onbMiniPlan(q,{addrs:stated},at(0));
  ok(r.ok&&r.lines===lines&&r.addrs.length===n&&r.lines<=left,'with '+left+' left the plan is '+n+' addresses, '+lines+' lines: '+J({l:r.lines,a:r.addrs&&r.addrs.length}));});
 [3,1,0].forEach(left=>{
  const q=mk(left), r=E.onbMiniPlan(q,{addrs:stated},at(0));
  ok(r.ok===false&&r.why==='allowance','with '+left+' left there is no whole address to plan, and it is refused as the allowance: '+J(r));});
 const sp=fixture(E,0); sp.meter.unique=[]; for(let i=0;i<E.GIFT_N;i++)sp.meter.unique.push('seed'+i+':Rlimit:0');
 sp.meter.giftAt=at(-1); sp.meter.lines=100;
 const sr=E.onbMiniPlan(sp,{addrs:stated},at(0)), bud=E.meterBudget(sp,at(0));
 ok((sr.ok&&sr.lines<=bud.cap)||(sr.ok===false&&bud.cap<E.RUN_MIN),'on the free tier the plan is inside the week\'s allowance: '+J({l:sr.lines,cap:bud.cap}));
 /* ground already open is not offered again */
 const open=fixture(E,0);
 const all=E.meterPlan(open,[ids[0]],E.ONB_CHANS,4); E.meterRun(open,all);
 const fullyOpen=E.blankProfile('f'); const lines=[]; for(let i=0;i<50;i++)E.ONB_CHANS.forEach(c=>lines.push(ids[0]+':'+c+':'+i));
 fullyOpen.meter.unique=lines.slice();
 fullyOpen.plan={tier:'three',status:'active',granted:1200,carried:0,base:100,since:null,until:null};
 const nf=E.onbMiniPlan(fullyOpen,{addrs:[{node:ids[0],stated:true}]},at(0));
 ok(nf.ok===false,'an address with nothing left to open is not planned: '+J(nf));
 const skip=E.onbMiniPlan(fullyOpen,{addrs:[{node:ids[0],stated:true},{node:ids[1],stated:true}]},at(0));
 ok(skip.ok&&J(skip.addrs)===J([ids[1]]),'and the next address is planned instead');
 const part=E.onbMiniPlan(open,{addrs:[{node:ids[0],stated:true}]},at(0));
 ok(part.ok&&part.keys.every(k=>all.indexOf(k)<0),'an address with some lines open is planned at its next unopened line');
 /* WHAT WAS FOUND, BESIDE WHAT WAS TAKEN, for the card. Eight read, three
    taken, five waiting, and the inferred ones counted across all eight. */
 const eight=ids.map((id,i)=>({node:id,stated:i===5,inferred:i%2===0}));
 const fe=E.onbMiniPlan(p,{imprints:eight},at(0));
 ok(fe.ok&&fe.found===8&&fe.rest===5&&fe.addrs.length===3,'eight read is eight found, three taken and five more said: '+J({f:fe.found,r:fe.rest}));
 ok(fe.foundInferred===4,'and the inferred are counted across all that was found, not only those taken: '+fe.foundInferred);
 ok(fe.addrs[0]===ids[5],'the one address the words stated goes first, wherever the reading put it');
 ok(fe.inferred===0&&J(fe.addrs)===J([ids[5],ids[1],ids[3]]),'and the named go before the inferred: '+J(fe.addrs));
 const un=E.onbMiniPlan(p,{unread:true,imprints:eight},at(0));
 ok(un.found===8&&un.foundInferred===4,'a refused plan still carries what was found, so a card can say it');
 /* a sniffer reading, end to end */
 if(typeof E.parseStory==='function'){
  const ps=E.parseStory('I felt tight in my chest when my boss yelled at me and I could not breathe.');
  const mp=E.onbMiniPlan(fixture(E,0),{unread:!ps.imprints.length,imprints:ps.imprints},at(0));
  ok(mp.ok&&mp.lines===12&&mp.found>3&&mp.rest===mp.found-3,'a real reading of more than three addresses is cut to three, twelve lines: '+J({ok:mp.ok,l:mp.lines,f:mp.found,i:mp.foundInferred}));}
},

/* WHAT CHANGED, AFTER A RELEASE. releaseVerify in engine/journey.js writes
   the answer as practice evidence, one record per address, and loopRead reads
   it back. System Congruency TDD section 15; CONGRUENCY-AUDIT.md's next task.
   What is held: the closed set is exactly the TDD's five, and anything
   else, a stored "skipped" included, is refused by name (a skip records
   nothing, see RV_METRIC); it writes all or nothing; the record
   survives the boundary on the way back in; no answer, "nothing changed"
   least of all, ever becomes a trace edge; and Your patterns shows it on the
   pattern's row as what was said, never as evidence for. */
verify(E,ok){
 const T='2026-10-02T10:00:00.000Z', ST='2026-10-02T09:58:00.000Z';
 const [a,b]=addrs(E,2);
 ok(J(E.RV_ANSWERS)===J(['feel_different','see_differently','something_moved','nothing_changed','not_sure']),
  'the five answers are the TDD\'s five, in its order: '+J(E.RV_ANSWERS));
 ok(E.RV_VALUES===undefined&&E.RV_SKIP===undefined,'and there is no second list beside them: a skip is not a stored value');
 ok(J(Object.keys(E.RV_SAY))===J(E.RV_ANSWERS)&&E.RV_ANSWERS.every(k=>typeof E.RV_SAY[k]==='string'&&E.RV_SAY[k].length>0),
  'every answer has its words in one table, and the table words nothing else');
 /* every value, positive, negative and uncertain alike, writes cleanly */
 E.RV_ANSWERS.forEach(v=>{
  const P0=E.practiceBlank(), before=J(P0);
  const r=E.releaseVerify(P0,v,[a,b],{story_t:ST},T);
  ok(r.ok&&r.ids.length===2&&r.P.evidence.length===2,v+' is written once per address: '+J(r.errs||r.ids));
  ok(J(P0)===before,v+': the object handed in is not touched');
  if(!r.ok)return;
  const e=r.P.evidence[0];
  ok(e.metric===E.RV_METRIC&&e.value===v&&e.pattern_id==='addr:'+a&&e.story_t===ST&&e.timestamp===T,
   v+' carries its metric, value, address, story and time: '+J({m:e.metric,v:e.value,p:e.pattern_id,s:e.story_t}));
  ok(e.source==='user'&&e.dimension==='affect'&&e.src==='known','and it is the person\'s own, about how it felt');
  ok(r.P.log.filter(x=>x.type==='EVIDENCE_RECORDED').length===2,'and the log says so, twice');});
 /* refused by name, and nothing written */
 [['banana','an unknown key'],['Something moved','the words in place of the key'],['improved','an outcome status'],[null,'no answer at all'],['skipped','a skip, which records nothing']].forEach(([v,what])=>{
  const P0=E.practiceBlank(), r=E.releaseVerify(P0,v,[a],null,T);
  ok(!r.ok&&r.P===P0&&r.P.evidence.length===0,what+' is refused and nothing is written');
  ok(!r.ok&&/release verification/.test(r.errs[0])&&r.errs[0].indexOf(J(v))>=0,what+' is refused by name: '+(r.errs&&r.errs[0]));});
 const none=E.releaseVerify(E.practiceBlank(),'not_sure',[],null,T);
 ok(!none.ok&&/none were given/.test(none.errs[0]),'an answer about no address is refused: '+(none.errs&&none.errs[0]));
 const half=E.releaseVerify(E.practiceBlank(),'not_sure',[a,999999],null,T);
 ok(!half.ok&&half.P.evidence.length===0,'one bad address refuses the whole answer, so half a run is never on the record');
 const noStory=E.releaseVerify(E.practiceBlank(),'nothing_changed',[a],null,T);
 ok(noStory.ok&&noStory.P.evidence[0].story_t===null,'a release with no story behind it carries none');
 /* THE RECORD SURVIVES THE BOUNDARY, every value */
 const p=fixture(E,0), keys=E.meterPlan(p,[a,b],E.ONB_CHANS,8); E.meterRun(p,keys);
 let P=p.practice;
 E.RV_ANSWERS.forEach((v,i)=>{const r=E.releaseVerify(P,v,[a,b],{story_t:ST},'2026-10-02T10:0'+i+':00.000Z'); P=r.P;});
 p.practice=P;
 const back=E.validateProfile(JSON.parse(J(p)));
 ok(back.ok,'a record carrying all five answers passes the boundary: '+J(back.errs||[]).slice(0,300));
 if(back.ok){
  const ev=back.profile.practice.evidence;
  ok(ev.length===10&&E.RV_ANSWERS.every(v=>ev.filter(e=>e.value===v).length===2),'and every answer is still on it, at both addresses');
  ok(ev.every(e=>e.story_t===ST),'and every one still names its story');}
 /* the boundary refuses a sixth value, a stored skip among them, and a
    verification nobody gave */
 ['maybe','skipped'].forEach(v=>{
  const bad=JSON.parse(J(p)); bad.practice.evidence[0].value=v;
  const vb=E.validateProfile(bad);
  ok(!vb.ok&&vb.errs.some(x=>/release verification/.test(x)&&x.indexOf(J(v))>=0),'the boundary refuses '+J(v)+', outside the five, by name: '+J(vb.errs||[]).slice(0,200));});
 const sys=JSON.parse(J(p)); sys.practice.evidence[0].source='system';
 ok(!E.validateProfile(sys).ok,'and a verification whose source is not the person');
 const aff=JSON.parse(J(p)); aff.practice.evidence[0].dimension='effect';
 ok(!E.validateProfile(aff).ok,'and one written as evidence of effect, which self report is not');
 /* an older record, evidence with no story_t, still loads, filled with null */
 const old=JSON.parse(J(p)); old.practice.evidence.forEach(e=>{delete e.story_t;});
 const vo=E.validateProfile(old);
 ok(vo.ok&&vo.profile.practice.evidence.every(e=>e.story_t===null),'an older record with no story_t loads, read as null');
 /* NO VERIFICATION IS EVER AN EDGE. Checked against the known good case
    first: ordinary evidence about the same address does make one. */
 const other=E.practiceDo(E.practiceBlank(),'evidence_record',{source:'user',type:'internal',dimension:'effect',
  pattern_id:'addr:'+a,metric:'pain',value:3},T);
 const oi=E.practiceTraceIntents(other.P);
 ok(oi.some(i=>i.from.type==='evidence'&&i.to.id==='addr:'+a&&i.edge==='supports'),'the probe sees an edge where there is one: ordinary evidence supports its pattern');
 const vi=E.practiceTraceIntents(P);
 ok(vi.every(i=>i.from.type!=='evidence'&&i.to.type!=='evidence'),'five answers, nothing changed among them, emit no evidence intent at all: '+J(vi).slice(0,200));
 const g=E.traceFromRecord(back.ok?back.profile:p,vi);
 ok(!g.nodes.some(n=>n.type==='evidence'),'and the graph holds no evidence node for them');
 ok(!g.edges.some(e=>/^evidence:/.test(e.from)&&e.to==='pattern:'+a),'and no edge from evidence to the address the person said did not move');
 ok(!(g.gaps||[]).some(x=>/bears on nothing/.test(x.why||'')),'and no gap for evidence bearing on nothing');
 /* YOUR PATTERNS reads it on the row, as what was said */
 const L=E.loopRead(back.ok?back.profile:p);
 const row=L.patterns.find(x=>x.address===a);
 ok(!!row,'the address has a row in Your patterns');
 if(row){
  ok(row.said.n===5&&E.RV_ANSWERS.every(v=>row.said.by[v]===1),'and the row counts every answer once: '+J(row.said));
  ok(row.said.last==='not_sure','and the newest is the last one given');
  ok(row.evFor===0&&row.evAgainst===0,'and none of it is counted as evidence for or against');
  ok(row.state==='unanswered','and an answer about a release does not confirm the pattern');}
 const L1=E.loopRead(fixture(E,0));
 ok(L1.patterns.every(x=>x.said.n===0),'a record with no answer shows none');
}};

/* ============================================================
   THE MUTANTS. Each one breaks one rule in a copy of engine.js, and the suite
   that guards that rule must fail on it. The text to break must be in the
   engine exactly once.
   ============================================================ */
const MUTANTS=[
 {suite:'mini', what:'the plan cuts an address in half',
  from:"var keys=meterPlan(p,ids,ONB_CHANS,ids.length*RUN_MIN);", to:"var keys=meterPlan(p,ids,ONB_CHANS,ids.length*RUN_MIN-1);"},
 {suite:'mini', what:'the plan ignores the allowance',
  from:"var whole=Math.min(ONB_MINI_ADDRS,Math.floor(cap/RUN_MIN));", to:"var whole=ONB_MINI_ADDRS;"},
 {suite:'mini', what:'the plan is not capped at three, which is the defect F5 fixes',
  from:"var whole=Math.min(ONB_MINI_ADDRS,Math.floor(cap/RUN_MIN));", to:"var whole=Math.floor(cap/RUN_MIN);"},
 {suite:'mini', what:'an unread story is given a plan',
  from:"if(sg.unread===true||!cand.length)return", to:"if(!cand.length)return"},
 {suite:'mini', what:'the plan spends ground that is already open',
  from:"var open=cand.filter(function(c){return meterPlan(p,[c.id],ONB_CHANS,RUN_MIN).length===RUN_MIN;});", to:"var open=cand;"},
 {suite:'mini', what:'the plan ignores stated against inferred',
  from:"cand.sort(function(a,b){return a.tier-b.tier||a.at-b.at;});", to:""},
 {suite:'mini', what:'the plan writes to the record',
  from:"return {ok:true, addrs:ids, keys:keys, lines:keys.length,", to:"p.meter.lines+=1; return {ok:true, addrs:ids, keys:keys, lines:keys.length,"},
 {suite:'mini', what:'the inferred are counted only among those taken',
  from:"var found=cand.length, foundInf=cand.filter(", to:"var found=cand.length, foundInf=cand.slice(0,3).filter("},
 {suite:'read', what:'a record in use reads as a first run',
  from:"var stage=prior?'continuing':(entries.length?'storied':'new');", to:"var stage=entries.length?'storied':'new';"},
 {suite:'verify', what:'a verification becomes a trace edge, so nothing changed reads as support',
  from:"if(e.pattern_id&&!prIsVerify(e))put('evidence'", to:"if(e.pattern_id)put('evidence'"},
 {suite:'verify', what:'the boundary accepts any value on a verification',
  from:"if(RV_ANSWERS.indexOf(x.value)<0)", to:"if(false)"},
 {suite:'verify', what:'the boundary takes a stored skip, the value the first cut wrote',
  from:"if(RV_ANSWERS.indexOf(x.value)<0)", to:"if(RV_ANSWERS.concat(['skipped']).indexOf(x.value)<0)"},
 {suite:'verify', what:'the link to the story entry is dropped on the way in',
  from:"'confidence','notes','story_t'].forEach(", to:"'confidence','notes'].forEach("},
 {suite:'verify', what:'Your patterns does not count the answers',
  from:"row.said.n++;", to:""},
 {suite:'verify', what:'an answer is counted as evidence for the pattern',
  from:"var t=typeOf(e.from), src=node[e.from];", to:"var t=typeOf(e.from), src=node[e.from]; if(row.said.n)row.evFor=row.said.n;"}];

function load(src){
 const ctx={module:{exports:{}}, console:console};
 vm.createContext(ctx); vm.runInContext(src,ctx,{filename:'engine-copy.js'});
 return ctx.module.exports;}
function count(suite,E){
 let f=0; const fails=[];
 try{ SUITES[suite](E,(c,m)=>{if(!c){f++; if(fails.length<2)fails.push(m);}}); }
 catch(e){ f++; fails.push('threw: '+((e&&e.message)||e)); }
 return {f:f, fails:fails};}

function run(E,ok,g,say){
 Object.keys(SUITES).forEach(n=>{
  g('JY · journey, '+n);
  try{ SUITES[n](E,ok,say); }catch(e){ ok(false,'the '+n+' suite threw: '+((e&&e.stack)||e)); }});
 g('JY · journey, the gate bites');
 const src=fs.readFileSync(ENGINE_FILE,'utf8');
 const clean=load(src), base={};
 Object.keys(SUITES).forEach(n=>{base[n]=count(n,clean).f;});
 ok(Object.keys(base).every(n=>base[n]===0),'an unbroken copy loaded the same way passes every suite: '+J(base));
 MUTANTS.forEach(m=>{
  const hits=src.split(m.from).length-1;
  ok(hits===1,'the text to break is in the engine exactly once ('+m.what+'), found '+hits);
  if(hits!==1)return;
  const r=count(m.suite,load(src.replace(m.from,m.to)));
  ok(r.f>0,'the '+m.suite+' suite fails when '+m.what+' ('+r.f+' failures, first: '+(r.fails[0]||'none')+')');});
 E.loadProfile(E.blankProfile('after the journey gate'));}
module.exports=run;
module.exports.SUITES=SUITES;

if(require.main===module){
 const E=require(ENGINE_FILE);
 let P=0,F=0;
 const ok=(c,m)=>{if(c){P++}else{F++;console.log('  FAIL  '+m)}};
 const g=n=>console.log('\n'+n);
 run(E,ok,g,console.log);
 console.log('\n===== '+P+' passed, '+F+' failed =====');
 process.exit(F?1:0);}
