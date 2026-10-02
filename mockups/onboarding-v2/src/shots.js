/* shots.js. Draws every beat of the mockup at 1600x1000 and 390x844 into ../png/ as NN-name, in the order the person meets them.
   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node mockups/onboarding-v2/src/shots.js [beat ...]
   Frozen beats use the screenshot mask (bit 64): the clock and the ambient drift stop, so the picture is the exact instant
   named here. Beats that show an answer click the real control and wait for the Field to settle, so they show what the
   person would see. Run with no arguments to redraw everything (it first clears ../png). */
var pw=require('playwright'),path=require('path'),fs=require('fs');
var out=process.env.SHOTS_OUT||path.join(__dirname,'..','png'),url='file://'+path.join(__dirname,'..','index.html')+'?clean';
function J(k,t,extra){return function(p){return p.evaluate(function(A){MOCK.restart(true);MOCK.jump(A.k,A.t,{freeze:true,keep:A.e});},{k:k,t:t,e:!!extra});};}
async function typeStory(p,txt){await p.fill('#words',txt);}
var BEATS=[
 ['01','door',J('login',0)],
 ['02','transit',J('transit',.62)],
 ['03','arrive-welcome',J('arr1',2.2)],
 ['04','arrive-invitation',J('arr2',3.0)],
 ['05','ask',J('ask',2)],
 ['06','ask-pick',async function(p){await J('ask',2)(p);await p.waitForTimeout(300);await p.evaluate(function(){MOCK.pickStart(2);});},900],
 ['07','settle-awareness',J('settle',3.0)],
 ['08','settle-notice',J('settle',9.5)],
 ['09','feel',J('feel',2)],
 ['10','feel-tap',async function(p){await J('feel',2)(p);await p.waitForTimeout(300);await p.evaluate(function(){MOCK.pickFeel(0);});},1500],
 ['11','body',J('body',2)],
 ['12','body-tap',async function(p){await J('body',2)(p);await p.waitForTimeout(300);await p.evaluate(function(){MOCK.pickPlace(3);});},1700],
 ['13','story',J('story',2)],
 ['14','story-typed',async function(p){await J('story',2)(p);await p.waitForTimeout(500);await typeStory(p,'I was trying to handle everyone and nobody asked if I was okay');},500],
 ['15','mirror',J('mirror',12)],
 ['16','mirror-not-quite',async function(p){await J('mirror',12)(p);await p.waitForTimeout(400);await p.click('#m-no');await p.fill('#m-in','it is more in my throat');},800],
 ['17','mirror-adjusted',async function(p){await J('mirror',12)(p);await p.waitForTimeout(400);await p.evaluate(function(){MOCK.applyFix('it is more in my throat');});},2600],
 ['18','recognition',async function(p){await J('mirror',12)(p);await p.waitForTimeout(400);await p.click('#m-yes');},900],
 ['19','bridge',J('recog',5)],
 ['20','release-open',J('rel-open')],
 ['21','release-lines',J('rel-lines')],
 ['22','release-settle',J('rel-settle')],
 ['23','reelB1-reading',J('b1',4.0)],
 ['24','reelB2-loop',J('b2',3.4)],
 ['25','reelB3-keep',function(p){return p.evaluate(function(){MOCK.restart(true);MOCK.S.mode='account';MOCK.jump('b3',0,{freeze:true});});},900],
 ['26','reelB3-keep-open',async function(p){await p.evaluate(function(){MOCK.restart(true);MOCK.S.mode='account';MOCK.jump('b3',0,{freeze:true});});await p.waitForTimeout(500);await p.click('#b3-keep');await p.fill('#b3-u','mika@example.com');await p.fill('#b3-p','x');await p.check('#b3-tick');},900],
 ['27','reelB3-guest',function(p){return p.evaluate(function(){MOCK.restart(true);MOCK.S.mode='guest';MOCK.jump('b3',0,{freeze:true});});},900],
 ['28','signal-test',J('sig',9.0)],
 ['29','signal-question',J('sigq')],
 ['30','stop-frame',function(p){return p.evaluate(function(){MOCK.S.stopv='direct';MOCK.showStop(true);});}],
 ['31','stop-frame-indirect',function(p){return p.evaluate(function(){MOCK.S.stopv='indirect';MOCK.showStop(true);});}],
 ['32','field-end',function(p){return p.evaluate(function(){MOCK.restart(true);MOCK.S.end='notnow';MOCK.jump('end',0,{freeze:true});});}]
];
var only=process.argv.slice(2);
(async function(){
 if(!only.length){fs.readdirSync(out).forEach(function(f){if(/\.png$/.test(f)&&!/^(filmstrip|motion|still)/.test(f))fs.unlinkSync(path.join(out,f));});}
 var br=await pw.chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 var errs=[];
 for(var vp of [[1600,1000],[390,844]]){
  var ctx=await br.newContext({viewport:{width:vp[0],height:vp[1]}});var pg=await ctx.newPage();
  pg.on('pageerror',function(e){errs.push(e.message);});pg.on('console',function(m){if(m.type()==='error')errs.push(m.text());});
  await pg.goto(url);await pg.waitForTimeout(500);
  for(var b of BEATS){
   if(only.length&&only.indexOf(b[0])<0&&only.indexOf(b[1])<0)continue;
   await pg.evaluate(function(){MOCK.showStop(false);});
   await b[2](pg);await pg.waitForTimeout(b[3]||1400);
   var f=path.join(out,vp[0]+'-'+b[0]+'-'+b[1]+'.png');await pg.screenshot({path:f});console.log(path.basename(f));}
  await ctx.close();}
 await br.close();
 if(errs.length){console.log('ERRORS');errs.forEach(function(e){console.log(' ',e);});process.exit(1);}
})();
