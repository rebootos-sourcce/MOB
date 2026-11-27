/* Builds every picture on the contact sheet from the real app. Mockup tooling:
   it opens source.html, empties the readings out of the left rail, puts one of
   the three blocks in the same place and photographs the result.

   Run from the repo root:
   NODE_PATH=/opt/node22/lib/node_modules node mockups/rail-simple/make.js

   Everything it draws is read from data.json, which make-data.js read out of
   the built engine. Nothing is invented here. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const ROOT=path.resolve(__dirname,'..','..');
const OUT=path.join(__dirname,'shots'); fs.mkdirSync(OUT,{recursive:true});
const DATA=JSON.parse(fs.readFileSync(path.join(__dirname,'data.json'),'utf8'));
const LIB=fs.readFileSync(path.join(__dirname,'rail-simple.js'),'utf8');
const CSS=fs.readFileSync(path.join(__dirname,'rail-simple.css'),'utf8');
const WHO=['marcus','tomas','diane','you'], OPTS=['a','b','c'];
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const report={};

const HOSTCSS=`
#fdock.rs-gone{display:none!important}
.rs-wrap{padding:10px 0 6px}
.rs-wrap .rs{margin:0 auto}
body.lshut #lpanel>.rs-wrap{display:none}
.rs-wrapm{display:none}
body.lshut #lpanel>.rs-wrapm{display:flex!important;justify-content:center;margin-top:12px}
`;

async function boot(p,w,h){
 await p.setViewportSize({width:w,height:h});
 await p.goto('file://'+path.join(ROOT,'source.html')+'?dev=1');
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
 await p.waitForTimeout(500);
 await p.addStyleTag({content:CSS+HOSTCSS});
 await p.addScriptTag({content:LIB});
 await p.evaluate(d=>{window.RS_DATA=d;},DATA);
}
async function load(p,idx){
 await p.evaluate(i=>{loadP(i);setTab(TAB.FIELD);render&&render();},idx);
 await p.waitForTimeout(500);
}
async function setShut(p,shut){
 const now=await p.evaluate(()=>document.body.classList.contains('lshut'));
 if(now!==shut){await p.evaluate(()=>document.getElementById('lfold').click());await p.waitForTimeout(450);}
}
async function inject(p,opt,who){
 return p.evaluate(({opt,who})=>{
  RS.clock=9.3;
  if(window.__rs){window.__rs.forEach(i=>i.destroy());}
  document.querySelectorAll('.rs-wrap,.rs-wrapm').forEach(e=>e.remove());
  const lp=document.getElementById('lpanel'), fd=document.getElementById('fdock');
  fd.classList.add('rs-gone');
  const wrap=document.createElement('div'); wrap.className='rs-wrap'; wrap.id='rs-wrap';
  const host=document.createElement('div'); wrap.appendChild(host); lp.insertBefore(wrap,fd);
  const mini=document.createElement('div'); mini.className='rs-wrapm'; const mh=document.createElement('div'); mini.appendChild(mh); lp.appendChild(mini);
  const iw=Math.min(300,Math.round(wrap.clientWidth))||262;
  const dd=window.__pal?Object.assign({},RS_DATA[who],{pal:window.__pal}):RS_DATA[who];
  const a=RS.mount(host,opt,dd,{W:iw,manual:true});
  const b=RS.mount(mh,opt,dd,{mini:true,manual:true});
  window.__rs=[a,b];
  const r=host.getBoundingClientRect();
  const aw=document.getElementById('awsum'), ar=aw?aw.getBoundingClientRect():null;
  return {blockH:Math.round(r.height),blockW:Math.round(r.width),wrapH:Math.round(wrap.getBoundingClientRect().height),
   awBottom:ar?Math.round(ar.bottom):null, awTop:ar?Math.round(ar.top):null, vh:innerHeight};
 },{opt,who});
}
async function clean(p){
 await p.evaluate(()=>{if(window.__rs)window.__rs.forEach(i=>i.destroy());window.__rs=null;RS.clock=null;
  document.querySelectorAll('.rs-wrap,.rs-wrapm').forEach(e=>e.remove());
  const fd=document.getElementById('fdock'); if(fd)fd.classList.remove('rs-gone');});
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
  /* the baseline: the app's own rail, untouched, and how tall the readings are in it */
  const base=await p.evaluate(()=>{const f=document.getElementById('fdock').getBoundingClientRect();const aw=document.getElementById('awsum').getBoundingClientRect();
   return {fdockH:Math.round(f.height),awTop:Math.round(aw.top),awBottom:Math.round(aw.bottom)};});
  report['base-'+who]=base;
  await p.waitForTimeout(1800);
  await p.screenshot({path:path.join(OUT,`base-1600-${who}-open.png`)});
  if(who==='marcus'){await setShut(p,true);await p.screenshot({path:path.join(OUT,`base-1600-${who}-closed.png`)});await setShut(p,false);}
  for(const opt of OPTS){
   const m=await inject(p,opt,who); report[`${opt}-${who}`]=m;
   await p.waitForTimeout(150);
   await p.screenshot({path:path.join(OUT,`1600-${opt}-${who}-open.png`)});
   await setShut(p,true); await p.waitForTimeout(150);
   await p.screenshot({path:path.join(OUT,`1600-${opt}-${who}-closed.png`)});
   await setShut(p,false);
   await clean(p);
  }
 }
 /* ---- Snow, the light lighting, Marcus only: does it still read on a pale ground ---- */
 await load(p,DATA.marcus.index); await setShut(p,false);
 await p.evaluate(()=>{const b=[...document.querySelectorAll('#themes button')].find(x=>/snow/i.test(x.getAttribute('aria-label')||x.textContent)); if(b)b.click();});
 await p.waitForTimeout(900);
 await p.evaluate(()=>{const s=BANDS.map(b=>seatCol(b)); window.__pal={seat:s,vit:s[2],aw:s[5],wi:s[4],cq0:'#7DB2CF',cq1:'#2F6E92',gnd:'#D9D2CC',halo:'#2F6E92',fork:s[0],blend:'multiply'};});
 for(const who of ['marcus','tomas']){
  await load(p,DATA[who].index);
  for(const opt of OPTS){await inject(p,opt,who); await p.waitForTimeout(150); await p.screenshot({path:path.join(OUT,`1600-${opt}-${who}-snow.png`)}); await clean(p);}
 }
 await p.evaluate(()=>{window.__pal=null;});
 /* ---- 390 x 844: the column stacks under the picture ---- */
 await boot(p,390,844);
 for(const who of ['marcus','tomas','diane','you']){
  await load(p,DATA[who].index);
  const sc=async(name)=>{await p.evaluate(()=>{const lp=document.getElementById('lpanel');lp.scrollIntoView({block:'start'});window.scrollBy(0,-8);});
   await p.waitForTimeout(name.startsWith('base')?1800:250); await p.screenshot({path:path.join(OUT,name)});};
  if(who==='marcus'||who==='tomas')await sc(`base-390-${who}.png`);
  for(const opt of OPTS){
   if(who==='diane'&&false)continue;
   const m=await inject(p,opt,who); report[`m390-${opt}-${who}`]=m;
   await p.waitForTimeout(150); await sc(`390-${opt}-${who}.png`); await clean(p);
  }
 }
 fs.writeFileSync(path.join(__dirname,'measure.json'),JSON.stringify(report,null,1));
 console.log(JSON.stringify(report));
 console.log(errs.length?'JS ERRORS '+errs.join(' | '):'no page errors');
 await b.close();
})();
