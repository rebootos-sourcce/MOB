/* THE CAPTURE for the round CB mockups. Everything these comps draw on is
   lifted off the shipped build, not redrawn from memory: the Frames and Dial
   pictures as the product writes them (ui/rings.js emits SVG, so the markup is
   the picture), the chrome around the stage as a raster, the Wheel's canvas,
   and the boxes every overlay has to land on.

   One person in one state throughout: James, with his five story bank lines
   committed the way proto/field-rings/capture.js committed them, so these
   comps, the CA screenshots and the field-rings mockups are one reading.

   One thing is changed at capture time and only here: for the Wheel shot
   without handles, radialTxt is wrapped so it skips the seven seat names. That
   is how the comp shows the wheel with the names taken off. Nothing under
   atuned_src/ is touched and source.html is only read.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/field-cb/capture.js */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'cap');
const {STORYBANK}=require(path.resolve('sim/stories.js'));
fs.mkdirSync(OUT,{recursive:true});
const SVG={};
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const geo={};
 for(const [W,H] of [[1600,1000],[390,844]]){
  const ctx=await b.newContext({viewport:{width:W,height:H}});
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve('source.html'));
  await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000});
  await p.evaluate(([bank])=>{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();
   const i=PEOPLE.findIndex(q=>q.nm==='James');loadP(i);
   (bank['James']||[]).map(x=>x[1]).forEach(function(t,k){applyStory(t);verpApply(t);if(typeof leanApply==='function')leanApply(t);
    CURP.story=CURP.story||{entries:[]};const ps=parseStory(t);
    CURP.story.entries.push({t:'2026-09-2'+k+'T08:00:00Z',text:t,imprints:ps.imprints.length,bands:ps.bands});});},[STORYBANK]);
  const G=geo[W]={};
  for(const v of ['frames','dial','wheel']){
   await p.evaluate(v=>{setTab(TAB.FIELD);fviewSet(v);render();},v);
   await p.waitForTimeout(900);
   G[v]=await p.evaluate(()=>{const o={};
    ['stage','key','fview','frend','cv','pol2','railtop','tier','acc','keylo','flay','vbar'].forEach(id=>{const e=document.getElementById(id);
     if(!e)return;const r=e.getBoundingClientRect();if(r.width)o[id]=[r.x,r.y,r.width,r.height].map(v=>Math.round(v*10)/10);});
    const st=document.getElementById('stage');o.stageBg=getComputedStyle(st).backgroundColor;
    /* the compass figure's own box, so a comp that takes it off covers that
       and nothing else. Read, not worked out from the viewBox: the first cut
       worked it out and missed by the top of the digits */
    const pc=document.querySelector('#pol2 .pol2-c');if(pc){const r=pc.getBoundingClientRect();o.pol2c=[r.x,r.y,r.width,r.height].map(v=>Math.round(v*10)/10);}
    return o;});
   if(v!=='wheel'){
    const svg=await p.evaluate(()=>{const s=document.querySelector('#frend svg');
     return s?s.outerHTML.replace(/ data-h="\d+"/g,''):'';});
    SVG[v+'-'+W]=svg;}
   await p.screenshot({path:path.join(OUT,'page-'+v+'-'+W+'.png')});}
  /* the compass slider's markup, so the comp can see what carries the number */
  fs.writeFileSync(path.join(OUT,'pol2-'+W+'.html'),await p.evaluate(()=>document.getElementById('pol2').outerHTML));
  fs.writeFileSync(path.join(OUT,'railtop-'+W+'.html'),await p.evaluate(()=>document.getElementById('railtop').outerHTML));
  fs.writeFileSync(path.join(OUT,'key-'+W+'.html'),await p.evaluate(()=>document.getElementById('key').outerHTML));
  /* THE WHEEL, twice: as it ships, and with the seven seat names left off.
     The seat geometry comes off the wheel's own hit list, the target it
     already registers for each seat's arc, so the overlay sits on the arc the
     wheel drew and not on one worked out again here. */
  await p.evaluate(()=>{setTab(TAB.FIELD);fviewSet('wheel');render();});await p.waitForTimeout(900);
  const cvBox=G.wheel.cv;
  /* HOW FAR THE WHEEL REACHES, read off its own canvas: the radius from the
     wheel's centre inside which 99.5 percent of the lit pixels sit, lit
     meaning any channel over 60. The lower strip is left out, since it is
     not the wheel. Measured the same way for all three variants, so the
     three numbers can be compared with each other. */
  const reach=()=>p.evaluate(()=>{const cv=document.getElementById('cv'),x=cv.getContext('2d');
   const s=HIT.find(h=>h.k==='seat'),dpr=cv.width/cv.getBoundingClientRect().width;
   const d=x.getImageData(0,0,cv.width,cv.height).data,W=cv.width,Hh=Math.min(cv.height,Math.round((s.cy+s.r1*1.5)*dpr));
   const hist=new Array(2000).fill(0);let tot=0;
   for(let y=0;y<Hh;y++)for(let i=0;i<W;i++){const o=(y*W+i)*4;if(Math.max(d[o],d[o+1],d[o+2])>60){
    const r=Math.hypot(i/dpr-s.cx,y/dpr-s.cy);if(r<1000){hist[Math.floor(r)]++;tot++;}}}
   let a=0;for(let r=0;r<2000;r++){a+=hist[r];if(a>=tot*.995)return r;}return null;});
  G.reach={};
  await p.screenshot({path:path.join(OUT,'wheel-'+W+'.png'),clip:{x:cvBox[0],y:cvBox[1],width:cvBox[2],height:cvBox[3]}});
  G.reach.ships=await reach();
  G.seats=await p.evaluate(()=>(typeof HIT!=='undefined'?HIT:[]).filter(h=>h.k==='seat').map(h=>({b:h.b,cx:h.cx,cy:h.cy,a0:h.a0,a1:h.a1,r0:h.r0,r1:h.r1})));
  G.seatCol=await p.evaluate(()=>{const o={};BANDS.forEach(b=>{o[b]=typeof bc==='function'?bc(b):null;});return o;});
  await p.evaluate(()=>{window.__rt=radialTxt;window.radialTxt=function(s){if(BANDS.indexOf(s)>=0)return;return window.__rt.apply(this,arguments);};render();});
  await p.waitForTimeout(700);
  await p.screenshot({path:path.join(OUT,'wheel-nonames-'+W+'.png'),clip:{x:cvBox[0],y:cvBox[1],width:cvBox[2],height:cvBox[3]}});
  G.reach.noSeatNames=await reach();
  /* and with every radial name off, the saboteur plates as well, because at
     1600 a plate reaches as far out as the seat names do */
  await p.evaluate(()=>{window.radialTxt=function(){};render();});
  await p.waitForTimeout(700);
  await p.screenshot({path:path.join(OUT,'wheel-noradial-'+W+'.png'),clip:{x:cvBox[0],y:cvBox[1],width:cvBox[2],height:cvBox[3]}});
  G.reach.noRadialNames=await reach();
  await p.evaluate(()=>{window.radialTxt=window.__rt;render();});
  /* THE SUMMARY, where the breakdown of gaining goes. Two anchors found by
     their words, the head of the page and the first block after it, so the
     comp can open the page at the right line */
  await p.evaluate(()=>{setTab(TAB.SUM);render();});await p.waitForTimeout(900);
  G.sum=await p.evaluate(()=>{const f=t=>{const e=[...document.querySelectorAll('#sumbody *')].find(x=>x.children.length===0&&x.textContent.trim().toLowerCase()===t);
    if(!e)return null;const r=e.getBoundingClientRect();return [r.x,r.y+scrollY,r.width,r.height].map(v=>Math.round(v));};
   const b=document.getElementById('sumbody').getBoundingClientRect();
   return {body:[b.x,b.y+scrollY,b.width,b.height].map(Math.round),goes:f('where it goes'),told:f('what you told it'),docH:document.documentElement.scrollHeight};});
  await p.screenshot({path:path.join(OUT,'page-summary-'+W+'.png'),fullPage:W<500,clip:W<500?{x:0,y:0,width:W,height:Math.min(G.sum.docH,(G.sum.told?G.sum.told[1]+700:2400))}:undefined});
  await p.evaluate(()=>{setTab(TAB.FIELD);render();});
  /* the whole roster's two readings, to test any centre that puts them on one ring */
  if(W===1600)G.roster=await p.evaluate(()=>PEOPLE.map((q,i)=>{loadP(i);const r=compute();return {nm:q.nm,CQ:+(+r.CQ).toFixed(1),DQ:+(+r.DQ).toFixed(1),tier:r.tier,unread:!!r.unread};}));
  G.errs=errs;
  await ctx.close();}
 fs.writeFileSync(path.join(OUT,'geo.json'),JSON.stringify(geo,null,1));
 /* one script the comps load with a plain script tag, because a page opened
    from the disk cannot fetch a file beside it */
 fs.writeFileSync(path.join(OUT,'cap.js'),'/* written by capture.js. the shipped Frames and Dial pictures and the boxes around them */\n'
  +'window.CAP='+JSON.stringify({svg:SVG,geo:geo})+';\n');
 await b.close();
 console.log('captured',fs.readdirSync(OUT).join(' '));
 console.log('errors',JSON.stringify([geo[1600].errs,geo[390].errs]));})();
