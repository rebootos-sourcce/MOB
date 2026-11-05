/* ============================================================
   TYPE INSTEAD, THE BOX ON REQUEST WHILE VOICE WORKS.
   node tests/typein.js, and called from tests/functional.js so a full run
   holds it through the same code.

   THE RULING, 4 November, his words: "if 170 can't do voice, then it opens
   the typing panel. We should probably just add the typing panel, closed, to
   the bottom of the journal. And if a person wants to use it, they can just
   use it." tests/voicefall.js holds the first half, the box that opens on its
   own when voice cannot run (stVoiceCant, STV.novoice). This holds the
   second: a closed control at the foot of the Journal (#sttype, stType in
   ui/storyui.js) that opens the same box on a browser where voice works.

   EVERY PRESS IS A REAL POINTER PRESS, and the words are typed by the
   keyboard, so a control that is covered or off the screen fails by name.

   THE STAND-IN STOPS THE WAY CHROME DOES. stop() hands back the sentence
   still being spoken as a final result and then ends, which is what Chat's
   own tooltip promises ("stop and keep what it heard"). voicefall.js's
   stand-in ends with nothing, so it could not see a sentence lost, or the
   focus taken off the box, when Type instead stops a recording.

   WHAT IT HOLDS, at 1600 and at 390
     1  voice works: the Journal lands with chat on, no text field, and the
        control closed, on screen, at the 44 pixel floor
     2  Chat, a sentence said and one still being said, then Type instead:
        listening stops, both sentences are in the box, the box has the
        focus, the recogniser is off, and there is one box and one Commit
     3  keys typed reach the reading, and Commit keeps the entry and shuts
        the box: chat is back on and the control is closed again
     4  pressed again with words in it, the box shuts, the words stay in the
        entry and come back as the person's own turn in the thread
     5  Chat pressed from the open box goes back to the conversation: it
        listens and the box shuts
     6  no speech recognition, the forced box from voicefall.js: no Type
        instead beside it, before or after Commit
     7  Type instead open, then Chat on a browser with no speech recognition:
        the forced box takes over and the control goes, one box
     8  the crisis door's box: no Type instead beside it
   ============================================================ */
const path=require('path');

const WIDTHS=[[1600,1000,'desktop'],[390,844,'phone']];
const SAID='My jaw was tight all morning.';
const SAYING='I was scared he would shout';
const TYPED=' and my chest went tight when he did.';

/* a stand-in recogniser, the shape stMic reads. say() delivers a result the
   way the browser does, final or not; stop() turns whatever is still interim
   into a final and then ends, in that order and a tick apart. */
const FAKE=()=>{
 function SR(){ this.on=false; this.res=[]; SR.made.push(this); }
 SR.made=[];
 SR.prototype.start=function(){ this.on=true; this.res=[]; };
 SR.prototype._fire=function(i){ if(this.onresult)this.onresult({resultIndex:i,results:this.res}); };
 SR.prototype.say=function(t,fin){ const r=[{transcript:t}]; r.isFinal=!!fin;
  const last=this.res[this.res.length-1];
  if(last&&!last.isFinal){ this.res[this.res.length-1]=r; this._fire(this.res.length-1); }
  else { this.res.push(r); this._fire(this.res.length-1); } };
 SR.prototype.stop=function(){ if(!this.on)return; this.on=false; const s=this;
  setTimeout(()=>{ const last=s.res[s.res.length-1];
   if(last&&!last.isFinal){ const r=[{transcript:last[0].transcript}]; r.isFinal=true; s.res[s.res.length-1]=r; s._fire(s.res.length-1); }
   setTimeout(()=>{ if(s.onend)s.onend(); },0); },20); };
 /* abort throws away what has not finalised, the way the browser does.
    stHush calls it while Source AI speaks; the first cut of this stand-in
    made it stop, which kept a sentence the browser would have dropped. */
 SR.prototype.abort=function(){ if(!this.on)return; this.on=false; const s=this;
  setTimeout(()=>{ if(s.onend)s.onend(); },0); };
 window.SpeechRecognition=SR; window.webkitSpeechRecognition=SR; };
const NO_SR=()=>{ try{ delete window.SpeechRecognition; delete window.webkitSpeechRecognition; }catch(e){}
 window.SpeechRecognition=undefined; window.webkitSpeechRecognition=undefined; };

async function press(p,sel,ok,what){
 try{ await p.click(sel,{timeout:5000}); return true; }
 catch(e){ ok(false,what+': '+sel+' could not be pressed, '+String(e.message).split('\n')[0]); return false; }}

