/* ============================================================
   SHOOT SEVEN SEATS, AND CHECK WHAT IS SHOT.

   Each state opens from its own address. Beside each picture it checks the
   page against the engine: no page errors, the ring is drawn, the centre
   reads avatarProgress().pct (or the closed share, in that mode), the top
   three are the three heaviest uncleared seats, and at 390 nothing scrolls
   sideways. Then it walks the gap to release path by pressing it: open the
   first gap, press Release these, press Begin on the shipped release card,
   wait for the card to finish, and check the gap's weight fell.

     node proto/avatar/seats/build.js
     NODE_PATH=/opt/node22/lib/node_modules node proto/avatar/seats/shoot.js
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'shots');
const PAGE='file://'+path.join(__dirname,'seats.html');
fs.mkdirSync(OUT,{recursive:true});
let fails=0,passes=0;
const ok=(c,msg)=>{if(c)passes++;else{fails++;console.log('  FAIL',msg);}};
const PLAN=[];
[1600,390].forEach(W=>['James','Angela','Derek','blank'].forEach(who=>PLAN.push({W,who,runs:0})));
[1600,390].forEach(W=>[5,9,14].forEach(r=>PLAN.push({W,who:'James',runs:r})));
PLAN.push({W:1600,who:'James',runs:9,mode:'closed'});
PLAN.push({W:1600,who:'James',runs:0,mode:'closed'});
PLAN.push({W:1600,who:'Angela',runs:8});
['journal','ritual','record'].forEach(s=>PLAN.push({W:1600,who:'James',runs:5,station:s}));
PLAN.push({W:390,who:'James',runs:5,station:'record'});
PLAN.push({W:1600,who:'James',runs:0,light:'snow'});
PLAN.push({W:1600,who:'off',runs:0});
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const facts=[];
 for(const s of PLAN){
  const pg=await b.newPage({viewport:{width:s.W,height:s.W>800?1000:3000}});
  const errs=[];pg.on('pageerror',e=>errs.push(String(e)));
  const hash='#who='+s.who+'&runs='+s.runs+(s.mode?'&mode='+s.mode:'')+(s.station?'&station='+s.station:'')+(s.light?'&light='+s.light:'');
  await pg.goto(PAGE+hash);
  await pg.waitForFunction(()=>document.documentElement.getAttribute('data-sv-ready')==='1',null,{timeout:30000});
  await pg.waitForTimeout(350);
  const f=await pg.evaluate((s)=>{
   var o={ring:!!document.querySelector('#sv7 .sv-svg'), sideways:document.documentElement.scrollWidth>innerWidth+1};
   if(s.who==='off')return o;
   compute(); var R=avRows(), pgr=avatarProgress(R), D=SV7.read();
   o.pct=pgr?pgr.pct:null; o.closed=D.closedPct;
   o.centre=(document.querySelector('#sv7 .sv-cn')||{}).textContent||'';
   o.top=D.T.map(function(g){return g.seat+' '+g.load.toFixed(2);});
   var byS={};R.forEach(function(r){if(r.gap&&!r.gap.clear)byS[r.gap.seat]=r.gap.load;});
   o.expect=Object.keys(byS).sort(function(a,b){return byS[b]-byS[a];}).slice(0,3);
   o.cards=[].map.call(document.querySelectorAll('#sv7 .sv-cardh'),function(x){return x.getAttribute('data-sv-sel');});
   o.rows=R.map(function(r){return r.gap?(r.gap.seat+':'+r.gap.load.toFixed(2)+(r.gap.clear?':clear':'')):'unresolved';});
   o.small=[].filter.call(document.querySelectorAll('#sv7 button'),function(x){var r=x.getBoundingClientRect();return r.width>0&&(r.height<44||r.width<44);})
    .map(function(x){return (x.textContent||'').trim().slice(0,24);});
   return o;},s);
  const nm=(s.light?s.light+'-':'')+s.who+'-'+s.runs+(s.mode?'-'+s.mode:'')+(s.station?'-'+s.station:'')+'-'+s.W;
  await pg.screenshot({path:path.join(OUT,nm+'.png')});
  ok(!errs.length,nm+' page errors '+errs.join(' | '));
  ok(f.ring||s.who==='off'?true:false,nm+' no ring drawn');
  ok(!f.sideways,nm+' scrolls sideways');
  if(s.who!=='off'&&s.who!=='blank'){
   const want=(s.mode==='closed'?f.closed:f.pct)+'%';
   ok(f.centre===want,nm+' centre reads '+f.centre+' and the engine reads '+want);
   ok(JSON.stringify(f.cards)===JSON.stringify(f.expect),nm+' top three '+f.cards+' against '+f.expect);}
  facts.push(Object.assign({shot:nm},s,f));
  await pg.close();}

 /* THE PATH, PRESSED. James, day one: the first gap, its release, the shipped card. */
 {const pg=await b.newPage({viewport:{width:1600,height:1000}});
  const errs=[];pg.on('pageerror',e=>errs.push(String(e)));
  await pg.goto(PAGE+'#who=James&runs=0');
  await pg.waitForFunction(()=>document.documentElement.getAttribute('data-sv-ready')==='1');
  const before=await pg.evaluate(()=>{var D=SV7.read();return {seat:D.T[0].seat,load:D.T[0].load};});
  await pg.click('#sv7 .sv-body [data-sv-rel]');
  await pg.waitForSelector('#rel #relgo');
  await pg.screenshot({path:path.join(OUT,'path-1-card-1600.png')});
  const idle=await pg.evaluate(()=>({n:RUN.queue.length,seats:RUN.queue.map(function(n){return n.b;}).filter(function(x,i,a){return a.indexOf(x)===i;}),
   head:(document.querySelector('#rel .rel-node')||{}).textContent,sub:(document.querySelector('#rel .rel-sub')||{}).textContent}));
  ok(idle.seats.length===1&&idle.seats[0]===before.seat,'the release card was handed addresses at '+idle.seats+' and the gap is at '+before.seat);
  await pg.click('#relgo');
  await pg.waitForTimeout(1500);
  await pg.screenshot({path:path.join(OUT,'path-2-running-1600.png')});
  await pg.waitForFunction(()=>RUN.phase==='done',null,{timeout:60000});
  await pg.waitForTimeout(300);
  await pg.screenshot({path:path.join(OUT,'path-3-done-1600.png')});
  const done=await pg.evaluate((seat)=>{var R=avRows(),l=null;R.forEach(function(r){if(r.gap&&r.gap.seat===seat)l=r.gap.load;});
   return {load:l,log:RUN.log.length,freed:RUN.freed,flash:(document.querySelector('#sv7 .sv-flash')||{}).textContent||'',
    runs:SV7.ST.runsBy[seat]||0,saved:(function(){try{return Object.keys(localStorage).length;}catch(e){return -1;}})()};},before.seat);
  ok(done.load<before.load,'the gap at '+before.seat+' did not fall: '+before.load+' to '+done.load);
  ok(done.runs===1,'the run was not recorded against the gap');
  await pg.click('#relclose');
  await pg.waitForTimeout(200);
  await pg.click('#sv7 [data-sv-st=release]');
  await pg.waitForTimeout(200);
  await pg.screenshot({path:path.join(OUT,'path-4-after-1600.png')});
  /* and the pair writer, with the real resolver */
  await pg.click('#sv7 [data-sv-st=journal]');
  await pg.fill('#sv-be','A great public speaker.');
  await pg.fill('#sv-not','My hands shake and I am terrified before I speak to the board.');
  await pg.click('#sv7 [data-sv-do=pair]');
  await pg.waitForTimeout(200);
  const wrote=await pg.evaluate(()=>({n:SV7.ST.pairs.length,flash:(document.querySelector('#sv7 .sv-flash')||{}).textContent||''}));
  await pg.screenshot({path:path.join(OUT,'path-5-pair-1600.png')});
  ok(wrote.n===6,'the pair writer did not add a pair');
  ok(!errs.length,'path page errors '+errs.join(' | '));
  facts.push({path:true,before,idle,done,wrote});
  console.log('path',JSON.stringify({before,idle,done,wrote}));
  await pg.close();}
 fs.writeFileSync(path.join(OUT,'facts.json'),JSON.stringify(facts,null,1));
 facts.filter(x=>!x.path).forEach(x=>console.log(x.shot.padEnd(28),'centre',String(x.centre).padEnd(5),'cleared',x.pct,'closed',x.closed,'top',(x.top||[]).join(', '),x.small&&x.small.length?' small:'+x.small.join('/'):''));
 console.log(passes+' pass, '+fails+' fail');
 await b.close();
 process.exit(fails?1:0);})();
