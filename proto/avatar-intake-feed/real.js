/* THE REAL SCREEN, SHOT AND MEASURED. Round HS.

   Everything the explainers in this folder point at is read off the shipped
   build, source.html, never redrawn from memory. An own profile carries
   Angela's four fixture pairs from proto/avatar/seats/pairs.js (the same
   pairs round HG shot), two stories, and two archetype ratings, Caregiver 4
   and Magician 2. The left column is opened, because it starts shut and the
   left rail's archetype picks are half of the question being answered.

   Writes shots/real-1600-hero.png, shots/real-1600-arch.png,
   shots/real-1600-wheel.png and shots/real-geo.json, the rectangles the
   callouts are placed on.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/avatar-intake-feed/real.js */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const ROOT=path.join(__dirname,'..','..'), OUT=path.join(__dirname,'shots');
const PAIRS=require(path.join(ROOT,'proto/avatar/seats/pairs.js'));
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
 await p.goto('file://'+path.join(ROOT,'source.html'));
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
 await p.waitForTimeout(400);
 const build=await p.evaluate((pairs)=>{
  iqEnsure();
  CURP.avatar=CURP.avatar||avatarBlank(); CURP.avatar.pairs=pairs; CURP.avatar.built=true;
  ['I said everything happens for a reason at the funeral and felt sad for weeks.',
   'I am so tired of being the one who understands everybody else. My chest is tight.',
   'I keep choosing the same kind of person and I am afraid it is who I am.']
   .forEach(function(t){applyStory(t,parseStory(t));});
  pSave();
  var all={}; all[CURP.id]={arch:{Caregiver:4,Magician:2},load0:{}};
  STORE.set('atuned-avatar-side',JSON.stringify(all));
  AV.arch='Caregiver'; setTab(TAB.INTAKE); render(); renderAvatar();
  return document.documentElement.getAttribute('data-build');},PAIRS.Angela);
 await p.evaluate(()=>{if(document.body.classList.contains('lshut'))document.getElementById('lfold').click();});
 await p.waitForTimeout(700);
 const R=(sel)=>p.evaluate((s)=>{var e=document.querySelector(s); if(!e)return null;
  var r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};},sel);
 /* a rectangle found by the words on it, for the rail blocks that carry no id */
 const T=(words,minX,maxX)=>p.evaluate((a)=>{
  var hit=[...document.querySelectorAll('body *')].filter(function(e){
   var r=e.getBoundingClientRect();
   return e.children.length===0&&e.textContent.trim()===a[0]&&r.x>=a[1]&&r.x<=a[2]&&r.width>0;})[0];
  if(!hit)return null; var r=hit.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};},[words,minX,maxX]);
 const geo={build:build};
 await p.screenshot({path:path.join(OUT,'real-1600-hero.png')});
 geo.hero={stage:await R('.stage'), head:await R('.av-hd'), ring:await R('.av-ring'), side:await R('.av-side'),
  rsum:await T('Energetic Summary',1250,1600)};
 await p.evaluate(()=>{document.querySelector('.av-arch').scrollIntoView({block:'start'});});
 await p.waitForTimeout(500);
 await p.screenshot({path:path.join(OUT,'real-1600-arch.png')});
 geo.arch={stage:await R('.stage'), wheel:await R('.av-wheel'), det:await R('.av-det'),
  scale:await R('.av-scale'), cmp:await R('.av-cmp'), ar1:await R('#ar1'), ar2:await R('#ar2'),
  prim:await T('2 · Primary',0,320), sec:await T('Secondary',0,320), capA:await R('#capA'),
  rArch:await T('Archetypes',1250,1600), rThird:await T('Third',1250,1600)};
 const g=geo.arch.wheel, d=geo.arch.det;
 const clip={x:g.x-12,y:Math.min(g.y,d.y)-12,w:d.x+d.w-g.x+24,h:Math.max(g.h,d.h)+24};
 await p.screenshot({path:path.join(OUT,'real-1600-wheel.png'),clip:{x:clip.x,y:clip.y,width:clip.w,height:clip.h}});
 geo.wheelClip=clip;
 fs.writeFileSync(path.join(OUT,'real-geo.json'),JSON.stringify(geo,null,1));
 console.log('build '+build+(errs.length?'  JS ERRORS: '+errs.join(' | '):'  no JS errors'));
 console.log(JSON.stringify(geo));
 await b.close();})();
