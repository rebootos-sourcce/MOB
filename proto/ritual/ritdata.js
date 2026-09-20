/* ============================================================
   THE RITUAL PAGE'S DATA. Every number real, and every gate stated.

   caldata.js carried forward. Its reading, its walk, its three kinds, its
   queue and its five gates are kept line for line, because that half was
   right and the owner rejected the calendar as a FRAME, not as arithmetic.

   What is added here, and nothing else:

     THE THREE SHAPES.  A ritual is a count, a window, or a stance. His own
     examples reveal all three and nothing in the build distinguishes them.
     The shape decides what parameters a card carries and how a day is
     marked, which is the answer to his open question RB11.

     HIS BEHAVIOUR LIBRARY.  The nine items he listed, verbatim, with his own
     numbers. Every one carries src:'owner' so no reader can mistake his list
     for an engine reading. GATE 6 refuses to write if an item claims a
     number the owner did not state.

     THE STANCE TO LAW MAP.  Practise honesty and practise compassion have no
     count and no window. They seat on a law. GATE 7 refuses to write if a
     stance names a law SINAMES does not carry, which is how "Honesty" was
     caught: the engine's law is Truth and there is no law called Honesty.

     THE WEEK.  Monday through Sunday, ruled. The last seven days of the walk
     laid against weekday, so a day that has not happened is not a failure and
     a day before the record starts has no cell under it.

     THE IMPROVEMENT.  Days kept in the last four weeks against the four
     before. Stated only when both windows are full, which is eight weeks of
     record. Below that the slot says what it is waiting for, because a
     fortnight read as a trend is a defect this file's predecessor already
     shipped once and had caught by looking at the picture.

   SEVEN GATES. One to five are caldata's, unchanged. Six and seven are new.
   ============================================================ */
const path=require('path'), fs=require('fs');
const E=require(path.resolve(__dirname,'../../engine.js'));
const {S,CHARGES,SINAMES,LAWSET,PEOPLE,buildSoul,compute,PRACTICE,ladderRead,
       SPEC_POLE,sniffStory,avatarBlank,SI,PAL}=E;

/* the same port of ui/personas.js loadP that caldata.js carries. compute()
   reads shared state rather than its argument, so a profile is loaded and not
   passed. */
function loadPerson(p){
 S.dom=p.dom; S.a1=p.a1; S.a2=p.a2;
 S.doms=[p.dom]; S.arcs=[p.a1,p.a2]; S.roots=[];
 buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=(p.c&&p.c[c]!==undefined)?p.c[c]:0;
  S.replace[c]=(p.rep&&p.rep[c])||0;});
 const LS=LAWSET[p.nm]||{_:5.5};
 SINAMES.forEach(l=>{S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:5.5);});
 return compute();}

const TRACK4BAND={Root:'Body',Sacral:'Somatic',Solar:'Somatic',Heart:'Body',
                  Throat:'Mind','3rd Eye':'Mind',Crown:'Energy'};
const lightest=set=>set.slice().sort((a,b)=>(a.min-b.min)||(a.tier-b.tier))[0];
const firstInTable=set=>set[0];

/* ritFor, ported line for line from atuned_src/ui/ritual.js:9. */
function ritFor(r,pick){
 pick=pick||lightest;
 const band=r.darkB||'Root', track=TRACK4BAND[band]||'Body';
 const tier=r.DQ>=8?1:(r.DQ>=4?2:3);
 const fit=PRACTICE.filter(p=>p.tier<=tier);
 const first=fit.filter(p=>p.track===track);
 const called=first.length?pick(first):pick(fit);
 return {band,track,tier,called,substituted:!first.length,
  actualTrack:called?called.track:track,all:fit};}

function forSeat(seat,tier,skip){
 skip=skip||{};
 const track=TRACK4BAND[seat]||'Body';
 const fit=PRACTICE.filter(p=>p.tier<=tier&&!skip[p.k]);
 const on=fit.filter(p=>p.track===track);
 if(!fit.length)return null;
 const c=on.length?lightest(on):lightest(fit);
 return c?{k:c.k,nm:c.nm,min:c.min,track:c.track,tier:c.tier,
           substituted:!on.length,wanted:track}:null;}

