/* ============================================================
   NINETY DAYS. THE HARNESS.

   A cohort of simulated arrivals is driven through the real product for ninety
   days. Every reading, every charge, every release, every streak and every
   mark below comes from a call into the shipped engine. Nothing about a
   person's field is modelled by this file.

   What IS modelled, and it is the whole of the model, is when somebody opens
   the file and when they stop. That is stated in SHOWUP below and it is
   judgement, not evidence.

   Run:
     node sim/harness.js                 until the grade settles
     node sim/harness.js 12              exactly twelve runs
     node sim/harness.js verify          the lifted release arithmetic only

   It refuses to run without sim/measured.json, which sim/measure.js writes off
   a real Chromium. Every product fact this file needs that lives above the
   engine is read out of that file and none of them is typed here.
   ============================================================ */
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..');
const E=require(path.join(ROOT,'engine.js'));
const {STORYBANK}=require(path.join(__dirname,'stories.js'));
const MPATH=path.join(__dirname,'measured.json');
if(!fs.existsSync(MPATH)){
 console.error('sim/measured.json is missing. Run sim/measure.js first.');
 process.exit(2);}
const MEAS=JSON.parse(fs.readFileSync(MPATH,'utf8'));

const {S,W,BY,CHILD,compute,accuracy,applyStory,parseStory,verpApply,leanApply,
 blankProfile,loadProfile,saveProfile,snapshot,iqApply,iqList,
 meterPlan,meterRun,planAllowance,RUN_MAX,ladderRead,ledgerRead,streakRead,
 tierOf,seedApply,TYPE16,clamp,PRACTICE,cqCeiling}=E;

/* the engine wants a host store. this one is a bag that goes away. */
let MEM={}; E.bindStore(k=>MEM[k],(k,v)=>{MEM[k]=v;});

/* ============================================================
   WHERE A BLANK ARRIVAL STARTS, AND THE TWO ANSWERS TO IT.

   loadProfile seeds an unmeasured law at the engine's own LAW_DEFAULT. The app
   seeds the custom profile's at LAWSET.You in ui/personas.js, and the two are
   different numbers, so the same empty profile reads one coherence out of the
   engine and another one in the browser. Both are measured: the app's seed and
   its blank reading are read out of sim/measured.json and the engine's are read
   here, and the gap between them is reported rather than papered over.

   Everything below runs on the app's seed, because the app is the thing a
   person opens.
   ============================================================ */
const LAWSEED=MEAS.blank.lawSeed;
function engineBlankCQ(){
 const p=blankProfile('probe'); loadProfile(p); return +compute().CQ.toFixed(3);}
function beginProfile(){
 const p=blankProfile('You'); loadProfile(p);
 if(LAWSEED!=null)E.SINAMES.forEach(l=>{ if(p.laws[l]==null)S.law[l]=LAWSEED; });
 return p;}
const SEEDGAP={engine:engineBlankCQ(), app:MEAS.blank.cq,
 engineSeed:6, appSeed:LAWSEED,
 gap:+(MEAS.blank.cq-engineBlankCQ()).toFixed(3)};

/* ============================================================
   THE RELEASE, LIFTED.

   The release lives in ui/release.js and is not in the engine contract, so it
   cannot be called from node. Its arithmetic is copied here character for
   character from relCoolDown, and verifyRelease replays the exact case
   sim/measure.js drove in Chromium and refuses to continue if the two
   disagree. A lifted copy that is not checked against the original is a second
   implementation pretending to be a measurement.
   ============================================================ */
const CHANS=['Rlimit','Llimit','Rtruth','Ltruth'];
function releaseRun(prof,nodeIds){
 const queue=nodeIds.map(i=>BY[i]).filter(n=>n&&n.cf);
 if(!queue.length)return {ran:false,freed:0,lines:0,added:0,cleared:0};
 const plan=meterPlan(prof,queue.map(n=>n.i),CHANS,RUN_MAX);
 let freed=0, cleared=0;
 queue.forEach(n=>{
  const w0=n.sq*10;
  const d=-Math.round(w0*0.21+2);
  const w1=Math.max(0,w0+d);
  freed+=Math.abs(d);
  const share=Math.abs(d)/10/Math.max(1,queue.filter(q=>q.cf===n.cf).length);
  S.charge[n.cf]=clamp((S.charge[n.cf]||0)-share,0,10);
  S.replace[n.cf]=clamp((S.replace[n.cf]||0)+share*0.62,0,10);
  if(w1<=6)cleared++;});
 const mr=meterRun(prof,plan);
 saveProfile(prof);
 return {ran:true,freed:freed,lines:plan.length,added:mr.added,cleared:cleared,
  /* the run's own length in seconds, at the shipped default pace, plus the
     three opening lines. read off measured.json rather than typed. */
  seconds:Math.round((plan.length+MEAS.loop.openingLines)*MEAS.loop.speeds.Steady)};}

function verifyRelease(){
 const want=MEAS.loop.own;
 const p=beginProfile();
 const texts=[STORYBANK.Diane[3][1],STORYBANK.Diane[5][1],STORYBANK.Diane[4][1],
  STORYBANK.Derek[3][1],STORYBANK.Derek[4][1],STORYBANK.Marcus[2][1]];
 const steps=[];
 texts.forEach(t=>{applyStory(t);verpApply(t);leanApply(t);
  p.story.entries.push({t:new Date().toISOString(),text:t});
  saveProfile(p); p.history.push(snapshot(p));
  const c=compute(); steps.push({cq:+c.CQ.toFixed(3),loaded:c.loaded.length});});
 const pre=compute();
 const pick=pre.loaded.slice().sort((a,b)=>b.sq-a.sq).slice(0,3);
 const res=releaseRun(p,pick.map(n=>n.i));
 const post=compute();
 const bad=[];
 const near=(a,b,nm)=>{if(Math.abs(a-b)>0.001)bad.push(nm+' '+a+' vs '+b);};
 steps.forEach((s,i)=>{ if(!want.stories[i])return;
  near(s.cq,want.stories[i].cq,'story '+(i+1)+' cq');
  if(s.loaded!==want.stories[i].loaded)bad.push('story '+(i+1)+' loaded '+s.loaded+' vs '+want.stories[i].loaded);});
 near(pre.CQ,want.cqBefore,'cq before the release');
 near(post.CQ,want.cqAfter,'cq after the release');
 if(res.freed!==want.freed)bad.push('freed '+res.freed+' vs '+want.freed);
 if(res.lines!==want.planLines)bad.push('plan lines '+res.lines+' vs '+want.planLines);
 Object.keys(want.chargeAfter).forEach(k=>near(+(+S.charge[k]).toFixed(4),want.chargeAfter[k],'charge '+k));
 Object.keys(want.replaceAfter).forEach(k=>near(+(+S.replace[k]).toFixed(4),want.replaceAfter[k],'replace '+k));
 const picked=pick.map(n=>n.k).join(', ');
 return {ok:bad.length===0, bad:bad, picked:picked,
  cqBefore:+pre.CQ.toFixed(2), cqAfter:+post.CQ.toFixed(2), freed:res.freed,
  lines:res.lines, seconds:res.seconds, steps:steps};}

/* ============================================================
   THE CEILING CASE. What the product does for somebody who does everything.

   No model at all in this one: ninety days, one story and one release every
   day, the practice kept every day, the intake answered honestly on day one.
   It exists because a retention curve answers what happens to most people and
   says nothing about what the thing is worth to the person who actually uses
   it. Driven entirely through the shipped engine and the verified release.
   ============================================================ */
