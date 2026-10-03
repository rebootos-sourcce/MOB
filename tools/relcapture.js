/* THE RELEASE IN MOTION. Usage: node tools/relcapture.js OUT [width height]
   Records, frame by frame off the compositor (CDP screencast), the setup
   groups being stepped through, the running list advancing line by line with
   the two side meters creeping, the turn from the release half into the
   reframe half (the prompt arriving on its new words), a line swiped right
   into the bank and one swiped left into the shadow, and a drag along the
   scrub. Frames are numbered JPEGs with their timestamps and a marks.json
   naming where each beat starts, so the timing can be read and the frames
   put together as a strip or an animation afterwards. Round QM added the
   turn, the swipes and the scrub. */
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
  /* a short dose, so the turn into the reframe is a few lines away */
  RUN.dose=6; RUN.plan=relPlan(); relRender();
  var d=document.getElementById('msgdock'); if(d)d.style.visibility='hidden';});
 await page.waitForTimeout(400);
 const cdp=await page.context().newCDPSession(page);
 let n=0; const log=[], marks=[];
 const mark=k=>marks.push([k,n]);
 cdp.on('Page.screencastFrame',async f=>{
  const name=String(n++).padStart(4,'0')+'.jpg';
  fs.writeFileSync(path.join(OUT,name),Buffer.from(f.data,'base64'));
  log.push([name,f.metadata.timestamp]);
  try{await cdp.send('Page.screencastFrameAck',{sessionId:f.sessionId});}catch(e){}});
 await cdp.send('Page.startScreencast',{format:'jpeg',quality:80,everyNthFrame:1});
 /* the setup groups, down and back */
 await page.waitForTimeout(500); mark('setup');
 for(const id of ['#relgdn','#relgup']){await page.click(id); await page.waitForTimeout(700);}
 /* the running list, a line every 900 milliseconds, through the turn from
    the right release into the left reframe */
 await page.evaluate(()=>{if(typeof relTicker==='function')relTicker(false);
  RUN.phase='run'; RUN.idx=0; RUN.pass=0; RUN.paused=true; relRender();});
 await page.waitForTimeout(700); mark('lines');
 const steps=await page.evaluate(()=>{var s=[]; for(var i=0;i<3;i++)for(var p=0;p<RUN.dose;p++)s.push([i,p]); return s.slice(4,16);});
 for(const [i,p] of steps){
  if(i===2&&p===0)mark('turn');
  await page.evaluate(a=>{RUN.idx=a[0]; RUN.pass=a[1]; relRender();},[i,p]); await page.waitForTimeout(900);}
 /* a swipe each way on the rows either side of the centre */
 const at=async sel=>page.evaluate(s=>{var r=document.querySelector(s); if(!r)return null;
  var b=r.getBoundingClientRect(); return {x:b.left+b.width/2,y:b.top+b.height/2};},sel);
 for(const [sel,dir,k] of [['#relcarl .rel-cr-i[data-d="1"]',1,'swipe-bank'],['#relcarl .rel-cr-i[data-d="2"]',-1,'swipe-shadow']]){
  const b=await at(sel); if(!b)continue; mark(k);
  await page.mouse.move(b.x,b.y); await page.mouse.down();
  for(let s=1;s<=10;s++){await page.mouse.move(b.x+dir*s*10,b.y); await page.waitForTimeout(16);}
  await page.mouse.up(); await page.waitForTimeout(700);}
 /* the scrub, dragged across the address and let go, then Now */
 const sc=await page.evaluate(()=>{var r=document.getElementById('relscrub').getBoundingClientRect();
  return {x0:r.left+12,x1:r.right-12,y:r.top+r.height/2};});
 mark('scrub');
 await page.mouse.move(sc.x0,sc.y); await page.mouse.down();
 for(let s=0;s<=24;s++){await page.mouse.move(sc.x0+(sc.x1-sc.x0)*s/24,sc.y); await page.waitForTimeout(33);}
 await page.mouse.up(); await page.waitForTimeout(600);
 mark('now'); await page.click('#relnow'); await page.waitForTimeout(800);
 await cdp.send('Page.stopScreencast');
 const heavy=await page.evaluate(()=>RUN.heavy);
 fs.writeFileSync(path.join(OUT,'frames.json'),JSON.stringify(log));
 fs.writeFileSync(path.join(OUT,'marks.json'),JSON.stringify(marks));
 console.log('frames',n,'marks',JSON.stringify(marks),'heavy',JSON.stringify(heavy));
 await browser.close();})();
