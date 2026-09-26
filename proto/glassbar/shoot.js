/* ============================================================
   DRIVE THE GLASS BAR WITH REAL PRESSES AND CHECK THE PICTURE ANSWERS.

   Every step presses the bar's own button with the mouse (a finger at 390),
   then reads back what the product itself says is on the screen: the
   wheel's hit list, which only carries what drawWheel actually drew, and on
   the renditions the computed display of each layer's group. A press that
   changed the button but not the picture fails here by name.

     node proto/glassbar/build.js
     NODE_PATH=/opt/node22/lib/node_modules node proto/glassbar/shoot.js
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'shots');
const PAGE='file://'+path.join(__dirname,'glassbar.html');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
fs.mkdirSync(OUT,{recursive:true});
const wait=(p,ms)=>p.waitForTimeout(ms);
let fails=0, passes=0;
const ok=(c,msg)=>{if(c)passes++;else{fails++;console.log('  FAIL',msg);}};

/* what the wheel drew, by the kinds in its own hit list */
/* read after two frames, because the wheel draws on the animation frame and
   a hit list read straight after a press is the frame before it */
const drawn=p=>p.evaluate(()=>new Promise(res=>{render();requestAnimationFrame(()=>requestAnimationFrame(()=>{
 const s={};HIT.forEach(h=>{s[h.k]=(s[h.k]||0)+1;});res(s);}));}));
/* what a rendition shows, by the computed display of each layer group */
const shown=p=>p.evaluate(()=>{const f=document.getElementById('frend'),o={};
 /* a layer has two groups, marks and words, and the words are often empty:
    a layer is showing when any group of its class has something drawn */
 f.querySelectorAll('g[class^="L-"],g[class^="P-"]').forEach(g=>{const k=g.getAttribute('class');
  o[k]=!!o[k]||(getComputedStyle(g).display!=='none'&&g.childNodes.length>0);});
 ['cx','hy','sup'].forEach(t=>{o['T-'+t]=[...f.querySelectorAll('.T-'+t)].some(e=>getComputedStyle(e).display!=='none');});
 /* and a thread whose far end is hidden is hidden with it */
 o.looseThreads=[...f.querySelectorAll('.F-addr,.F-sab,.F-cx,.F-hy')].filter(e=>getComputedStyle(e).display!=='none'&&
  ((e.classList.contains('F-addr')&&f.classList.contains('gb-off-addr'))||(e.classList.contains('F-sab')&&f.classList.contains('gb-off-sab'))
  ||(e.classList.contains('F-cx')&&f.classList.contains('gb-off-cx'))||(e.classList.contains('F-hy')&&f.classList.contains('gb-off-hy')))).length;
 return o;});

