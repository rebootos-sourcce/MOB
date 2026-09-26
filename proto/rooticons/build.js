/* ============================================================
   BUILD THE ROOT ICONS PROTOTYPE. Round DR in TASKS.md.

     committed source.html + glyphs.js + rooticons.css + rooticons.js
       -> rooticons.html

   The shipped build with the proposal laid over it, the way proto/glassbar
   does it, so every tile, every colour token and every lighting in it is
   the product's own. Nothing under atuned_src/ is touched.

   IT READS THE COMMITTED BUILD, NOT THE WORKING TREE, because the working
   tree carries other seats' work in flight. Pass --tree to build on it.

   Opens on James with his five story bank lines committed, the profile
   every rail round has been shot on, so his blueprint domain is selected
   and one root is washed. #blank opens on the blank profile. The rest of
   the hash is the comparison state, see rooticons.js.

     node proto/rooticons/build.js
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process'), crypto=require('crypto');
const D=__dirname, ROOT=path.resolve(D,'..','..');
const tree=process.argv.includes('--tree');
const src=tree?fs.readFileSync(path.join(ROOT,'source.html'),'utf8')
 :cp.execSync('git show HEAD:source.html',{cwd:ROOT,maxBuffer:64<<20}).toString('utf8');
const commit=cp.execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();
const css=fs.readFileSync(path.join(D,'rooticons.css'),'utf8');
const js=fs.readFileSync(path.join(D,'glyphs.js'),'utf8')+'\n'+fs.readFileSync(path.join(D,'rooticons.js'),'utf8');
const {STORYBANK}=require(path.join(ROOT,'sim','stories.js'));
const james=(STORYBANK.James||[]).map(x=>x[1]);
if(james.length!==5)throw new Error('James story bank changed shape: '+james.length);

const boot=`
(function(){
 function go(){
  if(!document.body.classList.contains('booted'))return setTimeout(go,120);
  try{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();}catch(e){}
  var h=(location.hash||'').toLowerCase();
  if(h.indexOf('blank')<0){
   var i=PEOPLE.findIndex(function(q){return q.nm==='James';});
   if(i>=0){loadP(i);
    ${JSON.stringify(james)}.forEach(function(t,k){applyStory(t);verpApply(t);
     if(typeof leanApply==='function')leanApply(t);
     CURP.story=CURP.story||{entries:[]};var ps=parseStory(t);
     CURP.story.entries.push({t:'2026-09-2'+k+'T08:00:00Z',text:t,imprints:ps.imprints.length,bands:ps.bands});});}}
  setTab(TAB.FIELD);
  RI.readHash(); RI.mount(); RI.apply(); render();
  document.documentElement.setAttribute('data-ri-ready','1');}
 go();})();`;

const inject='\n<!-- ===== ROOT ICONS AND ICON COLOUR, prototype, round DR. Not part of the product build. ===== -->\n'
 +'<style id="ri-css">\n'+css+'\n</style>\n'
 +'<script id="ri-js">\n'+js+'\n</script>\n'
 +'<script id="ri-boot">'+boot+'</script>\n';
const at=src.lastIndexOf('</body>');
if(at<0)throw new Error('no </body> in source.html');
let out=src.slice(0,at)+inject+src.slice(at);
out=out.replace(/<title>([^<]*)<\/title>/,'<title>Root icons prototype, over $1</title>');
fs.writeFileSync(path.join(D,'rooticons.html'),out);
const m=src.match(/data-build="([^"]+)"/);
const md5=crypto.createHash('md5').update(src).digest('hex');
console.log('wrote proto/rooticons/rooticons.html over '+(tree?'the working tree':'HEAD '+commit)
 +', build '+(m?m[1]:'?')+', source md5 '+md5+', '+(out.length/1024|0)+' KB');
