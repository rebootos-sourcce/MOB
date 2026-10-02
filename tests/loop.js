/* The loop read gate, engine/loop.js. Run from tests/engine.js, which hands
   it its own ok() and group printer, or alone:

     node tests/loop.js

   loopRead is the one read of the trace graph a screen asks, so what this
   holds is what the person is told: which patterns are confirmed and which
   are unanswered, the steps that connect each one to what was done about
   it, what was declined and why, and the one Next.

   THE SUITE RUNS TWICE OVER, the way tests/trace.js does. Once against the
   real engine, the known good case, checked first. Then against reads that
   are broken on purpose in the ways a read like this goes wrong, and each
   must FAIL at least one check. A gate that passes a broken read is a tool
   that lies. */
const path=require('path');
const J=x=>JSON.stringify(x);
const T1='2026-09-20T08:00:00.000Z', T2='2026-09-21T08:00:00.000Z';
const T0='2026-09-25T08:00:00.000Z', TL='2026-10-02T08:00:00.000Z';

/* the worked record. Angela's own sentence, which the fallback places at
   four heart addresses, and a second entry whose words name Shame. Lines
   opened at one of the fallback addresses down both kinds of channel. The
   boundary is passed, so it is a record the app could hold. */
function base(E){
 const A=E.PEOPLE.find(p=>p.nm==='Angela'), p=E.blankProfile('Angela');
 p.soul={doms:[A.dom],arcs:[A.a1,A.a2],roots:[]};
 p.story.entries=[
  {t:T1,text:A.says,imprints:4,bands:{}},
  {t:T2,text:'I feel ashamed and my chest is tight when I speak up at work.',imprints:3,bands:{}}];
 p.meter.unique=['53:Llimit:0','53:Llimit:1','53:Rlimit:0','53:Ltruth:0'];
 return p;}
function valid(E,p){const v=E.validateProfile(JSON.parse(J(p))); return v.ok?v.profile:null;}

/* the same record with practice on it, written through the one door. A
   practice the person accepted for the named address, run once with one
   piece of evidence, and due three times since without being marked. A
   second practice, proposed for a fallback address, that the person turned
   down. And the person's own yes to one fallback address, held in p.trace
   as the graph holds it: the inferred story edge, confirmed. */
function full(E){
 const p=base(E);
 let P=E.practiceBlank();
 const go=(a,b,t)=>{const r=E.practiceDo(P,a,b,t||T0); if(!r.ok)throw new Error(a+': '+r.errs.join(' | ')); P=r.P;};
 const sys={system:'loop-test',model_version:'0'};
 go('protocol_add',{id:'p1',class:'release',target_patterns:['addr:46'],steps:[{type:'release',instruction:'Release the shame'}],generated_by:sys});
 go('protocol_accept',{id:'p1'});
 go('protocol_add',{id:'p2',class:'release',target_patterns:['addr:54'],steps:[{type:'release',instruction:'Release the martyr'}],generated_by:sys});
 go('protocol_reject',{id:'p2'});
 go('ritual_create',{id:'r1',protocol_id:'p1',title:'Shame at the solar seat',tags:['Solar']});
 go('event_schedule',{id:'pe1',ritual_id:'r1',scheduled_at:T0});
 go('event_move',{id:'pe1',to:'available'}); go('event_move',{id:'pe1',to:'started'});
 go('event_move',{id:'pe1',to:'completed',duration_seconds:600,quality:{presence:7,effort:6}});
 go('evidence_record',{id:'e1',source:'user',type:'behavioral',dimension:'effect',metric:'times I spoke up',
  before:0,after:2,unit:'times',pattern_id:'addr:46',practice_event_id:'pe1'});
 ['pe2','pe3','pe4'].forEach((id,i)=>{
  go('event_schedule',{id:id,ritual_id:'r1',scheduled_at:new Date(Date.parse(T0)+(i+1)*86400000).toISOString()});
  go('event_move',{id:id,to:'missed'},TL);});
 /* one more scheduled and not yet due: scheduled is not practice */
 go('event_schedule',{id:'pe5',ritual_id:'r1',scheduled_at:TL});
 p.practice=P;
 /* and one line opened at the named address, so nothing named is left unworked */
 p.meter.unique=p.meter.unique.concat(['46:Llimit:0']);
 p.trace={v:1,nodes:[{type:'story',id:T1,src:'known'},{type:'pattern',id:'55',src:'known'}],
  edges:[{from:'story:'+T1,to:'pattern:55',edge:'supports',src:'user_confirmed',was:'inferred'}]};
 return p;}

