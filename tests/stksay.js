/* ============================================================
   THE INSIGHT WELL TALKS. node tests/stksay.js, and called from
   tests/functional.js so a full run holds it through the same code.

   The owner, 17 November: "the insight panel is source ai's translation of
   whats selected. i want this to be an audio button too. if i press it, i
   can talk to source ai about the parent and children and how it works
   through me and run a protocol to release it." ui/stksay.js is the button;
   DECISIONS.md, "The Insight well talks, one button only", is the ruling.

   EVERY LINE IS READ OFF THE REQUEST THE PAGE SENDS. The voice route is
   answered by tests/net.js with a short silent sound, so the real authVoice
   and the real stSrcSpeak run; a stand-in recogniser (the shape stMic reads)
   lets the gate say words to the page. Presses are real pointer presses.

   WHAT IT HOLDS
     K1  the button is on the Reading row, idle, named for the pattern, and
         the Reading carries Source AI's mark
     K2  a press speaks the well's own facts: the name and kind, Built from,
         Feeds, the record line, the offer. No percent, no person's name
     K3  pressed only once the voice plays, then listening, with its label
     K4  a part's name heard is answered about that part, a question about
         the parent is answered with Feeds, anything else gets the fixed line
     K5  none of it reaches the Journal: ST_TEXT and SRC_CHAT do not move
     K6  "release" opens the card and starts nothing: no relBegin, the run
         idle, the card's Release on screen, and only then the line saying
         so. The card's own Release press is what begins
     K7  a pin change cuts the voice and closes the microphone
     K8  Talk in the Journal takes the microphone back
     K9  a hyper complex with nothing above it says so, and a super complex
         says it is the top of the chain and never names a parent
    K10  a worked example refuses before anything is spoken or opened
    K11  a voice that fails says so and never opens the microphone; at the
         daily limit the button draws itself at the limit
    K12  the crisis door: the same press, no release offered, and release
         heard opens nothing
    K13  at 390 the button sits inside the screen and over no text

   ADDED 17 NOVEMBER, after an independent audit of the first build found
   four behaviours the summary claimed and nothing held (a build with each one
   removed still read 34 of 34), and four more it got wrong:
    N1  ONE Escape: with the tip showing and the focus in the well, a single
        Escape returns the button to idle, closes the tip, and a line still
        on its way never plays (keyboard and mouse, listening and speaking)
    N2  pressed means playing: aria-pressed reads false while the voice route
        is held open and true only once the audio is playing
    N3  silence ends listening, quietly, after the wait; the wait is shortened
        through window.STKSAY_WAIT_MS, a seam that can only shorten
    N4  a second voice line during the well's line keeps the microphone
        closed, and the well does not cut the line that talked over it
    N5  the closed set: a table of sentences through stkSayIntent, and the
        audit's two sentences through the recogniser: a negated release opens
        nothing, "stop" inside a question ends nothing
    C1  the safety door: the press speaks the Journal's own safe line and
        only that, never greyed, no reading, no release, no microphone after
        it; a door that opens mid conversation is met the same way
    D1  a page opened from a file: the button is off with its reason, a press
        says it through status(), the Journal's voice says the same sentence,
        and no request goes out
    F1  the line on the Reading row while it plays is the line sent to the
        voice, character for character
    F2  for every pattern of every person: the kind is spelled the way the
        Reading row spells it, and no spoken name carries a + or a /

   Checked against known bad cases first, each one a mutant of the real build
   made in scratch (a copy of source.html with one substitution) and run with
   ATUNED_FILE and STKSAY_ONLY. The first build's two: a recogniser that files
   what it hears through srcTurnCommit fails K5, one whose release word calls
   relBegin fails K6. The audit's eleven, M1 to M11, and the mutants made for
   the new checks, M12 onward, are each listed with the check they fail in the
   commit that added them; every one failed its own check and the real build
   passed all. The gate was also run against the build from before the fixes
   (the merge of origin/main, before this change) and went red on the Escape,
   the closed set, the safety door, the file case and the spelling, the five
   defects it was written for.

   STKSAY_ONLY=N1,N2 runs those groups alone (names below, comma separated),
   which is how a mutant is held against the one check it should fail.
   ============================================================ */
const path=require('path');

/* four entries, committed in turn: one entry reads saboteurs, and the
   complexes this gate talks about need the field the four build together
   (measured on this build: four complexes and a hyper complex) */
const STORY=['I am afraid I will be left. When she goes quiet I panic and try to control everything, and my chest goes tight.',
 'I was furious and ashamed when he laughed at me. I wanted to disappear. My jaw clenched and I felt sick and worthless.',
 'I am terrified of failing, so I push harder and never rest. I feel guilty when I stop and I hate myself for being weak.',
 'I felt abandoned and jealous and I lashed out. Then I felt numb and empty and alone, and my stomach knotted.'];
const VOICE=/\.workers\.dev\/v1\/voice\/synthesize/;
const CORS={'access-control-allow-origin':'*','access-control-allow-headers':'authorization, content-type','access-control-allow-methods':'POST, OPTIONS'};

/* the stand-in recogniser. window.__say(text) delivers one final sentence
   to the newest one running, the way the browser hands a finalised turn */
