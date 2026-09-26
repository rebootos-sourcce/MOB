/* ============================================================
   BUILD THE SHELF PROTOTYPE. source.html + shelf.css + shelf.js ->
   proto/shelf/shelf.html.

   The prototype is the shipped build with the shelf laid over it, so every
   picture, every number and every answer in it is the product's own. Only
   source.html is read; nothing under atuned_src/ is touched. The shelf's two
   files are appended at the end of the body, after the app's own scripts,
   so they can see every function they redirect.

   It opens on James, with his five story bank lines committed the way every
   Field round tonight loaded him, so it is the same reading as the CE, CR and
   CW screenshots. The address after # picks the page: #body opens on Body,
   #blank skips James and opens on the blank profile a stranger meets.

     node proto/shelf/build.js
   ============================================================ */
const fs=require('fs'), path=require('path');
const D=__dirname, ROOT=path.resolve(D,'..','..');
const src=fs.readFileSync(path.join(ROOT,'source.html'),'utf8');
const css=fs.readFileSync(path.join(D,'shelf.css'),'utf8');
const js=fs.readFileSync(path.join(D,'shelf.js'),'utf8');
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
  setTab(h.indexOf('body')>=0?TAB.ENERGY:TAB.FIELD); render();
  document.documentElement.setAttribute('data-shelf-ready','1');}
 go();})();`;

const inject='\n<!-- ===== THE SHELF, prototype, round CY. Not part of the product build. ===== -->\n'
 +'<style id="shelf-css">\n'+css+'\n</style>\n'
 +'<script id="shelf-js">\n'+js+'\n</script>\n'
 +'<script id="shelf-boot">'+boot+'</script>\n';
const at=src.lastIndexOf('</body>');
if(at<0)throw new Error('no </body> in source.html');
let out=src.slice(0,at)+inject+src.slice(at);
/* say which build this sits on, and that it is a prototype */
out=out.replace(/<title>([^<]*)<\/title>/,'<title>Shelf prototype, over $1</title>');
fs.writeFileSync(path.join(D,'shelf.html'),out);
const m=src.match(/data-build="([^"]+)"/);
console.log('wrote proto/shelf/shelf.html over build',m?m[1]:'?',(out.length/1024|0)+' KB');
