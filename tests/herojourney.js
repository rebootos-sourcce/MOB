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
console.log('PASS: 26 stages, thresholds, unique release polarity, baseline, active encounter, action routing, partial guard');
