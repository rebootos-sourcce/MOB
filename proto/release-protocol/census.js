/* ============================================================
   CENSUS. Every place a person can read "release" or "protocol".

   He asked whether "release" or "protocol" should be the one word. Before any
   persona reacts to anything, this counts where the two words actually stand
   in the shipped copy and what grammatical job each occurrence is doing,
   because a noun can only replace a noun. It reads atuned_src read only.

   What counts as user visible: string literals in ui/ and in the data tables
   a renderer prints (the glossary, the cards, the plan text, the practices),
   with comments stripped first, the same rule tools/terms.py uses. A literal
   that is only an id, a selector or a data key is skipped.

     node proto/release-protocol/census.js      writes census.json
   ============================================================ */
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..','..'),SRC=path.join(ROOT,'atuned_src');
const order=fs.readFileSync(path.join(SRC,'MANIFEST'),'utf8').split('\n').map(s=>s.trim()).filter(Boolean);
const DATA=['engine/data/kb.js','engine/data/cards.js','engine/plan.js','engine/data/practice.js',
 'engine/data/canon.js','engine/numerology.js','engine/verp.js','engine/data/compass.js','engine/data/catalog.js'];
const files=order.filter(m=>m.startsWith('ui/')||m.startsWith('shell/')).concat(DATA.filter(f=>order.includes(f)||fs.existsSync(path.join(SRC,f))));
const WORD=/\b(releas\w*|protocols?)\b/gi;
/* the grammatical job of one occurrence, read off its neighbours */
function role(w,before,after){
 const lw=w.toLowerCase(), b=before.toLowerCase().trimEnd(), a=after.toLowerCase().trimStart();
 if(/^protocol/.test(lw))return 'noun, the procedure';
 if(lw==='released')return 'past participle or state';
 if(lw==='releasing')return 'verb, ongoing';
 if(lw==='releasable')return 'adjective';
 if(lw==='releases'){ if(/(\d|\b(a|twenty|two|of|thousands of|all|as many))\s*$/.test(b)||/\b(all|two|five|twenty five)$/.test(b))return 'noun, the event';
  return /^(on|stress|pressure)/.test(a)?'verb':(/^(run|at)\b/.test(a)?'noun, the event':'verb');}
 /* release. Checked row by row against census.json: the first cut read every
    sentence opening as a noun, so "Release the fear." and the Imprints button
    "Release 3" came out as the event. An imperative takes an object after it. */
 if(/^protocol/.test(a))return 'modifier of protocol';
 if(/^(empties|has|works|lifts|does|is|and reframe|work|state|session|count|runs|finishes|of)\b/.test(a))return 'noun, the event';
 if(/\b(to|nothing to|would|will|cannot|can|could|and|or|i)$/.test(b))return 'verb';
 if(/\b(a|the|each|first|every|one|this|your|half a|of|for|partial|somatic|complete)$/.test(b))return 'noun, the event';
 if(a===''||/^(this|the|each|it|pressure|stress|on|at|my|grip|\d)\b/.test(a))return 'verb';
 return 'noun, the event';}
const out=[];
for(const f of files){
 const p=path.join(SRC,f); if(!fs.existsSync(p))continue;
 let s=fs.readFileSync(p,'utf8');
 /* comments out, keeping line numbers */
 const noCom=s.replace(/\/\*[\s\S]*?\*\//g,m=>m.replace(/[^\n]/g,' ')).replace(/(^|[^:'"\\])\/\/[^\n]*/g,(m,g)=>g+' '.repeat(m.length-g.length));
 const re=/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"/g; let m;
 while((m=re.exec(noCom))){
  const v=(m[1]!=null?m[1]:m[2]); if(!v||!/[a-z]{3}\s/i.test(v))continue;
  if(/^(data-|rel|st-|ad-|pm-|kb-)/.test(v)&&!/\s/.test(v))continue;
  let w; WORD.lastIndex=0;
  while((w=WORD.exec(v))){
   const line=noCom.slice(0,m.index).split('\n').length;
   out.push({file:f,line,word:w[1],role:role(w[1],v.slice(0,w.index),v.slice(w.index+w[1].length)),
    text:v.replace(/\\'/g,"'").slice(Math.max(0,w.index-60),w.index+w[1].length+60)});}}}
const tally={};out.forEach(o=>{const k=(/^protocol/i.test(o.word)?'protocol':'release')+' | '+o.role;tally[k]=(tally[k]||0)+1;});
const rel=out.filter(o=>!/^protocol/i.test(o.word));
const nounSlot=rel.filter(o=>o.role==='noun, the event').length;
const summary={occurrences:out.length,release:rel.length,protocol:out.length-rel.length,tally,
 release_in_a_noun_slot:nounSlot,release_needing_a_rewrite:rel.length-nounSlot};
fs.writeFileSync(path.join(__dirname,'census.json'),JSON.stringify({summary,rows:out},null,1));
console.log(JSON.stringify(summary,null,1));