function ceilingCase(lawCentre){
 const prof=beginProfile();
 /* the intake, answered on day one. null is the person who never takes it, so
    every law sits on the app's own seed and the reading is the seed. */
 if(lawCentre!=null){
  const A={}; for(let i=0;i<63;i++)A[i]=lawCentre;
  prof.intake.answers=A; iqApply(prof);
  loadProfile(prof);
  if(LAWSEED!=null)E.SINAMES.forEach(l=>{ if(prof.laws[l]==null)S.law[l]=LAWSEED; });}
 const bank=[].concat(STORYBANK.Diane,STORYBANK.Derek,STORYBANK.Marcus,
  STORYBANK.Angela,STORYBANK.Sofia,STORYBANK.James,STORYBANK.Ana).map(x=>x[1]);
 const curve=[], notes={firstLoaded:null, firstRelease:null, giftGone:null};
 for(let day=1;day<=90;day++){
  const t=bank[(day-1)%bank.length];
  applyStory(t); verpApply(t); leanApply(t);
  prof.story.entries.push({t:new Date().toISOString(),text:t});
  saveProfile(prof);
  const live=compute().loaded.slice().sort((a,b)=>b.sq-a.sq);
  if(live.length&&notes.firstLoaded===null)notes.firstLoaded=day;
  const allow=planAllowance(prof.plan,(prof.meter.unique||[]).length);
  let ran=null;
  if(live.length){
   ran=releaseRun(prof,live.slice(0,8).map(n=>n.i));
   if(ran.ran&&notes.firstRelease===null)notes.firstRelease=day;}
  if(allow.left<=0&&notes.giftGone===null)notes.giftGone=day;
  prof.rituals.push({t:new Date(Date.now()-(90-day)*86400000).toISOString(),
   track:'',band:'',steps:[PRACTICE[day%PRACTICE.length].k],
   min:+PRACTICE[day%PRACTICE.length].min||8,when:'',where:'',done:true});
  saveProfile(prof); prof.history.push(snapshot(prof));
  const r=compute();
  curve.push({day:day, cq:+r.CQ.toFixed(2), loaded:r.loaded.length,
   ground:(prof.meter.unique||[]).length, left:allow.left,
   clear:ledgerRead(prof).clear, seconds:ran&&ran.ran?ran.seconds:0});}
 const L=ladderRead(prof,Date.now()), led=ledgerRead(prof), st=streakRead(prof,Date.now());
 return {lawCentre:lawCentre, curve:curve, notes:notes,
  cq0:curve.length?curve[0].cq:null, cq90:curve[curve.length-1].cq,
  best:Math.max.apply(null,curve.map(c=>c.cq)),
  worst:Math.min.apply(null,curve.map(c=>c.cq)),
  ground:led.ground, clear:led.clear, minutes:led.minutes,
  marks:L.earned.map(m=>m.nm), next:L.next?L.next.nm:null,
  streak:st.best, band:tierOf(compute().CQ).nm,
  accuracy:+accuracy(compute()).pct.toFixed(1),
  ceiling:+cqCeiling().toFixed(1),
  secondsInRelease:curve.reduce((a,c)=>a+c.seconds,0)};}

/* ============================================================
   THE SHOWUP MODEL. THIS IS THE MODEL AND IT IS JUDGEMENT.

   Nothing below is measured. Every figure is a reasoned estimate argued from
   the figure's own `says` line in engine/data/people.js, their entry in
   RESEARCH-icp.md, their phone verdict in DESIGN-mobile-icp.md, and their level
   on the buyer grid in BUYERS.md. The weights are carried from RESEARCH-icp.md
   so this run can be compared line by line with reviews/SIM-ninety-days.md.

     weight      share of a thousand arrivals
     grid        level on the BUYERS.md resonance grid
     arrive      opens the file at all, having got as far as having it
     base        probability of opening on an ordinary day while still engaged
     shape       the interval they naturally fall into
     minutes     what one session is worth to them, before friction
     gap         probability a given day starts a multi day absence, and its length
     whys        what pulls them back, and how much each pull is worth
     wants       what a session has to deliver or it did not count
     work        probability they do the physical practice rather than read about it
     patience    friction a session can carry before it costs them
     refers      whether they would hand it to somebody, if there were a way
   ============================================================ */
const SHOWUP=[
 {nm:'Diane', age:46, role:'founder, second company', weight:180, grid:3,
  device:'both', arrive:0.86, base:0.42, shape:'daily, in forty second slices',
  minutes:[0.7,2.5], gap:[0.05,3], work:0.18, patience:1.4, refers:false,
  whys:{delta:1.0, pressure:0.7, status:0.9}, wants:['delta'],
  why:'A number she does not already have, checked between meetings. Rest reads as a moral failure, so a session that asks for fifteen minutes is a session she does not take.',
  whyNot:'Nothing moved since yesterday. She will not pay twice for the same screen.'},
 {nm:'Derek', age:39, role:'high performer, endurance', weight:170, grid:2,
  device:'both', arrive:0.74, base:0.55, shape:'daily while a protocol is live',
  minutes:[4,14], gap:[0.06,5], work:0.72, patience:2.2, refers:false,
  whys:{cost:1.0, streak:0.9, body:0.6}, wants:['cost','delta'],
  why:'Output. He will run a protocol daily for a quarter if it is a protocol. The release is a protocol.',
  whyNot:'Nothing tells him what the holding costs him. Pain is not the hook, the watts are, and there is no watts line.'},
 {nm:'Marcus', age:44, role:'creative director', weight:160, grid:4,
  device:'both', arrive:0.58, base:0.16, shape:'every few days, as an inspection',
  minutes:[2,9], gap:[0.10,6], work:0.12, patience:2.6, refers:true,
  whys:{judge:1.0, craft:0.8}, wants:['craft'],
  why:'The quality judgement. He opens it to see whether it is still good and whether anybody fixed the thing he found.',
  whyNot:'He does not do the work. Level four on the grid buys it, reads half and avoids the practice because clearing the node hurts.'},
 {nm:'Angela', age:36, role:'seeker, six modalities', weight:150, grid:5,
  device:'phone', arrive:0.79, base:0.34, shape:'bursts, then nothing',
  minutes:[3,16], gap:[0.12,9], work:0.34, patience:1.2, refers:true,
  whys:{feel:1.0, seek:0.9, meaning:1.0}, wants:['meaning','named'],
  why:'Something named the thing she has no word for. She arrived from a group chat and she will tell that group chat.',
  whyNot:'Mechanical language, and the word Incoherent. Level five wants magic, not mechanics, and leaves when it turns out to be objective physical work.'},
 {nm:'Sofia', age:41, role:'somatic practitioner', weight:140, grid:6,
  device:'both', arrive:0.81, base:0.30, shape:'weekly, and at eleven at night',
  minutes:[6,22], gap:[0.07,7], work:0.66, patience:3.0, refers:true,
  whys:{night:1.0, client:1.0, craft:0.6}, wants:['named','refer'],
  why:'After the last client, for herself. And in session, on a client phone, which is the highest value use in the roster.',
  whyNot:'She cannot hand it to anybody. Her value is referral and there is no mechanism, so her use does not compound.'},
 {nm:'James', age:57, role:'C-suite, third turnaround', weight:100, grid:2,
  device:'both', arrive:0.42, base:0.07, shape:'once, possibly twice',
  minutes:[1,4], gap:[0.16,12], work:0.08, patience:1.0, refers:false,
  whys:{number:1.0, peer:0.8}, wants:['delta','number'],
  why:'A number a peer mentioned, and he wants his and he wants it higher.',
  whyNot:'Anything that looks like a persona picker or a worksheet. He is not going to be seen doing self help.'},
 {nm:'Ana', age:47, role:'teacher, one year out', weight:50, grid:4,
  device:'phone', arrive:0.72, base:0.46, shape:'irregular, at night',
  minutes:[5,25], gap:[0.09,4], work:0.61, patience:2.4, refers:false,
  whys:{night:1.0, grief:1.0, direction:1.0}, wants:['named','direction'],
  why:'She is inside something and cannot see the far side. She will click anything that offers the shape of it.',
  whyNot:'Being told the shape and not the way out. She is the one person in the roster for whom a wrong answer costs something.'},
 {nm:'Gordon', age:58, role:'managing partner', weight:35, grid:1,
  device:'both', arrive:0.06, base:0.02, shape:'refuses',
  minutes:[0.5,2], gap:[0.30,20], work:0.02, patience:0.4, refers:false,
  whys:{deny:1.0}, wants:['proof'],
  why:'Nothing. He has the most charge in the roster and refuses the frame. Do not chase him.',
  whyNot:'Any screen that opens with his pain is a screen for people who have pain.'},
 {nm:'Rosa', age:61, role:'retired midwife', weight:15, grid:10,
  device:'both', arrive:0.12, base:0.03, shape:'once, out of courtesy',
  minutes:[1,5], gap:[0.25,14], work:0.5, patience:2.0, refers:false,
  whys:{none:1.0}, wants:[],
  why:'Nothing pulls. Things do not sit on her the way they used to.',
  whyNot:'Correctly not the customer, and the product should not pretend otherwise.'}];

