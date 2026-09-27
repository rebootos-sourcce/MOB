/* Mobile walk. Not a gate: the evidence behind RESEARCH-mobile-gaps.md.

   Drives a built source.html at 390 by 844 as a phone: isMobile, hasTouch,
   device scale 2, so (pointer:coarse) matches and the app takes its phone
   branches. Every touch goes through the DevTools protocol's
   Input.dispatchTouchEvent, which is the same input pipeline a finger uses,
   so touch-action on an element is honoured and pointer events arrive with
   pointerType touch. A pinch is two touch points moving apart.

     ./atuned_src/BUILD.sh /tmp/m.html
     NODE_PATH=/opt/node22/lib/node_modules node proto/mobile/walk.js /tmp/m.html OUTDIR

   Prints one JSON line per measurement. Three parts:
     1. the landing, measured once, blank profile
     2. a gesture matrix: tap, pinch and hold on each of the three pictures of
        the Field, blank and loaded
     3. six walks, one fresh browser context per ICP, each on the path their
        own recorded words predict (RESEARCH-icp.md), ending on a real reading
     4. probes: every tooltip carrier in the first screen tapped once, and
        what the first screen of each tab carries

   The control counter is proto/firstrun/walk.js's, unchanged, so its numbers
   compare with that file's and with nothing else. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const SRC=path.resolve(process.argv[2]||'source.html'), OUT=process.argv[3]||'mobile-walk-out';
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const W=390,H=844;
const COUNT=`(()=>{const vh=innerHeight,vw=innerWidth;
 const els=[...document.querySelectorAll('a,button,input,select,textarea,[role=button],[role=switch],[tabindex]:not([tabindex="-1"]),summary')];
 const vis=els.filter(e=>{const r=e.getBoundingClientRect(),cs=getComputedStyle(e);
  return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'&&+cs.opacity>0.05
   &&r.bottom>0&&r.top<vh&&r.right>0&&r.left<vw&&!e.disabled;});
 const small=vis.filter(e=>{const r=e.getBoundingClientRect();return r.width<44||r.height<44;}).length;
 let t='';const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while((n=w.nextNode())){const el=n.parentElement;if(!el)continue;const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
  if(r.bottom>0&&r.top<vh&&r.width>0&&r.right>0&&r.left<vw&&cs.visibility!=='hidden'&&+cs.opacity>0.05)t+=' '+n.textContent;}
 return {controls:vis.length,under44:small,words:(t.match(/[A-Za-z]{2,}/g)||[]).length};})()`;
/* everything a gesture could change, read before and after it */
const STATE=`(()=>{const tip=document.getElementById('tip'),rd=document.getElementById('rdrill');
 const sc=document.scrollingElement.scrollTop+document.body.scrollTop;
 const tr=tip&&tip.classList.contains('on')?tip.getBoundingClientRect():null;
 const on=rd&&rd.style.display!=='none'&&rd.getBoundingClientRect().height>0;
 const rr=on?rd.getBoundingClientRect():null;
 return {view:typeof FVIEW!=='undefined'?FVIEW:null,zoom:+(S.zoom||1).toFixed(3),fz:typeof FZ!=='undefined'?+FZ.s.toFixed(3):null,
  vv:+visualViewport.scale.toFixed(3),scroll:Math.round(sc),
  tip:tr?{top:Math.round(tr.top),h:Math.round(tr.height),w:Math.round(tr.width),cover:+((Math.min(tr.bottom,innerHeight)-Math.max(tr.top,0))*Math.min(tr.width,innerWidth)/(innerWidth*innerHeight)).toFixed(2),
   txt:tip.innerText.replace(/\\s+/g,' ').slice(0,90)}:null,
  drill:on?{top:Math.round(rr.top),inView:rr.top<innerHeight&&rr.bottom>0,txt:rd.innerText.replace(/\\s+/g,' ').slice(0,70)}:null,
  pan:[Math.round(S.panx||0),Math.round(S.pany||0)],
  charge:JSON.stringify(S.charge),hist:(h=>h?{hiddenAttr:h.hidden,display:getComputedStyle(h).display,h:Math.round(h.getBoundingClientRect().height),
   undoHidden:document.getElementById('undobtn').hidden,undoShown:document.getElementById('undobtn').getBoundingClientRect().height>0}:null)(document.getElementById('histpair'))};})()`;
