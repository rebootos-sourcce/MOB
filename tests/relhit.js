/* Release hit gate. engine/relhit.js: the append only log of what a person
   said a release landed on, its boundary, and the one count.

   The contract is the owner's 21 October clarification, docs/ATUNED_CQ_DQ_
   SQ_RELEASE_HIT_FEEDBACK_ADDENDUM_v1.md, section 4 and acceptance tests 6,
   8, 9 and 10, and block 3 of docs/ATUNED_MVP_ALPHA_RECURSIVE_EXECUTION_
   CONTRACT_v1.md. Each suite names the line it holds. Voice (acceptance 5
   and 7) is the next item and is not held here, because it is not built.

   Run from tests/engine.js by one line, with that file's own ok() and g(), or
   on its own: node tests/relhit.js. Headless, from the repo root.

   EVERY SUITE IS A FUNCTION OF AN ENGINE, so the same assertions run against
   the real engine, where every one must pass, and against copies of engine.js
   with one rule deliberately broken, where the suite guarding that rule must
   fail. The loader is checked on an unbroken copy first. This is
   tests/journey.js's posture, copied, because a gate that cannot fail is not
   a gate. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const ROOT=process.cwd();
const ENGINE_FILE=path.resolve(ROOT,process.env.ENGINE||'engine.js');
const DAY=86400000, T0=Date.now();
const at=d=>new Date(T0+d*DAY).toISOString();
const J=x=>JSON.stringify(x);
const clone=x=>JSON.parse(JSON.stringify(x));
const SID='release_0f8e2c1a-7b44-4d0e-9a51-3c2b1d0e9f77';
const SID2='release_5a1d9e3c-2b6f-4e81-8c07-1f4a9b2d6e30';
const PATS=[{fam:'sab',nm:'Control Freak'},{fam:'cx',nm:'Micromanager + Hyper-Achiever'},{fam:'hy',nm:'Collapse'}];

/* a record that has run one release, through the engine's own boundary */
function ran(E){
 const p=E.validateProfile(E.blankProfile('Hit gate')).profile;
 const x=E.relHitExecute(p,SID,PATS,at(0));
 return {p:p, x:x, ids:PATS.map(q=>E.relHitPat(q.fam,q.nm))};}
let EVN=0;
const ev=()=>'rh_gate_'+(++EVN).toString(36).padStart(6,'0');
const press=(E,p,pat,cmd,id,sid)=>E.relHitDecide(p,{ev:id||ev(),sid:sid||SID,pat:pat,cmd:cmd,mode:'control',raw:cmd,conf:null},at(0));

