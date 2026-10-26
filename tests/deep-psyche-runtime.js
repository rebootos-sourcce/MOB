#!/usr/bin/env node
'use strict';
/* End-to-end knowledge graph acceptance: generated data, templates, mappings,
 * reciprocity, and a real path from a documented archetype/fetter table row
 * down to the nerve branches via the existing engine's Saboteur/Node records.
 * Non-canonical visualization slots are not fabricated into domain entities. */
const fs=require('fs');
const path=require('path');
const assert=require('assert');
const root=path.resolve(__dirname,'..');
const file=path.join(root,'proto/knowledge/src/data.js');
const raw=fs.readFileSync(file,'utf8');
const match=raw.match(/var KBD=(.*);\s*$/s);
assert(match,'Generated KBD payload missing');
const db=JSON.parse(match[1]), entries=db.entries, reg=db.deepPsychologicalRegistry;
assert(Array.isArray(entries)&&Array.isArray(reg.records),'Records/entries missing');
const by=new Map();
for(const e of entries) {
 assert(e.id&&!by.has(e.id),'Duplicate or missing entry: '+e.id);
 by.set(e.id,e);
}
const psych=reg.records.map(r=>{
 const e=by.get(r.id);
 assert(e,'Missing runtime Deep Psyche entry: '+r.id);
 assert(e.kind==='psych_'+r.kind,'Incorrect runtime kind: '+r.id);
 assert(e.templateId===r.templateId,'Template changed: '+r.id);
 assert(e.templateValidation && e.templateValidation.missingFields.length===0,
  'Unfilled required template fields: '+r.id);
 assert(Array.isArray(e.researchPasses)&&e.researchPasses.length===3,
  'Three passes not carried into runtime: '+r.id);
 return e;
});
assert(psych.length===reg.recordCount && psych.length===147,
 'Registry count mismatch');
const failures=[];let reciprocalEdges=0,crossSystemEdges=0;
for(const e of psych) {
 for(const id of e.links||[]) {
  const other=by.get(id);
  if(!other)failures.push([e.id,id,'missing target']);
  else if(!(other.links||[]).includes(e.id))
   failures.push([e.id,id,'nonreciprocal']);
  else reciprocalEdges++;
  if(other && !String(other.kind).startsWith('psych_'))crossSystemEdges++;
 }
 if(e.parentId && !by.has(e.parentId))failures.push([e.id,e.parentId,'missing parent']);
}
assert(failures.length===0,JSON.stringify(failures.slice(0,15)));
assert(reciprocalEdges>=100,'Expected populated, reciprocal source graph');
const v341=reg.records.filter(r=>r.recordType==='v341_domain_candidate');
assert(v341.length===19 && v341.every(x=>x.parentId&&x.relationships.length),
 'v341 required template/parent relationships missing');
const tableRows=reg.records.filter(r=>r.recordType==='mapping_record');
assert(tableRows.length===36,'Missing mapping rows');
for(const r of tableRows) {
 const psychEntry=by.get(r.id);
 assert(psychEntry.links.some(id=>id.startsWith('archetype:candidate:')),
   'Source mapping not linked to archetype: '+r.id);
}
// Check that source-row navigation actually crosses from the new catalog into
// the original runtime graph, and down through existing saboteur->node->nerve.
function canReach(start,kind,maxHops=7) {
 const queue=[[start,0]],seen=new Set([start]);
 while(queue.length) {
  const [id,hops]=queue.shift(),entry=by.get(id);
  if(entry && entry.kind===kind)return true;
  if(!entry||hops>=maxHops)continue;
  for(const next of entry.links||[])if(!seen.has(next)){
   seen.add(next);queue.push([next,hops+1]);
  }
 }
 return false;
}
const archetypeTable=reg.records.filter(x=>x.layer==='archetype_fetter_seat_mapping_table');
const nervePaths=archetypeTable.filter(x=>canReach(x.id,'nerve')).length;
assert(crossSystemEdges>0,'Deep Psyche not connected to legacy runtime entries');
assert(nervePaths>0,'No mapped archetype/fetter row reaches any nerve branch');
const uiSlots=psych.filter(x=>x.slotOnly);
assert(uiSlots.length===14,'Visualization slots lost');
const report={
 status:'PASS', runtimeEntries:entries.length,
 deepPsychologicalRecords:psych.length, templatesComplete:psych.length,
 mappingsNavigable:tableRows.length,
 bidirectionalPsychologicalLinks:reciprocalEdges,
 legacyGraphEdges:crossSystemEdges,
 archetypeFetterRowsReachingNerves:nervePaths,
 totalArchetypeFetterRows:archetypeTable.length,
 visualizationSlots:uiSlots.length,
 remainingProvisionalDefinitions:v341.filter(x=>
  x.templateValidation?.contentStatus!=='complete').length,
 measuredRuntimeGraph:db.deepPsychologicalGraph
};
console.log(JSON.stringify(report,null,2));
