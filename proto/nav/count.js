/* SIMULTANEOUS CHOICE COUNTER. The before reading, taken off the built file.

   NODE_PATH=/opt/node22/lib/node_modules node proto/nav/count.js [file]

   It walks TABDEF and TABEXTRA AT RUN TIME rather than carrying a list, for
   the reason the render watch already learned: anything needing a tab's entry
   looks it up by identity, never by position, and a list typed into a tool
   goes stale the first time the bar moves.

   A CHOICE IS DEFINED ONCE, HERE, so the before and the after are the same
   measure. An element counts when it is interactive, enabled, and has a box
   on screen at the moment the surface is open. Nothing inside a closed
   accordion counts and nothing inside a closed menu counts, because a person
   cannot choose it without first choosing the thing that holds it. The header
   of a closed accordion does count: it is one choice, which is the whole
   argument for progressive disclosure.

   Elements are attributed to the region that holds them, because the point of
   the exercise is to separate what the navigation costs from what the surface
   costs. */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const FILE=process.argv[2]||path.join(__dirname,'..','..','source.html');

const PROBE=`(function(){
 var SEL='button,a[href],input,select,textarea,summary,[role="button"],'
  +'[role="tab"],[role="link"],[contenteditable="true"],[tabindex]:not([tabindex="-1"])';
 var COLS=[].slice.call(document.querySelectorAll('.mid > .col'));
 var REGION=[['top','.glass.top'],['sub','#subbar'],['sheet','#sheet']];
 function visible(e){
  if(e.disabled)return false;
  if(e.getAttribute('aria-hidden')==='true')return false;
  var r=e.getBoundingClientRect(); if(r.width<1||r.height<1)return false;
  var s=getComputedStyle(e);
  if(s.display==='none'||s.visibility==='hidden'||+s.opacity===0)return false;
  var p=e.parentElement;
  while(p){ if(p.hidden)return false;
   var ps=getComputedStyle(p);
   if(ps.display==='none'||ps.visibility==='hidden')return false;
   p=p.parentElement; }
  return true; }
 function regionOf(e){
  for(var i=0;i<REGION.length;i++){
   var host=document.querySelector(REGION[i][1]);
   if(host&&host.contains(e))return REGION[i][0]; }
  if(COLS[0]&&COLS[0].contains(e))return 'left';
  if(COLS[1]&&COLS[1].contains(e))return 'right';
  return 'centre'; }
 function inview(e){var r=e.getBoundingClientRect();
  return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth; }
 var all=[].slice.call(document.querySelectorAll(SEL)).filter(visible);
 var by={top:0,sub:0,left:0,right:0,sheet:0,centre:0};
 var small=[],seen=0,sby={top:0,sub:0,left:0,right:0,sheet:0,centre:0};
 all.forEach(function(e){
  var rg=regionOf(e); by[rg]++; if(inview(e)){seen++;sby[rg]++;}
  var r=e.getBoundingClientRect();
  if(r.width<44||r.height<44)small.push(
   (e.id||e.className||e.tagName)+' '+Math.round(r.width)+'x'+Math.round(r.height)); });
 return {total:all.length,seen:seen,by:by,sby:sby,under44:small.length,small:small.slice(0,6)};}())`;

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const out={};
 for(const [w,h] of [[1600,1000],[390,844]]){
  const p=await b.newPage({viewport:{width:w,height:h}});
  await p.goto('file://'+path.resolve(FILE));
  await p.waitForTimeout(1400);
  const defs=await p.evaluate(`(function(){
   var l=TABDEF.map(function(T){return {k:T.k,id:T.id,nm:T.nm,bar:1};});
   Object.keys(TABEXTRA).forEach(function(k){var T=TABEXTRA[k];
    l.push({k:T.k,id:T.id,nm:T.nm,bar:0});});
   return l;}())`);
  out[w]={bar:defs.filter(d=>d.bar).length,rows:[]};
  for(const d of defs){
   await p.evaluate(k=>setTab(k),d.k);
   await p.waitForTimeout(340);
   const r=await p.evaluate(PROBE);
   out[w].rows.push(Object.assign({nm:d.nm,id:d.id,k:d.k},r));
  }
  await p.close();
 }
 fs.writeFileSync(path.join(__dirname,'count-before.json'),JSON.stringify(out,null,1));
 for(const w of Object.keys(out)){
  console.log('\n== '+w+' wide, '+out[w].bar+' doors in the bar ==');
  console.log('surface        total   seen  top  sub left right centre  under44');
  out[w].rows.forEach(r=>console.log(
   r.nm.padEnd(13)+String(r.total).padStart(6)+String(r.seen).padStart(7)+String(r.by.top).padStart(5)
   +String(r.by.sub).padStart(5)+String(r.by.left).padStart(5)
   +String(r.by.right).padStart(6)+String(r.by.centre).padStart(7)
   +String(r.under44).padStart(9)));
  console.log('first viewport by region:');
  out[w].rows.forEach(r=>console.log('  '+r.nm.padEnd(12)+' top '+r.sby.top
   +'  sub '+r.sby.sub+'  left '+r.sby.left+'  right '+r.sby.right
   +'  centre '+r.sby.centre));
  ['total','seen'].forEach(function(key){
   const t=out[w].rows.filter(r=>r.nm!=='Settings').map(r=>r[key]);
   console.log(key+': range '+Math.min.apply(0,t)+' to '+Math.max.apply(0,t)
    +', median '+t.slice().sort((a,b)=>a-b)[t.length>>1]);});
 }
 await b.close();})();
