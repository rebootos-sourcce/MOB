#!/usr/bin/env node
/* Source-comparison validation: data fidelity, evidence presence, no canon promotion.
   Requires FETCH_HEAD = atuned/deep-psyche-end-to-end-2026-10-26. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../../../../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),j=p=>JSON.parse(read(p));
const sha1=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
const ok=(x,s)=>{if(!x)throw Error(s)};
const pathConflict='docs/data/compass/integration/v4/FOUR_FIGURE_AND_FIVE_PARADISO_DISCREPANCIES_RESEARCH_V2.json';
const pathLexical='docs/data/compass/integration/v4/DEEP_PSYCHE_COMPASS_21_EXACT_NAME_FOUR_PASS_REVIEWS_V1.json';
try{
const c=j(pathConflict),l=j(pathLexical);
const original=j('docs/data/compass/integration/v1/COMPASS_CROSS_LAYER_GRAPH_V1.json');
const g=j('docs/data/compass/integration/v4/ATUNED_UNIFIED_RESEARCH_GRAPH_V4.json');
const drift=original.reviewQueue.filter(x=>x.code==='FIGURE_BEHAVIOR_SEMANTIC_DRIFT');
const one=original.reviewQueue.filter(x=>x.code==='PARADISO_TEACHER_ONE_SIDED');
ok(drift.length===4&&one.length===5,'source issue inventory changed');
ok(c.comparisons.length===4&&c.teacherParadisoOneSided.length===5,'review comparison count');
ok(c.comparisons.every(x=>drift.some(a=>a.inverseId===x.id&&a.infernoId===x.infernoId)),'not original source conflict');
ok(c.comparisons.every(x=>x.passes.length===4&&x.passes.every(p=>p.finding.length>80&&p.sources.length>=2)),'figure depth pass missing');
ok(c.comparisons.every(x=>!x.canonicalEquivalence&&!x.ownerApproval&&x.notRuntime),'source conflict auto-approved');
ok(c.teacherParadisoOneSided.every(x=>one.some(a=>a.teacherId===x.teacherId&&a.paradisoId===x.paradisoId)),'one-sided source missing');
ok(c.teacherParadisoOneSided.every(x=>x.teacherRegistryAffirms!==x.paradisoRegistryAffirms&&!x.canonical),'one-sided incorrectly adjudicated');
for(const x of Object.values(c.sourceBlobs))ok(sha1(read(x.path))===x.blobSha,'figure source blob drift '+x.path);
ok(l.comparisons.length===21&&l.counts.analyticalPasses===84,'lexical comparison missing');
ok(l.comparisons.filter(x=>x.class==='ARCHETYPE_TAXONOMY_COLLISION').length===11,'archetype taxonomy count');
ok(l.comparisons.filter(x=>x.class==='HISTORICAL_OR_CULTURAL_NAME_RESOLUTION').length===10,'cultural taxonomy count');
ok(l.comparisons.every(x=>x.depthReviewPasses.length===4&&x.depthReviewPasses.every(p=>p.finding.length>100)),'lexical research pass missing');
ok(l.comparisons.every(x=>!x.conceptualIdentityApproved&&x.notRuntime),'name match falsely approved');
const typed=new Set(g.edges.filter(e=>e.graphSegment==='cross_registry_lexical_candidate').map(e=>e.from+'|'+e.to));
ok(typed.size===21&&l.comparisons.every(x=>typed.has(x.sourceId+'|'+x.targetId)),'cross-registry name pair out of sync');
for(const [k,x] of Object.entries(l.sourceReferences)){
if(k==='deepPsyche')continue;
ok(sha1(read(x.path))===x.blobSha,'lexical source changed '+k);
}
const raw=cp.execFileSync('git',['show','FETCH_HEAD:docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json'],{cwd:root,encoding:'utf8',maxBuffer:12*1024*1024});
ok(sha1(raw)===l.sourceReferences.deepPsyche.blobSha,'deep source changed');
const deep=JSON.parse(raw);ok(deep.records.length===149,'deep roster drift');
const deepNames=new Set(deep.records.map(x=>x.id));
ok(l.comparisons.every(x=>deepNames.has(x.sourceId)),'lexical pair references missing deep record');
console.log(JSON.stringify({result:'PASS',figureSourceDriftsReviewed:4,figurePasses:16,oneSidedTeacherParadisoPairsReviewed:5,unapprovedLexicalPairsReviewed:21,lexicalPasses:84,additionalComparativeAnalyses:100,semanticPromotions:0,sourceBlobsVerified:true},null,2));
}catch(e){console.error('FAIL: '+e.stack);process.exitCode=1;}
