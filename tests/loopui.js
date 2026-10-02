/* The Your patterns gate, ui/loopread.js, in a real Chromium.

   One block, two homes: the Field's right column (#loopside) and Summary's
   own zone (#sumloop). What this holds is what the person sees:

     silent on an unread field, in both homes
     one home per screen: the rail section is the Field's only
     every count label carries its meaning from the gloss table, the one
       tooltip the product has, character for character (round PO)
     no day count anywhere in the block
     the one Next acts on the address it names
     confirmed, declined and not done render from a record that has them

   CHECKED AGAINST A KNOWN BAD CASE FIRST. The label check is run on a copy
   of the block with one meaning stripped off, and must call it bare before
   it is trusted on the real one.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node tests/loopui.js */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};

/* run in the page: the worked record, Angela with two entries and lines at
   one address, optionally with the practice the engine gate uses */
const SETUP=function(full){
 var i=PEOPLE.findIndex(function(x){return x.nm==='Angela';}); loadP(i);
 var T1='2026-09-20T08:00:00.000Z', T0='2026-09-25T08:00:00.000Z', TL='2026-10-02T08:00:00.000Z';
 CURP.story.entries=[{t:T1,text:PEOPLE[i].says,imprints:4,bands:{}},
  {t:'2026-09-21T08:00:00.000Z',text:'I feel ashamed and my chest is tight when I speak up at work.',imprints:3,bands:{}}];
 CURP.meter.unique=['53:Llimit:0','53:Llimit:1','53:Rlimit:0','53:Ltruth:0'];
 CURP.practice=practiceBlank(); CURP.trace=undefined;
 if(full){
  var P=practiceBlank(), sys={system:'loopui',model_version:'0'};
  var go=function(a,b,t){var r=practiceDo(P,a,b,t||T0); if(!r.ok)throw new Error(a+': '+r.errs.join(' | ')); P=r.P;};
  go('protocol_add',{id:'p1',class:'release',target_patterns:['addr:46'],steps:[{type:'release',instruction:'a'}],generated_by:sys});
  go('protocol_accept',{id:'p1'});
  go('protocol_add',{id:'p2',class:'release',target_patterns:['addr:54'],steps:[{type:'release',instruction:'b'}],generated_by:sys});
  go('protocol_reject',{id:'p2'});
  go('ritual_create',{id:'r1',protocol_id:'p1',title:'R',tags:['Solar']});
  go('event_schedule',{id:'pe1',ritual_id:'r1',scheduled_at:T0});
  go('event_move',{id:'pe1',to:'available'}); go('event_move',{id:'pe1',to:'started'});
  go('event_move',{id:'pe1',to:'completed',duration_seconds:600,quality:{presence:7,effort:6}});
  ['pe2','pe3','pe4'].forEach(function(id,k){
   go('event_schedule',{id:id,ritual_id:'r1',scheduled_at:new Date(Date.parse(T0)+(k+1)*86400000).toISOString()});
   go('event_move',{id:id,to:'missed'},TL);});
  CURP.practice=P;
  CURP.trace={v:1,nodes:[{type:'story',id:T1,src:'known'},{type:'pattern',id:'55',src:'known'}],
   edges:[{from:'story:'+T1,to:'pattern:55',edge:'supports',src:'user_confirmed',was:'inferred'}]};}
 setTab(TAB.FIELD); render();
 OPENSEC.right.loop=1; paintSections();};

/* run in the page: every count label in a block carries the table's own
   sentence for its term on a tooltip carrier. Returns the bare ones. */
const BARE=function(root){
 var want={Confirmed:'confirmed',Unanswered:'unanswered',Declined:'declined',Practised:'practised'};
 var bare=[];
 root.querySelectorAll('.lp-fl').forEach(function(l){
  var t=l.textContent.trim(), c=l.querySelector('.tipu');
  var s=want[t]?unpackOf(want[t]):'';
  if(!s||!c||c.getAttribute('data-tip')!==s)bare.push(t);});
 return bare;};

