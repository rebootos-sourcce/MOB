/* Intake page render and count harness. Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node tools/intake-shots.js OUTDIR [prefix]
   Set SRC to measure another build than source.html.
   Writes the stranger (a fresh profile with nothing entered) and the loaded
   case (Marcus, loadP(3)) at 1600x1000 and 390x844, a scrolled view, each of
   the three views, the birth moment opened, a law opened, and the Avatar's own
   copy of the page, then prints the first screen counted by script:
     controls    every interactive element inside the viewport, in the page
                 itself and in the shell around it
     decisions   the same, with a role=group counted once, so three views are
                 one decision and not three
     groups      visible blocks a person has to parse as one thing
     firstLaw    where the first law row sits, in pixels from the top of the
                 viewport, so a number past the viewport height is a scroll
     under44     controls under the 44 by 44 floor, a checkbox measured by its
                 label as the design gate does */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=process.argv[2]||'shots', PRE=process.argv[3]||'';
const SRC=process.env.SRC?path.resolve(process.env.SRC):path.resolve('source.html');
/* RAIL=open leaves the left column open, which is how the page is first met and
   how the lead's baseline pictures were taken: the centre is about 880 wide.
   RAIL=shut folds it and the centre is about 1160. Phones have no rail. */
const RAIL=process.env.RAIL||'open';
const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};
const COUNT=()=>{
 const vw=innerWidth, vh=innerHeight, host=document.getElementById('iqbody');
 const vis=el=>{const r=el.getBoundingClientRect(), cs=getComputedStyle(el);
  if(cs.visibility==='hidden'||cs.display==='none'||!r.width||!r.height)return false;
  return r.bottom>0&&r.top<vh-4&&r.right>0&&r.left<vw;};
 const SEL='button,a[href],input:not([type=hidden]),select,textarea,[role=button],[tabindex]:not([tabindex="-1"]),summary';
 const inHost=[...host.querySelectorAll(SEL)].filter(vis);
 const all=[...document.querySelectorAll(SEL)].filter(vis);
 const decide=list=>{const gs=new Set(); let n=0;
  list.forEach(e=>{const g=e.closest('[role=group]'); if(g)gs.add(g); else n++;}); return n+gs.size;};
 const G='#iqbody section,#iqbody [role=group],#iqbody fieldset,#iqbody details,#iqbody .iqa-hero,#iqbody .iq-who,#iqbody .iq-sealed,#iqbody .iq-acc,#iqbody .iqa-stage,#iqbody .iqa-focus,#iqbody .iqa-strip,#iqbody .iqa-sc,#iqbody .iqa-map,#iqbody .iqa-pn,#iqbody .iqa-hd';
 const groups=[...document.querySelectorAll(G)].filter(vis);
 const small=inHost.map(e=>{const lab=e.closest('label'); const b=(lab&&e.type==='checkbox')?lab:e; return {e,r:b.getBoundingClientRect()};})
  .filter(x=>(x.r.width<43.5||x.r.height<43.5)&&!x.e.closest('svg'))
  .map(x=>(x.e.id||String(x.e.className)||x.e.tagName)+':'+Math.round(x.r.width)+'x'+Math.round(x.r.height));
 const law=[...host.querySelectorAll('[data-law]')].find(e=>e.getClientRects().length);
 return {pageControls:inHost.length, shellControls:all.length-inHost.length, allControls:all.length,
  pageDecisions:decide(inHost), groups:groups.length,
  firstLaw:law?Math.round(law.getBoundingClientRect().top):null, viewport:vh,
  under44:small.length, under44list:small.slice(0,8),
  hostHeight:Math.round(host.scrollHeight), scrollW:document.documentElement.scrollWidth};};
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const res={};
 for(const [W,H] of [[1600,1000],[390,844]]){
  const p=await b.newPage({viewport:{width:W,height:H}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
  await p.goto('file://'+SRC+'?dev=1');
  await booted(p); await p.waitForTimeout(400);
  const open=async(setup)=>{await p.evaluate(setup+';IQ_VIEW="list";IQ_OPEN=null;if(typeof IQ_SEAT!=="undefined")IQ_SEAT=null;if(typeof IQ_WHO!=="undefined")IQ_WHO=false;setTab(13);render();'+(W>=1200?';document.body.classList.toggle("lshut",'+(RAIL!=='open')+')':''));await p.waitForTimeout(900);};
  const scroll=async y=>{await p.evaluate(y=>{let e=document.getElementById('iqbody');while(e&&e!==document.body){if(e.scrollHeight>e.clientHeight+4&&/auto|scroll/.test(getComputedStyle(e).overflowY)){e.scrollTop=y;break;}e=e.parentElement;}},y);await p.waitForTimeout(500);};
  const shot=async n=>{await p.screenshot({path:`${OUT}/${PRE}${n}-${W}.png`}); };
  /* the stranger: a fresh profile with nothing entered */
  await open('void 0');
  res['stranger-'+W]=await p.evaluate(COUNT); await shot('stranger');
  await scroll(520); await shot('stranger-scrolled'); await scroll(0);
  /* the stranger, one law open: what the first press shows */
  await p.evaluate('var n=document.querySelector(\'[data-law]\');var q=document.querySelector(\'.iqa-lawr[data-next="1"]\');(q||document.querySelector(\'[data-law]\')).click()');
  await p.waitForTimeout(600); await shot('stranger-law-open'); await scroll(0);
  /* the stranger, the birth moment opened */
  await open('void 0');
  await p.evaluate('var w=document.getElementById("iqwho");if(w)w.click()'); await p.waitForTimeout(600);
  await shot('stranger-who-open');
  /* the loaded case */
  await open('loadP(3)');
  res['loaded-'+W]=await p.evaluate(COUNT); await shot('loaded');
  await scroll(520); await shot('loaded-scrolled'); await scroll(0);
  /* a law open in the list */
  await p.evaluate('IQ_OPEN=iqBodyOrder()[1];renderIntake()'); await p.waitForTimeout(500); await shot('view-list-law-open');
  for(const v of ['wheel','one']){
   await p.evaluate(v=>{IQ_VIEW=v;IQ_OPEN=null;renderIntake();},v); await p.waitForTimeout(700);
   res[v+'-'+W]=await p.evaluate(COUNT); await shot('view-'+v);
   await scroll(520); await shot('view-'+v+'-scrolled'); await scroll(0);}
  /* the Avatar's own copy of the page, in its right menu */
  await p.evaluate('IQ_VIEW="list";IQ_OPEN=null;loadP(3);setTab(5);render()'); await p.waitForTimeout(700);
  const f=await p.$('[data-avface="iq"]'); if(f){await f.click(); await p.waitForTimeout(700);
   await p.evaluate('document.getElementById("iqbody").scrollIntoView()'); await p.waitForTimeout(300); await shot('avatar-slot');}
  if(errs.length)res['errors-'+W]=errs;
  await p.close();}
 console.log(JSON.stringify(res,null,1));
 await b.close();
})();
