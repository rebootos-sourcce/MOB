/* Summary page harness. node mockups/summary-layout/shoot.js LABEL [person]
   Writes LABEL-{blank,loaded}-{1600,390}.png, a full page twin of each, and
   LABEL-counts.json, from source.html. Run from the repo root with NODE_PATH
   at a playwright install. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const LABEL=process.argv[2]||'before', WHO=process.argv[3]||'Sofia', SLOTS=process.argv[4]==='slots';
const OUT=__dirname;
const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};
/* what is on the first screen, counted off the live document. A control is a
   visible button, link, input or tap target. A group is a visible element that
   carries its own heading or box. A text block is a visible leaf that holds
   its own sentence. Only what sits inside the first viewport counts. */
const COUNT=(H)=>{
 const host=document.getElementById('sumbody');
 const vis=e=>{const r=e.getBoundingClientRect(),cs=getComputedStyle(e);
  return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'&&r.top<H-1&&r.bottom>1;};
 const CTRL='button,a[href],input,select,textarea,summary,[role=button]';
 const inHost=[...host.querySelectorAll('*')];
 /* a control: a visible interactive element. A ring that is a span is not one. */
 const controls=inHost.filter(e=>e.matches(CTRL)&&vis(e));
 const all=[...document.querySelectorAll(CTRL)].filter(vis);
 /* a group: a visible box with its own edge or ground that holds text, and is
    not itself a control. Counted generically so every pass is measured alike. */
 const groups=inHost.filter(e=>{
  if(e.matches(CTRL)||e.closest('button')||e.closest('svg')||!vis(e))return false;
  const cs=getComputedStyle(e),r=e.getBoundingClientRect();
  const edge=parseFloat(cs.borderTopWidth)>0||parseFloat(cs.borderLeftWidth)>0;
  const bg=cs.backgroundColor,ground=bg&&bg!=='rgba(0, 0, 0, 0)'&&bg!=='transparent';
  return (edge||ground)&&r.width>=60&&r.height>=36&&(e.textContent||'').trim().length>=10;});
 /* a text block: a visible element that owns twelve or more characters of its
    own text, outside a control. */
 const blocks=inHost.filter(e=>{
  if(!vis(e)||e.closest('svg')||e.closest('button')||e.closest('summary'))return false;
  let own='';e.childNodes.forEach(n=>{if(n.nodeType===3)own+=n.textContent;});
  return own.trim().length>=12;});
 let words=0;blocks.forEach(e=>{let own='';e.childNodes.forEach(n=>{if(n.nodeType===3)own+=n.textContent;});words+=own.trim().split(/\s+/).length;});
 /* rings: every figure with a ring drawn on it */
 const rings=inHost.filter(e=>e.classList&&e.classList.contains('cr')&&vis(e));
 return {controls:controls.length,controlsWholeScreen:all.length,groups:groups.length,
  textBlocks:blocks.length,words:words,rings:rings.length,surfaceHeight:Math.round(host.getBoundingClientRect().height)};};

/* THE BALANCE OF EVERY ROW. A row is a parent whose box children stand side by
   side. Its balance is the shortest child over the tallest, so 1 is level and
   0.2 is a column with a hole under it. Measured over the whole surface and
   not only the first screen, because a hole is under the fold as often as in it. */
const BALANCE=()=>{
 const host=document.getElementById('sumbody'); const rows=[];
 host.querySelectorAll('*').forEach(par=>{
  if(par.closest('svg')||par.closest('button'))return;
  const kids=[...par.children].filter(k=>{const r=k.getBoundingClientRect();return r.width>=120&&r.height>=60&&getComputedStyle(k).display!=='none'});
  if(kids.length<2)return;
  const tops=kids.map(k=>Math.round(k.getBoundingClientRect().top));
  if(Math.max.apply(null,tops)-Math.min.apply(null,tops)>6)return;
  const lefts=kids.map(k=>Math.round(k.getBoundingClientRect().left));
  if(new Set(lefts).size<kids.length)return;
  const hs=kids.map(k=>k.getBoundingClientRect().height), rowH=Math.max.apply(null,hs);
  /* how much of the row each child actually fills: its last drawn thing down
     to the row's own height, so a stretched card with a hole under it counts */
  const fills=kids.map(k=>{let lb=k.getBoundingClientRect().top;
   k.querySelectorAll('*').forEach(d=>{const r=d.getBoundingClientRect();
    if(r.width>0&&r.height>0&&getComputedStyle(d).display!=='none')lb=Math.max(lb,r.bottom);});
   return (lb-k.getBoundingClientRect().top)/rowH;});
  rows.push({cls:(par.className||par.tagName).toString().slice(0,24),n:kids.length,
   min:Math.round(Math.min.apply(null,hs)),max:Math.round(rowH),
   level:+Math.min.apply(null,fills).toFixed(2)});});
 /* keep the outermost rows only: a row inside another row is its child's own business */
 const outer=rows.filter(r=>r.n<=4);
 const worst=outer.slice().sort((a,b)=>a.level-b.level)[0]||null;
 return {rows:outer.length,worst:worst,mean:outer.length?+(outer.reduce((a,r)=>a+r.level,0)/outer.length).toFixed(2):null};};
/* WHERE THINGS LAND, in pixels down the surface from its own top. The story's
   first paragraph is the evidence, the first output button is the first thing
   a person can do, and a first screen is H pixels tall. */
const WHERE=()=>{
 const host=document.getElementById('sumbody'), t0=host.getBoundingClientRect().top;
 const at=sel=>{const e=host.querySelector(sel);if(!e||!e.getBoundingClientRect().height)return null;return Math.round(e.getBoundingClientRect().top-t0);};
 return {storyTop:at('.s-story .s-p'),toldTop:at('.s-told'),actionTop:at('.s-oact'),
  nineTop:at('.sg-nine'),slotTop:at('.sg-day')};};
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const counts={};
 for(const [W,H] of [[1600,1000],[390,844]]){
  const p=await b.newPage({viewport:{width:W,height:H}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
  await p.goto('file://'+(process.env.SRC||path.resolve(OUT,'../../source.html'))+'?dev=1');
  await booted(p); await p.waitForTimeout(300);
  for(const mode of (process.env.MODES||'blank,loaded,owner').split(',')){
   await p.evaluate(([mode,who,slots])=>{
    if(mode==='blank'){ loadP(0); }
    else if(mode==='entered'){
     /* a name and a birth entered, nothing else: the page is still unread, and
        what was entered still reads */
     loadP(0); CURP.name='Lance';
     CURP.who=Object.assign({},CURP.who,{first:'Lance',middle:"O'Neill",last:'Powell',
      born:{date:'1985-06-14',time:'',place:'',zone:'',timeUnknown:true}}); }
    else if(mode==='owner'){
     /* the owner's own name, as he entered it: the one populated name panel the
        stub table can show. A reference case's sky and charge, his name. */
     loadP(PEOPLE.findIndex(function(x){return x.nm==='Derek';}));
     CURP.name='Lance'; CURP.who=Object.assign({},CURP.who,{first:'Lance',middle:"O'Neill",last:'Powell'});
     var pe2=PEOPLE[S.who]; if(CURP.story&&!CURP.story.entries.length&&pe2&&pe2.says){
      CURP.story.entries.push({t:Date.now()-86400000,text:pe2.says});} }
    else { loadP(PEOPLE.findIndex(function(x){return x.nm===who;}));
     var pe=PEOPLE[S.who]; if(CURP&&CURP.story&&!CURP.story.entries.length&&pe&&pe.says){
      CURP.story.entries.push({t:Date.now()-86400000,text:pe.says});} }
    setTab(TAB.SUMMARY); if(typeof render==='function')render();
   },[mode,WHO,SLOTS]);
   await p.waitForTimeout(900);
   if(SLOTS)await p.evaluate(()=>{var w=document.querySelector('.sum-wrap'); if(w)w.classList.add('sg-slots');});
   await p.evaluate(()=>window.scrollTo(0,0));
   counts[mode+'-'+W]=await p.evaluate(COUNT,H);
   counts[mode+'-'+W].balance=await p.evaluate(BALANCE);
   counts[mode+'-'+W].where=await p.evaluate(WHERE);
   counts[mode+'-'+W].fullHeight=await p.evaluate(()=>Math.max(document.getElementById('sum')?document.getElementById('sum').scrollHeight:0,document.body.scrollHeight));
   await p.screenshot({path:`${OUT}/${LABEL}-${mode}-${W}.png`});
   /* the page scrolls inside the stage, so a full length capture is the same
      page at a viewport as tall as the surface runs */
   const extra=await p.evaluate(()=>{const s=document.getElementById('sum');
    return Math.max(s?s.scrollHeight-s.clientHeight:0,document.body.scrollHeight-innerHeight,0);});
   if(extra>20){
    await p.setViewportSize({width:W,height:Math.min(14000,H+extra+40)});
    await p.waitForTimeout(500);
    /* a resize repaints the surface and the slot class goes with the old wrap */
    if(SLOTS)await p.evaluate(()=>{var w=document.querySelector('.sum-wrap'); if(w)w.classList.add('sg-slots');});
    await p.screenshot({path:`${OUT}/${LABEL}-${mode}-${W}-full.png`});
    await p.setViewportSize({width:W,height:H});
    await p.waitForTimeout(300);}
  }
  if(errs.length)console.log('JS ERRORS',W,errs.join(' | '));
  await p.close();
 }
 fs.writeFileSync(`${OUT}/${LABEL}-counts.json`,JSON.stringify(counts,null,1));
 console.log(JSON.stringify(counts));
 await b.close();
})();
