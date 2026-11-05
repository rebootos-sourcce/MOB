/* ============================================================
   A CONTROL SAYS WHAT HAPPENED TO THE SAVE, AND NOT BEFORE IT KNOWS.
   node tests/honeststatus.js, and called from tests/functional.js so a full
   run holds it through the same code.

   THE RULE, CLAUDE.md: "Every write that can fail reports through status();
   a control must never claim success before it has it." Four places broke
   it, found 5 November and each confirmed three times:

     1  Export on the account page (#acexp, ui/account.js) said "Record
        copied to the clipboard." the moment it asked. writeText answers
        with a promise, so a refused clipboard read as a backup the person
        did not have, and the refusal fell out as a page error.
     2  Export in the intake's profile row (#iqexp, ui/intakeui.js) did the
        same, and turned its own label to "Copied" as well.
     3  Undo and Redo (settle in ui/panels.js) threw the save's answer away
        and always said "Took back ..." as ok, so on a store that refused
        the write a reload brought the undone change back.
     4  An intake answer press ([data-a], ui/intakeui.js) never read its save
        at all, so on a full store all of the law answers could be lost on a
        reload with no word said.

   WHAT IT HOLDS
     a  a clipboard that refuses: both Exports say nothing was copied, as a
        failure, the intake button never reads Copied, and no page error
     b  a clipboard that takes it: both say copied, as ok, and the record is
        really on the clipboard (the control, so a) is not passing on a dead
        button)
     c  a store that refuses every write: an answer press and an undo both
        say Not saved, as a failure, and the undo still names what it took
        back
     d  a store with room: the same press says Saved. and the same undo says
        Took back as ok (the control for c)

   The two Export buttons are pressed through their own click handler, inside
   the page: #acexp sits under the account sheet's scroll and a pointer press
   on it timed out in the finder's probe, which is a question about the sheet
   and not about what the button says.
   ============================================================ */
const path=require('path');

/* the store refuses every write from this point on, the way a full origin
   or a store blocked mid session does: setItem throws QuotaExceededError */
const REFUSE=()=>{ Storage.prototype.setItem=function(){ const e=new Error('full'); e.name='QuotaExceededError'; throw e; }; };
const st=p=>p.evaluate(()=>{ const e=document.getElementById('status');
 return {text:e?e.textContent:'', kind:e?e.getAttribute('data-kind'):null}; });
/* the clipboard answers on its own clock, so wait for the line to move off
   the blank this gate wrote before the press, and read it then */
const settled=async p=>{ try{ await p.waitForFunction(()=>{ const e=document.getElementById('status'); return e&&e.textContent!==''; },null,{timeout:4000}); }catch(e){} await p.waitForTimeout(150); return st(p); };

async function openPage(browser,FILE,booted,perms){
 const ctx=await browser.newContext(Object.assign({viewport:{width:1600,height:1000}},perms?{permissions:perms}:{}));
 const p=await ctx.newPage(); const errs=[];
 p.on('pageerror',e=>errs.push(String(e).slice(0,160)));
 await p.goto(FILE); await booted(p);
 /* a real record, so pExport and pSave have something of the person's own */
 await p.evaluate(()=>{ if(!CURP||PROFILES.indexOf(CURP)<0)pNew('Probe'); });
 return {ctx,p,errs};}

/* A CLIPBOARD THAT REFUSES, by stand in. Whether a headless Chromium refuses
   writeText without the permission depends on the build: the finder's
   bundled build refused, the one this sandbox's gates run on took it. So the
   refusal is made the way the browser makes it, a rejected promise with a
   NotAllowedError, and does not hang on which binary is in use. */
const DENY=()=>{ const deny=function(){ const e=new Error('Write permission denied.'); e.name='NotAllowedError'; return Promise.reject(e); };
 if(navigator.clipboard)Object.defineProperty(navigator.clipboard,'writeText',{value:deny,configurable:true}); };
const pressAccExport=p=>p.evaluate(()=>{ setTab(TAB.SETTINGS);
 for(const s of ACC_SECS){ ACC_OPEN=s.k; renderAccount(); if(document.getElementById('acexp'))break; }
 const b=document.getElementById('acexp'); if(!b)return false; status(''); b.click(); return true; });
const pressIqExport=p=>p.evaluate(()=>{ setTab(TAB.INTAKE); IQ_MORE=true; renderIntake();
 const b=document.getElementById('iqexp'); if(!b)return null; status(''); b.click(); return true; });
const iqLabel=p=>p.evaluate(()=>{ const b=document.getElementById('iqexp'); return b?b.textContent:null; });

