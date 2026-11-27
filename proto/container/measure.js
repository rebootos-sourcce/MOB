#!/usr/bin/env node
/* MEASURES THE PROMPT SET AGAINST THE RUNNING ENGINE. A prompt is only as good
   as what the sniffer reads out of the answer it produces, so every prompt
   here carries a worked answer written the way one of the six reference people
   would write it, and the answer is scanned rather than admired.

     node proto/container/measure.js

   Reports, per prompt: how many hits the scanner scored, which seats they
   landed on, how many imprints came back, how many of those the person's own
   words NAMED rather than the fallback choosing, and whether the words that
   take charge off appear.

   The named column is the one that decides what the acknowledgement is
   allowed to say. */
const E=require('../../engine.js');
const {PROMPTS}=require('./prompts.js');
const A=require('./answers.js').ANSWERS;

let read=0, dead=[], rows=[], hits=0, imp=0, named=0, allInf=0, seats={};
PROMPTS.forEach(p=>{
 const a=A[p[0]];
 if(!a){dead.push(p[0]+' (no worked answer)');return;}
 const r=E.parseStory(a);
 const sset={}; r.hits.forEach(h=>{if(h.band){sset[h.band]=1;seats[h.band]=(seats[h.band]||0)+1;}});
 const nm=r.imprints.filter(i=>!i.inferred).length;
 const coh=r.hits.filter(h=>h.band==='coherent').length;
 hits+=r.hits.length; imp+=r.imprints.length; named+=nm;
 if(r.imprints.length&&!nm)allInf++;
 if(r.hits.length)read++; else dead.push(p[0]);
 rows.push([p[0],p[1],r.hits.length,Object.keys(sset).join('+')||'-',
  r.imprints.length,nm,coh,r.path.located,r.path.dwell||'-']);});

console.log('id    ring     hits seats                     imp nmd coh loc dwell');
rows.forEach(r=>console.log(r[0].padEnd(6)+r[1].padEnd(9)+String(r[2]).padEnd(5)
 +String(r[3]).padEnd(26)+String(r[4]).padEnd(4)+String(r[5]).padEnd(4)
 +String(r[6]).padEnd(4)+String(r[7]).padEnd(4)+r[8]));
const med=rows.map(r=>r[2]).sort((a,b)=>a-b)[Math.floor(rows.length/2)];
console.log('');
console.log('prompts             '+PROMPTS.length);
console.log('the sniffer reads   '+read+' of '+rows.length
 +(dead.length?'.  dead: '+dead.join(' '):'.  none dead'));
console.log('hits                '+hits+' total, median '+med+' an answer');
console.log('imprints            '+imp+' total, '+named+' named by the words, '
 +(imp-named)+' chosen by the fallback');
console.log('answers where every imprint is inferred: '+allInf+' of '+rows.length);
console.log('seats touched       '+JSON.stringify(seats));

/* AND THE ONE THING THE DESCENT KEYRING NEEDS THAT IT DOES NOT HAVE. DANTECUE
   carries the cue phrases the nine circles are recognised by. scanStory has
   never read them, because they are in a different table from LEX. A keyring
   built on the circles opens a door onto a parser that cannot read what comes
   through it. */
let cue=0, cdead=[];
E.DANTECUE.forEach(r=>(r[3]||[]).forEach(c=>{cue++;
 if(!E.scanStory(c).length)cdead.push(r[1]+': '+c);}));
console.log('');
console.log('DANTECUE cue phrases '+cue+', read by scanStory '+(cue-cdead.length)
 +', dead '+cdead.length);
cdead.forEach(l=>console.log('  '+l));
