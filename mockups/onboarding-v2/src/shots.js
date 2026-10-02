/* shots.js. Draws every beat of the mockup at 1600x1000 and 390x844 into ../png/ as NN-name.
   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node mockups/onboarding-v2/src/shots.js
   Every shot freezes the clock with the screenshot mask (bit 64), so the picture is the exact instant named here and
   the Pause ring still reads Pause. Cards are placed with the no-transition class, so there is nothing to wait for. */
var pw=require('playwright'),path=require('path'),fs=require('fs');
var out=path.join(__dirname,'..','png'),url='file://'+path.join(__dirname,'..','index.html')+'?clean';
var BEATS=[
 ['01','door',function(p){return p.evaluate(function(){MOCK.jump('login',0,{freeze:true});});}],
 ['02','reelA1',function(p){return p.evaluate(function(){MOCK.jump('A1',2.2,{freeze:true});});}],
 ['03','reelA2',function(p){return p.evaluate(function(){MOCK.jump('A2',3.7,{freeze:true});});}],
 ['04','reelA3',function(p){return p.evaluate(function(){MOCK.jump('A3',3.0,{freeze:true});});}],
 ['05','reelA4',function(p){return p.evaluate(function(){MOCK.jump('A4',3.5,{freeze:true});});}],
 ['06','reelA5',function(p){return p.evaluate(function(){MOCK.jump('A5',4.0,{freeze:true});});}],
 ['07','gate',function(p){return p.evaluate(function(){MOCK.jump('gate',0,{freeze:true});});},2300],
 ['08','gate-pick',async function(p){await p.evaluate(function(){MOCK.jump('gate',0,{freeze:true});});await p.waitForTimeout(1500);await p.evaluate(function(){MOCK.pick(7);});},1000],
 ['09','story',function(p){return p.evaluate(function(){MOCK.jump('story',0,{freeze:true});});},900],
 ['10','story-typed',async function(p){await p.evaluate(function(){MOCK.jump('story',0,{freeze:true});});await p.waitForTimeout(700);await p.fill('#words','I am afraid that nobody will stay');},300],
 ['11','story-empty',async function(p){await p.evaluate(function(){MOCK.jump('story',0,{freeze:true});});await p.waitForTimeout(700);await p.fill('#words','something about my father and the house');await p.click('#commit');},300],
 ['12','first-reading',function(p){return p.evaluate(function(){MOCK.jump('read',2.0,{freeze:true});});}],
 ['13','release-open',function(p){return p.evaluate(function(){MOCK.jump('rel-open',null,{freeze:true});});}],
 ['14','release-lines',function(p){return p.evaluate(function(){MOCK.jump('rel-lines',null,{freeze:true});});}],
 ['15','release-settle',function(p){return p.evaluate(function(){MOCK.jump('rel-settle',null,{freeze:true});});}],
 ['16','reelB1-reading',function(p){return p.evaluate(function(){MOCK.jump('b1',4.0,{freeze:true});});}],
 ['17','reelB2-loop',function(p){return p.evaluate(function(){MOCK.jump('b2',3.4,{freeze:true});});}],
 ['18','reelB3-keep',function(p){return p.evaluate(function(){MOCK.S.mode='account';MOCK.jump('b3',0,{freeze:true});});},900],
 ['19','reelB3-keep-open',async function(p){await p.evaluate(function(){MOCK.S.mode='account';MOCK.jump('b3',0,{freeze:true});});await p.waitForTimeout(500);await p.click('#b3-keep');await p.fill('#b3-u','mika@example.com');await p.fill('#b3-p','x');await p.check('#b3-tick');},900],
 ['20','reelB3-guest',function(p){return p.evaluate(function(){MOCK.S.mode='guest';MOCK.jump('b3',0,{freeze:true});});},900],
 ['21','signal-test',function(p){return p.evaluate(function(){MOCK.jump('sig',9.0,{freeze:true});});}],
 ['22','signal-question',function(p){return p.evaluate(function(){MOCK.jump('sigq',null,{freeze:true});});},900],
 ['23','stop-frame',function(p){return p.evaluate(function(){MOCK.S.stopv='direct';MOCK.showStop(true);});}],
 ['24','stop-frame-indirect',function(p){return p.evaluate(function(){MOCK.S.stopv='indirect';MOCK.showStop(true);});}],
 ['25','field-end',function(p){return p.evaluate(function(){MOCK.S.end='notnow';MOCK.jump('end',0,{freeze:true});});}]
];
var only=process.argv.slice(2);
(async function(){
 var br=await pw.chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 var errs=[];
 for(var vp of [[1600,1000],[390,844]]){
  var ctx=await br.newContext({viewport:{width:vp[0],height:vp[1]}});var pg=await ctx.newPage();
  pg.on('pageerror',function(e){errs.push(e.message);});pg.on('console',function(m){if(m.type()==='error')errs.push(m.text());});
  await pg.goto(url);await pg.waitForTimeout(500);
  for(var b of BEATS){
   if(only.length&&only.indexOf(b[0])<0&&only.indexOf(b[1])<0)continue;
   await pg.evaluate(function(){MOCK.showStop(false);});
   await b[2](pg);await pg.waitForTimeout(b[3]||450);
   var f=path.join(out,vp[0]+'-'+b[0]+'-'+b[1]+'.png');await pg.screenshot({path:f});console.log(path.basename(f));}
  await ctx.close();}
 await br.close();
 if(errs.length){console.log('ERRORS');errs.forEach(function(e){console.log(' ',e);});process.exit(1);}
})();
