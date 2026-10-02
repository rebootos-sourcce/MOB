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

/* ---------------- fixtures shared by R2 to R4 ---------------- */
const {recipeFor,recipeSniff,recipeRunning,recipeBlockers,recipeIngredients,recipeReason,recipeToRitual,
       recipeRows,recipeCtx,RECIPE_CLAIM,RUN_MAX,RUN_MIN,TEACH_KEYS_ALL,validateProfile,blankProfile,
       loadProfile,compute,S,CHARGES,LAWSET,PEOPLE,buildSoul,W}=E;
const teachRowOf=k=>TEACH_ROWS.filter(r=>r.k===k)[0];
const entry=(t,text)=>({t:t,text:text,imprints:0,bands:{}});
const T0='2026-10-01T09:00:00.000Z', T1='2026-10-02T09:00:00.000Z', T2='2026-10-03T09:00:00.000Z';
const prof=(entries,name)=>{const p=blankProfile(name||'recipes'); p.story.entries=entries; return p;};
/* a roster person into the live field, the way tests/engine.js group 15 does */
const loadPerson=nm=>{const p=PEOPLE.find(x=>x.nm===nm);
 S.doms=[p.dom];S.arcs=[p.a1,p.a2];S.roots=[];buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=p.c[c]||0;S.replace[c]=(p.rep&&p.rep[c])||0;});
 const LS=LAWSET[nm]||{_:E.LAW_DEFAULT};
 SINAMES.forEach(l=>{S.law[l]=LS[l]!==undefined?LS[l]:LS._; E.LAW_UNSET[l]=false;});
 return compute();};
/* a context built by hand, which is how the engine stays testable headless:
   sq is the charge at each address by id, and anything not named reads 0 */
const ctxOf=(over,o)=>{o=o||{}; const sq={}; W.forEach(n=>{sq[n.i]=0;});
 Object.keys(over||{}).forEach(nm=>{const n=NODES.filter(x=>x.k===nm)[0]; sq[n.i]=over[nm];});
 return {unread:!!o.unread, DQ:o.DQ===undefined?50:o.DQ, pacing:o.pacing||2, sq:sq, seats:{}, heaviest:o.heaviest||null};};
const compute0=nm=>{loadPerson(nm); return compute();};
const cueWordsOk=s=>/^[a-z ]+$/.test(s);

g('R2 · the recipe: four ingredients, four behaviours of the inversion, and the cues that find them');
{
 const rows=recipeRows(), keys=TEACH_ROWS.map(r=>r.k);
 ok(rows.length===keys.length*2*TEACH_CH.length,'a pole has its quality and its inversion in each channel, '+rows.length+' rows');
 ok(rows.every(r=>r.cues.length>=3),'every behaviour has at least three cues to be found by');
 ok(rows.every(r=>r.cues.every(c=>cueWordsOk(c)&&c.length>=5)),'every cue is lowercase words after the sniffer’s own normaliser');
 /* NO PHRASE IN TWO BEHAVIOURS: a sentence that fired two recipes at once would
    read as the instrument finding it twice */
 const seen={}, dup=[]; rows.forEach(r=>r.cues.forEach(c=>{if(seen[c])dup.push(c+' in '+seen[c]+' and '+r.id); seen[c]=r.id;}));
 ok(dup.length===0,'no cue is in two behaviours, '+JSON.stringify(dup.slice(0,4)));
 /* the addresses each inversion behaviour sits at are the pole’s own marked five */
 const off=[]; rows.filter(r=>r.side==='neg').forEach(r=>{const marks=teachRowOf(r.k).marks;
  if(!r.addrs.length)off.push(r.id+' sits at no address');
  r.addrs.forEach(a=>{if(marks.indexOf(a)<0)off.push(r.id+' names '+a+', which is not marked for '+r.k);});});
 ok(off.length===0,'every behaviour of an inversion sits at addresses that opposite is marked at, '+JSON.stringify(off.slice(0,4)));
 ok(keys.every(k=>{const marks=teachRowOf(k).marks; const used=new Set(); rows.filter(r=>r.k===k&&r.side==='neg')
  .forEach(r=>r.addrs.forEach(a=>used.add(a))); return marks.some(m=>used.has(m));}),'and the inversions between them reach the marked addresses');
 keys.forEach(k=>{
  const R=recipeFor(k);
  ok(R&&R.ingredients.length===TEACH_CH.length&&R.inversion.length===TEACH_CH.length&&R.opposite&&R.who,
   k+' composes a recipe of four and four');
  ok(R.ingredients.every(x=>x.behaviour&&x.builds&&PRACTICE.some(p=>p.k===x.builds.step)&&BECOMING[k].indexOf(x.builds.step)>=0),
   k+': every ingredient is built by a step of the pole’s own ritual');
  ok(R.inversion.every(x=>x.addrs.length>0&&x.addrs.every(a=>a.id!==null)),k+': every inversion behaviour names addresses that resolve');});
 ok(recipeFor('ZZ')===null,'an unknown pole has no recipe');
 /* the channels are built by the right step: Do by the practice, Body by the
    breath, Think and Say by the lines */
 ok(recipeFor('PO').ingredients.map(x=>x.builds.step).join()==='samecut,aff_PO,box,aff_PO','Do is the practice, Think and Say the lines, Body the breath, for Musashi');
}

