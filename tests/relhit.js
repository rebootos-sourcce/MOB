/* Release hit gate. engine/relhit.js: the append only log of what a person
   said a release landed on, its boundary, and the one count.

   The contract is the owner's 21 October clarification, docs/ATUNED_CQ_DQ_
   SQ_RELEASE_HIT_FEEDBACK_ADDENDUM_v1.md, section 4 and acceptance tests 6,
   8, 9 and 10, and block 3 of docs/ATUNED_MVP_ALPHA_RECURSIVE_EXECUTION_
   CONTRACT_v1.md. Each suite names the line it holds. Voice (acceptance 5
   and 7) is held here as an engine function only: the phrase parser and its
   path through the one door, with a stand-in for what a recogniser hands
   over, a phrase and a confidence. The microphone is the browser half and is
   not held here.

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
  /* voice is built now, so a voice decision is refused for what is wrong with
     it and not for being voice: here, free words under a low confidence */
  r=E.relHitDecide(p,{ev:ev(),sid:SID,pat:ids[0],cmd:'hit',mode:'voice',raw:'yes that one',conf:0.4},at(0));
  ok(!r.ok&&/none of the commands/.test(r.why),'a voice decision in free words is refused by name: '+J(r));
  r=E.relHitDecide(p,{ev:ev(),sid:SID,pat:ids[0],cmd:'hit',mode:'control',raw:'hit it hard',conf:null},at(0));
  ok(!r.ok,'a control decision carrying words is refused');
  ok(J(p.relhit)===was,'and none of those changed the log');
  ok(!E.relHitDecide(null,{}).ok,'no record is refused');},

 /* A HIT MOVES NO NUMBER. Addendum, section 4: hit feedback must not "silently
    alter CQ, DQ, SQ, or stored-charge estimates" */
 /* via is how each pattern is marked: a control press by default, or a spoken
    phrase for the voiceMetrics suite below, which holds the same line */
 metrics(E,ok,via){
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
  (x.ok?x.event.pats:[]).forEach((q,i)=>{
   if(via)via(p,q.id,i); else press(E,p,q.id,['hit','hold','reject'][i%3]);});
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
  ok(chk.ok&&E.relHitCount(chk.body).hits===1,'and the claim boundary reads the same one hit: '+J(chk.errs||null));},

 /* ======================= VOICE, the engine half =======================
    Acceptance 5 (voice supports HOLD, HIT and NOT A HIT) and 7 (low
    confidence speech does not mutate state), held with a stand-in for the
    recogniser: a phrase and a confidence are all it ever hands over. */

 /* the grammar: the addendum's own words, whole, whatever the case or the
    punctuation, and "release" is not among them */
 voice(E,ok){
  const T=E.RELHIT_VOICE_PHRASES, hear=(s,c)=>E.relHitHear(s,c===undefined?1:c);
  ok(J(Object.keys(T).sort())===J(Object.keys(E.RELHIT_CMDS).sort()),
   'every command the log knows has phrases, and no phrase names a command it does not: '+J(Object.keys(T)));
  /* read off the table, so a phrase added to it is held without a line here */
  Object.keys(T).forEach(cmd=>T[cmd].forEach(ph=>{
   const r=hear(ph);
   ok(r.ok&&r.cmd===cmd&&r.raw===ph&&r.kind==='command','"'+ph+'" is heard as '+cmd+': '+J(r));}));
  /* and the words typed out, because they are the spec and the table is the
     thing under test: section 4, HOLD / KEEP, RELEASE / HIT, DELETE / NOT A
     HIT, and "this was a hit" */
  [['hold','hold'],['keep','hold'],['hit','hit'],['this was a hit','hit'],['not a hit','reject'],['delete','reject']]
   .forEach(([w,c])=>{const r=hear(w); ok(r.ok&&r.cmd===c,'the addendum\'s "'+w+'" is '+c+': '+J(r));});
  /* case, punctuation and spacing never matter, and what is kept is the
     folded phrase, closed to letters, digits and single spaces */
  [['HIT','hit','hit'],['Hit.','hit','hit'],['  hold  ','hold','hold'],['Not a hit!','reject','not a hit'],
   ['NOT-A-HIT','reject','not a hit'],['not\ta\nhit','reject','not a hit'],['"Keep"','hold','keep'],
   ['This was a HIT','hit','this was a hit'],['hit'+' '.repeat(100),'hit','hit']].forEach(([s,c,raw])=>{
   const r=hear(s); ok(r.ok&&r.cmd===c&&r.raw===raw,J(s.slice(0,30))+' is heard as '+c+' and kept as "'+raw+'": '+J(r));});
  /* release is the run, not a decision. It is in no phrase, it is heard and
     refused by name, and no confidence turns it into a command */
  ok(!Object.keys(T).some(c=>T[c].some(ph=>ph.split(' ').indexOf(E.RELHIT_VOICE_COLLIDES)>=0)),
   'release is in no phrase of the table');
  ok(E.RELHIT_VOICE_COLLIDES==='release'&&!Object.prototype.hasOwnProperty.call(E.RELHIT_CMDS,'release'),'release is still not a command word');
  [0,0.5,1].forEach(c=>{const r=E.relHitHear('release',c); ok(!r.ok&&r.kind==='release'&&r.cmd===undefined,'release at '+c+' is refused as the run: '+J(r));});
  /* the answer carries the command, the folded phrase and the confidence it
     was heard at, so the line written from it has what the addendum asks */
  const r=E.relHitHear('Not a hit.',0.91);
  ok(J(Object.keys(r).sort())===J(['cmd','conf','kind','ok','raw']),'a heard command carries exactly what a line needs: '+J(r));
  ok(r.conf===0.91,'and the confidence it was heard at, unchanged');
  /* pure: it reads no record and moves no state, and says the same twice */
  ok(J(E.relHitHear('hit',0.9))===J(E.relHitHear('hit',0.9)),'the same phrase and confidence answer the same twice');},

 /* acceptance 7, and "never guess": what is not a command is refused, said,
    and never guessed at. Every one of these, spoken at full confidence so the
    only thing wrong with it is what was said */
 voicebad(E,ok){
  const BAD=[
   [undefined,'silent'],[null,'silent'],['','silent'],['   \n\t','silent'],['...!?','unknown'],
   [42,'silent'],[{},'silent'],[['hit'],'silent'],[true,'silent'],[()=>'hit','silent'],
   ['hello','unknown'],['yes','unknown'],['that one','unknown'],['hits','unknown'],['holding','unknown'],
   ['constructor','unknown'],['__proto__','unknown'],['toString','unknown'],['hasOwnProperty','unknown'],
   ['ｈｉｔ','unknown'],['h i t','unknown'],['hıt','unknown'],['x'.repeat(5000),'unknown'],
   ['hit '.repeat(300),'unknown'],
   ['release','release'],['Release!','release'],['release this pattern','release'],['release hit','release'],
   ['hit it hard','ambiguous'],['this was not a hit','ambiguous'],['hit hit','ambiguous'],['hold hit','ambiguous'],
   ['keep delete','ambiguous'],['not a hit hit','ambiguous'],['delete all','ambiguous'],['hold on','ambiguous'],
   ['don\'t keep','ambiguous'],['<b>hit</b>','ambiguous'],['hit; drop table','ambiguous']];
  BAD.forEach(([s,kind])=>{
   const r=E.relHitHear(s,1), shown=J(typeof s==='string'?s.slice(0,30):String(s));
   ok(!r.ok&&r.kind===kind,shown+' is refused as '+kind+': '+J(r));
   ok(!r.ok&&r.cmd===undefined&&typeof r.say==='string'&&/nothing changed/.test(r.say)&&r.say.length<240,
    shown+' says so, in one plain sentence, and names no command: '+J(r.say));
   ok(!/[—–]/.test(r.say||''),shown+' answers with no dash that is not a hyphen');});
  /* the reason is for a log or a test, the sentence is for a person */
  ok(BAD.every(([s])=>{const r=E.relHitHear(s,1); return typeof r.why==='string'&&r.why.length>0;}),'every refusal also carries its reason');
  /* the refusals are not all one sentence: the three a person can act on differ */
  const probes=['hello','release','hit it hard',null], says=new Set(probes.map(s=>E.relHitHear(s,1).say));
  ok(says.size===probes.length,'an unknown, a release, an ambiguous and a silent phrase each say their own thing: '+says.size);},

 /* acceptance 7: the floor. A command heard whole but not heard clearly, or
    with no word on how clearly, changes nothing */
 voicefloor(E,ok){
  const F=E.RELHIT_VOICE_FLOOR;
  ok(typeof F==='number'&&F>0&&F<=1,'the floor is a number above 0 and no more than 1: '+F);
  ok(E.relHitHear('hit',F).ok,'a phrase heard at exactly the floor is heard');
  ok(E.relHitHear('hit',1).ok&&E.relHitHear('hit',F+(1-F)/2).ok,'and above it');
  Object.keys(E.RELHIT_VOICE_PHRASES).forEach(cmd=>E.RELHIT_VOICE_PHRASES[cmd].forEach(ph=>{
   const r=E.relHitHear(ph,F-0.01);
   ok(!r.ok&&r.kind==='unsure'&&r.cmd===undefined&&/nothing changed/.test(r.say),'"'+ph+'" just under the floor is refused as unsure: '+J(r));}));
  [0,0.1,F/2,F-1e-9].forEach(c=>{
   const r=E.relHitHear('not a hit',c);
   ok(!r.ok&&r.kind==='unsure','a not a hit heard at '+c+' does not delete anything: '+J(r));});
  /* no confidence is not a high one, and a number out of range is no number */
  [null,undefined,NaN,'0.99','',-0.1,1.5,Infinity,-Infinity,{},true,[0.99]].forEach(c=>{
   const r=E.relHitHear('hit',c);
   ok(!r.ok&&r.kind==='unsure','a hit heard with confidence '+(typeof c==='object'?J(c):String(c))+' is refused: '+J(r));});
  ok(E.relHitHear('hit').ok===false,'a hit with no confidence argument at all is refused');
  /* the refusal of a command that was not clear never says the number */
  ok(!/\d/.test(E.relHitHear('hit',0.31).say),'the sentence for a person carries no number');},

 /* the one door: a heard phrase writes through relHitDecide and so inherits
    the three guards, and a bad one writes nothing at all */
 voicepath(E,ok){
  const {p,ids}=ran(E);
  const say=(pat,heard,conf,id,sid)=>E.relHitVoice(p,{ev:id||ev(),sid:sid||SID,pat:pat,heard:heard,conf:conf},at(0));
  const len=()=>p.relhit.log.length;
  /* acceptance 5: a spoken hit is a hit, and the line is the addendum's */
  let r=say(ids[0],'Hit.',0.95);
  ok(r.ok&&r.state==='confirmed'&&E.relHitCount(p).hits===1,'a clear spoken hit is one confirmed hit: '+J(r));
  const line=p.relhit.log[len()-1];
  ok(line.kind==='decide'&&line.mode==='voice'&&line.raw==='hit'&&line.conf===0.95&&line.cmd==='hit'
   &&line.from==='shown'&&line.to==='confirmed'&&line.sid===SID&&line.pat===ids[0]&&typeof line.ev==='string'&&typeof line.at==='string',
   'the line records modality, the heard phrase, the confidence, before and after, session, pattern, id and time: '+J(line));
  /* acceptance 8: the same event twice, three ways */
  const id=ev();
  say(ids[1],'hit',0.9,id); const n=len();
  r=say(ids[1],'hit',0.9,id);
  ok(r.ok&&r.dup&&len()===n&&E.relHitCount(p).hits===2,'the same spoken event delivered twice is a duplicate and writes nothing: '+J(r));
  r=say(ids[1],'this was a hit',0.99);
  ok(r.ok&&r.noop&&len()===n&&E.relHitCount(p).hits===2,'a second spoken hit with a fresh id on a confirmed item writes nothing: '+J(r));
  r=press(E,p,ids[1],'hit');
  ok(r.ok&&r.noop&&len()===n,'and a pressed Hit after a spoken one writes nothing either: one door');
  for(let i=0;i<6;i++)say(ids[1],'hit',0.99);
  ok(len()===n&&E.relHitCount(p).hits===2,'six more spoken hits change nothing: the count is still '+E.relHitCount(p).hits);
  /* a retry of a press the caller could not confirm, after the item moved on */
  const e1=ev(), e2=ev();
  say(ids[2],'hit',0.9,e1); say(ids[2],'keep',0.9,e2);
  const m=len(); r=say(ids[2],'hit',0.9,e1);
  ok(r.ok&&r.dup&&len()===m&&E.relHitState(p,SID,ids[2])==='held','an old spoken event redelivered cannot undo what was said after it: '+J(r));
  ok(E.relHitCount(p).hits===2,'and the count did not move');
  r=say(ids[2],'not a hit',0.9);
  ok(r.ok&&r.state==='rejected'&&E.relHitCount(p).rejected===1,'a spoken not a hit rejects and keeps the evidence: '+J(r));
  ok(p.relhit.log.filter(e=>e.kind==='decide').length===len()-1,'every line but the execute is one decision');
  /* acceptance 7, through the writer: nothing that is not a command, and no
     command heard below the floor, writes anything or counts anything */
  const fresh=ran(E), fp=fresh.p, was=J(fp.relhit);
  const sayF=(heard,conf)=>E.relHitVoice(fp,{ev:ev(),sid:SID,pat:fresh.ids[0],heard:heard,conf:conf},at(0));
  const BAD=['',null,undefined,'hello','release','release this pattern','hit it hard','this was not a hit','hit hit','constructor','<b>hit</b>','x'.repeat(5000)];
  BAD.forEach(s=>{
   const r2=sayF(s,1);
   ok(!r2.ok&&typeof r2.say==='string'&&J(fp.relhit)===was&&E.relHitCount(fp).hits===0,
    J(typeof s==='string'?s.slice(0,24):String(s))+' writes nothing and says so: '+J(r2.kind));});
  [0,E.RELHIT_VOICE_FLOOR-0.01,null,undefined,NaN].forEach(c=>{
   ['hit','keep','not a hit'].forEach(s=>{
    const r2=sayF(s,c);
    ok(!r2.ok&&r2.kind==='unsure'&&J(fp.relhit)===was,'"'+s+'" heard at '+String(c)+' writes nothing: '+J(r2.kind));});});
  /* a refusal of the machine is still a refusal by name */
  r=say(ids[0],'hit',0.99,null,'release_stale_session_00');
  ok(!r.ok&&/not on this record/.test(r.why),'a spoken hit on a release the record does not hold is refused by name: '+J(r));
  r=say('sab:not_presented','hit',0.99);
  ok(!r.ok&&/not presented/.test(r.why),'a spoken hit on a pattern the release did not present is refused by name');
  ok(!E.relHitVoice(null,{ev:ev(),sid:SID,pat:ids[0],heard:'hit',conf:1}).ok&&!E.relHitVoice(p).ok,'no record, and no argument at all, are refused');
  /* the log written is a log the next boot loads, byte for byte, twice */
  const back=E.validateProfile(JSON.parse(JSON.stringify(p)),{stored:true});
  ok(back.ok&&J(back.profile.relhit)===J(p.relhit),'a reload reads the same log with its voice lines: '+J(back.errs||null));
  const back2=E.validateProfile(JSON.parse(JSON.stringify(back.profile)),{stored:true});
  ok(back2.ok&&E.relHitCount(back2.profile).hits===E.relHitCount(p).hits,'and a second reload the same count');
  const imp=E.validateProfile(JSON.parse(JSON.stringify(p)));
  ok(imp.ok,'and an import of it passes the boundary: '+J(imp.errs||null));
  const c=E.journeyClaim(clone(p)), chk=c.ok?E.journeyClaimCheck(c.claim):{ok:false};
  ok(chk.ok&&E.relHitCount(chk.body).hits===E.relHitCount(p).hits,'and the claim packet carries and checks it: '+J(chk.errs||null));},

 /* speech and a press are one path: the same commands in the same order, one
    record marked by buttons and one by voice, end in the same place */
 voiceone(E,ok){
  const A=ran(E), B=ran(E), spoken={hit:'hit',hold:'keep',reject:'not a hit'};
  const seq=[[0,'hit'],[1,'reject'],[0,'hold'],[2,'hit'],[0,'hit'],[1,'hit'],[2,'reject'],[2,'reject']];
  seq.forEach(([i,c])=>{
   const a=press(E,A.p,A.ids[i],c);
   const b=E.relHitVoice(B.p,{ev:ev(),sid:SID,pat:B.ids[i],heard:spoken[c],conf:0.9},at(0));
   ok(a.ok===b.ok&&!!a.noop===!!b.noop&&a.state===b.state,'command '+c+' on pattern '+i+' lands the same by button and by voice: '+J([a,b]));});
  ok(J(E.relHitSession(A.p,SID))===J(E.relHitSession(B.p,SID)),'the two sessions read the same');
  ok(J(E.relHitCount(A.p))===J(E.relHitCount(B.p)),'and the two counts are the same: '+J(E.relHitCount(B.p)));
  const la=A.p.relhit.log, lb=B.p.relhit.log;
  ok(la.length===lb.length,'and the two logs are as long');
  ok(la.every((x,i)=>x.kind===lb[i].kind&&x.cmd===lb[i].cmd&&x.from===lb[i].from&&x.to===lb[i].to&&x.pat===lb[i].pat),
   'line for line they differ in no state, command or pattern, only in how it was said');
  ok(lb.filter(x=>x.kind==='decide').every(x=>x.mode==='voice')&&la.filter(x=>x.kind==='decide').every(x=>x.mode==='control'),
   'and only in the modality each line records');},

 /* a hit spoken moves no number, the same hold as the pressed one */
 voicemetrics(E,ok){
  SUITES.metrics(E,ok,(p,pat,i)=>E.relHitVoice(p,{ev:ev(),sid:SID,pat:pat,heard:['hit','keep','not a hit'][i%3],conf:0.95},at(0)));},

 /* the boundary and the writer, for a voice decision built by hand: a
    caller that never came through relHitVoice meets the same refusals */
 voiceboundary(E,ok){
  const {p,ids}=ran(E), F=E.RELHIT_VOICE_FLOOR, was=()=>J(p.relhit);
  const w0=was();
  const by=(over)=>E.relHitDecide(p,Object.assign({ev:ev(),sid:SID,pat:ids[0],cmd:'hit',mode:'voice',raw:'hit',conf:0.95},over),at(0));
  let r=by({raw:'hold'});
  ok(!r.ok&&r.kind==='mismatch'&&/not the command hit/.test(r.why),'a heard hold written as a hit is refused by name: '+J(r));
  r=by({cmd:'reject',raw:'hit'});
  ok(!r.ok&&r.kind==='mismatch','and a heard hit written as not a hit');
  r=by({raw:'HIT'});
  ok(!r.ok,'a phrase not in the folded form is refused: '+J(r));
  r=by({raw:'yes that one'});
  ok(!r.ok&&/none of the commands/.test(r.why),'free words are refused');
  r=by({raw:'release'});
  ok(!r.ok&&r.kind==='release','release is refused even when it comes with the command it would stand for: '+J(r));
  r=by({raw:'hit it hard'});
  ok(!r.ok&&r.kind==='ambiguous','a command inside other words is refused');
  [F-0.01,0,null,undefined,NaN,'0.9',2].forEach(c=>{
   r=by({conf:c});
   ok(!r.ok&&r.kind==='unsure','a voice decision with confidence '+String(c)+' is refused: '+J(r));});
  r=by({raw:undefined}); ok(!r.ok,'a voice decision with no phrase is refused');
  r=by({mode:'telepathy'}); ok(!r.ok&&/modality/.test(r.why),'a modality this build does not record is refused by name: '+J(r));
  ok(was()===w0,'and none of those changed the log');
  /* the boundary: a voice line this file wrote loads, and a hand edited one
     is refused by name for what is wrong with it */
  by({});
  const base=()=>{const o=clone(E.blankProfile('B')); o.relhit=clone(p.relhit); return o;};
  const bad=(what,f,re)=>{const o=base(); f(o.relhit.log[1]); const v=E.validateProfile(o);
   ok(!v.ok&&v.errs.some(e=>re.test(e)),what+': '+J(v.errs||null));};
  ok(E.validateProfile(base()).ok,'the log with its voice line loads');
  bad('a voice line carrying free text',L=>{L.raw='<b>x</b>';},/not a heard phrase/);
  bad('a voice line carrying a capital',L=>{L.raw='Hit';},/not a heard phrase/);
  bad('a voice line carrying two spaces',L=>{L.raw='not  a hit';},/not a heard phrase/);
  bad('a voice line with an empty phrase',L=>{L.raw='';},/not a heard phrase/);
  bad('a voice line with a phrase that is not text',L=>{L.raw=5;},/not a heard phrase/);
  bad('a voice line with a phrase past the cap',L=>{L.raw='a'.repeat(E.RELHIT_VOICE_RAW_MAX+1);},/not a heard phrase/);
  bad('a voice line with no confidence',L=>{L.conf=null;},/voice line is not 0 to 1/);
  bad('a voice line with a confidence above 1',L=>{L.conf=2;},/voice line is not 0 to 1/);
  bad('a voice line with a confidence that is text',L=>{L.conf='0.9';},/voice line is not 0 to 1/);
  bad('a voice line in a modality nobody records',L=>{L.mode='telepathy';},/not a modality/);
  /* the floor is the writer's, not the boundary's: a floor raised after a
     line was written must not lock a person out of their own record */
  const low=base(); low.relhit.log[1].conf=0.1;
  ok(E.validateProfile(low).ok,'a voice line written under an older, lower floor still loads');
  /* a control line still carries no words, now that a voice line may */
  const ctl=base(); ctl.relhit.log[1].mode='control'; ctl.relhit.log[1].raw='this was a hit';
  const vc=E.validateProfile(ctl);
  ok(!vc.ok&&vc.errs.some(e=>/not the control's own command/.test(e)),'a control line holding a heard phrase is refused: '+J(vc.errs||null));}};

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
  from:"'summaries','journey','relhit'];", to:"'summaries','journey'];"},

 /* ---- voice, the engine half. Each is a rule of the parser or its path,
    broken in a copy of the engine, and the suite that guards it must fail ---- */
 {suite:'voicefloor', what:'the confidence floor is removed',
  from:"if(conf<RELHIT_VOICE_FLOOR)", to:"if(false)"},
 {suite:'voicefloor', what:'a phrase heard with no confidence is taken as clear',
  from:"if(!(NUM(conf)&&conf>=0&&conf<=1))", to:"if(false)"},
 {suite:'voicefloor', what:'the floor is set to zero',
  from:"const RELHIT_VOICE_FLOOR=0.8;", to:"const RELHIT_VOICE_FLOOR=0;"},
 {suite:'voice', what:'release is accepted as a command',
  from:"hit:['hit','this was a hit']", to:"hit:['hit','release','this was a hit']"},
 {suite:'voice', what:'keep is heard as a hit',
  from:"hold:['hold','keep'], hit:['hit',", to:"hold:['hold'], hit:['keep','hit',"},
 {suite:'voice', what:'the case of what was said matters',
  from:"function rhHeardNorm(s){\n return String(s).toLowerCase()", to:"function rhHeardNorm(s){\n return String(s)"},
 {suite:'voicebad', what:'a command inside other words is taken for the command',
  from:"if(raw.length<=RELHIT_VOICE_RAW_MAX&&own.call(RH_HEARD.by,raw)){\n  var cmd=RH_HEARD.by[raw];",
  to:"var hk=Object.keys(RH_HEARD.by).filter(function(q){return (' '+raw+' ').indexOf(' '+q+' ')>=0;});\n if(hk.length){\n  raw=hk[0]; var cmd=RH_HEARD.by[raw];"},
 {suite:'voicebad', what:'a command word among other words is not called ambiguous',
  from:"if(w.some(function(x){return own.call(RH_HEARD.words,x);}))", to:"if(false)"},
 {suite:'voiceboundary', what:'free text is accepted on a voice line at the boundary',
  from:"if(typeof x.raw!=='string'||x.raw.length>RELHIT_VOICE_RAW_MAX||!RH_RAW.test(x.raw))", to:"if(false)"},
 {suite:'voiceboundary', what:'a voice line with no confidence loads',
  from:"if(!(NUM(x.conf)&&x.conf>=0&&x.conf<=1))errs.push(path+'.conf of a voice line is not 0 to 1');}", to:"}"},
 {suite:'voiceboundary', what:'relHitDecide takes a voice decision without holding the phrase or the floor',
  from:"if(a.mode==='voice'){", to:"if(false){"},
 {suite:'voiceboundary', what:'a heard phrase that names another command is written as the one pressed',
  from:"if(h.cmd!==a.cmd||h.raw!==a.raw)", to:"if(false)"},
 {suite:'refuse', what:'a control line may carry words',
  from:"if(x.mode==='control'&&x.raw!==x.cmd)", to:"if(false)"},
 {suite:'voicepath', what:'voice is not a modality this build records',
  from:"const RELHIT_MODES=['control','voice'];", to:"const RELHIT_MODES=['control'];"},
 {suite:'voicepath', what:'a spoken press is given a new event id each time it is delivered',
  from:"return relHitDecide(p,{ev:a.ev, sid:a.sid, pat:a.pat, cmd:h.cmd, mode:'voice'",
  to:"return relHitDecide(p,{ev:a.ev+Math.random().toString(36).slice(2,9), sid:a.sid, pat:a.pat, cmd:h.cmd, mode:'voice'"},
 {suite:'voiceone', what:'every spoken command is handed on as a hit',
  from:"pat:a.pat, cmd:h.cmd, mode:'voice'", to:"pat:a.pat, cmd:'hit', mode:'voice'"}];

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
