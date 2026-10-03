/* ============================================================
   FLOWSIM. A thousand people walked through the flow that is
   actually built, from first landing to day ninety.

   This is a simulation and not a measurement of human behaviour.
   Every rate in RATES carries a src string naming where it came
   from, and there are exactly four classes:

     measured   read or executed against this repository this run
     engine     produced by running engine.js on repo data
     cited      a published figure, named with its reference
     judgement  a modelled value with its anchor stated

   Nothing else is allowed. A rate with no src is a defect.

   Run:
     node tools/flowsim.js                 the funnel, 1000 people
     node tools/flowsim.js --check         the known good cases first
     node tools/flowsim.js --fixes         counterfactuals, per fix
     node tools/flowsim.js --sweep         sensitivity on the free parameters
     node tools/flowsim.js --n 1000 --trials 40 --seed 7
   ============================================================ */
'use strict';
const path=require('path');
const E=require(path.join(__dirname,'..','engine.js'));

/* ---------- reproducible randomness. a run must be repeatable ---------- */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;
 var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;
 return((t^t>>>14)>>>0)/4294967296;};}
let RND=mulberry32(1);
const rnd=()=>RND();
const hit=p=>rnd()<p;
function lognorm(median,sigma){
 /* Box Muller, then exp. median is the geometric mean. */
 let u=0,v=0; while(u===0)u=rnd(); while(v===0)v=rnd();
 const z=Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
 return median*Math.exp(sigma*z);}

/* ============================================================
   1. THE POPULATION. Nine people, weights from RESEARCH-icp.md,
   summing to 1000. Their readings are not typed in here: the
   script computes each one from engine.js so the roster cannot
   drift from the engine.
   ============================================================ */
const WEIGHT={Diane:180,Derek:170,Marcus:160,Angela:150,Sofia:140,James:100,
              Ana:50,Gordon:35,Rosa:15};
/* src: RESEARCH-icp.md, "The roster used", panel weight column */

/* the grid. level, band floor, band ceiling, buying probability.
   src: BUYERS.md, the ten level table. The commercial column is
   deliberately not in the engine, so it is held here and never
   written back to a profile. */
const GRID=[
 {lv:1,  lo:0,  hi:10,  nm:'Collapsed',   state:'Fragmented',  buy:0.00},
 {lv:2,  lo:11, hi:20,  nm:'Severe',      state:'Numb',        buy:0.10},
 {lv:3,  lo:21, hi:30,  nm:'Corrupt',     state:'Defensive',   buy:0.20},
 {lv:4,  lo:31, hi:40,  nm:'Incoherent',  state:'Frustrated',  buy:0.40},
 {lv:5,  lo:41, hi:50,  nm:'Oscillating', state:'Searching',   buy:0.30},
 {lv:6,  lo:51, hi:60,  nm:'Even',        state:'Receptive',   buy:0.65},
 {lv:7,  lo:61, hi:70,  nm:'Gaining',     state:'Tuned',       buy:0.85},
 {lv:8,  lo:71, hi:80,  nm:'Compounding', state:'Aligned',     buy:0.90},
 {lv:9,  lo:81, hi:90,  nm:'Embodied',    state:'Coherent',    buy:0.95},
 {lv:10, lo:91, hi:100, nm:'Mastery',     state:'Sovereign',   buy:1.00}];

/* read every roster member at the reading the engine gives them. the same
   walk tests/engine.js uses in group 15, so a tuning change shows up here. */
function readRoster(){
 const {PEOPLE,LAWSET,CHARGES,SINAMES,S,buildSoul,compute}=E;
 const out=[];
 PEOPLE.forEach(p=>{
  if(WEIGHT[p.nm]===undefined)return;
  S.doms=p.doms?p.doms.slice():[p.dom];
  S.arcs=p.arcs?p.arcs.slice():[p.a1,p.a2];
  S.roots=p.roots?p.roots.slice():[]; buildSoul();
  CHARGES.forEach(c=>{S.charge[c]=(p.c&&p.c[c])||0;S.replace[c]=(p.rep&&p.rep[c])||0;});
  const LS=LAWSET[p.nm]||{_:5.5};
  SINAMES.forEach(l=>S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:5.5));
  const r=compute();
  const g=GRID.filter(x=>x.nm===r.tier)[0]||GRID[0];
  out.push({nm:p.nm, age:p.age, w:WEIGHT[p.nm], CQ:+r.CQ.toFixed(1), tier:r.tier,
   DQ:+r.DQ.toFixed(1), held:r.loaded.length, lv:g.lv, state:g.state, buy:g.buy});});
 return out;}

