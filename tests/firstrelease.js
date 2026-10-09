/* ============================================================
   THE FIRST RELEASE KEEPS THE PROMISE ITS CARD MAKES, M28.

   WHY THIS FILE EXISTS. The card one screen before a person's first release
   said "Your first release is 4 lines, all at one place ... The lines are
   read in silence. Nothing speaks and nothing counts down." The screen after
   it said "1 address, 200 patterns", "Patterns 100", "Time 28:02", opened
   with the voice switched on, counted "Left 27:59" down, and its first words
   were "His recorded voice reads this part. Until it is recorded, read it to
   yourself." Angela stopped there in the team's walk (mvp-pass2-journey.md).
   The plan inside was right, and tests/onboarding2.js held the plan and
   never looked at the screen, so every one of those broken promises was
   green. This file looks at the screen.

   THE RULING THE SCREEN AND THE CARD ARE HELD TO. Round PA, 1 October:
   "The mini release is 12 lines." (PLAN.md, "Ruled by him, round PA"), and
   in the same round, "Release screens (the onboarding's): match what the
   software does." Twelve lines is three addresses at four channels said once
   each, which is what REVIEW-onboarding/pass1/devops-qa.md measured as "Dose
   1 is 12 lines, the ruled mini release, but it needs a typed number."

   WHAT IT DOES. Walks the real door (Guest, ui/login.js) through the
   onboarding to the bridge card, at 1600 and at 390, once saying yes to one
   place and once to every place, once with the voice on and once with it
   off, and the Day One tutorial once, which is the other door that promises
   the same release. On each it reads the card's own sentence and parses what
   it promises, then presses Begin and Run release and walks the run to its
   end on the product's own walker, recording every screen. Each promise is
   then held against what the screen did:

     count     the card's "N lines" is the lines the run is set to say, the
               lines the setup screen prints, and the lines the walk said;
               every count of lines or patterns on the setup is that N
     places    the card's place count is the queue and the setup's addresses
     ruling    yes to three places or more is exactly 12 lines, at 3 places
     voice     a card that says silence gets no line spoken; a card that
               says the voice reads gets every list line spoken
     timer     a card that says nothing counts down gets no countdown on any
               screen; a card that says a ring counts the rest gets the ring,
               and the minutes it names are REL_SETTLE_S
     repeats   a card that says each line is said once gets a dose of one and
               no control to change it; one that says the person sets the
               repeats gets the control
     pace      "You set the pace" has the pace control on the setup
     stop      "stop at any line" has End session on every list screen
     no stand in  no screen of the run, and not the card, carries a
               placeholder: no recorded voice that is not there, no "until it
               is recorded"

   A card that makes no claim this file can read about the voice or about a
   countdown fails, because a voice or a clock arriving unannounced on a
   first visit is the defect. A new wording of a claim is added to CLAIMS
   below, beside the wording it replaces.

   Checked against known bad cases before it was trusted: the build at
   f28aa36, which fails on count, voice, timer and placeholder; the fixed
   build with the placeholder line put back; and the fixed build with the
   card changed to promise 4 lines whatever the plan.

       NODE_PATH=/opt/node22/lib/node_modules node tests/firstrelease.js

   Run from the repository root. Exits non zero on any failure.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html');
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};
/* the walker's own four timing constants, shrunk the way tests/design.js and
   tests/onboarding2.js shrink them, so every step still goes through
   relStep, relAdvance and relCoolDown in order */
const SHRINK=`REL_WORD_S=0.0004;REL_GAP_S=0.001;REL_HEAD_S=0;REL_FRAME_S=0;`;
const STORY='I felt tight in my chest when my boss yelled at me and I could not breathe.';

/* WHAT A CARD CAN PROMISE, as the words that promise it. Each family must be
   promised exactly once on a card, except repeats, pace and stop, which are
   checked when promised. */
const CLAIMS={
 voice:[['silent',/in silence|Nothing speaks|Nothing reads it out loud/],
        ['voiced',/out loud by the app voice/]],
 timer:[['none',/nothing counts down/i],
        ['rest',/rest for (\d+) minutes?, and a ring counts them down/]],
 repeats:[['once',/Each line is said once/],['set',/how many times each line repeats/]]};
function claim(fam,t){
 const hit=CLAIMS[fam].filter(c=>c[1].test(t));
 return hit.length===1?{k:hit[0][0],m:t.match(hit[0][1])}:{k:hit.length?'two':null,m:null};}
