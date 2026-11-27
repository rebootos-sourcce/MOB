/* Captures the four Field mockups for review, at 1600 and 390.
   NODE_PATH=<playwright> node proto/field/tension/src/capture.js
   Writes into proto/field/tension/shots/. Stills are of a running animation,
   so each is one frame of it; open the page to see the motion. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const DIR=path.join(__dirname,'..'), OUT=path.join(DIR,'shots');
fs.mkdirSync(OUT,{recursive:true});
const V=['a-strain','b-wire','c-heat','d-fringe'];
(async()=>{
 const b=await chromium.launch(); const log=[];
 for(const f of V)for(const [w,h] of [[1600,1000],[390,844]]){
  for(const reduced of [false,true]){
   const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:reduced?'reduce':'no-preference'});
   const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
   const reqs=[]; p.on('request',r=>{if(!r.url().startsWith('file:'))reqs.push(r.url());});
   await p.goto('file://'+path.join(DIR,f+'.html')); await p.waitForTimeout(2400);
   await p.evaluate(()=>window.scrollTo(0,0));
   const st=await p.$('#stage'); const tag=reduced?'-still':'';
   await st.screenshot({path:`${OUT}/${f}-${w}-ring${tag}.png`});
   await p.click('#b-names'); await p.waitForTimeout(1300);
   await st.screenshot({path:`${OUT}/${f}-${w}-names${tag}.png`});
   const fr=await p.evaluate(()=>__proto.S.frameMs);
   if(f==='d-fringe'&&!reduced){
    /* where the rules disagree: the pointer on a cool run in Heart, with hot
       addresses on screen outside it */
    await p.evaluate(()=>__proto.flyTo(__proto.W.find(n=>n.k==='Longing'),2.4));
    await p.waitForTimeout(1300);
    for(const k of ['shipped','pointer','add','lead']){
     await p.click(`#policy button[data-k="${k}"]`); await p.waitForTimeout(600);
     await st.screenshot({path:`${OUT}/d-policy-${k}-${w}.png`});}}
   log.push(`${f} ${w} ${reduced?'reduced':'motion'} frame ${fr.toFixed(2)}ms errors ${errs.length} requests ${reqs.length}`);
   await p.close();}}
 await b.close(); console.log(log.join('\n'));})();