const STORY='My sister called again and I felt the old tightness in my chest. The same guilt, the same shame. I said yes when I meant no and then I was angry at myself all night.';
/* the six ICPs, RESEARCH-icp.md, with the psel index of their own worked example */
const ICP=[
 {who:'Diane',w:180,ex:'2'},{who:'Derek',w:170,ex:'5'},{who:'Marcus',w:160,ex:'3'},
 {who:'Angela',w:150,ex:'4'},{who:'Sofia',w:140,ex:'1'},{who:'James',w:100,ex:'6'}];
const log=o=>console.log(JSON.stringify(o));
async function fresh(b){
 const ctx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 const p=await ctx.newPage(); p.errs=[]; p.on('pageerror',e=>p.errs.push(e.message));
 const t0=Date.now(); await p.goto('file://'+SRC);
 await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000}).catch(()=>{});
 p.booted=Date.now()-t0; await p.waitForTimeout(1500);
 p.cdp=await ctx.newCDPSession(p); p.gest=0; return [ctx,p];}
const st=p=>p.evaluate(STATE);
/* one finger */
async function tap(p,x,y){p.gest++;
 await p.cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
 await p.waitForTimeout(60);
 await p.cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await p.waitForTimeout(700);}
async function hold(p,x,y,ms){p.gest++;
 await p.cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
 await p.waitForTimeout(ms);
 const during=await st(p);
 await p.cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await p.waitForTimeout(500); return during;}
/* a horizontal or vertical swipe with one finger */
async function swipe(p,x0,y0,x1,y1){p.gest++;
 await p.cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x0,y:y0,id:1}]});
 for(let i=1;i<=12;i++){await p.cdp.send('Input.dispatchTouchEvent',{type:'touchMove',
  touchPoints:[{x:x0+(x1-x0)*i/12,y:y0+(y1-y0)*i/12,id:1}]});await p.waitForTimeout(16);}
 await p.cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await p.waitForTimeout(600);}
/* two fingers down 60 apart, then apart to 240, the way a thumb and finger
   open a picture. The state is read with both fingers down, which is the
   moment he named: "the second that I put my fingers on it". */
async function pinch(p,cx,cy){p.gest++;
 const pts=d=>[{x:cx-d/2,y:cy,id:1},{x:cx+d/2,y:cy,id:2}];
 await p.cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:pts(60)});
 await p.waitForTimeout(120);
 const down=await st(p);
 for(let i=1;i<=15;i++){await p.cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:pts(60+180*i/15)});
  await p.waitForTimeout(20);}
 await p.cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await p.waitForTimeout(700); return down;}
/* the compositor's own pinch, the gesture the browser itself recognises.
   Bounded, because a gesture the page refuses can leave the call waiting. */
async function osPinch(p,cx,cy){
 return Promise.race([p.cdp.send('Input.synthesizePinchGesture',{x:cx,y:cy,scaleFactor:2,gestureSourceType:'touch'}).then(()=>'done'),
  new Promise(r=>setTimeout(()=>r('timeout'),5000))]);}
/* the hit table is rebuilt on the next frame, so wait for it: reading it at
   once aimed a tap at the 4x frame's coordinates, off the canvas, and read
   as a dead tap on the fixed build. The probe's bug, found and fixed. */
async function resetZoom(p){await p.evaluate(()=>{try{if(typeof FZ!=='undefined'){FZ={s:1,x:0,y:0};fzApply();}S.zoom=1;S.panx=0;S.pany=0;render();}catch(e){}});
 await p.waitForTimeout(400);}
