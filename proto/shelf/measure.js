/* THE COUNT, BEFORE AND AFTER. Same person, same press, two builds: the
   shipped source.html and the shelf prototype laid over it.

   What is counted, and what is not. "Controls on screen" is every visible,
   enabled button, link, input, select and element with a button role whose
   box intersects the viewport and is not hidden under something else (the
   centre of its box must hit it). The picture's own marks on the canvas are
   not in it, because they are one element to the DOM, so this undercounts
   the Field on both sides equally. It is a floor for simultaneous choices,
   not the whole of them.

   "Answer on screen" is whether the title of the answer to the press is
   inside the viewport after the press has settled, with nothing scrolled by
   hand. Width is the stage's own box.

     node proto/shelf/build.js
     NODE_PATH=/opt/node22/lib/node_modules node proto/shelf/measure.js */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const {STORYBANK}=require(path.resolve('sim/stories.js'));
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const james=STORYBANK.James.map(x=>x[1]);
const COUNT=`(function(){
 var sel='button,a[href],input:not([type=hidden]),select,textarea,[role=button],[role=tab]';
 var n=0; document.querySelectorAll(sel).forEach(function(e){
  if(e.disabled)return; var r=e.getBoundingClientRect(); if(!r.width||!r.height)return;
  if(r.bottom<=0||r.right<=0||r.top>=innerHeight||r.left>=innerWidth)return;
  var cs=getComputedStyle(e); if(cs.visibility==='hidden'||+cs.opacity===0)return;
  var x=Math.min(innerWidth-1,Math.max(0,r.left+r.width/2)), y=Math.min(innerHeight-1,Math.max(0,r.top+r.height/2));
  var h=document.elementFromPoint(x,y); if(!h||!(h===e||e.contains(h)||h.contains(e)))return;
  n++;}); return n;})()`;
(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const rows=[];
 for(const [label,file] of [['before','source.html'],['after','proto/shelf/shelf.html']]){
  for(const [W,H] of [[1600,1000],[390,844]]){
   for(const tab of [2,3]){
    const ctx=await b.newContext({viewport:{width:W,height:H},hasTouch:W<600,isMobile:W<600});
    const p=await ctx.newPage();
    await p.goto('file://'+path.resolve(file));
    await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:25000});
    if(label==='after')await p.waitForFunction(()=>document.documentElement.getAttribute('data-shelf-ready')==='1',null,{timeout:25000});
    await p.evaluate(([bank,tab,label])=>{
     if(label==='before'){try{if(typeof OB!=='undefined'&&OB.open)obClose();}catch(e){}
      loadP(PEOPLE.findIndex(q=>q.nm==='James'));
      bank.forEach(function(t,k){applyStory(t);verpApply(t);if(typeof leanApply==='function')leanApply(t);});}
     setTab(tab);render();},[james,tab,label]);
    await p.waitForTimeout(700);
    const st=await p.evaluate(()=>{const r=document.querySelector('.stage').getBoundingClientRect();return Math.round(r.width);});
    const idle=await p.evaluate(COUNT);
    /* the press: Escapism, the heaviest address James holds, through the
       product's own door for an address */
    await p.evaluate(()=>{const n=W.slice().sort((a,b)=>b.sq-a.sq)[0];S.pin=null;runNodeDrill(n);render();});
    await p.waitForTimeout(900);
    const pressed=await p.evaluate(COUNT);
    const ans=await p.evaluate(()=>{
     var t=document.querySelector('#shelf .sh-nm')||document.querySelector('#rdrill .ad-nm');
     if(!t)return {on:false,y:null};
     var r=t.getBoundingClientRect(); var sy=(document.body.scrollTop||scrollY);
     return {on:r.top>=0&&r.bottom<=innerHeight&&r.width>0,y:Math.round(r.top)};});
    rows.push({build:label,width:W,page:tab===2?'Field':'Body',stage:st,controlsIdle:idle,controlsPressed:pressed,
     answerOnScreen:ans.on,answerY:ans.y});
    await ctx.close();}}}
 await b.close();
 fs.writeFileSync(path.join(__dirname,'shots','measure.json'),JSON.stringify(rows,null,1));
 console.log('build   width page   stage  ctrl idle  ctrl pressed  answer on screen (y)');
 rows.forEach(r=>console.log([r.build.padEnd(7),String(r.width).padEnd(5),r.page.padEnd(6),String(r.stage).padEnd(6),
  String(r.controlsIdle).padEnd(10),String(r.controlsPressed).padEnd(13),r.answerOnScreen+' ('+r.answerY+')'].join(' ')));
})();
