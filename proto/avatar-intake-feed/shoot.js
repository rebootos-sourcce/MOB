/* Shots of every view in index.html, at 1600 by 1000 and 390 by 844, full
   page, so each drawing is looked at on both widths before it is sent.
   Fails loudly on a page error or on any request that is not the file
   itself: the page carries its type and its images, and fetches nothing.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/avatar-intake-feed/shoot.js */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const HERE=__dirname, OUT=path.join(HERE,'shots');
const VIEWS=['col','feed-a','feed-b','feed-c','arch','wheel-built','wheel-prop'];
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const bad=[];
 for(const [W,H] of [[1600,1000],[390,844]]){
  for(const v of VIEWS){
   const p=await b.newPage({viewport:{width:W,height:H}});
   p.on('pageerror',e=>bad.push(v+' '+W+': '+e.message));
   p.on('request',r=>{const u=r.url(); if(!u.startsWith('file:')&&!u.startsWith('data:'))bad.push('request '+u);});
   await p.goto('file://'+path.join(HERE,'index.html')+'#'+v);
   await p.waitForTimeout(350);
   /* no horizontal scroll at phone width, the floor every page is held to */
   const over=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   if(over>1)bad.push(v+' '+W+': scrolls sideways by '+over+'px');
   await p.screenshot({path:path.join(OUT,W+'-'+v+'.png'),fullPage:true});
   if(v==='wheel-prop'&&W===1600)console.log('proposed wheel: choices '+await p.textContent('#m-ctl')+', words '+await p.textContent('#m-wd'));
   await p.close();}}
 await b.close();
 console.log('wrote '+VIEWS.length*2+' shots'+(bad.length?'\nPROBLEMS:\n'+bad.join('\n'):', no errors, no requests, no sideways scroll'));
 if(bad.length)process.exit(1);})();
