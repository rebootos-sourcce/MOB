/* RECORD TRACE AND RELEASE. DB in TASKS.md.

   Unlike the other recorders in this folder this one runs in REAL TIME, and
   says so. The release is the shipped build running in a frame on its own
   timers, and a virtual clock cannot step it. So the browser's own screen
   recording is used, at whatever rate this machine draws, and the file is
   trimmed to start once the build has booted. One thing is changed, and
   printed on the page's strip as well as here: each thought line is held
   0.5 seconds instead of the build's 2.2 (RUN.speed, set through the page's
   own speed parameter), so a run of 25 patterns fits in 13 seconds of video
   rather than 55. Nothing else about the run is touched.

   The page is served, since a page opened as a file cannot reach into a
   frame. This starts a server on the repository root and stops it after.

   Each recording is one story: rest on the hottest line, pin it, say
   "This is my saboteur", run a release from it, Begin in the real card, the
   real opening and run, the real Released card, Done, and back on the Field
   the chain traces again at what is left.

   Writes into rec/: release-<w>-<who>.webm, .gif at 10 a second, and
   -strip.png, the phases shot as they happened.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/field-overlay/record-release.js [who] [desk,phone] */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs'),cp=require('child_process');
const DIR=__dirname,OUT=path.join(DIR,'rec');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FF='/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux';
const WHO=process.argv[2]||'James';
const ONLY=(process.argv[3]||'desk,phone').split(',');
const PORT=8700+Math.floor(Math.random()*200),SPEED=0.5;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
fs.mkdirSync(OUT,{recursive:true});
function finish(raw,tag,t0,shots,width){
 const webm=path.join(OUT,tag+'.webm');
 const ff=cp.spawnSync(FF,['-hide_banner','-loglevel','error','-y','-i',raw,'-ss',(t0/1000).toFixed(2),'-c:v','vp8','-b:v','4M','-crf','8','-auto-alt-ref','0',webm]);
 if(ff.status!==0)console.log('ffmpeg',ff.stderr.toString());
 const tmp=path.join(OUT,'.tmp-'+tag);fs.mkdirSync(tmp,{recursive:true});
 cp.spawnSync(FF,['-hide_banner','-loglevel','error','-y','-i',webm,'-r','10','-vf','scale='+width+':-2',path.join(tmp,'%04d.png')]);
 shots.forEach((s,i)=>fs.writeFileSync(path.join(tmp,'shot-'+String(i).padStart(2,'0')+'.png'),s.buf));
 fs.writeFileSync(path.join(tmp,'labels.json'),JSON.stringify(shots.map(s=>s.label)));
 const py=cp.spawnSync('python3',['-c',`
import sys,glob,json,os
from PIL import Image,ImageDraw,ImageFont
d,stem,W=sys.argv[1],sys.argv[2],int(sys.argv[3])
fr=sorted(glob.glob(os.path.join(d,'[0-9]*.png')))
ims=[Image.open(f).convert('RGB') for f in fr]
H=ims[0].height
probe=Image.new('RGB',(W,H*3))
for k,f in enumerate([ims[len(ims)//4],ims[len(ims)//2],ims[3*len(ims)//4]]):probe.paste(f,(0,H*k))
pal=probe.quantize(colors=255,method=Image.Quantize.MEDIANCUT)
q=[im.quantize(palette=pal,dither=Image.Dither.NONE) for im in ims]
q[0].save(stem+'.gif',save_all=True,append_images=q[1:],duration=100,loop=0,optimize=True,disposal=1)
labs=json.load(open(os.path.join(d,'labels.json')))
sh=[Image.open(f).convert('RGB') for f in sorted(glob.glob(os.path.join(d,'shot-*.png')))]
s=520 if sh[0].width>sh[0].height else 300
cols=3 if sh[0].width>sh[0].height else 4
hh=round(sh[0].height*s/sh[0].width);sh=[i.resize((s,hh),Image.LANCZOS) for i in sh]
pad,top=12,30;rows=(len(sh)+cols-1)//cols
out=Image.new('RGB',(cols*(s+pad)+pad,rows*(hh+top+pad)+pad),(11,11,13));dr=ImageDraw.Draw(out)
try:font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15)
except Exception:font=ImageFont.load_default()
for k,(im,lab) in enumerate(zip(sh,labs)):
    x=pad+(k%cols)*(s+pad);y=pad+(k//cols)*(hh+top+pad);out.paste(im,(x,y+top));dr.text((x+2,y+7),lab,fill=(180,176,168),font=font)
out.save(stem+'-strip.png',optimize=True)
print(os.path.basename(stem),'gif',len(q),'frames at 10 fps,',os.path.getsize(stem+'.gif')//1024,'KB')
`,tmp,path.join(OUT,tag),String(width)],{encoding:'utf8'});
 process.stdout.write(py.stdout);if(py.status!==0)console.log(py.stderr);
 fs.rmSync(tmp,{recursive:true,force:true});}
