#!/usr/bin/env node
'use strict'; const fs=require('fs'),path=require('path');const base=path.resolve(__dirname,'../../../../..');
const load=p=>JSON.parse(fs.readFileSync(path.join(base,p),'utf8'));const check=(a,msg)=>{if(!a)throw Error(msg)};
try{
const a=load('docs/data/compass/integration/v10/ATUNED_CROSS_VERSION_PSYCHETAXONOMY_SEMANTIC_DIFFERENCE_V10.json');
const b=load('vendor/reboot-os/canon.json'); const c=load('docs/data/compass/integration/v8/ATUNED_READONLY_SOURCE_CANON_MEMBERSHIP_OVERLAY_V8.json');
const d=load('docs/data/compass/integration/v9/ATUNED_ALL_BRANCH_HEAD_SOURCE_PATH_AUDIT_V9.json');
check(a.schema==='ATUNED_CROSS_VERSION_PSYCHETAXONOMY_SEMANTIC_DIFFERENCE_V10'&&a.comparisons.length===9,'matrix shape');
check(a.counts.canonicalPromotions===0&&a.counts.productionChanges===0&&!a.counts.ownerEightComplexSourceRecovered&&!a.counts.v341ExactRecovered,'false closure');
check(a.sources.v192.blobSha==='c32b50404b465f7ce4ac9eb9b8457ffbf8f0294f'&&a.sources.v330.sha256==='1d71431eb3125cd661e74310b296d5812b0b79f2b7e3bd9e44ed9daeda569469','source provenance');
check(a.sources.canon100.version===b.meta.version&&a.sources.canon100.blobSha==='27a7a178de1e87252fa8e59554a66735dbeb0aed','current Canon provenance');
check(a.sources.canon101.blobSha===c.source.blobSha,'source branch provenance');
check(a.comparisons.every(x=>x.runtimeModified===false&&x.decision),'runtime change falsely approved');
check(a.comparisons.find(x=>x.concept==='Psychopathy').canonicalSuperComplex===false,'owner correction overridden');
check(a.comparisons.find(x=>x.concept==='The Performer').memberCompositionApproved===false,'inferred membership promoted');
check(a.comparisons.find(x=>x.concept==='Borderline-Sociopath').canon101.location==='open_rulings[11]','Borderline open ruling confused with roster');
check(d.totalBranchHeads===201,'source scan drift');
console.log(JSON.stringify({pass:true,versionComparisons:9,ownerRejectedPsychopathySuperComplexHonored:true,sourceNameThePerformerGroundedInOlderBook:true,semanticCanonPromotions:0,productionChanges:0,overallReadiness:72},null,2));
}catch(e){console.error(e.stack);process.exitCode=1}
