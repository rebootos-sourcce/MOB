/* ============================================================
   BUILD THE STORY PAGE MOCKUPS. Round HT in TASKS.md.

     node proto/story-redesign/src/build.js [--rev <git rev>]

   Writes proto/story-redesign/story-redesign.html: one file, all four
   mockups, the engine and the typeface inside it, nothing fetched. The
   fieldpanel prototype would not open for him on its own and the release
   prototype loads ../../engine.js as a sibling, which is the same failure
   waiting: a file that needs its neighbours is not a file you can send.

   IT READS THE COMMITTED ENGINE, NOT THE WORKING TREE, because the tree is
   shared with other seats and can carry a build in flight. A mockup built on
   half of somebody else's change would be reviewing that change.

   Then it packs a copy with tools/pack.js, the product's own delivery
   packer, for sending as an attachment.
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
var shared=fs.readFileSync(path.join(here,'shared.js'),'utf8');
var html=tpl.split('{{FONT}}').join(font).split('{{STAMP}}').join(sha+' '+md5.slice(0,12))
 .split('{{STAMPJSON}}').join(JSON.stringify(stamp))
 .split('{{SHARED}}').join(shared).split('{{ENGINE}}').join(engine);
/* the house rule, checked on what ships and on the sources it came from. The
   character is built from its code point, so this file never carries one. */
[['template.html',tpl],['shared.js',shared],['story-redesign.html',html]].forEach(function(p){
 if(p[1].indexOf(String.fromCharCode(0x2014))>=0)throw new Error(p[0]+' carries an em dash');});
var file=path.join(out,'story-redesign.html');
fs.writeFileSync(file,html);
console.log('  story-redesign.html  '+html.length.toLocaleString()+' bytes, engine '+sha+' '+md5.slice(0,12));
var packed=path.join(out,'story-redesign-packed.html');
try{cp.execFileSync('node',[path.join(root,'tools','pack.js'),path.relative(root,file),path.relative(root,packed)],{cwd:root,stdio:'inherit'});
 console.log('  story-redesign-packed.html  '+fs.statSync(packed).size.toLocaleString()+' bytes');}
catch(e){console.log('  pack skipped: '+e.message.split('\n')[0]);}