const SIM=require(path.resolve(__dirname,'losssim.js'));
const TODAY=Date.UTC(2026,8,20);           /* Sunday 20 September 2026 */
const WHO=['Marcus','Gordon','Diane','Angela','Sofia','Derek','Rosa','James'];
const WT={Diane:180,Derek:170,Marcus:160,Angela:150,Sofia:140,James:100,
          Ana:50,Gordon:35,Rosa:15};

/* ---------- THE THREE KINDS, caldata's, unchanged ---------- */
const KIND=[
 {k:'hold',   nm:'Always on', fam:'Practice',  band:'Root',
  d:'the avatar does not manifest without these',
  src:'carrying',  cadence:'every day'},
 {k:'change', nm:'Behaviour', fam:'Structure', band:'Heart',
  d:'aimed at the law that is running weakest',
  src:'weakL',     cadence:'every day'},
 {k:'release',nm:'Release',   fam:'Ground',    band:'Throat',
  d:'the protocol, at one address',
  src:'sniffStory',cadence:'when called'}];

/* ============================================================
   THE THREE SHAPES, AND WHY THERE ARE THREE.

   His own list holds nine behaviour rituals and they are not one object.
   Sorted by what has to be recorded at the end of a day:

     COUNT    a number you reached, over a period. Eight glasses of water by
              night. An affirmation said ten times. Raw vegetables five days a
              week. Parameters: the target, the thing being counted, and the
              period. A day is marked by the number you did. A practice out of
              PRACTICE is a count with a target of one and its minutes
              attached, because minutes are what it costs and not what it
              measures.

     WINDOW   a span with an edge, and you either held it or crossed it. No
              phone for the first thirty minutes. No news for the first hour.
              Parameters: what is set down, where the window starts, and how
              long it runs. A day is marked held or broken, and broken carries
              the minute it broke at, because a window that broke at
              twenty eight minutes is not the same day as one that broke at
              two.

     STANCE   no count and no window. Practise honesty. Practise compassion.
              It seats on a law and it is the hardest to mark honestly.

   THE STANCE, SOLVED RATHER THAN DEFERRED, and the argument is the product's
   own. A binary on a stance is a lie in both directions: nobody practised
   honesty perfectly and nobody failed it entirely, and a reading is not a
   score. A nought to ten self rating is the intake's job and would let a
   tracker write onto a law, which is a loop the engine does not have.

   So: a stance is not practised on demand, it is practised when a moment asks
   for it. That is the same shape as an imprint, which sits at an address and
   fires when something addresses it. The parameters on a stance card are
   therefore not a target. They are two counts the day supplies: how many
   times it was tested, and how many of those it was met.

   That makes three honest day states rather than two. Met every test. Met
   some. Not called, which is neither kept nor missed and never counts against
   anybody. A day nothing tested your honesty is a day, not a failure.
   ============================================================ */
const SHAPE=[
 {k:'count', nm:'Count',  d:'a number you reach, over a period',
  params:['target','unit','period'],
  mark:'the number you did'},
 {k:'window',nm:'Window', d:'a span with an edge you hold or cross',
  params:['what','anchor','minutes'],
  mark:'held, or the minute it broke at'},
 {k:'stance',nm:'Stance', d:'held through a day, and called by the day',
  params:['law'],
  mark:'times tested, and times met'}];

/* ============================================================
   HIS BEHAVIOUR LIBRARY. TASKS.md 0q section RB, verbatim.

   "Gratitudes. An affirmation said ten times. No phone for the first thirty
   minutes of the day. No news for the first hour. Two glasses of water first
   thing. Eight glasses by night. Raw vegetables five days a week. Practise
   honesty. Practise compassion."

   Every number below is in that sentence. Nothing is rounded, scaled or
   filled in. Gratitudes is the one item he gave no number to, so its target
   is null and the card says the target is the person's, which is the honest
   state rather than a default nobody chose.

   src is 'owner' on every row. GATE 6 fails the build if any row carries a
   number that is not in his list, and GATE 7 fails it if a stance names a law
   the engine does not carry.
   ============================================================ */
