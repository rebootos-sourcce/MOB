/* ============================================================
   THE NAMED ADDRESS LAYER FOLLOWS THE RECORD IT BELONGS TO.
   node tests/addrlayer.js, and called from tests/functional.js so a full
   run holds it through the same code.

   S.addr is the layer a story that names a body place adds at that address,
   since 26 October (engine/sniff.js applyStoryAddr), and compute reads it
   beside the axis charge. Three paths swap S and none of them carried it:
   undo, opening a worked example (loadP in ui/personas.js) and the
   practitioner roster's read of a client (pracRead in ui/practitioner.js).
   Measured on 5 November, before the fix, with one story committed on You:
     undo           DQ 0 before the commit, 3.98 after, 0.204 after the undo
     loadP(Derek)   DQ 26.221 and 20 loaded on a fresh page, 26.475 and 22
     pracRead       Derek 20 loaded on a fresh page, 22
   So the layer leaked into every one of them, and the example's scratch
   record saved it.

   WHAT IT HOLDS, at 1600
     1  a fresh page: Derek read by the example and by the roster, the control
     2  a story on You moves the layer, and the undo control takes it back
        with the charge, to the DQ before the commit
     3  redo puts it back, so there is a layer to leak below
     4  the roster reads Derek exactly as the control did
     5  opening Derek reads exactly as the control did, on an empty layer, and
        saves none onto his record
     6  coming back to You brings the person's own layer back with them
   ============================================================ */
const path=require('path');

const SAID='My chest goes tight and my throat closes when my boss shouts at me. I feel afraid and ashamed.';

const open=async(browser,FILE,booted)=>{
 const p=await browser.newPage({viewport:{width:1600,height:1000}});
 await p.goto(FILE); await booted(p); return p;};
/* the example as the Field reads it, and as the roster reads it, by name */
const asExample=p=>p.evaluate(()=>{
 loadP(PEOPLE.findIndex(x=>x.nm==='Derek')); const r=compute();
 return {DQ:+r.DQ.toFixed(6),loaded:r.loaded.length,addr:Object.keys(S.addr).length,rec:Object.keys(CURP.addr||{}).length};});
const asClient=p=>p.evaluate(()=>{
 PRAC_RCACHE={}; const s=pracRead(PEOPLE.find(x=>x.nm==='Derek'));
 return {cq:+s.cq.toFixed(6),loaded:s.loaded.map(n=>n.k).join(','),top:s.top.join(',')};});
const field=p=>p.evaluate(()=>{const r=compute();
 return {DQ:+r.DQ.toFixed(6),addr:JSON.stringify(S.addr),rec:JSON.stringify(CURP.addr||{})};});

async function addrLayerGate(browser,FILE,ok,booted){
 /* 1 */
 const a=await open(browser,FILE,booted);
 const client0=await asClient(a), example0=await asExample(a);
 ok(example0.addr===0&&example0.loaded>0,'a fresh page reads Derek on no layer, '+JSON.stringify(example0));
 await a.close();

 const p=await open(browser,FILE,booted);
 const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
 /* 2 */
 await p.evaluate(()=>{loadP(0);setTab(TAB.STORY);stRender();});
 const f0=await field(p);
 await p.evaluate(t=>srcTurnCommit(t),SAID); await p.waitForTimeout(80);
 await p.evaluate(()=>{const b=document.getElementById('stapply');if(b&&!b.disabled)b.click();});
 await p.waitForTimeout(200);
 const f1=await field(p);
 ok(f1.addr!==f0.addr&&f1.DQ>f0.DQ,'the story named places, so the layer moved, '+f0.addr+' to '+f1.addr);
 await p.evaluate(()=>document.getElementById('undobtn').onclick()); await p.waitForTimeout(120);
 const f2=await field(p);
 ok(f2.addr===f0.addr&&f2.rec===f0.addr&&Math.abs(f2.DQ-f0.DQ)<1e-6,
  'undo takes the story\'s addresses back with its charge, live and on the record, '+JSON.stringify(f2)+' against DQ '+f0.DQ);
 /* 3 */
 await p.evaluate(()=>document.getElementById('redobtn').onclick()); await p.waitForTimeout(120);
 const f3=await field(p);
 ok(f3.addr===f1.addr&&Math.abs(f3.DQ-f1.DQ)<1e-6,'and redo puts them back, '+f3.addr);
 /* 4 */
 const client1=await asClient(p);
 ok(JSON.stringify(client1)===JSON.stringify(client0),
  'the roster reads Derek the same after a story on You, '+JSON.stringify(client1)+' against '+JSON.stringify(client0));
 const back=await p.evaluate(()=>JSON.stringify(S.addr));
 ok(back===f1.addr,'and puts the open record\'s layer back where it found it, '+back);
 /* 5 */
 const example1=await asExample(p);
 ok(JSON.stringify(example1)===JSON.stringify(example0),
  'opening Derek after a story on You reads what a fresh page reads, '+JSON.stringify(example1)+' against '+JSON.stringify(example0));
 /* 6 */
 await p.evaluate(()=>toYou()); await p.waitForTimeout(80);
 const f4=await field(p);
 ok(f4.addr===f1.addr&&Math.abs(f4.DQ-f1.DQ)<1e-6,'and coming back to You brings the person\'s own layer back, '+f4.addr);
 ok(errs.length===0,'no page errors, '+JSON.stringify(errs));
 await p.close();}

module.exports={addrLayerGate};

if(require.main===module){
 const {chromium}=require('playwright');
 const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
 let PASS=0,FAIL=0;
 const ok=(c,m)=>{ if(c){PASS++; console.log('  ok    '+m);} else {FAIL++; console.log('  FAIL  '+m);} };
 const booted=async p=>{
  try{ await p.waitForFunction(()=>document.documentElement.getAttribute('data-boot')==='ok',null,{timeout:30000}); }catch(e){}
  try{ await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000}); }catch(e){}
  try{ await p.waitForTimeout(600);
   await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
   await p.waitForTimeout(120); }catch(e){}};
 (async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  require('./net.js').guardBrowser(browser);
  console.log('\n=== the named address layer follows the record it belongs to ===');
  try{ await addrLayerGate(browser,FILE,ok,booted); }
  catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
