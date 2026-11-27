/* ============================================================
   BUILD THE FIELD LEFT PANEL PROTOTYPE. GO in TASKS.md.

     a built source.html + fieldpanel.css + fieldpanel.js -> fieldpanel.html

   The prototype is the shipped build with the overlay laid over it, the way
   proto/glassbar does it, so every ring, number and reading in it is the
   product's own. Nothing under atuned_src/ is touched.

   IT READS THE COMMITTED BUILD BY DEFAULT, because the working tree is shared
   and can carry another seat's work in flight: a prototype built on half of
   somebody else's change would be reviewing that change instead of this one.
   Pass --from <path> to build on a particular source.html instead.

   It opens on Sofia, level 8, who has birth data on file, so the Energetic
   Summary has something to show. The dock switches the person.

     node proto/fieldpanel/build.js [--from path/to/source.html]
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process'), crypto=require('crypto');
const D=__dirname, ROOT=path.resolve(D,'..','..');
const fi=process.argv.indexOf('--from');
const from=fi>0?path.resolve(process.argv[fi+1]):null;
const src=from?fs.readFileSync(from,'utf8')
 :cp.execSync('git show HEAD:source.html',{cwd:ROOT,maxBuffer:64<<20}).toString('utf8');
const commit=cp.execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();
const css=fs.readFileSync(path.join(D,'fieldpanel.css'),'utf8');
const js=fs.readFileSync(path.join(D,'fieldpanel.js'),'utf8');
const inject='\n<!-- ===== THE FIELD LEFT PANEL, prototype, round GO. Not part of the product build. ===== -->\n'
 +'<style id="fp-css">\n'+css+'\n</style>\n'
 +'<script id="fp-js">\n'+js+'\n</script>\n';
const at=src.lastIndexOf('</body>');
if(at<0)throw new Error('no </body> in the source build');
const out=src.slice(0,at)+inject+src.slice(at);
if(/—/.test(css+js))throw new Error('an em dash in the prototype');
const dest=path.join(D,'fieldpanel.html');
fs.writeFileSync(dest,out);
const md5=crypto.createHash('md5').update(out).digest('hex');
console.log('wrote '+path.relative(ROOT,dest)+'  '+out.length+' bytes  md5 '+md5
 +'  on '+(from?path.relative(ROOT,from):'HEAD '+commit));
