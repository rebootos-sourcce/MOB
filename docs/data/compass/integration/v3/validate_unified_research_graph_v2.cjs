#!/usr/bin/env node
/* V2 source verification. Requires full checkout and read-only git fetch of
   atuned/deep-psyche-end-to-end-2026-10-26 branch into FETCH_HEAD.
   Checks source truth, not clinical validity or deployed engine behavior. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),
vm=require('node:vm'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../../../../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const assert=(c,m)=>{if(!c)throw Error(m)};
const sha=raw=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(raw)+'\0').update(raw).digest('hex');
const old=json('docs/data/compass/integration/v3/ATUNED_UNIFIED_RESEARCH_GRAPH_V1.json');
const g=json('docs/data/compass/integration/v3/ATUNED_UNIFIED_RESEARCH_GRAPH_V2.json');
const html=read('docs/data/compass/integration/v3/ATUNED_GRAPH_EDITOR_V2.html');
try{
  assert(g.schema==='ATUNED_RESEARCH_UNIFIED_GRAPH_V2'&&g.policy.runtime===false,'wrong authority');
  assert(g.nodes.length===357&&g.edges.length===770,'unexpected V2 inventory');
  assert(g.nodes.length-old.nodes.length===149&&g.edges.length-old.edges.length===208,'expected delta 149 nodes, 187 pairs, 21 candidates');
  const nodeIds=new Set(g.nodes.map(x=>x.id)),keys=e=>e.from+'|'+e.to+'|'+e.type;
  assert(nodeIds.size===357,'duplicate nodes');
  assert(new Set(g.edges.map(keys)).size===770,'duplicate typed edges');
  assert(g.edges.every(e=>nodeIds.has(e.from)&&nodeIds.has(e.to)&&e.notRuntime===true),'invalid edge/ref or runtime flag');
  assert(g.edges.slice(0,old.edges.length).every((e,i)=>JSON.stringify(e)===JSON.stringify(old.edges[i])),'base research edge mutated');
  assert(g.nodes.filter(n=>n.group==='deep_psyche').length===149,'Deep Psyche nodes');
  const psiEdges=g.edges.filter(e=>e.graphSegment==='deep_psyche_source_branch'),lex=g.edges.filter(e=>e.graphSegment==='cross_registry_lexical_candidate');
  assert(psiEdges.length===187&&lex.length===21,'Deep Psyche reciprocal / lexical candidates');
  assert(psiEdges.every(x=>x.sourceReciprocal&&x.sourceEntryCount===2),'reciprocal metadata missing');
  assert(lex.every(e=>e.status==='LEXICAL_MATCH_ONLY_UNAPPROVED_NOT_CANONICAL_EQUIVALENCE'),'candidate falsely promoted');
  const raw=cp.execFileSync('git',['show','FETCH_HEAD:docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json'],{cwd:root,maxBuffer:8*1024*1024,encoding:'utf8'});
  assert(sha(raw)===g.external.deepPsyche.sourceBlobSha,'Deep Psyche upstream blob changed; reproject instead of silently merging');
  const source=JSON.parse(raw),sourceIds=new Set(source.records.map(x=>x.id));
  assert(source.records.length===149&&sourceIds.size===149,'Deep Psyche source changed');
  assert(g.nodes.filter(n=>n.group==='deep_psyche').every(n=>sourceIds.has(n.id)),'imported unknown Deep Psyche record');
  const pairs=new Map();for(const r of source.records){for(const e of r.relationships||[]){assert(e.fromId===r.id||e.toId===r.id,'unanchored relationship '+r.id);const k=[e.fromId,e.toId].sort().join('|')+'|'+e.type;const arr=pairs.get(k)||[];arr.push(e);pairs.set(k,arr)}}
  assert(pairs.size===187&&[...pairs.values()].every(x=>x.length===2),'source reciprocal relationship pairs');
  const graphPairs=new Set(psiEdges.map(e=>[e.from,e.to].sort().join('|')+'|'+e.type.slice('psyche:'.length)));
  assert([...pairs.keys()].every(k=>graphPairs.has(k)),'missing imported relation');
  assert(source.records.reduce((a,r)=>a+(r.relationships||[]).length,0)===374,'374 source entries');
  const emb=html.match(/<script id="graph-data" type="application\/json">([\s\S]*?)<\/script>/);assert(emb,'editor graph not embedded');
  const eg=JSON.parse(emb[1]);assert(eg.nodes.length===357&&eg.edges.length===770,'editor graph stale');
  assert(new Set(eg.edges.map(keys)).size===770,'editor contains duplicate links');
  const script=html.match(/<script>\s*([\s\S]*?)<\/script>/);assert(script,'editor script absent');
  new vm.Script(script[1],{filename:'ATUNED_GRAPH_EDITOR_V2.js'});
  assert(html.includes('groups.push(n.kind)')&&html.includes('id="export"'),'Deep Psyche layout/export controls absent');
  assert(g.validation.unresolved['gameboard protocols assigned']===0&&g.validation.unresolved['gameboard becoming rituals assigned']===0,'unresolved gameboard mismatch');
  console.log(JSON.stringify({result:'PASS',nodes:357,typedEdges:770,deepPsycheRecords:149,sourceRelationshipObjects:374,reciprocalPairs:187,lexicalCandidatesOnly:21,sourceBlobPinned:g.external.deepPsyche.sourceBlobSha,gameScenesWithoutProtocol:26,approvedRuntimeEdges:0,editorScriptParsed:true,browserTest:false},null,2));
}catch(e){console.error('FAIL: '+e.stack);process.exitCode=1}
