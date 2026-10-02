/* Before/after screenshots for the onboarding wire-in, round PS.
   OUT/old-* is the pre-change build (ATUNED_FILE=old), OUT/new-* is this
   branch's source.html. Run from the repo root:
     node tools/onboarding-shots.js OUT OLDFILE */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=process.argv[2]||'mockups/onboarding-wired';
const OLD=process.argv[3];
const NEW='file://'+path.resolve('source.html');
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};
const SIZES=[[1600,1000],[390,844]];
fs.mkdirSync(OUT,{recursive:true});

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});

 /* ---- OLD: the door, the gate (old onboarding step 2, the signal test),
    story (the Story tab, since the old onboarding never carried one) ---- */
 if(OLD){
  const OLDFILE='file://'+path.resolve(OLD);
  for(const [w,h] of SIZES){
   const p=await b.newPage({viewport:{width:w,height:h}});
   await p.goto(OLDFILE,{waitUntil:'load'}); await booted(p);
   await p.waitForTimeout(500);
   await p.screenshot({path:`${OUT}/old-${w}-door.png`});
   await p.evaluate(()=>{ if(typeof LOGIN!=='undefined'&&LOGIN.open)loginClose();
    loadP(0); obOpen(true); });
   await p.waitForTimeout(300);
   await p.screenshot({path:`${OUT}/old-${w}-arrive.png`});
   await p.evaluate(()=>{document.querySelector('[data-ob=next]').click();});
   await p.waitForTimeout(250);
   await p.evaluate(()=>{document.querySelector('[data-ob=next]').click();});
   await p.waitForTimeout(250);
   await p.screenshot({path:`${OUT}/old-${w}-gate.png`});   /* the signal test */
   await p.evaluate(()=>{obClose();});
   await p.waitForTimeout(700);
   await p.evaluate(()=>{setTab(TAB.STORY);});
   await p.waitForTimeout(400);
   await p.screenshot({path:`${OUT}/old-${w}-story.png`});
   /* the old build has no mirror at all: tutorial.js's "what this found"
      card is the nearest thing it carries, kept for an honest comparison
      rather than a blank file standing in for "none". */
   await p.evaluate(()=>{tutorialOpen(true);
    document.getElementById('tuttext').value=
     'I felt tight in my chest when my boss yelled at me and I could not breathe.';
    document.getElementById('tuttext').dispatchEvent(new Event('input'));
    document.querySelector('[data-tut=commit]').click();});
   await p.waitForTimeout(300);
   await p.screenshot({path:`${OUT}/old-${w}-mirror.png`});
   await p.close();
  }
 }

 /* ---- NEW: the real door, the ask (the new gate: the twelve starting
    points), the real story and the real mirror ---- */
 for(const [w,h] of SIZES){
  const p=await b.newPage({viewport:{width:w,height:h}});
  await p.goto(NEW,{waitUntil:'load'}); await booted(p);
  await p.waitForTimeout(500);
  await p.screenshot({path:`${OUT}/new-${w}-door.png`});
  await p.evaluate(()=>{ if(typeof LOGIN!=='undefined'&&LOGIN.open)loginClose();
   loadP(0); obOpen(true); });
  await p.waitForTimeout(300);
  await p.screenshot({path:`${OUT}/new-${w}-arrive.png`});
  await p.evaluate(()=>{document.querySelector('[data-ob=next]').click();});
  await p.waitForTimeout(300);
  await p.screenshot({path:`${OUT}/new-${w}-gate.png`});    /* the twelve starting points */
  await p.evaluate(()=>{document.querySelector('[data-obpick="3"]').click();});
  await p.waitForTimeout(250);
  await p.evaluate(()=>{document.querySelector('[data-ob=next]').click();});
  await p.waitForTimeout(250);
  await p.evaluate(()=>{document.querySelector('[data-obfeel="0"]').click();});
  await p.waitForTimeout(250);
  await p.evaluate(()=>{document.querySelector('[data-obplace="3"]').click();});
  await p.waitForTimeout(250);
  await p.screenshot({path:`${OUT}/new-${w}-story.png`});
  await p.evaluate(()=>{
   const ta=document.getElementById('obtext');
   ta.value='I felt tight in my chest when my boss yelled at me and I could not breathe.';
   ta.dispatchEvent(new Event('input'));
   document.getElementById('obdone').click();});
  await p.waitForTimeout(350);
  await p.screenshot({path:`${OUT}/new-${w}-mirror.png`});
  await p.evaluate(()=>{document.querySelector('[data-ob=mirroryes]').click();});
  await p.waitForTimeout(300);
  await p.screenshot({path:`${OUT}/new-${w}-bridge.png`});
  await p.close();
 }
 await b.close();
 console.log('wrote shots to '+OUT);
})();
