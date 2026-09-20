const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const D=__dirname;const files=process.argv.slice(2);
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const f of files){
  for(const [w,h] of [[1600,1000],[390,844]]){
   const p=await b.newPage({viewport:{width:w,height:h}});
   const reqs=[],errs=[];
   p.on('request',r=>reqs.push(r.method()+' '+r.url().slice(0,90)));
   p.on('pageerror',e=>errs.push(String(e.message)));
   await p.goto('file://'+path.join(D,f));
   await p.waitForTimeout(700);
   const scroll=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,sh:document.documentElement.scrollHeight}));
   await p.screenshot({path:path.join(D,`shot-${f.replace('.html','')}-${w}.png`),fullPage:true});
   const off=reqs.filter(r=>!/^GET file:/.test(r));
   fs.writeFileSync(path.join(D,`requests-${f.replace('.html','')}-${w}.log`),
    'viewport '+w+'x'+h+'\nrequests '+reqs.length+'\n'+reqs.join('\n')+'\nnot a local file read: '+off.length+'\n'+off.join('\n')+'\npage errors: '+errs.length+'\n'+errs.join('\n')+'\n');
   console.log(f,w+'x'+h,'reqs',reqs.length,'outbound',off.length,'errors',errs.length,
     'scrollW',scroll.sw,'clientW',scroll.cw,'height',scroll.sh, scroll.sw>scroll.cw?'HORIZONTAL SCROLL':'');
   if(errs.length)console.log(errs);
   await p.close();
  }}
 await b.close();})();
