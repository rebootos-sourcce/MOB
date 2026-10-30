/* The evidence ledger and the question check, P0 of the Journal Mode
   blueprint (atuned_source_ai_journal_mode_TDDB.md, 4 October). Round SK,
   30 October. Headless, against the built engine.js, run from the repo root.

   It holds the invariants the document's section 53 names, on real text:
   the person's own story bank lines (sim/stories.js), never sentences built
   from the lexicon. Every count printed is read off this run. */
const path=require('path');
const E=require(path.resolve(process.env.ENGINE||'engine.js'));
const {STORYBANK}=require(path.resolve('sim/stories.js'));
let P=0,F=0;
const g=n=>console.log('\n'+n);
const ok=(c,m)=>{if(c)P++;else{F++;console.log('  FAIL  '+m);}};
const {evLedger,evVerdict,evVerdictOk,evTraceSrc,evCan,srcVet,srcVetSay,srcChoose,srcFamilyCands,srcIntent,
 EV_STATES,EV_PERSON,EV_ENGINE,EV_NAMEABLE,EV_MOVES,SRC_FAMILY,parseStory,marksOf,srcHear,srcPrior}=E;
const LINES=[].concat(...Object.keys(STORYBANK).map(k=>STORYBANK[k].map(x=>x[1])));
const PAIRS=[];
Object.keys(STORYBANK).forEach(k=>{const l=STORYBANK[k].map(x=>x[1]);
 for(let i=0;i<l.length;i++)for(let j=0;j<l.length;j++)if(i!==j)PAIRS.push(l[i]+'\n'+l[j]);});
const CORPUS=LINES.concat(PAIRS);
const vet=(q,text,o)=>{o=o||{};const L=o.ledger||evLedger(text,o.entries||[],{verdicts:o.verdicts});
 return srcVet(Object.assign({q:q,family:'test'},o.cand||{}),{text:text,ledger:L,asked:o.asked,passed:o.passed});};
const fails=r=>r.fails.map(f=>f.n);

g('EV1 · the eight states are the document\'s, in its order, and who may set each is data');
ok(JSON.stringify(EV_STATES)===JSON.stringify(['observed','inferred','candidate','supported','confirmed','rejected','corrected','unknown']),
 'section 15\'s eight, got '+EV_STATES.join());
ok(EV_PERSON.concat(EV_ENGINE,['observed']).sort().join()===EV_STATES.slice().sort().join(),'every state is the engine\'s, the person\'s, or evidence only');
ok(EV_PERSON.every(s=>EV_ENGINE.indexOf(s)<0),'no state is both');
ok(Object.keys(EV_MOVES).every(f=>EV_MOVES[f].every(t=>EV_STATES.indexOf(t)>=0)),'every arrow lands on a state');
ok(EV_STATES.filter(s=>s!=='observed').every(s=>s==='inferred'||EV_MOVES[s].indexOf('rejected')>=0||s==='rejected'),
 'a no is honoured from every claim state, section 52 test 2');
ok(!evCan('supported','candidate')&&evCan('candidate','supported')&&evCan('confirmed','rejected'),'the arrows read as drawn');
ok(evTraceSrc('candidate')==='inferred'&&evTraceSrc('confirmed')==='user_confirmed'&&evTraceSrc('corrected')==='user_confirmed'
 &&evTraceSrc('rejected')===null&&E.TRACE_SRC.indexOf(evTraceSrc('supported'))>=0,'each state maps onto trace.js\'s own words, or to none');

g('EV2 · no silent promotion: with no verdict, nothing on the whole story bank reaches a person state');
{let claims=0, person=[];
 CORPUS.forEach(t=>{const L=evLedger(t,[],{});Object.values(L.claims).forEach(c=>{claims++;if(EV_PERSON.indexOf(c.state)>=0)person.push(c.seat+' '+c.state);});});
 ok(claims>0,'the bank is read at all, '+claims+' claims over '+CORPUS.length+' texts');
 ok(person.length===0,'and none of them is confirmed, rejected, corrected or unknown, got '+JSON.stringify(person.slice(0,5)));
 console.log('  read  '+claims+' claims over '+CORPUS.length+' texts');}

