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
const crypto=require('node:crypto');
assert.strictEqual(db.schema,'atuned.deep_psyche.shipped_app.v2');
assert.strictEqual(db.sourceRegistry,'docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json');
assert.strictEqual(db.records.length,by.size,'Duplicate projected identity');
function expectedRef(value){
 return value.replace('Chapter 12 Stacking Architecture (#ch17)','Chapter 12 (#ch17)')
  .replace(/ \(Library file file_[a-z0-9]+\)/g,'');
}
function originalEvidenceDigest(r){
 return crypto.createHash('sha256').update(JSON.stringify({
  sourceRefs:r.sourceRefs||[],sourceClaims:r.sourceClaims||[],
  relationshipAudit:r.relationshipAudit||null,depthReviewStatus:r.depthReviewStatus||null,
  status:r.status||null,relationships:r.relationships||[]
 })).digest('hex');
}
/* The source registry retains literal research notes; the shipped drill
   must not present statistical sample notation as reader-facing copy. */
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
 assert.deepStrictEqual(JSON.parse(JSON.stringify(delivered.sourceRefs)),(original.sourceRefs||[]).map(expectedRef),
  'Projected citation no longer points to the source: '+original.id);
 assert.strictEqual(delivered.sourceEvidenceDigest,originalEvidenceDigest(original),
  'Original evidence digest mismatch: '+original.id);
 for(const field of ['sourceClaims','relationshipAudit','depthReviewStatus'])
  assert(!Object.hasOwn(delivered,field),'Research-only field shipped: '+field);
 assert(delivered.sourceStatus===original.status,'Source status mutated: '+original.id);
 assert(delivered.structuralReviewStatus===original.depthReviewStatus?.structuralStatus &&
  delivered.structuralReviewStatus==='PASS','Depth structural review missing: '+original.id);
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
assert(ui.includes('data-dp-native-index')&&ui.includes('kbOpen(targets[0])'),
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
/* Missing native destinations must be visible but never actionable.
   An unresolved relationship is not permission to invent a route. */
assert(rendered.includes('data-dp-unresolved'),
 'Unmatched source candidates silently disappear from the drill');
const unresolvedCount=(rendered.match(/data-dp-unresolved=/g)||[]).length;
assert(unresolvedCount>0,'Expected at least one unresolved native candidate');
const unmatched=by.get('mapping:arch18:01').nativeNavigationCandidates.filter(ref=>
 !drillContext.kbRowsOf(ref.kind).some(row=>
  String(row.t||'').trim().toLowerCase()===String(ref.targetName||ref.name||'').trim().toLowerCase()));
assert.strictEqual(unresolvedCount,unmatched.length,
 'Every unmatched native candidate needs a visible noninteractive status');

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
// Ambiguous labels and malformed indices must not choose a first match.
const ambiguous=[{k:'sab',t:'Micromanager'},{k:'sab',t:'Micromanager'}];
drillContext.kbRowsOf=clickScope.kbRowsOf=kind=>kind==='sab'?ambiguous:[];
drillContext.kbPsycheDrill(by.get('mapping:arch18:01'));
assert(!rendered.includes('data-dp-native="mapping:arch18:01" data-dp-native-index="1"'),
 'Ambiguous native target was rendered as actionable');
nativeOpened=null;
nativeClick({target:{closest:()=>({getAttribute:key=>key==='data-dp-native'?'mapping:arch18:01':'1'})}});
assert.strictEqual(nativeOpened,null,'Ambiguous native target opened the first match');
const first=by.get('mapping:arch18:01').nativeNavigationCandidates[0];
clickScope.kbRowsOf=kind=>kind===first.kind?[{k:kind,t:first.targetName||first.name}]:[];
for(const bad of [null,'',' ','00','0.0','-0','1e0','9007199254740992']){
 nativeOpened=null;
 nativeClick({target:{closest:()=>({getAttribute:key=>key==='data-dp-native'?'mapping:arch18:01':bad})}});
 assert.strictEqual(nativeOpened,null,'Malformed native index selected a route: '+String(bad));
}
// The dormant intelligence seam reads the same public registry, not a
// fabricated relationship or a profile trace.
const E=require(path.join(ROOT,'engine.js'));
const question='How is the Knowledge domain related to the Personal Blueprint?';
const profile=E.blankProfile('PRIVATE_NAME_SENTINEL');
profile.id='PRIVATE_ID_SENTINEL';
const before=JSON.stringify(profile);
const result=E.srcVoiceIntelligence(question,profile,{knowledgeGraphPilot:true}).intelligence;
assert.strictEqual(result.knowledgeEvidence.length,1);
const proof=result.knowledgeEvidence[0];
const knowledge=by.get('domain:01'),blueprint=by.get('blueprint:personal-model');
const edge=knowledge.relationships.find(e=>e.type==='versioned_domain_to_blueprint_model'&&e.toId===blueprint.id);
assert.strictEqual(proof.source,edge.sourceRef);
assert.strictEqual(proof.status,edge.status);
assert.strictEqual(proof.scope,'PUBLIC_CATALOG_ONLY');
assert.strictEqual(proof.personalReading,false);
assert.deepStrictEqual(proof.evidenceDigests,[knowledge.sourceEvidenceDigest,blueprint.sourceEvidenceDigest]);
assert.strictEqual(result.coherence,'NOT_MEASURED');
assert.strictEqual(result.graphStatus,'CONSENT_REQUIRED');
assert(!JSON.stringify(result).includes(profile.name)&&!JSON.stringify(result).includes(profile.id));
assert.strictEqual(JSON.stringify(profile),before);
assert(!E.srcVoiceIntelligence(question,profile,{}).intelligence.knowledgeEvidence);
assert.deepStrictEqual(E.srcVoiceIntelligence('How does the Knowledge domain relate to my mood?',profile,{knowledgeGraphPilot:true}).intelligence.knowledgeEvidence,[]);
assert(!E.srcVoiceIntelligence('I want to die. '+question,profile,{knowledgeGraphPilot:true}).intelligence.knowledgeEvidence);
// Mutate only a test fixture: absence, ambiguity, unqualified edges and
// missing reciprocal provenance must return no relationship.
const voiceSource=fs.readFileSync(path.join(app,'engine/voice_intelligence.js'),'utf8');
const pairSource=voiceSource.match(/function srcKnowledgePair\(db\)\{[\s\S]*?\n\}/);
assert(pairSource,'Public evidence lookup missing');
const pairScope={};
vm.runInNewContext(pairSource[0],pairScope,{timeout:5000});
const fixture=()=>JSON.parse(JSON.stringify({records:[knowledge,blueprint]}));
const pair=pairScope.srcKnowledgePair;
assert.strictEqual(pair(fixture()).length,1);
for(const change of [
 d=>d.records.pop(),
 d=>d.records.push(d.records[0]),
 d=>{d.records[0].linkedIds=[];},
 d=>{d.records[1].relationships=[];},
 d=>{const e=d.records[1].relationships.find(e=>e.type==='versioned_domain_to_blueprint_model');e.fromId=d.records[0].id;e.toId=d.records[1].id;},
 d=>{d.records[0].relationships.find(e=>e.type==='versioned_domain_to_blueprint_model').status='UNREVIEWED';},
 d=>{d.records[1].relationships.find(e=>e.type==='versioned_domain_to_blueprint_model').sourceRef='Different evidence';},
 d=>{d.records[0].sourceEvidenceDigest='';},
 d=>{d.records[0].displaySlotOnly=true;}
]){
 const d=fixture();change(d);assert.strictEqual(pair(d).length,0,'Invalid source relationship accepted');
}
const sourceHtml=path.join(ROOT,'source.html');
if(process.env.CI)assert(fs.existsSync(sourceHtml),'CI acceptance requires a built source.html');
if(fs.existsSync(sourceHtml)){
 const html=fs.readFileSync(sourceHtml,'utf8');
 assert(html.includes('var DEEP_PSYCHE='),'Built app missing Deep Psyche records');
 assert(html.includes('Deep Psyche'),'Built app missing Psyche UI label');
}
console.log(JSON.stringify({status:'PASS',sourceRecords:registry.recordCount,appRecords:db.records.length,fourPassRecords:db.records.filter(x=>x.reviewPassCount===4).length,domainRoster:19,archetypes:18,visualSlots:14,manifestOrderCorrect:true,uiWired:true,htmlBuildVerified:fs.existsSync(sourceHtml)},null,2));
