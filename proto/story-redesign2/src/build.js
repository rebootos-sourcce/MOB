/* ============================================================
   BUILD THE SECOND ROUND OF STORY PAGE LAYOUTS. Round HY in TASKS.md.

     node proto/story-redesign2/src/build.js [--rev <git rev>]

   Writes proto/story-redesign2/story-redesign2.html: one file, all four
   layouts, the engine and the typeface inside it, nothing fetched. Then packs
   a copy with tools/pack.js, the product's own delivery packer.

   It reads the COMMITTED engine, not the working tree, because the tree is
   shared with other seats and can carry a build in flight.

   If sim.json sits beside the page, the simulation's own numbers are carried
   into the notes under the fold, so the file he opens has the results in it.
   ============================================================ */
var fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
var here=__dirname,out=path.join(here,'..'),root=path.join(here,'..','..','..');
var ri=process.argv.indexOf('--rev'),rev=ri>0?process.argv[ri+1]:'HEAD';
function git(a){return cp.execFileSync('git',a,{cwd:root,encoding:'utf8',maxBuffer:64<<20});}
var sha=git(['rev-parse','--short',rev]).trim();
var engine=git(['show',rev+':engine.js']);
var head=git(['show',rev+':atuned_src/shell/head.html']);
var fi=head.indexOf('<style>@font-face'),fe=head.indexOf('</style>',fi);
if(fi<0||fe<0)throw new Error('the embedded typeface was not found in head.html');
var font=head.slice(fi,fe+8);
if(/<\/script/i.test(engine))throw new Error('engine.js carries a closing script tag and cannot be inlined');
var md5=crypto.createHash('md5').update(engine).digest('hex');
var stamp={engine:'engine.js from commit '+sha+', md5 '+md5.slice(0,12),when:new Date().toISOString().slice(0,10)};
var tpl=fs.readFileSync(path.join(here,'template.html'),'utf8');
var shared=fs.readFileSync(path.join(here,'story2.js'),'utf8');
var simPath=path.join(out,'sim.json'),sim='null';
if(fs.existsSync(simPath)){var S=JSON.parse(fs.readFileSync(simPath,'utf8'));sim=JSON.stringify(S.page||null).replace(/<\//g,'<\\/');}
var html=tpl.split('{{FONT}}').join(font).split('{{STAMP}}').join(sha+' '+md5.slice(0,12))
 .split('{{STAMPJSON}}').join(JSON.stringify(stamp)).split('{{SIMJSON}}').join(sim)
 .split('{{SHARED}}').join(shared).split('{{ENGINE}}').join(engine);
/* the house rule, on what ships and on every source it came from. The
   character is built from its code point, so this file never carries one. */
var ED=String.fromCharCode(0x2014);
fs.readdirSync(here).forEach(function(f){if(fs.readFileSync(path.join(here,f),'utf8').indexOf(ED)>=0)throw new Error('src/'+f+' carries an em dash');});
[['story-redesign2.html',html],['sim.json',sim]].forEach(function(p){if(p[1].indexOf(ED)>=0)throw new Error(p[0]+' carries an em dash');});
var file=path.join(out,'story-redesign2.html');
fs.writeFileSync(file,html);
console.log('  story-redesign2.html  '+html.length.toLocaleString()+' bytes, engine '+sha+' '+md5.slice(0,12)+(sim!=='null'?', simulation carried':''));
var packed=path.join(out,'story-redesign2-packed.html');
try{cp.execFileSync('node',[path.join(root,'tools','pack.js'),path.relative(root,file),path.relative(root,packed)],{cwd:root,stdio:'inherit'});
 console.log('  story-redesign2-packed.html  '+fs.statSync(packed).size.toLocaleString()+' bytes');}
catch(e){console.log('  pack skipped: '+e.message.split('\n')[0]);}