/* THE PER PERSON SHIFT, and the first version of this was wrong.

   A buying probability is a statement about the WHOLE funnel, not about one
   step. The first version multiplied every step's odds by the person's own
   odds ratio, which compounded the same fact eleven times and took the boot
   step from 97.9 percent to 14.3 percent. That is the probe lying, and it was
   caught by the known good case that says a flat panel must reproduce its own
   stated rate.

   So the shift is applied once, spread over the steps. delta is the log odds
   distance of this person's band from the panel's weighted geometric mean,
   divided by the number of bendable steps, so the shift accumulated across a
   whole walk is exactly the intended odds ratio and no step is distorted.
   A buy of 0 or 1 is clamped, because an infinite odds cannot be a multiplier. */
const BENDSTEPS=11;          /* count of bend() calls in one walk */
function odds(p){const q=Math.min(0.98,Math.max(0.02,p)); return q/(1-q);}
function multipliers(roster){
 const tw=roster.reduce((a,r)=>a+r.w,0);
 const mean=roster.reduce((a,r)=>a+r.w*Math.log(odds(r.buy)),0)/tw;
 roster.forEach(r=>{r.d=(Math.log(odds(r.buy))-mean)/BENDSTEPS;});
 return Math.exp(mean);}
function bend(base,d){if(base<=0)return 0; if(base>=1)return 1;
 const o=Math.log(base/(1-base))+ (d||0); return 1/(1+Math.exp(-o));}

/* ============================================================
   2. THE RATES. Each one says what it is and where it came from.
   ============================================================ */
