/* ============================================================
   BUILD THE STATES PROTOTYPE. committed source.html + icons, copy, stack,
   renderer and style -> proto/states/states.html.

   The build underneath is the one at HEAD, read with git show, never the
   working tree: source.html is a build product and another seat may have a
   half built one on disk. Nothing under atuned_src/ is read or touched.

   It opens on the Field with the States section open and the Stack card on
   the right. The address after # picks the reference case: #angela, #james,
   #derek, #sofia, #marcus and the rest of the roster, or #blank for the
   profile a stranger meets.

     node proto/states/build.js
   ============================================================ */
const fs=require('fs'),path=require('path'),cp=require('child_process');
const D=__dirname, ROOT=path.resolve(D,'..','..');
const src=cp.execSync('git show HEAD:source.html',{cwd:ROOT,maxBuffer:64<<20}).toString();
const rev=cp.execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();
const read=f=>fs.readFileSync(path.join(D,f),'utf8').replace(/\nif\(typeof module[\s\S]*$/,'\n');
const css=fs.readFileSync(path.join(D,'states.css'),'utf8');
const js=['icons.js','copy.js','synth.js'].map(read).join('\n')+'\n'+fs.readFileSync(path.join(D,'states.js'),'utf8');
const boot=`
(function(){
 function go(){
  if(!document.body.classList.contains('booted'))return setTimeout(go,120);
  try{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();}catch(e){}
  var h=(location.hash||'#angela').slice(1).toLowerCase();
  if(h!=='blank'){var i=PEOPLE.findIndex(function(q){return q.nm.toLowerCase()===h;});
   if(i<0)i=PEOPLE.findIndex(function(q){return q.nm==='Angela';}); loadP(i);}
  setTab(TAB.FIELD); render();
  var sec=document.querySelector('.lsec[data-sec="spirit"]');
  if(sec&&!sec.classList.contains('open'))sec.querySelector('.lsec-hd').click();
  renderSpirit();
  if(h!=='blank'&&window.STATES&&STATES.R){var b=document.querySelector('#spirit [data-st="stack"]');if(b)b.click();}
  requestAnimationFrame(function(){if(sec)sec.scrollIntoView({block:'start'});
   document.documentElement.setAttribute('data-states-ready','1');});}
 go();})();`;
const inject='\n<!-- ===== STATES, REDRAWN. Prototype, round DK, over build '+rev+'. Not part of the product build. ===== -->\n'
 +'<style id="states-css">\n'+css+'\n</style>\n'
 +'<script id="states-js">\n'+js+'\n</script>\n'
 +'<script id="states-boot">'+boot+'</script>\n';
const at=src.lastIndexOf('</body>');
if(at<0)throw new Error('no </body> in source.html at HEAD');
let out=src.slice(0,at)+inject+src.slice(at);
out=out.replace(/<title>([^<]*)<\/title>/,'<title>States prototype, over $1</title>');
if(/—/.test(css+js))throw new Error('an em dash in the prototype');
fs.writeFileSync(path.join(D,'states.html'),out);
console.log('wrote proto/states/states.html over build',rev,(out.length/1024|0)+' KB');
