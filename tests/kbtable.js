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

   And, from 21 November, his notes on the layout, each as a rule:

     every law wears a mark of its own, no two tiles the same;
     the board is left justified: every row of every band starts on one
     left edge, and the quotient column sits left of the laws on a wide
     pane;
     the old left card and its "Open any tile" line are gone, and the read
     count is in the quotient column;
     the formula is written out, word for word as he said it;
     the shared side columns are not drawn on this tab;
     the summary rail is never empty, a press writes the whole law into it,
     and Next opens the law after it and lights the one after that;
     on a phone the rail is on screen when a tile is pressed.
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
    teased:/Not yet\b(?! confirmed)/.test(b.querySelector('.kbt-q').textContent),
    icons:new Set(tiles.map(t=>t.querySelector('.kbt-gl').innerHTML)).size,
    lefts:(()=>{const L=new Set(); b.querySelectorAll('.kbt-frame,.kbt-g').forEach(r=>{const f=r.firstElementChild; if(f)L.add(f.offsetLeft);}); return [...L];})(),
    /* offsetLeft and offsetTop, not the box: the entrance cascade scales the
       tiles up out of .8, and a box read mid entrance put three bands on
       three left edges that were one, the probe's own bug, measured */
    rowLefts:(()=>{let bad=0; b.querySelectorAll('.kbt-g').forEach(g=>{const ks=[...g.children];
      const rows={}; ks.forEach(k=>{(rows[k.offsetTop]=rows[k.offsetTop]||[]).push(k.offsetLeft);});
      const firsts=Object.values(rows).map(r=>Math.min(...r)); if(new Set(firsts).size>1)bad++;}); return bad;})(),
    qLeft:(b.querySelector('.kbt-q').getBoundingClientRect().right<=b.querySelector('.kbt-laws').getBoundingClientRect().left),
    oldCard:!!b.querySelector('.kbt-l,.kbt-hint')||/Open any tile/.test(b.textContent),
    count:(b.querySelector('.kbt-q .kbt-sc')||{}).textContent||'',
    say:(b.querySelector('.kbt-f .kbt-fs')||{}).innerText||'',
    cols:[...document.querySelectorAll('.mid>.col')].filter(c=>c.getBoundingClientRect().width>0).length,
    rail:(document.getElementById('kbtrail')||{}).textContent||'',
    nextLit:[...b.querySelectorAll('.kbt-next')].map(x=>x.getAttribute('data-kbtc')).join(','),
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
  ok(a.icons===a.N,'every law wears its own mark, '+a.icons+' distinct across '+a.N+' tiles');
  ok(a.lefts.length===1,'every band and the frame start on one left edge, '+a.lefts.join(','));
  ok(a.rowLefts===0,'and every row inside a band starts on that edge, part full rows included');
  if(W>=1181)ok(a.qLeft,'the quotient column sits left of the laws');
  ok(!a.oldCard,'the left card and its "Open any tile" line are gone');
  ok(/^\s*0\s*read\s*$/.test(a.count),'the read count is in the quotient column: '+a.count.trim());
  ok(a.say.replace(/\s+/g,' ').trim()==='Coherence equals intention times integrity divided by resistance.','the formula is written out as he said it: '+a.say);
  ok(a.cols===0,'the shared side columns are not drawn on this tab, '+a.cols+' shown');
  ok(/The coherence formula/.test(a.rail)&&/Next: E01 All Is One/.test(a.rail),'a fresh rail is never empty: the formula, and Next to E01');
  ok(a.nextLit==='E01','and E01 is the one lit, '+a.nextLit);

  /* a press writes the whole law into the rail; Next opens the next one and
     lights the one after it; on a phone the rail is on screen */
  const nx=await pg.evaluate(async()=>{
   const e1=HARM[0], e2=HARM[1], e3=HARM[2];
   document.querySelector('[data-kbtc="'+e1.c+'"]').click(); await new Promise(r=>setTimeout(r,60));
   const rail=document.getElementById('kbtrail'), rr=rail.getBoundingClientRect();
   const o={whole:rail.textContent.indexOf(e1.d)>=0, onScreen:rr.top<innerHeight&&rr.bottom>0&&rr.height>0,
    next:(rail.querySelector('[data-kbtnext]')||{}).textContent||'', lit1:[...document.querySelectorAll('#kbt .kbt-next')].map(x=>x.getAttribute('data-kbtc')).join(',')};
   rail.querySelector('[data-kbtnext]').click(); await new Promise(r=>setTimeout(r,60));
   o.opened=document.getElementById('kbtrail').textContent.indexOf(e2.d)>=0;
   o.seen2=kbtIsSeen(e2.c);
   o.lit2=[...document.querySelectorAll('#kbt .kbt-next')].map(x=>x.getAttribute('data-kbtc')).join(',');
   o.want=[e2.c,e3.c];
   o.focus=document.activeElement&&document.activeElement.hasAttribute('data-kbtnext');
   /* the last law hands on to the formula, and the formula to the first unread */
   const last=HARM[HARM.length-1];
   document.querySelector('[data-kbtc="'+last.c+'"]').click(); await new Promise(r=>setTimeout(r,60));
   o.lastNext=(document.querySelector('#kbtrail [data-kbtnext]')||{}).getAttribute?document.querySelector('#kbtrail [data-kbtnext]').getAttribute('data-kbtnext'):'';
   document.querySelector('#kbtrail [data-kbtnext]').click(); await new Promise(r=>setTimeout(r,60));
   o.cqNext=document.querySelector('#kbtrail [data-kbtnext]').getAttribute('data-kbtnext');
   o.firstUnread=HARM.filter(e=>!kbtIsSeen(e.c))[0].c;
   document.querySelector('[data-kbtc="cq"]').click(); await new Promise(r=>setTimeout(r,30));
   return o;});
  ok(nx.whole,'a press writes the whole text of the law into the rail, not its opening words');
  ok(nx.onScreen,'and the rail is on screen when it does');
  ok(nx.lit1==='E02'&&/Next: E02/.test(nx.next),'the rail ends on Next to E02, and E02 is lit: '+nx.lit1);
  ok(nx.opened&&nx.seen2&&nx.lit2===nx.want[1],'Next opens '+nx.want[0]+', marks it read and lights '+nx.want[1]+', lit '+nx.lit2);
  ok(nx.focus,'focus stays on Next, so one key reads the table through');
  ok(nx.lastNext==='cq','the last law hands on to the formula');
  ok(nx.cqNext===nx.firstUnread,'and the formula hands on to the first law not yet read, '+nx.cqNext);

  /* the films: a link on each law HARM_FILM names, nothing on any other,
     and nothing requested on the way */
  const reqs=[]; pg.on('request',r=>{if(!/^(file|data|blob):/.test(r.url()))reqs.push(r.url());});
  const capBefore=await pg.evaluate(()=>{const c=document.getElementById('capD');return c?c.getAnimations().length:0;});
  const f=await pg.evaluate(async()=>{
   const out={with:[],without:[],bad:[]};
   for(const e of HARM){
    const t=document.querySelector('[data-kbtc="'+e.c+'"]'); t.click();
    await new Promise(r=>setTimeout(r,20));
    const l=document.querySelector('#kbtrail a.kbt-film');
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
    return {drawn:!!document.getElementById('kbt'), seen:n, open:/All Is Motion/.test(document.getElementById('kbtrail').textContent)};}
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