/* THE FRICTION CATALOGUE. What each one is, where it is, and what it costs.

   The detection is not a model: every one of these is read off the product's
   own state during the run, or off measured.json. The COST is the model: how
   much one encounter raises the chance that person does not come back. The
   sensitivity column says who it lands on hardest and why. */
const FRICTION={
 DRIFT:{nm:'The absence became permanent', surf:'outside the product',
  step:'a week goes by and nothing happens',
  cost:0, hard:{},
  say:'not a screen. this is the person who stopped opening the file and never decided to. it is the counterpart of F10 and it is reported separately so F10 is only what fired inside a session.'},
 F1:{nm:'The box reads nothing out of what they wrote', surf:'Story',
  step:'press the commit control on an ordinary paragraph',
  cost:0.16, hard:{Marcus:1.8,Angela:1.7,Sofia:1.5,Ana:1.4},
  say:'parseStory returns no imprint, so the panel has nothing to show and the field does not move.'},
 F2:{nm:'The reading names an address the person did not describe', surf:'Story',
  step:'read the imprint panel after a commit',
  cost:0.13, hard:{Angela:1.9,Ana:1.8,Sofia:1.6,Marcus:1.3},
  say:'every imprint carries inferred, so the seat was read off a band and the address was chosen by a fallback.'},
 F3:{nm:'Nothing is above the line, so there is nothing to release', surf:'Story, Summary',
  step:'look for the release after telling it something true',
  cost:0.20, hard:{Derek:1.8,Ana:1.6,Diane:1.4},
  say:'compute().loaded is empty. An address has to reach four to enter the reading at all.'},
 F4:{nm:'The reading does not move', surf:'Field, Summary',
  step:'look at the number after a session',
  cost:0.17, hard:{Diane:2.0,James:2.0,Derek:1.6,Marcus:1.2},
  say:'CQ is unchanged to two decimal places on the session they just spent.'},
 F5:{nm:'The surface they wanted is off the tab strip', surf:'the bar, at 390',
  step:'reach for Summary, Compass, Knowledge or Games on a phone',
  cost:0.11, hard:{Angela:1.6,Ana:1.5,Sofia:1.3},
  say:'measured: four of the nine are fully in view at 390 and the rest are past the right edge.'},
 F6:{nm:'More simultaneous choices than a working memory holds', surf:'every surface',
  step:'arrive',
  cost:0.06, hard:{Angela:1.5,Ana:1.4,James:1.3},
  say:'measured above the fold, against a target of under twelve and a working memory of about four.'},
 F7:{nm:'The intake is sixty three questions', surf:'Energetics',
  step:'start the intake with less time than it states',
  cost:0.14, hard:{Diane:2.0,James:1.8,Marcus:1.5},
  say:'the survey cliff sits at seven to eight minutes and the intake states fifteen.'},
 F8:{nm:'The panel says nothing is left and the run goes ahead', surf:'Story, the release panel',
  step:'run a release after a hundred patterns of new ground',
  cost:0.14, hard:{Derek:1.4,Marcus:1.8,Sofia:1.3},
  say:'measured in the shipped app: the panel printed "4 patterns of the 0 you have left" and the run proceeded. The allowance is a label with nothing behind it, so there is no limit to sell past and no bill to present.'},
 F9:{nm:'The content is exhausted', surf:'Knowledge, Games, Ritual',
  step:'come back for something new',
  cost:0.15, hard:{Marcus:1.7,Angela:1.5,Diane:1.3},
  say:'every practice in the library has been seen at least once.'},
 F10:{nm:'Nothing asked them to come back', surf:'outside the product',
  step:'the day after',
  cost:0.07, hard:{Angela:1.6,Derek:1.4,Ana:1.3},
  say:'there is no notification and no accountability seam. Every return is unprompted.'},
 F11:{nm:'The record credits a plan as a day practised', surf:'Ritual, Compass',
  step:'save a ritual, do not do it, look at the streak',
  cost:0.09, hard:{Sofia:1.9,Derek:1.6,Marcus:1.4},
  say:'pracDays counts every distinct day carrying a saved ritual and never reads the done flag.'},
 F12:{nm:'There is no way to hand it to anybody', surf:'everywhere',
  step:'try to give a client or a peer their own reading',
  cost:0.12, hard:{Sofia:2.2,Marcus:1.5,Angela:1.4},
  say:'measured: no refer, invite or send control on any surface.'},
 F13:{nm:'The band word and the number on the same line disagree', surf:'Summary, Field',
  step:'read the headline at a coherence between the band edges',
  cost:0.10, hard:{Angela:2.0,Marcus:1.6,James:1.3},
  say:'the headline rounds and the band does not, so a 40.6 prints 41 beside Incoherent, which is 31 to 40.'},
 F14:{nm:'Every story makes the number worse', surf:'Story then Field',
  step:'tell it the truth six times',
  cost:0.19, hard:{Diane:1.8,James:1.7,Derek:1.5,Angela:1.5},
  say:'measured: charge only ever goes up from a story, so the reading only ever goes down from one.'}};

/* WHAT A SESSION CAN DELIVER, and what it costs in minutes. The minutes are
   the model. Everything a minute buys is the product. */
const COST={look:0.6, summary:1.2, story:3.4, ritualPlan:2.6, knowledge:4.5,
 games:5.5, intakeBlock:0.7, seed:1.4, compass:1.5};

function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;
 let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;
 return ((t^t>>>14)>>>0)/4294967296;};}

/* the measured facts this model consumes, pulled once */
const M={
 bootMs:Math.max(MEAS.widths[1600].firstWordMs,MEAS.widths[390].firstWordMs),
 errors:MEAS.widths[1600].errors.length+MEAS.widths[390].errors.length,
 requests:MEAS.widths[1600].requests.length,
 tabs:MEAS.widths[390].land.tabCount,
 stripPhone:MEAS.widths[390].land.stripVisible,
 offStrip:MEAS.widths[390].land.stripOff,
 landing:MEAS.widths[1600].land.tabName,
 small:Object.keys(MEAS.widths[390].surfaces).reduce((a,k)=>a+MEAS.widths[390].surfaces[k].small,0),
 money:MEAS.widths[1600].land.money.length,
 refer:MEAS.widths[1600].land.refer.length,
 above:{}, deep:{}};
Object.keys(MEAS.widths[1600].surfaces).forEach(k=>{
 M.above[k]={desk:MEAS.widths[1600].surfaces[k].above, phone:MEAS.widths[390].surfaces[k].above};
 M.deep[k]=MEAS.widths[390].surfaces[k].deep;});
const OFFSTRIP={}; M.offStrip.forEach(n=>OFFSTRIP[n]=1);

/* ============================================================
   ONE PERSON, NINETY DAYS.
   ============================================================ */
