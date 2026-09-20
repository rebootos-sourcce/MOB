/* ============================================================
   THE CALENDAR'S DATA. Every number real, and every gate stated.

   This is build-data.js carried forward for the calendar. It keeps that file's
   reading and walk, and it adds the three things the calendar needs that the
   board did not: the kind each ritual belongs to, the seat loads the always on
   kind is aimed at, and the queue's proposals.

   NOTHING HERE IS INVENTED. Every proposal carries `src`, the name of the
   engine.js export it came out of, and GATE 4 refuses to write if any `src` is
   not a real export. A proposal with no source is a decoration.

   FOUR GATES, and the second one is the interesting one.

   GATE 1  the ported ritFor agrees with PANEL-ritual-1000.md section 3.1 on
           CQ, DQ, seat, track, tier and releasable, for all nine profiles.
   GATE 2  it DISAGREES with that table's practice and minutes columns on
           seven of the nine, and the gate asserts the disagreement is exactly
           the one ui/ritual.js documents: the pick rule changed from first in
           the table to lightest in the track. The gate reproduces the panel's
           column by running the OLD rule. If the old rule does not reproduce
           it, the disagreement is something else and this file refuses to
           write rather than picking a side quietly.
   GATE 3  the practice column agrees with DESIGN-ritual.md section 1.2, which
           is the current measurement, on all seven profiles it lists.
   GATE 4  every queue proposal names a real engine.js export as its source.

   build-data.js cites "PANEL-ritual-1000.md section A1". There is no section
   A1 in that file. Its numbers are right and its citation is not, and this
   file cites section 3.1, which exists.
   ============================================================ */
const path=require('path'), fs=require('fs');
const E=require(path.resolve(__dirname,'../../engine.js'));
const {S,CHARGES,SINAMES,LAWSET,PEOPLE,buildSoul,compute,PRACTICE,ladderRead,
       SPEC_POLE,sniffStory,avatarBlank,avatarValid}=E;

/* the same port of ui/personas.js loadP that build-data.js carries. compute()
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

/* the lightest practice on the track that moves a given seat, at the tier the
   reading allows. Same rule as ritFor, aimed at a seat the reading did not
   pick, which is what the avatar and the weak law need. */
function forSeat(seat,tier){
 const track=TRACK4BAND[seat]||'Body';
 const fit=PRACTICE.filter(p=>p.tier<=tier);
 const on=fit.filter(p=>p.track===track);
 const c=on.length?lightest(on):lightest(fit);
 return c?{k:c.k,nm:c.nm,min:c.min,track:c.track,tier:c.tier,
           substituted:!on.length,wanted:track}:null;}

const SIM=require(path.resolve(__dirname,'losssim.js'));
const TODAY=Date.UTC(2026,8,20);           /* Sunday 20 September 2026 */
const WHO=['Marcus','Gordon','Diane','Angela','Sofia','Derek','Rosa','James'];
const WT={Diane:180,Derek:170,Marcus:160,Angela:150,Sofia:140,James:100,
          Ana:50,Gordon:35,Rosa:15};

/* ---------- THE THREE KINDS ----------
   Closed at three, and the argument is in DESIGN-calendar.md. Each one names
   the engine function its proposals come out of, because a kind that cannot
   say where its work comes from is a label rather than a category. The colour
   is not new: MARKS already carries three families, each family already sits
   at a band, and PAL already gives that band a colour. */
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

const out={profiles:{}, kinds:KIND, today:TODAY, pal:E.PAL,
           practiceN:PRACTICE.length, lawN:SINAMES.length};

