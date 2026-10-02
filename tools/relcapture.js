/* THE CAROUSEL IN MOTION. Usage: node tools/relcapture.js OUT [width height]
   Records the running list advancing six lines and the setup groups being
   stepped through, frame by frame off the compositor (CDP screencast), and
   writes the frames as numbered JPEGs with their timestamps, so the glide
   and the brightness steps can be judged at their real timing and put
   together as a strip or an animation afterwards. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=process.argv[2]||'cap-rel';
const W=+(process.argv[3]||390), H=+(process.argv[4]||844);
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const page=await browser.newPage({viewport:{width:W,height:H}});
 await page.goto(FILE,{waitUntil:'load'});
 try{await page.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
 await page.waitForTimeout(700);
 await page.evaluate(()=>{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();
  loadP(0);
  ['My father never listened. I kept quiet and swallowed the anger for years, and I still feel ashamed when I speak up at work.',
   'I am afraid I will be left. When she goes quiet I panic and try to control everything, and my chest goes tight.']
   .forEach(function(t){ST_TEXT=t; ST_PARSED=parseStory(t); stCommit();});
  compute(); setTab(TAB.FIELD); render();
  relPick(W.filter(function(n){return n.sq>=1;}).sort(function(a,b){return b.sq-a.sq;}).slice(0,6).map(function(n){return n.i;}));
  var st=document.getElementById('status'); if(st)st.style.display='none';});
 await page.waitForTimeout(400);
 const cdp=await page.context().newCDPSession(page);
 let n=0; const log=[];
 cdp.on('Page.screencastFrame',async f=>{
  const name=String(n++).padStart(4,'0')+'.jpg';
  fs.writeFileSync(path.join(OUT,name),Buffer.from(f.data,'base64'));
  log.push([name,f.metadata.timestamp]);
  try{await cdp.send('Page.screencastFrameAck',{sessionId:f.sessionId});}catch(e){}});
 await cdp.send('Page.startScreencast',{format:'jpeg',quality:80,everyNthFrame:1});
 /* the setup groups, down and back */
 await page.waitForTimeout(500);
 for(const id of ['#relgdn','#relgup']){await page.click(id); await page.waitForTimeout(700);}
 await page.click('[data-relgrp="seat"]'); await page.waitForTimeout(700);
 await page.click('#relgdn'); await page.waitForTimeout(700);
 /* the running list, a line every 900 milliseconds */
 await page.evaluate(()=>{if(typeof relTicker==='function')relTicker(false);
  RUN.phase='run'; RUN.idx=0; RUN.pass=0; RUN.paused=true; relRender();});
 await page.waitForTimeout(700);
 for(let k=1;k<=6;k++){await page.evaluate(k=>{RUN.pass=k; relRender();},k); await page.waitForTimeout(900);}
 await cdp.send('Page.stopScreencast');
 fs.writeFileSync(path.join(OUT,'frames.json'),JSON.stringify(log));
 console.log('frames',n);
 await browser.close();})();