function runPerson(spec,rng,seedIdx){
 const prof=beginProfile();
 const bank=STORYBANK[spec.nm]||STORYBANK.Rosa;
 const rec={nm:spec.nm, sessions:0, days:[], minutes:0, stories:0, storiesRead:0,
  storiesInferred:0, releases:0, freed:0, ritualsPlanned:0, ritualsDone:0,
  ground:0, intakeBlocks:0, intakeDone:false, seeded:false, loopClosed:0,
  hits:{}, lastDay:0, quitDay:null, quitOn:null, cq0:null, cq1:null, ceiling:null, openDays:[],
  marks:0, streakBest:0, clear:0, sawDelta:0, sawNamed:0, gift:100,
  dIntake:0, dStory:0, dRelease:0,
  reasons:{}, lastOpen:0, gapDays:0, longestGap:0, phone:spec.device==='phone'};
 /* one encounter with one friction, recorded, and returned as the share of
    this person it does NOT cost. the session multiplies them. */
 let fsurv=1, worst=null, worstC=0;
 const hit=(k,w)=>{rec.hits[k]=(rec.hits[k]||0)+1;
  const hard=(FRICTION[k].hard||{})[spec.nm]||1;
  const c=clamp(FRICTION[k].cost*hard*(w===undefined?1:w),0,0.95);
  fsurv*=(1-c);
  /* WHICH ONE COST THEM, so a sticking point can be ranked by people lost and
     not only by people who met it. The heaviest single friction of the session
     they left on is the one the departure is attributed to. It is an
     attribution and not a cause, and the page says so. */
  if(c>worstC){worstC=c; worst=k;}
  return 0;};
 /* arrival */
 if(rng()>spec.arrive){rec.quitDay=0; return rec;}
 let alive=true, gapLeft=0, hazard=0;
 const startCQ=compute().CQ;
 rec.cq0=+startCQ.toFixed(2);
 let seen={practices:{}, knowledge:0, games:0};
 for(let day=1; day<=90 && alive; day++){
  if(gapLeft>0){gapLeft--; rec.gapDays++;
   rec.longestGap=Math.max(rec.longestGap,rec.gapDays===0?0:rec.gapDays);
   /* an absence that runs on is an absence that becomes permanent */
   if(rng()<0.035+0.02*Math.min(6,day/15)){alive=false; rec.quitDay=day; rec.quitOn='DRIFT';}
   continue;}
  /* does a day start an absence */
  if(rng()<spec.gap[0]){gapLeft=1+Math.floor(rng()*spec.gap[1]); continue;}
  /* THE PULL. curiosity decays, the record pulls, and a reason has to arrive */
  const curiosity=Math.exp(-(day-1)/11);
  const st=streakRead(prof,Date.now());
  const pull=(spec.whys.streak&&st.live?0.30*spec.whys.streak:0)
   +0.22*(rec.sawDelta>0?1:0)+0.18*(rec.sawNamed>0?1:0)
   +0.14*(rec.marks>0?1:0);
  let p=spec.base*(0.30+0.70*curiosity)+pull-hazard;
  if(day===1)p=1;
  if(rng()>clamp(p,0.01,0.97)){
   rec.gapDays++;
   if(rng()<0.02)  {alive=false; rec.quitDay=day; rec.quitOn='DRIFT';}
   continue;}
  rec.gapDays=0;
  /* ---------------- a session ---------------- */
  rec.sessions++; rec.lastDay=day; rec.lastOpen=day; rec.openDays.push(day);
  let budget=spec.minutes[0]+rng()*(spec.minutes[1]-spec.minutes[0]);
  rec.minutes+=budget;
  fsurv=1; worst=null; worstC=0; let delivered={};
  const cqIn=compute().CQ;
  /* the landing cost, every session, measured */
  const aboveLand=M.above[M.landing][spec.device==='phone'?'phone':'desk'];
  if(aboveLand>12)hit('F6',Math.min(1,aboveLand/60));
  /* a phone reaching for a surface that is not on the strip */
  if(spec.device==='phone'&&rng()<0.45){
   const want=['Summary','Compass','Knowledge','Games','Ritual','Story'][Math.floor(rng()*6)];
   if(OFFSTRIP[want])hit('F5');}
  /* the intake. taken in blocks, and only if the budget is there */
  if(!rec.intakeDone&&rng()<0.30){
   const cqI=compute().CQ;
   if(budget<7){hit('F7');}
   const blocks=Math.min(21-rec.intakeBlocks,Math.max(1,Math.floor(budget/COST.intakeBlock)));
   rec.intakeBlocks+=blocks; budget-=blocks*COST.intakeBlock;
   const A=prof.intake.answers;
   for(let b=rec.intakeBlocks-blocks;b<rec.intakeBlocks;b++)
    for(let q=0;q<3;q++){
     /* the answers are the person, and they are drawn from the grid level:
        a level two answers low on integrity, a level ten answers high. */
     const centre=1.2+spec.grid*0.72;
     A[b*3+q]=clamp(Math.round(centre+(rng()*2.6-1.3)),0,10);}
   iqApply(prof);
   if(rec.intakeBlocks>=21&&!rec.intakeDone){rec.intakeDone=true; delivered.number=1;}
   /* reloading re-seeds the laws the intake has not reached yet, and it has to
      re-seed them the way the app does or the reading drifts mid intake. */
   loadProfile(prof);
   if(LAWSEED!=null)E.SINAMES.forEach(l=>{ if(prof.laws[l]==null)S.law[l]=LAWSEED; });
   rec.dIntake+=compute().CQ-cqI;}
  /* a story, which is the only door to the person's own charge */
  if(budget>COST.story&&rng()<(spec.whys.feel||spec.whys.night||spec.whys.grief||0.45)){
   const pick=bank[Math.floor(rng()*bank.length)];
   const cqS=compute().CQ;
   const parsed=parseStory(pick[1]);
   rec.reasons[pick[0]]=(rec.reasons[pick[0]]||0)+1;
   applyStory(pick[1]); verpApply(pick[1]); leanApply(pick[1]);
   prof.story.entries.push({t:new Date().toISOString(),text:pick[1],
    imprints:parsed.imprints.length,bands:parsed.bands});
   saveProfile(prof); prof.history.push(snapshot(prof));
   rec.stories++; budget-=COST.story;
   if(!parsed.imprints.length){hit('F1');}
   else {rec.storiesRead++;
    if(parsed.imprints.every(i=>i.inferred)){rec.storiesInferred++; hit('F2');}
    if(parsed.named.length){rec.sawNamed++; delivered.named=1;}}
   const after=compute();
   rec.dStory+=after.CQ-cqS;
   if(!after.loaded.length)hit('F3');
   if(after.CQ<cqIn-0.005)hit('F14');}
  /* the release, if there is anything above the line and time for it */
  const live=compute().loaded.slice().sort((a,b)=>b.sq-a.sq);
  if(live.length&&budget>1.2){
   /* NOTHING GATES THE RUN, measured. The panel prints what is left and the
      run proceeds whatever it says, so the harness runs it too and the
      friction is the sentence rather than a refusal. */
   const allow=planAllowance(prof.plan,(prof.meter.unique||[]).length);
   if(allow.left<=0)hit('F8');
   const take=live.slice(0,Math.max(1,Math.min(3,Math.floor(1+rng()*3))));
   const cqR=compute().CQ;
   const res=releaseRun(prof,take.map(n=>n.i));
   rec.dRelease+=compute().CQ-cqR;
   if(res.ran){rec.releases++; rec.freed+=res.freed; budget-=res.seconds/60;
    prof.history.push(snapshot(prof));
    delivered.delta=1; delivered.cost=1;}}
  /* the ritual. a plan, and then whether it was kept */
  if(budget>COST.ritualPlan&&rng()<0.55){
   const prs=PRACTICE.slice().sort(()=>rng()-0.5).slice(0,1+Math.floor(rng()*3));
   const mins=prs.reduce((a,x)=>a+(+x.min||5),0);
   prs.forEach(x=>{seen.practices[x.k]=1;});
   prof.rituals.push({t:new Date(Date.now()-(90-day)*86400000).toISOString(),
    track:'',band:'',steps:prs.map(x=>x.k),min:mins,when:'',where:'',
    done:rng()<spec.work});
   rec.ritualsPlanned++;
   const last=prof.rituals[prof.rituals.length-1];
   if(last.done)rec.ritualsDone++;
   else hit('F11',0.6);
   saveProfile(prof); budget-=COST.ritualPlan;
   if(Object.keys(seen.practices).length>=PRACTICE.length)hit('F9');}
  /* did they see the number, and did it move */
  const cqOut=compute().CQ;
  const canSee=!(spec.device==='phone'&&OFFSTRIP.Summary&&rng()<0.5);
  if(canSee){
   if(Math.abs(cqOut-cqIn)>0.005){rec.sawDelta++;}
   else if(spec.wants.indexOf('delta')>=0)hit('F4');
   /* the band edge, read off the same rounding the headline uses */
   const band=tierOf(cqOut);
   if(Math.round(cqOut)>band.at+9)hit('F13');}
  /* the loop closes when a story, a release and a kept practice all happened */
  if(rec.stories>0&&rec.releases>0&&rec.ritualsDone>0)rec.loopClosed++;
  /* what they came for, and whether they got it */
  spec.wants.forEach(w=>{ if(!delivered[w]&&w!=='refer'&&w!=='named'&&w!=='meaning'
   &&w!=='craft'&&w!=='direction'&&w!=='number'&&w!=='proof')fsurv*=0.96;});
  if(spec.refers&&rng()<0.35)hit('F12');
  if(!M.money&&(prof.meter.unique||[]).length>60)hit('F8',0.4);
  if(rng()<0.5)hit('F10',0.5);
  /* the ladder, and whether anything was earned */
  const L=ladderRead(prof,Date.now());
  if(L.earned.length>rec.marks){rec.marks=L.earned.length; fsurv=clamp(fsurv*1.08,0,1);}
  /* HAZARD. SATURATING, NOT ADDITIVE, and the reason is that four friction
     costs in one session are usually one experience. A person who wrote a
     paragraph, got no imprint, found nothing above the line and watched the
     number not move has had one bad session and not four. So the session's
     friction is combined as independent survivals rather than summed, which
     cannot exceed one however many land, and it is then divided by what that
     person will carry and credited back by what the session delivered. */
  const credit=0.05*Object.keys(delivered).length+(rec.sawDelta?0.03:0);
  const fr=1-fsurv;
  hazard=clamp(hazard*0.62+Math.max(0,fr/spec.patience-credit),0,0.85);
  if(rng()<clamp(hazard,0,0.9)){alive=false; rec.quitDay=day; rec.quitOn=worst;}}
 /* ---------------- the ninety day reading ---------------- */
 const r=compute();
 const L=ladderRead(prof,Date.now()), led=ledgerRead(prof), st=streakRead(prof,Date.now());
 rec.cq1=+r.CQ.toFixed(2); rec.ceiling=+cqCeiling().toFixed(1);
 rec.ground=led.ground; rec.clear=led.clear; rec.marks=L.earned.length;
 rec.streakBest=st.best; rec.ritualMinutes=Math.round(led.minutes);
 rec.gift=planAllowance(prof.plan,(prof.meter.unique||[]).length).left;
 rec.accuracy=+accuracy(r).pct.toFixed(1);
 rec.band=tierOf(r.CQ).nm;
 rec.survived=rec.quitDay===null;
 rec.snaps=prof.history.length;
 return rec;}

