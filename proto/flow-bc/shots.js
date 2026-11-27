/* Screenshots, the request log and a known good check for proto/flow-bc.

   NODE_PATH=/opt/node22/lib/node_modules node proto/flow-bc/shots.js [ENGINE]

   ENGINE is the engine build to render against. It defaults to ../../engine.js
   beside the pages. To pin the pictures to a commit, pass a copy of that
   commit's engine.js: the pages and the engine are mirrored into a temporary
   tree so a working tree someone else is editing cannot move a number in a
   picture.

   BEFORE ANY PICTURE IS BELIEVED the script loads Gordon and checks the
   page's own CQ, expression and shadow weight against the numbers the
   product prints for him. A probe that disagrees with the product is the
   probe's bug, and this repository has been handed that twice. */
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');const os=require('os');
const D=__dirname, ENGINE=process.argv[2]||path.join(D,'..','..','engine.js');
const T=fs.mkdtempSync(path.join(os.tmpdir(),'flowbc-'));
fs.mkdirSync(path.join(T,'proto','flow-bc'),{recursive:true});
fs.copyFileSync(ENGINE,path.join(T,'engine.js'));
['body.html','compass.html'].forEach(f=>{if(fs.existsSync(path.join(D,f)))
 fs.copyFileSync(path.join(D,f),path.join(T,'proto','flow-bc',f));});
const PAGE=f=>'file://'+path.join(T,'proto','flow-bc',f);
/* the product's own figures for Gordon at f018555, read off the build */
const KNOWN={CQ:19.3,EX:8.9,DQ:53.8};
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--disable-background-networking','--disable-component-update','--disable-default-apps',
   '--no-first-run','--disable-sync','--disable-domain-reliability','--safebrowsing-disable-auto-update']});
 let bad=0; const log=[];
 const shoot=async(file,hash,w,h,out,full)=>{
  const p=await b.newPage({viewport:{width:w,height:h}});
  const reqs=[],errs=[];
  p.on('request',r=>reqs.push(r.method()+' '+r.url()));
  p.on('pageerror',e=>errs.push(String(e.message)));
  await p.goto(PAGE(file)+(hash||''));
  await p.waitForTimeout(500);
  const st=await p.evaluate(()=>window.__bs||window.__cp||null);
  await p.screenshot({path:path.join(D,out),fullPage:!!full});
  const off=reqs.filter(r=>!/^GET file:/.test(r));
  log.push(out+'  requests '+reqs.length+'  not a local file read '+off.length+'  errors '+errs.length
   +(st?'  state '+JSON.stringify(st):''));
  if(off.length||errs.length){bad++;log.push('  '+off.concat(errs).join('\n  '));}
  await p.close(); return st;};
 /* the known good check first */
 const chk=await shoot('body.html','#who=Gordon',1600,1000,'check-body-gordon.png');
 const near=(a,k)=>Math.abs(a-KNOWN[k])<=0.06;
 if(!chk||!near(+chk.CQ.toFixed(1),'CQ')||!near(+chk.EX.toFixed(1),'EX')||!near(+chk.DQ.toFixed(1),'DQ')){
  console.log('KNOWN GOOD CHECK FAILED: the page does not read Gordon the way the product does',chk);
  process.exit(2);}
 log.push('known good: Gordon CQ '+chk.CQ.toFixed(1)+' EX '+chk.EX.toFixed(1)+' DQ '+chk.DQ.toFixed(1)+', matching the product');
 if(fs.existsSync(path.join(D,'body.html'))){
  for(let n=0;n<=5;n++)await shoot('body.html','#who=Gordon&walk='+n,1600,1000,'body-1600-step'+n+'.png');
  await shoot('body.html','#who=Gordon&walk=5',390,844,'body-390-step5.png',true);
  await shoot('body.html','#who=Gordon&walk=1',390,844,'body-390-step1.png',false);}
 if(fs.existsSync(path.join(D,'compass.html'))){
  for(const who of ['Gordon','Derek','Sofia']){
   const st=await shoot('compass.html','#who='+who,1600,1000,'compass-1600-'+who+'.png',true);
   /* the same known good check, on the compass page's own reading */
   if(who==='Gordon'&&(!st||!near(+st.CQ.toFixed(1),'CQ')||!near(+st.EX.toFixed(1),'EX'))){
    console.log('KNOWN GOOD CHECK FAILED on the compass page',st); process.exit(2);}}
  await shoot('compass.html','#who=Gordon&intent=70',1600,1000,'compass-1600-Gordon-whatif.png',true);
  await shoot('compass.html','#who=Gordon',390,844,'compass-390-Gordon.png',true);}
 fs.writeFileSync(path.join(D,'shots.log'),'engine '+ENGINE+'\n'+log.join('\n')+'\n');
 console.log(log.join('\n'));
 await b.close();
 fs.rmSync(T,{recursive:true,force:true});
 process.exit(bad?1:0);})();