g('R2 · sniffing: the behaviour is found in the person’s own words, quoted, with its entry');
{
 const inv=[entry(T0,'Work was a lot. I made them cover for me again. Somebody will cover it, I said. Then I went home.')];
 const sn=recipeSniff(inv), po=sn.poles.filter(p=>p.k==='PO')[0];
 ok(po.running.map(b=>b.id).join()==='PO.neg.do,PO.neg.say'&&po.present.length===0,'the inversion’s behaviours are found and none of the quality, '+po.running.map(b=>b.id));
 ok(po.running.every(b=>b.hits===1&&b.evidence.length===1),'each sentence is quoted once');
 ok(po.running.every(b=>b.evidence.every(e=>e.entry===T0&&inv[0].text.indexOf(e.snippet)>=0)),'each carries the entry it came from, keyed by its time, and the sentence word for word');
 ok(sn.poles.filter(p=>p.k!=='PO'&&(p.running.length||p.present.length)).length===0,'no other pole fires on it');
 const good=recipeSniff([entry(T0,'I did my practice anyway. I missed today and wrote one line. That one is on me.')]);
 const pg=good.poles.filter(p=>p.k==='PO')[0];
 ok(pg.present.length>=2&&pg.running.length===0,'the quality’s ingredients are found and none of the inversion, '+pg.present.map(b=>b.id));
 const none=recipeSniff([entry(T0,'We had soup and went for a walk by the river. The light was low and the dog was happy.')]);
 ok(none.poles.every(p=>!p.present.length&&!p.running.length),'a day with neither shows neither');
 ok(recipeSniff([]).poles.every(p=>!p.present.length&&!p.running.length)&&recipeSniff(undefined).scanned===0&&recipeSniff(null).scanned===0,
  'an empty record, and no record at all, read as nothing and never throw');
 ok(recipeSniff([null,5,{text:7},{t:T0}]).scanned===0,'an entry that is not an entry is skipped and not trusted');
 /* NEGATION, the sniffer’s own rule, and a sentence end stops it */
 const neg=recipeSniff([entry(T0,'I was not irritated by him today. We spoke for an hour.')]);
 ok(neg.poles.filter(p=>p.k==='CH')[0].running.length===0,'a negated behaviour is not found');
 const cross=recipeSniff([entry(T0,'I was not there. Irritated by him all week.')]);
 ok(cross.poles.filter(p=>p.k==='CH')[0].running.length===1,'and a negator in the sentence before does not void the next one');
 /* LONGEST CUE WINS, so a long phrase is not also the shorter one inside it */
 const long=recipeSniff([entry(T0,'I told them one thing and told someone else another.')]);
 ok(long.poles.filter(p=>p.k==='OR')[0].running.length===1&&long.poles.filter(p=>p.k==='OR')[0].running[0].hits===1,'a long phrase is one hit');
 /* ids are the trace graph’s own: a time, and #n for the second at one instant */
 const two=recipeSniff([entry(T0,'I made them cover for me.'),entry(T0,'I made them stay late.')]);
 const ids=two.poles.filter(p=>p.k==='PO')[0].running.reduce((a,b)=>a.concat(b.entries),[]);
 ok(ids.indexOf(T0)>=0&&ids.indexOf(T0+'#1')>=0,'two entries at one instant are told apart as the graph tells them apart, '+ids);
 /* quoted evidence is capped and a cut is marked */
 const longText='I made them cover for me '+'and then '.repeat(60)+'went home.';
 const q=recipeSniff([entry(T0,longText)]).poles.filter(p=>p.k==='PO')[0].running[0].evidence[0].snippet;
 ok(q.length<=203&&/\.\.\.$/.test(q),'a long sentence is cut at a word and marked, never cut silently');
 ok(JSON.stringify(recipeSniff(inv))===JSON.stringify(recipeSniff(inv)),'two runs give one answer');
}

g('R2 · the owner’s journal entry shows the inversions it shows, and claims no cause');
{
 const ownerText='I had a really fucking rough day today. I had a confrontation with my boss. I was really irritated by him. He showed no remorse. I just wanted to walk out.';
 const p=prof([entry(T0,ownerText)],'owner');
 const run=recipeRunning(p.story.entries);
 ok(run.map(x=>x.k).sort().join()==='CH,PO','it surfaces the two recipes whose inversions it shows, aggression and blame: '+JSON.stringify(run));
 const ch=recipeBlockers(p,'CH'), po=recipeBlockers(p,'PO');
 ok(ch.length===2&&po.length===1,'with the behaviours found, '+ch.length+' and '+po.length);
 ok(ch.some(b=>/confrontation/.test(b.evidence[0].snippet))&&po[0].evidence[0].snippet==='He showed no remorse',
  'quoting his own sentences: '+ch.map(b=>b.evidence[0].snippet).concat(po[0].evidence[0].snippet).join(' | '));
 /* WITHOUT CLAIMING CAUSE. A reason says what the entries describe. */
 const all=ch.concat(po).map(b=>b.reason).concat([RECIPE_CLAIM]);
 ok(all.every(s=>!/\b(because|cause|causes|caused|due to|therefore|so that|result of|reason you)\b/i.test(s.replace(RECIPE_CLAIM,''))),
  'no reason says why: '+JSON.stringify(all.slice(0,3)));
 ok(/does not say why/.test(RECIPE_CLAIM),'and the claim it prints says it does not say why');
 ok(all.every(s=>s.indexOf('—')<0),'no em dash in a reason');
}

