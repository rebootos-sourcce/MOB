/* Renders every picture. Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node mockups/character-torus/src/make.js [which] [outdir]
   which: quick (one hero per version), all (the whole set into mockups/character-torus/shots), cost (milliseconds per frame, honestly) */
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const ROOT=path.resolve(__dirname,'..');
require('child_process').execSync('node '+path.join(__dirname,'build.js'),{cwd:path.resolve(ROOT,'..','..')});
const which=process.argv[2]||'quick';
const OUT=process.argv[3]||path.join(ROOT,'shots');
fs.mkdirSync(OUT,{recursive:true});
const SYS=process.env.ONLY?process.env.ONLY.split(','):['torus-1','torus-2','torus-3'];
const NAMES={'torus-1':'Torus 1, Flow','torus-2':'Torus 2, Slices','torus-3':'Torus 3, Shell'};
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
async function open(file,w,h,query,dsf){const p=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:dsf||(w<700?2:1)});
 p.on('pageerror',e=>console.log('PAGEERR',file,e.message));p.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',file,m.text());});
 await p.goto('file://'+path.join(ROOT,file+'.html')+'?manual=1&'+(query||''));await p.waitForTimeout(150);return p;}
async function hero(sys,w,h,query,t,out){const p=await open(sys,w,h,query);
 await p.evaluate(tt=>window.__step(tt),t);await p.waitForTimeout(120);await p.screenshot({path:path.join(OUT,out)});await p.close();}
async function sheet(sys,view,query,w,out){const p=await browser.newPage({viewport:{width:w,height:1000},deviceScaleFactor:1});
 p.on('pageerror',e=>console.log('PAGEERR',e.message));
 await p.goto('file://'+path.join(ROOT,'states-'+sys+'.html')+'?manual=1&view='+view+(query?'&'+query:''));await p.waitForTimeout(300);
 await p.evaluate(()=>window.__sheetStep(3.2));await p.waitForTimeout(150);await p.screenshot({path:path.join(OUT,out),fullPage:true});await p.close();}
/* frames of one stage, side by side with a label on each. items are {q, t, label}: a page is opened per distinct query and stepped to each time in turn.
   the first frame of a page is the page as it opens. */
async function framesQ(sys,items,out,w,h,opt){opt=opt||{};const cols=opt.cols||items.length,crop=opt.crop||[0,1];const shots=[];const byQ={};items.forEach((it,i)=>{(byQ[it.q]=byQ[it.q]||[]).push([i,it]);});
 for(const q in byQ){const p=await open(sys,w,h,q+'&rail=0');let at=0;
  for(const [i,it] of byQ[q]){await p.evaluate(s=>window.__step(s),it.t-at);at=it.t;await p.waitForTimeout(80);
   const el=await p.$('#stk');const bb=await el.boundingBox();const b=await p.screenshot({clip:{x:bb.x+bb.width*crop[0],y:bb.y,width:bb.width*(crop[1]-crop[0]),height:bb.height}});shots[i]=b.toString('base64');}
  await p.close();}
 const fw=Math.floor((1600-4*(cols-1))/cols);
 const qq=await browser.newPage({viewport:{width:1600,height:600},deviceScaleFactor:1});
 const html='<!doctype html><body style="margin:0;background:#0C0D12;display:flex;flex-wrap:wrap;gap:4px;font:13px Inter,system-ui,sans-serif;color:#B4B0A8;width:1600px">'
  +shots.map((f,i)=>'<div style="position:relative;width:'+fw+'px;flex:none;overflow:hidden"><img style="width:'+fw+'px;display:block" src="data:image/png;base64,'+f+'"><span style="position:absolute;left:50%;transform:translateX(-50%);top:'+(w<700?74:10)+'px;background:rgba(12,13,18,.85);padding:3px 9px;border-radius:10px;white-space:nowrap">'+items[i].label+'</span></div>').join('')+'</body>';
 await qq.setContent(html);await qq.waitForTimeout(300);
 const bb=await qq.evaluate(()=>({h:Math.ceil(document.body.getBoundingClientRect().height)}));
 await qq.setViewportSize({width:1600,height:bb.h});await qq.screenshot({path:path.join(OUT,out),clip:{x:0,y:0,width:1600,height:bb.h}});await qq.close();}
const frames=(sys,query,times,labels,out,w,h,opt)=>framesQ(sys,times.map((t,i)=>({q:query,t,label:labels[i]})),out,w,h,opt);
const secLabel=t=>t===1?'1 second':t+' seconds';
async function cost(sys,w,h,query,nob){const p=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:w<700?2:1});
 await p.goto('file://'+path.join(ROOT,sys+'.html')+'?'+(query||''));await p.waitForTimeout(5200);
 const live=await p.evaluate(()=>({n:window.__perf.n,avg:window.__perf.ms/window.__perf.n,max:window.__perf.max}));
 /* the call time above leaves the drawing of the strokes to the browser. so also draw 40 frames by hand and read one pixel back, which makes the browser finish them. */
 const forced=await p.evaluate(nb=>{const sc=window.__S.sc;if(nb)window.__S.sys.bloom=()=>[0,0];const a=[];for(let i=0;i<40;i++){const s=performance.now();sc.t+=1/60;sc.render();sc.g.getImageData(0,0,1,1);a.push(performance.now()-s);}a.sort((x,y)=>x-y);return{med:a[20],min:a[0],max:a[39]};},!!nob);
 await p.close();return {live,forced};}
