#!/usr/bin/env node
'use strict';
/*
 * ATUNED source-of-truth Deep Psyche bridge for the shipped HTML app.
 * Called by atuned_src/BUILD.sh before MANIFEST validation.
 * No independent labels, generated aliases, or asserted scoring weights.
 */
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const registry=JSON.parse(fs.readFileSync(path.join(root,'docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json'),'utf8'));
const templates=JSON.parse(fs.readFileSync(path.join(root,'docs/data/ATUNED_DEEP_PSYCHOLOGICAL_TEMPLATE_CATALOG_v1.json'),'utf8'));
const by=new Map();
const kind=new Map(templates.templates.map(x=>[x.id,x]));
for(const r of registry.records){
 if(!r.id||by.has(r.id))throw Error('Duplicate/missing Deep Psyche ID: '+r.id);
 const t=kind.get(r.templateId);
 if(!t||t.kind!==r.kind)throw Error('Missing or mismatched template: '+r.id);
 for(const field of t.fields)if(r[field]===undefined||r[field]===null||r[field]==='')throw Error('Missing field '+field+' on '+r.id);
 by.set(r.id,r);
}
if(registry.records.length!==registry.recordCount)throw Error('Declared count differs from records');
for(const r of registry.records){
 for(const id of r.links||[]){
  const other=by.get(id);
  if(!other)throw Error('Dangling link '+r.id+' -> '+id);
  if(!(other.links||[]).includes(r.id))throw Error('Non-reciprocal link '+r.id+' -> '+id);
 }
}
const vm=require('node:vm');
function sourceTable(file,table){
 const src=fs.readFileSync(path.join(root,'atuned_src/engine/data',file),'utf8');
 return vm.runInNewContext(src+'\n'+table);
}
const ARCHDOM_SNAPSHOT=sourceTable('archdom.js','ARCHDOM_SNAPSHOT');
const SAB_PI_AS=sourceTable('canon.js','SAB_PI_AS');
function nativeNavigationCandidates(r) {
 const out=[];
 const add=(kind,name,field)=>{
  if(typeof name!=='string'||!name.trim())return;
  name=name.trim();
  const ref={kind,name,sourceField:field,evidenceStatus:'EXACT_LABEL_NAVIGATION_NOT_CANONICAL_EQUIVALENCE'};
  if(kind==='dom'){
   const word=ARCHDOM_SNAPSHOT.rows[r.archetypeName];
   const route=ARCHDOM_SNAPSHOT.words[word];
   if(route && word===name && route.nm && route.nm!==name){
    ref.targetName=route.nm;
    ref.evidenceStatus='Domain link / '+route.how;
   }
  }else if(kind==='arch'){
   const alias=Object.entries(ARCHDOM_SNAPSHOT.alias).find(([,value])=>value.as===name);
   if(alias){ref.targetName=alias[0];ref.evidenceStatus='Book alias / provisional';}
  }else if(kind==='sab' && name==='Controller' && SAB_PI_AS.Micromanager===name){
   ref.targetName='Micromanager';
   ref.evidenceStatus='S02 / need for control';
  }
  out.push(ref);
 };
 if(r.recordType==='archetype_candidate')add('arch',r.canonicalName,'archetype_candidate.canonicalName');
 if(r.recordType==='mapping_record') {
  add('arch',r.archetypeName,'mapping_record.archetypeName');
  add('sab',r.fetterLabel,'mapping_record.fetterLabel');
  const seat={root:'Root',sacral:'Sacral',solar:'Solar',heart:'Heart',
   throat:'Throat',eye:'3rd Eye',crown:'Crown'}[String(r.seatLabel||'').trim().toLowerCase()];
  add('seat',seat,'mapping_record.seatLabel');
  add('dom',r.domainTarget,'mapping_record.domainTarget');
 }
 return out;
}
/* Public read-only projection. Research notes, complete citations and
 * reviewer commentary remain in the canonical registry, not the app bundle.
 * The evidence digest binds each projection to the original evidence.
 * Keep the exact relationship objects and source status. Display wording
 * is a separate representation, not a change to the underlying claims.
 */
