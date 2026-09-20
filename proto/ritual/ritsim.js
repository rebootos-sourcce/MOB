/* ============================================================
   THE RITUAL PAGE AGAINST THE THOUSAND.

   "Simulate this with the ICPs. We want frictionless, and we want the most
   effective flow. Our highest percent success rate for organisation, for user
   performance, and user data and information, and aesthetics."

   WHAT THIS IS NOT. It does not report a conversion rate, a retention lift or
   a satisfaction score for the new layout. Nothing in this repository can
   measure those from a page that nobody has used, and a conversion rate
   invented by a simulation is not evidence. losssim.js already models
   retention and its numbers are its own.

   WHAT THIS IS. Four questions the panel can actually answer, because each
   one is a fact about the record a person arrives with and the rows the
   engine deals them, and both of those are measured rather than assumed.

     1  HOW MUCH RECORD each of the thousand has when they open the page,
        from losssim.js, which is the same walk ritdata.js already draws.

     2  WHICH REGIONS CAN SPEAK to that person, region by region, against the
        floor each one declares on the page itself. A region that refuses is
        counted as refusing rather than as working, because a page that reads
        well only for a person with ninety days is a page that reads well for
        almost nobody.

     3  HOW MANY RITUALS they end up with, bounded rather than guessed. The
        floor is what stands without a person taking anything, the ceiling is
        that plus everything the reading proposes, and what the surface shows
        between the two is the band cap. Nothing here models a take rate,
        because no measurement of one exists.

     4  WHAT THE RING ACTUALLY CARRIES, which is the one that found something.

   Run:  node proto/ritual/ritsim.js
   ============================================================ */
const path=require('path'), fs=require('fs');
const SIM=require(path.resolve(__dirname,'losssim.js'));
const RIT=JSON.parse(fs.readFileSync(path.resolve(__dirname,'rit.json'),'utf8'));

const N=1000;
const BANDCAP=2;      /* the surface's own cap, read here so the two agree */

/* ---------- 1. THE THOUSAND WALKS ---------- */
const all=[];
SIM.runSim('final',{all:all});
if(all.length!==N)
 throw new Error('the panel came back as '+all.length+' people, not '+N
  +'. Every share below would be against the wrong denominator.');

/* every panel name must have a profile, or a share is computed over a subset
   while being printed as a share of the thousand. */
const missing=[...new Set(all.map(p=>p.nm))].filter(n=>!RIT.profiles[n]);
if(missing.length)
 throw new Error('no extracted profile for '+missing.join(', ')
  +'. ritdata.js WHO and losssim.js PANEL have to name the same people.');

const pct=n=>(100*n/N).toFixed(1)+'%';
const q=(a,f)=>{const s=a.slice().sort((x,y)=>x-y);
 return s[Math.min(s.length-1,Math.floor(f*s.length))];};
const days=all.map(p=>p.days);

console.log('\n============================================================');
console.log('THE RITUAL PAGE AGAINST THE THOUSAND');
console.log('============================================================');
console.log('\n1. HOW MUCH RECORD THEY ARRIVE WITH');
console.log('   Out of losssim.js, one walk per panel member, ninety days of');
console.log('   simulated time. The page reads this record and nothing else.');
console.log('     median      '+q(days,0.5)+' days');
console.log('     p25 / p75   '+q(days,0.25)+' / '+q(days,0.75)+' days');
console.log('     p90 / max   '+q(days,0.90)+' / '+Math.max(...days)+' days');
console.log('     mean        '+(days.reduce((a,b)=>a+b,0)/N).toFixed(1)+' days');

/* ---------- 2. WHICH REGIONS CAN SPEAK ----------
   Every floor below is the number the page itself declares and refuses at.
   They are not chosen here. */
