#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path');const base=path.resolve(__dirname,'../../../../..');
const rd=p=>JSON.parse(fs.readFileSync(path.join(base,p),'utf8'));const must=(x,msg)=>{if(!x)throw new Error(msg)};
try{
const x=rd('docs/data/compass/integration/v9/ATUNED_ALL_BRANCH_HEAD_SOURCE_PATH_AUDIT_V9.json');
const b=rd('docs/data/compass/integration/v9/ATUNED_V330_OLDER_VERSION_SOURCE_COMPARISON_V9.json');
const l=rd('docs/data/compass/integration/v8/ATUNED_RESEARCH_CLOSURE_GATES_V8.json');
const g=rd('docs/data/compass/integration/v4/ATUNED_UNIFIED_RESEARCH_GRAPH_V4.json');
must(x.totalBranchHeads===201&&x.branchRefs.length===201&&new Set(x.branchRefs.map(t=>t.branch)).size===201,'branch audit completeness');
must(x.branchRefs.every(t=>t.commitSha.length===40&&t.treePathAudit==='INSPECTED_NO_MATCH'),'branch audit entry malformed');
must(x.result.exactV341FilenameFound===0&&x.result.gitTreeTruncations===0&&x.result.branchTreeFetchErrors===0,'source search claims drift');
must(x.commitHistoryTextSearch.returnedCommits===27&&x.commitHistoryTextSearch.examinedChangedFilenameSets===27,'historical keyword audit scope');
must(!x.completionClaim&&x.canonPromotions===0&&x.productionChanges===0,'false source completion');
must(b.artifact==='MOB_Complete_v330.html'&&b.isV341===false&&b.sha256==='1d71431eb3125cd661e74310b296d5812b0b79f2b7e3bd9e44ed9daeda569469','older-source provenance drift');
must(b.currentCanonComparison.versionCounts['1.0.0'].complex===23&&b.currentCanonComparison.versionCounts['1.0.1'].hyper===9,'Canon roster version drift');
must(l.readinessBaseline.weightedOverall===72&&l.gates.every(z=>!z.closed),'unverified readiness/canon promotion');
must(g.nodes.length===404&&g.edges.length===875,'research graph unexpectedly changed');
console.log(JSON.stringify({pass:true,meaning:'201 branch HEAD pathname audit and v330 source-comparison statuses are internally consistent; source and production gates remain OPEN',heads:201,v341Recovered:false,canonicalPromotions:0,productionChanges:0,overallReadiness:72},null,2));
}catch(e){console.error(e.stack);process.exitCode=1}