/* ============================================================
   ONE RUN OF THE WHOLE COHORT.
   ============================================================ */
const COHORT=1000;
function runCohort(seed){
 const rng=mulberry(seed);
 const total=SHOWUP.reduce((a,s)=>a+s.weight,0);
 const out={seed:seed, people:[], byIcp:{}};
 SHOWUP.forEach(spec=>{
  const n=Math.round(COHORT*spec.weight/total);
  const rows=[];
  for(let i=0;i<n;i++)rows.push(runPerson(spec,rng,i));
  out.byIcp[spec.nm]={n:n, rows:rows};});
 return summarise(out);}

const DAYS=[1,3,7,14,30,60,90];
/* ACTIVE, NOT ALIVE. A person who has not formally given up but has not opened
   the file in three weeks is not retained, and counting them as retained is how
   a modelled curve flatters itself. Active at day D means opened at least once
   in the seven days ending at D, which is the rolling definition the cited
   category figures use. Alive is reported beside it and is the softer number. */
const WINDOW=7;
/* A WINDOW THAT IS NOT FULL IS NOT THE SAME MEASUREMENT. The first cut ran the
   window back to day one whatever D was, so the day three figure counted
   everybody who had opened at all and came out ABOVE the day one figure, which
   is not a retention curve. The window is only reported where it is full, at
   day seven and beyond, and the first week is reported as the day it happened
   on instead. */
function activeAt(rec,d){
 const lo=d-WINDOW+1;
 if(lo<1)return null;
 for(let i=0;i<rec.openDays.length;i++)
  if(rec.openDays[i]>=lo&&rec.openDays[i]<=d)return true;
 return false;}
