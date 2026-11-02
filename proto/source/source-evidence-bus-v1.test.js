'use strict';
/* Standalone Source evidence bus contract; run:
 * node proto/source/source-evidence-bus-v1.test.js
 * Not a claim of built-engine, microphone or live user consent coverage. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path');
const sandbox={};vm.runInNewContext(fs.readFileSync(
 path.join(__dirname,'../../atuned_src/engine/source_evidence_bus.js'),'utf8'),sandbox);
const bus=sandbox.srcVoiceEvidenceBus;
assert.equal(typeof bus,'function');
const sample={voice:{status:'READ',hits:[{word:'ANGER',sourceOffset:10}],
  denied:[],others:[]},intelligence:{status:'READ',graphStatus:'READ',
  evidence:[{source:'current_turn',text:'PRIVATE raw narrative',kind:'speech'}],
  narrative:{familyToSelf:'FAMILY_TO_SELF_CANDIDATE'},
  emotionCycle:{status:'READ'},claims:[],graphMatches:[]}};
const before=JSON.stringify(sample);
const noConsent=bus(sample,{});assert.equal(noConsent.status,'CONSENT_REQUIRED');
assert.equal(noConsent.packets.length,0);
const bare=bus(sample,{allowSessionShare:true});
assert.equal(bare.status,'READ');assert.equal(bare.packets.length,9);
assert.equal(bare.profileShare,false);
assert.equal(bare.packets.find(x=>x.target==='GRAPH_EDITOR').graphStatus,'CONSENT_REQUIRED');
assert.ok(bare.packets.every(x=>x.action==='NONE'));
assert.ok(bare.packets.every(x=>x.status==='PROVISIONAL_READ_ONLY'));
assert.equal(bare.packets.find(x=>x.target==='RELEASE_PROTOCOL').boundary,
 'INITIATION_REQUIRES_SEPARATE_CONFIRMATION');
assert.ok(bare.evidenceRefs.some(x=>x.type==='LEXICAL_CANDIDATE'));
assert.ok(!JSON.stringify(bare).includes('PRIVATE'));
assert.ok(!JSON.stringify(bare).includes('ANGER'));
assert.equal(JSON.stringify(sample),before,'caller report stays unchanged');
const spoof=bus(sample,{allowSessionShare:true,allowProfileShare:true,userConsent:true});
assert.equal(spoof.profileShare,false,'host must attest the active record');
const profile=bus(sample,{allowSessionShare:true,allowProfileShare:true,
 userConsent:true,hostVerifiedActiveRecord:true});
assert.equal(profile.profileShare,true);
assert.equal(profile.packets.find(x=>x.target==='GRAPH_EDITOR').graphStatus,'READ');
const revoked=bus(sample,{allowSessionShare:true,allowProfileShare:true,
 userConsent:true,hostVerifiedActiveRecord:true,revoked:true});
assert.equal(revoked.status,'REVOKED');assert.equal(revoked.packets.length,0);
assert.equal(bus({}, {allowSessionShare:true}).status,'INVALID_REPORT');
const massive={voice:{status:'READ',hits:Array(40).fill({sourceOffset:2})},
 intelligence:{evidence:Array(50).fill({source:'current_turn'}),graphStatus:'READ'}};
assert.ok(bus(massive,{allowSessionShare:true}).evidenceRefs.length<=24);
console.log('Source evidence bus stand-alone contract PASS (12 assertions groups)');