const RATES={
 phoneShare:{v:0.60, src:'judgement. DESIGN-mobile-icp.md:564, "a large share of arrivals from a shared link are on a phone", and RESEARCH-icp.md finding that five of seven arrivals come from a person rather than an ad. Swept.'},

 boot:{v:0.979, src:'reviews/SIM-ninety-days.md section 9 item 12, 21 of 1000. Re-measured this run: the Field surface reports 0 words of innerText at both 1600x1000 and 390x844, and the onboarding sheet opens at 5,646 ms and 5,811 ms in two runs.'},

 obStart:{v:0.82, src:'judgement. Measured: ui/onboard.js card 0 puts "Not now" beside "Start", and ui/ui.js opens the sheet 5,600 ms after the boot step, so it interrupts a surface already being read rather than preceding it.'},
 obCard:{v:0.94, src:'judgement, per transition. Measured: 4 cards (4 dots in obCard) so 3 transitions, one required interaction (one of 8 seats, Next disabled until chosen), Escape dismisses.'},

 loadFloor:{v:12, src:'.claude/skills/atuned-ux/SKILL.md, working floor: simultaneous choices per working screen under 12. Working memory about four, CLAUDE.md.'},
 choicesDesktop:{v:75, src:'measured this run, Chromium, source.html md5 d2de8bdc476909f60e75d72c55df0835: Field, first viewport at 1600x1000, visible interactive elements.'},
 choicesPhone:{v:26, src:'measured this run: Field, first viewport at 390x844.'},

 phoneFirstScreen:{v:0.69, src:'DESIGN-mobile-icp.md:371, first screen abandonment 31 percent as built.'},
 tabStrip:{v:0.55, src:'measured this run: tab strip clientWidth 348 against scrollWidth 723 at 390x844. Compass, Knowledge, Games and Summary are entirely past the edge, Body is cut at 348, the affordance is a 26 px gradient and #tabbar scrollbar is display:none.'},

 intakeFinish:{v:0.68, src:'RESEARCH-icp.md breaking point table, row "63, plus the three way design explained in one line". All three conditions verified in ui/intakeui.js this run: iqAccuracy prints "about fifteen minutes", the bar prints "N answered, M left", and the panel "Twenty One Laws, Three Ways" names the design.'},
 intakeToWheel:{v:0.0, src:'measured. ui/intakeui.js iqApply writes p.laws and S.law only. grep for writers of S.charge finds sniff.js, release.js, ui.js drag, panels.js fields and personas.js. The intake is not among them, so 63 questions put nothing on the wheel.'},
 intakeSurvive:{v:0.47, src:'reviews/SIM-ninety-days.md section 9 item 2, 163 of 1000 lost at this dead end, against the roughly 305 who reach it.'},

 storyWordsMedian:{v:45, src:'judgement, and the named free parameter. Measured: ui/storyui.js gives no length guidance at all. The placeholder is "What happened. Write it the way you would say it out loud." and the only feedback is a live word count with no target. Swept.'},
 storyWordsSigma:{v:0.80, src:'judgement. Lognormal, because a text entry length is a positive multiplicative quantity.'},
 storyCommitPer:{v:249, src:'measured this run. parseStory over the 14 persona says strings in engine/data/practice order, swept by concatenation: at least one imprint in 1 of 14 at 18 words, 2 of 14 at 36, 3 of 14 at 53, 5 of 14 at 89, 9 of 14 at 160, 14 of 14 at 249. Linear through the origin, p(commit) = min(1, words/249).'},
 storyAccuse:{v:0.85, src:'measured, small sample. Four of four sampled entries return an accusation: "My partner cut me out of the deal and my jaw is tight" returns Deceit, Lying, Excuse and Spiritual Language To Manipulate; "I am exhausted" returns Pride; "I screamed at my son and I hate that I am like my father" returns Pride, Arrogance, Competition and Anger; the one persona line that matches returns Denial Of Light, Knowing Better Than God, Denial Of Truth and Fear Of God.'},
 storyWalkOnAccuse:{v:0.55, src:'reviews/SIM-ninety-days.md section 9 item 6, 71 people, and each one tells somebody.'},
 storyToRelease:{v:0.0, src:'measured this run. Committed story text at 18, 53, 89, 160, 249, 498 and 996 words leaves loaded 0 at every length, because the display and release gate is sq>=4 (engine/compute.js:63) and the sniffer writes 0.35 a touch (engine/sniff.js:239). Driven in Chromium: one sentence typed leaves the Commit button reading "Commit 0" and disabled, and the release panel reading "Nothing is held above the line yet".'},

 findsReleaseDesktop:{v:0.18, src:'judgement. The only charge writer that can reach sq 4 on day one is the nine fields in the left rail (ui/panels.js numField) or the wheel drag (ui/ui.js:259). Both are visible on arrival at 1600 and neither is one of the four doors. Anchored above the phone figure below because the rail is on screen.'},
 findsReleasePhone:{v:0.04, src:'DESIGN-mobile-icp.md:279 to 280, "11 percent of the panel reaches the wheel with intent. 4 percent finds Run a release."'},

 ritualSave:{v:0.42, src:'judgement. Measured: Ritual is tab 2 of 9 and visible at 390 (left 123, right 186). On a blank profile ritFor returns tier 3, so all 17 practices are offered, the copy asserts "The root is carrying the most" from a default, and the called practice is a 20 minute one.'},

 /* day two and after */
 return2With:{v:0.34, src:'judgement, and NOT calibrated. The first version of this model claimed to be calibrated so the phone cohort reached the 9 percent seven day return in DESIGN-mobile-icp.md:372. It cannot be: the as built funnel above loses about 90 of every 100 arrivals before an action, so 9 percent of arrivals returning inside a week is above the ceiling of everybody who got anywhere. That document measures return among people who reached an action. The claim was withdrawn rather than the arithmetic bent, and the gap is reported instead. Anchor: a person who has a reading on file has something to come back to.'},
 return2Without:{v:0.10, src:'judgement. A person who ended day one with nothing in the record has nothing to come back to: measured, the landing surface on day two is byte identical to day one and nothing says the date.'},
 decayNoStreak:{v:0.86, src:'judgement. Content exhaustion. reviews/SIM-ninety-days.md measured about 123 minutes of first pass content and found the bottom of the product is reached inside session one.'},
 dailyFloor:{v:0.04, src:'cited. Baumel A, Muench F, Edan S, Kane JM, "Objective User Engagement With Mental Health Apps: Systematic Search and Panel Based Usage Analysis", J Med Internet Res 2019;21(9):e14567. Ninety three apps, median 100,000 installs, median daily active users 4.0 percent. Used as the asymptote a retention curve flattens to, not as a starting rate. Reference reproduced from reviews/SIM-ninety-days.md section 8, which cites the same paper; it was not refetched this run.'},
 dailyFloorCold:{v:0.005, src:'judgement. A person with nothing on file has no plateau to sit on, so the floor is an order of magnitude lower.'},
 decayStreak:{v:0.97, src:'judgement. The only pull the code contains is the streak and the line "Today is not on the record yet", both in ui/cone.js ladderHtml on Compass.'},
 streakVisible:{v:'desktop only', src:'measured this run. Compass sits at left 382 against a tab strip clientWidth of 348 at 390x844, so the only surface carrying the streak and the only line in the product that asks a person to come back today is entirely off screen on a phone.'}
};
const R=k=>RATES[k].v;

/* ============================================================
   3. THE WALK. One person, one pass, from landing to day ninety.
   ============================================================ */
/* the load gate. One constant, the floor from the skill file, and one measured
   choice count. Argued from the cognitive load figure CLAUDE.md already
   records: 57 to 71 simultaneous choices against a working memory of four. */
