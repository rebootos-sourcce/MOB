/* Path simulation. Generates stories from the app's own vocabulary and checks
   the invariants that would catch the path being an artifact of scan order,
   of punctuation, or of nothing at all. Run from the repo root. */
const E=require(require('path').resolve(process.env.ENGINE||'engine.js'));
const {parseStory,LEX,ADJ2CHG,PHRASES,SEATXY,compute,S,CHILD,buildSoul}=E;

/* a seeded generator, so a failure is reproducible from its seed alone */
let SEED=(+(process.argv[3]||20260916))>>>0;
/* mulberry32. the first generator here was a 32 bit LCG whose low bits cycled,
   so the same handful of stories kept coming back and the corpus was far
   smaller than the story count claimed. */
const rnd=()=>{SEED=(SEED+0x6D2B79F5)>>>0;let t=SEED;
 t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61);
 return ((t^(t>>>14))>>>0)/4294967296;};
const pick=a=>a[Math.floor(rnd()*a.length)];

const CHARGED=Object.keys(LEX).filter(w=>LEX[w][0]!=='coherent');
const CALM   =Object.keys(LEX).filter(w=>LEX[w][0]==='coherent');
const ADJ    =Object.keys(ADJ2CHG);
const PHR    =PHRASES.flatMap(r=>r[0]);
/* single word entries only, for the tests that reorder a sentence */
const SOLO   =CHARGED.filter(w=>!w.includes(' ')).concat(ADJ.filter(w=>!w.includes(' ')));
const FILL   =['i','was','then','and','it','the','a','of','all','just','about',
               'that','when','she','he','they','my','me','to','so','very'];

const story=n=>{const out=[];
 for(let i=0;i<n;i++){const r=rnd();
  out.push(r<0.30?pick(CHARGED):r<0.45?pick(ADJ):r<0.52?pick(CALM)
          :r<0.58?pick(PHR):pick(FILL));}
 return out.join(' ');};

let P=0,F=0; const fails=[];
const ok=(c,m,ctx)=>{if(c)P++;else{F++;if(fails.length<12)fails.push(m+(ctx?'\n        '+ctx:''));}};
const route=p=>p.steps.filter(s=>s.seat).map(s=>s.word+'>'+s.seats.join('+')).join(' ');
const sig=p=>JSON.stringify([route(p),p.span,p.net,p.dwell,p.start,p.end,p.kink,p.floor]);

/* 0 the sniffer underneath. the path is only as honest as what it records. */
{
 const LEXW=Object.keys(LEX);
 let pair=null;
 PHRASES.forEach(r=>r[0].forEach(ph=>{ if(pair)return;
  const w=LEXW.find(w=>(' '+ph+' ').includes(' '+w+' ')); if(w)pair={ph,w};}));
 ok(!!pair,'there is a phrase that contains a lexicon word');
 if(pair){
  const h=E.scanStory('i felt '+pair.ph+' afterwards');
  ok(!h.some(x=>x.kind==='word'&&x.t===pair.w),'the idiom still outranks its own words');
  ok(h.some(x=>x.kind==='phrase'&&x.t===pair.ph),'and the idiom itself matches');}
 /* every single word entry must land, whatever it follows. the suppression
    window used to over claim by one character, so a third of them did not. */
 const solo=LEXW.filter(w=>!w.includes(' '));
 let slots=0,got=0;
 for(let i=0;i<600;i++){
  const n=3+Math.floor(rnd()*8),a=[];
  for(let k=0;k<n;k++)a.push(pick(solo));
  slots+=n; got+=E.scanStory(a.join(' ')).filter(x=>x.kind==='word').length;}
 ok(got===slots,'no single word entry is swallowed by its neighbour',got+' of '+slots);
}

const N=+(process.argv[2]||4000);
console.log('simulating '+N+' stories, seed '+SEED+'\n');

/* a baseline field, so the one-to-one check has something to compare */
S.doms=[0];S.arcs=[0,1];S.roots=[];buildSoul();
CHILD.forEach(c=>{S.charge[c.nm]=4;S.replace[c.nm]=0;});
const BASE=JSON.stringify(compute());

const seats=new Set(), dwells={}, kinks={}, dirs={down:0,up:0,level:0};
let located=0, empty=0;

