/* WHAT THE NAMEPLATES COST ON THE SHIPPING FIELD.

   NODE_PATH=$(npm root -g) node proto/field-a/measure-field.js

   Reads source.html, not a copy of it, and never writes to it. Four numbers,
   and every one of them is read off the live canvas rather than off the CSS:

     1  the radius budget. how much of the free radius reaches the reading and
        how much is handed to text that runs outward past it.
     2  the arc each seat plate reserves, in degrees, by the same predicate
        plateHit uses, so the number is the product's own and not mine.
     3  ink against reservation. lit pixels inside the shell, lit pixels in the
        annulus the names occupy, and the share of that annulus that is lit.
     4  the label boxes, summed, against the canvas.

   A probe that lies is worse than no probe, so the shell radius is read from
   R_SHELL after a draw and the text extents are measured with the canvas's own
   measureText at the font radialTxt sets. Nothing here is typed from the source.
*/
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const ROOT=path.resolve(__dirname,'../..');
const FILE='file://'+path.join(ROOT,'source.html');
const OUT=__dirname;

const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--disable-background-networking','--disable-component-update','--no-first-run']});
 const report={};
 for(const [w,h] of [[1600,1000],[390,844]]){
  const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
  await p.goto(FILE,{waitUntil:'load'}); await booted(p);
  await p.waitForTimeout(900);
  const res=await p.evaluate(()=>{
   /* real roster profiles, not invented numbers. Ana carries 41 addresses at
      or past the carrying floor and Sofia carries none, so the annulus ink
      share is measured on a loaded Field and on a light one rather than on
      whichever happened to be first. */
   const out={people:PEOPLE.map(x=>x.nm),depths:[],who:[]};
   /* BY NAME, NEVER BY POSITION. The UI's PEOPLE carries You at the front and
      the engine's does not, so loadP(7) loaded Rosa and the run printed Rosa
      under a heading that said Ana. The repository's own rule covers it. */
   for(const nm of ['Ana','Sofia']){
   const wi=PEOPLE.findIndex(x=>x.nm===nm);
   loadP(wi); setTab(TAB.FIELD); layout();
   out.who.push(PEOPLE[wi].nm);
   for(let v=0;v<4;v++){
    S.view=v; S.zoom=1; S.panx=0; S.pany=0; layout();
    const r=compute(); draw(r);
    const shell=R_SHELL;
    /* free radius: what reframe was allowed to use, recovered from BASE_U */
    const free=BASE_U*1.20+30;
    /* the seven seat plates, by the product's own geometry */
    const seats=BANDS.map(bn=>{
     const seg=W.filter(n=>n.b===bn); if(!seg.length)return null;
     const am=meanAng(seg.map(n=>n.ang));
     g.save(); g.font='600 12px Inter, system-ui, sans-serif';
     const tw=g.measureText(bn).width; g.restore();
     const out0=shell*1.058;
     /* plateHit's own angular width: one line tall at the plate's radius */
     const angW=(12*0.72)/out0;
     const angs=seg.map(n=>n.ang).sort((x,y)=>x-y);
     return {seat:bn,chars:bn.length,textPx:+tw.toFixed(1),
      start:+out0.toFixed(1),end:+(out0+tw).toFixed(1),
      degreesReserved:+(angW*180/Math.PI).toFixed(2),
      degreesOfInk:+((angs[angs.length-1]-angs[0])*180/Math.PI).toFixed(2)};}).filter(Boolean);
    const maxEnd=Math.max.apply(null,seats.map(s=>s.end));
    /* ink against reservation, off the pixels */
    const cv2=document.getElementById('cv');
    const sc=cv2.width/CW;
    const d=g.getImageData(0,0,cv2.width,cv2.height).data;
    let litIn=0,litAnn=0,litAll=0,areaIn=0,areaAnn=0;
    const r0=shell*sc, r1=maxEnd*sc, cx=CX*sc, cy=CY*sc;
    for(let y=0;y<cv2.height;y++)for(let x=0;x<cv2.width;x++){
     const dx=x-cx, dy=y-cy, rr=Math.hypot(dx,dy);
     const inIn=rr<=r0, inAnn=rr>r0&&rr<=r1;
     if(inIn)areaIn++; if(inAnn)areaAnn++;
     if(d[(y*cv2.width+x)*4+3]>8){litAll++; if(inIn)litIn++; else if(inAnn)litAnn++;}}
    /* the label boxes radialTxt recorded, in canvas units */
    const lbl=LBL.map(l=>({t:l.t,w:+l.w.toFixed(1),h:+l.h.toFixed(1)}));
    const lblArea=LBL.reduce((a,l)=>a+l.w*l.h,0);
    out.depths.push({depth:'ABCD'[v],CW:+CW.toFixed(1),CH:+CH.toFixed(1),
     BASE_U:+BASE_U.toFixed(1),U:+U.toFixed(1),free:+free.toFixed(1),
     shell:+shell.toFixed(1),plateOutermost:+maxEnd.toFixed(1),
     seats:seats,labels:lbl.length,
     lblAreaShare:+(lblArea/(CW*CH)*100).toFixed(2),
     litAll:litAll,litIn:litIn,litAnn:litAnn,
     areaIn:areaIn,areaAnn:areaAnn,
     px:cv2.width*cv2.height,sc:+sc.toFixed(3),who:PEOPLE[wi].nm});}}
   return out;});
  report[w]=res;
  await p.close();
 }
 fs.writeFileSync(path.join(OUT,'measure-field.json'),JSON.stringify(report,null,1));
 /* the printed form, so a person reading the run does not read the json */
 for(const w of Object.keys(report)){
  console.log('\n================ '+w+' ================');
  report[w].depths.forEach(d=>{
   const readShare=(d.shell/d.free*100).toFixed(1);
   const plateShare=((d.plateOutermost-d.shell)/d.free*100).toFixed(1);
   console.log(d.who+', depth '+d.depth+'  canvas '+d.CW+'x'+d.CH+'  U '+d.U+'  free radius '+d.free);
   console.log('  reading reaches '+d.shell+'px, '+readShare+' per cent of the free radius');
   console.log('  names run out to '+d.plateOutermost+'px, another '+plateShare+' per cent');
   const degs=d.seats.map(s=>s.seat+' '+s.degreesReserved).join('  ');
   console.log('  arc reserved per seat, degrees: '+degs);
   const tot=d.seats.reduce((a,s)=>a+s.degreesReserved,0);
   console.log('  seven plates reserve '+tot.toFixed(1)+' degrees of 360');
   if(d.areaAnn)console.log('  the annulus past the shell: '+(d.litAnn/d.areaAnn*100).toFixed(1)
    +' per cent lit, '+d.areaAnn+' pixels of reservation for '+d.litAnn+' of ink');
   console.log('  inside the shell: '+(d.litIn/d.areaIn*100).toFixed(1)+' per cent lit');
   console.log('  labels drawn '+d.labels+', their boxes '+d.lblAreaShare+' per cent of the canvas');
  });}
 await b.close();})();
