/* Journey gate. engine/journey.js and engine/data/onboarding.js: journeyRead
   and onbMiniPlan, the two pure reads F5 in REVIEW-funnel/FINAL-SPEC.md landed
   from 3869d96, and the record half of that commit, F13: the walk a reload
   resumes from, the log, the gift's counter, what the first release made, and
   the claim packet with its boundary. The suites for the record are ported
   from 3869d96's own and adapted to what landed: the per run list and the
   integrity answers did not come across, so their suites did not either.
   tests/journey2.js walks the same record in a real browser.

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
const TDD_FILE=path.resolve(ROOT,'ATUNED-onboarding-first-experience-TDD.md');
const DAY=86400000, T0=Date.now();
const at=d=>new Date(T0+d*DAY).toISOString();
const J=x=>JSON.stringify(x);
const clone=x=>JSON.parse(JSON.stringify(x));

/* THE EVENT LIST IS READ OFF THE TDD, not typed here. A list typed twice is
   two lists that drift, and the document is the specification. The extractor
   is checked against a count it must find before anything is compared. */
const TDD=fs.existsSync(TDD_FILE)?fs.readFileSync(TDD_FILE,'utf8'):'';
function tddEvents(){
 const m=/^# 46\. Required Events\s*$/m.exec(TDD); if(!m)return null;
 const rest=TDD.slice(m.index+m[0].length), s=rest.indexOf('```text'); if(s<0)return null;
 const e=rest.indexOf('```',s+7);
 return rest.slice(s+7,e).split('\n').map(l=>l.trim()).filter(Boolean);}
/* what the boundary says about a record */
function verdict(E,o){const v=E.validateProfile(o); return {ok:v.ok, errs:v.errs||[], v:v};}
/* a walked record: a first run that picked a starting point, wrote and
   committed a story, handed off to a release and had it land, twelve lines of
   new ground at three addresses, and answered What changed. Built through the
   engine's own writers, the way the sheet builds it. */
function walked(E){
 const p=E.blankProfile('Walked');
 const ids=addrs(E,3), T=at(-1), ST=at(-1);
 E.journeyLog(p,'tutorial_started',null,{door:'onboarding'},T);
 E.journeyWalk(p,'ask',{},T);
 E.journeyLog(p,'ground_selected','anxiety',null,T);
 E.journeyGiftIssue(p,'app',T);
 p.story.entries.push({t:ST,text:'I felt tight in my chest when my boss yelled at me.',imprints:5,bands:{},
  ob:{pick:0,feel:1,place:3,yes:ids.slice(),no:[]}});
 E.journeyWalk(p,'release',{pick:0,feel:1,place:3,t:ST,base:{lines:p.meter.lines,unique:p.meter.unique.length}},T);
 const keys=E.meterPlan(p,ids,E.ONB_CHANS,12); E.meterRun(p,keys);
 const r=E.releaseVerify(p.practice,'something_moved',ids,{story_t:ST},T); p.practice=r.P;
 /* and the save that follows a release moves the counter, as saveProfile does */
 E.journeyGiftSync(p);
 return {p:p, ids:ids, ST:ST};}

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
 /* THE BLANK IS UNTOUCHED. F13 landed the record, and a record carries one
    only from the first write onto it, so a profile that never meets the first
    run is byte for byte what it was before the journey existed. */
 ok(!('journey' in E.blankProfile('b')),'the blank profile carries no journey until one is walked');
 /* THE FOURTH STAGE, AND WHERE A RELOAD RESUMES. A hand off whose release
    landed is released and resumes at the end card; one whose release never
    ran resumes at the card that offers it. */
 const w=walked(E).p, rw=E.journeyRead(w);
 ok(rw.stage==='released'&&rw.first===false&&rw.landed===true,'a first run whose release landed reads released: '+J({s:rw.stage,l:rw.landed}));
 ok(rw.at==='end','and it resumes at the end card: '+rw.at);
 const h=clone(w); h.meter.lines=h.journey.walk.base.lines;
 const rh=E.journeyRead(h);
 ok(rh.landed===false&&rh.at==='next'&&rh.stage!=='released','a hand off whose release never ran resumes at the card that offers it: '+J({at:rh.at,s:rh.stage}));
 const a=E.blankProfile('a'); E.journeyWalk(a,'feel',{pick:3},at(-1));
 ok(E.journeyRead(a).at==='feel'&&E.journeyRead(a).first===true,'any other station resumes at itself');
 ok(E.journeyRead(E.blankProfile('n')).at===null,'and no walk is no resume');
 const leg=fixture(E,3); leg.journey={v:1,walk:null,gift:null,log:[]};
 ok(E.journeyRead(leg).stage==='continuing','a record in use before the walk existed is still continuing, never released');
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
},