async function honestStatusGate(browser,FILE,ok,booted){
 /* a and b, the clipboard refusing and then taking it */
 for(const grant of [false,true]){
  const at=(grant?'clipboard granted: ':'clipboard refused: ');
  const {ctx,p,errs}=await openPage(browser,FILE,booted,grant?['clipboard-read','clipboard-write']:null);
  if(!grant)await p.evaluate(DENY);
  const hasA=await pressAccExport(p);
  ok(hasA,at+'the account page draws its Export button');
  const a=await settled(p);
  if(grant){
   const clip=await p.evaluate(async()=>{ try{ return JSON.parse(await navigator.clipboard.readText()).id===CURP.id; }catch(e){ return 'unread: '+e.name; } });
   ok(/copied to the clipboard/.test(a.text)&&a.kind==='ok'&&clip===true,at+'account Export says copied, as ok, and the record is on the clipboard, '+JSON.stringify({a,clip}));
  } else {
   ok(!/copied to the clipboard/.test(a.text)&&/Nothing was copied/.test(a.text)&&a.kind==='fail',at+'account Export says nothing was copied, as a failure, '+JSON.stringify(a));
  }
  const hasI=await pressIqExport(p);
  ok(hasI,at+'the intake profile row draws its Export button');
  /* the label is read straight after the press as well, because the old
     handler wrote Copied synchronously, before the clipboard had answered */
  const lbl0=await iqLabel(p);
  const i=await settled(p); const lbl=await iqLabel(p);
  if(grant){
   ok(/Profile copied/.test(i.text)&&i.kind==='ok'&&lbl==='Copied',at+'intake Export says copied, as ok, and the button reads Copied, '+JSON.stringify({i,lbl}));
  } else {
   ok(!/copied to the clipboard/.test(i.text)&&/Nothing was copied/.test(i.text)&&i.kind==='fail'&&lbl0!=='Copied'&&lbl!=='Copied',at+'intake Export says nothing was copied, as a failure, and the button never reads Copied, '+JSON.stringify({i,lbl0,lbl}));
  }
  ok(errs.length===0,at+'no page error from the clipboard, '+JSON.stringify(errs));
  await ctx.close();}

 /* c and d, a store that refuses and then one with room */
 for(const full of [false,true]){
  const at=(full?'store refusing: ':'store with room: ');
  const {ctx,p,errs}=await openPage(browser,FILE,booted,null);
  /* an undoable move first, saved while there is still room: a seeded type */
  const seeded=await p.evaluate(()=>{ setTab(TAB.INTAKE); IQ_WHO=true; renderIntake();
   const ty=document.getElementById('wtype'); if(!ty)return false;
   ty.value='INTJ'; ty.dispatchEvent(new Event('change')); return !!(CURP.seed&&CURP.seed.type==='INTJ'); });
  ok(seeded,at+'a type can be seeded to have something to take back');
  if(full)await p.evaluate(REFUSE);
  /* the answer press, through its own handler */
  const ans=await p.evaluate(()=>{ IQ_WHO=false; IQ_OPEN=0; IQ_VIEW='list'; renderIntake();
   const b=document.querySelector('[data-a="0"][data-v="9"]')||document.querySelector('[data-a][data-v]');
   if(!b)return null; status(''); b.click();
   const e=document.getElementById('status');
   return {text:e.textContent, kind:e.getAttribute('data-kind'), held:CURP.intake.answers[+b.getAttribute('data-a')]===+b.getAttribute('data-v')}; });
  ok(!!ans,at+'the intake draws an answer button');
  if(ans){
   if(full)ok(/^Not saved\./.test(ans.text)&&ans.kind==='fail'&&ans.held,at+'an answer press says Not saved, as a failure, and the answer stays on screen, '+JSON.stringify(ans));
   else ok(ans.text==='Saved.'&&ans.kind!=='fail'&&ans.held,at+'an answer press says Saved., '+JSON.stringify(ans));}
  /* undo by the chord, the only route a person has while the arrows are hidden */
  await p.evaluate(()=>{ if(document.activeElement&&document.activeElement.blur)document.activeElement.blur(); status(''); });
  await p.keyboard.press('Control+z');
  await p.waitForTimeout(250);
  const u=await st(p);
  if(full)ok(/^Took back /.test(u.text)&&/Not saved/.test(u.text)&&u.kind==='fail',at+'an undo names what it took back and says Not saved, as a failure, '+JSON.stringify(u));
  else ok(/^Took back /.test(u.text)&&!/Not saved/.test(u.text)&&u.kind==='ok',at+'an undo says Took back, as ok, '+JSON.stringify(u));
  ok(errs.length===0,at+'no page error, '+JSON.stringify(errs));
  await ctx.close();}
}

module.exports={honestStatusGate};

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
  console.log('\n=== a control says what happened to the save ===');
  try{ await honestStatusGate(browser,FILE,ok,booted); }
  catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
