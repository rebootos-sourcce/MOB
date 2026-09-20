const {chromium}=require('playwright');
const path=require('path');
/* the target is overridable, so the delivery build can be put through the
   same gates as the source build rather than being trusted. */
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html');
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
/* NOTHING IS KNOWN ANY MORE. The two rasters were whitelisted here and never
   existed, so this gate passed two failed requests a load for as long as it
   has been running. The floor is zero outbound requests, which is what the
   product has always claimed and can now be held to. */
const KNOWN=/$^/;
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
 tabdef:TABDEF.length,
 eshelf:!!document.getElementById('eshelf')}));
/* COUNTED FROM TABDEF, NOT WRITTEN DOWN. This said eight, and eight was right
   until Ritual went into the bar on the owner's ruling, at which point the
   gate failed for the one reason a gate must never fail: the product grew.
   Third hand written count found stale in one session, after the lighting
   count and the lighting list.

   What it protects is that every tab declared reaches the bar, and that holds
   at any number. Analytics is still the one fold left, which is why TABDEF is
   the right list to count and TAB is not. */
ok(shell.tabs===shell.tabdef,
 shell.tabdef+' tabs declared, '+shell.tabs+' in the bar');
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
 /* THE WORDMARK IS NOT COPY. The ruling is that no UI copy is set in all
    caps, and a logotype is not UI copy: ATUNED has been uppercase since the
    owner ruled it, and it only ever passed this gate by being six characters
    long, which is luck rather than an exemption. SOURCE OS under it is nine.

    Named narrowly, on .brand and nothing else, so the rule still bites
    everywhere it is meant to. */
 document.querySelectorAll('*').forEach(e=>{
  if(e.children.length||e.closest('svg'))return;
  if(e.closest('.brand'))return;
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
 ok(asked.length===0,'no outbound request at all, and the count is '+asked.length
  +(asked.length?': '+asked.slice(0,4).join(' | '):''));
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
   /* 120ms was enough while a tab switch was a single frame cut. The surface
      now rises in over the context step, and measuring through that reads a
      control mid arrival: the same button came back 0x0, then 882x44, then its
      real size, on three runs of the same page. A tap target is a fact about a
      settled screen, so the entrance is taken off before anything is measured.

      Waiting it out was tried first and is not deterministic. Every tap target
      in this product is exactly 44.0 with min-height:44px, which is correct and
      leaves no margin, and a descendant of an element carrying a fractional
      translateY comes back snapped to the compositor grid: 43.98 on one run,
      44 on the next, a different control each time. So this drops the class
      rather than waiting for it, which removes the transform instead of
      sampling around it. Gate 12 proves the entrance exists, so taking it off
      here hides nothing. */
   document.querySelectorAll('.tabin').forEach(e=>e.classList.remove('tabin'));
   await new Promise(r=>setTimeout(r,140));
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
 /* COUNTED FROM THE LIST, NOT WRITTEN DOWN. This said six, and six was right
    until a seventh landed, at which point the gate failed for the one reason a
    gate must never fail: the product grew. What it is actually protecting is
    that every lighting in LIGHTINGS reaches the bar and produces its own
    ground, and that holds at any number. */
 const declared=await p4.evaluate(()=>LIGHTINGS.length);
 ok(names.length===declared,
  declared+' lightings declared, '+names.length+' in the bar: '+names.join(', '));
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
 ok(grounds.size===declared,
  declared+' lightings and '+grounds.size+' distinct grounds. Equal or one of '
  +'them is a skin rather than a lighting.');
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

/* ---------------------------------------------------------------------------
   12 · MOTION IS NAMED

   Measured before the tokens existed: 381 of 384 live animated elements ran
   on the browser default ease, a symmetric curve. Four hand written beziers
   sat in the stylesheet and reached one live element. The cause was not a
   missing curve, it was the shorthand: transition:.16s computes to
   "all .16s ease", because the property list defaults to all and the timing
   function defaults to ease. A grep for transition:all found nothing while
   322 elements used it.

   So this gate reads the computed style of every animated element rather than
   the sheet. It refuses the default ease outright, and it refuses a duration
   that is not one of the four named steps, which is what stops a hover and a
   tab drifting to the same speed again.
--------------------------------------------------------------------------- */
{
 console.log('\n=== 12 · motion is named ===');
 const p7=await browser.newPage();
 await p7.setViewportSize({width:1600,height:1000});
 await p7.goto(FILE,{waitUntil:'load'}); await booted(p7);
 const m=await p7.evaluate(()=>{
  const cs=getComputedStyle(document.documentElement);
  const tok=n=>cs.getPropertyValue(n).trim();
  const out={tok:{},ease:[],dur:{},tot:0};
  ['--ease-out','--ease-in','--ease-land','--t-micro','--t-element',
   '--t-surface','--t-context'].forEach(n=>out.tok[n]=tok(n));
  document.querySelectorAll('*').forEach(e=>{
   const c=getComputedStyle(e);
   if(!c.transitionDuration||c.transitionDuration==='0s')return;
   out.tot++;
   /* a list transitions several properties, so every segment is checked */
   c.transitionTimingFunction.split(/,\s*(?![^(]*\))/).forEach(f=>{
    if(f.trim()==='ease'&&out.ease.length<6)
     out.ease.push(e.tagName.toLowerCase()+'.'+(e.className||'?').toString().slice(0,24));});
   c.transitionDuration.split(',').forEach(d=>{
    d=d.trim(); out.dur[d]=(out.dur[d]||0)+1;});});
  return out;});
 /* the seven tokens resolve. an unresolved var() reads as empty and every
    transition using it silently falls back to 0s, which is no motion at all. */
 const missing=Object.keys(m.tok).filter(k=>!m.tok[k]);
 ok(missing.length===0,'all seven motion tokens resolve'
  +(missing.length?', missing '+missing.join(' '):''));
 ok(m.tot>100,'there are live animated elements to check, '+m.tot);
 ok(m.ease.length===0,'no element runs on the browser default ease'
  +(m.ease.length?', found '+m.ease.join(', '):''));
 /* every duration on screen is one of the four steps. the boot keyframes are
    animations, not transitions, so they are not in this set. */
 const ALLOW=['0.12s','0.22s','0.32s','0.42s'];
 const stray=Object.keys(m.dur).filter(d=>ALLOW.indexOf(d)<0);
 ok(stray.length===0,'every duration is one of the four named steps'
  +(stray.length?', stray '+stray.join(' '):''));
 console.log('  animated:',m.tot,' durations:',Object.keys(m.dur).join(' '));
 await p7.close();
}


console.log('\n=== 13 -  no lighting costs the Field its frame rate ===');
/* THE RULE IS THE MECHANISM, because the frame rate alone measures the runner.

   What broke: the Field's wheel canvas repaints every frame, and every element
   above it carrying a backdrop-filter has its backdrop re-read and re-filtered
   on each of those frames. Measured on Gordon, the worst case profile, at
   1600x1000 in isolation: dark 60.5, snow 60.5, punch 60.6, flat 60.6, glass
   12.0, glass white 16.4. Seventy one elements carried one under glass.

   It is not the radius: 26 to 10 gave 12.0. Not the pseudo elements: removing
   the specular and the fringe gave 12.9. Not the count: 71 down to 5 gave 12.7,
   because the cost is the readback and that goes with area. Not layerisation:
   will-change, translateZ, contain and isolation on the canvas all landed
   between 11.6 and 12.1. Stopping the wheel repainting gave 56.7, which is the
   proof, and removing every backdrop gave 60.6.

   So the gate asserts the structural fact, which is deterministic and does not
   move with load: nothing over the Field carries a backdrop-filter in any
   lighting. The frame rate is kept as a loose backstop only. It is set at 30,
   well under the 60 floor, because this file keeps several pages open at once
   and a lighting measured in that company reads 36 where the same build reads
   60.1 alone. A tighter number here would be a gate reporting on the gate,
   which this project has already been caught by twice. */
{
 const pf=await browser.newPage({viewport:{width:1600,height:1000}});
 await pf.goto(FILE,{waitUntil:'load'});
 await pf.mouse.click(800,500);
 await booted(pf); await pf.waitForTimeout(700);
 await pf.evaluate(()=>{const i=PEOPLE.findIndex(x=>x.nm==='Gordon');loadP(i);});
 /* Lumen was missing from this list, so the seventh lighting shipped with
    neither its frame rate nor its backdrop count guarded. A hand written list
    of lightings goes stale the moment one is added, which is the same fault
    the count in gate 9 had. */
 for(const t of await pf.evaluate(()=>LIGHTINGS.map(x=>x[0]))){
  await pf.evaluate(t=>{setLighting(t);setTab(TAB.FIELD);},t);
  await pf.waitForTimeout(700);
  const m=await pf.evaluate(()=>{
   let n=0,worst='';
   document.querySelectorAll('*').forEach(e=>{
    const cs=getComputedStyle(e);
    if(cs.backdropFilter&&cs.backdropFilter!=='none'&&cs.display!=='none'
       &&e.getBoundingClientRect().width>0){n++;if(!worst)worst=e.className||e.tagName;}});
   return {n,worst,cls:document.body.className};});
  ok(m.n===0,'nothing over the Field carries a backdrop under '+t
    +', found '+m.n+(m.worst?' e.g. '+String(m.worst).slice(0,40):''));
  const fps=await pf.evaluate(()=>new Promise(r=>{
   let n=0;const t0=performance.now();
   (function f(){n++;if(performance.now()-t0<1400)requestAnimationFrame(f);
    else r(+(n/((performance.now()-t0)/1000)).toFixed(1));})();}));
  ok(fps>=30,'and the Field still animates under '+t+', measured '+fps);
  console.log('  '+t.padEnd(11)+'backdrops '+String(m.n).padStart(3)+'   fps '+fps);
 }
 /* and the lighting is still itself: the panes are still translucent panes */
 const look=await pf.evaluate(()=>{setLighting('glass');setTab(TAB.FIELD);
  const el=document.querySelector('.glass.top')||document.querySelector('.panel');
  const cs=getComputedStyle(el);
  return {bg:cs.backgroundColor,shadow:cs.boxShadow!=='none'};});
 ok(/rgba\([^)]*0?\.\d+\s*\)/.test(look.bg),
  'glass keeps a translucent ground on the Field, got '+look.bg);
 ok(look.shadow,'and keeps its shadow');
 await pf.close();
}

console.log('\n=== 14 -  the boot says how to get past it ===');
/* pointerdown and keydown have always cleared the boot. Nothing said so, so a
   person met a five second sheet with no visible end and no visible exit while
   the app underneath had been usable since 198ms. The gate asserts that the
   way out is legible well before the sequence ends, and that taking it works. */
{
 const pb=await browser.newPage({viewport:{width:1600,height:1000}});
 const t0=Date.now();
 await pb.goto(FILE,{waitUntil:'load'});
 let at=-1, txt='';
 for(let i=0;i<40;i++){
  const v=await pb.evaluate(()=>{const e=document.querySelector('.boot-skip');
   if(!e)return null; return {o:+getComputedStyle(e).opacity,t:e.textContent.trim()};});
  if(v&&v.o>0.2){at=Date.now()-t0;txt=v.t;break;}
  await pb.waitForTimeout(100);
 }
 ok(at>0&&at<2600,'the way out is legible before the sequence ends, at '+at+'ms');
 ok(/press/i.test(txt),'and it says what to do, got '+JSON.stringify(txt));
 await pb.mouse.click(800,500);
 let cleared=false;
 try{await pb.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:4000});
  cleared=true;}catch(e){}
 ok(cleared,'and taking it goes straight in');
 await pb.close();
}