/* ============================================================
   F13, THE RECORD. Ported from 3869d96's suites and adapted.
   ============================================================ */
tables(E,ok){
 const ev=tddEvents();
 ok(ev&&ev.length>=20,'the extractor found the events in TDD section 46, '+(ev&&ev.length));
 ok(ev&&J(E.JOURNEY_EVENTS)===J(ev),'the engine carries the TDD\'s events, in its order, no more and no fewer: '
  +(ev?E.JOURNEY_EVENTS.length+' against '+ev.length:'none read'));
 ok(E.JOURNEY_EVENTS.every(x=>/^[a-z]+(_[a-z]+)*$/.test(x)),'every event is lower snake case');
 ok(new Set(E.JOURNEY_EVENTS).size===E.JOURNEY_EVENTS.length,'no event is listed twice');
 ok(E.JOURNEY_V===1&&E.JOURNEY_LOG_MAX>0,'the record has its own version and a ceiling on its log');
 /* the stations: the sheet's eight, then the hand off and the end card */
 ok(E.JOURNEY_WALK.length===10&&E.JOURNEY_WALK[0]==='arrive'&&E.JOURNEY_WALK.slice(-2).join()==='release,end',
  'the first run has its stations in order, the sheet first and the release after: '+E.JOURNEY_WALK.join());
 ok(E.JOURNEY_DOORS.join()==='onboarding,tutorial','and two doors into it');
 ok(E.GIFT_N===100,'the gift is a hundred');
 /* the claim's two lists name every key a walked record has, between them */
 const keys=Object.keys(E.blankProfile('k')).concat(['journey']), S=E.JOURNEY_CLAIM_SEND, N=E.JOURNEY_CLAIM_NEVER;
 ok(keys.every(k=>S.indexOf(k)>=0||N.indexOf(k)>=0),
  'every top level key of the record is ruled in or out of a claim: '+keys.filter(k=>S.indexOf(k)<0&&N.indexOf(k)<0).join());
 ok(S.concat(N).every(k=>keys.indexOf(k)>=0),'and a claim names no key the record does not have: '+S.concat(N).filter(k=>keys.indexOf(k)<0).join());
 ok(!S.some(k=>N.indexOf(k)>=0),'and no key is on both lists');
 ok(['who','name','id','plan','ui'].every(k=>N.indexOf(k)>=0),'who, name, id, plan and ui never cross');
},

record(E,ok){
 const b=E.blankProfile('b');
 ok(J(E.journeyBlank())===J({v:1,walk:null,gift:null,log:[]}),'the blank journey is empty');
 const r0=E.validateProfile(clone(b));
 ok(r0.ok&&!('journey' in r0.profile),'a record with no journey loads with none, and gains none at the boundary');
 const nul=clone(b); nul.journey=null;
 ok(E.validateProfile(nul).ok,'and so does one carrying null');
 const v1=clone(b); v1.v=1;
 ok(E.validateProfile(v1).ok,'a version 1 record still loads');
 /* export, import, export is identical, with everything the journey holds */
 const p=walked(E).p;
 const o1=J(p), v=E.validateProfile(JSON.parse(o1));
 ok(v.ok,'a walked record loads: '+J(v.errs));
 if(v.ok){
  const o2=J(v.profile), v2=E.validateProfile(JSON.parse(o2));
  ok(v2.ok&&J(v2.profile)===o2,'export, import, export is identical');
  ok(J(v.profile.journey)===J(p.journey),'and the journey comes back exactly as it went in');}
 /* a writer fills a missing journey rather than throwing */
 const f=E.blankProfile('f');
 ok(E.journeyLog(f,'tutorial_started',null,null,at(-1)).ok&&f.journey&&f.journey.log.length===1,'a writer gives a record its journey on the first write');
},

