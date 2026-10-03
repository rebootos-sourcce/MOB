#!/usr/bin/env node
/* ============================================================
   arc90.js

   NINETY DAYS, FROM THE STORYBOARD TO DAY 90, FOR THE PROJECT'S OWN ICPs.

   Ordered in TASKS.md FO, his words: "let's set up a simulation with the ICPs
   and the focus group. Let's have them start ninety days from the app, from
   onboarding, all the way through to ninety days, and let's find all the
   friction spots. I know we don't have our tutorial in our onboarding yet, but
   let's just kind of use what we have, there's a storyboard, see if it helps
   them understand purpose of the tool."

   Evidence for RESEARCH-90day.md. Not a gate. Run once, from the repo root:

     node proto/ninety/arc90.js
     node proto/ninety/arc90.js --walk proto/ninety/walk-11830df.jsonl
     node proto/ninety/arc90.js --walk proto/ninety/walk-11830df.jsonl --clock wall

   The clock is simulated by default since 27 September; --clock wall is the
   first run's harness, kept so that run can be reproduced. See THE CLOCK below.

   WHAT THIS FILE WRITES NO ARITHMETIC OF ITS OWN FOR. Four layers, and each
   says which kind of number it prints.

     A. ONBOARDING. The storyboard's own copy, read out of
        proto/firstrun/storyboard.html at run time, checked for the three
        clauses RESEARCH-icp.md section 4 found land with the widest spread of
        the panel (where the charge sits, what holding it costs, the release),
        and each ICP's first line put through the shipped sniffer to see which
        storyboard frame they would actually meet. The copy and the sniffer are
        MEASURED. Which clause an ICP needs is JUDGEMENT, quoted from their own
        recorded words.

     B. THE RETENTION ARC. proto/ritual/losssim.js, required as a module and not
        edited, is the day 1 to 90 model this project already maintains. Its
        own validation is run first as a child process, and if it fails this
        section is suppressed. Every number in B is a MODEL calibrated to an
        earlier simulation (reviews/simulation-quarter.md 6.3), not an observed
        person. It is the best the project has and it is not evidence of what a
        stranger will do.

     C. THE ENGINE ARC. The shipped engine.js, driven day by day along the exact
        practice days losssim.js deals the most engaged member of each ICP (its
        exported TRACE, the longest walk), and again along every day for ninety
        days as the ceiling. Every story, charge, reading, gift balance, mark
        and streak is a call into the engine and is MEASURED. The one lifted
        piece is the charge write inside ui/release.js relCoolDown, eight lines,
        which is DOM bound; the lift is asserted against its source below and
        refuses to run if the constants moved. The assumption that joins B to C
        is JUDGEMENT and is stated once: a kept day is one turn of the loop,
        one story, one release over the three heaviest addresses above the line
        if any, and the practice the build calls for.

     D. THE FIRST RUN, re-measured. With --walk, the output of
        proto/firstrun/walk.js on a build of this commit is read and its
        numbers are printed beside the ones RESEARCH-firstrun.md reported on 26
        September. MEASURED in real Chromium.

   Nothing here decides whether a person comes back on day 14. That is
   retention psychology this project has not measured, and B is a model of it,
   not a measurement of it.
   ============================================================ */
'use strict';
const path=require('path'), fs=require('fs'), cp=require('child_process'), vm=require('vm');
const ROOT=path.resolve(__dirname,'../..');
const rel=f=>path.join(ROOT,f);

/* ------------------------------------------------------------
   THE CLOCK. Added 27 September, after the first run was found to be
   measuring the harness and not the product.

   The engine stamps time on its own: meterRun writes meter.giftAt and
   meter.last with new Date(), meterFirst and snapshot likewise, and
   meterBudget(p) with no second argument counts free weeks up to Date.now().
   This file walks ninety days in a few real seconds, so on the wall clock the
   gift is stamped in the real present and every later budget is read in that
   same present: no free week can ever open, and the allowance reads nought for
   good whatever the engine would do on day 31.

   --clock sim (the default) installs the simulated clock from
   proto/gamification-timeline/extract.js, unchanged in technique: a Date
   subclass whose no argument constructor and Date.now() return the simulated
   moment, installed before engine.js is required, and every meterBudget call
   below is handed that moment. Day 0 is the same 1 September 2026, 07:00 UTC,
   and a day's turn is at 08:00, as extract.js has it.

   --clock wall reproduces the first run's harness exactly: no Date is
   replaced, the day stamps are counted back from the real present, and the
   now handed to meterBudget is the real Date.now(), which is what the old
   argumentless call read anyway.
   ------------------------------------------------------------ */
const CLOCK=(function(){const i=process.argv.indexOf('--clock');
 const v=i>0?process.argv[i+1]:'sim';
 if(v!=='sim'&&v!=='wall'){console.log('--clock takes sim or wall, not '+v);process.exit(2);}
 return v;})();
const RealDate=Date; let SIM=null;
if(CLOCK==='sim'){
 class SimDate extends RealDate{
  constructor(...a){ if(a.length===0&&SIM!==null)super(SIM); else super(...a); }
  static now(){ return SIM!==null?SIM:RealDate.now(); }}
 global.Date=SimDate;}
const DAYMS=86400000;
const T0=RealDate.UTC(2026,8,1,7,0);

/* ------------------------------------------------------------
   0. PROVENANCE. What was measured, and whether it was clean.
   ------------------------------------------------------------ */
const sh=c=>{try{return cp.execSync(c,{cwd:ROOT,stdio:['ignore','pipe','ignore']}).toString().trim();}catch(e){return '';}};
const md5=f=>{try{return require('crypto').createHash('md5').update(fs.readFileSync(rel(f))).digest('hex');}catch(e){return 'absent';}};
const PROV={commit:sh('git rev-parse --short HEAD'),
 dirty:{engine:!!sh('git status --porcelain engine.js'),
  losssim:!!sh('git status --porcelain proto/ritual/losssim.js'),
  loopsim:!!sh('git status --porcelain tools/loopsim.js'),
  src:!!sh('git status --porcelain atuned_src')},
 md5:{engine:md5('engine.js'), losssim:md5('proto/ritual/losssim.js'),
  storyboard:md5('proto/firstrun/storyboard.html')},
 when:new RealDate().toISOString()};

const E=require(rel('engine.js'));
let MEM={}; E.bindStore(k=>MEM[k],(k,v)=>{MEM[k]=v;});
/* the gift's size. Exported as GIFT_N since b0eed95; before that it was a
   literal 100 in engine/plan.js, which is what an older engine is read at. */
