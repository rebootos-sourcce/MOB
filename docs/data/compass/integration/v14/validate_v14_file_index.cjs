#!/usr/bin/env node
'use strict';
// Read-only source locator integrity. This validates index accuracy, not Canon or runtime.
const fs=require('node:fs'), p=require('node:path'), crypto=require('node:crypto');
const root=p.resolve(__dirname,'../../../../..');
const read=f=>fs.readFileSync(p.join(root,f));
const must=(x,s)=>{if(!x)throw Error(s)};
try{
  const manifest=JSON.parse(read('docs/data/compass/integration/v14/ATUNED_FILE_LOCATOR_MANIFEST_V14.json'));
  const idx=read('docs/ATUNED_MASTER_FILE_INDEX.md').toString('utf8');
  const old=read('docs/ATUNED_SOURCE_INDEX.md').toString('utf8');
  must(manifest.schema==='ATUNED_FILE_LOCATOR_MANIFEST_V14','schema mismatch');
  must(manifest.auditedSourceCommit==='de777cb3261b3cdf6f8ddf22ff8cd731ba94ec3f','pinned baseline mismatch');
  must(manifest.locators.length===manifest.totalLocators&&manifest.totalLocators===563,'locator count drift');
  must(new Set(manifest.locators.map(x=>x.repository+'|'+x.ref+'|'+x.path)).size===563,'duplicate source locator');
  must(Object.values(manifest.countsByCategory).reduce((a,b)=>a+b,0)===563,'category counts incorrect');
  must(manifest.githubTrees.length===3&&manifest.githubTrees.every(x=>!x.truncated),'tree scope misreported');
  must(manifest.missingCriticalSources.length===2&&manifest.missingCriticalSources.every(x=>x.status==='UNRECOVERED'),'source recovery falsely asserted');
  must(idx.includes('FIRST READ (V14)')&&idx.includes('G01 through G06 remain OPEN'),'wrong index status');
  must(old.includes('[ATUNED MASTER FILE INDEX / V14](ATUNED_MASTER_FILE_INDEX.md)'),'old index not redirected');
  const local=manifest.locators.filter(x=>x.repository==='rebootos-sourcce/MOB'&&x.ref===manifest.auditedSourceCommit);
  must(local.length===411,'working tree source count drift');
  must(Object.keys(manifest.postIndexChanges||{}).length===2,'post-index change declaration drift');
  const permitted=new Set(['docs/ATUNED_SOURCE_INDEX.md','.github/workflows/compass-unified-graph-v1.yml']);
  must(Object.keys(manifest.postIndexChanges).every(k=>permitted.has(k)),'unexpected exception');
  let checked=0;
  for(const x of local){
    must(/^[a-f0-9]{40}$/.test(x.blobSha),'bad blob SHA '+x.path);
    must(!p.isAbsolute(x.path)&&!x.path.split('/').includes('..'),'unsafe indexed path '+x.path);
    const data=read(x.path);
    // Index setup changed exactly two files after the pre-index tree. Pin their exact new blobs.
    const actual=crypto.createHash('sha1').update('blob '+data.length+'\0').update(data).digest('hex');
    const expected=manifest.postIndexChanges[x.path]?.blobSha||x.blobSha;
    must(actual===expected,'stale source file locator: '+x.path+'; refresh manifest');
    checked++;
  }
  must(checked===411,'hash coverage incomplete');
  for(const x of manifest.locators){
    must(x.repository&&x.ref&&x.path&&/^[a-f0-9]{40}$/.test(x.blobSha),'invalid source pointer');
  }
  console.log(JSON.stringify({pass:true,sourceLocators:563,hashedCurrentBranchSourceFiles:checked,documentPointerVerified:true,sourceOriginalsRecovered:0,productionCertified:false},null,2));
}catch(e){console.error('ATUNED V14 INDEX FAIL: '+e.message);process.exitCode=1}