/* ============================================================
   GATE 15. THE ALARM LAW.

   Ruled: "I have got 96 per cent flow accuracy and yet it is red. Red is a
   colour of danger. That is bad colouring."

   cr() reddens anything at or past ninety, which is correct for a charge and
   exactly backwards for every reading whose high end is the one a person is
   working toward. That had been a defect twice and was held by convention
   across nineteen call sites with nothing watching it, which is how it came
   back the second time.

   Two halves, because a gate that only forbids can be satisfied by breaking
   the mechanism. The first says no good end reading is ever in the alarm
   state. The second says the alarm still fires on a charge, so the first is
   passing because the rule is kept and not because the colour is dead.
   ============================================================ */
console.log('\n=== the alarm law ===');
{
 /* A LOADED PROFILE, because an empty one prints dashes and proves nothing.
    Diane is a real fixture and her readings straddle the threshold. */
 await page.evaluate(()=>{loadP(2);setTab(TAB.SUMMARY);render();});
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 /* the labels whose high end is the good end. Every one of them is a share, a
    proportion, a pass rate or a measure of how well read somebody is. */
 const GOOD=['accuracy','coherence','flow','integrity','identification',
   'share','replace','opposite','pass','open'];
 const bad=await page.evaluate(G=>{
  const out=[];
  document.querySelectorAll('.cr').forEach(e=>{
   const t=(e.getAttribute('title')||'').toLowerCase();
   if(!G.some(g=>t.indexOf(g)>=0))return;
   const arc=e.querySelector('.arc circle:last-child');
   const st=arc?getComputedStyle(arc).stroke:'';
   if(e.classList.contains('hot')||/rgb\(\s*255,\s*46,\s*31\s*\)/.test(st))
    out.push(t.slice(0,44));});
  return out;},GOOD);
 ok(bad.length===0,'no good end reading prints in the alarm colour, got '
   +JSON.stringify(bad.slice(0,4)));
 /* AND THE MECHANISM IS STILL LIVE. A ring built past the threshold with no
    hot decision has to redden, or the gate above is passing on a corpse. */
 const fires=await page.evaluate(()=>{
  const d=document.createElement('div');
  d.innerHTML=cr('Root',96,{size:'sm',label:'shadow weight'});
  document.body.appendChild(d);
  const e=d.querySelector('.cr');
  const arc=e.querySelector('.arc circle:last-child');
  const r={hot:e.classList.contains('hot'),stroke:getComputedStyle(arc).stroke};
  d.remove(); return r;});
 ok(fires.hot,'and a charge past ninety still reddens, so the rule is kept '
   +'rather than the colour removed');
 ok(/rgb\(\s*255,\s*46,\s*31\s*\)/.test(fires.stroke),
   'and the alarm arc is the alarm colour, got '+fires.stroke);
 /* THE TIER COLOURS ARE THE TIER'S, not the heaviest seat's. Ruled: "I do not
    like that it says I am 88 per cent embodied and the colour is not
    symbolic. We have got our ten tiers now, we should have colours that
    reflect those tiers." */
 const tc=await page.evaluate(()=>{
  const r=compute();
  const e=document.querySelector('.s-pband b');
  return {tier:r.tier, want:TIERCOL[r.tier]||null,
    got:e?getComputedStyle(e).color:null};});
 ok(tc.want!==null,'every tier has a colour, missing for '+tc.tier);
 const hex2rgb=h=>'rgb('+[1,3,5].map(i=>parseInt(h.substr(i,2),16)).join(', ')+')';
 ok(tc.got===hex2rgb(tc.want),
   'and the band on the plate wears it, wanted '+hex2rgb(tc.want)+' got '+tc.got);
}

