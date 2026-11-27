/* ============================================================
   SHOOT THE FIELD LEFT PANEL PROTOTYPE for the focus group walk, GO.
   Every picture is an address in the prototype's hash, so any of them can be
   opened by hand and checked. Four people across the grid, levels 8, 7, 5
   and 3, plus a stranger, both widths.

     node proto/fieldpanel/shoot.js [outdir]
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const D=__dirname, OUT=process.argv[2]||path.join(D,'shots');
const FILE='file://'+path.join(D,'fieldpanel.html');
fs.mkdirSync(OUT,{recursive:true});
const ready=async p=>{await p.waitForFunction(()=>document.documentElement.getAttribute('data-fp-ready')==='1',null,{timeout:20000});
 await p.waitForTimeout(900);};
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const errs=[];
 const shot=async(W,H,hash,name,act)=>{
  const phone=W<600;
  const cx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:phone?2:1,isMobile:phone,hasTouch:phone});
  const p=await cx.newPage(); p.on('pageerror',e=>errs.push(name+': '+e.message));
  await p.goto(FILE+'#'+hash); await ready(p);
  if(act)await act(p);
  /* jpeg, because forty three pngs at 1600 were sixteen megabytes to commit */
  await p.screenshot({path:path.join(OUT,name+'.jpg'),type:'jpeg',quality:82});
  const txt=await p.evaluate(()=>{const r=document.getElementById('rdrill');
   return {drill:r&&r.style.display!=='none'?r.innerText.replace(/\s+/g,' ').slice(0,260):'',
    bar:[...document.querySelectorAll('#fbar .fb-b')].filter(x=>x.offsetParent).map(x=>x.getAttribute('aria-label')).join(' | ')};});
  console.log(name.padEnd(34),txt.bar.slice(0,120));
  if(txt.drill)console.log(''.padEnd(34),'drill: '+txt.drill);
  await cx.close();};
 const press=k=>async p=>{await p.click('#fbar .fb-full [data-fb='+k+'], #fbar [data-fb='+k+']');await p.waitForTimeout(700);};
 const meet=async p=>{const m=await p.$('#rootsum [data-fpm]');if(m){await m.click();await p.waitForTimeout(600);}};
 const base='dock=1&land=shut';
 for(const who of ['Sofia','Derek','Angela','James','blank']){
  for(const s of ['prose','list','orbs'])
   await shot(1600,1000,`who=${who}&s=${s}&p=both&${base}`,`${who}-summary-${s}`);
  await shot(1600,1000,`who=${who}&s=list&p=both&${base}`,`${who}-press-seats`,press('seats'));
  await shot(1600,1000,`who=${who}&s=list&p=both&${base}`,`${who}-press-laws`,press('laws'));
  await shot(1600,1000,`who=${who}&s=list&p=both&${base}`,`${who}-meet`,meet);}
 for(const l of ['laws','integrity','attunement','alignment','harmonic'])
  await shot(1600,1000,`who=Sofia&s=list&p=both&l=${l}&${base}`,`name-laws-${l}`,press('laws'));
 for(const m of ['now','twin','sum'])
  await shot(1600,1000,`who=Sofia&s=list&p=both&m=${m}&dock=0&${'land=shut'}`,`name-char-${m}`,press('character'));
 await shot(1600,1000,`who=Sofia&s=list&p=read&${base}`,`press-read-seats`,press('seats'));
 await shot(390,844,`who=Sofia&s=list&p=both&dock=0&land=shut`,`phone-landing`);
 await shot(390,844,`who=Sofia&s=list&p=both&dock=1&land=shut`,`phone-dock`);
 await shot(390,844,`who=Sofia&s=orbs&p=both&dock=0&land=shut`,`phone-summary-orbs`,async p=>{
  await p.evaluate(()=>{document.querySelector('[data-sec=overlap]').scrollIntoView();});await p.waitForTimeout(400);});
 await shot(390,844,`who=Sofia&s=list&p=both&dock=0&land=shut`,`phone-summary-list`,async p=>{
  await p.evaluate(()=>{document.querySelector('[data-sec=overlap]').scrollIntoView();});await p.waitForTimeout(400);});
 console.log('errors: '+(errs.join(' | ')||'none'));
 await b.close();
})();
