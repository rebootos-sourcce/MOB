/* Shoots the mockup at 1600 and 390, and measures each concept the way the
   SI7 review measured the real deck: row pitch, figures that do not fit where
   they are drawn, rows above the fold. Fails loudly on a page error or a
   horizontal scroll at 390. NODE_PATH must reach playwright.
   node shoot.js */
const {chromium}=require('playwright'), path=require('path');
const D=path.join(__dirname,'..'), OUT=path.join(D,'shots');
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [w,h] of [[1600,1000],[390,844]]){
  for(const who of ['blank','sofia','diane','marcus','angela','derek','james','tomas']){
   for(const v of (w<500?['A','B','C']:['C'])){
    const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:w<500?2:1});
    const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.goto('file://'+path.join(D,'index.html')+'?who='+(who==='blank'?'you':who)+'&v='+v);
    await p.waitForTimeout(700);
    const m=await p.evaluate(v=>{
     var col=document.querySelector('.col.'+v), rows=[...col.querySelectorAll('.row')];
     var r0=rows[0].getBoundingClientRect(), pitch=rows[1].getBoundingClientRect().top-r0.top;
     var sel=v==='A'?'.kbp2-fl b,.kbp2-fr b':v==='B'?'.fg':'.fg';
     var figs=[...col.querySelectorAll(sel)].filter(f=>f.textContent.trim());
     var cut=0; if(v==='A')figs.forEach(f=>{var a=f.getBoundingClientRect(),b=f.parentElement.getBoundingClientRect();if(a.width+7>b.width+.5)cut++;});
     else figs.forEach(f=>{if(f.scrollWidth>f.clientWidth+.5)cut++;});
     var ic=v==='A'?[...col.querySelectorAll('.kbp2-ic circle')].filter(c=>getComputedStyle(c).stroke!=='none').length:
      v==='C'?[...col.querySelectorAll('.si')].filter(s=>getComputedStyle(s).stroke!=='none').length:null;
     return {rows:rows.length,pitch:Math.round(pitch),figs:figs.length,cut,iconsDrawn:ic,
      sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,
      fold:rows.filter(r=>r.getBoundingClientRect().bottom<=innerHeight).length};},v);
    const name=w+'-'+who+(w<500?'-'+v:'')+'.png';
    if(who==='derek'||who==='sofia'||who==='blank'||w>500)await p.screenshot({path:path.join(OUT,name)});
    console.log(name,JSON.stringify(m),m.sw>m.cw?'HORIZONTAL SCROLL':'',errs.length?'ERRORS '+errs.join(' | '):'');
    await p.close();}}}
 /* the drill and the rows that test a design hardest, as element shots */
 const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
 for(const [who,nm] of [['derek','Possession'],['sofia','Nihilism'],['tomas','Fear'],['diane','Sol Star']]){
  for(const v of ['A','B','C']){
   await p.goto('file://'+path.join(D,'index.html')+'?who='+who+'&v='+v); await p.waitForTimeout(400);
   const el=await p.evaluateHandle(([v,nm])=>[...document.querySelectorAll('.col.'+v+' .row')].find(r=>[...r.querySelectorAll('.kbp2-l,.nmL,.nl b')].some(e=>e.textContent===nm)),[v,nm]);
   if(el.asElement()){await el.asElement().scrollIntoViewIfNeeded();await el.asElement().screenshot({path:path.join(OUT,'row-'+who+'-'+nm.toLowerCase().replace(/ /g,'')+'-'+v+'.png')});}}}
 await p.goto('file://'+path.join(D,'index.html')+'?who=derek&v=C'); await p.waitForTimeout(900);
 const dr=await p.$('#drill'); await dr.scrollIntoViewIfNeeded(); await p.waitForTimeout(500); await dr.screenshot({path:path.join(OUT,'drill-derek-possession-C.png')});
 await b.close();})();
