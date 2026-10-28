#!/usr/bin/env node
'use strict'; const fs=require('fs'),path=require('path'),vm=require('vm');const root=path.resolve(__dirname,'../../../../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p)),must=(a,b)=>{if(!a)throw Error(b)};
try{
const file=read('docs/data/compass/integration/v12/ATUNED_SOURCE_EVIDENCE_REVIEWER_V12.html');
const dataMatch=file.match(/<script type="application\/json" id="data">([\s\S]*?)<\/script>/);
must(dataMatch,'missing JSON');
const d=JSON.parse(dataMatch[1]);
const script=file.match(/<script>([\s\S]*?)<\/script>/);
must(script,'missing viewer script');new vm.Script(script[1],{filename:'source-viewer.js'});
const g=json('docs/data/compass/integration/v4/ATUNED_UNIFIED_RESEARCH_GRAPH_V4.json');
const o=json('docs/data/compass/integration/v8/ATUNED_READONLY_SOURCE_CANON_MEMBERSHIP_OVERLAY_V8.json');
const q=json('docs/data/compass/integration/v8/ATUNED_UNAPPROVED_SEMANTIC_DECISION_QUEUE_V8.json');
const r=json('docs/data/compass/integration/v11/ATUNED_SAFE_NONPROMOTION_SOURCE_DISPOSITIONS_V11.json');
must(JSON.stringify(d.graph)===JSON.stringify(g),'V4 embedded data drift');
must(JSON.stringify(d.overlay)===JSON.stringify(o),'overlay embedded data drift');
must(JSON.stringify(d.queue)===JSON.stringify(q),'review queue drift');
must(JSON.stringify(d.dispositions)===JSON.stringify(r),'source disposition drift');
const ids=new Set(g.nodes.map(x=>x.id).concat(o.nodes.map(x=>x.id)));
must(ids.size===469&&g.edges.length===875&&o.edges.length===88&&q.decisions.length===30,'browser reviewer count');
must(g.edges.concat(o.edges).every(x=>ids.has(x.from)&&ids.has(x.to)&&x.notRuntime),'browser review dangling or runtime');
must(r.dispositions.every(x=>!x.canonicalEquivalentApproved&&!x.runtimeWiringCreated),'auto promotion');
must(/aria-label/.test(file)&&/source evidence/i.test(file),'viewer accessibility/basic identity');
console.log(JSON.stringify({pass:true,viewerSyntax:true,separateSources:true,sourceNodes:469,sourceEdges:963,decisionItems:30,ownerApprovals:0,runtimeImports:0,browserFunctionalTest:'NOT_RUN'},null,2));
}catch(e){console.error(e.stack);process.exitCode=1}
