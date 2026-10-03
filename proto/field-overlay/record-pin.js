/* RECORD THE PIN AND THE ZOOM. DB in TASKS.md.

   Same method as record-hover.js: pin.html runs on a virtual clock (rec=1),
   stepped one sixtieth of a second at a time, so every frame is the frame
   the design asks for whatever this machine manages. The control is real:
   a real mouse on a desktop, real touches through the browser's own touch
   input on a phone, two of them for a pinch. The page's own handlers do the
   rest. After every action the recorder asks the page what it holds, what
   is pinned and how far it is zoomed, and prints it, so a recording that
   landed on the wrong line says so.

   Three recordings, each one story:
     pin-desk-<who>    1600 wide, close up. Rest on the hottest line, the
                       chain traces and hums. Click: pinned. Away: it stays,
                       breathing. A second chain, pinned. Back onto the
                       first: it traces again over itself and hums. Click:
                       let go, and it rings. Away.
     pin-phone-<who>   390 wide, touch. Tap the hottest line, tap Pin, tap
                       off it: it stays. Pinch into a knot where the next
                       line sits 2 pixels from its neighbour, tap it, pin
                       it, and Whole field brings both back.
     zoom-desk-<who>   1600 wide, close up. Scroll in at the pointer, drag
                       and let it glide, double click out, double click into
                       a region, Whole field.

   Writes into rec/: <tag>.webm at 60 a second, the true motion; <tag>.gif at
   30 a second, 520 across; <tag>-strip.png, the phases with their times.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/field-overlay/record-pin.js [who] [scenes] */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs'),cp=require('child_process');
const DIR=__dirname,OUT=path.join(DIR,'rec');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FF='/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux';
const WHO=process.argv[2]||'James';
const ONLY=(process.argv[3]||'desk,phone,zoom').split(',');
const STEP=1000/60;
fs.mkdirSync(OUT,{recursive:true});
function encode(frames,tag,picks,width,labels,gfps){
 const ff=cp.spawnSync(FF,['-hide_banner','-loglevel','error','-y','-f','image2pipe','-c:v','mjpeg',
  '-framerate','60','-i','pipe:0','-c:v','vp8','-b:v','6M','-crf','6','-auto-alt-ref','0',
  path.join(OUT,tag+'.webm')],{input:Buffer.concat(frames),maxBuffer:1<<30});
 if(ff.status!==0)console.log('ffmpeg',ff.stderr.toString());
 const tmp=path.join(OUT,'.tmp-'+tag);fs.mkdirSync(tmp,{recursive:true});
 frames.forEach((f,i)=>fs.writeFileSync(path.join(tmp,String(i).padStart(4,'0')+'.jpg'),f));
 picks.forEach(x=>fs.writeFileSync(path.join(tmp,'pick-'+x.t+'.png'),x.buf));
 const py=cp.spawnSync('python3',[path.join(DIR,'assemble.py'),tmp,path.join(OUT,tag),String(gfps||30),'0',
  JSON.stringify(picks.map(x=>x.t)),'pin',String(width),'start',JSON.stringify(labels)],{encoding:'utf8'});
 process.stdout.write(py.stdout);if(py.status!==0)console.log(py.stderr);
 fs.rmSync(tmp,{recursive:true,force:true});}