function openedOn(rec,d){return rec.openDays.indexOf(d)>=0;}
function summarise(run){
 const s={seed:run.seed, n:0, icp:{}, retention:{}, hits:{}, hitPeople:{},
  totals:{sessions:0,minutes:0,stories:0,storiesRead:0,storiesInferred:0,
   releases:0,ritualsPlanned:0,ritualsDone:0,loopClosed:0,ground:0,clear:0,
   marks:0,openers:0,quit3:0,giftFloor:0,sawDelta:0}};
 const alive={}, livesum={}; DAYS.forEach(d=>{alive[d]=0;livesum[d]=0;});
 const dailysum=new Array(90).fill(0);
 let wsum=0;
 SHOWUP.forEach(spec=>{
  const g=run.byIcp[spec.nm], rows=g.rows;
  const openers=rows.filter(r=>r.quitDay!==0);
  const A={}; DAYS.forEach(d=>{A[d]=rows.filter(r=>activeAt(r,d)===true||(activeAt(r,d)===null&&openedOn(r,d))).length;});
  const AL={}; DAYS.forEach(d=>{AL[d]=rows.filter(r=>r.quitDay===null||r.quitDay>=d).length;});
  const DAY=[]; for(let d=1;d<=90;d++)DAY.push(rows.filter(r=>openedOn(r,d)).length);
  const surv=rows.filter(r=>r.quitDay===null);
  const mean=(f,set)=>{const a=(set||rows); return a.length?a.reduce((x,r)=>x+f(r),0)/a.length:0;};
  s.icp[spec.nm]={n:rows.length, weight:spec.weight, grid:spec.grid,
   device:spec.device, shape:spec.shape, why:spec.why, whyNot:spec.whyNot,
   arrived:openers.length,
   ret:DAYS.reduce((o,d)=>(o[d]=+(A[d]/rows.length).toFixed(4),o),{}),
   alive:DAYS.reduce((o,d)=>(o[d]=+(AL[d]/rows.length).toFixed(4),o),{}),
   quitBy3:rows.filter(r=>r.quitDay!==null&&r.quitDay<=3).length,
   sessions:+mean(r=>r.sessions).toFixed(2),
   minutes:+mean(r=>r.minutes).toFixed(1),
   stories:+mean(r=>r.stories).toFixed(2),
   readShare:(()=>{const t=rows.reduce((a,r)=>a+r.stories,0);
    return t?+(rows.reduce((a,r)=>a+r.storiesRead,0)/t).toFixed(4):null;})(),
   releases:+mean(r=>r.releases).toFixed(2),
   loopClosed:+mean(r=>r.loopClosed).toFixed(2),
   loopEver:+(rows.filter(r=>r.loopClosed>0).length/rows.length).toFixed(4),
   survivors:surv.length,
   exit:(()=>{const o=openers;
    const mm=f=>o.length?+(o.reduce((a,r)=>a+(f(r)||0),0)/o.length).toFixed(2):null;
    return {cqDelta:mm(r=>r.cq1-r.cq0), ground:mm(r=>r.ground), marks:mm(r=>r.marks),
     clear:mm(r=>r.clear), stories:mm(r=>r.stories), releases:mm(r=>r.releases),
     ritualsDone:mm(r=>r.ritualsDone), minutes:mm(r=>r.minutes),
     dIntake:mm(r=>r.dIntake), dStory:mm(r=>r.dStory), dRelease:mm(r=>r.dRelease),
     lastDay:mm(r=>r.lastDay), sessions:mm(r=>r.sessions),
     nothing:+(o.filter(r=>r.releases===0&&r.ritualsDone===0).length/Math.max(1,o.length)).toFixed(4)};})(),
   cq0:+mean(r=>r.cq0).toFixed(2),
   cq90:surv.length?+mean(r=>r.cq1,surv).toFixed(2):null,
   cqDelta:surv.length?+(mean(r=>r.cq1,surv)-mean(r=>r.cq0,surv)).toFixed(2):null,
   ground:surv.length?+mean(r=>r.ground,surv).toFixed(1):null,
   clear:surv.length?+mean(r=>r.clear,surv).toFixed(2):null,
   marks:surv.length?+mean(r=>r.marks,surv).toFixed(2):null,
   streakBest:surv.length?+mean(r=>r.streakBest,surv).toFixed(1):null,
   ritualMinutes:surv.length?Math.round(mean(r=>r.ritualMinutes,surv)):null,
   giftLeft:surv.length?Math.round(mean(r=>r.gift,surv)):null,
   accuracy:surv.length?+mean(r=>r.accuracy,surv).toFixed(1):null,
   daily:DAY,
   topHits:(()=>{const h={}; rows.forEach(r=>Object.keys(r.hits).forEach(k=>h[k]=(h[k]||0)+1));
    return Object.keys(h).sort((a,b)=>h[b]-h[a]).slice(0,4)
     .map(k=>({k:k, share:+(h[k]/rows.length).toFixed(3)}));})()};
  s.n+=rows.length; wsum+=spec.weight;
  DAYS.forEach(d=>{alive[d]+=A[d]; livesum[d]+=AL[d];});
  DAY.forEach((v,i)=>dailysum[i]+=v);
  s.totals.openers+=openers.length;
  rows.forEach(r=>{
   s.totals.sessions+=r.sessions; s.totals.minutes+=r.minutes;
   s.totals.stories+=r.stories; s.totals.storiesRead+=r.storiesRead;
   s.totals.storiesInferred+=r.storiesInferred;
   s.totals.releases+=r.releases; s.totals.ritualsPlanned+=r.ritualsPlanned;
   s.totals.ritualsDone+=r.ritualsDone; s.totals.loopClosed+=r.loopClosed;
   s.totals.ground+=r.ground; s.totals.clear+=r.clear; s.totals.marks+=r.marks;
   s.totals.sawDelta+=r.sawDelta;
   if(r.quitDay!==null&&r.quitDay<=3)s.totals.quit3++;
   if(r.gift<=0)s.totals.giftFloor++;
   Object.keys(r.hits).forEach(k=>{
    s.hits[k]=(s.hits[k]||0)+r.hits[k];
    s.hitPeople[k]=(s.hitPeople[k]||0)+1;});});});
 s.alive={};
 DAYS.forEach(d=>{s.retention[d]=+(alive[d]/s.n).toFixed(4);
  s.alive[d]=+(livesum[d]/s.n).toFixed(4);});
 s.daily=dailysum.map(v=>+(v/s.n).toFixed(5));
 s.hitShare={}; Object.keys(s.hitPeople).forEach(k=>
  s.hitShare[k]=+(s.hitPeople[k]/s.n).toFixed(4));
 s.lost={}; s.lostBy={};
 SHOWUP.forEach(spec=>run.byIcp[spec.nm].rows.forEach(r=>{
  if(r.quitDay===null||r.quitDay===0)return;
  const k=r.quitOn||'unattributed';
  s.lost[k]=(s.lost[k]||0)+1;
  s.lostBy[k]=s.lostBy[k]||{}; s.lostBy[k][spec.nm]=(s.lostBy[k][spec.nm]||0)+1;}));
 /* weekly active, thirteen weeks, which is the comparison the cited figures make */
 s.weekly=[];
 for(let wk=1;wk<=13;wk++){let n=0;
  SHOWUP.forEach(spec=>run.byIcp[spec.nm].rows.forEach(r=>{
   for(let i=0;i<r.openDays.length;i++){const d=r.openDays[i];
    if(d>7*(wk-1)&&d<=7*wk){n++;break;}}}));
  s.weekly.push(+(n/s.n).toFixed(5));}
 s.loopEver=+(SHOWUP.reduce((a,sp)=>a+s.icp[sp.nm].loopEver*s.icp[sp.nm].n,0)/s.n).toFixed(4);
 s.readShare=s.totals.stories?+(s.totals.storiesRead/s.totals.stories).toFixed(4):0;
 s.inferShare=s.totals.storiesRead?+(s.totals.storiesInferred/s.totals.storiesRead).toFixed(4):0;
 s.keptShare=s.totals.ritualsPlanned?+(s.totals.ritualsDone/s.totals.ritualsPlanned).toFixed(4):0;
 s.grade=gradeOf(s);
 return s;}

/* ============================================================
   THE GRADE. Ten criteria, the same ten reviews/SIM-ninety-days.md used, so
   the two can be compared line by line. Each formula is here rather than in
   the page, and each says whether it moves with the run or is measured and
   therefore fixed.
   ============================================================ */
const lerp=(x,xs,ys)=>{
 if(x<=xs[0])return ys[0];
 for(let i=1;i<xs.length;i++)if(x<=xs[i])
  return ys[i-1]+(ys[i]-ys[i-1])*(x-xs[i-1])/(xs[i]-xs[i-1]);
 return ys[ys.length-1];};
