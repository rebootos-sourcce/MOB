/* ============================================================
   BUILD THE GLASS BAR PROTOTYPE. DK in TASKS.md, ask one.

     committed source.html + glassbar.css + glassbar.js -> glassbar.html

   The prototype is the shipped build with the bar laid over it, the way
   proto/shelf does it, so every ring, every number and every readout in it
   is the product's own. Nothing under atuned_src/ is touched.

   IT READS THE COMMITTED BUILD, NOT THE WORKING TREE. source.html in the
   working tree can carry another seat's work in flight, and a prototype
   built on half a change would be reviewing that change instead of this
   one. `git show HEAD:source.html` is the build the owner already has. Pass
   --tree to build on the working tree instead.

   It opens on James with his five story bank lines committed, the same
   reading every Field round has been shot on. #blank opens on the blank
   profile a stranger meets. #before skips the bar and shows the shipped
   Field, for the side by side.

     node proto/glassbar/build.js
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process'), crypto=require('crypto');
const D=__dirname, ROOT=path.resolve(D,'..','..');
const tree=process.argv.includes('--tree');
const src=tree?fs.readFileSync(path.join(ROOT,'source.html'),'utf8')
 :cp.execSync('git show HEAD:source.html',{cwd:ROOT,maxBuffer:64<<20}).toString('utf8');
const commit=cp.execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();
const css=fs.readFileSync(path.join(D,'glassbar.css'),'utf8');
const js=fs.readFileSync(path.join(D,'glassbar.js'),'utf8');
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
  if(h.indexOf('before')<0&&window.GB)GB.mount();
  render();
  document.documentElement.setAttribute('data-gb-ready','1');}
 go();})();`;

const inject='\n<!-- ===== THE GLASS BAR, prototype, round DK. Not part of the product build. ===== -->\n'
 +'<style id="gb-css">\n'+css+'\n</style>\n'
 +'<script id="gb-js">\n'+js+'\n</script>\n'
 +'<script id="gb-boot">'+boot+'</script>\n';
const at=src.lastIndexOf('</body>');
if(at<0)throw new Error('no </body> in source.html');
let out=src.slice(0,at)+inject+src.slice(at);
out=out.replace(/<title>([^<]*)<\/title>/,'<title>Glass bar prototype, over $1</title>');
fs.writeFileSync(path.join(D,'glassbar.html'),out);
const m=src.match(/data-build="([^"]+)"/);
const md5=crypto.createHash('md5').update(src).digest('hex');
console.log('wrote proto/glassbar/glassbar.html over '+(tree?'the working tree':'HEAD '+commit)
 +', build '+(m?m[1]:'?')+', source md5 '+md5+', '+(out.length/1024|0)+' KB');
