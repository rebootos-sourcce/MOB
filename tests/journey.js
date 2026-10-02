/* Journey gate. engine/journey.js and engine/data/onboarding.js, slices O0, O1
   and O3 of ATUNED-onboarding-REVIEW-2-systems.md section (f), with the owner's
   rulings of round OX.

   Run from tests/engine.js by one line, with that file's own ok() and g(), or
   on its own: node tests/journey.js. Headless, from the repo root.

   EVERY SUITE IS A FUNCTION OF AN ENGINE, so the same assertions run twice:
   against the real engine, where every one must pass, and against copies of
   engine.js with one rule deliberately broken, where the suite that guards
   that rule must fail. A gate that cannot fail is not a gate. The loader is
   checked on an unbroken copy first.

   THE EVENT LIST IS READ OFF THE TDD, not typed here. A list typed twice is
   two lists that drift, and the document is the specification. The extractor
   is checked against a count it must find before anything is compared.

   NO CLOCK IS TRUSTED. The boundary refuses a date more than a day ahead, so
   every moment here is built from one reading of the clock at the top and
   moved by whole days, and a writer is handed its moment rather than reading
   one. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const ROOT=process.cwd();
const TDD_FILE=path.resolve(ROOT,'ATUNED-onboarding-first-experience-TDD.md');
const ENGINE_FILE=path.resolve(ROOT,process.env.ENGINE||'engine.js');
const DAY=86400000, T0=Date.now();
const at=d=>new Date(T0+d*DAY).toISOString();
const J=x=>JSON.stringify(x);
const clone=x=>JSON.parse(JSON.stringify(x));

/* ---------------- the TDD, read ---------------- */
const TDD=fs.existsSync(TDD_FILE)?fs.readFileSync(TDD_FILE,'utf8'):'';
function tddEvents(){
 const m=/^# 46\. Required Events\s*$/m.exec(TDD); if(!m)return null;
 const rest=TDD.slice(m.index+m[0].length), s=rest.indexOf('```text'); if(s<0)return null;
 const e=rest.indexOf('```',s+7);
 return rest.slice(s+7,e).split('\n').map(l=>l.trim()).filter(Boolean);}

/* ---------------- the worked record ---------------- */
/* a person who has opened three addresses across the four channels, which is
   twelve lines of new ground, so the gift is at twelve of a hundred. Addresses
   are the first six somatic nodes that carry a fetter. */
function addrs(E,n){return E.W.filter(x=>x.cf).slice(0,n||6).map(x=>x.i);}
function fixture(E,open){
 const p=E.blankProfile('Test person');
 const ids=addrs(E,6), k=open===undefined?3:open;
 if(k){const keys=E.meterPlan(p,ids.slice(0,k),E.ONB_CHANS,k*4); E.meterRun(p,keys);}
 return p;}
/* what the boundary says about a record, as the first error and the whole list */
function verdict(E,o){const v=E.validateProfile(o); return {ok:v.ok, errs:v.errs||[], v:v};}
function refuses(E,o,part){const r=verdict(E,o); return !r.ok&&r.errs.some(e=>e.indexOf(part)>=0);}

/* ============================================================
   THE SUITES
   ============================================================ */