const SUITES={
 /* acceptance 6 and 10: a release that ran is not a hit, and only Hit is */
 execute(E,ok){
  const {p,x,ids}=ran(E);
  ok(x.ok&&x.event&&x.event.kind==='execute','a release that ran is written as an execute line: '+J(x));
  ok(ids.every(Boolean),'every presented pattern has an id: '+J(ids));
  const s=E.relHitSession(p,SID);
  ok(s&&s.executed&&s.items.length===3,'the session reads executed with three presented items');
  ok(s&&s.items.every(i=>i.state==='shown'),'every presented item reads shown, not hit, before any press: '+J(s&&s.items));
  const c=E.relHitCount(p);
  ok(c.hits===0&&c.sessions===1,'execution alone counts no hit: '+J(c));
  const again=E.relHitExecute(p,SID,PATS,at(0));
  ok(again.ok&&again.dup&&p.relhit.log.length===1,'executing the same session again writes nothing');
  ok(E.relHitSession(p,'release_never_ran_000')===null,'a session the record never executed reads null');},

 /* acceptance 10 and the states are not synonyms */
 states(E,ok){
  const {p,ids}=ran(E);
  let r=press(E,p,ids[0],'hold');
  ok(r.ok&&r.state==='held'&&E.relHitCount(p).hits===0,'Hold leaves the item held and counts nothing');
  r=press(E,p,ids[0],'hit');
  ok(r.ok&&r.state==='confirmed'&&E.relHitCount(p).hits===1,'Hit moves held to confirmed and counts one');
  r=press(E,p,ids[1],'reject');
  ok(r.ok&&r.state==='rejected'&&E.relHitCount(p).hits===1,'Not a hit counts nothing');
  ok(E.relHitState(p,SID,ids[2])==='shown','an item nobody pressed stays shown');
  const c=E.relHitCount(p);
  ok(c.held===0&&c.rejected===1&&c.patterns===1&&c.by[ids[0]]===1,'the count names each state apart: '+J(c));
  const d=p.relhit.log.filter(e=>e.kind==='decide');
  ok(d.length===3&&d[1].from==='held'&&d[1].to==='confirmed','each decision records the state before and after: '+J(d[1]));
  ok(d.every(e=>e.sid===SID&&e.mode==='control'&&e.raw===e.cmd&&e.conf===null&&typeof e.ev==='string'&&typeof e.at==='string'),
   'each decision records session, modality, raw and normalised command, confidence, id and time');},

 /* acceptance 8: replay is idempotent, three ways */
 replay(E,ok){
  const {p,ids}=ran(E);
  const id=ev();
  let r=press(E,p,ids[0],'hit',id);
  const n=p.relhit.log.length;
  r=press(E,p,ids[0],'hit',id);
  ok(r.ok&&r.dup&&p.relhit.log.length===n,'the same event delivered twice is a duplicate and writes nothing');
  r=press(E,p,ids[0],'hit');
  ok(r.ok&&r.noop&&p.relhit.log.length===n,'a second Hit with a fresh id on a confirmed item writes nothing');
  ok(E.relHitCount(p).hits===1,'and the count is still one');
  /* a reload is the record read back through the store's own boundary */
  const back=E.validateProfile(JSON.parse(JSON.stringify(p)),{stored:true});
  ok(back.ok&&E.relHitCount(back.profile).hits===1,'a reload reads the same one hit: '+J(back.errs||null));
  ok(back.ok&&J(back.profile.relhit)===J(p.relhit),'the log survives the round trip byte for byte');
  const back2=E.validateProfile(JSON.parse(JSON.stringify(back.profile)),{stored:true});
  ok(back2.ok&&E.relHitCount(back2.profile).hits===1,'and a second reload still one');},

 /* acceptance 9: removal keeps the evidence, and a judgment can change */
 keep(E,ok){
  const {p,ids}=ran(E);
  press(E,p,ids[0],'hit'); press(E,p,ids[0],'reject');
  ok(E.relHitCount(p).hits===0&&E.relHitState(p,SID,ids[0])==='rejected','a hit changed to Not a hit no longer counts');
  ok(p.relhit.log.length===3&&p.relhit.log[1].to==='confirmed','and the earlier hit is still on the log');
  ok(p.relhit.log[0].pats.some(q=>q.id===ids[0]),'and so is the presentation');
  press(E,p,ids[0],'hit');
  ok(E.relHitCount(p).hits===1&&p.relhit.log.length===4,'a rejection can be reversed by another event, not a rewrite');},

 /* a refusal is said and changes nothing */
 refuse(E,ok){
  const {p,ids}=ran(E);
  const was=J(p.relhit);
  let r=press(E,p,ids[0],'hit',null,'release_stale_session_00');
  ok(!r.ok&&/not on this record/.test(r.why),'a session the record does not hold is refused by name: '+J(r));
  r=press(E,p,'sab:not_presented','hit');
  ok(!r.ok&&/not presented/.test(r.why),'a pattern the session did not present is refused by name');
  r=press(E,p,ids[0],'release');
  ok(!r.ok&&/hold, hit or reject/.test(r.why),'release is not a feedback command, it is the run: '+J(r));
  r=E.relHitDecide(p,{sid:SID,pat:ids[0],cmd:'hit',mode:'control',raw:'hit',conf:null},at(0));
  ok(!r.ok,'a decision with no event id is refused');
  r=E.relHitDecide(p,{ev:ev(),sid:SID,pat:ids[0],cmd:'hit',mode:'voice',raw:'yes that one',conf:0.4},at(0));
  ok(!r.ok,'a voice decision is refused until voice is built');
  r=E.relHitDecide(p,{ev:ev(),sid:SID,pat:ids[0],cmd:'hit',mode:'control',raw:'hit it hard',conf:null},at(0));
  ok(!r.ok,'a control decision carrying words is refused');
  ok(J(p.relhit)===was,'and none of those changed the log');
  ok(!E.relHitDecide(null,{}).ok,'no record is refused');},

 /* A HIT MOVES NO NUMBER. Addendum, section 4: hit feedback must not "silently
    alter CQ, DQ, SQ, or stored-charge estimates" */
 metrics(E,ok){
  const p=E.validateProfile(E.blankProfile('Hit metrics')).profile;
  E.CHARGES.forEach(c=>{p.axes[c]={held:6,opp:1};});
  /* every law answered, so CQ is a real number and not the 0 of a record
     that answered none, which would hold nothing */
  E.SINAMES.forEach(l=>{p.laws[l]=7;});
  E.loadProfile(p); E.saveProfile(p);
  const r0=E.compute();
  ok(r0.CQ>0&&r0.DQ>0,'the field has a CQ and a DQ to hold still: '+J([r0.CQ,r0.DQ]));
  const keep=J({meter:p.meter,work:p.work,axes:p.axes,laws:p.laws,addr:p.addr,practice:p.practice});
  const sq0=J(E.NODES.map(n=>n.sq));
  const pats=[];
  [['sab','sabs'],['cx','cxs'],['hy','hys']].forEach(t=>(r0[t[1]]||[]).forEach(o=>{if(!o.over)pats.push({fam:t[0],nm:o.nm});}));
  ok(pats.length>0,'a charged field presents patterns to judge: '+pats.length);
  const x=E.relHitExecute(p,SID,pats,at(0));
  ok(x.ok&&x.event.pats.length===new Set(pats.map(q=>E.relHitPat(q.fam,q.nm))).size,
   'every pattern the engine names passes the boundary: '+J(x.why||null));
  (x.ok?x.event.pats:[]).forEach((q,i)=>press(E,p,q.id,['hit','hold','reject'][i%3]));
  const r1=E.compute();
  ok(r1.CQ===r0.CQ&&r1.DQ===r0.DQ,'CQ and DQ do not move: '+J([r0.CQ,r1.CQ,r0.DQ,r1.DQ]));
  ok(J(E.NODES.map(n=>n.sq))===sq0,'no address weight moves, so SQ does not');
  ok(J({meter:p.meter,work:p.work,axes:p.axes,laws:p.laws,addr:p.addr,practice:p.practice})===keep,
   'the meter, the work, the charge, the laws and the evidence do not move');
  ok(E.relHitCount(p).hits===Math.ceil(x.event.pats.length/3),'only the pressed hits count');
  E.loadProfile(E.blankProfile('after metrics'));},

 /* the boundary: a log this file did not write is refused by name */
 boundary(E,ok){
  const {p,ids}=ran(E);
  press(E,p,ids[0],'hit');
  const base=()=>{const o=clone(E.blankProfile('B')); o.relhit=clone(p.relhit); return o;};
  const bad=(what,f,re)=>{const o=base(); f(o.relhit); const v=E.validateProfile(o);
   ok(!v.ok&&v.errs.some(e=>re.test(e)),what+': '+J(v.errs||null));};
  ok(E.validateProfile(base()).ok,'the log as written loads');
  const old=E.validateProfile(clone(E.blankProfile('Old')));
  ok(old.ok&&old.profile.relhit===undefined,'a record with no log loads and gains none');
  bad('a repeated event id',L=>{L.log[1].ev=L.log[0].ev;},/repeats an event id/);
  bad('a decision before its release',L=>{L.log=[Object.assign(L.log[1],{seq:1})];},/not executed earlier/);
  bad('a from that is not the replayed state',L=>{L.log[1].from='held';},/\.from is held and the item was shown/);
  bad('a to that is not where the command leaves it',L=>{L.log[1].to='held';},/is not where hit leaves/);
  bad('a key the line does not carry',L=>{L.log[1].note='felt it';},/may not carry note/);
  bad('a count stored beside the log',L=>{L.hits=9;},/may not carry hits/);
  bad('a second execute for one session',L=>{L.log.push(Object.assign(clone(L.log[0]),{seq:3,ev:'x_again_00000'}));},/a second time/);
  bad('a version this build does not read',L=>{L.v=2;},/not a release hit version/);
  bad('a seq out of order',L=>{L.log[1].seq=5;},/seq is not the next number/);
  bad('a pattern name with free text',L=>{L.log[0].pats[0].nm='<b>x</b>';},/not a pattern name/);
  /* a stamp the device clock wrote ahead: refused on import, loaded from this
     device's own store, for the reason journeyValidate gives */
  const fut=base(); fut.relhit.log[1].at=at(3);
  const vi=E.validateProfile(clone(fut)), vs=E.validateProfile(clone(fut),{stored:true});
  ok(!vi.ok&&vi.errs.some(e=>/ahead of the clock/.test(e)),'an import with a stamp three days ahead is refused');
  ok(vs.ok,'and the boot read of the store loads it: '+J(vs.errs||null));
  const big=base(); big.relhit.log=new Array(E.RELHIT_LOG_MAX+1).fill(null);
  const vb=E.validateProfile(big);
  ok(!vb.ok&&vb.errs.some(e=>/is full/.test(e)),'a log over the cap is refused, never truncated');},

 /* the claim carries the log, and its boundary takes it */
 claim(E,ok){
  const {p,ids}=ran(E);
  press(E,p,ids[0],'hit');
  const c=E.journeyClaim(clone(p));
  ok(c.ok&&c.claim.body.relhit&&c.claim.body.relhit.log.length===2,'the claim packet carries the hit log');
  const chk=c.ok?E.journeyClaimCheck(c.claim):{ok:false};
  ok(chk.ok&&E.relHitCount(chk.body).hits===1,'and the claim boundary reads the same one hit: '+J(chk.errs||null));}};