const LIB=[
 {k:'grat', nm:'Gratitudes',          shape:'count', target:null, unit:'gratitudes',
  period:'a day',  src:'owner', said:'Gratitudes.'},
 {k:'aff',  nm:'An affirmation',      shape:'count', target:10,   unit:'times',
  period:'a day',  src:'owner', said:'An affirmation said ten times.'},
 {k:'phone',nm:'No phone',            shape:'window',what:'the phone', anchor:'waking',
  minutes:30,      src:'owner', said:'No phone for the first thirty minutes of the day.'},
 {k:'news', nm:'No news',             shape:'window',what:'the news',  anchor:'waking',
  minutes:60,      src:'owner', said:'No news for the first hour.'},
 {k:'wat2', nm:'Water, first thing',  shape:'count', target:2,    unit:'glasses',
  period:'a day',  src:'owner', said:'Two glasses of water first thing.'},
 {k:'wat8', nm:'Water, by night',     shape:'count', target:8,    unit:'glasses',
  period:'a day',  src:'owner', said:'Eight glasses by night.'},
 {k:'raw',  nm:'Raw vegetables',      shape:'count', target:5,    unit:'days',
  period:'a week', src:'owner', said:'Raw vegetables five days a week.'},
 {k:'hon',  nm:'Practise honesty',    shape:'stance',law:'Truth',
  src:'owner', said:'Practise honesty.',
  note:'The engine has no law called honesty. Truth is the law it carries and '
   +'it seats at the throat, so this card names Truth and says so.'},
 {k:'comp', nm:'Practise compassion', shape:'stance',law:'Compassion',
  src:'owner', said:'Practise compassion.'}];

/* the seat and the ring icon for a law, read out of SI rather than typed. */
const LAW={}; SI.forEach(s=>{LAW[s.nm]={nm:s.nm,seat:s.b,ic:s.ic};});

const out={profiles:{}, kinds:KIND, shapes:SHAPE, lib:LIB, law:LAW,
           today:TODAY, pal:PAL, practiceN:PRACTICE.length, lawN:SINAMES.length};

/* ---------- the week, Monday first, ruled ---------- */
const DAY=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAYFULL=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
/* 20 September 2026 is a Sunday, so it is index 6 of a Monday first week. */
const TODAYIX=6;