boundary(E,ok){
 const base=clone(walked(E).p);
 ok(E.validateProfile(clone(base)).ok,'the walked record loads, so every refusal below is the change and not the record');
 const C=(name,f,part)=>{const o=clone(base); f(o);
  const r=verdict(E,o);
  ok(!r.ok&&r.errs.some(e=>e.indexOf(part)>=0),name+', refused naming '+J(part)+': '+J(r.errs.slice(0,2)));};
 C('an unknown key under journey',o=>{o.journey.extra=1;},'journey may not carry extra');
 C('a journey that is not an object',o=>{o.journey=[];},'journey is not an object');
 C('a journey version this build does not read',o=>{o.journey.v=2;},'not a journey version this build reads');
 /* the log */
 C('a log line outside the events',o=>{o.journey.log.push({seq:o.journey.log.length+1,type:'bought_it',at:at(-1),ref:null,d:{}});},'is not an event type: bought_it');
 C('a log with a gap in its numbers',o=>{o.journey.log[1].seq=9;},'journey.log[1].seq is not the next number');
 C('a log line with free text in its detail',o=>{o.journey.log[0].d={note:'I cried at the board meeting'};},'journey.log[0].d.note is free text');
 C('a log line with a free text reference',o=>{o.journey.log[0].ref='the story I wrote';},'journey.log[0].ref is not a key into the record');
 C('a log line with an unknown key',o=>{o.journey.log[0].text='x';},'journey.log[0] may not carry text');
 C('a log line with a detail key that is not a word',o=>{o.journey.log[0].d={'Not A Key':1};},'journey.log[0].d may not carry Not A Key');
 C('a log line with too many details',o=>{o.journey.log[0].d={a:1,b:1,c:1,d:1,e:1,f:1,g:1};},'journey.log[0].d holds 7 values, more than 6');
 C('a log line dated in the future',o=>{o.journey.log[0].at=at(40);},'journey.log[0].at is ahead of the clock');
 C('a log over its cap',o=>{o.journey.log=[];for(let i=0;i<E.JOURNEY_LOG_MAX+1;i++)o.journey.log.push({seq:i+1,type:'tier_viewed',at:at(-1),ref:null,d:{}});},'journey.log is full');
 C('a log that is not a list',o=>{o.journey.log={};},'journey.log is not a list');
 C('a log line that is not an object',o=>{o.journey.log=[7];},'journey.log[0] is not an object');
 /* the gift */
 C('a gift from somewhere it was not issued',o=>{o.journey.gift.src='shop';},'journey.gift.src is not funnel or app');
 C('a gift counter that does not add up',o=>{o.journey.gift.remaining=99;},'which do not make 100');
 C('a gift counter that has used more than it was given',o=>{o.journey.gift.used=101;o.journey.gift.remaining=0;},'journey.gift.used is 101');
 C('an unknown key on the gift',o=>{o.journey.gift.tier='four';},'journey.gift may not carry tier');
 C('a gift that is not an object',o=>{o.journey.gift=5;},'journey.gift is not an object');
 C('a gift counter with no number in it',o=>{delete o.journey.gift.granted;},'journey.gift.granted is not a whole number');
 /* the walk */
 C('a walk at a station that does not exist',o=>{o.journey.walk.step='checkout';},'journey.walk.step is not a station of the first run: checkout');
 C('a walk through a door that does not exist',o=>{o.journey.walk.door='quiz';},'journey.walk.door is not onboarding or tutorial');
 C('a walk with a starting point that is not one of the twelve',o=>{o.journey.walk.pick=12;},'journey.walk.pick is not a position in its list of 12');
 C('a walk with a feeling below Not sure',o=>{o.journey.walk.feel=-2;},'journey.walk.feel is not a position');
 C('a walk with a body place that is not whole',o=>{o.journey.walk.place=1.5;},'journey.walk.place is not a position');
 C('a walk answer naming no node',o=>{o.journey.walk.ans={'999999':'yes'};},'journey.walk.ans names no node: 999999');
 C('a walk answer that is not yes or no',o=>{o.journey.walk.ans={[E.W.filter(x=>x.cf)[0].i]:'maybe'};},'is not yes or no');
 C('a walk draft that is not text',o=>{o.journey.walk.text=42;},'journey.walk.text is not a string');
 C('a walk correction that is not text',o=>{o.journey.walk.fixes=[3];},'journey.walk.fixes[0] is not a string');
 C('a walk with a committed entry that is not a date',o=>{o.journey.walk.t='yesterday';},'journey.walk.t is not a date');
 C('a hand off with nothing to read the release against',o=>{o.journey.walk.base=null;},'journey.walk.base is missing at release');
 C('a base that is not whole',o=>{o.journey.walk.base.lines=-1;},'journey.walk.base.lines is -1');
 C('a base with a key it does not carry',o=>{o.journey.walk.base.cost=3;},'journey.walk.base may not carry cost');
 C('a walk with an unknown key',o=>{o.journey.walk.mood='x';},'journey.walk may not carry mood');
 C('a walk that is not an object',o=>{o.journey.walk='arrive';},'journey.walk is not an object');
 C('a walk with no date',o=>{delete o.journey.walk.at;},'journey.walk.at is not a date');
 /* the boundary called on its own: the defaults it documents */
 {const e1=[]; const d1=E.journeyValidate(e1,undefined);
  ok(e1.length===0&&J(d1)===J(E.journeyBlank()),'called with nothing it reads the blank and says nothing');
  const e2=[]; E.journeyValidate(e2,'x'); ok(e2.join()==='journey is not an object','a string is refused under the default name: '+e2.join());
  const e4=[]; E.journeyValidate(e4,{log:[{seq:1,type:'tier_viewed',at:at(2),ref:null,d:{}}]},'journey',{now:T0+5*DAY});
  ok(e4.length===0,'a clock handed in is the clock the dates are read against');}
 /* a refusal is the whole record and never a partial one */
 const bad=clone(base); bad.journey.walk.step='checkout';
 ok(E.validateProfile(bad).profile===undefined,'a refused record returns no profile to load');
 /* a clean record is never refused for what the journey is allowed to hold */
 const g1=clone(base); g1.journey.gift.src='funnel';
 ok(E.validateProfile(g1).ok,'a gift issued by the funnel is a gift');
 const g2=clone(base); g2.journey.log=[{seq:1,type:'tier_viewed',at:at(-1),ref:'2026-10-01T09:00:00.000Z',d:{n:3,kind:'free',seen:true}}];
 ok(E.validateProfile(g2).ok,'a log line may reference an entry by its date and carry counts, words and flags');
 const g3=clone(base); g3.journey.walk={step:'story',door:'onboarding',pick:0,feel:-1,place:-1,ans:{},
  text:'Half a story, typed and not yet committed',fixes:['and in my jaw'],t:null,base:null,at:at(-1)};
 ok(E.validateProfile(g3).ok,'a walk holding a draft and a correction is a good record');
},