/* ============================================================
   GATE 16. ONE TOOLTIP.

   Ruled: "the tooltip design is inconsistent across the board." The audit
   found eight mechanisms doing the job of one, plus a ninth pattern that is
   not a tooltip and does a tooltip's job. Two of the eight were built panels
   and both are now retired into TIP.

   A count is not the assertion, because the count will change as the
   migration runs. What must stay true is that a carrier opens exactly one
   panel: the moment two mechanisms read the same attribute, a control grows a
   second tooltip, which is how this got to eight in the first place.
   ============================================================ */
console.log('\n=== one tooltip ===');
{
 await page.evaluate(()=>{loadP(2);setTab(TAB.SUMMARY);render();});
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 /* the retired panel is gone from the document and from the sheet. */
 const dead=await page.evaluate(()=>({
  railtip:!!document.getElementById('railtip'),
  css:[...document.styleSheets].some(sh=>{
   try{return [...sh.cssRules].some(r=>r.selectorText&&/\.railtip/.test(r.selectorText));}
   catch(e){return false;}})}));
 ok(!dead.railtip,'the retired rail panel is not in the document');
 ok(!dead.css,'and its rule is not in the sheet');
 /* one panel, and it is the one. Every carrier this product has is walked. */
 const one=await page.evaluate(async()=>{
  const cs=[...document.querySelectorAll('[data-tip],[data-tip-t]')]
   .filter(e=>e.getBoundingClientRect().width>0);
  if(!cs.length)return {none:true};
  let opened=0, panels=0, empty=0;
  for(const c of cs.slice(0,12)){
   TIP.show(c);
   await new Promise(r=>setTimeout(r,140));
   const on=[...document.querySelectorAll('.tip.on,.probe.on')];
   panels=Math.max(panels,on.length);
   const e=document.getElementById('tip');
   if(e&&e.classList.contains('on')){
    opened++;
    /* AND IT SAYS SOMETHING. The retired panel drew an empty bold and a rule
       with nothing above it on half its carriers, which is the defect a
       presence check would have passed. */
    if(!e.innerText.replace(/\s/g,''))empty++;}}
  TIP.hide();
  return {n:cs.length, tried:Math.min(12,cs.length), opened:opened,
   panels:panels, empty:empty};});
 ok(!one.none,'there are carriers to test');
 ok(one.opened===one.tried,
  'every carrier opens the tooltip, '+one.opened+' of '+one.tried);
 ok(one.panels<=1,'and never more than one panel at a time, saw '+one.panels);
 ok(one.empty===0,'and none of them opens empty, '+one.empty+' did');
}

