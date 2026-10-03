/* ============================================================
   MEASURE. What is true of the shipped surface, read off the shipped surface.

   Drives source.html in a real Chromium at 1600x1000 and 390x844 and writes
   sim/measured.json. Nothing in this file asserts a number: every number in it
   comes back off the page. harness.js and build.js both refuse to run without
   the file, so no figure on the report page is typed by hand.

     NODE_PATH=/opt/node22/lib/node_modules node sim/measure.js
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs'), cp=require('child_process');
const ROOT=process.env.SIM_ROOT?path.resolve(process.env.SIM_ROOT):path.resolve(__dirname,'..');/* SIM_ROOT pins the build. Two seats are live in atuned_src and the working
   copy of source.html and engine.js moves under this directory while it runs. A
   measurement whose subject changed halfway is not a measurement, so every
   script here reads the build out of one place and the md5 of that place is
   stamped into every file it writes. */
const SRC='file://'+path.join(ROOT,'source.html');
const REPO=path.resolve(__dirname,'..');/* the repository, for git. ROOT is the build under measurement and may be a pin. */
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const md5=f=>cp.execSync('md5sum '+JSON.stringify(path.join(ROOT,f))).toString().split(' ')[0];

const PROBE=()=>{
 const vis=el=>{const r=el.getBoundingClientRect(), s=getComputedStyle(el);
  return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity>0.02;};
 const inView=el=>{const r=el.getBoundingClientRect();
  return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;};
 const SEL='button,a[href],input,select,textarea,[role=button],[tabindex]:not([tabindex="-1"])';
 const all=[...document.querySelectorAll(SEL)].filter(vis);
 const above=all.filter(inView);
 let small=0; const tiny=[];
 all.forEach(e=>{const r=e.getBoundingClientRect();
  if(r.width<44||r.height<44){small++;
   if(tiny.length<8)tiny.push(((e.textContent||e.id||e.tagName)+'').trim().slice(0,20)
    +' '+Math.round(r.width)+'x'+Math.round(r.height));}});
 /* the deepest scrolling container on this surface, which is what a thumb pays */
 let deep=0;
 document.querySelectorAll('*').forEach(e=>{
  if(e.clientHeight>200&&e.scrollHeight>e.clientHeight+8&&e.scrollHeight>deep)deep=e.scrollHeight;});
 return {choices:all.length, above:above.length, small:small, tiny:tiny,
  deep:deep, text:(document.body.innerText||'').length};};

