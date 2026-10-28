#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../../..'),j=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
try{
 const source=j('docs/data/compass/integration/v16/ATUNED_V341_EXACT_19_DOMAINS_V16.json');
 const linked=j('docs/data/compass/integration/v16/ATUNED_V341_SOURCE_TO_DEEP_PSYCHE_19_V16.json');
 const gap=j('docs/data/compass/integration/v4/DEEP_PSYCHE_19_V341_EXACT_SOURCE_GAP_LEDGER_V1.json');
 assert.equal(source.records.length,19);
 assert.equal(linked.count,19);assert.equal(linked.records.length,19);assert.equal(gap.records.length,19);
 assert.equal(linked.originalRawSha256,source.originalSource.sha256);
 assert.equal(new Set(linked.records.map(x=>x.deepPsycheCandidateId)).size,19);
 for(const item of linked.records){
   let old=gap.records.find(x=>x.recordId===item.deepPsycheCandidateId);
   assert.ok(old,'unknown source key '+item.deepPsycheCandidateId);
   let s=source.records.find(x=>x.name===item.sourceName&&x.cluster===item.sourceCluster);
   assert.ok(s,'unmatched v341 literal source '+item.sourceName);
   assert.equal(old.label,s.name);
   assert.equal(item.sourceLine,s.sourceLine);
   assert.equal(item.v341ExactSource.clear,s.clear);
   assert.equal(item.v341ExactSource.distorted,s.distorted);
   assert.equal(item.v341ExactSource.templates,s.templates);
   assert.equal(item.semanticEquivalenceApproved,false,'identity promoted without owner approval');
   assert.equal(item.runtimePromoted,false,'source proof imported into runtime');
 }
 assert.equal(linked.metrics.exactSourceDefinitionsLocated,19);
 assert.equal(linked.metrics.semanticEquivalencesApproved,0);
 assert.equal(linked.metrics.runtimePromotions,0);
 console.log(JSON.stringify({pass:true,sourceToPriorGapIds:19,verbatimSourceTextPerId:19,ownerApprovedCrossRegistryEquivalences:0,runtimePromotions:0},null,2));
}catch(e){console.error('V16 DEEP PSYCHE SOURCE JOIN FAIL: '+e.stack);process.exitCode=1;}
