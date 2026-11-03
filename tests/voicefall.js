/* ============================================================
   WHEN VOICE CANNOT RUN, THE JOURNAL STILL TAKES WORDS.
   node tests/voicefall.js, and called from tests/functional.js so a full run
   holds it through the same code.

   THE DEFECT, 3 November, reproduced on b6f86211 before the fix. Since the
   reply line went (29 October, his words: "let's get rid of the text field
   entirely... this is going to be a conversation dashboard"), voice is the
   only way a turn reaches Source AI while STV.chat is true, which is the
   Journal's normal state. stMic refused two cases by saying "Typing works.",
   a browser with no speech recognition and a page that is not a secure
   context, while nothing on the page could be typed in: no #sttext, no
   #stcin, no text field of any kind under #story. Measured: both cases, the
   message said to type and the page had nothing to type in.

   THE FIX, AND WHAT IT MUST NOT DO. stVoiceCant (ui/storyui.js) puts the
   Journal in the plain box the crisis door already opens (STV.chat false),
   for those two cases only, and STV.novoice keeps it there across a Commit.
   Where voice can run, nothing changes: no box, even when the person has
   refused the microphone or said nothing, because those are states that
   pass, not a browser that cannot do it.

   EVERY PRESS IS A REAL POINTER PRESS, and the words are typed by the
   keyboard, so a box that is covered or off the screen fails by name.

   WHAT IT HOLDS, at 1600 and at 390
     1  the Journal lands with chat on and no text field, as ruled
     2  no speech recognition: Chat pressed, the plain box is on screen and
        has the focus, the status line says typing works, and it is true
     3  typed words reach the reading and Source AI moves off its opener
     4  Commit, pressed, keeps the entry, and the box is still there after
     5  a page that is not a secure context: the same box, the same way
     6  voice that can run: Chat pressed starts listening and draws no box
     7  permission refused: its own line, and no box
     8  silence: no-speech changes nothing, still listening, no box
   ============================================================ */
const path=require('path');

const WIDTHS=[[1600,1000,'desktop'],[390,844,'phone']];
const WORDS='My chest was tight and I was scared when he shouted.';

/* a stand-in recogniser, the shape stMic reads: start, stop, abort and the
   three handlers. `fail` is the error code start() reports a moment later,
   the way the browser reports a refusal or a silence. */
const FAKE=fail=>{
 function SR(){ this.on=false; SR.made.push(this); }
 SR.made=[];
 SR.prototype.start=function(){ this.on=true; const s=this;
  if(window.__srFail)setTimeout(()=>{ if(s.onerror)s.onerror({error:window.__srFail}); },30); };
 SR.prototype.stop=function(){ if(!this.on)return; this.on=false; const s=this; setTimeout(()=>{ if(s.onend)s.onend(); },0); };
 SR.prototype.abort=SR.prototype.stop;
 window.__srFail=fail||'';
 window.SpeechRecognition=SR; window.webkitSpeechRecognition=SR; };
const NO_SR=()=>{ try{ delete window.SpeechRecognition; delete window.webkitSpeechRecognition; }catch(e){}
 window.SpeechRecognition=undefined; window.webkitSpeechRecognition=undefined; };
const INSECURE=()=>{ Object.defineProperty(window,'isSecureContext',{get:()=>false,configurable:true}); };

async function press(p,sel,ok,what){
 try{ await p.click(sel,{timeout:5000}); return true; }
 catch(e){ ok(false,what+': '+sel+' could not be pressed, '+String(e.message).split('\n')[0]); return false; }}

/* the page's own state, read the same way every time */
const read=p=>p.evaluate(()=>{
 const st=document.getElementById('sttext'), r=st&&st.getBoundingClientRect();
 return {chat:STV.chat, novoice:!!STV.novoice, listen:!!ST_LISTEN,
  box:!!st, boxSeen:!!(r&&r.width>0&&r.height>0&&getComputedStyle(st).visibility!=='hidden'),
  focus:document.activeElement&&document.activeElement.id,
  fields:document.querySelectorAll('#story textarea,#story input[type=text],#story [contenteditable=true]').length,
  status:(document.getElementById('status')||{}).textContent||'',
  text:ST_TEXT, parsed:!!ST_PARSED,
  move:srcTurn(STR.heard,{typed:!!ST_TEXT.trim(),passed:SRC_PASSED}).move,
  entries:((CURP&&CURP.story&&CURP.story.entries)||[]).length};});

async function open(browser,w,h,inits,FILE,booted){
 const p=await browser.newPage({viewport:{width:w,height:h}});
 for(const f of inits)await p.addInitScript(f[0],f[1]);
 await p.goto(FILE); await booted(p);
 await p.evaluate(async()=>{ loadP(0); setTab(TAB.STORY); render(); await new Promise(r=>setTimeout(r,320)); });
 return p;}

