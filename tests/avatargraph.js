/* Avatar read-only graph regression gate. No browser or generated engine required.
 * Run: node tests/avatargraph.js
 */
'use strict';
const assert=require('node:assert/strict');
const G=require('../atuned_src/engine/avatargraph.js');
const clone=x=>JSON.parse(JSON.stringify(x));
const graph={alg:4,gaps:[],refused:[],nodes:[
 {type:'pattern',id:'12',name:'Compulsion',seat:'Root',src:'known'},
 {type:'pattern',id:'13',name:'Disconnection',seat:'Sacral',src:'known'},
 {type:'saboteur',id:'Avoider',src:'inferred',w:3.7},
 {type:'story',id:'2026-01-01',src:'known',text:'SECRET JOURNAL'},
 {type:'release',id:'12:Llimit',src:'observed'}],edges:[
 {from:'story:2026-01-01',edge:'supports',to:'pattern:12',src:'user_confirmed'},
 {from:'pattern:12',edge:'supports',to:'saboteur:Avoider',src:'inferred'},
 {from:'release:12:Llimit',edge:'targets',to:'pattern:12',src:'observed'},
 {from:'pattern:13',edge:'causes',to:'saboteur:Avoider',src:'user_confirmed'}]};
let called=0;const profile={id:'record-A',story:{entries:[{ob:{yes:[12],no:[]},text:'SECRET JOURNAL'}]}};
const engine={traceFromRecord:(p,intents,r)=>{called++;assert.equal(p.id,'record-A');assert.deepEqual(intents,[]);if(r)assert.equal(r.rec,'record-A');return clone(graph);},
 traceNeighbors:(g,k)=>g.edges.filter(x=>x.from===k||x.to===k).map(x=>({key:x.from===k?x.to:x.from,edge:x.edge,src:x.src})),
 practiceTraceIntents:()=>[]};
const run=(sel,over={})=>G.project({authorized:true,profile,engine,reading:{rec:'record-A'},selection:sel,...over});
let passed=0;function test(name,fn){fn();passed++;console.log('PASS',name);}
test('seven canonical seats',()=>assert.equal(G.seats.length,7));
test('explicit authorization required',()=>{let n=called;assert.equal(run({kind:'seat',id:'Root'},{authorized:false}).status,'access_denied');assert.equal(called,n);});
test('profile identity required',()=>assert.equal(run({kind:'seat',id:'Root'},{profile:{}}).status,'no_record'));
test('cross-profile reading refused before graph work',()=>{let n=called;assert.equal(run({kind:'seat',id:'Root'},{reading:{rec:'another'}}).status,'reading_mismatch');assert.equal(called,n);});
test('source, identity and personal text not exposed',()=>{let x=run({kind:'seat',id:'Root'});assert.doesNotMatch(JSON.stringify(x),/SECRET JOURNAL|record-A|2026-01-01/);});
test('real edges only and correct provenance',()=>{let x=run({kind:'seat',id:'Root'});assert.equal(x.status,'ready');assert.deepEqual(x.nodes.map(y=>y.key),['pattern:12','saboteur:Avoider']);assert.deepEqual(x.edges.map(y=>y.relationship),['supports']);assert.equal(x.evidence.storyLinks,1);assert.equal(x.nodes[0].status,'confirmed');});
test('causal statement not inferred or shown',()=>{let x=run({kind:'seat',id:'Sacral'});assert.equal(x.status,'no_evidence');assert.equal(x.nodes.length,0);assert.equal(x.edges.length,0);});
test('unrelated seat empty',()=>assert.equal(run({kind:'seat',id:'Heart'}).status,'no_evidence'));
test('no reading is not measured',()=>{let x=run({kind:'pattern',id:12},{reading:null});assert.equal(x.status,'ready');assert.equal(x.readingStatus,'not_measured');});
test('unknown selections fail closed',()=>assert.equal(run({kind:'mask',id:'Child'}).status,'unsupported_selection'));
test('rejection is not confirmation',()=>{let x=run({kind:'pattern',id:12},{profile:{id:'record-A',story:{entries:[{ob:{yes:[],no:[12]}}]}}});assert.equal(x.nodes[0].status,'rejected');});
test('conflict is surfaced',()=>{let x=run({kind:'pattern',id:12},{profile:{id:'record-A',story:{entries:[{ob:{yes:[12],no:[12]}}]}}});assert.equal(x.nodes[0].status,'conflicted');});
test('profile and graph unchanged',()=>{let z=JSON.stringify({graph,profile});run({kind:'seat',id:'Root'});assert.equal(JSON.stringify({graph,profile}),z);});
test('bounded results disclose truncation',()=>{let x=run({kind:'seat',id:'Root'},{limit:1});assert.equal(x.nodes.length,1);assert.equal(x.truncated,true);});
test('malformed graph is unavailable',()=>assert.equal(run({kind:'seat',id:'Root'},{engine:{...engine,traceFromRecord:()=>({nodes:null,edges:null})}}).status,'unavailable'));
test('structural graph refusal blocks chain',()=>assert.equal(run({kind:'seat',id:'Root'},{engine:{...engine,traceFromRecord:()=>({...clone(graph),refused:[{reading:true,why:'bad'}]})}}).status,'graph_refused'));
test('taxonomy alone never becomes personal evidence',()=>{
 let g={alg:4,nodes:[{type:'pattern',id:'12',name:'Compulsion',seat:'Root',src:'known'},{type:'pattern',id:'fetter:Fear',src:'known'}],
 edges:[{from:'pattern:12',edge:'associated_with',to:'pattern:fetter:Fear',src:'known'}],gaps:[],refused:[]};
 let x=run({kind:'seat',id:'Root'},{engine:{...engine,traceFromRecord:()=>g},reading:{rec:'record-A',unread:true}});
 assert.equal(x.status,'no_evidence');assert.equal(x.nodes.length,0);assert.equal(x.readingStatus,'not_measured');});
