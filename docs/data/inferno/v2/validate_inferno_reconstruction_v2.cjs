#!/usr/bin/env node
'use strict';
// Validate reconstructed V2 source integrity. Structural proof only, never promotion.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../..');
const text=p=>fs.readFileSync(path.join(root,p),'utf8');
const hash=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const dir='docs/data/inferno/';
const source=text(dir+'v1/research/INFERNO_FOUR_PASS_REGISTRY_2026-10-25.md');
const crosswalk=text(dir+'v1/research/INFERNO_CROSSWALK_2026-10-25.csv');
const data=JSON.parse(text(dir+'v2/INFERNO_NORMALIZED_RECONSTRUCTION_V2.json'));
const expectedResearch='121f67f0e6625ef44e29bc7730143ddef70ba7e8b27322be832472960da54202';
const oldMissing='de3d0099ffbaf698d40873a141010cd2c724ff226e0b33a208b1307f58bc0fdc';
assert.equal(hash(source),expectedResearch,'Research source integrity');
assert.equal(data.sourceResearchSha256,expectedResearch);
assert.equal(data.sourceCrosswalkSha256,hash(crosswalk),'Crosswalk source integrity');
assert.equal(data.missingOriginalV1Sha256,oldMissing);
assert.equal(data.sameAsMissingV1Archive,false);
assert.equal(data.authority,'RESEARCH_RECONSTRUCTION_ONLY_NOT_CANONICAL_NOT_RUNTIME');
assert.equal(data.counts.approvedRuntimeEdges,0);
assert.equal(data.counts.canonicalApproval,false);
const headings=[...source.matchAll(/^### ([BLFX]\d{2}) ·.*$/gm)],end=source.indexOf('## E. Research source ledger');
assert.equal(headings.length,38);assert.ok(end>headings.at(-1).index);
const xs=crosswalk.trimEnd().split(/\r?\n/).slice(1).map(x=>x.split(',')[0]);
assert.equal(xs.length,38);
const keys=['nm','fam','def','body','inferred','inferenceBasis','behavior','triggerMechanism','livedExample','impact','practice','oppositeId','oppositeDefinition','oppositeStatus','confidence','reviewStatus','refer','narrativeSource','researchSources','researchPasses','links'];
assert.deepEqual(data.templateFields,keys);
assert.equal(data.records.length,38);
const byId=new Map(data.records.map(r=>[r.recordId,r]));
assert.equal(byId.size,38);
assert.deepEqual(new Set(xs),new Set(headings.map(x=>x[1])));
const kinds={inferno_behavior:0,inferno_circle:0,inferno_figure:0,inferno_cross_tradition:0};
let passes=0,links=0;
for(let i=0;i<headings.length;i++){
  const id=headings[i][1],r=byId.get(id);
  assert.ok(r,'Missing reconstruction record '+id);
  assert.equal(r.id,'inferno:'+id);
  assert.equal(r.authority,'SOURCE_REFERENCED_NONCANONICAL_RECONSTRUCTION');
  assert.equal(r.templateId,'TPL-INFERNO-SUPERCOMPLEX-COMPAT-V2_RECONSTRUCTION');
  for(const k of keys)assert.ok(Object.hasOwn(r,k),'Template field missing '+id+'/'+k);
  assert.equal(r.refer,false);assert.equal(r.oppositeId,null);assert.equal(r.oppositeDefinition,null);assert.equal(r.practice,null);
  assert.ok(Object.hasOwn(kinds,r.kind),'Unknown source kind '+r.kind);kinds[r.kind]++;
  const after=i+1<headings.length?headings[i+1].index:end;
  const original=source.slice(headings[i].index,after);
  assert.equal(r.body,original,'Original record body modified '+id);
  assert.equal(r.sourceSectionSha256,hash(original),'Record digest '+id);
  const published=text(dir+'v1/research/records/'+id+'.md');
  assert.equal(published,original,'Published source section '+id);
  assert.equal(r.researchPasses.length,4);
  const found=[...original.matchAll(/^- \*\*P([1-4]):\*\* (.+)$/gm)];
  assert.equal(found.length,4);
  for(let n=0;n<4;n++){
    assert.equal(r.researchPasses[n].pass_number,n+1);
    assert.equal(r.researchPasses[n].finding,found[n][2],'Pass drift '+id+'/'+n);
    assert.equal(r.researchPasses[n].authority,'AUTHORED_ANALYTICAL_PASS_NOT_INDEPENDENT_CERTIFICATION');
    passes++;
  }
  for(const l of r.links){
    assert.ok(l.id.startsWith('inferno:') && byId.has(l.id.slice(8)),'Dangling candidate link');
    assert.equal(l.notRuntime,true);assert.equal(l.status,'UNPROMOTED');links++;
  }
}
assert.deepEqual(kinds,{inferno_behavior:15,inferno_circle:9,inferno_figure:11,inferno_cross_tradition:3});
assert.equal(passes,152);
console.log(JSON.stringify({status:'PASS_RECONSTRUCTION_V2_SOURCE_ONLY',records:byId.size,passes,
  sourceDigest:expectedResearch,crosswalkHash:data.sourceCrosswalkSha256,
  sourceLinks:links,templateFields:keys.length,kinds,
  oldV1ArchiveRecovered:false,canonicalApproved:false,runtimeApproved:false},null,2));