(async()=>{
 const srv=cp.spawn('python3',['-m','http.server',String(PORT),'--bind','127.0.0.1'],{cwd:path.resolve('.'),stdio:'ignore'});
 await sleep(900);
 const b=await chromium.launch({executablePath:EXE});
 const errs=[];
 for(const kind of ONLY){
  const phone=kind==='phone',vp=phone?{width:430,height:900}:{width:1600,height:1000};
  const vdir=path.join(OUT,'.vid-'+kind);fs.rmSync(vdir,{recursive:true,force:true});
  const ctx=await b.newContext({viewport:vp,hasTouch:phone,recordVideo:{dir:vdir,size:vp}});
  const p=await ctx.newPage();const T0=Date.now();
  p.on('pageerror',e=>errs.push(kind+': '+e.message));
  const cdp=phone?await ctx.newCDPSession(p):null;
  const tag='release-'+(phone?'390':'1600')+'-'+WHO.toLowerCase(),shots=[];
  const shot=async label=>{shots.push({label,buf:await p.screenshot({type:'png'})});};
  const log=async what=>{const s=await p.evaluate(()=>{const o=__pin.ov(),R=__release;let ph=null;try{ph=R.W&&R.W.eval('RUN.open?RUN.phase:"closed"');}catch(e){}
   return {held:o.cur?o.cur.nm:null,pins:o.live().map(x=>x.num+':'+x.line.nm+(x.label?' "'+x.label+'"':'')),stage:R.stage.want,run:ph};});
   console.log(tag,Math.round((Date.now()-T0)/100)/10+'s',what,'|',JSON.stringify(s));};
  const tapAt=async(x,y)=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:0}]});
   await sleep(60);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});};
  await p.goto('http://127.0.0.1:'+PORT+'/proto/field-overlay/release.html?who='+WHO+'&speed='+SPEED+(phone?'&w=390':''));
  await p.waitForFunction(()=>window.__release&&__release.ready,null,{timeout:40000});
  console.log(tag,'check',JSON.stringify(await p.evaluate(()=>__release.check)));
  /* on a phone the Field is scrolled into view, the way a thumb would */
  const toField=()=>p.evaluate(()=>{const f=__pin.fv(),r=f.el.view.getBoundingClientRect();window.scrollTo(0,Math.max(0,scrollY+r.top+f.wbox.y-70));});
  if(phone)await toField();
  await sleep(600);const tStart=Date.now()-T0;
  /* the hottest line, at its point furthest from any other */
  const pt=async()=>p.evaluate(()=>{const G=__pin.G(),pin=__pin.ov().live()[0],fv=__pin.fv();
   /* the pinned line once there is one, since a release changes which is hottest */
   const l=pin?pin.line:G.links.slice().sort((a,b)=>b.load-a.load)[0];
   let best=null,bd=-1;for(let s=.2;s<=.8;s+=.02){const q=OVL_LIB.at(l.S,s);let m=1e9;
    G.links.forEach(o=>{if(o===l)return;const P=o.S.pts;for(let j=1;j<P.length;j++){const a=P[j-1],c=P[j],dx=c[0]-a[0],dy=c[1]-a[1],L=dx*dx+dy*dy||1,
     t=Math.max(0,Math.min(1,((q[0]-a[0])*dx+(q[1]-a[1])*dy)/L));m=Math.min(m,Math.hypot(q[0]-a[0]-dx*t,q[1]-a[1]-dy*t));}});
    if(m>bd){bd=m;best=q;}}
   const sc=fv.toScreen(best[0],best[1]);return {x:sc[0],y:sc[1]};});
  let h=await pt();
  if(phone){await tapAt(h.x,h.y);}else{await p.mouse.move(h.x-80,h.y+60);await sleep(300);await p.mouse.move(h.x,h.y,{steps:12});}
  await sleep(2300);await log(phone?'tapped the hottest line':'resting on the hottest line');await shot('the chain traces, then hums');
  if(phone){const q=await p.evaluate(()=>{const r=document.querySelector('.pill').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2];});await tapAt(q[0],q[1]);}
  else{await p.mouse.down();await p.mouse.up();}
  await sleep(1300);await log('pinned');
  if(phone)await p.locator('[data-lab="This is my saboteur"]').tap();else{await p.mouse.move(h.x+300,h.y,{steps:10});await p.click('[data-lab="This is my saboteur"]');}
  await sleep(1400);await log('labelled');await shot('pinned, and labelled on the Field');
  if(phone){await p.locator('#run').scrollIntoViewIfNeeded();await sleep(500);await p.locator('#run').tap();}
  else{const r=await p.locator('#run').boundingBox();await p.mouse.move(r.x+r.width/2,r.y+r.height/2,{steps:14});await p.mouse.down();await p.mouse.up();}
  if(phone)await toField();
  await sleep(420);await shot('Run + 400 ms, the chain runs back outward');
  await sleep(1700);await log('the release card');await shot('the shipped release card, on this chain');
  const fr=p.frameLocator('iframe.frame');
  if(phone)await fr.locator('#relgo').tap();else await fr.locator('#relgo').click();
  await sleep(700);await shot('Begin, the real opening');
  await p.waitForFunction(()=>__release.W.eval('RUN.phase')==='run',null,{timeout:20000});
  await sleep(2600);await log('running');await shot('the run, one thought line a pattern');
  await p.waitForFunction(()=>__release.W.eval('RUN.phase')==='done',null,{timeout:60000});
  await sleep(2200);await log('released');await shot('Released, as the build reports it');
  if(phone)await fr.locator('#relclose').tap();else await fr.locator('#relclose').click();
  await sleep(1300);await log('back on the Field');await shot('back, the chain traces again');
  await sleep(1800);await shot('humming at what is left');
  h=await pt();
  if(!phone){await p.mouse.move(h.x,h.y,{steps:10});}else{await tapAt(h.x,h.y);}
  await sleep(3000);await log(phone?'tapped it again':'resting on it again');
  console.log(tag,'result',JSON.stringify(await p.evaluate(()=>window.__releaseResult)));
  const card=await p.evaluate(()=>{const a=document.querySelector('.after');return a?a.innerText:null;});
  console.log(tag,'card says:',card);
  if(phone){await p.evaluate(()=>{const a=document.querySelector('.after');if(a)a.scrollIntoView({block:'center'});});await sleep(1500);}
  await shot('the card: before and after');
  await ctx.close();
  const raw=fs.readdirSync(vdir).filter(f=>f.endsWith('.webm')).map(f=>path.join(vdir,f))[0];
  finish(raw,tag,tStart,shots,phone?300:800);
  fs.rmSync(vdir,{recursive:true,force:true});}
 console.log(errs.length?'JS ERRORS '+errs.join(' | '):'no JS errors');
 await b.close();srv.kill();
})();