/* the picture's box, whichever of the three is up */
const picBox=p=>p.evaluate(()=>{const e=FVIEW==='wheel'?document.getElementById('cv'):document.getElementById('frend');
 const r=e.getBoundingClientRect();return {x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height)};});
/* a real mark to press on the picture that is up: on the wheel an address
   off its own hit table, on a rendition the first small mark carrying a hit */
const markAt=p=>p.evaluate(()=>{
 if(FVIEW==='wheel'){const b=document.getElementById('cv').getBoundingClientRect();
  const nd=HIT.filter(h=>h.k==='node'&&h.n&&h.n.cf);
  const pt=h=>h.x!==undefined?[h.x,h.y]:[h.cx+Math.cos((h.a0+h.a1)/2)*(h.r0+h.r1)/2,h.cy+Math.sin((h.a0+h.a1)/2)*(h.r0+h.r1)/2];
  const h=nd.find(h=>{const q=pt(h);return q[1]>20&&q[1]<b.height-20&&q[0]>20&&q[0]<b.width-20;})||HIT.find(h=>h.x!==undefined);
  if(!h)return null;const q=pt(h);
  return {x:Math.round(b.left+q[0]),y:Math.round(b.top+q[1]),k:h.k+(h.n&&h.n.nm?':'+h.n.nm:'')};}
 const m=[...document.querySelectorAll('#frend [data-h]')].map(e=>({e,r:e.getBoundingClientRect()}))
  .filter(o=>o.r.width>4&&o.r.width<30&&o.r.height<30&&o.r.top>0&&o.r.bottom<innerHeight)[0];
 return m?{x:Math.round(m.r.left+m.r.width/2),y:Math.round(m.r.top+m.r.height/2),k:m.e.getAttribute('data-h')}:null;});
async function setView(p,v){await p.evaluate(v=>{const b=document.querySelector('#fview [data-fview="'+v+'"]');b&&b.click();},v);
 await p.waitForTimeout(1000);await p.evaluate(()=>{const t=document.getElementById('tip');t&&t.classList.remove('on');});}
/* loading a worked example the way the build offers it on a phone: the
   loader circle and its list where it exists (GF), the picker otherwise */
async function loadEx(p,v){
 const pb=await p.evaluate(()=>{const e=document.getElementById('ploadbtn');if(!e)return null;const r=e.getBoundingClientRect();
  return r.height?{x:r.left+r.width/2,y:r.top+r.height/2}:null;});
 if(!pb){await p.selectOption('#psel',v);await p.waitForTimeout(1500);p.loadTaps=1;return;}
 let taps=0;await tap(p,pb.x,pb.y);taps++;
 if(await p.evaluate(()=>document.getElementById('pload').hidden)){await tap(p,pb.x,pb.y);taps++;}
 const it=await p.evaluate(v=>{const e=document.querySelector('#pload [data-pv="'+v+'"]');e.scrollIntoView({block:'nearest'});const r=e.getBoundingClientRect();
  return {x:r.left+r.width/2,y:r.top+r.height/2};},v);
 await tap(p,it.x,it.y);taps++;
 if(await p.evaluate(v=>document.getElementById('psel').value!==v,v)){await tap(p,it.x,it.y);taps++;}
 p.gest+=0;p.loadTaps=taps;await p.waitForTimeout(1200);}
/* where a tab is, and whether a thumb can reach it without a swipe first */
const tabAt=(p,nm)=>p.evaluate(nm=>{const b=[...document.querySelectorAll('#tabbar button.tabtop')].find(e=>e.textContent.trim()===nm);
 const r=b.getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2),inView:r.left>=0&&r.right<=innerWidth,right:Math.round(r.right),left:Math.round(r.left)};},nm);
