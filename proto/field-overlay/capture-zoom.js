/* CAPTURE FOR ZOOM. DB in TASKS.md: "can I zoom in, like I can't zoom in."

   The plates capture.js writes are one device pixel per CSS pixel, which is
   right for looking and wrong for zooming: magnified four times on a phone
   the Field is a smear. So this shoots the Field's own canvas again, and only
   the canvas, at the density a zoom needs, for the same three profiles in the
   same state capture.js puts them in:

     plates/<who>-<w>-zship.webp   the canvas at Z device pixels per CSS pixel
     plates/<who>-<w>-zdim.webp    the same with the web at the wheel's .08

   Z is 4 at 390 wide and 3 at 1600, which is how far the prototype lets a
   person zoom at each width.

   THE WHEEL CAPS ITS OWN BACKING STORE AT 2 (component.js, layout), so a
   screenshot at 4 would be a 2x canvas upscaled. For this shot only the
   canvas is re-sized at Z and redrawn, the same draw() the wheel runs, so
   every chord in the crop is stroked at the density it is shown at.

   NOTHING IS PLACED. Before it shoots, it checks the frame against the data
   file capture.js wrote: the canvas box, the centre and the unit must match
   to a hundredth of a pixel, or it refuses, because a zoom plate that does
   not sit on the chords the overlay draws would be a lie about where the
   lines are. And it writes a check of its own: the crop downsampled to one
   CSS pixel against the matching region of the 1x plate, as a mean absolute
   difference per channel, printed.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/field-overlay/capture-zoom.js */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs'),cp=require('child_process');
const DIR=__dirname, PL=path.join(DIR,'plates');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const {STORYBANK}=require(path.resolve('sim/stories.js'));
const WHO=['Sofia','James','Gordon'];
const SIZES=[[1600,1000,3],[390,844,4]];
global.window={};WHO.forEach(w=>require(path.join(DIR,'data-'+w.toLowerCase()+'.js')));
(async()=>{
 const src=path.resolve('source.html');
 const b=await chromium.launch({executablePath:EXE});
 const errs=[];
 for(const who of WHO)for(const [W_,H_,Z] of SIZES){
  const D=window.OV[who].sizes[W_];
  const p=await b.newPage({viewport:{width:W_,height:H_},deviceScaleFactor:Z});
  p.on('pageerror',e=>errs.push(who+' '+W_+': '+e.message));
  await p.goto('file://'+src);
  await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000});
  await p.waitForTimeout(300);
  /* the same state capture.js sets, step for step */
  await p.evaluate(([nm,bank])=>{
   const i=PEOPLE.findIndex(x=>x.nm===nm); loadP(i);
   (bank[nm]||[]).map(x=>x[1]).forEach(function(t,k){
    applyStory(t); verpApply(t); if(typeof leanApply==='function')leanApply(t);
    if(CURP){CURP.story=CURP.story||{entries:[]};const ps=parseStory(t);
     CURP.story.entries.push({t:'2026-09-2'+k+'T08:00:00Z',text:t,imprints:ps.imprints.length,bands:ps.bands});}});
   setTab(TAB.FIELD); if(typeof fviewSet==='function')fviewSet('wheel');
   S.zoom=1; S.panx=0; S.pany=0;
   const ch=[...document.querySelectorAll('#vbar .vt')].find(b=>/Chains/.test(b.textContent));
   if(ch)ch.click(); else S.view=2;
   S.pin=null; if(typeof layout==='function')layout(); render();},[who,STORYBANK]);
  await p.waitForTimeout(1800);
  const f=await p.evaluate(()=>{const r=document.getElementById('cv').getBoundingClientRect();
   return {cv:{x:r.x,y:r.y,w:r.width,h:r.height},CX,CY,U};});
  const same=['x','y','w','h'].every(k=>Math.abs(f.cv[k]-D.cv[k])<.01)&&Math.abs(f.CX-D.CX)<.01&&Math.abs(f.CY-D.CY)<.01&&Math.abs(f.U-D.U)<.01;
  if(!same){console.log(who,W_,'FRAME MOVED since capture.js, refusing. now',JSON.stringify(f),'data',JSON.stringify({cv:D.cv,CX:D.CX,CY:D.CY,U:D.U}));
   await p.close();continue;}
  const clip={x:D.cv.x,y:D.cv.y,width:D.cv.w,height:D.cv.h};
  const tag=who.toLowerCase()+'-'+W_;
  const shoot=async(kind)=>{
   const png=path.join(PL,'.z-'+tag+'-'+kind+'.png');
   await p.evaluate(Z=>{const r=cv.getBoundingClientRect();DPR=Z;cv.width=Math.round(r.width*Z);cv.height=Math.round(r.height*Z);
    g.setTransform(Z,0,0,Z,0,0);DRAW_SIG=null;draw(compute());},Z);
   await p.screenshot({path:png,clip});
   const out=path.join(PL,tag+'-z'+kind+'.webp');
   const py=cp.spawnSync('python3',['-c',`
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB')
im.save(sys.argv[2],'WEBP',quality=90,method=6)
ref=Image.open(sys.argv[3]).convert('RGB')
x,y,w,h=[float(v) for v in sys.argv[4:8]]
box=(round(x),round(y),round(x+w),round(y+h))
a=ref.crop(box)
b=im.resize(a.size,Image.LANCZOS)
import itertools
pa=a.tobytes();pb=b.tobytes()
d=sum(abs(i-j) for i,j in zip(pa,pb))/len(pa)
print('%s %dx%d, %d KB, against the 1x plate: %.2f mean abs difference per channel of 255'%(sys.argv[2].split('/')[-1],im.width,im.height,__import__('os').path.getsize(sys.argv[2])//1024,d))
`,png,out,path.join(PL,tag+'-'+(kind==='ship'?'ship':'dim')+'.png'),String(clip.x),String(clip.y),String(clip.width),String(clip.height)],{encoding:'utf8'});
   process.stdout.write(py.stdout);if(py.status)console.log(py.stderr);
   fs.rmSync(png,{force:true});};
  await shoot('ship');
  /* the wheel's own selection dim, set for one frame the way capture.js does */
  await p.evaluate(()=>{S.pin={nm:'',parts:[],kind:'none'};});
  await shoot('dim');
  await p.evaluate(()=>{S.pin=null;});
  await p.close();}
 console.log(errs.length?'JS ERRORS '+errs.join(' | '):'no JS errors');
 await b.close();
})();
