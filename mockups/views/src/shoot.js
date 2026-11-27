/* node mockups/views/src/shoot.js
   Loads the real source.html in Chromium, fills the centre stage with the
   views, and screenshots. Run from the repo root with NODE_PATH at playwright.
   usage: shoot.js OUTDIR "surface:person:width[:view]" ...   (surface: reading drives summary analytics practitioner; or before-summary etc.) */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../../..');
const SRC=path.join(ROOT,'source.html');
const css=fs.readFileSync(path.join(__dirname,'views.css'),'utf8');
const font=fs.readFileSync(path.join(__dirname,'onest.woff2')).toString('base64');
const fontCss=`@font-face{font-family:'Onest';font-style:normal;font-weight:300 700;src:url(data:font/woff2;base64,${font}) format('woff2')}:root,body{--sans:'Onest','Inter',system-ui,sans-serif;--num:'Onest','Inter',system-ui,sans-serif}`;
const js='const VWDATA='+fs.readFileSync(path.join(__dirname,'data.json'),'utf8')+';const VWBODY='+JSON.stringify(fs.readFileSync(path.join(__dirname,'body.txt'),'utf8').trim())+';\n'+fs.readFileSync(path.join(__dirname,'views.js'),'utf8').replace(/^const VW=/,'window.VW=');
const TAB={reading:'SUMMARY',drives:'SUMMARY',summary:'SUMMARY',analytics:'ANALYTICS',practitioner:'PRACTITIONER'};
const LIVE={Derek:'Derek',Wren:'Wren',You:'You',Sofia:'Sofia'};
(async()=>{
 const out=process.argv[2]; fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const spec of process.argv.slice(3)){
  const [surf,who,w,view,full]=spec.split(':'); const W=+w, H=W>600?1000:844;
  const before=surf.startsWith('before-'), s=before?surf.slice(7):surf;
  const p=await b.newPage({viewport:{width:W,height:H}});
  p.on('pageerror',e=>console.log('ERR',spec,e.message));
  await p.goto('file://'+SRC+'?dev=1');
  await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000}).catch(()=>{});
  await p.waitForTimeout(300);
  /* the profile loaded in the real app. The practitioner's own profile is Sofia. */
  const live=s==='practitioner'?'Sofia':who;
  await p.evaluate(([tab,live])=>{
   loadP(PEOPLE.findIndex(x=>x.nm===live));
   var pe=PEOPLE[S.who]; if(CURP&&CURP.story&&!CURP.story.entries.length&&pe&&pe.says){CURP.story.entries.push({t:Date.now()-86400000,text:pe.says});}
   if(tab==='PRACTITIONER'){CURP.ui=CURP.ui||{};CURP.ui.practitioner=true;pracPaint();}
   setTab(TAB[tab]); render();
  },[TAB[s],live]);
  await p.waitForTimeout(900);
  const mountNow=async()=>{
   if(before){await p.waitForTimeout(300);return;}
   await p.evaluate(([s,who,view])=>{VW.mount(s,who,{view});},[s,who,view||'list']);
   await p.waitForTimeout(1200);};
  if(!before){await p.addStyleTag({content:fontCss}); await p.addStyleTag({content:css}); await p.addScriptTag({content:js});}
  await mountNow();
  const name=`${before?'before':'after'}-${s}-${who==='You'?'stranger':who.toLowerCase()}-${W}${view?'-'+view:''}`;
  /* the stage scrolls inside itself: size a tall window to the surface, let the app settle, then fill it again */
  if(full==='full'){
   const extra=await p.evaluate(()=>{let m=0;['sum','ana','prac'].forEach(i=>{const e=document.getElementById(i);if(e&&e.offsetParent)m=Math.max(m,e.scrollHeight-e.clientHeight)});return Math.max(m,document.body.scrollHeight-innerHeight,0);});
   if(extra>20){await p.setViewportSize({width:W,height:Math.min(9000,H+extra+40)});await p.waitForTimeout(900);await mountNow();
    const e2=await p.evaluate(()=>{let m=0;['sum','ana','prac'].forEach(i=>{const e=document.getElementById(i);if(e&&e.offsetParent)m=Math.max(m,e.scrollHeight-e.clientHeight)});return m;});
    if(e2>20){await p.setViewportSize({width:W,height:Math.min(9000,H+extra+e2+40)});await p.waitForTimeout(900);await mountNow();}}
  }
  if(full==='full'){
   const bottom=await p.evaluate(()=>{const e=document.querySelector('.vw')||document.querySelector('.pr');return e?Math.round(e.getBoundingClientRect().bottom+window.scrollY)+24:innerHeight;});
   await p.screenshot({path:path.join(out,name+'-full.png'),clip:{x:0,y:0,width:W,height:Math.min(bottom,await p.evaluate(()=>innerHeight))}});
  } else await p.screenshot({path:path.join(out,name+'.png')});
  console.log(name);
  await p.close();
 }
 await b.close();
})();
