/* ============================================================
   THE FEEDBACK TRACKER, GATED. node tests/feedback.js

   2 October, the owner: "I'm going to build feedback. Like customer support
   feedback, comments, questions, bugs. It's a tracker that will be built into
   the app. And the data gets dumped to Discord and then the community work is
   on Discord so there needs to be a doorway to Discord as well."

   Held in his terms, in two halves.

   THE ENGINE, headless, on a private copy so nothing here moves the engine
   tests/engine.js holds. A comment is a kind of its own. The envelope keeps
   its closed key set. A send that answers later (obDrainAsync) never loses
   an entry: not one queued while the request is out, not one behind a
   refusal, and never by two drains at once. Then the same suite runs on
   copies of the engine with each of those rules broken, and must fail on
   every one. A gate that cannot fail is not a gate.

   THE SURFACE, in Chromium, against a stubbed feedback route so no request
   leaves the machine. The route is functions/feedback.js since 3 October and
   the app posts to it by a relative address, which a file has no host for,
   so the gate points FEEDBACK_URL at an absolute stub the way it points
   AUTH_API; tests/discordfeedback.js holds the relative address over http. Help carries comment, question and something broken;
   the sheet switches between them and keeps the text; Send holds the entry
   on the device and says held when the server is down, carries the server's
   words when it refuses, and says sent only when it took it; the request
   carries no token even when signed in; the Discord door is a stub while the
   invite is empty or wrong, and a real link only when it is a Discord invite.
   At 1600 and at 390.

   Checked against the build from before this change first, where it fails.
   Runnable alone. The browser half is also called from tests/functional.js.
   ============================================================ */
const fs=require('fs'), path=require('path'), vm=require('vm');
const ROOT=process.cwd();
const ENGINE_FILE=path.resolve(ROOT,process.env.ENGINE||'engine.js');
const J=x=>JSON.stringify(x);

function load(src){
 const ctx={module:{exports:{}}, console:console, Promise:Promise, setTimeout:setTimeout};
 vm.createContext(ctx); vm.runInContext(src,ctx,{filename:'engine-copy.js'});
 return ctx.module.exports;}

/* ---------------- the engine half ---------------- */
const env=()=>({kind:'comment',at:'2026-10-02',body:'the compass text overlaps',
 answers:{},band:'median',build:'abc1234',platform:'desktop',viewport:'wide'});
