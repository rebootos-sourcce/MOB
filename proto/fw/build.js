/* ============================================================
   BUILD THE FW MOCKUPS. Round FW in TASKS.md.

     pages/<name>.html + kit.css + kit.js + data.json + img/  ->  out/<name>.html
                                                  tools/pack.js ->  out/<name>-packed.html

   Every output is one file with nothing fetched: the product's own Inter is
   lifted out of atuned_src/shell/head.html, the images are data URIs, and the
   readings are data.json, which extract.js read out of the committed build.
   The packed file is the one to send; the plain one is for reading.

     node proto/fw/extract.js   (once, needs playwright)
     node proto/fw/build.js [name ...]
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process');
const D=__dirname, ROOT=path.resolve(D,'..','..');
const head=fs.readFileSync(path.join(ROOT,'atuned_src/shell/head.html'),'utf8');
const font=(head.match(/@font-face\{[^}]*\}/)||[''])[0];
if(!font)throw new Error('no @font-face in shell/head.html');
const css=fs.readFileSync(path.join(D,'kit.css'),'utf8');
const kit=fs.readFileSync(path.join(D,'kit.js'),'utf8');
const data=fs.readFileSync(path.join(D,'data.json'),'utf8');
const {PTS,FIGS}=require(path.join(ROOT,'proto/anatomy-ref/charts.js'));
const after=require(path.join(ROOT,'proto/anatomy-ref/out/after.json'));
const extra=JSON.stringify({PTS,FIGS,chartOnUs:after.chartOnUs,figure:after.figure});
fs.mkdirSync(path.join(D,'out'),{recursive:true});
const want=process.argv.slice(2);
const pages=fs.readdirSync(path.join(D,'pages')).filter(f=>f.endsWith('.html'))
 .map(f=>f.slice(0,-5)).filter(n=>!want.length||want.includes(n));
for(const name of pages){
 let h=fs.readFileSync(path.join(D,'pages',name+'.html'),'utf8');
 h=h.replace('<!--KIT-->','<style>'+font+'\n'+css+'</style>');
 h=h.replace('<!--DATA-->','<script>var DATA='+data+';var CHARTS='+extra+';\n'+kit+'</script>');
 h=h.replace(/\{\{img:([\w.-]+)\}\}/g,(m,f)=>{
  const b=fs.readFileSync(path.join(D,'img',f));
  return 'data:image/'+(f.endsWith('.png')?'png':'jpeg')+';base64,'+b.toString('base64');});
 /* the house rules, checked on what ships rather than on what was meant */
 if(/\u2014/.test(h))throw new Error(name+': an em dash');
 if(/\b108\b/.test(h.replace(/<script>var DATA=[\s\S]*?<\/script>/,'')))console.log('  note: '+name+' carries 108 outside the data block');
 const out=path.join(D,'out',name+'.html');
 fs.writeFileSync(out,h);
 cp.execSync(`node tools/pack.js ${path.relative(ROOT,out)} ${path.relative(ROOT,path.join(D,'out',name+'-packed.html'))}`,{cwd:ROOT,stdio:'pipe'});
 const sz=f=>(fs.statSync(path.join(D,'out',f)).size/1024).toFixed(0)+' KB';
 console.log(name.padEnd(12),sz(name+'.html'),'packed',sz(name+'-packed.html'));
}
