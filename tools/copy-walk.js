/* ============================================================
   THE COPY WALK. A harvest of every string a person can read.

   Asked for by the owner after the copy rules were found not applied on the
   site: "I need you to verify that you have gone through the site because I
   have seen much stuff that doesn't have the rules. Especially in the
   tooltips. And some of the info." A sweep of the source files reads where
   copy is written. This reads where it is SHOWN, which is the other half, and
   it is the half the owner sees.

   WHAT IT COLLECTS, per surface, per profile, per width:

     text      every run of text a person can see, one per block of the page,
               SVG text included, with the page's own text-transform noted so a
               string that is authored in sentence case and shown in title case
               is told apart from one authored in title case
     title, aria-label, placeholder, alt, data-tip*, svg <title>
               every hover and screen reader string on a visible element
     option    the choices in a visible select
     status    everything the status line was ever told, and every dialog
     tip       every panel the one tooltip was ever asked to open
     data      every string in every top level table of the product
               (GLOSS, TIERDEF, the drills' tables), reached by name off the
               MANIFEST, because a definition nobody has opened is still copy

   A SURFACE is a tab, or a control pressed on a tab. The crawl presses every
   visible control once per (profile, width), reads what appeared that was not
   there before, and puts it back. A control is pressed by a real mouse at its
   real position, so what it opens is what a person would see. A dialog is read
   and dismissed, never accepted, so nothing destructive runs.

   THE COUNTS ARE NOT TYPED HERE. The tab list is read from TABDEF and TABEXTRA
   at run time, the profiles from PEOPLE, the data tables from MANIFEST. This
   repository has been bitten by a typed count more than ten times.

   usage, from the repo root, with playwright on the path:

     NODE_PATH=/opt/node22/lib/node_modules node tools/copy-walk.js
     node tools/copy-walk.js --quick          tabs only, no crawl, no hover
     node tools/copy-walk.js --out X.json --file source.html

   Then: python3 tools/copy-verify.py COPY-VERIFY-strings.json
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs'), cp=require('child_process');

const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0&&process.argv[i+1]&&!process.argv[i+1].startsWith('--')?process.argv[i+1]:d;};
const QUICK=process.argv.includes('--quick');
/* --tabs=Field,Body and --crawl=Derek narrow a run, for trying the walker on
   one surface before it is trusted with all of them */
const ONLY_TABS=(process.argv.find(a=>a.startsWith('--tabs='))||'').slice(7).split(',').filter(Boolean);
const ONLY_CRAWL=(process.argv.find(a=>a.startsWith('--crawl='))||'').slice(8).split(',').filter(Boolean);
const ONLY_WHO=(process.argv.find(a=>a.startsWith('--who='))||'').slice(6).split(',').filter(Boolean);
const FILE=path.resolve(arg('--file','source.html'));
const OUT=path.resolve(arg('--out','COPY-VERIFY-strings.json'));
const ROOT=path.resolve(__dirname,'..');
const CHROME=process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const sh=c=>{try{return cp.execSync(c,{encoding:'utf8',cwd:ROOT}).trim();}catch(e){return '?';}};

/* WHO IS WALKED. Blank is the profile a person arrives with, and it is the one
   the owner meets first. The loaded ones are named here only as a preference:
   anybody missing from PEOPLE is skipped, and the list is checked against it
   at run time. Heavy and light are both in, because copy that branches on the
   reading only shows when the reading is there. */
const LOADED_FIRST=['Derek','Tomas','Angela','James','Gordon','Lance 15','Lance 85'];
const LOADED_BASE=null;        /* null: every persona in PEOPLE gets the tab pass */
const CRAWL_LOADED=ONLY_CRAWL.length?ONLY_CRAWL:['Derek'];
const WIDTHS=[[1600,1000,'desktop'],[390,844,'phone']];