WHO.forEach(nm=>{
 const P=PEOPLE.filter(p=>p.nm===nm)[0];
 if(!P)throw new Error('no person '+nm);
 const r=loadPerson(P);
 const c=ritFor(r);
 const prof=Object.assign({},P,{rituals:[],axes:S.axes,meter:S.meter,history:[]});
 const lad=ladderRead(prof,TODAY);

 /* EVERYTHING READ OFF r IS READ HERE, BEFORE THE SIMULATOR RUNS. caldata's
    GATE 5 exists because the first cut read these after runSim and got the
    last simulated profile's field back. */
 const seatLoad={};
 r.carrying.forEach(x=>{seatLoad[x.b]=(seatLoad[x.b]||0)+x.held;});
 const seats=Object.entries(seatLoad).map(([b,v])=>({b,load:+v.toFixed(2),
   n:r.carrying.filter(x=>x.b===b).length}))
  .sort((a,b)=>b.load-a.load);

 const carryingN=r.carrying.length;
 const releasableN=r.carrying.filter(x=>x.sq>=4).length;
 const weakL=r.weakL||null;
 const rel=r.carrying.filter(x=>x.sq>=4)
  .sort((a,b)=>b.sq-a.sq).slice(0,3)
  .map(x=>({addr:x.n, fetter:x.k, seat:x.b, axis:x.c, sq:+x.sq.toFixed(2),
            replacement:(SPEC_POLE[x.c]||{}).pole||null}));

 const sn=sniffStory(P.says||'');
 const snOffer=sn.offer.map(o=>({addr:o.address, axis:o.axis,
   replacement:o.replacement, shadow:o.shadow}));

 const av=avatarBlank();

 /* the day by day walk. It runs last because it destroys the shared state
    everything above reads. */
 Object.keys(SIM.TRACE).forEach(k=>delete SIM.TRACE[k]);
 SIM.runSim('final',{trace:nm});
 const t=Object.assign({},SIM.TRACE);
 const walk=t.days||[];

 /* ---------- THE WEEK, LAID AGAINST WEEKDAY ----------
    The walk ends today. Today is Sunday, index 6 of a Monday first week, so
    the seven cells are walk[len-7] to walk[len-1]. A person whose record is
    shorter than a week gets nulls on the days before it started, and a null
    is not a miss: nothing is drawn under it at all. */
 const week=[];
 for(let i=0;i<7;i++){
  const j=walk.length-7+i;
  const dt=new Date(TODAY-(TODAYIX-i)*864e5);
  week.push({d:DAY[i], full:DAYFULL[i], date:dt.getUTCDate(),
   kept: j<0?null:(walk[j]===undefined?null:!!walk[j]),
   lived: j>=0&&walk[j]!==undefined,
   today: i===TODAYIX});}

 /* ---------- WHICH WEEKDAY YOU KEEP IT ----------
    Four weeks is the floor, carried forward from DESIGN-ritual 4.2: on seven
    days every weekday read as a clean run and the chart said nothing while
    looking as though it had. Below the floor the figure is null and the slot
    says what it is waiting for. */
 const WD_FLOOR=28;
 const wd=DAY.map((d,i)=>({d,full:DAYFULL[i],kept:0,lived:0}));
 for(let j=0;j<walk.length;j++){
  /* walk[len-1] is today, weekday index 6. Count backwards. */
  const back=walk.length-1-j;
  const ix=((TODAYIX-back)%7+7)%7;
  wd[ix].lived++; if(walk[j])wd[ix].kept++;}
 const weekdayReady=walk.length>=WD_FLOOR;

 /* ---------- WHAT HAS IMPROVED ----------
    Days kept in the last four weeks against the four before. Both windows
    have to be full, which is eight weeks of record. A shorter record gets
    null and the slot says what would fill it. */
 const W4=28, NEED=W4*2;
 let improved=null;
 if(walk.length>=NEED){
  const a=walk.slice(walk.length-W4).filter(Boolean).length;
  const b=walk.slice(walk.length-NEED,walk.length-W4).filter(Boolean).length;
  improved={now:a, before:b, diff:a-b, window:W4};}

 /* minutes practised. Real arithmetic on two real numbers: the days kept on
    the record, and the minutes the called practice costs. */
 const kept=walk.filter(Boolean).length;
 const missed=walk.length-kept;

 out.profiles[nm]={
  nm, age:P.age, role:P.role, weight:WT[nm]||0, says:P.says||'',
  CQ:+(+r.CQ).toFixed(1), DQ:+(+r.DQ).toFixed(2),
  seat:c.band, track:c.track, tier:c.tier, substituted:c.substituted,
  actualTrack:c.actualTrack,
  called:c.called?{k:c.called.k,nm:c.called.nm,min:c.called.min,
    track:c.called.track,tier:c.called.tier,d:c.called.d}:null,
  fit:c.all.map(p=>({k:p.k,nm:p.nm,min:p.min,track:p.track,tier:p.tier})),
  seats, carryingN, releasableN, rel, weakL,
  snOffer, snImprints:(sn.parsed&&sn.parsed.imprints||[]).length,
  avatarBuilt:!!av.built, avatarPairs:(av.pairs||[]).length,
  ledger:lad.ledger, streak:lad.streak,
  earned:lad.earned.map(m=>m.nm), next:lad.next?lad.next.nm:null,
  walk, walkDone:kept, walkMissed:missed, walkStreak:t.streak||0,
  week, wd, weekdayReady, wdFloor:WD_FLOOR, improved, improveNeed:NEED,
  minutes: c.called? kept*c.called.min : 0,
  sampled:t.n||0, survived:t.alive30||0};});

/* ============================================================
   THE QUEUE. caldata's three proposers, plus the stance.

   The stance row is not a fourth proposer. It reads compute().weakL, the same
   field the behaviour kind already names as its source, and it only fires
   when that law has a stance in his library. For James the weakest of the
   twenty one is Compassion and his own list holds practise compassion, so
   the proposal is his words arriving at the address the engine measured.
   ============================================================ */
const STANCE4LAW={}; LIB.filter(x=>x.shape==='stance').forEach(x=>{STANCE4LAW[x.law]=x;});