const Q1='profile=anger&mask=Preteen&coh=';
(async()=>{browser=await chromium.launch({executablePath:EXE});
 if(which==='quick'){for(const s of SYS)await hero(s,1600,1000,Q1+'100',5,s+'-q.png');}
 if(which==='one'){const s=process.argv[4],q=process.argv[5]||'',t=+(process.argv[6]||5),w=+(process.argv[7]||1600),h=+(process.argv[8]||1000);await hero(s,w,h,q,t,process.argv[9]||(s+'-one.png'));}
 if(which==='cost'){const rows=[];for(const s of SYS){for(const c of['10','55','100']){const r=await cost(s,1600,1000,Q1+c);rows.push([s,'desktop coh '+c,r]);console.log(s,'desktop coh',c,JSON.stringify(r));}
   const m=await cost(s,390,844,Q1+'100');console.log(s,'phone',JSON.stringify(m));const nb=await cost(s,1600,1000,Q1+'100',true);console.log(s,'desktop coh 100, no glow',JSON.stringify(nb));}}
 if(which==='flowtest'){for(const s of SYS){const ft=[5,5.35,5.7,6.05,6.4,6.75];await frames(s,'profile=anger&mask=Preteen&coh=100&load=0.3',ft,ft.map(t=>'+'+(t-5).toFixed(2)+' s'),s+'-flow-1600.png',1600,1000,{cols:3,crop:[.1,.9]});}}
 if(which==='all'){
  for(const s of SYS){
   /* beside the left menu: Tomas's own coherence is 31 percent, so the light matches the rail. The full spectrum one is the second picture. */
   await hero(s,1600,1000,Q1+'31',6,s+'-beside-1600.png');
   await hero(s,1600,1000,Q1+'100',6,s+'-beside-full-1600.png');
   await hero(s,1600,1000,Q1+'10',6,s+'-coh10-1600.png');
   await hero(s,1600,1000,'profile=anger&mask=Adult&coh=100&rail=0',6,s+'-adult-1600.png');
   await hero(s,390,844,Q1+'100',6,s+'-390.png');
   await hero(s,390,844,'profile=apathy&mask=Teen&coh=55',6,s+'-390-teen.png');
   await hero(s,1600,1000,Q1+'100&trace=1',6,s+'-trace-1600.png');
   await hero(s,390,844,'profile=apathy&mask=Teen&coh=100&trace=1',6,s+'-trace-390.png');
   await hero(s,1600,1000,Q1+'100&addr=Pride&load=1',6,s+'-hover-1600.png');
   await hero(s,1600,1000,'profile=apathy&mask=Child&coh=100&tip=Child',6,s+'-icons-1600.png');
   await sheet(s,'ladder','mask=Preteen',1600,s+'-ladder.png');
   await sheet(s,'masks','',1600,s+'-states.png');
   const op=[0,.5,1,2];
   await frames(s,Q1+'100',op,op.map(secLabel),s+'-strip-1600.png',1600,1000,{cols:2,crop:[.08,.92]});
   await frames(s,'profile=apathy&mask=Teen&coh=100',op,op.map(secLabel),s+'-strip-390.png',390,844,{cols:4});
   /* the flow, bottom to top: five frames, four tenths of a second apart, a clean field so the climb is what you see */
   const ft=[5,5.35,5.7,6.05,6.4,6.75];
   await frames(s,'profile=anger&mask=Preteen&coh=100&load=0.3',ft,ft.map(t=>'+'+(t-5).toFixed(2)+' s'),s+'-flow-1600.png',1600,1000,{cols:3,crop:[.1,.9]});
   await frames(s,'profile=anger&mask=Preteen&coh=100&load=0.3&flow=axis',ft,ft.map(t=>'+'+(t-5).toFixed(2)+' s'),s+'-flow-axis-1600.png',1600,1000,{cols:3,crop:[.1,.9]});
   /* a story written: the same person with and without it */
   await framesQ(s,[{q:'profile=anger&mask=Preteen&coh=100&load=0.25',t:6,label:'Before'},{q:'profile=anger&mask=Preteen&coh=100&load=0.25&stories=a',t:6,label:'After writing: Rewrote my section'}],s+'-story-1600.png',1600,1000,{cols:2,crop:[.08,.92]});
   console.log('done',s);}
 }
 await browser.close();})();
