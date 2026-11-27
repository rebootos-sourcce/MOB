#!/usr/bin/env node
/* Guarded delivery rebuild negative tests. Local Git fixtures only; no network. */
'use strict';
const fs=require('fs'), os=require('os'), path=require('path'), cp=require('child_process'), assert=require('assert');
const script=path.resolve(__dirname,'../tools/rebuild-review-products.sh');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'atuned-review-rebuild-'));
let passed=0,failed=0;
function run(args,cwd,env={}) {
 const p=cp.spawnSync(args[0],args.slice(1),{cwd,encoding:'utf8',env:{...process.env,...env}});
 return {code:p.status,output:(p.stdout||'')+(p.stderr||'')};
}
function ok(yes,name) {
 if(yes){passed++;console.log('  ok '+name);}
 else{failed++;console.error('FAIL '+name);}
}
const identity={GIT_AUTHOR_NAME:'Fixture',GIT_AUTHOR_EMAIL:'fixture@example.invalid',GIT_COMMITTER_NAME:'Fixture',GIT_COMMITTER_EMAIL:'fixture@example.invalid'};
function file(root,name,body){
 const target=path.join(root,name);fs.mkdirSync(path.dirname(target),{recursive:true});
 fs.writeFileSync(target,body,{mode:0o755});
}
try {
 const root=path.join(tmp,'full');fs.mkdirSync(root);
 assert.equal(run(['git','init','-b','qa/deep-psyche-registry-recovery'],root).code,0);
 file(root,'tools/rebuild-review-products.sh',fs.readFileSync(script));
 file(root,'atuned_src/BUILD-engine.sh','#!/bin/sh\nprintf engine > engine.js\n');
 file(root,'atuned_src/BUILD.sh','#!/bin/sh\nprintf source > source.html\nprintf packed > atuned-packed.html\n');
 file(root,'funnel/BUILD-single.sh','#!/bin/sh\nmkdir -p funnel/dist\nprintf quiz > funnel/dist/atuned-quiz.html\n');
 file(root,'tools/products.js','console.log("mock products self-test passed");\n');
 fs.writeFileSync(path.join(root,'seed.txt'),'first');
 assert.equal(run(['git','add','.'],root).code,0);
 assert.equal(run(['git','commit','-m','seed'],root,identity).code,0);
 fs.appendFileSync(path.join(root,'seed.txt'),'\nsecond');
 assert.equal(run(['git','commit','-am','second'],root,identity).code,0);
 let out=run(['bash','tools/rebuild-review-products.sh'],root);
 ok(out.code===0&&out.output.includes('BUILD COMPLETED')&&fs.existsSync(path.join(root,'source.html'))&&fs.existsSync(path.join(root,'funnel/dist/atuned-quiz.html')),
 'full-history approved review branch builds products');
 out=run(['bash','tools/rebuild-review-products.sh'],root);
 ok(out.code!==0&&out.output.includes('dirty working tree'),
 'dirty tree refused before builders execute');
 run(['git','reset','--hard','HEAD'],root);
 for(const name of ['source.html','engine.js','atuned-packed.html'])fs.rmSync(path.join(root,name),{force:true});
 fs.rmSync(path.join(root,'funnel/dist'),{recursive:true,force:true});
 run(['git','checkout','-b','main'],root);
 out=run(['bash','tools/rebuild-review-products.sh'],root);
 ok(out.code!==0&&out.output.includes('not an approved QA review branch')&&!fs.existsSync(path.join(root,'source.html')),
 'main refused before builders execute');
 run(['git','checkout','qa/deep-psyche-registry-recovery'],root);
 const shallow=path.join(tmp,'shallow');
 assert.equal(run(['git','clone','--depth','1','--branch','qa/deep-psyche-registry-recovery','file://'+root,shallow],tmp).code,0);
 out=run(['bash','tools/rebuild-review-products.sh'],shallow);
 ok(out.code!==0&&out.output.includes('shallow checkout')&&!fs.existsSync(path.join(shallow,'source.html')),
 'shallow checkout refused before builders execute');
} catch(e) {failed++;console.error('FAIL fixture:',e);}
finally {fs.rmSync(tmp,{recursive:true,force:true});}
console.log('===== '+passed+' passed, '+failed+' failed =====');
process.exit(failed?1:0);
