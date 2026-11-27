const {chromium}=require('playwright');
const path=require('path');
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const ctx=await b.newContext({viewport:{width:1600,height:1000}});
 const p=await ctx.newPage();
 const reqs=[]; p.on('request',r=>{const u=r.url(); if(!u.startsWith('file:')&&!u.startsWith('data:'))reqs.push(r.method()+' '+u.slice(0,100));});
 await p.route('**/*',r=>{const u=r.request().url(); if(u.startsWith('file:')||u.startsWith('data:'))return r.continue(); return r.fulfill({status:200,contentType:'application/json',body:'{"records":[]}',headers:{'access-control-allow-origin':'*'}});});
 await p.goto('file://'+path.resolve('source.html')+'?dev=1');
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}
 const r=await p.evaluate(async()=>{
  const o={typeofProfiles:typeof profiles};
  STORE.set(AUTH_KEY,JSON.stringify({token:'t',email:'a@b.co',accountId:'acc1'})); AUTH_READ=false; AUTH_S=null;
  o.session=!!authSession();
  o.eligible=profileSyncEligible();
  o.result=await authProfileSync();
  profileSyncStart(); await new Promise(r=>setTimeout(r,800)); profileSyncStop();
  return o;});
 console.log(JSON.stringify(r));
 console.log('network requests during probe:',JSON.stringify(reqs));
 await b.close();
})();