function gradeOf(s){
 const deviceShare=SHOWUP.reduce((a,sp)=>a+(sp.device==='phone'?sp.weight:0),0)
  /SHOWUP.reduce((a,sp)=>a+sp.weight,0);
 const loadAt=w=>{const ks=Object.keys(M.above);
  return ks.reduce((a,k)=>a+clamp(12/M.above[k][w],0,1),0)/ks.length;};
 const g=[];
 /* 1. ICP alignment. the weighted share who got a thing they came for inside
    ninety days, read off the run. moves. */
 const align=SHOWUP.reduce((a,sp)=>{
  const row=s.icp[sp.nm];
  /* what "got it" means per figure, and every one of these is a product fact */
  const got= sp.nm==='Sofia' ? row.loopEver*(M.refer?1:0.35)
   : sp.nm==='Derek' ? row.loopEver
   : sp.nm==='Diane' ? Math.min(1,row.sessions/6)*(row.cqDelta>0?1:0.45)
   : sp.nm==='James' ? (row.ret[7]||0)
   : sp.nm==='Marcus'? (row.ret[30]||0)
   : sp.nm==='Angela'? (row.readShare||0)*(row.ret[7]||0)*2
   : sp.nm==='Ana'   ? row.loopEver
   : sp.nm==='Gordon'? 1-(row.arrived/Math.max(1,row.n))
   : 1-(row.arrived/Math.max(1,row.n));
  return a+clamp(got,0,1)*sp.weight;},0)/SHOWUP.reduce((a,sp)=>a+sp.weight,0);
 g.push({k:'ICP alignment', v:+(10*align).toFixed(1), moves:true,
  how:'weighted share who got what they came for, per figure, read off the run'});
 /* 2. First touch. measured only, four components of 2.5. */
 const ft=2.5*clamp(lerp(M.bootMs,[300,1000,3000,5000],[1,1,0.5,0]),0,1)
  +2.5*clamp(12/M.above[M.landing].desk*deviceShare+12/M.above[M.landing].phone*(1-deviceShare),0,1)
  +2.5*clamp(M.stripPhone/M.tabs,0,1)
  +2.5*(MEAS.widths[1600].land.unread?0.5:1);
 g.push({k:'First touch', v:+ft.toFixed(1), moves:false,
  how:'boot to first word, choices above the fold on the landing surface, share of the bar reachable at 390, and whether the landing surface has a reading to show'});
 /* 3. Core loop. does it close, and how often. moves. */
 const closes=s.totals.loopClosed/Math.max(1,s.n);
 g.push({k:'Core loop', v:+(10*(0.55*s.loopEver+0.45*clamp(closes/12,0,1))).toFixed(1), moves:true,
  how:'share who ever closed story to release to a kept practice, and how many times'});
 /* 4. Emotional register. what the box does with what it was told. moves. */
 g.push({k:'Emotional', v:+(10*(0.6*s.readShare+0.4*(1-s.inferShare))).toFixed(1), moves:true,
  how:'share of commits the sniffer read at all, and share of those that named an address rather than inferring one'});
 /* 5. Behavioural flow. measured. */
 const flow=10*(loadAt('desk')*(1-deviceShare)+loadAt('phone')*deviceShare)
  *clamp(M.stripPhone/M.tabs+0.5,0,1);
 g.push({k:'Behavioral flow', v:+flow.toFixed(1), moves:false,
  how:'mean of twelve over the choices above the fold on every surface, at the cohort device mix, discounted by how much of the bar a phone can reach'});
 /* 6. Visual and kinetic. carried from reviews/SIM-ninety-days.md at 8. not
    re-measured here, and it says so rather than inventing an instrument. */
 g.push({k:'Visual and kinetic', v:8, moves:false, carried:true,
  how:'carried unchanged from the earlier simulation. this pass built no instrument for it'});
 /* 7. Technical. measured. */
 const tech=(M.errors===0?3:0)+(M.requests<=1?2:0)+(M.small===0?2:0)
  +(M.bootMs<1000?2:0)+1;
 g.push({k:'Technical', v:+tech.toFixed(1), moves:false,
  how:'page errors, outbound requests, controls under the 44 floor, boot to first word, and every surface rendering'});
 /* 8. Monetization. the decision point is reached, and nothing is there. moves
    in the share that reach it. */
 const reach=s.totals.giftFloor/Math.max(1,s.n);
 g.push({k:'Monetization', v:+(2*clamp(reach*6,0,1)+(M.money?4:0)+(M.refer?2:0)
  +(MEAS.loop.exhausted.ranAnyway?0:2)).toFixed(1),
  moves:true, how:'share who reach the end of the gift, whether any price exists on a surface a new arrival reaches, and whether the allowance is enforced at all'});
 /* 9. Retention. modelled day thirty against the cited category median. moves. */
 g.push({k:'Retention', v:+lerp(s.retention[30]*100,[0,3.3,10,20,35],[0,3,6,8,10]).toFixed(1),
  moves:true, how:'modelled day thirty against a category median of 3.3 percent, interpolated'});
 /* 10. Referral. measured, and it is a floor because the mechanism is absent. */
 g.push({k:'Referral', v:+(5*(M.refer?1:0)+5*0.6).toFixed(1), moves:false,
  how:'export exists, a way to hand a reading to another person does not'});
 const total=g.reduce((a,x)=>a+x.v,0);
 return {rows:g, total:+total.toFixed(1), letter:letterOf(total)};}
function letterOf(t){
 const L=[[90,'A'],[85,'A-'],[80,'B+'],[75,'B'],[70,'B-'],[65,'C+'],[60,'C'],
  [55,'C-'],[50,'D+'],[45,'D'],[40,'D-']];
 for(const [n,l] of L)if(t>=n)return l;
 return 'F';}

/* ============================================================
   RUN UNTIL IT STOPS MOVING.

   The stopping rule, stated: the running mean of the total grade must move by
   less than SETTLE points when one more run is added, and it must do that for
   HOLD runs in a row, with at least FLOOR runs behind it. The run count is
   whatever that takes. Nothing here is chosen in advance except the threshold.
   ============================================================ */
const SETTLE=0.05, HOLD=6, FLOOR=10, CEIL=400;
function sd(a){if(a.length<2)return 0; const m=a.reduce((x,y)=>x+y,0)/a.length;
 return Math.sqrt(a.reduce((x,y)=>x+(y-m)*(y-m),0)/(a.length-1));}

