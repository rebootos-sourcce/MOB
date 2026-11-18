/* ============================================================
   THE VOCABULARY GATE. Point, charge, whole, clarity and shadow.

   The owner, 18 November, answering the need-you list on the status board:
   "Change seat and chakra to just point. It's an assemblage point. You can
   call it AP, or assemblage point for short, or point. We're going to use
   charge instead of tension. And neither becoming or complete, we're going to
   use the word whole. Instead of clear conduction against sabotage, just use
   clarity. Grace against false light, just change that to grace. Oh, I see.
   Grace against shadow. So use the word shadow."

   tools/vocab-sweep.py makes the change in the source. This holds it where a
   person meets it, which is the built app: several branches are building new
   screens right now with the old words in them, and a sweep of the source
   cannot see a string assembled at run time out of three pieces.

   WHAT IT READS, at 1600 and at 390, on a blank profile and a loaded one:
     every surface TABDEF and TABEXTRA name, by setTab, each time:
       every text node in the document, SVG <title> included, and every
       attribute a person reads (title, aria-label, aria-description, alt,
       placeholder, data-tip and its family)
       every string a canvas was asked to draw, by a hook on fillText and
       strokeText installed before the page's own script runs
   and once, on the loaded profile at 1600, the overlays:
       every drill the right rail opens, run off its own table (each node,
       law, fetter, saboteur, archetype, mask, axis, teacher, path, circle,
       domain cell and the no-argument drills), the release's setup, the
       first run walk card by card, and the profile sheet
   and once, the data: every string in every top level table MANIFEST
   declares, and every sentence of the meaning table, because a definition
   nobody has opened yet is still copy.

   WHAT FAILS: a retired word (seat, chakra, tension) in any of it, the old
   pair names (Clear Conduction, False Light), and Becoming or Complete where
   it labels the Avatar's percent, unless an entry of ALLOW below names the
   phrase and says why. ALLOW holds only the stated exceptions.

   CHECKED AGAINST KNOWN BAD CASES FIRST. A block carrying a retired word in
   each place the gate reads (text, tooltip, aria-label, canvas, a hover's
   own sentence) is put on the page and every one must be found before the
   gate is trusted on anything real. It is also run against the build at
   origin/main and against mutants of the fixed build; see the commit.

   Run from the repo root:
     NODE_PATH=$(npm root -g) node tests/vocab.js
   ATUNED_FILE=path/to/other.html runs another build through the same gate.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const ROOT=path.resolve(__dirname,'..');
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}};

/* THE RETIRED WORDS. Matched case blind, as words. */
const RETIRED=[
 ['seat',/\bseats?\b/i],
 ['chakra',/\bchakras?\b/i],
 ['tension',/\btension\b/i],
 ['Clear Conduction',/\bclear conduction\b/i],
 ['False Light',/\bfalse light\b/i]];

/* THE EXCEPTIONS, each with its reason. A phrase here is cut out of a string
   before the retired words are looked for, so the rest of the string is still
   held. Nothing else is allowed. */
const ALLOW=[
 [/\b(tension headache|rib tension|pelvic floor tension|lower back tension|mid-back tension|jaw tension)\b/gi,
  'a symptom a person reports, in their own words, not charge at a place'],
 [/\bTension accumulation\b/g,
  'a band of the cards\' escalation curve, a felt rise in pressure, not charge at a place'],
 [/\bbreaks? the tension\b/gi, 'the Jester\'s idiom, a room\'s mood'],
 [/\ba tension line\b/gi, 'the sound map\'s note for how taut a drawn line is'],
 [/\bPride as false light\b/gi, 'the codex\'s own line for the Shadow pole, quoted, held phrase by phrase to its meaning'],
 /* the Wisdom school glossary is a port of the codex, and its Chakra entry
    is the entry that says a chakra is an assemblage point. Allowed only as
    that entry's own title and text, read off the table at run time. */
 ['KB_CHAKRA','the Wisdom school glossary entry ported from the codex, the book and canon sources are not swept']];

/* A WORD IN A STRING IS CODE when it touches an identifier character: a
   data-seat= or a .seat in a selector a table carries, or a seat:root key.
   Screens never print those; tables do, and this keeps them out. */