/* -------------------------------------------------- the in page collector */
const COLLECT=`(function(){
 var out=[], cache=new Map();
 var SKIP={SCRIPT:1,STYLE:1,NOSCRIPT:1,TEMPLATE:1,HEAD:1,META:1,LINK:1};
 function vis(e){
  if(cache.has(e))return cache.get(e);
  var v=true;
  if(!e||e===document.documentElement){cache.set(e,true);return true;}
  var s=getComputedStyle(e);
  if(s.display==='none'||s.visibility==='hidden'||+s.opacity===0)v=false;
  else if(e.parentElement&&!vis(e.parentElement))v=false;
  else if(!(e instanceof SVGElement)||e.tagName==='svg'){
   var b=e.getBoundingClientRect(); if(!(b.width>0&&b.height>0))v=false;}
  cache.set(e,v); return v;}
 function norm(s){return String(s).replace(/\\s+/g,' ').trim();}
 function add(kind,s,e,extra){
  s=norm(s); if(!s)return;
  var cs=e&&e.nodeType===1?getComputedStyle(e):null;
  out.push({k:kind,s:s,tf:cs?cs.textTransform:'none',
   cls:e&&e.nodeType===1?(e.getAttribute('class')||'').slice(0,60):'',
   id:e&&e.nodeType===1?(e.id||''):'',x:extra||''});}
 var BLOCK={inline:1,contents:1,'inline-block':1,'inline-flex':1,'inline-grid':1,'inline-table':1,ruby:1};
 function boundary(e){
  for(var x=e;x&&x!==document.body;x=x.parentElement){
   if(x instanceof SVGElement){ if(x.tagName==='text')return x; continue; }
   var d=getComputedStyle(x).display;
   if(!BLOCK[d])return x;}
  return document.body;}
 var runs=new Map(), order=[];
 var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null);
 var n;
 while((n=w.nextNode())){
  var t=n.nodeValue; if(!t||!t.trim())continue;
  var p=n.parentElement; if(!p||SKIP[p.tagName])continue;
  if(p.tagName&&p.tagName.toLowerCase()==='title'&&p instanceof SVGElement){
   if(p.parentElement&&vis(p.parentElement))add('svgtitle',t,p.parentElement);
   continue;}
  if(p.tagName==='OPTION'||p.tagName==='OPTGROUP'){
   var sel=p.closest('select'); if(sel&&vis(sel))add('option',t,sel); continue;}
  if(!vis(p))continue;
  var b=boundary(p);
  if(!runs.has(b)){runs.set(b,{b:b,parts:[],tf:getComputedStyle(p).textTransform,raw:[]});order.push(b);}
  var r=runs.get(b); r.parts.push(t); r.tf=r.tf==='none'?getComputedStyle(p).textTransform:r.tf;}
 order.forEach(function(b){var r=runs.get(b);
  var s=norm(r.parts.join(' '));
  if(s){ out.push({k:'text',s:s,tf:r.tf,cls:(b.getAttribute&&b.getAttribute('class')||'').slice(0,60),
   id:b.id||'',x:''});}});
 var ATT=['title','aria-label','placeholder','alt','data-tip','data-tip-t','data-tip-k','data-tip-a','data-tip-go','data-tip-n','aria-description','data-tooltip','data-hint'];
 var all=document.body.querySelectorAll('*');
 for(var i=0;i<all.length;i++){
  var e=all[i]; if(SKIP[e.tagName])continue;
  var has=false;
  for(var j=0;j<ATT.length;j++)if(e.hasAttribute(ATT[j])){has=true;break;}
  if(!has&&!(e.tagName==='INPUT'&&/^(button|submit|reset)$/.test(e.type)))continue;
  if(!vis(e))continue;
  for(j=0;j<ATT.length;j++){var a=ATT[j]; if(!e.hasAttribute(a))continue;
   var v=e.getAttribute(a); if(!v||!/[A-Za-z]/.test(v))continue;
   if(a==='data-tip-n'){ v.split(';').forEach(function(q){var f=q.split('|'); if(f[0])add('tipn',f.join(' | '),e,a);}); continue;}
   add(a.replace('data-',''),v,e,a);}
  if(e.tagName==='INPUT'&&/^(button|submit|reset)$/.test(e.type)&&e.value)add('value',e.value,e);}
 return out;})()`;

/* what the page told the status line, the tooltip and the dialogs, kept from
   the moment the page loads. An observer on #status catches a message that is
   gone in 2.4 seconds, which a snapshot would miss. */