async function engineSuite(E,ok){
 const mem={};
 E.bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
 const reset=()=>{mem[E.OBKEY]='[]';};
 const q=()=>JSON.parse(mem[E.OBKEY]||'[]');

 ok(E.OB_KINDS.indexOf('comment')>=0,'a comment is a kind of its own');
 ok(E.obValidate(env()).ok,'a comment envelope passes the boundary');
 {const v=E.obValidate(Object.assign(env(),{kind:'newsletter'}));
  ok(!v.ok&&v.errs.join().indexOf('comment')>=0&&!/\bfour\b/.test(v.errs.join()),
   'an unknown kind is refused with the kinds named, never counted, '+J(v.errs));}
 {const v=E.obValidate(Object.assign(env(),{tier:'two'}));
  ok(!v.ok&&/tier/.test(v.errs.join()),'the key set stays closed: a tier is refused by name');}
 ok(typeof E.obDrainAsync==='function','the engine carries a drain for a host that answers later');

 reset(); E.bindSend(null);
 ok((await E.obDrainAsync()).state==='empty','an empty queue says empty');
 E.obQueue(env());
 {const d=await E.obDrainAsync();
  ok(d.state==='nohost'&&q().length===1,'with no host it says nohost and keeps the entry');}

 /* a yes */
 reset(); E.obQueue(env()); E.obQueue(env());
 {const got=[];
  E.bindSend(e=>new Promise(r=>setTimeout(()=>{got.push(e.kind);r(true);},5)));
  const d=await E.obDrainAsync();
  ok(d.state==='sent'&&d.n===2&&got.length===2&&q().length===0,
   'a host that answers yes later sends everything and empties the queue, '+J(d));}

 /* a no, carried */
 reset(); E.obQueue(env());
 {E.bindSend(()=>Promise.reject(new Error('Could not reach the server.')));
  const d=await E.obDrainAsync();
  ok(d.state==='retry'&&q().length===1&&/reach the server/.test(d.why||''),
   'a host that answers no keeps the entry and carries its reason, '+J(d));}

 /* it stops at the first no, and what was not tried stays in order */
 reset();
 ['a','b','c'].forEach(t=>E.obQueue(Object.assign(env(),{body:'entry '+t})));
 {let calls=0;
  E.bindSend(()=>{calls++; return Promise.resolve(false);});
  const d=await E.obDrainAsync();
  ok(calls===1&&d.state==='retry'&&J(q().map(x=>x.body))===J(['entry a','entry b','entry c']),
   'the drain stops at the first no and keeps every entry in order, calls '+calls+', '+J(q().map(x=>x.body)));}

 /* an entry queued while the request is out survives the write back */
 reset(); E.obQueue(Object.assign(env(),{body:'first'}));
 {const got=[]; let once=false;
  E.bindSend(e=>new Promise(r=>setTimeout(()=>{ got.push(e.body);
    if(!once){ once=true; E.obQueue(Object.assign(env(),{body:'typed during the wait'})); }
    r(true);},5)));
  const d=await E.obDrainAsync();
  ok(J(got)===J(['first','typed during the wait'])&&q().length===0,
   'an entry queued during the wait is kept and goes in the same pass, sent '+J(got)+', left '+J(q().map(x=>x.body)));
  ok(d.state==='sent'&&d.n===2,'and the pass reports sent for both, never a retry over a clean send, '+J(d));}
 /* and a no is not knocked on again for an entry that arrived during it */
 reset(); E.obQueue(Object.assign(env(),{body:'first'}));
 {let calls=0;
  E.bindSend(()=>{calls++; return new Promise(r=>setTimeout(()=>{
    if(calls===1)E.obQueue(Object.assign(env(),{body:'second'})); r(false);},5));});
  const d=await E.obDrainAsync();
  ok(calls===1&&d.state==='retry'&&J(q().map(x=>x.body))===J(['first','second']),
   'after a no, an entry that arrived during it waits in order and the server is not asked again, calls '+calls+', '+J(q().map(x=>x.body)));}

 /* the newcomer's own pass says no after the first went: the count of what
    went is carried, and the newcomer waits */
 reset(); E.obQueue(Object.assign(env(),{body:'first'}));
 {let calls=0;
  E.bindSend(()=>{calls++; return new Promise(r=>setTimeout(()=>{
    if(calls===1){ E.obQueue(Object.assign(env(),{body:'second'})); r(true); } else r(false);},5));});
  const d=await E.obDrainAsync();
  ok(calls===2&&d.state==='retry'&&d.sent===1&&J(q().map(x=>x.body))===J(['second']),
   'when the second pass says no, the first is counted as sent and the second waits, '+J(d));}

 /* a host that throws instead of answering is a no, not a crash */
 reset(); E.obQueue(env());
 {E.bindSend(()=>{ throw new Error('no fetch in this browser'); });
  const d=await E.obDrainAsync();
  ok(d.state==='retry'&&q().length===1&&/no fetch/.test(d.why||''),
   'a host that throws keeps the entry and carries the reason, '+J(d));}

 /* sent, but the store would not take the shorter list: never told sent */
 reset(); E.obQueue(env());
 {E.bindSend(()=>Promise.resolve(true));
  E.bindStore(k=>mem[k]===undefined?null:mem[k],()=>{ throw new Error('QuotaExceededError'); });
  const d=await E.obDrainAsync();
  E.bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
  ok(d.state==='retry'&&/may send again/.test(d.why||'')&&q().length===1,
   'when storage will not take the write after a send it says so and never says sent, '+J(d));}

 /* two drains at once: the second is told busy and nothing goes twice */
 reset(); E.obQueue(env());
 {let calls=0;
  E.bindSend(()=>{calls++; return new Promise(r=>setTimeout(()=>r(true),10));});
  const [a,b]=await Promise.all([E.obDrainAsync(),E.obDrainAsync()]);
  ok(calls===1&&[a.state,b.state].sort().join()==='busy,sent'&&q().length===0,
   'a second drain while one is out is told busy and nothing is sent twice, calls '+calls+', '+a.state+'/'+b.state);}

 /* the boundary on the way out holds for the async drain too */
 mem[E.OBKEY]=J([Object.assign(env(),{name:'Lance',email:'l@x.com'})]);
 {let reached=0;
  E.bindSend(()=>{reached++; return Promise.resolve(true);});
  const d=await E.obDrainAsync();
  ok(reached===0&&d.state==='refused','an envelope carrying a name never reaches the host, '+J(d));}
 E.bindSend(null);}