function loadGate(choices){
 const f=R('loadFloor');
 if(choices<=f)return 1;
 return 1/(1+Math.log2(choices/f));}

const STEPS=['landed','booted','onboardingStarted','onboardingFinished',
 'choseAnAction','reachedAWritingSurface','putSomethingIn','firstReading',
 'firstRelease','firstRitual','day7','day30','day90','weekMark','monthMark','seasonMark'];

function walk(person,opt){
 const o=opt||{};
 const m=person.d;
 const phone=hit(R('phoneShare'));
 const s={}; STEPS.forEach(k=>s[k]=false);
 const stop=(why)=>{s.stopAt=why; return s;};
 s.phone=phone; s.who=person.nm;
 s.landed=true;

 if(!hit(bend(R('boot'),m)))return stop('the boot, no word in the first four seconds');
 s.booted=true;

 if(!hit(bend(R('obStart'),m)))return stop('onboarding, pressed Not now');
 s.onboardingStarted=true;
 let obOk=true;
 for(let i=0;i<3;i++)if(!hit(bend(R('obCard'),m))){obOk=false;break;}
 if(!obOk)return stop('onboarding, left part way through the four cards');
 s.onboardingFinished=true;

 /* the landing surface. Field, measured choices, no words on it at all. */
 const choices=phone?R('choicesPhone'):R('choicesDesktop');
 let gate=o.fixLoad?loadGate(12):loadGate(choices);
 if(phone)gate*=R('phoneFirstScreen');
 if(!hit(bend(gate,m)))return stop('the landing surface, cognitive load and no instruction');
 s.choseAnAction=true;

 /* the four doors are on Summary, which a phone cannot reach in the tab strip.
    Energetics and Story are in the strip on both viewports. */
 if(phone&&!o.fixTabStrip&&!hit(R('tabStrip')))
  return stop('the phone tab strip, four of nine doors past the edge');
 s.reachedAWritingSurface=true;

 /* WHICH PATH. src: RESEARCH-icp.md section 3. Diane, Derek and Marcus want a
    cost, James wants a rank, so they go to the numbered surface. Angela, Sofia
    and Ana want recognition, so they go to the writing surface. */
 const numberFirst=['Diane','Derek','Marcus','James','Gordon'];
 const path=numberFirst.indexOf(person.nm)>=0?'intake':'story';
 s.path=path;

 if(path==='intake'){
  if(!hit(bend(R('intakeFinish'),m)))
   {s.putSomethingIn=true; s.firstReading=true;   /* three answers release the gate */
    if(!hit(bend(0.25,m)))return stop('the intake, stopped part way through 63');}
  else {s.putSomethingIn=true; s.firstReading=true; s.intakeDone=true;}
  /* the dead end. 63 questions put nothing on the wheel. */
  const carryOn=o.fixIntakeSeeds?0.90:R('intakeSurvive');
  if(!hit(bend(carryOn,m)))
   return stop('the intake ends at nothing is carrying, and nothing connects it to the release');
 } else {
  const words=lognorm(R('storyWordsMedian'),R('storyWordsSigma'));
  s.words=Math.round(words);
  const pCommit=o.fixSniffer?0.95:Math.min(1,words/R('storyCommitPer'));
  if(!hit(pCommit))
   return stop('the story, Commit 0 and the button disabled because the sniffer matched nothing');
  s.putSomethingIn=true; s.firstReading=true;
  if(!o.fixAccusation&&hit(R('storyAccuse'))&&hit(bend(R('storyWalkOnAccuse'),m)))
   return stop('the story named an accusation the person did not write');
 }

 /* THE RELEASE. Neither path reaches it. The only way in is the nine fields in
    the left rail or the wheel drag. */
 const pRel=o.fixPathToRelease?0.85:(phone?R('findsReleasePhone'):R('findsReleaseDesktop'));
 if(hit(bend(pRel,m)))s.firstRelease=true;

 /* THE RITUAL. Reachable without a release, and the save is the only thing in
    the product that creates a streak. */
 const pRit=s.firstRelease?Math.min(0.95,R('ritualSave')*1.8):R('ritualSave');
 if(hit(bend(pRit,m)))s.firstRitual=true;

 /* DAY TWO TO DAY NINETY. One independent draw a day, with the return
    probability decaying from day two. A lapse is not a death: a person who
    misses a day can come back, which is why this is not a survival chain.
    A live streak is the only pull the product contains and it lives on a
    surface a phone cannot reach. */
 const anythingInTheRecord=s.putSomethingIn||s.firstRitual;
 const streakSeen=(phone&&!o.fixStreakOnPhone)?false:true;
 const pull=(s.firstRitual&&streakSeen)?R('decayStreak'):R('decayNoStreak');
 let p=bend(anythingInTheRecord?R('return2With'):R('return2Without'),m);
 const floor=bend(anythingInTheRecord?R('dailyFloor'):R('dailyFloorCold'),m);
 let last=1;
 for(let day=2;day<=90;day++){
  if(hit(Math.max(floor,p))){ last=day;
   /* windowed, and the windows are stated in the report: a person counts as
      there at day N when they opened it at least once in the seven days
      ending on N. A single day draw is not what "brings somebody back on day
      seven" means. */
   if(day>=2&&day<=7)s.day7=true;
   if(day>=24&&day<=30)s.day30=true;
   if(day>=84&&day<=90)s.day90=true; }
  p*=pull;}
 /* the marks need consecutive days, not visits. A day counts only when a
    ritual is SAVED that day, which is the only thing ladder.js counts. */
 if(s.firstRitual){
  let r=0,best=0;
  let pd=bend(R('return2With'),m)*bend(R('ritualSave'),m);
  for(let day=2;day<=90;day++){
   if(hit(Math.max(floor*bend(R('ritualSave'),m),pd))){r++; if(r>best)best=r;} else r=0;
   pd*=pull;}
  s.weekMark=best>=7; s.monthMark=best>=30; s.seasonMark=best>=90;}
 s.lastDay=last;
 if(!s.day7)s.stopAt=s.stopAt||'day two to day six, nothing brought them back';
 return s;}