const HOOKS=`(function(){
 window.__cw=window.__cw||[];
 function rec(k,s,x){ if(s==null)return; s=String(s).replace(/\\s+/g,' ').trim(); if(s)window.__cw.push({k:k,s:s,x:x||''}); }
 try{ var st=document.getElementById('status');
  if(st&&!st.__cw){ st.__cw=1;
   new MutationObserver(function(){rec('status',st.textContent,st.getAttribute('data-kind'));})
    .observe(st,{childList:true,characterData:true,subtree:true});}}catch(e){}
 try{ if(typeof TIP!=='undefined'&&!TIP.__cw){ TIP.__cw=1;
   ['show','showAt'].forEach(function(f){ var o=TIP[f]; if(typeof o!=='function')return;
    TIP[f]=function(){ try{ var d=null;
      for(var i=0;i<arguments.length;i++){ var a=arguments[i];
       if(a&&typeof a==='object'&&('b' in a||'t' in a)){d=a;break;}
       if(a&&a.nodeType===1){d={b:a.getAttribute('data-tip')||a.getAttribute('title')};}}
      if(d){ rec('tip',[d.k,d.t,d.b,d.a].filter(Boolean).join(' / '));
       (d.n||[]).forEach(function(r){rec('tipn',r.join(' | '));}); }
     }catch(e){}
     return o.apply(this,arguments);};});}}catch(e){}
 try{ var tp=document.getElementById('tip');
  if(tp&&!tp.__cw){ tp.__cw=1; new MutationObserver(function(){rec('tip',tp.innerText);})
   .observe(tp,{childList:true,subtree:true,characterData:true});}}catch(e){}
})()`;

/* every clickable thing that is on the screen, with a key that survives a
   re-render: tag, class, text, and which one of those it is. Defined once in
   the page, so the list and the press read the same elements the same way. */
const LIB=`(function(){
 var SEL='button,a[href],[onclick],[role=button],[role=tab],[role=switch],[tabindex="0"],summary,select,input[type=checkbox],input[type=radio],input[type=range],label[for]';
 window.__cwList=function(){
  var q=[].slice.call(document.querySelectorAll(SEL)), seen={}, out=[];
  q.forEach(function(e){
   var s=getComputedStyle(e), b=e.getBoundingClientRect();
   if(s.display==='none'||s.visibility==='hidden'||!(b.width>0&&b.height>0))return;
   if(+s.opacity===0||s.pointerEvents==='none')return;
   var cl=(typeof e.className==='string'?e.className:'').replace(/\\b(on|av-on|open|sel|active|cur)\\b/g,'').replace(/\\s+/g,' ').trim();
   var tx=(e.innerText||e.getAttribute('aria-label')||e.getAttribute('title')||e.value||'').replace(/\\s+/g,' ').trim().slice(0,40);
   var base=e.tagName+'.'+cl+'|'+tx; seen[base]=(seen[base]||0)+1;
   out.push({el:e,key:base+'#'+seen[base],tag:e.tagName,type:e.type||'',href:e.getAttribute('href')||'',tx:tx});});
  return out;};
})()`;
const CLICKABLES=`window.__cwList().map(function(x){return {key:x.key,tag:x.tag,type:x.type,href:x.href,tx:x.tx};})`;
const POINT=`(function(key){
 var c=window.__cwList().filter(function(x){return x.key===key;})[0]; if(!c)return null;
 c.el.scrollIntoView({block:'center',inline:'center'});
 var r=c.el.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2};})`;

/* ------------------------------------------------------------- the walker */
function Rec(){
 this.rows=[];             /* {surface, k, s, tf, cls, id, x, unread, profile, width} */
 this.surfaces={};         /* surface key -> {tab, sub, profile, width, unread, n} */
 this.seen=new Set();
}
Rec.prototype.surface=function(key,meta){ if(!this.surfaces[key])this.surfaces[key]=Object.assign({n:0},meta); return this.surfaces[key]; };
Rec.prototype.add=function(key,meta,items){
 const S=this.surface(key,meta); let added=0;
 for(const it of items){
  const dk=key+'\u0001'+it.k+'\u0001'+it.s;
  if(this.seen.has(dk))continue; this.seen.add(dk);
  this.rows.push({surface:key,k:it.k,s:it.s,tf:it.tf||'none',cls:it.cls||'',id:it.id||'',x:it.x||''});
  added++;}
 S.n+=added; return added;};

async function collectAll(page){
 const a=await page.evaluate(COLLECT);
 const b=await page.evaluate(()=>{const o=window.__cw||[];window.__cw=[];return o;});
 return a.concat(b.map(r=>({k:r.k,s:r.s,tf:'none',cls:'',id:'',x:r.x})));}