/* the page's own state, read the same way every time */
const read=p=>p.evaluate(()=>{
 const st=document.getElementById('sttext'), r=st&&st.getBoundingClientRect();
 const ty=document.getElementById('sttype'), q=ty&&ty.getBoundingClientRect();
 const rec=window.SpeechRecognition&&window.SpeechRecognition.made;
 return {chat:STV.chat, novoice:!!STV.novoice, typed:!!STV.typed, listen:!!ST_LISTEN,
  box:!!st, boxSeen:!!(r&&r.width>0&&r.height>0&&getComputedStyle(st).visibility!=='hidden'),
  boxes:document.querySelectorAll('#sttext').length, commits:document.querySelectorAll('#stapply').length,
  types:document.querySelectorAll('#sttype').length,
  ty:ty?{exp:ty.getAttribute('aria-expanded'), w:Math.round(q.width), h:Math.round(q.height),
   seen:q.width>0&&q.height>0&&getComputedStyle(ty).visibility!=='hidden'&&q.bottom<=innerHeight*4,
   top:(()=>{ const e=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2); return !!(e&&ty.contains(e)); })(),
   text:ty.textContent.trim()}:null,
  focus:document.activeElement&&document.activeElement.id,
  fields:document.querySelectorAll('#story textarea,#story input[type=text],#story [contenteditable=true]').length,
  status:(document.getElementById('status')||{}).textContent||'',
  text:ST_TEXT, parsed:!!ST_PARSED,
  recOn:!!(rec&&rec.length&&rec[rec.length-1].on),
  me:SRC_CHAT.filter(x=>x.w==='me').map(x=>x.t),
  entries:((CURP&&CURP.story&&CURP.story.entries)||[]).length};});

async function open(browser,w,h,inits,FILE,booted){
 const p=await browser.newPage({viewport:{width:w,height:h}});
 for(const f of inits)await p.addInitScript(f[0],f[1]);
 await p.goto(FILE); await booted(p);
 await p.evaluate(async()=>{ loadP(0); setTab(TAB.STORY); render(); await new Promise(r=>setTimeout(r,320)); });
 return p;}

/* the control sits at the foot of the panel, which on a phone is below the
   first screen: brought into view the way a thumb would scroll to it, and
   then pressed for real */
async function pressType(p,ok,what){
 await p.evaluate(()=>{ const t=document.getElementById('sttype'); if(t)t.scrollIntoView({block:'center'}); });
 await p.waitForTimeout(60);
 return press(p,'#sttype',ok,what);}

