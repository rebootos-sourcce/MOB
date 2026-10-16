/* ============================================================
   EVERY WORKED EXAMPLE SHOWS EVERYTHING AND RUNS NOTHING, AT EVERY TIER.
   node tests/examples-showonly.js, from the repo root, with NODE_PATH
   pointing at a playwright install, against source.html (or ATUNED_FILE).

   Ruled 16 October, his words: "something we need to do with those user
   profiles where the customer who selects any of the tiers cannot run a
   profile's inference. And for show only. Otherwise, that's cheating." And:
   "it allows people to see the patterns. But not run them. If you're a tier
   one, it allows you to see what you're missing as a product."

   The rule is one engine guard, showRefuse in engine/showonly.js, asked by
   every writer. tests/engine.js holds the writers headless; this holds what a
   person meets, through the controls, with the harness seam off (SIGHT_PLAN
   null), so nothing but the records' own plans decides sight.

   FOR THE OWN RECORD AT FREE AND AT TIER ONE, TWO, THREE AND FOUR, a fresh
   browser store each, and for every example in PEOPLE (read at run time and
   never counted here, the defect this repository keeps paying for):
     1  every surface TABDEF names still opens on the example, by its host's
        id, at the render watch's own floors (tools/monitor.js)
     2  the Story journal and both release Run controls are the preview line
        and not a control, and the Intake's answers are drawn disabled
     3  every write path is refused, through the control where there is one
        and by name where there is not: the Story commit, the release Begin
        and its end, an Intake answer and a block answer, an avatar situation,
        a ritual write, an import, an export, and applyStory, verpApply,
        leanApply, iqAnswer, ixSet, seedApply, relWrite, releaseWork, meterRun
        and meterFirst called the way a new control would call them. Nothing
        in the field or on the example's record moves
     4  the refusal reads as a preview and never as a failure: the one line,
        in no fail kind, and its second sentence is the one the sight table
        gives for the own plan (planNextSight), read at run time
   THEN, FOR THE OWN RECORD:
     5  it is untouched by the visits: the stored bytes are the same bytes,
        and no example joined the stored list
     6  it keeps its own tier's powers: its plan reads its own tier, its sight
        is exactly the rungs SIGHT gives that tier, and a story commits, an
        Intake answer lands and the release offers Begin

   CHECKED AGAINST A KNOWN BAD BUILD FIRST, the standing rule: the same build
   with showRefuse made to answer false (the guard removed) fails group 3 for
   every example at every tier, and the build from before the guard
   (origin/main at 920d7ed2) fails groups 2, 3 and 4.
   ============================================================ */
const path=require('path');
const {chromium}=require('playwright');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const CHROME=process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let PASS=0,FAIL=0;
const ok=(c,m)=>{ if(c){PASS++;} else {FAIL++; console.log('  FAIL '+m);} };
const booted=async p=>{
 try{ await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000}); }catch(e){}
 try{ await p.waitForTimeout(600);
  await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
  await p.waitForTimeout(120); }catch(e){}
 try{ await p.waitForFunction(()=>typeof enterOver!=='function'||enterOver(),null,{timeout:4000}); }catch(e){}};
/* the render watch's floors, tools/monitor.js: a host under these drew nothing */
const FLOOR=400, FLOOR_CANVAS=60;
const TIERS=['free','one','two','three','four'];
const TEXT='I was furious and ashamed and I could not stop going over it. I said nothing and let it sit.';

