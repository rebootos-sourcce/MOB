/* ============================================================
   WHERE THE LOAD SITS, AND HOW MUCH OF IT IS ALREADY FOLDABLE.

   The ninety day run graded cognitive load off one number per surface: how many
   interactive elements sit above the fold. That number says the load is too
   high and says nothing about what a change would remove, so a proposal to
   reduce it would have been a wish.

   This probe reads source.html in a real Chromium, touches nothing, and for
   every surface at both widths it sorts the above the fold controls into the
   regions of the shell: the tab bar, the sub bar, the top, the left rail, the
   stage, the right rail. Inside the two rails it separates the section headers,
   which a fold keeps, from everything inside a section body, which a fold
   removes.

   That gives the modelled change a measured consequence rather than a target.
   The change is: the rails ship with their sections folded, one open a rail,
   and the fold state persists. The mechanism is already in the product, every
   .lsec already has a header that folds it, so the change is a default and a
   stored preference and not a rebuild.

     NODE_PATH=/opt/node22/lib/node_modules node sim/fold.js
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
 const all=[...document.querySelectorAll(SEL)].filter(vis).filter(inView);
 const cols=[...document.querySelectorAll('.mid > .col')];
 const left=cols[0]||null, right=cols[cols.length-1]||null;
 const region=el=>{
  if(el.closest('#tabbar'))return 'tabbar';
  if(el.closest('#subbar'))return 'subbar';
  if(el.closest('#stage'))return 'stage';
  if(left&&left.contains(el))return 'leftrail';
  if(right&&right!==left&&right.contains(el))return 'rightrail';
  if(el.closest('.top'))return 'top';
  return 'elsewhere';};
 const out={total:all.length, by:{}, rail:{}, sections:{}};
 ['tabbar','subbar','stage','leftrail','rightrail','top','elsewhere']
  .forEach(k=>out.by[k]=0);
 ['leftrail','rightrail'].forEach(k=>out.rail[k]={head:0,body:0,loose:0,open:[],shut:[]});
 all.forEach(el=>{
  const r=region(el); out.by[r]++;
  if(r==='leftrail'||r==='rightrail'){
   const sec=el.closest('.lsec');
   if(!sec){out.rail[r].loose++; return;}
   const nm=(sec.querySelector('.lsec-hd span')||{}).textContent||'section';
   if(el.classList.contains('lsec-hd')||el.closest('.lsec-hd')===el
    ||(el.closest('.lsec-hd')&&el.tagName==='BUTTON'&&el.classList.contains('lsec-hd')))
    out.rail[r].head++;
   else if(el.closest('.lsec-hd'))out.rail[r].head++;
   else {out.rail[r].body++;}
   const list=sec.classList.contains('open')?out.rail[r].open:out.rail[r].shut;
   if(list.indexOf(nm)<0)list.push(nm);}});
 /* how many controls the widest open section of each rail is carrying, so the
    fold that keeps one section open can be costed rather than guessed */
 ['leftrail','rightrail'].forEach(k=>{
  const host=k==='leftrail'?left:right;
  const per=[];
  if(host)[...host.querySelectorAll('.lsec')].forEach(sec=>{
   const nm=(sec.querySelector('.lsec-hd span')||{}).textContent||'section';
   const n=[...sec.querySelectorAll(SEL)].filter(vis).filter(inView)
    .filter(e=>!e.closest('.lsec-hd')).length;
   per.push({nm:nm, open:sec.classList.contains('open'), controls:n});});
  out.sections[k]=per;});
 return out;};

(async()=>{
 const out={stamp:{src:md5('source.html'),
  commit:cp.execSync('git -C '+JSON.stringify(REPO)+' rev-parse --short HEAD').toString().trim(),
  dirty:cp.execSync('git -C '+JSON.stringify(REPO)+' status --porcelain').toString().trim().length>0,
  when:new Date().toISOString(), chromium:'1194'}, widths:{}};
 const b=await chromium.launch({executablePath:CHROME});
 for(const [w,h] of [[1600,1000],[390,844]]){
  const page=await b.newPage({viewport:{width:w,height:h}});
  await page.goto(SRC); await page.waitForTimeout(3200);
  const tabs=await page.evaluate(()=>TABDEF.map(t=>({k:t.k,nm:t.nm})));
  const surf={};
  for(const t of tabs){
   await page.evaluate(k=>{setTab(k); if(typeof render==='function')render();},t.k);
   await page.waitForTimeout(420);
   surf[t.nm]=await page.evaluate(PROBE);}
  out.widths[w]=surf;
  await page.close();}
 await b.close();
 out.stamp.srcAfter=md5('source.html');
 out.stamp.moved=out.stamp.srcAfter!==out.stamp.src;
 fs.writeFileSync(path.join(__dirname,'folded.json'),JSON.stringify(out,null,1));
 const k=Object.keys(out.widths[1600]);
 console.log('sim/folded.json written.');
 k.forEach(s=>{const d=out.widths[1600][s];
  console.log('  '+s.padEnd(11)+' above '+String(d.total).padStart(3)
   +'  stage '+String(d.by.stage).padStart(3)
   +'  left '+String(d.by.leftrail).padStart(3)+' ('+d.rail.leftrail.body+' in bodies)'
   +'  right '+String(d.by.rightrail).padStart(3)+' ('+d.rail.rightrail.body+' in bodies)'
   +'  bar '+d.by.tabbar+'  sub '+d.by.subbar+'  top '+d.by.top);});
 if(out.stamp.moved)console.log('  THE BUILD MOVED DURING THE PROBE.');
})();
