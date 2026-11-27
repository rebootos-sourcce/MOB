/* ============================================================
   THE SIX ICPs IN FRONT OF THE SHELF AND THE DIAL. Round DB.

   He asked: "simulate this interface with the ICPs and the focus group,
   see what they say about the shelf and the circular design." A simulated
   reaction is only worth anything if each persona is looking at their own
   reading, not at James's. So this loads each of the six ICPs from
   atuned_src/engine/data/people.js, commits their own story bank lines from
   sim/stories.js the way proto/shelf/build.js commits James's, and drives
   proto/shelf/shelf.html (read only) with real presses:

     1. the Field, Wheel, shelf closed
     2. their own heaviest address pressed, the shelf open on it
     3. the Field, Dial, shelf closed
     4. the same address pressed on the Dial, to see whether the shelf's
        ring follows the press on the circular view too

   at 1600 by 1000 and 390 by 844, and writes what each screen actually
   says to shots/facts.json, so every reaction on the page can be checked
   against what that persona was shown.

     NODE_PATH=/opt/node22/lib/node_modules node proto/icp-review/shoot.js
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const ROOT=path.resolve(__dirname,'..','..');
const OUT=path.join(__dirname,'shots');
const PAGE='file://'+path.join(ROOT,'proto','shelf','shelf.html');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const {STORYBANK}=require(path.join(ROOT,'sim','stories.js'));
const ICPS=['Sofia','Diane','Marcus','Angela','Derek','James'];
fs.mkdirSync(OUT,{recursive:true});
const wait=(p,ms)=>p.waitForTimeout(ms);

async function ready(p){
 await p.goto('about:blank');
 await p.goto(PAGE+'#blank');
 await p.waitForFunction(()=>document.documentElement.getAttribute('data-shelf-ready')==='1',null,{timeout:25000});
 await p.evaluate(()=>{try{localStorage.clear();}catch(e){}});
 await wait(p,500);}

/* load a persona and commit their own stories, same calls build.js makes for James */
async function load(p,who){
 const lines=(STORYBANK[who]||[]).map(x=>x[1]);
 return p.evaluate(({who,lines})=>{
  const i=PEOPLE.findIndex(q=>q.nm===who); loadP(i);
  lines.forEach(function(t,k){applyStory(t);verpApply(t);
   if(typeof leanApply==='function')leanApply(t);
   CURP.story=CURP.story||{entries:[]};var ps=parseStory(t);
   CURP.story.entries.push({t:'2026-09-2'+k+'T08:00:00Z',text:t,imprints:ps.imprints.length,bands:ps.bands});});
  fviewSet('wheel'); setTab(TAB.FIELD); render();
  const r=compute();
  const held=W.filter(n=>n.sq>0).sort((a,b)=>b.sq-a.sq);
  const top=held[0]||null;
  return {who,i,lines:lines.length,CQ:+(+r.CQ).toFixed(1),DQ:+(+r.DQ).toFixed(1),
   SQ:r.SQ!=null?+(+r.SQ).toFixed(1):null,tier:r.tier||null,unread:!!r.unread,
   held:held.length, heavy:held.filter(n=>n.sq>=4).length,
   top:top?{i:top.i,k:top.k,seat:top.b,sq:+top.sq.toFixed(1)}:null,
   top3:held.slice(0,3).map(n=>n.k+' '+n.sq.toFixed(1)+' '+n.b)};},{who,lines});}

async function wheelAddr(p,idx){
 return p.evaluate(ix=>{const cv=document.getElementById('cv').getBoundingClientRect();
  const h=HIT.filter(h=>h.k==='node'&&h.n&&h.n.i===ix).pop(); if(!h)return null;
  if(h.x!==undefined)return {x:cv.left+h.x,y:cv.top+h.y};
  let a1=h.a1; if(a1<h.a0)a1+=Math.PI*2;
  for(const fr of [.5,.35,.65,.2,.8])for(const fa of [.5,.3,.7,.15,.85]){
   const r=h.r0+(h.r1-h.r0)*fr, a=h.a0+(a1-h.a0)*fa;
   const x=h.cx+r*Math.cos(a), y=h.cy+r*Math.sin(a), t=hitTest(x,y);
   if(t&&t.k==='node'&&t.n&&t.n.i===ix)return {x:cv.left+x,y:cv.top+y};}
  return null;},idx);}
const SCROLL=`(function(){var b=document.body;if(b.scrollHeight>b.clientHeight+2&&/(auto|scroll)/.test(getComputedStyle(b).overflowY))return b;return document.scrollingElement;})()`;

/* what the open shelf actually says, and how much of it there is */
async function shelfFacts(p){
 return p.evaluate(()=>{
  const sh=document.getElementById('shelf'); if(!sh)return null;
  const b=sh.getBoundingClientRect();
  const txt=(sh.innerText||'').replace(/\n{2,}/g,'\n').trim();
  const words=txt.split(/\s+/).filter(Boolean).length;
  const nums=(txt.match(/\d+(\.\d+)?/g)||[]).length;
  const ring=document.querySelector('.sh-src');
  const inView=Array.from(sh.querySelectorAll('*')).filter(e=>{const r=e.getBoundingClientRect();
   return e.children.length===0&&r.height>0&&r.top>=b.top&&r.bottom<=Math.min(b.bottom,innerHeight)&&(e.textContent||'').trim();})
   .map(e=>e.textContent.trim()).join(' ');
  return {state:document.body.dataset.shelf, title:(document.querySelector('.sh-nm')||{}).textContent||null,
   ringOn:!!(ring&&ring.classList.contains('on')), words, nums,
   firstScreenWords:inView.split(/\s+/).filter(Boolean).length,
   text:txt.slice(0,1400)};});}