/* one story: step the clock, fire each action at its moment, shoot the view */
async function story(p,tag,end,acts,labels,width,wheel,gfps){
 /* the whole view, or for a story that never zooms, the wheel itself, a
    square round its centre, so the lines are shown at a size they can be read */
 const clip=await p.evaluate(w=>{const r=document.querySelector('.fv-view').getBoundingClientRect();
  if(!w)return {x:r.x,y:r.y,width:r.width,height:r.height};
  /* the Field's own box, and the Pin button that straddles its lower edge */
  if(w==='win'){const b=__pin.fv().wbox;return {x:r.x+b.x,y:r.y+b.y,width:b.w,height:b.h+18};}
  const G=__pin.G(),c=__rec.screen(G.CX,G.CY),e=__rec.screen(G.CX+G.U*.86,G.CY),R=e[0]-c[0];
  return {x:Math.max(r.x,c[0]-R),y:Math.max(r.y,c[1]-R),width:2*R,height:2*R};},wheel||false);
 const N=Math.round(end/STEP),frames=[],picks=[],want=new Map(Object.keys(labels).map(t=>[Math.round(+t/STEP),+t]));
 const ms=[];
 for(let i=0;i<N;i++){const t=i*STEP;
  for(const a of acts)if(t>=a.at&&t-STEP<a.at){
   await p.evaluate(t=>{window.__rec.at(t);},t);
   await a.fn(t);
   const s=await p.evaluate(()=>{const o=__pin.ov(),f=__pin.fv();return {held:o.cur?o.cur.nm+' '+Math.round(o.cur.load*10)+'%':null,
    pins:o.live().map(x=>x.num+':'+x.line.nm),k:+f.V.k.toFixed(2)};});
   if(a.say)console.log(tag,'t',Math.round(t),a.say,'| holds',s.held||'nothing','| pinned',s.pins.length?s.pins.join(', '):'none','| zoom',s.k,
    a.check?(a.check(s)?'as intended':'NOT AS INTENDED'):'');}
  const st=await p.evaluate(t=>{const s=window.__rec.at(t);return s.last;},t);ms.push(st);
  frames.push(await p.screenshot({type:'jpeg',quality:90,clip}));
  if(want.has(i))picks.push({t:want.get(i),buf:await p.screenshot({type:'png',clip})});}
 ms.sort((a,b)=>a-b);
 console.log(tag,'overlay draw per frame, median',ms[ms.length>>1].toFixed(2),'ms, 95th',ms[Math.floor(ms.length*.95)].toFixed(2),'ms');
 const L={};Object.keys(labels).forEach(k=>L[String(Math.round(+k))]=labels[k]);
 encode(frames,tag,picks,width,L,gfps);}
/* lines chosen by their numbers, never placed */
const PICK=`(function(){var G=__pin.G(),mid=function(l){return OVL_LIB.at(l.S,.5);};
 var hot=G.links.slice().sort(function(a,b){return b.load-a.load;})[0],hm=mid(hot),key=hot.chain.path.map(function(l){return l.i;}).join('-');
 return {G:G,hot:hot,hm:hm,key:key,mid:mid};})()`;