function main(){
 const arg=process.argv[2];
 const ver=verifyRelease();
 if(!ver.ok){
  console.error('The lifted release does not agree with the shipped one:');
  ver.bad.forEach(b=>console.error('  '+b));
  process.exit(3);}
 console.log('release arithmetic verified against Chromium. '
  +ver.cqBefore+' to '+ver.cqAfter+' on '+ver.picked+', '+ver.lines+' lines, '
  +ver.seconds+' seconds.');
 if(arg==='verify')return;
 const fixed=arg?+arg:0;
 const runs=[], totals=[], means=[];
 let held=0, settledAt=null;
 for(let i=1;i<=(fixed||CEIL);i++){
  const r=runCohort(0x5eed*i+i*7919);
  runs.push(r); totals.push(r.grade.total);
  const mean=totals.reduce((a,b)=>a+b,0)/totals.length;
  const move=means.length?Math.abs(mean-means[means.length-1]):null;
  means.push(mean);
  process.stdout.write('run '+String(i).padStart(3)+'  grade '+r.grade.total.toFixed(2)
   +'  mean '+mean.toFixed(3)+'  move '+(move===null?'   -  ':move.toFixed(4))
   +'  sd '+sd(totals).toFixed(3)+'  d30 '+(r.retention[30]*100).toFixed(2)+'%\n');
  if(!fixed){
   if(move!==null&&move<SETTLE&&i>=FLOOR){held++; if(held>=HOLD){settledAt=i; break;}}
   else held=0;}}
 const mean=totals.reduce((a,b)=>a+b,0)/totals.length;
 const out={
  stamp:MEAS.stamp,
  seedGap:SEEDGAP,
  measured:M, measuredRaw:{widths:MEAS.widths, loop:MEAS.loop},
  verify:ver,
  ceiling:{none:ceilingCase(null), low:ceilingCase(3), mid:ceilingCase(5), high:ceilingCase(7)},
  model:{showup:SHOWUP, friction:FRICTION, cost:COST, cohort:COHORT,
   settle:{threshold:SETTLE, hold:HOLD, floor:FLOOR, runs:runs.length,
    settledAt:settledAt, fixed:!!fixed}},
  /* THE ROSTER'S OWN SIGNATURE LINES, put through the shipped sniffer. These
     are not written for this exercise: they are the `says` field on every
     entry in engine/data/people.js, which is the repository's own voice for
     each of these people. */
  says:E.PEOPLE.map(p=>{const q=parseStory(p.says);
   return {nm:p.nm, says:p.says.trim(), hits:q.hits.length,
    imprints:q.imprints.length, named:q.named.slice(0,3),
    offers:q.imprints.slice(0,3).map(i=>i.name),
    inferred:q.imprints.length>0&&q.imprints.every(i=>i.inferred)};}),
  lexicon:{words:Object.keys(E.LEX).length, phrases:Object.keys(E.PHRASES).length,
   adjectives:Object.keys(E.ADJ2CHG).length},
  storyBank:(()=>{ /* what the shipped sniffer reads out of the bank, measured */
   const rows=[]; Object.keys(STORYBANK).forEach(who=>STORYBANK[who].forEach(([why,txt])=>{
    const q=parseStory(txt);
    rows.push({who:who, why:why, text:txt, hits:q.hits.length,
     imprints:q.imprints.length, named:q.named.slice(0,3),
     inferred:q.imprints.length>0&&q.imprints.every(i=>i.inferred),
     offers:q.imprints.slice(0,3).map(i=>i.name)});}));
   return rows;})(),
  grade:{mean:+mean.toFixed(2), sd:+sd(totals).toFixed(3),
   lo:Math.min.apply(null,totals), hi:Math.max.apply(null,totals),
   letter:letterOf(mean), totals:totals, means:means.map(x=>+x.toFixed(3)),
   rows:(()=>{ /* per criterion mean and spread across runs */
    const ks=runs[0].grade.rows.map(r=>r.k);
    return ks.map((k,i)=>{const v=runs.map(r=>r.grade.rows[i].v);
     return {k:k, mean:+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(2), sd:+sd(v).toFixed(3),
      lo:Math.min.apply(null,v), hi:Math.max.apply(null,v),
      moves:runs[0].grade.rows[i].moves, carried:!!runs[0].grade.rows[i].carried,
      how:runs[0].grade.rows[i].how};});})()},
  retention:(()=>{const o={}; DAYS.forEach(d=>{
    const v=runs.map(r=>r.retention[d]), w=runs.map(r=>r.alive[d]);
    o[d]={mean:+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(5), sd:+sd(v).toFixed(5),
     alive:+(w.reduce((a,b)=>a+b,0)/w.length).toFixed(5)};});
   return o;})(),
  window:WINDOW,
  daily:(()=>{const o=[]; for(let i=0;i<90;i++){
    const v=runs.map(r=>r.daily[i]);
    o.push(+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(5));}
   return o;})(),
  weekly:(()=>{const o=[]; for(let i=0;i<13;i++){
    const v=runs.map(r=>r.weekly[i]);
    o.push(+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(5));}
   return o;})(),
  lost:(()=>{const o={}; const ks={};
   runs.forEach(r=>Object.keys(r.lost).forEach(k=>ks[k]=1));
   Object.keys(ks).forEach(k=>{
    const v=runs.map(r=>r.lost[k]||0);
    const by={}; runs.forEach(r=>Object.keys(r.lostBy[k]||{}).forEach(nm=>
     by[nm]=(by[nm]||0)+r.lostBy[k][nm]/runs.length));
    o[k]={people:Math.round(v.reduce((a,b)=>a+b,0)/v.length),
     sd:+sd(v).toFixed(2),
     by:Object.keys(by).sort((a,b)=>by[b]-by[a]).map(nm=>({nm:nm,n:Math.round(by[nm])})),
     nm:(FRICTION[k]||{}).nm||'unattributed',
     surf:(FRICTION[k]||{}).surf||'', step:(FRICTION[k]||{}).step||'',
     say:(FRICTION[k]||{}).say||''};});
   return o;})(),
  hitShare:(()=>{const o={};
   Object.keys(FRICTION).forEach(k=>{
    const v=runs.map(r=>r.hitShare[k]||0);
    const c=runs.map(r=>r.hits[k]||0);
    o[k]={share:+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(4),
     sd:+sd(v).toFixed(4),
     perThousand:Math.round(c.reduce((a,b)=>a+b,0)/c.length),
     nm:FRICTION[k].nm, surf:FRICTION[k].surf, step:FRICTION[k].step,
     say:FRICTION[k].say, cost:FRICTION[k].cost};});
   return o;})(),
  icp:(()=>{const o={};
   SHOWUP.forEach(sp=>{
    const rows=runs.map(r=>r.icp[sp.nm]);
    const m=f=>+(rows.reduce((a,r)=>a+(f(r)||0),0)/rows.length).toFixed(3);
    o[sp.nm]={weight:sp.weight, grid:sp.grid, device:sp.device, shape:sp.shape,
     age:sp.age, role:sp.role, why:sp.why, whyNot:sp.whyNot,
     n:rows[0].n, arrived:m(r=>r.arrived/r.n),
     ret:DAYS.reduce((a,d)=>(a[d]=m(r=>r.ret[d]),a),{}),
     alive:DAYS.reduce((a,d)=>(a[d]=m(r=>r.alive[d]),a),{}),
     quitBy3:m(r=>r.quitBy3/r.n),
     sessions:m(r=>r.sessions), minutes:m(r=>r.minutes),
     stories:m(r=>r.stories), readShare:m(r=>r.readShare),
     releases:m(r=>r.releases), loopEver:m(r=>r.loopEver),
     loopClosed:m(r=>r.loopClosed),
     cq0:m(r=>r.cq0), cq90:m(r=>r.cq90), cqDelta:m(r=>r.cqDelta),
     ground:m(r=>r.ground), clear:m(r=>r.clear), marks:m(r=>r.marks),
     streakBest:m(r=>r.streakBest), ritualMinutes:m(r=>r.ritualMinutes),
     giftLeft:m(r=>r.giftLeft), accuracy:m(r=>r.accuracy),
     exit:(()=>{const ks=Object.keys(rows[0].exit); const o={};
      ks.forEach(k=>o[k]=+(rows.reduce((a,r)=>a+(r.exit[k]||0),0)/rows.length).toFixed(3));
      return o;})(),
     topHits:rows[0].topHits};});
   return o;})(),
  totals:(()=>{const ks=Object.keys(runs[0].totals); const o={};
   ks.forEach(k=>{const v=runs.map(r=>r.totals[k]);
    o[k]=+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(2);});
   o.readShare=+(runs.reduce((a,r)=>a+r.readShare,0)/runs.length).toFixed(4);
   o.inferShare=+(runs.reduce((a,r)=>a+r.inferShare,0)/runs.length).toFixed(4);
   o.keptShare=+(runs.reduce((a,r)=>a+r.keptShare,0)/runs.length).toFixed(4);
   o.loopEver=+(runs.reduce((a,r)=>a+r.loopEver,0)/runs.length).toFixed(4);
   return o;})()};
 /* SENSITIVITY. Run to run noise at a thousand people is nearly nil, so the
    spread that matters is in the model constants and not in the seed. Every
    friction cost and every base rate is moved by a quarter in both directions
    and the grade is re-read. */
 out.sensitivity=(()=>{
  const base=out.grade.mean, rows=[];
  const savedCost={}; Object.keys(FRICTION).forEach(k=>savedCost[k]=FRICTION[k].cost);
  const savedBase={}; SHOWUP.forEach(s=>savedBase[s.nm]=s.base);
  [['friction cost',0.75],['friction cost',1.25]].forEach(([nm,f])=>{
   Object.keys(FRICTION).forEach(k=>FRICTION[k].cost=savedCost[k]*f);
   const r=runCohort(0x5eed*3+21757);
   rows.push({what:nm, factor:f, total:r.grade.total, d:+(r.grade.total-base).toFixed(2)});
   Object.keys(FRICTION).forEach(k=>FRICTION[k].cost=savedCost[k]);});
  [['opening rate',0.75],['opening rate',1.25]].forEach(([nm,f])=>{
   SHOWUP.forEach(s=>s.base=savedBase[s.nm]*f);
   const r=runCohort(0x5eed*3+21757);
   rows.push({what:nm, factor:f, total:r.grade.total, d:+(r.grade.total-base).toFixed(2)});
   SHOWUP.forEach(s=>s.base=savedBase[s.nm]);});
  return {base:base, rows:rows,
   span:+(Math.max.apply(null,rows.map(r=>r.total))-Math.min.apply(null,rows.map(r=>r.total))).toFixed(2)};})();
 fs.writeFileSync(path.join(__dirname,'runs.json'),JSON.stringify(out,null,1));
 console.log('\nsettled at run '+(settledAt||runs.length)
  +'. grade '+out.grade.mean.toFixed(2)+' ('+out.grade.letter+'), sd '
  +out.grade.sd.toFixed(2)+', range '+out.grade.lo.toFixed(1)+' to '+out.grade.hi.toFixed(1)
  +'. day 30 '+(out.retention[30].mean*100).toFixed(2)+'%.'
  +' model span '+out.sensitivity.span.toFixed(2)+' points.');
 console.log('sim/runs.json written.');}
main();