const FAKE_SR=()=>{
 window.__recs=[];
 function SR(){ this.on=false; this.n=0; window.__recs.push(this); }
 SR.prototype.start=function(){ if(this.on)throw new Error('recognition has already started'); this.on=true; };
 SR.prototype.stop=function(){ if(!this.on)return; this.on=false; const s=this; setTimeout(()=>{ if(s.onend)s.onend(); },0); };
 SR.prototype.abort=SR.prototype.stop;
 window.__say=function(t){ const r=window.__recs.filter(x=>x.on).pop(); if(!r||!r.onresult)return false;
  const res=[]; for(let i=0;i<r.n;i++)res.push({0:{transcript:''},isFinal:true,length:1});
  res.push({0:{transcript:t},isFinal:true,length:1}); r.onresult({resultIndex:r.n,results:res}); r.n++; return true; };
 window.SpeechRecognition=SR; window.webkitSpeechRecognition=SR; };

const voiceLog=p=>{ p.voice=[]; p.on('request',r=>{
 if(VOICE.test(r.url())&&r.method()==='POST'){ try{ p.voice.push(JSON.parse(r.postData()).text); }catch(e){ p.voice.push('?'); } } }); };

/* a silent sound of ms milliseconds, 8 bit mono at 8 kHz, long enough for a
   gate to read the button while it is really playing */
const wavOf=ms=>{ const rate=8000,n=Math.round(rate*ms/1000),b=Buffer.alloc(44+n,128);
 b.write('RIFF',0); b.writeUInt32LE(36+n,4); b.write('WAVE',8); b.write('fmt ',12); b.writeUInt32LE(16,16);
 b.writeUInt16LE(1,20); b.writeUInt16LE(1,22); b.writeUInt32LE(rate,24); b.writeUInt32LE(rate,28);
 b.writeUInt16LE(1,32); b.writeUInt16LE(8,34); b.write('data',36); b.writeUInt32LE(n,40); return b; };
/* the voice route, answered by the gate itself: a sound ms long. With hold
   set, the first holdFirst requests wait until release() and every later one
   is answered at once. texts keeps the text of every request, which is the
   sentence the page sent. A route registered on the page wins over the
   guard's (tests/net.js). */
async function voiceRoute(p,o){
 o=o||{}; const h={texts:[], waiting:[], n:0};
 h.release=()=>{ h.waiting.splice(0).forEach(f=>f()); };
 await p.route(VOICE,route=>{
  if(route.request().method()==='OPTIONS')return route.fulfill({status:204,headers:CORS}).catch(()=>{});
  let t=''; try{ t=JSON.parse(route.request().postData()).text; }catch(e){}
  h.texts.push(t); h.n++;
  const go=()=>route.fulfill({status:200,headers:Object.assign({'content-type':'audio/wav'},CORS),body:wavOf(o.ms||1500)}).catch(()=>{});
  if(o.hold&&h.n<=(o.holdFirst||99))h.waiting.push(go); else go(); });
 return h;}
const nodeUntil=async(fn,ms)=>{ const t0=Date.now(); while(!fn()&&Date.now()-t0<(ms||4000))await new Promise(r=>setTimeout(r,40)); return !!fn(); };
const ONLY=(process.env.STKSAY_ONLY||'').split(',').map(x=>x.trim()).filter(Boolean);
const want=n=>!ONLY.length||ONLY.indexOf(n)>=0;
const CRISIS_TEXT='I want to die. I want to kill myself tonight.';
/* the longest a microphone may stay open with nothing heard: a limit this gate
   holds on the product, so a ceiling raised past it fails, and not a copy of the
   product's own number, so a ceiling moved within it does not */
const QUIET_CEILING=15000;

async function open(browser,w,h,FILE,booted,inits){
 const p=await browser.newPage({viewport:{width:w,height:h}});
 await p.addInitScript(FAKE_SR);
 for(const i of (inits||[]))await p.addInitScript(i[0],i[1]);
 p.errs=[]; p.on('pageerror',e=>p.errs.push(String(e.message).slice(0,160)));
 voiceLog(p);
 await p.goto(FILE,{waitUntil:'load'}); await booted(p);
 return p;}
/* the person's own profile, read: a worked example refuses this button by
   ruling, so the flow is held on the own record, with a story committed */
const own=(p,t)=>p.evaluate(t=>{ loadP(0); t.forEach(x=>{ ST_TEXT=x; ST_PARSED=parseStory(x); stCommit(); }); compute();
 setTab(TAB.FIELD); STACK_TAB='cx'; const r=computeSeen(); S.pin=r.cxs[0]||null; render();
 window.__rb=0; const rb=relBegin; relBegin=function(){ window.__rb++; return rb.apply(this,arguments); };
 window.__rp=0; const rp=relPick; relPick=function(){ window.__rp++; return rp.apply(this,arguments); };
 return {cx:r.cxs.length, hy:r.hys.length, pin:S.pin&&S.pin.nm, show:showOnly(), unread:!!r.unread};},t);
const btn=p=>p.evaluate(()=>{ const b=document.getElementById('stksay'), row=b&&b.closest('.stk-sl');
 return b?{say:b.getAttribute('data-say'), label:b.getAttribute('aria-label'), pressed:b.getAttribute('aria-pressed'),
  dis:b.getAttribute('aria-disabled'), tip:b.getAttribute('data-tip'), role:row&&row.getAttribute('data-role'),
  mark:!!(row&&row.querySelector('.src-ai .src-mk')), text:(row&&row.querySelector('span')||{}).textContent||'',
  phase:STK_SAY.phase, status:(document.getElementById('status')||{}).textContent||''}:null;});
