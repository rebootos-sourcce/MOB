/* ============================================================
   SOURCE AI TALKS ON THE SUMMARY, IN PLACE. node tests/sumtalk.js

   The owner, 27 November: "I also want my Source AI button here so I can
   press it and have Source AI talk to me about this stuff... that shouldn't
   take me to a brand new page. That should be a little button that activates
   source as a conversational AI on that page." ui/sumtalk.js is the button;
   DECISIONS.md, "The Summary is who I am today and what Source AI is seeing",
   is the ruling. Built on tests/stksay.js's harness: the voice route is
   answered by tests/net.js, so the real authVoice and the real stSrcSpeak run,
   and a stand-in recogniser lets the gate say words to the page.

   WHAT IT HOLDS
     T1  the name is top left and the button top right, on one line, the
         Reading sits directly under them, no right rail, and the rail's old
         #sumhello is gone
     T2  a press stays on the Summary and speaks the opening: the first
         sentence of each Reading paragraph, then the offer; the panel shows it
         marked as Source AI's; the button listens
     T3  "what is my root" is answered with the stack, no percent spoken
     T4  body, energy and blueprint answer with that paragraph, capped; anything
         else gets the one fixed line; stop ends it
     T5  NOTHING IS WRITTEN: ST_TEXT, SRC_CHAT and the journal entries do not
         move however much is said
     T6  leaving the Summary ends it and empties the panel; so does another
         profile
     T7  refusals: nothing read says so and speaks nothing; a worked example
         refuses; the safety door speaks the Journal's own line and only that
     T8  one microphone: the Journal's Talk takes it back

   CHECKED AGAINST A KNOWN BAD CASE FIRST. SUMTALK_MUTANT=journal runs the page
   from a copy where a heard sentence is filed into ST_TEXT, and T5 must fail;
   =jump makes the press leave for Discover, and T2 must fail. ATUNED_FILE
   points at the copy.
   ============================================================ */
const path=require('path');
const STORY=['I am afraid I will be left. When she goes quiet I panic and try to control everything, and my chest goes tight.',
 'I was furious and ashamed when he laughed at me. I wanted to disappear. My jaw clenched and I felt sick and worthless.',
 'I am terrified of failing, so I push harder and never rest. I feel guilty when I stop and I hate myself for being weak.',
 'I felt abandoned and jealous and I lashed out. Then I felt numb and empty and alone, and my stomach knotted.'];
const VOICE=/\.workers\.dev\/v1\/voice\/synthesize/;
const CORS={'access-control-allow-origin':'*','access-control-allow-headers':'authorization, content-type','access-control-allow-methods':'POST, OPTIONS'};
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
const wavOf=ms=>{ const rate=8000,n=Math.round(rate*ms/1000),b=Buffer.alloc(44+n,128);
 b.write('RIFF',0); b.writeUInt32LE(36+n,4); b.write('WAVE',8); b.write('fmt ',12); b.writeUInt32LE(16,16);
 b.writeUInt16LE(1,20); b.writeUInt16LE(1,22); b.writeUInt32LE(rate,24); b.writeUInt32LE(rate,28);
 b.writeUInt16LE(1,32); b.writeUInt16LE(8,34); b.write('data',36); b.writeUInt32LE(n,40); return b; };
async function voiceRoute(p,ms){
 const h={texts:[]};
 await p.route(VOICE,route=>{
  if(route.request().method()==='OPTIONS')return route.fulfill({status:204,headers:CORS}).catch(()=>{});
  let t=''; try{ t=JSON.parse(route.request().postData()).text; }catch(e){}
  h.texts.push(t);
  route.fulfill({status:200,headers:Object.assign({'content-type':'audio/wav'},CORS),body:wavOf(ms||900)}).catch(()=>{}); });
 return h;}
const nodeUntil=async(fn,ms)=>{ const t0=Date.now(); while(!fn()&&Date.now()-t0<(ms||5000))await new Promise(r=>setTimeout(r,40)); return !!fn(); };
const until=async(p,fn,arg,ms)=>{ try{ await p.waitForFunction(fn,arg,{timeout:ms||5000}); return true; }catch(e){ return false; } };
const CRISIS_TEXT='I want to die. I want to kill myself tonight.';