const FLOOR=[
 {k:'the five figures',      need:1,  where:'the row at the top',
  why:'active and recurring read off what is set and need no record at all. '
   +'Streak, kept and missed need one day.'},
 {k:'the week strip',        need:7,  where:'the record',
  why:'seven boxes, and a day before the record starts is drawn empty and '
   +'counts as nothing'},
 {k:'the record grid',       need:28, where:'the record',
  why:'below this it is a run of boxes with no weekday axis, which is the '
   +'same object without an axis it cannot carry'},
 {k:'by weekday',            need:28, where:'the record',
  why:'a weekday needs four of itself before its rate says anything'},
 {k:'the summary, day',      need:0,  where:'the summary',
  why:'it reads what is set for today, so it speaks on day one'},
 {k:'the summary, week',     need:7,  where:'the summary',
  why:'a week reads at seven days'},
 {k:'the summary, month',    need:56, where:'the summary',
  why:'four weeks against the four before it'}];

console.log('\n2. WHICH REGIONS CAN SAY ANYTHING, AGAINST THE PAGE’S OWN FLOORS');
console.log('   A region below its floor does not go blank. It prints what it is');
console.log('   waiting for and how far off it is. That is still a region that');
console.log('   cannot answer the question it is there to answer.');
console.log('   region              floor   speaks       refuses');
FLOOR.forEach(f=>{
 const ok=days.filter(d=>d>=f.need).length;
 console.log('   '+f.k.padEnd(20)+String(f.need).padStart(3)+'d   '
  +(pct(ok)+' ('+ok+')').padEnd(14)+pct(N-ok)+' ('+(N-ok)+')');});

const full=days.filter(d=>d>=56).length;
const none=days.filter(d=>d<7).length;
console.log('\n   So '+pct(full)+' of the thousand see every region speak, and');
console.log('   '+pct(none)+' see four of the seven refuse at once. The median');
console.log('   person, at '+q(days,0.5)+' days, sees '
 +FLOOR.filter(f=>q(days,0.5)>=f.need).length+' of the seven speak.');

/* ---------- 3. HOW MANY RITUALS ---------- */
console.log('\n3. HOW MANY RITUALS A PERSON ENDS UP WITH');
console.log('   Three numbers, and none of them is a take rate, because nothing');
console.log('   here measures one. The floor is what stands the moment the page');
console.log('   opens. The ceiling is that plus every row the reading proposes.');
console.log('   Shown is what the surface draws, which is the floor plus the band');
console.log('   cap of '+BANDCAP+' an offer a band.');
const rows=[];
Object.keys(RIT.profiles).forEach(nm=>{
 const o=RIT.profiles[nm];
 const w=all.filter(p=>p.nm===nm).length;
 if(!w)return;
 const standing=o.called?1:0;
 const byKind={hold:0,change:0,release:0};
 o.queue.forEach(x=>{byKind[x.kind]++;});
 const shown=standing+Object.values(byKind)
   .reduce((a,n)=>a+Math.min(BANDCAP,n),0);
 /* what lands on a weekday, which is what the week strip and the session
    count are drawn from. A release runs when called and Build the avatar
    happens once, so neither takes a box. */
 const onWeek=o.queue.filter(x=>x.kind!=='release'&&x.unit!=='once').length;
 rows.push({nm,w,standing,ceiling:standing+o.queue.length,shown,
  onWeek:standing+Math.min(BANDCAP,byKind.hold)+Math.min(BANDCAP,byKind.change),
  queue:o.queue.length, releasable:o.releasableN, recur:onWeek});});
rows.sort((a,b)=>b.w-a.w);
console.log('   person     of 1000   floor   shown   ceiling   land on a weekday');
rows.forEach(r=>console.log('   '+r.nm.padEnd(10)+String(r.w).padStart(5)
 +String(r.standing).padStart(9)+String(r.shown).padStart(8)
 +String(r.ceiling).padStart(10)+String(r.onWeek).padStart(14)));
const wsum=(f)=>rows.reduce((a,r)=>a+f(r)*r.w,0)/N;
console.log('   weighted mean  floor '+wsum(r=>r.standing).toFixed(2)
 +'   shown '+wsum(r=>r.shown).toFixed(2)
 +'   ceiling '+wsum(r=>r.ceiling).toFixed(2)
 +'   on a weekday '+wsum(r=>r.onWeek).toFixed(2));