WHO.forEach(nm=>{
 const P=PEOPLE.filter(p=>p.nm===nm)[0];
 if(!P)throw new Error('no person '+nm);
 const r=loadPerson(P);
 const c=ritFor(r);
 const prof=Object.assign({},P,{rituals:[],axes:S.axes,meter:S.meter,history:[]});
 const lad=ladderRead(prof,TODAY);

 /* the day by day walk, from the simulator, at the design as costed */
 Object.keys(SIM.TRACE).forEach(k=>delete SIM.TRACE[k]);
 SIM.runSim('final',{trace:nm});
 const t=Object.assign({},SIM.TRACE);

 /* seat loads, summed off the live imprints. This is what the avatar's own
    gap function measures: avatarGap calls a seat clear when its load is zero,
    so the seat carrying most is what is standing between the avatar and
    manifest. */
 const seatLoad={};
 r.carrying.forEach(x=>{seatLoad[x.b]=(seatLoad[x.b]||0)+x.held;});
 const seats=Object.entries(seatLoad).map(([b,v])=>({b,load:+v.toFixed(2),
   n:r.carrying.filter(x=>x.b===b).length}))
  .sort((a,b)=>b.load-a.load);

 /* the releasable addresses, at the sq >= 4 threshold ui/personas.js:418
    builds the release queue at. Same rule PANEL 3.1 counts with. */
 const rel=r.carrying.filter(x=>x.sq>=4)
  .sort((a,b)=>b.sq-a.sq).slice(0,3)
  .map(x=>({addr:x.n, fetter:x.k, seat:x.b, axis:x.c, sq:+x.sq.toFixed(2),
            replacement:(SPEC_POLE[x.c]||{}).pole||null}));

 /* what the sniffer actually gets out of this person's own words. Measured,
    not assumed: TASKS.md 0j records that thirteen of fourteen persona voices
    return nothing, and this is that same measurement taken here. */
 const sn=sniffStory(P.says||'');
 const snOffer=sn.offer.map(o=>({addr:o.address, axis:o.axis,
   replacement:o.replacement, shadow:o.shadow}));

 /* the avatar. No profile in PEOPLE carries one, so avatarBlank is what the
    engine has for all eight, and the avatar's first proposal is therefore to
    be built. That is not a placeholder, it is what is missing. */
 const av=avatarBlank();

 out.profiles[nm]={
  nm, age:P.age, role:P.role, weight:WT[nm]||0, says:P.says||'',
  CQ:+(+r.CQ).toFixed(1), DQ:+(+r.DQ).toFixed(2),
  seat:c.band, track:c.track, tier:c.tier, substituted:c.substituted,
  actualTrack:c.actualTrack,
  called:c.called?{k:c.called.k,nm:c.called.nm,min:c.called.min,
    track:c.called.track,tier:c.called.tier}:null,
  fit:c.all.map(p=>({k:p.k,nm:p.nm,min:p.min,track:p.track,tier:p.tier})),
  seats, carryingN:r.carrying.length,
  releasableN:r.carrying.filter(x=>x.sq>=4).length, rel,
  weakL:r.weakL||null,
  snOffer, snImprints:(sn.parsed&&sn.parsed.imprints||[]).length,
  avatarBuilt:!!av.built, avatarPairs:(av.pairs||[]).length,
  ledger:lad.ledger, streak:lad.streak,
  earned:lad.earned.map(m=>m.nm), next:lad.next?lad.next.nm:null,
  walk:t.days||[], walkDone:t.doneN||0, walkStreak:t.streak||0,
  sampled:t.n||0, survived:t.alive30||0};});

/* ============================================================
   THE QUEUE. Three proposers, one order.

   Ordered and not listed: the order is the load each proposal is aimed at,
   heaviest first, and the person's optimise choice lifts one kind to the top
   without hiding the other two. Every row carries the engine export it came
   from so GATE 4 can check it.
   ============================================================ */