/* each one a rule the suites above hold, broken in a copy of engine.js */
const MUTANTS=[
 {suite:'execute', what:'execution is counted as a hit',
  from:"if(st==='confirmed'){out.hits++;", to:"if(true){out.hits++;"},
 {suite:'replay', what:'an event id already on the log is taken again',
  from:"if(typeof a.ev==='string'&&log.some(function(e){return e.ev===a.ev;}))return {ok:true, dup:true};", to:""},
 {suite:'replay', what:'a press that leaves the item where it is writes another line',
  from:"if(x.state===to)return {ok:true, noop:true, state:to};", to:""},
 {suite:'states', what:'hold is counted as a hit',
  from:"const RELHIT_CMDS={hold:'held',", to:"const RELHIT_CMDS={hold:'confirmed',"},
 {suite:'keep', what:'a rejection rewrites the log instead of adding to it',
  from:" R.log.push(e);\n return {ok:true, event:e};}", to:" if(e.kind==='decide')R.log=R.log.filter(function(o){return !(o.kind==='decide'&&o.pat===e.pat&&o.sid===e.sid);}).map(function(o,i){o.seq=i+1;return o;}), e.seq=R.log.length+1;\n R.log.push(e);\n return {ok:true, event:e};}"},
 {suite:'refuse', what:'a stale session is waved through',
  from:" if(!s)return {ok:false, why:'release '+String(a.sid).slice(0,80)+' is not on this record'};", to:" if(!s)return {ok:true, noop:true};"},
 {suite:'boundary', what:'the replay check is skipped at the boundary',
  from:"   if(errs.length===n)rhReplay(P.log,errs);}}", to:"   }}"},
 {suite:'replay', what:'validateProfile drops the log on the way through',
  from:"  p.relhit=relHitValidate(errs,o.relhit,'relhit',{stored:stored});", to:""},
 {suite:'boundary', what:'the boot read of the store refuses a stamp the clock wrote ahead',
  from:"nowMs=(c.stored===true)?null:jyMs(c.now)", to:"nowMs=jyMs(c.now)"},
 {suite:'claim', what:'the claim leaves the hit log behind',
  from:"'summaries','journey','relhit'];", to:"'summaries','journey'];"}];

