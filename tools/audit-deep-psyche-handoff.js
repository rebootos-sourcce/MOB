#!/usr/bin/env node
'use strict';
/* Deep Psyche 8 source-of-truth inventory and audit.
 * Read-only: no generated parallel registry, no promotion of provisional claims.
 * Usage:
 *   node tools/audit-deep-psyche-handoff.js > deep-psyche-8-audit.json
 *   node tools/audit-deep-psyche-handoff.js --strict-structural
 */
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const reg=read('docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json');
const cat=read('docs/data/ATUNED_DEEP_PSYCHOLOGICAL_TEMPLATE_CATALOG_v1.json');
const arr=reg.records||[], templates=new Map(cat.templates.map(t=>[t.id,t]));
const by=new Map(), errors=[], notices=[], edgeMap=new Map();
const tally=(a,key)=>{a[key]=(a[key]||0)+1;};
const byType={}, byStatus={}, byContent={};
const family={v341_exact_version_text:[],blueprint_display_slot:[],cultural_figure_mapping:[],archetype_owner_status:[]};
for(const r of arr){
 if(!r.id || by.has(r.id))errors.push({id:r.id,problem:'duplicate_or_missing_id'});
 else by.set(r.id,r);
}
let typedObjects=0,linksDirected=0;
const records=arr.map(r=>{
 tally(byType,r.recordType||'UNSET');
 tally(byStatus,r.status||'UNSET');
 tally(byContent,r.templateValidation?.contentStatus||'UNSET');
 const t=templates.get(r.templateId);
 if(!t || t.kind!==r.kind)errors.push({id:r.id,problem:'missing_or_mismatched_template'});
 else for(const key of t.fields)if(r[key]===undefined||r[key]===null||r[key]==='')
  errors.push({id:r.id,problem:'empty_required_field',field:key});
 if((r.depthReviewPasses||[]).length!==4)errors.push({id:r.id,problem:'not_four_depth_rounds'});
 if((r.researchPasses||[]).length!==3)errors.push({id:r.id,problem:'not_three_original_passes'});
 if(!(r.links||[]).length)errors.push({id:r.id,problem:'no_navigation_link'});
 if(!(r.relationships||[]).length)errors.push({id:r.id,problem:'no_typed_relationship'});
 if(!(r.sourceRefs||[]).length)errors.push({id:r.id,problem:'no_source_references'});
 if(!(r.sourceClaims||[]).length)notices.push({id:r.id,notice:'source_claims_array_empty'});
 if(r.recordType==='v341_domain_candidate')family.v341_exact_version_text.push(r.id);
 if(r.recordType==='blueprint_domain_slot')family.blueprint_display_slot.push(r.id);
 if(r.recordType==='conscious_figure_mapping')family.cultural_figure_mapping.push(r.id);
 if(r.recordType==='archetype_candidate'&&/not_dictated/i.test(r.status||''))
  family.archetype_owner_status.push(r.id);
 for(const l of r.links||[]){
  linksDirected++;
  const other=by.get(l);
  if(!other)errors.push({id:r.id,problem:'dangling_link',to:l});
  else if(!(other.links||[]).includes(r.id))errors.push({id:r.id,problem:'nonreciprocal_link',to:l});
 }
 if(r.parentId&&!by.has(r.parentId))errors.push({id:r.id,problem:'unresolved_parent',to:r.parentId});
 for(const e of r.relationships||[]){
  typedObjects++;
  if(!e.type||!e.fromId||!e.toId||!e.sourceRef||!e.status)
   errors.push({id:r.id,problem:'typed_edge_missing_evidence'});
  if(!by.has(e.fromId)||!by.has(e.toId))
   errors.push({id:r.id,problem:'typed_edge_endpoint_missing'});
  if(e.fromId!==r.id&&e.toId!==r.id)
   errors.push({id:r.id,problem:'typed_edge_not_owned'});
  const key=[e.fromId,e.toId].sort().join('::')+'::'+e.type;
  if(!edgeMap.has(key))edgeMap.set(key,[]);
  edgeMap.get(key).push(r.id);
 }
 return {
  id:r.id,recordType:r.recordType,kind:r.kind,templateId:r.templateId,
  contentStatus:r.templateValidation?.contentStatus||null,
  canonStatus:r.canonicalStatus||null,sourceStatus:r.status||null,
  sourceReferenceCount:(r.sourceRefs||[]).length,sourceClaimCount:(r.sourceClaims||[]).length,
  originalResearchPasses:(r.researchPasses||[]).length,
  auditReviewRounds:(r.depthReviewPasses||[]).length,
  linkCount:(r.links||[]).length,typedRelationshipCount:(r.relationships||[]).length,
  parentId:r.parentId||null
 };
});
for(const [key,owners] of edgeMap)if(owners.length!==2)
 errors.push({problem:'typed_edge_must_be_mirrored_twice',edge:key,owners});
if(reg.recordCount!==arr.length)errors.push({problem:'declared_count_mismatch'});
const report={
 schema:'atuned.deep_psyche_8.handoff_audit.v1',
 sourceRegistryId:reg.registryId,sourceRegistryVersion:reg.version,
 declaredRecords:reg.recordCount,measuredRecords:arr.length,uniqueIds:by.size,
 registeredTemplates:templates.size,countsByRecordType:byType,sourceStatuses:byStatus,
 contentStatuses:byContent,
 measures:{navigableRecords:arr.filter(r=>r.links?.length).length,
  recordsWithFourReviewEntries:arr.filter(r=>r.depthReviewPasses?.length===4).length,
  typedRelationshipObjects:typedObjects,uniqueTypedRelationshipPairs:edgeMap.size,
  directedNavigationLinks:linksDirected},
 flaggedSemanticGroups:{...Object.fromEntries(Object.entries(family).map(([k,ids])=>[k,{count:ids.length,ids}]))},
 advisoryNotices:notices,structuralFailures:errors,
 structuralAcceptance:errors.length?'FAIL':'PASS',
 canonicalAcceptance:'OPEN_SOURCE_VERSION_AND_OWNER_RULINGS',
 shippedAppBrowserAcceptance:'NOT_TESTED_BY_THIS_AUDIT',
 fullProjectDenominator:'NOT_ESTABLISHED',
 integrationPrinciple:'Source-record links represent typed provenance, not automatic causal or semantic equivalence',
 records
};
console.log(JSON.stringify(report,null,2));
if(process.argv.includes('--strict-structural')&&errors.length)process.exitCode=1;
