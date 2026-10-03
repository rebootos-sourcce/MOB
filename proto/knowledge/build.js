/* ============================================================
   Builds the four knowledge base mockups into standalone files, then
   packs each one with tools/pack.js so it survives being sent.

   node proto/knowledge/build.js

   src/X.html      the mockup, with <!--CSS--> and <!--JS--> markers
   X.html          standalone: data, runtime and style inlined, no network
   packed/X.html   the same, gzipped with its own decompressor

   Fails on an em dash anywhere in the output, which is a standing ruling.
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process');
const D=__dirname, ROOT=path.join(D,'..','..');
const rd=f=>fs.readFileSync(path.join(D,'src',f),'utf8');
const css=rd('common.css'), data=rd('data.js'), js=rd('common.js');
const NAMES=['a-atlas','b-deck','c-codex','d-map'];
fs.mkdirSync(path.join(D,'packed'),{recursive:true});
let bad=0;
NAMES.forEach(n=>{
 const f=path.join(D,'src',n+'.html'); if(!fs.existsSync(f))return;
 let h=fs.readFileSync(f,'utf8')
  .replace('<!--CSS-->',()=>'<style>\n'+css+'\n</style>')
  .replace('<!--JS-->',()=>'<script>\n'+data+'\n</script>\n<script>\n'+js+'\n</script>');
 /* the stamp pack.js carries onto the outer page */
 h=h.replace('<html lang="en">','<html lang="en" data-build="proto-knowledge-'+n+'">');
 if(/\u2014/.test(h)){console.error('  em dash in '+n);bad=1;}
 const out=path.join(D,n+'.html'); fs.writeFileSync(out,h);
 /* pack.js resolves both paths against the repo root, so pass them relative to it */
 const rel=path.relative(ROOT,out), prel=path.relative(ROOT,path.join(D,'packed',n+'.html'));
 console.log(cp.execSync('node tools/pack.js '+JSON.stringify(rel)+' '+JSON.stringify(prel),{cwd:ROOT}).toString().trimEnd());
});
process.exit(bad);