function suite(R,E,ok,g){
 const row=(L,id)=>L.patterns.find(x=>x.id===id)||null;

 g('LR1 · a record with nothing on it reads as nothing');
 const L0=R(E.blankProfile('nobody'));
 ok(L0&&L0.empty===true,'a blank record is empty');
 ok(L0&&L0.patterns.length===0&&L0.confirmed===0&&L0.unanswered===0,'and lists no pattern');
 ok(L0&&L0.next===null,'and offers no Next it cannot point at');
 const Ln=R(null);
 ok(Ln&&Ln.empty===true&&Ln.patterns.length===0,'no record at all reads as nothing, and does not throw');

 g('LR2 · what was written, read as unanswered, words ahead of fallback');
 const pb=valid(E,base(E));
 ok(!!pb,'the worked record passes the boundary');
 const L=R(pb);
 ok(L.entries===2,'two entries on the record, got '+L.entries);
 ok(L.confirmed===0&&L.unanswered===L.patterns.length&&L.patterns.length>0,
  'with nothing answered, every pattern is unanswered: '+L.confirmed+' confirmed of '+L.patterns.length);
 const r46=row(L,'46'), r53=row(L,'53');
 ok(r46&&r46.named===true,'the address the words named is marked from the words');
 ok(r53&&r53.named===false,'an address the fallback chose is not');
 const firstFallback=L.patterns.findIndex(x=>!x.named), lastNamed=L.patterns.map(x=>x.named).lastIndexOf(true);
 ok(lastNamed<firstFallback,'every pattern the words named comes before every pattern the fallback chose');
 ok(r53&&r53.lines===3&&r53.truths===1,'the lines opened at 53 are counted by channel kind: 3 release, 1 truth, got '
  +(r53&&r53.lines)+' and '+(r53&&r53.truths));
 ok(r53&&r53.state==='unanswered','opening lines at an address is practice and does not confirm the pattern');
 ok(r53&&r53.stories===2,'53 is read in both entries, got '+(r53&&r53.stories));
 ok(L.next&&L.next.address===46&&L.next.kind==='release','the one Next is the named address with nothing opened, got '+J(L.next));
 ok(L.patterns.every(x=>!(x.named&&x.address!==null&&!x.lines&&!x.truths))||L.next!==null,'a named unworked address always yields a Next');
 ok(L.declined.length===0&&L.misses.length===0,'nothing declined and nothing missed on a record with no practice');

 g('LR3 · confirmed, and by whom');
 const pf=valid(E,full(E));
 ok(!!pf,'the record with practice passes the boundary');
 const F=R(pf);
 const f46=row(F,'46'), f55=row(F,'55'), f54=row(F,'54');
 ok(f55&&f55.state==='confirmed'&&f55.by==='story','the person\'s own yes to 55 confirms it, from the story');
 ok(f46&&f46.state==='confirmed'&&f46.by==='protocol','accepting a practice for 46 confirms it, by the practice');
 ok(f54&&f54.state==='unanswered','a practice turned down confirms nothing');
 ok(F.next===null,'with a line opened at the one named address there is no Next left, got '+J(F.next));
 ok(F.confirmed===2,'two confirmed, got '+F.confirmed);
 const firstUn=F.patterns.findIndex(x=>x.state!=='confirmed'), lastC=F.patterns.map(x=>x.state==='confirmed').lastIndexOf(true);
 ok(lastC<firstUn,'every confirmed pattern comes before every unanswered one');

 g('LR4 · the why chain, from what was written to what was done');
 ok(f46&&J(f46.protocols)===J(['p1']),'46 carries the practice aimed at it, got '+J(f46&&f46.protocols));
 ok(f46&&f46.rituals===1,'and the ritual that runs it');
 ok(f46&&f46.practised===1,'and one practice: the completed one, not the scheduled or the missed, got '+(f46&&f46.practised));
 ok(f46&&f46.evFor===1&&f46.evAgainst===0,'and its evidence, one for and none against');
 ok(F.practice.events===1,'practice history counts what happened, got '+F.practice.events);
 ok(f54&&f54.protocols.length===0,'a declined practice is not in the chain of the pattern it was for');

 g('LR5 · declined, and why when a reason was recorded');
 ok(F.declined.length===1&&F.declined[0].id==='p2','the declined practice is listed, got '+J(F.declined));
 ok(F.declined[0]&&J(F.declined[0].patterns)===J(['Martyrdom']),'by the name of the pattern it was for');
 ok(F.declined[0]&&F.declined[0].why===null,'protocol_reject records no reason, so the reason is null and nothing invents one');

 g('LR6 · misses, as practiceMissRead counts them');
 ok(F.misses.length===1&&F.misses[0].run===3,'three due and not marked, in a row, got '+J(F.misses));
 ok(F.misses[0]&&F.misses[0].stage===E.practiceMissRead(pf.practice,'r1').stage,'the stage is practiceMissRead\'s own word');

 g('LR7 · one record, one answer, and the record is not touched');
 const before=J(pf);
 const a=J(R(pf));
 const S0={doms:E.S.doms.slice(),arcs:E.S.arcs.slice(),roots:E.S.roots.slice()};
 const Q=E.PEOPLE.find(p=>p.nm==='Sofia');
 E.S.doms=[Q.dom]; E.S.arcs=[Q.a1,Q.a2]; E.S.roots=[];
 const b=J(R(pf));
 E.S.doms=S0.doms; E.S.arcs=S0.arcs; E.S.roots=S0.roots;
 ok(a===b,'the read does not move with whichever soul the engine has loaded');
 ok(J(pf)===before,'reading does not write the record');
 ok(!/"day|"days|"streak/i.test(a),'the read carries no day count and no streak');}

/* THE BROKEN READS. Each is the real read with one honest step taken out. */
function mutants(E){
 const R=E.loopRead;
 const re=L=>{L.confirmed=L.patterns.filter(x=>x.state==='confirmed').length;
  L.unanswered=L.patterns.length-L.confirmed; return L;};
 return [
  ['opening lines confirms a pattern',p=>{const L=R(p); L.patterns.forEach(x=>{if(x.lines||x.truths)x.state='confirmed';}); return re(L);}],
  ['the fallback is read as the words',p=>{const L=R(p); L.patterns.forEach(x=>{x.named=true;}); return L;}],
  ['the order is weight alone',p=>{const L=R(p); L.patterns.sort((a,b)=>b.weight-a.weight||(a.key<b.key?-1:1)); return L;}],
  ['a decline is dropped',p=>{const L=R(p); L.declined=[]; return L;}],
  ['a decline is given a reason nobody gave',p=>{const L=R(p); L.declined.forEach(d=>{d.why='it did not fit';}); return L;}],
  ['every scheduled practice is counted as done',p=>{const L=R(p);
   const n=((p&&p.practice&&p.practice.practice_events)||[]).length;
   L.patterns.forEach(x=>{if(x.protocols.length)x.practised=n;}); L.practice.events=Math.max(L.practice.events,n); return L;}],
  ['the Next is the heaviest pattern, worked or not',p=>{const L=R(p);
   const h=L.patterns.slice().sort((a,b)=>b.weight-a.weight)[0]; L.next=h?{kind:'release',key:h.key,address:h.address,name:h.name}:null; return L;}],
  ['the read follows whatever is loaded',p=>{
   if(!p)return R(p); const q=JSON.parse(J(p));
   q.soul={doms:E.S.doms.slice(),arcs:E.S.arcs.slice(),roots:E.S.roots.slice()}; return R(q);}],
  ['a declined practice stays in the chain',p=>{const L=R(p);
   L.declined.forEach(d=>{L.patterns.forEach(x=>{if(d.patterns.indexOf(x.name)>=0&&x.protocols.indexOf(d.id)<0)x.protocols.push(d.id);});}); return L;}]];}

function run(E,ok,g){
 let F0=0;
 const okReal=(c,m)=>{if(!c)F0++; ok(c,m);};
 suite(E.loopRead,E,okReal,g);
 g('LR8 · the gate bites: each broken read fails it');
 mutants(E).forEach(([nm,M])=>{
  let f=0;
  try{suite(M,E,c=>{if(!c)f++;},()=>{});}catch(e){f++;}
  ok(f>0,'a read where '+nm+' fails '+f+' check'+(f===1?'':'s'));});
 E.loadProfile(E.blankProfile('after the loop gate'));
 return F0;}

module.exports=run;
if(require.main===module){
 const E=require(path.resolve(process.env.ENGINE||'engine.js'));
 let P=0,F=0;
 const ok=(c,m)=>{if(c)P++; else{F++; console.log('  FAIL  '+m);}};
 run(E,ok,n=>console.log('\n'+n));
 console.log('\n===== '+P+' passed, '+F+' failed =====');
 process.exit(F?1:0);}