g('EV3 · one reader: a claim\'s count is srcHear\'s, and its spans are the marks at that seat');
{const off=[];
 CORPUS.forEach(t=>{const L=evLedger(t,[],{}), h=srcHear(t,null);
  h.seats.forEach(s=>{const c=L.claims[s.seat];
   if(!c||c.mentions!==s.mentions||c.rung!==s.rung)off.push(s.seat+' in '+JSON.stringify(t.slice(0,40)));});
  Object.values(L.claims).forEach(c=>{const spans=c.ev.map(id=>L.ev.find(x=>x.id===id)).filter(x=>x&&x.src==='mark');
   if(c.mentions>0&&spans.length<1)off.push(c.seat+' has no span in '+JSON.stringify(t.slice(0,40)));});});
 ok(off.length===0,'the ledger and srcHear agree on every seat of the bank, off: '+JSON.stringify(off.slice(0,4)));
 /* the measurement, printed and not asserted: marks and srcHear count by
    two paths, and where they differ the ledger keeps srcHear's count */
 let same=0, diff=0, elsewhere=[];
 CORPUS.forEach(t=>{const L=evLedger(t,[],{});Object.values(L.claims).forEach(c=>{if(!c.mentions)return;
  const n=c.ev.filter(id=>id[0]==='w').length; if(n===c.mentions)same++; else diff++;});
  L.ev.forEach(x=>{const w=x.text+' (mark '+x.seat+', counted '+x.seatSaid+')'; if(x.seatSaid&&elsewhere.indexOf(w)<0)elsewhere.push(w);});});
 /* printed, not asserted: a count of distinct words is not a floor, and the
    disagreement is the sniffer's to settle */
 console.log('  cited spans equal srcHear\'s mentions on '+same+' claims, differ on '+diff);
 console.log('  words the bubble and srcHear read at different seats: '+JSON.stringify(elsewhere));}

g('EV4 · evidence traceability and language fidelity: every span is the person\'s own letters');
{const bad=[];
 CORPUS.forEach(t=>{const L=evLedger(t,[],{});
  L.ev.forEach(x=>{if(x.s==null)return; if(t.slice(x.s,x.e)!==x.text||!x.text.trim())bad.push(JSON.stringify(x));});
  Object.values(L.claims).forEach(c=>{if(c.state!=='inferred'&&!c.ev.length)bad.push(c.seat+' cites nothing');
   if(!c.why)bad.push(c.seat+' says no why');});});
 ok(bad.length===0,'every evidence row slices back to the text and every claim cites evidence, off: '+bad.slice(0,3).join(' | '));
 const t='I keep avoiding things lately.', L=evLedger(t,[],{});
 const cue=L.ev.find(x=>x.src==='cue'&&x.kind==='behaviour');
 ok(cue&&cue.text==='I keep','a behaviour the sniffer has no seat for is still evidence, in the letters typed, got '+JSON.stringify(cue));
 ok(Object.keys(L.claims).length===0,'and a cue is never a claim about where anything lands');}

g('EV5 · privacy: an earlier entry gives its stored seat keys and never its text');
{const ents=[{t:'2026-10-01',text:'zebrafish quartermaster afraid',bands:{root:4}}];
 const L=evLedger('I felt afraid.',ents,{}), j=JSON.stringify(L);
 ok(j.indexOf('zebrafish')<0&&j.indexOf('quartermaster')<0,'nothing of the earlier text is in the ledger');
 ok(L.claims.root&&L.claims.root.earlier===1&&L.claims.root.state==='supported','the stored key still counts as evidence: once here and once before is supported');
 const only=evLedger('',ents,{});
 ok(only.claims.root&&only.claims.root.state==='inferred'&&only.thread===null,'an earlier seat with nothing said here is inferred, held, and is no thread');}

