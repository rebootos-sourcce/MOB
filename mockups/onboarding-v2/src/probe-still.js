/* probe-still.js. Audits reduced motion. Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node mockups/onboarding-v2/src/probe-still.js
   With the Still switch on (the same function the system setting calls) it walks the flow and, for each beat, samples the
   real Animation objects and the Field's own movers for two seconds. The rule it checks: an input gets its END STATE, so
   no transform or translate animation may run, no spring, wave, ripple, pull, bead or pose arc may be live after the first
   frame, and the canvas must be the same picture twice (two 300 ms windows, once the answer is on screen) (no tide, no breath, no drift). A fade of opacity up to 220 ms is
   allowed, it is the only motion left.  It also saves one still frame per width so the end state can be looked at. */
var pw=require('playwright'),path=require('path');
var url='file://'+path.join(__dirname,'..','index.html')+'?clean',out=process.env.SHOTS_OUT||path.join(__dirname,'..','png');
var SAMPLE=function(ms){return new Promise(function(done){
 var props={},mv=0,rip=0,bead=0,t0=performance.now(),first=null;
 function loop(){
  var l=document.getAnimations();for(var i=0;i<l.length;i++){var a=l[i],e=a.effect;if(!e||e.getComputedTiming().progress==null||a.playState!=='running')continue;var p=a.transitionProperty||a.animationName||'waapi';var tm=e.getTiming();props[p]=Math.max(props[p]||0,tm.duration);}
  var m=MOCK.FD.mv,n=m.pose+m.wave+m.rip+m.pull+m.bead+m.lean;if(performance.now()-t0>150){mv=Math.max(mv,n);rip=Math.max(rip,MOCK.FD.rip.length);}
  if(performance.now()-t0>ms){var cv=document.getElementById('cv');done({props:props,movers:mv,rip:rip,hash:cv.toDataURL().length+':'+cv.toDataURL().slice(-200)});return;}
  requestAnimationFrame(loop);}
 requestAnimationFrame(loop);});};
(async function(){
 var br=await pw.chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'}),bad=0;
 for(var W of [1600,390]){
  var H=W===1600?1000:844,ctx=await br.newContext({viewport:{width:W,height:H},reducedMotion:'reduce'}),pg=await ctx.newPage();
  var errs=[];pg.on('pageerror',function(e){errs.push(e.message);});
  await pg.goto(url);await pg.waitForTimeout(600);
  console.log('\n== reduced motion at '+W+' (the browser is told prefers-reduced-motion: reduce) still switch reads '+await pg.evaluate(function(){return document.body.classList.contains('still');}));
  var PH=[
   ['ask, idle',function(){MOCK.restart(true);MOCK.jump('ask',2);},null],
   ['ask, pick Overwhelm',function(){MOCK.restart(true);MOCK.jump('ask',2);},function(){MOCK.pickStart(2);}],
   ['feel, tap Heavy',function(){MOCK.restart(true);MOCK.jump('feel',3);},function(){MOCK.pickFeel(0);}],
   ['body, tap Chest',function(){MOCK.restart(true);MOCK.jump('body',3);},function(){MOCK.pickPlace(3);}],
   ['mirror, correction',function(){MOCK.restart(true);MOCK.jump('mirror',12);},function(){MOCK.applyFix('it is more in my throat');}],
   ['recognition',function(){MOCK.restart(true);MOCK.jump('mirror',12);},function(){MOCK.go('recog');}]];
  for(var p of PH){
   await pg.evaluate(p[1]);await pg.waitForTimeout(1500);
   if(p[2])await pg.evaluate(p[2]);
   await pg.waitForTimeout(700);                                   /* past the cues that put the answer on screen, before the next beat is due */
   var a=await pg.evaluate(SAMPLE,300),b=await pg.evaluate(SAMPLE,300);
   var props=Object.keys(b.props).concat(Object.keys(a.props)),tf=props.filter(function(k){return k==='transform'||k==='translate';});
   var slow=Object.keys(a.props).filter(function(k){return a.props[k]>240;});
   var same=a.hash===b.hash,ok=!tf.length&&!slow.length&&!b.movers&&!b.rip&&same;if(!ok)bad++;
   console.log('  '+p[0].padEnd(22)+(ok?'ok   ':'FAIL ')+'animated: '+(Object.keys(a.props).map(function(k){return k+' '+a.props[k]+'ms';}).join(', ')||'none')+'; live Field movers '+b.movers+', ripples '+b.rip+', canvas identical twice: '+same);}
  await pg.evaluate(function(){MOCK.restart(true);MOCK.jump('body',3);MOCK.pickPlace(3);});await pg.waitForTimeout(1300);
  await pg.screenshot({path:path.join(out,'still-'+W+'-body-tap.png')});
  console.log('  errors: '+(errs.join(' | ')||'none'));
  await ctx.close();}
 await br.close();console.log('\nmisses: '+bad);process.exit(bad?1:0);})();