const MUTANTS=[
 {what:'the comment kind is taken out',
  from:"var OB_KINDS=['question','bug','rating','feedback','comment'];",
  to:"var OB_KINDS=['question','bug','rating','feedback'];"},
 {what:'an entry queued during the wait is overwritten',
  from:"var tail=obStore().slice(q.length);", to:"var tail=[];"},
 {what:'an entry queued during the wait is left behind and the pass says retry',
  from:"if(tail.length&&!stopped) return obDrainAsync()", to:"if(false) return obDrainAsync()"},
 {what:'two drains may run at once',
  from:"if(OB_DRAINING) return Promise.resolve({state:'busy', n:obCount()});", to:""},
 {what:'the drain keeps knocking after a no',
  from:"if(stopped){ left.push(q[i]); return step(i+1); }", to:""}];

async function countFails(E){
 let f=0; const fails=[];
 try{ await engineSuite(E,(c,m)=>{if(!c){f++; if(fails.length<2)fails.push(m);}}); }
 catch(e){ f++; fails.push('threw: '+((e&&e.message)||e)); }
 return {f,fails};}

async function engineGate(ok,say){
 const src=fs.readFileSync(ENGINE_FILE,'utf8');
 console.log('\n=== FB · the outbox carries a comment and loses nothing on a late send ===');
 /* caught, so an engine missing the drain is a counted failure and the
    browser half still runs, rather than one stack trace ending the gate */
 try{ await engineSuite(load(src),ok); }
 catch(e){ ok(false,'the engine suite threw: '+((e&&e.message)||e)); }
 console.log('\n=== FB · the gate bites ===');
 const base=await countFails(load(src));
 ok(base.f===0,'an unbroken copy loaded the same way passes, '+J(base));
 for(const m of MUTANTS){
  const hits=src.split(m.from).length-1;
  ok(hits===1,'the text to break is in the engine exactly once ('+m.what+'), found '+hits);
  if(hits!==1)continue;
  const r=await countFails(load(src.replace(m.from,m.to)));
  ok(r.f>0,'the suite fails when '+m.what+' ('+r.f+' failures, first: '+(r.fails[0]||'none')+')');
  say&&say('  BITE '+m.what+': '+r.f+' failures');}}