async function goTab(p,nm){
 const fold=await p.evaluate(()=>{const e=document.getElementById('navtog');if(!e)return null;const r=e.getBoundingClientRect();
  return r.height?{x:r.left+r.width/2,y:r.top+r.height/2}:null;});
 if(fold){let taps=0;
  if(await p.evaluate(()=>getComputedStyle(document.getElementById('tabbar')).display==='none')){await tap(p,fold.x,fold.y);taps++;}
  if(await p.evaluate(()=>getComputedStyle(document.getElementById('tabbar')).display==='none')){await tap(p,fold.x,fold.y);taps++;}
  const t=await tabAt(p,nm);await tap(p,t.x,t.y);taps++;
  const want=await p.evaluate(nm=>+[...document.querySelectorAll('#tabbar button.tabtop')].find(e=>e.textContent.trim()===nm).dataset.tabk,nm);
  if(await p.evaluate(()=>S.tab)!==want){await tap(p,t.x,t.y);taps++;}
  return {tab:nm,menu:'folded',swipes:0,taps,reached:(await p.evaluate(()=>S.tab))===want,scroll:(await st(p)).scroll};}
 let t=await tabAt(p,nm),swipes=0;
 while(!t.inView&&swipes<4){if(t.right>W)await swipe(p,300,t.y,60,t.y);else await swipe(p,60,t.y,300,t.y);swipes++;t=await tabAt(p,nm);}
 if(!t.inView){await p.evaluate(nm=>[...document.querySelectorAll('#tabbar button.tabtop')].find(e=>e.textContent.trim()===nm).scrollIntoView({inline:'center'}),nm);t=await tabAt(p,nm);}
 await tap(p,t.x,t.y);
 const now=await p.evaluate(()=>S.tab);
 /* the first tap on a carrier explains and the second acts, tip.js */
 let taps=1;const want=await p.evaluate(nm=>+[...document.querySelectorAll('#tabbar button.tabtop')].find(e=>e.textContent.trim()===nm).dataset.tabk,nm);
 if(now!==want){await tap(p,t.x,t.y);taps++;}
 const landed=await p.evaluate(()=>S.tab);
 return {tab:nm,swipes,taps,reached:landed===want,scroll:(await st(p)).scroll};}
/* the pole strip, "heaven and hell": its two ends against the picture, the
   stage and the fold */