log(E,ok){
 const p=E.blankProfile('log');
 const a=E.journeyLog(p,'tutorial_started',null,null,at(-1));
 ok(a.ok&&a.entry.seq===1&&a.entry.type==='tutorial_started'&&a.entry.ref===null,'a first line is number one: '+J(a));
 const b=E.journeyLog(p,'story_submitted','2026-10-01T09:00:00.000Z',{words:3},at(-1));
 ok(b.ok&&b.entry.seq===2,'and the next is two');
 ok(p.journey.log.map(e=>e.seq).join()==='1,2','the log is gapless');
 ok(E.journeyLogged(p,'story_submitted')&&!E.journeyLogged(p,'tier_viewed'),'a writer can ask whether a kind of line is already there');
 const n=p.journey.log.length;
 [['an event not in the set',()=>E.journeyLog(p,'bought_it',null,null,at(-1)),'not an event type'],
  ['a detail that is words',()=>E.journeyLog(p,'tier_viewed',null,{note:'I want to stop'},at(-1)),'is free text'],
  ['a reference that is a sentence',()=>E.journeyLog(p,'tier_viewed','my whole story',null,at(-1)),'not a key into the record'],
  ['a moment in the future',()=>E.journeyLog(p,'tier_viewed',null,null,at(60)),'ahead of the clock']]
  .forEach(x=>{const r=x[1](); ok(r.ok===false&&r.why.indexOf(x[2])>=0,x[0]+' is refused naming '+J(x[2])+': '+J(r.why));});
 ok(p.journey.log.length===n,'and a refused line writes nothing');
 /* the cap, refused by name and never evicting the oldest */
 const q=E.blankProfile('full');
 for(let i=0;i<E.JOURNEY_LOG_MAX;i++)E.journeyLog(q,'tier_viewed',null,null,at(-1));
 ok(q.journey.log.length===E.JOURNEY_LOG_MAX,'the log fills to its cap, '+q.journey.log.length);
 const first=J(q.journey.log[0]);
 const over=E.journeyLog(q,'tier_viewed',null,null,at(-1));
 ok(over.ok===false&&/journey\.log is full/.test(over.why),'one more is refused as full: '+J(over.why));
 ok(q.journey.log.length===E.JOURNEY_LOG_MAX&&J(q.journey.log[0])===first,'and the oldest line is still there');
 ok(E.validateProfile(clone(q)).ok,'a full log is a record that loads');
 ok(E.journeyLog(null,'tier_viewed').ok===false,'no record is refused and does not throw');
 /* every event in the set can be written, so the closed set is one a caller can use whole */
 const all=E.blankProfile('all');
 ok(E.JOURNEY_EVENTS.map(t=>E.journeyLog(all,t,null,null,at(-1)).ok).every(Boolean),'every one of the '+E.JOURNEY_EVENTS.length+' events can be logged');
},