const crypto=require('node:crypto');
const registryPath='docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json';
function evidenceDigest(r){
 return crypto.createHash('sha256').update(JSON.stringify({
  sourceRefs:r.sourceRefs||[],sourceClaims:r.sourceClaims||[],
  relationshipAudit:r.relationshipAudit||null,depthReviewStatus:r.depthReviewStatus||null,
  status:r.status||null,relationships:r.relationships||[]
 })).digest('hex');
}
function displayRef(value){
 return value.replace('Chapter 12 Stacking Architecture (#ch17)','Chapter 12 (#ch17)')
  .replace(/ \(Library file file_[a-z0-9]+\)/g,'');
}
function displayCopy(value){
 if(typeof value!=='string')return value;
 return value.replace(/\bn\s*=\s*14\b/g,'fourteen')
  .replace(/Engine \(Dynamics\)/g,'Engine')
  .replace(/Source-defined structural architecture/g,'Source-defined structure')
  .replace(/fast cognition/g,'quick thinking')
  .replace(/information as leverage/g,'using information to gain power over others')
  .replace(/true utilization of experience/g,'true use of experience')
  .replace(/psychological construct/g,'psychological concept')
  .replace(/named source construct/g,'named source concept')
  .replace(/see source reference and crosswalk for traceability/g,'see the source references')
  .replace(/future crosswalk row/g,'future mapping row')
  .replace(/The v341 crosswalk lists this as a separate related consciousness concept; do not merge it into the eight-domain roster without an explicit ruling\./g,'The v341 source comparison lists this separately from the eight domains; combining them has not been approved.');
}
const out={
 schema:'atuned.deep_psyche.shipped_app.v2',
 sourceRegistry:registryPath,
 sourceRegistryVersion:registry.version,
 sourceRecordCount:registry.records.length,
 reviewDepth:4,
 records:registry.records.map(r=>({
  id:r.id,kind:r.kind,type:r.recordType,
  name:r.canonicalName||r.nm||r.id,
  family:displayCopy(r.fam||r.layer||'Deep Psyche'),
  description:displayCopy(r.def||r.definition||''),
  body:displayCopy(r.body||r.definition||r.def||''),
  clear:displayCopy(r.sourceVersionSpecificDescription?.clearExpression||
    (Array.isArray(r.healthyExpression)?r.healthyExpression[0]:null)||null),
  distorted:displayCopy(r.sourceVersionSpecificDescription?.distortedExpression||
    (Array.isArray(r.decoherentExpression)?r.decoherentExpression[0]:null)||null),
  sourceStatus:r.status||null,
  sourceRefs:(r.sourceRefs||[]).map(displayRef),
  sourceEvidenceDigest:evidenceDigest(r),
  relationships:r.relationships||[],
  nativeNavigationCandidates:nativeNavigationCandidates(r),
  structuralReviewStatus:r.depthReviewStatus?.structuralStatus||null,
  linkedIds:r.links||[],
  parentId:r.parentId||null,
  displaySlotOnly:!!r.slotOnly,
  templateId:r.templateId,
  reviewPassCount:(r.depthReviewPasses||[]).length,
  canonStatus:r.canonicalStatus||null
 }))
};
if(out.records.some(r=>r.reviewPassCount!==4))throw Error('Every record requires four review passes');
for(const r of out.records) {
 if(!r.relationships.length)throw Error('Unmapped relationship provenance: '+r.id);
 // Every navigable pair needs its own typed evidence on this source row.
 // One unrelated relationship must never make an otherwise unproven link pass.
 for(const linkedId of r.linkedIds){
  if(!r.relationships.some(e=>
   (e.fromId===r.id&&e.toId===linkedId)||
   (e.toId===r.id&&e.fromId===linkedId)))
   throw Error('Link missing pair provenance: '+r.id+' -> '+linkedId);
 }
 for(const e of r.relationships) {
  if(!e.type||!e.fromId||!e.toId||!e.status||!e.sourceRef)
   throw Error('Relationship missing provenance: '+r.id);
  if(!by.has(e.fromId)||!by.has(e.toId))
   throw Error('Relationship target missing: '+r.id);
  if(e.fromId!==r.id&&e.toId!==r.id)
   throw Error('Relationship not attached to endpoint: '+r.id);
 }
}
const content='/* Generated by tools/build-deep-psyche-app.js; do not edit. */\nvar DEEP_PSYCHE='+JSON.stringify(out).replace(/</g,'\\u003c')+';\n';
if(content.includes('\u2014'))throw Error('Generated file contains em dash forbidden by build');
const dest=path.join(root,'atuned_src/engine/data/deep_psyche.js');
fs.writeFileSync(dest,content);
console.log(JSON.stringify({status:'PASS',output:dest,records:out.records.length,fullyAudited:out.records.filter(x=>x.reviewPassCount===4).length,visualOnly:out.records.filter(x=>x.displaySlotOnly).length,bytes:Buffer.byteLength(content)}));
