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
const nativeCandidates=db.records.flatMap(x=>x.nativeNavigationCandidates||[]);
assert(nativeCandidates.length===108,'Expected 108 source-derived native navigation candidates');
assert(nativeCandidates.filter(x=>x.kind==='seat').length===18,
 '18 documented ARCH18 seat pathways missing');
const aliases={Controller:'Micromanager',Outlaw:'Rebel',Healing:'Restoration',Love:'Connection',Communication:'Exchange',Destruction:'Dissolution',Architect:'Imperium'};
const routed=nativeCandidates.filter(x=>x.targetName);
assert.strictEqual(routed.length,10);
for(const ref of nativeCandidates){
 assert(ref.sourceField);
 if(ref.targetName)assert.strictEqual(ref.targetName,aliases[ref.name]);
 else assert.strictEqual(ref.evidenceStatus,'EXACT_LABEL_NAVIGATION_NOT_CANONICAL_EQUIVALENCE');
}
const by=new Map(db.records.map(x=>[x.id,x]));
/* The source registry retains literal research notes; the shipped drill
   must not present statistical sample notation as reader-facing copy. */
const displaySafe=value=>typeof value==='string'?value.replace(/\bn\s*=\s*14\b/g,'fourteen'):value;
const displayFields=['description','body','clear','distorted'];
for(const record of db.records){
 for(const field of displayFields)
  assert(!/\bn\s*=\s*14\b/.test(record[field]||''),
   'Research notation leaked into displayed '+field+': '+record.id);
}
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
/* Deliberately remove one pair's evidence while keeping other relationships.
   This must never be accepted as complete provenance. */
function missingPairProvenance(row,linkedId){
 return !row.relationships.some(e=>
  (e.fromId===row.id&&e.toId===linkedId)||
  (e.toId===row.id&&e.fromId===linkedId));
}
for(const row of db.records){
 for(const linkedId of row.linkedIds)
  assert(!missingPairProvenance(row,linkedId),'Pair provenance missing: '+row.id+' -> '+linkedId);
}
const manyLinks=db.records.find(row=>row.linkedIds.length>1);
assert(manyLinks,'Expected multi-link record for negative evidence fixture');
const deletedId=manyLinks.linkedIds[0];
const damaged={...manyLinks,relationships:manyLinks.relationships.filter(e=>
 !((e.fromId===manyLinks.id&&e.toId===deletedId)||
   (e.toId===manyLinks.id&&e.fromId===deletedId)))};
assert(damaged.relationships.length>0,'Negative fixture must retain unrelated evidence');
assert(missingPairProvenance(damaged,deletedId),
 'Negative fixture did not detect missing per-pair provenance');
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
assert(ui.includes('function kbPsycheDrill(d)')&&ui.includes('data-dp-link'),
 'Deep Psyche drill must support record-to-record click-through');
assert(ui.includes('data-dp-native-index')&&ui.includes('kbOpen(target)'),
 'Native instrument record drill navigation missing');
const drillSource=ui.match(/function kbPsycheDrill\(d\)\{[\s\S]*?\n\}/);
assert(drillSource,'Source-qualified graph drill function missing');
let rendered='';
const escapeHtml=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const drillContext={DEEP_PSYCHE:db,esc:escapeHtml,rdShell:html=>{rendered=html;}};
vm.runInNewContext(drillSource[0],drillContext,{timeout:5000});
drillContext.kbPsycheDrill(by.get('blueprint:personal-model'));
assert(rendered.includes('data-dp-link')&&rendered.includes('Connected records'),
 'Blueprint does not render traversable linked records');
assert(rendered.includes('SOURCE_LEVEL_STRUCTURE')||rendered.includes('source_'),
 'Relationship source/evidence status is not presented to users');
drillContext.kbRowsOf=kind=>kind==='seat'?[{t:'Solar',k:'seat'}]:[];
drillContext.kbPsycheDrill(by.get('mapping:arch18:01'));
assert(rendered.includes('data-dp-native-index')&&rendered.includes('Solar'),
 'ARCH18 source row cannot render a direct native seat drill path');
/* Execute source-backed click routing against the actual generated record. */
const nativeClickSource=ui.match(/\/\* Exact-label navigation into the native app records\. \*\/[\s\S]*?\n\}\);/);
assert(nativeClickSource,'Native click event handler missing');
let nativeClick=null,nativeOpened=null;
const clickScope={
 DEEP_PSYCHE:db,
 addEventListener:(kind,handler)=>{if(kind==='click')nativeClick=handler;},
 kbRowsOf:kind=>kind==='seat'?[{k:'seat',t:'Solar',o:{b:'Solar'}}]:[],
 kbOpen:row=>{nativeOpened=row;}
};
vm.runInNewContext(nativeClickSource[0],clickScope,{timeout:5000});
assert(nativeClick,'Native click route not registered');
nativeClick({target:{closest:selector=>selector==='[data-dp-native]'?{
 getAttribute:key=>key==='data-dp-native'?'mapping:arch18:01':
 key==='data-dp-native-index'?'2':null
}:null}});
assert(nativeOpened?.t==='Solar','ARCH18 native click does not open existing Solar seat drill');
const s02={k:'sab',t:'Micromanager'};
drillContext.kbRowsOf=clickScope.kbRowsOf=kind=>kind==='sab'?[s02]:[];
drillContext.kbPsycheDrill(by.get('mapping:arch18:01'));
assert(rendered.includes('Controller <span') && rendered.includes('S02 / need for control'));
nativeClick({target:{closest:()=>({getAttribute:key=>key==='data-dp-native'?'mapping:arch18:01':'1'})}});
assert.strictEqual(nativeOpened,s02);
const sourceHtml=path.join(ROOT,'source.html');
if(process.env.CI)assert(fs.existsSync(sourceHtml),'CI acceptance requires a built source.html');
if(fs.existsSync(sourceHtml)){
 const html=fs.readFileSync(sourceHtml,'utf8');
 assert(html.includes('var DEEP_PSYCHE='),'Built app missing Deep Psyche records');
 assert(html.includes('Deep Psyche'),'Built app missing Psyche UI label');
}
console.log(JSON.stringify({status:'PASS',sourceRecords:registry.recordCount,appRecords:db.records.length,fourPassRecords:db.records.filter(x=>x.reviewPassCount===4).length,domainRoster:19,archetypes:18,visualSlots:14,manifestOrderCorrect:true,uiWired:true,htmlBuildVerified:fs.existsSync(sourceHtml)},null,2));
