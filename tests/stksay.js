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

   Checked against a known bad case first: a build whose recogniser files
   what it hears through srcTurnCommit fails K5, and one whose release word
   calls relBegin fails K6 (the gate's own header in the commit that added
   it names both runs).
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

async function open(browser,w,h,FILE,booted){
 const p=await browser.newPage({viewport:{width:w,height:h}});
 await p.addInitScript(FAKE_SR);
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
 {const p=await open(browser,1600,1000,FILE,booted), at='1600: ';
  const s=await own(p,STORY);
  ok(s.cx>0&&!s.show&&!s.unread,'K0: '+at+'the own profile reads a complex to talk about, '+JSON.stringify(s));
  if(!(s.cx>0)){ await p.close(); return; }
  await p.waitForTimeout(200);
  const b0=await btn(p);
  ok(!!b0&&b0.say==='idle'&&b0.role==='reading'&&b0.label==='Hear Source AI read '+s.pin&&b0.pressed==='false',
   'K1: '+at+'the button sits on the Reading row, idle and named for the pattern, '+JSON.stringify(b0&&{say:b0.say,label:b0.label,role:b0.role}));
  ok(!!b0&&b0.mark,'K1: '+at+'the Reading carries Source AI\'s mark');
  const before=await p.evaluate(()=>({t:ST_TEXT, chat:SRC_CHAT.length, name:(CURP.who&&CURP.who.first)||''}));
  await p.click('#stksay');
  const line=await lastVoice(p,1);
  ok(/^You picked .+\. It is a complex\. It is built from .+\. (It feeds .+, a hyper complex\.|Nothing above it is running\.)/.test(line),
   'K2: '+at+'the press speaks the well\'s own facts in order, '+JSON.stringify(line.slice(0,160)));
  ok(/Ask me about it, or say release to open it\.$/.test(line),'K2: '+at+'and ends on the offer, '+JSON.stringify(line.slice(-60)));
  ok(!/%|\d/.test(line)&&!(before.name&&line.indexOf(before.name)>=0),'K2: '+at+'no percent, no figure and no name in the line');
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
  ok(/^(It feeds .+, a hyper complex\.|Nothing above it is running\.)/.test(l3),'K4: '+at+'a question about the parent is answered with Feeds, '+JSON.stringify(l3.slice(0,80)));
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

 /* ---------------- the crisis door ---------------- */
 {const p=await open(browser,1600,1000,FILE,booted), at='1600: ';
  await own(p,STORY);
  await p.evaluate(()=>{ ST_TEXT='I want to die. I want to kill myself tonight.'; });
  const safe=await p.evaluate(()=>stSafe());
  ok(safe,'K12: '+at+'the crisis door stands for this check');
  await p.click('#stksay');
  const l=await lastVoice(p,1);
  ok(/^You picked /.test(l)&&!/release/i.test(l),'K12: '+at+'the same line, with no release offered, '+JSON.stringify(l.slice(-60)));
  await until(p,()=>STK_SAY.phase==='listen');
  await p.evaluate(()=>window.__say('release'));
  const l2=await lastVoice(p,2);
  const rel=await p.evaluate(()=>({open:RUN.open, rp:window.__rp, rb:window.__rb}));
  ok(!rel.open&&rel.rp===0&&rel.rb===0&&!/release/i.test(l2),'K12: '+at+'release heard opens nothing, '+JSON.stringify({rel,l2}));
  const look=await p.evaluate(()=>({modal:!!document.querySelector('[role=alertdialog],dialog[open]')}));
  ok(!look.modal,'K12: '+at+'and no modal');
  await p.close();}

 /* ---------------- the voice fails ---------------- */
 for(const [code,want] of [[500,/Source AI could not speak that line\. Try again in a moment\./],[429,/The voice has reached today's limit\./]]){
  const p=await open(browser,1600,1000,FILE,booted), at='1600: '+code+': ';
  await p.route(VOICE,route=>route.request().method()==='OPTIONS'?route.fulfill({status:204,headers:CORS}):route.fulfill({status:code,headers:CORS,body:'{}'}));
  await own(p,STORY);
  await p.click('#stksay');
  await until(p,()=>STK_SAY.phase==='idle'&&/could not speak/.test((document.getElementById('status')||{}).textContent||''));
  const b=await btn(p);
  const recs=await p.evaluate(()=>window.__recs.length);
  ok(want.test(b.status)&&b.phase==='idle'&&recs===0,'K11: '+at+'a failed voice says so and never opens the microphone, '+JSON.stringify({status:b.status,phase:b.phase,recs}));
  if(code===429)ok(b.say==='limit'&&b.dis==='true'&&/today's limit/.test(b.tip),'K11: '+at+'and the button draws itself at the limit, '+JSON.stringify({say:b.say,tip:b.tip}));
  await p.close();}

 /* ---------------- the worked example, and the super complex ---------------- */
 {const p=await open(browser,1600,1000,FILE,booted), at='1600: ';
  const ex=await p.evaluate(()=>{ let best=-1,n=-1;
   for(let i=0;i<PEOPLE.length;i++){ if(PEOPLE[i].you)continue; loadP(i); const k=computeSeen().sups.length; if(k>n){n=k;best=i;} }
   loadP(best); setTab(TAB.FIELD); STACK_TAB='sup'; const r=computeSeen(); S.pin=r.sups[0]; render();
   window.__rp=0; const rp=relPick; relPick=function(){ window.__rp++; return rp.apply(this,arguments); };
   return {show:showOnly(), sup:S.pin&&S.pin.nm, line:S.pin?stkSayLine(S.pin,r):''};});
  ok(ex.show&&!!ex.sup,'K10: '+at+'a worked example with a super complex is open, '+JSON.stringify({show:ex.show,sup:ex.sup}));
  ok(ex.line.indexOf('It is a super complex.')>0&&ex.line.indexOf('Nothing sits above it. It is the top of the chain.')>0&&!/It feeds/.test(ex.line),
   'K9: '+at+'a super complex says it is the top of the chain and names no parent, '+JSON.stringify(ex.line.slice(0,160)));
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
 {const p=await open(browser,390,844,FILE,booted), at='390: ';
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
  const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
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