walk(E,ok){
 const p=E.blankProfile('walk');
 const r=E.journeyWalk(p,'body',{pick:4,feel:-1},at(-1));
 ok(r.ok&&p.journey.walk.step==='body'&&p.journey.walk.pick===4&&p.journey.walk.feel===-1&&p.journey.walk.place===null,
  'a walk is written whole: '+J(p.journey.walk));
 ok(p.journey.walk.door==='onboarding'&&J(p.journey.walk.ans)==='{}'&&p.journey.walk.text===null,'and a field the caller did not name is empty');
 const keep=J(p.journey.walk);
 [['a station that does not exist',()=>E.journeyWalk(p,'checkout',{},at(-1)),'is not a station'],
  ['a starting point out of the list',()=>E.journeyWalk(p,'ask',{pick:99},at(-1)),'journey.walk.pick'],
  ['an answer naming no node',()=>E.journeyWalk(p,'mirror',{ans:{'999999':'yes'}},at(-1)),'names no node'],
  ['a hand off with no base',()=>E.journeyWalk(p,'release',{t:at(-1)},at(-1)),'base is missing']]
  .forEach(x=>{const q=x[1](); ok(q.ok===false&&q.why.indexOf(x[2])>=0,x[0]+' is refused naming '+J(x[2])+': '+J(q.why));});
 ok(J(p.journey.walk)===keep,'and every refusal left the walk as it was');
 ok(E.journeyWalk(null,'arrive').ok===false,'no record is refused and does not throw');
 /* the draft is held until it is committed, and a later write without it clears it */
 E.journeyWalk(p,'story',{pick:4,text:'I keep taking care of everybody'},at(-1));
 ok(p.journey.walk.text==='I keep taking care of everybody','the words typed and not yet committed are kept word for word');
 E.journeyWalk(p,'next',{pick:4,t:at(-1)},at(-1));
 ok(p.journey.walk.text===null,'and a walk written without them, at Commit, holds none');
 ok(E.validateProfile(clone(p)).ok,'a walked record loads');
},

gift(E,ok){
 const p=fixture(E,3);
 const rd0=E.journeyGiftRead(p);
 ok(rd0.granted===100&&rd0.used===12&&rd0.remaining===88&&rd0.issued===false&&rd0.spent===false,
  'before it is issued the counter still reads off the meter: '+J(rd0));
 ok(E.journeyGiftIssue(p,'cart',at(-4)).ok===false,'a gift from nowhere known is refused');
 const i=E.journeyGiftIssue(p,'app',at(-4));
 ok(i.ok&&i.issued&&p.journey.gift.granted===100&&p.journey.gift.used===12&&p.journey.gift.remaining===88&&p.journey.gift.src==='app',
  'issued, it is a counter of a hundred with twelve used: '+J(p.journey.gift));
 ok(p.journey.log.some(e=>e.type==='starter_gift_issued'),'and the issue is on the log');
 const again=E.journeyGiftIssue(p,'funnel',at(-3));
 ok(again.ok&&again.issued===false&&p.journey.gift.src==='app'&&p.journey.gift.at===at(-4),'a second issue changes nothing');
 ok(p.journey.log.filter(e=>e.type==='starter_gift_issued').length===1,'and logs nothing');
 {const ng=E.blankProfile('ng'); ok(E.journeyGiftSync(ng)===null&&!ng.journey,'syncing a gift that was never issued issues nothing');}
 ok(E.journeyGiftIssue(null,'app').ok===false,'no record is refused');
 /* THE COUNTER COUNTS. A release opens new ground and the next save moves the
    stored counter in the same write, through saveProfile, the one writer
    every save goes through. */
 const c=E.blankProfile('counts'); E.journeyGiftIssue(c,'app',at(-2));
 ok(c.journey.gift.used===0&&c.journey.gift.remaining===100,'a new gift has used nothing: '+J(c.journey.gift));
 const ids=addrs(E,3), keys=E.meterPlan(c,ids,E.ONB_CHANS,12); E.meterRun(c,keys);
 ok(E.journeyGiftRead(c).used===12&&E.journeyGiftRead(c).drift===true,'after a release the meter has moved and the stored counter has not yet');
 E.loadProfile(c); E.saveProfile(c);
 ok(c.journey.gift.used===12&&c.journey.gift.remaining===88&&E.journeyGiftRead(c).drift===false,
  'and the save writes it: twelve used, eighty eight left, no drift: '+J(c.journey.gift));
 E.loadProfile(E.blankProfile('after the counter'));
 /* THE COUNTER CANNOT GRANT. The allowance counts the meter and the gift row. */
 const before=E.planAllowance(p.plan,p.meter.unique.length,E.meterGiftAt(p),at(0));
 p.journey.gift.granted=5000; p.journey.gift.used=0; p.journey.gift.remaining=5000;
 const after=E.planAllowance(p.plan,p.meter.unique.length,E.meterGiftAt(p),at(0));
 ok(J(before)===J(after),'no value on the counter moves planAllowance: '+before.left+' then '+after.left);
 ok(E.meterBudget(p,at(0)).left===before.left,'nor the budget a run is planned against');
 const rd=E.journeyGiftRead(p);
 ok(rd.granted===100&&rd.remaining===E.planAllowance(p.plan,p.meter.unique.length,null,at(0)).left,
  'the derived counter equals planAllowance\'s own while the gift lasts');
 ok(rd.drift===true,'a stored counter that disagrees with the meter is reported as drift');
 E.journeyGiftSync(p);
 ok(E.journeyGiftRead(p).drift===false&&p.journey.gift.granted===100&&p.journey.gift.used===12,'and sync writes it back from the meter and from nowhere else');
 /* spending it all */
 const s=E.blankProfile('spent'); const many=addrs(E,30);
 E.meterRun(s,E.meterPlan(s,many,E.ONB_CHANS,100));
 const rs=E.journeyGiftRead(s);
 ok(s.meter.unique.length===100&&rs.spent===true&&rs.remaining===0&&rs.used===100,'a hundred lines opened is the gift spent: '+J(rs));
},