g('EV6 · the engine\'s three states, off srcHear\'s counts');
{const one=evLedger('I was furious at him.',[],{}).claims.solar;
 ok(one&&one.state==='candidate'&&!EV_NAMEABLE.includes(one.state),'heard once is a candidate, and not nameable, got '+(one&&one.state));
 const two=evLedger('I was furious at him. Still furious tonight.',[],{}).claims.solar;
 ok(two&&two.state==='supported'&&/2 times/.test(two.why),'heard twice is supported, and says so, '+(two&&two.why));
 const st=evLedger('I felt afraid',[],{active:{root:true}}).claims.root;
 ok(st&&st.state==='supported','one mention at a seat the field\'s driven pattern sits on is supported, his 27 October ruling kept');
 const neg=evLedger('I was not angry.',[],{});
 ok(!neg.claims.solar&&neg.ev.some(x=>x.said==='denied'),'a word said with a no is evidence of the no, and makes no claim');
 const oth=evLedger('My mother was furious.',[],{});
 ok(Object.keys(oth.claims).length===0&&oth.ev.some(x=>x.said==='other'),'a word about someone else is kept as that, and makes no claim');}

g('EV7 · the person\'s verdict is the only door, and it outranks new evidence');
{const t='I was furious at him. Still furious tonight.';
 let v=evVerdict([], 'solar','no');
 ok(v.ok&&v.verdicts.length===1,'a no is taken');
 const L=evLedger(t,[],{verdicts:v.verdicts});
 ok(L.claims.solar.state==='rejected'&&L.claims.solar.trace===null,'and the claim is rejected, with no trace provenance');
 const more=evLedger(t+' Furious again. So furious.',[],{verdicts:v.verdicts});
 ok(more.claims.solar.mentions>=4&&more.claims.solar.state==='rejected','four mentions later it is still rejected: correction dominance');
 ok(more.thread!=='solar','and it is no longer the thread');
 const r=srcVet({q:'You wrote “furious” twice. What did you do?',family:'behaviour',dim:'behaviour',target:'solar'},{text:t,ledger:L});
 ok(!r.ok&&fails(r).indexOf(10)>=0,'and a question about it is refused as already answered, point 10, got '+fails(r));
 v=evVerdict(v.verdicts,'solar','fix','it is tiredness, not anger');
 const fx=evLedger(t,[],{verdicts:v.verdicts}).claims.solar;
 ok(fx.state==='corrected'&&fx.verdict.fix==='it is tiredness, not anger'&&fx.trace==='user_confirmed','a correction is kept in the person\'s words, as their own claim');
 ok(!evVerdict([],'solar','fix','  ').ok&&/own words/.test(evVerdictOk({seat:'solar',v:'fix'}).why),'a correction with no words is refused by name');
 ok(!evVerdict([],'liver','yes').ok&&!evVerdict([],'solar','maybe').ok,'an unknown seat or answer is refused by name');
 const y=evLedger('I was furious at him.',[],{verdicts:evVerdict([],'solar','yes').verdicts}).claims.solar;
 ok(y.state==='confirmed'&&y.trace==='user_confirmed','a yes confirms even a candidate: the person is the authority');
 const u=evLedger(t,[],{verdicts:evVerdict([],'solar','unsure').verdicts}).claims.solar;
 ok(u.state==='unknown','not sure is unknown, and stays a valid result');
 const before=JSON.stringify(v.verdicts); evVerdict(v.verdicts,'solar','yes');
 ok(JSON.stringify(v.verdicts)===before,'evVerdict never touches the list it is handed');
 const bad=evLedger(t,[],{verdicts:[{seat:'solar',v:'maybe'}]});
 ok(bad.claims.solar.state==='supported'&&bad.verdicts[0].refused,'a bad verdict inside the ledger is refused by name and changes nothing');}

