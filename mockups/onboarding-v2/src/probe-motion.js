/* probe-motion.js. Measures the intro's motion, it does not eyeball it. Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node mockups/onboarding-v2/src/probe-motion.js [1600|390] [--json out.json]
   It plays the whole first run at 1x like a person would (answers after a short think time), and records:
     per text card: enter (first word starts to last word ends, so it includes the stagger), hold (enter end to exit start),
       exit (all words together). These come from the real Animation objects (document.getAnimations), not from the CSS.
     per beat: the most things moving at once, and the typical number while anything moves. A thing is one choreographed
       group: a card's words, a chip set, the trail, the body targets, the text box glide, a section fade, plus the canvas
       movers (pose arc, the answer wave, a ripple, the pull, the bead, the lean). The ambient tide (112 ticks drifting, the
       breath and the 28 motes) is always on and is NOT counted, it is the ground the things move over.
     frame rate per beat: gaps between requestAnimationFrame callbacks, and the page's own cost per frame (step plus draw).
   The machine is shared. It prints the load average at the start and the end, and every fps figure should be read with it. */
var pw=require('playwright'),path=require('path'),os=require('os'),fs=require('fs');
var url='file://'+path.join(__dirname,'..','index.html')+'?clean';
var W=+process.argv[2]||1600,H=W===1600?1000:844,jsonOut=null;
var ji=process.argv.indexOf('--json');if(ji>0)jsonOut=process.argv[ji+1];

var SAMPLER=function(){
 var P=window.__P={frames:[],anims:new Map(),cards:new Map(),n:0};
 function cardId(c){if(!P.cards.has(c))P.cards.set(c,{id:++P.n,beat:c.dataset.beat});return P.cards.get(c);}
 function cardKey(el,card){var rv=el.closest('.rv.hold');if(rv){if(!rv.__id)rv.__id=++P.n;P.cards.set(rv,{id:rv.__id,beat:card.dataset.beat+' line'});return rv.__id;}return cardId(card).id;}
 function grp(el){
  if(!el||!el.closest)return 'other';
  var c=el.closest('.card');if(c){var ci=cardId(c);return 'card#'+ci.id;}
  var ch=el.closest('.chipset');if(ch)return 'chips:'+(ch.classList.contains('feel')?'feel':'start');
  if(el.closest('#trail'))return 'trail';
  if(el.closest('#bodyt')||el.id==='body-ns')return 'body targets';
  if(el.id==='fq')return 'text box glide';
  if(el.classList.contains('act'))return 'section fade';
  if(el.closest('.after'))return 'reveal';
  if(el.closest('#seals,.stats'))return 'release counter';
  return (el.id?'#'+el.id:'.'+(el.className&&el.className.baseVal===undefined?String(el.className).split(' ')[0]:'x'));}
 function loop(ts){
  var list=document.getAnimations(),act=MOCK.S.act,gs={};
  for(var i=0;i<list.length;i++){var a=list[i],e=a.effect;if(!e||!e.getComputedTiming)continue;
   var ct=e.getComputedTiming();if(ct.progress==null||a.playState!=='running')continue;
   var g=grp(e.target);if(g==='.lg-wash')continue;gs[g]=1;
   if(!P.anims.has(a)){var tm=e.getTiming(),el=e.target,card=el&&el.closest&&el.closest('.card');
    P.anims.set(a,{g:g,prop:a.transitionProperty||a.animationName||'waapi',start:(document.timeline.currentTime-a.currentTime)+(tm.delay||0),dur:tm.duration,card:card?cardKey(el,card):0,beat:card?(el.closest('.rv.hold')?card.dataset.beat+' line':cardId(card).beat):'',out:!!(el&&el.closest&&el.closest('.card.out')),act:act});}}
  var mv=MOCK.FD.mv,cn=mv.pose+mv.wave+mv.rip+mv.pull+mv.bead+mv.lean;
  var keys=Object.keys(gs);
  P.frames.push([ts,act,keys.length,cn,keys.join('|')]);
  requestAnimationFrame(loop);}
 requestAnimationFrame(loop);
 MOCK.MEAS.rec=true;MOCK.MEAS.ft.length=0;
};

