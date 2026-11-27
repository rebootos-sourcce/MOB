/* ============================================================
   RELEASE OR PROTOCOL, A THOUSAND TIMES EACH. Round DY.

   What "a thousand times" can honestly mean here. One model writing six
   voices a thousand times is one opinion a thousand times: the thousand
   agree with each other because they share an author, and agreement between
   copies of one reader is not evidence. So the thousand is spent on the one
   question repetition can answer: is each persona's preference a stable
   pattern, or a coin flip that a slightly different reading of them would
   turn over?

   How. Every tested string is a real shipped string, quoted with its file and
   line in STRINGS below, beside its best protocol form (or, where the build
   already says protocol, its release form). Each form is scored on nine
   features, 0 to 2, and every score is on the page so it can be argued.
   Each persona carries a weight per feature, signed, and every weight cites
   the line in RESEARCH-icp.md or people.js it comes from. A persona prefers
   whichever form scores higher.

   Then the whole thing is shaken. 1,000 draws per persona per string: every
   weight multiplied by a random factor between 0 and 2 (so a persona may care
   about a thing not at all, or twice as much as recorded), every feature
   score moved by up to half a point either way (my own scoring error). The
   share of draws in which release still wins is the number reported. Near
   1000 or near 0 is a pattern. Near 500 is a coin flip, and is called one.

   What it cannot do: tell you what a real person feels. The weights are a
   reading of six written records, and the scores are mine. It says whether
   the answer survives being wrong about the details, which is the question
   "a thousand times" was asking.

     node proto/release-protocol/sim.js      writes sim.json, seeded, repeatable
   ============================================================ */
const fs=require('fs'),path=require('path');

/* the features, and what a 2 means */
const FEAT={
 physical:'names a physical event with mass and direction (the house rule: physical metaphors only)',
 sequence:'signals a fixed, specified series of steps',
 obligation:'reads as an assignment: you need to do this',
 shelf:'echoes the wellness shelf, where this word is sold as a feeling',
 clinical:'reads as medical or institutional, done to a patient',
 costume:'claims a formality or precision the sentence does not carry',
 discreet:'gives nothing away to somebody glancing at the screen',
 fit:'reads as the sentence it replaces, without a rewrite',
 truth:'still says exactly what the engine does (pass one, which beats every other)'};

/* word level defaults, overridden per string where the context changes them */
const BASE={
 R:{physical:2,sequence:0.5,obligation:0.5,shelf:1.5,clinical:0,costume:0,discreet:0.5,fit:2,truth:2},
 P:{physical:0,sequence:2,obligation:1.5,shelf:0,clinical:1.5,costume:1,discreet:1.5,fit:2,truth:2}};

