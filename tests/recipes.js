/* The recipe engine and the teachers' data, round PD. Run from tests/engine.js,
   which hands it its own ok() and group printer, or alone:

     node tests/recipes.js

   Asserts the CONTRACT and never today's numbers. Counts are read off the
   tables, because this repository has been bitten a dozen times by a count
   somebody typed into a gate and the product then grew past.

   Four slices, each its own group, in the order they were built:
     R1  the roster and the data
     R2  the recipe engine
     R3  the stored block and its boundary (what the panel writes)
     R4  the ritual and protocol tie, the part that is pure enough to test here */
module.exports=function(E,ok,g,log){
log=log||console.log;
const {MIRROR,PATHS,POLES_EXTRA,MASTERS,PRACTICE,BECOMING,becomingOf,becomingSteps,
       TEACH_ROWS,TEACH_ORDER,TEACH_CH,TEACH_IMP_IDS,TEACH_REACH,TEACH_UNLOCK,TEACH_W,
       teachPole,teachRoster,teachMarkIds,pacingStep,SINAMES,NODES,BANDS,TEACHER_PRACTICE}=E;
const words=s=>String(s).trim().split(/\s+/).length;
const strings=(x,out)=>{out=out||[];
 if(typeof x==='string')out.push(x);
 else if(Array.isArray(x))x.forEach(y=>strings(y,out));
 else if(x&&typeof x==='object')Object.keys(x).forEach(k=>strings(x[k],out));
 return out;};

g('R1 · the roster: fourteen poles, thirteen people, Jesus at two');
{
 const keys=TEACH_ROWS.map(r=>r.k);
 ok(new Set(keys).size===keys.length,'every pole key is unique');
 ok(JSON.stringify(TEACH_ORDER.slice().sort())===JSON.stringify(keys.slice().sort()),
  'TEACH_ORDER is a permutation of the keys, so display order is its own list');
 const roster=teachRoster();
 const poles=roster.reduce((a,t)=>a+t.poles.length,0);
 ok(poles===keys.length,'every pole is in exactly one roster entry, '+poles+' poles for '+roster.length+' people');
 ok(roster.length===new Set(keys.map(k=>teachPole(k).who)).size,'the roster has one entry a person');
 const jesus=roster.filter(t=>t.who==='Jesus')[0];
 ok(jesus&&jesus.poles.length===2,'Jesus stands at two poles and is one entry');
 ok(roster.filter(t=>t.poles.length>1).length===1,'and nobody else does');
 ok(roster.length===keys.length-1,'so the people are the poles less the one name that stands twice');
 /* THE KEYS THAT WERE ISSUED BEFORE THIS ROUND ARE STILL THERE, and mean the
    same thing. A key is identity: a ritual plan, a record and BECOMING all
    name a pole by it, and a renamed key is a ritual that stops loading. */
 const old=['IL','DE','OR','PO','PE','TR','CH','RE','FL','AL','HO'];
 ok(old.every(k=>keys.indexOf(k)>=0),'every key issued before round PD still stands');
 ok(JSON.stringify(MIRROR.map(m=>m.k).sort())===JSON.stringify(['CH','DE','IL','OR','PE','PO','RE','TR']),
  'the eight axes keep their eight keys');
 ok(PATHS.length===5&&new Set(PATHS.map(p=>p.k)).size===5,'the five paths are still five');
 const added=POLES_EXTRA.map(p=>p.k);
 ok(added.every(k=>keys.indexOf(k)>=0)&&added.every(k=>old.indexOf(k)<0),
  'and the new poles are new keys, appended: '+added.join(', '));
 /* every pole resolves from its tables, copying no sentence */
 const thin=keys.filter(k=>{const p=teachPole(k);
  return !p||!p.who||!p.d||!p.opp.nm||!p.opp.d||!p.ic||!p.opp.ic||!p.ask;});
 ok(thin.length===0,'every pole composes with a teacher, an opposite, a codex line, an ask and both marks, thin: '+thin.join(', '));
 ok(teachPole('ZZ')===null,'an unknown key is null and not a guess');
 /* the masters are the roster (also pinned in group 21) */
 ok(roster.every(t=>MASTERS.some(m=>m.nm===t.who)),'every teacher is on the masters list');
 /* his words for the Heart, round PD */
 ok(teachPole('IL').q==='Love'&&teachPole('TR').q==='Beauty','the Heart axes are Love and Beauty');
 ok(teachPole('SA').q==='light'&&teachPole('TU').q==='truth'&&teachPole('NA').q==='nature',
  'and Light, Truth and Nature are Akhenaten, Zoroaster and Confucius');
 ok(teachPole('AL').word==='Duty'&&teachPole('TR').word==='Beauty','Duty is Rama and Beauty is Rumi, the recommended reading of the doubled name');
 /* a pole is an axis, a path or neither, and only the ones in PATHS are paths */
 ok(keys.every(k=>{const p=teachPole(k);
  return p.kind==='axis'?!!p.seat:(p.kind==='path'?PATHS.some(x=>x.k===k)&&!p.seat:POLES_EXTRA.some(x=>x.k===k));}),
  'a pole is an axis with a seat, one of the five paths, or neither, and never two of those');
 ok(keys.filter(k=>teachPole(k).kind==='path').length===3,'three of the five paths stand on no axis, the other two are Jesus and Buddha at theirs');
}

g('R1 · the data: every address and law resolves, every line is a behaviour');
{
 const names=NODES.map(n=>n.k);
 const bad=[], dup=[];
 TEACH_ROWS.forEach(r=>{r.marks.forEach(nm=>{const n=names.filter(x=>x===nm).length;
  if(n!==1)(n?dup:bad).push(r.k+':'+nm);});});
 ok(bad.length===0,'every marked address resolves to one of the 112, missing '+JSON.stringify(bad));
 ok(dup.length===0,'and to exactly one, ambiguous '+JSON.stringify(dup));
 ok(TEACH_ROWS.every(r=>teachMarkIds(r.k).length===r.marks.length),'teachMarkIds returns one id a mark');
 ok(TEACH_ROWS.every(r=>new Set(r.marks).size===r.marks.length),'and no pole marks an address twice');
 const nolaw=[]; TEACH_ROWS.forEach(r=>r.laws.forEach(l=>{if(SINAMES.indexOf(l)<0)nolaw.push(r.k+':'+l);}));
 ok(nolaw.length===0,'every law a pole is read through is one of the 21, '+JSON.stringify(nolaw));
 /* the eight impressions, four channels and two states */
 const hole=[]; TEACH_ROWS.forEach(r=>['pos','neg'].forEach(s=>TEACH_CH.forEach(c=>{
  const t=r.imp&&r.imp[s]&&r.imp[s][c]; if(typeof t!=='string'||t.length<10)hole.push(r.k+'.'+s+'.'+c);})));
 ok(hole.length===0,'every pole has all eight impression lines, holes '+JSON.stringify(hole));
 ok(TEACH_IMP_IDS.length===2*TEACH_CH.length&&TEACH_IMP_IDS.every(id=>{const b=id.split('.');
  return (b[0]==='pos'||b[0]==='neg')&&TEACH_CH.indexOf(b[1])>=0;}),
  'the closed set of mark ids is the two states by the four channels');
 /* an impression is a plain event addressed to the person, never a trait */
 const second=[]; TEACH_ROWS.forEach(r=>['pos','neg'].forEach(s=>TEACH_CH.forEach(c=>{
  if(!/^(You|Your|The|Heat|Cold)\b/.test(r.imp[s][c]))second.push(r.k+'.'+s+'.'+c);})));
 ok(second.length===0,'impressions are written to the person, in the second person, '+JSON.stringify(second.slice(0,4)));
 /* lines: six a pole, two a reach, each with a belief it goes past */
 const wrongN=TEACH_ROWS.filter(r=>r.lines.length!==TEACH_REACH.length*2||
  TEACH_REACH.some(x=>r.lines.filter(l=>l.r===x.r).length!==2)).map(r=>r.k);
 ok(wrongN.length===0,'every pole has two lines in each reach, wrong '+JSON.stringify(wrongN));
 const generic=[];
 TEACH_ROWS.forEach(r=>r.lines.forEach((l,i)=>{
  const id=r.k+'#'+i;
  if(!l.past||l.past.length<12)generic.push(id+' has no belief it goes past');
  if(/\bI am\b|\bI’m\b|\bI'm\b/.test(l.line))generic.push(id+' says I am');
  if(!/^I\b|^When\b|^On\b/.test(l.line))generic.push(id+' is not first person');
  if(words(l.line)>=25)generic.push(id+' is '+words(l.line)+' words');
  const v=(/^I (\w+)/.exec(l.line)||[])[1];
  if(['feel','believe','know','trust','allow','choose','deserve','accept','am'].indexOf(v)>=0)
   generic.push(id+' opens on '+v+', which a camera cannot film');}));
 ok(generic.length===0,'every line is a behaviour sentence with a belief it goes past: '+JSON.stringify(generic.slice(0,5)));
 /* THE SWAP CHECK. A limit breaking line is wrong on any other teacher, so two
    poles' lines must not share their content words. The proxy the design named,
    run across every pair, with the measured ceiling stated. */
 const STOP=new Set('i the a an and or of to in on at it is was my me for with that this when then than not no but as be by from i’m'.split(' '));
 const bag=r=>{const s=new Set(); r.lines.forEach(l=>l.line.toLowerCase().replace(/[^a-z ]/g,' ').split(/\s+/)
  .forEach(w=>{if(w.length>3&&!STOP.has(w))s.add(w);})); return s;};
 let worst=0, worstPair='';
 for(let i=0;i<TEACH_ROWS.length;i++)for(let j=i+1;j<TEACH_ROWS.length;j++){
  const a=bag(TEACH_ROWS[i]), b=bag(TEACH_ROWS[j]); let n=0; a.forEach(w=>{if(b.has(w))n++;});
  const o=n/Math.min(a.size,b.size); if(o>worst){worst=o;worstPair=TEACH_ROWS[i].k+'/'+TEACH_ROWS[j].k;}}
 ok(worst<=0.35,'no two poles’ lines share more than a third of their content words, worst '+worst.toFixed(2)+' at '+worstPair);
 const all=strings(TEACH_ROWS).concat(strings(POLES_EXTRA.map(p=>[p.upd,p.dn,p.dnd,p.ask])));
 ok(all.every(s=>s.indexOf('—')<0&&s.indexOf('–')<0),'no em dash or en dash in any string');
 ok(!all.some(s=>/\b108\b/.test(s)),'and nobody says 108');
}

g('R1 · the ritual of each pole: the lines step, the practice, pacing');
{
 const keys=TEACH_ROWS.map(r=>r.k), byK={}; PRACTICE.forEach(p=>{byK[p.k]=p;});
 ok(keys.every(k=>becomingOf(k)&&becomingOf(k).steps.length>=2),'every pole has a ritual of at least two steps');
 ok(keys.every(k=>BECOMING[k].every(s=>byK[s])),'every step names a practice in the library');
 ok(keys.every(k=>{const a=byK['aff_'+k]; return a&&a.tc===k&&a.aff===k&&a.tier===1&&BECOMING[k].indexOf('aff_'+k)>=0;}),
  'every pole has a lines step, tagged to it, at pacing step one, and in its own ritual');
 ok(PRACTICE.filter(p=>p.tc).length===TEACHER_PRACTICE.length,'and every tagged practice is in the teacher table');
 /* the order is the loop: ground, say the line, do the practice */
 ok(keys.every(k=>{const s=BECOMING[k]; return s[1]==='aff_'+k&&s.length===3;}),'the lines step sits between the breath and the practice');
 /* a heavy field is handed nothing it was not handed before: the one new step is
    pacing step one, and the library a seat calls from is the untagged rows */
 ok(keys.every(k=>becomingSteps(k,1).steps.every(s=>byK[s].tier===1)),'at the heaviest load nothing above step one starts, lines step included');
 ok(PRACTICE.filter(p=>!p.tc).every(p=>!/^aff_/.test(p.k)),'the lines steps are tagged, so ritFor never calls one');
 /* a seatless pole with a home seat is not a path */
 ok(!becomingOf('TU').path&&becomingOf('TU').home==='Throat'&&becomingOf('TU').seat===null,'Zoroaster is kept at the throat and is not a path');
 ok(!becomingOf('NA').path&&becomingOf('NA').home==='Crown','Confucius is kept at the crown and is not a path');
 ok(!becomingOf('SA').path&&becomingOf('SA').home===null&&becomingOf('SA').extra===true,'Akhenaten has no seat and is not a path');
 ok(becomingOf('FL').path&&becomingOf('AL').path&&becomingOf('HO').path,'the three paths on no axis are still paths');
 ok(becomingOf('BO').k==='IL'&&becomingOf('AW').k==='PE','and the two path aliases still read their axes');
 /* the pacing rule the surface and the engine share */
 ok(pacingStep(100)===1&&pacingStep(70)===1&&pacingStep(69.99)===2&&pacingStep(40)===2&&pacingStep(39.99)===3&&pacingStep(0)===3,
  'pacingStep cuts at 70 and 40');
 ok(E.TRACK4BAND&&BANDS.every(b=>E.TRACK4BAND[b]),'every seat calls for a track, from the engine and not a renderer');
}

g('R1 · the weights and the unlocks');
{
 const sum=TEACH_W.authored+TEACH_W.seat+TEACH_W.cover;
 ok(Math.abs(sum-1)<1e-9,'the alignment’s weights sum to one, '+sum);
 ok(TEACH_REACH.map(x=>x.r).join()==='1,2,3'&&TEACH_UNLOCK.map(u=>u.r).join()==='1,2,3','three reaches, in order');
 const CONDS=['chosen','days','released'];
 ok(TEACH_UNLOCK.every(u=>u.any.every(way=>way.every(c=>CONDS.indexOf(c.c)>=0))),
  'every condition is from the closed vocabulary of things a person did, and none reads a reading of them');
 ok(TEACH_UNLOCK.every(u=>u.any.some(way=>way.every(c=>c.c!=='released'))),
  'every reach has a way in that spends nothing, because releasing opens ground and ground costs patterns');
 ok(TEACH_REACH.every(x=>/^[A-Z][a-z]+ it$/.test(x.nm)),'the reaches are named for what a person does');
 ok(!TEACH_REACH.some(x=>/tier/i.test(x.nm)),'and none is called a tier, which already names the plan');
}
};

if(require.main===module){
 const E=require(require('path').resolve(process.env.ENGINE||'engine.js'));
 let P=0,F=0;
 const ok=(c,m)=>{if(c)P++;else{F++;console.log('  FAIL  '+m);}};
 const g=n=>console.log('\n'+n);
 module.exports(E,ok,g,console.log);
 console.log('\n===== '+P+' passed, '+F+' failed =====');
 process.exit(F?1:0);}
