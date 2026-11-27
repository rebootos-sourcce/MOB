/* shots.js. Opens all five pages in a real Chromium at 1600 by 1000 and 390
   by 844, writes the pictures into shots/, and checks three things rather
   than trusting them:

   1. NOTHING IS FETCHED. Any request that is not the page itself fails.
   2. EVERY COLOUR IS A TOKEN. Every computed color, background and border
      on the page, alpha set aside, must be one of the tokens, and every
      name the canvas asked for through C() is listed. A colour outside the
      brand fails the run by name.
   3. THE TYPED TOKENS ARE THE BUILD'S. The structural values typed into
      kit.js are compared with the live build's own computed :root in Dark,
      so a token that drifted in the product fails here too.

   Run from the repo root, with NODE_PATH at a playwright install:
     node proto/compass-redesign/shots.js */
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const D=__dirname,OUT=path.join(D,'shots');fs.mkdirSync(OUT,{recursive:true});
const PAGES=['index.html','a-laws.html','b-mirror.html','c-shell.html','d-rings.html'];
let fail=0;const bad=m=>{fail++;console.log('  FAIL '+m);};
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 /* 3. the build's own tokens, read in Dark */
 {const p=await b.newPage();await p.goto('file://'+path.resolve('source.html'));
  await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000}).catch(()=>{});
  const live=await p.evaluate(()=>{const cs=getComputedStyle(document.documentElement);const o={};
   ['--bg','--panel','--panel-2','--sunk','--ink','--mid','--dim','--accent'].forEach(k=>o[k]=cs.getPropertyValue(k).trim().toUpperCase());
   o.stage=getComputedStyle(document.getElementById('cone')).backgroundColor;return o;});
  const want={'--bg':'#0C0D12','--panel':'#1A1D26','--panel-2':'#252833','--sunk':'#090A0E','--ink':'#EFEDE8','--mid':'#B4B0A8','--dim':'#94908A','--accent':'#7EB8D4'};
  Object.keys(want).forEach(k=>{if(live[k]!==want[k])bad('token '+k+' is '+live[k]+' in the build, '+want[k]+' in kit.js');});
  if(live.stage!=='rgb(16, 16, 16)')bad('the Compass stage is '+live.stage+' in the build, not #101010');
  console.log('build tokens checked against kit.js, Dark:',JSON.stringify(live));await p.close();}
 for(const [W,H] of [[1600,1000],[390,844]]){
  for(const f of PAGES){
   const p=await b.newPage({viewport:{width:W,height:H}});const errs=[],reqs=[];
   p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
   p.on('request',r=>{if(!r.url().startsWith('file://')&&!r.url().startsWith('data:'))reqs.push(r.url());});
   await p.goto('file://'+path.join(D,f));await p.waitForTimeout(1400);
   const nm=f.replace('.html','');
   await p.screenshot({path:path.join(OUT,W+'-'+nm+'.png'),fullPage:W<600});
   /* the same page after 15,000 patterns, settled */
   await p.evaluate(()=>stSet(ST.p,3));await p.waitForTimeout(1600);
   await p.screenshot({path:path.join(OUT,W+'-'+nm+'-15000.png'),fullPage:W<600});
   /* and James, the lowest of the four, now and after 15,000 */
   if(f!=='index.html'||W===1600){await p.evaluate(()=>stSet(3,0));await p.waitForTimeout(1300);
    await p.screenshot({path:path.join(OUT,W+'-'+nm+'-james.png'),fullPage:W<600});}
   const chk=await p.evaluate(()=>{
    const toks=new Set(Object.values(TOK).map(h=>hx(h).join(',')));['255,255,255','11,20,24'].forEach(x=>toks.add(x));
    const off=[];document.querySelectorAll('*').forEach(el=>{const cs=getComputedStyle(el);
     ['color','backgroundColor','borderTopColor','borderLeftColor','outlineColor'].forEach(pr=>{const v=cs[pr];const m=v&&v.match(/rgba?\(([^)]+)\)/);if(!m)return;
      const c=m[1].split(',').map(s=>parseFloat(s));if(c.length>3&&c[3]===0)return;const k=c.slice(0,3).map(Math.round).join(',');
      if(!toks.has(k))off.push(el.tagName+'.'+el.className+' '+pr+' '+v);});});
    const hscroll=document.documentElement.scrollWidth>innerWidth+1;
    const small=[...document.querySelectorAll('body *')].filter(el=>el.childNodes.length&&[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&parseFloat(getComputedStyle(el).fontSize)<11).map(el=>el.tagName+' '+el.textContent.trim().slice(0,30));
    const taps=[...document.querySelectorAll('button,a')].filter(el=>{const r=el.getBoundingClientRect();return r.width&&r.height<43.5;}).map(el=>el.textContent.trim().slice(0,30));
    return {used:Object.keys(USED).sort(),off:[...new Set(off)].slice(0,12),hscroll,small:small.slice(0,6),taps:taps.slice(0,6)};});
   if(errs.length)bad(f+' at '+W+': '+errs.join(' | '));
   if(reqs.length)bad(f+' at '+W+' fetched '+reqs.join(', '));
   if(chk.off.length)bad(f+' at '+W+' draws colours that are not tokens: '+chk.off.join(' ; '));
   if(chk.hscroll)bad(f+' at '+W+' scrolls sideways');
   if(chk.small.length)bad(f+' at '+W+' sets text under 11px: '+chk.small.join(' ; '));
   if(chk.taps.length)bad(f+' at '+W+' has targets under 44px: '+chk.taps.join(' ; '));
   console.log(W+' '+f+'  canvas tokens: '+chk.used.join(' '));
   await p.close();}}
 await b.close();
 console.log(fail?fail+' failed':'all checks passed');process.exit(fail?1:0);})();