g('R2 · blockers: the one most in the way is first, and the order is not a score');
{
 /* the behaviour in more entries ranks before the one in fewer, with no address carrying */
 const e1=[entry(T0,'I made them cover for me.'),entry(T1,'I made them cover for me again.'),entry(T2,'I told myself I need to win.')];
 const b1=recipeBlockers(prof(e1),'PO',{ctx:ctxOf({})});
 ok(b1.length===2&&b1[0].id==='PO.neg.do'&&b1[0].entries===2&&b1[1].id==='PO.neg.think','more entries first, '+b1.map(b=>b.id+'x'+b.entries));
 /* a behaviour whose addresses are carrying outranks a more frequent one that is not */
 const hot=recipeBlockers(prof(e1),'PO',{ctx:ctxOf({'Need To Win':6.1})});
 ok(hot[0].id==='PO.neg.think'&&hot[0].carrying===1,'a pattern found in words and held in the body goes first, '+hot.map(b=>b.id));
 ok(hot[0].addrs.some(a=>a.k==='Need To Win'&&a.carrying&&a.sq===6.1&&a.seat),'with the address, its charge and its seat named');
 ok(/Need To Win/.test(hot[0].reason)&&/carrying/.test(hot[0].reason),'and the reason says which is carrying');
 /* eased: the quality shown in the same channel in a newer entry */
 const eased=recipeBlockers(prof([entry(T0,'I made them cover for me.'),entry(T1,'I paid for it myself this time.'),entry(T2,'I told myself I need to win.')]),'PO',{ctx:ctxOf({})});
 ok(eased.length===2&&eased[0].id==='PO.neg.think'&&eased[1].id==='PO.neg.do'&&eased[1].eased&&!eased[0].eased,
  'a behaviour the person has since done the other way in sorts after the ones they have not, '+eased.map(b=>b.id+(b.eased?'~':'')));
 ok(/newer entries also show the other way/.test(eased[1].reason),'and says so in plain words');
 /* the quality present and the inversion absent: nothing blocks */
 ok(recipeBlockers(prof([entry(T0,'I did my practice anyway.')]),'PO',{ctx:ctxOf({})}).length===0,'the quality alone has no blockers');
 ok(recipeBlockers(prof([]),'PO').length===0&&recipeBlockers(prof([]),'ZZ').length===0,'an empty profile and an unknown pole have none');
 /* the same facts in a different pole do not block this one */
 ok(recipeBlockers(prof(e1),'TU',{ctx:ctxOf({})}).length===0,'a behaviour that belongs to one pole does not block another');
 /* an unread field names no charge and does not claim carrying */
 const un=recipeBlockers(prof(e1),'PO',{ctx:ctxOf({},{unread:true})});
 ok(un.every(b=>b.carrying===0),'with nothing carrying, no reason says carrying');
 const nocx=recipeBlockers(prof(e1),'PO');
 ok(nocx.every(b=>b.addrs.every(a=>a.sq===null&&!a.carrying)),'and with no field handed in, an address reads unknown and never carrying');
 /* NO MATCH NUMBER, in anything returned */
 const dump=JSON.stringify([b1,hot,eased,recipeIngredients(prof([entry(T0,'I did my practice anyway.')]),'PO'),recipeSniff(e1)]);
 ok(!/"(score|match|fit|rank|percent|rating)"/i.test(dump)&&!/\d\s?%/.test(dump),'no key or value in any of it is a match number or a percent');
 ok(!/ of \d/.test(b1.map(b=>b.reason).join(' ')),'no reason is a count against a total');
}

g('R2 · the person’s own reading, and the roster’s own stories');
{
 loadProfile(blankProfile('blank')); const un=recipeCtx();
 ok(un.unread===true&&un.pacing===1,'a blank field reads unread and at pacing step one');
 loadPerson('Gordon'); const g0=recipeCtx(); loadPerson('Rosa'); const r0=recipeCtx();
 ok(g0.unread===false&&g0.pacing===E.pacingStep(compute0('Gordon').DQ),'a person is paced by their own load, '+g0.pacing);
 const paces=new Set(PEOPLE.map(pp=>{loadPerson(pp.nm); return recipeCtx().pacing;}));
 ok(paces.size>=2,'and the roster spans more than one pacing step, '+[...paces]);
 ok(TEACH_ROWS.every(r=>E.teachMarkIds(r.k).every(id=>typeof g0.sq[id]==='number')),'every marked address of every pole is one the field reads');
 /* the roster’s own stories: deterministic, no throw, no blocker without a quote */
 let blockers=0;
 PEOPLE.forEach(pp=>{
  if(!pp.says)return;
  const p=prof([entry(T0,pp.says)],pp.nm);
  const a=JSON.stringify(recipeSniff(p.story.entries)), b=JSON.stringify(recipeSniff(p.story.entries));
  ok(a===b,pp.nm+': two runs give one answer');
  TEACH_ROWS.forEach(r=>recipeBlockers(p,r.k,{ctx:g0}).forEach(x=>{blockers++;
   ok(x.evidence.length>0&&x.evidence.every(e=>e.snippet&&e.entry),pp.nm+' '+x.id+': every blocker carries a quoted sentence and an entry');}));});
 log('  the roster’s stories surface '+blockers+' blockers in all');
}