test('structural inference is not a confirmed identity',()=>{
 let g={alg:4,nodes:[{type:'pattern',id:'12',name:'Compulsion',seat:'Root',src:'known'},{type:'saboteur',id:'Avoider',src:'inferred',w:4}],
 edges:[{from:'pattern:12',edge:'supports',to:'saboteur:Avoider',src:'inferred'}],refused:[],gaps:[]};
 let e={...engine,traceFromRecord:()=>g};
 let x=run({kind:'seat',id:'Root'},{engine:e,profile:{id:'record-A'},reading:{rec:'record-A'}});
 assert.equal(x.status,'ready');assert.equal(x.evidence.confirmed,0);assert.equal(x.evidence.inferred,1);
 let y=run({kind:'seat',id:'Root'},{engine:e,profile:{id:'record-A'},reading:null});
 assert.equal(y.status,'no_evidence');});
test('observed release is not pattern confirmation',()=>{
 let g={alg:4,nodes:[{type:'pattern',id:'12',name:'Compulsion',seat:'Root',src:'known'},{type:'release',id:'12:Llimit',src:'known'}],
 edges:[{from:'release:12:Llimit',edge:'addresses',to:'pattern:12',src:'observed'}],refused:[],gaps:[]};
 let x=run({kind:'seat',id:'Root'},{engine:{...engine,traceFromRecord:()=>g},profile:{id:'record-A'},reading:null});
 assert.equal(x.status,'ready');assert.equal(x.nodes[0].status,'not_recorded');assert.equal(x.evidence.confirmed,0);});
test('unrelated refusals produce partial results',()=>{
 let x=run({kind:'seat',id:'Root'},{engine:{...engine,traceFromRecord:()=>({...clone(graph),refused:[{stored:true,why:'bad'}]})}});
 assert.equal(x.status,'partial');assert.equal(x.graph.refused,1);});
test('deterministic projection',()=>assert.deepEqual(run({kind:'seat',id:'Root'}),run({kind:'seat',id:'Root'})));
test('no unapproved high layers',()=>assert.equal(run({kind:'structure',type:'mask',id:'Ideological'}).status,'unsupported_selection'));
test('unknown seat refuses without graph call',()=>{let n=called;assert.equal(run({kind:'seat',id:'missing'}).status,'unsupported_selection');assert.equal(called,n);});
console.log('AVATAR GRAPH '+passed+'/'+passed+' passed');