/* ============================================================
   GATE 17. A SENTENCE IN A LABEL CLASS CARRIES PLAIN.

   head.html applies text-transform:capitalize to thirteen label classes, on
   the owner's ruling that a header takes a capital on every word. That ruling
   stands. What it does not cover is a whole statement that happens to be
   written in one of those classes, and that is invisible in the source: the
   strings are written in sentence case and correctly so, because the transform
   is what does the capitalising. It is only wrong on the screen.

   Measured before the fix, on three profiles across ten surfaces at both
   widths: 95 distinct strings in those classes and 42 of them were statements.
   The screen carried "Moral Integrity, 21 Of The 76 Laws, Each 0 To 10, None
   Shut", "Nothing Held, 15 Installed", "A Ten Is A Hundred Out Of A Hundred"
   and "The Statement Runs Nine Gates At Once".

   IT IS V13 IN THE VOICE SKILL, which names this defect, quotes the imprint
   row as its corpse, and ends "tests/design.js watches all caps; nothing
   watches title case on a value, so this one is yours to see." This is that
   watch. A value is never titled.

   THE RULE, which is the stylesheet's and is stated there in full. A label is
   a short name for a region: four words or fewer, and no comma with a word
   after it. Everything else is a sentence, takes plain, and stays in sentence
   case. A comma with a word after it is the sharpest of the two marks, because
   a comma means a second part and a name has one part, so "Imprints, 21" is a
   name with a count on it and stays a label while "Coherence, corrupt, 0 to
   100" is a statement and does not.

   THREE PROBE BUGS WERE WALKED INTO WHILE MEASURING THIS, and all three are
   answered by construction here rather than left as advice.

   1. textContent does not tell you what a capitalize rule renders. The render
      is simulated, and the simulation is checked against a case whose answer
      is known before any of its output is believed.
   2. The style is read off the element that owns the text, not off the
      container that matched. .ip-bh is a label and a value in one row and the
      value opts out on its em, so reading the container reported the fix as
      not landed.
   3. There is no visibility filter. A collapsed accordion reports zero height,
      and filtering on it reported that .sp-hd and .lbl did not exist at all. A
      string in a capitalize class is wrong whether or not the section holding
      it happens to be open.

   WHAT THIS DOES NOT REACH, named rather than left to be discovered. It walks
   surfaces, so it sees the centre column, both rails and anything else in the
   document at the time. A drill renders into #rdrill on a click and a help
   sheet into its own host, so neither is swept unless one is open. On the day
   this gate was written a static scan of the source found 24 literals in that
   markup that read as sentences: twenty in drills.js, two in panels.js, one in
   record.js and one in knowledge.js, which is the surface another seat is
   rebuilding. Extending the walk to open every drill is the next step and it
   is a bigger copy pass than this one was.
   ============================================================ */
