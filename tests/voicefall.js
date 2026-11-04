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

   AND THE REST OF THE WAYS VOICE CANNOT RUN, added the same day, measured on
   c5140956 before the fix: each left chat on and nothing to type in.
     9  no microphone (audio-capture), the browser refusing speech
        recognition (service-not-allowed), the speech service out of reach
        (network): the box, with the focus, under the error's own line and
        the words typing works, still true after a late greeting would have
        landed. Network goes the whole way: typed, read, Commit kept
    10  and Chat pressed again from the box, voice back: it listens, the box
        stays, no page error
    11  a microphone the browser has blocked for good: the browser's own
        permission store is set to denied over CDP and the page's real
        navigator.permissions.query reads it, checked first, then the box.
        Case 7 reads 'prompt' from the same query and draws no box, so the
        signal is told apart and not assumed
    12  start() throws once: its own line, press Chat again, no box, and no
        claim that typing works. The next press that starts listens
    13  start() throws twice in a row: the box, with the focus
    14  the greeting's playback refused late, 4 November: after a refused
        microphone the microphone line stays, and with voice that runs the
        refusal is still said
   ============================================================ */
const path=require('path');

const WIDTHS=[[1600,1000,'desktop'],[390,844,'phone']];
const WORDS='My chest was tight and I was scared when he shouted.';

/* a stand-in recogniser, the shape stMic reads: start, stop, abort and the
   three handlers. `fail` is the error code start() reports a moment later,
   the way the browser reports a refusal or a silence, and onend follows it,
   which is the order a real browser keeps and the order that took the box's
   focus away (see ST_REC.onend). The error comes on the first start of each
   recogniser only, so a silence that onend restarts goes on listening rather
   than failing in a loop. `throws` is how many presses in a row have start()
   itself throw, the way a double start does. `afterPlay` holds the error
   until the page has called play(), so case 14 has a fixed order and does
   not depend on which of two timers wins. */
const FAKE=arg=>{
 const o=typeof arg==='object'&&arg?arg:{fail:arg||''};
 function SR(){ this.on=false; this.starts=0; SR.made.push(this); }
 SR.made=[];
 SR.prototype.start=function(){
  if(window.__srThrow>0){ window.__srThrow--; throw new Error('recognition has already started'); }
  this.on=true; this.starts++; const s=this;
  const fire=()=>setTimeout(()=>{ if(s.onerror)s.onerror({error:window.__srFail});
   setTimeout(()=>{ s.on=false; if(s.onend)s.onend(); },0); },30);
  if(window.__srFail&&s.starts===1){ if(window.__srAfterPlay)window.__onPlay=fire; else fire(); } };
 SR.prototype.stop=function(){ if(!this.on)return; this.on=false; const s=this; setTimeout(()=>{ if(s.onend)s.onend(); },0); };
 SR.prototype.abort=SR.prototype.stop;
 window.__srFail=o.fail||''; window.__srThrow=o.throws||0; window.__srAfterPlay=!!o.afterPlay;
 window.SpeechRecognition=SR; window.webkitSpeechRecognition=SR; };
const NO_SR=()=>{ try{ delete window.SpeechRecognition; delete window.webkitSpeechRecognition; }catch(e){}
 window.SpeechRecognition=undefined; window.webkitSpeechRecognition=undefined; };
const INSECURE=()=>{ Object.defineProperty(window,'isSecureContext',{get:()=>false,configurable:true}); };

/* THE GREETING FAILS LATE, ON PURPOSE. Chat asks for Source AI's spoken
   greeting the moment listening starts, and that greeting's own failure line
   was measured landing after a microphone error and writing over it. The
   shared guard (tests/net.js) answers the voice route at once, so the race
   never happened here and the check passed against the bug: measured, a
   build with the drop taken out read 90 passed. So the cases that test an
   error's line answer the real voice route themselves, a failure, 300ms
   late, through the real authVoice, and read the line after it lands. A
   route the page registers later wins over the guard's. */
const VOICE_ROUTE=/\.workers\.dev\/v1\/voice\/synthesize/;
const lateVoiceFail=p=>p.route(VOICE_ROUTE,route=>{
 const h={'access-control-allow-origin':'*','access-control-allow-headers':'authorization, content-type','access-control-allow-methods':'POST, OPTIONS'};
 if(route.request().method()==='OPTIONS')return route.fulfill({status:204,headers:h});
 return new Promise(r=>setTimeout(r,300)).then(()=>route.fulfill({status:500,headers:h,body:'{}'})).catch(()=>{}); });

