'use strict';
/* Headless integration smoke gate for the Hero's Journey Board.
 * Run after ./atuned_src/BUILD-engine.sh: node tests/herojourney.js */
const fs=require('fs'),assert=require('assert'),vm=require('vm'),path=require('path');
const src=fs.readFileSync(path.resolve('atuned_src/engine/data/hero_journey.js'),'utf8')+'\n'
 +fs.readFileSync(path.resolve('atuned_src/engine/hero_journey.js'),'utf8');
const context={
 CQ_MODEL:2,SINAMES:['Truth','Courage'],SI:[{nm:'Truth',b:'Throat'},{nm:'Courage',b:'Solar'}],
 S:{rec:'p1'},W:[{i:1,b:'Throat',cf:'Fear',sq:5},{i:2,b:'Solar',cf:'Apathy',sq:6}],
 compute:()=>({CQ:40,complete:true,unread:false,DQ:50}),
 cqSpan:()=>({answered:2,of:2,complete:true}),
 ritFor:()=>({called:{k:'box',track:'Body'}})
};
vm.createContext(context);vm.runInContext(src,context);
const loc=x=>context.hjLocate(x).id;
assert.equal(context.HJ_SCENES.length,26);
assert(context.HJ_SCENES.every(s=>s.guide&&s.successEvidence&&s.source&&s.sourceLocation),'all 26 scenes carry guide, evidence and source');
assert.equal(loc(0),'game:inferno:L09');
assert.equal(loc(39.999),'game:inferno:L01');
assert.equal(loc(40),'game:purgatorio:P01');
assert.equal(loc(59.999),'game:purgatorio:P07');
assert.equal(loc(60),'game:paradiso:PD01');
assert.equal(loc(100),'game:paradiso:PD10');
assert.equal(context.hjLocate(-1),null);
assert.equal(context.hjLocate(101),null);
const p={id:'p1',avatar:{cqOrigin:null,activeJourneyScene:null},laws:{Truth:8,Courage:5},
 meter:{unique:['1:Llimit:0','1:Rlimit:0','1:Ltruth:0','1:Rtruth:0','1:Llimit:0','bad']},history:[]};
assert.equal(context.hjReleaseKeys(p).length,2);
let r=context.hjRead(p);
assert.equal(r.uniqueReleaseCount,2);
assert.equal(r.location.id,'game:purgatorio:P01');
assert.equal(context.hjStampOrigin(p),true);
assert.equal(context.hjStampOrigin(p),false);
assert.equal(p.avatar.cqOrigin.cq,40);
assert.equal(context.hjRead(p).delta,0);
p.avatar.activeJourneyScene='game:inferno:L08';
assert.equal(context.hjRead(p).active.id,'game:inferno:L08');
assert(context.hjReleaseAddresses(context.hjScene('game:inferno:L08')).includes(1));
assert.equal(context.hjRitualCandidate(context.hjScene('game:inferno:L08'),{DQ:50}).practice.k,'box');
context.cqSpan=()=>({answered:1,of:2,complete:false});
r=context.hjRead(p);
assert.equal(r.location,null);
assert.equal(r.cq,null);
/* Reject malformed CQ history baselines and snapshots without treating them
   as real user movement or altering the canonical CQ engine. */
const bad={id:'p1',avatar:{cqOrigin:{cq:NaN,m:2}},laws:{Truth:8,Courage:5},
 meter:{unique:[]},history:[
  {m:2,cq:Infinity,t:'bad-infinite',lawNow:{Truth:7,Courage:6}},
  {m:2,cq:101,t:'bad-out-of-range',lawNow:{Truth:7,Courage:6}},
  {m:2,cq:55,t:'bad-law',lawNow:{Truth:NaN,Courage:6}}
 ]};
assert.equal(context.hjOrigin(bad),null,'invalid origin and invalid snapshots must not establish baseline');
context.cqSpan=()=>({answered:2,of:2,complete:true});
const clean=context.hjRead(bad);
assert.equal(clean.origin,null);
assert.equal(clean.fromLast,null,'invalid historic snapshot must not produce movement');
bad.history.push({m:2,cq:55,t:'valid',lawNow:{Truth:7,Courage:6}});
assert.equal(context.hjOrigin(bad).cq,55,'valid complete history restores baseline');
assert.equal(context.hjRead(bad).fromLast,-15);
/* Check the actual source registry joins, not just the staged atlas count. */
const board=JSON.parse(fs.readFileSync(path.resolve('docs/data/compass/gameboard/v1/GAMEBOARD_MAP_V1.json'),'utf8'));
const purg=JSON.parse(fs.readFileSync(path.resolve('docs/data/purgatorio/v1/PURGATORIO_REGISTRY_V1.json'),'utf8'));
const para=JSON.parse(fs.readFileSync(path.resolve('docs/data/paradiso/v0/PARADISO_REGISTRY_V0.json'),'utf8'));
const boardNodes=new Map(board.nodes.map(n=>[n.id,n]));
const sourceRecords=new Set(purg.records.concat(para.records).map(n=>n.id));
assert.equal(board.nodes.length,26,'exactly 26 Board source nodes');
assert.equal(boardNodes.size,26,'Board node IDs are unique');
for(const scene of context.HJ_SCENES){
 const node=boardNodes.get(scene.id);
 assert(node,'Board has source node for '+scene.id);
 assert.equal(scene.source,node.sourceRecordId,'live scene matches its Board source record');
 assert(scene.guide&&scene.successEvidence&&scene.sourceLocation,'scene exposes guide, evidence and source');
 if(scene.realm!=='INFERNO')
  assert(sourceRecords.has(scene.source),'nonarchival source record exists for '+scene.id);
}
/* Fixed protocol identities require approval; the current Board only offers
   profile-dependent real writers. This test must not invent their IDs. */
assert(board.nodes.every(n=>n.releaseProtocolId==null&&n.becomingRitualId==null));
console.log('PASS: 26 stages, thresholds, unique releases, canonical source joins, baseline, action routing, partial guard');