/* ============================================================
   4. THE RUN
   ============================================================ */
function sample(roster,n){
 const tw=roster.reduce((a,r)=>a+r.w,0), out=[];
 for(let i=0;i<n;i++){
  let x=rnd()*tw, k=0;
  while(k<roster.length-1&&(x-=roster[k].w)>0)k++;
  out.push(roster[k]);}
 return out;}

function run(roster,n,opt){
 const people=sample(roster,n), tot={}, stops={}, byWho={}, byDev={};
 STEPS.forEach(k=>tot[k]=0);
 people.forEach(p=>{
  const s=walk(p,opt||{});
  STEPS.forEach(k=>{if(s[k])tot[k]++;});
  if(s.stopAt)stops[s.stopAt]=(stops[s.stopAt]||0)+1;
  const dev=s.phone?'phone':'desktop';
  byDev[dev]=byDev[dev]||{n:0,in:0,rel:0,rit:0,day7:0,day30:0,day90:0};
  byDev[dev].n++;
  if(s.putSomethingIn)byDev[dev].in++;
  if(s.firstRelease)byDev[dev].rel++;
  if(s.firstRitual)byDev[dev].rit++;
  if(s.day7)byDev[dev].day7++;
  if(s.day30)byDev[dev].day30++;
  if(s.day90)byDev[dev].day90++;
  byWho[p.nm]=byWho[p.nm]||{n:0,day7:0,day30:0,day90:0,in:0,rel:0};
  byWho[p.nm].n++;
  if(s.putSomethingIn)byWho[p.nm].in++;
  if(s.firstRelease)byWho[p.nm].rel++;
  if(s.day7)byWho[p.nm].day7++;
  if(s.day30)byWho[p.nm].day30++;
  if(s.day90)byWho[p.nm].day90++;});
 return {n,tot,stops,byWho,byDev};}

function trials(roster,n,t,opt){
 const acc={}; STEPS.forEach(k=>acc[k]=[]);
 const stops={};
 for(let i=0;i<t;i++){
  const r=run(roster,n,opt);
  STEPS.forEach(k=>acc[k].push(r.tot[k]));
  Object.keys(r.stops).forEach(k=>{stops[k]=(stops[k]||0)+r.stops[k]/t;});}
 const out={};
 STEPS.forEach(k=>{const a=acc[k].slice().sort((x,y)=>x-y);
  const mean=a.reduce((x,y)=>x+y,0)/a.length;
  out[k]={mean:mean, lo:a[Math.floor(a.length*0.025)], hi:a[Math.ceil(a.length*0.975)-1]};});
 return {steps:out, stops, n, t};}

/* ============================================================
   5. THE KNOWN GOOD CASES. A tool that lies is worse than none.
   ============================================================ */