const isCode=(s,a,b)=>/[\w$.#\-\[]$/.test(s.slice(Math.max(0,a-1),a))||/^([\w$\-=(\]]|:[^\s']|:$)/.test(s.slice(b,b+2));

function hits(s,kbText){
 let t=String(s);
 for(const [re] of ALLOW){ if(re==='KB_CHAKRA')continue; t=t.replace(re,m=>' '.repeat(m.length)); }
 const out=[];
 for(const [nm,re] of RETIRED){
  const g=new RegExp(re.source,'gi'); let m;
  while((m=g.exec(t))){
   if(isCode(t,m.index,m.index+m[0].length))continue;
   if(nm==='chakra'&&kbText(s))continue;
   out.push(nm);}}
 return out;}

/* -------------------------------------------------- the in page collector */
const COLLECT=`(function(){
 var out=[], SKIP={SCRIPT:1,STYLE:1,NOSCRIPT:1,TEMPLATE:1};
 var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null), n;
 while((n=w.nextNode())){
  var t=n.nodeValue; if(!t||!/[A-Za-z]/.test(t))continue;
  var p=n.parentElement; if(!p||SKIP[p.tagName])continue;
  if(p.closest('#vocab-probe-skip'))continue;
  var whole=(p.textContent||'').replace(/\\s+/g,' ').trim();
  out.push({k:p instanceof SVGElement&&p.tagName.toLowerCase()==='title'?'svgtitle':'text',
   s:t.replace(/\\s+/g,' ').trim(), ctx:whole.slice(0,240), id:(p.closest('[id]')||{}).id||''});}
 var ATT=['title','aria-label','aria-description','alt','placeholder','data-tip','data-tip-t','data-tip-k','data-tip-a','data-tip-n','data-tooltip','data-hint'];
 var all=document.body.querySelectorAll('*');
 for(var i=0;i<all.length;i++){var e=all[i]; if(SKIP[e.tagName])continue;
  for(var j=0;j<ATT.length;j++){var a=ATT[j]; if(!e.hasAttribute(a))continue;
   var v=e.getAttribute(a); if(v&&/[A-Za-z]/.test(v))out.push({k:a,s:v,ctx:'',id:(e.closest('[id]')||{}).id||''});}}
 (window.__vcv||[]).forEach(function(s){out.push({k:'canvas',s:s,ctx:'',id:''});});
 window.__vcv=[];
 return out;})()`;

/* the canvas hook, before any of the page's own script */
const CANVAS_HOOK=()=>{
 window.__vcv=[];
 const P=CanvasRenderingContext2D.prototype;
 ['fillText','strokeText'].forEach(f=>{const o=P[f];
  P[f]=function(t){try{if(t!=null&&/[A-Za-z]/.test(String(t)))window.__vcv.push(String(t));}catch(e){}return o.apply(this,arguments);};});};

/* every drill the rail opens, off its own table, and what it printed */
const DRILLS=`(async function(){
 var out=[], n=0, wait=function(){return new Promise(function(r){setTimeout(r,0);});};
 function grab(){var h=document.getElementById('rdrill'); if(!h)return;
  out.push(h.innerText||''); h.querySelectorAll('[title],[aria-label],[data-tip],[data-tip-t],[data-tip-k],[data-tip-n]').forEach(function(e){
   ['title','aria-label','data-tip','data-tip-t','data-tip-k','data-tip-n'].forEach(function(a){var v=e.getAttribute(a); if(v)out.push(v);});});
  h.querySelectorAll('svg title').forEach(function(t){out.push(t.textContent);});}
 function run(fn,args){ if(typeof window[fn]!=='function')return;
  try{ window[fn].apply(null,args); n++; grab(); }catch(e){} }
 var g=function(nm){try{return (0,eval)(nm);}catch(e){return null;}};
 (g('W')||[]).forEach(function(x){run('runNodeDrill',[x]);});
 (g('SI')||[]).forEach(function(x){run('runLawDrill',[x]);});
 (g('APC')||[]).forEach(function(x){run('runSeatDrill',[x]);});
 (g('CHILD')||[]).forEach(function(x){run('runFetterDrill',[x]);});
 (g('ARCH')||[]).forEach(function(x){run('runArchDrill',[x]);});
 (g('MASKS')||[]).forEach(function(x){run('runMaskDrill',[x]);});
 (g('MIRROR')||[]).forEach(function(x){run('runMirrorDrill',[x.k]); run('runTeacherDrill',[x,'up']); run('runTeacherDrill',[x,'dn']);});
 (g('PATHS')||[]).forEach(function(x){run('runPathDrill',[x]);});
 (g('HOME_POLES')||[]).forEach(function(x){run('runHomePoleDrill',[x]);});
 (g('CIRCLES')||[]).forEach(function(x){run('runCircleDrill',[x.c]);});
 var D=g('DOMAINS')||[], C=g('CHILD')||[];
 D.forEach(function(d,i){run('runDomDrill',[d]); C.forEach(function(c,j){run('runCellDrill',[i,j]);});});
 try{ (verpRead()||[]).forEach(function(v){run('runGatesDrill',[v.k]);}); }catch(e){}
 ['up','dn'].forEach(function(e){run('runPoleDrill',[e]);});
 ['runCoreDrill','runFlowDrill','runBalDrill','runXYZDrill','runCompassDrill','runAvatarDrill',
  'runPurposeDrill','runAgeDrill','runRecogniseDrill'].forEach(function(f){run(f,[]);});
 try{ (g('SAB33')||[]).forEach(function(r){ var s=(typeof sabRow==='function')?sabRow(r):{nm:r[0],nids:[]}; run('runSabDrill',[s]); }); }catch(e){}
 await wait();
 return {n:n, out:out};})()`;

/* the tables, as tools/copy-walk.js reads them */
function tableNames(){
 const man=fs.readFileSync(path.join(ROOT,'atuned_src/MANIFEST'),'utf8').split('\n').map(s=>s.trim()).filter(f=>/\.js$/.test(f));
 const names=[];
 for(const f of man){
  const s=fs.readFileSync(path.join(ROOT,'atuned_src',f),'utf8');
  const re=/^(?:var|const|let)\s+([A-Za-z_$][\w$]*)\s*=/gm; let m;
  while((m=re.exec(s)))names.push({name:m[1],file:f});}
 return names;}
const WALK_TABLE=`(function(name){
 var v; try{ v=(0,eval)(name); }catch(e){return null;}
 if(v===undefined||typeof v==='function')return null;
 var out=[], seen=new Set(), budget=8000;
 function keep(s){
  if(typeof s!=='string'||s.length<2||!/[A-Za-z]/.test(s))return false;
  if(/^(#[0-9a-f]{3,8}|rgba?\\(|M[\\d. -]|<svg|https?:|\\.\\/|data:)/i.test(s))return false;
  if(/^[a-z0-9_.\\-:\\/]+$/.test(s)&&s.length<16&&!/[A-Z]/.test(s))return false;
  return true;}
 function walk(x,p,d){
  if(budget<=0||d>7||x==null)return;
  if(typeof x==='string'){ if(keep(x)){out.push({p:p,s:x});budget--;} return; }
  if(typeof x!=='object')return;
  if(seen.has(x))return; seen.add(x);
  if(x.nodeType)return;
  if(Array.isArray(x)){ x.slice(0,600).forEach(function(y,i){walk(y,p+'['+i+']',d+1);}); return; }
  Object.keys(x).slice(0,600).forEach(function(k){
   var y; try{y=x[k];}catch(e){return;} if(typeof y==='function')return;
   walk(y,p+'.'+k,d+1);});}
 walk(v,name,0); return out;})`;

(async()=>{
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
require('./net.js').guardBrowser(b);
const found=new Map();   /* word|string -> {where:Set} */
let KB=[];
const kbText=s=>KB.some(t=>t===s||t.indexOf(s)>=0||(s.length>40&&s.indexOf(t.slice(0,40))>=0));
/* VOCAB_DUMP=file writes every string read, with where it was read, so a run
   is a record of the real scan and a mutant can be aimed at a string the walk
   is known to reach. */
const DUMP=process.env.VOCAB_DUMP?[]:null;
const note=(where,items)=>{for(const it of items){const s=String(it.s!=null?it.s:it); if(DUMP)DUMP.push([where,it.k||'',s]); const h=hits(s,kbText);
 if(!h.length)continue; const k=h.join(',')+' | '+s.slice(0,200);
 if(!found.has(k))found.set(k,new Set()); found.get(k).add(where);}};
/* WHOLE: Becoming and Complete retire only where they label the Avatar's
   percent: a label beside a percent, a tooltip row that names it, or a
   sentence that reads a percent complete. */
const wholeKeys=items=>{const out=[];for(const it of items){const s=String(it.s||''), c=String(it.ctx||'');
 const bad=(it.k==='text'&&/^(Becoming|Complete)$/.test(s)&&/\d\s*%/.test(c))
  ||(it.k==='data-tip-n'&&/(^|;)\s*(Becoming|Complete)\s*\|/.test(s))
  ||/\d\s*%\s*(complete|becoming)\b/i.test(s)||/\bpercent (complete|becoming)\b/i.test(s);
 if(bad)out.push('whole | '+s.slice(0,120)+(c?'  <'+c.slice(0,80)+'>':''));}return out;};
const wholeHits=(where,items)=>{for(const k of wholeKeys(items)){if(!found.has(k))found.set(k,new Set()); found.get(k).add(where);}};

let drillN=0, tabsSeen=0, canvasSeen=0;
for(const [w,h,wn] of [[1600,1000,'1600'],[390,844,'390']]){
 const c=await b.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600});
 const p=await c.newPage();
 await p.addInitScript(require('./seed.js').FULL_SIGHT);
 await p.addInitScript(CANVAS_HOOK);
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(FILE); await booted(p); await p.waitForTimeout(1200);
 if(!KB.length)KB=await p.evaluate(()=>{var o=[]; try{(GLOSS||[]).forEach(function(g){var t=(g.t||'')+' '+(g.d||''); if(/chakra/i.test(t)){o.push(g.t);o.push(g.d);}});}catch(e){} return o;});

 /* ---- the gate against known bad cases, before it is trusted ---- */
 if(w===1600){
  await p.evaluate(()=>{var d=document.createElement('div');d.id='vocab-bad';
   d.innerHTML='<p>The Root seat holds the most.</p><span title="Each chakra is a place">x</span>'
    +'<button aria-label="Open the heart seat">o</button><i data-tip="Grace against False Light">i</i>'
    +'<b data-tip-n="Complete|45%|100%">r</b><em>Clear Conduction</em><u data-tip="Where the tension sits">t</u>'
    +'<span class="av-pp">45%<small>Complete</small></span>';
   document.body.appendChild(d);
   var cv=document.createElement('canvas'); cv.width=40; cv.height=20; d.appendChild(cv);
   cv.getContext('2d').fillText('Crown seat',0,10);});
  const bad=await p.evaluate(COLLECT);
  const seen=new Set();
  bad.forEach(it=>{hits(String(it.s),kbText).forEach(x=>seen.add(it.k+':'+x));});
  const wholeSeen=wholeKeys(bad).length;
  ['text:seat','title:chakra','aria-label:seat','data-tip:False Light','text:Clear Conduction','data-tip:tension','canvas:seat'].forEach(x=>
   ok(seen.has(x),'the gate finds a known bad '+x+' before it is trusted, saw '+[...seen].join(' ')));
  ok(wholeSeen>=2,'and finds Complete labelling a percent, as a label and as a tooltip row, saw '+wholeSeen);
  ok(hits('tension headache, migraine',kbText).length===0&&hits('Pride as false light.',kbText).length===0,
   'and an allowed phrase passes, so the allow list is read');
  ok(hits('[data-seat="Root"]',kbText).length===0&&hits('seat:root',kbText).length===0,'and code in a string is not copy');
  await p.evaluate(()=>{var d=document.getElementById('vocab-bad'); if(d)d.remove(); window.__vcv=[];});}

 const tabs=await p.evaluate(()=>TABDEF.map(t=>({nm:t.nm,k:t.k})).concat(Object.keys(TABEXTRA).map(k=>({nm:TABEXTRA[k].nm,k:TABEXTRA[k].k}))));
 const L=await p.evaluate(()=>PEOPLE.findIndex(x=>x.nm==='Derek'));
 if(L<0)throw new Error('vocab: Derek is not in the roster, name the loaded profile again');
 for(const who of ['blank','loaded']){
  if(who==='loaded'){await p.evaluate(i=>loadP(i),L); await p.waitForTimeout(500);}
  for(const t of tabs){
   await p.evaluate(k=>{try{if(typeof relClose==='function')relClose();}catch(e){} setTab(k);},t.k);
   await p.waitForTimeout(700);
   const items=await p.evaluate(COLLECT);
   tabsSeen++; canvasSeen+=items.filter(x=>x.k==='canvas').length;
   note(wn+'/'+who+'/'+t.nm,items); wholeHits(wn+'/'+who+'/'+t.nm,items);}}

 /* ---- the overlays, on the loaded profile ---- */
 if(w===1600){
  await p.evaluate(()=>setTab(TABHOME)); await p.waitForTimeout(300);
  const dr=await p.evaluate(DRILLS);
  drillN=dr.n; note('drills',dr.out); wholeHits('drills',dr.out.map(s=>({k:'',s})));
  /* the release, opened on whoever carries most, never committed */
  const rel=await p.evaluate(async()=>{var out=[], best=-1, most=0;
   PEOPLE.forEach(function(x,i){loadP(i); var c=compute().carrying.length; if(c>most){most=c;best=i;}});
   if(best<0)return out; loadP(best);
   try{ if(CURP&&CURP.ui)CURP.ui.voice=false; relPick(compute().carrying.slice(0,3).map(function(n){return n.i;}));
    var h=document.getElementById('rel'); out.push(h?h.innerText:'');
    if(h)h.querySelectorAll('[title],[aria-label],[data-tip]').forEach(function(e){out.push(e.getAttribute('title')||e.getAttribute('aria-label')||e.getAttribute('data-tip'));});
    relClose(); }catch(e){}
   return out;});
  note('release',rel);
  /* the profile sheet */
  const ps=await p.evaluate(()=>{try{profileSheet();}catch(e){} var o=[document.body.innerText];
   document.querySelectorAll('[title],[aria-label],[data-tip]').forEach(function(e){o.push(e.getAttribute('title')||e.getAttribute('aria-label')||e.getAttribute('data-tip'));});
   try{if(typeof sheetClose==='function')sheetClose();}catch(e){} return o;});
  note('profile sheet',ps);
  /* the first run, card by card */
  const ob=await p.evaluate(async()=>{var o=[]; if(typeof obOpen!=='function')return o;
   try{obOpen(true);}catch(e){}
   for(var i=0;i<14;i++){ try{OB.step=i; obRender();}catch(e){}
    var h=document.getElementById('ob')||document.querySelector('.ob'); if(h){o.push(h.innerText);
     h.querySelectorAll('[title],[aria-label],[data-tip]').forEach(function(e){o.push(e.getAttribute('title')||e.getAttribute('aria-label')||e.getAttribute('data-tip'));});}}
   try{obClose('skip');}catch(e){} return o;});
  note('first run',ob);
  /* ---- the data, and the meaning table ---- */
  const T=await p.evaluate(()=>{try{var t=unpackAll(); return Object.keys(t).map(function(k){return t[k];});}catch(e){return [];}});
  note('meaning table',T);
  let tn=0;
  for(const {name,file} of tableNames()){
   const arr=await p.evaluate(`(${WALK_TABLE})(${JSON.stringify(name)})`).catch(()=>null);
   if(!arr||!arr.length)continue; tn++;
   note('data '+name+' ('+file+')',arr.map(x=>x.s));}
  ok(tn>0,'the data walk read tables, saw '+tn);}
 ok(errs.length===0,wn+': no page errors, saw '+errs.slice(0,3).join(' | '));
 await c.close();}
await b.close();

ok(tabsSeen>0,'every surface was walked, saw '+tabsSeen+' surface visits');
ok(drillN>0,'the drills were opened off their tables, saw '+drillN);
ok(canvasSeen>0,'the canvas hook saw the canvases draw their labels, saw '+canvasSeen+' strings');
for(const [k,where] of found){
 const ws=[...where]; ok(false,k+'   on '+ws.slice(0,4).join(', ')+(ws.length>4?' and '+(ws.length-4)+' more':''));}
if(DUMP)fs.writeFileSync(process.env.VOCAB_DUMP,JSON.stringify(DUMP));
console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