function promises(t){
 const c=t.match(/\b(\d+) lines?, (?:all at one place|\d+ at each of (\d+) places)/);
 return {lines:c?+c[1]:null, places:c?(c[2]?+c[2]:1):null,
  voice:claim('voice',t), timer:claim('timer',t), repeats:claim('repeats',t),
  pace:/You set the pace/.test(t), stop:/stop at any line/.test(t)};}
const STANDIN=/recorded voice|until it is recorded|placeholder|lorem|\bTODO\b|\bTBD\b/i;

/* RECORD EVERY SCREEN. relRender is wrapped the way tests/design.js wraps it,
   and speak is wrapped so what the voice was handed is known. The browser's
   own speak is stood in for, because a headless browser has no voice to hear;
   the stand in ends each line a moment after it starts. A full screen is read
   once per phase, address and the first two passes, which is every distinct
   screen the run draws without reading a thousand copies of the same one. */
const ARM=()=>{
 window.__said=[]; window.__steps=[]; window.__shots=[];
 if(window.speechSynthesis)speechSynthesis.speak=function(u){setTimeout(function(){if(u.onend)u.onend({});},1);};
 if(typeof speak==='function'&&!window.__sp){const o=speak; window.__sp=1;
  window.speak=function(t){window.__said.push(String(t)); return o.apply(this,arguments);};}
 if(!window.__rr){const o=relRender; window.__rr=1;
  window.relRender=function(){o();
   const st=(typeof relCur==='function')?relCur():null;
   const k=[RUN.phase,RUN.idx,RUN.pass,RUN.line,RUN.cool,relResting()].join('/');
   const S=window.__steps, last=S[S.length-1];
   if(!last||last.k!==k)S.push({k:k,ph:RUN.phase,kind:st&&st.kind,text:st&&st.text});
   const sk=[RUN.phase,RUN.idx,Math.min(RUN.pass,1),RUN.line,relResting()].join('/');
   const H=window.__shots;
   if(!H.length||H[H.length-1].sk!==sk){
    const rel=document.getElementById('rel'), card=rel&&rel.querySelector('.rel-card');
    const lefts=[].slice.call(document.querySelectorAll('#rel .rel-tclk-l, #rel .rel-fig span'))
     .filter(function(e){return /^\s*left\s*$/i.test(e.textContent)||e.classList.contains('rel-tclk-l');});
    H.push({sk:sk,ph:card?card.getAttribute('data-ph'):'',text:rel?rel.innerText:'',
     ring:!!document.getElementById('relsetd'),left:lefts.length>0,stop:!!document.getElementById('relstop')});}};}};

/* the run, from Begin on a door to the results, with the screen recorded */
async function runFrom(page,beginSel){
 await page.evaluate(SHRINK); await page.evaluate(ARM);
 await page.click(beginSel); await page.waitForTimeout(200);
 const setup=await page.evaluate(()=>({text:document.getElementById('rel').innerText,
  plan:(RUN.plan||[]).length, dose:RUN.dose, queue:(RUN.queue||[]).length, voice:relVoiceOn(),
  doseCtl:!!document.getElementById('reldose')||!!document.querySelector('[data-reldose]'),
  pace:!!document.getElementById('relpace'), go:!!document.getElementById('relgo'),
  mini:{a:typeof ONB_MINI_ADDRS==='number'?ONB_MINI_ADDRS:null, m:typeof RUN_MIN==='number'?RUN_MIN:null},
  settle:typeof REL_SETTLE_S==='number'?REL_SETTLE_S:null}));
 await page.evaluate(()=>{window.__said=[]; window.__steps=[]; window.__shots=[];});
 if(setup.go)await page.click('#relgo');
 await page.waitForFunction(()=>RUN.phase==='done'&&RUN.cool>=COOLING.length,null,{timeout:150000}).catch(()=>{});
 await page.waitForTimeout(120);
 const rest=await page.evaluate(()=>!!document.getElementById('relrest'));
 if(rest){await page.click('#relrest'); await page.waitForTimeout(200);}
 const walk=await page.evaluate(()=>({said:window.__said.slice(), steps:window.__steps.slice(),
  shots:window.__shots.slice(), done:RUN.phase==='done', cool:COOLING.length}));
 await page.evaluate(()=>{ if(typeof relClose==='function')relClose(); });
 return {setup:setup, walk:walk, rest:rest};}