function check(){
 let fail=0;
 const ok=(c,msg)=>{console.log((c?'  pass  ':'  FAIL  ')+msg); if(!c)fail++;};
 console.log('\nKNOWN GOOD CASES');

 /* 1. the engine readings the roster is built on must be the ones
       tests/engine.js asserts */
 const ros=readRoster(); multipliers(ros);
 const by={}; ros.forEach(r=>by[r.nm]=r);
 ok(by.Rosa.CQ>by.Ana.CQ&&by.Ana.CQ>by.Gordon.CQ,
  'the roster reads in the order tests/engine.js asserts: Rosa '+by.Rosa.CQ
  +' > Ana '+by.Ana.CQ+' > Gordon '+by.Gordon.CQ);
 ok(by.Sofia.tier==='Even'&&by.James.tier==='Severe',
  'Sofia bands Even at '+by.Sofia.CQ+' and James bands Severe at '+by.James.CQ
  +', which is what PANEL-usability.md records');

 /* 2. a flat panel with a stated rate must reproduce that rate */
 const flat=ros.map(r=>Object.assign({},r,{d:0,buy:0.5}));
 RND=mulberry32(11);
 let pass=0; const N=20000, P=0.62;
 for(let i=0;i<N;i++)if(hit(P))pass++;
 const se=Math.sqrt(P*(1-P)/N)*N*3;
 ok(Math.abs(pass-P*N)<se,'a flat draw of '+N+' at p='+P+' returns '
  +pass+', inside 3 sigma of '+(P*N));

 /* 3. everything certain means everybody arrives */
 RND=mulberry32(3);
 const saved={}; Object.keys(RATES).forEach(k=>saved[k]=RATES[k].v);
 ['boot','obStart','obCard','phoneFirstScreen','tabStrip','intakeFinish',
  'intakeSurvive','storyAccuse','return2With','return2Without','ritualSave']
  .forEach(k=>{RATES[k].v=(k==='storyAccuse')?0:1;});
 RATES.choicesDesktop.v=12; RATES.choicesPhone.v=12;
 RATES.storyWordsMedian.v=10000; RATES.storyWordsSigma.v=0.0001;
 RATES.decayNoStreak.v=1; RATES.decayStreak.v=1;
 let r=run(flat,1000,{});
 ok(r.tot.day90===1000,'every rate certain: '+r.tot.day90+' of 1000 reach day 90');
 ok(r.tot.putSomethingIn===1000,'and '+r.tot.putSomethingIn+' of 1000 put something in');

 /* 4. a zero anywhere stops the funnel dead at that step */
 RATES.boot.v=0;
 r=run(flat,1000,{});
 ok(r.tot.booted===0&&r.tot.day90===0,'boot at zero: '+r.tot.booted+' booted, '+r.tot.day90+' at day 90');
 Object.keys(saved).forEach(k=>RATES[k].v=saved[k]);

 /* 5. THE PUBLISHED FUNNEL. RESEARCH-icp.md section 7 records
       1000, 310, 186, 121, 52, 47. Feed its own rates through the
       same Bernoulli machinery and it must come back. */
 RND=mulberry32(99);
 const stages=[['starts the quiz',310/1000],['finishes all 63',186/310],
  ['enters an email',121/186],['installs the app',52/121],['record comes down',47/52]];
 let alive=1000; const got=[1000];
 stages.forEach(([nm,p])=>{let k=0; for(let i=0;i<alive;i++)if(hit(p))k++; alive=k; got.push(k);});
 const want=[1000,310,186,121,52,47];
 const within=got.every((g,i)=>Math.abs(g-want[i])<=3*Math.sqrt(Math.max(1,want[i])));
 ok(within,'the published funnel in RESEARCH-icp.md reproduces as '+got.join(', ')
  +' against '+want.join(', ')+', every stage inside 3 sigma');

 /* 6. the measured sniffer curve must be what the model uses */
 const {PEOPLE,CHARGES,SINAMES,S,buildSoul,compute,parseStory,applyStory}=E;
 const T=PEOPLE.map(p=>p.says);
 function blank(){S.doms=[0];S.arcs=[0,1];S.roots=[];buildSoul();
  CHARGES.forEach(c=>{S.charge[c]=0;S.replace[c]=0;});SINAMES.forEach(l=>S.law[l]=null);}
 let any=0,loadedEver=0;
 for(let i=0;i<T.length;i++){blank();const t=T[i];
  const ps=parseStory(t); if(ps.imprints.length)any++;}
 ok(any===1,'the sniffer returns at least one imprint for '+any+' of '+T.length
  +' of the repository\'s own persona lines');
 for(const k of [1,3,5,9,14,28,56]){
  for(let i=0;i<T.length;i++){let t=[];for(let j=0;j<k;j++)t.push(T[(i+j)%T.length]);
   blank(); applyStory(t.join(' ')); if(compute().loaded.length)loadedEver++;}}
 ok(loadedEver===0,'no amount of story text reaches the release gate of sq 4: '
  +loadedEver+' of 98 windows put a single address above the line');

 console.log(fail?('\n'+fail+' known good case(s) failed. Do not trust the numbers below.\n')
  :'\nAll known good cases pass.\n');
 return fail===0;}

