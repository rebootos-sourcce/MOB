/* ============================================================
   EVERY WORKED EXAMPLE READS TIER FOUR, AND NOBODY ELSE DOES BECAUSE OF IT.
   node tests/personas-tier.js, from the repo root, with NODE_PATH pointing at
   a playwright install, against source.html (or ATUNED_FILE).

   The owner said on 2 October: "I'm assuming that all of the personas
   profiles that we have are all tier four, they're all unlocked." That has
   been true since Round PS (e0c46d6, ui/personas.js loadP, the line keyed to
   !p.you), and nothing gated it: tests/functional.js and tests/locks.js both
   seed every page as tier four through SIGHT_PLAN (tests/seed.js), so a
   regression that put the examples back on free would pass both of them.
   This gate turns the seam OFF and reads the record's own plan, which is the
   only way to measure what a person actually sees on an example.

   WHAT IT HOLDS
     1  the harness seams are off: SIGHT_PLAN is null and devSight() is false,
        so nothing but CURP.plan decides sight
     2  every entry of PEOPLE that is not the person's own ("You", the one
        with p.you) opens on a live tier four plan, every SIGHT row reads
        seen, no visible control on the page carries a lock, and computeSeen
        is the whole reading. The roster is read at run time and never counted
        here, because a count typed into a gate is the defect this repository
        keeps paying for
     3  a scratch record that already existed for an example as a blank free
        record (ui/practitioner.js builds them that way) is still stamped
        tier four when it is opened
     4  THE PERSON'S OWN TIER STILL COMES FROM THEIR OWN RECORD. "You" on a
        fresh store reads free with the chain locked, after every example has
        been opened. A real plan written on the own record (tier two, live)
        survives a round trip through every example. A lapsed tier three on
        the own record still reads free. The example unlock never leaks
     5  no example is persisted: the stored profile list holds no record named
        after an example and none carrying tier four, and after a reload the
        own record is still what it was

   CHECKED AGAINST KNOWN BAD BUILDS FIRST, the standing rule. On the build
   from before Round PS (git show e0c46d6^:source.html) every example reads
   free and group 2 fails for each of them. On the current build with one
   example removed from the exemption (the stamp guarded with an extra
   p.nm!=='Wren'), group 2 fails for Wren alone and passes for the rest.
   ============================================================ */
const path=require('path');
const {chromium}=require('playwright');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let PASS=0,FAIL=0;
const ok=(c,m)=>{ if(c){PASS++;} else {FAIL++; console.log('  FAIL '+m);} };
const booted=async p=>{
 try{ await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000}); }catch(e){}
 try{ await p.waitForTimeout(600);
  await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
  await p.waitForTimeout(120); }catch(e){}
 try{ await p.waitForFunction(()=>typeof enterOver!=='function'||enterOver(),null,{timeout:4000}); }catch(e){}};

