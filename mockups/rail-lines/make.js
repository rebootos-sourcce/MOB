/* Builds every picture on the contact sheet from the real app. Mockup tooling:
   it opens source.html, takes the readings out of the left rail, puts the
   new lines in the same place and photographs the result.

   Run from the repo root:
   NODE_PATH=/opt/node22/lib/node_modules node mockups/rail-lines/make.js

   Everything it draws is read from data.json, which make-data.js read out of
   the built engine. Nothing is invented here. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const ROOT=path.resolve(__dirname,'..','..');
const OUT=path.join(__dirname,'shots'); fs.mkdirSync(OUT,{recursive:true});
const DATA=JSON.parse(fs.readFileSync(path.join(__dirname,'data.json'),'utf8'));
const LIB=fs.readFileSync(path.join(__dirname,'rail-lines.js'),'utf8');
const CSS=fs.readFileSync(path.join(__dirname,'rail-lines.css'),'utf8');
const WHO=['marcus','tomas','diane','you'], VARS=['hard','soft'];
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const CLOCK=5.0;           /* a moment where the edge is moving, so the trail shows */
const report={};

const HOSTCSS=`
#fdock.rl-gone{display:none!important}
.rl-wrap{padding:10px 0 6px}
body.lshut #lpanel>.rl-wrap{display:none}
.rl-wrapm{display:none}
body.lshut #lpanel>.rl-wrapm{display:flex!important;justify-content:center;margin-top:12px;padding-bottom:10px}
`;

async function boot(p,w,h){
 await p.setViewportSize({width:w,height:h});
 await p.goto('file://'+path.join(ROOT,'source.html')+'?dev=1');
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
 await p.waitForTimeout(6500);
 await p.addStyleTag({content:CSS+HOSTCSS});
 await p.addScriptTag({content:LIB});
 await p.evaluate(d=>{window.RL_DATA=d;},DATA);
}
async function load(p,idx){
 await p.evaluate(i=>{loadP(i);setTab(TAB.FIELD);render&&render();},idx);
 await p.waitForTimeout(500);
}
async function setShut(p,shut){
 const now=await p.evaluate(()=>document.body.classList.contains('lshut'));
 if(now!==shut){await p.evaluate(()=>document.getElementById('lfold').click());await p.waitForTimeout(450);}
}
async function inject(p,variant,who,clock){
 return p.evaluate(({variant,who,clock})=>{
  RL.clock=clock;
  if(window.__rl){window.__rl.forEach(i=>i.destroy());}
  document.querySelectorAll('.rl-wrap,.rl-wrapm').forEach(e=>e.remove());
  const lp=document.getElementById('lpanel'), fd=document.getElementById('fdock');
  fd.classList.add('rl-gone');
  const wrap=document.createElement('div'); wrap.className='rl-wrap'; wrap.id='rl-wrap';
  const host=document.createElement('div'); wrap.appendChild(host); lp.insertBefore(wrap,fd);
  const mini=document.createElement('div'); mini.className='rl-wrapm'; const mh=document.createElement('div'); mini.appendChild(mh); lp.appendChild(mini);
  const a=RL.mount(host,variant,RL_DATA[who],{manual:true});
  const b=RL.mount(mh,variant,RL_DATA[who],{mini:true,manual:true});
  window.__rl=[a,b];
  const r=host.firstChild.getBoundingClientRect();
  const aw=document.getElementById('awsum'), ar=aw?aw.getBoundingClientRect():null;
  const rows=[...host.firstChild.children].filter(e=>e.classList.contains('lr-ln')).map(e=>Math.round(e.getBoundingClientRect().height));
  return {blockH:Math.round(r.height),blockW:Math.round(r.width),wrapH:Math.round(wrap.getBoundingClientRect().height),rows,
   awBottom:ar?Math.round(ar.bottom):null, awTop:ar?Math.round(ar.top):null, vh:innerHeight};
 },{variant,who,clock});
}
async function clean(p){
 await p.evaluate(()=>{if(window.__rl)window.__rl.forEach(i=>i.destroy());window.__rl=null;RL.clock=null;
  document.querySelectorAll('.rl-wrap,.rl-wrapm').forEach(e=>e.remove());
  const fd=document.getElementById('fdock'); if(fd)fd.classList.remove('rl-gone');});
}

