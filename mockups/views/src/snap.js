/* node mockups/views/src/snap.js  -> snap.json
   Captures the real shell (CSS, DOM per tab, the right rail per person, and the shipped
   centre stage for the before view) from source.html, so index.html carries the app's own look. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const SRC=path.resolve(__dirname,'../../../source.html');
const TABS={summary:'SUMMARY',analytics:'ANALYTICS',practitioner:'PRACTITIONER'};
const HOST={summary:'sumbody',analytics:'ana',practitioner:'prac'};
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 await p.goto('file://'+SRC+'?dev=1');
 await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000}).catch(()=>{});
 await p.waitForTimeout(400);
 const out={tabs:{},rail:{},before:{summary:{},analytics:{},practitioner:null},psel:{},css:''};
 const load=(tab,who)=>p.evaluate(([tab,who,tn])=>{
   loadP(PEOPLE.findIndex(x=>x.nm===who));
   var pe=PEOPLE[S.who]; if(CURP&&CURP.story&&!CURP.story.entries.length&&pe&&pe.says){CURP.story.entries.push({t:Date.now()-86400000,text:pe.says});}
   if(tab==='practitioner'){CURP.ui=CURP.ui||{};CURP.ui.practitioner=true;pracPaint();}
   setTab(TAB[tn]); render(); return document.getElementById('psel').value;},[tab,who,TABS[tab]]);
 const grab=(sel)=>p.evaluate((sel)=>{
   const root=document.querySelector(sel);
   const mark=[];
   root.querySelectorAll('*').forEach(e=>{if(e.outerHTML.length>2500){const r=e.getBoundingClientRect();const cs=getComputedStyle(e);
     if((r.width===0||r.height===0||cs.display==='none')&&!e.closest('[data-prune]')){e.setAttribute('data-prune','1');mark.push(e);}}});
   const c=root.cloneNode(true);
   c.querySelectorAll('[data-prune]').forEach(e=>{e.innerHTML='';e.removeAttribute('data-prune');});
   mark.forEach(e=>e.removeAttribute('data-prune'));
   c.querySelectorAll('script,canvas').forEach(e=>e.remove());
   return c.outerHTML;},sel);
 for(const tab of Object.keys(TABS)){
  const who=tab==='practitioner'?'Sofia':'Derek';
  await load(tab,who); await p.waitForTimeout(700);
  const cls=await p.evaluate(()=>document.body.className);
  /* the shipped centre stage, for the before view */
  if(tab!=='practitioner'){
   for(const w of ['Derek','Wren','You']){await load(tab,w);await p.waitForTimeout(500);out.before[tab][w]=await p.evaluate(h=>document.getElementById(h).innerHTML,HOST[tab]);}
   await load(tab,'Derek'); await p.waitForTimeout(500);
  } else out.before.practitioner=await p.evaluate(h=>document.getElementById(h).innerHTML,HOST[tab]);
  await p.evaluate(h=>{document.getElementById(h).innerHTML='';},HOST[tab]);
  const app=await grab('.app');
  out.tabs[tab]={cls,app};
 }
 for(const w of ['Derek','Wren','You']){
  out.psel[w]=await load('summary',w); await p.waitForTimeout(500);
  out.rail[w]=await grab('#rcol');
 }
 out.psel.Sofia=await load('practitioner','Sofia');
 out.css=await p.evaluate(()=>[...document.querySelectorAll('style')].map(s=>s.textContent).filter(t=>!/^@font-face\{font-family:'Inter'/.test(t)).join('\n'));
 fs.writeFileSync(path.join(__dirname,'snap.json'),JSON.stringify(out));
 console.log(Object.keys(out.tabs).map(k=>k+' '+out.tabs[k].app.length).join(', '),'rail',out.rail.Derek.length,'css',out.css.length,'before',JSON.stringify(out.before).length);
 await b.close();
})();
