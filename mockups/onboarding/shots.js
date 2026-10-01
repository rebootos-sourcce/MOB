/* shots.js. Draws the round PB frames to png/ at both widths.
   Run from the repo root, with playwright on the path:
     NODE_PATH=/opt/node22/lib/node_modules node mockups/onboarding/shots.js
   Optional: pass frame names to draw only those. Each frame is a page and a
   hash. It waits for the first paint, then takes the viewport, so what is
   saved is the settled frame and nothing more. */
var path=require('path'),fs=require('fs');
var pw=require('playwright');
var root=__dirname;
var FRAMES={
 'onb-01-start':['onboarding.html#start'],
 'onb-02-start-picked':['onboarding.html#start-picked'],
 'onb-01b-start-measure':['onboarding.html#start-measure'],
 'tut-q0-intro':['tutorial.html#q0'],
 'tut-q1-integrity':['tutorial.html#q1'],
 'tut-q2-dilemma':['tutorial.html#q2'],
 'tut-laws':['tutorial.html#laws'],
 'tut-q-patience-real':['tutorial.html#pat-r'],
 'tut-q-patience-dilemma':['tutorial.html#pat-d'],
 'tut-q-accountability-real':['tutorial.html#acc-r'],
 'tut-q-accountability-dilemma':['tutorial.html#acc-d'],
 'tut-q-compassion-real':['tutorial.html#com-r'],
 'tut-q-compassion-dilemma':['tutorial.html#com-d']
};
var only=process.argv.slice(2);
(async function(){
 var br=await pw.chromium.launch();
 var errors=[];
 for(var name in FRAMES){
  if(only.length&&only.indexOf(name)<0)continue;
  var spec=FRAMES[name][0].split('#'),file=spec[0],hash=spec[1];
  for(var w of [[1600,1000],[390,844]]){
   var ctx=await br.newContext({viewport:{width:w[0],height:w[1]},reducedMotion:'reduce'});
   var pg=await ctx.newPage();
   pg.on('pageerror',function(e){errors.push(name+' '+e.message);});
   pg.on('console',function(m){if(m.type()==='error')errors.push(name+' console '+m.text());});
   await pg.goto('file://'+path.join(root,file)+'#'+hash);
   await pg.waitForTimeout(250);
   await pg.screenshot({path:path.join(root,'png',name+'-'+w[0]+'.png')});
   await ctx.close();
  }
  console.log('drew',name);
 }
 await br.close();
 if(errors.length){console.log('ERRORS');errors.forEach(function(e){console.log(' ',e);});process.exit(1);}
})();