async function typeInGate(browser,FILE,ok,booted){
 for(const [w,h,wn] of WIDTHS){
  const at=wn+': ';

  /* 1 to 3 */
  {const p=await open(browser,w,h,[[FAKE]],FILE,booted);
   const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
   const s0=await read(p);
   ok(s0.chat===true&&!s0.box&&s0.fields===0,at+'voice works: the Journal lands with chat on and no text field, '+JSON.stringify({chat:s0.chat,box:s0.box,fields:s0.fields}));
   ok(s0.types===1&&s0.ty&&s0.ty.exp==='false'&&s0.ty.text==='Type instead',at+'and Type instead is there, closed, '+JSON.stringify(s0.ty));
   await p.evaluate(()=>{ const t=document.getElementById('sttype'); if(t)t.scrollIntoView({block:'center'}); });
   const sz=(await read(p)).ty;
   ok(sz&&sz.seen&&sz.top&&sz.w>=44&&sz.h>=44,at+'on screen, nothing over it, at the 44 pixel floor, '+JSON.stringify(sz));

   await press(p,'#stmic',ok,at+'Chat');
   /* Chat asks for Source AI's greeting out loud, and its hold drops what
      is said under it: measured under load, the first sentence went into
      the greeting's hold and never landed. So the greeting is waited out,
      started and finished, before anybody speaks. */
   try{ await p.waitForFunction(()=>ST_HUSH,null,{timeout:5000});
    await p.waitForFunction(()=>!ST_HUSH&&ST_REC_ON&&ST_LISTEN,null,{timeout:5000}); }
   catch(e){ ok(false,at+'the greeting plays and the recording runs again after it, '+String(e.message).split('\n')[0]); }
   /* the first sentence lands and Source AI answers it out loud, which
      holds the recording (stHush); the second is said once the hold lets
      go and the recording is running again, which is the order a real
      conversation keeps */
   await p.evaluate(a=>{ const r=window.SpeechRecognition.made; r[r.length-1].say(a,true); },SAID);
   /* the hold starts when the reply's audio arrives, which is after the
      turn lands, so waiting only for it to be off passed before it began:
      measured, the second sentence was then dropped by the hold's own
      abort, which is right for the page and wrong for the test */
   try{ await p.waitForFunction(()=>ST_HUSH,null,{timeout:5000});
    await p.waitForFunction(()=>!ST_HUSH&&ST_REC_ON&&ST_LISTEN,null,{timeout:5000}); }
   catch(e){ ok(false,at+'the recording runs again after Source AI\'s reply, '+String(e.message).split('\n')[0]); }
   await p.evaluate(b=>{ const r=window.SpeechRecognition.made; r[r.length-1].say(b,false); },SAYING);
   await p.waitForTimeout(200);
   const s1=await read(p);
   ok(s1.listen&&s1.text.indexOf(SAID)>=0&&s1.types===1&&s1.ty.exp==='false',at+'Chat listens, the sentence said is a turn, and Type instead stays closed beside it, '+JSON.stringify({listen:s1.listen,text:s1.text,ty:s1.ty&&s1.ty.exp}));
   await pressType(p,ok,at+'Type instead, while listening');
   await p.waitForTimeout(300);
   const s2=await read(p);
   ok(!s2.listen&&!s2.recOn,at+'Type instead stops listening, and the recogniser is off, '+JSON.stringify({listen:s2.listen,recOn:s2.recOn}));
   ok(s2.chat===false&&s2.typed&&!s2.novoice&&s2.boxSeen,at+'and the box is on screen, opened by choice and not forced, '+JSON.stringify({chat:s2.chat,typed:s2.typed,novoice:s2.novoice,box:s2.boxSeen}));
   ok(s2.text.indexOf(SAID)>=0&&s2.text.indexOf(SAYING)>=0,at+'and both sentences are in it, the one still being said kept and not dropped, '+JSON.stringify(s2.text));
   ok(s2.focus==='sttext',at+'and the box has the focus after the recogniser\'s own end, '+s2.focus);
   ok(s2.boxes===1&&s2.commits===1&&s2.types===1&&s2.ty.exp==='true',at+'one box, one Commit, and Type instead reads open, '+JSON.stringify({boxes:s2.boxes,commits:s2.commits,types:s2.types,exp:s2.ty&&s2.ty.exp}));
   /* no End key first: the caret has to be after the sentence that landed
      on the stop without anybody moving it */
   await p.keyboard.type(TYPED,{delay:2});
   await p.waitForTimeout(250);
   const s3=await read(p);
   ok(s3.text.endsWith(SAYING+TYPED)&&s3.parsed,at+'keys typed land at the end of the entry and reach the reading, '+JSON.stringify({text:s3.text,parsed:s3.parsed}));
   await press(p,'#stapply',ok,at+'Commit');
   await p.waitForTimeout(400);
   const s4=await read(p);
   ok(s4.entries===s0.entries+1,at+'Commit keeps the entry, entries '+s0.entries+' to '+s4.entries);
   ok(s4.chat===true&&!s4.typed&&!s4.box&&s4.text==='',at+'and the box shuts with it, chat back on, '+JSON.stringify({chat:s4.chat,typed:s4.typed,box:s4.box,text:s4.text}));
   ok(s4.types===1&&s4.ty.exp==='false'&&/Committed|Kept/.test(s4.status),at+'and Type instead is closed again under the commit\'s own line, '+JSON.stringify({exp:s4.ty&&s4.ty.exp,status:s4.status}));
   ok(errs.length===0,at+'no page errors on the way, '+JSON.stringify(errs));
   await p.close();}

  /* 4 and 5 */
  {const p=await open(browser,w,h,[[FAKE]],FILE,booted);
   const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
   await pressType(p,ok,at+'Type instead, voice idle');
   await p.waitForTimeout(150);
   const s0=await read(p);
   ok(s0.boxSeen&&s0.focus==='sttext'&&!s0.listen,at+'Type instead with nothing recording: the box, with the focus, '+JSON.stringify({box:s0.boxSeen,focus:s0.focus,listen:s0.listen}));
   await p.keyboard.type(SAID,{delay:2});
   await p.waitForTimeout(200);
   await pressType(p,ok,at+'Type instead, pressed again');
   await p.waitForTimeout(250);
   const s1=await read(p);
   ok(s1.chat===true&&!s1.typed&&!s1.box,at+'pressed again, the box shuts and chat is back, '+JSON.stringify({chat:s1.chat,typed:s1.typed,box:s1.box}));
   ok(s1.text===SAID&&s1.me.indexOf(SAID)>=0,at+'and the words stay in the entry, as the person\'s own turn in the thread, '+JSON.stringify({text:s1.text,me:s1.me}));
   ok(s1.focus==='sttype'&&s1.ty.exp==='false',at+'and the focus stays on the control, now closed, '+JSON.stringify({focus:s1.focus,exp:s1.ty&&s1.ty.exp}));
   await pressType(p,ok,at+'Type instead, again');
   await p.waitForTimeout(150);
   const s2=await read(p);
   ok(s2.boxSeen&&s2.text===SAID,at+'opened again, the box holds the same words, '+JSON.stringify({box:s2.boxSeen,text:s2.text}));
   await press(p,'#stmic',ok,at+'Chat, from the open box');
   await p.waitForTimeout(250);
   const s3=await read(p);
   ok(s3.listen&&s3.chat===true&&!s3.typed&&!s3.box&&s3.ty&&s3.ty.exp==='false',at+'Chat from the open box listens and shuts it, '+JSON.stringify({listen:s3.listen,chat:s3.chat,typed:s3.typed,box:s3.box}));
   ok(errs.length===0,at+'no page errors on the way, '+JSON.stringify(errs));
   await p.close();}

  /* 6, the forced box */
  {const p=await open(browser,w,h,[[NO_SR]],FILE,booted);
   const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
   await press(p,'#stmic',ok,at+'Chat, no speech recognition');
   await p.waitForTimeout(200);
   const s=await read(p);
   ok(s.novoice&&s.boxSeen&&s.focus==='sttext'&&/no speech recognition/.test(s.status),at+'no speech recognition: the forced box opens as before, with its own line, '+JSON.stringify({novoice:s.novoice,box:s.boxSeen,focus:s.focus,status:s.status}));
   ok(s.types===0&&s.boxes===1&&s.commits===1,at+'and no Type instead beside it, one box, one Commit, '+JSON.stringify({types:s.types,boxes:s.boxes,commits:s.commits}));
   await p.keyboard.type(SAID,{delay:2});
   await p.waitForTimeout(200);
   await press(p,'#stapply',ok,at+'Commit, forced box');
   await p.waitForTimeout(400);
   const s2=await read(p);
   ok(s2.novoice&&s2.chat===false&&s2.boxSeen&&s2.types===0,at+'after Commit the forced box stays, still with no Type instead, '+JSON.stringify({novoice:s2.novoice,chat:s2.chat,box:s2.boxSeen,types:s2.types}));
   ok(errs.length===0,at+'no page errors on the way, '+JSON.stringify(errs));
   await p.close();}

  /* 7, open by choice, then voice turns out not to run */
  {const p=await open(browser,w,h,[[NO_SR]],FILE,booted);
   await pressType(p,ok,at+'Type instead, before Chat, no speech recognition');
   await p.waitForTimeout(150);
   const s0=await read(p);
   ok(s0.typed&&s0.boxSeen,at+'Type instead opens the box on a browser with no speech recognition too, '+JSON.stringify({typed:s0.typed,box:s0.boxSeen}));
   await press(p,'#stmic',ok,at+'Chat, from the open box, no speech recognition');
   await p.waitForTimeout(200);
   const s=await read(p);
   ok(s.novoice&&!s.typed&&s.boxSeen&&s.focus==='sttext'&&/no speech recognition/.test(s.status),at+'the forced box takes over with its own line, '+JSON.stringify({novoice:s.novoice,typed:s.typed,box:s.boxSeen,focus:s.focus,status:s.status}));
   ok(s.types===0&&s.boxes===1,at+'and Type instead goes, one box, '+JSON.stringify({types:s.types,boxes:s.boxes}));
   await p.close();}

  /* 8, the crisis door */
  {const p=await open(browser,w,h,[[FAKE]],FILE,booted);
   await p.evaluate(async()=>{ crisisTalk(); await new Promise(r=>setTimeout(r,300)); });
   const s=await read(p);
   ok(s.chat===false&&s.boxSeen&&s.types===0&&s.boxes===1,at+'the crisis door\'s box: no Type instead beside it, one box, '+JSON.stringify({chat:s.chat,box:s.boxSeen,types:s.types,boxes:s.boxes}));
   await p.close();}
 }}

module.exports={typeInGate};

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
  console.log('\n=== type instead, the box on request while voice works ===');
  try{ await typeInGate(browser,FILE,ok,booted); }
  catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
