/* ============================================================
   THE DATA THE PROTOTYPES DRAW. Real, and from two real sources.

   The reading half comes out of engine.js: the seat, the track, the tier, the
   practice ritFor would call for, the ledger and the marks. ritFor lives in
   ui/ritual.js and is not exported, so it is reimplemented here from the same
   table and asserted against the measured output in PANEL-ritual-1000.md
   section A1. A tool that lies is worse than no tool.

   The history half comes out of losssim.js, which is tools/loopsim.js with the
   owner's loss framing arm added and all forty two of its checks still green.
   A profile in PEOPLE carries no ritual history at all, so a heat map drawn
   from the profiles alone is empty for every one of them. The simulator knows
   what each ICP actually does day by day, so the heat map is that walk rather
   than a decorative invention.
   ============================================================ */
const path=require('path'), fs=require('fs');
const E=require(path.resolve(__dirname,'../../engine.js'));
const {S,CHARGES,SINAMES,LAWSET,PEOPLE,buildSoul,compute,PRACTICE,ladderRead}=E;
/* ported from ui/personas.js loadP, minus everything that touches a document,
   and it is the same port tools/ritualsim.js already carries. compute() reads
   shared state rather than its argument, which is the impure core CLAUDE.md
   names, so a profile has to be loaded rather than passed. */
function loadPerson(p){
 S.dom=p.dom; S.a1=p.a1; S.a2=p.a2;
 S.doms=[p.dom]; S.arcs=[p.a1,p.a2]; S.roots=[];
 buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=(p.c&&p.c[c]!==undefined)?p.c[c]:0;
  S.replace[c]=(p.rep&&p.rep[c])||0;});
 const LS=LAWSET[p.nm]||{_:5.5};
 SINAMES.forEach(l=>{S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:5.5);});
 return compute();}
const SIM=require(path.resolve(__dirname,'losssim.js'));

const TRACK4BAND={Root:'Body',Sacral:'Somatic',Solar:'Somatic',Heart:'Body',
                  Throat:'Mind','3rd Eye':'Mind',Crown:'Energy'};
function ritFor(r){
 const band=r.darkB||'Root', track=TRACK4BAND[band]||'Body';
 const tier=r.DQ>=8?1:(r.DQ>=4?2:3);
 const fit=PRACTICE.filter(p=>p.tier<=tier);
 const first=fit.filter(p=>p.track===track);
 const lightest=set=>set.slice().sort((a,b)=>(a.min-b.min)||(a.tier-b.tier))[0];
 const called=first.length?lightest(first):lightest(fit);
 return {band,track,tier,called,substituted:!first.length,
  actualTrack:called?called.track:track,all:fit};}

const WHO=['Marcus','Gordon','Diane','Angela','Sofia','Derek','Rosa','James'];
const WT={Diane:180,Derek:170,Marcus:160,Angela:150,Sofia:140,James:100,Ana:50,Gordon:35,Rosa:15};

const out={};
WHO.forEach(nm=>{
 const P=PEOPLE.filter(p=>p.nm===nm)[0];
 if(!P)throw new Error('no person '+nm);
 const r=loadPerson(P);
 const prof=Object.assign({},P,{rituals:[],axes:S.axes,meter:S.meter,history:[]});
 const c=ritFor(r);
 const lad=ladderRead(prof,Date.UTC(2026,8,20));
 /* the day by day walk, from the simulator, at the design as costed */
 Object.keys(SIM.TRACE).forEach(k=>delete SIM.TRACE[k]);
 SIM.runSim('final',{trace:nm});
 const t=Object.assign({},SIM.TRACE);
 out[nm]={
  nm, age:P.age, role:P.role, weight:WT[nm]||0,
  says:P.says||'',
  CQ:+(+r.CQ).toFixed(1), DQ:+(+r.DQ).toFixed(2),
  seat:c.band, track:c.track, tier:c.tier, substituted:c.substituted,
  actualTrack:c.actualTrack,
  called:c.called?{k:c.called.k,nm:c.called.nm,min:c.called.min,track:c.called.track,
    d:c.called.d,tier:c.called.tier}:null,
  nFit:c.all.length,
  fit:c.all.map(p=>({k:p.k,nm:p.nm,min:p.min,track:p.track,tier:p.tier,d:p.d})),
  releasable:(t.meas&&t.meas.releasable)||0,
  ledger:lad.ledger, streak:lad.streak,
  earned:lad.earned.map(m=>m.nm), next:lad.next?lad.next.nm:null,
  /* the walk. 0 missed, 1 practised, 2 practised at the floor. */
  walk:t.days||[], walkDone:t.doneN||0, walkFloors:t.floors||0,
  walkStreak:t.streak||0, walkKarma:t.k||0, walkLive:!!t.live,
  /* how many of this ICP the panel sampled and how many were still there at
     the end, so the walk above is never read as the typical one. */
  sampled:t.n||0, survived:t.alive30||0};});

/* THE CHECK AGAINST THE PUBLISHED MEASUREMENT. PANEL-ritual-1000.md A1. */
const EXPECT={Marcus:['Throat','Mind',3,'Active Listening',10],
 Gordon:['Throat','Somatic',1,'The Signal Test',3],
 Angela:['Root','Body',3,'Box Breathing',5],
 Diane:['Solar','Somatic',3,'The Somatic Truth Check',2],
 Sofia:['Throat','Mind',3,'Active Listening',10],
 Derek:['Solar','Somatic',1,'The Signal Test',3],
 Rosa:['Root','Body',3,'Box Breathing',5]};
let bad=0;
Object.entries(EXPECT).forEach(([nm,[seat,tr,ti,pn,mn]])=>{
 const o=out[nm], got=o.substituted?o.actualTrack:o.track;
 const ok=o.seat===seat&&got===tr&&o.tier===ti&&o.called.nm===pn&&o.called.min===mn;
 if(!ok){bad++;console.error('MISMATCH '+nm+' got '+o.seat+'/'+got+'/'+o.tier+'/'+o.called.nm);}});
if(bad){console.error(bad+' mismatches against the published measurement. refusing to write.');process.exit(1);}
console.error('ritFor agrees with PANEL-ritual-1000.md A1 on all '+Object.keys(EXPECT).length+' checked profiles.');

fs.writeFileSync(path.resolve(__dirname,'data.json'),JSON.stringify(out,null,1));
console.error('wrote data.json, '+Object.keys(out).length+' profiles.');
Object.values(out).forEach(o=>console.error(
 '  '+o.nm.padEnd(8)+' seat '+o.seat.padEnd(8)+' '+(o.substituted?o.actualTrack+'*':o.track).padEnd(9)
 +'t'+o.tier+'  '+o.called.nm.padEnd(26)+o.called.min+'m  walk days '
 +String(o.walk.length).padStart(2)+'  practised '+String(o.walkDone).padStart(2)
+'  survived '+o.survived+' of '+o.sampled+'  releasable '+o.releasable));