(async()=>{
 const browser=await chromium.launch({executablePath:CHROME});
 require('./net.js').guardBrowser(browser);
 console.log('\n=== every worked example shows everything and runs nothing, at every tier ===');
 for(const tier of TIERS){
  const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
  const pg=await ctx.newPage();
  await pg.addInitScript(()=>{window.SIGHT_PLAN=null;});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(400);
  console.log('\n--- the own record on '+tier+' ---');

  /* the own record on this tier, written to the store the way a paid record is */
  const own0=await pg.evaluate(t=>{
   loadP(0);
   CURP.plan={tier:t,status:t==='free'?'':'active',granted:0,carried:0,base:null,since:null,until:null,ends:null};
   const saved=pPersist();
   return {saved, raw:STORE.get(PKEY), n:PROFILES.length, of:planOf(CURP.plan).k,
    nx:(function(){var n=planNextSight(CURP.plan); return n?{to:n.to.nm, adds:n.adds.map(g=>g.nm)}:null;})()};},tier);
  ok(own0.saved&&own0.of===tier,'the own record is on '+tier+' and stored, '+JSON.stringify({saved:own0.saved,of:own0.of}));
  const examples=await pg.evaluate(()=>PEOPLE.map((p,i)=>({i:i,nm:p.nm,you:!!p.you})).filter(p=>!p.you));
  ok(examples.length>0,'the roster has examples to measure, read off PEOPLE: '+examples.length);

  for(const ex of examples){
   const r=await pg.evaluate(async a=>{
    const i=a.i, TEXT=a.T, wait=ms=>new Promise(res=>setTimeout(res,ms));
    const st=()=>{const e=document.getElementById('status'); return {t:(e&&e.textContent)||'', k:(e&&e.getAttribute('data-kind'))||''};};
    const clear=()=>{ if(typeof status==='function')status(''); };
    const out={nm:PEOPLE[i].nm, surf:[], refused:{}, said:{}, kinds:[], ctl:{}};
    loadP(i); await wait(40);
    /* 1 . every surface TABDEF names, by its host's id */
    const tabs=TABDEF.map(t=>[t.nm,t.k,t.id]);
    for(const [nm,k,id] of tabs){
     setTab(k); await new Promise(res=>requestAnimationFrame(()=>requestAnimationFrame(res)));
     const h=document.getElementById(id), s=h&&getComputedStyle(h), b=h&&h.getBoundingClientRect();
     let n=0;
     if(h&&s.display!=='none'&&b.width>0&&b.height>0){
      if(h.tagName==='CANVAS'){ try{ const d=h.getContext('2d').getImageData(0,0,h.width,h.height).data;
        for(let j=3;j<d.length;j+=4*97)if(d[j]>8)n++; }catch(e){ n=0; } n=n>=a.FC?a.F:0; }
      else n=h.innerHTML.length;}
     out.surf.push([nm,id,n]);}
    /* the fingerprint of everything a refused press could have moved */
    const fp=()=>JSON.stringify({c:S.charge,o:S.replace,l:S.law,v:VERPMIX,m:LEANMIX,
     r:{story:CURP.story,meter:CURP.meter,intake:CURP.intake,work:CURP.work,who:CURP.who,
        seed:CURP.seed||null,laws:CURP.laws,rit:CURP.rituals||null,av:CURP.avatar,pr:CURP.practice}});
    const rec0=CURP, f0=fp(), n0=PROFILES.length;
    const line=w=>showLine(w);
    const heard=(w,key)=>{const s=st(); out.said[key||w]=s.t===line(w); out.kinds.push(s.k); clear();};
    /* 2 . the Story page */
    setTab(TAB.STORY); await wait(30);
    out.ctl.story=!document.getElementById('sttext')&&!document.getElementById('stapply')
     &&!document.getElementById('stcin')&&!document.getElementById('stmic')&&!document.getElementById('sttalk')
     &&((document.querySelector('#story .st-colw .show-note')||{}).textContent||'')===line('story');
    out.ctl.strun=!document.getElementById('strun')
     &&((document.querySelector('#strel .show-note')||{}).textContent||'')===line('release');
    /* 3 . the story commit, the way the button calls it */
    clear(); ST_TEXT=TEXT; ST_PARSED=parseStory(TEXT);
    const sc=stCommit(); out.refused.commit=!!sc&&sc.ok===false&&sc.why==='example'; heard('story','commit');
    ST_TEXT=''; ST_PARSED=null;
    /* the release: the card opens as a reading and offers no Begin */
    setTab(TAB.FIELD); clear();
    const hot=relQueueOf(8).map(n=>n.i);
    if(hot.length){
     relPick(hot); await wait(30);
     const rh=document.getElementById('rel');
     out.ctl.card=!!rh&&rh.innerHTML.length>=a.F;
     out.ctl.begin=!document.getElementById('relgo')
      &&((document.querySelector('#rel .rel-show')||{}).textContent||'')===line('release');
     /* and a run that reaches its end anyway, as any other route could */
     RUN.phase='run'; RUN.idx=RUN.plan.length;
     out.refused.cool=relCoolDown()===false&&RUN.phase==='pick'; heard('release','cool');
     relClose();}
    else { out.ctl.card=true; out.ctl.begin=true; out.refused.cool=true; out.said.cool=true; }
    /* the Intake: answers drawn disabled, and a press that arrives anyway */
    /* a law open in the list, so its three answers are on the page to press */
    setTab(TAB.INTAKE); IQ_VIEW='list'; IQ_OPEN=0; renderIntake(); await wait(30);
    const ans=[...document.querySelectorAll('#iqbody [data-a],#iq [data-a]')];
    out.ctl.intake=ans.length>0&&ans.every(e=>e.disabled)
     &&((document.querySelector('.iqa-show')||{}).textContent||'')===line('intake');
    const pick=ans.find(e=>CURP.intake.answers[+e.dataset.a]!==+e.dataset.v)||ans[0];
    clear(); if(pick&&pick.onclick)pick.onclick(); out.refused.answer=!!pick; heard('intake','answer');
    const ixb=document.querySelector('[data-ixb]');
    clear(); if(ixb&&ixb.onclick)ixb.onclick(); heard('intake','block');
    /* an avatar situation, a ritual write: their own refusals, in place */
    clear(); if(typeof avDilemma==='function'&&typeof AV_DILEMMA!=='undefined'&&AV_DILEMMA.length)avDilemma(0,7);
    out.refused.avatar=/worked example/.test(st().t); clear();
    out.refused.ritual=(typeof ritWrite==='function')?ritWrite(function(){return [];},'Done.')===false:true; clear();
    /* an import and an export */
    out.refused.imp=pImport(JSON.stringify(blankProfile('pasted')))===null&&PROFILES.length===n0&&CURP===rec0;
    heard('import','import');
    out.refused.exp=pExport()===null; heard('export','export');
    /* the engine writers, called the way a control added later would call them */
    const n=W.filter(x=>x.cf)[0];
    out.refused.engine=[
     applyStory(TEXT).refused, verpApply(TEXT).refused||(!verpScan(TEXT).total&&'example'), leanApply(TEXT).refused,
     iqAnswer(CURP,0,9)===false&&'example', ixSet(CURP,'arch',IX_ARCH2[0].k,5)===false&&'example',
     seedApply(CURP,'INTJ')===null&&'example', relWrite([n],n,60).refused,
     releaseWork(CURP,[n.i+':l:rel']).refused, meterRun(CURP,[n.i+':l:rel'])===null&&'example',
     meterFirst(CURP,'addr:'+n.i,'x')===null&&'example'].every(v=>v==='example');
    clear();
    out.still=fp()===f0&&CURP===rec0&&PROFILES.indexOf(CURP)<0;
    out.diff=out.still?'':(function(){const A=JSON.parse(f0),B=JSON.parse(fp());
     return Object.keys(A).filter(k=>JSON.stringify(A[k])!==JSON.stringify(B[k])).concat(
      Object.keys(A.r).filter(k=>JSON.stringify(A.r[k])!==JSON.stringify(B.r[k])).map(k=>'r.'+k)).join(',');})();
    out.line=line('story');
    return out;},{i:ex.i, F:FLOOR, FC:FLOOR_CANVAS, T:TEXT});

   /* 1 */
   const empty=r.surf.filter(s=>s[2]<FLOOR);
   ok(empty.length===0,tier+' / '+r.nm+': every surface opens, '+r.surf.length+' read, empty: '+JSON.stringify(empty));
   /* 2 */
   ok(r.ctl.story,tier+' / '+r.nm+': the Story journal is the preview line, with no box, Talk, Record or Commit');
   ok(r.ctl.strun,tier+' / '+r.nm+': the Story release column has the preview line where Run release was');
   ok(r.ctl.card&&r.ctl.begin,tier+' / '+r.nm+': the release card opens as a reading and offers no Begin, '+JSON.stringify({card:r.ctl.card,begin:r.ctl.begin}));
   ok(r.ctl.intake,tier+' / '+r.nm+': the Intake answers are drawn disabled under the preview line');
   /* 3 */
   const bad=Object.keys(r.refused).filter(k=>!r.refused[k]);
   ok(bad.length===0,tier+' / '+r.nm+': every write path is refused, failing: '+JSON.stringify(bad));
   ok(r.still,tier+' / '+r.nm+': nothing in the field or on the example\'s record moved, moved: '+r.diff);
   /* 4 */
   const unsaid=Object.keys(r.said).filter(k=>!r.said[k]);
   ok(unsaid.length===0,tier+' / '+r.nm+': each refusal said the preview line, missing on: '+JSON.stringify(unsaid));
   ok(r.kinds.every(k=>k!=='fail'),tier+' / '+r.nm+': no refusal printed in the fail kind, '+JSON.stringify(r.kinds));
   const tail=own0.nx?(own0.nx.adds.join(', ').replace(/^./,c=>c.toUpperCase()).replace(/, ([^,]*)$/,' and $1')
     +' show here, and on your own profile they open on '+own0.nx.to.toLowerCase()+'.')
    :'Open your own profile to run it.';
   ok(r.line.endsWith(' '+tail),tier+' / '+r.nm+': the second sentence is the sight table\'s for '+tier+', '+JSON.stringify(r.line));}

  /* 5 . the own record is untouched by every visit */
  const own1=await pg.evaluate(nm=>{
   const raw=STORE.get(PKEY); let all=[]; try{all=JSON.parse(raw)||[];}catch(e){}
   return {raw, named:all.filter(x=>nm.indexOf(x&&x.name)>=0).map(x=>x.name), n:PROFILES.length};},examples.map(e=>e.nm));
  ok(own1.raw===own0.raw,tier+': the own record\'s stored bytes are the same bytes after every visit');
  ok(own1.named.length===0&&own1.n===own0.n,tier+': no example joined the stored list, '+JSON.stringify({named:own1.named,n:own1.n}));

  /* 6 . the own record keeps its own tier's powers */
  const mine=await pg.evaluate(async ([t,TEXT])=>{
   const wait=ms=>new Promise(res=>setTimeout(res,ms));
   loadP(0); await wait(40);
   const pl=lockPlan(), s=planSight(pl), at=planRank(t);
   const sightRight=SIGHT.every(g=>s.sees[g.k]===(at>=planRank(g.need)));
   const o={of:planOf(pl).k, show:showOnly(), sightRight};
   setTab(TAB.STORY); await wait(30);
   o.box=!!document.getElementById('sttext')&&!!document.getElementById('stapply')&&!document.querySelector('#story .show-note');
   const e0=((CURP.story&&CURP.story.entries)||[]).length;
   ST_TEXT=TEXT; ST_PARSED=parseStory(TEXT);
   const c=stCommit(); o.commit=!!c&&c.ok===true&&((CURP.story.entries||[]).length===e0+1);
   o.said=(document.getElementById('status')||{}).textContent||'';
   setTab(TAB.INTAKE); IQ_VIEW='list'; IQ_OPEN=0; renderIntake(); await wait(30);
   const b=[...document.querySelectorAll('[data-a]')].find(e=>!e.disabled&&CURP.intake.answers[+e.dataset.a]!==+e.dataset.v);
   if(b){const k=+b.dataset.a, v=+b.dataset.v; b.onclick(); o.answer=CURP.intake.answers[k]===v;} else o.answer=false;
   setTab(TAB.FIELD); const hot=relQueueOf(8).map(n=>n.i);
   if(hot.length){relPick(hot); await wait(30); o.begin=!!document.getElementById('relgo')&&!document.querySelector('#rel .rel-show'); relClose();}
   else o.begin='nothing carrying';
   return o;},[tier,TEXT]);
  ok(mine.of===tier&&!mine.show&&mine.sightRight,tier+': the own record reads its own tier and exactly that tier\'s sight, '+JSON.stringify({of:mine.of,show:mine.show,sight:mine.sightRight}));
  ok(mine.box&&mine.commit&&!/worked example/.test(mine.said),tier+': on the own record the journal is there and a story commits, '+JSON.stringify({box:mine.box,commit:mine.commit,said:mine.said}));
  ok(mine.answer,tier+': on the own record an Intake answer lands');
  ok(mine.begin===true,tier+': on the own record the release offers Begin, '+JSON.stringify(mine.begin));
  ok(err.length===0,tier+': no page errors, '+err.slice(0,2).join(' | '));
  await ctx.close();}
 await browser.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);})().catch(e=>{ console.log('  FAIL the gate threw: '+e.stack); process.exit(1); });