const SUITES={

tables(E,ok){
 const ev=tddEvents();
 ok(ev&&ev.length>=20,'the extractor found the events in TDD section 46, '+(ev&&ev.length));
 ok(ev&&J(E.JOURNEY_EVENTS)===J(ev),'the engine carries the TDD\'s events, in its order, no more and no fewer: '
  +(ev?E.JOURNEY_EVENTS.length+' against '+ev.length:'none read'));
 ok(E.JOURNEY_EVENTS.every(x=>/^[a-z]+(_[a-z]+)*$/.test(x)),'every event is lower snake case');
 ok(new Set(E.JOURNEY_EVENTS).size===E.JOURNEY_EVENTS.length,'no event is listed twice');
 /* the integrity ten, in the owner's order, round OX */
 const OWNER=['Truth','Transparency','Unity','Humility','Compassion','Duty','Accountability','Patience','Temperance','Forgiveness'];
 const T=E.JOURNEY_INTEGRITY;
 ok(J(T.map(q=>q.law))===J(OWNER),'the ten laws are the owner\'s ten, in his order: '+J(T.map(q=>q.law)));
 ok(T.every(q=>q.id===q.law.toLowerCase()),'each id is its law, lower case');
 ok(new Set(T.map(q=>q.id)).size===T.length,'no id is used twice');
 ok(T.every(q=>E.SINAMES.indexOf(q.law)>=0),'every law is one of the twenty one');
 ok(T.every(q=>['moment','ask','lo','hi'].every(f=>typeof q[f]==='string'&&q[f].length>8)),
  'every question has its moment, its ask and its two ends');
 ok(T.every(q=>/^(review3 Q\d\d|drafted)$/.test(q.src)),'every row says whether it is Review 3\'s copy or drafted');
 ok(T.filter(q=>q.src==='drafted').map(q=>q.law).join()==='Transparency,Unity,Duty',
  'the three drafted rows are the three Review 3 did not write: '+T.filter(q=>q.src==='drafted').map(q=>q.law).join());
 ok(T.every(q=>q.ask.slice(-1)==='?'),'every ask is a question');
 ok(!/—/.test(J(E.JOURNEY_INTEGRITY)),'no em dash in a question');
 ok(E.JOURNEY_MID==='about half the time','the middle of the scale is the same on every question');
 /* the stem, five channels, and the shipped one left alone */
 ok(E.ONB_STEM==='I am releasing believing, thinking, feeling, behaving and acting that I am ',
  'the first run\'s stem is his words: '+J(E.ONB_STEM));
 ok(J(E.ONB_VERB)===J(['believing','thinking','feeling','behaving','acting']),'five channels, in his order');
 ok(E.C3_VERB.length===6&&/^I am letting go of believing, perceiving, thinking, behaving, acting, and feeling that I am $/.test(E.C3_STEM),
  'the shipped six channel stem is exactly as it was: '+J(E.C3_STEM));
 ok(E.ONB_STEM!==E.C3_STEM,'and the two are not one constant');
 /* sizes */
 ok(E.GIFT_N===100,'the gift is a hundred');
 ok(E.ONB_MINI_ADDRS*E.RUN_MIN===12,'the mini release is twelve lines, three addresses');
 ok(E.ONB_CHANS.length===E.RUN_MIN,'a run is the four channels, and four is the smallest run');
 ok(E.ONB_CHANS.every(c=>/^[LR](limit|truth)$/.test(c)),'each channel is a side and a track');
 ok(J(E.JOURNEY_END)===J(['completed','ended','closed']),'a run ends three ways');
 /* the claim's two lists name every key the blank has, between them */
 const keys=Object.keys(E.blankProfile('k')), S=E.JOURNEY_CLAIM_SEND, N=E.JOURNEY_CLAIM_NEVER;
 ok(keys.every(k=>S.indexOf(k)>=0||N.indexOf(k)>=0),
  'every top level key of the record is ruled in or out of a claim: '+keys.filter(k=>S.indexOf(k)<0&&N.indexOf(k)<0).join());
 ok(S.concat(N).every(k=>keys.indexOf(k)>=0),'and a claim names no key the record does not have: '+S.concat(N).filter(k=>keys.indexOf(k)<0).join());
 ok(!S.some(k=>N.indexOf(k)>=0),'and no key is on both lists');
 ok(['who','name','id','plan','ui'].every(k=>N.indexOf(k)>=0),'who, name, id, plan and ui never cross');
},

blank(E,ok){
 const b=E.blankProfile('b');
 ok(J(b.journey)===J(E.journeyBlank()),'a new record carries the blank journey');
 ok(b.journey.v===1&&b.journey.gift===null&&b.journey.claimed===null&&b.journey.runs.length===0
  &&b.journey.log.length===0&&Object.keys(b.journey.integrity.answers).length===0,'and it is empty');
 const r=E.validateProfile(clone(b));
 ok(r.ok&&J(r.profile.journey)===J(b.journey),'the blank round trips through the boundary unchanged');
 /* a record from before the journey existed fills from the blank */
 const old=clone(b); delete old.journey;
 const r2=E.validateProfile(old);
 ok(r2.ok&&J(r2.profile.journey)===J(E.journeyBlank()),'a record with no journey loads equal to the blank');
 const old2=clone(b); old2.journey=null;
 ok(E.validateProfile(old2).ok,'and so does one carrying null');
 /* and a record that was a version one before the schema moved to two */
 const v1=clone(b); v1.v=1; delete v1.journey;
 ok(E.validateProfile(v1).ok,'a version 1 record still loads');
 /* loadProfile, the other door, fills it too */
 const raw=clone(b); delete raw.journey;
 E.loadProfile(raw);
 ok(raw.journey&&raw.journey.v===1,'loadProfile fills a missing journey as well');
 E.loadProfile(E.blankProfile('after the journey gate'));
 /* export, import, export is identical, with everything the journey holds */
 const p=fixture(E);
 E.journeyRun(p,'completed',{lines:12,fresh:12,rerun:false},at(-3));
 E.journeyRun(p,'completed',{lines:4,fresh:0,rerun:true},at(-2));
 E.journeyRun(p,'closed',{lines:0,fresh:0,rerun:false},at(-1));
 E.journeyGiftExtra(p,'referral',25,at(-1));
 E.journeyIntegrityAnswer(p,'truth',7,at(-1));
 E.journeyClaimed(p,'local',at(-1));
 const o1=J(p), v=E.validateProfile(JSON.parse(o1));
 ok(v.ok,'a record carrying every part of the journey loads: '+J(v.errs));
 const o2=J(v.profile), v2=E.validateProfile(JSON.parse(o2));
 ok(v2.ok&&J(v2.profile)===o2,'export, import, export is identical');
 ok(J(v.profile.journey)===J(p.journey),'and the journey comes back as it went in');
},

boundary(E,ok){
 /* every refusal, by the name it gives. A refusal is never a clamp, so the
    record is refused whole and nothing is returned for it to be loaded as. */
 const mk=()=>{const p=fixture(E);
  E.journeyRun(p,'completed',{lines:12,fresh:12,rerun:false},at(-3));
  E.journeyIntegrityAnswer(p,'truth',7,at(-2));
  return clone(p);};
 const base=mk();
 ok(E.validateProfile(clone(base)).ok,'the worked record loads, so every refusal below is the change and not the record');
 const C=(name,f,part)=>{const o=clone(base); f(o);
  const r=verdict(E,o);
  ok(!r.ok&&r.errs.some(e=>e.indexOf(part)>=0),name+', refused naming '+J(part)+': '+J(r.errs.slice(0,2)));};
 C('an unknown key under journey',o=>{o.journey.extra=1;},'journey may not carry extra');
 C('a journey that is not an object',o=>{o.journey=[];},'journey is not an object');
 C('a journey version this build does not read',o=>{o.journey.v=2;},'not a journey version this build reads');
 C('an unknown key under a run',o=>{o.journey.runs[0].why='x';},'journey.runs[0] may not carry why');
 C('a run date that is not a date',o=>{o.journey.runs[0].t='soon';},'journey.runs[0].t is not a date');
 C('a run date ahead of the clock',o=>{o.journey.runs[0].t=at(30);},'journey.runs[0].t is ahead of the clock');
 C('a run that ended some other way',o=>{o.journey.runs[0].end='won';},'journey.runs[0].end is not completed, ended or closed');
 C('lines that are not whole',o=>{o.journey.runs[0].lines=2.5;},'journey.runs[0].lines is not a whole number');
 C('lines out of range',o=>{o.journey.runs[0].lines=-1;},'journey.runs[0].lines is -1');
 C('fresh above lines',o=>{o.journey.runs[0].lines=3;o.journey.runs[0].fresh=4;},'journey.runs[0].fresh is more than lines');
 C('a rerun that opened ground',o=>{o.journey.runs[0].rerun=true;},'on a rerun, which opens nothing');
 C('a rerun that is not true or false',o=>{o.journey.runs[0].rerun='no';},'journey.runs[0].rerun is not true or false');
 C('a closed run that committed lines',o=>{o.journey.runs[0].end='closed';},'is closed and holds lines');
 C('more new ground than the meter holds',o=>{o.meter.unique=o.meter.unique.slice(0,4);},'new lines, more than the 4 this record has opened');
 C('a runs list that is not a list',o=>{o.journey.runs={};},'journey.runs is not a list');
 C('a runs list over its ceiling',o=>{o.journey.runs=new Array(E.JOURNEY_RUNS_MAX+1).fill({t:at(-1),lines:0,fresh:0,rerun:false,end:'closed'});},'more than the '+E.JOURNEY_RUNS_MAX+' a record may carry');
 C('a log line outside the events',o=>{o.journey.log.push({seq:o.journey.log.length+1,type:'bought_it',at:at(-1),ref:null,d:{}});},'is not an event type: bought_it');
 C('a log with a gap in its numbers',o=>{o.journey.log[1].seq=9;},'journey.log[1].seq is not the next number');
 C('a log line with free text in its detail',o=>{o.journey.log[0].d={note:'I cried at the board meeting'};},'journey.log[0].d.note is free text');
 C('a log line with a free text reference',o=>{o.journey.log[0].ref='the story I wrote';},'journey.log[0].ref is not a key into the record');
 C('a log line with an unknown key',o=>{o.journey.log[0].text='x';},'journey.log[0] may not carry text');
 C('a log line with a detail key that is not a word',o=>{o.journey.log[0].d={'Not A Key':1};},'journey.log[0].d may not carry Not A Key');
 C('a log line with too many details',o=>{o.journey.log[0].d={a:1,b:1,c:1,d:1,e:1,f:1,g:1};},'journey.log[0].d holds 7 values, more than 6');
 C('a log line dated in the future',o=>{o.journey.log[0].at=at(40);},'journey.log[0].at is ahead of the clock');
 C('a log over its cap',o=>{o.journey.log=[];for(let i=0;i<E.JOURNEY_LOG_MAX+1;i++)o.journey.log.push({seq:i+1,type:'tier_viewed',at:at(-1),ref:null,d:{}});},'journey.log is full');
 C('an integrity answer for a question that does not exist',o=>{o.journey.integrity.answers.courage=5;},'journey.integrity.answers names no question: courage');
 C('an integrity answer out of range',o=>{o.journey.integrity.answers.truth=11;},'journey.integrity.answers.truth is 11, outside 0 to 10');
 C('an integrity answer that is not whole',o=>{o.journey.integrity.answers.truth=6.5;},'journey.integrity.answers.truth is not a whole number');
 C('integrity answers with no start date',o=>{o.journey.integrity.at0=null;},'journey.integrity.at0 is missing');
 C('integrity finished with questions unanswered',o=>{o.journey.integrity.at1=at(-1);},'says it was finished and 1 of 10 are answered');
 C('an integrity finish before its start',o=>{const a=o.journey.integrity.answers;E.JOURNEY_INTEGRITY.forEach(q=>{a[q.id]=5;});o.journey.integrity.at0=at(-1);o.journey.integrity.at1=at(-2);},'journey.integrity.at1 is before at0');
 C('an unknown key under integrity',o=>{o.journey.integrity.score=3;},'journey.integrity may not carry score');
 C('a claim stamp with a via it does not know',o=>{o.journey.claimed={at:at(-1),via:'email'};},'journey.claimed.via is not local, record, file or account');
 C('a gift from somewhere it was not issued',o=>{o.journey.gift={at:at(-1),src:'shop',granted:100,used:0,remaining:100,extras:[]};},'journey.gift.src is not funnel or app');
 C('a gift counter that does not add up',o=>{o.journey.gift={at:at(-1),src:'app',granted:100,used:12,remaining:99,extras:[]};},'which do not make 100');
 C('a gift counter that has used more than it was given',o=>{o.journey.gift={at:at(-1),src:'app',granted:100,used:101,remaining:0,extras:[]};},'journey.gift.used is 101');
 C('a gift extra with a name that is not a name',o=>{o.journey.gift={at:at(-1),src:'app',granted:100,used:0,remaining:100,extras:[{k:'Two Words',n:1,at:at(-1)}]};},'is not a counter name');
 C('a gift extra listed twice',o=>{const x={k:'referral',n:1,at:at(-1)};o.journey.gift={at:at(-1),src:'app',granted:100,used:0,remaining:100,extras:[x,x]};},'lists referral twice');
 C('too many gift extras',o=>{const ex=[];for(let i=0;i<E.JOURNEY_EXTRAS_MAX+1;i++)ex.push({k:'c'+i,n:1,at:at(-1)});o.journey.gift={at:at(-1),src:'app',granted:100,used:0,remaining:100,extras:ex};},'journey.gift.extras holds');
 C('an unknown key on the gift',o=>{o.journey.gift={at:at(-1),src:'app',granted:100,used:0,remaining:100,extras:[],tier:'four'};},'journey.gift may not carry tier');
 C('a gift extra that is text',o=>{o.journey.gift={at:at(-1),src:'app',granted:100,used:0,remaining:100,extras:[{k:'referral',n:'25 free',at:at(-1)}]};},'journey.gift.extras[0].n is not a whole number');
 /* and the top level names the record may never hold */
 ['user_id','userId','customer_id','token','session','password','email'].forEach(k=>{
  C('a record carrying '+k,o=>{o[k]='x';},k+' is not held by this product');});
 /* the shapes that are not shapes, each refused by the name of the part */
 C('a run that is not an object',o=>{o.journey.runs=[7];},'journey.runs[0] is not an object');
 C('a log line that is not an object',o=>{o.journey.log=[7];},'journey.log[0] is not an object');
 C('a log that is not a list',o=>{o.journey.log={};},'journey.log is not a list');
 C('a log detail that is not an object',o=>{o.journey.log[0].d=[1];},'journey.log[0].d is not an object');
 C('a gift that is not an object',o=>{o.journey.gift=5;},'journey.gift is not an object');
 C('gift extras that are not a list',o=>{o.journey.gift={at:at(-1),src:'app',granted:100,used:0,remaining:100,extras:{}};},'journey.gift.extras is not a list');
 C('a gift extra that is not an object',o=>{o.journey.gift={at:at(-1),src:'app',granted:100,used:0,remaining:100,extras:[3]};},'journey.gift.extras[0] is not an object');
 C('a claim stamp that is not an object',o=>{o.journey.claimed='yes';},'journey.claimed is not an object');
 C('an integrity record that is not an object',o=>{o.journey.integrity=[];},'journey.integrity is not an object');
 C('integrity answers that are not an object',o=>{o.journey.integrity.answers=[];},'journey.integrity.answers is not an object');
 C('a gift counter with no number in it',o=>{o.journey.gift={at:at(-1),src:'app',used:0,remaining:100,extras:[]};},'journey.gift.granted is not a whole number');
 /* the boundary called on its own: the defaults it documents */
 {const e1=[]; const d1=E.journeyValidate(e1,undefined);
  ok(e1.length===0&&J(d1)===J(E.journeyBlank()),'called with nothing it reads the blank and says nothing');
  const e2=[]; E.journeyValidate(e2,'x'); ok(e2.join()==='journey is not an object','a string is refused under the default name: '+e2.join());
  const e3=[]; E.journeyValidate(e3,{runs:[{t:at(-1),lines:4,fresh:4,rerun:false,end:'completed'}]},'record.journey',{unique:3,now:T0});
  ok(e3.join()==='record.journey.runs holds 4 new lines, more than the 3 this record has opened','a path and a context are honoured: '+e3.join());
  const e4=[]; E.journeyValidate(e4,{log:[{seq:1,type:'tier_viewed',at:at(2),ref:null,d:{}}]},'journey',{now:T0+5*DAY});
  ok(e4.length===0,'and a clock handed in is the clock the dates are read against');
  const e5=[]; E.journeyValidate(e5,{log:[{seq:1,type:'tier_viewed',at:at(-1),ref:null,d:{}}]},'journey',{now:'not a date'});
  ok(e5.length===0,'a clock that is not a date falls back to the real one and does not throw');}
 /* a refusal is the whole record and never a partial one */
 const bad=clone(base); bad.journey.runs[0].end='won';
 ok(E.validateProfile(bad).profile===undefined,'a refused record returns no profile to load');
 /* a clean record is never refused for what the journey is allowed to hold */
 const ok1=clone(base); ok1.journey.gift={at:at(-1),src:'funnel',granted:100,used:12,remaining:88,extras:[{k:'referral',n:25,at:at(-1)}]};
 ok(E.validateProfile(ok1).ok,'a gift with an extra is a good record');
 const ok2=clone(base); ok2.journey.log=[{seq:1,type:'tier_viewed',at:at(-1),ref:'2026-10-01T09:00:00.000Z',d:{n:3,kind:'free',seen:true}}];
 ok(E.validateProfile(ok2).ok,'a log line may reference an entry by its date and carry counts, words and flags');
},

log(E,ok){
 const p=E.blankProfile('log');
 const a=E.journeyLog(p,'tutorial_started',null,null,at(-1));
 ok(a.ok&&a.entry.seq===1&&a.entry.type==='tutorial_started'&&a.entry.ref===null,'a first line is number one: '+J(a));
 const b=E.journeyLog(p,'story_submitted','2026-10-01T09:00:00.000Z',{lines:3},at(-1));
 ok(b.ok&&b.entry.seq===2,'and the next is two');
 ok(p.journey.log.map(e=>e.seq).join()==='1,2','the log is gapless');
 const n=p.journey.log.length;
 const bad=[['an event not in the set',()=>E.journeyLog(p,'bought_it',null,null,at(-1)),'not an event type'],
  ['a detail that is words',()=>E.journeyLog(p,'tier_viewed',null,{note:'I want to stop'},at(-1)),'is free text'],
  ['a reference that is a sentence',()=>E.journeyLog(p,'tier_viewed','my whole story',null,at(-1)),'not a key into the record'],
  ['a moment in the future',()=>E.journeyLog(p,'tier_viewed',null,null,at(60)),'ahead of the clock']];
 bad.forEach(x=>{const r=x[1](); ok(r.ok===false&&r.why.indexOf(x[2])>=0,x[0]+' is refused naming '+J(x[2])+': '+J(r.why));});
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
 /* a moment as a number of milliseconds, as a string, and not handed in at all */
 {const m=E.blankProfile('m');
  const n1=E.journeyLog(m,'tier_viewed',null,null,T0-DAY), n2=E.journeyLog(m,'tier_viewed',null,null,at(-1)), n3=E.journeyLog(m,'tier_viewed');
  ok(n1.ok&&n1.entry.at===new Date(T0-DAY).toISOString(),'a number is read as milliseconds: '+J(n1.entry&&n1.entry.at));
  ok(n2.ok&&n2.entry.at===at(-1),'a string is kept as it is');
  ok(n3.ok&&Math.abs(Date.parse(n3.entry.at)-Date.now())<5000,'and none reads the clock once, for the caller that gave none');
  ok(E.journeyLog(m,'tier_viewed',undefined,undefined,at(-1)).ok,'an undefined reference and detail are none');}
 /* a record that never had a journey gets one rather than a throw */
 const r=E.blankProfile('r'); delete r.journey;
 ok(E.journeyLog(r,'tier_viewed',null,null,at(-1)).ok&&r.journey.log.length===1,'a writer fills a missing journey');
 /* every event in the set can be written, so the closed set is one a caller can use whole */
 const all=E.blankProfile('all');
 const results=E.JOURNEY_EVENTS.map(t=>E.journeyLog(all,t,null,null,at(-1)).ok);
 ok(results.every(Boolean),'every one of the '+E.JOURNEY_EVENTS.length+' events can be logged');
},

gift(E,ok){
 const p=fixture(E,3);
 ok(p.journey.gift===null,'a record has no gift stamp until it is issued');
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
 /* the counter space */
 ok(E.journeyGiftExtra(p,'referral',25,at(-2)).ok&&p.journey.gift.extras[0].n===25,'a counter beside the gift can carry another count');
 ok(E.journeyGiftExtra(p,'referral',30,at(-1)).ok&&p.journey.gift.extras.length===1&&p.journey.gift.extras[0].n===30,
  'setting it again sets it and does not add one');
 ok(E.journeyGiftExtra(p,'Not A Name',1,at(-1)).ok===false,'a name that is not a counter name is refused');
 ok(E.journeyGiftExtra(p,'referral',-1,at(-1)).ok===false&&E.journeyGiftExtra(p,'referral',2.5,at(-1)).ok===false,
  'a count that is negative or not whole is refused');
 ok(E.journeyGiftExtra(p,'referral','25',at(-1)).ok===false,'and text is not a count');
 ok(p.journey.gift.extras[0].n===30,'and a refusal leaves the counter as it was');
 for(let k=0;k<E.JOURNEY_EXTRAS_MAX+3;k++)E.journeyGiftExtra(p,'c'+k,1,at(-1));
 ok(p.journey.gift.extras.length===E.JOURNEY_EXTRAS_MAX,'the space has a ceiling: '+p.journey.gift.extras.length);
 ok(E.journeyGiftExtra(p,'referral',31,at(-1)).ok,'and a name already there can still be set at the ceiling');
 ok(E.journeyGiftExtra(E.blankProfile('n'),'x',1).ok===false,'a record with no gift has no counter space');
 ok(E.journeyGiftExtra(null,'x',1).ok===false&&E.journeyGiftIssue(null,'app').ok===false,'no record is refused by both writers');
 {const ng=E.blankProfile('ng'); ok(E.journeyGiftSync(ng)===null&&ng.journey.gift===null,'syncing a gift that was never issued issues nothing');}
 {const big=E.blankProfile('big'); E.journeyGiftIssue(big,'funnel',at(-1));
  ok(big.journey.gift.src==='funnel'&&E.validateProfile(clone(big)).ok,'a gift issued by the funnel is a gift');
  const gg=clone(big); gg.journey.gift.granted=1e6; gg.journey.gift.remaining=1e6;
  ok(E.validateProfile(gg).ok,'and a counter may be as large as the ceiling');}
 /* THE COUNTER CANNOT GRANT. The allowance counts the meter and the gift row. */
 const before=E.planAllowance(p.plan,p.meter.unique.length,E.meterGiftAt(p),at(0));
 E.journeyGiftExtra(p,'referral',99999,at(0)); p.journey.gift.granted=5000; p.journey.gift.remaining=4988;
 const after=E.planAllowance(p.plan,p.meter.unique.length,E.meterGiftAt(p),at(0));
 ok(J(before)===J(after),'no value on the counter or its extras moves planAllowance: '+before.left+' then '+after.left);
 ok(E.meterBudget(p,at(0)).left===before.left,'nor the budget a run is planned against');
 /* the derived counter agrees with the allowance, in the gift and at its end */
 const rd=E.journeyGiftRead(p);
 ok(rd.granted===100&&rd.remaining===E.planAllowance(p.plan,p.meter.unique.length,null,at(0)).left,
  'the derived counter equals planAllowance\'s own while the gift lasts');
 ok(rd.drift===true,'a stored counter that disagrees with the meter is reported as drift');
 E.journeyGiftSync(p);
 ok(E.journeyGiftRead(p).drift===false&&p.journey.gift.granted===100&&p.journey.gift.used===12,'and sync writes it back from the meter and from nowhere else');
 /* spending it all */
 const s=E.blankProfile('spent'); const ids=addrs(E,30);
 const keys=E.meterPlan(s,ids,E.ONB_CHANS,100); E.meterRun(s,keys);
 ok(s.meter.unique.length===100,'a hundred lines opened is the gift spent');
 const rs=E.journeyGiftRead(s);
 ok(rs.spent===true&&rs.remaining===0&&rs.used===100,'the counter reads spent and nothing remaining: '+J(rs));
 E.journeyGiftIssue(s,'app',at(-1));
 ok(s.journey.gift.used===100&&s.journey.gift.remaining===0&&E.validateProfile(clone(s)).ok,'and a spent counter is a record that loads');
},

runs(E,ok){
 const p=fixture(E,3);
 const bad=[['no record',()=>E.journeyRun(null,'completed',{lines:4,fresh:0,rerun:false}),'no record'],
  ['an end that is not one',()=>E.journeyRun(p,'won',{lines:4,fresh:0,rerun:false},at(-1)),'journey.runs[0].end is not completed, ended or closed'],
  ['lines that are not a count',()=>E.journeyRun(p,'completed',{lines:'4',fresh:0,rerun:false},at(-1)),'journey.runs[0].lines is not a whole number'],
  ['no facts at all',()=>E.journeyRun(p,'completed',null,at(-1)),'is not a whole number'],
  ['fresh above lines',()=>E.journeyRun(p,'completed',{lines:4,fresh:8,rerun:false},at(-1)),'journey.runs[0].fresh is more than lines'],
  ['new ground the meter does not hold',()=>E.journeyRun(p,'completed',{lines:40,fresh:40,rerun:false},at(-1)),'more than the 12 this record has opened'],
  ['a closed run that committed',()=>E.journeyRun(p,'closed',{lines:4,fresh:0,rerun:false},at(-1)),'a closed run commits nothing'],
  ['a rerun that opened ground',()=>E.journeyRun(p,'completed',{lines:4,fresh:4,rerun:true},at(-1)),'on a rerun, which opens nothing'],
  ['a moment ahead of the clock',()=>E.journeyRun(p,'completed',{lines:4,fresh:0,rerun:false},at(45)),'ahead of the clock']];
 bad.forEach(x=>{const r=x[1](); ok(r.ok===false&&r.why.indexOf(x[2])>=0,x[0]+' is refused naming '+J(x[2])+': '+J(r.why));});
 ok(p.journey.runs.length===0&&p.journey.log.length===0&&p.journey.gift===null,'and every refusal wrote nothing at all');
 {const nm=E.blankProfile('nm'); delete nm.meter;
  const r=E.journeyRun(nm,'completed',{lines:4,fresh:4,rerun:false},at(-1));
  ok(r.ok===false&&/more than the 0 this record has opened/.test(r.why),'a record with no meter has opened nothing, so a run of new ground on it is refused: '+J(r.why));}
 /* the first release, completed */
 const r1=E.journeyRun(p,'completed',{lines:12,fresh:12,rerun:false},at(-3));
 ok(r1.ok&&r1.index===0&&r1.run.end==='completed'&&r1.run.lines===12&&r1.run.fresh===12&&r1.run.rerun===false,'a completed run is one item: '+J(r1.run));
 ok(p.journey.runs.length===1,'one item and not two');
 ok(p.journey.gift&&p.journey.gift.src==='app'&&p.journey.gift.used===12,'the first run issues the gift and syncs its counter');
 ok(r1.logged.join()==='starter_gift_issued,pattern_released,first_release_completed','and logs the gift, the release and the first completion: '+r1.logged.join());
 /* a run ended early is a run, and not the first completion */
 E.meterRun(p,E.meterPlan(p,addrs(E,6).slice(3,4),E.ONB_CHANS,4));
 const r2=E.journeyRun(p,'ended',{lines:4,fresh:4,rerun:false},at(-2));
 ok(r2.ok&&r2.run.end==='ended'&&r2.logged.join()==='pattern_released','an ended run is logged as a release and is not a first completion: '+r2.logged.join());
 ok(p.journey.gift.used===16,'and the counter moves with the meter');
 /* a second completion is not the first */
 E.meterRun(p,E.meterPlan(p,addrs(E,6).slice(4,5),E.ONB_CHANS,4));
 const r3=E.journeyRun(p,'completed',{lines:4,fresh:4,rerun:false},at(-1));
 ok(r3.logged.indexOf('first_release_completed')<0,'the first completion is logged once, not on the second');
 ok(p.journey.log.filter(e=>e.type==='first_release_completed').length===1,'and the log holds one');
 /* a rerun */
 const r4=E.journeyRun(p,'completed',{lines:4,fresh:0,rerun:true},at(0));
 ok(r4.ok&&r4.run.rerun===true&&r4.logged.join()==='pattern_rerun','a rerun is a run with nothing opened, logged as a rerun: '+r4.logged.join());
 ok(p.journey.gift.used===20,'and it does not move the counter');
 /* a closed card */
 const before=J(p.journey.gift);
 const r5=E.journeyRun(p,'closed',{lines:0,fresh:0,rerun:false},at(0));
 ok(r5.ok&&r5.run.end==='closed'&&r5.logged.length===0,'a closed card is recorded and logs nothing');
 ok(J(p.journey.gift)===before,'and leaves the gift counter where it was');
 ok(p.journey.runs.map(r=>r.end).join()==='completed,ended,completed,completed,closed','five runs, in order: '+p.journey.runs.map(r=>r.end).join());
 ok(E.validateProfile(clone(p)).ok,'a record that took every one of those loads');
 /* nothing a run writes moves the meter */
 const m0=J(p.meter); E.journeyRun(p,'closed',{lines:0,fresh:0,rerun:false},at(0)); ok(J(p.meter)===m0,'a run record never writes the meter');
 /* a full log never stops a run being recorded */
 const q=fixture(E,3);
 for(let i=0;i<E.JOURNEY_LOG_MAX;i++)E.journeyLog(q,'tier_viewed',null,null,at(-1));
 const rf=E.journeyRun(q,'completed',{lines:12,fresh:12,rerun:false},at(-1));
 ok(rf.ok&&q.journey.runs.length===1&&rf.logged.length===0,'a full log is the lesser record: the run is still kept');
 ok(E.validateProfile(clone(q)).ok,'and the record still loads');
 /* the ceiling */
 const c=fixture(E,3); c.journey.runs=new Array(E.JOURNEY_RUNS_MAX).fill({t:at(-1),lines:0,fresh:0,rerun:false,end:'closed'});
 ok(E.journeyRun(c,'closed',{lines:0,fresh:0,rerun:false},at(-1)).ok===false,'the runs list has a ceiling and says so');
},

integrity(E,ok){
 const p=fixture(E,3); E.loadProfile(p);
 const ids=E.JOURNEY_INTEGRITY.map(q=>q.id);
 const lawsBefore=J(p.laws), intakeBefore=J(p.intake), axesBefore=J(p.axes);
 const cqBefore=J(E.compute());
 const bad=[['an id that is not one of the ten',()=>E.journeyIntegrityAnswer(p,'courage',5,at(-1)),'names no question: courage'],
  ['an id that is not text',()=>E.journeyIntegrityAnswer(p,7,5,at(-1)),'names no question'],
  ['eleven',()=>E.journeyIntegrityAnswer(p,'truth',11,at(-1)),'is 11, outside 0 to 10'],
  ['minus one',()=>E.journeyIntegrityAnswer(p,'truth',-1,at(-1)),'is -1, outside 0 to 10'],
  ['five and a half',()=>E.journeyIntegrityAnswer(p,'truth',5.5,at(-1)),'is not a whole number'],
  ['text',()=>E.journeyIntegrityAnswer(p,'truth','7',at(-1)),'is not a whole number'],
  ['nothing',()=>E.journeyIntegrityAnswer(p,'truth',undefined,at(-1)),'is not a whole number'],
  ['no record',()=>E.journeyIntegrityAnswer(null,'truth',5,at(-1)),'no record']];
 bad.forEach(x=>{const r=x[1](); ok(r.ok===false&&r.why.indexOf(x[2])>=0,x[0]+' is refused naming '+J(x[2])+': '+J(r.why));});
 ok(Object.keys(p.journey.integrity.answers).length===0&&p.journey.integrity.at0===null&&p.journey.log.length===0,
  'and every refusal wrote nothing');
 const a=E.journeyIntegrityAnswer(p,'truth',0,at(-3));
 ok(a.ok&&a.value===0&&a.answered===1&&a.complete===false&&p.journey.integrity.answers.truth===0,'zero is an answer, and it is not the same as unanswered');
 ok(a.logged.join()==='integrity_assessment_started,integrity_question_answered','the first answer starts the assessment on the log: '+a.logged.join());
 ok(p.journey.integrity.at0===at(-3)&&p.journey.integrity.at1===null,'and stamps its start');
 const b=E.journeyIntegrityAnswer(p,'truth',10,at(-2));
 ok(b.ok&&p.journey.integrity.answers.truth===10&&b.answered===1,'ten is an answer, and a changed answer replaces the value');
 ok(b.logged.join()==='integrity_question_answered'&&p.journey.integrity.at0===at(-3),'and logs only that it was answered, with the start unmoved');
 ids.slice(1).forEach((id,i)=>{E.journeyIntegrityAnswer(p,id,i+1,at(-1));});
 const rd=E.journeyRead(p,at(0));
 ok(rd.integrity.answered===10&&rd.integrity.of===10&&rd.integrity.complete===true,'ten answers is complete: '+J(rd.integrity));
 ok(p.journey.integrity.at1===at(-1),'and stamps its finish');
 ok(p.journey.log.filter(e=>e.type==='integrity_assessment_completed').length===1,'the finish is logged once');
 ok(p.journey.log.filter(e=>e.type==='integrity_question_answered').length===11,'and each answer, including the changed one, is logged');
 ok(E.validateProfile(clone(p)).ok,'a finished assessment is a record that loads');
 /* EVIDENCE ONLY. Round OX ruling 5: not ruled to write to the laws. */
 ok(J(p.laws)===lawsBefore&&J(p.intake)===intakeBefore&&J(p.axes)===axesBefore,'no answer touched the laws, the intake or the nine axes');
 ok(J(E.compute())===cqBefore,'and the whole reading is the same after ten answers as before: nothing moved a band');
 ok(E.SINAMES.every(l=>p.laws[l]===null||typeof p.laws[l]==='number')&&Object.keys(p.laws).every(l=>p.laws[l]===JSON.parse(lawsBefore)[l]),
  'every law is exactly what it was');
 E.loadProfile(E.blankProfile('after the integrity gate'));
},

read(E,ok){
 const n=E.blankProfile('new');
 const r0=E.journeyRead(n,at(0));
 ok(r0.stage==='new'&&r0.first===true&&r0.runs.n===0&&r0.runs.known===true&&r0.gift.issued===false,'a blank record is a new person: '+J({s:r0.stage,k:r0.runs.known}));
 ok(r0.integrity.answered===0&&r0.integrity.of===10&&r0.claimed===null&&r0.events===0&&r0.logFull===false,'with nothing answered, claimed or logged');
 const s=E.blankProfile('storied'); s.story.entries.push({t:at(-1),text:'I keep taking care of everybody else.',imprints:0,bands:{}});
 ok(E.journeyRead(s,at(0)).stage==='storied'&&E.journeyRead(s,at(0)).first===true,'a story and no release is storied, and still a first run');
 /* THE LEGACY RECORD. It has used the product, never counted its runs, and onboarding must not replay. */
 const l=fixture(E,3); l.meter.first=at(-100); l.story.entries.push({t:at(-90),text:'x',imprints:1,bands:{}});
 const rl=E.journeyRead(l,at(0));
 ok(rl.stage==='continuing'&&rl.first===false,'a record with a first line and no runs is continuing, not a first run');
 ok(rl.runs.known===false&&rl.runs.n===0,'and its count of releases is unknown and not nought: '+J(rl.runs));
 const intakeOnly=E.blankProfile('i'); intakeOnly.intake.completedAt=at(-9);
 ok(E.journeyRead(intakeOnly,at(0)).stage==='continuing','a finished intake alone is continuing');
 const rit=E.blankProfile('r'); rit.rituals.push({t:at(-9)});
 ok(E.journeyRead(rit,at(0)).stage==='continuing','and so is a ritual');
 /* the same record once it has a run recorded */
 E.journeyRun(l,'completed',{lines:4,fresh:0,rerun:true},at(-1));
 const rl2=E.journeyRead(l,at(0));
 ok(rl2.stage==='released'&&rl2.runs.n===1,'a recorded run makes it released');
 ok(rl2.runs.known===false,'but the count stays unknown while the meter has spoken more lines than the runs account for');
 const f=fixture(E,3); E.journeyRun(f,'completed',{lines:12,fresh:12,rerun:false},at(-1));
 const rf=E.journeyRead(f,at(0));
 ok(rf.stage==='released'&&rf.first===false&&rf.runs.known===true&&rf.runs.completed===1&&rf.runs.fresh===12&&rf.runs.lines===12,
  'a record whose runs account for its lines has a known count: '+J(rf.runs));
 const c=fixture(E,3); E.journeyRun(c,'closed',{lines:0,fresh:0,rerun:false},at(-1));
 ok(E.journeyRead(c,at(0)).runs.closed===1,'a closed card counts as closed');
 ok(E.journeyRead(c,at(0)).stage!=='released'&&E.journeyRead(c,at(0)).stage==='continuing','and is not a release: it leaves the person where they were');
 E.journeyRun(f,'ended',{lines:0,fresh:0,rerun:false},at(-1));
 ok(E.journeyRead(f,at(0)).runs.ended===1,'an ended run is counted as ended');
 /* it writes nothing, and it never throws */
 const before=J(f); E.journeyRead(f,at(0)); ok(J(f)===before,'a read writes nothing');
 let threw=null; [undefined,null,{},{journey:null},{meter:null}].forEach(x=>{try{E.journeyRead(x,at(0));}catch(e){threw=e.message;}});
 ok(!threw,'and it does not throw on a record that is missing parts: '+threw);
 const claimed=E.blankProfile('c'); E.journeyClaimed(claimed,'local',at(-1));
 ok(E.journeyRead(claimed,at(0)).claimed.via==='local','a claim shows on the read');
},

mini(E,ok){
 const p=fixture(E,0), ids=addrs(E,8);
 const stated=ids.map((id,i)=>({node:id,stated:true,inferred:false,amt:9-i}));
 const before=J(p);
 const m=E.onbMiniPlan(p,{unread:false,addrs:stated},at(0));
 ok(m.ok&&m.addrs.length===3&&m.lines===12&&m.keys.length===12,'a story that read plans three addresses and twelve lines: '+J({a:m.addrs&&m.addrs.length,l:m.lines}));
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
 /* the plan is what a run would then open */
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
 /* THE ALLOWANCE. A whole address or none, and never past what is left. */
 /* left is what the allowance leaves. Over ten it is the gift's own remainder; at ten and under it
    is the first free week's ten less what was spent past the gift, because the week's ten arrive
    the moment the gift is gone, so a record at a hundred exactly has ten and not none. */
 const mk=(left)=>{const q=fixture(E,0); q.meter.unique=[];
  const n=left>10?E.GIFT_N-left:E.GIFT_N+(10-left);
  for(let i=0;i<n;i++)q.meter.unique.push('seed'+i+':Rlimit:0'); q.meter.lines=n; return q;};
 [[100,12,3],[11,8,2],[10,8,2],[8,8,2],[7,4,1],[4,4,1]].forEach(([left,lines,n])=>{
  const q=mk(left), r=E.onbMiniPlan(q,{addrs:stated},at(0));
  ok(r.ok&&r.lines===lines&&r.addrs.length===n&&r.lines<=left,'with '+left+' left the plan is '+n+' addresses, '+lines+' lines: '+J({l:r.lines,a:r.addrs&&r.addrs.length}));});
 [3,1,0].forEach(left=>{
  const q=mk(left), r=E.onbMiniPlan(q,{addrs:stated},at(0));
  ok(r.ok===false&&r.why==='allowance','with '+left+' left there is no whole address to plan, and it is refused as the allowance: '+J(r));});
 /* a spent gift in a free week: the cap is the week's, and the plan never passes it */
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
 /* a sniffer reading, end to end, when the sniffer is in the build */
 if(typeof E.parseStory==='function'){
  const ps=E.parseStory('I keep taking care of everybody else. I am overwhelmed and I am scared things will fall apart if I do not handle them. My chest is tight when my mother calls.');
  const mp=E.onbMiniPlan(fixture(E,0),{unread:!ps.imprints.length,addrs:ps.imprints},at(0));
  ok(mp.ok&&mp.lines%4===0&&mp.lines<=12,'a real reading plans a whole number of addresses: '+J({ok:mp.ok,l:mp.lines,i:mp.inferred}));}
},

claim(E,ok){
 const p=fixture(E,3);
 p.name='Mariam Okonkwo'; p.who.first='Mariam'; p.who.last='Okonkwo'; p.who.sex='f';
 p.who.born={date:'1988-04-17',time:'06:42',place:'Lagos',zone:'Africa/Lagos',timeUnknown:false};
 p.who.sealed=at(-8);
 p.story.entries.push({t:at(-5),text:'I keep taking care of everybody else.',imprints:2,bands:{}});
 p.plan.tier='three'; p.plan.status='active'; p.plan.granted=1200;
 E.journeyRun(p,'completed',{lines:12,fresh:12,rerun:false},at(-3));
 E.journeyIntegrityAnswer(p,'truth',6,at(-2));
 p.history.push({t:at(-4),dark:'Heart',tier:null,arch:'Sage',m:E.JOURNEY_V});
 const before=J(p);
 const r=E.journeyClaim(p,at(-1));
 ok(r.ok&&r.claim.kind==='atuned.claim'&&r.claim.v===1&&r.claim.schema===E.SCHEMA_V&&r.claim.at===at(-1),'a claim is a packet with its kind, version and moment: '+J(r.errs||Object.keys(r.claim)));
 ok(J(p)===before,'building it does not touch the record');
 const body=r.claim.body, text=J(r.claim);
 /* what crosses */
 ok(body.story.entries.length===1&&body.story.entries[0].text==='I keep taking care of everybody else.','the story crosses, text included');
 ok(body.history.length===1&&body.axes&&body.laws&&body.intake&&body.meter&&body.summaries&&body.journey,'and the analytic and summary data do');
 ok(body.journey.runs.length===1&&body.journey.integrity.answers.truth===6,'and the journey does, runs and integrity answers with it');
 ok(body.meter.unique.length===12,'and the meter\'s keys');
 /* what never does */
 ['who','name','id','ui','plan','created','updated','v'].forEach(k=>ok(!(k in body),k+' is not in the body'));
 ['1988-04-17','06:42','Lagos','Africa/Lagos','Mariam','Okonkwo'].forEach(s=>ok(text.indexOf(s)<0,'"'+s+'" is nowhere in the packet: birth data and the name stay'));
 ok(text.indexOf('three')<0||text.indexOf('"tier"')<0,'and the plan is not in it');
 ok(Object.keys(body).every(k=>E.JOURNEY_CLAIM_SEND.indexOf(k)>=0),'the body holds only keys the claim is allowed to carry');
 /* pure, and shares nothing */
 ok(J(E.journeyClaim(p,at(-1)))===J(r),'the same record and the same moment give the same packet');
 body.story.entries[0].text='changed'; body.meter.unique.push('x');
 ok(p.story.entries[0].text==='I keep taking care of everybody else.'&&p.meter.unique.length===12,'and editing the packet cannot move the person\'s record');
 /* the claim's own boundary */
 const good=E.journeyClaim(p,at(-1)).claim;
 const gc=E.journeyClaimCheck(good,at(0));
 ok(gc.ok&&gc.body.story.entries[0].text==='I keep taking care of everybody else.'&&J(Object.keys(gc.body).sort())===J(Object.keys(good.body).sort()),
  'a good claim passes its own boundary and comes back with the parts it carried: '+J(gc.errs));
 ok(!('who' in gc.body)&&!('plan' in gc.body),'and with nothing it did not');
 const C=(name,f,part)=>{const c=clone(good); f(c);
  const k=E.journeyClaimCheck(c,at(0));
  ok(k.ok===false&&k.errs.some(e=>e.indexOf(part)>=0),name+', refused naming '+J(part)+': '+J((k.errs||[]).slice(0,2)));};
 C('a claim carrying the birth data',c=>{c.body.who={born:{date:'1988-04-17'}};},'claim.body.who is not carried by a claim');
 C('a claim carrying the name',c=>{c.body.name='Mariam';},'claim.body.name is not carried by a claim');
 C('a claim carrying an id',c=>{c.body.id='p1';},'claim.body.id is not carried by a claim');
 C('a claim carrying a plan',c=>{c.body.plan={tier:'four'};},'claim.body.plan is not carried by a claim');
 C('a claim carrying a switch set',c=>{c.body.ui={};},'claim.body.ui is not carried by a claim');
 C('a claim carrying a key nobody named',c=>{c.body.secrets={};},'claim.body may not carry secrets');
 C('a claim carrying a token',c=>{c.body.token='abc';},'claim.body may not carry token');
 C('a claim of the wrong kind',c=>{c.kind='record';},'claim.kind is not atuned.claim');
 C('a claim of a version it does not read',c=>{c.v=2;},'claim.v is 2');
 C('a claim from a schema that does not exist',c=>{c.schema=9;},'claim.schema is 9');
 C('a claim dated in the future',c=>{c.at=at(50);},'claim.at is ahead of the clock');
 C('a claim with a key beside its body',c=>{c.extra=1;},'claim may not carry extra');
 C('a claim with no body',c=>{c.body=null;},'claim.body is not an object');
 C('a claim with a charge of 9999',c=>{c.body.axes.Fear={held:9999,opp:0};},'claim.body: axes.Fear.held is 9999');
 C('a claim with an unknown law score',c=>{c.body.laws.Truth=77;},'claim.body: laws.Truth is 77');
 C('a claim with a bad journey inside it',c=>{c.body.journey.runs[0].end='won';},'claim.body: journey.runs[0].end');
 C('a claim with an entry that is not an entry',c=>{c.body.story.entries=[{text:3}];},'claim.body: story.entries[0]');
 ok(E.journeyClaimCheck(null,at(0)).ok===false&&E.journeyClaimCheck([],at(0)).ok===false,'no claim and a list are refused and do not throw');
 ok(E.journeyClaimed(null,'local').ok===false,'no record is not stamped');
 {const c=clone(good); c.schema='two'; const k=E.journeyClaimCheck(c,at(0));
  ok(k.ok===false&&k.errs.some(e=>e.indexOf('claim.schema is "two"')>=0),'a schema that is not a number is refused and the check still runs to the end: '+J(k.errs));}
 ok(J(good)===J(E.journeyClaim(p,at(-1)).claim),'and the refusals above did not change the packet they were made from');
 /* a record that does not validate does not make a claim */
 const badp=clone(p); badp.axes.Fear={held:9999,opp:0};
 const bc=E.journeyClaim(badp,at(0));
 ok(bc.ok===false&&bc.errs.some(e=>e.indexOf('axes.Fear.held')>=0),'a record the boundary refuses makes no claim, and says why: '+J(bc.errs));
 ok(E.journeyClaim(null,at(0)).ok===false,'no record makes none');
 /* the stamp a claim leaves, once */
 const q=E.blankProfile('stamp');
 const s1=E.journeyClaimed(q,'account',at(-2));
 ok(s1.ok&&s1.already===false&&q.journey.claimed.via==='account'&&q.journey.claimed.at===at(-2),'the stamp is written once');
 ok(q.journey.log.some(e=>e.type==='account_created'),'and a sign up logs the account');
 const s2=E.journeyClaimed(q,'file',at(-1));
 ok(s2.ok&&s2.already===true&&q.journey.claimed.via==='account'&&q.journey.claimed.at===at(-2),'a second claim changes nothing');
 ok(q.journey.log.filter(e=>e.type==='account_created').length===1,'and logs nothing');
 ok(E.journeyClaimed(E.blankProfile('v'),'email',at(-1)).ok===false,'a via that is not one of the four is refused');
 const lc=E.blankProfile('l'); E.journeyClaimed(lc,'local',at(-1));
 ok(!lc.journey.log.some(e=>e.type==='account_created'),'only an account is an account_created');
 ok(E.validateProfile(clone(q)).ok,'a claimed record loads');
 /* the network is not here: the engine is host free, and the build asserts it. */
 ok(typeof E.journeyClaim==='function'&&!/fetch|XMLHttpRequest/.test(E.journeyClaim.toString()),'the packet is built and nothing sends it');
},

dropped(E,ok){
 /* O0. The two first run flags survive a save and a reload, and what the
    boundary does not carry across is named and never silent. */
 const p=E.blankProfile('flags'); p.ui.onboarded=true; p.ui.tutorialSeen=true; p.ui.paidWelcomed=true;
 const mem={}; E.bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
 const o=clone(p); o.funnel={x:1}; o.somethingNew=[1]; o.anotherNew='y';
 mem['source.profiles']=J([o]);
 const loaded=E.pStore();
 ok(loaded.length===1&&loaded[0].ui.onboarded===true&&loaded[0].ui.tutorialSeen===true&&loaded[0].ui.paidWelcomed===true,
  'the first run flags and the welcome flag survive a reload through the boundary');
 const d=E.storeDropped();
 ok(d.length===1&&d[0].keys.slice().sort().join()==='anotherNew,funnel,somethingNew'&&d[0].name==='flags'&&d[0].i===0,
  'a top level key the boundary does not name is reported by record and by name: '+J(d));
 ok(loaded[0].funnel===undefined&&loaded[0].somethingNew===undefined,'and it is still not carried across, which was always the rule');
 mem['source.profiles']=J([clone(p)]); E.pStore();
 ok(E.storeDropped().length===0,'a record with nothing foreign reports nothing dropped');
 mem['source.profiles']=J([clone(p),o,clone(p)]); E.pStore();
 ok(E.storeDropped().length===1&&E.storeDropped()[0].i===1,'with three records, the report names the one that dropped');
 const sd=E.storeDropped(); sd[0].keys.push('zzz'); ok(E.storeDropped()[0].keys.indexOf('zzz')<0,'and what it returns is a copy');
 E.bindStore(()=>null,()=>{});
 /* validateProfile returns it too, ok or refused */
 const v=E.validateProfile(Object.assign(clone(p),{later:1}));
 ok(v.ok&&J(v.dropped)===J(['later']),'validateProfile returns the dropped list, and an unknown key is not an error');
 const w=E.validateProfile(Object.assign(clone(p),{later:1,axes:{Fear:{held:99,opp:0}}}));
 ok(!w.ok&&J(w.dropped)===J(['later']),'a refused record reports what it would have dropped as well');
 const x=E.validateProfile(clone(p)); ok(J(x.dropped)==='[]','a clean record drops nothing');
 ok(J(E.validateProfile(null).dropped)==='[]','and a record that is not an object drops nothing');
 /* the names refused by name are errors and are not listed as dropped */
 const t=E.validateProfile(Object.assign(clone(p),{token:'x',user_id:'u'}));
 ok(!t.ok&&t.errs.indexOf('token is not held by this product')>=0&&t.errs.indexOf('user_id is not held by this product')>=0&&t.dropped.length===0,
  'a token or a user_id is refused and not merely dropped: '+J(t.errs));
 /* the journey and its parts are named at the boundary, so they are not dropped either */
 const jv=E.validateProfile(clone(p)); ok(jv.ok&&jv.dropped.length===0&&jv.profile.journey.v===1,'the journey is named at the boundary and is not dropped');
 /* and a record a save wrote comes back whole */
 const saved=E.saveProfile?E.saveProfile(clone(p)):clone(p);
 ok(E.validateProfile(JSON.parse(J(saved))).dropped.length===0,'what the engine itself saves has nothing for the boundary to drop');
 E.loadProfile(E.blankProfile('after the dropped gate'));
}
};

