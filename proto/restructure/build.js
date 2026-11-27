/* ============================================================
   BUILD THE RESTRUCTURE PROTOTYPE. Round FY in TASKS.md.

     committed source.html
       + a memory store, first thing in the head, so nothing reaches the
         shipped app's own record
       + proto/avatar/seats4 (the Told avatar, unchanged, with its four
         Field-replacing rules stripped because here it lives on Avatar)
       + rs.css + rs.js
     -> proto/restructure/restructure.html        (unpacked, what is measured)
     -> proto/restructure/field-summary-restructure.html   (packed, what is sent)

   Laid over the shipped build the way proto/avatar/seats4 is, so every
   number, colour, renderer and the release card are the product's own.
   Nothing under atuned_src/ is touched.

   The address sets the state, so every screen in the report can be opened:
     #mode=new|old  &who=blank|Sofia|Diane|Marcus|Angela|Derek|James
     &tab=<TAB integer>  &avAt=top|summary  &sec=narrative|energetics|...
     &bankBy=carry|held  &vaultBy=opened|cleared

     node proto/restructure/build.js          (REV=<commit> pins the build)
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process'), crypto=require('crypto');
const D=__dirname, ROOT=path.resolve(D,'..','..');
const REV=process.env.REV||'HEAD';
const src=cp.execSync('git show '+REV+':source.html',{cwd:ROOT,maxBuffer:64<<20}).toString('utf8');
const commit=cp.execSync('git rev-parse --short '+REV,{cwd:ROOT}).toString().trim();
const S4D=path.join(ROOT,'proto','avatar','seats4');
let s4css=fs.readFileSync(path.join(S4D,'seats4.css'),'utf8');
/* seats4 replaces the Field with the avatar. Here the avatar has its own
   place, so the rules that hid the Field's canvas and bars go. Counted, so a
   change in seats4 cannot slip past silently. */
const before=s4css.length;
const STRIP=[/body\.s4-on\.tab-field[^{]*\{[^}]*\}/g, /body\.s4-on\.tab-field:not\(\.s4-L-graded\)[^{]*\{[^}]*\}/g, /body:not\(\.tab-field\) #s4\{[^}]*\}/g];
let stripped=0;
STRIP.forEach(re=>{s4css=s4css.replace(re,m=>{stripped++;return '';});});
if(stripped<4)throw new Error('seats4.css no longer carries the Field rules this build strips ('+stripped+' found). Re-read it.');
const s4js=fs.readFileSync(path.join(S4D,'seats4.js'),'utf8');
const PAIRS=require(path.join(S4D,'pairs.js'));
const {STORYBANK}=require(path.join(ROOT,'sim','stories.js'));
const bank={};
Object.keys(PAIRS).forEach(nm=>{bank[nm]=(STORYBANK[nm]||[]).map(x=>x[1]);});
const css=fs.readFileSync(path.join(D,'rs.css'),'utf8');
const js=fs.readFileSync(path.join(D,'rs.js'),'utf8');

/* THE MEMORY STORE. The app binds localStorage at init. Files opened from
   disk can share one origin, so without this a prototype could write into
   the person's own record in the shipped app. Before anything else runs. */
const mem=`<script id="rs-mem">(function(){var m={};var s={getItem:function(k){return Object.prototype.hasOwnProperty.call(m,k)?m[k]:null;},
setItem:function(k,v){m[k]=String(v);},removeItem:function(k){delete m[k];},clear:function(){m={};},
key:function(i){return Object.keys(m)[i]||null;},get length(){return Object.keys(m).length;}};
try{Object.defineProperty(window,'localStorage',{value:s,configurable:true});}catch(e){}
try{Object.defineProperty(window,'sessionStorage',{value:s,configurable:true});}catch(e){}})();</script>`;

const boot=`
(function(){
 function q(k,d){var m=(location.hash||'').match(new RegExp('[#&]'+k+'=([^&]+)'));return m?decodeURIComponent(m[1]):d;}
 function go(){
  if(!document.body.classList.contains('booted'))return setTimeout(go,120);
  try{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();}catch(e){}
  var Lt=q('light','dark'); if(Lt!=='dark'&&typeof setLighting==='function')setLighting(Lt);
  RS.mount({mode:q('mode','new'),who:q('who','James'),avAt:q('avAt','top'),bankBy:q('bankBy','carry'),
   vaultBy:q('vaultBy','opened'),sumSec:q('sec','narrative'),avSub:q('av','avatar'),tab:q('tab',null)});}
 go();})();`;

const inject='\n<!-- ===== FIELD AND SUMMARY RESTRUCTURED. Prototype, round FY, over build '+commit+'. Not part of the product build. ===== -->\n'
 +'<style id="s4-css">\n'+s4css+'\n</style>\n'
 +'<style id="rs-css">\n'+css+'\n</style>\n'
 +'<script id="s4-data">window.S4_BANK='+JSON.stringify(bank)+';window.S4_PAIRS='+JSON.stringify(PAIRS)+';window.S4_VERDICT="";</script>\n'
 +'<script id="s4-js">\n'+s4js+'\n</script>\n'
 +'<script id="rs-js">\n'+js+'\n</script>\n'
 +'<script id="rs-boot">'+boot+'</script>\n';
let out=src;
const hd=out.indexOf('<head>'); if(hd<0)throw new Error('no <head> in source.html');
out=out.slice(0,hd+6)+mem+out.slice(hd+6);
const at=out.lastIndexOf('</body>'); if(at<0)throw new Error('no </body> in source.html');
out=out.slice(0,at)+inject+out.slice(at);
out=out.replace(/<title>([^<]*)<\/title>/,'<title>Prototype, Field and Summary restructured</title>');
for(const [nm,t] of [['rs.css',css],['rs.js',js],['build',boot+mem]])
 if(t.indexOf('\u2014')>=0)throw new Error('an em dash is in '+nm);
const OUTF=path.join(D,'restructure.html');
fs.writeFileSync(OUTF,out);
const md5=b=>crypto.createHash('md5').update(b).digest('hex');
console.log('wrote proto/restructure/restructure.html over '+commit+', md5 '+md5(out)+', '+(out.length/1024|0)+' KB, seats4 rules stripped '+stripped+' ('+before+' to '+s4css.length+' bytes)');

/* PACKED, as every build sent to him is, with the outer page named for what
   it is while it inflates, so even the first second says prototype. */
const PK=path.join(D,'field-summary-restructure.html');
cp.execSync('node tools/pack.js '+path.relative(ROOT,OUTF)+' '+path.relative(ROOT,PK),{cwd:ROOT,stdio:'inherit'});
let pk=fs.readFileSync(PK,'utf8');
pk=pk.replace(/<title>[^<]*<\/title>/,'<title>Prototype, Field and Summary restructured</title>')
 .replace('<h1>Opening the instrument.</h1>','<h1>Opening the prototype.</h1>')
 .replace('It is compressed inside this file. Nothing is being fetched.','A mockup of the Field and Summary restructure, not the shipped app. It is compressed inside this file. Nothing is being fetched.');
fs.writeFileSync(PK,pk);
console.log('packed proto/restructure/field-summary-restructure.html, md5 '+md5(pk)+', '+(pk.length/1024|0)+' KB');