function pct(a,p){if(!a.length)return 0;var s=a.slice().sort(function(x,y){return x-y;});return s[Math.min(s.length-1,Math.floor(p*s.length))];}
function r(x,d){var m=Math.pow(10,d||0);return Math.round(x*m)/m;}

(async function(){
 var load0=os.loadavg();
 var br=await pw.chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 var ctx=await br.newContext({viewport:{width:W,height:H}});var pg=await ctx.newPage();
 var errs=[];pg.on('pageerror',function(e){errs.push(e.message);});pg.on('console',function(m){if(m.type()==='error')errs.push(m.text());});
 await pg.goto(url);await pg.waitForTimeout(600);
 await pg.evaluate(SAMPLER);
 async function until(act,max){var t0=Date.now();while(Date.now()-t0<(max||60000)){var a=await pg.evaluate(function(){return MOCK.S.act;});if(a===act)return true;await pg.waitForTimeout(60);}throw new Error('timeout waiting for '+act);}
 var T0=await pg.evaluate(function(){return performance.now();});
 await pg.click('#lg-guest');
 await until('ask',30000);
 await pg.waitForTimeout(2200);                       /* think time: read the question and the ring */
 await pg.click('.chip[data-k=overwhelm]');
 await until('settle',10000);await until('feel',30000);
 await pg.waitForTimeout(1800);
 await pg.click('.chip[data-k=heavy]');
 await until('body',10000);
 await pg.waitForTimeout(2000);
 await pg.click('.bt[data-s="3"]');
 await until('story',10000);
 await pg.waitForTimeout(1500);
 await pg.fill('#words','I was trying to handle everyone and nobody asked if I was okay');
 await pg.waitForTimeout(600);
 await pg.click('#st-done');
 await until('mirror',10000);
 await pg.waitForSelector('#mq.in',{timeout:30000});
 await pg.waitForTimeout(1800);
 await pg.click('#m-no');await pg.waitForTimeout(900);
 await pg.fill('#m-in','it is more in my throat');await pg.keyboard.press('Enter');
 await pg.waitForSelector('#mq.in',{timeout:30000});await pg.waitForTimeout(1500);
 await pg.click('#m-yes');
 await until('recog',10000);
 await pg.waitForSelector('#rc-go.in',{timeout:30000});await pg.waitForTimeout(1200);
 await pg.click('#go-rel');
 await until('b1',90000);
 await pg.waitForTimeout(3600);await pg.click('#b1-btn');
 await until('b3',20000);await pg.waitForTimeout(2200);
 await pg.click('#b3-guestgo');await pg.waitForTimeout(600);
 var res=await pg.evaluate(function(){
  var P=window.__P,tr=MOCK.S.trace,out={};
  out.frames=P.frames;out.anims=[];P.anims.forEach(function(v){out.anims.push(v);});out.trace=tr;out.ft=MOCK.MEAS.ft;out.dpr=window.devicePixelRatio;return out;});
 var load1=os.loadavg();
 await br.close();

 /* ---- fold the raw record into the table */
 var tr=res.trace.filter(function(e){return e.ev==='go';});
 var beats=[];for(var i=0;i<tr.length;i++){beats.push({id:tr[i].id,t0:tr[i].t,t1:i+1<tr.length?tr[i+1].t:res.frames[res.frames.length-1][0]});}
 function inBeat(t,b){return t>=b.t0&&t<b.t1;}
 var rows=[],cardsByBeat={};
 res.anims.forEach(function(a){if(!a.card)return;var k=a.card;cardsByBeat[k]=cardsByBeat[k]||{beat:a.beat,inS:1e18,inE:0,outS:1e18,outE:0,n:0};var c=cardsByBeat[k],s=a.start,e=a.start+a.dur;
  if(a.out){c.outS=Math.min(c.outS,s);c.outE=Math.max(c.outE,e);}else{c.inS=Math.min(c.inS,s);c.inE=Math.max(c.inE,e);c.n++;}});
 var cards=Object.keys(cardsByBeat).map(function(k){var c=cardsByBeat[k];return {beat:c.beat,enter:c.inE-c.inS,hold:c.outS<1e17?c.outS-c.inE:null,exit:c.outS<1e17?c.outE-c.outS:null,words:c.n,t:c.inS};}).sort(function(a,b){return a.t-b.t;});
 /* per beat */
 var table=beats.map(function(b){
  var fr=res.frames.filter(function(f){return inBeat(f[0],b);});
  var things=fr.map(function(f){return f[2]+(f[3]?1:0);}),peak=0,pk='',rawpeak=0;
  fr.forEach(function(f){var n=f[2]+(f[3]?1:0);if(n>peak){peak=n;pk=f[4]+(f[3]?'|Field ('+f[3]+' movers)':'');}rawpeak=Math.max(rawpeak,f[2]+f[3]);});
  var act=things.filter(function(x){return x>0;});
  var dts=[];for(var j=1;j<fr.length;j++)dts.push(fr[j][0]-fr[j-1][0]);
  var ft=res.ft.filter(function(f){return inBeat(f[0],b);});var cost=ft.map(function(f){return f[2];});
  var cs=cards.filter(function(c){return c.t>=b.t0&&c.t<b.t1;});
  return {rawpeak:rawpeak,beat:b.id,len:(b.t1-b.t0)/1000,cards:cs,peak:peak,peakWhat:pk,typ:act.length?pct(act,.5):0,fps:dts.length?1000/(dts.reduce(function(a,x){return a+x;},0)/dts.length):0,p95:pct(dts,.95),worst:dts.length?Math.max.apply(null,dts):0,costAvg:cost.length?cost.reduce(function(a,x){return a+x;},0)/cost.length:0,costMax:cost.length?Math.max.apply(null,cost):0,frames:fr.length};});
 /* merge consecutive release-line cards into one row, and fold repeats of the same beat */
 var merged={};table.forEach(function(t){var m=merged[t.beat];if(!m)merged[t.beat]=JSON.parse(JSON.stringify(t));else{m.len+=t.len;m.cards=m.cards.concat(t.cards);m.peak=Math.max(m.peak,t.peak);m.frames+=t.frames;}});
 var order=[];table.forEach(function(t){if(order.indexOf(t.beat)<0)order.push(t.beat);});
 console.log('\n=== motion probe at '+W+' x '+H+' (dpr '+res.dpr+'), played at 1x ===');
 console.log('load average before '+load0.map(function(x){return x.toFixed(1);}).join(' ')+', after '+load1.map(function(x){return x.toFixed(1);}).join(' ')+', cpus '+os.cpus().length+'. The machine is shared: read every fps below with that load.');
 console.log('\nbeat'.padEnd(9)+'len s'.padStart(7)+'  card (words)'.padEnd(15)+'enter ms'.padStart(9)+'hold ms'.padStart(9)+'exit ms'.padStart(9)+'  peak things (what)'.padEnd(5));
 order.forEach(function(id){var t=merged[id],cs=t.cards;
  if(!cs.length){console.log(id.padEnd(9)+r(t.len,1).toString().padStart(7)+'  (no text)'.padEnd(15)+''.padStart(27)+'  '+t.peak+' ('+(t.peakWhat||'').slice(0,60)+')');return;}
  function mm(a){return a.length?r(Math.min.apply(null,a))+'-'+r(Math.max.apply(null,a)):'-';}
  function line(c,i,nm){console.log((i?'':id).padEnd(9)+(i?'':r(t.len,1).toString()).padStart(7)+('  '+nm+' ('+Math.max(1,Math.floor(c.words/3))+' w)').padEnd(15)+String(r(c.enter)).padStart(9)+String(c.hold==null?'-':r(c.hold)).padStart(9)+String(c.exit==null?'-':r(c.exit)).padStart(9)+(i?'':'  '+t.peak+' ('+(t.peakWhat||'').slice(0,60)+')'));}
  if(cs.length>4){cs.slice(0,3).forEach(function(c,i){line(c,i,'card '+(i+1));});var rest=cs.slice(3);
   console.log(''.padEnd(9)+''.padStart(7)+('  '+rest.length+' more').padEnd(15)+mm(rest.map(function(c){return c.enter;})).padStart(9)+mm(rest.filter(function(c){return c.hold!=null&&c.hold>0;}).map(function(c){return c.hold;})).padStart(9)+mm(rest.filter(function(c){return c.exit!=null;}).map(function(c){return c.exit;})).padStart(9)+'  (min-max)');return;}
  cs.forEach(function(c,i){line(c,i,'card '+(i+1));});});

 console.log('\nbeat'.padEnd(9)+'frames'.padStart(7)+'fps'.padStart(7)+'p95 gap ms'.padStart(12)+'worst ms'.padStart(10)+'page cost avg ms'.padStart(18)+'max ms'.padStart(8)+'  typical things moving');
 order.forEach(function(id){var t=merged[id];var all=table.filter(function(x){return x.beat===id;});var f=all.reduce(function(a,x){return a+x.frames;},0);
  var one=all.reduce(function(a,x){return x.frames>a.frames?x:a;},all[0]);
  console.log(id.padEnd(9)+String(f).padStart(7)+r(one.fps,1).toString().padStart(7)+r(one.p95,1).toString().padStart(12)+r(one.worst,1).toString().padStart(10)+r(one.costAvg,2).toString().padStart(18)+r(one.costMax,1).toString().padStart(8)+'  '+one.typ);});
 var allf=res.ft.map(function(f){return f[1];}).filter(function(x){return x>0;}),allc=res.ft.map(function(f){return f[2];});
 console.log('\nwhole run: '+res.ft.length+' frames, mean gap '+r(allf.reduce(function(a,x){return a+x;},0)/allf.length,1)+' ms ('+r(1000/(allf.reduce(function(a,x){return a+x;},0)/allf.length),1)+' fps), p95 gap '+r(pct(allf,.95),1)+' ms, page cost per frame mean '+r(allc.reduce(function(a,x){return a+x;},0)/allc.length,2)+' ms, p95 '+r(pct(allc,.95),2)+' ms, max '+r(Math.max.apply(null,allc),1)+' ms');
 var props={};res.anims.forEach(function(a){props[a.prop]=(props[a.prop]||0)+1;});
 console.log('animation properties seen (count): '+Object.keys(props).map(function(k){return k+' '+props[k];}).join(', '));
 var paint=Object.keys(props).filter(function(k){return /^(color|border-.*-color|background-color)$/.test(k);}),comp=Object.keys(props).filter(function(k){return /^(opacity|transform|translate|fadeIn|visibility|waapi)$/.test(k);});
 console.log('compositor only (opacity, transform, translate, and the small WAAPI squash and nudge, which are transform and translate): '+comp.join(', '));
 console.log('paint only, 120 ms hover and focus feedback on rings and fields, no layout: '+(paint.join(', ')||'none'));
 console.log('console errors: '+(errs.length?errs.join(' | '):'none'));
 if(jsonOut)fs.writeFileSync(jsonOut,JSON.stringify({W:W,H:H,table:table,cards:cards,props:props,load0:load0,load1:load1}));
 process.exit(errs.length?1:0);
})().catch(function(e){console.error(e);process.exit(2);});
