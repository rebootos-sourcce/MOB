/* First run walk. Not a gate: the evidence behind RESEARCH-firstrun.md.

   Drives a built source.html as a brand new person, one fresh browser
   context per walk so nothing is remembered between them, and prints what was
   on the screen at each step: controls a person could press inside the
   viewport, words inside the viewport, and where the four doors sit.

     ./atuned_src/BUILD.sh /tmp/fr.html
     NODE_PATH=/opt/node22/lib/node_modules node proto/firstrun/walk.js /tmp/fr.html OUTDIR

   A control is counted when it is a button, link, input, select, textarea
   or carries a tab stop, has a box, is not hidden or disabled, and overlaps
   the viewport. This is a different counter from the one that measured 71
   on 19 September, so the two numbers are not a trend. Re-measure with this
   one to compare against this one. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const SRC=path.resolve(process.argv[2]||'source.html'), OUT=process.argv[3]||'walk-out';
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const COUNT=`(()=>{const vh=innerHeight,vw=innerWidth;
 const els=[...document.querySelectorAll('a,button,input,select,textarea,[role=button],[role=switch],[tabindex]:not([tabindex="-1"]),summary')];
 const vis=els.filter(e=>{const r=e.getBoundingClientRect(),cs=getComputedStyle(e);
  return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'&&+cs.opacity>0.05
   &&r.bottom>0&&r.top<vh&&r.right>0&&r.left<vw&&!e.disabled;});
 let t='';const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while((n=w.nextNode())){const el=n.parentElement;if(!el)continue;const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
  if(r.bottom>0&&r.top<vh&&r.width>0&&cs.visibility!=='hidden'&&+cs.opacity>0.05)t+=' '+n.textContent;}
 const doors=[...document.querySelectorAll('[data-start]')].filter(e=>e.getBoundingClientRect().height>0)
  .map(e=>Math.round(e.getBoundingClientRect().top));
 return {controls:vis.length,words:(t.match(/[A-Za-z]{2,}/g)||[]).length,doorsTop:doors};})()`;
const STORY=['My sister called again and I felt the old tightness in my chest. The same guilt, the same shame. I said yes when I meant no and then I was angry at myself all night.',
 'At work I stayed quiet in the meeting again. I was afraid they would think I was stupid. I felt small and ashamed and I hated myself for it.'];
async function fresh(b,W,H){const ctx=await b.newContext({viewport:{width:W,height:H}});const p=await ctx.newPage();
 p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));const t0=Date.now();
 await p.goto('file://'+SRC);
 await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000}).catch(()=>{});
 p.booted=Date.now()-t0;await p.waitForTimeout(1200);return [ctx,p];}
const tab=(p,nm)=>p.locator('button.tabtop:has-text("'+nm+'")').first().click();
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:EXE});
 const row=async(p,who,step)=>{const c=await p.evaluate(COUNT);await p.screenshot({path:`${OUT}/${who}-${step}.png`});
  console.log(JSON.stringify({who,step,...c}));};
 for(const [W,H] of [[1600,1000],[390,844]]){
  const [ctx,p]=await fresh(b,W,H);console.log(JSON.stringify({W,bootedMs:p.booted}));
  await row(p,'landing',String(W));
  /* the first story, then the second: when does anything cross the line */
  for(let i=0;i<STORY.length;i++){
   await tab(p,'Story');await p.waitForTimeout(400);
   await p.locator('#sttext').fill(STORY[i]);await p.waitForTimeout(600);
   await row(p,'story'+(i+1)+'-typed',String(W));
   await p.locator('#stapply').click();await p.waitForTimeout(900);
   const imp=await p.evaluate(()=>document.getElementById('imp').innerText.replace(/\s+/g,' ').slice(0,140));
   console.log(JSON.stringify({W,story:i+1,after:imp}));
   await tab(p,'Field');await p.waitForTimeout(1200);await row(p,'story'+(i+1)+'-field',String(W));}
  console.log(JSON.stringify({W,errors:p.errs}));await ctx.close();}
 /* the nine sentences door on a phone: does the drill open where the person is */
 {const [ctx,p]=await fresh(b,390,844);
  await p.locator('[data-start="nine"]').scrollIntoViewIfNeeded();
  const door=await p.evaluate(()=>Math.round(document.querySelector('[data-start="nine"]').getBoundingClientRect().top));
  await p.locator('[data-start="nine"]').click();await p.waitForTimeout(1200);
  const dr=await p.evaluate(()=>{const e=document.getElementById('rdrill');return e?Math.round(e.getBoundingClientRect().top):null;});
  console.log(JSON.stringify({nineDoorTop:door,drillTopAfterTap:dr,viewport:844}));await ctx.close();}
 await b.close();
})();