g('EV8 · the root stays unknown: repetition opens history, it does not close a root');
{const L=evLedger('I was furious at him. Still furious tonight.',[{bands:{solar:3}}],{});
 ok(srcHear('I was furious at him. Still furious tonight.',{solar:1}).top.rung===10,'srcHear calls this rung ten');
 ok(L.root.state==='unknown'&&L.root.history.indexOf('solar')>=0,'and the ledger holds the root unknown, with solar open to history, '+JSON.stringify(L.root));
 let any=false; CORPUS.forEach(t=>{if(evLedger(t,[],{}).root.state!=='unknown')any=true;});
 ok(!any,'and nowhere on the bank does a root become anything else');}

g('EV9 · the thread follows what the person is writing now');
{const turns=["I keep avoiding things lately.","Usually when I'm already tired.","Nothing. I just want to disappear into my man cave.","I put things off, then I feel guilty.","That I'm lazy."];
 let t='', seen=[];
 turns.forEach(v=>{t=t.replace(/\s+$/,'')+(t?'\n':'')+v; seen.push(evLedger(t,[],{}).thread);});
 ok(srcHear(t,null).top.seat==='heart','srcHear\'s top is still the heart at the end of section 40, which is the measured defect');
 ok(seen[3]==='solar'&&seen[4]==='solar','and the thread moved to the solar plexus when "guilty" arrived, got '+JSON.stringify(seen));
 const L=evLedger('I was furious at him. Still furious tonight. My chest felt tight.',[],{});
 ok(L.thread==='solar','a nameable claim holds the thread over a newer candidate, so the ask and the thread are one seat, got '+L.thread);}

g('EV10 · reading is pure');
{const before=JSON.stringify(E.S.charge), t=PAIRS[3], a=JSON.stringify(evLedger(t,[],{}));
 ok(JSON.stringify(evLedger(t,[],{}))===a&&JSON.stringify(E.S.charge)===before,'same text, same ledger, and the field untouched');}

g('QC1 · the ten checks, in the document\'s order, every time');
{const r=vet('What happened?','x');
 ok(r.checks.map(c=>c.n).join()==='1,2,3,4,5,6,7,8,9,10','ten checks numbered as section 35, got '+r.checks.map(c=>c.n));}

g('QC2 · section 8\'s leading questions are refused, and its better ones pass');
{const pairs=[
  ['Are you feeling shame?','My boss yelled at me.',[6]],
  ['What do you feel?','My boss yelled at me.',[]],
  ['Is your need for control coming from fear?','I hate when plans change.',[6]],
  ['What happens when you don\'t have control?','I have no control of my day.',[]],
  ['Did your parents teach you that?','I always say yes.',[6]],
  ['Where do you remember learning that?','I always say yes.',[]]];
 pairs.forEach(([q,t,want])=>{const r=vet(q,t), got=fails(r);
  ok(want.length?want.every(n=>got.indexOf(n)>=0):r.ok,(want.length?'refused at '+want:'passes')+': '+q+', got '+JSON.stringify(r.fails.map(f=>f.n+' '+f.why)));});}

g('QC3 · the other points each refuse the thing they name');
{const t='My chest is tight. I left the room.';
 const cases=[
  ['What happened, and what did you do?',1,'two questions in one sentence'],
  ['What happened? What did you do?',1,'two question marks'],
  ['You wrote “tight”.',1,'no question at all'],
  ['What is the primary unresolved component of the recollection?',2,'section 2.4\'s own bad example'],
  ['Where is the somatic manifestation localized?',2,'section 2.4\'s other one'],
  ['You wrote “furious”. What did you do?',3,'a quote the person never wrote'],
  ['Why there?',4,'a why asks for a cause'],
  ['What sits at the bottom of it?',4,'srcAsk\'s own root line'],
  ['What made you do that?',5,'force framing'],
  ['What takes you back there?',5,'srcAsk\'s own earlier line'],
  ['What do you feel around your heart?',7,'a place said about no claim']];
 cases.forEach(([q,n,why])=>{const r=vet(q,t); ok(fails(r).indexOf(n)>=0,'point '+n+' refuses '+why+': '+q+', got '+JSON.stringify(fails(r)));});
 ok(vet('When you say “tight”, what happens in your body?',t,{cand:{target:'heart',dim:'body'}}).fails.every(f=>f.n!==1),
  'a leading "when you say it," is a condition, not a second question');}