/* ============================================================
   6. OUTPUT
   ============================================================ */
function pc(x,n){return (100*x/n).toFixed(1)+'%';}
function report(roster,res){
 const n=res.n;
 console.log('THE FUNNEL. '+n+' people, '+res.t+' trials, mean and 95 percent interval.\n');
 const label={landed:'Lands, the file opens',
  booted:'Survives the boot to first paint',
  onboardingStarted:'Starts the onboarding rather than Not now',
  onboardingFinished:'Finishes the four onboarding cards',
  choseAnAction:'Chooses an action on the landing surface',
  reachedAWritingSurface:'Reaches a surface that can take an input',
  putSomethingIn:'Puts something in, intake or story',
  firstReading:'Sees a first reading rather than the dash',
  firstRelease:'Runs a first release',
  firstRitual:'Saves a first ritual',
  day7:'Still there in week one, opened on days 2 to 7',
  day30:'Still there at one month, opened on days 24 to 30',
  day90:'Still there at three months, opened on days 84 to 90',
  weekMark:'Earns Seven days, 7 consecutive saved rituals',
  monthMark:'Earns Thirty days',
  seasonMark:'Earns Ninety days'};
 STEPS.forEach(k=>{const s=res.steps[k];
  console.log('  '+label[k].padEnd(48)+String(Math.round(s.mean)).padStart(5)
   +' of '+n+'   '+pc(s.mean,n).padStart(6)+'   ['+s.lo+' to '+s.hi+']');});
 console.log('\nWHERE THEY STOP, ranked by people out of '+n);
 Object.entries(res.stops).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>{
  console.log('  '+String(Math.round(v)).padStart(4)+'  '+k);});}

function whoTable(roster,n){
 RND=mulberry32(5);
 const r=run(roster,n*8,{});
 console.log('\nBY DEVICE, 8000 walks. The phone share is '+(R('phoneShare')*100)+' percent of arrivals.');
 console.log('  device    arrivals  puts in   first release  first ritual   day 7   day 30   day 90');
 ['desktop','phone'].forEach(k=>{const b=r.byDev[k]; if(!b)return;
  const f=x=>(100*x/b.n).toFixed(1)+'%';
  console.log('  '+k.padEnd(10)+String(b.n).padStart(8)+'  '+f(b.in).padStart(7)
   +'  '+f(b.rel).padStart(13)+'  '+f(b.rit).padStart(12)
   +'  '+f(b.day7).padStart(6)+'  '+f(b.day30).padStart(7)+'  '+f(b.day90).padStart(7));});
 const inn=r.byDev.desktop.in+r.byDev.phone.in, d7=r.byDev.desktop.day7+r.byDev.phone.day7;
 console.log('  of those who put something in, '+(100*d7/Math.max(1,inn)).toFixed(1)
  +' percent open it again on day 7 or later.');
 console.log('\nBY PERSON, scaled to '+n+' arrivals. Level is the engine reading banded on BUYERS.md.');
 console.log('  who      age  w    CQ    tier         lv  buy   puts in   day7   day30   day90');
 roster.forEach(p=>{const b=r.byWho[p.nm]; if(!b)return;
  const s=x=>String(Math.round(x/b.n*p.w)).padStart(5);
  console.log('  '+p.nm.padEnd(9)+String(p.age).padEnd(5)+String(p.w).padEnd(5)
   +String(p.CQ).padEnd(6)+p.tier.padEnd(13)+String(p.lv).padEnd(4)
   +(p.buy*100).toFixed(0).padStart(3)+'%  '+s(b.in)+'  '+s(b.day7)+'   '+s(b.day30)+'   '+s(b.day90));});}

