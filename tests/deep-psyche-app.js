#!/usr/bin/env node
'use strict';
/* Acceptance for the source-of-truth-to-shipped-app integration. */
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
const app=path.join(ROOT,'atuned_src');
const source=fs.readFileSync(path.join(app,'engine/data/deep_psyche.js'),'utf8');
const scope={};vm.runInNewContext(source+';this.loaded=DEEP_PSYCHE;',scope,{timeout:5000});
const db=scope.loaded;
const registry=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json'),'utf8'));
const manifest=fs.readFileSync(path.join(app,'MANIFEST'),'utf8');
const ui=fs.readFileSync(path.join(app,'ui/knowledge.js'),'utf8');
assert(db.records.length===registry.recordCount,'App count does not equal source registry');
assert(db.records.every(x=>x.templateId && x.reviewPassCount===4),'Incomplete app records');
assert(db.records.filter(x=>x.displaySlotOnly).length===14,'Visual slots not preserved');
assert(db.records.find(x=>x.id==='blueprint:personal-model'),'Blueprint model absent from app');
assert(db.records.find(x=>x.id==='consciousness:conceptual-group'),'Consciousness model absent from app');
assert(db.records.filter(x=>x.type==='v341_domain_candidate').length===19,'19 source domains missing');
assert(db.records.filter(x=>x.type==='archetype_candidate').length===18,'18 archetype candidates missing');
const by=new Map(db.records.map(x=>[x.id,x]));
for(const original of registry.records){
 const delivered=by.get(original.id);
 assert(delivered,'Shipped app record missing: '+original.id);
 assert.deepStrictEqual(JSON.parse(JSON.stringify(delivered.relationships)),original.relationships,
  'Typed source relationship provenance lost: '+original.id);
 assert.deepStrictEqual(JSON.parse(JSON.stringify(delivered.sourceRefs)),original.sourceRefs,
  'Source citations lost: '+original.id);
 assert.deepStrictEqual(JSON.parse(JSON.stringify(delivered.sourceClaims)),original.sourceClaims||[],
  'Record source claims lost: '+original.id);
 assert(delivered.reviewStatus===original.status,'Source status mutated: '+original.id);
 assert(delivered.depthReviewStatus?.structuralStatus==='PASS',
  'Depth structural review missing: '+original.id);
}
for(const x of db.records){
 for(const link of x.linkedIds){
  const other=by.get(link);
  assert(other && other.linkedIds.includes(x.id),'Non-reciprocal app link '+x.id+' -> '+link);
 }
}
const modules=manifest.split(/\r?\n/).filter(Boolean);
const dataIndex=modules.indexOf('engine/data/deep_psyche.js');
const uiIndex=modules.indexOf('ui/knowledge.js');
assert(dataIndex>=0 && uiIndex>dataIndex,'App data not loaded before Knowledge interface');
for(const marker of ["['psyche','Deep Psyche']","if(sec==='psyche'","if(x.k==='psyche')","DEEP_PSYCHE.records"])assert(ui.includes(marker),'Knowledge UI missing '+marker);
assert(!ui.includes('const DEEP_PSYCHE='),'App UI contains independent copied registry');
const sourceHtml=path.join(ROOT,'source.html');
if(process.env.CI)assert(fs.existsSync(sourceHtml),'CI acceptance requires a built source.html');
if(fs.existsSync(sourceHtml)){
 const html=fs.readFileSync(sourceHtml,'utf8');
 assert(html.includes('var DEEP_PSYCHE='),'Built app missing Deep Psyche records');
 assert(html.includes('Deep Psyche'),'Built app missing Psyche UI label');
}
console.log(JSON.stringify({status:'PASS',sourceRecords:registry.recordCount,appRecords:db.records.length,fourPassRecords:db.records.filter(x=>x.reviewPassCount===4).length,domainRoster:19,archetypes:18,visualSlots:14,manifestOrderCorrect:true,uiWired:true,htmlBuildVerified:fs.existsSync(sourceHtml)},null,2));