const GIFT=(typeof E.GIFT_N==='number')?E.GIFT_N:100;
const {STORYBANK}=require(rel('sim/stories.js'));

/* losssim prints its source table when it is required. Hold the console while
   it loads so the report starts with this file's own header. */
const LOSS=(function(){const log=console.log; console.log=function(){};
 try{return require(rel('proto/ritual/losssim.js'));}finally{console.log=log;}})();

/* THE ICPs. The nine rows losssim.js carries, which are the nine in
   RESEARCH-icp.md at the weights that file gives. Read off the model's own
   run below rather than typed a second time; this list only fixes the order
   the report prints in. */
const ORDER=['Angela','Derek','James','Marcus','Sofia','Diane','Ana','Gordon','Rosa'];

/* ------------------------------------------------------------
   THE LIFT, AND THE GUARD ON IT. relCoolDown in ui/release.js writes the
   charge half of a release and it touches the DOM, so it cannot be required.
   These are its constants. If the source moves, this refuses to run rather
   than printing a release that no longer exists.
   ------------------------------------------------------------ */
const RSRC=fs.readFileSync(rel('atuned_src/ui/release.js'),'utf8');
const LIFTOK={take:/w0\*0\.21\+2/.test(RSRC), install:/share\*0\.62/.test(RSRC),
 meter:/meterRun\(CURP,RUN\.plan/.test(RSRC), lawlift:/releaseWork\(CURP,/.test(RSRC)};
const CHANM=/var CHAN=(\[[^;]*\]);/.exec(RSRC);
if(!CHANM||!Object.values(LIFTOK).every(Boolean)){
 console.log('ui/release.js no longer carries the arithmetic this file lifts: '+JSON.stringify(LIFTOK));
 console.log('Re-read relCoolDown and re-lift before trusting section C. Stopping.');
 process.exit(3);}
const CHAN=Function('return '+CHANM[1])();
const CHANS=CHAN.map(c=>c[0]+c[2]);

function releaseRun(p,ids){
 const q=ids.map(i=>E.BY[i]).filter(n=>n&&n.cf);
 if(!q.length)return {ran:false, why:'nothing picked'};
 const cap=E.meterBudget(p,Date.now()).cap;
 const plan=cap>0?E.meterPlan(p,q.map(n=>n.i),CHANS,cap):[];
 if(!plan.length)return {ran:false, why:'no allowance', cap:cap};
 /* relCoolDown, the charge half, verbatim in its arithmetic */
 q.forEach(n=>{const w0=n.sq*10, d=-Math.round(w0*0.21+2);
  const share=Math.abs(d)/10/Math.max(1,q.filter(x=>x.cf===n.cf).length);
  E.S.charge[n.cf]=E.clamp((E.S.charge[n.cf]||0)-share,0,10);
  E.S.replace[n.cf]=E.clamp((E.S.replace[n.cf]||0)+share*0.62,0,10);});
 /* and the engine's own two calls for the rest */
 const m=E.meterRun(p,plan);
 const lift=E.releaseWork(p,(m&&m.fresh)||[]);
 E.saveProfile(p); p.history.push(E.snapshot(p));
 return {ran:true, lines:plan.length, fresh:((m&&m.fresh)||[]).length, cq0:lift.cq0, cq1:lift.cq1};}

/* ============================================================
   A. ONBOARDING. The storyboard, read as a stranger reads it.
   ============================================================ */
function storyboardFrames(){
 const html=fs.readFileSync(rel('proto/firstrun/storyboard.html'),'utf8');
 const i=html.lastIndexOf('<script>'), j=html.lastIndexOf('</script>');
 let js=html.slice(i+8,j);
 /* the frames live in an IIFE. Expose the array before it is rendered. */
 js=js.replace("document.getElementById('frames').innerHTML=F.map","globalThis.__F=F;document.getElementById('frames').innerHTML=F.map");
 const stub={innerHTML:''};
 const ctx={globalThis:null, document:{getElementById:()=>stub}, Math:Math};
 ctx.globalThis=ctx; vm.createContext(ctx); vm.runInContext(js,ctx);
 const strip=s=>s.replace(/<svg[\s\S]*?<\/svg>/g,' ').replace(/<[^>]+>/g,' ')
  .replace(/&middot;/g,'.').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim();
 const frames=(ctx.__F||[]).map(f=>({id:f.id, nm:f.nm, says:strip(f.ph)}));
 /* Q3, the one question in the storyboard that is about purpose, both columns */
 const q3=[]; const t=html.slice(html.indexOf('<span class="num">Q3</span>'));
 const tb=t.slice(t.indexOf('<tbody>'),t.indexOf('</tbody>'));
 tb.replace(/<tr><td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td><\/tr>/g,(m,a,b,c)=>{q3.push({station:a,A:b,B:c});});
 return {frames, q3};}

/* THE CLAUSES. Three from RESEARCH-icp.md section 4: "The answer that lands across
   the widest spread of the panel is mechanical and short: it names where the
   charge is held, tells you what holding it costs, and gives you the
   sentences that release it, one address at a time." A fourth, return, is
   the loop's own last station. The word lists are JUDGEMENT and are printed
   with every match so a reader can disagree with a specific hit. */
const CLAUSE={
 where:/\b(body|in the body|seat|throat|root|landed here|place in the body|where it lives|where it sits)\b/i,
 cost:/\b(cost|costs|costing|paying|price|drag|over time)\b/i,
 release:/\b(release|releases|takes the charge off|let go|clear)\b/i,
 ret:/\b(come back|one day at a time|each day|ritual)\b/i,
 /* Ana's clause, and only hers: that the thing she is inside has an end.
    "come back" is the opposite claim, so it is its own clause. */
 end:/\b(an end|ends|far side|finished|finish|lighter|less to carry)\b/i};
const CLAUSENM={where:'where the charge sits', cost:'what holding it costs',
 release:'that a release takes it off', ret:'why come back', end:'that this has an end'};

/* WHAT EACH ICP SAID THEY NEED THE TOOL TO BE FOR. Quoted from
   RESEARCH-icp.md sections 3 and 4, which are themselves simulated. Mapped to
   clauses by judgement. */
const NEED={
 Angela:{q:'"Will it finally tell me why the same thing keeps happening ... None of them told me where it lives." (s4)', needs:['where']},
 Derek:{q:'"Name the one thing capping my output and where it sits." (s3)', needs:['where','cost']},
 James:{q:'"Help implies a deficit. Ask me instead what it improves." (s4)', needs:['cost']},
 Marcus:{q:'"Does it show me the mechanism. I do not need help, I need the schematic." (s4)', needs:['where','release']},
 Sofia:{q:'"Tell me what to run and how long it takes." (s4)', needs:['release','ret']},
 Diane:{q:'"A number and a cost ... what the 41 is costing me this quarter." (s3)', needs:['cost']},
 Ana:{q:'"Will it tell me this has an end. That is the only thing I am asking." (s4)', needs:['end']},
 Gordon:{q:'"There is nothing wrong with me." (s1) Refuses at the ad.', needs:[]},
 Rosa:{q:'"Help with what." (s4) Correctly not the customer.', needs:[]}};

function sectionA(){
 console.log('\n============================================================');
 console.log('A. ONBOARDING. Does the storyboard say what the tool is for.');
 console.log('============================================================');
 const {frames,q3}=storyboardFrames();
 if(!frames.length){console.log('  could not read the frames out of the storyboard. Section A skipped.');return null;}
 console.log('MEASURED. The person facing copy on each of the '+frames.length+' storyboard frames, read out of');
 console.log('proto/firstrun/storyboard.html (md5 '+PROV.md5.storyboard+'), tags and drawings stripped.\n');
 frames.forEach(f=>console.log('  '+f.id.padEnd(4)+f.nm.padEnd(20)+'"'+f.says.slice(0,150)+(f.says.length>150?' ...':'')+'"'));
 const hit=(txt,k)=>{const m=CLAUSE[k].exec(txt); return m?m[0]:null;};
 console.log('\nWhich of the clauses each frame carries (the matched word in brackets):');
 const carriedA={}; Object.keys(CLAUSE).forEach(k=>{carriedA[k]=[];});
 frames.forEach(f=>{const got=Object.keys(CLAUSE).map(k=>{const h=hit(f.says,k); if(h)carriedA[k].push(f.id); return h?k+'['+h+']':null;}).filter(Boolean);
  console.log('  '+f.id.padEnd(4)+(got.join('  ')||'none'));});
 console.log('\nQ3 in the storyboard is the purpose question. Column A is what is drawn, column B is the');
 console.log('alternative, "plus what it is for, one more line", and it is not drawn on any frame.');
 const carriedB={}; Object.keys(CLAUSE).forEach(k=>{carriedB[k]=[];});
 q3.forEach(r=>{Object.keys(CLAUSE).forEach(k=>{if(hit(r.B,k))carriedB[k].push(r.station);});
  console.log('  '+r.station.padEnd(9)+'B: "'+r.B+'"');});
 console.log('\nThe clauses, across the whole opening:');
 Object.keys(CLAUSE).forEach(k=>console.log('  '+CLAUSENM[k].padEnd(28)+'as drawn: '+(carriedA[k].join(', ')||'NONE').padEnd(22)
  +'with column B: '+(carriedA[k].concat(carriedB[k]).join(', ')||'NONE')));
 const has=(set,k)=>set[k].length>0;
 /* THE FIRST LINE EACH ICP WOULD WRITE AT discover. Their `says` line in
    engine/data/people.js, the repository's own voice for each of them, put
    through the shipped sniffer exactly as the storyboard's T1 would. */
 console.log('\nMEASURED. What discover (T1) and play (T2) would show each ICP. The storyboard\'s own T1 text');
 const T1=E.parseStory('My sister called again and I felt the old tightness in my chest. The same guilt, the same shame. I said yes when I meant no and then I was angry at myself all night.');
 console.log('lights '+T1.hits.length+' words and reads '+T1.imprints.length+' imprints through the same sniffer, which is the known good case.');
 console.log('Their first entry is the first line of their bank in sim/stories.js. The storyboard draws');
 console.log('"12 found, all under the line" and faint addresses. It has no frame for an entry that finds nothing.');
 console.log(['who','first entry: lit','imprints','over the line','bank lines reading nothing','says line lit','storyboard frame they meet'].join('\t'));
 const first={};
 ORDER.forEach(nm=>{
  const P=E.PEOPLE.find(x=>x.nm===nm), bank=(STORYBANK[nm]||[]).map(x=>x[1]);
  const p=E.blankProfile('You'); E.loadProfile(p);
  const t=bank[0]||P.says;
  const q=E.parseStory(t); E.applyStory(t); E.verpApply(t); E.leanApply(t);
  const r=E.compute();
  const dead=bank.filter(x=>!E.parseStory(x).imprints.length).length;
  const sq=E.parseStory(P.says);
  const frame=!q.imprints.length?'NONE: nothing is read, T1b has nothing to count'
   :(r.loaded.length?'T2 with a full address, flow runs for real'
   :'T1b and T2 as drawn: found, under the line, flow is practice');
  first[nm]={hits:q.hits.length, imprints:q.imprints.length, over:r.loaded.length, dead, bank:bank.length,
   saysHits:sq.hits.length, frame, text:t};
  console.log([nm,q.hits.length,q.imprints.length,r.loaded.length,dead+' of '+bank.length,sq.hits.length,frame].join('\t'));});
 console.log('\nTheir first entries, verbatim, so a reader can judge whether they are fair:');
 ORDER.forEach(nm=>console.log('  '+nm.padEnd(7)+'"'+first[nm].text+'"'));
 console.log('\nJUDGEMENT. Each ICP\'s stated need, against the clauses the opening carries.');
 const verdict={};
 ORDER.forEach(nm=>{const n=NEED[nm];
  const A=n.needs.filter(k=>has(carriedA,k)), B=n.needs.filter(k=>has(carriedA,k)||has(carriedB,k));
  verdict[nm]={needs:n.needs, asDrawn:A, withB:B};
  console.log('  '+nm.padEnd(7)+n.q);
  console.log('         needs: '+(n.needs.map(k=>CLAUSENM[k]).join(', ')||'nothing the opening can give')
   +'.  said as drawn: '+(A.length+' of '+n.needs.length)+'.  said with column B: '+(B.length+' of '+n.needs.length)+'.');});
 return {frames,q3,carriedA,carriedB,first,verdict};}

/* ============================================================
   B. THE RETENTION ARC. losssim.js, as it stands, validated first.
   ============================================================ */
const DAYS=[1,2,7,14,30,60,90];
const SEEDS=[20260920,11,222,3333,44444];
function lossValidate(){
 const r=cp.spawnSync(process.execPath,[rel('proto/ritual/losssim.js'),'--validate'],{cwd:ROOT,encoding:'utf8'});
 const out=(r.stdout||'')+(r.stderr||'');
 const ok=(out.match(/^\s+ok\s/mg)||[]).length, fail=(out.match(/^\s+FAIL\s/mg)||[]).length;
 return {ok, fail, code:r.status, fails:out.split('\n').filter(l=>/^\s+FAIL\s/.test(l))};}

function sectionB(){
 console.log('\n============================================================');
 console.log('B. THE RETENTION ARC. A MODEL, proto/ritual/losssim.js, unedited.');
 console.log('============================================================');
 const v=lossValidate();
 console.log('losssim.js --validate, run now: '+v.ok+' checks passed, '+v.fail+' failed, exit '+v.code+'.');
 if(v.fail||v.code!==0){v.fails.forEach(l=>console.log('  '+l.trim()));
  console.log('The model does not validate at this commit, so its arc is not reported. Section B suppressed.');
  return null;}
 console.log('Every figure below is people of the thousand losssim.js deals, mean of '+SEEDS.length+' seeds.');
 console.log('"built" is the build at this commit as losssim.js configures it. "final" is the designed loop,');
 console.log('not built. Neither is an observed person: the curve is calibrated to reviews/simulation-quarter.md 6.3.');
 const run=(cfg,opt)=>SEEDS.map(sd=>LOSS.runSim(cfg,Object.assign({seed:sd},opt||{})));
 const mean=(runs,f)=>runs.reduce((a,r)=>a+f(r),0)/runs.length;
 const B=run('built'), F=run('final');
 const W={}; ORDER.forEach(nm=>{W[nm]=B[0].meas[nm].w;});
 const res={W, rows:{}, exits:{}, plateau:{}, mech:{}};
 ['built','final'].forEach(k=>{const R=k==='built'?B:F;
  console.log('\n'+(k==='built'?'BUILT, the product today':'FINAL, the designed loop, not built')+'. Share of each ICP row still active.');
  console.log(['who','of'].concat(DAYS.map(d=>'d'+d)).join('\t'));
  ORDER.forEach(nm=>{const row=DAYS.map(d=>mean(R,r=>r.alive[nm][d])/W[nm]);
   res.rows[k+nm]=row;
   console.log([nm,W[nm]].concat(row.map(x=>(100*x).toFixed(1))).join('\t'));});
  const tot=DAYS.map(d=>mean(R,r=>r.total[d]));
  res.rows[k+'ALL']=tot.map(x=>x/1000);
  console.log(['all',1000].concat(tot.map(x=>(x/10).toFixed(1))).join('\t'));});

 /* WHEN THEY LEAVE. exitDay carries every exit with its day and whether a
    broken run was in it. Bucketed so the arc reads as a shape. */
 const BK=[[1,1,'day 1'],[2,2,'day 2'],[3,7,'days 3 to 7'],[8,14,'days 8 to 14'],[15,30,'days 15 to 30'],[31,60,'days 31 to 60'],[61,90,'days 61 to 90']];
 console.log('\nWHEN EACH ICP LEAVES, built. Share of the row leaving in each window, and how many of those');
 console.log('exits had a broken run in them.');
 console.log(['who'].concat(BK.map(b=>b[2])).concat(['still in at 90','broken run exits']).join('\t'));
 ORDER.forEach(nm=>{
  const cells=BK.map(([a,b])=>mean(B,r=>r.exitDay.filter(x=>x.nm===nm&&x.day>=a&&x.day<=b).length)/W[nm]);
  const broke=mean(B,r=>r.exitDay.filter(x=>x.nm===nm&&x.broke).length)/W[nm];
  const stay=mean(B,r=>r.alive[nm][90])/W[nm];
  res.exits[nm]={cells,broke,stay};
  console.log([nm].concat(cells.map(x=>(100*x).toFixed(1))).concat([(100*stay).toFixed(1),(100*broke).toFixed(1)]).join('\t'));});

 /* WHERE THE CURVE GOES FLAT. The first day after which fewer than half a
    percent of the row leaves on any day for seven days running. Flat is not
    good news on its own: it is either the people who stay, or nobody left to
    lose, and the column beside it says which. */
 console.log('\nWHERE THE CURVE FLATTENS, built. First day from which under 0.5 percent of the row leaves per day');
 console.log('for seven days running, and how many of the row are still in on that day.');
 ORDER.forEach(nm=>{
  const a=d=>mean(B,r=>r.alive[nm][d]);
  let flat=null;
  for(let d=2;d<=84&&flat===null;d++){let ok=true;
   for(let j=d;j<d+7;j++){if((a(j-1)-a(j))/W[nm]>=0.005){ok=false;break;}}
   if(ok)flat=d;}
  res.plateau[nm]={day:flat, left:flat?a(flat)/W[nm]:null};
  console.log('  '+nm.padEnd(7)+(flat?('day '+flat+', with '+(100*a(flat)/W[nm]).toFixed(1)+' percent of the row still in'):'never within ninety days'));});

 /* WHAT THE STORYBOARD'S OWN MECHANICS ARE WORTH IN THIS MODEL. Two of them
    are already terms in losssim.js: firstshow is "the first session ends by
    showing what landed", which is T1b, T2 and T5; ifthen is the When row, T4.
    Each priced by taking it out of the designed loop, which is the only way
    losssim.js exposes them. The storyboard's two other stations, play and
    flow, have no term in the model and are not priced. */
 console.log('\nTHE STORYBOARD\'S MECHANICS, AS losssim.js PRICES THEM. People of 1000 at day 30, mean of seeds.');
 const f30=mean(F,r=>r.total[30]), f7=mean(F,r=>r.total[7]), f90=mean(F,r=>r.total[90]);
 [['the first session shows nothing','T1b, T2, T5: the first session ends by showing what landed'],
  ['no if then plan','T4: the When row, a when and a where']].forEach(([cfg,what])=>{
  const R=run(cfg);
  const d7=f7-mean(R,r=>r.total[7]), d30=f30-mean(R,r=>r.total[30]), d90=f90-mean(R,r=>r.total[90]);
  res.mech[cfg]={d7,d30,d90};
  console.log('  '+what+'\n      worth '+d7.toFixed(1)+' at day 7, '+d30.toFixed(1)+' at day 30, '+d90.toFixed(1)+' at day 90.');});
 console.log('  The build today gives everybody the When row in losssim.js\'s "built" config. RESEARCH-firstrun.md');
 console.log('  measured that nothing in the first run leads a stranger to it. So "built" credits a plan the build');
 console.log('  does not help anybody make, and the when row line above is the size of that overstatement, read');
 console.log('  at the designed loop. This is the model disagreeing with the walk, and the walk is the measurement.');
 res.meas=B[0].meas;
 return res;}

/* ============================================================
   C. THE ENGINE ARC. The shipped engine, day by day.
   ============================================================ */
/* WHAT EACH PERSON WRITES. sim/stories.js is ordinary first person writing in
   each figure's voice, written before the lexicon was consulted, so it is the
   nearest thing the repository has to what they would type at discover. Their
   `says` line from engine/data/people.js closes the list: it is a signature,
   not an entry about this week, and section A reports it on its own. */
function textsFor(nm){
 const P=E.PEOPLE.find(x=>x.nm===nm);
 return (STORYBANK[nm]||[]).map(x=>x[1]).concat([P.says]);}

/* One ICP, along one sequence of days. seq[d-1] is 0 for a day not kept and
   1 or 2 for a kept day (2 is losssim's floor day, which "built" never deals).
   intake: the person's reference laws from LAWSET are their answers, as if
   the 63 were taken on day one. */
function drive(nm,seq,intake,called){
 if(CLOCK==='sim')SIM=T0;
 const p=E.blankProfile('You');
 if(intake){const LS=E.LAWSET[nm]||{};
  E.SINAMES.forEach(l=>{p.laws[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:null);});
  p.intake=p.intake||{}; p.intake.completedAt=new Date(0).toISOString();}
 E.loadProfile(p);
 const texts=textsFor(nm), now0=Date.now();
 const tOf=CLOCK==='sim'?(d=>T0+d*DAYMS+3600000):(d=>now0-(90-d)*DAYMS);
 const ev={readNothing:0, firstCarry:null, firstOver:null, firstRelease:null, giftGone:null,
  refusedLoaded:0, firstRefused:null, releases:0, stories:0, lastMarkDay:null, marksAt:{},
  /* AFTER THE GIFT, measured rather than asserted. giftDay is the first day
     the unique count reaches the gift's size, which is engine independent.
     giftStamp is what meterRun wrote into meter.giftAt, if this engine writes
     one, so the clock can be checked against the day it was written on.
     refills counts days the allowance rose after the gift was spent, which is
     the one thing "nothing starts a new week" says cannot happen. */
  giftDay:null, giftStamp:null, refills:0, relAfterGift:0, refusedAfterGift:0,
  sayAfterGift:null, sayAt:{}, leftAt:{}};
 const snaps={}; let turns=0; const seenMark={}; let prevLeft=null;
 const cq0=E.compute().CQ;
 const r0=E.compute();
 const firstShown={cq:Math.round(r0.CQ), ex:Math.round(r0.EX)};
 for(let d=1;d<=seq.length;d++){
  if(CLOCK==='sim')SIM=tOf(d);
  const kept=seq[d-1]>0;
  const spentBefore=ev.giftDay!==null;
  /* A REFILL IS READ AT THE START OF THE DAY, before the turn. Read at the end
     of it, a week that opens and is spent by that same day's release never
     shows: the first cut of this probe reported Derek refilled 0 while he ran
     10 releases after the gift, which cannot both be true. */
  if(spentBefore&&prevLeft!==null&&E.meterBudget(p,Date.now()).left>prevLeft)ev.refills++;
  if(kept){turns++;
   if(seq[d-1]===1){
    const t=texts[(ev.stories)%texts.length]; ev.stories++;
    const q=E.parseStory(t);
    if(!q.imprints.length)ev.readNothing++;
    E.applyStory(t); E.verpApply(t); E.leanApply(t);
    p.story.entries.push({t:new Date(tOf(d)).toISOString(),text:t});
    E.saveProfile(p); p.history.push(E.snapshot(p));
    let r=E.compute();
    if(r.carrying.length&&ev.firstCarry===null)ev.firstCarry=d;
    if(r.loaded.length&&ev.firstOver===null)ev.firstOver=d;
    const live=r.loaded.slice().sort((a,b)=>b.sq-a.sq);
    if(live.length){
     const rr=releaseRun(p,live.slice(0,3).map(n=>n.i));
     if(rr.ran){ev.releases++; if(ev.firstRelease===null)ev.firstRelease=d; if(spentBefore)ev.relAfterGift++;}
     else{ev.refusedLoaded++; if(ev.firstRefused===null)ev.firstRefused=d; if(spentBefore)ev.refusedAfterGift++;}}}
   p.rituals.push({t:new Date(tOf(d)).toISOString(),track:'',band:'',steps:[called.k],
    min:+called.min||5,when:'',where:'',done:true});
   E.saveProfile(p);}
  const bud=E.meterBudget(p,Date.now());
  if(bud.left<=0&&ev.giftGone===null)ev.giftGone=d;
  const uniq=((p.meter&&p.meter.unique)||[]).length;
  if(ev.giftDay===null&&uniq>=GIFT){ev.giftDay=d;
   ev.giftStamp=(p.meter&&p.meter.giftAt)||null;
   /* THE CLOCK CHECKS ITSELF. Under the simulated clock the stamp the engine
      wrote on its own must fall on the simulated day. If it does not, the
      Date was not replaced before the engine read it, every week count below
      is the wall clock's, and the run stops rather than print it. */
   if(CLOCK==='sim'&&ev.giftStamp&&String(ev.giftStamp).slice(0,10)!==new RealDate(tOf(d)).toISOString().slice(0,10)){
    console.log('CLOCK NOT HELD: '+nm+' spent the gift on walk day '+d+' ('+new RealDate(tOf(d)).toISOString().slice(0,10)
     +') and the engine stamped meter.giftAt '+ev.giftStamp+'. Stopping.');
    process.exit(4);}}
  if(ev.giftDay!==null){
   if(ev.sayAfterGift===null&&d>ev.giftDay)ev.sayAfterGift=bud.allow?bud.allow.say:'';}
  if(DAYS.indexOf(d)>=0){ev.sayAt[d]=bud.allow?bud.allow.say:''; ev.leftAt[d]=bud.left;}
  prevLeft=bud.left;
  /* a mark is new the first day its key is earned. Tracked by key, because
     earned[] is in MARKS order and a slice by count reads a mark earned in the
     middle of the list as the one at the end of it. */
  const L=E.ladderRead(p,tOf(d));
  const fresh=L.earned.filter(m=>!seenMark[m.k]);
  if(fresh.length){fresh.forEach(m=>{seenMark[m.k]=d;}); ev.lastMarkDay=d; ev.marksAt[d]=fresh.map(m=>m.nm);}
  if(DAYS.indexOf(d)>=0||d===seq.length){const r=E.compute();
   snaps[d]={turns, cq:r.CQ, ex:r.EX, dq:r.DQ, over:r.loaded.length, carry:r.carrying.length,
    left:E.meterBudget(p,Date.now()).left, marks:L.earned.length, streak:E.streakRead(p,tOf(d)).best,
    tier:r.tier||'no word'};}}
 const rN=E.compute();
 SIM=null;
 return {ev, snaps, days:seq.length, turns, cq0, cqN:rN.CQ, firstShown,
  lastShown:{cq:Math.round(rN.CQ), ex:Math.round(rN.EX)}, exN:rN.EX,
  marks:E.ladderRead(p,tOf(seq.length)).earned.map(m=>m.nm)};}

function sectionC(B){
 console.log('\n============================================================');
 console.log('C. THE ENGINE ARC. engine.js md5 '+PROV.md5.engine+', driven day by day.');
 console.log('============================================================');
 console.log('Two walks per ICP. TRACE is losssim.js\'s longest walk for that ICP on "built", seed 20260920:');
 console.log('the most engaged member of the row, the person the product has to serve at its fullest, and');
 console.log('"how rare" says so. EVERY DAY is the ceiling: a turn of the loop on each of ninety days.');
 console.log('Each walk twice: with no intake (every law unanswered, which is today\'s default), and with the');
 console.log('person\'s reference laws answered on day one. A kept day is one turn: a story from their own');
 console.log('bank (sim/stories.js in order, then their `says` line, cycling), a release over the three heaviest');
 console.log('addresses above the line if any, and the practice ritFor calls for. That join is JUDGEMENT.\n');
 /* WHAT THE ALLOWANCE SAYS THE DAY AFTER THE GIFT. Read off the engine on a
    blank profile, and beside it the same call with the plan's base unset,
    which is the default engine/plan.js describes ("it defaults to the end of
    the gift"). */
 const bp=E.blankProfile('You');
 const aft=E.planAllowance(bp.plan,GIFT), aftNull=E.planAllowance(Object.assign({},bp.plan,{base:null}),GIFT);
 console.log('CLOCK: '+(CLOCK==='sim'
  ?'simulated. Day 0 is '+new RealDate(T0).toISOString().slice(0,16)+'Z, a turn is at 08:00 each day, every engine stamp and every budget read is on that day.'
  :'wall. Every engine stamp and every budget read is the real present, so no simulated week can pass.'));
 console.log('THE DAY AFTER THE GIFT. A blank profile carries plan.base '+bp.plan.base+'. With '+GIFT+' patterns opened the');
 console.log('allowance reads "'+aft.say+'", '+aft.left+' left. With base unset it would read "'+aftNull.say+'".');
 /* THE WEEK, read straight off planAllowance with an explicit date, which no
    clock can move: ten more patterns opened three days after the gift ran out,
    then the same count read seven days after it. An engine without weekly
    banking ignores the two dates and reads the same both times. */
 const gAt=new RealDate(T0).toISOString(), wk3=E.planAllowance(bp.plan,GIFT+10,gAt,T0+3*DAYMS),
  wk7=E.planAllowance(bp.plan,GIFT+10,gAt,T0+7*DAYMS);
 console.log('Ten more opened in the first free week, read on day 3 of it: "'+wk3.say+'". The same count read');
 console.log('on day 7, when the second week opens: "'+wk7.say+'". Whether the walk below ever reaches a second');
 console.log('week is the clock\'s doing, which is why the clock is printed above.\n');
 const out={};
 out.__gift={base:bp.plan.base, say:aft.say, left:aft.left, sayNull:aftNull.say, wk3:wk3.say, wk7:wk7.say, clock:CLOCK};
 ORDER.forEach(nm=>{
  const m=B?B.meas[nm]:null;
  const called=m?{k:m.called,min:m.min}:{k:'',min:5};
  for(const k in LOSS.TRACE)delete LOSS.TRACE[k];
  const log=console.log; console.log=function(){};
  try{LOSS.runSim('built',{trace:nm,seed:20260920});}finally{console.log=log;}
  const T=Object.assign({},LOSS.TRACE);
  const seq=(T.days||[]).slice(0,90);
  const every=new Array(90).fill(1);
  const walks={
   trace:{none:drive(nm,seq,false,called), intake:drive(nm,seq,true,called)},
   every:{none:drive(nm,every,false,called), intake:drive(nm,every,true,called)}};
  out[nm]={T:{n:T.n||0, alive30:T.alive30||0, days:seq.length, kept:seq.filter(x=>x>0).length, live:!!T.live},
   walks, called};
  const pr=(lab,w)=>{const e=w.ev;
   console.log('    '+lab.padEnd(22)+'turns '+String(w.turns).padStart(2)
    +'  own lines read as nothing '+e.readNothing+' of '+e.stories
    +'  first over the line '+(e.firstOver?('day '+e.firstOver):'never')
    +'  releases '+e.releases
    /* two days, named apart. On an engine without the free week they are the
       same day; with it, the first week's ten come between them, and the
       first run printed the second under the first one's name. */
    +'  gift spent '+(e.giftDay!==null?('day '+e.giftDay):'no')
    +'  allowance first nought '+(e.giftGone?('day '+e.giftGone):'never')
    +'  refused with load '+e.refusedLoaded
    +'  headline '+w.firstShown.cq+' to '+w.lastShown.cq
    +'  expression '+w.firstShown.ex+' to '+w.lastShown.ex
    +'  marks '+w.marks.length+(e.lastMarkDay?(', last new on day '+e.lastMarkDay):''));
   if(e.giftDay!==null)console.log('    '.padEnd(26)+'after the gift: '+GIFT+' reached day '+e.giftDay
    +(e.giftStamp?(' (meter.giftAt '+String(e.giftStamp).slice(0,10)+')'):' (no meter.giftAt on this engine)')
    +'  day after reads "'+e.sayAfterGift+'"  refilled on '+e.refills+' days'
    +'  releases after '+e.relAfterGift+'  refused after '+e.refusedAfterGift
    +'  day 90 reads "'+(e.sayAt[90]!==undefined?e.sayAt[90]:'')+'"');};
  /* losssim.js names this field alive30 and counts it after the ninety day
     loop, on `live`, so it is the row still in at day 90. Printed as what it
     counts. */
  console.log(nm+'. Practice called for: '+called.k+', '+called.min+' min. TRACE: '+out[nm].T.days+' days in the model, '
   +out[nm].T.kept+' kept, '+(out[nm].T.live?'still in at 90':'left on day '+out[nm].T.days)
   +'; '+out[nm].T.alive30+' of '+out[nm].T.n+' of this row are still in at day 90.');
  pr('TRACE, no intake',walks.trace.none); pr('TRACE, intake',walks.trace.intake);
  pr('EVERY DAY, no intake',walks.every.none); pr('EVERY DAY, intake',walks.every.intake);});

 console.log('\nTHE EVERY DAY WALK WITH THE INTAKE, at the days the model reports. Turns, headline CQ to two');
 console.log('places, expression, load (DQ), addresses above the line, gift left, marks, best run.');
 ORDER.forEach(nm=>{const w=out[nm].walks.every.intake;
  console.log('  '+nm+': '+DAYS.map(d=>{const s=w.snaps[d]; return 'd'+d+' CQ '+s.cq.toFixed(2)+' ex '+s.ex.toFixed(1)
   +' dq '+s.dq.toFixed(1)+' over '+s.over+' left '+s.left+' marks '+s.marks;}).join(' | '));});

 console.log('\nTHE NEW MARKS, BY DAY, on the every day walk with the intake. The reward schedule as the');
 console.log('shipped ladder deals it to somebody who never misses.');
 ORDER.forEach(nm=>{const e=out[nm].walks.every.intake.ev;
  console.log('  '+nm.padEnd(7)+Object.keys(e.marksAt).map(d=>'d'+d+' '+e.marksAt[d].join(', ')).join('; '));});
 return out;}

/* ============================================================
   D. THE FIRST RUN, re-measured, if the walk output is given.
   ============================================================ */
function sectionD(file){
 console.log('\n============================================================');
 console.log('D. THE FIRST RUN, re-measured in real Chromium.');
 console.log('============================================================');
 if(!file){console.log('No --walk file given. Build this commit and run proto/firstrun/walk.js to fill this.');return null;}
 const rows=fs.readFileSync(path.resolve(file),'utf8').split('\n').filter(l=>l.trim().startsWith('{')).map(l=>JSON.parse(l));
 const get=(f)=>rows.find(f)||{};
 const was={land1600:102,land390:22,doors390:3216,drill:2056};
 const L16=get(r=>r.who==='landing'&&r.step==='1600'), L39=get(r=>r.who==='landing'&&r.step==='390');
 const s1=get(r=>r.story===1&&r.W===1600), s2=get(r=>r.story===2&&r.W===1600), nine=get(r=>r.nineDoorTop!==undefined);
 const errs=rows.filter(r=>r.errors).reduce((a,r)=>a+r.errors.length,0);
 const boot=rows.filter(r=>r.bootedMs).map(r=>r.bootedMs);
 console.log('from '+file);
 console.log('  boot to booted             '+boot.map(x=>(x/1000).toFixed(1)+' s').join(', '));
 console.log('  controls in view, landing  1600: '+L16.controls+' (26 Sept: '+was.land1600+')   390: '+L39.controls+' (26 Sept: '+was.land390+')');
 console.log('  first door on a phone      '+((L39.doorsTop||[])[0])+' px down (26 Sept: '+was.doors390+')');
 console.log('  after the first story      "'+(s1.after||'').slice(0,120)+'"');
 console.log('  after the second story     "'+(s2.after||'').slice(0,90)+'"');
 console.log('  nine sentences, phone      opens at '+nine.drillTopAfterTap+' px on a '+nine.viewport+' px screen (26 Sept: '+was.drill+')');
 console.log('  page errors                '+errs);
 return {L16,L39,s1,s2,nine,errs,boot};}

/* ============================================================
   THE FRICTION LEDGER. Every spot, the day it lands, who it lands on, and
   which kind of number stands behind it. Printed off the sections above so
   no count in it is typed.
   ============================================================ */
function ledger(A,B,C,D){
 console.log('\n============================================================');
 console.log('THE FRICTION LEDGER, day 0 to day 90.');
 console.log('============================================================');
 const L=[];
 const add=(when,what,who,kind,src)=>L.push({when,what,who,kind,src});
 if(A){
  const miss=Object.keys(A.carriedA).filter(k=>!A.carriedA[k].length).map(k=>CLAUSENM[k]);
  add('day 0, the opening','The storyboard never says '+miss.join(', or ')+'. It shows an act on every frame and a purpose on none.',
   ORDER.filter(nm=>A.verdict[nm].needs.length&&A.verdict[nm].asDrawn.length<A.verdict[nm].needs.length).join(', '),
   'copy measured, need judged','A');
  const none=ORDER.filter(nm=>!A.first[nm].imprints);
  if(none.length)add('day 0, discover','Their first entry is read as nothing, and the storyboard has no frame for that.',none.join(', '),'measured','A');
  const over=ORDER.filter(nm=>A.first[nm].over);
  add('day 0, flow',(over.length?'A first entry crosses the line only for '+over.join(', ')+'.':'No first entry crosses the line.')
   +' For the rest the release refuses, so flow can only be the practice run the storyboard proposes (Q10).',
   ORDER.filter(nm=>!A.first[nm].over).join(', '),'measured','A');
  add('every session','Share of their own bank lines the sniffer reads as nothing, which recurs every time one is written.',
   ORDER.map(nm=>nm+' '+A.first[nm].dead+' of '+A.first[nm].bank).join(', '),'measured, engine','A');}
 if(D){
  add('day 0, landing','Controls in view on the landing: '+D.L16.controls+' at 1600, '+D.L39.controls+' at 390, first door '+((D.L39.doorsTop||[])[0])+' px down on a phone.','everyone who is not led','measured, Chromium','D');
  add('day 0, first commit','"'+(D.s1.after||'').replace(/^.*?(You have)/,'$1').slice(0,70)+'" after a first story.','everyone who writes one','measured, Chromium','D');}
 if(C){
  /* ITEM 7 IS PRINTED FROM WHAT THE WALK DID AFTER THE GIFT, not from a
     sentence about it. The first run typed "the release refuses from then
     on" and "nothing starts a new week" as prose, and the second clause was a
     fact about this harness's wall clock, not about the engine. */
  const spent=ORDER.map(nm=>[nm,C[nm].walks.every.intake.ev]).filter(x=>x[1].giftDay!==null);
  const refilled=spent.filter(x=>x[1].refills>0);
  const clk=' ['+C.__gift.clock+' clock]';
  if(spent.length){
   const lo=Math.min(...spent.map(x=>x[1].giftDay)), hi=Math.max(...spent.map(x=>x[1].giftDay));
   const says=[...new Set(spent.map(x=>x[1].sayAfterGift))];
   const what=refilled.length
    ?'The gift of '+GIFT+' patterns is spent. After it the free tier opens ten more each week and banks what is not spent: it rose on '
      +Math.min(...refilled.map(x=>x[1].refills))+' to '+Math.max(...refilled.map(x=>x[1].refills))
      +' days of the rest of each walk, one per week that opened. The release refuses on the days between when there is load on the wheel and less than a run left.'+clk
    :'The gift of '+GIFT+' patterns is spent and the allowance never rises again inside the walk. The day after, it reads "'+says.join('" or "')+'", and the release refuses on every later day with load on the wheel.'+clk;
   add('days '+lo+' to '+hi+', every day walk',what,
    spent.map(x=>x[0]+' gift d'+x[1].giftDay+', first nought '+(x[1].giftGone?'d'+x[1].giftGone:'never')+', rose '+x[1].refills
     +' times, ran '+x[1].relAfterGift+', refused '+x[1].refusedAfterGift+' after, day 90 "'+x[1].sayAt[90]+'"').join('; '),
    'measured, engine','C');}
  const flat=ORDER.filter(nm=>C[nm].walks.every.none.firstShown.cq===C[nm].walks.every.none.lastShown.cq);
  add('days 1 to 90, no intake','The headline CQ reads the same whole number on day 90 as on day 1 whatever is done, because it is the laws alone and nothing was answered.',
   flat.join(', '),'measured, engine','C');
  const tiny=ORDER.map(nm=>[nm,C[nm].walks.every.intake]).map(([nm,w])=>nm+' '+w.cq0.toFixed(2)+' to '+w.cqN.toFixed(2));
  add('days 1 to 90, with intake','With the laws answered, ninety days of daily release moves CQ by hundredths or a few tenths.',tiny.join(', '),'measured, engine','C');
  const down=ORDER.filter(nm=>{const w=C[nm].walks.every.intake; return w.exN<w.snaps[1].ex-0.5;});
  if(down.length)add('weeks 2 to 13, with intake','Expression ends lower than it started: telling the truth adds load faster than the release can take it off.',
   down.map(nm=>{const w=C[nm].walks.every.intake; return nm+' '+w.snaps[1].ex.toFixed(1)+' to '+w.exN.toFixed(1);}).join(', '),'measured, engine','C');
  /* the longest run of days with no new mark, for somebody who never misses,
     and for the most engaged member of the row as the model deals their days */
  const gap=ev=>{const ds=Object.keys(ev.marksAt).map(Number).sort((a,b)=>a-b);
   let best=[0,0,0]; for(let i=1;i<ds.length;i++){const g=ds[i]-ds[i-1]; if(g>best[0])best=[g,ds[i-1],ds[i]];}
   return best;};
  const dry=ORDER.filter(nm=>C[nm].walks.every.intake.ev.firstOver||C[nm].walks.every.intake.ev.releases)
   .map(nm=>{const g=gap(C[nm].walks.every.intake.ev), t=C[nm].walks.trace.intake;
    return nm+' d'+g[1]+' to d'+g[2]+' (most engaged in the model: last new mark d'+t.ev.lastMarkDay+' of '+t.days+' days)';});
  add('days 30 to 90','The ladder goes quiet. For somebody who never misses, the longest stretch with no new mark runs from Thirty days to Ninety days.',
   dry.join('; '),'measured, engine','C');
  const late=ORDER.map(nm=>[nm,C[nm].walks.every.none.ev.firstOver]).filter(x=>!x[1]||x[1]>2);
  add('weeks 1 and 2','The first address over the line takes more than two turns of their own writing.',
   late.map(x=>x[0]+' '+(x[1]?'d'+x[1]:'never')).join(', '),'measured, engine','C');}
 if(B){
  const d2=ORDER.map(nm=>[nm,B.exits[nm].cells[0]+B.exits[nm].cells[1]]);
  add('days 1 and 2','The largest single loss in the model, before any friction after the first session can act.',
   d2.map(x=>x[0]+' '+(100*x[1]).toFixed(0)+'%').join(', '),'model, losssim.js','B');}
 L.forEach((x,i)=>{console.log('\n'+String(i+1).padStart(2)+'. '+x.when.toUpperCase()+'  ['+x.kind+', section '+x.src+']');
  console.log('    '+x.what); console.log('    who: '+x.who);});
 return L;}

/* ============================================================ */
console.log('arc90. Ninety days from the storyboard, for the ICPs.');
console.log('commit '+PROV.commit+', '+PROV.when+', clock '+CLOCK);
console.log('dirty: engine.js '+PROV.dirty.engine+', atuned_src '+PROV.dirty.src+', losssim.js '+PROV.dirty.losssim
 +', loopsim.js '+PROV.dirty.loopsim+' (read by nothing here)');
console.log('md5: engine.js '+PROV.md5.engine+', losssim.js '+PROV.md5.losssim+', storyboard.html '+PROV.md5.storyboard);
if(PROV.dirty.losssim)console.log('losssim.js has uncommitted edits in the working tree. Its --validate result below is for this copy.');
console.log('release lift guarded against ui/release.js: '+JSON.stringify(LIFTOK)+', channels '+CHANS.join(' '));
const wi=process.argv.indexOf('--walk');
const A=sectionA();
const B=sectionB();
const C=sectionC(B);
const D=sectionD(wi>0?process.argv[wi+1]:null);
ledger(A,B,C,D);
console.log('\nWHAT THIS CANNOT SAY. Whether any of these people comes back on day 14 is retention psychology');
console.log('this project has not measured. Section B is a model of it, calibrated to an earlier simulation.');
console.log('Sections A, C and D are measurements of what the product would show them if they did.');
