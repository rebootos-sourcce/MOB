/* ============================================================
   BUILD SEVEN SEATS. Round EI in TASKS.md.

     committed source.html + seats.css + seats.js + pairs.js -> seats.html

   Laid over the shipped build the way proto/avatar/four and proto/glassbar
   do it, so every number, seat colour, lighting and the release card itself
   are the product's own. Nothing under atuned_src/ is touched.

   IT READS THE COMMITTED BUILD, NOT THE WORKING TREE. Pass --tree to build
   on the tree.

   One file, everything switched inside it. The hash picks the opening
   state, so a screenshot can be reproduced from its own address:
     #who=James|Angela|Derek|blank|off  &runs=0..14  &mode=cleared|closed
     &station=journal|release|ritual|record  &light=dark|snow|punch|glass

     node proto/avatar/seats/build.js
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process'), crypto=require('crypto');
const D=__dirname, ROOT=path.resolve(D,'..','..','..');
const tree=process.argv.includes('--tree');
const src=tree?fs.readFileSync(path.join(ROOT,'source.html'),'utf8')
 :cp.execSync('git show HEAD:source.html',{cwd:ROOT,maxBuffer:64<<20}).toString('utf8');
const commit=cp.execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();
const css=fs.readFileSync(path.join(D,'seats.css'),'utf8');
const js=fs.readFileSync(path.join(D,'seats.js'),'utf8');
const PAIRS=require(path.join(D,'pairs.js'));
const {STORYBANK}=require(path.join(ROOT,'sim','stories.js'));
const bank={};
Object.keys(PAIRS).forEach(function(nm){
 bank[nm]=(STORYBANK[nm]||[]).map(x=>x[1]);
 if(!bank[nm].length)throw new Error(nm+' has no story bank');});

const boot=`
(function(){
 function q(k,d){var m=(location.hash||'').match(new RegExp('[#&]'+k+'=([^&]+)'));return m?decodeURIComponent(m[1]):d;}
 function go(){
  if(!document.body.classList.contains('booted'))return setTimeout(go,120);
  try{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();}catch(e){}
  var L=q('light','dark'); if(L!=='dark'&&typeof setLighting==='function')setLighting(L);
  SV7.mount({who:q('who','James'),runs:+q('runs','0'),mode:q('mode','cleared'),station:q('station',''),sel:q('sel','')});
  document.documentElement.setAttribute('data-sv-ready','1');}
 go();})();`;

const inject='\n<!-- ===== SEVEN SEATS. Prototype, round EI. Not part of the product build. ===== -->\n'
 +'<style id="sv-css">\n'+css+'\n</style>\n'
 +'<script id="sv-data">window.SV7_BANK='+JSON.stringify(bank)+';window.SV7_PAIRS='+JSON.stringify(PAIRS)+';</script>\n'
 +'<script id="sv-js">\n'+js+'\n</script>\n'
 +'<script id="sv-boot">'+boot+'</script>\n';
const at=src.lastIndexOf('</body>');
if(at<0)throw new Error('no </body> in source.html');
let out=src.slice(0,at)+inject+src.slice(at);
out=out.replace(/<title>([^<]*)<\/title>/,'<title>Seven Seats, over $1</title>');
if((css+js+JSON.stringify(PAIRS)).indexOf('—')>=0)throw new Error('an em dash is in the prototype');
fs.writeFileSync(path.join(D,'seats.html'),out);
const m=src.match(/data-build="([^"]+)"/);
const md5=crypto.createHash('md5').update(src).digest('hex');
const omd5=crypto.createHash('md5').update(out).digest('hex');
console.log('wrote proto/avatar/seats/seats.html over '+(tree?'the working tree':'HEAD '+commit)
 +', build '+(m?m[1]:'?')+', source md5 '+md5+', prototype md5 '+omd5+', '+(out.length/1024|0)+' KB');