for(let i=0;i<N;i++){
 const txt=story(3+Math.floor(rnd()*22));
 const p=parseStory(txt).path;

 /* 1 determinism */
 ok(sig(p)===sig(parseStory(txt).path),'determinism',txt);

 /* 2 punctuation and case are not signal */
 const loud=txt.toUpperCase().split(' ').join(',  ')+'!!!';
 ok(route(p)===route(parseStory(loud).path),'case and punctuation invariance',txt);

 /* 3 filler must not move the route. padding goes on the ends: 124 of the
       phrases are multi word, so interleaving would split them, and that is
       the lexicon working rather than the path failing. */
 ok(route(p)===route(parseStory('zzq qqz '+txt+' zzq qqz').path),
    'unknown words at the ends do not move the route',txt);

 /* 4 geometry cannot lie about itself */
 ok(p.span>=Math.abs(p.net)-1e-9,'span is at least the net displacement',txt);
 /* several steps can sit at one seat, and that is a real reading: the charge
    never left. span is zero when the route never reaches a second seat. */
 const distinct=new Set(p.steps.filter(s=>s.seat).map(s=>s.seat)).size;
 ok((distinct<2)===(p.span===0),'span is zero exactly when the route never leaves one seat',txt);
 ok(distinct<2||p.span>0,'two seats are always some distance apart',txt);
 ok(p.drop>=0&&p.rise<=0,'drop is downward and rise is upward',txt);
 ok(p.steps.every(s=>!s.seat||(SEATXY[s.seat]&&s.x===SEATXY[s.seat].x)),'every step sits on a measured seat',txt);
 ok(p.scored<=p.located&&p.located<=p.steps.length,'scored within located within steps',txt);
 ok(!p.steps.some(s=>Number.isNaN(s.x)||Number.isNaN(s.amt)),'no NaN in any step',txt);
 ok((p.kink===null)===(p.scored===0),'a kink exists exactly when something is scored',txt);
 if(p.kink)ok(p.kink.amt>=p.floor.amt,'the kink is not below the floor',txt);

 /* 5 the path is order aware. that is the whole point of keeping it. The
       sentence is built from single word entries only, so reversing it cannot
       break a phrase and the only thing that changed is the order. */
 const solo=[];for(let k=0;k<2+Math.floor(rnd()*6);k++)solo.push(pick(SOLO));
 const f=parseStory(solo.join(' ')).path;
 const rev=parseStory(solo.slice().reverse().join(' ')).path;
 ok(rev.located===f.located,'reversal keeps every located step',solo.join(' '));
 if(f.located>=2){
  ok(rev.start===f.end&&rev.end===f.start,'reversing the sentence reverses the route',solo.join(' '));
  ok(Math.abs(rev.net+f.net)<1e-6,'and flips the direction',solo.join(' '));
  ok(Math.abs(rev.span-f.span)<1e-6,'while the distance travelled is the same',solo.join(' '));
  if(f.start!==f.end)
   ok(route(rev)!==route(f),'a different order is a different route',solo.join(' '));}

 /* 6 composition. two sentences joined route as the first then the second. */
 const b=story(6), pb=parseStory(b).path;
 const j=parseStory(txt+' zzq '+b).path;   /* an unknown word so no phrase bridges the seam */
 ok(route(j)===((route(p)+' '+route(pb)).trim().replace(/\s+/g,' ')),'joined stories concatenate',txt+'  ||  '+b);

 /* 7 one to one. the path must not touch a single existing number. */
 if(i%200===0) ok(JSON.stringify(compute())===BASE,'the path moves no number in the app',txt);

 p.steps.forEach(s=>{if(s.seat)seats.add(s.seat);});
 if(p.located){located++;dwells[p.dwell]=(dwells[p.dwell]||0)+1;
  if(p.kink)kinks[p.kink.seat]=(kinks[p.kink.seat]||0)+1;
  dirs[p.net>0.5?'down':p.net<-0.5?'up':'level']++;}
 else empty++;
}

console.log('coverage');
console.log('  stories with a route   '+located+'  ('+Math.round(located/N*100)+'%)');
console.log('  stories with none      '+empty);
console.log('  seats reached          '+[...seats].sort().join(' '));
console.log('  dwell distribution     '+JSON.stringify(dwells));
console.log('  kink seat distribution '+JSON.stringify(kinks));
console.log('  direction              '+JSON.stringify(dirs));
console.log('\n'+(F?fails.map(f=>'  FAIL  '+f).join('\n')+'\n':'')+
 '===== '+P+' passed, '+F+' failed =====');
process.exit(F?1:0);