/* ============================================================
   THE BITES. Each is a plausible way to get this module wrong, and the
   suite that guards the rule must fail on it. `from` must be in the engine
   exactly once.
   ============================================================ */
const MUTANTS=[
 {suite:'boundary', what:'the record skips the journey boundary',
  from:"p.journey=journeyValidate(errs,o.journey,'journey',{unique:p.meter.unique.length});", to:"p.journey=o.journey;"},
 {suite:'boundary', what:'a run may claim more new ground than the meter holds',
  from:"if(NUM(c.unique)&&fresh>c.unique)", to:"if(false)"},
 {suite:'boundary', what:'fresh may exceed lines',
  from:"if(lines!==null&&fresh!==null&&fresh>lines)", to:"if(false)"},
 {suite:'boundary', what:'a closed run may hold lines',
  from:"if(x.end==='closed'&&((lines", to:"if(false&&((lines"},
 {suite:'boundary', what:'a log may skip a number',
  from:"if(x.seq!==i+1)errs.push(path+'.seq is not the next number');", to:"if(false)errs.push('x');"},
 {suite:'boundary', what:'a log line may be any event',
  from:"if(JOURNEY_EVENTS.indexOf(x.type)<0)errs.push", to:"if(false)errs.push"},
 {suite:'boundary', what:'a log detail may be free text',
  from:"(typeof v==='string'&&JY_VAL.test(v)))d[k]=v;", to:"typeof v==='string')d[k]=v;"},
 {suite:'boundary', what:'a gift counter need not add up',
  from:"if(gr!==null&&us!==null&&rm!==null&&us+rm!==gr)", to:"if(false)"},
 {suite:'boundary', what:'integrity may be finished with questions unanswered',
  from:"if(a1!==null&&n<ids.length)errs.push", to:"if(false)errs.push"},
 {suite:'boundary', what:'an integrity answer for a question that does not exist',
  from:"if(ids.indexOf(k)<0){errs.push(ip+'.answers names no question: '+k.slice(0,40)); return;}", to:"if(false){return;}"},
 {suite:'log', what:'the log is not capped',
  from:"if(j.log.length>=JOURNEY_LOG_MAX)\n  return {ok:false, why:'journey.log is full", to:"if(false)\n  return {ok:false, why:'journey.log is full"},
 {suite:'integrity', what:'an integrity answer writes the laws',
  from:"it.answers[id]=v;\n", to:"it.answers[id]=v; p.laws[JOURNEY_INTEGRITY.filter(function(q){return q.id===id;})[0].law]=v;\n"},
 {suite:'integrity', what:'an integrity answer of eleven is taken',
  from:"if(jyInt(errs,'journey.integrity.answers.'+id,v,0,10)===null)", to:"if(jyInt(errs,'journey.integrity.answers.'+id,v,0,11)===null)"},
 {suite:'mini', what:'the plan cuts an address in half',
  from:"var keys=meterPlan(p,ids,ONB_CHANS,ids.length*RUN_MIN);", to:"var keys=meterPlan(p,ids,ONB_CHANS,ids.length*RUN_MIN-1);"},
 {suite:'mini', what:'the plan ignores the allowance',
  from:"var whole=Math.min(ONB_MINI_ADDRS,Math.floor(cap/RUN_MIN));", to:"var whole=ONB_MINI_ADDRS;"},
 {suite:'mini', what:'an unread story is given a plan',
  from:"if(sg.unread===true||!cand.length)return", to:"if(!cand.length)return"},
 {suite:'mini', what:'the plan spends ground that is already open',
  from:"var open=cand.filter(function(c){return meterPlan(p,[c.id],ONB_CHANS,RUN_MIN).length===RUN_MIN;});", to:"var open=cand;"},
 {suite:'mini', what:'the plan writes to the record',
  from:"return {ok:true, addrs:ids, keys:keys, lines:keys.length,", to:"p.meter.lines+=1; return {ok:true, addrs:ids, keys:keys, lines:keys.length,"},
 {suite:'runs', what:'a closed card is counted as a release',
  from:"if(run.end!=='closed'){\n  var g=journeyGiftIssue", to:"if(true){\n  var g=journeyGiftIssue"},
 {suite:'runs', what:'a run that would make the record unloadable is written',
  from:"if(before+run.fresh>held)", to:"if(false)"},
 {suite:'gift', what:'a stored counter that is never synced',
  from:"j.gift.granted=r.granted; j.gift.used=r.used; j.gift.remaining=r.remaining;", to:""},
 {suite:'gift', what:'the extras are unbounded',
  from:"if(!hit&&j.gift.extras.length>=JOURNEY_EXTRAS_MAX)", to:"if(false)"},
 {suite:'claim', what:'the claim carries the birth data',
  from:"var JOURNEY_CLAIM_SEND=['soul',", to:"var JOURNEY_CLAIM_SEND=['who','soul',"},
 {suite:'claim', what:'a claim takes a body part it never carries',
  from:"if(JOURNEY_CLAIM_NEVER.indexOf(k)>=0)errs.push('claim.body.'+k+' is not carried by a claim');", to:"if(false)errs.push('x');"},
 {suite:'claim', what:'a claim skips the profile boundary',
  from:"var v=validateProfile(rec);\n if(!v.ok)return {ok:false, errs:v.errs.map", to:"var v={ok:true,profile:rec};\n if(!v.ok)return {ok:false, errs:v.errs.map"},
 {suite:'claim', what:'a second claim moves the stamp',
  from:"if(j.claimed)return {ok:true, already:true, claimed:j.claimed};", to:""},
 {suite:'dropped', what:'the dropped list is never filled',
  from:"var dropped=Object.keys(o).filter(", to:"var dropped=[].filter("},
 {suite:'dropped', what:'a user_id is dropped and not refused',
  from:"var NEVER_TOP=['token','session','password','email','user_id','userId','customer_id'];", to:"var NEVER_TOP=['token','session','password','email'];"},
 {suite:'dropped', what:'pStore does not collect what was dropped',
  from:"if(v.dropped&&v.dropped.length)", to:"if(false)"},
 {suite:'tables', what:'the first run stem is the shipped one',
  from:"const ONB_STEM='I am releasing '", to:"const ONB_STEM='I am letting go of '"},
 {suite:'tables', what:'an event is renamed',
  from:"'funnel_started','ground_selected',", to:"'funnel_began','ground_selected',"}];

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
 /* the loader, on an unbroken copy, before it is trusted with a broken one */
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
