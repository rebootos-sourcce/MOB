const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve('source.html');
let PASS=0,FAIL=0;
/* THE BOOT IS A THREE SECOND SHEET, so every page these gates open has to be
   allowed to finish booting before anything is measured or clicked. Without
   it the gates race the boot: they wait under a second, the sheet is still
   up, and a run fails intermittently on whichever surface it happened to
   reach first. Measured once as four failures in one run of four that would
   not reproduce, which is exactly the shape of this kind of race. */
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:12000});}
 catch(e){/* reduced motion clears it synchronously; a miss is not a failure */}};
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};

(async()=>{
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const page=await browser.newPage({viewport:{width:1600,height:1000}});
const errs=[];
page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
page.on('pageerror',e=>errs.push('PAGEERROR: '+e.message));
await page.goto(FILE,{waitUntil:'load'}); await booted(page);
await page.waitForTimeout(900);

console.log('\n=== 1 · load ===');
/* THE TWO RASTERS ARE A DESIGNED FALLBACK, not a failure. figure.js keeps the
   artwork external and the vector body renders in its place when it is absent,
   which is the state this repo is in, so the two file misses are expected and
   named. Everything else is a real error. The font miss used to be on this
   list and is not any more: the typeface is carried in the file. */
const KNOWN=/fig-fetter\.png|fig-pain\.png/;
const realErrs=errs.filter(e=>!KNOWN.test(e)&&!/ERR_FILE_NOT_FOUND/.test(e));
ok(realErrs.length===0,'console errors: '+realErrs.slice(0,5).join(' | '));
console.log('  errors:',errs.length);
const shell=await page.evaluate(()=>({
 tabs:document.querySelectorAll('.tabtop').length,
 depths:document.querySelectorAll('#vbar .vt').length,
 doms:document.querySelectorAll('#doms .ib').length,
 arcs:document.querySelectorAll('#ar1 .ib').length,
 laws:document.querySelectorAll('#laws .nf').length,
 axes:document.querySelectorAll('#chg .nf').length,
 mx:document.querySelectorAll('#mx button').length,
 eshelf:!!document.getElementById('eshelf')}));
/* EIGHT. Analytics is still folded into Summary, the compass gained a door it
   never had, and Games has come back out on the owner's ruling: they are
   independent games, a place a person goes for brain release, and a game
   folded into a reference page is neither. Analytics is the one fold left. */
ok(shell.tabs===8,'8 tabs, got '+shell.tabs);
ok(shell.depths===4,'4 depths, got '+shell.depths);
ok(shell.doms===19,'19 domains, got '+shell.doms);
ok(shell.arcs===12,'12 archetypes, got '+shell.arcs);
ok(shell.laws===21,'21 law fields, got '+shell.laws);
ok(shell.axes===18,'18 axis fields (9 held + 9 opposite), got '+shell.axes);
ok(shell.mx===171,'171 matrix cells, got '+shell.mx);
ok(shell.eshelf,'#eshelf element exists');
console.log('  shell:',JSON.stringify(shell));

console.log('\n=== 2 · one tab surface visible, plus whatever it carries ===');
/* THE INVARIANT MOVED, because the information architecture did. It used to be
   one visible surface per tab and nothing else, which is what caught three
   stacking bugs. Two surfaces are now folded inside others: #ana lives in #sum
   and #games lives in #know, so the parent being visible makes the child
   visible with it and that is the point. The invariant is that exactly one TAB
   surface is visible, and anything else visible must be a descendant of it. A
   sibling surface showing through is still the bug it always was. */
/* Analytics is the one fold left. Games came back out on the owner's ruling
   and has its own tab and its own host again. */
const FOLDOF={ana:'sum'};
/* indexed by the TAB integer, not by position, which is the rule this repo
   keeps relearning. 5 is Intake and it is not swept here. */
const TABN=['Story','Summary','Field','Energy','Analytics','Intake','Knowledge',
 'Games','Compass'];
for(const i of [0,1,2,3,4,6,7,8]){
 await page.evaluate(n=>setTab(n),i);
 await page.waitForTimeout(260);
 const vis=await page.evaluate(()=>{
  const ids=['story','sum','cv','emap','ana','know','games','cone'];
  return ids.filter(id=>{const e=document.getElementById(id);if(!e)return false;
   const r=e.getBoundingClientRect();
   return getComputedStyle(e).display!=='none'&&r.width>0&&r.height>0;});});
 const tops=vis.filter(id=>!FOLDOF[id]);
 const orphan=vis.filter(id=>FOLDOF[id]&&tops.indexOf(FOLDOF[id])<0);
 ok(tops.length===1&&orphan.length===0,
  TABN[i]+': expected one tab surface and only its own folds, got ['+vis+']');
 console.log('  '+TABN[i].padEnd(10),'visible:',vis.join(',')||'NONE');}

console.log('\n=== 3 · CSS coverage. every class a renderer emits has a rule. ===');
const cssMiss=await page.evaluate(()=>{
 const defined=new Set();
 for(const sh of document.styleSheets){
  let rules; try{rules=sh.cssRules}catch(e){continue}
  for(const r of rules){
   const walk=rr=>{ if(rr.selectorText)
     (rr.selectorText.match(/\.[A-Za-z][\w-]*/g)||[]).forEach(c=>defined.add(c.slice(1)));
    if(rr.cssRules)for(const k of rr.cssRules)walk(k);};
   walk(r);}}
 const used=new Set();
 document.querySelectorAll('*').forEach(e=>e.classList.forEach(c=>used.add(c)));
 return [...used].filter(c=>!defined.has(c));});
ok(cssMiss.length===0,'classes with no CSS rule: '+cssMiss.join(', '));
console.log('  unstyled classes:',cssMiss.length?cssMiss.join(', '):'none');

console.log('\n=== 4 · type floor. nothing under 11px in CSS pixels. ===');
const small=await page.evaluate(()=>{
 const out={};
 /* ONE EXCEPTION, NAMED, AND IT IS NOT A LOOPHOLE.

    The floor exists because a string a person has to read in order to use the
    product must be readable. A wordmark subtitle is not that: it is identity,
    it is read once, it says nothing operational, and nothing is lost by
    somebody skipping it. The owner ruled it two points down from the floor
    and this records the carve out rather than quietly lowering the floor for
    everything.

    It is the only exception and it is by class, so the next thing that wants
    to be small has to come and argue here. */
 const EXEMPT=['bs'];
 document.querySelectorAll('*').forEach(e=>{
  if(e.closest('svg'))return;                    // svg text scales with viewBox
  const t=(e.textContent||'').trim();
  if(!t||e.children.length)return;
  if(EXEMPT.some(c=>e.classList.contains(c)))return;
  const fs=parseFloat(getComputedStyle(e).fontSize);
  if(fs<11){const k=e.className+' @'+fs+'px';out[k]=(out[k]||0)+1;}});
 return out;});
ok(Object.keys(small).length===0,'sub-11px text: '+JSON.stringify(small));
console.log('  sub-floor elements:',Object.keys(small).length?JSON.stringify(small):'none');

console.log('\n=== 5 · no all-caps UI copy ===');
const caps=await page.evaluate(()=>{
 const bad=[];
 document.querySelectorAll('*').forEach(e=>{
  if(e.children.length||e.closest('svg'))return;
  const t=(e.textContent||'').trim();
  if(t.length<7)return;
  const st=getComputedStyle(e);
  if(st.textTransform==='uppercase'){bad.push('transform:'+t.slice(0,28));return;}
  const letters=t.replace(/[^A-Za-z]/g,'');
  if(letters.length>6&&letters===letters.toUpperCase())bad.push(t.slice(0,34));});
 return bad;});
ok(caps.length===0,'all-caps strings: '+caps.slice(0,6).join(' | '));
console.log('  all-caps strings:',caps.length?caps.slice(0,6).join(' | '):'none');

/* ============================================================
   6. A panel fills the column that holds it, and no single class
   name is declared twice with conflicting geometry.

   The letting go deck declared a bare .card with width:min(380px,
   100% - 32px) after the rail panels had already claimed .card.
   The later rule won, so both rails rendered 32px narrower than
   their own column and every control inside sat beside dead space.
   Nothing failed, nothing logged, and it only showed up when
   someone measured. Two gates, because one word per concept is a
   ruling and a collision like this is how it gets broken quietly.
   ============================================================ */
console.log('\n=== 6 \u00b7 panels fill their columns, no name declared twice ===');
const fill=await page.evaluate(()=>{
 const bad=[];
 document.querySelectorAll('.mid > .col').forEach((col,i)=>{
  const cw=col.getBoundingClientRect().width;
  [...col.children].forEach(ch=>{
   const w=ch.getBoundingClientRect().width;
   if(cw-w>1)bad.push('col '+i+' child .'+String(ch.className).split(' ')[0]
    +' is '+w.toFixed(0)+' inside '+cw.toFixed(0));});});
 return bad;});
ok(fill.length===0,'panels short of their column: '+fill.join(' | '));
console.log('  short panels:',fill.length?fill.join(' | '):'none');

const dupe=await page.evaluate(()=>{
 /* a single class selector, no combinator and no second class, is a
    claim on that word. two such claims both setting geometry is the
    collision. */
 const GEO=['width','padding','padding-left','padding-right','max-width',
            'display','flex-direction'];
 const seen={}, bad=[];
 for(const sh of document.styleSheets){
  let rules; try{rules=sh.cssRules}catch(e){continue}
  const walk=r=>{
   if(r.selectorText&&/^\.[A-Za-z][\w-]*$/.test(r.selectorText.trim())){
    const k=r.selectorText.trim();
    const props=GEO.filter(g=>r.style.getPropertyValue(g));
    if(props.length){
     if(seen[k])bad.push(k+' declared twice, both setting '+props.join('/'));
     else seen[k]=1;}}
   if(r.cssRules&&!(r.media))for(const c of r.cssRules)walk(c);};
  for(const r of rules)walk(r);}
 return bad;});
ok(dupe.length===0,'class names declared twice with geometry: '+dupe.join(' | '));
console.log('  colliding names:',dupe.length?dupe.join(' | '):'none');

/* ============================================================
   7. The product makes no outbound request. Any of them.

   This file linked fonts.googleapis.com and fonts.gstatic.com, so
   every load sent the person's IP to Google before they had typed
   a word, in a product that holds somatic and psychological self
   report and promises nothing leaves the device. The typeface is
   carried now. This gate watches the network rather than reading
   the source, because a request can be made from anywhere.
   ============================================================ */
console.log('\n=== 7 \u00b7 nothing leaves the device ===');
{
 const asked=[];
 const p2=await browser.newPage({viewport:{width:1600,height:1000}});
 p2.on('request',r=>{const u=r.url(); if(!/^(file|data|blob|about):/.test(u))asked.push(u);});
 await p2.goto(FILE,{waitUntil:'load'}); await booted(p2);
 await p2.waitForTimeout(900);
 /* exercise the surfaces most likely to reach for something */
 await p2.evaluate(()=>{loadP(8);setTab(TAB.FIELD);render();
  setTab(TAB.ENERGY);render();setTab(TAB.KNOW);render();setTab(TAB.GAMES);render();});
 await p2.waitForTimeout(400);
 /* the two rasters are the only thing this product ever reaches for, and they
    are relative, so on a server they would be two requests to that server and
    nowhere else. A third of anything is a regression. */
 const off=asked.filter(u=>!/fig-fetter\.png|fig-pain\.png/.test(u));
 ok(off.length===0,'no outbound request beyond the two local rasters: '+off.slice(0,4).join(' | '));
 ok(asked.every(u=>u.indexOf('googleapis')<0&&u.indexOf('gstatic')<0),
  'and nothing at all goes to a font host');
 console.log('  outbound requests:',asked.length?asked.slice(0,4).join(' | '):'none');
 /* and the typeface actually resolved, so the fix did not quietly cost the
    type. a silent fallback here would look like a success. */
 const face=await p2.evaluate(async()=>{
  try{await document.fonts.ready;}catch(e){}
  const set=[...document.fonts].map(f=>f.family+' '+f.status);
  return {loaded:set, inter:[...document.fonts].some(f=>/Inter/.test(f.family)&&f.status==='loaded')};});
 ok(face.inter,'and Inter resolved from the file rather than falling back silently: '
  +face.loaded.join(', '));
 console.log('  faces:',face.loaded.join(', ')||'none');
 await p2.close();
}

console.log('\n=== 8 \u00b7 the tap floor. 44 by 44, every interactive element. ===');
/* THE GATE HAD A HOLE. Gate 4 checks the type floor and nothing checked the
   tap floor, which is the other measured number in this product's own UX rules
   and the one it was breaking in sixty nine places across three surfaces. A
   floor with no check is a preference.

   Measured on the element's own box, and only where it is actually on screen:
   a control in a folded section has no box and is not a violation. */
{
 const page3=await browser.newPage({viewport:{width:1600,height:1000}});
 await page3.goto(FILE,{waitUntil:'load'}); await booted(page3); await page3.waitForTimeout(900);
 const tap=await page3.evaluate(async()=>{
  const out={};
  const tabs=TABDEF.map(t=>[t.k,t.nm]);
  for(const [k,nm] of tabs){
   loadP(6); setTab(k);
   await new Promise(r=>setTimeout(r,120));
   const bad=[...document.querySelectorAll(
     'button,select,input:not([type=range]),textarea,[role=tab]')]
    /* THE TARGET IS WHAT A FINGER CAN LAND ON, not what is painted. A native
       checkbox ignores padding, so an 18px box inside a label that meets the
       floor still has a 44px target, because clicking the label toggles it.
       That is a fact about the platform and not an exemption: measure the
       label where one wraps the control. */
    .map(e=>{
     const lab=e.closest&&e.closest('label');
     const box=(lab&&(e.type==='checkbox'||e.type==='radio'))?lab:e;
     return {e:e,r:box.getBoundingClientRect()};})
    .filter(x=>{
     const r=x.r;
     if(r.width<1||r.height<1)return false;            /* not on screen */
     if(getComputedStyle(x.e).visibility==='hidden')return false;
     return r.width<44||r.height<44;})
    .map(x=>{const e=x.e, r=x.r;
     return ((e.textContent||'').trim()||e.getAttribute('aria-label')||e.title||e.id||'?')
      .slice(0,26)+' '+Math.round(r.width)+'x'+Math.round(r.height);});
   out[nm]={n:bad.length,worst:[...new Set(bad)].slice(0,4)};}
  return out;});
 Object.keys(tap).forEach(nm=>{
  ok(tap[nm].n===0,nm+': '+tap[nm].n+' controls under the 44px tap floor  '
   +tap[nm].worst.join(' | '));
  console.log('  '+nm.padEnd(11),tap[nm].n?(tap[nm].n+' under floor'):'clean');});
 await page3.close();
}

console.log('\n=== 9 \u00b7 four lightings, each its own ===');
/* A lighting is not a skin. Each has to resolve its own tokens and produce its
   own ground, and nothing checked that: snow was asserted by the shots tool and
   the other three were never measured at all.

   WHAT THIS GATE DOES NOT DO, stated rather than implied. It does not score
   contrast per lighting. Two probes tried: a regex that only knew rgb() read
   null from the color-mix grounds Punch and Glass build and fell back to its
   own defaults, so all four reported identical; a canvas readback did no
   better on oklab. Contrast on a computed ground needs pixel sampling from a
   real screenshot, which is a different tool than this one. Gate 4 holds the
   type floor and the measured contrast work is recorded in REVIEW-fields.md.
   A number this gate cannot stand behind is worse than no number. */
{
 const p4=await browser.newPage({viewport:{width:1600,height:1000}});
 await p4.goto(FILE,{waitUntil:'load'}); await booted(p4); await p4.waitForTimeout(900);
 const lit=await p4.evaluate(async()=>{
  const out={};
  for(const b of [...document.querySelectorAll('#themes button')]){
   const nm=(b.getAttribute('aria-label')||'').replace(' theme','');
   b.click(); loadP(6); setTab(TAB.FIELD);
   await new Promise(r=>setTimeout(r,220));
   const cs=getComputedStyle(document.body);
   out[nm]={cls:document.body.className.split(' ').filter(x=>!/^tab-/.test(x)).join(' '),
    theme:S.theme,
    /* the DECLARED token, not the computed colour. getComputedStyle on the
       body reported the dark ground for snow and the punch ground for glass,
       while shots.js proves snow renders light at rgb(237,235,230) and the
       body class is demonstrably correct. Reading the token compares what each
       lighting declares, needs no colour parsing, and cannot be wrong about
       which rule won. */
    bg:cs.getPropertyValue('--bg').trim(),
    ink:cs.getPropertyValue('--ink').trim(),
    panel:cs.getPropertyValue('--panel').trim(),
    edge:cs.getPropertyValue('--edge').trim(),
    accent:cs.getPropertyValue('--accent').trim()};}
  return out;});
 const names=Object.keys(lit);
 /* SIX, on the owner's ruling. Glass white is the same material under a
   different sun; Flat is the opposite position to all five others. */
 ok(names.length===6,'six lightings, got '+names.length+': '+names.join(', '));
 names.forEach(nm=>{
  const L=lit[nm];
  ok(!!L.panel&&!!L.edge&&!!L.ink&&!!L.accent,
   nm+': resolves its own tokens');
  ok(L.ink!==L.bg,nm+': ink and ground are not the same colour');
  console.log('  '+nm.padEnd(7),'['+(L.cls||'default')+'] --bg '+L.bg.slice(0,34));});
 /* four lightings that produce three grounds means one of them is not a
    lighting. This is the check that would have caught Glass inheriting Dark. */
 /* six lightings that produce five grounds means one of them is not a
    lighting. This is the check that caught Glass inheriting Dark. */
 const grounds=new Set(names.map(n=>lit[n].bg));
 ok(grounds.size===6,'six distinct grounds, got '+grounds.size);
 const inks=new Set(names.map(n=>lit[n].ink));
 ok(inks.size>=2,'and the ink moves with them, got '+inks.size+' distinct');
 /* the accent is one value across every lighting but snow, which deepens it
    to hold against paper. That is the ruling and this is where it is held. */
 ok(lit.Dark.accent===lit.Punch.accent&&lit.Dark.accent===lit.Glass.accent,
  'the accent is one value on every dark lighting that inherits it');
 /* Flat carries its own accent on purpose: with no material doing any work,
    colour carries the whole hierarchy, so it gets a colour strong enough to. */
 ok(lit.Flat.accent!==lit.Dark.accent,'and Flat states its own, because it has nothing else');
 ok(lit.Snow.accent!==lit.Dark.accent,'and deepens on paper');
 await p4.close();
}

/* ============================================================
   10 · THE BODY PAINTS WHAT IT COUNTS

   The address marks on the Body figure sat inside a clip whose only child was
   a <g>. A clipPath may hold shapes, <text> and <use>; a <g> is not valid
   geometry, is ignored, and a clip with no geometry clips everything away. So
   forty nine marks were in the document, correctly placed, correctly sized,
   painting nothing, on every layer. Reading the source could not catch it and
   counting the nodes could not catch it, because both were right.

   This gate does the only thing that could: it counts the marks, then reads
   the pixels under them and asserts the figure is not the same picture with
   them as without. A drawing that is in the DOM and not on the screen fails
   here.
   ============================================================ */
{
 console.log('\n=== 10 · the body paints what it counts ===');
 const p5=await browser.newPage({viewport:{width:1600,height:1000}});
 await p5.goto(FILE,{waitUntil:'load'}); await booted(p5);
 await p5.waitForTimeout(900);
 await p5.selectOption('select',{index:1});
 await p5.waitForTimeout(500);
 const tt=await p5.$$eval('.tabtop',a=>a.map(x=>x.textContent.trim()));
 await p5.$$eval('.tabtop',(a,i)=>a[i].click(),tt.findIndex(t=>/Body/i.test(t)));
 await p5.waitForTimeout(800);

 for(const [layer,label] of [['bands','Fetters'],['sab','Saboteurs'],['cx','Complexes']]){
  await p5.evaluate(k=>{const e=document.querySelector('#lbar [data-pml="'+k+'"]');if(e)e.click();},layer);
  await p5.waitForTimeout(450);
  const m=await p5.evaluate(()=>({
   n:document.querySelectorAll('#emap .pm-n').length,
   it:document.querySelectorAll('#emap .pm-it').length,
   btn:(()=>{const b=document.querySelector('#lbar .pm-lb.on b');return b?+b.textContent:null;})()}));
  const drawn=m.n+m.it;
  ok(drawn>0,label+': something is drawn, got '+drawn);
  /* the count on the button is what opens. A button that says 49 over an
     empty figure is the defect this gate exists for. */
  if(m.btn!==null)ok(m.btn===0||drawn>0,label+': the button count and the drawing agree, '
   +m.btn+' counted, '+drawn+' drawn');
  /* AND THE MARKS REACH THE PIXELS.

     A first cut of this check asked whether a mark had a bounding box, which
     every clipped element still has, so it passed against the very bug it was
     written for. The only honest question is whether the screen changes. Two
     shots of the same figure, one with the marks hidden and one with them
     shown, and identical bytes means they painted nothing. */
  const well=await p5.$('#emap .pm-well');
  const shotOn=await well.screenshot();
  await p5.addStyleTag({content:'#emap .pm-n,#emap .pm-it{display:none!important}'});
  await p5.waitForTimeout(160);
  const shotOff=await well.screenshot();
  await p5.evaluate(()=>{const t=[...document.querySelectorAll('style')]
   .filter(e=>/pm-n.*display:none/.test(e.textContent));t.forEach(e=>e.remove());});
  await p5.waitForTimeout(160);
  ok(!shotOn.equals(shotOff),
   label+': hiding the marks changes the picture. identical means they paint nothing');
 }
 /* the clip itself. This is the shape of the bug, named, so nobody puts the
    <g> back. */
 const clipOK=await p5.evaluate(()=>{
  const c=document.getElementById('pmClip'); if(!c)return 'no clipPath';
  const bad=[...c.children].filter(e=>!/^(path|circle|ellipse|rect|polygon|polyline|line|text|use)$/i
   .test(e.tagName)).map(e=>e.tagName);
  return bad.length?('invalid clip children: '+bad.join(',')):'ok';});
 ok(clipOK==='ok','the body clip holds only valid geometry, got '+clipOK);
 console.log('  clip:',clipOK);
 await p5.close();
}

/* ============================================================
   11 · THE BOOT, AND ITS COLOURS

   The boot runs before any script has painted, so it cannot read the palette
   from the engine and its seven seat colours are canon.js values copied into
   the stylesheet. A copy drifts. This is the check that says so: every seat
   fill in the boot has to be a PAL value and all seven have to be there.

   And the boot has to LEAVE. A fade is CSS and a removal is not: an element
   at opacity zero still covers the app, still takes pointer events and is
   still in the tab order, so a boot that only animates out is a transparent
   sheet over a working instrument.
   ============================================================ */
{
 console.log('\n=== 11 · the boot ===');
 /* THIS ONE DOES NOT WAIT FOR THE BOOT, because the boot is what it is
    checking. The shared helper was applied to every goto in the file and it
    made this gate assert the sheet was up after waiting for it to come
    down, which it then correctly reported as a failure. */
 const p6=await browser.newPage({viewport:{width:1200,height:800}});
 await p6.goto(FILE,{waitUntil:'load'});
 await p6.waitForTimeout(250);
 const early=await p6.evaluate(()=>{
  const e=document.getElementById('boot');
  if(!e)return null;
  const seats=[...document.querySelectorAll('.b-seat')]
   .map(x=>getComputedStyle(x).fill);
  return {up:true,seats:seats,addr:document.querySelectorAll('.b-addr line').length,
    pal:(typeof PAL!=='undefined')?Object.keys(PAL).map(k=>PAL[k]):[]};});
 ok(!!early,'the boot is up while the app loads');
 if(early){
  ok(early.seats.length===7,'seven seats, got '+early.seats.length);
  /* every boot seat colour is a PAL colour, compared as rgb so the
     stylesheet may write hex and the engine may write anything. */
  const toRgb=h=>{const m=/^#?([0-9a-f]{6})$/i.exec(h);if(!m)return h;
   const n=parseInt(m[1],16);
   return 'rgb('+((n>>16)&255)+', '+((n>>8)&255)+', '+(n&255)+')';};
  const palRgb=early.pal.map(toRgb);
  const off=early.seats.filter(c=>palRgb.indexOf(c)<0);
  ok(off.length===0,'every boot seat is a palette colour, off by '+off.length
   +(off.length?': '+off.join(' '):''));
  /* and all seven are distinct, so a copy that collapsed two is caught */
  ok(new Set(early.seats).size===7,'and all seven differ, got '
   +new Set(early.seats).size);
  ok(early.addr>0,'the addresses are drawn, '+early.addr+' of them');
 }
 /* THE SEQUENCE IS FIVE SECONDS NOW, with two beats of black at each end on
    the owner's ruling, so this waits past the end of it rather than past the
    end of the old one. Measured: booted at 5317ms and the node gone with it. */
 await p6.waitForTimeout(5800);
 const late=await p6.evaluate(()=>({gone:!document.getElementById('boot'),
   booted:document.body.classList.contains('booted')}));
 ok(late.gone,'the boot is removed from the document, not just faded');
 ok(late.booted,'and the body says so');
 console.log('  cleared:',late.gone);
 await p6.close();
}

await browser.close();
console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);
})();