g('R4 · the ritual and the protocol: one plan, the library in his order, pacing a gate');
{
 const keys=TEACH_ROWS.map(r=>r.k);
 /* THE SHAPE ritStartPlan TAKES, and every step a practice the boundary accepts */
 keys.forEach(k=>{
  const R=recipeToRitual(prof([]),k,{ctx:ctxOf({},{pacing:3})}), b=becomingOf(k);
  ok(R&&R.plan.tc===k&&!!becomingOf(R.plan.tc)&&R.plan.days===7&&R.plan.steps.length===b.steps.length
   &&R.plan.steps.every(s=>PRACTICE.some(p=>p.k===s)),k+': a plan toward the pole, with every step in the library');
  ok(R.plan.band===''||BANDS.indexOf(R.plan.band)>=0,k+': the plan’s seat is a seat or none');});
 ok(recipeToRitual(prof([]),'ZZ')===null,'no plan toward a teacher nobody was issued');
 /* the seat: an axis at its axis, a home pole at its home, a path or Akhenaten where the load sits */
 ok(recipeToRitual(prof([]),'PE',{ctx:ctxOf({})}).plan.band==='3rd Eye','an axis is kept at its seat');
 ok(recipeToRitual(prof([]),'TU',{ctx:ctxOf({})}).plan.band==='Throat'&&recipeToRitual(prof([]),'NA',{ctx:ctxOf({})}).plan.band==='Crown','a pole with a home seat is kept there');
 ok(recipeToRitual(prof([]),'SA',{ctx:ctxOf({},{heaviest:'Solar'})}).plan.band==='Solar'&&recipeToRitual(prof([]),'SA',{ctx:ctxOf({},{heaviest:'Solar',unread:true})}).plan.band==='',
  'Akhenaten is kept where the load sits, and nowhere while nothing is read');
 /* PACING IS A GATE: across the roster of people and every pole, nothing above the pacing step is offered */
 const byK={}; PRACTICE.forEach(p=>{byK[p.k]=p;});
 let leaks=[], held=0, checked=0;
 PEOPLE.forEach(pp=>{loadPerson(pp.nm); const cx=recipeCtx(), r=compute();
  keys.forEach(k=>{const R=recipeToRitual(prof([]),k,{ctx:cx}); checked++;
   if(R.plan.steps.some(s=>byK[s].tier>cx.pacing))leaks.push(pp.nm+' '+k);
   if(!R.plan.steps.some(s=>/^aff_/.test(s)))leaks.push(pp.nm+' '+k+' has no lines step');
   if(cx.unread===false&&cx.pacing!==pacingStep(r.DQ))leaks.push(pp.nm+' pacing');
   held+=R.held.length;
   R.held.forEach(h=>{if(byK[h.step].tier<=cx.pacing)leaks.push(pp.nm+' '+k+' held a step it could have offered');});});});
 ok(leaks.length===0&&checked>0,'across '+checked+' person by pole readings, nothing above the pacing step is offered, '+JSON.stringify(leaks.slice(0,3)));
 ok(held>0,'and some steps are held, which the surface then says');
 ok(recipeToRitual(prof([]),'PE',{ctx:ctxOf({},{pacing:1})}).held.every(h=>/opens as the charge drops/.test(h.reason)),'a held step says it opens as the charge drops');
 /* unread is step one, the cautious side, which is where ritFor reads it as three on purpose */
 ok(recipeToRitual(prof([]),'PE',{ctx:ctxOf({},{unread:true,pacing:1})}).pacing===1,'nothing read is paced at step one');
 /* THE LIBRARY ORDER: saved rituals, then the shipped practices, then a release */
 const R1=recipeToRitual(prof([]),'PO',{ctx:ctxOf({})});
 ok(R1.order.join()==='saved,practice,release','the order is saved rituals, then shipped practices, then a release, '+R1.order);
 ok(R1.lanes[0].empty&&/none yet/.test(R1.lanes[0].empty),'no saved ritual says so, and starting one saves it');
 ok(R1.lanes[2].items.length===0&&/Nothing to release/.test(R1.lanes[2].empty)&&R1.protocol===null,'nothing carrying offers no release and says why');
 ok(/Nothing read yet/.test(recipeToRitual(prof([]),'PO',{ctx:ctxOf({},{unread:true})}).lanes[2].empty),'and an unread field says nothing is read, not that nothing carries');
 ok(R1.lanes[1].items.length===R1.plan.steps.length&&R1.lanes[1].items.every(x=>x.reason),'the shipped practices are the ritual’s steps, each with a reason');
 const saved=[{id:'a',steps:['box'],tc:null},{id:'b',steps:['box','aff_PO','samecut'],tc:'PO'},{id:'c',steps:['samecut'],tc:null},{id:'d',steps:['slow','resist'],tc:'CH'}];
 const R2=recipeToRitual(prof([]),'PO',{ctx:ctxOf({}),saved:saved});
 ok(R2.lanes[0].items.map(x=>x.id).join()==='c,b','saved rituals that fit come first, the closest first, and one for another teacher or with none of its steps is left out, '+R2.lanes[0].items.map(x=>x.id));
 ok(R2.lanes[0].items.every(x=>/^Written for Musashi/.test(x.reason)),'each says why');
 /* THE RELEASE: addresses carrying, the heaviest charge, never more than a run holds */
 const most=Math.floor(RUN_MAX/RUN_MIN);
 const R3=recipeToRitual(prof([]),'PO',{ctx:ctxOf({'Competition':5.4,'Entitlement':4.7,'Need To Win':2.8,'Superiority':2.8,'Force':2.3})});
 ok(R3.protocol&&R3.protocol.names.length>=1&&R3.protocol.names.every(n=>['Competition','Entitlement'].indexOf(n)>=0),'the release is over addresses carrying, and only those, '+(R3.protocol&&R3.protocol.names));
 ok(R3.protocol.addrs.length<=most&&R3.protocol.addrs.every(id=>E.teachMarkIds('PO').indexOf(id)>=0),'all of them marked for the pole and within what a run holds');
 ok(/carrying, so a release is offered/.test(R3.lanes[2].reason),'and the lane says why in words, '+R3.lanes[2].reason);
 ok(R3.protocol.charge&&R3.protocol.seat,'with the charge and the seat of the release named');
 const R5=recipeToRitual(prof([]),'CH',{ctx:ctxOf({'Fear':4.1,'Panic':4.2,'Anger':9,'Collapse':4.3,'Lethargy':4.0})});
 const chg=n=>NODES.filter(x=>x.k===n)[0].cf;
 ok(R5.protocol&&R5.protocol.addrs.every(id=>NODES.filter(x=>x.i===id)[0].cf===R5.protocol.charge),'a release is one charge, the heaviest group among those carrying, '+R5.protocol.charge);
 const vals={Fear:4.1,Panic:4.2,Anger:9,Collapse:4.3,Lethargy:4.0}, sumBy={};
 Object.keys(vals).forEach(n=>{sumBy[chg(n)]=(sumBy[chg(n)]||0)+vals[n];});
 const top=Object.keys(sumBy).sort((a,b)=>sumBy[b]-sumBy[a]||(a<b?-1:1))[0];
 ok(R5.protocol.charge===top,'and it is the heaviest, '+R5.protocol.charge+' against '+top);
 const wide=ctxOf({}); E.teachMarkIds('CH').forEach(id=>{wide.sq[id]=5;});
 ok(recipeToRitual(prof([]),'CH',{ctx:wide}).protocol.addrs.length<=most,'a wide release is capped at what one run holds');
 ok(R3.protocol.rest>=0&&R3.protocol.addrs.length+R3.protocol.rest>=R3.protocol.names.length,'and says how many are left over');
 /* the same inputs, the same plan */
 const c3=()=>ctxOf({'Competition':5.4,'Entitlement':4.7,'Need To Win':2.8,'Superiority':2.8,'Force':2.3});
 ok(JSON.stringify(recipeToRitual(prof([]),'PO',{ctx:c3()}))===JSON.stringify(recipeToRitual(prof([]),'PO',{ctx:c3()})),'two runs give one plan');
 ok(!/"(score|match|fit|rank|percent|rating)"/i.test(JSON.stringify([R1,R2,R3,R5])),'and no match number is in any of it');
}

