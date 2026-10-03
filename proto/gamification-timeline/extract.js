/* ============================================================
   REAL DATA FOR THE GAMIFICATION TIMELINE. A prototype, not the app.

   The owner: "I also don't understand our badges, achievements, and scoring
   mechanics. We haven't seen that system yet. Create mock-ups that are
   interactive with the time slider from moment one to day 90 in intervals so
   we can see what it looks like over time when we scale it."

   Nothing the mockup prints is typed by hand. This file:

   1. writes the COMMITTED engine (git show HEAD:engine.js) to a temp file and
      requires it, because the working tree may carry another seat's work;
   2. runs it under a simulated clock, so every timestamp the engine writes on
      its own (meterRun, meterFirst, snapshot) lands on the simulated day and
      not on the machine's today. Without this the gift is stamped as spent in
      the real present and the allowance counts weeks backwards;
   3. drives each ICP day by day exactly as proto/ninety/arc90.js section C
      does: a kept day is a story from their own bank (sim/stories.js, then
      their `says` line), a release over the three heaviest addresses above
      the line if the allowance permits, and the practice the model calls for,
      saved and marked done. The release's charge half is lifted from
      ui/release.js relCoolDown and guarded against its source, as arc90 does;
   4. reads the shipped ladder (ladderRead, streakRead, ledgerRead,
      intentionRead), the ruler (meterRead), the allowance (meterBudget) and
      the reading (compute) at the end of every day, 0 to 90.

   Three cadences, because the ladder behaves differently under each:
     model   losssim.js's longest walk for that ICP on "built", seed 20260920.
             A MODEL of when somebody comes back, not an observed person.
     daily   every day for ninety days. The ceiling.
     twice   Mondays and Thursdays. A fixed schedule, typed here, chosen
             because it is the cadence the halving rule was argued for.

   The intake is answered on day one from the person's reference laws
   (LAWSET), as arc90's "intake" walk does. Moment one, day 0, is the blank
   profile before anything is touched.

     NODE_PATH=/opt/node22/lib/node_modules node proto/gamification-timeline/extract.js
   ============================================================ */
'use strict';
const fs=require('fs'), path=require('path'), cp=require('child_process'), os=require('os');
const D=__dirname, ROOT=path.resolve(D,'..','..');
const sh=c=>cp.execSync(c,{cwd:ROOT,maxBuffer:64<<20});
const commit=sh('git rev-parse --short HEAD').toString().trim();
const engSrc=sh('git show HEAD:engine.js');
const md5=require('crypto').createHash('md5').update(engSrc).digest('hex');

/* THE CLOCK. A Date that reads the simulated moment when asked for "now". */
const RealDate=Date; let SIM=null;
class SimDate extends RealDate{
 constructor(...a){ if(a.length===0&&SIM!==null)super(SIM); else super(...a); }
 static now(){ return SIM!==null?SIM:RealDate.now(); }}
global.Date=SimDate;

const tmp=path.join(os.tmpdir(),'gt-engine-'+process.pid+'.js');
fs.writeFileSync(tmp,engSrc);
const E=require(tmp);
let MEM={}; E.bindStore(k=>MEM[k],(k,v)=>{MEM[k]=v;});
const {STORYBANK}=require(path.join(ROOT,'sim/stories.js'));
const LOSS=(function(){const log=console.log; console.log=function(){};
 try{return require(path.join(ROOT,'proto/ritual/losssim.js'));}finally{console.log=log;}})();