(async()=>{
 const out={stamp:{src:md5('source.html'), engine:md5('engine.js'),
  commit:cp.execSync('git -C '+JSON.stringify(REPO)+' rev-parse --short HEAD').toString().trim(),
  dirty:cp.execSync('git -C '+JSON.stringify(REPO)+' status --porcelain').toString().trim().length>0,
  when:new Date().toISOString(), chromium:'1194'}, widths:{}};
 const b=await chromium.launch({executablePath:CHROME});
 for(const [w,h] of [[1600,1000],[390,844]]){
  const page=await b.newPage({viewport:{width:w,height:h}});
  const errs=[], reqs=[];
  page.on('pageerror',e=>errs.push(String(e.message)));
  page.on('request',r=>reqs.push(r.url().replace(/^.*\//,'')));
  const t0=Date.now();
  await page.goto(SRC);
  let firstWord=null;
  for(let i=0;i<150;i++){
   if(await page.evaluate(()=>(document.body.innerText||'').trim().length>0)){
    firstWord=Date.now()-t0; break;}
   await page.waitForTimeout(50);}
  await page.waitForTimeout(3000);
  const land=await page.evaluate(()=>{
   const r=compute();
   const bar=document.getElementById('tabbar'), br=bar.getBoundingClientRect();
   const kids=[...bar.children];
   const full=kids.filter(e=>{const q=e.getBoundingClientRect();
    return q.left>=br.left-1&&q.right<=br.right+1;});
   const off=kids.filter(e=>e.getBoundingClientRect().left>br.right-1);
   /* the landing surface's own primary offers, on a profile with nothing in it */
   const doors=[...document.querySelectorAll('button')]
    .filter(e=>{const q=e.getBoundingClientRect(); const s=getComputedStyle(e);
     return q.top<innerHeight&&q.height>=30&&s.display!=='none'&&e.textContent.trim().length>3;})
    .map(e=>e.textContent.trim().replace(/\s+/g,' ').slice(0,38));
   return {tab:S.tab, tabName:(TABDEF.filter(t=>t.k===S.tab)[0]||{}).nm,
    tabs:TABDEF.map(t=>t.nm), tabCount:TABDEF.length,
    stripVisible:full.length, stripOff:off.map(e=>e.textContent.trim()),
    stripScrolls:bar.scrollWidth>bar.clientWidth+4,
    unread:r.unread, cq:+r.CQ.toFixed(2), loaded:r.loaded.length,
    doors:doors.slice(0,14),
    /* anything that names a price or sells a tier, on any surface a new
       arrival can reach without an account */
    money:(document.body.innerText||'').match(/[£$€]\s?\d|per month|a month|upgrade|subscri/gi)||[],
    refer:[...document.querySelectorAll('button,a')].map(e=>e.textContent.trim())
     .filter(t=>/refer|invite|share|send to|practitioner/i.test(t))};});
  const surfaces={};
  const tabs=await page.evaluate(()=>TABDEF.map(t=>({k:t.k,nm:t.nm})));
  for(const t of tabs){
   await page.evaluate(k=>{setTab(k); if(typeof render==='function')render();},t.k);
   await page.waitForTimeout(420);
   surfaces[t.nm]=await page.evaluate(PROBE);}
  out.widths[w]={firstWordMs:firstWord, errors:errs, requests:[...new Set(reqs)],
   land:land, surfaces:surfaces};
  await page.close();}

 /* THE LOOP, DRIVEN. Two things the harness cannot reach from node, because the
    release lives in ui/release.js and is not in the engine contract. */
 const page=await b.newPage({viewport:{width:1600,height:1000}});
 await page.goto(SRC); await page.waitForTimeout(3200);
 /* THE APP'S OWN BLANK STATE, read off the app. The engine module seeds an
    unmeasured law at LAW_DEFAULT and the app seeds the custom profile's at
    LAWSET.You, and the two are not the same number. The harness has to start
    where the app starts, so the seed is read here rather than typed there. */
 out.blank=await page.evaluate(()=>{
  loadP(0);
  const r=compute();
  const vals=[...new Set(SINAMES.map(l=>S.law[l]))];
  return {lawSeed:vals.length===1?vals[0]:null, lawValues:vals,
   cq:+r.CQ.toFixed(3), unread:r.unread, loaded:r.loaded.length,
   doms:S.doms.slice(), arcs:S.arcs.slice(), roots:S.roots.slice(),
   engineDefault:null};});
 out.loop=await page.evaluate(()=>{
  const o={};
  /* one. a release started on a reference case */
  loadP(4);
  const cq0=compute().CQ;
  relPick(compute().loaded.slice().sort((a,b)=>b.sq-a.sq).slice(0,3).map(n=>n.i));
  const r=relCoolDown();
  o.reference={who:(PEOPLE[S.who]||{}).nm, refused:(r===false),
   cqBefore:+cq0.toFixed(2), cqAfter:+compute().CQ.toFixed(2), phase:RUN.phase};
  /* two. the person's own field, filled the only way the product allows, then
     released, so the harness's lifted arithmetic can be checked against the
     shipped one on the same inputs */
  loadP(0);
  /* SIX COMMITS, NOT TWO, and the reason is a finding on its own: two commits
     of this bank load nothing above the line, so a two commit case gives the
     harness no release to check its lifted arithmetic against. The six are the
     first six lines of sim/stories.js in order. */
  const texts=['I am terrified the round does not close and I am the only one who knows.',
   'I am exhausted and I cannot stop. Those two things are the same sentence now.',
   'I snapped at my cofounder in front of the team and I have not apologised.',
   'I have not slept properly in eleven days and I am still training twice a day.',
   'I am angry all the time and there is nothing to be angry at.',
   'I am ashamed of how I spoke to the junior and I will not bring it up tomorrow.'];
  const steps=[];
  texts.forEach(t=>{applyStory(t);verpApply(t);leanApply(t);
   CURP.story=CURP.story||{entries:[]};
   CURP.story.entries.push({t:new Date().toISOString(),text:t,imprints:1,bands:{}});
   pSave();pSnap();
   const c=compute(); steps.push({cq:+c.CQ.toFixed(3), loaded:c.loaded.length});});
  const pre=compute();
  const pick=pre.loaded.slice().sort((a,b)=>b.sq-a.sq).slice(0,3);
  const before=pick.map(n=>({i:n.i,k:n.k,sq:+n.sq.toFixed(4),cf:n.cf}));
  relPick(pick.map(n=>n.i));
  const cqPre=pre.CQ, uniq=(CURP.meter.unique||[]).length;
  relCoolDown();
  o.own={stories:steps, refused:false,
   cqBefore:+cqPre.toFixed(3), cqAfter:+compute().CQ.toFixed(3),
   picked:before, freed:RUN.freed, planLines:(RUN.plan||[]).length,
   uniqueBefore:uniq, uniqueAfter:(CURP.meter.unique||[]).length,
   allowanceLeft:relLeft(),
   chargeAfter:Object.keys(S.charge).reduce((a,k)=>(a[k]=+(+S.charge[k]).toFixed(4),a),{}),
   replaceAfter:Object.keys(S.replace).reduce((a,k)=>(a[k]=+(+S.replace[k]).toFixed(4),a),{})};
  /* three. what happens to a release when the allowance is gone. the panel
     prints the allowance, and whether anything enforces it is a different
     question, so it is asked here rather than assumed either way. */
  loadP(0);
  for(let i=0;i<40;i++){
   const t=['I am terrified the round does not close and I am the only one who knows.',
    'I am exhausted and I cannot stop. Those two things are the same sentence now.',
    'I am angry all the time and there is nothing to be angry at.',
    'I am ashamed of how I spoke to the junior and I will not bring it up tomorrow.',
    'I have not slept properly in eleven days and I am still training twice a day.'][i%5];
   applyStory(t);verpApply(t);leanApply(t); pSave();
   const live=compute().loaded.slice().sort((a,b)=>b.sq-a.sq);
   if(live.length){relPick(live.slice(0,8).map(n=>n.i)); relCoolDown();}
   if(relLeft()<=0)break;}
  const spentAll=relLeft()<=0;
  const cqX=compute().CQ, uniqX=(CURP.meter.unique||[]).length;
  const live2=compute().loaded.slice().sort((a,b)=>b.sq-a.sq);
  let ranAnyway=null, quoted=null;
  if(live2.length){
   relPick(live2.slice(0,3).map(n=>n.i));
   quoted=(RUN.plan||[]).length+' patterns of the '+relLeft()+' you have left';
   const res=relCoolDown();
   ranAnyway=(res!==false);}
  o.exhausted={allowanceZero:spentAll, uniqueBefore:uniqX,
   uniqueAfter:(CURP.meter.unique||[]).length,
   ranAnyway:ranAnyway, quoted:quoted,
   cqBefore:+cqX.toFixed(2), cqAfter:+compute().CQ.toFixed(2),
   leftAfter:relLeft()};
  /* four. the release panel's own quoted cost, and the run length in seconds */
  o.speeds=(typeof RUN_SPEED_S!=='undefined')?RUN_SPEED_S:null;
  o.openingLines=(typeof OPENING!=='undefined')?OPENING.length:null;
  return o;});
 await page.close();
 await b.close();
 /* THE BUILD MOVES UNDER THE RUN WHEN OTHER SEATS ARE LIVE, so the md5 is
    taken again on the way out and both are recorded. A stamp that names one
    build for a measurement taken across two is the same defect as a count
    typed into a document. */
 out.stamp.srcAfter=md5('source.html');
 out.stamp.engineAfter=md5('engine.js');
 out.stamp.moved=(out.stamp.srcAfter!==out.stamp.src)||(out.stamp.engineAfter!==out.stamp.engine);
 fs.writeFileSync(path.join(__dirname,'measured.json'),JSON.stringify(out,null,1));
 console.log('sim/measured.json written.',
  'boot',out.widths[1600].firstWordMs+'ms /'+out.widths[390].firstWordMs+'ms',
  'errors',out.widths[1600].errors.length,
  'strip',out.widths[390].land.stripVisible+' of '+out.widths[390].land.tabCount,
  'refusal',out.loop.reference.refused,
  out.stamp.moved?'  THE BUILD MOVED DURING THE RUN':'');
})();
