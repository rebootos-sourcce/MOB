/* ============================================================
   SCREENSHOTS OF THE FOUR MOCKUPS, at 1600 and 390.
     NODE_PATH=<playwright> node proto/story-redesign/src/shoot.js [file]
   Drives the page through window.PROTO so every frame is a state, and
   fails on any page error rather than photographing a broken page.
   ============================================================ */
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'..','shots');fs.mkdirSync(OUT,{recursive:true});
const FILE=path.resolve(process.argv[2]||path.join(__dirname,'..','story-redesign.html'));
const EX='My manager moved the deadline again and I said yes. My jaw was tight the whole call and I did not say anything. I was not scared, I was angry. Afterwards I sat in the car and my throat was really tight. I feel ashamed that I care this much. I slept well though, and I was grateful for the walk home.';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const errs=[],reqs=[];
 for(const [W,H] of [[1600,1000],[390,844]]){
  for(const v of ['a','b','c','d']){
   const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:1});
   p.on('pageerror',e=>errs.push(v+W+': '+e.message));
   p.on('request',r=>{if(!r.url().startsWith('file:')&&!r.url().startsWith('data:'))reqs.push(r.url());});
   await p.goto('file://'+FILE+'#'+v);await p.waitForTimeout(500);
   if(W===1600){await p.screenshot({path:`${OUT}/${v}-1600-blank.png`});}
   await p.evaluate(t=>PROTO.type(t),EX);await p.waitForTimeout(1600);
   await p.screenshot({path:`${OUT}/${v}-${W}.png`,fullPage:W<500});
   if(W===1600){await p.screenshot({path:`${OUT}/${v}-1600-full.png`,fullPage:true});
    /* a moment mid read: the demo typist, caught while a word is in flight */
    await p.evaluate(()=>PROTO.demo('My jaw was tight the whole call and I did not say anything. I was angry.',26));
    /* wait for a word that is actually in the air, the third flight, then a
       quarter of its path, so the frame shows a read in progress */
    await p.waitForFunction(()=>{window.__f=(window.__f||0);const f=document.querySelector('.flt');if(f&&!f.__seen){f.__seen=1;window.__f++;}return window.__f>=3&&!!document.querySelector('.flt');},null,{timeout:8000,polling:10});
    await p.waitForTimeout(170);await p.screenshot({path:`${OUT}/${v}-1600-motion.png`});await p.waitForTimeout(2600);}
   await p.close();}}
 /* the release, run, on D, where the dial is the run; and the root question with earlier entries on A */
 const p=await b.newPage({viewport:{width:1600,height:1000}});p.on('pageerror',e=>errs.push('extra: '+e.message));
 await p.goto('file://'+FILE+'#a');await p.waitForTimeout(400);await p.evaluate(()=>PROTO.prior(true));
 await p.evaluate(t=>PROTO.type(t),EX);await p.waitForTimeout(1500);await p.screenshot({path:`${OUT}/a-1600-earlier.png`});
 await p.evaluate(()=>{PROTO.setV('d');PROTO.rel({src:'story'});PROTO.run();});await p.waitForTimeout(5200);
 await p.screenshot({path:`${OUT}/d-1600-run.png`,fullPage:true});
 await b.close();
 console.log('errors:',errs.length?errs.join('\n'):'none');console.log('outbound requests:',reqs.length?reqs.join('\n'):'none');
 if(errs.length||reqs.length)process.exit(1);})();