(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [W,H] of [[1600,1000],[390,844]]){
  console.log('\n=== '+W+' ===');
  const p=await b.newPage({viewport:{width:W,height:H}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
  await p.goto(FILE); await booted(p);

  /* 1. silent on an unread field */
  const blank=await p.evaluate(()=>{loadP(0); setTab(TAB.FIELD); render();
   var sec=document.querySelector('.lsec.lp-sec');
   var o={unread:computeSeen().unread, html:document.getElementById('loopside').innerHTML,
    shown:getComputedStyle(sec).display};
   setTab(TAB.SUMMARY); render(); if(typeof sumRender==='function')sumRender();
   o.sum=!!document.getElementById('sumloop'); return o;});
  ok(blank.unread===true,'the blank profile is unread');
  ok(blank.html==='','an unread field writes nothing into the rail block, got '+blank.html.length+' characters');
  ok(blank.shown==='none','and the rail section steps out of the column');
  ok(blank.sum===false,'and Summary carries no patterns zone');

  /* 2. the Field's side column */
  await p.evaluate(SETUP,false); await p.waitForTimeout(300);
  const f=await p.evaluate(BARE_SRC=>{
   var BARE=eval('('+BARE_SRC+')');
   var h=document.getElementById('loopside'), sec=document.querySelector('.lsec.lp-sec');
   var vis=[].slice.call(document.querySelectorAll('.lp')).filter(function(e){return e.getClientRects().length>0;});
   /* the known bad case: a copy with one meaning taken off */
   var bad=h.cloneNode(true), c=bad.querySelector('.lp-fl .tipu'); if(c)c.removeAttribute('data-tip');
   return {shown:getComputedStyle(sec).display, figs:h.querySelectorAll('.lp-f').length,
    rows:h.querySelectorAll('.lp-p').length, bare:BARE(h), badBare:BARE(bad), visible:vis.length,
    text:h.innerText, next:(h.querySelector('[data-lprel]')||{}).getAttribute?h.querySelector('[data-lprel]').getAttribute('data-lprel'):null,
    open:h.querySelectorAll('.lp-p[open]').length};},BARE.toString());
  ok(f.badBare.length===1,'the label check calls a stripped label bare: the known bad case, got '+JSON.stringify(f.badBare));
  ok(f.shown!=='none','on the Field the rail section is shown');
  ok(f.figs===4,'four counts, got '+f.figs);
  ok(f.bare.length===0,'every count label carries the gloss sentence on its carrier, bare: '+JSON.stringify(f.bare));
  ok(f.rows===4,'four patterns before Show all, got '+f.rows);
  ok(f.open===1,'the first pattern opens on its chain, the rest are closed, got '+f.open);
  ok(f.visible===1,'one patterns block on the Field screen, got '+f.visible);
  ok(f.next==='46','the Next names address 46, the one the words named, got '+f.next);
  ok(!/\bday\s*\d|\d+\s*days?\b|streak/i.test(f.text),'no day count and no streak in the block');
  ok(/from your words/.test(f.text)&&/Not answered yet/.test(f.text),'the chain says where the pattern came from and that it is unanswered');

  /* 3. the Next acts on the address it names */
  const pressed=await p.evaluate(()=>{var got=null, keep=window.relPick;
   window.relPick=function(ids){got=ids;};
   try{document.querySelector('#loopside [data-lprel]').click();}finally{window.relPick=keep;}
   return got;});
  ok(JSON.stringify(pressed)==='[46]','Run a release opens the run at 46, got '+JSON.stringify(pressed));

  /* 4. Show all, and back */
  const all=await p.evaluate(()=>{document.querySelector('#loopside [data-lpall]').click();
   var n=document.querySelectorAll('#loopside .lp-p').length;
   document.querySelector('#loopside [data-lpall]').click();
   return [n,document.querySelectorAll('#loopside .lp-p').length];});
  ok(all[0]===5&&all[1]===4,'Show all lists every pattern and the second press goes back to four, got '+all);

  /* 5. Summary's own zone, and only one home on screen */
  const s=await p.evaluate(BARE_SRC=>{var BARE=eval('('+BARE_SRC+')');
   setTab(TAB.SUMMARY); render(); if(typeof sumRender==='function')sumRender();
   var z=document.getElementById('sumloop'), sec=document.querySelector('.lsec.lp-sec');
   var vis=[].slice.call(document.querySelectorAll('.lp')).filter(function(e){return e.getClientRects().length>0;});
   return {z:!!z, slot:z&&z.getAttribute('data-slot'), railShown:getComputedStyle(sec).display,
    visible:vis.length, bare:z?BARE(z):['no zone'], day:!!document.getElementById('sumday'),
    inDay:z?!!z.closest('#sumday'):false};},BARE.toString());
  ok(s.z&&s.slot==='loop','Summary carries the block as its own named zone, #sumloop');
  ok(s.railShown==='none','the rail section is hidden on Summary, so the block is not shown twice');
  ok(s.visible===1,'one patterns block on the Summary screen, got '+s.visible);
  ok(s.bare.length===0,'and its labels carry their meanings too');
  ok(s.day&&!s.inDay,'the Daily Summary slot is still there and the patterns zone is not inside it');

  /* 6. a record with practice on it */
  await p.evaluate(SETUP,true); await p.waitForTimeout(300);
  const q=await p.evaluate(()=>{var h=document.getElementById('loopside');
   var fig={}; h.querySelectorAll('.lp-f').forEach(function(x){fig[x.querySelector('.lp-fl').textContent.trim()]=x.querySelector('.lp-fv').textContent.trim();});
   return {fig:fig, text:h.innerText, conf:h.querySelectorAll('.lp-st.lp-confirmed').length};});
  ok(q.fig.Confirmed==='2'&&q.fig.Declined==='1'&&q.fig.Practised==='1','the counts read 2 confirmed, 1 declined, 1 practised, got '+JSON.stringify(q.fig));
  ok(q.conf===2,'two patterns wear Confirmed, got '+q.conf);
  ok(/practice for Martyrdom\. No reason was recorded\./.test(q.text),'the declined practice names its pattern and says no reason was recorded');
  ok(/came due 3 times in a row/.test(q.text),'the miss run is said once, as a run');
  ok(/You chose a practice for it/.test(q.text),'the chain says how 46 was confirmed');
  ok(!/\bday\s*\d|\d+\s*days?\b|streak/i.test(q.text),'still no day count');

  /* 7. render is not slowed by the graph: the read is cached on the record */
  const t=await p.evaluate(()=>{setTab(TAB.FIELD); var a=performance.now(); for(var k=0;k<20;k++)render(); return (performance.now()-a)/20;});
  console.log('  render with the block, mean of 20: '+t.toFixed(1)+'ms');
  ok(errs.length===0,'no page errors: '+errs.slice(0,3).join(' | '));
  await p.close();}
 await b.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);})();