function queueFor(o){
 const q=[];
 /* everything already proposed, so no practice is offered under two kinds.
    forSeat takes this set and takes the next one in the same ordering, which
    is not a new rule: it is the next element of the rule already applied. */
 const used={};
 if(o.called)used[o.called.k]=1;
 const take=p=>{if(p)used[p.k]=1; return p;};

 if(!o.avatarBuilt)
  q.push({kind:'hold', by:'avatar', src:'avatarBlank', weight:1e6,
   nm:'Build the avatar', min:null, unit:'once', shape:null,
   because:'Nothing is written on either side yet, so there is no gap to close '
    +'and nothing to hold a daily ritual to.'});

 o.seats.slice(0,2).forEach((s,i)=>{
  const p=take(forSeat(s.b,o.tier,used)); if(!p)return;
  q.push({kind:'hold', by:'avatar', src:'avatarGap', weight:s.load,
   nm:p.nm, min:p.min, track:p.track, seat:s.b, unit:'a day',
   shape:'count', target:1, cunit:'a day', period:'a day',
   because:'Your '+s.b.toLowerCase()+' carries '+s.n+' live imprints, more than '
    +(i===0?'any other seat':'all but one')+'. The '+p.wanted.toLowerCase()
    +' track is what moves a '+s.b.toLowerCase()+'.'});});

 if(o.weakL){
  const p=take(forSeat(o.weakL.b,o.tier,used));
  if(p)q.push({kind:'change', by:'you', src:'weakL', weight:500,
   nm:p.nm, min:p.min, track:p.track, seat:o.weakL.b, law:o.weakL.nm,
   unit:'a day', shape:'count', target:1, cunit:'a day', period:'a day',
   because:o.weakL.nm.toLowerCase()+' is the weakest of your twenty one laws. '
    +'It seats at the '+o.weakL.b.toLowerCase()+', and the '+p.wanted.toLowerCase()
    +' track is what moves a '+o.weakL.b.toLowerCase()+'.'});

  /* THE STANCE, where his library has one for that law. */
  const st=STANCE4LAW[o.weakL.nm];
  if(st)q.push({kind:'change', by:'you', src:'weakL', weight:480,
   nm:st.nm, min:null, seat:LAW[st.law].seat, law:st.law, lib:st.k,
   unit:'through the day', shape:'stance',
   because:st.law.toLowerCase()+' is the weakest of your twenty one laws. '
    +'A stance has no count and no minutes. It seats at the '
    +LAW[st.law].seat.toLowerCase()+' and the day decides when it is tested.'});}

 o.snOffer.forEach(of=>{
  q.push({kind:'release', by:'sniffer', src:'sniffStory', weight:400+of.shadow,
   nm:of.addr, via:'The Observer Technique', min:20, track:'Somatic',
   addr:of.addr, axis:of.axis, replacement:of.replacement, unit:'when called',
   shape:'count', target:1, cunit:'a run', period:'when called',
   because:'Your own words carry '+of.axis.toLowerCase()+' at '+of.addr
    +'. The far pole there is '+of.replacement+'.'});});

 o.rel.forEach(a=>{
  q.push({kind:'release', by:'you', src:'carrying', weight:200+a.sq,
   nm:a.fetter, via:'The Observer Technique', min:20, track:'Somatic',
   addr:a.addr, axis:a.axis, replacement:a.replacement, fetter:a.fetter,
   unit:'when called', shape:'count', target:1, cunit:'a run',
   period:'when called',
   because:a.fetter+' is held at '+a.addr+', above the line release opens at. '
    +'The far pole there is '+a.replacement+'.'});});

 q.sort((a,b)=>b.weight-a.weight);
 return q.map((x,i)=>Object.assign({i},x));}

Object.values(out.profiles).forEach(o=>{o.queue=queueFor(o);});

/* ---------- WHERE TO IMPROVE, NAMED ----------
   RJ5. A page that only records is a log. The feedback names the weekday that
   is losing days and the practice the engine calls for at the seat carrying
   most, by name, and it refuses to speak below the four week floor. */
Object.values(out.profiles).forEach(o=>{
 const f={};
 if(!o.weekdayReady){
  f.state='waiting';
  f.need=o.wdFloor-o.walk.length;}
 else{
  const rated=o.wd.filter(x=>x.lived>0)
   .map(x=>Object.assign({rate:x.kept/x.lived},x))
   .sort((a,b)=>a.rate-b.rate);
  const worst=rated[0], best=rated[rated.length-1];
  f.state='read';
  f.worst={d:worst.full, kept:worst.kept, lived:worst.lived};
  f.best={d:best.full, kept:best.kept, lived:best.lived};
  f.flat=worst.rate===best.rate;}
 /* the practice named, off the seat carrying most, which is the same rule
    ritFor uses and not a second one. */
 const top=o.seats[0];
 f.practice=top?forSeat(top.b,o.tier):null;
 f.seat=top?top.b:null;
 f.protocol='The Observer Technique';
 f.releasable=o.releasableN;
 o.feedback=f;});

/* ============================================================
   THE GATES
   ============================================================ */
let bad=0;
const fail=m=>{bad++;console.error('  FAIL  '+m);};

