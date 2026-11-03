/* Behavior-only integration gate for the Avatar Connections seam.
 * Does NOT test aesthetics; the Avatar/UI AI owns appearance.
 * Run node tests/avatargraph-ui-contract.js
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const file=path.join(__dirname,'..','atuned_src','ui','avatarui.js');
const src=fs.readFileSync(file,'utf8');
const begin=src.indexOf('function avGraphHTML(st){');
const finish=src.indexOf('\nfunction avMenu(st){',begin);
assert.ok(begin>=0&&finish>begin,'The existing Connections seam is present');
const fn=src.slice(begin,finish);
let calls=0;
function view(result,options={}){
 const selected=options.selected!==false;
 const opened=options.opened!==false;
 const ctx={
  AV:{graphOpen:opened}, avOwn:()=>selected,
  AVATAR_GRAPH:{project:(a)=>{calls++;assert.equal(a.selection.kind,'seat');assert.equal(a.selection.id,'Root');return result;}},
  CURP:{id:'test-profile'}, readSeenOf:()=>({rec:'test-profile'}),
  traceFromRecord:()=>{},traceNeighbors:()=>{},
  esc:x=>String(x).replace(/[<>&]/g,''),
 };
 return vm.runInNewContext(fn+'\navGraphHTML({seat:"Root"})',ctx,{timeout:1000});
}
let count=0;
function check(name,fn){fn();count++;console.log('PASS',name);}
const blank={status:'no_evidence',nodes:[],truncated:false,graph:{flagged:0}};
check('Connections stays closed without requesting graph',()=>{
 const n=calls,v=view(blank,{opened:false});
 assert.match(v,/aria-expanded="false"/);
 assert.equal(calls,n);
});
check('No unauthorized profile leaves the Connections surface',()=>{
 const n=calls,v=view(blank,{selected:false});assert.equal(v,'');assert.equal(calls,n);
});
check('Blank canonical graph does not invent personal data',()=>{
 const v=view(blank);assert.match(v,/No personal connections recorded/);
 assert.doesNotMatch(v,/Inferred|Confirmed/);
});
check('Flagged empty graph shows a warning but does not fail the page',()=>{
 const v=view({...blank,graph:{flagged:2}});
 assert.match(v,/No personal connections recorded/);
 assert.match(v,/flagged and excluded/);
 assert.doesNotMatch(v,/Connections are unavailable/);
});
const partly={status:'partial',nodes:[{label:'Compulsion',type:'pattern',status:'confirmed'}],
 truncated:false,graph:{flagged:1}};
check('Partial graph renders supported node and flag warning',()=>{
 const v=view(partly);assert.match(v,/Compulsion/);assert.match(v,/Confirmed/);
 assert.match(v,/flagged or refused/);assert.doesNotMatch(v,/Connections are unavailable/);
});
check('Ready result stays clean and does not show irrelevant warnings',()=>{
 const v=view({...partly,status:'ready',graph:{flagged:0}});
 assert.match(v,/Compulsion/);assert.doesNotMatch(v,/flagged or refused|unavailable/);
});
check('Unavailable optional graph has a nonidentifying fallthrough',()=>{
 const v=view({...blank,status:'unavailable'});assert.match(v,/Connections are unavailable/);
 assert.doesNotMatch(v,/test-profile/);
});
console.log('AVATAR GRAPH UI CONTRACT '+count+'/'+count+' passed');
