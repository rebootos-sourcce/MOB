/* ============================================================
   BUILD THE GAMIFICATION TIMELINE.

     src.html + data.json + the product's own Inter  ->  gamification-timeline.html
     tools/pack.js                                   ->  gamification-timeline-packed.html

   One file, nothing fetched. The packed one is the one to send.

     NODE_PATH=/opt/node22/lib/node_modules node proto/gamification-timeline/extract.js
     node proto/gamification-timeline/build.js
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process');
const D=__dirname, ROOT=path.resolve(D,'..','..');
/* the committed head, not the working tree: another seat may be editing it */
const head=cp.execSync('git show HEAD:atuned_src/shell/head.html',{cwd:ROOT,maxBuffer:64<<20}).toString();
const font=(head.match(/@font-face\{[^}]*\}/)||[''])[0];
if(!font)throw new Error('no @font-face in shell/head.html');
let h=fs.readFileSync(path.join(D,'src.html'),'utf8');
const data=fs.readFileSync(path.join(D,'data.json'),'utf8');
h=h.replace('<!--FONT-->',()=>'<style>'+font+'</style>');
h=h.replace('<!--DATA-->',()=>'<script>var DATA='+data+';</script>');
/* the house rules, checked on what ships rather than on what was meant */
if(/—/.test(h))throw new Error('an em dash');
const prose=h.replace(/<script>var DATA=[\s\S]*?<\/script>/,'').replace(/<style>@font-face[\s\S]*?<\/style>/,'');
if(/\b108\b/.test(prose))throw new Error('108 outside the data block');
fs.writeFileSync(path.join(D,'gamification-timeline.html'),h);
cp.execSync('node tools/pack.js proto/gamification-timeline/gamification-timeline.html proto/gamification-timeline/gamification-timeline-packed.html',{cwd:ROOT,stdio:'pipe'});
const sz=f=>(fs.statSync(path.join(D,f)).size/1024).toFixed(0)+' KB';
console.log('gamification-timeline.html',sz('gamification-timeline.html'),'packed',sz('gamification-timeline-packed.html'));
