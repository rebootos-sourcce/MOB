/* ============================================================
   BUILD THE FOUR AVATARS. Round DY in TASKS.md.

     committed source.html + four.css + four.js -> four.html

   Laid over the shipped build, the way proto/glassbar does it, so every
   number, every seat colour and every lighting in it is the product's own.
   Nothing under atuned_src/ is touched.

   IT READS THE COMMITTED BUILD, NOT THE WORKING TREE. Other seats have work
   in flight under atuned_src/ and a prototype built on half a change would
   be reviewing that change instead. Pass --tree to build on the tree.

   The page opens on James with his five story bank lines committed, the
   reading every Field round has been shot on. The hash picks the state, so
   a screenshot can be reproduced from its own address:
     #v=figure|nerves|channel|ring|off  &who=James|Angela|blank  &runs=0..12
     &light=dark|snow|punch|glass

     node proto/avatar/four/build.js
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process'), crypto=require('crypto');
const D=__dirname, ROOT=path.resolve(D,'..','..','..');
const tree=process.argv.includes('--tree');
const src=tree?fs.readFileSync(path.join(ROOT,'source.html'),'utf8')
 :cp.execSync('git show HEAD:source.html',{cwd:ROOT,maxBuffer:64<<20}).toString('utf8');
const commit=cp.execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();
const css=fs.readFileSync(path.join(D,'four.css'),'utf8');
const js=fs.readFileSync(path.join(D,'four.js'),'utf8');
const {STORYBANK}=require(path.join(ROOT,'sim','stories.js'));
const bank={};
['James','Angela'].forEach(function(nm){
 bank[nm]=(STORYBANK[nm]||[]).map(x=>x[1]);
 if(!bank[nm].length)throw new Error(nm+' has no story bank');});

const boot=`
(function(){
 function q(k,d){var m=(location.hash||'').match(new RegExp('[#&]'+k+'=([^&]+)'));return m?decodeURIComponent(m[1]):d;}
 function go(){
  if(!document.body.classList.contains('booted'))return setTimeout(go,120);
  try{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();}catch(e){}
  var L=q('light','dark'); if(L!=='dark'&&typeof setLighting==='function')setLighting(L);
  AVX.mount({v:q('v','figure'),who:q('who','James'),runs:+q('runs','0')});
  document.documentElement.setAttribute('data-avx-ready','1');}
 go();})();`;

const inject='\n<!-- ===== THE AVATAR, FOUR WAYS. Prototype, round DY. Not part of the product build. ===== -->\n'
 +'<style id="avx-css">\n'+css+'\n</style>\n'
 +'<script id="avx-bank">window.AVX_BANK='+JSON.stringify(bank)+';</script>\n'
 +'<script id="avx-js">\n'+js+'\n</script>\n'
 +'<script id="avx-boot">'+boot+'</script>\n';
const at=src.lastIndexOf('</body>');
if(at<0)throw new Error('no </body> in source.html');
let out=src.slice(0,at)+inject+src.slice(at);
out=out.replace(/<title>([^<]*)<\/title>/,'<title>The avatar, four ways, over $1</title>');
if((css+js).indexOf('—')>=0)throw new Error('an em dash is in the prototype');
fs.writeFileSync(path.join(D,'four.html'),out);
const m=src.match(/data-build="([^"]+)"/);
const md5=crypto.createHash('md5').update(src).digest('hex');
console.log('wrote proto/avatar/four/four.html over '+(tree?'the working tree':'HEAD '+commit)
 +', build '+(m?m[1]:'?')+', source md5 '+md5+', '+(out.length/1024|0)+' KB');