/* PANEL-ritual-1000.md section 3.1, transcribed. */
const P31={
 Diane :[28.1, 3.51,'Solar' ,'Somatic',3,'The Emotional Scan',20, 8],
 Derek :[15.0,10.09,'Solar' ,'Somatic',1,'The Emotional Scan',20,20],
 Marcus:[39.2, 0   ,'Throat','Mind'   ,3,'Noting Meditation' ,15, 0],
 Angela:[40.9, 0   ,'Root'  ,'Body'   ,3,'Box Breathing'     , 5, 0],
 Sofia :[56.6, 0   ,'Throat','Mind'   ,3,'Noting Meditation' ,15, 0],
 James :[12.0, 9.19,'Sacral','Somatic',1,'The Emotional Scan',20,18],
 Ana   :[ 7.6,22.84,'Solar' ,'Somatic',1,'The Emotional Scan',20,41],
 Gordon:[ 0.8,55.19,'Throat','Somatic',1,'The Emotional Scan',20,97],
 Rosa  :[100 , 0   ,'Root'  ,'Body'   ,3,'Box Breathing'     , 5, 0]};

console.error('GATE 1  the reading against PANEL-ritual-1000.md 3.1');
const stale=[];
Object.entries(P31).forEach(([nm,e])=>{
 const P=PEOPLE.filter(p=>p.nm===nm)[0];
 const r=loadPerson(P), c=ritFor(r), old=ritFor(r,firstInTable);
 const got=c.substituted?c.actualTrack:c.track;
 const CQ=+(+r.CQ).toFixed(1), DQ=+(+r.DQ).toFixed(2);
 const relN=r.carrying.filter(x=>x.sq>=4).length;
 if(CQ!==e[0])   fail(nm+' CQ '+CQ+' against '+e[0]);
 if(DQ!==e[1])   fail(nm+' DQ '+DQ+' against '+e[1]);
 if(r.darkB!==e[2]) fail(nm+' seat '+r.darkB+' against '+e[2]);
 if(got!==e[3])  fail(nm+' track '+got+' against '+e[3]);
 if(c.tier!==e[4])  fail(nm+' tier '+c.tier+' against '+e[4]);
 if(relN!==e[7]) fail(nm+' releasable '+relN+' against '+e[7]);
 if(c.called.nm!==e[5]||c.called.min!==e[6]){
  if(old.called.nm===e[5]&&old.called.min===e[6])
   stale.push(nm+': panel '+e[5]+' '+e[6]+'m, build '+c.called.nm+' '+c.called.min+'m');
  else fail(nm+' practice '+c.called.nm+' against panel '+e[5]
    +', and the old first in table rule gives '+old.called.nm+', so this is '
    +'neither the current rule nor the one the panel measured');}});
console.error('        '+(bad?bad+' failures':'nine profiles, six columns each, all agree'));

console.error('GATE 2  the practice column of 3.1, and why it differs');
console.error('        '+stale.length+' of 9 rows differ, and the old first in table');
console.error('        rule reproduces every one of them. ui/ritual.js:16 records the');
console.error('        change and its reason. The panel column is stale, not wrong.');

console.error('GATE 3  the practice column against DESIGN-ritual.md 1.2');
const D12={Marcus:['Throat','Mind',3,'Active Listening',10],
 Sofia:['Throat','Mind',3,'Active Listening',10],
 Diane:['Solar','Somatic',3,'The Somatic Truth Check',2],
 Derek:['Solar','Somatic',1,'The Signal Test',3],
 Angela:['Root','Body',3,'Box Breathing',5],
 Rosa:['Root','Body',3,'Box Breathing',5],
 Gordon:['Throat','Somatic',1,'The Signal Test',3]};
Object.entries(D12).forEach(([nm,[seat,tr,ti,pn,mn]])=>{
 const o=out.profiles[nm]; if(!o){fail(nm+' not extracted');return;}
 const got=o.substituted?o.actualTrack:o.track;
 if(!(o.seat===seat&&got===tr&&o.tier===ti&&o.called.nm===pn&&o.called.min===mn))
  fail(nm+' against 1.2: got '+o.seat+'/'+got+'/'+o.tier+'/'+o.called.nm);});
console.error('        seven profiles, five columns each');

