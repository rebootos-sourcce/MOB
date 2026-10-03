/* Screenshots, the request log and the console log for proto/nav/index.html.
   NODE_PATH=/opt/node22/lib/node_modules node proto/nav/shots.js
   Writes into proto/nav/. Zero outbound requests is the claim, and the log is
   the proof: everything observed has to be a local file read. */
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const D=__dirname;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  /* THE BROWSER'S OWN BACKGROUND CALLS ARE NOT THE PAGE'S, and a log that
     carries them cannot be used to prove the page fetches nothing. They are
     switched off so the count means what it says. */
  args:['--disable-background-networking','--disable-component-update',
   '--disable-default-apps','--no-first-run','--disable-sync',
   '--disable-domain-reliability','--safebrowsing-disable-auto-update']});
 let bad=0;
 for(const [w,h] of [[1600,1000],[390,844]]){
  const p=await b.newPage({viewport:{width:w,height:h}});
  const reqs=[],errs=[];
  p.on('request',r=>reqs.push(r.method()+' '+r.url()));
  p.on('pageerror',e=>errs.push(String(e.message)));
  await p.goto('file://'+path.join(D,'index.html'));
  await p.waitForTimeout(700);
  await p.screenshot({path:path.join(D,`shot-${w}.png`),fullPage:true});
  /* and the other mode, because the whole point is that he presses both */
  await p.click('#modeB'); await p.waitForTimeout(250);
  await p.screenshot({path:path.join(D,`shot-modeB-${w}.png`),fullPage:true});
  const gate=await p.evaluate(()=>document.getElementById('tests').innerText);
  const off=reqs.filter(r=>!/^GET file:/.test(r));
  fs.writeFileSync(path.join(D,`requests-${w}.log`),
   'viewport '+w+'x'+h+'\nrequests observed: '+reqs.length+'\n'+reqs.join('\n')
   +'\n\nnot a local file read: '+off.length+'\n'+off.join('\n')
   +'\npage errors: '+errs.length+'\n'+errs.join('\n')
   +'\n\ngate:\n'+gate+'\n');
  console.log(w+'x'+h,'requests',reqs.length,'outbound',off.length,'errors',errs.length);
  if(off.length){console.log(off);bad++;}
  if(errs.length){console.log(errs);bad++;}
  if(/FAIL/.test(gate)){console.log(gate);bad++;}
  await p.close();
 }
 await b.close();
 process.exit(bad?1:0);})();