g('QC4 · the document\'s own canonical lines are held to its own section 8');
{const r1=vet('What part feels uncertain?','I keep thinking about it.'), r2=vet('What does that let you avoid?','I put it off.');
 ok(fails(r1).indexOf(6)>=0&&/uncertain/.test(r1.fails.find(f=>f.n===6).why),'"What part feels uncertain?" plants uncertain, read by the sniffer itself');
 ok(fails(r2).indexOf(6)>=0,'"What does that let you avoid?" plants avoidance');
 ok(fails(vet('What does that let you avoid?','I avoid it.')).indexOf(6)<0,'and both are fine once the person used the word first');}

g('QC5 · point 7: a pattern is said only about a claim with the evidence for it');
{const once='I was furious at him.', twice='I was furious at him. Still furious tonight.';
 const fam=q=>SRC_FAMILY.find(f=>f.q===q);
 const rep=fam('Where else does this happen?'), his=fam('How long has this been happening?');
 const c=(f,tg)=>({cand:Object.assign({},f,{target:tg})});
 ok(fails(vet(rep.q,once,c(rep,'solar'))).indexOf(7)>=0,'repetition is not asked about a candidate');
 ok(fails(vet(rep.q,twice,c(rep,'solar'))).indexOf(7)<0,'and is about a supported claim');
 ok(fails(vet(his.q,twice,c(his,'solar'))).indexOf(7)>=0,'history waits for the seat to come back across entries');
 ok(fails(vet(his.q,twice,Object.assign(c(his,'solar'),{entries:[{bands:{solar:2}}]}))).indexOf(7)<0,'and is allowed once it has');
 ok(fails(vet('You wrote “furious”. It lands behind your stomach. What did you do?',once,{cand:{target:'solar',dim:'behaviour'}})).indexOf(7)>=0,
  'saying where a single mention lands is refused');
 ok(fails(vet('You wrote “furious” twice. It lands behind your stomach each time. What did you do?',twice,{cand:{target:'solar',dim:'behaviour'}})).indexOf(7)>=0,
  'and still refused once it came back: since the seam package a place needs the person\'s yes, not only more evidence');
 ok(fails(vet('You wrote “furious” twice. What did you do?',twice,{cand:{target:'solar',dim:'behaviour'}})).indexOf(7)<0,
  'saying the word came back twice is allowed: it is their own words, counted');
 ok(fails(vet('You wrote “furious”. It lands behind your stomach. What did you do?',twice,{cand:{target:'solar',dim:'behaviour'},verdicts:[{seat:'solar',v:'yes'}]})).indexOf(7)<0,
  'and the place is allowed once the person said yes to it');
 ok(fails(vet('Where in your chest do you feel it?','My chest is tight. My chest is tight.',{cand:{target:'heart',dim:'body'}})).indexOf(7)<0,
  'a place word the person wrote is their own language and is always theirs to hear back');}

