/* ============================================================
   SCREENSHOTS OF THE FOUR LAYOUTS, at 1600 by 1000 and 390 by 844.
     NODE_PATH=<playwright> node proto/story-redesign2/src/shoot.js [file]
   Drives the page through window.PROTO so every frame is a state, and fails
   on any page error or any outbound request rather than photographing a
   broken page.
   ============================================================ */
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'..','shots');fs.mkdirSync(OUT,{recursive:true});
const FILE=path.resolve(process.argv[2]||path.join(__dirname,'..','story-redesign2.html'));
const EX='My manager moved the deadline again and I said yes. My jaw was tight the whole call and I did not say anything. I was not scared, I was angry. Afterwards I sat in the car and my throat was really tight. I feel ashamed that I care this much. I slept well though, and I was grateful for the walk home.';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const errs=[],reqs=[];
 for(const [W,H] of [[1600,1000],[1440,900],[390,844]]){
  for(const v of ['e','f','g','h']){
   const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:1});
   p.on('pageerror',e=>errs.push(v+W+': '+e.message));
   p.on('request',r=>{if(!r.url().startsWith('file:')&&!r.url().startsWith('data:'))reqs.push(r.url());});
   await p.goto('file://'+FILE+'#'+v);await p.waitForTimeout(500);
   await p.screenshot({path:`${OUT}/${v}-${W}-blank.png`});
   await p.evaluate(t=>PROTO.type(t),EX);await p.waitForTimeout(2300);
   await p.screenshot({path:`${OUT}/${v}-${W}.png`});
   if(W===1440){await p.close();continue;}
   if(W===1600){
    await p.evaluate(()=>PROTO.sort('charge'));await p.waitForTimeout(1800);await p.screenshot({path:`${OUT}/${v}-1600-charge.png`});
    await p.evaluate(()=>PROTO.sort('weight'));await p.waitForTimeout(1800);await p.screenshot({path:`${OUT}/${v}-1600-weight.png`});
    await p.evaluate(()=>PROTO.sort('seat'));await p.waitForTimeout(300);}
   else await p.screenshot({path:`${OUT}/${v}-390-full.png`,fullPage:true});
   await p.evaluate(()=>PROTO.commit());await p.waitForTimeout(1800);
   await p.screenshot({path:`${OUT}/${v}-${W}-committed.png`});
   if(W===1600){await p.evaluate(()=>{PROTO.run();PROTO.finishRun();PROTO.vault(true);});await p.waitForTimeout(900);await p.screenshot({path:`${OUT}/${v}-1600-vault.png`});}
   await p.close();}}
 await b.close();
 console.log('errors:',errs.length?errs.join('\n'):'none');console.log('outbound requests:',reqs.length?reqs.join('\n'):'none');
 if(errs.length||reqs.length)process.exit(1);})();