async function open(browser,w,h,FILE,booted){
 const p=await browser.newPage({viewport:{width:w,height:h}});
 await p.addInitScript(FAKE_SR);
 p.errs=[]; p.on('pageerror',e=>p.errs.push(String(e.message).slice(0,160)));
 p.hv=await voiceRoute(p,900);
 await p.goto(FILE,{waitUntil:'load'}); await booted(p);
 return p;}
/* the own profile, read, on the Summary */
const own=(p,t)=>p.evaluate(t=>{ loadP(0); t.forEach(x=>{ ST_TEXT=x; ST_PARSED=parseStory(x); stCommit(); }); compute();
 setTab(TAB.SUMMARY); render();
 window.__j0={t:ST_TEXT, chat:SRC_CHAT.length, ent:(CURP.story.entries||[]).length};
 return {unread:!!computeSeen().unread, tab:S.tab};},t);
const state=p=>p.evaluate(()=>({phase:SUM_TALK.phase, turns:SUM_TALK.turns.length, tab:S.tab,
 recs:window.__recs.filter(x=>x.on).length,
 btn:(document.getElementById('sumtalkb')||{}).getAttribute?document.getElementById('sumtalkb').getAttribute('data-talk'):null,
 pressed:(document.getElementById('sumtalkb')||{getAttribute(){return null;}}).getAttribute('aria-pressed'),
 panel:(document.getElementById('sumtalk')||{}).innerText||'',
 marks:document.querySelectorAll('#sumtalk .src-ai .src-mk').length, me:document.querySelectorAll('#sumtalk .me').length,
 status:(document.getElementById('status')||{}).textContent||'',
 log:(typeof MSG_LOG!=='undefined'?MSG_LOG.slice(-4).map(m=>m.msg).join(' | '):'')}));
const journal=p=>p.evaluate(()=>({t:ST_TEXT, chat:SRC_CHAT.length, ent:(CURP.story.entries||[]).length}));