made(E,ok){
 const {p,ids,ST}=walked(E);
 const before=J(p), m=E.journeyMade(p);
 ok(J(p)===before,'reading what was made writes nothing');
 ok(m.ok&&m.lines===12&&m.fresh===12,'the first release made twelve lines of new ground: '+J({l:m.lines,f:m.fresh}));
 ok(m.ok&&J(m.addrs)===J(ids),'at the three places it opened, in the order it opened them: '+J(m.addrs));
 ok(m.ok&&m.entry&&m.entry.t===ST&&m.entry.read===5&&m.entry.yes===3&&m.entry.no===0,'and it names the story the mirror committed: '+J(m.entry&&{t:m.entry.t,r:m.entry.read,y:m.entry.yes}));
 ok(m.ok&&m.said==='something_moved','and what the person said changed: '+m.said);
 ok(m.ok&&m.gift.used===12&&m.gift.remaining===88,'and the gift as it now counts: '+J(m.gift));
 /* not landed, and no hand off */
 const h=clone(p); h.meter.lines=h.journey.walk.base.lines;
 ok(E.journeyMade(h).ok===false&&E.journeyMade(h).why==='not landed','a hand off whose release never ran made nothing');
 ok(E.journeyMade(E.blankProfile('n')).why==='no hand off'&&E.journeyMade(null).ok===false,'and a record with no hand off says so, and does not throw');
 /* an answer about another story is not this release's */
 const o=clone(p); o.practice.evidence.forEach(e=>{e.story_t=at(-30);});
 ok(E.journeyMade(o).said===null,'an answer about a different story is not counted as this one\'s');
 /* a base that is not zero: only what came after the hand off is this release's */
 const b4=clone(p); b4.journey.walk.base={lines:4,unique:4};
 const m4=E.journeyMade(b4);
 ok(m4.ok&&m4.lines===8&&m4.fresh===8&&J(m4.addrs)===J(ids.slice(1)),'only the lines after the hand off are counted, at the places they opened: '+J({l:m4.lines,a:m4.addrs}));
 /* the story deleted later: the release still reads, with no entry */
 const d=clone(p); d.story.entries=[];
 const md=E.journeyMade(d);
 ok(md.ok&&md.entry===null&&md.lines===12,'a story deleted since still leaves what the release made');
},