function queueFor(o){
 const q=[];

 /* AVATAR, into the always on kind. avatarBlank says nothing is built, so
    what is missing for the avatar to progress is the avatar. That is the
    first row and it is not a practice. */
 if(!o.avatarBuilt)
  q.push({kind:'hold', by:'avatar', src:'avatarBlank', weight:1e6,
   nm:'Build the avatar', min:null, unit:'once',
   because:'Nothing is written on either side yet, so there is no gap to close '
    +'and nothing to hold a daily ritual to.'});

 /* AVATAR, into the always on kind, off the seat carrying most. avatarGap
    calls a seat clear when its load is zero, so this is the distance the
    avatar has left to travel, read at an address rather than guessed. */
 o.seats.slice(0,2).forEach((s,i)=>{
  const p=forSeat(s.b,o.tier); if(!p)return;
  q.push({kind:'hold', by:'avatar', src:'avatarGap', weight:s.load,
   nm:p.nm, min:p.min, track:p.track, seat:s.b, unit:'a day',
   because:'Your '+s.b.toLowerCase()+' carries '+s.n+' live imprints, more than '
    +(i===0?'any other seat':'all but one')+'. The '+p.wanted.toLowerCase()
    +' track is what moves a '+s.b.toLowerCase()+'.'});});

 /* THE WEAK LAW, into the behaviour kind. compute().weakL is the lowest of the
    twenty one, and it arrives already seated at a band with its own icon. */
 if(o.weakL){
  const p=forSeat(o.weakL.b,o.tier);
  if(p)q.push({kind:'change', by:'you', src:'weakL', weight:500,
   nm:p.nm, min:p.min, track:p.track, seat:o.weakL.b, law:o.weakL.nm,
   unit:'a day',
   because:o.weakL.nm.toLowerCase()+' is the weakest of your twenty one laws. '
    +'It seats at the '+o.weakL.b.toLowerCase()+', and the '+p.wanted.toLowerCase()
    +' track is what moves a '+o.weakL.b.toLowerCase()+'.'});}

 /* THE SNIFFER, into the release kind. sniffStory on the person's own words.
    Where it returns an offer the address is named. Where it returns nothing
    the lane says so and says why, because a sniffer that cannot read is a
    measured defect and not a quiet blank. */
 o.snOffer.forEach(of=>{
  q.push({kind:'release', by:'sniffer', src:'sniffStory', weight:400+of.shadow,
   nm:'The Observer Technique', min:20, track:'Somatic',
   addr:of.addr, axis:of.axis, replacement:of.replacement, unit:'when called',
   because:'Your own words carry '+of.axis.toLowerCase()+' at '+of.addr
    +'. The far pole there is '+of.replacement+'.'});});

 /* THE FIELD, into the release kind, where the story gave nothing. The
    addresses at or above the release threshold, heaviest first. */
 o.rel.forEach(a=>{
  q.push({kind:'release', by:'you', src:'carrying', weight:200+a.sq,
   nm:'The Observer Technique', min:20, track:'Somatic',
   addr:a.addr, axis:a.axis, replacement:a.replacement, fetter:a.fetter,
   unit:'when called',
   because:a.fetter+' is held at '+a.addr+', above the line release opens at. '
    +'The far pole there is '+a.replacement+'.'});});

 q.sort((a,b)=>b.weight-a.weight);
 return q.map((x,i)=>Object.assign({i},x));}

Object.values(out.profiles).forEach(o=>{o.queue=queueFor(o);});

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
 /* GATE 2. Where the practice column disagrees, the old rule must reproduce
    it exactly. If it does not, the disagreement is a new defect. */
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
stale.forEach(s=>console.error('          '+s));

/* GATE 3. DESIGN-ritual.md section 1.2, which is the current measurement. */
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

/* GATE 4. Every proposal names a real engine export. */
console.error('GATE 4  every queue row names a real engine.js export');
let rows=0, srcs={};
Object.values(out.profiles).forEach(o=>o.queue.forEach(q=>{
 rows++; srcs[q.src]=(srcs[q.src]||0)+1;
 const ok=(typeof E[q.src]==='function')||(q.src in E);
 if(!ok)fail('queue row cites '+q.src+', which engine.js does not export');
 if(!q.because)fail('queue row with no because: '+q.nm);}));
console.error('        '+rows+' rows across '+WHO.length+' profiles, sources: '
 +Object.entries(srcs).map(([k,v])=>k+' '+v).join(', '));

if(bad){console.error('\n'+bad+' failures. refusing to write cal.json.');process.exit(1);}

fs.writeFileSync(path.resolve(__dirname,'cal.json'),JSON.stringify(out,null,1));
console.error('\nwrote cal.json, '+Object.keys(out.profiles).length+' profiles, '
 +(fs.statSync(path.resolve(__dirname,'cal.json')).size/1024).toFixed(1)+' kB');
Object.values(out.profiles).forEach(o=>console.error(
 '  '+o.nm.padEnd(8)+' seat '+o.seat.padEnd(7)
 +(o.substituted?o.actualTrack+'*':o.track).padEnd(9)+'t'+o.tier+'  '
 +o.called.nm.padEnd(24)+String(o.called.min).padStart(2)+'m'
 +'  walk '+String(o.walk.length).padStart(2)
 +'  imprints '+String(o.carryingN).padStart(3)
 +'  releasable '+String(o.releasableN).padStart(3)
 +'  sniffer offers '+o.snOffer.length
 +'  queue '+String(o.queue.length).padStart(2)
 +'  weakest law '+(o.weakL?o.weakL.nm:'none')));