const poles=p=>p.evaluate(()=>{const e=document.getElementById('pol2'),s=document.getElementById('stage');
 if(!e||getComputedStyle(e).display==='none'){
  /* GF moved them into the core: on the wheel they are hit records, on a
     rendition marks carrying the pole door */
  const pic=(FVIEW==='wheel'?document.getElementById('cv'):document.getElementById('frend')).getBoundingClientRect();
  if(FVIEW==='wheel'){const ph=HIT.filter(h=>h.k==='pole');
   return {strip:false,inCore:ph.map(h=>({end:h.end,y:Math.round(pic.top+h.y),diameter:Math.round(h.rad*2),insidePic:pic.top+h.y>pic.top&&pic.top+h.y<pic.bottom}))};}
  return {strip:false,rendition:'read off the screenshot'};}
 const r=e.getBoundingClientRect(),sr=s.getBoundingClientRect(),sv=e.querySelector('svg').getBoundingClientRect();
 const pic=(FVIEW==='wheel'?document.getElementById('cv'):document.getElementById('frend')).getBoundingClientRect();
 return {top:Math.round(r.top),bottom:Math.round(r.bottom),svgBottom:Math.round(sv.bottom),stageBottom:Math.round(sr.bottom),
  picBottom:Math.round(pic.bottom),fold:innerHeight,pastFold:Math.round(r.bottom-innerHeight),pastStage:Math.round(r.bottom-sr.bottom),
  insidePic:r.top>=pic.top&&r.bottom<=pic.bottom};});
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:EXE});
 const shot=(p,n)=>p.screenshot({path:`${OUT}/${n}.png`});
 /* ---------- 1. the landing ---------- */
 {const [ctx,p]=await fresh(b);
  const geo=await p.evaluate(()=>{const R=id=>{const e=document.getElementById(id);if(!e)return null;const r=e.getBoundingClientRect();
    return r.height?{top:Math.round(r.top),bottom:Math.round(r.bottom),h:Math.round(r.height),w:Math.round(r.width)}:null;};
   const tabs=[...document.querySelectorAll('#tabbar button.tabtop')];
   const tb=document.getElementById('tabbar');
   const opts=[...document.querySelectorAll('#psel option')].map(o=>o.textContent);
   const ps=document.getElementById('psel'),cs=getComputedStyle(ps),cv=document.createElement('canvas').getContext('2d');
   cv.font=cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily;
   const inner=ps.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
   const fd=document.getElementById('fdock');
   const circ=[...fd.querySelectorAll('#key > *,#keylo > *,#acc > *')].map(e=>{const r=e.getBoundingClientRect();return Math.round(r.width)+'x'+Math.round(r.height);});
   return {tabs:tabs.length,tabsInView:tabs.filter(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}).map(e=>e.textContent.trim()),
    tabRows:new Set(tabs.map(e=>Math.round(e.getBoundingClientRect().top))).size,
    tabbarScroll:tb.scrollWidth+'/'+tb.clientWidth,tabMask:getComputedStyle(tb).maskImage||getComputedStyle(tb).webkitMaskImage,
    stage:R('stage'),picture:R('cv'),fbar:R('fbar'),fview:R('fview'),fzoom:R('fzoom'),lcol:R('lcol'),fdock:R('fdock'),
    lightbtn:R('lightbtn'),helpbtn:R('helpbtn'),profbtn:R('profbtn'),psel:R('psel'),histpair:R('histpair'),navtog:R('navtog'),ploadbtn:R('ploadbtn'),
    reSection:(e=>{const r=e.getBoundingClientRect();return {top:Math.round(r.top),h:Math.round(r.height)};})(document.querySelector('.lsec.re')),
    dockCircles:circ,
    optChars:opts.map(o=>o.length),optPxMax:Math.round(Math.max(...opts.map(o=>cv.measureText(o).width))),pselInner:Math.round(inner),
    optsWiderThanSelect:opts.filter(o=>cv.measureText(o).width>inner).length,
    docScroll:document.body.scrollHeight};});
  log({part:'landing',bootedMs:p.booted,...(await p.evaluate(COUNT)),...geo,hist:(await st(p)).hist,poles:await poles(p)});
  await shot(p,'01-landing-blank');
  /* what the first viewport says the thing is for */
  log({part:'landing-words',text:await p.evaluate(()=>{let t='';const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
   while((n=w.nextNode())){const el=n.parentElement;const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
    if(r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth&&r.width>0&&cs.visibility!=='hidden'&&+cs.opacity>0.05&&n.textContent.trim())t+=' | '+n.textContent.trim();}return t.slice(0,400);})});
  await ctx.close();}
 /* ---------- 2. the gesture matrix ----------
    One fresh context per picture and per state, so a page zoom left by one
    pinch can never be read as the next one's result. */
 for(const loaded of [false,true]) for(const v of ['wheel','frames','dial']){
  let [ctx,p]=await fresh(b);
  if(loaded)await loadEx(p,'3');
  await setView(p,v);
  const box=await picBox(p);const cx=box.x+box.w/2,cy=box.y+box.h/2;
  const before=await st(p);
  const down=await pinch(p,cx,cy);
  const after=await st(p);
  log({part:'pinch',loaded,view:v,box,
   tipWithFingersDown:down.tip,drillWithFingersDown:!!down.drill,
   appZoom:[before.zoom,after.zoom],frameZoom:[before.fz,after.fz],pageScale:[before.vv,after.vv],pan:[before.pan,after.pan],
   scrolled:after.scroll-before.scroll,chargeChanged:before.charge!==after.charge,tipAfter:after.tip,drillAfter:!!after.drill,
   /* what fills the screen afterwards: share of the visible area each box takes */
   onScreen:await p.evaluate(()=>{const v=visualViewport,see={l:v.offsetLeft,t:v.offsetTop,r:v.offsetLeft+v.width,b:v.offsetTop+v.height};
    const ov=id=>{const r=document.getElementById(id).getBoundingClientRect();
     return +(Math.max(0,Math.min(see.r,r.right)-Math.max(see.l,r.left))*Math.max(0,Math.min(see.b,r.bottom)-Math.max(see.t,r.top))/(v.width*v.height)).toFixed(2);};
    return {offset:[Math.round(v.offsetLeft),Math.round(v.offsetTop)],size:[Math.round(v.width),Math.round(v.height)],
     picture:ov(FVIEW==='wheel'?'cv':'frend'),glassBar:ov('fbar'),viewSwitch:ov('fview')};})});
  await shot(p,'02-pinch-'+(loaded?'loaded':'blank')+'-'+v);
  await ctx.close();
  /* the compositor's own pinch, in a context nothing has zoomed */
  [ctx,p]=await fresh(b); if(loaded)await loadEx(p,'3'); await setView(p,v);
  const b2=await st(p);const os=await osPinch(p,cx,cy);await p.waitForTimeout(600);const a2=await st(p);
  log({part:'os-pinch',loaded,view:v,result:os,appZoom:[b2.zoom,a2.zoom],frameZoom:[b2.fz,a2.fz],pageScale:[b2.vv,a2.vv]});
  await ctx.close();
  [ctx,p]=await fresh(b); if(loaded)await loadEx(p,'3'); await setView(p,v);
  /* the zoom that does work: the + circle in the lower right */
  const zin=await p.evaluate(()=>{const e=[...document.querySelectorAll('#fzoom button')][1];const r=e.getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2),inView:r.bottom<=innerHeight};});
  const b3=await st(p);await tap(p,zin.x,zin.y);let a3=await st(p);let taps=1;
  if(a3.zoom===b3.zoom&&a3.fz===b3.fz){await tap(p,zin.x,zin.y);a3=await st(p);taps++;}
  log({part:'zoom-button',loaded,view:v,taps,inView:zin.inView,appZoom:[b3.zoom,a3.zoom],frameZoom:[b3.fz,a3.fz]});
  await resetZoom(p);
  /* a tap on a real mark, and where its reading opens */
  const m=await markAt(p);
  if(m){const w0=await p.evaluate(COUNT);const b4=await st(p);await tap(p,m.x,m.y);const a4=await st(p);const w1=await p.evaluate(COUNT);
   log({part:'tap-mark',loaded,view:v,mark:m,tip:a4.tip,drill:a4.drill,drillBefore:!!b4.drill,scrolled:a4.scroll-b4.scroll,
    wordsInView:[w0.words,w1.words],chargeChanged:b4.charge!==a4.charge});
   if(loaded&&v==='frames')await shot(p,'03-after-tap-mark-frames');}
  log({part:'poles',loaded,view:v,...(await poles(p))});
  if(loaded&&v!=='wheel'){await p.evaluate(()=>document.getElementById('pol2').scrollIntoView({block:'end'}));
   await p.waitForTimeout(400);await shot(p,'04-poles-'+v);}
  /* the readings dock: tap CQ, then hold it a second and a half */
  if(loaded&&v==='wheel'){
   await p.evaluate(()=>document.getElementById('fdock').scrollIntoView({block:'center'}));await p.waitForTimeout(500);
   const cq=await p.evaluate(()=>{const e=document.querySelector('#key > *');const r=e.getBoundingClientRect();
    return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2),label:e.innerText.replace(/\s+/g,' ').slice(0,30)};});
   await shot(p,'05-readings-dock');
   const t0=await st(p);await tap(p,cq.x,cq.y);const t1=await st(p);
   await tap(p,cq.x,cq.y);const t1b=await st(p);
   log({part:'cq-tap',...cq,firstTap:{tip:t1.tip,drillChanged:JSON.stringify(t1.drill)!==JSON.stringify(t0.drill)},
    secondTap:{drill:t1b.drill,drillChanged:JSON.stringify(t1b.drill)!==JSON.stringify(t1.drill)},scrolled:t1b.scroll-t0.scroll});
   await ctx.close();[ctx,p]=await fresh(b);await loadEx(p,'3');
   await p.evaluate(()=>document.getElementById('fdock').scrollIntoView({block:'center'}));await p.waitForTimeout(500);
   const during=await hold(p,cq.x,cq.y,1500);const t2=await st(p);
   log({part:'cq-hold-1500ms',tipAt1500:during.tip,drillAt1500:during.drill,tipAfterLift:t2.tip,drillAfterLift:t2.drill});}
  if(p.errs.length)log({part:'matrix-errors',loaded,view:v,errors:p.errs});await ctx.close();}
 /* ---------- 3. six walks ---------- */
 const walks={
  /* group chat, knows the word Story */
  Angela:async p=>{const s=[];s.push(await goTab(p,'Story'));
   await p.locator('#sttext').fill(STORY);await p.waitForTimeout(700);
   const ap=await p.evaluate(()=>{const e=document.getElementById('stapply');const r=e.getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2),inView:r.top>=0&&r.bottom<=innerHeight};});
   if(!ap.inView){await p.evaluate(()=>document.getElementById('stapply').scrollIntoView({block:'center'}));}
   const ap2=await p.evaluate(()=>{const r=document.getElementById('stapply').getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2)};});
   await tap(p,ap2.x,ap2.y);if(await p.evaluate(()=>!document.getElementById('sttext').value.length?false:true))await tap(p,ap2.x,ap2.y);
   s.push({commitInViewAfterTyping:ap.inView});
   s.push(await goTab(p,'Field'));return s;},
  /* between meetings: straight at the picture */
  Diane:async p=>{return [];},
  /* wants the limiter, starts at the first tab */
  Derek:async p=>{const s=[await goTab(p,'Energetics')];
   s.push({energeticsFirstQuestionTop:await p.evaluate(()=>{const q=document.querySelector('#iq .iq-q, #iq input[type=range], #iq .qrow');return q?Math.round(q.getBoundingClientRect().top):null;})});
   s.push(await goTab(p,'Field'));return s;},
  /* tests the instrument: the other two pictures */
  Marcus:async p=>{await setView(p,'frames');p.gest++;return [{view:'frames'}];},
  /* eleven at night, wants what to run */
  Sofia:async p=>{const s=[await goTab(p,'Ritual')];s.push(await goTab(p,'Field'));return s;},
  /* opens Summary because it says it is the summary */
  James:async p=>{const s=[await goTab(p,'Summary')];s.push(await goTab(p,'Field'));return s;}};
 for(const icp of ICP){
  const [ctx,p]=await fresh(b);
  const land=await p.evaluate(COUNT);
  const path_=await walks[icp.who](p);
  /* a real reading: the worked example that is them, through the picker.
     Angela's is her own committed story, and she loads nothing. */
  if(icp.who!=='Angela'){const g0=p.gest;await loadEx(p,icp.ex);if(p.gest===g0)p.gest++;}
  const box=await picBox(p);
  const down=await pinch(p,box.x+box.w/2,box.y+box.h/2);const afterPinch=await st(p);
  await resetZoom(p);
  await p.evaluate(()=>{const t=document.getElementById('tip');t&&t.classList.remove('on');});
  const m=await markAt(p);let tapRes=null;
  if(m){await tap(p,m.x,m.y);tapRes=await st(p);}
  const reading=await p.evaluate(()=>{const r=compute();return {unread:!!r.unread,CQ:Math.round(r.CQ),DQ:Math.round(r.DQ),loaded:r.loaded.length};});
  const end=await p.evaluate(COUNT);
  await shot(p,'06-walk-'+icp.who.toLowerCase());
  log({part:'walk',who:icp.who,weight:icp.w,landing:land,path:path_,view:await p.evaluate(()=>FVIEW),
   pinch:{tipWithFingersDown:!!down.tip,tipCover:down.tip?down.tip.cover:0,tipText:down.tip?down.tip.txt:null,zoomMoved:afterPinch.zoom!==1||afterPinch.fz!==1,pageScale:afterPinch.vv},
   tapMark:m?{kind:m.k,drill:tapRes.drill,tip:tapRes.tip?tapRes.tip.txt:null}:null,
   reading,gestures:p.gest,end,errors:p.errs});
  await ctx.close();}
 /* ---------- 4. probes ---------- */
 /* every tooltip carrier in the first screen, tapped once: is the
    explanation still up after the finger lifts, and did the tap act */
 {let [ctx,p]=await fresh(b);await loadEx(p,'2');
  const tip=()=>p.evaluate(()=>{const t=document.getElementById('tip');return !!(t&&t.classList.contains('on'));});
  const n=await p.evaluate(()=>{window.__c=[...document.querySelectorAll('[data-tip],[data-tip-t],[title]')].filter(e=>{const r=e.getBoundingClientRect();
   return r.height>0&&r.top>0&&r.bottom<innerHeight&&r.left>=0&&r.right<=innerWidth;});return window.__c.length;});
  const rows=[];
  for(let i=0;i<n;i++){const q=await p.evaluate(i=>{const e=window.__c[i];if(!e.isConnected)return null;const r=e.getBoundingClientRect();
    return {x:r.left+r.width/2,y:r.top+r.height/2,id:(e.id||e.getAttribute('aria-label')||e.tagName).toString().slice(0,24)};},i);
   if(!q)continue;
   const opened=()=>p.evaluate(()=>({help:!document.getElementById('sheet').hidden,light:!document.getElementById('lightmenu').hidden,
    settings:getComputedStyle(document.getElementById('settings')).display!=='none'}));
   const o0=JSON.stringify(await opened());
   const press=async()=>{await p.cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:q.x,y:q.y,id:1}]});await p.waitForTimeout(150);const d=await tip();
    await p.cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(60);const a60=await tip();
    await p.waitForTimeout(340);const a400=await tip();return [d,a60,a400];};
   const [d,a60,a400]=await press();const acted1=JSON.stringify(await opened())!==o0;
   let acted2=null;if(!acted1){await press();await p.waitForTimeout(300);acted2=JSON.stringify(await opened())!==o0;}
   rows.push({el:q.id,shownDuringPress:d,up60msAfterLift:a60,up400msAfterLift:a400,actedOnFirstTap:acted1,actedOnSecondTap:acted2});
   await ctx.close();[ctx,p]=await fresh(b);await loadEx(p,'2');
   await p.evaluate(()=>{window.__c=[...document.querySelectorAll('[data-tip],[data-tip-t],[title]')].filter(e=>{const r=e.getBoundingClientRect();
    return r.height>0&&r.top>0&&r.bottom<innerHeight&&r.left>=0&&r.right<=innerWidth;});});}
  log({part:'tip-on-lift',carriers:rows.length,rows});await ctx.close();}
 /* each tab at 390 on a loaded profile: what the first screen of it carries */
 {const [ctx,p]=await fresh(b);await loadEx(p,'2');
  const tabs=await p.evaluate(()=>[...document.querySelectorAll('#tabbar button.tabtop')].map(e=>[e.textContent.trim(),+e.dataset.tabk]));
  for(const [nm,k] of tabs){await p.evaluate(k=>{setTab(k);document.body.scrollTop=0;document.scrollingElement.scrollTop=0;},k);await p.waitForTimeout(900);
   const c=await p.evaluate(COUNT);
   const r=await p.evaluate(()=>{let t='';const w=document.createTreeWalker(document.getElementById('stage'),NodeFilter.SHOW_TEXT);let n;
    while((n=w.nextNode())){const el=n.parentElement;const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
     if(r.bottom>0&&r.top<innerHeight&&r.width>0&&cs.visibility!=='hidden'&&+cs.opacity>0.05&&n.textContent.trim())t+=' | '+n.textContent.trim();}
    return {docH:document.body.scrollHeight,text:t.slice(0,160)};});
   log({part:'tab',tab:nm,...c,...r});}
  await ctx.close();}
 await b.close();
})();
