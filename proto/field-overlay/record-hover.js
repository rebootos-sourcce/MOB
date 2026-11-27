/* RECORD THE HOVER. CU's mechanic, recorded moving, driven by a real pointer.

   Same method as record.js: the page runs on a virtual clock (hover.html?
   rec=1), stepped one sixtieth of a second at a time, so each frame is the
   frame the design asks for whatever this machine manages. The difference is
   the control. There is no button: the recorder moves the real mouse, the
   browser fires a real pointermove, and the page's own handler finds the line
   under it. After every move the recorder asks the page which line it holds
   and prints it, so a recording that landed on a neighbour says so.

   Each recording is one story, at the desktop wheel's own scale:
     0       the Field as it ships
     400     the pointer lands on the hottest line on the profile
     3400    it moves to a cool line near it
     5800    it leaves the wheel, and the Field comes back

   Writes into rec/:
     hover-<look>-<who>.webm        60 a second, the true motion
     hover-<look>-<who>.gif         50 a second at the wheel's own scale, because the strings ring at up
                                    to 10 a second and a slower GIF aliases them
     hover-<look>-<who>-strip.png   six phases with their times

   Committed: every webm and strip, and the GIFs for Trace and hum, the
   side by side comparison and the still. The other six GIFs are four
   megabytes each and this script writes them again in about a minute each.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/field-overlay/record-hover.js [who] [looks]
   looks is a comma list of trace, coil, current, stitch, pressure, and also
     chain     Trace and hum with the whole chain traced, hop by hop
     still     Trace and hum under reduced motion
     tension   Trace and hum with the hum read off the wheel's tension
     compare   hover-compare.html, all six panels on one clock */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs'),cp=require('child_process');
const DIR=__dirname,OUT=path.join(DIR,'rec');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FF='/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux';
const WHO=process.argv[2]||'James';
const ONLY=(process.argv[3]||'trace,coil,current,stitch,pressure,chain,still,tension,compare').split(',');
const ON=400,SWAP=3400,OFF=5800,END=6600,STEP=1000/60;
fs.mkdirSync(OUT,{recursive:true});
function encode(frames,tag,gfps,strip,look,picks,width,labels){
 const ff=cp.spawnSync(FF,['-hide_banner','-loglevel','error','-y','-f','image2pipe','-c:v','mjpeg',
  '-framerate','60','-i','pipe:0','-c:v','vp8','-b:v','6M','-crf','6','-auto-alt-ref','0',
  path.join(OUT,tag+'.webm')],{input:Buffer.concat(frames),maxBuffer:1<<30});
 if(ff.status!==0)console.log('ffmpeg',ff.stderr.toString());
 const tmp=path.join(OUT,'.tmp-'+tag);fs.mkdirSync(tmp,{recursive:true});
 frames.forEach((f,i)=>fs.writeFileSync(path.join(tmp,String(i).padStart(4,'0')+'.jpg'),f));
 picks.forEach(x=>fs.writeFileSync(path.join(tmp,'pick-'+String(x.t).replace('-','m')+'.png'),x.buf));
 const py=cp.spawnSync('python3',[path.join(DIR,'assemble.py'),tmp,path.join(OUT,tag),
  String(gfps),String(ON),JSON.stringify(strip),look,String(width),'the pointer lands',JSON.stringify(labels||{})],{encoding:'utf8'});
 process.stdout.write(py.stdout);if(py.status!==0)console.log(py.stderr);
 fs.rmSync(tmp,{recursive:true,force:true});}
/* the phases each strip shows, in ms after the pointer first lands, and what
   to call them */
const STRIP=[150,330,800,2000,3200,4400];
const LAB={150:'150 ms, the trace leaves',330:'330 ms, mid trace',800:'800 ms, landed and plucked',
 2000:'2000 ms, holding, hot line humming',3200:'moved to the cool line, 200 ms in',4400:'cool line holding, 1400 ms in'};
