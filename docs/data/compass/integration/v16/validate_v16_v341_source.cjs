#!/usr/bin/env node
'use strict';
/* V16 source provenance validator. PASS is not runtime, Canon, or empirical certification. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const check=(ok,msg)=>{if(!ok)throw Error(msg)};
try{
 const x=read('docs/data/compass/integration/v16/ATUNED_V341_EXACT_19_DOMAINS_V16.json');
 const gap=read('docs/data/compass/integration/v4/DEEP_PSYCHE_19_V341_EXACT_SOURCE_GAP_LEDGER_V1.json');
 const expected='79c8ddd9fc3ea586cec56f523351702ee1ac96336ceff39f80730582332466e4';
 check(x.schema==='ATUNED_V341_EXACT_19_DOMAIN_SOURCE_EXTRACTION_V16','wrong schema');
 check(x.originalSource.sha256===expected&&x.originalSource.bytes===16417226,'source identity drift');
 check(x.originalSource.sha256===gap.records[0].sourceVersionRequestedSha256,'V4 gap hash mismatch');
 check(x.records.length===19&&x.verification.actualCount===19,'19 exact-domain records missing');
 const names=new Set(x.records.map(r=>r.name));
 check(names.size===19,'duplicate domain');
 const clusters=Object.entries(x.clusters);
 check(clusters.length===4,'four clusters required');
 check(clusters.reduce((n,[_k,v])=>n+v.length,0)===19,'19 cluster members required');
 for(const [cluster,memberNames] of clusters){
   check(memberNames.every(n=>names.has(n)),'missing source domain in '+cluster);
   for(const n of memberNames){let r=x.records.find(v=>v.name===n);check(r.cluster===cluster,'cluster drift '+n);}
 }
 for(const r of x.records){
  check(r.sourceLine>=3917&&r.sourceLine<=3960,'source line drift '+r.name);
  check(r.literalHtml.includes('Clear:')&&r.literalHtml.includes('Distorted:')&&r.literalHtml.includes('Templates:'),'source literal missing fields '+r.name);
  check(r.clear&&r.distorted&&r.templates,'empty source passage '+r.name);
  check(r.literalHtml.startsWith('<p class="body-dim">')&&r.literalHtml.endsWith('</p>'),'literal HTML not preserved '+r.name);
 }
 check(x.policy.sourceRecovered===true&&x.policy.exactNineteenTextRecovered===true,'recovery state missing');
 check(x.policy.canonMappingApproved===false&&x.policy.runtimeChanged===false&&x.policy.scientificValidationAsserted===false,'unsafe promotion');
 const original=process.env.ATUNED_V341_ORIGINAL_PATH;
 let recheckedRaw=false;
 if(original){
   const raw=fs.readFileSync(original),hash=crypto.createHash('sha256').update(raw).digest('hex');
   check(hash===expected&&raw.length===16417226,'original v341 SHA/size failure');
   const html=raw.toString('utf8');
   for(const r of x.records)check(html.includes(r.literalHtml),'record not exact literal source: '+r.name);
   recheckedRaw=true;
 }
 console.log(JSON.stringify({pass:true,rawVerifiedWhenProvided:recheckedRaw,previouslyVerifiedSha256:expected,sourceDefinitions:19,canonPromotions:0,runtimeChanges:0,scientificValidityAsserted:false,infernoV1StillRequired:true},null,2));
}catch(e){console.error('V16 V341 SOURCE FAIL: '+e.message);process.exitCode=1;}
