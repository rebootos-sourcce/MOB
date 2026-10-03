/* ============================================================
   BUILD THE FLOW PROTOTYPE. committed source.html + flow.css + flow.js ->
   proto/flowredesign/flow.html

   The build underneath is HEAD, read with git show, never the working tree.
   Nothing under atuned_src/ is read or touched. It opens on the Body page,
   where the Flow section is drawn, with the Flow section open and a
   reference ICP loaded with their own story bank committed, the way the DD
   panel loaded them, so every pattern on screen is that person's real read.

   The address picks the option, the person and, optionally, the layer:
     #2-james   #3-derek   #0-sofia-cx   #4-diane-hyper
     options 0 shipped, 1 rows, 2 tiles, 3 river, 4 pinch

     node proto/flowredesign/build.js
   ============================================================ */
const fs=require('fs'),path=require('path'),cp=require('child_process');
const D=__dirname, ROOT=path.resolve(D,'..','..');
const src=cp.execSync('git show HEAD:source.html',{cwd:ROOT,maxBuffer:64<<20}).toString();
const rev=cp.execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();
const {STORYBANK}=require(path.join(ROOT,'sim','stories.js'));
const bank={}; ['Sofia','Diane','Marcus','Angela','Derek','James'].forEach(n=>{bank[n.toLowerCase()]=(STORYBANK[n]||[]).map(x=>x[1]);});
const css=fs.readFileSync(path.join(D,'flow.css'),'utf8'), js=fs.readFileSync(path.join(D,'flow.js'),'utf8');
const boot=`
var FR_BANK=${JSON.stringify(bank)};
(function(){
 function go(){
  if(!document.body.classList.contains('booted'))return setTimeout(go,120);
  try{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();}catch(e){}
  var h=(location.hash||'#2-james').slice(1).toLowerCase().split('-');
  if(h.indexOf('clean')>=0){document.body.classList.add('fr-clean');h=h.filter(function(x){return x!=='clean';});}
  FV.v=/^[0-4]$/.test(h[0])?h[0]:'2'; var who=FR_BANK[h[1]]?h[1]:'james'; FV.who=who;
  var i=PEOPLE.findIndex(function(q){return q.nm.toLowerCase()===who;}); loadP(i);
  FR_BANK[who].forEach(function(t,k){applyStory(t);verpApply(t);if(typeof leanApply==='function')leanApply(t);
   CURP.story=CURP.story||{entries:[]};var ps=parseStory(t);
   CURP.story.entries.push({t:'2026-09-2'+k+'T08:00:00Z',text:t,imprints:ps.imprints.length,bands:ps.bands});});
  setTab(TAB.ENERGY);
  var r=compute(), want=h[2]||'hyper';
  PMLAYER=(pmCount(r,want)?want:(pmCount(r,'cx')?'cx':'sab')); PMFIRST=0;
  OPENSEC.right.flow=1; paintSections(); render();
  var f=document.querySelector('.lsec[data-sec="flow"]'); if(f)f.scrollIntoView({block:'start'});
  requestAnimationFrame(function(){document.documentElement.setAttribute('data-fr-ready','1');});}
 go();})();`;
const inject='\n<!-- ===== THE FLOW SECTION, FOUR WAYS. Prototype over build '+rev+'. Not part of the product build. ===== -->\n'
 +'<style id="fr-css">\n'+css+'\n</style>\n<script id="fr-js">\n'+js+'\n</script>\n<script id="fr-boot">'+boot+'</script>\n';
const at=src.lastIndexOf('</body>'); if(at<0)throw new Error('no </body>');
let out=src.slice(0,at)+inject+src.slice(at);
out=out.replace(/<title>([^<]*)<\/title>/,'<title>Flow prototype, over $1</title>');
if(/—/.test(css+js))throw new Error('an em dash in the prototype');
fs.writeFileSync(path.join(D,'flow.html'),out);
console.log('wrote proto/flowredesign/flow.html over build',rev,(out.length/1024|0)+' KB');
