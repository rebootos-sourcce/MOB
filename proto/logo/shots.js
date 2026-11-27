/* Screenshots and the request log for proto/logo/index.html.
   node proto/logo/shots.js   from anywhere. Writes into proto/logo/. */
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const D=__dirname;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [w,h] of [[1600,1000],[390,844]]){
  const p=await b.newPage({viewport:{width:w,height:h}});
  const reqs=[],errs=[];
  p.on('request',r=>reqs.push(r.method()+' '+r.url()));
  p.on('pageerror',e=>errs.push(String(e.message)));
  await p.goto('file://'+path.join(D,'index.html'));
  await p.waitForTimeout(900);
  await p.screenshot({path:path.join(D,`shot-${w}.png`),fullPage:true});
  const off=reqs.filter(r=>!/^GET file:/.test(r));
  fs.writeFileSync(path.join(D,`requests-${w}.log`),
   'viewport '+w+'x'+h+'\nrequests observed: '+reqs.length+'\n'+reqs.join('\n')
   +'\n\nnot a local file read: '+off.length+'\n'+off.join('\n')
   +'\npage errors: '+errs.length+'\n'+errs.join('\n')+'\n');
  console.log(w+'x'+h,'requests',reqs.length,'outbound',off.length,'errors',errs.length);
  if(off.length)console.log(off);
  if(errs.length)console.log(errs);
  await p.close();
 }
 await b.close();})();
