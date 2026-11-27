/* Captures the body map prototype for review, and fails loudly on a page
   error or any network request.
   NODE_PATH=<playwright> node proto/body-map-build/src/capture.js [file]
   Writes into proto/body-map-build/shots/. Stills are one frame of a running
   animation; open the page to see the motion. */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const DIR=path.join(__dirname,'..'),OUT=path.join(DIR,'shots');fs.mkdirSync(OUT,{recursive:true});
const FILE=process.argv[2]||path.join(DIR,'body-map.html');
(async()=>{const b=await chromium.launch();const log=[];let bad=0;
 for(const [w,h] of [[1600,1000],[390,844]]){
  const p=await b.newPage({viewport:{width:w,height:h}});
  const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  const reqs=[];p.on('request',r=>{if(!/^(file|data|blob):/.test(r.url()))reqs.push(r.url());});
  await p.goto('file://'+FILE);await p.waitForTimeout(1800);
  const st=await p.$('#stage');const shot=async n=>{await st.screenshot({path:`${OUT}/${n}-${w}.png`});};
  await shot('1-pattern');
  if(w===1600){await p.screenshot({path:`${OUT}/0-page-${w}.png`});}
  for(const v of ['A','B','C']){
   await p.click(`#variant button[data-k="${v}"]`);
   if(!(await p.$eval('#mode button[data-k="pain"]',e=>e.getAttribute('aria-pressed')==='true')))await p.click('#mode button[data-k="pain"]');
   await p.waitForTimeout(150);await shot(`2-pain-${v}-mid`);
   await p.waitForTimeout(900);await shot(`3-pain-${v}`);}
  /* the trap, his own example, pressed on Diane */
  await p.selectOption('#who','Diane');await p.click('#mode button[data-k="pattern"]');await p.waitForTimeout(600);
  const pt=await p.evaluate(()=>{const r=__proto.REG.find(x=>x.v===1&&x.nm==='Trap'&&x.side==='l');
   const S=__proto.S;return [(r.cx+74-S.cam.x)*S.cam.z+S.W/2,(r.cy-S.cam.y)*S.cam.z+S.H/2];});
  const bb=await st.boundingBox();
  if(w===1600){await p.mouse.click(bb.x+pt[0],bb.y+pt[1]);await p.waitForTimeout(400);await p.screenshot({path:`${OUT}/4-trap-${w}.png`});}
  /* a saboteur held, traced */
  await p.evaluate(()=>{const s=__proto.SABS()[0];__proto.S.holdSab=s;__proto.S.traceT0=performance.now()-2000;});
  await p.waitForTimeout(500);await shot('5-held-line');
  /* zoomed on the torso, where the fetter marks appear */
  await p.evaluate(()=>{__proto.S.holdSab=null;const S=__proto.S;__proto.flyTo(50,34,S.z0*3.2);});
  await p.waitForTimeout(1400);await shot('6-zoom-marks');
  await p.evaluate(()=>{const S=__proto.S;__proto.flyTo(50,80,S.z0*2.2);});
  await p.click('#mode button[data-k="pain"]');await p.selectOption('#who','Derek');await p.waitForTimeout(1400);await shot('7-legs-pain');
  const fr=await p.evaluate(()=>__proto.frameMs());
  log.push(`${w}: frame ${fr.toFixed(2)}ms, errors ${errs.length}${errs.length?' '+errs.slice(0,3).join(' | '):''}, requests ${reqs.length}`);
  bad+=errs.length+reqs.length;await p.close();}
 await b.close();console.log(log.join('\n'));process.exit(bad?1:0);})();
