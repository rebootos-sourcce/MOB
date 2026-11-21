#!/usr/bin/env node
/* ============================================================
   THE TABLE OF UNIVERSAL LAWS, held in a real browser. 21 November.

   env NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=$PW_DIR \
     node tests/kbtable.js
   ATUNED_FILE=file   runs against another build, for checking the checker

   ui/kbtable.js landed with no browser gate of its own, so every rule it
   was built to was held by nothing but the screenshot that day. This holds
   the ones a regression would break without anybody seeing it:

     every law in HARM is a tile, and nothing typed by hand is: the count is
     read off HARM, never written here;
     the three laws the book has not confirmed say so on the tile itself,
     read off their own text, and no other tile does;
     no achievement is on the screen before it is earned, so a fresh board
     carries no tier at all, and a family read shows its tier;
     the film is a plain link to the Drive file on exactly the laws HARM_FILM
     names, and opening one makes no request;
     #FF2E1F, the alarm red, is nowhere on the board;
     a store that throws draws the board unread and opens a tile anyway;
     a press on a tile does not move the rail's caption, which railPick did
     for every kind that was not arch before kind kb was named;
     no horizontal scroll at either width.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [W,H] of [[1600,1000],[390,844]]){
  console.log('\n'+W+' · the table');
  const pg=await browser.newPage({viewport:{width:W,height:H}});
  const errs=[]; pg.on('pageerror',e=>errs.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg);
  await pg.evaluate(()=>{try{localStorage.removeItem(KBT_KEY);}catch(e){} setTab(TAB.KNOW);});
  await pg.waitForTimeout(700);
  const a=await pg.evaluate(()=>{
   const b=document.getElementById('kbt'); if(!b)return null;
   const tiles=[...b.querySelectorAll('.kbt-t[data-kbtc]')];
   const all=[...b.querySelectorAll('*')].map(e=>{const s=getComputedStyle(e);
    return s.color+s.backgroundColor+s.outlineColor+s.borderTopColor+(e.getAttribute('stroke')||'')+(e.getAttribute('fill')||'');}).join('');
   return {n:tiles.length, N:HARM.length,
    codes:tiles.map(t=>t.getAttribute('data-kbtc')).sort().join(','),
    want:HARM.map(e=>e.c).sort().join(','),
    uc:tiles.filter(t=>/Not yet confirmed in the book/.test(t.textContent)).map(t=>t.getAttribute('data-kbtc')).join(','),
    ucWant:HARM.filter(e=>/pending confirmation/i.test(e.d||'')).map(e=>e.c).join(','),
    tiers:b.querySelectorAll('.kbt-tier').length,
    teased:/Not yet\b(?! confirmed)/.test(b.querySelector('.kbt-l').textContent),
    red:/ff2e1f|rgb\(255, 46, 31\)/i.test(b.outerHTML+all),
    hs:document.documentElement.scrollWidth>innerWidth,
    sub:(b.querySelector('[data-kbtc="E74"]')||{}).textContent||''};});
  ok(a,'the board is on the wisdom school page');
  if(!a){await pg.close(); continue;}
  ok(a.n===a.N&&a.codes===a.want,'every law in HARM is one tile, '+a.n+' of HARM\'s own');
  ok(a.uc===a.ucWant&&a.uc.length>0,'the tiles that say not yet confirmed are the ones whose text says so: '+a.uc);
  ok(a.tiers===0&&!a.teased,'a fresh board shows no achievement, earned or waiting');
  ok(!a.red,'the alarm red is nowhere on the board');
  ok(!a.hs,'no horizontal scroll');
  ok(/the instrument/.test(a.sub),'E74 says it is the instrument');

  /* the films: a link on each law HARM_FILM names, nothing on any other,
     and nothing requested on the way */
  const reqs=[]; pg.on('request',r=>{if(!/^(file|data|blob):/.test(r.url()))reqs.push(r.url());});
  const capBefore=await pg.evaluate(()=>{const c=document.getElementById('capD');return c?c.getAnimations().length:0;});
  const f=await pg.evaluate(async()=>{
   const out={with:[],without:[],bad:[]};
   for(const e of HARM){
    const t=document.querySelector('[data-kbtc="'+e.c+'"]'); t.click();
    await new Promise(r=>setTimeout(r,20));
    const l=document.querySelector('#kbtdt a.kbt-film');
    if(l){out.with.push(e.c);
     const id=(HARM_FILM[e.c]||{}).id;
     if(l.getAttribute('href')!=='https://drive.google.com/file/d/'+id+'/view'||l.target!=='_blank'||!/noopener/.test(l.rel))out.bad.push(e.c);}
    else out.without.push(e.c);
    t.click();}
   out.cap=(()=>{const c=document.getElementById('capD');return c?c.getAnimations().length:0;})();
   return out;});
  ok(f.with.join(',')===Object.keys(await pg.evaluate(()=>HARM_FILM)).join(','),'a film link sits on exactly the laws HARM_FILM names: '+f.with.join(','));
  ok(f.bad.length===0,'each is the Drive file by its own id, in a new tab, with no opener'+(f.bad.length?': '+f.bad.join(','):''));
  ok(reqs.length===0,'opening every law made no request'+(reqs.length?': '+reqs.slice(0,3).join(', '):''));
  ok(f.cap===capBefore,'a press on a tile leaves the rail caption alone');

  /* every law has now been opened, so every tier is earned and on screen */
  const t2=await pg.evaluate(()=>[...document.querySelectorAll('#kbt .kbt-tier')].map(x=>x.textContent).join('|'));
  ok(/Families unlocked/.test(t2)&&/Families read/.test(t2)&&/The formula closed/.test(t2),'with every law read, all three achievements show: '+t2);
  ok(await pg.evaluate(()=>document.querySelector('#kbt .kbt-f').classList.contains('kbt-grand')),'and the formula tile is closed');

  /* a store that throws: the board draws, and a tile still opens */
  const s=await pg.evaluate(async()=>{
   const g=STORE.get, st=STORE.set;
   STORE.get=function(){throw new Error('blocked');}; STORE.set=function(){throw new Error('blocked');};
   /* leave and come back: render() alone kept the board that was already
      drawn, which counted 76 read from the markup and not from the store,
      the probe's own bug, measured against kbtIsSeen directly first */
   try{KBT_MEM={}; setTab(TAB.STORY); await new Promise(r=>setTimeout(r,200));
    setTab(TAB.KNOW); await new Promise(r=>setTimeout(r,300));
    const n=document.querySelectorAll('#kbt .kbt-t.kbt-seen').length;
    document.querySelector('[data-kbtc="E02"]').click();
    return {drawn:!!document.getElementById('kbt'), seen:n, open:/All Is Motion/.test(document.getElementById('kbtdt').textContent)};}
   catch(e){return {err:String(e)};}
   finally{STORE.get=g; STORE.set=st;}});
  ok(s.drawn&&s.seen===0&&s.open,'a store that throws draws the board unread and still opens a tile '+JSON.stringify(s));
  ok(errs.length===0,'no page errors'+(errs.length?': '+errs.slice(0,2).join(' | '):''));
  await pg.close();
 }
 await browser.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);
})();
