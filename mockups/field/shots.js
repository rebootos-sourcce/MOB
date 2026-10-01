/* shots.js. Real Chromium screenshots of both concepts: every example at a
   desk, two at a phone, each layer alone, reduced motion, two motion strips,
   and the comparison sheets the index shows. Run from the repo root with
   NODE_PATH at a playwright install:
     node mockups/field/shots.js          everything
     node mockups/field/shots.js sheets   only the sheets, from shots on disk
     node mockups/field/shots.js probe    one pass, timings, no files kept */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const D=__dirname,OUT=path.join(D,'shots');fs.mkdirSync(OUT,{recursive:true});
const PROBE=process.argv[2]==='probe',ONLY_SHEETS=process.argv[2]==='sheets';
const KEYS=['seat','spread','clear','collapse'],NAMES=['One seat','Spread','Clear','Collapse'];
const CN={1:'Ink',2:'Branch'};
const url=c=>'file://'+path.join(D,'concept-'+c+'.html');
const watch=(p,errs)=>{p.on('pageerror',e=>errs.push(String(e.message)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
 p.on('request',r=>{const u=r.url();if(!u.startsWith('file:')&&!u.startsWith('data:'))errs.push('NETWORK '+u);});};
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const report=[];
 for(const c of (ONLY_SHEETS?[]:[1,2])){
  const errs=[];const p=await b.newPage({viewport:{width:1600,height:1000}});watch(p,errs);
  await p.goto(url(c));await p.waitForTimeout(600);
  for(let i=0;i<4;i++){
   await p.evaluate(i=>{__setPreset(i);__layers(1,1,1);},i);await p.waitForTimeout(2800);
   await p.evaluate(()=>__resetCost());await p.waitForTimeout(1500);
   const info=await p.evaluate(()=>({ms:+__cost().toFixed(1),phases:__phases(),peak:+F.dmax.toFixed(1),CQ:Math.round(F.CQ*100),points:F.live}));
   report.push(Object.assign({concept:CN[c],example:NAMES[i]},info));
   if(PROBE){await p.screenshot({path:path.join(OUT,'probe-'+c+'-'+KEYS[i]+'.png')});continue;}
   await p.screenshot({path:path.join(OUT,'concept-'+c+'-'+KEYS[i]+'.png')});
   const st=await p.$('#stage');await st.screenshot({path:path.join(OUT,'stage-'+c+'-'+KEYS[i]+'.png')});}
  if(!PROBE){
   /* the overlay is an overlay: one example with each layer alone */
   await p.evaluate(()=>__setPreset(1));await p.waitForTimeout(2500);
   for(const [nm,l] of [['none',[1,0,0]],['medium',[1,1,0]],['trace',[1,0,1]],['both',[1,1,1]]]){
    await p.evaluate(l=>__layers(l[0],l[1],l[2]),l);await p.waitForTimeout(900);
    const st=await p.$('#stage');await st.screenshot({path:path.join(OUT,'layers-'+c+'-'+nm+'.png')});}
   /* the motion, as a strip: from Clear to One seat, eased, around the
      heaviest knot, ten frames 150ms apart then six 400ms apart */
   await p.evaluate(()=>{__layers(1,1,1);__setPreset(2);});await p.waitForTimeout(1800);
   await p.evaluate(()=>{stopCycle();setPreset(0);});
   const bb=await (await p.$('#stage')).boundingBox();
   for(let f=0;f<16;f++){
    const k=await p.evaluate(()=>{const K=knots();let h=null;CL.ad.forEach((a,i)=>{if(K[i].n>4&&(!h||a.sq>h.a.sq))h={a,k:K[i]};});return h?{x:h.k.x,y:h.k.y}:null;});
    const cx=k?k.x:bb.width/2,cy=k?k.y:bb.height/2;
    await p.screenshot({path:path.join(OUT,'_f'+c+'-'+String(f).padStart(2,'0')+'.png'),clip:{x:bb.x+cx-110,y:bb.y+cy-150,width:220,height:230}});
    await p.waitForTimeout(f<10?150:400);}}
  report.push({concept:CN[c],errors:errs.slice()});await p.close();
  if(PROBE)continue;
  /* a phone */
  const e2=[];const m=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});watch(m,e2);
  await m.goto(url(c));await m.waitForTimeout(600);
  for(const i of [0,1]){await m.evaluate(i=>__setPreset(i),i);await m.waitForTimeout(2800);
   await m.screenshot({path:path.join(OUT,'concept-'+c+'-390-'+KEYS[i]+'.png')});}
  const sw=await m.evaluate(()=>document.documentElement.scrollWidth);
  await m.evaluate(()=>{__resetCost();});await m.waitForTimeout(1500);
  const pc=await m.evaluate(()=>+__cost().toFixed(1));
  await m.screenshot({path:path.join(OUT,'concept-'+c+'-390-full.png'),fullPage:true});
  report.push({concept:CN[c],phone:{scrollWidth:sw,ms:pc},errors:e2});await m.close();
  /* reduced motion: the end state, and it must still draw */
  const e3=[];const ctx=await b.newContext({viewport:{width:1600,height:1000},reducedMotion:'reduce'});const r=await ctx.newPage();watch(r,e3);
  await r.goto(url(c));await r.waitForTimeout(600);await r.evaluate(()=>__setPreset(3));await r.waitForTimeout(1500);
  const st=await r.$('#stage');await st.screenshot({path:path.join(OUT,'reduced-'+c+'-collapse.png')});
  report.push({concept:CN[c],reduced:await r.evaluate(()=>REDUCED),errors:e3});await ctx.close();}
 if(!PROBE){
  /* the sheets, laid out in the browser itself so nothing else is needed */
  const sheet=async(file,cols,cells,w,h,title)=>{const pg=await b.newPage({viewport:{width:cols*w+(cols-1)*12+24,height:100}});
   const html='<body style="margin:0;background:#0C0D12;color:#EFEDE8;font:13px Inter,system-ui,sans-serif;padding:12px">'
    +'<div style="font-size:15px;margin:0 0 10px">'+title+'</div><div style="display:grid;grid-template-columns:repeat('+cols+','+w+'px);gap:12px">'
    +cells.map(x=>'<figure style="margin:0"><img src="'+x.f+'" style="width:'+w+'px;height:'+h+'px;object-fit:cover;display:block;border-radius:8px"><figcaption style="color:#B4B0A8;margin-top:5px">'+x.t+'</figcaption></figure>').join('')+'</div></body>';
   const tmp=path.join(OUT,'_sheet.html');fs.writeFileSync(tmp,'<!doctype html><meta charset="utf-8">'+html);
   await pg.goto('file://'+tmp);await pg.waitForTimeout(500);fs.unlinkSync(tmp);
   await pg.screenshot({path:path.join(OUT,file),fullPage:true});await pg.close();};
  const st=[];for(const c of [1,2])KEYS.forEach((k,i)=>st.push({f:'stage-'+c+'-'+k+'.png',t:CN[c]+', '+NAMES[i]}));
  await sheet('sheet-states.png',4,st,420,300,'Both concepts, all four examples, every layer on');
  const ly=[];for(const c of [1,2])[['none','The cloud as it ships'],['medium',c===1?'Fluid alone':'Fractal alone'],['trace','Trace alone'],['both','Both']].forEach(x=>ly.push({f:'layers-'+c+'-'+x[0]+'.png',t:CN[c]+', '+x[1]}));
  await sheet('sheet-layers.png',4,ly,420,300,'Spread, each layer on its own. The trace is an overlay on the cloud, not a replacement for it.');
  for(const c of [1,2]){const fr=[];for(let f=0;f<16;f++)fr.push({f:'_f'+c+'-'+String(f).padStart(2,'0')+'.png',t:(f<10?f*150:1500+(f-10)*400)+' ms'});
   await sheet('strip-'+c+'.png',8,fr,160,167,CN[c]+', from Clear to One seat, around the heaviest knot');}
  fs.readdirSync(OUT).filter(f=>f.startsWith('_')||f.startsWith('probe-')).forEach(f=>fs.unlinkSync(path.join(OUT,f)));}
 console.log(JSON.stringify(report));
 await b.close();})();