(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const errs=[];
 const url=q=>'file://'+path.join(DIR,'pin.html')+'?rec=1&title=0&who='+WHO+q;
 if(ONLY.includes('desk')){
  const p=await b.newPage({viewport:{width:1100,height:950}});p.on('pageerror',e=>errs.push(e.message));
  await p.goto(url('&close=1'));await p.waitForFunction(()=>window.__rec&&[...document.images].every(i=>i.complete));
  await p.mouse.move(2,2);await p.evaluate(()=>__rec.at(0));
  const L=await p.evaluate(`(function(){var X=${PICK};
   var two=X.G.links.filter(function(l){var m=X.mid(l);return l.lv===0&&l.load>0&&l.to!==X.hot.to&&Math.hypot(m[0]-X.hm[0],m[1]-X.hm[1])>180;})
    .filter(function(l){var q=__rec.point(l.i);return q&&q.clear>1.5;})
    .sort(function(a,b){return b.load-a.load;})[0];
   return {hot:X.hot.i,hotNm:X.hot.nm,two:two.i,twoNm:two.nm,hp:__rec.point(X.hot.i),tp:__rec.point(two.i)};})()`);
  console.log('desk: hot',L.hotNm,'clear',L.hp.clear.toFixed(1),'px; second',L.twoNm,'clear',L.tp.clear.toFixed(1),'px');
  const off=async()=>{await p.mouse.move(1080,940);};
  const click=async()=>{await p.mouse.down();await p.mouse.up();};
  const acts=[
   {at:300,fn:()=>p.mouse.move(L.hp.x,L.hp.y),say:'rest on the hottest line',check:s=>s.held&&s.held.startsWith(L.hotNm)},
   {at:2700,fn:click,say:'click it',check:s=>s.pins.length===1},
   {at:3900,fn:off,say:'move away',check:s=>!s.held&&s.pins.length===1},
   {at:5000,fn:()=>p.mouse.move(L.tp.x,L.tp.y),say:'rest on a second chain',check:s=>s.held&&s.held.startsWith(L.twoNm)},
   {at:7300,fn:click,say:'click it',check:s=>s.pins.length===2},
   {at:8300,fn:off,say:'move away',check:s=>s.pins.length===2},
   {at:9400,fn:()=>p.mouse.move(L.hp.x,L.hp.y),say:'back onto the first, pinned',check:s=>s.held&&s.held.startsWith(L.hotNm)},
   {at:11700,fn:click,say:'click it',check:s=>s.pins.length===1},
   {at:12700,fn:off,say:'move away',check:s=>!s.held&&s.pins.length===1}];
  await story(p,'pin-desk-'+WHO.toLowerCase(),13800,acts,{
   1200:'1200 ms, resting on it, the chain traces',2500:'2500 ms, the chain holds and hums',
   2780:'click + 80 ms, the grip stills it, pin drawn in',2960:'click + 260 ms, the pin lands, the chain confirms',
   3600:'click + 900 ms, pinned, pointer still on it',4700:'pointer away, the chain stays, breathing',
   8100:'a second chain pinned, pointer away',10000:'back on the first, it traces over itself',
   11400:'and hums while held',11800:'click + 100 ms, the pin lifts',12200:'click + 500 ms, let go, it rings',
   13500:'pointer away, only the second stays'},520,true);
  await p.close();}
 if(ONLY.includes('phone')){
  const ctx=await b.newContext({viewport:{width:430,height:900},hasTouch:true});
  const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
  const cdp=await ctx.newCDPSession(p);
  await p.goto(url('&w=390'));await p.waitForFunction(()=>window.__rec&&[...document.images].every(i=>i.complete));
  await p.evaluate(()=>__rec.at(0));
  const touch=(type,pts)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:pts.map((q,i)=>({x:q[0],y:q[1],id:i}))});
  const tap=async(x,y)=>{await touch('touchStart',[[x,y]]);await touch('touchEnd',[]);};
  const L=await p.evaluate(`(function(){var X=${PICK};
   /* the second line: one a finger cannot pick out at this width, the
      heaviest line of another saboteur whose clearest point is under 3px
      from a neighbour */
   var c=X.G.links.filter(function(l){return l.lv===0&&l.load>0&&l.to!==X.hot.to&&l.from!==X.hot.from;}).map(function(l){return {l:l,p:__rec.point(l.i)};})
    .filter(function(x){return x.p&&x.p.clear>.6&&x.p.clear<3;}).sort(function(a,b){return b.l.load-a.l.load;})[0];
   /* off the lines by more than a held line's own grace, 1.4 times a
      finger's 14px, so the tap is read as empty */
   var e=__rec.empty(.08,.1,24);
   return {hot:X.hot.i,hotNm:X.hot.nm,hp:__rec.point(X.hot.i),two:c.l.i,twoNm:c.l.nm,twoC:[c.p.cx,c.p.cy],twoClear:c.p.clear,
    tpS:__rec.screen(c.p.cx,c.p.cy),off:e};})()`);
  console.log('phone: hot',L.hotNm,'clear',L.hp.clear.toFixed(1),'px; second',L.twoNm,'clear at 1x',L.twoClear.toFixed(1),'px');
  const pillAt=()=>p.evaluate(()=>{const r=document.querySelector('.pill').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2];});
  const acts=[
   {at:300,fn:t=>tap(L.hp.x,L.hp.y,t),say:'tap the hottest line',check:s=>s.held&&s.held.startsWith(L.hotNm)},
   {at:2500,fn:async t=>{const q=await pillAt();await tap(q[0],q[1],t);},say:'tap Pin',check:s=>s.pins.length===1},
   {at:3500,fn:t=>tap(L.off.x,L.off.y,t),say:'tap off the lines',check:s=>!s.held&&s.pins.length===1}];
  /* the pinch, 34 frames, fingers 30px apart opening to 96, centred on the second line */
  const P0=4300,c=L.tpS;
  acts.push({at:P0,fn:()=>touch('touchStart',[[c[0]-15,c[1]-4],[c[0]+15,c[1]+4]])});
  for(let k=1;k<=34;k++){const d=15+33*(1-Math.pow(1-k/34,2));
   acts.push({at:P0+k*STEP,fn:()=>touch('touchMove',[[c[0]-d,c[1]-d*.27],[c[0]+d,c[1]+d*.27]])});}
  acts.push({at:P0+36*STEP,fn:()=>touch('touchEnd',[]),say:'pinch open',check:s=>s.k>2.5});
  acts.push({at:5600,fn:async t=>{const q=await p.evaluate(i=>__rec.point(i),L.two);console.log('phone: second line clear at this zoom',q.clear.toFixed(1),'px');await tap(q.x,q.y,t);},
   say:'tap the second line',check:s=>s.held&&s.held.startsWith(L.twoNm)});
  acts.push({at:7600,fn:async t=>{const q=await pillAt();await tap(q[0],q[1],t);},say:'tap Pin',check:s=>s.pins.length===2});
  acts.push({at:8600,fn:async t=>{const q=await p.evaluate(()=>{const r=document.querySelector('.fv-whole').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2];});await tap(q[0],q[1],t);},
   say:'tap Whole field, and the zoom animates out',check:s=>s.pins.length===2});
  await story(p,'pin-phone-'+WHO.toLowerCase(),10200,acts,{
   900:'tap + 600 ms, the chain traces',2300:'held and humming, Pin offered',2700:'Pin + 200 ms, pinned',
   4100:'tapped off, the chain stays',4600:'pinching open, 300 ms in',5400:'zoomed, the knot pulled apart',
   6700:'the second line, held at zoom',7900:'pinned, two chains',8800:'Whole field, 200 ms in',9900:'whole field, both pinned'},374,'win');
  await ctx.close();}
 if(ONLY.includes('zoom')){
  const p=await b.newPage({viewport:{width:1100,height:950}});p.on('pageerror',e=>errs.push(e.message));
  await p.goto(url('&close=1'));await p.waitForFunction(()=>window.__rec&&[...document.images].every(i=>i.complete));
  await p.mouse.move(2,2);await p.evaluate(()=>__rec.at(0));
  const e1=await p.evaluate(()=>__rec.empty(.66,.36,14));
  const acts=[{at:300,fn:()=>p.mouse.move(e1.x,e1.y),say:'pointer on an empty spot'}];
  for(let k=0;k<12;k++)acts.push({at:500+k*50,fn:()=>p.mouse.wheel(0,-70)});
  acts.push({at:1160,fn:async()=>{},say:'scrolled in',check:s=>s.k>2.5});
  /* a drag, then let go moving, so it glides */
  let e2=null;
  acts.push({at:1700,fn:async()=>{e2=await p.evaluate(()=>__rec.empty(.5,.5,6));await p.mouse.move(e2.x,e2.y);await p.mouse.down();},say:'press'});
  for(let k=1;k<=24;k++)acts.push({at:1700+k*STEP,fn:()=>p.mouse.move(e2.x+k*k*.42,e2.y+k*k*.2)});
  acts.push({at:1700+25*STEP,fn:()=>p.mouse.up(),say:'let go moving'});
  let e3=null;
  acts.push({at:3200,fn:async()=>{e3=await p.evaluate(()=>__rec.empty(.5,.5,8));await p.mouse.move(e3.x,e3.y);await p.mouse.down();await p.mouse.up();}});
  acts.push({at:3320,fn:async()=>{await p.mouse.down();await p.mouse.up();},say:'double click',check:s=>true});
  let e4=null;
  acts.push({at:4400,fn:async()=>{e4=await p.evaluate(()=>__rec.empty(.3,.2,10));await p.mouse.move(e4.x,e4.y);await p.mouse.down();await p.mouse.up();}});
  acts.push({at:4520,fn:async()=>{await p.mouse.down();await p.mouse.up();},say:'double click on a region'});
  acts.push({at:5600,fn:async()=>{const q=await p.evaluate(()=>{const r=document.querySelector('.fv-whole').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2];});
   await p.mouse.move(q[0],q[1]);await p.mouse.down();await p.mouse.up();},say:'Whole field',check:s=>true});
  await story(p,'zoom-desk-'+WHO.toLowerCase(),6800,acts,{
   200:'the whole field',800:'scrolling in at the pointer',1250:'three times, the ceiling at 1600',
   2000:'dragging',2400:'let go, it glides and stops',3450:'double click, back out, 130 ms in',
   3800:'whole field again',4650:'double click a region, 130 ms in',5000:'the region, twice the size',
   5750:'Whole field, 150 ms in',6600:'whole field'},420,false,20);
  await p.close();}
 console.log(errs.length?'JS ERRORS '+errs.join(' | '):'no JS errors');
 await b.close();
})();
