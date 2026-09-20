const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const p of ['compass','board','tape']){
  const pg=await b.newPage({viewport:{width:1600,height:1000}});
  await pg.goto('file://'+__dirname+'/'+p+'.html');
  await pg.waitForTimeout(300);
  const r=await pg.evaluate(()=>{
   const out={};
   ['Marcus','Gordon'].forEach(n=>{
    const s=document.getElementById('who'); s.value=n;
    const t=[]; for(let i=0;i<40;i++){const a=performance.now();s.onchange();t.push(performance.now()-a);}
    t.sort((x,y)=>x-y);
    out[n]={median:+t[20].toFixed(2),worst:+t[39].toFixed(2)};});
   const sel='button,input,select,textarea,a[href],[role=button],[data-i]';
   const vis=[...document.querySelectorAll(sel)].filter(e=>e.offsetParent!==null);
   const small=vis.filter(e=>{const b=e.getBoundingClientRect();
     return (b.width<44||b.height<44)&&!e.matches('.hm i');}).length;
   out.choices=vis.filter(e=>!e.matches('.hm i')).length;
   out.heatCells=document.querySelectorAll('.hm i').length;
   out.smallTargets=small;
   out.words=document.body.innerText.trim().split(/\s+/).length;
   out.wordsNoFoot=document.body.innerText.replace(document.getElementById('foot').innerText,'')
     .trim().split(/\s+/).length;
   return out;});
  const fs=require('fs');
  const kb=(fs.statSync(__dirname+'/'+p+'.html').size/1024).toFixed(1);
  console.log(p.padEnd(9)+kb+' kB  choices '+String(r.choices).padStart(3)
   +'  words(no footnote) '+String(r.wordsNoFoot).padStart(3)
   +'  redraw median Marcus '+r.Marcus.median+'ms worst '+r.Marcus.worst
   +'ms  Gordon '+r.Gordon.median+'ms  sub44 '+r.smallTargets);
  await pg.close();}
 await b.close();
})();
