/* build.js. The ritual page, three ways, as one file he can open.

   Run from the repo root, after the product build:
     ./atuned_src/BUILD.sh
     node proto/ritual-redesign/build.js [built-slim-html]

   It takes the real build (atuned-slim.html by default, which BUILD.sh writes
   beside source.html), so every option runs on the real engine, the real
   shell and the shipped atuned_src/ui/ritual.js. Two scripts go in and
   nothing is taken out:

     src/shim.js     first thing in the head, so the page seeds and saves
                     into memory and never into the browser store a saved
                     atuned.html would read. See the file for why.
     src/options.js  just before the end of file marker, which stays the last
                     element as the boot guard expects. It swaps the layout
                     for B and C and draws the bar that switches them.

   Then it packs the result with the product's own tools/pack.js, so the file
   carries its own decompressor and arrives whole, and keeps only the packed
   page. */
const fs=require('fs'),path=require('path'),cp=require('child_process');
const D=__dirname, ROOT=path.join(D,'../..');
const SRC=path.resolve(ROOT,process.argv[2]||'atuned-slim.html');
let h=fs.readFileSync(SRC,'utf8');
const shim=fs.readFileSync(path.join(D,'src/shim.js'),'utf8');
const opts=fs.readFileSync(path.join(D,'src/options.js'),'utf8');
if(h.indexOf('<head>')<0)throw new Error('no <head> in '+SRC);
if(h.indexOf('<div id="eof"')<0)throw new Error('no end of file marker in '+SRC);
if(h.indexOf('function ritLayout(')<0)throw new Error(SRC+' predates the ritual redesign: rebuild first');
h=h.replace('<head>','<head><script>\n'+shim+'\n</script>');
h=h.replace('<div id="eof"','<script>\n'+opts+'\n</script>\n<div id="eof"');
h=h.replace(/<title>[^<]*<\/title>/,'<title>Ritual, three ways</title>');
if(/—|–/.test(shim+opts))throw new Error('a dash that is not a hyphen');
const RAW=path.join('proto/ritual-redesign','ritual-redesign.html');
const OUT=path.join('proto/ritual-redesign','ritual-redesign-packed.html');
fs.writeFileSync(path.join(ROOT,RAW),h);
cp.execFileSync('node',[path.join(ROOT,'tools/pack.js'),RAW,OUT],{cwd:ROOT,stdio:'inherit'});
fs.unlinkSync(path.join(ROOT,RAW));
console.log(OUT,(fs.statSync(path.join(ROOT,OUT)).size/1024).toFixed(0)+' KB');
