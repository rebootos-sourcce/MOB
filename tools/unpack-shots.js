/* Before and after pictures for the unpack-every-symbol round (PO).
   Usage: node tools/unpack-shots.js FILE OUTDIR TAG
   Takes the Derek profile's blueprint card (the "What drives it" card on
   Summary) and the Jesus pole panel on the Compass, at 1600 and 390. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const FILE=path.resolve(process.argv[2]||'source.html'), OUT=process.argv[3]||'mockups/unpack', TAG=process.argv[4]||'after';
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [w,h,wn] of [[1600,1000,'1600'],[390,844,'390']]){
  const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:w<600,hasTouch:w<600});
  const p=await c.newPage();
  await p.addInitScript(require('../tests/seed.js').FULL_SIGHT);
  await p.goto('file://'+FILE+'?dev=1'); await p.waitForTimeout(6500);
  await p.evaluate(()=>{loadP(PEOPLE.findIndex(x=>x.nm==='Derek'));setTab(TAB.SUMMARY);});
  await p.waitForTimeout(900);
  /* An element sits inside a scrolling column, so it is scrolled to the top of
     the window and the picture is the window's own pixels over the element's
     box, never the element alone, which clips at the column's edge. */
  const snap=async(sel,name)=>{
   const h=await p.$(sel); if(!h)return false;
   await h.evaluate(e=>e.scrollIntoView({block:'start'})); await p.waitForTimeout(350);
   const r=await h.boundingBox(); const vp=p.viewportSize();
   const x=Math.max(0,r.x), y=Math.max(0,r.y);
   await p.screenshot({path:`${OUT}/${wn}-${name}-${TAG}.png`,
    clip:{x,y,width:Math.min(r.width,vp.width-x),height:Math.min(r.height,vp.height-y)}});
   return true;};
  await snap('.sg-drive','blueprint');
  await snap('.s-story','reading');
  await p.evaluate(()=>{setTab(TAB.COMPASS);}); await p.waitForTimeout(800);
  await p.evaluate(()=>{runTeacherDrill(MIRROR[0],'up');}); await p.waitForTimeout(900);
  if(!(await snap('#rdrill','jesus')))await p.screenshot({path:`${OUT}/${wn}-jesus-${TAG}.png`});
  await c.close();}
 await b.close();})();