const STRINGS=[
 {id:'button',bucket:'Menu',where:'ui/summary.js:651, ui/storyui.js:189, eyebrow at ui/release.js:353',
  shipped:'R',R:'Run a release',P:'Run the protocol',
  R_:{},P_:{costume:0.5},
  why:'The primary action on Summary and on Story. Nothing beside the button says what the sequence is.'},
 {id:'first',bucket:'Label',where:'ui/summary.js:648',
  shipped:'R',R:'Release this first',P:'First protocol',
  R_:{obligation:1},P_:{fit:1,truth:1},
  why:'Eyebrow over the heaviest address on Summary. The P form has no verb to carry the imperative, so it reads as if the address were the protocol\'s name.'},
 {id:'here',bucket:'Instruction',where:'ui/drills.js:268 and :445',
  shipped:'P',R:'Run a release here. Four channels, twenty five lines.',P:'Run the protocol here. Four channels, twenty five lines.',
  R_:{sequence:1},P_:{costume:0},
  why:'The address card button. The line beside it states the sequence, so "protocol" is earned here: it names a thing that is exactly specified.'},
 {id:'nothing',bucket:'Refusal',where:'ui/drills.js:272 to :273',
  shipped:'mixed',R:'Nothing is held here, so there is nothing to release. A release opens once this address is carrying.',
  P:'Nothing is held here, so there is nothing for the protocol to run on. The protocol opens once this address is carrying.',
  R_:{},P_:{fit:1},
  why:'Ships today with both words in one refusal. Protocol has no verb, so "nothing to release" has to be rebuilt.'},
 {id:'imprints',bucket:'Menu',where:'ui/imprints.js:239',
  shipped:'R',R:'Release 3',P:'Run protocol 3',
  R_:{obligation:1},P_:{fit:0.5},
  why:'Menus are one word, and the word says what the control does. A noun cannot be that word.'},
 {id:'done',bucket:'Label',where:'ui/release.js:305',
  shipped:'R',R:'Released',P:'Protocol complete',
  R_:{truth:1},P_:{costume:0,obligation:0.5,fit:1.5},
  why:'The eyebrow on the card a run ends on, above "0 cleared entirely, 66 weight freed" for James. "Released" states a body event the instrument did not observe. "Protocol complete" states only what the software knows.'},
 {id:'empties',bucket:'Definition',where:'ui/release.js:337, ui/drills.js:200, ui/games.js:124',
  shipped:'R',R:'Release empties the address. The coherent opposite is installing on the same pass.',
  P:'The protocol empties the address. The coherent opposite is installing on the same pass.',
  R_:{},P_:{truth:1.5,costume:1.5},
  why:'The mechanism in one line. Release is mechanic one of two; the protocol is both. Swapping the word makes the protocol do half of itself.'},
 {id:'left',bucket:'Reading',where:'ui/release.js:331',
  shipped:'R',R:'Release has about 1.2 points left to give you. The laws hold expression down from here.',
  P:'The protocol has about 1.2 points left to give you. The laws hold expression down from here.',
  R_:{},P_:{truth:1.5,costume:1.5,fit:1.5},
  why:'The headroom is a property of discharge on the shadow. A protocol does not run out; what it can still discharge does.'},
 {id:'worked',bucket:'Refusal',where:'ui/release.js:130',
  shipped:'R',R:'Nothing released on a worked example.',P:'No protocol runs on a worked example.',
  R_:{},P_:{truth:1},
  why:'The run on a worked example does walk every line to the end, and then refuses to write. "No protocol runs" is false. "Nothing released" is exact.'},
 {id:'gloss',bucket:'Definition',where:'engine/data/kb.js:19, the glossary entry',
  shipped:'R',R:'Release. The discharge of stored charge through the nervous system. Physical and observable: heat, shaking, tears, breath shifts. The pattern loses its power source.',
  P:'Protocol. The sequence that discharges stored charge through the nervous system. Physical and observable: heat, shaking, tears, breath shifts. The pattern loses its power source.',
  R_:{},P_:{truth:1,costume:2,fit:1},
  why:'A protocol cannot be a discharge, so the definition has to change its subject, and "physical and observable" then describes a list of steps.'},
 {id:'settles',bucket:'Instruction',where:'engine/data/cards.js:266',
  shipped:'R',R:'The release is complete when the body settles. Breath deepens. Vision may clear. That is the signal.',
  P:'The protocol is complete when the body settles. Breath deepens. Vision may clear. That is the signal.',
  R_:{},P_:{truth:1,costume:2},
  why:'The end condition is bodily. The shipped protocol ends after its lines whatever the body does, so the P form promises a stop rule the product does not have.'},
 {id:'plan',bucket:'Definition',where:'engine/plan.js:53, the free tier',
  shipped:'R',R:'Ten patterns a week, for life. Two releases at one address, and unlimited rerunning of anything already open.',
  P:'Ten patterns a week, for life. Two protocols at one address, and unlimited rerunning of anything already open.',
  R_:{},P_:{obligation:2,truth:1.5},
  why:'Paywall copy. "Two protocols at one address" reads as two different regimens, and a regimen sold by the week reads as a prescription.'}];

/* the six, with every weight sourced. Positive means the persona is drawn to
   a form that scores high on that feature; negative means pushed away. */
