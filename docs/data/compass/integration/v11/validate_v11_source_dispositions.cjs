#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'../../../../..');const rd=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));const must=(v,s)=>{if(!v)throw Error(s)};
try{
const q=rd('docs/data/compass/integration/v8/ATUNED_UNAPPROVED_SEMANTIC_DECISION_QUEUE_V8.json');
const r=rd('docs/data/compass/integration/v11/ATUNED_SAFE_NONPROMOTION_SOURCE_DISPOSITIONS_V11.json');
const g=rd('docs/data/compass/integration/v4/ATUNED_UNIFIED_RESEARCH_GRAPH_V4.json');
must(r.dispositions.length===q.decisions.length&&r.counts.all===30,'queue mismatch');
const qids=new Set(q.decisions.map(x=>x.id));must(qids.size===30&&r.dispositions.every(x=>qids.has(x.id)),'missing source comparison');
must(r.dispositions.every(x=>x.sourceReconciliationStatus==='CLOSED_FOR_NONPROMOTION_DEFAULT'&&!x.canonicalEquivalentApproved&&!x.ownerSemanticApproval&&!x.runtimeWiringCreated&&x.modelSpecificSemanticChoicePending),'false approval');
must(r.counts.sourceSeparationReviewsClosed===30&&r.counts.canonicalEquivalentApproved===0&&r.counts.pendingPotentialOwnerLinkApprovals===30&&r.counts.productionEdgesCreated===0,'counts');
must(r.derivedFrom.blobSha==='3b48aea4763d845a3ed94f6c37cdb160ea9f9e3e','original review source changed');
must(g.nodes.length===404&&g.edges.length===875&&g.edges.every(x=>x.notRuntime),'graph source boundary');
console.log(JSON.stringify({pass:true,sourceOnlyDispositions:30,ownerApprovals:0,productionEdges:0,overallReadiness:72},null,2));
}catch(e){console.error(e.stack);process.exitCode=1}
