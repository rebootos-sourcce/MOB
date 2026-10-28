#!/usr/bin/env node
/* V3: evidence-only graph projection. Existing runtime function references
   are documented, not new protocol instances, not canonical scoring edges. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const root=path.resolve(__dirname,'../../../../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const check=(v,m)=>{if(!v)throw Error(m)},blob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
try{
 const g=json('docs/data/compass/integration/v3/ATUNED_UNIFIED_RESEARCH_GRAPH_V3.json');
 const old=json('docs/data/compass/integration/v3/ATUNED_UNIFIED_RESEARCH_GRAPH_V2.json');
 const bindings=json('docs/data/compass/gameboard/v2/GAMEBOARD_EXISTING_RELEASE_RITUAL_BINDINGS_V2.json');
 const ids=new Set(g.nodes.map(n=>n.id)),keys=e=>e.from+'|'+e.to+'|'+e.type,edges=new Set(g.edges.map(keys));
 check(g.nodes.length===398&&ids.size===398,'node count/duplicates');
 check(g.edges.length===861&&edges.size===861,'edge count/duplicates');
 check(g.edges.every(e=>ids.has(e.from)&&ids.has(e.to)&&e.notRuntime===true),'bad endpoints/false runtime flags');
 check(g.nodes.slice(0,old.nodes.length).every((n,i)=>JSON.stringify(n)===JSON.stringify(old.nodes[i])),'prior source records modified');
 check(g.edges.slice(0,old.edges.length).every((n,i)=>JSON.stringify(n)===JSON.stringify(old.edges[i])),'prior source edges modified');
 for(const entry of ['sceneBindings','teacherRecipes'])check(blob(read(g.sources[entry].path))===g.sources[entry].blobSha,'V3 source changed '+entry);
 const release='engine-entrypoint:release:relPick',ritual='engine-entrypoint:ritual:ritStartPlan';
 check(ids.has(release)&&ids.has(ritual),'missing route nodes');
 for(const s of bindings.sceneBindings){
   check(edges.has([s.sceneId,release,'scene_dynamic_release_entrypoint'].join('|')),'missing release route '+s.sceneId);
   check(edges.has([s.sceneId,ritual,'scene_dynamic_ritual_entrypoint'].join('|')),'missing ritual route '+s.sceneId);
 }
 const recipes=g.nodes.filter(n=>n.kind==='teacher_starter_ritual_preset');
 check(recipes.length===39,'starter recipe count');
 for(const r of recipes){
   check(edges.has(['compass:pole:'+r.recipeId.split('-')[0],r.id,'pole_authored_ritual_template'].join('|')),'missing ritual pole source join '+r.id);
   check(r.sceneAutoAssigned===false&&r.sourceStatus==='ENGINE_STARTER_DRAFT_NOT_APPROVED_SCENE_BINDING','invented scene approval '+r.id);
 }
 check(g.edges.filter(e=>e.graphSegment==='runtime_route_source_references').length===52,'route source edge count');
 check(g.edges.filter(e=>e.graphSegment==='teacher_recipe_source_references').length===39,'recipe source edge count');
 const h=read('docs/data/compass/integration/v3/ATUNED_GRAPH_EDITOR_V3.html');
 const match=h.match(/<script id="graph-data" type="application\/json">([\s\S]*?)<\/script>/);
 check(match,'editor missing graph');
 const emb=JSON.parse(match[1]);
 check(emb.nodes.length===398&&emb.edges.length===861,'editor stale');
 const js=h.match(/<script>\s*([\s\S]*?)<\/script>/);check(js,'editor script missing');
 new vm.Script(js[1],{filename:'ATUNED_GRAPH_EDITOR_V3.js'});
 check(g.validation.staticSceneProtocolInstances===0&&g.validation.staticSceneRitualInstances===0,'false instance creation');
 console.log(JSON.stringify({result:'PASS',graphNodes:398,typedEdges:861,sceneReleaseRouting:26,sceneRitualRouting:26,teacherRitualTemplates:39,staticInstancesCreated:0,editorScriptSyntax:'PASS',browserInteractions:'NOT_VERIFIED',canonicalApprovals:'NOT_CLAIMED'},null,2));
}catch(e){console.error('FAIL: '+e.stack);process.exitCode=1;}
