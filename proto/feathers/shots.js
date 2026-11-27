/* THE SHOT AND MEASUREMENT RUN FOR proto/feathers/index.html

   Two widths, a real pointer, and the browser's own request log rather than
   the page's. A page counting its own requests is a tool that could lie, and
   this repository has twice been handed a defect that was the probe's own bug,
   so the log is captured at the Chromium level and written beside the page.

   NODE_PATH=$(npm root -g) node proto/feathers/shots.js
*/
const {chromium}=require('playwright');
const fs=require('fs'), path=require('path');
const DIR=__dirname;
const URL='file://'+path.join(DIR,'index.html');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const WIDTHS=[[1600,1000],[390,844]];

(async()=>{
 const browser=await chromium.launch({executablePath:EXE});
 const report={};
 for(const [w,h] of WIDTHS){
  const ctx=await browser.newContext({viewport:{width:w,height:h},
   deviceScaleFactor:1});
  const page=await ctx.newPage();
  const reqs=[];
  page.on('request',r=>reqs.push(r.method()+' '+r.url()));
  page.on('requestfailed',r=>reqs.push('FAILED '+r.url()));
  await page.goto(URL,{waitUntil:'load'});
  await page.waitForFunction('window.__feathers&&window.__feathers.tol');
  await page.evaluate(()=>window.__feathers.still());
  await page.waitForTimeout(160);

  /* ---- the measurement, per profile ---- */
  const who=['Tomas','Gordon','Diane','Marcus','Sofia','Wren','Abraham'];
  const rows=[];
  for(const nm of who){
   await page.evaluate(n=>window.__feathers.who(n),nm);
   await page.waitForTimeout(60);
   const back=await page.evaluate(()=>window.__feathers.back());
   rows.push({nm,...back});
  }
  await page.evaluate(()=>window.__feathers.who('Diane'));
  await page.waitForTimeout(60);
  const tol=await page.evaluate(()=>window.__feathers.tol());
  const slots=await page.evaluate(()=>window.__feathers.slots());

  /* ---- hover under a real pointer, every mark ----
     THE CANVAS IS SCROLLED INTO VIEW FIRST. At 390 the two stages stack, the
     ported one sits below the fold, and hover(i) hands back a viewport
     coordinate that is off screen. The first run of this file reported 0 of 31
     answering at 390 and 31 of 31 at 1600, which is the shape of a probe bug
     and was one: page.mouse.move outside the viewport moves nothing. */
  await page.evaluate(()=>window.__feathers.into());
  await page.waitForTimeout(120);
  let answered=0, probeSample=null, missed=[];
  for(let i=0;i<slots.length;i++){
   const pt=await page.evaluate(k=>window.__feathers.hover(k),i);
   if(pt.x<0||pt.y<0||pt.x>w||pt.y>h){missed.push('offscreen '+i); continue;}
   await page.mouse.move(pt.x,pt.y);
   await page.waitForTimeout(18);
   const txt=await page.evaluate(()=>window.__feathers.probe());
   if(txt)answered++; else missed.push(slots[i].kind+' '+slots[i].key);
   if(slots[i].kind==='law'&&!probeSample)probeSample=txt;
  }
  const sweep=await page.evaluate(()=>window.__feathers.sweep());

  /* ---- the pictures ---- */
  await page.mouse.move(4,4);
  await page.waitForTimeout(120);
  await page.screenshot({path:path.join(DIR,'shot-'+w+'.png'),fullPage:true});
  /* one with the probe up, on the longest law, so the tooltip is in a shot */
  const lawIdx=slots.map((s,i)=>[s,i]).filter(a=>a[0].kind==='law')
   .sort((a,b)=>b[0].v-a[0].v)[0][1];
  const pt=await page.evaluate(k=>window.__feathers.hover(k),lawIdx);
  await page.mouse.move(pt.x,pt.y);
  await page.waitForTimeout(220);
  await page.screenshot({path:path.join(DIR,'shot-'+w+'-probe.png')});

  /* the three states that are not the default, so the report has evidence */
  const clip=w>1080?{x:806,y:110,width:700,height:780}:null;
  const stateShot=async(name,setup)=>{
   await setup();
   await page.waitForTimeout(320);
   await page.mouse.move(4,4); await page.waitForTimeout(200);
   await page.screenshot({path:path.join(DIR,'shot-'+name+'-'+w+'.png'),
    ...(clip?{clip}:{})});
  };
  await page.evaluate(()=>window.scrollTo(0,0));
  await stateShot('width',async()=>{await page.click('#bwid');});
  await stateShot('blank',async()=>{
   await page.click('#bdash'); await page.click('#bblank');});
  await stateShot('coarse',async()=>{
   await page.click('#bblank'); await page.click('#bcoarse');});
  await page.click('#bfine');

  fs.writeFileSync(path.join(DIR,'requests-'+w+'.log'),
   'proto/feathers/index.html, viewport '+w+'x'+h+'\n'
   +'captured by playwright at the chromium level, not from inside the page\n'
   +'run '+new Date().toISOString()+'\n\n'
   +'requests: '+reqs.length+'\n'
   +reqs.map(s=>'  '+s).join('\n')+'\n\n'
   +'outbound (anything not file://): '
   +reqs.filter(s=>!/ file:\/\//.test(s)&&!/^FAILED file:/.test(s)).length+'\n');

  report[w]={tol,rows,answered,missed,sweep,slots:slots.length,probeSample,
   reqs:reqs.length,
   outbound:reqs.filter(s=>!/ file:\/\//.test(s)).length};
  await ctx.close();
 }
 fs.writeFileSync(path.join(DIR,'measured.json'),JSON.stringify(report,null,1));
 for(const w of Object.keys(report)){
  const r=report[w];
  console.log('=== '+w+' wide ===');
  console.log(' requests '+r.reqs+', outbound '+r.outbound);
  console.log(' marks '+r.slots+', hover answered '+r.answered
   +(r.missed.length?' MISSED '+r.missed.join(', '):''));
  console.log(' stage '+r.tol.side.toFixed(0)+'px, core radius '+r.tol.cr0.toFixed(1));
  console.log(' ships: '+r.tol.ships.core+' tips return core, '
   +r.tol.ships.other+' return anything else');
  ['fine','coarse'].forEach(k=>{
   const t=r.tol[k];
   console.log(' '+k+': '+t.n+' targets, '+t.hits+' answer at their own tip');
   console.log('   tolerance tip  min '+t.tip.min.toFixed(1)+' med '
    +t.tip.med.toFixed(1)+' max '+t.tip.max.toFixed(1));
   console.log('   tolerance mid  min '+t.mid.min.toFixed(1)+' med '
    +t.mid.med.toFixed(1)+' max '+t.mid.max.toFixed(1));
   console.log('   tolerance rim  min '+t.rim.min.toFixed(1)+' med '
    +t.rim.med.toFixed(1)+' max '+t.rim.max.toFixed(1));
   console.log('   chord at rim '+t.chord.toFixed(1)+', depth '+t.depth.toFixed(1));
  });
  r.rows.forEach(x=>console.log(' '+x.nm.padEnd(9)+' pairs '+String(x.pairs).padStart(4)
   +' backwards '+String(x.bad).padStart(4)
   +'  tool ok '+x.good+'  overlap '+x.overlap));
  console.log(' probe sample: '+JSON.stringify(r.probeSample));
  r.sweep.forEach(x=>console.log('  '+(x.ch==='dash'?'dashes      ':'width '+x.ratio.toFixed(2))
   +'  wide '+x.wide.bad+'/'+x.wide.pairs+'  mid '+x.mid.bad+'/'+x.mid.pairs
   +'  near '+x.near.bad+'/'+x.near.pairs));
 }
 await browser.close();
})();