(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const facts={};
 for(const [W,H] of [[1600,1000],[390,844]]){
  console.log('at',W);
  const phone=W<600;
  const ctx=await b.newContext({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone,deviceScaleFactor:1});
  const p=await ctx.newPage(); const errs=[];
  p.on('pageerror',e=>errs.push(e.message));
  await p.goto(PAGE);
  await p.waitForFunction(()=>document.documentElement.getAttribute('data-gb-ready')==='1',null,{timeout:30000});
  await wait(p,1200);
  const tapSel=async sel=>{const e=await p.$(sel);const bx=await e.boundingBox();
   if(!bx)throw new Error('not on screen: '+sel);
   const x=bx.x+bx.width/2,y=bx.y+bx.height/2;
   if(phone)await p.touchscreen.tap(x,y);else await p.mouse.click(x,y);await wait(p,250);};
  /* a layer's button, wherever the bar has put it: in the row, or in the
     folded panel, which is opened first and left open */
  const press=async k=>{
   const folded=await p.evaluate(()=>document.getElementById('gb').classList.contains('folded'));
   if(folded){const open=await p.evaluate(()=>document.getElementById('gb-panel').classList.contains('open'));
    if(!open)await tapSel('#gb [data-gb=fold]');
    await tapSel('#gb-panel [data-gb='+k+']');}
   else await tapSel('#gb .gb-full [data-gb='+k+']');};
  const closeFloats=async()=>{await p.keyboard.press('Escape');await wait(p,150);};
  const shot=async nm=>{if(!phone)await p.mouse.move(W-6,H-6);await wait(p,450);
   await p.screenshot({path:`${OUT}/${nm}-${W}.png`});};

  /* 0. every target on the floor */
  const small=await p.evaluate(()=>[...document.querySelectorAll('#gb .gb-b')].filter(e=>e.offsetParent)
   .map(e=>{const r=e.getBoundingClientRect();return [e.getAttribute('data-gb'),r.width,r.height];})
   .filter(x=>x[1]<44||x[2]<44));
  ok(small.length===0,'targets under 44: '+JSON.stringify(small));
  ok(await p.evaluate(()=>getComputedStyle(document.getElementById('subbar')).display==='none'),'the depth row is still showing');

  /* 1. opens on the Patterns set, the depth the Field has always opened on */
  let d=await drawn(p);
  ok(d.node>0&&d.sab>0&&d.seat>0,'opening set draws addresses, saboteurs, seats '+JSON.stringify(d));
  ok(!d.cx&&!d.dom,'opening set draws no complexes or domains');
  await shot('1-open');

  /* 2. saboteurs off. Only the saboteurs go. */
  await press('saboteurs'); d=await drawn(p);
  ok(!d.sab,'saboteurs off, beads still drawn: '+d.sab);
  ok(d.node>0&&d.seat>0,'saboteurs off took something else with it');
  await shot('2-saboteurs-off');

  /* 3. complexes, hyper complexes and character on, saboteurs still off.
     His three named tools, each alone. */
  await press('complexes'); d=await drawn(p);
  ok(d.cx>0&&!d.hy&&!d.sup,'complexes alone '+JSON.stringify(d));
  await press('hyper'); await press('character'); d=await drawn(p);
  ok(d.cx>0&&d.hy>0&&d.sup>0&&!d.sab,'three tiers on, saboteurs off '+JSON.stringify(d));
  await press('hyper'); d=await drawn(p);
  ok(d.cx>0&&!d.hy&&d.sup>0,'hyper complexes off alone, the tiers either side stay '+JSON.stringify(d));
  if(phone)await closeFloats();
  await shot('3-chain-tiers');

  /* 4. domains and masks on. The ring makes room for the outer band. */
  await press('domains'); await press('masks'); d=await drawn(p);
  ok(d.dom===19&&d.mk===6,'domains and masks '+JSON.stringify(d));
  ok(await p.evaluate(()=>GB.geomDepth())===3,'ring did not make room for the domains');
  /* 5. addresses off. The ring itself goes, the rest stays. */
  await press('addresses'); d=await drawn(p);
  ok(!d.node&&d.dom===19,'addresses off '+JSON.stringify(d));
  if(phone)await closeFloats();
  await shot('4-no-addresses');
  await press('addresses');
  if(phone)await closeFloats();

  /* 6. the depth menu. Charge puts the set back to the ladder's first rung. */
  await tapSel('#gb [data-gb=depth]');
  await shot('5-depth-menu');
  await tapSel('#gb-menu [data-preset="0"]'); d=await drawn(p);
  ok(d.node>0&&!d.sab&&!d.cx&&!d.dom&&!d.seat,'Charge preset '+JSON.stringify(d));
  ok(await p.evaluate(()=>GB.geomDepth())===0,'Charge preset is not at Charge geometry');
  await shot('6-charge');
  await tapSel('#gb [data-gb=depth]'); await tapSel('#gb-menu [data-preset="3"]'); d=await drawn(p);
  ok(d.node>0&&d.sab>0&&d.cx>0&&d.hy>0&&d.sup>0&&d.arch===12&&d.dom===19&&d.mk===6,'Blueprint preset '+JSON.stringify(d));
  await shot('7-blueprint');

  /* 7. the same set, drawn as Frames. One state, three renditions. */
  await p.evaluate(()=>GB.preset(1));
  await press('complexes');
  if(phone)await closeFloats();
  await tapSel('#gb [data-gb="fv-frames"]'); await wait(p,500);
  let s=await shown(p);
  ok(s['L-patterns']&&s['L-addresses']&&s['T-cx']&&!s['T-hy']&&!s['T-sup']&&!s['L-domains'],'Frames honours the set '+JSON.stringify(s));
  await shot('8-frames');
  await press('saboteurs'); s=await shown(p);
  ok(!s['L-patterns']&&s['T-cx'],'Frames: saboteurs off, complexes stay');
  ok(s.looseThreads===0,'Frames: threads drawn to a hidden layer: '+s.looseThreads);
  await press('seats'); s=await shown(p);
  ok(!s['P-seats'],'Frames: seats off');
  if(phone)await closeFloats();
  await tapSel('#gb [data-gb="fv-dial"]'); await wait(p,500);
  s=await shown(p);
  ok(!s['L-patterns']&&s['T-cx']&&!s['P-seats'],'Dial keeps the same set '+JSON.stringify(s));
  await shot('9-dial');
  await tapSel('#gb [data-gb="fv-wheel"]'); await wait(p,300);

  /* 8. the folded form, opened */
  if(phone){await tapSel('#gb [data-gb=fold]'); await shot('10-folded-open'); await closeFloats();}
  else{await p.evaluate(()=>GB.opt('fold',true)); await tapSel('#gb [data-gb=fold]'); await shot('10-folded-open');
   await closeFloats(); await p.evaluate(()=>GB.opt('fold',null));}

  /* 9. the two geometry answers, same set, side by side */
  await p.evaluate(()=>GB.preset(0)); await shot('11-charge-makes-room');
  await p.evaluate(()=>GB.opt('room',false)); await shot('12-charge-holds-still');
  await p.evaluate(()=>GB.opt('room',true));

  /* 10. zoom under both answers. Only closer: nothing new appears. */
  const zoomTo=z=>p.evaluate(z=>{setZoom(z,CX,CY);},z);
  await p.evaluate(()=>GB.preset(1));
  await zoomTo(2.4); d=await drawn(p);
  ok(!d.cx,'only closer: zoom brought complexes in');
  await p.evaluate(()=>GB.opt('zoomAdds',true)); d=await drawn(p);
  const zc=await p.evaluate(()=>!!document.querySelector('#gb [data-gb=complexes].zoomed, #gb-panel [data-gb=complexes].zoomed'));
  ok(d.cx>0&&zc,'zoom adds: complexes drawn and marked as brought in by zoom');
  await shot('13-zoom-adds');
  await zoomTo(1); d=await drawn(p);
  ok(!d.cx,'zoom out: complexes went again '+JSON.stringify(await p.evaluate(()=>[S.zoom,GB.geomDepth(),Object.keys(GB.ON()).join(',')])));
  ok(d.sab>0,'zoom out took off something the person had on');
  await p.evaluate(()=>GB.opt('zoomAdds',false));

  /* 11. every lighting, so the glass is seen on each ground it has to sit on */
  if(!phone){await p.evaluate(()=>{GB.preset(2);setZoom(1,CX,CY);});
   for(const k of ['dark','snow','punch','glass','glasswhite','flat','lumen']){
    await p.evaluate(k=>setLighting(k),k); await wait(p,300);
    await p.mouse.move(W-6,H-6); await wait(p,300);
    await p.screenshot({path:`${OUT}/theme-${k}-${W}.png`,clip:{x:320,y:80,width:940,height:520}});}
   await p.evaluate(()=>setLighting('dark'));}
  ok(errs.length===0,'page errors: '+errs.join(' | '));
  facts[W]={errs};
  await ctx.close();}
 await b.close();
 console.log(passes+' checks passed, '+fails+' failed');
 process.exit(fails?1:0);})();