const until=async(p,fn,arg,ms)=>{ try{ await p.waitForFunction(fn,arg,{timeout:ms||4000}); return true; }catch(e){ return false; } };
const lastVoice=async(p,n,ms)=>{ const t0=Date.now(); while(p.voice.length<n&&Date.now()-t0<(ms||4000))await p.waitForTimeout(40); return p.voice[n-1]||''; };

async function stkSayGate(browser,FILE,ok,booted){
 /* ---------------- the flow, at 1600, on the own profile ---------------- */
 if(want('flow')){const p=await open(browser,1600,1000,FILE,booted), at='1600: ';
  const s=await own(p,STORY);
  ok(s.cx>0&&!s.show&&!s.unread,'K0: '+at+'the own profile reads a complex to talk about, '+JSON.stringify(s));
  if(!(s.cx>0)){ await p.close(); return; }
  const wait0=await p.evaluate(()=>STK_SAY_WAIT);
  ok(wait0>0&&wait0<=QUIET_CEILING,'K0: '+at+'with no seam set, an open microphone with nothing heard closes within '+QUIET_CEILING+' ms (the ceiling this gate holds, not a copy of the product\'s own number), '+wait0);
  await p.waitForTimeout(200);
  const b0=await btn(p);
  ok(!!b0&&b0.say==='idle'&&b0.role==='reading'&&b0.label==='Hear Source AI read '+s.pin&&b0.pressed==='false',
   'K1: '+at+'the button sits on the Reading row, idle and named for the pattern, '+JSON.stringify(b0&&{say:b0.say,label:b0.label,role:b0.role}));
  ok(!!b0&&b0.mark,'K1: '+at+'the Reading carries Source AI\'s mark');
  ok(!!b0&&b0.tip&&b0.tip.length<=60&&b0.tip.split(/[.!?]\s/).length===1&&/\.$/.test(b0.tip),
   'K1: '+at+'its meaning on hover and tap is one short sentence, '+JSON.stringify(b0&&b0.tip));
  const before=await p.evaluate(()=>({t:ST_TEXT, chat:SRC_CHAT.length, name:(CURP.who&&CURP.who.first)||''}));
  await p.click('#stksay');
  const line=await lastVoice(p,1);
  ok(/^You picked .+\. It is a complex\. It is built from .+\. (It feeds .+, a hyper-complex\.|Nothing above it is running\.)/.test(line),
   'K2: '+at+'the press speaks the well\'s own facts in order, '+JSON.stringify(line.slice(0,160)));
  ok(/Ask me about it, or say release to open it\.$/.test(line),'K2: '+at+'and ends on the offer, '+JSON.stringify(line.slice(-60)));
  ok(!/%|\d/.test(line)&&!(before.name&&line.indexOf(before.name)>=0),'K2: '+at+'no percent, no figure and no name in the line');
  ok(!/ \+ /.test(line)&&!/hyper complex|super complex/.test(line),'F2: '+at+'no plus in a spoken name, and the kind is hyphenated as the row spells it');
  const heard=await until(p,()=>STK_SAY.phase==='listen');
  const b1=await btn(p);
  ok(heard&&b1.label==='Listening. Press to stop.'&&b1.pressed==='true'&&b1.say==='listen',
   'K3: '+at+'once the line has played the button listens, pressed, '+JSON.stringify(b1&&{say:b1.say,label:b1.label,pressed:b1.pressed}));
  /* a part's name */
  const part=await p.evaluate(()=>{const o=insightPick(S.pin,computeSeen()); return o.parts[0].nm;});
  await p.evaluate(t=>window.__say('tell me about '+t),part);
  const l2=await lastVoice(p,2);
  ok(l2.indexOf(part+' is a saboteur.')===0,'K4: '+at+'a part\'s name heard is answered about that part, '+JSON.stringify(l2.slice(0,120)));
  await until(p,()=>STK_SAY.phase==='listen');
  await p.evaluate(()=>window.__say('what does it feed'));
  const l3=await lastVoice(p,3);
  ok(/^(It feeds .+, a hyper-complex\.|Nothing above it is running\.)/.test(l3),'K4: '+at+'a question about the parent is answered with Feeds, '+JSON.stringify(l3.slice(0,80)));
  await until(p,()=>STK_SAY.phase==='listen');
  await p.evaluate(()=>window.__say('why did this start when I was young'));
  const l4=await lastVoice(p,4);
  ok(l4.indexOf('I can only say what this reading holds.')===0,'K4: '+at+'anything else gets the fixed line, '+JSON.stringify(l4));
  const mid=await p.evaluate(()=>({t:ST_TEXT, chat:SRC_CHAT.length}));
  ok(mid.t===before.t&&mid.chat===before.chat,'K5: '+at+'nothing said to the button reaches the Journal, '+JSON.stringify({text:mid.t===before.t,chat:[before.chat,mid.chat]}));
  /* release */
  await until(p,()=>STK_SAY.phase==='listen');
  await p.evaluate(()=>window.__say('release'));
  const l5=await lastVoice(p,5);
  const rel=await p.evaluate(()=>({open:RUN.open, phase:RUN.phase, rb:window.__rb, go:!!document.getElementById('relgo'), q:RUN.pick.length}));
  ok(rel.open&&rel.phase==='idle'&&rel.rb===0&&rel.go&&rel.q>0,'K6: '+at+'release heard opens the card and starts nothing, '+JSON.stringify(rel));
  ok(l5==='The release is open. Press Release when you are ready.','K6: '+at+'and says so only once the card is open, '+JSON.stringify(l5));
  await until(p,()=>STK_SAY.phase==='idle');
  const ended=await p.evaluate(()=>({phase:STK_SAY.phase, recs:window.__recs.filter(x=>x.on).length}));
  ok(ended.phase==='idle'&&ended.recs===0,'K6: '+at+'then the button lets go of the voice and the microphone, '+JSON.stringify(ended));
  await p.click('#relgo');
  const begun=await p.evaluate(()=>({rb:window.__rb, phase:RUN.phase}));
  ok(begun.rb===1&&begun.phase!=='idle','K6: '+at+'the card\'s own Release press is what begins, '+JSON.stringify(begun));
  await p.evaluate(()=>{ try{ relClose(); }catch(e){} STACK_TAB='cx'; render(); });
  /* the cut on a pin change */
  await p.click('#stksay'); await until(p,()=>STK_SAY.phase==='listen');
  const cut=await p.evaluate(()=>{ const r=computeSeen(); S.pin=r.cxs[1]||r.sabs[0]; STACK_TAB=S.pin.kind; render();
   return {phase:STK_SAY.phase, recs:window.__recs.filter(x=>x.on).length};});
  ok(cut.phase==='idle'&&cut.recs===0,'K7: '+at+'a pin change cuts the voice and closes the microphone, '+JSON.stringify(cut));
  /* Talk in the Journal */
  await p.evaluate(()=>{ STACK_TAB='cx'; S.pin=computeSeen().cxs[0]; render(); });
  await p.click('#stksay'); await until(p,()=>STK_SAY.phase==='listen');
  const tk=await p.evaluate(()=>{ stMic(); return {phase:STK_SAY.phase, journal:!!ST_LISTEN, recs:window.__recs.filter(x=>x.on).length};});
  ok(tk.phase==='idle'&&tk.journal&&tk.recs===1,'K8: '+at+'Talk takes the microphone back, one recogniser running, '+JSON.stringify(tk));
  await p.evaluate(()=>{ stMic(); });
  /* K9: a hyper complex with nothing above it, spoken */
  const hy=await p.evaluate(()=>{ const r=computeSeen(); const h=r.hys.filter(x=>!railStkParent(x,r,(insightTrace(x)||{}).parents))[0];
   if(!h)return null; STACK_TAB='hy'; S.pin=h; render(); return h.nm;});
  if(hy){ const n=p.voice.length; await p.click('#stksay'); const lh=await lastVoice(p,n+1);
   ok(lh.indexOf('Nothing above it is running.')>0&&!/It feeds/.test(lh),'K9: '+at+'a hyper complex with nothing above it says so, '+JSON.stringify(lh.slice(0,140)));
   await p.click('#stksay'); }
  else ok(true,'K9: '+at+'no unparented hyper complex in this reading, held on the example below');
  ok(p.errs.length===0,at+'no page errors, '+JSON.stringify(p.errs));
  await p.close();}

 /* ---------------- C1: the safety door ---------------- */
 if(want('crisis')){
  /* the press */
  {const p=await open(browser,1600,1000,FILE,booted), at='1600: ';
   const hv=await voiceRoute(p,{ms:1200});
   await own(p,STORY);
   await p.evaluate(t=>{ ST_TEXT=t; },CRISIS_TEXT);
   const door=await p.evaluate(()=>({safe:stSafe(), line:srcSayNow(), pin:S.pin&&S.pin.nm}));
   ok(door.safe&&/988/.test(door.line),'C1: '+at+'the crisis door stands, and the Journal\'s voice would say '+JSON.stringify(door.line));
   await p.evaluate(()=>render());
   const b0=await btn(p);
   ok(b0.say==='idle'&&b0.dis===null&&!/read/i.test(b0.label)&&!/read/i.test(b0.tip),
    'C1: '+at+'the button is not greyed and promises no reading, '+JSON.stringify({say:b0.say,dis:b0.dis,label:b0.label,tip:b0.tip}));
   await p.click('#stksay');
   await nodeUntil(()=>hv.n>=1);
   const l=hv.texts[0]||'';
   ok(l===door.line,'C1: '+at+'the press speaks the Journal\'s own safe line, word for word, '+JSON.stringify(l));
   ok(!l.split(' ').some(w=>door.pin.split(' ').indexOf(w)>=0&&w.length>3)&&!/release|complex|saboteur|picked/i.test(l),
    'C1: '+at+'and no pattern and no release in it');
   await until(p,()=>STK_SAY.phase==='speak');
   const row=await p.evaluate(()=>{ const e=document.querySelector('#stkwell .stk-sl[data-role=reading] .src-ai'); return e?e.textContent:null; });
   ok(row===l,'F1: '+at+'the safe line on the row is the line sent to the voice, '+JSON.stringify(row));
   await until(p,()=>STK_SAY.phase==='idle',5000);
   const after=await p.evaluate(()=>({recs:window.__recs.length, open:RUN.open, rp:window.__rp, rb:window.__rb, phase:STK_SAY.phase,
    modal:!!document.querySelector('[role=alertdialog],dialog[open]')}));
   ok(after.phase==='idle'&&after.recs===0&&!after.open&&after.rp===0&&after.rb===0&&!after.modal,
    'C1: '+at+'after it the microphone was never opened, no release was offered and there is no modal, '+JSON.stringify(after));
   await p.close();}
  /* the door opens while the button is listening */
  {const p=await open(browser,1600,1000,FILE,booted), at='1600: mid conversation: ';
   const hv=await voiceRoute(p,{ms:800});
   await own(p,STORY);
   await p.click('#stksay'); await until(p,()=>STK_SAY.phase==='listen');
   await p.evaluate(t=>{ ST_TEXT=t; },CRISIS_TEXT);
   await p.evaluate(()=>window.__say('release'));
   await nodeUntil(()=>hv.n>=2);
   const door=await p.evaluate(()=>srcSayNow());
   ok(hv.texts[1]===door,'C1: '+at+'a door that opened is met with the safe line, whatever was said, '+JSON.stringify(hv.texts[1]));
   await until(p,()=>STK_SAY.phase==='idle',5000);
   const after=await p.evaluate(()=>({open:RUN.open, rp:window.__rp, rb:window.__rb, on:window.__recs.filter(x=>x.on).length}));
   ok(!after.open&&after.rp===0&&after.rb===0&&after.on===0,'C1: '+at+'release heard opens nothing and the microphone is closed after it, '+JSON.stringify(after));
   await p.close();}}

 /* ---------------- the voice fails ---------------- */
 if(want('fails'))for(const [code,want2] of [[500,/Source AI could not speak that line\. Try again in a moment\./],[429,/The voice has reached today's limit\./]]){
  const p=await open(browser,1600,1000,FILE,booted), at='1600: '+code+': ';
  await p.route(VOICE,route=>route.request().method()==='OPTIONS'?route.fulfill({status:204,headers:CORS}):route.fulfill({status:code,headers:CORS,body:'{}'}));
  await own(p,STORY);
  await p.click('#stksay');
  await until(p,()=>STK_SAY.phase==='idle'&&/could not speak/.test((document.getElementById('status')||{}).textContent||''));
  const b=await btn(p);
  const recs=await p.evaluate(()=>window.__recs.length);
  ok(want2.test(b.status)&&b.phase==='idle'&&recs===0,'K11: '+at+'a failed voice says so and never opens the microphone, '+JSON.stringify({status:b.status,phase:b.phase,recs}));
  if(code===429)ok(b.say==='limit'&&b.dis==='true'&&/today's limit/.test(b.tip),'K11: '+at+'and the button draws itself at the limit, '+JSON.stringify({say:b.say,tip:b.tip}));
  await p.close();}

 /* ---------------- the worked example, and the super complex ---------------- */
 if(want('example')){const p=await open(browser,1600,1000,FILE,booted), at='1600: ';
  const ex=await p.evaluate(()=>{ let best=-1,n=-1;
   for(let i=0;i<PEOPLE.length;i++){ if(PEOPLE[i].you)continue; loadP(i); const k=computeSeen().sups.length; if(k>n){n=k;best=i;} }
   loadP(best); setTab(TAB.FIELD); STACK_TAB='sup'; const r=computeSeen(); S.pin=r.sups[0]; render();
   window.__rp=0; const rp=relPick; relPick=function(){ window.__rp++; return rp.apply(this,arguments); };
   return {show:showOnly(), sup:S.pin&&S.pin.nm, line:S.pin?stkSayLine(S.pin,r):''};});
  ok(ex.show&&!!ex.sup,'K10: '+at+'a worked example with a super complex is open, '+JSON.stringify({show:ex.show,sup:ex.sup}));
  ok(ex.line.indexOf('It is a super-complex.')>0&&ex.line.indexOf('Nothing sits above it. It is the top of the chain.')>0&&!/It feeds/.test(ex.line)&&!/ \/ /.test(ex.line),
   'K9: '+at+'a super complex says it is the top of the chain, names no parent and carries no slash, '+JSON.stringify(ex.line.slice(0,160)));
  const b0=await btn(p);
  ok(b0&&b0.say==='show'&&b0.dis==='true','K10: '+at+'the button is drawn greyed with its reason, '+JSON.stringify(b0&&{say:b0.say,tip:b0.tip}));
  /* force: aria-disabled reads to Playwright as not enabled, and a greyed
     button is still pressed by a person, to learn why it is grey */
  await p.click('#stksay',{force:true}); await p.waitForTimeout(400);
  const b1=await btn(p);
  ok(p.voice.length===0&&b1.phase==='idle'&&/A worked example shows every reading and runs nothing\./.test(b1.status),
   'K10: '+at+'a press speaks nothing and says why, '+JSON.stringify({voice:p.voice.length,status:b1.status}));
  ok(await p.evaluate(()=>window.__rp===0&&!RUN.open),'K10: '+at+'and opens no release');
  await p.close();}

 /* ---------------- 390 ---------------- */
 if(want('phone')){const p=await open(browser,390,844,FILE,booted), at='390: ';
  await own(p,STORY);
  await p.evaluate(()=>{ const w=document.getElementById('stkwell'); if(w&&w.scrollIntoView)w.scrollIntoView({block:'start'}); });
  await p.waitForTimeout(300);
  const g=await p.evaluate(()=>{ const b=document.getElementById('stksay'); if(!b)return null;
   const r=b.getBoundingClientRect(), row=b.closest('.stk-sl'), sp=row.querySelector('span').getBoundingClientRect(),
    lb=row.querySelector('b').getBoundingClientRect();
   const hit=(a,c)=>a.left<c.right-1&&c.left<a.right-1&&a.top<c.bottom-1&&c.top<a.bottom-1;
   return {w:r.width,h:r.height,left:r.left,right:r.right,vw:innerWidth,overSpan:hit(r,sp),overLabel:hit(r,lb),
    scroll:document.documentElement.scrollWidth>innerWidth};});
  ok(!!g&&g.w>=44&&g.h>=44&&g.left>=0&&g.right<=g.vw&&!g.overSpan&&!g.overLabel&&!g.scroll,
   'K13: '+at+'the button is a full tap target inside the screen, over no text, '+JSON.stringify(g));
  await p.click('#stksay');
  const l=await lastVoice(p,1);
  ok(/^You picked /.test(l),'K13: '+at+'and a press there speaks, '+JSON.stringify(l.slice(0,60)));
  ok(p.errs.length===0,at+'no page errors, '+JSON.stringify(p.errs));
  await p.close();}

 /* ---------------- N1: ONE ESCAPE ---------------- */
 if(want('N1'))for(const how of ['keyboard, listening','mouse, listening','keyboard, speaking']){
  const p=await open(browser,1600,1000,FILE,booted), at='1600: '+how+': ';
  const speaking=/speaking/.test(how), hv=await voiceRoute(p,{hold:speaking,ms:1500});
  await own(p,STORY);
  if(/keyboard/.test(how)){ await p.focus('#stksay'); await p.keyboard.press('Enter'); } else await p.click('#stksay');
  if(speaking)await nodeUntil(()=>hv.n>=1);
  const reached=await until(p,speaking?()=>STK_SAY.phase==='speak':()=>STK_SAY.phase==='listen');
  await p.waitForTimeout(250);
  const pre=await p.evaluate(()=>{ const a=document.activeElement; return {tip:!!document.querySelector('#tip.on'),
   inWell:!!(a&&a.closest&&a.closest('#stkwell')), phase:STK_SAY.phase}; });
  ok(reached&&pre.tip&&pre.inWell,'N1: '+at+'before the key the button is in use, its tip is showing and the focus is in the well, '+JSON.stringify(pre));
  await p.keyboard.press('Escape'); await p.waitForTimeout(250);
  const post=await p.evaluate(()=>{ const b=document.getElementById('stksay'); return {phase:STK_SAY.phase, recs:window.__recs.filter(x=>x.on).length,
   tip:!!document.querySelector('#tip.on'), pressed:b&&b.getAttribute('aria-pressed'), say:b&&b.getAttribute('data-say')}; });
  ok(post.phase==='idle'&&post.recs===0&&!post.tip&&post.pressed==='false'&&post.say==='idle',
   'N1: '+at+'ONE Escape cuts the button and closes the tip, '+JSON.stringify(post));
  if(speaking){ hv.release(); await p.waitForTimeout(500);
   const late=await p.evaluate(()=>({phase:STK_SAY.phase, el:!!SRC_VOICE.el, recs:window.__recs.length}));
   ok(late.phase==='idle'&&!late.el&&late.recs===0,'N1: '+at+'and the line still on its way never plays and never opens the microphone, '+JSON.stringify(late)); }
  await p.close();}

 /* ---------------- N2: PRESSED MEANS PLAYING, and F1 ---------------- */
 if(want('N2')){const p=await open(browser,1600,1000,FILE,booted), at='1600: ';
  const hv=await voiceRoute(p,{hold:true,holdFirst:1,ms:2500});
  await own(p,STORY);
  await p.click('#stksay'); await nodeUntil(()=>hv.n>=1); await until(p,()=>STK_SAY.phase==='speak');
  const held=await p.evaluate(()=>{ const b=document.getElementById('stksay'); return {say:b.getAttribute('data-say'), pressed:b.getAttribute('aria-pressed'),
   label:b.getAttribute('aria-label'), playing:STK_SAY.playing, el:!!SRC_VOICE.el}; });
  ok(held.say==='speak'&&held.pressed==='false'&&!held.playing&&!held.el,
   'N2: '+at+'with the voice route held open the button is working and not pressed, '+JSON.stringify(held));
  const row=await p.evaluate(()=>{ const e=document.querySelector('#stkwell .stk-sl[data-role=reading] .src-ai'); return e?e.textContent:null; });
  ok(row!==null&&row===hv.texts[0]&&row.length>40,'F1: '+at+'the line on the row is the line sent to the voice, character for character, '+JSON.stringify((row||'').slice(0,90)));
  hv.release();
  const on=await until(p,()=>{ const b=document.getElementById('stksay'); return b&&b.getAttribute('aria-pressed')==='true'; });
  const playing=await p.evaluate(()=>({say:document.getElementById('stksay').getAttribute('data-say'), playing:STK_SAY.playing, el:!!(SRC_VOICE.el&&!SRC_VOICE.el.paused)}));
  ok(on&&playing.say==='speak'&&playing.playing&&playing.el,'N2: '+at+'and pressed only once the audio is playing, '+JSON.stringify(playing));
  await p.click('#stksay'); await p.waitForTimeout(150);
  await p.close();}

 /* ---------------- N3: SILENCE ENDS LISTENING ---------------- */
 if(want('N3')){
  {const p=await open(browser,1600,1000,FILE,booted,[[()=>{ window.STKSAY_WAIT_MS=600; }]]), at='1600: ';
   await own(p,STORY);
   const w=await p.evaluate(()=>STK_SAY_WAIT);
   ok(w===600,'N3: '+at+'the seam shortens the wait, read once at load, '+w);
   await p.click('#stksay'); await until(p,()=>STK_SAY.phase==='listen'); const t0=Date.now();
   const st0=(await btn(p)).status;
   const ended=await until(p,()=>STK_SAY.phase==='idle',3000); const dt=Date.now()-t0;
   const b=await btn(p), recs=await p.evaluate(()=>window.__recs.filter(x=>x.on).length);
   ok(ended&&dt>=350&&dt<2600&&b.pressed==='false'&&b.say==='idle'&&recs===0&&b.status===st0,
    'N3: '+at+'with nothing heard, listening ends by itself, quietly, '+JSON.stringify({ended,ms:dt,pressed:b.pressed,say:b.say,recs,statusChanged:b.status!==st0}));
   await p.close();}
  {const p=await open(browser,1600,1000,FILE,booted,[[()=>{ window.STKSAY_WAIT_MS=1e9; }]]), at='1600: ';
   const w=await p.evaluate(()=>STK_SAY_WAIT);
   ok(w>0&&w<=QUIET_CEILING,'N3: '+at+'the seam can only shorten, a long value leaves the ceiling in place, '+w);
   await p.close();}}

 /* ---------------- N4: A SECOND LINE DURING THE WELL'S LINE ---------------- */
 if(want('N4')){const p=await open(browser,1600,1000,FILE,booted), at='1600: ';
  const hv=await voiceRoute(p,{ms:3000});
  await own(p,STORY);
  await p.click('#stksay'); await until(p,()=>STK_SAY.playing);
  await p.evaluate(()=>{ stSrcSpeak('A second line, from the Journal.'); });
  await p.waitForTimeout(900);
  const s=await p.evaluate(()=>({phase:STK_SAY.phase, recsEver:window.__recs.length, second:!!(SRC_VOICE.el&&!SRC_VOICE.el.paused),
   pressed:(document.getElementById('stksay')||{getAttribute(){return null;}}).getAttribute('aria-pressed')}));
  ok(hv.n===2&&s.phase==='idle'&&s.recsEver===0&&s.pressed==='false','N4: '+at+'a second voice line during the well\'s line keeps the microphone closed, '+JSON.stringify(Object.assign({requests:hv.n},s)));
  ok(s.second,'N4: '+at+'and the well does not cut the line that talked over it, '+JSON.stringify({second:s.second}));
  await p.close();}

 /* ---------------- D1: A PAGE OPENED FROM A FILE ---------------- */
 if(want('D1')){const p=await open(browser,1600,1000,FILE,booted), at='1600: from disk: ';
  const hv=await voiceRoute(p,{ms:600});
  await own(p,STORY);
  /* every gate runs from file:// with a stand-in for the server, and
     tests/net.js tells the page so; this one is the real file case */
  await p.evaluate(()=>{ SRC_VOICE_STANDIN=false; render(); });
  const env=await p.evaluate(()=>({proto:location.protocol, disk:srcVoiceDisk(), why:srcVoiceWhyNot(),
   cases:[srcVoiceDisk({protocol:'file:',origin:'file://'}), srcVoiceDisk({protocol:'https:',origin:'null'}),
    srcVoiceDisk({protocol:'http:',origin:'http://localhost:8080'}), srcVoiceDisk({protocol:'https:',origin:'https://atuned.world'})]}));
  ok(env.proto==='file:'&&env.disk===true&&JSON.stringify(env.cases)==='[true,true,false,false]',
   'D1: '+at+'a file and an origin of null are the disk, localhost and the hosted copy are not, '+JSON.stringify(env));
  const b0=await btn(p);
  ok(b0.say==='off'&&b0.dis==='true'&&b0.tip===env.why&&/atuned\.world/.test(b0.tip)&&/http:\/\/localhost/.test(b0.tip)&&!/Try again/.test(b0.tip)&&b0.tip.split(/[.!?]\s/).length===1,
   'D1: '+at+'the button is off, and its tip says plainly where Source AI speaks, '+JSON.stringify({say:b0.say,dis:b0.dis,tip:b0.tip}));
  await p.evaluate(()=>{ status('Cleared.','ok'); });
  await p.click('#stksay',{force:true}); await p.waitForTimeout(400);
  const b1=await btn(p), rec1=await p.evaluate(()=>window.__recs.length);
  ok(b1.status===env.why&&!/Try again/.test(b1.status)&&b1.phase==='idle'&&hv.n===0&&rec1===0,
   'D1: '+at+'a press says it through status() and sends nothing, '+JSON.stringify({status:b1.status,phase:b1.phase,requests:hv.n,recs:rec1}));
  await p.evaluate(()=>{ status('Cleared.','ok'); stSrcSpeak('A line for the Journal.'); }); await p.waitForTimeout(400);
  const j=await p.evaluate(()=>(document.getElementById('status')||{}).textContent||'');
  ok(j===env.why&&hv.n===0,'D1: '+at+'the Journal\'s own voice says the same sentence and sends nothing, '+JSON.stringify({status:j,requests:hv.n}));
  await p.close();}

 /* ---------------- F2: EVERY PATTERN OF EVERY PERSON, and N5: THE CLOSED SET ---------------- */
 if(want('sweep')||want('N5')){const p=await open(browser,1600,1000,FILE,booted), at='1600: ';
  if(want('sweep')){
   const sw=await p.evaluate(()=>{ const KW={sab:'a saboteur',cx:'a complex',hy:'a hyper-complex',sup:'a super-complex'};
    const ALT=/(a saboteur|a complex|a hyper[- ]complex|a super[- ]complex)/; const bad=[]; let n=0,longest=0; const kinds={}; Object.keys(STK_LIST).forEach(k=>{ kinds[k]=0; });
    for(let i=0;i<PEOPLE.length;i++){ loadP(i); compute(); const r=computeSeen();
     for(const k of Object.keys(STK_LIST))for(const o of (r[STK_LIST[k]]||[])){ n++; kinds[k]++;
      const line=stkSayLine(o,r), box=document.createElement('div'); box.innerHTML=insightSay({kind:o.kind,nm:o.nm},r);
      const rt=box.textContent, lk=(new RegExp('^You picked .*?\\. It is '+ALT.source+'\\.').exec(line)||[])[1], rk=(new RegExp(', '+ALT.source+'\\.').exec(rt)||[])[1];
      longest=Math.max(longest,line.length);
      /* the record's own sentences are quoted as the record has them, and one
         of them carries a slash between three ways of saying it; a NAME is
         what must be plain, so the record's part is taken out first */
      const names=line.split(insightSpeak(o,r)).join('');
      if(lk!==KW[k]||rk!==KW[k]||/ [+\/] /.test(names)||/hyper complex|super complex/.test(line))bad.push({person:i,kind:k,nm:o.nm,line:lk,row:rk});}}
    return {n,kinds,people:PEOPLE.length,bad:bad.slice(0,4),nbad:bad.length,longest}; });
   ok(Object.keys(sw.kinds).every(k=>sw.kinds[k]>0)&&sw.nbad===0,'F2: '+at+'every pattern of every person, '+sw.n+' of them ('+JSON.stringify(sw.kinds)+') across '+sw.people+' people, none of the four kinds empty: the kind is spelled as the Reading row spells it and no name carries a plus or a slash, '+JSON.stringify(sw.nbad?sw.bad:{longestLine:sw.longest}));}
  if(want('N5')){
   const POS=['release','Release.','release it','release this','okay release it','yes release it',"let's release it",'I want to release it','run the protocol','run it','please run the protocol','release it now'];
   const NEG=["don't release","do not release",'not release','never release it',"I don't want to release it yet",'I do not want to release this',
    "I won't release it","why can't I release it",'what does release mean','how do I release this','can you release it','I tried to release it before and it did not work'];
   const STOP=['stop','Stop.','stop it','stop please','okay stop',"that's all",'that is all','nothing else','no thanks','stop talking about it'];
   const KEEP=["why can't I stop controlling everything",'how do I stop doing this','what happens when I stop',"I can't stop it",'tell me why I never stop','will it ever stop','is this the reason I cannot stop'];
   const t=await p.evaluate(T=>{ const bad=[]; const chk=(list,want)=>list.forEach(x=>{ const g=stkSayIntent(x); if(g!==want)bad.push(want+' <- '+JSON.stringify(x)+' gave '+JSON.stringify(g)); }); chk(T.POS,'release'); chk(T.NEG,''); chk(T.STOP,'stop'); chk(T.KEEP,''); return bad; },{POS,NEG,STOP,KEEP});
   const n=POS.length+NEG.length+STOP.length+KEEP.length;
   ok(t.length===0,'N5: '+at+'a command is the whole utterance, '+n+' sentences through the matcher: '+POS.length+' release, '+NEG.length+' negated or asked, '+STOP.length+' stop, '+KEEP.length+' with stop inside a sentence, '+JSON.stringify(t)); }
  await p.close();}

 /* ---------------- N5: the audit's two sentences, through the recogniser ---------------- */
 if(want('N5'))for(const [say,what] of [["I don't want to release it yet",'a negated release opens nothing'],["why can't I stop controlling everything",'stop inside a question ends nothing']]){
  const p=await open(browser,1600,1000,FILE,booted), at='1600: ';
  const hv=await voiceRoute(p,{ms:600});
  await own(p,STORY);
  await p.click('#stksay'); await until(p,()=>STK_SAY.phase==='listen'); const n0=hv.n;
  await p.evaluate(t=>window.__say(t),say);
  await nodeUntil(()=>hv.n>n0);
  await until(p,()=>STK_SAY.phase==='listen',4000);
  const r=await p.evaluate(()=>({open:RUN.open, rp:window.__rp, rb:window.__rb, phase:STK_SAY.phase}));
  ok(!r.open&&r.rp===0&&r.rb===0&&hv.n===n0+1&&(hv.texts[n0]||'').indexOf('I can only say what this reading holds.')===0&&r.phase==='listen',
   'N5: '+at+what+', and the one fixed line is spoken, '+JSON.stringify({heard:say,open:r.open,rp:r.rp,line:(hv.texts[n0]||'').slice(0,50),phase:r.phase}));
  await p.close();}
}

module.exports={stkSayGate};

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
  const browser=await chromium.launch({executablePath:process.env.CHROME||chromium.executablePath(),
   args:['--autoplay-policy=no-user-gesture-required']});
  require('./net.js').guardBrowser(browser);
  const {FULL_SIGHT}=require('./seed.js');
  browser.newPage=(orig=>async function(...a){const pg=await orig.apply(this,a); await pg.addInitScript(FULL_SIGHT); return pg;})(browser.newPage);
  console.log('\n=== the Insight well talks ===');
  try{ await stkSayGate(browser,FILE,ok,booted); }
  catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