/* THE GREETING'S PLAYBACK FAILS LATE, ON PURPOSE, 4 November. The guard
   above covers a greeting whose synthesis fails. One whose audio arrives and
   then cannot play is a second path to the same status line: stSrcSpeak's
   play().catch. Measured on 6296138e, the permission refused case read
   "Source AI's voice is ready but the browser blocked playing it." over the
   microphone line, because the error's own pause() rejects play() with
   AbortError. That rejection's timing is the browser's, which is how the
   case passed on some runs and not others. So this case does not wait for
   it: every play() on the page is refused 300ms late, the way an autoplay
   block is, and the recogniser's error is held until play() is called
   (FAKE's afterPlay), so the order is fixed: play, then the microphone
   error 30ms on, then the refusal. A first cut ran on two timers and, on
   two runs in three, the error beat the greeting, the greeting was dropped
   before play() and the case tested nothing, which its own probe line
   caught by reading plays 0. Two sides, so the fix
   cannot be a silenced line: with a microphone error the error keeps the
   line, and with voice that runs the refusal is still said. */
const LATE_PLAY_BLOCK=()=>{ window.__plays=0; HTMLMediaElement.prototype.play=function(){ window.__plays++;
 const f=window.__onPlay; window.__onPlay=null; if(f)f();
 return new Promise((res,rej)=>setTimeout(()=>rej(new DOMException('play() failed because the user did not interact with the document first.','NotAllowedError')),300)); }; };

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
   if(fail==='not-allowed'){
    ok(!s.listen&&/microphone permission/.test(s.status),at+nm+': its own line, and it stops listening, '+JSON.stringify({listen:s.listen,status:s.status}));
    const q=await p.evaluate(async()=>{ try{ return (await navigator.permissions.query({name:'microphone'})).state; }catch(e){ return 'threw'; } });
    ok(q==='prompt',at+nm+': and the browser will ask again, the Permissions API reads prompt, which is why no box, '+q);}
   if(fail==='no-speech')ok(s.listen,at+nm+': nothing changes, it is still listening, '+JSON.stringify({listen:s.listen,status:s.status}));
   await p.close();}

  /* 14, the greeting's playback refused late: after a microphone error the
     error keeps the line; with voice that runs, the refusal is said */
  for(const [fail,nm] of [['not-allowed','permission refused, then playback refused late'],['','voice that can run, then playback refused late']]){
   const p=await open(browser,w,h,[[FAKE,{fail,afterPlay:true}],[LATE_PLAY_BLOCK]],FILE,booted);
   const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
   await press(p,'#stmic',ok,at+'Chat, '+nm);
   await p.waitForTimeout(700);
   const s=await read(p);
   const played=await p.evaluate(()=>window.__plays);
   ok(played>=1,at+nm+': the probe first, the greeting reached play(), so there was a play to refuse, plays '+played);
   if(fail==='not-allowed')ok(!s.listen&&/microphone permission/.test(s.status)&&!/blocked playing/.test(s.status),at+nm+': the microphone line is still the line after the late refusal, '+JSON.stringify(s.status));
   else ok(/blocked playing/.test(s.status),at+nm+': nothing was on the line before it, so the refusal is said, '+JSON.stringify(s.status));
   ok(s.chat===true&&!s.box,at+nm+': chat stays on and no box, '+JSON.stringify({chat:s.chat,box:s.box}));
   ok(errs.length===0,at+nm+': no page errors, '+JSON.stringify(errs));
   await p.close();}

  /* 9 and 10, three errors that mean this device cannot be heard */
  for(const code of ['audio-capture','service-not-allowed','network']){
   const p=await open(browser,w,h,[[FAKE,code]],FILE,booted);
   await lateVoiceFail(p);
   const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
   const s0=await read(p);
   await press(p,'#stmic',ok,at+'Chat, '+code);
   await p.waitForTimeout(900);
   const s=await read(p);
   const line={'audio-capture':/No microphone was found/,'service-not-allowed':/blocked speech recognition/,'network':/could not reach the network/}[code];
   ok(line.test(s.status)&&/Typing works/.test(s.status),at+code+': the error\'s own line, and typing works, still there after a late greeting would have landed, '+JSON.stringify(s.status));
   ok(s.chat===false&&s.novoice&&s.boxSeen&&!s.listen,at+code+': and the plain box is on screen and nothing claims to listen, '+JSON.stringify({chat:s.chat,novoice:s.novoice,box:s.boxSeen,listen:s.listen}));
   ok(s.focus==='sttext',at+code+': and the box still has the focus after the recogniser\'s own end, '+s.focus);
   if(code==='network'){
    await p.keyboard.type(WORDS,{delay:2});
    await p.waitForTimeout(250);
    const s2=await read(p);
    ok(s2.text===WORDS&&s2.parsed&&s2.move!=='open',at+code+': keys typed straight away land in the box and reach the reading, '+JSON.stringify({text:s2.text,parsed:s2.parsed,move:s2.move}));
    await press(p,'#stapply',ok,at+code+': Commit');
    await p.waitForTimeout(400);
    const s3=await read(p);
    ok(s3.entries===s0.entries+1&&s3.chat===false&&s3.boxSeen,at+code+': Commit keeps the entry and the box, entries '+s0.entries+' to '+s3.entries);
    await p.evaluate(()=>{ window.__srFail=''; });
    await press(p,'#stmic',ok,at+code+': Chat again, voice back');
    await p.waitForTimeout(300);
    const s4=await read(p);
    ok(s4.listen&&s4.boxSeen,at+code+': Chat pressed again from the box listens, and the box stays, '+JSON.stringify({listen:s4.listen,box:s4.boxSeen,status:s4.status}));}
   ok(errs.length===0,at+code+': no page errors on the way, '+JSON.stringify(errs));
   await p.close();}

  /* 11, a microphone the browser has blocked for good */
  {const p=await open(browser,w,h,[[FAKE,'not-allowed']],FILE,booted);
   await lateVoiceFail(p);
   const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
   const cdp=await p.context().newCDPSession(p);
   const bcid=(await cdp.send('Target.getTargetInfo')).targetInfo.browserContextId;
   await cdp.send('Browser.setPermission',{permission:{name:'microphone'},setting:'denied',browserContextId:bcid});
   const q=await p.evaluate(async()=>{ try{ return (await navigator.permissions.query({name:'microphone'})).state; }catch(e){ return 'threw'; } });
   ok(q==='denied',at+'blocked for good: the probe first, the page\'s real Permissions API reads the block, '+q);
   await press(p,'#stmic',ok,at+'Chat, microphone blocked for good');
   await p.waitForTimeout(600);
   const s=await read(p);
   ok(/blocked the microphone/.test(s.status)&&/site settings/.test(s.status)&&/Typing works/.test(s.status),at+'blocked for good: the line says where it is undone and that typing works, '+JSON.stringify(s.status));
   ok(s.chat===false&&s.novoice&&s.boxSeen&&s.focus==='sttext'&&!s.listen,at+'blocked for good: the box, with the focus, '+JSON.stringify({chat:s.chat,box:s.boxSeen,focus:s.focus,listen:s.listen}));
   ok(errs.length===0,at+'blocked for good: no page errors, '+JSON.stringify(errs));
   await p.close();}

  /* 12 and 13, start() itself throws */
  {const p=await open(browser,w,h,[[FAKE,{throws:1}]],FILE,booted);
   const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
   await press(p,'#stmic',ok,at+'Chat, start throws once');
   await p.waitForTimeout(250);
   const s=await read(p);
   ok(/could not start/.test(s.status)&&/Press Chat to try again/.test(s.status)&&!/Typing works/.test(s.status),at+'start throws once: says to press Chat again and does not claim typing works, '+JSON.stringify(s.status));
   ok(s.chat===true&&!s.novoice&&!s.box&&!s.listen,at+'start throws once: no box, chat stays on, '+JSON.stringify({chat:s.chat,box:s.box,listen:s.listen}));
   await press(p,'#stmic',ok,at+'Chat again, start works now');
   await p.waitForTimeout(250);
   const s2=await read(p);
   ok(s2.listen&&s2.chat===true&&!s2.box,at+'start throws once: the next press listens, chat on, no box, '+JSON.stringify({listen:s2.listen,chat:s2.chat,box:s2.box}));
   ok(errs.length===0,at+'start throws once: no page errors, '+JSON.stringify(errs));
   await p.close();}
  {const p=await open(browser,w,h,[[FAKE,{throws:2}]],FILE,booted);
   await press(p,'#stmic',ok,at+'Chat, start throws, first');
   await p.waitForTimeout(200);
   await press(p,'#stmic',ok,at+'Chat, start throws, second');
   await p.waitForTimeout(250);
   const s=await read(p);
   ok(/could not start again/.test(s.status)&&/Typing works/.test(s.status),at+'start throws twice in a row: its line says typing works, '+JSON.stringify(s.status));
   ok(s.chat===false&&s.novoice&&s.boxSeen&&s.focus==='sttext'&&!s.listen,at+'start throws twice in a row: and it does, the box with the focus, '+JSON.stringify({chat:s.chat,box:s.boxSeen,focus:s.focus,listen:s.listen}));
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
