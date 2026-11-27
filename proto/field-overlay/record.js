/* RECORD. Motion is the whole of this request, so every look is recorded
   moving, not described.

   The page runs on a virtual clock here (index.html?rec=1), stepped one
   sixtieth of a second at a time, so each frame is exactly the frame the
   design asks for, whatever this machine could manage in real time. Each
   recording is the full story of the button: the Field as it ships for
   400ms, Active pressed, the overlay running, Active pressed again, and the
   Field coming back.

   Writes into rec/:
     <look>-<who>.webm        60 frames a second, the true motion
     <look>-<who>.gif         the same, 50 a second for Hum because its
                              strings ring at up to 10 a second and a slower
                              GIF would alias them into a different motion;
                              25 a second for the rest
     <look>-<who>-strip.png   six phases in a row with their times, for a
                              medium that cannot play anything

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/field-overlay/record.js [who] [looks]

   With "compare" as the second argument it records compare.html instead: the
   three looks side by side on one clock, as compare-<who>.webm and .gif. */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs'),cp=require('child_process');
const DIR=__dirname, OUT=path.join(DIR,'rec');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FF='/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux';
const WHO=process.argv[2]||'James';
const ONLY=process.argv[3]||'';
const ON=400;
/* how long each runs with the overlay on, and the six phases its strip shows,
   in ms after Active is pressed */
const PLAN={
 still:{run:1600,strip:[-100,60,180,300,480,900]},
 hum:  {run:5200,strip:[120,300,1400,1425,1450,2600]},
 pulse:{run:5200,strip:[200,700,1300,1700,2100,2500]},
 relay:{run:0,   strip:[]}};
fs.mkdirSync(OUT,{recursive:true});
function encode(frames,tag,gfps,strip,look,picks,width){
 const ff=cp.spawnSync(FF,['-hide_banner','-loglevel','error','-y','-f','image2pipe','-c:v','mjpeg',
  '-framerate','60','-i','pipe:0','-c:v','vp8','-b:v','6M','-crf','6','-auto-alt-ref','0',
  path.join(OUT,tag+'.webm')],{input:Buffer.concat(frames),maxBuffer:1<<30});
 if(ff.status!==0)console.log('ffmpeg',ff.stderr.toString());
 const tmp=path.join(OUT,'.tmp-'+tag); fs.mkdirSync(tmp,{recursive:true});
 frames.forEach((f,i)=>fs.writeFileSync(path.join(tmp,String(i).padStart(4,'0')+'.jpg'),f));
 picks.forEach(x=>fs.writeFileSync(path.join(tmp,'pick-'+String(x.t).replace('-','m')+'.png'),x.buf));
 const py=cp.spawnSync('python3',[path.join(DIR,'assemble.py'),tmp,path.join(OUT,tag),
  String(gfps),String(ON),JSON.stringify(strip),look,String(width||420)],{encoding:'utf8'});
 process.stdout.write(py.stdout); if(py.status!==0)console.log(py.stderr);
 fs.rmSync(tmp,{recursive:true,force:true});}
(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 if(ONLY==='compare'){
  /* THE THREE AT ONCE, same profile, same lines, same clock */
  const p=await b.newPage({viewport:{width:1300,height:560}});
  await p.goto('file://'+path.join(DIR,'compare.html')+'?rec=1&pw=400&who='+WHO);
  await p.waitForFunction(()=>window.__rec&&[...document.images].every(i=>i.complete));
  await p.evaluate(()=>{document.querySelector('.bar').style.display='none';
   document.getElementById('tog').click();});   /* off, so the run opens on the Field as it ships */
  await p.waitForTimeout(200);
  const run=7000,total=ON+run+800,step=1000/60,N=Math.round(total/step),frames=[],picks=[];
  const strip=[200,900,1500,2100,2700,3300],want=new Map(strip.map(t=>[Math.round((ON+t)/step),t]));
  for(let i=0;i<N;i++){const t=i*step;
   await p.evaluate(([t,ON,off,step])=>{
    if((t>=ON&&t-step<ON)||(t>=off&&t-step<off))document.getElementById('tog').click();
    window.__rec.at(t);},[t,ON,ON+run,step]);
   frames.push(await p.locator('#row').screenshot({type:'jpeg',quality:92}));
   if(want.has(i))picks.push({t:want.get(i),buf:await p.locator('#row').screenshot({type:'png'})});}
  encode(frames,'compare-'+WHO.toLowerCase(),50,strip,'compare',picks,900);
  console.log('compare frames',N); await b.close(); return;}
 const p=await b.newPage({viewport:{width:592,height:900}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 for(const look of (ONLY?ONLY.split(','):['hum','pulse','relay','still'])){
  await p.goto('file://'+path.join(DIR,'index.html')+'?rec=1&close=1&title=0&on=0&look='+look+'&who='+WHO);
  await p.waitForFunction(()=>window.__rec&&document.getElementById('dim').complete);
  await p.waitForTimeout(200);
  let run=PLAN[look].run, strip=PLAN[look].strip;
  if(look==='relay'){
   /* one whole cycle of the chains this profile fires, plus the settle */
   const len=await p.evaluate(()=>{const o=window.__rec.ov();return o.relayPlan().len;});
   run=Math.min(11000,len+900);
   const firstHop=520+120+280;
   strip=[60,firstHop-200,firstHop,firstHop+370,firstHop+740,firstHop+1300];}
  const total=ON+run+800, step=1000/60, N=Math.round(total/step);
  const want=new Map(strip.map(t=>[Math.round((ON+t)/step),t]));
  const frames=[], picks=[];
  let offAt=ON+run;
  for(let i=0;i<N;i++){const t=i*step;
   await p.evaluate(([t,ON,offAt,step])=>{
    const r=window.__rec;
    if(t>=ON&&t-step<ON)r.toggle(true);
    if(t>=offAt&&t-step<offAt)r.toggle(false);
    r.at(t);},[t,ON,offAt,step]);
   const buf=await p.locator('#view').screenshot({type:'jpeg',quality:93});
   frames.push(buf);
   if(want.has(i))picks.push({i,t:want.get(i),buf:await p.locator('#view').screenshot({type:'png'})});}
  const tag=look+'-'+WHO.toLowerCase();
  encode(frames,tag,look==='hum'?50:25,strip,look,picks,420);
  console.log(tag,'frames',N,'run',run,'ms');}
 console.log(errs.length?'JS ERRORS '+errs.join(' | '):'no JS errors');
 await b.close();
})();
