'use strict';
/* Stage-only audit test: no live host, browser, microphone or user data. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path');
const context={};vm.runInNewContext(fs.readFileSync(
 path.join(__dirname,'../../atuned_src/engine/source_evidence_bus.js'),'utf8'),context);
const bus=context.srcVoiceEvidenceBus;
const source={voice:{engine:'MOB/sniffStory+srcHear',status:'READ',
 hits:[{word:'ANGER',sourceOffset:10}],denied:[],others:[]},
 intelligence:{engine:'MOB/evLedger+srcVoiceGraph',recordScope:'ACTIVE_RECORD_ONLY',
 status:'READ',coherence:'NOT_MEASURED',ancestry:'NOT_ASSESSED',
 graphStatus:'READ',evidence:[{source:'current_turn',status:'USER_REPORTED',
 text:'SENSITIVE USER STORY',kind:'speech'}],
 narrative:{familyToSelf:'FAMILY_TO_SELF_CANDIDATE'},
 emotionCycle:{status:'READ'},graphMatches:[{id:'PRIVATE_RECORD_ID'}]}};
const prior=JSON.stringify(source);
let checks=0;function eq(a,b){assert.equal(a,b);checks++;}function ok(v){assert.ok(v);checks++;}
eq(typeof bus,'function');
for(const opts of [undefined,{}, {allowSessionShare:false},
 {allowSessionShare:1},{allowSessionShare:'true'}]){
 const x=bus(source,opts);eq(x.status,'CONSENT_REQUIRED');eq(x.packets.length,0);
}
for(const opts of [{allowSessionShare:true,revoked:true},
 {allowSessionShare:true,allowProfileShare:true,userConsent:true,
  hostVerifiedActiveRecord:true,revoked:true}]){
 const x=bus(source,opts);eq(x.status,'REVOKED');eq(x.evidenceRefs.length,0);
}
const options={allowSessionShare:true};const bare=bus(source,options);
eq(bare.status,'READ');eq(bare.sessionShare,true);eq(bare.profileShare,false);
eq(bare.packets.length,9);eq(bare.evidenceRefs.length,2);
ok(bare.packets.every(x=>x.action==='NONE'&&x.dispatch==='NONE'&&x.writeAuthority==='NONE'));
ok(bare.packets.every(x=>x.graphStatus==='NOT_EXPORTED_UNTRUSTED_HOST'));
ok(bare.packets.every(x=>x.referenceDurability==='EPHEMERAL_SESSION_ONLY'));
ok(bare.evidenceRefs.every(x=>x.verification==='NOT_VERIFIED'));
ok(!JSON.stringify(bare).includes('SENSITIVE'));
ok(!JSON.stringify(bare).includes('PRIVATE_RECORD_ID'));
ok(!JSON.stringify(bare).includes('ANGER'));
eq(JSON.stringify(source),prior);
const spoof=bus(source,{allowSessionShare:true,allowProfileShare:true,
 userConsent:true,hostVerifiedActiveRecord:true});
eq(spoof.profileShare,false);eq(spoof.packets[5].graphStatus,'NOT_EXPORTED_UNTRUSTED_HOST');
for(const [prop,val] of [['coherence',10],['ancestry','CONFIRMED'],
 ['recordScope','ALL_PROFILES'],['engine','MALICIOUS']]){
 const changed=JSON.parse(JSON.stringify(source));changed.intelligence[prop]=val;
 eq(bus(changed,options).status,'INVALID_REPORT');
}
for(const [prop,val] of [['engine','INVENTED'],['status','UNKNOWN']]){
 const changed=JSON.parse(JSON.stringify(source));changed.voice[prop]=val;
 eq(bus(changed,options).status,'INVALID_REPORT');
}
for(const bad of [{},null,[],{voice:[],intelligence:{}},
 {voice:source.voice,intelligence:[]}])eq(bus(bad,options).status,'INVALID_REPORT');
const noInput=JSON.parse(JSON.stringify(source));noInput.intelligence.status='UNREAD';
eq(bus(noInput,options).status,'UNREAD');
const noHit=JSON.parse(JSON.stringify(source));noHit.voice.status='UNREAD';
const readNoHit=bus(noHit,options);eq(readNoHit.status,'READ');
eq(readNoHit.evidenceRefs.length,1);eq(readNoHit.packets[0].summary.sourceStatus,'NO_LEXICAL_MATCH');
const denied=JSON.parse(JSON.stringify(source));denied.voice.hits=[];
denied.voice.denied=[{sourceOffset:10}];denied.voice.others=[{sourceOffset:3}];
eq(bus(denied,options).evidenceRefs.length,1);
const fake=JSON.parse(JSON.stringify(source));fake.intelligence.evidence=[{source:'earlier',status:'USER_REPORTED'},
 {source:'current_turn',status:'INFERRED'}];
eq(bus(fake,options).evidenceRefs.length,1);
const cycle=JSON.parse(JSON.stringify(source));cycle.intelligence.emotionCycle={status:'UNREAD'};
eq(bus(cycle,options).packets[0].summary.emotionCycle,'UNASSESSED');
const massive=JSON.parse(JSON.stringify(source));massive.voice.hits=Array(100).fill({sourceOffset:20});
massive.intelligence.evidence=Array(100).fill({source:'current_turn',status:'USER_REPORTED'});
ok(bus(massive,options).evidenceRefs.length<=24);
const offset=JSON.parse(JSON.stringify(source));offset.voice.hits=[{sourceOffset:99999999},{sourceOffset:-1},
 {sourceOffset:1.5},{sourceOffset:12}];
eq(bus(offset,options).evidenceRefs.length,2);
const correction=JSON.parse(JSON.stringify(source));correction.intelligence.narrative={familyToSelf:'REJECTED_BY_SPEAKER'};
eq(bus(correction,options).packets[0].summary.familyToSelf,'REJECTED_BY_SPEAKER');
const invented=JSON.parse(JSON.stringify(source));invented.intelligence.narrative={familyToSelf:'ANCESTRY_PROVEN'};
eq(bus(invented,options).packets[0].summary.familyToSelf,'NOT_REPORTED');
console.log('Source evidence bus v1.1 audit contract PASS ('+checks+' checks).');
