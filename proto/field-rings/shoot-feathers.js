/* THE SHOOTER for the feathers, after shoot.js: the same Chromium, every
   request logged, a request off the machine fails the run. It also measures,
   and fails the run on a measurement that is wrong:

     clearance    every feather at its longest possible length, and every hover
                  target, against every gate ring and pill. Under zero fails.
     identity     the twenty one lengths summed, against 2.1 times the distance
                  from the number to a hundred, on every figure drawn. Off by
                  more than a hundredth fails.
     hover        a real pointer at the middle of each of the twenty one
                  targets, and the probe must name that law. Checked first
                  against a known bad point, the centre of the number, which
                  must name nothing, so a probe that always answers cannot pass.

   Writes into shots/:
     feathers-1600.png                   the stage in the chrome
     feathers-stage@2x.png               the stage alone, twice the density
     feathers-reading-stage@2x.png       structure off, the reading alone
     feathers-centre@2x.png              the core and the feathers, cropped
     feathers-hover@2x.png               one feather under the pointer
     feathers-ladder-1600.png            the sheet, whole
     feathers-ladder-390.png             the sheet at a phone's width, whole
     feathers-proj-{0,5000,15000}.png    the projection panel at three stops
     feathers-requests.log

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/field-rings/shoot-feathers.js */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const DIR=__dirname, SHOTS=path.join(DIR,'shots');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
fs.mkdirSync(SHOTS,{recursive:true});
(async()=>{
 const br=await chromium.launch({executablePath:EXE});
 const log=[];let bad=0;
 const watch=(pg,nm)=>{
  pg.on('request',r=>{const u=r.url();if(!/^(file|data|blob):/.test(u)){log.push(nm+'  OFF MACHINE  '+u);bad++;}});
  pg.on('requestfailed',r=>{log.push(nm+'  FAILED  '+r.url());bad++;});
  pg.on('pageerror',e=>{log.push(nm+'  pageerror  '+e.message);bad++;});
  pg.on('console',m=>{if(m.type()==='error'){log.push(nm+'  console  '+m.text());bad++;}
   else if(/^(clearances|identity)/.test(m.text()))log.push(nm+'  '+m.text());});};
 const ready=async pg=>{await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(250);
  const fam=await pg.evaluate(()=>{const f=[];document.fonts.forEach(x=>{if(x.status==='loaded')f.push(x.family);});return f;});
  return fam;};

 /* ---- the stage ---- */
 const stage='file://'+path.join(DIR,'feathers.html');
 {const ctx=await br.newContext({viewport:{width:1600,height:1000},deviceScaleFactor:1});
  const pg=await ctx.newPage();watch(pg,'feathers');
  await pg.goto(stage,{waitUntil:'load'});const fam=await ready(pg);
  if(!fam.some(f=>/Inter/.test(f))){log.push('feathers  Inter did not load');bad++;}
  await pg.screenshot({path:path.join(SHOTS,'feathers-1600.png')});
  const m=await pg.evaluate(()=>({clear:window.__clear,feathers:window.__feathers}));
  const c=m.clear;
  log.push('feathers  clearance: nearest gate to any feather at full length '+c.gateMin+' px ('+c.gateWho+
   '), targets over a gate '+c.wedgeOverGate+', nearest seed to the ring '+c.ringToSeed+' px, to the range arc '+c.rangeToSeed+
   ' px, to the core\'s unseen backing disc '+c.coreToSeed+' px, gate block top '+c.blockTop+' px from centre, nearest chain bead to a gate '+c.beadToGate+' px');
  if(c.gateMin<0||c.wedgeOverGate>0||c.coreToSeed<0||c.rangeToSeed<0||c.ringToSeed<0||c.beadToGate<0){log.push('feathers  CLEARANCE FAILED');bad++;}
  const idn=m.feathers.identity;
  log.push('feathers  identity: lengths '+idn.sum.toFixed(3)+' points against 2.1 x (100 - CQ) = '+idn.want.toFixed(3)+
   ', off by '+idn.diff.toFixed(4)+'; the two captures agree: '+m.feathers.agree);
  if(idn.diff>0.01||!m.feathers.agree){log.push('feathers  IDENTITY FAILED');bad++;}
  /* HOVER, with a real pointer. The known bad point first. */
  const box=await (await pg.$('#stage')).boundingBox();
  const probeName=async()=>pg.evaluate(()=>{const p=document.querySelector('.probe');
   return p&&p.style.display==='block'?(p.querySelector('.n')||{}).textContent:null;});
  /* the svg sits inside the stage's one pixel border */
  box.x+=1;box.y+=1;
  const centre={x:box.x+460,y:box.y+455};
  await pg.mouse.move(centre.x,centre.y);await pg.waitForTimeout(60);
  const atCentre=await probeName();
  log.push('feathers  hover, known bad point (the centre of the number): probe names '+(atCentre===null?'nothing, correct':'"'+atCentre+'", WRONG'));
  if(atCentre!==null)bad++;
  let ok=0;const miss=[];
  for(const f of m.feathers.marks){
   /* the middle of the target, halfway up the scale, on the feather's own bearing */
   const r=92+76*.5, x=box.x+460+Math.cos(f.th)*r, y=box.y+455+Math.sin(f.th)*r;
   await pg.mouse.move(x,y);await pg.waitForTimeout(40);
   const n=await probeName(); if(n===f.nm)ok++;else miss.push(f.nm+' got '+n);
   await pg.mouse.move(box.x+30,box.y+880);await pg.waitForTimeout(20);}
  log.push('feathers  hover: '+ok+' of '+m.feathers.marks.length+' targets named their own law'+(miss.length?'; missed '+miss.join(', '):''));
  if(ok!==m.feathers.marks.length)bad++;
  const lens=m.feathers.marks.map(f=>f.nm+' '+f.L.toFixed(1)).join(', ');
  log.push('feathers  James, lengths in pixels: '+lens);
  await ctx.close();}
 {const ctx=await br.newContext({viewport:{width:1600,height:1000},deviceScaleFactor:2});
  const pg=await ctx.newPage();await pg.goto(stage,{waitUntil:'load'});await ready(pg);
  const st=await pg.$('#stage');
  await st.screenshot({path:path.join(SHOTS,'feathers-stage@2x.png')});
  const b=await st.boundingBox();
  await pg.screenshot({path:path.join(SHOTS,'feathers-centre@2x.png'),clip:{x:b.x+460-250,y:b.y+455-215,width:500,height:430}});
  /* one feather under the pointer: Compassion, James's furthest out */
  const th=await pg.evaluate(()=>window.__feathers.marks.find(f=>f.nm==='Compassion').th);
  await pg.mouse.move(b.x+460+Math.cos(th)*125,b.y+455+Math.sin(th)*125);await pg.waitForTimeout(260);
  await pg.screenshot({path:path.join(SHOTS,'feathers-hover@2x.png'),clip:{x:b.x+460-250,y:b.y+455-215,width:500,height:430}});
  await pg.mouse.move(b.x+20,b.y+880);await pg.waitForTimeout(200);
  await pg.evaluate(()=>window.__off(['domains','stories','masks','archetypes','patterns','chains']));
  await pg.waitForTimeout(200);
  await st.screenshot({path:path.join(SHOTS,'feathers-reading-stage@2x.png')});
  await ctx.close();}

 /* ---- the sheet ---- */
 const sheet='file://'+path.join(DIR,'feathers-ladder.html');
 for(const [W,H,dpr,out] of [[1600,1000,1,'feathers-ladder-1600.png'],[390,844,2,'feathers-ladder-390.png']]){
  const ctx=await br.newContext({viewport:{width:W,height:H},deviceScaleFactor:dpr});
  const pg=await ctx.newPage();watch(pg,'ladder '+W);
  await pg.goto(sheet,{waitUntil:'load'});await ready(pg);
  const ch=await pg.evaluate(()=>window.__checks);
  ch.forEach(c=>{log.push('ladder '+W+'  identity '+c.nm+': '+c.sum.toFixed(3)+' against '+c.want.toFixed(3)+', off by '+c.diff.toFixed(4));
   if(c.diff>0.01)bad++;});
  /* no horizontal page scroll at either width */
  const sw=await pg.evaluate(()=>[document.documentElement.scrollWidth,window.innerWidth]);
  log.push('ladder '+W+'  page width '+sw[0]+' in a viewport of '+sw[1]+(sw[0]>sw[1]?', SCROLLS SIDEWAYS':''));
  if(sw[0]>sw[1])bad++;
  /* nothing drawn is cut off by its own card: every mark inside every figure
     has to sit inside that figure's box. The first cut clipped a seat glyph on
     every card and it was found by looking, which this now does not rely on. */
  const clip=await pg.evaluate(()=>{let n=0,of=0;const out=[];
   document.querySelectorAll('.card svg').forEach(svg=>{const b=svg.getBoundingClientRect(),c=svg.parentElement.parentElement.getBoundingClientRect();
    if(b.left<c.left-.5||b.right>c.right+.5)out.push('figure wider than its card');
    svg.querySelectorAll('path,circle,line,text').forEach(e=>{const r=e.getBoundingClientRect();n++;
     if(r.width===0&&r.height===0)return;
     if(r.left<b.left-.5||r.right>b.right+.5||r.top<b.top-.5||r.bottom>b.bottom+.5){of++;}});});
   return {n:n,of:of,out:out};});
  log.push('ladder '+W+'  marks inside their figure: '+(clip.n-clip.of)+' of '+clip.n+(clip.out.length?'; '+clip.out.join(', '):''));
  if(clip.of||clip.out.length)bad++;
  /* every control clears the tap floor */
  const small=await pg.evaluate(()=>[...document.querySelectorAll('button,input')].filter(e=>{const r=e.getBoundingClientRect();return r.height<44;}).map(e=>e.id||e.textContent));
  if(small.length){log.push('ladder '+W+'  under the 44 floor: '+small.join(', '));bad++;}
  await pg.screenshot({path:path.join(SHOTS,out),fullPage:true});
  if(W===1600){
   for(const n of [0,5000,15000]){
    await pg.evaluate(n=>{const r=document.getElementById('rel');r.value=n;r.dispatchEvent(new Event('input'));},n);
    await pg.waitForTimeout(120);
    const pj=await pg.evaluate(()=>window.__proj);
    log.push('ladder 1600  projection at '+n+' releases: coherence '+pj.CQ.toFixed(2)+', '+pj.tier+', identity off by '+pj.check.diff.toFixed(4));
    if(pj.check.diff>0.01)bad++;
    const el=await pg.$('.proj');await el.screenshot({path:path.join(SHOTS,'feathers-proj-'+n+'.png')});}}
  await ctx.close();}

 await br.close();
 fs.writeFileSync(path.join(SHOTS,'feathers-requests.log'),
  ['THE REQUEST LOG for the feathers. Written by shoot-feathers.js.',
   'Any line marked OFF MACHINE is a request that left the computer, and there must be none.',''].concat(log).join('\n')+'\n');
 console.log(log.join('\n'));
 console.log(bad?'\n'+bad+' problem(s)':'\nclean: no request left the machine, no page errors, every measurement in bounds');
 process.exit(bad?1:0);
})();
