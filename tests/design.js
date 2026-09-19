const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve('source.html');
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};

(async()=>{
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const page=await browser.newPage({viewport:{width:1600,height:1000}});
const errs=[];
page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
page.on('pageerror',e=>errs.push('PAGEERROR: '+e.message));
await page.goto(FILE,{waitUntil:'load'});
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
/* SEVEN, not eight. Analytics folded into Summary and Games folded into
   Knowledge on the owner's ruling, and the compass gained a door it never
   had, so the bar lost two items and gained one. Both folded surfaces still
   exist and still have their own integers: what they lost is a tab. */
ok(shell.tabs===7,'7 tabs, got '+shell.tabs);
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
const FOLDOF={ana:'sum',games:'know'};
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
 document.querySelectorAll('*').forEach(e=>{
  if(e.closest('svg'))return;                    // svg text scales with viewBox
  const t=(e.textContent||'').trim();
  if(!t||e.children.length)return;
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
 await p2.goto(FILE,{waitUntil:'load'});
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
 await page3.goto(FILE,{waitUntil:'load'}); await page3.waitForTimeout(900);
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

await browser.close();
console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);
})();