g('R3 · the stored block: additive, validated, refused by name and never clamped');
{
 const {teachBlank,teachValidate,teachFocusAdd,teachFocusRemove,teachMarkToggle,teachShareSet,teachGrantAdd,teachRunAdd,teachShareOut,
        teachReach,teachDays,teachReleased,teachGrantsDue,teachLineOf,teachForm,teachLevel,TEACH_HOLD_PREFIX,TEACH_SCORE,PR_NEVER,
        TEACH_FOCUS_MAX,TEACH_RUNS_CAP,TEACH_V,LEAD_SEES,LEAD_HIDDEN}=E;
 const refuse=(o,msg,why)=>{const errs=[]; teachValidate(errs,o,'teach'); ok(errs.indexOf(msg)>=0,why+', got '+JSON.stringify(errs));};
 const NOW='2026-10-02T09:14:00.000Z';
 const good=()=>({v:1,focus:[{k:'TU',at:NOW,mine:['neg.think'],share:{on:false,at:null}}],opened:[{k:'TU',r:1,at:NOW}],runs:[{t:NOW,tc:'TU',kind:'ritual',n:3}]});
 {const errs=[]; const b=teachValidate(errs,teachBlank(),'teach');
  ok(errs.length===0&&JSON.stringify(b)===JSON.stringify(teachBlank()),'the blank block validates to itself');}
 {const errs=[]; const b=teachValidate(errs,good(),'teach'); ok(errs.length===0&&b.focus.length===1,'a full block validates');
  const e2=[]; const b2=teachValidate(e2,b,'teach');
  ok(e2.length===0&&JSON.stringify(b2)===JSON.stringify(b),'and validate of validate is the same block, which is the round trip that once lost a profile at boot');}
 refuse([],'teach is not an object','a list');
 refuse(7,'teach is not an object','a number');
 refuse({v:2},'teach.v 2 is newer than this build reads ('+TEACH_V+')','a newer version');
 refuse({v:0},'teach.v is not a version','version 0');
 refuse({v:'1'},'teach.v is not a version','a version in quotes');
 PR_NEVER.forEach(k=>{const o={}; o[k]='x'; refuse(o,'teach may not carry '+k,'a forbidden key '+k);});
 TEACH_SCORE.forEach(k=>{const o={}; o[k]=0.7; refuse(o,'teach may not carry '+k,'a stored match number named '+k);});
 refuse({note:'x'},'teach may not carry note','any key nobody declared');
 {const f=good().focus[0]; refuse({focus:[0,1,2,3].map(i=>Object.assign({},f,{k:['IL','RE','DE','OR'][i]}))},
   'teach.focus holds 4, which is more than '+TEACH_FOCUS_MAX,'four pinned');}
 refuse({focus:[good().focus[0],good().focus[0]]},'teach.focus repeats TU','a repeated pole');
 refuse({focus:[Object.assign({},good().focus[0],{k:'ZZ'})]},'teach.focus[0].k names no teacher: ZZ','an unknown pole');
 refuse({focus:[Object.assign({},good().focus[0],{mine:['pos.fly']})]},'teach.focus[0].mine[0] names no impression: pos.fly','a mark outside the closed set');
 refuse({focus:[Object.assign({},good().focus[0],{mine:['neg.think','neg.think']})]},'teach.focus[0].mine repeats neg.think','a repeated mark');
 refuse({focus:[Object.assign({},good().focus[0],{share:{on:'yes',at:null}})]},'teach.focus[0].share.on is not true or false','a share switch that is not a boolean');
 refuse({focus:[Object.assign({},good().focus[0],{share:{on:true,at:null}})]},'teach.focus[0].share.on is true and has no date','a switch that is on and cannot say since when');
 refuse({focus:[Object.assign({},good().focus[0],{share:{on:false,at:null,note:'x'}})]},'teach.focus[0].share may not carry note','a key in share that is not on or at');
 refuse({focus:[Object.assign({},good().focus[0],{at:'not a date'})]},'teach.focus[0].at is not a date','a pin with no date');
 refuse({opened:[{k:'TU',r:4,at:NOW}]},'teach.opened[0].r is out of range: 4','reach four');
 refuse({opened:[{k:'TU',r:0,at:NOW}]},'teach.opened[0].r is out of range: 0','reach zero');
 refuse({opened:[{k:'TU',r:2.5,at:NOW}]},'teach.opened[0].r is out of range: 2.5','a half reach');
 refuse({opened:[{k:'TU',r:2,at:NOW},{k:'TU',r:2,at:NOW}]},'teach.opened repeats TU reach 2','a reach opened twice');
 refuse({runs:new Array(TEACH_RUNS_CAP+1).fill({t:NOW,tc:'TU',kind:'ritual',n:1})},'teach.runs holds '+(TEACH_RUNS_CAP+1)+', which is more than '+TEACH_RUNS_CAP,'a run log over the cap, refused and not cut');
 refuse({runs:[{t:NOW,tc:'TU',kind:'ritul',n:1}]},'teach.runs[0].kind is not a kind of run: ritul','a bad kind');
 refuse({runs:[{t:'x',tc:'TU',kind:'ritual',n:1}]},'teach.runs[0].t is not a date','a bad date');
 refuse({runs:[{t:NOW,tc:'TU',kind:'ritual',n:9999}]},'teach.runs[0].n is out of range: 9999','9999, which is refused and never read as a 25');
 refuse({runs:[{t:NOW,tc:'TU',kind:'ritual',n:2.5}]},'teach.runs[0].n is out of range: 2.5','a fractional count');
 /* a retired key still validates, so a record that names it still loads */
 TEACH_KEYS_ALL.push('ZQ');
 {const errs=[]; teachValidate(errs,{focus:[{k:'ZQ',at:NOW}]},'teach'); ok(errs.length===0,'a retired teacher’s key still validates');}
 TEACH_KEYS_ALL.pop();
 /* THROUGH THE PROFILE BOUNDARY: additive, named at the top level, atomic */
 {const bp=blankProfile('t'); ok(JSON.stringify(bp.teach)===JSON.stringify(teachBlank()),'a new profile carries the blank block');
  const old=JSON.parse(JSON.stringify(bp)); delete old.teach; const v=validateProfile(old);
  ok(v.ok&&JSON.stringify(v.profile.teach)===JSON.stringify(teachBlank()),'a record with no teach block loads and reads as never worked toward');
  const withT=JSON.parse(JSON.stringify(bp)); withT.teach=good(); const v2=validateProfile(withT);
  ok(v2.ok&&v2.profile.teach.focus[0].k==='TU','a record with one keeps it through the boundary');
  const v3=validateProfile(JSON.parse(JSON.stringify(v2.profile)));
  ok(v3.ok&&JSON.stringify(v3.profile.teach)===JSON.stringify(v2.profile.teach)&&JSON.stringify(v3.profile)===JSON.stringify(v2.profile),
   'the whole profile validates to itself twice, so export then import then export is byte equal');
  const bad=JSON.parse(JSON.stringify(bp)); bad.teach={focus:[],runs:[{t:NOW,tc:'TU',kind:'ritual',n:9999}]};
  const v4=validateProfile(bad); ok(!v4.ok&&v4.errs.indexOf('teach.runs[0].n is out of range: 9999')>=0,'a bad block refuses the whole record, by name');
  const nul=JSON.parse(JSON.stringify(bp)); nul.teach=null; ok(validateProfile(nul).ok,'a null block is an older record and keeps the blank');
  const lp=JSON.parse(JSON.stringify(bp)); lp.teach=[]; loadProfile(lp); ok(!Array.isArray(lp.teach)&&lp.teach.v===TEACH_V,'and loadProfile fills a block that is not an object');}
 /* THE WRITERS go through the boundary, so a surface cannot write what it would then refuse */
 {let t=teachBlank(); let r=teachFocusAdd(t,'TU',NOW); ok(r.ok&&r.teach.focus[0].share.on===false,'choosing a teacher pins it with sharing off');
  t=r.teach; ok(teachFocusAdd(t,'TU',NOW).ok&&teachFocusAdd(t,'TU',NOW).teach.focus.length===1,'and choosing again is the same pin');
  r=teachMarkToggle(t,'TU','neg.think'); ok(r.ok&&r.teach.focus[0].mine.join()==='neg.think','a mark is an id from the closed set');
  ok(teachMarkToggle(r.teach,'TU','neg.think').teach.focus[0].mine.length===0,'and pressing it again takes it off');
  ok(!teachMarkToggle(t,'TU','pos.fly').ok&&!teachMarkToggle(teachBlank(),'TU','neg.think').ok,'an id outside the set, or a teacher not chosen, is refused');
  const full=['IL','RE','DE'].reduce((a,k)=>teachFocusAdd(a,k,NOW).teach,teachBlank());
  ok(!teachFocusAdd(full,'OR',NOW).ok&&/Unpin one/.test(teachFocusAdd(full,'OR',NOW).why),'a fourth pin is refused and says what to do');
  r=teachShareSet(t,'TU',true,NOW); ok(r.ok&&r.teach.focus[0].share.on&&r.teach.focus[0].share.at===NOW,'turning sharing on writes the date');
  ok(!teachFocusRemove(r.teach,'TU').ok,'a shared teacher is not unpinned from under the consent');
  const off=teachShareSet(r.teach,'TU',false,'2026-10-05T00:00:00.000Z');
  ok(off.ok&&!off.teach.focus[0].share.on&&off.teach.focus[0].share.at==='2026-10-05T00:00:00.000Z','a revoke keeps its date, so the person can see off since');
  ok(teachFocusRemove(off.teach,'TU').teach.focus.length===0,'and then it can be unpinned');
  ok(!teachShareSet(teachBlank(),'TU',true,NOW).ok,'sharing a teacher nobody chose is refused');
  const gr=teachGrantAdd(teachBlank(),'TU',2,NOW); ok(gr.ok&&teachGrantAdd(gr.teach,'TU',2,NOW).teach.opened.length===1,'a reach is granted once');
  ok(!teachGrantAdd(teachBlank(),'TU',9,NOW).ok,'a reach that does not exist is refused');
  ok(teachRunAdd(teachBlank(),'TU','ritual',3,NOW).ok&&!teachRunAdd(teachBlank(),'TU','ritual',9999,NOW).ok,'a run is a count, and 9999 is refused');
  const orig=JSON.stringify(t); teachShareSet(t,'TU',true,NOW); ok(JSON.stringify(t)===orig,'no writer mutates what it was handed');}
 /* ---------------- reaches, derived from what a person did ---------------- */
 const dayAt=n=>new Date(Date.UTC(2026,8,1+n,12)).toISOString();
 const ritual=(n,steps,done)=>{const x={t:dayAt(n),track:'Mind',band:'Throat',steps:steps,min:5,when:'',where:''}; if(done!==undefined)x.done=done; return x;};
 {const own=E.teachOwnSteps('TU');
  ok(own.slice().sort().join()==='aff_TU,plainword','a teacher’s own steps are the ones written for it, not the shared breath, '+own);
  const p=blankProfile('d'); p.teach=teachBlank();
  /* the 21.J2 case: a day a ritual was SET and never done is not a day done */
  p.rituals=[ritual(0,['truth','aff_TU','plainword'],false),ritual(1,['truth','aff_TU','plainword']),ritual(2,['box'],true),ritual(3,['truth','aff_TU','plainword'],true),ritual(3,['plainword'],true),ritual(4,['aff_TU'],true)];
  ok(teachDays(p,'TU')===2,'days done count only days a ritual of the teacher’s own was DONE: not set, not an older entry with no done key, not a shared step, and one day once, got '+teachDays(p,'TU'));
  ok(teachDays(p,'PO')===0&&teachDays(blankProfile('x'),'TU')===0&&teachDays(null,'TU')===0,'another teacher’s days, a blank record and no record are none');
  const rel=blankProfile('r'); const ids=E.teachMarkIds('TU');
  rel.meter.unique=[ids[0]+':believe:0',ids[0]+':feel:3',ids[1]+':act:1','5:believe:0'];
  ok(teachReleased(rel,'TU')===2&&teachReleased(rel,'PO')===0,'released counts distinct addresses of the opposite in the meter’s own keys');
  const q=(days,chosen,released,granted)=>{const x=blankProfile('q'); x.teach=teachBlank(); if(chosen)x.teach.focus=[{k:'TU',at:NOW,mine:[],share:{on:false,at:null}}];
   x.rituals=[]; for(let i=0;i<days;i++)x.rituals.push(ritual(i,['aff_TU'],true));
   if(released)x.meter.unique=[ids[0]+':believe:0']; if(granted)x.teach.opened=[{k:'TU',r:granted,at:NOW}]; return x;};
  ok(teachReach(q(0,false,false),'TU').open===0&&teachReach(q(0,false,false),'TU').next.nm==='Say it','nothing chosen opens nothing, and the next is named');
  ok(teachReach(q(0,true,false),'TU').open===1,'choosing the teacher opens Say it');
  ok(teachReach(q(4,true,false),'TU').open===1&&teachReach(q(5,true,false),'TU').open===2,'five different days open Walk it, and four do not');
  ok(teachReach(q(14,true,false),'TU').open===2&&teachReach(q(14,true,true),'TU').open===3,'fourteen days and one address released open Hold it, and fourteen alone do not');
  ok(teachReach(q(28,true,false),'TU').open===3,'twenty eight days open it with nothing spent: every reach has a way in that costs nothing');
  ok(teachReach(q(30,false,false),'TU').open===0,'a reach never opens past one that is shut');
  const gone=q(0,true,false,2); ok(teachReach(gone,'TU').open===2,'a reach once granted stays open when the days that earned it are gone');
  ok(teachGrantsDue(q(5,true,false),'TU').join()==='1,2'&&teachGrantsDue(gone,'TU').join()==='1','the grants due are the reaches earned and not yet held, '+teachGrantsDue(q(5,true,false),'TU'));
  const nx=teachReach(q(2,true,false),'TU').next;
  ok(nx.nm==='Walk it'&&/different days/.test(nx.say)&&/done on 2 different days/.test(nx.say)&&!/ of \d/.test(nx.say),'the next reach says what it takes and what has been done, in words and with no total, '+nx.say);
  ok(teachReach(q(14,true,true),'TU').next===null,'and when the last is open nothing is named');
  ok(!/\b(timer|expires|days left|hurry)\b/i.test(JSON.stringify(E.TEACH_UNLOCK)+nx.say),'no timer and no urgency');
  const ln=(open,day)=>teachLineOf('TU',open,day);
  ok(ln(0,5)===null,'with nothing open there is no line');
  ok(ln(1,0).r===1&&ln(1,0).line!==ln(1,1).line&&ln(1,0).line===ln(1,2).line,'one open reach gives its two lines in turn, by the day');
  ok([0,1,2,3,4,5].every(d=>ln(3,d).r<=3)&&ln(3,0).line===ln(3,6).line,'three open reaches rotate over six and repeat');
  ok(ln(1,-1).line&&ln(1,1.9).line===ln(1,1).line,'a day number before the epoch or fractional still reads');
  ok(ln(1,0).past&&ln(1,0).past!==ln(1,0).line,'and each line carries the belief it goes past');
  ok(teachForm({unread:true,EX:90})==='hold'&&teachForm(null)==='hold','an unread field, or none, is hold form');
  ok(teachForm({unread:false,EX:5})==='hold'&&teachForm({unread:false,EX:95})==='say','a low expression reads hold form and a high one reads the stated form');
  ok(teachLevel({EX:5})<=E.TEACH_HOLD_LEVEL&&teachLevel({EX:95})>E.TEACH_HOLD_LEVEL&&teachLevel(null)===null,'the level is read off the tier table');
  ok(/^Hold this against the body and read it\./.test(TEACH_HOLD_PREFIX)&&/Do not say it as a fact/.test(TEACH_HOLD_PREFIX),'the hold form says what to do and what not to');
  loadPerson('Gordon'); const gf=teachForm(compute()); loadPerson('Wren'); const rf=teachForm(compute());
  ok(gf==='hold'&&rf==='say','the collapsed person is shown hold form and the clear one the stated line');
  loadPerson('Rosa'); ok(teachForm(compute())==='hold','and a person with nothing read is shown hold form whatever the arithmetic says');
 }
 /* ---------------- sharing: off by default, one function out, no number ---------------- */
 {let t=teachBlank(); t=teachFocusAdd(t,'TU',NOW).teach; t=teachFocusAdd(t,'PO',NOW).teach; t=teachShareSet(t,'TU',true,NOW).teach;
  const p=blankProfile('s'); p.teach=t;
  ok(teachShareOut(p).length===0&&teachShareOut(p,{}).length===0&&teachShareOut(p,{linked:false}).length===0,'nothing leaves until a lead is linked, which nothing can do before accounts');
  const out=teachShareOut(p,{linked:true});
  ok(out.length===1&&out[0].k==='TU'&&JSON.stringify(Object.keys(out[0]).sort())==='["k","r"]','only the teacher that is switched on leaves, and only its key and the reach');
  ok(JSON.stringify(teachShareOut(blankProfile('x'),{linked:true}))==='[]'&&teachShareOut(null,{linked:true}).length===0,'a blank record shares nothing');
  p.teach=teachShareSet(t,'TU',false,NOW).teach; ok(teachShareOut(p,{linked:true}).length===0,'revoked, it leaves nothing');
  const imp=blankProfile('i'); imp.teach={focus:[{k:'TU',at:NOW,mine:[],share:{on:true,at:NOW}}]};
  const v=validateProfile(JSON.parse(JSON.stringify(imp))); ok(v.ok&&teachShareOut(v.profile,{linked:false}).length===0,'an imported record that says shared is inert until a lead is linked');
  ok(LEAD_SEES.indexOf('the teachers, when shared')>=0&&LEAD_HIDDEN.indexOf('the spiritual material')>=0,'the lead’s list names the one exception and the rest of the spiritual material stays hidden');
  ok(E.OB_NEVER.indexOf('teach')>=0&&E.obValidate({kind:'question',at:NOW,body:'x',teach:{}}).ok===false,'and the outbox refuses the block by name');}
 /* NO MATCH NUMBER IN ANYTHING THIS SLICE STORES, RETURNS OR SHARES */
 {const t=teachFocusAdd(teachBlank(),'TU',NOW).teach; const p=blankProfile('n'); p.teach=t;
  const dump=JSON.stringify([t,teachReach(p,'TU'),teachShareOut(p,{linked:true}),TEACH_ROWS,E.teachRoster()]);
  ok(!/"(score|match|fit|rank|percent|rating)"/i.test(dump),'no stored, returned or shared object carries a match number');}
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
