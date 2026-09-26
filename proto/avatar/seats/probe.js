/* ============================================================
   PROBE. Measures the real avatar mechanic on the committed build,
   before anything is designed over it. Loads HEAD's source.html, a
   reference person with their story bank committed, a set of candidate
   pairs, and reports what avRows(), avatarGap() and avatarProgress()
   actually return, then replays release runs aimed at the heaviest gap
   and reports whether any pair ever reads clear.

     NODE_PATH=/opt/node22/lib/node_modules node proto/avatar/seats/probe.js
   ============================================================ */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),cp=require('child_process'),os=require('os');
const ROOT=path.resolve(__dirname,'..','..','..');
const {STORYBANK}=require(path.join(ROOT,'sim','stories.js'));
const PAIRS=require(path.join(__dirname,'pairs.js'));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'seats7-'));
const f=path.join(tmp,'head.html');
fs.writeFileSync(f,cp.execSync('git show HEAD:source.html',{cwd:ROOT,maxBuffer:64<<20}));
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const pg=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[];pg.on('pageerror',e=>errs.push(String(e)));
 await pg.goto('file://'+f);
 await pg.waitForFunction(()=>document.body.classList.contains('booted'));
 for(const who of Object.keys(PAIRS)){
  const out=await pg.evaluate(([who,bank,pairs])=>{
   function pIndex(nm){for(var i=0;i<PEOPLE.length;i++)if(PEOPLE[i].nm===nm)return i;return 0;}
   loadP(pIndex(who));
   CURP.work={};CURP.story={entries:[]};
   bank.forEach(function(t){applyStory(t);verpApply(t);if(typeof leanApply==='function')leanApply(t);});
   CURP.avatar={built:true,at:'2026-09-20T08:00:00Z',reviewedAt:null,pairs:pairs};
   compute();
   var snap=function(){compute();var rows=avRows();return {pg:avatarProgress(rows),
    rows:rows.map(function(r){return {be:r.pair.be.slice(0,40),seat:r.gap&&r.gap.seat,
     load:r.gap&&+r.gap.load.toFixed(2),clear:r.gap&&r.gap.clear,at:r.gap&&r.gap.at};})};};
   var res={who:who,S_who:S.who,left:(typeof relLeft==='function')?relLeft():null,
    t0:snap(),runs:[]};
   /* aim each run at the heaviest uncleared gap: its seat's eight heaviest carrying */
   for(var k=0;k<14;k++){
    var rows=avRows().filter(function(r){return r.gap&&!r.gap.clear;})
     .sort(function(a,b){return b.gap.load-a.gap.load;});
    if(!rows.length)break;
    var seat=rows[0].gap.seat;
    var q=W.filter(function(n){return n.b===seat&&n.sq>0&&n.cf;}).sort(function(a,b){return b.sq-a.sq;}).slice(0,8);
    if(!q.length){res.runs.push({k:k,seat:seat,empty:true});break;}
    q.forEach(function(n){var w0=n.sq*10,d=-Math.round(w0*0.21+2);
     var share=Math.abs(d)/10/Math.max(1,q.filter(function(x){return x.cf===n.cf;}).length);
     S.charge[n.cf]=clamp((S.charge[n.cf]||0)-share,0,10);
     S.replace[n.cf]=clamp((S.replace[n.cf]||0)+share*0.62,0,10);});
    var s=snap();
    res.runs.push({k:k+1,aim:seat,n:q.length,pg:s.pg,loads:s.rows.map(function(r){return r.seat+':'+r.load;}).join(' ')});}
   return res;},[who,(STORYBANK[who]||[]).map(x=>x[1]),PAIRS[who]]);
  console.log(JSON.stringify(out,null,1));}
 console.log('page errors',errs.length,errs.slice(0,3));
 await b.close();})();