function diffItems(base,now){
 const bs=new Set(base.map(r=>r.k+'\u0001'+r.s));
 return now.filter(r=>!bs.has(r.k+'\u0001'+r.s));}

async function settle(page,ms){ await page.waitForTimeout(ms||320); }

async function boot(b,w,h,wn){
 const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,
   isMobile:wn==='phone',hasTouch:wn==='phone'});
 const p=await c.newPage();
 await p.addInitScript(require('../tests/seed.js').FULL_SIGHT);
 const dialogs=[];
 p.on('dialog',async d=>{dialogs.push({k:'dialog',s:d.message(),tf:'none',x:d.type()});try{await d.dismiss();}catch(e){}});
 p.on('popup',async q=>{try{await q.close();}catch(e){}});
 p.on('download',async d=>{try{await d.cancel();}catch(e){}});
 p.on('pageerror',e=>{});
 await p.goto('file://'+FILE+'?dev=1',{waitUntil:'load'});
 await p.waitForFunction(()=>typeof setTab==='function'&&typeof PEOPLE!=='undefined'&&typeof compute==='function',null,{timeout:45000});
 await p.waitForTimeout(1800);
 await p.evaluate(HOOKS); await p.evaluate(LIB);
 return {c,p,dialogs};}

async function loadWho(p,who){
 if(who==='blank')return;
 await p.evaluate(nm=>{const i=PEOPLE.findIndex(x=>x.nm===nm); if(i>=0)loadP(i);},who);
 await p.waitForTimeout(500);
 await p.evaluate(HOOKS);}

async function isUnread(p){ return p.evaluate(()=>{try{return !!compute().unread;}catch(e){return null;}}); }

/* A PRESS CAN READ THE PERSON. A control on the Intake answers a law and one on
   the Story commits a line, so after it the blank profile is not blank, and
   every surface walked from there on would be called unread when it is not.
   The state is read after every press. When a blank profile has stopped being
   unread the browser's storage is cleared and the page is loaded again, which
   is the only thing that puts it back, because the app saves the record. */
async function resetBlank(p,tabK){
 await p.evaluate(()=>{try{localStorage.clear();sessionStorage.clear();}catch(e){}}).catch(()=>{});
 await p.reload({waitUntil:'load'});
 await p.waitForFunction(()=>typeof setTab==='function'&&typeof PEOPLE!=='undefined'&&typeof compute==='function',null,{timeout:45000});
 await p.waitForTimeout(1500);
 await p.evaluate(HOOKS); await p.evaluate(LIB);
 if(tabK>=0)await p.evaluate(k=>setTab(k),tabK);
 await p.waitForTimeout(700);}

async function goTab(p,k){
 await p.evaluate(k=>{ try{ if(typeof relClose==='function')relClose(); }catch(e){}
  setTab(k);},k);
 /* the rings count up from nought when a surface opens, and a snapshot taken
    on the way reads "Coherence 0%" for somebody at 62. Long enough to land. */
 await p.waitForTimeout(1000);
 await p.evaluate(HOOKS);}

async function closeStuff(p,k){
 await p.keyboard.press('Escape').catch(()=>{});
 if(k>=0)await p.evaluate(k=>{ try{ if(typeof relClose==='function')relClose(); }catch(e){} try{ setTab(k);}catch(e){} },k).catch(()=>{});
 await p.waitForTimeout(200);}

/* press one control by its key, with a real mouse at its real position */
async function press(p,key){
 const list=await p.evaluate(CLICKABLES);
 const c=list.find(x=>x.key===key); if(!c)return false;
 if(c.href&&/^(https?:|mailto:|tel:)/i.test(c.href))return false;
 if(c.tag==='SELECT'||c.type==='range'||c.type==='file')return false;
 const box=await p.evaluate(`(${POINT})(${JSON.stringify(key)})`);
 if(!box)return false;
 try{ await p.mouse.click(Math.max(1,box.x),Math.max(1,box.y),{delay:20}); }catch(e){return false;}
 return true;}

/* the dev skip button, the brand and the profile switch change who is walked,
   which is this file's job and not the page's */
const NEVER=/^(BUTTON\.dev-skip\|)|^SELECT\./;