g('QC6 · points 8, 9 and 10');
{const t='I was furious at him. Still furious tonight.';
 ok(fails(vet('What happened?',t,{cand:{family:''}})).indexOf(8)>=0,'a question with no purpose is refused');
 ok(fails(vet('Who was there when it started?','He shouted at me. I was furious. I was furious.',{cand:{dim:'contact',target:'solar'}})).indexOf(8)>=0,
  'asking who was there of an entry that says who, while other things are open, is refused');
 ok(fails(vet('What would you rather be doing?','I am terrified. I am terrified.',{cand:{family:'agency',need:'behaviour',dim:'goal',target:'root'}})).indexOf(8)>=0,
  'agency waits until the person said what they did');
 ok(fails(vet('What did you do?','I was furious. My chest is tight. Still furious.',{cand:{dim:'behaviour',target:'heart'}})).indexOf(9)>=0,
  'a question about a seat the person is not on is refused');
 ok(fails(vet('What did you do?',t,{cand:{dim:'behaviour',target:'solar'},asked:['What did you do?']})).indexOf(10)>=0,'a repeat is refused');
 ok(fails(vet('What did you do?',t,{cand:{dim:'behaviour',target:'solar'},passed:true})).indexOf(10)>=0,'after Move on, nothing is asked');
 ok(fails(vet('You wrote “furious” twice. What did you do?',t,{cand:{dim:'behaviour',target:'solar'},asked:['You wrote “furious” once. What did you do?']})).indexOf(10)>=0,
  'a repeat is the same question under a different lead, measured on the page');
 const cl=SRC_FAMILY.filter(f=>f.family==='clarification');
 ok(cl.length&&cl.every(f=>fails(vet(f.q,'I keep thinking about uncertain things',{cand:f})).indexOf(10)>=0),
  'clarification is never chosen: nothing in this product reads what is unclear');}

g('QC7 · regenerate: the live ask fails as written, and the first family line that passes stands');
{let asks=0, live=0, chosen=0, space=0, byPoint={}, fam={};
 const AT={Solar:'behind your stomach',Heart:'around your heart',Root:'at the base of your spine',Throat:'in your throat',Sacral:'low in your belly','3rd Eye':'behind your eyes',Crown:'at the top of your head'};
 /* srcAsk's three lines, copied from ui/storyui.js word for word, because
    the engine gate cannot load the page. tests/srcchat.js checks the page's
    own ask goes through the same check. */
 const ask=(t,ws)=>{const at=AT[t.band], q=ws.slice(0,2).map(w=>'“'+w+'”').join(' and '), said=q?'You wrote '+q+'. ':'';
  if(t.why==='root')return said+'Here and in what you wrote before, it lands '+at+'. What sits at the bottom of it?';
  if(t.why==='earlier')return said+'It lands '+at+', and an earlier entry did too. What takes you back there?';
  if(ws.length>1)return said+'Both land '+at+'. Why there?';
  return said+'It lands '+at+'. Why there?';};
 PAIRS.forEach(text=>{[[],null].forEach(pr=>{
  const h0=srcHear(text,null); if(!h0.top)return;
  const ents=pr?[{bands:{[h0.top.seat]:3}}]:[];
  const h=srcHear(text,srcPrior(ents)), t=E.srcTurn(h,{typed:true}); if(t.move!=='ask')return;
  asks++; const L=evLedger(text,ents,{}), q=ask(t,h.top.words);
  /* the lead as the page builds it, srcLeadOk in ui/storyui.js: each
     sentence of srcAsk's lead kept only if it passes srcVetSay */
  const lead=(q.slice(0,q.lastIndexOf('. ')+1).match(/[^.]+\./g)||[]).map(x=>x.trim()).filter(x=>srcVetSay(x,{text:text,ledger:L},t.seat).ok).join(' ');
  const r=srcVet({q:q,family:'why',target:t.seat},{text:text,ledger:L}); if(r.ok)live++; r.fails.forEach(f=>byPoint[f.n]=(byPoint[f.n]||0)+1);
  const c=srcChoose([{q:q,family:'why',target:t.seat}].concat(srcFamilyCands(lead,t.seat)),{text:text,ledger:L});
  if(c.ok){chosen++; fam[c.cand.family]=(fam[c.cand.family]||0)+1;
   if(!srcVet(c.cand,{text:text,ledger:L}).ok)space=-1e9;} else space++;});});
 ok(asks>0,'the bank produces asks at all');
 ok(live===0,'no ask passes as written, '+live+' of '+asks);
 ok(chosen+space===asks&&space>=0,'every ask ends in a question that passes, or in Space, never in a failing line');
 ok(chosen===asks,'and on the bank every one finds a question that passes, '+chosen+' of '+asks);
 console.log('  asks '+asks+', passed as written '+live+', refused by point '+JSON.stringify(byPoint)+', regenerated '+chosen+', left to Space '+space+', families chosen '+JSON.stringify(fam));
 const r=srcChoose([{q:'Why there?',family:'why'}],{text:'x',ledger:evLedger('x',[],{})});
 ok(!r.ok&&r.q===''&&r.tried.length===1&&r.tried[0].fails.length,'with nothing passing it returns no question, and says why');}

