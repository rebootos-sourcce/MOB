#!/usr/bin/env node
// Read-only Compass source graph validator. Requires Node.js 18+.
const fs = require('fs'); const path = require('path');
const root = path.resolve(__dirname,'../../..');
const read = p => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const p = read('docs/data/purgatorio/v1/PURGATORIO_REGISTRY_V1.json');
const d = read('docs/data/paradiso/v0/PARADISO_REGISTRY_V0.json');
const records = [...p.records,...d.records];
const ids = new Set(records.map(r=>r.id));
const defects = []; const external = []; let edges=0;
if (records.length !== ids.size) defects.push('Duplicate record IDs');
if (p.records.length !== 23 || d.records.length !== 10) defects.push('Unexpected record count');
for (const r of p.records) {
 for (const e of r.graphEdges || []) {
  edges++;
  if(e.from!==r.id) defects.push('Wrong edge source: '+r.id);
  if(!ids.has(e.to)) external.push({from:r.id,to:e.to,status:e.status,reason:'Target outside imported registries'});
 }
}
for (const r of d.records) for(const e of r.links || []) {
 if (!e.id) continue;
 edges++;
 if(!ids.has(e.id)) external.push({from:r.id,to:e.id,status:e.status,reason:'Target outside imported registries'});
}
const report = {scope:'FOUNDATION_ONLY',purgatorio:p.records.length,paradiso:d.records.length,records:records.length,edges,defects,external,certified: defects.length===0 && external.length===0 && false};
process.stdout.write(JSON.stringify(report,null,2)+'\n');
if(defects.length || external.length) process.exitCode=1;
