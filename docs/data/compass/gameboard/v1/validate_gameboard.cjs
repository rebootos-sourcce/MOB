'use strict';
/* node docs/data/compass/gameboard/v1/validate_gameboard.cjs */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=__dirname,load=f=>JSON.parse(fs.readFileSync(path.join(base,f),'utf8'));
const g=load('GAMEBOARD_MAP_V1.json'),p=load('PUBLIC_GAMEBOARD_V1.json'),tpl=load('GAME_LEVEL_TEMPLATE_V1.json');
assert.equal(g.nodes.length,26);assert.equal(g.edges.length,25);assert.equal(p.levels.length,26);
const nodeIds=new Set(),byId=new Map();const realms={INFERNO:0,PURGATORIO:0,PARADISO:0};
for(const n of g.nodes){
 assert(!nodeIds.has(n.id),'duplicate node '+n.id);nodeIds.add(n.id);byId.set(n.id,n);
 for(const key of tpl.required)assert(Object.hasOwn(n,key)&&n[key]!=null,'missing '+key+' on '+n.id);
 assert(n.label.trim().length>0&&n.challenge.trim().length>0&&n.knowledge.trim().length>0);
 assert.equal(n.releaseProtocolId,null);assert.equal(n.becomingRitualId,null);
 assert.equal(n.progression.noMoralityRank,true);assert.equal(n.progression.canRevisit,true);
 realms[n.realm]++;
 const f=path.join(base,'records',n.id.split(':').slice(1).join('_')+'.md');assert(fs.existsSync(f),'no Markdown for '+n.id);
}
assert.deepEqual(realms,{INFERNO:9,PURGATORIO:7,PARADISO:10});
for(const x of g.edges)assert(nodeIds.has(x.from)&&nodeIds.has(x.to),'dangling edge');
assert.equal(g.shadowEncounterLibrary.length,14);assert.equal(g.ascentArchetypeLibrary.length,12);
const published=JSON.stringify(p);
for(const banned of ['Lucifer','Charon','Geryon','Asmodeus','Furies','Phlegyas','Moloch','Apep','Ravana','Kaliya','Druj','Malak','Baal'])assert(!new RegExp('\\b'+banned+'\\b','i').test(published),'figure identity leaked: '+banned);
for(const x of p.levels)assert(byId.has(x.id)&&x.label===byId.get(x.id).label);
console.log(JSON.stringify({pass:true,levels:g.nodes.length,realms,navEdges:g.edges.length,shadowEncounters:g.shadowEncounterLibrary.length,ascentArchetypes:g.ascentArchetypeLibrary.length},null,2));