g('QC9 · a family already asked waits behind one that has not been');
{const t='I was furious at him. I slammed the door. Still furious tonight.', L=evLedger(t,[],{});
 const c=srcChoose(srcFamilyCands('',L.thread),{text:t,ledger:L,asked:['What would you rather be doing?']});
 ok(c.ok&&c.cand.family!=='agency','after one agency question, the next is not agency, got '+(c.cand&&c.cand.family+': '+c.q));
 ok(E.qcFamilyOf('You wrote “x”. What did you do?')==='behaviour'&&E.qcFamilyOf('Why there?')===null,'a family is known by its question, whatever lead stands before it');}

g('QC8 · a line that says and does not ask: Mirror is always allowed, Name only when supported');
{const once='I was furious at him.', L=evLedger(once,[],{});
 ok(srcVetSay('You wrote “furious”.',{text:once,ledger:L},'solar').ok,'saying the person\'s own word back passes');
 ok(!srcVetSay('You wrote “furious”. It lands behind your stomach.',{text:once,ledger:L},'solar').ok,'saying where one mention lands does not');
 ok(srcVetSay('You wrote “furious”. It lands behind your stomach.',{text:once,ledger:evLedger(once,[],{verdicts:[{seat:'solar',v:'yes'}]})},'solar').ok,
  'unless the person already said yes to it');
 ok(srcVetSay('x',{text:'x'},null).checks.map(c=>c.n).join()==='3,6,7','and it is points 3, 6 and 7 of the same code, not a second rule');}

g('SK1 · the seam package\'s lifecycle: each of the eight states lands on one of its states, or on none, and the one-event rule holds');
{const {evSeamState,EV_SEAM_STATES,EV_SEAM_NEVER}=E;
 const twice=evLedger('I was furious at him. Still furious tonight.',[],{}).claims.solar;
 ok(twice.state==='supported'&&twice.seam==='CANDIDATE','twice in one entry is supported here and still CANDIDATE there: "repeated expressions in one event do not count as independent episodes"');
 const rep=evLedger('I was furious at him.',[{bands:{solar:2}}],{}).claims.solar;
 ok(rep.seam==='REPEATED','once here and once in an earlier entry is REPEATED');
 ok(evLedger('I was furious at him.',[],{asked:['solar']}).claims.solar.seam==='ASKED','asked about is ASKED');
 const by=v=>evLedger('I was furious at him.',[],{verdicts:[{seat:'solar',v:v,fix:'tired'}]}).claims.solar.seam;
 ok(by('yes')==='CONFIRMED'&&by('fix')==='REFINED'&&by('no')==='REJECTED'&&by('unsure')==='UNRESOLVED','the four answers are CONFIRMED, REFINED, REJECTED and UNRESOLVED');
 ok(evLedger('',[{bands:{solar:2}}],{}).claims.solar.seam===null,'a seat nothing in this event said is no candidate in it');
 let made={}; CORPUS.forEach(t=>Object.values(evLedger(t,[{bands:{solar:1,heart:1}}],{}).claims).forEach(c=>{if(c.seam)made[c.seam]=1;}));
 ok(Object.keys(made).every(k=>EV_SEAM_STATES.indexOf(k)>=0)&&EV_SEAM_NEVER.every(k=>!made[k]),'every state produced is the package\'s, and weakened, disputed and integrated are never faked, got '+Object.keys(made).sort());}