(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
 /* ---- 1600 x 1000 ---- */
 await boot(p,1600,1000);
 for(const who of WHO){
  await load(p,DATA[who].index);
  await setShut(p,false);
  const base=await p.evaluate(()=>{const f=document.getElementById('fdock').getBoundingClientRect();const aw=document.getElementById('awsum').getBoundingClientRect();
   return {fdockH:Math.round(f.height),awTop:Math.round(aw.top),awBottom:Math.round(aw.bottom)};});
  report['base-'+who]=base;
  await p.waitForTimeout(1800);
  await p.screenshot({path:path.join(OUT,`base-1600-${who}-open.png`)});
  await setShut(p,true); await p.screenshot({path:path.join(OUT,`base-1600-${who}-closed.png`)}); await setShut(p,false);
  for(const v of VARS){
   const m=await inject(p,v,who,CLOCK); report[`${v}-${who}`]=m;
   await p.waitForTimeout(150);
   await p.screenshot({path:path.join(OUT,`1600-${v}-${who}-open.png`)});
   await setShut(p,true); await p.waitForTimeout(150);
   await p.screenshot({path:path.join(OUT,`1600-${v}-${who}-closed.png`)});
   await setShut(p,false);
   await clean(p);
  }
 }
 /* ---- today's rows, eight real moments, for the before strip ---- */
 for(const who of ['marcus','tomas']){
  await load(p,DATA[who].index); await setShut(p,false); await p.waitForTimeout(1600);
  for(let i=0;i<8;i++){
   const el=await p.$('#key'); await el.screenshot({path:path.join(OUT,`today-key-${who}-${i}.png`)});
   await p.waitForTimeout(1400);}
 }
 /* ---- Snow, the light lighting, Marcus and Tomas ---- */
 await load(p,DATA.marcus.index); await setShut(p,false);
 await p.evaluate(()=>{const b=[...document.querySelectorAll('#themes button')].find(x=>/snow/i.test(x.getAttribute('aria-label')||x.title||x.textContent)); if(b)b.click();});
 await p.waitForTimeout(1200);
 for(const who of ['marcus','tomas']){
  await load(p,DATA[who].index); await p.waitForTimeout(900);
  await p.screenshot({path:path.join(OUT,`base-1600-${who}-snow.png`)});
  for(const v of VARS){await inject(p,v,who,CLOCK); await p.waitForTimeout(150); await p.screenshot({path:path.join(OUT,`1600-${v}-${who}-snow.png`)}); await clean(p);}
 }
 /* ---- 390 x 844: the column stacks under the picture ---- */
 await boot(p,390,844);
 for(const who of WHO){
  await load(p,DATA[who].index);
  const sc=async(name,wait)=>{await p.evaluate(()=>{const lp=document.getElementById('lpanel');lp.scrollIntoView({block:'start'});window.scrollBy(0,-8);});
   await p.waitForTimeout(wait); await p.screenshot({path:path.join(OUT,name)});};
  if(who==='marcus'||who==='tomas')await sc(`base-390-${who}.png`,1800);
  for(const v of VARS){
   const m=await inject(p,v,who,CLOCK); report[`m390-${v}-${who}`]=m;
   await sc(`390-${v}-${who}.png`,250); await clean(p);
  }
 }
 fs.writeFileSync(path.join(__dirname,'measure.json'),JSON.stringify(report,null,1));
 console.log(JSON.stringify(report));
 console.log(errs.length?'JS ERRORS '+errs.join(' | '):'no page errors');
 await b.close();
})();