/* THE LIFT, guarded exactly as arc90 guards it. */
const RSRC=sh('git show HEAD:atuned_src/ui/release.js').toString();
const LIFTOK={take:/w0\*0\.21\+2/.test(RSRC), install:/share\*0\.62/.test(RSRC),
 meter:/meterRun\(CURP,RUN\.plan/.test(RSRC), lawlift:/releaseWork\(CURP,/.test(RSRC)};
const CHANM=/var CHAN=(\[[^;]*\]);/.exec(RSRC);
if(!CHANM||!Object.values(LIFTOK).every(Boolean)){
 console.log('ui/release.js no longer carries the lifted arithmetic: '+JSON.stringify(LIFTOK)); process.exit(3);}
const CHANS=Function('return '+CHANM[1])().map(c=>c[0]+c[2]);
function releaseRun(p,ids){
 const q=ids.map(i=>E.BY[i]).filter(n=>n&&n.cf);
 if(!q.length)return {ran:false};
 const cap=E.meterBudget(p,Date.now()).cap;
 const plan=cap>0?E.meterPlan(p,q.map(n=>n.i),CHANS,cap):[];
 if(!plan.length)return {ran:false, refused:true};
 q.forEach(n=>{const w0=n.sq*10, d=-Math.round(w0*0.21+2);
  const share=Math.abs(d)/10/Math.max(1,q.filter(x=>x.cf===n.cf).length);
  E.S.charge[n.cf]=E.clamp((E.S.charge[n.cf]||0)-share,0,10);
  E.S.replace[n.cf]=E.clamp((E.S.replace[n.cf]||0)+share*0.62,0,10);});
 const m=E.meterRun(p,plan);
 E.releaseWork(p,(m&&m.fresh)||[]);
 E.saveProfile(p); p.history.push(E.snapshot(p));
 return {ran:true, lines:plan.length};}

const ORDER=['Marcus','Derek','Angela','James','Sofia','Diane','Ana','Gordon','Rosa'];
const DAY=86400000;
/* day 0 is 1 September 2026, 07:00 UTC. A session is at 08:00, the read is at 21:00. */
const T0=RealDate.UTC(2026,8,1,7,0);
const tAct=d=>T0+d*DAY+3600000, tRead=d=>T0+d*DAY+14*3600000;
const MK=E.MARKS.map(m=>m.k);

function drive(nm,seq,called){
 SIM=T0; MEM={};
 const p=E.blankProfile('You');
 const P=E.PEOPLE.find(x=>x.nm===nm);
 const texts=(STORYBANK[nm]||[]).map(x=>x[1]).concat([P.says]);
 const LS=E.LAWSET[nm]||{};
 E.loadProfile(p);
 let stories=0;
 const days=[];
 const read=(d,act)=>{
  SIM=tRead(d); const now=SIM;
  const L=E.ladderRead(p,now), s=L.streak, l=L.ledger, r=E.compute();
  const mr=E.meterRead(p,now), b=E.meterBudget(p,now), it=E.intentionRead(p,now);
  const ids={}; (p.meter&&p.meter.unique||[]).forEach(k=>{ids[String(k).split(':')[0]]=1;});
  const tier=E.tierOf(r.CQ);
  return {d, act,
   e:L.earned.map(m=>MK.indexOf(m.k)), nx:L.next?MK.indexOf(L.next.k):-1,
   s:[s.run,s.live?1:0,s.best,s.days,s.gap===undefined?null:s.gap],
   l:[l.minutes,l.planned,l.rituals,l.done,l.lines,l.ground,l.clear,l.carry,l.snaps],
   st:stories, places:Object.keys(ids).length, firsts:(p.meter&&p.meter.firsts||[]).length,
   mk:mr.next?[mr.next.nm,mr.next.at,mr.next.left]:null, est:mr.estimate,
   gift:mr.giftLeft, left:b.left, say:b.allow?b.allow.say:'',
   it:it.pct===null?null:Math.round(it.pct),
   unread:r.unread?1:0, cq:+r.CQ.toFixed(2), ex:+r.EX.toFixed(1), dq:+r.DQ.toFixed(1), tier:tier?tier.nm:'', over:r.loaded.length};};
 days.push(read(0,{kept:0}));
 for(let d=1;d<=90;d++){
  const kept=seq[d-1]>0, act={kept:kept?1:0};
  SIM=tAct(d);
  if(d===1){
   E.SINAMES.forEach(k=>{p.laws[k]=(LS[k]!==undefined)?LS[k]:(LS._!==undefined?LS._:null);});
   p.intake=p.intake||{}; p.intake.completedAt=new Date().toISOString(); act.intake=1;
   /* loadProfile copies the record into live state, so answers written to the
      record after it are invisible to compute() until it is loaded again.
      Nothing else has been written yet on day one, so reloading loses nothing. */
   E.loadProfile(p);}
  if(kept){
   const t=texts[stories%texts.length]; stories++;
   const q=E.parseStory(t); act.lit=q.imprints.length;
   E.applyStory(t); E.verpApply(t); E.leanApply(t);
   p.story.entries.push({t:new Date().toISOString(),text:t});
   E.saveProfile(p); p.history.push(E.snapshot(p));
   const r=E.compute();
   const live=r.loaded.slice().sort((a,b)=>b.sq-a.sq);
   if(live.length){const rr=releaseRun(p,live.slice(0,3).map(n=>n.i));
    act.rel=rr.ran?rr.lines:0; if(!rr.ran)act.refused=1;}
   p.rituals.push({t:new Date().toISOString(),track:'',band:'',steps:[called.k],
    min:+called.min||5,when:'',where:'',done:true});
   E.saveProfile(p);}
  days.push(read(d,act));}
 SIM=null;
 return days;}

/* the model's cadence, and the practice it calls for, per ICP */
const people={};
for(const nm of ORDER){
 for(const k in LOSS.TRACE)delete LOSS.TRACE[k];
 const log=console.log; console.log=function(){};
 let res; try{res=LOSS.runSim('built',{trace:nm,seed:20260920});}finally{console.log=log;}
 const m=res.meas[nm], called={k:m.called,min:m.min};
 const tr=(LOSS.TRACE.days||[]).slice(0,90); while(tr.length<90)tr.push(0);
 const every=new Array(90).fill(1);
 const twice=Array.from({length:90},(_,i)=>{const d=i+1; return (d%7===1||d%7===4)?1:0;});
 const P=E.PEOPLE.find(x=>x.nm===nm);
 people[nm]={nm, role:P.role||'', says:P.says||'', practice:called,
  model:{kept:tr.filter(x=>x>0).length, lastDay:tr.lastIndexOf(1)+1||tr.lastIndexOf(2)+1},
  walks:{model:drive(nm,tr,called), daily:drive(nm,every,called), twice:drive(nm,twice,called)}};
 console.log(nm, called.k, called.min+' min', 'model kept', people[nm].model.kept,
  'marks d90 model/daily/twice', ['model','daily','twice'].map(w=>people[nm].walks[w][90].e.length).join('/'));}

const tables={
 MARKS:E.MARKS.map(m=>({k:m.k,fam:m.fam,b:m.b,nm:m.nm,d:m.d,ic:m.ic})),
 PAL:E.PAL,
 TIERDEF:E.TIERDEF.map(t=>({nm:t.nm,at:t.at})),
 MARKERS:E.MARKERS.map(k=>({nm:k.nm,at:k.at||null,frac:k.frac||null})),
 GIFT_N:E.GIFT_N};
const out={stamp:{commit,engineMd5:md5,read:new RealDate().toISOString().slice(0,10),
 t0:new RealDate(T0).toISOString().slice(0,10)},tables,people};
fs.writeFileSync(path.join(D,'data.json'),JSON.stringify(out));
console.log('wrote data.json',(JSON.stringify(out).length/1024).toFixed(0)+'KB, engine',md5,'at',commit);
fs.unlinkSync(tmp);
