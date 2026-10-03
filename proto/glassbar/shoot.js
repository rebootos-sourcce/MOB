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
  /* the product catches a failed rendition and says so on the console, which
     is exactly how this prototype's own first cut of the flush frame failed */
  p.on('console',m=>{if(m.type()==='error'&&/atuned|attribute/.test(m.text()))errs.push(m.text().slice(0,160));});
  await p.goto(PAGE);
  await p.waitForFunction(()=>document.documentElement.getAttribute('data-gb-ready')==='1',null,{timeout:30000});
  await wait(p,1200);
  const tapSel=async sel=>{const e=await p.$(sel);if(!e)throw new Error('no such element: '+sel);
   /* the renditions live in the right rail now, which on a phone is a long
      way down the page, so a press goes where a thumb would have to go */
   const fixed=await e.evaluate(n=>!!n.closest('.gb-float'));
   if(!fixed)await e.scrollIntoViewIfNeeded(); const bx=await e.boundingBox();
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
  const shot=async nm=>{if(!phone)await p.mouse.move(W-6,H-6);
   /* on a phone, a press in the rail leaves the page scrolled to the rail;
      the picture is what is being shown, so it is brought back first */
   else await p.evaluate(()=>{if(document.querySelector('.gb-float.open'))return;
    const e=document.getElementById(FVIEW==='wheel'?'cv':'frend');if(e)e.scrollIntoView({block:'center'});});
   await wait(p,450);
   await p.screenshot({path:`${OUT}/${nm}-${W}.png`});};

  /* 0. every target on the floor, the bar's and the rail's */
  const small=await p.evaluate(()=>[...document.querySelectorAll('#gb .gb-b, #gb-rend .gb-b')].filter(e=>e.offsetParent)
   .map(e=>{const r=e.getBoundingClientRect();return [e.getAttribute('data-gb'),r.width,r.height];})
   .filter(x=>x[1]<44||x[2]<44));
  ok(small.length===0,'targets under 44: '+JSON.stringify(small));
  ok(await p.evaluate(()=>getComputedStyle(document.getElementById('subbar')).display==='none'),'the depth row is still showing');
  /* Wheel, Frames, Dial: off the centre pane, in the right rail under its
     top line, icon only */
  const rp=await p.evaluate(()=>{const r=document.getElementById('gb-rend');
   return {inBar:!!document.querySelector('#gb [data-gb^="fv-"]'),inStage:!!document.querySelector('.stage [data-gb^="fv-"]'),
    afterTop:!!r&&r.previousElementSibling&&r.previousElementSibling.id==='railtop',
    words:r?r.innerText.trim():'x',n:r?r.querySelectorAll('.gb-b').length:0};});
  ok(!rp.inBar&&!rp.inStage&&rp.afterTop&&rp.n===3,'renditions in the rail under the top line '+JSON.stringify(rp));
  ok(rp.words==='','renditions carry words: '+rp.words);
  /* the circle, the ring and the value, off this person's own reading. The
     numbers the product already prints elsewhere must be the same numbers. */
  const vc=await p.evaluate(()=>{const r=compute(),o={};
   const pill=k=>{const e=document.querySelector('#gb .gb-full [data-gb='+k+'] .gb-v');return e?e.textContent:null;};
   const ring=k=>{const e=document.querySelector('#gb .gb-full [data-gb='+k+'] .val');return e?parseFloat(e.getAttribute('stroke-dasharray')):null;};
   o.missing=GB.LAYERS.filter(l=>!pill(l.k)).map(l=>l.k);
   o.sq=[pill('addresses'),r.SQm.toFixed(1)]; o.cq=[pill('laws'),Math.round(r.CQ)+'%']; o.dq=[pill('shadow'),Math.round(r.DQ)+'%'];
   o.heavy=[pill('seats'),r.darkV.toFixed(1)];
   o.tiers=[[pill('saboteurs'),pill('complexes'),pill('hyper'),pill('character')].join(','),[r.sabs.length,r.cxs.length,r.hys.length,r.sups.length].join(',')];
   o.ringSQ=[ring('addresses'),+(r.SQm*10).toFixed(1)];
   o.all=Object.fromEntries(GB.LAYERS.map(l=>[l.k,pill(l.k)+' ring '+ring(l.k)]));
   return o;});
  ok(vc.missing.length===0,'orbs with no value: '+vc.missing);
  ['sq','cq','dq','heavy','tiers','ringSQ'].forEach(k=>ok(String(vc[k][0])===String(vc[k][1]),'value '+k+' reads '+vc[k][0]+', the product says '+vc[k][1]));
  facts['vals-'+W]=vc.all;

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
  await tapSel('#gb-rend [data-gb="fv-frames"]'); await wait(p,500);
  let s=await shown(p);
  ok(s['L-patterns']&&s['L-addresses']&&s['T-cx']&&!s['T-hy']&&!s['T-sup']&&!s['L-domains'],'Frames honours the set '+JSON.stringify(s));
  await shot('8-frames');
  await press('saboteurs'); s=await shown(p);
  ok(!s['L-patterns']&&s['T-cx'],'Frames: saboteurs off, complexes stay');
  ok(s.looseThreads===0,'Frames: threads drawn to a hidden layer: '+s.looseThreads);
  await press('seats'); s=await shown(p);
  ok(!s['P-seats'],'Frames: seats off');
  if(phone)await closeFloats();
  await tapSel('#gb-rend [data-gb="fv-dial"]'); await wait(p,500);
  s=await shown(p);
  ok(!s['L-patterns']&&s['T-cx']&&!s['P-seats'],'Dial keeps the same set '+JSON.stringify(s));
  await shot('9-dial');
  await tapSel('#gb-rend [data-gb="fv-wheel"]'); await wait(p,300);

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

  /* 11. Frames and Dial zoom, and F reframes. His words: "with the frame, I
     want to be able to zoom in and out, and then hit the F key and have it
     reframe." Real input: the scroll wheel over the picture, the key. */
  await tapSel('#gb-rend [data-gb="fv-frames"]'); await wait(p,400);
  if(phone)await p.evaluate(()=>document.getElementById('frend').scrollIntoView({block:'center'}));
  const fr=await p.evaluate(()=>{const r=document.getElementById('frend').getBoundingClientRect();return {x:r.left+r.width*.3,y:r.top+r.height*.3};});
  if(!phone){await p.mouse.move(fr.x,fr.y); for(let i=0;i<6;i++){await p.mouse.wheel(0,-120);await wait(p,40);}}
  else{await tapSel('#gb [data-gb=zin]');await tapSel('#gb [data-gb=zin]');}
  await wait(p,200);
  let z=await p.evaluate(()=>({s:GB.zoom().s,tf:(document.querySelector('#frend .frsvg')||{}).style.transform||'',pill:document.querySelector('#gb [data-gb=zfit] .gb-v').textContent}));
  ok(z.s>1.4&&/scale/.test(z.tf),'Frames did not zoom '+JSON.stringify(z));
  ok(z.pill===z.s.toFixed(1)+'\u00d7','the reframe circle does not say how far in '+JSON.stringify(z));
  await shot('15-frames-zoomed');
  /* the picture is rebuilt when a layer changes; the zoom must survive it */
  await p.evaluate(()=>{FR_SIG=null;render();}); await wait(p,200);
  ok(/scale/.test(await p.evaluate(()=>document.querySelector('#frend .frsvg').style.transform)),'zoom lost when the picture was rebuilt');
  if(!phone){await p.keyboard.press('f');}else{await tapSel('#gb [data-gb=zfit]');}
  await wait(p,200);
  z=await p.evaluate(()=>({s:GB.zoom().s,tf:document.querySelector('#frend .frsvg').style.transform}));
  ok(z.s===1&&!z.tf,'F did not reframe '+JSON.stringify(z));
  if(!phone){await p.keyboard.press('=');await p.keyboard.press('=');
   ok(await p.evaluate(()=>GB.zoom().s)>1.5,'plus did not zoom Frames');
   await p.keyboard.press('f');}
  /* the frame is flush: the outer ring touches its own box on all four sides */
  /* measured on the outermost band, so the domains are put on for the reading */
  await p.evaluate(()=>GB.set('domains',1)); await wait(p,200);
  const fl=await p.evaluate(()=>{const sv=document.querySelector('#frend .frsvg'),g=sv.querySelector('.L-domains');
   const b=g.getBBox(),W=+sv.getAttribute('width'),H=+sv.getAttribute('height');
   return {l:+b.x.toFixed(1),t:+b.y.toFixed(1),r:+(W-b.x-b.width).toFixed(1),b:+(H-b.y-b.height).toFixed(1)};});
  ok(fl.l<=1&&fl.t<=1&&fl.r<=1&&fl.b<=1,'the frame is not flush to its box '+JSON.stringify(fl));
  /* and square at the corner: the band reaches within a pixel of the box's own corner */
  /* square at the corner, read off the geometry rather than a pixel probe:
     the outer ring's point on the bearing to the box's corner, against the
     corner itself */
  const sq=await p.evaluate(()=>{const sv=document.querySelector('#frend .frsvg');const W=+sv.getAttribute('width'),H=+sv.getAttribute('height');
   const w={a:W/2,b:H/2},R=frRing(W/2,H/2,W/2,H/2,GB_NS(0,w)),q=R.at(Math.atan2(H/2,W/2));
   const old=frRing(W/2,H/2,W/2-8,H/2-8,12).at(Math.atan2(H/2,W/2));
   return {now:+Math.hypot(W-q.x,H-q.y).toFixed(2),shipped:+Math.hypot(W-old.x,H-old.y).toFixed(2)};});
  facts['corner-'+W]=sq;
  ok(sq.now<=1.5,'a frame corner is still rounded, '+sq.now+' px short of the box corner (shipped '+sq.shipped+')');
  facts['flushbox-'+W]=await p.evaluate(()=>{const f=document.getElementById('frend').getBoundingClientRect(),s=document.getElementById('stage').getBoundingClientRect();
   return {frame:[Math.round(f.left-s.left),Math.round(f.top-s.top),Math.round(s.right-f.right),Math.round(s.bottom-f.bottom)]};});
  await p.evaluate(()=>GB.set('domains',0));
  /* CQ over DQ, one centre line, CQ the larger figure */
  const cd=await p.evaluate(()=>{const tx=[...document.querySelectorAll('#frend .frsvg g text')].filter(t=>/^(\d+|CQ|DQ)$/.test(t.textContent.trim()));
   const f=s=>tx.find(t=>t.textContent.trim()===s);const cq=String(Math.round(compute().CQ)),dq=String(Math.round(compute().DQ));
   const a=f(cq),b=f(dq),la=f('CQ'),lb=f('DQ');
   /* on a phone the hole is too small for a stack, so each figure and its
      letters are one centred line: the same pair, set as two rows */
   if(!a||!b||!la||!lb){const all=[...document.querySelectorAll('#frend .frsvg g text')];
    const rc=all.find(t=>t.textContent.trim()===cq+'CQ'),rd=all.find(t=>t.textContent.trim()===dq+'DQ');
    if(!rc||!rd)return null;const X=e=>{const r=e.getBBox();return +(r.x+r.width/2).toFixed(1);};
    return {rows:true,cqSize:+rc.firstChild.getAttribute('font-size'),dqSize:+rd.firstChild.getAttribute('font-size'),
     xs:[+rc.getAttribute('x'),+rd.getAttribute('x')],order:[rc.getBBox().y<rd.getBBox().y]};}
   const X=e=>{const r=e.getBBox();return +(r.x+r.width/2).toFixed(1);};
   return {cqSize:+a.getAttribute('font-size'),dqSize:+b.getAttribute('font-size'),xs:[X(a),X(la),X(b),X(lb)],
    order:[a.getBBox().y<la.getBBox().y,la.getBBox().y<b.getBBox().y,b.getBBox().y<lb.getBBox().y]};});
  ok(cd&&cd.cqSize>cd.dqSize*(cd.rows?1.3:1.8)&&Math.max(...cd.xs)-Math.min(...cd.xs)<=1.5&&cd.order.every(Boolean),'CQ and DQ are not a centred pair '+JSON.stringify(cd));
  await shot('16-frames-flush');
  await tapSel('#gb-rend [data-gb="fv-wheel"]'); await wait(p,300);
  /* the same controls answer on the Wheel */
  const z0=await p.evaluate(()=>S.zoom); await tapSel('#gb [data-gb=zin]');
  ok(await p.evaluate(()=>S.zoom)>z0,'zoom in did nothing on the Wheel');
  await tapSel('#gb [data-gb=zfit]'); const zz=await p.evaluate(()=>({z:S.zoom,top:(()=>{const e=document.querySelector('#gb [data-gb=zfit]').getBoundingClientRect();const t=document.elementFromPoint(e.left+e.width/2,e.top+e.height/2);const bt=t&&t.closest('button,[id]');return (t?(bt?(bt.id||bt.getAttribute('data-gb')||bt.className):'none')+'':'');})()}));
  ok(zz.z===1,'reframe did nothing on the Wheel '+JSON.stringify(zz));

  /* 12. the readings left the foot of the stage for the left rail, as circles */
  const dk=await p.evaluate(()=>{const d=document.getElementById('fdock'),w=document.getElementById('gb-dock');
   const c=q=>{const e=document.querySelector('#gb-dock .kb[data-q='+q+'] .cr .ring').getBoundingClientRect();return {x:e.left+e.width/2,y:e.top+e.height/2,w:e.width};};
   const v=q=>parseFloat(getComputedStyle(document.querySelector('#gb-dock .kb[data-q='+q+'] .cr .v')).fontSize);
   return {inRail:!!w&&w.contains(d)&&!!d.closest('.col')&&!d.closest('.stage'),
    rings:document.querySelectorAll('#gb-dock .cr').length,
    cq:c('cq'),dq:c('dq'),sq:c('sq'),vcq:v('cq'),vdq:v('dq'),
    vb:[...document.querySelectorAll('#gb-dock svg.arc')].every(s=>s.getAttribute('viewBox'))};});
  ok(dk.inRail,'the readings are not in the left rail');
  ok(dk.rings===8&&dk.vb,'the rail has '+dk.rings+' reading circles, all scaled '+dk.vb);
  ok(Math.abs((dk.cq.x-dk.dq.x)-(dk.sq.x-dk.cq.x))<=2&&Math.abs(dk.dq.y-dk.sq.y)<=1&&Math.abs(dk.cq.y-dk.dq.y)<=2,
   'DQ and SQ do not stand symmetric about CQ '+JSON.stringify([dk.dq,dk.cq,dk.sq]));
  ok(dk.cq.w>dk.dq.w*1.5&&dk.vcq>=dk.vdq*1.7,'CQ is not the largest figure '+JSON.stringify([dk.cq.w,dk.dq.w,dk.vcq,dk.vdq]));
  /* and the small capsule mimicking the halo and pitchfork is gone, the scale stays */
  const pc=await p.evaluate(()=>{const sw=document.querySelector('.pol2-sw');return {sw:sw?getComputedStyle(sw).display:'none',
   mk:!!document.querySelector('.pol2-mk')};});
  ok(pc.sw==='none'&&pc.mk,'the capsule beside the marker still shows '+JSON.stringify(pc));
  if(!phone){await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:`${OUT}/17-left-readings-${W}.png`,clip:{x:0,y:80,width:330,height:340}});}

  /* 11. every lighting, so the glass is seen on each ground it has to sit on */
  if(!phone){await p.evaluate(()=>{GB.preset(2);setZoom(1,CX,CY);});
   for(const k of ['dark','snow','punch','glass','glasswhite','flat','lumen']){
    await p.evaluate(k=>setLighting(k),k); await wait(p,300);
    await p.mouse.move(W-6,H-6); await wait(p,300);
    await p.screenshot({path:`${OUT}/theme-${k}-${W}.png`,clip:{x:320,y:80,width:940,height:520}});}
   await p.evaluate(()=>setLighting('dark'));}
  /* 12. a stranger: nothing read, so every ring is empty and every pill a dash */
  await p.goto('about:blank'); await p.goto(PAGE+'#blank');
  await p.waitForFunction(()=>document.documentElement.getAttribute('data-gb-ready')==='1',null,{timeout:30000});
  await wait(p,900);
  const bl=await p.evaluate(()=>GB.LAYERS.map(l=>{const b=document.querySelector('#gb [data-gb='+l.k+'], #gb-panel [data-gb='+l.k+']');
   return [l.k,b.querySelector('.gb-v').textContent,parseFloat(b.querySelector('.val').getAttribute('stroke-dasharray'))];}));
  ok(bl.every(x=>x[1]==='\u2013'&&x[2]===0),'blank profile prints a figure: '+JSON.stringify(bl.filter(x=>x[1]!=='\u2013'||x[2]!==0)));
  await shot('16-blank');
  ok(errs.length===0,'page errors: '+errs.join(' | '));
  facts[W]={errs};
  await ctx.close();}
 await b.close();
 fs.writeFileSync(path.join(OUT,'values.json'),JSON.stringify(facts,null,1));
 console.log(passes+' checks passed, '+fails+' failed');
 process.exit(fails?1:0);})();