const PEOPLE=[
 {nm:'Sofia',age:41,role:'somatic practitioner',weight:140,
  says:'I hold the room for everyone. I have not been held in four years and I would not know how to ask.',
  w:{physical:2,sequence:1.5,obligation:-0.5,shelf:-0.5,clinical:0.5,costume:-1,discreet:0,fit:1,truth:2},
  src:{physical:'Her trade is the body; release is a word she uses with clients in its physical sense.',
   sequence:'"Tell me what to run and how long it takes." (RESEARCH-icp.md, section 4)',
   obligation:'"I hold the room for everyone." She is already carrying every obligation in the room.',
   shelf:'Knows the shelf, uses the word professionally anyway, so the echo costs little.',
   clinical:'"A map I could put in front of a client." Client facing wording has to hold up.',
   costume:'"Said back to me by something with no stake in being kind to me." Dressing up is a stake.',
   fit:'Reads at eleven at night, on a phone, in bed.',truth:'She will repeat it to a client. It has to be true.'}},
 {nm:'Diane',age:46,role:'founder, second company',weight:180,
  says:'I work until the work is done and the work is never done. Rest feels like a moral failure.',
  w:{physical:0.5,sequence:1,obligation:-2,shelf:-1,clinical:0,costume:-0.5,discreet:0.5,fit:1,truth:2},
  src:{physical:'Wants a cost, not a sensation.',sequence:'"What does it actually do at nine on a Tuesday." A thing with steps can be scheduled.',
   obligation:'"Does it give me back an hour or does it give me another practice to fail at." Rest already reads to her as a moral failure; an assignment lands on that.',
   shelf:'"I have a shelf of those."',clinical:'Neutral.',costume:'Wants the P and L, not the packaging.',
   discreet:'Opens it at work.',fit:'Scans.',truth:'"A number and a cost."'}},
 {nm:'Marcus',age:44,role:'creative director',weight:160,
  says:'I can see what is wrong with anything in four seconds. It has cost me two studios.',
  w:{physical:1.5,sequence:0.5,obligation:-0.5,shelf:-1.5,clinical:-0.5,costume:-2.5,discreet:0,fit:1.5,truth:2.5},
  src:{physical:'"Does it show me the mechanism. I need the schematic." A mechanism is a physical verb.',
   sequence:'Accepts a sequence where it is stated.',obligation:'"Help is the wrong verb and the fact that you used it tells me who you think I am."',
   shelf:'Reads wellness in four seconds and closes the tab.',clinical:'Borrowed clinical authority is the same move as borrowed nerve names.',
   costume:'"That is precision as costume." (RESEARCH-icp.md, section 5, the sharpest break in the study)',
   fit:'Sees a rebuilt sentence in four seconds.',truth:'"Give me a claim specific enough to be wrong."'}},
 {nm:'Angela',age:36,role:'seeker, six modalities',weight:150,
  says:'Everything happens for a reason. I have said that at three funerals and I believed it each time.',
  w:{physical:1,sequence:-0.5,obligation:-1.5,shelf:1,clinical:-2,costume:0,discreet:-0.5,fit:1,truth:1},
  src:{physical:'"None of them told me where it lives." She wants it in the body.',
   sequence:'The voice skill\'s pass 7: "Does she stay on the screen or decide this is homework."',
   obligation:'Walked at a single word once: "It told me I am incoherent. I closed it." A word that assigns her something is the same shape as a word that grades her.',
   shelf:'The only one of the six for whom the familiar word is trust rather than a smell. Six modalities all said release.',
   clinical:'"A moral adjective delivered by software to a person in crisis is a verdict." Clinical distance reads to her as being processed.',
   costume:'Does not audit it.',discreet:'"This is the one I would screenshot for the group chat." She wants to be seen.',
   fit:'Level 5, reads for feeling.',truth:'Weighs truth, less than the others: "I expect it to see me."'}},
 {nm:'Derek',age:39,role:'high performer, endurance',weight:170,
  says:'Pain is information. I have raced on a stress fracture. I would do it again.',
  w:{physical:1,sequence:2,obligation:1,shelf:-1.5,clinical:1,costume:-0.5,discreet:0,fit:1,truth:1.5},
  src:{physical:'"Pain is information." Heat and shaking are data to him.',
   sequence:'"Name the one thing capping my output and where it sits. I will train it like anything else." A training protocol is his native unit.',
   obligation:'Wants to be handed the set. An assignment is the product.',
   shelf:'"If my resting rate does not move and my last kilometre does not move, this is a mood."',
   clinical:'Sports medicine language reads as seriousness.',costume:'Does the arithmetic; catches a claim with nothing under it.',
   fit:'"Put it in text and I will read it in nine seconds."',truth:'Checks the numbers, not the nouns.'}},
 {nm:'James',age:57,role:'C-suite, third turnaround',weight:100,
  says:'I make the call and I sleep fine. People find that cold. It is what they hired.',
  w:{physical:0.5,sequence:1,obligation:-1.5,shelf:-1.5,clinical:-1,costume:-1,discreet:1.5,fit:1.5,truth:2},
  src:{physical:'Indifferent to sensation.',sequence:'"Front load the finding." Operational language is his.',
   obligation:'"Help implies a deficit. Ask me instead what it improves." Being put on a protocol is being a patient.',
   shelf:'Level 3, defended. A wellness word ends it.',clinical:'Protocol is what he writes for other people, not what he is put on.',
   costume:'"You moved between them without telling me." He audits the join.',
   discreet:'"I will not open that on a plane, or in my office with the door open." (DD panel)',
   fit:'Reads board papers.',truth:'"I make calls for a living."'}}];