async function crawlTab(p,rec,ctx,tabK,tabNm,depth){
 /* hosted state of the tab before any press */
 const baseItems=await collectAll(p);
 const list=(await p.evaluate(CLICKABLES)).filter(c=>!NEVER.test(c.key));
 let n=0;
 for(const c of list){
  const sk=ctx.profile+'|'+ctx.width+'|'+c.key;
  if(ctx.pressed.has(sk))continue; ctx.pressed.add(sk);
  if(++n>ctx.cap)break;
  const before=baseItems;
  const ok=await press(p,c.key);
  if(!ok)continue;
  await settle(p,520);
  /* A PRESS THAT MOVES THE PAGE TO ANOTHER TAB IS A DOOR, NOT A SURFACE. That
     tab is walked on its own turn, so what it shows is not read twice and the
     press is not crawled one level deeper from the wrong place. */
  if(tabK>=0){
   const tn=await p.evaluate(()=>{try{return S.tab;}catch(e){return null;}});
   if(tn!==null&&tn!==tabK&&tn!==undefined){ await closeStuff(p,tabK); continue; }}
  else{
   const here=await p.evaluate(()=>location.href).catch(()=>'');
   if(ctx.url&&here&&here!==ctx.url){ await p.goto(ctx.url,{waitUntil:'load'}).catch(()=>{}); await p.waitForTimeout(500);
    await p.evaluate(HOOKS).catch(()=>{}); await p.evaluate(LIB).catch(()=>{}); continue; }}
  const now=await collectAll(p);
  const fresh=diffItems(before,now).filter(r=>!(r.k==='text'&&before.some(b=>b.s===r.s)));
  const dl=ctx.dialogs.splice(0);
  const label=(c.tx||c.key.split('|')[0]).replace(/\s+/g,' ').slice(0,28)||c.tag;
  const key=ctx.keyBase+' > '+label;
  const items=fresh.concat(dl);
  const unNow=tabK>=0?await isUnread(p):ctx.unread;
  if(items.length)rec.add(key,{tab:tabNm,sub:label,profile:ctx.profile,width:ctx.width,unread:unNow,via:'press'},items);
  if(tabK>=0&&ctx.profile==='blank'&&unNow===false){ ctx.resets=(ctx.resets||0)+1; await resetBlank(p,tabK); continue; }
  /* one level down: what the press opened that was not on the tab before */
  if(depth<2&&fresh.length>6){
   const inner=(await p.evaluate(CLICKABLES)).filter(x=>!NEVER.test(x.key)&&!list.some(l=>l.key===x.key));
   let m=0;
   for(const d of inner){
    const dk=ctx.profile+'|'+ctx.width+'|'+d.key;
    if(ctx.pressed.has(dk))continue; ctx.pressed.add(dk);
    if(++m>8)break;
    const b2=await collectAll(p);
    if(!(await press(p,d.key)))continue;
    await settle(p,420);
    const n2=await collectAll(p);
    const f2=diffItems(b2,n2).filter(r=>!(r.k==='text'&&b2.some(b=>b.s===r.s)));
    const dl2=ctx.dialogs.splice(0);
    const lb2=(d.tx||d.key.split('|')[0]).replace(/\s+/g,' ').slice(0,28)||d.tag;
    const un2=tabK>=0?await isUnread(p):ctx.unread;
    if(f2.length||dl2.length)rec.add(key+' > '+lb2,{tab:tabNm,sub:label+' > '+lb2,profile:ctx.profile,width:ctx.width,unread:un2,via:'press2'},f2.concat(dl2));
    if(tabK>=0&&ctx.profile==='blank'&&un2===false){ ctx.resets=(ctx.resets||0)+1; await resetBlank(p,tabK); break; }
    /* put the inner state back by returning to the opening press's own state */
    await p.keyboard.press('Escape').catch(()=>{});
    await settle(p,120);
   }
  }
  await closeStuff(p,tabK);
  /* a press that moved the page away from the tab is brought home */
 }
}

/* a hover pass over carriers whose text is written by script on hover. Capped
   per tab, and run on the loaded profile on desktop only.

   IT DOES NOT RE-READ THE PAGE AFTER EVERY MOVE. The first cut collected the
   whole page twice per point and a profile took twenty minutes. A caption slot
   written on hover shows up as a mutation, so one observer records every piece
   of text written while the mouse moves, and the page is read once before and
   once after. A tooltip panel is read by the TIP hooks. */