/* the release band, which is the one that can be empty on the surface */
const relEmpty=rows.filter(r=>r.releasable===0).reduce((a,r)=>a+r.w,0);
console.log('\n   The release band is empty for '+pct(relEmpty)+' of the thousand,');
console.log('   because nothing they carry is above the line release opens at.');
console.log('   That is the one region on the page that is empty rather than');
console.log('   waiting, and it is empty because the reading says so.');

/* ---------- 4. WHAT THE RING CARRIES ---------- */
console.log('\n4. WHAT THE DOTTED RING ACTUALLY CARRIES, AND THE ONE FINDING');
const gen={}, genN={};
Object.keys(RIT.profiles).forEach(nm=>{
 const w=all.filter(p=>p.nm===nm).length;
 RIT.profiles[nm].queue.forEach(x=>{
  const n=x.shape==='stance'?'a dot ring, no count until a day tests it'
   :(x.unit==='once'?'1 dash':((x.target===undefined?1:x.target)+' dash'
     +((x.target===undefined?1:x.target)===1?'':'es')));
  gen[n]=(gen[n]||0)+1; genN[n]=(genN[n]||0)+w;});});
Object.entries(gen).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>
 console.log('   '+String(v).padStart(3)+' generated rows  '+k));
const lib={};
RIT.lib.forEach(x=>{
 const n=x.shape==='stance'?'a dot ring, no count until a day tests it'
  :(x.shape==='window'?'1 dash'
    :(x.target===null?'a dot ring, no target set yet'
      :x.target+' dashes'));
 lib[n]=(lib[n]||0)+1;});
console.log('   and his own library:');
Object.entries(lib).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>
 console.log('   '+String(v).padStart(3)+' library rows    '+k));

const oneDash=Object.entries(gen).filter(([k])=>k==='1 dash')
 .reduce((a,[,v])=>a+v,0);
const genTotal=Object.values(gen).reduce((a,b)=>a+b,0);
console.log('\n   THE FINDING. '+oneDash+' of the '+genTotal+' rows the engine');
console.log('   generates carry a target of one, so their ring is a single dash');
console.log('   for every one of the thousand. The counts that make his idea');
console.log('   visible, ten dashes and eight and five and two, exist only in the');
console.log('   nine he named himself. The ring is built and correct and it is');
console.log('   drawing a parameter the generator does not yet vary.');

/* ---------- 5. THE SESSION ---------- */
console.log('\n5. THE SESSION, WHICH IS WHAT THE DASHES ADD UP TO');
console.log('   His words: how many you are actually supposed to do in the');
console.log('   session. On a weekday that is the rituals set on that day, and');
console.log('   each of their rings carries its own count.');
const sess=rows.map(r=>({nm:r.nm,w:r.w,lo:r.standing,hi:r.onWeek}));
console.log('   taking nothing      '+wsum(r=>r.standing).toFixed(2)
 +' rituals on a weekday, weighted');
console.log('   taking what is shown '+wsum(r=>r.onWeek).toFixed(2)
 +' rituals on a weekday, weighted');
console.log('   the spread is '+Math.min(...sess.map(s=>s.lo))+' to '
 +Math.max(...sess.map(s=>s.hi))+' across the nine, so a week box is cut into');
console.log('   at most '+Math.max(...sess.map(s=>s.hi))+' bars and the strip stays readable.');

console.log('\n   WORKING MEMORY. The page was measured in the browser at 13');
console.log('   simultaneous choices at 1600 and at 390, counting the week as one');
console.log('   object and the three way summary as one, which is how a person');
console.log('   treats them. Against a working memory of about four that is still');
console.log('   over, and it is three more than the four cards, the two verbs, the');
console.log('   profile and the journal can be reduced to without losing a verb.');

console.log('\n============================================================\n');
