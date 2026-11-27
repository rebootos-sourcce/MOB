/* ============================================================
   A HUNDRED PASSES, EACH ONE A REAL REQUEST.

   The owner asked for a hundred simulations. A hundred opinions is one
   opinion repeated, so this draws a hundred actual carriers out of the
   measured walk, stratified by kind in the proportion the walk found, and
   resolves each one against four questions:

     which kind of information does this carrier want
     which table in this product already holds the answer
     which surface would show it under the rule
     does the answer exist, or does someone have to write it

   Deterministic. The sample is taken on a fixed stride through the carrier
   list rather than at random, so the hundred are the same hundred on every
   run and a number in the write up can be checked.

     node proto/info/hundred.js
   ============================================================ */
const fs=require('fs'), path=require('path');
const R=JSON.parse(fs.readFileSync(path.join(__dirname,'demand.json'),'utf8'));
const D=R.runs.desktop;
const pad=(s,n)=>String(s)+' '.repeat(Math.max(0,n-String(s).length));
const rpad=(s,n)=>' '.repeat(Math.max(0,n-String(s).length))+String(s);

/* one flat list, with the surface each carrier was seen on. The shared rails
   appear on every surface, so a carrier is kept once, keyed on its class and
   its text, and the surfaces it appears on are recorded. That is the
   correction pass 0 forced on the title count and it applies here too. */
const U={};
for(const nm of Object.keys(D.surfaces))D.surfaces[nm].carriers.forEach(c=>{
 const key=c.k+'|'+c.cls+'|'+c.txt;
 const r=U[key]||(U[key]={...c, on:[]});
 if(r.on.indexOf(nm)<0)r.on.push(nm);});
const ALL=Object.values(U);
console.log('distinct carriers in the product, shared chrome counted once: '+ALL.length);
const KS=['word','number','reading','control','next'];
const by={}; KS.forEach(k=>by[k]=ALL.filter(c=>c.k===k));
console.log('by kind: '+KS.map(k=>k+' '+by[k].length).join(', '));

/* the hundred, stratified in the measured proportion, minimum one each. */
const share={}; let left=100;
KS.forEach((k,i)=>{share[k]=i===KS.length-1?left:Math.max(1,Math.round(100*by[k].length/ALL.length)); left-=share[k];});
const SAMPLE=[];
KS.forEach(k=>{const n=Math.min(share[k],by[k].length), st=Math.max(1,Math.floor(by[k].length/n));
 for(let i=0;i<n;i++)SAMPLE.push(by[k][(i*st)%by[k].length]);});
console.log('the hundred: '+KS.map(k=>k+' '+share[k]).join(', ')+'  total '+SAMPLE.length);

/* WHICH TABLE HOLDS THE ANSWER. Read off the carrier's own provenance,
   which the walk recorded from the engine tables rather than guessing. */
const STORE={address:'W, and a knowledge row', fetter:'CHILD, and a knowledge row',
 opposite:'CHILD.opp. NO definition anywhere', saboteur:'SABDEF', law:'SI, and a knowledge row',
 mask:'MASKS', domain:'DOMDEF', archetype:'ARCH.v', 'universal law':'HARM',
 glossary:'GLOSS', seat:'nothing. NO definition anywhere',
 'hyper-complex':'HCX_LIB. NO definition anywhere'};
/* one surface per kind. This is the rule under test. */
const SURFACE={word:'the tip, body from the store',
 number:'on the surface, beside the figure. no interaction',
 reading:'the tip, then the drill for the long form',
 control:'the tip, one line, what it does',
 next:'the surface itself, as the control\'s own label'};

const need={written:0, held:0}, tally={}, missing={};
console.log('\n'+pad('#',4)+pad('kind',9)+pad('carrier',30)+pad('holds the answer today',34)+'route today');
SAMPLE.forEach((c,i)=>{
 const store=c.term?(STORE[c.term]||c.term):(c.k==='number'?'the renderer that printed it'
   :c.k==='reading'?'compute(), and the drill':c.k==='control'?'nothing. a control describes itself'
   :'nothing');
 const has=!/NO definition anywhere|^nothing/.test(store);
 has?need.held++:need.written++;
 if(!has)missing[store]=(missing[store]||0)+1;
 const rt=c.route.length?c.route.join('+'):'NONE';
 tally[c.k+' '+rt]=(tally[c.k+' '+rt]||0)+1;
 if(i<24||!has&&i<60)console.log(pad(i+1,4)+pad(c.k,9)+pad((c.txt||'['+c.cls+']').slice(0,28),30)+pad(store,34)+rt);});

console.log('\nof the hundred, the answer already exists in a table: '+need.held);
console.log('of the hundred, somebody has to write it:              '+need.written);
console.log('\nwhat has to be written, by store:');
Object.keys(missing).sort((a,b)=>missing[b]-missing[a]).forEach(k=>console.log('  '+pad(k,44)+rpad(missing[k],5)));
console.log('\nthe hundred by kind and route today:');
Object.keys(tally).sort((a,b)=>tally[b]-tally[a]).forEach(k=>console.log('  '+pad(k,30)+rpad(tally[k],5)));
console.log('\none surface per kind, which is the rule under test:');
KS.forEach(k=>console.log('  '+pad(k,9)+SURFACE[k]));