function load(src){
 const ctx={module:{exports:{}}, console:console};
 vm.createContext(ctx); vm.runInContext(src,ctx,{filename:'engine-copy.js'});
 return ctx.module.exports;}
function count(suite,E){
 let f=0; const fails=[];
 try{ SUITES[suite](E,(c,m)=>{if(!c){f++; if(fails.length<2)fails.push(m);}}); }
 catch(e){ f++; fails.push('threw: '+((e&&e.message)||e)); }
 return {f:f, fails:fails};}

function run(E,ok,g){
 Object.keys(SUITES).forEach(n=>{
  g('RH · release hits, '+n);
  try{ SUITES[n](E,ok); }catch(e){ ok(false,'the '+n+' suite threw: '+((e&&e.stack)||e)); }});
 g('RH · release hits, the gate bites');
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
 E.loadProfile(E.blankProfile('after the release hit gate'));}
module.exports=run;
module.exports.SUITES=SUITES;

if(require.main===module){
 const E=require(ENGINE_FILE);
 let P=0,F=0;
 const ok=(c,m)=>{if(c){P++}else{F++;console.log('  FAIL  '+m)}};
 const g=n=>console.log('\n'+n);
 run(E,ok,g);
 console.log('\n===== '+P+' passed, '+F+' failed =====');
 process.exit(F?1:0);}
