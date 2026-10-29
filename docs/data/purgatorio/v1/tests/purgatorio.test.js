'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const reg=require(path.join(root,'PURGATORIO_REGISTRY_V1.json'));
const {readPurgatorio,purgatorioTerraceForRecord}=require(path.join(root,'src','purgatorio-oscillation.js'));
assert.equal(reg.records.length,23);
assert.equal(reg.records.filter(x=>x.kind==='purgatorio_terrace').length,7);
assert.equal(reg.records.filter(x=>x.kind==='purgatorio_vice').length,7);
assert.equal(reg.records.filter(x=>x.kind==='purgatorio_capacity').length,7);
assert.equal(reg.records.filter(x=>x.kind==='purgatorio_boundary').length,2);
const expectedFields=new Set(reg.templateFields);
const ids=new Set(reg.records.map(r=>r.id));assert.equal(ids.size,reg.records.length);
reg.records.forEach(r=>{
  assert.equal(r.researchPasses.length,4,r.id);
  assert.deepEqual(new Set(Object.keys(r.template)),expectedFields,r.id);
  r.template.researchPasses.forEach((p,i)=>assert.equal(p.passNumber,i+1,r.id));
  if(r.kind==='purgatorio_terrace'){
    assert(ids.has(r.polarity.viceId),r.id);
    assert(ids.has(r.polarity.virtueId),r.id);
    assert.equal(purgatorioTerraceForRecord(reg,r.polarity.viceId).id,r.id);
  }
  if(r.kind==='purgatorio_vice'||r.kind==='purgatorio_capacity'){
    const inv=reg.records.find(x=>x.id===r.oppositeRecordId);
    assert.equal(inv.oppositeRecordId,r.id,r.id);
  }
});
for(let c=0;c<=100;c++){
 const r=readPurgatorio(reg,c,[]);
 assert.equal(r.waist,c>=40&&c<=60);
 assert.equal(r.terraces.length,7);
 assert.equal(r.observedEvents,0);
 assert.equal(r.placement,'not_inferred');
}
let r=readPurgatorio(reg,50,[
 {terraceId:'purgatorio:P01',poleId:'purgatorio:P01-V',observedAt:'2026-10-20T00:00:00Z',evidence:'dismissed feedback'},
 {terraceId:'purgatorio:P01',poleId:'purgatorio:P01-C',observedAt:'2026-10-21T00:00:00Z',evidence:'acknowledged correction'},
 {terraceId:'purgatorio:P01',poleId:'purgatorio:P01-V',observedAt:'2026-10-22T00:00:00Z',evidence:'redirected credit'},
 {terraceId:'purgatorio:P07',poleId:'purgatorio:P07-C',observedAt:'2026-10-22T00:00:00Z',evidence:'respected no'},
 {terraceId:'purgatorio:P07',poleId:'WRONG',observedAt:'2026-10-22T00:00:00Z',evidence:'not a known pole'}
]);
assert.equal(r.ignoredEvents,1); assert.equal(r.observedEvents,4);
assert.equal(r.terraces[0].turns,2);
assert.deepEqual(r.terraces[0].behaviorEvidence,{vice:2,capacity:1});
assert.equal(r.terraces[6].lastPole,'capacity');
assert.throws(()=>readPurgatorio(reg,NaN,[]),/CQ/);
assert.throws(()=>readPurgatorio(reg,101,[]),/CQ/);
console.log('PASS: 23 records, 21-field compatibility, 4 research layers, opposite symmetry, 101 CQ positions, event-based oscillation and invalid-event rejection');