console.error('GATE 4  every queue row names a real engine.js source');
const RREF=loadPerson(PEOPLE.filter(p=>p.nm==='Gordon')[0]);
const isSrc=s=>(typeof E[s]==='function')||(s in E)||(s in RREF);
let rows=0, srcs={};
Object.values(out.profiles).forEach(o=>o.queue.forEach(q=>{
 rows++; srcs[q.src]=(srcs[q.src]||0)+1;
 if(!isSrc(q.src))
  fail('queue row cites '+q.src+', which is neither an engine.js export nor a '
   +'field of compute()');
 if(!q.because)fail('queue row with no because: '+q.nm);
 if(q.unit!=='once'&&!q.shape)
  fail('queue row with no shape: '+q.nm+'. A card with no shape has no '
   +'parameters and cannot be marked.');}));
console.error('        '+rows+' rows across '+WHO.length+' profiles, sources: '
 +Object.entries(srcs).map(([k,v])=>k+' '+v).join(', '));

console.error('GATE 5  every extracted number survives a clean reload');
let drift=0;
WHO.forEach(nm=>{
 const o=out.profiles[nm];
 const r=loadPerson(PEOPLE.filter(p=>p.nm===nm)[0]);
 const relN=r.carrying.filter(x=>x.sq>=4).length;
 const seatN=Object.keys(r.carrying.reduce((a,x)=>(a[x.b]=1,a),{})).length;
 if(o.carryingN!==r.carrying.length){
  drift++; fail(nm+' carrying '+o.carryingN+' in rit.json, '+r.carrying.length+' on reload');}
 if(o.releasableN!==relN){
  drift++; fail(nm+' releasable '+o.releasableN+' in rit.json, '+relN+' on reload');}
 if(o.seats.length!==seatN){
  drift++; fail(nm+' seats '+o.seats.length+' in rit.json, '+seatN+' on reload');}
 if(o.weakL&&r.weakL&&o.weakL.nm!==r.weakL.nm){
  drift++; fail(nm+' weakest law '+o.weakL.nm+' in rit.json, '+r.weakL.nm+' on reload');}});
console.error('        '+(drift?drift+' numbers moved':'eight profiles, four numbers each, none moved'));

/* GATE 6. EVERY NUMBER IN THE BEHAVIOUR LIBRARY IS IN HIS SENTENCE.
   The library is the one part of this file that is not read out of the engine,
   which makes it the one part that could carry an invented figure. Each row
   carries the sentence he said it in, and this gate reads the number back out
   of that sentence in words. A row whose target is not spelled in its own
   quotation does not write. */
console.error('GATE 6  every number in the behaviour library is in his own sentence');
const WORD={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,
 twenty:20,thirty:30,forty:40,fifty:50,sixty:60,hour:60,'half an hour':30};
const numsIn=s=>{const t=s.toLowerCase(),f=[];
 Object.entries(WORD).forEach(([w,v])=>{if(t.indexOf(w)>=0)f.push(v);});
 (t.match(/\d+/g)||[]).forEach(d=>f.push(+d)); return f;};
LIB.forEach(x=>{
 if(x.src!=='owner')fail('library row '+x.nm+' does not name the owner as its source');
 if(!x.said)fail('library row '+x.nm+' carries no quotation');
 const have=numsIn(x.said||'');
 const want=[];
 if(x.target!==null&&x.target!==undefined)want.push(x.target);
 if(x.minutes!==undefined)want.push(x.minutes);
 want.forEach(v=>{if(have.indexOf(v)<0)
  fail('library row '+x.nm+' carries '+v+', which is not in his sentence: '
   +JSON.stringify(x.said));});
 if(SHAPE.filter(s=>s.k===x.shape).length!==1)
  fail('library row '+x.nm+' has shape '+x.shape+', which is not one of the three');});
console.error('        '+LIB.length+' rows, '+LIB.filter(x=>x.shape==='count').length
 +' counts, '+LIB.filter(x=>x.shape==='window').length+' windows, '
 +LIB.filter(x=>x.shape==='stance').length+' stances');

/* GATE 7. EVERY STANCE NAMES A LAW THE ENGINE CARRIES.
   This gate caught the obvious mistake on its first run: his word is honesty
   and SINAMES has no Honesty. Truth is the law, it seats at the throat, and
   the card says so rather than renaming his practice or inventing a law. */