(async()=>{
 const browser=await chromium.launch({executablePath:CHROME});
 const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
 const pg=await ctx.newPage();
 await pg.addInitScript(()=>{window.SIGHT_PLAN=null;});
 const err=[]; pg.on('pageerror',e=>err.push(e.message));
 await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(500);
 console.log('\n=== every worked example reads tier four, and the person\'s own tier is their own ===');

 /* 1 . the seams are off */
 const seams=await pg.evaluate(()=>({sp:(typeof SIGHT_PLAN==='undefined')?'undef':SIGHT_PLAN,
  dev:(typeof devSight==='function')?devSight():'none'}));
 ok(seams.sp===null,'SIGHT_PLAN is null, so the harness is not granting sight, '+JSON.stringify(seams.sp));
 ok(seams.dev===false,'devSight() is false, so the developer toggle is not granting sight, '+seams.dev);

 /* 2 . every example */
 const roster=await pg.evaluate(()=>PEOPLE.map((p,i)=>({i:i,nm:p.nm,you:!!p.you})));
 const examples=roster.filter(p=>!p.you), own=roster.filter(p=>p.you);
 ok(own.length===1&&own[0].i===0,'exactly one entry is the person\'s own, at 0, '+JSON.stringify(own));
 ok(examples.length>0,'the roster has examples to measure, read off PEOPLE: '+examples.length);
 for(const p of examples){
  const r=await pg.evaluate(async i=>{
   loadP(i); await new Promise(res=>setTimeout(res,60));
   const pl=lockPlan(), s=planSight(pl);
   const shown=[...document.querySelectorAll('[data-lock]')].filter(e=>e.getClientRects().length>0)
    .map(e=>e.getAttribute('data-lock'));
   const r0=compute(), rs=computeSeen();
   return {tier:pl&&pl.tier, status:pl&&pl.status, state:planState(pl), of:planOf(pl).k,
    all:s.all, unseen:Object.keys(s.sees).filter(k=>!s.sees[k]), shown:shown,
    whole:rs.sabs.length===r0.sabs.length&&rs.cxs.length===r0.cxs.length
     &&rs.hys.length===r0.hys.length&&rs.sups.length===r0.sups.length&&!rs.locked,
    isRec:PROFILES.indexOf(CURP)>=0};},p.i);
  ok(r.of==='four'&&r.state==='live'&&r.all&&r.unseen.length===0&&r.shown.length===0&&r.whole,
   p.nm+' opens on a live tier four plan with nothing locked, '+JSON.stringify(r));
  ok(!r.isRec,p.nm+' is a scratch record and not one of the person\'s own');}

 /* 3 . a scratch record made blank and free first, the way practitioner.js
    makes one, is still stamped when it is opened */
 const pre=await pg.evaluate(()=>{
  const i=PEOPLE.findIndex(p=>!p.you), nm=PEOPLE[i].nm;
  PROF_BY[nm]=blankProfile(nm);
  const before=planOf(PROF_BY[nm].plan).k;
  loadP(i);
  return {nm:nm, before:before, after:planOf(CURP.plan).k};});
  ok(pre.before==='free'&&pre.after==='four',
  'a pre-existing free scratch record for '+pre.nm+' still reads tier four once opened, '+JSON.stringify(pre));

 /* 4 . the person's own tier is their own */
 const mine=await pg.evaluate(()=>{
  loadP(0); const pl=lockPlan(), s=planSight(pl);
  return {tier:CURP.plan&&CURP.plan.tier, of:planOf(pl).k, all:s.all, locked:s.locked.map(g=>g.k),
   isRec:PROFILES.indexOf(CURP)>=0};});
 ok(mine.isRec,'"You" is the person\'s own stored record');
 ok(mine.of==='free'&&mine.tier==='free'&&!mine.all&&mine.locked.length>0,
  'after every example has been opened, the own record on a fresh store still reads free with the chain locked, '
  +JSON.stringify(mine));
 const paid=await pg.evaluate(async()=>{
  loadP(0);
  CURP.plan={tier:'two',status:'active',granted:0,carried:0,base:null,since:null,until:null}; pPersist();
  const out=[];
  for(let i=0;i<PEOPLE.length;i++){ if(PEOPLE[i].you)continue; loadP(i); }
  loadP(0); out.push(planOf(lockPlan()).k, planSees(lockPlan(),'cx'), planSees(lockPlan(),'hy'));
  CURP.plan={tier:'three',status:'canceled',granted:0,carried:0,base:null,since:null,until:null}; pPersist();
  const j=PEOPLE.findIndex(p=>!p.you); loadP(j); loadP(0);
  out.push(planOf(lockPlan()).k, planSees(lockPlan(),'sab'));
  CURP.plan={tier:'free',status:'',granted:0,carried:0,base:null,since:null,until:null}; pPersist();
  return out;});
 ok(paid[0]==='two'&&paid[1]===true&&paid[2]===false,
  'a live tier two on the own record survives a trip through every example and still reads tier two, '+JSON.stringify(paid.slice(0,3)));
 ok(paid[3]==='free'&&paid[4]===false,
  'a cancelled tier three on the own record still reads free after an example was opened, '+JSON.stringify(paid.slice(3)));

 /* 5 . nothing about an example is persisted */
 const names=examples.map(p=>p.nm);
 const disk=await pg.evaluate(nm=>{
  const raw=STORE.get(PKEY); let all=[]; try{ all=JSON.parse(raw)||[]; }catch(e){}
  return {n:all.length, named:all.filter(r=>nm.indexOf(r&&r.name)>=0).map(r=>r.name),
   four:all.filter(r=>r&&r.plan&&r.plan.tier==='four').length};},names);
 ok(disk.named.length===0&&disk.four===0,
  'the stored profile list holds no example and no tier four record, '+JSON.stringify(disk));
 await pg.reload({waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(400);
 const back=await pg.evaluate(()=>{ loadP(0); return {of:planOf(lockPlan()).k, n:PROFILES.length}; });
 ok(back.of==='free','after a reload the own record still reads free, '+JSON.stringify(back));

 ok(err.length===0,'no page errors, '+err.slice(0,2).join(' | '));
 await browser.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);})().catch(e=>{ console.log('  FAIL the gate threw: '+e.stack); process.exit(1); });
