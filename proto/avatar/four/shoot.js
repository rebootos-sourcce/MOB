/* ============================================================
   SHOOT THE FOUR, AND CHECK WHAT IS SHOT.

   Every state is opened from its own address, so any picture can be
   reproduced. Beside each picture it checks the page against the product:
   no page errors, the drawing is there, the big number is the engine's CQ,
   the release count is the record's, and at 390 nothing scrolls sideways.

     node proto/avatar/four/build.js
     NODE_PATH=/opt/node22/lib/node_modules node proto/avatar/four/shoot.js
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'shots');
const PAGE='file://'+path.join(__dirname,'four.html');
fs.mkdirSync(OUT,{recursive:true});
let fails=0,passes=0;
const ok=(c,msg)=>{if(c)passes++;else{fails++;console.log('  FAIL',msg);}};
const V=['figure','nerves','channel','ring'];
const PLAN=[];
[1600,390].forEach(W=>V.forEach(v=>[0,4,12].forEach(r=>PLAN.push({W,v,who:'James',runs:r}))));
V.forEach(v=>PLAN.push({W:1600,v,who:'blank',runs:0}));
V.forEach(v=>PLAN.push({W:1600,v,who:'Angela',runs:0}),{});
V.forEach(v=>PLAN.push({W:1600,v,who:'Angela',runs:9}));
V.forEach(v=>['snow','punch','glass'].forEach(L=>PLAN.push({W:1600,v,who:'James',runs:4,light:L})));
PLAN.push({W:1600,v:'off',who:'James',runs:0});
PLAN.push({W:390,v:'off',who:'James',runs:0});
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const facts=[];
 for(const W of [1600,390]){
  const ctx=await b.newContext({viewport:{width:W,height:W===390?844:1000},deviceScaleFactor:W===390?2:1,
   isMobile:W===390,hasTouch:W===390});
  const p=await ctx.newPage();
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  for(const s of PLAN.filter(x=>x.W===W)){
   const hash='#v='+s.v+'&who='+s.who+'&runs='+s.runs+(s.light?'&light='+s.light:'');
   await p.goto('about:blank');await p.goto(PAGE+hash);
   await p.waitForFunction(()=>document.documentElement.getAttribute('data-avx-ready')==='1',null,{timeout:30000});
   await p.waitForTimeout(500);
   const f=await p.evaluate(()=>{
    const R=AVX.read(),svg=document.querySelector('#avx .avx-svg'),big=document.querySelector('#avx .avx-big b');
    const cq=document.querySelector('#avx .avx-cq');
    return {els:svg?svg.querySelectorAll('*').length:0,
     big:big?big.textContent:null,cqTxt:cq?cq.textContent:null,
     CQ:R.CQ,unread:R.unread,rel:R.rec.n,runs:AVX.ST.runs,
     relTxt:(document.querySelector('#avx .avx-read .avx-n:last-child b')||{}).textContent,
     engineCQ:compute().CQ,overflow:document.documentElement.scrollWidth-innerWidth,
     svgH:svg?svg.getBoundingClientRect().height:0,
     /* the last line of the reading must sit inside the stage, which clips */
     clip:(function(){var li=document.querySelector('#avx .avx-chain li:last-child,#avx .avx-door'),st=document.querySelector('.stage');
      return li&&st?Math.round(li.getBoundingClientRect().bottom-st.getBoundingClientRect().bottom):null;})()};});
   const name=(s.light?s.light+'-':'')+s.v+'-'+s.who+'-'+s.runs+'-'+W;
   if(s.v!=='off'){
    ok(f.els>(f.unread?10:20),name+': the drawing has '+f.els+' elements');
    ok(f.svgH>200,name+': the drawing is '+f.svgH+' px tall');
    ok(f.clip!==null&&f.clip<=0,name+': the reading is cut off by the stage, '+f.clip+' px below its edge');
    ok(Math.abs(f.CQ-f.engineCQ)<1e-9,name+': avatar CQ '+f.CQ+' is not the engine\'s '+f.engineCQ);
    if(!f.unread){
     if(s.v==='ring')ok(f.cqTxt===String(Math.round(f.CQ)),name+': ring centre prints '+f.cqTxt);
     else ok(f.big===String(Math.round(f.CQ)),name+': big number prints '+f.big);
     ok(f.relTxt===String(f.rel),name+': released prints '+f.relTxt+' against the record '+f.rel);}
    else ok(f.cqTxt==='–'||f.big==='–'||f.big===null,name+': unread prints a number');}
   if(W===390)ok(f.overflow<=0,name+': scrolls sideways by '+f.overflow);
   /* the phone page scrolls inside body (overflow:auto at the viewport height),
      so a capture stops at the viewport and leaves the rest unpainted. The
      layout is whole, measured: the stage holds all of #avx. The camera is
      given the height instead, for this one capture. */
   if(W===390&&s.v!=='off'){await p.setViewportSize({width:390,height:1600});await p.waitForTimeout(250);
    await p.locator('#avx').screenshot({path:path.join(OUT,name+'.png')});
    await p.setViewportSize({width:390,height:844});}
   else await p.screenshot({path:path.join(OUT,name+'.png')});
   facts.push(Object.assign({name},f));}
  ok(errs.length===0,W+': page errors '+errs.join(' | '));
  await ctx.close();}
 fs.writeFileSync(path.join(OUT,'facts.json'),JSON.stringify(facts,null,1));
 await b.close();
 console.log(passes+' checks passed, '+fails+' failed, '+facts.length+' pictures');
 process.exit(fails?1:0);})();