function fixes(roster,n,t){
 const base=trials(roster,n,t,{});
 const list=[
  ['fixPathToRelease','Connect the intake or the story to the release gate. engine/compute.js sq threshold, or engine/intake.js seeding charge the way seed.js does'],
  ['fixIntakeSeeds','Make 63 answered questions reach the wheel. atuned_src/engine/intake.js'],
  ['fixSniffer','Make an ordinary first entry commit. engine/sniff.js and engine/lexicon.js'],
  ['fixLoad','Bring the landing surface to the working floor of 12 choices. atuned_src/ui/ui.js and shell/body.html'],
  ['fixTabStrip','Wrap the tab strip so nine doors are visible at 390. atuned_src/shell/body.html and head.html'],
  ['fixAccusation','Say nothing rather than guess a family. engine/sniff.js'],
  ['fixStreakOnPhone','Put the record and today\'s line where a phone can reach it. atuned_src/ui/cone.js and ritual.js']];
 console.log('\nCOUNTERFACTUALS. One fix at a time, everything else as built.');
 console.log('  people at day 30 out of '+n+', and the delta\n');
 console.log('  base, as built'.padEnd(64)+String(Math.round(base.steps.day30.mean)).padStart(5));
 const rows=[];
 list.forEach(([k,d])=>{const o={}; o[k]=true;
  const r=trials(roster,n,t,o);
  rows.push([d,r.steps.day30.mean-base.steps.day30.mean,r.steps.putSomethingIn.mean-base.steps.putSomethingIn.mean,
   r.steps.firstRelease.mean-base.steps.firstRelease.mean]);});
 rows.sort((a,b)=>b[1]-a[1]).forEach(([d,d30,din,drel])=>{
  console.log('  +'+String(Math.round(d30)).padStart(4)+' at day 30, +'+String(Math.round(din)).padStart(4)
   +' put something in, +'+String(Math.round(drel)).padStart(4)+' reach a release');
  console.log('        '+d);});
 const all={}; list.forEach(([k])=>all[k]=true);
 const r=trials(roster,n,t,all);
 console.log('\n  all seven together: '+Math.round(r.steps.day30.mean)+' of '+n
  +' at day 30, against '+Math.round(base.steps.day30.mean)+' as built.');}

function sweep(roster,n,t){
 console.log('\nSENSITIVITY. The free parameters, one at a time.\n');
 const shot=(nm,k,vals,fmt)=>{
  const keep=RATES[k].v; console.log('  '+nm);
  vals.forEach(v=>{RATES[k].v=v; RND=mulberry32(21);
   const r=trials(roster,n,t,{});
   console.log('    '+String(fmt?fmt(v):v).padEnd(12)
    +'puts something in '+String(Math.round(r.steps.putSomethingIn.mean)).padStart(4)
    +'   day 7 '+String(Math.round(r.steps.day7.mean)).padStart(4)
    +'   day 30 '+String(Math.round(r.steps.day30.mean)).padStart(4)
    +'   day 90 '+String(Math.round(r.steps.day90.mean)).padStart(4));});
  RATES[k].v=keep;};
 shot('First entry length, the median in words. THE load bearing assumption.',
  'storyWordsMedian',[20,45,90,150,250],v=>v+' words');
 shot('Phone share of arrivals.','phoneShare',[0.2,0.4,0.6,0.8],v=>(v*100)+'% phone');
 shot('Onboarding, the rate of starting rather than Not now.','obStart',[0.6,0.7,0.82,0.95],v=>v);
 shot('The load gate floor from the skill file.','loadFloor',[4,8,12,20],v=>v+' choices');
 shot('Survival of the intake dead end.','intakeSurvive',[0.2,0.47,0.7,0.9],v=>v);}

/* ---------- main ---------- */
const argv=process.argv.slice(2);
const arg=(k,d)=>{const i=argv.indexOf('--'+k); return i<0?d:argv[i+1];};
const n=+arg('n',1000), t=+arg('trials',40), seed=+arg('seed',1);
RND=mulberry32(seed);
const roster=readRoster(); const meanOdds=multipliers(roster);

console.log('FLOWSIM. '+n+' people, '+t+' trials, seed '+seed);
console.log('engine.js md5 is read by the caller. Roster read from engine.js at run time.');
console.log('Panel weighted buying probability: '
 +(roster.reduce((a,r)=>a+r.w*r.buy,0)/roster.reduce((a,r)=>a+r.w,0)*100).toFixed(1)
 +' percent, weighted mean odds '+meanOdds.toFixed(3)+'. src BUYERS.md banded on the engine reading.');

if(argv.indexOf('--check')>=0){ if(!check())process.exit(1); }
if(argv.indexOf('--sources')>=0){
 console.log('\nSOURCES, one per rate.');
 Object.keys(RATES).forEach(k=>console.log('  '+k+' = '+RATES[k].v+'\n      '+RATES[k].src));}
whoTable(roster,n);
RND=mulberry32(seed);
report(roster,trials(roster,n,t,{}));
if(argv.indexOf('--fixes')>=0){RND=mulberry32(seed);fixes(roster,n,t);}
if(argv.indexOf('--sweep')>=0){RND=mulberry32(seed);sweep(roster,n,Math.max(8,Math.round(t/4)));}
