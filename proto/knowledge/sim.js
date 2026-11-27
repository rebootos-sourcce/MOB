/* ============================================================
   THE ICP WALK, as a table a person can argue with.

   node proto/knowledge/sim.js

   Two classes of figure, labelled every time, the convention of
   reviews/SIM-ninety-days.md:

     measured   read off the built prototypes by shoot.js and a scripted
                walk as each ICP. A fact about the files.
     judgement  a score from 0 to 4 per ICP per mockup, with the reason
                written beside it. Model output. Not evidence about any
                human being, and nobody named here exists.

   The weights are the panel weights from RESEARCH-icp.md, so this can be
   compared line by line with the funnel work.

   Then a robustness pass. Every weight is scaled by a random 0.5 to 1.5
   and every score is moved by one point with probability 0.3, ten thousand
   times, and the table reports how often each mockup comes out on top.
   That measures how much the ranking depends on any single judgement. It
   does not measure people, and no amount of it becomes five sigma: five
   sigma is a threshold on real observations, and there are none yet.
   ============================================================ */
const W={Diane:180,Derek:170,Marcus:160,Angela:150,Sofia:140,James:100};
const LEVEL={Sofia:8,Diane:6,Marcus:7,Angela:5,Derek:7,James:3};
const M=['A atlas','B deck','C codex','D map'];

/* measured, by shoot.js and the walk. Choices are interactive elements
   above the fold, prototype chrome excluded. The shipped Knowledge tab
   read 130 at 1600 on the same count. */
const MEASURED={
 'choices at 1600':[17,6,20,143],
 'choices at 390':[5,5,7,39],
 'taps to heaviest entry and its way out':[1,3,1,1],
 'taps to a term definition':[0,2,0,1],
 'personal figure above the fold at 390':['yes','yes','no','yes'],
 'changes on its own by day three':['no','yes','yes','no'],
 'stranger first screen':['four entries to start','a dealt card','empty rings','unlabelled dots']};

/* judgement, with the reason. Scores: 4 would come back unprompted,
   3 uses it, 2 uses it and names a problem, 1 resists, 0 refuses. */
const J={
 Sofia:[[3,'HOLD. Search and the address list are fast enough to use with a client in the room.'],
  [1,'RESIST. A three card hand and a question on where Fear sits is a quiz on her own trade.'],
  [1,'RESIST. Nothing is held and nothing is running, so every ring is shut. Low charge reads as absence.'],
  [4,'BUY. The body as the address book is how she already works. Asks for labels on the dots.']],
 Diane:[[3,'BUY. Anticipation at 80 percent in the first card, one tap from its release line.'],
  [3,'HOLD. Will not stop at three. Deal one more, twenty times. The risk is her own pattern.'],
  [3,'HOLD. 22 closed on arrival and a Next line: the exact loop a person who cannot stop will grind.'],
  [2,'RESIST. 142 things to hover. No time for it.']],
 Marcus:[[2,'RESIST. A grid of text cards, every app has one. Works, but has no face.'],
  [3,'BUY. One idea per card, set in type, with a shape to it.'],
  [3,'HOLD. The loop ring is the one mark that means something. The plates are dense.'],
  [3,'HOLD. The most distinctive of the four. 24 identical circles on the crown row say nothing.']],
 Angela:[[4,'BUY. Shelves to browse, and she will read thirty entries. Seen climbs faster than Known.'],
  [4,'BUY. "I am stuck. I am trapped." lands, one idea at a time, and the hand ends on recall.'],
  [0,'REFUSE. Every entry puts the physical work in front of her: practise it, run a release. Level 5 leaves here.'],
  [3,'HOLD. The body is her language across six modalities. The dots need names.']],
 Derek:[[3,'HOLD. Fast and clear. Asks where the data is.'],
  [2,'RESIST. Three cards a day is a warm up.'],
  [4,'BUY. 41 closed, the next one named, a training log per entry.'],
  [4,'BUY. 14 large dots, his own spread, and a saboteur drawn across four seats is a diagnostic.']],
 James:[[3,'HOLD. The bottom line is in the first row, Anger at 80 percent. The question sits at the end of a sheet and can be ignored.'],
  [0,'REFUSE. The question is in the path. Being tested reads as being accused at level 3.'],
  [1,'RESIST. The first instruction on the page is to answer a question.'],
  [3,'HOLD. Sees the solar band loaded, believes it, leaves.']]};

const who=Object.keys(W), sumW=who.reduce((a,k)=>a+W[k],0);
function total(S,Wt){return M.map((_,m)=>who.reduce((a,k)=>a+S[k][m]*Wt[k],0)/who.reduce((a,k)=>a+Wt[k],0));}
const base=total(Object.fromEntries(who.map(k=>[k,J[k].map(x=>x[0])])),W);
const floor=M.map((_,m)=>Math.min(...who.map(k=>J[k][m][0])));

/* the robustness pass, seeded so a rerun prints the same table */
let seed=20260927; const rnd=()=>{seed=(seed*1103515245+12345)%2147483648; return seed/2147483648;};
const top=[0,0,0,0], N=10000;
for(let i=0;i<N;i++){
 const Wt=Object.fromEntries(who.map(k=>[k,W[k]*(0.5+rnd())]));
 const S=Object.fromEntries(who.map(k=>[k,J[k].map(x=>{let s=x[0]; if(rnd()<0.3)s+=rnd()<0.5?-1:1; return Math.max(0,Math.min(4,s));})]));
 const t=total(S,Wt); top[t.indexOf(Math.max(...t))]++;}

console.log('\nMEASURED, off the built files');
for(const k in MEASURED)console.log('  '+k.padEnd(42)+MEASURED[k].map(String).map(s=>s.padEnd(22)).join(''));
console.log('\nJUDGEMENT, 0 to 4, panel weight and grid level beside each name');
console.log('  '+''.padEnd(22)+M.map(m=>m.padEnd(10)).join(''));
who.forEach(k=>console.log('  '+(k+' w'+W[k]+' L'+LEVEL[k]).padEnd(22)+J[k].map(x=>String(x[0]).padEnd(10)).join('')));
console.log('  '+'weighted mean'.padEnd(22)+base.map(x=>x.toFixed(2).padEnd(10)).join(''));
console.log('  '+'lowest single score'.padEnd(22)+floor.map(x=>String(x).padEnd(10)).join(''));
console.log('\nROBUSTNESS, '+N+' perturbed runs, share on top');
console.log('  '+M.map((m,i)=>m+' '+(top[i]/N*100).toFixed(1)+'%').join('   '));
console.log('\nREASONS');
who.forEach(k=>J[k].forEach((x,i)=>console.log('  '+k.padEnd(7)+M[i].padEnd(9)+x[1])));