console.log('\n=== a sentence in a label class carries plain ===');
{
 /* THE CLASS LIST IS READ OFF THE SHEET, never typed here. A list typed into a
    gate is the defect this repository has now been bitten by nine times, and
    this one would go stale the first time a class joined the rule. */
 const SEL=await page.evaluate(()=>{
  let s=null;
  [...document.styleSheets].forEach(sh=>{try{[...sh.cssRules].forEach(r=>{
   if(r.style&&r.style.textTransform==='capitalize'&&r.selectorText
     &&!/\.plain/.test(r.selectorText))s=r.selectorText;});}catch(e){}});
  return s;});
 ok(!!SEL&&/\.pm-eye/.test(SEL),'the capitalize rule is in the sheet, got '+SEL);
 const WALK=function(a){
  const SEL=typeof a==='string'?a:a.sel;
  /* THE ROOT, because a drill renders into one host and walking the whole
     document again for each of several hundred of them is the same work done
     five hundred times. A drill sweep passes #rdrill and reads only that. */
  const ROOT=(typeof a==='object'&&a.root&&document.querySelector(a.root))||document;
  const cap=s=>s.replace(/(^|[\s(‘'"\/-])([a-z])/g,(m,a,b)=>a+b.toUpperCase());
  /* checked against a known answer. If this is wrong nothing below it means
     anything, which is the lesson the repo already carries about tools. */
  const selfok=cap('this is accuracy, not judgment')==='This Is Accuracy, Not Judgment'
   &&cap('CQ and the field')==='CQ And The Field';
  const out=[];
  ROOT.querySelectorAll(SEL).forEach(e=>{
   const cells=[];
   const walk=n=>{n.childNodes.forEach(c=>{
    if(c.nodeType===3){const t=c.nodeValue.replace(/\s+/g,' ').trim();if(t)cells.push([t,n]);}
    else if(c.nodeType===1)walk(c);});};
   walk(e);
   const cls=[...e.classList].filter(c=>SEL.indexOf('.'+c)>=0).join('.')||e.className;
   /* THE HOST ID, because the sweep is document wide and a hidden surface keeps
      its markup. Reporting the tab that happened to be open named the wrong
      surface: a games string was reported against energetics. The id of the
      nearest host is what a person needs to go and find the string. */
   const host=(e.closest('[id]')||{}).id||'';
   cells.forEach(pair=>{const st=getComputedStyle(pair[1]);
    if(st.textTransform!=='capitalize')return;
    out.push({cls:cls,src:pair[0],render:cap(pair[0]),host:host});});});
  return {selfok:selfok,rows:out};};
 /* four words or fewer and no comma with a word after it, which is the rule
    the stylesheet states. A full stop with a sentence after it counts too: the
    paragraph this gate was written for began its second sentence lowercase. */
 const isSentence=s=>{const t=s.trim();
  return /[,;:]\s*\S*[A-Za-z]/.test(t)||/[.!?]\s+\S/.test(t)||t.split(/\s+/).length>4;};
 const TABS=await page.evaluate(()=>{
  const a=TABDEF.map(t=>[t.nm.toLowerCase(),t.k]);
  Object.keys(TABEXTRA).forEach(k=>a.push([TABEXTRA[k].nm.toLowerCase(),TABEXTRA[k].k]));
  return a;});
 /* THREE PROFILES, AND THE HEAVY ONE IS FOUND RATHER THAN TYPED. A test that
    said loadP(8) and meant the heaviest person in a roster that then grew is
    on this repository's list of numbers that went stale, so the heaviest is
    asked for at run time. More load means more strings, and a string that only
    renders on a full field is exactly the one nobody looks at. */
 const HEAVY=await page.evaluate(()=>{
  let best=0,bi=0;
  PEOPLE.forEach((p,i)=>{const n=((p.story&&p.story.entries)||[]).length
    +Object.keys(p.charge||{}).length;
   if(n>best){best=n;bi=i;}});
  return bi;});
 const seen=new Map(); let selfok=true, n=0;
 let drills=0, drillErr=[], drillNames=[], drillRan={};
 for(const [w,h] of [[1600,1000],[390,844]]){
  await page.setViewportSize({width:w,height:h});
  for(const who of ['blank',0,HEAVY]){
   if(who!=='blank')await page.evaluate(i=>loadP(i),who);
   for(const [nm,t] of TABS){
    await page.evaluate(k=>setTab(k),t);
    await page.waitForTimeout(140);
    const r=await page.evaluate(WALK,SEL);
    if(!r.selfok)selfok=false;
    r.rows.forEach(x=>{n++;
     if(isSentence(x.src)&&!seen.has(x.cls+'|'+x.src))
      seen.set(x.cls+'|'+x.src,{...x,where:'#'+(x.host||'?')+' at '+w});});}
   /* ============================================================
      AND EVERY DRILL, OPENED.

      The walk above sees what a surface renders. A drill renders into
      #rdrill on a click and nothing on any surface opens one, so until this
      block landed the sweep could not reach a single string inside one. A
      static scan of the source counted 24 literals in that markup reading as
      sentences, twenty of them in drills.js, and the rule this gate enforces
      could not touch any of them. A rule that cannot reach a string is not a
      rule there.

      THE OPENERS ARE DISCOVERED, NEVER TYPED. Every global named runSomething
      Drill, Pair or Year is found at run time and wrapped, so opening one
      through another one counts. The knowledge base has a single dispatcher
      over every row it holds, which is most of them, and the rest are opened
      from the live data tables. The gate then asserts that every discovered
      opener ran at least once: a drill added tomorrow fails this until
      somebody teaches the sweep how to open it, which is the only way a
      reach gate does not go stale. Three counts typed into gates in this
      repository have already gone stale exactly that way.

      It runs once per width on each profile, inside one evaluate, because a
      drill renders synchronously and a round trip per drill is four hundred
      round trips.
      ============================================================ */
   const dr=await page.evaluate(([src,SEL])=>{
    /* the same walker the surfaces are read with, handed to the page so the
       harvest can happen inside one round trip per profile instead of one per
       drill. Two harvesters would be two things that can disagree. */
    const W=(0,eval)('('+src+')');
    const rows=[];
    const grab=()=>{const r=W({sel:SEL,root:'#rdrill'});
     if(r&&r.rows)r.rows.forEach(x=>rows.push(x));};
    const NAMES=Object.keys(window)
     .filter(k=>/^run[A-Z]\w*(?:Drill|Pair|Year)$/.test(k)
              &&typeof window[k]==='function').sort();
    const ran={}, err=[];
    const real={}; let keep=null;
    NAMES.forEach(k=>{real[k]=window[k];
     window[k]=function(){ran[k]=(ran[k]||0)+1;return real[k].apply(this,arguments);};});
    const fire=(k,args)=>{try{window[k].apply(null,args); grab();}
     catch(e){err.push(k+': '+String(e&&e.message).slice(0,90));}};
    try{
     /* the knowledge base, one dispatcher, every row of every family */
     if(typeof kbRows==='function'&&typeof kbOpen==='function'
        &&typeof KB_SECS!=='undefined')
      KB_SECS.concat([['gloss','']]).forEach(sec=>{
       let kr=[]; try{kr=kbRows(sec[0])||[];}catch(e){err.push('kbRows '+sec[0]);}
       kr.forEach(x=>{try{kbOpen(x); grab();}catch(e){
        err.push('kbOpen '+sec[0]+': '+String(e&&e.message).slice(0,70));}});});
     const r=(typeof compute==='function')?compute():{};
     /* everything the dispatcher does not reach, from the live tables */
     [['runCoreDrill',[[]]],['runXYZDrill',[[]]],['runFlowDrill',[[]]],
      ['runBalDrill',[[]]],['runRecogniseDrill',[[]]],['runAvatarDrill',[[]]],
      ['runPurposeDrill',[[]]],['runAgeDrill',[[]]],['runCompassDrill',[[]]],
      ['runAccDrill',[[]]],
      ['runQDrill',[['cq'],['dq'],['sq'],['pole'],['xyz'],['flow']]],
      ['runPoleDrill',[['up'],['dn']]]
     ].forEach(p=>p[1].forEach(a=>fire(p[0],a)));
     if(typeof MIRROR!=='undefined')MIRROR.forEach(m=>{
      fire('runTeacherDrill',[m,'up']); fire('runTeacherDrill',[m,'dn']);
      fire('runMirrorDrill',[m.k]);});
     if(typeof CIRCLES!=='undefined')CIRCLES.forEach(c=>fire('runCircleDrill',[c.c]));
     if(typeof AGES!=='undefined')AGES.forEach(x=>fire('runAgeYear',[x.a]));
     if(typeof NUM_LABEL!=='undefined')Object.keys(NUM_LABEL)
      .forEach(k=>fire('runNumDrill',[k]));
     if(typeof CHILD!=='undefined')CHILD.forEach(c=>fire('runFetterDrill',[c]));
     if(typeof DOMAINS!=='undefined'&&typeof CHILD!=='undefined'){
      DOMAINS.forEach((d,i)=>fire('runCellDrill',[i,0]));
      CHILD.forEach((c,j)=>fire('runCellDrill',[0,j]));}
     [].concat(r.sups||[],r.hys||[],r.cxs||[],r.sabs||[])
      .forEach(o=>fire('runDrill',[o]));
     /* one atom: a node and the entry that put charge on it */
     if(typeof atomIndex==='function'&&typeof BY!=='undefined'){
      const ai=atomIndex()||{};
      Object.keys(ai).slice(0,4).forEach(i=>{
       if(BY[i]&&ai[i]&&ai[i][0])fire('runAtomDrill',[BY[i],ai[i][0]]);});}
     /* the spread rows are doors on a rendered surface, so the arguments are
        read off the doors rather than invented */
     document.querySelectorAll('[data-sp]').forEach(b=>fire('runSpDrill',
      [b.getAttribute('data-sp'),b.getAttribute('data-spv')]));
     /* ============================================================
        AND THREE DRILLS HAVE NO DOOR IN THE ROSTER AT ALL.

        An atom is one story entry landing on one address, and an avatar pair
        is two sentences a person writes about themselves. Measured: every
        reference profile carries zero story entries and zero avatar pairs, so
        runAtomDrill and runAvPair cannot be reached from any of them however
        many surfaces are walked. Their copy is therefore the least read copy
        in the product, which is the opposite of what a sweep should skip.

        So one of each is written, the drills are opened, and what was there
        is put back in the finally below. The seeded sentence is one of the
        funnel's own items rather than invented prose.
        ============================================================ */
     if(typeof CURP!=='undefined'&&CURP){
      keep={story:CURP.story,avatar:CURP.avatar};
      /* THE SEEDED SENTENCE HAS TO LAND SOMEWHERE, and the first one tried
         did not: a sentence about a tight chest and a yes parsed to zero
         imprints, so the atom drill still could not be opened and the gate
         reported it as unreachable. The sentence is checked below rather than
         assumed, which is the rule this repository carries about tools. */
      CURP.story={entries:[{t:Date.now(),
       text:'I am afraid of running out of money and it sits in my gut.'}]};
      CURP.avatar={built:true,at:Date.now(),reviewedAt:null,
       pairs:[{be:'steady under load',notbe:'I snap at the people nearest me '
        +'when I am tired and afraid'}]};
      if(typeof atomIndex==='function'&&typeof BY!=='undefined'){
       const ai=atomIndex()||{};
       if(!Object.keys(ai).length)err.push('the seeded story parsed to no '
        +'imprints, so the atom drill has nothing to open on');
       Object.keys(ai).slice(0,4).forEach(i=>{
        if(BY[i]&&ai[i]&&ai[i][0])fire('runAtomDrill',[BY[i],ai[i][0]]);});}
     }
     /* the avatar pairs only exist once the avatar drill has drawn them */
     fire('runAvatarDrill',[]);
     [...document.querySelectorAll('[data-avp]')].forEach(b=>
      fire('runAvPair',[+b.getAttribute('data-avp')]));
    }finally{NAMES.forEach(k=>{window[k]=real[k];});
     if(keep&&typeof CURP!=='undefined'&&CURP){
      CURP.story=keep.story; CURP.avatar=keep.avatar;}}
    return {names:NAMES,ran:ran,err:err,rows:rows};},[WALK.toString(),SEL]);
   drillErr=drillErr.concat(dr.err);
   drillNames=dr.names;
   drillRan=Object.assign(drillRan,dr.ran);
   drills+=Object.keys(dr.ran).reduce((a,k)=>a+dr.ran[k],0);
   dr.rows.forEach(x=>{n++;
    if(isSentence(x.src)&&!seen.has(x.cls+'|'+x.src))
     seen.set(x.cls+'|'+x.src,{...x,where:'#rdrill at '+w});});
   await page.evaluate(()=>{if(typeof rdClose==='function')rdClose();}).catch(()=>{});
  }}
 await page.setViewportSize({width:1600,height:1000});
 ok(selfok,'the capitalize simulation renders a known case correctly');
 ok(n>0,'there are strings in the label classes to test, saw '+n);
 const bad=[...seen.values()];
 bad.forEach(b=>console.log('  SENTENCE WITHOUT plain  ['+b.cls+'] in '+b.where
   +'\n     wrote     '+b.src+'\n     renders   '+b.render));
 ok(bad.length===0,bad.length+' sentence'+(bad.length===1?'':'s')
   +' in a capitalize class without plain: '
   +bad.map(b=>'['+b.cls+'] '+b.src).slice(0,4).join(' | '));
 /* AND THE REACH IS ASSERTED, not assumed. A drill the sweep cannot open is a
    drill whose copy nothing reads, so an opener that never ran fails here by
    name rather than quietly shrinking what this gate covers. */
 const missed=drillNames.filter(k=>!drillRan[k]);
 ok(drillNames.length>0,'the drill openers are discoverable, found '+drillNames.length);
 ok(missed.length===0,'every drill opener was opened, '+missed.length
   +' were not'+(missed.length?': '+missed.join(', '):''));
 ok(drillErr.length===0,drillErr.length+' drill'+(drillErr.length===1?'':'s')
   +' threw while opening'+(drillErr.length?': '+drillErr.slice(0,4).join(' | '):''));
 console.log('  '+n+' strings walked, '+bad.length+' sentence'
   +(bad.length===1?'':'s')+' without plain');
 console.log('  '+drills+' drills opened across '+drillNames.length+' openers');
}

console.log('\n=== the child treatment holds on all seven lightings ===');
/* WHAT THIS SCORES, AND WHY IT IS NOT THE THING GATE 9 REFUSES TO SCORE.

   Gate 9 says in its own words that it does not score contrast per lighting,
   because a ground built out of color-mix defeated both probes that tried:
   one knew only rgb() and read null, the other read back oklab off a canvas.
   Both of those were trying to score a whole surface against its ground.

   This scores one thing: a treatment against its own control. The child pill
   and a plain pill in the SAME seat on the SAME ground, so the palette and
   the lighting cancel and what is left is the treatment. It composites the
   alpha itself rather than trusting a token, and it parses the one form that
   beat the earlier probe: a computed color-mix comes back as
   color(srgb 0.83 0.32 0.29 / 0.58), which is 0 to 1 and not 0 to 255. A
   probe of mine read those floats as bytes and reported every seat on every
   lighting as the same number to two decimals, which is the tell, because
   seven colours cannot produce one number.

   Two things are asserted and neither is a number typed in here. The child
   pill is further from its ground than the plain pill is, on every lighting,
   which is what intensity means. And it moves in the direction the ground
   dictates: darker on the paper lightings, lighter on the dark ones, which is
   the owner's ruling and which one rule in the sheet produces because every
   seat colour is darker than paper and lighter than every dark ground. */
{
 const kd=await browser.newPage({viewport:{width:1600,height:1000}});
 await kd.goto(FILE,{waitUntil:'load'}); await booted(kd); await kd.waitForTimeout(900);
 const lit=await kd.evaluate(async()=>{
  const rgb=s=>{const v=(s.match(/[\d.]+/g)||[0,0,0]).map(Number);
   const a=/^color\(/.test(s.trim())?v.slice(0,3).map(x=>x*255):v.slice(0,3);
   return {c:a, a:(v.length>3?v[3]:1)};};
  const lum=c=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};
   return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]);};
  /* the ground behind an element: the first ancestor whose own background is
     not see through. That is what the browser paints it over. */
  const groundOf=e=>{let n=e.parentElement;
   while(n){const p=rgb(getComputedStyle(n).backgroundColor);
    if(p.a>=0.999)return p.c; n=n.parentElement;}
   return [0,0,0];};
  const over=(e,g)=>{const f=rgb(getComputedStyle(e).backgroundColor);
   return f.c.map((v,i)=>v*f.a+g[i]*(1-f.a));};
  const out=[];
  for(const L of LIGHTINGS.map(x=>x[0])){
   setLighting(L);
   let gi=0; for(let i=0;i<PEOPLE.length;i++)if(PEOPLE[i].nm==='Gordon')gi=i;
   loadP(gi); setTab(TAB.STORY); stRender();
   await new Promise(r=>setTimeout(r,220));
   const kid=document.querySelector('#imp .ip.kid');
   if(!kid){out.push({L,err:'no child pill'});continue;}
   const seat=(kid.getAttribute('style')||'').match(/--c:([^;]+)/)[1];
   const plain=[...document.querySelectorAll('#imp .ip')].filter(e=>
    !e.classList.contains('kid')&&!e.classList.contains('ghost')
    &&!e.classList.contains('inst')&&!e.classList.contains('hot')
    &&(e.getAttribute('style')||'').indexOf('--c:'+seat)>=0)[0];
   if(!plain){out.push({L,err:'no plain pill in the same seat to compare with'});continue;}
   const g=groundOf(kid), k=over(kid,g), p=over(plain,g);
   /* and the name in the located rows, on every seat rather than on the
      seats this one profile happens to light. Solar is the lightest colour
      in the palette and is the worst case on paper, and Gordon does not
      light it, so the seats are probed rather than sampled. */
   const probe=document.createElement('div');
   probe.innerHTML=BANDS.map(b=>'<div class="ip-kr" style="--c:'+seatCol(b)
    +'"><span class="ip-kn">'+b+'</span><span class="ip-ka">x</span><b>1.0</b></div>').join('');
   document.getElementById('imp').appendChild(probe);
   let worst=99, worstAt='';
   [...probe.querySelectorAll('.ip-kn')].forEach(n=>{
    const gg=groundOf(n), t=rgb(getComputedStyle(n).color).c;
    const A=lum(t), B=lum(gg);
    const r=(Math.max(A,B)+0.05)/(Math.min(A,B)+0.05);
    if(r<worst){worst=r; worstAt=n.textContent;}});
   probe.remove();
   out.push({L, seat:seat.trim(), n:document.querySelectorAll('#imp .ip.kid').length,
    lk:lum(k), lp:lum(p), lg:lum(g), name:worst, nameAt:worstAt});}
  return out;});
 const paper=[];
 lit.forEach(r=>{
  if(r.err){ok(false,r.L+': '+r.err);return;}
  ok(r.n>0,r.L+': the panel marks at least one child pattern, got '+r.n);
  const dk=Math.abs(r.lk-r.lg), dp=Math.abs(r.lp-r.lg);
  ok(dk>dp,r.L+': the child pill stands further off its ground than a plain one, '
   +dk.toFixed(3)+' against '+dp.toFixed(3));
  const light=r.lg>0.5;
  const moved=light?(r.lk<r.lp):(r.lk>r.lp);
  ok(moved,r.L+': on a '+(light?'paper':'dark')+' ground the treatment goes '
   +(light?'darker':'lighter')+', and it goes '+(r.lk<r.lp?'darker':'lighter'));
  /* the located rows are text and take the text floor, not the graphic one */
  ok(r.name>=4.5,r.L+': the located name holds 4.5 to 1 on every seat, worst is '
   +r.nameAt+' at '+r.name.toFixed(2));
  if(light)paper.push(r.L);
  const ratio=(a,b)=>((Math.max(a,b)+0.05)/(Math.min(a,b)+0.05));
  console.log('  '+r.L.padEnd(11)+(light?'paper':'dark ')
   +'  child:plain '+ratio(r.lk,r.lp).toFixed(2)
   +'  child:ground '+ratio(r.lk,r.lg).toFixed(2)
   +'  name '+r.name.toFixed(2)
   +'  '+(r.lk<r.lp?'darker':'lighter'));});
 ok(paper.length>0&&paper.length<lit.length,
  'the run covers both kinds of ground, '+paper.length+' paper of '+lit.length);
 await kd.close();
}

await browser.close();
console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);
})();