console.error('GATE 7  every stance seats on one of the twenty one laws');
LIB.filter(x=>x.shape==='stance').forEach(x=>{
 if(SINAMES.indexOf(x.law)<0)
  fail('stance '+x.nm+' names the law '+x.law+', which is not one of the '
   +SINAMES.length+' the engine carries');
 if(!LAW[x.law]||!LAW[x.law].seat)
  fail('stance '+x.nm+' names '+x.law+', which has no seat in SI');});
if(SINAMES.indexOf('Honesty')>=0)
 fail('the engine now carries a law called Honesty, so the note on the '
  +'practise honesty card is stale and must be re read');
console.error('        '+LIB.filter(x=>x.shape==='stance')
 .map(x=>x.nm+' seats on '+x.law+' at the '+LAW[x.law].seat.toLowerCase()).join(', '));

/* GATE 8. THE WEEK LANDS ON THE RIGHT WEEKDAY.
   20 September 2026 is a Sunday. A week that starts on Monday puts it in the
   last cell. Off by one here would print a person's Saturday under Sunday and
   nothing on the page would look wrong. */
/* GATE 9. NO PRACTICE IS PROPOSED UNDER TWO KINDS.
   It was, on Gordon: his root seat and his weakest law both land on the body
   track at tier 1, so Box Breathing stood in the always on band and the
   behaviour band at once. Invisible in the data and obvious in the shot. */
console.error('GATE 9  no ritual is proposed under two kinds');
Object.values(out.profiles).forEach(o=>{
 const seen={};
 if(o.called)seen[o.called.nm]='the standing ritual';
 o.queue.forEach(q=>{
  if(seen[q.nm])fail(o.nm+' is offered '+q.nm+' as '+q.kind+' and it is already '
   +seen[q.nm]);
  seen[q.nm]=q.kind;});});
console.error('        eight profiles, '
 +Object.values(out.profiles).reduce((a,o)=>a+o.queue.length,0)+' rows, each name once');

console.error('GATE 8  the week starts on Monday and today lands on Sunday');
if(new Date(TODAY).getUTCDay()!==0)
 fail('TODAY is not a Sunday, so the Monday first week is laid out wrong');
Object.values(out.profiles).forEach(o=>{
 if(o.week.length!==7)fail(o.nm+' week has '+o.week.length+' days');
 if(o.week[6].d!=='Sun')fail(o.nm+' week does not end on Sunday');
 if(!o.week[6].today)fail(o.nm+' does not mark Sunday as today');
 const lived=o.week.filter(x=>x.lived).length;
 if(lived>o.walk.length)fail(o.nm+' week shows '+lived+' lived days on a walk of '
  +o.walk.length);
 /* the weekday tally has to add up to the whole walk, or the modulo is wrong */
 const tot=o.wd.reduce((a,x)=>a+x.lived,0);
 if(tot!==o.walk.length)fail(o.nm+' weekday tally is '+tot+' against a walk of '
  +o.walk.length);
 const tk=o.wd.reduce((a,x)=>a+x.kept,0);
 if(tk!==o.walkDone)fail(o.nm+' weekday kept is '+tk+' against '+o.walkDone);});
console.error('        eight profiles, weekday tallies add to the walk');

if(bad){console.error('\n'+bad+' failures. refusing to write rit.json.');process.exit(1);}

fs.writeFileSync(path.resolve(__dirname,'rit.json'),JSON.stringify(out,null,1));
console.error('\nwrote rit.json, '+Object.keys(out.profiles).length+' profiles, '
 +(fs.statSync(path.resolve(__dirname,'rit.json')).size/1024).toFixed(1)+' kB');
Object.values(out.profiles).forEach(o=>console.error(
 '  '+o.nm.padEnd(8)+' seat '+o.seat.padEnd(7)
 +(o.substituted?o.actualTrack+'*':o.track).padEnd(9)+'t'+o.tier+'  '
 +o.called.nm.padEnd(24)+String(o.called.min).padStart(2)+'m'
 +'  record '+String(o.walk.length).padStart(2)+'d'
 +'  kept '+String(o.walkDone).padStart(2)
 +'  missed '+String(o.walkMissed).padStart(2)
 +'  improved '+(o.improved?(o.improved.diff>0?'+':'')+o.improved.diff+'d':'waiting')
 +'  weekday '+(o.weekdayReady?'read':'waiting')
 +'  queue '+String(o.queue.length).padStart(2)
 +'  weakest '+(o.weakL?o.weakL.nm:'none')
 +(STANCE4LAW[o.weakL&&o.weakL.nm]?' (stance)':'')));