g('SK2 · the person\'s words about the conversation: vent, move on, and that does not fit');
{const {srcIntent}=E, it=t=>{const r=srcIntent(t);return r&&r.intent;};
 ok(it('I just want to vent')==='vent'&&it('I just want to get it out')==='vent','venting is heard as venting');
 ok(it("I don't want to talk about it anymore")==='move_on'&&it('Stop asking me that')==='move_on','asking to stop is heard as moving on');
 ok(it("No, that interpretation doesn't fit me")==='reject'&&it("That's not me")==='reject','turning a reading down is heard as a no');
 ok(it("I don't want to vent")===null,'a no before it sets it aside');
 ok(it("I can't move on from him")===null,'and grief about moving on is not a request to move on');
 ok(it("That's not me at all, I was never like that with my brother when we were kids growing up")===null,'a no inside a long story is about the story, not the reading');
 ok(it('I was furious')===null&&it('')===null,'and a story is not a request at all');}

g('SK3 · the package\'s thirty vectors, run against this engine: what holds, and what is known not to');
{const fs=require('fs'), crypto=require('crypto'), f=path.resolve('tests/fixtures/source_semantic_contract_vectors.json');
 const raw=fs.readFileSync(f);
 ok(crypto.createHash('sha256').update(raw).digest('hex')==='aab26378628f9af45d3728a2aef2830627ed31c998e4d8cdd681557601cd161f',
  'the fixture is the package\'s own file, byte for byte, the checksum its manifest gives');
 const V=JSON.parse(raw).cases, by={}; V.forEach(c=>by[c.id]=c);
 const claims=id=>Object.values(evLedger(by[id].utterance,[],{}).claims);
 const none=id=>claims(id).length===0;
 const before=JSON.stringify(E.S.charge);
 /* holds, asserted */
 ['angry_denied','denied_lie','angry_other','actor_reversal_b','quoted','quiet_case','warm_case','mad_ambiguous',
  'sarcasm','loss_direction','silence','uncertain_motive'].forEach(id=>ok(none(id),id+', '+by[id].expected_guard+': no claim about the speaker'));
 ok(claims('two_registries').length===2,'two_registries, keep_multiple_candidates: both kept, '+claims('two_registries').map(c=>c.seat));
 const cor=evLedger(by.anger_correction.utterance,[],{});
 ok(Object.values(cor.claims).length===1&&cor.ev.some(x=>x.said==='denied'),'anger_correction, revise_not_override: the no is evidence and the new word is the claim');
 ok(V.every(c=>Object.values(evLedger(c.utterance,[],{}).claims).every(x=>x.state!=='supported'||x.mentions>1)),'no vector is more than a candidate off one mention');
 ok(V.every(c=>{const L=evLedger(c.utterance,[],{});return Object.values(L.claims).every(x=>!srcVetSay('It lands '+'behind your stomach.',{text:c.utterance,ledger:L},x.seat).ok);}),
  'chakra_only_candidate_not_fact: on no vector may a place be said back');
 ok(srcIntent(by.voice_vent.utterance).intent==='vent'&&srcIntent(by.voice_move_on.utterance).intent==='move_on'&&srcIntent(by.rejected_pattern.utterance).intent==='reject',
  'voice_vent, voice_move_on and rejected_pattern are each read as what they are');
 ok(JSON.stringify(E.S.charge)===before,'silence and every vector: no_cq_change, nothing here touches the field');
 /* known not to hold, held as expected red so a fix is noticed */
 const xf=(c,m)=>{if(c){F++;console.log('  FAIL  expected red went green, move it up: '+m);}else{P++;console.log('  red   '+m);}};
 xf(none('angry_temporal'),'angry_temporal, do_not_assume_current: "used to be angry, but not anymore" is still a live candidate. The sniffer reads no tense');
 xf(none('angry_hypothetical'),'angry_hypothetical, do_not_score: "If I got angry" is still a candidate, and parseStory scores it. The sniffer reads no conditional');
 xf(srcHear(by.uncertain_motive.utterance,null).seats.length>0,'uncertain_motive: "My boss humiliated me" is set aside as the boss\'s word, so what was done to the speaker is not heard. Done to is read as did');}

console.log('\n===== '+P+' passed, '+F+' failed =====');
process.exit(F?1:0);
