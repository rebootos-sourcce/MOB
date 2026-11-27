/* A PERSON TURNS THE TONE ON AND CLOSES THE TAB AT ONCE. node closewrite.js N FILE
   N fresh contexts, no seed and no init script, so the page touches its store
   when the product does. In each: boot, open a release on three seats, press
   the tone switch through its own click handler, and close the tab in the
   same breath (no wait, no beforeunload). Then a new tab in the same context
   boots the app and reads the switch off the record. Counts how many were
   lost. */
const path=require('path'),{chromium}=require('playwright');
const N=+process.argv[2]||30, FILE='file://'+path.resolve(process.argv[3]||'source.html')+'?dev=1';
const boot=p=>p.waitForFunction(()=>document.documentElement.getAttribute('data-boot')==='ok',null,{timeout:60000});
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 let lost=0, t0=Date.now(); const notes=[];
 for(let i=0;i<N;i++){
  const cx=await b.newContext({viewport:{width:1600,height:1000}});
  const a=await cx.newPage(); await a.goto(FILE,{waitUntil:'load'}); await boot(a);
  await a.waitForTimeout(600);
  const r=await a.evaluate(()=>{
   if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();
   loadP(0);
   var q=['Root','3rd Eye','Heart'].map(function(s){return NODES.filter(function(n){return n.cf&&n.b===s;})[0].i;});
   relPick(q);
   var b=document.getElementById('reltone'); if(!b)return {err:'no switch'};
   b.click(); return {id:CURP.id, on:!!(CURP.ui&&CURP.ui.tone)};});
  await a.close({runBeforeUnload:false});
  const c=await cx.newPage(); await c.goto(FILE,{waitUntil:'load'}); await boot(c);
  const k=await c.evaluate(id=>{var me=PROFILES.filter(function(p){return p.id===id;})[0];
   return me?{found:true,tone:!!(me.ui&&me.ui.tone)}:{found:false,n:PROFILES.length};},r.id);
  if(r.err||!r.on||!k.found||!k.tone){lost++; notes.push(i+':'+JSON.stringify([r,k]));}
  await cx.close();
 }
 console.log('closed at once: '+lost+' of '+N+' tone presses lost'+(notes.length?' '+notes.join(' '):'')+', '+Math.round((Date.now()-t0)/1000)+' s');
 await b.close();})();