/* ---------------- the surface half ---------------- */
async function feedbackGate(browser,FILE,ok,booted){
 console.log('\n=== FB · Write to us, the outbox, and the Discord door ===');
 for(const [w,h] of [[1600,1000],[390,844]]){
  const ctx=await browser.newContext({viewport:{width:w,height:h}});
  const pg=await ctx.newPage(); const err=[]; pg.on('pageerror',e=>err.push(e.message));
  /* THE SERVER, STUBBED. Nothing leaves the machine: every request to the
     feedback route is answered here in whichever way the step asks for. */
  let mode='down'; const heard=[];
  await pg.route('https://feedback.gate.invalid/feedback',route=>{
   const rq=route.request();
   heard.push({body:rq.postDataJSON(), auth:rq.headers()['authorization']||null});
   if(mode==='down')return route.abort('connectionrefused');
   if(mode==='503')return route.fulfill({status:503,contentType:'application/json',
    body:J({error:'feedback cannot be passed on yet'})});
   return route.fulfill({status:200,contentType:'application/json',body:J({ok:true})});});
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg);
  await pg.evaluate(()=>{FEEDBACK_URL='https://feedback.gate.invalid/feedback';});
  const step=async fn=>pg.evaluate(fn);
  const said=()=>pg.evaluate(()=>{const L=(typeof MSG_LOG!=='undefined'&&MSG_LOG.length)?MSG_LOG[MSG_LOG.length-1]:null;
   return L?{msg:L.msg,kind:L.kind}:{msg:(document.getElementById('status')||{}).textContent||'',kind:null};});
  const at=' at '+w;

  const a=await step(async()=>{
   const wait=ms=>new Promise(r=>setTimeout(r,ms)), $=id=>document.getElementById(id), o={};
   try{localStorage.setItem('source.outbox','[]');}catch(e){}
   loadP(0); ACC_OPEN='help'; setTab(TAB.SETTINGS); renderAccount(); await wait(200);
   o.rows=['achelpc','achelpq','achelpb'].map(id=>{const b=$(id); return b?Math.round(b.getBoundingClientRect().height):0;});
   const pane=document.querySelector('.ac-pane'); o.paneText=pane?pane.innerText:'';
   o.set=typeof COMMUNITY_INVITE!=='undefined'?String(COMMUNITY_INVITE||'').trim():'';
   o.inv=typeof commInvite==='function'?commInvite():null;
   {const l=$('accomm');
    o.door=l?{href:l.getAttribute('href'),target:l.target,rel:l.rel,h:Math.round(l.getBoundingClientRect().height)}:null;}
   if(!$('achelpc'))return o;
   $('achelpc').click(); await wait(150);
   o.open=!$('sheet').hidden;
   o.title=(document.querySelector('#sheet .sh-h')||{}).textContent||'';
   o.kinds=[...document.querySelectorAll('[data-obk]')].map(b=>b.textContent+':'+b.getAttribute('aria-pressed'));
   o.kindH=Math.min(...[...document.querySelectorAll('[data-obk]')].map(b=>b.getBoundingClientRect().height));
   o.warn=!!document.querySelector('#sheet .ob-warn');
   o.disclose=(document.querySelector('#sheet .sh-p.dim')||{}).textContent||'';
   $('obtext').value='the release timer reads wrong on the phone';
   document.querySelector('[data-obk="question"]').click(); await wait(100);
   o.switched=(document.querySelector('#sheet .sh-h')||{}).textContent||'';
   o.kept=$('obtext').value;
   document.querySelector('[data-obk="comment"]').click(); await wait(100);
   o.back=(document.querySelector('#sheet .sh-h')||{}).textContent||'';
   o.overflow=document.documentElement.scrollWidth>innerWidth+1;
   return o;});
  ok(a.rows.length===3&&a.rows.every(x=>x>=44),'Help carries comment, question and something broken, every button at the 44px floor'+at+', '+J(a.rows));
  /* THE DOOR FOLLOWS THE INVITE THE BUILD SHIPS, NEVER A COPY OF IT. This
     check read "with no invite link the Discord row is a stub" from the day it
     was written, when COMMUNITY_INVITE was empty, and went red on both widths
     the day the owner pasted his real invite in. The product was right and
     the gate was holding a copy of a setting, which is the same defect as a
     count typed into a document. So the expectation is read off the page: set,
     the row is a door to exactly what commInvite() returns; empty, it is the
     stub. A set invite that commInvite() refuses fails here on purpose,
     because then a build carrying his link has lost the doorway he asked for.
     The stub is held further down with the invite taken away before Help
     opens, so neither state rests on whichever one main happens to carry. */
  ok(a.set
    ? !!a.inv&&!!a.door&&a.door.href===a.inv&&a.door.target==='_blank'&&/noopener/.test(a.door.rel)
      &&a.door.h>=44&&!/not open yet/.test(a.paneText)
    : !a.door&&/Talk to other people who use this\s*not open yet/.test(a.paneText),
   (a.set?'with the invite this build ships, the Discord row is a door to what commInvite() gives, in a new tab with noopener, at the 44px floor, and never reads not open yet'
    :'with no invite in this build the Discord row is a stub reading not open yet, and no link')+at+', '+J({inv:a.inv,door:a.door}));
  ok(/Discord is a free chat app/.test(a.paneText),'and Discord is said in plain words beside it'+at);
  ok(a.open&&a.title==='Leave a comment','Leave a comment opens the sheet on a comment'+at+', '+a.title);
  ok(J(a.kinds)===J(['Comment:true','Question:false','Something broken:false'])&&a.kindH>=44,
   'the sheet offers the three kinds with comment pressed, at the 44px floor'+at+', '+J(a.kinds)+' '+a.kindH);
  ok(a.switched==='Ask a question'&&a.kept==='the release timer reads wrong on the phone'&&a.back==='Leave a comment',
   'switching the kind keeps what was typed'+at+', '+J({switched:a.switched,kept:a.kept}));
  ok(a.warn&&/Discord/.test(a.disclose)&&/Nothing about who you are/.test(a.disclose),
   'the sheet says where it goes and that nothing about the person goes with it, before anybody types'+at);
  ok(!a.overflow,'no sideways scroll with the sheet open'+at);
  /* nothing past here can be measured without the sheet, so a build with no
     comment door stops this width on a named failure and not on a stack */
  if(!a.open){ ok(false,'the rest of this width needs the comment sheet open'+at); await ctx.close(); continue; }

  /* server down: held, and said as held */
  mode='down';
  await step(()=>{document.getElementById('obsend').click();});
  await pg.waitForTimeout(600);
  const b1=await said();
  const s1=await step(()=>{const q=JSON.parse(localStorage.getItem('source.outbox')||'[]');
   return {n:q.length, e:q[0], keys:q[0]?Object.keys(q[0]).sort():[], want:OB_KEYS.slice().sort(),
    build:(typeof BUILD_ID!=='undefined'&&BUILD_ID)||'alpha', shut:document.getElementById('sheet').hidden,
    row:(document.querySelector('.ac-pane')||{}).innerText||'', retry:!!document.getElementById('acobsend')};});
  ok(s1.n===1&&s1.e.kind==='comment'&&s1.e.body==='the release timer reads wrong on the phone',
   'Send holds the comment on this device'+at+', '+J(s1.e));
  ok(J(s1.keys)===J(s1.want)&&/^\d{4}-\d{2}-\d{2}$/.test(s1.e.at)&&s1.e.build===s1.build,
   'the entry carries exactly the envelope keys, the day and the build stamp'+at+', '+J(s1.keys));
  ok(/Held on this device/.test(b1.msg)&&!/^Sent/.test(b1.msg)&&b1.kind==='fail'&&/reach the server/.test(b1.msg),
   'with the server down it says held, with the reason, and never sent'+at+', '+J(b1));
  ok(s1.shut&&/1 waiting/.test(s1.row)&&s1.retry,'the sheet shuts, the outbox reads 1 waiting and offers Send now'+at);

  /* the server refuses: its words are carried and the entry stays */
  mode='503';
  await step(()=>{document.getElementById('acobsend').click();});
  await pg.waitForTimeout(600);
  const b2=await said();
  const n2=await step(()=>JSON.parse(localStorage.getItem('source.outbox')||'[]').length);
  ok(/Feedback cannot be passed on yet/.test(b2.msg)&&/Held on this device/.test(b2.msg)&&n2===1,
   'a refusal from the server is said in its words and the entry stays'+at+', '+J(b2));

  /* the server takes it, from a signed in browser, and no token goes with it */
  mode='ok';
  await step(()=>{AUTH_S={token:'tok-for-the-gate',email:'gate@example.com'}; AUTH_READ=true;
   renderAccount(); document.getElementById('acobsend').click();});
  await pg.waitForTimeout(600);
  const b3=await said();
  const s3=await step(()=>({n:JSON.parse(localStorage.getItem('source.outbox')||'[]').length,
   row:(document.querySelector('.ac-pane')||{}).innerText||''}));
  const last=heard[heard.length-1]||{};
  ok(b3.msg==='Sent. Thank you.'&&b3.kind==='ok'&&s3.n===0&&/Nothing waiting/.test(s3.row),
   'only when the server takes it does it say sent, and the outbox empties'+at+', '+J(b3));
  ok(last.body&&last.body.kind==='comment'&&last.auth===null,
   'the request carries the comment and no token, even signed in'+at+', '+J({kind:last.body&&last.body.kind,auth:last.auth}));
  await step(()=>{AUTH_S=null;});

  /* a mail address is refused at the boundary and nothing is queued */
  const before=heard.length;
  const c=await step(async()=>{
   const wait=ms=>new Promise(r=>setTimeout(r,ms)), $=id=>document.getElementById(id);
   obCompose('bug'); await wait(100);
   $('obtext').value='mail me at lance@example.com'; $('obsend').click(); await wait(200);
   return {open:!$('sheet').hidden, n:JSON.parse(localStorage.getItem('source.outbox')||'[]').length};});
  const b4=await said();
  ok(c.open&&c.n===0&&/identifies you/.test(b4.msg)&&heard.length===before,
   'a mail address in the text is refused by name, the sheet stays open, and nothing is queued or sent'+at);
  await step(()=>sheetShut());

  /* the Discord door, with a link and with wrong ones */
  const d=await step(async()=>{
   const wait=ms=>new Promise(r=>setTimeout(r,ms)), o={};
   const look=()=>{const a=document.getElementById('accomm');
    return a?{href:a.getAttribute('href'),target:a.target,rel:a.rel,h:Math.round(a.getBoundingClientRect().height),txt:a.textContent}:null;};
   COMMUNITY_INVITE='https://discord.gg/atunedGate'; renderAccount(); await wait(80); o.good=look();
   COMMUNITY_INVITE='http://discord.gg/atunedGate'; renderAccount(); await wait(80); o.http=look();
   COMMUNITY_INVITE='https://evil.example/discord.gg/x'; renderAccount(); await wait(80); o.other=look();
   COMMUNITY_INVITE='  '; renderAccount(); await wait(80); o.blank=look();
   COMMUNITY_INVITE=''; renderAccount();
   return o;});
  ok(d.good&&d.good.href==='https://discord.gg/atunedGate'&&d.good.target==='_blank'&&/noopener/.test(d.good.rel)&&d.good.h>=44,
   'a Discord invite becomes a door that opens in a new tab, at the 44px floor'+at+', '+J(d.good));
  ok(!d.http&&!d.other&&!d.blank,'a plain http link, another site, or blank never becomes a door'+at);

  /* THE STUB, WITH THE INVITE TAKEN AWAY BEFORE THE PANE OPENS. The door step
     above swaps the invite under a pane that is already open. This is the
     other order, the one a build shipped empty or wrong actually has: Settings
     is left, the invite is set, and Help opens on it fresh. COMMUNITY_INVITE
     is a var at the top of a concatenated classic script, so the assignment
     lands on the same binding commInvite() reads, and inv is asserted empty
     to show it did: if it ever stopped landing, the shipped invite would come
     back, the row would be a door, and this fails instead of passing on
     nothing. The malformed one is the boundary commInvite() exists for, so it
     must come out as the same stub and never as a link to somewhere else. */
  const stub=await step(async()=>{
   const wait=ms=>new Promise(r=>setTimeout(r,ms));
   const open=async v=>{
    setTab(TAB.FIELD); COMMUNITY_INVITE=v; ACC_OPEN='help'; setTab(TAB.SETTINGS); await wait(80);
    const row=[...document.querySelectorAll('.ac-pane .ac-row')].find(r=>/Talk to other people who use this/.test(r.textContent));
    return {inv:commInvite(), txt:row?row.innerText:'', link:!!(row&&row.querySelector('a'))||!!document.getElementById('accomm')};};
   return {empty:await open(''), bad:await open('http://evil.example/x')};});
  for(const [k,how] of [['empty','with the invite cleared'],['bad','with a malformed invite, http://evil.example/x,']])
   ok(stub[k].inv===''&&/Talk to other people who use this\s*not open yet/.test(stub[k].txt)&&!stub[k].link,
    how+' before Help opens, the Discord row is a stub reading not open yet, and no link'+at+', '+J(stub[k]));
  ok(err.length===0,'no page errors'+at+', '+err.join(' | '));
  await ctx.close();}}
module.exports={engineGate, engineSuite, feedbackGate};

if(require.main===module){
 let PASS=0,FAIL=0;
 const ok=(c,m)=>{ if(c){PASS++; console.log('  ok   '+m);} else {FAIL++; console.log('  FAIL '+m);} };
 (async()=>{
  await engineGate(ok,console.log);
  if(!process.env.FB_NO_BROWSER){
   const {chromium}=require('playwright');
   const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
   const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
    try{ await p.waitForTimeout(600);
     await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
     await p.waitForTimeout(150);}catch(e){}};
   const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
   try{ await feedbackGate(browser,FILE,ok,booted); }catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
   await browser.close();}
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