/* seeded, so the thousand are the same thousand on every run */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);
 t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rnd=mulberry32(20260926);
const N=1000;
const feat=(s,v)=>Object.assign({},BASE[v],s[v+'_']);
const util=(w,x)=>Object.keys(FEAT).reduce((a,f)=>a+w[f]*x[f],0);
const clamp=v=>Math.max(0,Math.min(2,v));

const out={n:N,seed:20260926,features:FEAT,strings:[],people:PEOPLE.map(p=>({nm:p.nm,age:p.age,role:p.role,weight:p.weight,says:p.says,w:p.w,src:p.src}))};
for(const s of STRINGS){
 const xr=feat(s,'R'),xp=feat(s,'P');
 const row={id:s.id,bucket:s.bucket,where:s.where,shipped:s.shipped,R:s.R,P:s.P,why:s.why,xR:xr,xP:xp,by:{}};
 for(const p of PEOPLE){
  let wins=0;
  for(let k=0;k<N;k++){
   const w={},a={},b={};
   for(const f in FEAT){w[f]=p.w[f]*2*rnd();a[f]=clamp(xr[f]+rnd()-0.5);b[f]=clamp(xp[f]+rnd()-0.5);}
   if(util(w,a)>util(w,b))wins++;}
  row.by[p.nm]={base:+(util(p.w,xr)-util(p.w,xp)).toFixed(2),release:wins};}
 out.strings.push(row);}
/* per persona, across all twelve */
out.totals={};
for(const p of PEOPLE){
 const r=out.strings.map(s=>s.by[p.nm].release);
 out.totals[p.nm]={release:r.reduce((a,b)=>a+b,0),of:N*STRINGS.length,
  strings_release:r.filter(v=>v>=700).length,strings_protocol:r.filter(v=>v<=300).length,
  strings_coin:r.filter(v=>v>300&&v<700).length};}
/* THE ONE STRING PROTOCOL WINS, AND A THIRD FORM FOR IT. The finished card is
   where "Released" overstates, so the proposed replacement is run against both
   words on the same thousand draws. "Run complete" is not new copy: it ships
   as the Games surface's finished eyebrow at ui/games.js:184, and "run" is the
   verb already on every release button. Scored by the same hand, and said so. */
const done=STRINGS.find(s=>s.id==='done');
const RC={physical:0.5,sequence:1,obligation:0.5,shelf:0,clinical:0.5,costume:0,discreet:2,fit:2,truth:2};
out.third={string:'Run complete',where:'ships at ui/games.js:184',x:RC,by:{}};
for(const p of PEOPLE){
 let beatsR=0,beatsP=0;
 for(let k=0;k<N;k++){
  const w={},a={},b={},c={};
  for(const f in FEAT){w[f]=p.w[f]*2*rnd();a[f]=clamp(feat(done,'R')[f]+rnd()-0.5);
   b[f]=clamp(feat(done,'P')[f]+rnd()-0.5);c[f]=clamp(RC[f]+rnd()-0.5);}
  const uc=util(w,c); if(uc>util(w,a))beatsR++; if(uc>util(w,b))beatsP++;}
 out.third.by[p.nm]={beats_released:beatsR,beats_protocol_complete:beatsP};}
fs.writeFileSync(path.join(__dirname,'sim.json'),JSON.stringify(out,null,1));
console.log('\nRun complete, on the finished card: draws of 1000 it beats Released / Protocol complete');
for(const p of PEOPLE)console.log(p.nm.padEnd(8),out.third.by[p.nm].beats_released,'/',out.third.by[p.nm].beats_protocol_complete);
/* the table, as it prints */
const pad=(s,n)=>String(s).padEnd(n);
console.log(pad('string',10)+PEOPLE.map(p=>pad(p.nm,8)).join(''));
for(const s of out.strings)console.log(pad(s.id,10)+PEOPLE.map(p=>pad(s.by[p.nm].release,8)).join(''));
console.log('\nper persona: strings where release holds in 700+ of 1000 / protocol in 700+ / neither');
for(const p of PEOPLE){const t=out.totals[p.nm];console.log(pad(p.nm,8),t.strings_release,'/',t.strings_protocol,'/',t.strings_coin);}
