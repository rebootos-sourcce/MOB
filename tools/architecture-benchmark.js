#!/usr/bin/env node
'use strict';
// Synthetic-only diagnostic, not a release floor.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {performance}=require('node:perf_hooks');
const file=path.resolve(process.argv[2]||'engine.js');
const cold=performance.now(),E=require(file),loadMs=performance.now()-cold;
function make(n){
 const p=E.blankProfile('Synthetic benchmark');
 p.id='benchmark-only';p.created='2026-01-01T00:00:00.000Z';
 const lines=['I felt afraid and my heart raced.','I was sad and my chest felt heavy.','I felt angry and my jaw was tight.'];
 p.story.entries=Array.from({length:n},(_,i)=>({text:lines[i%lines.length],t:new Date(Date.UTC(2026,0,1,0,i)).toISOString()}));
 return p;
}
function run(fn,n){
 for(let i=0;i<3;i++)fn();
 const samples=[];let value;
 for(let r=0;r<7;r++){const start=performance.now();for(let j=0;j<n;j++)value=fn();samples.push((performance.now()-start)/n);}
 samples.sort((a,b)=>a-b);
 return {msPerCall:{min:samples[0],median:samples[3],max:samples[6],samples},iterationsPerSample:n,result:value};
}
const blank=make(0),history=make(12);
E.loadProfile(blank);
const computation=run(()=>{const r=E.compute();assert(Number.isFinite(r.CQ));return {CQ:r.CQ,DQ:r.DQ};},25);
const before=JSON.stringify(history);
const trace=run(()=>{const g=E.traceFromRecord(history);return {nodes:g.nodes.length,edges:g.edges.length,refused:(g.refused||[]).length};},5);
const publicRead=run(()=>{const r=E.srcVoiceIntelligence('How is the Knowledge domain related to the Personal Blueprint?',history,{knowledgeGraphPilot:true}).intelligence;return {status:r.status,graphStatus:r.graphStatus,evidenceCount:(r.knowledgeEvidence||[]).length};},10);
const privateRead=run(()=>{const r=E.srcVoiceIntelligence('I felt afraid.',history,{allowProfile:true}).intelligence;return {status:r.status,graphStatus:r.graphStatus};},5);
assert.strictEqual(JSON.stringify(history),before,'Benchmark reads mutated the synthetic record');
const mem=process.memoryUsage();
console.log(JSON.stringify({node:process.version,cpu:os.cpus()[0]?.model,arch:process.arch,engineBytes:fs.statSync(file).size,coldRequireMs:loadMs,heapUsedBytes:mem.heapUsed,rssBytes:mem.rss,computation,trace,publicRead,privateRead},null,2));
