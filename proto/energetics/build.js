/* ============================================================
   BUILD THE ENERGETICS PROTOTYPE. committed source.html + the celestial rail
   already built in proto/states (reused, not copied: its files are read from
   there at build time) + nine child emotion questions lifted from
   funnel/questions.js + this round's files -> proto/energetics/energetics.html

   The build underneath is the one at HEAD, read with git show, never the
   working tree: source.html is a build product and another seat may have a
   half built one on disk. Nothing under atuned_src/ is read or touched.

   The address picks the layout and, optionally, a person to fill in:
     #a  Quiet     #b  Tiles     #c  Staged     #d  Portrait
     #b-james, #d-owner, #a-angela ...   (blank if no name is given)

     node proto/energetics/build.js
   ============================================================ */
const fs=require('fs'),path=require('path'),cp=require('child_process');
const D=__dirname, ROOT=path.resolve(D,'..','..'), ST=path.join(ROOT,'proto','states');
const src=cp.execSync('git show HEAD:source.html',{cwd:ROOT,maxBuffer:64<<20}).toString();
const rev=cp.execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();
const strip=s=>s.replace(/\nif\(typeof module[\s\S]*$/,'\n');
const rd=(dir,f)=>fs.readFileSync(path.join(dir,f),'utf8');
/* the nine questions: the first funnel item that loads each child emotion */
const qsrc=rd(path.join(ROOT,'funnel'),'questions.js');
const box={}; new Function('box',qsrc.replace(/var QQ\s*=/,'box.QQ=').replace(/var QSCALE\s*=/,'box.QSCALE='))(box);
const seen={}, nine=box.QQ.filter(q=>seen[q.c]?false:(seen[q.c]=1));
if(nine.length!==9)throw new Error('expected one funnel question per child emotion, found '+nine.length);
const qjs='var EN_QQ='+JSON.stringify(nine.map(q=>({c:q.c,q:q.q})))+';\nvar QSCALE='+JSON.stringify(box.QSCALE)+';\n';
const css=rd(ST,'states.css')+'\n'+rd(D,'en.css');
const js=[strip(rd(ST,'icons.js')),strip(rd(ST,'copy.js')),strip(rd(ST,'synth.js')),rd(ST,'states.js'),
 qjs, strip(rd(D,'roots.js')), strip(rd(D,'read.js')), rd(D,'fill.js'), rd(D,'en.js')].join('\n');
const boot=`
(function(){
 function go(){
  if(!document.body.classList.contains('booted'))return setTimeout(go,120);
  try{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();}catch(e){}
  var h=(location.hash||'#b').slice(1).toLowerCase().split('-');
  /* -clean hides the prototype's own chrome, for the measured screens */
  if(h.indexOf('clean')>=0){document.body.classList.add('en-clean');h=h.filter(function(x){return x!=='clean';});}
  EN.v=/^[abcd]$/.test(h[0])?h[0]:'b';
  loadP(0); CURP=PROFILES[0]||CURP; loadProfile(CURP); enBlank();
  setTab(TAB.INTAKE); render();
  if(h[1]&&EN_FILL[h[1]])enFill(h[1]); else enMount();
  requestAnimationFrame(function(){document.documentElement.setAttribute('data-en-ready','1');});}
 go();})();`;
const inject='\n<!-- ===== ENERGETICS, FOUR WAYS. Prototype, round DM, over build '+rev+'. Not part of the product build. ===== -->\n'
 +'<style id="en-css">\n'+css+'\n</style>\n'
 +'<script id="en-js">\n'+js+'\n</script>\n'
 +'<script id="en-boot">'+boot+'</script>\n';
const at=src.lastIndexOf('</body>');
if(at<0)throw new Error('no </body> in source.html at HEAD');
let out=src.slice(0,at)+inject+src.slice(at);
out=out.replace(/<title>([^<]*)<\/title>/,'<title>Energetics prototype, over $1</title>');
if(/—/.test(css+js))throw new Error('an em dash in the prototype');
fs.writeFileSync(path.join(D,'energetics.html'),out);
console.log('wrote proto/energetics/energetics.html over build',rev,(out.length/1024|0)+' KB');