/* what the Dial draws: how many words sit on the picture */
async function dialFacts(p){
 return p.evaluate(()=>{const f=document.getElementById('frend'); if(!f)return null;
  const b=f.getBoundingClientRect();
  const t=Array.from(f.querySelectorAll('text')).filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;});
  const words=t.map(e=>e.textContent.trim()).filter(Boolean);
  const nums=Array.from(document.querySelectorAll('.stage *')).filter(e=>{
   if(e.children.length)return false; const r=e.getBoundingClientRect();
   if(!(r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0))return false;
   return /^\s*[-–]?\d+(\.\d+)?%?\s*$/.test(e.textContent||'');}).length;
  return {box:[b.left,b.top,b.width,b.height].map(Math.round), labels:words.length,
   sample:words.slice(0,40), stageNumbers:nums};});}

(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const all={}; const errs=[];
 for(const [Wd,H] of [[1600,1000],[390,844]]){
  const phone=Wd<600;
  const ctx=await b.newContext({viewport:{width:Wd,height:H},hasTouch:phone,isMobile:phone,deviceScaleFactor:1});
  const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(Wd+' '+e.message));
  const tap=async(pt)=>{ if(phone)await p.touchscreen.tap(pt.x,pt.y); else await p.mouse.click(pt.x,pt.y);};
  const shot=async(nm)=>{if(!phone)await p.mouse.move(Wd-40,H-20);await wait(p,650);
   await p.screenshot({path:path.join(OUT,nm+'-'+Wd+'.jpg'),type:'jpeg',quality:84});};
  for(const who of ICPS){
   await ready(p);
   const f=await load(p,who); await wait(p,900);
   const key=who.toLowerCase(); const rec={reading:f};
   await p.evaluate(`${SCROLL}.scrollTo(0,0)`);
   await shot(key+'-1-wheel');
   /* their own heaviest address, pressed on the wheel */
   if(f.top){
    let a=await wheelAddr(p,f.top.i);
    if(a&&phone){await p.evaluate(`${SCROLL}.scrollBy(0,${Math.round(a.y-300)})`); await wait(p,300); a=await wheelAddr(p,f.top.i);}
    if(a){await tap(a); await shot(key+'-2-shelf'); rec.shelf=await shelfFacts(p);}
    else rec.shelf={missed:'no hit point found for '+f.top.k};
    try{await p.click('.sh-x',{timeout:2000});}catch(e){}
    await wait(p,400);}
   /* the Dial */
   await p.evaluate(()=>{fviewSet('dial');});
   await p.evaluate(`${SCROLL}.scrollTo(0,0)`);
   await wait(p,900);
   await shot(key+'-3-dial');
   rec.dial=await dialFacts(p);
   /* the same address pressed on the Dial: does the shelf open, and does its ring follow */
   if(f.top){
    const hsel=await p.evaluate(ix=>{const h=(typeof FR_HIT!=='undefined'?FR_HIT:[]).findIndex(x=>x&&x.k==='node'&&x.n&&x.n.i===ix);
     if(h<0)return null; const e=document.querySelector('#frend [data-h="'+h+'"]'); if(!e)return null;
     const r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,h};},f.top.i);
    if(hsel){
     if(phone){await p.evaluate(`${SCROLL}.scrollBy(0,${Math.round(hsel.y-300)})`); await wait(p,300);}
     const pt=await p.evaluate(h=>{const e=document.querySelector('#frend [data-h="'+h+'"]');const r=e.getBoundingClientRect();
      return {x:r.left+r.width/2,y:r.top+r.height/2};},hsel.h);
     await tap(pt); await shot(key+'-4-dialpress'); rec.dialPress=await shelfFacts(p);
     try{await p.click('.sh-x',{timeout:2000});}catch(e){}}
    else rec.dialPress={missed:'no Dial mark found for '+f.top.k};}
   await p.evaluate(()=>{fviewSet('wheel');});
   all[key+'-'+Wd]=rec;
   console.log(Wd,who,'CQ',f.CQ,'held',f.held,'top',f.top&&f.top.k,
    'shelf',rec.shelf&&rec.shelf.title,'ring',rec.shelf&&rec.shelf.ringOn,
    'dial labels',rec.dial&&rec.dial.labels,'dial press ring',rec.dialPress&&rec.dialPress.ringOn,rec.dialPress&&rec.dialPress.title);}
  await ctx.close();}
 fs.writeFileSync(path.join(OUT,'facts.json'),JSON.stringify(all,null,1));
 if(errs.length)console.log('PAGE ERRORS',errs); else console.log('no page errors');
 await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