(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const errs=[];
 if(ONLY.includes('compare')){
  const p=await b.newPage({viewport:{width:1320,height:900}});
  p.on('pageerror',e=>errs.push('compare: '+e.message));
  await p.goto('file://'+path.join(DIR,'hover-compare.html')+'?rec=1&pw=400&who='+WHO);
  await p.waitForFunction(()=>window.__rec&&[...document.images].every(i=>i.complete));
  await p.evaluate(()=>{document.querySelector('.bar').style.display='none';});
  console.log('compare lines',JSON.stringify(await p.evaluate(()=>__rec.lines())));
  const N=Math.round(END/STEP),frames=[],picks=[],want=new Map(STRIP.map(t=>[Math.round((ON+t)/STEP),t]));
  const box=await p.evaluate(()=>{const r=document.getElementById('row').getBoundingClientRect();
   const h=document.getElementById('head').getBoundingClientRect();return {x:r.x,y:h.y,width:r.width,height:r.bottom-h.y};});
  for(let i=0;i<N;i++){const t=i*STEP;
   await p.evaluate(([t,s])=>{const r=window.__rec;
    if(t>=s[0]&&t-s[3]<s[0])r.hover('hot',t);if(t>=s[1]&&t-s[3]<s[1])r.hover('cool',t);
    if(t>=s[2]&&t-s[3]<s[2])r.hover(null,t);r.at(t);},[t,[ON,SWAP,OFF,STEP]]);
   frames.push(await p.screenshot({type:'jpeg',quality:92,clip:box}));
   if(want.has(i))picks.push({t:want.get(i),buf:await p.screenshot({type:'png',clip:box})});}
  encode(frames,'hover-compare-'+WHO.toLowerCase(),50,STRIP,'compare',picks,840,LAB);
  await p.close();}
 const p=await b.newPage({viewport:{width:800,height:840}});
 p.on('pageerror',e=>errs.push(e.message));
 for(const look of ONLY.filter(x=>x!=='compare')){
  const base=['chain','still','tension'].includes(look)?'trace':look;
  const extra=look==='chain'?'&scope=chain':look==='still'?'&rm=1':look==='tension'?'&reads=tension':'';
  await p.goto('file://'+path.join(DIR,'hover.html')+'?rec=1&close=1&title=0&who='+WHO+'&look='+base+extra);
  await p.waitForFunction(()=>window.__rec&&document.getElementById('dim').complete);
  await p.mouse.move(2,2);await p.evaluate(()=>__rec.at(0));
  /* the two lines, chosen by their numbers the way hover-compare.html does */
  const L=await p.evaluate(()=>{const G=__rec.G(),mid=l=>OVL_LIB.at(l.S,.5);
   const hot=G.links.slice().sort((a,b)=>b.load-a.load)[0],hm=mid(hot);
   const cool=G.links.filter(l=>{const m=mid(l);return l.load>0&&l!==hot&&Math.hypot(m[0]-hm[0],m[1]-hm[1])<160;})
    .sort((a,b)=>a.load-b.load)[0];
   const off=document.getElementById('view').getBoundingClientRect();
   return {hot:hot.i,cool:cool.i,hotP:__rec.point(hot.i),coolP:__rec.point(cool.i),off:{x:off.left+14,y:off.bottom-14}};});
  const moves=[[ON,L.hotP,L.hot],[SWAP,L.coolP,L.cool],[OFF,L.off,null]];
  const N=Math.round(END/STEP),frames=[],picks=[],want=new Map(STRIP.map(t=>[Math.round((ON+t)/STEP),t]));
  for(let i=0;i<N;i++){const t=i*STEP;
   for(const [at,pt,expect] of moves)if(t>=at&&t-STEP<at){
    await p.evaluate(t=>{window.__rec.at(t);},t);
    await p.mouse.move(pt.x,pt.y);
    const held=await p.evaluate(()=>{const c=__rec.ov().cur;return c?{i:c.i,nm:c.nm,load:c.load}:null;});
    const ok=expect==null?held==null:(held&&held.i===expect);
    console.log(look,'t',Math.round(t),'pointer',Math.round(pt.x)+','+Math.round(pt.y),'holds',held?held.nm+' '+Math.round(held.load*10)+'%':'nothing',ok?'as intended':'NOT THE INTENDED LINE');}
   await p.evaluate(t=>{window.__rec.at(t);},t);
   frames.push(await p.locator('#view').screenshot({type:'jpeg',quality:93}));
   if(want.has(i))picks.push({t:want.get(i),buf:await p.locator('#view').screenshot({type:'png'})});}
  encode(frames,'hover-'+look+'-'+WHO.toLowerCase(),50,STRIP,look,picks,760,LAB);}
 console.log(errs.length?'JS ERRORS '+errs.join(' | '):'no JS errors');
 await b.close();
})();
