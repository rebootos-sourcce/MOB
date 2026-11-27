/* The height budget of the run screen at each viewport, taken off the DOM, so
   the first-screen-height note is measured and not estimated. Everything that
   shares the column is listed with the pixels it takes, and what is left. */
const {chromium}=require('playwright');
const path=require('path');
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const out=[];
 for(const [w,h] of [[1600,1000],[390,844],[360,640]]) for(const dir of ['edges','ring','stage']){
  const p=await b.newPage({viewport:{width:w,height:h}});
  await p.goto('file://'+path.resolve(__dirname,'room.html')+`?bare=1&dir=${dir}&at=0.1.30&f=.5`);
  await p.waitForTimeout(250);
  const r=await p.evaluate(()=>{
   const H=s=>{const e=document.querySelector(s);return e&&e.offsetParent!==null?Math.round(e.getBoundingClientRect().height):0;};
   const room=document.querySelector('.rel-room'), cs=getComputedStyle(room);
   return {vh:innerHeight,pad:Math.round(parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom)),
    header:H('.rel-top'),hero:H('#hero'),stem:H('#stem'),zone:H('.rel-zone'),instrument:H('#inst')||H('#feet')||H('#quad'),bar:H('.rel-bar'),
    textBlock:Math.round(document.getElementById('prompt').getBoundingClientRect().height)};});
  const used=r.header+r.hero+r.stem+r.zone+r.instrument+r.bar+r.pad;
  out.push(Object.assign({view:w+'x'+h,dir},r,{used,free:r.vh-used}));
  await p.close();}
 console.table(out);
 require('fs').writeFileSync(path.resolve(__dirname,'frames/heights.json'),JSON.stringify(out,null,1));
 require('fs').writeFileSync(path.resolve(__dirname,'frames/heights.js'),'window.HEIGHTS='+JSON.stringify(out)+';');
 await b.close();
})();