async function voiceFallGate(browser,FILE,ok,booted){
 for(const [w,h,wn] of WIDTHS){
  const at=wn+': ';

  /* 1 to 4, no speech recognition */
  {const p=await open(browser,w,h,[[NO_SR]],FILE,booted);
   const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
   const s0=await read(p);
   ok(s0.chat===true&&!s0.box&&s0.fields===0,at+'the Journal lands with chat on and no text field, the 29 October ruling, '+JSON.stringify({chat:s0.chat,box:s0.box,fields:s0.fields}));
   await press(p,'#stmic',ok,at+'Chat, with no speech recognition');
   await p.waitForTimeout(200);
   const s1=await read(p);
   ok(/no speech recognition/.test(s1.status)&&/Typing works/.test(s1.status),at+'no speech recognition: the status line says so and says typing works, '+JSON.stringify(s1.status));
   ok(s1.chat===false&&s1.novoice&&s1.boxSeen,at+'and typing does work: the plain box is on screen, '+JSON.stringify({chat:s1.chat,novoice:s1.novoice,box:s1.boxSeen}));
   ok(s1.focus==='sttext',at+'and the box has the focus, so the next key lands in it, '+s1.focus);
   ok(!s1.listen,at+'and Chat does not claim to be listening, '+s1.listen);
   await press(p,'#sttext',ok,at+'the box');
   await p.keyboard.type(WORDS,{delay:2});
   await p.waitForTimeout(250);
   const s2=await read(p);
   ok(s2.text===WORDS&&s2.parsed,at+'typed words reach the reading, '+JSON.stringify({text:s2.text,parsed:s2.parsed}));
   ok(s2.move!=='open',at+'and Source AI has heard them, it is off its opener, move '+s2.move);
   await press(p,'#stapply',ok,at+'Commit');
   await p.waitForTimeout(400);
   const s3=await read(p);
   ok(s3.entries===s0.entries+1,at+'Commit keeps the typed entry, entries '+s0.entries+' to '+s3.entries);
   ok(s3.chat===false&&s3.boxSeen&&s3.text==='',at+'and the box is still there, empty, for the next one: Commit does not put chat back on a browser that cannot hear, '+JSON.stringify({chat:s3.chat,box:s3.boxSeen,text:s3.text}));
   ok(errs.length===0,at+'no page errors on the way, '+JSON.stringify(errs));
   await p.close();}

  /* 5, a page that is not a secure context, recogniser present */
  {const p=await open(browser,w,h,[[FAKE,''],[INSECURE]],FILE,booted);
   await press(p,'#stmic',ok,at+'Chat, on a page that is not secure');
   await p.waitForTimeout(200);
   const s=await read(p);
   ok(/secure page/.test(s.status)&&/Typing works/.test(s.status),at+'not a secure page: the status line says so and says typing works, '+JSON.stringify(s.status));
   ok(s.chat===false&&s.boxSeen&&s.focus==='sttext'&&!s.listen,at+'and the plain box is on screen with the focus, '+JSON.stringify({chat:s.chat,box:s.boxSeen,focus:s.focus,listen:s.listen}));
   const made=await p.evaluate(()=>window.SpeechRecognition.made.length);
   ok(made===0,at+'and no recogniser was started, '+made);
   await p.close();}

  /* 6 to 8, voice can run: no box in any of these */
  for(const [fail,nm] of [['','voice that can run'],['not-allowed','permission refused'],['no-speech','silence']]){
   const p=await open(browser,w,h,[[FAKE,fail]],FILE,booted);
   await press(p,'#stmic',ok,at+'Chat, '+nm);
   await p.waitForTimeout(250);
   const s=await read(p);
   ok(s.chat===true&&!s.novoice&&!s.box&&s.fields===0,at+nm+': chat stays on and no text field is drawn, '+JSON.stringify({chat:s.chat,novoice:s.novoice,box:s.box,fields:s.fields}));
   if(fail==='')ok(s.listen&&/Listening/.test(s.status),at+nm+': it is listening, '+JSON.stringify({listen:s.listen,status:s.status}));
   if(fail==='not-allowed')ok(!s.listen&&/microphone permission/.test(s.status),at+nm+': its own line, and it stops listening, '+JSON.stringify({listen:s.listen,status:s.status}));
   if(fail==='no-speech')ok(s.listen,at+nm+': nothing changes, it is still listening, '+JSON.stringify({listen:s.listen,status:s.status}));
   await p.close();}
 }}

module.exports={voiceFallGate};

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
  const {FULL_SIGHT}=require('./seed.js');
  browser.newPage=(orig=>async function(...a){const pg=await orig.apply(this,a); await pg.addInitScript(FULL_SIGHT); return pg;})(browser.newPage);
  console.log('\n=== when voice cannot run, the Journal still takes words ===');
  try{ await voiceFallGate(browser,FILE,ok,booted); }
  catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
