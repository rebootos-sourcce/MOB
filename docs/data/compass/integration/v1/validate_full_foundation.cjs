#!/usr/bin/env node
/* Read-only validation of the full documented Compass integration graph. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../../../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const graph=read('docs/data/compass/integration/v1/COMPASS_CROSS_LAYER_GRAPH_V1.json');
const validation=read('docs/data/compass/integration/v1/BUILD_VALIDATION_V2.json');
const ids=new Set(graph.nodes.map(n=>n.id));
const issues=[];
if(ids.size!==graph.nodes.length)issues.push('Duplicate node IDs');
if(graph.nodes.length!==135)issues.push('Node count drift');
if(graph.edges.length!==300)issues.push('Edge count drift');
for(const [i,e] of graph.edges.entries()){
 if(!ids.has(e.from)||!ids.has(e.to))issues.push('Dangling endpoint at edge '+i);
 if(!e.type||!e.status)issues.push('Missing edge type/status at '+i);
}
const result={
 graphNodes:graph.nodes.length,graphEdges:graph.edges.length,
 invalidTechnicalRelationships:issues.length,technicalIssues:issues,
 knownSemanticAndSourceReviewIssues:validation.issueCounts,
 infernoCanonicalImport:validation.checks.infernoPromoted,
 reciprocalTeacherParadiso:validation.checks.allTeacherParadisoLinksReconciled,
 runtimeWiring:validation.checks.runtimeTested,
 frameworkCertified:issues.length===0 && validation.checks.infernoPromoted &&
 validation.checks.allTeacherParadisoLinksReconciled && false
};
console.log(JSON.stringify(result,null,2));
if(issues.length)process.exitCode=1;