async function hoverPass(p,rec,ctx,tabNm,tabK){
 const base=await p.evaluate(COLLECT);
 const pts=await p.evaluate(()=>{
  var out=[], seen={};
  [].forEach.call(document.querySelectorAll('[title],[data-tip],[data-tip-t],[data-hov],.stk-r,.lsec-hd,[onmouseover],[onmouseenter],[onmousemove]'),function(e){
   var s=getComputedStyle(e), b=e.getBoundingClientRect();
   if(s.display==='none'||s.visibility==='hidden'||!(b.width>0&&b.height>0)||b.bottom<0||b.top>innerHeight)return;
   var k=(typeof e.className==='string'?e.className:'')+'|'+(e.getAttribute('data-tip')||e.getAttribute('title')||'').slice(0,20);
   if(seen[k])return; seen[k]=1;
   out.push({x:b.left+b.width/2,y:b.top+b.height/2});});
  return out.slice(0,50);});
 await p.evaluate(()=>{
  window.__cwh=new Set();
  if(window.__cwo)window.__cwo.disconnect();
  window.__cwo=new MutationObserver(function(ms){
   ms.forEach(function(m){
    var add=function(t){t=String(t||'').replace(/\s+/g,' ').trim(); if(t.length>=3&&t.length<400&&/[A-Za-z]{3}/.test(t))window.__cwh.add(t);};
    if(m.type==='characterData')add(m.target.data);
    m.addedNodes.forEach(function(n){ if(n.nodeType===3)add(n.data); else if(n.nodeType===1)add(n.innerText||n.textContent);});});});
  window.__cwo.observe(document.body,{childList:true,characterData:true,subtree:true});});
 for(const pt of pts){ await p.mouse.move(pt.x,pt.y); await p.waitForTimeout(110); }
 /* canvases and svgs: a coarse sweep, because a mark has no element to hover */
 const boxes=await p.evaluate(()=>[].map.call(document.querySelectorAll('canvas,svg'),function(e){
  var b=e.getBoundingClientRect(), s=getComputedStyle(e);
  if(s.display==='none'||s.visibility==='hidden'||b.width<160||b.height<160)return null;
  return {x:b.left,y:b.top,w:b.width,h:b.height};}).filter(Boolean).slice(0,2));
 for(const bx of boxes)
  for(let i=1;i<=7;i++)for(let j=1;j<=5;j++){
   await p.mouse.move(bx.x+bx.w*i/8,bx.y+bx.h*j/6); await p.waitForTimeout(45);}
 await p.waitForTimeout(150);
 const seen=await p.evaluate(()=>{ if(window.__cwo)window.__cwo.disconnect(); var o=[...(window.__cwh||[])]; window.__cwh=new Set(); return o;});
 const hooked=(await p.evaluate(()=>{const o=window.__cw||[];window.__cw=[];return o;})).map(r=>({k:r.k,s:r.s,tf:'none',x:r.x}));
 /* a string that is only a number moving is not copy: strings whose shape,
    digits removed, is already on the page are dropped */
 const shape=s=>s.replace(/\d+(?:[.,]\d+)?/g,'N');
 const known=new Set(base.map(r=>shape(r.s)));
 const fresh=seen.filter(s=>!known.has(shape(s))).slice(0,150).map(s=>({k:'hover',s,tf:'none',x:''}));
 let got=0;
 if(fresh.length||hooked.length)got+=rec.add(ctx.keyBase+' > hover',{tab:tabNm,sub:'hover',profile:ctx.profile,width:ctx.width,unread:ctx.unread,via:'hover'},fresh.concat(hooked));
 return got;}

