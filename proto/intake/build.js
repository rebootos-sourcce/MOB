/* ============================================================
   BUILD THE ARCHETYPE PICKER MOCKUPS. Round GQ in TASKS.md.

     pages/<name>.html + ../fw/kit.css + ../fw/kit.js + ../fw/data.json
       + lib.js + ARCH18 read out of engine/data/canon.js   ->  out/<name>.html
     tools/pack.js                                          ->  out/<name>-packed.html

   The FW kit is reused as it stands, read only, so these four look like the
   six FW mockups and are judged on the idea and not on a palette. ARCH18 is
   not in the FW data file, so it is read straight out of canon.js at build
   time: the roster of eighteen on these pages is the engine's own table, not
   a copy typed in here.

     node proto/intake/build.js [name ...]
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process');
const D=__dirname, ROOT=path.resolve(D,'..','..'), FW=path.join(ROOT,'proto','fw');
const head=fs.readFileSync(path.join(ROOT,'atuned_src/shell/head.html'),'utf8');
const font=(head.match(/@font-face\{[^}]*\}/)||[''])[0];
if(!font)throw new Error('no @font-face in shell/head.html');
const canon=fs.readFileSync(path.join(ROOT,'atuned_src/engine/data/canon.js'),'utf8');
const a18=(canon.match(/var ARCH18=(\[[\s\S]*?\]\]);/)||[])[1];
if(!a18)throw new Error('ARCH18 not found in canon.js');
const ARCH18=JSON.parse(a18.replace(/'/g,'"'));
if(ARCH18.length!==18)console.log('  note: ARCH18 carries '+ARCH18.length+' rows');
const css=fs.readFileSync(path.join(FW,'kit.css'),'utf8');
const kit=fs.readFileSync(path.join(FW,'kit.js'),'utf8');
const data=fs.readFileSync(path.join(FW,'data.json'),'utf8');
const lib=fs.readFileSync(path.join(D,'lib.js'),'utf8');
const extra=JSON.stringify({PTS:[],FIGS:{}});
fs.mkdirSync(path.join(D,'out'),{recursive:true});
const want=process.argv.slice(2);
const pages=fs.readdirSync(path.join(D,'pages')).filter(f=>f.endsWith('.html'))
 .map(f=>f.slice(0,-5)).filter(n=>!want.length||want.includes(n));
for(const name of pages){
 let h=fs.readFileSync(path.join(D,'pages',name+'.html'),'utf8');
 h=h.replace('<!--KIT-->','<style>'+font+'\n'+css+'</style>');
 h=h.replace('<!--DATA-->','<script>var DATA='+data+';var CHARTS='+extra+';var ARCH18='
  +JSON.stringify(ARCH18)+';\n'+kit+'\n'+lib+'</script>');
 h=h.replace(/\{\{img:([\w.-]+)\}\}/g,(m,f)=>{
  const b=fs.readFileSync(path.join(FW,'shots',f));
  return 'data:image/jpeg;base64,'+b.toString('base64');});
 /* the house rules, checked on what ships rather than on what was meant */
 if(/—/.test(h))throw new Error(name+': an em dash');
 const out=path.join(D,'out',name+'.html');
 fs.writeFileSync(out,h);
 cp.execSync(`node tools/pack.js ${path.relative(ROOT,out)} ${path.relative(ROOT,path.join(D,'out',name+'-packed.html'))}`,{cwd:ROOT,stdio:'pipe'});
 const sz=f=>(fs.statSync(path.join(D,'out',f)).size/1024).toFixed(0)+' KB';
 console.log(name.padEnd(12),sz(name+'.html'),'packed',sz(name+'-packed.html'));
}