/* every promise on the card, against the screen that came after it */
function hold(tag,card,r,opts){
 const P=promises(card), S=r.setup, W=r.walk;
 const list=W.steps.filter(s=>s.ph==='run'&&(s.kind==='head'||s.kind==='pass'));
 ok(P.lines!=null&&P.places!=null,tag+'the card says how many lines and at how many places: '+JSON.stringify([P.lines,P.places]));
 ok(S.go,tag+'the setup offers Run release');
 ok(W.done,tag+'the run walks itself to its end');
 /* count */
 ok(S.plan*S.dose===P.lines,tag+'the run is set to say the card\'s '+P.lines+' lines, it is set to say '+(S.plan*S.dose)
  +' ('+S.plan+' lines, each '+S.dose+' times)');
 const counts=[...S.text.matchAll(/(\d+)\s*(patterns?|lines?)\b/g)].map(m=>+m[1]);
 ok(new RegExp('\\b'+P.lines+'\\s*lines?\\b').test(S.text),tag+'the setup prints the card\'s count, '+P.lines+' lines');
 ok(counts.length>0&&counts.every(n=>n===P.lines),tag+'and every count of lines or patterns on the setup is that '+P.lines+': '+JSON.stringify(counts));
 ok(list.length===P.lines,tag+'the walk said exactly '+P.lines+' lines, it said '+list.length);
 /* places */
 ok(S.queue===P.places,tag+'the run carries the card\'s '+P.places+(P.places===1?' place':' places')+', it carries '+S.queue);
 ok(new RegExp('\\b'+P.places+' address(es)?\\b').test(S.text),tag+'and the setup counts the same '+P.places);
 /* the ruling, read off the engine's own tables */
 const ruled=S.mini.a!=null&&S.mini.m!=null?S.mini.a*S.mini.m:null;
 ok(ruled===12,tag+'the ruled size is twelve lines, three addresses at four, read off the tables: '+ruled);
 ok(P.lines!=null&&P.lines<=ruled,tag+'the first release is never more than the ruled '+ruled+' lines: '+P.lines);
 if(opts.all)ok(P.lines===ruled&&P.places===S.mini.a,tag+'yes to every place is the ruled '+ruled+' lines at '+S.mini.a+' places: '+P.lines+' at '+P.places);
 /* voice */
 ok(P.voice.k==='silent'||P.voice.k==='voiced',tag+'the card says, once, whether anything reads the lines out loud: '+P.voice.k);
 if(P.voice.k==='silent'){
  ok(!S.voice,tag+'it says silence, and the voice is off when the run begins');
  ok(W.said.length===0,tag+'and nothing was spoken, '+W.said.length+' lines: '+W.said.slice(0,2).join(' | '));}
 if(P.voice.k==='voiced'){
  ok(S.voice,tag+'it says the voice reads, and the voice is on when the run begins');
  const miss=list.filter(s=>W.said.indexOf(s.text)<0);
  ok(list.length>0&&miss.length===0,tag+'and every line on the list was spoken, '+miss.length+' were not');}
 /* timer */
 ok(P.timer.k==='none'||P.timer.k==='rest',tag+'the card says, once, what counts down: '+P.timer.k);
 const cd=W.shots.filter(s=>s.ring||s.left).map(s=>s.ph);
 if(P.timer.k==='none')ok(cd.length===0,tag+'it says nothing counts down, and no screen shows a countdown: '+JSON.stringify([...new Set(cd)]));
 if(P.timer.k==='rest'){
  ok(+P.timer.m[1]*60===S.settle,tag+'the minutes of rest it names are the run\'s own, '+P.timer.m[1]+' against '+S.settle+' seconds');
  ok(W.shots.some(s=>s.ph==='rest'&&s.ring),tag+'and the rest screen draws the ring that counts them down');}
 /* repeats, pace, stop */
 if(P.repeats.k==='once')ok(S.dose===1&&!S.doseCtl,tag+'it says each line is said once: dose '+S.dose+', a control to change it '+S.doseCtl);
 if(P.repeats.k==='set')ok(S.doseCtl,tag+'it says the person sets the repeats, and the control is there');
 if(P.pace)ok(S.pace,tag+'it says the person sets the pace, and the pace control is there');
 if(P.stop){const ls=W.shots.filter(s=>s.ph==='run');
  ok(ls.length>0&&ls.every(s=>s.stop),tag+'it says the person can stop at any line, and End session is on every list screen');}
 /* no stand in */
 const bad=[{ph:'card',text:card},{ph:'setup',text:S.text}].concat(W.shots).filter(s=>STANDIN.test(s.text||''));
 ok(bad.length===0,tag+'no placeholder reaches the person on any screen: '
  +bad.slice(0,2).map(s=>s.ph+': '+((s.text||'').match(STANDIN)||[''])[0]).join(' | '));
 return P;}

