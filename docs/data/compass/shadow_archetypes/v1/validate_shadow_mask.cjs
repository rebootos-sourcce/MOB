'use strict';
/* node docs/data/compass/shadow_archetypes/v1/validate_shadow_mask.cjs */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dir=__dirname,read=p=>JSON.parse(fs.readFileSync(path.join(dir,p),'utf8'));
const reg=read('SHADOW_ARCHETYPES_REGISTRY_V1.json');
const pub=read('PUBLIC_CHARACTERISTICS_ONLY_V1.json');
const template=read('SHADOW_ARCHETYPE_TEMPLATE_V1.json');
const expected=['IL','RE','DE','OR','PO','PE','TR','CH','FL','AL','HO','SA','TU','NA'];
assert.equal(reg.records.length,30);
assert.equal(reg.coverage.infernoFigureAndCrossTradition,14);
assert.equal(pub.poles.length,14);
const ids=new Set(),byPole=new Map(),publicIds=new Set();
for(const r of reg.records){
 assert(!ids.has(r.id),'duplicate '+r.id);ids.add(r.id);
 for(const field of template.required)assert(Object.hasOwn(r,field),'missing '+field+' in '+r.id);
 assert.equal(r.researchPasses.length,3);
 assert.equal(r.public.identityVisible,false);
 assert(r.def.trim().split(/\s+/).length<=2,'long label '+r.id);
 assert(r.researchSources.length>0);
 assert(!publicIds.has(r.public.publicId),'duplicate opaque ID');
 publicIds.add(r.public.publicId);
 const md=path.join(dir,'records',r.id.split(':')[1]+'.md');
 assert(fs.existsSync(md),'missing '+md);
 assert(fs.statSync(md).size>400,'incomplete '+md);
 if(r.poleKey){assert(!byPole.has(r.poleKey),'duplicate pole');byPole.set(r.poleKey,r);}
}
assert.equal(byPole.size,14);
for(const key of expected)assert(byPole.has(key),'missing pole '+key);
for(const row of pub.poles){
 const source=byPole.get(row.poleKey);assert(source);
 assert.equal(row.publicId,source.public.publicId);
 assert.equal(row.label,source.def);
}
for(const row of pub.traits){
 assert(row.label.trim().split(/\s+/).length<=2);
 assert(/^SH\d{3}$/.test(row.publicId));
}
for(const r of reg.records.filter(x=>!x.public.displayEnabled))assert(!pub.traits.some(p=>p.publicId===r.public.publicId),'context exposed');
const payload=JSON.stringify(pub);
for(const k of template.privateKeys)assert(!payload.includes('"'+k+'"'),'private field '+k);
for(const r of reg.records)for(const name of [r.nm,...r.aliases]){
 if(name.length<5)continue;
 const pattern=new RegExp('\\b'+name.toLowerCase().split(/\W+/).filter(Boolean).join('\\W+')+'\\b','i');
 assert(!pattern.test(payload),'hidden name leaked: '+name);
}
console.log(JSON.stringify({pass:true,records:reg.records.length,poles:pub.poles.length,publicTraits:pub.traits.length,hiddenContext:reg.records.filter(x=>!x.public.displayEnabled).length,depthPasses:reg.records.reduce((s,r)=>s+r.researchPasses.length,0)},null,2));
