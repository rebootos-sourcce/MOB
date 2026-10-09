const {chromium}=require('playwright');
const path=require('path');
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 await p.goto('file://'+path.resolve('source.html')+'?dev=1');
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}
 const r=await p.evaluate(()=>{
  const id='probe-id-1';
  const w=(k,v)=>{const o=JSON.parse(STORE.get(k)||'{}');o[id]=v;STORE.set(k,JSON.stringify(o));};
  w('atuned-avatar-side',{arch:{},load0:{},rule:{Heart:{k:'say',days:7,from:'2026-10-01',done:[1]}},tags:{}});
  w('atuned-ritual-active',[{id:'x'}]);
  w('atuned-ritual-more',{save:[],gone:['escan|'],said:[[1,'a']],did:[[2,'b']]});
  const before=['atuned-avatar-side','atuned-ritual-active','atuned-ritual-more'].map(k=>!!JSON.parse(STORE.get(k)||'{}')[id]);
  const ok=accForget(id);
  const after=['atuned-avatar-side','atuned-ritual-active','atuned-ritual-more'].map(k=>!!JSON.parse(STORE.get(k)||'{}')[id]);
  return {before,ok,after, typeofRMK: typeof RIT_MORE_KEY};
 });
 console.log(JSON.stringify(r));
 await b.close();
})();
