/* ============================================================
   BUILD SEVEN SEATS, FOUR WAYS. Round EQ in TASKS.md.

     committed source.html + seats4.css + seats4.js + pairs.js
       + the measured verdict (verdict.js over shots/facts.json, if a run
         has been made) -> seats4.html

   Laid over the shipped build the way proto/avatar/seats does it, so every
   number, seat colour, lighting and the release card itself are the
   product's own. Nothing under atuned_src/ is touched.

   ONE FILE. Every layout is switched inside it, by the dock at the foot of
   the window or by the address, and the verdict opens as a sheet inside the
   same page with a close. Nothing links out, which is the EA ruling.

     #L=ring|three|story|loop|graded  &who=Sofia|Diane|Marcus|Angela|Derek|James|blank
     &runs=0..14  &clean=1 (hides the dock, for the measured screens)  &verdict=1

     node proto/avatar/seats4/build.js          (REV=<commit> to pin the build)
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process'), crypto=require('crypto');
const D=__dirname, ROOT=path.resolve(D,'..','..','..');
/* REV pins the build underneath, so the file sent is the file measured */
const REV=process.env.REV||'HEAD';
const src=cp.execSync('git show '+REV+':source.html',{cwd:ROOT,maxBuffer:64<<20}).toString('utf8');
const commit=cp.execSync('git rev-parse --short '+REV,{cwd:ROOT}).toString().trim();
const css=fs.readFileSync(path.join(D,'seats4.css'),'utf8');
const js=fs.readFileSync(path.join(D,'seats4.js'),'utf8');
const PAIRS=require(path.join(D,'pairs.js'));
const {STORYBANK}=require(path.join(ROOT,'sim','stories.js'));
const bank={};
Object.keys(PAIRS).forEach(function(nm){
 bank[nm]=(STORYBANK[nm]||[]).map(x=>x[1]);
 if(!bank[nm].length)throw new Error(nm+' has no story bank');});
let verdict='';
const factsF=path.join(D,'shots','facts.json');
if(fs.existsSync(factsF)){verdict=require(path.join(D,'verdict.js'))(JSON.parse(fs.readFileSync(factsF,'utf8')),commit);}

const boot=`
(function(){
 function q(k,d){var m=(location.hash||'').match(new RegExp('[#&]'+k+'=([^&]+)'));return m?decodeURIComponent(m[1]):d;}
 function go(){
  if(!document.body.classList.contains('booted'))return setTimeout(go,120);
  try{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();}catch(e){}
  var Lt=q('light','dark'); if(Lt!=='dark'&&typeof setLighting==='function')setLighting(Lt);
  S4.mount({L:q('L','told'),lead:q('lead','weight'),who:q('who','James'),runs:+q('runs','0'),clean:q('clean','')==='1',verdict:q('verdict','')==='1'});
  document.documentElement.setAttribute('data-s4-ready','1');}
 go();})();`;

const inject='\n<!-- ===== SEVEN SEATS, FOUR WAYS. Prototype, round EQ, over build '+commit+'. Not part of the product build. ===== -->\n'
 +'<style id="s4-css">\n'+css+'\n</style>\n'
 +'<script id="s4-data">window.S4_BANK='+JSON.stringify(bank)+';window.S4_PAIRS='+JSON.stringify(PAIRS)+';window.S4_VERDICT='+JSON.stringify(verdict)+';</script>\n'
 +'<script id="s4-js">\n'+js+'\n</script>\n'
 +'<script id="s4-boot">'+boot+'</script>\n';
const at=src.lastIndexOf('</body>');
if(at<0)throw new Error('no </body> in source.html');
let out=src.slice(0,at)+inject+src.slice(at);
out=out.replace(/<title>([^<]*)<\/title>/,'<title>Seven Seats, four ways</title>');
if((css+js+JSON.stringify(PAIRS)+verdict).indexOf('\u2014')>=0)throw new Error('an em dash is in the prototype');
const OUTF=process.env.OUT||path.join(D,'seats4.html');
fs.writeFileSync(OUTF,out);
const md5=crypto.createHash('md5').update(out).digest('hex');
console.log('wrote proto/avatar/seats4/seats4.html over '+commit+', md5 '+md5+', '+(out.length/1024|0)+' KB, verdict '+(verdict?'embedded':'not yet measured'));
