/* Reads the real address deck rows (kbRows('addr')) for a blank boot and every
   person in PEOPLE, from a scratch build of HEAD. Also reports whether loadP
   throws on the build as committed, before any shim. */
const {chromium}=require('playwright');
const F=process.argv[2];
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+F);await p.waitForTimeout(2500);
 console.error('BOOT ERRORS',JSON.stringify(errs));
 const blank=await p.evaluate(()=>kbRows('addr').map(x=>({t:x.t,p:x.p,q:x.q})));
 const crash=await p.evaluate(()=>{try{loadP(0);return 'no throw';}catch(e){return String(e);}});
 console.error('LOADP0',crash);
 await p.evaluate(()=>{if(typeof dualPoleState!=='function'){
  window.dualPoleState=function(p){var w=Math.max(0,Math.min(100,+p||0));if(w<20)return 'op';if(w<40)return 'im';if(w<60)return 'mo';if(w<80)return 'he';return 'cl';};
  window.dualPoleStateWord=function(k){return {op:'open',im:'impaired',mo:'moderately impaired',he:'heavily impaired',cl:'blocked'}[k]||'';};}});
 const out=await p.evaluate(()=>{
  const res={n:PEOPLE.length,people:[]};
  const take=nm=>({nm,rows:kbRows('addr').map(x=>({t:x.t,seat:x.seat,fam:x.s,p:x.p,q:x.q,opp:x.opp||'',sq:x.o.sq,held:x.o.held,rep:x.o.rep}))});
  for(let i=0;i<PEOPLE.length;i++){loadP(i);res.people.push(take(PEOPLE[i].nm||PEOPLE[i].name||String(i)));}
  return res;});
 out.blank=blank;
 console.log(JSON.stringify(out));
 await b.close();})();