/* --------------------------------------------------- the data tables, by name */
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
 var out=[], seen=new Set(), budget=6000;
 function keep(s){
  if(typeof s!=='string'||s.length<2||!/[A-Za-z]/.test(s))return false;
  if(/^(#[0-9a-f]{3,8}|rgba?\\(|M[\\d. -]|<svg|https?:|\\.\\/|data:)/i.test(s))return false;
  if(/^[a-z0-9_.\\-:\\/]+$/.test(s)&&s.length<16&&!/[A-Z]/.test(s))return false;
  return /\\s/.test(s)||/^[A-Z]/.test(s)||/[.!?]$/.test(s);}
 function walk(x,p,d){
  if(budget<=0||d>7||x==null)return;
  if(typeof x==='string'){ if(keep(x)){out.push({p:p,s:x});budget--;} return; }
  if(typeof x!=='object')return;
  if(seen.has(x))return; seen.add(x);
  if(Array.isArray(x)){ x.slice(0,400).forEach(function(y,i){walk(y,p+'['+i+']',d+1);}); return; }
  Object.keys(x).slice(0,400).forEach(function(k){
   var y; try{y=x[k];}catch(e){return;} if(typeof y==='function')return;
   walk(y,p+'.'+k,d+1);});}
 walk(v,name,0); return out;})`;

(async()=>{
 const commit=sh('git rev-parse --short HEAD'), md5=sh('md5sum '+JSON.stringify(FILE)).slice(0,8);
 const dirty=sh('git status --porcelain -- atuned_src')?'DIRTY':'clean';
 const rec=new Rec();
 const meta={when:new Date().toISOString().replace('T',' ').slice(0,19),commit,dirty,md5,file:path.relative(ROOT,FILE),quick:QUICK,profiles:{},tabs:[]};
 const b=await chromium.launch({executablePath:CHROME});
 const t0=Date.now();
 const log=m=>process.stderr.write('['+Math.round((Date.now()-t0)/1000)+'s] '+m+'\n');

 for(const [w,h,wn] of WIDTHS){
  const {c,p,dialogs}=await boot(b,w,h,wn);
  const people=await p.evaluate(()=>PEOPLE.map(x=>x.nm));
  const tabs=(await p.evaluate(()=>TABDEF.map(t=>({nm:t.nm,k:t.k})).concat(Object.keys(TABEXTRA).map(k=>({nm:TABEXTRA[k].nm,k:TABEXTRA[k].k}))))).filter(t=>!ONLY_TABS.length||ONLY_TABS.includes(t.nm));
  meta.tabs=tabs.map(t=>t.nm);
  const who_all=['blank'].concat(people).filter(w=>!ONLY_WHO.length||ONLY_WHO.includes(w));
  const crawlSet=new Set(['blank'].concat(wn==='desktop'?CRAWL_LOADED.filter(x=>people.includes(x)):[]));
  const ctxCache={};
  for(const who of who_all){
   if(wn==='phone'&&who!=='blank'&&!crawlSet.has(who)&&who!=='Derek')continue;   /* phone: blank and the heavy ones */
   await loadWho(p,who);
   const unread=await isUnread(p);
   meta.profiles[who]=unread;
   const ctx={profile:who,width:wn,unread,dialogs,pressed:new Set(),cap:wn==='desktop'?40:25,keyBase:''};
   for(const t of tabs){
    ctx.keyBase=t.nm+'/'+who+'/'+wn;
    if(who!=='blank'&&crawlSet.has(who))await loadWho(p,who);
    await goTab(p,t.k);
    if(who==='blank'&&(await isUnread(p))===false)await resetBlank(p,t.k);
    const items=await collectAll(p);
    ctx.unread=await isUnread(p);
    rec.add(ctx.keyBase,{tab:t.nm,sub:'',profile:who,width:wn,unread:ctx.unread,via:'tab'},items.concat(dialogs.splice(0)));
    if(!QUICK&&crawlSet.has(who)){
     await crawlTab(p,rec,ctx,t.k,t.nm,1);
     if(wn==='desktop'&&who!=='blank')await hoverPass(p,rec,ctx,t.nm,t.k);
     await goTab(p,t.k);}
   }
   log(wn+' '+who+' unread='+unread+' resets='+(ctx.resets||0)+' rows='+rec.rows.length);
  }
  /* the release, which is not in TABDEF */
  if(!QUICK&&!ONLY_TABS.length){
   await loadWho(p,'Derek');
   const un=await isUnread(p);
   const rel=await p.evaluate(()=>{var out=[];
    try{ var ids=compute().carrying.slice(0,3).map(function(n){return n.i;});
     if(ids.length&&typeof relPick==='function'){
      var had=CURP&&CURP.ui?CURP.ui.voice:undefined; if(CURP&&CURP.ui)CURP.ui.voice=false;
      var grab=function(nm){var h=document.getElementById('rel'); out.push({nm:nm,html:h?h.innerHTML.length:0});};
      relPick(ids); grab('setup'); }}catch(e){} return out;});
    const items=await collectAll(p);
    rec.add('Release setup/Derek/'+wn,{tab:'Release',sub:'setup',profile:'Derek',width:wn,unread:un,via:'release'},items);
    try{ await p.evaluate(()=>{ var g=document.getElementById('relgo'); if(g){g.click(); if(window.RUN&&RUN.timer)clearTimeout(RUN.timer);} });
     await p.waitForTimeout(500);
     rec.add('Release open/Derek/'+wn,{tab:'Release',sub:'open',profile:'Derek',width:wn,unread:un,via:'release'},await collectAll(p));
     await p.evaluate(()=>{ if(window.RUN){RUN.phase='run';RUN.idx=0;RUN.pass=0;} if(typeof relRender==='function')relRender(); });
     await p.waitForTimeout(400);
     rec.add('Release run/Derek/'+wn,{tab:'Release',sub:'run',profile:'Derek',width:wn,unread:un,via:'release'},await collectAll(p));
     await p.evaluate(()=>{ if(typeof relClose==='function')relClose(); });}catch(e){}
  }
  /* data tables, once, at desktop */
  if(wn==='desktop'){
   const names=tableNames(); let got=0;
   for(const {name,file} of names){
    const arr=await p.evaluate(`(${WALK_TABLE})(${JSON.stringify(name)})`).catch(()=>null);
    if(!arr||!arr.length)continue;
    const key='data:'+name;
    got+=rec.add(key,{tab:'data',sub:file,profile:'-',width:'-',unread:false,via:'data'},
      arr.map(x=>({k:'data',s:x.s.replace(/\s+/g,' ').trim(),tf:'none',x:x.p})));}
   log('data tables: '+got+' strings');
  }
  await c.close();
 }
 /* the funnel pages are part of the site and are separate files */
 if(!QUICK&&!process.argv.includes('--nofunnel')){
  for(const f of ['index','quiz','about','buy']){
   const fp=path.join(ROOT,'funnel',f+'.html'); if(!fs.existsSync(fp))continue;
   for(const [w,h,wn] of WIDTHS){
    const c=await b.newContext({viewport:{width:w,height:h},isMobile:wn==='phone',hasTouch:wn==='phone'});
    const p=await c.newPage(); const dialogs=[];
    p.on('dialog',async d=>{dialogs.push({k:'dialog',s:d.message(),tf:'none'});try{await d.dismiss();}catch(e){}});
    try{ await p.goto('file://'+fp,{waitUntil:'load'}); await p.waitForTimeout(1500);
     await p.evaluate(HOOKS).catch(()=>{}); await p.evaluate(LIB).catch(()=>{});
     rec.add('funnel:'+f+'/-/'+wn,{tab:'funnel '+f,sub:'',profile:'-',width:wn,unread:false,via:'funnel'},await collectAll(p));
     if(wn==='desktop'){
      const ctx={profile:'-',width:wn,unread:false,dialogs,pressed:new Set(),cap:30,keyBase:'funnel:'+f,url:p.url()};
      await crawlTab(p,rec,ctx,-1,'funnel '+f,1);}
    }catch(e){ log('funnel '+f+' '+wn+' failed: '+String(e.message).slice(0,80)); }
    await c.close();}}
 }
 await b.close();

 /* ONE ENTRY PER DISTINCT STRING, WITH THE SURFACES IT APPEARS ON. The same
    string is on fifteen profiles and a dozen tabs, and a file that repeats it
    for each was eight megabytes for three hundred thousand characters. */
 const keys=Object.keys(rec.surfaces), idx={}; keys.forEach((k,i)=>idx[k]=i);
 const uniq=new Map();
 for(const r of rec.rows){
  const u=r.k+'\u0001'+r.tf+'\u0001'+r.s;
  let e=uniq.get(u);
  if(!e){e={k:r.k,s:r.s,tf:r.tf,cls:r.cls,x:r.x,w:[]};uniq.set(u,e);}
  const i=idx[r.surface]; if(e.w.indexOf(i)<0)e.w.push(i);}
 meta.surfaces=keys.length;
 meta.strings=uniq.size;
 meta.rows=rec.rows.length;
 const surfaces=keys.map(k=>Object.assign({key:k},rec.surfaces[k]));
 fs.writeFileSync(OUT,JSON.stringify({meta,surfaces,strings:[...uniq.values()]}));
 log('wrote '+path.relative(ROOT,OUT)+'  surfaces '+meta.surfaces+'  distinct strings '+meta.strings);
})().catch(e=>{console.error(e);process.exit(1);});