async function sumTalkGate(browser,FILE,ok,booted){
 {const p=await open(browser,1600,1000,FILE,booted), at='1600: ';
  const s=await own(p,STORY); await p.waitForTimeout(400);
  ok(!s.unread,'T0: '+at+'the own profile is read, '+JSON.stringify(s));
  const paras=await p.evaluate(()=>sumTalkParas(computeSeen()));
  ok(paras.length===3&&paras.every(x=>x.length>20&&!/<|&[a-z]+;/.test(x)),'T0: '+at+'the Reading is three plain paragraphs the voice reads, '+JSON.stringify(paras.map(x=>x.slice(0,40))));
  /* ---- T1 the layout ---- */
  const g=await p.evaluate(()=>{ const R=id=>{const e=document.getElementById(id);if(!e)return null;const b=e.getBoundingClientRect();return {l:b.left,r:b.right,t:b.top,b:b.bottom,w:b.width,h:b.height};};
   const nm=document.querySelector('#sumbody .s-pname'), rd=document.querySelector('#sumbody .s-readbox'), hd=document.querySelector('#sumbody .sg-name');
   const vis=e=>{if(!e)return false;const s=getComputedStyle(e);const b=e.getBoundingClientRect();return s.display!=='none'&&b.width>0&&b.height>0;};
   const n=nm.getBoundingClientRect(), b=R('sumtalkb'), r=rd.getBoundingClientRect(), h=hd.getBoundingClientRect();
   return {nameL:n.left, btnR:b.r, btnT:b.t, nameT:n.top, headB:h.bottom, readT:r.top, stageL:R('stage').l, stageR:R('stage').r,
    rcol:vis(document.getElementById('rcol')), hello:!!document.getElementById('sumhello'), panelShown:vis(document.getElementById('sumtalk')),
    stack:vis(document.getElementById('sumstack')), oneLine:Math.abs((b.t+b.b)/2-(n.top+n.bottom)/2)<60};});
  ok(g.oneLine&&g.btnR>g.nameL+300,'T1: '+at+'the name is left and the button right, on one line, '+JSON.stringify({nameL:g.nameL,btnR:g.btnR}));
  ok(Math.abs((g.nameL-g.stageL)-(g.stageR-g.btnR))<4,'T1: '+at+'one centred column, equal space either side, '+JSON.stringify({left:g.nameL-g.stageL,right:g.stageR-g.btnR}));
  ok(g.readT-g.headB<60&&!g.panelShown,'T1: '+at+'the Reading sits directly under the name and the panel takes no room until it has turns, gap '+Math.round(g.readT-g.headB));
  ok(!g.rcol&&!g.hello&&g.stack,'T1: '+at+'no right rail, no #sumhello, the stack is on the left, '+JSON.stringify({rcol:g.rcol,hello:g.hello,stack:g.stack}));
  const b0=await state(p);
  ok(b0.btn==='idle'&&b0.pressed==='false','T1: '+at+'the button is idle, '+JSON.stringify({btn:b0.btn,pressed:b0.pressed}));
  /* ---- T2 the press ---- */
  const before=await journal(p);
  await p.click('#sumtalkb');
  await nodeUntil(()=>p.hv.texts.length>=1);
  const line=p.hv.texts[0]||'';
  ok(/^The blueprint you were born on /.test(line)||/^There is no birth data/.test(line),'T2: '+at+'the opening starts on the Reading\'s first sentence, '+JSON.stringify(line.slice(0,70)));
  ok(paras.every(x=>line.indexOf(x.match(/^[^.!?]+[.!?]+/)[0].trim())>=0),'T2: '+at+'and carries the first sentence of every paragraph');
  ok(/Ask about your blueprint, your body, your energy or your stack\.$/.test(line),'T2: '+at+'and ends on the offer, '+JSON.stringify(line.slice(-60)));
  const heard=await until(p,()=>SUM_TALK.phase==='listen');
  const st2=await state(p);
  ok(st2.tab===1&&st2.tab===(await p.evaluate(()=>TAB.SUMMARY))&&/summary/i.test(await p.evaluate(()=>location.hash+document.body.className)),'T2: '+at+'it stays on the Summary, '+JSON.stringify({tab:st2.tab}));
  ok(heard&&st2.btn==='listen'&&st2.pressed==='true','T2: '+at+'once played the button listens, pressed, '+JSON.stringify({btn:st2.btn,pressed:st2.pressed}));
  ok(st2.marks===1&&st2.panel.indexOf(line.slice(0,30))>=0,'T2: '+at+'the panel shows the line marked as Source AI\'s, '+JSON.stringify({marks:st2.marks}));
  const g2=await p.evaluate(()=>{const e=document.getElementById('sumtalk').getBoundingClientRect(), h=document.querySelector('#sumbody .sg-name').getBoundingClientRect(), r=document.querySelector('#sumbody .s-readbox').getBoundingClientRect();
   return {gapAbove:e.top-h.bottom, gapBelow:r.top-e.bottom};});
  ok(g2.gapAbove<=32&&g2.gapBelow<=56&&g2.gapAbove>=0,'T2: '+at+'the panel opens right under the name and above the Reading, '+JSON.stringify(g2));
  /* ---- T3 the stack ---- */
  const n0=p.hv.texts.length;
  await p.evaluate(()=>window.__say('what is my root'));
  await nodeUntil(()=>p.hv.texts.length>n0);
  const l3=p.hv.texts[n0]||'';
  const want=await p.evaluate(()=>({roots:ssRoots(spiritual((PEOPLE[S.who]||PEOPLE[0]).nm)||spiritualOf(bornAsBirth(CURP))), doms:S.doms.map(i=>DOMAINS[i].nm), a:S.arcs.map(i=>ARCH[i].nm)}));
  ok(/^Your root is /.test(l3)&&want.roots.every(r=>l3.indexOf(r)>=0)&&l3.indexOf(want.doms[0])>=0&&l3.indexOf(want.a[0])>=0,'T3: '+at+'"what is my root" is answered with the stack, '+JSON.stringify(l3.slice(0,160)));
  ok(!/%|\d/.test(l3),'T3: '+at+'no percent and no figure is spoken');
  await until(p,()=>SUM_TALK.phase==='listen');
  /* ---- T4 the answer set ---- */
  const cases=[['where do I hold it',1],['how is my energy',2],['tell me about my blueprint',0]];
  for(const [say,i] of cases){
   const n=p.hv.texts.length;
   await p.evaluate(t=>window.__say(t),say); await nodeUntil(()=>p.hv.texts.length>n);
   const l=p.hv.texts[n]||'', first=paras[i].match(/^[^.!?]+[.!?]+/)[0].trim();
   ok(l.indexOf(first)===0&&(l.match(/[.!?](\s|$)/g)||[]).length<=4,'T4: '+at+'"'+say+'" is answered with paragraph '+(i+1)+', capped, '+JSON.stringify(l.slice(0,70)));
   await until(p,()=>SUM_TALK.phase==='listen');}
  {const n=p.hv.texts.length;
   await p.evaluate(()=>window.__say('why did this start when I was young')); await nodeUntil(()=>p.hv.texts.length>n);
   ok((p.hv.texts[n]||'').indexOf('I can only say what this reading holds.')===0,'T4: '+at+'anything else gets the fixed line, '+JSON.stringify(p.hv.texts[n]));
   await until(p,()=>SUM_TALK.phase==='listen');}
  const mid=await state(p);
  ok(mid.me===5&&mid.marks>=6,'T4: '+at+'the person\'s words are rows in the panel, '+JSON.stringify({me:mid.me,marks:mid.marks}));
  /* ---- T5 nothing is written ---- */
  const after=await journal(p);
  ok(after.t===before.t&&after.chat===before.chat&&after.ent===before.ent,'T5: '+at+'nothing said reaches the journal: '+JSON.stringify({text:after.t===before.t,chat:[before.chat,after.chat],entries:[before.ent,after.ent]}));
  /* stop ends it */
  await p.evaluate(()=>window.__say('stop')); await until(p,()=>SUM_TALK.phase==='idle');
  const stp=await state(p);
  ok(stp.phase==='idle'&&stp.recs===0,'T4: '+at+'"stop" ends it and closes the microphone, '+JSON.stringify({phase:stp.phase,recs:stp.recs}));
  /* ---- T8 one microphone ---- */
  await p.click('#sumtalkb'); await until(p,()=>SUM_TALK.phase==='listen');
  const tk=await p.evaluate(()=>{ stMic(); return {phase:SUM_TALK.phase, journal:!!ST_LISTEN, recs:window.__recs.filter(x=>x.on).length}; });
  ok(tk.phase==='idle'&&tk.journal&&tk.recs===1,'T8: '+at+'the Journal\'s Talk takes the microphone back, one recogniser running, '+JSON.stringify(tk));
  await p.evaluate(()=>{ stMic(); });
  /* ---- T6 leaving ---- */
  await p.evaluate(()=>setTab(TAB.SUMMARY)); await p.waitForTimeout(200);
  await p.click('#sumtalkb'); await until(p,()=>SUM_TALK.phase==='listen');
  await p.evaluate(()=>setTab(TAB.FIELD)); await p.waitForTimeout(300);
  const lv=await state(p);
  ok(lv.phase==='idle'&&lv.turns===0&&lv.recs===0,'T6: '+at+'leaving the Summary ends it and clears what was said, '+JSON.stringify({phase:lv.phase,turns:lv.turns,recs:lv.recs}));
  await p.evaluate(()=>setTab(TAB.SUMMARY)); await p.waitForTimeout(300);
  const back=await state(p);
  ok(back.panel.trim()===''&&back.me===0,'T6: '+at+'and coming back shows no old conversation');
  await p.click('#sumtalkb'); await until(p,()=>SUM_TALK.phase==='listen');
  await p.evaluate(()=>{ const q=pNew('Someone else'); loadProfile(q); setTab(TAB.SUMMARY); render(); }); await p.waitForTimeout(300);
  const who=await state(p);
  ok(who.phase==='idle'&&who.turns===0&&who.recs===0,'T6: '+at+'another profile ends it too, '+JSON.stringify({phase:who.phase,turns:who.turns}));
  /* ---- T7a nothing read ---- */
  const nv=p.hv.texts.length;
  /* force: aria-disabled reads to Playwright as not enabled, and a greyed
     button is still pressed by a person, to learn why it is grey (the house
     pattern, tests/stksay.js K10) */
  await p.click('#sumtalkb',{force:true});
  await p.waitForTimeout(500);
  const un=await state(p);
  ok(p.hv.texts.length===nv&&un.phase==='idle'&&/Nothing read yet/.test(un.status+' '+un.log),'T7: '+at+'nothing read says so and speaks nothing, '+JSON.stringify({status:un.status.slice(0,60),log:un.log.slice(-80)}));
  ok(p.errs.length===0,at+'no page errors, '+JSON.stringify(p.errs));
  await p.close();}
 /* ---- T7b a worked example ---- */
 {const p=await open(browser,1600,1000,FILE,booted), at='1600: ';
  await p.evaluate(()=>{ loadP(PEOPLE.findIndex(x=>x.nm==='Marcus')); setTab(TAB.SUMMARY); render(); }); await p.waitForTimeout(400);
  await p.click('#sumtalkb',{force:true}); await p.waitForTimeout(500);
  const s=await state(p);
  ok(p.hv.texts.length===0&&s.phase==='idle','T7: '+at+'a worked example refuses before anything is spoken, '+JSON.stringify({phase:s.phase,said:p.hv.texts.length}));
  await p.close();}
 /* ---- T7c the safety door ---- */
 {const p=await open(browser,1600,1000,FILE,booted), at='1600: ';
  await own(p,STORY);
  await p.evaluate(t=>{ ST_TEXT=t; },CRISIS_TEXT);
  const door=await p.evaluate(()=>({safe:stSafe(), line:srcSayNow()}));
  await p.evaluate(()=>render()); await p.waitForTimeout(300);
  await p.click('#sumtalkb');
  await nodeUntil(()=>p.hv.texts.length>=1);
  ok(door.safe&&p.hv.texts[0]===door.line&&/988/.test(door.line),'T7: '+at+'the safety door speaks the Journal\'s own line, word for word, '+JSON.stringify((p.hv.texts[0]||'').slice(0,60)));
  await until(p,()=>SUM_TALK.phase==='idle',6000);
  const s=await state(p);
  ok(s.phase==='idle'&&s.recs===0&&p.hv.texts.length===1,'T7: '+at+'and nothing after it: no reading, no microphone, '+JSON.stringify({phase:s.phase,recs:s.recs,said:p.hv.texts.length}));
  await p.close();}
 /* ---- the phone ---- */
 {const p=await open(browser,390,844,FILE,booted), at='390: ';
  await own(p,STORY); await p.waitForTimeout(300);
  const g=await p.evaluate(()=>{const b=document.getElementById('sumtalkb').getBoundingClientRect(), n=document.querySelector('#sumbody .s-pname').getBoundingClientRect();
   return {w:Math.round(b.width),h:Math.round(b.height),r:b.right,over:document.documentElement.scrollWidth>innerWidth,nameR:n.right,btnL:b.left,
    stackBelow:document.getElementById('sumstack').getBoundingClientRect().top>document.querySelector('#sumbody .s-readbox').getBoundingClientRect().top};});
  ok(g.r<=390&&!g.over&&g.h>=44&&g.nameR<=g.btnL+1,'T1: '+at+'the button is inside the screen, 44 tall and clear of the name, '+JSON.stringify(g));
  ok(g.stackBelow,'T1: '+at+'the stack comes after the Reading');
  await p.close();}
}
module.exports={sumTalkGate};

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
  console.log('\n=== Source AI talks on the Summary ===');
  try{ await sumTalkGate(browser,FILE,ok,booted); }
  catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