claim(E,ok){
 const {p}=walked(E);
 p.name='Mariam Okonkwo'; p.who.first='Mariam'; p.who.last='Okonkwo'; p.who.sex='f';
 p.who.born={date:'1988-04-17',time:'06:42',place:'Lagos',zone:'Africa/Lagos',timeUnknown:false};
 p.plan.tier='three'; p.plan.status='active'; p.plan.granted=1200;
 const before=J(p);
 const r=E.journeyClaim(p,at(-1));
 ok(r.ok&&r.claim.kind==='atuned.claim'&&r.claim.v===1&&r.claim.schema===E.SCHEMA_V&&r.claim.at===at(-1),'a claim is a packet with its kind, version and moment: '+J(r.errs||Object.keys(r.claim)));
 ok(J(p)===before,'building it does not touch the record');
 if(!r.ok)return;
 const body=r.claim.body, text=J(r.claim);
 ok(body.story.entries.length===1&&/tight in my chest/.test(body.story.entries[0].text),'the story crosses, text included');
 ok(body.axes&&body.laws&&body.intake&&body.meter&&body.summaries&&body.practice&&body.journey,'and the analytic and summary data do');
 ok(body.journey.walk.step==='release'&&body.journey.gift.used===12&&body.journey.log.length>0,'and the journey does, walk, counter and log');
 ['who','name','id','ui','plan','created','updated','v'].forEach(k=>ok(!(k in body),k+' is not in the body'));
 ['1988-04-17','06:42','Lagos','Africa/Lagos','Mariam','Okonkwo'].forEach(s=>ok(text.indexOf(s)<0,'"'+s+'" is nowhere in the packet: birth data and the name stay'));
 ok(Object.keys(body).every(k=>E.JOURNEY_CLAIM_SEND.indexOf(k)>=0),'the body holds only keys the claim is allowed to carry');
 /* what the end card is drawn from is what the packet carries */
 ok(J(E.journeyMade(body))===J(E.journeyMade(p)),'what the first release made reads the same off the packet as off the record');
 /* pure, and shares nothing */
 ok(J(E.journeyClaim(p,at(-1)))===J(r),'the same record and the same moment give the same packet');
 body.story.entries[0].text='changed'; body.meter.unique.push('x');
 ok(/tight in my chest/.test(p.story.entries[0].text)&&p.meter.unique.length===12,'and editing the packet cannot move the person\'s record');
 /* the claim's own boundary */
 const good=E.journeyClaim(p,at(-1)).claim;
 const gc=E.journeyClaimCheck(good,at(0));
 ok(gc.ok&&J(Object.keys(gc.body).sort())===J(Object.keys(good.body).sort()),'a good claim passes its own boundary and comes back with the parts it carried: '+J(gc.errs));
 const C=(name,f,part)=>{const c=clone(good); f(c);
  const k=E.journeyClaimCheck(c,at(0));
  ok(k.ok===false&&k.errs.some(e=>e.indexOf(part)>=0),name+', refused naming '+J(part)+': '+J((k.errs||[]).slice(0,2)));};
 C('a claim carrying the birth data',c=>{c.body.who={born:{date:'1988-04-17'}};},'claim.body.who is not carried by a claim');
 C('a claim carrying the name',c=>{c.body.name='Mariam';},'claim.body.name is not carried by a claim');
 C('a claim carrying an id',c=>{c.body.id='p1';},'claim.body.id is not carried by a claim');
 C('a claim carrying a plan',c=>{c.body.plan={tier:'four'};},'claim.body.plan is not carried by a claim');
 C('a claim carrying a switch set',c=>{c.body.ui={};},'claim.body.ui is not carried by a claim');
 C('a claim carrying a key nobody named',c=>{c.body.secrets={};},'claim.body may not carry secrets');
 C('a claim of the wrong kind',c=>{c.kind='record';},'claim.kind is not atuned.claim');
 C('a claim of a version it does not read',c=>{c.v=2;},'claim.v is 2');
 C('a claim from a schema that does not exist',c=>{c.schema=9;},'claim.schema is 9');
 C('a claim dated in the future',c=>{c.at=at(50);},'claim.at is ahead of the clock');
 C('a claim with a key beside its body',c=>{c.extra=1;},'claim may not carry extra');
 C('a claim with no body',c=>{c.body=null;},'claim.body is not an object');
 C('a claim with a charge of 9999',c=>{c.body.axes.Fear={held:9999,opp:0};},'claim.body: axes.Fear.held is 9999');
 C('a claim with a bad journey inside it',c=>{c.body.journey.walk.step='checkout';},'claim.body: journey.walk.step');
 ok(E.journeyClaimCheck(null,at(0)).ok===false&&E.journeyClaimCheck([],at(0)).ok===false,'no claim and a list are refused and do not throw');
 ok(J(good)===J(E.journeyClaim(p,at(-1)).claim),'and the refusals above did not change the packet they were made from');
 const badp=clone(p); badp.axes.Fear={held:9999,opp:0};
 const bc=E.journeyClaim(badp,at(0));
 ok(bc.ok===false&&bc.errs.some(e=>e.indexOf('axes.Fear.held')>=0),'a record the boundary refuses makes no claim, and says why: '+J(bc.errs));
 ok(E.journeyClaim(null,at(0)).ok===false,'no record makes none');
 ok(!/fetch|XMLHttpRequest/.test(E.journeyClaim.toString()),'the packet is built and nothing here sends it');
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
  from:"var stage=landed?'released':(prior?'continuing':(entries.length?'storied':'new'));", to:"var stage=landed?'released':(entries.length?'storied':'new');"},
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
  from:"var t=typeOf(e.from), src=node[e.from];", to:"var t=typeOf(e.from), src=node[e.from]; if(row.said.n)row.evFor=row.said.n;"},
 /* F13, the record */
 {suite:'tables', what:'an event is renamed',
  from:"'funnel_started','ground_selected',", to:"'funnel_began','ground_selected',"},
 {suite:'boundary', what:'the record skips the journey boundary',
  from:"p.journey=journeyValidate(errs,o.journey,'journey');", to:"p.journey=o.journey;"},
 {suite:'boundary', what:'a log may skip a number',
  from:"if(x.seq!==i+1)errs.push(path+'.seq is not the next number');", to:""},
 {suite:'boundary', what:'a log line may be any event',
  from:"if(JOURNEY_EVENTS.indexOf(x.type)<0)errs.push(", to:"if(false)errs.push("},
 {suite:'boundary', what:'a log detail may be free text',
  from:"else errs.push(path+'.d.'+k+' is free text and not a count or a word');", to:"else d[k]=v;"},
 {suite:'boundary', what:'a gift counter need not add up',
  from:"if(gr!==null&&us!==null&&rm!==null&&us+rm!==gr)", to:"if(false)"},
 {suite:'boundary', what:'a walk may stand at any station',
  from:"if(JOURNEY_WALK.indexOf(w.step)<0)errs.push(", to:"if(false)errs.push("},
 {suite:'boundary', what:'a walk answer may name any node',
  from:"if(String(n)!==k||!BY[n]){errs.push(", to:"if(false){errs.push("},
 {suite:'log', what:'the log is not capped',
  from:"if(j.log.length>=JOURNEY_LOG_MAX)", to:"if(false)"},
 {suite:'walk', what:'a draft outlives the commit that should clear it',
  from:"var errs=[], x=Object.assign({},w||{},{step:step, at:jyAt(now)});", to:"var errs=[], x=Object.assign({},(p.journey&&p.journey.walk)||{},w||{},{step:step, at:jyAt(now)});"},
 {suite:'gift', what:'a save never moves the stored counter, so it does not count',
  from:"if(p.journey&&p.journey.gift)journeyGiftSync(p);", to:""},
 {suite:'gift', what:'the counter reads nothing used',
  from:"var used=Math.min(GIFT_N,n);", to:"var used=0;"},
 {suite:'read', what:'a landed release resumes at the start',
  from:"if(at==='release'||at==='end')at=landed?'end':'next';", to:"if(at==='release'||at==='end')at=null;"},
 {suite:'read', what:'a release is taken as landed without reading the meter',
  from:"var landed=!!(w&&w.base&&(+m.lines||0)>w.base.lines);", to:"var landed=!!(w&&w.base);"},
 {suite:'made', what:'what was made counts the lines from before the hand off',
  from:"var lines=(+m.lines||0)-w.base.lines;", to:"var lines=(+m.lines||0);"},
 {suite:'made', what:'an answer about another story is taken as this one\'s',
  from:"return !w.t||x.story_t===w.t;", to:"return true;"},
 {suite:'claim', what:'the claim carries the birth data',
  from:"var JOURNEY_CLAIM_SEND=['soul',", to:"var JOURNEY_CLAIM_SEND=['who','soul',"},
 {suite:'claim', what:'a claim takes a body part it never carries',
  from:"if(JOURNEY_CLAIM_NEVER.indexOf(k)>=0)errs.push('claim.body.'+k+' is not carried by a claim');", to:"if(false)errs.push('x');"},
 {suite:'claim', what:'a claim skips the profile boundary',
  from:"var rec=Object.assign({v:c.schema},c.body);\n var v=validateProfile(rec);", to:"var rec=Object.assign({v:c.schema},c.body);\n var v={ok:true,profile:rec};"}];

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