(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});

for(const [W,H] of [[1600,1000],[390,844]]){
 for(const c of [{all:false,voice:true},{all:true,voice:false}]){
  const tag=W+', yes to '+(c.all?'every place':'one place')+', voice '+(c.voice?'on':'off')+': ';
  console.log('\n=== the onboarding\'s first release at '+W+', yes to '+(c.all?'every place':'one place')+', voice '+(c.voice?'on':'off')+' ===');
  const ctx=await browser.newContext({viewport:{width:W,height:H}});
  const page=await ctx.newPage();
  const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  await page.goto(FILE,{waitUntil:'load'}); await booted(page);
  await page.waitForSelector('#loginb-skip',{timeout:8000}); await page.click('#loginb-skip'); await page.waitForTimeout(300);
  await page.click('[data-ob="next"]'); await page.waitForTimeout(80);
  await page.click('[data-obpick="2"]'); await page.waitForTimeout(80);
  await page.click('[data-ob="next"]'); await page.waitForTimeout(80);
  await page.click('[data-obfeel="0"]'); await page.waitForTimeout(80);
  await page.click('[data-obplace="3"]'); await page.waitForTimeout(80);
  await page.fill('#obtext',''); await page.type('#obtext',STORY);
  await page.click('#obdone'); await page.waitForTimeout(100);
  await page.evaluate(all=>{ let b;
   if(all){ while((b=document.querySelector('[data-obmore]')))b.click();
    while((b=document.querySelector('[data-obans="yes"][aria-pressed="false"]')))b.click(); }
   else { b=document.querySelector('[data-obans="yes"]'); if(b)b.click(); }},c.all);
  await page.evaluate(v=>{CURP.ui=CURP.ui||{}; CURP.ui.voice=v;},c.voice);
  await page.click('[data-ob="mirrorcommit"]'); await page.waitForTimeout(120);
  /* the live card is the one in the slot; a leaving ghost may sit beside it */
  const card=await page.evaluate(()=>(document.querySelector('#ob .obx-slot .ob-card')||{}).innerText||'');
  ok(/Begin the release/.test(card),tag+'the bridge offers the first release');
  const r=await runFrom(page,'[data-ob="release"]');
  hold(tag,card,r,c);
  ok(errs.length===0,tag+'no page error: '+errs.slice(0,3).join(' | '));
  await ctx.close();}}

console.log('\n=== the Day One tutorial\'s first release, the other door into the same promise ===');
{
 const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
 const page=await ctx.newPage();
 const errs=[]; page.on('pageerror',e=>errs.push(e.message));
 await page.goto(FILE+'?dev=1',{waitUntil:'load'}); await booted(page);
 await page.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();
  loadP(0); CURP.ui=CURP.ui||{}; CURP.ui.tutorialSeen=false; CURP.ui.voice=true; tutorialOpen(true); });
 await page.fill('#tuttext',STORY);
 await page.click('[data-tut="commit"]'); await page.waitForTimeout(80);
 await page.click('#tutorial .obx-slot [data-tut="next"]'); await page.waitForTimeout(80);
 await page.click('#tutorial .obx-slot [data-tut="next"]'); await page.waitForTimeout(80);
 const card=await page.evaluate(()=>(document.querySelector('#tutorial .obx-slot .ob-card')||{}).innerText||'');
 ok(/Begin the release/.test(card),'tutorial: the Release step offers the first release');
 const r=await runFrom(page,'#tutorial .obx-slot [data-tut="release"]');
 hold('tutorial: ',card,r,{all:false});
 ok(errs.length===0,'tutorial: no page error: '+errs.slice(0,3).join(' | '));
 await ctx.close();
}

await browser.close();
console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);
})();
